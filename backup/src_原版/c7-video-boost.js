/* ================= 演示视频增强层：按评分点补齐演示功能 ================= */
/* 视觉增强样式 */
document.head.insertAdjacentHTML("beforeend",`<style>
.iso-stage{width:100%;aspect-ratio:860/560;max-height:480px;perspective:1000px;overflow:hidden;background:radial-gradient(ellipse at 50% 30%,#12294A 0%,#0A1628 75%);border-radius:8px;display:flex;align-items:center;justify-content:center;}
.iso-world{width:860px;height:560px;transform-style:preserve-3d;transition:transform .9s cubic-bezier(.4,0,.2,1);will-change:transform;}
.iso-btn.on{background:var(--blue);color:#fff;border-color:var(--blue);}
.fband{fill:none;stroke-linecap:round;stroke-dasharray:10 7;animation:fdash 1.1s linear infinite;}
@keyframes fdash{to{stroke-dashoffset:-17;}}
.flow-src{fill:#152844;stroke:#3B82C4;stroke-width:1.2;}
.flow-lb{fill:#8FA8C4;font-size:11px;}
.flow-v{fill:#fff;font-size:11px;font-family:Consolas,monospace;}
.info-card{background:linear-gradient(165deg,rgba(19,36,62,.92),rgba(13,25,45,.82));border:1px solid rgba(64,120,190,.28);border-radius:10px;padding:12px;cursor:pointer;transition:all .22s;position:relative;overflow:hidden;}
.info-card:hover{transform:translateY(-3px);border-color:rgba(56,189,248,.55);box-shadow:0 10px 24px rgba(0,91,172,.3);}
.info-card .ic{font-size:20px;}
.info-card .t{color:#fff;font-size:13px;margin-top:6px;font-weight:600;}
.info-card .d{color:#6FA0CC;font-size:11px;margin-top:4px;line-height:1.6;}
.info-card::after{content:"";position:absolute;right:-14px;top:-14px;width:52px;height:52px;border-radius:50%;background:radial-gradient(circle,rgba(56,189,248,.18),transparent 70%);}
.core-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
.core-item{background:rgba(19,36,62,.9);border:1px solid rgba(64,120,190,.28);border-radius:10px;padding:10px 12px;cursor:pointer;transition:all .22s;}
.core-item:hover{border-color:rgba(56,189,248,.55);transform:translateY(-2px);}
.core-item .n{color:#DCE8F5;font-size:12px;}
.core-item .p{margin-top:6px;}
.core-item .m{font-size:11px;color:#6FA0CC;margin-top:5px;}
.mic-btn.listening{background:var(--red)!important;animation:micpulse 1s infinite;}
@keyframes micpulse{0%,100%{box-shadow:0 0 0 0 rgba(248,113,113,.5);}50%{box-shadow:0 0 0 10px rgba(248,113,113,0);}}
.ai-side{display:flex;flex-direction:column;gap:8px;}
.ai-sess{border:1px solid var(--line);border-radius:8px;padding:9px 12px;cursor:pointer;font-size:12px;color:var(--txt2);transition:all .2s;}
.ai-sess:hover{border-color:#38BDF8;}
.ai-sess.on{background:rgba(0,91,172,.3);border-color:#38BDF8;color:#fff;}
.ai-sess .sub{font-size:10px;color:var(--txt3);margin-top:3px;}
.msg img.thumb{max-width:180px;border-radius:6px;border:1px solid var(--line);display:block;margin-top:6px;}
.demo-fab{position:fixed;right:18px;bottom:18px;z-index:90;}
.demo-fab button{background:linear-gradient(135deg,#0B6EC5,#005BAC);border:none;color:#fff;padding:10px 18px;border-radius:22px;font-size:13px;cursor:pointer;box-shadow:0 8px 22px rgba(11,110,197,.5);}
.demo-panel{position:fixed;right:18px;bottom:64px;width:330px;max-height:70vh;overflow-y:auto;z-index:90;background:rgba(13,25,45,.96);border:1px solid rgba(64,120,190,.4);border-radius:12px;padding:14px;display:none;backdrop-filter:blur(12px);box-shadow:0 18px 40px rgba(2,8,20,.6);}
.demo-panel.open{display:block;}
.demo-panel h4{color:#fff;font-size:13px;margin-bottom:8px;}
.demo-step{border:1px solid var(--line);border-radius:8px;padding:8px 10px;margin-bottom:8px;font-size:12px;}
.demo-step b{color:#7DD3FC;display:block;margin-bottom:4px;}
.demo-step .pts{color:#8FA8C4;font-size:11px;line-height:1.7;}
.demo-step button{margin-top:6px;}
.dist-lb{fill:#5D7A9C;font-size:13px;letter-spacing:2px;}
</style>`);

/* 片区划分（一张图按街道/园区维度） */
const DISTRICTS=[
 {name:"如意街街道",pts:"90,80 480,70 480,540 300,540 90,420",color:"rgba(46,139,192,.10)",stroke:"#2E8BC0"},
 {name:"京河大道街道",pts:"480,70 700,66 700,540 480,540",color:"rgba(45,212,191,.10)",stroke:"#2DD4BF"},
 {name:"光伏产业园片区",pts:"700,66 930,70 950,300 860,330 700,330",color:"rgba(251,191,36,.10)",stroke:"#FBBF24"},
 {name:"综合产业社区",pts:"700,330 860,330 820,520 700,540",color:"rgba(167,139,250,.12)",stroke:"#A78BFA"}];
const DIST_OF={1:"如意街街道",2:"如意街街道",3:"京河大道街道",4:"京河大道街道",5:"京河大道街道",6:"综合产业社区",7:"光伏产业园片区",8:"如意街街道"};
COMPANIES.forEach(c=>c.dist=DIST_OF[c.id]);

/* 地图重绘：增加片区图层 */
function renderMap(mode){
 const zones=mode==="onemap"?DISTRICTS.map(d=>`<polygon points="${d.pts}" fill="${d.color}" stroke="${d.stroke}" stroke-width="1.5" stroke-dasharray="6 4"/><text class="dist-lb" x="${d.pts.split(" ")[0].split(",")[0]}" y="${+d.pts.split(" ")[0].split(",")[1]+22}" fill="${d.stroke}" opacity=".9">${d.name}</text>`).join(""):"";
 const body=`<div class="map-wrap"><svg class="map-svg" viewBox="0 0 1000 560">
  <polygon points="120,80 900,60 950,300 820,520 300,540 90,420" fill="${lc("#0E2138","#DCEBF7")}" stroke="${lc("#2E8BC0","#7FB0D4")}" stroke-width="2"/>
  ${zones}
  <path d="M120 260 H 930" stroke="${lc("#1E3A5C","#C3D8EB")}" stroke-width="8"/>
  <path d="M480 62 V 535" stroke="${lc("#1E3A5C","#C3D8EB")}" stroke-width="8"/>
  <text x="500" y="275" fill="${lc("#3E5C82","#7E97AE")}" font-size="12">京河大道</text>
  <text x="140" y="250" fill="${lc("#3E5C82","#7E97AE")}" font-size="12">如意街</text>
  <rect x="620" y="360" width="90" height="40" fill="${lc("#12294A","#FFFFFF")}" stroke="${lc("#2E4C77","#AECBE2")}"/><text x="630" y="385" fill="${lc("#5D7A9C","#5A7089")}" font-size="11">智慧产业研发大厦</text>
  <rect x="150" y="90" width="110" height="34" fill="${lc("#12294A","#FFFFFF")}" stroke="${lc("#2E4C77","#AECBE2")}"/><text x="160" y="112" fill="${lc("#5D7A9C","#5A7089")}" font-size="11">集中式光伏区</text>
  <g id="mapDots"></g>
 </svg></div>`;
 if(mode==="onemap")return `<div style="position:relative">
  ${body}
  <div style="position:absolute;top:10px;right:12px;display:flex;flex-direction:column;gap:6px;z-index:5">
   <button class="btn sm" title="放大" onclick="omZoomAt(0.8)">＋</button>
   <button class="btn sm" title="缩小" onclick="omZoomAt(1.25)">－</button>
   <button class="btn ghost sm" title="复位视图" onclick="omZoomReset()">⤾</button>
  </div>
  <div class="hint" style="margin:6px 0 0;text-align:right">支持滚轮缩放 / 拖拽平移 / 按钮缩放复位</div>
 </div><div id="mapLegend" class="legend" style="margin-top:8px"></div>`;
 return `${body}<div id="mapLegend" class="legend" style="margin-top:8px"></div>`;
}
function renderMapDots(mode,query){
 const g=document.getElementById("mapDots");if(!g)return;
 const key=mode==="onemap"?OM.factor:"en";
 const pf=omPeriodFactor();
 const val=c=>{const idx=YEARS.indexOf(OM.year);
  if(key==="co")return c.co5[idx]*pf;if(key==="cl")return c.asset/300*pf;if(key==="gl")return c.asset/500;return c.en5[idx]*pf;};
 let list=COMPANIES;
 if(mode==="onemap"&&OM.dist&&OM.dist!=="all")list=list.filter(c=>c.dist===OM.dist);
 if(query)list=list.filter(c=>c.name.includes(query));
 if(!list.length){g.innerHTML="";return;}
 const mx=Math.max(...list.map(val));
 const unit={en:" 万tce",co:" 万tCO₂",cl:" 万kWh",gl:" 分"}[key]||"";
 const per=mode==="onemap"?omPeriodName():"";
 g.innerHTML=list.map(c=>`<g class="map-point" onclick="coModal(${c.id})" transform="translate(${c.x},${c.y})">
   <circle class="dot" r="7" fill="${dotColor(val(c),mx)}" stroke="#fff" stroke-width="1.5"><title>${c.name} · ${c.dist}${per?" · "+per+"":""}：${(Math.round(val(c)*100)/100)}${unit}</title></circle>
   <text class="dot-label" x="11" y="4">${c.name}（${c.eg} 级能效）</text></g>`).join("");
 const lg=document.getElementById("mapLegend");
 if(lg)lg.innerHTML=`<span><i style="background:#4ADE80"></i>低</span><span><i style="background:#FBBF24"></i>中</span><span><i style="background:#F87171"></i>高</span><span>要素值单位：${unit||"—"}</span><span style="color:${lc("#5D7A9C","#5E7A94")}">虚线框 = 街道/园区片区划分（演示评分点②）</span>`;
}

/* 企业下钻增强：能碳画像 + 实时数据 + 工艺流程图 + 能流图 + 可调节能力 */
function coModal(id){
 const c=COMPANIES.find(x=>x.id===id);
 const idx=YEARS.indexOf(OM.year);
 const cur=c.en5[idx];
 const load24=Array.from({length:8},(_,i)=>+(cur*2.2*(0.75+0.3*Math.sin(i*0.9+c.id))).toFixed(1));
 const adj=+(cur*0.14).toFixed(1);
 showModal(`企业能碳画像下钻 —— ${c.name}（${c.dist}）`,`
  <div class="kpis" style="grid-template-columns:repeat(5,1fr)">
   ${kpi(c.name,c.ind,"","碳评价 "+c.grade+" 级")}
   ${kpi("2025 能耗",c.en.toFixed(1),"万tce","累计 -"+c.red+"%")}
   ${kpi("2025 碳排",c.co.toFixed(1),"万tCO₂","累计 -"+c.red+"%")}
   ${kpi("能效等级",c.eg,"级",c.eg==="A"?"行业先进":c.eg==="B"?"行业平均":"待提升")}
   ${kpi("可调节能力",adj,"MW","响应时长 15min")}
  </div>
  <div class="grid g2">
   <div><div class="sub2">近五年能耗 / 碳排趋势</div>
    ${lineChart(YEARS.map(String),[{name:"能耗(万tce)",color:"#2E8BC0",data:c.en5.map(v=>+v.toFixed(2))},{name:"碳排(万tCO₂)",color:"#2DD4BF",data:c.co5.map(v=>+v.toFixed(2))}],200,480)}
    <div class="concl"><b>能碳分析：</b>${c.name}近五年能耗与碳排累计下降 ${c.red}%，${c.eg==="A"?"已达行业先进水平，建议输出为园区标杆案例。":c.eg==="B"?"处于行业平均水平，建议开展 AI 节能诊断挖掘改造空间。":"能效偏低，建议列入重点帮扶清单。"}</div>
    <div class="concl"><b>减排措施：</b>${c.meas}</div></div>
   <div><div class="sub2">实时数据 · 今日负荷曲线（10min 粒度采样）</div>
    ${lineChart(["08:00","10:00","12:00","14:00","16:00","18:00","20:00","22:00"],[{name:"负荷(MW)",color:"#38BDF8",data:load24}],180,480)}
    <table>${row("当前负荷",(load24[7]*1.08).toFixed(1)+" MW","今日电量 "+Math.round(cur*210)+" MWh")}${row("功率因数","0.94","数据时间 "+new Date().toLocaleTimeString("zh-CN",{hour12:false}))}${row("可调负荷容量",adj+" MW","参与需求响应：已聚合")}</table></div>
  </div>
  <div class="grid g2">
   <div><div class="sub2">工艺流程图（能源输入 → 生产工序 → 产出）</div>
    <svg viewBox="0 0 480 170" style="width:100%">
     <rect x="10" y="20" width="86" height="34" rx="4" class="node"/><text x="53" y="41" text-anchor="middle" class="node-t">外购电力</text>
     <rect x="10" y="66" width="86" height="34" rx="4" class="node"/><text x="53" y="87" text-anchor="middle" class="node-t">天然气/蒸汽</text>
     <rect x="150" y="20" width="92" height="34" rx="4" class="node"/><text x="196" y="41" text-anchor="middle" class="node-t">一次加工工序</text>
     <rect x="150" y="66" width="92" height="34" rx="4" class="node"/><text x="196" y="87" text-anchor="middle" class="node-t">核心工艺环节</text>
     <rect x="150" y="112" width="92" height="34" rx="4" class="node"/><text x="196" y="133" text-anchor="middle" class="node-t">精加工/包装</text>
     <rect x="300" y="60" width="80" height="40" rx="4" class="node"/><text x="340" y="84" text-anchor="middle" class="node-t">成品产出</text>
     <rect x="300" y="112" width="80" height="34" rx="4" fill="rgba(248,113,113,.15)" stroke="#F87171"/><text x="340" y="133" text-anchor="middle" fill="#F87171" font-size="11">排放口监测</text>
     <path class="edge flow" d="M96 37 H 150"/><path class="edge flow" d="M96 83 H 150"/>
     <path class="edge flow" d="M196 54 V 66"/><path class="edge flow" d="M196 100 V 112"/>
     <path class="edge flow" d="M242 79 H 300"/><path class="edge flow" d="M242 129 H 300"/>
    </svg>
    <div class="hint">点击工序节点可联动该工序能耗与碳排数据（演示评分点①：工艺流程图）</div></div>
   <div><div class="sub2">${c.name} · 企业能流图（电 / 热 / 气 / 绿电氢）</div>
    ${entMiniSankey(c.id)}
    <div class="hint">${c.name}四类能源接入路径实时展示，流带宽度对应该企业能源购入结构（演示评分点①：企业能流图）</div></div>
  </div>`);
}

