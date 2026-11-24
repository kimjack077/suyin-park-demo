/* 原型运行时冒烟测试：jsdom 加载页面，遍历所有导航页与页签，收集 JS 错误 */
const fs=require("fs");
const path="D:/新建文件夹/宁夏苏银产业园/.workbuddy/output/prototype/苏银产业园AI零碳数智平台-交互原型.html";
const html=fs.readFileSync(path,"utf-8");
const {JSDOM}=require("jsdom");
const errors=[];
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,resources:"usable"});
const w=dom.window;
w.addEventListener("error",e=>errors.push("window error: "+e.message));
function navTest(id){
  try{
    w.go(id);
    const pg=w.document.getElementById("pg-"+id);
    if(!pg||!pg.innerHTML||pg.innerHTML.length<200)errors.push("page empty: "+id);
  }catch(e){errors.push("nav "+id+": "+e.message);}
}
const pages=["dashboard","oneMap","multi","alarm","assess","path","report","entHome","entQuery","entAI","entBench","entCarbon","entAsset","aiAgent","iot"];
pages.forEach(navTest);
// 全屏驾驶舱模式：dashboard 进入 fs，其他页面退出 fs
try{
  w.go("dashboard");
  if(!w.document.body.classList.contains("fs"))errors.push("fs mode: dashboard 未进入全屏");
  if(!w.document.querySelector(".fs-bar"))errors.push("fs mode: 缺少全屏顶栏");
  w.exitFS();
  if(w.document.body.classList.contains("fs"))errors.push("fs mode: exitFS 未退出全屏");
  if(w.document.getElementById("pageTitle").textContent.indexOf("能碳全景一张图")<0)errors.push("fs mode: 退出后应回到一张图页");
  w.go("multi");
  if(w.document.body.classList.contains("fs"))errors.push("fs mode: 普通页面误入全屏");
}catch(e){errors.push("fs mode: "+e.message);}
// 页签遍历
try{w.go("multi");["m2","m3","m4","m5","m1"].forEach(t=>{const tab=w.document.querySelector(`.tab[data-t="${t}"]`);tab&&tab.click();});}catch(e){errors.push("multi tabs: "+e.message);}
try{w.go("entCarbon");["c2","c3","c4","c1"].forEach(t=>{const tab=w.document.querySelector(`.tab[data-t="${t}"]`);tab&&tab.click();});}catch(e){errors.push("entCarbon tabs: "+e.message);}
try{w.go("entAsset");["a2","a3","a4","a5","a1"].forEach(t=>{const tab=w.document.querySelector(`.tab[data-t="${t}"]`);tab&&tab.click();});}catch(e){errors.push("asset tabs: "+e.message);}
try{w.go("oneMap");w.omSetYear(2022);w.omTogglePlay();}catch(e){errors.push("oneMap: "+e.message);}
try{w.coModal(5);}catch(e){errors.push("coModal: "+e.message);}
try{w.askAI("a1");w.askAI("f1");w.askAI("c1");}catch(e){errors.push("askAI: "+e.message);}
try{w.rptSwitch("q");w.rptSwitch("m");}catch(e){errors.push("report: "+e.message);}
setTimeout(()=>{
  if(errors.length){console.log("FAIL\n"+errors.join("\n"));process.exit(1);}
  console.log("ALL RUNTIME CHECKS PASSED");
  process.exit(0);
},1600);
