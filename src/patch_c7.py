# -*- coding: utf-8 -*-
"""c7 patch: 重写 flowSvg（先画带后画框+胶囊标签+数据驱动企业）、isoApply 自适应缩放、coModal 企业能流图重排"""
import io

SRC = "D:/新建文件夹/宁夏苏银产业园/.workbuddy/output/prototype/src/c7-video-boost.js"
lines = io.open(SRC, encoding="utf-8").read().split("\n")

# ---- 1) 替换 flowSvg（行 167-184，0 基 166..183），并在其后保留 window.flowSvg=flowSvg; ----
assert lines[166].strip().startswith("function flowSvg(mode)"), lines[166]
assert lines[183].strip() == "}", lines[183]
new_flow = r''' function flowPill(x,y,color,txt){const w=txt.length*11+18;
  return `<g class="flow-pill"><rect x="${x}" y="${y-12}" width="${w}" height="20" rx="10" fill="rgba(8,18,34,.85)" stroke="${color}" stroke-opacity=".5"/><text x="${x+9}" y="${y+4}" fill="${color}" font-size="11">${txt}</text></g>`;}
 function flowSvg(mode){
  const co=mode==="co";
  const comps=COMPANIES.slice().sort((a,b)=>b.en-a.en).slice(0,5);
  const HUBX=356,HUBW=150,COMX=736,COMW=198;
  const srcs=co
   ?[["直接排放 · 范围一","#F87171","范围一 16.9 万t",54],["间接排放 · 范围二","#FB923C","范围二 25.4 万t",118],["碳汇 / CCUS 抵消","#4ADE80","碳汇抵消 -2.1 万t",186]]
   :[["电网 / 绿电","#FBBF24","电 7.3 亿kWh",54],["热力源","#F87171","热 28 万GJ",110],["燃气门站","#38BDF8","气 620 万m³",166],["制氢示范站","#2DD4BF","氢 120 t",222]];
  const hubY=118,hubH=70,hy=hubY+hubH/2;
  let bands="",arrows="",boxes="",pills="";
  srcs.forEach((s,i)=>{
   const sy=s[3]+18;
   bands+=`<path class="fband" d="M122 ${sy} C 240 ${sy}, 288 ${hy+(i-(srcs.length-1)/2)*8}, 354 ${hy+(i-(srcs.length-1)/2)*8}" stroke="${s[1]}" stroke-width="${(10-i*1.4).toFixed(1)}"/>`;
   pills+=flowPill(146,sy,s[1],s[2]);});
  comps.forEach((c,i)=>{
   const ey=51+i*46,cy=ey+21,col=co?(i%2?"#FB923C":"#F87171"):["#FBBF24","#F87171","#38BDF8","#2DD4BF","#FBBF24"][i];
   bands+=`<path class="fband" d="M508 ${hy+(i-2)*5} C 600 ${hy+(i-2)*5}, 650 ${ey}, 734 ${ey}" stroke="${col}" stroke-width="${(9-i*1.1).toFixed(1)}"/>`;
   arrows+=`<path d="M734 ${ey-5} L 744 ${ey} L 734 ${ey+5} Z" fill="${col}" opacity=".9"/>`;
   boxes+=`<g class="map-point" onclick="coModal(${c.id})" style="cursor:pointer"><title>${c.name}</title><rect x="${COMX}" y="${ey}" width="${COMW}" height="34" rx="6" class="flow-src"/><text x="${COMX+COMW/2}" y="${cy}" text-anchor="middle" class="flow-lb" style="fill:#DCE8F5;font-size:12px">${c.name}</text></g>`;});
  return `<svg viewBox="0 0 1000 300" style="width:100%">
   ${bands}${arrows}
   ${srcs.map(s=>`<rect x="10" y="${s[3]}" width="112" height="36" rx="6" class="flow-src"/><text x="66" y="${s[3]+22}" text-anchor="middle" class="flow-lb">${s[0]}</text>`).join("")}
   <rect x="${HUBX}" y="${hubY}" width="${HUBW}" height="${hubH}" rx="10" fill="rgba(45,212,191,.16)" stroke="#2DD4BF"/><text x="${HUBX+HUBW/2}" y="${hy-6}" text-anchor="middle" fill="#fff" font-size="14">园区能源枢纽</text><text x="${HUBX+HUBW/2}" y="${hy+14}" text-anchor="middle" class="flow-lb">${co?"范围一/二 归集 · 碳汇抵消":"梯级利用 · 储能调峰"}</text>
   ${boxes}
   ${pills}
   <text x="500" y="290" text-anchor="middle" class="flow-lb">${co?"碳流图：碳排放沿能源路径流向企业，绿线为碳汇抵消路径（点击切换能流图）":"能流图：电 / 热 / 气 / 氢 四类能源路径实时展示，点击企业可下钻画像（点击切换碳流图）"}</text>
  </svg>`;}'''
