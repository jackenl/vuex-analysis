# 시작하기

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cMPa2Uk" target="_blank" rel="noopener noreferrer">Scrimba에서이 수업을 해보십시오.</a></div>

모든 Vuex 애플리케이션의 중심에는 **store** 가 있습니다. "저장소"는 기본적으로 애플리케이션 **상태** 를 보유하고있는 컨테이너입니다. Vuex 저장소가 일반 전역 개체와 두 가지 다른 점이 있습니다.

1. Vuex store는 반응형 입니다. Vue 컴포넌트는 상태를 검색할 때 저장소의 상태가 변경되면 효율적으로 대응하고 업데이트합니다.
2. 저장소의 상태를 직접 변경할 수 없습니다. 저장소의 상태를 변경하는 유일한 방법은 명시적인 **커밋을 이용한 변이** 입니다. 이렇게하면 모든 상태에 대한 추적이 가능한 기록이 남을 수 있으며 툴을 사용하여 앱을 더 잘 이해할 수 있습니다.

### 가장 단순한 저장소

:::tip 참고
모든 예제는 ES2015 문법을 사용합니다. 사용하고 있지 않은 경우 [꼭 사용해야 합니다!](https://babeljs.io/docs/learn-es2015/)
:::

Vuex를 [설치](../installation.md)한 후 저장소를 만들어 봅시다. 매우 간단합니다. 초기 상태 객체와 일부 변이를 제공하십시오.

``` js
// 모듈 시스템을 사용하는 경우 Vue.use(Vuex)를 먼저 호출해야합니다.

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
```

이제 state 객체에 `store.state`로 접근하여 `store.commit` 메소드로 상태 변경을 트리거 할 수 있습니다.

``` js
store.commit('increment')

console.log(store.state.count) // -> 1
```

다시 말해, `store.state.count`를 직접 변경하는 대신 변이를 수행하는 이유는 명시적으로 추적을 하기 때문입니다. 이 간단한 규칙에 따라 의도를보다 명확하게 표현할 수 있으므로 코드를 읽을 때 상태 변화를 더 잘 지켜볼 수 있습니다. 또한 모든 변이를 기록하고 상태 스냅샷을 저장하거나 시간 흐름에 따라 디버깅을 할 수 있는 도구를 제공합니다.

컴포넌트 안에서 저장소 상태를 사용하는 것은 단순히 계산된 속성 내에서 상태를 반환하는 것입니다. 변경을 트리거하는 것은 컴포넌트 메소드에서 변경을 커밋하는 것을 의미합니다.

다음은 [가장 기본적인 Vuex 카운터 앱](https://jsfiddle.net/n9jmu5v7/1269/)의 예입니다.

이제, 우리는 각 핵심 개념에 대해 더 자세히 설명 할 것입니다. [State](state.md)부터 시작해 보겠습니다.
