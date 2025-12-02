# Epic → Feature → Story: Visual Guide

## The Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│  EPIC: APM-045 - Admin People Management               │
│  Duration: 2-6 months                                   │
│  Business capability spanning multiple features          │
└─────────────────────────────────────────────────────────┘
              │
              ├─────────────────────────────────────┐
              │                                     │
              ▼                                     ▼
┌──────────────────────────────┐    ┌──────────────────────────────┐
│ FEATURE: APMF-046            │    │ FEATURE: APMF-001            │
│ Director Management          │    │ People Management            │
│ Duration: 1-4 weeks          │    │ Duration: 1-4 weeks          │
│ Complete functional module   │    │ Complete functional module   │
└──────────────────────────────┘    └──────────────────────────────┘
       │                                     │
       ├─────────┬─────────┬─────────┐      └─────────┬──────────┐
       │         │         │         │                 │          │
       ▼         ▼         ▼         ▼                 ▼          ▼
┌───────────┐ ┌────────┐ ┌────────┐ ┌────────┐  ┌─────────┐  ┌────────┐
│ STORY     │ │ STORY  │ │ STORY  │ │ STORY  │  │ STORY   │  │ STORY  │
│ APMF-046  │ │ APMF-047│ │ APMF-048│ │ APMF-049│  │ APMF-001│  │ APMF-002│
│ View List │ │ Add    │ │ Edit   │ │ Delete │  │ Filter  │  │ Filter │
│ 5 pts     │ │ 3 pts  │ │ 3 pts  │ │ 2 pts  │  │ by Last │  │ by First│
│ 2-3 days  │ │ 1-2 day│ │ 1-2 day│ │ 1 day  │  │ 3 pts   │  │ 2 pts  │
└───────────┘ └────────┘ └────────┘ └────────┘  └─────────┘  └────────┘
```

## Your Specific Case: Director Management

### ❌ WRONG (Before)

```
Epic: Director Management
└── Story: View Directors List

Problem: "Director Management" is too small to be an epic
```

### ✅ CORRECT (After)

```
Epic: Admin People Management
└── Feature: Director Management
    ├── Story: View Directors List
    ├── Story: Add New Director
    ├── Story: Edit Director
    └── Story: Delete Director

Solution: Director Management is a Feature under the broader
         Admin People Management Epic
```

## Size Comparison

```
┌─────────────────────────────────────────────┐
│              EPIC                            │  ← Multiple Modules
│  ┌────────────┐  ┌────────────┐  ┌────────┐│     (People, Households,
│  │  FEATURE   │  │  FEATURE   │  │ FEATURE││     Directors)
│  │            │  │            │  │        ││
│  │ ┌────────┐ │  │ ┌────────┐ │  │ ┌────┐││
│  │ │ STORY  │ │  │ │ STORY  │ │  │ │STOR│││
│  │ └────────┘ │  │ └────────┘ │  │ └────┘││
│  │ ┌────────┐ │  │ ┌────────┐ │  │ ┌────┐││
│  │ │ STORY  │ │  │ │ STORY  │ │  │ │STOR│││
│  │ └────────┘ │  │ └────────┘ │  │ └────┘││
│  └────────────┘  └────────────┘  └────────┘│
└─────────────────────────────────────────────┘

       Months            Weeks           Days
```

## Common Patterns

### Pattern 1: CRUD Module = Feature with 4 Stories

```
Feature: Director Management
├── Story: View (List with sort/pagination)    ← 5 points
├── Story: Add (Form to create new)            ← 3 points
├── Story: Edit (Form to update existing)      ← 3 points
└── Story: Delete (Confirmation and removal)   ← 2 points
                                    Total: 13 points
```

### Pattern 2: Multiple Related Modules = Epic with Multiple Features

```
Epic: Admin People Management
├── Feature: People Management        ← 10 stories, ~40 points
├── Feature: Household Management     ← 5 stories, ~20 points
└── Feature: Director Management      ← 4 stories, ~13 points
                             Total: ~73 points, 3-4 months
```

## Decision Tree

```
                Start Here
                    │
                    ▼
        ┌─────────────────────────┐
        │  Multiple modules?      │
        │  (e.g., People + Dirs)  │
        └─────────────────────────┘
                    │
          ┌─────────┴─────────┐
          │                   │
         YES                 NO
          │                   │
          ▼                   ▼
    ┌──────────┐      ┌──────────────────┐
    │  EPIC    │      │  List + Forms?   │
    └──────────┘      │  (CRUD module)   │
                      └──────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                   YES                 NO
                    │                   │
                    ▼                   ▼
              ┌──────────┐      ┌─────────────────┐
              │ FEATURE  │      │ Single operation?│
              └──────────┘      │ (1 sprint task) │
                                └─────────────────┘
                                        │
                                       YES
                                        │
                                        ▼
                                  ┌─────────┐
                                  │  STORY  │
                                  └─────────┘
```

## Real Examples

### ✅ Epic (Large Business Capability)

- Admin People Management
- Playoff System
- User Dashboard
- Reports & Analytics

### ✅ Feature (Complete Module)

- Director Management
- Game Scheduling
- Player Registration
- Team Assignment

### ✅ Story (Single Task)

- View Directors List
- Add New Director
- Sort Games by Date
- Export Player Roster

## File Organization

```
docs/
├── epics/
│   └── APM-045-admin-people-management.md       ← Strategic
│
├── features/
│   └── apm/
│       ├── APMF-001-people-management.md        ← Tactical
│       ├── APMF-040-household-management.md
│       └── APMF-046-director-management.md
│
└── stories/
    ├── APMF-001-filter-people-lastname.md      ← Implementation
    ├── APMF-046-view-directors-list.md
    ├── APMF-047-add-new-director.md
    └── APMF-048-edit-director.md
```

## Remember

**EPIC** = Why we're building this (business value)  
**FEATURE** = What we're building (functional capability)  
**STORY** = How we're building it (implementation detail)

**Your Case:**

- **WHY:** Manage all people in the league (Epic)
- **WHAT:** Manage directors specifically (Feature)
- **HOW:** Show list, add, edit, delete (Stories)
