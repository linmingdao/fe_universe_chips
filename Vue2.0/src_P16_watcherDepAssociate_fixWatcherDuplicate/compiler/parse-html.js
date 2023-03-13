const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 用来描述标签的
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >

export function parseHTML(html) {
  // 每次根据传入的长度截取html
  function advance(n) {
    html = html.substring(n);
  }

  let root = null; // ast语法树的根
  let stack = [];
  let ELEMENT_TYPE = 1;
  let TEXT_TYPE = 3;

  function createASTElement(tag, attrs) {
    return {
      tag,
      attrs,
      parent: null,
      children: [],
      type: ELEMENT_TYPE,
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

  function end() {
    stack.pop();
  }

  function chars(text) {
    if (text.replace(/\s/g, '')) {
      let parent = stack[stack.length - 1];
      parent.children.push({ type: TEXT_TYPE, text });
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
