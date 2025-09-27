using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Hoops.Infrastructure.Data;
using Hoops.Core.Models;
using csbc_server.Controllers;

namespace Hoops.Api.Tests
{
    public class UserControllerTest : IDisposable
    {
        private readonly hoopsContext _context;
        private readonly UserController _controller;

        public UserControllerTest()
        {
            // Create an in-memory database for testing
            var options = new DbContextOptionsBuilder<hoopsContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new hoopsContext(options);
            _controller = new UserController(_context);

            // Seed initial data
            SeedDatabase();
        }

        private void SeedDatabase()
        {
            // Clear any existing data
            _context.Users.RemoveRange(_context.Users);
            _context.SaveChanges();

            // Add test data
            var existingUser = new User
            {
                UserId = 1,
                UserName = "existinguser",
                Name = "Existing User",
                UserType = 1
            };

            _context.Users.Add(existingUser);
            _context.SaveChanges();

            // Reset the context to ensure clean state
            _context.ChangeTracker.Clear();
        }

        [Fact]
        public async Task PostUser_WithValidNewUser_ReturnsCreatedAtAction()
        {
            // Arrange
            var newUser = new User
            {
                UserId = 0, // This should be auto-generated
                UserName = "newuser",
                Name = "New User",
                UserType = 1
            };

            // Act
            var result = await _controller.PostUser(newUser);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedUser = Assert.IsType<User>(createdAtActionResult.Value);

            // Verify that the UserId was auto-generated (should not be 0)
            Assert.NotEqual(0, returnedUser.UserId);
            Assert.Equal("newuser", returnedUser.UserName);
            Assert.Equal("New User", returnedUser.Name);
            Assert.Equal(1, returnedUser.UserType);

            // Verify the user was actually saved to the database
            var savedUser = await _context.Users.FindAsync(returnedUser.UserId);
            Assert.NotNull(savedUser);
            Assert.Equal("newuser", savedUser.UserName);
        }

        [Fact]
        public async Task PostUser_WithZeroUserId_AutoGeneratesUserId()
        {
            // Arrange
            var newUser = new User
            {
                UserId = 0, // Should be auto-generated
                UserName = "testuser",
                Name = "Test User",
                UserType = 1
            };

            // Act
            var result = await _controller.PostUser(newUser);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedUser = Assert.IsType<User>(createdAtActionResult.Value);

            // The key assertion: UserId should be auto-generated and not 0
            Assert.True(returnedUser.UserId > 0, $"Expected UserId > 0, but got {returnedUser.UserId}");
        }

        [Fact]
        public async Task GetUsers_ReturnsAllUsers()
        {
            // Act
            var result = _controller.GetUsers();

            // Assert
            var okResult = Assert.IsType<ActionResult<IEnumerable<User>>>(result);
            var users = Assert.IsAssignableFrom<IEnumerable<User>>(okResult.Value);
            Assert.Single(users); // Should have the one seeded user
        }

        [Fact]
        public async Task GetUser_WithValidId_ReturnsUser()
        {
            // Act
            var result = await _controller.GetUser(1);

            // Assert
            var okResult = Assert.IsType<ActionResult<User>>(result);
            var user = Assert.IsType<User>(okResult.Value);
            Assert.Equal(1, user.UserId);
            Assert.Equal("existinguser", user.UserName);
        }

        [Fact]
        public async Task GetUser_WithInvalidId_ReturnsNotFound()
        {
            // Act
            var result = await _controller.GetUser(999);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        public void Dispose()
        {
            _context?.Dispose();
        }
    }
}