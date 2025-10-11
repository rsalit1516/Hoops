# Related Story: APMF-003
Feature: Alphabet navigation for people list
  As an administrator
  I want to click on alphabet letters to filter the people list
  So that I can quickly navigate through large lists of people

  Background:
    Given I am logged in as an administrator
    And I am on the Admin People List page
    And the following people exist in the system:
      | First Name | Last Name | Status |
      | Alice      | Adams     | Active |
      | Bob        | Baker     | Active |
      | Charlie    | Cooper    | Active |
      | David      | Davis     | Inactive |
      | Eve        | Evans     | Active |
      | Frank      | Foster    | Active |

  @smoke @apmf-003
  Scenario: Click letter filters people by last name initial
    Given the alphabet navigation is displayed
    When I click on the letter "B"
    Then I should see 1 person in the filtered results
    And I should see "Bob Baker" in the results
    And I should not see "Alice Adams" in the results
    And the letter "B" should be visually highlighted as active

  @edge-case @apmf-003
  Scenario: Click "All" shows all people
    Given I have clicked on the letter "A"
    And I see 1 person in the filtered results
    When I click on "All"
    Then I should see all 6 people in the list
    And no letter should be highlighted as active
    And all alphabet filters should be cleared

  @edge-case @apmf-003
  Scenario: Letters with no people are disabled
    Given the alphabet navigation is displayed
    Then the letter "Z" should be visually disabled or grayed out
    When I click on the letter "Z"
    Then I should see an empty state message "No people found with last names starting with Z"
    And the letter "Z" should remain visually disabled

  @state-persistence @apmf-003
  Scenario: Selected letter persists during session
    Given I click on the letter "C"
    And I see "Charlie Cooper" in the results
    When I navigate to another admin page and return
    Then the letter "C" should still be highlighted as active
    And I should still see "Charlie Cooper" in the results

  @integration @apmf-003
  Scenario: Alphabet filter clears text-based filters
    Given I have entered "Bob" in the first name filter
    And I see filtered results
    When I click on the letter "A"
    Then the first name filter should be cleared
    And I should see only people with last names starting with "A"
    And the letter "A" should be highlighted as active

  @responsive @apmf-003
  Scenario: Alphabet navigation works on mobile
    Given I am using a mobile device
    And I am on the Admin People List page
    When I tap on the letter "D"
    Then I should see 1 person in the filtered results
    And I should see "David Davis" in the results
    And the letter "D" should be highlighted as active

  @accessibility @apmf-003
  Scenario: Keyboard navigation through alphabet
    Given the alphabet navigation is displayed
    When I use Tab to navigate through the letters
    Then I should be able to reach each letter with the keyboard
    And pressing Enter on a letter should activate the filter
    And screen readers should announce the selected letter

  @performance @apmf-003
  Scenario: Letter counts are efficiently loaded
    Given the alphabet navigation is displayed
    Then each letter should show a count of matching people
    And letters with 0 people should be visually distinguished
    And the letter counts should load within 1 second

# Implementation Notes
# - Step definitions location: /tests/e2e/step-definitions/APMF-003-steps.ts
# - Page objects location: /tests/e2e/page-objects/alphabet-navigation.ts
# - Test data location: /tests/e2e/fixtures/alphabet-test-data.json