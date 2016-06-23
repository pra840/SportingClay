prama.skipAutoLoad = true;

var serviceUrls = {
    "Login": "../web/login",
    "ValidateToken": "../public/validateToken",
    "CreateAccount": "../public/createAccount",
    "ForgotPassword": "../public/forgot-pass-url",
    "SendPassword": "../public/sendPassword",
    "CheckMessages": "../public/loginPageMessage"
};
prama.registerPage("Login", getTranslationDefaults(), localLoadPage, serviceUrls, null, {
    isPublic: true
});
$(document).bind('keypress', function (e) {
    if (e.which === 13) { // return
        if (!actionInProgress && !prama.alertActive) {
            $("#login-action").click();
        }
    }
});
var onServerResponse = function (response) {
    if (response.success) {
        var screenWidth = screen.width;
        var screenHeight = screen.height;
        if (screenHeight > screenWidth) {
            greaterDimension = screenHeight;
        } else {
            greaterDimension = screenWidth;
        }
    }
    prama.runAutoLoad();
}
function localLoadPage() {
    $('#login-action').csButton().addClass('yellow').click(login);
    $('#signUpBtn').csButton().addClass('yellow').click(acceptInvitationNewUser);
    $('#createAccountBtn').csButton().addClass('yellow').click(addUserFromInvitation);
    $('#createAccountCancelBtn').click(closeInvitationNewUser);

    if(!Modernizr.input.placeholder){
        var placeHolderWrap = $('<div class="placeholder-wrap"></div>');
        var placeHolderDiv = $('<div class="placeholder-substitute"></div>');

        $('#login-overlay [placeholder]').each(function(index, element){
            var substitute = placeHolderDiv.clone();
            $(element).wrap(placeHolderWrap);
            $(element).after(substitute);
            var top = $(element).offset().top;
            substitute.css('top', top).click(function(){
                substitute.hide();
                setTimeout(function(){
                    $(element).focus();
                }, 10);
            });

            $(element).focus(function() {
                var input = $(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                }
                substitute.hide();
            }).blur(function() {
                    var input = $(this);
                    if (input.val() == '' || input.val() == input.attr('placeholder')) {
                        substitute.html(input.attr('placeholder')).show();
                    }
                }).blur();

        });
    }
    $('#footer').show();

    prama.pageLoadComplete();
    var token = prama.getQueryString()["token"];
    var data = {};
    data.token = token;
    var tokenType = prama.getQueryString()["tokenType"];
    if (tokenType) {
        data.tokenType = tokenType;
    }
    if (token) {
        var body = $('body');
        body.csMessage({
            messageKey: "Msg_ValidateToken", generateAutomationId: true, automationIdPrefix: "tokenValidation"
        });
        prama.send("ValidateToken", data, function (response) {
            if (response.success) {
                if (response.data.type == "AccountInvitation") {
                    $('#loginInstructionsHeader').text(prama.translation("Msg_AcceptInvitation"));
                    $('#acceptInvitation').show();
                    $('#previousVersion').hide();
                    $('#lnkDemoSite').hide();
                }
            }
            prama.messageOff(body);
        });
    }

    prama.send("ForgotPassword", {}, function( response ) {
        if ( response.success ) {
            var url = response.data.redirectUrl;
            var link = $("#forgot-password-action");
            link.attr('href', url);
            link.show();
        }
    } );

}

