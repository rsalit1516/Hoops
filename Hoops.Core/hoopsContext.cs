using System;
using Microsoft.EntityFrameworkCore;
using Hoops.Core.Models;

namespace Hoops.Core;

public partial class hoopsContext : DbContext
{
   public hoopsContext()
   {}
   
    public hoopsContext(DbContextOptions<hoopsContext> options)
        : base(options)
    {
    }


    public virtual DbSet<Coach> Coaches { get; set; }
    public virtual DbSet<Color> Colors { get; set; }
    // public virtual DbSet<Comments> Comments { get; set; }
    public virtual DbSet<Company> Companies { get; set; }
    public virtual DbSet<Content> Content { get; set; }
    // public virtual DbSet<ConversionErrors> ConversionErrors { get; set; }
    public virtual DbSet<Director> Directors { get; set; }
    public virtual DbSet<Division> Divisions { get; set; }
    // public virtual DbSet<Dtproperties> Dtproperties { get; set; }
    public virtual DbSet<Household> Households { get; set; }
    public virtual DbSet<Location> Location { get; set; }
    // public virtual DbSet<PayErrorLog> PayErrorLog { get; set; }
    public virtual DbSet<Person> People { get; set; }
    public virtual DbSet<Player> Players { get; set; }
    public virtual DbSet<Role> Roles { get; set; }
    public virtual DbSet<ScheduleDivTeam> ScheduleDivTeams { get; set; }
    public virtual DbSet<ScheduleGame> ScheduleGames { get; set; }
    // public virtual DbSet<ScheduleGamesStats> ScheduleGamesStats { get; set; }
    public virtual DbSet<ScheduleLocation> ScheduleLocations { get; set; }
    public virtual DbSet<SchedulePlayoff> SchedulePlayoffs { get; set; }
    public virtual DbSet<Season> Seasons { get; set; }
    // public virtual DbSet<ShoppingCart> ShoppingCart { get; set; }
    // public virtual DbSet<SpecialUserQuery> SpecialUserQuery { get; set; }
    public virtual DbSet<SponsorFee> SponsorFees { get; set; }
    public virtual DbSet<SponsorPayment> SponsorPayments { get; set; }
    public virtual DbSet<SponsorProfile> SponsorProfiles { get; set; }
    public virtual DbSet<Sponsor> Sponsors { get; set; }
    // public virtual DbSet<TeamRosters> TeamRosters { get; set; }
    public virtual DbSet<Team> Teams { get; set; }
    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<Version> Version { get; set; }
    public virtual DbSet<WebContent> WebContents { get; set; }
    public virtual DbSet<WebContentType> WebContentTypes { get; set; }

    // Views 
    // public virtual DbSet<VwAllSponsors> VwAllSponsors { get; set; }
    // public virtual DbSet<VwBatchPlayers> VwBatchPlayers { get; set; }
    // public virtual DbSet<VwCheckEmail> VwCheckEmail { get; set; }
    // public virtual DbSet<VwCheckEncryption> VwCheckEncryption { get; set; }
    // public virtual DbSet<VwCheckLogin> VwCheckLogin { get; set; }
    public virtual DbSet<VwCoach> VwCoaches { get; set; }
    // public virtual DbSet<VwComments> VwComments { get; set; }
    // public virtual DbSet<VwContent> VwContent { get; set; }
    public virtual DbSet<VwDirector> VwDirectors { get; set; }
    // public virtual DbSet<VwDivision> VwDivisions { get; set; }
    // public virtual DbSet<VwGetBatchPlayers> VwGetBatchPlayers { get; set; }
    // public virtual DbSet<VwGetBoardInf> VwGetBoardInf { get; set; }
    // public virtual DbSet<VwGetBoardMembers> VwGetBoardMembers { get; set; }
    // public virtual DbSet<VwGetContent> VwGetContent { get; set; }
    // public virtual DbSet<VwGetHousePlayers> VwGetHousePlayers { get; set; }
    // public virtual DbSet<VwGetPlayers> VwGetPlayers { get; set; }
    // public virtual DbSet<VwGetRegistratedPlayers> VwGetRegistratedPlayers { get; set; }
    // public virtual DbSet<VwGetTryoutsInfo> VwGetTryoutsInfo { get; set; }
    // public virtual DbSet<VwGetUsers> VwGetUsers { get; set; }
    // public virtual DbSet<VwHouseholds> VwHouseholds { get; set; }
    // public virtual DbSet<VwPeople> VwPeople { get; set; }
    // public virtual DbSet<VwPlayersList> VwPlayersList { get; set; }
    // public virtual DbSet<VwRoles> VwRoles { get; set; }
    // public virtual DbSet<VwSeason> VwSeason { get; set; }
    // public virtual DbSet<VwSeasonCounts> VwSeasonCounts { get; set; }
    // public virtual DbSet<VwSeasonSponsors> VwSeasonSponsors { get; set; }
    // public virtual DbSet<VwSponsorPayments> VwSponsorPayments { get; set; }
    // public virtual DbSet<VwSponsoredTeams> VwSponsoredTeams { get; set; }
    // public virtual DbSet<VwSponsors> VwSponsors { get; set; }
    // public virtual DbSet<VwTeam> VwTeams { get; set; }
    // public virtual DbSet<VwUsers> VwUsers { get; set; }

    // Tables used for importing form scheduler 
    // public virtual DbSet<SchDivisions> SchDivisions { get; set; }
    // public virtual DbSet<SchExceptions> SchExceptions { get; set; }
    // public virtual DbSet<SchGameTimes> SchGameTimes { get; set; }
    // public virtual DbSet<SchGames> SchGames { get; set; }
    // public virtual DbSet<SchLocations> SchLocations { get; set; }
    // public virtual DbSet<SchOptions> SchOptions { get; set; }
    // public virtual DbSet<SchTeams> SchTeams { get; set; }

