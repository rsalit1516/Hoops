using Microsoft.Extensions.DependencyInjection;
using Hoops.Data.Seeders;

namespace Hoops.Data
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddHoopsSeeders(this IServiceCollection services)
        {
            services.AddScoped<SeedCoordinator>();
            services.AddScoped<DirectorSeeder>();
            services.AddScoped<ColorSeeder>();
            services.AddScoped<LocationSeeder>();
            services.AddScoped<SeasonSeeder>();
            services.AddScoped<DivisionSeeder>();
            services.AddScoped<TeamSeeder>();
            services.AddScoped<ScheduleDivTeamsSeeder>();
            services.AddScoped<ScheduleGameSeeder>();
            services.AddScoped<SchedulePlayoffSeeder>();
            services.AddScoped<HouseholdAndPeopleSeeder>();
            services.AddScoped<UserSeeder>();
            services.AddScoped<WebContentSeeder>();
            services.AddScoped<WebContentTypeSeeder>();
            return services;
        }
    }
}