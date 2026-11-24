/* ================= ECharts 渲染引擎（在线增强渲染，离线/无画布时自动回退内置 SVG） ================= */
const _svgDonut=svgDonut,_svgCombo=svgComboBarLine,_svgLine=svgLineChart,_svgStack=svgStackedBar,_svgHBar=svgHBar;
let ECHN=0,ECHQ=[],ECHL=[];
function canvasOK(){try{const c=document.createElement("canvas");return !!(c.getContext&&c.getContext("2d"));}catch(e){return false;}}
function echOK(){return typeof echarts!=="undefined"&&canvasOK();}
function echPlace(h,build,svgFallback,extraHTML){
 const id="ech"+(++ECHN);
 ECHQ.push({id,build,svgFallback});
 setTimeout(flushCharts,0);
 return `<div class="ech" id="${id}" style="height:${h}px;width:100%"></div>${extraHTML||""}`;
}
function flushCharts(){
 ECHL=ECHL.filter(x=>{if(!x.el.isConnected){try{x.inst.dispose();}catch(e){}return false;}return true;});
 const q=ECHQ.splice(0,ECHQ.length);
 q.forEach(e=>{
  const el=document.getElementById(e.id);if(!el)return;
  if(el.offsetWidth<5){ECHQ.push(e);return;} /* 所在页签未显示，等待可见后再渲染 */
  if(!echOK()){el.outerHTML=e.svgFallback;return;}
  try{const inst=echarts.init(el,null,{renderer:"canvas"});e.build(inst);ECHL.push({el,inst});}
  catch(err){el.innerHTML=e.svgFallback;}
 });
}
function resizeCharts(){ECHL.forEach(x=>{try{x.inst.resize();}catch(e){}});}
window.addEventListener("resize",()=>setTimeout(()=>{flushCharts();resizeCharts();},80));
/* ---- ECharts 通用主题（驾驶舱 fs=深色 / 系统界面=浅色，渲染时按当前模式取色） ---- */
const AX=()=>uiFS()?"#1E3A5C":"#C9D7E6";
const ETXT2=()=>uiFS()?"#8FA8C4":"#5A7089";
const ETXT3=()=>uiFS()?"#5D7A9C":"#8598AC";
const TT=()=>({backgroundColor:uiFS()?"#152844":"#FFFFFF",borderColor:uiFS()?"#2E8BC0":"#B9D2EA",borderWidth:1,
 textStyle:{color:uiFS()?"#DCE8F5":"#1B2B3F"},
 extraCssText:"box-shadow:0 8px 20px rgba(0,0,0,.45);border-radius:6px;"});
