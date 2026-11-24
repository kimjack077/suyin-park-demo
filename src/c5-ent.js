/* ---------- 企业端 ---------- */
let curCo=COMPANIES[1];
reg("entHome",()=>{const c=curCo;return `
<div class="kpis" style="grid-template-columns:repeat(6,1fr)">
 ${kpi("综合能耗",c.en.toFixed(1),"万tce","同比 -4.8%","down ok")}
 ${kpi("碳排放",c.co.toFixed(1),"万tCO₂","同比 -5.2%","down ok")}
 ${kpi("单位能耗碳排放",(c.co/c.en).toFixed(2),"tCO₂/tce","零碳工厂核心指标①")}
 ${kpi("非化石能源消费占比","34.5","%","目标 40%")}
 ${kpi("非化石电力物理认定占比","41.2","%","目标 45%")}
 ${kpi("能效等级",c.eg,"级",c.eg==="A"?"行业先进":c.eg==="B"?"行业平均":"待提升")}
</div>
<div class="grid g3">
 <div class="card"><h3>企业能源结构</h3><span class="req-badge">#67 #85</span>
  ${donut([{k:"电力",v:52},{k:"蒸汽",v:21},{k:"天然气",v:17},{k:"其他",v:10}].map(d=>({...d,u:"%"})),150,22)}</div>
 <div class="card"><h3>企业特色信息（行业画像）</h3><span class="req-badge">#67</span>
  <table>${row("所属行业",c.ind,"园区重点产业")}${row("能碳评价",c.grade+" 级","园区减排排名 TOP"+(9-Math.floor(c.red/8)))}${row("绿电交易","2,100 万kWh","占用电 35%")}${row("减排措施",c.meas.split("｜")[0],"共 "+c.meas.split("｜").length+" 项")}</table></div>
 <div class="card"><h3>零碳工厂核心指标完成情况</h3><span class="req-badge">#75</span>
  ${["单位能耗碳排放","非化石能源消费占比","非化石电力物理认定占比"].map((n,i)=>`
   <div style="margin-bottom:10px"><div style="display:flex;font-size:12px;margin-bottom:4px"><span>${n}</span><span style="margin-left:auto;color:#2DD4BF">${[86,74,92][i]}%</span></div>
   <div class="progress ${[86,74,92][i]>=80?"":"warn"}"><i style="width:${[86,74,92][i]}%"></i></div></div>`).join("")}
  <div class="hint">三项核心指标当年目标配置与完成情况展示（需求 #75）</div></div>
</div>
<div class="card"><h3>切换企业</h3><div style="display:flex;gap:8px;flex-wrap:wrap">
 ${COMPANIES.map(c2=>`<button class="btn ghost sm" style="${c2.id===c.id?"border-color:var(--cyan);color:var(--cyan)":""}" onclick="pickCo(${c2.id})">${c2.name}</button>`).join("")}
</div></div>
${pageHint("需求 #67：企业端大屏首页展示企业能碳运行整体态势、企业能源结构及企业特色信息。")}`;});
function pickCo(id){curCo=COMPANIES.find(c=>c.id===id);go("entHome");}

