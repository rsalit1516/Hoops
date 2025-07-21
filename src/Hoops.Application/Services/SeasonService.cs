using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.Interface; // Update this to the correct namespace where ISeasonRepository is defined

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
        /// <param name="companyId">The company ID.</param>
        /// <returns>The current Season.</returns>
        public async Task<Season> GetCurrentSeasonAsync(int companyId)
        {
            // Business rule: Only one current season per company should exist.
            var season = await _seasonRepository.GetCurrentSeason(companyId);
            if (season == null)
                throw new InvalidOperationException($"No current season found for company {companyId}.");
            return season;
        }

        public async Task<IEnumerable<Season>> GetAllSeasonsAsync()
        {
            return await _seasonRepository.GetAllAsync(1);
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
}