# -*- coding: utf-8 -*-
"""c10 源码级修订：企业名称统一 / 数据口径一致 / 去除评分与需求映射提示 / 三维面板优化。
可重复执行（幂等）。"""
import io, os, re
SRC = os.path.dirname(os.path.abspath(__file__))
FILES = ["c2-data-charts.js", "c2b-echarts.js", "c2c-sankey.js", "c3-park.js", "c4-park2.js",
         "c5-ent.js", "c6-ai-iot-init.js", "c7-video-boost.js", "c8-three3d.js", "c9-polish.js"]

# 1) 企业名称统一为真实入驻企业（与三维实景一致），产业口径同步
NAMES = [
    ("标杆企业(云谷)", "标杆企业(智慧银川)"), ("贺兰装备、兴庆化工", "宇超电力装备、莱卡纤维新材料"), ("食品/化工余热", "化纤/装备余热"),
    ("银北新材料", "宏基新材料"), ("电通物联科技", "嘉盛德电子材料"), ("贺兰装备制造", "宇超电力装备"),
    ("塞上食品加工", "鲜控冷链设备"), ("云谷数据服务", "智慧银川大数据中心"), ("黄河生物医药", "海归小镇生物医药园"),
    ("绿洲光伏电力", "宝丰储能科技"), ("兴庆精细化工", "莱卡纤维新材料"),
    ("银北/云谷/绿洲", "宏基/智慧银川/宝丰"), ("电通/云谷", "嘉盛德/智慧银川"),
    ("绿洲光伏二期", "宝丰储能二期光伏"), ("绿洲光伏", "宝丰储能"),
    ("化工与食品产业", "化纤与冷链装备产业"), ("食品加工", "冷链装备"), ("精细化工", "化纤新材料"),
]

COMMON = [
    # 评分点 / 需求映射 / 投标提示文字（专家可见处）
    (r'<span class="tag star">演示评分点[①②③④⑤]</span>', ''),
    (r'（演示评分点[①②③④⑤][^）]*）', ''),
    (r'演示评分点[①②③④⑤]', ''),
    (r'（需源代码交付项）', ''),
    (r'\\n（追问可继续：[^）]*）', ''),
    (r'\\n（可继续追问：[^）]*）', ''),
    (r'\\n（对应需求[^）]*）', ''),
    (r'——需(?:提供)?系统截图佐证。', '。'),
    (r'<span class="tag lv3">▲需源代码</span>', ''),
]

