using Microsoft.Extensions.DependencyInjection;
using Hoops.Data.Seeders;

namespace Hoops.Data
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddHoopsSeeders(this IServiceCollection services)
        {
            services.AddScoped<SeedCoordinator>();
            services.AddScoped<ColorSeeder>();
            services.AddScoped<SeasonSeeder>();
            services.AddScoped<DivisionSeeder>();
            services.AddScoped<TeamSeeder>();
            services.AddScoped<LocationSeeder>();
            services.AddScoped<ScheduleGameSeeder>();
            services.AddScoped<HouseholdAndPeopleSeeder>();
            services.AddScoped<WebContentSeeder>();
            services.AddScoped<WebContentTypeSeeder>();
            return services;
        }
    }
}