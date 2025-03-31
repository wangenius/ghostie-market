// @description: 这是一个示例插件，展示元数据格式
// @version: 1.0.0
// @author: Ghostie Market Team

export interface ExamplePluginInterface {
  name: string;
  execute: (input: any) => any;
}

/**
 * 这是一个示例插件
 */
const examplePlugin: ExamplePluginInterface = {
  name: "示例插件",

  /**
   * 插件的主要执行函数
   * @param input 输入数据
   * @returns 处理后的数据
   */
  execute: (input: any) => {
    console.log("示例插件正在执行...");

    // 简单地将输入数据转换为大写（如果是字符串）
    if (typeof input === "string") {
      return input.toUpperCase();
    }

    // 如果输入是对象，添加一个时间戳
    if (typeof input === "object" && input !== null) {
      return {
        ...input,
        timestamp: new Date().toISOString(),
        processed: true,
      };
    }

    // 默认情况直接返回输入
    return input;
  },
};

export default examplePlugin;
