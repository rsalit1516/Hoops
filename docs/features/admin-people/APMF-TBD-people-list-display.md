# Feature APMF-TBD: People List Display

**Feature ID:** APMF-TBD (Awaiting Azure Boards Assignment)
**Epic:** [APM-001](../../epics/APM-001-admin-people-management.md)
**Azure Boards:** [Feature #TBD](https://dev.azure.com/rsalit1516/Hoops/_workitems/edit/TBD)

**Product Area:** Admin People Management
**Priority:** High

## Feature Overview

The People List Display feature provides the main interface for viewing and interacting with people records in the admin module. It displays filtered people results in a table format with pagination, allows navigation to individual person details, and provides quick access to player registration functionality.

## Business Value

A well-designed list interface is essential for efficient people management. Administrators need to quickly scan multiple records, access detailed information, and perform common actions like player registration. This feature serves as the primary navigation hub for all people-related administrative tasks.

## User Stories in Feature

| Story ID  | Title                                             | Points | Status      |
| --------- | ------------------------------------------------- | ------ | ----------- |
| APMF-TBD1 | Display People List with Pagination               | 5      | Not Started |
| APMF-TBD2 | Navigate to Person Detail from List Row           | 2      | Not Started |
| APMF-TBD3 | Register Player from List (Player Records Only)   | 3      | Not Started |

**Total Points:** 10

## Technical Architecture

### Components

- `AdminPeopleList` - Main container component coordinating filters, list display, and pagination
- `PeopleTable` - Table component displaying people records with sortable columns
- `PaginationControls` - Reusable pagination component with page size selection
- `RegisterButton` - Conditional action button for player records

### Services

- `PeopleService` - API integration for fetching paginated people data
- `PeopleStateService` - Client-side state management using Angular Signals
- `RegistrationService` - Navigation and state management for player registration

### Database Changes

- No schema changes required
- Ensure proper indexing on commonly sorted columns for performance

## Acceptance Criteria

- [ ] People list displays in paginated table format
- [ ] Pagination controls allow selection of 10, 25, or 50 records per page (default: 10)
- [ ] Clicking a table row navigates to person detail view
- [ ] "Register" button displays only for people who are players
- [ ] "Register" button navigates to player registration page with person context
- [ ] List updates when filters are applied
- [ ] Loading indicator displays during data fetch
- [ ] Empty state displays when no people match filters
- [ ] Table is responsive on mobile devices

## Technical Notes

- Use Angular Material Table for consistent UI
- Implement server-side pagination for scalability
- Store pagination state in session storage for navigation continuity
- Use Angular Signals for reactive state management
- "Register" button should only appear when `Person.IsPlayer === true`
- Navigation to registration should pass `PersonId` as route parameter
- Consider implementing virtual scrolling for very large result sets

---

**Created:** 2025-10-23
**Last Updated:** 2025-10-23
**Status:** Not Started

**Note:** Feature ID and Story IDs are pending assignment in Azure Boards.
