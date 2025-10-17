# Documentation Reorganization Summary

**Date:** 2025-10-17  
**Purpose:** Reorganize documentation to follow proper Epic → Feature → Story hierarchy

## Changes Made

### 1. Created Feature Template

**File:** `/docs/templates/feature-template.md`

- New mid-level template between Epic and Story
- Simplified format focused on functional capability
- Removed planning/tracking sections (handled in Azure Boards)

### 2. Updated Epic Template

**File:** `/docs/templates/epic-template.md`
**Changes:**

- Removed story tracking tables (moved to Azure Boards)
- Removed planning sections (release criteria, timelines, sprint allocation)
- Changed "Stories in Epic" to "Features in Epic"
- Simplified to focus on strategic business value
- Kept technical architecture and risk sections

### 3. Updated User Story Template

**File:** `/docs/templates/user-story-template.md`
**Changes:**

- Added Feature reference alongside Epic
- Removed planning metadata (sprint, assignee, estimated effort)
- Removed "Summary for Azure Boards" section
- Simplified Definition of Done
- Removed version history table
- Streamlined to essential implementation details

### 4. Created Feature Generation Script

**File:** `/scripts/create-feature.sh`
**Functionality:**

- Generates feature documents from template
- Validates feature ID format (ABCF-123 where 4th char is 'F')
- Links feature to parent epic
- Creates feature directory structure
- Provides next steps guidance

### 5. Created Feature Document: Director Management

**File:** `/docs/features/apm/APMF-046-director-management.md`
**Content:**

- Feature-level overview of Director Management
- Lists 4 user stories (View, Add, Edit, Delete)
- Technical architecture for the feature
- Business value and acceptance criteria

### 6. Updated Story: View Directors List

**File:** `/docs/stories/APMF-046-create-list-for-directors-in-admin.md`
**Changes:**

- Added reference to parent feature (APMF-046)
- Fully populated acceptance criteria
- Added detailed technical implementation section
- Added comprehensive test scenarios
- Defined components, services, and models

### 7. Updated BDD Feature File

**File:** `/docs/features/apm/APMF-046-create-list-for-directors-in-admin.feature`
**Changes:**

- Replaced template placeholders with actual scenarios
- Added comprehensive test coverage:
  - Smoke tests (basic list view)
  - Sorting tests
  - Pagination tests
  - Edge cases (empty list, single item)
  - Error handling
  - Accessibility
  - Responsive design

### 8. Updated Epic: Admin People Management

**File:** `/docs/epics/APM-001-admin-people-management.md`
**Changes:**

- Changed "Stories in Epic" section to "Features in Epic"
- Added 3 features: People Management, Household Management, Director Management
- Updated business value to include director management
- Added director-related components to technical architecture
- Removed story tracking tables
- Removed planning sections

### 9. Archived Old Epic APM-002

**File:** `/docs/epics/APM-002-director-management-interface.md.archived`
**Reason:** Director Management is now a Feature (APMF-046) under Epic APM-001, not its own epic

### 10. Created Hierarchy Documentation

**File:** `/docs/README-hierarchy.md`
**Content:**

- Complete guide to Epic → Feature → Story hierarchy
- When to create each level
- ID format specifications
- File organization structure
- Integration with Azure Boards
- Workflow examples
- Best practices

## New Hierarchy Structure

```
Epic: APM-001 - Admin People Management
├── Feature: APMF-001 - People Management
│   └── Stories: APMF-001 through APMF-010
├── Feature: APMF-040 - Household Management
│   └── Stories: APMF-041 through APMF-045
└── Feature: APMF-046 - Director Management
    ├── Story: APMF-046 - View Directors List
    ├── Story: APMF-047 - Add New Director
    ├── Story: APMF-048 - Edit Director
    └── Story: APMF-049 - Delete Director
```

## Benefits of New Structure

1. **Clear Hierarchy:** Epic → Feature → Story matches industry standard Agile practices
2. **Better Organization:** Features group related stories by functional capability
3. **Simpler Templates:** Removed planning/tracking sections handled in Azure Boards
4. **Scalable:** Can easily add new features under existing epics
5. **Easier Navigation:** Features provide logical grouping between strategic epics and tactical stories
6. **Less Duplication:** Single source of truth for planning (Azure Boards), specifications (Markdown)

## Migration Path for Existing Stories

To update existing stories to the new structure:

1. **Identify the Feature** - Determine which functional capability the story belongs to
2. **Create Feature if Missing** - Use `./scripts/create-feature.sh`
3. **Update Story** - Add Feature reference: `**Feature:** [APMF-XXX](...)`
4. **Update Epic** - Add feature to "Features in Epic" table
5. **Create Azure Boards Feature** - Link Story → Feature → Epic

### Example Migration

**Before:**

```
Epic APM-002: Director Management
└── Story APMF-046: View Directors List
```

**After:**

```
Epic APM-001: Admin People Management
└── Feature APMF-046: Director Management
    └── Story APMF-046: View Directors List
```

## Scripts Available

1. **`./scripts/create-epic.sh`** - Create new epic
2. **`./scripts/create-feature.sh`** - Create new feature (NEW)
3. **`./scripts/create-story.sh`** - Create new story
4. **`./scripts/generate-epic-id.sh`** - Generate next epic ID
5. **`./scripts/generate-story-id.sh`** - Generate next story ID

## Next Steps

1. **Create remaining features** for Epic APM-001:

   - APMF-001: People Management
   - APMF-040: Household Management

2. **Create additional stories** for Director Management feature:

   - APMF-047: Add New Director (3 points)
   - APMF-048: Edit Director (3 points)
   - APMF-049: Delete Director (2 points)

3. **Migrate existing stories** to reference their parent features

4. **Update Azure Boards** to match the new hierarchy

## Validation

To verify the reorganization is correct:

- [ ] All templates use `{{double-braces}}` for placeholders
- [ ] Feature template exists and is complete
- [ ] Scripts can generate all three levels
- [ ] Example documents follow the new structure
- [ ] Documentation explains the hierarchy
- [ ] Old APM-002 epic is archived
- [ ] APM-001 epic references features, not stories directly

## Questions Answered

**Q: What's the difference between Epic, Feature, and Story?**

- **Epic:** Strategic business capability (months)
- **Feature:** Functional module (weeks)
- **Story:** Sprint-sized work item (days)

**Q: Should a "list + CRUD forms" be an Epic?**

- **A:** No, that's a **Feature** with multiple **Stories**

**Q: What is a Feature?**

- **A:** A complete functional capability containing related stories

**Q: How do Features relate to Epics?**

- **A:** Features are children of Epics. Epics contain multiple Features.

**Q: Example for Director Management?**

- **Epic:** Admin People Management (APM-001)
- **Feature:** Director Management (APMF-046)
- **Stories:** View List, Add, Edit, Delete (APMF-046 through APMF-049)

---

**For more details, see:** `/docs/README-hierarchy.md`
