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
  readonly response: any;
  readonly parameters: any[];
}

