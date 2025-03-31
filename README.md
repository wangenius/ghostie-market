# 插件服务器

这是一个用于提供插件服务的 Express 服务器，可以部署到 Vercel 上。

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 部署到 Vercel

### 方法一：使用 Vercel CLI

1. 安装 Vercel CLI

```bash
npm install -g vercel
```

2. 登录 Vercel

```bash
vercel login
```

3. 部署项目

```bash
vercel
```

### 方法二：使用 Vercel 仪表板

1. 在 GitHub、GitLab 或 Bitbucket 上创建一个仓库并推送代码
2. 在[Vercel 仪表板](https://vercel.com)中导入项目
3. 选择仓库并点击"部署"

## 项目结构

- `src/index.ts` - 主服务器文件
- `plugins/` - 插件目录
- `vercel.json` - Vercel 配置文件

## 如何使用

部署后，可以通过以下端点访问：

- 获取插件列表: `https://your-vercel-domain.vercel.app/plugins/list`
- 获取特定插件: `https://your-vercel-domain.vercel.app/plugins/插件文件名`

## 添加新插件

将 JavaScript 文件添加到`plugins`目录。每个插件文件应该包含以下元数据：

```javascript
module.exports = {
  name: "插件名称",
  description: "插件描述",
  version: "1.0.0",
  author: "作者名称",

  // 插件功能
  execute() {
    // 插件代码
  },
};
```

## 功能

- 在启动时解析并索引所有插件的元数据
- 提供插件列表查询 API
- 提供插件内容获取 API
- 自动监控插件文件变化并更新索引

## 安装

```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建
npm run build

# 生产模式运行
npm run start
```

## API

### 获取所有插件列表

```
GET /plugins/list
```

返回所有已索引插件的元数据列表，包括名称、版本、作者等信息。

### 获取特定插件内容 (POST 方法)

```
POST /plugins/content
```

请求体:

```json
{
  "filename": "example.ts"
}
```

返回指定插件文件的内容和元数据。

### 获取特定插件内容 (GET 方法，兼容模式)

```
GET /plugins/:filename
```

返回指定插件文件的内容和元数据。

## 插件元数据格式

在插件文件中可以通过特定格式的注释添加元数据：

```typescript
// @description: 这是一个示例插件
// @version: 1.0.0
// @author: 开发者名称
```

## 环境变量

- `PORT`: 指定服务器运行的端口（默认：3000）
