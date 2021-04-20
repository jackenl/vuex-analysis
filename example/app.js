function render(createElement) {
  return createElement('div', {}, [
    createElement('h3', 'countdown for simpleStore'),
    createElement('button', {
      domProps: {
        innerHTML: '-'
      },
      on: {
        click: this.handleDecrement
      }
    }),
    createElement('input', {
      attrs: {
        value: this.count,
      },
      on: {
        input: this.handleUpdate
      },
      style: {
        width: '50px'
      }
    }),
    createElement('button', {
      domProps: {
        innerHTML: '+'
      },
      on: {
        click: this.handleIncrement
      }
    }),
  ])
}

Vue.use(SimpleStore)

const store = new SimpleStore.Store({
  state: {
    count: 0
  },
  getters: {
    doubleCount(state) {
      return state.count * 2
    }
  },
  mutations: {
    updateCount(state, value) {
      state.count = value
    }
  },
  actions: {
    increment({ commit, state }) {
      commit('updateCount', ++state.count)
    },
    decrement({ commit, state }) {
      commit('updateCount', --state.count)
    }
  }
})

new Vue({
  el: '#app',
  store,
  render,
  computed: {
    count() {
      return this.$store.state.count
    },
    doubleCount() {
      return this.$store.getters.doubleCount
    }
  },
  created() {
    console.log(this.$store)
  },
  methods: {
    handleIncrement() {
      this.$store.dispatch('increment')
    },
    handleDecrement() {
      this.$store.dispatch('decrement')
    },
    handleUpdate(e) {
      const value = Number(e.target.value)
      this.$store.commit('updateCount', value)
    }
  }
})