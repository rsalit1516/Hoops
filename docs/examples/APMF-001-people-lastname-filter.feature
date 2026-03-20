# Related Story: APMF-001
Feature: Filter people by last name
  As an administrator
  I want to filter the people list by last name
  So that I can quickly find specific individuals when managing league data

  Background:
    Given I am logged in as an administrator
    And I am on the Admin People List page
    And the following people exist in the system:
      | First Name | Last Name | Status |
      | John       | Smith     | Active |
      | Jane       | Smith     | Active |
      | Bob        | Johnson   | Inactive |
      | Alice      | Wilson    | Active |
      | Mike       | Smithson  | Active |

  @smoke @apmf-001
  Scenario: Filter shows people with matching last names
    Given the people list is displayed
    When I enter "Smi" in the last name filter field
    Then I should see 3 people in the filtered results
    And I should see "John Smith" in the results
    And I should see "Jane Smith" in the results  
    And I should see "Mike Smithson" in the results
    And I should not see "Bob Johnson" in the results
    And I should not see "Alice Wilson" in the results

  @edge-case @apmf-001
  Scenario: Filter is case insensitive
    Given the people list is displayed
    When I enter "smith" in the last name filter field
    Then I should see 3 people in the filtered results
    And I should see "John Smith" in the results
    And I should see "Jane Smith" in the results
    And I should see "Mike Smithson" in the results

  @edge-case @apmf-001
  Scenario: Clear filter shows all people
    Given I have entered "Smith" in the last name filter field
    And the filtered results are displayed
    When I click the clear filter button
    Then I should see all 5 people in the list
    And the last name filter field should be empty

  @edge-case @apmf-001
  Scenario: Empty filter shows all people
    Given the people list is displayed
    When the last name filter field is empty
    Then I should see all 5 people in the list

  @error @apmf-001
  Scenario: No matches shows empty state
    Given the people list is displayed
    When I enter "xyz" in the last name filter field
    Then I should see an empty state message "No people found matching your search"
    And I should see 0 people in the filtered results
    And the clear filter button should be visible

  @performance @apmf-001
  Scenario: Filter input is debounced
    Given the people list is displayed
    When I quickly type "S", "m", "i", "t", "h" in the last name filter field
    Then the filter should not trigger until I stop typing for 300ms
    And I should see the loading indicator while filtering
    And I should see 3 people in the final results

  @accessibility @apmf-001
  Scenario: Filter is accessible to screen readers
    Given I am using a screen reader
    And I am on the Admin People List page
    When I navigate to the last name filter field
    Then the filter field should have appropriate ARIA labels
    And the filter field should announce its purpose
    And the results count should be announced when filter is applied

  # Performance testing scenario
  @performance @apmf-001
  Scenario: Filter performs well with large datasets
    Given there are 2000 people in the system
    And I am on the Admin People List page
    When I enter "Johnson" in the last name filter field
    Then the filter results should appear within 500ms
    And the page should remain responsive during filtering

# Implementation Notes
# - Step definitions location: /tests/e2e/step-definitions/APMF-001-steps.ts
# - Page objects location: /tests/e2e/page-objects/admin-people-page.ts
# - Test data location: /tests/e2e/fixtures/people-data.json