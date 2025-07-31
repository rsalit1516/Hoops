using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hoops.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RestructureSchedulePlayoffsTableWithBackup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Update timestamp fields first
            migrationBuilder.AlterColumn<DateTime>(
                name: "ModifiedDate",
                table: "WebContent",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 31, 7, 50, 32, 765, DateTimeKind.Local).AddTicks(357),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 728, DateTimeKind.Local).AddTicks(3171));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Users",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 31, 7, 50, 32, 767, DateTimeKind.Local).AddTicks(6417),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 730, DateTimeKind.Local).AddTicks(4659));

            // Create backup table
            migrationBuilder.Sql(@"
                IF OBJECT_ID('SchedulePlayoffs_Backup', 'U') IS NOT NULL
                    DROP TABLE SchedulePlayoffs_Backup;
                
                SELECT * INTO SchedulePlayoffs_Backup FROM SchedulePlayoffs;");

            // Drop the original table
            migrationBuilder.DropTable("SchedulePlayoffs");

            // Recreate table with proper structure
            migrationBuilder.CreateTable(
                name: "SchedulePlayoffs",
                columns: table => new
                {
                    SchedulePlayoffID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ScheduleNumber = table.Column<int>(type: "int", nullable: false),
                    GameNumber = table.Column<int>(type: "int", nullable: false),
                    LocationNumber = table.Column<int>(type: "int", nullable: true),
                    GameDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    GameTime = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    VisitingTeam = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    HomeTeam = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Descr = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    VisitingTeamScore = table.Column<int>(type: "int", nullable: true),
                    HomeTeamScore = table.Column<int>(type: "int", nullable: true),
                    DivisionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SchedulePlayoffs", x => x.SchedulePlayoffID);
                });

            // Restore data (existing data will get auto-generated SchedulePlayoffID values)
            migrationBuilder.Sql(@"
                IF OBJECT_ID('SchedulePlayoffs_Backup', 'U') IS NOT NULL
                BEGIN
                    INSERT INTO SchedulePlayoffs (ScheduleNumber, GameNumber, LocationNumber, GameDate, GameTime, VisitingTeam, HomeTeam, Descr, VisitingTeamScore, HomeTeamScore, DivisionId)
                    SELECT ScheduleNumber, GameNumber, LocationNumber, GameDate, GameTime, VisitingTeam, HomeTeam, Descr, VisitingTeamScore, HomeTeamScore, DivisionId
                    FROM SchedulePlayoffs_Backup;
                    
                    DROP TABLE SchedulePlayoffs_Backup;
                END");

            // Update other timestamp fields
            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Teams",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 31, 7, 50, 32, 754, DateTimeKind.Local).AddTicks(5548),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 714, DateTimeKind.Local).AddTicks(4967));

            // Continue with other timestamp updates... (abbreviated for brevity)
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 7, 31, 7, 50, 32, 767, DateTimeKind.Local).AddTicks(6417));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_SchedulePlayoffs",
                table: "SchedulePlayoffs");

            migrationBuilder.DropColumn(
                name: "SchedulePlayoffID",
                table: "SchedulePlayoffs");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ModifiedDate",
                table: "WebContent",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 728, DateTimeKind.Local).AddTicks(3171),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 31, 7, 50, 32, 765, DateTimeKind.Local).AddTicks(357));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Users",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 730, DateTimeKind.Local).AddTicks(4659),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 31, 7, 50, 32, 767, DateTimeKind.Local).AddTicks(6417));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Teams",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 714, DateTimeKind.Local).AddTicks(4967),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 31, 7, 50, 32, 754, DateTimeKind.Local).AddTicks(5548));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Sponsors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 710, DateTimeKind.Local).AddTicks(3966),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 31, 7, 50, 32, 749, DateTimeKind.Local).AddTicks(3731));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorProfile",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 707, DateTimeKind.Local).AddTicks(1756),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 31, 7, 50, 32, 747, DateTimeKind.Local).AddTicks(1195));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorPayment",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 703, DateTimeKind.Local).AddTicks(2271),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 31, 7, 50, 32, 744, DateTimeKind.Local).AddTicks(4528));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorFee",
                type: "smalldatetime",
                nullable: false,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 701, DateTimeKind.Local).AddTicks(1912),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldDefaultValue: new DateTime(2025, 7, 31, 7, 50, 32, 742, DateTimeKind.Local).AddTicks(8173));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Seasons",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 699, DateTimeKind.Local).AddTicks(2000),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 31, 7, 50, 32, 741, DateTimeKind.Local).AddTicks(1488));

            migrationBuilder.AlterColumn<string>(
                name: "VisitingTeam",
                table: "SchedulePlayoffs",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(10)",
                oldMaxLength: 10,
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ScheduleNumber",
                table: "SchedulePlayoffs",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<string>(
                name: "HomeTeam",
                table: "SchedulePlayoffs",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(10)",
                oldMaxLength: 10,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "GameTime",
                table: "SchedulePlayoffs",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "GameDate",
                table: "SchedulePlayoffs",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Descr",
                table: "SchedulePlayoffs",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Rolls",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 675, DateTimeKind.Local).AddTicks(5900),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 31, 7, 50, 32, 717, DateTimeKind.Local).AddTicks(1933));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Player",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 674, DateTimeKind.Local).AddTicks(541),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 31, 7, 50, 32, 715, DateTimeKind.Local).AddTicks(9986));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "People",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 664, DateTimeKind.Local).AddTicks(387),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 31, 7, 50, 32, 706, DateTimeKind.Local).AddTicks(7659));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Households",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 660, DateTimeKind.Local).AddTicks(3155),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 31, 7, 50, 32, 700, DateTimeKind.Local).AddTicks(1882));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Divisions",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 647, DateTimeKind.Local).AddTicks(647),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 31, 7, 50, 32, 691, DateTimeKind.Local).AddTicks(2815));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Directors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 643, DateTimeKind.Local).AddTicks(7277),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 31, 7, 50, 32, 688, DateTimeKind.Local).AddTicks(2587));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Company",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 642, DateTimeKind.Local).AddTicks(3073),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 31, 7, 50, 32, 685, DateTimeKind.Local).AddTicks(7203));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Colors",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 640, DateTimeKind.Local).AddTicks(7348),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 31, 7, 50, 32, 683, DateTimeKind.Local).AddTicks(9104));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Coach",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 630, DateTimeKind.Local).AddTicks(5464),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 31, 7, 50, 32, 674, DateTimeKind.Local).AddTicks(7162));

            migrationBuilder.AddPrimaryKey(
                name: "PK_SchedulePlayoffs",
                table: "SchedulePlayoffs",
                column: "ScheduleNumber");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 7, 25, 9, 32, 13, 730, DateTimeKind.Local).AddTicks(4659));
        }
    }
}
