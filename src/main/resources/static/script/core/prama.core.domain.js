define(
    function () {
        return {
            services: {
                "GetLands": "/web/organization/{selectedOrganizationId}/lands", // Reuse
                "GetProbeDetailsPerLands": "/web/organization/{selectedOrganizationId}/lands/devices", // Replace
                // "GetMoistureStatusesForOrg": "/web/organization/{selectedOrganizationId}/soilMoisture",
                "GetProbeStatus": "/web/organization/{selectedOrganizationId}/latestSoilMoistureSum", // replace

                "GetCacheKeys": "/web/organization/{selectedOrganizationId}/cacheKeys",

                "GetAllSensorsForLand": "/web/organization/{selectedOrganizationId}/lands/{landId}/devices",

                "GetSensors": "/web/organization/{selectedOrganizationId}/lands/{landId}/sensors",
                "GetMeasurements": "/web/organization/{selectedOrganizationId}/lands/{landId}/sensors/measurements", // Send attributes: lastMeasurements or details
                "GetZoneDetails": "/web/land/{landId}", /*?attributes="soilType,details,soilMoisture"*/
                "GetLandOptions": "/web/land/{landId}/options",
                "PostDeleteLands": "/web/deleteLands",
                "PostSaveField": "/web/saveField",
                "PostSavingSharingChanges": "/web/saveShare",
                    // new services
                // "GetMoistureStatusForLand": "/web/managementZone/{landId}/soilMoisture",

                "AcceptSharing": "/web/acceptSharingInvitation",
                "GetTokenDetails": "/web/getTokenDetails",
                "GetGatewayLocations": "/web/getGPSCoordinatesForGateways",
                "Login": "/web/login",
                "ValidateToken": "/public/validateToken",
                "CreateAccount": "/public/createAccount",
                "ForgotPassword": "/public/forgot-pass-url",
                "SendPassword": "/public/sendPassword",
                "CheckMessages": "/public/loginPageMessage",
                "VoiceNavigation": "/web/getNavigation",
                "Translations": "/public/translations",
                "SelectOrganization": "/web/selectedOrg",
                "SearchForOrganizations": "/web/searchOrganizations",
                "AgreementsLoad": "/web/getPageLoadDetaisForAggrement",
                "GetEULATexts": "/web/getGetEULATextsForAggrement",
                "PostAcceptEULA": "/web/acceptEULAAgreement",
                "GetHeaderDetails": "/web/getHeader",
                "GetAuthorizationDetails": "/web/organization/{selectedOrganizationId}/header",
                "DisabledFeatures": "/public/disabledFeatures",
                "GetGraphData": "/web/land/{landId}/measurements",
                "PostSaveBudgetLines": "/web/land/{landId}/budgetLine",
                "GetBudgetLines" :  "/web/land/{landId}/budgetlines",
                "GetAlerts": "/web/alerts",
                "GetDomain": "/web/domains",
                "GetAssignedHardware": "/web/getAuthorizedHardware?assignment=assigned&deviceType=2,3",
                "GetAssignableHardware": "/web/getAuthorizedHardware?assignment=unassigned&deviceType=2,3",
                "GetSensorsForLand": "/web/organization/{selectedOrganizationId}/lands/{landId}/sensors",
                "PostZoneDetails": "/web/zone/{zoneId}",
                "PostArchiveFieldZone": "/web/archiveLand",
                "GetGatewayValidation": "/web/land/{landId}/installedGateways",
                "GetGatewayFirmwareFeatures": "/web/devices/firmwareFeatures",

                // Gateway Details Services
                    // General
                "GetDeviceRights": "/web/organization/{selectedOrganizationId}/header?rights=probe,gateway",
                "GetDeviceDetails": "/web/device/{deviceId}",
                "PostSaveGateway": "/web/saveGateway",
                "CancelGatewaysSoftwareUpdate": "/web/cancelGatewaysVersion",
                "UpdateGatewaysSoftwareVersion": "/web/updateGatewaysVersion",
                "GetOrganizationPreferences": "/web/organizationPreferences",
                    // Recent Activity
                "GetActivityDetails": "/web/gateway/{gatewayId}/messages",
                "GetGatewayActivity" : "/web/gateway/{gatewayId}/activities",
                    // Sensors
                "GetSensorsData": "/web/device/{deviceId}/wiredDevices",
                "GetSensorConfiguration": "/web/getSensorConfig",
                "PostDeleteDeviceSensor": "/web/deleteDeviceSensor",
                "PostSaveDeviceSensor": "/web/addDeviceSensor",
                    // Transfer
                "SaveDeviceTransfer": "/web/saveDeviceTransfer",
                "PostReclaimGateway": "/web/reclaimLeasedGateway",
                "PostReclaimProbe": "/web/reclaimLeasedProbe",
                    // Remote Tools
                "GetRemoteTools": "/web/device/{deviceId}/remoteTools",
                "PostStartResync": "/web/device/{deviceId}/gatewayHostResync",
                "PostStartMFButton": "/web/device/{deviceId}/remoteButtonPush",
                    // LED Status
                "GetLEDStatus": "/web/device/{deviceId}/ledStatus",
                "GetWirelessLEDStatus": "/web/device/{deviceId}/wirelessRadioLedStatus",
                "GetGatewayDiagnostics": "/web/getGatewayDA", // hackathon service

                "GetGatewayMeasurements": "/web/devices/measurements",
                "GetNotes": "/web/land/{landId}/notes",
                "UpdateNote": "/web/saveNote?id={noteId}&managementZoneId={zoneId}",
                "AddNote": "/web/saveNote?managementZoneId={zoneId}",
                "ExportToCSV": "/web/generateReport",
                //"SaveGraphFilterPreferences": "/web/saveGraphFilterPreferences",
                    //graph modal tabs
                "PostSaveNote": "/web/saveNote",
                "PostDeleteNotes": "/web/removeNotes",
                "PostDeleteBudgetLines": "/web/removeBudgetLines",
                    //gateway attachments
                "GetGatewayNodes": "/web/gateway/{gatewayId}/nodes",
                "NodeLocation": "/web/node/{nodeId}/location",
                "ClearNodeLocation" : "/web/node/{nodeId}/deleteLocation",
                "PostSaveBatteryType" : "/web/node/{nodeId}/batteryType?batteryType={batteryTypeId}",
                    // map flag services
                "GetOrgGateways": "/web/organization/{selectedOrganizationId}/gateways",
                "GetOrgGatewaysAndStatus": "/web/organization/{selectedOrganizationId}/devices?filters=active&attributes=latestStatus",
                "GetOrgDevices": "/web/organization/{selectedOrganizationId}/devices",
                "GetOrgNodes": "/web/organization/{selectedOrganizationId}/nodes",
                "GetOrgNodesAndStatus": "/web/organization/{selectedOrganizationId}/nodes?filters=active&attributes=latestStatus",
                "GetOrgProbes": "/web/organization/{selectedOrganizationId}/probes",
                "GetOrgAlerts": "/web/organization/{selectedOrganizationId}/hardware/alerts",
                "GetGatewaySensors":"/web/gateway/{deviceId}/sensors",
                "GetNodeSensors":"/web/node/{deviceId}/sensors",
                "GetLatestMeasurements":"/web/gateway/{gatewayId}/latestMeasurements",
                "GetNodeMeasurements":"/web/node/{nodeId}/latestMeasurements",
                "PostUnpairNetwork":"/web/gateway/{gatewayId}/dismantleNetwork",

                // groups page
                "GetOrgGroups": "/web/organization/{selectedOrganizationId}/groups",
                "PostAddGroup": "/web/organization/{selectedOrganizationId}/groups",
                "PostSaveGroup": "/web/organization/{selectedOrganizationId}/group/{groupId}",
                "PostAssignZonesToGroups": "/web/organization/{selectedOrganizationId}/groups/lands?groupIds={groupsCSV}&landIds={landsCSV}",
                "PostRemoveGroupZones": "/web/organization/{selectedOrganizationId}/group/{groupId}/lands?landIds={landsCSV}",
                "GetUserGroups": "/web/organization/{selectedOrganizationId}/groups/user",
                "PostSaveGroupFilter": "/web/organization/{selectedOrganizationId}/groups/applyUser?groupIds={groupsCSV}",
                "PostClearGroupFilter": "/web/organization/{selectedOrganizationId}/groups/applyUser",
                "PostSaveDefaultGroupFilter": "/web/organization/{selectedOrganizationId}/groups/user?groupIds={groupsCSV}",
                "PostClearDefaultGroupFilter": "/web/organization/{selectedOrganizationId}/groups/user",

                "PostSessionPreferences": "/web/saveSessionPreferences",
                "PostUserPreferences": "/web/saveUserPreferences", // include preference ids

                "GetZoneProbes": "/web/land/{landId}/probes",
                "GetZoneHardware": "/web/land/{landId}/hardware",

                "GetZoneAlerts": "/web/land/{landId}/alerts",
                "GetGatewayAlerts": "/web/hardware/{gatewayId}/alerts",
                "GetNodeAlerts": "/web/hardware/node/{nodeId}/alerts",

                "GetAlertRulesData": "/web/getGroups", // get alert rules
                "GetAlertRuleDetails": "/web/getGroupById",
                "PostSaveRule": "/web/saveGroup",
                "PostRemoveRules": "/web/deleteGroup",
                "PostRemoveRuleField": "/web/deleteNotificationLand",
                "PostSaveRuleField": "/web/saveNotificationLands",
                "PostSaveRuleUser": "/web/saveNotificationUser",
                "PostRemoveRuleUser": "/web/deleteNotificationUser",

                // custom alerts
                "GetCustomAlertsRights": "/web/organization/{selectedOrganizationId}/header?rights=customAlerts",
                "GetCustomAlertMeasurementTypes": "/web/customAlerts/measurementTypes",
                "PostSaveCustomAlert": "/web/organization/{selectedOrganizationId}/customAlerts",
                "GetCustomAlerts": "/web/organization/{selectedOrganizationId}/customAlerts",
                "GetCustomAlert": "/web/customAlerts/{alertId}",
                "DeleteCustomAlert": "/web/organization/{selectedOrganizationId}/customAlerts?customAlertIds={customAlertIds}",
            }
        };
    }
);
