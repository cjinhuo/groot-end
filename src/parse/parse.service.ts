import { Injectable } from '@nestjs/common';
import ParseInterface from './interfaces/parse.interface';
import { ItemStructure, ItemChildrenStructure } from './dto/parse.dto';
import { Utils } from 'src/Common/utils';
import { GetSwaggerService } from 'src/getSwagger/getSwagger.service';
import { BackFormatter } from 'src/Common/BackFormatter';
import { BackFormatterDto } from 'src/Common/common.dto';

@Injectable()
export class ParseService implements ParseInterface {
  constructor(private readonly getSwaggerService: GetSwaggerService,
              private readonly utils: Utils,
              private readonly backFormatter: BackFormatter) {}
  /**
   * 返回一个tree结构，用来展示swagger的每个接口层级
   * @param url 请求swagger的地址
   */
  async createList(url: string): Promise<BackFormatterDto> {
    const root = {
      id: 'root',
      label: '全选',
      children: [],
    };
    const res = await this.getSwaggerService.getSwaggerWithUrl(url);
    if (res.success) {
      const data = res.data;
      const tags = {};
      if (data.tags) {
        // 添加第一层children，以tag来遍历
        data.tags.forEach(tag => {
          root.children.push(
            (tags[tag.name] = {
              id: `tag ${tag.name}`,
              label: tag.name,
              description: tag.description,
              children: [],
            }),
          );
        });
        // paths的结构
        // const paths = [
        //   {
        //     '/ops/alert/add': {
        //       'post': {
        //         consumes: ['application/json'],
        //         operationId: 'addAlertUsingPOST',
        //         parameters: [],
        //         produces: ['*/*'],
        //         responses: {200: {description: 'OK'}},
        //         summary: '新增告警',
        //         tags: ['告警'],
        //       },
        //     },
        //   },
        // ];
        for (const path in data.paths) {
          if (!data.paths.hasOwnProperty(path)) {
            continue;
          }
          for (const method in data.paths[path]) {
            // 判断是否有path
            if (!data.paths[path].hasOwnProperty(method)) {
              continue;
            }

            const def = data.paths[path][method];
            const node = {
              id: `${method} ${path}`,
              label: path,
              method,
              path,
              description: def.summary,
              responses: def.responses,
              operationId: def.operationId,
              // consumes: ["application/json"]
              consumes: def.consumes,
              // 对象会放在definitions
              parameters: def.parameters,
            };

            if (def.tags && def.tags.length) {
              const tagName = def.tags[0];
              // 上面有定义一个tags对象存入root，这里用tags[tagName].children的引用
              // 直接拿引用来push，因为这时候的tags[tagName].children的引用和root里面的children是同一个引用
              // 所以不需要进root[index].children.push()
              if (tags[tagName]) {
                tags[tagName].children.push(node);
              } else {
                root.children.push(node);
              }
              // else if (tagName) {
              //   // 这段代码没有意思，没有插入到root里面
              //   (tags[tagName] = {
              //     id: tagName,
              //     name: tagName,
              //     children: [],
              //   }).children.push(node);
              // }
            } else {
              root.children.push(node);
            }
          }
        }
      }
      return this.backFormatter.getResult(true, '成功返回list', [root]);
    } else {
      return res;
    }

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
      codes.push(` * 由于您没有传入默认template，以下是默认自动生成！`);
      codes.push(` */`);
      codes.push(``);

      // 模块导入
      codes.push(`import request from '@/utils/request'`);
      codes.push(``);
      codes.push(`// isApi的值可以为mock、api的便于整个文件的修改`);
      codes.push(`const isApi = 'api'`);
      codes.push(``);
    }
    return codes;
  }
  /**
   * 生层单个函数的代码
   * @param formatter 用户传过来的formatter函数
   * @param item 单个item的所有信息
   */
  createSingleInstance(getFormatter: string, postFormatter: string, item: ItemChildrenStructure): string[] {
    // console.log(formatter, item);
    let codes = [];
    // 开始注释块
    codes.push(`/**`);
    // 接口描述
    codes.push(` * ${item.description}`);
    // 结束注释块
    codes.push(` */`);

    // 函数
    codes = codes.concat(this.createFunction(getFormatter, postFormatter, item));
    // 完成
    return codes;
  }
  /**
   * 过滤出用户所选的数据出来
   * @param url swagger地址：通过地址获取数据
   * @param ids 用户勾选的数据keys
   */
  filterTreeWithIds(origin: ItemStructure[], ids: string[]): ItemChildrenStructure[] {
    const idsMap = new Set(ids);
    const result = [];
    origin.forEach(tagItems => {
      tagItems.children.forEach(item => {
        // 利用Set，复杂度肯定小于O(n)
        if (idsMap.has(item.id)) {
          result.push(item);
          idsMap.delete(item.id);
          if (idsMap.size === 0) {
            return result;
          }
        }
      });
    });
    return result;
  }
  createFunction(getFormatter: string, postFormatter: string, item: ItemChildrenStructure): string[] {
    const reg = /{[\w.!=?:(),'"+ ]+}/g;
    const codes = [];
    const functionName = this.utils.composeFunctionName(item.path, item.method);
    const method = item.method.toUpperCase();
    const path = item.path.replace(/({[^}]+})/g, '$$$1');
    // 预定于给用户用
    const lB = '{';
    const rB = '}';
    const pathParams = []; // path路径参数
    const queryParams = []; // query请求参数
    const headerParams = []; // header请求参数
    const bodyParams = []; // body请求参数
    console.log(item);
    if (item.parameters) {
    item.parameters.forEach(parameter => {
      switch (parameter.in) {
        case 'query':
          if (!this.utils.fiterName(parameter.name)) {
            queryParams.push(parameter.name);
          }
          break;
        case 'path':
          if (!this.utils.fiterName(parameter.name)) {
            pathParams.push(parameter.name);
          }
          break;
        case 'header':
          if (!this.utils.fiterName(parameter.name)) {
            headerParams.push(parameter.name);
          }
          break;
        case 'body':
          if (!this.utils.fiterName(parameter.name)) {
            bodyParams.push(parameter.name);
          }
          break;
        default:
          break;
      }
    });
  }
    let formatter = '';
    if (method === 'GET') {
      formatter = getFormatter;
    } else {
      formatter = postFormatter;
    }
    const result = formatter.replace(reg, (target) => {
      const evalStr = target.replace(/[{}]/g, '');
      // tslint:disable-next-line: no-eval
      return eval(evalStr);
    });
    const final = result.replace('@', '').split('\n').filter(v => {
      return v.replace(/\s*/g, '') !== '';
    });
    return final;
  }
}
