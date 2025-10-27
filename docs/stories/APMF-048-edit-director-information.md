# Story APMF-048: Edit Director Information

**Story ID:** APMF-048
**Feature:** [APMF-046 - Admin Director Management](../features/apm/APMF-046-director-management.md)
**Epic:** [APM-045 - League Participant Management](../epics/APM-045-admin-people-management.md)
**Azure Boards:** [Story #48](https://dev.azure.com/rsalit1516/Hoops/_workitems/edit/48)

**Story Points:** 3
**Priority:** High

## User Story

As an administrator, I want to view and edit existing director information so that the public-facing director list stays accurate when titles, sequences, or personnel change.

## Acceptance Criteria

- [ ] Directors list provides "Edit" action for each director record
- [ ] Clicking "Edit" opens a form pre-populated with current director data:
  - [ ] Board Member dropdown (from people table where boardMember = 1 or boardOfficer = 1, displayed as "LastName, FirstName")
  - [ ] In edit mode, the selected person linked by `peopleId` is pre-selected
  - [ ] Title field (text, max 50 characters, required)
  - [ ] Sequence Number field (integer, required, for display ordering)
- [ ] All fields are validated (required, proper data types, max lengths)
- [ ] "Save" button is enabled only when form is valid AND changes have been made
- [ ] Clicking "Save" persists updates to the database
- [ ] After successful save, user is navigated back to directors list
- [ ] Updated director information appears correctly in the list
- [ ] "Cancel" button returns to directors list without saving changes
- [ ] Form displays validation errors inline with appropriate fields
- [ ] Success message displays after successful save

## Definition of Done

- [ ] Unit tests written and passing (>80% coverage)
- [ ] BDD scenarios implemented and passing
- [ ] Code reviewed and approved
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Manual testing completed

## Dependencies

- **Blocked by:** APMF-046 (View Directors List), APMF-047 (Add New Director - shares form component)
- **Blocks:** None
- **Related:** APMF-047 (Add New Director - reuses form), APMF-049 (Delete Director)

## Technical Implementation

### Components

- **Primary:** `AdminDirectorForm` - Reusable reactive form component (shared with add)
- **Supporting:** `DirectorFormDialog` - Modal wrapper configured for edit mode
- **Supporting:** `PeopleSelector` - Dropdown component for selecting board members

### Services

- `DirectorService` - API integration for updating director records
- `PeopleService` - Fetch list of eligible board members for dropdown
- `DirectorValidationService` - Client-side validation rules

### Models/Interfaces

- `Director` - Director entity interface
- `DirectorFormData` - Form data interface for add/edit operations
- `BoardMember` - Interface for board member dropdown options

## Related Files

- **BDD Feature:** [APMF-048-edit-director-information.feature](../features/apm/APMF-048-edit-director-information.feature)
- **Component:** `/src/app/admin/directors/director-form/` (shared with APMF-047)
- **Service:** `/src/app/admin/directors/services/director.service.ts`

## Technical Notes

- Reuse `DirectorForm` component from APMF-047 with mode parameter (`add` vs `edit`)
- Pre-populate form with existing director data via route parameters or service
- Track form dirty state to enable/disable Save button appropriately
- Use optimistic updates with rollback on error
- Consider implementing unsaved changes guard
- Update audit fields (ModifiedBy, ModifiedDate) on successful save

## Test Scenarios

### Happy Path

- Admin clicks "Edit" on a director, modifies title field, clicks "Save"
- Director record is updated and changes appear in the list
- Admin is returned to directors list with success message

### Edge Cases

- Editing without making changes - Save button remains disabled
- Changing person selection to same person - no conflict
- Sequence number conflicts during concurrent edits
- Very long titles (near 50 character limit) display and save properly

### Error Conditions

- Save fails due to API error - error message displayed, form remains open with data
- Network timeout during save - appropriate feedback with retry option
- Invalid data submitted - validation errors displayed inline
- Concurrent edit conflict (optimistic locking) - appropriate conflict resolution message
- Required fields cleared - save button becomes disabled

---

**Created:** 2025-10-17
**Last Updated:** 2025-10-23
**Status:** Not Started
