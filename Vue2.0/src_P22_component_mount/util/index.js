const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destoryed',
];

let strats = {};
LIFECYCLE_HOOKS.forEach((hook) => {
  strats[hook] = mergeHook;
});

function mergeHook(parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal);
    } else {
      return [childVal];
    }
  } else {
    return parentVal;
  }
}

function mergeAssets(parentVal, childVal) {
  const res = Object.create(parentVal); // res.__proto__ = parentVal;
  if (childVal) {
    for (let key in childVal) {
      res[key] = childVal[key];
    }
  }
  return res;
}

strats.components = mergeAssets;

export function mergeOptions(parent, child) {
  const options = {};

  for (let key in parent) {
    mergeField(key);
  }

  for (let key in child) {
    // 如果已经合并过了，就不再合并
    if (!parent.hasOwnProperty(key)) {
      mergeField(key);
    }
  }

  // 默认的合并策略，但是有些属性需要特殊的合并方式，比如data、生命周期的合并
  function mergeField(key) {
    if (strats[key]) {
      return (options[key] = strats[key](parent[key], child[key]));
    }

    if (typeof parent[key] === 'object' && typeof child[key] === 'object') {
      options[key] = {
        ...parent[key],
        ...child[key],
      };
    } else if (!child[key]) {
      options[key] = parent[key];
    } else {
      options[key] = child[key];
    }
  }

  return options;
}

export function isReservedTag(tageName) {
  let str = 'p,div,span,input,button,a';
  let obj = {};
  str.split(',').forEach((tag) => {
    obj[tag] = true;
  });
  return obj[tageName];
}

export function isObject(obj) {
  return typeof obj === 'object' && !!obj && !Array.isArray(obj);
}
