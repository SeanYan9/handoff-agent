# 蒸馏来源记录

> 本 skill 由女娲（nuwa-skill）方法论蒸馏自以下开源项目（均 MIT 协议）。
> 调研时间：2026-08-28。原则：只提取跨项目复现、有生成力、有排他性的心智模型。

## 主项目（按 star 排序）

| 项目 | Star | 提取的核心机制 |
|------|------|---------------|
| [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files) | 26392 | 「上下文是 RAM，文件系统是磁盘」；三文件模式（task_plan/findings/progress）；每轮 hook 重注入；/clear 后 5.0 turns 恢复（vs 裸 agent 13.3） |
| [muratcankoylan/Agent-Skills-for-Context-Engineering](https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering) | 17851 | 注意力随上下文退化（lost-in-the-middle、U 形注意力曲线）；context-compression、filesystem-context、memory-systems 原则 |
| [parcadei/Continuous-Claude-v3](https://github.com/parcadei/Continuous-Claude-v3) | 3931 | 「Compound, don't compact」（持续提取学习而非压缩）；YAML handoffs 交接文档；continuity ledger；pre-compact 自动交接（压缩前触发） |
| [gviiisen/repo-context-ledger](https://github.com/gviiisen/repo-context-ledger) | 105 | 跨 agent 上下文中继；Resume Capsule（恢复胶囊，不重放长聊天）；epoch 防覆盖；证据优先（验证后写） |
| [blader/baton](https://github.com/blader/baton) | 57 | 交接文件抓「对方无法重建的东西」（意图/死路/确切的下一步）；铁律：先验证再写（git status 核对）；已排除的死路价值最高 |

## 提炼映射（三重验证）

| 本 skill 心智模型 | 跨域复现证据 | 生成力 | 排他性 |
|------------------|-------------|--------|--------|
| 上下文=RAM，文件=磁盘 | planning-with-files、Continuous-Claude、repo-context-ledger 均"重要内容落盘" | 可推断"任何关键状态都应先写文件" | 区别于"全塞进上下文"的默认做法 |
| 交接抓不可重建之物 | baton、repo-context-ledger 的 Resume Capsule | 可推断"死路比完成记录更有价值" | 区别于"复制聊天记录"的朴素交接 |
| 持续记录而非压缩 | Continuous-Claude「Compound, don't compact」、planning-with-files 每轮注入 | 可推断"记录应早于阈值完成" | 区别于"等到满才写" |
| 阈值前主动切换 | Continuous-Claude pre-compact、context-engineering 退化研究 | 可推断"80% 触发优于 100% 被动" | 区别于"被压缩时才反应" |
| 先验证再写 | baton 铁律、repo-context-ledger evidence-first | 可推断"交接状态需 git/文件核对" | 区别于"凭记忆写状态" |

## 未采纳的候选

- 数据库/向量记忆（Continuous-Claude 用 PostgreSQL+pgvector）：对单项目交接过重，本 skill 用纯 Markdown 文件，零依赖
- 多级目录结构（repo-context-ledger 的 docs/ai、docs/specs 等）：适用于大型代码库，写论文场景单文件 交接.md 更合适
- 插件/hook 自动注入（planning-with-files 用 Claude Code hooks）：Reasonix 无 hook 机制，改为"全局指令 + skill 纪律"实现
