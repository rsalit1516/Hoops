using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Hoops.Core.Interface;

namespace Hoops.Core.Models;

[Table("WebContent")]
public partial class WebContent : IAuditable
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
    public DateTime? CreatedDate { get; set; }
    public int? CreatedUser { get; set; }
    public DateTime? ModifiedDate { get; set; }
    public int? ModifiedUser { get; set; }

    // public WebContentType WebContentType { get; set; }
    // [ForeignKey("WebContentTypeId")]
    public int WebContentTypeId { get; set; }
    // public virtual WebContentType WebContentType { get; set; }

}
