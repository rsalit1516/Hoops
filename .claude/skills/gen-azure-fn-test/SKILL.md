---
name: gen-azure-fn-test
description: Scaffold an xUnit test class for an Azure Function using the correct FunctionContext/CancellationToken mock pattern. Use when writing new tests for any class in Hoops.Functions.
argument-hint: <FunctionClassName> (PascalCase, e.g. DocumentFunctions)
arguments: [name]
allowed-tools: Read Glob Grep Write Edit
shell: powershell
---

# Generate Azure Function xUnit Test: $name

Scaffold an xUnit test class for **$name** in the Hoops.Functions project.

## Step 1 — read the function class first

Before generating tests, READ the function class to discover:
- Which HTTP trigger methods exist and their signatures
- Which services/repositories are injected via constructor
- What the method bodies do (to know what to assert)

!`Get-ChildItem -Path "src" -Filter "$name.cs" -Recurse | Select-Object -ExpandProperty FullName`

## Output file

Create `$nameTests.cs` in the matching test project under `tests/`.

## Existing test project structure

!`Get-ChildItem -Path "tests" -Filter "*FunctionTests*" -Recurse | Select-Object -First 5 -ExpandProperty FullName`

## REQUIRED patterns (encode past bugs — apply exactly)

### CancellationToken — the critical one
`HttpRequestData.FunctionContext` is **non-virtual** — Moq cannot stub it and throws `NotSupportedException`.

**NEVER** do:
```csharp
// WRONG — NotSupportedException at runtime:
req.FunctionContext.CancellationToken
```

**ALWAYS** use the injected `FunctionContext` parameter:
```csharp
// In the function body:
public async Task<HttpResponseData> Run(
    [HttpTrigger(...)] HttpRequestData req,
    FunctionContext context)          // <-- inject this
{
    var token = context.CancellationToken;   // <-- use this
}

// In the test mock:
_mockContext.Setup(c => c.CancellationToken).Returns(CancellationToken.None);
// No setup of req.FunctionContext needed at all.
```

### HttpRequestData mock
Use `MockHttpRequestData` or Moq:
```csharp
var mockReq = new Mock<HttpRequestData>(MockBehavior.Strict, _mockContext.Object);
mockReq.Setup(r => r.Body).Returns(new MemoryStream(...));
mockReq.Setup(r => r.Headers).Returns(new HttpHeadersCollection());
```

### FunctionContext mock
```csharp
private readonly Mock<FunctionContext> _mockContext = new();

// In constructor or [Fact] setup:
_mockContext.Setup(c => c.CancellationToken).Returns(CancellationToken.None);
```

### Test class structure

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Moq;
using Xunit;

namespace Hoops.Functions.Tests;

public class $nameTests
{
    private readonly Mock<FunctionContext> _mockContext;
    // Add mocks for injected services here
    private readonly $name _sut;

    public $nameTests()
    {
        _mockContext = new Mock<FunctionContext>();
        _mockContext.Setup(c => c.CancellationToken).Returns(CancellationToken.None);

        // Mock injected services
        // _mockSomeService = new Mock<ISomeService>();

        _sut = new $name(/* inject mocks */);
    }

    [Fact]
    public async Task MethodName_Condition_ExpectedResult()
    {
        // Arrange
        var mockReq = new Mock<HttpRequestData>(MockBehavior.Loose, _mockContext.Object);
        mockReq.Setup(r => r.Body).Returns(new MemoryStream());
        mockReq.Setup(r => r.Headers).Returns(new HttpHeadersCollection());

        // Act
        var result = await _sut.MethodName(mockReq.Object, _mockContext.Object);

        // Assert
        Assert.NotNull(result);
    }
}
```

## Naming conventions
- Test class: `$nameTests`
- Test methods: `{MethodName}_{Condition}_{ExpectedResult}` (Arrange-Act-Assert naming)
- One `[Fact]` per distinct scenario; use `[Theory]` + `[InlineData]` for parameterized cases

## NuGet packages expected in the test project
- `xunit`, `xunit.runner.visualstudio`
- `Moq`
- `Microsoft.Azure.Functions.Worker` (for `FunctionContext`, `HttpRequestData`)
