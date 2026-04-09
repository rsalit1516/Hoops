using System;
using System.Threading;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Hoops.Infrastructure.Data;

/// <summary>
/// EF Core interceptor that automatically stamps CreatedDate/CreatedUser on insert
/// and ModifiedDate/ModifiedUser on update for any entity implementing IAuditable.
/// </summary>
public class AuditInterceptor : SaveChangesInterceptor
{
    private readonly IAuditContext _auditContext;

    public AuditInterceptor(IAuditContext auditContext)
    {
        _auditContext = auditContext;
    }

    public override InterceptionResult<int> SavingChanges(
        DbContextEventData eventData,
        InterceptionResult<int> result)
    {
        ApplyAudit(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        ApplyAudit(eventData.Context);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private void ApplyAudit(DbContext? context)
    {
        if (context is null) return;

        var now = DateTime.UtcNow;
        var userId = _auditContext.UserId;

        foreach (var entry in context.ChangeTracker.Entries<IAuditable>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedDate = now;
                entry.Entity.CreatedUser = userId;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.ModifiedDate = now;
                entry.Entity.ModifiedUser = userId;
            }
        }
    }
}
