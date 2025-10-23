# Feature APMF-001: People Filtering

**Feature ID:** APMF-001
**Epic:** [APM-001](../../epics/APM-001-admin-people-management.md)
**Azure Boards:** [Feature #TBD](https://dev.azure.com/rsalit1516/Hoops/_workitems/edit/TBD)

**Product Area:** Admin People Management
**Priority:** High

## Feature Overview

The People Filtering feature provides administrators with text-based search capabilities to filter the people list by last name and first name. This enables quick location of specific individuals when managing league data, reducing search time and improving administrative efficiency.

## Business Value

Filtering by name is a fundamental requirement for efficient people management. Administrators frequently need to find specific individuals among hundreds of league participants. Providing fast, intuitive name-based filtering reduces administrative overhead and improves data management accuracy.

## User Stories in Feature

| Story ID | Title                       | Points | Status      |
| -------- | --------------------------- | ------ | ----------- |
| APMF-001 | Filter People by Last Name  | 3      | Not Started |
| APMF-002 | Filter People by First Name | 2      | Not Started |

**Total Points:** 5

## Technical Architecture

### Components

- `PeopleFilter` - Reactive form component with debounced input fields for last name and first name
- `AdminPeopleList` - Container component that coordinates filtering and list display
- `PeopleFilterControls` - UI controls for filter inputs and clear actions

### Services

- `PeopleService` - API integration for filtered people queries
- `PeopleFilterService` - Client-side filtering logic, state management, and debouncing

### Database Changes

- Ensure proper indexing on `Person.LastName` and `Person.FirstName` columns for query performance
- Consider full-text indexing if prefix matching becomes a performance bottleneck

## Acceptance Criteria

- [ ] Administrators can filter people list by last name using prefix matching
- [ ] Administrators can filter people list by first name using prefix matching
- [ ] Both filters can be used simultaneously (AND operation)
- [ ] Filtering is case-insensitive
- [ ] Filter inputs are debounced to avoid excessive API calls
- [ ] Clear functionality removes all filters and returns to default view
- [ ] Loading indicators display during filter processing
- [ ] Empty state displays when no matches are found
- [ ] Filter state persists during session navigation

## Technical Notes

- Use Angular reactive forms for filter implementation
- Implement RxJS debounceTime (300ms) for input debouncing
- Use server-side filtering for scalability with large datasets
- Combine multiple filter criteria with AND logic on the server
- Store filter state in session storage for persistence
- Ensure proper URL encoding for filter parameters
- Consider implementing client-side caching for recently filtered results

---

**Created:** 2025-10-23
**Last Updated:** 2025-10-23
**Status:** Not Started
