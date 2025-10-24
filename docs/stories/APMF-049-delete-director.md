# Story APMF-049: Delete Director

**Story ID:** APMF-049
**Feature:** [APMF-046 - Admin Director Management](../features/apm/APMF-046-director-management.md)
**Epic:** [APM-001 - League Participant Management](../epics/APM-001-admin-people-management.md)
**Azure Boards:** [Story #49](https://dev.azure.com/rsalit1516/Hoops/_workitems/edit/49)

**Story Points:** 2
**Priority:** Medium

## User Story

As an administrator, I want to delete director records when they are no longer serving on the board so that the public-facing director list remains current.

## Acceptance Criteria

- [ ] Directors list provides "Delete" action for each director record
- [ ] Clicking "Delete" displays a confirmation dialog
- [ ] Confirmation dialog shows:
  - [ ] Director name and title being deleted
  - [ ] Warning message about permanent deletion
  - [ ] "Confirm Delete" and "Cancel" buttons
- [ ] Clicking "Cancel" closes dialog without deleting
- [ ] Clicking "Confirm Delete" removes the director from the database
- [ ] After successful delete, director is removed from the list
- [ ] Success message displays after successful deletion
- [ ] Failed delete displays error message and keeps record in list
- [ ] Loading indicator displays during delete operation

## Definition of Done

- [ ] Unit tests written and passing (>80% coverage)
- [ ] BDD scenarios implemented and passing
- [ ] Code reviewed and approved
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Manual testing completed

## Dependencies

- **Blocked by:** APMF-046 (View Directors List)
- **Blocks:** None
- **Related:** APMF-047 (Add New Director), APMF-048 (Edit Director)

## Technical Implementation

### Components

- **Primary:** `DirectorDeleteDialog` - Confirmation dialog component
- **Supporting:** `AdminDirectorsList` - List component with delete action
- **Supporting:** `ConfirmationDialog` - Reusable confirmation dialog (if available)

### Services

- `DirectorService` - API integration for deleting director records
- `DirectorStateService` - Update client-side state after deletion

### Models/Interfaces

- `Director` - Director entity interface
- `DeleteConfirmationData` - Data passed to confirmation dialog

## Related Files

- **BDD Feature:** [APMF-049-delete-director.feature](../features/apm/APMF-049-delete-director.feature)
- **Component:** `/src/app/admin/directors/director-delete-dialog/`
- **Service:** `/src/app/admin/directors/services/director.service.ts`

## Technical Notes

- Use Angular Material Dialog for confirmation
- Consider implementing soft delete (IsActive flag) instead of hard delete for audit trail
- If using soft delete, ensure public director list filters out inactive records
- Use optimistic updates with rollback on error
- Ensure proper error handling for foreign key constraints (if director is referenced elsewhere)
- Display appropriate error message if deletion fails due to dependencies

## Test Scenarios

### Happy Path

- Admin clicks "Delete" on a director record
- Confirmation dialog appears with director name and title
- Admin clicks "Confirm Delete"
- Director is removed from the list
- Success message displays

### Edge Cases

- Deleting the last director in the list (empty state should appear)
- Rapid successive delete operations (prevent double-delete)
- Deleting while another admin is editing the same record (handle gracefully)

### Error Conditions

- Delete fails due to API error - error message displayed, record remains in list
- Network timeout during delete - appropriate feedback with retry option
- Director record has dependencies (if applicable) - specific error message about dependencies
- Concurrent delete by another admin - handle conflict gracefully (record already deleted)

---

**Created:** 2025-10-17
**Last Updated:** 2025-10-23
**Status:** Not Started
