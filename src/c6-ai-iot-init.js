/* ---------- 碳排放核算与核查 #101–125 ---------- */
reg("entCarbon",()=>`
<div class="tabs">
 <div class="tab on" data-t="c1">碳排放核算</div>
 <div class="tab" data-t="c2">产品碳足迹</div>
 <div class="tab" data-t="c3">供应链碳数据</div>
 <div class="tab" data-t="c4">碳核查支撑</div>
</div>
<div class="card"><div id="tabBody"></div></div>
${pageHint("本页覆盖需求 #101–#125。▲#105 碳排放总量计算、▲#122 核算过程数据追踪溯源（区块链或可交叉验证方式保证不可篡改、准确可信）为重要参数。")}`);
RENDERERS.c1=()=>`
<div class="kpis" style="grid-template-columns:repeat(5,1fr)">
 ${kpi("碳排放总量","22,590","tCO₂","▲#105 核算完成")}
 ${kpi("单位产品碳排放","0.42","tCO₂/百件","-3.8%")}
 ${kpi("单位产值碳排放","0.116","tCO₂/万元","-4.2%","down ok")}
 ${kpi("单位增加值碳排放","0.208","tCO₂/万元","-4.6%","down ok")}
 ${kpi("配额盈余","-320","tCO₂","⚠ 超排放预警","bad")}
</div>
<div class="grid g2">
 <div><div class="sub2">排放源清单（核算周期+边界内全部排放源）<span class="req-badge" style="position:static">#109</span></div>
  <table><tr><th>排放源</th><th>类别</th><th>活动数据</th><th>排放因子</th><th>CO₂(t)</th></tr>
  <tr><td>外购电力</td><td>范围二</td><td>31,650 MWh</td><td>0.5366</td><td>16,983</td></tr>
  <tr><td>天然气锅炉</td><td>范围一</td><td>211 万m³</td><td>2.162 kg/m³</td><td>4,562</td></tr>
  <tr><td>外购蒸汽</td><td>范围二</td><td>26,800 GJ</td><td>0.11 t/GJ</td><td>2,948</td></tr>
  <tr><td>公务车辆油品</td><td>范围一</td><td>38.6 t</td><td>3.1 t/t</td><td>120</td></tr>
  <tr><td>绿电交易核减</td><td>范围二</td><td>-3,770 MWh</td><td>0.5366</td><td class="down">-2,023</td></tr>
  <tr style="font-weight:700"><td>合计</td><td>范围一 + 二</td><td>—</td><td>—</td><td>22,590</td></tr></table>
  <div class="hint">排放因子：电网采用 2022 年全国电网平均排放因子 0.5366 tCO₂/MWh；绿电消费按绿证核销量扣减</div></div>
 <div><div class="sub2">碳排放趋势 + 超排放预警 <span class="req-badge" style="position:static">#110 #111</span></div>
  ${lineChart(["2021","2022","2023","2024","2025"],[{name:"碳排放(t)",color:"#2DD4BF",data:[27500,25900,24800,23500,22590]}],200,520)}
  <div class="concl"><b class="red">超排放预警（需求 #111）：</b>年度碳配额 22,270 t，当前排放 22,590 t，缺口 320 t——建议购买 CCER 或绿证抵消，已推送至碳资产管理模块。</div></div>
</div>
<div class="card"><h3>碳配置与减排措施 <span class="req-badge" style="position:static">#112–#116</span></h3>
 <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap"><button class="btn ghost sm" onclick="alert('演示：碳核算模型配置（#112）')">碳核算模型配置</button><button class="btn ghost sm" onclick="alert('演示：碳排放因子库配置，已更新 2025 版（#113）')">碳排放因子库配置（2025 版）</button><button class="btn ghost sm" onclick="alert('演示：排放源数据配置（#114）')">排放源数据配置</button></div>
 <div class="sub2">园区减排策略台账（按技术类别归集，链路分析各策略减排能力）</div>
 <table><tr><th>减排策略</th><th>技术类别</th><th>减排能力(tCO₂/年)</th><th>状态</th></tr>
 <tr><td>绿电采购占比提升至 50%（绿电聚合交易模式）</td><td><span class="tag ok">能源替代</span></td><td>3,240</td><td>已立项（减排项目台账 #01）</td></tr>
 <tr><td>屋顶光伏二期 2.2MW（钙钛矿高效组件试点）</td><td><span class="tag ok">能源替代</span></td><td>1,410</td><td>备案完成</td></tr>
 <tr><td>氢电耦合示范（谷电 + 光伏制氢，供燃料物流车与工艺助燃）</td><td><span class="tag ok">能源替代</span></td><td>620</td><td>前期研究</td></tr>
 <tr><td>空压站 AI 智控改造（能源大模型实时调控，节能率 30%+）</td><td><span class="tag">能效提升</span></td><td>890</td><td>实施中</td></tr>
 <tr><td>制冷机房 AI 全局优化（能效比 4.5→6.22，同步开发碳信用）</td><td><span class="tag">能效提升</span></td><td>1,650</td><td>方案评审</td></tr>
 <tr><td>数据中心液冷改造（PUE 降至 1.05，适配智算高热场景）</td><td><span class="tag">能效提升</span></td><td>1,320</td><td>实施中</td></tr>
 <tr><td>10℃ 低温余热浓缩回收（化纤/装备余热梯级利用）</td><td><span class="tag">循环利用</span></td><td>740</td><td>已立项</td></tr>
 <tr><td>共享储能电站 + 全钒液流长时储能（4h 级调节能力）</td><td><span class="tag star">电网互动</span></td><td>2,100</td><td>规划中</td></tr>
 <tr><td>虚拟电厂聚合可调负荷（20MW 级，AI 毫秒级响应参与调峰）</td><td><span class="tag star">电网互动</span></td><td>1,780</td><td>平台搭建</td></tr>
 <tr><td>熔盐储热 + 蒸汽管网移峰填谷（光热互补 24h 连续供能）</td><td><span class="tag star">电网互动</span></td><td>980</td><td>规划中</td></tr>
 <tr><td>燃机低浓度烟气碳捕集（CCUS）小试论证</td><td><span class="tag lv2">负碳技术</span></td><td>950</td><td>技术论证</td></tr>
 </table>
 <div class="sub2" style="margin-top:12px">先进减排技术推荐库（结合 2025–2026 行业领先实践，供园区/企业选择落地）</div>
 <table><tr><th>推荐技术</th><th>适用场景</th><th>行业标杆参考</th><th>园区落地建议</th></tr>
 <tr><td><b>AI 能效大模型智控</b></td><td>空压站、制冷机房、重点工艺参数寻优</td><td>卡奥斯「能源小智」空压站节能率超 30%、年省电费近 700 万；厦门天马制冷机房能效比 4.5→6.22，首年减碳 1.7 万t、碳信用按 65 元/t 挂牌交易</td><td>园区 4 座空压站 + 3 处集中机房率先接入，节能量经核算后开发碳信用「卖碳增收」</td></tr>
 <tr><td><b>虚拟电厂（VPP）</b></td><td>聚合储能、可调负荷、充电桩参与电网调峰与电力交易</td><td>陕西虚拟电厂平台聚合可调资源 155.8 万kW（相当于一座大型火电厂）；安徽 20MW 级 AI 虚拟电厂预测误差 ≤2.3%、毫秒级响应，服务百家企业累计提效 20%、减碳 15%</td><td>以宝丰储能储能 60MWh + 各企业可调负荷组建园区级 VPP，参与西北省际调峰辅助服务分摊收益</td></tr>
 <tr><td><b>长时储能</b></td><td>4h 以上跨时段调节、消纳夜间风电</td><td>全钒液流/锌铁液流电池规模化商用；固态电池高能量密度方向</td><td>共享储能电站模式（天津经开区实践）降低企业初投，采用液流路线适配园区热特性</td></tr>
 <tr><td><b>熔盐储热 + 光热互补</b></td><td>蒸汽/热力需求企业的 24h 连续供能</td><td>100MW 线性菲涅尔光热 + 熔盐储热实现全天候发电，突破绿电「靠天吃饭」</td><td>对接宇超电力装备、莱卡纤维新材料蒸汽负荷，谷电/光热加热熔盐夜间放热，替代部分燃气锅炉</td></tr>
 <tr><td><b>氢电耦合</b></td><td>谷电制氢自用：燃料物流车、焊接助燃、工艺热</td><td>杭州亚运氢电耦合园区：光伏+谷电制氢氧，氢供大巴物流车、氧供焊接、余热供注塑，年节约成本约 256 万元</td><td>利用园区夜间低谷电价与宝丰储能弃电制氢，先在物流与装备焊接场景示范</td></tr>
 <tr><td><b>光储直柔建筑</b></td><td>办公楼宇、厂房光伏 + 直流配电 + 柔性用电</td><td>雄安智慧零碳园区：光伏地砖 + 交直流混合微电网 + 磁悬浮冷机/地源热泵复合供能，全电园区零碳运行</td><td>新建厂房按光储直柔标准设计，楼宇可调负荷联建虚拟电厂</td></tr>
 <tr><td><b>碳信用开发与交易</b></td><td>节能改造后碳资产变现</td><td>全国首个集中式制冷机房碳信用项目落地，实现从「被动减碳」到「主动赚碳」</td><td>园区统一遴选可开发碳信用的节能项目（机房智控、余热回收），打包对接碳市场</td></tr>
 <tr><td><b>CCUS（碳捕集利用与封存）</b></td><td>燃机烟气、化工工艺等难减排环节兜底</td><td>长兴岛全国首套 10 万吨级燃机低浓度烟气碳捕集装置；宝武钢铁冶金流程耦合 CCUS</td><td>莱卡纤维新材料先行小试论证，结合 CCER 政策与碳交易收益测算经济性</td></tr>
 </table>
 <div class="hint"><b>技术选型原则（行业共识）：</b>核心运行环节优先采用商业化成熟技术（分布式光伏、储能、高效电机、AI 能效平台）；示范区域试点前沿技术（氢能、CCUS、长时储能），并预留物理空间与系统接口避免技术路径过早锁定；同时结合全生命周期成本、碳减排收益与碳交易收益综合测算，成熟技术快速推广、长周期技术借力政策激励。</div>
 <div class="hint">减排链路分析各策略下的减排能力；减排项目台账以监测视图与列表展示概览与明细（需求 #115 #116）</div></div>`;
