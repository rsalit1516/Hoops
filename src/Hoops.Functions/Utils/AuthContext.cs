namespace Hoops.Functions.Utils;

/// <summary>
/// Scoped service that carries the authenticated userId from AuthenticationMiddleware
/// to functions that need to know who the caller is (e.g., Auth_Me).
/// One instance is created per function invocation.
/// </summary>
public class AuthContext
{
    public int? UserId { get; set; }
}