    // protected void OnConfiguring() {}
    // {
    // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    // {
    //     // if (!optionsBuilder.IsConfigured)
    //     // {
    //     //     string conn = this.Database.GetConnectionString();
    //     //     optionsBuilder.UseSqlServer(conn);
    //     // }
    // }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Coach>(entity =>
        {
            entity.ToTable("Coach");
            entity.HasKey(e => e.CoachId);

            entity.Property(e => e.CoachId)
                .HasColumnName("CoachID")
                .ValueGeneratedOnAdd();

            entity.Property(e => e.CoachPhone).HasMaxLength(25);

            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

            entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime").HasDefaultValue(DateTime.Now);

            entity.Property(e => e.CreatedUser).HasMaxLength(50);

            entity.Property(e => e.PersonId).HasColumnName("PeopleID");

            entity.Property(e => e.PlayerId).HasColumnName("PlayerID");

            entity.Property(e => e.SeasonId).HasColumnName("SeasonID");

            entity.Property(e => e.ShirtSize).HasMaxLength(50);
        });

        modelBuilder.Entity<Color>(entity =>
        {
            entity.ToTable("Colors");

            entity.Property(e => e.ColorId)
                .HasColumnName("ID");
            entity.HasKey(e => e.ColorId);

            entity.Property(e => e.ColorName)
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

            entity.Property(e => e.CreatedDate).HasColumnType("datetime").HasDefaultValue(DateTime.Now);

            entity.Property(e => e.CreatedUser)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength();
        });

        // modelBuilder.Entity<Comments>(entity =>
        // {
        //     entity.ToTable("Comment");
        //     entity.HasKey(e => e.CommentId);

        //     entity.Property(e => e.Comment).HasColumnType("ntext");

        //     entity.Property(e => e.CommentId).HasColumnName("CommentID");

        //     entity.Property(e => e.CommentType).HasMaxLength(50);

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime");

        //     entity.Property(e => e.CreatedUser)
        //         .HasColumnName("CreatedUSer")
        //         .HasMaxLength(50);

        //     entity.Property(e => e.LinkId).HasColumnName("LinkID");

        //     entity.Property(e => e.UserId).HasColumnName("UserID");
        // });

        modelBuilder.Entity<Company>(entity =>
        {
            entity.ToTable("Company");
            entity.HasKey(entity => entity.CompanyId);

            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

            entity.Property(e => e.CompanyName)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.Property(e => e.CreatedDate).HasColumnType("datetime").HasDefaultValue(DateTime.Now);

            entity.Property(e => e.CreatedUser)
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.Property(e => e.EmailSender)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.Property(e => e.ImageName)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        // modelBuilder.Entity<Content>(entity =>
        // {
        //     entity.ToTable("Content");
        //     entity.HasKey(entity => entity.CntId);

        //     entity.Property(e => e.CntId).HasColumnName("cntID");

        //     entity.Property(e => e.CntScreen)
        //         .HasColumnName("cntScreen")
        //         .HasMaxLength(15);

        //     entity.Property(e => e.CntSeq).HasColumnName("cntSeq");

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.CreatedDate).HasColumnType("datetime").HasDefaultValue(DateTime.Now); 

        //     entity.Property(e => e.CreatedUser).HasMaxLength(50);

        //     entity.Property(e => e.EndDate).HasColumnType("datetime");

        //     entity.Property(e => e.FontColor).HasMaxLength(10);

        //     entity.Property(e => e.FontSize).HasMaxLength(10);

        //     entity.Property(e => e.LineText).HasMaxLength(100);

        //     entity.Property(e => e.Link).HasMaxLength(400);

        //     entity.Property(e => e.StartDate).HasColumnType("datetime");
        // });

        // modelBuilder.Entity<ConversionErrors>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToTable("Conversion Errors");

        //     entity.Property(e => e.ErrorDescription).HasColumnName("Error Description");

        //     entity.Property(e => e.ObjectName)
        //         .HasColumnName("Object Name")
        //         .HasMaxLength(255);

        //     entity.Property(e => e.ObjectType)
        //         .HasColumnName("Object Type")
        //         .HasMaxLength(255);
        // });

        modelBuilder.Entity<Director>(entity =>
        {
            entity.ToTable("Directors");
            entity.HasKey(e => e.DirectorId);

            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

            entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime").HasDefaultValue(DateTime.Now);

            entity.Property(e => e.CreatedUser).HasMaxLength(50);

            entity.Property(e => e.DirectorId).HasColumnName("ID");

            entity.Property(e => e.PersonId).HasColumnName("PeopleID");

            entity.Property(e => e.PhonePref).HasMaxLength(10);

            entity.Property(e => e.Photo).HasColumnType("image");

            entity.Property(e => e.Title).HasMaxLength(50);
        });

        modelBuilder.Entity<Division>(entity =>
        {
            entity.ToTable("Divisions");
            entity.HasKey(e => e.DivisionId);

            entity.Property(e => e.DivisionId).HasColumnName("DivisionID");
            entity.Property(e => e.DirectorId).HasColumnName("DirectorID");
            entity.Property(e => e.CoDirectorId).HasColumnName("CoDirectorID");
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime").HasDefaultValue(DateTime.Now);
            entity.Property(e => e.CreatedUser).HasMaxLength(50);
            entity.Property(e => e.DivisionDescription)
                .HasColumnName("Div_Desc")
                .HasMaxLength(50);

            entity.Property(e => e.DraftDate).HasColumnType("smalldatetime");

            entity.Property(e => e.DraftTime).HasMaxLength(10);

            entity.Property(e => e.DraftVenue).HasMaxLength(50);

            entity.Property(e => e.Gender).HasMaxLength(1);

            entity.Property(e => e.Gender2).HasMaxLength(1);

            entity.Property(e => e.MaxDate).HasColumnType("smalldatetime");

            entity.Property(e => e.MaxDate2).HasColumnType("smalldatetime");

            entity.Property(e => e.MinDate).HasColumnType("smalldatetime");

            entity.Property(e => e.MinDate2).HasColumnType("smalldatetime");

            entity.Property(e => e.SeasonId).HasColumnName("SeasonID");
        });

        // modelBuilder.Entity<Dtproperties>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToTable("dtproperties");

        //     entity.Property(e => e.Id).HasColumnName("id");

        //     entity.Property(e => e.Lvalue)
        //         .HasColumnName("lvalue")
        //         .HasColumnType("image");

        //     entity.Property(e => e.Objectid).HasColumnName("objectid");

        //     entity.Property(e => e.Property)
        //         .IsRequired()
        //         .HasColumnName("property")
        //         .HasMaxLength(64)
        //         .IsUnicode(false);

        //     entity.Property(e => e.Uvalue)
        //         .HasColumnName("uvalue")
        //         .HasMaxLength(255);

        //     entity.Property(e => e.Value)
        //         .HasColumnName("value")
        //         .HasMaxLength(255)
        //         .IsUnicode(false);

        //     entity.Property(e => e.Version).HasColumnName("version");
        // });


        modelBuilder.Entity<Household>(entity =>
        {
            entity.ToTable("Households");
            entity.HasKey(e => e.HouseId);

            entity.HasIndex(e => new { e.Phone, e.Email, e.HouseId })
                .HasDatabaseName("idx_DCh_2775_2774_Household");

            entity.Property(e => e.HouseId)
                .HasColumnName("HouseID")
                .ValueGeneratedNever();

            entity.Property(e => e.Address1).HasMaxLength(50);

            entity.Property(e => e.Address2).HasMaxLength(50);

            entity.Property(e => e.City).HasMaxLength(50);

            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

            entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime").HasDefaultValue(DateTime.Now);

            entity.Property(e => e.CreatedUser).HasMaxLength(20);

            entity.Property(e => e.Email).HasMaxLength(50);

            entity.Property(e => e.Name).HasMaxLength(50);

            entity.Property(e => e.Phone).HasMaxLength(25);

            entity.Property(e => e.SportsCard).HasMaxLength(15);

            entity.Property(e => e.State).HasMaxLength(2);

            entity.Property(e => e.TeamId).HasColumnName("TEMID");

            entity.Property(e => e.Zip).HasMaxLength(20);
        });

        modelBuilder.Entity<Location>(entity =>
        {
            entity.ToTable("Location");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.LocationName)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.Notes).IsRequired();
        });


        // modelBuilder.Entity<PayErrorLog>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.CreatedDate).HasColumnType("datetime").HasDefaultValue(DateTime.Now);

        //     entity.Property(e => e.ErrorMsg)
        //         .HasColumnName("ErrorMSG")
        //         .HasMaxLength(300);

        //     entity.Property(e => e.HouseId).HasColumnName("HouseID");

        //     entity.Property(e => e.SeasonId).HasColumnName("SeasonID");
        // });

        modelBuilder.Entity<Person>(entity =>
        {
            entity.ToTable("People");
            entity.HasKey(e => e.PersonId);

            entity.HasIndex(e => e.Coach)
                .HasDatabaseName("idx_DCh_12521_12520_People");

            entity.HasIndex(e => e.HouseId)
                .HasDatabaseName("idx_DCh_75612_75611_People");

            entity.HasIndex(e => new { e.FirstName, e.LastName })
                .HasDatabaseName("idx_DCh_14287_14286_People");

            entity.Property(e => e.PersonId).HasColumnName("PeopleID");

            entity.Property(e => e.Ad).HasColumnName("AD");

            entity.Property(e => e.Bc).HasColumnName("BC");

            entity.Property(e => e.BirthDate).HasColumnType("datetime");

            entity.Property(e => e.Cellphone).HasMaxLength(15);

            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

            entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime").HasDefaultValue(DateTime.Now);

            entity.Property(e => e.CreatedUser).HasMaxLength(20);

            entity.Property(e => e.Email).HasMaxLength(50);

            entity.Property(e => e.FirstName).HasMaxLength(50);

            entity.Property(e => e.Gender).HasMaxLength(1);

            entity.Property(e => e.GiftedLevelsUp).HasColumnName("GiftedLevelsUP");

            entity.Property(e => e.LastName).HasMaxLength(50);

            entity.Property(e => e.LatestSeason).HasMaxLength(15);

            entity.Property(e => e.LatestShirtSize).HasMaxLength(20);

            entity.Property(e => e.HouseId).HasColumnName("MainHouseID");

            entity.Property(e => e.SchoolName).HasMaxLength(50);

            entity.Property(e => e.TempId).HasColumnName("TEMPID");

            entity.Property(e => e.Workphone).HasMaxLength(25);
        });

        modelBuilder.Entity<Player>(entity =>
        {
            entity.ToTable("Player");
            entity.HasKey(e => e.PlayerId);

            entity.HasIndex(e => e.DivisionId)
                .HasDatabaseName("idx_DCh_488836_488835_Players");

            entity.HasIndex(e => e.PersonId)
                .HasDatabaseName("idx_DCh_75619_75618_Players");

            entity.HasIndex(e => e.PlayerId)
                .HasDatabaseName("idx_DCh_2451_2450_Players");

            entity.HasIndex(e => e.TeamId)
                .HasDatabaseName("idx_DCh_12817_12816_Players");

            entity.HasIndex(e => new { e.Coach, e.Sponsor, e.SeasonId })
                .HasDatabaseName("idx_DCh_98394_98393_Players");

            entity.HasIndex(e => new { e.SeasonId, e.PayType, e.Sponsor })
                .HasDatabaseName("idx_DCh_8781_8780_Players");

            entity.HasIndex(e => new { e.PlayerId, e.DivisionId, e.Coach, e.Sponsor, e.SeasonId })
                .HasDatabaseName("idx_DCh_25_24_Players");

            entity.Property(e => e.PlayerId).HasColumnName("PlayerID");

            entity.Property(e => e.Ad).HasColumnName("AD");

            entity.Property(e => e.BalanceOwed).HasColumnType("money");

            entity.Property(e => e.CheckMemo).HasMaxLength(50);

            entity.Property(e => e.CoachId).HasColumnName("CoachID");

            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

            entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime").HasDefaultValue(DateTime.Now);

            entity.Property(e => e.CreatedUser).HasMaxLength(20);

            entity.Property(e => e.DivisionId).HasColumnName("DivisionID");

            entity.Property(e => e.DraftId)
                .HasColumnName("DraftID")
                .HasMaxLength(3);

            entity.Property(e => e.DraftNotes).HasMaxLength(100);

            entity.Property(e => e.NoteDesc).HasMaxLength(50);

            entity.Property(e => e.PaidAmount).HasColumnType("money");

            entity.Property(e => e.PaidDate).HasColumnType("smalldatetime");

            entity.Property(e => e.PayType).HasMaxLength(5);

            entity.Property(e => e.PersonId).HasColumnName("PeopleID");

            entity.Property(e => e.RefundBatchId).HasColumnName("RefundBatchID");

            entity.Property(e => e.SeasonId).HasColumnName("SeasonID");

            entity.Property(e => e.ShoppingCartId).HasColumnName("ShoppingCartID");

            entity.Property(e => e.SponsorId).HasColumnName("SponsorID");

            entity.Property(e => e.TeamId).HasColumnName("TeamID");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("Rolls");
            entity.HasKey(e => e.RoleId);

            entity.Property(e => e.AccessType)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength();

            entity.Property(e => e.CreatedDate).HasColumnType("datetime").HasDefaultValue(DateTime.Now);

            entity.Property(e => e.CreatedUser)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength();

            entity.Property(e => e.RoleId)
                .HasColumnName("RollsID");

            entity.Property(e => e.ScreenName)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength();

            entity.Property(e => e.UserId)
                .HasColumnName("UserID");
        });

        // modelBuilder.Entity<SchDivisions>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.Property(e => e.DivisionName)
        //         .IsRequired()
        //         .HasMaxLength(50);
        // });

        // modelBuilder.Entity<SchExceptions>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.Property(e => e.AddOrRemove)
        //         .IsRequired()
        //         .HasMaxLength(1);

        //     entity.Property(e => e.ExceptionDate).HasColumnType("datetime");

        //     entity.Property(e => e.ExceptionTime).HasColumnType("datetime");
        // });

        // modelBuilder.Entity<SchGameTimes>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.Property(e => e.GameStartTime).HasColumnType("datetime");
        // });

        // modelBuilder.Entity<SchGames>(entity =>
        // {
        //     entity.HasKey(e => e.SchGames1);

        //     entity.Property(e => e.SchGames1).HasColumnName("SchGames");

        //     entity.Property(e => e.GameComment).IsRequired();

        //     entity.Property(e => e.GameDate).HasColumnType("datetime");

        //     entity.Property(e => e.GameTime).HasColumnType("datetime");

        //     entity.Property(e => e.ScheduleComment).IsRequired();
        // });

        // modelBuilder.Entity<SchLocations>(entity =>
        // {
        //     entity.HasNoKey();
        // });

        // modelBuilder.Entity<SchOptions>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.Property(e => e.EndDate).HasColumnType("datetime");
        // });


        // modelBuilder.Entity<SchTeams>(entity =>
        // {
        //     entity.HasNoKey();
        // });

        modelBuilder.Entity<ScheduleDivTeam>(entity =>
        {
            entity.ToTable("ScheduleDivTeams");
            entity.HasKey(e => e.ScheduleDivTeamsId);
            entity.HasIndex(e => new { e.ScheduleNumber, e.TeamNumber })
                .HasDatabaseName("IX_ScheduleDivTeams");
        });

        modelBuilder.Entity<ScheduleGame>(entity =>
        {
            entity.ToTable("ScheduleGames");
            entity.HasKey(e => e.ScheduleGamesId);
            // entity.Property(e => e.ScheduleGamesId)
            // .UseIdentityColumn(seed: 0, increment: 1); 

            entity.HasIndex(e => new { e.SeasonId, e.DivisionId, e.GameNumber })
                .HasDatabaseName("IX_ScheduleGames");

            entity.HasIndex(e => new { e.GameNumber, e.LocationNumber, e.GameDate, e.GameTime, e.VisitingTeamNumber, e.HomeTeamNumber, e.VisitingTeamScore, e.HomeTeamScore, e.ScheduleNumber, e.SeasonId })
                .HasDatabaseName("idx_DCh_20078_20077_ScheduleGames");

            entity.HasIndex(e => new { e.ScheduleNumber, e.GameNumber, e.LocationNumber, e.GameDate, e.GameTime, e.VisitingTeamNumber, e.HomeTeamNumber, e.VisitingTeamScore, e.HomeTeamScore, e.VisitingForfeited, e.HomeForfeited, e.SeasonId, e.DivisionId })
                .HasDatabaseName("idx_DCh_1924_1923_ScheduleGames");

            entity.Property(e => e.GameDate).HasColumnType("datetime");

            entity.Property(e => e.GameTime).HasMaxLength(20);
        });

        // modelBuilder.Entity<ScheduleGamesStats>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.Property(e => e.Dnp).HasColumnName("DNP");

        //     entity.Property(e => e.PersonId).HasColumnName("PersonId");

        //     entity.Property(e => e.RowId).HasColumnName("RowID");

        //     entity.Property(e => e.SeasonId).HasColumnName("SeasonID");
        // });

        modelBuilder.Entity<ScheduleLocation>(entity =>
        {
            entity.HasKey(e => e.LocationNumber);
            entity.Property(e => e.LocationName).HasMaxLength(50);
            entity.Property(e => e.Notes).HasMaxLength(100);
        });


        modelBuilder.Entity<SchedulePlayoff>(entity =>
        {
            entity.HasKey(e => e.ScheduleNumber);
            entity.HasKey(e => e.GameNumber);
            entity.Property(e => e.Descr).HasMaxLength(50);
            entity.Property(e => e.GameDate).HasColumnType("datetime");
            entity.Property(e => e.GameTime).HasMaxLength(20);
            entity.Property(e => e.HomeTeam).HasMaxLength(10);
            entity.Property(e => e.VisitingTeam).HasMaxLength(10);
        });


        modelBuilder.Entity<Season>(entity =>
        {
            entity.ToTable("Seasons");
            entity.HasKey(e => e.SeasonId);
            entity.Property(e => e.SeasonId).HasColumnName("SeasonID");
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.ConvenienceFee).HasColumnType("money");
            entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime").HasDefaultValue(DateTime.Now);
            entity.Property(e => e.CreatedUser).HasMaxLength(50);
            entity.Property(e => e.FromDate).HasColumnType("smalldatetime");
            entity.Property(e => e.ParticipationFee).HasColumnType("money");
            entity.Property(e => e.Description)
                .HasColumnName("Sea_Desc")
                .HasMaxLength(50);
            entity.Property(e => e.SignUpsDate).HasColumnType("smalldatetime");
            entity.Property(e => e.SignUpsEnd)
                .HasColumnName("SignUpsEND")
                .HasColumnType("smalldatetime");

            entity.Property(e => e.SponsorFee).HasColumnType("money");

            entity.Property(e => e.ToDate).HasColumnType("smalldatetime");
        });

        modelBuilder.Entity<SponsorFee>(entity =>
        {
            entity.ToTable("SponsorFee");
            entity.HasKey(e => e.SponsorFeeId);
            entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime")
            .HasDefaultValue(DateTime.Now);

            entity.Property(e => e.CreatedUser)
                .HasMaxLength(20)
                .IsUnicode(false);

        });

        modelBuilder.Entity<SponsorPayment>(entity =>
        {
            entity.ToTable("SponsorPayment");
            entity.HasKey(e => e.PaymentId);
            entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime").HasDefaultValue(DateTime.Now);

            entity.Property(e => e.CreatedUser)
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.Property(e => e.Memo)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.Property(e => e.PaymentId).HasColumnName("PaymentID");

            entity.Property(e => e.PaymentType)
                .IsRequired()
                .HasMaxLength(10)
                .IsUnicode(false);

            entity.Property(e => e.ShoppingCartId)
                .HasColumnName("ShoppingCartID")
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.Property(e => e.SponsorProfileId).HasColumnName("SponsorProfileID");

            entity.Property(e => e.TransactionDate).HasColumnType("smalldatetime");

            entity.Property(e => e.TransactionNumber)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<SponsorProfile>(entity =>
        {
            entity.ToTable("SponsorProfile");
            entity.HasKey(e => e.SponsorProfileId);
            entity.Property(e => e.SponsorProfileId)
                .HasColumnName("SponsorProfileID")
                .ValueGeneratedNever();

            entity.Property(e => e.AdExpiration).HasColumnType("date");

            entity.Property(e => e.Address)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.Property(e => e.City)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

            entity.Property(e => e.ContactName)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime").HasDefaultValue(DateTime.Now);

            entity.Property(e => e.CreatedUser)
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.Property(e => e.Email)
                .HasColumnName("EMAIL")
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.Property(e => e.HouseId).HasColumnName("HouseID");

            entity.Property(e => e.Phone)
                .HasMaxLength(25)
                .IsUnicode(false);

            entity.Property(e => e.SpoName)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.Property(e => e.State)
                .HasMaxLength(2)
                .IsUnicode(false)
                .IsFixedLength();

            entity.Property(e => e.TypeOfBuss)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.Property(e => e.Url)
                .HasColumnName("URL")
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.Property(e => e.Zip)
                .HasMaxLength(15)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Sponsor>(entity =>
        {
            entity.ToTable("Sponsors");
            entity.HasKey(e => e.SponsorId);

            entity.Property(e => e.SponsorId)
                .HasColumnName("SponsorID")
                .ValueGeneratedNever();

            entity.Property(e => e.AdExpiration).HasColumnType("date");

            // entity.Property(e => e.AddressDelete)
            //     .HasColumnName("AddressDELETE")
            //     .HasMaxLength(100);

            // entity.Property(e => e.CityDelete)
            //     .HasColumnName("CityDELETE")
            //     .HasMaxLength(50);

            entity.Property(e => e.Color1).HasMaxLength(50);

            entity.Property(e => e.Color1Id).HasColumnName("Color1ID");

            entity.Property(e => e.Color2).HasMaxLength(50);

            entity.Property(e => e.Color2Id).HasColumnName("Color2ID");

            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

            // entity.Property(e => e.ContactNameDelete)
            //     .HasColumnName("ContactNameDELETE")
            //     .HasMaxLength(50);

            entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime").HasDefaultValue(DateTime.Now);

            entity.Property(e => e.CreatedUser).HasMaxLength(50);

            // entity.Property(e => e.Emaildelete)
            //     .HasColumnName("EMAILDELETE")
            //     .HasMaxLength(50);

            entity.Property(e => e.FeeId)
                .HasColumnName("FeeID")
                .HasColumnType("money");

            entity.Property(e => e.HouseId).HasColumnName("HouseID");

            // entity.Property(e => e.PhoneDelete)
            //     .HasColumnName("PhoneDELETE")
            //     .HasMaxLength(25);

            entity.Property(e => e.SeasonId).HasColumnName("SeasonID");

            entity.Property(e => e.ShirtName).HasMaxLength(50);

            entity.Property(e => e.ShirtSize).HasMaxLength(50);

            entity.Property(e => e.ShoppingCartId).HasColumnName("ShoppingCartID");

            entity.Property(e => e.SpoAmount).HasColumnType("money");

            // entity.Property(e => e.SpoNameDelete)
            //     .HasColumnName("SpoNameDELETE")
            //     .HasMaxLength(150);

            entity.Property(e => e.SponsorProfileId).HasColumnName("SponsorProfileID");

            // entity.Property(e => e.StateDelete)
            //     .HasColumnName("StateDELETE")
            //     .HasMaxLength(2);

            // entity.Property(e => e.TypeOfBussDelete)
            //     .HasColumnName("TypeOfBussDELETE")
            //     .HasMaxLength(50);

            // entity.Property(e => e.Urldelete)
            //     .HasColumnName("URLDELETE")
            //     .HasMaxLength(50);

            // entity.Property(e => e.ZipDelete)
            //     .HasColumnName("ZipDELETE")
            //     .HasMaxLength(15);
        });

        // modelBuilder.Entity<TeamRosters>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.Property(e => e.Birthdate).HasColumnType("datetime");

        //     entity.Property(e => e.FirstName).HasMaxLength(50);

        //     entity.Property(e => e.Grade)
        //         .HasMaxLength(10)
        //         .IsUnicode(false)
        //         .IsFixedLength();

        //     entity.Property(e => e.Id).HasColumnName("ID");

        //     entity.Property(e => e.LastName).HasMaxLength(50);

        //     entity.Property(e => e.TeamId).HasColumnName("TeamID");

        //     entity.Property(e => e.UpdateDate).HasColumnType("datetime");

        //     entity.Property(e => e.UpdateUser).HasMaxLength(50);
        // });

        modelBuilder.Entity<Team>(entity =>
        {
            entity.ToTable("Teams");
            // entity.HasKey(e => e.TeamId);

            entity.HasIndex(e => e.DivisionId)
                .HasDatabaseName("idx_DCh_12814_12813_Teams");

            entity.HasIndex(e => e.TeamId)
                .HasDatabaseName("idx_DCh_615_614_Teams");

            entity.HasIndex(e => new { e.DivisionId, e.TeamName, e.TeamColorId, e.TeamNumber, e.SeasonId })
                .HasDatabaseName("idx_DCh_376_375_Teams");

            entity.Property(e => e.TeamId).HasColumnName("TeamID");

            entity.Property(e => e.AssCoachId).HasColumnName("AssCoachID");

            entity.Property(e => e.CoachId).HasColumnName("CoachID");

            // entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

            entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime").HasDefaultValue(DateTime.Now);

            entity.Property(e => e.CreatedUser).HasMaxLength(50);

            entity.Property(e => e.DivisionId).HasColumnName("DivisionID");

            entity.Property(e => e.SeasonId).HasColumnName("SeasonID");

            entity.Property(e => e.SponsorId).HasColumnName("SponsorID");

            entity.Property(e => e.TeamColor).HasMaxLength(50);

            entity.Property(e => e.TeamColorId).HasColumnName("TeamColorID");

            entity.Property(e => e.TeamName).HasMaxLength(50);

            entity.Property(e => e.TeamNumber).HasMaxLength(2);
        });

        modelBuilder.Entity<WebContent>(entity =>
 {
     // entity.ToTable("WebContent");
     // entity.HasKey(entity => entity.WebContentId);
     entity.Property(e => e.DateAndTime).HasMaxLength(50);
     entity.Property(e => e.ExpirationDate).HasColumnType("datetime");
     entity.Property(e => e.Location).HasMaxLength(50);
     entity.Property(e => e.ModifiedDate).HasColumnType("datetime")
     .HasDefaultValue(DateTime.Now);
     entity.Property(e => e.Page).HasMaxLength(50);
     entity.Property(e => e.SubTitle).HasMaxLength(50);
     entity.Property(e => e.Title).HasMaxLength(50);
     entity.Property(e => e.Type).HasMaxLength(50);
     // entity.Navigation(w => w.WebContentType)
     // .UsePropertyAccessMode(PropertyAccessMode..Property);
 });
        modelBuilder.Entity<WebContentType>(entity =>
        {
            entity.Property(p => p.WebContentTypeId).ValueGeneratedOnAdd();
            entity.Property(e => e.WebContentTypeDescription)
                .IsRequired()
                .HasMaxLength(50);
            // entity.HasOne(e => e.WebContents)
            // .WithOne(w => w..WebContentType)
            // .HasForeignKey<WebContent>(w => w.WebContentTypeId);
        });
        
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(e => e.UserId);

            entity.HasIndex(e => e.UserId)
                .HasDatabaseName("idx_DCh_369_368_Users");

            entity.HasIndex(e => e.UserName)
                .HasDatabaseName("idx_DCh_4811_4810_Users");

            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

            entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime").HasDefaultValue(DateTime.Now);

            entity.Property(e => e.CreatedUser).HasMaxLength(50);

            entity.Property(e => e.HouseId).HasColumnName("HouseID");

            entity.Property(e => e.Name).HasMaxLength(50);

            entity.Property(e => e.PassWord).HasMaxLength(300);

            entity.Property(e => e.PersonId).HasColumnName("PeopleID");

            entity.Property(e => e.Pword)
                .HasColumnName("PWord")
                .HasMaxLength(50);

            entity.Property(e => e.UserName).HasMaxLength(50);

        });

        modelBuilder.Entity<Version>(entity =>
{
    entity.HasNoKey();

    // entity.Property(e => e.CreateDate).HasColumnType("datetime");

    // entity.Property(e => e.Version1).HasColumnName("Version");
});

        // modelBuilder.Entity<VwAllSponsors>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_AllSponsors");

        //     entity.Property(e => e.Address)
        //         .HasMaxLength(50)
        //         .IsUnicode(false);

        //     entity.Property(e => e.Balance).HasColumnType("decimal(14, 2)");

        //     entity.Property(e => e.City)
        //         .HasMaxLength(50)
        //         .IsUnicode(false);

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.ContactName)
        //         .HasMaxLength(50)
        //         .IsUnicode(false);

        //     entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime").HasDefaultValue(DateTime.Now);

        //     entity.Property(e => e.CreatedUser)
        //         .HasMaxLength(20)
        //         .IsUnicode(false);

        //     entity.Property(e => e.Email)
        //         .HasMaxLength(50)
        //         .IsUnicode(false);

        //     entity.Property(e => e.HouseId).HasColumnName("HouseID");

        //     entity.Property(e => e.Phone)
        //         .HasMaxLength(25)
        //         .IsUnicode(false);

        //     entity.Property(e => e.SpoName)
        //         .HasColumnName("spoName")
        //         .HasMaxLength(50)
        //         .IsUnicode(false);

        //     entity.Property(e => e.SponsorProfileId).HasColumnName("SponsorProfileID");

        //     entity.Property(e => e.State)
        //         .HasMaxLength(2)
        //         .IsUnicode(false)
        //         .IsFixedLength();

        //     entity.Property(e => e.Url)
        //         .HasColumnName("URL")
        //         .HasMaxLength(50)
        //         .IsUnicode(false);

        //     entity.Property(e => e.Zip)
        //         .HasMaxLength(15)
        //         .IsUnicode(false);
        // });

        // modelBuilder.Entity<VwBatchPlayers>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_BatchPlayers");

        //     entity.Property(e => e.Address1).HasMaxLength(50);

        //     entity.Property(e => e.City).HasMaxLength(50);

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.DraftId)
        //         .HasColumnName("DraftID")
        //         .HasMaxLength(3);

        //     entity.Property(e => e.Father).HasMaxLength(103);

        //     entity.Property(e => e.HouseId).HasColumnName("HouseID");

        //     entity.Property(e => e.Mother).HasMaxLength(103);

        //     entity.Property(e => e.Online)
        //         .IsRequired()
        //         .HasMaxLength(2)
        //         .IsUnicode(false);

        //     entity.Property(e => e.PaidAmount).HasColumnType("money");

        //     entity.Property(e => e.PersonId).HasColumnName("PersonId");

        //     entity.Property(e => e.Phone).HasMaxLength(25);

        //     entity.Property(e => e.PlayerId).HasColumnName("PlayerID");

        //     entity.Property(e => e.PlayerName).HasMaxLength(102);

        //     entity.Property(e => e.RefundBatchId).HasColumnName("RefundBatchID");

        //     entity.Property(e => e.SeaDesc)
        //         .HasColumnName("Sea_Desc")
        //         .HasMaxLength(50);

        //     entity.Property(e => e.State).HasMaxLength(2);

        //     entity.Property(e => e.Zip).HasMaxLength(20);
        // });

        // modelBuilder.Entity<VwCheckEmail>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_CheckEmail");

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.Email)
        //         .HasColumnName("email")
        //         .HasMaxLength(50);

        //     entity.Property(e => e.Pword)
        //         .HasColumnName("PWord")
        //         .HasMaxLength(50);

        //     entity.Property(e => e.UserName).HasMaxLength(50);
        // });

        // modelBuilder.Entity<VwCheckEncryption>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_CheckEncryption");

        //     entity.Property(e => e.Pwd).HasColumnName("PWD");

        //     entity.Property(e => e.SignedDate).HasColumnType("smalldatetime");

        //     entity.Property(e => e.SignedDateEnd).HasColumnType("smalldatetime");

        //     entity.Property(e => e.UserName).HasMaxLength(50);
        // });

        // modelBuilder.Entity<VwCheckLogin>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_CheckLogin");

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.CompanyName)
        //         .HasMaxLength(50)
        //         .IsUnicode(false);

        //     entity.Property(e => e.EmailSender)
        //         .HasMaxLength(50)
        //         .IsUnicode(false);

        //     entity.Property(e => e.HouseId).HasColumnName("HouseID");

        //     entity.Property(e => e.ImageName)
        //         .HasMaxLength(50)
        //         .IsUnicode(false);

        //     entity.Property(e => e.Password).HasMaxLength(300);

        //     entity.Property(e => e.Pword)
        //         .HasColumnName("PWord")
        //         .HasMaxLength(50);

        //     entity.Property(e => e.SeaDesc)
        //         .HasColumnName("Sea_Desc")
        //         .HasMaxLength(50);

        //     entity.Property(e => e.SeasonId).HasColumnName("SeasonID");

        //     entity.Property(e => e.SignUpSeasonId).HasColumnName("SignUpSeasonID");

        //     entity.Property(e => e.SignedDate).HasColumnType("smalldatetime");

        //     entity.Property(e => e.SignedDateEnd).HasColumnType("smalldatetime");

        //     entity.Property(e => e.UserId).HasColumnName("UserID");

        //     entity.Property(e => e.UserName).HasMaxLength(50);
        // });

        // modelBuilder.Entity<VwCoach>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_Coach");

        //     entity.Property(e => e.Address1).HasMaxLength(50);

        //     entity.Property(e => e.Cellphone).HasMaxLength(15);

        //     entity.Property(e => e.City).HasMaxLength(50);

        //     entity.Property(e => e.CoachId).HasColumnName("CoachID");

        //     entity.Property(e => e.CoachPhone).HasMaxLength(25);

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.Housephone).HasMaxLength(25);

        //     entity.Property(e => e.Name).HasMaxLength(102);

        //     entity.Property(e => e.PersonId).HasColumnName("PersonID");

        //     entity.Property(e => e.SeasonId).HasColumnName("SeasonID");

        //     entity.Property(e => e.ShirtSize).HasMaxLength(50);

        //     entity.Property(e => e.State).HasMaxLength(2);

        //     entity.Property(e => e.Zip).HasMaxLength(20);
        // });

        // modelBuilder.Entity<VwComments>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_Comments");

        //     entity.Property(e => e.Comment).HasColumnType("ntext");

        //     entity.Property(e => e.CommentId).HasColumnName("CommentID");

        //     entity.Property(e => e.CommentType).HasMaxLength(50);

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime").HasDefaultValue(DateTime.Now);

        //     entity.Property(e => e.CreatedUser).HasMaxLength(50);

        //     entity.Property(e => e.LinkId).HasColumnName("LinkID");
        // });

        // modelBuilder.Entity<VwContent>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_Content");

        //     entity.Property(e => e.CntId).HasColumnName("CntID");

        //     entity.Property(e => e.CntScreen)
        //         .HasColumnName("cntScreen")
        //         .HasMaxLength(15);

        //     entity.Property(e => e.CntSeq).HasColumnName("cntSeq");

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.CreatedDate).HasColumnType("datetime").HasDefaultValue(DateTime.Now);

        //     entity.Property(e => e.CreatedUser).HasMaxLength(50);

        //     entity.Property(e => e.EndDate).HasColumnType("datetime");

        //     entity.Property(e => e.FontColor).HasMaxLength(10);

        //     entity.Property(e => e.FontSize).HasMaxLength(10);

        //     entity.Property(e => e.LineText).HasMaxLength(100);

        //     entity.Property(e => e.Link).HasMaxLength(400);

        //     entity.Property(e => e.StartDate).HasColumnType("datetime");
        // });

        // modelBuilder.Entity<VwDirector>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_Director");

        //     entity.Property(e => e.Address1).HasMaxLength(50);

        //     entity.Property(e => e.CellPhone).HasMaxLength(15);

        //     entity.Property(e => e.City).HasMaxLength(50);

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.Email).HasMaxLength(50);

        //     entity.Property(e => e.DirectorId).HasColumnName("DirectorID");

        //     entity.Property(e => e.Name).HasMaxLength(101);

        //     entity.Property(e => e.Phone).HasMaxLength(25);

        //     entity.Property(e => e.PhonePref).HasMaxLength(10);

        //     entity.Property(e => e.PhoneSelected).HasMaxLength(25);

        //     entity.Property(e => e.State).HasMaxLength(2);

        //     entity.Property(e => e.Title).HasMaxLength(50);

        //     entity.Property(e => e.WorkPhone).HasMaxLength(25);

        //     entity.Property(e => e.Zip).HasMaxLength(20);
        // });

        // modelBuilder.Entity<VwDivision>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_Division");

        //     entity.Property(e => e.Ad).HasColumnName("AD");

        //     entity.Property(e => e.Cellphone).HasMaxLength(15);

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.DirectorId).HasColumnName("DirectorID");

        //     entity.Property(e => e.DivDesc)
        //         .HasColumnName("Div_Desc")
        //         .HasMaxLength(50);

        //     entity.Property(e => e.DivisionId).HasColumnName("DivisionID");

        //     entity.Property(e => e.DraftDate).HasColumnType("smalldatetime");

        //     entity.Property(e => e.DraftTime).HasMaxLength(10);

        //     entity.Property(e => e.DraftVenue).HasMaxLength(50);

        //     entity.Property(e => e.FirstName).HasMaxLength(50);

        //     entity.Property(e => e.Gender).HasMaxLength(1);

        //     entity.Property(e => e.Gender2).HasMaxLength(1);

        //     entity.Property(e => e.HousePhone).HasMaxLength(25);

        //     entity.Property(e => e.LastName).HasMaxLength(50);

        //     entity.Property(e => e.MaxDate).HasColumnType("smalldatetime");

        //     entity.Property(e => e.MaxDate2).HasColumnType("smalldatetime");

        //     entity.Property(e => e.MinDate).HasColumnType("smalldatetime");

        //     entity.Property(e => e.MinDate2).HasColumnType("smalldatetime");

        //     entity.Property(e => e.SeasonId).HasColumnName("SeasonID");
        // });

        // modelBuilder.Entity<VwGetBatchPlayers>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_GetBatchPlayers");

        //     entity.Property(e => e.Address1).HasMaxLength(50);

        //     entity.Property(e => e.CheckMemo).HasMaxLength(50);

        //     entity.Property(e => e.City).HasMaxLength(50);

        //     entity.Property(e => e.DraftId)
        //         .HasColumnName("DraftID")
        //         .HasMaxLength(3);

        //     entity.Property(e => e.Father).HasMaxLength(103);

        //     entity.Property(e => e.MainHouseId).HasColumnName("MainHouseID");

        //     entity.Property(e => e.Mother).HasMaxLength(103);

        //     entity.Property(e => e.Online)
        //         .IsRequired()
        //         .HasMaxLength(2)
        //         .IsUnicode(false);

        //     entity.Property(e => e.PaidAmount).HasColumnType("money");

        //     entity.Property(e => e.Phone).HasMaxLength(25);

        //     entity.Property(e => e.PlayerId).HasColumnName("PlayerID");

        //     entity.Property(e => e.PlayerName).HasMaxLength(102);

        //     entity.Property(e => e.RefundBatchId).HasColumnName("RefundBatchID");

        //     entity.Property(e => e.State).HasMaxLength(2);

        //     entity.Property(e => e.Zip).HasMaxLength(20);
        // });

        // modelBuilder.Entity<VwGetBoardInf>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_GetBoardInf");

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.Email)
        //         .IsRequired()
        //         .HasMaxLength(50);

        //     entity.Property(e => e.Name).HasMaxLength(101);

        //     entity.Property(e => e.Phone)
        //         .IsRequired()
        //         .HasMaxLength(25);

        //     entity.Property(e => e.Photo).HasColumnType("image");

        //     entity.Property(e => e.Title).HasMaxLength(50);
        // });

        // modelBuilder.Entity<VwGetBoardMembers>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_GetBoardMembers");

        //     entity.Property(e => e.Cellphone)
        //         .IsRequired()
        //         .HasColumnName("CELLPHONE")
        //         .HasMaxLength(15);

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.Email)
        //         .IsRequired()
        //         .HasMaxLength(50);

        //     entity.Property(e => e.Name).HasMaxLength(101);

        //     entity.Property(e => e.Phone)
        //         .IsRequired()
        //         .HasColumnName("PHONE")
        //         .HasMaxLength(25);

        //     entity.Property(e => e.Title).HasMaxLength(50);

        //     entity.Property(e => e.Workphone)
        //         .IsRequired()
        //         .HasColumnName("WORKPHONE")
        //         .HasMaxLength(25);
        // });

        // modelBuilder.Entity<VwGetContent>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_GetContent");

        //     entity.Property(e => e.CntScreen)
        //         .HasColumnName("cntScreen")
        //         .HasMaxLength(15);

        //     entity.Property(e => e.CntSeq).HasColumnName("cntSeq");

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.EndDate).HasColumnType("datetime");

        //     entity.Property(e => e.FontColor).HasMaxLength(10);

        //     entity.Property(e => e.FontSize).HasMaxLength(10);

        //     entity.Property(e => e.LineText).HasMaxLength(100);

        //     entity.Property(e => e.Link)
        //         .IsRequired()
        //         .HasMaxLength(400);

        //     entity.Property(e => e.StartDate).HasColumnType("datetime");

        //     entity.Property(e => e.UnderLn).HasColumnName("UnderLN");
        // });

        // modelBuilder.Entity<VwGetHousePlayers>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_GetHousePlayers");

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.DivDesc)
        //         .HasColumnName("div_desc")
        //         .HasMaxLength(50);

        //     entity.Property(e => e.Mainhouseid).HasColumnName("mainhouseid");

        //     entity.Property(e => e.Name).HasMaxLength(101);

        //     entity.Property(e => e.Player).HasColumnName("player");

        //     entity.Property(e => e.SeasonId).HasColumnName("SeasonID");

        //     entity.Property(e => e.Status)
        //         .IsRequired()
        //         .HasMaxLength(15)
        //         .IsUnicode(false);
        // });

        // modelBuilder.Entity<VwGetPlayers>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_GetPlayers");

        //     entity.Property(e => e.BalanceOwed).HasColumnType("money");

        //     entity.Property(e => e.BirthDate).HasColumnType("datetime");

        //     entity.Property(e => e.CheckMemo).HasMaxLength(50);

        //     entity.Property(e => e.CoachId).HasColumnName("CoachID");

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime").HasDefaultValue(DateTime.Now);

        //     entity.Property(e => e.DivDesc)
        //         .HasColumnName("Div_Desc")
        //         .HasMaxLength(50);

        //     entity.Property(e => e.DivisionId).HasColumnName("DivisionID");

        //     entity.Property(e => e.DraftId)
        //         .HasColumnName("DraftID")
        //         .HasMaxLength(3);

        //     entity.Property(e => e.DraftNotes).HasMaxLength(100);

        //     entity.Property(e => e.FirstName).HasMaxLength(50);

        //     entity.Property(e => e.Gender).HasMaxLength(1);

        //     entity.Property(e => e.HouseId).HasColumnName("HouseID");

        //     entity.Property(e => e.HouseName).HasMaxLength(50);

        //     entity.Property(e => e.HousePhone).HasMaxLength(25);

        //     entity.Property(e => e.LastName).HasMaxLength(50);

        //     entity.Property(e => e.NoteDesc).HasMaxLength(50);

        //     entity.Property(e => e.PaidAmount).HasColumnType("money");

        //     entity.Property(e => e.PaidDate).HasColumnType("smalldatetime");

        //     entity.Property(e => e.PayType).HasMaxLength(5);

        //     entity.Property(e => e.PersonId).HasColumnName("PersonId");

        //     entity.Property(e => e.PlayerId).HasColumnName("PlayerID");

        //     entity.Property(e => e.RefundBatchId).HasColumnName("RefundBatchID");

        //     entity.Property(e => e.SeasonId).HasColumnName("SeasonID");

        //     entity.Property(e => e.SpoName)
        //         .HasMaxLength(50)
        //         .IsUnicode(false);

        //     entity.Property(e => e.SponsorId).HasColumnName("SponsorID");

        //     entity.Property(e => e.TeamColor)
        //         .HasMaxLength(20)
        //         .IsUnicode(false);

        //     entity.Property(e => e.TeamId).HasColumnName("TeamID");

        //     entity.Property(e => e.TeamName).HasMaxLength(50);

        //     entity.Property(e => e.TeamNumber).HasMaxLength(2);
        // });

        // modelBuilder.Entity<VwGetRegistratedPlayers>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_GetRegistratedPlayers");

        //     entity.Property(e => e.DivDesc)
        //         .HasColumnName("Div_Desc")
        //         .HasMaxLength(50);

        //     entity.Property(e => e.DraftDate).HasColumnType("smalldatetime");

        //     entity.Property(e => e.DraftTime).HasMaxLength(10);

        //     entity.Property(e => e.DraftVenue).HasMaxLength(50);

        //     entity.Property(e => e.Name).HasMaxLength(101);

        //     entity.Property(e => e.ScartAmount)
        //         .HasColumnName("SCartAmount")
        //         .HasColumnType("money");

        //     entity.Property(e => e.SccreatedDate)
        //         .HasColumnName("SCCreatedDate")
        //         .HasColumnType("datetime");

        //     entity.Property(e => e.Scfee)
        //         .HasColumnName("SCFee")
        //         .HasColumnType("money");

        //     entity.Property(e => e.TxnId)
        //         .HasColumnName("Txn_ID")
        //         .HasMaxLength(50);
        // });

        // modelBuilder.Entity<VwGetTryoutsInfo>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_GetTryoutsInfo");

        //     entity.Property(e => e.Birthdates)
        //         .HasMaxLength(63)
        //         .IsUnicode(false);

        //     entity.Property(e => e.Division).HasMaxLength(50);

        //     entity.Property(e => e.Gender)
        //         .IsRequired()
        //         .HasMaxLength(5)
        //         .IsUnicode(false);

        //     entity.Property(e => e.Location).HasMaxLength(50);

        //     entity.Property(e => e.MinDate).HasColumnType("smalldatetime");

        //     entity.Property(e => e.SeasonId).HasColumnName("SeasonID");

        //     entity.Property(e => e.Sex).HasMaxLength(1);

        //     entity.Property(e => e.Tryouts).HasMaxLength(43);
        // });

        // modelBuilder.Entity<VwGetUsers>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_GetUsers");

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime");

        //     entity.Property(e => e.CreatedUser).HasMaxLength(50);

        //     entity.Property(e => e.HouseId).HasColumnName("HouseID");

        //     entity.Property(e => e.Name).HasMaxLength(50);

        //     entity.Property(e => e.PassWord).HasMaxLength(300);

        //     entity.Property(e => e.PersonId).HasColumnName("PersonId");

        //     entity.Property(e => e.Pword)
        //         .HasColumnName("PWord")
        //         .HasMaxLength(50);

        //     entity.Property(e => e.UserId)
        //         .HasColumnName("UserID")
        //         .ValueGeneratedOnAdd();

        //     entity.Property(e => e.UserName).HasMaxLength(50);
        // });

        // modelBuilder.Entity<VwHouseholds>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_Households");

        //     entity.Property(e => e.Address1).HasMaxLength(50);

        //     entity.Property(e => e.Address2).HasMaxLength(50);

        //     entity.Property(e => e.City).HasMaxLength(50);

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime");

        //     entity.Property(e => e.CreatedUser).HasMaxLength(20);

        //     entity.Property(e => e.Email).HasMaxLength(50);

        //     entity.Property(e => e.HouseId).HasColumnName("HouseID");

        //     entity.Property(e => e.Name).HasMaxLength(50);

        //     entity.Property(e => e.Phone).HasMaxLength(25);

        //     entity.Property(e => e.Pword)
        //         .HasColumnName("PWord")
        //         .HasMaxLength(50);

        //     entity.Property(e => e.SportsCard).HasMaxLength(15);

        //     entity.Property(e => e.State).HasMaxLength(2);

        //     entity.Property(e => e.UserName).HasMaxLength(50);

        //     entity.Property(e => e.Zip).HasMaxLength(20);
        // });

        // modelBuilder.Entity<VwPeople>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_People");

        //     entity.Property(e => e.Ad).HasColumnName("AD");

        //     entity.Property(e => e.Address1).HasMaxLength(50);

        //     entity.Property(e => e.Address2).HasMaxLength(50);

        //     entity.Property(e => e.Bc).HasColumnName("BC");

        //     entity.Property(e => e.BirthDate).HasColumnType("datetime");

        //     entity.Property(e => e.CellPhone).HasMaxLength(15);

        //     entity.Property(e => e.City).HasMaxLength(50);

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime");

        //     entity.Property(e => e.CreatedUser).HasMaxLength(20);

        //     entity.Property(e => e.Email).HasMaxLength(50);

        //     entity.Property(e => e.FirstName).HasMaxLength(50);

        //     entity.Property(e => e.Gender).HasMaxLength(1);

        //     entity.Property(e => e.HouseId).HasColumnName("HouseID");

        //     entity.Property(e => e.HouseName).HasMaxLength(50);

        //     entity.Property(e => e.HousePhone).HasMaxLength(25);

        //     entity.Property(e => e.LastName).HasMaxLength(50);

        //     entity.Property(e => e.LatestSeason).HasMaxLength(15);

        //     entity.Property(e => e.LatestShirtSize).HasMaxLength(20);

        //     entity.Property(e => e.PersonId).HasColumnName("PersonId");

        //     entity.Property(e => e.SchoolName).HasMaxLength(50);

        //     entity.Property(e => e.State).HasMaxLength(2);

        //     entity.Property(e => e.WorkPhone).HasMaxLength(25);

        //     entity.Property(e => e.Zip).HasMaxLength(20);
        // });

        // modelBuilder.Entity<VwPlayersList>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_PlayersList");

        //     entity.Property(e => e.Address1).HasMaxLength(50);

        //     entity.Property(e => e.BalanceOwed).HasColumnType("money");

        //     entity.Property(e => e.BirthDate).HasColumnType("datetime");

        //     entity.Property(e => e.City).HasMaxLength(50);

        //     entity.Property(e => e.CoachId).HasColumnName("CoachID");

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.Father).HasMaxLength(102);

        //     entity.Property(e => e.Mother).HasMaxLength(102);

        //     entity.Property(e => e.Name).HasMaxLength(102);

        //     entity.Property(e => e.PaidAmount).HasColumnType("money");

        //     entity.Property(e => e.Phone).HasMaxLength(25);

        //     entity.Property(e => e.PlayerId).HasColumnName("PlayerID");

        //     entity.Property(e => e.Scholarship)
        //         .HasMaxLength(1)
        //         .IsUnicode(false);

        //     entity.Property(e => e.SeasonId).HasColumnName("SeasonID");

        //     entity.Property(e => e.Sportscard).HasMaxLength(15);

        //     entity.Property(e => e.TeamNumber)
        //         .IsRequired()
        //         .HasMaxLength(2);

        //     entity.Property(e => e.Zip).HasMaxLength(20);
        // });

        // modelBuilder.Entity<VwRoles>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_Roles");

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.CreatedDate).HasColumnType("datetime");

        //     entity.Property(e => e.CreatedUser)
        //         .HasMaxLength(10)
        //         .IsUnicode(false)
        //         .IsFixedLength();

        //     entity.Property(e => e.RoleId)
        //         .HasColumnName("RoleID")
        //         .HasColumnType("decimal(18, 0)");

        //     entity.Property(e => e.ScreenName)
        //         .HasMaxLength(10)
        //         .IsUnicode(false)
        //         .IsFixedLength();

        //     entity.Property(e => e.UserId)
        //         .HasColumnName("UserID")
        //         .HasColumnType("decimal(18, 0)");
        // });

        // modelBuilder.Entity<VwSeason>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_Season");

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.ConvenienceFee).HasColumnType("money");

        //     entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime");

        //     entity.Property(e => e.CreatedUser).HasMaxLength(50);

        //     entity.Property(e => e.FromDate).HasColumnType("smalldatetime");

        //     entity.Property(e => e.ParticipationFee).HasColumnType("money");

        //     entity.Property(e => e.SeaDesc)
        //         .HasColumnName("Sea_Desc")
        //         .HasMaxLength(50);

        //     entity.Property(e => e.SeasonId)
        //         .HasColumnName("SeasonID")
        //         .ValueGeneratedOnAdd();

        //     entity.Property(e => e.SignUpsDate).HasColumnType("datetime");

        //     entity.Property(e => e.SignUpsEnd).HasColumnType("datetime");

        //     entity.Property(e => e.SponsorFee).HasColumnType("money");

        //     entity.Property(e => e.SponsorFeeDiscounted).HasColumnType("money");

        //     entity.Property(e => e.ToDate).HasColumnType("smalldatetime");
        // });

        // modelBuilder.Entity<VwSeasonCounts>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_SeasonCounts");

        //     entity.Property(e => e.CoachesOr).HasColumnName("CoachesOR");

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.DivDesc)
        //         .HasColumnName("Div_Desc")
        //         .HasMaxLength(50);

        //     entity.Property(e => e.DivisionId).HasColumnName("DivisionID");

        //     entity.Property(e => e.Gender).HasMaxLength(1);

        //     entity.Property(e => e.MinDate).HasColumnType("smalldatetime");

        //     entity.Property(e => e.SeasonId).HasColumnName("SeasonID");

        //     entity.Property(e => e.SponsorsOr).HasColumnName("SponsorsOR");

        //     entity.Property(e => e.TotalOr).HasColumnName("TotalOR");
        // });

        // modelBuilder.Entity<VwSeasonSponsors>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_SeasonSponsors");

        //     entity.Property(e => e.Address)
        //         .HasMaxLength(50)
        //         .IsUnicode(false);

        //     entity.Property(e => e.AmtPaid).HasColumnType("decimal(14, 2)");

        //     entity.Property(e => e.City)
        //         .HasMaxLength(50)
        //         .IsUnicode(false);

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.ContactName)
        //         .HasMaxLength(50)
        //         .IsUnicode(false);

        //     entity.Property(e => e.DivDesc)
        //         .HasColumnName("Div_Desc")
        //         .HasMaxLength(50);

        //     entity.Property(e => e.FeeId)
        //         .HasColumnName("FeeID")
        //         .HasColumnType("money");

        //     entity.Property(e => e.Gender).HasMaxLength(1);

        //     entity.Property(e => e.MinDate).HasColumnType("smalldatetime");

        //     entity.Property(e => e.OnlineFlag)
        //         .IsRequired()
        //         .HasMaxLength(1)
        //         .IsUnicode(false);

        //     entity.Property(e => e.Phone)
        //         .HasMaxLength(25)
        //         .IsUnicode(false);

        //     entity.Property(e => e.Player).HasMaxLength(102);

        //     entity.Property(e => e.SeasonId).HasColumnName("SeasonID");

        //     entity.Property(e => e.SpoName)
        //         .HasMaxLength(50)
        //         .IsUnicode(false);

        //     entity.Property(e => e.SponsorProfileId).HasColumnName("SponsorProfileID");

        //     entity.Property(e => e.State)
        //         .HasMaxLength(2)
        //         .IsUnicode(false)
        //         .IsFixedLength();

        //     entity.Property(e => e.TeamNumber).HasMaxLength(2);

        //     entity.Property(e => e.Url)
        //         .HasColumnName("URL")
        //         .HasMaxLength(50)
        //         .IsUnicode(false);

        //     entity.Property(e => e.Zip)
        //         .HasMaxLength(15)
        //         .IsUnicode(false);
        // });

        // modelBuilder.Entity<VwSponsorPayments>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_SponsorPayments");

        //     entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime");

        //     entity.Property(e => e.CreatedUser)
        //         .HasMaxLength(20)
        //         .IsUnicode(false);

        //     entity.Property(e => e.Memo)
        //         .HasMaxLength(100)
        //         .IsUnicode(false);

        //     entity.Property(e => e.PaymentId).HasColumnName("PaymentID");

        //     entity.Property(e => e.PaymentType)
        //         .IsRequired()
        //         .HasMaxLength(10)
        //         .IsUnicode(false);

        //     entity.Property(e => e.SponsorProfileId).HasColumnName("SponsorProfileID");

        //     entity.Property(e => e.TransactionDate).HasColumnType("smalldatetime");

        //     entity.Property(e => e.TransactionNumber)
        //         .HasMaxLength(50)
        //         .IsUnicode(false);
        // });

        // modelBuilder.Entity<VwSponsoredTeams>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_SponsoredTeams");

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.DivDesc)
        //         .HasColumnName("Div_Desc")
        //         .HasMaxLength(50);

        //     entity.Property(e => e.SeaDesc)
        //         .HasColumnName("Sea_Desc")
        //         .HasMaxLength(50);

        //     entity.Property(e => e.SeasonId).HasColumnName("SeasonID");

        //     entity.Property(e => e.SponsorFee).HasColumnType("money");

        //     entity.Property(e => e.SponsorId).HasColumnName("SponsorID");

        //     entity.Property(e => e.TeamNumber).HasMaxLength(2);
        // });

        // modelBuilder.Entity<VwSponsors>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_Sponsors");

        //     entity.Property(e => e.Address)
        //         .HasMaxLength(50)
        //         .IsUnicode(false);

        //     entity.Property(e => e.Balance).HasColumnType("decimal(14, 2)");

        //     entity.Property(e => e.City)
        //         .HasMaxLength(50)
        //         .IsUnicode(false);

        //     entity.Property(e => e.Color1Id).HasColumnName("Color1ID");

        //     entity.Property(e => e.Color1name)
        //         .HasMaxLength(20)
        //         .IsUnicode(false);

        //     entity.Property(e => e.Color2Id).HasColumnName("Color2ID");

        //     entity.Property(e => e.Color2name)
        //         .HasMaxLength(20)
        //         .IsUnicode(false);

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.ContactName)
        //         .HasMaxLength(50)
        //         .IsUnicode(false);

        //     entity.Property(e => e.Email)
        //         .HasMaxLength(50)
        //         .IsUnicode(false);

        //     entity.Property(e => e.FeeId)
        //         .HasColumnName("FeeID")
        //         .HasColumnType("money");

        //     entity.Property(e => e.Phone)
        //         .HasMaxLength(25)
        //         .IsUnicode(false);

        //     entity.Property(e => e.SeasonId).HasColumnName("SeasonID");

        //     entity.Property(e => e.ShirtName).HasMaxLength(50);

        //     entity.Property(e => e.ShirtSize).HasMaxLength(50);

        //     entity.Property(e => e.SpoName)
        //         .HasColumnName("spoName")
        //         .HasMaxLength(50)
        //         .IsUnicode(false);

        //     entity.Property(e => e.SponsorId).HasColumnName("SponsorID");

        //     entity.Property(e => e.SponsorProfileId).HasColumnName("SponsorProfileID");

        //     entity.Property(e => e.State)
        //         .HasMaxLength(2)
        //         .IsUnicode(false)
        //         .IsFixedLength();

        //     entity.Property(e => e.TypeOfBuss)
        //         .HasMaxLength(50)
        //         .IsUnicode(false);

        //     entity.Property(e => e.Url)
        //         .HasColumnName("URL")
        //         .HasMaxLength(50)
        //         .IsUnicode(false);

        //     entity.Property(e => e.Zip)
        //         .HasMaxLength(15)
        //         .IsUnicode(false);
        // });

        // modelBuilder.Entity<VwTeam>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_Teams");

        //     entity.Property(e => e.AssCoachId).HasColumnName("AssCoachID");

        //     entity.Property(e => e.AsstCell).HasMaxLength(15);

        //     entity.Property(e => e.AsstPhone).HasMaxLength(25);

        //     entity.Property(e => e.CoachCell).HasMaxLength(15);

        //     entity.Property(e => e.CoachId).HasColumnName("CoachID");

        //     entity.Property(e => e.CoachPhone).HasMaxLength(25);

        //     entity.Property(e => e.ColorId).HasColumnName("ColorID");

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.DivisionId).HasColumnName("DivisionID");

        //     entity.Property(e => e.SeasonId).HasColumnName("SeasonID");

        //     entity.Property(e => e.SponsorId).HasColumnName("SponsorID");

        //     entity.Property(e => e.SponsorProfileId).HasColumnName("SponsorProfileID");

        //     entity.Property(e => e.TeamColor)
        //         .HasMaxLength(20)
        //         .IsUnicode(false);

        //     entity.Property(e => e.TeamId).HasColumnName("TeamID");

        //     entity.Property(e => e.TeamName).HasMaxLength(50);

        //     entity.Property(e => e.TeamNumber).HasMaxLength(2);
        // });

        // modelBuilder.Entity<VwUsers>(entity =>
        // {
        //     entity.HasNoKey();

        //     entity.ToView("vw_Users");

        //     entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

        //     entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime");

        //     entity.Property(e => e.CreatedUser).HasMaxLength(50);

        //     entity.Property(e => e.HouseId).HasColumnName("HouseID");

        //     entity.Property(e => e.PassWord).HasMaxLength(300);

        //     entity.Property(e => e.PersonId).HasColumnName("PersonId");

        //     entity.Property(e => e.Pword)
        //         .HasColumnName("PWord")
        //         .HasMaxLength(50);

        //     entity.Property(e => e.UserId)
        //         .HasColumnName("UserID")
        //         .ValueGeneratedOnAdd();

        //     entity.Property(e => e.UserName).HasMaxLength(50);
        // });


        modelBuilder.Entity<User>().HasData(new User { UserId = 1, UserName = "TestUser", UserType = 0 });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

