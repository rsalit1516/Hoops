// using Microsoft.VisualStudio.TestTools.UnitTesting;
// using System.Linq;
// using System.Threading.Tasks;
// using Hoops.Core;
// using Microsoft.Extensions.Logging;
// using Microsoft.EntityFrameworkCore;

// namespace Hoops.Infrastructure.Repository.Tests
// {
//     [TestClass()]
//     public class ScheduleGameRepositoryTests
//     {
//         private readonly ILogger<ScheduleGameRepository> _logger;
//         private readonly hoopsContext _context;

//         public ScheduleGameRepositoryTests()
//         {
//             var options = new DbContextOptionsBuilder<hoopsContext>()
//                 .UseInMemoryDatabase(databaseName: "test")
//                 .Options;
//             _context = new hoopsContext(options);
//             _logger = new LoggerFactory().CreateLogger<ScheduleGameRepository>();
//         }

//         [TestMethod()]
//         public async Task GetSeasonGamesAsyncTest()
//         {
//             var repGames = new ScheduleGameRepository(_context, _logger);
//             var games = await repGames.GetSeasonGamesAsync(2021);
//             Assert.IsTrue(games.Any());
//         }

//         public void Dispose()
//         {
//             _context.Dispose();
//         }
            
//     }
// }