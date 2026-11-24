/* ================= 页面注册 ================= */
const PAGES={};
function reg(id,fn){PAGES[id]={render:fn};}

/* ---------- 驾驶舱 #1–15 ---------- */
reg("dashboard",()=>`
<div class="kpis" style="grid-template-columns:repeat(6,1fr)">
 ${kpi("综合能耗","18.6","万tce","同比下降 4.6%","down ok")}
 ${kpi("碳排放总量","42.3","万tCO₂","同比下降 6.2%","down ok")}
 ${kpi("单位能耗碳排放","2.53","tCO₂/tce","同比下降 8.0%","down ok")}
 ${kpi("清洁能源消费占比","28.4","%","同比 +1.9pct","up ok")}
 ${kpi("绿电消纳率","96.1","%","目标 95%","up ok")}
 ${kpi("重点工程碳绩效","86","分","环比 +2","up ok")}
</div>
<div class="grid g3">
 <div class="card"><h3>能碳结构·用能（上年度）</h3><span class="req-badge">#2</span>
  <div class="chart">${donut(Object.entries(PARK.energyMix).map(([k,v])=>({k,v,u:"%"})),140,20)}</div></div>
 <div class="card"><h3>能碳结构·碳排（上年度）</h3><span class="req-badge">#3</span>
  <div class="chart">${donut(Object.entries(PARK.carbonMix).map(([k,v])=>({k,v,u:"%"})),140,20)}</div></div>
 <div class="card"><h3>电力结构（年度）</h3><span class="req-badge">#4</span>
  <div class="chart">${donut(Object.entries(PARK.powerMix).map(([k,v])=>({k,v,u:"%"})),140,20)}</div></div>
</div>
<div class="grid g2">
 <div class="card"><h3>能耗趋势（近五年）</h3><span class="req-badge">#7</span>
  <div class="chart">${comboBarLine(YEARS,"总能耗(万tce)",PARK.energy,"能耗强度",PARK.energyInt,225,560,"万tce")}</div>
  <div class="concl"><b>趋势结论：</b>总能耗连续 4 年下降，能耗强度累计下降 21.8%，主要受装备制造电炉改造与数据中心液冷改造驱动。</div></div>
 <div class="card"><h3>碳排趋势（近五年）</h3><span class="req-badge">#9</span>
  <div class="chart">${comboBarLine(YEARS,"碳排放(万tCO₂)",PARK.carbon,"碳排强度",PARK.carbonInt,225,560,"万t")}</div>
  <div class="concl"><b>趋势结论：</b>碳排放强度降幅（24.2%）大于总量降幅（17.4%），园区进入强度与总量双降阶段。</div></div>
</div>
<div class="grid g2">
 <div class="card"><h3>月度电量堆叠（本年度）</h3><span class="req-badge">#5</span>
  <div class="chart">${stackedBar(["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],Object.entries(PARK.monthPower).map(([k,v],i)=>({name:k,color:PALETTE[i%8],data:v})),230,660)}</div></div>
 <div class="card"><h3>重点工程清单 <span class="tag lv3">▲需源代码</span></h3><span class="req-badge">#11 #12</span>
  <table><tr><th>工程名称</th><th>建设主体</th><th>投资(万元)</th><th>进度</th><th>碳评价</th></tr>
  <tr onclick="projModal(1)" style="cursor:pointer"><td>园区绿电直供工程</td><td>绿洲光伏电力</td><td>12,400</td><td>82%</td><td><span class="tag lv1">A</span></td></tr>
  <tr onclick="projModal(2)" style="cursor:pointer"><td>集中式光伏+储能二期</td><td>绿洲光伏电力</td><td>45,000</td><td>45%</td><td><span class="tag lv1">A</span></td></tr>
  <tr onclick="projModal(3)" style="cursor:pointer"><td>园区综合能源站</td><td>管委会经发部</td><td>8,600</td><td>60%</td><td><span class="tag lv2">B</span></td></tr>
  <tr onclick="projModal(4)" style="cursor:pointer"><td>企业能碳采集全覆盖（本项目）</td><td>中标方+8家企业</td><td>600</td><td>30%</td><td><span class="tag lv1">A</span></td></tr>
  </table><div class="hint">点击表格行可查看工程详情弹窗</div></div>
</div>
${pageHint("本页覆盖需求 #1–#15：区域概况及低碳指标由顶部「核心指标区 · 考核指标达标进度」承载（点击指标卡片弹窗查看历年情况与趋势，覆盖 #1 ▲#50）/ 能碳结构（用能、碳排）/ 电力结构（年、月）/ 能耗碳排趋势（年、月）/ 重点工程清单与弹窗。标注「需源代码」的模块须在投标中承诺源代码交付（共覆盖 #1–15 及 AI 应用等多项）。")}`);

