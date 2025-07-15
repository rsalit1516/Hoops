using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Infrastructure.Data;
using Hoops.Core.Interface;
using Hoops.Data.Seeders;
using Hoops.Core.Models;

namespace Hoops.Data
{
    public class SeedCoordinator
    {

        public hoopsContext context { get; private set; }
        private ColorSeeder _colorSeeder { get; set; }
        private LocationSeeder _locationSeeder { get; set; }
        private SeasonSeeder _seasonSeeder { get; set; }
        private DivisionSeeder _divisionSeeder { get; set; }
        private TeamSeeder _teamSeeder { get; set; }
        private LocationSeeder _locationSeeder { get; set; }
        private ScheduleGameSeeder _scheduleGameSeeder { get; set; }
        private WebContentTypeSeeder _webContentTypeSeeder { get; set; }
        private WebContentSeeder _webContentSeeder { get; set; }
        private HouseholdAndPeopleSeeder _householdAndPeopleSeeder { get; set; }
        public SeedCoordinator(
        hoopsContext context,
        SeasonSeeder seasonSeeder,
        DivisionSeeder divisionSeeder,
        LocationSeeder locationSeeder,
        ColorSeeder colorSeeder,
        TeamSeeder teamSeeder,
        ScheduleGameSeeder scheduleGameSeeder,
        WebContentTypeSeeder webContentTypeSeeder,
        WebContentSeeder webContentSeeder,
        HouseholdAndPeopleSeeder householdAndPeopleSeeder)
        {
            this.context = context;
            _colorSeeder = colorSeeder;
            _locationSeeder = locationSeeder;
            _seasonSeeder = seasonSeeder;
            _divisionSeeder = divisionSeeder;
            _teamSeeder = teamSeeder;
            _scheduleGameSeeder = scheduleGameSeeder;
            _webContentTypeSeeder = webContentTypeSeeder;
            _webContentSeeder = webContentSeeder;
            _householdAndPeopleSeeder = householdAndPeopleSeeder;
        }
        public async Task InitializeDataAsync()
        {
            //first delete all records    
            await _scheduleGameSeeder.DeleteAllAsync();
            await _teamSeeder.DeleteAllAsync();
            await _divisionSeeder.DeleteAllAsync();
            await _seasonSeeder.DeleteAllAsync();
            await _colorSeeder.DeleteAllAsync();
            await _locationSeeder.DeleteAllAsync();
            await _colorSeeder.DeleteAllAsync();
            await _locationSeeder.DeleteAllAsync();
            await _webContentSeeder.DeleteAllAsync();
            await _webContentTypeSeeder.DeleteAllAsync();
            await _householdAndPeopleSeeder.DeleteAllAsync();

            //then create new records
            await _colorSeeder.SeedAsync();
            await _locationSeeder.SeedAsync();
            await _locationSeeder.SeedAsync();
            await _seasonSeeder.SeedAsync();
            await _divisionSeeder.SeedAsync();
            await _teamSeeder.SeedAsync();
            await _scheduleGameSeeder.SeedAsync();
            await _webContentTypeSeeder.SeedAsync();
            await _webContentSeeder.SeedAsync();
            await _householdAndPeopleSeeder.SeedAsync();
        }
    }
}