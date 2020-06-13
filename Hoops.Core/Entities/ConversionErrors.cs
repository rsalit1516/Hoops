using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class ConversionErrors
    {
        public string ObjectType { get; set; }
        public string ObjectName { get; set; }
        public string ErrorDescription { get; set; }
    }
}
