# Plugins Server

这是一个简单的 Express 服务器，用于提供`plugins`文件夹中的插件内容。

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
