/* ================= 桑基图（能流图 / 碳流图）通用组件 ================= */
/* 保留桑基图本体样式：左侧彩色竖条源节点 + 半透明流带（贝塞尔 ribbon）+ 右侧汇聚竖条节点；
   外壳跟随页面深色主题（var(--panel)/var(--line)），弹窗内可用裸图模式（透明背景） */
(function(){
 var css=`
 .sk-card{background:var(--panel);border:1px solid var(--line);border-radius:6px;margin:0 0 14px;overflow:hidden;}
 .sk-hd{display:flex;align-items:center;gap:10px;padding:13px 16px 11px;border-bottom:1px solid var(--line);flex-wrap:wrap;}
 .sk-hd b{font-size:15px;font-weight:700;color:#FFFFFF;letter-spacing:.5px;}
 .sk-hd .sk-sub{font-size:12px;color:var(--txt2);margin-left:2px;}
 .sk-tools{display:flex;align-items:center;gap:10px;margin-left:auto;flex-wrap:wrap;}
 .sk-tools .sk-dim{font-size:12px;color:var(--txt2);font-weight:600;}
 .sk-co{font-size:13px;color:var(--cyan);font-weight:600;cursor:pointer;letter-spacing:.3px;}
 .sk-co:hover{text-decoration:underline;}
 .sk-sel{border:1px solid var(--line);border-radius:5px;background:var(--panel2);color:var(--txt);font-size:12px;padding:4px 10px;outline:none;cursor:pointer;}
 .sk-sel:hover{border-color:#38BDF8;}
 .sk-legend{font-size:11px;color:var(--txt3);}
 .sk-body{padding:8px 16px 10px;}
 .sk-body svg,.sk-bare svg{width:100%;height:auto;display:block;}
 .sk-bare{width:100%;}
 .sk-lb,.sk-rlb{font-size:14px;fill:#DCE8F5;font-weight:600;paint-order:stroke;stroke:rgba(10,22,40,.78);stroke-width:3px;}
 .sk-nv{font-size:11px;fill:#BFD6EC;font-family:Consolas,"Microsoft YaHei",monospace;font-weight:400;paint-order:stroke;stroke:rgba(10,22,40,.8);stroke-width:2.5px;}
 .sk-val{font-size:11px;fill:#BFD6EC;font-family:Consolas,"Microsoft YaHei",monospace;}
 .sk-pill{fill:rgba(10,22,40,.88);stroke:#1E3A5C;stroke-width:1;}
 .sk-ribbon{transition:opacity .18s;}
 .sk-ribbon:hover{opacity:.7;cursor:pointer;}
 .sk-node rect:hover{opacity:.82;cursor:pointer;}
 .sk-note{padding:2px 16px 14px;font-size:12px;color:var(--txt2);line-height:1.75;}
 `;
 document.head.insertAdjacentHTML("beforeend","<style>"+css+"</style>");
})();

/* 时间维度：年度 / 季度 / 月度，按系数缩放流量数值（结构与占比保持守恒） */
const SK_SCALE={y:1,q:0.26,m:0.085};
const SK_LB={y:"年度",q:"季度",m:"月度"};
const SANKEY_STATE={};

/* 数据：left/right 为节点（color=竖条色，fill=流带浅色）；links=[源序号,汇序号,流量]
   节点高度与流带厚度全部由 links 自动推导，保证流量守恒、左右对齐 */
