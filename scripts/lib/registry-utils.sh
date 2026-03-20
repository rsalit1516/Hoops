#!/bin/bash

# Registry Utilities for ID Generation
# Shared functions for parsing and updating registry files

# Get the project root directory (where docs/ folder is located)
get_project_root() {
    local current_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    # Navigate up to find the directory containing docs/
    while [[ "$current_dir" != "/" ]]; do
        if [[ -d "$current_dir/docs" ]]; then
            echo "$current_dir"
            return 0
        fi
        current_dir="$(dirname "$current_dir")"
    done
    echo "Error: Could not find project root with docs/ directory" >&2
    return 1
}

# Product area mapping - using functions for macOS bash compatibility
get_product_area_name() {
    case "$1" in
        "APM") echo "Admin People Management" ;;
        "AGM") echo "Admin Game Management" ;;
        "AHM") echo "Admin Household Management" ;;
        "APL") echo "Admin Player Management" ;;
        "PLY") echo "Playoff Management" ;;
        "USR") echo "User Management" ;;
        "RPT") echo "Reports & Analytics" ;;
        "SYS") echo "System Administration" ;;
        "INF") echo "Infrastructure & DevOps" ;;
        "TST") echo "Test Area" ;;
        *) echo "" ;;
    esac
}

# Story type mapping
get_story_type_name() {
    case "$1" in
        "F") echo "Feature" ;;
        "B") echo "Bug" ;;
        "T") echo "Technical" ;;
        "S") echo "Spike" ;;
        *) echo "" ;;
    esac
}

# Get all valid product areas
get_valid_product_areas() {
    echo "APM AGM AHM APL PLY USR RPT SYS INF TST"
}

# Get all valid story types
get_valid_story_types() {
    echo "F B T S"
}

# Validate product area code
validate_product_area() {
    local area="$1"
    local valid_areas=$(get_valid_product_areas)
    if [[ " $valid_areas " =~ " $area " ]]; then
        return 0
    else
        echo "Error: Invalid product area '$area'" >&2
        echo "Valid areas: $valid_areas" >&2
        return 1
    fi
}

# Validate story type
validate_story_type() {
    local type="$1"
    local type_upper="$(echo "$type" | tr '[:lower:]' '[:upper:]')"  # Convert to uppercase
    local valid_types=$(get_valid_story_types)
    if [[ " $valid_types " =~ " $type_upper " ]]; then
        return 0
    else
        echo "Error: Invalid story type '$type'" >&2
        echo "Valid types: $valid_types" >&2
        return 1
    fi
}

# Get next epic sequence number for a product area
get_next_epic_sequence() {
    local area="$1"
    local project_root
    project_root="$(get_project_root)" || return 1
    
    local epic_registry="$project_root/docs/registry/epics.md"
    
    if [[ ! -f "$epic_registry" ]]; then
        echo "001"
        return 0
    fi
    
    # Find all existing epic IDs for this area
    local max_seq=0
    while IFS= read -r line; do
        if [[ "$line" =~ ^\|[[:space:]]*${area}-([0-9]+) ]]; then
            local seq="${BASH_REMATCH[1]}"
            # Remove leading zeros for numeric comparison
            seq=$((10#$seq))
            if (( seq > max_seq )); then
                max_seq=$seq
            fi
        fi
    done < "$epic_registry"
    
    # Return next sequence, zero-padded to 3 digits
    printf "%03d" $((max_seq + 1))
}

# Get next story sequence number for epic and story type
get_next_story_sequence() {
    local epic_prefix="$1"
    local story_type="$2"
    local project_root
    project_root="$(get_project_root)" || return 1
    
    local story_registry="$project_root/docs/registry/stories.md"
    
    if [[ ! -f "$story_registry" ]]; then
        echo "001"
        return 0
    fi
    
    # Find all existing story IDs for this epic and type
    local max_seq=0
    local pattern="^\\|[[:space:]]*${epic_prefix}${story_type}-([0-9]+)"
    
    while IFS= read -r line; do
        if [[ "$line" =~ $pattern ]]; then
            local seq="${BASH_REMATCH[1]}"
            # Remove leading zeros for numeric comparison
            seq=$((10#$seq))
            if (( seq > max_seq )); then
                max_seq=$seq
            fi
        fi
    done < "$story_registry"
    
    # Return next sequence, zero-padded to 3 digits
    printf "%03d" $((max_seq + 1))
}

# Check if epic ID already exists
epic_id_exists() {
    local epic_id="$1"
    local project_root
    project_root="$(get_project_root)" || return 1
    
    local epic_registry="$project_root/docs/registry/epics.md"
    
    if [[ ! -f "$epic_registry" ]]; then
        return 1  # Doesn't exist
    fi
    
    grep -q "^|[[:space:]]*$epic_id" "$epic_registry"
}

# Check if story ID already exists
story_id_exists() {
    local story_id="$1"
    local project_root
    project_root="$(get_project_root)" || return 1
    
    local story_registry="$project_root/docs/registry/stories.md"
    
    if [[ ! -f "$story_registry" ]]; then
        return 1  # Doesn't exist
    fi
    
    grep -q "^|[[:space:]]*$story_id" "$story_registry"
}

# Generate kebab-case filename from title
generate_kebab_case() {
    local title="$1"
    echo "$title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-*\|-*$//g'
}

# Get current date in YYYY-MM-DD format
get_current_date() {
    date +%Y-%m-%d
}

# Display usage information
show_usage() {
    local script_name="$1"
    case "$script_name" in
        "generate-epic-id")
            cat << 'EOF'
Usage: ./scripts/generate-epic-id.sh <product-area> [title]

Generate the next available epic ID for a product area.

Arguments:
  product-area    Product area code (APM, AGM, AHM, APL, PLY, USR, RPT, SYS, INF)
  title          Optional epic title for display

Examples:
  ./scripts/generate-epic-id.sh APM
  ./scripts/generate-epic-id.sh AGM "Admin Game Management"

Product Areas:
  APM - Admin People Management
  AGM - Admin Game Management  
  AHM - Admin Household Management
  APL - Admin Player Management
  PLY - Playoff Management
  USR - User Management
  RPT - Reports & Analytics
  SYS - System Administration
  INF - Infrastructure & DevOps
EOF
            ;;
        "generate-story-id")
            cat << 'EOF'
Usage: ./scripts/generate-story-id.sh <epic-area> <story-type> [title]

Generate the next available story ID for an epic area and story type.

Arguments:
  epic-area      Epic area code (APM, AGM, AHM, APL, PLY, USR, RPT, SYS, INF)
  story-type     Story type (feature/f, bug/b, technical/t, spike/s)
  title         Optional story title for display

Examples:
  ./scripts/generate-story-id.sh APM feature
  ./scripts/generate-story-id.sh APM f "Filter people by last name"
  ./scripts/generate-story-id.sh AGM bug "Fix game scheduling conflict"

Story Types:
  feature/f - Feature Story (new functionality)
  bug/b     - Bug Fix Story
  technical/t - Technical Story (refactoring, infrastructure)
  spike/s   - Spike Story (research, investigation)
EOF
            ;;
    esac
}