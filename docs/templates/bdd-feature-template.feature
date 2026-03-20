# Related Story: {STORY_ID}
Feature: {Feature title in natural language}
  As a {user_type}
  I want {functionality}
  So that {business_value}

  Background:
    Given {common setup conditions that apply to all scenarios}
    And {additional setup if needed}

  @smoke @{story_id}
  Scenario: {Happy path scenario name}
    Given {precondition}
    And {additional precondition if needed}
    When {user action}
    And {additional action if needed}  
    Then {expected result}
    And {additional verification if needed}

  @edge-case @{story_id}
  Scenario: {Edge case scenario name}
    Given {edge case precondition}
    When {edge case action}
    Then {expected edge case result}

  @error @{story_id}
  Scenario: {Error condition scenario name}
    Given {error precondition}
    When {action that causes error}
    Then {expected error handling}
    And {system should remain stable}

  @accessibility @{story_id}
  Scenario: {Accessibility requirement}
    Given {accessibility context}
    When {accessibility action}
    Then {accessibility verification}

  # Data-driven scenarios when applicable
  @data-driven @{story_id}
  Scenario Outline: {Parameterized scenario name}
    Given {precondition with <parameter>}
    When {action with <parameter>}
    Then {result with <expected_result>}

    Examples:
      | parameter | expected_result |
      | value1    | result1         |
      | value2    | result2         |

# Implementation Notes
# - Step definitions location: /tests/e2e/step-definitions/{story_id}-steps.ts
# - Page objects location: /tests/e2e/page-objects/{component}-page.ts
# - Test data location: /tests/e2e/fixtures/{story_id}-data.json