const SANKEY_DATA={
 /* 驾驶舱 · 能流图（园区级） */
 dash_en:{
  title:"能流分析",sub:"园区级 · 主要能源品种流向",unit:"万tce",h:330,gapL:24,gapR:28,
  left:[{name:"汽油",color:"#F3C04A",fill:"rgba(243,192,74,.42)"},{name:"柴油",color:"#5AA6DC",fill:"rgba(90,166,220,.42)"},
        {name:"天然气",color:"#F58F6E",fill:"rgba(245,143,110,.42)"},{name:"电力",color:"#9B6FC4",fill:"rgba(155,111,196,.45)"}],
  right:[{name:"化石燃料燃烧",color:"#2E9E63"},{name:"购入电力",color:"#2F7FD1"}],
  links:[[0,0,2.4],[1,0,2.1],[2,0,4.6],[3,1,8.9]],
  note:"按能源品种归集至化石燃料燃烧与购入电力两类核算路径，流带宽度对应折标后的综合能耗量；与碳排放核算共用同一套能源台账，保证一张图上的指标数据可直接用于零碳园区创建评价。在「切换对象」中选择具体企业，可查看该企业差异化的能流结构，并点击节点或按钮下钻企业画像。"
 },
 /* 驾驶舱 · 碳流图（园区级） */
 dash_co:{
  title:"碳流分析",sub:"园区级 · 碳排放按核算范围归集",unit:"万tCO₂",h:330,gapL:24,gapR:28,
  left:[{name:"范围一 · 燃料燃烧",color:"#F87171",fill:"rgba(248,113,113,.42)"},{name:"范围一 · 工艺过程",color:"#FBBF24",fill:"rgba(251,191,36,.40)"},
        {name:"范围二 · 外购电力",color:"#38BDF8",fill:"rgba(56,189,248,.42)"},{name:"范围二 · 外购热力",color:"#A78BFA",fill:"rgba(167,139,250,.42)"}],
  right:[{name:"直接排放（范围一）",color:"#2E9E63"},{name:"间接排放（范围二）",color:"#2F7FD1"}],
  links:[[0,0,11.2],[1,0,5.7],[2,1,21.5],[3,1,3.9]],
  note:"范围一直接排放 16.9 万tCO₂、范围二间接排放 25.4 万tCO₂，合计 42.3 万tCO₂；排放因子与折标系数由系统统一版本管理，核算结果与碳考核评价体系共用同一套口径，可直接用于年度评价与报告编制。在「切换对象」中选择具体企业，可查看该企业范围一/二排放结构，并点击节点或按钮下钻企业画像。"
 }
};

function skFmt(v){return (Math.round(v*10)/10).toFixed(1);}

