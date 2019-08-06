import { Injectable } from '@nestjs/common';
import ParseInterface from './interfaces/parse.interface';
import { GetSwaggerService } from '../getSwagger/getSwagger.service';
import { BuildCodeDto } from './dto/parse.dto';

@Injectable()
export class ParseService implements ParseInterface {
  constructor(private readonly getSwaggerService: GetSwaggerService) {}
  /**
   * 返回一个tree结构，用来展示swagger的每个接口层级
   * @param url 请求swagger的地址
   */
  async createList(url: string): Promise<any> {
    const root = {
      id: 'root',
      label: '全选',
      children: [],
    };
    const data = await this.getSwaggerService.getSwaggerWithUrl(url);
    const tags = {};
    if (data.tags) {
      data.tags.forEach(tag => {
        root.children.push(tags[tag.name] = {
          id: `tag ${tag.name}`,
          label: tag.name,
          description: tag.description,
          children: [],
        });
      });
      for (const path in data.paths) {
        if (!data.paths.hasOwnProperty(path)) { continue; }
        for (const method in data.paths[path]) {
          if (!data.paths[path].hasOwnProperty(method)) { continue; }

          const def = data.paths[path][method];
          const node = {
            id: `${method} ${path}`,
            label: path,
            method,
            path,
            description: def.summary,
          };

          if (def.tags && def.tags.length) {
            const tagName = def.tags[0];
            if (tags[tagName]) {
              tags[tagName].children.push(node);
            } else if (tagName) {
              (tags[tagName] = {
                id: tagName,
                name: tagName,
                children: [],
              }).children.push(node);
            } else {
              root.children.push(node);
            }
          } else {
            root.children.push(node);
          }
        }
      }
    }
    return [root];
  }
  /**
   * 生成模板代码
   * @param template 模板，如果用户不填就有默认模板
   */
  createTemplateCodes(template?: string): string[] {
    const codes = [];
    if (template) {
      codes.push(template);
    } else {
      // 注释说明
      codes.push(`/**`);
      codes.push(` * 以下代码属于自动生成，请勿手动修改`);
      codes.push(` */`);
      codes.push(``);

      // 模块导入
      codes.push(`import request from '@/utils/request'`);
      codes.push(``);

      // 指定URL
      codes.push(`// isApi的值可以为mock、api的便于整个文件的修改`);
      codes.push(`const isApi = 'api'`);
      codes.push(``);
    }
    return codes;
  }
  /**
   * 生层单个函数的代码
   * @param option 过滤tree的条件
   */
  createSingleInstance({ formatter, include }: BuildCodeDto): string[] {
    console.log(formatter, include);

    // 方法名 + 地址的后面两个 如果有 {} 去掉
    //
    const codes = [];
    return [''];
  }
}
