import { forEachValue } from "./utils"

export default class Module {
  constructor(options) {
    const { state, getters, mutations, actions } = options
    this.state = typeof state === 'function' ? state() : state
    this.getters = getters
    this.mutations = mutations
    this.actions = actions
  }

  forEachGetter(fn) {
    if (this.getters) {
      forEachValue(this.getters, fn)
    }
  }
  
  forEachMutation(fn) {
    if (this.mutations) {
      forEachValue(this.mutations, fn)
    }
  }

  forEachAction(fn) {
    if (this.actions) {
      forEachValue(this.actions, fn)
    }
  }
}