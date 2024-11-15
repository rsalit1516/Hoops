using System;
using System.Linq.Expressions;
using System.Linq;
using System.Data;
using Hoops.Core.Interface;
using System.Collections.Generic;
using Hoops.Core.Models;
using Hoops.Core;

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
    }
}
