export interface PluginExport {
  name: string;
  description: string;
  version?: string;
  author?: string;
  /**
   * 插件工具
   * 工具名称作为key，工具描述、参数、处理函数作为value
   */
  tools: Record<
    string,
    {
      /**
       * 工具描述
       */
      description: string;
      /**
       * 工具参数
       */
      parameters: {
        /**
         * 参数类型
         */
        type: "object";
        /**
         * 必填参数
         */
        required: string[];
        /**
         * 参数描述
         */
        properties: Record<
          string,
          {
            type: "string" | "number" | "boolean";
            description: string;
          }
        >;
      };
      /**
       * 工具处理函数
       */
      handler: (input: any) => any;
    }
  >;
}
