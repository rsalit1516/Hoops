# Feature APMF-046: Director Management

**Feature ID:** APMF-046  
**Epic:** [APM-001](../../epics/APM-001-admin-people-management.md)  
**Azure Boards:** [Feature #45](https://dev.azure.com/rsalit1516/Hoops/_workitems/edit/45)

**Product Area:** Admin People Management  
**Priority:** High

## Feature Overview

The Director Management feature provides administrators with the ability to manage league directors through a dedicated interface. This includes viewing a list of current directors, adding new directors, editing director information, and removing directors when necessary. The director list is publicly visible on the website, making accurate management critical for league transparency.

## Business Value

Enables efficient management of the director list which is exposed on the public side of the app. Improves data accuracy and reduces administrative overhead when maintaining director information. Public users seeking information on league directors will have access to current, accurate information.

## User Stories in Feature

| Story ID | Title                                        | Points | Status      |
| -------- | -------------------------------------------- | ------ | ----------- |
| APMF-046 | View Directors List with Sort and Pagination | 5      | Not Started |
| APMF-047 | Add New Director                             | 3      | Not Started |
| APMF-048 | Edit Director Information                    | 3      | Not Started |
| APMF-049 | Delete Director                              | 2      | Not Started |

**Total Points:** 13

## Technical Architecture

### Components

- `AdminDirectorsList` - Main list component with table, sorting, and pagination
- `DirectorForm` - Reusable form component for add/edit operations
- `DirectorDetail` - View component for director information
- `DirectorDeleteDialog` - Confirmation dialog for delete operations

### Services

- `DirectorService` - API integration for director CRUD operations
- `DirectorStateService` - Client-side state management for director data

### Database Changes

- Uses existing `Director` table
- No schema changes required
- Ensure proper indexing on commonly sorted/filtered columns

## Acceptance Criteria

- [ ] Administrators can view a complete list of directors with sorting and pagination
- [ ] Administrators can add new directors with proper validation
- [ ] Administrators can edit existing director information
- [ ] Administrators can delete directors with confirmation
- [ ] All changes are persisted to the database
- [ ] Director information is publicly visible on the website
- [ ] Interface is responsive and accessible (WCAG 2.1 AA)

## Technical Notes

- Reuse existing form patterns from other admin modules for consistency
- Implement optimistic updates for better UX
- Use Angular reactive forms for validation
- Consider implementing soft delete for audit trail
- Director list should load efficiently with server-side pagination for large datasets

---

**Created:** 2025-10-17  
**Last Updated:** 2025-10-17  
**Status:** Not Started
