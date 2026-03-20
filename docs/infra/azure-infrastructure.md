# Azure Infrastructure

This document describes the current Azure resource state, the target architecture, and the planned migration work. It is a living document — add migration items as they are identified.

---

## Environments

| Environment | Purpose | Branch | URL |
|-------------|---------|--------|-----|
| local | Developer workstation | any | localhost |
| develop | Cloud test/demo instance | `develop` | dev.csbchoops.com |
| production | Live system | `master` | csbchoops.com |

---

## Current State

All active resources currently live in the legacy resource group **`Default-Web-US`**, which also contains older dev remnants from before proper resource group organization was established.

### Active Resources in `Default-Web-US`

| Resource | Type | Environment | Notes |
|----------|------|-------------|-------|
| hoops-functions-prod | Azure Functions (v4) | Production | Primary backend API |
| hoops-functions-dev | Azure Functions (v4) | Develop | Dev/test backend |
| hoops-dev-kv | Key Vault | Develop | Stores dev connection string |
| richardsalit (SQL Server) | Azure SQL Server | Shared | Hosts both prod and dev databases |
| csbchoops3 | Azure SQL Database | Production | Production database |
| (dev database) | Azure SQL Database | Develop | Dev database on shared server |
| (storage accounts, app services) | Various | Mixed | Some active, some orphaned dev remnants |

---

## Target Architecture

Separate resource groups per environment, no shared resources across environments.

### `hoops-prod-rg` (created 2026-03-18)

| Resource | Type | Status | Notes |
|----------|------|--------|-------|
| hoops-functions-prod | Azure Functions (v4, FlexConsumption FC1) | Created | App Service Plan: `ASP-hoopsprodrg-a1c1` |
| hoops-functions-prod-uami | User-Assigned Managed Identity | Created | Used by Functions for storage and monitoring access |
| hoopsprodstorage | Storage Account | Created | East US; blob container `app-package-hoops-functions-prod-68724fa` |
| hoops-functions-prod (App Insights) | Application Insights | Created | Monitoring for Functions |
| hoops-prod-kv | Key Vault | To create | Required before next production deployment |
| hoops-prod-sql (SQL Server) | Azure SQL Server | To move | Currently `richardsalit` in Default-Web-US |
| csbchoops3 (or renamed) | Azure SQL Database | To move | Move with server |

### `hoops-dev-rg` (future)

| Resource | Type | Status |
|----------|------|--------|
| hoops-functions-dev | Azure Functions (v4) | Move from Default-Web-US |
| hoops-dev-kv | Key Vault | Move from Default-Web-US |
| hoops-dev-sql (SQL Server) | Azure SQL Server | Separate from prod server |
| (dev database) | Azure SQL Database | Move with server |

---

## Naming Conventions

- Resource groups: `hoops-{env}-rg`
- Key Vaults: `hoops-{env}-kv`
- Function Apps: `hoops-functions-{env}`
- Storage Accounts: `hoops{env}storage` (no hyphens — Azure storage account names are lowercase alphanumeric only)
- SQL Servers: `hoops-{env}-sql` (target; current prod server is `richardsalit`)
- SQL Databases: descriptive name scoped to environment

---

## Migration Log

Migrations are listed in priority order. Items marked **Blocked** cannot proceed until a dependency is resolved.

### Completed

| Date | Action |
|------|--------|
| 2026-03-18 | Removed hardcoded production SQL credentials from `src/Hoops.Api/appsettings.Production.json` |
| 2026-03-18 | Created `hoops-prod-rg` resource group (East US) |
| 2026-03-18 | Created `hoops-functions-prod` (FlexConsumption FC1), `hoopsprodstorage`, `hoops-functions-prod-uami`, Application Insights in `hoops-prod-rg` |
| 2026-03-18 | Created `hoops-prod-kv` with RBAC permission model in `hoops-prod-rg` |
| 2026-03-18 | Assigned `Key Vault Secrets User` role to `hoops-functions-prod-uami` on `hoops-prod-kv` |
| 2026-03-18 | Added `ConnectionStrings--hoopsContext` secret to `hoops-prod-kv` |
| 2026-03-18 | Added `KeyVaultUri` app setting to `hoops-functions-prod` |

### In Progress

| Item | Notes |
|------|-------|
| Wire up Azure Pipelines to deploy to new `hoops-functions-prod` | FlexConsumption plan may require pipeline task updates |
| Rotate SQL password | Defer until deployment is confirmed stable; then update secret in `hoops-prod-kv`

### Backlog

| Item | Notes |
|------|-------|
| Move `hoops-functions-prod` to `hoops-prod-rg` | Low risk; endpoint unchanged after move |
| Separate SQL Server for prod | Create new server in `hoops-prod-rg`; migrate `csbchoops3` database; update connection string in KV |
| Create `hoops-dev-rg` | After prod is clean |
| Separate SQL Server for dev | Dev database currently shares a server with prod — move to its own server in `hoops-dev-rg` |
| Move `hoops-functions-dev` to `hoops-dev-rg` | After dev RG exists |
| Move `hoops-dev-kv` to `hoops-dev-rg` | After dev RG exists |
| Audit and delete orphaned resources in `Default-Web-US` | Old App Services, legacy pipelines, unused storage accounts |
| Decommission `Default-Web-US` | Final step — only after all active resources are moved |

---

## Notes

- **SQL Server move:** The SQL Server (`richardsalit`) and all its databases must move together — Azure does not support moving individual databases independently. Plan the prod and dev database separation before initiating any server move.
- **Key Vault move:** After moving a KV to a new resource group, verify RBAC role assignments are intact (they travel with the resource, but worth confirming).
- **Managed identity:** Moving a Function App preserves its system-assigned identity and any KV role assignments.
- **Local dev:** Uses `local.settings.json` (gitignored). No Key Vault. The existing `USE_PROD_DATA` toggle supports optionally pointing local dev at the develop database — if enabled, the database seeding program must be guarded to skip execution (future work).
