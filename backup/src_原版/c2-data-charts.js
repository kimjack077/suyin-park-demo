/* ================= 数据层 ================= */
/* 主题自适应：驾驶舱全屏（body.fs）=深色大屏；系统界面=浅色。lc(深色值,浅色值) 按当前模式取色 */
function uiFS(){return typeof document!=="undefined"&&document.body&&document.body.classList.contains("fs");}
function lc(d,l){return uiFS()?d:(l||d);}
const YEARS=[2021,2022,2023,2024,2025];
const PARK={
 energy:[21.8,21.2,20.4,19.5,18.6], energyInt:[1.42,1.35,1.27,1.19,1.11],
 carbon:[51.2,49.6,47.5,45.1,42.3], carbonInt:[3.34,3.16,2.96,2.75,2.53],
 powerMix:{"传统电力":46,"外购绿电":22,"分布式光伏":18,"集中式新能源":14},
 energyMix:{"电力":48,"燃气":22,"热力":18,"油品":8,"其他":4},
 carbonMix:{"电力":52,"燃气":19,"热力":16,"油品":9,"其他":4},
 monthPower:{"传统电力":[3.1,2.8,3.0,3.2,3.3,3.5,3.6,3.4,3.1,3.0,2.9,3.1],"外购绿电":[1.2,1.3,1.5,1.6,1.8,2.0,2.1,2.0,1.7,1.5,1.3,1.4],"分布式光伏":[0.9,1.0,1.2,1.4,1.6,1.8,1.9,1.7,1.4,1.1,0.9,0.9],"集中式新能源":[0.6,0.7,0.8,0.9,1.0,1.1,1.2,1.1,0.9,0.8,0.7,0.7]},
};
const COMPANIES=[
 {id:1,name:"银北新材料",ind:"新材料",x:250,y:170,grade:"A",eg:"A",en:3.2,co:7.4,red:31,asset:1240,meas:"余热回收改造（10℃低温余热浓缩技术，年减排 0.42 万t）｜ 屋顶光伏 6.8MW + 钙钛矿高效组件试点 ｜ 空压站 AI 智控改造（行业标杆节能率 30%+）"},
 {id:2,name:"电通物联科技",ind:"电子信息",x:430,y:120,grade:"A",eg:"B",en:1.1,co:2.3,red:28,asset:560,meas:"智慧空调群控 + 磁悬浮冷机复合供能 ｜ 绿电聚合交易采购占比 35% ｜ 楼宇光储直柔示范试点"},
 {id:3,name:"贺兰装备制造",ind:"装备制造",x:600,y:210,grade:"B",eg:"B",en:2.6,co:6.1,red:19,asset:890,meas:"电炉感应加热改造 + 氢电耦合示范（谷电制氢供叉车物流）｜ 蒸汽管网熔盐储热移峰填谷 ｜ 待绿证核销"},
 {id:4,name:"塞上食品加工",ind:"食品加工",x:330,y:330,grade:"B",eg:"C",en:1.8,co:4.0,red:15,asset:420,meas:"锅炉低氮改造 ｜ 冷库变频 + 水蓄冷蓄热调峰 ｜ 拟建分布式光伏 + 接入园区共享储能"},
 {id:5,name:"云谷数据服务",ind:"数据服务",x:520,y:360,grade:"A",eg:"A",en:2.9,co:5.2,red:36,asset:1500,meas:"数据中心液冷改造（PUE 1.31→目标 1.05）｜ 100% 绿电交易 ｜ 余热供生活区 + 制冷机房碳信用开发（65 元/t 挂牌参考）"},
 {id:6,name:"黄河生物医药",ind:"生物医药",x:700,y:300,grade:"C",eg:"C",en:1.4,co:3.5,red:10,asset:380,meas:"冷凝水回收 ｜ 发酵工艺 AI 参数寻优（进行中）｜ 制冷机房 AI 全局能效优化（对标行业能效比 6.22）"},
 {id:7,name:"绿洲光伏电力",ind:"新能源",x:800,y:150,grade:"A",eg:"A",en:0.4,co:0.8,red:42,asset:2100,meas:"集中式光伏 120MW ｜ 全钒液流长时储能 60MWh（4h 级）｜ 绿电直供 + 虚拟电厂聚合参与省际调峰"},
 {id:8,name:"兴庆精细化工",ind:"精细化工",x:200,y:420,grade:"C",eg:"B",en:2.2,co:5.8,red:12,asset:760,meas:"精馏塔热集成 ｜ 燃机低浓度烟气碳捕集（CCUS）小试论证 ｜ 防爆区计量补装 4 套 · 碳交易 2 笔"},
];
COMPANIES.forEach(c=>{c.en5=[c.en*1.22,c.en*1.18,c.en*1.10,c.en*1.05,c.en];c.co5=[c.co*1.25,c.co*1.19,c.co*1.11,c.co*1.06,c.co];});
const ALARMS=[
 {t:"2025-11-10 09:42",co:"兴庆精细化工",type:"单位能耗碳排放",lv:3,msg:"单位能耗碳排放 2.64 tCO₂/tce，超行业基准 18%",st:"待处理"},
 {t:"2025-11-10 08:15",co:"黄河生物医药",type:"能耗",lv:2,msg:"蒸汽管线夜间流量异常升高 23%，疑似泄漏",st:"处理中"},
 {t:"2025-11-09 22:03",co:"塞上食品加工",type:"碳排",lv:2,msg:"月度碳排超预算进度 6.2%",st:"处理中"},
 {t:"2025-11-09 16:40",co:"贺兰装备制造",type:"能耗",lv:1,msg:"空压站比功率劣化 4%，建议巡检",st:"已闭环"},
 {t:"2025-11-09 10:12",co:"银北新材料",type:"单位能耗碳排放",lv:1,msg:"月度单位能耗碳排放环比上升 2.1%",st:"已闭环"},
 {t:"2025-11-08 18:30",co:"黄河生物医药",type:"碳排",lv:3,msg:"碳配额盈余预估转负，触发超排放预警",st:"待处理"},
 {t:"2025-11-08 14:55",co:"电通物联科技",type:"能耗",lv:1,msg:"UPS 输入谐波偏高提示",st:"已闭环"},
];
const ASSESS=[
 {ind:"零碳园区指标体系（试行）",name:"单位能耗碳排放",unit:"tCO₂/tce",target:2.40,actual:2.53,trend:[2.98,2.83,2.71,2.60,2.53],ok:false},
 {ind:"零碳园区指标体系（试行）",name:"清洁能源消费占比",unit:"%",target:30,actual:28.4,trend:[21.2,23.0,24.8,26.5,28.4],ok:false},
 {ind:"零碳园区指标体系（试行）",name:"绿电消纳率",unit:"%",target:95,actual:96.1,trend:[88,90.2,92.5,94.3,96.1],ok:true},
 {ind:"碳达峰碳中和综合评价考核体系",name:"单位GDP碳排放下降率",unit:"%",target:8,actual:8.9,trend:[5.1,6.0,6.8,7.9,8.9],ok:true},
 {ind:"碳达峰碳中和综合评价考核体系",name:"工业固废综合利用率",unit:"%",target:92,actual:93.5,trend:[86,88.4,90.2,92.1,93.5],ok:true},
 {ind:"碳达峰碳中和综合评价考核体系",name:"工业用水重复利用率",unit:"%",target:90,actual:91.8,trend:[84,86.5,88.9,90.4,91.8],ok:true},
];
const PATHS={years:["2025","2026","2027","2028","2029","2030","2031","2032","2033","2034","2035"],
 base:[42.3,43.6,44.8,45.7,46.3,46.5,46.2,45.6,44.8,43.9,43.0],
 low:[42.3,42.0,41.2,40.0,38.6,37.0,35.2,33.3,31.4,29.6,27.9],
 zero:[42.3,41.3,39.4,36.6,33.2,29.4,25.4,21.3,17.2,13.1,9.0]};
