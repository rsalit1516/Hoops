-- SELECT count([ID])FROM [dbo].[Colors]
--   select count(*) from seasons
--   select count(*) from Divisions
--   select count(*) from People
--   select count(*) from Households
--   select count(*) from WebContent
--   select count(*) from WebContentType

SELECT 'Colors' as TableName, COUNT([ID]) as RecordCount FROM [dbo].[Colors]
UNION ALL
SELECT 'Locations' as TableName, COUNT(*) as RecordCount FROM [dbo].[ScheduleLocations]
UNION ALL
SELECT 'Seasons' as TableName, COUNT(*) as RecordCount FROM seasons
UNION ALL
SELECT 'Divisions' as TableName, COUNT(*) as RecordCount FROM Divisions
UNION ALL
SELECT 'Teams' as TableName, COUNT(*) as RecordCount FROM Teams
UNION ALL
SELECT 'People' as TableName, COUNT(*) as RecordCount FROM People
UNION ALL
SELECT 'Households' as TableName, COUNT(*) as RecordCount FROM Households
UNION ALL
SELECT 'WebContent' as TableName, COUNT(*) as RecordCount FROM WebContent
UNION ALL
SELECT 'WebContentType' as TableName, COUNT(*) as RecordCount FROM WebContentType
ORDER BY TableName;

  select * from Divisions
  select * from Teams
  select * from seasons
  select * from ScheduleLocations
