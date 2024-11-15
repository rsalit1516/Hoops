using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Csbc.Infrastructure;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Repository;
using Csbc.Infrastructure.Interface;
using Hoops.Core.Models;
using Hoops.Infrastructure.Data;

namespace Csbc.Infrastructure.Repository
{
    public class SponsorFeeRepository : EFRepository<Season>, ISponsorFeeRepository
    {
        public SponsorFeeRepository(hoopsContext _context) : base(_context) { }


        public List<SponsorFee> GetSeasonFees(int seasonId)
        {
            var fees = new List<SponsorFee>();
            var scholarshipFee =
                new SponsorFee { FeeName = "Scholarship", Amount = 0 };
            fees.Add(scholarshipFee);
            var discountFee =
                new SponsorFee { FeeName = "Discount", Amount = (decimal)112.50 };
            fees.Add(discountFee);
            var season = GetById(seasonId);
            if (season != null)
                fees
                    .Add(new SponsorFee
                    {
                        FeeName = "Standard",
                        Amount = Convert.ToDecimal(season.SponsorFee)
                    });
            return fees;
        }
    }

}