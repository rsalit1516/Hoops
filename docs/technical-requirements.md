# Technical Requirements Document - User Management Cascading Dropdowns

## Document Information

- **Version**: 1.0
- **Date**: October 10, 2025
- **Author**: GitHub Copilot
- **Status**: Draft
- **Project**: Hoops User Management Enhancement

## Executive Summary

This document outlines the technical requirements for implementing cascading dropdown functionality in the user management system. The enhancement allows administrators to select a household first, then choose a person from that household when creating or editing users, establishing proper data relationships between users, households, and people.

## Project Context

### Current State

- User management form exists with basic fields
- No connection between households and people in user interface
- Manual data entry prone to inconsistencies
- Limited user experience for admin operations

### Desired State

- Intuitive cascading dropdown interface
- Automated population of related data
- Improved data integrity and user experience
- Consistent API responses across all endpoints

## Functional Requirements

### FR-001: Cascading Dropdown Implementation

**Priority**: High  
**Description**: Implement cascading household → person dropdown functionality

#### Detailed Requirements:

- **FR-001.1**: Display household dropdown populated with all available households
- **FR-001.2**: Sort households alphabetically by name
- **FR-001.3**: Person dropdown initially disabled until household selected
- **FR-001.4**: Enable person dropdown when household is selected
- **FR-001.5**: Populate person dropdown with people from selected household
- **FR-001.6**: Display people as "LastName, FirstName" format
- **FR-001.7**: Sort people alphabetically by last name, then first name
- **FR-001.8**: Clear person selection when household changes
- **FR-001.9**: Disable person dropdown when household is cleared

### FR-002: Form Layout Enhancement

**Priority**: Medium  
**Description**: Improve form layout and field ordering

#### Detailed Requirements:

- **FR-002.1**: Implement 2-column responsive grid layout
- **FR-002.2**: Order fields: User ID, Household, Person, Username, Name, User Type
- **FR-002.3**: Place Household and Person dropdowns on same row
- **FR-002.4**: Place Username and Name fields on same row below dropdowns
- **FR-002.5**: User ID and User Type fields span full width
- **FR-002.6**: Maintain consistent spacing between elements

### FR-003: Data Persistence

**Priority**: High  
**Description**: Ensure proper saving and loading of user-household-person relationships

#### Detailed Requirements:

- **FR-003.1**: Save selected person's ID to Users.PeopleID database column
- **FR-003.2**: Save selected household's ID to Users.HouseID database column
- **FR-003.3**: Handle null values when no person is selected
- **FR-003.4**: Pre-populate form fields when editing existing users
- **FR-003.5**: Validate foreign key relationships before saving

### FR-004: UI/UX Improvements

**Priority**: Medium  
**Description**: Enhance visual appearance and user experience

#### Detailed Requirements:

- **FR-004.1**: Apply dark theme styling with white text on black background
- **FR-004.2**: Ensure sufficient color contrast for accessibility
- **FR-004.3**: Display loading states during data operations
- **FR-004.4**: Show appropriate success/error messages
- **FR-004.5**: Implement proper form validation feedback

## Technical Requirements

### TR-001: Frontend Architecture

**Technology Stack**: Angular 16+, TypeScript, Material UI, Tailwind CSS

#### Components:

- **AdminUserDetail Component**: Main form component with cascading dropdown logic
- **PeopleService**: Service for fetching household members
- **HouseholdService**: Service for fetching household data
- **AdminUsersService**: Service for user CRUD operations

#### State Management:

- **Signals**: Reactive state management for household and people options
- **Effects**: Handle side effects from form value changes
- **Observables**: Manage asynchronous data loading

### TR-002: Backend Architecture

**Technology Stack**: ASP.NET Core 9, Entity Framework Core, SQL Server

#### API Endpoints:

- **GET /api/AdminUsers**: List all users
- **GET /api/AdminUsers/{id}**: Get specific user
- **POST /api/AdminUsers**: Create new user
- **PUT /api/AdminUsers/{id}**: Update existing user
- **GET /api/People/household/{id}**: Get people for household

#### Data Models:

```csharp
public class User
{
    public int UserId { get; set; }
    public string UserName { get; set; }
    public string Name { get; set; }
    public int? HouseId { get; set; }
    public int? PersonId { get; set; } // Maps to PeopleID column
    public int? UserType { get; set; }
}
```

### TR-003: Database Schema

**Database**: SQL Server

#### Tables:

- **Users**: Contains user information with foreign keys to Households and People
- **Households**: Contains household information
- **People**: Contains person information with foreign key to Households

#### Key Relationships:

