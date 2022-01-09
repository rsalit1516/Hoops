using System;
using System.Data;
using Hoops.Infrastructure.Interface;
using Hoops.Core.Models;
using Hoops.Core;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Hoops.Core.ViewModels;

namespace Hoops.Infrastructure.Repository
{
    public class SponsorRepository : EFRepository<Sponsor>, ISponsorRepository
    {
        private readonly ILogger<ScheduleGameRepository> _logger;

        public SponsorRepository(hoopsContext context, ILogger<ScheduleGameRepository> logger) : base(context)
        {
            _logger = logger;
        }

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


        public async Task<List<SponsorVM>> GetSeasonSponsors()
        {
            // var sponsorRepository = new SponsorRepository(new hoopsContext(), );
            var sponsors = context.Set<Sponsor>()
            .Join(context.SponsorProfiles,
            sponsor => sponsor.SponsorProfileId,
            profile => profile.SponsorProfileId,
            (sponsor, profile) => new SponsorVM
            {
                SponsorId = sponsor.SponsorId,
                SponsorName = profile.SpoName,
                Url = profile.Url,
                AdExpiration = profile.AdExpiration
            })
                .Where(x => x.AdExpiration >= DateTime.Now)
                .ToListAsync();
            return await sponsors;
        }

        public bool IsSeasonSponsor(int seasonId, int sponsorProfileId)
        {
            // var sponsorRepository = new SponsorRepository(new hoopsContext());
            var sponsors = context.Set<Sponsor>().Where(s => s.SeasonId == seasonId && s.SponsorProfileId == sponsorProfileId);
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