RENDERERS.c2=()=>`<div class="grid g2">
 <div><div class="sub2">产品碳足迹核算 <span class="req-badge" style="position:static">#117–#119</span></div>
  <table><tr><th>产品</th><th>核算边界</th><th>碳足迹</th><th>认证</th></tr>
  <tr><td>智能网关终端</td><td>摇篮到大门</td><td>8.6 kgCO₂/台</td><td><span class="tag ok">已出证</span></td></tr>
  <tr><td>用电监测终端</td><td>摇篮到坟墓</td><td>21.4 kgCO₂/台</td><td><span class="tag lv2">核算中</span></td></tr></table>
  <div class="hint">模板配置：产线、生产起止时间、核算边界、生产工序、排放源种类及使用量；原始数据交叉验证与溯源，满足产品碳足迹标识认证要求；模板留存可复用（#119）</div></div>
 <div><div class="sub2">核算报告与下游共享</div>
  <div style="display:flex;gap:8px;margin-bottom:10px"><button class="btn sm" onclick="alert('演示：按系统模板生成产品碳足迹核算报告')">生成碳足迹报告</button><button class="btn ghost sm" onclick="alert('演示：向下游用户提供碳足迹核算过程与结果（#121）')">共享给下游客户（#121）</button></div>
  <div class="concl"><b>共享能力：</b>向下游用户提供本企业产品碳足迹核算过程、核算结果及核算报告，支撑客户供应链碳管理要求。</div></div>
</div>`;
RENDERERS.c3=()=>`<div class="sub2">上游供应商产品碳数据 <span class="req-badge" style="position:static">#120</span></div>
<table><tr><th>原材料编码</th><th>名称</th><th>规格</th><th>数量</th><th>产地</th><th>入库时间</th><th>单位碳排</th><th>供应商</th><th>报告</th></tr>
<tr><td>RM-2201</td><td>PCB 板</td><td>4 层</td><td>12,000 片</td><td>广东</td><td>2025-10-18</td><td>1.82 kg/片</td><td>华南电子</td><td><span style="color:var(--cyan);cursor:pointer" onclick="alert('演示：在线预览供应商碳足迹报告与证书')">预览 ↗</span></td></tr>
<tr><td>RM-2202</td><td>铝合金外壳</td><td>CNC</td><td>12,000 件</td><td>宁夏</td><td>2025-10-20</td><td>0.94 kg/件</td><td>宏基新材料</td><td><span style="color:var(--cyan);cursor:pointer" onclick="alert('演示：在线预览')">预览 ↗</span></td></tr>
<tr><td>RM-2203</td><td>包装箱</td><td>再生纸</td><td>12,000 套</td><td>甘肃</td><td>2025-10-22</td><td>0.12 kg/套</td><td>塞上包装</td><td><span style="color:var(--cyan);cursor:pointer" onclick="alert('演示：在线预览')">预览 ↗</span></td></tr></table>
<div class="hint">支持在线预览上游供应商碳足迹报告与碳足迹证书</div>`;
RENDERERS.c4=()=>`
<div class="card" style="background:rgba(167,139,250,.06)"><h3>核算过程数据追踪溯源 <span class="tag star">▲ #122</span></h3><span class="req-badge">#122 #123</span>
 <table><tr><th>数据记录</th><th>来源</th><th>操作人</th><th>获取时间</th><th>修改存证</th><th>链上校验</th></tr>
 <tr><td>1#车间总表 10 月电量</td><td>表计采集</td><td>系统</td><td>11-01 00:05</td><td>无修改</td><td><span class="tag ok">✓ 哈希一致</span></td></tr>
 <tr><td>锅炉燃气量 10-28</td><td>手工填报</td><td>王工</td><td>10-28 14:22</td><td><span class="tag lv2">修改 1 次（412→408 m³/h）</span></td><td><span class="tag ok">✓ 存证上链</span></td></tr>
 <tr><td>排放因子库 2025 版</td><td>因子库配置</td><td>李工</td><td>10-12 09:00</td><td>版本 v3.1</td><td><span class="tag ok">✓ 可交叉验证</span></td></tr></table>
 <div class="hint">标识数据来源（表计或手工填报操作人）的数据修改存证及数据获取时间，形成数据溯源；通过区块链或可交叉验证方式保证核算过程数据与原始凭证不可篡改、准确可信（#122 #123）</div></div>
<div class="grid g2">
 <div><div class="sub2">碳排放报告 <span class="req-badge" style="position:static">#124</span></div>
  <table><tr><th>报告</th><th>模板</th><th>状态</th><th>操作</th></tr>
  <tr><td>2025 年度碳排放报告</td><td>内置标准模板</td><td>已生成</td><td><button class="btn sm" onclick="alert('演示：在线预览')">在线预览</button> <button class="btn ghost sm" onclick="alert('演示：一键下载')">一键下载</button></td></tr>
  <tr><td>2025 Q3 碳排放报告</td><td>内置标准模板</td><td>已生成</td><td><button class="btn sm" onclick="alert('演示：在线预览')">在线预览</button> <button class="btn ghost sm" onclick="alert('演示：一键下载')">一键下载</button></td></tr></table></div>
 <div><div class="sub2">碳核查材料汇集 <span class="req-badge" style="position:static">#125</span></div>
  <table><tr><th>材料</th><th>份数</th></tr>
  <tr><td>活动数据原始凭证</td><td>126 份</td></tr><tr><td>因子库与模型配置记录</td><td>18 份</td></tr><tr><td>手工填报修改存证</td><td>9 份</td></tr><tr><td>层级聚合与计算过程表</td><td>42 份</td></tr></table>
  <button class="btn sm" style="margin-top:8px" onclick="alert('演示：一键下载全部核查材料')">一键下载全部核查材料</button></div>
</div>`;

