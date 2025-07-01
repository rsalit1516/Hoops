param dnsZoneName string = 'csbchoops.com'
param location string = 'global'

resource dnsZone 'Microsoft.Network/dnsZones@2020-06-01' = {
  name: dnsZoneName
  location: location
}

// A Record
resource aRecord 'Microsoft.Network/dnsZones/A@2018-05-01' = {
  name: '${dnsZone.name}/@'
  properties: {
    TTL: 60
    ARecords: [
      {
        ipv4Address: '40.71.11.155'
      }
    ]
  }
}

// CNAME Records
resource wildcardCname 'Microsoft.Network/dnsZones/CNAME@2018-05-01' = {
  name: '${dnsZone.name}/*'
  properties: {
    TTL: 3600
    cnameRecord: {
      cname: 'csbchoops-ui.azurewebsites.net'
    }
  }
}

resource wwwCname 'Microsoft.Network/dnsZones/CNAME@2018-05-01' = {
  name: '${dnsZone.name}/www'
  properties: {
    TTL: 60
    cnameRecord: {
      cname: 'csbchoops-ui.azurewebsites.net'
    }
  }
}

// TXT Records
resource rootTxt 'Microsoft.Network/dnsZones/TXT@2018-05-01' = {
  name: '${dnsZone.name}/@'
  properties: {
    TTL: 3600
    TXTRecords: [
      {
        value: [
          'hiifel12st2aeae7eekv910gud'
        ]
      }
    ]
  }
}

resource asuidTxt 'Microsoft.Network/dnsZones/TXT@2018-05-01' = {
  name: '${dnsZone.name}/asuid'
  properties: {
    TTL: 3600
    TXTRecords: [
      {
        value: [
          '7396DB18559C229F1C0BE5B00EC405E443D67E5EE13B2A842114A61D36DA25E2'
        ]
      }
    ]
  }
}

resource asuidApiTxt 'Microsoft.Network/dnsZones/TXT@2018-05-01' = {
  name: '${dnsZone.name}/asuid.api'
  properties: {
    TTL: 3600
    TXTRecords: [
      {
        value: [
          '7396DB18559C229F1C0BE5B00EC405E443D67E5EE13B2A842114A61D36DA25E2'
        ]
      }
    ]
  }
}

resource asuidWwwTxt 'Microsoft.Network/dnsZones/TXT@2018-05-01' = {
  name: '${dnsZone.name}/asuid.www'
  properties: {
    TTL: 3600
    TXTRecords: [
      {
        value: [
          '7396DB18559C229F1C0BE5B00EC405E443D67E5EE13B2A842114A61D36DA25E2'
        ]
      }
    ]
  }
}
