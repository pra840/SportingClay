/*
 Highcharts JS v4.1.9 (2015-10-07)

 (c) 2009-2014 Torstein Honsi

 License: www.highcharts.com/license
*/

(function(e,t){function n(e,t,n){this.init.call(this,e,t,n)}var r=e.arrayMin,i=e.arrayMax,s=e.each,o=e.extend,u=e.merge,a=e.map,f=e.pick,l=e.pInt,c=e.getOptions().plotOptions,h=e.seriesTypes,p=e.extendClass,d=e.splat,v=e.wrap,m=e.Axis,g=e.Tick,y=e.Point,b=e.Pointer,w=e.CenteredSeriesMixin,E=e.TrackerMixin,S=e.Series,x=Math,T=x.round,N=x.floor,C=x.max,k=e.Color,L=function(){};o(n.prototype,{init:function(e,t,n){var r=this,i=r.defaultOptions;r.chart=t,r.options=e=u(i,t.angular?{background:{}}:void 0,e),(e=e.background)&&s([].concat(d(e)).reverse(),function(e){var t=e.backgroundColor,i=n.userOptions,e=u(r.defaultBackgroundOptions,e);t&&(e.backgroundColor=t),e.color=e.backgroundColor,n.options.plotBands.unshift(e),i.plotBands=i.plotBands||[],i.plotBands!==n.options.plotBands&&i.plotBands.unshift(e)})},defaultOptions:{center:["50%","50%"],size:"85%",startAngle:0},defaultBackgroundOptions:{shape:"circle",borderWidth:1,borderColor:"silver",backgroundColor:{linearGradient:{x1:0,y1:0,x2:0,y2:1},stops:[[0,"#FFF"],[1,"#DDD"]]},from:-Number.MAX_VALUE,innerRadius:0,to:Number.MAX_VALUE,outerRadius:"105%"}});var A=m.prototype,g=g.prototype,O={getOffset:L,redraw:function(){this.isDirty=!1},render:function(){this.isDirty=!1},setScale:L,setCategories:L,setTitle:L},M={isRadial:!0,defaultRadialGaugeOptions:{labels:{align:"center",x:0,y:null},minorGridLineWidth:0,minorTickInterval:"auto",minorTickLength:10,minorTickPosition:"inside",minorTickWidth:1,tickLength:10,tickPosition:"inside",tickWidth:2,title:{rotation:0},zIndex:2},defaultRadialXOptions:{gridLineWidth:1,labels:{align:null,distance:15,x:0,y:null},maxPadding:0,minPadding:0,showLastLabel:!1,tickLength:0},defaultRadialYOptions:{gridLineInterpolation:"circle",labels:{align:"right",x:-3,y:-2},showLastLabel:!1,title:{x:4,text:null,rotation:90}},setOptions:function(e){e=this.options=u(this.defaultOptions,this.defaultRadialOptions,e),e.plotBands||(e.plotBands=[])},getOffset:function(){A.getOffset.call(this),this.chart.axisOffset[this.side]=0,this.center=this.pane.center=w.getCenter.call(this.pane)},getLinePath:function(e,t){var n=this.center,t=f(t,n[2]/2-this.offset);return this.chart.renderer.symbols.arc(this.left+n[0],this.top+n[1],t,t,{start:this.startAngleRad,end:this.endAngleRad,open:!0,innerR:0})},setAxisTranslation:function(){A.setAxisTranslation.call(this),this.center&&(this.transA=this.isCircular?(this.endAngleRad-this.startAngleRad)/(this.max-this.min||1):this.center[2]/2/(this.max-this.min||1),this.minPixelPadding=this.isXAxis?this.transA*this.minPointOffset:0)},beforeSetTickPositions:function(){this.autoConnect&&(this.max+=this.categories&&1||this.pointRange||this.closestPointRange||0)},setAxisSize:function(){A.setAxisSize.call(this),this.isRadial&&(this.center=this.pane.center=e.CenteredSeriesMixin.getCenter.call(this.pane),this.isCircular&&(this.sector=this.endAngleRad-this.startAngleRad),this.len=this.width=this.height=this.center[2]*f(this.sector,1)/2)},getPosition:function(e,t){return this.postTranslate(this.isCircular?this.translate(e):0,f(this.isCircular?t:this.translate(e),this.center[2]/2)-this.offset)},postTranslate:function(e,t){var n=this.chart,r=this.center,e=this.startAngleRad+e;return{x:n.plotLeft+r[0]+Math.cos(e)*t,y:n.plotTop+r[1]+Math.sin(e)*t}},getPlotBandPath:function(e,t,n){var r=this.center,i=this.startAngleRad,s=r[2]/2,o=[f(n.outerRadius,"100%"),n.innerRadius,f(n.thickness,10)],u=/%$/,c,h=this.isCircular;return this.options.gridLineInterpolation==="polygon"?r=this.getPlotLinePath(e).concat(this.getPlotLinePath(t,!0)):(e=Math.max(e,this.min),t=Math.min(t,this.max),h||(o[0]=this.translate(e),o[1]=this.translate(t)),o=a(o,function(e){return u.test(e)&&(e=l(e,10)*s/100),e}),n.shape==="circle"||!h?(e=-Math.PI/2,t=Math.PI*1.5,c=!0):(e=i+this.translate(e),t=i+this.translate(t)),r=this.chart.renderer.symbols.arc(this.left+r[0],this.top+r[1],o[0],o[0],{start:Math.min(e,t),end:Math.max(e,t),innerR:f(o[1],o[0]-o[2]),open:c})),r},getPlotLinePath:function(e,t){var n=this,r=n.center,i=n.chart,o=n.getPosition(e),u,a,f;return n.isCircular?f=["M",r[0]+i.plotLeft,r[1]+i.plotTop,"L",o.x,o.y]:n.options.gridLineInterpolation==="circle"?(e=n.translate(e))&&(f=n.getLinePath(0,e)):(s(i.xAxis,function(e){e.pane===n.pane&&(u=e)}),f=[],e=n.translate(e),r=u.tickPositions,u.autoConnect&&(r=r.concat([r[0]])),t&&(r=[].concat(r).reverse()),s(r,function(t,n){a=u.getPosition(t,e),f.push(n?"L":"M",a.x,a.y)})),f},getTitlePosition:function(){var e=this.center,t=this.chart,n=this.options.title;return{x:t.plotLeft+e[0]+(n.x||0),y:t.plotTop+e[1]-{high:.5,middle:.25,low:0}[n.align]*e[2]+(n.y||0)}}};v(A,"init",function(e,r,i){var s,a=r.angular,l=r.polar,c=i.isX,h=a&&c,p,v;v=r.options;var m=i.pane||0;if(a){if(o(this,h?O:M),p=!c)this.defaultRadialOptions=this.defaultRadialGaugeOptions}else l&&(o(this,M),this.defaultRadialOptions=(p=c)?this.defaultRadialXOptions:u(this.defaultYAxisOptions,this.defaultRadialYOptions));e.call(this,r,i),!h&&(a||l)&&(e=this.options,r.panes||(r.panes=[]),this.pane=(s=r.panes[m]=r.panes[m]||new n(d(v.pane)[m],r,this),m=s),m=m.options,r.inverted=!1,v.chart.zoomType=null,this.startAngleRad=r=(m.startAngle-90)*Math.PI/180,this.endAngleRad=v=(f(m.endAngle,m.startAngle+360)-90)*Math.PI/180,this.offset=e.offset||0,(this.isCircular=p)&&i.max===t&&v-r===2*Math.PI&&(this.autoConnect=!0))}),v(g,"getPosition",function(e,t,n,r,i){var s=this.axis;return s.getPosition?s.getPosition(n):e.call(this,t,n,r,i)}),v(g,"getLabelPosition",function(e,t,n,r,i,s,o,u,a){var l=this.axis,c=s.y,h=20,p=s.align,d=(l.translate(this.pos)+l.startAngleRad+Math.PI/2)/Math.PI*180%360;return l.isRadial?(e=l.getPosition(this.pos,l.center[2]/2+f(s.distance,-25)),s.rotation==="auto"?r.attr({rotation:d}):c===null&&(c=l.chart.renderer.fontMetrics(r.styles.fontSize).b-r.getBBox().height/2),p===null&&(l.isCircular?(this.label.getBBox().width>l.len*l.tickInterval/(l.max-l.min)&&(h=0),p=d>h&&d<180-h?"left":d>180+h&&d<360-h?"right":"center"):p="center",r.attr({align:p})),e.x+=s.x,e.y+=c):e=e.call(this,t,n,r,i,s,o,u,a),e}),v(g,"getMarkPath",function(e,t,n,r,i,s,o){var u=this.axis;return u.isRadial?(e=u.getPosition(this.pos,u.center[2]/2+r),t=["M",t,n,"L",e.x,e.y]):t=e.call(this,t,n,r,i,s,o),t}),c.arearange=u(c.area,{lineWidth:1,marker:null,threshold:null,tooltip:{pointFormat:'<span style="color:{series.color}">●</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'},trackByArea:!0,dataLabels:{align:null,verticalAlign:null,xLow:0,xHigh:0,yLow:0,yHigh:0},states:{hover:{halo:!1}}}),h.arearange=p(h.area,{type:"arearange",pointArrayMap:["low","high"],dataLabelCollections:["dataLabel","dataLabelUpper"],toYData:function(e){return[e.low,e.high]},pointValKey:"low",deferTranslatePolar:!0,highToXY:function(e){var t=this.chart,n=this.xAxis.postTranslate(e.rectPlotX,this.yAxis.len-e.plotHigh);e.plotHighX=n.x-t.plotLeft,e.plotHigh=n.y-t.plotTop},getSegments:function(){var e=this;s(e.points,function(t){!!e.options.connectNulls||t.low!==null&&t.high!==null?t.low===null&&t.high!==null&&(t.y=t.high):t.y=null}),S.prototype.getSegments.call(this)},translate:function(){var e=this,t=e.yAxis;h.area.prototype.translate.apply(e),s(e.points,function(e){var n=e.low,r=e.high,i=e.plotY;r===null&&n===null?e.y=null:n===null?(e.plotLow=e.plotY=null,e.plotHigh=t.translate(r,0,1,0,1)):r===null?(e.plotLow=i,e.plotHigh=null):(e.plotLow=i,e.plotHigh=t.translate(r,0,1,0,1))}),this.chart.polar&&s(this.points,function(t){e.highToXY(t)})},getSegmentPath:function(e){var t,n=[],r=e.length,i=S.prototype.getSegmentPath,s,o;o=this.options;var u=o.step;for(t=HighchartsAdapter.grep(e,function(e){return e.plotLow!==null});r--;)s=e[r],s.plotHigh!==null&&n.push({plotX:s.plotHighX||s.plotX,plotY:s.plotHigh});return e=i.call(this,t),u&&(u===!0&&(u="left"),o.step={left:"right",center:"center",right:"left"}[u]),n=i.call(this,n),o.step=u,o=[].concat(e,n),this.chart.polar||(n[0]="L"),this.areaPath=this.areaPath.concat(e,n),o},drawDataLabels:function(){var e=this.data,t=e.length,n,r=[],i=S.prototype,s=this.options.dataLabels,o=s.align,u=s.inside,a,f,l=this.chart.inverted;if(s.enabled||this._hasPointLabels){for(n=t;n--;)if(a=e[n])(f=u?a.plotHigh<a.plotLow:a.plotHigh>a.plotLow,a.y=a.high,a._plotY=a.plotY,a.plotY=a.plotHigh,r[n]=a.dataLabel,a.dataLabel=a.dataLabelUpper,a.below=f,l)?(o||(s.align=f?"right":"left"),s.x=s.xHigh):s.y=s.yHigh;i.drawDataLabels&&i.drawDataLabels.apply(this,arguments);for(n=t;n--;)if(a=e[n])(f=u?a.plotHigh<a.plotLow:a.plotHigh>a.plotLow,a.dataLabelUpper=a.dataLabel,a.dataLabel=r[n],a.y=a.low,a.plotY=a._plotY,a.below=!f,l)?(o||(s.align=f?"left":"right"),s.x=s.xLow):s.y=s.yLow;i.drawDataLabels&&i.drawDataLabels.apply(this,arguments)}s.align=o},alignDataLabel:function(){h.column.prototype.alignDataLabel.apply(this,arguments)},setStackedPoints:L,getSymbol:L,drawPoints:L}),c.areasplinerange=u(c.arearange),h.areasplinerange=p(h.arearange,{type:"areasplinerange",getPointSpline:h.spline.prototype.getPointSpline}),function(){var e=h.column.prototype;c.columnrange=u(c.column,c.arearange,{lineWidth:1,pointRange:null}),h.columnrange=p(h.arearange,{type:"columnrange",translate:function(){var t=this,n=t.yAxis,r;e.translate.apply(t),s(t.points,function(e){var i=e.shapeArgs,s=t.options.minPointLength,o;e.tooltipPos=null,e.plotHigh=r=n.translate(e.high,0,1,0,1),e.plotLow=e.plotY,o=r,e=e.plotY-r,Math.abs(e)<s?(s-=e,e+=s,o-=s/2):e<0&&(e*=-1,o-=e),i.height=e,i.y=o})},directTouch:!0,trackerGroups:["group","dataLabelsGroup"],drawGraph:L,crispCol:e.crispCol,pointAttrToOptions:e.pointAttrToOptions,drawPoints:e.drawPoints,drawTracker:e.drawTracker,animate:e.animate,getColumnMetrics:e.getColumnMetrics})}(),c.gauge=u(c.line,{dataLabels:{enabled:!0,defer:!1,y:15,borderWidth:1,borderColor:"silver",borderRadius:3,crop:!1,verticalAlign:"top",zIndex:2},dial:{},pivot:{},tooltip:{headerFormat:""},showInLegend:!1}),E={type:"gauge",pointClass:p(y,{setState:function(e){this.state=e}}),angular:!0,drawGraph:L,fixedBox:!0,forceDL:!0,trackerGroups:["group","dataLabelsGroup"],translate:function(){var e=this.yAxis,t=this.options,n=e.center;this.generatePoints(),s(this.points,function(r){var i=u(t.dial,r.dial),s=l(f(i.radius,80))*n[2]/200,o=l(f(i.baseLength,70))*s/100,a=l(f(i.rearLength,10))*s/100,c=i.baseWidth||3,h=i.topWidth||1,p=t.overshoot,d=e.startAngleRad+e.translate(r.y,null,null,null,!0);p&&typeof p=="number"?(p=p/180*Math.PI,d=Math.max(e.startAngleRad-p,Math.min(e.endAngleRad+p,d))):t.wrap===!1&&(d=Math.max(e.startAngleRad,Math.min(e.endAngleRad,d))),d=d*180/Math.PI,r.shapeType="path",r.shapeArgs={d:i.path||["M",-a,-c/2,"L",o,-c/2,s,-h/2,s,h/2,o,c/2,-a,c/2,"z"],translateX:n[0],translateY:n[1],rotation:d},r.plotX=n[0],r.plotY=n[1]})},drawPoints:function(){var e=this,t=e.yAxis.center,n=e.pivot,r=e.options,i=r.pivot,o=e.chart.renderer;s(e.points,function(t){var n=t.graphic,i=t.shapeArgs,s=i.d,a=u(r.dial,t.dial);n?(n.animate(i),i.d=s):t.graphic=o[t.shapeType](i).attr({stroke:a.borderColor||"none","stroke-width":a.borderWidth||0,fill:a.backgroundColor||"black",rotation:i.rotation}).add(e.group)}),n?n.animate({translateX:t[0],translateY:t[1]}):e.pivot=o.circle(0,0,f(i.radius,5)).attr({"stroke-width":i.borderWidth||0,stroke:i.borderColor||"silver",fill:i.backgroundColor||"black"}).translate(t[0],t[1]).add(e.group)},animate:function(e){var t=this;e||(s(t.points,function(e){var n=e.graphic;n&&(n.attr({rotation:t.yAxis.startAngleRad*180/Math.PI}),n.animate({rotation:e.shapeArgs.rotation},t.options.animation))}),t.animate=null)},render:function(){this.group=this.plotGroup("group","series",this.visible?"visible":"hidden",this.options.zIndex,this.chart.seriesGroup),S.prototype.render.call(this),this.group.clip(this.chart.clipRect)},setData:function(e,t){S.prototype.setData.call(this,e,!1),this.processData(),this.generatePoints(),f(t,!0)&&this.chart.redraw()},drawTracker:E&&E.drawTrackerPoint},h.gauge=p(h.line,E),c.boxplot=u(c.column,{fillColor:"#FFFFFF",lineWidth:1,medianWidth:2,states:{hover:{brightness:-0.3}},threshold:null,tooltip:{pointFormat:'<span style="color:{point.color}">●</span> <b> {series.name}</b><br/>Maximum: {point.high}<br/>Upper quartile: {point.q3}<br/>Median: {point.median}<br/>Lower quartile: {point.q1}<br/>Minimum: {point.low}<br/>'},whiskerLength:"50%",whiskerWidth:2}),h.boxplot=p(h.column,{type:"boxplot",pointArrayMap:["low","q1","median","q3","high"],toYData:function(e){return[e.low,e.q1,e.median,e.q3,e.high]},pointValKey:"high",pointAttrToOptions:{fill:"fillColor",stroke:"color","stroke-width":"lineWidth"},drawDataLabels:L,translate:function(){var e=this.yAxis,t=this.pointArrayMap;h.column.prototype.translate.apply(this),s(this.points,function(n){s(t,function(t){n[t]!==null&&(n[t+"Plot"]=e.translate(n[t],0,1,0,1))})})},drawPoints:function(){var e=this,n=e.options,r=e.chart.renderer,i,o,u,a,l,c,h,p,d,v,m,g,y,b,w,E,S,x,C,k,L,A,O=e.doQuartiles!==!1,M,_=e.options.whiskerLength;s(e.points,function(s){d=s.graphic,L=s.shapeArgs,m={},b={},E={},A=s.color||e.color,s.plotY!==t&&((i=s.pointAttr[s.selected?"selected":""],S=L.width,x=N(L.x),C=x+S,k=T(S/2),o=N(O?s.q1Plot:s.lowPlot),u=N(O?s.q3Plot:s.lowPlot),a=N(s.highPlot),l=N(s.lowPlot),m.stroke=s.stemColor||n.stemColor||A,m["stroke-width"]=f(s.stemWidth,n.stemWidth,n.lineWidth),m.dashstyle=s.stemDashStyle||n.stemDashStyle,b.stroke=s.whiskerColor||n.whiskerColor||A,b["stroke-width"]=f(s.whiskerWidth,n.whiskerWidth,n.lineWidth),E.stroke=s.medianColor||n.medianColor||A,E["stroke-width"]=f(s.medianWidth,n.medianWidth,n.lineWidth),h=m["stroke-width"]%2/2,p=x+k+h,v=["M",p,u,"L",p,a,"M",p,o,"L",p,l],O&&(h=i["stroke-width"]%2/2,p=N(p)+h,o=N(o)+h,u=N(u)+h,x+=h,C+=h,g=["M",x,u,"L",x,o,"L",C,o,"L",C,u,"L",x,u,"z"]),_&&(h=b["stroke-width"]%2/2,a+=h,l+=h,M=/%$/.test(_)?k*parseFloat(_)/100:_/2,y=["M",p-M,a,"L",p+M,a,"M",p-M,l,"L",p+M,l]),h=E["stroke-width"]%2/2,c=T(s.medianPlot)+h,w=["M",x,c,"L",C,c],d)?(s.stem.animate({d:v}),_&&s.whiskers.animate({d:y}),O&&s.box.animate({d:g}),s.medianShape.animate({d:w})):(s.graphic=d=r.g().add(e.group),s.stem=r.path(v).attr(m).add(d),_&&(s.whiskers=r.path(y).attr(b).add(d)),O&&(s.box=r.path(g).attr(i).add(d)),s.medianShape=r.path(w).attr(E).add(d)))})},setStackedPoints:L}),c.errorbar=u(c.boxplot,{color:"#000000",grouping:!1,linkedTo:":previous",tooltip:{pointFormat:'<span style="color:{point.color}">●</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'},whiskerWidth:null}),h.errorbar=p(h.boxplot,{type:"errorbar",pointArrayMap:["low","high"],toYData:function(e){return[e.low,e.high]},pointValKey:"high",doQuartiles:!1,drawDataLabels:h.arearange?h.arearange.prototype.drawDataLabels:L,getColumnMetrics:function(){return this.linkedParent&&this.linkedParent.columnMetrics||h.column.prototype.getColumnMetrics.call(this)}}),c.waterfall=u(c.column,{lineWidth:1,lineColor:"#333",dashStyle:"dot",borderColor:"#333",dataLabels:{inside:!0},states:{hover:{lineWidthPlus:0}}}),h.waterfall=p(h.column,{type:"waterfall",upColorProp:"fill",pointValKey:"y",translate:function(){var e=this.options,t=this.yAxis,n,r,i,s,o,u,a,f,l,c=e.threshold,p=e.stacking;h.column.prototype.translate.apply(this),a=f=c,r=this.points;for(n=0,e=r.length;n<e;n++)i=r[n],u=this.processedYData[n],s=i.shapeArgs,l=(o=p&&t.stacks[(this.negStacks&&u<c?"-":"")+this.stackKey])?o[i.x].points[this.index+","+n]:[0,u],i.isSum?i.y=u:i.isIntermediateSum&&(i.y=u-f),o=C(a,a+i.y)+l[0],s.y=t.translate(o,0,1),i.isSum?(s.y=t.translate(l[1],0,1),s.height=Math.min(t.translate(l[0],0,1),t.len)-s.y):i.isIntermediateSum?(s.y=t.translate(l[1],0,1),s.height=Math.min(t.translate(f,0,1),t.len)-s.y,f=l[1]):(a!==0&&(s.height=u>0?t.translate(a,0,1)-s.y:t.translate(a,0,1)-t.translate(a-u,0,1)),a+=u),s.height<0&&(s.y+=s.height,s.height*=-1),i.plotY=s.y=T(s.y)-this.borderWidth%2/2,s.height=C(T(s.height),.001),i.yBottom=s.y+s.height,s=i.plotY+(i.negative?s.height:0),this.chart.inverted?i.tooltipPos[0]=t.len-s:i.tooltipPos[1]=s},processData:function(e){var t=this.yData,n=this.options.data,r,i=t.length,s,o,u,a,f,l;o=s=u=a=this.options.threshold||0;for(l=0;l<i;l++)f=t[l],r=n&&n[l]?n[l]:{},f==="sum"||r.isSum?t[l]=o:f==="intermediateSum"||r.isIntermediateSum?t[l]=s:(o+=f,s+=f),u=Math.min(o,u),a=Math.max(o,a);S.prototype.processData.call(this,e),this.dataMin=u,this.dataMax=a},toYData:function(e){return e.isSum?e.x===0?null:"sum":e.isIntermediateSum?e.x===0?null:"intermediateSum":e.y},getAttribs:function(){h.column.prototype.getAttribs.apply(this,arguments);var t=this,n=t.options,r=n.states,i=n.upColor||t.color,n=e.Color(i).brighten(.1).get(),o=u(t.pointAttr),a=t.upColorProp;o[""][a]=i,o.hover[a]=r.hover.upColor||n,o.select[a]=r.select.upColor||i,s(t.points,function(e){e.options.color||(e.y>0?(e.pointAttr=o,e.color=i):e.pointAttr=t.pointAttr)})},getGraphPath:function(){var e=this.data,t=e.length,n=T(this.options.lineWidth+this.borderWidth)%2/2,r=[],i,s,o;for(o=1;o<t;o++)s=e[o].shapeArgs,i=e[o-1].shapeArgs,s=["M",i.x+i.width,i.y+n,"L",s.x,i.y+n],e[o-1].y<0&&(s[2]+=i.height,s[5]+=i.height),r=r.concat(s);return r},getExtremes:L,drawGraph:S.prototype.drawGraph}),c.polygon=u(c.scatter,{marker:{enabled:!1}}),h.polygon=p(h.scatter,{type:"polygon",fillGraph:!0,getSegmentPath:function(e){return S.prototype.getSegmentPath.call(this,e).concat("z")},drawGraph:S.prototype.drawGraph,drawLegendSymbol:e.LegendSymbolMixin.drawRectangle}),c.bubble=u(c.scatter,{dataLabels:{formatter:function(){return this.point.z},inside:!0,verticalAlign:"middle"},marker:{lineColor:null,lineWidth:1},minSize:8,maxSize:"20%",softThreshold:!1,states:{hover:{halo:{size:5}}},tooltip:{pointFormat:"({point.x}, {point.y}), Size: {point.z}"},turboThreshold:0,zThreshold:0,zoneAxis:"z"}),E=p(y,{haloPath:function(){return y.prototype.haloPath.call(this,this.shapeArgs.r+this.series.options.states.hover.halo.size)},ttBelow:!1}),h.bubble=p(h.scatter,{type:"bubble",pointClass:E,pointArrayMap:["y","z"],parallelArrays:["x","y","z"],trackerGroups:["group","dataLabelsGroup"],bubblePadding:!0,zoneAxis:"z",pointAttrToOptions:{stroke:"lineColor","stroke-width":"lineWidth",fill:"fillColor"},applyOpacity:function(e){var t=this.options.marker,n=f(t.fillOpacity,.5),e=e||t.fillColor||this.color;return n!==1&&(e=k(e).setOpacity(n).get("rgba")),e},convertAttribs:function(){var e=S.prototype.convertAttribs.apply(this,arguments);return e.fill=this.applyOpacity(e.fill),e},getRadii:function(e,t,n,r){var i,s,o,u=this.zData,a=[],f=this.options,l=f.sizeBy!=="width",c=f.zThreshold,h=t-e;for(s=0,i=u.length;s<i;s++)o=u[s],f.sizeByAbsoluteValue&&(o=Math.abs(o-c),t=Math.max(t-c,Math.abs(e-c)),e=0),o===null?o=null:o<e?o=n/2-1:(o=h>0?(o-e)/h:.5,l&&o>=0&&(o=Math.sqrt(o)),o=x.ceil(n+o*(r-n))/2),a.push(o);this.radii=a},animate:function(e){var t=this.options.animation;e||(s(this.points,function(e){var n=e.graphic,e=e.shapeArgs;n&&e&&(n.attr("r",1),n.animate({r:e.r},t))}),this.animate=null)},translate:function(){var e,n=this.data,r,i,s=this.radii;h.scatter.prototype.translate.call(this);for(e=n.length;e--;)r=n[e],i=s?s[e]:0,typeof i=="number"&&i>=this.minPxSize/2?(r.shapeType="circle",r.shapeArgs={x:r.plotX,y:r.plotY,r:i},r.dlBox={x:r.plotX-i,y:r.plotY-i,width:2*i,height:2*i}):r.shapeArgs=r.plotY=r.dlBox=t},drawLegendSymbol:function(e,t){var n=l(e.itemStyle.fontSize)/2;t.legendSymbol=this.chart.renderer.circle(n,e.baseline-n,n).attr({zIndex:3}).add(t.legendGroup),t.legendSymbol.isMarker=!0},drawPoints:h.column.prototype.drawPoints,alignDataLabel:h.column.prototype.alignDataLabel,buildKDTree:L,applyZones:L}),m.prototype.beforePadding=function(){var e=this,n=this.len,o=this.chart,u=0,a=n,c=this.isXAxis,h=c?"xData":"yData",p=this.min,d={},v=x.min(o.plotWidth,o.plotHeight),m=Number.MAX_VALUE,g=-Number.MAX_VALUE,y=this.max-p,b=n/y,w=[];s(this.series,function(t){var n=t.options;t.bubblePadding&&(t.visible||!o.options.chart.ignoreHiddenSeries)&&(e.allowZoomOutside=!0,w.push(t),c)&&(s(["minSize","maxSize"],function(e){var t=n[e],r=/%$/.test(t),t=l(t);d[e]=r?v*t/100:t}),t.minPxSize=d.minSize,t.maxPxSize=d.maxSize,t=t.zData,t.length&&(m=f(n.zMin,x.min(m,x.max(r(t),n.displayNegative===!1?n.zThreshold:-Number.MAX_VALUE))),g=f(n.zMax,x.max(g,i(t)))))}),s(w,function(e){var t=e[h],n=t.length,r;c&&e.getRadii(m,g,e.minPxSize,e.maxPxSize);if(y>0)for(;n--;)typeof t[n]=="number"&&(r=e.radii[n],u=Math.min((t[n]-p)*b-r,u),a=Math.max((t[n]-p)*b+r,a))}),w.length&&y>0&&!this.isLog&&(a-=n,b*=(n+u-a)/n,s([["min","userMin",u],["max","userMax",a]],function(n){f(e.options[n[0]],e[n[1]])===t&&(e[n[0]]+=n[2]/b)}))},function(){function e(e,t,n){e.call(this,t,n),this.chart.polar&&(this.closeSegment=function(e){var t=this.xAxis.center;e.push("L",t[0],t[1])},this.closedStacks=!0)}function t(e,t){var n=this.chart,r=this.options.animation,i=this.group,s=this.markerGroup,o=this.xAxis.center,u=n.plotLeft,a=n.plotTop;n.polar?n.renderer.isSVG&&(r===!0&&(r={}),t?(n={translateX:o[0]+u,translateY:o[1]+a,scaleX:.001,scaleY:.001},i.attr(n),s&&s.attr(n)):(n={translateX:u,translateY:a,scaleX:1,scaleY:1},i.animate(n,r),s&&s.animate(n,r),this.animate=null)):e.call(this,t)}var n=S.prototype,r=b.prototype,i;n.searchPointByAngle=function(e){var t=this.chart,n=this.xAxis.pane.center;return this.searchKDTree({clientX:180+Math.atan2(e.chartX-n[0]-t.plotLeft,e.chartY-n[1]-t.plotTop)*(-180/Math.PI)})},v(n,"buildKDTree",function(e){this.chart.polar&&(this.kdByAngle?this.searchPoint=this.searchPointByAngle:this.kdDimensions=2),e.apply(this)}),n.toXY=function(e){var t,n=this.chart,r=e.plotX;t=e.plotY,e.rectPlotX=r,e.rectPlotY=t,t=this.xAxis.postTranslate(e.plotX,this.yAxis.len-t),e.plotX=e.polarPlotX=t.x-n.plotLeft,e.plotY=e.polarPlotY=t.y-n.plotTop,this.kdByAngle?(n=(r/Math.PI*180+this.xAxis.pane.options.startAngle)%360,n<0&&(n+=360),e.clientX=n):e.clientX=e.plotX},h.area&&v(h.area.prototype,"init",e),h.areaspline&&v(h.areaspline.prototype,"init",e),h.spline&&v(h.spline.prototype,"getPointSpline",function(e,t,n,r){var i,s,o,u,a,f,l;return this.chart.polar?(i=n.plotX,s=n.plotY,e=t[r-1],o=t[r+1],this.connectEnds&&(e||(e=t[t.length-2]),o||(o=t[1])),e&&o&&(u=e.plotX,a=e.plotY,t=o.plotX,f=o.plotY,u=(1.5*i+u)/2.5,a=(1.5*s+a)/2.5,o=(1.5*i+t)/2.5,l=(1.5*s+f)/2.5,t=Math.sqrt(Math.pow(u-i,2)+Math.pow(a-s,2)),f=Math.sqrt(Math.pow(o-i,2)+Math.pow(l-s,2)),u=Math.atan2(a-s,u-i),a=Math.atan2(l-s,o-i),l=Math.PI/2+(u+a)/2,Math.abs(u-l)>Math.PI/2&&(l-=Math.PI),u=i+Math.cos(l)*t,a=s+Math.sin(l)*t,o=i+Math.cos(Math.PI+l)*f,l=s+Math.sin(Math.PI+l)*f,n.rightContX=o,n.rightContY=l),r?(n=["C",e.rightContX||e.plotX,e.rightContY||e.plotY,u||i,a||s,i,s],e.rightContX=e.rightContY=null):n=["M",i,s]):n=e.call(this,t,n,r),n}),v(n,"translate",function(e){var t=this.chart;e.call(this);if(t.polar&&(this.kdByAngle=t.tooltip&&t.tooltip.shared,!this.preventPostTranslate)){e=this.points;for(t=e.length;t--;)this.toXY(e[t])}}),v(n,"getSegmentPath",function(e,t){var n=this.points;return this.chart.polar&&this.options.connectEnds!==!1&&t[t.length-1]===n[n.length-1]&&n[0].y!==null&&(this.connectEnds=!0,t=[].concat(t,[n[0]])),e.call(this,t)}),v(n,"animate",t),h.column&&(i=h.column.prototype,v(i,"animate",t),v(i,"translate",function(e){var t=this.xAxis,n=this.yAxis.len,r=t.center,i=t.startAngleRad,s=this.chart.renderer,o,u;this.preventPostTranslate=!0,e.call(this);if(t.isRadial){t=this.points;for(u=t.length;u--;)o=t[u],e=o.barX+i,o.shapeType="path",o.shapeArgs={d:s.symbols.arc(r[0],r[1],n-o.plotY,null,{start:e,end:e+o.pointWidth,innerR:n-f(o.yBottom,n)})},this.toXY(o),o.tooltipPos=[o.plotX,o.plotY],o.ttBelow=o.plotY>r[1]}}),v(i,"alignDataLabel",function(e,t,r,i,s,o){this.chart.polar?(e=t.rectPlotX/Math.PI*180,i.align===null&&(i.align=e>20&&e<160?"left":e>200&&e<340?"right":"center"),i.verticalAlign===null&&(i.verticalAlign=e<45||e>315?"bottom":e>135&&e<225?"top":"middle"),n.alignDataLabel.call(this,t,r,i,s,o)):e.call(this,t,r,i,s,o)})),v(r,"getCoordinates",function(e,t){var n=this.chart,r={xAxis:[],yAxis:[]};return n.polar?s(n.axes,function(e){var i=e.isXAxis,s=e.center,o=t.chartX-s[0]-n.plotLeft,s=t.chartY-s[1]-n.plotTop;r[i?"xAxis":"yAxis"].push({axis:e,value:e.translate(i?Math.PI-Math.atan2(o,s):Math.sqrt(Math.pow(o,2)+Math.pow(s,2)),!0)})}):r=e.call(this,t),r})}()})(Highcharts);