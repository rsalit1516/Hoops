using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hoops.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE [Seasons] SET [CreatedUser] = NULL WHERE [CreatedUser] IS NOT NULL AND TRY_CONVERT(int, [CreatedUser]) IS NULL;");
            migrationBuilder.Sql("UPDATE [Divisions] SET [CreatedUser] = NULL WHERE [CreatedUser] IS NOT NULL AND TRY_CONVERT(int, [CreatedUser]) IS NULL;");
            migrationBuilder.Sql("UPDATE [Teams] SET [CreatedUser] = NULL WHERE [CreatedUser] IS NOT NULL AND TRY_CONVERT(int, [CreatedUser]) IS NULL;");
            migrationBuilder.Sql("UPDATE [Players] SET [CreatedUser] = NULL WHERE [CreatedUser] IS NOT NULL AND TRY_CONVERT(int, [CreatedUser]) IS NULL;");

            migrationBuilder.AlterColumn<int>(
                name: "CreatedUser",
                table: "Seasons",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedDate",
                table: "Seasons",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedUser",
                table: "Seasons",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CreatedUser",
                table: "Divisions",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedDate",
                table: "Divisions",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedUser",
                table: "Divisions",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CreatedUser",
                table: "Teams",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedDate",
                table: "Teams",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedUser",
                table: "Teams",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CreatedUser",
                table: "Players",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedDate",
                table: "Players",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedUser",
                table: "Players",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "ScheduleGames",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedUser",
                table: "ScheduleGames",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedDate",
                table: "ScheduleGames",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedUser",
                table: "ScheduleGames",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "SchedulePlayoffs",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedUser",
                table: "SchedulePlayoffs",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedDate",
                table: "SchedulePlayoffs",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedUser",
                table: "SchedulePlayoffs",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "WebContent",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedUser",
                table: "WebContent",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Seasons_CreatedUser",
                table: "Seasons",
                column: "CreatedUser");

            migrationBuilder.CreateIndex(
                name: "IX_Seasons_ModifiedUser",
                table: "Seasons",
                column: "ModifiedUser");

            migrationBuilder.CreateIndex(
                name: "IX_Divisions_CreatedUser",
                table: "Divisions",
                column: "CreatedUser");

            migrationBuilder.CreateIndex(
                name: "IX_Divisions_ModifiedUser",
                table: "Divisions",
                column: "ModifiedUser");

            migrationBuilder.CreateIndex(
                name: "IX_Teams_CreatedUser",
                table: "Teams",
                column: "CreatedUser");

            migrationBuilder.CreateIndex(
                name: "IX_Teams_ModifiedUser",
                table: "Teams",
                column: "ModifiedUser");

            migrationBuilder.CreateIndex(
                name: "IX_Players_CreatedUser",
                table: "Players",
                column: "CreatedUser");

            migrationBuilder.CreateIndex(
                name: "IX_Players_ModifiedUser",
                table: "Players",
                column: "ModifiedUser");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleGames_CreatedUser",
                table: "ScheduleGames",
                column: "CreatedUser");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleGames_ModifiedUser",
                table: "ScheduleGames",
                column: "ModifiedUser");

            migrationBuilder.CreateIndex(
                name: "IX_SchedulePlayoffs_CreatedUser",
                table: "SchedulePlayoffs",
                column: "CreatedUser");

            migrationBuilder.CreateIndex(
                name: "IX_SchedulePlayoffs_ModifiedUser",
                table: "SchedulePlayoffs",
                column: "ModifiedUser");

            migrationBuilder.CreateIndex(
                name: "IX_WebContent_CreatedUser",
                table: "WebContent",
                column: "CreatedUser");

            migrationBuilder.CreateIndex(
                name: "IX_WebContent_ModifiedUser",
                table: "WebContent",
                column: "ModifiedUser");

            migrationBuilder.AddForeignKey(
                name: "FK_Seasons_Users_CreatedUser",
                table: "Seasons",
                column: "CreatedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Seasons_Users_ModifiedUser",
                table: "Seasons",
                column: "ModifiedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Divisions_Users_CreatedUser",
                table: "Divisions",
                column: "CreatedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Divisions_Users_ModifiedUser",
                table: "Divisions",
                column: "ModifiedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Teams_Users_CreatedUser",
                table: "Teams",
                column: "CreatedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Teams_Users_ModifiedUser",
                table: "Teams",
                column: "ModifiedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Players_Users_CreatedUser",
                table: "Players",
                column: "CreatedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Players_Users_ModifiedUser",
                table: "Players",
                column: "ModifiedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_ScheduleGames_Users_CreatedUser",
                table: "ScheduleGames",
                column: "CreatedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_ScheduleGames_Users_ModifiedUser",
                table: "ScheduleGames",
                column: "ModifiedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_SchedulePlayoffs_Users_CreatedUser",
                table: "SchedulePlayoffs",
                column: "CreatedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_SchedulePlayoffs_Users_ModifiedUser",
                table: "SchedulePlayoffs",
                column: "ModifiedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_WebContent_Users_CreatedUser",
                table: "WebContent",
                column: "CreatedUser",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_WebContent_Users_ModifiedUser",
                table: "WebContent",
                column: "ModifiedUser",
                principalTable: "Users",
                principalColumn: "UserID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_Seasons_Users_CreatedUser", table: "Seasons");
            migrationBuilder.DropForeignKey(name: "FK_Seasons_Users_ModifiedUser", table: "Seasons");
            migrationBuilder.DropForeignKey(name: "FK_Divisions_Users_CreatedUser", table: "Divisions");
            migrationBuilder.DropForeignKey(name: "FK_Divisions_Users_ModifiedUser", table: "Divisions");
            migrationBuilder.DropForeignKey(name: "FK_Teams_Users_CreatedUser", table: "Teams");
            migrationBuilder.DropForeignKey(name: "FK_Teams_Users_ModifiedUser", table: "Teams");
            migrationBuilder.DropForeignKey(name: "FK_Players_Users_CreatedUser", table: "Players");
            migrationBuilder.DropForeignKey(name: "FK_Players_Users_ModifiedUser", table: "Players");
            migrationBuilder.DropForeignKey(name: "FK_ScheduleGames_Users_CreatedUser", table: "ScheduleGames");
            migrationBuilder.DropForeignKey(name: "FK_ScheduleGames_Users_ModifiedUser", table: "ScheduleGames");
            migrationBuilder.DropForeignKey(name: "FK_SchedulePlayoffs_Users_CreatedUser", table: "SchedulePlayoffs");
            migrationBuilder.DropForeignKey(name: "FK_SchedulePlayoffs_Users_ModifiedUser", table: "SchedulePlayoffs");
            migrationBuilder.DropForeignKey(name: "FK_WebContent_Users_CreatedUser", table: "WebContent");
            migrationBuilder.DropForeignKey(name: "FK_WebContent_Users_ModifiedUser", table: "WebContent");

            migrationBuilder.DropIndex(name: "IX_Seasons_CreatedUser", table: "Seasons");
            migrationBuilder.DropIndex(name: "IX_Seasons_ModifiedUser", table: "Seasons");
            migrationBuilder.DropIndex(name: "IX_Divisions_CreatedUser", table: "Divisions");
            migrationBuilder.DropIndex(name: "IX_Divisions_ModifiedUser", table: "Divisions");
            migrationBuilder.DropIndex(name: "IX_Teams_CreatedUser", table: "Teams");
            migrationBuilder.DropIndex(name: "IX_Teams_ModifiedUser", table: "Teams");
            migrationBuilder.DropIndex(name: "IX_Players_CreatedUser", table: "Players");
            migrationBuilder.DropIndex(name: "IX_Players_ModifiedUser", table: "Players");
            migrationBuilder.DropIndex(name: "IX_ScheduleGames_CreatedUser", table: "ScheduleGames");
            migrationBuilder.DropIndex(name: "IX_ScheduleGames_ModifiedUser", table: "ScheduleGames");
            migrationBuilder.DropIndex(name: "IX_SchedulePlayoffs_CreatedUser", table: "SchedulePlayoffs");
            migrationBuilder.DropIndex(name: "IX_SchedulePlayoffs_ModifiedUser", table: "SchedulePlayoffs");
            migrationBuilder.DropIndex(name: "IX_WebContent_CreatedUser", table: "WebContent");
            migrationBuilder.DropIndex(name: "IX_WebContent_ModifiedUser", table: "WebContent");

            migrationBuilder.DropColumn(name: "ModifiedDate", table: "Seasons");
            migrationBuilder.DropColumn(name: "ModifiedUser", table: "Seasons");
            migrationBuilder.DropColumn(name: "ModifiedDate", table: "Divisions");
            migrationBuilder.DropColumn(name: "ModifiedUser", table: "Divisions");
            migrationBuilder.DropColumn(name: "ModifiedDate", table: "Teams");
            migrationBuilder.DropColumn(name: "ModifiedUser", table: "Teams");
            migrationBuilder.DropColumn(name: "ModifiedDate", table: "Players");
            migrationBuilder.DropColumn(name: "ModifiedUser", table: "Players");

            migrationBuilder.DropColumn(name: "CreatedDate", table: "ScheduleGames");
            migrationBuilder.DropColumn(name: "CreatedUser", table: "ScheduleGames");
            migrationBuilder.DropColumn(name: "ModifiedDate", table: "ScheduleGames");
            migrationBuilder.DropColumn(name: "ModifiedUser", table: "ScheduleGames");

            migrationBuilder.DropColumn(name: "CreatedDate", table: "SchedulePlayoffs");
            migrationBuilder.DropColumn(name: "CreatedUser", table: "SchedulePlayoffs");
            migrationBuilder.DropColumn(name: "ModifiedDate", table: "SchedulePlayoffs");
            migrationBuilder.DropColumn(name: "ModifiedUser", table: "SchedulePlayoffs");

            migrationBuilder.DropColumn(name: "CreatedDate", table: "WebContent");
            migrationBuilder.DropColumn(name: "CreatedUser", table: "WebContent");

            migrationBuilder.AlterColumn<string>(
                name: "CreatedUser",
                table: "Seasons",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedUser",
                table: "Divisions",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedUser",
                table: "Teams",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedUser",
                table: "Players",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
