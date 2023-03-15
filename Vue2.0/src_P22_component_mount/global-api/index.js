import initAssetRegisters from './assets';
import initMixin from './mixin';
import { ASSETS_TYPE } from './const';
import initExtend from './extend';

export function initGlobalAPI(Vue) {
  // 整合了所有的全局相关的内容
  Vue.options = {};

  initMixin(Vue);

  // 初始化的全局过滤器、指令、组件都会被放到 Vue.options 上
  // Vue.options.components = {};
  // Vue.options.filters = {};
  // Vue.options.directives = {};
  ASSETS_TYPE.forEach((type) => {
    Vue.options[type + 's'] = {};
  });

  Vue.options._base = Vue; // _base 是 Vue 的构造函数

  // 注册 extend 方法
  initExtend(Vue);
  initAssetRegisters(Vue);
}
