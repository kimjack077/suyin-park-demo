# -*- coding: utf-8 -*-
"""苏银产业园原型构建脚本：head(去旧VB块/去需求映射文字) + c1b视觉增强 + 主script(c2~c9分块) → 单文件HTML"""
import io, os, sys, re

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # prototype/
SRC = os.path.join(BASE, "src")
OUT = os.path.join(BASE, "苏银产业园AI零碳数智平台-交互原型.html")
PARTS = ["c2-data-charts.js", "c2b-echarts.js", "c2c-sankey.js", "c3-park.js", "c4-park2.js",
         "c5-ent.js", "c6-ai-iot-init.js", "c7-video-boost.js", "c8-three3d.js",
         "c9-polish.js"]
# c10 升级层（演示升级：GIS 一张图 / 多级能流碳流 / 报告 8 章节 / 智能体流式问答等），不参与旧版文字剥离
PARTS_C10 = ["c10a-shell.js", "c10b-cockpit.js", "c10c-onemap.js", "c10d-multi.js", "c10e-report.js", "c10f-ai-iot.js"]

# ---------- 需求映射文字剥离规则（应用于 JS 分块） ----------
JS_STRIPS = [
    # 卡片右上角的需求序号角标：<span class="req-badge">#1</span> / style 变体
    (re.compile(r'<span class="req-badge"[^>]*>[^<]*</span>'), ''),
    # ▲重要参数星标：<span class="tag star">▲ #17</span>（仅当含 # 时移除）
    (re.compile(r'<span class="tag star">[^<]*#[^<]*</span>'), ''),
    # ▲需源代码 角标
    (re.compile(r'<span class="tag lv3">▲需源代码</span>'), ''),
    # 页面底部「需求覆盖说明」卡片：${pageHint("...")}
    (re.compile(r'\$\{pageHint\("[^"]*"\)\}'), ''),
    # 括号内需求引用：（需求 #11 弹窗）/（对应需求 #59–#61）/（▲需求 #143）
    (re.compile(r'（(?:对应需求|▲需求|需求)[^）]*）'), ''),
    # 括号内 ▲# 编号：（▲#26）/（▲#142 智能预测 / ▲#143 节能诊断 / #141 智能问答）
    (re.compile(r'（▲#[^）]*）'), ''),
    # 残留的独立需求编号（如 KPI 差值 "需求 #126"），仅吞数字与分隔符
    (re.compile(r'需求 #[0-9、\s#–\-—]+'), ''),
    # 残留的独立 ▲#编号 标记（▲#105 核算完成 → 核算完成；▲#142 AI智能预测 → AI智能预测）
    (re.compile(r'▲#\d+\s*'), ''),
    # 左侧导航角标 req:"#1–15" → 置空
    (re.compile(r'req:"[^"]*"'), 'req:""'),
    # 页面副标题中含需求映射的 sub（保留纯功能性描述）
    (re.compile(r'sub:"[^"]*(?:需求|▲#|需源代码)[^"]*"'), 'sub:""'),
]

# 演示性字样（视频中可见的“演示/模拟”提示）
JS_STRIPS += [
    (re.compile(r'\\n演示环境建议点击上方「预置问题」体验完整多轮对话链：[^"]*'), ''),
    (re.compile(r'（演示环境请使用上方预置问题体验完整能力）'), ''),
    (re.compile(r'（对应演示[^）]*）'), ''),
    (re.compile(r'（模拟模式）键入语音提问后点发送'), '请讲，正在识别语音…'),
    (re.compile(r'——已切换为模拟模式，点击「模拟说唤醒词」体验流程'), ''),
]

def strip_js(s):
    for pat, rep in JS_STRIPS:
        s = pat.sub(rep, s)
    return s

