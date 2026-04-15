using Azure.Data.Tables;
using Azure.Storage.Blobs;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Repository;
using Hoops.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Hoops.Infrastructure
{
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Registers BlobServiceClient, TableServiceClient, and IDocumentStorageService.
        /// Pass the Azure Storage connection string (or "UseDevelopmentStorage=true" locally).
        /// </summary>
        public static IServiceCollection AddHoopsDocumentStorage(
            this IServiceCollection services,
            string connectionString)
        {
            services.AddSingleton(new BlobServiceClient(connectionString));
            services.AddSingleton(new TableServiceClient(connectionString));
            services.AddScoped<IDocumentStorageService, DocumentStorageService>();
            return services;
        }

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
            services.AddScoped<IPlayerRepository, PlayerRepository>();
            // services.AddScoped<ICommentRepository, CommentRepository>();

            return services;
        }
    }
}