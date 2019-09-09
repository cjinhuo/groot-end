import { Injectable } from '@nestjs/common';
import ParseInterface from './interfaces/parse.interface';
import { ItemStructure, ItemChildrenStructure, ParamTypes } from './dto/parse.dto';
import { Utils } from '../Common/utils';
import { GetSwaggerService } from '../getSwagger/getSwagger.service';
import { BackFormatter } from '../Common/BackFormatter';
import { BackFormatterDto } from '../Common/common.dto';
import siwa = require('siwa');
import { commentParam, commentPromise } from '../Common/comment';

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
      const data = siwa.parse(res.data);
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
    let codes = [];
    const paramsType = this.traverseParameters(item);
    // 开始注释块
    codes.push(`/**`);
    // 接口描述
    codes.push(` * ${item.description}`);
    // jsdoc 参数
    codes = codes.concat(this.createComment(paramsType));
    // 结束注释块
    codes.push(` */`);
    // 函数体
    codes = codes.concat(this.createFunction(getFormatter, postFormatter, item, paramsType));
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
  /**
   *
   * @param getFormatter get方法格式
   * @param postFormatter post方法的格式
   * @param item 单个接口的数据
   */
  createFunction(getFormatter: string, postFormatter: string, item: ItemChildrenStructure, paramsType: ParamTypes): string[] {
    const reg = /{[\w.!=?:(),/'$"+\[\] ]+}/g;
    const variableReg = /^\$(\w+)\s*=\s*(\S+)\s*/g;
    // 给用户定义参数的，然后把参数放进对象对面供用户使用
    const $ = {};
    const codes = [];
    // 预定于给用户用
    const functionName = this.utils.composeFunctionName(item.path, item.method);
    const method = item.method.toUpperCase();
    const path = item.path.replace(/({[^}]+})/g, '$$$1');
    const lB = '{';
    const rB = '}';
    const { pathParams, queryParams, headerParams, bodyParams } = paramsType;

    let formatter = '';
    if (method === 'GET') {
      formatter = getFormatter;
    } else {
      formatter = postFormatter;
    }
    const replacedStr =  formatter.replace(variableReg, (target) => {
      const arr = target.replace(/\s*/g, '').replace('$', '').split('=');
      const evalStr = `$['${arr[0]}']=${arr[1]}`;
      eval(evalStr);
      return '';
    });
    const result = replacedStr.replace(reg, (target) => {
      const evalStr = target.replace(/[{}]/g, '');
      // tslint:disable-next-line: no-eval
      return eval(evalStr);
    });
    const final = result.replace('@', '').split('\n').filter(v => {
      return v.replace(/\s*/g, '') !== '';
    });
    return final;
  }
  /**
   *
   * @param item 单个接口的数据
   */
  createComment(paramsType: ParamTypes): string[] {
    const { bodies, queries, headers, paths, responses } = paramsType.commentParams;
    const codes = [];
    if (paths.length) {
      paths.forEach(p => {
        commentParam(p, codes);
      });
    }

    // 消息体参数描述
    if (bodies.length) {
      // 消息体参数只有一个
      const body = bodies[0];
      // 如果与已有参数同名, 则直接使用data
      commentParam(body, codes);
    }
    // 查询参数描述
    if (queries.length) {
      commentParam({
        name: 'params',
        type: 'object',
        required: true,
        children: queries,
        description: '查询参数',
      }, codes);
    }
    // 消息头参数描述
    if (headers.length) {
      commentParam({
        name: 'headers',
        type: 'object',
        required: true,
        children: headers,
        description: '消息头参数',
      }, codes);
    }
    if (responses) {
      Object.keys(responses).forEach((name, index) => {
        // 只返回200的 response
        if (index > 0) { return; }

        const res = Object.assign({
          name,
        }, responses[name]);
        codes.push(commentPromise(res));
      });
    }
    return codes;
  }

  /**
   * 遍历单个接口的数据，返回生成函数体和生成jsdoc所需要的字段
   * @param item 单个接口的数据
   */
  traverseParameters(item: ItemChildrenStructure): ParamTypes {
    const pathParams = []; // path路径参数
    const queryParams = []; // query请求参数
    const headerParams = []; // header请求参数
    const bodyParams = []; // body请求参数
    const bodies = [];  // 消息体参数
    const queries = []; // 查询参数
    const headers = []; // header参数
    const paths = []; // 路径参数
    const responses = item.responses;

    if (item.parameters) {
      item.parameters.forEach(parameter => {
        switch (parameter.in) {
          case 'query':
            if (!this.utils.fiterName(parameter.name)) {
              queryParams.push(parameter.name);
              queries.push(parameter);
            }
            break;
          case 'path':
            pathParams.push(parameter.name);
            paths.push(parameter);
            break;
          case 'header':
            if (!this.utils.fiterName(parameter.name)) {
              headerParams.push(parameter.name);
            }
            headers.push(parameter);
            break;
          case 'body':
            if (!this.utils.fiterName(parameter.name)) {
              bodyParams.push(parameter.name);
              bodies.push(parameter);
            }
            break;
          default:
            break;
        }
      });
    }
    return {
      pathParams,
      queryParams,
      headerParams,
      bodyParams,
      commentParams: {
        bodies,
        queries,
        headers,
        paths,
        responses,
      },
    };
  }
}