const PROJS=[
 {n:"园区绿电直供工程",inv:"12,400",share:"18%",unit:"绿洲光伏电力",cycle:"2024.06–2026.12",score:"86（A 级）",perf:"年供绿电 1.2 亿 kWh，园区减碳 6.9 万 tCO₂/年"},
 {n:"集中式光伏+储能二期",inv:"45,000",share:"34%",unit:"绿洲光伏电力",cycle:"2025.03–2027.06",score:"90（A 级）",perf:"120MW 光伏 + 60MWh 储能，晚峰放电覆盖率 62%"},
 {n:"园区综合能源站",inv:"8,600",share:"9%",unit:"管委会经发部",cycle:"2025.01–2026.03",score:"72（B 级）",perf:"蒸汽梯级利用，综合能源效率提升 11%"},
 {n:"企业能碳采集全覆盖（本项目）",inv:"600",share:"—",unit:"中标方+8家企业",cycle:"合同签订–90 天交付",score:"88（A 级）",perf:"334 台套终端接入，数据采集准确率 ≥95%"},
];
function projModal(i){const p=PROJS[i-1];showModal("重点工程详情（需求 #11 弹窗）",`
 <table>${row("工程名称",p.n,p.unit)}${row("投资规模",p.inv+" 万元","投资占比 "+p.share)}${row("负责单位",p.unit,"建设周期 "+p.cycle)}${row("项目碳评价",p.score,"")}</table>
 <div class="concl"><b>碳绩效：</b>${p.perf}</div>`);}

