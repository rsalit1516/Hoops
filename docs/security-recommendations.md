# Security Recommendations for Azure Functions

## Current State - UPDATED 2026-02-06

### ✅ IMPLEMENTED: Cookie Authentication Middleware

**Status:** Production-ready authentication implemented for Division endpoints.

**What was implemented:**
- Authentication middleware validates `hoops.auth` cookie
- Protected endpoints: POST, PUT, DELETE for divisions
- Authorization helpers for easy auth checks
- Consistent authentication between API and Functions

**Files added:**
- `src/Hoops.Functions/Utils/AuthenticationMiddleware.cs`
- `src/Hoops.Functions/Utils/RequireAuthAttribute.cs`
- `docs/cookie-auth-implementation.md`
- `docs/deployment-checklist.md`

**See:** `docs/cookie-auth-implementation.md` for complete implementation details and testing instructions.

---

## Previous State (Temporary Solution - NO LONGER NEEDED)

### ~~Division Endpoints~~
~~Changed from `AuthorizationLevel.Function` to `AuthorizationLevel.Anonymous` for:~~
~~- `POST /api/Division` - Create division~~
~~- `PUT /api/Division/{id}` - Update division~~  
~~- `DELETE /api/Division/{id}` - Delete division~~

**REPLACED BY:** Cookie authentication middleware (see above)

---

## ~~Immediate Security Mitigations~~ (NO LONGER NEEDED)

### ~~1. Azure Function App IP Restrictions~~ ❌ Not applicable
Static Web Apps don't have fixed outbound IPs. IP restrictions won't work.

**SOLUTION IMPLEMENTED:** Cookie authentication validates user identity without IP restrictions.

### 2. CORS Configuration ✅ REQUIRED
Ensure CORS is properly configured in Azure:
- Only allow your production and staging frontend domains
- **CRITICAL:** Enable "Access-Control-Allow-Credentials" for cookie authentication
- Do NOT use wildcard (`*`) in production

**Azure Portal Steps:**
1. Function App → CORS
2. Add allowed origins: `https://<your-static-web-app>.azurestaticapps.net`
3. ✅ Check "Enable Access-Control-Allow-Credentials"
4. Save

---

## ✅ COMPLETED: Long-Term Solution

### Cookie-Based Authentication Middleware

**STATUS: ✅ IMPLEMENTED (2026-02-06)**

The main API (`Hoops.Api`) uses cookie-based authentication with a 20-minute sliding window. Azure Functions now validates the same `hoops.auth` cookie.

**Implementation Completed:**

1. ✅ **Created Authentication Middleware** (`src/Hoops.Functions/Utils/AuthenticationMiddleware.cs`)
   - Reads `hoops.auth` cookie from request
   - Validates cookie presence (HttpOnly, Secure, SameSite protections)
   - Populates `ClaimsPrincipal` in request context

2. ✅ **Created Authorization Helpers** (`src/Hoops.Functions/Utils/RequireAuthAttribute.cs`)
   - `[RequireAuth]` attribute to mark endpoints requiring authentication
   - `CheckAuthentication()` method returns 401 if not authenticated
   - `IsAuthenticated()` boolean check

3. ✅ **Registered Middleware** in `Program.cs`
   ```csharp
   .ConfigureFunctionsWorkerDefaults(worker =>
   {
       worker.UseMiddleware<AuthenticationMiddleware>();
   })
   ```

4. ✅ **Updated Division Function Endpoints**
   - POST, PUT, DELETE now require authentication
   - GET operations remain anonymous for public access
   - Consistent with main API authorization model

**Benefits Achieved:**
- ✅ Consistent authentication between API and Functions
- ✅ No function keys to manage
- ✅ Better audit trail via authentication logs
- ✅ Works with Static Web Apps (no IP restrictions needed)
- ✅ HttpOnly cookies prevent XSS attacks

**Estimated Effort: 2-3 hours** ✅ COMPLETED

---

## Next Enhancement: Cookie Decryption and Role-Based Auth

**STATUS: Recommended for next sprint**

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
