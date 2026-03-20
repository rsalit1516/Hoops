#!/bin/bash

# Test ID Generation Workflow
# Tests the complete ID generation and file creation workflow

set -e  # Exit on any error

# Source the utility functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/registry-utils.sh"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

TEST_ERRORS=0

log_test() {
    echo -e "${BLUE}🧪 TEST: $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    ((TEST_ERRORS++))
}

# Clean up function for test files
cleanup_test_files() {
    local project_root=$(get_project_root)
    
    # Remove test epic and story files
    rm -f "$project_root/docs/epics/TST-001-test-epic.md"
    rm -f "$project_root/docs/stories/TSTF-001-test-story.md"
    rm -f "$project_root/docs/features/tst/TSTF-001-test-story.feature"
    rm -rf "$project_root/docs/features/tst"
    
    # Restore registry backups if they exist
    if [[ -f "$project_root/docs/registry/epics.md.backup" ]]; then
        mv "$project_root/docs/registry/epics.md.backup" "$project_root/docs/registry/epics.md"
    fi
    if [[ -f "$project_root/docs/registry/stories.md.backup" ]]; then
        mv "$project_root/docs/registry/stories.md.backup" "$project_root/docs/registry/stories.md"
    fi
}

# Set up test environment
setup_test_area() {
    local project_root=$(get_project_root)
    
    # Test area is handled directly in the test script
    # TST area validation will be added to the utility functions for testing
}

echo -e "${BLUE}🧪 Testing ID Generation Workflow${NC}"
echo "================================="

# Setup
setup_test_area

# Test 1: Generate Epic ID
log_test "Generate Epic ID for test area"
if EPIC_ID=$("$SCRIPT_DIR/generate-epic-id.sh" TST 2>/dev/null | head -n1); then
    if [[ "$EPIC_ID" =~ ^TST-[0-9]{3}$ ]]; then
        log_success "Generated valid epic ID: $EPIC_ID"
    else
        log_error "Generated invalid epic ID format: $EPIC_ID"
    fi
else
    log_error "Failed to generate epic ID"
fi

# Test 2: Generate Story ID  
log_test "Generate Story ID for test area"
if STORY_ID=$("$SCRIPT_DIR/generate-story-id.sh" TST feature 2>/dev/null | head -n1); then
    if [[ "$STORY_ID" =~ ^TSTF-[0-9]{3}$ ]]; then
        log_success "Generated valid story ID: $STORY_ID"
    else
        log_error "Generated invalid story ID format: $STORY_ID"
    fi
else
    log_error "Failed to generate story ID"
fi

# Test 3: Test ID validation
log_test "ID validation functions"
if validate_product_area "APM" >/dev/null 2>&1; then
    log_success "Product area validation works"
else
    log_error "Product area validation failed"
fi

if validate_story_type "F" >/dev/null 2>&1; then
    log_success "Story type validation works"
else
    log_error "Story type validation failed"
fi

# Test 4: Test sequence generation
log_test "Sequence generation"
SEQ1=$(get_next_epic_sequence "TST" 2>/dev/null)
SEQ2=$(get_next_story_sequence "TST" "F" 2>/dev/null)

if [[ "$SEQ1" =~ ^[0-9]{3}$ ]]; then
    log_success "Epic sequence generation works: $SEQ1"
else
    log_error "Epic sequence generation failed: $SEQ1"
fi

if [[ "$SEQ2" =~ ^[0-9]{3}$ ]]; then
    log_success "Story sequence generation works: $SEQ2"
else
    log_error "Story sequence generation failed: $SEQ2"  
fi

# Test 5: Test error handling
log_test "Error handling for invalid inputs"

# Test invalid product area
if "$SCRIPT_DIR/generate-epic-id.sh" XYZ >/dev/null 2>&1; then
    log_error "Should reject invalid product area"
else
    log_success "Correctly rejects invalid product area"
fi

# Test invalid story type
if "$SCRIPT_DIR/generate-story-id.sh" APM invalid >/dev/null 2>&1; then
    log_error "Should reject invalid story type"
else
    log_success "Correctly rejects invalid story type"
fi

# Test 6: Test kebab case generation
log_test "Kebab case generation"
KEBAB=$(generate_kebab_case "Test Story With Spaces & Symbols!" 2>/dev/null)
if [[ "$KEBAB" == "test-story-with-spaces-symbols" ]]; then
    log_success "Kebab case generation works: $KEBAB"
else
    log_error "Kebab case generation failed: $KEBAB"
fi

# Test 7: Run full validation
log_test "Full system validation"
if "$SCRIPT_DIR/validate-ids.sh" >/dev/null 2>&1; then
    log_success "System validation passed"
else
    log_error "System validation failed"
fi

echo ""
echo -e "${BLUE}📊 Test Results${NC}"
echo "==============="

if (( TEST_ERRORS == 0 )); then
    echo -e "${GREEN}✅ All tests passed! ID generation system is working correctly.${NC}"
    echo ""
    echo -e "${BLUE}🚀 Ready to use:${NC}"
    echo "• ./scripts/generate-epic-id.sh <area> [title]"
    echo "• ./scripts/generate-story-id.sh <area> <type> [title]" 
    echo "• ./scripts/create-epic.sh <epic-id> <title>"
    echo "• ./scripts/create-story.sh <story-id> <title>"
    echo "• ./scripts/validate-ids.sh"
else
    echo -e "${RED}❌ $TEST_ERRORS tests failed. Please check the implementation.${NC}"
    exit 1
fi