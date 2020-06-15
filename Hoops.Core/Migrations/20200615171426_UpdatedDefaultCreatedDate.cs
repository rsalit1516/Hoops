using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Hoops.Core.Migrations
{
    public partial class UpdatedDefaultCreatedDate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "WebContentType",
                nullable: true,
                defaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 927, DateTimeKind.Local).AddTicks(4378),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2020, 6, 15, 12, 27, 4, 871, DateTimeKind.Local).AddTicks(2054));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "WebContent",
                nullable: true,
                defaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 926, DateTimeKind.Local).AddTicks(5317),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2020, 6, 15, 12, 27, 4, 870, DateTimeKind.Local).AddTicks(1894));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "User",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 858, DateTimeKind.Local).AddTicks(7218),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Team",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 856, DateTimeKind.Local).AddTicks(6501),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorProfile",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 844, DateTimeKind.Local).AddTicks(9421),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorPayment",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 842, DateTimeKind.Local).AddTicks(6107),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2020, 6, 15, 12, 27, 4, 775, DateTimeKind.Local).AddTicks(2947));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorFee",
                type: "smalldatetime",
                nullable: false,
                defaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 840, DateTimeKind.Local).AddTicks(6008),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldDefaultValue: new DateTime(2020, 6, 15, 12, 27, 4, 772, DateTimeKind.Local).AddTicks(8196));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Sponsor",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 851, DateTimeKind.Local).AddTicks(2415),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "ShoppingCart",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 837, DateTimeKind.Local).AddTicks(7544),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Season",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 835, DateTimeKind.Local).AddTicks(8434),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Role",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 822, DateTimeKind.Local).AddTicks(5738),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Player",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 821, DateTimeKind.Local).AddTicks(197),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Person",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 809, DateTimeKind.Local).AddTicks(3037),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "PayErrorLog",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 805, DateTimeKind.Local).AddTicks(2034),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Household",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 803, DateTimeKind.Local).AddTicks(5496),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Division",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 795, DateTimeKind.Local).AddTicks(3317),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Director",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 792, DateTimeKind.Local).AddTicks(9402),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2020, 6, 15, 12, 27, 4, 709, DateTimeKind.Local).AddTicks(5189));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Content",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 789, DateTimeKind.Local).AddTicks(1435),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Company",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 786, DateTimeKind.Local).AddTicks(8624),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Color",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 782, DateTimeKind.Local).AddTicks(2094),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Coach",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 773, DateTimeKind.Local).AddTicks(2038),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "WebContentType",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2020, 6, 15, 12, 27, 4, 871, DateTimeKind.Local).AddTicks(2054),
                oldClrType: typeof(DateTime),
                oldNullable: true,
                oldDefaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 927, DateTimeKind.Local).AddTicks(4378));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "WebContent",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2020, 6, 15, 12, 27, 4, 870, DateTimeKind.Local).AddTicks(1894),
                oldClrType: typeof(DateTime),
                oldNullable: true,
                oldDefaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 926, DateTimeKind.Local).AddTicks(5317));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "User",
                type: "smalldatetime",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 858, DateTimeKind.Local).AddTicks(7218));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Team",
                type: "smalldatetime",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 856, DateTimeKind.Local).AddTicks(6501));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorProfile",
                type: "smalldatetime",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 844, DateTimeKind.Local).AddTicks(9421));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorPayment",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2020, 6, 15, 12, 27, 4, 775, DateTimeKind.Local).AddTicks(2947),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 842, DateTimeKind.Local).AddTicks(6107));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorFee",
                type: "smalldatetime",
                nullable: false,
                defaultValue: new DateTime(2020, 6, 15, 12, 27, 4, 772, DateTimeKind.Local).AddTicks(8196),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldDefaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 840, DateTimeKind.Local).AddTicks(6008));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Sponsor",
                type: "smalldatetime",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 851, DateTimeKind.Local).AddTicks(2415));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "ShoppingCart",
                type: "datetime",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 837, DateTimeKind.Local).AddTicks(7544));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Season",
                type: "smalldatetime",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 835, DateTimeKind.Local).AddTicks(8434));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Role",
                type: "datetime",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 822, DateTimeKind.Local).AddTicks(5738));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Player",
                type: "smalldatetime",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 821, DateTimeKind.Local).AddTicks(197));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Person",
                type: "smalldatetime",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 809, DateTimeKind.Local).AddTicks(3037));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "PayErrorLog",
                type: "datetime",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 805, DateTimeKind.Local).AddTicks(2034));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Household",
                type: "smalldatetime",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 803, DateTimeKind.Local).AddTicks(5496));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Division",
                type: "smalldatetime",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 795, DateTimeKind.Local).AddTicks(3317));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Director",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2020, 6, 15, 12, 27, 4, 709, DateTimeKind.Local).AddTicks(5189),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 792, DateTimeKind.Local).AddTicks(9402));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Content",
                type: "datetime",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 789, DateTimeKind.Local).AddTicks(1435));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Company",
                type: "datetime",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 786, DateTimeKind.Local).AddTicks(8624));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Color",
                type: "datetime",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 782, DateTimeKind.Local).AddTicks(2094));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Coach",
                type: "smalldatetime",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2020, 6, 15, 13, 14, 25, 773, DateTimeKind.Local).AddTicks(2038));
        }
    }
}
