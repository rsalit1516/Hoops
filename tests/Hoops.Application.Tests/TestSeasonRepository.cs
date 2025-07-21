using Hoops.Core.Models;
using Hoops.Core.Interface;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hoops.Application.Tests
{
    // Simple in-memory implementation for testing SeasonService
    public class TestSeasonRepository : ISeasonRepository
    {
        private readonly List<Season> _seasons = new();
        public void AddSeason(Season season) => _seasons.Add(season);
        public Task<List<Season>> GetAllAsync(int companyId) => Task.FromResult(_seasons.Where(s => s.CompanyId == companyId).ToList());
        public Season GetSeason(int companyId, int seasonId = 0) => _seasons.First(s => s.CompanyId == companyId && s.SeasonId == seasonId);
        public Task<Season> GetCurrentSeason(int companyId) => Task.FromResult(_seasons.FirstOrDefault(s => s.CompanyId == companyId && s.CurrentSeason == true));
        public int GetSeason(int companyId, string seasonDescription) => _seasons.First(s => s.CompanyId == companyId && s.Description == seasonDescription).SeasonId;
        public IQueryable<Season> GetSeasons(int companyId) => _seasons.Where(s => s.CompanyId == companyId).AsQueryable();
        // IRepository<Season> members (not used in service tests)
        public Task<Season> GetByIdAsync(int id) => Task.FromResult(_seasons.First(s => s.SeasonId == id));
        public Task<IEnumerable<Season>> GetAllAsync() => Task.FromResult(_seasons.AsEnumerable());
        public Task<Season> InsertAsync(Season entity) { _seasons.Add(entity); return Task.FromResult(entity); }
        public Task<bool> UpdateAsync(Season entity) => Task.FromResult(true);
        public Task<bool> DeleteAsync(int id) { _seasons.RemoveAll(s => s.SeasonId == id); return Task.FromResult(true); }
    }
}
