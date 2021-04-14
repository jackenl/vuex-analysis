# Vuex 源码解读

## 前言

### 功能特性

### 目录结构

```sh
src
├── module                    # 模块相关操作
│   ├── module-collection.js  # 模块树构建
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
* plugins/* 提供开发辅助插件，如 state 修改的日志记录功能；
* helpers 提供 action、mutations 以及 getters 的查找API；
* index 是源码入口文件
* mixin 提供 store 装载注入到 Vue 实例的功能；
* store 属于核心文件，提供了 store 对象的构建方法；
* utils 负责提供工具方法，如 bind、forEachValue 等方法；

## 源码分析

## 结语

## 参考文献

