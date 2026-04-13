using System;

namespace Hoops.Core.Interface;

/// <summary>
/// Marks an entity as auditable with created/modified tracking fields.
/// CreatedDate and CreatedUser are set on insert; ModifiedDate and ModifiedUser on update.
/// User fields are foreign keys to Users.UserID.
/// </summary>
public interface IAuditable
{
    DateTime? CreatedDate { get; set; }
    int? CreatedUser { get; set; }
    DateTime? ModifiedDate { get; set; }
    int? ModifiedUser { get; set; }
}
