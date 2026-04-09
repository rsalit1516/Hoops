namespace Hoops.Core.Interface;

/// <summary>
/// Provides the current authenticated user's ID for audit stamping.
/// Implemented by AuthContext in Hoops.Functions and resolved via DI.
/// </summary>
public interface IAuditContext
{
    int? UserId { get; }
}
