# Story APMF-060: Create User Account from Person Detail

**Story ID:** APMF-060
**Feature:** Admin People Management
**Epic:** [APM-045](../../epics/APM-045.md)
**Azure Boards:** TBD

**Story Points:** 5
**Priority:** Medium

## User Story

As an admin user, I want to create a user account directly from a person's detail page so that I can quickly grant system access to household members without manually re-entering their information.

## Acceptance Criteria

### Button Display and Behavior
- [x] A button is displayed on the person detail form in the action area alongside Save, Delete, Register, and Cancel buttons
- [x] Button text dynamically changes based on user existence:
  - Displays "Create User" when no user account exists for the person
  - Displays "User" when a user account already exists for the person
- [x] Button is styled with accent color to distinguish it from other action buttons

### User Creation Flow (No Existing User)
- [x] When "Create User" is clicked and no user exists:
  - Navigates to the user creation form (`/admin/users/detail`)
  - Pre-populates Household field with the person's household (readonly/disabled)
  - Pre-populates Person dropdown with the selected person
  - Pre-populates Name field with person's full name (First Last)
  - Displays hint "Pre-populated from person detail" under household field
  - All other fields are blank and editable
- [x] User can change the selected person to another household member (backward compatibility)
- [x] Password field is available for admin to set initial password

### Existing User Flow
- [x] When "User" is clicked and a user exists:
  - Navigates to the user edit form with existing user data loaded
  - User can edit the existing user account
- [x] System checks for existing users by matching `peopleId` on the person record

### Data Pre-population
- [x] Name field is automatically populated as "{firstName} {lastName}"
- [x] Household field is pre-selected and made readonly
- [x] Person dropdown is pre-selected but changeable
- [x] Password field (pword) is included in the user form

### Validation
- [x] Button click validates that person has a household assigned
- [x] Error message displayed if person has no household: "Please select a person with a household first"
- [x] Form clears previous user data when creating new user (fixes data persistence bug)

## Definition of Done

- [x] Code implemented and tested
- [x] Angular build passes without errors
- [x] Smart button behavior working correctly
- [x] Data pre-population working as expected
- [x] No data persistence issues between user creation sessions
- [x] Password field added to user form
- [x] Backward compatibility maintained (can select different household member)

## Dependencies

- **Related:** APMF-059 (Edit Person Information with Validation)
- **Uses:** Admin Users module and services

## Technical Implementation

### Components Modified

- **Primary:** `PersonalInfo` (`hoops.ui/src/app/admin/admin-people/personal-info/`)
  - Added `AdminUsersService` injection
  - Added `existingUser` computed signal to check for user existence
  - Added `userButtonText` computed signal for dynamic button text
  - Implemented `onCreateUser()` method with smart navigation logic
  - Loads users list on component initialization

- **Primary:** `AdminUserDetail` (`hoops.ui/src/app/admin/admin-users/admin-user-detail/`)
  - Added `isHouseholdReadonly` signal to track readonly state
  - Enhanced `ngOnInit()` to read and process query parameters
  - Added password field (`pword`) to form group
  - Implemented household field disabling when pre-populated

### Services

- `AdminUsersService` - Used to:
  - Load all users for existence checking
  - Clear `selectedUser` signal when creating new user
  - Load specific user when editing existing user

- `PeopleService` - Provides selected person data
- `HouseholdService` - Provides household list for dropdown

### Models/Interfaces

- `User` - Extended with `pword` property for password field
- `Person` - Existing model with `personId`, `houseId`, `firstName`, `lastName`

## Related Files

- **Component:** `hoops.ui/src/app/admin/admin-people/personal-info/personal-info.ts` (lines 20, 57, 80-87, 302-334)
- **Component:** `hoops.ui/src/app/admin/admin-people/personal-info/personal-info.html` (lines 141-148)
- **Component:** `hoops.ui/src/app/admin/admin-users/admin-user-detail/admin-user-detail.ts` (lines 53, 105, 113-134)
- **Component:** `hoops.ui/src/app/admin/admin-users/admin-user-detail/admin-user-detail.html` (lines 25-27, 62-66)
- **Model:** `hoops.ui/src/app/domain/user.ts` (line 14)

## Technical Notes

### Query Parameters
The feature uses Angular query parameters to pass pre-population data:
- `houseId`: Household ID (number)
- `personId`: Person ID (number)
- `name`: Person's full name (string)

### State Management
- Uses Angular signals for reactive state (`selectedUser`, `existingUser`, `userButtonText`)
- Explicitly clears `selectedUser` signal before navigating to create new user to prevent data persistence
- Uses computed signals for derived state (button text, user existence check)

### Backward Compatibility
The person dropdown remains enabled even when pre-populated, allowing admins to select a different household member if needed. This supports the existing database pattern where users might be associated with different household members.

## Test Scenarios

### Happy Path - Create New User

1. Admin navigates to person detail page
2. Person has household assigned
3. No user exists for this person
4. Button displays "Create User"
5. Admin clicks "Create User"
6. User form opens with household (readonly), person, and name pre-populated
7. Admin fills in username and password
8. Admin saves user
9. User account created successfully

### Happy Path - Edit Existing User

1. Admin navigates to person detail page
2. Person has household assigned
3. User already exists for this person
4. Button displays "User"
5. Admin clicks "User"
6. User edit form opens with existing user data
7. Admin makes changes
8. Admin saves user
9. User account updated successfully

### Edge Cases

- **Person with no household**: Button click shows error message
- **Multiple users in household**: Can select different person from dropdown
- **Switching between persons**: Previous user data is cleared when creating new user

### Error Conditions

- Person has no household assigned → Error message displayed
- Navigation fails → Standard Angular routing error handling
- User service fails to load → Error logged, button may not function correctly

## Implementation Summary

This story was implemented to streamline the user account creation process for household members. Key features include:

1. **Smart Button**: Detects whether a user exists and adjusts behavior accordingly
2. **Data Pre-population**: Automatically fills in known information from person record
3. **Readonly Household**: Prevents accidental household changes while maintaining flexibility
4. **Password Management**: Adds password field for temporary admin-managed passwords
5. **Bug Fix**: Resolves data persistence issue where previous user data would carry over

The implementation uses modern Angular patterns including signals for reactive state management and computed values for derived state.

---

**Created:** 2025-12-05
**Last Updated:** 2025-12-05
**Status:** Done