/* ---------- 地图 ---------- */
function renderMap(mode){
 return `<div class="map-wrap"><svg class="map-svg" viewBox="0 0 1000 560">
  <polygon points="120,80 900,60 950,300 820,520 300,540 90,420" fill="#0E2138" stroke="#2E8BC0" stroke-width="2"/>
  <path d="M120 260 H 930" stroke="#1E3A5C" stroke-width="8"/>
  <path d="M480 62 V 535" stroke="#1E3A5C" stroke-width="8"/>
  <text x="500" y="270" fill="#3E5C82" font-size="12">京河大道</text>
  <text x="140" y="250" fill="#3E5C82" font-size="12">如意街</text>
  <rect x="620" y="330" width="90" height="40" fill="#12294A" stroke="#2E4C77"/><text x="630" y="355" fill="#5D7A9C" font-size="11">智慧产业研发大厦</text>
  <rect x="150" y="90" width="110" height="34" fill="#12294A" stroke="#2E4C77"/><text x="160" y="112" fill="#5D7A9C" font-size="11">集中式光伏区</text>
  <g id="mapDots"></g>
 </svg></div><div id="mapLegend" class="legend" style="margin-top:8px"></div>`;
}
function dotColor(v,mx){const t=v/mx;if(t<0.34)return "#4ADE80";if(t<0.67)return "#FBBF24";return "#F87171";}
function renderMapDots(mode,query){
 const g=document.getElementById("mapDots");if(!g)return;
 const key=mode==="onemap"?OM.factor:"en";
 const val=c=>{const idx=YEARS.indexOf(OM.year);
  if(key==="co")return c.co5[idx];if(key==="cl")return c.asset/300;if(key==="gl")return c.asset/500;return c.en5[idx];};
 let list=COMPANIES;if(query)list=list.filter(c=>c.name.includes(query));
 const mx=Math.max(...list.map(val));
 const unit={en:" 万tce",co:" 万tCO₂",cl:" 电力",gl:" 分"}[key]||"";
 g.innerHTML=list.map(c=>`<g class="map-point" onclick="coModal(${c.id})" transform="translate(${c.x},${c.y})">
   <circle class="dot" r="7" fill="${dotColor(val(c),mx)}" stroke="#fff" stroke-width="1.5"><title>${c.name}：${(Math.round(val(c)*10)/10)}${unit}</title></circle>
   <text class="dot-label" x="11" y="4">${c.name}（${c.eg} 级能效）</text></g>`).join("");
 const lg=document.getElementById("mapLegend");
 if(lg)lg.innerHTML=`<span><i style="background:#4ADE80"></i>低</span><span><i style="background:#FBBF24"></i>中</span><span><i style="background:#F87171"></i>高</span><span>当前要素值单位：${unit||"—"}</span>`;
}
function coModal(id){
 const c=COMPANIES.find(x=>x.id===id);
 showModal("企业画像下钻（需求 #22：近五年数据 · 能碳分析 · 减排措施）",`
  <div class="kpis" style="grid-template-columns:repeat(4,1fr)">
   ${kpi(c.name,c.ind,"","碳评价 "+c.grade+" 级")}
   ${kpi("2025 能耗",c.en.toFixed(1),"万tce","累计 -"+c.red+"%")}
   ${kpi("2025 碳排",c.co.toFixed(1),"万tCO₂","累计 -"+c.red+"%")}
   ${kpi("能效等级",c.eg,"级",c.eg==="A"?"行业先进":c.eg==="B"?"行业平均":"待提升")}
  </div>
  <div class="sub2">近五年能耗 / 碳排趋势</div>
  ${lineChart(YEARS.map(String),[{name:"能耗(万tce)",color:"#2E8BC0",data:c.en5.map(v=>+v.toFixed(2))},{name:"碳排(万tCO₂)",color:"#2DD4BF",data:c.co5.map(v=>+v.toFixed(2))}],220,700)}
  <div class="concl"><b>能碳分析：</b>${c.name}近五年能耗与碳排累计下降 ${c.red}%，强度下降快于总量，${c.eg==="A"?"已达行业先进水平，建议输出为园区标杆案例。":c.eg==="B"?"处于行业平均水平，建议开展 AI 节能诊断（▲#143）挖掘改造空间。":"能效偏低，建议列入重点帮扶清单并纳入告警阈值动态管理。"}</div>
  <div class="concl"><b>减排措施：</b>${c.meas}</div>`);
}

/* ---------- 一张图 #16–24 ---------- */
const OM={year:2025,factor:"en",playing:null};
reg("oneMap",()=>`
<div class="grid g4">
 <div class="card"><h3>能源消费要素</h3><span class="req-badge">#16</span>
  <table>${row("电力","7.3 亿kWh","占比 48%")}${row("燃气","620 万m³","占比 22%")}${row("热力","28 万GJ","占比 18%")}${row("氢气","120 t","示范期")}</table></div>
 <div class="card"><h3>能碳指标要素 <span class="tag star">▲ #17</span></h3><span class="req-badge">#17</span>
  <table id="omKpi"></table></div>
 <div class="card"><h3>清洁能源要素</h3><span class="req-badge">#18</span>
  <table>${row("分布式光伏","86 个 / 42MW","在运")}${row("储能","3 站 / 60MWh","在运")}${row("充电桩","126 个","快充 48")}${row("绿电交易","2.1 亿kWh","本年")}</table></div>
 <div class="card"><h3>绿色低碳成就</h3><span class="req-badge">#19</span>
  <table>${row("国家级绿色园区","1 个","2024 年获批")}${row("省级绿色工厂","3 家","银北/云谷/绿洲")}${row("零碳工厂试点","2 家","电通/云谷")}${row("国家级绿色工厂","1 家","申报中")}</table></div>
</div>
<div class="card"><h3>瓦片地图（要素联动）</h3><span class="req-badge">#20 #21 #22 #23</span>
 <div style="display:flex;gap:10px;margin-bottom:10px;flex-wrap:wrap;align-items:center">
  <select id="omFactor">
   <option value="en">能源消费</option><option value="co">碳排放</option><option value="cl">清洁能源</option><option value="gl">绿色低碳成就</option>
  </select>
  <input type="text" id="omSearch" placeholder="按企业名称筛选（需求 #20）" style="width:220px">
  <button class="btn ghost sm" onclick="omRefresh()">查询</button>
  <span style="margin-left:auto;font-size:12px;color:var(--txt2)">当前要素：<b id="omFactorName" style="color:var(--cyan)">能源消费</b></span>
 </div>
 ${renderMap("onemap")}
 <div class="yearbar">
  <button class="btn sm" id="omPlay" onclick="omTogglePlay()">▶ 播放</button>
  <input type="range" min="2021" max="2025" step="1" value="2025" id="omYear" oninput="omSetYear(this.value)">
  <span class="y" id="omYearLabel">2025</span>
  <span style="font-size:11px;color:var(--txt3)">年份进度条：自动播放 / 手动选择，联动地图与指标（需求 #23）</span>
 </div></div>
<div class="card"><h3>企业数据排序（当前要素）</h3><span class="req-badge">#24</span><div id="omRank"></div></div>
${pageHint("本页覆盖需求 #16–#24：四类全数据要素 / 条件查询 / 要素数据展示 / 企业点位点击下钻 / 年份进度条自动播放联动 / 企业数据排序。▲#17（能碳指标要素）为重要参数，投标响应必须提供系统截图佐证。")}`);

