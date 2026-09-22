// Entity classes: Player, Enemy, ExpGem, Projectile, Particle, DamageNumber

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 16;
    this.vx = 0;
    this.vy = 0;
    this.facing = 1; // 1: right, -1: left
    this.animAngle = 0;

    // Base Stats
    this.baseMaxHp = 100;
    this.maxHp = 100;
    this.hp = 100;
    this.baseSpeed = 220; // px/sec
    this.speed = 220;
    this.baseMagnet = 110;
    this.magnetRadius = 110;
    this.might = 1.0; // Damage multiplier
    this.haste = 1.0; // Attack speed / cooldown multiplier (lower is faster)
    this.regen = 0.0; // HP/sec
    this.armor = 0;

    // Progression
    this.level = 1;
    this.exp = 0;
    this.nextExp = 100;

    // State
    this.invulnTimer = 0;
    this.invulnMax = 0.4; // 0.4s immunity after getting hit
    this.isDead = false;

    // Equipment & Passives
    this.weapons = [];
    this.passives = {};
  }

  update(dt, input) {
    if (this.isDead) return;

    // Invulnerability tick
    if (this.invulnTimer > 0) {
      this.invulnTimer -= dt;
    }

    // Health Regen
    if (this.regen > 0 && this.hp < this.maxHp) {
      this.hp = Math.min(this.maxHp, this.hp + this.regen * dt);
    }

    // Movement calculation from input vector
    let mx = input.x;
    let my = input.y;
    const len = Math.hypot(mx, my);
    if (len > 0) {
      mx /= len;
      my /= len;
      this.vx = mx * this.speed;
      this.vy = my * this.speed;
      this.facing = mx >= 0 ? 1 : -1;
      this.animAngle += dt * 10;
    } else {
      this.vx = 0;
      this.vy = 0;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Update weapons
    for (const weapon of this.weapons) {
      weapon.update(dt, this);
    }
  }

  takeDamage(amount) {
    if (this.invulnTimer > 0 || this.isDead) return false;
    const effectiveDmg = Math.max(1, amount - this.armor);
    this.hp -= effectiveDmg;
    this.invulnTimer = this.invulnMax;

    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
    }
    return true;
  }

  gainExp(amount) {
    this.exp += amount;
    let leveledUp = false;
    while (this.exp >= this.nextExp) {
      this.exp -= this.nextExp;
      this.level++;
      // Exponential curve for required EXP
      this.nextExp = Math.floor(this.nextExp * 1.35 + 25);
      leveledUp = true;
    }
    return leveledUp;
  }

  applyStats() {
    // Recompute total stats based on passives
    const p = this.passives;
    this.might = 1.0 + (p.might || 0) * 0.15;
    this.haste = Math.max(0.3, 1.0 - (p.haste || 0) * 0.12);
    this.speed = this.baseSpeed * (1.0 + (p.boots || 0) * 0.12);
    this.magnetRadius = this.baseMagnet * (1.0 + (p.magnet || 0) * 0.35);
    
    const extraHp = (p.vitality || 0) * 25;
    const prevMax = this.maxHp;
    this.maxHp = this.baseMaxHp + extraHp;
    if (this.maxHp > prevMax) {
      this.hp += (this.maxHp - prevMax);
    }
    this.regen = (p.vitality || 0) * 0.8;
  }
}

// Enemy Types
class Enemy {
  constructor(x, y, type = 'slime', waveScale = 1.0) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.flashTimer = 0;
    this.kbVx = 0;
    this.kbVy = 0;
    this.isDead = false;

    // Type Configurations
    switch (type) {
      case 'slime':
        this.radius = 14;
        this.baseHp = 20 * waveScale;
        this.speed = 85 * (1 + (waveScale - 1) * 0.05);
        this.damage = 10;
        this.expValue = 10;
        this.color = '#00f0ff';
        this.glowColor = 'rgba(0, 240, 255, 0.4)';
        break;
      case 'bat':
        this.radius = 12;
        this.baseHp = 12 * waveScale;
        this.speed = 150 * (1 + (waveScale - 1) * 0.05);
        this.damage = 8;
        this.expValue = 15;
        this.color = '#ff007f';
        this.glowColor = 'rgba(255, 0, 127, 0.4)';
        this.zigZagTimer = Math.random() * 10;
        break;
      case 'golem':
        this.radius = 24;
        this.baseHp = 80 * waveScale;
        this.speed = 55;
        this.damage = 22;
        this.expValue = 40;
        this.color = '#9d4edd';
        this.glowColor = 'rgba(157, 78, 221, 0.5)';
        break;
      case 'boss':
        this.radius = 42;
        this.baseHp = 450 * waveScale;
        this.speed = 70;
        this.damage = 35;
        this.expValue = 250;
        this.color = '#ffd700';
        this.glowColor = 'rgba(255, 215, 0, 0.6)';
        this.isBoss = true;
        break;
    }

