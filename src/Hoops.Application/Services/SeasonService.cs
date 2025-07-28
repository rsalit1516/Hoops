using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Interface; // Update this to the correct namespace where ISeasonRepository is defined
using Hoops.Core.Models;

namespace Hoops.Application.Services
{
    public class SeasonService
    {
        private readonly ISeasonRepository _seasonRepository;

        public SeasonService(ISeasonRepository seasonRepository)
        {
            _seasonRepository = seasonRepository;
        }

        /// <summary>
        /// Returns the current active season for a company, or throws if not found.
        /// </summary>
        public async Task<Season> GetCurrentSeasonAsync(int companyId)
        {
            var season = await _seasonRepository.GetCurrentSeason(companyId);
            if (season == null)
                throw new InvalidOperationException(
                    $"No current season found for company {companyId}."
                );
            return season;
        }

        public async Task<IEnumerable<Season>> GetAllSeasonsAsync()
        {
            return await _seasonRepository.GetAllAsync(1);
        }

        // --- Aggregate Root Methods ---

        public async Task<Division> AddDivisionToSeason(int seasonId, Division division)
        {
            var season = await _seasonRepository.GetByIdAsync(seasonId);
            if (season == null)
                throw new InvalidOperationException($"Season {seasonId} not found.");
            if (season.Divisions == null)
                season.Divisions = new List<Division>();
            season.Divisions.Add(division);
            await _seasonRepository.UpdateAsync(season);
            return division;
        }

        public async Task<Team> AddTeamToSeason(int seasonId, Team team)
        {
            var season = await _seasonRepository.GetByIdAsync(seasonId);
            if (season == null)
                throw new InvalidOperationException($"Season {seasonId} not found.");
            if (season.Teams == null)
                season.Teams = new List<Team>();
            season.Teams.Add(team);
            await _seasonRepository.UpdateAsync(season);
            return team;
        }

        public async Task<ScheduleGame> AddScheduleGameToSeason(int seasonId, ScheduleGame game)
        {
            var season =
                await _seasonRepository.GetByIdAsync(seasonId)
                ?? throw new InvalidOperationException($"Season {seasonId} not found.");
            season.ScheduleGames ??= new List<ScheduleGame>();
            season.ScheduleGames.Add(game);
            await _seasonRepository.UpdateAsync(season);
            return game;
        }

        public async Task<ScheduleDivTeam> AddScheduleDivTeamToSeason(
            int seasonId,
            ScheduleDivTeam scheduleDivTeam
        )
        {
            var season = await _seasonRepository.GetByIdAsync(seasonId);
            if (season == null)
                throw new InvalidOperationException($"Season {seasonId} not found.");
            if (season.ScheduleDivTeams == null)
                season.ScheduleDivTeams = new List<ScheduleDivTeam>();
            season.ScheduleDivTeams.Add(scheduleDivTeam);
            await _seasonRepository.UpdateAsync(season);
            return scheduleDivTeam;
        }

        // Optionally, add Remove/Update methods for each entity as needed
    }

    // public async Task<Season?> GetSeasonByIdAsync(int seasonId)
    // {
    //     return await _seasonRepository.GetByIdAsync(seasonId);
    // }

    // public async Task<Season> CreateSeasonAsync(Season season)
    // {
    //     await _seasonRepository.AddAsync(season);
    //     return season;
    // }

    // public async Task<bool> UpdateSeasonAsync(Season season)
    // {
    //     return await _seasonRepository.UpdateAsync(season);
    // }

    // public async Task<bool> DeleteSeasonAsync(int seasonId)
    // {
    //     return await _seasonRepository.DeleteAsync(seasonId);
    // }
}
