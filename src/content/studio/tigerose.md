---
title: Tigerose
description: 本地优先的 macOS 多 Agent 工作台，在项目群里分工、协作和验收。
publishedAt: 2026-09-24
status: released
tags: [多 Agent 协作, macOS]
stack: [SwiftUI, Python, MCP]
githubUrl: https://github.com/Kz-Aven/Tigerose
featured: true
cover:
  src: /images/studio/tigerose-architecture.webp
  small: /images/studio/tigerose-architecture-small.webp
  alt: Tigerose 的项目群、Agent 协作、执行环境和本地数据架构
  caption: 产品架构图，来自 Tigerose 公开仓库
  width: 1200
  height: 1096
---

## 为什么做

一项研究往往需要搜集资料、比较证据、起草和复核。把这些任务放进同一个对话，会让上下文越来越长，多个角色的产物也难以交接。Tigerose 用项目群组织不同职责的助理，把任务和交付放在同一个工作区。

## 如何分工

用户可以在项目群中通过 @ 指派任务，并为助理分别配置模型、工具和权限。助理也能在预先授权的范围内委派和交接。应用将执行与验收分开，允许人查看任务过程，以及判断哪些交付还需要补做。

## 当前状态

GitHub 上提供源码和面向 Apple Silicon 的安装包。应用默认在本机保存会话和工作状态。是否调用云模型或外部服务由用户配置，相关请求仍会发往所选服务。
