// Weapons System with Dynamic Localization

class WeaponBase {
  constructor(id, icon) {
    this.id = id;
    this.icon = icon;
    this.level = 1;
    this.maxLevel = 5;
    this.cooldown = 1.0;
    this.timer = 0;
  }

  get name() {
    return i18n.t(`weapon_${this.id}_name`);
  }

  get description() {
    return i18n.t(`weapon_${this.id}_desc`);
  }

  update(dt, player) {
    this.timer -= dt;
    if (this.timer <= 0) {
      this.fire(player);
      this.timer = this.cooldown * player.haste;
    }
  }

  fire(player) {}

  upgrade() {
    if (this.level < this.maxLevel) {
      this.level++;
      this.applyLevelStats();
    }
  }

  applyLevelStats() {}
}

// 1. Magic Wand / Missile
class MagicMissileWeapon extends WeaponBase {
  constructor() {
    super('magic_missile', '🔮');
    this.cooldown = 0.8;
    this.baseDamage = 22;
    this.projectileCount = 1;
    this.pierce = 1;
    this.applyLevelStats();
  }

  applyLevelStats() {
    switch (this.level) {
      case 1:
        this.cooldown = 0.8;
        this.baseDamage = 22;
        this.projectileCount = 1;
        this.pierce = 1;
        break;
      case 2:
        this.baseDamage = 28;
        this.projectileCount = 2;
        break;
      case 3:
        this.cooldown = 0.65;
        this.projectileCount = 3;
        break;
      case 4:
        this.baseDamage = 36;
        this.pierce = 2;
        break;
      case 5:
        this.cooldown = 0.5;
        this.projectileCount = 4;
        this.baseDamage = 45;
        break;
    }
  }

  fire(player) {
    const enemies = game.getNearestEnemies(player.x, player.y, 600, this.projectileCount);
    if (enemies.length === 0) return;

    audio.playLaser();

    for (let i = 0; i < this.projectileCount; i++) {
      const target = enemies[i % enemies.length];
      const dx = target.x - player.x;
      const dy = target.y - player.y;
      const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.15;
      const speed = 480;

      const p = new Projectile(
        player.x,
        player.y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        Math.round(this.baseDamage * player.might),
        7,
        '#00f0ff',
        1.5,
        this.pierce
      );
      game.addProjectile(p);
    }
  }
}

// 2. Orbital Blades / Shield
class OrbitalBladesWeapon extends WeaponBase {
  constructor() {
    super('orbital_blades', '🛡️');
    this.cooldown = 0; // Continuous
    this.baseDamage = 18;
    this.orbCount = 1;
    this.orbitRadius = 75;
    this.rotationSpeed = 3.2;
    this.angle = 0;
    this.hitCooldowns = new Map();
    this.applyLevelStats();
  }

  applyLevelStats() {
    switch (this.level) {
      case 1:
        this.orbCount = 1;
        this.baseDamage = 18;
        this.rotationSpeed = 3.2;
        break;
      case 2:
        this.orbCount = 2;
        this.baseDamage = 24;
        break;
      case 3:
        this.orbCount = 3;
        this.rotationSpeed = 4.0;
        break;
      case 4:
        this.orbCount = 4;
        this.baseDamage = 32;
        break;
      case 5:
        this.orbCount = 5;
        this.baseDamage = 40;
        this.rotationSpeed = 5.0;
        break;
    }
  }

