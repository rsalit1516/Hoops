Feature: display detil innformation about a person

  Background:
    Given I am on the Admin People Detail page

  Scenario: Display a list of people
    Then I should see a list of people
    And each person should have a last name, first name, Date of Birth (DOB), Gender and a button to Register.