function omSetYear(y){OM.year=+y;const el=document.getElementById("omYearLabel");if(el)el.textContent=y;omRefresh();}
function omTogglePlay(){
 if(OM.playing){clearInterval(OM.playing);OM.playing=null;const b=document.getElementById("omPlay");if(b)b.textContent="▶ 播放";return;}
 const b=document.getElementById("omPlay");if(b)b.textContent="⏸ 暂停";
 let y=OM.year>=2025?2021:OM.year;
 OM.playing=setInterval(()=>{omSetYear(y);y++;if(y>2025){clearInterval(OM.playing);OM.playing=null;const bb=document.getElementById("omPlay");if(bb)bb.textContent="▶ 播放";}},1100);
}
function omRefresh(){
 const sel=document.getElementById("omFactor");if(sel)OM.factor=sel.value;
 const nm={en:"能源消费",co:"碳排放",cl:"清洁能源",gl:"绿色低碳成就"}[OM.factor];
 const el=document.getElementById("omFactorName");if(el)el.textContent=nm;
 renderMapDots("onemap",(document.getElementById("omSearch")||{}).value||"");
 const idx=YEARS.indexOf(OM.year);
 const kpiT=document.getElementById("omKpi");
 if(kpiT)kpiT.innerHTML=
  row("综合能耗量",(PARK.energy[idx]||18.6).toFixed(1),"万tce")+
  row("碳排放总量",(PARK.carbon[idx]||42.3).toFixed(1),"万tCO₂")+
  row("单位能耗碳排放",(PARK.carbonInt[idx]||2.53).toFixed(2),"tCO₂/tce")+
  row("消纳率","96.1","%");
 const key=OM.factor==="co"?"co5":OM.factor==="en"?"en5":null;
 let items=COMPANIES.map(c=>({k:c.name,v:key?+c[key][idx].toFixed(1):(OM.factor==="cl"?Math.round(c.asset/300):Math.round(c.asset/500))}));
 const q=(document.getElementById("omSearch")||{}).value;
 if(q)items=items.filter(i=>i.k.includes(q.trim()));
 items.sort((a,b)=>b.v-a.v);
 const box=document.getElementById("omRank");
 if(box)box.innerHTML=hBar(items.slice(0,8),240,660,OM.factor==="co"?" 万tCO₂":OM.factor==="en"?" 万tce":OM.factor==="cl"?" 万kWh":" 分",(it,i)=>PALETTE[i%8]);
}

