# Handoff Agent · 长对话自动交接

> 在上下文达到阈值时自动把状态写入 `交接.md`，并通过 Reasonix hooks 在宿主层强制触发交接，
> 实现跨对话无缝接力。解决长对话中模型随上下文增长而性能下降的问题。

## 是什么

**Handoff Agent** 是一套"长对话自动交接"方案：对话窗口是易失、有限的（上下文最多约 100 万 token，
且注意力会随长度退化），而文件系统是持久的。本方案把对话状态持续落盘到项目根的 `交接.md`，
并在上下文达到阈值时自动触发交接，让新对话无缝接续前文。

蒸馏自多个高 star 开源项目（MIT）：
- [planning-with-files](https://github.com/OthmanAdi/planning-with-files) (26.4k★)
- [Agent-Skills-for-Context-Engineering](https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering) (17.9k★)
- [Continuous-Claude-v3](https://github.com/parcadei/Continuous-Claude-v3) (3.9k★)
- [repo-context-ledger](https://github.com/gviiisen/repo-context-ledger)
- [baton](https://github.com/blader/baton)

> 由 [女娲 · Skill造人术](https://github.com/alchaincyf/nuwa-skill) 蒸馏生成。

## 核心心智模型

1. **上下文是 RAM，文件系统是磁盘** —— 重要的东西写进 `交接.md`，而不是留在对话里。
2. **交接抓对方无法重建的东西** —— 意图、已排除的死路、确切的下一步。
3. **持续记录，而非等压缩** —— 每完成一个关键节点就追加记录，不等上下文满。
4. **验证后再写** —— 交接状态基于 git/文件核实，不凭记忆。
5. **阈值前主动切换** —— 约 80% 触发，而非等到性能塌方。

## 目录结构

```
handoff-agent/
├── skills/handoff-agent/        # 主 skill（SKILL.md + references/sources.md）
├── hooks/                       # Reasonix host hooks
│   ├── pre-compact.js           # 上下文压缩前：自动兜底写入交接.md + 注入压缩指导
│   ├── session-start.js         # 新会话激活：强制注入"先读交接.md"
│   └── stop.js                  # 每轮结束：占位（为轮次检测扩展保留）
├── example/
│   ├── settings.json            # hooks 注册示例（全局）
│   └── handoff.example.md       # 交接.md 模板
└── README.md
```

## 安装

### 1. 部署 skill

把 `skills/handoff-agent/` 复制到你的 skill 目录（任选）：

```bash
# Reasonix 全局
cp -r skills/handoff-agent "C:/Users/<you>/AppData/Roaming/reasonix/skills/"
# 或项目级
cp -r skills/handoff-agent "<workspace>/.reasonix/skills/"
```

### 2. 注册 hooks

把 hooks 注册到全局 `settings.json`（把 `<REPO>` 换成你的仓库路径）：

```json
{
  "hooks": {
    "PreCompact":   [ { "command": "node \"<REPO>/hooks/pre-compact.js\"" } ],
    "SessionStart": [ { "command": "node \"<REPO>/hooks/session-start.js\"" } ],
    "Stop":         [ { "command": "node \"<REPO>/hooks/stop.js\"" } ]
  }
}
```

> 需重启 Reasonix（或新建会话）让 hooks 生效。

## 使用

新老会话都会自动执行：

1. **会话开始**：SessionStart hook 强制先读项目根 `交接.md`，从「进行中/下一步」继续。
2. **工作中**：完成关键步骤/排除死路/做决策，立即追加到 `交接.md`（边做边记）。
3. **上下文到约 80% 阈值**：PreCompact hook 自动把关键状态写入 `交接.md` 并提醒切换。
4. **切换**：新对话自动读 `交接.md`，无缝接力。

## 诚实边界

- skill 与 hook **无法在宿主 UI 里创建新会话** —— "点新建对话"仍是用户的界面操作。
- 本方案把交接到 80% 阈值时的**触发、记录、提醒、新对话引导**全部自动化，但最终"新建对话"这一物理动作需手动完成。
- 阈值是估算的；宁可早切，不可晚切。

## 许可证

MIT
