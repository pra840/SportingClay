function internalData(e,t,n,r){if(!jQuery.acceptData(e))return;var i,s,o=jQuery.expando,u=e.nodeType,a=u?jQuery.cache:e,f=u?e[o]:e[o]&&o;if((!f||!a[f]||!r&&!a[f].data)&&n===undefined&&typeof t=="string")return;f||(u?f=e[o]=core_deletedIds.pop()||jQuery.guid++:f=o),a[f]||(a[f]=u?{}:{toJSON:jQuery.noop});if(typeof t=="object"||typeof t=="function")r?a[f]=jQuery.extend(a[f],t):a[f].data=jQuery.extend(a[f].data,t);return s=a[f],r||(s.data||(s.data={}),s=s.data),n!==undefined&&(s[jQuery.camelCase(t)]=n),typeof t=="string"?(i=s[t],i==null&&(i=s[jQuery.camelCase(t)])):i=s,i}function internalRemoveData(e,t,n){if(!jQuery.acceptData(e))return;var r,i,s=e.nodeType,o=s?jQuery.cache:e,u=s?e[jQuery.expando]:jQuery.expando;if(!o[u])return;if(t){r=n?o[u]:o[u].data;if(r){jQuery.isArray(t)?t=t.concat(jQuery.map(t,jQuery.camelCase)):t in r?t=[t]:(t=jQuery.camelCase(t),t in r?t=[t]:t=t.split(" ")),i=t.length;while(i--)delete r[t[i]];if(n?!isEmptyDataObject(r):!jQuery.isEmptyObject(r))return}}if(!n){delete o[u].data;if(!isEmptyDataObject(o[u]))return}s?jQuery.cleanData([e],!0):jQuery.support.deleteExpando||o!=o.window?delete o[u]:o[u]=null}function dataAttr(e,t,n){if(n===undefined&&e.nodeType===1){var r="data-"+t.replace(rmultiDash,"-$1").toLowerCase();n=e.getAttribute(r);if(typeof n=="string"){try{n=n==="true"?!0:n==="false"?!1:n==="null"?null:+n+""===n?+n:rbrace.test(n)?jQuery.parseJSON(n):n}catch(i){}jQuery.data(e,t,n)}else n=undefined}return n}function isEmptyDataObject(e){var t;for(t in e){if(t==="data"&&jQuery.isEmptyObject(e[t]))continue;if(t!=="toJSON")return!1}return!0}var rbrace=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,rmultiDash=/([A-Z])/g;jQuery.extend({cache:{},noData:{applet:!0,embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(e){return e=e.nodeType?jQuery.cache[e[jQuery.expando]]:e[jQuery.expando],!!e&&!isEmptyDataObject(e)},data:function(e,t,n){return internalData(e,t,n)},removeData:function(e,t){return internalRemoveData(e,t)},_data:function(e,t,n){return internalData(e,t,n,!0)},_removeData:function(e,t){return internalRemoveData(e,t,!0)},acceptData:function(e){if(e.nodeType&&e.nodeType!==1&&e.nodeType!==9)return!1;var t=e.nodeName&&jQuery.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),jQuery.fn.extend({data:function(e,t){var n,r,i=null,s=0,o=this[0];if(e===undefined){if(this.length){i=jQuery.data(o);if(o.nodeType===1&&!jQuery._data(o,"parsedAttrs")){n=o.attributes;for(;s<n.length;s++)r=n[s].name,r.indexOf("data-")===0&&(r=jQuery.camelCase(r.slice(5)),dataAttr(o,r,i[r]));jQuery._data(o,"parsedAttrs",!0)}}return i}return typeof e=="object"?this.each(function(){jQuery.data(this,e)}):arguments.length>1?this.each(function(){jQuery.data(this,e,t)}):o?dataAttr(o,e,jQuery.data(o,e)):null},removeData:function(e){return this.each(function(){jQuery.removeData(this,e)})}});