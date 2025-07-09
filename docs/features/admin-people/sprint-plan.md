# 🏀 Sprint Plan: Admin People Module (Alphabet, List, State)

## 🎯 Sprint Goals

- Finalize and implement Alphabet Navigation UI
- Draft and refine modular story and `.feature` files for List and State
- Begin setup for unit testing coverage and CI/CD test integration

---

## 📁 Feature Modules

| Folder          | Story File                 | Feature File                      | Status   | Notes                                             |
|-----------------|----------------------------|-----------------------------------|----------|---------------------------------------------------|
| `alphabet/`     | `alphabet-story.md`        | `alphabet-navigation.feature`     | ✅ Done  | Clear defaults to "A"; unit tests in progress     |
| `list/`         | `list-story.md` (planned)  | `list-rendering.feature` (planned)| 🟡 Drafting | Covers list display and UX edge cases            |
| `state/`        | `state-story.md` (planned) | `state-persistence.feature` (planned) | ❌ Not started | Will address localStorage signal usage        |

---

## 🧪 Unit Testing Status

| Module          | Spec File                     | Status     | Coverage Notes                           |
|-----------------|-------------------------------|------------|------------------------------------------|
| Alphabet Nav    | `alphabet-filter.spec.ts`     | ✅ Working | Covers selection, clear, styling logic   |
| List Renderer   | `list-filter.spec.ts`         | ❌ Broken  | Needs service mock and DOM query fix     |
| State Manager   | `state-storage.spec.ts`       | 🚫 Missing | To be written after story finalization   |

---

## 🔗 CI/CD Integration Tasks

| Phase           | Task                                      | Status     |
|-----------------|--------------------------------------------|------------|
| Docs + Planning | Update story + feature file references     | 🟢 In progress |
| Testing         | Add unit tests to Jest config and CI jobs  | 🚧 Planned     |
| Automation      | Map story files for future agent input     | 🟡 Drafted     |

---

## 📝 Backlog

- 📦 Pagination strategy for People list
- 🧮 Role-based filtering and full search capabilities
- 📱 Responsive UI adjustments for mobile
- 🧼 Refactor legacy styles with Tailwind standards
- 📖 Draft `dev-style-guide.md` for coding/test conventions
  
# 🗃️ Kanban Board – Admin People Module

## ✅ Done
- Alphabet Navigation: story, feature spec, unit tests completed
- `alphabet-filter.spec.ts`: passing and CI/CD-ready

## 🚧 In Progress
- `list-story.md`: drafting scenarios and persona flows
- `list-rendering.feature`: sketching out test criteria
- Audit broken unit tests (`list.spec.ts`, `avatar.spec.ts`)

## ⏳ Planned
- `state-story.md` + `state-persistence.feature`
- Unit test coverage for localStorage signal logic
- Dev Style Guide: coding and testing conventions

## 📝 Backlog
- Pagination framework for People list
- Role-based filtering with compound search logic
- Tailwind refactor for responsiveness