/* ============ ① 驾驶舱增强：核心指标区 + 三维园区 + 能流/碳流 + 信息概览 ============ */
(function(){
 const CORE=[ASSESS[0],ASSESS[2],ASSESS[3],ASSESS[4]];
 const CORE_IDX=[0,2,3,4];
 const INFOS=[
  {ic:"🏢",t:"园区概况",d:"规划面积 12.6km² · 入驻企业 86 家",h:()=>showModal("园区概况专题分析",`<table>${row("规划面积","12.6 km²","四至范围东至黄河大道")}${row("入驻企业","86 家","规上企业 32 家")}${row("主导产业","新材料/装备制造/电子信息","产值占比 71%")}${row("年度工业产值","168 亿元","同比增长 5.2%")}</table><div class="concl"><b>专题结论：</b>园区产业结构持续优化，单位产值能耗连续三年下降，绿色低碳发展指数位居自治区园区前 3。</div>`)},
  {ic:"⚡",t:"供应",d:"电力 9.4亿kWh · 热力 28万GJ",h:()=>showModal("能源供应专题分析",`<table>${row("电网最大供电能力","220 MW","实际最大负荷 186 MW")}${row("燃气年供应","620 万m³","门站压力 1.6MPa")}${row("集中供热","28 万GJ","覆盖 92% 工业企业")}${row("制氢示范站","120 t/年","绿电电解水")}</table><div class="concl"><b>专题结论：</b>供电裕度 15.4%，晚峰时段储能放电覆盖 62%；建议扩容光伏园区至 150MW 以提升绿电自给率。</div>`)},
  {ic:"🔥",t:"消费",d:"综合能耗 18.6万tce · 同比 -4.6%",h:()=>showModal("能源消费专题分析",`<table>${row("电力消费","7.3 亿kWh","占比 48%")}${row("燃气消费","620 万m³","占比 22%")}${row("热力消费","28 万GJ","占比 18%")}${row("油品及其他","1.5 万tce","占比 12%")}</table><div class="concl"><b>专题结论：</b>电气化率提升至 48%，油品消费向物流运输集中；AI 用能策略已推送 8 家企业，预计年节能 2,300 tce。</div>`)},
  {ic:"☁️",t:"碳排放",d:"42.3万tCO₂ · 强度 -8.0%",h:()=>showModal("碳排放专题分析",`<table>${row("范围一 直接排放","16.9 万t","占比 40%")}${row("范围二 间接排放","25.4 万t","占比 60%")}${row("碳排强度","2.53 tCO₂/tce","目标 2.40")}${row("较基准年累计","-17.4%","已达峰回落")}</table><div class="concl"><b>专题结论：</b>园区已进入碳排总量与强度双降通道；范围二占比偏高，扩大绿电直供是下一步降碳核心抓手。</div>`)},
  {ic:"♨️",t:"余能",d:"余热余压利用率 71.2%",h:()=>showModal("余能利用专题分析",`<table>${row("余热余冷余压利用率","71.2%","目标 70% ✔")}${row("可回收余热资源","3.4 万GJ/年","已回收 2.42 万GJ")}${row("数据中心余热供暖","覆盖生活区 12 万m²","云谷数据服务")}${row("空压余热回收","4 家企业改造完成","年节电 320 万kWh")}</table><div class="concl"><b>专题结论：</b>未回收余热集中于精细化工精馏环节（约 0.98 万GJ/年），建议列入 2026 年重点工程（▲AI 诊断 #143 已识别）。</div>`)},
  {ic:"♻️",t:"循环",d:"固废 93.5% · 水重复 91.8%",h:()=>showModal("资源循环专题分析",`<table>${row("工业固废综合利用率","93.5%","目标 92% ✔")}${row("工业用水重复利用率","91.8%","目标 90% ✔")}${row("中水回用","180 万m³/年","市政绿化+工业冷却")}${row("一般固废协同处置","6.2 万t","水泥窑协同")}</table><div class="concl"><b>专题结论：</b>两项循环指标均已达标；建议推动固废分类计量接入平台，实现循环数据自动采集。</div>`)},
  {ic:"🛠",t:"运营运维",d:"设备在线率 98.2% · 工单闭环 91%",h:()=>showModal("运营运维专题分析",`<table>${row("采集设备在线率","98.2%","334 台套")}${row("本月运维工单","28 单","闭环率 91%")}${row("月度远程巡检","8 次","季度现场巡检 2 次")}${row("故障响应","一般 4h / 紧急 2h","SLA 达标 100%")}</table><div class="concl"><b>专题结论：</b>运维体系按 SLA 稳定运行；高压监测终端 HV-008 离线 35 分钟已派单，预计 2h 内到场处理。</div>`)},
  {ic:"🏗",t:"重点项目",d:"在建 4 项 · 年减排 7.1万t",h:()=>showModal("重点项目专题分析",`<table><tr><th>工程</th><th>进度</th><th>碳评价</th></tr><tr><td>园区绿电直供工程</td><td>82%</td><td><span class="tag lv1">A</span></td></tr><tr><td>集中式光伏+储能二期</td><td>45%</td><td><span class="tag lv1">A</span></td></tr><tr><td>园区综合能源站</td><td>60%</td><td><span class="tag lv2">B</span></td></tr><tr><td>企业能碳采集全覆盖（本项目）</td><td>30%</td><td><span class="tag lv1">A</span></td></tr></table><div class="hint">点击「重点工程清单」中任意一行可查看工程详情弹窗（需求 #11）</div>`)},
 ];
 const ISO_BOX=(x,y,h,col,name,id)=>{const w=56,d=40,ox=x,oy=y;
  return `<g onclick="coModal(${id})" style="cursor:pointer"><title>${name}</title>
   <rect x="${ox-w/2}" y="${oy-d/2}" width="${w}" height="${d}" rx="5" fill="${col}" opacity=".88" stroke="#0B1A2E" stroke-width="1.5"/>
   <text x="${ox}" y="${oy-d/2-7}" text-anchor="middle" fill="#8FA8C4" font-size="11">${name}</text></g>`;};
 function flowSvg(mode){return dashFlowChart(mode);}
 window.flowSvg=flowSvg;
 function flowMode(m){document.getElementById("flowBox").innerHTML=flowSvg(m);
  document.querySelectorAll("[data-flowbtn]").forEach(b=>b.classList.toggle("on",b.dataset.flowbtn===m));}
 window.flowMode=flowMode;
 function isoView(v){const el=document.getElementById("isoWorld");if(!el)return;
  el.dataset.view=v;
  isoApply();}
 function isoZoom(zv){const el=document.getElementById("isoWorld");if(!el)return;el.dataset.z=zv;isoApply();}
 function isoApply(){const el=document.getElementById("isoWorld");if(!el)return;
  const stage=el.parentElement;const fit=stage&&stage.clientWidth?Math.min(1,(stage.clientWidth-16)/900):1;
  el.style.transform=`scale(${(fit*(el.dataset.z||100)/100).toFixed(3)})`;}
 window.isoView=isoView;window.isoZoom=isoZoom;window.isoApply=isoApply;
 const CORE_STRIP=`<div class="core-strip">
    ${CORE.map((a,i)=>{const rate=Math.min(a.actual/a.target*100,a.target/a.actual*100);
     return `<div class="core-item" onclick="assessTrend(${CORE_IDX[i]})"><div class="n">${a.name}（${a.unit}）</div>
      <div class="p"><div class="progress ${a.ok?"":"warn"}"><i style="width:${Math.min(rate,100).toFixed(0)}%"></i></div></div>
      <div class="m">目标 ${a.target} · 实际 ${a.actual} · ${a.ok?"✔ 达标":"未达标"} · 点击查看历年趋势</div></div>`;}).join("")}
   </div>`;
 const ISO_CTRL=`<div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap;align-items:center">
    <button class="btn ghost sm iso-btn on" data-iso="a" onclick="isoView('a')">视角 A · 标准</button>
    <button class="btn ghost sm iso-btn" data-iso="b" onclick="isoView('b')">视角 B · 高空旋转</button>
    <button class="btn ghost sm iso-btn" data-iso="c" onclick="isoView('c')">视角 C · 平视</button>
    <span style="margin-left:8px;font-size:12px;color:var(--txt2)">缩放</span>
    <input type="range" min="60" max="150" value="100" style="width:120px;accent-color:#38BDF8" oninput="isoZoom(this.value)">
    <span class="hint" style="margin:0">高度=综合能耗 · 颜色=能效等级 · 点击建筑下钻企业画像</span>
   </div>`;
 const ISO_SVG=`<div class="iso-stage"><div class="iso-world" id="isoWorld" data-view="a" data-z="100">
    <svg viewBox="0 0 860 560" style="width:100%">
     <rect x="20" y="20" width="820" height="520" rx="10" fill="#0E2138" stroke="#1E3A5C" stroke-width="2"/>
     <rect x="20" y="270" width="820" height="26" fill="#13294a"/>
     <rect x="420" y="20" width="26" height="520" fill="#13294a"/>
     <path d="M20 283 H 840" stroke="#1E3A5C" stroke-width="2" stroke-dasharray="14 10"/>
     <path d="M433 20 V 540" stroke="#1E3A5C" stroke-width="2" stroke-dasharray="14 10"/>
     <text x="40" y="298" fill="#3E5C82" font-size="12">京河大道（园区主干道）</text>
     <text x="440" y="44" fill="#3E5C82" font-size="12" transform="rotate(90 440 44)">如意街</text>
     <ellipse cx="700" cy="460" rx="60" ry="40" fill="#1a5a8a" opacity=".8"/>
     <text x="700" y="464" text-anchor="middle" fill="#7FB3D9" font-size="12">中心湖</text>
     <rect x="40" y="40" width="150" height="46" rx="6" fill="rgba(45,212,191,.12)" stroke="#2DD4BF"/>
     <text x="115" y="68" text-anchor="middle" fill="#2DD4BF" font-size="13">新能源产业片区</text>
     <rect x="470" y="40" width="150" height="46" rx="6" fill="rgba(56,189,248,.12)" stroke="#38BDF8"/>
     <text x="545" y="68" text-anchor="middle" fill="#38BDF8" font-size="13">新材料产业片区</text>
     <rect x="40" y="470" width="150" height="46" rx="6" fill="rgba(74,222,128,.12)" stroke="#4ADE80"/>
     <text x="115" y="498" text-anchor="middle" fill="#4ADE80" font-size="13">绿色算力片区</text>
     <rect x="40" y="320" width="120" height="40" rx="6" fill="rgba(251,191,36,.12)" stroke="#FBBF24"/>
     <text x="100" y="345" text-anchor="middle" fill="#FBBF24" font-size="12">医疗健康片区</text>
     ${[[115,160,"#2E8BC0",1],[200,220,"#2DD4BF",2],[320,140,"#FBBF24",3],[320,220,"#FBBF24",4],[500,150,"#2DD4BF",5],[620,200,"#F87171",6],[740,130,"#4ADE80",7],[200,360,"#F87171",8]].map(function(b){var c=COMPANIES.find(function(x){return x.id===b[3];})||{name:""};return ISO_BOX(b[0],b[1],0,b[2],c.name,b[3]);}).join("")}
     <text x="640" y="520" fill="#3E5C82" font-size="12">甘露 330kV 变电站 · 云碳共享储能电站</text>
    </svg></div></div>`;
 /* 全屏大屏布局：顶栏 KPI + 三栏（左·指标与结构 / 中·三维与能碳流 / 右·电力与趋势）+ 底部工程与信息概览 */
 PAGES.dashboard.render=()=>`
  <div class="kpis fs-kpis" style="grid-template-columns:repeat(6,1fr)">
   ${kpi("综合能耗","18.6","万tce","同比下降 4.6%","down ok")}
   ${kpi("碳排放总量","42.3","万tCO₂","同比下降 6.2%","down ok")}
   ${kpi("单位能耗碳排放","2.53","tCO₂/tce","同比下降 8.0%","down ok")}
   ${kpi("清洁能源消费占比","28.4","%","同比 +1.9pct","up ok")}
   ${kpi("绿电消纳率","96.1","%","目标 95%","up ok")}
   ${kpi("重点工程碳绩效","86","分","环比 +2","up ok")}
  </div>
  <div class="fs-grid">
   <div class="fs-col">
    <div class="card"><h3>核心指标区 · 考核指标达标进度 <span class="tag star">演示评分点①</span></h3>${CORE_STRIP}</div>
    <div class="card"><h3>能碳结构 · 用能（上年度）</h3><div class="chart">${donut(Object.entries(PARK.energyMix).map(([k,v])=>({k,v,u:"%"})),150,24)}</div></div>
    <div class="card"><h3>能碳结构 · 碳排（上年度）</h3><div class="chart">${donut(Object.entries(PARK.carbonMix).map(([k,v])=>({k,v,u:"%"})),150,24)}</div></div>
    <div class="card fs-fill"><h3>双控目标完成情况（6 项考核指标）</h3>
     <div class="fs-fill-body"><table>${ASSESS.map(a=>row(a.name,a.actual+" / "+a.target+" "+a.unit,a.ok?"✔ 达标":"▲ 未达标")).join("")}</table></div>
     <div class="concl"><b>结论：</b>6 项指标 4 项达标，单位能耗碳排放、清洁能源消费占比两项待提升，已纳入 2026 年度重点攻坚清单。</div></div>
   </div>
   <div class="fs-col">
    <div class="card"><h3>园区三维实景（产业布局 · 企业位置 · 能碳数据）<span class="tag star">演示评分点①</span></h3>
     ${ISO_CTRL}${ISO_SVG}<div id="isoToolbarSlot"></div></div>
    <div class="card fs-fill"><h3>能流 / 碳流分析 <span class="tag star">演示评分点①</span></h3>
     <div class="fs-fill-body">
     <div style="display:flex;gap:8px;margin-bottom:8px;align-items:center">
      <button class="btn sm on" data-flowbtn="en" onclick="flowMode('en')">能流图</button>
      <button class="btn ghost sm" data-flowbtn="co" onclick="flowMode('co')">碳流图</button>
      <span class="hint" style="margin:0">可切换企业 / 时间维度，点击企业下钻画像</span>
     </div>
     <div id="flowBox">${flowSvg("en")}</div></div></div>
   </div>
   <div class="fs-col">
    <div class="card"><h3>电力结构（年度）</h3><div class="chart">${donut(Object.entries(PARK.powerMix).map(([k,v])=>({k,v,u:"%"})),150,24)}</div></div>
    <div class="card"><h3>能耗趋势（近五年）</h3><div class="chart">${comboBarLine(YEARS,"总能耗(万tce)",PARK.energy,"能耗强度",PARK.energyInt,172,300,"万tce")}</div>
     <div class="concl"><b>结论：</b>总能耗连续 4 年下降，能耗强度累计下降 21.8%。</div></div>
    <div class="card"><h3>碳排趋势（近五年）</h3><div class="chart">${comboBarLine(YEARS,"碳排放(万tCO₂)",PARK.carbon,"碳排强度",PARK.carbonInt,172,300,"万t")}</div>
     <div class="concl"><b>结论：</b>碳排强度降幅 24.2% 大于总量降幅 17.4%，进入总量与强度双降阶段。</div></div>
    <div class="card fs-fill"><h3>重点企业碳排 TOP8 · 能效对标</h3>
     <div class="fs-fill-body"><table>${COMPANIES.slice().sort((a,b)=>b.co-a.co).map(c=>row(c.name,c.co.toFixed(1)+" 万tCO₂",c.eg+" 级能效 · 累计 -"+c.red+"%")).join("")}</table></div>
     <div class="concl"><b>结论：</b>TOP5 企业碳排合计占园区 68.3%，能效 C 级企业已列为节能诊断与改造优先对象。</div></div>
   </div>
  </div>
  <div class="grid g2" style="margin-top:12px">
   <div class="card"><h3>月度电量堆叠（本年度）</h3>
    <div class="chart">${stackedBar(["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],Object.entries(PARK.monthPower).map(([k,v],i)=>({name:k,color:PALETTE[i%8],data:v})),210,660)}</div></div>
   <div class="card"><h3>重点工程清单</h3>
    <table><tr><th>工程名称</th><th>建设主体</th><th>投资(万元)</th><th>进度</th><th>碳评价</th></tr>
    <tr onclick="projModal(1)" style="cursor:pointer"><td>园区绿电直供工程</td><td>绿洲光伏电力</td><td>12,400</td><td>82%</td><td><span class="tag lv1">A</span></td></tr>
    <tr onclick="projModal(2)" style="cursor:pointer"><td>集中式光伏+储能二期</td><td>绿洲光伏电力</td><td>45,000</td><td>45%</td><td><span class="tag lv1">A</span></td></tr>
    <tr onclick="projModal(3)" style="cursor:pointer"><td>园区综合能源站</td><td>管委会经发部</td><td>8,600</td><td>60%</td><td><span class="tag lv2">B</span></td></tr>
    <tr onclick="projModal(4)" style="cursor:pointer"><td>企业能碳采集全覆盖（本项目）</td><td>中标方+8家企业</td><td>600</td><td>30%</td><td><span class="tag lv1">A</span></td></tr>
    <tr><td>全钒液流长时储能示范</td><td>云碳共享储能</td><td>6,800</td><td>55%</td><td><span class="tag lv1">A</span></td></tr>
    <tr><td>数据中心余热回收供暖</td><td>云谷数据服务</td><td>3,200</td><td>70%</td><td><span class="tag lv2">B</span></td></tr>
    <tr><td>虚拟电厂聚合调控平台</td><td>电通物联科技</td><td>1,900</td><td>40%</td><td><span class="tag lv1">A</span></td></tr>
    </table>
    <div class="concl"><b>工程概览：</b>在建重点工程 7 项，总投资 7.85 亿元，全部建成后预计年减排 8.6 万 tCO₂；点击表格行可查看工程详情弹窗。</div></div>
  </div>
  <div class="card" style="margin-top:12px"><h3>信息概览区（点击卡片打开专题分析）<span class="tag star">演示评分点①</span></h3>
   <div class="grid g4">${INFOS.map((f,i)=>`<div class="info-card" onclick="INFOS[${i}].h()"><span class="ic">${f.ic}</span><div class="t">${f.t}</div><div class="d">${f.d}</div></div>`).join("")}</div></div>`;
 window.INFOS=INFOS;
})();

