/* ============ ⑥ 三维实景升级：Three.js 真三维苏银产业园（真实产业布局·增强版） ============ */
(function(){
/* 企业名录映射为真实入驻企业（据苏银产业园管委会/银川市政府公开资料；能碳数据为演示数据） */
const REAL=[
 {id:1,name:"宏基新材料",real:"5.3 万吨特种石墨项目"},
 {id:2,name:"嘉盛德电子材料",real:"半导体封装材料 · 5G 覆铜板"},
 {id:3,name:"宇超电力装备",real:"固态变压器 · 电力方舱（国家级专精特新）"},
 {id:4,name:"鲜控冷链设备",real:"冷链设备制造（已建成投产）"},
 {id:5,name:"智慧银川大数据中心",real:"6 万㎡ T4 级数据中心 · 电信绿色智算 2600+ 架"},
 {id:6,name:"海归小镇生物医药园",real:"欧美同学会银川海归小镇 · 医疗器械/生物医药"},
 {id:7,name:"宝丰储能科技",real:"电池及储能集装系统示范项目（园区产值第一）"},
 {id:8,name:"莱卡纤维新材料",real:"3 万吨差别化氨纶项目"}];
REAL.forEach(r=>{const c=COMPANIES.find(x=>x.id===r.id);if(c){c.name=r.name;c.real=r.real;}});

document.head.insertAdjacentHTML("beforeend",`<style>
#wb3dTip{position:fixed;z-index:95;pointer-events:none;display:none;background:rgba(8,18,36,.92);border:1px solid rgba(64,150,220,.6);border-radius:8px;padding:8px 12px;font-size:12px;color:#DCE8F5;line-height:1.7;box-shadow:0 10px 26px rgba(2,8,20,.55);backdrop-filter:blur(6px);}
#wb3dTip b{color:#7DD3FC;}
.iso-stage canvas{border-radius:8px;}
.iso-toolbar{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;justify-content:center;}
.iso-toolbar .btn{padding:4px 10px;font-size:11px;}
.iso-leg{display:flex;gap:14px;flex-wrap:wrap;font-size:11px;color:#8FA8C4;margin-top:6px;justify-content:center;}
.iso-leg i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:4px;vertical-align:-1px;}
</style>
<div id="wb3dTip"></div>`);

/* 三维场景数据（坐标为场景建模坐标，非真实经纬度） */
const EG_COL={A:0x2DD4BF,B:0xFBBF24,C:0xF87171};
const EG_PARTICLE={A:0x4ADE80,B:0xFBBF24,C:0xF87171};
const ZONES=[
 {name:"新材料产业区",x:-48,z:-28,w:74,d:62,col:0xFBBF24},
 {name:"绿色算力产业区",x:36,z:-34,w:66,d:54,col:0x38BDF8},
 {name:"新能源产业区",x:68,z:8,w:46,d:46,col:0x2DD4BF},
 {name:"医疗健康产业区",x:-50,z:38,w:54,d:44,col:0xA78BFA}];
const B3=[
 {ref:1,x:-56,z:-34,w:26,d:16,h:26,type:"industrial"},
 {ref:8,x:-30,z:-52,w:22,d:13,h:16,type:"industrial"},
 {ref:2,x:-26,z:-16,w:16,d:12,h:10,type:"standard"},
 {ref:5,x:24,z:-46,w:38,d:22,h:12,type:"datacenter"},
 {ref:7,x:62,z:-30,w:30,d:18,h:7,type:"storage"},
 {ref:4,x:-26,z:42,w:20,d:14,h:14,type:"standard"},
 {ref:3,x:30,z:42,w:22,d:14,h:20,type:"standard"},
 {ref:6,x:-60,z:40,w:24,d:16,h:13,type:"standard"},
 {name:"智慧产业研发大厦",x:10,z:-12,w:14,d:14,h:36,col:0x4A7AB5,scen:"hq",type:"hq"},
 {name:"甘露330kV变电站",x:-80,z:-6,w:20,d:16,h:5,col:0x4A6A8C,scen:"sub",type:"substation"},
 {name:"银川算力产业园",x:50,z:-14,w:18,d:12,h:9,col:0x3BA3E0,scen:"suan",type:"standard"},
 {name:"云碳共享储能电站",x:40,z:-48,w:18,d:8,h:4,col:0x2DD4BF,scen:"ess",type:"storage"}];
const SCEN_INFO={
 hq:{t:"智慧产业研发大厦",d:"苏银产业园管委会驻地，位于京河大道与如意街交叉口；园区「E 站式服务中心」所在地，实现「园区事园内办」。"},
 sub:{t:"甘露 330kV 变电站",d:"园区电源枢纽：建成 1 座 330kV 甘露变电站 + 3 座 110kV 变电所，为国网银川滨河供电公司管辖，绿电入园与储能并网的核心节点。"},
 suan:{t:"银川算力产业园",d:"2025 年 7 月启动运营；已引入天云算力中心、电信绿色智算中心（2600+ 架机柜）、百度智能云人工智能基础数据产业基地，服务银川「算力之都」建设。"},
 ess:{t:"云碳共享储能电站",d:"2026 年园区 19 个新开工项目之一，支撑国家级零碳园区建设方案（2026—2027 年）落地，为园区晚峰调峰与绿电消纳提供共享储能容量。"}};

let T3=null;
let isNight=false;

/* 窗户纹理（灰度底，由材质颜色着色；亮窗更亮） */
function winTex(){
 try{
  const cv=document.createElement("canvas");cv.width=64;cv.height=128;
  const g=cv.getContext("2d");if(!g)return null;
  g.fillStyle="#5e7896";g.fillRect(0,0,64,128);
  let seed=7;const rnd=()=>((seed=seed*16807%2147483647)/2147483647);
  for(let y=8;y<122;y+=12)for(let x=6;x<58;x+=10){
   g.fillStyle=rnd()>0.42?"#eef7ff":"#22354c";g.fillRect(x,y,6,7);}
  const t=new THREE.CanvasTexture(cv);return t;
 }catch(e){return null;}
}
/* 夜间发光窗户纹理 */
function winTexNight(){
 try{
  const cv=document.createElement("canvas");cv.width=64;cv.height=128;
  const g=cv.getContext("2d");if(!g)return null;
  g.fillStyle="#0a1525";g.fillRect(0,0,64,128);
  let seed=13;const rnd=()=>((seed=seed*16807%2147483647)/2147483647);
  for(let y=8;y<122;y+=12)for(let x=6;x<58;x+=10){
   const on=rnd()>0.45;
   g.fillStyle=on?"#ffe9a8":"#0d1f38";g.fillRect(x,y,6,7);
   if(on){g.fillStyle="rgba(255,210,120,.25)";g.fillRect(x-1,y-1,8,9);}}
  const t=new THREE.CanvasTexture(cv);return t;
 }catch(e){return null;}
}
/* 地面网格纹理 */
function groundTex(){
 try{
  const cv=document.createElement("canvas");cv.width=256;cv.height=256;
  const g=cv.getContext("2d");if(!g)return null;
  g.fillStyle="#0e2138";g.fillRect(0,0,256,256);
  g.strokeStyle="rgba(40,80,130,.25)";g.lineWidth=1;
  for(let i=0;i<=256;i+=16){g.beginPath();g.moveTo(i,0);g.lineTo(i,256);g.stroke();g.beginPath();g.moveTo(0,i);g.lineTo(256,i);g.stroke();}
  const t=new THREE.CanvasTexture(cv);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(76,76);return t;
 }catch(e){return null;}
}
/* 文字标签精灵 */
function makeLabel(main,sub,dim){
 try{
  const cv=document.createElement("canvas");cv.width=560;cv.height=(sub?150:96);
  const g=cv.getContext("2d");if(!g)return null;
  g.fillStyle="rgba(7,16,32,.82)";g.fillRect(8,8,544,cv.height-16);
  g.strokeStyle="rgba(64,150,220,.85)";g.lineWidth=3;g.strokeRect(8,8,544,cv.height-16);
  g.textAlign="center";g.fillStyle=dim?"#9FBEDA":"#FFFFFF";
  g.font="bold 44px 'Microsoft YaHei',sans-serif";g.fillText(main,280,sub?62:62);
  if(sub){g.fillStyle="#7DD3FC";g.font="28px 'Microsoft YaHei',sans-serif";g.fillText(sub,280,116);}
  const t=new THREE.CanvasTexture(cv);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:true}));
  sp.scale.set(dim?17:24,dim?17*cv.height/560:24*cv.height/560,1);
  return sp;
 }catch(e){return null;}
}
/* 天穹渐变球 */
function makeSky(){
 try{
  const cv=document.createElement("canvas");cv.width=64;cv.height=256;
  const g=cv.getContext("2d");if(!g)return null;
  const grd=g.createLinearGradient(0,0,0,256);
  grd.addColorStop(0,"#0a1e3a");grd.addColorStop(0.38,"#163b66");grd.addColorStop(0.50,"#3a6ea0");
  grd.addColorStop(0.56,"#24425f");grd.addColorStop(1,"#0b1e33");
  g.fillStyle=grd;g.fillRect(0,0,64,256);
  const t=new THREE.CanvasTexture(cv);
  const sky=new THREE.Mesh(new THREE.SphereGeometry(600,24,16),new THREE.MeshBasicMaterial({map:t,side:THREE.BackSide,fog:false}));
  return sky;
 }catch(e){return null;}
}
function makeSkyNight(){
 try{
  const cv=document.createElement("canvas");cv.width=64;cv.height=256;
  const g=cv.getContext("2d");if(!g)return null;
  const grd=g.createLinearGradient(0,0,0,256);
  grd.addColorStop(0,"#020610");grd.addColorStop(0.4,"#06112a");grd.addColorStop(0.5,"#0d2348");
  grd.addColorStop(0.56,"#0a1a36");grd.addColorStop(1,"#040c1c");
  g.fillStyle=grd;g.fillRect(0,0,64,256);
  // 星星
  let s=31;const r=()=>((s=s*16807%2147483647)/2147483647);
  for(let i=0;i<80;i++){g.fillStyle="rgba(255,255,255,"+(0.3+r()*0.6)+")";g.fillRect(r()*64,r()*100,1,1);}
  const t=new THREE.CanvasTexture(cv);
  const sky=new THREE.Mesh(new THREE.SphereGeometry(600,24,16),new THREE.MeshBasicMaterial({map:t,side:THREE.BackSide,fog:false}));
  return sky;
 }catch(e){return null;}
}

