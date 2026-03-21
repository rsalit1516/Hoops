/*
NewSeasonProcess.sql
- create backup of production
- import mdb database into local database
- import data from 
    - SchTeams -> SCheduleDivTeams
    - SchGames -> ScheduleGames
- find season to set up - remember seasonId
- select * from seasons order by fromdate desc
*/
Declare @seasonId INT
set @seasonId = 2223
DECLARE @startingGameDate nvarchar(20)
set @startingGameDate = '2026-03-19'
-- -- /*
-- -- Update ScheduleDivTeams
-- -- - check all that are missing seasonId (make sure they are only the season to be set up)
-- -- */
-- select * from ScheduleDivTeams where SeasonId is null

-- update ScheduleDivTeams 
-- set seasonID = @seasonId
-- where SeasonId is null

-- -- /*
-- -- Update games table
-- -- -- */
-- select * from ScheduleGames where SeasonId is null and gameDate > @startingGameDate
-- update ScheduleGames
-- set seasonId = @seasonId
-- where SeasonId is null and gameDate > @startingGameDate
-- -- select * from ScheduleGames where seasonid = @seasonId
-- -- -- check to make sure that worked
select * from ScheduleGames where gameDate > @startingGameDate
order by ScheduleNumber, GameDate, GameTime
-- -- /*
-- -- Update ScheduleGames with the correct divisions
-- -- */
-- -- -- get list of divisions for the season
select * from Divisions where SeasonID = @seasonId
-- -- -- match in ScheduleNumber in ScheduleDivTeams with SCheduleGames and figure out how they match
-- -- -- look at games dates and times and refer back to paper schedules

-- -- -- trainee 2
--  update [dbo].[ScheduleGames]
--    set DivisionId = 4288
--    where seasonid = @seasonID and ScheduleNumber = 13

-- -- -- trainee 4
--  update [dbo].[ScheduleGames]
--    set DivisionId = 4289
--    where seasonid = @seasonID and ScheduleNumber = 14

-- -- -- SI boys
--  update [dbo].[ScheduleGames]
--    set DivisionId = 4290
--    where seasonid = @seasonID and ScheduleNumber = 15

-- -- -- SJV boys
--  update [dbo].[ScheduleGames]
--    set DivisionId = 4291
--    where seasonid = @seasonID and ScheduleNumber = 16

-- -- -- HS boys
--  update [dbo].[ScheduleGames]
--    set DivisionId = 4292
--    where seasonid = @seasonID and ScheduleNumber = 17

-- -- -- Int Girls
--  update [dbo].[ScheduleGames]
--    set DivisionId = 4293
--    where seasonid = @seasonID and ScheduleNumber = 26

-- -- -- 18+ 
--  update [dbo].[ScheduleGames]
--    set DivisionId = 4296
--    where seasonid = @seasonID and ScheduleNumber = 25

-- -- -- JVG
--  update [dbo].[ScheduleGames]
--    set DivisionId = 4294
--    where seasonid = @seasonID and ScheduleNumber = 21

-- -- -- HS Girls
--  update [dbo].[ScheduleGames]
--    set DivisionId = 4295
--    where seasonid = @seasonID and ScheduleNumber = 22

/*
Adjust teams and colors Colors - ToDo: change in program to show accurately
*/
select * from Teams where DivisionID in (select DivisionID from Divisions where seasonid= 2223)
-- update Teams 
-- set seasonid = 2223
-- where DivisionID in (select DivisionID from Divisions where seasonid= 2223)

-- update Teams
-- set TeamName = null
-- where SeasonID = 2205


/*
Update season to make the season live
*/
-- update Seasons
-- set [CurrentSeason] = 0, CurrentSchedule = 0, CurrentSignUps = 0
-- where seasonId <> 2223

-- update Seasons
-- set [CurrentSeason] = 1, CurrentSchedule = 1, CurrentSignUps = 1
-- where seasonId = 2223


/*
Troubleshooting
Disable unnecesary divisions
*/
-- update Divisions
-- set SeasonID = null
-- where DivisionId=4083

