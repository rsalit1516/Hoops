param environment string = 'dev' // or 'prod'
param location string = 'eastus'

// DNS zone name varies by environment
var dnsZoneName = environment == 'prod' ? 'csbchoops.com' : 'dev.csbchoops.com'

// Deploy DNS zone
module dnsZone 'core/dnszone.bicep' = {
  name: 'dnsZoneDeployment'
  params: {
    dnsZoneName: dnsZoneName
    location: 'global'
  }
}
