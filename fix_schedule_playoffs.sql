IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[SchedulePlayoffs]') AND name = 'SchedulePlayoffID')
BEGIN
    PRINT 'Fixing SchedulePlayoffs table structure...';

    -- Backup existing data
    IF OBJECT_ID('tempdb..#SchedulePlayoffsBackup') IS NOT NULL
        DROP TABLE #SchedulePlayoffsBackup;

    SELECT * INTO #SchedulePlayoffsBackup FROM SchedulePlayoffs;
    PRINT 'Backed up existing data';

    -- Drop and recreate table with correct structure
    DROP TABLE SchedulePlayoffs;
    PRINT 'Dropped old table';

    CREATE TABLE SchedulePlayoffs (
        SchedulePlayoffID int IDENTITY(1,1) NOT NULL,
        ScheduleNumber int NOT NULL,
        GameNumber int NOT NULL,
        LocationNumber int NULL,
        GameDate datetime2 NULL,
        GameTime nvarchar(max) NULL,
        HomeTeam nvarchar(max) NULL,
        VisitingTeam nvarchar(max) NULL,
        Descr nvarchar(max) NULL,
        HomeTeamScore int NULL,
        VisitingTeamScore int NULL,
        DivisionId int NOT NULL,
        CONSTRAINT PK_SchedulePlayoffs PRIMARY KEY CLUSTERED (SchedulePlayoffID ASC)
    );
    PRINT 'Created new table structure';

    CREATE UNIQUE INDEX UQ_SchedulePlayoffs_Schedule_Game ON SchedulePlayoffs (ScheduleNumber, GameNumber);
    PRINT 'Created unique index';

    -- Restore data if it exists
    IF EXISTS (SELECT 1 FROM tempdb.INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE '#SchedulePlayoffsBackup%')
    BEGIN
        INSERT INTO SchedulePlayoffs (ScheduleNumber, GameNumber, LocationNumber, GameDate, GameTime, HomeTeam, VisitingTeam, Descr, HomeTeamScore, VisitingTeamScore, DivisionId)
        SELECT ScheduleNumber, GameNumber, LocationNumber, GameDate, GameTime, HomeTeam, VisitingTeam, Descr, HomeTeamScore, VisitingTeamScore, DivisionId
        FROM #SchedulePlayoffsBackup;
        PRINT 'Restored data';
    END

    PRINT 'SchedulePlayoffs table fix completed successfully!';
END
ELSE
BEGIN
    PRINT 'SchedulePlayoffs table already has SchedulePlayoffID column - no changes needed';
END
GO
