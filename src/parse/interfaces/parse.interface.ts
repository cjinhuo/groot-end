import { ItemStructure, ItemChildrenStructure } from '../dto/parse.dto';

export default interface ParseInterface {
  createList: (url: string, prefix: string) => object;
  createTemplateCodes: (template?: string) => string[];
  filterTreeWithIds: (origin: ItemStructure[], ids: string[]) => ItemChildrenStructure[];
  createSingleInstance: (getFormatter: string, postFormatter: string, item: ItemChildrenStructure ) => string[];
  createFunction: (getFormatter: string, postFormatter: string, item: ItemChildrenStructure) => string[];
}
