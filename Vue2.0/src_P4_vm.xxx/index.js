// vue入口文件
import initMixin from './init';

// 思考：为何vue不采用es6的类的写法？
// 因为类的推荐写法是所有的拓展都在类的内部进行，不推荐通过 Vue.prototype.a = xx 这样形式可以分文件

function Vue(options) {
  this._init(options);
}

initMixin(Vue);

export default Vue;
