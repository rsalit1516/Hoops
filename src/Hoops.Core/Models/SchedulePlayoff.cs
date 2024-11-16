using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Core.Models
{
    public partial class SchedulePlayoff
    {
    [Key]
        public int ScheduleNumber { get; set; }
        public int GameNumber { get; set; }
        [ForeignKey("Location")]
        public int? LocationNumber { get; set; }
        public DateTime? GameDate { get; set; }
        public string GameTime { get; set; }
        public string VisitingTeam { get; set; }
        public string HomeTeam { get; set; }
        public string Descr { get; set; }
        public int? VisitingTeamScore { get; set; }
        public int? HomeTeamScore { get; set; }
        public int DivisionId { get; set; }
        // public int? SchedulePlayoffId { get; set; }

        protected void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SchedulePlayoff>(entity =>
        {
            // entity.HasKey(e => e.ScheduleNumber);
            // entity.HasKey(e => e.GameNumber);
            entity.Property(e => e.Descr).HasMaxLength(50);
            entity.Property(e => e.GameDate).HasColumnType("datetime");
            entity.Property(e => e.GameTime).HasMaxLength(20);
            entity.Property(e => e.HomeTeam).HasMaxLength(10);
            entity.Property(e => e.VisitingTeam).HasMaxLength(10);
            entity.Property(e => e.LocationNumber)
            .HasColumnType("int")
            .IsRequired(false);
            // entity.HasOne(e => e.LocationNumber)
            // .HasForeignKey(e => e.LocationNumber);     
        });

        }
    }
}
