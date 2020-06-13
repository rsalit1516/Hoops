using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Csbc.Infrastructure;
using Csbc.Infrastructure.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Entities;
using Hoops.Core.ViewModels;

namespace Hoops.Infrastructure.Repository
{
    public class WebContentRepository : EFRepository<WebContent>, IWebContentRepository
    {
        public WebContentRepository(hoopsContext context) : base(context) { }

        public async Task<IEnumerable<WebContentVm>> GetAllAsync(int companyId)
        {
            return await context
                .WebContents
.Join(context.WebContentTypes,
          content => content.WebContentTypeId,
          contentType => contentType.WebContentTypeId,
          (content, contentType) => new { content, contentType })
    .Where(result => result.content.CompanyId == companyId)
    .Select(z => new WebContentVm
    {
        WebContentId = z.content.WebContentId,
        ContentSequence = z.content.ContentSequence,
        Title = z.content.Title,
        SubTitle = z.content.SubTitle,
        Body = z.content.Body,
        DateAndTime = z.content.DateAndTime,
        Location = z.content.Location,
        WebContentTypeDescription = z.contentType.WebContentTypeDescription
    })
      .ToListAsync();
        }

        public async Task<IEnumerable<WebContentVm>> GetActiveWebContentAsync(int companyId)
        {
            return await context
                .WebContents
.Join(context.WebContentTypes,
          content => content.WebContentTypeId,
          contentType => contentType.WebContentTypeId,
          (content, contentType) => new { content, contentType })
    .Where(result => result.content.CompanyId == companyId)
    .Where(result => result.content.ExpirationDate >= DateTime.Now)
    .Select(z => new WebContentVm
    {
        WebContentId = z.content.WebContentId,
        ContentSequence = z.content.ContentSequence,
        Title = z.content.Title,
        SubTitle = z.content.SubTitle,
        Body = z.content.Body,
        DateAndTime = z.content.DateAndTime,
        Location = z.content.Location,
        WebContentTypeDescription = z.contentType.WebContentTypeDescription
    })
                //.Join 
                //.Where(s => s.CompanyId == companyId)
                //.Where(w => w.ExpirationDate >= DateTime.Now)
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
            // newEntity.WebContentType = new WebContentType();
            // newEntity.WebContentType.WebContentTypeId =
            //     entity.WebContentType.WebContentTypeId;
            // newEntity.WebContentType.WebContentTypeDescription =
            //     entity.WebContentType.WebContentTypeDescription;
            // To Do: fix this!
            // newEntity.WebContentTypeId = entity.WebContentType.WebContentTypeId;
            newEntity.ExpirationDate = entity.ExpirationDate;
            newEntity.SubTitle = entity.SubTitle;
            newEntity.ContentSequence = entity.ContentSequence;
            newEntity.DateAndTime = entity.DateAndTime;
            newEntity.Page = entity.Page;
            var dbEntityEntry = context.Entry(newEntity);
            newEntity.ModifiedDate = DateTime.Now;

            // var maxId = context.WebContent.Max(x => x.WebContentId);
            // entity.WebContentId = null;
            newEntity.CompanyId =
                entity.CompanyId == null ? 1 : entity.CompanyId;
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
