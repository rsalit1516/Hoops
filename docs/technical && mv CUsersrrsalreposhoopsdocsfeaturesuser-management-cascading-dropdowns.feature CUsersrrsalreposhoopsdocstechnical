Feature: User Form UI/UX Improvements
  As an administrator using the user management system
  I want an intuitive and visually appealing user interface
  So that I can efficiently manage users with a professional experience

  Background:
    Given I am logged in as an administrator
    And I have access to the user management system

  Scenario: Form field layout and responsive design
    Given I am on the user creation/edit form
    When I view the form on a desktop screen
    Then the form should use a 2-column grid layout
    And the User ID field should span both columns for consistency
    And the Household and Person dropdowns should be side-by-side on one row
    And the Username and Name fields should be side-by-side on the next row
    And the User Type field should span both columns at the bottom
    And there should be consistent spacing (gap-4) between form elements

  Scenario: Form field ordering requirements
    Given I am on the user creation/edit form
    When I examine the field order
    Then the fields should appear in this specific sequence:
      """
      1. User ID (full width, disabled)
      2. Household (left column) | Person (right column)
      3. Username (left column) | Name (right column) 
      4. User Type (full width)
      5. Action buttons (Save/Cancel)
      """
    And the Household and Person fields must appear before Username and Name
    And the Username and Name fields must be forced to a new line below the dropdowns

  Scenario: Dark theme dialog styling
    Given I am viewing a user form dialog
    And the application is using a dark theme with black background
    When the dialog appears
    Then all text should be white for readability
    And all button text should be white
    And form field labels should be white
    And form field borders should be visible against the dark background
    And there should be sufficient contrast for accessibility

  Scenario: Material Design form field appearance
    Given I am on the user creation/edit form
    When I examine the form fields
    Then all form fields should use Material Design "fill" appearance
    And dropdown fields should have consistent styling with text inputs
    And field labels should float above the input when focused or filled
    And required field indicators should be clearly visible
    And validation error messages should appear below relevant fields

  Scenario: Responsive button layout
    Given I am on the user creation/edit form
    When I view the action buttons area
    Then the Save button should be a raised button with primary color
    And the Cancel button should be a flat button
    And buttons should be horizontally aligned
    And the Save button should show appropriate states:
      | State | Button Text | Enabled | Color |
      | Clean form | Save | No | Disabled |
      | Dirty valid form | Save | Yes | Primary |
      | Saving | Saving... | No | Primary |
      | Invalid form | Save | No | Disabled |

  Scenario: Form validation feedback
    Given I am on the user creation/edit form
    When the form has validation errors and is dirty
    Then I should see validation error messages under relevant fields
    And invalid fields should have error styling
    And the form status area should show "Please correct the errors above before saving"
    And the Save button should display a helpful tooltip explaining why it's disabled

  Scenario: Loading states and user feedback
    Given I am on the user creation/edit form
    When data is being loaded (households, people)
    Then loading indicators should be shown for relevant dropdowns
    And the form should remain usable during background operations
    When save operations are in progress
    Then the Save button should show "Saving..." text
    And the Save button should be disabled during save operations
    And success/error messages should appear via snackbar notifications

  Scenario: Accessibility requirements
    Given I am using the user form with assistive technology
    When I navigate through the form
    Then all form fields should have proper ARIA labels
    And the tab order should follow the logical field sequence
    And disabled fields should be announced as disabled
    And required fields should be announced as required
    And validation errors should be announced when they appear
    And the form should be fully keyboard navigable