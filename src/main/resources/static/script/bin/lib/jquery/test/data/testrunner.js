jQuery.noConflict(),jQuery.each([jQuery.expando,"getInterface","Packages","java","netscape"],function(e,t){window[t]=window[t]});var Sizzle=Sizzle||jQuery.find,qunitModule=QUnit.module,qunitTest=QUnit.test;this.testSubproject=function(e,t,n){function u(e){return function(){if(!o){if(!i.length){ok(!1,"Found subproject fixture");return}var t=originaljQuery("#qunit-fixture");while(t.length&&!t.prevAll("[id='qunit']").length)t=t.parent();t.nextAll().remove(),t.replaceWith(i),QUnit.config.fixture=s,QUnit.reset();if(originaljQuery("#qunit-fixture").html()!==s){ok(!1,"Copied subproject fixture");return}o=!0}e.apply(this,arguments)}}var r,i,s,o=!1;QUnit.config.reorder=!1,module(e),module=QUnit.module=function(t){var n=arguments;return r=t,n[0]=e,qunitModule.apply(this,n)},test=function(e){var t=arguments,n=t.length-1;t[0]=r+": "+e;for(;n>=0;n--)if(originaljQuery.isFunction(t[n])){t[n]=u(t[n]);break}return qunitTest.apply(this,t)},originaljQuery.ajax(t,{async:!1,dataType:"html",error:function(e,n){throw new Error("Could not load: "+t+" ("+n+")")},success:function(e,r,o){var u=originaljQuery.parseHTML((e||"").replace(/<\/?((!DOCTYPE|html|head)\b.*?)>/gi,"[$1]"),document,!0);(!u||!u.length)&&this.error(o,"no data"),u=originaljQuery(u),u.filter("script[src]").add(u.find("script[src]")).each(function(){var e=originaljQuery(this).attr("src"),r="<script src='"+t+e+"'></script>";n.test(e)&&(originaljQuery.isReady?originaljQuery("head").first().append(r):document.write(r))}),i=u.find("[id='qunit-fixture']"),s=i.html(),i.empty();while(i.length&&!i.prevAll("[id='qunit']").length)i=i.parent();i=i.add(i.nextAll())}})},this.Globals=function(){var e={};return{register:function(t){e[t]=!0,jQuery.globalEval("var "+t+" = undefined;")},cleanup:function(){var t,n=e;e={};for(t in n)jQuery.globalEval("try { delete "+(jQuery.support.deleteExpando?"window['"+t+"']":t)+"; } catch( x ) {}")}}}(),function(){var e=window.start;window.start=function(){e()}}(),function(){function u(e){var t,n;if(Object.keys)t=Object.keys(e);else{t=[];for(n in e)t.push(n)}return t.sort(),t}var e=0,t=0,n=0,r={},i=[].splice,s=QUnit.reset,o=jQuery.ajaxSettings;QUnit.expectJqData=function(e,t){var n,i,s;QUnit.current_testEnvironment.checkJqData=!0,e.jquery&&e.toArray&&(e=e.toArray()),jQuery.isArray(e)||(e=[e]);for(n=0;n<e.length;n++){i=e[n];if(!i.nodeType)continue;s=i[jQuery.expando],s===undefined?notStrictEqual(s,undefined,"Target for expectJqData must have an expando, for else there can be no data to expect."):r[s]?r[s].push(t):r[s]=[t]}},QUnit.config.urlConfig.push({id:"jqdata",label:"Always check jQuery.data",tooltip:"Trigger QUnit.expectJqData detection for all tests instead of just the ones that call it"}),this.moduleTeardown=function(){var s,o,a,f=0,l=0;if(QUnit.urlParams.jqdata||this.checkJqData){for(s in jQuery.cache)o=r[s],a=jQuery.cache[s]?u(jQuery.cache[s]):jQuery.cache[s],QUnit.equiv(o,a)||deepEqual(a,o,"Expected keys exist in jQuery.cache"),delete jQuery.cache[s],delete r[s];for(s in r)deepEqual(r[s],undefined,"No unexpected keys were left in jQuery.cache (#"+s+")"),delete r[s]}r={},jQuery.timers&&jQuery.timers.length!==0&&(equal(jQuery.timers.length,0,"No timers are still running"),i.call(jQuery.timers,0,jQuery.timers.length),jQuery.fx.stop()),jQuery.active!==undefined&&jQuery.active!==n&&(equal(jQuery.active,n,"No AJAX requests are still active"),ajaxTest.abort&&ajaxTest.abort("active requests"),n=jQuery.active),QUnit.reset();for(s in jQuery.cache)++l;jQuery.fragments={};for(s in jQuery.fragments)++f;l!==e&&(equal(l,e,"No unit tests leak memory in jQuery.cache"),e=l),f!==t&&(equal(f,t,"No unit tests leak memory in jQuery.fragments"),t=f)},QUnit.done(function(){jQuery("#qunit ~ *").remove()}),QUnit.reset=function(){jQuery("#qunit-fixture").empty(),jQuery.event.global={},o?jQuery.ajaxSettings=jQuery.extend(!0,{},o):delete jQuery.ajaxSettings,Globals.cleanup(),s.apply(this,arguments)}}(),QUnit.config.testTimeout=2e4,QUnit.config.requireExpects=!0,function(){var e=window.location.search;e=decodeURIComponent(e.slice(e.indexOf("swarmURL=")+"swarmURL=".length));if(!e||e.indexOf("http")!==0)return;document.write("<script src='http://swarm.jquery.org/js/inject.js?"+(new Date).getTime()+"'></scr"+"ipt>")}();