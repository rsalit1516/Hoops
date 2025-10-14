# Test Specifications - User Management Cascading Dropdowns

## Test Strategy Overview

### Test Pyramid Structure

- **Unit Tests (70%)**: Component methods, services, utilities
- **Integration Tests (20%)**: API communication, database operations
- **E2E Tests (10%)**: Complete user workflows, cross-browser testing

### Test Categories

1. **Functional Tests**: Core business logic and user workflows
2. **UI/UX Tests**: Visual appearance, accessibility, responsive design
3. **API Tests**: JSON serialization, data persistence, error handling
4. **Performance Tests**: Load times, dropdown population speed
5. **Security Tests**: Input validation, data protection

---

## Unit Test Specifications

### AdminUserDetail Component Tests

#### Test Suite: Form Initialization

```typescript
describe("AdminUserDetail - Form Initialization", () => {
  it("should create form with correct initial configuration");
  it("should initialize household options signal as empty array");
  it("should initialize people options signal as empty array");
  it("should set people dropdown as disabled initially");
  it("should load household options on component init");
  it("should handle household loading errors gracefully");
});
```

#### Test Suite: Cascading Dropdown Behavior

```typescript
describe("AdminUserDetail - Cascading Dropdowns", () => {
  it("should enable people dropdown when household is selected");
  it("should populate people options when household changes");
  it("should sort people by lastName then firstName");
  it("should clear people selection when household changes");
  it("should disable and clear people dropdown when household cleared");
  it("should handle empty household (no people) gracefully");
  it("should maintain selection state during people loading");
});
```

#### Test Suite: Form State Management

```typescript
describe("AdminUserDetail - Form State", () => {
  it("should mark form as dirty when household changes");
  it("should mark form as dirty when person changes");
  it("should validate required fields correctly");
  it("should enable save button only when form is valid and dirty");
  it("should disable save button during save operation");
  it("should reset form state after successful save");
});
```

#### Test Suite: Data Population (Edit Mode)

```typescript
describe("AdminUserDetail - Edit Mode", () => {
  it("should populate form with existing user data");
  it("should select correct household in dropdown");
  it("should enable and populate people dropdown for existing household");
  it("should select correct person in dropdown");
  it("should handle users with no household assignment");
  it("should handle users with household but no person assignment");
});
```

### PeopleService Tests

#### Test Suite: API Communication

```typescript
describe("PeopleService", () => {
  it("should fetch household members successfully");
  it("should return observable of Person array");
  it("should handle API errors gracefully");
  it("should apply correct sorting to results");
  it("should cache results appropriately");
  it("should handle empty household response");
});
```

---

## Integration Test Specifications

### API Integration Tests

#### Test Suite: User CRUD Operations

```javascript
describe("User API Integration", () => {
  test("POST /api/AdminUsers creates user with peopleId");
  test("PUT /api/AdminUsers/{id} updates user peopleId");
  test("GET /api/AdminUsers/{id} returns user with correct field names");
  test("JSON serialization uses camelCase property names");
  test("peopleId field maps correctly to database PeopleID column");
  test("Invalid peopleId returns appropriate error");
});
```

#### Test Suite: Database Operations

```javascript
describe("Database Integration", () => {
  test("User creation persists peopleId to Users.PeopleID");
  test("User update modifies Users.PeopleID correctly");
  test("Foreign key constraints prevent invalid peopleId");
  test("Null peopleId saves as NULL in database");
  test("User retrieval maps PeopleID to peopleId in response");
});
```

### Component-Service Integration Tests

#### Test Suite: Service Communication

```typescript
describe("AdminUserDetail <-> Services Integration", () => {
  it("should load households through HouseholdService");
  it("should load people through PeopleService when household selected");
  it("should save user through AdminUsersService with correct data");
  it("should handle service errors with appropriate user feedback");
  it("should show loading states during service calls");
});
```

---

## End-to-End Test Specifications

### User Workflow Tests

#### Test Suite: Create New User Workflow

```gherkin
Feature: Create New User E2E
  Scenario: Admin creates user with household and person
    Given I am logged in as admin
    When I navigate to user creation form
    And I select household "Smith Family"
    And I select person "Doe, John"
    And I enter username "jdoe"
    And I enter name "John Doe"
    And I select user type "User"
    And I click Save
    Then I should see success message
    And I should be redirected to user list
    And the new user should appear in the list
    And database should contain user with correct peopleId
```

