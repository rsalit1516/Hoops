using System;
using System.Net;
using Azure.Identity;
using Hoops.Application.Services;
using Hoops.Core.Interface;
using Hoops.Data;
using Hoops.Functions.Utils;
using Hoops.Infrastructure;
using Hoops.Infrastructure.Data;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Middleware;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

var host = new HostBuilder()
    // OpenAPI extension auto-registers endpoints when the package is referenced.
    // Default endpoints:
    //  - /api/swagger/ui
    //  - /api/swagger.json (v2)
    //  - /api/openapi/v3.json (v3)
    .ConfigureFunctionsWorkerDefaults(worker =>
    {
        // Register authentication middleware to validate hoops.auth cookie
        worker.UseMiddleware<AuthenticationMiddleware>();
    })
    .ConfigureAppConfiguration((context, config) =>
    {
        var env = context.HostingEnvironment;
        config.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
              .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true, reloadOnChange: true)
              .AddEnvironmentVariables();

        if (env.IsDevelopment())
        {
            // Optional: user secrets for local
            config.AddUserSecrets(typeof(Program).Assembly, optional: true);
        }

        // Azure Key Vault (optional at startup; don't fail host if access is not yet granted)
        var built = config.Build();
        var keyVaultUri = built["KeyVaultUri"] ?? built["Hoops-Dev-KV:Uri"]; // support either format
        if (!string.IsNullOrWhiteSpace(keyVaultUri))
        {
            try
            {
                var credential = new DefaultAzureCredential();
                config.AddAzureKeyVault(new Uri(keyVaultUri), credential);
            }
            catch (Exception ex)
            {
                // Log and continue; the app can run with env/appsettings values while identity/permissions are configured
                Console.WriteLine($"Warning: Failed to add Azure Key Vault configuration from '{keyVaultUri}'. Continuing without Key Vault. Details: {ex.Message}");
            }
        }
    })
    .ConfigureServices((context, services) =>
    {
        var configuration = context.Configuration;

        // EF Core DbContext (centralized connection selection with a safe demo toggle)
        // Toggle via env/config: USE_PROD_DATA=true will prefer a read-only production connection string
        var useProdData = string.Equals(configuration["USE_PROD_DATA"], "true", StringComparison.OrdinalIgnoreCase);

        // Prefer ConnectionStrings entries; fall back to flat env vars if present
        var devConn = configuration.GetConnectionString("hoopsContext")
                      ?? configuration["SQL_CONNECTION_DEV"];
        var prodRoConn = configuration.GetConnectionString("hoopsContextProdRO")
                         ?? configuration["SQL_CONNECTION_PROD_RO"];

        var selectedName = useProdData ? "ConnectionStrings:hoopsContextProdRO|SQL_CONNECTION_PROD_RO" : "ConnectionStrings:hoopsContext|SQL_CONNECTION_DEV";
        var conn = useProdData ? prodRoConn : devConn;

        // Audit interceptor — scoped so it can access the per-request AuthContext
        services.AddScoped<AuditInterceptor>();
        // Register AuthContext as both itself and IAuditContext (same instance per scope)
        services.AddScoped<AuthContext>();
        services.AddScoped<IAuditContext>(sp => sp.GetRequiredService<AuthContext>());

        if (string.IsNullOrWhiteSpace(conn))
        {
            Console.WriteLine($"Warning: No SQL connection string resolved for '{selectedName}'. Using in-memory database to allow Function host startup. Some endpoints may not function until the connection is configured.");
            services.AddDbContext<hoopsContext>((sp, options) =>
                options.UseInMemoryDatabase("hoops-fallback")
                       .AddInterceptors(sp.GetRequiredService<AuditInterceptor>()));
        }
        else
        {
            Console.WriteLine($"Info: Using {(useProdData ? "READ-ONLY PROD" : "DEV")} SQL connection (configured from {selectedName}).");
            services.AddDbContext<hoopsContext>((sp, options) =>
                options.UseSqlServer(conn, sql => sql.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null))
                       .AddInterceptors(sp.GetRequiredService<AuditInterceptor>()));
        }

        services.AddHoopsRepositories();
        services.AddHoopsSeeders();

        // Azure Storage (Blob + Table) for document management
        // Dev/local: hoopsstoragedev storage account (or Azurite emulator when value is "UseDevelopmentStorage=true")
        // Prod:      hoopsstorprod storage account (connection string in Key Vault)
        var storageConn = configuration["StorageConnectionString"]
                          ?? configuration.GetConnectionString("StorageConnectionString")
                          ?? configuration["AZURE_STORAGE_CONNECTION_STRING"]
                          ?? "UseDevelopmentStorage=true";
        services.AddHoopsDocumentStorage(storageConn);

        // Application services
        services.AddScoped<ISeasonService, SeasonService>();
        services.AddScoped<IPlayerService, PlayerService>();

        // Logging
        services.AddLogging(builder =>
        {
            builder.SetMinimumLevel(LogLevel.Information);
        });
    })
    .Build();

// Seed local database on startup when explicitly requested.
// Gate: Development environment + USE_PROD_DATA=false + SEED_DB=yes + relational DB configured
// SEED_DB is set by the "Start Functions (Local)" VS Code task via a pickString prompt.
using (var scope = host.Services.CreateScope())
{
    var env = scope.ServiceProvider.GetRequiredService<IHostEnvironment>();
    var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    var useProdData = string.Equals(config["USE_PROD_DATA"], "true", StringComparison.OrdinalIgnoreCase);
    var seedDb = string.Equals(config["SEED_DB"], "yes", StringComparison.OrdinalIgnoreCase);

    if (env.IsDevelopment() && !useProdData && seedDb)
    {
        var db = scope.ServiceProvider.GetRequiredService<hoopsContext>();
        var isInMemory = db.Database.ProviderName == "Microsoft.EntityFrameworkCore.InMemory";

        if (isInMemory)
        {
            Console.WriteLine("Warning: SEED_DB=yes but no SQL connection string is configured — skipping seed. Set hoopsContext in ConnectionStrings (local.settings.json) and ensure SQL Server is running.");
        }
        else
        {
            Console.WriteLine("SEED_DB=yes — wiping and re-seeding local database...");
            var seeder = scope.ServiceProvider.GetRequiredService<SeedCoordinator>();
            await seeder.InitializeDataAsync();
            Console.WriteLine("Database seeding complete.");
        }
    }
    else if (env.IsDevelopment() && !useProdData)
    {
        Console.WriteLine("Skipping database seed (SEED_DB != yes). Re-run the VS Code task and choose 'Yes' to refresh.");
    }
}

await host.RunAsync();
