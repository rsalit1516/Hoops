# Documentation Reorganization Plan

## Overview
This document outlines the reorganization of documentation to align with the current template structure in `docs/templates/`.

## Current Structure Issues

### 1. Duplicate/Misplaced Story Files
The following story-like files in `docs/features/` duplicate or should be converted to formal story files:

- `docs/features/admin-people/alphabet/alphabet-story.md` → Already exists as `docs/stories/APMF-003-alphabet-navigation.md` (**DELETE**)
- `docs/features/admin-people/filter/people-filter-story.md` → Convert to stories APMF-001 and APMF-002 (**CONVERT**)
- `docs/features/admin-people/list/people-list-story.md` → Convert to formal story (**NEEDS ID**)
- `docs/features/admin-people/admin-people-detail/admin-people-detail.story.md` → Convert to formal story (**NEEDS ID**)
- `docs/features/games/schedule-list/schedule-list-story.md` → Convert to formal story (**NEEDS ID**)
- Various other `-story.md` files in features directories

### 2. Story ID Conflict
- **APMF-046** is used for both:
  - Feature: Director Management (correct usage)
  - Story: View Directors List (incorrect - should be a different ID)
- The story in `docs/stories/APMF-046-create-list-for-directors-in-admin.md` should be renumbered to align with the feature structure

### 3. BDD Feature Files Need Renaming
Files without story IDs in their names:
- `docs/features/admin-people/alphabet/alphabet-navigation.feature` → Should stay (already linked to APMF-003)
- `docs/features/admin-people/filter/people-filter.feature` → Link to specific story ID
- `docs/features/admin-people/list/people-list.feature` → Link to specific story ID
- `docs/features/admin-people/admin-people-detail/admin-people-detail.feature` → Link to specific story ID

### 4. Missing Feature Documentation
Features that need formal feature documentation files:
- **People Filtering** (covers APMF-001, APMF-002) - needs `docs/features/admin-people/APMF-001-people-filtering.md`
- **People List Display** (needs ID assignment) - needs feature doc
- **People Detail View** (needs ID assignment) - needs feature doc
- **Schedule Management** (needs ID assignment) - needs feature doc

### 5. Miscellaneous Files
Files that don't fit the template structure:
- `docs/features/admin-people/story.md` - Generic story file, unclear purpose
- `docs/features/admin-people/sprint-plan.md` - Sprint planning doc, may belong elsewhere
- `docs/features/feature-flags.md` - Technical doc, not a feature story
- `docs/features/api-json-serialization.feature` - Technical implementation detail
- `docs/features/user-*.feature` - Various user management features without IDs

## Proposed Actions

### Phase 1: Clean Up Duplicates
1. **DELETE** `docs/features/admin-people/alphabet/alphabet-story.md` (duplicate of APMF-003)
2. **DELETE** `docs/features/admin-people/story.md` (unclear purpose)

### Phase 2: Create Missing Feature Documentation
Create feature-level documentation files in `docs/features/{area}/`:

1. **APMF-001-people-filtering.md** - Feature covering lastname/firstname filtering
   - Stories: APMF-001 (Filter by Last Name), APMF-002 (Filter by First Name)
   - Location: `docs/features/admin-people/APMF-001-people-filtering.md`

2. **APMF-004-people-list-display.md** - Feature for list display (needs feature ID)
   - Location: `docs/features/admin-people/APMF-004-people-list-display.md`

3. **APMF-005-people-detail-view.md** - Feature for detail view (needs feature ID)
   - Location: `docs/features/admin-people/APMF-005-people-detail-view.md`

### Phase 3: Update Story Files
Update the following story files to match the current template:

1. **APMF-001-filter-people-lastname.md** - Update to match template
2. **APMF-002-filter-people-firstname.md** - Update to match template
3. **APMF-003-alphabet-navigation.md** - Already in good shape, minor updates
4. **APMF-046-create-list-for-directors-in-admin.md** - Renumber or confirm ID
5. **APMF-047-add-new-director.md** - Update to match template
6. **APMF-048-edit-director-information.md** - Update to match template
7. **APMF-049-delete-director.md** - Update to match template

### Phase 4: Convert Informal Story Files
Convert these informal story files to formal stories (IDs TBD by user):

1. `docs/features/admin-people/list/people-list-story.md` → Create formal story with ID
2. `docs/features/admin-people/admin-people-detail/admin-people-detail.story.md` → Create formal story with ID
3. `docs/features/games/schedule-list/schedule-list-story.md` → Create formal story with ID
4. `docs/features/admin-people/filter/people-filter-story.md` → Content covered by APMF-001/APMF-002

