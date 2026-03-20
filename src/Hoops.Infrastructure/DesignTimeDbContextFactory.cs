using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Hoops.Infrastructure.Data;

namespace Hoops.Infrastructure
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<hoopsContext>
    {
        public hoopsContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<hoopsContext>();
            optionsBuilder.UseSqlServer("Server=localhost,1433;Database=csbchoops;Persist Security Info=False;User ID=sa;Password=@nKbr0407; Encrypt=True;TrustServerCertificate=true;MultipleActiveResultSets=False;Encrypt=True;Connection Timeout=30;")
                .ConfigureWarnings(warnings => warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
            
            return new hoopsContext(optionsBuilder.Options);
        }
    }
}