DATA = {
    "c2-data-charts.js": [
        # 单位能耗碳排放 = 碳排放总量 / 综合能耗（42.3/18.6=2.27），与顶栏指标口径一致
        ('target:2.40,actual:2.53,trend:[2.98,2.83,2.71,2.60,2.53]', 'target:2.20,actual:2.27,trend:[2.35,2.34,2.33,2.31,2.27]'),
        ('energyMix:{"电力":48,"燃气":22,"热力":18,"油品":8,"其他":4}', 'energyMix:{"电力":47.8,"燃气":22.0,"热力":17.7,"油品":8.1,"煤品":4.4}'),
        ('low:[42.3,42.0,41.2,40.0,38.6,37.0,35.2,33.3,31.4,29.6,27.9]', 'low:[42.3,43.0,43.4,43.1,42.2,40.8,39.0,37.0,34.8,32.5,30.2]'),
        ('carbonMix:{"电力":52,"燃气":19,"热力":16,"油品":9,"其他":4}', 'carbonMix:{"电力":52.0,"燃气":18.9,"热力":16.1,"油品":9.0,"煤品":4.0}'),
    ],
    "c3-park.js": [
        ('${kpi("单位能耗碳排放","2.53","tCO₂/tce","同比下降 8.0%","down ok")}', '${kpi("单位能耗碳排放","2.27","tCO₂/tce","同比下降 1.7%","down ok")}'),
        ('data:[2.98,2.83,2.71,2.60,2.53]', 'data:[2.35,2.34,2.33,2.31,2.27]'),
        ('<td>单位能耗碳排放(tCO₂/tce)</td><td>2.53</td><td>2.65</td><td>2.72</td><td>2.40</td>', '<td>单位能耗碳排放(tCO₂/tce)</td><td>2.27</td><td>2.42</td><td>2.60</td><td>1.95</td>'),
        ('row("单位能耗碳排放",(PARK.carbonInt[idx]||2.53).toFixed(2),"tCO₂/tce")', 'row("单位能耗碳排放",(PARK.carbon[idx]/PARK.energy[idx]).toFixed(2),"tCO₂/tce")'),
    ],
    "c4-park2.js": [
        ('<tr><td>低碳情景</td><td>2027 年</td><td>42.3</td></tr>', '<tr><td>低碳情景</td><td>2027 年</td><td>43.4</td></tr>'),
        ('①单位能耗碳排放 2.53 tCO₂/tce 未达 2.40 目标', '①单位能耗碳排放 2.27 tCO₂/tce 未达 2.20 年度目标'),
    ],
    "c7-video-boost.js": [
        ('${kpi("单位能耗碳排放","2.53","tCO₂/tce","同比下降 8.0%","down ok")}', '${kpi("单位能耗碳排放","2.27","tCO₂/tce","同比下降 1.7%","down ok")}'),
        ('${row("碳排强度","2.53 tCO₂/tce","目标 2.40")}', '${row("单位能耗碳排放","2.27 tCO₂/tce","年度目标 2.20")}'),
        ('①单位能耗碳排放 2.53 tCO₂/tce 未达 2.40 目标', '①单位能耗碳排放 2.27 tCO₂/tce 未达 2.20 年度目标'),
        ('row("单位能耗碳排放 · "+per,(PARK.carbonInt[idx]||2.53).toFixed(2),"tCO₂/tce")', 'row("单位能耗碳排放 · "+per,(PARK.carbon[idx]/PARK.energy[idx]).toFixed(2),"tCO₂/tce")'),
        # 驾驶舱环形图：由百分比改为实物量（中心显示合计与单位）
        ('donut(Object.entries(PARK.energyMix).map(([k,v])=>({k,v,u:"%"})),150,24)',
         'donut([{k:"电力",v:8.9,u:" 万tce"},{k:"燃气",v:4.1,u:" 万tce"},{k:"热力",v:3.3,u:" 万tce"},{k:"油品",v:1.5,u:" 万tce"},{k:"煤品",v:0.8,u:" 万tce"}],150,24)'),
        ('donut(Object.entries(PARK.carbonMix).map(([k,v])=>({k,v,u:"%"})),150,24)',
         'donut([{k:"电力",v:22.0,u:" 万tCO₂"},{k:"燃气",v:8.0,u:" 万tCO₂"},{k:"热力",v:6.8,u:" 万tCO₂"},{k:"油品",v:3.8,u:" 万tCO₂"},{k:"煤品",v:1.7,u:" 万tCO₂"}],150,24)'),
        ('donut(Object.entries(PARK.powerMix).map(([k,v])=>({k,v,u:"%"})),150,24)',
         'donut([{k:"传统电力",v:3.36,u:" 亿kWh"},{k:"外购绿电",v:1.61,u:" 亿kWh"},{k:"分布式光伏",v:1.31,u:" 亿kWh"},{k:"集中式新能源",v:1.02,u:" 亿kWh"}],150,24)'),
        ('<h3>电力结构（年度）</h3>', '<h3>电力结构（上年度 · 用电量）</h3>'),
        ('"碳排强度",PARK.carbonInt,172,300,"万t")', '"碳排强度(t/万元)",PARK.carbonInt,172,300,"万t")'),
        ('"能耗强度",PARK.energyInt,172,300,"万tce")', '"能耗强度(tce/万元)",PARK.energyInt,172,300,"万tce")'),
    ],
    "c8-three3d.js": [
        # 悬浮孪生数据面板：默认隐藏，悬停建筑时显示对应企业面板（避免满屏标签堆叠）；「数据面板」按钮可全部展开
        ('if(sp){sp.position.set(b.x+b.w*0.75,b.h*0.68,b.z);g.add(sp);\n    panels.push({sp,baseY:sp.position.y,ph:Math.random()*6.28});}',
         'if(sp){sp.position.set(b.x+b.w*0.75,b.h*0.68,b.z);sp.visible=false;g.add(sp);\n    panels.push({sp,baseY:sp.position.y,ph:Math.random()*6.28,ref:b.ref});}'),
        ('   hovered=o;\n   if(o){',
         '   hovered=o;\n   panels.forEach(p=>{p.sp.visible=twinOn&&(window.__t3PanelsAll||(!!o&&o.userData.ref===p.ref));});\n   if(o){'),
        ('    panels.forEach(p=>p.sp.visible=twinOn);',
         '    panels.forEach(p=>p.sp.visible=twinOn&&!!window.__t3PanelsAll);'),
        ('   st.theta+=(goal.theta-st.theta)*.07;',
         '   if(window.__t3Cruise&&!drag)goal.theta+=dt*0.16;\n   st.theta+=(goal.theta-st.theta)*.07;'),
        ('   toggleNight(){',
         '   panelsAll(on){window.__t3PanelsAll=on;panels.forEach(p=>p.sp.visible=twinOn&&on);},\n   toggleNight(){'),
    ],
}

def apply(fn, s):
    for a, b in NAMES:
        s = s.replace(a, b)
    for pat, rep in COMMON:
        s = re.sub(pat, rep, s)
    for a, b in DATA.get(fn, []):
        if b in s:
            continue
        if a in s:
            s = s.replace(a, b)
        elif b not in s:
            print("  [WARN] 未命中:", fn, a[:60])
    return s

for fn in FILES:
    p = os.path.join(SRC, fn)
    t = io.open(p, encoding="utf-8").read()
    n = apply(fn, t)
    if n != t:
        io.open(p, "w", encoding="utf-8").write(n)
        print("patched", fn)
print("done")
