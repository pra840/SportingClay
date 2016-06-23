// fetch defined data services
// postMessage with all the data



self.addEventListener("message", function(e) {
    var resources = e.data;

    var gatewaysToCacheFeatures = [];

    var servicesToCache = {
        "GetOrgGatewaysAndStatus": '/web/organization/' + resources.orgId + '/devices?filters=active&attributes=latestStatus',
        "GetOrgNodesAndStatus": '/web/organization/' + resources.orgId + '/nodes?filters=active&attributes=latestStatus',
        "GetOrgGateways": '/web/organization/' + resources.orgId + '/gateways',
        "GetLandOptions": '/web/organization/' + resources.orgId + '/landOptions',
        'GetGatewayRights': '/web/organization/' + resources.orgId + '/header?rights=gateway',
        "UI_HardwareDetails": '/public/translations?screenName=UI_HardwareDetails'
    };

    var cacheHardwareFeatures = function(){
        // cache firmware features for hardware
        var featuresRequest = new XMLHttpRequest();
        featuresRequest.addEventListener("load", function(e){
            var url = 'GetAllGatewayFirmwareFeatures';
            postMessage({
                key: url,
                response: e.currentTarget.response
            });
        });
        featuresRequest.open('GET', '/web/devices/firmwareFeatures?deviceIds=' + gatewaysToCacheFeatures.join(',') );
        featuresRequest.send();
    }

    var servicesReturned = 0;
    for (var prop in servicesToCache){
        var service = servicesToCache[prop];

        var myRequest = new XMLHttpRequest();
        myRequest.key = prop;
        myRequest.addEventListener("load", function(e){
            postMessage({
                key: this.key,
                response: e.currentTarget.response
            });
            if (this.key == 'GetOrgGateways'){
                var gateways = JSON.parse(e.currentTarget.response).data.gateways;
                for (var i=0; gateways.length > i; i++){
                    gatewaysToCacheFeatures.push(gateways[i].id);
                }
            }
            servicesReturned++;
            // if services have finished caching
            if (servicesReturned == Object.keys(servicesToCache).length){
                cacheHardwareFeatures(); // uses gatewayIds from cached service
            }
        });
        myRequest.open('GET', service);
        myRequest.send();
    }

}, false);

// fetch and cache fields options