/* ---------- 多维分析 #25–42 ---------- */
reg("multi",()=>`
<div class="tabs" id="multiTabs">
 <div class="tab on" data-t="m1">能碳趋势分析</div>
 <div class="tab" data-t="m2">能碳结构分析</div>
 <div class="tab" data-t="m3">核算范围分析</div>
 <div class="tab" data-t="m4">企业数据排序分析</div>
 <div class="tab" data-t="m5">能碳对标分析</div>
</div>
<div class="card"><div id="tabBody"></div></div>`);
const RENDERERS={};
RENDERERS.m1=()=>`<div class="grid g2">
 <div><div class="sub2">区域能耗、碳排趋势 <span class="tag star">▲ #25</span> <span class="req-badge" style="position:static">#25 #27</span></div>
  ${lineChart(YEARS.map(String),[{name:"能耗(万tce)",color:"#2E8BC0",data:PARK.energy},{name:"碳排(万tCO₂)",color:"#2DD4BF",data:PARK.carbon},{name:"碳排强度×10",color:"#FBBF24",data:PARK.carbonInt.map(v=>+ (v*10).toFixed(1))}],235,560)}
  <select style="margin-top:8px" onchange="multiSel(this)"><option>区域维度</option><option>产业维度</option><option>企业维度</option></select>
  <div class="concl" id="m1c"><b>趋势结论：</b>区域能耗与碳排呈「双降」，能源结构中电力占比稳定在 48%，燃气替代油品贡献主要减排；碳排降幅大于能耗降幅，源于绿电占比提升 3.5pct。</div></div>
 <div><div class="sub2">产业维度趋势 <span class="tag star">▲ #26</span></div>
  ${stackedBar(YEARS.map(String),[{name:"新材料",color:"#2E8BC0",data:[8.2,7.9,7.5,7.0,6.6]},{name:"装备制造",color:"#2DD4BF",data:[4.8,4.7,4.5,4.3,4.1]},{name:"食品加工",color:"#FBBF24",data:[3.1,3.0,2.9,2.7,2.6]},{name:"数据服务",color:"#A78BFA",data:[4.1,4.0,3.9,3.8,3.6]},{name:"其他",color:"#3E5C82",data:[1.6,1.6,1.6,1.7,1.7]}],235,560)}
  <div class="concl"><b>原因分析：</b>新材料产业降幅最大（-19.5%），系余热回收投产；数据服务 2025 年降幅扩大至 5.3%，液冷改造贡献显著。</div></div>
</div>`;
RENDERERS.m2=()=>`<div class="grid g2">
 <div><div class="sub2">能源结构：能耗量 / 碳排量及同比 <span class="req-badge" style="position:static">#28–#34</span></div>
  <table><tr><th>能源类型</th><th>能耗(万tce)</th><th>同比</th><th>碳排(万tCO₂)</th><th>同比</th></tr>
  <tr><td>电力</td><td>8.9</td><td class="down">-3.2%</td><td>22.0</td><td class="down">-5.1%</td></tr>
  <tr><td>燃气</td><td>4.1</td><td class="down">-1.8%</td><td>8.0</td><td class="down">-2.0%</td></tr>
  <tr><td>热力</td><td>3.3</td><td class="down">-6.9%</td><td>6.8</td><td class="down">-6.9%</td></tr>
  <tr><td>油品</td><td>1.5</td><td class="down">-8.1%</td><td>3.8</td><td class="bad">+1.2%</td></tr>
  <tr><td>煤品</td><td>0.8</td><td class="down">-12.0%</td><td>1.7</td><td class="down">-12.0%</td></tr></table>
  <div class="concl"><b>分析：</b>油品碳排逆势上升，集中于精细化工运输环节，建议纳入下年度告警阈值管理。</div></div>
 <div><div class="sub2">电能结构细分（#34）</div>
  ${donut([{k:"外购火电",v:46},{k:"外购绿电",v:22},{k:"分布式光伏",v:18},{k:"集中式新能源",v:14}].map(d=>({...d,u:"%"})),170,24)}
 </div>`;
