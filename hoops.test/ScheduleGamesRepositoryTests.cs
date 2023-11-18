using Microsoft.Extensions.Logging;
using Hoops.Core;
using Hoops.Infrastructure.Repository;
using Xunit;
using Microsoft.EntityFrameworkCore;


namespace hoops_test
{
    public class ScheduleGamesRepositoryTests
    {
        private readonly hoopsContext _context;
        // public hoopsContext context;
        public ScheduleGameRepository repo;
        private readonly ILogger<ScheduleGameRepository> _logger;

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
