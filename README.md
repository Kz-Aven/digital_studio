# 个人数字工作室

使用 Astro、TypeScript、Tailwind CSS 和 Markdown 内容集合。P0 提供首页、产品实践、Master 案例、关于页和 404。

## 本地开发

使用 `.nvmrc` 中的 Node 版本。开启 Corepack 后安装依赖。

```sh
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm check
pnpm build
pnpm preview
```

## 添加案例

在 `src/content/work/` 新增 Markdown，文件名即项目的 URL slug。以 `taiqing-master.md` 为例，填写 `title`、`description` 和 `category`。可选填角色、时期、状态、封面和关键取舍。

- `draft: true` 将内容排除在列表、首页和生成的项目路由之外。
- `featured: true` 将公开案例加入首页精选。排序优先使用 `order`，其次按发布日期倒序。
- 使用二级标题划分正文，案例目录会按 Markdown 标题生成。
- 选用真实截图或明确标注的示意图，填写替代文本和图片尺寸。用于发布的 Markdown 只保留对外内容。
- 站点定位、作者、联系方式和确认过的经历在 `src/config/site.ts` 配置。

## Cloudflare Pages

在 Cloudflare 控制台连接 GitHub 仓库 `Kz-Aven/digital_studio`，将生产分支设为 `main`，并保存以下设置。

| 设置 | 值 |
| --- | --- |
| 根目录 | 仓库根目录 |
| 构建命令 | `pnpm install --frozen-lockfile && pnpm build` |
| 输出目录 | `dist` |
| `NODE_VERSION` | `24.12.0` |
| `PNPM_VERSION` | `11.9.0` |

生产环境把 `SITE_URL` 设置为公开域名，例如分配给项目的 `pages.dev` 地址。接入自定义域名后更新该变量并重新构建。未设置时，构建读取 Cloudflare 提供的 `CF_PAGES_URL`。两个值均缺失时，本地构建省略绝对 canonical 和 OG 图片 URL。

部署后检查首页、`/work/taiqing-master/`、`/about/` 和一个不存在的路径，并确认该路径返回自定义 404 和 HTTP 404 状态。Cloudflare 的配置步骤见 [Astro 部署指南](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)。
