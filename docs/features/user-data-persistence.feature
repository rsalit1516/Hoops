Feature: User Data Persistence and Field Mapping
  As a system administrator
  I want user data to be correctly saved and retrieved from the database
  So that user-household-person relationships are accurately maintained

  Background:
    Given the system has a SQL Server database with Users, Households, and People tables
    And the API is configured to handle user CRUD operations
    And the frontend is connected to the API

  Scenario: Creating new user with household and person assignment
    Given I am creating a new user
    And I have selected household with ID 15
    And I have selected person "John Doe" with PersonId 30445
    And I have filled in username "jdoe" and name "John Doe"
    When I save the user
    Then a new record should be inserted into the Users table
    And the Users.HouseID field should contain 15
    And the Users.PeopleID field should contain 30445
    And the Users.UserName field should contain "jdoe"
    And the Users.Name field should contain "John Doe"
    And I should receive a success confirmation
    And the new user should have a generated UserID

  Scenario: Updating existing user's household and person assignment
    Given there is an existing user with UserID 123
    And the user currently has HouseID 10 and PeopleID 20000
    When I edit the user
    And I change the household to ID 15
    And I change the person to PersonId 30445
    And I save the changes
    Then the Users table record for UserID 123 should be updated
    And the Users.HouseID field should now contain 15
    And the Users.PeopleID field should now contain 30445
    And all other user fields should remain unchanged
    And I should receive an update success confirmation

  Scenario: Loading existing user data into form
    Given there is a user in the database with:
      | UserID | UserName | Name | HouseID | PeopleID | UserType |
      | 456    | mdoe     | Mary | 15      | 30445    | 1        |
    When I open the user edit form for UserID 456
    Then the form should be populated with:
      | Field     | Value |
      | userId    | 456   |
      | userName  | mdoe  |
      | name      | Mary  |
      | houseId   | 15    |
      | peopleId  | 30445 |
      | userType  | 1     |
    And the household dropdown should show the household with ID 15 as selected
    And the person dropdown should be enabled and populated with people from household 15
    And the person dropdown should show the person with PersonId 30445 as selected

  Scenario: Database field mapping validation
    Given the system uses different naming conventions between frontend and backend
    When data flows between the frontend and database
    Then the following field mappings should be correctly handled:
      | Frontend Field | C# Property | Database Column | API JSON Response |
      | userId        | UserId      | UserID          | userId           |
      | userName      | UserName    | UserName        | userName         |
      | name          | Name        | Name            | name             |
      | houseId       | HouseId     | HouseID         | houseId          |
      | peopleId      | PersonId    | PeopleID        | peopleId         |
      | userType      | UserType    | UserType        | userType         |
    And JSON serialization should handle camelCase conversion properly
    And JSON deserialization should handle case-insensitive property matching

  Scenario: Handling null/empty people assignments
    Given I am creating or updating a user
    And I have selected a household
    But I have not selected a person (peopleId is null/empty)
    When I save the user
    Then the Users.PeopleID field should be set to NULL in the database
    And the save operation should succeed
    And no validation errors should occur
    And when I reload the user form, the person dropdown should show "-- Select Person --"

  Scenario: Data integrity constraints
    Given I am saving user data
    When I attempt to save a user with an invalid HouseID (non-existent household)
    Then the save operation should fail with a foreign key constraint error
    And I should receive an appropriate error message
    When I attempt to save a user with an invalid PeopleID (non-existent person)
    Then the save operation should fail with a foreign key constraint error
    And I should receive an appropriate error message

  Scenario: API endpoint data persistence verification
    Given I have created/updated a user through the API
    When I query the database directly using SQL:
      """
      SELECT u.UserID, u.UserName, u.HouseID, u.PeopleID, h.Name as HouseholdName, p.FirstName, p.LastName 
      FROM Users u
      LEFT JOIN Households h ON u.HouseID = h.HouseID
      LEFT JOIN People p ON u.PeopleID = p.PeopleID
      WHERE u.UserID = [created_user_id]
      """
    Then the query should return exactly one row
    And the HouseID should match the selected household
    And the PeopleID should match the selected person's PersonId
    And the joins should correctly show the household name and person details

  Scenario: JSON serialization consistency between API endpoints
    Given the system has both main API (UserController) and Functions API (AdminUsersFunction)
    When I retrieve user data from either endpoint
    Then both endpoints should return the same JSON structure for user objects
    And the peopleId field should be consistently named across both APIs
    And the field values should be identical for the same user
    And both endpoints should handle updates with the same JSON property names