/* ---------- 碳资产管理 #126–139 ---------- */
reg("entAsset",()=>`
<div class="tabs">
 <div class="tab on" data-t="a1">碳配额</div><div class="tab" data-t="a2">CCER 管理</div><div class="tab" data-t="a3">绿证管理</div><div class="tab" data-t="a4">绿电管理</div><div class="tab" data-t="a5">碳交易</div>
</div>
<div class="card"><div id="tabBody"></div></div>
${pageHint("本页覆盖需求 #126–#139：配额展示/分析/录入/测算/告警、CCER 统一管理与量化分析、绿证资产/核销/购入、绿电项目/资产、交易台账/策略/撮合。")}`);
RENDERERS.a1=()=>`
<div class="kpis" style="grid-template-columns:repeat(4,1fr)">
 ${kpi("当年度碳配额","15,800","tCO₂","需求 #126")}
 ${kpi("实际排放","16,120","tCO₂","缺口 -320 t","bad")}
 ${kpi("次年度配额测算","16,400","tCO₂","基准线法（#129）")}
 ${kpi("履约状态","未履约","","截止 2025-12-31","bad")}
</div>
<div class="card"><h3>碳配额分析与告警 <span class="req-badge" style="position:static">#127 #128 #130</span></h3>
 <div class="concl"><b class="red">配额告警：</b>盈余量已转负（-320 t），触发降碳措施提示——建议：①启动 CCER 购置 500 t；②将空压机优化减排量（580 t）纳入核证。支持按年度录入配额数据（#128）与次年度测算（#129）。</div></div>`;
