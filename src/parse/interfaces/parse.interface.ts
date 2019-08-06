
export default interface ParseInterface {
  createList: (url: string, prefix: string) => object;
  /**
   * 函数名上方的模板
   */
  createTemplateCodes: (template?: string) => string[];
  filterTreeWithIds: (origin: object[], ids: string[]) => object[];
  createSingleInstance: (option: object) => string[];
}
