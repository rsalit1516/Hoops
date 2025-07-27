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
            var mockSeasonService = new Mock<ISeasonService>();
            var controller = new DivisionController(mockRepo.Object, mockSeasonService.Object);
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
            var mockSeasonService = new Mock<ISeasonService>();
            var controller = new DivisionController(mockRepo.Object, mockSeasonService.Object);
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
            var mockSeasonService = new Mock<ISeasonService>();
            var controller = new DivisionController(mockRepo.Object, mockSeasonService.Object);
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
            var mockSeasonService = new Mock<ISeasonService>();
            var controller = new DivisionController(mockRepo.Object, mockSeasonService.Object);
            var result = await controller.GetDivision(99);
            Assert.IsType<NotFoundResult>(result.Result);
        }

        // Tests for GetSeasonDivisions method
        [Fact]
        public async Task GetSeasonDivisions_ReturnsOkResult_WithDivisions_WhenSeasonExists()
        {
            // Arrange
            var seasonId = 1;
            var divisions = new List<Division>
            {
                new Division { DivisionId = 1, DivisionDescription = "Division A", SeasonId = seasonId },
                new Division { DivisionId = 2, DivisionDescription = "Division B", SeasonId = seasonId }
            };
            
            var season = new Season 
            { 
                SeasonId = seasonId, 
                Description = "Test Season",
                Divisions = divisions
            };
            
            var allSeasons = new List<Season> { season };
            
            var mockRepo = new Mock<IDivisionRepository>();
            var mockSeasonService = new Mock<ISeasonService>();
            mockSeasonService.Setup(s => s.GetAllSeasonsAsync()).ReturnsAsync(allSeasons);
            
            var controller = new DivisionController(mockRepo.Object, mockSeasonService.Object);

            // Act
            var result = await controller.GetSeasonDivisions(seasonId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedDivisions = Assert.IsAssignableFrom<ICollection<Division>>(okResult.Value);
            Assert.Equal(2, returnedDivisions.Count);
            Assert.Contains(returnedDivisions, d => d.DivisionDescription == "Division A");
            Assert.Contains(returnedDivisions, d => d.DivisionDescription == "Division B");
        }

        [Fact]
        public async Task GetSeasonDivisions_ReturnsEmptyList_WhenSeasonNotFound()
        {
            // Arrange
            var seasonId = 999; // Non-existent season
            var allSeasons = new List<Season>
            {
                new Season { SeasonId = 1, Description = "Different Season", Divisions = new List<Division>() }
            };
            
            var mockRepo = new Mock<IDivisionRepository>();
            var mockSeasonService = new Mock<ISeasonService>();
            mockSeasonService.Setup(s => s.GetAllSeasonsAsync()).ReturnsAsync(allSeasons);
            
            var controller = new DivisionController(mockRepo.Object, mockSeasonService.Object);

            // Act
            var result = await controller.GetSeasonDivisions(seasonId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedDivisions = Assert.IsAssignableFrom<IEnumerable<Division>>(okResult.Value);
            Assert.Empty(returnedDivisions);
        }

        [Fact]
        public async Task GetSeasonDivisions_ReturnsEmptyList_WhenSeasonHasNoDivisions()
        {
            // Arrange
            var seasonId = 1;
            var season = new Season 
            { 
                SeasonId = seasonId, 
                Description = "Season Without Divisions",
                Divisions = null // No divisions
            };
            
            var allSeasons = new List<Season> { season };
            
            var mockRepo = new Mock<IDivisionRepository>();
            var mockSeasonService = new Mock<ISeasonService>();
            mockSeasonService.Setup(s => s.GetAllSeasonsAsync()).ReturnsAsync(allSeasons);
            
            var controller = new DivisionController(mockRepo.Object, mockSeasonService.Object);

            // Act
            var result = await controller.GetSeasonDivisions(seasonId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedDivisions = Assert.IsAssignableFrom<IEnumerable<Division>>(okResult.Value);
            Assert.Empty(returnedDivisions);
        }

        [Fact]
        public async Task GetSeasonDivisions_ReturnsEmptyList_WhenSeasonHasEmptyDivisionsList()
        {
            // Arrange
            var seasonId = 1;
            var season = new Season 
            { 
                SeasonId = seasonId, 
                Description = "Season With Empty Divisions",
                Divisions = new List<Division>() // Empty list
            };
            
            var allSeasons = new List<Season> { season };
            
            var mockRepo = new Mock<IDivisionRepository>();
            var mockSeasonService = new Mock<ISeasonService>();
            mockSeasonService.Setup(s => s.GetAllSeasonsAsync()).ReturnsAsync(allSeasons);
            
            var controller = new DivisionController(mockRepo.Object, mockSeasonService.Object);

            // Act
            var result = await controller.GetSeasonDivisions(seasonId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedDivisions = Assert.IsAssignableFrom<IEnumerable<Division>>(okResult.Value);
            Assert.Empty(returnedDivisions);
        }

        [Fact]
        public async Task GetSeasonDivisions_ReturnsEmptyList_WhenNoSeasonsExist()
        {
            // Arrange
            var seasonId = 1;
            var allSeasons = new List<Season>(); // No seasons at all
            
            var mockRepo = new Mock<IDivisionRepository>();
            var mockSeasonService = new Mock<ISeasonService>();
            mockSeasonService.Setup(s => s.GetAllSeasonsAsync()).ReturnsAsync(allSeasons);
            
            var controller = new DivisionController(mockRepo.Object, mockSeasonService.Object);

            // Act
            var result = await controller.GetSeasonDivisions(seasonId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedDivisions = Assert.IsAssignableFrom<IEnumerable<Division>>(okResult.Value);
            Assert.Empty(returnedDivisions);
        }

        // Additional tests for Put, Post, Delete can be added here following the same pattern.
    }
}
