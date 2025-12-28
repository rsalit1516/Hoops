select * from ScheduleGames
where divisionid = 4282 
order by schedulenumber, GameDate

select * from ScheduleDivTeams
where scheduleNumber = 15 and seasonid = 2222

select * from ScheduleDivTeams
where scheduleNumber = 15 and seasonid = 2222
and TeamNumber = 28

select * from divisions where seasonid = 2222

-- update ScheduleDivTeams
-- set ScheduleTeamNUmber = 2
-- where scheduleNumber = 15 and seasonid = 2222
-- and TeamNumber = 28

select * from ScheduleDivTeams
where scheduleNumber = 13 and seasonid = 2222
and TeamNumber = 5

-- update ScheduleDivTeams
-- set ScheduleTeamNUmber = 1
-- where scheduleNumber = 13 and seasonid = 2222
-- and TeamNumber = 5

select * from ScheduleDivTeams
where scheduleNumber = 16 and seasonid = 2222
and TeamNumber = 38

-- update ScheduleDivTeams
-- set ScheduleTeamNUmber = 1
-- where scheduleNumber = 16 and seasonid = 2222
-- and TeamNumber = 38

/* Int Boys duplicated a team on one day */
select * from schedulegames
where divisionid = 4281 and gamedate = '2026-01-12'
and scheduleGamesID = 36228

select * from ScheduleDivTeams
where scheduleNumber = 15 and seasonid = 2222

-- update ScheduleGames
-- set visitingTeamNumber = 36, homeTeamNumber = 29
-- where scheduleGamesID = 36228

/* rescheduleing teams 8/9 on 1/6 */
select * from ScheduleGames
where divisionid = 4283 and gamedate = '2026-01-06'
and ScheduleGamesId = 36325

select * from ScheduleDivTeams
where scheduleNumber = 17 and seasonid = 2222

select * from [Location]

-- update ScheduleGames
-- set LocationNumber = 4, GameTime = '2026-02-12 18:00:00', 
-- gamedate='2026-02-12 18:00:00'
-- where ScheduleGamesId = 36325
