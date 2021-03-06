# 厳格モード

厳格（strict）モードを有効にするには Vuex store を作成するときに、ただ `strict: true` を指定するだけです:

``` js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

厳格モードでは Vuex の状態がミューテーションハンドラの外部で変更されたら、エラーを投げるようになります。これで全ての状態変更がデバッギングツールで明示的に追跡できることが保証されます。

### 開発環境 vs 本番環境

**本番環境で厳格モードを有効にしてデプロイしてはいけません！** 厳格モードでは不適切なミューテーションを検出するためにステートツリーに対して深い監視を実行します。パフォーマンスコストを回避するために本番環境では無効にしてください。

プラグインと同様に、ビルドツールに処理させることができます:

``` js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```
