define(
    [
        'impl/AuthorizationManager',
        'core/prama.core.session'
    ],
    function (auth, session) {
        var checkVersion = function (callback) {
            var onAuthResponse = function (featureStatusDisabled) {
                var mobileFeatureDisabled = featureStatusDisabled["pramaMobile"];
                var switchVersionsDisabled = featureStatusDisabled["SwitchToMobile"];
                var mobile = false;
                var greaterDimension;
                var screenWidth = screen.width;
                var screenHeight = screen.height;
                if (screenHeight > screenWidth) {
                    greaterDimension = screenHeight;
                } else {
                    greaterDimension = screenWidth;
                }
                if (!mobileFeatureDisabled && greaterDimension < 900) {
                    mobile = true;
                }
                var storedVersionPreference;
                if (!switchVersionsDisabled) {
                    storedVersionPreference = sessionStorage["StoredVersionPreference"];
                }
                if (storedVersionPreference) {
                    mobile = (storedVersionPreference == "mobile");
                }
                var response = {};
                if (mobile) {
                    response.version = "mobile";
                } else {
                    response.version = "desktop";
                }
                callback(response);
            };
            auth.featureDisabled(["pramaMobile","SwitchToMobile"], onAuthResponse);
        };
        return {
            checkVersion: checkVersion
        };
    }
);