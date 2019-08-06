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
