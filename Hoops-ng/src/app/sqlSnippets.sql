-- update [ScheduleDivTeams]
-- set seasonId = 2187
-- where seasonId is NULL


-- update [dbo].[ScheduleGames]
--   set seasonid = 2187
--   where seasonid is null
--     and gamedate > '2018-02-01'

    
-- update [dbo].[ScheduleGames]
--   set DivisionId = 3986
--   where seasonid = 2187 and scheduleNumber = 19


-- update Teams
--   set teamName = null
--   where seasonid = 2187

-- select pl.DraftId, p.LastName, p.FirstName, p.BirthDate, h.phone, p.Grade, h.Address1, h.Address2, h.City, h.State, h.Zip from players pl
-- join People p on pl.PeopleID = p.PeopleID
-- join Households h on p.MainHouseID = h.HouseID
-- where seasonid = 2187