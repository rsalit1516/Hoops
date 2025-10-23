Feature: API JSON Serialization and Field Mapping
  As a system integrator
  I want consistent JSON serialization between frontend and backend APIs
  So that data exchange works reliably across all endpoints

  Background:
    Given the system has multiple API endpoints for user management
    And the frontend uses TypeScript with camelCase naming conventions
    And the backend uses C# with PascalCase naming conventions
    And the database uses mixed case column naming

  Scenario: JSON property name mapping for User objects
    Given the system needs to serialize User objects to JSON
    When a User object is returned from any API endpoint
    Then the JSON response should use camelCase property names:
      """json
      {
        "userId": 123,
        "userName": "jdoe",
        "name": "John Doe",
        "houseId": 15,
        "peopleId": 30445,
        "userType": 1
      }
      """
    And the C# User model properties should be mapped as follows:
      | C# Property | JSON Property | Database Column |
      | UserId      | userId        | UserID          |
      | UserName    | userName      | UserName        |
      | Name        | name          | Name            |
      | HouseId     | houseId       | HouseID         |
      | PersonId    | peopleId      | PeopleID        |
      | UserType    | userType      | UserType        |

  Scenario: Newtonsoft.Json configuration for main API
    Given the main API (UserController) uses Newtonsoft.Json
    When configuring JSON serialization
    Then the C# User model should use JsonProperty attributes:
      """csharp
      [JsonProperty("peopleId")]
      [Column("PeopleID")]
      public int? PersonId { get; set; }
      ```
    And the Startup.cs should configure ReferenceLoopHandling.Ignore
    And property name mapping should work for both serialization and deserialization

  Scenario: System.Text.Json configuration for Functions API
    Given the Functions API uses System.Text.Json
    When configuring JSON serialization in the Functions
    Then the C# User model should use JsonPropertyName attributes:
      ```csharp
      [JsonPropertyName("peopleId")]
      [Column("PeopleID")]
      public int? PersonId { get; set; }
      ```
    And the JsonSerializerOptions should be configured with:
      ```csharp
      PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
      PropertyNameCaseInsensitive = true
      ```
    And both PUT and GET operations should handle the same property names

  Scenario: API endpoint consistency verification
    Given I make a GET request to /api/User/{id}
    And I make a GET request to /api/AdminUsers/{id}
    When I compare the JSON responses for the same user
    Then both responses should have identical structure
    And both should use "peopleId" as the property name
    And both should return the same values for all fields
    And the field types should be consistent (numbers as numbers, strings as strings)

  Scenario: PUT request deserialization handling
    Given the frontend sends a PUT request with JSON payload:
      ```json
      {
        "userId": 123,
        "userName": "jdoe_updated",
        "name": "John Doe Updated",
        "houseId": 16,
        "peopleId": 30450,
        "userType": 1
      }
      ```
    When the API receives this request
    Then the JSON should deserialize correctly to the C# User object:
      | C# Property | Expected Value |
      | UserId      | 123           |
      | UserName    | "jdoe_updated" |
      | Name        | "John Doe Updated" |
      | HouseId     | 16            |
      | PersonId    | 30450         |
      | UserType    | 1             |
    And the database update should use the correct column names
    And the operation should succeed without property mapping errors

  Scenario: Error handling for malformed JSON
    Given the API receives a PUT request with malformed JSON
    When the request contains invalid property names or types
    Then the API should return a 400 Bad Request status
    And the error response should indicate which properties are invalid
    And the error message should be helpful for debugging
    And no partial data should be saved to the database

  Scenario: Backward compatibility with legacy property names
    Given the system may receive requests with legacy property names
    When a request contains "personId" instead of "peopleId"
    Then the PropertyNameCaseInsensitive setting should handle the mapping
    And the request should process successfully
    And the response should still use the standard "peopleId" property name
    And no data should be lost during the conversion

  Scenario: API documentation consistency
    Given the system provides API documentation (Swagger/OpenAPI)
    When I examine the User model schema in the documentation
    Then all property names should be documented as camelCase
    And the "peopleId" property should be shown as optional integer
    And example requests and responses should use consistent property names
    And the documentation should match the actual API behavior

  Scenario: Cross-environment API consistency
    Given the system runs in different environments (Local, Development, Production)
    When I test the same API endpoints across environments
    Then the JSON serialization should behave identically
    And property name mappings should be consistent
    And the same requests should produce the same response structures
    And configuration differences should not affect API contracts