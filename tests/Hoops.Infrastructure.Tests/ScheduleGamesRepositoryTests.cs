using Hoops.Core;
using Hoops.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Xunit;
using System.Threading.Tasks;
using Hoops.Infrastructure.Data;

namespace Hoops.Test
{
    public class ScheduleGamesRepositoryTests
    {
        private readonly hoopsContext _context;
        public ScheduleGameRepository repo;
        private ILogger<ScheduleGameRepository> _logger;

        // public ScheduleGamesRepositoryTests(ILogger<ScheduleGameRepository> logger)
        // {
        //     // _logger = logger;
        //     var options = new DbContextOptionsBuilder<hoopsContext>()
        //         .UseInMemoryDatabase(databaseName: "hoops")
        //         .Options;
        //     _context = new hoopsContext(options);
        //     repo = new ScheduleGameRepository(_context, logger);
        // }
        public ScheduleGamesRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<hoopsContext>()
                .UseInMemoryDatabase(databaseName: "hoops")
                .Options;
            _context = new hoopsContext(options);
            repo = new ScheduleGameRepository(_context, _logger);
        }
        /// <summary>
        /// Test method for the ScheduleGamesRepository.
        /// </summary>
        [Fact]
        public async Task ScheduleGamesRepositoryTest1()
        {
            // var repo = new ScheduleGameRepository(new hoopsContext());
            var actual = await repo.GetSeasonGamesAsync(2203);
            Assert.True(actual != null);
        }
        [Fact]
        public void ScheduleGamesRepositoryGetStandings()
        {
            // var repo = new ScheduleGameRepository(new hoopsContext());
            // var actual = repo.GetStandings(4119);
            // Assert.True(actual != null);
            
        }
        [Fact]
        public void ScheduleGamesRepositoryTestTest()
        {
            var x = true;
            Assert.True(x);

        }

        internal void Dispose()
        {
            _context.Dispose();
        }
    }

}
