using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Hoops.Core.Tests
{
    [TestClass]
    public class HoopsContextTests: TestWithSqlite
    {
        [TestMethod]
        public async Task DatabaseIsAvailableAndCanBeConnectedTo() => Assert.IsTrue(await DbContext.Database.CanConnectAsync());
    }
}