namespace Hoops.Core.Models
{
    public partial class vw_GetBatchPlayers
    {
        public string DraftID { get; set; }
        public int PlayerID { get; set; }
        public int? MainHouseID { get; set; }
        public string PlayerName { get; set; }
        public string Address1 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public decimal? PaidAmount { get; set; }
        public string Online { get; set; }
        public string Phone { get; set; }
        public string Mother { get; set; }
        public string Father { get; set; }
        public int? RefundBatchID { get; set; }
        public string CheckMemo { get; set; }
    }
}
