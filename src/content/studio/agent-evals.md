---
title: Agent 能力评估 · Agent Evals
description: 两个配套技能：一个负责记录执行链并循证打分，一个以评估专家身份设计评测、给出产品决策。
publishedAt: 2026-09-03
status: released
category: agent
skillhubUrl: https://skillhub.cn/skills/indiv-aven/agent-evals
version: 1.0.0
platform: Agent Skill
stack: [评测, 执行链]
tags: [Agent 评测, 产品决策, 循证评分]
tagline: 一个 Agent 能不能上岗，用证据说话
cover:
  src: /images/studio/agent-evals-cover.webp
  small: /images/studio/agent-evals-cover-small.webp
  alt: Agent 能力评估技能示意图
  width: 1536
  height: 1024
---

「这个 Agent 好不好用」常常停留在感觉：演示时挺顺，真放到业务里又说不清哪里不行。我想把这件事变成有记录、有证据、能复现的评估，于是做了两个配套的技能。

## 两个技能，分工不同

| | Agent 能力评估 `agent-evals` | Agent 能力评估专家 `agent-eval-evaluator` |
| --- | --- | --- |
| 定位 | 执行与打分的**工具** | 设计与决策的**评估专家** |
| 核心工作 | 记录任务执行链，按执行链循证评分，汇总多轮结果 | 设计可复现的评测方案，授权后执行被测任务，基于证据评分，输出产品决策 |
| 工作模式 | 记录 / 评分 / 串联（先执行记录、再自评） | 从评测设计一路做到结论 |
| 适合 | 已经知道要测什么，需要把过程留痕、打分 | 还没想好怎么测，需要有人把评测体系搭起来 |
| 安装 | [SkillHub](https://skillhub.cn/skills/indiv-aven/agent-evals) | [SkillHub](https://skillhub.cn/skills/indiv-aven/agent-eval-evaluator) |

简单说：**评估专家决定怎么考，agent-evals 负责监考和阅卷。**两个可以单独用，也可以一起用。

## 为什么强调执行链

只看最终答案，很难区分「真做对了」和「碰巧对了」。执行链记录了 Agent 查了什么、调用了什么、在哪一步做了判断，评分时每一分都能指回具体的证据。多跑几轮再汇总，结论才站得住，产品上才敢决定这个 Agent 能放开哪些权限。

## 使用示例

```text
用 agent-evals 记录这次任务的完整执行链：让 Agent 从这三份采购合同里
找出付款条款不一致的地方。执行完后按执行链给它打分。
```

```text
用 agent-eval-evaluator 帮我设计一套评测：我们要判断客服 Agent
能不能独立处理退换货咨询。请给出测试用例、评分标准和通过线，
跑完 3 轮后告诉我能否上线、需要限制哪些场景。
```

## 安装

把下面两句发给你的 Agent，按需安装其中一个或两个：

```text
请根据 https://skillhub.cn/install/skillhub.md，安装 @indiv-aven/agent-evals。
请根据 https://skillhub.cn/install/skillhub.md，安装 @indiv-aven/agent-eval-evaluator。
```
