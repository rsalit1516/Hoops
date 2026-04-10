using System;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Hoops.Infrastructure.Tests;

public class AuditInterceptorTests
{
    private sealed class TestAuditContext : IAuditContext
    {
        public int? UserId { get; set; }
    }

    private static hoopsContext CreateContext(TestAuditContext auditContext, string? dbName = null)
    {
        var options = new DbContextOptionsBuilder<hoopsContext>()
            .UseInMemoryDatabase(dbName ?? Guid.NewGuid().ToString())
            .AddInterceptors(new AuditInterceptor(auditContext))
            .Options;

        return new hoopsContext(options);
    }

    [Fact]
    public void SaveChanges_OnAddedAuditableEntity_SetsCreatedFields()
    {
        // Arrange
        var auditContext = new TestAuditContext { UserId = 123 };
        using var context = CreateContext(auditContext);
        var before = DateTime.UtcNow;

        var season = new Season
        {
            Description = "Spring 2027"
        };

        // Act
        context.Seasons.Add(season);
        context.SaveChanges();
        var after = DateTime.UtcNow;

        // Assert
        Assert.NotNull(season.CreatedDate);
        Assert.Equal(123, season.CreatedUser);
        Assert.True(season.CreatedDate >= before && season.CreatedDate <= after);
        Assert.Null(season.ModifiedDate);
        Assert.Null(season.ModifiedUser);
    }

    [Fact]
    public void SaveChanges_OnModifiedAuditableEntity_SetsModifiedFields()
    {
        // Arrange
        var auditContext = new TestAuditContext { UserId = 7 };
        using var context = CreateContext(auditContext);

        var division = new Division
        {
            DivisionDescription = "Boys 10U",
            Stats = true
        };

        context.Divisions.Add(division);
        context.SaveChanges();

        var createdDate = division.CreatedDate;
        var createdUser = division.CreatedUser;

        var before = DateTime.UtcNow;
        auditContext.UserId = 42;
        division.DivisionDescription = "Boys 11U";

        // Act
        context.SaveChanges();
        var after = DateTime.UtcNow;

        // Assert
        Assert.Equal(createdDate, division.CreatedDate);
        Assert.Equal(createdUser, division.CreatedUser);
        Assert.NotNull(division.ModifiedDate);
        Assert.Equal(42, division.ModifiedUser);
        Assert.True(division.ModifiedDate >= before && division.ModifiedDate <= after);
    }

    [Fact]
    public void SaveChanges_OnDisconnectedUpdate_PreservesCreatedFields()
    {
        // Arrange
        var dbName = Guid.NewGuid().ToString();
        var auditContext = new TestAuditContext { UserId = 10 };
        var seasonId = 0;

        using (var seedContext = CreateContext(auditContext, dbName))
        {
            var season = new Season { Description = "Fall 2027" };
            seedContext.Seasons.Add(season);
            seedContext.SaveChanges();
            seasonId = season.SeasonId;
        }

        // Simulate API payload for PUT that omits created fields.
        auditContext.UserId = 77;
        using (var updateContext = CreateContext(auditContext, dbName))
        {
            var detached = new Season
            {
                SeasonId = seasonId,
                Description = "Fall 2027 Updated",
                CreatedDate = null,
                CreatedUser = null
            };

            updateContext.Update(detached);
            updateContext.SaveChanges();
        }

        using var verifyContext = CreateContext(auditContext, dbName);
        var updated = verifyContext.Seasons.Single(s => s.SeasonId == seasonId);

        // Assert
        Assert.NotNull(updated.CreatedDate);
        Assert.Equal(10, updated.CreatedUser);
        Assert.NotNull(updated.ModifiedDate);
        Assert.Equal(77, updated.ModifiedUser);
        Assert.Equal("Fall 2027 Updated", updated.Description);
    }

    [Fact]
    public void SaveChanges_WithNoAuthenticatedUser_LeavesUserFieldsNull()
    {
        // Arrange
        var auditContext = new TestAuditContext { UserId = null };
        using var context = CreateContext(auditContext);

        var playoff = new SchedulePlayoff
        {
            ScheduleNumber = 1,
            GameNumber = 1,
            Descr = "Semi Final"
        };

        // Act
        context.SchedulePlayoffs.Add(playoff);
        context.SaveChanges();

        // Assert
        Assert.NotNull(playoff.CreatedDate);
        Assert.Null(playoff.CreatedUser);
        Assert.Null(playoff.ModifiedDate);
        Assert.Null(playoff.ModifiedUser);
    }

    [Fact]
    public void SaveChanges_OnNonAuditableEntity_DoesNotApplyAuditStamping()
    {
        // Arrange
        var auditContext = new TestAuditContext { UserId = 99 };
        using var context = CreateContext(auditContext);

        var user = new User
        {
            UserName = "audit-test-user",
            Name = "Audit Test",
            Pword = "pw",
            PassWord = "hash",
            HouseId = 1
        };

        // Act
        context.Users.Add(user);
        context.SaveChanges();

        // Assert
        Assert.Null(user.CreatedDate);
        Assert.Null(user.CreatedUser);
    }
}
