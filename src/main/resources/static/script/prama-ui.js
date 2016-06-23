$('#content').hide();

// Extending hide and show functions to prevent phantom html in IE7
var _oldhide = $.fn.hide;
$.fn.hide = function (speed, callback) {
    setTimeout(function() {
        $('body').addClass('fc-refreshed');
        if (!$(this).hasClass('no-show')) {
            $(this).addClass('no-show');
        }
    }, 1);
    return _oldhide.apply(this, arguments);
}
var _oldshow = $.fn.show;
$.fn.show = function (speed, callback) {
    setTimeout(function() {
        var element = $(this);
        $('body').addClass('fc-refreshed');
        if ($(this).hasClass('no-show')) {
            $(this).removeClass('no-show');
        }
    }, 1);
    return _oldshow.apply(this, arguments);
}

$(document).ready(function () {
    //        fc.reloadPage();
    $(document).click(
        function () {
            $('.has-options.opened').csOptionShower('close');
        }
    );

});

fc.updateLoadingStatus = function (messageKey) {
    $('#viewport').csMessage("update", messageKey);
};
fc.waitMaskOn = function () {
    $('#pageLoadingWrapper').removeClass('complete');
}
fc.waitMaskOff = function () {
    $('#pageLoadingWrapper').addClass('complete');
}
fc.pageLoadComplete = function () {
    // fc.messageOff($('#viewport'));
    $('#TermsOfUseLink').show();
    $('#viewport').show();
    $('#content').show();
    $('#pageLoadingWrapper').addClass('complete');
};
fc.contentMask = null;
fc.maskContent = function () {
    if (!fc.contentMask) {
        $("<div class='content-hider'></div>");
    }
    $('#content').prepend(contentMask);
};
fc.unmaskContent = function () {
    fc.contentMask.remove();
};

fc.initNav = function () {
    //TODO: rework this silly code to use recursion
    var breadcrumbs = [];

    $.each(fc.navigation,
        function (level1key, level1item) {
            $.each(level1item.children,
                function (level2key, level2item) {
                    if (level2item.children) {
                        $.each(level2item.children,
                            function (level3key, level3item) {
                                if (level3item.page === fc.pageKey ||
                                    (level3item.associatedPageKeys && $.inArray(fc.pageKey,
                                        level3item.associatedPageKeys) > -1)) {
                                    breadcrumbs = [];
                                    breadcrumbs.push(level1key);
                                    breadcrumbs.push(level2key);
                                    breadcrumbs.push(level3key);
                                }
                            }
                        );
                    }
                    if (breadcrumbs.length === 0
                        && ((level2item.associatedPageKeys && $.inArray(fc.pageKey, level2item.associatedPageKeys))
                        || level2item.page === fc.pageKey)) {
                        breadcrumbs = [];
                        breadcrumbs.push(level1key);
                        breadcrumbs.push(level2key);
                    }
                }
            );
            if (breadcrumbs.length === 0
                && level1item.associatedPageKeys
                && $.inArray(fc.pageKey, level1item.associatedPageKeys)) {
                breadcrumbs.push(level1key);
            }
        }
    );

    var checkItemVisibility = function (item) {
        var page = item.page;
        if (!item.visible) {
            page = null;
        }
        if (item.feature) {
            if (fc.header.disabledFeatures && $.inArray(item.feature, fc.header.disabledFeatures) > -1) {
                page = null;
            }
        }
        if (item.rights) {
            if (fc.header.rights && item.rights in fc.header.rights && !fc.header.rights[item.rights]) {
                page = null;
            }
        }
        if (page) {
            return checkPageVisibility(page);
        } else {
            return null;
        }
    }

    var checkPageVisibility = function (page) {
        var pageInfo = fc.Paths[page];
        if (pageInfo.feature) {
            if (fc.header.disabledFeatures && $.inArray(pageInfo.feature, fc.header.disabledFeatures) > -1) {
                if (pageInfo.downgrade) {
                    return checkPageVisibility(pageInfo.downgrade);
                } else {
                    return null;
                }
            }
        }
        return page;
    };

    var tabbuilder = function (level, items) {
        var tabs = [];
        var isSelected = false;
        $.each(items,
            function (key, item) {
                isSelected = (breadcrumbs[level] && key === breadcrumbs[level]);
                var itemPage = checkItemVisibility(item);
                if (itemPage) {
                    tabs.push({ name: fc.translation(key), key: itemPage, selected: isSelected });
                }
                if (isSelected && item.children) {
                    var buildChildren = function () { tabbuilder(level + 1, item.children); };
                    buildChildren();
                }
            }
        );
        switch (level) {
            case 0:
                if (fc.header.superUser) {
                    var navOptions = {
                        tabs: tabs,
                        type: "header"
                    };
                    $('.header-navigation').csNavigation(navOptions);
                }
                break;
            // case 1:
            //     $('#mainNavigation').csNavigation(
            //         { tabs: tabs }
            //     );
            //     break;
            // case 2:
            //     $('#subnav').csSubNavigation({ tabs: tabs });
            //     break;
        }
    }

    tabbuilder(0, fc.navigation);

    var buildHeaderNav = function() {
        require(
            ['../script/require-configuration.js?v=' + new Date().getTime()],
            function (configurator) {
                configurator.configure()
                requirejs.config({
                    paths: {
                        text: ['lib/text'],
                        doT: ['lib/doT']
                    },
                    shim: {
                        doT: { }
                    }
                });

                require([
                    'impl/views/header/HeaderNavView',
                    'text',
                    'doT'
                ], function(HeaderNavView) {
                    fc.headerNavView = new HeaderNavView();
                });
            }
        );
    };

    buildHeaderNav();

    $('#headerDynamic').show();
    $('#siteWelcome').show();
};



fc.messageOff = function (selector, skipFade) {
    if (selector.data('csMessage') || selector.data('uiCsMessage')) {
        selector.csMessage("off", skipFade);
    }
};

fc.showOrgSelector = function (config, afterSuccess) {
    var orgSelectorConfig = {
        beforeShow: function () {
            fc.waitMaskOff();
        },
        username: (fc.header && fc.header.username) || "",
        isSuperUser: (fc.header && fc.header.superUser) || false,
        showSupportLink: false,
        allowExit: true,
        skipToEula: false,
        organizations: (fc.header && fc.header.organizations) || [],
        selectAction: function (data) {
            var handleSelectOrganizationResponse = function (response) {
                fc.messageOff($('body'));
                //$('body').csMessage("off");

                if (response.success) {
                    if (response.data) {
                        fc.header = response.data;
                        var finishOrgSelection = function(){
                            var context = fc.session.get("fc.headerDetails");
                            if (context) {
                                context.selectedOrganizationId = data.id || data.selectedOrganizationId;
                            } else {
                                context = response.data;
                            }
                            context.selectedOrganizationId = context.selectedOrganizationId || data.id;
                            fc.session.set("fc.headerDetails", JSON.stringify(context));

                            require( [ '/script/src/core/fc.core.constants.js',
                                       '/script/src/core/fc.core.session.js' ],
                                     function ( constants, session ) {
                                         session.set( constants.groups.HasDefaultFilterKey, false );
                                         session.set( constants.groups.DefaultFilterLoadedKey, false );
                                         session.storeData( function () {
                                             OrgSelector.close();
                                             fc.waitMaskOn();
                                             afterSuccess( response, data );
                                         } );
                                     }
                            );
                        };
                        if (response.data.agreementAccepted) {
                            finishOrgSelection();
                        }
                        else {
                            if (response.data.rights && !response.data.rights.canAcceptAgreement) {
                                fc.alert(fc.translation("EULANotAccepted"), fc.translation("EULANotAcceptedTitle"));
                                return;
                            }
                            OrgSelector.showEulaAcceptor(null, finishOrgSelection);
                        }
                    }
                } else {
                    if (response.messages[0].message == null) {
                        fc.alert(fc.translation('OrgHasIssue'));
                    } else {
                        fc.alert(response.messages[0].message);
                    }
                }
            };

            $( 'body' ).csMessage( {fillDialog: true, messageKey: "Msg_PageLoading"} );
            fc.post("SelectOrganization", data, handleSelectOrganizationResponse, {
                pageKey: "Common"
            });
        }
    };
    $.extend(orgSelectorConfig, config);
    var selectorFunction = null;
    if (!orgSelectorConfig.skipToEula) {
        selectorFunction = function () { OrgSelector.showOrganizationSelector(orgSelectorConfig); };
    } else {
        var onAccept = function () {
            OrgSelector.close();
            afterSuccess();
        };
        selectorFunction = function () { OrgSelector.showEulaAcceptor(orgSelectorConfig, onAccept); };
    }
    if (selectorFunction) {
        if (typeof (OrgSelector) == "undefined") {
            var sessionKey =  new Date().getTime();
            fc.loadScript("../html/parts/OrgSelector.js?v=" + sessionKey,
                                        function () {
                                            fc.queueCode(function () {
                                                selectorFunction();
                                            });
                                        }
                                    );
        } else {
            selectorFunction();
        }
    }
};

