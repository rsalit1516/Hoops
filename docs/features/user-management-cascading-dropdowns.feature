Feature: Cascading Household-Person Dropdown in User Management
  As an administrator
  I want to select a household first and then choose a person from that household
  So that I can properly link users to specific people in their households

  Background:
    Given I am logged in as an administrator
    And I have access to the user management system
    And there are households with associated people in the system

  Scenario: Display household dropdown on user form
    Given I am on the user creation/edit form
    When the page loads
    Then I should see a "Household" dropdown field
    And the household dropdown should be populated with all available households
    And the household dropdown should show household names in alphabetical order
    And the household dropdown should have a default "-- Select Household --" option

  Scenario: People dropdown is initially disabled
    Given I am on the user creation/edit form
    When the page loads
    Then I should see a "Person" dropdown field
    And the person dropdown should be disabled
    And the person dropdown should show "-- Select Person --" as placeholder text

  Scenario: Selecting a household enables and populates person dropdown
    Given I am on the user creation/edit form
    And the person dropdown is initially disabled
    When I select a household from the household dropdown
    Then the person dropdown should become enabled
    And the person dropdown should be populated with people from the selected household
    And the people should be displayed as "LastName, FirstName" format
    And the people should be sorted alphabetically by last name, then first name

  Scenario: Changing household updates person dropdown
    Given I am on the user creation/edit form
    And I have selected a household with people
    And the person dropdown is populated and enabled
    When I change to a different household
    Then the person dropdown should be cleared
    And the person dropdown should be repopulated with people from the new household
    And any previously selected person should be deselected

  Scenario: Clearing household selection disables person dropdown
    Given I am on the user creation/edit form
    And I have selected a household and person
    When I clear the household selection (select "-- Select Household --")
    Then the person dropdown should become disabled
    And the person dropdown should be cleared of any selected value
    And the person field should show "-- Select Person --" placeholder

  Scenario: Form field ordering and layout
    Given I am on the user creation/edit form
    When I view the form layout
    Then the fields should be displayed in this order from top to bottom:
      | Field Order | Field Name |
      | 1          | User ID    |
      | 2          | Household  |
      | 3          | Person     |
      | 4          | Username   |
      | 5          | Name       |
      | 6          | User Type  |
    And the Household and Person fields should be on the same row
    And the Username and Name fields should be on the same row below the dropdowns

  Scenario: Saving user with household and person selection
    Given I am on the user creation form
    And I have filled in all required fields
    And I have selected a household
    And I have selected a person from that household
    When I click the "Save" button
    Then the user should be created successfully
    And the user's PeopleID field should be populated with the selected person's ID
    And the user's HouseID field should be populated with the selected household's ID
    And I should see a success message
    And I should be redirected to the user list

  Scenario: Editing existing user with household and person
    Given I am editing an existing user who has a household and person assigned
    When I open the user edit form
    Then the household dropdown should be pre-populated with the user's current household
    And the person dropdown should be enabled and show people from that household
    And the person dropdown should be pre-populated with the user's current person
    And I should be able to change both selections if needed

  Scenario: Error handling when household has no people
    Given I am on the user creation/edit form
    When I select a household that has no associated people
    Then the person dropdown should become enabled
    But the person dropdown should be empty except for "-- Select Person --"
    And I should be able to proceed without selecting a person
    And the form should still be saveable

  Scenario: Data persistence validation
    Given I have created a user with household and person selections
    When I query the database for that user
    Then the Users table should contain the correct PeopleID value
    And the Users table should contain the correct HouseID value
    And the PeopleID should match the selected person's PersonId
    And the HouseID should match the selected household's HouseId