reg("entQuery",()=>`
<div class="tabs">
 <div class="tab on" data-t="e1">综合能源系统动态感知图</div>
 <div class="tab" data-t="e2">能源监测（表计溯源 / 层级聚合）</div>
 <div class="tab" data-t="e3">碳排监测</div>
</div>
<div class="card"><div id="tabBody"></div></div>
${pageHint("本页覆盖需求 #68–#74：电力一次总接线图 / 分能源管网拓扑图 / 多能源子系统图（图形化组态+关键测点数据）/ 表计原始数据溯源 / 建筑-厂房-产线-设备四级聚合 / 选择碳排放因子库计算 CO₂ 曲线。")}`);
RENDERERS.e1=()=>`<div class="grid g2">
 <div><div class="sub2">电力一次总接线图 <span class="req-badge" style="position:static">#68</span></div>
  <svg class="topo" viewBox="0 0 560 300">
   <rect class="node" x="20" y="20" width="110" height="46" rx="4"/><text class="node-t" x="30" y="38">110kV 进线</text><text class="node-val" x="30" y="56">110.2kV · 285A</text>
   <rect class="node" x="225" y="20" width="110" height="46" rx="4"/><text class="node-t" x="235" y="38">主变 1# 20MVA</text><text class="node-val" x="235" y="56">负载率 62%</text>
   <rect class="node" x="430" y="20" width="110" height="46" rx="4"/><text class="node-t" x="440" y="38">10kV 母线</text><text class="node-val" x="440" y="56">10.31kV · 0.4kA</text>
   <line class="edge flow" x1="130" y1="43" x2="225" y2="43"/><line class="edge flow" x1="335" y1="43" x2="430" y2="43"/>
   ${[["1#车间","128A · 2.4MW",60],["2#车间","96A · 1.8MW",230],["动力中心","210A · 4.1MW",400]].map(n=>`<rect class="node" x="${n[2]}" y="140" width="120" height="46" rx="4"/><text class="node-t" x="${n[2]+10}" y="158">${n[0]}</text><text class="node-val" x="${n[2]+10}" y="176">${n[1]}</text><line class="edge flow" x1="485" y1="66" x2="${n[2]+60}" y2="140"/>`).join("")}
   <rect class="node" x="230" y="230" width="120" height="46" rx="4"/><text class="node-t" x="240" y="248">分布式光伏</text><text class="node-val" x="240" y="266">6.8MW · 出力 3.1MW</text>
   <line class="edge flow" x1="290" y1="230" x2="290" y2="186"/>
   <text class="node-t" x="20" y="292">相角：A 0.0° / B -119.8° / C 120.3° ｜ 功率因数 0.94</text>
  </svg></div>
 <div><div class="sub2">分能源管网拓扑图 + 多能源子系统 <span class="req-badge" style="position:static">#69 #70</span></div>
  <svg class="topo" viewBox="0 0 560 300">
   <rect class="node" x="20" y="30" width="100" height="40" rx="4"/><text class="node-t" x="30" y="54">燃气锅炉房</text>
   <rect class="node" x="20" y="120" width="100" height="40" rx="4"/><text class="node-t" x="30" y="144">热蒸汽管网</text>
   <rect class="node" x="20" y="210" width="100" height="40" rx="4"/><text class="node-t" x="30" y="234">自来水/中水</text>
   ${[["1#车间 蒸汽 8.2t/h",40],["2#车间 蒸汽 5.6t/h",110],["冷库 热水 3.1t/h",180],["生活区 水量 210t/d",250]].map(n=>`<rect class="node" x="200" y="${n[1]}" width="170" height="40" rx="4"/><text class="node-t" x="210" y="${n[1]+24}">${n[0]}</text>`).join("")}
   <path class="edge flow" d="M120 50 H 200"/><path class="edge flow" d="M120 50 C 160 50 160 130 200 130"/>
   <path class="edge flow" d="M120 140 H 200"/><path class="edge flow" d="M120 230 C 160 230 160 270 200 270"/>
   ${[["光伏子系统 6.8MW",40],["储能 2MW/4MWh",110],["充电桩 24 个",180],["微电网 EMS",250]].map(n=>`<rect class="node" x="420" y="${n[1]}" width="120" height="40" rx="4"/><text class="node-t" x="430" y="${n[1]+24}">${n[0]}</text>`).join("")}
   <path class="edge" d="M370 60 H 420" style="stroke-dasharray:4 3"/><path class="edge" d="M370 60 C 395 60 395 130 420 130" style="stroke-dasharray:4 3"/>
  </svg></div>
</div>`;
RENDERERS.e2=()=>`<div class="grid g2">
 <div><div class="sub2">表计原始数据溯源 <span class="req-badge" style="position:static">#71</span></div>
  <table><tr><th>测点</th><th>瞬时值</th><th>曲线</th><th>来源</th></tr>
  <tr><td>1#车间总表 P</td><td style="font-family:Consolas">2,412 kW</td><td>▂▄▆▅▃▄▆▇</td><td><span class="tag ok">表计采集</span></td></tr>
  <tr><td>2#车间蒸汽 F</td><td style="font-family:Consolas">5.6 t/h</td><td>▄▄▅▅▄▄▅▆</td><td><span class="tag ok">表计采集</span></td></tr>
  <tr><td>空压站电耗</td><td style="font-family:Consolas">612 kW</td><td>▃▃▄▄▃▃▄▄</td><td><span class="tag ok">表计采集</span></td></tr>
  <tr><td>锅炉燃气量</td><td style="font-family:Consolas">412 m³/h</td><td>▅▅▆▅▅▆▆▇</td><td><span class="tag lv2">手工填报（10-28 修改·留痕）</span></td></tr></table>
  <div class="hint">测点类别可按表计实际可采集测点筛选；手工填报修改留痕，作为后续分析与计算的数据支撑</div></div>
 <div><div class="sub2">企业能源层级数据（建筑/厂房/产线/设备）<span class="req-badge" style="position:static">#72</span></div>
  <table><tr><th>层级</th><th>本期能耗(tce)</th><th>同比</th><th>聚合路径</th></tr>
  <tr><td>全厂</td><td>11,020</td><td class="down">-4.8%</td><td>总表</td></tr>
  <tr><td>└ 1#厂房</td><td>6,150</td><td class="down">-6.1%</td><td>厂房→产线</td></tr>
  <tr><td>&nbsp;&nbsp;└ SMT 产线</td><td>3,420</td><td class="down">-5.4%</td><td>产线→设备</td></tr>
  <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;└ 回流焊炉</td><td>1,180</td><td class="down">-7.2%</td><td>设备表计</td></tr>
  <tr><td>└ 2#厂房</td><td>4,870</td><td class="bad">+1.2%</td><td>厂房→产线</td></tr></table>
  <div class="concl"><b>分析：</b>2#厂房能耗上升主因新增老化测试设备，建议纳入 AI 节能诊断范围（▲#143）。</div></div>
</div>`;
RENDERERS.e3=()=>`<div class="grid g2">
 <div><div class="sub2">碳排因子库计算 · 表计级 CO₂ 曲线 <span class="req-badge" style="position:static">#73</span></div>
  <select><option>因子库：2025 全国电网平均排放因子 0.5366 tCO₂/MWh</option><option>因子库：宁夏区域因子（含绿电核减）</option></select>
  ${lineChart(["8:00","10:00","12:00","14:00","16:00","18:00","20:00","22:00"],[{name:"CO₂ 排放速率(kg/h)",color:"#2DD4BF",data:[1180,1240,1310,1280,1220,1160,1090,980]}],210,540)}</div>
 <div><div class="sub2">层级碳排聚合 <span class="req-badge" style="position:static">#74</span></div>
  ${hBar([{k:"全厂",v:22.6},{k:"1#厂房",v:12.1},{k:"2#厂房",v:8.3},{k:"动力中心",v:2.2}],160,540," 千tCO₂/年",(it,i)=>["#2DD4BF","#2E8BC0","#FBBF24","#A78BFA"][i])}</div>
</div>`;