  update(dt, player) {
    this.angle += this.rotationSpeed * (1 / player.haste) * dt;

    // Clean up hit cooldowns
    for (const [enemy, timer] of this.hitCooldowns.entries()) {
      if (timer <= dt) {
        this.hitCooldowns.delete(enemy);
      } else {
        this.hitCooldowns.set(enemy, timer - dt);
      }
    }

    // Check collision for each orb
    for (let i = 0; i < this.orbCount; i++) {
      const orbAngle = this.angle + (i * Math.PI * 2) / this.orbCount;
      const orbX = player.x + Math.cos(orbAngle) * this.orbitRadius;
      const orbY = player.y + Math.sin(orbAngle) * this.orbitRadius;
      const orbRadius = 12;

      // Spawn subtle particle trail
      if (Math.random() < 0.3) {
        game.addParticle(new Particle(orbX, orbY, 0, 0, '#00ff88', 4, 0.2));
      }

      for (const enemy of game.enemies) {
        if (enemy.isDead || this.hitCooldowns.has(enemy)) continue;

        const dist = Math.hypot(enemy.x - orbX, enemy.y - orbY);
        if (dist < enemy.radius + orbRadius) {
          const dmg = Math.round(this.baseDamage * player.might);
          const isCrit = Math.random() < 0.15;
          const finalDmg = isCrit ? Math.floor(dmg * 1.8) : dmg;

          const pushAngle = Math.atan2(enemy.y - player.y, enemy.x - player.x);
          enemy.takeDamage(finalDmg, pushAngle, 200);
          audio.playHit();

          game.addDamageNumber(new DamageNumber(finalDmg, enemy.x, enemy.y - 10, isCrit));
          game.spawnHitSparks(orbX, orbY, '#00ff88');

          this.hitCooldowns.set(enemy, 0.35); // 0.35s damage interval per enemy
        }
      }
    }
  }
}

// 3. Thunder Smite
class ThunderSmiteWeapon extends WeaponBase {
  constructor() {
    super('thunder_smite', '⚡');
    this.cooldown = 2.2;
    this.baseDamage = 60;
    this.strikeCount = 1;
    this.blastRadius = 65;
    this.applyLevelStats();
  }

  applyLevelStats() {
    switch (this.level) {
      case 1:
        this.cooldown = 2.2;
        this.baseDamage = 60;
        this.strikeCount = 1;
        this.blastRadius = 65;
        break;
      case 2:
        this.strikeCount = 2;
        this.baseDamage = 75;
        break;
      case 3:
        this.cooldown = 1.7;
        this.blastRadius = 85;
        break;
      case 4:
        this.strikeCount = 3;
        this.baseDamage = 95;
        break;
      case 5:
        this.strikeCount = 4;
        this.cooldown = 1.3;
        this.baseDamage = 120;
        this.blastRadius = 100;
        break;
    }
  }

  fire(player) {
    if (game.enemies.length === 0) return;

    // Pick random enemies on screen
    const targets = [];
    const pool = [...game.enemies].filter(e => !e.isDead);
    for (let i = 0; i < this.strikeCount && pool.length > 0; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      targets.push(pool.splice(idx, 1)[0]);
    }

    if (targets.length > 0) {
      audio.playThunder();
      game.triggerScreenShake(5, 0.15);

      for (const target of targets) {
        const tx = target.x;
        const ty = target.y;

        // Visual flash & shockwave effect
        game.addShockwave(tx, ty, this.blastRadius, '#00f0ff');

        // AOE Damage
        for (const enemy of game.enemies) {
          if (enemy.isDead) continue;
          const dist = Math.hypot(enemy.x - tx, enemy.y - ty);
          if (dist <= this.blastRadius) {
            const dmg = Math.round(this.baseDamage * player.might * (1 - (dist / this.blastRadius) * 0.3));
            const isCrit = Math.random() < 0.25;
            const finalDmg = isCrit ? Math.floor(dmg * 2.0) : dmg;

            const angle = Math.atan2(enemy.y - ty, enemy.x - tx);
            enemy.takeDamage(finalDmg, angle, 240);
            game.addDamageNumber(new DamageNumber(finalDmg, enemy.x, enemy.y - 12, isCrit));
            game.spawnHitSparks(enemy.x, enemy.y, '#00f0ff');
          }
        }
      }
    }
  }
}

// 4. Flame Aura
class FlameAuraWeapon extends WeaponBase {
  constructor() {
    super('flame_aura', '🔥');
    this.cooldown = 0.35;
    this.baseDamage = 14;
    this.auraRadius = 80;
    this.applyLevelStats();
  }

