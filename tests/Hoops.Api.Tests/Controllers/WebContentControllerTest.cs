using System.Threading.Tasks;
using Hoops.Controllers;
using Hoops.Core.Models;
using Hoops.Core.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Hoops.Api.Controllers.Tests
{
    public class WebContentControllerTest
    {
        private readonly Mock<IWebContentRepository> _mockRepo;
        private readonly Mock<ILogger<WebContentController>> _mockLogger;
        private readonly WebContentController _controller;

        public WebContentControllerTest()
        {
            _mockRepo = new Mock<IWebContentRepository>();
            _mockLogger = new Mock<ILogger<WebContentController>>();
            _controller = new WebContentController(_mockRepo.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task DeleteWebContent_ReturnsNotFound_WhenWebContentDoesNotExistAsync()
        {
            // Arrange
            int webContentId = 1;
            _mockRepo.Setup(repo => repo.GetById(webContentId)).Returns((WebContent)null);

            // Act
            var result = await _controller.DeleteWebContent(webContentId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task DeleteWebContent_ReturnsOk_WhenWebContentExists()
        {
            // Arrange
            int webContentId = 1;
            var webContent = new WebContent { WebContentId = webContentId };
            _mockRepo.Setup(repo => repo.GetById(webContentId)).Returns(webContent);

            // Act
            var result = await _controller.DeleteWebContent(webContentId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedWebContent = Assert.IsType<WebContent>(okResult.Value);
            Assert.Equal(webContentId, returnedWebContent.WebContentId);
        }
    }
}
