export const site = {
  name: 'Aven Huang',
  englishName: 'Aven Huang · Digital Studio',
  author: 'Aven Huang',
  positioning: '关注企业 AI 落地的产品研究者与创造者',
  heroLabel: '产品研究者 / 创造者',
  heroMeta: ['产品研究者 / 创造者', '广州', '2025 — 企业 AI'],
  heroStatement: '关注企业 AI Agent、产品系统设计与真实业务落地。',
  heroDescription: '先弄清一项工作由谁完成、需要哪些信息、出了问题谁兜底，再判断 AI 能承担哪一环。这里有上线的企业 Agent 产品、开源项目，以及来自工厂与企业一线的复盘文章。',
  focus: ['Enterprise AI', 'Product Systems', 'Making Things'],
  about: '我关注企业 AI 如何进入真实的工作流程。我的产品实践涉及 Agent 平台、复杂 B2B 系统、业务权限与评测。我习惯先弄清一项工作由谁完成、需要哪些信息、出了问题由谁处理，再判断 AI 可以承担哪一环。做方案时，我会把关键取舍写明，并用实际任务检验交付是否解决了问题。',
  now: '如何验证一个数智员工可以上岗，以及如何根据风险逐步开放它的权限。',
  nowUpdated: '2026.11',
  footerInvite: '如果你也在把 AI 带进真实的工作流程，我们聊聊。',
  workDescription: '企业 AI 与复杂 B2B 产品从问题定义、方案取舍到交付验证的过程。',
  studioDescription: '我公开的代码与技能，涵盖 Agent 协作、硬件实验、图像处理和制造业追溯。',
  writingDescription: '大多来自工厂和企业一线的复盘：表格怎么理、权限怎么放、Agent 什么时候不该上。',
  teahouse: { size: '24 MB', description: '用高斯泼溅重建的一间茶舍。拖动环顾四周，坐到长凳上就能打开整个工作室的导览。' },
  contact: { github: 'https://github.com/Kz-Aven' } as Partial<{ email: string; github: string; linkedIn: string; resume: string }>,
  experience: [] as { period: string; organization: string; role: string }[],
};

export const navigation = [
  { label: '项目', href: '/work/' },
  { label: '开源', href: '/studio/' },
  { label: '文章', href: '/writing/' },
  { label: '茶舍', href: '/teahouse/', optional: true },
  { label: '关于', href: '/about/', optional: true },
];
