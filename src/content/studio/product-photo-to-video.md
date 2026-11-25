---
title: 生产级商品视频生成 · Product Photo to Video
description: 一张随手拍的商品照片，经过精修、ID 卡、分镜、成片 4 步，变成可以直接上架的营销视频。
publishedAt: 2026-08-19
status: released
category: media
skillhubUrl: https://skillhub.cn/skills/indiv-aven/product-photo-to-video
version: 1.0.0
platform: Agent Skill
stack: [图像生成, 视频生成]
tags: [电商, 商品视频, 营销]
tagline: 手机拍一张，Agent 出一条商品视频
cover:
  src: /images/studio/product-photo-to-video-cover.webp
  small: /images/studio/product-photo-to-video-cover-small.webp
  alt: 商品照片生成营销视频示意图
  width: 1536
  height: 1024
---

电商主图视频、小红书种草、详情页展示，都需要商品视频。可专门拍一条，要灯光、布景、剪辑，小商家和个人卖家往往搞不定。

这个技能把「从照片到视频」拆成一条固定的 4 步流水线，每一步都有可检查的中间产物，出了问题能定位到是哪一步。

## 4 步流水线

| 步骤 | 做什么 | 产出 |
| --- | --- | --- |
| 1. 产品精修 | 去掉杂乱背景、修正光线和角度 | 干净的商品主图 |
| 2. 商品 ID 卡 | 提取品类、材质、颜色、卖点等关键信息 | 商品信息卡，保证后续画面不「走样」 |
| 3. 分镜故事板 | 按投放场景设计镜头顺序和文案 | 分镜脚本与关键帧 |
| 4. 营销视频 | 按分镜生成并拼接成片 | 可直接上传的视频 |

商品 ID 卡是关键一步：后面每一帧画面都以它为准，避免生成过程中把商品颜色、logo 或形状改掉。

## 使用示例

```text
用 product-photo-to-video，把这张保温杯的照片做成一条 15 秒的竖版种草视频，
风格清新，突出「12 小时保温」和「单手开盖」两个卖点。
```

```text
这是我们新款帆布包的实拍图，帮我做一条淘宝主图视频，
1:1 画幅，先展示整体，再特写拉链和内袋。
```

## 适合场景

- 电商主图视频、详情页展示视频
- 社交媒体种草短视频
- 新品上架前快速出几版样片，挑方向再精做

生成效果取决于你所用 Agent 接入的图像和视频模型。

## 安装

把下面这句话发给你的 Agent（Codex、Claude Code 等支持技能的客户端均可）：

```text
请根据 https://skillhub.cn/install/skillhub.md，安装 @indiv-aven/product-photo-to-video。
```

也可以在 [SkillHub 页面](https://skillhub.cn/skills/indiv-aven/product-photo-to-video) 查看版本历史和评测报告。
