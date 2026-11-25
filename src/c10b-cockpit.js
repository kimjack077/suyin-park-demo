/* ================= c10b 驾驶舱升级：多级能流图/碳流图（电·热·气·氢路径）+ 三维巡航/数据面板 ================= */
(function(){
/* ---- 产业口径（与企业名录一致；合计严格等于园区总量） ---- */
const IND=["新材料","化纤新材料","装备制造","冷链装备","数据服务","电子信息","生物医药","新能源"];
const IND_EN=[4.4,2.5,3.4,1.9,3.1,1.2,1.5,0.6];      /* 万tce，合计 18.6 */
const IND_CO=[10.6,6.4,8.2,4.3,5.6,2.5,3.7,1.0];     /* 万tCO₂，合计 42.3 */
const IND_COL=["#38BDF8","#60A5FA","#FBBF24","#F59E0B","#2DD4BF","#A78BFA","#F472B6","#4ADE80"];
window.QW_IND={names:IND,en:IND_EN,co:IND_CO,col:IND_COL};

/* 迭代比例拟合：由行/列合计 + 经验结构矩阵推导流量，保证节点流量守恒 */
function ipf(seed,rows,cols){let m=seed.map(r=>r.slice());
 for(let it=0;it<60;it++){
  m=m.map((r,i)=>{const s=r.reduce((a,b)=>a+b,0)||1;return r.map(v=>v*rows[i]/s);});
  for(let j=0;j<cols.length;j++){const s=m.reduce((a,r)=>a+r[j],0)||1;m.forEach(r=>r[j]*=cols[j]/s);}}
 return m;}
const r2=v=>Math.round(v*100)/100;

/* ---- 能流：供应侧 → 能源品种 → 用能产业 ---- */
function enFlow(){
 const SRC=[["国网购电",4.1,"电力"],["外购绿电",2.0,"电力"],["分布式光伏",1.6,"电力"],["集中式新能源",1.2,"电力"],
  ["天然气门站",4.1,"天然气"],["集中供热(蒸汽)",3.3,"热力"],["成品油",1.5,"油品"],["煤炭",0.8,"煤品"],["电解水制氢",0.05,"氢能"]];
 const TYP=["电力","天然气","热力","油品","煤品"],TV=[8.9,4.1,3.3,1.5,0.8];
 const seed=[[.45,.5,.6,.7,.95,.85,.5,.8],[.25,.2,.2,.15,.02,.08,.2,.1],[.2,.25,.1,.1,.01,.05,.25,.05],[.06,.03,.08,.05,.01,.02,.04,.04],[.05,.02,.02,.0,.0,.0,.01,.01]];
 const cols=IND_EN.slice();
 const M=ipf(seed,TV,cols);
 const nodes=[],links=[];
 const C={"国网购电":"#64748B","外购绿电":"#22C55E","分布式光伏":"#FACC15","集中式新能源":"#4ADE80","天然气门站":"#FB923C","集中供热(蒸汽)":"#F87171","成品油":"#A78BFA","煤炭":"#94A3B8","电解水制氢":"#22D3EE",
  "电力":"#38BDF8","天然气":"#FB923C","热力":"#F87171","油品":"#A78BFA","煤品":"#94A3B8","氢能":"#22D3EE"};
 SRC.forEach(s=>{nodes.push({name:s[0],depth:0,itemStyle:{color:C[s[0]]}});links.push({source:s[0],target:s[2],value:s[1]});});
 TYP.concat(["氢能"]).forEach(t=>nodes.push({name:t,depth:1,itemStyle:{color:C[t]}}));
 IND.forEach((n,j)=>nodes.push({name:n,depth:2,itemStyle:{color:IND_COL[j]}}));
 M.forEach((r,i)=>r.forEach((v,j)=>{if(v>0.004)links.push({source:TYP[i],target:IND[j],value:r2(v)});}));
 links.push({source:"氢能",target:"装备制造",value:0.05});
 return {nodes,links,unit:"万tce",total:18.6};}

/* ---- 碳流：排放源 → 核算范围 → 产业 ---- */
function coFlow(){
 const SRC=[["外购电力",21.5,"范围二 · 间接排放","#38BDF8"],["外购热力(蒸汽)",3.9,"范围二 · 间接排放","#F87171"],["天然气燃烧",6.6,"范围一 · 直接排放","#FB923C"],
  ["油品燃烧",2.8,"范围一 · 直接排放","#A78BFA"],["煤品燃烧",1.8,"范围一 · 直接排放","#94A3B8"],["工业过程排放",5.7,"范围一 · 直接排放","#FBBF24"]];
 const SC=["范围一 · 直接排放","范围二 · 间接排放"],SV=[16.9,25.4];
 const s1=[.45,.5,.35,.3,.05,.2,.4,.2];
 const M=ipf([s1,s1.map(v=>1-v)],SV,IND_CO);
 const nodes=[],links=[];
 SRC.forEach(s=>{nodes.push({name:s[0],depth:0,itemStyle:{color:s[3]}});links.push({source:s[0],target:s[2],value:s[1]});});
 nodes.push({name:SC[0],depth:1,itemStyle:{color:"#EF4444"}},{name:SC[1],depth:1,itemStyle:{color:"#3B82F6"}});
 IND.forEach((n,j)=>nodes.push({name:n,depth:2,itemStyle:{color:IND_COL[j]}}));
 M.forEach((r,i)=>r.forEach((v,j)=>links.push({source:SC[i],target:IND[j],value:r2(v)})));
 return {nodes,links,unit:"万tCO₂",total:42.3};}

function scaleFlow(f,k){return {nodes:f.nodes,unit:f.unit,total:f.total*k,links:f.links.map(l=>Object.assign({},l,{value:r2(l.value*k)}))};}

function sankeyOpt(f){const dark=uiFS();
 return {backgroundColor:"transparent",
  tooltip:Object.assign({trigger:"item",triggerOn:"mousemove",formatter:p=>p.dataType==="edge"?`${p.data.source} → ${p.data.target}<br><b>${p.data.value}</b> ${f.unit}`:`${p.name}<br><b>${r2(p.value)}</b> ${f.unit}`},TT()),
  series:[{type:"sankey",left:8,right:118,top:10,bottom:10,nodeWidth:12,nodeGap:9,layoutIterations:0,draggable:false,
   emphasis:{focus:"adjacency"},
   label:{color:dark?"#DCE8F5":"#1B2B3F",fontSize:11.5,fontWeight:600,formatter:p=>`${p.name}  {v|${r2(p.value)}}`,rich:{v:{color:dark?"#7DD3FC":"#0B6EC5",fontSize:11,fontFamily:"Consolas",fontWeight:400}}},
   lineStyle:{color:"gradient",curveness:.5,opacity:dark?.38:.32},
   itemStyle:{borderWidth:0},
   data:f.nodes,links:f.links}]};}

const SKM={y:1,q:0.26,m:0.085};
const _prevDashFlow=window.dashFlowChart;
window.dashFlowChart=function(mode){
 DASH_FLOW.mode=mode;
 if(DASH_FLOW.cid!==0||!echOK())return _prevDashFlow(mode);
 const p=DASH_FLOW.period||"y";const k=SKM[p]||1;
 const f=scaleFlow(mode==="co"?coFlow():enFlow(),k);
 const cOpts=`<option value="0" selected>园区整体（全部企业归集）</option>`+COMPANIES.map(x=>`<option value="${x.id}">${x.name}</option>`).join("");
 const pOpts=Object.keys(SK_LB).map(q=>`<option value="${q}" ${q===p?"selected":""}>${SK_LB[q]}</option>`).join("");
 const chips=mode==="co"
  ?`<span class="qw-chip">范围一<b>${(16.9*k).toFixed(1)}</b> 万t</span><span class="qw-chip">范围二<b>${(25.4*k).toFixed(1)}</b> 万t</span><span class="qw-chip">绿电/绿证抵减<b>${(4.6*k).toFixed(1)}</b> 万t</span><span class="qw-chip">余热回收减排<b>${(0.42*k).toFixed(2)}</b> 万t</span><span class="qw-chip">重点排放环节<b>外购电力 50.8%</b></span>`
  :`<span class="qw-chip">电气化率<b>47.8%</b></span><span class="qw-chip">清洁能源消费占比<b>28.4%</b></span><span class="qw-chip">绿电消纳率<b>96.1%</b></span><span class="qw-chip">绿氢产量<b>${Math.round(120*k)} t</b></span><span class="qw-chip">输配损失率<b>2.1%</b></span>`;
 return `<div id="dash-flow"><div class="sk-card">
  <div class="sk-hd"><b>${mode==="co"?"碳流分析":"能流分析"}</b><span class="sk-co" style="cursor:default">园区整体 · ${mode==="co"?"排放源 → 核算范围 → 产业":"供应 → 能源品种（电·气·热·油·煤·氢）→ 产业"}</span>
   <div class="sk-tools"><span class="sk-dim">切换对象</span><select class="sk-sel" onchange="dashFlowCo('${mode}',+this.value)">${cOpts}</select>
   <span class="sk-dim">时间维度</span><select class="sk-sel" onchange="dashFlowPeriod('${mode}',this.value)">${pOpts}</select>
   <span class="sk-legend">单位：${f.unit} · 点击产业节点查看企业</span></div></div>
  <div class="sk-body">${echPlace(372,inst=>{inst.setOption(sankeyOpt(f));
    inst.on("click",e=>{if(e.dataType==="node"&&IND.includes(e.name))qwIndModal(e.name,mode);});},_prevDashFlow(mode))}
   <div class="qw-chips">${chips}</div>
   <div class="sk-note" style="padding:10px 2px 0">${mode==="co"
    ?"<b>碳流解读：</b>外购电力间接排放 21.5 万tCO₂，是园区第一大排放环节；范围一中天然气燃烧与工业过程排放合计 12.3 万tCO₂，集中于新材料、化纤新材料产业。绿电交易与绿证核销已抵减 4.6 万tCO₂，下一步以绿电直供扩容与工艺电气化为主要降碳路径。"
    :"<b>能流解读：</b>园区能源由电网、绿电、光伏、天然气、集中供热、油品、煤炭及绿电制氢八类来源供给，经电、气、热、油、煤、氢六类品种流向八大产业；电力占终端用能 47.8%，绿电（外购绿电 + 光伏 + 集中式新能源）占电力 53.9%。新材料、装备制造、数据服务为前三大用能产业。"}</div></div></div></div>`;};
window.dashFlowPeriod=function(mode,p){DASH_FLOW.period=p;const box=document.getElementById("flowBox");
 if(box&&DASH_FLOW.cid===0&&echOK())box.innerHTML=dashFlowChart(DASH_FLOW.mode||mode);
 else{const key=dashFlowKey(mode);const b=document.getElementById("sk-body-"+key);if(b)b.innerHTML=sankeySvg(key,p);}};
window.flowMode=function(m){const box=document.getElementById("flowBox");if(box)box.innerHTML=dashFlowChart(m);
 document.querySelectorAll("[data-flowbtn]").forEach(b=>{const on=b.dataset.flowbtn===m;b.classList.toggle("on",on);b.classList.toggle("ghost",!on);});};
window.flowSvg=m=>dashFlowChart(m);

/* 产业节点下钻：该产业企业清单 */
window.qwIndModal=function(ind,mode){
 const j=IND.indexOf(ind);const list=COMPANIES.filter(c=>c.ind===ind||(ind==="新能源"&&c.ind==="新能源"));
 const tot=mode==="co"?IND_CO[j]:IND_EN[j],u=mode==="co"?"万tCO₂":"万tce";
 showModal(`产业能碳画像 —— ${ind}`,`<div class="kpis" style="grid-template-columns:repeat(4,1fr)">
  ${kpi(mode==="co"?"产业碳排放":"产业综合能耗",tot,u,"占园区 "+(tot/(mode==="co"?42.3:18.6)*100).toFixed(1)+"%")}
  ${kpi("重点企业",list.length,"家","纳入在线监测")}${kpi("同比",mode==="co"?"-5.8":"-4.1","%","持续下降","down ok")}${kpi("能效 A 级占比",list.length?Math.round(list.filter(c=>c.eg==="A").length/list.length*100):0,"%","")}</div>
  <table><tr><th>企业</th><th>片区</th><th>能耗(万tce)</th><th>碳排(万tCO₂)</th><th>能效等级</th><th></th></tr>
  ${list.map(c=>`<tr><td>${c.name}</td><td>${c.dist||"—"}</td><td>${c.en}</td><td>${c.co}</td><td>${c.eg} 级</td><td><button class="btn ghost sm" onclick="coModal(${c.id})">企业画像 →</button></td></tr>`).join("")||`<tr><td colspan="6">该产业其余企业按月度填报归集</td></tr>`}</table>
  <div class="concl"><b>分析：</b>${ind}产业${mode==="co"?"碳排放":"综合能耗"} ${tot} ${u}，${mode==="co"?"以外购电力间接排放为主，扩大绿电直供与工艺电气化是主要降碳路径。":"以电力为主要用能品种，建议持续推进余热回收与 AI 能效优化。"}</div>`);};

/* ---- 驾驶舱渲染接管：能流按钮样式 + 三维工具栏增加「自动巡航」「数据面板」 ---- */
const _dash=PAGES.dashboard.render;
PAGES.dashboard.render=function(){
 let h=_dash();
 h=h.replace(`<button class="btn sm on" data-flowbtn="en"`,`<button class="btn sm" data-flowbtn="en"`)
    .replace(`<span class="hint" style="margin:0">可切换企业 / 时间维度，点击企业下钻画像</span>`,`<span class="hint" style="margin:0">电 · 热 · 气 · 氢 全路径 · 可切换企业 / 时间维度</span>`)
    .replace(`<button class="btn ghost" onclick="toggleTwinFx()">孪生特效</button>`,
     `<button class="btn ghost" onclick="toggleTwinFx()">孪生特效</button>
      <button class="btn ghost" id="t3CruiseBtn" onclick="qwCruise()">▶ 自动巡航</button>
      <button class="btn ghost" id="t3PanelBtn" onclick="qwPanels()">数据面板</button>`)
    .replace(`<span><i style="background:#38BDF8"></i>扫描环 · 雷达扇面 · 数据光环</span>`,`<span><i style="background:#38BDF8"></i>悬停建筑显示企业实时数据</span>`);
 window.__t3Cruise=false;window.__t3PanelsAll=false;
 return h;};
window.qwCruise=function(){window.__t3Cruise=!window.__t3Cruise;const b=document.getElementById("t3CruiseBtn");if(b){b.textContent=window.__t3Cruise?"⏸ 停止巡航":"▶ 自动巡航";b.classList.toggle("on",window.__t3Cruise);}};
window.qwPanels=function(){const on=!window.__t3PanelsAll;const t=window.__T3&&window.__T3();if(t&&t.panelsAll)t.panelsAll(on);else window.__t3PanelsAll=on;
 const b=document.getElementById("t3PanelBtn");if(b)b.classList.toggle("on",on);};
})();