function closeInvitationNewUser() {
    $('#acceptInvitationNewUser').csDialog('close');
    $("[data-id]", $("#acceptInvitationNewUser")).val("");
}
var newUserDialogSetup = false;
function acceptInvitationNewUser() {
    var afterSetup = function () {
        var container = $('#acceptInvitationNewUser');
        container.validate('clear');
        actionInProgress = true;
        container.csDialog({
            title: prama.translation("CreateAccountTitle"),
            height: 550,
            width: 650,
            modal: true,
            close: function (){ actionInProgress = false;}
            //dialogClass: "card-dialog"
        });
    };
    if (newUserDialogSetup) {
        afterSetup();
    } else {
        var onResponse = function (response) {
            if (response.success) {
                var countryList = [];
                $.each(response.data.countries, function(index, country){
                    country.name = prama.translation('country_'+ country.id.toLowerCase());
                    countryList.push(country);
                });
                countryList.sort(function(a,b){
                    if (a.name.toLowerCase() < b.name.toLowerCase()){
                        return -1;
                    } else if (a.name.toLowerCase() > b.name.toLowerCase()){
                        return 1;
                    } else {
                        return 0;
                    }
                });
                $('#newUserCountrySelector').csSelectors({
                    data: countryList,
                    unselected: prama.translation("Msg_PleaseSelect")
                });
                newUserDialogSetup = true;
                afterSetup();
            }
        };
        prama.get("GetCountryListForEula", onResponse, { "pageKey": "Common" });
    }
}

function addUserFromInvitation() {
    var container = $('#acceptInvitationNewUser');
    var additionalValidations = {
        postalCode:  function (item) {
            var countryCode = $('#newUserCountrySelector').csSelectors("selectedid");
            if (!countryCode) { return; }
            var postalCode = $(item).val();
            var seemsValid = true;
            var validator;
            switch (countryCode) {
                case "IT":  //Italy
                    validator = /^([0-9]{5})$/
                    break;
                case "FR":  //France
                    validator = /^([0-9]{5})$/;
                    break;
                case "ES":  //Spain
                    validator = /^([0-9]{5})$/;
                    break;
                case "PT":  //Portugal
                    validator = /^([0-9]{4})$/;
                    break;
                case "US":  //United States
                    validator = /^\d{5}(-\d{4})?$/
                    break;
                case "CA":  //Canada
                    validator = /^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$/i
                    break;
                case "AU":  //Australia
                    validator = /^([0-9]{4})$/;
                    break;
                case "NZ":  //New Zealand
                    validator = /^([0-9]{4})$/;
                    break;
                case "GB": //United Kingdom
                    validator = /^[A-Za-z]{1,2}\d{1,2}[A-Z]? *\d{1}[A-Z]{2}$/;
                    break;
            }
            seemsValid = validator ? validator.test(postalCode) : true;
            if (!seemsValid) {
                var result = {
                    valid: false,
                    message: prama.translation("Msg_ValidPostalCode")
                };
                return result;
            } else {
                var result = {
                    valid: true
                };
                return result;
            }
        }
    };
    if (!container.validate('', additionalValidations)) {
        return;
    }
    var data = {};
    container.getValues(data);
    container.csMessage({
        messageKey: "Msg_PleaseWaitSaving", generateAutomationId: true, automationIdPrefix: "CreateAccount"
    });
    data.token = prama.getQueryString()["token"];
    var tokenType = prama.getQueryString()["tokenType"];
    if (tokenType) {
        data.tokenType = tokenType;
    }
    prama.post("CreateAccount", data, function (response) {
        prama.messageOff(container);
        if (response.success) {
            closeInvitationNewUser();
            actionInProgress = true;
            prama.alert(prama.translation("UserAdded"), null, function () {
                windowLocate(response.data.url);
            });
        }
    });
}

function compareByName(a, b) {
    var nameA = a.name.toLowerCase();
    var nameB = b.name.toLowerCase();
    if (nameA < nameB) {
        return -1
    }
    if (nameA > nameB) {
        return 1
    }
    return 0;
};

var actionInProgress = false;

