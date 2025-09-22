using System;
using System.Net;
using Azure.Identity;
using Hoops.Application.Services;
using Hoops.Core.Interface;
using Hoops.Data;
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
    .ConfigureFunctionsWorkerDefaults()
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

        if (string.IsNullOrWhiteSpace(conn))
        {
            Console.WriteLine($"Warning: No SQL connection string resolved for '{selectedName}'. Using in-memory database to allow Function host startup. Some endpoints may not function until the connection is configured.");
            services.AddDbContext<hoopsContext>(options => options.UseInMemoryDatabase("hoops-fallback"));
        }
        else
        {
            Console.WriteLine($"Info: Using {(useProdData ? "READ-ONLY PROD" : "DEV")} SQL connection (configured from {selectedName}).");
            services.AddDbContext<hoopsContext>(options =>
                options.UseSqlServer(conn, sql => sql.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null)));
        }

        services.AddHoopsRepositories();
        services.AddHoopsSeeders();

        // Application services
        services.AddScoped<ISeasonService, SeasonService>();

        // Logging
        services.AddLogging(builder =>
        {
            builder.SetMinimumLevel(LogLevel.Information);
        });
    })
    .Build();

await host.RunAsync();
