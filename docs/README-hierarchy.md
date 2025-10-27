# Documentation Structure Guide

## Overview

This document explains the three-level hierarchy used for organizing development work in this project: **Epic → Feature → User Story**.

## Hierarchy Levels

### 1. Epic (Strategic Level)

**Purpose:** Represents a large business capability or strategic initiative  
**Duration:** 2-6 months  
**Location:** `/docs/epics/`  
**Naming:** `{PREFIX}-{NUMBER}-{kebab-case-title}.md` (e.g., `APM-045-admin-people-management.md`)

**Epic Prefix Codes:**

- `APM` - Admin People Management
- `AGM` - Admin Game Management
- `AHM` - Admin Household Management
- `APL` - Admin Player Management
- `PLY` - Playoff Management
- `USR` - User Management
- `RPT` - Reports & Analytics
- `SYS` - System Administration
- `INF` - Infrastructure & DevOps
- `TST` - Test Area

**Example:**

```
Epic APM-045: Admin People Management
├── Feature APMF-001: People Management
├── Feature APMF-040: Household Management
└── Feature APMF-046: Director Management
```

### 2. Feature (Tactical Level)

**Purpose:** A complete functional capability within an epic  
**Duration:** 1-4 weeks  
**Location:** `/docs/features/{epic-prefix}/`  
**Naming:** `{PREFIX}F-{NUMBER}-{kebab-case-title}.md` (e.g., `APMF-046-director-management.md`)

**Feature ID Format:** `{EPIC_PREFIX}F-{NUMBER}`

- Epic Prefix: 3-letter code (APM, AGM, etc.)
- `F`: Indicates this is a Feature
- Number: Sequential (001, 002, ...)

**Example:**

```
Feature APMF-046: Director Management
├── Story APMF-046: View Directors List
├── Story APMF-047: Add New Director
├── Story APMF-048: Edit Director
└── Story APMF-049: Delete Director
```

### 3. User Story (Implementation Level)

**Purpose:** A single piece of work deliverable in one sprint  
**Duration:** 1-5 days  
**Story Points:** 1-13  
**Location:** `/docs/stories/`  
**Naming:** `{PREFIX}{TYPE}-{NUMBER}-{kebab-case-title}.md` (e.g., `APMF-046-view-directors-list.md`)

**Story ID Format:** `{EPIC_PREFIX}{TYPE}-{NUMBER}`

- Epic Prefix: 3-letter code (APM, AGM, etc.)
- Type: Story type (F=Feature, B=Bug, T=Technical, S=Spike)
- Number: Sequential within the feature area

**Story Types:**

- `F` - Feature story (new functionality)
- `B` - Bug fix
- `T` - Technical story (refactoring, tech debt)
- `S` - Spike (research, investigation)

## Creating Documentation

### Create an Epic

```bash
./scripts/create-epic.sh APM-045 "Admin People Management" "Comprehensive people management tools"
```

### Create a Feature

```bash
./scripts/create-feature.sh APMF-046 "Director Management" APM-045 "Manage league directors"
```

### Create a Story

```bash
./scripts/create-story.sh APMF-046 "View Directors List" APM-045
```

## File Organization

```
docs/
├── epics/
│   ├── APM-045-admin-people-management.md
│   ├── AGM-001-admin-game-management.md
│   └── PLY-001-playoff-management.md
├── features/
│   ├── apm/                                    # Admin People Management features
│   │   ├── APMF-001-people-management.md
│   │   ├── APMF-040-household-management.md
│   │   ├── APMF-046-director-management.md
│   │   └── *.feature                           # BDD feature files
│   ├── agm/                                    # Admin Game Management features
│   └── ply/                                    # Playoff features
├── stories/
│   ├── APMF-001-filter-people-lastname.md
│   ├── APMF-046-view-directors-list.md
│   ├── APMF-047-add-new-director.md
│   └── ...
└── templates/
    ├── epic-template.md
    ├── feature-template.md
    ├── user-story-template.md
    └── bdd-feature-template.feature
```

## Integration with Azure Boards

All epics, features, and stories should have corresponding work items in Azure Boards:

1. **Create the markdown file** using the scripts
2. **Create the work item** in Azure Boards
3. **Update the markdown** with the Azure Boards work item ID
4. **Link appropriately:** Story → Feature → Epic

### Azure Boards Hierarchy

```
Epic (Azure) ←→ Epic (Markdown)
    ↓
Feature (Azure) ←→ Feature (Markdown)
    ↓
User Story (Azure) ←→ Story (Markdown)
```

## Best Practices

### When to Create an Epic

- Large strategic business capability
- Spans multiple features
- Takes multiple sprints/months
- Has significant business value
- Examples: "Admin People Management", "Playoff System", "User Dashboard"

### When to Create a Feature

- Complete functional module
- Can be demonstrated to stakeholders
- Contains multiple related stories
- Takes 1-4 weeks to complete
- Examples: "Director Management", "Game Scheduling", "Player Registration"

### When to Create a Story

- Single piece of work
- Deliverable in 1-5 days
- Fits in one sprint
- Has clear acceptance criteria
- Examples: "View Directors List", "Add New Director", "Sort Games by Date"

## Workflow Example: Director Management

1. **Epic Level** - APM-045: Admin People Management

   - Business goal: Provide comprehensive people management
   - Scope: All people, households, and directors

2. **Feature Level** - APMF-046: Director Management

   - Functional capability: Manage league directors
   - Scope: CRUD operations for directors

3. **Story Level** - APMF-046 through APMF-049
   - APMF-046: View Directors List (5 points)
   - APMF-047: Add New Director (3 points)
   - APMF-048: Edit Director (3 points)
   - APMF-049: Delete Director (2 points)

## Common Patterns

### List + CRUD Pattern

A typical feature for managing entities:

- **Story 1:** View list with sort/pagination
- **Story 2:** Add new entity
- **Story 3:** Edit entity
- **Story 4:** Delete entity
- **Story 5 (optional):** Advanced filtering

### Breaking Down Complex Stories

If a story is > 8 points, consider splitting:

- By CRUD operation (view, add, edit, delete)
- By user flow (basic vs. advanced)
- By data complexity (simple fields vs. complex relationships)
- By UI section (list vs. form vs. detail view)

## Template Customization

Templates are located in `/docs/templates/` and use double-brace placeholders:

- `{{EPIC_ID}}` - Epic identifier
- `{{FEATURE_ID}}` - Feature identifier
- `{{STORY_ID}}` - Story identifier
- `{{CURRENT_DATE}}` - Auto-generated date
- `{{PRODUCT_AREA}}` - Product area name

Scripts automatically substitute these values when creating new documents.

## Questions?

For questions about the documentation structure or hierarchy decisions, refer to:

- This README
- Template files in `/docs/templates/`
- Existing examples in `/docs/epics/`, `/docs/features/`, `/docs/stories/`
- Script help: `./scripts/create-epic.sh` (no args for help)
