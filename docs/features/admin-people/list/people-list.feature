Feature: display a list of people

  Background:
    Given I am on the Admin People List page

  Scenario: Display a list of people
    Then I should see a list of people
    And each person should have a last name, first name, Date of Birth (DOB), Gender and a button to Register.

  Scenario: List is empty
    Given there are no people in the system
    Then I should see a message indicating that there are no people to display

  Scenario: Pagination of the list
    Given there are more than 10 people in the system
    When I navigate to the second page
    Then I should see the next set of people in the list

  Scenario: Sorting by last name
    When I click on the "Last Name" column header
    Then the list should be sorted by last name in ascending order

  Scenario: Sorting by first name
    When I click on the "First Name" column header
    Then the list should be sorted by first name in ascending order

  Scenario: Sorting by DOB
    When I click on the "DOB" column header
    Then the list should be sorted by Date of Birth in ascending order
    
  Scenario: Registration button functionality
    Given I am on the Admin People List page
    When I click on the "Register" button for a person
    Then I should be redirected to the registration page for that person 
    