using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Core.Tests
{

    public abstract class TestWithSqlite : IDisposable
    {
        private const string InMemoryConnectionString = "DataSource=:memory:";
        private readonly SqliteConnection _connection;

        protected readonly hoopsContext DbContext;

        protected TestWithSqlite()
        {
            _connection = new SqliteConnection(InMemoryConnectionString);
            _connection.Open();
            var options = new DbContextOptionsBuilder<hoopsContext>()
                    .UseSqlite(_connection)
                    .Options;
            DbContext = new hoopsContext(options);
            // DbContext.Database.EnsureCreated();
        }

        public void Dispose()
        {
            _connection.Close();
        }
    }
}