/* —— 建筑构造器：分段腰线 + 女儿墙 + 屋顶设备 —— */
function buildBuilding(b,col,tex,matOpts){
 const grp=new THREE.Group();
 const mat=new THREE.MeshPhysicalMaterial(Object.assign({color:col,map:tex||undefined,emissive:0x0b1a2e,
  roughness:0.55,metalness:0.15,clearcoat:0.65,clearcoatRoughness:0.25},matOpts||{}));
 const body=new THREE.Mesh(new THREE.BoxGeometry(b.w,b.h,b.d),mat);
 body.position.y=b.h/2;body.castShadow=true;body.receiveShadow=true;grp.add(body);
 // 腰线（中部一道深色横条）
 if(b.h>14){
  const belt=new THREE.Mesh(new THREE.BoxGeometry(b.w+0.3,1.2,b.d+0.3),new THREE.MeshLambertMaterial({color:0x2a3f5c}));
  belt.position.y=b.h*0.55;grp.add(belt);
 }
 // 女儿墙
 const parapet=new THREE.Mesh(new THREE.BoxGeometry(b.w+0.4,1.4,b.d+0.4),new THREE.MeshLambertMaterial({color:col,emissive:0x0a1830}));
 parapet.position.y=b.h+0.7;grp.add(parapet);
 // 屋顶设备
 if(b.type==="datacenter"){
  for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){
   const ct=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.6,2.4,10),new THREE.MeshLambertMaterial({color:0x8aa6c4}));
   ct.position.set(b.x!==undefined?0:i*10,b.h+2.4,j*7);grp.add(ct);
   const fan=new THREE.Mesh(new THREE.CircleGeometry(1.6,10),new THREE.MeshBasicMaterial({color:0x1a2a40}));
   fan.rotation.x=-Math.PI/2;fan.position.set(i*10,b.h+3.7,j*7);grp.add(fan);
  }
 }else if(b.type==="industrial"){
  // 烟囱
  for(let i=0;i<2;i++){
   const sc=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.4,Math.max(8,b.h*0.5),8),new THREE.MeshLambertMaterial({color:0x6a7888}));
   sc.position.set((i?1:-1)*b.w*0.3,b.h+Math.max(4,b.h*0.25),b.d*0.3);grp.add(sc);
   const cap=new THREE.Mesh(new THREE.CylinderGeometry(1.3,1.1,1,8),new THREE.MeshLambertMaterial({color:0x444c58}));
   cap.position.set((i?1:-1)*b.w*0.3,b.h+Math.max(4,b.h*0.25)+Math.max(8,b.h*0.5)/2+0.5,b.d*0.3);grp.add(cap);
  }
 }else if(b.type==="storage"){
  // 逆变器柜阵
  for(let i=-1;i<=1;i++){
   const inv=new THREE.Mesh(new THREE.BoxGeometry(1.8,2.2,1.2),new THREE.MeshLambertMaterial({color:0x3a5a7a}));
   inv.position.set(i*5,b.h+1.1,0);grp.add(inv);
  }
 }else{
  // 普通楼顶空调机组
  for(let i=0;i<3;i++){
   const u=new THREE.Mesh(new THREE.BoxGeometry(3,1.4,2),new THREE.MeshLambertMaterial({color:0x4a5a72}));
   u.position.set((i-1)*b.w*0.28,b.h+1,b.d*0.2);grp.add(u);
  }
 }
 // 企业标识牌（正面顶部小牌子）
 if(b.ref||b.scen){
  const sign=new THREE.Mesh(new THREE.BoxGeometry(Math.min(b.w*0.6,14),1.6,0.4),new THREE.MeshBasicMaterial({color:0x38BDF8}));
  sign.position.set(0,b.h*0.85,b.d/2+0.3);grp.add(sign);
 }
 return {grp,mat,body};
}
/* 树（三种） */
function makeTree(kind,x,z){
 const t=new THREE.Group();
 const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.4,.55,2.2,6),new THREE.MeshLambertMaterial({color:0x6b4a2f}));
 trunk.position.y=1.1;t.add(trunk);
 if(kind===0){ // 阔叶
  const cr=new THREE.Mesh(new THREE.SphereGeometry(2.2,8,6),new THREE.MeshLambertMaterial({color:0x2d8a52}));
  cr.position.y=4.2;t.add(cr);
 }else if(kind===1){ // 针叶
  const cr1=new THREE.Mesh(new THREE.ConeGeometry(1.8,3.5,8),new THREE.MeshLambertMaterial({color:0x1f6a3d}));
  cr1.position.y=3.8;t.add(cr1);
  const cr2=new THREE.Mesh(new THREE.ConeGeometry(1.3,2.8,8),new THREE.MeshLambertMaterial({color:0x257a45}));
  cr2.position.y=5.6;t.add(cr2);
 }else{ // 灌木球
  const cr=new THREE.Mesh(new THREE.SphereGeometry(1.4,8,6),new THREE.MeshLambertMaterial({color:0x3a9a5e}));
  cr.position.y=3;t.add(cr);
 }
 t.position.set(x,0,z);return t;
}
/* 车辆 */
function makeCar(x,z,rot,color){
 const c=new THREE.Group();
 const body=new THREE.Mesh(new THREE.BoxGeometry(4,1.2,1.8),new THREE.MeshLambertMaterial({color:color||0x6a8caf}));
 body.position.y=0.8;c.add(body);
 const cab=new THREE.Mesh(new THREE.BoxGeometry(2,1,1.6),new THREE.MeshLambertMaterial({color:0x2a3a52}));
 cab.position.set(-0.4,1.6,0);c.add(cab);
 const w1=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,.5,8),new THREE.MeshLambertMaterial({color:0x222}));
 w1.rotation.z=Math.PI/2;w1.position.set(1.2,.5,.9);c.add(w1);
 const w2=w1.clone();w2.position.set(-1.2,.5,.9);c.add(w2);
 const w3=w1.clone();w3.position.set(1.2,.5,-.9);c.add(w3);
 const w4=w1.clone();w4.position.set(-1.2,.5,-.9);c.add(w4);
 c.position.set(x,0,z);c.rotation.y=rot||0;return c;
}
/* 路灯 */
function makeLamp(x,z){
 const g=new THREE.Group();
 const pole=new THREE.Mesh(new THREE.CylinderGeometry(.15,.2,7,6),new THREE.MeshLambertMaterial({color:0x6a7888}));
 pole.position.y=3.5;g.add(pole);
 const arm=new THREE.Mesh(new THREE.BoxGeometry(.2,.2,2.5),new THREE.MeshLambertMaterial({color:0x6a7888}));
 arm.position.set(0,7,1);g.add(arm);
 const head=new THREE.Mesh(new THREE.BoxGeometry(.6,.3,.6),new THREE.MeshBasicMaterial({color:0xfff4cc}));
 head.position.set(0,7,2.2);g.add(head);
 g.position.set(x,0,z);return g;
}

