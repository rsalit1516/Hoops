#!/bin/bash

# Create Story Script
# Generates a new story file from template with proper ID and updates registry

set -e  # Exit on any error

# Source the utility functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/registry-utils.sh"

# Parse command line arguments
if [[ $# -lt 2 || $# -gt 4 ]]; then
    cat << 'EOF'
Usage: ./scripts/create-story.sh <story-id> <title> [epic-id] [description]

Create a new story file from template with proper ID and update registry.

Arguments:
  story-id      Story ID (e.g., APMF-001, AGMB-001)
  title         Story title
  epic-id       Parent epic ID (auto-detected if not provided)
  description   Optional story description

Examples:
  ./scripts/create-story.sh APMF-004 "Export People List"
  ./scripts/create-story.sh AGMF-001 "Schedule Game Editor" AGM-001
  ./scripts/create-story.sh APMB-001 "Fix duplicate person entries" APM-001 "Users can create duplicate person records"

Note: Use generate-story-id.sh first to get the next available ID
EOF
    exit 1
fi

STORY_ID="$1"
STORY_TITLE="$2"
EPIC_ID="$3"
STORY_DESCRIPTION="$4"

# Validate story ID format
if [[ ! "$STORY_ID" =~ ^[A-Z]{3}[A-Z]-[0-9]{3}$ ]]; then
    echo "Error: Story ID must be in format ABCX-123 (e.g., APMF-001)" >&2
    exit 1
fi

# Extract parts from story ID
EPIC_PREFIX="${STORY_ID:0:3}"      # APM
STORY_TYPE="${STORY_ID:3:1}"       # F
STORY_SEQUENCE="${STORY_ID:5:3}"   # 001

# Validate epic area and story type
if ! validate_product_area "$EPIC_PREFIX"; then
    exit 1
fi

if ! validate_story_type "$STORY_TYPE"; then
    exit 1
fi

# Auto-detect epic ID if not provided
if [[ -z "$EPIC_ID" ]]; then
    PROJECT_ROOT=$(get_project_root)
    if [[ -d "$PROJECT_ROOT/docs/epics" ]]; then
        for epic_file in "$PROJECT_ROOT/docs/epics/${EPIC_PREFIX}"-*.md; do
            if [[ -f "$epic_file" ]]; then
                EPIC_ID=$(basename "$epic_file" .md | cut -d'-' -f1-2)
                break
            fi
        done
    fi
    
    if [[ -z "$EPIC_ID" ]]; then
        echo "Error: Could not auto-detect epic ID for area '$EPIC_PREFIX'" >&2
        echo "Please provide epic ID or create epic first: ./scripts/generate-epic-id.sh $EPIC_PREFIX" >&2
        exit 1
    fi
fi

# Validate epic exists
if ! epic_id_exists "$EPIC_ID"; then
    echo "Error: Epic '$EPIC_ID' does not exist in registry!" >&2
    echo "Create epic first: ./scripts/create-epic.sh $EPIC_ID \"<title>\"" >&2
    exit 1
fi

# Check if story already exists
if story_id_exists "$STORY_ID"; then
    echo "Error: Story ID '$STORY_ID' already exists in registry!" >&2
    exit 1
fi

# Get project root and paths
PROJECT_ROOT=$(get_project_root)
STORY_DIR="$PROJECT_ROOT/docs/stories"
FEATURE_DIR="$PROJECT_ROOT/docs/features/$(echo "$EPIC_PREFIX" | tr '[:upper:]' '[:lower:]' | tr _ -)"
TEMPLATE_FILE="$PROJECT_ROOT/docs/templates/user-story-template.md"
BDD_TEMPLATE_FILE="$PROJECT_ROOT/docs/templates/bdd-feature-template.feature"

STORY_FILENAME="$STORY_ID-$(generate_kebab_case "$STORY_TITLE").md"
STORY_PATH="$STORY_DIR/$STORY_FILENAME"

FEATURE_FILENAME="$STORY_ID-$(generate_kebab_case "$STORY_TITLE").feature"
FEATURE_PATH="$FEATURE_DIR/$FEATURE_FILENAME"

# Ensure directories exist
mkdir -p "$STORY_DIR"
mkdir -p "$FEATURE_DIR"

# Check if template exists
if [[ ! -f "$TEMPLATE_FILE" ]]; then
    echo "Error: Story template not found at $TEMPLATE_FILE" >&2
    exit 1
fi

# Check if files already exist
if [[ -f "$STORY_PATH" ]]; then
    echo "Error: Story file already exists at $STORY_PATH" >&2
    exit 1
fi

# Generate story content from template
CURRENT_DATE=$(get_current_date)
STORY_TYPE_NAME="$(get_story_type_name "$STORY_TYPE")"

# Read template and substitute values
STORY_CONTENT=$(cat "$TEMPLATE_FILE")
STORY_CONTENT="${STORY_CONTENT//\{\{STORY_ID\}\}/$STORY_ID}"
STORY_CONTENT="${STORY_CONTENT//\{\{STORY_TITLE\}\}/$STORY_TITLE}"
STORY_CONTENT="${STORY_CONTENT//\{\{EPIC_ID\}\}/$EPIC_ID}"
STORY_CONTENT="${STORY_CONTENT//\{\{STORY_TYPE\}\}/$STORY_TYPE_NAME}"
STORY_CONTENT="${STORY_CONTENT//\{\{CURRENT_DATE\}\}/$CURRENT_DATE}"

# Add description if provided
if [[ -n "$STORY_DESCRIPTION" ]]; then
    STORY_CONTENT="${STORY_CONTENT//\{\{STORY_DESCRIPTION\}\}/$STORY_DESCRIPTION}"
else
    STORY_CONTENT="${STORY_CONTENT//\{\{STORY_DESCRIPTION\}\}/Brief description of what this story accomplishes for the user.}"
fi

# Create story file
echo "$STORY_CONTENT" > "$STORY_PATH"
echo "✅ Created story file: $STORY_PATH"

# Create BDD feature file if template exists
if [[ -f "$BDD_TEMPLATE_FILE" ]]; then
    FEATURE_CONTENT=$(cat "$BDD_TEMPLATE_FILE")
    FEATURE_CONTENT="${FEATURE_CONTENT//\{\{STORY_ID\}\}/$STORY_ID}"
    FEATURE_CONTENT="${FEATURE_CONTENT//\{\{STORY_TITLE\}\}/$STORY_TITLE}"
    FEATURE_CONTENT="${FEATURE_CONTENT//\{\{EPIC_ID\}\}/$EPIC_ID}"
    
    echo "$FEATURE_CONTENT" > "$FEATURE_PATH"
    echo "✅ Created BDD feature file: $FEATURE_PATH"
fi

# Update registry
"$SCRIPT_DIR/lib/update-story-registry.sh" "$STORY_ID" "$STORY_TITLE" "$EPIC_ID" "$STORY_TYPE_NAME"

echo "✅ Updated story registry"
echo ""
echo "# Story Created Successfully!"
echo "Story ID: $STORY_ID"
echo "File: $STORY_PATH"
echo "Epic: $EPIC_ID"
echo "Type: $STORY_TYPE_NAME"
if [[ -f "$FEATURE_PATH" ]]; then
    echo "BDD Feature: $FEATURE_PATH"
fi
echo ""
echo "# Next Steps:"
echo "1. Edit the story file to add acceptance criteria and technical details"
echo "2. Update the BDD feature file with specific test scenarios"
echo "3. Add the story to your project board with ID: [$STORY_ID] $STORY_TITLE"
echo "4. Assign story points and set priority in the registry"