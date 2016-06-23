/*
 Highstock JS v2.1.9 (2015-10-07)
 Exporting module

 (c) 2010-2014 Torstein Honsi

 License: www.highcharts.com/license
*/

(function(e){var t=e.Chart,n=e.addEvent,r=e.removeEvent,i=HighchartsAdapter.fireEvent,s=e.createElement,o=e.discardElement,u=e.css,a=e.merge,f=e.each,l=e.extend,c=e.splat,h=Math.max,p=document,d=window,v=e.isTouchDevice,m=e.Renderer.prototype.symbols,g=e.getOptions(),y;l(g.lang,{printChart:"Print chart",downloadPNG:"Download PNG image",downloadJPEG:"Download JPEG image",downloadPDF:"Download PDF document",downloadSVG:"Download SVG vector image",contextButtonTitle:"Chart context menu"}),g.navigation={menuStyle:{border:"1px solid #A0A0A0",background:"#FFFFFF",padding:"5px 0"},menuItemStyle:{padding:"0 10px",background:"none",color:"#303030",fontSize:v?"14px":"11px"},menuItemHoverStyle:{background:"#4572A5",color:"#FFFFFF"},buttonOptions:{symbolFill:"#E0E0E0",symbolSize:14,symbolStroke:"#666",symbolStrokeWidth:3,symbolX:12.5,symbolY:10.5,align:"right",buttonSpacing:3,height:22,theme:{fill:"white",stroke:"none"},verticalAlign:"top",width:24}},g.exporting={type:"image/png",url:"http://export.highcharts.com/",buttons:{contextButton:{menuClassName:"highcharts-contextmenu",symbol:"menu",_titleKey:"contextButtonTitle",menuItems:[{textKey:"printChart",onclick:function(){this.print()}},{separator:!0},{textKey:"downloadPNG",onclick:function(){this.exportChart()}},{textKey:"downloadJPEG",onclick:function(){this.exportChart({type:"image/jpeg"})}},{textKey:"downloadPDF",onclick:function(){this.exportChart({type:"application/pdf"})}},{textKey:"downloadSVG",onclick:function(){this.exportChart({type:"image/svg+xml"})}}]}}},e.post=function(e,t,n){var r,e=s("form",a({method:"post",action:e,enctype:"multipart/form-data"},n),{display:"none"},p.body);for(r in t)s("input",{type:"hidden",name:r,value:t[r]},null,e);e.submit(),o(e)},l(t.prototype,{sanitizeSVG:function(e){return e.replace(/zIndex="[^"]+"/g,"").replace(/isShadow="[^"]+"/g,"").replace(/symbolName="[^"]+"/g,"").replace(/jQuery[0-9]+="[^"]+"/g,"").replace(/url\([^#]+#/g,"url(#").replace(/<svg /,'<svg xmlns:xlink="http://www.w3.org/1999/xlink" ').replace(/ (NS[0-9]+\:)?href=/g," xlink:href=").replace(/\n/," ").replace(/<\/svg>.*?$/,"</svg>").replace(/(fill|stroke)="rgba\(([ 0-9]+,[ 0-9]+,[ 0-9]+),([ 0-9\.]+)\)"/g,'$1="rgb($2)" $1-opacity="$3"').replace(/&nbsp;/g," ").replace(/&shy;/g,"­").replace(/<IMG /g,"<image ").replace(/<(\/?)TITLE>/g,"<$1title>").replace(/height=([^" ]+)/g,'height="$1"').replace(/width=([^" ]+)/g,'width="$1"').replace(/hc-svg-href="([^"]+)">/g,'xlink:href="$1"/>').replace(/ id=([^" >]+)/g,' id="$1"').replace(/class=([^" >]+)/g,'class="$1"').replace(/ transform /g," ").replace(/:(path|rect)/g,"$1").replace(/style="([^"]+)"/g,function(e){return e.toLowerCase()})},getChartHTML:function(){return this.container.innerHTML},getSVG:function(t){var n=this,r,i,u,h,d,v=a(n.options,t),m=v.exporting.allowHTML;return p.createElementNS||(p.createElementNS=function(e,t){return p.createElement(t)}),i=s("div",null,{position:"absolute",top:"-9999em",width:n.chartWidth+"px",height:n.chartHeight+"px"},p.body),u=n.renderTo.style.width,d=n.renderTo.style.height,u=v.exporting.sourceWidth||v.chart.width||/px$/.test(u)&&parseInt(u,10)||600,d=v.exporting.sourceHeight||v.chart.height||/px$/.test(d)&&parseInt(d,10)||400,l(v.chart,{animation:!1,renderTo:i,forExport:!0,renderer:"SVGRenderer",width:u,height:d}),v.exporting.enabled=!1,delete v.data,v.series=[],f(n.series,function(e){h=a(e.options,{animation:!1,enableMouseTracking:!1,showCheckbox:!1,visible:e.visible}),h.isInternal||v.series.push(h)}),t&&f(["xAxis","yAxis"],function(e){f(c(t[e]),function(t,n){v[e][n]=a(v[e][n],t)})}),r=new e.Chart(v,n.callback),f(["xAxis","yAxis"],function(e){f(n[e],function(t,n){var i=r[e][n],s=t.getExtremes(),o=s.userMin,s=s.userMax;i&&(o!==void 0||s!==void 0)&&i.setExtremes(o,s,!0,!1)})}),u=r.getChartHTML(),v=null,r.destroy(),o(i),m&&(i=u.match(/<\/svg>(.*?$)/))&&(i='<foreignObject x="0" y="0" width="200" height="200"><body xmlns="http://www.w3.org/1999/xhtml">'+i[1]+"</body></foreignObject>",u=u.replace("</svg>",i+"</svg>")),u=this.sanitizeSVG(u),u=u.replace(/(url\(#highcharts-[0-9]+)&quot;/g,"$1").replace(/&quot;/g,"'")},getSVGForExport:function(e,t){var n=this.options.exporting;return this.getSVG(a({chart:{borderRadius:0}},n.chartOptions,t,{exporting:{sourceWidth:e&&e.sourceWidth||n.sourceWidth,sourceHeight:e&&e.sourceHeight||n.sourceHeight}}))},exportChart:function(t,n){var r=this.getSVGForExport(t,n),t=a(this.options.exporting,t);e.post(t.url,{filename:t.filename||"chart",type:t.type,width:t.width||0,scale:t.scale||2,svg:r},t.formAttributes)},print:function(){var e=this,t=e.container,n=[],r=t.parentNode,s=p.body,o=s.childNodes;e.isPrinting||(e.isPrinting=!0,i(e,"beforePrint"),f(o,function(e,t){e.nodeType===1&&(n[t]=e.style.display,e.style.display="none")}),s.appendChild(t),d.focus(),d.print(),setTimeout(function(){r.appendChild(t),f(o,function(e,t){e.nodeType===1&&(e.style.display=n[t])}),e.isPrinting=!1,i(e,"afterPrint")},1e3))},contextMenu:function(e,t,i,o,a,c,p){var d=this,v=d.options.navigation,m=v.menuItemStyle,g=d.chartWidth,y=d.chartHeight,b="cache-"+e,w=d[b],E=h(a,c),S,x,T,N=function(t){d.pointer.inClass(t.target,e)||x()};w||(d[b]=w=s("div",{className:e},{position:"absolute",zIndex:1e3,padding:E+"px"},d.container),S=s("div",null,l({MozBoxShadow:"3px 3px 10px #888",WebkitBoxShadow:"3px 3px 10px #888",boxShadow:"3px 3px 10px #888"},v.menuStyle),w),x=function(){u(w,{display:"none"}),p&&p.setState(0),d.openMenu=!1},n(w,"mouseleave",function(){T=setTimeout(x,500)}),n(w,"mouseenter",function(){clearTimeout(T)}),n(document,"mouseup",N),n(d,"destroy",function(){r(document,"mouseup",N)}),f(t,function(e){if(e){var t=e.separator?s("hr",null,null,S):s("div",{onmouseover:function(){u(this,v.menuItemHoverStyle)},onmouseout:function(){u(this,m)},onclick:function(t){t.stopPropagation(),x(),e.onclick&&e.onclick.apply(d,arguments)},innerHTML:e.text||d.options.lang[e.textKey]},l({cursor:"pointer"},m),S);d.exportDivElements.push(t)}}),d.exportDivElements.push(S,w),d.exportMenuWidth=w.offsetWidth,d.exportMenuHeight=w.offsetHeight),t={display:"block"},i+d.exportMenuWidth>g?t.right=g-i-a-E+"px":t.left=i-E+"px",o+c+d.exportMenuHeight>y&&p.alignOptions.verticalAlign!=="top"?t.bottom=y-o-E+"px":t.top=o+c-E+"px",u(w,t),d.openMenu=!0},addButton:function(t){var n=this,r=n.renderer,i=a(n.options.navigation.buttonOptions,t),s=i.onclick,o=i.menuItems,u,f,c={stroke:i.symbolStroke,fill:i.symbolFill},h=i.symbolSize||12;n.btnCount||(n.btnCount=0),n.exportDivElements||(n.exportDivElements=[],n.exportSVGElements=[]);if(i.enabled!==!1){var p=i.theme,d=p.states,v=d&&d.hover,d=d&&d.select,m;delete p.states,s?m=function(e){e.stopPropagation(),s.call(n,e)}:o&&(m=function(){n.contextMenu(f.menuClassName,o,f.translateX,f.translateY,f.width,f.height,f),f.setState(2)}),i.text&&i.symbol?p.paddingLeft=e.pick(p.paddingLeft,25):i.text||l(p,{width:i.width,height:i.height,padding:0}),f=r.button(i.text,0,0,m,p,v,d).attr({title:n.options.lang[i._titleKey],"stroke-linecap":"round"}),f.menuClassName=t.menuClassName||"highcharts-menu-"+n.btnCount++,i.symbol&&(u=r.symbol(i.symbol,i.symbolX-h/2,i.symbolY-h/2,h,h).attr(l(c,{"stroke-width":i.symbolStrokeWidth||1,zIndex:1})).add(f)),f.add().align(l(i,{width:f.width,x:e.pick(i.x,y)}),!0,"spacingBox"),y+=(f.width+i.buttonSpacing)*(i.align==="right"?-1:1),n.exportSVGElements.push(f,u)}},destroyExport:function(e){var e=e.target,t,n;for(t=0;t<e.exportSVGElements.length;t++)if(n=e.exportSVGElements[t])n.onclick=n.ontouchstart=null,e.exportSVGElements[t]=n.destroy();for(t=0;t<e.exportDivElements.length;t++)n=e.exportDivElements[t],r(n,"mouseleave"),e.exportDivElements[t]=n.onmouseout=n.onmouseover=n.ontouchstart=n.onclick=null,o(n)}}),m.menu=function(e,t,n,r){return["M",e,t+2.5,"L",e+n,t+2.5,"M",e,t+r/2+.5,"L",e+n,t+r/2+.5,"M",e,t+r-1.5,"L",e+n,t+r-1.5]},t.prototype.callbacks.push(function(e){var t,r=e.options.exporting,i=r.buttons;y=0;if(r.enabled!==!1){for(t in i)e.addButton(i[t]);n(e,"destroy",e.destroyExport)}})})(Highcharts);