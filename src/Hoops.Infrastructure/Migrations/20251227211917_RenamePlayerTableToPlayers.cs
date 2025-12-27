using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hoops.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenamePlayerTableToPlayers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Coach_People_PeopleID1",
                table: "Coach");

            migrationBuilder.DropForeignKey(
                name: "FK_Players_People_PeopleID",
                table: "Players");

            migrationBuilder.DropForeignKey(
                name: "FK_SponsorPayment_SponsorProfile_SponsorProfileID1",
                table: "SponsorPayment");

            migrationBuilder.DropIndex(
                name: "IX_SponsorPayment_SponsorProfileID1",
                table: "SponsorPayment");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SchedulePlayoffs",
                table: "SchedulePlayoffs");

            migrationBuilder.DropIndex(
                name: "IX_Players_DivisionID",
                table: "Players");

            migrationBuilder.DropIndex(
                name: "IX_Players_PeopleID",
                table: "Players");

            migrationBuilder.DropIndex(
                name: "IX_Players_SeasonID",
                table: "Players");

            migrationBuilder.DropIndex(
                name: "IX_Players_TeamID",
                table: "Players");

            migrationBuilder.DropIndex(
                name: "IX_Coach_PeopleID1",
                table: "Coach");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 1);

            migrationBuilder.DropColumn(
                name: "SponsorProfileID1",
                table: "SponsorPayment");

            migrationBuilder.DropColumn(
                name: "PeopleID1",
                table: "Coach");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ModifiedDate",
                table: "WebContent",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 243, DateTimeKind.Local).AddTicks(507),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 728, DateTimeKind.Local).AddTicks(3171));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Users",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 244, DateTimeKind.Local).AddTicks(9017),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 730, DateTimeKind.Local).AddTicks(4659));

            migrationBuilder.AlterColumn<int>(
                name: "UserID",
                table: "Users",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<string>(
                name: "TeamName",
                table: "Teams",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Teams",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 232, DateTimeKind.Local).AddTicks(6279),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 714, DateTimeKind.Local).AddTicks(4967));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Sponsors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 229, DateTimeKind.Local).AddTicks(2830),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 710, DateTimeKind.Local).AddTicks(3966));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorProfile",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 227, DateTimeKind.Local).AddTicks(3840),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 707, DateTimeKind.Local).AddTicks(1756));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorPayment",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 225, DateTimeKind.Local).AddTicks(3875),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 703, DateTimeKind.Local).AddTicks(2271));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorFee",
                type: "smalldatetime",
                nullable: false,
                defaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 223, DateTimeKind.Local).AddTicks(9371),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 701, DateTimeKind.Local).AddTicks(1912));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Seasons",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 222, DateTimeKind.Local).AddTicks(633),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 699, DateTimeKind.Local).AddTicks(2000));

            migrationBuilder.AlterColumn<int>(
                name: "ScheduleNumber",
                table: "SchedulePlayoffs",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<int>(
                name: "SchedulePlayoffID",
                table: "SchedulePlayoffs",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Rolls",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 199, DateTimeKind.Local).AddTicks(3582),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 675, DateTimeKind.Local).AddTicks(5900));

            migrationBuilder.AlterColumn<string>(
                name: "PayType",
                table: "Players",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(5)",
                oldMaxLength: 5,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Players",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 197, DateTimeKind.Local).AddTicks(9757),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 674, DateTimeKind.Local).AddTicks(541));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "People",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 192, DateTimeKind.Local).AddTicks(6418),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 664, DateTimeKind.Local).AddTicks(387));

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Households",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Households",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 189, DateTimeKind.Local).AddTicks(4760),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 660, DateTimeKind.Local).AddTicks(3155));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Divisions",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 180, DateTimeKind.Local).AddTicks(8400),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 647, DateTimeKind.Local).AddTicks(647));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Directors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 178, DateTimeKind.Local).AddTicks(3017),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 643, DateTimeKind.Local).AddTicks(7277));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Company",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 176, DateTimeKind.Local).AddTicks(9146),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 642, DateTimeKind.Local).AddTicks(3073));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Colors",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 175, DateTimeKind.Local).AddTicks(3477),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 640, DateTimeKind.Local).AddTicks(7348));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Coach",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 166, DateTimeKind.Local).AddTicks(2789),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 630, DateTimeKind.Local).AddTicks(5464));

            migrationBuilder.AddPrimaryKey(
                name: "PK_SchedulePlayoffs",
                table: "SchedulePlayoffs",
                column: "SchedulePlayoffID");

            migrationBuilder.CreateIndex(
                name: "IX_SponsorPayment_SponsorProfileID",
                table: "SponsorPayment",
                column: "SponsorProfileID");

            migrationBuilder.CreateIndex(
                name: "UQ_SchedulePlayoffs_Schedule_Game",
                table: "SchedulePlayoffs",
                columns: new[] { "ScheduleNumber", "GameNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Coach_PeopleID",
                table: "Coach",
                column: "PeopleID");

            migrationBuilder.AddForeignKey(
                name: "FK_Coach_People_PeopleID",
                table: "Coach",
                column: "PeopleID",
                principalTable: "People",
                principalColumn: "PeopleID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Players_People_PeopleID",
                table: "Players",
                column: "PeopleID",
                principalTable: "People",
                principalColumn: "PeopleID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SponsorPayment_SponsorProfile_SponsorProfileID",
                table: "SponsorPayment",
                column: "SponsorProfileID",
                principalTable: "SponsorProfile",
                principalColumn: "SponsorProfileID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Coach_People_PeopleID",
                table: "Coach");

            migrationBuilder.DropForeignKey(
                name: "FK_Players_People_PeopleID",
                table: "Players");

            migrationBuilder.DropForeignKey(
                name: "FK_SponsorPayment_SponsorProfile_SponsorProfileID",
                table: "SponsorPayment");

            migrationBuilder.DropIndex(
                name: "IX_SponsorPayment_SponsorProfileID",
                table: "SponsorPayment");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SchedulePlayoffs",
                table: "SchedulePlayoffs");

            migrationBuilder.DropIndex(
                name: "UQ_SchedulePlayoffs_Schedule_Game",
                table: "SchedulePlayoffs");

            migrationBuilder.DropIndex(
                name: "IX_Coach_PeopleID",
                table: "Coach");

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
                oldDefaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 243, DateTimeKind.Local).AddTicks(507));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Users",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 730, DateTimeKind.Local).AddTicks(4659),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 244, DateTimeKind.Local).AddTicks(9017));

            migrationBuilder.AlterColumn<int>(
                name: "UserID",
                table: "Users",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<string>(
                name: "TeamName",
                table: "Teams",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Teams",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 714, DateTimeKind.Local).AddTicks(4967),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 232, DateTimeKind.Local).AddTicks(6279));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Sponsors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 710, DateTimeKind.Local).AddTicks(3966),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 229, DateTimeKind.Local).AddTicks(2830));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorProfile",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 707, DateTimeKind.Local).AddTicks(1756),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 227, DateTimeKind.Local).AddTicks(3840));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorPayment",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 703, DateTimeKind.Local).AddTicks(2271),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 225, DateTimeKind.Local).AddTicks(3875));

            migrationBuilder.AddColumn<int>(
                name: "SponsorProfileID1",
                table: "SponsorPayment",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorFee",
                type: "smalldatetime",
                nullable: false,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 701, DateTimeKind.Local).AddTicks(1912),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldDefaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 223, DateTimeKind.Local).AddTicks(9371));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Seasons",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 699, DateTimeKind.Local).AddTicks(2000),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 222, DateTimeKind.Local).AddTicks(633));

            migrationBuilder.AlterColumn<int>(
                name: "ScheduleNumber",
                table: "SchedulePlayoffs",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Rolls",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 675, DateTimeKind.Local).AddTicks(5900),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 199, DateTimeKind.Local).AddTicks(3582));

            migrationBuilder.AlterColumn<string>(
                name: "PayType",
                table: "Players",
                type: "nvarchar(5)",
                maxLength: 5,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Players",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 674, DateTimeKind.Local).AddTicks(541),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 197, DateTimeKind.Local).AddTicks(9757));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "People",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 664, DateTimeKind.Local).AddTicks(387),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 192, DateTimeKind.Local).AddTicks(6418));

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Households",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Households",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 660, DateTimeKind.Local).AddTicks(3155),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 189, DateTimeKind.Local).AddTicks(4760));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Divisions",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 647, DateTimeKind.Local).AddTicks(647),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 180, DateTimeKind.Local).AddTicks(8400));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Directors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 643, DateTimeKind.Local).AddTicks(7277),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 178, DateTimeKind.Local).AddTicks(3017));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Company",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 642, DateTimeKind.Local).AddTicks(3073),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 176, DateTimeKind.Local).AddTicks(9146));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Colors",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 640, DateTimeKind.Local).AddTicks(7348),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 175, DateTimeKind.Local).AddTicks(3477));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Coach",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 630, DateTimeKind.Local).AddTicks(5464),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 12, 27, 16, 19, 16, 166, DateTimeKind.Local).AddTicks(2789));

            migrationBuilder.AddColumn<int>(
                name: "PeopleID1",
                table: "Coach",
                type: "int",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SchedulePlayoffs",
                table: "SchedulePlayoffs",
                column: "ScheduleNumber");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserID", "CompanyID", "CreatedUser", "HouseID", "Name", "PassWord", "PeopleID", "PWord", "UserName", "UserType", "ValidationCode" },
                values: new object[] { 1, null, null, 0, null, null, null, null, "TestUser", 0, null });

            migrationBuilder.CreateIndex(
                name: "IX_SponsorPayment_SponsorProfileID1",
                table: "SponsorPayment",
                column: "SponsorProfileID1");

            migrationBuilder.CreateIndex(
                name: "IX_Players_DivisionID",
                table: "Players",
                column: "DivisionID");

            migrationBuilder.CreateIndex(
                name: "IX_Players_PeopleID",
                table: "Players",
                column: "PeopleID");

            migrationBuilder.CreateIndex(
                name: "IX_Players_SeasonID",
                table: "Players",
                column: "SeasonID");

            migrationBuilder.CreateIndex(
                name: "IX_Players_TeamID",
                table: "Players",
                column: "TeamID");

            migrationBuilder.CreateIndex(
                name: "IX_Coach_PeopleID1",
                table: "Coach",
                column: "PeopleID1");

            migrationBuilder.AddForeignKey(
                name: "FK_Coach_People_PeopleID1",
                table: "Coach",
                column: "PeopleID1",
                principalTable: "People",
                principalColumn: "PeopleID");

            migrationBuilder.AddForeignKey(
                name: "FK_Players_People_PeopleID",
                table: "Players",
                column: "PeopleID",
                principalTable: "People",
                principalColumn: "PeopleID");

            migrationBuilder.AddForeignKey(
                name: "FK_SponsorPayment_SponsorProfile_SponsorProfileID1",
                table: "SponsorPayment",
                column: "SponsorProfileID1",
                principalTable: "SponsorProfile",
                principalColumn: "SponsorProfileID");
        }
    }
}
