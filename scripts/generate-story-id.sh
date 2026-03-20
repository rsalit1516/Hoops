#!/bin/bash

# Generate Story ID Script  
# Creates the next available story ID for a given epic area and story type

set -e  # Exit on any error

# Source the utility functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/registry-utils.sh"

# Parse command line arguments
if [[ $# -lt 2 || $# -gt 3 ]]; then
    show_usage "generate-story-id"
    exit 1
fi

EPIC_AREA="$(echo "$1" | tr '[:lower:]' '[:upper:]')"      # Convert to uppercase
STORY_TYPE_INPUT="$2"
STORY_TITLE="$3"

# Normalize story type input
case "$(echo "$STORY_TYPE_INPUT" | tr '[:upper:]' '[:lower:]')" in  # Convert to lowercase for comparison
    "feature"|"f")
        STORY_TYPE="F"
        STORY_TYPE_NAME="Feature"
        ;;
    "bug"|"b")
        STORY_TYPE="B"
        STORY_TYPE_NAME="Bug"
        ;;
    "technical"|"tech"|"t")
        STORY_TYPE="T"
        STORY_TYPE_NAME="Technical"
        ;;
    "spike"|"s")
        STORY_TYPE="S"
        STORY_TYPE_NAME="Spike"
        ;;
    *)
        echo "Error: Invalid story type '$STORY_TYPE_INPUT'" >&2
        show_usage "generate-story-id"
        exit 1
        ;;
esac

# Validate epic area
if ! validate_product_area "$EPIC_AREA"; then
    exit 1
fi

# Get next story sequence for this epic and type
SEQUENCE=$(get_next_story_sequence "$EPIC_AREA" "$STORY_TYPE")
if [[ $? -ne 0 ]]; then
    echo "Error: Failed to determine next story sequence" >&2
    exit 1
fi

# Generate story ID
STORY_ID="${EPIC_AREA}${STORY_TYPE}-${SEQUENCE}"

# Check for conflicts (shouldn't happen, but be safe)
if story_id_exists "$STORY_ID"; then
    echo "Error: Story ID '$STORY_ID' already exists!" >&2
    exit 1
fi

# Output the generated ID
echo "$STORY_ID"

# If title provided, show additional information
if [[ -n "$STORY_TITLE" ]]; then
    echo "# Generated Story Information"
    echo "Story ID: $STORY_ID"
    echo "Title: $STORY_TITLE"
    echo "Epic Area: $(get_product_area_name "$EPIC_AREA")"
    echo "Story Type: $STORY_TYPE_NAME"
    echo "Date: $(get_current_date)"
    echo ""
    
    # Look for parent epic
    PROJECT_ROOT=$(get_project_root)
    EPIC_PATTERN="${EPIC_AREA}-*"
    PARENT_EPIC=""
    
    if [[ -d "$PROJECT_ROOT/docs/epics" ]]; then
        for epic_file in "$PROJECT_ROOT/docs/epics/${EPIC_AREA}"-*.md; do
            if [[ -f "$epic_file" ]]; then
                PARENT_EPIC=$(basename "$epic_file" .md | cut -d'-' -f1-2)
                break
            fi
        done
    fi
    
    if [[ -n "$PARENT_EPIC" ]]; then
        echo "Parent Epic: $PARENT_EPIC"
    else
        echo "Warning: No parent epic found for area '$EPIC_AREA'"
        echo "Consider creating epic first: ./scripts/generate-epic-id.sh $EPIC_AREA"
    fi
    
    echo ""
    echo "# Next Steps:"
    echo "1. Run: ./scripts/create-story.sh $STORY_ID \"$STORY_TITLE\""
    echo "2. Or manually create: docs/stories/$STORY_ID-$(generate_kebab_case "$STORY_TITLE").md"
    echo "3. Create BDD feature: docs/features/$(echo "$EPIC_AREA" | tr '[:upper:]' '[:lower:]' | tr _ -)/${STORY_ID}-$(generate_kebab_case "$STORY_TITLE").feature"
    echo "4. Update registry: docs/registry/stories.md"
fi