/* ============ ② 一张图增强：街道/园区维度划分筛选 ============ */
OM.dist="all";
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
<div class="card"><h3>瓦片地图 · 按街道/园区维度划分企业（要素联动）<span class="tag star">演示评分点②</span></h3><span class="req-badge">#20 #21 #22 #23</span>
 <div style="display:flex;gap:10px;margin-bottom:10px;flex-wrap:wrap;align-items:center">
  <select id="omFactor" onchange="omRefresh()">
   <option value="en">能源消费</option><option value="co">碳排放</option><option value="cl">清洁能源</option><option value="gl">绿色低碳成就</option>
  </select>
  <select id="omDist" onchange="omRefresh()"><option value="all">全部片区</option><option>如意街街道</option><option>京河大道街道</option><option>光伏产业园片区</option><option>综合产业社区</option></select>
  <input type="text" id="omSearch" placeholder="企业搜索（需求 #20）" style="width:200px" oninput="omRefresh()">
  <button class="btn ghost sm" onclick="omRefresh()">查询</button>
  <span style="margin-left:auto;font-size:12px;color:var(--txt2)">当前要素：<b id="omFactorName" style="color:var(--cyan)">能源消费</b></span>
 </div>
 ${renderMap("onemap")}
 <div class="yearbar">
  <button class="btn sm" id="omPlay" onclick="omTogglePlay()">▶ 播放</button>
  <select id="omGran" onchange="omGranChange()"><option value="y">按年度</option><option value="q">按季度</option><option value="m">按月度</option></select>
  <select id="omPeriod" onchange="omPeriodChange()"></select>
  <span class="y" id="omYearLabel">2025年</span>
  <span style="font-size:11px;color:var(--txt3)">日期切换（年/季/月）· 自动播放联动地图、指标与企业排序（需求 #23）</span>
 </div></div>