    this.maxHp = this.baseHp;
    this.hp = this.maxHp;
  }

  update(dt, player, enemies) {
    if (this.isDead) return;

    // Hit flash
    if (this.flashTimer > 0) {
      this.flashTimer -= dt;
    }

    // Knockback decay
    this.x += this.kbVx * dt;
    this.y += this.kbVy * dt;
    this.kbVx *= Math.pow(0.05, dt);
    this.kbVy *= Math.pow(0.05, dt);

    // Vector toward player
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy);

    let moveX = 0;
    let moveY = 0;

    if (dist > 2) {
      if (this.type === 'bat') {
        this.zigZagTimer += dt * 6;
        const perpX = -dy / dist;
        const perpY = dx / dist;
        const sway = Math.sin(this.zigZagTimer) * 0.7;
        moveX = (dx / dist + perpX * sway);
        moveY = (dy / dist + perpY * sway);
      } else {
        moveX = dx / dist;
        moveY = dy / dist;
      }
    }

    // Separation from other enemies to prevent clump overlapping
    for (let i = 0; i < Math.min(enemies.length, 16); i++) {
      const other = enemies[Math.floor(Math.random() * enemies.length)];
      if (other && other !== this) {
        const sepDx = this.x - other.x;
        const sepDy = this.y - other.y;
        const sepDist = Math.hypot(sepDx, sepDy);
        const minDist = this.radius + other.radius;
        if (sepDist > 0 && sepDist < minDist) {
          const push = (minDist - sepDist) / minDist;
          moveX += (sepDx / sepDist) * push * 0.8;
          moveY += (sepDy / sepDist) * push * 0.8;
        }
      }
    }

    const moveLen = Math.hypot(moveX, moveY);
    if (moveLen > 0) {
      this.x += (moveX / moveLen) * this.speed * dt;
      this.y += (moveY / moveLen) * this.speed * dt;
    }

    // Player touch collision
    if (dist < this.radius + player.radius) {
      if (player.takeDamage(this.damage)) {
        // Player took damage
        audio.playHurt();
        game.triggerScreenShake(8, 0.2);
        game.triggerDamageVignette();
      }
    }
  }

  takeDamage(amount, kbAngle = null, kbForce = 150) {
    this.hp -= amount;
    this.flashTimer = 0.08;

    if (kbAngle !== null && !this.isBoss) {
      this.kbVx = Math.cos(kbAngle) * kbForce;
      this.kbVy = Math.sin(kbAngle) * kbForce;
    }

    if (this.hp <= 0) {
      this.isDead = true;
    }
  }
}

// EXP Gem
class ExpGem {
  constructor(x, y, value = 10) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.radius = value >= 100 ? 10 : (value >= 30 ? 7 : 5);
    this.color = value >= 100 ? '#ffd700' : (value >= 30 ? '#c77dff' : '#00f0ff');
    this.glowColor = value >= 100 ? 'rgba(255, 215, 0, 0.6)' : (value >= 30 ? 'rgba(199, 125, 255, 0.5)' : 'rgba(0, 240, 255, 0.5)');
    this.vx = (Math.random() - 0.5) * 60;
    this.vy = (Math.random() - 0.5) * 60;
    this.isCollected = false;
    this.animTime = Math.random() * 5;
  }

  update(dt, player) {
    if (this.isCollected) return;

    this.animTime += dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vx *= Math.pow(0.1, dt);
    this.vy *= Math.pow(0.1, dt);

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy);

    // Magnet suction
    if (dist < player.magnetRadius) {
      const speed = Math.max(350, (1 - dist / player.magnetRadius) * 650);
      this.x += (dx / dist) * speed * dt;
      this.y += (dy / dist) * speed * dt;
    }

    // Pickup radius
    if (dist < player.radius + this.radius) {
      this.isCollected = true;
      audio.playGem();
      const leveledUp = player.gainExp(this.value);
      game.addScore(this.value);
      if (leveledUp) {
        audio.playLevelUp();
        game.triggerLevelUp();
      }
    }
  }
}

// Projectile
class Projectile {
  constructor(x, y, vx, vy, damage, radius, color, maxLife = 2.0, pierce = 1, onHit = null) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.damage = damage;
    this.radius = radius;
    this.color = color;
    this.maxLife = maxLife;
    this.life = maxLife;
    this.pierce = pierce;
    this.hitEnemies = new Set();
    this.isDead = false;
    this.onHit = onHit;
    this.trailTimer = 0;
  }

  update(dt, enemies) {
    if (this.isDead) return;

    this.life -= dt;
    if (this.life <= 0) {
      this.isDead = true;
      return;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Trail particles
    this.trailTimer += dt;
    if (this.trailTimer > 0.03) {
      this.trailTimer = 0;
      game.addParticle(new Particle(this.x, this.y, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, this.color, this.radius * 0.6, 0.25));
    }

    // Collision check with enemies
    for (const enemy of enemies) {
      if (enemy.isDead || this.hitEnemies.has(enemy)) continue;

      const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
      if (dist < enemy.radius + this.radius) {
        this.hitEnemies.add(enemy);
        
        // Critical hit calculation
        const isCrit = Math.random() < 0.15;
        const finalDmg = isCrit ? Math.floor(this.damage * 1.8) : this.damage;

        const angle = Math.atan2(this.vy, this.vx);
        enemy.takeDamage(finalDmg, angle, 180);
        audio.playHit();

        game.addDamageNumber(new DamageNumber(finalDmg, enemy.x, enemy.y - 12, isCrit));
        game.spawnHitSparks(this.x, this.y, this.color);

        if (this.onHit) {
          this.onHit(this, enemy);
        }

        this.pierce--;
        if (this.pierce <= 0) {
          this.isDead = true;
          break;
        }
      }
    }
  }
}

// Particle
class Particle {
  constructor(x, y, vx, vy, color, size, life = 0.5) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.maxLife = life;
    this.life = life;
  }

  update(dt) {
    this.life -= dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vx *= Math.pow(0.1, dt);
    this.vy *= Math.pow(0.1, dt);
  }
}

// Floating Damage Number
class DamageNumber {
  constructor(amount, x, y, isCrit = false) {
    this.amount = amount;
    this.x = x + (Math.random() - 0.5) * 16;
    this.y = y;
    this.vy = -60 - Math.random() * 30;
    this.vx = (Math.random() - 0.5) * 30;
    this.isCrit = isCrit;
    this.maxLife = 0.6;
    this.life = this.maxLife;
    this.color = isCrit ? '#ff007f' : '#ffffff';
  }

  update(dt) {
    this.life -= dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += 90 * dt; // gravity
  }
}