#### Test Suite: Edit Existing User Workflow

```gherkin
Feature: Edit User E2E
  Scenario: Admin modifies user's household and person
    Given there is an existing user with household and person
    When I edit the user
    And I change the household to "Johnson Family"
    And I select person "Johnson, Mary"
    And I save the changes
    Then I should see update success message
    And the user list should reflect the changes
    And database should contain updated peopleId
```

### Cross-Browser Tests

#### Test Suite: Browser Compatibility

- **Chrome**: All functionality works correctly
- **Firefox**: Dropdown behavior consistent
- **Edge**: Form styling appears correctly
- **Safari**: Data persistence works properly

### Accessibility Tests

#### Test Suite: WCAG Compliance

```typescript
describe("Accessibility", () => {
  it("should be navigable using keyboard only");
  it("should announce dropdown states to screen readers");
  it("should have proper ARIA labels on all form fields");
  it("should meet color contrast requirements");
  it("should announce validation errors");
  it("should have logical tab order");
});
```

---

## Performance Test Specifications

### Load Time Tests

- **Household dropdown population**: < 500ms for 1000+ households
- **People dropdown population**: < 300ms for 50+ people per household
- **Form initialization**: < 200ms on modern hardware
- **Save operation**: < 1000ms including server round-trip

### Stress Tests

- **Large household list**: 5000+ households
- **Large people list**: 500+ people in single household
- **Concurrent users**: 50+ simultaneous form submissions
- **Network latency**: Functionality under 3G conditions

---

## Test Data Requirements

### Seed Data for Testing

```sql
-- Test Households
INSERT INTO Households (HouseId, Name) VALUES
(1, 'Smith Family'),
(2, 'Johnson Family'),
(3, 'Empty Household');

-- Test People
INSERT INTO People (PersonId, FirstName, LastName, HouseId) VALUES
(100, 'John', 'Smith', 1),
(101, 'Jane', 'Smith', 1),
(102, 'Mary', 'Johnson', 2),
(103, 'Bob', 'Johnson', 2);

-- Test Users
INSERT INTO Users (UserId, UserName, Name, HouseId, PeopleId, UserType) VALUES
(1, 'jsmith', 'John Smith', 1, 100, 1),
(2, 'mjohnson', 'Mary Johnson', 2, 102, 1);
```

### Mock Service Responses

```typescript
// Mock PeopleService responses
const mockHouseholdMembers = [
  { personId: 100, firstName: "John", lastName: "Smith", houseId: 1 },
  { personId: 101, firstName: "Jane", lastName: "Smith", houseId: 1 },
];

// Mock AdminUsersService responses
const mockUser = {
  userId: 1,
  userName: "jsmith",
  name: "John Smith",
  houseId: 1,
  peopleId: 100,
  userType: 1,
};
```

---

## Test Automation Setup

### CI/CD Pipeline Integration

1. **Unit Tests**: Run on every commit
2. **Integration Tests**: Run on pull requests
3. **E2E Tests**: Run on staging deployment
4. **Performance Tests**: Run nightly on develop branch

### Test Environment Configuration

- **Local**: In-memory database, mock services
- **CI**: Docker containers, test database
- **Staging**: Production-like environment, sanitized data
- **Performance**: Dedicated testing infrastructure

### Coverage Requirements

- **Unit Tests**: Minimum 90% code coverage
- **Integration Tests**: All API endpoints covered
- **E2E Tests**: All critical user paths covered
- **Accessibility**: All interactive elements tested

---

## Defect Classification

### Severity Levels

- **P0 - Critical**: Data corruption, security vulnerabilities
- **P1 - High**: Core functionality broken, user cannot complete tasks
- **P2 - Medium**: Minor functionality issues, workarounds available
- **P3 - Low**: UI/UX improvements, nice-to-have features

### Bug Report Template

```markdown
## Bug Report

**Title**: [Concise description]
**Severity**: [P0/P1/P2/P3]
**Component**: [AdminUserDetail/PeopleService/API/etc.]

**Steps to Reproduce**:

1. Step 1
2. Step 2
3. Step 3

**Expected Result**: [What should happen]
**Actual Result**: [What actually happens]
**Environment**: [Browser, OS, version]
**Additional Context**: [Screenshots, logs, etc.]
```
