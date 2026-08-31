#!/usr/bin/env node
/* pre-compact.js —— PreCompact hook */
const fs = require("fs");
const path = require("path");
let input = "";
process.stdin.on("data", (c) => (input += c));
process.stdin.on("end", () => {
  let cwd = process.cwd();
  try {
    const data = JSON.parse(input || "{}");
    if (data.workspace && fs.existsSync(data.workspace)) cwd = data.workspace;
  } catch (e) {}
  const handoffPath = path.join(cwd, "交接.md");
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);
  if (!fs.existsSync(handoffPath)) {
    try {
      fs.writeFileSync(handoffPath, `# 交接记录\n\n> 本文件由 handoff-agent 自动维护。\n\n## 时间线\n- ${now}：初始化（PreCompact hook 自动创建）\n`, "utf8");
    } catch (e) {}
  } else {
    try {
      const line = `\n- ${now} ｜ 上下文压缩触发前自动兜底：请确认上面「进行中」「已排除的路径」「下一步」是否都已补全。\n`;
      fs.appendFileSync(handoffPath, line, "utf8");
    } catch (e) {}
  }
  process.stdout.write("在压缩前，请把未记录的「进行中任务」「已排除的无效路径」「确切下一步」补写进项目根的 交接.md，以便后续对话无缝衔接。");
});
