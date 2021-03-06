# アプリケーションの構造

Vuex は実際のところ、あなたがコードを構造化する方法を制限しません。もっと正確に言うと、それより高いレベルの原理原則を適用させます:

1. アプリケーションレベルの状態はストアに集約されます。

2. 状態を変更する唯一の方法は、同期的に処理を行う**ミューテーション**をコミットすることのみです。

3. 非同期的なロジックはカプセル化されるべきであり、それは**アクション**によって構成されます。

これらのルールに従っている限り、プロジェクトをどのように構造化するかはあなた次第です。もしストアファイルが大きくなり過ぎたら、単純にアクションやミューテーション、ゲッターをそれぞれ別のファイルに切り出すことができます。

それなりに手の込んだアプリケーションであれば、モジュールを活用する必要が出てきそうです。プロジェクトの構造の例は以下のようになります:

``` bash
├── index.html
├── main.js
├── api
│   └── ... # API 呼び出しを抽象化する
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # モジュールを集めてストアをエクスポートする
    ├── actions.js        # アクションのルートファイル
    ├── mutations.js      # ミューテーションのルートファイル
    └── modules
        ├── cart.js       # cart モジュール
        └── products.js   # products モジュール
```

参考として [Shopping Cart Example](https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart) をみてみるのもよいでしょう。