function mountThree(){
 const host=document.getElementById("isoWorld");
 if(!host||!window.THREE)return false;
 if(T3){
  /* 页面重渲染会清空 isoWorld：若旧画布已脱离文档，先销毁再重建 */
  if(T3.dom&&T3.dom.isConnected)return true;
  try{T3.destroy();}catch(e){}
  T3=null;
 }
 const stage=host.parentElement;
 const tip=document.getElementById("wb3dTip");
 try{
  const W=stage.clientWidth||860,H=stage.clientHeight||380;
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setSize(W,H);renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.setClearColor(0x000000,0);
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;

  const scene=new THREE.Scene();
  scene.fog=new THREE.Fog(0x163560,260,560);
  const cam=new THREE.PerspectiveCamera(45,W/H,0.1,1400);
  const target=new THREE.Vector3(0,0,4);
  const st={theta:0.15,phi:1.18,r:165},goal={theta:0.15,phi:1.18,r:165};

  // 光照
  const hemi=new THREE.HemisphereLight(0x9fc3ff,0x0a1628,0.95);scene.add(hemi);
  const sun=new THREE.DirectionalLight(0xffffff,1.0);sun.position.set(90,130,50);
  sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
  sun.shadow.camera.left=-170;sun.shadow.camera.right=170;
  sun.shadow.camera.top=170;sun.shadow.camera.bottom=-170;
  sun.shadow.camera.far=420;sun.shadow.bias=-0.0006;
  sun.shadow.camera.updateProjectionMatrix();
  scene.add(sun);
  const amb=new THREE.AmbientLight(0x3a5a8a,0.35);scene.add(amb);

  const g=new THREE.Group();scene.add(g);

  // 天穹
  let skyMesh=makeSky();if(skyMesh)scene.add(skyMesh);
  let skyNight=makeSkyNight();

  // 地面
  const gtex=groundTex();
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(1200,1200),
   new THREE.MeshLambertMaterial({color:0x0e2138,map:gtex||undefined}));
  ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;g.add(ground);

  // 中心湖
  const lake=new THREE.Mesh(new THREE.CircleGeometry(18,32),
   new THREE.MeshLambertMaterial({color:0x1a5a8a,transparent:true,opacity:0.75}));
  lake.rotation.x=-Math.PI/2;lake.position.set(-12,0.05,18);g.add(lake);
  const lakeRim=new THREE.Mesh(new THREE.RingGeometry(18,19.5,32),
   new THREE.MeshLambertMaterial({color:0x4a6a8a,side:THREE.DoubleSide}));
  lakeRim.rotation.x=-Math.PI/2;lakeRim.position.set(-12,0.06,18);g.add(lakeRim);

  // 片区
  ZONES.forEach(z=>{
   const p=new THREE.Mesh(new THREE.PlaneGeometry(z.w,z.d),
    new THREE.MeshLambertMaterial({color:z.col,transparent:true,opacity:0.10}));
   p.rotation.x=-Math.PI/2;p.position.set(z.x,0.04,z.z);g.add(p);
   const b=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(z.x-z.w/2,0.06,z.z-z.d/2),new THREE.Vector3(z.x+z.w/2,0.06,z.z-z.d/2),
    new THREE.Vector3(z.x+z.w/2,0.06,z.z+z.d/2),new THREE.Vector3(z.x-z.w/2,0.06,z.z+z.d/2)]),
    new THREE.LineBasicMaterial({color:z.col,transparent:true,opacity:0.5}));
   g.add(b);
   const lbl=makeLabel(z.name,null,true);if(lbl){lbl.position.set(z.x,7,z.z);g.add(lbl);}
  });

  // 主干道 + 次干道 + 人行道
  function roadStrip(w,l,x,z,col){
   const m=new THREE.Mesh(new THREE.PlaneGeometry(w,l),new THREE.MeshLambertMaterial({color:col||0x172c4e}));
   m.rotation.x=-Math.PI/2;m.position.set(x,0.1,z);g.add(m);
  }
  function sidewalk(w,l,x,z){
   const m=new THREE.Mesh(new THREE.PlaneGeometry(w,l),new THREE.MeshLambertMaterial({color:0x2a3f5c}));
   m.rotation.x=-Math.PI/2;m.position.set(x,0.09,z);g.add(m);
  }
  // 京河大道（东西向）
  roadStrip(220,12,0,8);sidewalk(220,3,0,3.5);sidewalk(220,3,0,12.5);
  // 如意街（南北向）
  roadStrip(12,260,0,0);sidewalk(3,260,-7.5,0);sidewalk(3,260,7.5,0);
  // 次干道
  roadStrip(8,180,-40,0,0x1a2e4a);roadStrip(8,180,40,0,0x1a2e4a);roadStrip(180,8,0,-40,0x1a2e4a);roadStrip(180,8,0,40,0x1a2e4a);
  // 车道虚线
  for(let x=-106;x<=106;x+=8){const d=new THREE.Mesh(new THREE.PlaneGeometry(4,.5),
   new THREE.MeshBasicMaterial({color:0xFBBF24,transparent:true,opacity:.6}));
   d.rotation.x=-Math.PI/2;d.position.set(x,.14,8);g.add(d);}
  for(let z=-126;z<=126;z+=8){if(Math.abs(z-8)<5)continue;const d=new THREE.Mesh(new THREE.PlaneGeometry(.5,4),
   new THREE.MeshBasicMaterial({color:0xFBBF24,transparent:true,opacity:.6}));
   d.rotation.x=-Math.PI/2;d.position.set(0,.14,z);g.add(d);}
  // 斑马线
  for(let i=-6;i<=6;i+=2){const d=new THREE.Mesh(new THREE.PlaneGeometry(1.5,4),
   new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.5}));
   d.rotation.x=-Math.PI/2;d.position.set(i,.15,8);g.add(d);}
  // 路灯（沿京河大道与如意街）
  for(let x=-90;x<=90;x+=30){g.add(makeLamp(x,15));g.add(makeLamp(x,1));}
  for(let z=-90;z<=90;z+=30){if(Math.abs(z-8)<8)continue;g.add(makeLamp(-9,z));g.add(makeLamp(9,z));}

  // 道路标签
  const rl1=makeLabel("京河大道",null,true);if(rl1){rl1.position.set(46,3,15);rl1.scale.set(14,14*96/560,1);g.add(rl1);}
  const rl2=makeLabel("如意街",null,true);if(rl2){rl2.position.set(-8,3,-60);rl2.scale.set(14,14*96/560,1);g.add(rl2);}

  // 建筑
  const tex=winTex(),texN=winTexNight(),pick=[];
  const buildingMats=[];
  B3.forEach(b=>{
   const c=b.ref?COMPANIES.find(x=>x.id===b.ref):null;
   const col=c?EG_COL[c.eg]:(b.col||0x4A7AB5);
   const {grp,mat,body}=buildBuilding(b,col,tex);
   grp.position.set(b.x,0,b.z);g.add(grp);
   const edge=new THREE.LineSegments(new THREE.EdgesGeometry(body.geometry),
    new THREE.LineBasicMaterial({color:0x7DD3FC,transparent:true,opacity:.5}));
   edge.position.copy(body.position).add(new THREE.Vector3(b.x,0,b.z));g.add(edge);
   const lbl=makeLabel(c?c.name:b.name,
    c?("能耗 "+c.en+"万tce · 碳排 "+c.co+"万tCO₂ · 能效 "+c.eg+" 级"):"园区设施",!c);
   if(lbl){lbl.position.set(b.x,b.h+5,b.z);g.add(lbl);}
   body.userData={ref:c?c.id:null,name:c?c.name:b.name,edge,mat,
    info:!c?SCEN_INFO[b.scen]:null,grp};
   pick.push(body);buildingMats.push({mat,body,b,c});

   // 停车场（每栋楼前）
   if(b.x!==undefined){
    const px=b.x,pz=b.z+(b.d/2)+4;
    const lot=new THREE.Mesh(new THREE.PlaneGeometry(b.w*0.7,6),new THREE.MeshLambertMaterial({color:0x1a2a40}));
    lot.rotation.x=-Math.PI/2;lot.position.set(px,0.08,pz);g.add(lot);
    for(let i=-2;i<=2;i++){g.add(makeCar(px+i*4.2,pz,0,0x5a7a9a));}
   }
  });

  // 光伏阵列（新能源片区地面 + 数据中心屋顶）
  for(let r=0;r<4;r++)for(let i=0;i<7;i++){
   const pv=new THREE.Mesh(new THREE.BoxGeometry(4,.2,2.6),
    new THREE.MeshLambertMaterial({color:0x1E4E8C,emissive:0x0a2c55}));
   pv.position.set(58+i*5.5,.6,2+r*5);pv.rotation.x=-0.5;g.add(pv);
   // 支架
   const st=new THREE.Mesh(new THREE.BoxGeometry(.2,.8,.2),new THREE.MeshLambertMaterial({color:0x555}));
   st.position.set(58+i*5.5,.4,2+r*5+1);g.add(st);
  }
  // 数据中心屋顶光伏
  for(let i=-3;i<=3;i++)for(let j=-2;j<=2;j++){
   const pv=new THREE.Mesh(new THREE.BoxGeometry(3,.15,1.8),
    new THREE.MeshLambertMaterial({color:0x1E4E8C,emissive:0x0a2c55}));
   pv.position.set(24+i*4.5,12.3,-46+j*4);pv.rotation.x=-0.4;g.add(pv);
  }

  // 风机
  const turbines=[];
  [[74,-10],[86,18],[80,-2]].forEach(([x,z])=>{
   const gp=new THREE.Group();
   const pole=new THREE.Mesh(new THREE.CylinderGeometry(.6,.9,17,8),new THREE.MeshLambertMaterial({color:0xbfd6e8}));
   pole.position.y=8.5;gp.add(pole);
   const hub=new THREE.Group();hub.position.y=17;
   for(let i=0;i<3;i++){const w=new THREE.Group();w.rotation.z=i*2.094;
    const bl=new THREE.Mesh(new THREE.BoxGeometry(.5,7,.18),new THREE.MeshLambertMaterial({color:0xe8f4ff}));
    bl.position.y=3.5;w.add(bl);hub.add(w);}
   gp.add(hub);gp.position.set(x,0,z);g.add(gp);turbines.push(hub);});

  // 变电站设施
  for(let i=0;i<3;i++){const t=new THREE.Mesh(new THREE.CylinderGeometry(2,2,3.4,10),
   new THREE.MeshLambertMaterial({color:0x6d86a8}));
   t.position.set(-84,1.7,-12+i*6);g.add(t);}
  const pylon=new THREE.Mesh(new THREE.BoxGeometry(.8,18,.8),new THREE.MeshLambertMaterial({color:0x7d94b4}));
  pylon.position.set(-72,9,-14);g.add(pylon);
  [[-72,-10],[-72,-2],[-70,-6]].forEach(([x,z],i)=>{
   const bx=new THREE.Mesh(new THREE.BoxGeometry(3,2,6),
    new THREE.MeshLambertMaterial({color:i%2?0x2DD4BF:0xd7e6f5}));
   bx.position.set(x,1.2,z);g.add(bx);});
  // 变电站围栏
  const fenceMat=new THREE.MeshLambertMaterial({color:0x8a9aaa});
  for(let x=-90;x<=-70;x+=3){const f=new THREE.Mesh(new THREE.BoxGeometry(.1,1.6,.1),fenceMat);f.position.set(x,.8,2);g.add(f);
   const f2=new THREE.Mesh(new THREE.BoxGeometry(.1,1.6,.1),fenceMat);f2.position.set(x,.8,-14);g.add(f2);}
  for(let z=-14;z<=2;z+=3){const f=new THREE.Mesh(new THREE.BoxGeometry(.1,1.6,.1),fenceMat);f.position.set(-90,.8,z);g.add(f);}

  // 储能集装箱
  [[36,-50],[40,-50],[44,-50],[48,-50],[36,-46],[40,-46],[44,-46],[48,-46]].forEach(([x,z],i)=>{
   const bx=new THREE.Mesh(new THREE.BoxGeometry(3.2,2.4,6),
    new THREE.MeshLambertMaterial({color:i%2?0x2DD4BF:0xe8f4ff}));
   bx.position.set(x,1.2,z);g.add(bx);});

  // 园区入口大门
  const gateL=new THREE.Mesh(new THREE.BoxGeometry(1,6,4),new THREE.MeshLambertMaterial({color:0x4A6A8C}));
  gateL.position.set(-8,3,-66);g.add(gateL);
  const gateR=new THREE.Mesh(new THREE.BoxGeometry(1,6,4),new THREE.MeshLambertMaterial({color:0x4A6A8C}));
  gateR.position.set(8,3,-66);g.add(gateR);
  const gateTop=new THREE.Mesh(new THREE.BoxGeometry(18,2.5,1),new THREE.MeshLambertMaterial({color:0x38BDF8,emissive:0x1a5a8a}));
  gateTop.position.set(0,7.5,-66);g.add(gateTop);
  const gateLbl=makeLabel("苏银产业园",null,false);if(gateLbl){gateLbl.position.set(0,12,-66);gateLbl.scale.set(16,16*96/560,1);g.add(gateLbl);}
  // 旗杆
  [-4,0,4].forEach(x=>{const fp=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,9,6),new THREE.MeshLambertMaterial({color:0xcccccc}));
   fp.position.set(x,4.5,-62);g.add(fp);});

  // 绿化（沿路与散布）
  const treePos=[
   [-40,14],[-52,22],[-64,28],[14,26],[-14,-32],[-44,-8],[36,26],[52,30],[-72,50],[64,-54],[-20,-66],[82,-22],[-8,-58],[20,20],
   [-30,16],[-16,14],[0,24],[8,30],[44,16],[56,18],[70,22],[-66,18],[-54,-12],[38,-18],[16,-58],[-90,-20],[88,-40],
   [-110,30],[-110,-30],[110,40],[110,-20],[-100,60],[100,60]
  ];
  treePos.forEach(([x,z],i)=>g.add(makeTree(i%3,x,z)));
  // 沿京河大道行道树
  for(let x=-100;x<=100;x+=14){if(Math.abs(x)<10)continue;g.add(makeTree(1,x,16));g.add(makeTree(1,x,0));}
  // 湖边灌木
  for(let a=0;a<360;a+=30){const r=21,x=-12+Math.cos(a*Math.PI/180)*r,z=18+Math.sin(a*Math.PI/180)*r;g.add(makeTree(2,x,z));}

  // 排放粒子（企业上方，颜色对应能效等级）
  const emitters=[];
  B3.filter(b=>b.ref).forEach(b=>{
   const c=COMPANIES.find(x=>x.id===b.ref);if(!c)return;
   const pcol=EG_PARTICLE[c.eg]||0xFBBF24;
   for(let i=0;i<8;i++){
    const p=new THREE.Mesh(new THREE.SphereGeometry(.4,6,6),new THREE.MeshBasicMaterial({color:pcol,transparent:true,opacity:.7}));
    p.position.set(b.x+(Math.random()-.5)*b.w*0.6,b.h+2,b.z+(Math.random()-.5)*b.d*0.6);
    p.userData={baseY:b.h+2,speed:0.3+Math.random()*0.4,phase:Math.random()*6.28,amp:0.5+Math.random()*0.5};
    g.add(p);emitters.push(p);
   }
  });

  // 数据流光点（甘露变电站 → 各企业）
  const pulses=[[-80,-6,-56,-34],[-80,-6,-26,-16],[-80,-6,24,-46],[-80,-6,62,-30],[-80,-6,30,42],[-80,-6,-60,40],[-80,-6,-26,42]]
   .map((p,i)=>({a:new THREE.Vector3(p[0],2.4,p[1]),b:new THREE.Vector3(p[2],2.4,p[3]),
    mesh:new THREE.Mesh(new THREE.SphereGeometry(.8,8,8),new THREE.MeshBasicMaterial({color:0xFBBF24})),ph:i*0.13}));
  pulses.forEach(p=>g.add(p.mesh));

  /* ============ 数字孪生增强层 ============ */
  let twinOn=true;
  // ① 企业建筑顶部数据光环（双层旋转环，颜色=能效等级）
  const halos=[];
  B3.filter(b=>b.ref).forEach(b=>{
   const c=COMPANIES.find(x=>x.id===b.ref);if(!c)return;
   const hcol=EG_COL[c.eg]||0x38BDF8;
   const rg=new THREE.Group();
   const r1=new THREE.Mesh(new THREE.RingGeometry(Math.max(b.w,b.d)*0.30,Math.max(b.w,b.d)*0.34,48),
    new THREE.MeshBasicMaterial({color:hcol,transparent:true,opacity:0.8,side:THREE.DoubleSide,depthWrite:false}));
   const r2=new THREE.Mesh(new THREE.RingGeometry(Math.max(b.w,b.d)*0.42,Math.max(b.w,b.d)*0.44,48,1,0,Math.PI*0.6),
    new THREE.MeshBasicMaterial({color:0x7DD3FC,transparent:true,opacity:0.9,side:THREE.DoubleSide,depthWrite:false}));
   r1.rotation.x=r2.rotation.x=-Math.PI/2;
   rg.add(r1);rg.add(r2);
   rg.position.set(b.x,b.h+3.2,b.z);g.add(rg);
   halos.push({rg,r2,speed:0.5+Math.random()*0.5});
  });
  // ② 企业悬浮孪生数据面板（HUD 风格 Canvas 精灵）
  function twinPanel(c){
   try{
    const cv=document.createElement("canvas");cv.width=360;cv.height=210;
    const ctx=cv.getContext("2d");if(!ctx)return null;
    ctx.fillStyle="rgba(4,16,34,.78)";ctx.fillRect(0,0,360,210);
    ctx.fillStyle="rgba(45,212,191,.9)";ctx.fillRect(0,0,8,210);
    ctx.strokeStyle="rgba(96,165,250,.7)";ctx.lineWidth=2;ctx.strokeRect(1,1,358,208);
    ctx.fillStyle="#EAF6FF";ctx.font="bold 30px 'Microsoft YaHei',sans-serif";ctx.fillText(c.name,26,46);
    ctx.font="22px 'Microsoft YaHei',sans-serif";
    ctx.fillStyle="#7DD3FC";ctx.fillText("综合能耗",26,92);ctx.fillStyle="#FFD666";ctx.fillText(c.en+" 万tce",150,92);
    ctx.fillStyle="#7DD3FC";ctx.fillText("碳排量",26,132);ctx.fillStyle="#FFD666";ctx.fillText(c.co+" 万tCO₂",150,132);
    ctx.fillStyle="#7DD3FC";ctx.fillText("能效等级",26,172);
    const ec={A:"#4ADE80",B:"#FBBF24",C:"#F87171"}[c.eg]||"#FBBF24";
    ctx.fillStyle=ec;ctx.fillText(c.eg+" 级 · "+(c.eg==="A"?"行业领跑":c.eg==="B"?"达标运行":"重点管控"),150,172);
    const t=new THREE.CanvasTexture(cv);
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));
    sp.scale.set(24,24*210/360,1);
    return sp;
   }catch(e){return null;}
  }
  const panels=[];
  B3.filter(b=>b.ref).forEach(b=>{
   const c=COMPANIES.find(x=>x.id===b.ref);if(!c)return;
   const sp=twinPanel(c);
   if(sp){sp.position.set(b.x+b.w*0.75,b.h*0.68,b.z);sp.visible=false;g.add(sp);
    panels.push({sp,baseY:sp.position.y,ph:Math.random()*6.28,ref:b.ref});}
  });
  // ③ 园区地面扩散扫描环（自园区中心向外脉冲）
  const scanRings=[];
  for(let i=0;i<3;i++){
   const r=new THREE.Mesh(new THREE.RingGeometry(1,1.05,64),
    new THREE.MeshBasicMaterial({color:0x38BDF8,transparent:true,opacity:0.45,side:THREE.DoubleSide,depthWrite:false}));
   r.rotation.x=-Math.PI/2;r.position.set(0,0.28,4);r.userData={ph:i/3};
   g.add(r);scanRings.push(r);
  }
  // ④ 甘露变电站雷达扫描扇面（旋转渐变扇形）
  let radarGroup=null;
  try{
   const cv=document.createElement("canvas");cv.width=256;cv.height=256;
   const ctx=cv.getContext("2d");
   const grd=ctx.createRadialGradient(128,128,0,128,128,128);
   grd.addColorStop(0,"rgba(45,212,191,.55)");grd.addColorStop(0.75,"rgba(45,212,191,.12)");grd.addColorStop(1,"rgba(45,212,191,0)");
   ctx.fillStyle=grd;ctx.beginPath();ctx.moveTo(128,128);ctx.arc(128,128,128,-Math.PI/2,-Math.PI/2+Math.PI/3);ctx.closePath();ctx.fill();
   ctx.strokeStyle="rgba(125,211,252,.9)";ctx.lineWidth=3;
   ctx.beginPath();ctx.moveTo(128,128);ctx.lineTo(128,0);ctx.stroke();
   radarGroup=new THREE.Group();
   const radar=new THREE.Mesh(new THREE.PlaneGeometry(70,70),
    new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthWrite:false,opacity:0.85}));
   radar.rotation.x=-Math.PI/2;radarGroup.add(radar);
   radarGroup.position.set(-80,0.5,-6);g.add(radarGroup);
  }catch(e){}

  /* —— 交互：轨道控制（拖拽旋转 / 滚轮缩放 / 点击下钻） —— */
  const dom=renderer.domElement;
  const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();
  let drag=false,lx=0,ly=0,moved=0,hovered=null;
  function castAt(e){
   const rc=dom.getBoundingClientRect();
   ndc.x=(e.clientX-rc.left)/rc.width*2-1;ndc.y=-((e.clientY-rc.top)/rc.height*2+1);
   ray.setFromCamera(ndc,cam);
   const hits=ray.intersectObjects(pick,false);
   return hits.length?hits[0].object:null;
  }
  function setHover(o,e){
   if(hovered===o){if(o&&e&&tip){tip.style.left=(e.clientX+14)+"px";tip.style.top=(e.clientY+10)+"px";}return;}
   if(hovered){hovered.userData.edge.material.color.set(0x7DD3FC);hovered.material.emissive.setHex(0x0b1a2e);}
   hovered=o;
   panels.forEach(p=>{p.sp.visible=twinOn&&(window.__t3PanelsAll||(!!o&&o.userData.ref===p.ref));});
   if(o){o.userData.edge.material.color.set(0x38BDF8);o.material.emissive.setHex(0x0e3c66);
    const u=o.userData;
    tip.innerHTML=u.ref?`<b>${u.name}</b><br>点击建筑下钻企业能碳画像`:u.info?`<b>${u.info.t}</b><br>点击查看设施介绍`:u.name;
    tip.style.display="block";
    if(e){tip.style.left=(e.clientX+14)+"px";tip.style.top=(e.clientY+10)+"px";}
    dom.style.cursor="pointer";
   }else{tip.style.display="none";dom.style.cursor="grab";}
  }
  const onMove=e=>{
   if(drag){
    const dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;moved+=Math.abs(dx)+Math.abs(dy);
    goal.theta-=dx*0.006;goal.phi=Math.min(1.5,Math.max(0.18,goal.phi-dy*0.005));
    tip.style.display="none";return;}
   setHover(castAt(e),e);};
  const onDown=e=>{drag=true;moved=0;lx=e.clientX;ly=e.clientY;dom.style.cursor="grabbing";};
  const onUp=()=>{drag=false;dom.style.cursor="grab";};
  const onWheel=e=>{e.preventDefault();goal.r=Math.min(380,Math.max(60,goal.r*(1+e.deltaY*0.0012)));};
  const onClick=e=>{if(moved>6)return;const o=castAt(e);if(!o)return;
   const u=o.userData;
   if(u.ref)coModal(u.ref);
   else if(u.info)showModal("园区设施 · "+u.info.t,`<table>${row("设施名称",u.info.t,"三维实景建模设施")}</table><div class="concl"><b>设施说明：</b>${u.info.d}</div>`);};
  const onLeave=()=>setHover(null);
  const onResize=()=>{const w=stage.clientWidth||W,h=stage.clientHeight||H;
   cam.aspect=w/h;cam.updateProjectionMatrix();renderer.setSize(w,h);};
  dom.addEventListener("pointerdown",onDown);
  dom.addEventListener("pointermove",onMove);
  window.addEventListener("pointerup",onUp);
  dom.addEventListener("wheel",onWheel,{passive:false});
  dom.addEventListener("click",onClick);
  dom.addEventListener("pointerleave",onLeave);
  window.addEventListener("resize",onResize);

  /* 动画循环 */
  let raf=0,last=performance.now();
  const clock0=performance.now();
  function animate(now){
   raf=requestAnimationFrame(animate);
   const dt=Math.min((now-last)/1000,.1);last=now;
   const el=(now-clock0)/1000;
   if(window.__t3Cruise&&!drag)goal.theta+=dt*0.16;
   st.theta+=(goal.theta-st.theta)*.07;st.phi+=(goal.phi-st.phi)*.07;st.r+=(goal.r-st.r)*.07;
   cam.position.set(
    target.x+st.r*Math.sin(st.phi)*Math.sin(st.theta),
    target.y+st.r*Math.cos(st.phi),
    target.z+st.r*Math.sin(st.phi)*Math.cos(st.theta));
   cam.lookAt(target);
   turbines.forEach(h=>h.rotation.z+=dt*1.1);
   pulses.forEach(p=>{const t=(el*0.11+p.ph)%1;
    p.mesh.position.lerpVectors(p.a,p.b,t);
    p.mesh.scale.setScalar(0.7+0.5*Math.sin(t*Math.PI));});
   emitters.forEach(p=>{const u=p.userData;
    p.position.y=u.baseY+Math.sin(el*u.speed+u.phase)*u.amp*2;
    p.position.x+=Math.sin(el*0.5+u.phase)*0.01;
    p.material.opacity=0.5+0.3*Math.sin(el*u.speed+u.phase);});
   halos.forEach(h=>{h.rg.rotation.y+=dt*h.speed*0.7;h.r2.rotation.z+=dt*1.4;});
   panels.forEach(p=>{p.sp.position.y=p.baseY+Math.sin(el*0.8+p.ph)*0.8;});
   scanRings.forEach(r=>{const t=(el*0.14+r.userData.ph)%1;
    const rad=8+t*130;r.scale.set(rad,rad,1);r.material.opacity=0.45*(1-t);});
   if(radarGroup)radarGroup.rotation.y-=dt*0.9;
   renderer.render(scene,cam);}
  raf=requestAnimationFrame(animate);

  /* 成功后替换 SVG 回退内容 */
  host.style.transform="none";host.style.width="100%";host.style.height="100%";
  host.innerHTML="";host.appendChild(dom);
  dom.style.cssText="width:100%;height:100%;display:block;cursor:grab;touch-action:none;";

  T3={dom:dom,scene:scene,destroy(){
   cancelAnimationFrame(raf);
   dom.removeEventListener("pointerdown",onDown);dom.removeEventListener("pointermove",onMove);
   window.removeEventListener("pointerup",onUp);dom.removeEventListener("wheel",onWheel);
   dom.removeEventListener("click",onClick);dom.removeEventListener("pointerleave",onLeave);
   window.removeEventListener("resize",onResize);
   renderer.dispose();host.innerHTML="";tip.style.display="none";},
   preset(v){const p=CAM_PRESET[v]||CAM_PRESET.a;goal.theta=p[0];goal.phi=p[1];goal.r=p[2];},
   zoom(z){goal.r=Math.min(380,Math.max(60,15000/z));},
   toggleFx(){twinOn=!twinOn;
    halos.forEach(h=>h.rg.visible=twinOn);
    panels.forEach(p=>p.sp.visible=twinOn&&!!window.__t3PanelsAll);
    scanRings.forEach(r=>r.visible=twinOn);
    if(radarGroup)radarGroup.visible=twinOn;
    return twinOn;},
   panelsAll(on){window.__t3PanelsAll=on;panels.forEach(p=>p.sp.visible=twinOn&&on);},
   toggleNight(){
    isNight=!isNight;
    if(isNight){
     if(skyNight){scene.remove(skyMesh);scene.add(skyNight);skyMesh=skyNight;}
     hemi.intensity=0.3;sun.intensity=0.2;amb.intensity=0.5;
     buildingMats.forEach(({mat,b})=>{if(texN)mat.map=texN;mat.emissive.setHex(0x1a3a5c);mat.emissiveIntensity=0.6;mat.needsUpdate=true;});
     scene.fog.color.setHex(0x040a18);
    }else{
     if(skyMesh!==makeSky()){scene.remove(skyNight);skyMesh=makeSky();scene.add(skyMesh);}
     hemi.intensity=0.95;sun.intensity=1.0;amb.intensity=0.35;
     buildingMats.forEach(({mat,b})=>{if(tex)mat.map=tex;mat.emissive.setHex(0x0b1a2e);mat.emissiveIntensity=1;mat.needsUpdate=true;});
     scene.fog.color.setHex(0x163560);
    }
   }};
  return true;
 }catch(e){
  console.warn("三维实景初始化失败，保留示意图回退：",e&&e.message);
  if(tip)tip.style.display="none";
  T3=null;return false;}
}
window.mountThree=mountThree;
window.__T3=()=>T3; /* 调试钩子 */

