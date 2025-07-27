using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hoops.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixLocationIdentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "ModifiedDate",
                table: "WebContent",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 728, DateTimeKind.Local).AddTicks(3171),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 498, DateTimeKind.Local).AddTicks(8909));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Users",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 730, DateTimeKind.Local).AddTicks(4659),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 500, DateTimeKind.Local).AddTicks(9891));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Teams",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 714, DateTimeKind.Local).AddTicks(4967),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 485, DateTimeKind.Local).AddTicks(2254));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Sponsors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 710, DateTimeKind.Local).AddTicks(3966),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 481, DateTimeKind.Local).AddTicks(8689));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorProfile",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 707, DateTimeKind.Local).AddTicks(1756),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 479, DateTimeKind.Local).AddTicks(9329));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorPayment",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 703, DateTimeKind.Local).AddTicks(2271),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 477, DateTimeKind.Local).AddTicks(4586));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorFee",
                type: "smalldatetime",
                nullable: false,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 701, DateTimeKind.Local).AddTicks(1912),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 475, DateTimeKind.Local).AddTicks(6712));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Seasons",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 699, DateTimeKind.Local).AddTicks(2000),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 472, DateTimeKind.Local).AddTicks(6317));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Rolls",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 675, DateTimeKind.Local).AddTicks(5900),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 452, DateTimeKind.Local).AddTicks(1927));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Player",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 674, DateTimeKind.Local).AddTicks(541),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 450, DateTimeKind.Local).AddTicks(9257));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "People",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 664, DateTimeKind.Local).AddTicks(387),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 442, DateTimeKind.Local).AddTicks(2519));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Households",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 660, DateTimeKind.Local).AddTicks(3155),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 436, DateTimeKind.Local).AddTicks(9392));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Divisions",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 647, DateTimeKind.Local).AddTicks(647),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 425, DateTimeKind.Local).AddTicks(7191));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Directors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 643, DateTimeKind.Local).AddTicks(7277),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 420, DateTimeKind.Local).AddTicks(9137));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Company",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 642, DateTimeKind.Local).AddTicks(3073),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 419, DateTimeKind.Local).AddTicks(8580));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Colors",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 640, DateTimeKind.Local).AddTicks(7348),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 418, DateTimeKind.Local).AddTicks(6723));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Coach",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 630, DateTimeKind.Local).AddTicks(5464),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 411, DateTimeKind.Local).AddTicks(8445));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 7, 25, 9, 32, 13, 730, DateTimeKind.Local).AddTicks(4659));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "ModifiedDate",
                table: "WebContent",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 498, DateTimeKind.Local).AddTicks(8909),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 728, DateTimeKind.Local).AddTicks(3171));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Users",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 500, DateTimeKind.Local).AddTicks(9891),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 730, DateTimeKind.Local).AddTicks(4659));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Teams",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 485, DateTimeKind.Local).AddTicks(2254),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 714, DateTimeKind.Local).AddTicks(4967));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Sponsors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 481, DateTimeKind.Local).AddTicks(8689),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 710, DateTimeKind.Local).AddTicks(3966));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorProfile",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 479, DateTimeKind.Local).AddTicks(9329),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 707, DateTimeKind.Local).AddTicks(1756));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorPayment",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 477, DateTimeKind.Local).AddTicks(4586),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 703, DateTimeKind.Local).AddTicks(2271));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorFee",
                type: "smalldatetime",
                nullable: false,
                defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 475, DateTimeKind.Local).AddTicks(6712),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 701, DateTimeKind.Local).AddTicks(1912));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Seasons",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 472, DateTimeKind.Local).AddTicks(6317),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 699, DateTimeKind.Local).AddTicks(2000));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Rolls",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 452, DateTimeKind.Local).AddTicks(1927),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 675, DateTimeKind.Local).AddTicks(5900));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Player",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 450, DateTimeKind.Local).AddTicks(9257),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 674, DateTimeKind.Local).AddTicks(541));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "People",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 442, DateTimeKind.Local).AddTicks(2519),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 664, DateTimeKind.Local).AddTicks(387));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Households",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 436, DateTimeKind.Local).AddTicks(9392),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 660, DateTimeKind.Local).AddTicks(3155));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Divisions",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 425, DateTimeKind.Local).AddTicks(7191),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 647, DateTimeKind.Local).AddTicks(647));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Directors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 420, DateTimeKind.Local).AddTicks(9137),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 643, DateTimeKind.Local).AddTicks(7277));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Company",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 419, DateTimeKind.Local).AddTicks(8580),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 642, DateTimeKind.Local).AddTicks(3073));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Colors",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 418, DateTimeKind.Local).AddTicks(6723),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 640, DateTimeKind.Local).AddTicks(7348));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Coach",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2025, 7, 25, 9, 21, 30, 411, DateTimeKind.Local).AddTicks(8445),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 7, 25, 9, 32, 13, 630, DateTimeKind.Local).AddTicks(5464));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 7, 25, 9, 21, 30, 500, DateTimeKind.Local).AddTicks(9891));
        }
    }
}