lines[166:184] = new_flow.split("\n")
txt = "\n".join(lines)

# ---- 2) isoApply 自适应：按舞台宽度计算整体缩放，并暴露 window.isoApply ----
old_apply = '''  const t={a:"rotateX(55deg) rotateZ(-38deg)",b:"rotateX(62deg) rotateZ(15deg)",c:"rotateX(32deg) rotateZ(-8deg)"}[el.dataset.view||"a"];
  el.style.transform=`${t} scale(${(el.dataset.z||100)/100})`;}
 window.isoView=isoView;window.isoZoom=isoZoom;'''
new_apply = '''  const stage=el.parentElement;const fit=stage&&stage.clientWidth?Math.min(1,(stage.clientWidth-16)/900):1;
  const t={a:"rotateX(55deg) rotateZ(-38deg)",b:"rotateX(62deg) rotateZ(15deg)",c:"rotateX(32deg) rotateZ(-8deg)"}[el.dataset.view||"a"];
  el.style.transform=`${t} scale(${(fit*(el.dataset.z||100)/100).toFixed(3)})`;}
 window.isoView=isoView;window.isoZoom=isoZoom;window.isoApply=isoApply;'''
assert old_apply in txt, "isoApply block not found"
txt = txt.replace(old_apply, new_apply)

# ---- 3) iso-stage 自适应高度（固定380px → 宽高比自适应） ----
old_css = ".iso-stage{height:380px;perspective:1000px;"
new_css = ".iso-stage{width:100%;aspect-ratio:860/560;max-height:480px;perspective:1000px;"
assert old_css in txt, "iso-stage css not found"
txt = txt.replace(old_css, new_css)

# ---- 4) coModal 企业能流图：先画带后画企业框 + 胶囊数值标签 + 自适应企业名 ----
old_eflow = '''   <div><div class="sub2">企业能流图（电 / 热 / 气 / 氢）</div>
    <svg viewBox="0 0 480 170" style="width:100%">
     <rect x="10" y="20" width="86" height="30" rx="4" class="node"/><text x="53" y="39" text-anchor="middle" class="node-t">电网接入</text>
     <rect x="10" y="62" width="86" height="30" rx="4" class="node"/><text x="53" y="81" text-anchor="middle" class="node-t">热力管网</text>
     <rect x="10" y="104" width="86" height="30" rx="4" class="node"/><text x="53" y="123" text-anchor="middle" class="node-t">燃气门站</text>
     <rect x="10" y="140" width="86" height="24" rx="4" class="node"/><text x="53" y="156" text-anchor="middle" class="node-t">制氢示范站</text>
     <rect x="200" y="70" width="96" height="42" rx="6" fill="rgba(45,212,191,.15)" stroke="#2DD4BF"/><text x="248" y="88" text-anchor="middle" fill="#fff" font-size="12">${c.name}</text><text x="248" y="103" text-anchor="middle" class="node-t">用能单元</text>
     <path class="fband" d="M96 35 C 150 35, 160 76, 200 82" stroke="#FBBF24" stroke-width="9"/>
     <path class="fband" d="M96 77 C 150 77, 165 87, 200 90" stroke="#F87171" stroke-width="7"/>
     <path class="fband" d="M96 119 C 150 119, 165 98, 200 95" stroke="#38BDF8" stroke-width="7"/>
     <path class="fband" d="M96 152 C 150 152, 165 108, 200 102" stroke="#2DD4BF" stroke-width="4"/>
     <text class="flow-v" x="140" y="30" fill="#FBBF24">电 ${(cur*48/100).toFixed(1)} 万MWh</text>
     <text class="flow-v" x="140" y="72" fill="#F87171">热 ${(cur*18/100).toFixed(1)} 万GJ</text>
     <text class="flow-v" x="140" y="114" fill="#38BDF8">气 ${(cur*22/100).toFixed(1)} 万m³</text>
     <text class="flow-v" x="140" y="148" fill="#2DD4BF">氢 ${Math.round(cur*12)} t</text>
    </svg>'''
