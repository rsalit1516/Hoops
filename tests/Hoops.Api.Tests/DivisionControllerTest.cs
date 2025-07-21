using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using csbc_server.Controllers;

namespace Hoops.Api.Tests
{
    public class DivisionControllerTest
    {
        [Fact]
        public async Task GetDivision_ReturnsOkResult_WithDivisions()
        {
            var mockRepo = new Mock<IDivisionRepository>();
            var expectedDivisions = new List<Division> { new Division { DivisionId = 1, DivisionDescription = "Test Division" } };
            mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(expectedDivisions);
            var controller = new DivisionController(mockRepo.Object);
            var result = await controller.GetDivision();
            var okResult = Assert.IsType<OkObjectResult>(result);
            var divisions = Assert.IsAssignableFrom<IEnumerable<Division>>(okResult.Value);
            Assert.Single(divisions);
        }

        [Fact]
        public async Task GetDivision_ReturnsOkResult_WhenEmpty()
        {
            var mockRepo = new Mock<IDivisionRepository>();
            mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Division>());
            var controller = new DivisionController(mockRepo.Object);
            var result = await controller.GetDivision();
            var okResult = Assert.IsType<OkObjectResult>(result);
            var divisions = Assert.IsAssignableFrom<IEnumerable<Division>>(okResult.Value);
            Assert.Empty(divisions);
        }

        [Fact]
        public async Task GetDivisionById_ReturnsOkResult_WhenDivisionExists()
        {
            var mockRepo = new Mock<IDivisionRepository>();
            var division = new Division { DivisionId = 2, DivisionDescription = "Division 2" };
            mockRepo.Setup(r => r.FindByAsync(2)).ReturnsAsync(division);
            var controller = new DivisionController(mockRepo.Object);
            var result = await controller.GetDivision(2);
            var okResult = Assert.IsType<ActionResult<Division>>(result);
            Assert.NotNull(okResult.Value);
            Assert.Equal(2, okResult.Value!.DivisionId);
        }

        [Fact]
        public async Task GetDivisionById_ReturnsNotFound_WhenNoDivision()
        {
            var mockRepo = new Mock<IDivisionRepository>();
            mockRepo.Setup(r => r.FindByAsync(99)).ReturnsAsync((Division?)null);
            var controller = new DivisionController(mockRepo.Object);
            var result = await controller.GetDivision(99);
            Assert.IsType<NotFoundResult>(result.Result);
        }

        // Additional tests for Put, Post, Delete, and GetSeasonDivisions can be added here following the same pattern.
    }
}
