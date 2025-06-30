# Feature: Admin People Management

## Scenario: Admin-only Access

Given I am not logged in  
When I navigate to the Admin People page  
Then I should be redirected to the login screen

Given I am logged in as a non-admin user  
When I try to access the Admin People page  
Then I should see an "Access Denied" message

## Scenario: Search for People

Given I am an admin user  
When I type "James" into the search input  
Then I should see a list of people with "James" in their name

## Scenario: View a Person’s Details

Given I have selected a person from the list  
Then I should see:

- Their league information and current season participation
- League history (past teams, roles, performance stats if available)
- Their household and other household members

## Scenario: Add New Person

Given I click "Add Person"  
Then I should see a form with:

- Name, contact info, household dropdown
When I submit valid data  
Then the person should be created and appear in the list

## Scenario: Edit Person

Given I click "Edit" on a person  
Then I should be able to update their details  
When I save  
Then the changes should persist

## Scenario: Delete Person

Given I click "Delete" on a person  
Then I should be prompted to confirm  
When I confirm  
Then the person record should be removed from the list and database
