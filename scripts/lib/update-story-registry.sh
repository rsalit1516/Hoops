#!/bin/bash

# Update Story Registry Script  
# Updates the story registry with new story information

set -e  # Exit on any error

# Source the utility functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/registry-utils.sh"

# Parse command line arguments
if [[ $# -ne 4 ]]; then
    echo "Usage: $0 <story-id> <title> <epic-id> <story-type>" >&2
    exit 1
fi

STORY_ID="$1"
STORY_TITLE="$2"
EPIC_ID="$3"
STORY_TYPE="$4"

# Get project root and registry path
PROJECT_ROOT=$(get_project_root)
STORY_REGISTRY="$PROJECT_ROOT/docs/registry/stories.md"

# Backup registry
if [[ -f "$STORY_REGISTRY" ]]; then
    cp "$STORY_REGISTRY" "$STORY_REGISTRY.backup"
fi

# Create registry if it doesn't exist
if [[ ! -f "$STORY_REGISTRY" ]]; then
    cat > "$STORY_REGISTRY" << 'EOF'
# Story Registry

## Active Stories

| Story ID | Title | Epic | Type | Status | Points | Assignee | Sprint | Priority |
|----------|-------|------|------|--------|--------|----------|--------|----------|

## Completed Stories

| Story ID | Title | Epic | Type | Points | Assignee | Completion Date | Notes |
|----------|-------|------|------|--------|----------|-----------------|-------|
| - | - | - | - | - | - | - | - |

## Next Available Story IDs by Epic

### APM (Admin People Management)
- `APMF-004` - Next feature story (001-003 assigned)
- `APMB-001` - First bug fix story  
- `APMT-001` - First technical story
- `APMS-001` - First spike story

### AGM (Admin Game Management)  
- `AGMF-001` - First feature story
- `AGMB-001` - First bug fix story
- `AGMT-001` - First technical story  
- `AGMS-001` - First spike story

### AHM (Admin Household Management)
- `AHMF-001` - First feature story
- `AHMB-001` - First bug fix story
- `AHMT-001` - First technical story
- `AHMS-001` - First spike story

### APL (Admin Player Management)
- `APLF-001` - First feature story
- `APLB-001` - First bug fix story
- `APLT-001` - First technical story
- `APLS-001` - First spike story

### PLY (Playoff Management)
- `PLYF-001` - First feature story
- `PLYB-001` - First bug fix story
- `PLYT-001` - First technical story
- `PLYS-001` - First spike story

### USR (User Management)
- `USRF-001` - First feature story
- `USRB-001` - First bug fix story
- `USRT-001` - First technical story
- `USRS-001` - First spike story

### RPT (Reports & Analytics)
- `RPTF-001` - First feature story
- `RPTB-001` - First bug fix story
- `RPTT-001` - First technical story
- `RPTS-001` - First spike story

### SYS (System Administration)  
- `SYSF-001` - First feature story
- `SYSB-001` - First bug fix story
- `SYST-001` - First technical story
- `SYSS-001` - First spike story

### INF (Infrastructure & DevOps)
- `INFF-001` - First feature story
- `INFB-001` - First bug fix story
- `INFT-001` - First technical story  
- `INFS-001` - First spike story
EOF
fi

# Find the Active Stories section and add new entry
temp_file=$(mktemp)

# Read the registry line by line and insert the new story in the Active Stories section
in_active_section=false
active_header_found=false
added_story=false

while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ "$line" =~ ^##[[:space:]]*Active[[:space:]]*Stories ]]; then
        echo "$line" >> "$temp_file"
        in_active_section=true
        active_header_found=true
        continue
    elif [[ "$line" =~ ^##[[:space:]]* ]] && [[ "$in_active_section" == true ]] && [[ "$added_story" == false ]]; then
        # We've hit another section, add our story before this section
        echo "| $STORY_ID | $STORY_TITLE | $EPIC_ID | $STORY_TYPE | Not Started | TBD | TBD | TBD | Medium |" >> "$temp_file"
        echo "$line" >> "$temp_file"
        in_active_section=false
        added_story=true
        continue
    elif [[ "$in_active_section" == true ]] && [[ "$line" =~ ^\|.*\|.*\|.*\|.*\|.*\|.*\|.*\|.*\|.*\| ]] && [[ "$added_story" == false ]]; then
        # This is a data row in active stories
        if [[ ! "$line" =~ ^.*Story[[:space:]]*ID.*Title.*Epic.* ]]; then
            # This is a data row, add our story before it (after header)  
            echo "| $STORY_ID | $STORY_TITLE | $EPIC_ID | $STORY_TYPE | Not Started | TBD | TBD | TBD | Medium |" >> "$temp_file"
            added_story=true
        fi
        echo "$line" >> "$temp_file"
        continue
    fi
    
    echo "$line" >> "$temp_file"
done < "$STORY_REGISTRY"

# If we're still in active section at end of file and haven't added story, add it
if [[ "$in_active_section" == true ]] && [[ "$added_story" == false ]]; then
    echo "| $STORY_ID | $STORY_TITLE | $EPIC_ID | $STORY_TYPE | Not Started | TBD | TBD | TBD | Medium |" >> "$temp_file"
fi

# Replace the original file
mv "$temp_file" "$STORY_REGISTRY"

echo "Added story $STORY_ID to registry"