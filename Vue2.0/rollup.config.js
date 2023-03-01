// import babel from 'rollup-plugin-babel';
const babel = require('rollup-plugin-babel');

// 常见的打包规范：
// import export (esModule)
// module.exports require (commonjs)
// AMD
// systemjs模块规范
// umd (统一模块规范，支持amd、cmd)

module.exports = {
  input: './src/index.js', // 打包的入口
  output: {
    file: 'dist/vue.js', // 打包的出口
    format: 'umd', // 打包后的结果是umd规范
    name: 'Vue', // 打包后全局的名称是Vue
    sourcemap: true,
  },
  plugin: [
    // es6 -> es5
    babel({
      exclude: './node_modules/**', // glob写法
    }),
  ],
};
