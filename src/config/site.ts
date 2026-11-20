export const site = {
  name: '个人数字工作室',
  englishName: 'Independent Digital Studio',
  author: 'YOUR_NAME',
  positioning: '关注企业 AI 落地的产品研究者与创造者',
  heroLabel: 'Product Researcher & Builder',
  heroTitle: ['研究复杂问题，', '创造真正可用的', 'AI 产品。'] as const,
  heroDescription: '关注企业 AI Agent、产品系统设计与真实业务落地。这里记录我主导的产品实践、持续研究，以及正在创造的工具。',
  focus: ['Enterprise AI', 'Product Systems', 'Making Things'],
  about: '我关注企业 AI 如何进入真实的工作流程。我的产品实践涉及 Agent 平台、复杂 B2B 系统、业务权限与评测。我习惯先弄清一项工作由谁完成、需要哪些信息、出了问题由谁处理，再判断 AI 可以承担哪一环。做方案时，我会把关键取舍写明，并用实际任务检验交付是否解决了问题。',
  now: '如何验证一个数智员工可以上岗，以及如何根据风险逐步开放它的权限。',
  workDescription: '记录企业 AI 与复杂 B2B 产品从问题定义、方案取舍到交付验证的过程。',
  studioDescription: '我做的工具与实验，关注 Agent 如何协作、留下证据并进入日常工作。',
  writingDescription: '关于企业 AI、制造业与 Agent 产品的研究和写作，记录真实流程里的问题与取舍。',
  contact: { github: 'https://github.com/Kz-Aven' } as Partial<{ email: string; github: string; linkedIn: string; resume: string }>,
  experience: [] as { period: string; organization: string; role: string }[],
};

export const navigation = [
  { label: 'Work', href: '/work/' },
  { label: 'Studio', href: '/studio/' },
  { label: 'Writing', href: '/writing/' },
  { label: 'About', href: '/about/' },
  { label: '搜索', href: '/search/' },
];
