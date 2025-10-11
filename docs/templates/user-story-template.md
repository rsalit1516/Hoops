# Story {STORY_ID}: {Short Story Title}

**Story ID:** {STORY_ID}  
**Epic:** {EPIC_NAME}  
**Feature Area:** {FEATURE_AREA}  
**Sprint:** {SPRINT_NUMBER or TBD}  
**Story Points:** {1-13}  
**Priority:** {Critical|High|Medium|Low}  
**Assignee:** {DEVELOPER_NAME or TBD}  

## User Story
As a {user_type}, I want {functionality} so that {business_value}.

## Acceptance Criteria
- [ ] {Criterion 1 - specific, testable behavior}
- [ ] {Criterion 2 - specific, testable behavior}
- [ ] {Criterion 3 - specific, testable behavior}
- [ ] {Add more as needed}

## Definition of Done
- [ ] Unit tests written and passing (>80% coverage)
- [ ] BDD scenarios implemented and passing
- [ ] Code reviewed and approved by senior developer
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Documentation updated
- [ ] Manual testing completed
- [ ] Performance requirements verified
- [ ] Security review completed (if applicable)

## Dependencies
- **Blocked by:** {STORY_ID, STORY_ID} or None
- **Blocks:** {STORY_ID, STORY_ID} or None
- **Related:** {STORY_ID, STORY_ID} or None

## Technical Implementation
### Components
- **Primary:** `{ComponentName}` - {brief description}
- **Supporting:** `{SupportingComponent}` - {brief description}

### Services
- **Data:** `{ServiceName}` - {brief description}
- **Business Logic:** `{ServiceName}` - {brief description}

### Models/Interfaces
- `{InterfaceName}` - {brief description}

## Related Files
- **BDD Feature:** [/docs/features/{feature-area}/{story-id}-{feature-name}.feature](../features/{feature-area}/{story-id}-{feature-name}.feature)
- **Component:** `/src/app/{path}/`
- **Service:** `/src/app/{path}/`
- **Spec Files:** `/src/app/{path}/*.spec.ts`

## Technical Notes
{Any implementation details, constraints, or architectural considerations}

## Test Scenarios
### Happy Path
- {Description of normal user flow}

### Edge Cases
- {Edge case 1}
- {Edge case 2}

### Error Conditions
- {Error condition 1}
- {Error condition 2}

---
**Created:** {YYYY-MM-DD}  
**Last Updated:** {YYYY-MM-DD}  
**Status:** {Not Started|In Progress|In Review|Done|Blocked}