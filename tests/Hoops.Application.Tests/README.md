# Hoops.Application.Tests

## Purpose
This project contains unit and integration tests for the Application Services layer in the Hoops application, following Domain-Driven Design (DDD) principles.

## Testing the Services Layer (DDD Aggregate Root)
- **Service Layer Role:**
  - Acts as the aggregate root for business logic and orchestration.
  - Coordinates repository calls and applies domain rules.
  - Exposes methods for use by controllers and other application layers.
- **Testing Approach:**
  - Use in-memory or mocked repositories to isolate service logic.
  - Test business rules, orchestration, and aggregate behaviors.
  - Avoid testing repository internals (covered by repository tests).
  - Use Arrange-Act-Assert pattern for clarity.

## Example Pattern
- Service methods should:
  - Accept input parameters (DTOs, IDs, etc.)
  - Call one or more repository methods or use LINQ for queries
  - Apply business/domain rules
  - Return results or throw domain exceptions

## Example Test Structure
```csharp
public class SeasonServiceTest
{
    [Fact]
    public void GetCurrentSeason_ReturnsActiveSeason()
    {
        // Arrange: mock repository, seed data, create service
        // Act: call service method
        // Assert: verify correct season is returned
    }
}
```

## Next Steps
1. Implement SeasonService in Hoops.Application as an aggregate root service.
2. Add tests for each public method, focusing on business logic and orchestration.
3. Use dependency injection for repositories.
4. Keep service methods focused and testable.
