# 見下ろし型オートアタックACT（サバイバーライク）実装計画

Vampire Survivors や Magic Survival に代表される「見下ろし型オートアタックアクションゲーム（サバイバーライク）」を新規フォルダ内にブラウザ上で快適に動作するWebアプリとして作成します。

---

## 🎮 ゲーム概要・特徴

- **ジャンル**: 見下ろし型2Dオートアタック・サバイバーライクACT
- **操作方法**:
  - 移動: `WASD` / 矢印キー / マウスドラッグ / タッチ操作（バーチャルパッド対応）
  - 攻撃: **完全自動（オートアタック）**。プレイヤーは回避とEXP回収、位置取りに集中
- **ビルド構築**:
  - 敵撃破でドロップするEXPジェムを回収してレベルアップ
  - レベルアップ時に3つの選択肢から武器・パッシブスキルを選択＆強化
- **視覚・演出（リッチデザイン）**:
  - ネオン＆サイバーダーク調の洗練されたビジュアル
  - ダメージポップアップ（クリティカル演出付き）、ヒットスパーク、撃破時パーティクル爆発
  - 画面シェイク、低HP時の危機演出（画面縁の赤色パルス）
  - Web Audio APIによるプロシージャル効果音（攻撃、ヒット、EXP取得、レベルアップファンファーレ、シンセBGM）※外部音源ファイル依存なしで即座に安定再生可能

---

## 🛠 技術構成とフォルダ構成

- **実行環境**: ブラウザ（HTML5 Canvas + Vanilla JavaScript + CSS3 + Web Audio API）
- **依存関係**: 外部ライブラリなし（純粋なWeb標準で高速・軽量に動作）

### フォルダ構成（`survivor-game/`）

```
/Users/shun_ishii/Projects/N47_act_game/
├── memo.md
└── survivor-game/
    ├── index.html          # ゲーム画面、HUD、レベルアップ選択モーダル、UI
    ├── style.css           # グラスモーフィズムUI、ネオンアニメーション、モダンタイポグラフィ
    └── js/
        ├── audio.js        # Web Audio API シンセサイザー音源＆BGM
        ├── entities.js     # プレイヤー、敵（通常・高速・大型・ボス）、ジェム、パーティクル
        ├── weapons.js      # オート武器システム（誘導弾、オービットブレード、雷撃、炎オーラ等）
        ├── upgrades.js     # レベルアップ強化・スキルカードプール
        ├── renderer.js     # Canvas描画（カメラ追従、背景グリッド、発光エフェクト）
        └── main.js         # ゲームループ、状態管理（Title, Playing, LevelUp, GameOver）
```

---

## ⚔️ ゲームシステム詳細

### 1. オート武器（Weapons）
1. **マジックミサイル（Magic Wand）**: 最も近い敵を自動検知して高速追跡弾を発射
2. **オービットブレード（Orbital Shield）**: プレイヤーの周囲を高速回転し、触れた敵に連続ダメージ
3. **サンダーストライク（Thunder Smite）**: ランダムな敵の位置に雷を落とし、範囲ダメージ
4. **フレイムオーラ（Flame Aura）**: プレイヤー周囲の一定範囲内にいる敵を継続的に焼却
5. **バウンド手裏剣（Bouncing Shuriken）**: 敵から敵へと跳ね返りながら複数ヒット

### 2. パッシブスキル（Passive Upgrades）
- **攻撃力UP（Might）**: 全武器の与ダメージ+15%
- **攻撃速度UP（Haste）**: クールダウン短縮-12%
- **移動速度UP（Boots）**: プレイヤー移動速度+10%
- **磁石範囲UP（Magnet）**: EXPジェムの引き寄せ範囲+30%
- **最大HP＆リジェネ（Vitality）**: 最大HP増加＆毎秒自然回復

### 3. エネミー・ウェーブ設計
- **Slime（スライム）**: 基本的な群れ敵
- **Bat（コウモリ）**: 高速で直線的に迫る敵
- **Golem（ゴーレム）**: 高耐久・低速の強敵
- **Boss / Elite（エリート）**: 一定時間（1分・2分等）ごとに登場する巨大ボス。撃破で大量EXP＆ボーナス

---

## 📋 変更・作成ファイル

### `survivor-game/`
#### [NEW] [index.html](file:///Users/shun_ishii/Projects/N47_act_game/survivor-game/index.html)
#### [NEW] [style.css](file:///Users/shun_ishii/Projects/N47_act_game/survivor-game/style.css)
#### [NEW] [audio.js](file:///Users/shun_ishii/Projects/N47_act_game/survivor-game/js/audio.js)
#### [NEW] [entities.js](file:///Users/shun_ishii/Projects/N47_act_game/survivor-game/js/entities.js)
#### [NEW] [weapons.js](file:///Users/shun_ishii/Projects/N47_act_game/survivor-game/js/weapons.js)
#### [NEW] [upgrades.js](file:///Users/shun_ishii/Projects/N47_act_game/survivor-game/js/upgrades.js)
#### [NEW] [renderer.js](file:///Users/shun_ishii/Projects/N47_act_game/survivor-game/js/renderer.js)
#### [NEW] [main.js](file:///Users/shun_ishii/Projects/N47_act_game/survivor-game/js/main.js)

---

## 🔍 検証計画

### 1. ブラウザ動作検証
- `survivor-game/index.html` をブラウザで起動（ローカルサーバー/ブラウザサブエージェント等で表示・動作確認）
- キーボード操作（WASD/矢印）によるプレイヤーの移動、カメラ追従が滑らかであることを確認
- オートアタック（弾丸、回転オーブ等）が敵を自動攻撃し、ダメージとパーティクルが発生することを確認
- 敵撃破でジェムがドロップし、回収時にEXPバーが上昇することを確認
- レベルアップモーダルが表示され、カード選択後に武器やステータスが正しく強化されることを確認
- ボス出現、ゲームオーバー、リトライ機能が正常に動作することを確認
- Web Audio APIによるBGM・効果音（ミュートトグル付き）が正常に機能することを確認