const REPORTS={
 y:{core:[42.3,2.53,1.11,28.4,96.1,8,100],labels:["2021","2022","2023","2024","2025"],carbon:PARK.carbon},
 q:{core:[10.9,2.48,1.08,29.1,96.4,8,100],labels:["Q1","Q2","Q3","Q4"],carbon:[9.8,10.4,11.2,10.9]},
 m:{core:[3.56,2.44,1.06,29.8,96.7,8,100],labels:["6月","7月","8月","9月","10月"],carbon:[3.94,4.07,3.92,3.73,3.56]},
};
/* 预置多轮问答树：root=新话题入口，next=回答后可追问的下一跳（id 引用），ch=回答附带的图表索引 */
const AI_QA=[
 {id:"a1",root:1,ch:0,q:"2025年园区碳排放多少？同比变化多少？",a:"▶ 能碳问数\n2025 年园区碳排放总量 42.3 万 tCO₂，同比下降 6.2%（2024 年 45.1 万 tCO₂）。\n· 范围一直接排放 16.9 万 tCO₂（40%）\n· 范围二间接排放 25.4 万 tCO₂（60%）\n· 主要下降原因：绿电消费占比提升至 22%，3 家企业完成节能改造\n（追问可继续：为什么下降 → 范围二怎么压减 → 纳入零碳推演）",next:["f1"]},
 {id:"f1",q:"追问：为什么同比下降 6.2%？",a:"▶ 多轮追问 · 归因分析\n降幅 2.8 万 tCO₂，来源拆解如下：\n1. 绿电消费占比由 18.5% 提升至 22%，替代火电减排 1.68 万 tCO₂（贡献 60%）\n2. 兴庆精细化工等 3 家企业完成节能改造，节能 1.9 万 tce（贡献 25%）\n3. 锅炉低氮改造与工艺优化压减范围一 0.44 万 tCO₂（贡献 15%）\n数据可逐级下钻至企业级计量明细（区块链存证）",next:["f2","f4"]},
 {id:"f2",q:"追问：范围二排放占 60%，怎么压减？",a:"▶ 多轮追问 · 范围二治理\n范围二 25.4 万 tCO₂ 全部来自外购电力（因子 0.5306 tCO₂/MWh），压减路径：\n1. 绿电直供扩容：绿洲光伏 120MW → 180MW，年替代减排 4.2 万 tCO₂\n2. 储能晚峰放电：覆盖 18:00–21:00 光伏退出时段，年减排 0.8 万 tCO₂\n3. 绿证抵消：剩余缺口按年度核销\n三项合计约 5 万 tCO₂/年，建议纳入 2026 年度目标值管理",next:["f3"]},
 {id:"f3",q:"追问：把这些措施纳入零碳路径推演，效果如何？",a:"▶ 多轮追问 · 零碳路径推演\n将绿电扩容 + 储能晚峰叠加至三情景模型：\n1. 碳达峰：基准情景 2030 年（46.5 万t）→ 低碳情景提前至 2027 年\n2. 2030 年措施组合年减排 7.1 万 tCO₂，年净收益约 2,340 万元\n3. 零碳路径关键节点：2028 年绿电消纳率 ≥95%、2029 年单位能耗碳排放进入全国园区前 10%\n可在「零碳路径推演」页查看三情景对比曲线与年度措施清单",next:["f4"]},
 {id:"f4",q:"追问：预测 2026 年碳排放趋势",a:"▶ 多轮追问 · AI智能预测\n融合 5 年历史数据 + 实时采集数据，2026 年预测：\n· 碳排放总量 39.8 万 tCO₂，同比再降 5.9%，延续下降通道\n· 若上述措施全部落地可达 37.3 万 tCO₂（额外 -6.3%）\n· 月度曲线与光伏出力强相关：5–9 月绿电高峰即排放低谷\n· 预测区间 ±2.1 万 tCO₂（置信度 90%），每季度用实测值回溯校正",next:["c1"]},
 {id:"c1",root:1,ch:2,q:"哪些企业节能潜力最大？",a:"▶ AI节能诊断\n对 8 家重点企业实时扫描，节能潜力 TOP3：\n1. 兴庆精细化工：精馏环节能耗异常，年节能潜力 310 tce（预期收益 92 万元）\n2. 贺兰装备制造：电炉待改造，年节能潜力 280 tce（预期收益 86 万元）\n3. 塞上食品加工：冷库与锅炉效率偏低，年节能潜力 190 tce（预期收益 55 万元）\n以上建议已同步推送至对应企业端「用能策略推荐」模块",next:["c2"]},
 {id:"c2",q:"追问：针对兴庆精细化工给出整改方案与收益测算",a:"▶ 多轮追问 · 节能诊断整改方案\n兴庆精细化工精馏环节整改方案：\n1. 更换高效再沸器 + 热集成改造：节能 210 tce/年\n2. AI 精馏塔温度寻优控制（需源代码交付项）：节能 100 tce/年\n3. 合计 310 tce/年，按 0.297 万元/tce 综合价测算年收益约 92 万元，投资回收期 1.8 年\n方案已推送至企业端「用能策略推荐」，可一键生成整改工单并跟踪闭环",next:[]},
 {id:"b1",root:1,q:"给出园区零碳规划的路径建议",a:"▶ 零碳规划\n基于基准/低碳/零碳三情景推演：\n1. 碳达峰：基准情景 2030 年达峰（46.5 万t）；低碳情景可提前至 2027 年\n2. 优先措施：绿电直供扩容（年减排 4.2 万t）、数据中心余热利用（1.1 万t）、装备企业电炉改造（1.8 万t）\n3. 年净收益：低碳情景 2030 年措施组合约 2,340 万元\n4. 建议将绿电消纳率、单位能耗碳排放列入年度目标值管理\n（追问可继续：纳入推演后的达峰时间 → 2026 碳排预测）",next:["f3","f4"]},
 {id:"d1",root:1,ch:3,q:"预测明年园区用电负荷",a:"▶ AI智能预测\n融合 5 年历史数据 + 实时采集数据，预测窗口 2026 年：\n· 总用电量预测 13.2 亿 kWh，同比增长 3.1%\n· 夏季峰值负荷 186 MW（7 月下旬）\n· 分布式光伏出力预计增长 18%，可抵消负荷增长的 58%\n· 新能源出力与负荷错配时段集中在 18:00–21:00，建议储能放电覆盖晚峰\n（追问可继续：负荷预测对应的 2026 年碳排趋势）",next:["f4"]},
];
/* ================= 图表工具 ================= */
const PALETTE=["#2E8BC0","#2DD4BF","#FBBF24","#A78BFA","#F87171","#38BDF8","#4ADE80","#3E5C82"];
function svgOpen(h,w){return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet">`;}
function svgDonut(data,size=150,thick=22){
 const total=data.reduce((s,d)=>s+d.v,0);let a0=-90,segs="";
 const r=(size-thick)/2,cx=size/2,cy=size/2;
 data.forEach((d,i)=>{const frac=d.v/total,a1=a0+frac*360,large=frac>0.5?1:0;
  const x0=cx+r*Math.cos(a0*Math.PI/180),y0=cy+r*Math.sin(a0*Math.PI/180);
  const x1=cx+r*Math.cos(a1*Math.PI/180),y1=cy+r*Math.sin(a1*Math.PI/180);
  segs+=`<path d="M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}" fill="none" stroke="${PALETTE[i%8]}" stroke-width="${thick}"><title>${d.k}：${d.v}${d.u||""}（${(frac*100).toFixed(1)}%）</title></path>`;a0=a1;});
 const legend=data.map((d,i)=>`<span><i style="background:${PALETTE[i%8]}"></i>${d.k} ${d.v}${d.u||""} · ${(d.v/total*100).toFixed(1)}%</span>`).join("");
 return svgOpen(size,size)+segs+`<text x="${cx}" y="${cy-4}" text-anchor="middle" fill="${lc("#fff","#1B2B3F")}" font-size="15" font-weight="700">${+total.toFixed(2)}</text><text x="${cx}" y="${cy+14}" text-anchor="middle" fill="${lc("#5D7A9C","#8397AC")}" font-size="10">合计</text></svg><div class="legend">${legend}</div>`;
}
function svgComboBarLine(labels,barName,bar,lineName,line,h=220,w=520,u1="",u2=""){
 const pl=44,pr=44,pb=26,pt=14,cw=w-pl-pr,ch=h-pt-pb,n=labels.length;
 const bMax=Math.max(...bar)*1.15,lMin=Math.min(...line)*0.85,lMax=Math.max(...line)*1.1;
 let bars="",lines="",dots="",grid="",axis="";
 for(let g=0;g<=4;g++){const y=pt+ch*g/4;grid+=`<line x1="${pl}" y1="${y}" x2="${w-pr}" y2="${y}" stroke="${lc("#1E3A5C","#DCE6F1")}" stroke-width=".6"/>`;
  axis+=`<text x="${pl-6}" y="${y+4}" text-anchor="end" fill="${lc("#5D7A9C","#8397AC")}" font-size="10">${(bMax*(1-g/4)).toFixed(bMax<10?1:0)}</text><text x="${w-pr+6}" y="${y+4}" fill="${lc("#5D7A9C","#8397AC")}" font-size="10">${(lMin+(lMax-lMin)*g/4).toFixed(1)}</text>`;}
 bar.forEach((v,i)=>{const bh=v/bMax*ch,x=pl+cw*(i+0.25)/n,y=pt+ch-bh;
  bars+=`<rect x="${x}" y="${y}" width="${cw/n*0.5}" height="${bh}" fill="#2E8BC0" rx="2"><title>${labels[i]}：${v}${u1}</title></rect>`;
  const lv=(line[i]-lMin)/(lMax-lMin)*ch,lx=pl+cw*(i+0.5)/n,ly=pt+ch-lv;
  dots+=`<circle cx="${lx}" cy="${ly}" r="3.5" fill="#FBBF24"><title>${labels[i]} ${lineName}：${line[i]}${u2}</title></circle>`;
  lines+=(i?" L ":"M ")+lx+" "+ly;});
 labels.forEach((lb,i)=>{axis+=`<text x="${pl+cw*(i+0.5)/n}" y="${h-8}" text-anchor="middle" fill="${lc("#8FA8C4","#5A7089")}" font-size="10">${lb}</text>`;});
 return svgOpen(h,w)+grid+bars+`<path d="${lines}" fill="none" stroke="#FBBF24" stroke-width="2"/>`+dots+axis+
  `<text x="${pl}" y="${pt-2}" fill="#2E8BC0" font-size="10">■ ${barName}</text><text x="${pl+95}" y="${pt-2}" fill="#FBBF24" font-size="10">— ${lineName}</text></svg>`;
}
function svgLineChart(labels,series,h=230,w=540){
 const pl=46,pr=16,pb=24,pt=14,all=series.flatMap(s=>s.data);
 const mn=Math.min(...all)*0.92,mx=Math.max(...all)*1.06,cw=w-pl-pr,ch=h-pt-pb,n=labels.length;
 let grid="",axis="",paths="",dots="";
 for(let g=0;g<=4;g++){const y=pt+ch*g/4;grid+=`<line x1="${pl}" y1="${y}" x2="${w-pr}" y2="${y}" stroke="${lc("#1E3A5C","#DCE6F1")}" stroke-width=".6"/>`;
  axis+=`<text x="${pl-6}" y="${y+4}" text-anchor="end" fill="${lc("#5D7A9C","#8397AC")}" font-size="10">${(mx-(mx-mn)*g/4).toFixed(1)}</text>`;}
 series.forEach(s=>{let p="";
  s.data.forEach((v,i)=>{const x=pl+cw*i/(n-1),y=pt+ch-(v-mn)/(mx-mn)*ch;
   p+=(i?" L ":"M ")+x+" "+y;
   dots+=`<circle cx="${x}" cy="${y}" r="3" fill="${s.color}"><title>${labels[i]} ${s.name}：${v}</title></circle>`;});
  paths+=`<path d="${p}" fill="none" stroke="${s.color}" stroke-width="2"/>`;});
 labels.forEach((lb,i)=>{axis+=`<text x="${pl+cw*i/(n-1)}" y="${h-6}" text-anchor="middle" fill="${lc("#8FA8C4","#5A7089")}" font-size="10">${lb}</text>`;});
 const legend=series.map(s=>`<span><i style="background:${s.color}"></i>${s.name}</span>`).join("");
 return svgOpen(h,w)+grid+paths+dots+axis+`</svg><div class="legend">${legend}</div>`;
}
function svgStackedBar(labels,series,h=230,w=540){
 const pl=46,pr=16,pb=24,pt=12,totals=labels.map((_,i)=>series.reduce((s,d)=>s+d.data[i],0));
 const mx=Math.max(...totals)*1.12,cw=w-pl-pr,ch=h-pt-pb,n=labels.length,bw=cw/n*0.55;
 let grid="",axis="",rects="";
 for(let g=0;g<=4;g++){const y=pt+ch*g/4;grid+=`<line x1="${pl}" y1="${y}" x2="${w-pr}" y2="${y}" stroke="${lc("#1E3A5C","#DCE6F1")}" stroke-width=".6"/>`;
  axis+=`<text x="${pl-6}" y="${y+4}" text-anchor="end" fill="${lc("#5D7A9C","#8397AC")}" font-size="10">${(mx*(1-g/4)).toFixed(1)}</text>`;}
 labels.forEach((lb,i)=>{let acc=0;
  series.forEach(s=>{const bh=s.data[i]/mx*ch,y=pt+ch-acc-bh,x=pl+cw*(i+0.225)/n;
   rects+=`<rect x="${x}" y="${y}" width="${bw}" height="${Math.max(bh,0.5)}" fill="${s.color}"><title>${lb} ${s.name}：${s.data[i]}</title></rect>`;acc+=bh;});
  axis+=`<text x="${pl+cw*(i+0.5)/n}" y="${h-6}" text-anchor="middle" fill="${lc("#8FA8C4","#5A7089")}" font-size="10">${lb}</text>`;});
 const legend=series.map(s=>`<span><i style="background:${s.color}"></i>${s.name}</span>`).join("");
 return svgOpen(h,w)+grid+rects+axis+`</svg><div class="legend">${legend}</div>`;
}
function svgHBar(items,h=220,w=520,unit="",colorFn=null){
 const rowH=Math.min(30,h/Math.max(items.length,1)),pl=Math.max(96,Math.max(...items.map(i=>i.k.length))*11+26),pr=62,barMax=w-pl-pr;
 const mx=Math.max(...items.map(i=>Math.abs(i.v)));let s="";
 items.forEach((it,i)=>{const y=i*rowH+rowH*0.2,bw=Math.abs(it.v)/mx*barMax,col=colorFn?colorFn(it,i):(it.c||"#2E8BC0");
  s+=`<text x="${pl-8}" y="${y+rowH*0.42}" text-anchor="end" fill="${lc("#8FA8C4","#5A7089")}" font-size="11">${it.k}</text>`;
  s+=`<rect x="${pl}" y="${y}" width="${bw}" height="${rowH*0.6}" fill="${col}" rx="2"><title>${it.k}：${it.v}${unit}</title></rect>`;
  s+=`<text x="${pl+bw+6}" y="${y+rowH*0.42}" fill="${lc("#DCE8F5","#33475E")}" font-size="11">${it.v}${unit}</text>`;});
 return svgOpen(items.length*rowH+10,w)+s+"</svg>";
}
/* ================= 通用组件 ================= */
function kpi(l,v,u,d,cls){return `<div class="kpi"><div class="l">${l}</div><div class="v">${v}<small> ${u||""}</small></div><div class="d ${cls||""}">${d||""}</div></div>`;}
function row(k,v,d){return `<tr><td>${k}</td><td style="color:${lc("#fff","#0B4E8F")};font-family:Consolas">${v}</td><td style="color:${lc("#8FA8C4","#5A7089")}">${d||""}</td></tr>`;}
function pageHint(t){return `<div class="card"><h3>需求覆盖说明</h3><div class="hint" style="font-size:12px">${t}</div></div>`;}
function showModal(title,html){const m=document.getElementById("modalBox");m.innerHTML=`<h3>${title}<span class="x" onclick="hideModal()">×</span></h3>${html}`;document.getElementById("modalMask").classList.add("show");}
function hideModal(){document.getElementById("modalMask").classList.remove("show");}
document.getElementById("modalMask").addEventListener("click",e=>{if(e.target.id==="modalMask")hideModal();});
function bindTabs(){
 document.querySelectorAll(".tabs").forEach(tabs=>{
  tabs.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{
   tabs.querySelectorAll(".tab").forEach(x=>x.classList.remove("on"));t.classList.add("on");
   const pane=tabs.parentElement;
   pane.querySelectorAll(".tabpane").forEach(p=>p.classList.remove("on"));
   const target=pane.querySelector("#tp-"+t.dataset.t);
   if(target){target.classList.add("on");}
   else{const body=pane.querySelector("#tabBody");if(body&&RENDERERS[t.dataset.t])body.innerHTML=RENDERERS[t.dataset.t]();}
  });});
}
