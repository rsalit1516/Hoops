#!/bin/bash

# Create Epic Script
# Generates a new epic file from template with proper ID and updates registry

set -e  # Exit on any error

# Source the utility functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/registry-utils.sh"

# Parse command line arguments
if [[ $# -lt 2 || $# -gt 3 ]]; then
    cat << 'EOF'
Usage: ./scripts/create-epic.sh <epic-id> <title> [description]

Create a new epic file from template with proper ID and update registry.

Arguments:
  epic-id       Epic ID (e.g., APM-001, AGM-001)
  title         Epic title
  description   Optional epic description

Examples:
  ./scripts/create-epic.sh APM-001 "Admin People Management"
  ./scripts/create-epic.sh AGM-001 "Admin Game Management" "Complete game scheduling and management system"

Note: Use generate-epic-id.sh first to get the next available ID
EOF
    exit 1
fi

EPIC_ID="$1"
EPIC_TITLE="$2"
EPIC_DESCRIPTION="${3:-}"

# Validate epic ID format
if [[ ! "$EPIC_ID" =~ ^[A-Z]{3}-[0-9]{3}$ ]]; then
    echo "Error: Epic ID must be in format ABC-123 (e.g., APM-001)" >&2
    exit 1
fi

# Extract product area from epic ID
PRODUCT_AREA="${EPIC_ID%-*}"

# Validate product area
if ! validate_product_area "$PRODUCT_AREA"; then
    exit 1
fi

# Check if epic already exists
if epic_id_exists "$EPIC_ID"; then
    echo "Error: Epic ID '$EPIC_ID' already exists in registry!" >&2
    exit 1
fi

# Get project root and paths
PROJECT_ROOT=$(get_project_root)
EPIC_DIR="$PROJECT_ROOT/docs/epics"
TEMPLATE_FILE="$PROJECT_ROOT/docs/templates/epic-template.md"
EPIC_FILENAME="$EPIC_ID-$(generate_kebab_case "$EPIC_TITLE").md"
EPIC_PATH="$EPIC_DIR/$EPIC_FILENAME"

# Ensure epics directory exists
mkdir -p "$EPIC_DIR"

# Check if template exists
if [[ ! -f "$TEMPLATE_FILE" ]]; then
    echo "Error: Epic template not found at $TEMPLATE_FILE" >&2
    exit 1
fi

# Check if file already exists
if [[ -f "$EPIC_PATH" ]]; then
    echo "Error: Epic file already exists at $EPIC_PATH" >&2
    exit 1
fi

# Generate epic content from template
CURRENT_DATE=$(get_current_date)
PRODUCT_AREA_NAME="$(get_product_area_name "$PRODUCT_AREA")"

# Read template and substitute values
EPIC_CONTENT=$(cat "$TEMPLATE_FILE")
EPIC_CONTENT="${EPIC_CONTENT//\{\{EPIC_ID\}\}/$EPIC_ID}"
EPIC_CONTENT="${EPIC_CONTENT//\{\{EPIC_TITLE\}\}/$EPIC_TITLE}"
EPIC_CONTENT="${EPIC_CONTENT//\{\{PRODUCT_AREA\}\}/$PRODUCT_AREA_NAME}"
EPIC_CONTENT="${EPIC_CONTENT//\{\{CURRENT_DATE\}\}/$CURRENT_DATE}"

# Add description if provided
if [[ -n "$EPIC_DESCRIPTION" ]]; then
    EPIC_CONTENT="${EPIC_CONTENT//\{\{EPIC_DESCRIPTION\}\}/$EPIC_DESCRIPTION}"
else
    EPIC_CONTENT="${EPIC_CONTENT//\{\{EPIC_DESCRIPTION\}\}/Brief description of the epic purpose and goals.}"
fi

# Create epic file
echo "$EPIC_CONTENT" > "$EPIC_PATH"

echo "✅ Created epic file: $EPIC_PATH"

# Update registry
"$SCRIPT_DIR/lib/update-epic-registry.sh" "$EPIC_ID" "$EPIC_TITLE" "$PRODUCT_AREA_NAME"

echo "✅ Updated epic registry"
echo ""
echo "# Epic Created Successfully!"
echo "Epic ID: $EPIC_ID"
echo "File: $EPIC_PATH"
echo "Product Area: $PRODUCT_AREA_NAME"
echo ""
echo "# Next Steps:"
echo "1. Edit the epic file to add business value, acceptance criteria, and technical notes"
echo "2. Create stories using: ./scripts/generate-story-id.sh $PRODUCT_AREA <type> \"<title>\""
echo "3. Add the epic to your project board (GitHub Issues, Azure DevOps, Jira)"