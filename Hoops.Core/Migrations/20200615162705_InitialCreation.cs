using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Hoops.Core.Migrations
{
    public partial class InitialCreation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Color",
                columns: table => new
                {
                    ColorID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyID = table.Column<int>(nullable: true),
                    ColorName = table.Column<string>(unicode: false, maxLength: 20, nullable: true),
                    Discontinued = table.Column<bool>(nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedUser = table.Column<string>(unicode: false, fixedLength: true, maxLength: 10, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Color", x => x.ColorID);
                });

            migrationBuilder.CreateTable(
                name: "Comment",
                columns: table => new
                {
                    CommentID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyID = table.Column<int>(nullable: true),
                    CommentType = table.Column<string>(maxLength: 50, nullable: true),
                    LinkID = table.Column<int>(nullable: true),
                    UserID = table.Column<int>(nullable: true),
                    Comment = table.Column<string>(type: "ntext", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    CreatedUSer = table.Column<string>(maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comment", x => x.CommentID);
                });

            migrationBuilder.CreateTable(
                name: "Company",
                columns: table => new
                {
                    CompanyID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyName = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    TimeZone = table.Column<int>(nullable: false),
                    ImageName = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    EmailSender = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedUser = table.Column<string>(unicode: false, maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Company", x => x.CompanyID);
                });

            migrationBuilder.CreateTable(
                name: "Content",
                columns: table => new
                {
                    cntID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyID = table.Column<int>(nullable: true),
                    cntScreen = table.Column<string>(maxLength: 15, nullable: true),
                    cntSeq = table.Column<int>(nullable: true),
                    LineText = table.Column<string>(maxLength: 100, nullable: true),
                    Bold = table.Column<bool>(nullable: true),
                    UnderLn = table.Column<bool>(nullable: true),
                    Italic = table.Column<bool>(nullable: true),
                    FontSize = table.Column<string>(maxLength: 10, nullable: true),
                    FontColor = table.Column<string>(maxLength: 10, nullable: true),
                    Link = table.Column<string>(maxLength: 400, nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedUser = table.Column<string>(maxLength: 50, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Content", x => x.cntID);
                });

            migrationBuilder.CreateTable(
                name: "Conversion Errors",
                columns: table => new
                {
                    ObjectType = table.Column<string>(name: "Object Type", maxLength: 255, nullable: true),
                    ObjectName = table.Column<string>(name: "Object Name", maxLength: 255, nullable: true),
                    ErrorDescription = table.Column<string>(name: "Error Description", nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "Director",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyID = table.Column<int>(nullable: true),
                    PersonId = table.Column<int>(nullable: true),
                    Seq = table.Column<int>(nullable: true),
                    Title = table.Column<string>(maxLength: 50, nullable: true),
                    Photo = table.Column<byte[]>(type: "image", nullable: true),
                    PhonePref = table.Column<string>(maxLength: 10, nullable: true),
                    EmailPref = table.Column<int>(nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true, defaultValue: new DateTime(2020, 6, 15, 12, 27, 4, 709, DateTimeKind.Local).AddTicks(5189)),
                    CreatedUser = table.Column<string>(maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Director", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Division",
                columns: table => new
                {
                    DivisionID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyID = table.Column<int>(nullable: true),
                    SeasonID = table.Column<int>(nullable: true),
                    DivisionDescription = table.Column<string>(maxLength: 50, nullable: true),
                    DirectorID = table.Column<int>(nullable: true),
                    CoDirectorID = table.Column<int>(nullable: true),
                    Gender = table.Column<string>(maxLength: 1, nullable: true),
                    MinDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    MaxDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    Gender2 = table.Column<string>(maxLength: 1, nullable: true),
                    MinDate2 = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    MaxDate2 = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    DraftVenue = table.Column<string>(maxLength: 50, nullable: true),
                    DraftDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    DraftTime = table.Column<string>(maxLength: 10, nullable: true),
                    Stats = table.Column<bool>(nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    CreatedUser = table.Column<string>(maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Division", x => x.DivisionID);
                });

            migrationBuilder.CreateTable(
                name: "dtproperties",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false),
                    objectid = table.Column<int>(nullable: true),
                    property = table.Column<string>(unicode: false, maxLength: 64, nullable: false),
                    value = table.Column<string>(unicode: false, maxLength: 255, nullable: true),
                    uvalue = table.Column<string>(maxLength: 255, nullable: true),
                    lvalue = table.Column<byte[]>(type: "image", nullable: true),
                    version = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    ScheduleGamesId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ScheduleNumber = table.Column<int>(nullable: false),
                    GameNumber = table.Column<int>(nullable: false),
                    LocationNumber = table.Column<int>(nullable: true),
                    GameDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    GameTime = table.Column<string>(maxLength: 20, nullable: true),
                    VisitingTeamNumber = table.Column<int>(nullable: true),
                    HomeTeamNumber = table.Column<int>(nullable: true),
                    VisitingTeamScore = table.Column<int>(nullable: true),
                    HomeTeamScore = table.Column<int>(nullable: true),
                    VisitingForfeited = table.Column<bool>(nullable: true),
                    HomeForfeited = table.Column<bool>(nullable: true),
                    SeasonId = table.Column<int>(nullable: true),
                    DivisionId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.ScheduleGamesId);
                });

            migrationBuilder.CreateTable(
                name: "Household",
                columns: table => new
                {
                    HouseID = table.Column<int>(nullable: false),
                    CompanyID = table.Column<int>(nullable: true),
                    Name = table.Column<string>(maxLength: 50, nullable: true),
                    Phone = table.Column<string>(maxLength: 25, nullable: true),
                    Address1 = table.Column<string>(maxLength: 50, nullable: true),
                    Address2 = table.Column<string>(maxLength: 50, nullable: true),
                    City = table.Column<string>(maxLength: 50, nullable: true),
                    State = table.Column<string>(maxLength: 2, nullable: true),
                    Zip = table.Column<string>(maxLength: 20, nullable: true),
                    Email = table.Column<string>(maxLength: 50, nullable: true),
                    EmailList = table.Column<bool>(nullable: true),
                    SportsCard = table.Column<string>(maxLength: 15, nullable: true),
                    Guardian = table.Column<int>(nullable: true),
                    FeeWaived = table.Column<bool>(nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    CreatedUser = table.Column<string>(maxLength: 20, nullable: true),
                    TEMID = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Household", x => x.HouseID);
                });

            migrationBuilder.CreateTable(
                name: "Location",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    CreatedUser = table.Column<string>(nullable: true),
                    LocationNumber = table.Column<int>(nullable: false),
                    LocationName = table.Column<string>(maxLength: 50, nullable: false),
                    Notes = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Location", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PayErrorLog",
                columns: table => new
                {
                    SeasonID = table.Column<int>(nullable: true),
                    CompanyID = table.Column<int>(nullable: true),
                    HouseID = table.Column<int>(nullable: true),
                    ErrorMSG = table.Column<string>(maxLength: 300, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "Person",
                columns: table => new
                {
                    PersonID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyID = table.Column<int>(nullable: true),
                    MainHouseID = table.Column<int>(nullable: true),
                    FirstName = table.Column<string>(maxLength: 50, nullable: true),
                    LastName = table.Column<string>(maxLength: 50, nullable: true),
                    Workphone = table.Column<string>(maxLength: 25, nullable: true),
                    Cellphone = table.Column<string>(maxLength: 15, nullable: true),
                    Email = table.Column<string>(maxLength: 50, nullable: true),
                    Suspended = table.Column<bool>(nullable: true),
                    LatestSeason = table.Column<string>(maxLength: 15, nullable: true),
                    LatestShirtSize = table.Column<string>(maxLength: 20, nullable: true),
                    LatestRating = table.Column<int>(nullable: true),
                    BirthDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    BC = table.Column<bool>(nullable: true),
                    Gender = table.Column<string>(maxLength: 1, nullable: true),
                    SchoolName = table.Column<string>(maxLength: 50, nullable: true),
                    Grade = table.Column<int>(nullable: true),
                    GiftedLevelsUP = table.Column<int>(nullable: true),
                    FeeWaived = table.Column<bool>(nullable: true),
                    Player = table.Column<bool>(nullable: true),
                    Parent = table.Column<bool>(nullable: true),
                    Coach = table.Column<bool>(nullable: true),
                    AsstCoach = table.Column<bool>(nullable: true),
                    BoardOfficer = table.Column<bool>(nullable: true),
                    BoardMember = table.Column<bool>(nullable: true),
                    AD = table.Column<bool>(nullable: true),
                    Sponsor = table.Column<bool>(nullable: true),
                    SignUps = table.Column<bool>(nullable: true),
                    TryOuts = table.Column<bool>(nullable: true),
                    TeeShirts = table.Column<bool>(nullable: true),
                    Printing = table.Column<bool>(nullable: true),
                    Equipment = table.Column<bool>(nullable: true),
                    Electrician = table.Column<bool>(nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    CreatedUser = table.Column<string>(maxLength: 20, nullable: true),
                    TEMPID = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Person", x => x.PersonID);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    RoleID = table.Column<decimal>(type: "decimal(18, 0)", nullable: false),
                    UserID = table.Column<decimal>(type: "decimal(18, 0)", nullable: false),
                    ScreenName = table.Column<string>(unicode: false, fixedLength: true, maxLength: 10, nullable: true),
                    AccessType = table.Column<string>(unicode: false, fixedLength: true, maxLength: 1, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedUser = table.Column<string>(unicode: false, fixedLength: true, maxLength: 10, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.RoleID);
                });

            migrationBuilder.CreateTable(
                name: "SchDivisions",
                columns: table => new
                {
                    ScheduleNumber = table.Column<int>(nullable: false),
                    DivisionNumber = table.Column<int>(nullable: false),
                    DivisionName = table.Column<string>(maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "SchedueDivTeam",
                columns: table => new
                {
                    ScheduleDivTeamId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DivisionNumber = table.Column<int>(nullable: false),
                    TeamNumber = table.Column<int>(nullable: false),
                    ScheduleNumber = table.Column<int>(nullable: false),
                    ScheduleTeamNumber = table.Column<int>(nullable: false),
                    HomeLocation = table.Column<int>(nullable: true),
                    SeasonId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SchedueDivTeam", x => x.ScheduleDivTeamId);
                });

            migrationBuilder.CreateTable(
                name: "ScheduleGamesStats",
                columns: table => new
                {
                    RowID = table.Column<int>(nullable: false),
                    TeamNumber = table.Column<int>(nullable: false),
                    ScheduleNumber = table.Column<int>(nullable: false),
                    GameNumber = table.Column<int>(nullable: false),
                    SeasonID = table.Column<int>(nullable: false),
                    PersonId = table.Column<int>(nullable: false),
                    Points = table.Column<int>(nullable: true),
                    DNP = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "ScheduleLocations",
                columns: table => new
                {
                    LocationNumber = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    CreatedUser = table.Column<string>(nullable: true),
                    LocationName = table.Column<string>(maxLength: 50, nullable: true),
                    Notes = table.Column<string>(maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScheduleLocations", x => x.LocationNumber);
                });

            migrationBuilder.CreateTable(
                name: "SchedulePlayoffs",
                columns: table => new
                {
                    SchedulePlayoffId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ScheduleNumber = table.Column<int>(nullable: true),
                    GameNumber = table.Column<int>(nullable: true),
                    LocationNumber = table.Column<int>(nullable: true),
                    GameDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    GameTime = table.Column<string>(maxLength: 20, nullable: true),
                    VisitingTeam = table.Column<string>(maxLength: 10, nullable: true),
                    HomeTeam = table.Column<string>(maxLength: 10, nullable: true),
                    Descr = table.Column<string>(maxLength: 50, nullable: true),
                    VisitingTeamScore = table.Column<int>(nullable: true),
                    HomeTeamScore = table.Column<int>(nullable: true),
                    DivisionId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SchedulePlayoffs", x => x.SchedulePlayoffId);
                });

            migrationBuilder.CreateTable(
                name: "SchExceptions",
                columns: table => new
                {
                    ScheduleNumber = table.Column<int>(nullable: false),
                    ExceptionNumber = table.Column<int>(nullable: false),
                    ExceptionDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    ExceptionTime = table.Column<DateTime>(type: "datetime", nullable: false),
                    ExceptionTimeAllDay = table.Column<bool>(nullable: false),
                    LocationNumber = table.Column<int>(nullable: false),
                    AddOrRemove = table.Column<string>(maxLength: 1, nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "SchGames",
                columns: table => new
                {
                    SchGames = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ScheduleNumber = table.Column<int>(nullable: false),
                    GameNumber = table.Column<int>(nullable: false),
                    LocationNumber = table.Column<int>(nullable: false),
                    GameDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    GameTime = table.Column<DateTime>(type: "datetime", nullable: false),
                    VisitingTeamNumber = table.Column<int>(nullable: false),
                    HomeTeamNumber = table.Column<int>(nullable: false),
                    VisitingTeamScore = table.Column<short>(nullable: false),
                    HomeTeamScore = table.Column<short>(nullable: false),
                    Overtime = table.Column<bool>(nullable: false),
                    VisitingTeamForfeited = table.Column<bool>(nullable: false),
                    HomeTeamForfeited = table.Column<bool>(nullable: false),
                    Rainout = table.Column<bool>(nullable: false),
                    Cancelled = table.Column<bool>(nullable: false),
                    GameComment = table.Column<string>(nullable: false),
                    ScheduleComment = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SchGames", x => x.SchGames);
                });

            migrationBuilder.CreateTable(
                name: "SchGameTimes",
                columns: table => new
                {
                    ScheduleNumber = table.Column<int>(nullable: false),
                    TeamNumber = table.Column<int>(nullable: false),
                    LocationNumber = table.Column<int>(nullable: false),
                    WeekDay = table.Column<byte>(nullable: false),
                    GameStartTime = table.Column<DateTime>(type: "datetime", nullable: false),
                    MilitaryTime = table.Column<short>(nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "SchLocations",
                columns: table => new
                {
                    ScheduleNumber = table.Column<int>(nullable: false),
                    LocationNumber = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "SchOptions",
                columns: table => new
                {
                    ScheduleNumber = table.Column<int>(nullable: true),
                    ScheduleOption = table.Column<byte>(nullable: false),
                    ComputeOption = table.Column<byte>(nullable: false),
                    DisplaceOption = table.Column<byte>(nullable: false),
                    TimesInsideDivision = table.Column<short>(nullable: false),
                    TimesOutsideDivision = table.Column<short>(nullable: false),
                    DivisionOption = table.Column<byte>(nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    GamesPerTeam = table.Column<short>(nullable: false),
                    MaxGamesDay = table.Column<short>(nullable: false),
                    MaxGamesWeek = table.Column<short>(nullable: false),
                    MinDaysBetweenGames = table.Column<short>(nullable: false),
                    ComputeMethod = table.Column<byte>(nullable: false),
                    CheckForGameConflicts = table.Column<bool>(nullable: false),
                    CheckAllSchedules = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "SchTeams",
                columns: table => new
                {
                    DivisionNumber = table.Column<int>(nullable: false),
                    TeamNumber = table.Column<int>(nullable: false),
                    ScheduleNumber = table.Column<int>(nullable: false),
                    ScheduleTeamNumber = table.Column<short>(nullable: false),
                    HomeLocation = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "Season",
                columns: table => new
                {
                    SeasonID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyID = table.Column<int>(nullable: true),
                    Sea_Desc = table.Column<string>(maxLength: 50, nullable: true),
                    FromDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    ToDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    ParticipationFee = table.Column<decimal>(type: "money", nullable: true),
                    SponsorFee = table.Column<decimal>(type: "money", nullable: true),
                    ConvenienceFee = table.Column<decimal>(type: "money", nullable: true),
                    CurrentSeason = table.Column<bool>(nullable: true),
                    CurrentSchedule = table.Column<bool>(nullable: true),
                    CurrentSignUps = table.Column<bool>(nullable: true),
                    SignUpsDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    SignUpsEND = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    TestSeason = table.Column<bool>(nullable: true),
                    NewSchoolYear = table.Column<bool>(nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    CreatedUser = table.Column<string>(maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Season", x => x.SeasonID);
                });

            migrationBuilder.CreateTable(
                name: "ShoppingCart",
                columns: table => new
                {
                    CartID = table.Column<int>(nullable: false),
                    CompanyID = table.Column<int>(nullable: true),
                    SeasonID = table.Column<int>(nullable: true),
                    HouseID = table.Column<int>(nullable: true),
                    Payer_ID = table.Column<string>(maxLength: 50, nullable: true),
                    Payment_Gross = table.Column<decimal>(type: "money", nullable: true),
                    Payment_Fee = table.Column<decimal>(type: "money", nullable: true),
                    Payer_Email = table.Column<string>(maxLength: 50, nullable: true),
                    Txn_ID = table.Column<string>(maxLength: 50, nullable: true),
                    Payment_status = table.Column<string>(maxLength: 50, nullable: true),
                    ErrorMessage = table.Column<string>(maxLength: 200, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedUser = table.Column<string>(maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "Special User Query",
                columns: table => new
                {
                    ScheduleName = table.Column<string>(maxLength: 50, nullable: true),
                    GameDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    HomeTeamScheduleTeamNumber = table.Column<short>(name: "Home Team.ScheduleTeamNumber", nullable: true),
                    VisitingTeamScheduleTeamNumber = table.Column<short>(name: "Visiting Team.ScheduleTeamNumber", nullable: true),
                    HomeTeamName = table.Column<string>(name: "Home.TeamName", maxLength: 50, nullable: true),
                    VisitingTeamName = table.Column<string>(name: "Visiting.TeamName", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "Sponsor",
                columns: table => new
                {
                    SponsorID = table.Column<int>(nullable: false),
                    CompanyID = table.Column<int>(nullable: true),
                    SeasonID = table.Column<int>(nullable: true),
                    HouseID = table.Column<int>(nullable: true),
                    ContactNameDELETE = table.Column<string>(maxLength: 50, nullable: true),
                    SpoNameDELETE = table.Column<string>(maxLength: 150, nullable: true),
                    ShirtName = table.Column<string>(maxLength: 50, nullable: true),
                    EMAILDELETE = table.Column<string>(maxLength: 50, nullable: true),
                    URLDELETE = table.Column<string>(maxLength: 50, nullable: true),
                    AddressDELETE = table.Column<string>(maxLength: 100, nullable: true),
                    CityDELETE = table.Column<string>(maxLength: 50, nullable: true),
                    StateDELETE = table.Column<string>(maxLength: 2, nullable: true),
                    ZipDELETE = table.Column<string>(maxLength: 15, nullable: true),
                    PhoneDELETE = table.Column<string>(maxLength: 25, nullable: true),
                    ShirtSize = table.Column<string>(maxLength: 50, nullable: true),
                    SpoAmount = table.Column<decimal>(type: "money", nullable: true),
                    TypeOfBussDELETE = table.Column<string>(maxLength: 50, nullable: true),
                    Color1 = table.Column<string>(maxLength: 50, nullable: true),
                    Color1ID = table.Column<int>(nullable: false),
                    Color2 = table.Column<string>(maxLength: 50, nullable: true),
                    Color2ID = table.Column<int>(nullable: false),
                    ShoppingCartID = table.Column<int>(nullable: true),
                    MailCheck = table.Column<bool>(nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    CreatedUser = table.Column<string>(maxLength: 50, nullable: true),
                    SponsorProfileID = table.Column<int>(nullable: true),
                    FeeID = table.Column<decimal>(type: "money", nullable: true),
                    ShowAd = table.Column<bool>(nullable: true),
                    AdExpiration = table.Column<DateTime>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sponsor", x => x.SponsorID);
                });

            migrationBuilder.CreateTable(
                name: "SponsorFee",
                columns: table => new
                {
                    SponsorFeeId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FeeName = table.Column<string>(nullable: true),
                    Amount = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: false, defaultValue: new DateTime(2020, 6, 15, 12, 27, 4, 772, DateTimeKind.Local).AddTicks(8196)),
                    CreatedUser = table.Column<string>(unicode: false, maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SponsorFee", x => x.SponsorFeeId);
                });

            migrationBuilder.CreateTable(
                name: "SponsorPayment",
                columns: table => new
                {
                    PaymentID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyID = table.Column<int>(nullable: true),
                    SponsorProfileID = table.Column<int>(nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    PaymentType = table.Column<string>(unicode: false, maxLength: 10, nullable: false),
                    TransactionDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    TransactionNumber = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    Memo = table.Column<string>(unicode: false, maxLength: 100, nullable: true),
                    ShoppingCartID = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true, defaultValue: new DateTime(2020, 6, 15, 12, 27, 4, 775, DateTimeKind.Local).AddTicks(2947)),
                    CreatedUser = table.Column<string>(unicode: false, maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SponsorPayment", x => x.PaymentID);
                });

            migrationBuilder.CreateTable(
                name: "SponsorProfile",
                columns: table => new
                {
                    SponsorProfileID = table.Column<int>(nullable: false),
                    CompanyID = table.Column<int>(nullable: false),
                    HouseID = table.Column<int>(nullable: true),
                    ContactName = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    SpoName = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    EMAIL = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    URL = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    Address = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    City = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    State = table.Column<string>(unicode: false, fixedLength: true, maxLength: 2, nullable: true),
                    Zip = table.Column<string>(unicode: false, maxLength: 15, nullable: true),
                    Phone = table.Column<string>(unicode: false, maxLength: 25, nullable: true),
                    TypeOfBuss = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    ShowAd = table.Column<bool>(nullable: true),
                    AdExpiration = table.Column<DateTime>(type: "date", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    CreatedUser = table.Column<string>(unicode: false, maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SponsorProfile", x => x.SponsorProfileID);
                });

            migrationBuilder.CreateTable(
                name: "TeamRosters",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false),
                    TeamID = table.Column<int>(nullable: true),
                    LastName = table.Column<string>(maxLength: 50, nullable: true),
                    FirstName = table.Column<string>(maxLength: 50, nullable: true),
                    Birthdate = table.Column<DateTime>(type: "datetime", nullable: true),
                    Grade = table.Column<string>(unicode: false, fixedLength: true, maxLength: 10, nullable: true),
                    UpdateDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    UpdateUser = table.Column<string>(maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    UserID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyID = table.Column<int>(nullable: true),
                    UserName = table.Column<string>(maxLength: 50, nullable: true),
                    Name = table.Column<string>(maxLength: 50, nullable: true),
                    PWord = table.Column<string>(maxLength: 50, nullable: true),
                    PassWord = table.Column<string>(maxLength: 300, nullable: true),
                    UserType = table.Column<int>(nullable: true),
                    ValidationCode = table.Column<int>(nullable: true),
                    PersonId = table.Column<int>(nullable: true),
                    HouseID = table.Column<int>(nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    CreatedUser = table.Column<string>(maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.UserID);
                });

            migrationBuilder.CreateTable(
                name: "Version",
                columns: table => new
                {
                    Version = table.Column<float>(nullable: false),
                    CreateDate = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "WebContentType",
                columns: table => new
                {
                    WebContentTypeId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedDate = table.Column<DateTime>(nullable: true, defaultValue: new DateTime(2020, 6, 15, 12, 27, 4, 871, DateTimeKind.Local).AddTicks(2054)),
                    CreatedUser = table.Column<string>(nullable: true),
                    WebContentTypeDescription = table.Column<string>(maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebContentType", x => x.WebContentTypeId);
                });

            migrationBuilder.CreateTable(
                name: "Team",
                columns: table => new
                {
                    TeamID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyID = table.Column<int>(nullable: true),
                    SeasonID = table.Column<int>(nullable: true),
                    DivisionID = table.Column<int>(nullable: true),
                    CoachID = table.Column<int>(nullable: true),
                    AssCoachID = table.Column<int>(nullable: true),
                    SponsorID = table.Column<int>(nullable: true),
                    TeamName = table.Column<string>(maxLength: 50, nullable: true),
                    TeamColor = table.Column<string>(maxLength: 50, nullable: true),
                    TeamColorID = table.Column<int>(nullable: false),
                    TeamNumber = table.Column<string>(maxLength: 2, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    CreatedUser = table.Column<string>(maxLength: 50, nullable: true),
                    ColorId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Team", x => x.TeamID);
                    table.ForeignKey(
                        name: "FK_Team_Color_ColorId",
                        column: x => x.ColorId,
                        principalTable: "Color",
                        principalColumn: "ColorID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Coach",
                columns: table => new
                {
                    CoachID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    CreatedUser = table.Column<string>(maxLength: 50, nullable: true),
                    CompanyID = table.Column<int>(nullable: true),
                    SeasonID = table.Column<int>(nullable: true),
                    PersonID = table.Column<int>(nullable: true),
                    PlayerID = table.Column<int>(nullable: true),
                    ShirtSize = table.Column<string>(maxLength: 50, nullable: true),
                    CoachPhone = table.Column<string>(maxLength: 25, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coach", x => x.CoachID);
                    table.ForeignKey(
                        name: "FK_Coach_Person_PersonID",
                        column: x => x.PersonID,
                        principalTable: "Person",
                        principalColumn: "PersonID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "WebContent",
                columns: table => new
                {
                    WebContentId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyId = table.Column<int>(nullable: true),
                    Page = table.Column<string>(maxLength: 50, nullable: true),
                    WebContentTypeId = table.Column<int>(nullable: true),
                    Type = table.Column<string>(maxLength: 50, nullable: true),
                    Title = table.Column<string>(maxLength: 50, nullable: true),
                    ContentSequence = table.Column<int>(nullable: true),
                    SubTitle = table.Column<string>(maxLength: 50, nullable: true),
                    Location = table.Column<string>(maxLength: 50, nullable: true),
                    DateAndTime = table.Column<string>(maxLength: 50, nullable: true),
                    Body = table.Column<string>(nullable: true),
                    ExpirationDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModifiedUser = table.Column<int>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true, defaultValue: new DateTime(2020, 6, 15, 12, 27, 4, 870, DateTimeKind.Local).AddTicks(1894)),
                    CreatedUser = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebContent", x => x.WebContentId);
                    table.ForeignKey(
                        name: "FK_WebContent_WebContentType_WebContentTypeId",
                        column: x => x.WebContentTypeId,
                        principalTable: "WebContentType",
                        principalColumn: "WebContentTypeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Player",
                columns: table => new
                {
                    PlayerID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyID = table.Column<int>(nullable: true),
                    SeasonID = table.Column<int>(nullable: true),
                    DivisionID = table.Column<int>(nullable: true),
                    TeamID = table.Column<int>(nullable: true),
                    PersonId = table.Column<int>(nullable: true),
                    DraftID = table.Column<string>(maxLength: 3, nullable: true),
                    DraftNotes = table.Column<string>(maxLength: 100, nullable: true),
                    Rating = table.Column<int>(nullable: true),
                    Coach = table.Column<int>(nullable: true),
                    CoachID = table.Column<int>(nullable: true),
                    Sponsor = table.Column<int>(nullable: true),
                    SponsorID = table.Column<int>(nullable: true),
                    AD = table.Column<bool>(nullable: true),
                    Scholarship = table.Column<bool>(nullable: true),
                    FamilyDisc = table.Column<bool>(nullable: true),
                    Rollover = table.Column<bool>(nullable: true),
                    OutOfTown = table.Column<bool>(nullable: true),
                    RefundBatchID = table.Column<int>(nullable: true),
                    PaidDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    PaidAmount = table.Column<decimal>(type: "money", nullable: true),
                    BalanceOwed = table.Column<decimal>(type: "money", nullable: true),
                    PayType = table.Column<string>(maxLength: 5, nullable: true),
                    NoteDesc = table.Column<string>(maxLength: 50, nullable: true),
                    CheckMemo = table.Column<string>(maxLength: 50, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "smalldatetime", nullable: true),
                    CreatedUser = table.Column<string>(maxLength: 20, nullable: true),
                    PlaysDown = table.Column<bool>(nullable: true),
                    PlaysUp = table.Column<bool>(nullable: true),
                    ShoppingCartID = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Player", x => x.PlayerID);
                    table.ForeignKey(
                        name: "FK_Player_Division_DivisionID",
                        column: x => x.DivisionID,
                        principalTable: "Division",
                        principalColumn: "DivisionID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Player_Person_PersonId",
                        column: x => x.PersonId,
                        principalTable: "Person",
                        principalColumn: "PersonID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Player_Season_SeasonID",
                        column: x => x.SeasonID,
                        principalTable: "Season",
                        principalColumn: "SeasonID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Player_Team_TeamID",
                        column: x => x.TeamID,
                        principalTable: "Team",
                        principalColumn: "TeamID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "UserID", "CompanyID", "CreatedDate", "CreatedUser", "HouseID", "Name", "PassWord", "PersonId", "PWord", "UserName", "UserType", "ValidationCode" },
                values: new object[] { 1, null, null, null, null, null, null, null, null, "TestUser", 0, null });

            migrationBuilder.CreateIndex(
                name: "IX_Coach_PersonID",
                table: "Coach",
                column: "PersonID");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleGames",
                table: "Games",
                columns: new[] { "SeasonId", "DivisionId", "GameNumber" });

            migrationBuilder.CreateIndex(
                name: "idx_DCh_20078_20077_ScheduleGames",
                table: "Games",
                columns: new[] { "GameNumber", "LocationNumber", "GameDate", "GameTime", "VisitingTeamNumber", "HomeTeamNumber", "VisitingTeamScore", "HomeTeamScore", "ScheduleNumber", "SeasonId" });

            migrationBuilder.CreateIndex(
                name: "idx_DCh_1924_1923_ScheduleGames",
                table: "Games",
                columns: new[] { "ScheduleNumber", "GameNumber", "LocationNumber", "GameDate", "GameTime", "VisitingTeamNumber", "HomeTeamNumber", "VisitingTeamScore", "HomeTeamScore", "VisitingForfeited", "HomeForfeited", "SeasonId", "DivisionId" });

            migrationBuilder.CreateIndex(
                name: "idx_DCh_2775_2774_Household",
                table: "Household",
                columns: new[] { "Phone", "Email", "HouseID" });

            migrationBuilder.CreateIndex(
                name: "idx_DCh_12521_12520_People",
                table: "Person",
                column: "Coach");

            migrationBuilder.CreateIndex(
                name: "idx_DCh_75612_75611_People",
                table: "Person",
                column: "MainHouseID");

            migrationBuilder.CreateIndex(
                name: "idx_DCh_14287_14286_People",
                table: "Person",
                columns: new[] { "FirstName", "LastName" });

            migrationBuilder.CreateIndex(
                name: "idx_DCh_488836_488835_Players",
                table: "Player",
                column: "DivisionID");

            migrationBuilder.CreateIndex(
                name: "idx_DCh_75619_75618_Players",
                table: "Player",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "idx_DCh_2451_2450_Players",
                table: "Player",
                column: "PlayerID");

            migrationBuilder.CreateIndex(
                name: "idx_DCh_12817_12816_Players",
                table: "Player",
                column: "TeamID");

            migrationBuilder.CreateIndex(
                name: "idx_DCh_98394_98393_Players",
                table: "Player",
                columns: new[] { "Coach", "Sponsor", "SeasonID" });

            migrationBuilder.CreateIndex(
                name: "idx_DCh_8781_8780_Players",
                table: "Player",
                columns: new[] { "SeasonID", "PayType", "Sponsor" });

            migrationBuilder.CreateIndex(
                name: "idx_DCh_25_24_Players",
                table: "Player",
                columns: new[] { "PlayerID", "DivisionID", "Coach", "Sponsor", "SeasonID" });

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleDivTeams",
                table: "SchedueDivTeam",
                columns: new[] { "ScheduleNumber", "TeamNumber" });

            migrationBuilder.CreateIndex(
                name: "IX_Team_ColorId",
                table: "Team",
                column: "ColorId");

            migrationBuilder.CreateIndex(
                name: "idx_DCh_12814_12813_Teams",
                table: "Team",
                column: "DivisionID");

            migrationBuilder.CreateIndex(
                name: "idx_DCh_615_614_Teams",
                table: "Team",
                column: "TeamID");

            migrationBuilder.CreateIndex(
                name: "idx_DCh_376_375_Teams",
                table: "Team",
                columns: new[] { "DivisionID", "TeamName", "TeamColorID", "TeamNumber", "SeasonID" });

            migrationBuilder.CreateIndex(
                name: "idx_DCh_369_368_Users",
                table: "User",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "idx_DCh_4811_4810_Users",
                table: "User",
                column: "UserName");

            migrationBuilder.CreateIndex(
                name: "IX_WebContent_WebContentTypeId",
                table: "WebContent",
                column: "WebContentTypeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Coach");

            migrationBuilder.DropTable(
                name: "Comment");

            migrationBuilder.DropTable(
                name: "Company");

            migrationBuilder.DropTable(
                name: "Content");

            migrationBuilder.DropTable(
                name: "Conversion Errors");

            migrationBuilder.DropTable(
                name: "Director");

            migrationBuilder.DropTable(
                name: "dtproperties");

            migrationBuilder.DropTable(
                name: "Games");

            migrationBuilder.DropTable(
                name: "Household");

            migrationBuilder.DropTable(
                name: "Location");

            migrationBuilder.DropTable(
                name: "PayErrorLog");

            migrationBuilder.DropTable(
                name: "Player");

            migrationBuilder.DropTable(
                name: "Role");

            migrationBuilder.DropTable(
                name: "SchDivisions");

            migrationBuilder.DropTable(
                name: "SchedueDivTeam");

            migrationBuilder.DropTable(
                name: "ScheduleGamesStats");

            migrationBuilder.DropTable(
                name: "ScheduleLocations");

            migrationBuilder.DropTable(
                name: "SchedulePlayoffs");

            migrationBuilder.DropTable(
                name: "SchExceptions");

            migrationBuilder.DropTable(
                name: "SchGames");

            migrationBuilder.DropTable(
                name: "SchGameTimes");

            migrationBuilder.DropTable(
                name: "SchLocations");

            migrationBuilder.DropTable(
                name: "SchOptions");

            migrationBuilder.DropTable(
                name: "SchTeams");

            migrationBuilder.DropTable(
                name: "ShoppingCart");

            migrationBuilder.DropTable(
                name: "Special User Query");

            migrationBuilder.DropTable(
                name: "Sponsor");

            migrationBuilder.DropTable(
                name: "SponsorFee");

            migrationBuilder.DropTable(
                name: "SponsorPayment");

            migrationBuilder.DropTable(
                name: "SponsorProfile");

            migrationBuilder.DropTable(
                name: "TeamRosters");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "Version");

            migrationBuilder.DropTable(
                name: "WebContent");

            migrationBuilder.DropTable(
                name: "Division");

            migrationBuilder.DropTable(
                name: "Person");

            migrationBuilder.DropTable(
                name: "Season");

            migrationBuilder.DropTable(
                name: "Team");

            migrationBuilder.DropTable(
                name: "WebContentType");

            migrationBuilder.DropTable(
                name: "Color");
        }
    }
}
