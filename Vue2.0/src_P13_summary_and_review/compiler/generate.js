const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配双花括号中间的内容

function genProps(attrs) {
  let str = '';
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];

    // style="color: red; background: blue" 转成：style="{color: red, background: blue}"
    if (attr.name === 'style') {
      let obj = {};
      attr.value
        .split(/;\s/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
        .reduce((memo, current) => {
          let [key, value] = current.split(/:\s/);
          memo[key] = value;
          return memo;
        }, obj);
      attr.value = obj;
    }

    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }

  return `{${str.slice(0, -1)}}`;
}

function gen(node) {
  // 元素节点
  if (node.type === 1) {
    return generate(node);
  }
  // 文本节点
  else {
    let text = node.text;
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`; // 不带表达式
    } else {
      let tokens = [];
      let match;
      // exec遇到全局匹配会有lastIndex问题，每次匹配前需要将lastIndex置为0
      let startIndex = (defaultTagRE.lastIndex = 0);
      while ((match = defaultTagRE.exec(text))) {
        // 匹配到的索引
        let endIndex = match.index;
        if (endIndex > startIndex) {
          tokens.push(JSON.stringify(text.slice(startIndex, endIndex)));
        }
        tokens.push(`_s(${match[1].trim()})`);
        startIndex = endIndex + match[0].length;
      }
      if (startIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(startIndex)));
      }

      // 最后将【动态数据】和【静态数据】拼接在一起
      return `_v(${tokens.join('+')})`;
    }
  }
}

function genChildren(ast) {
  let children = ast.children;
  return children.map((child) => gen(child)).join(',');
}

export function generate(ast) {
  // 类似于react的JSX通过createElement生成虚拟dom
  // React.createElement('div', { className: "xxx"}, createTextNode("hello world"))
  // _c('div', { className: "xxx"}, _v("hello world"))
  let code = `_c("${ast.tag}",${
    ast.attrs.length ? genProps(ast.attrs) : 'undefined'
  }${ast.children ? ',' + genChildren(ast) : ''})`;

  return code;
}