RENDERERS.a2=()=>`<div class="grid g2">
 <div><div class="sub2">CCER 项目构成</div>${donut([{k:"并网光伏",v:1800},{k:"造林碳汇",v:950},{k:"其他",v:120}],150,22)}</div>
 <div><div class="sub2">CCER 项目管理（监测仪表 + 表格）<span class="req-badge" style="position:static">#131</span></div>
  <table><tr><th>项目</th><th>类型</th><th>年减排量(t)</th><th>状态</th></tr>
  <tr><td>园区分布式光伏方法学项目</td><td>并网光伏</td><td>1,800</td><td>登记中</td></tr>
  <tr><td>宁夏防沙治沙碳汇</td><td>造林</td><td>950</td><td>已登记</td></tr></table>
  <div class="concl"><b>量化分析：</b>已登记项目累计签发 2,530 t，可覆盖当前配额缺口；跟踪减排成效按季度更新，实现自愿减排项目统一管理与查看。</div></div>
</div>`;
RENDERERS.a3=()=>`<div class="grid g2">
 <div><div class="sub2">绿证资产管理 <span class="req-badge" style="position:static">#132</span></div>
  <table><tr><th>类型</th><th>数量(张)</th><th>来源</th><th>交易日期</th></tr>
  <tr><td>GEC 绿证</td><td>12,400</td><td>宁夏绿电交易</td><td>2025-09-12</td></tr>
  <tr><td>GEC 绿证</td><td>8,600</td><td>河北风电</td><td>2025-06-30</td></tr></table>
  <div class="hint">导入并查询类型/数量/来源/交易日期，统一管理</div></div>
 <div><div class="sub2">核销 / 购入测算 <span class="req-badge" style="position:static">#133 #134</span></div>
  <table>${row("需核销绿证量","10,200 张","结合零碳工厂核心指标与年度目标")}${row("需购入绿证量","3,800 张","缺口测算")}</table>
  <div class="concl"><b>测算逻辑：</b>按非化石能源电力消费物理认定量占比 45% 目标倒推，现有绿证覆盖后仍缺 3,800 张，建议 Q4 集中购入。</div></div>
</div>`;
RENDERERS.a4=()=>`<div class="sub2">绿电项目列表（按户名 / 电压等级筛选）<span class="req-badge" style="position:static">#135 #136</span></div>
<div style="display:flex;gap:8px;margin-bottom:10px"><select><option>全部户名</option><option>嘉盛德电子材料</option></select><select><option>全部电压等级</option><option>10kV</option><option>35kV</option></select><button class="btn ghost sm" onclick="alert('演示：筛选查询绿电项目清单')">查询</button></div>
<table><tr><th>项目</th><th>并网电压</th><th>年发电量(万kWh)</th><th>供电量(万kWh)</th><th>交易电量</th><th>交易金额(万元)</th><th>结算月份</th></tr>
<tr><td>屋顶光伏一期</td><td>10kV</td><td>780</td><td>742</td><td>742</td><td>286</td><td>2025-10</td></tr>
<tr><td>屋顶光伏二期</td><td>10kV</td><td>412</td><td>396</td><td>396</td><td>152</td><td>2025-10</td></tr></table>
<div class="hint">支持新增或导入绿电交易电量、交易金额、交易单价、结算月份等数据（需求 #136）</div>`;
RENDERERS.a5=()=>`<div class="grid g2">
 <div><div class="sub2">碳交易台账 + 履约分析 <span class="req-badge" style="position:static">#137 #138</span></div>
  <table><tr><th>日期</th><th>方向</th><th>数量(t)</th><th>价格(元)</th><th>金额(万元)</th></tr>
  <tr><td>2025-08-14</td><td>买入</td><td>800</td><td>96.5</td><td>7.72</td></tr>
  <tr><td>2025-03-22</td><td>卖出</td><td>500</td><td>88.2</td><td>4.41</td></tr></table>
  <div class="concl"><b>策略建议：</b>当前缺口 320 t，实时碳价 <b>102.4 元/t</b>（月均价 98.6），价格呈上行趋势——建议尽快完成履约买入，避免年末价格冲高。柱状图分析碳履约盈缺（#138）。</div></div>
 <div><div class="sub2">实时碳价 + 交易撮合 <span class="req-badge" style="position:static">#139</span></div>
  ${lineChart(["6月","7月","8月","9月","10月","11月"],[{name:"月均价(元/t)",color:"#FBBF24",data:[86.2,89.5,92.1,94.8,98.6,102.4]},{name:"实时价",color:"#F87171",data:[88,91,95,97,101,102.4]}],190,520)}
  <table><tr><th>方向</th><th>主体</th><th>可交易量(t)</th><th>期望价格(元)</th></tr>
  <tr><td style="color:#4ADE80">卖方</td><td>宝丰储能科技</td><td>2,000</td><td>98</td></tr>
  <tr><td style="color:#F87171">买方</td><td>海归小镇生物医药园</td><td>600</td><td>≤105</td></tr></table>
  <div class="hint">展示可交易碳资产的卖方与买方信息，为企业碳交易提供撮合渠道（需求 #139）</div></div>
</div>`;

