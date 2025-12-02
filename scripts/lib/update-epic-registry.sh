#!/bin/bash

# Update Epic Registry Script
# Updates the epic registry with new epic information

set -e  # Exit on any error

# Source the utility functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/registry-utils.sh"

# Parse command line arguments
if [[ $# -ne 3 ]]; then
    echo "Usage: $0 <epic-id> <title> <product-area-name>" >&2
    exit 1
fi

EPIC_ID="$1"
EPIC_TITLE="$2"
PRODUCT_AREA_NAME="$3"
CURRENT_DATE=$(get_current_date)

# Get project root and registry path
PROJECT_ROOT=$(get_project_root)
EPIC_REGISTRY="$PROJECT_ROOT/docs/registry/epics.md"

# Backup registry
if [[ -f "$EPIC_REGISTRY" ]]; then
    cp "$EPIC_REGISTRY" "$EPIC_REGISTRY.backup"
fi

# Create registry if it doesn't exist
if [[ ! -f "$EPIC_REGISTRY" ]]; then
    cat > "$EPIC_REGISTRY" << 'EOF'
# Epic Registry

## Active Epics

| Epic ID | Title | Product Area | Status | Stories | Story Points | Start Date | Target Date | Product Owner |
|---------|-------|--------------|--------|---------|--------------|------------|-------------|---------------|

## Planned Epics

| Epic ID | Title | Product Area | Priority | Estimated Stories | Notes |
|---------|-------|--------------|----------|-------------------|-------|

## Completed Epics

| Epic ID | Title | Status | Completion Date | Final Story Count | Notes |
|---------|-------|--------|-----------------|-------------------|-------|
EOF
fi

# Find the Active Epics section and add new entry
temp_file=$(mktemp)

# Read the registry line by line and insert the new epic in the Active Epics section
in_active_section=false
active_header_found=false

while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ "$line" =~ ^##[[:space:]]*Active[[:space:]]*Epics ]]; then
        echo "$line" >> "$temp_file"
        in_active_section=true
        active_header_found=true
        continue
    elif [[ "$line" =~ ^##[[:space:]]* ]] && [[ "$in_active_section" == true ]]; then
        # We've hit another section, add our epic before this section
        echo "| $EPIC_ID | $EPIC_TITLE | $PRODUCT_AREA_NAME | Planning | 0 | 0 | $CURRENT_DATE | TBD | TBD |" >> "$temp_file"
        echo "$line" >> "$temp_file"
        in_active_section=false
        continue
    elif [[ "$in_active_section" == true ]] && [[ "$line" =~ ^\|.*\|.*\|.*\|.*\|.*\|.*\|.*\|.*\|.*\| ]]; then
        # This is a data row in active epics, we'll add our epic after the header
        if [[ ! "$line" =~ ^.*Epic[[:space:]]*ID.*Title.*Product[[:space:]]*Area.* ]]; then
            # This is a data row, add our epic before it (after header)
            echo "| $EPIC_ID | $EPIC_TITLE | $PRODUCT_AREA_NAME | Planning | 0 | 0 | $CURRENT_DATE | TBD | TBD |" >> "$temp_file"
            in_active_section=false
        fi
        echo "$line" >> "$temp_file"
        continue
    fi
    
    echo "$line" >> "$temp_file"
done < "$EPIC_REGISTRY"

# If we're still in active section at end of file, add the epic
if [[ "$in_active_section" == true ]]; then
    echo "| $EPIC_ID | $EPIC_TITLE | $PRODUCT_AREA_NAME | Planning | 0 | 0 | $CURRENT_DATE | TBD | TBD |" >> "$temp_file"
fi

# Replace the original file
mv "$temp_file" "$EPIC_REGISTRY"

echo "Added epic $EPIC_ID to registry"