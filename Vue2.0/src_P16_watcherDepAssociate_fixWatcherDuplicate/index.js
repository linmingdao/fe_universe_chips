import initMixin from './init';
import { lifeCycleMixin } from './lifecycle';
import { renderMixin } from './render';
import { initGlobalAPI } from './global-api/index';

function Vue(options) {
  this._init(options);
}

initMixin(Vue);
renderMixin(Vue);
lifeCycleMixin(Vue);

initGlobalAPI(Vue);

export default Vue;
