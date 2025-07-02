using Microsoft.Extensions.DependencyInjection;
using Hoops.Data.Seeders;

namespace Hoops.Data
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddHoopsSeeders(this IServiceCollection services)
        {
            services.AddScoped<SeedCoordinator>();
            services.AddScoped<WebContentSeeder>();
            // ...add other seeders...
            return services;
        }
    }
}