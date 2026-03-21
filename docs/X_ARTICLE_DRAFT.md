# X Article Draft — Chain Will (Agent 星光秀 submission)

标题：Chain Will — Agent‑based on‑chain inheritance with relayer marketplace

摘要：
我们提交 Chain Will，一个为 Solana Agent Economy Hackathon 设计的 Agent 化遗嘱服务：用户能设定受益人、触发条件（如长期未活跃）和挑战期，监控 Agent 会在条件满足后把执行任务发布到 relayer 市场，由 relayer 提交链上交易并领取报酬。整个流程实现了 A2A 经济、链上可审计执行和用户可撤销的 challenge window。

Demo：
- Repo: https://github.com/kingskuan/chain-will-agent (WIP)
- Demo（录屏）: (附链接)

为何要做：
数字资产遗失/无人继承是现实问题。Chain Will 提供一个去中心化、可审计且通过市场化 relayer 机制实现的解决方案。

关键技术点：
- Solana program (devnet) — Vault + timelock + finalize logic
- Monitor Agent — 检测 owner 活跃度并发起执行任务
- Relayer — 领取任务并提交链上交易，领取报酬
- Challenge window & guardian（多签）机制

如何运行：见 README.md

(提交流程说明)
1) 发布本文到 X（附 repo 链接与 demo）
2) 在黑客松公告的推文下 Quote RT，标注 @trendsdotfun @solana_devs @BitgetWallet，并加 #AgentTalentShow

