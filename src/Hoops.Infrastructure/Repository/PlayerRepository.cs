using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Hoops.Infrastructure.Data;

namespace Hoops.Infrastructure.Repository
{
    public class PlayerRepository : EFRepository<Player>, IPlayerRepository
    {
        public PlayerRepository(hoopsContext context) : base(context)
        {
            this.context = context;
        }

        #region IRepository<T> Members

        #endregion IRepository<T> Members

        //public Player Insert(Player entity)
        //{
        //    if (String.IsNullOrEmpty(entity.DraftId))
        //    {
        //        var draftId = GetNextDraftId((int)entity.CompanyId, (int)entity.SeasonId, (int)entity.DivisionId);
        //        entity.DraftId = draftId;
        //    }
        //    if (entity.PlayerId == 0)
        //    {
        //        entity.PlayerId = Datacontext.Set<Player>().Any() ? (Datacontext.Set<Player>().Max(p => p.PlayerId) + 1) : 1;
        //    }
        //    Datacontext.Set<Player>().Add(entity);
        //    var no = Datacontext.SaveChanges();
        //    SetDivision((int)entity.SeasonId, entity.PersonId, (int)entity.CompanyID);
        //    return entity;
        //}

        public string GetNextDraftId(int companyId, int seasonId, int divisionId)
        {
            var count = context.Set<Player>().Count(p => p.CompanyId == companyId && p.SeasonId == seasonId && p.DivisionId == divisionId);
            count = count + 1;
            return (count.ToString().PadLeft(3, '0'));
        }

        public int FindPlayerByLastName(int companyId, int seasonId, string lastName)
        {
            int id = 0;
            //need join to get
            //var player = Datacontext.Set<Player>().FirstOrDefault(n => n..LastName == name);
            //id = player.PersonId;

            return id;
        }

        public IEnumerable<SeasonPlayer> GetSeasonPlayers(int seasonId)
        {
            var players = context.Set<Player>()
                                .Where(p => p.SeasonId == seasonId)
                                .OrderBy(p => p.DraftId);
            var seasonPlayers = ConvertPlayersToSeasonPlayers(players);
            return seasonPlayers;
        }

        public IQueryable<SeasonPlayer> GetDivisionPlayers(int divisionId)
        {
            var teamPlayers = from p in context.Set<Player>()
                              from d in context.Set<Division>()
                              from person in context.Set<Person>()
                              where p.DivisionId == divisionId
                              where p.DivisionId == d.DivisionId
                              where p.PersonId == person.PersonId
                              orderby p.DraftId
                              select new
                              {
                                  p.PersonId,
                                  p.PlayerId,
                                  p.DivisionId,
                                  p.DraftId,
                                  p.Sponsor,
                                  d.DivisionDescription,
                                  p.Person.BirthDate,
                                  p.Person.LastName,
                                  p.Person.FirstName,
                                  p.DraftNotes,
                                  p.BalanceOwed,
                                  // person.Household.Phone,
                                  person.Grade
                              };

            IQueryable<SeasonPlayer> vwSeasonPlayers = teamPlayers.Cast<SeasonPlayer>();

            var count = teamPlayers.Count();
            List<SeasonPlayer> vwSeason = new List<SeasonPlayer>();
            foreach (var player in teamPlayers)
            {
                var vwPlayer = new SeasonPlayer();
                vwPlayer.PersonId = (int)player.PersonId;
                vwPlayer.FirstName = player.FirstName;
                vwPlayer.LastName = player.LastName;
                vwPlayer.Name = player.LastName + ", " + player.FirstName;
                vwPlayer.PlayerId = player.PlayerId;
                vwPlayer.DraftId = player.DraftId;
                vwPlayer.BirthDate = (DateTime)player.BirthDate;
                vwPlayer.DivisionDescription = player.DivisionDescription;
                vwPlayer.DraftNotes = player.DraftNotes;
                vwPlayer.Balance = (decimal)player.BalanceOwed;
                vwPlayer.Grade = (int)player.Grade;
                // vwPlayer.Phone = player.Phone;
                vwSeason.Add(vwPlayer);
            }
            vwSeasonPlayers = vwSeason.AsQueryable<SeasonPlayer>();
            return vwSeasonPlayers;
        }

