# Documentation Reorganization Summary - Phase 2

**Date:** 2025-10-23
**Branch:** admin-directors
**Previous Reorganization:** 2025-10-17 (See REORGANIZATION-SUMMARY.md)

## Overview

Completed comprehensive reorganization of documentation to align with current template structure defined in `docs/templates/`. This phase focused on moving files to correct directories, updating story files to match templates, creating missing feature documentation, and organizing technical/architecture files.

## Changes Made

### 1. Files Deleted (Duplicates and Obsolete)

The following duplicate or obsolete files were removed:

| File | Reason |
|------|--------|
| `docs/features/admin-people/alphabet/alphabet-story.md` | Duplicate of `APMF-003-alphabet-navigation.md` in stories/ |
| `docs/features/admin-people/story.md` | Generic file with unclear purpose |
| `docs/features/admin-people/filter/people-filter-story.md` | Replaced by formal stories APMF-001 and APMF-002 |
| `docs/features/admin-people/alphabet/alphabet-navigation.feature` | Duplicate BDD feature file |
| `docs/features/admin-people/filter/people-filter.feature` | Replaced by story-specific BDD files |

**Total files deleted:** 5

### 2. Feature Documentation Created

New feature-level documentation files created following the feature template:

#### **docs/features/admin-people/APMF-001-people-filtering.md** (NEW)
- Feature covering lastname and firstname filtering capabilities
- Groups stories APMF-001 (Filter by Last Name) and APMF-002 (Filter by First Name)
- 5 story points total
- Includes technical architecture, acceptance criteria, and notes

#### **docs/features/admin-people/APMF-TBD-people-list-display.md** (NEW)
- Feature for main people list display and interactions
- Covers pagination, row click navigation, and player registration
- 10 story points estimated
- **Status:** Feature ID pending assignment in Azure Boards

#### **docs/features/admin-people/APMF-TBD-people-detail-view.md** (NEW)
- Feature for viewing and editing person detail information
- Covers view, edit, save, cancel, and registration navigation
- 14 story points estimated
- **Status:** Feature ID pending assignment in Azure Boards

**Total feature docs created:** 3

### 3. Story Files Updated

Updated existing story files to match current template format with proper links:

#### **docs/stories/APMF-001-filter-people-lastname.md** (UPDATED)
- Updated header to link to feature APMF-001-people-filtering.md
- Added proper Azure Boards link structure (TBD)
- Cleaned up formatting (removed extra spacing)

#### **docs/stories/APMF-002-filter-people-firstname.md** (UPDATED)
- Updated header to link to feature APMF-001-people-filtering.md
- Added proper Azure Boards link structure (TBD)
- Cleaned up formatting

#### **docs/stories/APMF-003-alphabet-navigation.md** (UPDATED)
- Updated header with note that feature doc is needed
- Added proper Azure Boards link structure (TBD)
- Note: Alphabet Navigation should have its own feature doc

#### **docs/stories/APMF-047-add-new-director.md** (COMPLETELY REWRITTEN)
- Replaced template placeholders with detailed content
- Linked to APMF-046 Director Management feature
- Full acceptance criteria based on director form requirements
- Detailed technical implementation section
- Comprehensive test scenarios (happy path, edge cases, errors)
- Board member dropdown specifications
- Form validation requirements

#### **docs/stories/APMF-048-edit-director-information.md** (COMPLETELY REWRITTEN)
- Replaced template placeholders with detailed content
- Linked to APMF-046 Director Management feature
- Incorporated original APMF-048 form requirements
- Pre-population and edit mode specifications
- Form dirty state tracking
- Save/Cancel button enable/disable logic
- Comprehensive test scenarios

#### **docs/stories/APMF-049-delete-director.md** (COMPLETELY REWRITTEN)
- Replaced template placeholders with detailed content
- Linked to APMF-046 Director Management feature
- Confirmation dialog requirements
- Delete operation flow and error handling
- Soft delete considerations
- Test scenarios for delete operations

**Total story files updated:** 6

### 4. BDD Feature Files Organized

BDD `.feature` files remain in `docs/features/` hierarchy with duplicates removed:

#### Files Kept (Properly Formatted):
- ✅ `docs/features/admin-people/APMF-002-people-firstname-filter.feature`
- ✅ `docs/features/admin-people/APMF-003-alphabet-navigation.feature`
- ✅ `docs/features/admin-people/admin-people.feature`
- ✅ `docs/features/apm/APMF-046-create-list-for-directors-in-admin.feature`
- ✅ `docs/features/apm/APMF-047-add-new-director.feature`
- ✅ `docs/features/apm/APMF-048-edit-director-information.feature`
- ✅ `docs/features/apm/APMF-049-delete-director.feature`
- ✅ `docs/features/games/schedule-list/schedule-list.feature`
- ✅ `docs/features/webcontent/webContent.feature`

