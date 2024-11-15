using System;
using System.Collections.Generic;

namespace Hoops.Core.Models
{
    public partial class vw_BatchPlayers
    {
        public int CompanyID { get; set; }
        public Nullable<int> RefundBatchID { get; set; }
        public string DraftID { get; set; }
        public int PlayerID { get; set; }
        public Nullable<int> HouseID { get; set; }
        public int PeopleID { get; set; }
        public string PlayerName { get; set; }
        public string Address1 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public Nullable<decimal> PaidAmount { get; set; }
        public string Online { get; set; }
        public string Phone { get; set; }
        public string Mother { get; set; }
        public string Father { get; set; }
        public string Sea_Desc { get; set; }
    }
}
