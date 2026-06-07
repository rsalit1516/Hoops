using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hoops.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CompleteAuditFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "WebContentType",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedUser",
                table: "WebContentType",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedDate",
                table: "WebContentType",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedUser",
                table: "WebContentType",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "ModifiedDate",
                table: "WebContent",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 966, DateTimeKind.Local).AddTicks(8414),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 894, DateTimeKind.Local).AddTicks(1252));

            // Clear legacy string values that cannot be cast to int.
            migrationBuilder.Sql("UPDATE [Users] SET [CreatedUser] = NULL");
            migrationBuilder.AlterColumn<int>(
                name: "CreatedUser",
                table: "Users",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Users",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 973, DateTimeKind.Local).AddTicks(1714),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 900, DateTimeKind.Local).AddTicks(319));

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedDate",
                table: "Users",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedUser",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "TeamColorID",
                table: "Teams",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Teams",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 950, DateTimeKind.Local).AddTicks(5777),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 877, DateTimeKind.Local).AddTicks(3832));

            migrationBuilder.Sql("UPDATE [Sponsors] SET [CreatedUser] = NULL");
            migrationBuilder.AlterColumn<int>(
                name: "CreatedUser",
                table: "Sponsors",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Sponsors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 944, DateTimeKind.Local).AddTicks(9915),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 873, DateTimeKind.Local).AddTicks(6009));

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedDate",
                table: "Sponsors",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedUser",
                table: "Sponsors",
                type: "int",
                nullable: true);

            migrationBuilder.Sql("UPDATE [SponsorProfile] SET [CreatedUser] = NULL");
            migrationBuilder.AlterColumn<int>(
                name: "CreatedUser",
                table: "SponsorProfile",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(20)",
                oldUnicode: false,
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorProfile",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 940, DateTimeKind.Local).AddTicks(217),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 871, DateTimeKind.Local).AddTicks(1640));

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedDate",
                table: "SponsorProfile",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedUser",
                table: "SponsorProfile",
                type: "int",
                nullable: true);

            migrationBuilder.Sql("UPDATE [SponsorPayments] SET [CreatedUser] = NULL");
            migrationBuilder.AlterColumn<int>(
                name: "CreatedUser",
                table: "SponsorPayments",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(20)",
                oldUnicode: false,
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorPayments",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 935, DateTimeKind.Local).AddTicks(5796),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 868, DateTimeKind.Local).AddTicks(8535));

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedDate",
                table: "SponsorPayments",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedUser",
                table: "SponsorPayments",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Seasons",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 929, DateTimeKind.Local).AddTicks(8833),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 862, DateTimeKind.Local).AddTicks(9511));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "ScheduleLocations",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedUser",
                table: "ScheduleLocations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedDate",
                table: "ScheduleLocations",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedUser",
                table: "ScheduleLocations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "ScheduleDivTeams",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedUser",
                table: "ScheduleDivTeams",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedDate",
                table: "ScheduleDivTeams",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedUser",
                table: "ScheduleDivTeams",
                type: "int",
                nullable: true);

            migrationBuilder.Sql("UPDATE [Rolls] SET [CreatedUser] = NULL");
            migrationBuilder.AlterColumn<int>(
                name: "CreatedUser",
                table: "Rolls",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "char(10)",
                oldUnicode: false,
                oldFixedLength: true,
                oldMaxLength: 10,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Rolls",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 882, DateTimeKind.Local).AddTicks(680),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 833, DateTimeKind.Local).AddTicks(8776));

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedDate",
                table: "Rolls",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedUser",
                table: "Rolls",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Players",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 877, DateTimeKind.Local).AddTicks(7353),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 829, DateTimeKind.Local).AddTicks(7520));

            migrationBuilder.Sql("UPDATE [People] SET [CreatedUser] = NULL");
            migrationBuilder.AlterColumn<int>(
                name: "CreatedUser",
                table: "People",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "People",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 867, DateTimeKind.Local).AddTicks(2604),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 823, DateTimeKind.Local).AddTicks(9541));

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedDate",
                table: "People",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedUser",
                table: "People",
                type: "int",
                nullable: true);

            migrationBuilder.Sql("UPDATE [Households] SET [CreatedUser] = NULL");
            migrationBuilder.AlterColumn<int>(
                name: "CreatedUser",
                table: "Households",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Households",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 861, DateTimeKind.Local).AddTicks(656),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 820, DateTimeKind.Local).AddTicks(9165));

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedDate",
                table: "Households",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedUser",
                table: "Households",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Divisions",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 851, DateTimeKind.Local).AddTicks(3206),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 809, DateTimeKind.Local).AddTicks(7260));

            migrationBuilder.Sql("UPDATE [Directors] SET [CreatedUser] = NULL");
            migrationBuilder.AlterColumn<int>(
                name: "CreatedUser",
                table: "Directors",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Directors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 846, DateTimeKind.Local).AddTicks(5457),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 806, DateTimeKind.Local).AddTicks(9427));

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedDate",
                table: "Directors",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedUser",
                table: "Directors",
                type: "int",
                nullable: true);

            migrationBuilder.Sql("UPDATE [Companies] SET [CreatedUser] = NULL");
            migrationBuilder.AlterColumn<int>(
                name: "CreatedUser",
                table: "Companies",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(20)",
                oldUnicode: false,
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Companies",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 835, DateTimeKind.Local).AddTicks(4621),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 805, DateTimeKind.Local).AddTicks(8962));

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedDate",
                table: "Companies",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedUser",
                table: "Companies",
                type: "int",
                nullable: true);

            migrationBuilder.Sql("UPDATE [Colors] SET [CreatedUser] = NULL");
            migrationBuilder.AlterColumn<int>(
                name: "CreatedUser",
                table: "Colors",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "char(10)",
                oldUnicode: false,
                oldFixedLength: true,
                oldMaxLength: 10,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Colors",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 832, DateTimeKind.Local).AddTicks(4942),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 804, DateTimeKind.Local).AddTicks(7452));

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedDate",
                table: "Colors",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedUser",
                table: "Colors",
                type: "int",
                nullable: true);

            migrationBuilder.Sql("UPDATE [Coaches] SET [CreatedUser] = NULL");
            migrationBuilder.AlterColumn<int>(
                name: "CreatedUser",
                table: "Coaches",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Coaches",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 812, DateTimeKind.Local).AddTicks(4043),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 795, DateTimeKind.Local).AddTicks(8810));

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedDate",
                table: "Coaches",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedUser",
                table: "Coaches",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_WebContentType_CreatedUser",
                table: "WebContentType",
                column: "CreatedUser");

            migrationBuilder.CreateIndex(
                name: "IX_WebContentType_ModifiedUser",
                table: "WebContentType",
                column: "ModifiedUser");

            migrationBuilder.CreateIndex(
                name: "IX_Users_CreatedUser",
                table: "Users",
                column: "CreatedUser");

            migrationBuilder.CreateIndex(
                name: "IX_Users_ModifiedUser",
                table: "Users",
                column: "ModifiedUser");

            migrationBuilder.CreateIndex(
                name: "IX_Sponsors_CreatedUser",
                table: "Sponsors",
                column: "CreatedUser");

            migrationBuilder.CreateIndex(
                name: "IX_Sponsors_ModifiedUser",
                table: "Sponsors",
                column: "ModifiedUser");

            migrationBuilder.CreateIndex(
                name: "IX_SponsorProfile_CreatedUser",
                table: "SponsorProfile",
                column: "CreatedUser");

            migrationBuilder.CreateIndex(
                name: "IX_SponsorProfile_ModifiedUser",
                table: "SponsorProfile",
                column: "ModifiedUser");

            migrationBuilder.CreateIndex(
                name: "IX_SponsorPayments_CreatedUser",
                table: "SponsorPayments",
                column: "CreatedUser");

            migrationBuilder.CreateIndex(
                name: "IX_SponsorPayments_ModifiedUser",
                table: "SponsorPayments",
                column: "ModifiedUser");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleLocations_CreatedUser",
                table: "ScheduleLocations",
                column: "CreatedUser");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleLocations_ModifiedUser",
                table: "ScheduleLocations",
                column: "ModifiedUser");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleDivTeams_CreatedUser",
                table: "ScheduleDivTeams",
                column: "CreatedUser");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleDivTeams_ModifiedUser",
                table: "ScheduleDivTeams",
                column: "ModifiedUser");

            migrationBuilder.CreateIndex(
                name: "IX_Rolls_CreatedUser",
                table: "Rolls",
                column: "CreatedUser");

            migrationBuilder.CreateIndex(
                name: "IX_Rolls_ModifiedUser",
                table: "Rolls",
                column: "ModifiedUser");

            migrationBuilder.CreateIndex(
                name: "IX_People_CreatedUser",
                table: "People",
                column: "CreatedUser");

            migrationBuilder.CreateIndex(
                name: "IX_People_ModifiedUser",
                table: "People",
                column: "ModifiedUser");

            migrationBuilder.CreateIndex(
                name: "IX_Households_CreatedUser",
                table: "Households",
                column: "CreatedUser");

            migrationBuilder.CreateIndex(
                name: "IX_Households_ModifiedUser",
                table: "Households",
                column: "ModifiedUser");

            migrationBuilder.CreateIndex(
                name: "IX_Directors_CreatedUser",
                table: "Directors",
                column: "CreatedUser");

            migrationBuilder.CreateIndex(
                name: "IX_Directors_ModifiedUser",
                table: "Directors",
                column: "ModifiedUser");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_CreatedUser",
                table: "Companies",
                column: "CreatedUser");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_ModifiedUser",
                table: "Companies",
                column: "ModifiedUser");

            migrationBuilder.CreateIndex(
                name: "IX_Colors_CreatedUser",
                table: "Colors",
                column: "CreatedUser");

            migrationBuilder.CreateIndex(
                name: "IX_Colors_ModifiedUser",
                table: "Colors",
                column: "ModifiedUser");

            migrationBuilder.CreateIndex(
                name: "IX_Coaches_CreatedUser",
                table: "Coaches",
                column: "CreatedUser");

            migrationBuilder.CreateIndex(
                name: "IX_Coaches_ModifiedUser",
                table: "Coaches",
                column: "ModifiedUser");

            migrationBuilder.AddForeignKey(
                name: "FK_Coaches_Users_CreatedUser",
                table: "Coaches",
                column: "CreatedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Coaches_Users_ModifiedUser",
                table: "Coaches",
                column: "ModifiedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Colors_Users_CreatedUser",
                table: "Colors",
                column: "CreatedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Colors_Users_ModifiedUser",
                table: "Colors",
                column: "ModifiedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Companies_Users_CreatedUser",
                table: "Companies",
                column: "CreatedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Companies_Users_ModifiedUser",
                table: "Companies",
                column: "ModifiedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Directors_Users_CreatedUser",
                table: "Directors",
                column: "CreatedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Directors_Users_ModifiedUser",
                table: "Directors",
                column: "ModifiedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Households_Users_CreatedUser",
                table: "Households",
                column: "CreatedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Households_Users_ModifiedUser",
                table: "Households",
                column: "ModifiedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_People_Users_CreatedUser",
                table: "People",
                column: "CreatedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_People_Users_ModifiedUser",
                table: "People",
                column: "ModifiedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Rolls_Users_CreatedUser",
                table: "Rolls",
                column: "CreatedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Rolls_Users_ModifiedUser",
                table: "Rolls",
                column: "ModifiedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_ScheduleDivTeams_Users_CreatedUser",
                table: "ScheduleDivTeams",
                column: "CreatedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_ScheduleDivTeams_Users_ModifiedUser",
                table: "ScheduleDivTeams",
                column: "ModifiedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_ScheduleLocations_Users_CreatedUser",
                table: "ScheduleLocations",
                column: "CreatedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_ScheduleLocations_Users_ModifiedUser",
                table: "ScheduleLocations",
                column: "ModifiedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_SponsorPayments_Users_CreatedUser",
                table: "SponsorPayments",
                column: "CreatedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_SponsorPayments_Users_ModifiedUser",
                table: "SponsorPayments",
                column: "ModifiedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_SponsorProfile_Users_CreatedUser",
                table: "SponsorProfile",
                column: "CreatedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_SponsorProfile_Users_ModifiedUser",
                table: "SponsorProfile",
                column: "ModifiedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Sponsors_Users_CreatedUser",
                table: "Sponsors",
                column: "CreatedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Sponsors_Users_ModifiedUser",
                table: "Sponsors",
                column: "ModifiedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Users_CreatedUser",
                table: "Users",
                column: "CreatedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Users_ModifiedUser",
                table: "Users",
                column: "ModifiedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_WebContentType_Users_CreatedUser",
                table: "WebContentType",
                column: "CreatedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_WebContentType_Users_ModifiedUser",
                table: "WebContentType",
                column: "ModifiedUser",
                principalTable: "Users",
                principalColumn: "UserID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Coaches_Users_CreatedUser",
                table: "Coaches");

            migrationBuilder.DropForeignKey(
                name: "FK_Coaches_Users_ModifiedUser",
                table: "Coaches");

            migrationBuilder.DropForeignKey(
                name: "FK_Colors_Users_CreatedUser",
                table: "Colors");

            migrationBuilder.DropForeignKey(
                name: "FK_Colors_Users_ModifiedUser",
                table: "Colors");

            migrationBuilder.DropForeignKey(
                name: "FK_Companies_Users_CreatedUser",
                table: "Companies");

            migrationBuilder.DropForeignKey(
                name: "FK_Companies_Users_ModifiedUser",
                table: "Companies");

            migrationBuilder.DropForeignKey(
                name: "FK_Directors_Users_CreatedUser",
                table: "Directors");

            migrationBuilder.DropForeignKey(
                name: "FK_Directors_Users_ModifiedUser",
                table: "Directors");

            migrationBuilder.DropForeignKey(
                name: "FK_Households_Users_CreatedUser",
                table: "Households");

            migrationBuilder.DropForeignKey(
                name: "FK_Households_Users_ModifiedUser",
                table: "Households");

            migrationBuilder.DropForeignKey(
                name: "FK_People_Users_CreatedUser",
                table: "People");

            migrationBuilder.DropForeignKey(
                name: "FK_People_Users_ModifiedUser",
                table: "People");

            migrationBuilder.DropForeignKey(
                name: "FK_Rolls_Users_CreatedUser",
                table: "Rolls");

            migrationBuilder.DropForeignKey(
                name: "FK_Rolls_Users_ModifiedUser",
                table: "Rolls");

            migrationBuilder.DropForeignKey(
                name: "FK_ScheduleDivTeams_Users_CreatedUser",
                table: "ScheduleDivTeams");

            migrationBuilder.DropForeignKey(
                name: "FK_ScheduleDivTeams_Users_ModifiedUser",
                table: "ScheduleDivTeams");

            migrationBuilder.DropForeignKey(
                name: "FK_ScheduleLocations_Users_CreatedUser",
                table: "ScheduleLocations");

            migrationBuilder.DropForeignKey(
                name: "FK_ScheduleLocations_Users_ModifiedUser",
                table: "ScheduleLocations");

            migrationBuilder.DropForeignKey(
                name: "FK_SponsorPayments_Users_CreatedUser",
                table: "SponsorPayments");

            migrationBuilder.DropForeignKey(
                name: "FK_SponsorPayments_Users_ModifiedUser",
                table: "SponsorPayments");

            migrationBuilder.DropForeignKey(
                name: "FK_SponsorProfile_Users_CreatedUser",
                table: "SponsorProfile");

            migrationBuilder.DropForeignKey(
                name: "FK_SponsorProfile_Users_ModifiedUser",
                table: "SponsorProfile");

            migrationBuilder.DropForeignKey(
                name: "FK_Sponsors_Users_CreatedUser",
                table: "Sponsors");

            migrationBuilder.DropForeignKey(
                name: "FK_Sponsors_Users_ModifiedUser",
                table: "Sponsors");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Users_CreatedUser",
                table: "Users");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Users_ModifiedUser",
                table: "Users");

            migrationBuilder.DropForeignKey(
                name: "FK_WebContentType_Users_CreatedUser",
                table: "WebContentType");

            migrationBuilder.DropForeignKey(
                name: "FK_WebContentType_Users_ModifiedUser",
                table: "WebContentType");

            migrationBuilder.DropIndex(
                name: "IX_WebContentType_CreatedUser",
                table: "WebContentType");

            migrationBuilder.DropIndex(
                name: "IX_WebContentType_ModifiedUser",
                table: "WebContentType");

            migrationBuilder.DropIndex(
                name: "IX_Users_CreatedUser",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_ModifiedUser",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Sponsors_CreatedUser",
                table: "Sponsors");

            migrationBuilder.DropIndex(
                name: "IX_Sponsors_ModifiedUser",
                table: "Sponsors");

            migrationBuilder.DropIndex(
                name: "IX_SponsorProfile_CreatedUser",
                table: "SponsorProfile");

            migrationBuilder.DropIndex(
                name: "IX_SponsorProfile_ModifiedUser",
                table: "SponsorProfile");

            migrationBuilder.DropIndex(
                name: "IX_SponsorPayments_CreatedUser",
                table: "SponsorPayments");

            migrationBuilder.DropIndex(
                name: "IX_SponsorPayments_ModifiedUser",
                table: "SponsorPayments");

            migrationBuilder.DropIndex(
                name: "IX_ScheduleLocations_CreatedUser",
                table: "ScheduleLocations");

            migrationBuilder.DropIndex(
                name: "IX_ScheduleLocations_ModifiedUser",
                table: "ScheduleLocations");

            migrationBuilder.DropIndex(
                name: "IX_ScheduleDivTeams_CreatedUser",
                table: "ScheduleDivTeams");

            migrationBuilder.DropIndex(
                name: "IX_ScheduleDivTeams_ModifiedUser",
                table: "ScheduleDivTeams");

            migrationBuilder.DropIndex(
                name: "IX_Rolls_CreatedUser",
                table: "Rolls");

            migrationBuilder.DropIndex(
                name: "IX_Rolls_ModifiedUser",
                table: "Rolls");

            migrationBuilder.DropIndex(
                name: "IX_People_CreatedUser",
                table: "People");

            migrationBuilder.DropIndex(
                name: "IX_People_ModifiedUser",
                table: "People");

            migrationBuilder.DropIndex(
                name: "IX_Households_CreatedUser",
                table: "Households");

            migrationBuilder.DropIndex(
                name: "IX_Households_ModifiedUser",
                table: "Households");

            migrationBuilder.DropIndex(
                name: "IX_Directors_CreatedUser",
                table: "Directors");

            migrationBuilder.DropIndex(
                name: "IX_Directors_ModifiedUser",
                table: "Directors");

            migrationBuilder.DropIndex(
                name: "IX_Companies_CreatedUser",
                table: "Companies");

            migrationBuilder.DropIndex(
                name: "IX_Companies_ModifiedUser",
                table: "Companies");

            migrationBuilder.DropIndex(
                name: "IX_Colors_CreatedUser",
                table: "Colors");

            migrationBuilder.DropIndex(
                name: "IX_Colors_ModifiedUser",
                table: "Colors");

            migrationBuilder.DropIndex(
                name: "IX_Coaches_CreatedUser",
                table: "Coaches");

            migrationBuilder.DropIndex(
                name: "IX_Coaches_ModifiedUser",
                table: "Coaches");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "WebContentType");

            migrationBuilder.DropColumn(
                name: "CreatedUser",
                table: "WebContentType");

            migrationBuilder.DropColumn(
                name: "ModifiedDate",
                table: "WebContentType");

            migrationBuilder.DropColumn(
                name: "ModifiedUser",
                table: "WebContentType");

            migrationBuilder.DropColumn(
                name: "ModifiedDate",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ModifiedUser",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ModifiedDate",
                table: "Sponsors");

            migrationBuilder.DropColumn(
                name: "ModifiedUser",
                table: "Sponsors");

            migrationBuilder.DropColumn(
                name: "ModifiedDate",
                table: "SponsorProfile");

            migrationBuilder.DropColumn(
                name: "ModifiedUser",
                table: "SponsorProfile");

            migrationBuilder.DropColumn(
                name: "ModifiedDate",
                table: "SponsorPayments");

            migrationBuilder.DropColumn(
                name: "ModifiedUser",
                table: "SponsorPayments");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "ScheduleLocations");

            migrationBuilder.DropColumn(
                name: "CreatedUser",
                table: "ScheduleLocations");

            migrationBuilder.DropColumn(
                name: "ModifiedDate",
                table: "ScheduleLocations");

            migrationBuilder.DropColumn(
                name: "ModifiedUser",
                table: "ScheduleLocations");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "ScheduleDivTeams");

            migrationBuilder.DropColumn(
                name: "CreatedUser",
                table: "ScheduleDivTeams");

            migrationBuilder.DropColumn(
                name: "ModifiedDate",
                table: "ScheduleDivTeams");

            migrationBuilder.DropColumn(
                name: "ModifiedUser",
                table: "ScheduleDivTeams");

            migrationBuilder.DropColumn(
                name: "ModifiedDate",
                table: "Rolls");

            migrationBuilder.DropColumn(
                name: "ModifiedUser",
                table: "Rolls");

            migrationBuilder.DropColumn(
                name: "ModifiedDate",
                table: "People");

            migrationBuilder.DropColumn(
                name: "ModifiedUser",
                table: "People");

            migrationBuilder.DropColumn(
                name: "ModifiedDate",
                table: "Households");

            migrationBuilder.DropColumn(
                name: "ModifiedUser",
                table: "Households");

            migrationBuilder.DropColumn(
                name: "ModifiedDate",
                table: "Directors");

            migrationBuilder.DropColumn(
                name: "ModifiedUser",
                table: "Directors");

            migrationBuilder.DropColumn(
                name: "ModifiedDate",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "ModifiedUser",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "ModifiedDate",
                table: "Colors");

            migrationBuilder.DropColumn(
                name: "ModifiedUser",
                table: "Colors");

            migrationBuilder.DropColumn(
                name: "ModifiedDate",
                table: "Coaches");

            migrationBuilder.DropColumn(
                name: "ModifiedUser",
                table: "Coaches");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ModifiedDate",
                table: "WebContent",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 894, DateTimeKind.Local).AddTicks(1252),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 966, DateTimeKind.Local).AddTicks(8414));

            migrationBuilder.AlterColumn<string>(
                name: "CreatedUser",
                table: "Users",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Users",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 900, DateTimeKind.Local).AddTicks(319),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 973, DateTimeKind.Local).AddTicks(1714));

            migrationBuilder.AlterColumn<int>(
                name: "TeamColorID",
                table: "Teams",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Teams",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 877, DateTimeKind.Local).AddTicks(3832),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 950, DateTimeKind.Local).AddTicks(5777));

            migrationBuilder.AlterColumn<string>(
                name: "CreatedUser",
                table: "Sponsors",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Sponsors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 873, DateTimeKind.Local).AddTicks(6009),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 944, DateTimeKind.Local).AddTicks(9915));

            migrationBuilder.AlterColumn<string>(
                name: "CreatedUser",
                table: "SponsorProfile",
                type: "varchar(20)",
                unicode: false,
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorProfile",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 871, DateTimeKind.Local).AddTicks(1640),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 940, DateTimeKind.Local).AddTicks(217));

            migrationBuilder.AlterColumn<string>(
                name: "CreatedUser",
                table: "SponsorPayments",
                type: "varchar(20)",
                unicode: false,
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorPayments",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 868, DateTimeKind.Local).AddTicks(8535),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 935, DateTimeKind.Local).AddTicks(5796));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Seasons",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 862, DateTimeKind.Local).AddTicks(9511),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 929, DateTimeKind.Local).AddTicks(8833));

            migrationBuilder.AlterColumn<string>(
                name: "CreatedUser",
                table: "Rolls",
                type: "char(10)",
                unicode: false,
                fixedLength: true,
                maxLength: 10,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Rolls",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 833, DateTimeKind.Local).AddTicks(8776),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 882, DateTimeKind.Local).AddTicks(680));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Players",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 829, DateTimeKind.Local).AddTicks(7520),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 877, DateTimeKind.Local).AddTicks(7353));

            migrationBuilder.AlterColumn<string>(
                name: "CreatedUser",
                table: "People",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "People",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 823, DateTimeKind.Local).AddTicks(9541),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 867, DateTimeKind.Local).AddTicks(2604));

            migrationBuilder.AlterColumn<string>(
                name: "CreatedUser",
                table: "Households",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Households",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 820, DateTimeKind.Local).AddTicks(9165),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 861, DateTimeKind.Local).AddTicks(656));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Divisions",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 809, DateTimeKind.Local).AddTicks(7260),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 851, DateTimeKind.Local).AddTicks(3206));

            migrationBuilder.AlterColumn<string>(
                name: "CreatedUser",
                table: "Directors",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Directors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 806, DateTimeKind.Local).AddTicks(9427),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 846, DateTimeKind.Local).AddTicks(5457));

            migrationBuilder.AlterColumn<string>(
                name: "CreatedUser",
                table: "Companies",
                type: "varchar(20)",
                unicode: false,
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Companies",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 805, DateTimeKind.Local).AddTicks(8962),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 835, DateTimeKind.Local).AddTicks(4621));

            migrationBuilder.AlterColumn<string>(
                name: "CreatedUser",
                table: "Colors",
                type: "char(10)",
                unicode: false,
                fixedLength: true,
                maxLength: 10,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Colors",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 804, DateTimeKind.Local).AddTicks(7452),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 832, DateTimeKind.Local).AddTicks(4942));

            migrationBuilder.AlterColumn<string>(
                name: "CreatedUser",
                table: "Coaches",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Coaches",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 795, DateTimeKind.Local).AddTicks(8810),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 812, DateTimeKind.Local).AddTicks(4043));
        }
    }
}
