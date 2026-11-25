/* ================= c10a 平台外壳升级：品牌顶栏 / 状态栏 / 文本净化 / 图表细节 / 功能导览 ================= */
(function(){
/* ---------- 全局样式 ---------- */
document.head.insertAdjacentHTML("beforeend",`<style id="c10a-css">
.logo{display:flex;align-items:center;gap:10px;padding:16px 14px 14px!important;}
.logo .lg-ic{width:36px;height:36px;border-radius:10px;flex:none;background:linear-gradient(135deg,#0B6EC5,#2DD4BF);display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(11,110,197,.35);}
.logo .lg-ic svg{width:22px;height:22px;}
.logo .lg-t{min-width:0;}
.logo .lg-t h1{font-size:15px!important;line-height:1.3;letter-spacing:1px!important;white-space:nowrap;margin:0;}
.logo .lg-t h1 em{display:block;font-style:normal;font-size:12.5px;letter-spacing:.5px;color:var(--txt2);font-weight:600;margin-top:1px;}
.logo .lg-t p{font-size:10px!important;margin-top:2px!important;letter-spacing:.3px;opacity:.85;white-space:nowrap;}
.nav-item .req{display:none!important;}
.topbar .crumb{font-size:12px;color:var(--txt3);margin-right:-6px;}
.topbar .crumb b{font-weight:400;}
.tb-pill{display:flex;align-items:center;gap:6px;font-size:12px;padding:4px 10px;border-radius:14px;border:1px solid rgba(45,212,191,.35);background:rgba(45,212,191,.08);color:#0F9F8C;white-space:nowrap;}
.tb-pill i{width:7px;height:7px;border-radius:50%;background:#22C55E;box-shadow:0 0 0 0 rgba(34,197,94,.6);animation:tbp 1.8s infinite;}
@keyframes tbp{0%{box-shadow:0 0 0 0 rgba(34,197,94,.55);}70%{box-shadow:0 0 0 7px rgba(34,197,94,0);}100%{box-shadow:0 0 0 0 rgba(34,197,94,0);}}
.tb-bell{position:relative;cursor:pointer;font-size:16px;line-height:1;padding:4px 6px;border-radius:6px;}
.tb-bell:hover{background:rgba(56,189,248,.12);}
.tb-bell em{position:absolute;top:-4px;right:-6px;min-width:16px;height:16px;padding:0 4px;border-radius:8px;background:#EF4444;color:#fff;font-size:10px;font-style:normal;line-height:16px;text-align:center;}
.tb-user{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--txt2);cursor:default;white-space:nowrap;}
.tb-user .av{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#0B6EC5,#38BDF8);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;}
.tb-user small{display:block;font-size:10px;color:var(--txt3);}
.sb-foot{padding:10px 14px;border-top:1px solid var(--line);font-size:10.5px;color:var(--txt3);line-height:1.7;}
.sb-foot b{color:var(--txt2);font-weight:600;}
/* 驾驶舱：能流/碳流卡不再上下留白 */
.fs-fill-body{justify-content:flex-start!important;}
#flowBox .sk-card{margin-bottom:0;}
/* 功能导览（低调悬浮按钮，可用 Alt+H 隐藏，录屏时不干扰画面） */
.qw-tour-fab{position:fixed;right:16px;bottom:16px;z-index:90;width:40px;height:40px;border-radius:50%;border:none;cursor:pointer;background:rgba(11,110,197,.88);color:#fff;font-size:17px;box-shadow:0 6px 18px rgba(11,110,197,.4);opacity:.55;transition:opacity .2s,transform .2s;}
.qw-tour-fab:hover{opacity:1;transform:scale(1.06);}
body.qw-clean .qw-tour-fab,body.qw-clean .qw-tour{display:none!important;}
.qw-tour{position:fixed;right:16px;bottom:64px;width:300px;max-height:70vh;overflow-y:auto;z-index:91;background:rgba(13,25,45,.97);border:1px solid rgba(64,120,190,.45);border-radius:12px;padding:12px;display:none;box-shadow:0 18px 40px rgba(2,8,20,.55);color:#DCE8F5;}
.qw-tour.open{display:block;}
.qw-tour h4{font-size:13px;margin:2px 2px 10px;color:#fff;}
.qw-tour .st{display:flex;gap:10px;align-items:flex-start;padding:8px;border-radius:8px;cursor:pointer;border:1px solid transparent;}
.qw-tour .st:hover{background:rgba(56,189,248,.08);border-color:rgba(56,189,248,.35);}
.qw-tour .st i{flex:none;width:22px;height:22px;border-radius:50%;background:#0B6EC5;color:#fff;font-style:normal;font-size:12px;display:flex;align-items:center;justify-content:center;}
.qw-tour .st b{display:block;font-size:12.5px;}
.qw-tour .st span{display:block;font-size:11px;color:#8FA8C4;line-height:1.6;margin-top:2px;}
.qw-tour .ft{font-size:10.5px;color:#5D7A9C;margin-top:6px;padding:0 4px;}
/* 通用小组件 */
.qw-chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;}
.qw-chip{font-size:11.5px;padding:4px 10px;border-radius:12px;background:rgba(56,189,248,.1);border:1px solid rgba(56,189,248,.3);color:var(--txt2);}
.qw-chip b{color:var(--cyan);font-family:Consolas,monospace;margin-left:4px;}
body.fs .qw-chip{color:#BFD6EC;}
.qw-toast{position:fixed;left:50%;top:70px;transform:translateX(-50%);z-index:300;background:rgba(13,25,45,.95);color:#DCE8F5;border:1px solid rgba(56,189,248,.5);padding:9px 18px;border-radius:20px;font-size:13px;box-shadow:0 10px 28px rgba(2,8,20,.5);opacity:0;transition:opacity .25s;pointer-events:none;}
.qw-toast.show{opacity:1;}
.topo .node{fill:#14305A!important;stroke:#3B82C4;stroke-width:1.2;}
.topo .node-t{fill:#E2ECF8!important;font-size:11px;font-weight:600;stroke:none!important;}
.topo .node-val{fill:#5EEAD4!important;stroke:none!important;font-size:9.5px;}
.topo text{stroke:none;}
</style>`);

/* ---------- 品牌区 ---------- */
const logo=document.querySelector(".sidebar .logo");
if(logo)logo.innerHTML=`<div class="lg-ic"><svg viewBox="0 0 24 24" fill="none"><path d="M12 2c4 3.5 6 6.8 6 10a6 6 0 1 1-12 0c0-3.2 2-6.5 6-10z" fill="rgba(255,255,255,.92)"/><path d="M12 8v9M12 13l-3-2.5M12 15l3-2.5" stroke="#0B6EC5" stroke-width="1.8" stroke-linecap="round"/></svg></div>
 <div class="lg-t"><h1>苏银产业园<em>AI 零碳数智平台</em></h1><p>SUYIN ZERO-CARBON PLATFORM</p></div>`;
const sb=document.querySelector(".sidebar");
if(sb&&!sb.querySelector(".sb-foot"))sb.insertAdjacentHTML("beforeend",`<div class="sb-foot"><b>苏银产业园管理委员会</b><br>平台版本 V2.3.1 · 数据更新 <span id="sbUpd"></span></div>`);

/* ---------- 顶栏：面包屑 / 采集状态 / 告警 / 用户 ---------- */
const tr=document.querySelector(".topbar-right");
if(tr&&!document.getElementById("tbPill")){
 tr.insertAdjacentHTML("afterbegin",`<span class="tb-pill" id="tbPill"><i></i>数据采集正常 · 在线 <b id="tbOnline">327</b>/333</span>
  <span class="tb-bell" title="能碳告警" onclick="go('alarm')">🔔<em id="tbAlarm">9</em></span>`);
 tr.insertAdjacentHTML("beforeend",`<span class="tb-user"><span class="av">管</span><span>园区管委会 · 管理员<small>经发局 · 双碳专班</small></span></span>`);
}
const tb=document.querySelector(".topbar");
if(tb&&!tb.querySelector(".crumb")){const h=tb.querySelector("h2");h.insertAdjacentHTML("beforebegin",`<span class="crumb" id="tbCrumb"></span>`);}

/* 页面副标题（正式产品描述，替代需求映射文字） */
const SUBS={dashboard:"园区级能碳运行监测",oneMap:"GIS 瓦片地图 · 园区能碳全要素",multi:"趋势 · 结构 · 核算范围 · 排序 · 对标",
 alarm:"告警统计 · 告警列表 · 闭环处置",assess:"零碳园区指标体系 · 碳达峰碳中和综合评价",path:"情景推演 · 效益分析 · 模型管理",
 report:"年度 / 季度 / 月度碳排放报告",entHome:"企业能碳运行态势",entQuery:"能源系统动态感知 · 能源监测 · 碳排监测",
 entAI:"能源消费分析 · 用能策略推荐",entBench:"能效对标 · 能流分析 · 碳流分析",entCarbon:"碳核算 · 产品碳足迹 · 核查支撑",
 entAsset:"碳配额 · CCER · 绿证 · 绿电 · 碳交易",aiAgent:"零碳园区专用大模型 · 专业智能体",iot:"设备管理 · 规则引擎 · 网关管理 · 数据服务 · 远程维护"};
if(typeof NAV!=="undefined")NAV.forEach(g=>g.items.forEach(it=>{it.sub=SUBS[it.id]||"";it.req="";}));
const GRP={};if(typeof NAV!=="undefined")NAV.forEach(g=>g.items.forEach(it=>GRP[it.id]=g.group));

/* ---------- 文本净化：清除残留的评分 / 需求映射 / 投标提示（运行时兜底） ---------- */
const CLEAN=[
 [/（?演示评分点[①②③④⑤][：:]?[^）\n]*）?/g,""],[/（?(?:对应)?需求\s*#[\d#–\-、\s]+[^）\n]*）?/g,""],
 [/——?需(?:提供)?系统截图佐证。?/g,""],[/（需源代码交付项）/g,""],[/▲?需源代码/g,""],
 [/（(?:追问可继续|可继续追问)：[^）]*）/g,""],[/演示环境[^。\n]*。?/g,""],[/▲\s*重要参数提示/g,"智能体能力"]];
function cleanText(s){CLEAN.forEach(([r,t])=>{s=s.replace(r,t);});return s;}
window.qwClean=function(root){
 if(!root)return;
 root.querySelectorAll(".tag.star,.req-badge").forEach(e=>e.remove());
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null);let n;const arr=[];
 while((n=w.nextNode()))if(/评分点|需求\s*#|截图佐证|需源代码|追问可继续|可继续追问|演示环境|重要参数提示/.test(n.nodeValue))arr.push(n);
 arr.forEach(n=>{n.nodeValue=cleanText(n.nodeValue);});
 root.querySelectorAll("[title]").forEach(e=>{const t=e.getAttribute("title");if(/评分点|需求\s*#/.test(t))e.setAttribute("title",cleanText(t));});
 root.querySelectorAll("input[placeholder]").forEach(e=>{e.placeholder=cleanText(e.placeholder);});
};
const _sm=window.showModal;
window.showModal=function(title,html){_sm(cleanText(title),html);setTimeout(()=>qwClean(document.getElementById("modalBox")),0);};

/* ---------- go() 包装：面包屑、净化、全屏顶栏文案 ---------- */
const _go=window.go;
window.go=function(id){
 const r=_go(id);
 const c=document.getElementById("tbCrumb");if(c)c.innerHTML=(GRP[id]||"")+" /";
 const ps=document.getElementById("pageSub");if(ps)ps.textContent=SUBS[id]||"";
 const content=document.getElementById("content");
 qwClean(content);setTimeout(()=>qwClean(content),400);
 const fsub=document.querySelector(".fs-sub");
 if(fsub)fsub.innerHTML=`园区级能碳运行监测 · 数据更新 <span class="qw-upd"></span> · 采集在线率 98.2%　<span style="opacity:.6">ESC 返回系统</span>`;
 updClock();
 return r;};

function updClock(){const d=new Date();const p=n=>String(n).padStart(2,"0");
 const s=p(d.getHours())+":"+p(d.getMinutes())+":"+String(Math.floor(d.getSeconds()/10)*10).padStart(2,"0");
 document.querySelectorAll(".qw-upd,#sbUpd").forEach(e=>e.textContent=s);
 const on=document.getElementById("tbOnline");if(on)on.textContent=326+Math.round(Math.random()*2);}
setInterval(updClock,5000);updClock();

/* ---------- 轻提示 ---------- */
window.qwToast=function(msg,ms){let t=document.querySelector(".qw-toast");if(!t){t=document.createElement("div");t.className="qw-toast";document.body.appendChild(t);}
 t.textContent=msg;t.classList.add("show");clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove("show"),ms||2200);};

/* ---------- 环形图：中心显示合计+单位；百分比数据显示主导项；图例去重 ---------- */
window.donut=function(data,size=150,thick=22,center){
 const SEM={"紧急":"#EF4444","离线":"#EF4444","重要":"#F59E0B","告警":"#F59E0B","次要":"#38BDF8","在线":"#14B8A6"};
 const colr=(d,i)=>d.c||(data.every(x=>SEM[x.k])?SEM[d.k]:PALETTE[i%8]);
 const total=data.reduce((s,d)=>s+d.v,0);
 const units=[...new Set(data.map(d=>(d.u||"").trim()))];
 const isPct=units.length===1&&units[0]==="%";
 const unit=units.length===1?units[0]:"";
 let ct,cs;
 if(center){ct=center.v;cs=center.s;}
 else if(isPct){const top=[...data].sort((a,b)=>b.v-a.v)[0];ct=top.v+"%";cs=top.k+"占比";}
 else{ct=String(+total.toFixed(2));cs="合计"+(unit?"（"+unit+"）":"");}
 const legend=data.map((d,i)=>`<span><i style="background:${colr(d,i)}"></i>${d.k} ${isPct?d.v+"%":d.v+(d.u||"")+" · "+(d.v/total*100).toFixed(1)+"%"}</span>`).join("");
 if(!echOK())return _svgDonut(data,size,thick);
 return echPlace(size,inst=>{inst.setOption({
  backgroundColor:"transparent",tooltip:Object.assign({trigger:"item",formatter:p=>`${p.name}：${p.value}${isPct?"%":unit?" "+unit:""}（${p.percent}%）`},TT()),
  title:{text:ct,subtext:cs,left:"center",top:"34%",itemGap:4,
   textStyle:{color:uiFS()?"#fff":"#1B2B3F",fontSize:size>=200?20:15,fontWeight:700,fontFamily:"DIN Alternate,Consolas,Microsoft YaHei"},subtextStyle:{color:ETXT3(),fontSize:10}},
  series:[{type:"pie",radius:["62%","86%"],center:["50%","52%"],
   itemStyle:{borderRadius:6,borderColor:uiFS()?"#101F35":"#FFFFFF",borderWidth:2},
   label:{show:false},emphasis:{scale:true,scaleSize:6},
   data:data.map((d,i)=>({name:d.k,value:d.v,itemStyle:{color:colr(d,i)}}))}]});
 },_svgDonut(data,size,thick),`<div class="legend">${legend}</div>`);
};


/* ---------- 柱线组合图：图例与坐标轴标题不再重叠 ---------- */
window.comboBarLine=function(labels,barName,bar,lineName,line,h=220,w=520,u1="",u2=""){
 if(!echOK())return _svgCombo(labels,barName,bar,lineName,line,h,w,u1,u2);
 return echPlace(h,inst=>{inst.setOption({
  backgroundColor:"transparent",tooltip:Object.assign({trigger:"axis",axisPointer:{type:"shadow"}},TT()),
  legend:{top:0,left:"center",textStyle:{color:ETXT2(),fontSize:11},itemWidth:14,itemHeight:8,icon:"roundRect"},
  grid:{left:50,right:50,top:50,bottom:24},
  xAxis:Object.assign({type:"category",data:labels},axCommon()),
  yAxis:[Object.assign({type:"value",name:u1||"",nameGap:10,nameTextStyle:{color:ETXT3(),fontSize:10,align:"right"}},axCommon(),splitX()),
         Object.assign({type:"value",name:(lineName.match(/\(([^)]*)\)/)||[])[1]||u2||"",nameGap:10,nameTextStyle:{color:ETXT3(),fontSize:10,align:"left"}},axCommon(),{splitLine:{show:false}})],
  series:[
   {name:barName,type:"bar",data:bar,barMaxWidth:26,itemStyle:{borderRadius:[4,4,0,0],color:vgrad("#38BDF8","#1D5FA8")},tooltip:{valueFormatter:v=>v+(u1?" "+u1:"")}},
   {name:lineName,type:"line",data:line,yAxisIndex:1,smooth:true,symbol:"circle",symbolSize:7,
    lineStyle:{width:2.5,color:"#FBBF24",shadowColor:"rgba(251,191,36,.5)",shadowBlur:8},
    itemStyle:{color:"#FBBF24",borderColor:uiFS()?"#0A1628":"#FFFFFF",borderWidth:1},tooltip:{valueFormatter:v=>v+(u2?" "+u2:"")}}]});
 },_svgCombo(labels,barName,bar,lineName,line,h,w,u1,u2));
};

/* ---------- 功能导览：替换原「评分点导航」，改为产品化的功能导航 ---------- */
document.querySelectorAll(".demo-fab,.demo-panel").forEach(e=>{const p=e.parentElement;e.remove();if(p&&p!==document.body&&!p.children.length)p.remove();});
const TOUR=[
 {t:"能碳总览驾驶舱",d:"数字孪生园区 · 能流/碳流 · 核心指标 · 信息概览",id:"dashboard"},
 {t:"能碳全景一张图",d:"GIS 瓦片地图 · 片区划分 · 企业搜索 · 时间轴播放",id:"oneMap"},
 {t:"多维能碳分析",d:"趋势 · 结构 · 核算范围 · 企业排序 · 对标",id:"multi"},
 {t:"碳排放报告",d:"年/季/月 · 时间戳 · 在线预览 · PDF/Word 下载",id:"report"},
 {t:"AI 大模型智能体",d:"语音唤醒 · 多轮问答 · 图表回答 · 附件解析",id:"aiAgent"}];
const tw=document.createElement("div");
tw.innerHTML=`<button class="qw-tour-fab" title="功能导览（Alt+H 隐藏）" onclick="document.querySelector('.qw-tour').classList.toggle('open')">☰</button>
 <div class="qw-tour"><h4>功能导览</h4>${TOUR.map((s,i)=>`<div class="st" onclick="go('${s.id}');document.querySelector('.qw-tour').classList.remove('open')"><i>${i+1}</i><div><b>${s.t}</b><span>${s.d}</span></div></div>`).join("")}
 <div class="ft">Alt + H 隐藏/显示本按钮</div></div>`;
document.body.appendChild(tw);
document.addEventListener("keydown",e=>{if(e.altKey&&(e.key==="h"||e.key==="H")){document.body.classList.toggle("qw-clean");e.preventDefault();}});
window.DEMO_STEPS=TOUR.map(s=>({t:s.t,pts:s.d,act:()=>go(s.id)}));
})();