# 任意括号内的需求编号：纯编号括号整体删除；混排文字仅删编号保留文字
def _paren_strip(m):
    inner = m.group(0)[1:-1]
    inner = re.sub(r'[▲△#]\s*\d+(?:\s*[–\-—~、]\s*[▲△#]?\s*\d+)*', '', inner)
    inner = re.sub(r'[▲△]', '', inner)
    inner = re.sub(r'^[\s、，,·\-–—]+|[\s、，,·\-–—]+$', '', inner)
    inner = re.sub(r'\s{2,}', ' ', inner)
    return '（' + inner + '）' if inner else ''

JS_STRIPS += [
    # 括号内需求编号：（#60）/（#122 #123）/（▲AI 诊断 #143 已识别）/（减排项目台账 #01）
    (re.compile(r'（[^（）]*#\d[^（）]*）'), _paren_strip),
    # 残留的独立需求编号（#122、#141–#143）；守卫：最多 3 位数字且后不接十六进制字符，避免误吞 #152844 等色值
    (re.compile(r'#[0-9]{1,3}(?![0-9A-Fa-f])(?:\s*[–\-—~]\s*#?[0-9]{1,3}(?![0-9A-Fa-f]))*'), ''),
]

# ---------- head 剥离规则 ----------
HEAD_STRIPS = [
    # 平台名下方副标题：需求交互原型 v1.0 / 对应《软件功能技术参数表》144 项
    (re.compile(r'<p>需求交互原型.*?</p>', re.S), ''),
    # 左下角使用说明（▲ 标记 / 需求条款开关说明）
    (re.compile(r'<div class="nav-foot">.*?</div>', re.S), ''),
    # 顶栏「需求映射」开关
    (re.compile(r'<label class="req-toggle">.*?</label>', re.S), ''),
    # 页面标题中的「需求交互原型」字样
    (re.compile(r'\s*—\s*需求交互原型'), ''),
    (re.compile(r'<body class="show-req">'), '<body>'),
]

t = io.open(OUT, encoding="utf-8").read()
# 以当前文件头部为基础，剥离旧 VB 增强块与主脚本
i = t.rindex("<script>\n")
head = t[:i]
# 连外壳一起剥离：<script><!--VB-START--> ... </script><!--VB-END-->（含同行/跨行变体）
head = re.sub(r'<script>\s*<!--VB-START-->[\s\S]*?<!--VB-END-->\s*(?:</script>)?', "", head)
head = re.sub(r'<!--VB-START-->[\s\S]*?<!--VB-END-->', "", head)  # 兜底
# 再清理剥离后可能残留的孤儿 <script> 开标签（无内容、无闭合）
head = re.sub(r'<script>\s*(?=(?:<!--|<style|<div|<p|[\r\n]|$))', "", head)
for pat, rep in HEAD_STRIPS:
    head = pat.sub(rep, head)
boost = io.open(os.path.join(SRC, "c1b-extra.html"), encoding="utf-8").read()
parts = "\n".join(io.open(os.path.join(SRC, f), encoding="utf-8").read() for f in PARTS)
parts = strip_js(parts)
parts += "\n" + "\n".join(io.open(os.path.join(SRC, f), encoding="utf-8").read() for f in PARTS_C10)
out = head + boost + "<script>\n" + parts + "\n</script>\n</body>\n</html>\n"
io.open(OUT, "w", encoding="utf-8").write(out)
# 提取主脚本做语法检查
k = out.rindex("<script>\n"); m = out.rindex("</script>\n</body>")
io.open(os.path.join(SRC, "_check.js"), "w", encoding="utf-8").write(out[k + 9:m])
# 残留检查
left = re.findall(r'.{0,18}(?:req-badge|需求\s*#|对应需求|需求映射|需求交互原型|▲需源代码|（[^（）]*#\d|#[0-9]{1,3}(?![0-9A-Fa-f])).{0,18}', parts)
if left:
    print("WARN 残留映射文字", len(left), "处:")
    for x in left[:10]:
        print("   ", x.replace("\n", " "))
else:
    print("strip clean: 无残留映射文字")
print("built:", len(out), "chars")
