export class GetSwaggerUrlDto {
  readonly url: string;
}

// tslint:disable-next-line: max-classes-per-file
export class BuildCodeDto {
  readonly include: any[];
  readonly formatter: string;
  readonly url: string;
  readonly template: string;
}

// tslint:disable-next-line: max-classes-per-file
export class ItemStructure {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly children: ChildrenStructure[];
}

// tslint:disable-next-line: max-classes-per-file
class ChildrenStructure {
  readonly id: string;
  readonly label: string;
  readonly method: string;
   readonly path: string;
  readonly description: string;
  readonly response: object;
}
