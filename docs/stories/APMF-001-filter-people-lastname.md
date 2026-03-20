# Story APMF-52: Filter People by Last Name

**Story ID:** APMF-52
**Feature:** [APMF-50 - Admin People Management](../features/admin-people/APMF-001-admin-people-management.md)
**Epic:** [APM-45 - League Participant Management](../epics/APM-045-admin-people-management.md)
**Azure Boards:** [Story 52](https://dev.azure.com/rsalit1516/Hoops/_workitems/edit/52)

**Story Points:** 3
**Priority:** High

## User Story

As an administrator, I want to filter the people list by last name so that I can quickly find specific individuals when managing league data.

## Acceptance Criteria

- [ ] Last name filter field is visible on the Admin People List page
- [ ] Entering text in the last name filter immediately updates the list
- [ ] Filter matches people whose last name starts with the entered text (prefix matching)
- [ ] Filter is case-insensitive (Smith matches smith, SMITH, etc.)
- [ ] Clear button removes the filter and shows all people
- [ ] Filter state persists during session navigation
- [ ] Filter input is debounced by 300ms to avoid excessive API calls
- [ ] Loading indicator shows while filter is processing
- [ ] Empty state message appears when no matches are found

## Definition of Done

- [ ] Unit tests written and passing (>80% coverage)
- [ ] BDD scenarios implemented and passing
- [ ] Code reviewed and approved by senior developer
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Documentation updated
- [ ] Manual testing completed
- [ ] Performance requirements verified (<500ms response time)
- [ ] Security review completed (admin-only access)

## Dependencies

- **Blocked by:** None
- **Blocks:** None
- **Related:** APMF-002 (Filter People by First Name), APMF-003 (Alphabet Navigation)

## Technical Implementation

### Components

- **Primary:** `PeopleFilter` - Reactive form component with debounced input
- **Supporting:** `AdminPeopleList` - Container component that uses the filter

### Services

- **Data:** `PeopleService` - API integration for filtered people queries
- **Business Logic:** `PeopleFilterService` - Client-side filtering logic and state management

### Models/Interfaces

- `PeopleFilterCriteria` - Interface for filter parameters
- `FilteredPeopleResponse` - API response interface

## Related Files

- **BDD Feature:** [/docs/features/admin-people/APMF-001-people-lastname-filter.feature](../features/admin-people/APMF-001-people-lastname-filter.feature)
- **Component:** `/src/app/admin/people/components/people-filter/people-filter.ts`
- **Service:** `/src/app/admin/people/services/people-filter.service.ts`
- **Spec Files:** `/src/app/admin/people/components/people-filter/people-filter.spec.ts`

## Technical Notes

- Use Angular reactive forms for filter implementation
- Implement client-side caching for recently filtered results
- Consider server-side filtering for large datasets (>1000 people)
- Use RxJS debounceTime operator for input debouncing
- Store filter state in component state (not localStorage for this story)

## Test Scenarios

### Happy Path

- User enters "Smi" and sees all people with last names starting with "Smi"
- Filter updates in real-time as user types

### Edge Cases

- Empty input shows all people
- No matches shows appropriate empty state
- Very long input (>50 characters) is handled gracefully
- Special characters in names are handled correctly

### Error Conditions

- API failure shows error message with retry option
- Network timeout displays appropriate feedback
- Malformed API response is handled gracefully

---

**Created:** 2025-10-11  
**Last Updated:** 2025-10-11  
**Status:** Not Started
