#!/bin/bash

# Validate IDs Script
# Validates existing IDs and checks for conflicts in the documentation system

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

# Initialize counters
ERRORS=0
WARNINGS=0
INFO_MESSAGES=0

log_error() {
    echo -e "${RED}❌ ERROR: $1${NC}"
    ((ERRORS++))
}

log_warning() {
    echo -e "${YELLOW}⚠️  WARNING: $1${NC}"
    ((WARNINGS++))
}

log_info() {
    echo -e "${BLUE}ℹ️  INFO: $1${NC}"
    ((INFO_MESSAGES++))
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Get project root
PROJECT_ROOT=$(get_project_root)
if [[ $? -ne 0 ]]; then
    log_error "Could not find project root directory"
    exit 1
fi

echo -e "${BLUE}🔍 Validating ID System${NC}"
echo "Project Root: $PROJECT_ROOT"
echo ""

# Check if required directories exist
echo "Checking directory structure..."
REQUIRED_DIRS=("docs/epics" "docs/stories" "docs/features" "docs/registry" "docs/templates")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [[ -d "$PROJECT_ROOT/$dir" ]]; then
        log_success "Directory exists: $dir"
    else
        log_warning "Directory missing: $dir"
    fi
done
echo ""

# Check if required files exist  
echo "Checking required files..."
REQUIRED_FILES=(
    "docs/registry/epics.md"
    "docs/registry/stories.md" 
    "docs/templates/user-story-template.md"
    "docs/templates/epic-template.md"
    "docs/templates/bdd-feature-template.feature"
)
for file in "${REQUIRED_FILES[@]}"; do
    if [[ -f "$PROJECT_ROOT/$file" ]]; then
        log_success "File exists: $file"
    else
        log_error "Required file missing: $file"
    fi
done
echo ""

# Validate epic IDs
echo "Validating epic IDs..."
EPIC_REGISTRY="$PROJECT_ROOT/docs/registry/epics.md"
EPIC_FILES=()

if [[ -f "$EPIC_REGISTRY" ]]; then
    # Extract epic IDs from registry
    REGISTRY_EPICS=()
    while IFS= read -r line; do
        if [[ "$line" =~ ^\|[[:space:]]*([A-Z]{3}-[0-9]{3}) ]]; then
            REGISTRY_EPICS+=("${BASH_REMATCH[1]}")
        fi
    done < "$EPIC_REGISTRY"
    
    # Check epic files
    if [[ -d "$PROJECT_ROOT/docs/epics" ]]; then
        for epic_file in "$PROJECT_ROOT/docs/epics"/*.md; do
            if [[ -f "$epic_file" ]]; then
                filename=$(basename "$epic_file" .md)
                if [[ "$filename" =~ ^([A-Z]{3}-[0-9]{3}) ]]; then
                    epic_id="${BASH_REMATCH[1]}"
                    EPIC_FILES+=("$epic_id")
                    
                    # Check if epic exists in registry
                    if [[ " ${REGISTRY_EPICS[@]} " =~ " ${epic_id} " ]]; then
                        log_success "Epic $epic_id: registry ✓ file ✓"
                    else
                        log_warning "Epic $epic_id: has file but missing from registry"
                    fi
                else
                    log_warning "Epic file has invalid naming: $filename"
                fi
            fi
        done
    fi
    
    # Check for registry entries without files
    for registry_epic in "${REGISTRY_EPICS[@]}"; do
        if [[ ! " ${EPIC_FILES[@]} " =~ " ${registry_epic} " ]]; then
            log_warning "Epic $registry_epic: in registry but no file found"
        fi
    done
    
    log_info "Found ${#EPIC_FILES[@]} epic files and ${#REGISTRY_EPICS[@]} registry entries"
else
    log_error "Epic registry file not found"
fi
echo ""

# Validate story IDs
echo "Validating story IDs..."
STORY_REGISTRY="$PROJECT_ROOT/docs/registry/stories.md"
STORY_FILES=()
FEATURE_FILES=()

if [[ -f "$STORY_REGISTRY" ]]; then
    # Extract story IDs from registry
    REGISTRY_STORIES=()
    while IFS= read -r line; do
        if [[ "$line" =~ ^\|[[:space:]]*([A-Z]{3}[A-Z]-[0-9]{3}) ]]; then
            REGISTRY_STORIES+=("${BASH_REMATCH[1]}")
        fi
    done < "$STORY_REGISTRY"
    
    # Check story files
    if [[ -d "$PROJECT_ROOT/docs/stories" ]]; then
        for story_file in "$PROJECT_ROOT/docs/stories"/*.md; do
            if [[ -f "$story_file" ]]; then
                filename=$(basename "$story_file" .md)
                if [[ "$filename" =~ ^([A-Z]{3}[A-Z]-[0-9]{3}) ]]; then
                    story_id="${BASH_REMATCH[1]}"
                    STORY_FILES+=("$story_id")
                    
                    # Check if story exists in registry
                    if [[ " ${REGISTRY_STORIES[@]} " =~ " ${story_id} " ]]; then
                        log_success "Story $story_id: registry ✓ file ✓"
                    else
                        log_warning "Story $story_id: has file but missing from registry"
                    fi
                    
                    # Check for corresponding BDD feature file
                    epic_area="${story_id:0:3}"
                    epic_area_lower=$(echo "$epic_area" | tr '[:upper:]' '[:lower:]')
                    feature_pattern="$PROJECT_ROOT/docs/features/$epic_area_lower/$story_id-*.feature"
                    
                    feature_found=false
                    for feature_file in $feature_pattern; do
                        if [[ -f "$feature_file" ]]; then
                            feature_found=true
                            FEATURE_FILES+=("$story_id")
                            log_success "Story $story_id: BDD feature ✓"
                            break
                        fi
                    done
                    
                    if [[ "$feature_found" == false ]]; then
                        log_warning "Story $story_id: missing BDD feature file"
                    fi
                else
                    log_warning "Story file has invalid naming: $filename"
                fi
            fi
        done
    fi
    
    # Check for registry entries without files
    for registry_story in "${REGISTRY_STORIES[@]}"; do
        if [[ ! " ${STORY_FILES[@]} " =~ " ${registry_story} " ]]; then
            log_warning "Story $registry_story: in registry but no file found"
        fi
    done
    
    log_info "Found ${#STORY_FILES[@]} story files and ${#REGISTRY_STORIES[@]} registry entries"
    log_info "Found ${#FEATURE_FILES[@]} BDD feature files"
else
    log_error "Story registry file not found"  
fi
echo ""

# Validate ID sequences
echo "Validating ID sequences..."
for epic_file in "${EPIC_FILES[@]}"; do
    epic_prefix="${epic_file%-*}"
    
    # Check story sequences for this epic
    for story_type in F B T S; do
        max_seq=0
        story_pattern="${epic_prefix}${story_type}-"
        
        for story_id in "${STORY_FILES[@]}"; do
            if [[ "$story_id" =~ ^${story_pattern}([0-9]{3})$ ]]; then
                seq="${BASH_REMATCH[1]}"
                seq=$((10#$seq))  # Remove leading zeros
                if (( seq > max_seq )); then
                    max_seq=$seq
                fi
            fi
        done
        
        if (( max_seq > 0 )); then
            # Check for gaps in sequence
            for ((i=1; i<=max_seq; i++)); do
                expected_id="${story_pattern}$(printf "%03d" $i)"
                if [[ ! " ${STORY_FILES[@]} " =~ " ${expected_id} " ]]; then
                    log_warning "Gap in sequence: $expected_id is missing"
                fi
            done
            log_info "Epic $epic_prefix type $story_type: sequence 1-$max_seq"
        fi
    done
done
echo ""

# Summary
echo -e "${BLUE}📊 Validation Summary${NC}"
echo "=================="
if (( ERRORS > 0 )); then
    echo -e "${RED}Errors: $ERRORS${NC}"
fi
if (( WARNINGS > 0 )); then
    echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
fi
echo -e "${BLUE}Info Messages: $INFO_MESSAGES${NC}"

if (( ERRORS == 0 )); then
    echo -e "${GREEN}✅ No critical errors found!${NC}"
    exit 0
else
    echo -e "${RED}❌ Found $ERRORS critical errors that need to be addressed${NC}"
    exit 1
fi