        public IQueryable<SeasonPlayer> GetTeamPlayers(int teamId)
        {
            var teamPlayers = context.Set<Player>()
                                .Where(p => p.TeamId == teamId)
                                .OrderBy(p => p.DraftId)
                                .Select(p => new
                                {
                                    p.PersonId,
                                    p.PlayerId,
                                    p.DivisionId,
                                    p.DraftId,
                                    p.Sponsor,
                                    p.Person.LastName,
                                    p.Person.FirstName
                                });

            IQueryable<SeasonPlayer> vwSeasonPlayers = teamPlayers.Cast<SeasonPlayer>();

            var count = teamPlayers.Count();
            List<SeasonPlayer> vwSeason = new List<SeasonPlayer>();
            foreach (var player in teamPlayers)
            {
                var vwPlayer = new SeasonPlayer();
                vwPlayer.PersonId = (int)player.PersonId;
                vwPlayer.FirstName = player.FirstName;
                vwPlayer.LastName = player.LastName;
                vwPlayer.Name = player.LastName + ", " + player.FirstName;
                vwPlayer.PlayerId = player.PlayerId;
                vwPlayer.DraftId = player.DraftId;
                vwSeason.Add(vwPlayer);
            }
            vwSeasonPlayers = vwSeason.AsQueryable<SeasonPlayer>();
            return vwSeasonPlayers;
        }

        public IQueryable<UndraftedPlayer> GetUndrafterPlayers(int divisionId)
        {
            var undrafted = context.Set<Player>()
                            .Where(p => p.DivisionId == divisionId)
                            .Where(p => p.TeamId == null || p.TeamId == 0)
                            .Select(p => new
                            {
                                p.PersonId,
                                p.PlayerId,
                                p.DivisionId,
                                p.DraftId,
                                p.Sponsor,
                                p.Rating,
                                p.Person.LastName,
                                p.Person.FirstName
                            }).OrderBy(p => p.DraftId);
            IQueryable<UndraftedPlayer> vwUndraftedPlayers = undrafted.Cast<UndraftedPlayer>(); ;

            var count = undrafted.Count();
            List<UndraftedPlayer> vwUndrafted = new List<UndraftedPlayer>();
            foreach (var player in undrafted)
            {
                var vwPlayer = new UndraftedPlayer();
                vwPlayer.DivisionId = (int)player.DivisionId;
                vwPlayer.PersonId = player.PersonId;
                vwPlayer.FirstName = player.FirstName;
                vwPlayer.LastName = player.LastName;
                vwPlayer.Name = player.FirstName + " " + player.LastName;
                vwPlayer.Sponsor = player.Sponsor;
                vwPlayer.PlayerId = player.PlayerId;
                vwPlayer.DraftId = player.DraftId;
                vwPlayer.Rating = player.Rating;
                vwUndrafted.Add(vwPlayer);
            }
            vwUndraftedPlayers = vwUndrafted.AsQueryable<UndraftedPlayer>();
            return vwUndraftedPlayers;
        }

        public IQueryable<SeasonPlayer> GetPlayers(int seasonId)
        {
            var seasonPlayers = from p in context.Set<Player>()
                                from e in context.Set<Person>()
                                from d in context.Set<Division>()
                                where p.PersonId == e.PersonId
                                where p.SeasonId == seasonId
                                where p.DivisionId == d.DivisionId
                                orderby e.LastName, e.FirstName
                                select new
                                {
                                    p.PlayerId,
                                    p.PersonId,
                                    p.DivisionId,
                                    e.LastName,
                                    e.FirstName,
                                    d.DivisionDescription,
                                    p.DraftId
                                };

            IQueryable<SeasonPlayer> vwSeasonPlayers = seasonPlayers.Cast<SeasonPlayer>();

            var count = seasonPlayers.Count();
            List<SeasonPlayer> vwSeason = new List<SeasonPlayer>();
            foreach (var player in seasonPlayers)
            {
                var vwPlayer = new SeasonPlayer();
                vwPlayer.DivisionId = (int)player.DivisionId;
                vwPlayer.PersonId = (int)player.PersonId;
                vwPlayer.FirstName = player.FirstName;
                vwPlayer.LastName = player.LastName;
                vwPlayer.Name = player.LastName + ", " + player.FirstName;
                vwPlayer.PlayerId = player.PlayerId;
                vwPlayer.DivisionDescription = player.DivisionDescription;
                vwPlayer.DraftId = player.DraftId;
                vwSeason.Add(vwPlayer);
            }
            vwSeasonPlayers = vwSeason.AsQueryable<SeasonPlayer>();
            return vwSeasonPlayers;
        }