/* 视角 / 缩放 / 昼夜接管（保留 CSS 回退） */
const _isoView7=window.isoView,_isoZoom7=window.isoZoom;
const CAM_PRESET={a:[0.15,1.18,165],b:[2.4,0.55,250],c:[-0.42,1.35,110]};
function t3Preset(v){if(T3&&T3.preset)T3.preset(v);}
function t3Zoom(z){if(T3&&T3.zoom)T3.zoom(z);}
window.isoView=v=>{
 document.querySelectorAll("[data-iso]").forEach(b=>b.classList.toggle("on",b.dataset.iso===v));
 const el=document.getElementById("isoWorld");if(el)el.dataset.view=v;
 if(T3)t3Preset(v);else if(_isoView7)_isoView7(v);};
window.isoZoom=z=>{const el=document.getElementById("isoWorld");if(el)el.dataset.z=z;
 if(T3)t3Zoom(z);else if(_isoZoom7)_isoZoom7(z);};
window.toggleNight=()=>{if(T3&&T3.toggleNight)T3.toggleNight();};
window.toggleTwinFx=()=>{if(T3&&T3.toggleFx)T3.toggleFx();};

/* 演示导览更新 */
if(window.DEMO_STEPS&&DEMO_STEPS[0])
 DEMO_STEPS[0].pts="左侧导航点击「能碳总览驾驶舱」进入全屏大屏模式（ESC / 右上按钮返回系统）→ 数字孪生园区（真实苏银产业园布局：拖拽旋转/滚轮缩放/视角A·B·C/昼夜切换/扫描环·雷达扇面·数据光环·悬浮孪生面板/点击建筑下钻真实企业）→ 能流/碳流图（切换企业/时间维度）→ 核心指标点击弹历年趋势 → 信息概览区 8 卡片专题分析";

