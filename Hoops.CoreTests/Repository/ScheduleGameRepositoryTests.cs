using Microsoft.VisualStudio.TestTools.UnitTesting;
using Hoops.Infrastructure.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hoops.Core;

namespace Hoops.Infrastructure.Repository.Tests
{
    [TestClass()]
    public class ScheduleGameRepositoryTests
    {
        [TestMethod()]
        public async void GetSeasonGamesAsyncTest()
        {
            using (var db = new hoopsContext())
            {
                var repGames = new ScheduleGameRepository(db);
                var games = await repGames.GetSeasonGamesAsync(2021);
                Assert.IsTrue(games.Any());
            }
        }
    }
}