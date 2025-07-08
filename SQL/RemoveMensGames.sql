SELECT  [ScheduleNumber]
      ,[GameNumber]
      ,[LocationNumber]
      ,[GameDate]
      ,[GameTime]
      ,[VisitingTeamNumber]
      ,[HomeTeamNumber]
      ,[SeasonId]
      ,[DivisionId]
      ,[ScheduleGamesId]
  FROM [dbo].[ScheduleGames]
  where divisionid = 4268 and gamedate >= '2025-07-28'

--   select * from divisions
--   order by divisionid desc, seasonid desc

-- update ScheduleGames
-- set DivisionId = null
-- where divisionid = 4268 and gamedate >= '2025-07-28'