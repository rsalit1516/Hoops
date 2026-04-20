    SELECT  [UserID]
        ,[CompanyID]
        ,[UserName]
        ,[Name]
        ,[PWord]
        ,[PassWord]
        ,[UserType]
        ,[ValidationCode]
        ,[PeopleID]
        ,[HouseID]
        ,[CreatedDate]
        ,[CreatedUser]
    FROM [dbo].[Users]
    where PeopleID = 68526

  select* from People where lastname like 'Mottley%'
  select * from rolls

  select * from scheduleGames
  where DivisionId in (select DivisionId from Divisions where SeasonId = 2223) 
  and GameDate >= '2026-03-01' and GameDate <= GETDATE()

  select * from Divisions where SeasonId = 2223
  select * from Seasons
  ORDER BY FromDate desc

  select * from ScheduleDivTeams where SeasonId = 2223
  and ScheduleNumber = 16

  select  sg.ScheduleNumber
  , sg.GameDate
  , sg.GameTime
  --, sg.VisitingTeamNumber
  , sdtv.ScheduleTeamNumber
  --, sg.HomeTeamNumber
  , sdth.ScheduleTeamNumber
  , sg.VisitingTeamScore
  , sg.HomeTeamScore   
  from scheduleGames sg
  join ScheduleDivTeams sdtv on sg.ScheduleNumber = sdtv.ScheduleNumber
   and sdtv.TeamNumber = sg.VisitingTeamNumber
  join ScheduleDivTeams sdth on sg.ScheduleNumber = sdth.ScheduleNumber
   and sdth.TeamNumber = sg.HomeTeamNumber
  where DivisionId = 4291
  and GameDate >= '2026-04-01' and GameDate <= GETDATE()
  and sdtv.SeasonId = 2223
  and sdth.SeasonId = 2223