<div class="card"><h3>企业数据排序（当前要素，支持按能耗量/碳排量排序）</h3><span class="req-badge">#24</span><div id="omRank"></div></div>
${pageHint("本页覆盖需求 #16–#24：四类全数据要素 / 街道·园区维度划分 / 企业搜索 / 要素数据展示 / 点位下钻 / 年份进度条播放 / 企业数据排序。▲#17 为重要参数，须系统截图佐证。")}`);
function omRefresh(){
 omMapInit();
 const sel=document.getElementById("omFactor");if(sel)OM.factor=sel.value;
 const ds=document.getElementById("omDist");if(ds)OM.dist=ds.value;
 const nm={en:"能源消费",co:"碳排放",cl:"清洁能源",gl:"绿色低碳成就"}[OM.factor];
 const el=document.getElementById("omFactorName");if(el)el.textContent=nm;
 renderMapDots("onemap",(document.getElementById("omSearch")||{}).value||"");
 omZoomApply();
 const idx=YEARS.indexOf(OM.year);
 const pf=omPeriodFactor();
 const per=omPeriodName();
 const kpiT=document.getElementById("omKpi");
 if(kpiT)kpiT.innerHTML=
  row("综合能耗量 · "+per,(PARK.energy[idx]*pf).toFixed(2),"万tce")+
  row("碳排放总量 · "+per,(PARK.carbon[idx]*pf).toFixed(2),"万tCO₂")+
  row("单位能耗碳排放 · "+per,(PARK.carbonInt[idx]||2.53).toFixed(2),"tCO₂/tce")+
  row("消纳率 · "+per,"96.1","%");
 const key=OM.factor==="co"?"co5":OM.factor==="en"?"en5":null;
 let list=COMPANIES.filter(c=>OM.dist==="all"||c.dist===OM.dist);
 let items=list.map(c=>({k:c.name,v:key?+((key==="co"?c.co5:c.en5)[idx]*pf).toFixed(2):(OM.factor==="cl"?Math.round(c.asset/300*pf):Math.round(c.asset/500))}));
 const q=(document.getElementById("omSearch")||{}).value;
 if(q)items=items.filter(i=>i.k.includes(q.trim()));
 items.sort((a,b)=>b.v-a.v);
 const box=document.getElementById("omRank");
 if(box)box.innerHTML=hBar(items.slice(0,8),240,660,OM.factor==="co"?" 万tCO₂":OM.factor==="en"?" 万tce":OM.factor==="cl"?" 万kWh":" 分",(it,i)=>PALETTE[i%8]);
}

/* ============ 日期切换（年/季/月）+ 地图缩放引擎 ============ */
const MONTHS=["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
const QF=[0.92,1.0,1.12,0.96],MF=[1.06,0.98,0.94,0.9,0.94,1.02,1.1,1.12,0.95,0.9,0.95,1.14];
OM.gran="y";OM.quarter=4;OM.month=11;OM.vb={x:0,y:0,w:1000,h:560};
function omPeriodFactor(){return OM.gran==="y"?1:OM.gran==="q"?QF[OM.quarter-1]/4:MF[OM.month-1]/12;}
function omPeriodName(){return OM.gran==="y"?OM.year+"年":OM.gran==="q"?OM.year+"年Q"+OM.quarter:OM.year+"年"+MONTHS[OM.month-1];}
function omPeriodKey(){return OM.gran==="y"?String(OM.year):OM.gran==="q"?OM.year+"-"+OM.quarter:OM.year+"-"+OM.month;}
function omPeriodSeq(){return YEARS.flatMap(y=>OM.gran==="y"?[String(y)]:OM.gran==="q"?[1,2,3,4].map(q=>y+"-"+q):MONTHS.map((_,mi)=>y+"-"+(mi+1)));}
function omFillPeriods(){
 const p=document.getElementById("omPeriod");if(!p)return;
 p.innerHTML=omPeriodSeq().map(v=>{const parts=String(v).split("-");
  const label=OM.gran==="y"?parts[0]+"年":OM.gran==="q"?parts[0]+"年 第"+parts[1]+"季度":parts[0]+"年"+MONTHS[+parts[1]-1];
  return `<option value="${v}" ${v===omPeriodKey()?"selected":""}>${label}</option>`;}).join("");
}
function omGranChange(){OM.gran=document.getElementById("omGran").value;omFillPeriods();omPeriodChange();}
function omPeriodChange(){
 const v=(document.getElementById("omPeriod")||{}).value||"2025";
 const parts=String(v).split("-");
 OM.year=+parts[0];
 if(parts[1]){if(OM.gran==="q")OM.quarter=+parts[1];else OM.month=+parts[1];}
 const lb=document.getElementById("omYearLabel");if(lb)lb.textContent=omPeriodName();
 omRefresh();
}
function omGranInit(){const g=document.getElementById("omGran");if(g)g.value=OM.gran;omFillPeriods();const lb=document.getElementById("omYearLabel");if(lb)lb.textContent=omPeriodName();omRefresh();}
function omSetYear(y){/* 兼容旧接口：已由日期切换（年/季/月）替代 */}
function omTogglePlay(){
 if(OM.playing){clearInterval(OM.playing);OM.playing=null;const b=document.getElementById("omPlay");if(b)b.textContent="▶ 播放";return;}
 const b=document.getElementById("omPlay");if(b)b.textContent="⏸ 暂停";
 const seq=omPeriodSeq();let i=seq.indexOf(omPeriodKey());
 OM.playing=setInterval(()=>{
  i=(i+1)%seq.length;
  const p=document.getElementById("omPeriod");if(p)p.value=seq[i];
  omPeriodChange();
  if(i===seq.length-1){clearInterval(OM.playing);OM.playing=null;const bb=document.getElementById("omPlay");if(bb)bb.textContent="▶ 播放";}
 },1000);
}
function omZoomApply(){const s=document.querySelector(".map-svg");if(s)s.setAttribute("viewBox",`${OM.vb.x} ${OM.vb.y} ${OM.vb.w} ${OM.vb.h}`);}
function omSetVb(x,y,w,h){
 w=Math.max(250,Math.min(1000,w));h=w*0.56;
 x=Math.max(0,Math.min(1000-w,x));y=Math.max(0,Math.min(560-h,y));
 OM.vb={x,y,w,h};omZoomApply();
}
function omZoomAt(f){const vb=OM.vb;if((vb.w>=1000&&f>1)||(vb.w<=250&&f<1))return;omSetVb(vb.x+vb.w*(1-f)/2,vb.y+vb.h*(1-f)/2,vb.w*f,vb.h*f);}
function omZoomReset(){omSetVb(0,0,1000,560);}
function omMapInit(){
 if(OM.mapInit)return;OM.mapInit=true;
 document.addEventListener("wheel",e=>{const s=e.target.closest?e.target.closest(".map-svg"):null;if(!s||!s.closest("#pg-oneMap"))return;e.preventDefault();omZoomAt(e.deltaY>0?1.25:0.8);},{passive:false});
 let drag=null;
 document.addEventListener("mousedown",e=>{const s=e.target.closest?e.target.closest(".map-svg"):null;if(!s||!s.closest("#pg-oneMap"))return;drag={x:e.clientX,y:e.clientY,vb:{...OM.vb},moved:false};});
 document.addEventListener("mousemove",e=>{if(!drag)return;const s=document.querySelector(".map-svg");if(!s)return;
  const r=s.getBoundingClientRect();
  const dx=(e.clientX-drag.x)/r.width*drag.vb.w,dy=(e.clientY-drag.y)/r.height*drag.vb.h;
  if(Math.abs(e.clientX-drag.x)+Math.abs(e.clientY-drag.y)>5)drag.moved=true;
  omSetVb(drag.vb.x-dx,drag.vb.y-dy,drag.vb.w,drag.vb.h);});
 document.addEventListener("mouseup",()=>{if(drag&&drag.moved)OM.dragMoved=true;drag=null;});
 document.addEventListener("click",e=>{if(OM.dragMoved){e.stopPropagation();e.preventDefault();OM.dragMoved=false;}},true);
}

/* ============ ③ 多维分析增强 ============ */
const M1D={
 y:{labels:YEARS.map(String),en:PARK.energy,int:PARK.energyInt,co:PARK.carbon,cint:PARK.carbonInt,
    ind:{en:[8.2,4.8,3.1,4.1,1.4],co:[14.6,8.6,5.6,8.1,5.4]}},
 q:{labels:["Q1","Q2","Q3","Q4"],en:[4.9,4.6,4.5,4.6],int:[1.16,1.10,1.08,1.06],co:[11.2,10.6,10.2,10.3],cint:[2.66,2.51,2.42,2.38],
    ind:{en:[2.1,1.2,0.8,1.0,0.4],co:[3.7,2.2,1.4,1.9,1.0]}},
 m:{labels:["6月","7月","8月","9月","10月"],en:[1.52,1.55,1.49,1.42,1.38],int:[1.14,1.12,1.09,1.06,1.03],co:[3.6,3.7,3.5,3.3,3.2],cint:[2.70,2.62,2.50,2.40,2.31],
    ind:{en:[0.62,0.38,0.26,0.34,0.12],co:[1.18,0.70,0.44,0.66,0.30]}}};
let m1Metric="en",m1Cycle="y",m1Dim="区域维度",m1PieTab="en";
RENDERERS.m1=()=>`
 <div style="display:flex;gap:10px;margin-bottom:10px;flex-wrap:wrap;align-items:center">
  <button class="btn sm ${m1Metric==="en"?"":"ghost"}" data-m1="en" onclick="m1Set('metric','en')">能耗</button>
  <button class="btn sm ${m1Metric==="co"?"":"ghost"}" data-m1="co" onclick="m1Set('metric','co')">碳排</button>
  <select onchange="m1Set('cycle',this.value)"><option value="y">年度</option><option value="q">季度</option><option value="m">月度</option></select>
  <select onchange="m1Set('dim',this.value)"><option>区域维度</option><option>产业维度</option><option>企业维度</option></select>
 </div>
 <div class="grid g2"><div><div class="sub2" id="m1t"></div><div id="m1Chart"></div></div>
 <div><div class="sub2">趋势结论及原因分析</div><div class="concl" id="m1c" style="min-height:170px;font-size:13.5px;line-height:2.05"></div>
  <div class="concl" id="m1c2" style="min-height:170px;font-size:13.5px;line-height:2.05;margin-top:10px"></div></div></div>
 <div style="display:flex;gap:8px;margin-top:14px;align-items:center">
  <button class="btn sm ${m1PieTab==="en"?"":"ghost"}" data-m1p="en" onclick="m1Set('pie','en')">能耗结构占比</button>
  <button class="btn sm ${m1PieTab==="co"?"":"ghost"}" data-m1p="co" onclick="m1Set('pie','co')">碳排结构占比</button>
  <span class="hint" style="margin-left:8px">随所选年份联动 · 悬停查看各品种明细</span>
 </div>
 <div class="grid g2" style="margin-top:8px">
  <div><div class="sub2" id="m1PieT"></div><div id="m1PieWrap"></div></div>
  <div><div class="sub2">结构解读</div><div class="concl" id="m1PieNote" style="min-height:200px;font-size:13.5px;line-height:2.05"></div></div>
 </div>`;
/* 按所选年份生成能耗/碳排品种结构（确定性年份修正：油品逐年退出、电力/热力占比缓升） */
function m1PieData(metric){
 const yi=(typeof OM!=="undefined"&&OM.year&&YEARS.indexOf(OM.year)>=0)?YEARS.indexOf(OM.year):4;
 if(metric==="en"){
  const mix={电力:48,燃气:22,热力:18,油品:8,其他:4};
  mix.油品=Math.max(3,+(mix.油品-0.9*yi).toFixed(1));mix.电力=+(mix.电力+0.6*yi).toFixed(1);mix.热力=+(mix.热力+0.3*yi).toFixed(1);
  const tot=PARK.energy[yi];
  const arr=Object.entries(mix).map(([k,v])=>({k,v:+(tot*v/100).toFixed(2),u:" 万tce"}));
  arr[arr.length-1].v=+(tot-arr.slice(0,-1).reduce((s,x)=>s+x.v,0)).toFixed(2); /* 末项吸收舍入误差，合计严格等于园区总量 */
  return arr;
 }
 const mix={电力:52,燃气:19,热力:16,油品:9,其他:4};
 mix.油品=Math.max(3,+(mix.油品-0.8*yi).toFixed(1));mix.电力=+(mix.电力+0.8*yi).toFixed(1);
 const tot=PARK.carbon[yi];
 const arr=Object.entries(mix).map(([k,v])=>({k,v:+(tot*v/100).toFixed(2),u:" 万tCO₂"}));
 arr[arr.length-1].v=+(tot-arr.slice(0,-1).reduce((s,x)=>s+x.v,0)).toFixed(2);
 return arr;
}
/* 结构解读：随饼图页签动态生成，与趋势结论共用同一套台账口径 */
function m1PieNote(pd,tab){
 const tot=pd.reduce((s,x)=>s+x.v,0);
 const pct=v=>(v/tot*100).toFixed(1);
 const sorted=[...pd].sort((a,b)=>b.v-a.v),top=sorted[0],second=sorted[1];
 if(tab==="en"){
  const oil=pd.find(x=>x.k==="油品");
  return `① 主导品种为${top.k}，占比 ${pct(top.v)}%（${top.v} 万tce），其次为${second.k}（${pct(second.v)}%），品种集中度较高，电力侧节能与绿电替代对总量影响显著；
② 油品占比仅 ${pct(oil.v)}% 且逐年收缩，高碳燃料退出节奏与园区零碳路径规划一致，工艺电气化仍有推进空间；
③ 电力品种中绿电合计占比约 28.4%，扩大绿电聚合采购与分布式光伏规模，是压降单位能耗碳排因子的首要抓手；
④ 本页签与「碳排结构占比」页签共用同一套能源台账，切换可对照查看；分品种合计严格等于园区综合能耗（18.6 万tce）与碳排放总量（42.3 万tCO₂），口径一致、可直接用于年度评价与考核。`;
 }
 const pow=pd.find(x=>x.k==="电力"),gas=pd.find(x=>x.k==="燃气"),heat=pd.find(x=>x.k==="热力");
 return `① 外购电力对应间接排放（范围二）占比 ${pct(pow.v)}%（${pow.v} 万tCO₂），为园区第一大排放来源，减排重心应放在绿电替代与电力结构优化上；
② 燃气（${pct(gas.v)}%）与热力（${pct(heat.v)}%）构成范围一直接排放的主体，蒸汽管网保温与熔盐储热移峰是下阶段直接排放治理重点；
③ 油品对应排放占比 ${pct(pd.find(x=>x.k==="油品").v)}% 且逐年下降，燃气替代油品已取得实效，危化品企业工艺电气化可进一步压缩尾部高碳品种；
④ 本图口径与碳考核评价体系一致（排放因子统一版本管理），各品种合计等于园区碳排放总量 42.3 万tCO₂，可直接支撑年度评价与报告编制。`;
}
function m1Set(k,v){
 const cycled=k==="cycle"?v:m1Cycle,dim=k==="dim"?v:m1Dim;
 if(k==="metric"){m1Metric=v;}
 if(k==="cycle"){m1Cycle=cycled;}
 if(k==="dim"){m1Dim=dim;}
 if(k==="pie"){m1PieTab=v;}
 document.querySelectorAll("[data-m1]").forEach(b=>b.classList.toggle("ghost",b.dataset.m1!==m1Metric));
 document.querySelectorAll("[data-m1p]").forEach(b=>b.classList.toggle("ghost",b.dataset.m1p!==m1PieTab));
 m1Update();}
function m1Update(){
 const d=M1D[m1Cycle],nm={en:"能耗",co:"碳排"}[m1Metric],mu={en:"万tce",co:"万tCO₂"}[m1Metric];
 const pw=document.getElementById("m1PieWrap");
 if(pw){
  document.querySelectorAll("[data-m1p]").forEach(b=>b.classList.toggle("ghost",b.dataset.m1p!==m1PieTab));
  const pd=m1PieData(m1PieTab);
  const pt=document.getElementById("m1PieT");
  if(pt)pt.textContent=(m1PieTab==="en"?"能耗":"碳排")+"结构占比（"+{en:"万tce",co:"万tCO₂"}[m1PieTab]+" · 随所选年份联动）";
  pw.innerHTML=`<div style="max-width:380px;margin:0 auto">${donut(pd,250,28)}</div>`;
  const pn=document.getElementById("m1PieNote");
  if(pn)pn.innerHTML=m1PieNote(pd,m1PieTab);
 }
 const chart=document.getElementById("m1Chart");if(!chart)return;
 const metricData=m1Metric==="en"?d.en:d.co,intData=m1Metric==="en"?d.int:d.cint;
 if(m1Dim.startsWith("区域")){
  document.getElementById("m1t").textContent=`区域${nm}趋势（${{y:"年度",q:"季度",m:"月度"}[m1Cycle]}）`;
  chart.innerHTML=comboBarLine(d.labels,nm+"("+mu+")",metricData,mu==="万tce"?"能耗强度":"碳排强度",intData,250,560,mu,"")+
   stackedBar(d.labels,Object.entries(PARK.monthPower).map(([k,v],i)=>({name:k,color:PALETTE[i%8],data:v.slice(0,d.labels.length).map(x=>+(x*1.05).toFixed(2))})),180,560);
  const mFirst=metricData[0],mLast=metricData[metricData.length-1],mPct=(((mLast-mFirst)/mFirst)*100).toFixed(1);
  const iFirst=intData[0],iLast=intData[intData.length-1],iPct=(((iLast-iFirst)/iFirst)*100).toFixed(1);
  const coFirst=PARK.carbon[0],coLast=PARK.carbon[4],enFirst=PARK.energy[0],enLast=PARK.energy[4];
  document.getElementById("m1c").innerHTML=`<b>趋势结论：</b>
① 总量与强度双降：所选周期内区域${nm}累计下降 ${Math.abs(mPct)}%（${mFirst}→${mLast} ${mu}），${mu==="万tce"?"能耗强度":"碳排强度"}由 ${iFirst} 降至 ${iLast}，累计下降 ${Math.abs(iPct)}%，且降幅逐期扩大、进入加速下降通道；
② 能源结构持续优化：电力占比稳定在 48% 左右，绿电合计占比提升至 28.4%（较基期 +3.5pct），油品占比降至 8% 以下，高碳燃料加速退出；
③ 碳排降幅（${Math.abs(((coLast-coFirst)/coFirst)*100).toFixed(1)}%）大于能耗降幅（${Math.abs(((enLast-enFirst)/enFirst)*100).toFixed(1)}%），单位能耗碳排因子同步下降约 3.2%，园区处于「结构减排主导、总量与强度双降」的良性通道，按当前斜率外推可提前完成年度双控目标。`;
  document.getElementById("m1c2").innerHTML=`<b>原因分析：</b>
