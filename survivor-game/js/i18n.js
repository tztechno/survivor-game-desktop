// Multi-Language Localization System (Japanese / English)

const TRANSLATIONS = {
  ja: {
    // Title & General
    appTitle: "CYBER SURVIVORS - ネオン・オートアタックACT",
    appDesc: "押し寄せる敵の群れをオートアタックで薙ぎ払い、スキルを強化して生き残るサバイバーライク・アクションゲーム",
    gameTitle: "CYBER SURVIVORS",
    subtitle: "NEON AUTO-ATTACK ACTION",
    gameStart: "GAME START",
    demoPlay: "DEMO PLAY",
    manual: "遊び方",
    langToggle: "🌐 English",
    langName: "日本語",

    // Title Instructions
    instTitle: "操作ガイド",
    instMoveKey: "移動（攻撃は完全自動）",
    instMoveMouse: "ドラッグでも直感的に移動可能",
    instExp: "敵を倒すと落ちる「光る経験値クリスタル（💎）」を拾ってレベルアップ！",

    // HUD
    level: "LV",
    exp: "EXP",
    kills: "撃破数",
    score: "スコア",
    pauseTitle: "PAUSED",
    soundToggle: "サウンド切替 (M)",
    pauseBtn: "ポーズ (P / ESC)",

    // Level Up Screen
    levelUpTag: "LEVEL UP!",
    levelUpTitle: "強化アイテムを選択",
    levelUpSubtitle: "ビルドを選択して更なる猛攻に備えよ",
    tagWeapon: "WEAPON UPGRADE",
    tagPassive: "PASSIVE",
    tagNew: "NEW WEAPON",
    weaponUpgradeDesc: "LV {lvl} に強化: 威力や弾数・効果範囲が向上",
    healBonusName: "エナジー完全回復",
    healBonusDesc: "HPを全回復し、スコア +500 を獲得",

    // Pause Screen
    resume: "再開する",
    restart: "やり直す",
    mightMult: "攻撃力倍率",
    moveSpeed: "移動速度",
    magnetRange: "回収範囲",

    // Game Over Screen
    missionFailed: "MISSION FAILED",
    resultReport: "サバイバル結果レポート",
    resSurviveTime: "生存時間",
    resReachedLevel: "到達レベル",
    resKills: "撃破数",
    resScore: "スコア",
    tryAgain: "TRY AGAIN",
    killsUnit: "匹",

    // Demo Mode
    demoBadge: "⚡ DEMO PLAYING (AUTO-PILOT) ⚡",
    demoSub: "画面タップまたは何かキーを押して今すぐ参戦！",
    demoPlayNow: "今すぐプレイ",
    demoExit: "タイトルへ戻る",

    // Quick Legend Panel
    legendTitle: "マーク凡例",
    legendToggle: "凡例",
    legendCategoryWeapons: "攻撃武器",
    legendCategoryPassives: "強化スキル",
    legendCategorySystem: "アイテム",
    legend_crystal: "経験値結晶（拾うとLV UP）",
    legend_magic_missile: "誘導魔弾（最寄り自動狙撃）",
    legend_orbital_blades: "回転刃（接近敵をノックバック）",
    legend_thunder_smite: "落雷（広範囲大ダメージ）",
    legend_flame_aura: "炎の輪（全周囲持続ダメージ）",
    legend_bouncing_shuriken: "跳ね手裏剣（敵間バウンド）",
    legend_might: "攻撃力UP (+15%)",
    legend_haste: "攻撃速度UP (CD -12%)",
    legend_boots: "移動速度UP (+12%)",
    legend_magnet: "吸引範囲拡大 (+35%)",
    legend_vitality: "HP増加＆毎秒自動回復",

    // Weapons
    weapon_magic_missile_name: "マジックミサイル",
    weapon_magic_missile_desc: "最も近い敵に向かって高速な魔力弾を発射する",

    weapon_orbital_blades_name: "オービットブレード",
    weapon_orbital_blades_desc: "プレイヤー周囲を旋回し、接近する敵を刻む防壁",

    weapon_thunder_smite_name: "サンダーストライク",
    weapon_thunder_smite_desc: "上空から雷を落とし、範囲内の敵を一網打尽にする",

    weapon_flame_aura_name: "フレイムオーラ",
    weapon_flame_aura_desc: "周囲に灼熱のフィールドを展開し、侵入した敵を焼き尽くす",

    weapon_bouncing_shuriken_name: "バウンド手裏剣",
    weapon_bouncing_shuriken_desc: "敵の間を跳ね返りながら切り裂く高速手裏剣を投擲する",

    // Passives
    passive_might_name: "攻撃力ブースト",
    passive_might_desc: "全武器の与ダメージ +15% (現在: +{val}%)",

    passive_haste_name: "攻撃速度アップ",
    passive_haste_desc: "全武器のクールダウン -12% (現在: -{val}%)",

    passive_boots_name: "加速ブーツ",
    passive_boots_desc: "移動速度 +12% (現在: +{val}%)",

    passive_magnet_name: "磁力コア",
    passive_magnet_desc: "経験値クリスタル（💎）の引き寄せ範囲 +35% (現在: +{val}%)",

    passive_vitality_name: "生体ナノマシン",
    passive_vitality_desc: "最大HP +25 & 毎秒HP自動回復 (現在: HP+{hp}, 回復+{regen}/s)",

    // Manual Modal
    manualTitle: "CYBER SURVIVORS 遊び方",
    tabOverview: "概要 & 目的",
    tabControls: "操作方法",
    tabWeapons: "全武器ガイド",
    tabPassives: "パッシブ強化",
    tabTips: "サバイバルTips",
    closeManual: "閉じる",

    manualOverviewContent: `
      <h3>🚀 ゲームの基本概要</h3>
      <p>『CYBER SURVIVORS』は、押し寄せる無数のサイバーエネミーを薙ぎ払い、自らの機体を強化しながら極限の生存を目指す<strong>見下ろし型オートアタック・サバイバーライクACT</strong>です。</p>
      
      <div class="manual-flow-grid">
        <div class="flow-card">
          <div class="flow-icon">🕹️</div>
          <h4>1. 回避と位置取り</h4>
          <p>攻撃は全て自動！プレイヤーは敵の包囲をすり抜ける移動操作に集中します。</p>
        </div>
        <div class="flow-card">
          <div class="flow-icon">💎</div>
          <h4>2. 経験値（クリスタル）回収</h4>
          <p>倒した敵が落とす「光る経験値結晶（💎）」を拾ってゲージを満たしレベルアップ！</p>
        </div>
        <div class="flow-card">
          <div class="flow-icon">⚡</div>
          <h4>3. 最強ビルド構築</h4>
          <p>ランダムに出現する武器とパッシブスキルを組み合わせて戦局を圧倒せよ！</p>
        </div>
      </div>
    `,

    manualControlsContent: `
      <h3>🎮 操作方法</h3>
      <table class="manual-table">
        <thead>
          <tr>
            <th>操作系統</th>
            <th>入力方法</th>
            <th>アクション</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>キーボード</td>
            <td><span class="key-badge">WASD</span> または <span class="key-badge">↑←↓→</span></td>
            <td>プレイヤーの移動</td>
          </tr>
          <tr>
            <td>マウス</td>
            <td>左クリック ＋ ドラッグ</td>
            <td>直感的な方向移動</td>
          </tr>
          <tr>
            <td>スマホ / タッチ</td>
            <td>画面タッチ＆スライド</td>
            <td>バーチャルアナログジョイスティック操作</td>
          </tr>
          <tr>
            <td>ポーズ / 再開</td>
            <td><span class="key-badge">P</span> または <span class="key-badge">ESC</span></td>
            <td>ゲームの一時停止 / 再開</td>
          </tr>
          <tr>
            <td>サウンド切替</td>
            <td><span class="key-badge">M</span></td>
            <td>BGM / 効果音のミュート切替</td>
          </tr>
        </tbody>
      </table>
    `,

    manualWeaponsContent: `
      <h3>⚔️ 全武器カタログ</h3>
      <p class="section-lead">最大4スロットまで同時所持可能。各武器はLV 5まで強化できます。</p>
      <div class="manual-cards-list">
        <div class="manual-item-card">
          <div class="mic-icon">🔮</div>
          <div class="mic-info">
            <h4>マジックミサイル (Magic Missile)</h4>
            <p>最も近い敵を自動ロックオンし、高速な誘導エネルギー弾を連続発射。レベル上昇で同時発射数と貫通力が増加します。</p>
          </div>
        </div>
        <div class="manual-item-card">
          <div class="mic-icon">🛡️</div>
          <div class="mic-info">
            <h4>オービットブレード (Orbital Blades)</h4>
            <p>プレイヤーの周囲を高速旋回するエナジーブレード。接近する敵を刻みノックバックさせ、強力な防御壁となります。</p>
          </div>
        </div>
        <div class="manual-item-card">
          <div class="mic-icon">⚡</div>
          <div class="mic-info">
            <h4>サンダーストライク (Thunder Smite)</h4>
            <p>上空から雷を落とし、範囲内の敵を一網打尽にする高火力AOE攻撃。密集した大群を一瞬で消滅させます。</p>
          </div>
        </div>
        <div class="manual-item-card">
          <div class="mic-icon">🔥</div>
          <div class="mic-info">
            <h4>フレイムオーラ (Flame Aura)</h4>
            <p>自機の周囲に灼熱のプラズマフィールドを展開。範囲内に侵入した敵に高速で連続ダメージを与え続けます。</p>
          </div>
        </div>
        <div class="manual-item-card">
          <div class="mic-icon">💠</div>
          <div class="mic-info">
            <h4>バウンド手裏剣 (Bouncing Shuriken)</h4>
            <p>敵から敵へと連続して跳ね返るネオン手裏剣。広範囲に散開した敵群を効率的に処理できます。</p>
          </div>
        </div>
      </div>
    `,

    manualPassivesContent: `
      <h3>🧬 パッシブスキル</h3>
      <p class="section-lead">機体の性能を恒久的に底上げする強化チップ（最大LV 5）。</p>
      <div class="manual-cards-list">
        <div class="manual-item-card">
          <div class="mic-icon">⚔️</div>
          <div class="mic-info">
            <h4>攻撃力ブースト (Might)</h4>
            <p>全武器の与ダメージが1レベルごとに+15%増加。敵の体力が上がる後半で必須の強化。</p>
          </div>
        </div>
        <div class="manual-item-card">
          <div class="mic-icon">⚡</div>
          <div class="mic-info">
            <h4>攻撃速度アップ (Haste)</h4>
            <p>全武器の攻撃クールダウンを1レベルごとに-12%短縮。弾幕の密度が劇的に向上します。</p>
          </div>
        </div>
        <div class="manual-item-card">
          <div class="mic-icon">👟</div>
          <div class="mic-info">
            <h4>加速ブーツ (Boots)</h4>
            <p>移動速度が1レベルごとに+12%向上。敵の包囲網からの脱出やボス攻撃の回避に役立ちます。</p>
          </div>
        </div>
        <div class="manual-item-card">
          <div class="mic-icon">🧲</div>
          <div class="mic-info">
            <h4>磁力コア (Magnet)</h4>
            <p>敵が落とす経験値クリスタル（💎）の吸引範囲が1レベルごとに+35%拡大。安全な位置から大量の経験値を回収できます。</p>
          </div>
        </div>
        <div class="manual-item-card">
          <div class="mic-icon">💚</div>
          <div class="mic-info">
            <h4>生体ナノマシン (Vitality)</h4>
            <p>最大HPが+25増加し、さらに毎秒HPが自動回復。長期戦での安定性が飛躍的に高まります。</p>
          </div>
        </div>
      </div>
    `,

    manualTipsContent: `
      <h3>💡 生存のためのサバイバルTips</h3>
      <div class="tips-grid">
        <div class="tip-card">
          <span class="tip-number">TIP 01</span>
          <h4>足を止めない（円運動を意識）</h4>
          <p>直線的に逃げるよりも、敵の群れの周りを大きく円を描くように回ると経験値クリスタルが一箇所にまとまりやすくなります。</p>
        </div>
        <div class="tip-card">
          <span class="tip-number">TIP 02</span>
          <h4>武器の集中強化 vs バランス</h4>
          <p>序盤は1〜2種類の武器のレベルを集中的に上げると敵の殲滅スピードが上がり、レベルアップのテンポが劇的に良くなります。</p>
        </div>
        <div class="tip-card">
          <span class="tip-number">TIP 03</span>
          <h4>60秒ごとのボス襲来に備える</h4>
          <p>60秒周期で黄金の巨大ボスが登場します。高火力武器（サンダーストライクやミサイル）で集中攻撃を浴びせましょう！</p>
        </div>
        <div class="tip-card">
          <span class="tip-number">TIP 04</span>
          <h4>磁力コアの重要性</h4>
          <p>敵が多くて近づけない経験値クリスタルも、磁力コアがあれば一気に引き寄せて一瞬で大量レベルアップが狙えます。</p>
        </div>
      </div>
    `
  },

  en: {
    // Title & General
    appTitle: "CYBER SURVIVORS - Neon Auto-Attack ACT",
    appDesc: "Mow down relentless waves of cyber enemies with auto-attacks and craft powerful builds to survive!",
    gameTitle: "CYBER SURVIVORS",
    subtitle: "NEON AUTO-ATTACK ACTION",
    gameStart: "GAME START",
    demoPlay: "DEMO PLAY",
    manual: "HOW TO PLAY",
    langToggle: "🌐 日本語",
    langName: "English",

    // Title Instructions
    instTitle: "How to Play",
    instMoveKey: "Move (Attacks are fully automated)",
    instMoveMouse: "Mouse drag / Touch swipe supported",
    instExp: "Slay foes to collect EXP ➜ Level up to build arsenal",

    // HUD
    level: "LV",
    exp: "EXP",
    kills: "KILLS",
    score: "SCORE",
    pauseTitle: "PAUSED",
    soundToggle: "Toggle Sound (M)",
    pauseBtn: "Pause (P / ESC)",

    // Level Up Screen
    levelUpTag: "LEVEL UP!",
    levelUpTitle: "Select an Upgrade",
    levelUpSubtitle: "Choose an upgrade to prepare for oncoming swarms",
    tagWeapon: "WEAPON UPGRADE",
    tagPassive: "PASSIVE",
    tagNew: "NEW WEAPON",
    weaponUpgradeDesc: "Upgrade to LV {lvl}: Increases damage, count, or range",
    healBonusName: "Energy Full Restore",
    healBonusDesc: "Fully restore HP and gain +500 score",

    // Pause Screen
    resume: "Resume",
    restart: "Restart",
    mightMult: "Damage Multiplier",
    moveSpeed: "Move Speed",
    magnetRange: "Magnet Range",

    // Game Over Screen
    missionFailed: "MISSION FAILED",
    resultReport: "Survival Mission Debrief",
    resSurviveTime: "Survival Time",
    resReachedLevel: "Reached Level",
    resKills: "Enemies Slain",
    resScore: "Total Score",
    tryAgain: "TRY AGAIN",
    killsUnit: "",

    // Demo Mode
    demoBadge: "⚡ DEMO PLAYING (AUTO-PILOT) ⚡",
    demoSub: "Click anywhere or press any key to jump into the action!",
    demoPlayNow: "PLAY NOW",
    demoExit: "EXIT TO TITLE",

    // Quick Legend Panel
    legendTitle: "ICON LEGEND",
    legendToggle: "LEGEND",
    legendCategoryWeapons: "Weapons",
    legendCategoryPassives: "Passives",
    legendCategorySystem: "Items",
    legend_crystal: "EXP Crystal (Level Up)",
    legend_magic_missile: "Magic Missile (Homing)",
    legend_orbital_blades: "Orbital Blades (Shield)",
    legend_thunder_smite: "Thunder Smite (AOE)",
    legend_flame_aura: "Flame Aura (Burn)",
    legend_bouncing_shuriken: "Shuriken (Ricochet)",
    legend_might: "Might (+15% Damage)",
    legend_haste: "Haste (-12% Cooldown)",
    legend_boots: "Speed (+12% Move)",
    legend_magnet: "Magnet (+35% Radius)",
    legend_vitality: "Bio Nanites (+HP & Regen)",

    // Weapons
    weapon_magic_missile_name: "Magic Missile",
    weapon_magic_missile_desc: "Fires fast homing energy bolts at the nearest foe",

    weapon_orbital_blades_name: "Orbital Blades",
    weapon_orbital_blades_desc: "Rotates protective energy blades around the player",

    weapon_thunder_smite_name: "Thunder Smite",
    weapon_thunder_smite_desc: "Calls down lightning strikes to devastate areas",

    weapon_flame_aura_name: "Flame Aura",
    weapon_flame_aura_desc: "Emits a searing plasma field burning all nearby foes",

    weapon_bouncing_shuriken_name: "Bouncing Shuriken",
    weapon_bouncing_shuriken_desc: "Hurls high-speed shurikens that ricochet between enemies",

    // Passives
    passive_might_name: "Might Boost",
    passive_might_desc: "+15% Damage to all weapons (Current: +{val}%)",

    passive_haste_name: "Attack Haste",
    passive_haste_desc: "-12% Weapon cooldowns (Current: -{val}%)",

    passive_boots_name: "Speed Boots",
    passive_boots_desc: "+12% Movement speed (Current: +{val}%)",

    passive_magnet_name: "Magnetic Core",
    passive_magnet_desc: "+35% EXP pickup radius (Current: +{val}%)",

    passive_vitality_name: "Bio Nanites",
    passive_vitality_desc: "+25 Max HP & Auto HP regeneration (Current: HP+{hp}, Regen+{regen}/s)",

    // Manual Modal
    manualTitle: "CYBER SURVIVORS - HOW TO PLAY",
    tabOverview: "Overview",
    tabControls: "Controls",
    tabWeapons: "Weapons",
    tabPassives: "Passives",
    tabTips: "Survival Tips",
    closeManual: "Close",

    manualOverviewContent: `
      <h3>🚀 Game Overview</h3>
      <p>『CYBER SURVIVORS』 is a <strong>top-down auto-attack survivor roguelite ACT</strong>. Your objective is to dodge ruthless swarms of cybernetic enemies, harvest energy gems, and evolve your build to survive against insurmountable odds.</p>
      
      <div class="manual-flow-grid">
        <div class="flow-card">
          <div class="flow-icon">🕹️</div>
          <h4>1. Maneuver & Evade</h4>
          <p>All weapons fire automatically! Focus entirely on positioning and dodging incoming threats.</p>
        </div>
        <div class="flow-card">
          <div class="flow-icon">💎</div>
          <h4>2. Harvest EXP Gems</h4>
          <p>Defeated enemies drop EXP gems. Collect them to fill the bar and trigger level ups!</p>
        </div>
        <div class="flow-card">
          <div class="flow-icon">⚡</div>
          <h4>3. Construct Builds</h4>
          <p>Combine up to 4 weapons and 5 passive upgrades to create an unstoppable synergy.</p>
        </div>
      </div>
    `,

    manualControlsContent: `
      <h3>🎮 Control Scheme</h3>
      <table class="manual-table">
        <thead>
          <tr>
            <th>Input Type</th>
            <th>Key / Action</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Keyboard</td>
            <td><span class="key-badge">WASD</span> or <span class="key-badge">↑←↓→</span></td>
            <td>Move Player</td>
          </tr>
          <tr>
            <td>Mouse</td>
            <td>Left Click + Drag</td>
            <td>Fluid directional movement</td>
          </tr>
          <tr>
            <td>Mobile / Touch</td>
            <td>Touch & Slide</td>
            <td>Virtual Analog Joystick</td>
          </tr>
          <tr>
            <td>Pause / Resume</td>
            <td><span class="key-badge">P</span> or <span class="key-badge">ESC</span></td>
            <td>Pause or resume game session</td>
          </tr>
          <tr>
            <td>Sound Toggle</td>
            <td><span class="key-badge">M</span></td>
            <td>Mute or unmute synthesized audio</td>
          </tr>
        </tbody>
      </table>
    `,

    manualWeaponsContent: `
      <h3>⚔️ Weapons Compendium</h3>
      <p class="section-lead">Equip up to 4 weapons simultaneously. Each can be upgraded up to Level 5.</p>
      <div class="manual-cards-list">
        <div class="manual-item-card">
          <div class="mic-icon">🔮</div>
          <div class="mic-info">
            <h4>Magic Missile</h4>
            <p>Automatically targets the closest threat with rapid homing plasma bolts. Levels increase projectile count and piercing power.</p>
          </div>
        </div>
        <div class="manual-item-card">
          <div class="mic-icon">🛡️</div>
          <div class="mic-info">
            <h4>Orbital Blades</h4>
            <p>Rotating energy shields that shred any enemy stepping too close, delivering continuous damage and knockback.</p>
          </div>
        </div>
        <div class="manual-item-card">
          <div class="mic-icon">⚡</div>
          <div class="mic-info">
            <h4>Thunder Smite</h4>
            <p>Strikes random targets with high-voltage lightning blasts that deal massive area-of-effect damage.</p>
          </div>
        </div>
        <div class="manual-item-card">
          <div class="mic-icon">🔥</div>
          <div class="mic-info">
            <h4>Flame Aura</h4>
            <p>Ignites a permanent ring of fire around the player, continuously incinerating nearby swarms.</p>
          </div>
        </div>
        <div class="manual-item-card">
          <div class="mic-icon">💠</div>
          <div class="mic-info">
            <h4>Bouncing Shuriken</h4>
            <p>Throws piercing energy shurikens that ricochet repeatedly from enemy to enemy across the battlefield.</p>
          </div>
        </div>
      </div>
    `,

    manualPassivesContent: `
      <h3>🧬 Passive Upgrades</h3>
      <p class="section-lead">Enhancement chips that permanently augment your mech stats (Max LV 5).</p>
      <div class="manual-cards-list">
        <div class="manual-item-card">
          <div class="mic-icon">⚔️</div>
          <div class="mic-info">
            <h4>Might Boost</h4>
            <p>+15% Damage per level for all weapons. Crucial for handling escalated enemy health pools.</p>
          </div>
        </div>
        <div class="manual-item-card">
          <div class="mic-icon">⚡</div>
          <div class="mic-info">
            <h4>Attack Haste</h4>
            <p>-12% Cooldown per level for all weapons. Vastly increases firepower density.</p>
          </div>
        </div>
        <div class="manual-item-card">
          <div class="mic-icon">👟</div>
          <div class="mic-info">
            <h4>Speed Boots</h4>
            <p>+12% Movement speed per level. Essential for escaping dense encirclements and kiting bosses.</p>
          </div>
        </div>
        <div class="manual-item-card">
          <div class="mic-icon">🧲</div>
          <div class="mic-info">
            <h4>Magnetic Core</h4>
            <p>+35% EXP gem attraction radius per level. Allows gathering gems safely from a distance.</p>
          </div>
        </div>
        <div class="manual-item-card">
          <div class="mic-icon">💚</div>
          <div class="mic-info">
            <h4>Bio Nanites</h4>
            <p>+25 Max HP and constant HP regeneration per second. Guarantees long-term survivability.</p>
          </div>
        </div>
      </div>
    `,

    manualTipsContent: `
      <h3>💡 Survival & Kiting Tips</h3>
      <div class="tips-grid">
        <div class="tip-card">
          <span class="tip-number">TIP 01</span>
          <h4>Keep Moving in Circles</h4>
          <p>Instead of fleeing in a straight line, kite enemies in wide circular loops to herd them and concentrate EXP gem drops.</p>
        </div>
        <div class="tip-card">
          <span class="tip-number">TIP 02</span>
          <h4>Focus on Maxing 1-2 Weapons Early</h4>
          <p>High-level weapons dispatch swarms much faster than many Level 1 weapons, accelerating your overall leveling pace.</p>
        </div>
        <div class="tip-card">
          <span class="tip-number">TIP 03</span>
          <h4>Prepare for Boss Waves (Every 60s)</h4>
          <p>A colossal golden boss spawns every 60 seconds. Maintain distance and focus single-target firepower to bring it down.</p>
        </div>
        <div class="tip-card">
          <span class="tip-number">TIP 04</span>
          <h4>Magnet Core Synergies</h4>
          <p>Pairing high-range weapons with Magnetic Core creates a self-sustaining EXP stream without putting you in danger.</p>
        </div>
      </div>
    `
  }
};

