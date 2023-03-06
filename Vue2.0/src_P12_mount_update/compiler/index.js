const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 用来描述标签的
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配双花括号中间的内容

function parseHTML(html) {
  // 每次根据传入的长度截取html
  function advance(n) {
    html = html.substring(n);
  }

  let root;
  let stack = [];

  function createASTElement(tag, attrs) {
    return {
      tag,
      attrs,
      children: [],
      parent: null,
      type: 1,
    };
  }

  function start(tag, attrs) {
    let element = createASTElement(tag, attrs);
    if (!root) root = element;

    let parent = stack[stack.length - 1];
    if (parent) {
      element.parent = parent;
      parent.children.push(element);
    }
    stack.push(element);
  }

  function end(tagName) {
    stack.pop();
  }

  function chars(text) {
    if (text.replace(/\s/g, '')) {
      let parent = stack[stack.length - 1];
      parent.children.push({
        type: 3,
        text,
      });
    }
  }

  while (html) {
    let textEnd = html.indexOf('<');

    // 解析开始标签，并返回：{tag: 'div', attrs: [{name: 'id', value: 'app'}]}
    if (textEnd === 0) {
      const startTagMatch = parseStartTag();
      if (startTagMatch) {
        start(startTagMatch.tageName, startTagMatch.attrs);
        continue;
      }

      let matches;
      if ((matches = html.match(endTag))) {
        end(matches[1]);
        advance(matches[0].length);
        continue;
      }
    }

    // 解析文本
    let text;
    if (textEnd >= 0) {
      text = html.substring(0, textEnd);
    }
    if (text) {
      advance(text.length);
      chars(text);
    }
  }

  function parseStartTag() {
    const matches = html.match(startTagOpen);
    if (matches) {
      const match = {
        tageName: matches[1],
        attrs: [],
      };
      advance(matches[0].length);

      // 继续解析开始标签的属性
      html.match();
      let end, attr;
      // 只要没有匹配到结束标签就一直匹配
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5] || true,
        });
        // 解析一个属性，就删除一个
        advance(attr[0].length);
      }

      if (end) {
        advance(end[0].length);
      }

      return match;
    }
  }

  return root;
}

function genProps(attrs) {
  let str = '';
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];

    // style="color: red; background: blue" 转成：
    // style="{color: red, background: blue}"
    if (attr.name === 'style') {
      let obj = {};
      attr.value.split(';').reduce((memo, current) => {
        let [key, value] = current.split(':');
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
    return genCode(node);
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

function genCode(ast) {
  // 类似于react的JSX通过createElement生成虚拟dom
  // React.createElement('div', { className: "xxx"}, createTextNode("hello world"))
  // _c('div', { className: "xxx"}, _v("hello world"))
  let code = `_c("${ast.tag}",${
    ast.attrs.length ? genProps(ast.attrs) : 'undefined'
  }${ast.children ? ',' + genChildren(ast) : ''})`;

  return code;
}

// 将模板变成render函数（with + Function）
export function compileToFunction(template) {
  const ast = parseHTML(template);
  console.log('parseHTML 解析得到的ast信息:', ast);

  let code = genCode(ast);
  console.log('由 ast 生成的代码信息:', code);

  const render = new Function(`with(this){return ${code}}`);
  console.log('template 转成 render 函数:\r\n', render.toString());

  return render;
}

// 将template转化成ast语法树 --> 再将抽象语法树转成字符串拼在一起
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring
// http://regexper.com/
// https://template-explorer.vuejs.org/
// html-parser2：https://github.com/fb55/htmlparser2