/* ---------- AI 智能体 #140–143 ---------- */
reg("aiAgent",()=>`
<div class="grid" style="grid-template-columns:2fr 1fr">
 <div class="card" style="margin-bottom:0"><h3>AI 智能问答 </h3><span class="req-badge">#141</span>
  <div class="chat">
   <div class="chat-list" id="chatList">
    <div class="msg ai">您好，我是苏银产业园零碳 AI 智能体（▲#142 智能预测 / ▲#143 节能诊断 / #141 智能问答）。<br>支持语音唤醒与自然语言交互、多轮对话、上传图片附件、问答结果图表展示。<br>可基于园区知识库与碳数据解答：政策分析、能耗与碳排数据查询分析、能效诊断与优化等问题。</div>
   </div>
   <div class="chips">
    ${AI_QA.map((qa,i)=>`<span class="chip" onclick="askAI(${i})">${qa.q}</span>`).join("")}
   </div>
   <div class="chat-input">
    <input type="text" id="chatInput" placeholder="输入问题，例如：园区今年能耗多少？" onkeydown="if(event.key==='Enter')askFree()">
    <button class="btn" onclick="askFree()">发送</button>
    <button class="btn ghost" title="语音交互（对应演示要求：支持语音唤醒及自然语言/语音交互提问）">🎤</button>
   </div>
  </div></div>
 <div>
  <div class="card"><h3>智能体平台能力（#140）</h3><span class="req-badge">#140</span>
   <table>${row("专用大模型","零碳园区垂直领域","统一下发")}${row("专业智能体","问数/预测/诊断/规划","4 类")}${row("场景数据集","园区 5 年能碳数据","脱敏")}${row("算法/技能组件","预测·诊断·优化","可插拔")}${row("AI 评测体系","准确率/幻觉率","季度评测")}</table>
   <div class="hint">支撑专用大模型、专业智能体、场景数据集、场景模型、算法组件、技能组件、AI 评测体系的统一研发、管理、部署与运行（需求 #140）</div></div>
  <div class="card"><h3>▲ 重要参数提示</h3>
   <div class="concl"><b class="red">▲#142 AI智能预测：</b>融合历史与实时数据，预测能耗、碳排放、负荷及新能源出力，支撑运行优化决策。</div>
   <div class="concl"><b class="red">▲#143 AI节能诊断：</b>实时分析园区能耗数据，定位高耗能环节与异常，输出节能潜力、整改建议及预期收益。</div>
   <div class="hint">#141–#143 均需提供源代码</div></div>
 </div>
</div>`);

