import { Utils } from './utils';
export function commentParam(param, comments, paths = []) {
  paths = paths.concat(param.name);

  interface ParamsType {
    name: string;
    required: boolean;
    description: string;
    default?: any;
    type?: any;
  }

  const p: ParamsType = {
    name: paths.join('.'),
    required: param.required,
    description: param.description,
  };

  if (param.hasOwnProperty('default')) {
    p.default = param.default;
  }

  switch (param.type) {
    case 'number':
    case 'boolean':
    case 'string':
      p.type = param.type;
      comments.push(createParamComment(p));
      break;
    case 'array':
      const types = [];
      param.children.forEach(item => {
        if (/number|boolean|string/.test(item.type)) {
          types.push(`${item.type}[]`);
        } else if (/array|object/.test(item.type)) {
          types.push(`${ Utils.capitalize(item.type)}[]`);
        }
      });

      p.type = types.length ? types.join('|') : 'Array';
      comments.push(createParamComment(p));

      const path = `${paths.join('.')}[]`;
      param.children
        .forEach(item => {
          if (item.type !== 'object') { return; }
          item.children.forEach(p => {
            commentParam(p, comments, [path]);
          });
        });
      break;
    case 'object':
      p.type = 'Object';
      comments.push(createParamComment(p));

      param.children
        .sort((a, b) => a.required)  // 必填参数放前面, 选填参数放后面
        .forEach(p => {
          commentParam(p, comments, paths);
        });
      break;
    default:
      p.type = '*';
      comments.push(createParamComment(p));
  }
}

export function createParamComment(param) {
  const comment = [
    ` * @param {${param.type}}`,
  ];

  let name = `${param.name}`;

  if (param.hasOwnProperty('default')) {
    name += `=${param.default}`;
  }

  if (param.required !== true) {
    name = `[${name}]`;
  }

  comment.push(name);

  if (param.description) {
    comment.push(`- ${param.description}`);
  }

  return comment.join(` `);
}

export function commentPromise(param) {
  const comment = createPromiseComment(param);
  const comments = [` * @returns {${comment}}`];

  if (param.name) {
    comments.push(param.name);
  }

  if (param.description) {
    if (param.name) {
      comments.push(`-`);
    }

    comments.push(param.description);
  }

  return comments.join(` `);
}

export function createPromiseComment(param, isChild = false) {
  let value = '';
  switch (param.type) {
    case 'number':
    case 'boolean':
    case 'string':
      value = `${param.type}`;
      break;
    case 'array':
      value = 'Array';
      break;
    case 'object':
      const items = param.children
        .map(item => createPromiseComment(item, true)); // 递归获取promise
      value = `{${items.join(',')}}`;
      break;
    default:
      value = `${param.type}`;
  }

  if (isChild) {
    return `${param.name}:${value}`;
  } else {
    return `Promise.<${value}>`;
  }
}
