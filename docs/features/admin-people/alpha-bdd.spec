Feature: Alphabet Navigation Filtering

  Scenario: Click on a letter to filter people
    Given I am on the Admin People page
    When I click on the letter "B"
    Then the list should update to show only people whose last name starts with "B"

  Scenario: Visual indicator for active filter
    Given a letter filter is selected
    Then it should be styled differently (e.g. highlighted)

  Scenario: Clearing the filter resets to "A"
    Given a letter filter is selected
    When I click "Clear"
    Then the list should update to show only people whose last name starts with "A"
    And the active filter should now be "A"
