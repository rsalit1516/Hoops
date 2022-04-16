using Microsoft.VisualStudio.TestTools.UnitTesting;
using Hoops.Infrastructure.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hoops.Core;
using Microsoft.Extensions.Logging;

namespace Hoops.Infrastructure.Repository.Tests
{
    [TestClass()]
    public class ScheduleGameRepositoryTests
    {
        private readonly ILogger<ScheduleGameRepository> _logger;

        [TestMethod()]
        public async void GetSeasonGamesAsyncTest()
        {
            using (var db = new hoopsContext())
            {
                var repGames = new ScheduleGameRepository(db, _logger);
                var games = await repGames.GetSeasonGamesAsync(2021);
                Assert.IsTrue(games.Any());
            }
        }
    }
}