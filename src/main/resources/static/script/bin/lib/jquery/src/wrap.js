jQuery.fn.extend({wrapAll:function(e){if(jQuery.isFunction(e))return this.each(function(t){jQuery(this).wrapAll(e.call(this,t))});if(this[0]){var t=jQuery(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstChild&&e.firstChild.nodeType===1)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return jQuery.isFunction(e)?this.each(function(t){jQuery(this).wrapInner(e.call(this,t))}):this.each(function(){var t=jQuery(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=jQuery.isFunction(e);return this.each(function(n){jQuery(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){jQuery.nodeName(this,"body")||jQuery(this).replaceWith(this.childNodes)}).end()}});