/* ================= 自适应布局 + 界面美化补丁（在所有模块之后执行） ================= */
document.head.insertAdjacentHTML("beforeend",`<style>
/* ---- 图表/图片自适应 ---- */
.modal{width:min(900px,94vw)!important;max-height:88vh;}
.ech{width:100%!important;min-height:60px;}
.map-wrap,.chart{width:100%;overflow:hidden;}
.map-svg{display:block;width:100%;height:auto;border-radius:10px;box-shadow:0 10px 26px rgba(2,8,20,.45),inset 0 1px 0 rgba(255,255,255,.04);}
.iso-stage{max-width:100%;}
.iso-stage svg,.iso-stage canvas{max-width:100%;}
/* 图中文字：加描边底衬，避免与色带/底图撞色 */
.dot-label,.dist-lb,.node-t,.flow-lb{font-family:"Microsoft YaHei","PingFang SC",sans-serif;letter-spacing:.4px;}
.dot-label{paint-order:stroke;stroke:rgba(8,18,34,.9);stroke-width:3px;stroke-linejoin:round;}
.dist-lb{paint-order:stroke;stroke:rgba(8,18,34,.75);stroke-width:3px;}
.node-t,.flow-lb{paint-order:stroke;stroke:rgba(10,22,40,.55);stroke-width:2.5px;}
.flow-pill rect{filter:drop-shadow(0 2px 4px rgba(2,8,20,.45));}
.flow-src{transition:filter .2s;}
.map-point:hover .flow-src{stroke:#7DD3FC;filter:drop-shadow(0 0 6px rgba(56,189,248,.5));}
/* ---- 细节美化 ---- */
.kpi .v{font-variant-numeric:tabular-nums;}
.card h3{letter-spacing:.4px;}
.card>.legend:last-child{margin-bottom:-2px;}
table td:first-child{color:#C7DBF0;}
.concl{margin-top:8px;}
.sub2{display:flex;align-items:center;gap:8px;letter-spacing:.3px;}
.sub2::before{content:"";width:3px;height:12px;border-radius:2px;background:linear-gradient(180deg,#38BDF8,#2DD4BF);}
.progress{background:rgba(30,58,92,.7);}
.progress i{background:linear-gradient(90deg,#2DD4BF,#38BDF8);box-shadow:0 0 8px rgba(45,212,191,.5);}
.progress.warn i{background:linear-gradient(90deg,#FBBF24,#F59E0B);box-shadow:0 0 8px rgba(251,191,36,.45);}
/* ---- 响应式：网格逐级折叠，图表随容器收放 ---- */
@media(max-width:1500px){.kpis{grid-template-columns:repeat(5,1fr)!important;}}
@media(max-width:1360px){
 .g4{grid-template-columns:1fr 1fr!important;}
 .kpis{grid-template-columns:repeat(4,1fr)!important;}
 .core-strip{grid-template-columns:1fr 1fr!important;}
}
@media(max-width:1100px){.g3{grid-template-columns:1fr 1fr!important;}}
@media(max-width:860px){
 .g2,.g3,.g4{grid-template-columns:1fr!important;}
 .kpis{grid-template-columns:repeat(2,1fr)!important;}
 .core-strip{grid-template-columns:1fr!important;}
 .content{padding:12px;}
}
</style>`);

/* ---- 页面切换 / 窗口尺寸变化后：补渲染排队图表 + 重算图表尺寸 + 三维园区整体缩放 ---- */
(function(){
 function refit(){
  try{flushCharts();}catch(e){}
  try{resizeCharts();}catch(e){}
  try{if(window.isoApply)isoApply();}catch(e){}
 }
 const _go=window.go;
 window.go=function(p){const r=_go(p);setTimeout(refit,110);setTimeout(refit,420);return r;};
 window.addEventListener("resize",function(){setTimeout(refit,120);});
 /* 首次进入：等布局稳定后统一校一次尺寸 */
 setTimeout(refit,600);
})();
