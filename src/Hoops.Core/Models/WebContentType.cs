using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Hoops.Core.Interface;

namespace Hoops.Core.Models;

[Table("WebContentType")]
public class WebContentType : IAuditable
{
    [Key]
    public int WebContentTypeId { get; set; }
    public string WebContentTypeDescription { get; set; }

    public DateTime? CreatedDate { get; set; }
    public int? CreatedUser { get; set; }
    public DateTime? ModifiedDate { get; set; }
    public int? ModifiedUser { get; set; }
}