function vgrad(c1,c2){return new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:c1},{offset:1,color:c2}]);}
function hgrad(c1,c2){return new echarts.graphic.LinearGradient(1,0,0,0,[{offset:0,color:c1},{offset:1,color:c2}]);}
function axCommon(extra){return Object.assign({axisLine:{lineStyle:{color:AX()}},axisTick:{show:false},axisLabel:{color:ETXT2(),fontSize:10}},extra||{});}
function splitX(){return{splitLine:{lineStyle:{color:AX(),type:"dashed",opacity:.7}}};}
/* ================= 图表函数（ECharts 版，签名与原 SVG 版一致） ================= */
function donut(data,size=150,thick=22){
 if(!echOK())return _svgDonut(data,size,thick);
 const total=data.reduce((s,d)=>s+d.v,0);
 const legend=data.map((d,i)=>`<span><i style="background:${PALETTE[i%8]}"></i>${d.k} ${d.v}${d.u||""} · ${(d.v/total*100).toFixed(1)}%</span>`).join("");
 return echPlace(size,inst=>{inst.setOption({
  backgroundColor:"transparent",tooltip:Object.assign({trigger:"item",formatter:"{b}：{c}（{d}%）"},TT()),
  title:{text:String(+total.toFixed(2)),subtext:"合计",left:"center",top:"36%",
   textStyle:{color:uiFS()?"#fff":"#1B2B3F",fontSize:16,fontWeight:700},subtextStyle:{color:ETXT3(),fontSize:10}},
  series:[{type:"pie",radius:["60%","86%"],center:["50%","52%"],
   itemStyle:{borderRadius:6,borderColor:uiFS()?"#101F35":"#FFFFFF",borderWidth:2},
   label:{show:false},emphasis:{scale:true,scaleSize:6},
   data:data.map((d,i)=>({name:d.k,value:d.v,itemStyle:{color:PALETTE[i%8]}}))}]});
 },_svgDonut(data,size,thick),`<div class="legend">${legend}</div>`);
}
function comboBarLine(labels,barName,bar,lineName,line,h=220,w=520,u1="",u2=""){
 if(!echOK())return _svgCombo(labels,barName,bar,lineName,line,h,w,u1,u2);
 return echPlace(h,inst=>{inst.setOption({
  backgroundColor:"transparent",tooltip:Object.assign({trigger:"axis",axisPointer:{type:"shadow"}},TT()),
  legend:{top:2,textStyle:{color:ETXT2(),fontSize:11},itemWidth:14,itemHeight:8,icon:"roundRect"},
  grid:{left:56,right:56,top:34,bottom:26},
  xAxis:Object.assign({type:"category",data:labels},axCommon()),
  yAxis:[Object.assign({type:"value",name:barName,nameTextStyle:{color:ETXT3(),fontSize:10}},axCommon(),splitX()),
         Object.assign({type:"value",name:lineName,nameTextStyle:{color:ETXT3(),fontSize:10}},axCommon(),{splitLine:{show:false}})],
  series:[
   {name:barName,type:"bar",data:bar,barMaxWidth:26,
    itemStyle:{borderRadius:[4,4,0,0],color:vgrad("#38BDF8","#1D5FA8")},
    tooltip:{valueFormatter:v=>v+u1}},
   {name:lineName,type:"line",data:line,yAxisIndex:1,smooth:true,symbol:"circle",symbolSize:7,
    lineStyle:{width:2.5,color:"#FBBF24",shadowColor:"rgba(251,191,36,.5)",shadowBlur:8},
    itemStyle:{color:"#FBBF24",borderColor:uiFS()?"#0A1628":"#FFFFFF",borderWidth:1},
    tooltip:{valueFormatter:v=>v+u2}}]});
 },_svgCombo(labels,barName,bar,lineName,line,h,w,u1,u2));
}
function lineChart(labels,series,h=230,w=540){
 if(!echOK())return _svgLine(labels,series,h,w);
 return echPlace(h,inst=>{inst.setOption({
  backgroundColor:"transparent",tooltip:Object.assign({trigger:"axis"},TT()),
  legend:{top:2,textStyle:{color:ETXT2(),fontSize:11},itemWidth:14,itemHeight:8,icon:"roundRect"},
  grid:{left:52,right:24,top:32,bottom:26},
  xAxis:Object.assign({type:"category",data:labels,boundaryGap:false},axCommon()),
  yAxis:Object.assign({type:"value"},axCommon(),splitX()),
  series:series.map(s=>Object.assign({name:s.name,type:"line",data:s.data,smooth:true,
   symbol:"circle",symbolSize:6,
   lineStyle:{width:2.5,color:s.color,shadowColor:s.color+"88",shadowBlur:10},
   itemStyle:{color:s.color,borderColor:uiFS()?"#0A1628":"#FFFFFF",borderWidth:1}},
   series.length<=2?{areaStyle:{color:vgrad(s.color+"2E","rgba(10,22,40,0)")}}:{}))});
 },_svgLine(labels,series,h,w));
}
function stackedBar(labels,series,h=230,w=540){
 if(!echOK())return _svgStack(labels,series,h,w);
 return echPlace(h,inst=>{inst.setOption({
  backgroundColor:"transparent",tooltip:Object.assign({trigger:"axis",axisPointer:{type:"shadow"}},TT()),
  legend:{top:2,textStyle:{color:ETXT2(),fontSize:11},itemWidth:14,itemHeight:8,icon:"roundRect"},
  grid:{left:52,right:24,top:32,bottom:26},
  xAxis:Object.assign({type:"category",data:labels},axCommon()),
  yAxis:Object.assign({type:"value"},axCommon(),splitX()),
  series:series.map((s,si)=>({name:s.name,type:"bar",stack:"total",data:s.data,
   itemStyle:{color:vgrad(s.color,s.color+"66"),borderRadius:si===series.length-1?[4,4,0,0]:0},
   emphasis:{focus:"series"}}))});
 },_svgStack(labels,series,h,w));
}
function hBar(items,h=220,w=520,unit="",colorFn=null){
 if(!echOK())return _svgHBar(items,h,w,unit,colorFn);
 const hh=Math.max(items.length*30+10,60);
 const gl=Math.max(96,Math.max(...items.map(i=>i.k.length))*11+30); /* 标签区宽度随最长名称自适应 */
 return echPlace(hh,inst=>{inst.setOption({
  backgroundColor:"transparent",tooltip:Object.assign({trigger:"item"},TT()),
  grid:{left:gl,right:70,top:8,bottom:8},
  xAxis:Object.assign({type:"value",axisLabel:{show:false},axisLine:{show:false}},
   {splitLine:{lineStyle:{color:AX(),opacity:.5,type:"dashed"}}}),
  yAxis:Object.assign({type:"category",data:items.map(i=>i.k).reverse()},
   {axisLabel:{color:ETXT2(),fontSize:11,interval:0,hideOverlap:true},axisLine:{lineStyle:{color:AX()}},axisTick:{show:false}}),
  series:[{type:"bar",barMaxWidth:14,
   data:items.slice().reverse().map((it,i)=>{
    const col=colorFn?colorFn(it,items.length-1-i):(it.c||"#2E8BC0");
    return {value:it.v,itemStyle:{color:hgrad(col,col+"66"),borderRadius:[0,6,6,0]}};}),
   label:{show:true,position:"right",color:uiFS()?"#DCE8F5":"#33475E",fontSize:11,formatter:p=>p.value+unit}}]});
 },_svgHBar(items,h,w,unit,colorFn));
}
/* 页签切换后：补渲染隐藏期间排队的图表 + 重算尺寸 */
function bindTabs(){
 document.querySelectorAll(".tabs").forEach(tabs=>{
  tabs.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{
   tabs.querySelectorAll(".tab").forEach(x=>x.classList.remove("on"));t.classList.add("on");
   const pane=tabs.parentElement;
   pane.querySelectorAll(".tabpane").forEach(p=>p.classList.remove("on"));
   const target=pane.querySelector("#tp-"+t.dataset.t);
   if(target){target.classList.add("on");}
   else{const body=pane.querySelector("#tabBody");if(body&&RENDERERS[t.dataset.t]){body.innerHTML=RENDERERS[t.dataset.t]();
    if(t.dataset.t==="m1")m1Update();
    if(t.dataset.t==="m2")m2Update();
    if(t.dataset.t==="m4")m4Update("co");}}
   setTimeout(()=>{flushCharts();resizeCharts();},60);
  });});
}
