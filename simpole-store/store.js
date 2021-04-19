import Module from './module'
import { isPromise } from './utils'

let Vue

export class Store {
  constructor(options) {
    this._mutations = Object.create(null)
    this._actions = Object.create(null)
    this._getters = Object.create(null)
    this._root = new Module(options)

    const store = this
    const { commit, dispatch } = this
    this.commit = function boundCommit(type, payload) {
      return commit.call(store, type, payload)
    }
    this.dispatch = function boundDispatch(type, payload) {
      return dispatch.call(store, type, payload)
    }
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
      mutation.call(store, root.state, payload)
    })
  })
  root.forEachAction((action, key) => {
    const entry = store._actions[key] || (store._actions[key] = [])
    entry.push(function actionHandler(payload) {
      const res = action.call(store, {
        dispatch: store.dispatch,
        commit: store.commit,
        getters: root.getters,
        state: root.state
      }, payload)
      if (!isPromise(res)) {
        res = Promise.resolve(res)
      }
      return res
    })
  })
  root.forEachGetter((getter, key) => {
  })
}

function resetStoreVM() {}

export function install(Vue) {
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
