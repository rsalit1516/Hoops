using System;
using Hoops.Core;
using Hoops.Core.Models;
using Hoops.Infrastructure.Repository;
using Xunit;

namespace csbc_server_test
{
    public class ScheduleGamesRepositoryTests
    {
        [Fact]
        public void ScheduleGamesRepositoryTest1()
        {
            var repo = new ScheduleGameRepository(new hoopsContext());
            var actual = repo.GetSeasonGamesAsync(2192);
            Assert.True(actual.Result != null);
        }
    }
}
