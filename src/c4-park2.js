/* ---------- 告警 #43–49 ---------- */
let alarmType="all";
reg("alarm",()=>`
<div class="kpis" style="grid-template-columns:repeat(4,1fr)">
 ${kpi("年度告警总数","126","条","上月 14 / 当日 2")}
 ${kpi("紧急告警","9","条","待处理 2","bad")}
 ${kpi("重要告警","34","条","处理中 2")}
 ${kpi("次要告警","83","条","闭环率 91%","up ok")}
</div>
<div class="grid g3">
 <div class="card"><h3>告警等级分布</h3><span class="req-badge">#44</span>${donut([{k:"紧急",v:9},{k:"重要",v:34},{k:"次要",v:83}],150,22)}</div>
 <div class="card"><h3>产业告警占比</h3><span class="req-badge">#45</span>${donut([{k:"精细化工",v:31},{k:"新材料",v:24},{k:"装备制造",v:22},{k:"食品加工",v:19},{k:"其他",v:30}],150,22)}</div>
 <div class="card"><h3>企业告警排序</h3><span class="req-badge">#46</span>${hBar(COMPANIES.map(c=>({k:c.name,v:Math.round(c.co*2+4)})).sort((a,b)=>b.v-a.v).slice(0,5),150,500," 条",(it,i)=>"#FBBF24")}</div>
</div>
<div class="card"><h3>告警趋势（次要 / 重要 / 紧急）</h3><span class="req-badge">#47 #49</span>
 ${lineChart(["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月"],[
  {name:"次要",color:"#38BDF8",data:[9,8,10,7,8,9,11,10,6,5]},
  {name:"重要",color:"#FBBF24",data:[3,4,3,5,4,3,4,4,2,2]},
  {name:"紧急",color:"#F87171",data:[1,1,2,1,0,1,2,1,0,0]}],230,980)}
</div>
<div class="card"><h3>告警信息列表</h3><span class="req-badge">#48</span>
 <div style="display:flex;gap:8px;margin-bottom:10px;align-items:center">
  <select onchange="alarmType=this.value;renderAlarmTable()">
   <option value="all">全部类型</option><option value="单位能耗碳排放">单位能耗碳排放告警</option><option value="能耗">能耗告警</option><option value="碳排">碳排告警</option>
  </select>
  <span class="hint" style="margin:0">支持年度 / 月度统计周期切换（需求 #43）</span>
 </div>
 <div id="alarmTable"></div></div>
${pageHint("本页覆盖需求 #43–#49：统计总览（年/月周期）/ 等级占比 / 产业占比 / 企业排序 / 趋势曲线 / 单位能耗碳排放·能耗·碳排三类告警列表 / 历史告警趋势。")}`);

function renderAlarmTable(){
 const box=document.getElementById("alarmTable");if(!box)return;
 const list=ALARMS.filter(a=>alarmType==="all"||a.type===alarmType);
 const lvName={1:'<span class="tag lv1">次要</span>',2:'<span class="tag lv2">重要</span>',3:'<span class="tag lv3">紧急</span>'};
 box.innerHTML=`<table><tr><th>时间</th><th>企业</th><th>类型</th><th>等级</th><th>内容</th><th>状态</th></tr>
 ${list.map(a=>`<tr><td style="font-family:Consolas">${a.t}</td><td>${a.co}</td><td>${a.type}</td><td>${lvName[a.lv]}</td><td>${a.msg}</td><td>${a.st==="待处理"?'<span class="tag lv3">待处理</span>':a.st==="处理中"?'<span class="tag lv2">处理中</span>':'<span class="tag lv1">已闭环</span>'}</td></tr>`).join("")}</table>`;
}

