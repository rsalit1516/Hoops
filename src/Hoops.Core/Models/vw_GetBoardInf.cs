using System;
using System.Collections.Generic;

namespace Hoops.Core.Models
{
    public partial class vw_GetBoardInf
    {
        public string Name { get; set; }
        public string Title { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public byte[] Photo { get; set; }
        public int CompanyID { get; set; }
        public Nullable<int> Seq { get; set; }
    }
}
