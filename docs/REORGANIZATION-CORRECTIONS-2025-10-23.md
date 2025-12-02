# Documentation Reorganization Corrections

**Date:** 2025-10-23 (Evening)
**Branch:** admin-directors
**Previous Work:** REORGANIZATION-SUMMARY-2025-10-23.md

## Overview

After the initial reorganization (documented in REORGANIZATION-SUMMARY-2025-10-23.md), the user identified a structural issue: features were created too granularly. Three separate feature documents were created when they should have all been stories under a single "Admin People Management" feature. This correction aligns the documentation with the existing pattern used for "Admin Director Management."

## Problem Identified

The initial reorganization created:

- `APMF-001-people-filtering.md` (Feature)
- `APMF-TBD-people-list-display.md` (Feature)
- `APMF-TBD-people-detail-view.md` (Feature)

**Issue:** These were too fine-grained to be features. They should be stories under a broader feature.

## Corrected Structure

### Epic Level

**Renamed:** Epic APM-045 from "Admin People Management" to **"League Participant Management"**

- Avoids naming conflict with the feature
- Better encompasses all participant types (individuals, households, directors)
- Updated product area to "League Participant Management"
- Updated epic overview and status to "In Progress"
- Removed duplicate acceptance criteria section

### Feature Level

**Created:** Feature APMF-001 - **"Admin People Management"**

- Comprehensive feature covering all individual people management functions
- Groups filtering, list display, detail view, and editing capabilities
- Contains ~10 stories (3 defined, 7 TBD)
- ~30 story points estimated
- Located at: `docs/features/admin-people/APMF-001-admin-people-management.md`

**Updated:** Feature APMF-046 - **"Admin Director Management"**

- Renamed from "Director Management" to match naming convention
- Updated epic reference to "League Participant Management"
- Updated product area to "League Participant Management"
- Updated status to "In Progress"

### Story Level

All story files updated to reference:

- Correct feature: APMF-001 (for people stories) or APMF-046 (for director stories)
- Renamed epic: "APM-045 - League Participant Management"

## Changes Made

### 1. Epic Renamed and Updated

**File:** `docs/epics/APM-045-admin-people-management.md`

**Changes:**

- Title: "Admin People Management" → "League Participant Management"
- Product Area: "Admin People Management" → "League Participant Management"
- Epic Overview: Updated to emphasize all participant types
- Features in Epic: Updated feature titles to include "Admin" prefix
  - "People Management" → "Admin People Management"
  - "Household Management" → "Admin Household Management"
  - "Director Management" → "Admin Director Management"
- Removed duplicate acceptance criteria section
- Updated Last Updated: 2025-10-23
- Updated Status: "Not Started" → "In Progress"

### 2. Incorrect Feature Docs Deleted

**Deleted Files:**

- `docs/features/admin-people/APMF-001-people-filtering.md`
- `docs/features/admin-people/APMF-TBD-people-list-display.md`
- `docs/features/admin-people/APMF-TBD-people-detail-view.md`

**Reason:** Too granular; should be stories, not features

### 3. Correct Feature Doc Created

**Created:** `docs/features/admin-people/APMF-001-admin-people-management.md`

**Content:**

- Feature encompassing all people management functionality
- Links to Epic APM-045 (League Participant Management)
- Lists 10 stories (3 defined: APMF-001, 002, 003; 7 TBD)
- Comprehensive technical architecture (components, services, database)
- Full acceptance criteria covering filtering, list, detail, and edit operations
- Technical notes for implementation guidance

### 4. Story Files Updated (7 files)

All story files updated to reference the correct feature and renamed epic:

**People Management Stories:**

- `APMF-001-filter-people-lastname.md` - Links to APMF-001 feature
- `APMF-002-filter-people-firstname.md` - Links to APMF-001 feature
- `APMF-003-alphabet-navigation.md` - Links to APMF-001 feature

**Director Management Stories:**

- `APMF-046-create-list-for-directors-in-admin.md` - Links to APMF-046 feature
- `APMF-047-add-new-director.md` - Links to APMF-046 feature
- `APMF-048-edit-director-information.md` - Links to APMF-046 feature
- `APMF-049-delete-director.md` - Links to APMF-046 feature

All stories now reference:

- Correct feature name (with "Admin" prefix where applicable)
- Epic with new name: "APM-045 - League Participant Management"

### 5. Feature Doc Updated

