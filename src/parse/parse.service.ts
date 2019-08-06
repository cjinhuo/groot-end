import { Injectable } from '@nestjs/common';
import ParseInterface from './interfaces/parse.interface';
import { GetSwaggerService } from '../getSwagger/getSwagger.service';

@Injectable()
export class ParseService implements ParseInterface {
  constructor(private readonly getSwaggerService: GetSwaggerService) {}
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
  createCodes(): string {
    return '';
  }
  createInstance(): string {
    return '';
  }
}
