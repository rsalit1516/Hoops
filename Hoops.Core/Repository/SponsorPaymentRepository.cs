using System.Collections.Generic;
using System.Linq;
using Hoops.Core.Entities;
using Hoops.Infrastructure.Interface;

namespace Hoops.Infrastructure.Repository
{
    public class SponsorPaymentRepository : EFRepository<SponsorPayment>, ISponsorPaymentRepository
    {
        public SponsorPaymentRepository(hoopsContext context) : base(context) {
            // Context = context;
         }
 
        public override SponsorPayment Insert(SponsorPayment entity)
        {
            using (context)
            {
                if (entity.PaymentId == 0)
                {
                    entity.PaymentId = context.SponsorPayments.Any() ? (context.SponsorPayments.Max(p => p.PaymentId) + 1) : 1;
                    var newSponsorPayment = context.SponsorPayments.Add(entity);
                }
                
                context.SaveChanges();
                return entity;
            }
        }


        public List<SponsorPayment> GetSponsorPayments(int sponsorProfileId)
        {
            using (var context = new hoopsContext())
            {
                var sponsorPayments = context.Set<SponsorPayment>().Where<SponsorPayment>(p => p.SponsorProfileId == sponsorProfileId).ToList<SponsorPayment>();
                return sponsorPayments;
            }
            
        }

        public decimal GetTotalPayments(int sponsorProfileId)
        {
            var fees = context.Set<SponsorPayment>().Where(f => f.SponsorProfileId == sponsorProfileId).Sum(f => f.Amount);
            return fees;
        }
    }
}

