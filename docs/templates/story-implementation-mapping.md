# Story-to-Implementation Mapping Guide

## Overview
This document defines how user stories link to their implementation artifacts, ensuring traceability from business requirements through to deployed code.

## Mapping Structure

### Story → Implementation Artifacts
Each story should maintain links to:

```
Story {STORY_ID}
├── BDD Feature File (.feature)
├── Angular Components (.ts, .html, .scss)  
├── Services & Models (.ts)
├── Unit Tests (.spec.ts)
├── E2E Tests (.e2e-spec.ts)
├── API Endpoints (if applicable)
└── Database Changes (if applicable)
```

## File Naming Conventions

### Stories
- **Location:** `/docs/stories/`
- **Format:** `{STORY_ID}-{short-description}.md`
- **Example:** `AP-001-filter-people-by-lastname.md`

### BDD Features  
- **Location:** `/docs/features/{epic-area}/`
- **Format:** `{STORY_ID}-{feature-name}.feature`
- **Example:** `AP-001-people-lastname-filter.feature`

### Components
- **Location:** `/src/app/{feature-area}/`
- **Format:** `{component-name}.{ts|html|scss|spec.ts}`
- **Example:** `people-filter.ts, people-filter.html, people-filter.scss, people-filter.spec.ts`

### E2E Tests
- **Location:** `/tests/e2e/{feature-area}/`
- **Format:** `{STORY_ID}-{test-name}.e2e-spec.ts`
- **Example:** `AP-001-lastname-filter.e2e-spec.ts`

## Traceability Matrix Template

Create this in each story file:

```markdown
## Implementation Traceability

| Artifact Type | File Path | Status | Notes |
|---------------|-----------|---------|-------|
| BDD Feature | `/docs/features/admin-people/AP-001-people-lastname-filter.feature` | ✅ Complete | All scenarios passing |
| Component | `/src/app/admin/people/people-filter.ts` | ✅ Complete | Reactive form implementation |
| Template | `/src/app/admin/people/people-filter.html` | ✅ Complete | Accessibility compliant |  
| Styles | `/src/app/admin/people/people-filter.scss` | ✅ Complete | Tailwind classes |
| Unit Tests | `/src/app/admin/people/people-filter.spec.ts` | ✅ Complete | 95% coverage |
| E2E Tests | `/tests/e2e/admin-people/AP-001-lastname-filter.e2e-spec.ts` | ✅ Complete | All scenarios automated |
| Service | `/src/app/shared/services/people-filter.service.ts` | ✅ Complete | Debounced filtering |
| API Endpoint | `/src/Hoops.Api/Controllers/PeopleController.cs` | ✅ Complete | GET /api/people/filter |
```

## Linking Examples

### In Story Files
```markdown
## Related Files
- **Epic:** [EPM-001: Admin People Management](../epics/EPM-001-admin-people-management.md)
- **BDD Feature:** [AP-001 People Filter](../features/admin-people/AP-001-people-lastname-filter.feature)
- **Component:** `/src/app/admin/people/people-filter.ts`
- **Tests:** `/src/app/admin/people/people-filter.spec.ts`
- **E2E:** `/tests/e2e/admin-people/AP-001-lastname-filter.e2e-spec.ts`
```

### In BDD Feature Files
```gherkin
# Related Story: AP-001
# Component: PeopleFilter (/src/app/admin/people/people-filter.ts)
# E2E Test: /tests/e2e/admin-people/AP-001-lastname-filter.e2e-spec.ts
Feature: Filter people by last name
```

### In Component Files
```typescript
/**
 * People Filter Component
 * 
 * Related Story: AP-001 - Filter People by Last Name
 * Epic: EPM-001 - Admin People Management
 * BDD Feature: /docs/features/admin-people/AP-001-people-lastname-filter.feature
 * 
 * @component PeopleFilter
 */
```

## Automated Link Validation

Consider creating a script to validate that all links in story files point to existing artifacts:

```bash
# Check if all linked files exist
./scripts/validate-story-links.sh AP-001
```

## Git Commit Message Convention

Link commits to stories:
```
feat(AP-001): implement people lastname filter

- Add reactive form for filter input
- Implement debounced filtering service  
- Add unit tests with 95% coverage

Closes: AP-001
```

## Branch Naming Convention

```
feature/AP-001-people-lastname-filter
bugfix/AP-001-fix-filter-debounce  
hotfix/AP-001-critical-filter-bug
```