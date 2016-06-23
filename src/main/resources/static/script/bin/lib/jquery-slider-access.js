/*
* jQuery UI Slider Access
* By: Trent Richardson [http://trentrichardson.com]
* Version 0.3
* Last Modified: 10/20/2012
*
* Copyright 2011 Trent Richardson
* Dual licensed under the MIT and GPL licenses.
* http://trentrichardson.com/Impromptu/GPL-LICENSE.txt
* http://trentrichardson.com/Impromptu/MIT-LICENSE.txt
*
*/

(function(e){e.fn.extend({sliderAccess:function(t){return t=t||{},t.touchonly=t.touchonly!==undefined?t.touchonly:!0,t.touchonly!==!0||"ontouchend"in document?e(this).each(function(n,r){var i=e(this),s=e.extend({},{where:"after",step:i.slider("option","step"),upIcon:"ui-icon-plus",downIcon:"ui-icon-minus",text:!1,upText:"+",downText:"-",buttonset:!0,buttonsetTag:"span",isRTL:!1},t),o=e("<"+s.buttonsetTag+' class="ui-slider-access">'+'<button data-icon="'+s.downIcon+'" data-step="'+(s.isRTL?s.step:s.step*-1)+'">'+s.downText+"</button>"+'<button data-icon="'+s.upIcon+'" data-step="'+(s.isRTL?s.step*-1:s.step)+'">'+s.upText+"</button>"+"</"+s.buttonsetTag+">");o.children("button").each(function(t,n){var r=e(this);r.button({text:s.text,icons:{primary:r.data("icon")}}).click(function(e){var t=r.data("step"),n=i.slider("value"),s=n+=t*1,o=i.slider("option","min"),u=i.slider("option","max"),a=i.slider("option","slide")||function(){},f=i.slider("option","stop")||function(){};e.preventDefault();if(s<o||s>u)return;i.slider("value",s),a.call(i,null,{value:s}),f.call(i,null,{value:s})})}),i[s.where](o),s.buttonset&&(o.removeClass("ui-corner-right").removeClass("ui-corner-left").buttonset(),o.eq(0).addClass("ui-corner-left"),o.eq(1).addClass("ui-corner-right"));var u=o.css({marginLeft:s.where=="after"&&!s.isRTL||s.where=="before"&&s.isRTL?10:0,marginRight:s.where=="before"&&!s.isRTL||s.where=="after"&&s.isRTL?10:0}).outerWidth(!0)+5,a=i.outerWidth(!0);i.css("display","inline-block").width(a-u)}):e(this)}})})(jQuery);