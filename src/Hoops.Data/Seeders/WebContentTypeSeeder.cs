using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Repository;
using Hoops.Infrastructure.Data;

namespace Hoops.Data.Seeders
{
    public class WebContentTypeSeeder : ISeeder<WebContentType>
    {
        public hoopsContext context { get; private set; }
        private readonly IWebContentTypeRepository _webContentTypeRepo;

        public WebContentTypeSeeder(IWebContentTypeRepository webContentTypeRepo, hoopsContext context)
        {
            this.context = context;
            _webContentTypeRepo = webContentTypeRepo;
        }

        public async Task DeleteAllAsync()
        {
            var records = await _webContentTypeRepo.GetAllAsync();
            foreach (var record in records)
                await _webContentTypeRepo.DeleteAsync(record.WebContentTypeId);
        }
        public async Task SeedAsync()
        {
            var webContentTypes = new List<WebContentType>
            {
                new WebContentType
                {
                     WebContentTypeDescription = "Meeting"
                },
                new WebContentType
                {
                      WebContentTypeDescription = "Season Info"
                }
            };

            foreach (var content in webContentTypes)
            {
                await _webContentTypeRepo.InsertAsync(content);
            }
            context.SaveChanges();
        }
    }
}

