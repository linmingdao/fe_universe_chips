# VUE 3

## vue 3 对比 vue 2

1. vue 2 的代码拆分（功能拆分）基于原型，即：把所有的生命周期等都绑到 Vue.prototype 上，且是单包架构，所以打包体积会大（因为无法 tree-shaking），而 vue 3 则不是，基于 pnpm monorepo 的形式
2. vue 2 基于 flow 做类型校验（类型提示比较弱），vue 3 基于 ts，有强大的类型提示
3. 设计理念上的区别，vue2 是选项式的 api，vue 3 是组合式的 api（关注点分离）
4. vue 3 允许自定义渲染器，相比于 vue2 的拓展需要改源码
5. 开发环境构建使用 esbuild，生产还是 rollup，vue2 rollup

## pnpm

1. 解决幽灵依赖
   - 默认情况 pnpm 不提升依赖，即：所有的间接依赖都会存在 node_modules 的 .pnpm 文件夹下，直接依赖在 node_modules 下，这样无法 import 幽灵依赖
   - 但是可以通过 .npmrc 配置 shamefully-hoist = true 将所有依赖都提升到 node_modules 下
2. 软、硬链接解决依赖共享，磁盘占用问题

## pnpm 多包架构下 ts 模块解析路径配置
