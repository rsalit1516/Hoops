# Story APMF-046: View Directors List with Sort and Pagination

**Story ID:** APMF-046
**Feature:** [APMF-046 - Admin Director Management](../features/apm/APMF-046-director-management.md)
**Epic:** [APM-045 - League Participant Management](../epics/APM-045-admin-people-management.md)  
**Azure Boards:** [Story #46](https://dev.azure.com/rsalit1516/Hoops/_workitems/edit/46)

**Story Points:** 5  
**Priority:** High

## User Story

As an administrator, I want to view a list of all directors with sorting and pagination capabilities so that I can efficiently browse and manage director information.

## Acceptance Criteria

- [ ] Directors list displays all directors in a table format
- [ ] Table includes columns: Name, Title, Email, Phone, Active Status
- [ ] Users can sort by any column (ascending/descending)
- [ ] Pagination controls display at bottom of list (e.g., 25, 50, 100 items per page)
- [ ] List shows total director count
- [ ] Default sort is by Last Name ascending
- [ ] Loading indicator appears while data is fetching
- [ ] Empty state message displays when no directors exist
- [ ] List is responsive on mobile devices

## Definition of Done

- [ ] Unit tests written and passing (>80% coverage)
- [ ] BDD scenarios implemented and passing
- [ ] Code reviewed and approved
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Manual testing completed

## Dependencies

- **Blocked by:** None
- **Blocks:** APMF-047 (Add New Director), APMF-048 (Edit Director)
- **Related:** None

## Dependencies

- **Blocked by:** None
- **Blocks:** APMF-047 (Add New Director), APMF-048 (Edit Director)
- **Related:** None

## Technical Implementation

### Components

- **Primary:** `AdminDirectorsList` - Main list component with table display
- **Supporting:** `DirectorTableComponent` - Reusable table with sort/pagination
- **Supporting:** `PaginationControlsComponent` - Pagination UI controls

### Services

- `DirectorService` - API integration for fetching director data
- `DirectorStateService` - Client-side state management using Angular Signals

### Models/Interfaces

- `Director` - Director entity interface
- `DirectorListParams` - Query parameters for sorting and pagination
- `PagedDirectorResponse` - API response with pagination metadata

## Related Files

- **BDD Feature:** [APMF-046-create-list-for-directors-in-admin.feature](../features/apm/APMF-046-create-list-for-directors-in-admin.feature)
- **Component:** `/src/app/admin/directors/admin-directors-list/`
- **Service:** `/src/app/admin/directors/services/director.service.ts`

## Technical Notes

- Use Angular Material Table for consistent UI with other admin modules
- Implement server-side pagination for scalability (anticipate 50+ directors over time)
- Use Angular Signals for reactive state management
- Store sort/pagination preferences in session storage for UX continuity
- Default page size: 25 directors per page
- Sort indicator (arrows) should be clearly visible in column headers

## Test Scenarios

### Happy Path

- Admin navigates to Directors list from admin menu
- List loads with all directors displayed in default sort order (Last Name A-Z)
- Admin clicks column header to sort by that column
- Admin selects different page size from dropdown
- Admin navigates between pages using pagination controls

### Edge Cases

- Empty director list shows appropriate empty state with "Add Director" CTA
- Single director in list (no pagination needed)
- Exactly 25, 26 directors (pagination boundary testing)
- Very long director names don't break table layout
- Rapid clicking on sort headers doesn't cause race conditions

### Error Conditions

- API failure shows error message with retry option
- Network timeout displays appropriate feedback
- Partial data load is handled gracefully (show what loaded + error)
- Invalid sort parameter falls back to default sort

---

**Created:** 2025-10-17  
**Last Updated:** 2025-10-17  
**Status:** Not Started
