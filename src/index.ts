import express, { Request, Response } from "express";
import cors from "cors";
import * as fs from "fs";
import * as path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

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
  const filePath = path.join(__dirname, "plugins", filename);
  const stats = fs.statSync(filePath);
  const content = fs.readFileSync(filePath, "utf-8");

  let description = "";
  let version = "";
  let author = "";
  let name = path.basename(filename, path.extname(filename));

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
    const pluginsDir = path.join(__dirname, "plugins");
    const files = fs.readdirSync(pluginsDir);

    pluginsIndex = files.map(parsePluginMeta);

    console.log(`已索引 ${pluginsIndex.length} 个插件`);
  } catch (error) {
    console.error("初始化插件索引时出错:", error);
  }
}

// 启用CORS
app.use(cors());

// 中间件用于解析JSON
app.use(express.json());

// 获取所有插件列表
app.get("/plugins/list", (req: Request, res: Response) => {
  res.json({ plugins: pluginsIndex });
});

// 保留原来的GET路由以兼容
app.get("/plugins/:filename", (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "plugins", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "插件文件不存在" });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    res.send(fileContent);
  } catch (error) {
    console.error("读取插件文件时出错:", error);
    res.status(500).json({ error: "读取插件文件时出错" });
  }
});

// 启动服务器
app.listen(PORT, () => {
  // 初始化插件索引
  initPluginsIndex();

  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`插件列表: http://localhost:${PORT}/plugins/list`);
});
