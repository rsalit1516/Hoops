# Security Recommendations for Azure Functions

## Current State (Temporary Solution)

### Division Endpoints
Changed from `AuthorizationLevel.Function` to `AuthorizationLevel.Anonymous` for:
- `POST /api/Division` - Create division
- `PUT /api/Division/{id}` - Update division  
- `DELETE /api/Division/{id}` - Delete division

**Date Changed:** 2026-02-06  
**Reason:** Frontend not sending function keys, causing 401 errors in Azure test environment

## Immediate Security Mitigations

### 1. Azure Function App IP Restrictions
Add IP restrictions in Azure Portal to limit access:

1. Navigate to: Azure Portal → Function App → Networking → Access restrictions
2. Add rule to allow only:
   - Your frontend App Service outbound IP addresses
   - Your office/VPN IP ranges (for admin access)
3. Deny all other traffic

### 2. CORS Configuration
Ensure CORS is properly configured in Azure:
- Only allow your production and staging frontend domains
- Do NOT use wildcard (`*`) in production

## Recommended Long-Term Solution

### Implement Cookie-Based Authentication Middleware

The main API (`Hoops.Api`) uses cookie-based authentication with a 20-minute sliding window. Azure Functions should validate the same `hoops.auth` cookie.

**Implementation Steps:**

1. **Create Authentication Middleware** (`src/Hoops.Functions/Middleware/AuthenticationMiddleware.cs`)
   - Read `hoops.auth` cookie from request
   - Validate cookie signature and expiration
   - Extract user identity and roles
   - Populate `ClaimsPrincipal` in request context

2. **Create Authorization Attribute** (`src/Hoops.Functions/Attributes/RequireAuthAttribute.cs`)
   - Custom attribute to mark endpoints requiring authentication
   - Check if user is authenticated
   - Optionally check for specific roles (Admin, Director, etc.)

3. **Register Middleware** in `Program.cs`
   ```csharp
   .ConfigureFunctionsWorkerDefaults(worker =>
   {
       worker.UseMiddleware<AuthenticationMiddleware>();
   })
   ```

4. **Update Function Signatures**
   ```csharp
   [Function("PostDivision")]
   [RequireAuth(Roles = "Admin")]
   public async Task<HttpResponseData> PostDivision(...)
   ```

**Estimated Effort:** 2-3 hours  
**Benefits:**
- Consistent authentication between API and Functions
- Role-based authorization
- No function keys to manage
- Better audit trail

## Related Work Items

Create Azure DevOps story: **SYS-### Implement Cookie Authentication in Azure Functions**

**Acceptance Criteria:**
- [ ] Authentication middleware reads and validates `hoops.auth` cookie
- [ ] Authorization attribute supports role-based access control
- [ ] All admin endpoints (POST/PUT/DELETE) require authentication
- [ ] Unauthenticated requests return 401 with proper error message
- [ ] Unit tests for middleware and authorization logic
- [ ] Documentation updated with authentication flow

## Additional Security Considerations

### Function Key Management (if reverting to AuthorizationLevel.Function)
- Store function keys in Azure Key Vault
- Rotate keys regularly (quarterly)
- Use separate keys for dev/staging/prod
- Never commit keys to source control

### API Gateway Option
Consider Azure API Management as a gateway layer:
- Centralized authentication/authorization
- Rate limiting and throttling
- Request/response transformation
- Better monitoring and analytics

### Database Security
- Ensure connection strings use encrypted connections
- Use managed identities for Azure SQL authentication (eliminate passwords)
- Implement row-level security for multi-tenant data
- Regular security audits of stored procedures and functions
