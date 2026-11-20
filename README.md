# 个人数字工作室

使用 Astro、TypeScript、Tailwind CSS 和 Markdown 内容集合。站点包括产品实践、个人作品、研究文章、搜索、RSS 和站点地图。

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

`pnpm build` 先生成静态站点，再用 Pagefind 扩展版构建中文搜索索引。用 `pnpm preview` 查看包含搜索和 Feed 的完整构建。

## 添加内容

Work 和 Studio 使用 `src/content/` 下的 Markdown，文件名就是公开路由的 slug。Writing 从 `src/data/writing.json` 读取公众号文章元数据。

| 集合 | 参考内容 | 主要字段 |
| --- | --- | --- |
| `work` | `taiqing-master.md` | `title`、`description`、`category`；可选角色、时期、状态和关键取舍 |
| `studio` | `tigerose.md` | `title`、`description`、`publishedAt`、`status`；状态为 `released`、`prototype` 或 `exploring` |

- 使用二级标题划分 Markdown 正文，目录由它们生成。
- 使用 `draft: true` 隐藏尚未确认公开的内容。草稿和空正文会从路由、列表、站点地图及搜索中排除。私人或内部源文件请留在被 Git 忽略的目录。
- `featured: true` 可将 Work 加入首页精选，并提升 Studio 项目排序。Writing 首页展示标记为精选的公众号文章。
- 配图放在 `public/images/` 下的相应目录。封面填写 `src`、`alt`、宽和高，正文图片使用根相对 URL。截图需有公开许可，示意图请在图注标明。
- 站点定位、作者、联系方式和确认过的经历在 `src/config/site.ts` 配置。

### Writing 数据

- 按 `src/data/writing.json` 添加文章，保留公众号原题和 `https://mp.weixin.qq.com/s/<id>` 原文链接。
- 未核实原文日期时，保留 `publishedAt: null` 和 `dateStatus: "unknown"`。核实后填入 `YYYY-MM-DD`，并改成 `verified`。默认先按已核实日期倒序，再按 `editorialOrder` 展示无日期文章。
- `featured: true` 标记首页精选。指定 `series` 时需同时填写专题内唯一的 `seriesOrder`。分类、专题及 Work/Studio 关联维护在 `src/config/writing.ts`。
- 写作列表和全站搜索使用标题与标签，RSS 链接指向原文。旧站内全文地址由 Cloudflare Pages 的 `public/_redirects` 跳转到原文。

## Cloudflare Pages

生产站点为 [digital-studio-dbr.pages.dev](https://digital-studio-dbr.pages.dev/)。Cloudflare Pages 连接 GitHub 仓库 `Kz-Aven/digital_studio`，生产分支为 `main`。普通分支提交可触发预览构建。

| 设置 | 值 |
| --- | --- |
| 根目录 | 仓库根目录 |
| 构建命令 | `pnpm install --frozen-lockfile && pnpm build` |
| 输出目录 | `dist` |
| `NODE_VERSION` | `24.12.0` |
| `PNPM_VERSION` | `11.9.0` |
| `SITE_URL` | `https://digital-studio-dbr.pages.dev` |

部署后检查首页、案例、Studio、Writing、中文搜索、RSS、站点地图和自定义 404。接入自定义域名时更新 `SITE_URL` 并重新构建。Cloudflare 的配置步骤见 [Astro 部署指南](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)。
