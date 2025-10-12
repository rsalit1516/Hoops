# Epic {EPIC_ID}: {Epic Title}


**Epic ID:** {EPIC_ID}  
**Product Area:** {PRODUCT_AREA}  
**Product Owner:** {PO_NAME}  
**Tech Lead:** {TECH_LEAD_NAME}  
**Target Release:** {VERSION_NUMBER}  
**Epic Size:** {S|M|L|XL}  
**Business Priority:** {Critical|High|Medium|Low}  

**Azure Boards:** [Epic #{WORK_ITEM_ID}](https://dev.azure.com/{org}/{project}/_workitems/edit/{id})

## Epic Overview
{2-3 sentence description of what this epic delivers and why it matters to the business}

## Business Value
- **Problem Statement:** {What problem does this solve?}
- **Success Metrics:** {How will we measure success?}
- **Target Users:** {Who benefits from this epic?}
- **Business Impact:** {Revenue, efficiency, user satisfaction improvements}

## Stories in Epic

### 🟢 Completed Stories
| Story ID | Title | Points | Status | Developer |
|----------|-------|---------|--------|-----------|
| {STORY_ID} | {Title} | {Points} | ✅ Done | {Name} |

### 🟡 In Progress Stories  
| Story ID | Title | Points | Status | Developer |
|----------|-------|---------|--------|-----------|
| {STORY_ID} | {Title} | {Points} | 🔄 In Progress | {Name} |

### 🔴 Planned Stories
| Story ID | Title | Points | Status | Developer |
|----------|-------|---------|--------|-----------|
| {STORY_ID} | {Title} | {Points} | 📋 Not Started | TBD |

**Total Story Points:** {TOTAL} | **Completed:** {COMPLETED} | **Remaining:** {REMAINING}

## Epic Acceptance Criteria
- [ ] {High-level acceptance criterion 1}
- [ ] {High-level acceptance criterion 2}
- [ ] {High-level acceptance criterion 3}

## Technical Architecture
### Components Affected
- `{ComponentName}` - {description}
- `{ComponentName}` - {description}

### New Services/Infrastructure
- `{ServiceName}` - {description}
- `{ServiceName}` - {description}

### Database Changes
- {Description of schema changes}
- {Migration strategy if needed}

## Dependencies
- **External Dependencies:** {APIs, third-party services, etc.}
- **Epic Dependencies:** {Other epics this depends on}
- **Infrastructure:** {DevOps, security, performance requirements}

## Risks & Mitigations
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| {Risk description} | {High/Med/Low} | {High/Med/Low} | {Mitigation strategy} |

## Release Criteria
- [ ] All stories completed and deployed
- [ ] Performance requirements met
- [ ] Security review passed  
- [ ] Documentation updated
- [ ] User acceptance testing completed
- [ ] Rollback plan prepared

## Timeline
- **Epic Start:** {YYYY-MM-DD}
- **Target Completion:** {YYYY-MM-DD}
- **Sprint Allocation:** {List of sprints}

---
**Epic Status:** {Not Started|In Progress|In Review|Done|On Hold}

## Story Generation Guidelines
**Story Naming Pattern:** `STORY-{XXX}-{kebab-case-title}.md`
**Default Story Points:** {Typical size for stories in this epic}
**Standard Components:** {List of components stories will typically touch}
**Testing Requirements:** {Default testing expectations}

### AI Prompt for Story Creation

## Version History
| Date | Author | Changes |
|------|--------|---------|
| {YYYY-MM-DD} | {Name} | Initial creation |
| {YYYY-MM-DD} | {Name} | {Description of changes} |