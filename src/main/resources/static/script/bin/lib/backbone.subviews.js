/*
 * Backbone.Subviews, v0.5.1
 * Copyright (c)2013 Rotunda Software, LLC.
 * Distributed under MIT license
 * http://github.com/rotundasoftware/backbone.subviews
*/

(function(e,t){e.Subviews={},e.Subviews.add=function(e){function r(){this.subviews||(this.subviews={}),t.each(this.subviews,function(e){e.$el.detach()})}function i(){var e=this;this.subviewCreators=this.subviewCreators||{},this.$("div[data-subview]").each(function(){var n=$(this),r=n.attr("data-subview"),i;if(t.isUndefined(e.subviews[r])){var s=e.subviewCreators[r];if(t.isUndefined(s))throw new Error("Can not find subview creator for subview named: "+r);i=s.apply(e),e.subviews[r]=i}else i=e.subviews[r];n.replaceWith(i.$el)}),t.each(this.subviews,function(e){e.render()}),t.isFunction(this._onSubviewsRendered)&&this._onSubviewsRendered.call(this)}var n={render:e.render,remove:e.remove};e.render=function(){var e=Array.prototype.slice.call(arguments);r.call(this);var t=n.render.apply(this,e);return i.call(this),t},e.remove=function(){return this.subviews&&(t.each(this.subviews,function(e){e.remove()}),delete this.subviews),n.remove.call(this)}}})(Backbone,_);