① 结构减排（贡献约 55%）：外购绿电聚合交易与分布式光伏并网规模扩大，绿电占比提升直接压降电力碳排因子；燃气替代油品减少高碳燃料使用，对应结构占比页签中油品占比逐年收缩；
② 工程减排（贡献约 30%）：装备制造电炉感应加热改造、数据中心液冷改造（PUE 降至 1.31）、10℃ 低温余热浓缩、空压站 AI 智控（行业标杆节能率 30%+）等先进技术陆续投运，形成累计节能能力约 2.1 万tce/年；
③ 管理减排（贡献约 15%）：能耗预算分级管理、三级计量补装与碳考核制度落地，消除跑冒滴漏与无效用能；
④ 后续关注：热力占比稳中有升，蒸汽管网保温与熔盐储热移峰填谷是下阶段结构优化重点；油品退出节奏可结合危化品企业工艺电气化进一步加快。`;
 }else if(m1Dim.startsWith("产业")){
  document.getElementById("m1t").textContent=`产业维度${nm}趋势`;
  const inds=["新材料","装备制造","食品加工","数据服务","其他"];
  chart.innerHTML=stackedBar(d.labels,inds.map((n,i)=>({name:n,color:PALETTE[i%8],data:d.ind[m1Metric].map(v=>+(v*(1-i*0.08)).toFixed(2))})),250,560)+
   lineChart(d.labels,[{name:"产业${nm}变化率(%)".replace("${nm}",nm),color:"#FBBF24",data:d.labels.map((_,i)=>i?+(((metricData[i]-metricData[i-1])/metricData[i-1])*100).toFixed(1):0)}],160,560);
  document.getElementById("m1c").innerHTML=`<b>趋势结论（产业维度）：</b>
① 新材料、数据服务两大产业${nm}双降且降幅扩大，合计贡献园区降幅的 60% 以上，是园区「双降」的主引擎；
② 食品加工产业受产能恢复影响，本期降幅收窄至 4.2%，需防范产量反弹带动能耗回升；
③ 产业间能耗强度梯度明显：数据服务最低、食品加工最高（约 2.3 倍差距），产业结构性优化空间仍存；
④ 结合碳排结构饼图，各产业碳排差异主要来自外购电力占比与工艺燃料结构，新材料产业工艺过程排放占比偏高，是下阶段电气化改造重点。`;
  document.getElementById("m1c2").innerHTML=`<b>原因分析：</b>
① 新材料产业降幅最大：10℃ 低温余热浓缩装置投产叠加空压站 AI 智控改造，单元产品综合能耗下降 9.6%；
② 数据服务产业受液冷改造与绿电聚合采购双重驱动，PUE 降至 1.31、绿电占比 35%，碳排降幅大于能耗降幅；
③ 食品加工产业当前以管理节能为主、技改项目尚在建设期，建议将分布式光伏建设与园区共享储能接入提前至下一年度一季度，并对冷库系统实施变频 + 水蓄冷改造；
④ 产业口径与园区统计口径一致（片区归属字段统一版本管理），本结论可直接用于产业考核与年度研判材料。`;
 }else{
  document.getElementById("m1t").textContent=`企业维度${nm}排序趋势`;
  const key=m1Metric==="en"?"en5":"co5";
  chart.innerHTML=hBar(COMPANIES.map(c=>({k:c.name,v:+c[key][YEARS.indexOf(OM.year>=2025?4:YEARS.indexOf(OM.year))<0?4:4].toFixed?+c[key][4].toFixed(1):c[key][4]})).sort((a,b)=>b.v-a.v),240,560," "+mu,(it,i)=>PALETTE[i%8]);
  document.getElementById("m1c").innerHTML=`<b>趋势结论（企业维度）：</b>
① 头部企业近五年${nm}累计下降约 18%，2024 年起进入加速下降通道，与余热浓缩、液冷、AI 智控等节能改造投运时点吻合；
② 尾部企业降幅不足 5%，与头部企业差距扩大至 13pct，园区内企业能效分化加剧；
③ ${nm} Top3 企业合计占园区总量的 42%，其走势主导园区整体曲线，是「一企一策」管控的关键对象；
④ 能效 A 级企业占比由 25% 提升至 50%，C 级企业全部进入改造清单，梯队结构持续改善。`;
  document.getElementById("m1c2").innerHTML=`<b>原因分析：</b>
① 头部企业节能改造陆续投运（低温余热浓缩、液冷改造、空压站 AI 智控等先进技术），叠加绿电采购占比提升，双轮驱动降幅扩大；
② 尾部企业（如黄河生物医药）技改项目仍在实施期、计量基础薄弱，短期降幅有限；
③ 措施建议：将尾部企业纳入 AI 节能诊断重点对象，诊断结果（节能潜力、整改建议、预期收益）推送企业并纳入园区减排措施跟踪；对连续两期无改善企业启动帮扶指导与考核约谈，形成「监测—诊断—整改—考核」闭环。`;
 }}
RENDERERS.m2=()=>`
 <div style="display:flex;gap:10px;margin-bottom:10px;flex-wrap:wrap;align-items:center">
  <select id="m2Type" onchange="m2Update()"><option value="en">能耗量</option><option value="co">碳排量</option></select>
  <select id="m2Year" onchange="m2Update()">${YEARS.map(y=>`<option ${y===2025?"selected":""}>${y}</option>`).join("")}</select>
  <button class="btn sm" data-m2v="val" onclick="m2View('val')">数值</button>
  <button class="btn ghost sm" data-m2v="pct" onclick="m2View('pct')">占比</button>
  <button class="btn ghost sm" data-m2v="yoy" onclick="m2View('yoy')">同比</button>
 </div>
 <div class="grid g2"><div id="m2Table"></div><div id="m2Chart"></div></div>`;
const M2BASE={en:{"电力":8.9,"燃气":4.1,"热力":3.3,"油品":1.5,"煤品":0.8},co:{"电力":22.0,"燃气":8.0,"热力":6.8,"油品":3.8,"煤品":1.7}};
const M2YOY={en:{"电力":-3.2,"燃气":-1.8,"热力":-6.9,"油品":-8.1,"煤品":-12.0},co:{"电力":-5.1,"燃气":-2.0,"热力":-6.9,"油品":1.2,"煤品":-12.0}};
const M2F={2021:1.22,2022:1.16,2023:1.08,2024:1.03,2025:1.0};
let m2ViewKey="val";
function m2View(v){m2ViewKey=v;document.querySelectorAll("[data-m2v]").forEach(b=>{const on=b.dataset.m2v===v;b.classList.toggle("ghost",!on);b.classList.toggle("on",on);});m2Update();}
function m2Update(){
 const ty=document.getElementById("m2Type");if(!ty)return;
 const t=ty.value,y=+document.getElementById("m2Year").value;
 const f=M2F[y],mu=t==="en"?"万tce":"万tCO₂";
 const rows=Object.keys(M2BASE[t]).map(k=>({k,v:+(M2BASE[t][k]*f).toFixed(1),yoy:M2YOY[t][k]}));
 const total=rows.reduce((s,r)=>s+r.v,0);
 document.getElementById("m2Table").innerHTML=
  `<table><tr><th>能源类型</th><th>${mu==="万tce"?"能耗":"碳排"}(万)</th><th>占比</th><th>同比</th></tr>
  ${rows.map(r=>`<tr><td>${r.k}</td><td style="color:${lc("#fff","#0B4E8F")};font-family:Consolas">${r.v}</td>
   <td style="${m2ViewKey==="pct"?'color:'+lc("#7DD3FC","#0B6EC5")+';font-weight:700':""}">${(r.v/total*100).toFixed(1)}%</td>
   <td class="${r.yoy<0?"down":"bad"}" style="${m2ViewKey==="yoy"?"font-weight:700":""}">${r.yoy>0?"+":""}${r.yoy}%</td></tr>`).join("")}</table>
  <div class="concl"><b>分析：</b>${t==="en"?"煤品压减与热力优化贡献主要能耗降幅；":"油品碳排逆势上升，集中于精细化工运输环节，建议纳入下年度告警阈值管理。"}</div>`;
 const ch=document.getElementById("m2Chart");
 if(m2ViewKey==="pct")ch.innerHTML=donut(rows.map(r=>({k:r.k,v:r.v,u:" "+mu})),180,24);
 else if(m2ViewKey==="yoy")ch.innerHTML=hBar(rows.map(r=>({k:r.k,v:r.yoy})),200,520," %",r=>r.v<0?"#4ADE80":"#F87171");
 else ch.innerHTML=hBar(rows.map(r=>({k:r.k,v:r.v})),200,520," "+mu,(r,i)=>PALETTE[i%8]);
}
RENDERERS.m4=()=>`
 <div style="display:flex;gap:10px;margin-bottom:10px;align-items:center">
  <select onchange="m4Update(this.value)"><option value="co">按碳排量排序</option><option value="en">按能耗量排序</option></select>
 </div>
 <div class="grid g2">
  <div id="m4Chart"></div>
  <div><div class="sub2">碳资产 / 减碳量排序 <span class="req-badge" style="position:static">#39 #40</span></div>
   <div class="chart">${hBar(COMPANIES.map(c=>({k:c.name,v:c.asset})).sort((a,b)=>b.v-a.v),150,560," 万元",(it,i)=>"#2DD4BF")}</div>
   <div class="concl"><b>结论分析：</b>减碳量按同产品类别对标排序，新材料与数据服务企业减碳强度领先；黄河生物医药减碳率仅 10%，建议列入重点帮扶清单。</div></div>
 </div>`;
function m4Update(k){
 const box=document.getElementById("m4Chart");if(!box)return;
 const key=k==="en"?"en":"co";
 box.innerHTML=`<div class="sub2">企业${k==="en"?"能耗":"碳排放"}排序<span class="req-badge" style="position:static">#38</span></div>`+
  hBar(COMPANIES.map(c=>({k:c.name,v:c[key]})).sort((a,b)=>b.v-a.v),240,560,k==="en"?" 万tce":" 万tCO₂",(it,i)=>PALETTE[i%8]);
}

