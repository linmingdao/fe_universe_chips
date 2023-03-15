import { ASSETS_TYPE } from './const';

export default function initAssetRegisters(Vue) {
  ASSETS_TYPE.forEach((type) => {
    Vue[type] = function (id, difinition) {
      if (type === 'component') {
        // 注册全局组件，使用 extend 方法，将对象变成构造函数
        difinition = this.options._base.extend(difinition);
      } else if (type === 'filter') {
        // 注册全局过滤器
      } else if (type === 'directive') {
        // 注册全局指令
      }

      this.options[type + 's'][id] = difinition;
    };
  });
}
