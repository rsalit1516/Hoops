SELECT TOP (1000) [SeasonID]
      ,[CompanyID]
      ,[Sea_Desc]
      ,[FromDate]
      ,[ToDate]
      ,[ParticipationFee]
      ,[SponsorFee]
      ,[ConvenienceFee]
      ,[CurrentSeason]
      ,[CurrentSchedule]
      ,[CurrentSignUps]
      ,[SignUpsDate]
      ,[SignUpsEND]
      ,[TestSeason]
      ,[NewSchoolYear]
      ,[CreatedDate]
      ,[CreatedUser]
  FROM [dbo].[Seasons]
  where SeasonID > 2218

  select * from Divisions
  where SeasonID > 2218

--   delete from Seasons
--     where SeasonID > 2219

-- update Seasons
-- set Sea_Desc = 'SUMMER 2025'
-- where SeasonID = 2219

-- update Divisions
-- set SeasonID = 2019
-- where SeasonID = 2220

Select * from Players
where SeasonID = 2220

Select * from Divisions
where SeasonID = 2218

/* insert divisions */
-- insert into Divisions 
-- (CompanyID, SeasonID, Div_Desc, Gender, MinDate, MaxDate, Gender2, MinDate2, MaxDate2, Stats, CreatedDate, CreatedUser)
-- values
-- (1, 2219, 'TRAINEE 2 COED', 'M', '2016-09-01', '2019-03-31', 'F', '2016-09-01', '2019-03-31', 0, GETDATE(), 'rsalit');

-- insert into Divisions 
-- (CompanyID, SeasonID, Div_Desc, Gender, MinDate, MaxDate, Stats, CreatedDate, CreatedUser)
-- values
-- (1, 2219, 'TRAINEE 4 COED', 'M', '2014-09-01', '2016-08-31',  0, GETDATE(), 'rsalit'),
-- (1, 2219, 'SI BOYS', 'M', '2012-09-01', '2014-08-31',  0, GETDATE(), 'rsalit'),
-- (1, 2219, 'SJV BOYS', 'M', '2010-09-01', '2012-08-31',  0, GETDATE(), 'rsalit'),
-- (1, 2219, 'HS BOYS', 'M', '2006-09-01', '2010-08-31',  0, GETDATE(), 'rsalit'),
-- (1, 2219, 'INT GIRLS', 'F', '2012-09-01', '2016-08-31',  0, GETDATE(), 'rsalit'),
-- (1, 2219, 'JV GIRLS', 'F', '2010-09-01', '2012-08-31',  0, GETDATE(), 'rsalit'),
-- (1, 2219, 'HS GIRLS', 'F', '2006-09-01', '2010-08-31',  0, GETDATE(), 'rsalit'),
-- (1, 2219, 'MEN 18+', 'M', '1985-09-01', '2006-08-31',  0, GETDATE(), 'rsalit')



Select * from Divisions
where SeasonID = 2219

select pl.DivisionId,
pl.PeopleId,
 p.BirthDate 
 , p.FirstName
 , p.Gender
from Players pl
join People  p on pl.PeopleID = p.PeopleID
where SeasonID = 2220
order by DivisionId

-- coed
-- update Players
-- set SeasonId = 2219, DivisionID = 4260
-- where DivisionId = 4252

-- int girls
-- update Players
-- set SeasonId = 2219, DivisionID = 4265
-- where DivisionId = 4257

-- sjv girls
-- update Players
-- set SeasonId = 2219, DivisionID = 4266
-- where DivisionId = 4258