- Users.HouseID → Households.HouseID (optional)
- Users.PeopleID → People.PersonId (optional)
- People.HouseID → Households.HouseID (required)

### TR-004: JSON Serialization

**Requirements**: Consistent property naming across all API endpoints

#### Configuration:

- **Main API**: Use Newtonsoft.Json with JsonProperty attributes
- **Functions API**: Use System.Text.Json with JsonPropertyName attributes
- **Property Mapping**: PersonId (C#) ↔ peopleId (JSON) ↔ PeopleID (Database)

#### Example JSON Response:

```json
{
  "userId": 123,
  "userName": "jdoe",
  "name": "John Doe",
  "houseId": 15,
  "peopleId": 30445,
  "userType": 1
}
```

## Non-Functional Requirements

### NFR-001: Performance

- **Household dropdown load time**: < 500ms for 1000+ households
- **People dropdown load time**: < 300ms for 50+ people per household
- **Form save operation**: < 1000ms including server round-trip
- **Form initialization**: < 200ms on modern hardware

### NFR-002: Scalability

- **Support**: 5000+ households in system
- **Support**: 500+ people per household
- **Concurrent users**: 50+ simultaneous operations
- **Database**: Efficient indexing on foreign key columns

### NFR-003: Accessibility

- **Compliance**: WCAG 2.1 AA standards
- **Keyboard navigation**: Full functionality without mouse
- **Screen reader support**: Proper ARIA labels and announcements
- **Color contrast**: Minimum 4.5:1 ratio for normal text

### NFR-004: Browser Compatibility

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Edge**: Latest 2 versions
- **Safari**: Latest 2 versions (on macOS/iOS)

### NFR-005: Security

- **Input validation**: Sanitize all user inputs
- **SQL injection protection**: Use parameterized queries
- **XSS prevention**: Proper output encoding
- **Authentication**: Require admin role for user management

## Implementation Phases

### Phase 1: Core Functionality (Sprint 1)

- [ ] Implement cascading dropdown logic in AdminUserDetail component
- [ ] Enhance PeopleService with household member fetching
- [ ] Update form configuration and validation
- [ ] Basic data persistence functionality

### Phase 2: UI/UX Enhancements (Sprint 2)

- [ ] Implement responsive grid layout
- [ ] Apply dark theme styling
- [ ] Add loading states and user feedback
- [ ] Improve form field ordering

### Phase 3: API Consistency (Sprint 3)

- [ ] Standardize JSON serialization across endpoints
- [ ] Fix property name mapping issues
- [ ] Update API documentation
- [ ] Implement comprehensive error handling

### Phase 4: Testing and Polish (Sprint 4)

- [ ] Comprehensive unit test coverage
- [ ] Integration testing
- [ ] E2E test automation
- [ ] Performance optimization
- [ ] Accessibility audit

## Risks and Mitigation

### Risk 1: Data Integrity Issues

**Impact**: High  
**Probability**: Medium  
**Mitigation**: Implement comprehensive validation, use database constraints, extensive testing

### Risk 2: Performance Degradation

**Impact**: Medium  
**Probability**: Low  
**Mitigation**: Implement caching, optimize queries, conduct performance testing

### Risk 3: Cross-Browser Compatibility

**Impact**: Medium  
**Probability**: Low  
**Mitigation**: Use standard web APIs, implement automated cross-browser testing

### Risk 4: API Serialization Inconsistencies

**Impact**: High  
**Probability**: Medium  
**Mitigation**: Standardize serialization configuration, implement contract tests

## Success Criteria

### Functional Success Criteria:

- [ ] Administrators can create users with household-person associations
- [ ] Form pre-populates correctly when editing existing users
- [ ] Data persists accurately to database
- [ ] Cascading dropdown behavior works reliably

### Technical Success Criteria:

- [ ] All API endpoints return consistent JSON structure
- [ ] Unit test coverage > 90%
- [ ] Performance targets met
- [ ] Accessibility requirements satisfied

### User Experience Success Criteria:

- [ ] Form completion time reduced by 50%
- [ ] User error rate reduced by 75%
- [ ] Positive feedback from administrator user testing
- [ ] No regression in existing functionality

## Maintenance and Support

### Code Maintenance:

- Follow established coding standards and patterns
- Maintain comprehensive documentation
- Regular code reviews and refactoring
- Automated testing in CI/CD pipeline

### Monitoring and Logging:

- Track form completion rates and error rates
- Monitor API response times
- Log critical errors for debugging
- User activity tracking for analytics

### Future Enhancements:

- Bulk user import with household-person mapping
- Advanced search and filtering in dropdowns
- Audit trail for user data changes
- Mobile-responsive design improvements
