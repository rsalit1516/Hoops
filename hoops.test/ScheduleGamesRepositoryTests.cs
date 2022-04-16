using System;
using Hoops.Core;
using Hoops.Core.Models;
using Hoops.Infrastructure.Repository;
using Microsoft.Extensions.Logging;
using Xunit;

namespace csbc_server_test
{
    public class ScheduleGamesRepositoryTests
    {
        public hoopsContext context;
        public ScheduleGameRepository repo;
        private readonly ILogger<ScheduleGameRepository> _logger;
        public ScheduleGamesRepositoryTests()
        {
            context = new hoopsContext();
            repo = new ScheduleGameRepository(context, _logger);
        //     // _context = contex
        }
        [Fact]
        public void ScheduleGamesRepositoryTest1()
        {
            // var repo = new ScheduleGameRepository(new hoopsContext());
            var actual = repo.GetSeasonGamesAsync(2203);
            Assert.True(actual.Result != null);
        }
        [Fact]
        public void ScheduleGamesRepositoryGetStandings()
        {
            // var repo = new ScheduleGameRepository(new hoopsContext());
            var actual = repo.GetStandings(4119);
            Assert.True(actual != null);
            
        }
        [Fact]
        public void ScheduleGamesRepositoryTestTest()
        {
            var x = true;
            Assert.True(x);

        }
    }

}
