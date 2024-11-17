using System.Data;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Microsoft.EntityFrameworkCore;
using Hoops.Infrastructure.Data;


namespace Hoops.Infrastructure.Repository
{
    public class SponsorRepository : EFRepository<Sponsor>, ISponsorRepository
    {

        public SponsorRepository(hoopsContext context) : base(context) { }

        #region IRepository<T> Members


        public IQueryable<Sponsor> GetAll(int companyId)
        {
            return context.Set<Sponsor>().Where(s => s.CompanyId == (int)companyId);
        }


        #endregion

        public override Sponsor Insert(Sponsor entity)
        {
            if (entity.SponsorId == 0)
            {
                entity.SponsorId = context.Set<Sponsor>().Any() ? (context.Set<Sponsor>().Max(p => p.SponsorId) + 1) : 1;
            }
            context.Set<Sponsor>().Add(entity);
            var no = context.SaveChanges();
            return entity;
        }


        public IQueryable<SponsorWithProfile> GetSeasonSponsors(int seasonId)
        {
            var sponsorRepository = new SponsorRepository(new hoopsContext());
            var sponsors = context.Set<Sponsor>()
            .Join(context.Set<SponsorProfile>(),
            s => s.SponsorProfileId,
            p => p.SponsorProfileId,
            (s, p) => new { s, p })
            .Where(z => z.s.SeasonId == seasonId)
            .Select(z => new SponsorWithProfile
            {
                Name = z.p.SpoName,
                Phone = z.p.Phone

            });
            return sponsors;
        }

        public async Task<List<SponsorWithProfile>> GetSeasonSponsorsAsync(int seasonId)
        {
            var sponsors = await context.Set<Sponsor>()
            .Join(context.Set<SponsorProfile>(),
            s => s.SponsorProfileId,
            p => p.SponsorProfileId,
            (s, p) => new { s, p })
            .Where(z => z.s.SeasonId == seasonId)
            .Select(z => new SponsorWithProfile
            {
                SponsorId = z.s.SponsorId, 
                Name = z.p.SpoName,
                Website = z.p.Url,
                Phone = z.p.Phone

            })
            .ToListAsync();
            return sponsors;
        }
        public bool IsSeasonSponsor(int seasonId, int sponsorProfileId)
        {
            var sponsorRepository = new SponsorRepository(new hoopsContext());
            var sponsors = context.Set<Sponsor>()
            .Where(s => s.SeasonId == seasonId && s.SponsorProfileId == sponsorProfileId);
            //var count = sponsors.Count();
            return sponsors.Any();
        }

        public decimal GetSponsorBalance(int sponsorProfileId)
        {
            var fees = context.Set<Sponsor>().Where(f => f.SponsorProfileId == sponsorProfileId).Sum(f => f.FeeId);
            var repPayments = new SponsorPaymentRepository(context);
            var payments = repPayments.GetTotalPayments(sponsorProfileId);
            return (Convert.ToDecimal(fees) - payments);
        }
    }
}