  applyLevelStats() {
    switch (this.level) {
      case 1:
        this.auraRadius = 80;
        this.baseDamage = 14;
        this.cooldown = 0.35;
        break;
      case 2:
        this.auraRadius = 100;
        this.baseDamage = 19;
        break;
      case 3:
        this.auraRadius = 120;
        this.cooldown = 0.28;
        break;
      case 4:
        this.auraRadius = 145;
        this.baseDamage = 26;
        break;
      case 5:
        this.auraRadius = 175;
        this.baseDamage = 35;
        this.cooldown = 0.22;
        break;
    }
  }

  fire(player) {
    let hitCount = 0;
    const dmg = Math.round(this.baseDamage * player.might);

    for (const enemy of game.enemies) {
      if (enemy.isDead) continue;
      const dist = Math.hypot(enemy.x - player.x, enemy.y - player.y);
      if (dist <= this.auraRadius) {
        const isCrit = Math.random() < 0.12;
        const finalDmg = isCrit ? Math.floor(dmg * 1.6) : dmg;

        const pushAngle = Math.atan2(enemy.y - player.y, enemy.x - player.x);
        enemy.takeDamage(finalDmg, pushAngle, 80);
        game.addDamageNumber(new DamageNumber(finalDmg, enemy.x, enemy.y - 8, isCrit));
        game.spawnHitSparks(enemy.x, enemy.y, '#ff4500');
        hitCount++;
      }
    }

    if (hitCount > 0) {
      audio.playHit();
    }
  }
}

// 5. Bouncing Shuriken
class BouncingShurikenWeapon extends WeaponBase {
  constructor() {
    super('bouncing_shuriken', '💠');
    this.cooldown = 1.4;
    this.baseDamage = 30;
    this.bounceCount = 3;
    this.count = 1;
    this.applyLevelStats();
  }

  applyLevelStats() {
    switch (this.level) {
      case 1:
        this.cooldown = 1.4;
        this.baseDamage = 30;
        this.bounceCount = 3;
        this.count = 1;
        break;
      case 2:
        this.bounceCount = 5;
        this.baseDamage = 40;
        break;
      case 3:
        this.count = 2;
        this.cooldown = 1.1;
        break;
      case 4:
        this.bounceCount = 7;
        this.baseDamage = 52;
        break;
      case 5:
        this.count = 3;
        this.bounceCount = 9;
        this.baseDamage = 65;
        this.cooldown = 0.9;
        break;
    }
  }

  fire(player) {
    const enemies = game.getNearestEnemies(player.x, player.y, 500, this.count);
    if (enemies.length === 0) return;

    audio.playLaser();

    for (let i = 0; i < this.count; i++) {
      const target = enemies[i % enemies.length];
      const dx = target.x - player.x;
      const dy = target.y - player.y;
      const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.2;
      const speed = 420;

      let bouncesLeft = this.bounceCount;

      const onHitCallback = (proj, hitEnemy) => {
        if (bouncesLeft > 0) {
          bouncesLeft--;
          // Find next closest enemy that isn't the hit enemy
          const others = game.enemies.filter(e => !e.isDead && e !== hitEnemy);
          if (others.length > 0) {
            others.sort((a, b) => {
              const da = Math.hypot(a.x - proj.x, a.y - proj.y);
              const db = Math.hypot(b.x - proj.x, b.y - proj.y);
              return da - db;
            });
            const nextTarget = others[0];
            const ndx = nextTarget.x - proj.x;
            const ndy = nextTarget.y - proj.y;
            const nAngle = Math.atan2(ndy, ndx);
            proj.vx = Math.cos(nAngle) * speed;
            proj.vy = Math.sin(nAngle) * speed;
            proj.life = 1.2;
            proj.hitEnemies.clear();
            proj.isDead = false;
            proj.pierce = 1;
          }
        }
      };

      const p = new Projectile(
        player.x,
        player.y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        Math.round(this.baseDamage * player.might),
        9,
        '#c77dff',
        1.6,
        1,
        onHitCallback
      );
      game.addProjectile(p);
    }
  }
}