function login() {
    var container = $('#userDetails');
    actionInProgress = true;
    if (container.validate()) {
        var data = {};
        container.getValues(data);
        data.token = prama.getQueryString()["token"];
        var tokenType = prama.getQueryString()["tokenType"];
        if (tokenType) {
            data.tokenType = tokenType;
        }
        var options = {};
        options.onResponseMessage = function (response) {}; //nothing needed, the callback will handle it
        $('#login-overlay').csMessage({
            messageKey: "Validating", generateAutomationId: true, automationIdPrefix: "signIn"
        });
        prama.post("Login", data, handleLoginResult, options);
    } else {
        prama.alert(prama.translation("EnterValues"), null, function(){ actionInProgress = false; });
    }
}
var successUrl;
var goData;

function handleLoginResult( response ) {
    if ( response.success ) {
        $( '#login-messages' ).hide();
        $( '#acceptInvitation' ).hide();
        successUrl = response.data.successUrl;
        goData = response.data;
        $( '#forgot-password-action' ).hide();
        windowLocate( response.data.successUrl );
    } else {
        if ( response.messages && response.messages.length ) {
            $( '#login-error' ).html( response.messages[0].message );
            $( '#login-messages' ).show();
            prama.messageOff( $( '#login-overlay' ) );
        }
        actionInProgress = false;
    }
}

function windowLocate(url) {
    window.location = url;
}

function getTranslationDefaults() {
    return {
        "CountryTitle": "Country",
        "Msg_ValidateToken": "Please wait while your token is validated.",
        "Msg_AcceptInvitation": "Accept Invitation",
        "Msg_PasswordMatch": "Passwords must match",
        "InvAddUser": "If you do not have an account, click below to create one.",
        "SignUp": "Sign Up",
        "FirstNameLabel": "First name (Must be Alphanumeric Only)",
        "LastNameLabel": "Last name (Must be Alphanumeric Only)",
        "EmailLabel": "Email (Must be a valid email address)",
        "PasswordLabel": "Password",
        "ConfirmPasswordLabel": "Confirm password",
        "SecQuestionLabel": "Security question",
        "SecAnswerLabel": "Security answer",
        "CreateAccountTitle": "Create Account",
        "CancelTitle": "Cancel",
        "UserIdLabel": "User id (Must be alphanumeric characters)",
        "LoginSubtitle": "Stay in the Green!",
        "LearnMore": "Learn More",
        "Welcome": "Welcome, ",
        "SubmitTitle": "Submit",
        "Msg_AccountLockout": "You have exceeded # of attempts. Your account has been locked",
        "ForgotPasswordTitle": "Forgot your password?",
        "RememberMe": "Remember me",
        "OKTitle": "OK",
        "EnterValues": "Please enter userID and Password",
        "QuestionTitle": "Please answer your security question",
        "UserAdded": "User added successfully",
        "PasswordValid": "8-20 lowercase alphanumeric characters, must contain 1 number AND 1 letter",
        "SecurityQuestionValid": "Only 250 alphanumeric characters allowed. Question mark is allowed.",
        "UserIdValid": "User Id must be 8-20 alphanumeric characters",
        "InfoLeftTitle": "Enhance Your Expertise.",
        "InfoLeft": "PRAMA.",
        "InfoRightTitle": "Applications",
        "SignInHere": "Sign In Here",
        "PraMaTM": "PraMa<br/>PraMa&trade;",
        "Validating": "Validating Credentials",
        "NoticeLabel": "Notice",
        "GoToSupportTitle":"Go To Support Page",
        "SearchOrgTitle": "Search Org",
        "LoginTermsOfUse": 'I understand and agree that my use of this site is governed by the terms and conditions available {0}here{1}.  (Updated 12/19/2014)',
        "StateLabel": "State",
        "CountryLabel": "Country",
        "CityLabel": "City",
        "Msg_InvalidCity": "Only A-Z ' and - allowed",
        "Msg_NoSpecialCharacters": "Special characters are not allowed",
        "PostalCodeLabel": "Postal Code",
        "AddressLine1Label": "Address line 1",
        "AddressLine2Label": "Address line 2",
        "Msg_ValidPostalCode": "Invalid postal code",
        "DemoSite": "Demo Login"
    }
}