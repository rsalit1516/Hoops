Feature: Reusable List-Detail Framework for Admin Modules
  As a developer
  I want to use a reusable list-detail framework
  So that I can quickly build consistent admin modules with less code duplication

  Background:
    Given the AdminListDetailShell framework component exists
    And the framework supports content projection for filters, forms, and empty states
    And the framework includes built-in sorting and pagination

  Scenario: Framework component renders with basic configuration
    Given I configure the framework with title "Test Module"
    And I provide a data source with 10 records
    And I define 2 columns: "Name" and "Status"
    When the component renders
    Then I should see a header with title "Test Module"
    And I should see an "Add New" button
    And I should see a table with 2 columns
    And I should see 10 rows of data
    And I should see a paginator

  Scenario: Custom filter section renders via content projection
    Given I configure the framework with a custom filter component
    And the filter has a search input field
    When the component renders
    Then I should see the custom filter UI above the table
    And the search input should be functional

  Scenario: Table supports sorting on configured columns
    Given the framework is configured with sortable columns
    And the data source has 20 unsorted records
    When I click on the "Name" column header
    Then the table should sort by name in ascending order
    When I click on the "Name" column header again
    Then the table should sort by name in descending order

  Scenario: Pagination works with configurable page sizes
    Given the framework is configured with 50 records
    And page size options [10, 25, 50]
    When the component renders
    Then I should see the first 25 records (default page size)
    When I select page size 10
    Then I should see only 10 records
    And the paginator should show 5 pages total

  Scenario: Row click emits event with selected record
    Given the framework is configured with clickable rows
    And the table displays 10 director records
    When I click on the 3rd row
    Then a rowClick event should be emitted
    And the event should contain the 3rd director's data

  Scenario: Add button emits event when clicked
    Given the framework has the add button enabled
    When I click the "Add New" button
    Then an addClick event should be emitted
    And the parent component can handle opening the add form

  Scenario: Loading state displays spinner
    Given the framework isLoading signal is set to true
    When the component renders
    Then I should see a loading spinner
    And the table should not be visible

  Scenario: Error state displays error message
    Given the framework errorMessage signal is set to "Failed to load data"
    When the component renders
    Then I should see the error message "Failed to load data"
    And the table should not be visible

  Scenario: Empty state displays when no data
    Given the framework data source is empty
    And a custom empty state message is projected
    When the component renders
    Then I should see the custom empty state UI
    And the table should show 0 rows

  Scenario: Refactored People module uses framework
    Given the People module is refactored to use AdminListDetailShell
    When I navigate to the People admin page
    Then I should see the people list in a table
    And I should be able to sort, paginate, and filter
    And I should be able to add and edit people records
    And all existing functionality should work as before

  Scenario: Refactored Households module uses framework
    Given the Households module is refactored to use AdminListDetailShell
    When I navigate to the Households admin page
    Then I should see the households list in a table
    And I should be able to sort, paginate, and filter
    And I should be able to add and edit household records
    And all existing functionality should work as before

  Scenario: New Directors module uses framework
    Given the Directors module is implemented using AdminListDetailShell
    When I navigate to the Directors admin page
    Then I should see the directors list in a table
    And I should be able to sort by name and title
    And I should be able to paginate through directors
    And I should be able to add a new director
    And I should be able to edit an existing director

  Scenario: Framework supports custom column templates
    Given I configure a column with a custom template
    And the template displays a status badge based on row data
    When the component renders
    Then each row should show the custom status badge
    And the badge should reflect the correct status

  Scenario: Framework handles large datasets efficiently
    Given the framework data source has 1000 records
    When the component renders
    Then the initial render should complete in under 100ms
    And scrolling through pages should be smooth
    And sorting should update quickly

  Scenario: Framework emits CRUD events properly
    Given I am using the framework in the Directors module
    When I click on a director row
    Then the rowClick event should emit the director data
    When I click the "Add New" button
    Then the addClick event should emit
    And the parent component receives the events to handle business logic

  Scenario: Content projection slots work independently
    Given the framework has multiple content projection slots
    When I only provide a filter projection
    Then the filter should render
    And the default empty state should be used
    When I only provide a detail-form projection
    Then the detail form should render
    And the default filter area should be hidden

  Scenario: Framework maintains accessibility standards
    Given the framework is configured with sample data
    When I navigate using keyboard only
    Then I can tab through all interactive elements
    And I can activate buttons and links with Enter
    And the paginator has proper ARIA labels
    And error messages have role="alert"
    And the table has semantic HTML structure
