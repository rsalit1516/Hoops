# Quick Deployment Checklist

## Pre-Deployment: Build & Verify

```bash
# Build the project
cd C:\Users\rrsal\repos\hoops
dotnet build src\Hoops.Functions\Hoops.Functions.csproj

# Expected: "Build succeeded. 0 Error(s)"
```

If build fails, check:
- Added `using Hoops.Functions.Utils;` to DivisionFunctions.cs
- Added `ILogger<DivisionFunctions>` to constructor
- Added `FunctionContext context` parameter to POST/PUT/DELETE methods

## Azure Configuration

### 1. CORS Settings (Critical!)

**Location:** Azure Portal → Function App → CORS

**Add these origins:**
```
https://<your-static-web-app>.azurestaticapps.net
http://localhost:4200
```

**Important:** Check "Enable Access-Control-Allow-Credentials" ✅

### 2. Application Settings (Optional)

No new app settings required - uses existing connection strings.

## Deployment

### Option A: Via Azure Pipelines (Recommended)
```bash
# Commit and push changes
git add .
git commit -m "Implement cookie authentication for Azure Functions"
git push origin <your-branch>

# Pipeline will build and deploy automatically
```

### Option B: Manual Deployment
```bash
# Publish locally
dotnet publish src\Hoops.Functions\Hoops.Functions.csproj -c Release

# Deploy via Azure CLI
# (Replace with your resource group and function app name)
az functionapp deployment source config-zip \
  --resource-group hoops-rg \
  --name hoops-functions-dev-djeqhegwahbua7eq \
  --src src\Hoops.Functions\bin\Release\net9.0\publish.zip
```

## Testing Checklist

### ✅ Test 1: Authenticated User Can Save
1. Go to test environment: `https://your-app.azurestaticapps.net`
2. Log in with valid credentials
3. Navigate to Admin → Divisions
4. Create or edit a division
5. Click Save

**Expected Result:** ✅ Division saves successfully (201 Created)

### ✅ Test 2: Unauthenticated User Gets 401
1. Open incognito/private browser window
2. Go to test environment (don't log in)
3. Try to save a division directly via API call

**Expected Result:** ❌ 401 Unauthorized error

### ✅ Test 3: Check Authentication Logs
1. Azure Portal → Function App → Application Insights → Logs
2. Run query:
```kusto
traces
| where timestamp > ago(1h)
| where message contains "authenticated"
| project timestamp, message
| order by timestamp desc
```

**Expected Result:** See "User authenticated: authenticated-user" entries

## Rollback Plan

If authentication causes issues:

### Quick Fix: Revert to Anonymous (5 minutes)
```csharp
// In DivisionFunctions.cs, remove these lines:
[RequireAuth]  // ← Remove
var authError = context.CheckAuthentication(req, _logger);  // ← Remove
if (authError != null) return authError;  // ← Remove
```

### Disable Middleware (Alternative)
```csharp
// In Program.cs, comment out:
// worker.UseMiddleware<AuthenticationMiddleware>();
```

## Success Criteria

- [x] Code builds without errors
- [x] CORS configured with credentials enabled
- [x] Authenticated users can create/edit/delete divisions
- [x] Unauthenticated users get 401 errors
- [x] Authentication logs appear in Application Insights
- [x] No impact on GET operations (still anonymous)

## Support

If issues occur:
1. Check Application Insights for error details
2. Review browser DevTools → Network tab for cookie headers
3. Verify CORS settings include credentials
4. Check `docs/cookie-auth-implementation.md` for detailed troubleshooting

## Next Actions After Successful Deployment

1. Monitor for 24 hours for any unexpected 401 errors
2. Create Azure DevOps story for cookie decryption enhancement
3. Apply same pattern to other admin endpoints:
   - TeamFunctions (POST/PUT/DELETE)
   - ScheduleGameFunctions (POST/PUT/DELETE)
   - HouseholdFunctions (POST/PUT/DELETE)
   - PersonFunctions (POST/PUT/DELETE)
