# Feature APMF-001: Admin People Management

**Feature ID:** APMF-001
**Epic:** [APM-001 - League Participant Management](../../epics/APM-001-admin-people-management.md)
**Azure Boards:** [Feature #TBD](https://dev.azure.com/rsalit1516/Hoops/_workitems/edit/TBD)

**Product Area:** League Participant Management
**Priority:** High

## Feature Overview

The Admin People Management feature provides administrators with comprehensive tools to manage individual people in the league database. This includes searching and filtering people, viewing detailed person information, editing person data, and managing participant records. The feature serves as the primary interface for all person-level data management within the league system.

## Business Value

Efficient people management is fundamental to league operations. Administrators need to quickly find, view, and update information for hundreds of participants across multiple seasons. This feature reduces the time to locate and manage participant data from minutes to seconds, improves data accuracy through better editing tools, and provides a foundation for other administrative functions like registration, team management, and reporting.

## User Stories in Feature

| Story ID | Title                                    | Points | Status      |
| -------- | ---------------------------------------- | ------ | ----------- |
| APMF-52  | Filter People by Last Name               | 3      | Closed      |
| APMF-53  | Filter People by First Name              | 2      | Closed      |
| APMF-54  | Alphabet Navigation for People List      | 3      | Closed      |
| APMF-55  | Display People List with Pagination      | 5      | Closed      |
| APMF-56  | Navigate to Person Detail from List Row  | 2      | Closed      |
| APMF-57  | Register Player from List (Players Only) | 3      | Not Started |
| APMF-58  | View Person Detail Information           | 3      | Closed      |
| APMF-59  | Edit Person Information with Validation  | 5      | In Progress |
| APMF-60  | Save Person Changes to Database          | 3      | Not Started |
| APMF-61  | Cancel Edit and Return to List           | 1      | Closed      |

**Total Points:** ~30 (estimated)

**Note:** Story IDs marked TBD require assignment in Azure Boards.

## Technical Architecture

### Components

- `AdminPeopleList` - Main container component coordinating filters, list display, and pagination
- `PeopleFilter` - Reactive form component with debounced input fields (last name, first name)
- `AlphabetNavigation` - Letter-based navigation component for quick filtering
- `PeopleTable` - Table component displaying people records with sortable columns
- `PaginationControls` - Reusable pagination component with page size selection
- `PersonDetail` - Main component displaying person information in read/edit modes
- `PersonForm` - Reactive form component with validation rules
- `PersonActions` - Action buttons (Save, Cancel, Register)

### Services

- `PeopleService` - API integration for people CRUD operations and filtered queries
- `PeopleFilterService` - Client-side filtering logic, state management, and debouncing
- `PeopleStateService` - Client-side state management using Angular Signals
- `PersonValidationService` - Client-side validation rules for person data
- `RegistrationService` - Navigation and state management for player registration

### Database Changes

- Ensure proper indexing on `Person.LastName` and `Person.FirstName` columns for query performance
- Ensure audit fields (`ModifiedBy`, `ModifiedDate`) are updated on person data changes
- Consider full-text indexing if prefix matching becomes a performance bottleneck
- Optimize queries for large dataset pagination

## Acceptance Criteria

- [ ] Administrators can filter people by last name using prefix matching (case-insensitive)
- [ ] Administrators can filter people by first name using prefix matching (case-insensitive)
- [ ] Both filters can be used simultaneously (AND operation)
- [ ] Alphabet navigation allows quick filtering by first letter of last name
- [ ] People list displays in paginated table format with configurable page sizes (10, 25, 50)
- [ ] Clicking a table row navigates to person detail view
- [ ] "Register" action is available only for people who are players
- [ ] Person detail page displays all relevant person information
- [ ] Edit mode allows updating person data with proper validation
- [ ] Save operation persists changes with success confirmation
- [ ] Cancel operation returns to list without saving
- [ ] All filter and pagination state persists during navigation
- [ ] Loading indicators display during data fetch operations
- [ ] Empty states display appropriately when no data matches filters
- [ ] Interface is responsive on mobile devices
- [ ] All functionality meets WCAG 2.1 AA accessibility requirements

## Technical Notes

- Use Angular reactive forms for filter and edit implementations
- Implement RxJS debounceTime (300ms) for filter input debouncing
- Use server-side filtering and pagination for scalability (anticipate 2000+ people)
- Store filter and pagination state in session storage for navigation continuity
- Use Angular Signals for reactive state management (preferred over NgRx for new features)
- Use Angular Material components for consistent UI with other admin modules
- Implement unsaved changes guard to prevent accidental navigation away from edits
- Use optimistic updates with rollback on error for better UX
- Ensure proper error handling and user feedback for all async operations
- Default sort: Last Name ascending
- Default page size: 10 people per page
- "Register" button visibility based on `Person.IsPlayer === true`

---

**Created:** 2025-10-23
**Last Updated:** 2025-10-23
**Status:** Not Started