class I18nManager {
  constructor() {
    // Check saved language or browser language
    const saved = localStorage.getItem('cyber_survivor_lang');
    if (saved && (saved === 'ja' || saved === 'en')) {
      this.lang = saved;
    } else {
      const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
      this.lang = browserLang.startsWith('ja') ? 'ja' : 'en';
    }
    this.listeners = [];
  }

  setLanguage(lang) {
    if (lang !== 'ja' && lang !== 'en') return;
    this.lang = lang;
    localStorage.setItem('cyber_survivor_lang', lang);
    this.updateDOM();
    this.notify();
  }

  toggleLanguage() {
    const next = this.lang === 'ja' ? 'en' : 'ja';
    this.setLanguage(next);
    return this.lang;
  }

  t(key, params = {}) {
    const dict = TRANSLATIONS[this.lang] || TRANSLATIONS['ja'];
    let text = dict[key] || TRANSLATIONS['ja'][key] || key;

    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
    return text;
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  notify() {
    for (const cb of this.listeners) {
      cb(this.lang);
    }
  }

  updateDOM() {
    document.documentElement.lang = this.lang;

    // Update elements with data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    for (const el of elements) {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = this.t(key);
      }
    }

    // Update elements with data-i18n-html
    const htmlElements = document.querySelectorAll('[data-i18n-html]');
    for (const el of htmlElements) {
      const key = el.getAttribute('data-i18n-html');
      if (key) {
        el.innerHTML = this.t(key);
      }
    }

    // Update page title & meta
    document.title = this.t('appTitle');
  }
}

const i18n = new I18nManager();