/* 生成桑基图 SVG（纯字符串，无外部依赖；支持 W/xL/xRm 紧凑参数适配弹窗小图） */
function sankeySvg(key,period){
 const d=SANKEY_DATA[key];if(!d)return "";
 const k=SK_SCALE[period]||1;
 const W=d.W||980,H=d.h||330,PT=16,PB=16,nW=13;
 const xL=d.xL!=null?d.xL:62,xRm=d.xRm!=null?d.xRm:172;
 const xR=W-xRm,x0=xL+nW,x1=xR,cx=(x0+x1)/2;
 const gapL=d.gapL||24,gapR=d.gapR||28;
 const links=d.links.map(l=>({li:l[0],ri:l[1],v:l[2]}));
 const lv=d.left.map((_,i)=>links.filter(l=>l.li===i).reduce((s,l)=>s+l.v,0));
 const rv=d.right.map((_,j)=>links.filter(l=>l.ri===j).reduce((s,l)=>s+l.v,0));
 const total=links.reduce((s,l)=>s+l.v,0)||1;
 const avail=H-PT-PB;
 const scale=Math.min((avail-gapL*(d.left.length-1))/total,(avail-gapR*(d.right.length-1))/total);
 const lh=total*scale+gapL*(d.left.length-1),rh=total*scale+gapR*(d.right.length-1);
 const yL=PT+(avail-lh)/2,yR=PT+(avail-rh)/2;
 let cy=yL;const LN=d.left.map((n,i)=>{const h=lv[i]*scale;const o={y:cy,h:h};cy+=h+gapL;return o;});
 cy=yR;const RN=d.right.map((n,j)=>{const h=rv[j]*scale;const o={y:cy,h:h};cy+=h+gapR;return o;});
 const offL=d.left.map(()=>0),offR=d.right.map(()=>0);
 let ribbons="",labels="";
 links.forEach((l,li)=>{
  const t=l.v*scale,a=LN[l.li].y+offL[l.li],b=RN[l.ri].y+offR[l.ri];
  offL[l.li]+=t;offR[l.ri]+=t;
  const s=d.left[l.li],tn=d.right[l.ri],val=skFmt(l.v*k);
  const p=`M ${x0} ${a} C ${cx} ${a}, ${cx} ${b}, ${x1} ${b} L ${x1} ${b+t} C ${cx} ${b+t}, ${cx} ${a+t}, ${x0} ${a+t} Z`;
  ribbons+=`<path class="sk-ribbon" d="${p}" fill="${s.fill}" stroke="rgba(10,22,40,.9)" stroke-width="1"><title>${s.name} → ${tn.name}：${val} ${d.unit}</title></path>`;
  /* 多流带交汇时，数值标签沿横向分列错开，避免挤成一竖列 */
  const lx=x0+(x1-x0)*(0.23+(li%3)*0.145),ly=(a+b)/2+t/2,tw=Math.max(46,val.length*7+18);
  labels+=`<g><rect class="sk-pill" x="${(lx-tw/2).toFixed(1)}" y="${(ly-10).toFixed(1)}" width="${tw}" height="20" rx="10"/><text class="sk-val" x="${lx.toFixed(1)}" y="${(ly+4).toFixed(1)}" text-anchor="middle">${val}</text></g>`;
 });
 let nodes="";
 const drill=d.drill?` onclick="coModal(${d.drill})" style="cursor:pointer"`:"";
 const drillTip=d.drill?`<title>${d.drillTip||"点击下钻企业画像"}</title>`:"";
 d.left.forEach((n,i)=>{const o=LN[i];
  const nv=d.showNV===false?"":`<text class="sk-nv" x="${x0+14}" y="${(o.y+o.h/2+18).toFixed(1)}">${skFmt(lv[i]*k)} ${d.unit}</text>`;
  nodes+=`<g class="sk-node"${drill}>${drillTip}<rect x="${xL}" y="${o.y.toFixed(1)}" width="${nW}" height="${Math.max(o.h,2).toFixed(1)}" rx="2" fill="${n.color}"><title>${n.name}：${skFmt(lv[i]*k)} ${d.unit}</title></rect>`+
   `<text class="sk-lb" x="${x0+14}" y="${(o.y+o.h/2+5).toFixed(1)}">${n.name}</text>${nv}</g>`;});
 d.right.forEach((n,j)=>{const o=RN[j];
  const nv=d.showNV===false?"":`<text class="sk-nv" x="${xR+nW+14}" y="${(o.y+o.h/2+18).toFixed(1)}">${skFmt(rv[j]*k)} ${d.unit}</text>`;
  nodes+=`<g class="sk-node"${drill}>${drillTip}<rect x="${xR}" y="${o.y.toFixed(1)}" width="${nW}" height="${Math.max(o.h,2).toFixed(1)}" rx="2" fill="${n.color}"><title>${n.name}：${skFmt(rv[j]*k)} ${d.unit}</title></rect>`+
   `<text class="sk-rlb" x="${xR+nW+14}" y="${(o.y+o.h/2+5).toFixed(1)}">${n.name}</text>${nv}</g>`;});
 return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${d.title}">${ribbons}${labels}${nodes}</svg>`;
}

/* 生成深色主题卡片（跟随页面 var(--panel)/var(--line)，不再复刻截图白卡外壳） */
function sankeyChart(key){
 const d=SANKEY_DATA[key];if(!d)return "";
 const p=SANKEY_STATE[key]||"y";
 const opts=Object.keys(SK_LB).map(k=>`<option value="${k}" ${k===p?"selected":""}>${SK_LB[k]}</option>`).join("");
 return `<div class="sk-card">
  <div class="sk-hd"><b>${d.title}</b><span class="sk-sub">${d.sub||""}</span>
   <div class="sk-tools"><span class="sk-dim">时间维度</span>
   <select class="sk-sel" onchange="sankeySwitch('${key}',this.value)">${opts}</select>
   <span class="sk-legend">单位：${d.unit} · 流带宽度表示流量大小 · 悬停查看明细</span></div></div>
  <div class="sk-body" id="sk-body-${key}">${sankeySvg(key,p)}</div>
  ${d.note?`<div class="sk-note">${d.note}</div>`:""}
 </div>`;
}
/* 裸图模式（无卡片外壳，透明背景）：用于企业下钻弹窗等深色容器内嵌 */
function sankeyBare(key,period){
 const d=SANKEY_DATA[key];if(!d)return "";
 return `<div class="sk-bare" id="sk-body-${key}">${sankeySvg(key,period||SANKEY_STATE[key]||"y")}</div>`;
}
function sankeySwitch(key,p){SANKEY_STATE[key]=p;const b=document.getElementById("sk-body-"+key);if(b)b.innerHTML=sankeySvg(key,p);}