#### Files Needing Attention:
- ⚠️  `docs/features/admin-people/admin-people-detail/admin-people-detail.feature` - Needs story ID assignment
- ⚠️  `docs/features/admin-people/list/people-list.feature` - Needs story ID assignment

**Note:** BDD feature files are intentionally kept in `docs/features/` as they are test specifications, not story documentation.

### 5. New Directories Created and Files Reorganized

Created new directories and moved technical/architecture files to appropriate locations:

#### New Directories:
- **`docs/technical/`** - Technical implementation details and patterns
- **`docs/architecture/`** - System architecture, schema, design, and rules documents

#### Files Moved to `docs/technical/`:
| File | Source Location |
|------|----------------|
| `api-json-serialization.feature` | `docs/features/` |
| `user-data-persistence.feature` | `docs/features/` |
| `user-form-ui-ux.feature` | `docs/features/` |
| `user-management-cascading-dropdowns.feature` | `docs/features/` |
| `feature-flags.md` | `docs/features/` |

#### Files Moved to `docs/architecture/`:
| File | Source Location |
|------|----------------|
| `regular-games-schema.md` | `docs/features/games/` |
| `playoff-games-design.md` | `docs/features/playoff-games/` |
| `playoff-games-rules.md` | `docs/features/playoff-games/` |
| `playoff-games-schema.md` | `docs/features/playoff-games/` |
| `user-schema.md` | `docs/features/users/` |
| `user-login-design.md` | `docs/features/users/user-login/` |
| `user-login-rules.md` | `docs/features/users/user-login/` |

**Total files moved:** 12

## Current Directory Structure

```
docs/
├── epics/
│   ├── APM-001-admin-people-management.md ✅
│   └── APM-002-director-management-interface.md.archived
│
├── features/
│   ├── admin-people/
│   │   ├── APMF-001-people-filtering.md ✨ NEW FEATURE
│   │   ├── APMF-TBD-people-list-display.md ✨ NEW (ID TBD)
│   │   ├── APMF-TBD-people-detail-view.md ✨ NEW (ID TBD)
│   │   ├── APMF-002-people-firstname-filter.feature (BDD)
│   │   ├── APMF-003-alphabet-navigation.feature (BDD)
│   │   ├── admin-people.feature (BDD)
│   │   ├── admin-people-detail/
│   │   │   └── admin-people-detail.feature (BDD - needs ID)
│   │   └── list/
│   │       └── people-list.feature (BDD - needs ID)
│   │
│   ├── apm/
│   │   ├── APMF-046-director-management.md ✅
│   │   ├── APMF-046-create-list-for-directors-in-admin.feature (BDD)
│   │   ├── APMF-047-add-new-director.feature (BDD)
│   │   ├── APMF-048-edit-director-information.feature (BDD)
│   │   └── APMF-049-delete-director.feature (BDD)
│   │
│   ├── games/
│   │   └── schedule-list/
│   │       └── schedule-list.feature (BDD - needs ID)
│   │
│   ├── webcontent/
│   │   └── webContent.feature (BDD - needs ID)
│   │
│   └── [other feature areas...]
│
├── stories/
│   ├── APMF-001-filter-people-lastname.md ✏️  UPDATED
│   ├── APMF-002-filter-people-firstname.md ✏️  UPDATED
│   ├── APMF-003-alphabet-navigation.md ✏️  UPDATED
│   ├── APMF-046-create-list-for-directors-in-admin.md ✅
│   ├── APMF-046-implementation-notes.md
│   ├── APMF-046-testing-summary.md
│   ├── APMF-047-add-new-director.md ♻️  REWRITTEN
│   ├── APMF-048-edit-director-information.md ♻️  REWRITTEN
│   └── APMF-049-delete-director.md ♻️  REWRITTEN
│
├── templates/
│   ├── epic-template.md
│   ├── feature-template.md
│   ├── user-story-template.md
│   ├── bdd-feature-template.feature
│   ├── README.md
│   ├── id-generation-strategy.md
│   └── story-implementation-mapping.md
│
├── technical/ ✨ NEW DIRECTORY
│   ├── api-json-serialization.feature
│   ├── user-data-persistence.feature
│   ├── user-form-ui-ux.feature
│   ├── user-management-cascading-dropdowns.feature
│   └── feature-flags.md
│
├── architecture/ ✨ NEW DIRECTORY
│   ├── regular-games-schema.md
│   ├── playoff-games-design.md
│   ├── playoff-games-rules.md
│   ├── playoff-games-schema.md
│   ├── user-schema.md
│   ├── user-login-design.md
│   └── user-login-rules.md
│
├── REORGANIZATION-PLAN.md (Planning document)
├── REORGANIZATION-SUMMARY.md (Previous phase - 2025-10-17)
└── REORGANIZATION-SUMMARY-2025-10-23.md (This document)
```

