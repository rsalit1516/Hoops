# Story APMF-077: Draft List

**Story ID:** APMF-077  
**Feature:** [75](../../features/{{FEATURE_AREA}}/{{FEATURE_ID}}.md)  
**Epic:** [APM-045](../../epics/APM-045.md)  
**Azure Boards:** [Story #77](https://dev.azure.com/rsalit1516/Hoops/_workitems/edit/77)

## User Story

As an admin user, I want to be able to create a printable list of season players by division so that ADs can use this list in running their drafts.

## Acceptance Criteria

- [ ] A new Admin Menu item Reports will be added to the Admin side menu with the first report being "Draft List"
- [ ] A form will be presented with
  - [ ] the top will have a list of Seasons in descending FromDate order showing the season description and the latest season being the default
  - [ ] next to the season selector is a division selector, displaying the divisions for the selected season in descending order from the mindate or mindate2 (if the mindate is not provided). An "All Divisions" will be the first selection on the dsivision list
  - [ ] once a division is selected a list of players will be displayed using the SQL query below (in the Technical Notes section) showing the fields Division, DraftId, Last Name, First Name, DOB, Grade, Address1, City, and Zip.
  - [ ] A Download button next to the Division selector will cause the data listed to be downloaded as a CSV file using the convention "DraftList-{SeasonDescription}-{Div_Desc}"
  - [ ] a snackbar message will notify the user that the file has been downloaded.

## Technical Notes

```sql
SELECT
    d.Div_Desc as Division,
    pl.DraftID,
      p.[LastName],
      p.[FirstName],
      convert(Date, p.BirthDate) as DOB,
      p.Grade,
      h.Address1,
      h.City,
      h.zip
  FROM [dbo].[People] P
  join players pl on p.PeopleID = pl.PeopleID
  join Households h on p.MainHouseID = h.HouseID
  join Divisions d on pl.DivisionID = d.DivisionID
  join Seasons s on s.SeasonID = d.SeasonID
  where s.SeasonID = 2222
  order by d.Div_desc, p.lastName, p.FirstName

```

- use Angular Material components.
- use existing Season and division select components
- reference scss files in the app/shared/scss folder
