(function (prama, $, undefined) {
    prama.Paths = {
        Shooter: { url: "../shooter" },
    };
    prama.navigation = {
        "Nav_ShooterView":
        {
            visible: true,
            page: "Shooter",
        }

    };
    prama.setErrorOnMissingTranslation(true);
    prama.allowDiagMode = true;
    prama.loginTimeout = 1860000; // 31 minutes
} (window.prama = window.prama || {}, jQuery));