/* ============ ④ 报告增强：时间戳 + 真实下载 Word/PDF ============ */
/* 时间戳多级独立选择：粒度（年/季/月/小时）+ 年份 + 季度/月份/日期/小时，组合成完整报告时间戳 */
const RPT_TS_STATE={g:"y",y:2025,q:4,m:11,d:10,h:6};
function rptTsStr(){
 const s=RPT_TS_STATE;
 if(s.g==="y")return `${s.y} 年度 · 汇总时间戳 ${s.y}-12-31 24:00（年度自动汇总）`;
 if(s.g==="q")return `${s.y} 年 Q${s.q} · 汇总时间戳 ${s.y}-${String(s.q*3).padStart(2,"0")}-30 06:00（季度汇总）`;
 if(s.g==="m")return `${s.y} 年 ${s.m} 月 · 汇总时间戳 ${s.y}-${String(s.m).padStart(2,"0")}-28 06:00（月度汇总）`;
 return `${s.y} 年 ${s.m} 月 ${s.d} 日 ${String(s.h).padStart(2,"0")}:00（小时级实时快照）`;
}
/* arr 元素可为 [值, 显示文本] 或单值；option 的 value 恒为纯值，保证 rptTsSet 解析稳定 */
function rptTsSel(key,arr,cur){return `<select title="报告时间戳 · ${key}" onchange="rptTsSet('${key}',this.value)">${arr.map(it=>{const v=Array.isArray(it)?it[0]:it,lb=Array.isArray(it)?it[1]:it;return `<option value="${v}" ${String(v)===String(cur)?"selected":""}>${lb}</option>`;}).join("")}</select>`;}
function rptTsBoxHtml(){
 const s=RPT_TS_STATE;
 let h=`<span style="font-size:12px;color:var(--txt2);font-weight:600">时间戳</span>`
  +rptTsSel("g",[["年度","年度"],["季度","季度"],["月度","月度"],["小时","小时"]],({"y":"年度","q":"季度","m":"月度","h":"小时"})[s.g])
  +rptTsSel("y",[2021,2022,2023,2024,2025].map(v=>[v,v+" 年"]),s.y);
 if(s.g==="q")h+=rptTsSel("q",[1,2,3,4].map(v=>[v,"Q"+v]),s.q);
 if(s.g==="m"||s.g==="h")h+=rptTsSel("m",[1,2,3,4,5,6,7,8,9,10,11,12].map(v=>[v,v+" 月"]),s.m);
 if(s.g==="h")h+=rptTsSel("d",[1,5,10,15,20,25,28].map(v=>[v,v+" 日"]),s.d)
  +rptTsSel("h",Array.from({length:24},(_,i)=>[i,String(i).padStart(2,"0")+" 时"]),s.h);
 return h;
}
function rptTsSet(k,v){
 const s=RPT_TS_STATE;
 if(k==="g"){s.g=({"年度":"y","季度":"q","月度":"m","小时":"h"})[v]||s.g;}
 else if(k==="y")s.y=+v;else if(k==="q")s.q=+v;else if(k==="m")s.m=+v;else if(k==="d")s.d=+v;else if(k==="h")s.h=+v;
 const box=document.getElementById("rptTsBox");if(box)box.innerHTML=rptTsBoxHtml();
 const show=document.getElementById("rptTsShow");if(show)show.textContent="报告时间戳："+rptTsStr();
}
reg("report",()=>`
<div class="card">
 <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;flex-wrap:wrap">
  <h3 style="margin:0">碳排放报告 <span class="tag star">▲ #65 #66</span></h3><span class="req-badge">#59–#66</span>
  <div style="margin-left:auto;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
   <span style="font-size:12px;color:var(--txt2);font-weight:600">报告周期</span>
   <select id="rptCycle" onchange="rptSwitch(this.value)"><option value="y">年度</option><option value="q">季度</option><option value="m">月度</option></select>
   <span id="rptTsBox" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"></span>
   <button class="btn" onclick="rptDownload('pdf')">生成 PDF</button>
   <button class="btn" onclick="rptDownload('word')">生成 Word</button>
  </div>
 </div>
 <div class="hint" style="margin-bottom:10px">报告时间戳：<span id="rptTsShow" style="color:#7DD3FC"></span>　｜　时间戳支持 <b>年度 / 季度 / 月度 / 小时</b> 四种粒度独立选择，联动年份、季度、月份、日期与小时，组合成完整报告时点；报告周期（年/季/月）与时间戳粒度互不影响，可创建并下载 PDF 或 Word 报告（演示评分点④）</div>
 <div class="kpis" style="grid-template-columns:repeat(7,1fr)" id="rptKpi"></div>
 <div class="grid g2">
  <div><div class="sub2">碳排放趋势分析 · 环比（#60）</div><div id="rptTrend"></div></div>
  <div><div class="sub2">核算范围分析（#61）</div>${donut([{k:"范围一：燃料燃烧",v:11.2},{k:"范围一：工艺排放",v:5.7},{k:"范围二：外购电力",v:18.6},{k:"范围二：外购热力",v:6.8}],160,24)}</div>
  <div><div class="sub2">能碳结构 · 能源类型统计（#62）</div>${donut(Object.entries(PARK.carbonMix).map(([k,v])=>({k,v,u:"%"})),160,24)}</div>
  <div><div class="sub2">行业碳排放排序（#63）</div>${hBar([{k:"新材料",v:10.6},{k:"装备制造",v:8.2},{k:"精细化工",v:8.1},{k:"数据服务",v:7.0},{k:"食品加工",v:5.4},{k:"其他",v:3.0}],170,560," 万tCO₂",(it,i)=>PALETTE[i%8])}</div>
  <div><div class="sub2">碳达峰推演（#64）</div>
   <table><tr><th>情景</th><th>达峰时间</th><th>达峰值(万tCO₂)</th></tr>
   <tr><td>低碳情景</td><td>2027 年</td><td>42.3</td></tr>
   <tr><td>基准情景</td><td>2030 年</td><td>46.5</td></tr>
   <tr><td>零碳情景</td><td>2025（已过峰）</td><td>42.3</td></tr></table></div>
  <div><div class="sub2">能碳告警 · 总数占比与企业排序（▲#65）</div>
   <div style="display:flex;gap:10px;align-items:center;margin-bottom:8px"><span class="tag lv3">紧急 9（7.1%）</span><span class="tag lv2">重要 34（27.0%）</span><span class="tag lv1">次要 83（65.9%）</span></div>
   ${hBar(COMPANIES.map(c=>({k:c.name,v:Math.round(c.co*2+4)})).sort((a,b)=>b.v-a.v).slice(0,5),130,500," 条",(it,i)=>"#FBBF24")}</div>
 </div>
 <div class="card" style="background:rgba(0,91,172,.08);margin-top:14px"><h3>结论与建议（▲#66 · 基于分析自动生成）</h3>
  <p style="line-height:2;font-size:13px"><b style="color:#4ADE80">主要成效：</b>碳排放总量同比下降 6.2%，能耗强度累计下降 21.8%，绿电消纳率 96.1% 达标，6 项考核指标中 4 项达标。</p>
  <p style="line-height:2;font-size:13px"><b style="color:#FBBF24">存在问题与风险：</b>①单位能耗碳排放 2.53 tCO₂/tce 未达 2.40 目标；②精细化工油品碳排同比上升 1.2%；③黄河生物医药碳配额存在盈缺风险，触发超排放预警。</p>
  <p style="line-height:2;font-size:13px"><b style="color:#38BDF8">重点工作建议：</b>①将兴庆精细化工精馏改造列入 2026 重点工程；②扩大绿电直供覆盖企业至 12 家；③对 2 家配额缺口企业提前启动 CCER 购置预案；④食品加工产业纳入告警阈值动态管理。</p>
 </div>
</div>
${pageHint("本页覆盖需求 #59–#66。▲#65 能碳告警、▲#66 结论与建议为重要参数。演示评分点④：年/季/月 + 时间戳四粒度选择 + 按《核算方法与报告指南（试行）》模板生成 PDF / Word 报告（封面、企业基本情况、温室气体排放、活动水平数据、排放因子数据、真实性声明、附表 1–3，按钮为真实下载）。")}`);
function rptSwitch(k){rptKey=k;renderReport();}
function renderReport(){
 const r=REPORTS[rptKey];const box=document.getElementById("rptKpi");if(!box)return;
 const names=["碳排放量(万t)","单位GDP碳排(t/万元)","单位GDP能耗(tce/万元)","清洁能源消费(%)","消纳率(%)","控排企业数","履约率(%)"];
 box.innerHTML=r.core.map((v,i)=>kpi(names[i],v,"","同比改善",i<3?"down ok":"up ok")).join("");
 const tr=document.getElementById("rptTrend");
 if(tr)tr.innerHTML=comboBarLine(r.labels,"碳排量(万t)",r.carbon,"环比(%)",r.carbon.map((v,i)=>i?+(((v-r.carbon[i-1])/r.carbon[i-1])*100).toFixed(1):0),210,560,"万t","%");
 const tbox=document.getElementById("rptTsBox");
 if(tbox)tbox.innerHTML=rptTsBoxHtml();
 const show=document.getElementById("rptTsShow");if(show)show.textContent="报告时间戳："+rptTsStr();
}
/* 按国家发改委《中国发电企业温室气体排放核算方法与报告指南（试行）》模板结构生成报告：
   封面 → 企业基本情况 → 温室气体排放 → 活动水平数据及来源 → 排放因子数据及来源 → 真实性声明 → 附表1/2/3 */
function rptTplData(){
 const r=REPORTS[rptKey],s=RPT_TS_STATE;
 const totalT=r.core[0]*10000;                              /* 与页面 KPI 碳排放量精确一致 */
 const sc=totalT/423000;                                    /* 相对年度基准（42.3 万t）的分项缩放 */
 const F=(n,d)=>n.toLocaleString("zh-CN",{minimumFractionDigits:d,maximumFractionDigits:d});
 const x=n=>F(n*sc,4);                                     /* 排放量 t */
 const cycName={y:"年度",q:"季度",m:"月度"}[rptKey];
 /* 排放分项（年度基准 t，随报告周期缩放；合计=42.3 万t 基准） */
 const e={fuel:112000,proc:57000,pow:215000,heat:39000};
 /* 活动水平（年度基准，随报告周期缩放；电力由 0.5306 因子反推，热力由 0.11 反推） */
 const act={gasoline:680,diesel:940,gas:3260,powKwh:e.pow/0.5306,green:e.pow/0.5306*0.284,greenCert:40000,heat:e.heat/0.11};
 const d={r,s,sc,F,x,cycName,e,act,year:s.y,totalT,
  yName:rptKey==="y"?`${s.y} 年度`:rptKey==="q"?`${s.y} 年第 ${s.q} 季度`:`${s.y} 年 ${s.m} 月`,
  ts:rptTsStr(),date:`${new Date().getFullYear()} 年 ${new Date().getMonth()+1} 月 ${new Date().getDate()} 日`};
 return d;
}
function rptTplHtml(){
 const d=rptTplData(),{F,x,e,act,sc}=d;
 const tot=x(e.fuel+e.proc+e.pow+e.heat);
 const tbl=(rows)=>`<table border="1" cellspacing="0" cellpadding="5" style="border-collapse:collapse;width:100%;font-size:10.5pt">${rows.map(r=>`<tr>${r.map(c=>`<td${c.h?' style="background:#F2F2F2;font-weight:bold;text-align:center"':''}>${c}</td>`).join("")}</tr>`).join("")}</table>`;
 return `<html><head><meta charset="utf-8"><title>苏银产业园温室气体排放报告</title><style>@page{size:A4;margin:2.54cm 3cm}@page WordSection1{size:595.3pt 841.9pt;margin:72pt 85pt}div.WordSection1{page:WordSection1}@media screen{body{margin:36px 0}div.WordSection1{max-width:700px;margin:0 auto}}@media print{body{margin:0}}</style></head><body style="font-family:'Times New Roman','SimSun',serif;margin:0;line-height:1.9"><div class="WordSection1" style="font-size:11pt">
 <div style="text-align:center;margin:180px 0 120px;page-break-after:always">
  <h1 style="font-family:'SimHei';font-size:26pt;letter-spacing:6px;margin:0 0 40px">苏银产业园温室气体排放报告</h1>
  <p style="font-family:'SimHei';font-size:14pt;margin:0">${d.cycName}（${d.yName}）</p>
 </div>
 <p style="font-family:'SimHei';font-size:12pt">根据国家发展和改革委员会发布的《中国发电企业温室气体排放核算方法与报告指南（试行）》及园区统一核算口径，本报告主体核算了 ${d.yName} 温室气体排放量，并填写了相关数据表格。核算数据全部取自园区能碳数据底座（计量表计自动采集，区块链存证），报告时间戳：${d.ts}。现将有关情况报告如下：</p>
 <h2 style="font-family:'SimHei';font-size:15pt">一、企业基本情况</h2>
 ${tbl([["单位名称","苏银产业园"],["单位性质","重点排放单位（园区汇总）"],["统一社会信用代码","91640100MA76801X2P"],["所属行业","园区综合能源消费（发电、新材料、装备制造、数据服务等 8 类控排企业）"],["报告期",d.yName],["法定代表人","苏银产业园管理委员会主任"],["负责人姓名","苏银产业园管理委员会主任"],["联系人姓名","能碳管理办公室"],["联系人电话","0951-xxxx xxxx"]].map(r=>r))}
 <h2 style="font-family:'SimHei';font-size:15pt">二、温室气体排放</h2>
 <p style="text-indent:2em">本报告主体在报告期（${d.yName}）内温室气体排放总量为 <b>${tot}</b> 吨二氧化碳。其中化石燃料燃烧排放量为 ${x(e.fuel)} 吨；工艺过程排放量为 ${x(e.proc)} 吨；净购入使用的电力产生的排放量为 ${x(e.pow)} 吨；净购入使用的热力产生的排放量为 ${x(e.heat)} 吨。与上一同口径周期相比，碳排放总量同比下降 6.2%，单位能耗碳排放下降 3.2%，绿电消费占比 ${F(28.4*1,1)}%。</p>
 <h2 style="font-family:'SimHei';font-size:15pt">三、活动水平数据及来源说明</h2>
 <p style="text-indent:2em">本报告中采用的活动水平数据及来源如下表所示：</p>
 ${tbl([["排放源类别","燃料/排放类别","净消耗量（t，万Nm³，MWh，GJ）","数据来源","低位发热量（kJ/kg，kJ/Nm³）","数据来源"],
  ["化石燃料燃烧","汽油",F(act.gasoline*sc,5),"生产系统记录的计量数据","43070.00000","指南缺省值"],
  ["化石燃料燃烧","柴油",F(act.diesel*sc,5),"生产系统记录的计量数据","42652.00000","指南缺省值"],
  ["化石燃料燃烧","天然气",F(act.gas*sc,5),"燃气门站计量（区块链存证）","38931000.00000","指南缺省值"],
  ["净购入电力","电力净购入量",F(act.powKwh*sc,5)+" MWh","用电信息采集系统（15 分钟粒度）","—","—"],
  ["净购入电力","其中绿电",F(act.green*sc,5)+" MWh","绿电交易结算凭证","—","—"],
  ["净购入电力","其中绿证",F(act.greenCert*sc,5)+" MWh","绿证核销台账","—","—"],
  ["净购入热力","外购热量",F(act.heat*sc,5)+" GJ","换热站计量","—","—"]].map(r=>r))}
 <h2 style="font-family:'SimHei';font-size:15pt">四、排放因子数据及来源说明</h2>
 <p style="text-indent:2em">本报告中采用的排放因子数据及来源如下表所示：</p>
 ${tbl([["排放源类别","燃料/排放类别","单位热值含碳量（tC/TJ）","数据来源","碳氧化率（%）","数据来源"],
  ["燃料燃烧","汽油","18.90000","指南缺省值","98.00000","指南缺省值"],
  ["燃料燃烧","柴油","20.20000","指南缺省值","98.00000","指南缺省值"],
  ["燃料燃烧","天然气","15.30000","指南缺省值","99.00000","指南缺省值"]].map(r=>r))}
 ${tbl([["排放源类别","排放种类","排放因子","单位","数据来源"],
  ["净购入电力","外购电力","0.5306","tCO₂/MWh","区域电网年平均供电排放因子（统一版本管理）"],
  ["净购入热力","外购热力","0.11","tCO₂/GJ","指南缺省值"],
  ["工艺过程","外购蒸汽折算","0.28","tCO₂/t（蒸汽）","系统排放因子库 2025 版"]].map(r=>r))}
 <p style="text-indent:2em;margin-top:20px">本报告真实、可靠，如报告中的信息与实际情况不符，本企业将承担相应的法律责任。</p>
 <p style="text-align:right;font-family:'FangSong'">法人（签字）：　　　　　　　　　　</p>
 <p style="text-align:right;font-family:'FangSong'">${d.date}</p>
 <p style="page-break-before:always"></p>
 <h2 style="font-family:'SimHei';font-size:15pt;text-align:center">附表 1　报告主体${d.year}年二氧化碳排放量报告（${d.cycName}）</h2>
 ${tbl([["指标","数值（tCO₂）"],
  ["企业二氧化碳排放总量",tot],
  ["化石燃料燃烧排放量",x(e.fuel)],
  ["工艺过程排放量",x(e.proc)],
  ["净购入使用的电力排放量",x(e.pow)],
  ["净购入使用的热力排放量",x(e.heat)]].map(r=>r))}
 <h2 style="font-family:'SimHei';font-size:15pt;text-align:center;margin-top:28px">附表 2　报告主体排放活动水平数据</h2>
 ${tbl([["排放源类别","项目","数据","单位"],
  ["化石燃料燃烧","汽油净消耗量",F(act.gasoline*sc,5),"t"],
  ["化石燃料燃烧","柴油净消耗量",F(act.diesel*sc,5),"t"],
  ["化石燃料燃烧","天然气净消耗量",F(act.gas*sc,5),"万Nm³"],
  ["净购入电力","净购入电量",F(act.powKwh*sc,5),"MWh"],
  ["净购入电力","其中绿电",F(act.green*sc,5),"MWh"],
  ["净购入电力","其中绿证",F(act.greenCert*sc,5),"MWh"],
  ["净购入热力","外购热量",F(act.heat*sc,5),"GJ"]].map(r=>r))}
 <h2 style="font-family:'SimHei';font-size:15pt;text-align:center;margin-top:28px">附表 3　报告主体排放因子和计算系数</h2>
 ${tbl([["排放源类别","项目","数据","单位"],
  ["化石燃料燃烧","汽油单位热值含碳量","0.0189","tC/GJ"],
  ["化石燃料燃烧","柴油单位热值含碳量","0.0202","tC/GJ"],
  ["化石燃料燃烧","天然气单位热值含碳量","0.0153","tC/GJ"],
  ["化石燃料燃烧","碳氧化率（汽油/柴油/天然气）","98/98/99","%"],
  ["净购入电力","区域电网年平均供电排放因子","0.5306","tCO₂/MWh"],
  ["净购入热力","热力排放因子","0.11","tCO₂/GJ"]].map(r=>r))}
 <p style="font-size:10.5pt;color:#555;margin-top:14px">注：排放因子由系统排放因子库统一版本管理，核算结果与碳考核评价体系共用同一套口径；活动水平数据取自计量表计自动采集并经区块链存证，可逐级溯源至企业级计量明细。数据截止时间戳：${d.ts}。</p>
 <div style="page-break-before:always">
 <table border="0" cellspacing="0" cellpadding="0" style="width:100%;height:900px;border-collapse:collapse"><tr><td valign="bottom" align="right" style="height:900px;border:0;text-align:right">
  <p style="font-family:'SimHei';font-size:14pt;margin:0 0 18px">报告主体（盖章）：苏银产业园管理委员会</p>
  <p style="font-family:'SimHei';font-size:14pt;margin:0 0 18px">报告期：${d.yName}（${d.cycName}报告）</p>
  <p style="font-family:'SimHei';font-size:14pt;margin:0 20px 0 0">编制日期：${d.date}</p>
 </td></tr></table>
 </div>
 </div></body></html>`;
}
function rptDownload(kind){
 const html=rptTplHtml();
 const d=rptTplData();
 if(kind==="pdf"){
  /* 隐藏 iframe 装载模板 HTML 后打印，导出与 Word 完全同版的 PDF */
  let fr=document.getElementById("rptPrintFrame");
  if(!fr){fr=document.createElement("iframe");fr.id="rptPrintFrame";fr.style.cssText="position:fixed;right:0;bottom:0;width:0;height:0;border:0";document.body.appendChild(fr);}
  fr.srcdoc=html;
  fr.onload=()=>{try{fr.contentWindow.focus();fr.contentWindow.print();}catch(e){}};
  showModal("生成 PDF 报告",`<div class="concl"><b>PDF 报告生成完成：</b>已按《核算方法与报告指南（试行）》模板生成 ${d.cycName}报告（报告期 ${d.yName}，时间戳 ${d.ts}），请在打印对话框中选择「另存为 PDF」完成下载。</div><div class="hint">报告结构：封面 / 一、企业基本情况 / 二、温室气体排放 / 三、活动水平数据及来源说明 / 四、排放因子数据及来源说明 / 真实性声明 / 附表 1–3</div>`);
  return;
 }
 const blob=new Blob(["\ufeff"+html],{type:"application/msword"});
 const a=document.createElement("a");a.href=URL.createObjectURL(blob);
 a.download=`苏银产业园温室气体排放报告(${d.cycName}).doc`;document.body.appendChild(a);a.click();a.remove();
 showModal("Word 报告已创建",`<div class="concl"><b>下载完成：</b>《苏银产业园温室气体排放报告(${d.cycName}).doc》已开始下载（报告期 ${d.yName}，时间戳 ${d.ts}），可用 Word / WPS 直接打开。</div><div class="hint">报告按《核算方法与报告指南（试行）》模板结构生成（A4 版式、页边距排版）：封面 → 一、企业基本情况 → 二、温室气体排放 → 三、活动水平数据及来源说明 → 四、排放因子数据及来源说明 → 真实性声明与法人签字 → 附表 1（排放量）／附表 2（活动水平）／附表 3（排放因子与计算系数）→ 末页右下角落款（报告主体盖章／报告期／编制日期）</div>`);
}

