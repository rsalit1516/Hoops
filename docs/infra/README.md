# 🏗️ Hoops Infrastructure as Code (Bicep)

This directory contains modular Bicep templates for provisioning and managing the infrastructure behind the Hoops app. It supports both development and production environments with a focus on scalability, clarity, and reusability.

---

## 📁 Folder Structure

infra/ ├── core/ │   └── dnszone.bicep         # DNS zone and records for csbchoops.com ├── main.bicep                # Orchestrates environment-specific deployments

---

## 🌐 DNS Zone

- **Zone Name**: `csbchoops.com` (prod) or `dev.csbchoops.com` (dev)
- **Records Included**:
  - A record for root domain
  - Wildcard and `www` CNAMEs pointing to `csbchoops-ui.azurewebsites.net`
  - TXT records for domain verification (e.g., `asuid`, `hiifel...`)
- **Module**: `core/dnszone.bicep`

---

## 🚀 Deployment

To preview changes:

az deployment sub what-if \
  --location eastus \
  --template-file docs/infra/main.bicep \
  --parameters environment='dev' resourceGroupName='csbc-dev'


To deploy:
az deployment sub create \
  --location eastus \
  --template-file docs/infra/main.bicep \
  --parameters environment='dev' resourceGroupName='csbc-dev'

🧠 Design Notes

- DNS is deployed to a shared resource group (csbc-dev) to support both environments
- Naming conventions:
- csbc-*: legacy or league-specific
- hoops-*: generic, multi-tenant-ready
- Future modules will include Key Vault, App Services, SQL, and monitoring

📌 Next Steps

- [ ] Add keyvault.bicep to core/
- [ ] Create sql.bicep for environment-specific databases
- [ ] Parameterize main.bicep for league/environment flexibility

Let me know if you want to tailor this to include your basketball league app’s architecture or CI/CD notes. Ready to move on to the Key Vault module next? Let’s keep the momentum going! 🛠️


