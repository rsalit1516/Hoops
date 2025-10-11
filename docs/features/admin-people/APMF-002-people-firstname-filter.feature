# Related Story: APMF-002
Feature: Filter people by first name
  As an administrator
  I want to filter the people list by first name
  So that I can find people when I only know their first name

  Background:
    Given I am logged in as an administrator
    And I am on the Admin People List page
    And the following people exist in the system:
      | First Name | Last Name | Status |
      | John       | Smith     | Active |
      | Jane       | Wilson    | Active |
      | Johnny     | Johnson   | Inactive |
      | Janet      | Davis     | Active |
      | Michael    | Brown     | Active |

  @smoke @apmf-002
  Scenario: Filter shows people with matching first names
    Given the people list is displayed
    When I enter "Joh" in the first name filter field
    Then I should see 2 people in the filtered results
    And I should see "John Smith" in the results
    And I should see "Johnny Johnson" in the results
    And I should not see "Jane Wilson" in the results
    And I should not see "Janet Davis" in the results

  @edge-case @apmf-002
  Scenario: First name filter is case insensitive
    Given the people list is displayed
    When I enter "john" in the first name filter field
    Then I should see 2 people in the filtered results
    And I should see "John Smith" in the results
    And I should see "Johnny Johnson" in the results

  @integration @apmf-002
  Scenario: Combine first name and last name filters
    Given the people list is displayed
    When I enter "Joh" in the first name filter field
    And I enter "Smi" in the last name filter field
    Then I should see 1 person in the filtered results
    And I should see "John Smith" in the results
    And I should not see "Johnny Johnson" in the results

  @edge-case @apmf-002
  Scenario: Clear first name filter independently
    Given I have entered "John" in the first name filter field
    And I have entered "Smith" in the last name filter field
    And the filtered results show 1 person
    When I clear the first name filter
    Then the last name filter should remain active
    And I should see all people with last names starting with "Smith"

  @error @apmf-002
  Scenario: No matches with first name filter
    Given the people list is displayed
    When I enter "xyz" in the first name filter field
    Then I should see an empty state message "No people found matching your search"
    And I should see 0 people in the filtered results

  @performance @apmf-002
  Scenario: First name filter input is debounced
    Given the people list is displayed
    When I quickly type "J", "o", "h", "n" in the first name filter field
    Then the filter should not trigger until I stop typing for 300ms
    And I should see the loading indicator while filtering

  @accessibility @apmf-002
  Scenario: First name filter is accessible
    Given I am using a screen reader
    And I am on the Admin People List page
    When I navigate to the first name filter field
    Then the filter field should have appropriate ARIA labels
    And the filter field should be labeled as "First Name Filter"
    And the results count should be announced when filter is applied

# Implementation Notes
# - Step definitions location: /tests/e2e/step-definitions/APMF-002-steps.ts
# - Page objects location: /tests/e2e/page-objects/admin-people-page.ts
# - Test data location: /tests/e2e/fixtures/people-data.json