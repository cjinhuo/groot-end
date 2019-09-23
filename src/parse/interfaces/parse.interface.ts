import { ItemStructure, ItemChildrenStructure, ParamTypes, AndroidObject } from 'src/parse/dto/parse.dto';

export default interface ParseInterface {
  /**
   * 创建前端接口列表
   *
   * @memberof ParseInterface
   */
  createList: (url: string, prefix: string) => object;
  /**
   * 创建模式代码，方法实例的上方
   *
   * @memberof ParseInterface
   */
  createTemplateCodes: (template?: string) => string[];
  /**
   * 过滤用户选择的id
   *
   * @memberof ParseInterface
   */
  filterTreeWithIds: (origin: ItemStructure[], ids: string[]) => ItemChildrenStructure[];
  /**
   * 创建单个方法的实例，包括函数和注释
   *
   * @memberof ParseInterface
   */
  createSingleInstance: (getFormatter: string, postFormatter: string, item: ItemChildrenStructure ) => string[];
  /**
   * 创建单个接口的函数
   *
   * @memberof ParseInterface
   */
  createFunction: (getFormatter: string, postFormatter: string, item: ItemChildrenStructure, paramsType: ParamTypes) => string[];
  /**
   * 创建单个函数的注释
   *
   * @memberof ParseInterface
   */
  createComment: (paramsType: ParamTypes) => string[];
  /**
   * 遍历单个接口的数据，返回生成函数体和生成jsdoc所需要的字段
   *
   * @memberof ParseInterface
   */
  traverseParameters: (item: ItemChildrenStructure) => ParamTypes;
  /**
   * 创建安卓需要的json格式，针对单个接口
   *
   * @memberof ParseInterface
   */
  createSingleAndroidInfo: (item: ItemChildrenStructure) => AndroidObject;
}