**File:** `docs/features/apm/APMF-046-director-management.md`

**Changes:**

- Title: "Director Management" → "Admin Director Management"
- Epic reference updated to "APM-045 - League Participant Management"
- Product Area: "Admin People Management" → "League Participant Management"
- Updated Last Updated: 2025-10-23
- Updated Status: "Not Started" → "In Progress"

## Final Hierarchy Structure

```
Epic: APM-045 - League Participant Management
│
├── Feature: APMF-001 - Admin People Management (~30 points)
│   ├── Story: APMF-001 - Filter People by Last Name (3 pts)
│   ├── Story: APMF-002 - Filter People by First Name (2 pts)
│   ├── Story: APMF-003 - Alphabet Navigation (3 pts)
│   ├── Story: APMF-TBD1 - Display People List with Pagination (5 pts)
│   ├── Story: APMF-TBD2 - Navigate to Person Detail (2 pts)
│   ├── Story: APMF-TBD3 - Register Player from List (3 pts)
│   ├── Story: APMF-TBD4 - View Person Detail Information (3 pts)
│   ├── Story: APMF-TBD5 - Edit Person Information (5 pts)
│   ├── Story: APMF-TBD6 - Save Person Changes (3 pts)
│   └── Story: APMF-TBD7 - Cancel Edit and Return (1 pt)
│
├── Feature: APMF-040 - Admin Household Management (~5 stories, TBD)
│   └── [Stories to be created]
│
└── Feature: APMF-046 - Admin Director Management (13 points)
    ├── Story: APMF-046 - View Directors List (5 pts)
    ├── Story: APMF-047 - Add New Director (3 pts)
    ├── Story: APMF-048 - Edit Director Information (3 pts)
    └── Story: APMF-049 - Delete Director (2 pts)
```

## Naming Convention Established

Based on the corrected structure, the naming convention is now clear:

### Epic Level

- **Format:** APM-XXX - [Business Capability Name]
- **Example:** APM-045 - League Participant Management
- **Scope:** Strategic, months-long initiatives

### Feature Level

- **Format:** APMF-XXX - Admin [Functional Area] Management
- **Example:** APMF-001 - Admin People Management
- **Scope:** Complete functional capability, weeks of work, multiple related stories

### Story Level

- **Format:** APMF-XXX - [Specific User Story]
- **Example:** APMF-001 - Filter People by Last Name
- **Scope:** Sprint-sized work item, 1-5 days of work

### ID Reuse Pattern

Following the Director Management pattern:

- Feature ID and first story ID are the same (e.g., APMF-046 for both)
- Subsequent stories increment (APMF-047, APMF-048, etc.)

## Summary Statistics

| Action                   | Count  |
| ------------------------ | ------ |
| Epics Renamed            | 1      |
| Feature Docs Deleted     | 3      |
| Feature Docs Created     | 1      |
| Feature Docs Updated     | 1      |
| Story Files Updated      | 7      |
| **Total Files Modified** | **10** |

## Benefits of Corrections

1. **Consistent Structure** ✅

   - Now matches the Director Management pattern
   - Clear Epic → Feature → Story hierarchy

2. **Appropriate Granularity** ✅

   - Features represent complete functional capabilities
   - Stories are sprint-sized work items
   - No confusion between feature and story scope

3. **No Naming Conflicts** ✅

   - Epic and feature have distinct names
   - "League Participant Management" vs "Admin People Management"

4. **Better Grouping** ✅

   - All related people management stories under one feature
   - Easier to track feature completion
   - Better alignment with Azure Boards structure

5. **Clearer Product Area** ✅
   - "League Participant Management" encompasses all participant types
   - More accurate and descriptive

## Next Steps

The corrected structure is now ready for:

1. **Azure Boards Synchronization**

   - Create Feature work item for APMF-001
   - Link existing stories APMF-001, 002, 003 to the feature
   - Update epic name in Azure Boards to "League Participant Management"
   - Replace TBD work item IDs in documentation

2. **Create Remaining Stories**

   - APMF-TBD1 through APMF-TBD7 (people list and detail stories)
   - Assign proper story IDs once created in Azure Boards

3. **Create Additional Features**
   - APMF-040: Admin Household Management
   - Define stories for household feature

---

**Corrections completed by:** Claude Code
**Completion date:** 2025-10-23
**Status:** ✅ Structure Corrected and Aligned
