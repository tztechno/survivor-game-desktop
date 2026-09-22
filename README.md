# CYBER SURVIVORS - ネオン・オートアタックACT

押し寄せるサイバーエネミーの群れをオートアタックで薙ぎ払い、スキルを強化して極限の生存を目指すサバイバーライク・アクションゲームです。

---

## 📖 ゲームマニュアル（Manuals）

- 🇯🇵 **日本語マニュアル**: [MANUAL_JA.md](file:///Users/shun_ishii/Projects/N47_act_game/MANUAL_JA.md)（遊び方）
- 🇺🇸 **English Manual**: [MANUAL_EN.md](file:///Users/shun_ishii/Projects/N47_act_game/MANUAL_EN.md) (How to Play)

---

## 🌟 主な特徴

- **完全オートアタック**: 攻撃は自動発動。回避、位置取り、ジェム回収に集中！
- **日英バイリンガル対応**: 画面内の `🌐` ボタンでいつでも日本語／英語を即時切り替え。
- **ゲーム内マニュアル**: タイトル画面・ポーズ画面の「遊び方 (HOW TO PLAY)」ボタンから図解入りマニュアルを閲覧可能。
- **DEMOプレイモード (Auto-Pilot)**: 自律AIによる自動戦闘・自動レベルアップを観戦 ➜ 画面クリックですぐに手動操作へ参戦可能。
- **Web Audio API プロシージャル音源**: 外部アセット不要でシンセBGMや効果音（レーザー、爆発、落雷、レベルアップ）を自動生成。

---

## 🚀 起動方法

```bash
# survivor-gameディレクトリを静的サーバーでホスト
cd survivor-game
python3 -m http.server 8080
```
ブラウザで `http://localhost:8080` にアクセスしてください。
