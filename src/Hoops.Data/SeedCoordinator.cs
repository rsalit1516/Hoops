using System.Threading.Tasks;
using Hoops.Infrastructure.Data;
using Hoops.Core.Interface;
using Hoops.Data.Seeders;

namespace Hoops.Data
{
    public class SeedCoordinator
    {

        public hoopsContext context { get; private set; }
        private ColorSeeder _colorSeeder { get; set; }
        private SeasonSeeder _seasonSeeder { get; set; }
        private DivisionSeeder _divisionSeeder { get; set; }
        private TeamSeeder _teamSeeder { get; set; }
        private WebContentTypeSeeder _webContentTypeSeeder { get; set; }
        private WebContentSeeder _webContentSeeder { get; set; }
        private HouseholdAndPeopleSeeder _householdAndPeopleSeeder { get; set; }
        public SeedCoordinator(ISeasonRepository seasonRepo,
        hoopsContext context,
        SeasonSeeder seasonSeeder,
                DivisionSeeder divisionSeeder,
                ColorSeeder colorSeeder,
                TeamSeeder teamSeeder,
                WebContentTypeSeeder webContentTypeSeeder,
        WebContentSeeder webContentSeeder,
        HouseholdAndPeopleSeeder householdAndPeopleSeeder)
        {
            this.context = context;
            _colorSeeder = colorSeeder;
            _seasonSeeder = seasonSeeder;
            _divisionSeeder = divisionSeeder;
            _teamSeeder = teamSeeder;
            _webContentTypeSeeder = webContentTypeSeeder;
            _webContentSeeder = webContentSeeder;
            _householdAndPeopleSeeder = householdAndPeopleSeeder;
        }
        public async Task InitializeDataAsync()
        {
            //first delete all records    
            await _colorSeeder.DeleteAllAsync();
            await _teamSeeder.DeleteAllAsync();
            await _divisionSeeder.DeleteAllAsync();// await DeleteDivisionsAsyn
            await _seasonSeeder.DeleteAllAsync();

            await _webContentSeeder.DeleteAllAsync();
            await _webContentTypeSeeder.DeleteAllAsync();
            await _householdAndPeopleSeeder.DeleteAllAsync();

            //then create new records
            await _colorSeeder.SeedAsync();
            await _seasonSeeder.SeedAsync();
            await _divisionSeeder.SeedAsync();
            await _teamSeeder.SeedAsync();
            await _webContentTypeSeeder.SeedAsync();
            await _webContentSeeder.SeedAsync();
            await _householdAndPeopleSeeder.SeedAsync();
        }
    }
}