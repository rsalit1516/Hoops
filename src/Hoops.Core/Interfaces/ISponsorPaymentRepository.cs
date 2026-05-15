using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;

namespace Hoops.Core.Interface
{
    public interface ISponsorPaymentRepository : IRepository<SponsorPayment>
    {
        List<SponsorPayment> GetSponsorPayments(int sponsorProfileId);
        decimal GetTotalPayments(int sponsorProfileId);
        Task<List<SponsorPaymentDto>> GetPaymentsAsync(int sponsorProfileId);
        Task<SponsorPayment> AddPaymentAsync(SponsorPayment payment);
        Task<SponsorPayment> UpdatePaymentAsync(SponsorPayment payment);
    }
}