$.fn.pushHandler = function(options) {
    var el = this;
    var handlersKey = "csHandlers";
    var boundEventsKey = "csBoundEvents";
    var handlers = el.data(handlersKey);
    var handleEvent = function(jqueryEvent) {
        var currentHandlers = el.data(handlersKey);
        if (currentHandlers) {
            var handler;
            for (var i = currentHandlers.length-1; i >= 0; i--) {
                handler = currentHandlers[i];
                if (handler.name === options.name) {
                    var response = handler.handler(jqueryEvent);
                    if (handler.allowContinue) {
                        continue;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    if (!handlers) {
        handlers = []
        el.data(handlersKey, handlers);
    }
    var boundEvents = el.data(boundEventsKey);
    if (!boundEvents) {
        boundEvents = [];
        el.data(boundEventsKey, boundEvents);
    }
    if ($.inArray(options.name, boundEvents) === -1) {
        this.bind(options.name, handleEvent);
        boundEvents.push(options.name);
    }

    handlers.push(options);
};

$.fn.removeHandler = function(options) {
    var el = this;
    var handlersKey = "csHandlers";
    var handlers = el.data(handlersKey);
    if (handlers) {
        var handlerConfig;
        for (var i = handlers.length-1; i >= 0; i--) {
            handlerConfig = handlers[i];
            if (options.namespace && handlerConfig.namespace) {
                if (options.namespace != handlerConfig.namespace) {
                    continue;
                }
            }
            if (options.name && options.name != handlerConfig.name) {
                continue;
            }
            if (options.handler) {
                if (options.handler != handlerConfig.handler) {
                    continue;
                }
            }
            //if we go to this point, it was a match in all categories
            handlers.splice(i, 1);
        }
    }
};

(function (Common, $, undefined) {
    Common.UserPreferences = function () {
        document.forms["userPreferences"].action = fc.Paths["People"].url;
        document.forms["userPreferences"].method = "GET";
        document.forms["userPreferences"]["showPref"].value = "true";
        document.forms["userPreferences"].submit();
    }
    Common.navigateSuperUserSupportToOrgView = function(key) {
        var impersonateOrganization = function (item) {
            var handleSelectOrganizationResponse = function (response) {
                if (response.success) {
                    if (response.data && response.data.successUrl) {
                        fc.navigate(key);
                    }
                } else {
                    if (response.messages[0].message == null) {
                        fc.alert(fc.translation('OrgHasIssue'));
                    } else {
                        fc.alert(response.messages[0].message);
                    }
                }
            }
            fc.post("SelectOrganization", item, handleSelectOrganizationResponse, {
                pageKey: "Common"
            });
            }
        var options = {
            multiselect: false,
            selectAction: function (org) {
                impersonateOrganization(org)
            }
        }
        Common.showOrgSearch(options);
    }

    Common.GetPrecision = function (scinum) {
        if (scinum.match(/^[-+]?[1-9]\.[0-9]+E[-]?[1-9][0-9]*$/)) {

            var arr = new Array();
            // Get the exponent after 'e', make it absolute.
            arr = scinum.split('E');
            var exponent = Math.abs(arr[1]);

            // Add to it the number of digits between the '.' and the 'e'
            // to give our required precision.
            var precision = new Number(exponent);
            arr = arr[0].split('.');
            precision += arr[1].length;
            scinum = (+scinum).toFixed(precision);

        }
        return scinum;
    }

    Common.getCountryList = function (response) {
        if (response.success) {

            Common.CountryList = [];
            $.each(response.data.options_country, function(index, country){
                country.name = fc.translation('country_'+ country.id.toLowerCase());
                Common.CountryList.push(country);
            });
            Common.CountryList.sort(function(a, b){
                if (a.name.toLowerCase() < b.name.toLowerCase()) {
                    return -1;
                } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
                    return 1;
                } else {
                    return 0;
                }
            });
            AddOrg.showAddOrg();
        }
    };

} (window.Common = window.Common || {}, jQuery));


(function (AddOrg, $, undefined) {
    AddOrg.PartConfig = {
        htmlPath: "../html/parts/AddOrg.htm",
        partKey: "AddOrg",
        useCommonTranslations: true,
        serviceUrls: {}
    }

    function showAddOrg() {
        if (!Common.CountryList) {
            fc.get("GetCountryList", Common.getCountryList, { "pageKey": "Common" });
            return;
        }
        var popup = $('#addOrgPopup');
        popup.find('#countryListOrg').csSelectors(
            {
                data: Common.CountryList,
                unselected: fc.translation("Msg_PleaseSelect")
            });

        popup.hydrate("clear");
        popup.validate("clear");
        if (popup.is(':data(dialog)')){
            popup.csDialog('open');
        } else {
            popup.csDialog({
                title: fc.translation("AddOrganizationTitle"),
                width: 525,
                height: 380,
                modal: true
            });
        }



        function orgCancelClicked() {
            popup.csDialog('close');
        }

        popup.find('#orgCancel').click(orgCancelClicked);
        popup.find('#orgSendInvite').csSubmit(
            {
                container: popup,
                urlkey: "AddOrganization",
                urlPageKey: "Common",
                successTextKey: "Msg_InvitationSent",
                close: function () { popup.csDialog("close"); }
            }
        );
    }

    function setUpButton(element) {

        var setup = function() {
            if($('#addOrgButton').size() == 0) {
                var target = $(element);
                if(!target.hasClass(("clearfix"))) {
                    target.addClass("subnav-bar").addClass("clearfix");
                }
                var addOrgButton = $("<div id='addOrgButton'> </div>");
                target.append(addOrgButton);
                var addOrgSpan = $("<span id='addOrgSpan' data-res-id='AddOrganizationTitle' style='padding-right:9px;float:right' automation-id='addOrgSpan'></span>");
                target.append(addOrgSpan);
                fc.populateTranslations(element);
                $("#addOrgButton").csButton({ icons: { primary: "ui-icon-plus"}, titleKey: "AddOrganizationTitle" })
                    .addClass('yellow')
                    .click(showAddOrg);
                $("#addOrgSpan").click(showAddOrg);
                if (!fc.header.rights.canViewOrganization) {
                    $('#addOrgButton').hide();
                    $('#addOrgSpan').hide();
                }
            }
        }
        fc.loadPagePart(AddOrg.PartConfig, setup);
    }

    AddOrg.showAddOrg = showAddOrg;
    AddOrg.setUpButton = setUpButton;

} (window.AddOrg = window.AddOrg || {}, jQuery));


//jquery additions
var CropSenseDialog = {
    titleElement: null,
    _create: function () {
        if (this.options.sidebar) {
            this.options.dialogClass = "cs-dialog cs-dialog-with-sidebar";
        } else {
            this.options.dialogClass = "cs-dialog";
        }
        var wrapper = $("<div></div>");
        var header = $("<div class='header cs-dialog-titlebar clearfix'></div>");
        var title = $("<span class='title-value'></span>");
        var button = $("<div class='rounded' id='x-button'></div>");
        var border = $("<div class='jd-bar-top'></div><div class='jd-bar-bottom'></div>");

        if (this.options.generateAutomationId) {
            wrapper.attr("automation-id", this.options.title);
        }
        button.attr("automation-id", (this.options.automationIdPrefix)? this.options.automationIdPrefix + "-x-button" : this.options.title + "-popup-x-button");

        title.html(this.options.title);
        this.titleElement = title;

        header.append(title);
        header.append(button);
        if (this.options.hideCloseInHeader) {
            button.hide();
        }
        header.append(border);

        var widget = this;
        button.click(
            function () {
                widget.close();
            }
        );

        var content = this.options.sidebar ? this._buildSidebar() : this.element;
        content.addClass("cs-dialog-content");

        wrapper.append(header);
        wrapper.append(content);
        //wrapper.dialog(input);

        this.element.show();
        this.element = wrapper;

        $.ui.dialog.prototype._create.call(this);
    },
    _init: function () {
        if (this.options.sidebar) {
            $.each(this.options.sidebar.tabs,
                function (index, tabInfo) {
                    var tab = $(".nav-link[tabkey='" + tabInfo.textkey + "']");
                    if (tabInfo.selected) {
                        tab.addClass("selected");
                        tabInfo.content.show();
                        if (tabInfo.click){
                            tabInfo.click();
                        }
                    } else {
                        tab.removeClass("selected");
                        tabInfo.content.hide();
                    }
                    if (tabInfo.hide) {
                        tab.hide();
                    } else {
                        tab.show();
                    }
                }
            );
        }
        this.titleElement.html(this.options.title);
        $('.has-options.opened').csOptionShower('close');
        $.ui.dialog.prototype._init.call(this);
        fc.checkDemo();
    },
    open: function(){
        var initScrollTop = $(document).scrollTop();
        $.ui.dialog.prototype.open.call(this);

        var dialog = this.element.closest('.ui-dialog');

        var dWidth = dialog.width();
        var dHeight = dialog.height();

        if (screen.width < document.width){ // screen is smaller than document
             if (window.innerWidth >= document.width){ // zoomed out to show full screen
                 // position in center
                 var positionLeft = (document.width / 2) - (dWidth / 2);
                 var positionTop = (window.innerHeight / 2) - (dHeight / 2);
                 dialog.css('left', positionLeft);
                 dialog.css('top', positionTop);
             } else if (dWidth < window.innerWidth) { // zoomed in, dialog fits inside screen
                 var positionLeft = window.pageXOffset + (window.innerWidth / 2) - (dWidth / 2);
                 var positionTop = window.pageYOffset + (window.innerHeight / 2) - (dHeight / 2);
                 dialog.css('left', positionLeft);
                 dialog.css('top', positionTop);
             } else { // zoomed in, dialog DOESN'T fit inside screen
                 // position inside zoomed view
                 var positionLeft = window.pageXOffset;
                 var positionTop =  window.pageYOffset;

                 // Make sure dialog doesn't overflow off page (right or bottom)
                 if ((document.width - positionLeft - dWidth) < 0){
                     positionLeft = positionLeft + (document.width - positionLeft - dWidth);
                 }
                 if ((document.height - positionTop - dHeight) < 0){
                     positionTop = positionTop + (document.height - positionTop - dHeight);
                 }

                 // Make sure dialog isn't positioned negative left or top
                 dialog.css('left', positionLeft > 0 ? positionLeft : 0);
                 dialog.css('top', positionTop > 0 ? positionTop : 0);
             }
        } else {
            $(document).scrollTop(initScrollTop);
            var positionTop = initScrollTop + (window.innerHeight / 2) - (dHeight / 2);
            dialog.css('top', positionTop);
        }
    },
    reopen: function () {
        $('.has-options.opened').csOptionShower('close');
        var button = this.element.find('#x-button');
        if (this.options.hideCloseInHeader) {
            button.hide();
        } else {
            button.show();
        }
        this.open();
    },
    sidebarHideTab: function (tabs) {
        var widget = this;
        if (fc.isArray(tabs)) {
            $.each(tabs,
                function (index, tab) {
                    widget._hideTab(tab);
                }
            );
        } else {
            widget._hideTab(tabs);
        }
    },
    sidebarShowTab: function (tabs) {
        var widget = this;
        if (fc.isArray(tabs)) {
            $.each(tabs,
                function (index, tab) {
                    widget._showTab(tab);
                }
            );
        } else {
            widget._showTab(tabs);
        }
    },
    sidebarDisable: function (tabs) {
        var widget = this;
        if (fc.isArray(tabs)) {
            $.each(tabs,
                function (index, tab) {
                    widget._disableTab(tab);
                }
            );
        } else {
            widget._disableTab(tabs);
        }
    },
    sidebarEnable: function (tabs) {
        var widget = this;
        if (fc.isArray(tabs)) {
            $.each(tabs,
                function (index, tab) {
                    widget._enableTab(tab);
                }
            );
        } else {
            widget._enableTab(tabs);
        }
    },
    title: function (title) {
        $(this.element).find('.title-value').text(title);
    },
    _enableTab: function (tabkey) {
        $("[tabkey='" + tabkey + "']").removeClass("disabled");
        if (this.disabledTabs.length > 0) {
            fc.removeFromCollectionByProperty(this.disabledTabs, { "key": tabkey }, "key");
        }
    },
    _hideTab: function (tabkey) {
        $("[tabkey='" + tabkey + "']").css("display", "none");
    },
    _showTab: function (tabkey) {
        $("[tabkey='" + tabkey + "']").show();
    },
    _disableTab: function (tabkey) {
        $("[tabkey='" + tabkey + "']").addClass("disabled");
        fc.addOrRefreshInCollection(this.disabledTabs, { "key": tabkey }, "key");
    },
    disabledTabs: [],
    _buildSidebar: function () {
        var wrapper = $("<div class='wrapper'></div>");
        var navBar = $("<div class='nav-wrapper'></div>");
        this.element.addClass("cs-dialog-sidebar-content-wrapper");
        var widget = this;
        $.each(this.options.sidebar.tabs,
            function (index, tabInfo) {
                var tab = $("<div class='nav-link'></div>");
                tab.attr("tabkey", tabInfo.textkey);
                var textDiv = $("<div class='nav-text'><span automation-id='" + (widget.options.automationIdPrefix || "") + tabInfo.textkey + "'>" + fc.translation(tabInfo.textkey)
                    + "</span></div>");
                tab.append(textDiv);
                textDiv.append($("<div class='edge'></div>"));
                navBar.append(tab);
                tabInfo.content.addClass("content");
                tab.click(
                    function () {
                        var disabled = false;
                        $.each(widget.disabledTabs,
                            function (index, tab) {
                                if (tab.key === tabInfo.textkey) {
                                    disabled = true;
                                }
                            }
                        );
                        if (!disabled) {
                            wrapper.find('.content').hide();
                            wrapper.find('.nav-link').removeClass("selected");
                            tab.addClass("selected");
                            tabInfo.content.show();
                            if (tabInfo.click) {
                                tabInfo.click();
                            }
                        }
                        fc.checkDemo();
                    }
                );
            }
        );
        wrapper.append(navBar);
        wrapper.append(this.element);
        return wrapper;
    }
};
$.widget("ui.csDialog", $.ui.dialog, CropSenseDialog);

var csRadioNumber = 1;
var CropSenseRadio = {
    _create: function () {
        var widget = this;
        var container = this.element;
        var radio;
        $.each(this.options.buttons,
            function (index, buttonInfo) {
                radio = $("<span class=\"csRadioGroup\"><input type=\"radio\" name=\"csRadio" + csRadioNumber + "\" id=\"" + buttonInfo.id + "\" automation-id=\"" + (buttonInfo.automationId || buttonInfo.id) + "\" />  <label for=" + buttonInfo.id + ">" + buttonInfo.name + "</label> </span>");
                if (buttonInfo.selected) {
                    radio.find(":radio").attr("checked", "checked");
                }
                container.append(radio);
                radio.change(
                    function () {
                        widget._trigger("change", null, buttonInfo)
                    }
                );
            }
        );
        container.attr("data-type", "csradio");
        csRadioNumber++;
    },
    getValue: function () {
        var checked = this.element.find(":radio:checked")
        if (checked && checked.length === 1) {
            return checked.attr("id");
        }
        return null;
    },
    setValue: function (val) {
        var widget = this;
        if (val) {
            var radio = this.element.find(":radio[id='" + val + "']");
            radio.attr("checked", "checked");
        } else {
            var checked = false;
            this.element.find(":radio:checked").removeAttr("checked");
            $.each(this.options.buttons,
                function (index, buttonInfo) {
                    if (buttonInfo.selected) {
                        var radio = widget.element.find(":radio[id='" + buttonInfo.id + "']");
                        radio.attr("checked", "checked");
                        checked = true;
                    }
                }
            );
            if (!checked) {
                $(this.element.find(":radio")[0]).attr("checked", "checked");
            }
        }
    }
};
$.widget("ui.csRadio", CropSenseRadio);

var CropSenseDetailItems = {
    _create: function () {
        var widget = this;
        var container = this.element;

        if (widget.options.allowAdd) {
            widget.createAddBar();
        }

        widget.itemContainer = $("<div class='item-container'></div>");
        container.append(widget.itemContainer);
        if (widget.options.itemsCanOpen) {
            widget.itemContainer.delegate('.head', 'click', function (event) {
                    var itemElement = $(this).closest('.detail-item');
                    if (itemElement.hasClass("editing")) {
                        return;
                    }

                    widget._toggleItem($(this));
                }
            );
        } else if (widget.options.customItemClick) {
            widget.itemContainer.delegate('.head', 'click', function (event) {
                var itemElement = $(this).closest('.detail-item');
                var item = fc.findItemByPropertyValue(widget.options.items, widget.options.itemKeyProperty, itemElement.attr('item-id'));
                widget.options.customItemClick(item, itemElement);
            });
        }

        if (widget.options.items) {
            widget.setData(widget.options.items);
        }
    },
    createAddBar: function () {
        var widget = this;
        var container = widget.element;
        var html = [];
        var actionId = container.attr('id') + "ActionAdd";
        html.push("<div class='detail-item rounded closed add-bar'>");
        html.push("<div class='head rounded clearfix'" + (widget.options.generateAutomationId ? " automation-id='" + widget.options.addTextKey + "'" : "") + ">");
        html.push("<div class='text'>");
        html.push(fc.translation(widget.options.addTextKey));
        html.push("</div>");
        html.push("<div class='action add' id='" + actionId + "' automation-id='" + actionId + "'></div>");
        html.push("</div>");
        html.push("<div class='open-content has-footer' style='display:none;'>");
        html.push("<div class='main' style='position: relative'>");
        html.push("</div>");
        html.push("<div class='detail-item-footer'>");
        html.push("<a class='action-cancel-add' automation-id='" + actionId + "actionCancel'></a>");
        html.push("<div class='action-save-add' automation-id='" + actionId + "actionSave'></div>");
        html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        var addTemplate;
        if (widget.options.cloneTemplates) {
            addTemplate = $(widget.options.addTemplateSelector).children().clone();
        } else {
            addTemplate = $(widget.options.addTemplateSelector);
        }
        widget._addActionBar = $(html.join(''));
        widget._addActionBar.find(".head").click(
            function () {
                if (widget.options.customAddClick) {
                    widget.options.customAddClick();
                    return;
                }


                if (widget._addActionBar.hasClass("editing")) { return; }
                addTemplate.hydrate("clear");
                widget._trigger("addClicked", null, addTemplate);
                widget._toggleItem(widget._addActionBar);
                $(this).closest('.detail-item').addClass("editing");
                if (widget.options.addOpenTextKey) {
                    $(this).find('.text').html(fc.translation(widget.options.addOpenTextKey));
                }
                widget._addActionBar.find('.add').hide();
                if (widget.options.afterAddCreate) {
                    widget.options.afterAddCreate(addTemplate);
                }
            }
        );
        widget._addActionBar.closeActionBar = function () {
            var bar = widget._addActionBar;
            bar.removeClass("editing");
            bar.find('.text').html(fc.translation(widget.options.addTextKey));
            bar.find('.add').show();
            var addTemplate = bar.find(addTemplate);
            addTemplate.hydrate('clear');
            widget._closeItem(bar);
        };
        widget._addActionBar.find(".action-cancel-add").text(fc.translation("Cancel"))
            .click(
            function () {
                widget._addActionBar.closeActionBar();
            }
        );
        widget._buildSaveCsSubmit(widget._addActionBar.find(".action-save-add"), widget._addActionBar, widget._addActionBar.closeActionBar, true);
        widget._addActionBar.find(".main").append(addTemplate);
        widget._addActionBar.find(".action-save-add .ui-button-text").attr("automation-id", widget.options.saveAddTextKey);
        container.prepend(widget._addActionBar);
    },
    itemContainer: null,
    setData: function (items) {
        var widget = this;
        if (widget.options.allowAdd) {
            if (!widget._addActionBar) {
                widget.createAddBar();
            }
            widget._addActionBar.show();
        } else {
            if (widget._addActionBar) {
                widget._addActionBar.hide();
            }
        }

        //  if add form is open
        if (widget._addActionBar) {
            if (widget._addActionBar.hasClass("open")) {
                widget._addActionBar.closeActionBar();
            }
        }

        widget.options.items = items;
        var container = widget.itemContainer;

        if (widget.options.items && widget.options.items.length > 0) {
            container.html('');
            var item;
            for (var i = 0; i < widget.options.items.length; i++) {
                item = widget.options.items[i];
                widget._buildItemDisplay(item);
            }
        } else {
            if (widget.options.showEmptyMessage){
                container.html('<div class="message-container rounded"><div class="message">'+ (widget.options.noItemsMsgKey ? fc.translation(widget.options.noItemsMsgKey) : fc.translation("Msg_NoItems")) +'</div></div>');
            } else {
                container.html('');
            }
        }

    },
    _buildSaveCsSubmit: function (buttonElement, container, afterClose, isAdd, item) {
        var widget = this;
        if (!isAdd) {
            isAdd = false;
        }
        var saveConfig =
        {
            causesValidation: true,
            container: container,
            makeButtonYellow: true,
            getValuesFromContainerOnSubmit: true,
            buildDataObject: function () {
                if (item) {
                    return item;
                }
            },
            close: function (event, data) {
                data.isAdd = isAdd;
                var newItems;
                if (widget.options.saveCsSubmitConfig.handleAfterSuccess) {
                    newItems = widget.options.saveCsSubmitConfig.handleAfterSuccess(data);
                } else {
                    newItems = data.inputData;
                }
                if (!widget.options.items) {
                    widget.options.items = [];
                }
                if (fc.isArray(newItems)) {
                    $.each(newItems, function (index, item) {
                        fc.addOrRefreshInCollection(widget.options.items, item, widget.options.itemKeyProperty);
                    });
                } else {
                    if (newItems) {
                        fc.addOrRefreshInCollection(widget.options.items, newItems, widget.options.itemKeyProperty);
                    }
                }
                if (newItems) {
                    widget.setData(widget.options.items);
                }
                if (!isAdd) {
                    var itemElement = $('[item-content-id="' + item[widget.options.itemKeyProperty] + '"]');

                    if (itemElement.closest('.detail-item').hasClass('closed')) {
                        widget._toggleItem(itemElement);
                    }
                }
                if (buttonElement.data('uiCsSubmit')) {
                    buttonElement.csSubmit("option", "dataObject", null);
                }
                container.hydrate("clear");
                if (afterClose) {
                    afterClose();
                }
            }
        };

        $.extend(saveConfig, widget.options.saveCsSubmitConfig);
        var buttonText = (widget.options.saveAddTextKey && isAdd) ? fc.translation(widget.options.saveAddTextKey) : fc.translation("SaveTitle");
        buttonElement.text(buttonText)
            .csSubmit(saveConfig);
    },
    _buildDeleteCsSubmit: function (buttonElement, item) {
        var widget = this;
        var deleteConfig =
        {
            icons: { primary: "ui-icon-trash" },
            confirmData: item,
            stylizeButton: false,
            causesValidation: false,
            container: buttonElement,
            makeButtonYellow: false,
            getValuesFromContainerOnSubmit: false,
            buildDataObject: function () {
                return { id: item[widget.options.itemKeyProperty] };
            },
            close: function (event, data) {
                var deletedItem = widget.options.deleteConfig.handleAfterSuccess(data, item);
                if (deletedItem) {
                    fc.addOrRefreshInCollection(widget.options.items, deletedItem, widget.options.itemKeyProperty);
                    widget.setData(widget.options.items);
                } else {
                    widget.removeByKeyProperty(item[widget.options.itemKeyProperty]);
                }
                if (widget.options.deleteConfig.handleAfterRemove) {
                    widget.options.deleteConfig.handleAfterRemove(widget.options.items);
                }
            }
        };
        $.extend(deleteConfig, widget.options.deleteConfig);
        buttonElement.csSubmit(deleteConfig);
    },
    removeByKeyProperty: function(key){
        var widget = this;
        var item = fc.findItemByPropertyValue(widget.options.items, widget.options.itemKeyProperty, key);
        if (item){
            fc.removeFromCollectionByProperty(widget.options.items, item, widget.options.itemKeyProperty);
            widget.setData(widget.options.items);
        }
    },
    _refreshItem: function(item, itemElement){

    },
    _buildItemDisplay: function (item) {
        var widget = this;
        var html = [];

        var canEditItem = true;
        var canDeleteItem = false;
        if (item.hasOwnProperty("canEdit")) {
            canEditItem = item.canEdit;
        } else {
            if (widget.options.hasOwnProperty("allowEdit")) {
                canEditItem = widget.options.allowEdit;
            }
        }
        var canEdit = canEditItem;

        if (item.hasOwnProperty("canDelete")) {
            canDeleteItem = item.canDelete;
        } else {
            if (widget.options.hasOwnProperty("allowDelete")) {
                canDeleteItem = widget.options.allowDelete;
            }
        }
        var canDelete = canDeleteItem;
        html.push("<div item-id='" + item[widget.options.itemKeyProperty] + "' class='detail-item rounded closed ");

        if (!widget.options.itemsCanOpen) {
            html.push("cant-open ");
            if (!widget.options.customItemClick) {
                html.push("not-clickable ");
            }
        }
        if (widget.options.customClasses){
            html.push(widget.options.customClasses);
        }
        html.push("'>");
        html.push("<div class='head rounded clearfix'>");
        if (widget.options.itemsCanOpen) {
            html.push("<div class='item-arrow' automation-id='sharingArrow'></div>");
        }
        var itemDisplay = widget.options.buildItemDisplay(item);
        if (widget.options.generateAutomationId) {
            /*if($(itemDisplay).is("div")) {
                itemDisplay = $(itemDisplay);
                itemDisplay.attr('automation-id', (item.name || item.id));
                html.push("<div class='text'>");
            } else {*/
                html.push("<div class='text' automation-id='" + (item.name || item.id) + "'>");
            //}
        }
        var el = $("<div></div>");
        el.append(itemDisplay);
        html.push(el.html());
        html.push("</div>");
        if (canDelete) {
            html.push("<div class='trash action rounded'" + (widget.options.generateAutomationId ? " automation-id='trash" + (item.name || item.id) + "'" : "") + "></div>");
        }
        html.push("</div>");
        html.push("<div class='open-content' style='display:none;' item-content-id='" + item[widget.options.itemKeyProperty] + "'>");
        html.push("<div class='main has-dialog-footer' style='position: relative'>");
        html.push("</div>");

        // setup footer buttons below
        if (canEdit) {
            html.push("<div class='detail-item-footer view-mode'>");
            if (widget.options.extraFormButtons) {
                $.each(widget.options.extraFormButtons, function (index, buttonOptions) {
                    if (buttonOptions.buttonShow(item)) {
                        html.push("<div class='form-button item-form-" + index + "'></div>");
                    }
                });
            }
            html.push("<div class='edit'></div>");
            html.push("</div>");
            html.push("<div class='detail-item-footer edit-mode'>");
            html.push("<a class='action-cancel-edit' automation-id='actionCancelEdit'></a>");
            html.push("<div class='action-save-edit' automation-id='actionSaveEdit'></div>");
            html.push("</div>");
            if (widget.options.extraFormButtons) {
                $.each(widget.options.extraFormButtons, function (index, buttonOptions) {
                    if (!buttonOptions.noForm && buttonOptions.buttonShow(item)) {
                        html.push("<div class='detail-item-footer form-mode item-form-" + index + "'>");
                        html.push("<a class='action-cancel-form' automation-id='actionCancelForm" + index + "'></a>");
                        html.push("<div class='action-save-form' automation-id='actionSaveForm" + index + "'></div>");
                        html.push("</div>");
                    }
                });
            }
        } else if (widget.options.extraFormButtons) {
            $.each(widget.options.extraFormButtons, function (index, buttonOptions) {
                if (buttonOptions.buttonShow(item)) {
                    html.push("<div class='detail-item-footer view-mode'>");
                    html.push("<div class='form-button item-form-" + index + "'></div>");
                    html.push("</div>");
                    if (!buttonOptions.noForm) {
                        html.push("<div class='detail-item-footer form-mode item-form-" + index + "'>");
                        html.push("<a class='action-cancel-form' automation-id='actionCancelForm" + index + "'></a>");
                        html.push("<div class='action-save-form' automation-id='actionSaveForm" + index + "'></div>");
                        html.push("</div>");
                    }
                }
            });
        }

        html.push("</div>");
        html.push("</div>");
        var itemElement = $(html.join(''));
        widget.itemContainer.append(itemElement);
        var viewTemplate = $(widget.options.viewTemplateSelector).children().clone();
        viewTemplate.hydrate(item);
        itemElement.find(".main").append(viewTemplate);
        if (item.selected) {
            widget._toggleItem(itemElement);
        }

        if (canEdit) {
            itemElement.find(".open-content").addClass("has-footer");
            var editTemplate = $(widget.options.editTemplateSelector).children().clone();
            itemElement.find(".main").append(editTemplate);
            itemElement.find(".edit").csButton({ label: fc.translation("EditTitle") })
                .click(
                function () {
                    if (widget.options.beforeEditHydrate) {
                        widget.options.beforeEditHydrate(editTemplate, item);
                    }
                    editTemplate.hydrate(item);
                    if (widget.options.editClicked) {
                        widget.options.editClicked(editTemplate, item);
                    }
                    editTemplate.show();
                    viewTemplate.hide();
                    itemElement.find(".detail-item-footer.edit-mode").show();
                    itemElement.find(".detail-item-footer.view-mode").hide();
                }
            );
            if (widget.options.beginEdit) {
                editTemplate.hydrate(item);
                viewTemplate.hide();
                itemElement.find(".detail-item-footer.edit-mode").show();
                itemElement.find(".detail-item-footer.view-mode").hide();
                editTemplate.css("display", "block");
                viewTemplate.css("display", "none");
            } else {
                viewTemplate.css("display", "block");
                editTemplate.css("display", "none");
                itemElement.find(".detail-item-footer.edit-mode").hide();
                itemElement.find(".detail-item-footer.view-mode").show();
            }
            itemElement.find(".action-cancel-edit").text(fc.translation("CancelTitle"))
                .click(
                function () {
                    editTemplate.hide();
                    viewTemplate.show();
                    itemElement.find(".detail-item-footer.edit-mode").hide();
                    itemElement.find(".detail-item-footer.view-mode").show();
                    editTemplate.hydrate('clear');
                }
            );
        }
        // added new code for archive link button , have to make it better


        if (widget.options.extraFormButtons) {
            itemElement.find('.form-mode').hide();

            var showHideForm = function (form, button, hide, options) {
                    if (hide) {
                        // form elements
                        form.hide();
                        if (options.buttonShow(item))
                        {
                            button.show();
                        } else {
                            button.hide();
                        }
                        // view elements
                        itemElement.find(".detail-item-footer.view-mode").show();
                        viewTemplate.show();
                        itemElement.find(".detail-item-footer.form-mode").hide();
                        if(widget.options.onOpen){
                            widget.options.onOpen(itemElement, false);
                        }
                    } else {
                        // view elements
                        viewTemplate.hide();
                        itemElement.find(".detail-item-footer.view-mode").hide();
                        // form elements
                        button.hide();
                        form.show();
                        itemElement.find(".detail-item-footer.form-mode").show();
                    }
            }
            $.each(widget.options.extraFormButtons, function (index, buttonOptions) {
                if (buttonOptions.buttonShow(item)) {
                    itemElement.find(".open-content").addClass("has-footer");

                    if (buttonOptions.noForm && buttonOptions.buttonSubmitConfig) { // button has no related form, just a service submit button
                        // Merge submit options
                        var mergedOptions = $.extend({
                            container: itemElement,
                            getValuesFromContainerOnSubmit: false,
                            causesValidation: false,
                            buildDataObject: function () {
                                if (item) {
                                    if (buttonOptions.buttonSubmitConfig.objectHelper){
                                        return buttonOptions.buttonSubmitConfig.objectHelper(item);
                                    } else {
                                        return item;
                                    }
                                }
                            },
                            close: function(event, data) {
                                var updatedItem = item;
                                if (buttonOptions.buttonSubmitConfig.handleAfterSuccess) {
                                    updatedItem = buttonOptions.buttonSubmitConfig.handleAfterSuccess(data, item);
                                }
                                //widget._buildItemDisplay(updatedItem);
                                itemElement.hydrate(item);
                                $(this).csButton({ label: fc.translation(buttonOptions.getButtonKey(item)) });
                            }
                        }, buttonOptions.buttonSubmitConfig);
                        itemElement.find(".form-button.item-form-" + index)
                            .csButton({ label: fc.translation(buttonOptions.getButtonKey(item)) })
                            .csSubmit(mergedOptions);
                    } else { // button has a related form to show
                        var formTemplate = $(buttonOptions.formTemplateSelector).children().clone().addClass('form-mode').hide();
                        itemElement.find(".main").append(formTemplate);

                        // setup form reveal button
                        var formRevealButton = itemElement.find(".form-button.item-form-" + index)
                            .csButton({ label: fc.translation(buttonOptions.getButtonKey(item)) })
                            .click(function () {
                                formTemplate.hydrate('clear');
                                buttonOptions.buttonAction(formTemplate, item);
                                showHideForm(formTemplate, $(this), null, buttonOptions);
                                });

                        // setup form submit button
                        var submitConfig = {
                            container: formTemplate,
                            successAction: {
                                key: "ContinueAction",
                                click: function(data) {
                                    if (buttonOptions.formSuccessAction) {
                                       item = buttonOptions.formSuccessAction(item, data);
                                    }
                                    viewTemplate.hydrate('clear');
                                    viewTemplate.hydrate(item);
                                    showHideForm(formTemplate, formRevealButton, true, buttonOptions);
                                }
                            }
                        };
                        $.extend(submitConfig, buttonOptions.formSubmitConfig);
                        var footer = itemElement.find(".detail-item-footer.form-mode");
                        footer.find('.action-save-form').text(fc.translation(buttonOptions.submitKey)).csSubmit(submitConfig);

                        // setup form cancel button
                        var footer = itemElement.find(".detail-item-footer.form-mode");
                        footer.find(".action-cancel-form").text(fc.translation("CancelTitle"))
                            .click(function () {
                                showHideForm(formTemplate, formRevealButton, true, buttonOptions);
                            });
                    }
                }
            });
        }
        // item.element = html;
        widget._buildSaveCsSubmit(itemElement.find(".action-save-edit"), itemElement, null, null, item);
        widget._buildDeleteCsSubmit(itemElement.find('.trash'), item);
    },
    _addActionBar: null,
    _closeItem: function (source) {
        var itemElement = $(source).closest('.detail-item');

        if (itemElement.hasClass("open")) {
            itemElement.find(".open-content").slideUp("fast", function () {
                $(this).hide();
                itemElement.removeClass("open");
                itemElement.addClass("closed");
            });
        }

        // clear out any search boxes
        itemElement.find('.search-wrapper input[type=text]').val('');

    },
    _toggleItem: function (source, force) {
        var widget = this;
        var itemElement = $(source).closest('.detail-item');

        if (itemElement.hasClass("closed")) {
            if (widget.options.onOpen) {
                widget.options.onOpen(itemElement, itemElement.hasClass('add-bar'));
            }
            itemElement.removeClass("closed");
            itemElement.addClass("open");

            if ($.support.style) {
                itemElement.find(".open-content").slideDown("fast");
            } else {
                itemElement.find(".open-content").show();
            }
        } else {
            this._closeItem(source);
        }
    },
    options: {
        cloneTemplates: true,
        addTextKey: null,
        addOpenTextKey: null,
        saveAddTextKey: null,
        allowDelete: false,
        allowEdit: true,
        allowAdd: true,
        beginEdit: false,
        items: null,
        itemKeyProperty: "id",
        addTemplateSelector: null,
        viewTemplateSelector: null,
        editTemplateSelector: null,
        saveCsSubmitConfig: {},
        itemsCanOpen: true,
        buildItemDisplay: null, // function that returns the string to display in the closed state
        extraFormButtons: null,
        noItemsMsgKey: null,
        showEmptyMessage: true,
        customClasses: null,
        customItemClick: null,
        generateAutomationId: null
    }
};
$.widget("ui.csDetailItems", CropSenseDetailItems);

$.fn.addForceOnTop = function () {
    $(this).parents().each(function () {
        var parent = $(this);
        var pos = parent.css("position");

        // If it's positioned,
        if (pos == "relative" ||
            pos == "absolute" ||
            pos == "fixed") {
            parent.addClass("force-top");
        }
    });
};

$.fn.removeForceOnTop = function () {
    $(this).parents().each(function () {
        var parent = $(this);
        var pos = parent.css("position");

        // If it's positioned,
        if (pos == "relative" ||
            pos == "absolute" ||
            pos == "fixed") {
            parent.removeClass("force-top");
        }
    });
};

var CropSenseOptionShower = {
    _create: function () {
        var target = $(this.element);
        target.addClass("has-options");
        target.button({ icons: { secondary: "ui-icon-triangle-1-s"} });
        var optionsContainer = $(this.options.container);
        optionsContainer.addClass("options-box")
            .addClass("ui-corner-bl")
            .addClass("ui-corner-br");

        var thisWidget = this;
        target.click(
            function (event) {
                event.stopPropagation();
                if (thisWidget.isdisabled) { return; }
                if (optionsContainer.is(":visible")) {
                    thisWidget.close();
                } else {
                    //make sure others are closed
                    $('.has-options.opened').csOptionShower('close');
                    thisWidget.open();
                    target.addClass("opened");
                }
            }
        );
        optionsContainer.click(
            function (event) {
                event.stopPropagation();
            }
        );
        var hoverOn = function () {
            if (!thisWidget.options.restyleOnHover) {
                $(this).removeClass("ui-state-hover");
            }
        }
        var hoverOff = function () {
        }
        target.hover(hoverOn, hoverOff);
    },
    isdisabled: false,
    enable: function () {
        this.isdisabled = false;
        this.element.find(".ui-icon").show();
    },
    disable: function () {
        this.isdisabled = true;
        this.element.find(".ui-icon").hide();
    },
    open: function () {
        var optionsContainer = $(this.options.container);
        var target = $(this.element);
        var widget = this;
        var borderRadius = parseInt(target.css("border-bottom-left-radius"), 10);
        if (!optionsContainer.is(":visible") && !this.isOpen) {
            target.addClass("opened");
            this.isOpen = true;
            var left = Math.round(target.position().left + parseInt(target.css('margin-left'), 10));
            var leftPadding = parseInt(optionsContainer.css('padding-left'), 10);
            var rightPadding = parseInt(optionsContainer.css('padding-right'), 10);
            var top = target.position().top + target.outerHeight() // - document.documentElement.scrollTop
                - parseInt(target.css("border-bottom-width"), 10);

            var parentRight = parseInt(optionsContainer.parent().css("padding-right"), 10)
                - parseInt(optionsContainer.parent().css("border-right-width"), 10);
            var right = parseInt(target.css('border-right-width'), 10) + parentRight;

            optionsContainer.css('position', 'absolute').css('top', top).css('left', left)
                .css('padding-top', borderRadius).css('z-index', "20000")
                .css("background-color", target.css("background-color"))
                .css("border-color", target.css("border-top-color"));
            //.css('right', right);
            var borderLeft = parseInt(optionsContainer.css("border-left-width"), 10);
            var borderRight = parseInt(optionsContainer.css("border-right-width"), 10);

            if (widget.options.forceTop){
                optionsContainer.addForceOnTop();
            }


            window.setTimeout(function () {
                optionsContainer.focus();
            },0);


            if (target.hasClass("rounded")) {
                widget.options.rounded = true;
                target.removeClass("rounded");
            }
            target.removeClass("ui-corner-all");

            target.addClass("ui-corner-tr").addClass("ui-corner-tl").addClass("no-bottom-border");
            optionsContainer.slideToggle(null, function(){
                if (widget.options.afterOpen){
                    widget.options.afterOpen(optionsContainer);
                }
            });


            var totalTargetWidth = target.width() + parseInt(target.css("padding-left"), 10)
                + parseInt(target.css("padding-right"), 10);
            var calculatedWidth = totalTargetWidth - leftPadding - rightPadding; // -borderLeft - borderRight;
            if (optionsContainer.width() < calculatedWidth) {
                //make them the same width
                optionsContainer.css('min-width', calculatedWidth);
            }

            widget._trigger("open", null, null);
        }
    },
    isOpen: null,
    close: function () {
        var optionsContainer = $(this.options.container);
        var target = $(this.element);
        var widget = this;
        if (this.isOpen && !optionsContainer.hasClass("hovered") && !target.hasClass("hovered") && optionsContainer.is(":visible")) {
            this.isOpen = false;
            optionsContainer.slideToggle(
                function () {
                    target.addClass("ui-corner-all");
                    target.removeClass("ui-corner-tr").removeClass("ui-corner-tl").removeClass("no-bottom-border");
                    target.removeClass("opened");
                    if (widget.options.rounded) {
                        target.addClass("rounded");
                    }
                }
            );
            if (widget.options.forceTop){
                optionsContainer.removeForceOnTop();
            }
        }
    },
    options: {
        elements: {},
        container: {},
        restyleOnHover: true,
        beforeopen: null,
        afterOpen: null,
        rounded: false,
        forceTop: true
    }
};
$.widget("ui.csOptionShower", CropSenseOptionShower);

var CropSenseSelector = {
    _create: function () {
        var widget = this;
        var container = this.element;
        container.addClass("is-selector");
        var selectionsContainer;
        if (widget.options.dropdown) {
            selectionsContainer = $("<div></div>");
            var selectionsContainerId = container.attr('id') + "_selections";
            selectionsContainer.attr('id', selectionsContainerId);
            this.options.selectionsContainer = selectionsContainer;

            if (this.options.filterOptions || this.options.canSearch) {
                var wrapper = $("<div style='display:none;'></div>");
                container.parent().append(wrapper);
                wrapper.append(selectionsContainer);
                widget.filterWrapper = $("<div class='selector-filter-wrapper'></div>").prependTo(wrapper);
                container.csOptionShower({ container: wrapper, afterOpen: widget.options.afterDropDown, forceTop: widget.options.forceTop });
            } else {
                container.parent().append(selectionsContainer);
                selectionsContainer.hide();
                container.csOptionShower({ container: selectionsContainer, afterOpen: widget.options.afterDropDown, forceTop: widget.options.forceTop });
            }

            container.addClass("clipped");
        } else {
            selectionsContainer = this.options.selectionsContainer = container;
            container.addClass("options-box");
            if (this.options.filterOptions || this.options.canSearch) {
                var wrapper = $("<div></div>");
                container.parent().append(wrapper);
                wrapper.append(selectionsContainer);
                widget.filterWrapper = $("<div class='selector-filter-wrapper'></div>").prependTo(wrapper);
            }
        }

        if (widget.options.wrap){
            selectionsContainer.addClass('wrap');
        }

        if (widget.options.radioCheckBoxes) {
            if (widget.options.multiselect) {
                container.addClass("checkbox-selector");
            } else {
                container.addClass("radio-selector");
            }
        }
        if (widget.options.multiselect) {
            selectionsContainer.addClass("multiselect");
        }
        if (widget.options.scrollToSelection) {
            container.bind("open",
               function () {
                   alert('done');
               }
            );
        }
        if (widget.options.filterOptions) {
            var filterElement = $('<div></div>').appendTo(widget.filterWrapper);
            var selectionOptions = {
                container: selectionsContainer,
                childSelector: ".selection"
            };
            var options = $.extend(selectionOptions, widget.options.filterOptions);
            filterElement.csFilterButtons(options);
        }
        if (widget.options.canSearch) {
            var searchWrapper = $('<div class="selector-search"> <input type="text" class="search-items" /> </div>');
            widget.filterWrapper.append(searchWrapper);
            searchWrapper.find('input').csSearch({
                containerSelector: selectionsContainer,
                childSelector: widget.options.searchChildSelector,
                searchAll: true,
                hideParentWhenEmpty: true,
                afterSearchComplete: function (event, data) {
                    selectionsContainer.find('.title').each(
                        function (index, title) {
                            var parent = $(title);
                            var group = parent.closest('.group');
                            var groupChildSelector = widget.options.searchGroupChildSelector || widget.options.searchChildSelector;
                            var groupItems = group.find(groupChildSelector);
                            var hidden = group.find(groupChildSelector).filter('.search-hidden');
                            var titleName = parent.text();
                            var searchMatchesField = (titleName && titleName.toLowerCase().indexOf(data.filter.toLowerCase()) > -1);

                            if (!searchMatchesField && data.filter) {
                                if (groupItems.length === hidden.length) {
                                    group.hide();
                                    parent.hide();
                                } else {
                                    parent.show();
                                    parent.removeClass('search-hidden');
                                }
                            } else {
                                parent.show();
                                group.show();
                                group.find(widget.options.searchChildSelector).removeClass('search-hidden').show();
                            }
                        });
                }

            });
        }
        this.refresh();
    },
    val: function (id) {
        var widget = this;
        return widget.selectedid(id);
    },
    clear: function (id) {
        var widget = this;
        if (widget.defaultSelection) {
            widget.selectbyid(widget.defaultSelection.id);
        } else {
            var selectionsContainer = this.options.selectionsContainer;
            selectionsContainer.find('.selection').removeClass("selected");
            if (widget.options.radioCheckBoxes) {
                selection.find('input').prop('checked', false);
            }
            widget.options.selectedId = null;
        }
    },
    selectbyid: function (id) {
        var master = this;

        // handle multiple id string in CSV format
        if ( typeof( id ) === 'string' && id.indexOf( ',' ) > 0 ) {
            _.each( id.split( ',' ), function ( newId ) {
                master.selectbyid( newId );
            } );
        }

        if (!id) {
            if (master.defaultSelection) {
                id = master.defaultSelection.id;
            } else {
                this.refresh();
                return;
            }
        }
        var selectionsContainer = this.options.selectionsContainer;
        var item = selectionsContainer.find("[data-val='" + id + "']");
        if (item) {
            master.changed(item);
        }
    },
    disable: function () {
        if (this.options.dropdown) {
            this.element.csOptionShower("disable");
        } else {
            this.isdisabled = true;
            if (this.options.radioCheckBoxes) {
                this.options.selectionsContainer.find('.selection input')
                    .prop("disabled", true);
            }
        }
    },
    enable: function () {
        if (this.options.dropdown) {
            this.element.csOptionShower("enable");
        } else {
            this.isdisabled = false;
            if (this.options.radioCheckBoxes) {
                this.options.selectionsContainer.find('.selection input')
                    .prop("disabled", false);
            }
        }
    },
    isdisabled: false,
    defaultSelection: null,
    _loadGroup: function (group) {
        var master = this;
        var selectionsContainer = this.options.selectionsContainer;
        if (!this.options.dataById) {
            this.options.dataById = {};
        }
        var dataDictionary = this.options.dataById;
        var hasSelected = false;
        var selections = $('<div class="group"></div>');

        // show parents
        if (this.options.modifyGroup) {
            this.options.modifyGroup(selections, group);
        }
        if (group.parent) {
            selections.attr("group-id", group.parent.id);
            selections.attr("group-title", group.parent.name);
            if (group.parent.selectable) {
                var titleSelection = $.extend({ isTitle: true }, group.parent);
                group.items.splice(0, 0, titleSelection);
            } else {
                var parent = $("<span class='title"
                    + (group.parent.searchable ? " searchable" : "")
                    + "' data-val='" + group.parent.id + "'>" + group.parent.name + "</span>");
                selections.append(parent);
            }
        }
        var parent = group.parent;
        var items = group.items;
        $.each(items,
            function (index, dataItem) {

                var selection;
                selection = $("<span class='selection" + (dataItem.isTitle ? " title" : "") + "'></span>");
                if (dataItem.elementId) {
                    selection.attr('id', dataItem.elementId);
                }
                if (dataItem.selectionStyle) {
                    selection.css(dataItem.selectionStyle);
                }
                if (dataItem.selectionClass) {
                    selection.addClass(dataItem.selectionClass);
                }
                if (dataItem.disabled) {
                    selection.addClass("disabled");
                }
                if (dataItem.hoverTitleKey){
                    selection.attr("title", fc.translation(dataItem.hoverTitleKey));
                } else if (dataItem.hoverTitle){
                    selection.attr("title", dataItem.hoverTitle);
                }
                if (master.options.radioCheckBoxes) {
                    inputElement = $("<input type='"
                        + (master.options.multiselect ? "checkbox" : "radio") +
                        "' name='" + master.options.radioCheckBoxes + "'  />");
                    selection.append(inputElement);
                }
                selection.append(dataItem[master.options.nameProperty]);
                if (master.options.showDescription) {
                    var descripto = [];
                    descripto.push("<span class='description'>");
                    descripto.push("" + master.options.buildItemDescription(dataItem) + "");
                    descripto.push("</span>");
                    selection.append($(descripto.join('')));
                }
                selection.attr("data-val", dataItem.id);
                if(master.options.datalayers){
                    selection.attr("automation-id", parent.name + ":" + dataItem[master.options.nameProperty]);
                }   else{
                    selection.attr("automation-id", master.options.automationIdPrefix ? master.options.automationIdPrefix + dataItem[master.options.nameProperty] : dataItem[master.options.nameProperty]);
                }

                if (dataItem.selected) {
                    selection.addClass("selected");
                    master.defaultSelection = dataItem;
                    hasSelected = true;
                    master.options.selectedId = dataItem.id;
                }
                selection.click(
                    function (e) {
                        if (master.isdisabled) { return; }
                        // var selection = $(e.target);
                        master.changed(selection);
                        var data;

                        if (master.options.hierarchical) {
                            var selectedProp = master._getSelectedItem(selection, true);
                            data = { selectedItem: selectedProp.selectedItem, selected: selection.hasClass("selected"), selectedGroup: selectedProp.selectedGroup };
                        } else {
                            var selectedItem = master._getSelectedItem(selection);
                            data = { selectedItem: selectedItem, selected: selection.hasClass("selected") };
                        }
                        master._trigger("click", null, data);
                    }
                );
                selections.append(selection);
                if (master.options.modifyItem) {
                    master.options.modifyItem(selection, dataItem);
                }
                dataDictionary[dataItem.id] = dataItem;
            }
        );
        selectionsContainer.append(selections);

        return hasSelected;
    },
    changed: function (selection) {
        if (selection.hasClass('disabled')) { return; }
        var master = this;
        var selectionsContainer = this.options.selectionsContainer;
        var selected = false;
        if (master.options.multiselect) {
            if (selection.hasClass("selected")) {
                selection.removeClass("selected");
                selection.find('input').prop('checked', false);
            } else {
                selection.addClass("selected");
                selected = true;
                selection.find('input').prop('checked', selected);
            }
        } else {
            var deselecting = (master.options.canDeselect && selection.hasClass("selected"));
            var selections = selectionsContainer.find('.selection').removeClass("selected");
            if (master.options.radioCheckBoxes) {
                selections.find('input').prop('checked', false);
            }
            if (!deselecting) {
                selection.addClass("selected");
                selected = true;
                if (master.options.changelabel) {
                    if (master.options.hierarchical) {
                        var groupTitle = selection.closest('.group').attr("group-title");
                        var itemLabel = selection.text();
                        var newLabel = "<span><strong>" + groupTitle + "</strong></span> | <span>" + itemLabel + "</span>";
                        var string = groupTitle + " | " + itemLabel;
                        master.element.attr('alt', string).attr('title', string).find('.ui-button-text').html(newLabel);
                    } else {
                        master.element.attr('alt', selection.text()).attr('title', selection.text()).find('.ui-button-text').text(selection.text());
                    }
                }
                if (master.options.radioCheckBoxes) {
                    selection.find('input').prop('checked', true);
                }
            } else {
                if (master.options.unselected) {
                    master.element.find('.ui-button-text').text(master.options.unselected);
                }
            }
        }
        if (!master.options.multiselect && this.options.dropdown) {
            master.element.csOptionShower("close");
        }
        var selectedItem = master._getSelectedItem(selection);
        if (selectedItem) {
            if (selectedItem.onchange) {
                selectedItem.onchange(selected);
            }
            if (selected) {
                master.options.selectedId = selectedItem.id;
            } else {
                master.options.selectedId = null;
            }
            master._trigger("change", null, { selectedItem: selectedItem, selected: selection.hasClass("selected") });
        }
    },
    _getSelectedItem: function (selection, includeGroup) {
        var widget = this;
        var selectedId = selection.attr("data-val");
        var items = this.options.data;
        var selectedItem;
        var selectedGroup;
        if (items) {

            if (widget.options.hierarchical) {
                var itemsObject = this.options.data;
                groupId = selection.closest('.group').attr('group-id');
                items = [];
                for (var i = 0; i < itemsObject.length; i++) {
                    var group = itemsObject[i];
                    if (group.parent.id == groupId) {
                        $.extend(items, group.items);
                        selectedGroup = group.parent;
                        i = itemsObject.length;
                    }
                }
            } else if (fc.isArray(items[0])) {
                var groupedItems = this.options.data;
                items = [];
                $.each(groupedItems,
                    function (index, group) {
                        items = items.concat(group);
                    }
                );
            }
            selectedItem = fc.findItemByPropertyValue(items, "id", selectedId);
        }
        if (includeGroup) {
            return { "selectedItem": selectedItem, "selectedGroup": selectedGroup };
        } else {
            return selectedItem;
        }
    },
    loaddata: function (data) {
        this.options.data = data;
        this.refresh();
    },
    refresh: function () {
        var selectionsContainer = this.options.selectionsContainer;
        selectionsContainer.html('');

        var dataOptions = this.options.data;
        var master = this;
        if (dataOptions) {
            var hasSelected = false;
            if (master.options.allKey) {
                var tempItem = { id: "" };
                tempItem[master.options.nameProperty] = fc.translation(master.options.allKey);
                if (fc.isArray(dataOptions[0])) {
                    dataOptions[0].splice(0, 0, tempItem);
                } else {
                    dataOptions.splice(0, 0, tempItem);
                }
            }
            if (master.options.hierarchical) {
                $.each(dataOptions,
                    function (index, group) {
                        if (master._loadGroup(group, index)) {
                            hasSelected = true;
                        }
                    }
                );
            } else if (fc.isArray(dataOptions[0])) {
                $.each(dataOptions,
                    function (index, group) {
                        if (master._loadGroup({ items: group })) {
                            hasSelected = true;
                        }
                    });
            } else {
                hasSelected = master._loadGroup({ items: dataOptions });
            }


            if (!hasSelected) {
                if (master.options.unselected) {
                    master.element.find('.ui-button-text').text(master.options.unselected);
                    master.options.selectedId = null;
                } else if (dataOptions.length > 0 && master.options.selectFirstByDefault) {
                    master.defaultSelection = dataOptions[0];
                    master.selectbyid(dataOptions[0].id);
                } else {
                    master.options.selectedId = null;
                }
            } else {
                if (!master.options.multiselect && master.options.changelabel) {
                    master.element.find('.ui-button-text').text(master.defaultSelection.name);
                }
            }
            if (dataOptions.length === 0 && master.options.emptyMessageKey) {
                selectionsContainer.append($("<span class='message'>" + fc.translation(master.options.emptyMessageKey) + "</span>"));
            }
        }


        //}
    },
    deselect: function (id) {
        var selection = this.options.selectionsContainer.find("[data-val='" + id + "']");
        if (selection) {
            selection.removeClass("selected");
            if (this.options.radioCheckBoxes) {
                selection.find('input').prop('checked', false);
            }
        }
        if (this.options.selectedId == id) {
            this.options.selectedId = null;
        }

    },
    updatedSelections: function(){

    },
    savedSelections: [],
    disableSelections: function (selections, saveSelected) {
        var selector = this;
        var markDisabled = function (item) {
            if (!item.hasClass("disabled")) {
                item.addClass("disabled");
            }
            if (selector.options.radioCheckBoxes) {
                item.find('input').prop('disabled', true);
            }
        }

        if (selections === true) {
            selector.options.selectionsContainer
                .find('.selection:not(.disabled)')
                .each(function (index, item) {
                    markDisabled($(item));
                });
        } else {
            $.each(selections, function (index, selection) {
                var select = selector.options.selectionsContainer.find("[data-val='" + selection.id + "']");
                if (select.hasClass('selected') && saveSelected) { selector.savedSelections.push(selection); }

                // deselects selection before disabling
                selector.deselect(selection.id);
                markDisabled(select);
            });
        }

    },
    enableSelections: function (selections, reselectSaved) {
        var selector = this;
        var markEnabled = function (item) {
            if (item.hasClass("disabled")) {
                item.removeClass("disabled");
            }
            if (selector.options.radioCheckBoxes) {
                item.find('input').prop('disabled', false);
            }
        }

        if (selections === true) {
            selector.options.selectionsContainer
                .find('.selection')
                .each(function (index, item) {
                    markEnabled($(item));
                });
        } else {
            $.each(selections, function (index, selection) {
                var select = selector.options.selectionsContainer.find("[data-val='" + selection.id + "']");
                markEnabled(select);
            });
        }

        if (reselectSaved) {
            if (selector.savedSelections.length > 0) {
                $.each(selector.savedSelections,
                    function (index, selection) {
                        selector.selectbyid(selection.id);
                    });
                // Reset
                selector.savedSelections = [];
            }
        }
    },
    enableMultiSelect: function(){
        this.options.multiselect = true;
    },
    disableMultiSelect: function(){
        this.options.multiselect = false;
    },
    selectedid: function (id) {
        if (id) {
            this.selectbyid(id);
            return;
        }
        if (this.options.multiselect) {
            var ids = "";
            var selectionsContainer = this.options.selectionsContainer;
            var selections = selectionsContainer.find('.selection');
            var isFirst = true;
            selections.each(
                function (index, value) {
                    value = $(value);
                    if (value.hasClass("selected")) {
                        if (isFirst) {
                            isFirst = false;
                        } else {
                            ids += ","
                        }
                        ids += value.attr("data-val");
                    }
                }
            );
            return ids;
        } else {
            if (this.options.selectedId) {
                return this.options.selectedId;
            } else {
                return "";
            }
        }
    },
    close: function () {
        this.element.csOptionShower("close");
    },
    options: {
        data: [],
        multiselect: false,
        changelabel: true,
        unselected: null,
        dropdown: true,
        selectFirstByDefault: true,
        canDeselect: false,
        emptyMessageKey: null,
        nameProperty: "name",
        showDescription: false,
        buildItemDescription: null,
        radioCheckBoxes: null,
        hierarchical: false,
        canSearch: false,
        modifyItem: null,
        searchChildSelector: ".selection, .title.searchable",
        afterDropDown: null,
        filterOptions: null
    }

};
$.widget("ui.csSelectors", CropSenseSelector);

var CropSenseMoreButton = {
    _create: function () {
        var target = $(this.element);
        //target.button({ icons: { secondary: "ui-icon-triangle-1-s"} });
        target.button();
        var dialogContents = $(this.options.dialogContents);
        var thisWidget = this;
        target.click(
            function () {
                thisWidget.options.dialogContents.csDialog(thisWidget.options.dialogOptions);
            }
        );
    },
    options: {
        dialogContents: {},
        dialogOptions: {}
    }
};
$.widget("ui.csMoreButton", CropSenseMoreButton);

var CropSenseButton = {
    _create: function () {
        if (!this.element.attr("data-res-id") && !this.options.label) {
            this.options.text = false;
            if (this.options.titleKey)
            {
                this.element.text(fc.translation(this.options.titleKey));
            }
        }
        $.ui.button.prototype._create.call(this);
        this.element.find(".ui-button-text").attr("automation-id", (this.element.attr("id") || this.element.text()) + "Button");
    },
    updateText: function(text, hasText, title) {
        this.option("label", text);
        this.option("text", hasText);
        var toolTip = title ? title : text;
        this.element.attr("title", toolTip);
        this.element.find(".ui-button-text").attr("automation-id", this.element.attr("id") + "Button");
    },
    disable: function () {
        $.ui.button.prototype.disable.call(this);
    }
};
$.widget("ui.csButton", $.ui.button, CropSenseButton);

var CropSenseSubmitButton = {
    _create: function () {
        var widget = this;
        if (widget.options.stylizeButton) {
            this.element.csButton(widget.options);
        }
        if (widget.options.makeButtonYellow) {
            this.element.addClass("yellow");
        }
        if (!this.options.container) {
            alert("csSubmit must be provided a container");
        }
        if (!this.options.urlkey && !this.options.customSubmit) {
            alert("csSubmit must be provided a urlkey");
        }
        if (!widget.options.messageContainer) {
            widget.options.messageContainer = widget.options.container;
            widget.options.hasMessageContainer = false;
        } else {
            widget.options.hasMessageContainer = true;
        }
        if (widget.options.generateAutomationId) {
            this.element.attr("automation-id", (this.element.attr("id") || this.element.text()));
        }
        this.element.addClass("cs-submit");
        this.element.find(".ui-button-text").attr("automation-id", (this.element.attr("id") || this.element.text()) + "Button");
        this.element.click(
            function (event) {
                if (widget.options.stopEventPropagation) {
                    event.stopPropagation();
                }
                if (widget.options.preConfirm) {
                    if (!widget.options.preConfirm()) {
                        return;
                    }
                }
                if (widget.options.showConfirm) {
                    var onConfirmed = function (confirmed) {
                        if (confirmed) {
                            widget._submit();
                        }
                    };
                    var confirmData = (widget.options.confirmData) ? widget.options.confirmData : null;
                    var message = widget.options.confirmKey ? fc.translation(widget.options.confirmKey)
                        : widget.options.buildConfirmMessage(confirmData);
                    if (widget.options.customConfirm){
                        widget.options.customConfirm(onConfirmed, message);
                    } else {
                        var options;
                        if(widget.options.zIndex){
                            fc.confirm(onConfirmed, message, null, null, {zIndex: widget.options.zIndex}) ;
                        }else if (widget.options.generateAutomationId) {
                            fc.confirm(onConfirmed, message, false, widget.options.urlkey);
                        } else {
                            fc.confirm(onConfirmed, message);
                        }
                    }

                } else {
                    widget._submit();
                }
            }
        );
    },
    disable: function () {
        var widget = this;
        if (widget.options.stylizeButton) {
            this.element.csButton("disable");
        }
    },
    dataObject: function (obj) {
        if (!obj) { obj = null; }
        this.options.dataObject = obj;
    },
    _submit: function () {
        var widget = this;
        var container = widget.options.container;

        if (widget.options.causesValidation) {
            if (!container.validate(null, widget.options.additionalValidations)) {
                return;
            }
        }
        if (widget.options.buildDataObject) {
            widget.options.dataObject = widget.options.buildDataObject();
        }
        if (widget.options.dataObject == null) {
            widget.options.dataObject = {};
        }
        if (widget.options.getValuesFromContainerOnSubmit) {
            container.getValues(widget.options.dataObject);
        }
        if (widget.options.specialValidations) {
            if (!widget.options.specialValidations(widget.options.dataObject)) {
                return;
            }
        }
        if (widget.options.beforesend) {
            widget.options.beforesend(widget.options.dataObject);
        }
        var requestData = widget.options.dataObject;
        if (widget.options.transformForServer) {
            requestData = widget.options.transformForServer(requestData);
        }
        //alert(JSON.stringify(widget.dataObject));
        if (widget.options.showWait) {
            widget.options.messageContainer.csMessage({ messageKey: widget.options.waitTextKey,
                fillDialog: !widget.options.hasMessageContainer,
                generateAutomationId: true,
                automationIdPrefix: widget.element.attr("id")
            });
        }
        var onServerResponse = function (response) {
            widget.onServerResponse(response);
        }

        var options = (widget.options.postOptions ? widget.options.postOptions() : {});
        if (widget.options.showFailureMessage) {
            options.onResponseMessage = function (response) { };
        }
        if (widget.options.urlPageKey) {
            options.pageKey = widget.options.urlPageKey;
        }

        if (widget.options.customSubmit) {
            widget.options.customSubmit(widget.options.dataObject);
        } else {
            if (widget.options.post) {
                fc.post(widget.options.urlkey, widget.options.dataObject, onServerResponse, options);
            } else {
                fc.getWithData(widget.options.urlkey, widget.options.dataObject, onServerResponse, options);
            }
        }
    },
    messageOff: function () {
        var widget = this;
        widget.options.messageContainer.csMessage("off");
    },
    onServerResponse: function (response) {
        var widget = this;
         var onDone = function () {
            if (widget.options.showWait) {
                widget.options.messageContainer.csMessage("off");
            }
            if (response.success) {
                if (widget.options.showSuccessMessage) {
                    if(!response.warning) {
                        var imageUrl = "icon-success.png";
                        var message = widget.options.buildSuccessMessage ? widget.options.buildSuccessMessage(response) : fc.translation(widget.options.successTextKey);
                    } else {
                        var imageUrl = "info-icon-blue.png";
                        var message = fc.translation("WarningMessage");
                        if (response.messages) {
                            message += "  " + fc.compileErrorMessages(response);
                        }
                    }
                    if(response.data) {
                        response.data.warning = response.warning;
                    }
                    widget.options.messageContainer.csMessage( {
                            imageUrl: imageUrl,
                            message: message,
                            action: {
                                key: widget.options.successAction ? widget.options.successAction.key : "CloseAction",
                                click: function () {
                                    fc.queueCode(
                                        function () {
                                            widget.options.messageContainer.csMessage("off");
                                            var successObject = { inputData: widget.options.dataObject, responseData: response.data };
                                            if (widget.options.successAction) {
                                                widget.options.successAction.click(successObject);
                                            } else {
                                                widget._trigger("close", null, successObject);
                                            }
                                        }
                                    );
                                }
                            },
                            fillDialog: !widget.options.hasMessageContainer
                        }
                    );
                } else {
                    var successObject = { inputData: widget.options.dataObject, responseData: response.data };
                    if (widget.options.successAction) {
                        if(widget.options.successAction.click)   {
                            widget.options.successAction.click(successObject);
                        }else{
                            widget.options.successAction(successObject);
                        }
                    }else {
                        widget._trigger("close", null, successObject);
                    }
                }
                widget._trigger("success", null, response);
            }
            else {
                var successObject = { inputData: widget.options.dataObject, responseData: response.data };
                if (widget.options.showFailureMessage) {
                    var message = ( widget.options.failureTextKey == null ? "" : fc.translation(widget.options.failureTextKey) );
                    if (widget.options.buildFailureMessage) {
                        message += "  " + widget.options.buildFailureMessage(successObject);
                    } else {
                        if (response.messages) {
                            message += "  " + fc.compileErrorMessages(response);
                        }
                    }
                    widget.options.messageContainer.csMessage(
                        {
                            imageUrl: "icon-error.png",
                            message: message,
                            action: {
                                key: widget.options.failureActionKey,
                                click: function () {
                                    fc.queueCode(
                                        function () {
                                            widget.options.messageContainer.csMessage("off");
                                        }
                                    );
                                }
                            },
                            fillDialog: !widget.options.hasMessageContainer
                        }
                    );
                }
                widget._trigger("failure", null, response);
            }
        };
        if (widget.options.beforeDone) {
            widget.options.beforeDone(widget.options.dataObject, onDone);
        } else {
            onDone();
        }
    },
    updateText: function(text, hasText, title) {
        this.element.csButton( 'updateText', text, hasText, title );
    },
    options: {
        preConfirm: null,
        causesValidation: true,
        container: null,
        messageContainer: null,
        hasMessageContainer: false,
        dataObject: null,
        post: true,
        urlkey: null,
        makeButtonYellow: true,
        showWait: true,
        waitTextKey: "Msg_PleaseWaitSaving",
        showSuccessMessage: true,
        successTextKey: "SaveSuccess",
        buildSuccessMessage: null,
        showFailureMessage: true,
        failureTextKey: "SaveFailure",
        failureActionKey: "TryAgainAction",
        getValuesFromContainerOnSubmit: true,
        showConfirm: false,
        stylizeButton: true,
        additionalValidations: null,
        stopEventPropagation: false,
        postOptions: null,
        generateAutomationId: null
    }
};
$.widget("ui.csSubmit", CropSenseSubmitButton);

var CropSenseTextBox = {
    _create: function () {
        var target = $(this.element);
        var widget = this;
        target.val(widget.options.hintText)
            .addClass("hinted")
            .attr("data-hint", widget.options.hintText);
        target.focus(
            function () {
                var val = target.val();
                if (val === widget.options.hintText) {
                    widget.settingValue = true;
                    target.val('')
                        .removeClass("hinted");
                    widget.settingValue = false;
                }
            }
        );
        target.blur(
            function () {
                widget._checkEmpty();
            }
        );
        target.change(
            function () {
                if (widget.settingValue) { return; }
                widget._checkEmpty();
            }
        );
    },
    _checkEmpty: function () {
        var target = $(this.element);
        var val = target.val();
        if (!val) {
            this.settingValue = true;
            this._clear();
            this.settingValue = false;
        }
    },
    _clear: function () {
        var target = $(this.element);
        target.val(this.options.hintText)
            .addClass("hinted");
    },
    settingValue: false,
    options: {
        hintText: null
    }
};
$.widget("ui.csTextbox", CropSenseTextBox);

var CropSenseNavigation = {
    _create: function () {
        var widget = this;
        var target = $(this.element);
        if (widget.options.type == 'main') {
            target.addClass("nav-bar");
            target.after($("<div class='nav-bottom'></div>"));
            $.each(this.options.tabs,
                function (index, tabInfo) {
                    var tabString = "<div class='tab' automation-id='" + tabInfo.name + "'>"
                        /*+ "<div class='tab-left'></div>"
                        + "<div class='tab-center'>"
                        + "<div class='tab-content'>"*/
                        + tabInfo.name  +
                        /* "</div>"
                        + "</div>"
                        + "<div class='tab-right'></div>"*/
                        "</div>";
                    var tab = $(tabString);
                    tab.attr('data-key', tabInfo.key);
                    if (widget.options.selected === tabInfo.key || tabInfo.selected) {
                        tab.addClass("selected");
                    }
                    tab.click(widget.tabclick);
                    widget.element.append(tab);
                }
            );
        } else if (widget.options.type == "header") {
            $.each(this.options.tabs,
                function (index, tabInfo) {
                    var tabString = "<div class='header-tab'>"
                        + tabInfo.name +
                        "</div>";
                    var tab = $(tabString);
                    tab.attr('data-key', tabInfo.key);
                    tab.attr('automation-id', tabInfo.name+"Tab");
                    if (widget.options.selected === tabInfo.key || tabInfo.selected) {
                        tab.addClass("selected");
                    }
                    tab.click(widget.tabclick);
                    widget.element.append(tab);
                }
            );

        }
    },
    tabclick: function (e) {
        var tab = $(this);
        var key = tab.attr('data-key');
        if(fc.header.superUser && key =="Landing" &&  !fc.header.orgName) {
            Common.navigateSuperUserSupportToOrgView(key);
        } else {
            fc.navigate(key);
        }
    },
    options: {
        tabs: [],
        selected: "",
        type: "main"
    }
};
$.widget("ui.csNavigation", CropSenseNavigation);

var CropSenseSubNavigation = {
    _create: function () {
        var target = $(this.element);
        var widget = this;
        target.addClass("subnav-bar").addClass("clearfix");
        $.each(this.options.tabs,
            function (index, tabInfo) {
                var tabString = "<div class='subnav'>"
                    + tabInfo.name
                    + "</div>";
                var tab = $(tabString);
                tab.attr('data-key', tabInfo.key);
                tab.attr('automation-id', tabInfo.key);
                if (tabInfo.selected) {
                    tab.addClass("selected");
                }
                tab.click(widget.tabclick);
                widget.element.append(tab);
            }
        );

    },



    tabclick: function (e) {
        var tab = $(this);
        var key = tab.attr('data-key');
        if(fc.header.superUser && key =="SupportLanding" &&  !fc.header.orgName) {
            Common.navigateSuperUserSupportToOrgView(key);
        } else {
            fc.navigate(key);
        }
    },
    options: {
        tabs: []
    }
};
$.widget("ui.csSubNavigation", CropSenseSubNavigation);


var CropSenseSearch = {
    _create: function () {
        var target = $(this.element);
        var widget = this;
        var keyPressTimer;
        var keyPressInterval = 500;

        target.wrap($("<div class='search-wrapper rounded icon-search'></div>"));
        var clearSearch = $("<div class='clear-search icon-remove' automation-id='" + (widget.options.automationIdPrefix ? widget.options.automationIdPrefix+"-" : "") + "searchClose" + "'></div>").click(function () {
            target.val('');
            target.keyup();
        });
        target.after(clearSearch);
        target.attr('autocomplete', 'off');
        clearSearch.hide();
        target.keyup(function () {
            keyPressTimer = setTimeout(
                function () {
                    var filterValue = target.val();
                    if (filterValue === widget._previousFilter) {
                        return;
                    }
                    if (filterValue.length == 0){
                        clearSearch.fadeOut(function(){$(this).hide();});
                    } else if (clearSearch.is(':hidden')) {
                        clearSearch.fadeIn();
                    }
                    widget.options.filterer(widget, filterValue);
                    widget._previousFilter = filterValue;
                }
                , keyPressInterval);
        });
        target.keydown(function () {
            clearTimeout(keyPressTimer);
        });
    },
    _previousFilter: "",
    refresh: function() {
        var target = $(this.element);
        var widget = this;
        var clearSearch = $(target).closest(".search-wrapper").find('.clear-search');
        var filterValue = target.val();
        if (filterValue.length == 0){
            clearSearch.fadeOut(function(){$(this).hide();});
        } else if (clearSearch.is(':hidden')) {
            clearSearch.fadeIn();
        }
        widget.options.filterer(widget, filterValue);
        widget._previousFilter = filterValue;
    },
    options: {
        containerSelector: null,
        childSelector: null,
        parentSelector: null,
        hideParentWhenEmpty: false,
        searchAll: false,
        filterer: function (widget, filterValue) {
            var container = $(widget.options.containerSelector);
            if (container.is('table')) {
                container = container.find('tbody');
            }
            var children = container.find(widget.options.childSelector);
            widget._trigger("beforeSearch", null, {});
            if (children) {
                $.each(children,
                    function (index, child) {
                        var child = $(child);
                        var searchArea = widget.options.expandSearch ?
                            widget.options.expandSearch(child) : child;
                        var searchMatches = widget.options.searchAll ?
                            searchArea.searchMatch(filterValue) :
                            searchArea.find('.searchable').searchMatch(filterValue);
                        if (searchMatches.length > 0) {
                            searchArea.show();
                            searchArea.removeClass("search-hidden");
                        } else {
                            searchArea.hide();
                            searchArea.addClass("search-hidden");
                        }
                        if (widget.options.parentSelector) {
                            if (widget.options.hideParentWhenEmpty) {
                                var parent = child.prev(widget.options.parentSelector);
                                if (parent) {
                                    var visibleChildren = parent.find(widget.options.childSelector).filter("is:visible");
                                    if (visibleChildren.length === 0) {
                                        parent.hide();
                                    } else {
                                        parent.show();
                                    }
                                }
                            }
                        }
                    }
                );
            }

            widget._trigger("afterSearch", null, { filter: filterValue });
            widget._trigger("afterSearchComplete", null, { filter: filterValue });
        }
    }
};
$.widget("ui.csSearch", CropSenseSearch);
var CropSenseFilter = {
    _create: function () {
        var target = $(this.element);
        var widget = this;

        target.addClass('filter-buttons').css("width", widget.options.width);
        widget.buildOptions(widget.options.data);
    },
    buildOptions: function(data) {
        var widget = this;
        var target = $(this.element);
        if (widget.options.width){
            var buttonWidth = parseInt(widget.options.width / data.length);
            buttonWidth = "" + buttonWidth + "px";
        }

        for (var i = 0; data.length > i; i++){
            var label = fc.translation(data[i].key);
            //var action = data[i].action;
            var button = "<div";
            button += " class='filter-button " + (data[i].selected ? "selected " : "")  + (widget.options.showIcon && data[i].iconClass ? data[i].iconClass : "") + "'";
            button += (label ? "title='" + label  + "'" : "");
            button += (buttonWidth ? " style='width:" + buttonWidth + ";'" : "");
            button += "data-value='" + data[i].value + "'";
            button += ">";
            button += (label && widget.options.showLabel ? "<span>" + label + "</span>" : "");
            button += "</div>"
            var buttonElement = $(button).appendTo(target) // .data("filterInfo", { "id": data[i].filterKey })
            buttonElement.click(
                function () {
                    var clicked = $(this);
                    if (clicked.hasClass('selected')) {
                        return;
                    }
                    clicked.parent().find('.selected').removeClass('selected');
                    clicked.addClass("selected");
                    var val = clicked.attr('data-value');
                    if (widget.options.action){
                        widget.options.action(val);
                    }
                }
            );

            if (data.length - 1 == i){
                buttonElement.addClass('last-child');
                $('<div class="clearfix"></div>').appendTo(target);
            }
        }
    },
    refresh: function() {
        var target = $(this.element);
        var widget = this;
        var filterValue = target.val();
        widget.options.filterer(widget, filterValue);
        widget._previousFilter = filterValue;
    },
    options: {
        data: null,
        defaultFilterKey: null,
        container: null,
        childSelector: null,
        width: null,
        showLabel: true
    }
};
$.widget("ui.csFilterButtons", CropSenseFilter);

$.fn.searchMatch = function (pattern) {
    var out = [];
    var textNodes = function (n) {
        if (n.nodeType == 3) {
            var t = typeof pattern == 'string' ?
                n.nodeValue.toLowerCase().indexOf(pattern.toLowerCase()) != -1 :
                pattern(n.nodeValue);
            if (t) {
                out.push($(n));
                //                if ($(n).parents(containerSelector)[0] != undefined) {
                //                    out.push($(n).parents(containerSelector)[0]);
                //                }
            }
        }
        else {
            $.each(n.childNodes, function (a, b) {
                textNodes(b);
            });
        }
    };
    this.each(function () {
        textNodes(this);
    });
    return out;
};

$.fn.getValues = function (objToSave) {
    var container = $(this);
    if (objToSave == null) {
        objToSave = {};
    }
    var dataItem;
    container.find('[data-id]').each(function (index) {
        dataItem = $(this);
        if (!dataItem.attr('data-ignore')) {
            var dataId = dataItem.attr('data-id');
            var dataType = dataItem.attr('data-type');
            if (dataItem.hasClass("is-selector")) {
                dataType = "selector";
            }
            if (dataItem.hasClass("datetime")) {
                dataType = "datetime";
            }
            if (dataItem.attr("type") == "checkbox") {
                dataType = "checkbox";
            }
            var valToSave = null;
            switch (dataType) {
                case "selectedItem":
                    valToSave = dataItem.find('[data-value]').attr('data-value');
                    break;
                case "cardList":
                    valToSave = dataItem.find('[data-value]').attr('data-value');
                    break;
                case "editableList":
                    var toSave = [];
                    var items = dataItem.find('li');
                    for (var i = 0; i < items.length; i++) {
                        toSave.push($(items[i]).attr('data-value'));
                    }
                    valToSave = toSave;
                    break;
                case "csradio":
                    valToSave = dataItem.csRadio("getValue");
                    break;
                case "checkbox":
                    valToSave = dataItem.is(":checked");
                    break;
                case "cstoggle":
                    valToSave = dataItem.csToggle("selectedid");
                    break;
                case "selector":
                    valToSave = dataItem.csSelectors("selectedid");
                    break;
                case "datetime":
                    var date = dataItem.datetimepicker("getDate");
                    if (date) {
                        if (dataItem.hasClass("utc")) {
                            valToSave = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
                        } else {
                            valToSave = date.getTime();
                        }
                    }
                    break;
                case "customList":
                    var list = [];
                    var childValues = dataItem.find("[data-value]");
                    $.each(childValues,
                        function (index, value) {
                            list.push($(value).attr('data-value'));
                        }
                    );
                    valToSave = list;
                    break;
                case "repeater":
                    var list = [];
                    var children = dataItem.find(":checkbox:checked:visible");
                    if (children) {
                        $.each(children,
                            function (index, child) {
                                if ($(child).attr("data-id-prop")) {
                                    list.push($(child).attr("id"));
                                } else {
                                    list.push($(child).val());
                                }
                            }
                        );
                    }
                    valToSave = list.join();
                    break;
                case "yesNo":
                    valToSave = dataItem.attr('data-value');
                    break;
                default:
                    valToSave = dataItem.val();
                    break;
            }

            if (dataId.indexOf(".") > -1) {
                var parts = dataId.split(".");
                var obj = objToSave;
                $.each(parts,
                    function (index, part) {
                        if (obj) {
                            if (index === (parts.length - 1)) {
                                obj[part] = valToSave;
                            } else {
                                if (obj[part]) {
                                    obj = obj[part];
                                } else {
                                    obj = obj[part] = {};
                                }
                            }
                        }
                    }
                );
            } else {
                objToSave[dataId] = valToSave;
            }


        }
    });
    return objToSave;
}
$.fn.hydrate = function (data, fullData, dataAttributeName) {
    var container = $(this);
    //check for string options sent in
    var clear = false;
    if (fc.isString(data)) {
        if (data === "clear") {
            data = {};
            fullData = {};
            clear = true;
            container.validate('clear');
        } else {
            return;
        }
    }
    if (!data) {
        data = {};
    }
    if (!dataAttributeName) {
        dataAttributeName = "data-id";
    }
    container.find("[" + dataAttributeName + "]").each(function (index) {
        var item = $(this);
        if (item.attr('data-skip-hydrate')) {
            return;
        }
        var dataId = item.attr(dataAttributeName);
        var val;
        var viewType = item.attr('data-type');
        if (!viewType) {
            viewType = "default";
        }
        if (item.hasClass("datetime")) {
            if (item.hasClass("dateonly")) {
                viewType = "date";
            } else {
                viewType = "datetime";
            }
        }
        if (item.hasClass("is-selector")) {
            viewType = "selector";
        }
        if (item.attr("type") == "checkbox") {
            viewType = "checkbox";
        }
        if (clear) {
            val = "";
            if (viewType == "checkbox") {
                val = false;
            }
        } else {
            if (dataId.indexOf(".") > -1) {
                var parts = dataId.split(".");
                var obj = data;
                $.each(parts,
                    function (index, part) {
                        if (obj) {
                            if (index === (parts.length - 1)) {
                                val = obj[part];
                            } else {
                                obj = obj[part];
                            }
                        }
                    }
                );
            } else {
                val = data[dataId];
            }
            if (item.attr('data-val-prop')) {
                var itemId = data[item.attr('data-val-prop')];
                if (itemId) {
                    item.attr("value", itemId);
                }
            }
            if (!val && viewType != "checkbox") {
                return;
            }
        }

        switch (viewType) {
            case "selector":
                if (item.data("uiCsSelectors")) {
                    item.csSelectors("selectbyid", val);
                }
                break;
            case "datetimemillis":
                item.text(fc.formatDateTimeFromMillis(val));
                break;
            case "datetimemillisutc":
                item.text(fc.formatDateTimeFromMillisUTC(val));
                break;
            case "datemillis":
                item.text(fc.formatDateFromMillis(val));
                break;
            case "datemillisutc":
                item.text(fc.formatDateFromMillisUTC(val));
                break;
            case "date":
                var toSet = null;
                if (val) {
                    if (item.hasClass("utc")) {
                        toSet = new fc.mimicDateFromMillisUTC(val);
                    } else {
                        toSet = new fc.smartGetDate(val);
                    }
                } else {
                    toSet = "";
                }
                if (item.data("datepicker")) {
                    item.datepicker("setDate", toSet);
                }
                break;
            case "datetime":
                var toSet = "";
                if (val) {
                    if (item.hasClass("utc")) {
                        toSet = new fc.mimicDateFromMillisUTC(val);
                    } else {
                        toSet = new fc.smartGetDate(val);
                    }
                }
                if (item.data("datepicker")) {
                    if (toSet) {
                        item.datetimepicker("setDate", toSet);
                    }
                    else {
                        item.val('');
                    }
                }
                break;
            case "lookup":
                if (!fullData) {
                    break;
                }
                var key = item.attr('data-lookup-key');
                var items = fullData["options_" + key];
                if (items) {
                    var val = fc.findItemByPropertyValue(items, "id", data[dataId]);
                    item.text(val.name);
                }
                break;
            case "repeater":
                var children = item.children();
                if (clear) {
                    if (children) {
                        $.each(children,
                            function (index, child) {
                                if ($(child).hasClass("repeater-child")) {
                                    $(child).remove();
                                }
                            }
                        );
                    }
                } else {
                    var isFirst = true;
                    var list = data[dataId];
                    var child;
                    children.hide();
                    $.each(list,
                        function (index, listItem) {
                            child = children.clone();
                            child.addClass("repeater-child");
                            child.show();
                            item.append(child);
                            child.hydrate(listItem, fullData, "data-sub-id");
                            if (child.attr("data-id-prop")) {
                                var itemId = listItem[child.attr('data-id-prop')];
                                if (itemId) {
                                    child.attr("data-item-id", itemId);
                                }
                            }
                            item.append(children);
                        }
                    );
                }
                break;
            case "csradio":
                item.csRadio("setValue", val);
                break;
            case "cstoggle":
                item.csToggle("selectedid", val);
                break;
            case "checkbox":
                //item.attr('value', val);
                item.attr('checked', val);
                var labelProp = item.attr("data-label-prop");
                if (labelProp) {
                    var wrapper = $("<label></label>");
                    item.wrap(wrapper);
                    item.after(data[labelProp]);
                }
                var selectedProp = item.attr("data-selected-prop");
                if (selectedProp) {
                    if (data[selectedProp]) {
                        item.attr("checked", "checked");
                    }
                }
                var idProp = item.attr("data-id-prop");
                if (idProp) {
                    item.attr("id", data[idProp]);
                }
                break;
            default:
                if (item.is('input') || item.is('textarea')) {
                    item.val(val).change();
                } else {
                    item.text(val);
                }
                break;
        }
        if (item.attr('data-show-after-hydrate') && data[dataId]) {
            item.show();
        }
        if (item.attr('data-label-vis-based-on-val')) {
            if (data[dataId]) {
                item.parent().show();
            } else {
                item.parent().hide();
            }
        }


    });
    container.find('[data-class-prop]').each(
        function (index, item) {
            item = $(item);
            var cssClass = data[item.attr('data-class-prop')];
            if (cssClass) {
                item.addClass(cssClass.toString());
            }
        }
    );


}
$.fn.clearValidation = function () {
    $(this).find('.has-validation-error').removeValidationMessage();
}
$.fn.validate = function (option, additionalValidations) {
    if (option) {
        switch (option) {
            case "clear":
                $(this).clearValidation();
                return;
                break;
        }
    }
    //clear old messages before revalidating
    $(this).clearValidation();
    var valid = true;
    var firstInvalid = null;
    var parentContainer = $(this);
    $(this).find('.required:visible').each(
        function (index, item) {
            var inputValue = $.trim($(item).val());
            var container = $(item);
            if ($(item).hasClass("is-selector")) {
                inputValue = $(item).csSelectors("selectedid");
            } else if ($(item).attr("data-type") === "csradio") {
                inputValue = $(item).csRadio("getValue");
            } else if ($(item).attr("data-type") === "cstoggle") {
                inputValue = $(item).csToggle("selectedid");
            } else if ($(item).attr("data-type") === "selectedItem") {
                inputValue = $(item).find('.selected').attr('data-value');
            } else {
                if (container.hasClass('datetime')) {
                    container = container.closest('.input-calendar');
                }
                //old login stuff TODO: remove
                var defaultValue = $(item).attr('data-default');
                if (inputValue == defaultValue) {
                    inputValue = null;
                }
                defaultValue = $(item).attr('data-hint');
                if (defaultValue === inputValue) {
                    inputValue = null;
                }
                //handle drop down lists
                if (inputValue == "@unselected@") {
                    inputValue = null;
                }
                //handle checkboxes
                if ($(item).is(":checkbox")) {
                    if ($(item).is(":checked")) {
                        inputValue = "true";
                    } else {
                        inputValue = null;
                    }
                }
            }
            if (!inputValue) {
                container.addValidationMessage("validation-required", fc.translation("RequiredMsg"));
                valid = false;
                if (firstInvalid == null) { firstInvalid = item };
            } else {
                container.removeValidationMessage("validation-required");
            }
        }
    );
    $(this).find('.mustmatch').each(
        function (index, item) {
            var matchVal = parentContainer.find("[data-id='" + $(item).attr('data-match-id') + "']").val();
            var inputValue = $(item).val();
            if (matchVal != inputValue) {
                $(item).addValidationMessage("validation-mustmatch",
                    fc.translation("MustMatch").format(fc.translation($(item).attr("data-match-res-id")))
                );
                valid = false;
                if (firstInvalid == null) { firstInvalid = item };
            }
        }
    );
    $(this).find('.itemname').each(
        function (index, item) {
            var inputValue = $(item).val();
            if (!(/^[\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02AEA-Za-z0-9\-\' ]+$/.test(inputValue))) {
                $(item).addValidationMessage("validation-itemname", fc.translation("ItemNameInvalid"));

                valid = false;
                if (firstInvalid == null) { firstInvalid = item };
            } else {
                $(item).removeValidationMessage("validation-itemname");
            }
        }
    );
    $(this).find('.alphanumeric').each(
        function (index, item) {
            var inputValue = $.trim($(item).val());
            if (/[^\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02AEa-zA-Z0-9 ]/.test(inputValue)) {
                $(item).addValidationMessage("validation-alphanumeric", fc.translation("LettersNumbers"));
                valid = false;
                if (firstInvalid == null) { firstInvalid = item };
            } else {
                $(item).removeValidationMessage("validation-alphanumeric");
            }
        }
    );
    $(this).find('.specific-length').each(
        function (index, item) {
            var inputValue = $.trim($(item).val());
            var lengthInput = $(item).attr('validation-length');
            if (inputValue.length !== parseInt(lengthInput)) {
                $(item).addValidationMessage("validation-length", fc.translation("Err_Length").format(lengthInput));
                valid = false;
                if (firstInvalid == null) { firstInvalid = item };
            } else {
                $(item).removeValidationMessage("validation-length");
            }
        }
    );
    $(this).find('.min-length').each(
        function (index, item) {
            var inputValue = $.trim($(item).val());
            var lengthInput = $(item).attr('validation-minlength');
            if (inputValue.length > 0 && inputValue.length < parseInt(lengthInput)) {
                $(item).addValidationMessage("validation-minlength", fc.translation("Err_MinLength").format(lengthInput));
                valid = false;
                if (firstInvalid == null) { firstInvalid = item };
            } else {
                $(item).removeValidationMessage("validation-minlength");
            }
        }
    );
    $(this).find('.max-length').each(
        function (index, item) {
            var inputValue = $.trim($(item).val());
            var lengthInput = $(item).attr('validation-maxlength');
            if (inputValue.length > parseInt(lengthInput)) {
                $(item).addValidationMessage("validation-maxlength", fc.translation("Err_MaxLength").format(lengthInput));
                valid = false;
                if (firstInvalid == null) { firstInvalid = item };
            } else {
                $(item).removeValidationMessage("validation-maxlength");
            }
        }
    );
    $(this).find('.regex').each(
        function (index, item) {
            var customRegExString = $(item).attr('validation-regex');
            var inputValue = $.trim($(item).val());
            if (inputValue) {
                var re = new RegExp(customRegExString);
                if (!re.test(inputValue)) {
                    $(item).addValidationMessage("validation-regex",
                        fc.translation($(item).attr('validation-regex-error-key')));
                    valid = false;
                    if (firstInvalid == null) { firstInvalid = item };
                } else {
                    $(item).removeValidationMessage("validation-regex");
                }
            } else {
                $(item).removeValidationMessage("validation-regex");
            }
        }

    );
    $(this).find('.latlong').each(
        function (index, item) {
            var inputValue = $.trim($(item).val());
            if (inputValue && !(/^-?[0-9]{1,3}\.[0-9]{1,8}$/.test(inputValue))) {
                $(item).addValidationMessage("validation-latlong", "Decimal version required");
                valid = false;
                if (firstInvalid == null) { firstInvalid = item };
            } else {
                $(item).removeValidationMessage("validation-latlong");
            }
        }
    );
    $(this).find('input.email:visible').each(
        function (index, item) {
            var inputValue = $.trim($(item).val());
            if ((/^[\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02AEA-Z0-9._-]+@[\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02AEA-Z0-9._-]+\.[A-Z]{2,3}$/i).test(inputValue)) {
                $(item).removeValidationMessage("validation-email");
            }
            else {
                $(item).addValidationMessage("validation-email", fc.translation("InvalidEmail"));
                valid = false;
                if (firstInvalid == null) { firstInvalid = item };
            }
        }
    );
    var startDateTime = null;
    var endDateTime = null;
    $(this).find('.datetime:visible').each(
        function (index, item) {
            var inputValue = $.trim($(item).val());
            var container = $(item).closest('.input-calendar');
            var dateonly = false;
            if ($(item).hasClass('dateonly')) {
                dateonly = true;
            }

            if (!inputValue || inputValue.length == 0) {
                container.removeValidationMessage("validation-datetime");
            } else {

                var validDateTime = true;

                var invalid = function () {
                    container.addValidationMessage("validation-datetime", fc.translation("InvalidDateTime"));
                    validDateTime = false;
                    if (firstInvalid == null) { firstInvalid = item };
                }

                var dateAndTime = inputValue.split(' ');
                if (dateonly) {
                    if (dateAndTime.length != 1) {
                        invalid();
                    }
                }
                else if (dateAndTime.length != 2) {
                    invalid();
                }
                var dateParts = dateAndTime[0].split('-');
                if (dateParts.length != 3) {
                    invalid();
                }
                if (dateParts[0]>12) {
                    invalid();
                }
                var lastDayOfMonth = new Date(dateParts[2], dateParts[0], 0).getDate();
                if (dateParts[1]>lastDayOfMonth) {
                    invalid();
                }

                if (validDateTime) {
                    var timeParts;
                    if (dateonly) {
                        timeParts = "00:00".split(':');
                    } else {
                        timeParts = dateAndTime[1].split(':');
                    }
                    if (timeParts.length != 2) {
                        invalid();
                    }

                    var d = new Date(dateParts[2], dateParts[0] - 1, dateParts[1], timeParts[0], timeParts[1], 0, 0);

                    if (Object.prototype.toString.call(d) === "[object Date]") {
                        // it is a date
                        if (isNaN(d.getTime())) {  // d.valueOf() could also work
                            invalid();
                        } else if (d.getFullYear() < 1990) {
                            invalid();
                        }
                    }
                    else {
                        invalid();
                    }

                    if ($(item).hasClass('start')) {
                        startDateTime = d;
                    }
                    if ($(item).hasClass('end')) {
                        endDateTime = d;
                    }
                }

                if ($(item).hasClass('future')) {
                    var tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1)
                    tomorrow.setHours(0, 0, 0, 0);
                    d.setHours(0, 0, 0, 0);
                    if (d.getTime() < tomorrow.getTime()) {
                        container.addValidationMessage("validation-datetime", fc.translation("Msg_EarlyDate"));
                        validDateTime = false;
                        if (firstInvalid == null) { firstInvalid = item };
                    }
                }

                if (startDateTime && endDateTime) {
                    startDateTime.setSeconds(0);
                    endDateTime.setSeconds(0);

                    if (endDateTime.getTime() == startDateTime.getTime() || endDateTime < startDateTime) {
                        var endBox = parentContainer.find('.datetime.end');
                        var translationKey = endBox.attr('data-range-mismatch-key') || "Msg_BadEndDate";
                        container.addValidationMessage("validation-datetime", fc.translation(translationKey));
                        validDateTime = false;
                        if (firstInvalid == null) { firstInvalid = item };
                    }
                }

                if (validDateTime) {
                    container.removeValidationMessage("validation-datetime");
                } else {
                    valid = false;
                }
            }
        }
    );
    $(this).find('.numeric').each(
        function (index, item) {
            var inputValue = $.trim($(item).val());
            if (inputValue && inputValue.length > 0) {
                isValid = fc.onlyContainsNumbers(inputValue);
            } else {
                isValid = true;
            }
            if (!isValid) {
                $(item).addValidationMessage("validation-numeric", fc.translation("InvalidNumber"));
                valid = false;
                if (firstInvalid == null) { firstInvalid = item };
            } else {
                $(item).removeValidationMessage("validation-numeric");
            }
        }
    );
    $(this).find('.decimal').each(
        function (index, item) {
            var inputValue = $.trim($(item).val());
            if (inputValue && inputValue.length > 0) {
                isValid = fc.isDecimal(inputValue);
            } else {
                isValid = true;
            }
            if (!isValid) {
                $(item).addValidationMessage("validation-decimal", fc.translation("InvalidDecimal"));
                valid = false;
                if (firstInvalid == null) { firstInvalid = item };
            } else {
                $(item).removeValidationMessage("validation-decimal");
            }
        }
    );
    if (valid && additionalValidations) {
        for (dataId in additionalValidations) {
            var item = $(this).find("[data-id='" + dataId + "']");
            if (item) {
                var result = additionalValidations[dataId](item);
                if (!result.valid) {
                    $(item).addValidationMessage("validation-custom", result.message);
                    valid = false;
                    if (firstInvalid == null) { firstInvalid = item };
                } else {
                    item.removeValidationMessage("validation-custom");
                }
            }
        }
    }
    if (firstInvalid != null) {
        var off = $(firstInvalid).offset();
        var t = off.top;
        var l = off.left;
        var h = $(firstInvalid).height();
        var w = $(firstInvalid).width();
        var docH = $(document).height();
        var docW = $(document).width();
        var isEntirelyVisible = (t > 0 && l > 0 && t + h < docH && l + w < docW);
        if (!isEntirelyVisible) {
            firstInvalid.scrollIntoView();
        }
    }
    return valid;
};
$.fn.setActionPermissions = function (itemData) {
    //$(this).find('data-action-id');
}
$.fn.addValidationMessage = function (key, message) {
    if (!$(this).hasClass('has-validation-error')) {
        if (!$(this).hasClass('error-inside')) {
            var errorMessage = $("<div class='validation-error'></div>");
            errorMessage.text(message);
            errorMessage.addClass(key + "-" + $(this).attr('data-id'));
            errorMessage.attr("automation-id", key + "-" + $(this).attr('data-id'));
            $(this).after(errorMessage);
        }
        $(this).addClass('has-validation-error')
    }
};
$.fn.removeValidationMessage = function (key) {
    var selector = '.validation-error';
    if (key) {
        selector = ("." + key + "-" + $(this).attr('data-id'));
    }
    $(this).parent().find(selector).remove();
    //make sure another validator hasn't set a message
    if ($(this).parent().find('.validation-error').length == 0) {
        $(this).removeClass('has-validation-error');
    }
};

var CropSenseMessage = {
    _messageDiv: null,
    _create: function () {
        var widget = this;
        var container;
        var showInDialog = false;
        if ($('.cs-dialog').is(':visible') && widget.options.fillDialog) {
            if (this.element.hasClass("cs-dialog-content")) {
                container = this.element;
            } else {
                container = $('.cs-dialog:visible').find('.cs-dialog-content');
            }
            showInDialog = true;
        } else {
            container = this.element;
        }

        var waitDivWrapper = $('<div class="wait-div-wrapper" align="center"></div>');
        var waitDiv = $('<div class="wait-div"></div>');
        var positioner = $('<div class="wait-div-positioner"></div>');
        var messageDiv = $('<div class="wait-div-inner rounded">' +
            (widget.options.message ? widget.options.message : fc.translation(widget.options.messageKey)) +
            '</div>');
        widget._messageDiv = messageDiv;
        if (widget.options.action) {
            var action = $("<a class='action-link' automation-id='anchor-"+fc.translation(widget.options.action.key)+"'>" + fc.translation(widget.options.action.key)
                + "</a>");
            action.click(widget.options.action.click);
            messageDiv.append(action);
            widget.options.generateAutomationId=true;
            widget.options.automationIdPrefix=widget.options.action.key;
        }
        //positioner.append(messageDiv);
        // Aaron hacking below
        waitDivWrapper.append(waitDiv).append(messageDiv)
            .height("100%")
            .width("100%")
            .zIndex(container.zIndex() + 1)
            .css('top', -(parseInt(container.css("border-top-width"), 10)))
            .css('left', -(parseInt(container.css("border-left-width"), 10)))
            .css('zIndex', 999999);
        waitDiv.css({ opacity: 0.75 })
            .height("100%")
            .width("100%");

        // automation ids
        if(widget.options.generateAutomationId ) {
            if(widget.options.automationIdPrefix){
                waitDivWrapper.attr("automation-id", widget.options.automationIdPrefix + "-wait-div-wrapper");
            }else{
                waitDivWrapper.attr("automation-id", widget.options.messageKey + "-wait-div-wrapper");
            }
        }

        messageDiv.css("background-image", "url(../image/" + widget.options.imageUrl + ")");
        var displayContainer = container;
        if (showInDialog) {
            displayContainer = container.parents(".ui-dialog");
            displayContainer.append(waitDivWrapper);
        }
        else {
            container.append(waitDivWrapper);
        }
        waitDiv.find('.wait-div-inner').zIndex(displayContainer.zIndex() + 2).css({ opacity: 1 });
        //            messageDiv.width(container.outerWidth()
        //               - parseInt(messageDiv.css("border-left-width"))
        //               - parseInt(messageDiv.css("border-right-width"))
        //               - parseInt(messageDiv.css("padding-left"))
        //               - parseInt(messageDiv.css("padding-right"))
        //               - parseInt(messageDiv.css("margin-left"))
        //               - parseInt(messageDiv.css("margin-right"))

        //               );
        var top = displayContainer.offset().top - $(window).scrollTop();
        var bottom = top + displayContainer.height();
        if (bottom > $(window).height()) {
            bottom = $(window).height();
        }
        var availableHeight = bottom - top;

        messageDiv.css("top", (availableHeight - 100) / 2);
        messageDiv.css("bottom", (availableHeight) / 2);
        // positioner.css("max-height", maxHeight);
        // positioner.css("height", "100%");

        widget.waitDivWrapper = waitDivWrapper;
    },
    update: function (key) {
        this._messageDiv.text(fc.translation(key));
    },
    off: function (skipFade) {
        var widget = this;
        if (skipFade) {
            widget.waitDivWrapper.hide();
        } else {
            widget.waitDivWrapper.fadeOut("fast", function () { widget.waitDivWrapper.hide(); });
        }
        //widget.waitDivWrapper.detach();
        widget.destroy();
    },
    options: {
        messageKey: null,
        imageUrl: "LoadingSpinner.gif",
        action: null,
        fillDialog: true,
        additionalInnerClass: null
    }
};
$.widget("ui.csMessage", CropSenseMessage);

var CropSenseTable = {
    _applySort: function (column, data) {
        var widget = this;
        if (column.sortProperty || column.sortValue) {

            $.each(widget.options.columns, function (index, sortableColumn) {
                $('.ui-icon', sortableColumn.header).removeClass("ui-icon-triangle-1-n ui-icon-triangle-1-s").addClass("ui-icon-empty");
            });
            var reverse = false;
            if (column.sortDirection.toLowerCase() === "ascending") {
                $('.ui-icon', column.header).removeClass("ui-icon-empty").addClass("ui-icon-triangle-1-n").show();
                reverse = false;
            } else {
                $('.ui-icon', column.header).removeClass("ui-icon-empty").addClass("ui-icon-triangle-1-s").show();
                reverse = true;
            }
            widget._sortData(column, reverse, data);
        }
    },
    sortInfo: null,
    getSortInfo: function () {
        return this.sortInfo;
    },
    _sortData: function (column, reverse, data) {
        var widget = this;
        widget.element.parent().csMessage({ messageKey: "Sorting", generateAutomationId: true, automationIdPrefix: column.sortProperty + "-SortBy"});
        if (column.isDate && reverse) { reverse = false; }
        else if (column.isDate && !reverse) { reverse = true; }
        widget.sortInfo = {
            sort_property: column.sortProperty,
            sort_direction: reverse ? "descending" : "ascending"
        };
        if (widget.options.customSort) {
            if(data && data.refreshSortConfig){
                 widget.element.parent().csMessage("off");
            } else {
                widget.options.customSort(widget._getPagingSortingStatus());
            }
            return;
        }
        data.sort(function (a, b) {
            var valA = column.sortProperty ? a[column.sortProperty] : column.sortValue(a);
            if (fc.isString(valA)) {
                valA = valA.toLowerCase();
            }
            var valB = column.sortProperty ? b[column.sortProperty] : column.sortValue(b);
            if (fc.isString(valB)) {
                valB = valB.toLowerCase();
            }
            if (valA < valB) {
                return reverse ? 1 : -1;
            } else if (valA > valB) {
                return reverse ? -1 : 1;
            } else {
                if (column.additionalSortProps){
                    for (var i = 0; column.additionalSortProps.length > i; i++) {
                        var val = column.additionalSortProps[i];
                        var subValA = a[val];
                        if (fc.isString(subValA)) {
                            subValA = subValA.toLowerCase();
                        }
                        var subValB = b[val];
                        if (fc.isString(subValB)) {
                            subValB = subValB.toLowerCase();
                        }
                        if (subValA < subValB) {
                            return reverse ? 1 : -1;
                        } else if (subValA > subValB) {
                            return reverse ? -1 : 1;
                        } else if (column.additionalSortProps.indexOf(val) === (column.additionalSortProps.length-1)) {
                            return 0;
                        }
                    }
                } else {
                    return 0;
                }
            }
        });
        widget.options.data = data;
        fc.messageOff(widget.element.parent());
    },
    sorting: null,
    _create: function () {
        var target = $(this.element);
        var widget = this;
        var header = widget.header = $("<thead></thead>");
        widget.scroller = null;
        var elementId = target.attr("id");
        var tableSelector;
        if (widget.options.scroll) {
            widget.table = $("<table id='" + elementId + "csTable' automation-id='" + elementId + "csTable'></table>");
            widget.scroller = $("<div class='scroll'></div>");
            widget.scroller.append(widget.table);
            target.parent().append(widget.scroller);
            tableSelector = "#" + elementId + "csTable";
        } else {
            widget.table = target;
            tableSelector = "#" + elementId;
        }
        if (widget.options.paging && widget.options.paging.enabled) {
            var footer = $("<div class='ui-widget-table-footer'></div>");
            target.parent().append(footer);
            widget.footer = footer;
        }
        widget.table.addClass("ui-widget-table").addClass(widget.options.cssClass);
        target.addClass("ui-widget-table").addClass(widget.options.cssClass);
        target.html('');
        var tbody = widget.tbody = $("<tbody id='" + widget.table.attr('id') + "tbody'></tbody>");

        if (widget.options.rowAction) {
            $(tableSelector).delegate('tr', 'click',
                function () {
                    var row = $(this);
                    if (widget.options.idProperty) {
                        var id = row.attr('data-row-id');
                        rowData = fc.findItemByPropertyValue(
                            widget._currentlyDisplayedData, widget.options.idProperty, id);
                    } else {
                        var index = row.attr('data-row-id');
                        rowData = widget._currentlyDisplayedData[index];
                    }
                    widget.options.rowAction(rowData, row);
                }
            );
        }

        if (widget.options.showHeaders) {
            target.prepend(header);
            var headerRow = $("<tr></tr>");
            header.append(headerRow);
            //add column for checkbox (if there is one)
            if (widget.options.expand) {
                var expandableCell = $("<th class='expand-header'></th>");
                headerRow.append(expandableCell);
            }
            if (widget.options.checkable) {
                headerRow.addClass("has-check-box");
                var headerCell = $("<th class='checkable'></th>");

                if (widget.options.groupSelect){
                    var checkAll = $('<input type="checkbox" name="header-box" />');
                    headerCell.append(checkAll);
                    checkAll.click(
                        function()
                        {
                            var toCheck = widget.table.find('.checkable input[type="checkbox"]:not([disabled="true"])'); // look for enabled
                            if ($(this).is(':checked'))
                            {
                                toCheck.attr('checked', 'checked');
                            } else {
                                toCheck.removeAttr('checked');
                            }
                        }
                    )
                }
                headerRow.append(headerCell);
                $.each(widget.options.checkable.linked,
                    function (index, linkInfo) {
                        if (linkInfo.button.data("uiCsButton")) {
                            linkInfo.button.csButton("disable");
                        }
                    }
                );
            } else if (headerRow.hasClass("has-check-box")) {
                headerRow.removeClass("has-check-box");
            }


            $.each(widget.options.columns,
                function (index, column) {
                    var headerText = (column.headerKey) ? fc.translation(column.headerKey) : "";
                    if (column.headerText) { headerText = column.headerText; }
                    var colHeader = $("<th class='td" + (index + 1)+"'><span class='ui-icon ui-icon-empty' style='' automation-id='sortBy"+column.headerKey+"'></span><div style='width:" +
                        (column.width ? column.width : "inherit") + ";' automation-id='"+column.headerKey+"'>"+headerText+"</div></th>");
                    if (widget.options.columns.length == index + 1) {
                        colHeader.addClass("last-header");
                    }
                    if (column.sortProperty || column.sortValue) {
                        colHeader.addClass("sortable");
                        colHeader.click(function () {
                            widget.sorting = true;
                            if (!column.sortDirection || column.sortDirection.toLowerCase() != "ascending") {
                                column.sortDirection = "ascending";
                            } else {
                                column.sortDirection = "descending";
                            }
                            widget._currentSortColumn = column;
                            widget.options.paging.selectedPage = 1;
                            widget._resetPager();
                            widget._applySort(column, widget.options.data);
                            if (!widget.options.customSort) {
                                widget.setData(widget.options.data);
                            }
                        });
                    }
                    column.header = colHeader;
                    headerRow.append(colHeader);
                }
            );
        }
        widget.table.append(tbody);

        if (widget.options.noItemsKey) {
            widget.element.after("<div class='message-container no-items rounded' style='display:none;'><div class='message' automation-id='noItems"+widget.options.noItemsKey+"'>" + fc.translation(widget.options.noItemsKey) + "</div></div>");
        }

        if (widget.options.scroll) {
            widget.scroller.css("max-height", widget.options.height - parseInt(target.css("height"), 10));
        }
        widget.setData(widget.options.data);

        var columnInfo;

        if (widget.options.columns) {
            for (var i = 0; i < widget.options.columns.length; i++) {
                columnInfo = widget.options.columns[i];
                if (columnInfo.action) {
                    $(tableSelector).delegate('.td' + (i + 1), 'click',
                        function () {
                            widget._runCellAction(this);
                        }
                    );
                } else if (widget.options.checkable) {
                    $(tableSelector).delegate('td.checkable', 'click',
                        function () {
                            widget._toggleCheckbox(this);
                        }
                    );
                    $(tableSelector).delegate('td.checkable input', 'click',
                        function (e) {
                            e.stopPropagation();
                        }
                    );
                    $(tableSelector).delegate('.td' + (i + 1), 'click',
                        function () {
                            widget._toggleCheckbox(this);
                        }
                    );
                }
            }
        }
        if (widget.options.grouping) {
            for (var i = 0; i < widget.options.grouping.parentColumns.length; i++) {
                columnInfo = widget.options.grouping.parentColumns[i];
                if (columnInfo.action) {
                    $(tableSelector).delegate('.grouping-parent .td' + (i + 1), 'click',
                        function () {
                            var cell = $(this);
                            var cellIndex = cell.attr("data-column-id");
                            var columnInfo = widget.options.grouping.parentColumns[cellIndex];
                            widget._runCellAction(this, columnInfo);
                        }
                    );
                } else if (widget.options.checkable) {
                    $(tableSelector).delegate('.grouping-parent .td' + (i + 1), 'click',
                        function () {
                            widget._toggleCheckbox(this);
                        }
                    );
                }
            }
            for (var i = 0; i < widget.options.grouping.childColumns.length; i++) {
                columnInfo = widget.options.grouping.childColumns[i];
                if (columnInfo.action) {
                    $(tableSelector).delegate('.grouping-children .td' + (i + 1), 'click',
                        function () {
                            var cell = $(this);
                            var parentRow = cell.parent('tr').prevAll('.grouping-parent:first');
                            var parentIndex = parentRow.attr('data-row-id');
                            var rowIndex = cell.parent('tr').attr('data-child-row-id');
                            var parentRowData = widget.options.idProperty
                                ? fc.findItemByPropertyValue(widget._currentlyDisplayedData, widget.options.idProperty, parentIndex)
                                : widget._currentlyDisplayedData[parentIndex];
                            var child = parentRowData[widget.options.grouping.childrenProperty][rowIndex];
                            var cellIndex = cell.attr("data-column-id");
                            var columnInfo = widget.options.grouping.childColumns[cellIndex];
                            widget._runCellAction(this, columnInfo, child);
                        }
                    );
                }
            }
        }
    },
    _previousFilter: null,
    _filteredSet: null,
    _applyFilter: function (filterValue) {
        filterValue = filterValue.toLowerCase();
        var widget = this;
        if (!widget._previousFilter || !widget._filteredSet) {
            refilter = true;
        } else {
            refilter = filterValue.length != widget._previousFilter.length + 1 || !widget._previousFilter.indexOf(filterValue) === 0;
        }
        var startingSet;
        var filteredSet = [];
        if (refilter) {
            startingSet = widget.options.data;
        } else {
            startingSet = widget._filteredSet;
        }
        var currentItem;
        var filterableBuilder;
        for (var i = 0, max = startingSet.length; i < max; i++) {
            currentItem = startingSet[i];
            if (!currentItem.filterable) {
                filterableBuilder = [];
                $.each(widget.options.columns, function (index, col) {
                    if (col.filterProperty) {
                        filterableBuilder.push(currentItem[col.filterProperty]);
                    } else if (col.format) {
                        filterableBuilder.push(col.format(currentItem));
                    } else {
                        filterableBuilder.push(currentItem[col.property]);
                    }
                });
                currentItem.filterable = filterableBuilder.join(",").toLowerCase();
            }
            if (currentItem.filterable.indexOf(filterValue) > -1) {
                filteredSet.push(currentItem);
            }
        }
        widget._previousFilter = filterValue;
        widget._filteredSet = filteredSet;
        widget.displayData(filteredSet);
    },
    _currentSortColumn: null,
    applySort: function(data) {
        var widget = this;
        if (!widget._currentSortColumn || (data && data.refreshSortConfig)) {
            if (widget.options.columns && widget.options.columns.length > 0) {
                var column;
                var tempColumn;
                for (var i = widget.options.columns.length - 1; i >= 0; i--) {
                    tempColumn = widget.options.columns[i];
                    if (tempColumn.sortProperty || tempColumn.sortValue) {
                        column = tempColumn;
                        if (tempColumn.sortDefault === true) {
                            break;
                        }
                    }
                }
                if (column) {
                    if (!column.sortDirection) {
                        column.sortDirection = "ascending";
                    }
                    widget._currentSortColumn = column;
                }
            }
        }
        if (widget._currentSortColumn) {
            widget._applySort(widget._currentSortColumn, data);
        }
    },
    setData: function (data, updateOptions) {
        var widget = this;

        if (widget.options.groupSelect){
            widget.element.find('.checkable input:checked').removeAttr('checked');
        }
        if (data && !widget.options.customSort) {
            widget.applySort(data);
        }
        widget.options.data = data;

        var displayData = data;

        widget.rebuildPager();

        if (widget.options.paging && widget.options.paging.enabled
            && widget.options.paging.pageLocally && widget.options.data) {
            displayData = widget._getPage(widget.options.paging.selectedPage);
        } else {
            widget.displayData(displayData, null, updateOptions);
        }

    },
    rebuildPager: function () {
        var widget = this;
        if (widget.options.paging && widget.options.paging.enabled) {
            if (!widget.pager) {
                var pager = $("<span class='pages'></span>");
                widget.footer.append(pager);
                widget.pager = pager;
            } else {
                widget.pager.children().remove();
            }

            if (!widget.options.paging.totalItems && !widget.options.data) { return; }

            var totalItems;
            if (!widget.options.paging.totalItems) {
                totalItems = widget.options.paging.pageLocally ? widget.options.data.length : 0;
            } else {
                totalItems = widget.options.paging.totalItems;
            }

            var pages = Math.ceil(totalItems / widget.options.paging.pageSize);
            var selectedPage = widget.options.paging.selectedPage ?
                widget.options.paging.selectedPage : 1;
            if (!widget.pager) {
                var pager = $("<span class='pages'></span>");
                widget.footer.append(pager);
                widget.pager = pager;
            } else {
                widget.pager.children().remove();
            }
            for (var i = 1; i <= pages; i++) {
                var pageSpan = $("<span class='page'>" + i + "</span>");
                if (i === selectedPage) {
                    pageSpan.addClass("selected");
                }
                pageSpan.click(
                    function (pageNumber) {
                        return function () {
                            widget.options.paging.selectedPage = pageNumber;
                            if (!widget.options.paging.pageLocally) {
                                widget.element.parent().csMessage({ messageKey: "LoadingRequestedPage" });
                            }
                            var display = widget._getPage();
                        }
                    } (i)
                );
                widget.pager.append(pageSpan);
            }
        }
    },
    _currentlyDisplayedData: null,
    displayData: function (displayData, totalItems, updateOptions) {
        updateOptions = updateOptions || {};
        var widget = this;
        widget._currentlyDisplayedData = displayData;
        var scrollElement = widget.element.parent().find('.scroll');
        var noItemsElement = widget.element.parent().find('.no-items');
        if (!displayData || displayData.length === 0) {
            totalItems = 0;
            noItemsElement.show();
            if (widget.options.noItemsKey) {
                widget.element.parent().find('.no-items .message').text(fc.translation(widget.options.noItemsKey));
            }
            scrollElement.hide();
            widget.element.hide();
        } else {
            noItemsElement.hide();
            scrollElement.show();
            widget.element.show();
        }
        if (totalItems != undefined) {
            widget.options.paging.totalItems = totalItems;
            widget.options.paging.selectedPage = 1;
            widget.rebuildPager();
        }
        $(widget.tbody).find('tr').each( function(index, row){
            $(row).remove();
        });

        // Replacement code above
//        var tableBody = document.getElementById(widget.table.attr('id') + "tbody");
//        for (var i = tableBody.rows.length - 1; i >= 0; i--) {
//            tableBody.deleteRow(i);
//        }
        if (!displayData) {
            return;
        }
        if (!updateOptions.silent) {
            widget.element.parent().find('.wait-div-wrapper').css('display','none');
            widget.element.parent().csMessage({ messageKey: "Msg_PageLoading", generateAutomationId: true, automationIdPrefix: "serverSideUrlCall" });
        }

        var row, cell;
        var rowHtml = [];
        var rowData;
        var classes = [];
        var cellHtml;
        var childData;
        for (var i = 0, max = displayData.length; i < max; i++) {
            rowData = displayData[i];
            classes = [];
            rowHtml.push("<tr ");
            if (widget.options.idProperty) {
                rowHtml.push("data-row-id='" + rowData[widget.options.idProperty] + "' ");
            } else {
                rowHtml.push("data-row-id='" + i + "' ");
            }
            if (widget.options.grouping) {
                classes.push("grouping-parent");
                if (widget.options.grouping.parentRowClass) {
                    classes.push(widget.options.grouping.parentRowClass);
                }
            }
            if (widget.options.checkable) {
                classes.push("has-check-box");
            }
            if (widget.options.addDividers) {
                classes.push("separated");
            }
            rowHtml.push("class='" + classes.join(' ') + "'");
            rowHtml.push(">");
            if (widget.options.expand) {
                rowHtml.push("<td class='expand'>");
                rowHtml.push("</td>");
            }
            if (widget.options.checkable) {
                rowHtml.push("<td class='checkable'>");
                rowHtml.push("<input type='checkbox' value='" + rowData[widget.options.checkable.id] + "'");
                if (widget.options.checkable.disabled && widget.options.checkable.disabled(rowData)) {
                    rowHtml.push(" disabled='true'");
                }
                if (widget.options.generateAutomationId) {
                    rowHtml.push(" automation-id='" + (rowData.name || rowData.id) + "-checkbox'");
                }
                rowHtml.push("/>");
                rowHtml.push("</td>");
            }
            if (widget.options.grouping) {
                var maxColumns = widget.options.checkable ?
                    widget.options.grouping.childColumns.length :
                    widget.options.grouping.childColumns.length - 1;
                cellHtml = widget._buildColumns(rowData, widget.options.grouping.parentColumns, maxColumns);
                rowHtml.push(cellHtml.join(''));
                var children = rowData[widget.options.grouping.childrenProperty];
                if (children && children.length > 0) {
                    for (var j = 0; j < children.length; j++) {
                        childData = children[j];
                        rowHtml.push("<tr class='grouping-children' ");
                        rowHtml.push("data-child-row-id='" + j + "'");
                        rowHtml.push(">");
                        if (widget.options.checkable) {
                            rowHtml.push("<td class='checkable'");
                            if (widget.options.generateAutomationId) {
                                rowHtml.push(" automation-id='" + childData.name + "-checkbox'");
                            }
                            rowHtml.push("></td>");
                        }
                        rowHtml.push(widget._buildColumns(childData, widget.options.grouping.childColumns).join(''));
                        rowHtml.push("</tr>");
                    }
                }
                else {
                    rowHtml.push("<tr class='grouping-children spacer'>");
                    rowHtml.push("<td colspan='" + (maxColumns + (widget.options.checkable ? 1 : 0)) + "'></td>");
                    rowHtml.push("</tr>");
                }
            } else {
                var cellArray = widget._buildColumns(rowData, widget.options.columns);
                rowHtml.push(cellArray.join(''));
            }
            rowHtml.push("</tr>");

            //                if (widget.options.addDividers) {
            //                    // No divider after last row
            //                    if (i + 1 != displayData.length) {
            //                        rowHtml.push("<tr class='rowDivider'>");
            //                        var colSpan = widget.options.checkable ? widget.options.columns.length + 1 : widget.options.columns.length;
            //                        rowHtml.push("<td colspan='" + colSpan + "'><hr /></td>");
            //                        rowHtml.push("</tr>");
            //                    }
            //                }

        }

        widget.tbody.append(rowHtml.join(''));
        widget.tbody.find(":checkbox").change(
            function () { widget._checkboxChanged(); });
        widget._checkboxChanged();
        widget.tbody.find("td.expand").click(function(){
            $(this).toggleClass('open');
            var open = ($(this).hasClass('open') ? true : false);
            if (widget.options.expand){
                var row = $(this).closest('tr');
                var id = row.attr("data-row-id");
                widget.options.expand(row, displayData[id], widget.options.columns, open);
            }
        });

        //adjust header widths
        var row = widget.tbody.find("tr:first");

        if (row && !widget.sorting) {
            var cells = row.find("td");
            var headers = widget.header.find("th");
            $.each(cells,
                function (index, cell) {
                    var width;
                    if ($(cell).width() > 0) {
                        width = $(cell).width();
                    } else {
                        // width = $(cell).outerWidth();
                    }

                    $(headers[index]).css("width", width);
                }
            );
        }

        // If table has scroll bar
        var hasScrollBar = false;

        var checkForScrollBar = function(){
            if (hasScrollBar) {
                // extend the width of the table the width of the scroll bar
                if (!widget.table.resized) {
                    var header = $(widget.header);
                    lastHeader = header.find('.last-header');
                    lastHeader.removeClass('last-header').css("border-right-width", 0);
                    var corner = $("<th class='last-header'></th>").css({ "width": 15, "border-left-width": 0, "padding": 0, "margin": 0 });
                    lastHeader.after(corner);
                    widget.table.resized = true;
                }
            } else {
                // reduce the width of the table to it's initial width
                if (widget.table.resized) {
                    var header = $(widget.header);
                    lastHeader = header.find('.last-header').removeClass("last-header");
                    var headerBefore = header.find('th').eq(-2);
                    headerBefore.addClass("last-header").css("border-right-width", "inherit");
                    lastHeader.remove();
                }
            }
        }
        if (widget.options.scroll) {
             if (widget.scroller.is(':visible')) {
                hasScrollBar = (widget.scroller.get(0).scrollHeight > widget.scroller.height());
                checkForScrollBar();
             } else {
                var halfSeconds = 0;
                var scrollMonitor = setInterval( function(){
                    halfSeconds += 1;
                    if (widget.scroller.is(':visible')){
                        hasScrollBar = (widget.scroller.get(0).scrollHeight > widget.scroller.height());
                        checkForScrollBar();
                        clearInterval(scrollMonitor);
                    }
                    if (halfSeconds >= 30){
                        clearInterval(scrollMonitor);
                    }
                }, 500);
            }
        }

        if (widget.options.searchElement){
            widget.options.searchElement.csSearch('refresh');
            widget.options.searchElement.csSearch('option', 'afterSearch',
                function () {
                    var visibleRows = widget.table.find('tr').not('.search-hidden');
                    if (!visibleRows || visibleRows.length === 0) {
                        widget.element.parent().find('.filtered-out').show();
                    } else {
                        widget.element.parent().find('.filtered-out').hide();
                    }

                }
            );
        }
        fc.messageOff(widget.element.parent());
    },
    _buildColumns: function (rowData, columns, totalColSpan) {
        var widget = this;
        cellArray = [];
        var columnInfo;
        for (var i = 0; i < columns.length; i++) {
            columnInfo = columns[i];
            var hasAction = false;
            if (columnInfo.action){
                if (columnInfo.checkCellHasAction){
                    hasAction = columnInfo.checkCellHasAction(rowData)
                } else {
                    hasAction = true
                }
            }
            cellArray.push("<td class='td" + (i + 1) + (columnInfo.unsearchable || widget.options.search ? "" : " searchable ")
                + (hasAction ? " has-action " : "") + (i + 1 == (columns.length) ? " last-child " : ""));
            cellArray.push("'");
            if (totalColSpan && i == (columns.length - 1)) {
                if (columns.length < totalColSpan) {
                    cellArray.push(" colspan='" + (totalColSpan - i + 1) + "'");
                }
            }
            cellArray.push(" data-column-id='" + i + "'");
            if (columnInfo.cellIdProp != "undefined"){
                cellArray.push(" id='" + rowData[columnInfo.cellIdProp] + "'");
            }

            if(widget.options.generateAutomationId){
                if(i ==0){
                    cellArray.push(" automation-id='" + (rowData.name || rowData.id) + "'");
                }   else{
                    cellArray.push(" automation-id='" + (rowData.name || rowData.id) + "-Column" + i + "'");
                }
            }

            cellArray.push(">");
            if (columnInfo.clip) {
                cellArray.push("<div class='clipped' automation-id='idOf-" + (rowData.name || rowData.id) + "'");
                cellArray.push(" style='width:" + (columnInfo.width ? columnInfo.width : "inherit") + "; " + (columnInfo.showText ? "white-space:normal; line-height: 200%;" : "") + "'>");
            }
            if(columnInfo.addSpace){
                var prop = rowData[columnInfo.property];
                if(prop){
                    if(_.isString(prop)) {
                        prop = prop.replace(/,/g, ', ');
                    }
                    cellArray.push(prop);
                }
            } else{
                cellArray.push(columnInfo.property ? rowData[columnInfo.property] : columnInfo.format(rowData));
            }

            if (columnInfo.clip) {
                cellArray.push("</div>");
            }
            cellArray.push("</td>");
        }
        return cellArray;
    },
    _toggleCheckbox: function (cell) {
        var row = $(cell).parent("tr");
        var checkbox = $(row.find(':checkbox')[0]);
        if (!checkbox.attr("disabled")) {
            checkbox.attr('checked', !checkbox.is(":checked"));
            checkbox.change();
        }
    },
    _runCellAction: function (cell, columnInfo, rowData) {
        var widget = this;
        cell = $(cell);
        var row = cell.parent("tr");
        if (!rowData) {
            if (widget.options.idProperty) {
                var id = row.attr('data-row-id');
                rowData = fc.findItemByPropertyValue(
                    widget._currentlyDisplayedData, widget.options.idProperty, id);
            } else {
                var index = row.attr('data-row-id');
                rowData = widget._currentlyDisplayedData[index];
            }
        }
        var cellIndex = cell.attr("data-column-id");
        if (!columnInfo) {
            columnInfo = widget.options.columns[cellIndex];
        }
        widget._cellAction(rowData, columnInfo, row);
    },
    _cellAction: function (rowData, columnInfo, row) {
        var widget = this;

        if (columnInfo.action){
            var hasAction;
            if (columnInfo.checkCellHasAction){
                hasAction = columnInfo.checkCellHasAction(rowData);
            } else {
                hasAction = true;
            }
            if (hasAction) {
                columnInfo.action(rowData, row);
            }
        }

    },
    _setButtonLabel: function (linkInfo, label, hasText, hasTitle) {
        if (linkInfo.button.data("uiCsButton")) {
            linkInfo.button.csButton("updateText", label, hasText, hasTitle);
        }
    },
    _checkboxChanged: function () {
        var widget = this;
        if (!widget.options.checkable) {
            return;
        }
        var checkboxes = widget.tbody.find(":checkbox:checked");
        if (checkboxes.length === 0) {
            $.each(widget.options.checkable.linked,
                function (index, linkInfo) {
                    if (linkInfo.button.data("uiCsButton")) {
                        linkInfo.button.csButton("disable");
                    }
                    if (!linkInfo.single) {
                        var title = (linkInfo.titleKey ? fc.translation(linkInfo.titleKey) : false);
                        if (linkInfo.button.attr("data-res-id")) {
                            widget._setButtonLabel(linkInfo,
                                fc.translation(linkInfo.button.attr("data-res-id")), true, title);
                        } else {
                            widget._setButtonLabel(linkInfo, "", false, title);
                        }
                    }
                }
            );
        } else {
            $.each(widget.options.checkable.linked,
                function (index, linkInfo) {
                    if (!linkInfo.single || checkboxes.length === 1) {
                        linkInfo.button.csButton("enable");
                        if (!linkInfo.single) {
                            var label = "";
                            if (linkInfo.button.attr("data-res-id")) {
                                label += fc.translation(linkInfo.button.attr("data-res-id")) + " ";
                            }
                            label += "(" + checkboxes.length + ")";
                            var title = false;
                            if(checkboxes.length>1 && linkInfo.pluralTitleKey){
                                title = fc.translation(linkInfo.pluralTitleKey);
                            } else if (checkboxes.length===1 && linkInfo.titleKey){
                                title = fc.translation(linkInfo.titleKey);
                            }
                            if (label) {
                                widget._setButtonLabel(linkInfo, label, true, title);
                            } else {
                                widget._setButtonLabel(linkInfo, "", false, title);
                            }
                        }
                    } else {
                        linkInfo.button.csButton("disable");
                    }

                }
            );
        }
        widget._trigger("checkchange", null, checkboxes)
    },
    checked: function () {
        var widget = this;
        var checkboxes = widget.tbody.find(":checkbox:checked");
        var checked = [];
        $.each(checkboxes,
            function (index, cbox) {
                var item = fc.findItemByPropertyValue(widget._currentlyDisplayedData, widget.options.checkable.id, $(cbox).val());
                if (item) {
                    checked.push(item);
                }
            }
        );
        return checked;
    },
    _getPagingSortingStatus: function () {
        var widget = this;
        var pageNumber = widget.options.paging.selectedPage;
        var start = ((pageNumber - 1) * widget.options.paging.pageSize) + 1;
        var end = start + widget.options.paging.pageSize - 1;
        if (end > widget.options.paging.totalItems) {
            end = widget.options.paging.totalItems;
        }
        var status = {
            record_start: start,
            record_end: end,
            recordCount: widget.options.paging.totalItems
        };
        if (widget.options.customSort && widget.sortInfo) {
            $.extend(status, widget.sortInfo);
        }
        return status;
    },
    _getPage: function () {
        var widget = this;
        var pagingStatus = widget._getPagingSortingStatus();
        widget._resetPager();
        $('html').scrollTop(widget.element.offset().top);
        return widget.options.paging.getPage(pagingStatus, widget);
    },
    _resetPager: function () {
        var widget = this;
        if (widget.pager) {
            widget.pager.find(".page").removeClass("selected");
            $(widget.pager.find(".page")[widget.options.paging.selectedPage - 1]).addClass("selected");
        }
    },
    removechecked: function () {
        var widget = this;
        var checkboxes = widget.tbody.find(":checkbox:checked");
        checkboxes.closest("tr").remove();
        widget._checkboxChanged();
    },
    options: {
        columns: null,
        showHeaders: true,
        addDividers: false,
        noItemsKey: null,
        idProperty: null,
        paging: {
            enabled: false,
            pageSize: 50,
            pageLocally: true,
            selectedPage: 1,
            getPage: function (pagingStatus, widget) {
                var display = widget.options.data.slice(pagingStatus.record_start, pagingStatus.record_end);
                widget.displayData(display);
            }
        },
        groupSelect: false,
        expand: null,
        searchElement: null,
        generateAutomationId: null
    }
};
$.widget("ui.csTable", CropSenseTable);
var CropSenseToggle = {
    _create: function () {
        var element = this.element;
        var widget = this;
        element.attr("data-type", "cstoggle");

        $.each(widget.options.buttons,
            function (index, buttonInfo) {
                var itemText = buttonInfo.textKey ? fc.translation(buttonInfo.textKey) : buttonInfo.text;
                var automationId = itemText + (widget.options.readonly? "ReadOnly" : "Click") +
                    (buttonInfo.automationSuffix ? '-' + buttonInfo.automationSuffix + '-' : '' );
                var wrapper = $("<div class='toggle-image-wrapper icon-" + buttonInfo.imageName + "' automation-id='"
                    + automationId +"Toggle' >" + itemText + "</div>");

                element.append(wrapper);
                wrapper.click(
                    function () {
                        var w = $(this);
                        if (w.hasClass("selected")) {
                            return;
                        } else {
                            element.find(".toggle-image-wrapper.selected").removeClass("selected");
                            w.addClass("selected");
                        }
                        fc.refreshDOM(element.find(".toggle-image-wrapper"));
                    }
                );

            }
        );
    },
    _init: function () {
        if (this.options.readonly) {
            this.element.find(".toggle-image-wrapper").hide();
        }
    },
    selectedid: function (id) {
        var element = this.element;
        var widget = this;
        if (id != undefined && id != null) {
            if (widget.options.readonly) {
                element.find(".toggle-image-wrapper").hide();
            }
            element.find(".toggle-image-wrapper").removeClass("selected");
            $.each(widget.options.buttons,
                function (index, buttonInfo) {
                    if (buttonInfo.id == id) {

                        $(element.find(".toggle-image-wrapper")[index]).click();
                        if (widget.options.readonly) {
                            $(element.find(".toggle-image-wrapper")[index]).show();
                        }
                    }
                }
            );
            return;
        } else {
            var selectedId = null;
            $.each(element.find(".toggle-image-wrapper"),
                function (index, item) {
                    if ($(item).hasClass("selected")) {
                        selectedId = widget.options.buttons[index].id;
                    }
                }
            );
            return selectedId;
        }
    },
    options: {
        buttons: null,  // { imageName, textKey, id, (optional) text, (optional) class }
        cssClass: null
    }
};
$.widget("ui.csToggle", CropSenseToggle);

var CropSenseFileUploader = {
    _create: function () {
        var widget = this;
        widget.options.button.csSubmit(
            {
                container: widget.options.container,
                showConfirm: false,
                customSubmit: function () { widget._submit(); },
                close: function(response) { widget.options.callback() }
            }
        );
        if (!widget.options.iframeId) {
            widget.options.iframeId = widget.element.attr('id') + "_iframe";
        }
    },
    _submit: function () {
        var widget = this;
        if (!widget.options.container) {
            widget.options.container = $('body');
        }
        if (widget.options.beforeSend) {
            if (!widget.options.beforeSend()) {
                widget.options.button.csSubmit("messageOff");
                return;
            }
        }
        //widget.options.container.csMessage({ messageKey: "LoadingDetails" });
        if (!widget.iframe) {
            widget.iframe = $("<iframe id='" + widget.options.iframeId + "' data-el-id='" + widget.element.attr('id') + "' name='" + widget.options.iframeId + "' src='#'  style='width:0;height:0;border:0px solid #fff;'></iframe> ");
            widget.iframe.load(
                function () { widget._iframeOnLoad(); }
            );
            $('body').append(widget.iframe);
        }
        widget.element.prop("target", widget.options.iframeId);
        widget.element.prop("action", fc.Paths[widget.options.postPathKey].url);
        widget.element.prop("method", "POST");
        widget.element.submit();
    },
    _iframeOnLoad: function () {
        var widget = this;
        if (widget.iframe.contents() && widget.iframe.contents().find('pre')
            && widget.iframe.contents().find('pre').html()) {
            var response = eval("(" + widget.iframe.contents().find('pre').html() + ")");
            this.stopUpload(response);
        } else {
            var response = {
                success: false,
                messages: [
                    { message: fc.translation("UnknownServerError") }
                ]
            }
            widget.options.button.csSubmit("onServerResponse", response);
        }
    },
    iframe: null,
    update: function (key) {
        this._messageDiv.text(fc.translation(key));
    },
    stopUpload: function (response) {
        var widget = this;
        if (response.success) {
            if (widget.options.afterSuccess) { widget.options.afterSuccess(response.data) };
        }
        widget.options.button.csSubmit("onServerResponse", response);
    },
    options: {
        button: null,
        container: null,
        postPathKey: null,
        callback: null,
        beforeSend: null,
        iframeId: null,
        afterSuccess: null
    }
};
$.widget("ui.csFileUploader", CropSenseFileUploader);

var CropSenseLengthWatcher = {
    _create: function () {
        var widget = this;
        widget.length = widget.element.attr("validation-maxlength");
        widget.note = $("<div class='dark-note'><span class='remain'>" + widget.length + "</span>" + fc.translation("charactersremaining") + "</div>");
        widget.element.parent().append(widget.note);
        widget.element.keyup(function () { widget._keyUp(); });
        widget.element.keydown(function (event) { widget._keyDown(event); });
        widget.element.bind("paste", function () { window.setTimeout(function () { widget._keyUp(); }, 0) });

    },
    length: 0,
    _keyUp: function () {
        var widget = this;
        var used = widget.element.val().length;
        var remain = widget.length - used;
        if (remain < 0) {
            widget.note.find('.remain').addClass("error");
        } else {
            widget.note.find('.remain').removeClass("error");
        }
        widget.note.find('.remain').html(remain);
    },
    _keyDown: function (event) {
        var widget = this;
        var used = widget.element.val().length;
        if (used >= widget.length && event.keyCode != 8 && event.keyCode != 46 && event.keyCode != 37) {
            event.preventDefault();
        }
    },
    reset: function(){
        var widget = this;
        var used = widget.element.val().length;
        var remain = widget.length - used;
        widget.note.find('.remain').html(remain);
    } ,
    options: {

    }
};
$.widget("ui.csLengthWatcher", CropSenseLengthWatcher);

var CropSenseTopicalHelp = {
    _create: function () {
        var widget = this;
        widget.pulltab = $("<div class='help-pulltab'></div>");
        infoPodHtml = [];
        infoPodHtml.push("<div class='info-pod-wrapper' style='display:none;'>");
        infoPodHtml.push("  <div class='info-pod rounded'>");
        infoPodHtml.push("      <div class='banner'>");
        infoPodHtml.push("How do I ...");
        infoPodHtml.push("      </div>");
        infoPodHtml.push("      <div class='wrap rounded'>");
        infoPodHtml.push("      </div>");
        infoPodHtml.push("  </div>");
        infoPodHtml.push("  <div class='pointer' align='center'> <img src='../image/info-pod-triangle-east.png' /></div>");
        infoPodHtml.push("</div>");
        widget.infopod = $(infoPodHtml.join(''));
        var podContainer = widget.infopod.find('.wrap');
        widget.element.append(widget.infopod);
        $.each(widget.options.topics,
            function (index, topic) {
                var link = $('<div><a>' + topic.text + "</a></div>");
                link.click(
                    function () {
                        var options = {
                            topicUrl: topic.url
                        };
                        fc.showHelp(options);
                    }
                );
                podContainer.append(link);
            }
        );
        widget.pulltab.click(
            function () {
                widget.infopod.toggle();
            }
        );
        widget.element.append(widget.pulltab);
    },
    options: {
        topics: null
    }
};
$.widget("ui.csTopicalHelp", CropSenseTopicalHelp);

fc.stopUpload = function (frameId, success, errorText, id, releaseDateTime) {
    //  window.frameElement.id, false, "There was an error with the file you uploaded.")
    var elId = $('#' + frameId).attr('data-el-id');
    $('#' + elId).csFileUploader("stopUpload", success, errorText, id, releaseDateTime);
}




