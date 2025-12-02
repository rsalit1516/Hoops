SELECT [ScheduleNumber]
      ,[GameNumber]
      ,[LocationNumber]
      ,[GameDate]
      ,[GameTime]
      ,[VisitingTeamNumber]
      ,[HomeTeamNumber]
      ,[VisitingTeamScore]
      ,[HomeTeamScore]
    --   ,[VisitingForfeited]
    --   ,[HomeForfeited]
      ,[SeasonId]
      ,[DivisionId]
      ,[ScheduleGamesId]
  FROM [dbo].[ScheduleGames]
  where --GameDate >= '2025-06-30' and GameDate <= '2025-07-01'
--and 
  divisionId = 10064
  order by GameDate, GameTime, VisitingTeamNumber, HomeTeamNumber

  select * from divisions
  select * from teams
  where DivisionID = 9899
  select * from Seasons

  select * from ScheduleLocations

  select * from SchedulePlayoffs

  select * from ScheduleDivTeams
  where seasonID = 9300 and ScheduleNumber = 3