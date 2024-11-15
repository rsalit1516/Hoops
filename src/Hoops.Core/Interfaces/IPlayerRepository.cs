using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;

namespace Hoops.Infrastructure.Interface
{
    public interface IPlayerRepository : IRepository<Player>
    {
        string GetNextDraftId(int companyId, int seasonId, int divisionId);
        int FindPlayerByLastName(int companyId, int seasonId, string lastName);
        IEnumerable<SeasonPlayer> GetSeasonPlayers(int seasonId);
        IQueryable<SeasonPlayer> GetDivisionPlayers(int divisionId);
        IQueryable<SeasonPlayer> GetTeamPlayers(int teamId);
        IQueryable<UndraftedPlayer> GetUndrafterPlayers(int divisionId);
        IQueryable<SeasonPlayer> GetPlayers(int seasonId);
        IQueryable<SeasonPlayer> GetPlayers(int seasonId, int coachId);
        IQueryable<SeasonPlayer> GetSponsorPlayers(int seasonId, int sponsorId);
        IQueryable<SeasonPlayer> GetCoachPlayers(int seasonId, int coachId);
        void SetDivision(int seasonId, int personId, int companyId);
        bool DeleteById(int id);
        Player GetByPersonId(int peopleId);
        bool WasPlayer(int peopleId);
        Player GetLastSeasonPlayed(int peopleId);
        Player GetPlayerByPersonAndSeasonId(int peopleId, int seasonId);
        IQueryable<Player> PlayerHistory(int personId);
        List<PlayerHistory> GetPlayerHistory(int peopleId);
    }
}
