/* ================= c10c 能碳全景一张图：真实瓦片地图（GIS）+ 片区划分 + 企业点位 + 要素联动 ================= */
(function(){
/* ---- Leaflet 异步加载（多 CDN 回退；失败时保留内置示意图） ---- */
const LF={css:["https://unpkg.com/leaflet@1.9.4/dist/leaflet.css","https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css","https://cdn.bootcdn.net/ajax/libs/leaflet/1.9.4/leaflet.min.css"],
 js:["https://unpkg.com/leaflet@1.9.4/dist/leaflet.js","https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js","https://cdn.bootcdn.net/ajax/libs/leaflet/1.9.4/leaflet.min.js"]};
function loadLeaflet(i){i=i||0;if(window.L&&L.map){onLeaflet();return;}if(i>=LF.js.length)return;
 const l=document.createElement("link");l.rel="stylesheet";l.href=LF.css[i];document.head.appendChild(l);
 const s=document.createElement("script");s.src=LF.js[i];s.async=true;s.onload=onLeaflet;s.onerror=()=>loadLeaflet(i+1);document.head.appendChild(s);}
function onLeaflet(){if(typeof curPage!=="undefined"&&curPage==="oneMap")omRefresh();}
setTimeout(()=>loadLeaflet(0),200);

document.head.insertAdjacentHTML("beforeend",`<style id="c10c-css">
.om-gis-wrap{position:relative;height:560px;border-radius:10px;overflow:hidden;border:1px solid rgba(64,120,190,.35);background:#0B1A2E;}
#omGis{position:absolute;inset:0;background:#0B1A2E;}
#omGis.tone-img .leaflet-tile-pane{filter:brightness(.82) saturate(1.05) contrast(1.05);}
#omGis.tone-dark .leaflet-tile-pane{filter:invert(1) hue-rotate(195deg) brightness(.82) saturate(.55) contrast(.92);}
.om-ov{position:absolute;z-index:500;background:rgba(8,20,38,.86);border:1px solid rgba(64,150,220,.45);border-radius:10px;color:#DCE8F5;box-shadow:0 10px 24px rgba(2,8,20,.45);backdrop-filter:blur(6px);}
.om-ov-l{top:12px;left:12px;padding:10px 14px;min-width:220px;}
.om-ov-l .t{font-size:12px;color:#8FA8C4;}
.om-ov-l .v{font-size:24px;font-weight:700;color:#7DD3FC;font-family:Consolas,"DIN Alternate",monospace;margin-top:2px;}
.om-ov-l .v small{font-size:12px;color:#8FA8C4;font-weight:400;margin-left:4px;}
.om-ov-l .s{font-size:11px;color:#8FA8C4;margin-top:4px;line-height:1.7;}
.om-ov-r{top:12px;right:12px;padding:8px 10px;width:250px;}
.om-ov-r h5{font-size:12px;margin:0 0 6px;color:#fff;font-weight:600;}
.om-ov-r .d{display:flex;align-items:center;gap:8px;font-size:11.5px;padding:5px 6px;border-radius:6px;cursor:pointer;}
.om-ov-r .d:hover,.om-ov-r .d.on{background:rgba(56,189,248,.14);}
.om-ov-r .d i{width:10px;height:10px;border-radius:2px;flex:none;}
.om-ov-r .d b{margin-left:auto;font-family:Consolas,monospace;color:#7DD3FC;font-weight:400;}
.om-ov-b{left:12px;bottom:12px;padding:7px 12px;font-size:11px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;}
.om-ov-b i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:4px;vertical-align:-1px;}
.om-tools{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px;}
.om-seg{display:inline-flex;border:1px solid var(--line);border-radius:6px;overflow:hidden;}
.om-seg span{font-size:12px;padding:5px 10px;cursor:pointer;color:var(--txt2);}
.om-seg span.on{background:var(--blue);color:#fff;}
.om-lyr{font-size:12px;color:var(--txt2);display:flex;gap:10px;align-items:center;margin-left:auto;}
.om-lyr label{display:flex;gap:4px;align-items:center;cursor:pointer;}
.om-lyr input{accent-color:#0B6EC5;}
.leaflet-container{font-family:"Microsoft YaHei","PingFang SC",sans-serif;}
.qw-lbl.leaflet-tooltip{background:rgba(8,20,38,.82);border:1px solid rgba(56,189,248,.55);color:#EAF6FF;font-size:11.5px;padding:3px 8px;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,.35);white-space:nowrap;}
.qw-lbl.leaflet-tooltip b{color:#FFD666;font-family:Consolas,monospace;font-weight:400;margin-left:4px;}
.qw-lbl.leaflet-tooltip:before{display:none;}
.qw-dlbl{color:#fff;font-size:13px;font-weight:700;letter-spacing:2px;text-shadow:0 1px 3px #000,0 0 6px rgba(0,0,0,.8);white-space:nowrap;text-align:center;}
.qw-dlbl small{display:block;font-size:11px;font-weight:400;letter-spacing:0;color:#BAE6FD;}
.qw-fac{width:26px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:14px;border:1.5px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,.45);}
.leaflet-popup-content-wrapper{background:rgba(10,24,44,.96);color:#DCE8F5;border:1px solid rgba(56,189,248,.55);border-radius:10px;box-shadow:0 12px 28px rgba(0,0,0,.5);}
.leaflet-popup-tip{background:rgba(10,24,44,.96);}
.leaflet-popup-content{margin:12px 14px;font-size:12px;line-height:1.75;min-width:230px;}
.qw-pop h4{font-size:14px;color:#fff;margin:0 0 4px;}
.qw-pop .tg{display:inline-block;font-size:10.5px;padding:0 6px;border-radius:8px;margin-right:4px;background:rgba(56,189,248,.18);color:#7DD3FC;}
.qw-pop table{width:100%;margin:6px 0;}
.qw-pop td{padding:2px 0;font-size:11.5px;border:none!important;color:#BFD6EC;background:none!important;}
.qw-pop td:last-child{text-align:right;color:#fff;font-family:Consolas,monospace;}
.qw-pop button{margin-top:4px;width:100%;}
.leaflet-control-attribution{background:rgba(8,20,38,.7)!important;color:#8FA8C4!important;font-size:10px!important;}
.leaflet-control-attribution a{color:#8FA8C4!important;}
.leaflet-bar a{background:rgba(8,20,38,.9)!important;color:#DCE8F5!important;border-color:rgba(64,150,220,.4)!important;}
.om-el{cursor:pointer;transition:all .2s;}
.om-el:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,91,172,.14);}
.om-el.on{outline:2px solid rgba(11,110,197,.55);}
.om-rank-t td,.om-rank-t th{font-size:12px;}
</style>`);

/* ---- 园区边界与片区（GCJ-02 坐标，依据园区路网对齐） ---- */
const P={W:[38.35516,106.50051],N:[38.36894,106.51882],E:[38.35573,106.5386],S:[38.34195,106.51516],
 mWN:[38.36205,106.50966],mNE:[38.36234,106.52871],mES:[38.34884,106.52688],mSW:[38.34855,106.50783],C:[38.35545,106.51827]};
const DZ=[
 {name:"如意街街道",q:[P.W,P.mWN,P.C,P.mSW],col:"#38BDF8"},
 {name:"京河大道街道",q:[P.mWN,P.N,P.mNE,P.C],col:"#2DD4BF"},
 {name:"光伏产业园片区",q:[P.C,P.mNE,P.E,P.mES],col:"#FBBF24"},
 {name:"综合产业社区",q:[P.mSW,P.C,P.mES,P.S],col:"#A78BFA"}];
const DZI=Object.fromEntries(DZ.map((d,i)=>[d.name,i]));
function qpt(q,u,v){const f=(k)=>q[0][k]*(1-u)*(1-v)+q[1][k]*u*(1-v)+q[2][k]*u*v+q[3][k]*(1-u)*v;return [f(0),f(1)];}
const KEYPOS={1:[0,.38,.30],2:[0,.78,.62],8:[0,.30,.80],3:[1,.22,.30],4:[1,.70,.22],5:[1,.70,.82],6:[3,.55,.45],7:[2,.45,.40]};
const LBLDIR={3:"left",1:"left",6:"right"};
const DLPOS=[[.10,.55],[.50,.06],[.92,.62],[.30,.92]];

/* ---- 园区其余企业名录（重点用能单位之外，按月度填报归集；数值为演示数据） ---- */
const ON=[["瑞泰新材料","新材料"],["中晶半导体材料","电子信息"],["恒达新型建材","新材料"],["金瑞特种合金","新材料"],["汇能电气设备","装备制造"],["博远智能装备","装备制造"],
 ["鑫源精密机械","装备制造"],["塞北冷链物流","冷链装备"],["华创电子科技","电子信息"],["云图信息技术","数据服务"],["智算云科技","数据服务"],["康泰医疗器械","生物医药"],
 ["润禾生物科技","生物医药"],["安瑞药业","生物医药"],["光合新能源","新能源"],["储联能源科技","新能源"],["绿源充电科技","新能源"],["宁新纺织材料","化纤新材料"],
 ["恒丰化纤","化纤新材料"],["瀚海复合材料","新材料"],["卓越包装科技","新材料"],["联创电子元件","电子信息"],["中科传感科技","电子信息"],["天成机电","装备制造"],
 ["精工模具","装备制造"],["冰峰制冷设备","冷链装备"],["雪域冷链科技","冷链装备"],["数联科技","数据服务"],["星河软件","数据服务"],["益康生物制药","生物医药"],
 ["和泰医药包装","生物医药"],["晶阳光伏组件","新能源"],["氢源动力科技","新能源"],["东方特种纤维","化纤新材料"],["金丝纺织","化纤新材料"],["园区综合服务中心","公共服务"],
 ["宁苏科技孵化器","公共服务"],["智联物流","现代物流"],["绿洲环保科技","节能环保"],["清源水务","节能环保"],["苏银创新研发中心","公共服务"],["鸿运仓储","现代物流"]];
let seed=20251124;const rnd=()=>((seed=seed*16807%2147483647)/2147483647);
const OTH=ON.map((n,i)=>{const en=+(0.26*Math.pow(0.935,i)+0.02+rnd()*0.03).toFixed(3);
 const ratio=1.7+rnd()*1.4;const co=+(en*ratio).toFixed(3);const red=Math.round(4+rnd()*24);
 const g=["A","B","B","C"][Math.floor(rnd()*4)];const d=Math.floor(rnd()*4);
 const f=[1+red/100*1.25,1+red/100,1+red/100*0.6,1+red/100*0.25,1];
 return {id:100+i,name:n[0],ind:n[1],dist:DZ[d].name,eg:g,grade:g==="C"?"B":g,en,co,red,asset:Math.round(30+rnd()*260),
  en5:f.map(x=>+(en*x).toFixed(3)),co5:f.map(x=>+(co*x).toFixed(3)),u:.12+rnd()*.76,v:.12+rnd()*.76,other:true};});
/* 口径对齐：在线监测的 42 家一般企业合计 能耗 2.75 万tce / 碳排 6.5 万tCO₂（与 8 家重点用能单位合计后贴合园区总量，其余 36 家小微企业按月度填报归集） */
(function(){const se=OTH.reduce((a,c)=>a+c.en,0),sc=OTH.reduce((a,c)=>a+c.co,0),ke=2.75/se,kc=6.5/sc;
 OTH.forEach(c=>{c.en=+(c.en*ke).toFixed(3);c.co=+(c.co*kc).toFixed(3);c.en5=c.en5.map(v=>+(v*ke).toFixed(3));c.co5=c.co5.map(v=>+(v*kc).toFixed(3));});})();
window.QW_OTH=OTH;
window.QW_ALL=()=>COMPANIES.concat(OTH);

/* ---- 取值（随要素 / 时间粒度联动） ---- */
const FN={en:"能源消费",co:"碳排放",cl:"清洁能源",gl:"绿色低碳成就"};
const FU={en:"万tce",co:"万tCO₂",cl:"万kWh",gl:"分"};
function val(c){const idx=YEARS.indexOf(OM.year);const pf=omPeriodFactor();
 if(OM.factor==="co")return c.co5[idx]*pf;if(OM.factor==="cl")return c.asset/300*pf*(c.other?0.6:1);if(OM.factor==="gl")return Math.min(98,52+c.red*1.2+(c.eg==="A"?10:c.eg==="B"?4:0));
 return c.en5[idx]*pf;}
const fmt=v=>OM.factor==="gl"?Math.round(v):(v>=10?v.toFixed(1):v>=0.1?v.toFixed(2):v.toFixed(3));

/* ---- 页面 ---- */
OM.base=OM.base||"img";OM.lyr=OM.lyr||{ent:true,zone:true,fac:true,lbl:true};
reg("oneMap",()=>`
<div class="grid g4" id="omEls">
 <div class="card om-el" data-f="en" onclick="omSetFactor('en')"><h3>能源消费要素</h3>
  <table>${row("电力","7.3 亿kWh","占比 47.8%")}${row("天然气","620 万m³","占比 22.0%")}${row("热力","28 万GJ","占比 17.7%")}${row("氢气","120 t","绿电制氢示范")}</table></div>
 <div class="card om-el" data-f="co" onclick="omSetFactor('co')"><h3>能碳指标要素</h3><table id="omKpi"></table></div>
 <div class="card om-el" data-f="cl" onclick="omSetFactor('cl')"><h3>清洁能源要素</h3>
  <table>${row("分布式光伏","86 个 / 42MW","在运")}${row("储能","3 站 / 60MWh","在运")}${row("充电桩","126 个","快充 48")}${row("绿电交易","2.1 亿kWh","本年")}</table></div>
 <div class="card om-el" data-f="gl" onclick="omSetFactor('gl')"><h3>绿色低碳成就</h3>
  <table>${row("国家级绿色园区","1 个","2024 年获批")}${row("国家级绿色工厂","2 家","宏基 / 智慧银川")}${row("自治区级绿色工厂","3 家","嘉盛德 / 宝丰 / 宇超")}${row("零碳工厂试点","2 家","智慧银川 / 宝丰")}</table></div>
</div>
<div class="card"><h3>瓦片地图 · 园区能碳全景（街道 / 片区维度）</h3>
 <div class="om-tools">
  <select id="omFactor" onchange="omRefresh()">${Object.entries(FN).map(([k,v])=>`<option value="${k}" ${OM.factor===k?"selected":""}>${v}</option>`).join("")}</select>
  <select id="omDist" onchange="omRefresh(true)"><option value="all">全部片区</option>${DZ.map(d=>`<option ${OM.dist===d.name?"selected":""}>${d.name}</option>`).join("")}</select>
  <input type="text" id="omSearch" list="omNames" placeholder="搜索企业名称" style="width:210px" onkeydown="if(event.key==='Enter')omSearchGo()">
  <datalist id="omNames">${COMPANIES.concat(OTH).map(c=>`<option value="${c.name}">`).join("")}</datalist>
  <button class="btn sm" onclick="omSearchGo()">查询</button>
  <button class="btn ghost sm" onclick="omResetView()">重置视图</button>
  <span class="om-seg" id="omBase"><span data-b="img" onclick="omBase('img')">影像</span><span data-b="vec" onclick="omBase('vec')">矢量</span><span data-b="dark" onclick="omBase('dark')">暗色</span></span>
  <span class="om-lyr">图层：<label><input type="checkbox" data-l="ent" checked onchange="omLyr(this)">企业点位</label><label><input type="checkbox" data-l="zone" checked onchange="omLyr(this)">片区边界</label><label><input type="checkbox" data-l="fac" checked onchange="omLyr(this)">能源设施</label><label><input type="checkbox" data-l="lbl" checked onchange="omLyr(this)">企业标注</label></span>
 </div>
 <div class="om-gis-wrap"><div id="omGis" class="tone-img">${renderMap("onemap")}</div>
  <div class="om-ov om-ov-l" id="omOvL"></div>
  <div class="om-ov om-ov-r" id="omOvR"></div>
  <div class="om-ov om-ov-b" id="omOvB"></div></div>
 <div class="yearbar">
  <button class="btn sm" id="omPlay" onclick="omTogglePlay()">▶ 播放</button>
  <select id="omGran" onchange="omGranChange()"><option value="y">按年度</option><option value="q">按季度</option><option value="m">按月度</option></select>
  <select id="omPeriod" onchange="omPeriodChange()"></select>
  <span class="y" id="omYearLabel">2025年</span>
  <span style="font-size:11px;color:var(--txt3)">时间轴播放：地图点位、片区统计、指标与企业排序同步联动</span>
 </div></div>
<div class="grid" style="grid-template-columns:1.25fr 1fr">
 <div class="card"><h3>企业数据排序（当前要素 · 前 15 名）<span style="margin-left:auto;font-weight:400"><span class="om-seg" id="omSortSeg"><span data-s="v" class="on" onclick="omSort('v')">按当前要素</span><span data-s="en" onclick="omSort('en')">按能耗量</span><span data-s="co" onclick="omSort('co')">按碳排量</span></span></span></h3><div id="omRank"></div></div>
 <div class="card"><h3>片区能碳统计</h3><div id="omDistTbl"></div><div class="concl" id="omDistNote"></div></div>
</div>`);

let MAP=null,LY={},BASE=null,MK={};
OM.sort=OM.sort||"v";
function baseLayer(b){
 if(b==="vec"||b==="dark")return L.tileLayer("https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",{subdomains:"1234",maxZoom:18});
 return L.layerGroup([L.tileLayer("https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",{subdomains:"1234",maxZoom:18}),
  L.tileLayer("https://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}",{subdomains:"1234",maxZoom:18,opacity:.85})]);}
function initMap(){
 const el=document.getElementById("omGis");if(!el||!window.L||!L.map)return false;
 if(MAP&&MAP.getContainer()===el&&el.isConnected)return true;
 if(MAP){try{MAP.remove();}catch(e){}MAP=null;}
 el.innerHTML="";
 MAP=L.map(el,{zoomControl:false,attributionControl:true,minZoom:11,maxZoom:18,zoomSnap:.25,wheelPxPerZoomLevel:90});
 L.control.zoom({position:"bottomright"}).addTo(MAP);
 MAP.attributionControl.setPrefix("").addAttribution("底图 © 高德地图 · 园区边界 © 苏银产业园管委会");
 MAP.fitBounds(L.latLngBounds([P.W,P.N,P.E,P.S]).pad(0.08));
 BASE=baseLayer(OM.base).addTo(MAP);el.className="tone-"+OM.base;
 LY.zone=L.layerGroup().addTo(MAP);LY.fac=L.layerGroup().addTo(MAP);LY.ent=L.layerGroup().addTo(MAP);LY.lbl=L.layerGroup().addTo(MAP);
 /* 园区边界（发光外框） */
 L.polygon([P.W,P.N,P.E,P.S],{color:"#38BDF8",weight:7,opacity:.25,fill:false,interactive:false}).addTo(LY.zone);
 L.polygon([P.W,P.N,P.E,P.S],{color:"#7DD3FC",weight:2.4,dashArray:"8 6",fill:false,interactive:false}).addTo(LY.zone);
 /* 主干道标注 */
 L.polyline([P.mWN,P.mES],{color:"#FDE68A",weight:3,opacity:.55,interactive:false}).addTo(LY.zone);
 L.polyline([P.mNE,P.mSW],{color:"#FDE68A",weight:3,opacity:.55,interactive:false}).addTo(LY.zone);
 L.marker(qpt([P.mWN,P.mES,P.mES,P.mWN],.2,0),{icon:L.divIcon({className:"",html:`<div class="qw-dlbl" style="font-size:11px;letter-spacing:1px;transform:rotate(44deg);color:#FDE68A">京河大道</div>`,iconSize:[80,16],iconAnchor:[40,8]}),interactive:false}).addTo(LY.zone);
 L.marker(qpt([P.mSW,P.mNE,P.mNE,P.mSW],.78,0),{icon:L.divIcon({className:"",html:`<div class="qw-dlbl" style="font-size:11px;letter-spacing:1px;transform:rotate(-40deg);color:#FDE68A">如意街</div>`,iconSize:[60,16],iconAnchor:[30,8]}),interactive:false}).addTo(LY.zone);
 /* 能源设施 */
 const FAC=[["🏛","智慧产业研发大厦（管委会）",1,.18,.86,"#0B6EC5","园区管委会驻地 · E 站式服务中心 · 能碳平台指挥中心"],
  ["⚡","甘露 330kV 变电站",0,.12,.12,"#475569","园区电源枢纽 · 1 座 330kV + 3 座 110kV 变电所"],
  ["☀","集中式光伏电站 120MW",2,.62,.22,"#CA8A04","年发电 1.86 亿kWh · 绿电直供园区企业"],
  ["🔋","云碳共享储能电站 60MWh",2,.80,.70,"#0F766E","全钒液流 4h 级 · 晚峰调峰与绿电消纳"],
  ["H₂","绿电制氢加氢站",2,.30,.82,"#0E7490","电解水制氢 120 t/年 · 供园区物流叉车"],
  ["🔌","公共充电站（快充 48）",3,.25,.25,"#7C3AED","充电桩 126 个 · 光储充一体化"],
  ["♨","余热回收换热站",0,.62,.30,"#B91C1C","数据中心 / 工业余热回收 · 供暖 12 万㎡"]];
 FAC.forEach(f=>{const ll=qpt(DZ[f[2]].q,f[3],f[4]);
  L.marker(ll,{icon:L.divIcon({className:"",html:`<div class="qw-fac" style="background:${f[5]}">${f[0]}</div>`,iconSize:[26,26],iconAnchor:[13,13]})})
   .bindTooltip(f[1],{direction:"top",offset:[0,-12],className:"qw-lbl"})
   .bindPopup(`<div class="qw-pop"><h4>${f[1]}</h4><span class="tg">能源设施</span><span class="tg">${DZ[f[2]].name}</span><div style="margin-top:6px;color:#BFD6EC">${f[6]}</div></div>`).addTo(LY.fac);});
 Object.keys(OM.lyr).forEach(k=>{if(!OM.lyr[k]&&LY[k])MAP.removeLayer(LY[k]);});
 setTimeout(()=>MAP&&MAP.invalidateSize(),250);
 return true;}

function colorOf(v,mx){const t=v/(mx||1);if(OM.factor==="gl"||OM.factor==="cl")return t>.67?"#22C55E":t>.34?"#84CC16":"#FBBF24";return t<.34?"#22C55E":t<.67?"#FBBF24":"#EF4444";}
function popHtml(c){const per=omPeriodName();const v=val(c);
 return `<div class="qw-pop"><h4>${c.name}</h4><span class="tg">${c.ind}</span><span class="tg">${c.dist}</span><span class="tg">能效 ${c.eg} 级</span>
  <table><tr><td>${FN[OM.factor]} · ${per}</td><td>${fmt(v)} ${FU[OM.factor]}</td></tr>
  <tr><td>综合能耗（2025）</td><td>${(+c.en).toFixed(c.other?3:1)} 万tce</td></tr><tr><td>碳排放（2025）</td><td>${(+c.co).toFixed(c.other?3:1)} 万tCO₂</td></tr>
  <tr><td>近五年累计降幅</td><td>-${c.red}%</td></tr><tr><td>碳评价等级</td><td>${c.grade} 级</td></tr></table>
  <button class="btn sm" onclick="${c.other?`qwOtherModal(${c.id})`:`coModal(${c.id})`}">查看近五年数据 · 能碳分析 · 减排措施 →</button></div>`;}

function drawData(fit){
 if(!MAP)return;
 LY.ent.clearLayers();LY.lbl.clearLayers();MK={};
 /* 片区面（按片区要素合计着色） */
 if(LY.dz)LY.dz.forEach(x=>LY.zone.removeLayer(x));LY.dz=[];
 const all=COMPANIES.concat(OTH);
 const dsum=DZ.map(d=>all.filter(c=>c.dist===d.name).reduce((s,c)=>s+val(c),0));
 const dmx=Math.max(...dsum);
 DZ.forEach((d,i)=>{const sel=OM.dist==="all"||OM.dist===d.name;
  const pg=L.polygon(d.q,{color:d.col,weight:sel?2:1,opacity:sel?.95:.4,fillColor:d.col,fillOpacity:sel?(.08+.22*dsum[i]/dmx):.03,dashArray:"5 5"})
   .on("click",()=>{OM.dist=OM.dist===d.name?"all":d.name;const s=document.getElementById("omDist");if(s)s.value=OM.dist;omRefresh(true);});
  pg.bindTooltip(`${d.name} · ${FN[OM.factor]} ${fmt(dsum[i])} ${FU[OM.factor]}`,{sticky:true,className:"qw-lbl"});
  pg.addTo(LY.zone);LY.dz.push(pg);
  const lb=L.marker(qpt(d.q,DLPOS[i][0],DLPOS[i][1]),{interactive:false,icon:L.divIcon({className:"",html:`<div class="qw-dlbl">${d.name}<small>${all.filter(c=>c.dist===d.name).length} 家企业 · ${fmt(dsum[i])} ${FU[OM.factor]}</small></div>`,iconSize:[160,36],iconAnchor:[80,18]})});
  lb.addTo(LY.zone);LY.dz.push(lb);});
 /* 企业点位 */
 const q=((document.getElementById("omSearch")||{}).value||"").trim();
 const list=all.filter(c=>(OM.dist==="all"||c.dist===OM.dist));
 const mx=Math.max(...list.map(val));
 list.forEach(c=>{
  const ll=c.other?qpt(DZ[DZI[c.dist]].q,c.u,c.v):qpt(DZ[KEYPOS[c.id][0]].q,KEYPOS[c.id][1],KEYPOS[c.id][2]);
  const v=val(c),col=colorOf(v,mx),r=c.other?4+9*Math.sqrt(v/mx):8+16*Math.sqrt(v/mx);
  const hit=q&&c.name.includes(q);
  if(!c.other)L.circleMarker(ll,{radius:r+6,color:col,weight:1,opacity:.5,fill:false,interactive:false,className:"qw-pulse"}).addTo(LY.ent);
  const m=L.circleMarker(ll,{radius:r,color:hit?"#fff":"rgba(255,255,255,.85)",weight:hit?3:c.other?1:2,fillColor:col,fillOpacity:c.other?.7:.88})
   .bindPopup(popHtml(c),{maxWidth:300}).addTo(LY.ent);
  m.bindTooltip(`${c.name}<b>${fmt(v)} ${FU[OM.factor]}</b>`,{direction:"top",offset:[0,-r],className:"qw-lbl"});
  MK[c.name]=m;
  if(!c.other)L.tooltip({permanent:true,direction:LBLDIR[c.id]||"right",offset:[(LBLDIR[c.id]==="left"?-1:1)*(r+4),0],className:"qw-lbl",interactive:false}).setLatLng(ll).setContent(`${c.name}<b>${fmt(v)}</b>`).addTo(LY.lbl);});
 if(fit){const d=DZ[DZI[OM.dist]];MAP.flyToBounds(L.latLngBounds(d?d.q:[P.W,P.N,P.E,P.S]).pad(d?0.15:0.08),{duration:.8});}
 /* 叠加面板 */
 const idx=YEARS.indexOf(OM.year),pf=omPeriodFactor(),per=omPeriodName();
 const tot=list.reduce((s,c)=>s+val(c),0);
 const parkTot={en:PARK.energy[idx]*pf,co:PARK.carbon[idx]*pf}[OM.factor];
 document.getElementById("omOvL").innerHTML=`<div class="t">${OM.dist==="all"?"苏银产业园":OM.dist} · ${FN[OM.factor]} · ${per}</div>
  <div class="v">${OM.factor==="gl"?Math.round(tot/list.length):fmt(OM.dist==="all"&&parkTot?parkTot:tot)}<small>${OM.factor==="gl"?"分（平均）":FU[OM.factor]}</small></div>
  <div class="s">在线监测企业 ${list.length} 家 · 重点用能单位 ${list.filter(c=>!c.other).length} 家<br>单位能耗碳排放 ${(PARK.carbon[idx]/PARK.energy[idx]).toFixed(2)} tCO₂/tce · 清洁能源占比 ${(24.6+idx*0.95).toFixed(1)}%</div>`;
 document.getElementById("omOvR").innerHTML=`<h5>片区划分 · ${FN[OM.factor]}</h5>`+DZ.map((d,i)=>`<div class="d ${OM.dist===d.name?"on":""}" onclick="omPickDist('${d.name}')"><i style="background:${d.col}"></i>${d.name}<b>${fmt(dsum[i])}</b></div>`).join("")+
  `<div class="d ${OM.dist==="all"?"on":""}" onclick="omPickDist('all')"><i style="background:#7DD3FC"></i>全部片区<b>${fmt(dsum.reduce((a,b)=>a+b,0))}</b></div>`;
 document.getElementById("omOvB").innerHTML=(OM.factor==="gl"||OM.factor==="cl"
  ?`<span><i style="background:#22C55E"></i>高</span><span><i style="background:#84CC16"></i>中</span><span><i style="background:#FBBF24"></i>低</span>`
  :`<span><i style="background:#22C55E"></i>低</span><span><i style="background:#FBBF24"></i>中</span><span><i style="background:#EF4444"></i>高</span>`)+
  `<span>圆点大小 = ${FN[OM.factor]}（${FU[OM.factor]}）</span><span>大圆 = 重点用能单位</span><span>虚线 = 街道 / 片区边界</span>`;}

function rankAndTables(){
 const all=COMPANIES.concat(OTH);const idx=YEARS.indexOf(OM.year),pf=omPeriodFactor();
 let list=all.filter(c=>OM.dist==="all"||c.dist===OM.dist);
 const q=((document.getElementById("omSearch")||{}).value||"").trim();if(q)list=list.filter(c=>c.name.includes(q));
 const key=OM.sort==="v"?null:OM.sort;
 const vv=c=>key==="en"?c.en5[idx]*pf:key==="co"?c.co5[idx]*pf:val(c);
 const u=key?FU[key]:FU[OM.factor];
 const items=list.map(c=>({k:c.name,v:+fmt(vv(c)),c})).sort((a,b)=>b.v-a.v).slice(0,15);
 const box=document.getElementById("omRank");
 if(box)box.innerHTML=hBar(items.map(i=>({k:i.k,v:i.v})),300,640," "+u,(it,i)=>i<3?"#EF4444":i<8?"#F59E0B":"#0EA5E9");
 const t=document.getElementById("omDistTbl");
 if(t){const rows=DZ.map(d=>{const l=all.filter(c=>c.dist===d.name);return {d,n:l.length,en:l.reduce((s,c)=>s+c.en5[idx]*pf,0),co:l.reduce((s,c)=>s+c.co5[idx]*pf,0),a:l.filter(c=>c.eg==="A").length};});
  t.innerHTML=`<table class="om-rank-t"><tr><th>片区</th><th>企业数</th><th>能耗(万tce)</th><th>碳排(万tCO₂)</th><th>单位能耗碳排</th><th>A级能效</th></tr>${rows.map(r=>`<tr style="cursor:pointer" onclick="omPickDist('${r.d.name}')"><td><i style="display:inline-block;width:9px;height:9px;border-radius:2px;background:${r.d.col};margin-right:6px"></i>${r.d.name}</td><td>${r.n}</td><td>${r.en.toFixed(2)}</td><td>${r.co.toFixed(2)}</td><td>${(r.co/r.en).toFixed(2)}</td><td>${r.a} 家</td></tr>`).join("")}</table>`;
  const top=rows.slice().sort((a,b)=>b.co-a.co)[0];
  const n=document.getElementById("omDistNote");if(n)n.innerHTML=`<b>片区研判：</b>${top.d.name}碳排放占园区 ${(top.co/rows.reduce((s,r)=>s+r.co,0)*100).toFixed(1)}%，为重点管控片区；光伏产业园片区依托集中式光伏与共享储能，单位能耗碳排放最低，可作为零碳示范片区优先推进。`;}}

/* ---- 刷新入口（被年/季/月切换、播放、筛选调用） ---- */
window.omRefresh=function(fit){
 const sel=document.getElementById("omFactor");if(sel)OM.factor=sel.value;
 const ds=document.getElementById("omDist");if(ds)OM.dist=ds.value;
 document.querySelectorAll(".om-el").forEach(e=>e.classList.toggle("on",e.dataset.f===OM.factor));
 document.querySelectorAll("#omBase span").forEach(s=>s.classList.toggle("on",s.dataset.b===OM.base));
 const idx=YEARS.indexOf(OM.year),pf=omPeriodFactor(),per=omPeriodName();
 const kpiT=document.getElementById("omKpi");
 if(kpiT)kpiT.innerHTML=row("综合能耗 · "+per,(PARK.energy[idx]*pf).toFixed(2),"万tce")+row("碳排放总量 · "+per,(PARK.carbon[idx]*pf).toFixed(2),"万tCO₂")+
  row("单位能耗碳排放",(PARK.carbon[idx]/PARK.energy[idx]).toFixed(2),"tCO₂/tce")+row("绿电消纳率",(88+idx*2.03).toFixed(1),"%");
 if(initMap())drawData(fit===true);
 else if(typeof renderMapDots==="function")renderMapDots("onemap",(document.getElementById("omSearch")||{}).value||"");
 rankAndTables();};
window.omSetFactor=function(f){const s=document.getElementById("omFactor");if(s){s.value=f;}OM.factor=f;omRefresh();};
window.omPickDist=function(d){OM.dist=d;const s=document.getElementById("omDist");if(s)s.value=d;omRefresh(true);};
window.omSort=function(s){OM.sort=s;document.querySelectorAll("#omSortSeg span").forEach(x=>x.classList.toggle("on",x.dataset.s===s));rankAndTables();};
window.omBase=function(b){OM.base=b;if(!MAP)return;MAP.removeLayer(BASE);BASE=baseLayer(b).addTo(MAP);BASE.bringToBack&&BASE.bringToBack();
 document.getElementById("omGis").className="tone-"+b;document.querySelectorAll("#omBase span").forEach(s=>s.classList.toggle("on",s.dataset.b===b));};
window.omLyr=function(el){const k=el.dataset.l;OM.lyr[k]=el.checked;if(!MAP||!LY[k])return;if(el.checked)LY[k].addTo(MAP);else MAP.removeLayer(LY[k]);};
window.omResetView=function(){OM.dist="all";const s=document.getElementById("omDist");if(s)s.value="all";const q=document.getElementById("omSearch");if(q)q.value="";omRefresh(true);};
window.omSearchGo=function(){const q=((document.getElementById("omSearch")||{}).value||"").trim();
 const all=COMPANIES.concat(OTH);const c=q&&all.find(x=>x.name===q)||all.find(x=>q&&x.name.includes(q));
 if(!c){qwToast("未找到匹配企业：“"+q+"”");omRefresh();return;}
 if(OM.dist!=="all"&&c.dist!==OM.dist){OM.dist="all";const s=document.getElementById("omDist");if(s)s.value="all";}
 omRefresh();
 if(MAP&&MK[c.name]){MAP.flyTo(MK[c.name].getLatLng(),16,{duration:1});setTimeout(()=>MK[c.name]&&MK[c.name].openPopup(),1050);}};

/* 非重点企业下钻（近五年数据 · 能碳分析 · 减排措施） */
window.qwOtherModal=function(id){const c=OTH.find(x=>x.id===id);if(!c)return;
 const meas={新材料:"窑炉余热回收 · 屋顶光伏",化纤新材料:"溶剂回收精馏热集成 · 空压站变频",装备制造:"电炉感应加热改造 · 车间照明 LED 改造",冷链装备:"冷库变频 + 水蓄冷 · 光储充一体化",
  数据服务:"液冷改造 · 绿电交易采购",电子信息:"洁净室 AI 群控 · 高效冷机",生物医药:"冷凝水回收 · 制冷机房能效优化",新能源:"绿电自发自用 · 储能削峰填谷"}[c.ind]||"照明与空调节能改造 · 能耗分项计量补装";
 showModal(`企业能碳画像 —— ${c.name}（${c.dist}）`,`<div class="kpis" style="grid-template-columns:repeat(4,1fr)">
  ${kpi("所属产业",c.ind,"","碳评价 "+c.grade+" 级")}${kpi("2025 能耗",(c.en*10000).toFixed(0),"tce","累计 -"+c.red+"%","down ok")}${kpi("2025 碳排",(c.co*10000).toFixed(0),"tCO₂","累计 -"+c.red+"%","down ok")}${kpi("能效等级",c.eg,"级",c.eg==="A"?"行业先进":c.eg==="B"?"行业平均":"待提升")}</div>
  <div class="sub2">近五年能耗 / 碳排趋势</div>
  ${lineChart(YEARS.map(String),[{name:"能耗(tce)",color:"#2E8BC0",data:c.en5.map(v=>Math.round(v*10000))},{name:"碳排(tCO₂)",color:"#2DD4BF",data:c.co5.map(v=>Math.round(v*10000))}],210,760)}
  <div class="concl"><b>能碳分析：</b>${c.name}近五年能耗与碳排累计下降 ${c.red}%，${c.eg==="A"?"能效处于行业先进水平。":c.eg==="B"?"处于行业平均水平，建议开展 AI 节能诊断。":"能效偏低，已纳入园区重点帮扶清单。"}数据来源：企业月度填报 + 园区电力营销数据交叉校核。</div>
  <div class="concl"><b>减排措施：</b>${meas}</div>`);};
})();
