// Main Game Loop and State Management

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.renderer = new Renderer(this.canvas);

    // Game State: 'TITLE' | 'PLAYING' | 'LEVEL_UP' | 'PAUSED' | 'GAME_OVER' | 'DEMO' | 'MANUAL'
    this.state = 'TITLE';
    this.isDemoMode = false;
    this.previousStateBeforeManual = 'TITLE';

    // Entities
    this.player = null;
    this.enemies = [];
    this.gems = [];
    this.projectiles = [];
    this.particles = [];
    this.damageNumbers = [];
    this.shockwaves = [];

    // Timers & Progression
    this.gameTime = 0;
    this.kills = 0;
    this.score = 0;
    this.spawnTimer = 0;
    this.bossTimer = 60; // First boss at 60s
    this.demoAutoSelectTimer = 0;
    this.idleTimer = 0;
    this.idleTimeout = 25; // Auto-start demo after 25s of inactivity on title

    // Screen Shake & Effects
    this.shakeTimer = 0;
    this.shakeIntensity = 0;

    // Inputs
    this.keys = {};
    this.touchInput = { x: 0, y: 0, active: false };
    this.mouseDrag = { active: false, startX: 0, startY: 0, curX: 0, curY: 0 };

    // DOM Elements
    this.dom = {
      hudTop: document.getElementById('hud-top'),
      hudLevel: document.getElementById('hud-level'),
      hudExpText: document.getElementById('hud-exp-text'),
      hudExpFill: document.getElementById('hud-exp-fill'),
      hudTime: document.getElementById('hud-time'),
      hudKills: document.getElementById('hud-kills'),
      hudScore: document.getElementById('hud-score'),
      hudInventory: document.getElementById('hud-inventory'),
      vignetteDamage: document.getElementById('vignette-damage'),
      demoOverlay: document.getElementById('demo-overlay'),
      screenTitle: document.getElementById('screen-title'),
      screenLevelup: document.getElementById('screen-levelup'),
      screenPause: document.getElementById('screen-pause'),
      screenGameover: document.getElementById('screen-gameover'),
      screenManual: document.getElementById('screen-manual'),
      upgradeCardsContainer: document.getElementById('upgrade-cards-container'),
      pauseStats: document.getElementById('pause-stats'),
      resTime: document.getElementById('res-time'),
      resLevel: document.getElementById('res-level'),
      resKills: document.getElementById('res-kills'),
      resScore: document.getElementById('res-score'),
      resBuildSummary: document.getElementById('res-build-summary'),
      manualTabContent: document.getElementById('manual-tab-content'),
      manualTabBtns: document.querySelectorAll('.manual-tab-btn'),
      btnStart: document.getElementById('btn-start'),
      btnDemo: document.getElementById('btn-demo'),
      btnDemoPlayNow: document.getElementById('btn-demo-play-now'),
      btnDemoExit: document.getElementById('btn-demo-exit'),
      btnPause: document.getElementById('btn-pause'),
      btnSound: document.getElementById('btn-sound'),
      btnResume: document.getElementById('btn-resume'),
      btnRestartPause: document.getElementById('btn-restart-pause'),
      btnRetry: document.getElementById('btn-retry'),
      btnLangTitle: document.getElementById('btn-lang-title'),
      btnLangHud: document.getElementById('btn-lang-hud'),
      btnLangPause: document.getElementById('btn-lang-pause'),
      labelLangTitle: document.getElementById('label-lang-title'),
      btnManualTitle: document.getElementById('btn-manual-title'),
      btnManualPause: document.getElementById('btn-manual-pause'),
      btnManualClose: document.getElementById('btn-manual-close'),
      btnManualCloseFooter: document.getElementById('btn-manual-close-footer'),
      quickLegend: document.getElementById('quick-legend'),
      legendHeader: document.getElementById('legend-header'),
      btnToggleLegend: document.getElementById('btn-toggle-legend'),
      touchControls: document.getElementById('touch-controls'),
      joystickBase: document.getElementById('joystick-base'),
      joystickStick: document.getElementById('joystick-stick')
    };

    this.activeManualTab = 'overview';
    this.initEvents();
    this.initI18n();

    this.lastTimestamp = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  initI18n() {
    i18n.updateDOM();
    i18n.onChange(() => {
      this.updateLanguageUI();
      if (this.state === 'PAUSED') {
        this.renderPauseStats();
      }
      if (this.state === 'LEVEL_UP') {
        this.renderUpgradeCards();
      }
      if (this.state === 'MANUAL') {
        this.renderManualContent();
      }
      this.updateHUD();
    });
    this.updateLanguageUI();
  }

  updateLanguageUI() {
    const nextLangText = i18n.lang === 'ja' ? 'English' : '日本語';
    if (this.dom.labelLangTitle) this.dom.labelLangTitle.textContent = nextLangText;
    if (this.dom.btnLangPause) this.dom.btnLangPause.textContent = `🌐 ${nextLangText}`;
  }

  toggleLanguage() {
    i18n.toggleLanguage();
  }

  initEvents() {
    const resetIdle = () => {
      this.idleTimer = 0;
    };

    // Keyboard inputs
    window.addEventListener('keydown', (e) => {
      resetIdle();
      this.keys[e.code] = true;

      // In demo mode, any key can switch to manual playing
      if (this.isDemoMode && this.state === 'PLAYING') {
        if (e.code === 'KeyP' || e.code === 'Escape') {
          this.exitDemoMode(true);
          return;
        }
        this.takeOverDemo();
        return;
      }

      if (e.code === 'KeyP' || e.code === 'Escape') {
        if (this.state === 'PLAYING') this.pauseGame();
        else if (this.state === 'PAUSED') this.resumeGame();
        else if (this.state === 'MANUAL') this.closeManual();
      }
      if (e.code === 'KeyM') {
        this.toggleSound();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    window.addEventListener('mousemove', () => resetIdle());
    window.addEventListener('touchstart', () => resetIdle(), { passive: true });

    // UI Buttons
    this.dom.btnStart.addEventListener('click', () => this.startGame(false));
    this.dom.btnDemo.addEventListener('click', () => this.startGame(true));
    this.dom.btnDemoPlayNow.addEventListener('click', () => this.takeOverDemo());
    this.dom.btnDemoExit.addEventListener('click', () => this.exitDemoMode(true));

    this.dom.btnPause.addEventListener('click', () => this.pauseGame());
    this.dom.btnResume.addEventListener('click', () => this.resumeGame());
    this.dom.btnRestartPause.addEventListener('click', () => this.startGame(false));
    this.dom.btnRetry.addEventListener('click', () => this.startGame(false));
    this.dom.btnSound.addEventListener('click', () => this.toggleSound());

    // Language buttons
    this.dom.btnLangTitle.addEventListener('click', () => this.toggleLanguage());
    this.dom.btnLangHud.addEventListener('click', () => this.toggleLanguage());
    this.dom.btnLangPause.addEventListener('click', () => this.toggleLanguage());

    // Manual buttons
    this.dom.btnManualTitle.addEventListener('click', () => this.openManual('TITLE'));
    this.dom.btnManualPause.addEventListener('click', () => this.openManual('PAUSED'));
    this.dom.btnManualClose.addEventListener('click', () => this.closeManual());
    this.dom.btnManualCloseFooter.addEventListener('click', () => this.closeManual());

    // Manual Tab buttons
    this.dom.manualTabBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-tab');
        this.setManualTab(tab);
      });
    });

    // Quick Legend Toggle
    if (this.dom.legendHeader) {
      this.dom.legendHeader.addEventListener('click', () => {
        if (this.dom.quickLegend) {
          this.dom.quickLegend.classList.toggle('collapsed');
        }
      });
    }

    // Mouse drag support
    this.canvas.addEventListener('mousedown', (e) => {
      if (this.isDemoMode && this.state === 'PLAYING') {
        this.takeOverDemo();
        return;
      }
      if (this.state !== 'PLAYING') return;
      this.mouseDrag.active = true;
      this.mouseDrag.startX = e.clientX;
      this.mouseDrag.startY = e.clientY;
      this.mouseDrag.curX = e.clientX;
      this.mouseDrag.curY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.mouseDrag.active) {
        this.mouseDrag.curX = e.clientX;
        this.mouseDrag.curY = e.clientY;
      }
    });

    window.addEventListener('mouseup', () => {
      this.mouseDrag.active = false;
    });

    // Touch support (Virtual Joystick)
    let touchOrigin = { x: 0, y: 0 };
    this.canvas.addEventListener('touchstart', (e) => {
      if (this.isDemoMode && this.state === 'PLAYING') {
        this.takeOverDemo();
        return;
      }
      if (this.state !== 'PLAYING') return;
      const touch = e.touches[0];
      touchOrigin = { x: touch.clientX, y: touch.clientY };
      this.touchInput.active = true;
      this.touchInput.x = 0;
      this.touchInput.y = 0;

      this.dom.touchControls.classList.remove('hidden');
      this.dom.joystickBase.style.display = 'block';
      this.dom.joystickBase.style.left = `${touch.clientX}px`;
      this.dom.joystickBase.style.top = `${touch.clientY}px`;
      this.dom.joystickStick.style.transform = 'translate(-50%, -50%)';
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (!this.touchInput.active) return;
      const touch = e.touches[0];
      const dx = touch.clientX - touchOrigin.x;
      const dy = touch.clientY - touchOrigin.y;
      const dist = Math.hypot(dx, dy);
      const maxRadius = 50;

      if (dist > 0) {
        const clampedDist = Math.min(dist, maxRadius);
        this.touchInput.x = (dx / dist) * (clampedDist / maxRadius);
        this.touchInput.y = (dy / dist) * (clampedDist / maxRadius);

        const stickX = (dx / dist) * clampedDist;
        const stickY = (dy / dist) * clampedDist;
        this.dom.joystickStick.style.transform = `translate(calc(-50% + ${stickX}px), calc(-50% + ${stickY}px))`;
      }
    }, { passive: false });

    window.addEventListener('touchend', () => {
      this.touchInput.active = false;
      this.touchInput.x = 0;
      this.touchInput.y = 0;
      this.dom.joystickBase.style.display = 'none';
    });
  }

  toggleSound() {
    const isMuted = audio.toggleMute();
    this.dom.btnSound.textContent = isMuted ? '🔇' : '🔊';
  }

  startGame(isDemo = false) {
    audio.init();
    audio.startBGM();

    this.isDemoMode = isDemo;

    // Reset game entities
    this.player = new Player(0, 0);
    // Initial weapon
    this.player.weapons.push(new MagicMissileWeapon());
    
    // In demo mode, start with slightly enhanced arsenal for visually captivating showcase
    if (this.isDemoMode) {
      this.player.weapons.push(new OrbitalBladesWeapon());
    }

    this.player.applyStats();

    this.enemies = [];
    this.gems = [];
    this.projectiles = [];
    this.particles = [];
    this.damageNumbers = [];
    this.shockwaves = [];

    this.gameTime = 0;
    this.kills = 0;
    this.score = 0;
    this.spawnTimer = 0;
    this.bossTimer = 60;
    this.shakeTimer = 0;
    this.demoAutoSelectTimer = 0;

    // Switch UI
    this.state = 'PLAYING';
    this.hideAllModals();
    this.dom.hudTop.classList.remove('hidden');

    if (this.isDemoMode) {
      this.dom.demoOverlay.classList.remove('hidden');
    } else {
      this.dom.demoOverlay.classList.add('hidden');
    }

    this.updateHUD();
  }

  takeOverDemo() {
    if (!this.isDemoMode) return;
    this.isDemoMode = false;
    this.dom.demoOverlay.classList.add('hidden');
    // Screen flash to indicate player takeover
    this.triggerScreenShake(4, 0.15);
  }

  exitDemoMode(toTitle = true) {
    this.isDemoMode = false;
    this.dom.demoOverlay.classList.add('hidden');
    if (toTitle) {
      audio.stopBGM();
      this.state = 'TITLE';
      this.hideAllModals();
      this.dom.hudTop.classList.add('hidden');
      this.dom.screenTitle.classList.remove('hidden');
    }
  }

  pauseGame() {
    if (this.state !== 'PLAYING') return;
    this.state = 'PAUSED';
    this.renderPauseStats();
    this.dom.screenPause.classList.remove('hidden');
  }

  resumeGame() {
    if (this.state !== 'PAUSED') return;
    this.state = 'PLAYING';
    this.dom.screenPause.classList.add('hidden');
  }

  openManual(source = 'TITLE') {
    this.previousStateBeforeManual = source;
    this.state = 'MANUAL';
    this.renderManualContent();
    this.dom.screenManual.classList.remove('hidden');
  }

  closeManual() {
    this.dom.screenManual.classList.add('hidden');
    if (this.previousStateBeforeManual === 'PAUSED') {
      this.state = 'PAUSED';
      this.dom.screenPause.classList.remove('hidden');
    } else {
      this.state = 'TITLE';
      this.dom.screenTitle.classList.remove('hidden');
    }
  }

  setManualTab(tabName) {
    this.activeManualTab = tabName;
    this.dom.manualTabBtns.forEach((btn) => {
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    this.renderManualContent();
  }

  renderManualContent() {
    const tab = this.activeManualTab;
    let htmlKey = 'manualOverviewContent';
    if (tab === 'controls') htmlKey = 'manualControlsContent';
    else if (tab === 'weapons') htmlKey = 'manualWeaponsContent';
    else if (tab === 'passives') htmlKey = 'manualPassivesContent';
    else if (tab === 'tips') htmlKey = 'manualTipsContent';

    this.dom.manualTabContent.innerHTML = i18n.t(htmlKey);
  }

  hideAllModals() {
    this.dom.screenTitle.classList.add('hidden');
    this.dom.screenLevelup.classList.add('hidden');
    this.dom.screenPause.classList.add('hidden');
    this.dom.screenGameover.classList.add('hidden');
    this.dom.screenManual.classList.add('hidden');
  }

  triggerLevelUp() {
    this.state = 'LEVEL_UP';
    this.renderUpgradeCards();
    this.dom.screenLevelup.classList.remove('hidden');

    // In demo mode, automatically select after brief delay so viewer can see choices
    if (this.isDemoMode) {
      this.demoAutoSelectTimer = 1.2;
    }
  }

  renderUpgradeCards() {
    const container = this.dom.upgradeCardsContainer;
    container.innerHTML = '';

    const choices = upgradeManager.getAvailableUpgrades(this.player);

    for (const choice of choices) {
      const card = document.createElement('div');
      card.className = `upgrade-card type-${choice.type}`;
      
      const tagClass = choice.isNew ? 'tag-new' : (choice.type === 'weapon' ? 'tag-weapon' : 'tag-passive');
      const tagTextKey = choice.isNew ? 'tagNew' : (choice.type === 'weapon' ? 'tagWeapon' : 'tagPassive');

      card.innerHTML = `
        <div class="card-icon">${choice.icon}</div>
        <span class="card-type-tag ${tagClass}">${i18n.t(tagTextKey)}</span>
        <div class="card-name">${choice.name}</div>
        <div class="card-level">LV ${choice.level}</div>
        <div class="card-desc">${choice.desc}</div>
      `;

      card.addEventListener('click', () => {
        choice.action();
        this.resumeFromLevelUp();
      });

      container.appendChild(card);
    }
  }

  resumeFromLevelUp() {
    this.dom.screenLevelup.classList.add('hidden');
    this.state = 'PLAYING';
    this.updateHUD();
  }

  triggerGameOver() {
    if (this.isDemoMode) {
      // In demo mode, automatically restart run to keep show running
      setTimeout(() => {
        if (this.isDemoMode) {
          this.startGame(true);
        }
      }, 1500);
      return;
    }

    this.state = 'GAME_OVER';
    audio.playGameOver();
    this.dom.vignetteDamage.classList.remove('danger');

    // Fill results modal
    const mins = Math.floor(this.gameTime / 60);
    const secs = Math.floor(this.gameTime % 60);
    this.dom.resTime.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    this.dom.resLevel.textContent = `LV ${this.player.level}`;
    const unit = i18n.t('killsUnit');
    this.dom.resKills.textContent = unit ? `${this.kills} ${unit}` : `${this.kills}`;
    this.dom.resScore.textContent = `${this.score}`;

    // Inventory build list
    const buildSummary = this.dom.resBuildSummary;
    buildSummary.innerHTML = '';
    for (const w of this.player.weapons) {
      const slot = document.createElement('div');
      slot.className = 'inv-slot';
      slot.innerHTML = `<span>${w.icon}</span><span class="slot-lvl">${w.level}</span>`;
      buildSummary.appendChild(slot);
    }
    for (const [pId, pLvl] of Object.entries(this.player.passives)) {
      const pDef = PASSIVES_DEF.find(p => p.id === pId);
      if (pDef) {
        const slot = document.createElement('div');
        slot.className = 'inv-slot';
        slot.innerHTML = `<span>${pDef.icon}</span><span class="slot-lvl">${pLvl}</span>`;
        buildSummary.appendChild(slot);
      }
    }

    this.dom.screenGameover.classList.remove('hidden');
  }

  renderPauseStats() {
    const container = this.dom.pauseStats;
    container.innerHTML = `
      <div style="font-size: 1.1rem; margin-bottom: 12px; color: #8ed6ff;">
        ${i18n.t('mightMult')}: <strong>+${Math.round((this.player.might - 1) * 100)}%</strong> | 
        ${i18n.t('moveSpeed')}: <strong>${Math.round(this.player.speed)}</strong> | 
        ${i18n.t('magnetRange')}: <strong>${Math.round(this.player.magnetRadius)}</strong>
      </div>
    `;
  }

  addScore(pts) {
    this.score += pts;
  }

  triggerScreenShake(intensity = 6, duration = 0.2) {
    this.shakeIntensity = intensity;
    this.shakeTimer = duration;
  }

  triggerDamageVignette() {
    this.dom.vignetteDamage.classList.add('danger');
    setTimeout(() => {
      if (this.player && this.player.hp / this.player.maxHp > 0.3) {
        this.dom.vignetteDamage.classList.remove('danger');
      }
    }, 400);
  }

  addProjectile(p) {
    this.projectiles.push(p);
  }

  addParticle(p) {
    this.particles.push(p);
  }

  addDamageNumber(n) {
    this.damageNumbers.push(n);
  }

  addShockwave(x, y, maxRadius, color) {
    this.shockwaves.push({ x, y, radius: 10, maxRadius, color, speed: maxRadius * 4 });
  }

  spawnHitSparks(x, y, color) {
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 120 + 60;
      this.particles.push(new Particle(x, y, Math.cos(angle) * spd, Math.sin(angle) * spd, color, Math.random() * 3 + 2, 0.2));
    }
  }

  spawnDeathExplosion(x, y, color, isBoss = false) {
    const count = isBoss ? 45 : 16;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 200 + (isBoss ? 100 : 40);
      this.particles.push(new Particle(x, y, Math.cos(angle) * spd, Math.sin(angle) * spd, color, Math.random() * 4 + 2, 0.45));
    }
  }

  getNearestEnemies(x, y, maxRange, count = 1) {
    const targets = this.enemies
      .filter(e => !e.isDead && Math.hypot(e.x - x, e.y - y) <= maxRange)
      .sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y));
    return targets.slice(0, count);
  }

  // AI Autonomous Pilot for Demo Mode
  getDemoInputVector() {
    let avoidX = 0;
    let avoidY = 0;
    const px = this.player.x;
    const py = this.player.y;

    // 1. Repulsion from close enemies (Strong avoidance)
    for (const enemy of this.enemies) {
      if (enemy.isDead) continue;
      const dx = px - enemy.x;
      const dy = py - enemy.y;
      const dist = Math.hypot(dx, dy);
      const safeRadius = enemy.isBoss ? 220 : (enemy.radius + 120);

      if (dist < safeRadius && dist > 1) {
        const weight = Math.pow((safeRadius - dist) / safeRadius, 2) * 2.5;
        avoidX += (dx / dist) * weight;
        avoidY += (dy / dist) * weight;
      }
    }

    // 2. Attraction to nearest EXP gems
    let seekX = 0;
    let seekY = 0;
    let closestDist = Infinity;

    for (const gem of this.gems) {
      if (gem.isCollected) continue;
      const dx = gem.x - px;
      const dy = gem.y - py;
      const dist = Math.hypot(dx, dy);

      if (dist < 400 && dist < closestDist) {
        closestDist = dist;
        seekX = dx / dist;
        seekY = dy / dist;
      }
    }

    // 3. Gentle circular kiting / wander vector if safe
    const angle = this.gameTime * 0.8;
    const wanderX = Math.cos(angle) * 0.4;
    const wanderY = Math.sin(angle) * 0.4;

    // Combine forces
    let totalX = avoidX * 1.6 + seekX * 0.9 + wanderX * 0.3;
    let totalY = avoidY * 1.6 + seekY * 0.9 + wanderY * 0.3;

    const len = Math.hypot(totalX, totalY);
    if (len > 0) {
      totalX /= len;
      totalY /= len;
    }

    return { x: totalX, y: totalY };
  }

  getInputVector() {
    if (this.isDemoMode) {
      return this.getDemoInputVector();
    }

    let ix = 0;
    let iy = 0;

    // WASD / Arrow Keys
    if (this.keys['KeyW'] || this.keys['ArrowUp']) iy -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) iy += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) ix -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) ix += 1;

    // Mouse Drag
    if (this.mouseDrag.active) {
      const mdx = this.mouseDrag.curX - this.mouseDrag.startX;
      const mdy = this.mouseDrag.curY - this.mouseDrag.startY;
      const dist = Math.hypot(mdx, mdy);
      if (dist > 15) {
        ix += mdx / dist;
        iy += mdy / dist;
      }
    }

    // Touch Virtual Joystick
    if (this.touchInput.active) {
      ix += this.touchInput.x;
      iy += this.touchInput.y;
    }

    return { x: ix, y: iy };
  }

  spawnEnemies(dt) {
    this.spawnTimer -= dt;
    this.bossTimer -= dt;

    // Wave scale based on elapsed time (difficulty ramps every minute)
    const waveScale = 1.0 + (this.gameTime / 60) * 0.45;
    const spawnInterval = Math.max(0.2, 1.2 / (1.0 + (this.gameTime / 45) * 0.5));

    // Spawn Boss every 60s
    if (this.bossTimer <= 0) {
      this.bossTimer = 60;
      this.spawnEnemyAtEdge('boss', waveScale * 1.5);
      this.triggerScreenShake(12, 0.5);
    }

    if (this.spawnTimer <= 0) {
      this.spawnTimer = spawnInterval;

      // Decide enemy type distribution based on time
      const rand = Math.random();
      let type = 'slime';
      if (this.gameTime > 45 && rand < 0.25) {
        type = 'golem';
      } else if (this.gameTime > 20 && rand < 0.55) {
        type = 'bat';
      }

      this.spawnEnemyAtEdge(type, waveScale);
    }
  }

  spawnEnemyAtEdge(type, waveScale) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.max(this.renderer.width, this.renderer.height) * 0.65 + 60;
    const sx = this.player.x + Math.cos(angle) * distance;
    const sy = this.player.y + Math.sin(angle) * distance;

    this.enemies.push(new Enemy(sx, sy, type, waveScale));
  }

  update(dt) {
    // Title Idle Timer check (Auto-Demo)
    if (this.state === 'TITLE') {
      this.idleTimer += dt;
      if (this.idleTimer >= this.idleTimeout) {
        this.idleTimer = 0;
        this.startGame(true); // Auto-start demo
      }
      return;
    }

    // Auto level-up handling in Demo mode
    if (this.state === 'LEVEL_UP' && this.isDemoMode) {
      this.demoAutoSelectTimer -= dt;
      if (this.demoAutoSelectTimer <= 0) {
        const cards = this.dom.upgradeCardsContainer.children;
        if (cards.length > 0) {
          const randomIdx = Math.floor(Math.random() * cards.length);
          cards[randomIdx].click();
        } else {
          this.resumeFromLevelUp();
        }
      }
      return;
    }

    if (this.state !== 'PLAYING') return;

    this.gameTime += dt;

    // Shake tick
    if (this.shakeTimer > 0) {
      this.shakeTimer -= dt;
    }

    // Update Player
    const input = this.getInputVector();
    this.player.update(dt, input);

    if (this.player.isDead) {
      this.triggerGameOver();
      return;
    }

    // Low HP danger vignette check
    if (this.player.hp / this.player.maxHp <= 0.3) {
      this.dom.vignetteDamage.classList.add('danger');
    } else {
      this.dom.vignetteDamage.classList.remove('danger');
    }

    // Enemy Spawning
    this.spawnEnemies(dt);

    // Update Enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(dt, this.player, this.enemies);

      if (enemy.isDead) {
        audio.playExplosion();
        this.spawnDeathExplosion(enemy.x, enemy.y, enemy.color, enemy.isBoss);
        this.gems.push(new ExpGem(enemy.x, enemy.y, enemy.expValue));
        this.kills++;
        this.addScore(enemy.expValue * 2);
        this.enemies.splice(i, 1);
      }
    }

    // Update Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.update(dt, this.enemies);
      if (p.isDead) {
        this.projectiles.splice(i, 1);
      }
    }

    // Update EXP Gems
    for (let i = this.gems.length - 1; i >= 0; i--) {
      const gem = this.gems[i];
      gem.update(dt, this.player);
      if (gem.isCollected) {
        this.gems.splice(i, 1);
      }
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update(dt);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update Damage Numbers
    for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
      const n = this.damageNumbers[i];
      n.update(dt);
      if (n.life <= 0) {
        this.damageNumbers.splice(i, 1);
      }
    }

    // Update Shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += sw.speed * dt;
      if (sw.radius >= sw.maxRadius) {
        this.shockwaves.splice(i, 1);
      }
    }

    this.updateHUD();
  }

  updateHUD() {
    if (!this.player) return;

    // Level & EXP
    this.dom.hudLevel.textContent = this.player.level;
    this.dom.hudExpText.textContent = `EXP ${Math.floor(this.player.exp)} / ${this.player.nextExp}`;
    const expPct = Math.min(100, (this.player.exp / this.player.nextExp) * 100);
    this.dom.hudExpFill.style.width = `${expPct}%`;

    // Time (MM:SS)
    const mins = Math.floor(this.gameTime / 60);
    const secs = Math.floor(this.gameTime % 60);
    this.dom.hudTime.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    // Kills & Score
    this.dom.hudKills.textContent = this.kills;
    this.dom.hudScore.textContent = this.score;

    // Inventory Slots
    const inv = this.dom.hudInventory;
    inv.innerHTML = '';
    for (const w of this.player.weapons) {
      const slot = document.createElement('div');
      slot.className = 'inv-slot';
      slot.title = `${w.name} (LV ${w.level})\n${w.description}`;
      slot.innerHTML = `<span>${w.icon}</span><span class="slot-lvl">${w.level}</span>`;
      inv.appendChild(slot);
    }
    for (const [pId, pLvl] of Object.entries(this.player.passives)) {
      const pDef = PASSIVES_DEF.find(p => p.id === pId);
      if (pDef) {
        const slot = document.createElement('div');
        slot.className = 'inv-slot';
        slot.title = `${pDef.getName()} (LV ${pLvl})\n${pDef.getDescription(pLvl)}`;
        slot.innerHTML = `<span>${pDef.icon}</span><span class="slot-lvl">${pLvl}</span>`;
        inv.appendChild(slot);
      }
    }
  }

  gameLoop(timestamp) {
    const dt = Math.min((timestamp - this.lastTimestamp) / 1000, 0.05); // Cap at 50ms to prevent huge skips
    this.lastTimestamp = timestamp;

    this.update(dt);

    if (this.player) {
      this.renderer.render(this);
    }

    requestAnimationFrame((t) => this.gameLoop(t));
  }
}

// Instantiate Game
let game;
window.addEventListener('DOMContentLoaded', () => {
  game = new Game();
});
