import { VercelRequest, VercelResponse } from "@vercel/node";
import * as fs from "fs";
import * as path from "path";

// 获取插件目录的路径
function getPluginsDir(): string {
  // 检查是否在 Vercel 环境中
  const isVercel = process.env.VERCEL === "1";

  if (isVercel) {
    // 生产环境：使用 Vercel 的输出目录
    return path.join(process.cwd(), ".vercel", "output", "static");
  } else {
    // 开发环境：直接使用项目根目录下的 plugins 文件夹
    return path.join(process.cwd(), "plugins");
  }
}

// 验证文件名是否安全
function isValidFilename(filename: string): boolean {
  // 只允许字母、数字、下划线和连字符
  const safeFilenameRegex = /^[a-zA-Z0-9_-]+\.ts$/;
  return safeFilenameRegex.test(filename);
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

// 解析插件文件并提取元数据
function parsePluginMeta(filename: string): PluginMeta {
  const pluginsDir = getPluginsDir();
  const filePath = path.join(pluginsDir, filename);
  const stats = fs.statSync(filePath);
  const content = fs.readFileSync(filePath, "utf-8");

  let description = "";
  let version = "";
  let author = "";
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("收到请求:", req.url);
  console.log("查询参数:", req.query);

  try {
    const { name } = req.query;

    // 如果没有指定文件名，返回插件列表
    if (!name) {
      const pluginsDir = getPluginsDir();
      console.log(`正在从目录加载插件: ${pluginsDir}`);

      // 检查目录是否存在
      if (!fs.existsSync(pluginsDir)) {
        console.log(`插件目录不存在: ${pluginsDir}`);
        return res.status(404).json({ plugins: [] });
      }

      const files = fs.readdirSync(pluginsDir);
      // 只处理 .ts 文件
      const tsFiles = files.filter((file) => file.endsWith(".ts"));
      console.log(`找到 ${tsFiles.length} 个插件文件`);

      const plugins = tsFiles.map(parsePluginMeta);
      return res.json({ plugins });
    }

    // 处理单个插件文件的请求
    if (typeof name !== "string") {
      console.log("文件名无效:", name);
      return res.status(400).json({ error: "文件名不能为空" });
    }

    // 确保文件名是安全的
    if (!isValidFilename(name)) {
      console.log("文件名不安全:", name);
      return res.status(400).json({ error: "文件名包含非法字符" });
    }

    const pluginsDir = getPluginsDir();
    const filePath = path.join(pluginsDir, name);

    console.log("尝试读取文件:", filePath);
    console.log("当前工作目录:", process.cwd());
    console.log("文件是否存在:", fs.existsSync(filePath));

    if (!fs.existsSync(filePath)) {
      console.error(`插件文件不存在: ${filePath}`);
      return res.status(404).json({ error: "插件文件不存在" });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    res.setHeader("Content-Type", "text/plain");
    res.send(fileContent);
  } catch (error) {
    console.error("处理请求时出错:", error);
    res.status(500).json({ error: "处理请求时出错" });
  }
}
