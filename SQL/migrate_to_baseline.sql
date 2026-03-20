-- Migration script to transform production database to match EF Core baseline
-- Run this BEFORE seeding __EFMigrationsHistory

-- ============================================
-- 1. Alter Players.PayType from nvarchar(5) to nvarchar(20)
-- ============================================
ALTER TABLE Players ALTER COLUMN PayType NVARCHAR(20);
PRINT 'Updated Players.PayType to NVARCHAR(20)';

-- ============================================
-- 2. Restructure SchedulePlayoffs table
--    - Add SchedulePlayoffID as identity primary key
--    - Keep existing data
-- ============================================

-- Check if SchedulePlayoffID already exists
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
               WHERE TABLE_NAME = 'SchedulePlayoffs' AND COLUMN_NAME = 'SchedulePlayoffID')
BEGIN
    -- Backup existing data
    SELECT * INTO #SchedulePlayoffs_Backup FROM SchedulePlayoffs;

    -- Drop existing primary key constraint (if exists)
    DECLARE @pkName NVARCHAR(255);
    SELECT @pkName = name FROM sys.key_constraints
    WHERE parent_object_id = OBJECT_ID('SchedulePlayoffs') AND type = 'PK';

    IF @pkName IS NOT NULL
    BEGIN
        EXEC('ALTER TABLE SchedulePlayoffs DROP CONSTRAINT ' + @pkName);
    END

    -- Drop the existing table
    DROP TABLE SchedulePlayoffs;

    -- Recreate with new structure
    CREATE TABLE SchedulePlayoffs (
        SchedulePlayoffID int IDENTITY(1,1) NOT NULL,
        ScheduleNumber int NOT NULL,
        GameNumber int NOT NULL,
        LocationNumber int NULL,
        GameDate datetime2 NULL,
        GameTime nvarchar(max) NULL,
        VisitingTeam nvarchar(max) NULL,
        HomeTeam nvarchar(max) NULL,
        Descr nvarchar(max) NULL,
        VisitingTeamScore int NULL,
        HomeTeamScore int NULL,
        DivisionId int NULL,  -- Allow NULL to preserve existing data
        CONSTRAINT PK_SchedulePlayoffs PRIMARY KEY CLUSTERED (SchedulePlayoffID ASC)
    );

    -- Restore data (SchedulePlayoffID will be auto-generated)
    INSERT INTO SchedulePlayoffs (ScheduleNumber, GameNumber, LocationNumber, GameDate, GameTime,
                                   VisitingTeam, HomeTeam, Descr, VisitingTeamScore, HomeTeamScore, DivisionId)
    SELECT ScheduleNumber, GameNumber, LocationNumber, GameDate, GameTime,
           VisitingTeam, HomeTeam, Descr, VisitingTeamScore, HomeTeamScore, DivisionId
    FROM #SchedulePlayoffs_Backup;

    -- Add unique constraint on ScheduleNumber + GameNumber
    CREATE UNIQUE INDEX UQ_SchedulePlayoffs_Schedule_Game
    ON SchedulePlayoffs (ScheduleNumber, GameNumber);

    -- Clean up
    DROP TABLE #SchedulePlayoffs_Backup;

    PRINT 'Restructured SchedulePlayoffs table with SchedulePlayoffID identity';
END
ELSE
BEGIN
    PRINT 'SchedulePlayoffs already has SchedulePlayoffID column - skipping';
END

-- ============================================
-- 3. Create __EFMigrationsHistory table and seed baseline
-- ============================================
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '__EFMigrationsHistory')
BEGIN
    CREATE TABLE __EFMigrationsHistory (
        MigrationId nvarchar(150) NOT NULL,
        ProductVersion nvarchar(32) NOT NULL,
        CONSTRAINT PK___EFMigrationsHistory PRIMARY KEY (MigrationId)
    );
    PRINT 'Created __EFMigrationsHistory table';
END

-- Seed the baseline migration as "applied"
IF NOT EXISTS (SELECT 1 FROM __EFMigrationsHistory WHERE MigrationId = '20260128190304_InitialBaseline')
BEGIN
    INSERT INTO __EFMigrationsHistory (MigrationId, ProductVersion)
    VALUES ('20260128190304_InitialBaseline', '9.0.0');
    PRINT 'Seeded InitialBaseline migration';
END

PRINT 'Migration complete!';
