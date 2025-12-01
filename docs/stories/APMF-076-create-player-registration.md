# Story APMF-076: Create Player Registration

**Story ID:** APMF-076  
**Feature:** [75](../../features/{{FEATURE_AREA}}/{{FEATURE_ID}}.md)  
**Epic:** [APM-045](../../epics/APM-045.md)  
**Azure Boards:** [Story #{{WORK_ITEM_ID}}](https://dev.azure.com/rsalit1516/Hoops/_workitems/edit/{{WORK_ITEM_ID}})

## User Story

As an admin user, I want ot be able to create a registraion record for players so that players can be counted and document payments received.

## Acceptance Criteria

- [ ] When triggered, a new record in the players table will be created
  - [ ] use the current season
  - [ ] determine the division based on the players birthdate field(in the People table) and the mindate and max date in the Division table. Divisions for the selected season should be evaluated based on the gender and the related min/max dates. The divisionId relating to the division that is equal or greater to the min date and less than or equal to the max date compared to the players birthdate.
  - [ ] CompanyId should be populated with a 1
  - [ ] PeopleId should be populated with the relevant People record.
  - [ ] PaidAmount field should be populated with the ParticipantFee from the selected Season Record.
- [ ] a form should be prepopulated with these values and linked to the PLayers table (unless otherwise noted)

  - [ ] the form should be created with the Signal Forms framework
  - [ ] form should use Angular Material components where possible
  - [ ] the divisionId field should be a slect with the div_desc in the dropdown
  - [ ] CompanyId should not be displayed
  - [ ] PeopleID should not be displayed
  - [ ] The Last Name and First Name should be displayed as readonly fields as "{FirstName} {LastName]" (derived from the People table values).
  - [ ] a section for "Payment Info" with the following fields
    - [ ] Payment Type should be displayed as a radio button with the values (Check, Credit Card, Online, Cash) and stored in the PayType field.
    - [ ] an numeric amount field with 2 decimal places in PaidAmount
    - [ ] a balance field with with 2 decimal places in Balance
    - [ ] a check # field stored in CheckMemo
    - [ ] a Date field stored in PaidDate (should have a calendar select)
    - [ ] a Memo field stored in CheckMemo
  - [ ] a section for Draft Info with the following fields
    - [ ] Draft ID stored in DraftId
    - [ ] Draft Note in NoteDesc
    - [ ] a Rating field field stored in Rating field as a select wit ht e values 1 - 10
    - [ ] a Change Division field as a select with the values (N/A, Plays Up, Plays Down)
      - [ ] if Plays Up is selected the PlaysUp field would be saved with a 1 (i.e. true)
      - [ ] if Plays Down is selected the PlaysDown field would be saved with a 1 (i.e. true)
      - This needs to be sensitive to changes on an edit.
    - [ ] a "Fee Waived" field with checkboxes for the following labels and database fields:
      - [ ] Scholarship in Scholarship
      - [ ] Rollover in ROllowver
      - [ ] Family Discount in FamilyDisc
      - [ ] Athlectic Director in AD
      - [ ] Partial Refund in OutOfTown
  - [ ] Save buttone that saves values to the database
  - [ ] Cancel button that cancels the edits
  - [ ] this form should be called when the user selects Register on the Person-info form

  ## Technical Notes

  - the form and related service should be in the admin folder in a folder called admin-player
  - A new Player service should be created in that folder and use signals to store values and state