/* ---------- 碳考核 #50–52 ---------- */
reg("assess",()=>`
<div class="card"><h3>碳考核评价展示 <span class="tag star">▲ #50</span></h3><span class="req-badge">#50</span>
 <table><tr><th>指标体系</th><th>核心指标</th><th>单位</th><th>2025 目标</th><th>实际值</th><th>完成度</th><th>二级指标趋势</th></tr>
 ${ASSESS.map((a,i)=>{
  const rate=Math.min(a.actual/a.target*100,a.target/a.actual*100);
  return `<tr><td style="color:${lc("#8FA8C4","#5A7089")}">${a.ind}</td><td>${a.name}</td><td>${a.unit}</td><td>${a.target}</td><td style="color:${lc("#fff","#0B4E8F")};font-family:Consolas">${a.actual}</td>
  <td style="width:150px"><div class="progress ${a.ok?"":"warn"}"><i style="width:${Math.min(rate,100).toFixed(0)}%"></i></div></td>
  <td><span style="cursor:pointer;color:var(--cyan);text-decoration:underline dotted" onclick="assessTrend(${i})">近五年趋势 ↗</span></td></tr>`;}).join("")}
 </table><div class="hint">基于国家级零碳园区建设指标体系（试行）+ 碳达峰碳中和综合评价考核指标体系；二级指标支持近五年数据趋势展示（点击查看）</div></div>
<div class="grid g2">
 <div class="card"><h3>区域绩效管理：年度目标值配置</h3><span class="req-badge">#51</span>
  <table><tr><th>指标</th><th>年度</th><th>目标值</th><th>操作</th></tr>
  ${ASSESS.slice(0,3).map(a=>`<tr><td>${a.name}</td><td>2026</td><td><input type="text" value="${(a.target*0.92).toFixed(2)}" style="width:90px"></td><td><button class="btn sm" onclick="alert('演示：目标值已保存（需求 #51）')">保存</button></td></tr>`).join("")}
  </table><div class="hint">支持按年度配置两套指标体系下的核心数据目标值</div></div>
 <div class="card"><h3>区域低碳指标：实际值填报</h3><span class="req-badge">#52</span>
  <table><tr><th>指标</th><th>年度</th><th>实际值</th><th>状态</th></tr>
  ${ASSESS.slice(0,3).map(a=>`<tr><td>${a.name}</td><td>2025</td><td>${a.actual}</td><td>${a.ok?'<span class="tag lv1">达标</span>':'<span class="tag lv2">未达标</span>'}</td></tr>`).join("")}
  </table><div class="hint">支持按年度填报核心数据实际值，未达标项自动关联能碳告警</div></div>
</div>
${pageHint("▲#50 为重要参数：须展示两套指标体系的考核清单与指标体系，二级指标支持近五年数据趋势——投标响应需提供该界面系统截图。")}`);

function assessTrend(i){
 const a=ASSESS[i];
 const lowerBetter=a.name==="单位能耗碳排放";
 const rate=Math.min(a.actual/a.target*100,a.target/a.actual*100);
 const yrs=YEARS.map(String);
 const rows=a.trend.map((v,y)=>{
  const prev=y>0?a.trend[y-1]:null;
  const yoy=prev===null?"—":(v>=prev?"+":"")+((v-prev)/prev*100).toFixed(1)+"%";
  const okY=lowerBetter?v<=a.target:v>=a.target;
  const cls=y===a.trend.length-1?' style="color:'+lc("#fff","#0B4E8F")+'"':"";
  return `<tr${cls}><td>${yrs[y]}${y===a.trend.length-1?' <span class="tag lv2">本年</span>':""}</td>
   <td style="font-family:Consolas">${v}</td><td>${yoy}</td>
   <td>${okY?'<span class="tag lv1">达标 ✔</span>':'<span class="tag lv2">未达标</span>'}</td></tr>`;}).join("");
 const cum=a.trend.length>1?((a.trend[a.trend.length-1]-a.trend[0])/a.trend[0]*100):0;
 const dir=cum<=0?"累计下降":"累计上升";
 const concl=lowerBetter
  ?`${a.name}五年${dir} ${Math.abs(cum).toFixed(1)}%，强度改善快于总量，${a.ok?"已达成年度考核目标，建议保持绿电替代与节能改造节奏。":"尚未达成年度目标（目标 "+a.target+" "+a.unit+"），建议将绿电直供扩容与企业电炉改造纳入零碳路径重点措施清单（联动 ▲#50 目标值管理）。"}`
  :`${a.name}五年${dir} ${Math.abs(cum).toFixed(1)}个百分点量级，${a.ok?"已达成年度考核目标且趋势持续向好，可作为园区绿色低碳成效的展示亮点。":"尚未达成年度目标（目标 "+a.target+" "+a.unit+"），建议按季度跟踪进度并自动关联能碳告警（#52 未达标项联动告警）。"}`;
 showModal(a.name+" · 历年情况与趋势（核心指标区 · ▲#50）",`
  <div class="kpis" style="grid-template-columns:repeat(4,1fr)">
   ${kpi("2025 实际值",a.actual,a.unit,"指标体系："+a.ind,"")}
   ${kpi("2025 目标值",a.target,a.unit,lowerBetter?"越低越好":"越高越好","")}
   ${kpi("完成度",rate.toFixed(1),"%",a.target+" → "+a.actual,"")}
   ${kpi("达标状态",a.ok?"达标":"未达标","",a.ok?"达成年度考核目标":"未达成年度考核目标",a.ok?"up ok":"down")}
  </div>
  <div class="sub2">历年情况（2021–2025 · 本年行加亮）</div>
  <table><tr><th>年份</th><th>指标值（${a.unit}）</th><th>同比变化</th><th>当年达标情况</th></tr>${rows}</table>
  <div class="sub2">五年趋势（含目标线对照）</div>
  ${lineChart(yrs,[{name:a.name,color:"#38BDF8",data:a.trend},{name:"目标线 "+a.target,color:"#F87171",data:a.trend.map(()=>a.target)}],220,600)}
  <div class="concl"><b>趋势结论：</b>${concl}</div>`);
}