RENDERERS.m3=()=>`<div class="grid g2">
 <div><div class="sub2">范围一 / 范围二趋势 <span class="req-badge" style="position:static">#35–#37</span></div>
  ${lineChart(YEARS.map(String),[{name:"范围一 直接排放",color:"#F87171",data:[22.0,21.5,20.4,18.8,16.9]},{name:"范围二 间接排放",color:"#2E8BC0",data:[29.2,28.1,27.1,26.3,25.4]}],240,560)}
  <div class="concl"><b>趋势结论：</b>范围一降幅（23.2%）显著大于范围二（13.0%），直接排放治理成效突出；范围二下降依赖绿电结构，弹性更大。</div></div>
 <div><div class="sub2">范围构成占比</div>
  ${donut([{k:"范围一：燃料燃烧+工艺排放",v:16.9,u:" 万t"},{k:"范围二：外购电力+热力",v:25.4,u:" 万t"}],170,26)}
 </div>`;
RENDERERS.m4=()=>`<div class="grid g2">
 <div><div class="sub2">企业碳排放排序<span class="req-badge" style="position:static">#38</span></div>
  <div class="chart">${hBar(COMPANIES.map(c=>({k:c.name,v:c.co})).sort((a,b)=>b.v-a.v),240,560," 万tCO₂",(it,i)=>PALETTE[i%8])}</div></div>
 <div><div class="sub2">碳资产 / 减碳量排序 <span class="req-badge" style="position:static">#39 #40</span></div>
  <div class="chart">${hBar(COMPANIES.map(c=>({k:c.name,v:c.asset})).sort((a,b)=>b.v-a.v),150,560," 万元",(it,i)=>"#2DD4BF")}</div>
  <div class="concl"><b>结论分析：</b>减碳量按同产品类别对标排序，新材料与数据服务企业减碳强度领先；黄河生物医药减碳率仅 10%，建议列入重点帮扶清单。</div></div>
</div>`;
RENDERERS.m5=()=>`<div class="grid g2">
 <div><div class="sub2">单位能耗碳排放对标（区域/产业/企业三层级）<span class="req-badge" style="position:static">#41</span></div>
  ${lineChart(YEARS.map(String),[{name:"园区",color:"#38BDF8",data:[2.98,2.83,2.71,2.60,2.53]},{name:"新材料产业",color:"#2DD4BF",data:[2.33,2.31,2.31,2.32,2.31]},{name:"标杆企业(云谷)",color:"#4ADE80",data:[1.89,1.86,1.85,1.81,1.79]},{name:"国标先进值",color:"#FBBF24",data:[1.8,1.8,1.8,1.8,1.8]}],240,560)}
  <div class="concl"><b>对标结论：</b>园区距国标先进值仍有 29% 差距；新材料产业接近先进水平，化工与食品产业为主要差距来源。</div></div>
 <div><div class="sub2">区域指标对标（国/省/市/区域四级）<span class="req-badge" style="position:static">#42</span></div>
  <table><tr><th>指标</th><th>园区</th><th>银川市</th><th>自治区</th><th>全国</th><th>评价</th></tr>
  <tr><td>能耗强度(tce/万元)</td><td>1.11</td><td>1.24</td><td>1.38</td><td>1.05</td><td><span class="tag lv2">中上</span></td></tr>
  <tr><td>碳排放强度(tCO₂/万元)</td><td>2.53</td><td>2.81</td><td>3.12</td><td>2.20</td><td><span class="tag lv2">中上</span></td></tr>
  <tr><td>单位能耗碳排放(tCO₂/tce)</td><td>2.53</td><td>2.65</td><td>2.72</td><td>2.40</td><td><span class="tag lv2">中上</span></td></tr></table>
 </div>`;
function multiSel(sel){
 const box=document.getElementById("m1c");if(!box)return;
 if(sel.selectedIndex===1)box.innerHTML="<b>趋势结论（产业维度）：</b>新材料、数据服务产业能耗碳排双降且降幅扩大；食品加工产业受产能恢复影响 2025 年降幅收窄至 4.2%。";
 else if(sel.selectedIndex===2)box.innerHTML="<b>趋势结论（企业维度）：</b>选中企业（银北新材料）近五年能耗 -17.9%、碳排 -18.7%，变化率曲线显示 2024 年起进入加速下降通道。";
 else box.innerHTML="<b>趋势结论：</b>所选年份区域能耗与碳排呈「双降」，能源结构中电力占比稳定在 48%。";
}
