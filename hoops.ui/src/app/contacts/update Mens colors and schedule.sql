-- SELECT  [TeamID]
--       ,[TeamName]
--       ,[TeamColor]
--       ,[TeamColorID]
--       ,[TeamNumber]
--   FROM [dbo].[Teams]
--   where divisionId = 4251

--  select * from divisions where seasonid = 2218

--   select * from Colors
-- where ColorName like '%orange%' or colorName like '%green%'
--   select * from Seasons
--   order by SeasonID

-- 71 Burn orange
-- 79 acid grend

-- update Teams
-- set TeamColorID = 71
-- where TeamID = 8728

-- update Teams
-- set TeamColorID = 79
-- where TeamID = 8730

select * from ScheduleGames
where divisionId = 4251
and GameDate > '2025-04-23'

-- update ScheduleGames
-- set divisionId = null
-- where divisionId = 4251
-- and GameDate > '2025-04-23'

select * from users
where username = 'mikem'

select * from divisions
where DirectorID = 68526

select * from Divisions
where SeasonID = 2218