/* ---------- 零碳路径 #53–58 ---------- */
reg("path",()=>`
<div class="grid g2" style="grid-template-columns:2fr 1fr">
 <div class="card"><h3>零碳预测：三情景碳排放路径</h3><span class="req-badge">#53</span>
  ${lineChart(PATHS.years,[{name:"基准情景",color:"#3E5C82",data:PATHS.base},{name:"低碳情景",color:"#2E8BC0",data:PATHS.low},{name:"零碳情景",color:"#2DD4BF",data:PATHS.zero}],260,640)}
  <div class="legend">
   <span><i style="background:#3E5C82"></i>基准情景 · 达峰 <b style="color:${lc("#fff","#0B4E8F")}">2030</b> 年</span>
   <span><i style="background:#2E8BC0"></i>低碳情景 · 达峰 <b style="color:${lc("#fff","#0B4E8F")}">2027</b> 年</span>
   <span><i style="background:#2DD4BF"></i>零碳情景 · 当前已运行于达峰后通道</span>
  </div>
  <div class="concl"><b>碳达峰标识：</b>基准情景峰值 46.5 万 tCO₂（2030 年）；低碳情景提前 3 年达峰；零碳情景 2035 年碳排放降至 9.0 万 tCO₂，需绿电占比 ≥60% 配合 CCER 抵消。</div></div>
 <div class="card"><h3>零碳效益分析（单年度）</h3><span class="req-badge">#54</span>
  <table><tr><th>碳达峰措施</th><th>减排量(万t)</th><th>年净收益(万元)</th></tr>
  <tr><td>绿电直供扩容</td><td>4.2</td><td>1,180</td></tr>
  <tr><td>企业节能改造（AI诊断）</td><td>1.6</td><td>640</td></tr>
  <tr><td>综合能源站梯级利用</td><td>0.9</td><td>310</td></tr>
  <tr><td>储能晚峰放电</td><td>0.4</td><td>210</td></tr>
  <tr><td style="color:${lc("#fff","#0B4E8F")}">合计</td><td style="color:#2DD4BF">7.1</td><td style="color:#2DD4BF">2,340</td></tr></table></div>
</div>
<div class="card"><h3>管理配置（模型 / 情景 / 参数 / 变量）</h3><span class="req-badge">#55 #56 #57 #58</span>
 <div class="tabs">
  <div class="tab on" data-t="p1">模型管理</div><div class="tab" data-t="p2">情景模拟</div><div class="tab" data-t="p3">参数管理</div><div class="tab" data-t="p4">变量管理</div>
 </div>
 <div class="tabpane on" id="tp-p1">
  <table><tr><th>模型名称</th><th>类型</th><th>更新时间</th><th>操作</th></tr>
  <tr><td>园区宏观碳达峰模型（LEAP）</td><td>基准模型</td><td>2025-10-12</td><td><button class="btn ghost sm" onclick="alert('演示：新增碳达峰模型（需求 #55）')">新增</button> <button class="btn ghost sm">修改</button> <button class="btn ghost sm" style="color:var(--red)">删除</button></td></tr>
  <tr><td>重点行业减排技术模型</td><td>低碳模型</td><td>2025-09-28</td><td><button class="btn ghost sm">修改</button> <button class="btn ghost sm" style="color:var(--red)">删除</button></td></tr></table></div>
 <div class="tabpane" id="tp-p2"><div class="hint">支持模型下的情景配置与管理：基准 / 低碳 / 零碳情景的启用、复制、对比推演（勾选后重新计算上图路径）（需求 #56）</div></div>
 <div class="tabpane" id="tp-p3"><div class="hint">模型参数配置与管理：GDP 增速、能耗强度下降率、绿电替代率、减排技术渗透率等（需求 #57）</div></div>
 <div class="tabpane" id="tp-p4"><div class="hint">模型变量配置与管理：自变量 / 因变量映射、单位、数据来源绑定（需求 #58）</div></div>
</div>
${pageHint("本页覆盖需求 #53–#58：三情景零碳预测与碳达峰标识 / 单年度措施减排量与年净收益 / 模型·情景·参数·变量管理配置。")}`);

