#!/usr/bin/env node
/* stop.js —— Stop hook
 * 每轮对话结束后触发（非阻塞）。若项目根 交接.md 存在，检查其更新时间与
 * 当前大小，判断是否建议切换。此处做轻量提示：stdout 会被记录，但 Stop
 * 非阻塞且无特殊作用，因此主要用于给下一轮的 上下文 提供一个轻提示。
 * 更可靠的阈值判断由 PreCompact 兜底。 */
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
  // Stop 事件 stdout 无特殊注入作用，这里不强制输出，避免噪音；
  // 保留钩子占位，未来可扩展为检测轮次后主动写交接。
  process.stdout.write("");
});
