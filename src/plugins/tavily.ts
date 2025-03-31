import { PluginExport } from "../type";

const search = async ({ query = "", maxResults = 10, timeRange = "day" }) => {
  try {
    const TAVILY_API_KEY = Deno.env.get("TAVILY_API_KEY");
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TAVILY_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        max_results: maxResults,
        search_depth: timeRange,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Tavily API error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("搜索失败:", error);
    throw error;
  }
};

// 导出插件函数
export default {
  name: "Tavily搜索",
  description: "使用Tavily API进行互联网搜索",
  tools: {
    search: {
      description: "执行标准搜索",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "搜索查询内容",
          },
          maxResults: {
            type: "number",
            description: "返回的最大结果数量",
          },
          timeRange: {
            type: "string",
            description: "搜索时间范围 (year, day, week, month)",
          },
        },
        required: ["query"],
      },
      handler: search,
    },
  },
} as PluginExport;
