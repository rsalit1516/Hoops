using System;
using System.IO;
using System.Reflection;
using Hoops.Infrastructure.Repository;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Hoops.Infrastructure.Data;

namespace Hoops.Api
{
    public class Startup
    {
        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Environment = env;
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public IWebHostEnvironment Environment { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //services
            //    .AddDbContext<hoopsContext>(options =>
            //        options
            //            .UseSqlServer(Configuration
            //                .GetConnectionString("hoopsContext")));
            if (Environment.IsDevelopment())
            {
                services
                    .AddDbContext<hoopsContext>(options =>
                        options
                            .UseSqlServer(Configuration
                                .GetConnectionString("hoopsContext"),
                            builder =>
                            {
                                builder.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null);
                            }));
            }
            else
            {
                services
                    .AddDbContext<hoopsContext>(options =>
                        options
                           .UseSqlServer(Configuration
                                .GetConnectionString("hoopsContext"),
                            builder =>
                            {
                                builder.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null);
                            }));
            }

            services.AddTransient<hoopsContext>();
            services.AddTransient<ISeasonRepository, SeasonRepository>();
            services.AddTransient<IDivisionRepository, DivisionRepository>();
            services.AddScoped<IRepository<User>, UserRepository>();
            services.AddTransient<IDirectorRepository, DirectorRepository>();
            services.AddTransient<ITeamRepository, TeamRepository>();
            services.AddTransient<IColorRepository, ColorRepository>();
            services.AddTransient<IScheduleGameRepository, ScheduleGameRepository>();
            services.AddTransient<ISchedulePlayoffRepository, SchedulePlayoffRepository>();
            services.AddTransient<IWebContentRepository, WebContentRepository>();
            services.AddTransient<IWebContentTypeRepository, WebContentTypeRepository>();
            services.AddTransient<ISponsorRepository, SponsorRepository>();
            _ = services.AddTransient<ILocationRepository, LocationRepository>();

            services.AddCors(options =>
                   {
                       options.AddPolicy(name: MyAllowSpecificOrigins,
                                         builder =>
                                         {
                                             builder.WithOrigins("http://localhost:4200",
                                                                 "http://localhost50364",
                                                                 "https://csbchoops.com")
                                              .AllowAnyHeader()
                                        .AllowAnyMethod();
                                         });
                   });
            services.AddControllers();
            services
                .AddSwaggerGen(c =>
                {
                    c
                        .SwaggerDoc("v1",
                        new OpenApiInfo
                        {
                            Version = "v1",
                            Title = "CSBC Server API",
                            Description = "CSBC web site back end",
                            TermsOfService =
                                new Uri("https://example.com/terms"),
                            Contact =
                                new OpenApiContact
                                {
                                    Name = "Richard Salit",
                                    Email = string.Empty,
                                    Url = new Uri("https://twitter.com/rsalit")
                                },
                            License =
                                new OpenApiLicense
                                {
                                    Name = "Use under LICX",
                                    Url = new Uri("https://example.com/license")
                                }
                        });

                    // services..AddSwaggerDocument();
                    // Set the comments path for the Swagger JSON and UI.
                    var xmlFile =
                        $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                    var xmlPath =
                        Path.Combine(AppContext.BaseDirectory, xmlFile);
                    // c.IncludeXmlComments(xmlPath);
                });
            services.AddControllers();

            // call data initializer
            //var seed = new Seed();
            //await seed.InitializeDataAsync();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app
                .UseSwaggerUI(c =>
                {
                    c
                        .SwaggerEndpoint("/swagger/v1/swagger.json",
                        "CSBC Server API V1");
                    c.RoutePrefix = string.Empty;
                });

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors(MyAllowSpecificOrigins);
            app.UseAuthorization();

            app
                .UseEndpoints(endpoints =>
                {
                    endpoints.MapControllers();
                });
        }
    }
}
