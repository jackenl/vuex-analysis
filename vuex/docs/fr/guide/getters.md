# Accesseurs

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/c2Be7TB" target="_blank" rel="noopener noreferrer">Essayez cette partie sur Scrimba (EN)</a></div>

Parfois nous avons besoin de calculer des valeurs basées sur l'état du store, par exemple pour filtrer une liste d'éléments et les compter :

``` js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

Si plus d'un composant a besoin d'utiliser cela, il nous faut ou bien dupliquer cette fonction, ou bien l'extraire dans une fonction utilitaire séparée et l'importer aux endroits nécessaires. Les deux idées sont loin d'être idéales.

Vuex nous permet de définir des accesseurs (« getters ») dans le store. Voyez-les comme les propriétés calculées des stores. Comme pour les propriétés calculées, le résultat de l'accesseur est mis en cache en se basant sur ses dépendances et il ne sera réévalué que lorsque l'une de ses dépendances aura changée.

Les accesseurs prennent l'état en premier argument :

``` js
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})
```

### Accès par propriété

Les accesseurs seront exposés sur l'objet `store.getters` et vous accèderez aux valeurs comme des propriétés :

``` js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

Les accesseurs recevront également les autres accesseurs en second argument :

``` js
getters: {
  // ...
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length
  }
}
```

``` js
store.getters.doneTodosCount // -> 1
```

Nous pouvons maintenant facilement les utiliser dans n'importe quel composant :

``` js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```

Notez que les accesseurs accédés par propriétés sont mis en cache par le système de réactivité de Vue.

### Accès par méthode

Vous pouvez aussi passer des arguments aux accesseurs en retournant une fonction. Cela est particulièrement utile quand vous souhaitez interroger un tableau dans le store :

```js
getters: {
  // ...
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}
```

``` js
store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```

Notez que les accesseur accédés par méthodes vont être exécuté chaque fois qu'il seront appelés. Le résultat ne sera donc pas mis en cache.

### La fonction utilitaire `mapGetters`

La fonction utilitaire `mapGetters` attache simplement vos accesseurs du store aux propriétés calculées locales :

``` js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // rajouter les accesseurs dans `computed` avec l'opérateur de décomposition
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

Si vous voulez attacher un accesseur avec un nom différent, utilisez un objet :

``` js
...mapGetters({
  // attacher `this.doneCount` à `this.$store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})
```
