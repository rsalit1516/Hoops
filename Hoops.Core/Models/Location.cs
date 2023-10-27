using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Core.Models
{
    public partial class Location
    {
        public int LocationNumber { get; set; }
        public string LocationName { get; set; }
        public string Notes { get; set; }
        public int? Id { get; set; }
        protected void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Location>(entity =>
    {
        entity.ToTable("Location");
        entity.HasKey(e => e.Id);

        entity.Property(e => e.LocationName)
            .IsRequired()
            .HasMaxLength(50);

        entity.Property(e => e.Notes).IsRequired();
    });
        }
    }
}
