// Renderer: Canvas 2D Graphics Engine with Cyberpunk Neon Aesthetic

class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 0, y: 0 };
    this.dpr = window.devicePixelRatio || 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.stars = [];
    this.initStars();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  initStars() {
    this.stars = [];
    for (let i = 0; i < 120; i++) {
      this.stars.push({
        x: (Math.random() - 0.5) * 4000,
        y: (Math.random() - 0.5) * 4000,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? 'rgba(0, 240, 255, 0.4)' : 'rgba(157, 78, 221, 0.4)',
        twinkleSpeed: Math.random() * 3 + 1
      });
    }
  }

  resize() {
    this.dpr = window.devicePixelRatio || 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  render(game) {
    const ctx = this.ctx;
    const player = game.player;

    // Smooth camera tracking
    const targetCamX = player.x - this.width / 2;
    const targetCamY = player.y - this.height / 2;
    this.camera.x += (targetCamX - this.camera.x) * 0.15;
    this.camera.y += (targetCamY - this.camera.y) * 0.15;

    // Apply Screen Shake
    let shakeX = 0;
    let shakeY = 0;
    if (game.shakeTimer > 0) {
      shakeX = (Math.random() - 0.5) * game.shakeIntensity * 2;
      shakeY = (Math.random() - 0.5) * game.shakeIntensity * 2;
    }

    ctx.save();
    ctx.clearRect(0, 0, this.width, this.height);

    // Camera transform
    ctx.translate(-this.camera.x + shakeX, -this.camera.y + shakeY);

    // 1. Render Cyber Grid Background
    this.renderBackground(ctx, game);

    // 2. Render Flame Aura (underneath entities)
    this.renderFlameAura(ctx, player);

    // 3. Render Shockwaves & AOE
    this.renderShockwaves(ctx, game.shockwaves);

    // 4. Render EXP Gems
    this.renderGems(ctx, game.gems);

    // 5. Render Projectiles
    this.renderProjectiles(ctx, game.projectiles);

    // 6. Render Enemies
    this.renderEnemies(ctx, game.enemies);

    // 7. Render Player
    this.renderPlayer(ctx, player);

    // 8. Render Orbital Blades
    this.renderOrbitalBlades(ctx, player);

    // 9. Render Particles
    this.renderParticles(ctx, game.particles);

    // 10. Render Floating Damage Numbers
    this.renderDamageNumbers(ctx, game.damageNumbers);

    ctx.restore();
  }

  renderBackground(ctx, game) {
    const gridSize = 80;
    const startX = Math.floor((this.camera.x - 100) / gridSize) * gridSize;
    const endX = this.camera.x + this.width + 100;
    const startY = Math.floor((this.camera.y - 100) / gridSize) * gridSize;
    const endY = this.camera.y + this.height + 100;

    // Stars / Nebula dust
    const now = performance.now() * 0.001;
    for (const star of this.stars) {
      const alpha = 0.3 + 0.3 * Math.sin(now * star.twinkleSpeed);
      ctx.fillStyle = star.color.replace('0.4', alpha.toFixed(2));
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }

    // Grid lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.07)';
    ctx.beginPath();
    for (let x = startX; x <= endX; x += gridSize) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }
    for (let y = startY; y <= endY; y += gridSize) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }
    ctx.stroke();

    // Minor intersection glow points
    ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
    for (let x = startX; x <= endX; x += gridSize * 2) {
      for (let y = startY; y <= endY; y += gridSize * 2) {
        ctx.fillRect(x - 2, y - 2, 4, 4);
      }
    }
  }

  renderFlameAura(ctx, player) {
    const flameW = player.weapons.find(w => w.id === 'flame_aura');
    if (!flameW) return;

    const r = flameW.auraRadius;
    const grad = ctx.createRadialGradient(player.x, player.y, r * 0.2, player.x, player.y, r);
    grad.addColorStop(0, 'rgba(255, 69, 0, 0.28)');
    grad.addColorStop(0.7, 'rgba(255, 140, 0, 0.15)');
    grad.addColorStop(1, 'rgba(255, 69, 0, 0)');

    ctx.save();
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(player.x, player.y, r, 0, Math.PI * 2);
    ctx.fill();

    // Outer pulsing flame ring
    ctx.strokeStyle = 'rgba(255, 69, 0, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(player.x, player.y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  renderGems(ctx, gems) {
    for (const gem of gems) {
      if (gem.isCollected) continue;

      ctx.save();
      ctx.translate(gem.x, gem.y);

      // Glow halo
      ctx.fillStyle = gem.glowColor;
      ctx.beginPath();
      ctx.arc(0, 0, gem.radius * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Diamond shape
      ctx.fillStyle = gem.color;
      ctx.shadowColor = gem.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(0, -gem.radius);
      ctx.lineTo(gem.radius, 0);
      ctx.lineTo(0, gem.radius);
      ctx.lineTo(-gem.radius, 0);
      ctx.closePath();
      ctx.fill();

      // Core sparkle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, gem.radius * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  renderEnemies(ctx, enemies) {
    for (const enemy of enemies) {
      if (enemy.isDead) continue;

      ctx.save();
      ctx.translate(enemy.x, enemy.y);

      // Hit Flash override
      const isFlashing = enemy.flashTimer > 0;

      // Glow aura
      ctx.fillStyle = isFlashing ? 'rgba(255, 255, 255, 0.6)' : enemy.glowColor;
      ctx.beginPath();
      ctx.arc(0, 0, enemy.radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Draw according to enemy type
      ctx.fillStyle = isFlashing ? '#ffffff' : enemy.color;
      ctx.shadowColor = enemy.color;
      ctx.shadowBlur = enemy.isBoss ? 20 : 10;

      if (enemy.type === 'slime') {
        // Slime Blob
        ctx.beginPath();
        ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2);
        ctx.fill();

        // Eye
        ctx.fillStyle = '#050a14';
        ctx.beginPath();
        ctx.arc(enemy.radius * 0.3, -enemy.radius * 0.2, 3, 0, Math.PI * 2);
        ctx.arc(-enemy.radius * 0.3, -enemy.radius * 0.2, 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (enemy.type === 'bat') {
        // Cyber Drone Bat
        ctx.beginPath();
        ctx.moveTo(0, -enemy.radius);
        ctx.lineTo(enemy.radius * 1.4, enemy.radius);
        ctx.lineTo(0, enemy.radius * 0.5);
        ctx.lineTo(-enemy.radius * 1.4, enemy.radius);
        ctx.closePath();
        ctx.fill();
      } else if (enemy.type === 'golem') {
        // Armored Golem Hexagon
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          const gx = Math.cos(a) * enemy.radius;
          const gy = Math.sin(a) * enemy.radius;
          if (i === 0) ctx.moveTo(gx, gy);
          else ctx.lineTo(gx, gy);
        }
        ctx.closePath();
        ctx.fill();

        // Red Eye Visor
        ctx.fillStyle = '#ff0055';
        ctx.fillRect(-enemy.radius * 0.5, -3, enemy.radius, 6);
      } else if (enemy.type === 'boss') {
        // Golden Cyber Boss
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4;
          const bx = Math.cos(a) * enemy.radius;
          const by = Math.sin(a) * enemy.radius;
          if (i === 0) ctx.moveTo(bx, by);
          else ctx.lineTo(bx, by);
        }
        ctx.closePath();
        ctx.fill();

        // Core Ring
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, enemy.radius * 0.5, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      // Enemy HP Bar (only if damaged or boss)
      if (enemy.hp < enemy.maxHp || enemy.isBoss) {
        const barW = enemy.radius * 2.2;
        const barH = enemy.isBoss ? 8 : 4;
        const barX = enemy.x - barW / 2;
        const barY = enemy.y - enemy.radius - (enemy.isBoss ? 16 : 10);
        const hpPct = Math.max(0, enemy.hp / enemy.maxHp);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(barX, barY, barW, barH);

        ctx.fillStyle = enemy.isBoss ? '#ffd700' : '#ff0055';
        ctx.fillRect(barX, barY, barW * hpPct, barH);
      }
    }
  }

  renderPlayer(ctx, player) {
    if (player.isDead) return;

    ctx.save();
    ctx.translate(player.x, player.y);

    // Invulnerability flashing
    if (player.invulnTimer > 0 && Math.floor(player.invulnTimer * 20) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    // Magnet aura subtle boundary
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, player.magnetRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Outer Glow Ring
    ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
    ctx.beginPath();
    ctx.arc(0, 0, player.radius * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Core Cyber Mech Avatar
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
    ctx.fill();

    // Inner Armor Core
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, 0, player.radius * 0.65, 0, Math.PI * 2);
    ctx.fill();

    // Facing Visor Eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(player.facing * 5, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Player HP Bar above head
    const hpBarW = 44;
    const hpBarH = 6;
    const hpBarX = player.x - hpBarW / 2;
    const hpBarY = player.y - player.radius - 14;
    const hpPct = Math.max(0, player.hp / player.maxHp);

    ctx.fillStyle = 'rgba(10, 15, 30, 0.85)';
    ctx.fillRect(hpBarX - 1, hpBarY - 1, hpBarW + 2, hpBarH + 2);

    ctx.fillStyle = hpPct > 0.4 ? '#00ff88' : (hpPct > 0.2 ? '#ffd700' : '#ff0055');
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 6;
    ctx.fillRect(hpBarX, hpBarY, hpBarW * hpPct, hpBarH);
  }

  renderOrbitalBlades(ctx, player) {
    const orbW = player.weapons.find(w => w.id === 'orbital_blades');
    if (!orbW) return;

    for (let i = 0; i < orbW.orbCount; i++) {
      const orbAngle = orbW.angle + (i * Math.PI * 2) / orbW.orbCount;
      const orbX = player.x + Math.cos(orbAngle) * orbW.orbitRadius;
      const orbY = player.y + Math.sin(orbAngle) * orbW.orbitRadius;

      ctx.save();
      ctx.translate(orbX, orbY);
      ctx.rotate(orbAngle + Math.PI / 2);

      // Energy Shield Orb
      ctx.fillStyle = 'rgba(0, 255, 136, 0.3)';
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();

      // Sharp Energy Blade
      ctx.fillStyle = '#00ff88';
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(8, 10);
      ctx.lineTo(0, 6);
      ctx.lineTo(-8, 10);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }

  renderProjectiles(ctx, projectiles) {
    for (const p of projectiles) {
      if (p.isDead) continue;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;

      // Draw glowing projectile
      ctx.beginPath();
      ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Bright Core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, p.radius * 0.45, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  renderShockwaves(ctx, shockwaves) {
    for (const sw of shockwaves) {
      const alpha = 1 - sw.radius / sw.maxRadius;
      ctx.save();
      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.lineWidth = 3;
      ctx.shadowColor = sw.color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  renderParticles(ctx, particles) {
    for (const p of particles) {
      if (p.life <= 0) continue;
      const alpha = p.life / p.maxLife;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  renderDamageNumbers(ctx, numbers) {
    ctx.save();
    for (const n of numbers) {
      if (n.life <= 0) continue;
      const alpha = n.life / n.maxLife;

      ctx.globalAlpha = alpha;
      ctx.font = n.isCrit ? "bold 18px 'Orbitron', sans-serif" : "bold 14px 'Rajdhani', sans-serif";
      ctx.fillStyle = n.color;
      ctx.shadowColor = n.isCrit ? '#ff007f' : '#00f0ff';
      ctx.shadowBlur = n.isCrit ? 10 : 4;
      ctx.textAlign = 'center';

      const text = n.isCrit ? `⚡${n.amount}!` : `${n.amount}`;
      ctx.fillText(text, n.x, n.y);
    }
    ctx.restore();
  }
}