/* 驾驶舱渲染接管：换提示文案 + 工具栏/图例/说明挂进三维卡片内（大屏布局不再散落页尾） */
const _prevDash=PAGES.dashboard.render;
PAGES.dashboard.render=()=>{
 let html=_prevDash()
  .replace("高度=综合能耗 · 颜色=能效等级 · 点击建筑下钻企业画像",
   "数字孪生园区 · 建筑高度=综合能耗 · 颜色=能效等级；拖拽旋转 / 滚轮缩放 / 点击建筑下钻")
  .replace('<div id="isoToolbarSlot"></div>',`<div class="iso-toolbar">
     <button class="btn ghost" onclick="toggleNight()">昼夜切换</button>
     <button class="btn ghost" onclick="toggleTwinFx()">孪生特效</button>
    </div>
    <div class="iso-leg">
     <span><i style="background:#2DD4BF"></i>能效A级</span>
     <span><i style="background:#FBBF24"></i>能效B级</span>
     <span><i style="background:#F87171"></i>能效C级</span>
     <span><i style="background:#FBBF24"></i>能源数据流</span>
     <span><i style="background:#4ADE80"></i>排放粒子（绿低/黄中/红高）</span>
     <span><i style="background:#38BDF8"></i>扫描环 · 雷达扇面 · 数据光环</span>
    </div>`);
 setTimeout(()=>{if(window.THREE)mountThree();},80);
 return html;};

/* 重新渲染当前页（驾驶舱三维实景即刻生效），并保持用户已切换的页签不被覆盖（防加载期吞点击） */
go(curPage);
(function(){const t=document.querySelector(".tab.on");if(t){const R=(typeof RENDERERS!=="undefined")&&RENDERERS[t.dataset.t];if(R){const b=document.getElementById("tabBody");if(b)b.innerHTML=R();}}})();
})();
