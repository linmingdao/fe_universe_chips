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

  function start(tag, attrs) {
    console.log('开始标签', tag, attrs);
  }

  function end(tag) {
    console.log('结束标签', tag);
  }

  function chars(text) {
    console.log('文本内容', text);
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
}

export function compileToFunction(template) {
  const ast = parseHTML(template);
  console.log(ast);
}

// 将template转化成ast语法树 --> 再将抽象语法树转成字符串拼在一起
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring
// http://regexper.com/
// https://template-explorer.vuejs.org/
// html-parser2：https://github.com/fb55/htmlparser2