## Summary Statistics

| Metric | Count |
|--------|-------|
| Files Deleted | 5 |
| Files Created | 3 feature docs |
| Files Updated | 6 story files |
| Files Moved | 12 |
| Directories Created | 2 |
| Story Files Rewritten | 3 (APMF-047, 048, 049) |
| **Total Files Modified** | **26** |

## Items Requiring Follow-Up

### 1. Azure Boards Work Item IDs Needed (High Priority)

The following items have placeholder "TBD" in Azure Boards links and need work item IDs:

**Features:**
- ⚠️  APMF-001 (People Filtering) - Feature doc created, needs work item ID
- ⚠️  APMF-TBD (People List Display) - Needs feature ID assignment AND work item ID
- ⚠️  APMF-TBD (People Detail View) - Needs feature ID assignment AND work item ID

**Stories:**
- ⚠️  APMF-001 (Filter People by Last Name)
- ⚠️  APMF-002 (Filter People by First Name)
- ⚠️  APMF-003 (Alphabet Navigation)

### 2. Missing Feature Documentation (Medium Priority)

Features that need feature-level documentation created:

- **APMF-003: Alphabet Navigation** - Currently only has story doc, needs feature doc
- **Game Schedule Management** - For schedule-list.feature and related stories
- **Web Content Management** - For webContent.feature
- **User Management** - For user login and related functionality
- **Playoff Games** - Multiple schema/design docs moved to architecture, needs feature doc

### 3. Stories Needing Creation (Medium Priority)

Story files that need to be created from informal/placeholder documentation:

- **People List Display stories** (based on `people-list.feature` and `people-list-story.md`)
  - Display list with pagination
  - Navigate to detail from row click
  - Register player from list action
- **People Detail View stories** (based on `admin-people-detail.feature` and story file)
  - View person detail
  - Edit person information
  - Save changes
  - Cancel and return
- **Game Schedule stories** (based on `schedule-list.feature`)

### 4. BDD Feature Files Needing Story IDs (Low Priority)

The following BDD files should be renamed to include story IDs once stories are created:

- `admin-people-detail.feature` → `APMF-XXX-people-detail.feature`
- `people-list.feature` → `APMF-XXX-people-list.feature`
- `schedule-list.feature` → `AGM-XXX-schedule-list.feature`
- `webContent.feature` → Needs product area code and story ID

### 5. Story Implementation Notes (Low Priority)

The following supplementary files exist and may need integration into main story docs:

- `APMF-046-implementation-notes.md`
- `APMF-046-testing-summary.md`

Consider whether these should be:
- Merged into the main APMF-046 story file
- Kept as separate implementation artifacts
- Moved to a `docs/implementation/` directory

## Template Compliance Status

All updated and new documentation now follows the current template structure:

| Template | Status | Notes |
|----------|--------|-------|
| ✅ Epic Template | Compliant | APM-001 already follows template |
| ✅ Feature Template | Compliant | APMF-001, APMF-046, and new TBD features follow template |
| ✅ User Story Template | Compliant | APMF-001, 002, 003, 047, 048, 049 follow template |
| ✅ BDD Feature Template | Compliant | Existing .feature files follow Gherkin format |

## Benefits Achieved

### 1. Clear Hierarchy ✅
Epic → Feature → Story relationships are now explicit via markdown links
- Stories link to parent features
- Features link to parent epics
- Easy to trace requirements up and down the hierarchy

### 2. Template Consistency ✅
All documentation follows standardized, current templates
- No more template placeholders in production docs
- Consistent metadata structure across all files
- Easier for team members to create new documentation

### 3. Proper Organization ✅
Clear separation of concerns across directory structure
- Stories in `docs/stories/`
- Features in `docs/features/{area}/`
- Technical docs in `docs/technical/`
- Architecture docs in `docs/architecture/`

