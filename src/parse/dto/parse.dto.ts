/**
 * 请求/parse/build前端发过来的结构体
 */
export class BuildCodeDto {
  readonly include: any[];
  readonly formatter: string;
  readonly url: string;
  readonly template: string;
}

/**
 * 第一层children的结构体
 */
export class ItemStructure {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly children: ChildrenStructure[];
}
/**
 * 第二层children的结构体
 */
export class ChildrenStructure {
  readonly id: string;
  readonly label: string;
  readonly method: string;
  readonly path: string;
  readonly description: string;
  readonly response: object;
  readonly parameters: [];
}
