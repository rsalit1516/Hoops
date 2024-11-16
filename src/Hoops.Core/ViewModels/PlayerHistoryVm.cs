using System;
using System.ComponentModel.DataAnnotations;

namespace Hoops.Core.ViewModels
{
    public class PlayerHistory
    {
        [Key]
        public int PlayerId { get; set; }
        [Key]
        public int SeasonId { get; set; }
        public int? DivisionId { get; set; }
        public int TeamId { get; set; }
        public string Team { get; set; }
        public int PeopleI { get; set; }
        public string DraftId { get; set; }
        public string DraftNotes { get; set; }
        public int? Rating { get; set; }
        public string Coach { get; set; }
        public int CoachID { get; set; }
        public DateTime? PaidDate { get; set; }
        public decimal? PaidAmount { get; set; }
        public decimal? BalanceOwed { get; set; }
        public string PayType { get; set; }
        public string NoteDesc { get; set; }
        public string CheckMemo { get; set; }
        public bool PlaysDown { get; set; }
        public bool? PlaysUp { get; set; }
        public string Season { get; set; }

        //public PlayerHistory()
        //{

        //}

        //public PlayerHistory(CSBCDbContext db)
        //{
        //    Db = db;
        //}
        //public List<PlayerHistory> PlayerHistory(int peopleId)
        //{
        //    using (var db = new CSBCDbContext())
        //    {

        //        var players = db.Players.Where(p => p.PeopleID == peopleId).OrderByDescending(p => p.Season.FromDate);
        //        var viewPlayers = new List<PlayerHistoryVM>();


        //            foreach (var player in players)
        //            {
        //                var viewPlayer = new PlayerHistoryVM();
        //                viewPlayer.SeasonID = (player.SeasonID == null ? 0 : (int) player.SeasonID);
        //                if (player.Season != null)
        //                    viewPlayer.Season = player.Season.Description;
        //                if (player.Team != null)
        //                    viewPlayer.Team = player.Team.TeamName;
        //                viewPlayer.Rating = player.Rating;
        //                viewPlayer.BalanceOwed = player.BalanceOwed;
        //                viewPlayers.Add(viewPlayer);
        //            }

        //        return viewPlayers;
        //    }
        //}
    }

}