function askAI(i){const qa=AI_QA[i];const list=document.getElementById("chatList");if(!list)return;
 list.innerHTML+=`<div class="msg user">${qa.q}</div>`;
 const tip=document.createElement("div");tip.className="msg ai";tip.innerHTML='<span class="typing">正在调用知识库与碳数据分析…</span>';list.appendChild(tip);
 list.scrollTop=list.scrollHeight;
 setTimeout(()=>{tip.remove();const m=document.createElement("div");m.className="msg ai";m.textContent=qa.a;list.appendChild(m);list.scrollTop=list.scrollHeight;},700);}
function askFree(){const inp=document.getElementById("chatInput");if(!inp)return;const q=inp.value.trim();if(!q)return;inp.value="";
 const hit=AI_QA.find(x=>q.includes("碳")&&x.q.includes("碳排")||q.includes("预测")||q.includes("节能")||q.includes("规划"));
 const list=document.getElementById("chatList");
 list.innerHTML+=`<div class="msg user">${q}</div>`;
 setTimeout(()=>{const m=document.createElement("div");m.className="msg ai";
  m.textContent=hit?hit.a:"已在园区知识库检索，为您匹配到相关政策与口径说明（演示环境请使用上方预置问题体验完整能力）。";
  list.appendChild(m);list.scrollTop=list.scrollHeight;},600);}

