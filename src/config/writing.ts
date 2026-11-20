import { z } from 'astro/zod';
import source from '../data/writing.json';

export const writingTopics = {
  strategy: {
    label: '企业 AI 战略与商业化', short: '企业 AI 战略',
    description: '从企业的业务需求、预算和组织条件出发，讨论 AI 的商业价值和落地路径。这个领域也关注服务商如何找到真实的市场机会。',
  },
  manufacturing: {
    label: '制造业 AI 实践', short: '制造业实践',
    description: '从小工厂的表格、单据和报工流程出发，记录数据治理和 AI 落地的具体取舍。文章关注现场的人怎样继续工作，以及哪些环节值得自动化。',
  },
  governance: {
    label: '企业 Agent 架构与治理', short: 'Agent 治理',
    description: '讨论 Agent 如何获得身份、权限与可追溯的执行记录。评测和可观测性帮助团队用真实结果判断 Agent 能否上岗。',
  },
  knowledge: {
    label: '企业知识与数据资产', short: '知识与数据',
    description: '讨论如何收集、验证和维护企业知识，让 Agent 能用上可靠的资料。文章涉及 RAG 知识库、业务经验的结构化，以及数据与知识的可信度。',
  },
  models: {
    label: 'AI 模型与决策系统', short: '模型与决策',
    description: '比较传统模型、大模型与专用决策模型的能力边界。讨论从业务任务出发，判断哪一部分需要计算、理解或决策。',
  },
  maker: {
    label: 'Agent 工具与个人创造', short: '工具与创造',
    description: '记录个人 Agent 工具、桌面工作台与硬件实验的设计和制作过程。内容从一个具体使用场景出发，也包括可以跟做的教程。',
  },
} as const;

export const writingTypes = {
  industry: '行业观察', research: '技术研究', practice: '实践复盘', method: '方法论',
  tutorial: '实操教程', explainer: '科普解读', project: '项目手记',
} as const;

export const writingSeries = {
  'factory-ai': { label: '工厂 AI 实践', description: '先读「我在工厂做 AI」，看表格、报工和记账如何进入日常流程。接着读「制造工厂实践 AI」，看数据清洗、物料判断和异步入账的设计取舍。' },
  'business-experience': { label: '从业务经验到 Agent 可用的数据资产', description: '先从上篇看怎样提取难以写成文档的业务经验，再读下篇的结构化与使用实践。' },
  'esp32-iphone': { label: 'ESP32 × iPhone Agent 实验', description: '先了解让 Agent 在真实 iPhone 上工作的实验，再读用 ESP32 和数据线搭建的实操教程。' },
  'agent-evidence': { label: 'Agent 执行证据与评测', description: '从为每次 Agent 执行保留证据开始，再看怎样从真实工作中挑选样本并形成评测集。' },
} as const;

export type WritingTopic = keyof typeof writingTopics;
export type WritingType = keyof typeof writingTypes;
export type WritingSeries = keyof typeof writingSeries;

export const topicIds = Object.keys(writingTopics) as WritingTopic[];
export const typeIds = Object.keys(writingTypes) as WritingType[];
export const seriesIds = Object.keys(writingSeries) as WritingSeries[];

const itemSchema = z.object({
  id: z.string().regex(/^[A-Za-z0-9_-]+$/),
  title: z.string().min(1),
  sourceUrl: z.url(),
  canonicalUrl: z.url({ protocol: /^https$/ }).optional(),
  source: z.literal('wechat'),
  topic: z.enum(topicIds),
  type: z.enum(typeIds),
  tags: z.array(z.string()),
  series: z.enum(seriesIds).optional(),
  seriesOrder: z.int().positive().optional(),
  publishedAt: z.iso.date().nullable(),
  dateStatus: z.enum(['verified', 'unknown']),
  editorialOrder: z.int().positive(),
  featured: z.boolean().optional(),
  excerpt: z.string().optional(),
});

export type WritingItem = z.infer<typeof itemSchema>;

const writingSchema = z.array(itemSchema).superRefine((items, context) => {
  const ids = new Set<string>();
  const urls = new Set<string>();
  const positions = new Set<string>();
  items.forEach((item, index) => {
    const report = (key: keyof WritingItem, message: string) => context.addIssue({
      code: 'custom', path: [index, key], message,
    });

    if (ids.has(item.id)) report('id', '文章 ID 重复');
    if (urls.has(item.sourceUrl)) report('sourceUrl', '原文链接重复');
    if (item.sourceUrl !== `https://mp.weixin.qq.com/s/${item.id}`) {
      report('sourceUrl', '原文链接须使用与 ID 对应的微信公众号文章路径');
    }
    ids.add(item.id);
    urls.add(item.sourceUrl);

    if ((item.publishedAt !== null) !== (item.dateStatus === 'verified')) {
      report('publishedAt', '日期和核实状态不一致');
    }
    if (Boolean(item.series) !== (item.seriesOrder !== undefined)) {
      report('seriesOrder', '专题与专题顺序须同时填写');
    } else if (item.series) {
      const position = `${item.series}/${item.seriesOrder}`;
      if (positions.has(position)) report('seriesOrder', '同一专题中的文章顺序不能重复');
      positions.add(position);
    }
  });
});

const entries = writingSchema.parse(source);
const byDate = (a: WritingItem, b: WritingItem) =>
  (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '') || a.editorialOrder - b.editorialOrder;

export const writing = entries.toSorted(byDate);
export const featuredWriting = entries.filter(({ featured }) => featured)
  .sort((a, b) => a.editorialOrder - b.editorialOrder);

export const relatedWritingIds: Record<string, string[]> = {
  'taiqing-master': ['Y6q9L9jSUg8Qu2_ZF9janA', 'iHhBEhaqV9ZWyAm17aBGhQ', 'YwZZgT0EzIxy7B14i_VEDw'],
  tigerose: ['qC-hGxDWm1J5PMBgIXlkVQ', 'OwpiaCLN4V1Ey4OFRHaz_A'],
  'agent-asset-expert': ['JgRRpNRBAUnq-tayHk6igg', 'iHhBEhaqV9ZWyAm17aBGhQ'],
};
