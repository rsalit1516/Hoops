using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hoops.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveCompanyIdFromDivPlayerTeam : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Guard each drop in case the column was already removed manually before migrations were applied.
            migrationBuilder.Sql("IF COL_LENGTH('[dbo].[Players]','CompanyID') IS NOT NULL ALTER TABLE [Players] DROP COLUMN [CompanyID]");
            migrationBuilder.Sql("IF COL_LENGTH('[dbo].[Divisions]','CompanyID') IS NOT NULL ALTER TABLE [Divisions] DROP COLUMN [CompanyID]");
            migrationBuilder.Sql("IF COL_LENGTH('[dbo].[Teams]','CompanyID') IS NOT NULL ALTER TABLE [Teams] DROP COLUMN [CompanyID]");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ModifiedDate",
                table: "WebContent",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 597, DateTimeKind.Local).AddTicks(6839),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 894, DateTimeKind.Local).AddTicks(1252));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Users",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 603, DateTimeKind.Local).AddTicks(8540),
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
                defaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 579, DateTimeKind.Local).AddTicks(2860),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 877, DateTimeKind.Local).AddTicks(3832));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Sponsors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 574, DateTimeKind.Local).AddTicks(9168),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 873, DateTimeKind.Local).AddTicks(6009));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorProfile",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 572, DateTimeKind.Local).AddTicks(2726),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 871, DateTimeKind.Local).AddTicks(1640));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorPayments",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 569, DateTimeKind.Local).AddTicks(5931),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 868, DateTimeKind.Local).AddTicks(8535));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Seasons",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 564, DateTimeKind.Local).AddTicks(1218),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 862, DateTimeKind.Local).AddTicks(9511));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Rolls",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 529, DateTimeKind.Local).AddTicks(1366),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 833, DateTimeKind.Local).AddTicks(8776));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Players",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 523, DateTimeKind.Local).AddTicks(4515),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 829, DateTimeKind.Local).AddTicks(7520));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "People",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 512, DateTimeKind.Local).AddTicks(8809),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 823, DateTimeKind.Local).AddTicks(9541));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Households",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 508, DateTimeKind.Local).AddTicks(6198),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 820, DateTimeKind.Local).AddTicks(9165));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Divisions",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 491, DateTimeKind.Local).AddTicks(6681),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 809, DateTimeKind.Local).AddTicks(7260));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Directors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 487, DateTimeKind.Local).AddTicks(6908),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 806, DateTimeKind.Local).AddTicks(9427));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Companies",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 486, DateTimeKind.Local).AddTicks(2803),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 805, DateTimeKind.Local).AddTicks(8962));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Colors",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 484, DateTimeKind.Local).AddTicks(5721),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 804, DateTimeKind.Local).AddTicks(7452));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Coaches",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 473, DateTimeKind.Local).AddTicks(702),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 795, DateTimeKind.Local).AddTicks(8810));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "ModifiedDate",
                table: "WebContent",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 894, DateTimeKind.Local).AddTicks(1252),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 597, DateTimeKind.Local).AddTicks(6839));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Users",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 900, DateTimeKind.Local).AddTicks(319),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 603, DateTimeKind.Local).AddTicks(8540));

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
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 579, DateTimeKind.Local).AddTicks(2860));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Sponsors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 873, DateTimeKind.Local).AddTicks(6009),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 574, DateTimeKind.Local).AddTicks(9168));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorProfile",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 871, DateTimeKind.Local).AddTicks(1640),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 572, DateTimeKind.Local).AddTicks(2726));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "SponsorPayments",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 868, DateTimeKind.Local).AddTicks(8535),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 569, DateTimeKind.Local).AddTicks(5931));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Seasons",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 862, DateTimeKind.Local).AddTicks(9511),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 564, DateTimeKind.Local).AddTicks(1218));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Rolls",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 833, DateTimeKind.Local).AddTicks(8776),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 529, DateTimeKind.Local).AddTicks(1366));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Players",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 829, DateTimeKind.Local).AddTicks(7520),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 523, DateTimeKind.Local).AddTicks(4515));

            migrationBuilder.AddColumn<int>(
                name: "CompanyID",
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
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 512, DateTimeKind.Local).AddTicks(8809));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Households",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 820, DateTimeKind.Local).AddTicks(9165),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 508, DateTimeKind.Local).AddTicks(6198));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Divisions",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 809, DateTimeKind.Local).AddTicks(7260),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 491, DateTimeKind.Local).AddTicks(6681));

            migrationBuilder.AddColumn<int>(
                name: "CompanyID",
                table: "Divisions",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CompanyID",
                table: "Teams",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Directors",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 806, DateTimeKind.Local).AddTicks(9427),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 487, DateTimeKind.Local).AddTicks(6908));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Companies",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 805, DateTimeKind.Local).AddTicks(8962),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 486, DateTimeKind.Local).AddTicks(2803));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Colors",
                type: "datetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 804, DateTimeKind.Local).AddTicks(7452),
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 484, DateTimeKind.Local).AddTicks(5721));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Coaches",
                type: "smalldatetime",
                nullable: true,
                defaultValue: new DateTime(2026, 4, 9, 18, 32, 57, 795, DateTimeKind.Local).AddTicks(8810),
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime",
                oldNullable: true,
                oldDefaultValue: new DateTime(2026, 6, 6, 11, 30, 2, 473, DateTimeKind.Local).AddTicks(702));
        }
    }
}
