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
using Microsoft.Extensions.Logging;
using Hoops.Data;
using Hoops.Infrastructure;

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
            var conn = Configuration.GetConnectionString("hoopsContext");
            Console.WriteLine($"[DEBUG] Connection string loaded: {(string.IsNullOrEmpty(conn) ? "NULL" : "FOUND")}");

            services.AddDbContext<hoopsContext>(options =>
                options.UseSqlServer(
                    Configuration.GetConnectionString("hoopsContext"),
                    builder => builder.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null)));

            _ = services.AddDbContext<hoopsContext>();
            _ = services.AddHoopsRepositories();
            _ = services.AddHoopsSeeders();

            _ = services.AddCors(options =>
                   {
                       options.AddPolicy(name: MyAllowSpecificOrigins,
                                         builder =>
                                         {
                                             _ = builder.WithOrigins("http://localhost:4200",
                                                                 "http://localhost50364",
                                                                 "https://csbchoops.com",
                                                                 "https://thankful-pond-090ec730f.4.azurestaticapps.net")
                                              .AllowAnyHeader()
                                        .AllowAnyMethod();
                                         });
                   });
            _ = services.AddLogging();
            _ = services.AddControllers().AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });
            _ = services
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
            _ = services.AddControllers();


            // {
            //     _ = services.AddSwaggerGen(c =>
            //     {
            //         c.SwaggerDoc("v1", new OpenApiInfo { Title = "Hoops API", Version = "v1" });
            //         c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, "Hoops.Api.xml"));
            //     });
            // }
            // else
            // {
            //     _ = services.AddSwaggerGen(c =>
            //     {
            //         c.SwaggerDoc("v1", new OpenApiInfo { Title = "Hoops API", Version = "v1" });
            //     });
            // }
            // call data initializer
            //var seed = new Seed();
            //await seed.InitializeDataAsync();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                _ = app.UseDeveloperExceptionPage();
            }

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            _ = app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            _ = app
                .UseSwaggerUI(c =>
                {
                    c
                        .SwaggerEndpoint("/swagger/v1/swagger.json",
                        "CSBC Server API V1");
                    c.RoutePrefix = string.Empty;
                });

            _ = app.UseHttpsRedirection();
            _ = app.UseRouting();
            _ = app.UseCors(MyAllowSpecificOrigins);
            _ = app.UseAuthorization();

            _ = app
                .UseEndpoints(endpoints =>
                {
                    _ = endpoints.MapControllers();
                });
        }
    }
}
