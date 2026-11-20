---
title: Agent Asset Expert
description: 记录本地 Agent 的任务过程、工具活动和结果，为复盘与评测保留证据。
publishedAt: 2026-09-20
status: released
tags: [Agent 评测, 本地工具]
stack: [Python, SQLite, MCP]
githubUrl: https://github.com/Kz-Aven/agent-asset-expert
featured: true
---

## 为什么做

一条「任务已完成」的回复，通常回答不了复盘最关心的问题。原始请求是什么？调用了哪些工具？业务记录真的写对了吗？这些证据散落在会话、运行日志和人工反馈里，单看一处很难还原任务。

## 怎样把任务过程留下来

工具在 macOS 本机整理任务档案，记录输入、输出、执行状态、工具活动、错误和可用的人工反馈。分析时，可以通过只读 MCP 在任务间查询，把失败案例、人工修订或成功基线挑出来，整理成可审阅的评测样本。

## 当前状态

源码已按 MIT 许可证公开。不同宿主能提供的任务过程深度不同，所以评估时需要明确标识哪些证据可用、哪些仍然缺失。项目保留了后续研究空间，包括如何抽样和怎样把修改前后的结果放在同一组任务上比较。
