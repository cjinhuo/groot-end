import { ItemStructure, ItemChildrenStructure } from '../dto/parse.dto';

export default interface ParseInterface {
  createList: (url: string, prefix: string) => object;
  createTemplateCodes: (template?: string) => string[];
  filterTreeWithIds: (origin: ItemStructure[], ids: string[]) => ItemChildrenStructure[];
  createSingleInstance: (functionNameFormatter: string, funtionBodyFormater: string, item: ItemChildrenStructure ) => string[];
  createFunctionName: (functionNameFormatter: string, item: ItemChildrenStructure) => string[];
  createFunctionBody: (funtionBodyFormater: string, item: ItemChildrenStructure) => string[];
}
