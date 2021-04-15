export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])

  if (version >= 2) {
    // Vue2 通过 mixin 使用 hook 方式进行 store 对象注入
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    // Vue1 通过重写原型 _init 方法进行 store 对象注入
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    const options = this.$options
    // store injection
    // store 注入
    // 保证在任意组件访问 $store 属性都指向同一个 store 对象
    if (options.store) {
      // 将 store 对象注入到根组件的 $store 属性上
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      // 将子组件的 $store 属性指向父组件的 $store 属性上
      this.$store = options.parent.$store
    }
  }
}
