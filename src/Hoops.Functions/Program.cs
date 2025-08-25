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

        // Azure Key Vault (match existing API behavior in Development environment)
        var built = config.Build();
        var keyVaultUri = built["KeyVaultUri"] ?? built["Hoops-Dev-KV:Uri"]; // support either format
        if (!string.IsNullOrWhiteSpace(keyVaultUri))
        {
            var credential = new DefaultAzureCredential();
            config.AddAzureKeyVault(new Uri(keyVaultUri), credential);
        }
    })
    .ConfigureServices((context, services) =>
    {
        var configuration = context.Configuration;

        // EF Core DbContext
        var conn = configuration.GetConnectionString("hoopsContext");
        services.AddDbContext<hoopsContext>(options =>
            options.UseSqlServer(conn, sql => sql.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null)));

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
