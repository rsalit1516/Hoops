using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hoops.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class IgnoreTempIdMapping : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Both already applied to local DBs via RemoveLegacyColumns; guard so the migration is idempotent.
            migrationBuilder.Sql("IF COL_LENGTH('[dbo].[Teams]','TeamColor') IS NOT NULL ALTER TABLE [Teams] DROP COLUMN [TeamColor]");
            migrationBuilder.Sql("IF EXISTS(SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('[dbo].[Comments]') AND name='CreatedUSer') EXEC sp_rename '[dbo].[Comments].[CreatedUSer]', 'CreatedUser', 'COLUMN'"
            );

            migrationBuilder.AlterColumn<DateTime>(
                name: "ModifiedDate",
                table: "WebContent",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 306, DateTimeKind.Local).AddTicks(6750),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 966, DateTimeKind.Local).AddTicks(8414));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Users",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 320, DateTimeKind.Local).AddTicks(7713),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 973, DateTimeKind.Local).AddTicks(1714));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Teams",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 279, DateTimeKind.Local).AddTicks(6521),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 950, DateTimeKind.Local).AddTicks(5777));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Sponsors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 265, DateTimeKind.Local).AddTicks(3966),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 944, DateTimeKind.Local).AddTicks(9915));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorProfile",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 255, DateTimeKind.Local).AddTicks(7421),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 940, DateTimeKind.Local).AddTicks(217));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorPayments",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 247, DateTimeKind.Local).AddTicks(8632),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 935, DateTimeKind.Local).AddTicks(5796));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Seasons",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 241, DateTimeKind.Local).AddTicks(2495),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 929, DateTimeKind.Local).AddTicks(8833));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Rolls",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 169, DateTimeKind.Local).AddTicks(4472),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 882, DateTimeKind.Local).AddTicks(680));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Players",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 162, DateTimeKind.Local).AddTicks(8554),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 877, DateTimeKind.Local).AddTicks(7353));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "People",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 145, DateTimeKind.Local).AddTicks(1254),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 867, DateTimeKind.Local).AddTicks(2604));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Households",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 137, DateTimeKind.Local).AddTicks(3297),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 861, DateTimeKind.Local).AddTicks(656));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Divisions",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 119, DateTimeKind.Local).AddTicks(359),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 851, DateTimeKind.Local).AddTicks(3206));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Directors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 112, DateTimeKind.Local).AddTicks(6044),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 846, DateTimeKind.Local).AddTicks(5457));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Companies",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 91, DateTimeKind.Local).AddTicks(5544),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 835, DateTimeKind.Local).AddTicks(4621));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Colors",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 88, DateTimeKind.Local).AddTicks(1552),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 832, DateTimeKind.Local).AddTicks(4942));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Coaches",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 65, DateTimeKind.Local).AddTicks(5174),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 812, DateTimeKind.Local).AddTicks(4043));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CreatedUser",
                table: "Comments",
                newName: "CreatedUSer");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ModifiedDate",
                table: "WebContent",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 966, DateTimeKind.Local).AddTicks(8414),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 306, DateTimeKind.Local).AddTicks(6750));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Users",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 973, DateTimeKind.Local).AddTicks(1714),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 320, DateTimeKind.Local).AddTicks(7713));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Teams",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 950, DateTimeKind.Local).AddTicks(5777),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 279, DateTimeKind.Local).AddTicks(6521));

            migrationBuilder.AddColumn<string>(
                name: "TeamColor",
                table: "Teams",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Sponsors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 944, DateTimeKind.Local).AddTicks(9915),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 265, DateTimeKind.Local).AddTicks(3966));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorProfile",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 940, DateTimeKind.Local).AddTicks(217),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 255, DateTimeKind.Local).AddTicks(7421));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorPayments",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 935, DateTimeKind.Local).AddTicks(5796),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 247, DateTimeKind.Local).AddTicks(8632));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Seasons",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 929, DateTimeKind.Local).AddTicks(8833),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 241, DateTimeKind.Local).AddTicks(2495));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Rolls",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 882, DateTimeKind.Local).AddTicks(680),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 169, DateTimeKind.Local).AddTicks(4472));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Players",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 877, DateTimeKind.Local).AddTicks(7353),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 162, DateTimeKind.Local).AddTicks(8554));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "People",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 867, DateTimeKind.Local).AddTicks(2604),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 145, DateTimeKind.Local).AddTicks(1254));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Households",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 861, DateTimeKind.Local).AddTicks(656),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 137, DateTimeKind.Local).AddTicks(3297));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Divisions",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 851, DateTimeKind.Local).AddTicks(3206),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 119, DateTimeKind.Local).AddTicks(359));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Directors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 846, DateTimeKind.Local).AddTicks(5457),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 112, DateTimeKind.Local).AddTicks(6044));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Companies",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 835, DateTimeKind.Local).AddTicks(4621),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 91, DateTimeKind.Local).AddTicks(5544));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Colors",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 832, DateTimeKind.Local).AddTicks(4942),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 88, DateTimeKind.Local).AddTicks(1552));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Coaches",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 50, 44, 812, DateTimeKind.Local).AddTicks(4043),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 12, 17, 10, 52, 65, DateTimeKind.Local).AddTicks(5174));
        }
    }
}
