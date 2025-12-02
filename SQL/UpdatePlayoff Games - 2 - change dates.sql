SELECT TOP (1000) [ScheduleNumber]
      ,[GameNumber]
      ,[LocationNumber]
      ,[GameDate]
      ,[GameTime]
      ,[VisitingTeam]
      ,[HomeTeam]
      ,[Descr]
      ,[VisitingTeamScore]
      ,[HomeTeamScore]
      ,[DivisionId]
  FROM [dbo].[SchedulePlayoffs]
  where gamedate > '2025-08-08'
  and gamedate < '2025-08-10'
  and divisionId = 4261
  order by gamedate, GameTime

--   select * from Divisions
--   where seasonid = 2219

  select * from SchedulePlayoffs
  where DivisionId = 4261
  and GameNumber = 96

--   update SchedulePlayoffs
--   set GameDate = '2025-08-08 18:00:00.000', GameTime = '06:00:00 PM'
--   where DivisionId = 4261
--   and GameNumber = 96

--   update SchedulePlayoffs
--   set GameDate = '2025-08-08 18:50:00.000', GameTime = '06:50:00 PM'
--   where DivisionId = 4261
--   and GameNumber = 97

--   update SchedulePlayoffs
--   set GameDate = '2025-08-08 19:40:00.000', GameTime = '07:40:00 PM'
--   where DivisionId = 4261
--   and GameNumber = 98
