/**
 * 请求/parse/build前端发过来的结构体
 */
export class BuildCodeDto {
  readonly include: string[];
  readonly url: string;
  readonly formatter: string;
  readonly template: string;
  readonly getFormatter: string;
  readonly postFormatter: string;
}

/**
 * 第一层children的结构体
 */
export class ItemStructure {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly children: ItemChildrenStructure[];
}
/**
 * 第二层children的结构体
 */
export class ItemChildrenStructure {
  readonly id: string;
  readonly label: string;
  readonly method: string;
  readonly path: string;
  readonly description: string;
  readonly operationId: string;
  readonly responses: any;
  readonly parameters: any[];
}

export class ParamTypes {
  // 用来生成函数体
  readonly pathParams: any[];
  readonly queryParams: any[];
  readonly headerParams: any[];
  readonly bodyParams: any[];
  // 用来生成函数注释的
  readonly commentParams: {
    bodies: any[];
    queries: any[];
    headers: any[];
    paths: any[];
    responses: any;
  };
}

/**
 * 给安卓生成的json结构体
 */
export class AndroidObject {
   path: string;	// 接口路径
   comment: string; // 接口注释
   method: string;	// 请求方式
   hasHeader: boolean; // 是否含有Header
   hasBody: boolean;	// 是否含有Body
   hasQueryMap: boolean; // 是否含有QueryMap
   hasFormBody: boolean; // 是否为form表单，与hasBody互斥
   isArray: boolean; 	// response是否为array
   fieldBeans: any; // response中第一层的字段
}
