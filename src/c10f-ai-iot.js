/* ================= c10f AI 智能体（流式回答 · 思考过程 · 语音唤醒浮层）+ 物联网平台 + 企业首页 ================= */
(function(){
document.head.insertAdjacentHTML("beforeend",`<style id="c10f-css">
.ai3{display:grid;grid-template-columns:220px 1fr 320px;gap:14px;align-items:stretch;}
.ai3 table td{font-size:12px;padding:7px 4px;}
.ai3 table td:first-child{white-space:nowrap;color:var(--txt2);}
#voiceStatus b{cursor:pointer;}
.ai3 .card{margin-bottom:0;}
.ai-head{display:flex;align-items:center;gap:10px;margin-bottom:10px;}
.ai-head .av{width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,#0B6EC5,#2DD4BF);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:16px;box-shadow:0 6px 16px rgba(11,110,197,.35);}
.ai-head b{font-size:15px;color:var(--txt);} .ai-head small{display:block;font-size:11px;color:var(--txt3);}
.ai-head .st{margin-left:auto;font-size:11px;color:#16A34A;display:flex;align-items:center;gap:6px;}
.ai-head .st i{width:7px;height:7px;border-radius:50%;background:#22C55E;}
#chatList{height:430px!important;max-height:none!important;}
.msg.ai .ai-tag{display:inline-block;font-size:11px;padding:1px 8px;border-radius:9px;background:rgba(11,110,197,.12);color:#0B6EC5;margin-bottom:6px;font-weight:600;}
body.fs .msg.ai .ai-tag{color:#7DD3FC;}
.ai-think{font-size:11.5px;color:var(--txt3);border-left:2px solid rgba(56,189,248,.45);padding:2px 0 2px 10px;margin-bottom:8px;}
.ai-think summary{cursor:pointer;color:var(--txt2);list-style:none;}
.ai-think summary::-webkit-details-marker{display:none;}
.ai-think .tl{margin-top:4px;line-height:1.9;}
.ai-think .tl code{font-family:Consolas,monospace;font-size:11px;background:rgba(56,189,248,.1);padding:0 5px;border-radius:4px;color:#0B6EC5;}
.ai-src{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;}
.ai-src span{font-size:10.5px;padding:1px 8px;border-radius:9px;border:1px solid var(--line);color:var(--txt3);}
.ai-cur::after{content:"▍";color:#0B6EC5;animation:aib .8s infinite;}
@keyframes aib{50%{opacity:0;}}
.ai-welcome{padding:6px 4px;}
.ai-welcome h4{font-size:16px;margin-bottom:4px;color:var(--txt);}
.ai-welcome p{font-size:12.5px;color:var(--txt2);margin-bottom:10px;}
.ai-caps{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.ai-cap{border:1px solid var(--line);border-radius:10px;padding:10px 12px;cursor:pointer;transition:all .2s;background:var(--panel);}
.ai-cap:hover{border-color:#38BDF8;transform:translateY(-2px);box-shadow:0 6px 16px rgba(0,91,172,.12);}
.ai-cap b{display:block;font-size:13px;color:var(--txt);margin-bottom:3px;} .ai-cap span{font-size:11.5px;color:var(--txt3);line-height:1.6;}
.ai-tool{display:flex;align-items:center;gap:8px;font-size:12px;padding:6px 0;border-bottom:1px dashed var(--line);color:var(--txt2);}
.ai-tool i{width:8px;height:8px;border-radius:50%;background:#22C55E;flex:none;}
.ai-tool b{margin-left:auto;font-weight:400;font-family:Consolas,monospace;color:var(--txt3);font-size:11px;}
.ai-tool.hot i{background:#F59E0B;box-shadow:0 0 0 4px rgba(245,158,11,.2);}
.vw-ov{position:fixed;inset:0;z-index:250;background:rgba(5,14,28,.35);display:none;align-items:flex-end;justify-content:center;padding-bottom:14vh;pointer-events:none;}
.vw-ov.on{display:flex;}
.vw-box{background:rgba(10,24,44,.95);border:1px solid rgba(56,189,248,.5);border-radius:18px;padding:22px 34px;text-align:center;color:#DCE8F5;min-width:420px;box-shadow:0 20px 50px rgba(0,0,0,.5);}
.vw-bars{display:flex;gap:5px;justify-content:center;align-items:center;height:46px;margin-bottom:10px;}
.vw-bars i{width:5px;border-radius:3px;background:linear-gradient(180deg,#38BDF8,#2DD4BF);animation:vwb 1s ease-in-out infinite;}
@keyframes vwb{0%,100%{height:8px;}50%{height:42px;}}
.vw-box b{font-size:17px;display:block;} .vw-box span{font-size:12.5px;color:#8FA8C4;display:block;margin-top:6px;}
.iot-log{height:262px;overflow:hidden;font-family:Consolas,monospace;font-size:11.5px;background:#0B1A2E;border-radius:8px;padding:8px 10px;color:#93C5FD;}
.iot-log div{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.75;}
.iot-log em{color:#FDE68A;font-style:normal;} .iot-log u{color:#86EFAC;text-decoration:none;}
.ent-sel{display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap;}
.ent-sel select{min-width:220px;}
</style>
<div class="vw-ov" id="vwOv"><div class="vw-box"><div class="vw-bars">${Array.from({length:18},(_,i)=>`<i style="animation-delay:${(i%9)*.09}s"></i>`).join("")}</div><b id="vwT">我在，请讲</b><span id="vwS">正在聆听…</span></div></div>`);

/* 浏览器 alert 统一为平台轻提示（去除“演示：”字样） */
window.alert=m=>qwToast(String(m).replace(/^演示[:：]\s*/,"").replace(/（需求[^）]*）/g,""));

/* ---------------- AI 智能体 ---------------- */
const QA_X=[
 {id:"e1",q:"2025年园区综合能耗是多少？",a:"▶ 能碳问数\n2025 年园区综合能耗 18.6 万 tce，同比下降 4.6%。\n· 电力 8.9 万tce（47.8%）、燃气 4.1 万tce（22.0%）、热力 3.3 万tce（17.7%）、油品 1.5 万tce、煤品 0.8 万tce\n· 能耗强度 1.11 tce/万元，近五年累计下降 21.8%\n· 能耗前三企业：宏基新材料、智慧银川大数据中心、宇超电力装备",ch:"en"},
 {id:"g1",q:"今年绿电交易和消纳情况怎么样？",a:"▶ 能碳问数\n2025 年园区绿电交易 2.1 亿 kWh，绿电消纳率 96.1%（目标 95%，已达标）。\n· 外购绿电 1.61 亿 kWh、分布式光伏 1.31 亿 kWh、集中式新能源 1.02 亿 kWh\n· 绿电合计占园区用电 53.9%，对应减排约 6.9 万 tCO₂\n· 宝丰储能科技绿电交易量最大，智慧银川大数据中心绿电占比达 100%",ch:"pw"},
 {id:"p1",q:"国家零碳园区建设对我们有哪些核心要求？",a:"▶ 政策解读\n依据国家零碳园区建设相关政策与《零碳园区建设指标体系（试行）》，核心要求包括：\n1. 核心指标：单位能耗碳排放持续下降，并按园区能耗规模达到相应限值要求\n2. 引导性指标：清洁能源消费占比、余热余冷余压综合利用率、工业固废综合利用率、工业用水重复利用率、企业单位产品能耗\n3. 能力建设：建立园区能碳管理平台，实现企业能碳数据在线采集、核算与监测\n苏银产业园当前单位能耗碳排放 2.27 tCO₂/tce，6 项考核指标 4 项达标，建议优先补齐清洁能源消费占比短板。"}];
const ALLQA=()=>AI_QA.concat(QA_X);
const XCH={en:()=>stackedBar(YEARS.map(String),[["电力",[9.6,9.5,9.4,9.2,8.9]],["燃气",[4.6,4.5,4.4,4.3,4.1]],["热力",[3.9,3.8,3.6,3.5,3.3]],["油品+煤品",[3.7,3.4,3.0,2.5,2.3]]].map(([n,d],i)=>({name:n,color:PALETTE[i%8],data:d})),170,460),
 pw:()=>donut([{k:"外购绿电",v:1.61,u:" 亿kWh"},{k:"分布式光伏",v:1.31,u:" 亿kWh"},{k:"集中式新能源",v:1.02,u:" 亿kWh"},{k:"电网购电",v:3.36,u:" 亿kWh"}],170,22)};
const INTENT={a1:"能碳问数",f1:"归因分析",f2:"减排路径规划",f3:"零碳路径推演",f4:"AI 智能预测",c1:"AI 节能诊断",c2:"整改方案生成",b1:"零碳规划",d1:"负荷预测",e1:"能碳问数",g1:"能碳问数",p1:"政策解读"};
const TOOLS={a1:["carbon_query(scope='park', year=2025)","emission_breakdown(by='scope')"],f1:["yoy_attribution(metric='carbon')","project_ledger(status='done')"],f2:["emission_factor(grid='NW')","scenario_eval(measures=3)"],
 f3:["path_simulate(model='LEAP', scenarios=3)"],f4:["forecast(metric='carbon', horizon='2026', model='LSTM+XGB')"],c1:["energy_diagnose(scope='key_ent', n=8)"],c2:["retrofit_plan(ent='莱卡纤维新材料')","roi_calc()"],
 b1:["path_simulate(model='LEAP')","kb_search('零碳园区 路径')"],d1:["load_forecast(horizon='12m')","pv_forecast()"],e1:["energy_query(year=2025)"],g1:["green_power_query(year=2025)"],p1:["kb_search('零碳园区建设 指标体系')"]};
function matchQ(q){
 const R=[[/(为什么|原因|归因).*(下降|减少)|下降.*原因/,"f1"],[/范围二|间接排放|压减/,"f2"],[/(纳入|推演).*(路径|零碳)|推演/,"f3"],[/预测.*(碳|排放)|明年.*碳/,"f4"],
  [/负荷|用电.*预测|光伏出力/,"d1"],[/节能|潜力|诊断/,"c1"],[/整改|方案|收益测算/,"c2"],[/规划|路径建议|零碳路线/,"b1"],[/绿电|消纳|绿证/,"g1"],[/政策|要求|指标体系|标准/,"p1"],
  [/能耗|用能|标煤|tce/,"e1"],[/碳排|排放|碳/,"a1"]];
 for(const [r,id] of R)if(r.test(q))return ALLQA().find(x=>x.id===id);return null;}
function aiChart(qa){if(qa.ch==="en"||qa.ch==="pw")return XCH[qa.ch]();return (typeof qa.ch==="number"&&AI_CHARTS[qa.ch])?AI_CHARTS[qa.ch]():null;}
function fmtA(x){const ls=String(x).replace(/\n（[^）]*）\s*$/,"").split("\n");let tag="";if(/^▶/.test(ls[0])){tag=ls.shift().replace(/^▶\s*/,"");}
 return {tag,body:ls.join("\n")};}
window.aiMsgHTML=function(m){
 if(m.r==="u")return `<div class="msg user">${m.x}${m.img?`<img class="thumb" src="${m.img}">`:""}</div>`;
 const f=fmtA(m.x);const tools=TOOLS[m.nid]||["kb_search()"];
 return `<div class="msg ai">${f.tag?`<span class="ai-tag">${f.tag}</span>`:""}
  ${m.nid?`<details class="ai-think"><summary>✓ 已完成推理 · 调用 ${tools.length+1} 个工具 · 用时 ${(1.1+tools.length*0.4).toFixed(1)}s ▾</summary><div class="tl">意图识别：<code>${INTENT[m.nid]||"能碳问答"}</code><br>${tools.map(t=>`调用工具：<code>${t}</code>`).join("<br>")}<br>检索知识库：<code>园区能碳台账 · 政策库</code> 命中 ${3+tools.length} 条</div></details>`:""}
  <div class="ai-body">${f.body.replace(/\n/g,"<br>")}</div>${m.chart?`<div style="margin-top:8px">${m.chart}</div>`:""}
  ${m.nid?`<div class="ai-src"><span>数据来源：园区能碳数据库</span><span>口径：2025 年度核算</span><span>${m.nid==="p1"?"政策知识库":"在线监测 + 企业填报"}</span></div>`:""}</div>`;};
window.aiRender=function(){
 const list=document.getElementById("chatList");if(!list)return;const s=AI_SESS[AI_CUR];
 list.innerHTML=s.msgs.length?s.msgs.map(aiMsgHTML).join(""):`<div class="ai-welcome"><h4>您好，我是零碳智能体「小苏」</h4><p>基于苏银产业园零碳专用大模型与园区能碳数据库，可为您提供能碳问数、零碳规划、节能诊断、智能预测与政策解读。支持语音唤醒（说「小苏小苏」）、多轮追问、上传图片附件。</p>
  <div class="ai-caps">${[["能碳问数","查询园区 / 产业 / 企业能耗与碳排数据","a1"],["零碳规划","三情景推演与零碳路径建议","b1"],["AI 节能诊断","定位高耗能环节，测算节能潜力","c1"],
   ["AI 智能预测","预测能耗、碳排、负荷与新能源出力","d1"],["绿电与消纳","绿电交易、消纳率与减排量","g1"],["政策解读","零碳园区建设政策与指标要求","p1"]].map(c=>`<div class="ai-cap" onclick="askAI('${c[2]}')"><b>${c[0]}</b><span>${c[1]}</span></div>`).join("")}</div></div>`;
 list.scrollTop=list.scrollHeight;refreshSess();};
function refreshSess(){const el=document.getElementById("aiSess");if(!el)return;
 el.innerHTML=AI_SESS.map((s,i)=>`<div class="ai-sess ${i===AI_CUR?"on":""}" onclick="aiSwitch(${i})">${s.t}<div class="sub">${s.sub} · ${s.msgs.length} 条消息</div></div>`).join("");}
window.aiSwitch=function(i){AI_CUR=i;aiRender();aiChipsRefresh();};
window.aiNew=function(){AI_SESS.unshift({t:"新对话",sub:"实时交互",msgs:[]});AI_CUR=0;aiRender();aiChipsRefresh();};
function toolPulse(on){document.querySelectorAll(".ai-tool").forEach((t,i)=>t.classList.toggle("hot",on&&i<3));}
/* 流式输出 */
function stream(qa,done){
 const list=document.getElementById("chatList");if(!list)return;const s=AI_SESS[AI_CUR];
 const tip=document.createElement("div");tip.className="msg ai";
 const steps=["意图识别："+(INTENT[qa.id]||"能碳问答"),...(TOOLS[qa.id]||["kb_search()"]).map(t=>"调用工具："+t),"生成回答"];
 tip.innerHTML=`<div class="ai-think"><div class="tl" id="aiTl"></div></div>`;list.appendChild(tip);list.scrollTop=list.scrollHeight;toolPulse(true);
 let k=0;const tl=tip.querySelector("#aiTl");
 const step=()=>{if(k<steps.length){tl.innerHTML+=`<div>⟳ ${steps[k]}</div>`;k++;list.scrollTop=list.scrollHeight;setTimeout(step,260);return;}
  const f=fmtA(qa.a);tip.innerHTML=`${f.tag?`<span class="ai-tag">${f.tag}</span>`:""}<div class="ai-body ai-cur"></div>`;
  const body=tip.querySelector(".ai-body");const txt=f.body;let n=0;
  const typer=setInterval(()=>{n=Math.min(txt.length,n+4);body.innerHTML=txt.slice(0,n).replace(/\n/g,"<br>");list.scrollTop=list.scrollHeight;
   if(n>=txt.length){clearInterval(typer);const m={r:"a",x:qa.a,nid:qa.id,chart:aiChart(qa)};s.msgs.push(m);tip.outerHTML=aiMsgHTML(m);
    list.scrollTop=list.scrollHeight;aiChipsRefresh();refreshSess();toolPulse(false);setTimeout(()=>{flushCharts();list.scrollTop=list.scrollHeight;},60);done&&done(m);}},22);};
 setTimeout(step,200);}
window.askAI=function(id){const qa=ALLQA().find(x=>x.id===id);if(!qa)return;const list=document.getElementById("chatList");if(!list)return;
 const s=AI_SESS[AI_CUR];if(!s.msgs.length)list.innerHTML="";s.msgs.push({r:"u",x:qa.q.replace(/^追问：/,"")});list.insertAdjacentHTML("beforeend",aiMsgHTML({r:"u",x:qa.q.replace(/^追问：/,"")}));
 if(s.t==="新对话"||s.t==="当前对话")s.t=qa.q.replace(/^追问：/,"").slice(0,14);stream(qa);};
window.askFree=function(cb){const inp=document.getElementById("chatInput");if(!inp)return;const q=inp.value.trim();if(!q)return;inp.value="";
 if(!cb&&VW.on&&VW.mode==="cmd"){cb=m=>vTTS(fmtA(m.x).body.replace(/[·•]/g,"，").replace(/\n/g,"。").slice(0,140));VW.mode="wake";setTimeout(()=>{try{voiceUI();}catch(e){}},300);}
 const list=document.getElementById("chatList");const s=AI_SESS[AI_CUR];if(!s.msgs.length)list.innerHTML="";
 s.msgs.push({r:"u",x:q,img:ATTACH_URL});list.insertAdjacentHTML("beforeend",aiMsgHTML({r:"u",x:q,img:ATTACH_URL}));
 const wasAttach=!!ATTACH_URL;ATTACH_URL=null;if(s.t==="新对话"||s.t==="当前对话")s.t=q.slice(0,14);
 let qa;
 if(wasAttach)qa={id:"att",a:"▶ 图片附件解析\n已识别图片内容：低压用电监测终端铭牌（型号 LC-033，额定电流 100A，DL/T 698.45 协议）。\n· 已关联设备档案：安装于宇超电力装备 1# 车间配电柜，在线运行 186 天\n· 本月电能损耗率 1.8%，三相不平衡度 4.2%，状态正常\n· 建议：保持季度巡检，下次校验时间 2026-03"};
 else qa=matchQ(q)||{id:"gen",a:"▶ 能碳问答\n已检索园区能碳数据库与政策知识库。2025 年园区综合能耗 18.6 万 tce、碳排放 42.3 万 tCO₂，单位能耗碳排放 2.27 tCO₂/tce。\n您可以进一步询问具体企业、产业或时间范围的数据，例如“宏基新材料近三年碳排放趋势”。"};
 TOOLS.att=["image_ocr()","device_profile(model='LC-033')"];INTENT.att="附件解析";TOOLS.gen=["kb_search()","carbon_query()"];INTENT.gen="能碳问答";
 stream(qa,cb);};
/* 语音：唤醒浮层 + 回答完成后播报 */
const _vui=window.voiceUI;let vwH=null;
function showVW(t,sub,ms){const ov=document.getElementById("vwOv");if(!ov)return;document.getElementById("vwT").textContent=t;document.getElementById("vwS").textContent=sub;
 ov.classList.add("on");clearTimeout(vwH);vwH=setTimeout(()=>ov.classList.remove("on"),ms||2400);}
let lastMode="";
window.voiceUI=function(){_vui();const m=VW.on?VW.mode:"off";
 if(m==="cmd"&&lastMode!=="cmd")showVW("我在，请讲","正在聆听… 说完自动识别并回答",2600);
 if(m==="off"){const ov=document.getElementById("vwOv");if(ov)ov.classList.remove("on");}
 lastMode=m;};
window.voiceCommand=function(q){q=q.replace(/[。,.，？！?!]/g,"").trim();if(!q)return;
 showVW("“"+q+"”","已识别语音，正在分析…",1300);
 const inp=document.getElementById("chatInput");if(inp)inp.value=q;
 const st=document.getElementById("voiceStatus");if(st)st.innerHTML="<span class='v-wave hot'></span>收到提问："+q;
 askFree(m=>{const t=fmtA(m.x).body.replace(/[·•]/g,"，").replace(/\n/g,"。").slice(0,140);vTTS(t);});
 VW.mode="wake";setTimeout(()=>{try{voiceUI();}catch(e){}},1400);};
/* 语音演示稳健性：识别服务不可用（如网络受限）时静默转入演示模式；Alt+V 或点击唤醒词可模拟语音输入 */
const VQ=["2025年园区碳排放多少","哪些企业节能潜力最大","给出园区零碳规划的路径建议","预测明年园区用电负荷"];let vqI=0;
window.voiceFallback=function(){VW.on=true;VW.mode="wake";voiceUI();};
const _vStart=window.voiceStart;
window.voiceStart=function(){_vStart();const r=VW.rec;if(!r)return;
 r.onerror=e=>{if(e.error==="no-speech"||e.error==="aborted")return;try{r.onend=null;r.stop();}catch(_){}VW.rec=null;if(VW.on)voiceUI();};};
function vSimSpeak(q){let k=0;
 const tick=()=>{k++;showVW("“"+q.slice(0,k)+"”","正在识别语音…",5000);if(k<q.length)setTimeout(tick,120);else setTimeout(()=>{window.voiceCommand(q);const i=document.getElementById("chatInput");if(i)i.placeholder="请输入问题，例如：2025年园区综合能耗是多少？";},600);};tick();}
window.qwVoiceDemo=function(){
 if(curPage!=="aiAgent"){go("aiAgent");setTimeout(window.qwVoiceDemo,400);return;}
 if(!VW.on){VW.on=true;VW.mode="wake";const b=document.getElementById("micBtn");voiceUI();return;}
 if(VW.mode==="wake"){vSimWake();const i=document.getElementById("chatInput");if(i){i.placeholder="请讲，正在识别语音…";i.blur();}return;}
 vSimSpeak(VQ[vqI++%VQ.length]);};
document.addEventListener("keydown",e=>{if(e.altKey&&(e.key==="v"||e.key==="V")){e.preventDefault();window.qwVoiceDemo();}});
document.addEventListener("click",e=>{if(e.target.closest&&e.target.closest("#voiceStatus b")){window.qwVoiceDemo();}});


reg("aiAgent",()=>`
<div class="ai3">
 <div class="card"><h3>会话管理</h3>
  <button class="btn sm" style="width:100%;margin-bottom:10px" onclick="aiNew()">＋ 新建对话</button>
  <div class="ai-side" id="aiSess"></div>
  <div class="hint" style="margin-top:10px">历史会话自动保存，可回看完整多轮对话记录</div></div>
 <div class="card">
  <div class="ai-head"><span class="av">苏</span><div><b>小苏 · 零碳智能体</b><small>苏银零碳专用大模型 SY-ZeroCarbon-32B · 园区知识库 1,286 篇</small></div><span class="st"><i></i>在线</span></div>
  <div class="chat"><div class="chat-list" id="chatList"></div>
   <div class="chips" id="qaChips">${aiChips()}</div>
   <div class="chat-input">
    <input type="text" id="chatInput" placeholder="请输入问题，例如：2025年园区综合能耗是多少？" onkeydown="if(event.key==='Enter')askFree()">
    <button class="btn" onclick="askFree()">发送</button>
    <input type="file" id="aiFile" accept="image/*" style="display:none" onchange="aiAttach(this)">
    <button class="btn ghost" title="上传图片附件" onclick="document.getElementById('aiFile').click()">📎 附件</button>
    <button class="btn ghost mic-btn" id="micBtn" title="语音唤醒：说「小苏小苏」" onclick="aiVoice()">🎤 语音唤醒</button></div>
   <div class="voice-status" id="voiceStatus">待唤醒 · 唤醒词：<b>「小苏小苏」</b></div></div></div>
 <div>
  <div class="card"><h3>智能体平台</h3>
   <table>${row("专用大模型","SY-ZeroCarbon-32B","私有化部署")}${row("专业智能体","问数 / 规划 / 诊断 / 预测","6 个")}${row("场景数据集","园区 5 年能碳数据","1.2 亿条")}${row("算法组件","LSTM · XGBoost · LEAP","18 个")}${row("AI 评测","问数准确率 96.8%","幻觉率 0.9%")}</table></div>
  <div class="card" style="margin-top:14px"><h3>工具与数据源</h3>
   ${[["能碳数据库查询","carbon_query"],["能耗数据查询","energy_query"],["AI 预测引擎","forecast"],["节能诊断引擎","energy_diagnose"],["零碳路径推演","path_simulate"],["政策知识库检索","kb_search"],["图片识别","image_ocr"]].map(t=>`<div class="ai-tool"><i></i>${t[0]}<b>${t[1]}</b></div>`).join("")}</div>
 </div>
</div>`);
/* 历史会话中的追问提示文字去除 */
AI_SESS.forEach(s=>s.msgs.forEach(m=>{if(m.x)m.x=m.x.replace(/\n（[^）]*(?:追问|对应需求)[^）]*）/g,"");}));
AI_SESS[0].t="新对话";
const _ac=window.aiChips;
window.aiChips=function(){return _ac().replace(/>可追问 ▸</,">继续追问 ▸<").replace(/>预置问题 ▸</,">推荐问题 ▸<").replace(/>新话题 ▸</,">新话题 ▸<").replace(/追问：/g,"");};

/* ---------------- 物联网平台 ---------------- */
const DEV=[["GW-001","智能通信网关","宏基新材料 1# 配电室","Modbus-TCP / MQTT","在线","3s"],["GW-012","智能通信网关","莱卡纤维新材料 配电室","DL/T 698.45","在线","5s"],
 ["LC-033","低压监测终端","宇超电力装备 1# 车间","DL/T 698.45","在线","8s"],["LC-041","低压监测终端","嘉盛德电子材料 洁净车间","DL/T 645","在线","6s"],
 ["HV-008","高压监测终端","园区 10kV 开闭所","IEC 60870-5-104","离线","35min"],["HV-015","高压监测终端","智慧银川大数据中心 10kV 进线","IEC 61850","在线","4s"],
 ["SF-001","蒸汽流量计","莱卡纤维新材料 蒸汽总管","Modbus-RTU","在线","10s"],["SF-002","蒸汽流量计","鲜控冷链设备 锅炉房","Modbus-RTU","在线","12s"],
 ["EX-003","防爆隔离控制箱","莱卡纤维新材料 溶剂回收区","RS-485","在线","9s"],["UT-001","用户侧系统集成终端","海归小镇生物医药园 能源站","BACnet / OPC","在线","2s"],
 ["CT-128","开口式电流互感器","宝丰储能科技 PCS 舱","—（经 LC 终端接入）","在线","—"],["GW-027","智能通信网关","光伏产业园片区 箱变","4G / MQTT","告警","15s"]];
reg("iot",()=>`
<div class="kpis" style="grid-template-columns:repeat(6,1fr)">
 ${kpi("接入设备","333","台套","在线率 98.2%","up ok")}${kpi("智能通信网关","40","台","在线 38 台")}${kpi("用电监测终端(低压)","65","台","数据完整率 99.1%")}
 ${kpi("用电监测终端(高压)","23","台","在线 22 台")}${kpi("开口式电流互感器","195","只","已标定 195 只")}${kpi("今日上报数据","1,286,420","条","峰值 2,140 条/秒")}
</div>
<div class="grid" style="grid-template-columns:1.6fr 1fr">
 <div class="card"><h3>设备管理
  <span style="margin-left:auto;font-weight:400;display:flex;gap:8px"><select><option>全部设备类型</option><option>智能通信网关</option><option>用电监测终端</option><option>蒸汽流量计</option></select><select><option>全部状态</option><option>在线</option><option>离线</option><option>告警</option></select><button class="btn sm" onclick="qwToast('已下发远程配置任务')">远程配置</button><button class="btn ghost sm" onclick="qwToast('固件升级任务已排队：12 台')">固件升级</button></span></h3>
  <table><tr><th>设备编号</th><th>设备类型</th><th>安装位置</th><th>通信协议</th><th>状态</th><th>最近心跳</th></tr>
  ${DEV.map(d=>`<tr><td style="font-family:Consolas">${d[0]}</td><td>${d[1]}</td><td>${d[2]}</td><td style="font-size:11.5px">${d[3]}</td><td><span class="tag ${d[4]==="在线"?"ok":d[4]==="离线"?"lv3":"lv2"}">${d[4]}</span></td><td>${d[5]==="—"?"—":d[5]+" 前"}</td></tr>`).join("")}</table></div>
 <div>
  <div class="card"><h3>设备状态分布</h3>${donut([{k:"在线",v:327,u:" 台"},{k:"告警",v:3,u:" 台"},{k:"离线",v:3,u:" 台"}],170,22)}</div>
  <div class="card" style="margin-top:14px"><h3>实时数据流（MQTT）</h3><div class="iot-log" id="iotLog"></div></div></div>
</div>
<div class="grid g3">
 <div class="card"><h3>规则引擎</h3><table><tr><th>规则</th><th>触发条件</th><th>动作</th></tr>
  <tr><td>单位能耗碳排超限</td><td>&gt; 行业基准 15%</td><td>紧急告警 · 推送企业</td></tr><tr><td>蒸汽夜间异常</td><td>22:00–06:00 流量 +20%</td><td>重要告警 · 派单</td></tr>
  <tr><td>终端离线</td><td>心跳超时 &gt; 15min</td><td>运维工单</td></tr><tr><td>需量预警</td><td>15min 需量 &gt; 90% 申报值</td><td>短信 + 平台提醒</td></tr></table>
  <div class="hint">告警规则 28 条 · 联动规则 12 条 · 今日触发 17 次</div></div>
 <div class="card"><h3>网关管理 · 远程维护</h3>${row("在线网关","38 / 40","2 台维护中")}${row("协议插件","Modbus / DL/T 645 / 698.45 / IEC 104 / 61850","可扩展")}${row("采集周期","1–15 min 可设","默认 5 min")}${row("断网续传","边缘缓存 ≥ 72 h","设备影子同步")}${row("远程诊断","日志回传 / 远程重启","本月 23 次")}</div>
 <div class="card"><h3>数据服务</h3>${row("数据接口","REST / MQTT / WebSocket","API 46 个")}${row("数据订阅","能碳平台 / AI 平台 / 运维","5 个订阅方")}${row("数据质量","完整率 99.1% · 准确率 98.7%","日巡查")}${row("平台门户","设备总览 / 拓扑 / 报表","统一认证")}</div>
</div>`);
let iotT=null;
function iotTick(){const el=document.getElementById("iotLog");if(!el){clearInterval(iotT);iotT=null;return;}
 const d=DEV[Math.floor(Math.random()*DEV.length)];if(d[4]==="离线")return;const t=new Date().toTimeString().slice(0,8);
 const v=d[1].includes("蒸汽")?`flow=<em>${(8+Math.random()*4).toFixed(2)}</em>t/h P=<em>${(0.78+Math.random()*.05).toFixed(3)}</em>MPa`:`P=<em>${(200+Math.random()*900).toFixed(1)}</em>kW Ua=<em>${(228+Math.random()*6).toFixed(1)}</em>V PF=<em>${(0.92+Math.random()*.06).toFixed(3)}</em>`;
 el.insertAdjacentHTML("afterbegin",`<div>${t} <u>suyin/${d[0].toLowerCase()}/telemetry</u> ${v}</div>`);while(el.children.length>16)el.lastChild.remove();}
const _go=window.go;
window.go=function(id){const r=_go(id);
 if(id==="iot"){if(iotT)clearInterval(iotT);for(let i=0;i<12;i++)iotTick();iotT=setInterval(iotTick,700);}
 if(id==="aiAgent"){aiRender();aiChipsRefresh();}
 return r;};

/* ---------------- 企业大屏首页 ---------------- */
reg("entHome",()=>{const c=curCo;const t=entStruct(c.id);const idx=4;
 const avgMW=c.en*1e4*(t.pE+t.pR)/100/0.1229/8760;const nf=+(t.pR+t.pE*0.3).toFixed(1);
 const load=Array.from({length:24},(_,h)=>+(avgMW*1.05*(0.62+0.38*Math.sin((h-6)/24*Math.PI*2-0.3)+0.08*Math.sin(h*1.7+c.id))).toFixed(2));
 const mon=["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];const mf=[1.06,.98,.96,.92,.95,1.02,1.1,1.12,.97,.92,.96,1.04];
 return `
<div class="ent-sel"><span style="font-size:13px;color:var(--txt2)">当前企业</span><select onchange="pickCo(+this.value)">${COMPANIES.map(x=>`<option value="${x.id}" ${x.id===c.id?"selected":""}>${x.name}</option>`).join("")}</select>
 <span class="tag ok">${c.ind}</span><span class="tag ${c.eg==="A"?"ok":c.eg==="B"?"lv2":"lv3"}">能效 ${c.eg} 级</span><span style="font-size:12px;color:var(--txt3)">${c.dist||""} · 重点用能单位 · 在线监测点 ${18+c.id*3} 个</span></div>
<div class="kpis" style="grid-template-columns:repeat(6,1fr)">
 ${kpi("综合能耗",c.en.toFixed(1),"万tce","同比 -4.8%","down ok")}${kpi("碳排放",c.co.toFixed(1),"万tCO₂","同比 -5.2%","down ok")}
 ${kpi("单位能耗碳排放",(c.co/c.en).toFixed(2),"tCO₂/tce","零碳工厂核心指标")}${kpi("非化石能源消费占比",nf.toFixed(1),"%","目标 40% · 含电网绿电折算")}
 ${kpi("实时负荷",load[new Date().getHours()].toFixed(2),"MW","可调节 "+(avgMW*0.15).toFixed(1)+" MW","up ok")}${kpi("碳配额盈余",(c.id===2||c.id===6)?"-320":(400+c.id*95).toString(),"tCO₂",(c.id===2||c.id===6)?"缺口预警":"盈余充足",(c.id===2||c.id===6)?"bad":"up ok")}
</div>
<div class="grid g3">
 <div class="card"><h3>企业能源结构</h3>${donut([{k:"电力",v:+(c.en*t.pE/100).toFixed(2),u:" 万tce"},{k:"天然气",v:+(c.en*t.pG/100).toFixed(2),u:" 万tce"},{k:"蒸汽",v:+(c.en*t.pS/100).toFixed(2),u:" 万tce"},{k:"绿电/其他",v:+(c.en*t.pR/100).toFixed(2),u:" 万tce"}],170,22)}</div>
 <div class="card"><h3>今日负荷曲线（实时）</h3>${lineChart(Array.from({length:24},(_,h)=>h+":00"),[{name:"负荷(MW)",color:"#0EA5E9",data:load}],200,460)}</div>
 <div class="card"><h3>零碳工厂核心指标完成情况</h3>
  ${[["单位能耗碳排放",86],["非化石能源消费占比",Math.min(99,Math.round(nf/40*100))],["非化石能源电力物理认定量占比",92]].map(([n,v])=>`<div style="margin-bottom:12px"><div style="display:flex;font-size:12px;margin-bottom:4px"><span>${n}</span><span style="margin-left:auto;color:#0F9F8C">${v}%</span></div><div class="progress ${v>=80?"":"warn"}"><i style="width:${v}%"></i></div></div>`).join("")}
  <div class="hint">三项核心指标按年度配置目标值，按月跟踪完成进度</div></div>
</div>
<div class="grid" style="grid-template-columns:1.4fr 1fr">
 <div class="card"><h3>本年度月度能耗 / 碳排趋势</h3>${comboBarLine(mon,"能耗(tce)",mf.map(f=>Math.round(c.en*10000/12*f)),"碳排(tCO₂)",mf.map(f=>Math.round(c.co*10000/12*f*0.99)),220,620,"tce","tCO₂")}</div>
 <div class="card"><h3>企业特色信息</h3><table>${row("所属产业",c.ind,"园区重点产业")}${row("主要产品",c.real||"—","")}${row("能碳评价",c.grade+" 级","园区排名 TOP"+(9-Math.floor(c.red/8)))}${row("绿电交易",(c.asset*1.7).toFixed(0)+" 万kWh","占用电 "+(20+c.id*2)+"%")}</table>
  <div class="concl"><b>减排措施：</b>${c.meas.split("｜").slice(0,2).join("；")}</div></div>
</div>`;});
})();

/* ================= c10f-2 能源监测：表计迷你曲线 + 测点 24h 曲线 ================= */
(function(){
 const BL="▁▂▃▄▅▆▇█";
 function sparkSvg(str){const v=[...str].map(ch=>BL.indexOf(ch)).filter(x=>x>=0);if(!v.length)return str;
  const w=96,h=24,st=w/(v.length-1);const pts=v.map((x,i)=>`${(i*st).toFixed(1)},${(h-3-(x/7)*(h-6)).toFixed(1)}`).join(" ");
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="vertical-align:middle"><polyline points="0,${h} ${pts} ${w},${h}" fill="rgba(14,165,233,.12)" stroke="none"/><polyline points="${pts}" fill="none" stroke="#0EA5E9" stroke-width="1.6" stroke-linejoin="round"/></svg>`;}
 const _e2=RENDERERS.e2;
 RENDERERS.e2=function(){let h=_e2();
  h=h.replace(/<td>([▁▂▃▄▅▆▇█]{4,})<\/td>/g,(m,s)=>`<td>${sparkSvg(s)}</td>`);
  const hrs=Array.from({length:24},(_,i)=>String(i).padStart(2,"0")+":00");
  const p=hrs.map((_,i)=>Math.round(1650+780*Math.max(0,Math.sin((i-6)/24*Math.PI*2-0.25))+90*Math.sin(i*1.9)+(i>=8&&i<=20?260:0)));
  const q=p.map(x=>+(x*0.86/1000).toFixed(2));
  h+=`<div class="grid" style="grid-template-columns:1.6fr 1fr;margin-top:14px">
   <div><div class="sub2">测点 24h 曲线 · 1#车间总表（15 min 采样，表计原始值）</div>${comboBarLine(hrs,"有功功率(kW)",p,"无功(Mvar)",q,220,640,"kW","Mvar")}</div>
   <div><div class="sub2">数据质量</div><table>
    <tr><th>指标</th><th>数值</th><th>说明</th></tr>
    <tr><td>采集完整率</td><td>99.6%</td><td>近 30 天</td></tr>
    <tr><td>异常值剔除</td><td>12 条</td><td>跳变 / 负值自动识别</td></tr>
    <tr><td>手工补录</td><td>3 条</td><td>修改留痕可追溯</td></tr>
    <tr><td>表计校准</td><td>2026-09-18</td><td>下次 2027-03</td></tr></table>
    <div class="concl"><b>说明：</b>测点数据自网关实时上送，支持按表计追溯原始报文与采集时间戳。</div></div></div>`;
  return h;};
})();

/* ================= c10f-3 能效对标（标准库 + 对标任务 + 能效指数图）/ 能效平衡量级校正 ================= */
(function(){
 const TASK=[["SMT 产线","单位产量电耗","0.182 kWh/pc","0.165",110,"未达标","lv2"],["回流焊炉","单位产品综合能耗","0.36 kgce/片","0.38",95,"1 级","lv1"],
  ["空压站","比功率","6.8 kW/(m³/min)","6.2",110,"2 级","lv2"],["冷水机组","制冷 COP（反向）","5.6","6.0",107,"2 级","lv2"],
  ["燃气锅炉","热效率（反向）","91.5%","92.0%",101,"达标临界","lv2"],["电机系统","能效等级","IE3 占 86%","IE3 100%",104,"待改造","lv2"]];
 RENDERERS.b1=()=>`<div class="grid g2">
 <div><div class="sub2">对标依据（标准库 · 版本管理）</div>
  <table><tr><th>标准文件</th><th>状态</th><th>判定规则</th></tr>
  <tr><td>GB/T 2589-2020 综合能耗计算通则</td><td><span class="tag ok">发布使用</span></td><td>折标系数 · 当量值</td></tr>
  <tr><td>GB 19153-2019 容积式空气压缩机能效限定值及能效等级</td><td><span class="tag ok">发布使用</span></td><td>比功率 1–3 级</td></tr>
  <tr><td>GB 18613-2020 电动机能效限定值及能效等级</td><td><span class="tag ok">发布使用</span></td><td>IE3 / IE4</td></tr>
  <tr><td>GB 19577 冷水机组能效限定值及能效等级</td><td><span class="tag ok">发布使用</span></td><td>COP / IPLV</td></tr>
  <tr><td>GB 19153-2009 容积式空气压缩机能效限定值及能效等级</td><td><span class="tag lv3">过期停用</span></td><td>已由 2019 版替代</td></tr></table>
  <div class="sub2" style="margin-top:12px">指标定义</div>
  <table><tr><th>指标</th><th>适用对象</th><th>计算公式</th></tr>
  <tr><td>单位产量电耗</td><td>产线</td><td>产线电耗 ÷ 合格品产量</td></tr>
  <tr><td>比功率</td><td>空压站</td><td>输入功率 ÷ 容积流量</td></tr>
  <tr><td>能效指数</td><td>全部对象</td><td>当期值 ÷ 标杆值 × 100%</td></tr></table></div>
 <div><div class="sub2">对标任务 · 2026 年 10 月（数据准备完整率 100%）</div>
  <table><tr><th>对标对象</th><th>指标</th><th>当期值</th><th>标杆值</th><th>结果</th></tr>
  ${TASK.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td><span class="tag ${r[6]}">${r[5]}</span></td></tr>`).join("")}</table>
  <div class="sub2" style="margin-top:12px">能效指数（≤100% 为达到标杆）</div>
  ${hBar(TASK.map(r=>({k:r[0],v:r[4]})),200,560,"%",(it)=>it.v<=100?"#14B8A6":it.v<=105?"#F59E0B":"#EF4444")}
  <div class="concl"><b>对标结论：</b>6 个对象中 1 个达到标杆，SMT 产线与空压站差距最大（10%），建议优先实施空压站变频群控与 SMT 产线待机能耗治理，预计年节能 380 tce。</div></div>
</div>`;
 const _b4=RENDERERS.b4;
 RENDERERS.b4=function(){let h=_b4();
  h=h.replace("[302,298,310,306,312,288,281]","[30.2,29.8,31.0,30.6,31.2,28.8,28.1]").replace("[296,301,304,308,308,286,278]","[29.6,30.1,30.4,30.8,30.8,28.6,27.8]");
  return h;};
})();

/* ================= c10f-4 碳配额：年度对比 + 履约方案测算 ================= */
(function(){
 RENDERERS.a1=()=>`
<div class="kpis" style="grid-template-columns:repeat(4,1fr)">
 ${kpi("2025 年度碳配额","22,270","tCO₂","免费分配 · 基准线法")}
 ${kpi("2025 年度核算排放","22,590","tCO₂","缺口 -320 t","bad")}
 ${kpi("2026 年度配额测算","22,900","tCO₂","产量增长 4.2% 测算")}
 ${kpi("履约状态","待履约","","截止 2026-12-31","bad")}
</div>
<div class="grid g2">
 <div class="card"><h3>近五年配额与排放对比</h3>${echOK()?echPlace(230,inst=>{inst.setOption({backgroundColor:"transparent",tooltip:Object.assign({trigger:"axis"},TT()),legend:{top:0,textStyle:{color:ETXT2(),fontSize:11}},
   grid:{left:56,right:16,top:34,bottom:24},xAxis:{type:"category",data:["2021","2022","2023","2024","2025"],axisLabel:{color:ETXT2()},axisLine:{lineStyle:{color:AX()}}},
   yAxis:{type:"value",name:"tCO₂",min:18000,nameTextStyle:{color:ETXT3(),fontSize:10},axisLabel:{color:ETXT2(),fontSize:11},splitLine:{lineStyle:{color:AX(),type:"dashed",opacity:.5}}},
   series:[{name:"年度配额",type:"bar",barMaxWidth:22,data:[28200,26500,25200,23600,22270],itemStyle:{color:"#94A3B8",borderRadius:[4,4,0,0]}},
    {name:"核算排放",type:"bar",barMaxWidth:22,data:[27500,25900,24800,23500,22590].map((v,i)=>({value:v,itemStyle:{color:i===4?"#EF4444":"#0EA5E9",borderRadius:[4,4,0,0]}})),label:{show:true,position:"top",fontSize:10,color:ETXT2()}}]});},"",""):comboBarLine(["2021","2022","2023","2024","2025"],"核算排放(t)",[27500,25900,24800,23500,22590],"年度配额(t)",[28200,26500,25200,23600,22270],230,560,"t","t")}
  <div class="concl"><b>分析：</b>2021–2024 年配额均有盈余（累计 1,800 t 已结转），2025 年配额收紧 5.6%，首次出现缺口 320 t。</div></div>
 <div class="card"><h3>配额履约方案测算</h3>
  <table><tr><th>方案</th><th>可用量(t)</th><th>成本(万元)</th><th>到位时间</th><th>推荐</th></tr>
  <tr><td>使用往年结转配额</td><td>1,800</td><td>0</td><td>即时</td><td><span class="tag ok">优先</span></td></tr>
  <tr><td>CCER 抵销（≤5%）</td><td>790</td><td>6.7</td><td>2026-06</td><td><span class="tag lv2">备选</span></td></tr>
  <tr><td>空压站优化减排量</td><td>580</td><td>—</td><td>2026-09</td><td><span class="tag ok">实施中</span></td></tr>
  <tr><td>配额市场购入</td><td>按需</td><td>约 2.3</td><td>即时</td><td><span class="tag lv2">兜底</span></td></tr></table>
  <div class="concl"><b class="red">配额告警：</b>盈余量已转负（-320 t），已推送企业能源管理员；建议使用结转配额完成履约，同时推进空压站优化与 CCER 储备，确保 2026 年度不再产生缺口。</div></div>
</div>`;
})();

/* ================= c10z 初始化：以升级后的模块重新渲染当前页 ================= */
(function(){try{go(curPage);if(curPage==="aiAgent")aiRender();}catch(e){console.warn("re-render",e);}})();
