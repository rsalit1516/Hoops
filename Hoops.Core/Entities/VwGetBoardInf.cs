using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwGetBoardInf
    {
        public string Name { get; set; }
        public string Title { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public byte[] Photo { get; set; }
        public int CompanyId { get; set; }
        public int? Seq { get; set; }
    }
}
