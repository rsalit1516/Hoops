# ID Generation and Automation Scripts

This directory contains automation scripts for generating unique IDs and creating agile documentation files with proper naming conventions and board integration.

## 📋 Available Scripts

### Core ID Generation
- **`generate-epic-id.sh`** - Generate next available epic ID for a product area
- **`generate-story-id.sh`** - Generate next available story ID for epic area and type
- **`validate-ids.sh`** - Validate existing IDs and check for conflicts
- **`test-workflow.sh`** - Test the complete ID generation workflow

### File Creation (Template Integration)
- **`create-epic.sh`** - Create epic file from template with proper ID
- **`create-story.sh`** - Create story file and BDD feature from templates

### Utility Scripts
- **`lib/registry-utils.sh`** - Shared utility functions for ID parsing and validation
- **`lib/update-epic-registry.sh`** - Update epic registry with new entries
- **`lib/update-story-registry.sh`** - Update story registry with new entries

## 🚀 Quick Start Examples

### Generate IDs Only
```bash
# Get next epic ID for Admin People Management
./scripts/generate-epic-id.sh APM
# Output: APM-002

# Get next story ID for a feature
./scripts/generate-story-id.sh APM feature "Export people list"
# Output: APMF-004

# Get next bug fix ID
./scripts/generate-story-id.sh APM bug "Fix duplicate entries"
# Output: APMB-001
```

### Create Complete Files
```bash
# Create new epic with files and registry update
./scripts/create-epic.sh APL-001 "Admin Player Management"

# Create new story with files and registry update
./scripts/create-story.sh APLF-001 "Add new player to system"
```

### Validation and Testing
```bash
# Validate all IDs and check for conflicts
./scripts/validate-ids.sh

# Test the complete workflow
./scripts/test-workflow.sh
```

## 📁 ID Format Reference

### Epic IDs: `{AREA}-{SEQUENCE}`
- **APM-001** - Admin People Management
- **AGM-001** - Admin Game Management
- **PLY-001** - Playoff Management

### Story IDs: `{AREA}{TYPE}-{SEQUENCE}`
- **APMF-001** - Admin People Management Feature #1
- **APMB-001** - Admin People Management Bug #1
- **AGMT-001** - Admin Game Management Technical #1

### Product Areas
| Code | Area | Description |
|------|------|-------------|
| APM | Admin People Management | User/person administration |
| AGM | Admin Game Management | Game scheduling and management |
| AHM | Admin Household Management | Household/family management |
| APL | Admin Player Management | Player registration and management |
| PLY | Playoff Management | Tournament and playoff system |
| USR | User Management | Authentication and user roles |
| RPT | Reports & Analytics | Reporting and data analysis |
| SYS | System Administration | System configuration |
| INF | Infrastructure & DevOps | Infrastructure and deployment |

### Story Types
| Code | Type | Description |
|------|------|-------------|
| F | Feature | New functionality |
| B | Bug | Bug fixes |
| T | Technical | Refactoring, infrastructure |
| S | Spike | Research, investigation |

## 🔄 Typical Workflow

### Creating a New Epic
1. Generate ID: `./scripts/generate-epic-id.sh APL "Admin Player Management"`
2. Create files: `./scripts/create-epic.sh APL-001 "Admin Player Management"`
3. Edit the generated epic file with business details
4. Add to your project board: `[APL-001] Admin Player Management`

### Creating a New Story
1. Generate ID: `./scripts/generate-story-id.sh APL feature "Add new player"`
2. Create files: `./scripts/create-story.sh APLF-001 "Add new player to system"`
3. Edit story file with acceptance criteria
4. Update BDD feature file with test scenarios
5. Add to your project board: `[APLF-001] Add new player to system`

### Board Integration
The generated IDs work seamlessly with:

**GitHub Issues:**
```
Title: [APLF-001] Add new player to system
Labels: story, epic:APL-001, points:5, priority:high
```

**Azure DevOps:**
```
Work Item Type: User Story
Title: [APLF-001] Add new player to system
Area Path: Hoops\Admin\Players
Tags: APL-001, player, admin
```

**Jira:**
```
Issue Type: Story
Summary: [APLF-001] Add new player to system
Epic Link: APL-001
Labels: player, admin, registration
```

## 🛡️ Safety Features

- **Conflict Detection** - Scripts check for existing IDs before generating new ones
- **Registry Validation** - Ensures consistency between files and registry
- **Backup Creation** - Registry files are backed up before updates
- **Format Validation** - Validates ID formats and naming conventions
- **Sequence Management** - Automatically manages sequence numbers to prevent gaps

## 🧪 Testing

Run the test suite to verify everything works:
```bash
./scripts/test-workflow.sh
```

This will test:
- ID generation for all product areas and story types
- File creation and template integration
- Registry updates and validation
- Error handling for invalid inputs
- Complete workflow validation

## 📖 Integration with Templates

All scripts integrate with the template system in `docs/templates/`:
- Epic files use `epic-template.md`
- Story files use `user-story-template.md`
- BDD features use `bdd-feature-template.feature`

Template placeholders are automatically replaced:
- `{{EPIC_ID}}` → APL-001
- `{{STORY_ID}}` → APLF-001
- `{{STORY_TITLE}}` → "Add new player to system"
- `{{CURRENT_DATE}}` → 2025-10-11

## 🔧 Customization

To add new product areas:
1. Edit `lib/registry-utils.sh`
2. Add to `PRODUCT_AREAS` array
3. Update documentation

To modify ID formats:
1. Edit validation patterns in `lib/registry-utils.sh`
2. Update generation functions
3. Run tests to verify changes