### Phase 5: Organize BDD Feature Files
Ensure all BDD .feature files:
- Remain in `docs/features/{area}/` directory structure
- Include story ID reference in header
- Follow naming convention: `{STORY_ID}-{descriptive-name}.feature`

Example renames:
- `alphabet-navigation.feature` → Keep (already good)
- `people-filter.feature` → May split into `APMF-001-lastname-filter.feature` and `APMF-002-firstname-filter.feature`
- `people-list.feature` → Rename with proper story ID once assigned

### Phase 6: Organize Miscellaneous Files
1. **Technical documentation** (not stories):
   - `feature-flags.md` → Move to `docs/technical/` or `docs/architecture/`
   - `api-json-serialization.feature` → Move to technical docs

2. **Planning documents**:
   - `sprint-plan.md` → Move to `docs/planning/` (if keeping)

3. **Schema/design documents**:
   - `playoff-games-schema.md`, `regular-games-schema.md`, `user-schema.md` → Move to `docs/architecture/`
   - Various `-design.md` and `-rules.md` files → Move to appropriate architecture/technical folders

## Directory Structure (After Reorganization)

```
docs/
├── epics/
│   ├── APM-001-admin-people-management.md
│   └── [other epics]
├── features/
│   ├── admin-people/
│   │   ├── APMF-001-people-filtering.md (NEW FEATURE DOC)
│   │   ├── APMF-001-lastname-filter.feature (BDD)
│   │   ├── APMF-002-firstname-filter.feature (BDD)
│   │   ├── APMF-003-alphabet-navigation.feature (BDD)
│   │   ├── APMF-004-people-list-display.md (NEW FEATURE DOC - ID TBD)
│   │   ├── APMF-004-people-list.feature (BDD - ID TBD)
│   │   ├── APMF-005-people-detail-view.md (NEW FEATURE DOC - ID TBD)
│   │   ├── APMF-005-people-detail.feature (BDD - ID TBD)
│   │   └── [deprecated story files removed]
│   ├── apm/
│   │   ├── APMF-046-director-management.md (FEATURE DOC - already exists)
│   │   ├── APMF-046-director-list.feature (BDD - rename from current)
│   │   ├── APMF-047-add-director.feature (BDD)
│   │   ├── APMF-048-edit-director.feature (BDD)
│   │   └── APMF-049-delete-director.feature (BDD)
│   ├── games/
│   │   └── [organize similarly]
│   └── [other feature areas]
├── stories/
│   ├── APMF-001-filter-people-lastname.md
│   ├── APMF-002-filter-people-firstname.md
│   ├── APMF-003-alphabet-navigation.md
│   ├── APMF-046-create-list-for-directors-in-admin.md (or renumbered)
│   ├── APMF-047-add-new-director.md
│   ├── APMF-048-edit-director-information.md
│   ├── APMF-049-delete-director.md
│   └── [additional stories - IDs TBD]
├── templates/
│   └── [existing templates]
├── architecture/
│   ├── playoff-games-schema.md
│   ├── regular-games-schema.md
│   ├── user-schema.md
│   └── [other architecture docs]
├── technical/
│   ├── feature-flags.md
│   ├── api-json-serialization.md
│   └── [other technical docs]
└── planning/
    └── [sprint plans and other planning docs]
```

## Items Requiring User Input

The following items need IDs to be assigned in Azure Boards before proceeding:

1. **Feature IDs needed:**
   - People List Display feature
   - People Detail View feature
   - Game Schedule Management features
   - User Management features

2. **Story IDs needed:**
   - People List Display stories (based on `people-list-story.md`)
   - People Detail View stories (based on `admin-people-detail.story.md`)
   - Game Schedule stories (based on `schedule-list-story.md`)
   - Various user management stories

3. **ID Conflict Resolution:**
   - APMF-046: Confirm if this should remain as the feature ID with new story IDs underneath
   - Or renumber the story "View Directors List" to a different ID

## Execution Order

1. **User provides missing IDs** from Azure Boards
2. Create missing feature documentation files
3. Remove duplicate story files from docs/features/
4. Convert informal story files to formal stories with IDs
5. Update existing story files to match current template
6. Rename/reorganize BDD .feature files
7. Move miscellaneous files to appropriate directories
8. Update all cross-references and links

## Notes

- Files marked (**DELETE**) are duplicates or obsolete
- Files marked (**CONVERT**) need to be converted to formal story format
- Files marked (**NEEDS ID**) require Azure Boards work item IDs before proceeding
- All BDD .feature files should remain in docs/features/ hierarchy
- All story .md files should be in docs/stories/
- All feature .md files should be in docs/features/{area}/

---

**Next Step:** User reviews this plan and provides missing IDs from Azure Boards, then we proceed with reorganization.
