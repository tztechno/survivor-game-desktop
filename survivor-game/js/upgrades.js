// Upgrade System & Level Up Card Pool with Dynamic Localization

const PASSIVES_DEF = [
  {
    id: 'might',
    icon: '⚔️',
    type: 'passive',
    maxLevel: 5,
    getName: () => i18n.t('passive_might_name'),
    getDescription: (lvl) => i18n.t('passive_might_desc', { val: lvl * 15 })
  },
  {
    id: 'haste',
    icon: '⚡',
    type: 'passive',
    maxLevel: 5,
    getName: () => i18n.t('passive_haste_name'),
    getDescription: (lvl) => i18n.t('passive_haste_desc', { val: lvl * 12 })
  },
  {
    id: 'boots',
    icon: '👟',
    type: 'passive',
    maxLevel: 5,
    getName: () => i18n.t('passive_boots_name'),
    getDescription: (lvl) => i18n.t('passive_boots_desc', { val: lvl * 12 })
  },
  {
    id: 'magnet',
    icon: '🧲',
    type: 'passive',
    maxLevel: 5,
    getName: () => i18n.t('passive_magnet_name'),
    getDescription: (lvl) => i18n.t('passive_magnet_desc', { val: lvl * 35 })
  },
  {
    id: 'vitality',
    icon: '💚',
    type: 'passive',
    maxLevel: 5,
    getName: () => i18n.t('passive_vitality_name'),
    getDescription: (lvl) => i18n.t('passive_vitality_desc', { 
      hp: lvl * 25, 
      regen: (lvl * 0.8).toFixed(1) 
    })
  }
];

const WEAPONS_DEF = [
  { id: 'magic_missile', icon: '🔮', classRef: MagicMissileWeapon },
  { id: 'orbital_blades', icon: '🛡️', classRef: OrbitalBladesWeapon },
  { id: 'thunder_smite', icon: '⚡', classRef: ThunderSmiteWeapon },
  { id: 'flame_aura', icon: '🔥', classRef: FlameAuraWeapon },
  { id: 'bouncing_shuriken', icon: '💠', classRef: BouncingShurikenWeapon }
];

class UpgradeManager {
  constructor() {
    this.maxWeapons = 4;
  }

  getAvailableUpgrades(player) {
    const options = [];

    // 1. Weapon upgrades & unlocks
    for (const wDef of WEAPONS_DEF) {
      const owned = player.weapons.find(w => w.id === wDef.id);
      if (owned) {
        if (owned.level < owned.maxLevel) {
          options.push({
            id: wDef.id,
            name: owned.name,
            icon: owned.icon,
            type: 'weapon',
            level: owned.level + 1,
            isNew: false,
            desc: i18n.t('weaponUpgradeDesc', { lvl: owned.level + 1 }),
            action: () => {
              owned.upgrade();
            }
          });
        }
      } else if (player.weapons.length < this.maxWeapons) {
        // New weapon
        const temp = new wDef.classRef();
        options.push({
          id: wDef.id,
          name: temp.name,
          icon: temp.icon,
          type: 'weapon',
          level: 1,
          isNew: true,
          desc: temp.description,
          action: () => {
            const newW = new wDef.classRef();
            player.weapons.push(newW);
          }
        });
      }
    }

    // 2. Passive upgrades
    for (const pDef of PASSIVES_DEF) {
      const curLvl = player.passives[pDef.id] || 0;
      if (curLvl < pDef.maxLevel) {
        options.push({
          id: pDef.id,
          name: pDef.getName(),
          icon: pDef.icon,
          type: 'passive',
          level: curLvl + 1,
          isNew: curLvl === 0,
          desc: pDef.getDescription(curLvl + 1),
          action: () => {
            player.passives[pDef.id] = (player.passives[pDef.id] || 0) + 1;
            player.applyStats();
          }
        });
      }
    }

    // 3. Fallback bonus if all maxed out
    if (options.length === 0) {
      options.push({
        id: 'heal_bonus',
        name: i18n.t('healBonusName'),
        icon: '💖',
        type: 'passive',
        level: 1,
        isNew: false,
        desc: i18n.t('healBonusDesc'),
        action: () => {
          player.hp = player.maxHp;
          game.addScore(500);
        }
      });
    }

    // Pick 3 unique random choices
    const choices = [];
    const pool = [...options];
    const pickCount = Math.min(3, pool.length);

    for (let i = 0; i < pickCount; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      choices.push(pool.splice(idx, 1)[0]);
    }

    return choices;
  }
}

const upgradeManager = new UpgradeManager();
