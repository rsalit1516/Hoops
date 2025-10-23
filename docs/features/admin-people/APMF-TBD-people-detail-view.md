# Feature APMF-TBD: People Detail View and Edit

**Feature ID:** APMF-TBD (Awaiting Azure Boards Assignment)
**Epic:** [APM-001](../../epics/APM-001-admin-people-management.md)
**Azure Boards:** [Feature #TBD](https://dev.azure.com/rsalit1516/Hoops/_workitems/edit/TBD)

**Product Area:** Admin People Management
**Priority:** High

## Feature Overview

The People Detail View and Edit feature provides administrators with the ability to view comprehensive information about a person and make updates to their data. This includes viewing all person attributes, editing information with validation, saving changes to the database, and canceling edits to return to the list view.

## Business Value

Detailed person management is critical for maintaining accurate league records. Administrators need to view complete person profiles and update information as circumstances change (address updates, contact information changes, etc.). Proper validation and error handling ensure data quality while edit/cancel functionality prevents accidental changes.

## User Stories in Feature

| Story ID  | Title                                    | Points | Status      |
| --------- | ---------------------------------------- | ------ | ----------- |
| APMF-TBD1 | View Person Detail Information           | 3      | Not Started |
| APMF-TBD2 | Edit Person Information with Validation  | 5      | Not Started |
| APMF-TBD3 | Save Person Changes to Database          | 3      | Not Started |
| APMF-TBD4 | Cancel Edit and Return to List           | 1      | Not Started |
| APMF-TBD5 | Navigate to Player Registration (Players)| 2      | Not Started |

**Total Points:** 14

## Technical Architecture

### Components

- `PersonDetail` - Main component displaying person information in read/edit modes
- `PersonForm` - Reactive form component with validation rules
- `PersonHeader` - Header section with person name and key attributes
- `PersonActions` - Action buttons (Save, Cancel, Register)
- `ConfirmationDialog` - Modal for confirming cancel with unsaved changes

### Services

- `PeopleService` - API integration for fetching and updating person data
- `PersonValidationService` - Client-side validation rules
- `NavigationService` - Handles navigation with unsaved changes warning

### Database Changes

- No schema changes required
- Ensure proper audit fields (ModifiedBy, ModifiedDate) are updated on save

## Acceptance Criteria

- [ ] Person detail page displays all relevant person information
- [ ] Edit mode activates with proper form controls and validation
- [ ] Save button persists changes to database with success confirmation
- [ ] Cancel button returns to people list (with confirmation if unsaved changes)
- [ ] Form validation prevents invalid data submission
- [ ] Loading indicator displays during save operation
- [ ] Error messages display when save fails
- [ ] Audit fields (ModifiedBy, ModifiedDate) are properly updated
- [ ] "Register" option available for players
- [ ] Page is responsive on mobile devices

## Technical Notes

- Use Angular reactive forms with custom validators
- Implement unsaved changes guard to prevent accidental navigation
- Use optimistic updates with rollback on error
- Store original person data for cancel/reset functionality
- Display validation errors inline with form fields
- Use Angular Material form controls for consistency
- Implement proper loading states during async operations
- Consider implementing auto-save draft functionality for long forms

---

**Created:** 2025-10-23
**Last Updated:** 2025-10-23
**Status:** Not Started

**Note:** Feature ID and Story IDs are pending assignment in Azure Boards.
