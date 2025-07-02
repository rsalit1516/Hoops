using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Repository;
using Hoops.Infrastructure.Data;

namespace Hoops.Data.Seeders
{
    public class WebContentSeeder : ISeeder<WebContent>
    {
        public hoopsContext context { get; private set; }
        private readonly IWebContentRepository _webContentRepository;
        private readonly IWebContentTypeRepository webContentTypeRepo;

        public WebContentSeeder(IWebContentRepository webContentRepository, hoopsContext context)
        {
            this.context = context;
            _webContentRepository = webContentRepository;
            webContentTypeRepo = new WebContentTypeRepository(context);
        }

        public async Task SeedAsync()
        {
            var _webContentRepositoryType = webContentTypeRepo;
            var seasonInfo = await _webContentRepositoryType.GetByDescriptionAsync("Season Info");
            var meeting = await _webContentRepositoryType.GetByDescriptionAsync("Meeting");
            // var _webContentRepository = webContentRepo;


            var webContents = new List<WebContent>
            {
                new WebContent
                {
                     CompanyId = 1,
                Page = "1",
                WebContentTypeId = seasonInfo.WebContentTypeId,
                Title = "Second Test",
                ContentSequence = 2,
                SubTitle = "Second Subtitle",
                Location = "Mullins",
                DateAndTime = "7AM",
                Body = "I ain't go no body",
                ExpirationDate = DateTime.Now.AddDays(30)
                },
                new WebContent
                {
                     CompanyId = 1,
                Page = "1",
                WebContentTypeId = seasonInfo.WebContentTypeId,
                Title = "First Test",
                ContentSequence = 1,
                SubTitle = "First Subtitle",
                Location = "Mullins",
                DateAndTime = "6AM",
                Body = "I ain't go no body",
                ExpirationDate = DateTime.Now.AddDays(30)
                },
                new WebContent
                {
                     CompanyId = 1,
                Page = "1",
                WebContentTypeId = meeting.WebContentTypeId,
                Title = "Meeting",
                ContentSequence = 1,
                SubTitle = "Meet by the school",
                Location = "Mullins Hall",
                DateAndTime = "7PM",
                Body = "Meeting info",
                ExpirationDate = DateTime.Now.AddDays(30)

                },
                new WebContent
                {
                CompanyId = 1,
                Page = "1",
                WebContentTypeId = seasonInfo.WebContentTypeId,
                Title = "Second Test",
                ContentSequence = 1,
                SubTitle = "Second Subtitle",
                Location = "Mullins",
                DateAndTime = "7AM",
                Body = "I ain't go no body",
                ExpirationDate = DateTime.Now.AddDays(-3)
                },
                new WebContent
                {
                CompanyId = 1,
                Page = "2",
                WebContentTypeId = seasonInfo.WebContentTypeId,
                Title = "Expired Test",
                ContentSequence = 1,
                SubTitle = "Expired Subtitle",
                Location = "Mullins",
                DateAndTime = "7AM",
                Body = "I ain't go no body",
                ExpirationDate = DateTime.Now.AddDays(-60)
                }
            };

            foreach (var content in webContents)
            {
                await _webContentRepository.InsertAsync(content);
            }
            context.SaveChanges();
        }
    }
}

