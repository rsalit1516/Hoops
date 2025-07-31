using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hoops.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SchedulePlayoffCustomRestructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Custom SQL to restructure SchedulePlayoffs table
            migrationBuilder.Sql(@"
                -- Create a backup of existing data
                IF OBJECT_ID('tempdb..#SchedulePlayoffsBackup') IS NOT NULL
                    DROP TABLE #SchedulePlayoffsBackup;
                
                SELECT * INTO #SchedulePlayoffsBackup FROM SchedulePlayoffs;
                
                -- Drop the existing table
                DROP TABLE SchedulePlayoffs;
                
                -- Recreate the table with correct structure
                CREATE TABLE SchedulePlayoffs (
                    SchedulePlayoffID int IDENTITY(1,1) NOT NULL,
                    ScheduleNumber int NOT NULL,
                    SeasonID int NULL,
                    DivisionID int NULL,
                    Week int NULL,
                    GameDate datetime NULL,
                    GameTime nvarchar(20) NULL,
                    HomeTeam nvarchar(10) NULL,
                    VisitingTeam nvarchar(10) NULL,
                    LocationID int NULL,
                    Round int NULL,
                    Descr nvarchar(50) NULL,
                    CONSTRAINT PK_SchedulePlayoffs PRIMARY KEY CLUSTERED (SchedulePlayoffID ASC)
                );
                
                -- Restore the data (if any exists)
                IF EXISTS (SELECT 1 FROM tempdb.INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '#SchedulePlayoffsBackup')
                BEGIN
                    INSERT INTO SchedulePlayoffs (ScheduleNumber, SeasonID, DivisionID, Week, GameDate, GameTime, HomeTeam, VisitingTeam, LocationID, Round, Descr)
                    SELECT ScheduleNumber, SeasonID, DivisionID, Week, GameDate, GameTime, HomeTeam, VisitingTeam, LocationID, Round, Descr
                    FROM #SchedulePlayoffsBackup;
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // To rollback, we'd need to recreate the old structure
            migrationBuilder.Sql(@"
                -- Create a backup of existing data
                IF OBJECT_ID('tempdb..#SchedulePlayoffsBackup') IS NOT NULL
                    DROP TABLE #SchedulePlayoffsBackup;
                
                SELECT * INTO #SchedulePlayoffsBackup FROM SchedulePlayoffs;
                
                -- Drop the existing table
                DROP TABLE SchedulePlayoffs;
                
                -- Recreate the table with old structure (ScheduleNumber as identity)
                CREATE TABLE SchedulePlayoffs (
                    ScheduleNumber int IDENTITY(1,1) NOT NULL,
                    SeasonID int NULL,
                    DivisionID int NULL,
                    Week int NULL,
                    GameDate datetime2 NULL,
                    GameTime nvarchar(max) NULL,
                    HomeTeam nvarchar(max) NULL,
                    VisitingTeam nvarchar(max) NULL,
                    LocationID int NULL,
                    Round int NULL,
                    Descr nvarchar(max) NULL,
                    CONSTRAINT PK_SchedulePlayoffs PRIMARY KEY CLUSTERED (ScheduleNumber ASC)
                );
                
                -- Restore the data (if any exists)
                IF EXISTS (SELECT 1 FROM tempdb.INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '#SchedulePlayoffsBackup')
                BEGIN
                    INSERT INTO SchedulePlayoffs (SeasonID, DivisionID, Week, GameDate, GameTime, HomeTeam, VisitingTeam, LocationID, Round, Descr)
                    SELECT SeasonID, DivisionID, Week, GameDate, GameTime, HomeTeam, VisitingTeam, LocationID, Round, Descr
                    FROM #SchedulePlayoffsBackup;
                END
            ");
        }
    }
}
