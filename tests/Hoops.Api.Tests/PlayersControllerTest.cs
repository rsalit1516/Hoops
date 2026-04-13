using Hoops.Application.Services;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace Hoops.Api.Tests
{
    public class PlayersServiceTest
    {
        private readonly Mock<IPlayerRepository> _mockPlayerRepository;
        private readonly Mock<IPersonRepository> _mockPersonRepository;
        private readonly Mock<ISeasonRepository> _mockSeasonRepository;
        private readonly Mock<IDivisionRepository> _mockDivisionRepository;
        private readonly PlayerService _service;

        public PlayersServiceTest()
        {
            _mockPlayerRepository = new Mock<IPlayerRepository>();
            _mockPersonRepository = new Mock<IPersonRepository>();
            _mockSeasonRepository = new Mock<ISeasonRepository>();
            _mockDivisionRepository = new Mock<IDivisionRepository>();
            _service = new PlayerService(
                _mockPlayerRepository.Object,
                _mockPersonRepository.Object,
                _mockSeasonRepository.Object,
                _mockDivisionRepository.Object);
        }

        [Fact]
        public async Task GetPlayerByIdAsync_WithValidId_ReturnsPlayer()
        {
            // Arrange
            var playerId = 1;
            var expectedPlayer = new Player { PlayerId = playerId, PersonId = 100 };
            _mockPlayerRepository.Setup(r => r.GetById(playerId)).Returns(expectedPlayer);

            // Act
            var result = await _service.GetPlayerByIdAsync(playerId);

            // Assert
            Assert.Equal(playerId, result.PlayerId);
            Assert.Equal(100, result.PersonId);
        }

        [Fact]
        public async Task GetPlayerByIdAsync_WithInvalidId_ThrowsInvalidOperationException()
        {
            // Arrange
            var playerId = 999;
            _mockPlayerRepository.Setup(r => r.GetById(playerId)).Returns((Player)null);

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _service.GetPlayerByIdAsync(playerId));
        }

        [Fact]
        public async Task UpdatePlayerAsync_WithValidData_ReturnsUpdatedPlayer()
        {
            // Arrange
            var player = new Player { PlayerId = 1, PersonId = 100, SeasonId = 1 };
            _mockPlayerRepository.Setup(r => r.GetById(player.PlayerId)).Returns(player);
            _mockPlayerRepository.Setup(r => r.Update(It.IsAny<Player>())).Returns(player);

            // Act
            var result = await _service.UpdatePlayerAsync(player);

            // Assert
            Assert.Equal(player.PlayerId, result.PlayerId);
            _mockPlayerRepository.Verify(r => r.Update(It.IsAny<Player>()), Times.Once);
            _mockPlayerRepository.Verify(r => r.SaveChanges(), Times.Once);
        }

        [Fact]
        public async Task UpdatePlayerAsync_WithNullPlayer_ThrowsArgumentNullException()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentNullException>(() => _service.UpdatePlayerAsync(null));
        }

        [Fact]
        public async Task UpdatePlayerAsync_WithNonExistentPlayer_ThrowsInvalidOperationException()
        {
            // Arrange
            var player = new Player { PlayerId = 999, PersonId = 100 };
            _mockPlayerRepository.Setup(r => r.GetById(player.PlayerId)).Returns((Player)null);

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _service.UpdatePlayerAsync(player));
        }

        [Fact]
        public async Task DetermineDivisionAsync_WithEligiblePerson_ReturnsDivisionId()
        {
            // Arrange
            var personId = 100;
            var seasonId = 1;
            var birthDate = new DateTime(2015, 6, 1);
            var person = new Person { PersonId = personId, BirthDate = birthDate, Gender = "M" };
            var division = new Division
            {
                DivisionId = 5,
                SeasonId = seasonId,
                Gender = "M",
                MinDate = new DateTime(2012, 1, 1),
                MaxDate = new DateTime(2017, 12, 31)
            };

            _mockPersonRepository.Setup(r => r.GetById(personId)).Returns(person);
            _mockDivisionRepository.Setup(r => r.GetSeasonDivisionsAsync(seasonId))
                .ReturnsAsync(new List<Division> { division });

            // Act
            var result = await _service.DetermineDivisionAsync(personId, seasonId);

            // Assert
            Assert.Equal(5, result);
        }

        [Fact]
        public async Task DetermineDivisionAsync_WithPersonMissingBirthDate_ReturnsNull()
        {
            // Arrange
            var personId = 100;
            var seasonId = 1;
            var person = new Person { PersonId = personId, BirthDate = null, Gender = "M" };

            _mockPersonRepository.Setup(r => r.GetById(personId)).Returns(person);

            // Act
            var result = await _service.DetermineDivisionAsync(personId, seasonId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task DetermineDivisionAsync_WithPersonMissingGender_ReturnsNull()
        {
            // Arrange
            var personId = 100;
            var seasonId = 1;
            var person = new Person { PersonId = personId, BirthDate = new DateTime(2015, 1, 1), Gender = null };

            _mockPersonRepository.Setup(r => r.GetById(personId)).Returns(person);

            // Act
            var result = await _service.DetermineDivisionAsync(personId, seasonId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task DetermineDivisionAsync_WhenNoMatchingDivision_ReturnsNull()
        {
            // Arrange
            var personId = 100;
            var seasonId = 1;
            // Born 2005 — won't fit in the 2012-2017 range
            var person = new Person { PersonId = personId, BirthDate = new DateTime(2005, 1, 1), Gender = "M" };
            var division = new Division
            {
                DivisionId = 5,
                SeasonId = seasonId,
                Gender = "M",
                MinDate = new DateTime(2012, 1, 1),
                MaxDate = new DateTime(2017, 12, 31)
            };

            _mockPersonRepository.Setup(r => r.GetById(personId)).Returns(person);
            _mockDivisionRepository.Setup(r => r.GetSeasonDivisionsAsync(seasonId))
                .ReturnsAsync(new List<Division> { division });

            // Act
            var result = await _service.DetermineDivisionAsync(personId, seasonId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task CreatePlayerRegistrationAsync_WithValidData_CreatesPlayerWithDivision()
        {
            // Arrange
            var personId = 100;
            var seasonId = 1;
            var birthDate = new DateTime(2015, 6, 1);
            var person = new Person { PersonId = personId, BirthDate = birthDate, Gender = "M" };
            var season = new Season { SeasonId = seasonId, ParticipationFee = 75m };
            var division = new Division
            {
                DivisionId = 5,
                SeasonId = seasonId,
                Gender = "M",
                MinDate = new DateTime(2012, 1, 1),
                MaxDate = new DateTime(2017, 12, 31)
            };
            var createdPlayer = new Player { PlayerId = 1, PersonId = personId, SeasonId = seasonId, DivisionId = 5 };

            _mockPersonRepository.Setup(r => r.GetById(personId)).Returns(person);
            _mockSeasonRepository.Setup(r => r.GetByIdAsync(seasonId)).ReturnsAsync(season);
            _mockDivisionRepository.Setup(r => r.GetSeasonDivisionsAsync(seasonId))
                .ReturnsAsync(new List<Division> { division });
            _mockPlayerRepository.Setup(r => r.Insert(It.IsAny<Player>())).Returns(createdPlayer);

            // Act
            var result = await _service.CreatePlayerRegistrationAsync(personId, seasonId);

            // Assert
            Assert.Equal(1, result.PlayerId);
            Assert.Equal(5, result.DivisionId);
            _mockPlayerRepository.Verify(r => r.Insert(It.Is<Player>(p =>
                p.PersonId == personId && p.SeasonId == seasonId && p.DivisionId == 5)), Times.Once);
            _mockPlayerRepository.Verify(r => r.SaveChanges(), Times.Once);
        }

        [Fact]
        public async Task CreatePlayerRegistrationAsync_WithUnknownPerson_ThrowsInvalidOperationException()
        {
            // Arrange
            var personId = 999;
            var seasonId = 1;
            _mockPersonRepository.Setup(r => r.GetById(personId)).Returns((Person)null);

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(
                () => _service.CreatePlayerRegistrationAsync(personId, seasonId));
        }

        [Fact]
        public async Task CreatePlayerRegistrationAsync_WithUnknownSeason_ThrowsInvalidOperationException()
        {
            // Arrange
            var personId = 100;
            var seasonId = 999;
            var person = new Person { PersonId = personId, BirthDate = new DateTime(2015, 1, 1), Gender = "M" };

            _mockPersonRepository.Setup(r => r.GetById(personId)).Returns(person);
            _mockSeasonRepository.Setup(r => r.GetByIdAsync(seasonId)).ReturnsAsync((Season)null);

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(
                () => _service.CreatePlayerRegistrationAsync(personId, seasonId));
        }
    }
}
