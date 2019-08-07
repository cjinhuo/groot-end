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
          .replace(/\/+$/, '');
        if (!/^https?:\/\//.test(url)) { url = 'http://' + url; }
        return `${url}/v2/api-docs`;
    }
}
