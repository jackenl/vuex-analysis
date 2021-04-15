# Vuex 源码解读

## 前言

### 功能特性

### 目录结构

```sh
src
├── module                    # 模块相关操作
│   ├── module-collection.js  # 模块对象树构建
│   └── module.js             # 模块对象定义
├── plugins                   # 相关插件
│   ├── devtool.js            # 调试插件
│   └── logger.js             # 日志插件
├── helpers.js                # 相关辅助函数
├── index.cjs.js              # commonjs 入口文件
├── index.js                  # 默认入口文件
├── index.mjs                 # esModule 入口文件
├── mixin.js                  # store 对象注入实现
├── store.js                  # store 对象定义
└── util.js                   # 相关工具函数
```

大体的目录文件功能如下：

* module/* 提供 module 对象和 module 对象树的创建功能；
* plugins/* 提供开发辅助插件，如“时光穿梭”功能、state 修改的日志记录功能；
* helpers 提供 action、mutations 以及 getters 的查找API；
* index 是源码入口文件
* mixin 提供 store 装载注入到 Vue 实例的功能；
* store 属于核心文件，提供了 store 对象的构建方法；
* utils 负责提供工具方法，如 bind、forEachValue 等方法；

## 源码分析

### 应用实例

我们来看一个简单的 Vuex 应用实例：

```js
// store.js
import Vue from 'vue'
import Vuex from 'vuex'

// $store 属性注入
Vue.use(Vuex)

// 创建 store 对象
export default new Vuex.Store({...})
```

store 对象插入

```js
// main.js
import Vue from 'vue'
import App from './App'
improt store from './store'

new Vue({
	el: '#root',
	store, // 通过 options 传参传入 store 对象
	render: h => h(App)
})
```

可以发现，Vuex 的应用主要分为两部，首先通过调用`Vue.use(Vuex)`在 Vue 实例化过程中触发执行 Vuex 对象的`install`函数，用于后续给 Vue  实例注入下一步创建的 store 对象，接下来就是构建 store 对象通过传参的形式插入 Vue 实例。下面将通过源码分析 Vue 是如何实现构建 store 对象并装载到 Vue 实例上的。

### Vuex 的装载与注入

查看`Vue.use(plugin)`方法定义，可以发现其内部会调用 plugin 的`install`方法。

```js
export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
```

查看 Vuex 源码的入口文件 index.js，`install`方法的定义在文件 store.js 中。

```js
// 通过局部变量 Vue，判断是否已装载
let Vue // bind on install
...

export class Store {
  constructor (options = {}) {
    // Auto install if it is not done yet and `window` has `Vue`.
    // To allow users to avoid auto-installation in some cases,
    // this code should be placed here. See #731
    // 如果是浏览器环境上通过 CDN 方式加载 Vue，则自动执行 install 方法
    if (!Vue && typeof window !== 'undefined' && window.Vue) {
      install(window.Vue)
    }
    ...
  }
}

export function install (_Vue) {
  // 防止 Vuex 重复装载
  if (Vue && _Vue === Vue) {
    if (__DEV__) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}
```

查看 applyMixin 方法，如果是 Vue2 以上版本通过 mixin 使用 hook 的方式给所有组件实例注入 store 对象， Vue1 通过重写原型 _init 方法给所有组件实例注入 store 对象，同时保证在任意组件访问 $store 属性都指向同一个 store 对象。

```js
// applyMixin 方法定义
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
```

### store 对象的构造

#### 数据初始化与 module 对象树构建

#### commit 和 dispatch 函数配置

#### module 安装

#### 初始化用于数据响应式的 store._vm

#### plugin 注入

## 结语

## 参考文献

* https://tech.meituan.com/2017/04/27/vuex-code-analysis.html

