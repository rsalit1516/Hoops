using System;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;

namespace Hoops.Application.Services
{
    public class PlayerService : IPlayerService
    {
        private readonly IPlayerRepository _playerRepository;
        private readonly IPersonRepository _personRepository;
        private readonly ISeasonRepository _seasonRepository;
        private readonly IDivisionRepository _divisionRepository;

        public PlayerService(
            IPlayerRepository playerRepository,
            IPersonRepository personRepository,
            ISeasonRepository seasonRepository,
            IDivisionRepository divisionRepository)
        {
            _playerRepository = playerRepository;
            _personRepository = personRepository;
            _seasonRepository = seasonRepository;
            _divisionRepository = divisionRepository;
        }

        /// <summary>
        /// Creates a new player registration for a person
        /// </summary>
        public async Task<Player> CreatePlayerRegistrationAsync(int personId, int seasonId)
        {
            // Get the person
            var person = _personRepository.GetById(personId);
            if (person == null)
            {
                throw new InvalidOperationException($"Person with ID {personId} not found.");
            }

            // Get the season
            var season = await _seasonRepository.GetByIdAsync(seasonId);
            if (season == null)
            {
                throw new InvalidOperationException($"Season with ID {seasonId} not found.");
            }

            // Determine division based on birthdate and gender
            var divisionId = await DetermineDivisionAsync(personId, seasonId);

            // Create the player
            var player = new Player
            {
                PersonId = personId,
                SeasonId = seasonId,
                DivisionId = divisionId,
                PaidAmount = season.ParticipationFee,
                BalanceOwed = season.ParticipationFee,
            };

            // Insert the player
            var createdPlayer = _playerRepository.Insert(player);
            _playerRepository.SaveChanges();

            return createdPlayer;
        }

        /// <summary>
        /// Updates an existing player registration
        /// </summary>
        public async Task<Player> UpdatePlayerAsync(Player player)
        {
            if (player == null)
            {
                throw new ArgumentNullException(nameof(player));
            }

            var existingPlayer = _playerRepository.GetById(player.PlayerId);
            if (existingPlayer == null)
            {
                throw new InvalidOperationException($"Player with ID {player.PlayerId} not found.");
            }

            var updatedPlayer = _playerRepository.Update(player);
            _playerRepository.SaveChanges();

            return await Task.FromResult(updatedPlayer);
        }

        /// <summary>
        /// Gets a player by ID
        /// </summary>
        public async Task<Player> GetPlayerByIdAsync(int playerId)
        {
            var player = _playerRepository.GetById(playerId);
            return await Task.FromResult(player ?? throw new InvalidOperationException($"Player with ID {playerId} not found."));
        }

        /// <summary>
        /// Determines the appropriate division for a person based on birthdate and gender
        /// </summary>
        public async Task<int?> DetermineDivisionAsync(int personId, int seasonId)
        {
            // Get the person
            var person = _personRepository.GetById(personId);
            if (person == null || !person.BirthDate.HasValue || string.IsNullOrEmpty(person.Gender))
            {
                return null;
            }

            // Get divisions for the season
            var divisions = await _divisionRepository.GetSeasonDivisionsAsync(seasonId);
            if (divisions == null || !divisions.Any())
            {
                return null;
            }

            // Find matching division based on gender and birthdate
            var matchingDivision = divisions.FirstOrDefault(d =>
            {
                // Check if the division matches using the built-in helper method
                return d.IsPlayerEligible(person.BirthDate.Value, person.Gender);
            });

            return matchingDivision?.DivisionId;
        }
    }
}
