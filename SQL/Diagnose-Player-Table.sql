-- =============================================================================
-- COMPREHENSIVE PLAYER TABLE DIAGNOSTICS
-- =============================================================================

-- 1. Check ALL Player table columns with their current constraints
SELECT
    c.COLUMN_NAME,
    c.DATA_TYPE,
    c.CHARACTER_MAXIMUM_LENGTH,
    c.NUMERIC_PRECISION,
    c.NUMERIC_SCALE,
    c.IS_NULLABLE,
    c.COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS c
WHERE c.TABLE_NAME = 'Player'
ORDER BY c.ORDINAL_POSITION;

-- 2. Check for foreign key constraints on Player table
SELECT
    fk.name AS ForeignKeyName,
    OBJECT_NAME(fk.parent_object_id) AS TableName,
    COL_NAME(fc.parent_object_id, fc.parent_column_id) AS ColumnName,
    OBJECT_NAME(fk.referenced_object_id) AS ReferencedTable,
    COL_NAME(fc.referenced_object_id, fc.referenced_column_id) AS ReferencedColumn,
    fk.is_disabled AS IsDisabled
FROM sys.foreign_keys fk
INNER JOIN sys.foreign_key_columns fc ON fk.object_id = fc.constraint_object_id
WHERE OBJECT_NAME(fk.parent_object_id) = 'Player'
ORDER BY fk.name;

-- 3. Check for NOT NULL columns that might be causing issues
SELECT
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Player'
    AND IS_NULLABLE = 'NO'
    AND COLUMN_DEFAULT IS NULL
ORDER BY ORDINAL_POSITION;

-- 4. Verify specific columns mentioned in the error
SELECT
    'PayType' AS ColumnName,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Player' AND COLUMN_NAME = 'PayType'
UNION ALL
SELECT
    'CheckMemo' AS ColumnName,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Player' AND COLUMN_NAME = 'CheckMemo'
UNION ALL
SELECT
    'NoteDesc' AS ColumnName,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Player' AND COLUMN_NAME = 'NoteDesc';

-- 5. Check for indexes on Player table
SELECT
    i.name AS IndexName,
    i.type_desc AS IndexType,
    i.is_unique,
    i.is_primary_key,
    COL_NAME(ic.object_id, ic.column_id) AS ColumnName,
    ic.key_ordinal
FROM sys.indexes i
INNER JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
WHERE i.object_id = OBJECT_ID('Player')
ORDER BY i.name, ic.key_ordinal;

-- 6. Check if Person table has required PersonId values (foreign key check)
-- This query checks if PersonId foreign keys are valid
SELECT
    COUNT(*) AS InvalidPersonIdCount
FROM Player p
LEFT JOIN People pe ON p.PeopleID = pe.PeopleID
WHERE p.PeopleID IS NOT NULL
    AND pe.PeopleID IS NULL;

-- 7. Check if Division table has required DivisionId values
SELECT
    COUNT(*) AS InvalidDivisionIdCount
FROM Player p
LEFT JOIN Divisions d ON p.DivisionID = d.DivisionID
WHERE p.DivisionID IS NOT NULL
    AND d.DivisionID IS NULL;

-- 8. Check if Season table has required SeasonId values
SELECT
    COUNT(*) AS InvalidSeasonIdCount
FROM Player p
LEFT JOIN Seasons s ON p.SeasonID = s.SeasonID
WHERE p.SeasonID IS NOT NULL
    AND s.SeasonID IS NULL;

-- 9. Check if Team table has required TeamId values
SELECT
    COUNT(*) AS InvalidTeamIdCount
FROM Player p
LEFT JOIN Teams t ON p.TeamID = t.TeamID
WHERE p.TeamID IS NOT NULL
    AND t.TeamID IS NULL;

-- 10. Sample recent Player records to understand data patterns
SELECT TOP 5
    PlayerId,
    PeopleID,
    SeasonID,
    DivisionID,
    TeamID,
    PayType,
    LEN(PayType) AS PayTypeLength,
    CreatedDate
FROM Player
ORDER BY CreatedDate DESC;
