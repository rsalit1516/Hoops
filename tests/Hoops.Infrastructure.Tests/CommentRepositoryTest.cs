using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Hoops.Infrastructure.Tests
{
    public class CommentRepositoryTest : IClassFixture<TestDatabaseFixture>
    {
        private readonly hoopsContext _context;
        private readonly CommentRepository _repository;

        public CommentRepositoryTest(TestDatabaseFixture fixture)
        {
            // Set up an in-memory database
            // var options = new DbContextOptionsBuilder<hoopsContext>()
            //     .UseInMemoryDatabase(databaseName: "HoopsTestDb")
            //     .Options;

            _context = fixture.Context ?? throw new ArgumentNullException(nameof(fixture.Context), "Context cannot be null");
            _repository = new CommentRepository(_context);

            // Seed the database with test data
            // SeedDatabase();
        }

        private void SeedDatabase()
        {
            // Add test data to the in-memory database
            _context.Comments.AddRange(new List<Comment>
            {
                new Comment { CommentID = 1, LinkID = 101, CommentType = "General", Comment1 = "Test Comment 1", CompanyID = 1 },
                new Comment { CommentID = 2, LinkID = 102, CommentType = "Feedback", Comment1 = "Test Comment 2", CompanyID = 1 },
                new Comment { CommentID = 3, LinkID = 101, CommentType = "General", Comment1 = "Test Comment 3", CompanyID = 1 }
            });

            _context.SaveChanges();
        }

        [Fact]
        public async Task GetCommentsByLinkIdAsync_ReturnsCorrectComments()
        {
            // Act
            var result = await _repository.GetCommentsByLinkIdAsync(101);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.Contains(result, c => c.Comment1 == "Test Comment 1");
            Assert.Contains(result, c => c.Comment1 == "Test Comment 3");
        }

        [Fact]
        public async Task GetCommentsByLinkIdAsync_ReturnsEmpty_WhenNoCommentsExist()
        {
            // Act
            var result = await _repository.GetCommentsByLinkIdAsync(999);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }
    }
}