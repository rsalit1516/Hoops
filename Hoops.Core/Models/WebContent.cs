using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Core.Models
{
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
        public virtual WebContentType WebContentType { get; set; }

        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<WebContent> entity)
        {
            entity.ToTable("WebContent");
            entity.HasKey(entity => entity.WebContentId);
            entity.Property(e => e.DateAndTime).HasMaxLength(50);
            entity.Property(e => e.ExpirationDate).HasColumnType("datetime");
            entity.Property(e => e.Location).HasMaxLength(50);
            entity.Property(e => e.ModifiedDate).HasColumnType("datetime")
            .HasDefaultValue(DateTime.Now);
            entity.Property(e => e.Page).HasMaxLength(50);
            entity.Property(e => e.SubTitle).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(50);
            entity.Property(e => e.Type).HasMaxLength(50);
            entity.Navigation(w => w.WebContentType)
       .UsePropertyAccessMode(PropertyAccessMode.Property);
        }
    }
}
