-- select 
-- l.LocationName,
-- [sp].[ScheduleNumber],
-- [sp].[GameNumber],
-- [sp].[LocationNumber],
-- [sp].[GameDate],
-- [sp].[GameTime],
-- [sp].[VisitingTeam],
-- [sp].[HomeTeam],
-- [sp].[Descr],
-- [sp].[VisitingTeamScore],
-- [sp].[HomeTeamScore],
-- [sp].[DivisionId] from SchedulePlayoffs sp
-- join [Location] l on sp.LocationNumber = l.LocationNumber
-- where GameDate > '2025-08-05'
-- and GameDate < '2025-08-07'
-- and sp.LocationNumber = 3
-- and GameNumber = 132
-- order by GameDate, GameTime;

-- delete from SchedulePlayoffs
-- where GameDate > '2025-08-05'
-- and GameDate < '2025-08-07'
-- and LocationNumber = 3
-- and GameNumber = 132;

select 
l.LocationName,
d.Div_Desc,
[sp].[ScheduleNumber],
[sp].[GameNumber],
[sp].[LocationNumber],
[sp].[GameDate],
[sp].[GameTime],
[sp].[VisitingTeam],
[sp].[HomeTeam],
[sp].[Descr],
[sp].[VisitingTeamScore],
[sp].[HomeTeamScore],
[sp].[DivisionId] from SchedulePlayoffs sp
join [Location] l on sp.LocationNumber = l.LocationNumber
join Divisions d on sp.DivisionId = d.DivisionId
where GameDate > '2025-08-08'
and GameDate < '2025-08-09'
and sp.DivisionId = 4263
order by GameDate, GameTime;

-- update SchedulePlayoffs
-- set LocationNumber = 5
-- where GameDate > '2025-08-08'
-- and GameDate < '2025-08-09'
-- and DivisionId = 4263
-- and GameNumber = 137;