-- update Divisions
-- set SeasonID = null
-- where DivisionId=4086

/* adjustment for location issue */
-- select * from ScheduleGames where locationNumber =3 and SeasonId = 2198
-- update ScheduleGames
-- set LocationNumber=9
-- where ScheduleGamesId=22433 or ScheduleGamesId = 22434 or ScheduleGamesId = 22435

select * from teams where SeasonID = 2223
order by DivisionId, TeamNumber

select * from Divisions where seasonId = 2223
-- update Divisions
-- set seasonid = null
-- where divisionId = 4092

-- delete from teams where TeamID = 7560 and createdUser = 'BARRY POPOCK'
select * from ScheduleDivTeams
where SeasonId = 2223
order by SCheduleNumber, ScheduleTeamNumber

select * from ScheduleGames
where SeasonId = 2223
-- and divisionId = 4293
order by ScheduleNumber, GameDate, GameTime

-- update ScheduleDivTeams
-- set ScheduleTeamNumber = 1
-- where ScheduleDivTeamsId = 4775

-- update ScheduleDivTeams
-- set ScheduleTeamNumber = 1
-- where ScheduleDivTeamsId = 4688

-- update ScheduleDivTeams
-- set ScheduleTeamNumber = 9
-- where ScheduleDivTeamsId = 4687

-- update ScheduleDivTeams
-- set ScheduleTeamNumber = 1
-- where ScheduleDivTeamsId = 4686

-- update ScheduleDivTeams
-- set ScheduleTeamNumber = 2
-- where ScheduleDivTeamsId = 4706

-- update ScheduleDivTeams
-- set ScheduleTeamNumber = 11
-- where ScheduleDivTeamsId = 4707

-- update ScheduleDivTeams
-- set ScheduleTeamNumber = 1
-- where ScheduleDivTeamsId = 4717

-- update ScheduleDivTeams
-- set ScheduleTeamNumber = 11
-- where ScheduleDivTeamsId = 4720

-- select * from Colors
/*
1. Automate Division Mapping
Instead of manually matching ScheduleNumber to DivisionId after reviewing the schedule, consider:

Create a mapping table (e.g., ScheduleNumberDivisionMap) where you can enter the mapping once per season.
Use a script to update all relevant ScheduleGames rows based on this mapping.
Example:
-- Create mapping table (run once)
CREATE TABLE ScheduleNumberDivisionMap (
    SeasonId INT,
    ScheduleNumber INT,
    DivisionId INT
);

-- Insert mappings for the season (do this once per season)
INSERT INTO ScheduleNumberDivisionMap VALUES (2219, 13, 4260), (2219, 14, 4261), ...;

-- Update ScheduleGames using the mapping
UPDATE sg
SET sg.DivisionId = m.DivisionId
FROM ScheduleGames sg
JOIN ScheduleNumberDivisionMap m
  ON sg.SeasonId = m.SeasonId AND sg.ScheduleNumber = m.ScheduleNumber
WHERE sg.SeasonId = 2219;

2. Automate Data Fixes
For recurring data issues (e.g., missing SeasonId, resetting team names), encapsulate these in reusable scripts or stored procedures. You can run these as a batch after import.

3. Parameterize the Script
Use variables for @seasonId, @startingGameDate, etc., so you only need to change them in one place each season.

4. Automate the Whole Process
Wrap all steps in a single script or a SQL Agent job:

Import data
Run mapping and fixes
Update season status
5. Optional: Build a Simple UI or Script
If you want to reduce manual SQL editing, consider a small C# or PowerShell tool that:

Prompts you for the new season ID and mapping
Reads a CSV or Excel file for mappings
Executes the SQL updates automatically
6. Documentation
Document the process and keep a template for each season, so you only fill in the season-specific details.

Summary:

Use a mapping table for ScheduleNumber to DivisionId assignments.
Encapsulate recurring fixes in scripts or procedures.
Parameterize and automate as much as possible.
Optionally, build a small tool for data entry and execution.
If you’d like, I can help you scaffold the mapping table, a stored procedure, or a C# tool to automate this further—just let me know your preference!
*/