-- Manual Fix Script for Current Season Data
-- This demonstrates the real-world manual process described

-- Step 1: Check current state
SELECT 'Current ScheduleGames' as TableName, ScheduleNumber, DivisionId, COUNT(*) as Records
FROM ScheduleGames WHERE SeasonId = 3035
GROUP BY ScheduleNumber, DivisionId
UNION ALL
SELECT 'Current ScheduleDivTeams' as TableName, ScheduleNumber, DivisionNumber as DivisionId, COUNT(*) as Records  
FROM ScheduleDivTeams WHERE SeasonId = 3035
GROUP BY ScheduleNumber, DivisionNumber
ORDER BY TableName, ScheduleNumber;

-- Step 2: Fix ScheduleDivTeams to match ScheduleGames ScheduleNumber
-- This simulates the external program having different numbering that needs to be aligned

-- For Division 3103 (ScheduleNumber should be 3)
UPDATE ScheduleDivTeams 
SET ScheduleNumber = 3 
WHERE SeasonId = 3035 AND DivisionNumber = 3103;

-- For Division 3104 (ScheduleNumber should be 4)  
UPDATE ScheduleDivTeams 
SET ScheduleNumber = 4 
WHERE SeasonId = 3035 AND DivisionNumber = 3104;

-- For Division 3105 (ScheduleNumber should be 5)
UPDATE ScheduleDivTeams 
SET ScheduleNumber = 5 
WHERE SeasonId = 3035 AND DivisionNumber = 3105;

-- Step 3: Verify the fix
SELECT 'After Fix - ScheduleGames' as TableName, ScheduleNumber, DivisionId, COUNT(*) as Records
FROM ScheduleGames WHERE SeasonId = 3035
GROUP BY ScheduleNumber, DivisionId
UNION ALL
SELECT 'After Fix - ScheduleDivTeams' as TableName, ScheduleNumber, DivisionNumber as DivisionId, COUNT(*) as Records  
FROM ScheduleDivTeams WHERE SeasonId = 3035
GROUP BY ScheduleNumber, DivisionNumber
ORDER BY TableName, ScheduleNumber;

-- Step 4: Test the join that GetStandings uses
SELECT 
    sg.DivisionId,
    sg.ScheduleNumber,
    COUNT(DISTINCT sg.ScheduleGamesId) as Games,
    COUNT(DISTINCT sdt.ScheduleDivTeamsId) as Teams
FROM ScheduleGames sg
LEFT JOIN ScheduleDivTeams sdt ON sdt.SeasonId = sg.SeasonId AND sdt.ScheduleNumber = sg.ScheduleNumber
WHERE sg.SeasonId = 3035
GROUP BY sg.DivisionId, sg.ScheduleNumber
ORDER BY sg.DivisionId;
