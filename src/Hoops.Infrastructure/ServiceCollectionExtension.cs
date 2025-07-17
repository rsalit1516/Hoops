using Microsoft.Extensions.DependencyInjection;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Repository;

namespace Hoops.Infrastructure
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddHoopsRepositories(this IServiceCollection services)
        {
            services.AddScoped<ISeasonRepository, SeasonRepository>();
            services.AddScoped<IDivisionRepository, DivisionRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IDirectorRepository, DirectorRepository>();
            services.AddScoped<ITeamRepository, TeamRepository>();
            services.AddScoped<IColorRepository, ColorRepository>();
            services.AddScoped<IScheduleGameRepository, ScheduleGameRepository>();
            services.AddScoped<ISchedulePlayoffRepository, SchedulePlayoffRepository>();
            services.AddScoped<IWebContentRepository, WebContentRepository>();
            services.AddScoped<IWebContentTypeRepository, WebContentTypeRepository>();
            services.AddScoped<ISponsorRepository, SponsorRepository>();
            services.AddScoped<IPersonRepository, PersonRepository>();
            services.AddScoped<ILocationRepository, LocationRepository>();
            services.AddScoped<IHouseholdRepository, HouseholdRepository>();
            services.AddScoped<IScheduleDivTeamsRepository, ScheduleDivTeamsRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<ICommentRepository, CommentRepository>();

            return services;
        }
    }
}