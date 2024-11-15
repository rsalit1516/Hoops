using System;
using System.Collections.Generic;
using System.Linq;
using Hoops.Core;
using System.Data;
using Hoops.Core.ViewModels;
using Hoops.Infrastructure.Repository;
using Hoops.Core.Models;

namespace Hoops.Core.ViewModels
{

    /// <summary>
    /// This class needs to be eliminated or refactored. The View model needs to be 
    /// </summary>
    public class PlayerViewModel
    {
        public hoopsContext hoopsContext { get; set; }

        public PlayerViewModel()
        {
            
        }

        public PlayerViewModel(hoopsContext db)
        {
        hoopsContext = db;
        }
        //public static DataTable GetDraftList(int divisionId, int seasonId, int companyId)
        //{
        //    var oPlayer = new CSBC.Components.Season.ClsPlayers();
        //    DataTable rsData = default(DataTable);
        //    try
        //    {
        //        rsData = oPlayer.GetDraftList(divisionId, seasonId, companyId);
        //    }
        //    catch (Exception ex)
        //    {
        //        string text = "LoadGrid::" + ex.Message;
        //    }
        //    return rsData;
        //}

        public static List<SeasonPlayer> GetSeasonPlayers(int seasonId)
        {
            using (var db = new hoopsContext())
            {
                var rep = new PlayerRepository(db);
                var players = rep.GetSeasonPlayers(seasonId);
                return players.ToList();
            }

        }
        
        //public List<SeasonPlayer> GetDivisionPlayers(int divisionId)
        //{
        //    using (var db = new CSBCDbContext())
        //    {
        //        var rep = new PlayerRepository(db);
        //        var players = rep.GetDivisionPlayers(divisionId);
        //        return players.ToList();
        //    }

        //}

        private static SeasonPlayer ConvertDataTableToSeasonPlayer(DataRow row)
        {
            var player = new SeasonPlayer();
            player.PersonId = Convert.ToInt32(row["PeopleID"]);
            player.PlayerId = Convert.ToInt32(row["PlayerID"]);
            player.DraftId = row["PlayerID"].ToString();
            //player.LastName = row["LastName"].ToString();
            //player.FirstName = row["FirstName"].ToString();
            player.Name = row["Name"].ToString();
            player.BirthDate = Convert.ToDateTime(row["BirthDate"].ToString());
            return player;
        }

        public static Player LastSeason(int peopleId)
        {
            using (var db = new hoopsContext())
            {
                var rep = new PlayerRepository(db);
                var player = rep.GetLastSeasonPlayed(peopleId);
                return player;
            }
        }

        
    }
}