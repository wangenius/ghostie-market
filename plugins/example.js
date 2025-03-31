// 示例插件
module.exports = {
  name: "示例插件",
  description: "这是一个示例插件，用于测试",
  version: "1.0.0",
  author: "Ghostie",

  // 插件功能
  execute() {
    return {
      message: "示例插件已执行",
    };
  },
};
