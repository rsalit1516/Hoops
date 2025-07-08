Feature: Filtering the people list by last name, first name and player status

  Scenario: Filter by last name
    Given I am on the Admin People List page
    When I enter "Smit" in the last name filter
    Then the list should update to show only people starting with the letters in the last name "Smit" 

  Scenario: Filter by first name
    Given I am on the Admin People List page
    When I enter "John" in the first name filter
    Then the list should update to show only people starting with the letters in the first name "John"  