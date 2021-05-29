using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hoops.Core.Models
{
    public class WebContentType
    {
        [Key]
        public int WebContentTypeId { get; set; }
        public string WebContentTypeDescription { get; set; }
    }
}
