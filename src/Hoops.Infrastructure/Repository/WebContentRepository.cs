using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Hoops.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Infrastructure.Repository
{
    public class WebContentRepository : EFRepository<WebContent>, IWebContentRepository
    {
        public WebContentRepository(hoopsContext context)
            : base(context) { }

        public async Task<IEnumerable<WebContentVm>> GetAllAsync(int companyId)
        {
            return await context
                .WebContents
                .GroupJoin(
                    context.WebContentTypes,
                    content => content.WebContentTypeId,
                    contentType => contentType.WebContentTypeId,
                    (content, contentTypes) => new { content, contentTypes }
                )
                .SelectMany(
                    x => x.contentTypes.DefaultIfEmpty(),
                    (x, contentType) => new { x.content, contentType }
                )
                .Where(result => result.content.CompanyId == companyId)
                .Select(z => new WebContentVm
                {
                    WebContentId = z.content.WebContentId,
                    ContentSequence = z.content.ContentSequence ?? 0,
                    Title = z.content.Title,
                    SubTitle = z.content.SubTitle,
                    Body = z.content.Body,
                    DateAndTime = z.content.DateAndTime,
                    Location = z.content.Location,
                    WebContentTypeDescription = z.contentType != null ? z.contentType.WebContentTypeDescription : string.Empty,
                    ExpirationDate = z.content.ExpirationDate.HasValue
                        ? z.content.ExpirationDate.Value.Date
                        : DateTime.Now,
                })
                .OrderByDescending(e => e.ExpirationDate)
                .OrderBy(s => s.ContentSequence)
                .ToListAsync();
        }

        public async Task<IEnumerable<WebContentVm>> GetActiveWebContentAsync(int companyId)
        {
            return await context
                .WebContents.Join(
                    context.WebContentTypes,
                    content => content.WebContentTypeId,
                    contentType => contentType.WebContentTypeId,
                    (content, contentType) => new { content, contentType }
                )
                .Where(result => result.content.CompanyId == companyId)
                .Where(result => result.content.ExpirationDate >= DateTime.Now)
                .Select(z => new WebContentVm
                {
                    WebContentId = z.content.WebContentId,
                    ContentSequence = z.content.ContentSequence ?? 0,
                    Title = z.content.Title,
                    SubTitle = z.content.SubTitle,
                    Body = z.content.Body,
                    DateAndTime = z.content.DateAndTime,
                    Location = z.content.Location,
                    WebContentTypeDescription = z.contentType.WebContentTypeDescription,
                    ExpirationDate = z.content.ExpirationDate.HasValue
                        ? z.content.ExpirationDate.Value.Date
                        : DateTime.Now,
                })
                .OrderByDescending(e => e.ExpirationDate)
                .OrderBy(s => s.ContentSequence)
                .ToListAsync();
        }

        public override WebContent Update(WebContent entity)
        {
            var dbEntityEntry = context.Entry(entity);
            entity.ModifiedDate = DateTime.Now;
            if (dbEntityEntry.State != EntityState.Detached)
            {
                dbEntityEntry.State = EntityState.Modified;
            }
            dbEntityEntry.State = EntityState.Modified;
            context.SaveChanges();
            return entity;
        }

        public override WebContent Insert(WebContent entity)
        {
            var newEntity = new WebContent();
            newEntity.Title = entity.Title;
            newEntity.Location = entity.Location;
            newEntity.WebContentTypeId = entity.WebContentTypeId;
            // newEntity.WebContentType.WebContentTypeDescription =
            //     entity.WebContentType.WebContentTypeDescription;
            // To Do: fix this!
            // newEntity.WebContentTypeId = entity.WebContentType.WebContentTypeId;
            newEntity.ExpirationDate = entity.ExpirationDate;
            newEntity.SubTitle = entity.SubTitle;
            newEntity.Body = entity.Body;
            newEntity.ContentSequence = entity.ContentSequence;
            newEntity.DateAndTime = entity.DateAndTime;
            newEntity.Page = entity.Page;
            var dbEntityEntry = context.Entry(newEntity);
            newEntity.ModifiedDate = DateTime.Now;

            // var maxId = context.WebContent.Max(x => x.WebContentId);
            // entity.WebContentId = null;
            newEntity.CompanyId = entity.CompanyId == null ? 1 : entity.CompanyId;
            if (dbEntityEntry.State != EntityState.Detached)
            {
                dbEntityEntry.State = EntityState.Added;
            }
            else
            {
                DbSet.Add(newEntity);
            }
            context.SaveChanges();
            return entity;
        }
    }
}