/* ---------- 物联网平台 #144 ---------- */
reg("iot",()=>`
<div class="kpis" style="grid-template-columns:repeat(5,1fr)">
 ${kpi("接入设备","333","台套","在线率 98.2%","up ok")}
 ${kpi("智能通信网关","40","台","38 台在线")}
 ${kpi("用电监测终端(低压)","65","台","数据完整率 99.1%")}
 ${kpi("用电监测终端(高压)","23","台","含互感器 195 只")}
 ${kpi("用户侧系统集成终端","2","台","含蒸汽流量计 2 台")}
</div>
<div class="grid g2">
 <div class="card"><h3>设备管理</h3><span class="req-badge">#144</span>
  <table><tr><th>设备</th><th>位置</th><th>状态</th><th>最近心跳</th></tr>
  <tr><td>GW-012 智能通信网关</td><td>莱卡纤维新材料 配电室</td><td><span class="tag ok">在线</span></td><td>10s 前</td></tr>
  <tr><td>LC-033 低压监测终端</td><td>宇超电力装备 1#车间</td><td><span class="tag ok">在线</span></td><td>12s 前</td></tr>
  <tr><td>HV-008 高压监测终端</td><td>园区 10kV 开闭所</td><td><span class="tag lv2">离线 35 分钟</span></td><td>—</td></tr>
  <tr><td>SF-002 蒸汽流量计</td><td>鲜控冷链设备 锅炉房</td><td><span class="tag ok">在线</span></td><td>15s 前</td></tr></table></div>
 <div class="card"><h3>规则引擎 / 数据服务 / 远程维护</h3><span class="req-badge">#144</span>
  <table>${row("规则引擎","告警规则 28 条 / 联动规则 12 条","含超阈值自动告警")}${row("数据服务","MQTT / REST / 数据订阅","采集周期 1–15min 可设")}${row("网关管理","远程配置 / 固件升级","支持协议扩展")}${row("远程维护","远程诊断 / 日志回传","现场免维护")}${row("基础支撑","设备影子 / 边缘缓存","断网续传 ≥72h")}</table>
  <div class="hint">物联网平台应包含基础支撑、平台门户、设备管理、规则引擎、网关管理、数据服务、远程维护等功能（需求 #144）</div></div>
</div>
${pageHint("硬件侧对应附件二：用户侧系统集成终端 2 台、智能通信网关 40 台、低压监测终端 65 台、高压监测终端 23 台、开口式电流互感器 195 只、防爆隔离控制箱 4 台、蒸汽流量计 2 台、控制箱 2 台、勘察施工调试 1 项。")}`);

