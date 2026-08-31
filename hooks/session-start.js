#!/usr/bin/env node
/* session-start.js —— SessionStart hook
 * 新会话第一次激活（或 /new 后）触发。stdout 会成为下一轮模型上下文注入，
 * 用于强制新对话先读取项目根的 交接.md，再继续。 */
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
  if (fs.existsSync(handoffPath)) {
    process.stdout.write("【handoff-agent·会话开始】项目根存在 交接.md：请先读取它，从「进行中/下一步」继续，而不是从头询问用户；若用户仅说「继续」，直接按 交接.md 继续。");
  } else {
    process.stdout.write("【handoff-agent·会话开始】项目根 交接.md 不存在：请按 handoff-agent skill 的模板创建 交接.md，并填入本次对话目标。");
  }
});
