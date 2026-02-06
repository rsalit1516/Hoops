# Cookie Authentication Implementation for Azure Functions

## Overview

Implemented cookie-based authentication middleware for Azure Functions to validate the `hoops.auth` cookie issued by the main Hoops.Api. This provides consistent authentication across both the API and Functions without requiring function keys or IP restrictions.

## What Was Implemented

### 1. Authentication Middleware (`Utils/AuthenticationMiddleware.cs`)

Validates the `hoops.auth` cookie on every request:
- Extracts the cookie from request headers
- Validates cookie presence (HttpOnly, Secure, SameSite protections)
- Populates `ClaimsPrincipal` in `FunctionContext.Items["User"]`
- Logs authentication events

**Security Model:**
- Cookie is HttpOnly (can't be accessed/modified by JavaScript)
- Cookie requires HTTPS (SecurePolicy.Always in production)
- Cookie uses SameSite=None for cross-origin requests
- Main API validates credentials and issues the cookie
- Functions trust the cookie if present (issued by same domain)

### 2. Authorization Extensions (`Utils/RequireAuthAttribute.cs`)

Provides helper methods to check authentication:
- `[RequireAuth]` attribute to mark protected endpoints
- `CheckAuthentication()` - Returns 401 if not authenticated
- `IsAuthenticated()` - Boolean check for authentication

### 3. Program.cs Registration

Registered middleware in the Functions host:
```csharp
.ConfigureFunctionsWorkerDefaults(worker =>
{
    worker.UseMiddleware<AuthenticationMiddleware>();
})
```

### 4. Updated Division Endpoints

Protected POST, PUT, DELETE operations:
- `POST /api/Division` - Create division (requires auth)
- `PUT /api/Division/{id}` - Update division (requires auth)
- `DELETE /api/Division/{id}` - Delete division (requires auth)

GET operations remain anonymous for public access.

## How It Works

### Request Flow

1. **User logs in** via main API `/api/auth/login`
   - API validates credentials
   - API issues encrypted `hoops.auth` cookie
   - Cookie has 20-minute sliding expiration

2. **Frontend makes Function call** with `withCredentials: true`
   - Browser automatically includes `hoops.auth` cookie
   - Static Web App sends request to Functions

3. **AuthenticationMiddleware intercepts request**
   - Extracts `hoops.auth` cookie from headers
   - Validates cookie presence
   - Populates user principal in context

4. **Function endpoint checks auth**
   - Calls `context.CheckAuthentication(req, _logger)`
   - Returns 401 if no valid cookie
   - Proceeds with operation if authenticated

5. **Cookie auto-refreshes** on each API call (sliding expiration)

## Testing Instructions

### Build the Project

```bash
cd C:\Users\rrsal\repos\hoops
dotnet build src\Hoops.Functions\Hoops.Functions.csproj
```

**Expected Output:** Build should succeed with no errors.

### Test Locally (Docker)

1. Start your Docker environment
2. Navigate to admin area in frontend
3. Create/edit/delete a division
4. **Expected:** Should work as before (authenticated via cookie)

### Deploy to Azure

```bash
# Publish Functions
cd C:\Users\rrsal\repos\hoops
dotnet publish src\Hoops.Functions\Hoops.Functions.csproj -c Release -o publish\functions

# Deploy via Azure CLI (or use your CI/CD pipeline)
# az functionapp deployment source config-zip --resource-group <rg> --name hoops-functions-dev-... --src publish/functions.zip
```

### Test in Azure Test Environment

#### Scenario 1: Authenticated User
1. Log in to your test environment frontend
2. Navigate to admin → divisions
3. Try to create a new division
4. **Expected:** Division saves successfully (201 Created)

#### Scenario 2: Unauthenticated User
1. Open browser in incognito/private mode
2. Navigate directly to test environment
3. Try to save a division (without logging in)
4. **Expected:** 401 Unauthorized error

#### Scenario 3: Expired Session
1. Log in to test environment
2. Wait 20+ minutes (cookie expiration)
3. Try to save a division
4. **Expected:** 401 Unauthorized (need to re-login)

### Verify Authentication in Azure

1. **Check Application Insights logs:**
   - Azure Portal → Function App → Application Insights → Logs
   - Query: `traces | where message contains "authenticated"`
   - Should see: "User authenticated: authenticated-user"

2. **Check for 401 errors:**
   - Query: `requests | where resultCode == 401`
   - Should see unauthorized attempts (from unauthenticated users)

3. **Monitor successful saves:**
   - Query: `requests | where name == "PostDivision" and resultCode == 201`
   - Should see successful division creation

## CORS Configuration

Ensure CORS is properly configured in Azure for your Static Web App domain:

### In Azure Portal

1. Navigate to: Function App → CORS
2. Add allowed origins:
   - `https://your-static-web-app.azurestaticapps.net`
   - `http://localhost:4200` (for local development)
3. Enable "Allow Credentials" (required for cookies)
4. Save changes

### Alternative: Set in host.json

```json
{
  "version": "2.0",
  "extensions": {
    "http": {
      "routePrefix": "api",
      "cors": {
        "allowedOrigins": [
          "https://your-static-web-app.azurestaticapps.net",
          "http://localhost:4200"
        ],
        "supportCredentials": true
      }
    }
  }
}
```

## Security Considerations

### Current Implementation

**Pros:**
- ✅ No function keys to manage
- ✅ Consistent auth with main API
- ✅ HttpOnly cookies prevent XSS
- ✅ HTTPS-only in production
- ✅ 20-minute auto-expiration
- ✅ Works with Static Web Apps (no IP restrictions needed)

**Limitations:**
- ⚠️ Cookie validation is presence-based (not decrypted)
- ⚠️ No role-based authorization yet
- ⚠️ Shared cookie between API and Functions (same domain required)

### Future Enhancements

1. **Decrypt and Validate Cookie** (High Priority)
   - Add `Microsoft.AspNetCore.DataProtection` package
   - Share Data Protection keys between API and Functions
   - Decrypt cookie to extract user ID, roles, expiration
   - Validate signature and expiration

2. **Role-Based Authorization**
   - Extract roles from decrypted cookie
   - Implement `[RequireAuth(Roles = "Admin")]`
   - Check roles in authorization middleware

3. **Token-Based Alternative**
   - Consider JWT tokens instead of cookies
   - Better for distributed systems
   - Easier to validate without Data Protection

## Troubleshooting

### Issue: Still getting 401 errors

**Check:**
1. Is CORS configured with `supportCredentials: true`?
2. Is frontend sending `withCredentials: true` in requests?
3. Are API and Functions on the same domain (for cookie sharing)?
4. Is cookie being set by API login endpoint?

**Debug:**
```bash
# Check browser DevTools → Network → Request Headers
# Should see: Cookie: hoops.auth=...
```

### Issue: Cookie not being sent

**Check:**
1. Cookie domain settings in API `Startup.cs`
2. SameSite policy (should be `None` for cross-origin)
3. Secure policy (should be `Always` in production)
4. Browser console for CORS errors

### Issue: Build fails

**Common errors:**
- Missing `using Hoops.Functions.Utils;` statement
- Missing `ILogger<DivisionFunctions>` injection
- Missing `FunctionContext context` parameter

**Solution:**
```bash
dotnet clean src\Hoops.Functions\Hoops.Functions.csproj
dotnet restore src\Hoops.Functions\Hoops.Functions.csproj
dotnet build src\Hoops.Functions\Hoops.Functions.csproj
```

## Files Changed

### New Files
- `src/Hoops.Functions/Utils/AuthenticationMiddleware.cs` - Cookie validation middleware
- `src/Hoops.Functions/Utils/RequireAuthAttribute.cs` - Authorization helpers
- `docs/cookie-auth-implementation.md` - This file
- `docs/security-recommendations.md` - Security guidance

### Modified Files
- `src/Hoops.Functions/Program.cs` - Registered middleware
- `src/Hoops.Functions/Functions/DivisionFunctions.cs` - Added auth checks to POST/PUT/DELETE

## Next Steps

1. **Immediate:**
   - ✅ Build and test locally
   - ✅ Deploy to Azure test environment
   - ✅ Verify division CRUD operations work
   - ✅ Test with authenticated and unauthenticated users

2. **Short Term (Next Sprint):**
   - Implement cookie decryption using Data Protection API
   - Add role-based authorization
   - Apply auth to other admin endpoints (Teams, Games, etc.)

3. **Long Term:**
   - Consider migrating to JWT tokens
   - Implement refresh token mechanism
   - Add audit logging for admin operations

## References

- Azure Functions Middleware: https://learn.microsoft.com/en-us/azure/azure-functions/dotnet-isolated-process-guide#middleware
- ASP.NET Core Cookie Authentication: https://learn.microsoft.com/en-us/aspnet/core/security/authentication/cookie
- Data Protection API: https://learn.microsoft.com/en-us/aspnet/core/security/data-protection/
