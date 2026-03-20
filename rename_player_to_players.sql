-- Simple script to rename Player table to Players
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Player')
BEGIN
    PRINT 'Renaming Player table to Players...';

    -- Rename the table
    EXEC sp_rename 'Player', 'Players';

    PRINT 'Table renamed successfully!';
END
ELSE IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Players')
BEGIN
    PRINT 'Table is already named Players - no changes needed';
END
ELSE
BEGIN
    PRINT 'ERROR: Neither Player nor Players table exists!';
END
GO
