using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Core.Models;

public class WebContentType
{
    [Key]
    public int WebContentTypeId { get; set; }
    public string WebContentTypeDescription { get; set; }
    public ICollection<WebContent> WebContents { get; set; } = null;

    public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<WebContentType> entity)
    {
        entity.ToTable("WebContentType");
        entity.HasKey(e => e.WebContentTypeId);
        entity.Property(p => p.WebContentTypeId).ValueGeneratedOnAdd();
        entity.Property(e => e.WebContentTypeDescription)
            .IsRequired()
            .HasMaxLength(50);
        // entity.HasOne(e => e.WebContents)
        // .WithOne(w => w..WebContentType)
        // .HasForeignKey<WebContent>(w => w.WebContentTypeId);
    }
}
