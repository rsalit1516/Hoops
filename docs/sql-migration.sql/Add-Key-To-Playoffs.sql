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
  FROM [csbchoops].[dbo].[SchedulePlayoffs]


-- 1. Add the new auto-incrementing primary key column
ALTER TABLE SchedulePlayoffs
ADD SchedulePlayoffID INT IDENTITY(1,1);

-- 2. Drop the existing primary key constraint on ScheduleNumber
-- (Replace PK_SchedulePlayoffs with your actual constraint name if different)
ALTER TABLE SchedulePlayoffs
DROP CONSTRAINT PK_SchedulePlayoffs;

-- 3. Add new primary key constraint on SchedulePlayoffID
ALTER TABLE SchedulePlayoffs
ADD CONSTRAINT PK_SchedulePlayoffs_ID PRIMARY KEY (SchedulePlayoffID);

-- 4. Add a compound unique constraint on ScheduleNumber + GameNumber
-- ALTER TABLE SchedulePlayoffs
-- DROP CONSTRAINT UQ_SchedulePlayoffs_Schedule_Game 

-- 4. Add a compound unique constraint on ScheduleNumber + GameNumber
ALTER TABLE SchedulePlayoffs
ADD CONSTRAINT UQ_SchedulePlayoffs_Schedule_Game UNIQUE (DivisionID, GameNumber);



SELECT COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'SchedulePlayoffs' AND COLUMNPROPERTY(OBJECT_ID(TABLE_NAME), COLUMN_NAME, 'IsIdentity') = 1;



