define(["views/chartView","underscore","utils"],function(e){return e.extend({type:"pie",options:{series:[{size:"60%",dataLabels:{formatter:function(){return this.y>5?this.point.name:null},color:"white",distance:-30}},{size:"80%",innerSize:"60%",dataLabels:{formatter:function(){return this.y>0?"<b>"+this.point.name+"</b><br/>"+this.y.toPrecision(3)+"%":null}}}]},update:function(e){if(this.chart&&e){e.total=e.total/100;var t,o,l,r=e.belowThreshold/e.total,i=100-r,a=(e.excellent-e.bullseye)/e.total,n=e.bullseye/e.total,s=i-n-a,c=Highcharts.getOptions().colors,d=["passed".toLocaleString(),"failed".toLocaleString()],h=[],u=[];for(e=[{y:i,color:c[0],drilldown:{name:"failed".toLocaleString(),categories:[e.threshold+" ... "+e.excellentThreshold,"excellent".toLocaleString()+" (>"+e.excellentThreshold+")","maximum".toLocaleString()+" ("+e.limit+")"],data:[s,a,n],color:c[0]}},{y:r,color:c[1],drilldown:{name:"passed".toLocaleString(),categories:["0 ... "+e.threshold],data:[r],color:c[1]}}],t=0;t<e.length;t+=1)for(h.push({name:d[t],y:e[t].y,color:e[t].color}),o=0;o<e[t].drilldown.data.length;o+=1)l=.2-o/e[t].drilldown.data.length/5,u.push({name:e[t].drilldown.categories[o],y:e[t].drilldown.data[o],color:Highcharts.Color(e[t].color).brighten(l).get()});return this.updatePie(h,u),this.redraw(),this.chart.series}}})});