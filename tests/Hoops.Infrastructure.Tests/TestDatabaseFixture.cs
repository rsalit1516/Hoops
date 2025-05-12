using Hoops.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Hoops.Data;

public class TestDatabaseFixture : IAsyncLifetime
{
    public hoopsContext? Context { get; private set; }

    public async Task InitializeAsync()
    {
        // Set up an in-memory database
        var options = new DbContextOptionsBuilder<hoopsContext>()
            .UseInMemoryDatabase(databaseName: "HoopsTestDb")
            .Options;

        Context = new hoopsContext(options);

        // Seed the database
        var seeder = new HoopsInitializer();
        await seeder.Seed(Context);
    }

    public async Task DisposeAsync()
    {
        if (Context != null)
        {
            await Task.Run(() => Context.Dispose());
        }
    }
}