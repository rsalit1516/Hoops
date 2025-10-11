# Story APMF-001: Filter People by Last Name

**Story ID:** APMF-001  
**Epic:** APM-001  
**Feature Area:** Admin People Management  
**Sprint:** Sprint 23  
**Story Points:** 3  
**Priority:** Medium  
**Assignee:** John Developer  

## User Story
As an administrator, I want to filter the people list by last name so that I can quickly find specific individuals when managing league data.

## Acceptance Criteria
- [ ] Last name filter field is visible on the Admin People List page
- [ ] Entering text in the last name filter immediately updates the list (debounced by 300ms)
- [ ] Filter matches people whose last name starts with the entered text (case-insensitive)
- [ ] Clear button removes the filter and shows all people
- [ ] Filter state persists during session navigation
- [ ] Loading indicator shows while filter is being applied
- [ ] Empty state message displays when no matches found

## Definition of Done
- [ ] Unit tests written and passing (>80% coverage)
- [ ] BDD scenarios implemented and passing
- [ ] Code reviewed and approved by senior developer
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Documentation updated
- [ ] Manual testing completed
- [ ] Performance requirements verified (<500ms filter response)
- [ ] Security review completed (if applicable)

## Dependencies
- **Blocked by:** None
- **Blocks:** APMF-002 (First name filter depends on filter architecture)
- **Related:** APMF-003 (Player status filter uses same component pattern)

## Technical Implementation
### Components
- **Primary:** `PeopleFilter` - Reactive form component with debounced input
- **Supporting:** `PeopleList` - Displays filtered results with loading states

### Services
- **Data:** `PeopleService` - Handles API calls to filter endpoint
- **Business Logic:** `FilterService` - Manages filter state and debouncing logic

### Models/Interfaces
- `FilterCriteria` - Interface for filter parameters
- `Person` - Existing person model with filtering support

## Related Files
- **BDD Feature:** [/docs/features/admin-people/APMF-001-people-lastname-filter.feature](../features/admin-people/APMF-001-people-lastname-filter.feature)
- **Component:** `/src/app/admin/people/components/people-filter/people-filter.ts`
- **Service:** `/src/app/admin/people/services/people-filter.service.ts`
- **Spec Files:** `/src/app/admin/people/components/people-filter/people-filter.spec.ts`

## Technical Notes
- Use Angular reactive forms with FormControl for filter input
- Implement debouncing with rxjs debounceTime operator (300ms)
- Store filter state in service for persistence across navigation
- Use Angular signals for reactive state management
- Implement client-side filtering if dataset is small (<1000 records)
- Add proper ARIA labels for screen reader accessibility

## Test Scenarios
### Happy Path
- User enters "Smi" in last name filter, sees all people with last names starting with "Smi"

### Edge Cases
- Empty filter shows all people
- Filter with no matches shows empty state message
- Special characters in filter input are handled correctly
- Very long filter strings are truncated appropriately

### Error Conditions
- API error shows user-friendly message and allows retry
- Network timeout shows appropriate loading states

## Implementation Traceability

| Artifact Type | File Path | Status | Notes |
|---------------|-----------|---------|-------|
| BDD Feature | `/docs/features/admin-people/APMF-001-people-lastname-filter.feature` | ✅ Complete | All scenarios passing |
| Component | `/src/app/admin/people/components/people-filter/people-filter.ts` | ✅ Complete | Reactive form implementation |
| Template | `/src/app/admin/people/components/people-filter/people-filter.html` | ✅ Complete | Accessibility compliant |  
| Styles | `/src/app/admin/people/components/people-filter/people-filter.scss` | ✅ Complete | Tailwind utility classes |
| Unit Tests | `/src/app/admin/people/components/people-filter/people-filter.spec.ts` | ✅ Complete | 95% coverage |
| E2E Tests | `/tests/e2e/admin-people/APMF-001-lastname-filter.e2e-spec.ts` | ✅ Complete | All scenarios automated |
| Service | `/src/app/admin/people/services/people-filter.service.ts` | ✅ Complete | Debounced filtering logic |
| API Endpoint | `/src/Hoops.Api/Controllers/PeopleController.cs` | ✅ Complete | GET /api/people/filter |

---
**Created:** 2025-10-11  
**Last Updated:** 2025-10-11  
**Status:** Done