        public IQueryable<SeasonPlayer> GetPlayers(int seasonId, int coachId)
        {
            var seasonPlayers = from p in context.Set<Player>()
                                from e in context.Set<Person>()
                                where p.PersonId == e.PersonId
                                where p.SeasonId == seasonId
                                where p.CoachId == coachId
                                orderby e.LastName, e.FirstName
                                select new
                                {
                                    p.PlayerId,
                                    p.PersonId,
                                    p.DivisionId,
                                    e.LastName,
                                    e.FirstName,
                                    p.DraftId
                                };

            IQueryable<SeasonPlayer> vwSeasonPlayers = seasonPlayers.Cast<SeasonPlayer>();

            var count = seasonPlayers.Count();
            var vwSeason = new List<SeasonPlayer>();
            foreach (var player in seasonPlayers)
            {
                var vwPlayer = new SeasonPlayer();
                vwPlayer.DivisionId = (int)player.DivisionId;
                vwPlayer.PersonId = (int)player.PersonId;
                vwPlayer.FirstName = player.FirstName;
                vwPlayer.LastName = player.LastName;
                vwPlayer.Name = player.LastName + ", " + player.FirstName;
                vwPlayer.PlayerId = player.PlayerId;
                vwPlayer.DraftId = player.DraftId;
                vwSeason.Add(vwPlayer);
            }
            vwSeasonPlayers = vwSeason.AsQueryable<SeasonPlayer>();
            return vwSeasonPlayers;
        }

        public IQueryable<SeasonPlayer> GetSponsorPlayers(int seasonId, int sponsorId)
        {
            var sponsorPlayers = context.Set<Player>().Where(p => p.SeasonId == seasonId && p.SponsorId == sponsorId).ToList();
            var count = sponsorPlayers.Count();

            var vwSeason = ConvertPlayersToSeasonPlayers(sponsorPlayers);
            IQueryable<Hoops.Core.ViewModels.SeasonPlayer> vwSeasonPlayers = vwSeason.AsQueryable<SeasonPlayer>();
            return vwSeasonPlayers;
        }

        public IQueryable<Hoops.Core.ViewModels.SeasonPlayer> GetCoachPlayers(int seasonId, int coachId)
        {
            var players = context.Set<Player>()
                .Where(p => p.SeasonId == seasonId && p.Team.CoachId == coachId).ToList();
            var vwSeason = ConvertPlayersToSeasonPlayers(players);
            IQueryable<Hoops.Core.ViewModels.SeasonPlayer> vwSeasonPlayers = vwSeason.AsQueryable<Hoops.Core.ViewModels.SeasonPlayer>();
            return vwSeasonPlayers;
        }

        private static IEnumerable<Hoops.Core.ViewModels.SeasonPlayer> ConvertPlayersToSeasonPlayers(IEnumerable<Player> players)
        {
            var vwSeason = new List<Hoops.Core.ViewModels.SeasonPlayer>();
            foreach (var player in players)
            {
                var vwPlayer = new Hoops.Core.ViewModels.SeasonPlayer();
                if (player.DivisionId.HasValue)
                    vwPlayer.DivisionId = (int)player.DivisionId;
                if (player.Division != null)
                    vwPlayer.DivisionDescription = player.Division.DivisionDescription;
                vwPlayer.PersonId = player.Person.PersonId;
                vwPlayer.PlayerId = player.PlayerId;
                vwPlayer.DraftId = player.DraftId;

                if (player.Person != null)
                {
                    GetPersonInfo(ref vwPlayer, player);
                    // if (player.Person.Household != null)
                    // {
                    //     GetHouseholdInfo(player, ref vwPlayer);
                    // }
                }
                vwSeason.Add(vwPlayer);
            }
            return vwSeason;
        }

        private void GetHouseholdInfo(Player player, ref Hoops.Core.ViewModels.SeasonPlayer vwPlayer)
        {
            var house = this.context.Households.FirstOrDefault(h => h.HouseId == player.Person.HouseId);
            vwPlayer.Address1 = house.Address1;
            vwPlayer.City = house.City;
            vwPlayer.State = house.State;
            vwPlayer.ZipCode = house.Zip;
        }

        private static void GetPersonInfo(ref Hoops.Core.ViewModels.SeasonPlayer vwPlayer, Player player)
        {
            vwPlayer.FirstName = player.Person.FirstName;
            vwPlayer.LastName = player.Person.LastName;
            vwPlayer.Name = player.Person.LastName + ", " + player.Person.FirstName;
            if (player.Person.BirthDate.HasValue)
                vwPlayer.BirthDate = (DateTime)player.Person.BirthDate;
        }

        public override Player Update(Player player)
        {
            var playerold = GetById(player.PlayerId);
            if (playerold != null)
            {
                context.Entry(playerold).CurrentValues.SetValues(player);
                context.SaveChanges();
                SetDivision((int)player.SeasonId, (int)player.PersonId, (int)player.CompanyId);
            }
            return player;
        }

