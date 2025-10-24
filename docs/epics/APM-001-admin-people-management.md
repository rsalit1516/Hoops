# Epic APM-001: League Participant Management

**Epic ID:** APM-001
**Product Area:** League Participant Management
**Azure Boards:** [Epic #1](https://dev.azure.com/rsalit1516/Hoops/_workitems/edit/1)

**Priority:** High

## Epic Overview

Provide administrators with comprehensive tools to manage all league participants including individuals, households, and directors. This epic encompasses viewing, filtering, editing, and organizing participant data with household relationships, participation history, and board leadership information.

## Business Value

- **Problem Statement:** Administrators currently lack efficient tools to manage league participants, making it difficult to maintain accurate records, find specific individuals, manage household relationships, and maintain director information.
- **Success Metrics:**
  - Reduce time to find a person from 2+ minutes to <10 seconds
  - Increase data accuracy by providing better editing tools
  - Improve admin satisfaction with people management workflows
  - Maintain accurate director information for public display
- **Target Users:** League administrators, data entry staff
- **Business Impact:** Improved operational efficiency, better data quality, reduced administrative overhead, better public transparency

## Features in Epic

| Feature ID | Feature Title                | Stories | Status      |
| ---------- | ---------------------------- | ------- | ----------- |
| APMF-001   | Admin People Management      | ~10     | Not Started |
| APMF-040   | Admin Household Management   | ~5      | Not Started |
| APMF-046   | Admin Director Management    | 4       | In Progress |

**Total Features:** 3

## Epic Acceptance Criteria

- [ ] Administrators can efficiently search and filter people by multiple criteria
- [ ] People information can be viewed, added, edited, and deleted with proper validation
- [ ] Household relationships are clearly displayed and manageable
- [ ] Directors can be managed with dedicated interface and public display
- [ ] All changes are audited with user metadata for accountability
- [ ] Interface is responsive and accessible (WCAG 2.1 AA)
- [ ] Performance supports datasets of 2000+ people with <2s load times

## Technical Architecture

### Components Affected

- `AdminPeopleList` - Main list view with filtering and pagination
- `PeopleFilter` - Search and filter controls
- `PersonDetail` - View and edit person information
- `HouseholdManager` - Manage household relationships
- `AlphabetNavigation` - Letter-based navigation component
- `AdminDirectorsList` - Director management interface
- `DirectorForm` - Director add/edit form

### Services/Infrastructure

- `PeopleService` - API integration for people CRUD operations
- `PeopleFilterService` - Client-side filtering and search logic
- `HouseholdService` - Household relationship management
- `DirectorService` - Director management API integration
- `AuditService` - Track changes with user metadata

### Database Changes

- Ensure proper indexing on Person.LastName, Person.FirstName for filtering performance
- Add audit fields to Person table (ModifiedBy, ModifiedDate) if not present
- Optimize queries for large dataset pagination
- Ensure Director table has proper relationships and constraints

## Dependencies

- **External Dependencies:** None identified
- **Epic Dependencies:** None (this is foundational admin functionality)
- **Infrastructure:**
  - Requires admin authentication and authorization system
  - Database performance optimization for large people datasets

## Risks & Mitigations

| Risk                                    | Impact | Probability | Mitigation                                                |
| --------------------------------------- | ------ | ----------- | --------------------------------------------------------- |
| Large dataset performance issues        | High   | Medium      | Implement server-side pagination, indexing, and caching   |
| Complex household relationship modeling | Medium | Medium      | Start with simple parent-child relationships, iterate     |
| Data validation complexity              | Medium | Low         | Use existing validation patterns from other admin modules |
| Director information consistency        | Medium | Low         | Implement proper validation and audit trail               |

---

**Created:** 2025-10-11
**Last Updated:** 2025-10-23
**Status:** In Progress
