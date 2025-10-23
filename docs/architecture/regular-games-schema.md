# Regular Games related Schema

- ScheduleGames: Contains regular season games
  - the ScheduleNumber corresponds to the DivisionId. The ScheduleNumber is used because of a 3rd party scheduling program that creates the ScheduleDivTeams table to map division and teams to the season schedule.
- In the ScheduleDivTeams table the ScheduleNumber + SeasonID correspond to the DivisionId (also stored in the SchedulDivTeams table)
- The Teams table has a TeamNumber field (which is nvarchar(2) but is always a number). With the divisionID, seasonID and then the Teams TeamNumber to the ScheduleTeamNUmber to get the TeamNumber field
- in ScheduleGames VisitingTeamNumber and HomeTeamNumber link to the ScheduleDivTeams TeamNumber.
- LocationNumber is stored in the database linking to the ScheduleLocations LocationNumber field.
