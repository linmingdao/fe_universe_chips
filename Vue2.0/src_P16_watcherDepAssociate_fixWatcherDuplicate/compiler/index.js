import { parseHTML } from './parse-html.js';
import { generate } from './generate.js';

// 将模板变成render函数（with + Function）
export function compileToFunction(template) {
  const ast = parseHTML(template);
  console.log('parseHTML 解析得到的ast信息:', ast);

  let code = generate(ast);
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
