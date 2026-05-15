using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Hoops.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Infrastructure.Repository
{
    public class SponsorPaymentRepository : EFRepository<SponsorPayment>, ISponsorPaymentRepository
    {
        public SponsorPaymentRepository(hoopsContext context) : base(context) { }

        public override SponsorPayment Insert(SponsorPayment entity)
        {
            if (entity.PaymentId == 0)
            {
                entity.PaymentId = context.SponsorPayments.Any()
                    ? context.SponsorPayments.Max(p => p.PaymentId) + 1
                    : 1;
            }
            context.SponsorPayments.Add(entity);
            context.SaveChanges();
            return entity;
        }

        public List<SponsorPayment> GetSponsorPayments(int sponsorProfileId)
        {
            return context.Set<SponsorPayment>()
                .Where(p => p.SponsorProfileId == sponsorProfileId)
                .ToList();
        }

        public decimal GetTotalPayments(int sponsorProfileId)
        {
            return context.Set<SponsorPayment>()
                .Where(f => f.SponsorProfileId == sponsorProfileId)
                .Sum(f => f.Amount);
        }

        public async Task<List<SponsorPaymentDto>> GetPaymentsAsync(int sponsorProfileId)
        {
            return await context.Set<SponsorPayment>()
                .Where(p => p.SponsorProfileId == sponsorProfileId)
                .OrderByDescending(p => p.TransactionDate)
                .Select(p => new SponsorPaymentDto
                {
                    PaymentId = p.PaymentId,
                    SponsorProfileId = p.SponsorProfileId,
                    Amount = p.Amount,
                    PaymentType = p.PaymentType ?? string.Empty,
                    TransactionDate = p.TransactionDate,
                    TransactionNumber = p.TransactionNumber ?? string.Empty,
                    Memo = p.Memo ?? string.Empty
                })
                .ToListAsync();
        }

        public async Task<SponsorPayment> AddPaymentAsync(SponsorPayment payment)
        {
            if (payment.PaymentId == 0)
            {
                payment.PaymentId = context.SponsorPayments.Any()
                    ? context.SponsorPayments.Max(p => p.PaymentId) + 1
                    : 1;
            }
            context.SponsorPayments.Add(payment);
            await context.SaveChangesAsync();
            return payment;
        }

        public async Task<SponsorPayment> UpdatePaymentAsync(SponsorPayment payment)
        {
            var existing = await context.Set<SponsorPayment>().FindAsync(payment.PaymentId);
            if (existing == null) return payment;
            context.Entry(existing).CurrentValues.SetValues(payment);
            await context.SaveChangesAsync();
            return existing;
        }
    }
}