reg("entAI",()=>`
<div class="grid g2">
 <div class="card"><h3>价格解读</h3><span class="req-badge">#81</span>
  <table>${row("计价类型","两部制分时电价","存在尖峰电价")}${row("合同容量","20,000 kVA","需量计费")}${row("尖峰时段","18:00–21:00","占平段电价 172%")}${row("谷段电量占比","31%","相对平段 48%")}</table>
  ${donut([{k:"谷段",v:31},{k:"平段",v:44},{k:"峰段",v:17},{k:"尖峰",v:8}].map(d=>({...d,u:"%"})),130,18)}</div>
 <div class="card"><h3>用量分析（峰谷平 + 分时刻）</h3><span class="req-badge">#82</span>
  ${stackedBar(["Q1","Q2","Q3","Q4"],[{name:"谷段",color:"#2DD4BF",data:[412,438,452,441]},{name:"平段",color:"#2E8BC0",data:[585,604,622,610]},{name:"峰段",color:"#FBBF24",data:[225,240,255,248]},{name:"尖峰",color:"#F87171",data:[98,106,121,112]}],200,520)}</div>
 <div class="card"><h3>功率分析</h3><span class="req-badge">#83</span>
  ${lineChart(["0","4","8","12","16","20","24"],[{name:"用电功率(MW)",color:"#2E8BC0",data:[6.2,5.8,12.4,14.1,13.6,15.2,9.8]}],190,520)}
  <table>${row("用电负荷率","72.4%","目标 ≥75%")}${row("峰谷差率","38.6%","环比 -2.1pct")}${row("负荷波动率","0.21","平稳")}${row("下网负荷率 / 差率 / 波动系数","74.1% / 35.2% / 0.19","口径含下网侧")}</table></div>
 <div class="card"><h3>需量分析</h3><span class="req-badge">#84</span>
  ${lineChart(["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月"],[{name:"最大需量(MW)",color:"#FBBF24",data:[16.8,16.2,17.4,18.1,17.6,18.8,19.6,19.2,18.4,17.9]},{name:"容量计费线",color:"#3E5C82",data:[17,17,17,17,17,17,17,17,17,17]}],190,520)}
  <div class="concl"><b>建议：</b>7–8 月最大需量贴近容量计费线，建议改为按需量计费并加装需量预警（需求 #87 电费账单优化）。</div></div>
 <div class="card"><h3>用能结构 / 成本 / 能效</h3><span class="req-badge">#85 #86 #88</span>
  ${donut([{k:"电力",v:52},{k:"蒸汽",v:21},{k:"天然气",v:17},{k:"其他",v:10}].map(d=>({...d,u:"%"})),140,20)}
  <table>${row("用能总成本","3,842 万元/年","电力占 68%")}${row("单位能耗碳排放","2.09 tCO₂/tce","同比 -4.6%")}${row("非化石能源消费占比","34.5%","核心指标")}</table></div>
 <div class="card"><h3>用能策略推荐（AI 多目标优化）</h3><span class="req-badge">#89 #90</span>
  <div class="tabs"><div class="tab on">经济优先</div><div class="tab">减排优先</div><div class="tab">以绿排产</div><div class="tab">辅助服务</div><div class="tab">现货交易</div></div>
  <table><tr><th>推荐策略</th><th>预期收益</th><th>减排量</th></tr>
  <tr><td>谷段储能充电 + 尖峰放电（1.5MW×2h）</td><td style="color:#2DD4BF">+86 万元/年</td><td>-320 tCO₂</td></tr>
  <tr><td>空压机群控加卸载优化</td><td style="color:#2DD4BF">+42 万元/年</td><td>-180 tCO₂</td></tr>
  <tr><td>需量计费方式调整</td><td style="color:#2DD4BF">+35 万元/年</td><td>—</td></tr></table>
  <div class="hint">多场景能源配置：拓扑与资源配置、数据导入、约束及规划情景配置、算法模型配置及仿真计算（需求 #90）</div></div>
</div>
${pageHint("本页对应需求 #81–#90「能源消费分析与用能策略推荐（AI应用）」，是投标演示中体现 AI 能力的企业端核心模块。")}`);

