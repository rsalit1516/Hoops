select GameNumber
, d.Div_Desc
, convert(varchar(8), GameDate, 10) as GameDate 
, FORMAT(TRY_CONVERT(datetime, GameTime), 'hh:mm tt') AS GameTime
-- , VisitingTeamNumber
-- , HomeTeamNumber
, sdtv.ScheduleTeamNumber as Visitor
, sdth.ScheduleTeamNumber as Home
, VisitingTeamScore
, HomeTeamScore 
, sg.CreatedDate
, sg.CreatedUser
, sg.modifiedDate
, sg.ModifiedUser
from ScheduleGames sg
join Divisions d on sg.DivisionId = d.DivisionId
join ScheduleDivTeams sdtv on sg.ScheduleNumber = sdtv.ScheduleNumber
   and sdtv.TeamNumber = sg.VisitingTeamNumber
  join ScheduleDivTeams sdth on sg.ScheduleNumber = sdth.ScheduleNumber
   and sdth.TeamNumber = sg.HomeTeamNumber
where gamedate > '2026-04-01' 
and sdtv.SeasonId = 2223
and gamedate < '2026-04-15'
order by gamedate, GameTime;

select * from Divisions

select * from WebContent

select * from teams

select * from users