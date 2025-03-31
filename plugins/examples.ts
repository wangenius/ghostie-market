// 获取当前日期时间
const getCurrentDateTime = () => {
  const now = new Date();
  return {
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    timestamp: now.getTime(),
    iso: now.toISOString(),
  };
};

// 生成随机数或随机字符串
const generateRandom = ({
  type = "number",
  min = 1,
  max = 100,
  length = 10,
}) => {
  if (type === "number") {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  } else if (type === "string") {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  return null;
};

// 格式化文本
const formatText = ({
  text,
  format = "uppercase",
}: {
  text: string;
  format: string;
}) => {
  if (!text) return "";

  switch (format) {
    case "uppercase":
      return text.toUpperCase();
    case "lowercase":
      return text.toLowerCase();
    case "capitalize":
      return text
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    default:
      return text;
  }
};

// 导出插件函数
export default {
  name: "实用工具",
  description: "提供日期时间、随机数生成和文本格式化等实用功能",
  version: "1.0.0",
  author: "Ghostie",
  tools: {
    getCurrentDateTime: {
      description: "获取当前日期和时间信息",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
      handler: getCurrentDateTime,
    },
    generateRandom: {
      description: "生成随机数或随机字符串",
      parameters: {
        type: "object",
        properties: {
          type: {
            type: "string",
            description: "生成类型：number(数字)或string(字符串)",
          },
          min: {
            type: "number",
            description: "随机数最小值(仅type=number时有效)",
          },
          max: {
            type: "number",
            description: "随机数最大值(仅type=number时有效)",
          },
          length: {
            type: "number",
            description: "随机字符串长度(仅type=string时有效)",
          },
        },
        required: [],
      },
      handler: generateRandom,
    },
    formatText: {
      description: "格式化文本",
      parameters: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "要格式化的文本",
          },
          format: {
            type: "string",
            description:
              "格式化类型：uppercase(大写)、lowercase(小写)或capitalize(首字母大写)",
          },
        },
        required: ["text"],
      },
      handler: formatText,
    },
  },
};
