using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Core.Models;

[Table("WebContent")]
public partial class WebContent
{
    [Key]
    public int WebContentId { get; set; }
    public int? CompanyId { get; set; }
    public string Page { get; set; }

    public string Type { get; set; }
    public string Title { get; set; }
    public int? ContentSequence { get; set; }
    public string SubTitle { get; set; }
    public string Location { get; set; }
    public string DateAndTime { get; set; }
    public string Body { get; set; }
    public DateTime? ExpirationDate { get; set; }
    public DateTime? ModifiedDate { get; set; }
    public int? ModifiedUser { get; set; }

    // public WebContentType WebContentType { get; set; }
    // [ForeignKey("WebContentTypeId")]
    public int WebContentTypeId { get; set; }
    // public virtual WebContentType WebContentType { get; set; }

}
