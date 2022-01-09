using System.Linq;
using Microsoft.Extensions.Logging;
using Hoops.Infrastructure.Interface;
using System.Threading.Tasks;
using Hoops.Infrastructure.Repository;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Hoops.Core.Tests
{
    [TestClass]
    public class ScheduleGameRepositoryTests : TestWithSqlite
    {
        private readonly IScheduleGameRepository repository;
        private readonly ILogger<ScheduleGameRepository> _logger;


        [TestMethod]
        public async Task GetSeasonGamesAsyncTest()
        {
            var repGames = new ScheduleGameRepository(DbContext, _logger);
            var games = await repository.GetSeasonGamesAsync(2021);
            Assert.IsTrue(games.Any());
        }

        [TestMethod]
        public void ScheduleGamesRepositoryGetStandings()
        {
            // var repo = new ScheduleGameRepository(new hoopsContext());
            var actual = repository.GetStandings(4119);
            Assert.IsTrue(actual != null);
        }
    }
}