using Hoops.Core.Interface;

namespace Hoops.Functions.Utils;

/// <summary>
/// Scoped service that carries the authenticated userId from AuthenticationMiddleware
/// to functions that need to know who the caller is (e.g., Auth_Me).
/// One instance is created per function invocation.
/// Also serves as IAuditContext so the AuditInterceptor can stamp audit fields.
/// </summary>
public class AuthContext : IAuditContext
{
    public int? UserId { get; set; }
}
