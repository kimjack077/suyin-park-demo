/* ================= c10e 零碳园区碳排放报告：年/季/月 + 时间戳 + 在线预览 + PDF/Word 下载（8 章节） ================= */
(function(){
document.head.insertAdjacentHTML("beforeend",`<style id="c10e-css">
.rpt-bar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.rpt-bar .lb{font-size:12px;color:var(--txt2);font-weight:600;}
.rpt-steps{margin:6px 0 2px;}
.rpt-steps .s{display:flex;align-items:center;gap:10px;padding:7px 0;font-size:13px;color:var(--txt3);}
.rpt-steps .s i{width:18px;height:18px;border-radius:50%;border:2px solid var(--line);flex:none;}
.rpt-steps .s.run{color:var(--txt);} .rpt-steps .s.run i{border-color:#38BDF8;border-top-color:transparent;animation:rspin .8s linear infinite;}
.rpt-steps .s.ok{color:var(--txt2);} .rpt-steps .s.ok i{border-color:#22C55E;background:#22C55E;box-shadow:inset 0 0 0 3px #fff;}
@keyframes rspin{to{transform:rotate(360deg);}}
.rpt-prev{background:#E9EEF5;border-radius:8px;padding:14px;max-height:66vh;overflow:auto;}
.rpt-doc{width:794px;margin:0 auto;}
.rpt-page{width:794px;min-height:1123px;background:#fff;color:#1F2937;margin:0 auto 14px;padding:58px 64px;box-shadow:0 4px 16px rgba(15,23,42,.18);font-family:"SimSun","Songti SC","Microsoft YaHei",serif;font-size:13.5px;line-height:1.85;position:relative;}
.rpt-page h1{font-size:30px;text-align:center;font-family:"SimHei","Microsoft YaHei",sans-serif;letter-spacing:4px;margin:150px 0 18px;color:#0F2A4A;}
.rpt-page h2{font-size:17px;font-family:"SimHei","Microsoft YaHei",sans-serif;color:#0F2A4A;margin:18px 0 8px;padding-bottom:4px;border-bottom:2px solid #0B6EC5;}
.rpt-page p{text-indent:2em;margin:4px 0;}
.rpt-page table{width:100%;border-collapse:collapse;margin:6px 0 10px;font-size:12.5px;}
.rpt-page th,.rpt-page td{border:1px solid #9CA3AF;padding:4px 8px;text-align:center;color:#1F2937!important;background:#fff!important;}
.rpt-page th{background:#EEF4FB!important;font-weight:700;}
.rpt-page img{display:block;margin:6px auto;width:640px;}
.rpt-page .cap{text-align:center;font-size:12px;color:#475569;margin-bottom:6px;}
.rpt-page .ft{position:absolute;bottom:26px;left:64px;right:64px;font-size:11px;color:#94A3B8;display:flex;justify-content:space-between;border-top:1px solid #E5E7EB;padding-top:6px;}
.rpt-cover-meta{width:420px;margin:80px auto 0;font-size:15px;line-height:2.4;}
.rpt-cover-meta div{display:flex;border-bottom:1px solid #CBD5E1;}
.rpt-cover-meta span{width:120px;color:#475569;}
.rpt-hist td{font-size:12px;}
</style>`);

const RPT_YOY={y:[-6.2,-8.0,-6.7,1.9,1.8,0,0],q:[-5.6,-7.1,-6.0,2.1,1.5,0,0],m:[-4.8,-6.4,-5.5,2.4,1.2,0,0]};
const KN=["碳排放量","单位GDP碳排放","单位GDP能耗","清洁能源消费占比","绿电消纳率","控排企业数","控排企业履约率"];
const KU=["万tCO₂","tCO₂/万元","tce/万元","%","%","家","%"];
const ALM={y:[9,34,83],q:[3,10,25],m:[1,4,8]};
const IND=QW_IND.names,IND_CO=QW_IND.co;
const r2=v=>Math.round(v*100)/100;
function D(){const k=rptKey,r=REPORTS[k],sc=r.core[0]/42.3;
 const cyc={y:"年度",q:"季度",m:"月度"}[k],s=RPT_TS_STATE;
 const per=k==="y"?s.y+" 年度":k==="q"?s.y+" 年第 "+(s.q||4)+" 季度":s.y+" 年 "+(s.m||10)+" 月";
 const scope=[["范围一","化石燃料燃烧",11.2*sc],["范围一","工业过程排放",5.7*sc],["范围二","外购电力",21.5*sc],["范围二","外购热力",3.9*sc]];
 const types=[["电力",22.0],["燃气",8.0],["热力",6.8],["油品",3.8],["煤品",1.7]].map(t=>[t[0],t[1]*sc]);
 const srcs=[["外购电力","范围二",21.5],["天然气燃烧","范围一",6.6],["工业过程排放","范围一",5.7],["外购热力","范围二",3.9],["油品燃烧","范围一",2.8],["煤品燃烧","范围一",1.8]].map(x=>[x[0],x[1],x[2]*sc]);
 const inds=IND.map((n,i)=>[n,IND_CO[i]*sc]).sort((a,b)=>b[1]-a[1]);
 const al=ALM[k],at=al.reduce((a,b)=>a+b,0);
 const alc=COMPANIES.map(c=>[c.name,Math.max(1,Math.round((c.co*2+4)*at/126))]).sort((a,b)=>b[1]-a[1]);
 return {k,r,sc,cyc,per,ts:rptTsStr(),scope,types,srcs,inds,al,at,alc,yoy:RPT_YOY[k]};}

/* ---------- 页面 ---------- */
const HIST=[{n:"苏银产业园碳排放报告（2025 年第三季度）",t:"2025-10-08 09:12",u:"系统自动生成",c:"q"},{n:"苏银产业园碳排放报告（2025 年 10 月）",t:"2025-11-03 08:30",u:"系统自动生成",c:"m"},{n:"苏银产业园碳排放报告（2024 年度）",t:"2025-01-15 10:46",u:"经发局 · 王工",c:"y"}];
reg("report",()=>`
<div class="card">
 <div class="rpt-bar"><h3 style="margin:0">零碳园区碳排放报告</h3>
  <div style="margin-left:auto" class="rpt-bar">
   <span class="lb">报告周期</span><select id="rptCycle" onchange="rptSwitch(this.value)"><option value="y" ${rptKey==="y"?"selected":""}>年度</option><option value="q" ${rptKey==="q"?"selected":""}>季度</option><option value="m" ${rptKey==="m"?"selected":""}>月度</option></select>
   <span id="rptTsBox" class="rpt-bar"></span>
   <button class="btn" onclick="rptCreate()">＋ 创建报告</button>
   <button class="btn ghost" onclick="rptCreate('pdf')">下载 PDF</button>
   <button class="btn ghost" onclick="rptCreate('word')">下载 Word</button></div></div>
 <div class="hint" style="margin:8px 0 12px">报告时间戳：<span id="rptTsShow" style="color:#0B6EC5"></span>　｜　报告内容：核心指标 · 排放趋势 · 核算范围 · 能碳结构 · 行业碳排放 · 碳达峰推演 · 能碳告警 · 结论建议（基于平台核算数据自动生成）</div>
 <div class="kpis" style="grid-template-columns:repeat(7,1fr)" id="rptKpi"></div>
 <div class="grid g2">
  <div><div class="sub2">一、碳排放趋势分析 · 环比</div><div id="rptTrend"></div></div>
  <div><div class="sub2">二、核算范围分析</div><div id="rptScope"></div></div>
  <div><div class="sub2">三、能碳结构 · 排放源与能源类型统计</div><div id="rptStruct"></div></div>
  <div><div class="sub2">四、行业碳排放构成与排序</div><div id="rptInd"></div></div>
  <div><div class="sub2">五、碳达峰推演（三情景）</div><div id="rptPeak"></div></div>
  <div><div class="sub2">六、能碳告警 · 总数占比与企业排序</div><div id="rptAlarm"></div></div>
 </div>
 <div class="card" style="background:rgba(0,91,172,.05);margin:14px 0 0"><h3>七、结论与建议（基于上述分析自动生成）</h3><div id="rptConcl"></div></div>
</div>
<div class="card"><h3>报告记录</h3><table class="rpt-hist" id="rptHist"></table></div>`);

function concl(d){const y=d.yoy;
 return {ok:`碳排放总量 ${r2(d.r.core[0])} 万tCO₂，同比下降 ${Math.abs(y[0])}%；单位 GDP 碳排放 ${d.r.core[1]} tCO₂/万元，同比下降 ${Math.abs(y[1])}%；清洁能源消费占比 ${d.r.core[3]}%，绿电消纳率 ${d.r.core[4]}%，8 家控排企业履约率 100%，零碳园区创建 6 项核心指标中 4 项达标。`,
  risk:`① 单位能耗碳排放 2.27 tCO₂/tce，未达 2.20 年度目标；② 范围二间接排放占比 60.0%，外购电力为第一大排放源（${r2(d.scope[2][2])} 万tCO₂）；③ 油品碳排同比上升 1.2%，集中于厂内物流环节；④ 报告期内紧急告警 ${d.al[0]} 条，海归小镇生物医药园碳配额存在缺口风险。`,
  sug:`① 加快集中式光伏二期与绿电直供扩容，绿电直供企业由 8 家扩大至 12 家；② 将莱卡纤维新材料精馏热集成改造列入 2026 年重点工程，预计年节能 310 tce；③ 推广电动 / 氢能叉车替代，压降油品消费；④ 对配额缺口企业提前启动 CCER 购置预案，并将单位能耗碳排放纳入企业季度考核。`};}

window.renderReport=function(){
 const box=document.getElementById("rptKpi");if(!box)return;const d=D();
 box.innerHTML=d.r.core.map((v,i)=>{const y=d.yoy[i];const txt=i===5?"与上期持平":i===6?"全部履约":(i>=3?"同比 "+(y>0?"+":"")+y+" pct":"同比 "+(y>0?"+":"")+y+"%");
  return kpi(KN[i],v,KU[i],txt,(i<3?y<0:y>=0)?(i<3?"down ok":"up ok"):"");}).join("");
 document.getElementById("rptTrend").innerHTML=comboBarLine(d.r.labels,"碳排放量(万tCO₂)",d.r.carbon,"环比(%)",d.r.carbon.map((v,i)=>i?+(((v-d.r.carbon[i-1])/d.r.carbon[i-1])*100).toFixed(1):null),230,560,"万t","%")+
  `<div class="concl"><b>趋势：</b>${d.k==="y"?"近五年碳排放由 51.2 降至 42.3 万tCO₂，累计下降 17.4%，连续 4 年下降。":d.k==="q"?"2025 年各季度碳排放总体平稳，Q3 受空调负荷影响小幅上升，Q4 回落。":"近五个月碳排放逐月回落，10 月环比下降 4.6%。"}</div>`;
 document.getElementById("rptScope").innerHTML=`<div class="grid g2" style="gap:6px;align-items:center"><div>${donut(d.scope.map(s=>({k:s[0]+"·"+s[1],v:r2(s[2]),u:" 万tCO₂"})),200,24)}</div>
  <table><tr><th>范围</th><th>来源</th><th>排放量</th><th>占比</th></tr>${d.scope.map(s=>`<tr><td>${s[0]}</td><td>${s[1]}</td><td>${r2(s[2])}</td><td>${(s[2]/d.r.core[0]*100).toFixed(1)}%</td></tr>`).join("")}</table></div>`;
 document.getElementById("rptStruct").innerHTML=`<div class="grid g2" style="gap:6px;align-items:center"><div>${donut(d.types.map(t=>({k:t[0],v:r2(t[1]),u:" 万tCO₂"})),200,24)}</div>
  <table><tr><th>主要排放源</th><th>范围</th><th>排放量(万tCO₂)</th></tr>${d.srcs.map(s=>`<tr><td>${s[0]}</td><td>${s[1]}</td><td>${r2(s[2])}</td></tr>`).join("")}</table></div>`;
 document.getElementById("rptInd").innerHTML=hBar(d.inds.map(x=>({k:x[0],v:r2(x[1])})),220,560," 万tCO₂",(it,i)=>PALETTE[i%8]);
 document.getElementById("rptPeak").innerHTML=lineChart(PATHS.years,[{name:"基准情景",color:"#64748B",data:PATHS.base},{name:"低碳情景",color:"#0B6EC5",data:PATHS.low},{name:"零碳情景",color:"#16A34A",data:PATHS.zero}],200,560)+
  `<table><tr><th>情景</th><th>达峰时间</th><th>达峰值(万tCO₂)</th><th>2035 年排放</th></tr><tr><td>基准情景</td><td>2030 年</td><td>46.5</td><td>43.0</td></tr><tr><td>低碳情景</td><td>2027 年</td><td>43.4</td><td>30.2</td></tr><tr><td>零碳情景</td><td>已达峰（2025）</td><td>42.3</td><td>9.0</td></tr></table>`;
 document.getElementById("rptAlarm").innerHTML=`<div class="grid g2" style="gap:6px;align-items:center"><div>${donut([{k:"紧急",v:d.al[0],u:" 条"},{k:"重要",v:d.al[1],u:" 条"},{k:"次要",v:d.al[2],u:" 条"}],200,24)}</div>
  <div>${hBar(d.alc.slice(0,5).map(x=>({k:x[0],v:x[1]})),160,300," 条",(it,i)=>i<2?"#EF4444":"#F59E0B")}</div></div>`;
 const c=concl(d);
 document.getElementById("rptConcl").innerHTML=`<p style="line-height:2;font-size:13px"><b style="color:#16A34A">主要成效：</b>${c.ok}</p><p style="line-height:2;font-size:13px"><b style="color:#D97706">存在问题与风险：</b>${c.risk}</p><p style="line-height:2;font-size:13px"><b style="color:#0B6EC5">重点工作建议：</b>${c.sug}</p>`;
 const tb=document.getElementById("rptTsBox");if(tb)tb.innerHTML=rptTsBoxHtml();
 const sh=document.getElementById("rptTsShow");if(sh)sh.textContent=rptTsStr();
 const h=document.getElementById("rptHist");
 if(h)h.innerHTML=`<tr><th>报告名称</th><th>周期</th><th>生成时间</th><th>创建人</th><th>操作</th></tr>`+HIST.map((x,i)=>`<tr><td>${x.n}</td><td>${{y:"年度",q:"季度",m:"月度"}[x.c]}</td><td>${x.t}</td><td>${x.u}</td><td><button class="btn ghost sm" onclick="rptHistOpen(${i})">预览</button></td></tr>`).join("");
 setTimeout(()=>{flushCharts();resizeCharts();},40);};
window.rptHistOpen=function(i){const x=HIST[i];if(x.c!==rptKey){rptKey=x.c;const s=document.getElementById("rptCycle");if(s)s.value=x.c;renderReport();}rptCreate("preview");};

/* ---------- 离屏图表（报告插图，白底） ---------- */
function chartImg(opt,w,h){try{if(!window.echarts)return "";const el=document.createElement("div");el.style.cssText=`position:fixed;left:-9999px;top:0;width:${w}px;height:${h}px`;document.body.appendChild(el);
 const inst=echarts.init(el,null,{renderer:"canvas"});inst.setOption(Object.assign({animation:false,backgroundColor:"#fff",textStyle:{fontFamily:"Microsoft YaHei"}},opt));
 const u=inst.getDataURL({type:"png",pixelRatio:2,backgroundColor:"#fff"});inst.dispose();el.remove();return u;}catch(e){return "";}}
const AXL={axisLine:{lineStyle:{color:"#94A3B8"}},axisLabel:{color:"#334155",fontSize:11},splitLine:{lineStyle:{color:"#E2E8F0"}}};
function imgs(d){const C=["#0B6EC5","#14B8A6","#F59E0B","#8B5CF6","#EF4444","#0EA5E9","#22C55E","#64748B"];
 const pie=(data,title)=>({color:C,title:{text:title,left:"center",top:4,textStyle:{fontSize:13,color:"#0F2A4A"}},legend:{bottom:4,textStyle:{fontSize:11}},
  series:[{type:"pie",radius:["38%","64%"],center:["50%","50%"],label:{formatter:"{b}\n{c}（{d}%）",fontSize:11},data}]});
 return {
  trend:chartImg({color:C,title:{text:"碳排放量及环比趋势",left:"center",top:4,textStyle:{fontSize:13,color:"#0F2A4A"}},legend:{top:26},grid:{left:56,right:56,top:60,bottom:30},
   xAxis:Object.assign({type:"category",data:d.r.labels},AXL),yAxis:[Object.assign({type:"value",name:"万tCO₂"},AXL),Object.assign({type:"value",name:"环比%"},AXL,{splitLine:{show:false}})],
   series:[{name:"碳排放量",type:"bar",data:d.r.carbon,barMaxWidth:34,label:{show:true,position:"top",fontSize:11}},{name:"环比",type:"line",yAxisIndex:1,data:d.r.carbon.map((v,i)=>i?+(((v-d.r.carbon[i-1])/d.r.carbon[i-1])*100).toFixed(1):null),itemStyle:{color:"#F59E0B"}}]},640,280),
  scope:chartImg(pie(d.scope.map(s=>({name:s[0]+"·"+s[1],value:r2(s[2])})),"核算范围构成（万tCO₂）"),640,280),
  struct:chartImg(pie(d.types.map(t=>({name:t[0],value:r2(t[1])})),"分能源类型碳排放（万tCO₂）"),640,280),
  ind:chartImg({color:C,title:{text:"行业碳排放排序（万tCO₂）",left:"center",top:4,textStyle:{fontSize:13,color:"#0F2A4A"}},grid:{left:90,right:60,top:40,bottom:20},
   xAxis:Object.assign({type:"value"},AXL),yAxis:Object.assign({type:"category",data:d.inds.map(x=>x[0]).reverse()},AXL),
   series:[{type:"bar",data:d.inds.map(x=>r2(x[1])).reverse(),barMaxWidth:16,itemStyle:{color:"#0B6EC5"},label:{show:true,position:"right"}}]},640,280),
  peak:chartImg({color:["#64748B","#0B6EC5","#16A34A"],title:{text:"碳达峰三情景推演（万tCO₂）",left:"center",top:4,textStyle:{fontSize:13,color:"#0F2A4A"}},legend:{top:26},grid:{left:50,right:30,top:60,bottom:30},
   xAxis:Object.assign({type:"category",data:PATHS.years},AXL),yAxis:Object.assign({type:"value"},AXL),
   series:[{name:"基准情景",type:"line",data:PATHS.base,markPoint:{data:[{type:"max",name:"峰值"}],symbolSize:44}},{name:"低碳情景",type:"line",data:PATHS.low,markPoint:{data:[{type:"max",name:"峰值"}],symbolSize:44}},{name:"零碳情景",type:"line",data:PATHS.zero}]},640,280),
  alarm:chartImg(pie([{name:"紧急",value:d.al[0],itemStyle:{color:"#EF4444"}},{name:"重要",value:d.al[1],itemStyle:{color:"#F59E0B"}},{name:"次要",value:d.al[2],itemStyle:{color:"#0EA5E9"}}],"告警等级占比（条）"),640,260)};}

/* ---------- 报告文档（A4 分页） ---------- */
function docHTML(d,I,forWord){
 const img=(k,cap)=>I[k]?`<img src="${forWord?("file:///C:/qwreport/"+k+".png"):I[k]}" width="640" ${forWord?'height="'+(k==="alarm"?260:280)+'"':""}><div class="cap">${cap}</div>`:"";
 const tbl=(h,rows)=>`<table><tr>${h.map(x=>`<th>${x}</th>`).join("")}</tr>${rows.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join("")}</tr>`).join("")}</table>`;
 const now=new Date(),ds=now.getFullYear()+" 年 "+(now.getMonth()+1)+" 月 "+now.getDate()+" 日";
 const no="SYZC-"+d.k.toUpperCase()+"-"+now.getFullYear()+String(now.getMonth()+1).padStart(2,"0")+String(now.getDate()).padStart(2,"0")+"-01";
 const ft=(p)=>`<div class="ft"><span>苏银产业园 AI 零碳数智平台 · 碳排放报告</span><span>第 ${p} 页</span></div>`;
 const br=forWord?`<br clear=all style="page-break-before:always">`:"";
 const c=concl(d);
 const pages=[
 `<h1>苏银产业园碳排放报告</h1><div style="text-align:center;font-size:18px;color:#334155;letter-spacing:2px">（${d.per}）</div>
  <div class="rpt-cover-meta"><div><span>报告主体</span>苏银产业园管理委员会</div><div><span>报告周期</span>${d.cyc}</div><div><span>报告时间戳</span>${d.ts}</div>
  <div><span>编制系统</span>苏银产业园 AI 零碳数智平台</div><div><span>报告编号</span>${no}</div><div><span>生成日期</span>${ds}</div></div>
  <div style="position:absolute;bottom:90px;left:0;right:0;text-align:center;font-size:12px;color:#64748B">本报告依据平台在线监测数据与企业填报数据自动核算生成，核算口径统一版本管理，数据可追溯。</div>`,
 `<h2>一、核心指标总览</h2><p>报告期内（${d.per}），园区主要能碳指标如下：</p>
  ${tbl(["指标","数值","单位","同比"],d.r.core.map((v,i)=>[KN[i],v,KU[i],i>=5?"持平":(d.yoy[i]>0?"+":"")+d.yoy[i]+(i>=3?" pct":"%")]))}
  <h2>二、碳排放趋势分析</h2>${img("trend","图 1  碳排放量及环比趋势")}
  <p>${d.k==="y"?"近五年园区碳排放总量由 51.2 万tCO₂ 下降至 42.3 万tCO₂，累计下降 17.4%，连续 4 年下降，碳排放强度降幅（24.2%）大于总量降幅，园区处于总量与强度“双降”通道。":d.k==="q"?"2025 年各季度碳排放总体平稳，三季度受制冷负荷影响小幅上升，四季度随光伏出力与节能改造见效回落。":"近五个月碳排放逐月回落，月度环比平均下降 2.5%，绿电交易占比提升是主要原因。"}</p>`,
 `<h2>三、核算范围分析</h2>${img("scope","图 2  范围一 / 范围二排放构成")}
  ${tbl(["核算范围","排放来源","排放量（万tCO₂）","占比"],d.scope.map(s=>[s[0],s[1],r2(s[2]),(s[2]/d.r.core[0]*100).toFixed(1)+"%"]))}
  <p>范围二间接排放占比 60.0%，其中外购电力占范围二的 84.6%；范围一直接排放中化石燃料燃烧占 66.3%，工业过程排放占 33.7%。</p>
  <h2>四、能碳结构分析</h2>${img("struct","图 3  分能源类型碳排放构成")}
  ${tbl(["排放源","核算范围","排放量（万tCO₂）","占比"],d.srcs.map(s=>[s[0],s[1],r2(s[2]),(s[2]/d.r.core[0]*100).toFixed(1)+"%"]))}`,
 `<h2>五、行业碳排放构成</h2>${img("ind","图 4  行业碳排放排序")}
  ${tbl(["排名","行业","排放量（万tCO₂）","占比"],d.inds.map((x,i)=>[i+1,x[0],r2(x[1]),(x[1]/d.r.core[0]*100).toFixed(1)+"%"]))}
  <h2>六、碳达峰推演</h2>${img("peak","图 5  基准 / 低碳 / 零碳三情景碳排放路径")}
  ${tbl(["情景","达峰时间","达峰值（万tCO₂）","2035 年排放（万tCO₂）"],[["基准情景","2030 年","46.5","43.0"],["低碳情景","2027 年","43.4","30.2"],["零碳情景","已达峰（2025 年）","42.3","9.0"]])}`,
 `<h2>七、能碳告警</h2>${img("alarm","图 6  告警等级占比")}
  <p>报告期内共产生能碳告警 ${d.at} 条，其中紧急 ${d.al[0]} 条（${(d.al[0]/d.at*100).toFixed(1)}%）、重要 ${d.al[1]} 条（${(d.al[1]/d.at*100).toFixed(1)}%）、次要 ${d.al[2]} 条（${(d.al[2]/d.at*100).toFixed(1)}%），闭环处置率 91%。</p>
  ${tbl(["排名","企业","告警数（条）"],d.alc.slice(0,5).map((x,i)=>[i+1,x[0],x[1]]))}
  <h2>八、结论与建议</h2><p><b>（一）主要成效。</b>${c.ok}</p><p><b>（二）存在问题与风险。</b>${c.risk}</p><p><b>（三）重点工作建议。</b>${c.sug}</p>
  <p style="text-indent:0;font-size:12px;color:#64748B;margin-top:14px">数据说明：电力排放因子采用最新全国电网平均排放因子；化石燃料排放因子依据《工业其他行业企业温室气体排放核算方法与报告指南（试行）》缺省值；绿电消费按绿证核销量扣减。</p>`];
 if(forWord)return pages.join(br);
 return pages.map((p,i)=>`<div class="rpt-page">${p}${i?ft(i+1):""}</div>`).join("");}

/* ---------- 下载：Word（MHTML 封装，内嵌图表）/ PDF（html2canvas + jsPDF，失败回退打印） ---------- */
function fname(d,ext){const n=new Date();return `苏银产业园碳排放报告_${d.per.replace(/\s/g,"")}_${n.getFullYear()}${String(n.getMonth()+1).padStart(2,"0")}${String(n.getDate()).padStart(2,"0")}.${ext}`;}
function save(blob,name){const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},800);}
function wordDownload(d,I){
 const css=`body{font-family:SimSun,serif;font-size:10.5pt;line-height:1.7}h1{font-size:24pt;text-align:center;font-family:SimHei;margin-top:120pt}h2{font-size:14pt;font-family:SimHei;color:#0F2A4A;border-bottom:1.5pt solid #0B6EC5;margin-top:14pt}
  p{text-indent:2em;margin:3pt 0}table{border-collapse:collapse;width:100%}th,td{border:1px solid #888;padding:3pt 6pt;text-align:center;font-size:10pt}th{background:#EEF4FB}.cap{text-align:center;font-size:9pt;color:#475569}
  .rpt-cover-meta div{border-bottom:1px solid #ccc;font-size:12pt;line-height:2.2}.rpt-cover-meta span{display:inline-block;width:110pt;color:#475569}.ft{display:none}
  @page{size:21cm 29.7cm;margin:2.2cm 2.4cm}div.Section1{page:Section1}`;
 const html=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>苏银产业园碳排放报告</title>
  <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]--><style>${css}</style></head><body><div class="Section1">${docHTML(d,I,true)}</div></body></html>`;
 const B="----=_NextPart_QWRPT_"+Date.now();
 let mht=`MIME-Version: 1.0\nContent-Type: multipart/related; boundary="${B}"\n\n--${B}\nContent-Location: file:///C:/qwreport/report.htm\nContent-Type: text/html; charset="utf-8"\nContent-Transfer-Encoding: quoted-printable\n\n${html.replace(/=/g,"=3D")}\n\n`;
 Object.keys(I).forEach(k=>{if(!I[k])return;mht+=`--${B}\nContent-Location: file:///C:/qwreport/${k}.png\nContent-Type: image/png\nContent-Transfer-Encoding: base64\n\n${I[k].split(",")[1].replace(/(.{76})/g,"$1\n")}\n\n`;});
 mht+=`--${B}--`;
 save(new Blob([mht],{type:"application/msword"}),fname(d,"doc"));}
function loadJs(urls,test,cb,i){i=i||0;if(test()){cb(true);return;}if(i>=urls.length){cb(false);return;}
 const s=document.createElement("script");s.src=urls[i];s.onload=()=>cb(test());s.onerror=()=>loadJs(urls,test,cb,i+1);document.head.appendChild(s);}
function pdfLibs(cb){loadJs(["https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js","https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js","https://cdn.bootcdn.net/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"],()=>!!window.html2canvas,ok1=>{
 if(!ok1){cb(false);return;}
 loadJs(["https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js","https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js","https://cdn.bootcdn.net/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"],()=>!!(window.jspdf&&window.jspdf.jsPDF),cb);});}
async function pdfDownload(d,I){
 const host=document.createElement("div");host.style.cssText="position:fixed;left:-10000px;top:0;width:794px;background:#fff";host.innerHTML=`<div class="rpt-doc">${docHTML(d,I,false)}</div>`;document.body.appendChild(host);
 const ok=await new Promise(r=>pdfLibs(r));
 if(!ok){host.remove();const fr=document.createElement("iframe");fr.style.cssText="position:fixed;width:0;height:0;border:0";document.body.appendChild(fr);
  fr.srcdoc=`<html><head><meta charset="utf-8"><style>${document.getElementById("c10e-css").textContent}.rpt-page{box-shadow:none;margin:0;page-break-after:always}</style></head><body>${host.innerHTML}</body></html>`;
  fr.onload=()=>{try{fr.contentWindow.print();}catch(e){}};qwToast("已打开打印窗口，请选择「另存为 PDF」");return;}
 const pdf=new jspdf.jsPDF({unit:"mm",format:"a4",compress:true});
 const pages=host.querySelectorAll(".rpt-page");
 for(let i=0;i<pages.length;i++){pages[i].style.boxShadow="none";pages[i].style.margin="0";pages[i].style.height="1123px";pages[i].style.overflow="hidden";
  const cv=await html2canvas(pages[i],{scale:2,backgroundColor:"#ffffff",useCORS:true,logging:false});
  if(i)pdf.addPage();pdf.addImage(cv.toDataURL("image/jpeg",0.92),"JPEG",0,0,210,297);}
 host.remove();pdf.save(fname(d,"pdf"));}

/* ---------- 创建报告：进度 → 在线预览 → 下载 ---------- */
let LAST=null;
window.rptCreate=function(kind){
 const d=D();
 const steps=["汇集报告期能耗与碳排放核算数据","按核算范围 / 能源类型 / 行业归集排放量","生成碳排放趋势、碳达峰推演等图表","基于分析结果生成结论与建议","按标准模板排版报告"];
 showModal("创建碳排放报告",`<div class="concl" style="margin-bottom:6px"><b>报告：</b>苏银产业园碳排放报告（${d.per}）　<b>时间戳：</b>${d.ts}</div>
  <div class="rpt-steps" id="rptSteps">${steps.map(s=>`<div class="s"><i></i>${s}</div>`).join("")}</div>`);
 const el=[...document.querySelectorAll("#rptSteps .s")];let i=0;
 const tick=()=>{if(i>0)el[i-1].className="s ok";if(i<el.length){el[i].className="s run";i++;setTimeout(tick,kind==="preview"?160:420);return;}
  const I=imgs(d);LAST={d,I};
  if(kind!=="preview"){const n=new Date(),p=x=>String(x).padStart(2,"0");HIST.unshift({n:`苏银产业园碳排放报告（${d.per}）`,t:`${n.getFullYear()}-${p(n.getMonth()+1)}-${p(n.getDate())} ${p(n.getHours())}:${p(n.getMinutes())}`,u:"园区管委会 · 管理员",c:d.k});
   const h=document.getElementById("rptHist");if(h)renderReport();}
  showModal(`报告预览 —— 苏银产业园碳排放报告（${d.per}）`,`<div style="display:flex;gap:8px;margin-bottom:10px;align-items:center">
    <span class="tag ok">报告已生成</span><span style="font-size:12px;color:var(--txt3)">共 6 页 · 8 个章节 · 6 幅图表 · 时间戳 ${d.ts}</span>
    <button class="btn" style="margin-left:auto" onclick="rptDl('pdf')">下载 PDF</button><button class="btn" onclick="rptDl('word')">下载 Word</button></div>
   <div class="rpt-prev"><div class="rpt-doc">${docHTML(d,I,false)}</div></div>`);
  const mb=document.getElementById("modalBox");if(mb)mb.style.width="min(900px,96vw)";
  if(kind==="pdf"||kind==="word")setTimeout(()=>rptDl(kind),300);};
 tick();};
window.rptDl=function(kind){if(!LAST)return;qwToast(kind==="pdf"?"正在生成 PDF 文件…":"正在生成 Word 文件…",1800);
 setTimeout(()=>{if(kind==="pdf")pdfDownload(LAST.d,LAST.I);else wordDownload(LAST.d,LAST.I);},60);};
setTimeout(()=>pdfLibs(()=>{}),3000); /* 预加载 PDF 组件 */
})();