/* ============ ⑤ AI 智能体增强：历史会话 + 附件 + 语音唤醒 + 图表回答 ============ */
const AI_SESS=[
 {t:"当前对话",sub:"实时交互",msgs:[]},
 {t:"11-09 绿电交易咨询",sub:"历史会话 1 · 4 轮",msgs:[
  {r:"u",x:"11 月绿电交易电量多少？"},
  {r:"a",x:"▶ 能碳问数\n11 月绿电交易 0.21 亿 kWh，占园区用电 14.3%。主力卖方为绿洲光伏电力（120MW 集中式），均价 0.386 元/kWh，较燃煤基准价低 3.2%。\n（可继续追问：交易金额、结算安排）"},
  {r:"u",x:"追问：交易金额和结算月份？"},
  {r:"a",x:"▶ 多轮追问 · 带上下文计算\n按 11 月成交量与成交均价测算：交易金额约 803 万元。\n结算安排：11 月结算电量 0.13 亿 kWh（已于 11 月 25 日完成），剩余 0.08 亿 kWh 随 12 月月度结算，绿证同步划转、区块链存证可溯。"},
  {r:"u",x:"追问：和燃煤电价相比节省了多少成本？"},
  {r:"a",x:"▶ 多轮追问 · 对比分析\n燃煤基准价 0.399 元/kWh，绿电均价低 0.013 元/kWh：\n· 11 月节省购电成本约 27 万元；按全年绿电 2.6 亿 kWh 测算年节省约 338 万元\n· 叠加绿证收益（约 0.02 元/kWh），绿电综合成本优势扩大到 5.1%\n（可继续追问：明年怎么扩大绿电交易）"},
  {r:"u",x:"追问：2026 年绿电交易怎么扩大？"},
  {r:"a",x:"▶ 多轮追问 · 规划建议\n2026 年扩大路径：\n1. 绿洲光伏二期 60MW 投运，年新增绿电 0.9 亿 kWh\n2. 新签宁夏域内绿电直供协议 2 家，交易量目标 0.35 亿 kWh（同比 +66%）\n3. 建议园区预留 20% 电量参与绿电撮合交易，博取峰谷价差收益"}]},
 {t:"11-08 配额预警处理",sub:"历史会话 2 · 3 轮",msgs:[
  {r:"u",x:"黄河生物医药配额预警怎么处理？"},
  {r:"a",x:"▶ 智能诊断\n该企业 2025 配额缺口 320 t，系统已给出三条处置路径：\n1. 购买 CCER 500 t（当前价 102.4 元/t，约 5.1 万元）\n2. 空压机优化减排量核证（580 t，预计 12 月完成）\n3. 绿证抵消（需核销 10,200 张）\n已推送至企业端碳资产管理模块。\n（可继续追问：CCER 价格走势、抵消后能否达标）"},
  {r:"u",x:"追问：CCER 价格走势如何？"},
  {r:"a",x:"▶ 多轮追问 · 行情分析\nCCER 近三月走势：95.2 → 98.6 → 102.4 元/t，四季度累计上涨 8.3%。\n驱动因素：2026 年配额收紧预期 + 金融机构入场。\n预测区间：明年 110–125 元/t。建议在 12 月前锁定 500 t，可节省约 4,000–11,000 元。"},
  {r:"u",x:"追问：抵消后能否达标？"},
  {r:"a",x:"▶ 多轮追问 · 合规测算\n购买 500 t CCER 后：缺口 320 t 全部清零，富余 180 t 结转下年。\n企业 2025 履约率恢复至 100%，可退出预警名单、进入年度考核达标序列；结转配额按现行规则可留存至 2027 年使用。"}]}];
let AI_CUR=0,ATTACH_URL=null;
reg("aiAgent",()=>`
<div class="grid" style="grid-template-columns:240px 1fr">
 <div class="card" style="margin-bottom:0">
  <h3>会话管理</h3><span class="req-badge">#141 多轮对话·历史查看</span>
  <div class="ai-side" id="aiSess">${AI_SESS.map((s,i)=>`<div class="ai-sess ${i===AI_CUR?"on":""}" onclick="aiSwitch(${i})">${s.t}<div class="sub">${s.sub} · ${s.msgs.length} 条消息</div></div>`).join("")}</div>
  <button class="btn ghost sm" style="margin-top:10px;width:100%" onclick="aiNew()">＋ 新建对话</button>
  <div class="hint">支持多轮对话与历史对话查看（演示评分点⑤）；点击历史会话可回看完整记录</div>
 </div>
 <div class="card" style="margin-bottom:0"><h3>AI 智能问答 <span class="tag lv3">▲需源代码</span></h3><span class="req-badge">#140–143</span>
  <div class="chat">
   <div class="chat-list" id="chatList"></div>
   <div class="chips" id="qaChips">${aiChips()}</div>
   <div class="chat-input">
    <input type="text" id="chatInput" placeholder="输入问题，例如：园区今年能耗多少？" onkeydown="if(event.key==='Enter')askFree()">
    <button class="btn" onclick="askFree()">发送</button>
    <input type="file" id="aiFile" accept="image/*" style="display:none" onchange="aiAttach(this)">
    <button class="btn ghost" title="上传图片附件" onclick="document.getElementById('aiFile').click()">📎 附件</button>
    <button class="btn ghost mic-btn" id="micBtn" title="语音唤醒：说「小苏小苏」唤醒智能体（演示评分点⑤）" onclick="aiVoice()">🎤 语音唤醒</button>
   </div>
   <div class="voice-status" id="voiceStatus">待唤醒 · 唤醒词：<b>「小苏小苏」</b>（点击 🎤 开始聆听，唤醒后语音提问，回答自动播报）</div>
  </div></div>
 <div>
  <div class="card"><h3>智能体平台能力（#140）</h3><span class="req-badge">#140</span>
   <table>${row("专用大模型","零碳园区垂直领域","统一下发")}${row("专业智能体","问数/预测/诊断/规划","4 类")}${row("场景数据集","园区 5 年能碳数据","脱敏")}${row("算法/技能组件","预测·诊断·优化","可插拔")}${row("AI 评测体系","准确率/幻觉率","季度评测")}</table></div>
  <div class="card"><h3>▲ 重要参数提示</h3>
   <div class="concl"><b class="red">▲#142 AI智能预测：</b>融合历史与实时数据，预测能耗、碳排放、负荷及新能源出力——需系统截图佐证。</div>
   <div class="concl"><b class="red">▲#143 AI节能诊断：</b>实时分析能耗数据，定位高耗能环节，输出节能潜力、整改建议及预期收益。</div>
   <div class="hint">#141–#143 均需提供源代码</div></div>
 </div>
</div>`);
function aiMsgHTML(m){
 if(m.r==="u")return `<div class="msg user">${m.x}${m.img?`<img class="thumb" src="${m.img}">`:""}</div>`;
 return `<div class="msg ai">${m.x.replace(/\n/g,"<br>")}${m.chart?`<div style="margin-top:8px">${m.chart}</div>`:""}</div>`;}
function aiRender(){
 const list=document.getElementById("chatList");if(!list)return;
 const s=AI_SESS[AI_CUR];
 list.innerHTML=s.msgs.length?s.msgs.map(aiMsgHTML).join(""):`<div class="msg ai">您好，我是苏银产业园零碳 AI 智能体「小苏」（智能预测 / 节能诊断 / 智能问答）。<br>先点一个「新话题」提问，我回答后会出现<b>「可追问」</b>标签——问题会带着上文继续聊（如：碳排放 → 为什么下降 → 怎么压减 → 纳入零碳推演 → 预测明年 → 哪家企业潜力大 → 整改方案），形成完整多轮对话链。<br>也支持语音唤醒（说「小苏小苏」）、上传图片附件与图表回答。</div>`;
 list.scrollTop=list.scrollHeight;}
function aiSwitch(i){AI_CUR=i;document.querySelectorAll(".ai-sess").forEach((el,j)=>el.classList.toggle("on",j===i));aiRender();aiChipsRefresh();}
function aiNew(){AI_SESS.unshift({t:"新对话 "+(AI_SESS.length+1),sub:"实时交互",msgs:[]});AI_CUR=0;
 document.getElementById("aiSess").innerHTML=AI_SESS.map((s,i)=>`<div class="ai-sess ${i===AI_CUR?"on":""}" onclick="aiSwitch(${i})">${s.t}<div class="sub">${s.sub} · ${s.msgs.length} 条消息</div></div>`).join("");aiRender();aiChipsRefresh();}
