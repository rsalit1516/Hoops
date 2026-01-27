# Story APMF-079a: Default Division for new registrants

**Story ID:** APMF-079
**Feature:** [APNF-075](../../features/{{FEATURE_AREA}}/{{FEATURE_ID}}.md)  
**Epic:** [{{EPIC_ID}}](../../epics/{{EPIC_ID}}.md)  
**Azure Boards:** [Story #{{WORK_ITEM_ID}}](https://dev.azure.com/rsalit1516/Hoops/_workitems/edit/{{WORK_ITEM_ID}})

**Story Points:** 3  
**Priority:** Medium

## User Story

As an administrator, when I initiate a new player registration form the people form, the division drop down on the player registration should be prepopulated based on the player's birth date and the min and max dates of the relevant division.

## Acceptance Criteria

- [ ] after a user presses Register on the People form and a new Player registration form is opened and populated, the division drop down should be pre-populated with the relevant Division based by a comparison of the min and max dates of the division and the prospective player's birth date.
- [ ] Gender should be first determined as divisions can have dates for both male and female genders.
- [ ] If no birth date or division min/max dates are available, no default division is needed.
- [ ] If the player already exists, for the season and the division is populated no action is required.

## Definition of Done

- [ ] Unit tests written and passing (>80% coverage)
- [ ] BDD scenarios implemented and passing
- [ ] Code reviewed and approved
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Manual testing completed

## Dependencies

## Dependencies

## Technical Implementation

- use Angular Material components as appropriate
- Use Angular signals and signal forms where possible

### Services

### Models/Interfaces

**Created:** {{CURRENT_DATE}}  
**Last Updated:** {{CURRENT_DATE}}  
**Status:** {{Not Started}}
