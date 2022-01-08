using System.Linq;
using Microsoft.Extensions.Logging;
using Hoops.Infrastructure.Interface;
using System.Threading.Tasks;
using Hoops.Infrastructure.Repository;
using Xunit;


namespace Hoops.CoreTests
{
    public class ScheduleGameRepositoryTests : TestWithSqlite
    {
        private readonly IScheduleGameRepository repository;
        private readonly ILogger<ScheduleGameRepository> _logger;


        [Fact]
        public async Task GetSeasonGamesAsyncTest()
        {
            var repGames = new ScheduleGameRepository(DbContext, _logger);
            var games = await repGames.GetSeasonGamesAsync(2021);
            Assert.True(games.Any());
        }
    }
}