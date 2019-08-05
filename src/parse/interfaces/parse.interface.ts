
export default interface ParseInterface {
  createList: (url: string, prefix: string) => object;
  /**
   * 函数名上方的代码
   */
  createCodes: (url: string, options: string) => string;
  createInstance: () => string;
}
