/* ================= c10d 多维能碳分析升级：结构 / 范围 / 排序 / 对标 ================= */
(function(){
const IND=QW_IND.names,IND_EN=QW_IND.en,IND_CO=QW_IND.co,IND_COL=QW_IND.col;
const r1=v=>Math.round(v*10)/10,r2=v=>Math.round(v*100)/100;
const TYPES=["电力","燃气","热力","油品","煤品"];
const SH={en:{电力:[44.0,45.0,46.0,47.0,47.8],燃气:[21.0,21.3,21.6,21.8,22.0],热力:[18.0,17.9,17.8,17.8,17.7],油品:[10.5,9.9,9.3,8.6,8.1],煤品:[6.5,5.9,5.3,4.8,4.4]},
 co:{电力:[52.5,52.6,52.4,52.2,52.0],燃气:[16.0,16.6,17.3,18.1,18.9],热力:[15.6,15.7,15.9,16.0,16.1],油品:[9.4,9.3,9.2,9.1,9.0],煤品:[6.5,5.8,5.2,4.6,4.0]}};
const QS={热力:[1.18,0.86,0.78,1.18]}; /* 季度热力季节性 */
function typeSeries(metric,cyc,tot){
 const raw=TYPES.map(t=>tot.map((v,k)=>{let s=cyc==="y"?SH[metric][t][k]:SH[metric][t][4];if(cyc==="q"&&QS[t])s*=QS[t][k];return s;}));
 /* 归一化后乘以总量，保证分项合计 = 区域总量 */
 return TYPES.map((t,i)=>({name:t,color:PALETTE[i%8],data:tot.map((v,k)=>{const sum=raw.reduce((a,r)=>a+r[k],0);return r2(v*raw[i][k]/sum);})}));}
const ISH_A=[0.5,0.2,0.1,0,-0.4,-0.1,0,-0.3];
function indSeries(metric,cyc,tot){
 const base=(metric==="en"?IND_EN:IND_CO);const bs=base.reduce((a,b)=>a+b,0);
 const raw=IND.map((n,i)=>tot.map((_,k)=>Math.max(0.5,base[i]/bs*100+(cyc==="y"?ISH_A[i]*(4-k):0))));
 return IND.map((n,i)=>({name:n,color:IND_COL[i],data:tot.map((v,k)=>{const sum=raw.reduce((a,r)=>a+r[k],0);return r2(v*raw[i][k]/sum);})}));}

/* ---------- ① 趋势分析：区域趋势按用能类型堆叠 / 产业趋势按产业堆叠 ---------- */
const _m1=window.m1Update;
window.m1Update=function(){
 _m1();
 const chart=document.getElementById("m1Chart");if(!chart)return;
 const d=M1D[m1Cycle],nm={en:"能耗",co:"碳排"}[m1Metric],mu={en:"万tce",co:"万tCO₂"}[m1Metric];
 const tot=m1Metric==="en"?d.en:d.co,intData=m1Metric==="en"?d.int:d.cint;
 if(m1Dim.startsWith("区域")){
  chart.innerHTML=comboBarLine(d.labels,nm+"("+mu+")",tot,m1Metric==="en"?"能耗强度(tce/万元)":"碳排强度(t/万元)",intData,240,560,mu,"")+
   `<div class="sub2" style="margin-top:8px">分用能类型${nm}构成（${mu}）· 电力 / 燃气 / 热力 / 油品 / 煤品</div>`+
   stackedBar(d.labels,typeSeries(m1Metric,m1Cycle,tot),200,560);
 }else if(m1Dim.startsWith("产业")){
  const ser=indSeries(m1Metric,m1Cycle,tot);
  chart.innerHTML=stackedBar(d.labels,ser,240,560)+
   `<div class="sub2" style="margin-top:8px">主要产业${nm}变化率（%）</div>`+
   lineChart(d.labels,ser.slice(0,5).map(s=>({name:s.name,color:s.color,data:s.data.map((v,k)=>k?r1((v-s.data[k-1])/s.data[k-1]*100):0)})),180,560);
 }else{
  const top=COMPANIES.slice().sort((a,b)=>b[m1Metric==="en"?"en":"co"]-a[m1Metric==="en"?"en":"co"]).slice(0,5);
  chart.innerHTML=lineChart(YEARS.map(String),top.map((c,i)=>({name:c.name,color:PALETTE[i%8],data:(m1Metric==="en"?c.en5:c.co5).map(v=>r2(v))})),240,560)+
   `<div class="sub2" style="margin-top:8px">重点企业${nm}同比变化率（%）</div>`+
   lineChart(YEARS.map(String),top.map((c,i)=>({name:c.name,color:PALETTE[i%8],data:(m1Metric==="en"?c.en5:c.co5).map((v,k,a)=>k?r1((v-a[k-1])/a[k-1]*100):0)})),180,560);
 }
 setTimeout(()=>{flushCharts();resizeCharts();},30);};

/* ---------- ② 能碳结构分析：分能源类型 / 分产业 / 电力·燃气·油品·煤品细分结构 ---------- */
const M2D={
 type:{t:"分能源类型",it:TYPES,en:[8.9,4.1,3.3,1.5,0.8],co:[22.0,8.0,6.8,3.8,1.7],ye:[-3.2,-1.8,-6.9,-8.1,-12.0],yc:[-5.1,-2.0,-6.9,1.2,-12.0]},
 ind:{t:"分产业",it:IND,en:IND_EN,co:IND_CO,ye:[-6.2,-3.1,-4.0,-1.2,2.1,-3.4,-1.0,8.5],yc:[-8.1,-4.6,-5.2,-2.0,-3.5,-4.4,-1.8,4.0]},
 ele:{t:"电力结构",it:["电网购电","外购绿电","分布式光伏","集中式新能源"],en:[4.1,2.0,1.6,1.2],co:[21.5,0.3,0.0,0.2],ye:[-9.8,12.5,15.2,9.1],yc:[-9.5,-40.0,0,-20.0]},
 gas:{t:"燃气结构",it:["管道天然气","LNG","液化石油气","其他燃气"],en:[3.62,0.31,0.12,0.05],co:[7.06,0.60,0.25,0.09],ye:[-1.2,-4.5,-8.0,-15.0],yc:[-1.4,-4.8,-8.5,-15.0]},
 oil:{t:"油品结构",it:["柴油","汽油","燃料油","润滑油及其他"],en:[0.71,0.52,0.17,0.10],co:[1.83,1.30,0.45,0.22],ye:[-6.5,-9.8,-12.0,-3.0],yc:[2.4,-1.5,3.8,-2.0]},
 coal:{t:"煤品结构",it:["原煤","洗精煤","焦炭","型煤及其他"],en:[0.42,0.18,0.12,0.08],co:[0.90,0.38,0.28,0.14],ye:[-15.2,-10.0,-8.5,-12.0],yc:[-14.8,-9.6,-8.0,-11.5]}};
let M2S={dim:"type",metric:"en",year:2025,view:"val"};
RENDERERS.m2=()=>`
 <div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;align-items:center">
  <span style="font-size:12px;color:var(--txt2)">指标类型</span>
  <select id="m2Type" onchange="M2Set('metric',this.value)"><option value="en">能耗量</option><option value="co" ${M2S.metric==="co"?"selected":""}>碳排量</option></select>
  <span style="font-size:12px;color:var(--txt2)">年份</span>
  <select id="m2Year" onchange="M2Set('year',+this.value)">${YEARS.map(y=>`<option ${y===M2S.year?"selected":""}>${y}</option>`).join("")}</select>
  <span style="font-size:12px;color:var(--txt2)">分析维度</span>
  <span class="om-seg" id="m2Dim">${Object.entries(M2D).map(([k,v])=>`<span data-d="${k}" class="${k===M2S.dim?"on":""}" onclick="M2Set('dim','${k}')">${v.t}</span>`).join("")}</span>
  <span style="margin-left:auto" class="om-seg" id="m2View"><span data-v="val" onclick="M2Set('view','val')">数值</span><span data-v="pct" onclick="M2Set('view','pct')">占比</span><span data-v="yoy" onclick="M2Set('view','yoy')">同比</span></span>
 </div>
 <div class="grid g2"><div><div class="sub2" id="m2T1"></div><div id="m2Table"></div></div><div><div class="sub2" id="m2T2"></div><div id="m2Chart"></div></div></div>
 <div class="grid g2" style="margin-top:10px"><div><div class="sub2" id="m2T3"></div><div id="m2Trend"></div></div><div><div class="sub2">结构分析结论</div><div class="concl" id="m2Note" style="font-size:13px;line-height:2"></div></div></div>`;
window.M2Set=function(k,v){M2S[k]=v;m2Update();};
window.m2Update=function(){
 const tb=document.getElementById("m2Table");if(!tb)return;
 document.querySelectorAll("#m2Dim span").forEach(s=>s.classList.toggle("on",s.dataset.d===M2S.dim));
 document.querySelectorAll("#m2View span").forEach(s=>s.classList.toggle("on",s.dataset.v===M2S.view));
 const D=M2D[M2S.dim],m=M2S.metric,mu=m==="en"?"万tce":"万tCO₂",nm=m==="en"?"能耗":"碳排",yo=m==="en"?D.ye:D.yc;
 const n=2025-M2S.year;
 const rows=D.it.map((k,i)=>{const b=D[m][i],y=yo[i];const v=b/Math.pow(1+y/100,n);return {k,v:r2(v),yoy:y};});
 const tot=rows.reduce((s,r)=>s+r.v,0);
 document.getElementById("m2T1").textContent=`${D.t} · ${nm}明细（${M2S.year} 年，${mu}）`;
 tb.innerHTML=`<table><tr><th>${D.t.replace("分","")}</th><th>${nm}（${mu}）</th><th>占比</th><th>同比</th></tr>${rows.map(r=>`<tr><td>${r.k}</td>
  <td style="font-family:Consolas;${M2S.view==="val"?"font-weight:700;color:"+lc("#fff","#0B4E8F"):""}">${r.v}</td>
  <td style="${M2S.view==="pct"?"font-weight:700;color:"+lc("#7DD3FC","#0B6EC5"):""}">${tot?(r.v/tot*100).toFixed(1):0}%</td>
  <td class="${r.yoy<0?"down":r.yoy>0?"bad":""}" style="${M2S.view==="yoy"?"font-weight:700":""}">${r.yoy===0?"—":(r.yoy>0?"+":"")+r.yoy+"%"}</td></tr>`).join("")}
  <tr><td><b>合计</b></td><td style="font-family:Consolas"><b>${r2(tot)}</b></td><td>100%</td><td></td></tr></table>`;
 const ch=document.getElementById("m2Chart"),t2=document.getElementById("m2T2");
 if(M2S.view==="pct"){t2.textContent=`${D.t} · ${nm}占比`;ch.innerHTML=donut(rows.filter(r=>r.v>0).map(r=>({k:r.k,v:r.v,u:" "+mu})),240,26);}
 else if(M2S.view==="yoy"){t2.textContent=`${D.t} · ${nm}同比变化（%）`;ch.innerHTML=hBar(rows.map(r=>({k:r.k,v:r.yoy})),220,520," %",r=>r.v<=0?"#22C55E":"#EF4444");}
 else{t2.textContent=`${D.t} · ${nm}数值（${mu}）`;ch.innerHTML=hBar(rows.map(r=>({k:r.k,v:r.v})),220,520," "+mu,(r,i)=>PALETTE[i%8]);}
 document.getElementById("m2T3").textContent=`${D.t} · 近五年${nm}趋势（${mu}）`;
 document.getElementById("m2Trend").innerHTML=stackedBar(YEARS.map(String),D.it.map((k,i)=>({name:k,color:M2S.dim==="ind"?IND_COL[i]:PALETTE[i%8],data:YEARS.map(y=>r2(D[m][i]/Math.pow(1+yo[i]/100,2025-y)))})),220,560);
 const srt=rows.slice().sort((a,b)=>b.v-a.v),top=srt[0],dn=rows.slice().sort((a,b)=>a.yoy-b.yoy)[0],up=rows.filter(r=>r.yoy>0);
 const extra={type:"电力为第一大用能品种，绿电替代与电气化是降碳主线；煤品、油品加速退出。",ind:"新材料与装备制造为园区用能与排放主体，数据服务、新能源产业随产能扩张增长，需同步提高绿电配比。",
  ele:"分布式光伏与集中式新能源对应排放为零，外购绿电按绿证核销抵扣；电网购电是电力碳排放的唯一主要来源。",gas:"管道天然气为燃气消费主体，LNG 主要用于调峰与物流车辆，液化石油气逐步被替代。",
  oil:"柴油主要用于厂内物流与工程机械，电动叉车与氢能叉车替代后油品消费持续下降。",coal:"原煤集中于少量企业工业锅炉，已纳入煤改气 / 煤改电计划，预计 2027 年前基本退出。"}[M2S.dim];
 document.getElementById("m2Note").innerHTML=`① ${D.t}中 <b>${top.k}</b> ${nm}最高，为 ${top.v} ${mu}，占比 ${(top.v/tot*100).toFixed(1)}%；前两项合计占比 ${((srt[0].v+(srt[1]?srt[1].v:0))/tot*100).toFixed(1)}%，结构集中度较高。<br>
  ② 同比降幅最大的是 <b>${dn.k}</b>（${dn.yoy}%）${up.length?`；${up.map(u=>u.k).join("、")}同比上升，需纳入告警阈值动态管理`:"；各分项均同比下降"}。<br>③ ${extra}`;
 setTimeout(()=>{flushCharts();resizeCharts();},30);};

/* ---------- ③ 核算范围分析：范围一直接排放 / 范围二间接排放 ---------- */
const S1=[22.1,21.6,20.6,18.9,16.9],S2=[29.1,28.0,26.9,26.2,25.4];
const S1SUB={天然气燃烧:[.33,.34,.36,.37,.39],油品燃烧:[.18,.18,.17,.17,.166],煤品燃烧:[.17,.16,.14,.13,.107],工业过程排放:[.32,.32,.33,.33,.337]};
const S2SUB={外购电力:[.85,.85,.848,.847,.846],外购热力:[.15,.15,.152,.153,.154]};
const rate=a=>a.map((v,k)=>k?r1((v-a[k-1])/a[k-1]*100):null);
function scopeChart(){
 const fb=lineChart(YEARS.map(String),[{name:"范围一",color:"#F97316",data:S1},{name:"范围二",color:"#3B82F6",data:S2}],260,560);
 if(!echOK())return fb;
 return echPlace(270,inst=>inst.setOption({backgroundColor:"transparent",tooltip:Object.assign({trigger:"axis"},TT()),
  legend:{top:0,textStyle:{color:ETXT2(),fontSize:11},itemWidth:14,itemHeight:8},grid:{left:48,right:48,top:32,bottom:24},
  xAxis:Object.assign({type:"category",data:YEARS.map(String)},axCommon()),
  yAxis:[Object.assign({type:"value",name:"万tCO₂",nameTextStyle:{color:ETXT3(),fontSize:10}},axCommon(),splitX()),Object.assign({type:"value",name:"变化率%",nameTextStyle:{color:ETXT3(),fontSize:10}},axCommon(),{splitLine:{show:false}})],
  series:[{name:"范围一 直接排放",type:"bar",stack:"s",data:S1,barMaxWidth:30,itemStyle:{color:vgrad("#FDBA74","#EA580C")}},
   {name:"范围二 间接排放",type:"bar",stack:"s",data:S2,barMaxWidth:30,itemStyle:{color:vgrad("#93C5FD","#1D4ED8"),borderRadius:[4,4,0,0]}},
   {name:"范围一变化率",type:"line",yAxisIndex:1,data:rate(S1),smooth:true,symbolSize:6,lineStyle:{color:"#F97316",width:2},itemStyle:{color:"#F97316"}},
   {name:"范围二变化率",type:"line",yAxisIndex:1,data:rate(S2),smooth:true,symbolSize:6,lineStyle:{color:"#3B82F6",width:2,type:"dashed"},itemStyle:{color:"#3B82F6"}}]}),fb);}
function subTable(sub,tot,col){const ks=Object.keys(sub);
 return `<table><tr><th>排放来源</th><th>2025（万tCO₂）</th><th>占本范围</th><th>同比</th></tr>${ks.map(k=>{const a=sub[k].map((s,i)=>s*tot[i]);return `<tr><td><i style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${col};margin-right:6px"></i>${k}</td><td style="font-family:Consolas">${r2(a[4])}</td><td>${(sub[k][4]*100).toFixed(1)}%</td><td class="${a[4]<a[3]?"down":"bad"}">${((a[4]-a[3])/a[3]*100).toFixed(1)}%</td></tr>`;}).join("")}</table>`;}
RENDERERS.m3=()=>`
 <div class="grid" style="grid-template-columns:1.35fr 1fr">
  <div><div class="sub2">范围一 / 范围二碳排放量及变化率趋势</div>${scopeChart()}</div>
  <div><div class="sub2">2025 年核算范围构成</div>${donut([{k:"范围一 直接排放",v:16.9,u:" 万tCO₂"},{k:"范围二 间接排放",v:25.4,u:" 万tCO₂"}],230,26)}</div></div>
 <div class="grid g2" style="margin-top:8px">
  <div><div class="sub2">范围一 · 直接排放细分来源</div>${subTable(S1SUB,S1,"#F97316")}
   ${stackedBar(YEARS.map(String),Object.keys(S1SUB).map((k,i)=>({name:k,color:["#FB923C","#A78BFA","#94A3B8","#FBBF24"][i],data:S1SUB[k].map((s,y)=>r2(s*S1[y]))})),180,560)}</div>
  <div><div class="sub2">范围二 · 间接排放细分来源</div>${subTable(S2SUB,S2,"#3B82F6")}
   ${stackedBar(YEARS.map(String),Object.keys(S2SUB).map((k,i)=>({name:k,color:["#38BDF8","#F87171"][i],data:S2SUB[k].map((s,y)=>r2(s*S2[y]))})),180,560)}</div></div>
 <div class="concl" style="font-size:13px;line-height:2"><b>趋势分析：</b>① 范围一直接排放由 22.1 降至 16.9 万tCO₂，累计下降 23.5%，2024 年起降速加快（-8.3%、-10.6%），主要来自燃煤锅炉淘汰与工艺电气化；
  ② 范围二间接排放由 29.1 降至 25.4 万tCO₂，累计下降 12.7%，降幅相对平缓，外购电力占范围二的 84.6%，是园区第一大排放来源；
  ③ 范围二占比由 56.8% 升至 60.0%，表明园区减碳重心已转向电力侧，下一步应扩大绿电直供、绿证核销与储能晚峰替代；工业过程排放（5.7 万tCO₂）需依托工艺革新与 CCUS 试点逐步压降。</div>`;

/* ---------- ④ 企业数据排序：前 50 名 · 按产业 / 产品类别筛选 ---------- */
let M4S={key:"co",ind:"all",n:50};
RENDERERS.m4=()=>`
 <div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;align-items:center">
  <span style="font-size:12px;color:var(--txt2)">排序指标</span>
  <span class="om-seg" id="m4Key"><span data-k="co" onclick="M4Set('key','co')">碳排放量</span><span data-k="en" onclick="M4Set('key','en')">综合能耗</span><span data-k="asset" onclick="M4Set('key','asset')">碳资产</span><span data-k="red" onclick="M4Set('key','red')">减碳量</span></span>
  <span style="font-size:12px;color:var(--txt2)">产业 / 产品类别</span>
  <select onchange="M4Set('ind',this.value)"><option value="all">全部产业</option>${IND.concat(["公共服务","现代物流","节能环保"]).map(i=>`<option>${i}</option>`).join("")}</select>
  <select onchange="M4Set('n',+this.value)"><option value="50">前 50 名</option><option value="20">前 20 名</option><option value="10">前 10 名</option></select>
  <span class="hint" style="margin:0 0 0 auto">数据口径：2025 年度 · 在线监测 + 月度填报</span></div>
 <div class="grid" style="grid-template-columns:1fr 1.25fr">
  <div><div class="sub2" id="m4T"></div><div id="m4Chart"></div><div class="concl" id="m4Note" style="font-size:13px;line-height:1.95"></div></div>
  <div><div class="sub2" id="m4T2"></div><div id="m4Tbl" style="max-height:560px;overflow-y:auto"></div></div></div>`;
window.M4Set=function(k,v){M4S[k]=v;m4Update();};
window.m4Update=function(){
 const box=document.getElementById("m4Chart");if(!box)return;
 document.querySelectorAll("#m4Key span").forEach(s=>s.classList.toggle("on",s.dataset.k===M4S.key));
 const K={co:["碳排放量","万tCO₂",c=>c.co],en:["综合能耗","万tce",c=>c.en],asset:["碳资产","万元",c=>c.asset],red:["减碳量","万tCO₂",c=>c.co5[0]-c.co5[4]]}[M4S.key];
 let all=QW_ALL();if(M4S.ind!=="all")all=all.filter(c=>c.ind===M4S.ind);
 const list=all.map(c=>({c,v:K[2](c)})).sort((a,b)=>b.v-a.v).slice(0,M4S.n);
 const sum=all.reduce((s,c)=>s+K[2](c),0)||1;
 const dp=v=>M4S.key==="asset"?Math.round(v):v>=1?r2(v):(+v).toFixed(3);
 document.getElementById("m4T").textContent=`${M4S.ind==="all"?"园区":M4S.ind}企业${K[0]}排序 · TOP10（${K[1]}）`;
 box.innerHTML=hBar(list.slice(0,10).map(x=>({k:x.c.name,v:+dp(x.v)})),300,520," "+K[1],(it,i)=>i<3?"#EF4444":i<6?"#F59E0B":"#0EA5E9");
 document.getElementById("m4T2").textContent=`${K[0]}前 ${M4S.n} 名企业列表（共 ${all.length} 家参与排序）`;
 document.getElementById("m4Tbl").innerHTML=`<table><tr><th>排名</th><th>企业名称</th><th>产业</th><th>片区</th><th>${K[0]}(${K[1]})</th><th>占比</th><th>近五年降幅</th><th>能效</th></tr>${list.map((x,i)=>`<tr style="cursor:pointer" onclick="${x.c.other?`qwOtherModal(${x.c.id})`:`coModal(${x.c.id})`}">
  <td><span class="tag ${i<3?"lv3":i<10?"lv2":"lv1"}">${i+1}</span></td><td>${x.c.name}${x.c.other?"":` <span style="font-size:10px;color:#fff;background:#0B6EC5;border-radius:3px;padding:0 3px;white-space:nowrap">重点</span>`}</td><td>${x.c.ind}</td><td>${x.c.dist}</td>
  <td style="font-family:Consolas">${dp(x.v)}</td><td>${(x.v/sum*100).toFixed(1)}%</td><td class="down">-${x.c.red}%</td><td>${x.c.eg} 级</td></tr>`).join("")}</table>`;
 const top5=list.slice(0,5).reduce((s,x)=>s+x.v,0),top10=list.slice(0,10).reduce((s,x)=>s+x.v,0);
 const byInd={};list.slice(0,10).forEach(x=>byInd[x.c.ind]=(byInd[x.c.ind]||0)+1);const mi=Object.entries(byInd).sort((a,b)=>b[1]-a[1])[0];
 document.getElementById("m4Note").innerHTML=`<b>结论分析：</b>① ${K[0]}前 5 名企业合计占${M4S.ind==="all"?"园区":"该产业"} ${(top5/sum*100).toFixed(1)}%，前 10 名占 ${(top10/sum*100).toFixed(1)}%，头部集中特征明显；
  ② 前 10 名中 ${mi?mi[0]:"—"}产业企业 ${mi?mi[1]:0} 家，${M4S.key==="red"?"减碳成效突出，可作为同类产品对标标杆。":M4S.key==="asset"?"碳资产储备充足，具备参与碳市场交易的条件。":"是「一企一策」重点管控对象。"}
  ③ ${M4S.key==="co"||M4S.key==="en"?"能效 C 级企业已全部纳入 AI 节能诊断与改造清单，建议按季度跟踪排名变化。":"建议将减碳量与碳资产排名纳入年度绿色工厂评价与政策奖补依据。"}`;
 setTimeout(()=>{flushCharts();resizeCharts();},30);};

/* ---------- ⑤ 能碳对标分析：区域 / 产业 / 企业三级 + 国·省·市·区域标准对比 ---------- */
let M5S={ind:"新材料",co:1};
const BM=[["能耗强度","tce/万元",1.11,0.62,1.79,1.28,1.05,true],["碳排放强度","tCO₂/万元",2.53,1.21,4.65,3.10,2.40,true],
 ["单位能耗碳排放","tCO₂/tce",2.27,1.95,2.60,2.42,2.20,true],["清洁能源消费占比","%",28.4,45.0,21.5,24.0,30.0,false]];
const PARK_U=[2.35,2.34,2.33,2.31,2.27];
function indU(ind){const i=IND.indexOf(ind);const u=IND_CO[i]/IND_EN[i];const a=ISH_A[i]*0.02;return YEARS.map((_,k)=>r2(u*(1+0.012*(4-k))+a*(4-k)));}
function coU(id){const c=COMPANIES.find(x=>x.id===id);return c.co5.map((v,k)=>r2(v/c.en5[k]));}
RENDERERS.m5=()=>`
 <div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;align-items:center">
  <span style="font-size:12px;color:var(--txt2)">对标产业</span><select onchange="M5Set('ind',this.value)">${IND.map(i=>`<option ${i===M5S.ind?"selected":""}>${i}</option>`).join("")}</select>
  <span style="font-size:12px;color:var(--txt2)">对标企业</span><select onchange="M5Set('co',+this.value)">${COMPANIES.map(c=>`<option value="${c.id}" ${c.id===M5S.co?"selected":""}>${c.name}</option>`).join("")}</select>
  <span class="hint" style="margin:0 0 0 auto">对标依据：全国同类园区先进值 · 自治区平均 · 银川市平均 · 园区年度目标</span></div>
 <div class="grid g2"><div><div class="sub2">单位能耗碳排放对标（区域 / 产业 / 企业三级，tCO₂/tce）</div><div id="m5C1"></div><div class="concl" id="m5N1" style="font-size:13px;line-height:1.95"></div></div>
  <div><div class="sub2">区域指标对标（国 / 省 / 市 / 区域）</div>
   <table><tr><th>指标</th><th>园区实际</th><th>全国先进</th><th>自治区</th><th>银川市</th><th>园区目标</th><th>评价</th></tr>
   ${BM.map(b=>{const better=(x,y)=>b[7]?x<=y:x>=y;const ev=better(b[2],b[3])?["领先","lv1"]:better(b[2],b[5])?["优于省市","lv1"]:better(b[2],b[4])?["优于省平均","lv2"]:["待提升","lv3"];
    return `<tr><td>${b[0]}<div style="font-size:10px;color:var(--txt3)">${b[1]}</div></td><td style="font-family:Consolas;font-weight:700;color:${lc("#fff","#0B4E8F")}">${b[2]}</td><td>${b[3]}</td><td>${b[4]}</td><td>${b[5]}</td><td>${b[6]}</td><td><span class="tag ${ev[1]}">${ev[0]}</span></td></tr>`;}).join("")}</table>
   <div id="m5C2" style="margin-top:8px"></div></div></div>
 <div class="grid g2" style="margin-top:8px"><div><div class="sub2">区域能耗强度 / 碳排放强度 / 单位能耗碳排放 · 近五年</div>
  ${lineChart(YEARS.map(String),[{name:"能耗强度(tce/万元)",color:"#38BDF8",data:PARK.energyInt},{name:"碳排放强度(tCO₂/万元)",color:"#F97316",data:PARK.carbonInt},{name:"单位能耗碳排放(tCO₂/tce)",color:"#22C55E",data:PARK_U}],230,560)}</div>
  <div><div class="sub2">对标结论</div><div class="concl" style="font-size:13px;line-height:2"><b>区域对标：</b>① 园区能耗强度、碳排放强度均优于自治区与银川市平均水平，近五年分别累计下降 21.8%、24.2%；
   ② 与全国同类园区先进值相比，能耗强度仍有 44% 差距，碳排放强度差距 52%，主要受新材料、化纤新材料等流程型产业结构影响；
   ③ 清洁能源消费占比 28.4%，距园区年度目标 30% 差 1.6 个百分点，需加快集中式光伏二期与绿电直供扩容；
   ④ 建议将单位能耗碳排放 2.20 tCO₂/tce 作为 2026 年考核硬约束，并按产业分解目标。</div></div></div>`;
window.M5Set=function(k,v){M5S[k]=v;m5Update();};
function m5Update(){const b1=document.getElementById("m5C1");if(!b1)return;
 const iu=indU(M5S.ind),cu=coU(M5S.co),c=COMPANIES.find(x=>x.id===M5S.co);
 b1.innerHTML=lineChart(YEARS.map(String),[{name:"园区（区域）",color:"#38BDF8",data:PARK_U},{name:M5S.ind+"产业",color:"#2DD4BF",data:iu},{name:c.name,color:"#FBBF24",data:cu},{name:"全国同类先进值",color:"#94A3B8",data:YEARS.map(()=>1.95)}],250,560);
 const gp=((cu[4]-1.95)/1.95*100).toFixed(1);
 document.getElementById("m5N1").innerHTML=`<b>三级对标：</b>园区单位能耗碳排放 2.27，近五年累计下降 3.4%；${M5S.ind}产业 ${iu[4]}，${iu[4]>2.27?"高于":"低于"}园区平均；${c.name} ${cu[4]}，较全国同类先进值${gp>0?"高 "+gp+"%":"低 "+Math.abs(gp)+"%"}，${gp>0?"建议纳入 AI 节能诊断与绿电替代重点对象。":"已达先进水平，可作为产业标杆推广。"}`;
 const b2=document.getElementById("m5C2");
 if(b2&&echOK())b2.innerHTML=echPlace(200,inst=>inst.setOption({backgroundColor:"transparent",tooltip:Object.assign({trigger:"axis"},TT()),
  legend:{top:0,textStyle:{color:ETXT2(),fontSize:10.5},itemWidth:12,itemHeight:8},grid:{left:40,right:12,top:30,bottom:22},
  xAxis:Object.assign({type:"category",data:BM.slice(0,3).map(b=>b[0])},axCommon()),yAxis:Object.assign({type:"value"},axCommon(),splitX()),
  series:[["园区实际","#0B6EC5",2],["全国先进","#22C55E",3],["自治区","#F97316",4],["银川市","#A78BFA",5],["园区目标","#94A3B8",6]].map(s=>({name:s[0],type:"bar",barMaxWidth:14,itemStyle:{color:s[1],borderRadius:[3,3,0,0]},data:BM.slice(0,3).map(b=>b[s[2]])}))}),"");
 setTimeout(()=>{flushCharts();resizeCharts();},30);}
window.m5Update=m5Update;

/* 页签切换后补渲染 m5（原 bindTabs 仅处理 m1/m2/m4） */
document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest('.tab[data-t="m5"]');if(t)setTimeout(m5Update,20);},true);
})();
