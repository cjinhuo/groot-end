import { ItemStructure, ChildrenStructure } from '../dto/parse.dto';

export default interface ParseInterface {
  createList: (url: string, prefix: string) => object;
  /**
   * 函数名上方的模板
   */
  createTemplateCodes: (template?: string) => string[];
  filterTreeWithIds: (origin: ItemStructure[], ids: string[]) => ChildrenStructure[];
  createSingleInstance: (option: object) => string[];
}
