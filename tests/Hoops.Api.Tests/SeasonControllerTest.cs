using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Controllers;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Application.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Hoops.Api.Tests
{
    public class SeasonControllerTest
    {
        [Fact]
        public async Task GetSeason_ReturnsOkResult_WithSeasons()
        {
            var mockRepo = new Mock<ISeasonRepository>();
            var mockService = new Mock<SeasonService>(mockRepo.Object);
            var expectedSeasons = new List<Season> { new Season { SeasonId = 1, Description = "Test Season" } };
            mockService.Setup(s => s.GetAllSeasonsAsync()).ReturnsAsync(expectedSeasons);
            var controller = new SeasonController(mockRepo.Object, mockService.Object);
            var result = await controller.GetSeason();
            var okResult = Assert.IsType<OkObjectResult>(result);
            var seasons = Assert.IsAssignableFrom<IEnumerable<Season>>(okResult.Value);
            Assert.Single(seasons);
        }

        [Fact]
        public async Task GetSeason_ReturnsNotFound_WhenNoSeasons()
        {
            var mockRepo = new Mock<ISeasonRepository>();
            var mockService = new Mock<SeasonService>(mockRepo.Object);
            mockService.Setup(s => s.GetAllSeasonsAsync()).ReturnsAsync(new List<Season>());
            var controller = new SeasonController(mockRepo.Object, mockService.Object);
            var result = await controller.GetSeason();
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task GetCurrentSeason_ReturnsOkResult_WhenSeasonExists()
        {
            var mockRepo = new Mock<ISeasonRepository>();
            var mockService = new Mock<SeasonService>(mockRepo.Object);
            var season = new Season { SeasonId = 2, CompanyId = 1, Description = "Current", CurrentSeason = true };
            mockRepo.Setup(r => r.GetCurrentSeason(It.IsAny<int>())).ReturnsAsync(season);
            var controller = new SeasonController(mockRepo.Object, mockService.Object);
            var result = await controller.GetCurrentSeason(1);
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedSeason = Assert.IsType<Season>(okResult.Value);
            Assert.Equal(2, returnedSeason.SeasonId);
        }

        [Fact]
        public async Task GetCurrentSeason_ReturnsNotFound_WhenNoSeason()
        {
            var mockRepo = new Mock<ISeasonRepository>();
            var mockService = new Mock<SeasonService>(mockRepo.Object);
            mockRepo.Setup(r => r.GetCurrentSeason(It.IsAny<int>())).ReturnsAsync((Season)null);
            var controller = new SeasonController(mockRepo.Object, mockService.Object);
            var result = await controller.GetCurrentSeason(1);
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public void GetSeasonById_ReturnsOkResult_WhenSeasonExists()
        {
            var mockRepo = new Mock<ISeasonRepository>();
            var mockService = new Mock<SeasonService>(mockRepo.Object);
            var season = new Season { SeasonId = 3, Description = "ById" };
            mockRepo.Setup(r => r.GetById(3)).Returns(season);
            var controller = new SeasonController(mockRepo.Object, mockService.Object);
            var result = controller.GetSeason(3);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedSeason = Assert.IsType<Season>(okResult.Value);
            Assert.Equal(3, returnedSeason.SeasonId);
        }

        [Fact]
        public void GetSeasonById_ReturnsNotFound_WhenNoSeason()
        {
            var mockRepo = new Mock<ISeasonRepository>();
            var mockService = new Mock<SeasonService>(mockRepo.Object);
            mockRepo.Setup(r => r.GetById(99)).Returns((Season)null);
            var controller = new SeasonController(mockRepo.Object, mockService.Object);
            var result = controller.GetSeason(99);
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public void PutSeason_ReturnsOkResult_WhenIdsMatch()
        {
            var mockRepo = new Mock<ISeasonRepository>();
            var mockService = new Mock<SeasonService>(mockRepo.Object);
            var season = new Season { SeasonId = 4, Description = "Put" };
            mockRepo.Setup(r => r.Update(season)).Returns(season);
            var controller = new SeasonController(mockRepo.Object, mockService.Object);
            var result = controller.PutSeason(4, season);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedSeason = Assert.IsType<Season>(okResult.Value);
            Assert.Equal(4, returnedSeason.SeasonId);
        }

        [Fact]
        public void PutSeason_ReturnsBadRequest_WhenIdsDoNotMatch()
        {
            var mockRepo = new Mock<ISeasonRepository>();
            var mockService = new Mock<SeasonService>(mockRepo.Object);
            var season = new Season { SeasonId = 5, Description = "PutBad" };
            var controller = new SeasonController(mockRepo.Object, mockService.Object);
            var result = controller.PutSeason(6, season);
            Assert.IsType<BadRequestResult>(result.Result);
        }

        [Fact]
        public void PostSeason_ReturnsOkResult()
        {
            var mockRepo = new Mock<ISeasonRepository>();
            var mockService = new Mock<SeasonService>(mockRepo.Object);
            var season = new Season { SeasonId = 7, Description = "Post" };
            mockRepo.Setup(r => r.Insert(season)).Returns(season);
            var controller = new SeasonController(mockRepo.Object, mockService.Object);
            var result = controller.PostSeason(season);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedSeason = Assert.IsType<Season>(okResult.Value);
            Assert.Equal(7, returnedSeason.SeasonId);
        }

        [Fact]
        public void DeleteSeason_ReturnsOkResult_WhenSeasonExists()
        {
            var mockRepo = new Mock<ISeasonRepository>();
            var mockService = new Mock<SeasonService>(mockRepo.Object);
            var season = new Season { SeasonId = 8, Description = "Delete" };
            mockRepo.Setup(r => r.GetById(8)).Returns(season);
            var controller = new SeasonController(mockRepo.Object, mockService.Object);
            var result = controller.DeleteSeason(8);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedSeason = Assert.IsType<Season>(okResult.Value);
            Assert.Equal(8, returnedSeason.SeasonId);
        }

        [Fact]
        public void DeleteSeason_ReturnsNotFound_WhenNoSeason()
        {
            var mockRepo = new Mock<ISeasonRepository>();
            var mockService = new Mock<SeasonService>(mockRepo.Object);
            mockRepo.Setup(r => r.GetById(99)).Returns((Season)null);
            var controller = new SeasonController(mockRepo.Object, mockService.Object);
            var result = controller.DeleteSeason(99);
            Assert.IsType<NotFoundResult>(result.Result);
        }
    }
}
