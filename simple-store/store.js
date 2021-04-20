import Module from './module'
import { forEachValue, isPromise, partial } from './utils'

let Vue

export class Store {
  constructor(options) {
    this._mutations = Object.create(null)
    this._actions = Object.create(null)
    this._wrappedGetters = Object.create(null)
    this._root = new Module(options)

    const store = this
    const { commit, dispatch } = this
    this.commit = function boundCommit(type, payload) {
      return commit.call(store, type, payload)
    }
    this.dispatch = function boundDispatch(type, payload) {
      return dispatch.call(store, type, payload)
    }

    const state = this._root.state
    installStore(store)
    resetStoreVM(store, state)
  }

  get state() {
    return this._vm._data.$$state
  }

  set state(v) {
    throw new Error('please use store.replaceState() to replace store state.')
  }

  replaceState(state) {
    this._vm._data.$$state = state
  }

  commit(type, payload) {
    const entry = this._mutations[type]
    if (!entry) {
      return;
    }
    entry.forEach(handler => handler(payload))
  }

  dispatch(type, payload) {
    const entry = this._actions[type]
    if (!entry) {
      return
    }
    const result = entry.length > 1
      ? Promise.all(entry.map(handler => handler(payload)))
      : entry[0](payload)
    
    return new Promise((resolve, reject) => {
      result.then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  }
}

function installStore(store) {
  const root = store._root

  root.forEachMutation((mutation, key) => {
    const entry = store._mutations[key] || (store._mutations[key] = [])
    entry.push(function mutationHandler(payload) {
      mutation.call(store, store.state, payload)
    })
  })
  root.forEachAction((action, key) => {
    const entry = store._actions[key] || (store._actions[key] = [])
    entry.push(function actionHandler(payload) {
      let res = action.call(store, {
        dispatch: store.dispatch,
        commit: store.commit,
        getters: store.getters,
        state: store.state
      }, payload)
      if (!isPromise(res)) {
        res = Promise.resolve(res)
      }
      return res
    })
  })
  root.forEachGetter((getter, key) => {
    if (store._wrappedGetters[key]) {
      return
    }
    store._wrappedGetters[key] = function getterHandler(store) {
      return getter(
        store.state,
        store.getters
      )
    }
  })
}

function resetStoreVM(store, state) {
  const oldVm = store._vm

  store.getters = {}
  const wrappedGetters = store._wrappedGetters
  const computed = {}
  forEachValue(wrappedGetters, (fn, key) => {
    computed[key] = partial(fn, store)
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true
    })
  })

  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })

  if (oldVm) {
    Vue.nextTick(() => oldVm.$destroy())
  }
}

export function install(_Vue) {
  if (Vue && _Vue === Vue) {
    return
  }
  Vue = _Vue
  Vue.mixin({
    beforeCreate: storeInit,
  });
}

function storeInit() {
  const options = this.$options

  if (options.store) {
    this.$store = typeof options.store === 'function' ? options.store() : options.store
  } else if (options.parent && options.parent.$store) {
    this.$store = options.parent.$store
  }
}