/* ============ 企业级桑基图：按企业差异化模拟 + 企业切换 + 画像下钻 ============ */
const ENT_SK_STATE={en:{id:1},co:{id:1}};
const ENT_SK_PERIOD={en:"y",co:"y"};
/* 确定性伪随机（按企业 id 派生 0–1 小数），保证同一企业每次渲染数据一致 */
function skSeed(cid,n){return ((cid*7+n*13)%97)/97;}
/* 企业结构参数（按 id 确定性派生）：能源购入四类占比 + 能源损失率 + 碳排范围一/二结构 */
function entStruct(cid){
 const S=n=>skSeed(cid,n);
 let pE=40+Math.round(S(1)*14),pG=18+Math.round(S(2)*8),pS=12+Math.round(S(3)*10);
 pS=Math.min(pS,100-pE-pG-8);
 return {pE:pE,pG:pG,pS:pS,pR:100-pE-pG-pS,
  loss:15+Math.round(S(4)*9),
  ind:52+Math.round(S(1)*14),   /* 范围二间接排放占比 52–66% */
  pPow:74+Math.round(S(2)*10),  /* 间接排放中外购电力占比 */
  pProc:28+Math.round(S(3)*18)  /* 范围一中工艺过程占比 */};
}
/* 按企业生成能流/碳流数据集：总量取企业真实台账值（c.en 万tce / c.co 万tCO₂），结构按企业特征差异化 */
function entSankeyData(cid,mode){
 const c=(typeof COMPANIES!=="undefined"?COMPANIES:[]).find(x=>x.id===cid)||{id:0,name:"示例企业",ind:"综合",eg:"B",en:2.0,co:4.0,red:20,meas:"—"};
 const t=entStruct(c.id);
 if(mode==="en"){
  /* 能源购入结构：电力/燃气/蒸汽/绿电占比按企业差异化，损失率 15–24% */
  const use=100-t.loss;
  const v=x=>+(c.en*x/100).toFixed(2);
  const links=[];
  [[0,t.pE],[1,t.pG],[2,t.pS],[3,t.pR]].forEach(([i,p])=>{links.push([i,0,v(p*use/100)]);links.push([i,1,v(p*t.loss/100)]);});
  return {title:"能流分析",sub:`${c.name} · ${c.ind} · 能效 ${c.eg} 级`,unit:"万tce",h:330,gapL:24,gapR:28,drill:c.id,drillTip:"点击下钻 "+c.name+" 企业画像",
   left:[{name:"外购电力",color:"#9B6FC4",fill:"rgba(155,111,196,.45)"},{name:"天然气",color:"#F58F6E",fill:"rgba(245,143,110,.42)"},
         {name:"外购蒸汽",color:"#5AA6DC",fill:"rgba(90,166,220,.42)"},{name:"绿电/可再生能源",color:"#2E9E63",fill:"rgba(46,158,99,.42)"}],
   right:[{name:"有效利用",color:"#2F7FD1"},{name:"能源损失",color:"#F87171"}],
   links:links,
   note:`${c.name}综合能耗 ${c.en} 万tce，绿电及可再生能源占比 ${t.pR}%，能源损失率 ${t.loss}%（行业同期能效 ${c.eg} 级水平）；损失构成可下钻至空压站、管网散热、变配电损耗等重点环节。切换企业查看不同能源结构，点击图上任一节点或「下钻企业画像」查看该企业能碳画像、实时数据与减排措施。`};
 }
 /* 碳流：范围一直接排放（100-ind） / 范围二间接排放（ind）按企业差异化拆分 */
 const v=x=>+(c.co*x/100).toFixed(2);
 return {title:"碳流分析",sub:`${c.name} · ${c.ind} · 因子库计算`,unit:"万tCO₂",h:300,gapL:26,gapR:30,drill:c.id,drillTip:"点击下钻 "+c.name+" 企业画像",
  left:[{name:"范围一 · 天然气燃烧",color:"#F87171",fill:"rgba(248,113,113,.42)"},{name:"范围一 · 工艺过程",color:"#FBBF24",fill:"rgba(251,191,36,.40)"},
        {name:"范围二 · 外购电力",color:"#38BDF8",fill:"rgba(56,189,248,.42)"},{name:"范围二 · 外购热力",color:"#A78BFA",fill:"rgba(167,139,250,.42)"}],
  right:[{name:"直接排放（范围一）",color:"#2E9E63"},{name:"间接排放（范围二）",color:"#2F7FD1"}],
  links:[[0,0,v((100-t.pProc)*(100-t.ind)/100)],[1,0,v(t.pProc*(100-t.ind)/100)],
         [2,1,v(t.pPow*t.ind/100)],[3,1,v((100-t.pPow)*t.ind/100)]],
  note:`${c.name}碳排放 ${c.co} 万tCO₂，较基准年累计下降 ${c.red}%；直接排放 ${v(100-t.ind)} 万tCO₂、间接排放 ${v(t.ind)} 万tCO₂（外购电力为主），排放因子由系统统一版本管理。减排措施：${c.meas}。切换企业对比排放结构，点击图上任一节点或「下钻企业画像」查看明细。`};
}
/* 弹窗内嵌小桑基图：与所选企业共用同一套能源结构参数（电/热/气/绿电氢），透明背景裸图 */
function entMiniSankey(cid){
 const c=(typeof COMPANIES!=="undefined"?COMPANIES:[]).find(x=>x.id===cid)||{id:cid,name:"示例企业"};
 const key="entmini_"+cid;
 if(!SANKEY_DATA[key]){
  const t=entStruct(cid);
  SANKEY_DATA[key]={title:`${c.name} · 企业能流图`,sub:"",unit:"%",W:480,h:210,xL:8,xRm:182,gapL:20,gapR:16,showNV:false,
   left:[{name:"电网接入",color:"#38BDF8",fill:"rgba(56,189,248,.35)"},{name:"热力管网",color:"#F87171",fill:"rgba(248,113,113,.35)"},
         {name:"燃气门站",color:"#FBBF24",fill:"rgba(251,191,36,.32)"},{name:"绿电 / 制氢",color:"#2DD4BF",fill:"rgba(45,212,191,.35)"}],
   right:[{name:c.name,color:"#2F7FD1"}],
   links:[[0,0,t.pE],[1,0,t.pS],[2,0,t.pG],[3,0,t.pR]],note:""};
 }
 return sankeyBare(key);
}
/* 企业级桑基卡片：头部含企业名（可点击下钻）+ 企业切换 + 下钻按钮 + 时间维度 */
function entSankeyChart(mode){
 const cid=ENT_SK_STATE[mode].id,p=ENT_SK_PERIOD[mode]||"y";
 const key=(mode==="co"?"entco_":"enten_")+cid;
 if(!SANKEY_DATA[key])SANKEY_DATA[key]=entSankeyData(cid,mode);
 const c=(typeof COMPANIES!=="undefined"?COMPANIES:[]).find(x=>x.id===cid)||{id:cid,name:"示例企业"};
 const d=SANKEY_DATA[key];
 const pOpts=Object.keys(SK_LB).map(k=>`<option value="${k}" ${k===p?"selected":""}>${SK_LB[k]}</option>`).join("");
 const cOpts=(typeof COMPANIES!=="undefined"?COMPANIES:[]).map(x=>`<option value="${x.id}" ${x.id===cid?"selected":""}>${x.name}</option>`).join("");
 return `<div id="ent-sk-${mode}"><div class="sk-card">
  <div class="sk-hd"><b>${d.title}</b>
   <span class="sk-co" onclick="coModal(${cid})" title="点击下钻企业画像">${c.name} · ${(d.sub||"").split("·").slice(1).join("·").trim()}</span>
   <div class="sk-tools"><span class="sk-dim">切换企业</span>
   <select class="sk-sel" onchange="entCoSwitch('${mode}',+this.value)">${cOpts}</select>
   <button class="btn ghost sm" onclick="coModal(${cid})">下钻企业画像 →</button>
   <span class="sk-dim">时间维度</span>
   <select class="sk-sel" onchange="entSkPeriod('${mode}',this.value)">${pOpts}</select>
   <span class="sk-legend">单位：${d.unit} · 流带宽度表示流量大小 · 悬停查看明细</span></div></div>
  <div class="sk-body" id="sk-body-${key}">${sankeySvg(key,p)}</div>
  ${d.note?`<div class="sk-note">${d.note}</div>`:""}
 </div></div>`;
}
function entCoSwitch(mode,id){ENT_SK_STATE[mode].id=id;const box=document.getElementById("ent-sk-"+mode);if(box)box.innerHTML=entSankeyChart(mode);}
function entSkPeriod(mode,p){ENT_SK_PERIOD[mode]=p;const key=(mode==="co"?"entco_":"enten_")+ENT_SK_STATE[mode].id;const b=document.getElementById("sk-body-"+key);if(b)b.innerHTML=sankeySvg(key,p);}

