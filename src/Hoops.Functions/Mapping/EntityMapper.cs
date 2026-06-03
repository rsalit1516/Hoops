using Hoops.Core.Models;
using Hoops.Functions.Models;

namespace Hoops.Functions.Mapping;

internal static class EntityMapper
{
    internal static PersonDto ToDto(Person p) => new()
    {
        PersonId = p.PersonId,
        CompanyId = p.CompanyId,
        HouseId = p.HouseId,
        FirstName = p.FirstName,
        LastName = p.LastName,
        Workphone = p.Workphone,
        Cellphone = p.Cellphone,
        Email = p.Email,
        Suspended = p.Suspended,
        LatestSeason = p.LatestSeason,
        LatestShirtSize = p.LatestShirtSize,
        LatestRating = p.LatestRating,
        BirthDate = p.BirthDate,
        Bc = p.Bc,
        Gender = p.Gender,
        SchoolName = p.SchoolName,
        Grade = p.Grade,
        GiftedLevelsUp = p.GiftedLevelsUp,
        FeeWaived = p.FeeWaived,
        Player = p.Player,
        Parent = p.Parent,
        Coach = p.Coach,
        AsstCoach = p.AsstCoach,
        BoardOfficer = p.BoardOfficer,
        BoardMember = p.BoardMember,
        Ad = p.Ad,
        Sponsor = p.Sponsor,
        SignUps = p.SignUps,
        TryOuts = p.TryOuts,
        TeeShirts = p.TeeShirts,
        Printing = p.Printing,
        Equipment = p.Equipment,
        Electrician = p.Electrician,
        CreatedDate = p.CreatedDate,
        CreatedUser = p.CreatedUser,
        TempId = p.TempId
    };

    internal static Person FromDto(PersonDto dto) => new()
    {
        PersonId = dto.PersonId,
        CompanyId = dto.CompanyId,
        HouseId = dto.HouseId,
        FirstName = dto.FirstName ?? string.Empty,
        LastName = dto.LastName ?? string.Empty,
        Workphone = dto.Workphone,
        Cellphone = dto.Cellphone,
        Email = dto.Email,
        Suspended = dto.Suspended,
        LatestSeason = dto.LatestSeason,
        LatestShirtSize = dto.LatestShirtSize,
        LatestRating = dto.LatestRating,
        BirthDate = dto.BirthDate,
        Bc = dto.Bc,
        Gender = dto.Gender,
        SchoolName = dto.SchoolName,
        Grade = dto.Grade,
        GiftedLevelsUp = dto.GiftedLevelsUp,
        FeeWaived = dto.FeeWaived,
        Player = dto.Player,
        Parent = dto.Parent,
        Coach = dto.Coach,
        AsstCoach = dto.AsstCoach,
        BoardOfficer = dto.BoardOfficer,
        BoardMember = dto.BoardMember,
        Ad = dto.Ad,
        Sponsor = dto.Sponsor,
        SignUps = dto.SignUps,
        TryOuts = dto.TryOuts,
        TeeShirts = dto.TeeShirts,
        Printing = dto.Printing,
        Equipment = dto.Equipment,
        Electrician = dto.Electrician,
        CreatedDate = dto.CreatedDate,
        CreatedUser = dto.CreatedUser,
        TempId = dto.TempId
        // Intentionally omitting navigation properties (Household, Comments)
    };

    internal static HouseholdDto ToDto(Household h) => new()
    {
        HouseId = h.HouseId,
        Name = h.Name,
        Address1 = h.Address1,
        Address2 = h.Address2,
        City = h.City,
        State = h.State,
        Zip = h.Zip,
        Email = h.Email,
        Phone = h.Phone
    };

    internal static TeamDto ToDto(Team t) => new()
    {
        TeamId = t.TeamId,
        DivisionId = t.DivisionId,
        TeamColorId = t.TeamColorId,
        TeamName = t.TeamName,
        Name = t.TeamName,
        TeamNumber = t.TeamNumber,
        CreatedDate = t.CreatedDate,
        CreatedUser = t.CreatedUser
    };

    internal static PlayerDto ToDto(Player p) => new()
    {
        PlayerId = p.PlayerId,
        SeasonId = p.SeasonId,
        DivisionId = p.DivisionId,
        TeamId = p.TeamId,
        PersonId = p.PersonId,
        DraftId = p.DraftId,
        DraftNotes = p.DraftNotes,
        Rating = p.Rating,
        Coach = p.Coach,
        CoachId = p.CoachId,
        Sponsor = p.Sponsor,
        SponsorId = p.SponsorId,
        Ad = p.Ad,
        Scholarship = p.Scholarship,
        FamilyDisc = p.FamilyDisc,
        Rollover = p.Rollover,
        OutOfTown = p.OutOfTown,
        RefundBatchId = p.RefundBatchId,
        PaidDate = p.PaidDate,
        PaidAmount = p.PaidAmount,
        BalanceOwed = p.BalanceOwed,
        PayType = p.PayType,
        NoteDesc = p.NoteDesc,
        CheckMemo = p.CheckMemo,
        CreatedDate = p.CreatedDate,
        CreatedUser = p.CreatedUser,
        ModifiedDate = p.ModifiedDate,
        ModifiedUser = p.ModifiedUser,
        PlaysDown = p.PlaysDown,
        PlaysUp = p.PlaysUp,
        ShoppingCartId = p.ShoppingCartId
    };

    internal static SeasonDto ToDto(Season s) => new()
    {
        SeasonId = s.SeasonId,
        CompanyId = s.CompanyId,
        Description = s.Description,
        FromDate = s.FromDate,
        ToDate = s.ToDate,
        ParticipationFee = s.ParticipationFee,
        SponsorFee = s.SponsorFee,
        ConvenienceFee = s.ConvenienceFee,
        CurrentSeason = s.CurrentSeason,
        CurrentSchedule = s.CurrentSchedule,
        CurrentSignUps = s.CurrentSignUps,
        SignUpsDate = s.SignUpsDate,
        SignUpsEnd = s.SignUpsEnd,
        TestSeason = s.TestSeason,
        NewSchoolYear = s.NewSchoolYear,
        CreatedDate = s.CreatedDate,
        CreatedUser = s.CreatedUser
    };

    internal static Season ToEntity(SeasonDto d) => new()
    {
        SeasonId = d.SeasonId,
        CompanyId = d.CompanyId,
        Description = d.Description,
        FromDate = d.FromDate,
        ToDate = d.ToDate,
        ParticipationFee = d.ParticipationFee,
        SponsorFee = d.SponsorFee,
        ConvenienceFee = d.ConvenienceFee,
        CurrentSeason = d.CurrentSeason,
        CurrentSchedule = d.CurrentSchedule,
        CurrentSignUps = d.CurrentSignUps,
        SignUpsDate = d.SignUpsDate,
        SignUpsEnd = d.SignUpsEnd,
        TestSeason = d.TestSeason,
        NewSchoolYear = d.NewSchoolYear,
        CreatedDate = d.CreatedDate,
        CreatedUser = d.CreatedUser
    };
}
