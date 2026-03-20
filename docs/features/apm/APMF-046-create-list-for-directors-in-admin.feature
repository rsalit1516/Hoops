# Related Story: APMF-046 - View Directors List with Sort and Pagination
Feature: View Directors List
  As an admin user
  I want to view and sort a paginated list of directors
  So that I can efficiently browse and manage director information

  Background:
    Given the user is logged in as an Admin
    And the user navigates to Admin from the top menu
    And the user selects Directors from the side menu

  @smoke @APMF-046
  Scenario: View Directors List with Default Settings
    Then a list of directors is displayed in a table
    And the table shows columns: Name, Title, Email, Phone, Active Status
    And the list is sorted by Last Name in ascending order
    And pagination controls are visible at the bottom
    And the total director count is displayed

  @sorting @APMF-046
  Scenario: Sort Directors by Column
    When the user clicks on the "Title" column header
    Then the list is sorted by Title in ascending order
    And a sort indicator (up arrow) appears in the Title column header
    When the user clicks on the "Title" column header again
    Then the list is sorted by Title in descending order
    And a sort indicator (down arrow) appears in the Title column header

  @pagination @APMF-046
  Scenario: Change Page Size
    Given there are 60 directors in the system
    When the user selects "25" from the page size dropdown
    Then 25 directors are displayed
    And the pagination shows "Page 1 of 3"
    When the user clicks "Next Page"
    Then the next 25 directors are displayed
    And the pagination shows "Page 2 of 3"

  @edge-case @APMF-046
  Scenario: Empty Directors List
    Given there are no directors in the system
    When the user views the Directors list
    Then an empty state message is displayed
    And the message says "No directors found. Click 'Add Director' to get started."
    And an "Add Director" button is visible

  @edge-case @APMF-046
  Scenario: Single Director (No Pagination Needed)
    Given there is 1 director in the system
    When the user views the Directors list
    Then 1 director is displayed
    And pagination controls are not visible

  @error @APMF-046
  Scenario: API Failure While Loading Directors
    Given the API is unavailable
    When the user attempts to view the Directors list
    Then an error message is displayed
    And the message says "Unable to load directors. Please try again."
    And a "Retry" button is visible
    When the user clicks the "Retry" button
    Then the system attempts to reload the director list

  @accessibility @APMF-046
  Scenario: Keyboard Navigation in Directors List
    When the user navigates the table using the keyboard
    Then all interactive elements are reachable via Tab key
    And sort controls can be activated with Enter or Space
    And pagination controls can be activated with Enter or Space
    And screen reader announces sort changes appropriately

  @responsive @APMF-046
  Scenario: View Directors List on Mobile Device
    Given the user is on a mobile device
    When the user views the Directors list
    Then the table is responsive and scrollable horizontally
    And column headers remain visible when scrolling
    And touch gestures work for sorting and pagination
