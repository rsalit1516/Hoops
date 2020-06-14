using System;
using Xunit;
using csbc_server.Infrastructure.Repository;
using Csbc.Infrastructure;
using Csbc.Entities;

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
