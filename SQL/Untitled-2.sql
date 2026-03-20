-- select * from Seasons WHERE CurrentSeason = 1
-- SELECT *
--   FROM [dbo].[Divisions]
--     WHERE SeasonID = 2215
select * from ScheduleDivTeams WHERE SeasonID = 2215
select * from Teams WHERE SeasonID = 2215
Select * from Colors
Select s.Sea_Desc
  , d.Div_Desc
  , sdtHome.TeamNumber as HomeTeam
  , sdtVisitor.TeamNumber as VisitingTeam
  , l.LocationName
  , sg.GameDate
  , sg.gameTime
  , sg.* from ScheduleGames sg
join divisions d on d.divisionid = sg.divisionid
join seasons s on s.seasonid = sg.seasonid
join ScheduleDivTeams sdtHome on sdtHome.ScheduleNumber = sg.ScheduleNumber 
  and sdtHome.SeasonID = sg.SeasonID
  and sdtHome.TeamNumber = sg.HomeTeamNumber
join ScheduleDivTeams sdtVisitor on sdtVisitor.ScheduleNumber = sg.ScheduleNumber
  and sdtVisitor.SeasonID = sg.SeasonID
  and sdtVisitor.TeamNumber = sg.VisitingTeamNumber
join Location l on l.LocationNumber = sg.LocationNumber
  WHERE sg.SeasonID = 2215

-- Row counts
SELECT * FROM Teams WHERE seasonID = 2215
and TeamName IS NULL OR TeamNumber IS NULL;
SELECT * FROM ScheduleDivTeams WHERE TeamNumber IS NULL;

select * from Users
where UserName= 'rsalit'