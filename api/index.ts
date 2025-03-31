import express, { Request, Response } from "express";
import cors from "cors";
import * as fs from "fs";
import * as path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// 获取插件目录的路径
function getPluginsDir(): string {
  // 在 Vercel 环境中，插件目录应该在项目根目录
  return path.join(process.cwd(), "plugins");
}

// 插件元数据索引
interface PluginMeta {
  name: string;
  filename: string;
  path: string;
  size: number;
  lastModified: Date;
  description?: string;
  version?: string;
  author?: string;
}

let pluginsIndex: PluginMeta[] = [];

// 解析插件文件并提取元数据
function parsePluginMeta(filename: string): PluginMeta {
  const pluginsDir = getPluginsDir();
  const filePath = path.join(pluginsDir, filename);
  const stats = fs.statSync(filePath);
  const content = fs.readFileSync(filePath, "utf-8");

  let description = "";
  let version = "";
  let author = "";
  // 使用 .ts 扩展名作为默认值
  let name = path.basename(filename, ".ts");

  try {
    // 从导出对象中解析元数据
    const nameMatch = content.match(/name:\s*["'](.+?)["']/);
    if (nameMatch) {
      name = nameMatch[1];
    }

    const descriptionMatch = content.match(/description:\s*["'](.+?)["']/);
    if (descriptionMatch) {
      description = descriptionMatch[1];
    }

    const versionMatch = content.match(/version:\s*["'](.+?)["']/);
    if (versionMatch) {
      version = versionMatch[1];
    }

    const authorMatch = content.match(/author:\s*["'](.+?)["']/);
    if (authorMatch) {
      author = authorMatch[1];
    }
  } catch (error) {
    console.error(`解析插件 ${filename} 时出错:`, error);
  }

  return {
    name,
    filename,
    path: `/plugins/${filename}`,
    size: stats.size,
    lastModified: stats.mtime,
    description,
    version,
    author,
  };
}

// 初始化插件索引
function initPluginsIndex() {
  try {
    const pluginsDir = getPluginsDir();
    console.log(`正在从目录加载插件: ${pluginsDir}`);

    // 检查目录是否存在
    if (!fs.existsSync(pluginsDir)) {
      console.log(`插件目录不存在: ${pluginsDir}`);
      return [];
    }

    const files = fs.readdirSync(pluginsDir);
    // 只处理 .ts 文件
    const tsFiles = files.filter((file) => file.endsWith(".ts"));
    console.log(`找到 ${tsFiles.length} 个插件文件`);
    return tsFiles.map(parsePluginMeta);
  } catch (error) {
    console.error("初始化插件索引时出错:", error);
    return [];
  }
}

// 启用CORS
app.use(cors());

// 中间件用于解析JSON
app.use(express.json());

// 获取所有插件列表
app.get("/plugins/list", (req: Request, res: Response) => {
  // 每次请求重新加载插件列表，以确保获取最新数据
  pluginsIndex = initPluginsIndex();
  res.json({ plugins: pluginsIndex });
});

// 保留原来的GET路由以兼容
app.get("/plugins/:filename", (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    // 确保读取的是 .ts 文件
    const tsFilename = filename.replace(/\.js$/, ".ts");
    const pluginsDir = getPluginsDir();
    const filePath = path.join(pluginsDir, tsFilename);

    if (!fs.existsSync(filePath)) {
      console.error(`插件文件不存在: ${filePath}`);
      return res.status(404).json({ error: "插件文件不存在" });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    res.send(fileContent);
  } catch (error) {
    console.error("读取插件文件时出错:", error);
    res.status(500).json({ error: "读取插件文件时出错" });
  }
});

// 开发环境下直接启动服务器
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    // 初始化插件索引
    pluginsIndex = initPluginsIndex();
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`插件列表: http://localhost:${PORT}/plugins/list`);
  });
}

// 为Vercel导出
export default app;