reg("entBench",()=>`
<div class="tabs">
 <div class="tab on" data-t="b1">能效对标</div>
 <div class="tab" data-t="b2">能流分析</div>
 <div class="tab" data-t="b3">碳流分析</div>
 <div class="tab" data-t="b4">能效平衡与优化</div>
</div>
<div class="card"><div id="tabBody"></div></div>
${pageHint("本页覆盖需求 #91–#100：对标依据（政策文件/判定规则）/ 指标定义 / 对象配置 / 数据准备清单 / 对标任务 / 多层级能流图 / 多层次碳流图 / 能源综合平衡与优化调度。")}`);
RENDERERS.b1=()=>`<div class="grid g2">
 <div><div class="sub2">对标依据 / 指标定义 <span class="req-badge" style="position:static">#91 #92 #93</span></div>
  <table><tr><th>标准文件</th><th>状态</th><th>判定规则</th></tr>
  <tr><td>GB/T 2589 综合能耗计算通则</td><td><span class="tag ok">发布使用</span></td><td>折标系数表</td></tr>
  <tr><td>重点用能设备能效限额标准</td><td><span class="tag ok">发布使用</span></td><td>能效等级 1–3 级</td></tr>
  <tr><td>某旧版标准（示例）</td><td><span class="tag lv3">过期停用</span></td><td>—</td></tr></table>
  <div class="hint">支持录入标准文件与判定规则、发布使用与过期停用管理；指标定义含名称/适用对象/数据要求/计算公式；对象配置支持产线、重点用能设备、工序、重点产品（#94）</div></div>
 <div><div class="sub2">对标任务（#95 #96）</div>
  <table><tr><th>对标对象</th><th>指标</th><th>当期值</th><th>标杆值</th><th>结果</th></tr>
  <tr><td>SMT 产线</td><td>单位产量电耗</td><td>0.182 kWh/pc</td><td>0.165</td><td><span class="tag lv2">未达标</span></td></tr>
  <tr><td>回流焊炉</td><td>单位产品综合能耗</td><td>达标</td><td>—</td><td><span class="tag lv1">1 级</span></td></tr>
  <tr><td>空压站</td><td>比功率</td><td>6.8</td><td>6.2</td><td><span class="tag lv2">2 级</span></td></tr></table>
  <div class="hint">数据准备清单绑定对标对象、指标模板、对标依据及当期数据，具备数据缺失提示；对标计算结果列表展示</div></div>
</div>`;
RENDERERS.b2=()=>entSankeyChart("en");
RENDERERS.b3=()=>entSankeyChart("co");
RENDERERS.b4=()=>`<div class="grid g2">
 <div><div class="sub2">能源综合平衡（大数据 + AI 模型）<span class="req-badge" style="position:static">#99</span></div>
  ${lineChart(["周一","周二","周三","周四","周五","周六","周日"],[{name:"供能(tce/d)",color:"#2DD4BF",data:[302,298,310,306,312,288,281]},{name:"用能(tce/d)",color:"#2E8BC0",data:[296,301,304,308,308,286,278]}],210,540)}
  <div class="concl"><b>平衡结论：</b>周三、周五供大于用（蒸汽放散），建议调整锅炉负荷曲线并启用蓄热，预计年节能 420 tce。</div></div>
 <div><div class="sub2">能源优化调度参考策略 <span class="req-badge" style="position:static">#100</span></div>
  <table><tr><th>时段</th><th>调度建议</th><th>预期效果</th></tr>
  <tr><td>谷段 00:00–07:00</td><td>储能充电、蓄热蓄冷</td><td>填谷 18%</td></tr>
  <tr><td>平段 08:00–17:00</td><td>光伏优先消纳</td><td>自发自用 92%</td></tr>
  <tr><td>峰段 17:00–21:00</td><td>储能放电 + 需量控制</td><td>削峰 1.5MW</td></tr></table>
  <div class="hint">结合能效对标、能流分析优化工艺与设备运行参数，实现能源综合平衡与优化调度，提升能源利用效率</div></div>
</div>`;
