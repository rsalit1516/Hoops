# Story APMF-54: Alphabet Navigation for People List

**Story ID:** APMF-54
**Feature:** [APMF-001 - Admin People Management](../features/admin-people/APMF-001-admin-people-management.md)
**Epic:** [APM-045 - League Participant Management](../epics/APM-045-admin-people-management.md)
**Azure Boards:** [Story #54](https://dev.azure.com/rsalit1516/Hoops/_workitems/edit/54)

**Story Points:** 3
**Priority:** Medium

## User Story

As an administrator, I want to click on alphabet letters to filter the people list by the first letter of their last name so that I can quickly navigate through large lists of people.

## Acceptance Criteria

- [ ] Alphabet navigation (A-Z) is visible above the people list
- [ ] Clicking a letter filters people whose last name starts with that letter
- [ ] Active letter is visually highlighted
- [ ] "All" button shows all people and clears alphabet filter
- [ ] Alphabet filter works independently of text-based name filters
- [ ] State persistence: selected letter is maintained during session navigation
- [ ] Letters with no matching people are visually distinguished (grayed out)
- [ ] Responsive design works on mobile devices
- [ ] Keyboard navigation support (tab through letters)

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

- **Blocked by:** None
- **Blocks:** None
- **Related:** APMF-001 (Filter People by Last Name) - shares filtering infrastructure

## Technical Implementation

### Components

- **Primary:** `AlphabetNavigation` - New standalone component for letter navigation
- **Supporting:** `AdminPeopleList` - Container that coordinates alphabet and text filters

### Services

- **Data:** `PeopleService` - Extend to support alphabet-based filtering
- **Business Logic:** `PeopleFilterService` - Add alphabet filter to existing filter logic

### Models/Interfaces

- `PeopleFilterCriteria` - Add alphabetFilter property
- `AlphabetState` - Interface for tracking selected letter and available letters

## Related Files

- **BDD Feature:** [/docs/features/admin-people/APMF-003-alphabet-navigation.feature](../features/admin-people/APMF-003-alphabet-navigation.feature)
- **Component:** `/src/app/admin/people/components/alphabet-navigation/alphabet-navigation.ts`
- **Service:** `/src/app/admin/people/services/people-filter.service.ts`
- **Spec Files:** `/src/app/admin/people/components/alphabet-navigation/alphabet-navigation.spec.ts`

## Technical Notes

- Store selected letter in localStorage for session persistence
- Use server-side filtering to get count of people per letter for graying out
- Implement as reusable component that could be used in other admin modules
- Clear alphabet filter when text-based filters are applied (or vice versa)
- Use CSS Grid for responsive alphabet layout

## Test Scenarios

### Happy Path

- User clicks "S" and sees all people with last names starting with "S"
- User clicks "All" to return to full list
- Selected letter remains highlighted until user selects different letter

### Edge Cases

- Letters with zero people are disabled/grayed
- Clicking already selected letter has no effect
- Mobile touch interaction works correctly
- Keyboard navigation through letters works

### Error Conditions

- API failure while getting letter counts handled gracefully
- localStorage unavailable doesn't break functionality
- Invalid letter selection is ignored

---

**Created:** 2025-10-11  
**Last Updated:** 2025-10-11  
**Status:** Not Started
