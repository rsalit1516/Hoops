# Agile Documentation Templates & Standards

## Overview

This template system provides a professional, industry-standard approach to agile story management that enables:

- ✅ **Unique story identification** for board tracking (GitHub, Azure DevOps, Jira)
- ✅ **Clear story-to-implementation traceability** from business requirements to deployed code  
- ✅ **Standardized BDD feature files** linked to specific stories
- ✅ **Epic-level planning and tracking** with story rollups
- ✅ **Consistent naming conventions** across all artifacts

## Template Files

### Core Templates
1. **[user-story-template.md](./user-story-template.md)** - Individual story template with agile elements
2. **[bdd-feature-template.feature](./bdd-feature-template.feature)** - Gherkin BDD scenarios linked to stories  
3. **[epic-template.md](./epic-template.md)** - Epic-level planning and story organization
4. **[story-implementation-mapping.md](./story-implementation-mapping.md)** - Traceability matrix linking stories to code
5. **[id-generation-strategy.md](./id-generation-strategy.md)** - Systematic ID assignment and naming conventions

### Supporting Files
- Registry files for tracking assigned IDs
- CLI scripts for automated ID generation
- Git commit and branch naming conventions

## Key Benefits

### For Development Teams
- **Clear work assignments** - Each story has unique ID and can be assigned to developers
- **Progress tracking** - Stories integrate directly with boards and sprint planning  
- **Implementation guidance** - Stories link to specific components, services, and tests
- **Quality gates** - Built-in Definition of Done and acceptance criteria

### For Product Management  
- **Backlog organization** - Stories roll up to epics for release planning
- **Requirements traceability** - Clear path from business value to technical implementation
- **Progress visibility** - Epic progress tracked through story completion
- **Scope management** - Story dependencies and blocking relationships documented

### For QA/Testing
- **BDD scenarios** - Each story has associated Gherkin feature file
- **Test traceability** - Clear mapping from acceptance criteria to automated tests
- **Coverage tracking** - Implementation matrix shows unit, integration, and E2E test status
- **Acceptance criteria** - Testable, specific criteria for each story

## Quick Start Guide

### 1. Create New Epic
```bash
# Copy template
cp docs/templates/epic-template.md docs/epics/APM-001-admin-people-management.md

# Customize with your epic details
# Update epic registry
```

### 2. Create New Story
```bash  
# Copy template
cp docs/templates/user-story-template.md docs/stories/APMF-001-filter-people-lastname.md

# Customize with story details
# Update story registry
```

### 3. Create BDD Feature
```bash
# Copy template  
cp docs/templates/bdd-feature-template.feature docs/features/admin-people/APMF-001-people-lastname-filter.feature

# Write Gherkin scenarios
# Link to story ID
```

### 4. Update Implementation Matrix
As you build the story:
- Link to Angular components
- Link to unit tests  
- Link to E2E tests
- Link to API endpoints
- Update status in story file

## Integration with Tools

### GitHub Issues
- Use story ID in issue title: `[APMF-001] Filter People by Last Name`
- Add labels for epic, points, priority
- Link to story file in issue description

### Azure DevOps  
- Create work item with story ID in title
- Link to epic work item
- Add story file URL to description
- Use story ID in branch names

### Jira
- Use story ID as ticket summary prefix
- Link to epic via Epic Link field
- Add story file URL to description
- Use story points field

## Example Story Lifecycle

1. **Planning Phase**
   - Product Owner creates epic (APM-001)
   - Stories identified and created (APMF-001, APMF-002, etc.)
   - Stories added to sprint backlog

2. **Development Phase**  
   - Developer assigns story to themselves
   - Creates feature branch: `feature/APMF-001-people-lastname-filter`
   - Implements components, services, tests
   - Updates implementation matrix in story file
   - Commits reference story: `feat(APMF-001): add lastname filter component`

3. **Testing Phase**
   - QA implements BDD scenarios
   - Runs automated tests  
   - Verifies acceptance criteria
   - Updates story status

4. **Completion**
   - Story marked Done in story file
   - Epic progress updated
   - Story closed in board/tracking system

## Migration from Current Structure

To migrate existing documentation:

1. **Audit existing content** - Identify current stories and features
2. **Assign retroactive IDs** - Apply new ID scheme to existing work  
3. **Create epic structure** - Group related stories into epics
4. **Update cross-references** - Fix links between documents
5. **Create registries** - Track all assigned IDs
6. **Configure boards** - Set up GitHub/Azure DevOps/Jira integration

## Next Steps

1. **Review templates** - Customize for your team's specific needs
2. **Set up registries** - Create epic and story tracking files
3. **Train team** - Ensure everyone understands the new process
4. **Create first epic** - Start with Admin People Management (APM-001)
5. **Migrate existing work** - Apply new structure to current documentation
6. **Configure tools** - Set up board integration and automation

---

*This template system follows industry best practices for agile development and integrates seamlessly with modern development tools and workflows.*