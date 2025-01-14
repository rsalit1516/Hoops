using Hoops.Core.Models;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Linq;
using Xunit;

namespace Hoops.Infrastructure.Repository.Tests
{
    public class UserRepositoryTest
    {
        private readonly Mock<hoopsContext> _mockContext;
        private readonly Mock<DbSet<User>> _mockDbSet;
        private readonly UserRepository _userRepository;

        public UserRepositoryTest()
        {
            _mockContext = new Mock<hoopsContext>();
            _mockDbSet = new Mock<DbSet<User>>();
            var mockLogger = new Mock<ILogger<UserRepository>>();
            _userRepository = new UserRepository(_mockContext.Object, mockLogger.Object);
        }

        [Fact]
        public void GetUser_ValidCredentials_ReturnsUser()
        {
            // Arrange
            var userName = "testuser";
            var password = "password";
            var user = new User { UserName = userName, PassWord = password };

            var data = new List<User> { user }.AsQueryable();
            _mockDbSet.As<IQueryable<User>>().Setup(m => m.Provider).Returns(data.Provider);
            _mockDbSet.As<IQueryable<User>>().Setup(m => m.Expression).Returns(data.Expression);
            _mockDbSet.As<IQueryable<User>>().Setup(m => m.ElementType).Returns(data.ElementType);
            _mockDbSet.As<IQueryable<User>>().Setup(m => m.GetEnumerator()).Returns(data.GetEnumerator());

            _mockContext.Setup(c => c.Users).Returns(_mockDbSet.Object);

            // Act
            var result = _userRepository.GetUser(userName, password);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(userName, result.UserName);
        }

        [Fact]
        public void GetUser_InvalidCredentials_ThrowsException()
        {
            // Arrange
            var userName = "testuser";
            var password = "wrongpassword";

            var data = new List<User>().AsQueryable();
            _mockDbSet.As<IQueryable<User>>().Setup(m => m.Provider).Returns(data.Provider);
            _mockDbSet.As<IQueryable<User>>().Setup(m => m.Expression).Returns(data.Expression);
            _mockDbSet.As<IQueryable<User>>().Setup(m => m.ElementType).Returns(data.ElementType);
            _mockDbSet.As<IQueryable<User>>().Setup(m => m.GetEnumerator()).Returns(data.GetEnumerator());

            _mockContext.Setup(c => c.Users).Returns(_mockDbSet.Object);

            // Act & Assert
            var exception = Assert.Throws<Exception>(() => _userRepository.GetUser(userName, password));
            Assert.Equal("Invalid username or password.", exception.Message);
        }
    }
}