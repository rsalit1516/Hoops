#!/bin/bash

# Generate Epic ID Script
# Creates the next available epic ID for a given product area

set -e  # Exit on any error

# Source the utility functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/registry-utils.sh"

# Parse command line arguments
if [[ $# -lt 1 || $# -gt 2 ]]; then
    show_usage "generate-epic-id"
    exit 1
fi

PRODUCT_AREA="$(echo "$1" | tr '[:lower:]' '[:upper:]')"  # Convert to uppercase
EPIC_TITLE="$2"

# Validate product area
if ! validate_product_area "$PRODUCT_AREA"; then
    exit 1
fi

# Get next epic sequence
SEQUENCE=$(get_next_epic_sequence "$PRODUCT_AREA")
if [[ $? -ne 0 ]]; then
    echo "Error: Failed to determine next epic sequence" >&2
    exit 1
fi

# Generate epic ID
EPIC_ID="${PRODUCT_AREA}-${SEQUENCE}"

# Check for conflicts (shouldn't happen, but be safe)
if epic_id_exists "$EPIC_ID"; then
    echo "Error: Epic ID '$EPIC_ID' already exists!" >&2
    exit 1
fi

# Output the generated ID
echo "$EPIC_ID"

# If title provided, show additional information
if [[ -n "$EPIC_TITLE" ]]; then
    echo "# Generated Epic Information"
    echo "Epic ID: $EPIC_ID"
    echo "Title: $EPIC_TITLE"
    echo "Product Area: $(get_product_area_name "$PRODUCT_AREA")"
    echo "Date: $(get_current_date)"
    echo ""
    echo "# Next Steps:"
    echo "1. Run: ./scripts/create-epic.sh $EPIC_ID \"$EPIC_TITLE\""
    echo "2. Or manually create: docs/epics/$EPIC_ID-$(generate_kebab_case "$EPIC_TITLE").md"
    echo "3. Update registry: docs/registry/epics.md"
fi