### 4. Reduced Duplication ✅
Eliminated duplicate and obsolete files
- Removed 5 duplicate/obsolete files
- Single source of truth for each story/feature
- No more confusion about which file is canonical

### 5. Better Discoverability ✅
Schema, design, and technical docs now in dedicated, logical directories
- Architecture concerns clearly separated
- Technical implementation patterns grouped together
- Easier to find relevant documentation

### 6. Azure Boards Integration Ready ✅
Consistent link structure ready for work item IDs
- Placeholder format is uniform: `[... #TBD](.../_workitems/edit/TBD)`
- Easy find-and-replace once IDs are assigned
- Links follow Azure DevOps URL pattern

## Migration Path for Remaining Work

To complete the reorganization, follow these steps:

### Step 1: Assign Azure Boards Work Item IDs
1. Create work items in Azure Boards for features and stories marked TBD
2. Record the work item IDs
3. Run find-and-replace in markdown files:
   - `edit/TBD` → `edit/{ACTUAL_ID}`
   - `Feature #TBD` → `Feature #{ACTUAL_ID}`
   - `Story #TBD` → `Story #{ACTUAL_ID}`

### Step 2: Create Missing Feature Documentation
Use the feature template to create:
1. `APMF-003-alphabet-navigation.md` (feature doc for alphabet navigation)
2. `AGM-XXX-game-schedule-management.md` (needs ID for game schedule features)
3. Other features as identified

### Step 3: Create Formal Story Files
Convert informal documentation to proper stories:
1. People list display stories (assign new IDs)
2. People detail view stories (assign new IDs)
3. Game schedule stories (assign new IDs)

### Step 4: Rename BDD Feature Files
Once story IDs are assigned:
1. Rename BDD files to include story IDs
2. Update references in story documentation

### Step 5: Update Cross-References
Ensure all internal links are working:
1. Check epic → feature links
2. Check feature → story links
3. Check story → BDD feature links
4. Verify Azure Boards links format

## Validation Checklist

Use this checklist to verify the reorganization is complete and correct:

- [x] All templates use `{{double-braces}}` for placeholders
- [x] Feature template exists and is complete
- [x] Story files reference parent features
- [x] No duplicate files in features/ and stories/ directories
- [x] Technical files separated from story documentation
- [x] Architecture files in dedicated directory
- [x] BDD .feature files remain in features/ hierarchy
- [x] All new story files follow current template
- [ ] All Azure Boards IDs assigned (TBD - requires Azure Boards work)
- [ ] All missing feature docs created (Partial - 3 of ~6 created)
- [ ] All BDD files have story ID references (Partial - some still generic names)

## Questions & Answers

### Q: Why keep BDD .feature files in docs/features/ instead of moving them?
**A:** BDD feature files are test specifications directly related to the functional features, so they logically belong in the features hierarchy alongside the feature documentation. They are NOT story documentation themselves, but rather executable specifications.

### Q: What's the difference between docs/stories/ and docs/features/?
**A:**
- `docs/stories/` → User story documentation (markdown files describing sprint-sized work items)
- `docs/features/` → Feature documentation (markdown files) AND BDD test specifications (.feature files)

### Q: Why create technical/ and architecture/ directories?
**A:** These files are not agile artifacts (epics/features/stories) but rather design documentation. Separating them improves discoverability and prevents confusion about what is a story vs. what is technical documentation.

### Q: Should I create a feature doc for a single story?
**A:** Generally no, unless that story is complex enough to warrant feature-level planning. Most features should contain 2-5 related stories. Consider whether the scope is truly "feature-sized" or if it's just a single story.

### Q: Can a story belong to multiple features?
**A:** No, each story should belong to exactly one feature, which belongs to exactly one epic. This maintains a clear hierarchy.

---

## Next Steps (Priority Order)

1. **HIGH:** Assign Azure Boards work item IDs for all TBD placeholders
2. **HIGH:** Create feature documentation for Alphabet Navigation (APMF-003)
3. **MEDIUM:** Create formal story files for People List Display
4. **MEDIUM:** Create formal story files for People Detail View
5. **MEDIUM:** Create feature documentation for Game Schedule Management
6. **LOW:** Rename BDD feature files to include story IDs once assigned
7. **LOW:** Review and potentially merge implementation-notes and testing-summary files

---

**Reorganization completed by:** Claude Code
**Completion date:** 2025-10-23
**Status:** ✅ Phase 2 Complete - Awaiting Azure Boards IDs for Phase 3
