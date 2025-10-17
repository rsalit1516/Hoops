# Quick Reference: Epic → Feature → Story Workflow

## When To Use Each Level

### Use an EPIC when:

- ✅ Large strategic business initiative
- ✅ Takes multiple months to complete
- ✅ Contains multiple functional capabilities
- ✅ Represents a major product area
- ❌ **NOT for a single module or CRUD interface**

**Example:** "Admin People Management" (includes People, Households, Directors)

### Use a FEATURE when:

- ✅ Complete functional module
- ✅ Takes 1-4 weeks to complete
- ✅ Can be demonstrated as working feature
- ✅ Contains related CRUD operations
- ✅ **YES for "list + forms" module**

**Example:** "Director Management" (list, add, edit, delete directors)

### Use a STORY when:

- ✅ Single piece of functionality
- ✅ Deliverable in 1-5 days
- ✅ Sprint-sized (1-13 story points)
- ✅ Has clear acceptance criteria
- ✅ **YES for "list with sort/pagination"**

**Example:** "View Directors List with Sort and Pagination"

---

## Your Director Management Example

### ✅ CORRECT Structure:

```
Epic: APM-001 - Admin People Management
└── Feature: APMF-046 - Director Management
    ├── Story: APMF-046 - View Directors List (5 pts)
    ├── Story: APMF-047 - Add New Director (3 pts)
    ├── Story: APMF-048 - Edit Director (3 pts)
    └── Story: APMF-049 - Delete Director (2 pts)
```

### ❌ INCORRECT Structure:

```
Epic: APM-002 - Director Management  ← TOO SMALL FOR EPIC
└── Story: View Directors List
```

---

## Command Quick Reference

### Create an Epic

```bash
./scripts/create-epic.sh APM-001 "Admin People Management" "Tools for managing league people"
```

### Create a Feature

```bash
./scripts/create-feature.sh APMF-046 "Director Management" APM-001 "Manage league directors"
```

### Create a Story

```bash
./scripts/create-story.sh APMF-046 "View Directors List" APM-001
```

---

## ID Format Reference

### Epic ID: `ABC-123`

- **ABC** = 3-letter product area code
- **123** = Sequential number
- Examples: `APM-001`, `AGM-001`, `PLY-001`

### Feature ID: `ABCF-123`

- **ABC** = 3-letter product area code (matches epic)
- **F** = Indicates Feature
- **123** = Sequential number
- Examples: `APMF-046`, `AGMF-001`, `PLYF-001`

### Story ID: `ABCT-123`

- **ABC** = 3-letter product area code (matches epic)
- **T** = Type (F=Feature, B=Bug, T=Technical, S=Spike)
- **123** = Sequential number
- Examples: `APMF-046`, `APMB-015`, `APMT-020`

---

## Common Patterns

### Pattern 1: List + CRUD

**Feature-level** (1 feature = 4-5 stories)

- Story 1: View list with sort/pagination (3-5 pts)
- Story 2: Add new entity (2-3 pts)
- Story 3: Edit entity (2-3 pts)
- Story 4: Delete entity (1-2 pts)
- Story 5: Advanced filters (optional, 2-3 pts)

### Pattern 2: Multi-Module Admin

**Epic-level** (1 epic = 3-5 features)

- Feature 1: Module A Management
- Feature 2: Module B Management
- Feature 3: Module C Management

### Pattern 3: When to Split a Story

Split if story is > 8 points:

- By operation: View vs. Add vs. Edit
- By complexity: Basic vs. Advanced
- By user flow: Main path vs. Edge cases

---

## File Locations

```
docs/
├── epics/           ← Strategic level (months)
│   └── APM-001-admin-people-management.md
├── features/        ← Tactical level (weeks)
│   └── apm/
│       └── APMF-046-director-management.md
└── stories/         ← Implementation level (days)
    └── APMF-046-view-directors-list.md
```

---

## Decision Tree

**Starting a new piece of work?**

1. **Does it take multiple months and include multiple modules?**

   - YES → Create an **Epic**
   - NO → Go to #2

2. **Is it a complete module with CRUD operations?**

   - YES → Create a **Feature**
   - NO → Go to #3

3. **Can it be completed in one sprint?**
   - YES → Create a **Story**
   - NO → Split into multiple stories

---

## Your Specific Questions Answered

**Q: "List form" = what level?**
**A:** One **Story** (3-5 points). Include sort/pagination in the same story.

**Q: "List + Edit/Add forms" = what level?**
**A:** One **Feature** with 3-4 **Stories** (View, Add, Edit, Delete).

**Q: "Admin Director Management" = what level?**
**A:** **Feature**, not Epic. Too narrow for epic.

**Q: Should epic be "Admin Management" or "Admin People Management"?**
**A:** "Admin People Management" - more specific and scoped properly.

**Q: Should it contain People, Household, Director?**
**A:** YES! All three should be **Features** under "Admin People Management" **Epic**.

---

## Remember

- **Epics** = Strategic (business capability)
- **Features** = Tactical (functional module)
- **Stories** = Implementation (sprint work)

**When in doubt:** If it's a complete CRUD module, it's a Feature!
