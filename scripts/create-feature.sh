#!/bin/bash

# Create Feature Script
# Generates a new feature file from template with proper ID

set -e  # Exit on any error

# Source the utility functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/registry-utils.sh"

# Parse command line arguments
if [[ $# -lt 3 || $# -gt 4 ]]; then
    cat << 'EOF'
Usage: ./scripts/create-feature.sh <feature-id> <title> <epic-id> [description]

Create a new feature file from template with proper ID.

Arguments:
  feature-id    Feature ID (e.g., APMF-001, AGMF-001)
  title         Feature title
  epic-id       Parent epic ID
  description   Optional feature description

Examples:
  ./scripts/create-feature.sh APMF-001 "People Management" APM-045
  ./scripts/create-feature.sh APMF-046 "Director Management" APM-045 "Manage league directors"

Note: Feature IDs follow the pattern: [EPIC_PREFIX]F-[NUMBER]
      - EPIC_PREFIX: 3-letter product area (APM, AGM, etc.)
      - F: Indicates this is a Feature
      - NUMBER: Sequential feature number (001, 002, etc.)
EOF
    exit 1
fi

FEATURE_ID="$1"
FEATURE_TITLE="$2"
EPIC_ID="$3"
FEATURE_DESCRIPTION="${4:-Brief description of the feature and its business value.}"

# Validate feature ID format (ABCF-123)
if [[ ! "$FEATURE_ID" =~ ^[A-Z]{3}F-[0-9]{3}$ ]]; then
    echo "Error: Feature ID must be in format ABCF-123 (e.g., APMF-001)" >&2
    echo "       The 4th character must be 'F' for Feature" >&2
    exit 1
fi

# Extract parts from feature ID
EPIC_PREFIX="${FEATURE_ID:0:3}"      # APM
FEATURE_SEQUENCE="${FEATURE_ID:5:3}" # 001

# Validate epic area
if ! validate_product_area "$EPIC_PREFIX"; then
    exit 1
fi

# Validate epic exists
if ! epic_id_exists "$EPIC_ID"; then
    echo "Error: Epic '$EPIC_ID' does not exist!" >&2
    echo "Create epic first: ./scripts/create-epic.sh $EPIC_ID \"<title>\"" >&2
    exit 1
fi

# Verify epic prefix matches
EPIC_PREFIX_FROM_ID="${EPIC_ID%-*}"
if [[ "$EPIC_PREFIX" != "$EPIC_PREFIX_FROM_ID" ]]; then
    echo "Error: Feature ID prefix '$EPIC_PREFIX' doesn't match Epic ID prefix '$EPIC_PREFIX_FROM_ID'" >&2
    exit 1
fi

# Get project root and paths
PROJECT_ROOT=$(get_project_root)
FEATURE_DIR="$PROJECT_ROOT/docs/features/$(echo "$EPIC_PREFIX" | tr '[:upper:]' '[:lower:]')"
TEMPLATE_FILE="$PROJECT_ROOT/docs/templates/feature-template.md"

FEATURE_FILENAME="$FEATURE_ID-$(generate_kebab_case "$FEATURE_TITLE").md"
FEATURE_PATH="$FEATURE_DIR/$FEATURE_FILENAME"

# Ensure directory exists
mkdir -p "$FEATURE_DIR"

# Check if template exists
if [[ ! -f "$TEMPLATE_FILE" ]]; then
    echo "Error: Feature template not found at $TEMPLATE_FILE" >&2
    exit 1
fi

# Check if file already exists
if [[ -f "$FEATURE_PATH" ]]; then
    echo "Error: Feature file already exists at $FEATURE_PATH" >&2
    exit 1
fi

# Generate feature content from template
CURRENT_DATE=$(get_current_date)
PRODUCT_AREA_NAME="$(get_product_area_name "$EPIC_PREFIX")"
FEATURE_AREA="$(echo "$EPIC_PREFIX" | tr '[:upper:]' '[:lower:]')"

# Read template and substitute values
FEATURE_CONTENT=$(cat "$TEMPLATE_FILE")
FEATURE_CONTENT="${FEATURE_CONTENT//\{\{FEATURE_ID\}\}/$FEATURE_ID}"
FEATURE_CONTENT="${FEATURE_CONTENT//\{\{FEATURE_TITLE\}\}/$FEATURE_TITLE}"
FEATURE_CONTENT="${FEATURE_CONTENT//\{\{EPIC_ID\}\}/$EPIC_ID}"
FEATURE_CONTENT="${FEATURE_CONTENT//\{\{PRODUCT_AREA\}\}/$PRODUCT_AREA_NAME}"
FEATURE_CONTENT="${FEATURE_CONTENT//\{\{CURRENT_DATE\}\}/$CURRENT_DATE}"
FEATURE_CONTENT="${FEATURE_CONTENT//\{\{FEATURE_DESCRIPTION\}\}/$FEATURE_DESCRIPTION}"
FEATURE_CONTENT="${FEATURE_CONTENT//\{\{FEATURE_AREA\}\}/$FEATURE_AREA}"
FEATURE_CONTENT="${FEATURE_CONTENT//\{\{WORK_ITEM_ID\}\}/000}"
FEATURE_CONTENT="${FEATURE_CONTENT//\{\{PRIORITY\}\}/Medium}"
FEATURE_CONTENT="${FEATURE_CONTENT//\{\{BUSINESS_VALUE\}\}/Describe the business value this feature provides}"

# Create feature file
echo "$FEATURE_CONTENT" > "$FEATURE_PATH"

echo "✅ Created feature file: $FEATURE_PATH"
echo ""
echo "# Feature Created Successfully!"
echo "Feature ID: $FEATURE_ID"
echo "Title: $FEATURE_TITLE"
echo "Epic: $EPIC_ID"
echo "File: $FEATURE_PATH"
echo ""
echo "# Next Steps:"
echo "1. Edit the feature file to add details and acceptance criteria"
echo "2. Create a Feature work item in Azure Boards"
echo "3. Update the {{WORK_ITEM_ID}} placeholder with the Azure Boards ID"
echo "4. Create stories under this feature using:"
echo "   ./scripts/create-story.sh ${FEATURE_ID/F-/-}XXX \"Story Title\" $EPIC_ID"
echo ""
echo "   Example story IDs for this feature:"
echo "   - ${FEATURE_ID/F-/F-}  (e.g., APMF-001 for feature, APMF-001 for first story)"
echo "   - Stories should use format: ${EPIC_PREFIX}F-XXX where XXX is unique"
