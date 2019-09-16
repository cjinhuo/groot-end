import { Injectable } from '@nestjs/common';

enum dataTypes {
    STRING= 'string',
    NUMBER= 'number',
    BOOLEAN= 'boolean',
    NULL= 'null',
    UNDEFINED= 'undefined',
    ARRAY= 'array',
    DATE= 'date',
    ERROR= 'error',
    FUNCTION= 'function',
    MATH= 'math',
    OBJECT= 'object',
    REGEXP= 'regexp',
    PROMISE= 'promise',
    SYMBOL= 'symbol',
    BUFFER= 'buffer',
  }

@Injectable()
  export class Utils {
    /**
     * 将test-demo => testDemo,test,demo => testDemo
     * @param words 单词
     */
    camelCase(words: string): string {
      return words.replace(/\W(\w)/g, ($0, $1) => {
        return $1.toUpperCase();
      });
    }
    resolveSwaggerUrl(url: string): string {
        url = url.replace(/\/swagger-ui\.html.*$/, '')
          .replace(/\/+$/, '')
          .replace(/\/v2\/api-docs/, '');
        if (!/^https?:\/\//.test(url)) { url = 'http://' + url; }
        return `${url}/v2/api-docs`;
    }
    /**
     * 返回一个请求这个就接口的方法名
     * @param path 接口路径
     * @param method 接口方法
     */
  composeFunctionName(path: string, method: string): string {
    const pathSplit = path.replace(/\/{([^}]+)}/g, '').split('/');
    const collect = [];
    for (let i = 0; i < 2; i++) {
      const element = pathSplit.pop();
      if (element !== '') {
        collect.unshift(Utils.capitalize(element));
      }
    }
    return `${method}${collect.join('')}`;
  }

  /**
   * 将每个单词的首字母变为大写
   * @param word 单词
   * @param force [force=false] 强制除首字母外的字母小写
   */
 static capitalize(word: string, force: boolean = false): string {
    if (force) {
      word = word.toLowerCase();
    }
    return word.replace(/^[a-z]/, function($0) {
      return $0.toUpperCase();
    });
  }
  fiterName(checkName: string): boolean {
    return checkName === 'projectId' || checkName === 'projectName';
  }
}
