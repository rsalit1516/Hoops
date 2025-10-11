# Story APMF-002: Filter People by First Name

**Story ID:** APMF-002  
**Epic:** APM-001 - Admin People Management  
**Feature Area:** Admin People  
**Sprint:** TBD  
**Story Points:** 2  
**Priority:** Medium  
**Assignee:** TBD  

## User Story
As an administrator, I want to filter the people list by first name so that I can find people when I only know their first name.

## Acceptance Criteria
- [ ] First name filter field is visible on the Admin People List page
- [ ] Entering text in the first name filter immediately updates the list
- [ ] Filter matches people whose first name starts with the entered text (prefix matching)
- [ ] Filter is case-insensitive
- [ ] Clear button removes the filter and shows all people
- [ ] First name filter works independently of last name filter
- [ ] Both filters can be used simultaneously (AND operation)
- [ ] Filter input is debounced by 300ms
- [ ] Loading indicator shows while filter is processing

## Definition of Done
- [ ] Unit tests written and passing (>80% coverage)
- [ ] BDD scenarios implemented and passing
- [ ] Code reviewed and approved by senior developer
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Documentation updated
- [ ] Manual testing completed
- [ ] Performance requirements verified
- [ ] Security review completed

## Dependencies
- **Blocked by:** APMF-001 (shares same filtering infrastructure)
- **Blocks:** None
- **Related:** APMF-001 (Filter People by Last Name)

## Technical Implementation
### Components
- **Primary:** `PeopleFilter` - Extend existing component with first name field
- **Supporting:** `AdminPeopleList` - Update to handle multiple filter criteria

### Services
- **Data:** `PeopleService` - Update API to support first name filtering
- **Business Logic:** `PeopleFilterService` - Extend to combine multiple filters

### Models/Interfaces
- `PeopleFilterCriteria` - Add firstName property to existing interface

## Related Files
- **BDD Feature:** [/docs/features/admin-people/APMF-002-people-firstname-filter.feature](../features/admin-people/APMF-002-people-firstname-filter.feature)
- **Component:** `/src/app/admin/people/components/people-filter/people-filter.ts`
- **Service:** `/src/app/admin/people/services/people-filter.service.ts`
- **Spec Files:** `/src/app/admin/people/components/people-filter/people-filter.spec.ts`

## Technical Notes
- Reuse existing filter infrastructure from APMF-001
- Combine filters with AND logic (both first AND last name must match)
- Update API endpoint to accept multiple filter parameters
- Ensure proper URL encoding for filter parameters

## Test Scenarios
### Happy Path
- User enters "Joh" and sees all people with first names starting with "Joh"
- User enters both first and last name filters for precise matching

### Edge Cases
- Using first name filter alone
- Using first and last name filters together
- Clearing one filter while keeping the other

### Error Conditions
- API errors are handled consistently with last name filter
- Invalid characters in first name input are handled

---
**Created:** 2025-10-11  
**Last Updated:** 2025-10-11  
**Status:** Not Started