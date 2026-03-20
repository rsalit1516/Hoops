-- =============================================================================
-- PENDING DATABASE MIGRATIONS FOR DEVELOP ENVIRONMENT
-- Generated: 2025-12-24
-- =============================================================================
-- This script contains all pending migrations that need to be applied to develop
--
-- Current migrations applied to develop:
--   1. 20250725132131_InitialMigration
--   2. 20250725133215_FixLocationIdentity
--
-- Pending migrations (in order):
--   3. 20250731115033_RestructureSchedulePlayoffsTableWithBackup
--   4. 20250731120000_SchedulePlayoffCustomRestructure
--   5. 20251216152000_IncreasePayTypeLength
-- =============================================================================

-- =============================================================================
-- MIGRATION 1: Increase PayType column length (MOST CRITICAL - FIXES 500 ERROR)
-- Migration: 20251216152000_IncreasePayTypeLength
-- =============================================================================
-- This migration fixes the player registration 500 error by increasing PayType
-- from NVARCHAR(5) to NVARCHAR(20)

ALTER TABLE Player
  ALTER COLUMN PayType NVARCHAR(20) NULL;

GO

-- =============================================================================
-- MIGRATION 2: Restructure SchedulePlayoffs Table
-- Migration: 20250731115033_RestructureSchedulePlayoffsTableWithBackup
-- =============================================================================
-- This migration restructures the SchedulePlayoffs table to add a proper
-- identity primary key and standardize column types

-- Create backup table
IF OBJECT_ID('SchedulePlayoffs_Backup', 'U') IS NOT NULL
    DROP TABLE SchedulePlayoffs_Backup;

SELECT * INTO SchedulePlayoffs_Backup FROM SchedulePlayoffs;

GO

-- Drop the original table
DROP TABLE SchedulePlayoffs;

GO

-- Recreate table with proper structure
CREATE TABLE SchedulePlayoffs (
    SchedulePlayoffID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    ScheduleNumber INT NOT NULL,
    GameNumber INT NOT NULL,
    LocationNumber INT NULL,
    GameDate DATETIME NULL,
    GameTime NVARCHAR(20) NULL,
    VisitingTeam NVARCHAR(10) NULL,
    HomeTeam NVARCHAR(10) NULL,
    Descr NVARCHAR(50) NULL,
    VisitingTeamScore INT NULL,
    HomeTeamScore INT NULL,
    DivisionId INT NOT NULL
);

GO

-- Restore data from backup
IF OBJECT_ID('SchedulePlayoffs_Backup', 'U') IS NOT NULL
BEGIN
    INSERT INTO SchedulePlayoffs (
        ScheduleNumber, GameNumber, LocationNumber, GameDate, GameTime,
        VisitingTeam, HomeTeam, Descr, VisitingTeamScore, HomeTeamScore, DivisionId
    )
    SELECT
        ScheduleNumber, GameNumber, LocationNumber, GameDate, GameTime,
        VisitingTeam, HomeTeam, Descr, VisitingTeamScore, HomeTeamScore, DivisionId
    FROM SchedulePlayoffs_Backup;

    DROP TABLE SchedulePlayoffs_Backup;
END

GO

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================
-- Run these queries after applying the migrations to verify success

-- 1. Verify PayType column is NVARCHAR(20)
SELECT
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Player' AND COLUMN_NAME = 'PayType';

-- 2. Verify SchedulePlayoffs structure
SELECT
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'SchedulePlayoffs'
ORDER BY ORDINAL_POSITION;

-- 3. Check for SchedulePlayoffID column
SELECT
    name,
    is_identity
FROM sys.columns
WHERE object_id = OBJECT_ID('SchedulePlayoffs') AND name = 'SchedulePlayoffID';

-- 4. Verify applied migrations in __EFMigrationsHistory
SELECT MigrationId, ProductVersion
FROM __EFMigrationsHistory
ORDER BY MigrationId;

GO