/* ============ 驾驶舱能流/碳流卡：园区整体 ↔ 具体企业双维度 ============ */
/* cid=0 时展示园区级归集图（dash_en/dash_co）；选择具体企业后切换为企业级差异化图并可下钻画像 */
const DASH_FLOW={cid:0,period:"y"};
function dashFlowKey(mode){return DASH_FLOW.cid===0?("dash_"+mode):("dashf_"+mode+"_"+DASH_FLOW.cid);}
function dashFlowChart(mode){
 const cid=DASH_FLOW.cid,p=DASH_FLOW.period,key=dashFlowKey(mode);
 if(!SANKEY_DATA[key])SANKEY_DATA[key]=cid===0?SANKEY_DATA["dash_"+mode]:entSankeyData(cid,mode);
 const d=SANKEY_DATA[key];
 const c=cid===0?null:(typeof COMPANIES!=="undefined"?COMPANIES:[]).find(x=>x.id===cid)||{id:cid,name:"示例企业"};
 const nameHtml=cid===0
  ?`<span class="sk-co" style="cursor:default" title="园区整体为 8 家入驻企业数据归集；选择具体企业后可点击下钻画像">园区整体 · 8 家企业归集</span>`
  :`<span class="sk-co" onclick="coModal(${cid})" title="点击下钻企业画像">${c.name} · ${(d.sub||"").split("·").slice(1).join("·").trim()}</span>`;
 const cOpts=`<option value="0" ${cid===0?"selected":""}>园区整体（全部企业归集）</option>`+
  (typeof COMPANIES!=="undefined"?COMPANIES:[]).map(x=>`<option value="${x.id}" ${x.id===cid?"selected":""}>${x.name}</option>`).join("");
 const pOpts=Object.keys(SK_LB).map(k=>`<option value="${k}" ${k===p?"selected":""}>${SK_LB[k]}</option>`).join("");
 const drillBtn=cid===0
  ?`<span class="sk-legend">选择企业后可下钻画像</span>`
  :`<button class="btn ghost sm" onclick="coModal(${cid})">下钻企业画像 →</button>`;
 return `<div id="dash-flow"><div class="sk-card">
  <div class="sk-hd"><b>${d.title}</b>${nameHtml}
   <div class="sk-tools"><span class="sk-dim">切换对象</span>
   <select class="sk-sel" onchange="dashFlowCo('${mode}',+this.value)">${cOpts}</select>
   ${drillBtn}
   <span class="sk-dim">时间维度</span>
   <select class="sk-sel" onchange="dashFlowPeriod('${mode}',this.value)">${pOpts}</select>
   <span class="sk-legend">单位：${d.unit} · 流带宽度表示流量大小 · 悬停查看明细</span></div></div>
  <div class="sk-body" id="sk-body-${key}">${sankeySvg(key,p)}</div>
  ${d.note?`<div class="sk-note">${d.note}</div>`:""}
 </div></div>`;
}
function dashFlowCo(mode,cid){DASH_FLOW.cid=cid;const box=document.getElementById("dash-flow");if(box)box.innerHTML=dashFlowChart(mode);}
function dashFlowPeriod(mode,p){DASH_FLOW.period=p;const key=dashFlowKey(mode);const b=document.getElementById("sk-body-"+key);if(b)b.innerHTML=sankeySvg(key,p);}
window.sankeyChart=sankeyChart;window.sankeySvg=sankeySvg;window.sankeySwitch=sankeySwitch;window.sankeyBare=sankeyBare;window.SANKEY_DATA=SANKEY_DATA;window.entSankeyChart=entSankeyChart;window.entCoSwitch=entCoSwitch;window.entSkPeriod=entSkPeriod;window.entMiniSankey=entMiniSankey;window.entStruct=entStruct;window.dashFlowChart=dashFlowChart;window.dashFlowCo=dashFlowCo;window.dashFlowPeriod=dashFlowPeriod;