new_eflow = '''   <div><div class="sub2">企业能流图（电 / 热 / 气 / 氢）</div>
    <svg viewBox="0 0 480 200" style="width:100%">
     <path class="fband" d="M104 35 C 200 35, 242 88, 292 92" stroke="#FBBF24" stroke-width="9"/>
     <path class="fband" d="M104 77 C 200 77, 246 94, 292 98" stroke="#F87171" stroke-width="7"/>
     <path class="fband" d="M104 119 C 200 119, 246 100, 292 104" stroke="#38BDF8" stroke-width="7"/>
     <path class="fband" d="M104 160 C 200 160, 246 106, 292 110" stroke="#2DD4BF" stroke-width="4"/>
     <path d="M292 87 L 300 92 L 292 97 Z" fill="#FBBF24"/><path d="M292 93 L 300 98 L 292 103 Z" fill="#F87171"/><path d="M292 99 L 300 104 L 292 109 Z" fill="#38BDF8"/><path d="M292 105 L 300 110 L 292 115 Z" fill="#2DD4BF"/>
     <rect x="8" y="20" width="96" height="30" rx="5" class="node"/><text x="56" y="39" text-anchor="middle" class="node-t">电网接入</text>
     <rect x="8" y="62" width="96" height="30" rx="5" class="node"/><text x="56" y="81" text-anchor="middle" class="node-t">热力管网</text>
     <rect x="8" y="104" width="96" height="30" rx="5" class="node"/><text x="56" y="123" text-anchor="middle" class="node-t">燃气门站</text>
     <rect x="8" y="146" width="96" height="28" rx="5" class="node"/><text x="56" y="164" text-anchor="middle" class="node-t">制氢示范站</text>
     <rect x="300" y="72" width="176" height="56" rx="8" fill="rgba(45,212,191,.15)" stroke="#2DD4BF"/><text x="388" y="97" text-anchor="middle" fill="#fff" font-size="${c.name.length>8?10.5:12}">${c.name}</text><text x="388" y="114" text-anchor="middle" class="node-t">用能单元 · 四类能源接入</text>
     ${flowPill(126,35,"#FBBF24",`电 ${(cur*48/100).toFixed(1)} 万MWh`)}
     ${flowPill(126,77,"#F87171",`热 ${(cur*18/100).toFixed(1)} 万GJ`)}
     ${flowPill(126,119,"#38BDF8",`气 ${(cur*22/100).toFixed(1)} 万m³`)}
     ${flowPill(126,160,"#2DD4BF",`氢 ${Math.round(cur*12)} t`)}
    </svg>'''
assert old_eflow in txt, "enterprise flow block not found"
txt = txt.replace(old_eflow, new_eflow)

io.open(SRC, "w", encoding="utf-8").write(txt)
print("c7 patched OK")