/* ================= 路由与初始化 ================= */
const NAV=[
 {group:"园区端",items:[
  {id:"dashboard",t:"能碳总览驾驶舱",req:"#1–15",sub:"对应需求序号 1–15（多项需提供源代码）"},
  {id:"oneMap",t:"能碳全景一张图",req:"#16–24",sub:"对应需求序号 16–24，▲#17 重要参数"},
  {id:"multi",t:"多维能碳分析",req:"#25–42",sub:"对应需求序号 25–42，▲#25 ▲#26 重要参数"},
  {id:"alarm",t:"能碳告警",req:"#43–49",sub:"对应需求序号 43–49"},
  {id:"assess",t:"碳考核评价",req:"#50–52",sub:"对应需求序号 50–52，▲#50 重要参数"},
  {id:"path",t:"零碳路径推演",req:"#53–58",sub:"对应需求序号 53–58"},
  {id:"report",t:"碳排放报告",req:"#59–66",sub:"对应需求序号 59–66，▲#65 ▲#66 重要参数"},
 ]},
 {group:"企业端",items:[
  {id:"entHome",t:"企业大屏首页",req:"#67",sub:"对应需求序号 67"},
  {id:"entQuery",t:"能耗查询与监测",req:"#68–74",sub:"对应需求序号 68–74"},
  {id:"entAI",t:"AI 用能分析与策略",req:"#81–90",sub:"能源消费分析与用能策略推荐（AI 应用）"},
  {id:"entBench",t:"能效对标与能流碳流",req:"#91–100",sub:"对应需求序号 91–100"},
  {id:"entCarbon",t:"碳排放核算与核查",req:"#101–125",sub:"▲#105 核算 · 碳足迹 · 供应链 · ▲#122 核查支撑"},
  {id:"entAsset",t:"碳资产管理",req:"#126–139",sub:"配额 / CCER / 绿证 / 绿电 / 碳交易"},
 ]},
 {group:"AI 与物联",items:[
  {id:"aiAgent",t:"AI 大模型智能体",req:"#140–143",sub:"▲#142 预测 · ▲#143 诊断 · 需源代码"},
  {id:"iot",t:"物联网平台",req:"#144",sub:"设备管理 / 规则引擎 / 网关管理 / 数据服务"},
 ]},
];
let curPage="dashboard";
function buildNav(){
 const nav=document.getElementById("nav");
 nav.innerHTML=NAV.map(g=>`<div class="nav-group">${g.group}</div>`+g.items.map(it=>
  `<div class="nav-item" data-id="${it.id}" onclick="go('${it.id}')">${it.t}${it.id==="dashboard"?'<span class="fs-tag">⛶ 全屏</span>':""}<span class="req">${it.req}</span></div>`).join("")).join("");
}
/* 驾驶舱进入全屏大屏模式（隐藏侧栏/顶栏）；ESC 或右上角按钮退回系统界面 */
const FS_BAR=`<div class="fs-bar"><h1>苏银产业园 AI 零碳数智平台 · 能碳总览驾驶舱</h1>
 <span class="fs-sub">园区级能碳运行监测 · 全屏大屏模式（按 ESC 或点右上按钮返回系统）</span>
 <span class="fs-clock" id="fsClock"></span>
 <button class="fs-exit" onclick="exitFS()">⛶ 退出全屏 · 返回系统</button></div>`;
function exitFS(){document.body.classList.remove("fs");go("oneMap");}
window.exitFS=exitFS;
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&document.body.classList.contains("fs"))exitFS();});
function go(id){
 curPage=id;
 const fs=id==="dashboard";
 document.body.classList.toggle("fs",fs);
 document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.id===id));
 const item=NAV.flatMap(g=>g.items).find(i=>i.id===id);
 document.getElementById("pageTitle").textContent=item.t;
 document.getElementById("pageSub").textContent=item.sub;
 const content=document.getElementById("content");
 content.innerHTML=(fs?FS_BAR:"")+`<div class="page active" id="pg-${id}">${PAGES[id].render()}</div>`;
 content.scrollTop=0;
 bindTabs();
 if(id==="alarm")renderAlarmTable();
 if(id==="report")renderReport();
 if(id==="oneMap"){OM.year=2025;omGranInit();}
 if(id==="multi"){const t=document.querySelector("#multiTabs .tab.on");if(t)t.click();}
 if(id==="entQuery"){const t=document.querySelector(".tab.on[data-t='e1']");if(t)t.click();}
 if(id==="entBench"){const t=document.querySelector(".tab.on[data-t='b1']");if(t)t.click();}
 if(id==="entCarbon"){const t=document.querySelector(".tab.on[data-t='c1']");if(t)t.click();}
 if(id==="entAsset"){const t=document.querySelector(".tab.on[data-t='a1']");if(t)t.click();}
 if(id==="aiAgent"&&typeof aiRender==="function")aiRender();
}
(function(){var _rt=document.getElementById("reqToggle");if(_rt)_rt.addEventListener("change",function(){document.body.classList.toggle("show-req",this.checked);});})();
function tick(){const d=new Date();const p=n=>String(n).padStart(2,"0");
 const s=d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())+" "+p(d.getHours())+":"+p(d.getMinutes())+":"+p(d.getSeconds());
 document.getElementById("clock").textContent=s;
 const fc=document.getElementById("fsClock");if(fc)fc.textContent=s;}
setInterval(tick,1000);tick();
buildNav();go("dashboard");