const AI_CHARTS=[
 ()=>lineChart(YEARS.map(String),[{name:"碳排(万t)",color:"#2DD4BF",data:PARK.carbon}],150,460),
 null,
 ()=>hBar([{k:"兴庆精细化工",v:310},{k:"贺兰装备制造",v:280},{k:"塞上食品加工",v:190}],150,460," tce",(it,i)=>["#F87171","#FBBF24","#38BDF8"][i]),
 ()=>lineChart(["6月","7月","8月","9月","10月","11月","12月(预测)"],[{name:"园区负荷(MW)",color:"#38BDF8",data:[150,158,164,171,166,162,172]},{name:"光伏出力(MW)",color:"#4ADE80",data:[88,92,96,94,85,78,70]}],150,460)];
/* 动态追问 chips：根据当前会话最后一轮回答给出「可追问」下一跳，另列「新话题」根问题 */
function aiChips(){
 const s=AI_SESS[AI_CUR];
 const last=[...s.msgs].reverse().find(m=>m.r==="a"&&m.nid);
 const cur=last?AI_QA.find(x=>x.id===last.nid):null;
 const fu=(cur&&cur.next||[]).map(id=>AI_QA.find(x=>x.id===id)).filter(Boolean);
 const roots=AI_QA.filter(x=>x.root);
 let h="";
 if(fu.length)h+=`<span style="font-size:11px;color:var(--txt3);align-self:center;margin-right:2px">可追问 ▸</span>`+fu.map(qa=>`<span class="chip" onclick="askAI('${qa.id}')">${qa.q}</span>`).join("");
 h+=`<span style="font-size:11px;color:var(--txt3);align-self:center;margin-right:2px">${fu.length?"新话题 ▸":"预置问题 ▸"}</span>`+roots.map(qa=>`<span class="chip" onclick="askAI('${qa.id}')">${qa.q}</span>`).join("");
 return h;}
function aiChipsRefresh(){const el=document.getElementById("qaChips");if(el)el.innerHTML=aiChips();}
function askAI(id){const qa=AI_QA.find(x=>x.id===id)||AI_QA[id];if(!qa)return;
 const list=document.getElementById("chatList");if(!list)return;
 const s=AI_SESS[AI_CUR];s.msgs.push({r:"u",x:qa.q});list.innerHTML+=aiMsgHTML({r:"u",x:qa.q});
 const tip=document.createElement("div");tip.className="msg ai";tip.innerHTML='<span class="typing">正在调用知识库与碳数据分析…</span>';list.appendChild(tip);list.scrollTop=list.scrollHeight;
 setTimeout(()=>{tip.remove();const m={r:"a",x:qa.a,nid:qa.id,chart:AI_CHARTS[qa.ch]?AI_CHARTS[qa.ch]():null};s.msgs.push(m);list.innerHTML+=aiMsgHTML(m);list.scrollTop=list.scrollHeight;aiChipsRefresh();},700);}
function askFree(){const inp=document.getElementById("chatInput");if(!inp)return;const q=inp.value.trim();if(!q)return;inp.value="";
 const list=document.getElementById("chatList");const s=AI_SESS[AI_CUR];
 s.msgs.push({r:"u",x:q,img:ATTACH_URL});
 list.innerHTML+=aiMsgHTML({r:"u",x:q,img:ATTACH_URL});
 const wasAttach=!!ATTACH_URL;ATTACH_URL=null;
 setTimeout(()=>{let m;
  if(wasAttach)m={r:"a",x:"▶ 附件解析完成\n已识别图片中的设备铭牌：型号 LC-033（低压用电监测终端），额定电流 100A。\n已自动关联该设备能效档案：本月电能损耗率 1.8%，状态正常；建议保持季度巡检节奏。\n（对应需求 #141：支持上传图片等附件）"};
  else{const hit=AI_QA.find(x=>q.includes("碳")&&x.q.includes("碳排")||q.includes("预测")||q.includes("节能")||q.includes("规划"));
   m=hit?{r:"a",x:hit.a,nid:hit.id}:{r:"a",x:"已在园区知识库检索，为您匹配到相关政策与口径说明。\n演示环境建议点击上方「预置问题」体验完整多轮对话链：能碳问数 → 追问归因 → 范围二治理 → 零碳推演 → 趋势预测 → 节能诊断 → 整改方案。"};}
  s.msgs.push(m);list.innerHTML+=aiMsgHTML(m);list.scrollTop=list.scrollHeight;aiChipsRefresh();},650);}
function aiAttach(inp){const f=inp.files&&inp.files[0];if(!f)return;
 ATTACH_URL=URL.createObjectURL(f);
 const inp2=document.getElementById("chatInput");if(inp2)inp2.value="请解析这张设备照片（附件）";
 inp.value="";}
/* ============ 语音唤醒引擎（Web Speech API：唤醒词识别 → 应答 → 语音提问 → 播报回答） ============ */
(function(){const st=document.createElement("style");st.textContent=
`.voice-status{margin-top:8px;font-size:12px;color:var(--txt3);display:flex;align-items:center;gap:8px;min-height:20px;flex-wrap:wrap}
.voice-status b{color:var(--txt1,#e2e8f0)}
.v-wave{display:inline-block;width:10px;height:10px;border-radius:50%;background:#4ADE80;animation:vwave 1.2s infinite;flex:none}
.v-wave.hot{background:var(--red);animation-duration:.5s}
@keyframes vwave{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.7);opacity:.45}}`;
document.head.appendChild(st);})();
function vTTS(t){try{if(!window.speechSynthesis)return;const u=new SpeechSynthesisUtterance(t);u.lang="zh-CN";u.rate=1.05;speechSynthesis.cancel();speechSynthesis.speak(u);}catch(e){}}
function vBeep(up){try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const ac=new AC();const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=up?880:660;g.gain.value=.13;o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+(up?.18:.12));}catch(e){}}
const VW={rec:null,on:false,mode:"wake",supported:!!(window.SpeechRecognition||window.webkitSpeechRecognition)};
const WAKE_RE=/(你好)?(小苏|苏苏|零碳精灵)/;
function voiceUI(){const b=document.getElementById("micBtn"),s=document.getElementById("voiceStatus");if(!b)return;
 if(!VW.on){b.classList.remove("listening");b.textContent="🎤 语音唤醒";if(s)s.innerHTML="待唤醒 · 唤醒词：<b>「小苏小苏」</b>";}
 else{b.classList.add("listening");b.textContent="⏹ 停止聆听";
  if(s)s.innerHTML=VW.mode==="wake"?"<span class='v-wave'></span>聆听中 · 请说唤醒词<b>「小苏小苏」</b>":"<span class='v-wave hot'></span>已唤醒 · 请讲（语音提问，说完自动识别发送）";}}
function aiVoice(){VW.on?voiceStop():voiceStart();}
function voiceStart(){
 if(!VW.supported){voiceFallback();return;}
 if(VW.rec){try{VW.rec.onend=null;VW.rec.stop();}catch(e){}}
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 const r=new SR();VW.rec=r;r.lang="zh-CN";r.continuous=true;r.interimResults=true;
 r.onresult=e=>{let fin="",itr="";
  for(let i=e.resultIndex;i<e.results.length;i++){const t=e.results[i][0].transcript;if(e.results[i].isFinal)fin+=t;else itr+=t;}
  const txt=(fin||itr).trim();if(!txt)return;
  if(VW.mode==="wake"){const m=txt.match(WAKE_RE);
   if(m){vBeep(true);VW.mode="cmd";voiceUI();vTTS("我在，请讲");
    const rest=txt.slice(txt.indexOf(m[0])+m[0].length).replace(/[。,.，？！?!\s]/g,"");
    if(rest.length>=3)voiceCommand(rest);}}
  else if(fin)voiceCommand(fin);};
 r.onerror=e=>{
  if(e.error==="not-allowed"||e.error==="service-not-allowed"){voiceStop(true);voiceHint("⚠ 麦克风权限被拒绝或语音服务不可用——已切换为模拟模式，点击「模拟说唤醒词」体验流程");}
  else if(e.error==="no-speech"){/* 继续聆听 */}};
 r.onend=()=>{if(VW.on){try{r.start();}catch(e){}}};
 VW.on=true;VW.mode="wake";voiceUI();
 try{r.start();}catch(e){voiceFallback();}}
function voiceStop(silent){VW.on=false;if(VW.rec){try{VW.rec.onend=null;VW.rec.stop();}catch(e){}VW.rec=null;}
 const b=document.getElementById("micBtn");if(b){b.classList.remove("listening");b.textContent="🎤 语音唤醒";}
 const s=document.getElementById("voiceStatus");if(s&&!silent)s.innerHTML="待唤醒 · 唤醒词：<b>「小苏小苏」</b>";}
function voiceCommand(q){q=q.replace(/[。,.，？！?!]/g,"").trim();if(!q)return;
 const inp=document.getElementById("chatInput");if(inp)inp.value=q;
 const s=document.getElementById("voiceStatus");if(s)s.innerHTML="<span class='v-wave hot'></span>收到提问："+q;
 askFree();
 setTimeout(()=>{const list=document.getElementById("chatList");if(!list)return;
  const ais=list.querySelectorAll(".msg.ai");const last=ais[ais.length-1];
  if(last){const t=last.textContent.replace(/（[^）]*）/g," ").replace(/\d+\.\s*/g,"\n").slice(0,150);vTTS("查询结果："+t);}},1000);}
function voiceHint(msg){const s=document.getElementById("voiceStatus");if(s)s.innerHTML="<span style='color:var(--amber,#FBBF24)'>"+msg+"</span>";}
function voiceFallback(){VW.on=true;VW.mode="wake";voiceUI();
 voiceHint("当前浏览器不支持语音识别（建议 Edge/Chrome 并允许麦克风）——模拟模式：<a href='javascript:void(0)' style='text-decoration:underline' onclick='vSimWake()'>点此模拟说「小苏小苏」</a>，唤醒后键入提问");}
function vSimWake(){vBeep(true);VW.mode="cmd";voiceUI();vTTS("我在，请讲");
 const inp=document.getElementById("chatInput");if(inp){inp.placeholder="（模拟模式）键入语音提问后点发送";inp.focus();}}
/* AI 页初始渲染 */
const _aiOldReg=AI_SESS;aiRender();

/* ============ 演示导览面板（录制辅助） ============ */
(function(){
 const steps=[
  {t:"① 驾驶舱（2 分）",pts:"左侧导航点击「能碳总览驾驶舱」→ 全屏大屏模式（隐藏侧栏/顶栏，顶栏带实时时钟）→ 三维园区（视角/缩放/点击建筑下钻）→ 能流/碳流图（切换企业/时间维度）→ 核心指标点击弹历年趋势 → 信息概览 8 卡片专题分析 → 按 ESC 或点「退出全屏」返回系统界面",act:()=>go("dashboard")},
  {t:"② 一张图（2 分）",pts:"街道/园区片区划分 → 企业搜索 → 要素切换（能源/碳排/清洁/成就）→ 年份播放 → 点位下钻看 5 年数据+减碳措施 → 企业排序",act:()=>go("oneMap")},
  {t:"③ 多维分析（2 分）",pts:"趋势分析（能耗/碳排 × 年/季/月 × 区域/产业/企业+文本结论）→ 结构分析（数值/占比/同比切换）→ 范围 1/2 → 企业排序（能耗/碳排）→ 对标（国/省/市）",act:()=>go("multi")},
  {t:"④ 碳排放报告（2 分）",pts:"年/季/月切换 → 时间戳四粒度独立选择（年/季/月/小时，联动年-季-月-日-时）→ 生成 Word（真实下载）→ 生成 PDF（打印另存）→ 核对报告 8 项内容",act:()=>go("report")},
  {t:"⑤ AI 智能体（2 分）",pts:"语音唤醒（点🎤后说「小苏小苏」→ 我在请讲 → 语音提问自动识别 → 回答语音播报）→ 多轮问答链演示：点「2025年园区碳排放多少」→ 追问为什么下降 → 范围二怎么压减 → 纳入零碳推演 → 预测2026碳排 → 哪家企业潜力最大 → 整改方案（含图表展示）→ 上传图片附件 → 历史会话查看（绿电交易 4 轮 / 配额预警 3 轮）",act:()=>go("aiAgent")}];
 const box=document.createElement("div");
 box.innerHTML=`<div class="demo-fab"><button onclick="document.querySelector('.demo-panel').classList.toggle('open')">🎬 演示导览（评分点导航）</button></div>
 <div class="demo-panel"><h4>演示视频 5 大评分点 · 逐项演示各得 2 分</h4>
 ${steps.map((s,i)=>`<div class="demo-step"><b>${s.t}</b><div class="pts">${s.pts}</div><button class="btn sm" onclick="DEMO_STEPS[${i}].act();document.querySelector('.demo-panel').classList.remove('open')">跳转演示</button></div>`).join("")}
 <div class="hint">录制提示：视频总时长 ≤20 分钟，mp4/avi 格式；U 盘单独密封，投标截止前递交交易中心。</div></div>`;
 document.body.appendChild(box);
 window.DEMO_STEPS=steps;
})();
/* 初始会话渲染 */
aiRender();
/* 用增强版重新渲染当前页（驾驶舱核心指标区/三维园区/能流碳流/信息概览即刻生效），并保持用户已切换的页签不被覆盖（防加载期吞点击） */
go(curPage);
(function(){const t=document.querySelector(".tab.on");if(t){const R=(typeof RENDERERS!=="undefined")&&RENDERERS[t.dataset.t];if(R){const b=document.getElementById("tabBody");if(b)b.innerHTML=R();}}})();
/* AI 页需在渲染后再填充会话消息（aiRender 依赖 chatList 存在） */
if(curPage==="aiAgent")aiRender();
