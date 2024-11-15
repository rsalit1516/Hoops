namespace Hoops.Core.Models
{
    // public class PlayerHistory
    // {
    //     [Key]
    //     [DatabaseGenerated(DatabaseGeneratedOption.None)]
    //     public int PlayerID { get; set; }
    //     [Key]
    //     public int SeasonID { get; set; }
    //     public Nullable<int> DivisionID { get; set; }
    //     public int TeamID { get; set; }
    //     public string Team { get; set; }
    //     public int PeopleID { get; set; }
    //     public string DraftID { get; set; }
    //     public string DraftNotes { get; set; }
    //     public Nullable<int> Rating { get; set; }
    //     public string Coach { get; set; }
    //     public int CoachID { get; set; }
    //     public Nullable<System.DateTime> PaidDate { get; set; }
    //     public Nullable<decimal> PaidAmount { get; set; }
    //     public Nullable<decimal> BalanceOwed { get; set; }
    //     public string PayType { get; set; }
    //     public string NoteDesc { get; set; }
    //     public string CheckMemo { get; set; }
    //     public bool PlaysDown { get; set; }
    //     public Nullable<bool> PlaysUp { get; set; }
    //     public string Season { get; set; }

    //     public CSBCDbContext Db { get; set; }

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
    // }

}