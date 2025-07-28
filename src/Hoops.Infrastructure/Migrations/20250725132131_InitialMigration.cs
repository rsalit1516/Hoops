using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hoops.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Colors",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false),
                    CompanyID = table.Column<int>(type: "int", nullable: true),
                    ColorName = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    Discontinued = table.Column<bool>(type: "bit", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: true, defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 418, DateTimeKind.Local).AddTicks(6723)),
                    CreatedUser = table.Column<string>(type: "char(10)", unicode: false, fixedLength: true, maxLength: 10, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Colors", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Company",
                columns: table => new
                {
                    CompanyID = table.Column<int>(type: "int", nullable: false),
                    CompanyName = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    TimeZone = table.Column<int>(type: "int", nullable: false),
                    ImageName = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    EmailSender = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: true, defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 419, DateTimeKind.Local).AddTicks(8580)),
                    CreatedUser = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Company", x => x.CompanyID);
                });

            migrationBuilder.CreateTable(
                name: "Directors",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false),
                    CompanyID = table.Column<int>(type: "int", nullable: true),
                    PeopleID = table.Column<int>(type: "int", nullable: false),
                    Seq = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Photo = table.Column<byte[]>(type: "image", nullable: true),
                    PhonePref = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    EmailPref = table.Column<int>(type: "int", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true, defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 420, DateTimeKind.Local).AddTicks(9137)),
                    CreatedUser = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Directors", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Households",
                columns: table => new
                {
                    HouseID = table.Column<int>(type: "int", nullable: false),
                    CompanyID = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: true),
                    Address1 = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Address2 = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    City = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    State = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: true),
                    Zip = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    EmailList = table.Column<bool>(type: "bit", nullable: true),
                    SportsCard = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true),
                    Guardian = table.Column<int>(type: "int", nullable: true),
                    FeeWaived = table.Column<bool>(type: "bit", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true, defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 436, DateTimeKind.Local).AddTicks(9392)),
                    CreatedUser = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    TEMID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Households", x => x.HouseID);
                });

            migrationBuilder.CreateTable(
                name: "Rolls",
                columns: table => new
                {
                    RollsID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    ScreenName = table.Column<string>(type: "char(10)", unicode: false, fixedLength: true, maxLength: 10, nullable: true),
                    AccessType = table.Column<string>(type: "char(1)", unicode: false, fixedLength: true, maxLength: 1, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: true, defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 452, DateTimeKind.Local).AddTicks(1927)),
                    CreatedUser = table.Column<string>(type: "char(10)", unicode: false, fixedLength: true, maxLength: 10, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rolls", x => x.RollsID);
                });

            migrationBuilder.CreateTable(
                name: "ScheduleLocations",
                columns: table => new
                {
                    LocationNumber = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LocationName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScheduleLocations", x => x.LocationNumber);
                });

            migrationBuilder.CreateTable(
                name: "SchedulePlayoffs",
                columns: table => new
                {
                    ScheduleNumber = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GameNumber = table.Column<int>(type: "int", nullable: false),
                    LocationNumber = table.Column<int>(type: "int", nullable: true),
                    GameDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    GameTime = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VisitingTeam = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HomeTeam = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Descr = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VisitingTeamScore = table.Column<int>(type: "int", nullable: true),
                    HomeTeamScore = table.Column<int>(type: "int", nullable: true),
                    DivisionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SchedulePlayoffs", x => x.ScheduleNumber);
                });

            migrationBuilder.CreateTable(
                name: "Seasons",
                columns: table => new
                {
                    SeasonID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyID = table.Column<int>(type: "int", nullable: true),
                    Sea_Desc = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FromDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    ToDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    ParticipationFee = table.Column<decimal>(type: "money", nullable: true),
                    SponsorFee = table.Column<decimal>(type: "money", nullable: true),
                    ConvenienceFee = table.Column<decimal>(type: "money", nullable: true),
                    CurrentSeason = table.Column<bool>(type: "bit", nullable: true),
                    CurrentSchedule = table.Column<bool>(type: "bit", nullable: true),
                    CurrentSignUps = table.Column<bool>(type: "bit", nullable: true),
                    SignUpsDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    SignUpsEND = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    TestSeason = table.Column<bool>(type: "bit", nullable: true),
                    NewSchoolYear = table.Column<bool>(type: "bit", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true, defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 472, DateTimeKind.Local).AddTicks(6317)),
                    CreatedUser = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Seasons", x => x.SeasonID);
                });

            migrationBuilder.CreateTable(
                name: "SponsorFee",
                columns: table => new
                {
                    SponsorFeeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: false, defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 475, DateTimeKind.Local).AddTicks(6712)),
                    CreatedUser = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SponsorFee", x => x.SponsorFeeId);
                });

            migrationBuilder.CreateTable(
                name: "SponsorProfile",
                columns: table => new
                {
                    SponsorProfileID = table.Column<int>(type: "int", nullable: false),
                    CompanyID = table.Column<int>(type: "int", nullable: false),
                    HouseID = table.Column<int>(type: "int", nullable: true),
                    ContactName = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    SpoName = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    EMAIL = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    URL = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Address = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    City = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    State = table.Column<string>(type: "char(2)", unicode: false, fixedLength: true, maxLength: 2, nullable: true),
                    Zip = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true),
                    Phone = table.Column<string>(type: "varchar(25)", unicode: false, maxLength: 25, nullable: true),
                    TypeOfBuss = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true, defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 479, DateTimeKind.Local).AddTicks(9329)),
                    CreatedUser = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    ShowAd = table.Column<bool>(type: "bit", nullable: true),
                    AdExpiration = table.Column<DateTime>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SponsorProfile", x => x.SponsorProfileID);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "int", nullable: false),
                    CompanyID = table.Column<int>(type: "int", nullable: true),
                    UserName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PWord = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PassWord = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    UserType = table.Column<int>(type: "int", nullable: true),
                    ValidationCode = table.Column<int>(type: "int", nullable: true),
                    PeopleID = table.Column<int>(type: "int", nullable: true),
                    HouseID = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true, defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 500, DateTimeKind.Local).AddTicks(9891)),
                    CreatedUser = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserID);
                });

            migrationBuilder.CreateTable(
                name: "VwCoaches",
                columns: table => new
                {
                    CoachId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyId = table.Column<int>(type: "int", nullable: false),
                    SeasonId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Housephone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Cellphone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ShirtSize = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PersonId = table.Column<int>(type: "int", nullable: true),
                    Address1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    State = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Zip = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CoachPhone = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VwCoaches", x => x.CoachId);
                });

            migrationBuilder.CreateTable(
                name: "VwDirectors",
                columns: table => new
                {
                    DirectorId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PersonId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Seq = table.Column<int>(type: "int", nullable: true),
                    PhoneSelected = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CellPhone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WorkPhone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    State = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Zip = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhonePref = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmailPref = table.Column<int>(type: "int", nullable: true),
                    CompanyId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VwDirectors", x => x.DirectorId);
                });

            migrationBuilder.CreateTable(
                name: "WebContent",
                columns: table => new
                {
                    WebContentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyId = table.Column<int>(type: "int", nullable: true),
                    Page = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Title = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ContentSequence = table.Column<int>(type: "int", nullable: true),
                    SubTitle = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Location = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    DateAndTime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Body = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExpirationDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime", nullable: true, defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 498, DateTimeKind.Local).AddTicks(8909)),
                    ModifiedUser = table.Column<int>(type: "int", nullable: true),
                    WebContentTypeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebContent", x => x.WebContentId);
                });

            migrationBuilder.CreateTable(
                name: "WebContentType",
                columns: table => new
                {
                    WebContentTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WebContentTypeDescription = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebContentType", x => x.WebContentTypeId);
                });

            migrationBuilder.CreateTable(
                name: "People",
                columns: table => new
                {
                    PeopleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyID = table.Column<int>(type: "int", nullable: true),
                    MainHouseID = table.Column<int>(type: "int", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Workphone = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: true),
                    Cellphone = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Suspended = table.Column<bool>(type: "bit", nullable: true),
                    LatestSeason = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true),
                    LatestShirtSize = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    LatestRating = table.Column<int>(type: "int", nullable: true),
                    BirthDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    BC = table.Column<bool>(type: "bit", nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: true),
                    SchoolName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Grade = table.Column<int>(type: "int", nullable: true),
                    GiftedLevelsUP = table.Column<int>(type: "int", nullable: true),
                    FeeWaived = table.Column<bool>(type: "bit", nullable: true),
                    Player = table.Column<bool>(type: "bit", nullable: true),
                    Parent = table.Column<bool>(type: "bit", nullable: true),
                    Coach = table.Column<bool>(type: "bit", nullable: true),
                    AsstCoach = table.Column<bool>(type: "bit", nullable: true),
                    BoardOfficer = table.Column<bool>(type: "bit", nullable: true),
                    BoardMember = table.Column<bool>(type: "bit", nullable: true),
                    AD = table.Column<bool>(type: "bit", nullable: true),
                    Sponsor = table.Column<bool>(type: "bit", nullable: true),
                    SignUps = table.Column<bool>(type: "bit", nullable: true),
                    TryOuts = table.Column<bool>(type: "bit", nullable: true),
                    TeeShirts = table.Column<bool>(type: "bit", nullable: true),
                    Printing = table.Column<bool>(type: "bit", nullable: true),
                    Equipment = table.Column<bool>(type: "bit", nullable: true),
                    Electrician = table.Column<bool>(type: "bit", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true, defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 442, DateTimeKind.Local).AddTicks(2519)),
                    CreatedUser = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    TEMPID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_People", x => x.PeopleID);
                    table.ForeignKey(
                        name: "FK_People_Households",
                        column: x => x.MainHouseID,
                        principalTable: "Households",
                        principalColumn: "HouseID");
                });

            migrationBuilder.CreateTable(
                name: "ScheduleDivTeams",
                columns: table => new
                {
                    ScheduleDivTeamsId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DivisionNumber = table.Column<int>(type: "int", nullable: false),
                    TeamNumber = table.Column<int>(type: "int", nullable: false),
                    ScheduleNumber = table.Column<int>(type: "int", nullable: false),
                    ScheduleTeamNumber = table.Column<int>(type: "int", nullable: false),
                    HomeLocation = table.Column<int>(type: "int", nullable: false),
                    SeasonId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScheduleDivTeams", x => x.ScheduleDivTeamsId);
                    table.ForeignKey(
                        name: "FK_ScheduleDivTeams_Seasons_SeasonId",
                        column: x => x.SeasonId,
                        principalTable: "Seasons",
                        principalColumn: "SeasonID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SponsorPayment",
                columns: table => new
                {
                    PaymentID = table.Column<int>(type: "int", nullable: false),
                    CompanyID = table.Column<int>(type: "int", nullable: true),
                    SponsorProfileID = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PaymentType = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    TransactionDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    TransactionNumber = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Memo = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    ShoppingCartID = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true, defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 477, DateTimeKind.Local).AddTicks(4586)),
                    CreatedUser = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    SponsorProfileID1 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SponsorPayment", x => x.PaymentID);
                    table.ForeignKey(
                        name: "FK_SponsorPayment_SponsorProfile_SponsorProfileID1",
                        column: x => x.SponsorProfileID1,
                        principalTable: "SponsorProfile",
                        principalColumn: "SponsorProfileID");
                });

            migrationBuilder.CreateTable(
                name: "Sponsors",
                columns: table => new
                {
                    SponsorID = table.Column<int>(type: "int", nullable: false),
                    CompanyID = table.Column<int>(type: "int", nullable: true),
                    SeasonID = table.Column<int>(type: "int", nullable: true),
                    HouseID = table.Column<int>(type: "int", nullable: true),
                    ShirtName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ShirtSize = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    SpoAmount = table.Column<decimal>(type: "money", nullable: true),
                    Color1 = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Color1ID = table.Column<int>(type: "int", nullable: false),
                    Color2 = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Color2ID = table.Column<int>(type: "int", nullable: false),
                    ShoppingCartID = table.Column<int>(type: "int", nullable: true),
                    MailCheck = table.Column<bool>(type: "bit", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true, defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 481, DateTimeKind.Local).AddTicks(8689)),
                    CreatedUser = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    SponsorProfileID = table.Column<int>(type: "int", nullable: false),
                    FeeID = table.Column<decimal>(type: "money", nullable: true),
                    AdExpiration = table.Column<DateTime>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sponsors", x => x.SponsorID);
                    table.ForeignKey(
                        name: "FK_Sponsors_Seasons_SeasonID",
                        column: x => x.SeasonID,
                        principalTable: "Seasons",
                        principalColumn: "SeasonID");
                    table.ForeignKey(
                        name: "FK_Sponsors_SponsorProfile_SponsorProfileID",
                        column: x => x.SponsorProfileID,
                        principalTable: "SponsorProfile",
                        principalColumn: "SponsorProfileID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Coach",
                columns: table => new
                {
                    CoachID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyID = table.Column<int>(type: "int", nullable: true),
                    SeasonID = table.Column<int>(type: "int", nullable: true),
                    PeopleID = table.Column<int>(type: "int", nullable: false),
                    PlayerID = table.Column<int>(type: "int", nullable: true),
                    ShirtSize = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CoachPhone = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true, defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 411, DateTimeKind.Local).AddTicks(8445)),
                    CreatedUser = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PeopleID1 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coach", x => x.CoachID);
                    table.ForeignKey(
                        name: "FK_Coach_People_PeopleID1",
                        column: x => x.PeopleID1,
                        principalTable: "People",
                        principalColumn: "PeopleID");
                    table.ForeignKey(
                        name: "FK_Coach_Seasons_SeasonID",
                        column: x => x.SeasonID,
                        principalTable: "Seasons",
                        principalColumn: "SeasonID");
                });

            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    CommentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyID = table.Column<int>(type: "int", nullable: true),
                    CommentType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LinkID = table.Column<int>(type: "int", nullable: true),
                    UserID = table.Column<int>(type: "int", nullable: true),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedUSer = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.CommentID);
                    table.ForeignKey(
                        name: "FK_Comments_People_LinkID",
                        column: x => x.LinkID,
                        principalTable: "People",
                        principalColumn: "PeopleID");
                });

            migrationBuilder.CreateTable(
                name: "Divisions",
                columns: table => new
                {
                    DivisionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyID = table.Column<int>(type: "int", nullable: true),
                    SeasonID = table.Column<int>(type: "int", nullable: true),
                    Div_Desc = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DirectorID = table.Column<int>(type: "int", nullable: true),
                    CoDirectorID = table.Column<int>(type: "int", nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: true),
                    MinDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    MaxDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    Gender2 = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: true),
                    MinDate2 = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    MaxDate2 = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    DraftVenue = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    DraftDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    DraftTime = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Stats = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true, defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 425, DateTimeKind.Local).AddTicks(7191)),
                    CreatedUser = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Divisions", x => x.DivisionID);
                    table.ForeignKey(
                        name: "FK_Divisions_CoDirectors",
                        column: x => x.CoDirectorID,
                        principalTable: "People",
                        principalColumn: "PeopleID");
                    table.ForeignKey(
                        name: "FK_Divisions_Directors",
                        column: x => x.DirectorID,
                        principalTable: "People",
                        principalColumn: "PeopleID");
                    table.ForeignKey(
                        name: "FK_Divisions_Seasons",
                        column: x => x.SeasonID,
                        principalTable: "Seasons",
                        principalColumn: "SeasonID");
                });

            migrationBuilder.CreateTable(
                name: "Teams",
                columns: table => new
                {
                    TeamID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DivisionID = table.Column<int>(type: "int", nullable: false),
                    SeasonID = table.Column<int>(type: "int", nullable: true),
                    CoachID = table.Column<int>(type: "int", nullable: true),
                    AssCoachID = table.Column<int>(type: "int", nullable: true),
                    SponsorID = table.Column<int>(type: "int", nullable: true),
                    TeamName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TeamColor = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    TeamColorID = table.Column<int>(type: "int", nullable: false),
                    TeamNumber = table.Column<string>(type: "nvarchar(4)", maxLength: 4, nullable: true),
                    Round1 = table.Column<int>(type: "int", nullable: true),
                    Round2 = table.Column<int>(type: "int", nullable: true),
                    Round3 = table.Column<int>(type: "int", nullable: true),
                    Round4 = table.Column<int>(type: "int", nullable: true),
                    Round5 = table.Column<int>(type: "int", nullable: true),
                    Round6 = table.Column<int>(type: "int", nullable: true),
                    Round7 = table.Column<int>(type: "int", nullable: true),
                    Round8 = table.Column<int>(type: "int", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true, defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 485, DateTimeKind.Local).AddTicks(2254)),
                    CreatedUser = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Teams", x => x.TeamID);
                    table.ForeignKey(
                        name: "FK_Teams_AssistantCoaches",
                        column: x => x.AssCoachID,
                        principalTable: "Coach",
                        principalColumn: "CoachID");
                    table.ForeignKey(
                        name: "FK_Teams_Coaches",
                        column: x => x.CoachID,
                        principalTable: "Coach",
                        principalColumn: "CoachID");
                    table.ForeignKey(
                        name: "FK_Teams_Colors",
                        column: x => x.TeamColorID,
                        principalTable: "Colors",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_Teams_Divisions",
                        column: x => x.DivisionID,
                        principalTable: "Divisions",
                        principalColumn: "DivisionID");
                    table.ForeignKey(
                        name: "FK_Teams_Seasons",
                        column: x => x.SeasonID,
                        principalTable: "Seasons",
                        principalColumn: "SeasonID");
                    table.ForeignKey(
                        name: "FK_Teams_Sponsors",
                        column: x => x.SponsorID,
                        principalTable: "Sponsors",
                        principalColumn: "SponsorID");
                });

            migrationBuilder.CreateTable(
                name: "Player",
                columns: table => new
                {
                    PlayerID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyID = table.Column<int>(type: "int", nullable: true),
                    SeasonID = table.Column<int>(type: "int", nullable: true),
                    DivisionID = table.Column<int>(type: "int", nullable: true),
                    TeamID = table.Column<int>(type: "int", nullable: true),
                    PeopleID = table.Column<int>(type: "int", nullable: false),
                    DraftID = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: true),
                    DraftNotes = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Rating = table.Column<int>(type: "int", nullable: true),
                    Coach = table.Column<int>(type: "int", nullable: true),
                    CoachID = table.Column<int>(type: "int", nullable: true),
                    Sponsor = table.Column<int>(type: "int", nullable: true),
                    SponsorID = table.Column<int>(type: "int", nullable: true),
                    AD = table.Column<bool>(type: "bit", nullable: true),
                    Scholarship = table.Column<bool>(type: "bit", nullable: true),
                    FamilyDisc = table.Column<bool>(type: "bit", nullable: true),
                    Rollover = table.Column<bool>(type: "bit", nullable: true),
                    OutOfTown = table.Column<bool>(type: "bit", nullable: true),
                    RefundBatchID = table.Column<int>(type: "int", nullable: true),
                    PaidDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    PaidAmount = table.Column<decimal>(type: "money", nullable: true),
                    BalanceOwed = table.Column<decimal>(type: "money", nullable: true),
                    PayType = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: true),
                    NoteDesc = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CheckMemo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true, defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 450, DateTimeKind.Local).AddTicks(9257)),
                    CreatedUser = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    PlaysDown = table.Column<bool>(type: "bit", nullable: true),
                    PlaysUp = table.Column<bool>(type: "bit", nullable: true),
                    ShoppingCartID = table.Column<int>(type: "int", nullable: true),
                    PeopleID1 = table.Column<int>(type: "int", nullable: true),
                    DivisionID1 = table.Column<int>(type: "int", nullable: true),
                    TeamID1 = table.Column<int>(type: "int", nullable: true),
                    SeasonID1 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Player", x => x.PlayerID);
                    table.ForeignKey(
                        name: "FK_Player_Divisions_DivisionID1",
                        column: x => x.DivisionID1,
                        principalTable: "Divisions",
                        principalColumn: "DivisionID");
                    table.ForeignKey(
                        name: "FK_Player_People_PeopleID1",
                        column: x => x.PeopleID1,
                        principalTable: "People",
                        principalColumn: "PeopleID");
                    table.ForeignKey(
                        name: "FK_Player_Seasons_SeasonID1",
                        column: x => x.SeasonID1,
                        principalTable: "Seasons",
                        principalColumn: "SeasonID");
                    table.ForeignKey(
                        name: "FK_Player_Teams_TeamID1",
                        column: x => x.TeamID1,
                        principalTable: "Teams",
                        principalColumn: "TeamID");
                });

            migrationBuilder.CreateTable(
                name: "ScheduleGames",
                columns: table => new
                {
                    ScheduleGamesID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ScheduleNumber = table.Column<int>(type: "int", nullable: false),
                    GameNumber = table.Column<int>(type: "int", nullable: false),
                    LocationNumber = table.Column<int>(type: "int", nullable: true),
                    GameDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    GameTime = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    VisitingTeamNumber = table.Column<int>(type: "int", nullable: true),
                    HomeTeamNumber = table.Column<int>(type: "int", nullable: true),
                    VisitingTeamScore = table.Column<int>(type: "int", nullable: true),
                    HomeTeamScore = table.Column<int>(type: "int", nullable: true),
                    VisitingForfeited = table.Column<bool>(type: "bit", nullable: true),
                    HomeForfeited = table.Column<bool>(type: "bit", nullable: true),
                    SeasonID = table.Column<int>(type: "int", nullable: true),
                    DivisionID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScheduleGames", x => x.ScheduleGamesID);
                    table.ForeignKey(
                        name: "FK_ScheduleGames_Division",
                        column: x => x.DivisionID,
                        principalTable: "Divisions",
                        principalColumn: "DivisionID");
                    table.ForeignKey(
                        name: "FK_ScheduleGames_HomeTeam",
                        column: x => x.HomeTeamNumber,
                        principalTable: "Teams",
                        principalColumn: "TeamID");
                    table.ForeignKey(
                        name: "FK_ScheduleGames_Location",
                        column: x => x.LocationNumber,
                        principalTable: "ScheduleLocations",
                        principalColumn: "LocationNumber");
                    table.ForeignKey(
                        name: "FK_ScheduleGames_Season",
                        column: x => x.SeasonID,
                        principalTable: "Seasons",
                        principalColumn: "SeasonID");
                    table.ForeignKey(
                        name: "FK_ScheduleGames_VisitingTeam",
                        column: x => x.VisitingTeamNumber,
                        principalTable: "Teams",
                        principalColumn: "TeamID");
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserID", "CompanyID", "CreatedUser", "HouseID", "Name", "PassWord", "PeopleID", "PWord", "UserName", "UserType", "ValidationCode" },
                values: new object[] { 1, null, null, 0, null, null, null, null, "TestUser", 0, null });

            migrationBuilder.CreateIndex(
                name: "IX_Coach_PeopleID1",
                table: "Coach",
                column: "PeopleID1");

            migrationBuilder.CreateIndex(
                name: "IX_Coach_SeasonID",
                table: "Coach",
                column: "SeasonID");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_LinkID",
                table: "Comments",
                column: "LinkID");

            migrationBuilder.CreateIndex(
                name: "IX_Divisions_CoDirectorID",
                table: "Divisions",
                column: "CoDirectorID");

            migrationBuilder.CreateIndex(
                name: "IX_Divisions_DirectorID",
                table: "Divisions",
                column: "DirectorID");

            migrationBuilder.CreateIndex(
                name: "IX_Divisions_SeasonID",
                table: "Divisions",
                column: "SeasonID");

            migrationBuilder.CreateIndex(
                name: "idx_DCh_2775_2774_Household",
                table: "Households",
                columns: new[] { "Phone", "Email", "HouseID" });

            migrationBuilder.CreateIndex(
                name: "idx_DCh_12521_12520_People",
                table: "People",
                column: "Coach");

            migrationBuilder.CreateIndex(
                name: "idx_DCh_14287_14286_People",
                table: "People",
                columns: new[] { "FirstName", "LastName" });

            migrationBuilder.CreateIndex(
                name: "idx_DCh_75612_75611_People",
                table: "People",
                column: "MainHouseID");

            migrationBuilder.CreateIndex(
                name: "idx_DCh_12817_12816_Players",
                table: "Player",
                column: "TeamID");

            migrationBuilder.CreateIndex(
                name: "idx_DCh_2451_2450_Players",
                table: "Player",
                column: "PlayerID");

            migrationBuilder.CreateIndex(
                name: "idx_DCh_25_24_Players",
                table: "Player",
                columns: new[] { "PlayerID", "DivisionID", "Coach", "Sponsor", "SeasonID" });

            migrationBuilder.CreateIndex(
                name: "idx_DCh_488836_488835_Players",
                table: "Player",
                column: "DivisionID");

            migrationBuilder.CreateIndex(
                name: "idx_DCh_75619_75618_Players",
                table: "Player",
                column: "PeopleID");

            migrationBuilder.CreateIndex(
                name: "idx_DCh_8781_8780_Players",
                table: "Player",
                columns: new[] { "SeasonID", "PayType", "Sponsor" });

            migrationBuilder.CreateIndex(
                name: "idx_DCh_98394_98393_Players",
                table: "Player",
                columns: new[] { "Coach", "Sponsor", "SeasonID" });

            migrationBuilder.CreateIndex(
                name: "IX_Player_DivisionID1",
                table: "Player",
                column: "DivisionID1");

            migrationBuilder.CreateIndex(
                name: "IX_Player_PeopleID1",
                table: "Player",
                column: "PeopleID1");

            migrationBuilder.CreateIndex(
                name: "IX_Player_SeasonID1",
                table: "Player",
                column: "SeasonID1");

            migrationBuilder.CreateIndex(
                name: "IX_Player_TeamID1",
                table: "Player",
                column: "TeamID1");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleDivTeams",
                table: "ScheduleDivTeams",
                columns: new[] { "ScheduleNumber", "TeamNumber" });

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleDivTeams_SeasonId",
                table: "ScheduleDivTeams",
                column: "SeasonId");

            migrationBuilder.CreateIndex(
                name: "idx_DCh_1924_1923_ScheduleGames",
                table: "ScheduleGames",
                columns: new[] { "ScheduleNumber", "GameNumber", "LocationNumber", "GameDate", "GameTime", "VisitingTeamNumber", "HomeTeamNumber", "VisitingTeamScore", "HomeTeamScore", "VisitingForfeited", "HomeForfeited", "SeasonID", "DivisionID" });

            migrationBuilder.CreateIndex(
                name: "idx_DCh_20078_20077_ScheduleGames",
                table: "ScheduleGames",
                columns: new[] { "GameNumber", "LocationNumber", "GameDate", "GameTime", "VisitingTeamNumber", "HomeTeamNumber", "VisitingTeamScore", "HomeTeamScore", "ScheduleNumber", "SeasonID" });

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleGames",
                table: "ScheduleGames",
                columns: new[] { "SeasonID", "DivisionID", "GameNumber" });

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleGames_DivisionID",
                table: "ScheduleGames",
                column: "DivisionID");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleGames_HomeTeamNumber",
                table: "ScheduleGames",
                column: "HomeTeamNumber");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleGames_LocationNumber",
                table: "ScheduleGames",
                column: "LocationNumber");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleGames_VisitingTeamNumber",
                table: "ScheduleGames",
                column: "VisitingTeamNumber");

            migrationBuilder.CreateIndex(
                name: "IX_Seasons_CompanyId",
                table: "Seasons",
                column: "CompanyID");

            migrationBuilder.CreateIndex(
                name: "IX_Seasons_CurrentSeason",
                table: "Seasons",
                column: "CurrentSeason");

            migrationBuilder.CreateIndex(
                name: "IX_Seasons_DateRange",
                table: "Seasons",
                columns: new[] { "FromDate", "ToDate" });

            migrationBuilder.CreateIndex(
                name: "IX_Seasons_SignUpDates",
                table: "Seasons",
                columns: new[] { "SignUpsDate", "SignUpsEND" });

            migrationBuilder.CreateIndex(
                name: "IX_SponsorPayment_SponsorProfileID1",
                table: "SponsorPayment",
                column: "SponsorProfileID1");

            migrationBuilder.CreateIndex(
                name: "IX_Sponsors_SeasonID",
                table: "Sponsors",
                column: "SeasonID");

            migrationBuilder.CreateIndex(
                name: "IX_Sponsors_SponsorProfileID",
                table: "Sponsors",
                column: "SponsorProfileID");

            migrationBuilder.CreateIndex(
                name: "idx_DCh_12814_12813_Teams",
                table: "Teams",
                column: "DivisionID");

            migrationBuilder.CreateIndex(
                name: "idx_DCh_376_375_Teams",
                table: "Teams",
                columns: new[] { "DivisionID", "TeamName", "TeamColorID", "TeamNumber", "SeasonID" });

            migrationBuilder.CreateIndex(
                name: "idx_DCh_615_614_Teams",
                table: "Teams",
                column: "TeamID");

            migrationBuilder.CreateIndex(
                name: "IX_Teams_AssCoachID",
                table: "Teams",
                column: "AssCoachID");

            migrationBuilder.CreateIndex(
                name: "IX_Teams_CoachID",
                table: "Teams",
                column: "CoachID");

            migrationBuilder.CreateIndex(
                name: "IX_Teams_SeasonID",
                table: "Teams",
                column: "SeasonID");

            migrationBuilder.CreateIndex(
                name: "IX_Teams_SponsorID",
                table: "Teams",
                column: "SponsorID");

            migrationBuilder.CreateIndex(
                name: "IX_Teams_TeamColorID",
                table: "Teams",
                column: "TeamColorID");

            migrationBuilder.CreateIndex(
                name: "idx_DCh_369_368_Users",
                table: "Users",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "idx_DCh_4811_4810_Users",
                table: "Users",
                column: "UserName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.DropTable(
                name: "Company");

            migrationBuilder.DropTable(
                name: "Directors");

            migrationBuilder.DropTable(
                name: "Player");

            migrationBuilder.DropTable(
                name: "Rolls");

            migrationBuilder.DropTable(
                name: "ScheduleDivTeams");

            migrationBuilder.DropTable(
                name: "ScheduleGames");

            migrationBuilder.DropTable(
                name: "SchedulePlayoffs");

            migrationBuilder.DropTable(
                name: "SponsorFee");

            migrationBuilder.DropTable(
                name: "SponsorPayment");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "VwCoaches");

            migrationBuilder.DropTable(
                name: "VwDirectors");

            migrationBuilder.DropTable(
                name: "WebContent");

            migrationBuilder.DropTable(
                name: "WebContentType");

            migrationBuilder.DropTable(
                name: "Teams");

            migrationBuilder.DropTable(
                name: "ScheduleLocations");

            migrationBuilder.DropTable(
                name: "Coach");

            migrationBuilder.DropTable(
                name: "Colors");

            migrationBuilder.DropTable(
                name: "Divisions");

            migrationBuilder.DropTable(
                name: "Sponsors");

            migrationBuilder.DropTable(
                name: "People");

            migrationBuilder.DropTable(
                name: "Seasons");

            migrationBuilder.DropTable(
                name: "SponsorProfile");

            migrationBuilder.DropTable(
                name: "Households");
        }
    }
}