/* ---------- 碳排报告 #59–66 ---------- */
let rptKey="y";
reg("report",()=>`
<div class="card">
 <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap">
  <h3 style="margin:0">碳排放报告 <span class="tag star">▲ #65 #66</span></h3><span class="req-badge">#59–#66</span>
  <div style="margin-left:auto;display:flex;gap:8px">
   <select id="rptCycle" onchange="rptSwitch(this.value)"><option value="y">年度</option><option value="q">季度</option><option value="m">月度</option></select>
   <button class="btn" onclick="alert('演示：生成并下载 PDF 报告（对应演示评分项「可创建并下载 PDF 或 Word 报告」）')">生成 PDF</button>
   <button class="btn ghost" onclick="alert('演示：生成并下载 Word 报告')">生成 Word</button>
  </div>
 </div>
 <div class="kpis" style="grid-template-columns:repeat(7,1fr)" id="rptKpi"></div>
 <div class="grid g2">
  <div><div class="sub2">碳排放趋势分析（#60）</div><div id="rptTrend"></div></div>
  <div><div class="sub2">核算范围分析（#61）</div>${donut([{k:"范围一：燃料燃烧",v:11.2},{k:"范围一：工艺排放",v:5.7},{k:"范围二：外购电力",v:18.6},{k:"范围二：外购热力",v:6.8}],160,24)}</div>
  <div><div class="sub2">行业碳排放构成（#63）</div>${hBar([{k:"新材料",v:10.6},{k:"装备制造",v:8.2},{k:"精细化工",v:8.1},{k:"数据服务",v:7.0},{k:"食品加工",v:5.4},{k:"其他",v:3.0}],170,560," 万tCO₂",(it,i)=>PALETTE[i%8])}</div>
  <div><div class="sub2">碳达峰推演（#64）</div>
   <table><tr><th>情景</th><th>达峰时间</th><th>达峰值(万tCO₂)</th></tr>
   <tr><td>低碳情景</td><td>2027 年</td><td>42.3</td></tr>
   <tr><td>基准情景</td><td>2030 年</td><td>46.5</td></tr>
   <tr><td>零碳情景</td><td>2025（已过峰）</td><td>42.3</td></tr></table>
   <div class="sub2" style="margin-top:10px">能碳告警（▲#65）</div>
   <div style="display:flex;gap:10px;align-items:center"><span class="tag lv3">紧急 9</span><span class="tag lv2">重要 34</span><span class="tag lv1">次要 83</span><span class="hint" style="margin:0">按年度/季度/月度展示告警占比</span></div>
  </div>
 </div>
 <div class="card" style="background:rgba(0,91,172,.08);margin-top:14px"><h3>结论与建议（▲#66 · 自动生成）</h3>
  <p style="line-height:2;font-size:13px"><b style="color:#4ADE80">主要成效：</b>碳排放总量同比下降 6.2%，能耗强度累计下降 21.8%，绿电消纳率 96.1% 达标，6 项考核指标中 4 项达标。</p>
  <p style="line-height:2;font-size:13px"><b style="color:#FBBF24">存在问题与风险：</b>①单位能耗碳排放 2.53 tCO₂/tce 未达 2.40 目标；②精细化工油品碳排同比上升 1.2%；③黄河生物医药碳配额存在盈缺风险，触发超排放预警。</p>
  <p style="line-height:2;font-size:13px"><b style="color:#38BDF8">重点工作建议：</b>①将兴庆精细化工精馏改造列入 2026 重点工程；②扩大绿电直供覆盖企业至 12 家；③对 2 家配额缺口企业提前启动 CCER 购置预案；④食品加工产业纳入告警阈值动态管理。</p>
 </div>
</div>
${pageHint("本页覆盖需求 #59–#66。▲#65 能碳告警、▲#66 结论与建议为重要参数；报告须支持年/季/月切换并创建下载 PDF/Word（对应演示评分项），「结论与建议」须基于分析自动生成。")}`);

function rptSwitch(k){rptKey=k;renderReport();}
function renderReport(){
 const r=REPORTS[rptKey];const box=document.getElementById("rptKpi");if(!box)return;
 const names=["碳排放量(万t)","单位GDP碳排(t/万元)","单位GDP能耗(tce/万元)","清洁能源消费(%)","消纳率(%)","控排企业数","履约率(%)"];
 box.innerHTML=r.core.map((v,i)=>kpi(names[i],v,"","同比改善",i<3?"down ok":"up ok")).join("");
 const tr=document.getElementById("rptTrend");
 if(tr)tr.innerHTML=comboBarLine(r.labels,"碳排量(万t)",r.carbon,"环比(%)",r.carbon.map((v,i)=>i?+(((v-r.carbon[i-1])/r.carbon[i-1])*100).toFixed(1):0),210,560,"万t","%");
}
