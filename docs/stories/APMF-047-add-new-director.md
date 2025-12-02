# Story APMF-047: Add New Director

**Story ID:** APMF-047
**Feature:** [APMF-046 - Admin Director Management](../features/apm/APMF-046-director-management.md)
**Epic:** [APM-045 - League Participant Management](../epics/APM-045-admin-people-management.md)
**Azure Boards:** [Story #47](https://dev.azure.com/rsalit1516/Hoops/_workitems/edit/47)

**Story Points:** 3
**Priority:** High

## User Story

As an administrator, I want to add a new director to the system so that the public-facing director list remains current and accurate.

## Acceptance Criteria

- [ ] "Add Director" button is visible on the directors list page
- [ ] Clicking "Add Director" opens a form with required fields:
  - [ ] Board Member dropdown (from people table where boardMember = 1 or boardOfficer = 1, displayed as "LastName, FirstName")
  - [ ] Title field (text, max 50 characters, required)
  - [ ] Sequence Number field (integer, required, for display ordering)
- [ ] All fields are validated (required, proper data types, max lengths)
- [ ] "Save" button is enabled only when form is valid
- [ ] Clicking "Save" persists the new director to the database
- [ ] After successful save, user is navigated back to directors list
- [ ] New director appears in the list with correct information
- [ ] "Cancel" button returns to directors list without saving
- [ ] Form displays validation errors inline with appropriate fields
- [ ] Success message displays after successful save

## Definition of Done

- [ ] Unit tests written and passing (>80% coverage)
- [ ] BDD scenarios implemented and passing
- [ ] Code reviewed and approved
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Manual testing completed

## Dependencies

- **Blocked by:** APMF-046 (View Directors List)
- **Blocks:** None
- **Related:** APMF-048 (Edit Director), APMF-049 (Delete Director)

## Technical Implementation

### Components

- **Primary:** `DirectorForm` - Reactive form component for adding director
- **Supporting:** `DirectorFormDialog` - Modal wrapper for the form
- **Supporting:** `PeopleSelector` - Dropdown component for selecting board members

### Services

- `DirectorService` - API integration for creating director records
- `PeopleService` - Fetch list of eligible board members for dropdown
- `DirectorValidationService` - Client-side validation rules

### Models/Interfaces

- `Director` - Director entity interface
- `DirectorFormData` - Form data interface for add/edit operations
- `BoardMember` - Interface for board member dropdown options

## Related Files

- **BDD Feature:** [APMF-047-add-new-director.feature](../features/apm/APMF-047-add-new-director.feature)
- **Component:** `/src/app/admin/directors/director-form/`
- **Service:** `/src/app/admin/directors/services/director.service.ts`

## Technical Notes

- Use Angular reactive forms with validators
- Board member dropdown should filter people where `boardMember = 1` OR `boardOfficer = 1`
- Sequence number should default to next available number (max + 1)
- Consider implementing duplicate detection (same person + title combination)
- Use optimistic updates with rollback on error
- Form should be reusable for both add and edit operations

## Test Scenarios

### Happy Path

- Admin clicks "Add Director", fills in all required fields, clicks "Save"
- New director is created and appears in the list
- Admin is returned to directors list with success message

### Edge Cases

- Attempting to add director with existing person + title combination (warn or prevent)
- Sequence number conflicts are handled gracefully
- Very long titles (near 50 character limit) display properly
- Dropdown with many board members (100+) performs well

### Error Conditions

- Save fails due to API error - error message displayed, form remains open
- Network timeout during save - appropriate feedback with retry option
- Invalid data submitted - validation errors displayed inline
- Required fields left blank - save button remains disabled

---

**Created:** 2025-10-17
**Last Updated:** 2025-10-23
**Status:** Not Started
