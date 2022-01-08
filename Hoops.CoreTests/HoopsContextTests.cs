using System.Threading.Tasks;
using Xunit;

namespace Hoops.CoreTests
{
    public class HoopsContextTests: TestWithSqlite
    {
        [Fact]
        public async Task DatabaseIsAvailableAndCanBeConnectedTo() => Assert.True(await DbContext.Database.CanConnectAsync());
    }
}