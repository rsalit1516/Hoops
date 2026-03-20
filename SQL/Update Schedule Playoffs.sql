select * from Players
select * from Divisions 
where seasonId = 2222
order by divisionid desc
Select * from SchedulePlayoffs
where divisionId in (select divisionId from Divisions 
where seasonId = 2222)

select * from [Location]
Select * from SchedulePlayoffs
where divisionId = 4283
and GameNumber=220
order by gameDate

-- update SchedulePlayoffs
-- set GameDate = '2026-02-23 20:30:00', GameTime = '08:30:00 PM', LocationNumber = 4
-- where divisionId = 4283
-- and GameNumber=220

Select * from SchedulePlayoffs
where divisionId = 4282
and GameNumber=163
order by gameDate

-- Delete from SchedulePlayoffs
-- where divisionId = 4282
-- and GameNumber=163

Select * from ScheduleGames
where divisionId = 4287
-- and GameDate > '2026-02-18'
and ScheduleGamesId = 36525

-- Update ScheduleGames
-- set GameDate = '2026-02-18 20:30:00'
-- where ScheduleGamesId = 36525