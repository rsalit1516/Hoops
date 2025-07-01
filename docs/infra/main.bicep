param environment string = 'dev'
param resourceGroupName string = 'csbc-dev' // or 'hoops-dev' for prod, depending on your layout

var dnsZoneName = environment == 'prod' ? 'csbchoops.com' : 'dev.csbchoops.com'

module dnsZone 'core/dnszone.bicep' = {
  name: 'dnsZoneDeployment'
  scope: resourceGroup(resourceGroupName)
  params: {
    dnsZoneName: dnsZoneName
    location: 'global'
  }
}
