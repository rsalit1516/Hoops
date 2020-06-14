
namespace hoops.Data
{
    static async Task InitializeSeasonsAsync()
    {
        using (var context = new hoopsContext())
        {
            var seasonRepo = new SeasonRepository(context);
            await seasonRepo.InsertAsync(new Season
            {
                SeaDesc = "Summer 2020",
                CurrentSchedule = true,
                CurrentSignUps = true,
                CurrentSeason = true,
                CompanyId = 1,
                FromDate = new DateTime(2020, 6, 15),
                ToDate = new DateTime(2020, 8, 31),
                ParticipationFee = 110

            });
            await seasonRepo.InsertAsync(new Season
            {
                SeaDesc = "Sprint 2020",
                CurrentSchedule = false,
                CurrentSignUps = false,
                CurrentSeason = false,
                CompanyId = 1,
                FromDate = new DateTime(2020, 3, 15),
                ToDate = new DateTime(2020, 5, 16),
                ParticipationFee = 110
            });
            await context.SaveChangesAsync();
        };
    }
}