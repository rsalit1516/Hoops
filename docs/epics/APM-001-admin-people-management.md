# Epic APM-001: Admin People Management

**Epic ID:** APM-001  
**Product Area:** Admin  
**Product Owner:** TBD  
**Tech Lead:** TBD  
**Target Release:** v1.2  
**Epic Size:** L  
**Business Priority:** High  

## Epic Overview
Provide administrators with comprehensive tools to manage people in the league database, including viewing, filtering, editing, and organizing people data with their household relationships and participation history.

## Business Value
- **Problem Statement:** Administrators currently lack efficient tools to manage league participants, making it difficult to maintain accurate records, find specific individuals, and manage household relationships.
- **Success Metrics:** 
  - Reduce time to find a person from 2+ minutes to <10 seconds
  - Increase data accuracy by providing better editing tools
  - Improve admin satisfaction with people management workflows
- **Target Users:** League administrators, data entry staff
- **Business Impact:** Improved operational efficiency, better data quality, reduced administrative overhead

## Stories in Epic

### 🟢 Completed Stories
| Story ID | Title | Points | Status | Developer |
|----------|-------|---------|--------|-----------|
| - | - | - | - | No completed stories yet |

### 🟡 In Progress Stories  
| Story ID | Title | Points | Status | Developer |
|----------|-------|---------|--------|-----------|
| - | - | - | - | No in-progress stories yet |

### 🔴 Planned Stories
| Story ID | Title | Points | Status | Developer |
|----------|-------|---------|--------|-----------|
| APMF-001 | Filter People by Last Name | 3 | 📋 Not Started | TBD |
| APMF-002 | Filter People by First Name | 2 | 📋 Not Started | TBD |
| APMF-003 | Alphabet Navigation for People List | 3 | 📋 Not Started | TBD |
| APMF-004 | View Person Details | 5 | 📋 Not Started | TBD |
| APMF-005 | Edit Person Information | 5 | 📋 Not Started | TBD |
| APMF-006 | Add New Person | 5 | 📋 Not Started | TBD |
| APMF-007 | Delete Person Record | 3 | 📋 Not Started | TBD |
| APMF-008 | Manage Household Relationships | 8 | 📋 Not Started | TBD |
| APMF-009 | People List Pagination | 3 | 📋 Not Started | TBD |
| APMF-010 | Filter by Player Status | 2 | 📋 Not Started | TBD |

**Total Story Points:** 39 | **Completed:** 0 | **Remaining:** 39

## Epic Acceptance Criteria
- [ ] Administrators can efficiently search and filter people by multiple criteria
- [ ] People information can be viewed, added, edited, and deleted with proper validation
- [ ] Household relationships are clearly displayed and manageable
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

### New Services/Infrastructure
- `PeopleService` - API integration for people CRUD operations
- `PeopleFilterService` - Client-side filtering and search logic
- `HouseholdService` - Household relationship management
- `AuditService` - Track changes with user metadata

### Database Changes
- Ensure proper indexing on Person.LastName, Person.FirstName for filtering performance
- Add audit fields to Person table (ModifiedBy, ModifiedDate) if not present
- Optimize queries for large dataset pagination

## Dependencies
- **External Dependencies:** None identified
- **Epic Dependencies:** None (this is foundational admin functionality)
- **Infrastructure:** 
  - Requires admin authentication and authorization system
  - Database performance optimization for large people datasets

## Risks & Mitigations
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Large dataset performance issues | High | Medium | Implement server-side pagination, indexing, and caching |
| Complex household relationship modeling | Medium | Medium | Start with simple parent-child relationships, iterate |
| Data validation complexity | Medium | Low | Use existing validation patterns from other admin modules |

## Release Criteria
- [ ] All 10 stories completed and deployed
- [ ] Performance requirements met (<2s load, supports 2000+ records)
- [ ] Security review passed (admin-only access controls)
- [ ] Documentation updated (user guide, API docs)
- [ ] User acceptance testing completed by league administrators
- [ ] Rollback plan prepared and tested

## Timeline
- **Epic Start:** 2025-10-11
- **Target Completion:** 2025-12-15
- **Sprint Allocation:** Sprints 23, 24, 25, 26 (estimated 4 sprints)

---
**Created:** 2025-10-11  
**Last Updated:** 2025-10-11  
**Epic Status:** Not Started