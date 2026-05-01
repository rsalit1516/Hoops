using System.Linq.Expressions;
using System.Data;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Hoops.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Infrastructure.Repository
{
    public class SponsorProfileRepository : EFRepository<SponsorProfile>, ISponsorProfileRepository
    {

        public SponsorProfileRepository(hoopsContext context): base(context) { }
       

        #region IRepository<T> Members

        public IQueryable<SponsorProfile> SearchFor(Expression<Func<SponsorProfile, bool>> predicate)
        {
            return DbSet.Where(predicate);
        }

        //public IQueryable<SponsorProfile> GetAll()
        //{
        //    return context.Set<SponsorProfile>().Select(s => s);
        //}
        public IQueryable<SponsorProfile> GetAll(int companyId)
        {
            return context.Set<SponsorProfile>()
                .Where(s => s.CompanyId == companyId)
                .OrderBy(s => s.SpoName);
        }
        public IEnumerable<SponsorProfile> GetAll(int companyId, string value)
        {
            return context.Set<SponsorProfile>()
                .Where(s => s.CompanyId == companyId && s.SpoName.StartsWith(value))
                .OrderBy(s => s.SpoName);
        }
       
        public IQueryable<SponsorProfile> GetSponsorsThatShowAds()
        {
            return context.Set<SponsorProfile>()
                .Where(s => s.ShowAd == true)
                .OrderBy(s => s.SpoName);
        }
        #endregion

        public void Create(SponsorProfile sponsorProfile)
        {
            var newSponsorProfile = context.SponsorProfiles.Add(sponsorProfile);
            context.SaveChanges();
            // return newSponsorProfile;
        }
        
        public override SponsorProfile Update(SponsorProfile entity)
        {
            var sponsor = GetById(entity.SponsorProfileId);
            sponsor = entity;
            context.SaveChanges();
            return entity;
        }
        public IQueryable<SponsorProfile> GetSponsorsNotInSeason(int companyId, int seasonId)
        {
            var sponsors = from c in context.Set<SponsorProfile>()
                where (c.CompanyId == companyId) &&
                !(from o in context.Set<Sponsor>() 
                  where o.SeasonId == seasonId  
                    select o.SponsorProfileId)   
			    .Contains(c.SponsorProfileId) 
		   select c;
           return sponsors.OrderBy(s => s.SpoName);
        }

        public IQueryable<SponsorProfile> GetSponsorsInSeason(int companyId, int seasonId)
        {
            var sponsors = from c in context.Set<SponsorProfile>()
                           where (c.CompanyId == companyId) &&
                           (from o in context.Set<Sponsor>()
                             where o.SeasonId == seasonId
                             select o.SponsorProfileId)
                           .Contains(c.SponsorProfileId)

                           select c;
            return sponsors.OrderBy(s => s.SpoName);
        }

        public async Task<List<SponsorProfileListItemDto>> GetAllWithLastSeasonAsync(int companyId)
        {
            var lastSeasonIds = await context.Set<Sponsor>()
                .Where(s => s.CompanyId == companyId)
                .GroupBy(s => s.SponsorProfileId)
                .Select(g => new { SponsorProfileId = g.Key, LastSeasonId = g.Max(s => s.SeasonId) })
                .ToListAsync();

            var lastSeasonMap = lastSeasonIds.ToDictionary(x => x.SponsorProfileId, x => x.LastSeasonId);

            var uniqueSeasonIds = lastSeasonIds
                .Select(x => x.LastSeasonId)
                .Where(id => id.HasValue)
                .Select(id => id!.Value)
                .Distinct()
                .ToList();

            var seasonDescriptions = await context.Set<Season>()
                .Where(s => s.CompanyId == companyId && uniqueSeasonIds.Contains(s.SeasonId))
                .ToDictionaryAsync(s => s.SeasonId, s => s.Description);

            var profiles = await context.Set<SponsorProfile>()
                .Where(sp => sp.CompanyId == companyId)
                .OrderBy(sp => sp.SpoName)
                .ToListAsync();

            return profiles.Select(sp =>
            {
                var lastSeasonId = lastSeasonMap.TryGetValue(sp.SponsorProfileId, out var sid) ? sid : null;
                var seasonDesc = lastSeasonId.HasValue && seasonDescriptions.TryGetValue(lastSeasonId.Value, out var desc) ? desc : null;
                return new SponsorProfileListItemDto
                {
                    SponsorProfileId = sp.SponsorProfileId,
                    SpoName = sp.SpoName ?? string.Empty,
                    ContactName = sp.ContactName ?? string.Empty,
                    Email = sp.Email ?? string.Empty,
                    Phone = sp.Phone ?? string.Empty,
                    LastSeasonId = lastSeasonId,
                    LastSeasonDescription = seasonDesc ?? string.Empty
                };
            }).ToList();
        }
    }
}
