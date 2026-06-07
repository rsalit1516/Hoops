using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hoops.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveLegacyColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "idx_DCh_25_24_Players",
                table: "Players");

            migrationBuilder.DropIndex(
                name: "idx_DCh_8781_8780_Players",
                table: "Players");

            migrationBuilder.DropIndex(
                name: "idx_DCh_98394_98393_Players",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "Round1",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "Round2",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "Round3",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "Round4",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "Round5",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "Round6",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "Round7",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "Round8",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "TeamColor",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "Color1",
                table: "Sponsors");

            migrationBuilder.DropColumn(
                name: "Color2",
                table: "Sponsors");

            migrationBuilder.DropColumn(
                name: "Coach",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "Sponsor",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "TEMPID",
                table: "People");

            migrationBuilder.DropColumn(
                name: "TEMID",
                table: "Households");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ModifiedDate",
                table: "WebContent",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 414, DateTimeKind.Local).AddTicks(2886),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 894, DateTimeKind.Local).AddTicks(1252));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Users",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 422, DateTimeKind.Local).AddTicks(8567),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 900, DateTimeKind.Local).AddTicks(319));

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
                defaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 360, DateTimeKind.Local).AddTicks(9252),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 877, DateTimeKind.Local).AddTicks(3832));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Sponsors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 335, DateTimeKind.Local).AddTicks(8694),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 873, DateTimeKind.Local).AddTicks(6009));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorProfile",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 330, DateTimeKind.Local).AddTicks(9317),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 871, DateTimeKind.Local).AddTicks(1640));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorPayments",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 324, DateTimeKind.Local).AddTicks(2177),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 868, DateTimeKind.Local).AddTicks(8535));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Seasons",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 311, DateTimeKind.Local).AddTicks(2461),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 862, DateTimeKind.Local).AddTicks(9511));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Rolls",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 240, DateTimeKind.Local).AddTicks(5453),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 833, DateTimeKind.Local).AddTicks(8776));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Players",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 229, DateTimeKind.Local).AddTicks(4614),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 829, DateTimeKind.Local).AddTicks(7520));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "People",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 216, DateTimeKind.Local).AddTicks(7735),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 823, DateTimeKind.Local).AddTicks(9541));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Households",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 205, DateTimeKind.Local).AddTicks(5285),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 820, DateTimeKind.Local).AddTicks(9165));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Divisions",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 175, DateTimeKind.Local).AddTicks(8416),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 809, DateTimeKind.Local).AddTicks(7260));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Directors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 168, DateTimeKind.Local).AddTicks(6408),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 806, DateTimeKind.Local).AddTicks(9427));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Companies",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 165, DateTimeKind.Local).AddTicks(9438),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 805, DateTimeKind.Local).AddTicks(8962));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Colors",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 163, DateTimeKind.Local).AddTicks(5469),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 804, DateTimeKind.Local).AddTicks(7452));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Coaches",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 147, DateTimeKind.Local).AddTicks(2645),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 795, DateTimeKind.Local).AddTicks(8810));

            migrationBuilder.RenameColumn(
                name: "CreatedUSer",
                table: "Comments",
                newName: "CreatedUser");

            migrationBuilder.CreateIndex(
                name: "IX_Players_SeasonID",
                table: "Players",
                column: "SeasonID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Players_SeasonID",
                table: "Players");

            migrationBuilder.RenameColumn(
                name: "CreatedUser",
                table: "Comments",
                newName: "CreatedUSer");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ModifiedDate",
                table: "WebContent",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 894, DateTimeKind.Local).AddTicks(1252),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 414, DateTimeKind.Local).AddTicks(2886));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Users",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 900, DateTimeKind.Local).AddTicks(319),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 422, DateTimeKind.Local).AddTicks(8567));

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
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 360, DateTimeKind.Local).AddTicks(9252));

            migrationBuilder.AddColumn<int>(
                name: "Round1",
                table: "Teams",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Round2",
                table: "Teams",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Round3",
                table: "Teams",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Round4",
                table: "Teams",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Round5",
                table: "Teams",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Round6",
                table: "Teams",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Round7",
                table: "Teams",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Round8",
                table: "Teams",
                type: "int",
                nullable: true);

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
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 873, DateTimeKind.Local).AddTicks(6009),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 335, DateTimeKind.Local).AddTicks(8694));

            migrationBuilder.AddColumn<string>(
                name: "Color1",
                table: "Sponsors",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Color2",
                table: "Sponsors",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorProfile",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 871, DateTimeKind.Local).AddTicks(1640),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 330, DateTimeKind.Local).AddTicks(9317));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorPayments",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 868, DateTimeKind.Local).AddTicks(8535),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 324, DateTimeKind.Local).AddTicks(2177));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Seasons",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 862, DateTimeKind.Local).AddTicks(9511),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 311, DateTimeKind.Local).AddTicks(2461));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Rolls",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 833, DateTimeKind.Local).AddTicks(8776),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 240, DateTimeKind.Local).AddTicks(5453));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Players",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 829, DateTimeKind.Local).AddTicks(7520),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 229, DateTimeKind.Local).AddTicks(4614));

            migrationBuilder.AddColumn<int>(
                name: "Coach",
                table: "Players",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Sponsor",
                table: "Players",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "People",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 823, DateTimeKind.Local).AddTicks(9541),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 216, DateTimeKind.Local).AddTicks(7735));

            migrationBuilder.AddColumn<int>(
                name: "TEMPID",
                table: "People",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Households",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 820, DateTimeKind.Local).AddTicks(9165),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 205, DateTimeKind.Local).AddTicks(5285));

            migrationBuilder.AddColumn<int>(
                name: "TEMID",
                table: "Households",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Divisions",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 809, DateTimeKind.Local).AddTicks(7260),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 175, DateTimeKind.Local).AddTicks(8416));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Directors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 806, DateTimeKind.Local).AddTicks(9427),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 168, DateTimeKind.Local).AddTicks(6408));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Companies",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 805, DateTimeKind.Local).AddTicks(8962),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 165, DateTimeKind.Local).AddTicks(9438));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Colors",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 804, DateTimeKind.Local).AddTicks(7452),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 163, DateTimeKind.Local).AddTicks(5469));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Coaches",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 795, DateTimeKind.Local).AddTicks(8810),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 22, 26, 147, DateTimeKind.Local).AddTicks(2645));

            migrationBuilder.CreateIndex(
                name: "idx_DCh_25_24_Players",
                table: "Players",
                columns: new[] { "PlayerID", "DivisionID", "Coach", "Sponsor", "SeasonID" });

            migrationBuilder.CreateIndex(
                name: "idx_DCh_8781_8780_Players",
                table: "Players",
                columns: new[] { "SeasonID", "PayType", "Sponsor" });

            migrationBuilder.CreateIndex(
                name: "idx_DCh_98394_98393_Players",
                table: "Players",
                columns: new[] { "Coach", "Sponsor", "SeasonID" });
        }
    }
}
