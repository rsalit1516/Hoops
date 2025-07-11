Feature: display detil innformation about a person

  Background:
    Given I am on the Admin People Detail page

  Scenario: The detail of a person is displayed
    When I view the details of a person
    Then I should see the person's: firstName, lastName, birthDate, birthCertificate, cellPhone, workPhone,
    gender, grade, schoolName, parent, coach, player, currentBM, playsUp, volunteerCheckboxes & comments

  Scenario: The save button will be enabled when a change is made
    When I change the firstName of the person
    Then the save button should be enabled

    When I change the lastName of the person
    Then the save button should be enabled
    When I change the birthDate of the person
    Then the save button should be enabled
    When I change the birthCertificate of the person
    Then the save button should be enabled
    When I change the cellPhone of the person
    Then the save button should be enabled
    When I change the workPhone of the person
    Then the save button should be enabled
    
   Scenario: The save button will be disabled when no changes are made
    When I view the details of a person
    Then the save button should be disabled 

  Scenario: The save button will save the changes made
    When I change the firstName of the person and press Save
    Then I should see the updated firstName in the details

    When I change the lastName of the person and press Save
    Then I should see the updated lastName in the details
    When I change the birthDate of the person and press Save
    Then I should see the updated birthDate in the details
    When I change the birthCertificate of the person and press Save
    Then I should see the updated birthCertificate in the details
    When I change the cellPhone of the person and press Save
    Then I should see the updated cellPhone in the details
    When I change the workPhone of the person and press Save
    Then I should see the updated workPhone in the details 

    Scenario: The Cancel button will reset the changes made
    When I change the firstName of the person and press Cancel
    Then the changes will not be saved and the user will be brought back to the People list page.

  Scenario: The delete button will delete the person
    When I click the delete button
    Then I should be prompted to confirm the deletion
    When I confirm the deletion
    Then the person should be removed from the People list page and the database

  Scenario: Be able to Initiate the Registration process for the person
    When I click the Register button
    Then I should be redirected to the Registration page with the person's details pre-filled  

