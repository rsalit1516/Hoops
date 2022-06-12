using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;


namespace Hoops.Core.Models;

[Table("WebContentType")]
public class WebContentType
{
    [Key]
    public int WebContentTypeId { get; set; }
    public string WebContentTypeDescription { get; set; }
    // public ICollection<WebContent> WebContents { get; set; } = null;

}
