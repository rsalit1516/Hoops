- ScheduleDivTeams: Created by 3rd party application, links divisions & teams to regular and playoff schedule. 
- ScheduleNumber + SeasonID 

- SchedulePlayoffs: Target table with compound unique constraint (ScheduleNumber, GameNumber)
- added SchedulePlayoffID field as primary key and identity (self generating)
- LocationNumber is stored in the database linking to the ScheduleLocations LocationNumber field.