        public void SetDivision(int seasonId, int personId, int companyId)
        {
            // ToDo: Fix this!!
            // var sql = "Exec sp_SetDivision @iSeason = " +
            //           seasonId.ToString() + ", @iPersonId = " +
            //           personId.ToString() + ", @iCompanyID = " + companyId.ToString();
            // context.Database.ExecuteSqlCommand(sql);
        }

        /*public int FindByEmail(string email)
        {
            int id  = 0;
            var Player = Datacontext.People.FirstOrDefault(n => n.Email == email);
            if (Player != null)
                id = Player.PersonId;
            return (id);
        }
        */



        public bool DeleteById(int id)
        {
            bool tflag = false;

            var player = context.Set<Player>().Find(id);
            if (player != null)
            {
                context.Set<Player>().Remove(player);
                context.SaveChanges();
                tflag = true;
            }
            return tflag;
        }

        public Player GetByPersonId(int PersonId)
        {
            var player = new Player();
            var players = context.Set<Player>().Where(p => p.PersonId == PersonId);
            if (players.Any())
            {
                var playerId = players.Max(p => p.PlayerId);
                player = GetById(playerId);
            }
            return player;
        }
        public bool WasPlayer(int PersonId)
        {
            var players = context.Set<Player>().Where(p => p.PersonId == PersonId);
            return players.Any();
        }

        public Player GetLastSeasonPlayed(int PersonId)
        {
            int? lastSeasonId = context.Set<Player>().Where(s => s.PersonId == PersonId).Max(p => p.SeasonId);
            if (lastSeasonId != null)
                return context.Set<Player>().Find(lastSeasonId);
            else
                return new Player();
        }

        public Player GetPlayerByPersonAndSeasonId(int PersonId, int seasonId)
        {
            var player = context.Set<Player>().FirstOrDefault(p => p.SeasonId == seasonId && p.PersonId == PersonId);
            return player;
        }

        public IQueryable<Player> PlayerHistory(int personId)
        {
            var players = context.Set<Player>().Where(p => p.PersonId == personId);
            return players;
        }
        public List<PlayerHistory> GetPlayerHistory(int PersonId)
        {
            using (var db = new hoopsContext())
            {
                var viewPlayers = new List<PlayerHistory>();
                if (PersonId != 0)
                {
                    var players =
                        db.Set<Player>().Where(p => p.PersonId == PersonId).OrderByDescending(p => p.Season.FromDate).ToList();

                    foreach (var player in players)
                    {
                        var viewPlayer = new PlayerHistory();
                        viewPlayer.SeasonId = (player.SeasonId == null ? 0 : (int)player.SeasonId);
                        if (player.Season != null)
                            viewPlayer.Season = player.Season.Description;
                        if (player.Team != null)
                            viewPlayer.Team = player.Team.TeamName;
                        viewPlayer.Rating = player.Rating;
                        var coach = context.Coaches.FirstOrDefault(c => c.CoachId == player.CoachId);
                        if ((player.Team != null) && (coach != null)
                        && (coach.Person != null))
                            viewPlayer.Coach = coach.Person.LastName;
                        viewPlayer.BalanceOwed = player.BalanceOwed;
                        viewPlayers.Add(viewPlayer);
                    }
                }
                return viewPlayers;
            }
        }

        public static string ConvertRating(int rating)
        {
            string srating = String.Empty;
            switch (rating)
            {
                case 0:
                    srating = String.Empty;
                    break;
                case 1:
                    srating = "1";
                    break;
                case 2:
                    srating = "1/2";
                    break;

                case 3:
                    srating = "2";
                    break;
                case 4:
                    srating = "2/3";
                    break;
                case 5:
                    srating = "3";
                    break;
                case 6:
                    srating = "3/4";
                    break;
                case 7:
                    srating = "4";
                    break;
                case 8:
                    srating = "4/5";
                    break;
                case 9:
                    srating = "5";
                    break;
                case 10:
                    srating = "5/6";
                    break;
                case 11:
                    srating = "6";
                    break;
                case 12:
                    srating = "6/7";
                    break;
                case 13:
                    srating = "7";
                    break;
                case 14:
                    srating = "7/8";
                    break;
                case 15:
                    srating = "8";
                    break;
                case 16:
                    srating = "C/R";
                    break;
            }
            return srating;
        }

        IQueryable<SeasonPlayer> IPlayerRepository.GetCoachPlayers(int seasonId, int coachId)
        {
            throw new NotImplementedException();
        }

        
    }
}