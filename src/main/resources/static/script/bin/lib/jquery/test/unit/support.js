module("support",{teardown:moduleTeardown}),test("zoom of doom (#13089)",function(){expect(1),jQuery.support.inlineBlockNeedsLayout?ok(document.body.style.zoom,"Added a zoom to the body (#11048, #12869)"):ok(!document.body.style.zoom,"No zoom added to the body")}),jQuery.css&&testIframeWithCallback("body background is not lost if set prior to loading jQuery (#9239)","support/bodyBackground.html",function(e,t){expect(2);var n={"#000000":!0,"rgb(0, 0, 0)":!0};ok(n[e],"color was not reset ("+e+")"),deepEqual(jQuery.extend({},t),jQuery.support,"Same support properties")}),testIframeWithCallback("A non-1 zoom on body doesn't cause WebKit to fail box-sizing test","support/boxSizing.html",function(e){expect(1),equal(e,jQuery.support.boxSizing,"box-sizing properly detected on page with non-1 body zoom")}),testIframeWithCallback("A background on the testElement does not cause IE8 to crash (#9823)","support/testElementCrash.html",function(){expect(1),ok(!0,"IE8 does not crash")}),testIframeWithCallback("box-sizing does not affect jQuery.support.shrinkWrapBlocks","support/shrinkWrapBlocks.html",function(e){expect(1),strictEqual(e,jQuery.support.shrinkWrapBlocks,"jQuery.support.shrinkWrapBlocks properties are the same")}),function(){var e,t=window.navigator.userAgent;/chrome/i.test(t)?e={leadingWhitespace:!0,tbody:!0,htmlSerialize:!0,style:!0,hrefNormalized:!0,opacity:!0,cssFloat:!0,checkOn:!0,optSelected:!0,getSetAttribute:!0,enctype:!0,html5Clone:!0,submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,noCloneChecked:!0,optDisabled:!0,radioValue:!0,checkClone:!0,appendChecked:!0,reliableHiddenOffsets:!0,ajax:!0,cors:!0,clearCloneStyle:!0,ownLast:!1}:/opera.*version\/12\.1/i.test(t)?e={leadingWhitespace:!0,tbody:!0,htmlSerialize:!0,style:!0,hrefNormalized:!0,opacity:!0,cssFloat:!0,checkOn:!0,optSelected:!0,getSetAttribute:!0,enctype:!0,html5Clone:!0,submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,noCloneChecked:!0,optDisabled:!0,radioValue:!1,checkClone:!0,appendChecked:!0,reliableHiddenOffsets:!0,ajax:!0,cors:!0,clearCloneStyle:!0,ownLast:!1}:/msie 10\.0/i.test(t)?e={leadingWhitespace:!0,tbody:!0,htmlSerialize:!0,style:!0,hrefNormalized:!0,opacity:!0,cssFloat:!0,checkOn:!0,optSelected:!1,getSetAttribute:!0,enctype:!0,html5Clone:!0,submitBubbles:!0,changeBubbles:!0,focusinBubbles:!0,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,noCloneChecked:!1,optDisabled:!0,radioValue:!1,checkClone:!0,appendChecked:!0,reliableHiddenOffsets:!0,ajax:!0,cors:!0,clearCloneStyle:!1,ownLast:!1}:/msie 9\.0/i.test(t)?e={leadingWhitespace:!0,tbody:!0,htmlSerialize:!0,style:!0,hrefNormalized:!0,opacity:!0,cssFloat:!0,checkOn:!0,optSelected:!1,getSetAttribute:!0,enctype:!0,html5Clone:!0,submitBubbles:!0,changeBubbles:!0,focusinBubbles:!0,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,noCloneChecked:!1,optDisabled:!0,radioValue:!1,checkClone:!0,appendChecked:!0,reliableHiddenOffsets:!0,ajax:!0,cors:!1,clearCloneStyle:!1,ownLast:!1}:/msie 8\.0/i.test(t)?e={leadingWhitespace:!1,tbody:!0,htmlSerialize:!1,style:!1,hrefNormalized:!0,opacity:!1,cssFloat:!1,checkOn:!0,optSelected:!1,getSetAttribute:!0,enctype:!0,html5Clone:!1,submitBubbles:!1,changeBubbles:!1,focusinBubbles:!0,deleteExpando:!1,noCloneEvent:!1,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,noCloneChecked:!1,optDisabled:!0,radioValue:!1,checkClone:!0,appendChecked:!0,reliableHiddenOffsets:!1,ajax:!0,cors:!1,clearCloneStyle:!0,ownLast:!0}:/msie 7\.0/i.test(t)?e={ajax:!0,appendChecked:!1,changeBubbles:!1,checkClone:!1,checkOn:!0,cors:!1,cssFloat:!1,deleteExpando:!1,enctype:!0,focusinBubbles:!0,getSetAttribute:!1,hrefNormalized:!1,html5Clone:!1,htmlSerialize:!1,inlineBlockNeedsLayout:!0,leadingWhitespace:!1,noCloneChecked:!1,noCloneEvent:!1,opacity:!1,optDisabled:!0,optSelected:!1,radioValue:!1,reliableHiddenOffsets:!1,reliableMarginRight:!0,shrinkWrapBlocks:!1,submitBubbles:!1,tbody:!1,style:!1,clearCloneStyle:!0,ownLast:!0}:/msie 6\.0/i.test(t)?e={leadingWhitespace:!1,tbody:!1,htmlSerialize:!1,style:!1,hrefNormalized:!1,opacity:!1,cssFloat:!1,checkOn:!0,optSelected:!1,getSetAttribute:!1,enctype:!0,html5Clone:!1,submitBubbles:!1,changeBubbles:!1,focusinBubbles:!0,deleteExpando:!1,noCloneEvent:!1,inlineBlockNeedsLayout:!0,shrinkWrapBlocks:!0,reliableMarginRight:!0,noCloneChecked:!1,optDisabled:!0,radioValue:!1,checkClone:!1,appendChecked:!1,reliableHiddenOffsets:!1,ajax:!0,cors:!1,clearCloneStyle:!0,ownLast:!0}:/5\.1\.1 safari/i.test(t)?e={leadingWhitespace:!0,tbody:!0,htmlSerialize:!0,style:!0,hrefNormalized:!0,opacity:!0,cssFloat:!0,checkOn:!1,optSelected:!0,getSetAttribute:!0,enctype:!0,html5Clone:!0,submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,noCloneChecked:!0,optDisabled:!0,radioValue:!0,checkClone:!1,appendChecked:!1,reliableHiddenOffsets:!0,ajax:!0,cors:!0,clearCloneStyle:!0,ownLast:!1}:/firefox/i.test(t)&&(e={leadingWhitespace:!0,tbody:!0,htmlSerialize:!0,style:!0,hrefNormalized:!0,opacity:!0,cssFloat:!0,checkOn:!0,optSelected:!0,getSetAttribute:!0,enctype:!0,html5Clone:!0,submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,noCloneChecked:!0,optDisabled:!0,radioValue:!0,checkClone:!0,appendChecked:!0,reliableHiddenOffsets:!0,ajax:!0,cors:!0,clearCloneStyle:!0,ownLast:!1}),e&&test("Verify that the support tests resolve as expected per browser",function(){expect(30);for(var t in e)jQuery.ajax||t!=="ajax"&&t!=="cors"?equal(jQuery.support[t],e[t],"jQuery.support['"+t+"']: "+jQuery.support[t]+", expected['"+t+"']: "+e[t]):ok(!0,"no ajax; skipping jQuery.support['"+t+"']")})}(),typeof navigator!="undefined"&&(/ AppleWebKit\/\d.*? Version\/(\d+)/.exec(navigator.userAgent)||[])[1]<6||testIframeWithCallback("Check CSP (https://developer.mozilla.org/en-US/docs/Security/CSP) restrictions","support/csp.php",function(e){expect(1),deepEqual(jQuery.extend({},e),jQuery.support,"No violations of CSP polices")});