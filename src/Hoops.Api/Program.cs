using System;
using Hoops.Data;
using Hoops.Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NLog.Web;

namespace Hoops.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var logger = NLogBuilder.ConfigureNLog("nlog.config").GetCurrentClassLogger();
            try
            {
                logger.Debug("init main");

                var host = CreateHostBuilder(args).Build();

                using (var scope = host.Services.CreateScope())
                {
                    var services = scope.ServiceProvider;
                    var env = services.GetRequiredService<IHostEnvironment>();

                    if (env.IsEnvironment("Local"))
                    {
                        var context = services.GetRequiredService<hoopsContext>();
                        // var personLogger = services.GetRequiredService<ILogger<PersonRepository>>();
                        var seeder = services.GetRequiredService<Seed>();
                        seeder.InitializeDataAsync().Wait(); // or GetAwaiter().GetResult()

                    }
                }

                host.Run();
            }
            catch (Exception exception)
            {
                logger.Error(exception, "Stopped program because of exception");
                throw;
            }
            finally
            {
                NLog.LogManager.Shutdown();
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
