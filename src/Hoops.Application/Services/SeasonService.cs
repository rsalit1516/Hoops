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

        public async Task<IEnumerable<Season>> GetAllSeasonsAsync()
        {
            return await _seasonRepository.GetAllAsync();
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