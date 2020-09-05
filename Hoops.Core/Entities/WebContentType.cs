using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.Entities
{
    public partial class WebContentType : CommonFields
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int WebContentTypeId { get; set; }
        public string WebContentTypeDescription { get; set; }
        // public virtual WebContent WebContent { get; set; }
    }
}

