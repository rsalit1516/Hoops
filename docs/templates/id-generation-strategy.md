# ID Generation Strategy & Naming Conventions

## Overview

This document defines the systematic approach to generating unique IDs for epics, stories, and features to ensure consistency, traceability, and easy board integration.

## Epic IDs

### Format: `{PRODUCT_AREA}-{SEQUENCE_NUMBER}`

**Product Areas:**

- `APM` - Admin People Management
- `AGM` - Admin Game Management
- `AHM` - Admin Household Management
- `APL` - Admin Player Management
- `PLY` - Playoff Management
- `USR` - User Management
- `RPT` - Reports & Analytics
- `SYS` - System Administration
- `INF` - Infrastructure & DevOps

**Examples:**

- `APM-045` - Admin People Management Epic
- `AGM-001` - Admin Game Management Epic
- `PLY-001` - Playoff Bracket Generation Epic

**Sequence Rules:**

- Start at 001 for each product area
- Increment by 1 for each new epic
- Zero-pad to 3 digits
- No gaps in numbering

## Story IDs

### Format: `{EPIC_PREFIX}{STORY_TYPE}-{SEQUENCE_NUMBER}`

**Story Types:**

- `F` - Feature Story (new functionality)
- `B` - Bug Fix Story
- `T` - Technical Story (refactoring, infrastructure)
- `S` - Spike Story (research, investigation)

**Examples:**

- `APMF-001` - Admin People Management Feature #1
- `APMB-001` - Admin People Management Bug Fix #1
- `APMT-001` - Admin People Management Technical Story #1
- `APMS-001` - Admin People Management Spike #1

**Sequence Rules:**

- Each story type has independent sequence within epic
- Start at 001 for each story type within epic
- Zero-pad to 3 digits

## Feature File IDs

### Format: `{STORY_ID}-{feature-name}.feature`

**Examples:**

- `APMF-001-people-lastname-filter.feature`
- `APMF-002-people-firstname-filter.feature`
- `AGMF-001-game-scheduling.feature`

## ID Assignment Workflow

### For New Epics

1. Identify product area from list above
2. Check existing epic numbers: `ls docs/epics/{AREA}-*.md`
3. Assign next available number
4. Create epic file: `docs/epics/{EPIC_ID}-{short-name}.md`

### For New Stories

1. Identify parent epic
2. Determine story type (F/B/T/S)
3. Check existing story numbers: `ls docs/stories/{EPIC_PREFIX}{TYPE}-*.md`
4. Assign next available number
5. Create story file: `docs/stories/{STORY_ID}-{short-description}.md`

### For New Features

1. Use parent story ID
2. Create descriptive feature name (kebab-case)
3. Create feature file: `docs/features/{epic-area}/{STORY_ID}-{feature-name}.feature`

## Board Integration

### GitHub Issues

```markdown
Title: [APMF-001] Filter People by Last Name
Labels: story, epic:APM-045, points:3, priority:medium
```

### Azure DevOps Work Items

```
Title: [APMF-001] Filter People by Last Name
Work Item Type: User Story
Area Path: Hoops\Admin\People
Tags: APM-045, filter, people
```

### Jira Tickets

```
Issue Type: Story
Summary: [APMF-001] Filter People by Last Name
Epic Link: APM-045
Labels: people, filter, admin
```

## ID Registry

Maintain a central registry to prevent conflicts:

### Epic Registry (`docs/registry/epics.md`)

| Epic ID | Title                   | Status  | Stories | Start Date |
| ------- | ----------------------- | ------- | ------- | ---------- |
| APM-045 | Admin People Management | Active  | 8       | 2025-10-01 |
| AGM-001 | Admin Game Management   | Planned | 0       | TBD        |

### Story Registry (`docs/registry/stories.md`)

| Story ID | Title                       | Epic    | Status      | Points | Assignee |
| -------- | --------------------------- | ------- | ----------- | ------ | -------- |
| APMF-001 | Filter People by Last Name  | APM-045 | Done        | 3      | John     |
| APMF-002 | Filter People by First Name | APM-045 | In Progress | 2      | Jane     |

## Automated ID Generation

### CLI Script Example

```bash
# Generate new story ID
./scripts/generate-story-id.sh APM feature "Filter people by status"
# Output: APMF-003

# Generate new epic ID
./scripts/generate-epic-id.sh APL "Admin Player Management"
# Output: APL-001
```

### VS Code Extension Integration

Consider creating snippets for rapid story/epic creation:

```json
{
  "New User Story": {
    "prefix": "story",
    "body": [
      "# Story ${1:STORY_ID}: ${2:Title}",
      "",
      "**Story ID:** ${1:STORY_ID}",
      "**Epic:** ${3:EPIC_ID}",
      "..."
    ]
  }
}
```

## Migration Strategy

For existing documentation:

1. Audit current stories and assign retroactive IDs
2. Update existing files with new naming convention
3. Create registry entries for all existing work
4. Update cross-references and links
5. Configure board integration with new IDs

## Quality Gates

Before creating new IDs:

- [ ] Verify epic/story doesn't already exist
- [ ] Check ID doesn't conflict with registry
- [ ] Ensure story fits within epic scope
- [ ] Validate naming follows conventions
- [ ] Update registry immediately after creation
