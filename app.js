(function(){
  // Drawer open/close
  const drawer = document.getElementById('drawer');
  const drawerOpen = document.getElementById('drawer-open');
  const drawerGrab = document.getElementById('drawer-grab');
  function toggleDrawer() { drawer.classList.toggle('open'); }
  drawerOpen.addEventListener('click', toggleDrawer);
  drawerGrab.addEventListener('click', toggleDrawer);

  // Tabs
  document.querySelectorAll('.drawer-tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.drawer-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      const tab = t.dataset.tab;
      document.querySelectorAll('[data-tab-panel]').forEach(p => {
        const on = p.dataset.tabPanel === tab;
        p.style.display = on ? '' : 'none';
        p.classList.toggle('active', on);
      });
    });
  });

  // Theme icon → drives legacy theme checkbox
  const themeIcon = document.getElementById('theme-icon-btn');
  themeIcon.addEventListener('click', () => {
    const cb = document.getElementById('theme-toggle-btn');
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    const next = cur === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    if (cb) {
      cb.checked = (next === 'dark');
      try { cb.dispatchEvent(new Event('change', { bubbles: true })); } catch(e) {}
    }
    try { localStorage.setItem('neurosync-theme', next); } catch(e) {}
  });

  // Settings icon → open settings modal (legacy showSettingsModal lives in next script)
  const setIcon = document.getElementById('settings-icon-btn');
  setIcon.addEventListener('click', () => {
    if (typeof window.__nsShowSettings === 'function') window.__nsShowSettings();
    else document.getElementById('custom-card').click();  // fallback: same effect
  });

  // Apply saved theme on load
  try {
    const saved = localStorage.getItem('neurosync-theme');
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.setAttribute('data-theme', saved);
      const cb = document.getElementById('theme-toggle-btn');
      if (cb) cb.checked = (saved === 'dark');
    }
  } catch(e) {}

  // Update session-label whenever an interval-card is clicked
  document.querySelectorAll('.interval-card').forEach(card => {
    card.addEventListener('click', () => {
      setTimeout(() => {
        const active = document.querySelector('.interval-card.active');
        if (!active) return;
        const lbl = active.querySelector('.label');
        const val = active.querySelector('.val');
        if (lbl && val) {
          document.getElementById('session-label').textContent =
            lbl.textContent.toLowerCase() + ' · ' + val.textContent;
        }
      }, 20);
    });
  });
})();
(function(){
  // ===== Brainwave bands — based on neuroscience EEG ranges =====
  const BANDS = {
    delta: {
      name: 'Delta',
      color: 'var(--delta)',
      glow: 'var(--delta-glow)',
      hex: '#5B4FE8',
      rangeLabel: '0.5–4 Hz',
      defaultFreq: 2.5,
      mode: 'rest',
      tagline: 'Deep rest & recovery',
      description: 'The slowest brainwaves, dominant during deep dreamless sleep and unconscious states. Associated with restoration, healing, and the release of growth hormones. Use this band during recovery breaks or wind-down sessions — not during focused work.',
      whenToUse: 'Pre-sleep wind-down. Recovery between intense work blocks. Stress decompression after demanding sessions.'
    },
    theta: {
      name: 'Theta',
      color: 'var(--theta)',
      glow: 'var(--theta-glow)',
      hex: '#9B6FE8',
      rangeLabel: '4–8 Hz',
      defaultFreq: 6,
      mode: 'creative',
      tagline: 'Creative flow & insight',
      description: 'Present during deep meditation, the hypnagogic state, and moments of creative breakthrough. Associated with intuition, vivid imagery, and access to subconscious material. Useful for ideation, brainstorming, and exploratory thinking — but can drift into daydreaming if overused for analytical tasks.',
      whenToUse: 'Brainstorming, creative writing, problem-solving that needs lateral thinking, deep reading.'
    },
    alpha: {
      name: 'Alpha',
      color: 'var(--alpha)',
      glow: 'var(--alpha-glow)',
      hex: '#4ECDC4',
      rangeLabel: '8–13 Hz',
      defaultFreq: 10,
      mode: 'focus',
      tagline: 'Calm, alert focus',
      description: 'The "flow state" frequency — present when relaxed but alert, eyes typically closed or in a state of quiet attention. Bridges conscious and subconscious processing. The most commonly recommended band for sustained focus work because it combines calm with cognitive clarity.',
      whenToUse: 'Default focus work. Studying, writing, coding, any sustained cognitive task. The recommended starting point for ADHD focus support.'
    },
    beta: {
      name: 'Beta',
      color: 'var(--beta)',
      glow: 'var(--beta-glow)',
      hex: '#F5A623',
      rangeLabel: '13–30 Hz',
      defaultFreq: 18,
      mode: 'focus-high',
      tagline: 'Active concentration',
      description: 'The waking, thinking, problem-solving band. Higher beta supports analytical thinking and engaged attention but can tip into anxious or scattered cognition if sustained too long. Useful for tasks requiring active engagement — but ADHD brains, which can already over-produce beta, may find alpha more grounding.',
      whenToUse: 'Analytical work, debugging, structured problem-solving, alert reading. Use shorter sessions to avoid overstimulation.'
    },
    gamma: {
      name: 'Gamma',
      color: 'var(--gamma)',
      glow: 'var(--gamma-glow)',
      hex: '#FF6B6B',
      rangeLabel: '30–100 Hz',
      defaultFreq: 40,
      mode: 'peak',
      tagline: 'Peak cognition',
      description: 'The fastest brainwaves, associated with high-level information processing, cross-modal sensory integration, and moments of peak cognitive performance. 40 Hz specifically has been studied in connection with attention and consciousness. Use sparingly — it is most effective in short bursts, not long sessions.',
      whenToUse: 'Short bursts of demanding cognitive integration. Memory consolidation tasks. Short sprints, not long sessions.'
    }
  };

  // ===== Focus Journeys — sequences of bands across 4 rounds =====
  const JOURNEYS = {
    manual: {
      name: 'Manual',
      icon: '◐',
      tagline: 'Pick band yourself',
      description: 'No automatic switching — you control which brainwave band runs each session.',
      sequence: null
    },
    deepwork: {
      name: 'Deep Work',
      icon: '◆',
      tagline: 'Ramp into hyperfocus',
      description: 'Start relaxed in Alpha, build into focused Beta, finish at peak Gamma. Best for demanding analytical tasks where you need to settle in before going hard.',
      sequence: ['alpha', 'beta', 'beta', 'gamma']
    },
    creative: {
      name: 'Creative',
      icon: '✦',
      tagline: 'Ideate, then refine',
      description: 'Open with Theta for divergent ideation, settle into Alpha flow for the bulk of work, finish in Beta to refine and execute. Best for writing, design, and creative problem-solving.',
      sequence: ['theta', 'alpha', 'alpha', 'beta']
    },
    study: {
      name: 'Study',
      icon: '✸',
      tagline: 'Learn, analyze, consolidate',
      description: 'Alpha for intake, Beta for analytical thinking, Theta to let new information settle, Alpha again for review. Designed around learning and retention research.',
      sequence: ['alpha', 'beta', 'theta', 'alpha']
    }
  };

  // ===== State =====
  const STORAGE_KEY = 'neurosync-state-v1';
  const CONFIG_KEY = 'neurosync-config-v1';
  const DUMP_KEY = 'neurosync-dump-v1';

  let cfg = {
    focus: 25, short: 5, long: 20, perCycle: 4,
    band: 'alpha',
    journey: 'manual', // 'manual', 'deepwork', 'creative', 'study'
    customFreq: null, // override BANDS[band].defaultFreq if set
    audioMode: 'off', // 'off', 'binaural', or 'isochronic'
    carrierFreq: 200,
    volume: 25,
    intervalPreset: 'classic',
    // Last user-customized session values — used when "Custom" preset is clicked.
    // Seeded with Classic defaults; updated whenever settings sliders deviate from a preset.
    customFocus: 30, customShort: 5, customLong: 20, customCycle: 4
  };

  let state = {
    mode: 'focus',
    round: 1,
    secondsLeft: 25 * 60,
    totalSeconds: 25 * 60,
    running: false,
    completedToday: 0,
    focusMinutesToday: 0,
    totalEntrainedMinutes: 0,
    streak: 0,
    lastDay: null
  };

  let timerId = null;
  let endTimestamp = null;

  // ===== Storage helpers =====
  function safeSetItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch(e) {
      /* silent — Safari private mode throws QuotaExceededError */
    }
  }

  // stopSafely: disconnect Web Audio nodes without throwing on already-stopped nodes
  function stopSafely(node) {
    try { node.stop(); } catch(e) { /* silent */ }
    try { node.disconnect(); } catch(e) { /* silent */ }
  }

  // ===== Storage =====
  function loadState() {
    try {
      const c = JSON.parse(localStorage.getItem(CONFIG_KEY) || 'null');
      if (c) Object.assign(cfg, c);
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (s) {
        state.completedToday = s.completedToday || 0;
        state.focusMinutesToday = s.focusMinutesToday || 0;
        state.totalEntrainedMinutes = s.totalEntrainedMinutes || 0;
        state.streak = s.streak || 0;
        state.lastDay = s.lastDay || null;
      }
    } catch(e) { /* silent — parse error or storage unavailable */ }

    const today = new Date().toDateString();
    if (state.lastDay !== today) {
      if (state.lastDay) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (state.lastDay !== yesterday) state.streak = 0;
      }
      state.completedToday = 0;
      state.focusMinutesToday = 0;
      state.lastDay = today;
    }
    state.totalSeconds = cfg.focus * 60;
    state.secondsLeft = state.totalSeconds;
  }

  function saveState() {
    safeSetItem(STORAGE_KEY, JSON.stringify({
      completedToday: state.completedToday,
      focusMinutesToday: state.focusMinutesToday,
      totalEntrainedMinutes: state.totalEntrainedMinutes,
      streak: state.streak,
      lastDay: state.lastDay
    }));
  }

  function saveConfig() {
    safeSetItem(CONFIG_KEY, JSON.stringify(cfg));
  }

  // ===== Helpers =====
  function fmt(s) {
    if (s < 0) s = 0;
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function effectiveBand() {
    const j = JOURNEYS[cfg.journey];
    if (j && j.sequence) {
      const idx = Math.min(state.round - 1, j.sequence.length - 1);
      return j.sequence[idx];
    }
    return cfg.band;
  }

  function currentBand() { return BANDS[effectiveBand()]; }
  function currentFreq() { return cfg.customFreq || currentBand().defaultFreq; }

  function applyBandTheme() {
    const b = currentBand();
    document.documentElement.style.setProperty('--accent', b.color);
    document.documentElement.style.setProperty('--accent-glow', b.glow);
  }

  // ===== Render =====
  function render() {
    document.getElementById('time-display').textContent = fmt(state.secondsLeft);
    document.title = (state.running ? fmt(state.secondsLeft) + ' · ' : '') + 'NeuroFocus';

    document.querySelectorAll('.mode-switch-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.mode === state.mode);
    });
    document.getElementById('round-display').textContent = state.round + '/' + cfg.perCycle;

    const b = currentBand();
    document.getElementById('freq-readout').textContent =
      b.name.toLowerCase() + ' · soft';

    document.getElementById('session-counter').textContent =
      (state.completedToday + 1);

    // Ring progress
    const ring = document.getElementById('ring-progress');
    const pct = state.totalSeconds > 0 ? state.secondsLeft / state.totalSeconds : 0;
    ring.setAttribute('stroke-dashoffset', String(804.25 * (1 - pct)));

    // Play/pause icon swap + side controls visibility
    const runControls = document.getElementById('run-controls');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const pauseBtn = document.getElementById('pause-btn');
    if (state.running) {
      runControls.classList.add('running');
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
      pauseBtn.setAttribute('aria-label', 'Pause');
    } else {
      runControls.classList.remove('running');
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      const fresh = state.secondsLeft === state.totalSeconds;
      pauseBtn.setAttribute('aria-label', fresh ? 'Start' : 'Resume');
    }

    // Live indicator
    document.getElementById('live-indicator').classList.toggle('on', state.running);

    // Stats
    document.getElementById('stat-today').textContent = state.completedToday;
    document.getElementById('stat-minutes').textContent = state.focusMinutesToday;
    document.getElementById('stat-streak').textContent = state.streak;
    document.getElementById('stat-total').textContent = state.totalEntrainedMinutes;

    // Wave vis active state
    // Background wave active state
    document.getElementById('bg-wave').classList.toggle('active', state.running);
  }

  // ===== Band selector UI =====
  function renderBandSelector() {
    const sel = document.getElementById('band-selector');
    sel.innerHTML = '';
    const eff = effectiveBand();
    Object.entries(BANDS).forEach(([key, band]) => {
      const pill = document.createElement('button');
      pill.className = 'band-pill' + (key === eff ? ' active' : '');
      pill.innerHTML =
        '<span class="band-dot" style="background:' + band.hex + '"></span>' +
        '<span class="band-name">' + band.name + '</span>' +
        '<span class="band-hz">' + band.rangeLabel + '</span>';
      pill.onclick = () => selectBand(key);
      sel.appendChild(pill);
    });
    requestAnimationFrame(() => {
      updateBandSelectorFades();
      scrollActiveBandIntoView();
    });
  }

  function renderJourneyBar() {
    const bar = document.getElementById('journey-bar');
    bar.innerHTML = '';
    Object.entries(JOURNEYS).forEach(([key, j]) => {
      const btn = document.createElement('button');
      btn.className = 'journey-btn' + (key === cfg.journey ? ' active' : '');
      btn.innerHTML =
        '<span class="icon">' + j.icon + '</span>' +
        '<span class="label">' + j.name + '</span>';
      btn.onclick = () => selectJourney(key);
      bar.appendChild(btn);
    });
  }

  function renderJourneyTimeline() {
    const el = document.getElementById('journey-timeline');
    const wrap = document.getElementById('band-selector-wrap');
    const j = JOURNEYS[cfg.journey];

    if (!j || !j.sequence) {
      // Manual mode — hide timeline, show band selector
      el.classList.add('hidden');
      wrap.classList.remove('hidden');
      el.innerHTML = '';
      return;
    }

    // Journey mode — show timeline, hide band selector
    el.classList.remove('hidden');
    wrap.classList.add('hidden');
    el.innerHTML = '';

    j.sequence.forEach((bandKey, idx) => {
      const band = BANDS[bandKey];
      const stage = document.createElement('div');
      let cls = 'timeline-stage';
      if (idx + 1 === state.round) cls += ' current';
      else if (idx + 1 < state.round) cls += ' done';
      stage.className = cls;

      // Connector line (extends to next stage)
      const connector = document.createElement('div');
      connector.className = 'timeline-connector';
      stage.appendChild(connector);

      // Node circle with stage number
      const node = document.createElement('div');
      node.className = 'timeline-node';
      node.style.borderColor = band.hex;
      if (idx + 1 === state.round) {
        node.style.background = band.hex;
      }
      node.textContent = (idx + 1);
      stage.appendChild(node);

      // Label (band name)
      const label = document.createElement('div');
      label.className = 'timeline-label';
      label.textContent = band.name;
      stage.appendChild(label);

      // Hz value
      const hz = document.createElement('div');
      hz.className = 'timeline-hz';
      hz.textContent = band.defaultFreq + ' Hz';
      stage.appendChild(hz);

      el.appendChild(stage);
    });
  }

  function selectJourney(key) {
    cfg.journey = key;
    saveConfig();
    applyBandTheme();
    renderJourneyBar();
    renderBandSelector();
    renderJourneyTimeline();
    drawWave();
    if (state.running && cfg.audioMode !== 'off') {
      updateEntrainment();
    }
    render();
  }

  function selectBand(key) {
    if (cfg.band === key) {
      // Tap active band → open info modal
      showBandModal(key);
      return;
    }
    cfg.band = key;
    cfg.customFreq = null;
    saveConfig();
    applyBandTheme();
    renderBandSelector();
    drawWave();
    if (state.running && cfg.audioMode !== 'off') {
      updateEntrainment();
    }
    render();
  }

  function updateBandSelectorFades() {
    const wrap = document.getElementById('band-selector-wrap');
    const sel = document.getElementById('band-selector');
    if (!wrap || !sel) return;
    const atStart = sel.scrollLeft <= 4;
    const atEnd = sel.scrollLeft + sel.clientWidth >= sel.scrollWidth - 4;
    wrap.classList.toggle('at-start', atStart);
    wrap.classList.toggle('at-end', atEnd);
  }

  function scrollActiveBandIntoView() {
    const sel = document.getElementById('band-selector');
    const active = sel.querySelector('.band-pill.active');
    if (!active) return;
    const selRect = sel.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    if (activeRect.left < selRect.left + 20 || activeRect.right > selRect.right - 20) {
      active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  // ===== Wave visualization (fullscreen sin + cos) =====
  let waveAnimId = null;
  let wavePhase = 0;
  let waveViewport = { w: window.innerWidth, h: window.innerHeight };

  function buildWavePath(phase, isCos) {
    const freq = currentFreq();
    const w = waveViewport.w;
    const h = waveViewport.h;
    const centerY = h / 2;
    // Number of visible wave cycles across the full width — scaled by frequency
    // Slower bands → fewer cycles (longer wavelength), faster bands → more cycles
    const cycles = Math.max(1.5, Math.min(8, freq / 5));
    const samples = Math.max(60, Math.floor(w / 12));
    const amplitude = Math.min(h * 0.18, 120); // cap amplitude
    const offset = isCos ? Math.PI / 2 : 0;
    const points = [];
    for (let i = 0; i <= samples; i++) {
      const x = (i / samples) * w;
      const t = (i / samples) * Math.PI * 2 * cycles + phase + offset;
      const y = centerY - Math.sin(t) * amplitude;
      points.push(x.toFixed(1) + ',' + y.toFixed(1));
    }
    return 'M ' + points.join(' L ');
  }

  function drawWave() {
    const sinPath = document.getElementById('bg-wave-sin');
    const cosPath = document.getElementById('bg-wave-cos');
    const svg = document.getElementById('bg-wave-svg');
    if (!sinPath || !cosPath || !svg) return;
    // Update viewBox to current viewport
    svg.setAttribute('viewBox', `0 0 ${waveViewport.w} ${waveViewport.h}`);
    sinPath.setAttribute('d', buildWavePath(wavePhase, false));
    cosPath.setAttribute('d', buildWavePath(wavePhase, true));
    const c = currentBand().hex;
    sinPath.style.color = c;
    cosPath.style.color = c;
  }

  function startWaveAnimation() {
    if (waveAnimId !== null) return;
    let last = performance.now();
    function step(now) {
      const dt = (now - last) / 1000;
      last = now;
      // Slower phase advance — full screen waves should move calmly
      const speed = Math.min(1.5, 0.3 + currentFreq() * 0.025);
      wavePhase += dt * speed * Math.PI * 2;
      drawWave();
      waveAnimId = requestAnimationFrame(step);
    }
    waveAnimId = requestAnimationFrame(step);
  }

  function stopWaveAnimation() {
    if (waveAnimId !== null) {
      cancelAnimationFrame(waveAnimId);
      waveAnimId = null;
    }
    drawWave();
  }

  // Handle viewport resize
  function handleWaveResize() {
    waveViewport.w = window.innerWidth;
    waveViewport.h = window.innerHeight;
    drawWave();
  }
  window.addEventListener('resize', handleWaveResize);
  window.addEventListener('orientationchange', handleWaveResize);

  // ===== Audio engine =====
  let audioCtx = null;
  function getAudio() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch(e) { console.warn('[neurosync] AudioContext creation failed:', e); }
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(function(e) { /* silent */ });
    return audioCtx;
  }

  // One-time listener to resume AudioContext on first user gesture (autoplay policy fix)
  function resumeAudioOnGesture() {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(function(e) { /* silent */ });
    }
  }
  document.addEventListener('click', resumeAudioOnGesture, { once: true, passive: true });
  document.addEventListener('keydown', resumeAudioOnGesture, { once: true, passive: true });

  // Soft click sounds for transitions
  function playClick(freq, duration, volume) {
    const ctx = getAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }
  function playStart() { playClick(440, 0.12, 0.06); }
  function playComplete() {
    playClick(523, 0.1, 0.08);
    setTimeout(() => playClick(784, 0.18, 0.08), 130);
  }

  // ===== Brainwave entrainment engine =====
  // Two oscillator nodes for binaural beats; one panned hard left, one hard right.
  // For isochronic: a single oscillator gated by an LFO at the entrainment freq.
  let entrainNodes = null;

  function startEntrainment() {
    const ctx = getAudio();
    if (!ctx || entrainNodes) return;

    const beatFreq = currentFreq();
    const carrier = cfg.carrierFreq;
    const volTarget = (cfg.volume / 100) * (masterVolume / 100) * 0.18; // cap at 18% pre-master

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(volTarget, ctx.currentTime + 1.5);
    masterGain.connect(ctx.destination);

    if (cfg.audioMode === 'binaural') {
      // Two carriers, slight frequency difference = perceived beat
      const oscL = ctx.createOscillator();
      const oscR = ctx.createOscillator();
      oscL.type = 'sine';
      oscR.type = 'sine';
      oscL.frequency.value = carrier - beatFreq / 2;
      oscR.frequency.value = carrier + beatFreq / 2;

      const merger = ctx.createChannelMerger(2);
      const gainL = ctx.createGain();
      const gainR = ctx.createGain();
      gainL.gain.value = 0.5;
      gainR.gain.value = 0.5;

      oscL.connect(gainL).connect(merger, 0, 0);
      oscR.connect(gainR).connect(merger, 0, 1);
      merger.connect(masterGain);

      oscL.start();
      oscR.start();
      entrainNodes = { mode: 'binaural', oscL, oscR, gainL, gainR, masterGain };
    } else {
      // Isochronic: single carrier, amplitude-modulated at beat frequency
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = carrier;

      const ampGain = ctx.createGain();
      ampGain.gain.value = 0.5; // base; LFO modulates from 0 → 1

      // LFO: square-ish wave (we use sine + threshold via WaveShaper-like trick)
      // Simpler approach: use a sine LFO scaled to [0, 1]
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = beatFreq;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.5; // depth of modulation
      lfo.connect(lfoGain).connect(ampGain.gain);

      osc.connect(ampGain).connect(masterGain);
      osc.start();
      lfo.start();
      entrainNodes = { mode: 'isochronic', osc, lfo, lfoGain, ampGain, masterGain };
    }
  }

  function stopEntrainment() {
    if (!entrainNodes) return;
    const ctx = getAudio();
    if (!ctx) { entrainNodes = null; return; }

    const m = entrainNodes.masterGain;
    m.gain.cancelScheduledValues(ctx.currentTime);
    m.gain.setValueAtTime(m.gain.value, ctx.currentTime);
    m.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);

    const nodes = entrainNodes;
    setTimeout(() => {
      if (nodes.mode === 'binaural') {
        stopSafely(nodes.oscL); stopSafely(nodes.oscR);
        stopSafely(nodes.gainL); stopSafely(nodes.gainR);
      } else {
        stopSafely(nodes.osc); stopSafely(nodes.lfo);
        stopSafely(nodes.lfoGain); stopSafely(nodes.ampGain);
      }
      stopSafely(nodes.masterGain);
    }, 900);
    entrainNodes = null;
  }

  function updateEntrainment() {
    // Restart cleanly when band/mode/carrier changes; smooth volume on the fly
    const ctx = getAudio();
    if (!ctx) return;

    if (entrainNodes) {
      const volTarget = (cfg.volume / 100) * (masterVolume / 100) * 0.18;
      entrainNodes.masterGain.gain.linearRampToValueAtTime(
        volTarget, ctx.currentTime + 0.3
      );

      const beatFreq = currentFreq();
      const carrier = cfg.carrierFreq;
      if (entrainNodes.mode === 'binaural') {
        entrainNodes.oscL.frequency.linearRampToValueAtTime(
          carrier - beatFreq / 2, ctx.currentTime + 0.3
        );
        entrainNodes.oscR.frequency.linearRampToValueAtTime(
          carrier + beatFreq / 2, ctx.currentTime + 0.3
        );
      } else {
        entrainNodes.osc.frequency.linearRampToValueAtTime(
          carrier, ctx.currentTime + 0.3
        );
        entrainNodes.lfo.frequency.linearRampToValueAtTime(
          beatFreq, ctx.currentTime + 0.3
        );
      }
    }
  }

  function syncEntrainment() {
    const shouldPlay = cfg.audioMode !== 'off' && state.running && state.mode === 'focus';
    if (shouldPlay && !entrainNodes) startEntrainment();
    else if (!shouldPlay && entrainNodes) stopEntrainment();
  }

  // ===== Tab visibility — drift correction, battery save =====
  let hiddenAt = null;

  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      // Tab going hidden
      hiddenAt = Date.now();
      // Pause Web Audio to save battery
      if (audioCtx && audioCtx.state === 'running') {
        audioCtx.suspend().catch(function(e) { /* silent */ });
      }
      // Pause wave RAF
      if (state.running) stopWaveAnimation();
    } else {
      // Tab becoming visible again
      if (hiddenAt !== null && state.running && endTimestamp !== null) {
        // endTimestamp was set before hide and is still valid — no adjustment needed
        // because endTimestamp is an absolute wall-clock value; tick() will recalculate
        // correctly. We only need to fire immediately if time already expired.
        const remaining = Math.round((endTimestamp - Date.now()) / 1000);
        if (remaining <= 0) {
          state.secondsLeft = 0;
          complete(true);
        }
      }
      hiddenAt = null;
      // Resume Web Audio
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(function(e) { /* silent */ });
      }
      // Restart wave animation if timer is running
      if (state.running) startWaveAnimation();
    }
  });

  // ===== Timer logic =====
  let lastEntrainmentTickSec = 0;

  function tick() {
    if (!state.running || endTimestamp === null) return;
    const remaining = Math.round((endTimestamp - Date.now()) / 1000);

    // Clamp to 0 and fire completion if tab woke after end time already passed
    if (remaining <= 0) {
      state.secondsLeft = 0;
      complete(true);
      return;
    }

    state.secondsLeft = remaining;

    // Track entrainment minutes
    if (cfg.audioMode !== 'off' && state.mode === 'focus' && entrainNodes) {
      const elapsed = state.totalSeconds - state.secondsLeft;
      if (elapsed - lastEntrainmentTickSec >= 60) {
        state.totalEntrainedMinutes += 1;
        lastEntrainmentTickSec = elapsed;
        saveState();
      }
    }

    render();
  }

  function start() {
    if (state.running) {
      pause();
      return;
    }
    state.running = true;
    endTimestamp = Date.now() + state.secondsLeft * 1000;
    timerId = setInterval(tick, 250);
    lastEntrainmentTickSec = state.totalSeconds - state.secondsLeft;
    playStart();
    syncEntrainment();
    startWaveAnimation();
    render();
  }

  function pause() {
    state.running = false;
    clearInterval(timerId);
    timerId = null;
    endTimestamp = null;
    syncEntrainment();
    stopWaveAnimation();
    render();
  }

  function complete(full) {
    state.running = false;
    clearInterval(timerId);
    timerId = null;
    endTimestamp = null;

    if (state.mode === 'focus') {
      const minutesDone = full
        ? Math.round(state.totalSeconds / 60)
        : Math.round((state.totalSeconds - state.secondsLeft) / 60);

      if (full || minutesDone >= 5) {
        state.completedToday++;
        state.focusMinutesToday += minutesDone;
        if (state.completedToday === 1) state.streak++;
        saveState();
        if (full) playComplete();
      }

      const isLongBreak = state.round >= cfg.perCycle;
      state.mode = isLongBreak ? 'long' : 'short';
      state.totalSeconds = (isLongBreak ? cfg.long : cfg.short) * 60;
      state.secondsLeft = state.totalSeconds;
      if (isLongBreak) state.round = 1; else state.round++;
    } else {
      state.mode = 'focus';
      state.totalSeconds = cfg.focus * 60;
      state.secondsLeft = state.totalSeconds;
    }

    // If running a journey, the effective band may have changed
    if (cfg.journey !== 'manual') {
      applyBandTheme();
      renderBandSelector();
      renderJourneyTimeline();
      drawWave();
    }

    syncEntrainment();
    stopWaveAnimation();
    render();
  }

  function reset() {
    state.running = false;
    clearInterval(timerId);
    timerId = null;
    endTimestamp = null;
    state.mode = 'focus';
    state.round = 1;
    state.totalSeconds = cfg.focus * 60;
    state.secondsLeft = state.totalSeconds;
    if (cfg.journey !== 'manual') {
      applyBandTheme();
      renderBandSelector();
      renderJourneyTimeline();
      drawWave();
    }
    syncEntrainment();
    stopWaveAnimation();
    render();
  }

  // SVG markup for the entrainment button — contextual: shows the current mode's icon
  const ENTRAINMENT_ICONS = {
    off:        '<line x1="3" y1="10" x2="3" y2="14"/><line x1="7" y1="6" x2="7" y2="18"/><line x1="11" y1="9" x2="11" y2="15"/><line x1="15" y1="4" x2="15" y2="20"/><line x1="19" y1="8" x2="19" y2="16"/><line x1="22" y1="11" x2="22" y2="13"/>',
    binaural:   '<path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1v-7h3v5zM3 19a2 2 0 002 2h1v-7H3v5z"/>',
    isochronic: '<line x1="3" y1="12" x2="6" y2="12"/><line x1="9" y1="6" x2="9" y2="18"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="15" y1="6" x2="15" y2="18"/><line x1="18" y1="9" x2="18" y2="15"/><line x1="21" y1="12" x2="21" y2="12"/>'
  };

  function updateAudioBarUI() {
    document.querySelectorAll('.entrain-item').forEach(b => {
      b.classList.toggle('active', b.dataset.audioMode === cfg.audioMode);
    });
    updateMixerActiveStates();
  }

  // Update mixer fader channel active states based on current playing layers
  function updateMixerActiveStates() {
    const bw = document.querySelector('.fader-channel[data-channel="brainwave"]');
    const nat = document.querySelector('.fader-channel[data-channel="nature"]');
    const rad = document.querySelector('.fader-channel[data-channel="radio"]');
    if (bw) bw.classList.toggle('active', cfg.audioMode !== 'off');
    if (nat) nat.classList.toggle('active', activeNature !== null);
    if (rad) rad.classList.toggle('active', radioCurrentId !== null);
  }

  // ===== Brain dump =====
  // In-memory cache — parsed once on load, stringified only on save
  let dumpItems = [];
  try { dumpItems = JSON.parse(localStorage.getItem(DUMP_KEY) || '[]'); } catch(e) { /* silent */ }

  function saveDump() {
    safeSetItem(DUMP_KEY, JSON.stringify(dumpItems));
  }

  // ===== Drag & crumple thought items =====
  let dragState = null;

  function getEventPoint(e) {
    if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    if (e.changedTouches && e.changedTouches[0]) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }

  function startDrag(e, sourceEl, idx, text) {
    e.preventDefault();
    const point = getEventPoint(e);
    const rect = sourceEl.getBoundingClientRect();

    // Build floating ghost
    const ghost = document.createElement('div');
    ghost.className = 'dump-ghost';
    ghost.textContent = text;
    ghost.style.width = rect.width + 'px';
    ghost.style.left = rect.left + 'px';
    ghost.style.top = rect.top + 'px';
    ghost.style.zIndex = '200';
    document.body.appendChild(ghost);

    // Mark source as being dragged
    sourceEl.classList.add('dragging-source');

    // Show trash zone
    const trash = document.getElementById('trash-zone');
    trash.classList.add('show');

    dragState = {
      idx, text, ghost, sourceEl,
      offsetX: point.x - rect.left,
      offsetY: point.y - rect.top,
      startX: point.x,
      startY: point.y,
      moved: false,
      overTrash: false,
      // Store bound handler refs so cleanup in onDragEnd is idempotent
      _onMove: onDragMove,
      _onEnd: onDragEnd
    };

    // Lift effect after short delay if held still
    requestAnimationFrame(() => {
      if (dragState && dragState.ghost) {
        dragState.ghost.style.transform = 'scale(1.05) rotate(-1.5deg)';
      }
    });

    document.addEventListener('mousemove', dragState._onMove);
    document.addEventListener('mouseup', dragState._onEnd);
    document.addEventListener('touchmove', dragState._onMove, { passive: false });
    document.addEventListener('touchend', dragState._onEnd);
    document.addEventListener('touchcancel', dragState._onEnd);
  }

  function onDragMove(e) {
    if (!dragState) return;
    e.preventDefault();
    const point = getEventPoint(e);
    const dx = Math.abs(point.x - dragState.startX);
    const dy = Math.abs(point.y - dragState.startY);
    if (!dragState.moved && (dx > 4 || dy > 4)) dragState.moved = true;

    dragState.ghost.style.left = (point.x - dragState.offsetX) + 'px';
    dragState.ghost.style.top = (point.y - dragState.offsetY) + 'px';

    // Check if over trash zone
    const trash = document.getElementById('trash-zone');
    const trashRect = trash.getBoundingClientRect();
    const inTrash = point.x >= trashRect.left && point.x <= trashRect.right
                 && point.y >= trashRect.top && point.y <= trashRect.bottom;

    if (inTrash !== dragState.overTrash) {
      dragState.overTrash = inTrash;
      trash.classList.toggle('active', inTrash);
      dragState.ghost.classList.toggle('over-trash', inTrash);
    }
  }

  function onDragEnd(e) {
    if (!dragState) return;
    // Use stored named refs for idempotent cleanup — run first so listeners
    // are gone even if the body below throws.
    document.removeEventListener('mousemove', dragState._onMove);
    document.removeEventListener('mouseup', dragState._onEnd);
    document.removeEventListener('touchmove', dragState._onMove);
    document.removeEventListener('touchend', dragState._onEnd);
    document.removeEventListener('touchcancel', dragState._onEnd);

    const _ds = dragState;
    dragState = null; // null first — if anything below throws, state is clean
    const { ghost, sourceEl, idx, overTrash, moved } = _ds;
    const trash = document.getElementById('trash-zone');

    if (overTrash && moved) {
      // Crumple animation, then remove
      ghost.classList.add('crumpling');
      // Reset transform overrides so animation runs from current state
      playCrumpleSound();

      setTimeout(() => {
        if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost);
        // Collapse the source row before re-rendering
        sourceEl.classList.add('collapsing');
        setTimeout(() => {
          removeDumpItem(idx);
          trash.classList.remove('show', 'active');
        }, 220);
      }, 540);
    } else {
      // Cancelled — fly ghost back to source then clean up
      const rect = sourceEl.getBoundingClientRect();
      ghost.style.transition = 'left 0.25s ease, top 0.25s ease, transform 0.25s ease';
      ghost.style.left = rect.left + 'px';
      ghost.style.top = rect.top + 'px';
      ghost.style.transform = 'scale(1) rotate(0deg)';
      setTimeout(() => {
        if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
        sourceEl.classList.remove('dragging-source');
        trash.classList.remove('show', 'active');
      }, 270);
    }
  }

  // Cached crumple noise buffer — built once, reused on subsequent calls
  let crumpleNoiseBuffer = null;

  // Soft "crumple" sound — short noise burst with downward sweep
  function playCrumpleSound() {
    const ctx = getAudio();
    if (!ctx) return;
    const duration = 0.35;

    // Build buffer once and cache it
    if (!crumpleNoiseBuffer) {
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      crumpleNoiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = crumpleNoiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const t = i / bufferSize;
        // Decaying noise with crackle texture
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.5) * (0.4 + 0.6 * Math.random());
      }
    }

    const noise = ctx.createBufferSource();
    noise.buffer = crumpleNoiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + duration);
    filter.Q.value = 1.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start();
    noise.stop(ctx.currentTime + duration);
  }

  function renderDump() {
    const list = document.getElementById('dump-list');
    const empty = document.getElementById('dump-empty');
    list.innerHTML = '';
    const items = dumpItems;
    empty.style.display = items.length ? 'none' : 'block';
    items.forEach((item, idx) => {
      const li = document.createElement('li');
      li.className = 'dump-item';
      li.dataset.idx = idx;

      const handle = document.createElement('div');
      handle.className = 'drag-handle';
      handle.innerHTML = '⋮⋮';
      handle.title = 'Drag to crumple';

      const span = document.createElement('span');
      span.textContent = item;

      const btn = document.createElement('button');
      btn.textContent = '×';
      btn.title = 'Remove thought';
      btn.setAttribute('aria-label', 'Remove thought');
      btn.onclick = (e) => {
        e.stopPropagation();
        removeDumpItem(idx);
      };

      li.appendChild(handle);
      li.appendChild(span);
      li.appendChild(btn);
      list.appendChild(li);

      // Bind drag start on mousedown / touchstart anywhere on the item except button
      li.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        startDrag(e, li, idx, item);
      });
      li.addEventListener('touchstart', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        startDrag(e, li, idx, item);
      }, { passive: false });
    });
  }

  function removeDumpItem(idx) {
    dumpItems.splice(idx, 1);
    saveDump();
    renderDump();
  }

  function addDump() {
    const input = document.getElementById('dump-input');
    const val = input.value.trim();
    if (!val) return;
    dumpItems.push(val);
    saveDump();
    input.value = '';
    renderDump();
  }

  // ===== Modal =====
  function showBandModal(key) {
    const b = BANDS[key];
    const content = document.getElementById('modal-content');
    content.innerHTML =
      '<h2><span class="band-dot" style="background:' + b.hex + '; width:12px; height:12px;"></span>' + b.name + ' waves</h2>' +
      '<p class="modal-hz">' + b.rangeLabel + ' · default ' + b.defaultFreq + ' Hz · ' + b.tagline + '</p>' +
      '<h3>What it is</h3>' +
      '<p>' + b.description + '</p>' +
      '<h3>When to use</h3>' +
      '<p>' + b.whenToUse + '</p>';
    document.getElementById('modal-overlay').classList.add('show');
  }

  function showAboutModal() {
    const content = document.getElementById('modal-content');
    content.innerHTML =
      '<h2>About brainwave entrainment</h2>' +
      '<p class="modal-hz">A brief, honest overview</p>' +
      '<h3>What it does</h3>' +
      '<p>Brainwave entrainment plays rhythmic audio at frequencies that correspond to natural EEG bands. The theory — sometimes called "frequency following response" — is that the brain may synchronize its own electrical rhythms toward the audio stimulus, gently shifting mental state.</p>' +
      '<h3>What the research says</h3>' +
      '<p>Studies show modest effects on attention, relaxation, and cognitive performance, with significant variation between individuals. It is most accurately described as an ambient focus aid, comparable to brown noise — not a clinical treatment for ADHD or any condition.</p>' +
      '<h3>The five bands</h3>' +
      '<p><strong>Delta</strong> (0.5–4 Hz) — deep rest. <strong>Theta</strong> (4–8 Hz) — creative, meditative. <strong>Alpha</strong> (8–13 Hz) — calm focus, the recommended starting point. <strong>Beta</strong> (13–30 Hz) — active concentration. <strong>Gamma</strong> (30+ Hz) — peak cognition, short bursts only.</p>' +
      '<h3>Focus Journeys</h3>' +
      '<p>Journeys automatically progress your entrainment frequency across the four rounds of a session, matching the typical arc of focused work:</p>' +
      '<p><strong>Deep Work</strong> — Alpha → Beta → Beta → Gamma. Settle in relaxed, ramp into focus, finish at peak cognition.</p>' +
      '<p><strong>Creative</strong> — Theta → Alpha → Alpha → Beta. Open with divergent ideation, sustain in flow, finish in execution mode.</p>' +
      '<p><strong>Study</strong> — Alpha → Beta → Theta → Alpha. Intake, analyze, let things consolidate, then review.</p>' +
      '<p><strong>Manual</strong> — pick a band yourself; it stays the same across all rounds.</p>' +
      '<h3>Practical tips</h3>' +
      '<p>Start with Alpha or the Deep Work journey. Use headphones for binaural beats; isochronic tones work on speakers. Keep volume low — these are background, not foreground sounds. If a band feels uncomfortable, switch or turn it off. Effects, if any, build over consistent use.</p>' +
      '<button class="settings-link" id="back-to-settings">← Back to settings</button>';
    document.getElementById('modal-overlay').classList.add('show');
    const back = document.getElementById('back-to-settings');
    if (back) back.onclick = showSettingsModal;
  }

  function showSettingsModal() {
    const content = document.getElementById('modal-content');
    content.innerHTML =
      '<h2>Settings</h2>' +
      '<p class="modal-hz">Customize your session timing</p>' +
      sliderRow('Focus duration',  'set-focus',  5, 90, cfg.focus,    'min') +
      sliderRow('Short break',     'set-short',  1, 30, cfg.short,    'min') +
      sliderRow('Long break',      'set-long',   5, 60, cfg.long,     'min') +
      sliderRow('Rounds per cycle','set-cycle',  2, 8,  cfg.perCycle, 'rounds') +
      '<button class="settings-link" id="open-about">About brainwave entrainment →</button>' +
      '<button class="settings-link" id="settings-reset" style="color: var(--ink-muted);">Reset current session</button>';
    document.getElementById('modal-overlay').classList.add('show');
    wireSettingsSliders();
    document.getElementById('open-about').onclick = showAboutModal;
    document.getElementById('settings-reset').onclick = () => {
      reset();
      document.getElementById('modal-overlay').classList.remove('show');
    };
  }
  // Expose to bridge JS in head so the topbar settings icon can open this
  window.__nsShowSettings = showSettingsModal;

  // Build a single slider row inside the settings modal
  function sliderRow(label, id, min, max, value, unit) {
    return (
      '<div class="settings-row">' +
        '<div class="label-row">' +
          '<span class="label">' + label + '</span>' +
          '<span class="value"><span id="' + id + '-out">' + value + '</span> ' + unit + '</span>' +
        '</div>' +
        '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" value="' + value + '" step="1" />' +
        '<div class="bounds"><span>' + min + '</span><span>' + max + '</span></div>' +
      '</div>'
    );
  }

  // Wire the four settings sliders to cfg + saveConfig + preset-card sync.
  // Each slider also mirrors its value into the cfg.custom* snapshot so the
  // "Custom" preset card can restore the user's last-tuned values later.
  function wireSettingsSliders() {
    const map = [
      ['set-focus',  'focus',    'customFocus'],
      ['set-short',  'short',    'customShort'],
      ['set-long',   'long',     'customLong'],
      ['set-cycle',  'perCycle', 'customCycle']
    ];
    map.forEach(([id, key, customKey]) => {
      const el = document.getElementById(id);
      const out = document.getElementById(id + '-out');
      if (!el || !out) return;
      el.addEventListener('input', (e) => {
        const v = parseInt(e.target.value, 10);
        cfg[key] = v;
        cfg[customKey] = v; // remember as the "custom" snapshot
        out.textContent = v;
        saveConfig();
        syncPresetSelection();
        if (!state.running && (key === 'focus' || key === 'short' || key === 'long')) {
          const m = { focus: cfg.focus, short: cfg.short, long: cfg.long };
          state.totalSeconds = m[state.mode] * 60;
          state.secondsLeft = state.totalSeconds;
          render();
        }
      });
    });
  }

  // Match current cfg against the three presets; activate the matching card,
  // or activate Custom if no preset matches the current focus/short/long combo.
  function syncPresetSelection() {
    const cards = document.querySelectorAll('.interval-card[data-f]');
    let matched = false;
    cards.forEach(c => {
      const f = parseInt(c.dataset.f, 10);
      const s = parseInt(c.dataset.s, 10);
      const l = parseInt(c.dataset.l, 10);
      const isMatch = f === cfg.focus && s === cfg.short && l === cfg.long;
      c.classList.toggle('active', isMatch);
      if (isMatch) matched = true;
    });
    const customCard = document.getElementById('custom-card');
    const customVal  = document.getElementById('custom-card-val');
    if (customCard) customCard.classList.toggle('active', !matched);
    // Always show the saved custom snapshot on the card (even when a preset is active),
    // so the user knows what "Custom" will apply if they click it.
    if (customVal) customVal.textContent = cfg.customFocus + '/' + cfg.customShort;
  }

  function closeModal() {
    document.getElementById('modal-overlay').classList.remove('show');
  }

  // ===== Wire everything up =====
  document.getElementById('pause-btn').onclick = start; // start() toggles to pause if already running
  // Ring-as-button: clicking anywhere on the ring triggers play/pause
  document.querySelector('.ring-wrap').addEventListener('click', (e) => {
    if (e.target.closest('#pause-btn')) return; // button handles its own click
    start();
  });
  document.getElementById('skip-btn').onclick = () => complete(false);
  document.getElementById('reset-btn').onclick = reset;

  // Phase switcher — manually pick focus/short/long when timer is idle
  document.querySelectorAll('.mode-switch-btn').forEach(btn => {
    btn.onclick = () => {
      if (state.running) return;
      state.mode = btn.dataset.mode;
      const m = { focus: cfg.focus, short: cfg.short, long: cfg.long };
      state.totalSeconds = m[state.mode] * 60;
      state.secondsLeft = state.totalSeconds;
      render();
    };
  });
  document.getElementById('good-enough-btn').onclick = () => {
    if (state.mode === 'focus') complete(false);
  };

  document.querySelectorAll('.entrain-item').forEach(btn => {
    btn.onclick = () => {
      const newMode = btn.dataset.audioMode;
      const wasPlaying = entrainNodes !== null;
      cfg.audioMode = newMode;
      saveConfig();
      updateAudioBarUI();
      // Close panel after selection
      document.getElementById('entrainment-panel').classList.remove('show');

      // If switching between binaural↔isochronic while playing, restart cleanly
      if (wasPlaying && newMode !== 'off') {
        stopEntrainment();
        setTimeout(() => syncEntrainment(), 950);
      } else {
        syncEntrainment();
      }
    };
  });

  document.getElementById('volume-slider').addEventListener('input', (e) => {
    cfg.volume = parseInt(e.target.value, 10);
    document.getElementById('volume-out').textContent = cfg.volume;
    saveConfig();
    updateEntrainment();
  });

  document.querySelectorAll('.interval-card').forEach(card => {
    card.onclick = () => {
      // Custom card: apply the user's saved custom values, activate the card,
      // then open the settings modal so they can adjust further.
      if (card.id === 'custom-card') {
        cfg.focus = cfg.customFocus;
        cfg.short = cfg.customShort;
        cfg.long  = cfg.customLong;
        cfg.perCycle = cfg.customCycle;
        saveConfig();
        syncPresetSelection();
        if (!state.running) {
          const m = { focus: cfg.focus, short: cfg.short, long: cfg.long };
          state.totalSeconds = m[state.mode] * 60;
          state.secondsLeft = state.totalSeconds;
          render();
        }
        showSettingsModal();
        return;
      }
      cfg.focus = parseInt(card.dataset.f, 10);
      cfg.short = parseInt(card.dataset.s, 10);
      cfg.long = parseInt(card.dataset.l, 10);
      saveConfig();
      syncPresetSelection();
      // If settings modal is open, update its slider values to match the preset
      ['set-focus', 'set-short', 'set-long'].forEach(id => {
        const el = document.getElementById(id);
        const out = document.getElementById(id + '-out');
        if (!el || !out) return;
        const k = id === 'set-focus' ? 'focus' : id === 'set-short' ? 'short' : 'long';
        el.value = cfg[k];
        out.textContent = cfg[k];
      });
      if (!state.running) {
        const map = { focus: cfg.focus, short: cfg.short, long: cfg.long };
        state.totalSeconds = map[state.mode] * 60;
        state.secondsLeft = state.totalSeconds;
        render();
      }
    };
  });
  // Initial sync: highlight whichever card matches the saved cfg, or Custom if none
  syncPresetSelection();

  document.getElementById('dump-add').onclick = addDump;
  document.getElementById('dump-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addDump();
  });

  document.getElementById('modal-close').onclick = closeModal;
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') closeModal();
  });

  // Panels (nature / radio / mixer / entrainment) now live inline inside drawer tabs.
  // The legacy header buttons that used to toggle them as dropdowns are gone.
  // Render the grids/lists once on init so they're visible inside the drawer:
  renderNatureGrid();
  renderRadioList();

  // Volume sliders
  document.getElementById('master-volume').addEventListener('input', (e) => {
    masterVolume = parseInt(e.target.value, 10);
    document.getElementById('master-volume-out').textContent = masterVolume;
    applyMasterVolume();
  });
  document.getElementById('nature-volume').addEventListener('input', (e) => {
    natureMasterVolume = parseInt(e.target.value, 10);
    document.getElementById('nature-volume-out').textContent = natureMasterVolume;
    updateNatureVolume();
  });
  document.getElementById('radio-volume').addEventListener('input', (e) => {
    radioVolume = parseInt(e.target.value, 10);
    document.getElementById('radio-volume-out').textContent = radioVolume;
    updateRadioVolume();
  });

  // Click outside any panel closes it
  document.addEventListener('click', (e) => {
    const panels = [
      ['nature-panel', 'nature-btn'],
      ['radio-panel', 'radio-btn'],
      ['mixer-panel', 'mixer-btn'],
      ['entrainment-panel', 'entrainment-btn']
    ];
    panels.forEach(([panelId, btnId]) => {
      const p = document.getElementById(panelId);
      const b = document.getElementById(btnId);
      if (p.classList.contains('show')
          && !p.contains(e.target)
          && !b.contains(e.target)) {
        p.classList.remove('show');
      }
    });
  });

  // Spacebar to start/pause when not typing
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      start();
    }
  });

  // ===== Nature sounds engine =====
  // Each sound is procedurally synthesized via Web Audio (no external files).
  // Returns { stop: fn } when started, allowing clean shutdown.

  // Monochrome line icons — same family as the rest of the app (1.8 stroke, round caps/joins)
  const ICON_PATHS = {
    // Nature
    rain:    '<path d="M7 14a4 4 0 0 1 .8-7.93 5 5 0 0 1 9.4 1.43 3.5 3.5 0 0 1 .3 6.5"/><path d="M9 18l-1 2"/><path d="M13 18l-1 2"/><path d="M17 18l-1 2"/>',
    wind:    '<path d="M3 9h12a3 3 0 1 0-3-3"/><path d="M3 14h17a3 3 0 1 1-3 3"/><path d="M3 19h7"/>',
    storm:   '<path d="M7 13a4 4 0 0 1 .8-7.93 5 5 0 0 1 9.4 1.43 3.5 3.5 0 0 1 .3 6.5"/><path d="M13 14l-3 4h3l-2 4"/>',
    fire:    '<path d="M12 3s5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 1-5 0 0 1 2 2 2 1-1 1-3 1-3 0-1 1-3 1-3z"/>',
    ocean:   '<path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>',
    stream:  '<path d="M12 3s5 7 5 11a5 5 0 0 1-10 0c0-4 5-11 5-11z"/>',
    birds:   '<path d="M2 10c2-2 4-2 6 0"/><path d="M9 12c2-2 4-2 6 0"/><path d="M16 9c2-2 4-2 6 0"/>',
    forest:  '<path d="M12 3l-5 7h3l-4 6h12l-4-6h3z"/><path d="M12 16v5"/>',
    // Radio stations
    groovesalad:  '<path d="M5 19c0-7 7-14 14-14 0 7-7 14-14 14z"/><path d="M5 19l9-9"/>',
    fluid:        '<path d="M12 3s5 7 5 11a5 5 0 0 1-10 0c0-4 5-11 5-11z"/>',
    dronezone:    '<ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="4" ry="10"/>',
    lush:         '<circle cx="12" cy="12" r="2"/><path d="M12 3a4 4 0 0 1 0 8 4 4 0 0 1 0-8z"/><path d="M12 13a4 4 0 0 1 0 8 4 4 0 0 1 0-8z"/><path d="M3 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0z"/><path d="M13 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0z"/>',
    cliqhop:      '<path d="M5 16v-4"/><path d="M9 18v-12"/><path d="M13 14v-4"/><path d="M17 17v-10"/><path d="M21 16v-8"/>',
    spacestation: '<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)"/>',
    deepspaceone: '<circle cx="12" cy="11" r="5"/><ellipse cx="12" cy="13" rx="10" ry="3"/>',
    defcon:       '<path d="M13 3l-7 11h5l-2 7 7-11h-5z"/>'
  };

  function iconSvg(id, size) {
    size = size || 22;
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (ICON_PATHS[id] || '') + '</svg>';
  }

  const NATURE_SOUNDS = [
    { id: 'rain',    name: 'Rain'    },
    { id: 'wind',    name: 'Wind'    },
    { id: 'storm',   name: 'Storm'   },
    { id: 'fire',    name: 'Fire'    },
    { id: 'ocean',   name: 'Ocean'   },
    { id: 'stream',  name: 'Stream'  },
    { id: 'birds',   name: 'Birds'   },
    { id: 'forest',  name: 'Forest'  }
  ];

  let activeNature = null; // { id, nodes: [...], stopFns: [...], masterGain }
  let natureMasterVolume = 40;
  let masterVolume = 100;

  function applyMasterVolume() {
    // Re-apply each layer's volume (each function reads current state and master)
    updateEntrainment();
    updateNatureVolume();
    updateRadioVolume();
  }

  function createNoiseBuffer(ctx, type, durationSec) {
    const length = Math.floor(ctx.sampleRate * durationSec);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    } else if (type === 'pink') {
      // Paul Kellet's pink noise approximation
      let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
      for (let i = 0; i < length; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555179;
        b1 = 0.99332 * b1 + w * 0.0750759;
        b2 = 0.96900 * b2 + w * 0.1538520;
        b3 = 0.86650 * b3 + w * 0.3104856;
        b4 = 0.55000 * b4 + w * 0.5329522;
        b5 = -0.7616 * b5 - w * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
        b6 = w * 0.115926;
      }
    } else if (type === 'brown') {
      let last = 0;
      for (let i = 0; i < length; i++) {
        const w = Math.random() * 2 - 1;
        last = (last + 0.02 * w) / 1.02;
        data[i] = last * 3.5;
      }
    }
    return buffer;
  }

  function makeLoopedNoise(ctx, type) {
    const buffer = createNoiseBuffer(ctx, type, 4);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    return src;
  }

  // Each builder returns { masterGain: GainNode, stop: () => void }
  const NATURE_BUILDERS = {
    rain: function(ctx) {
      const master = ctx.createGain();
      const noise = makeLoopedNoise(ctx, 'pink');
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 4000;
      filter.Q.value = 0.5;
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.7;
      noise.connect(filter).connect(noiseGain).connect(master);
      noise.start();

      // Random "drops" — short tones layered on top
      let stopped = false;
      const dropTimers = [];
      function scheduleDrop() {
        if (stopped) return;
        const delay = 60 + Math.random() * 250;
        const t = setTimeout(() => {
          if (stopped) return;
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.value = 1500 + Math.random() * 2500;
          g.gain.setValueAtTime(0, ctx.currentTime);
          g.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.005);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
          o.connect(g).connect(master);
          o.start();
          o.stop(ctx.currentTime + 0.06);
          scheduleDrop();
        }, delay);
        dropTimers.push(t);
      }
      scheduleDrop();

      return {
        masterGain: master,
        stop: () => {
          stopped = true;
          dropTimers.forEach(clearTimeout);
          stopSafely(noise);
        }
      };
    },

    wind: function(ctx) {
      const master = ctx.createGain();
      const noise = makeLoopedNoise(ctx, 'brown');
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      const gain = ctx.createGain();
      gain.gain.value = 0.6;

      // Slow LFO for wind gusts
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.15;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.4;
      lfo.connect(lfoGain).connect(gain.gain);
      lfo.start();

      // Filter modulation for whistle effect
      const lfo2 = ctx.createOscillator();
      lfo2.type = 'sine';
      lfo2.frequency.value = 0.08;
      const lfo2Gain = ctx.createGain();
      lfo2Gain.gain.value = 400;
      lfo2.connect(lfo2Gain).connect(filter.frequency);
      lfo2.start();

      noise.connect(filter).connect(gain).connect(master);
      noise.start();

      return {
        masterGain: master,
        stop: () => {
          stopSafely(noise); stopSafely(lfo); stopSafely(lfo2);
        }
      };
    },

    storm: function(ctx) {
      const master = ctx.createGain();
      // Heavy rain
      const noise = makeLoopedNoise(ctx, 'pink');
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 6000;
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.9;
      noise.connect(filter).connect(noiseGain).connect(master);
      noise.start();

      // Wind underlay
      const wind = makeLoopedNoise(ctx, 'brown');
      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'lowpass';
      windFilter.frequency.value = 400;
      const windGain = ctx.createGain();
      windGain.gain.value = 0.5;
      wind.connect(windFilter).connect(windGain).connect(master);
      wind.start();

      // Thunder rumbles
      let stormStopped = false;
      const thunderTimers = [];
      function scheduleThunder() {
        if (stormStopped) return;
        const delay = 8000 + Math.random() * 18000;
        const t = setTimeout(() => {
          if (stormStopped) return;
          const rumble = ctx.createBufferSource();
          rumble.buffer = createNoiseBuffer(ctx, 'brown', 4);
          const rumbleFilter = ctx.createBiquadFilter();
          rumbleFilter.type = 'lowpass';
          rumbleFilter.frequency.value = 120;
          const rumbleGain = ctx.createGain();
          rumbleGain.gain.setValueAtTime(0, ctx.currentTime);
          rumbleGain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.3);
          rumbleGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4);
          rumble.connect(rumbleFilter).connect(rumbleGain).connect(master);
          rumble.start();
          rumble.stop(ctx.currentTime + 4);
          scheduleThunder();
        }, delay);
        thunderTimers.push(t);
      }
      scheduleThunder();

      return {
        masterGain: master,
        stop: () => {
          stormStopped = true;
          thunderTimers.forEach(clearTimeout);
          stopSafely(noise); stopSafely(wind);
        }
      };
    },

    fire: function(ctx) {
      const master = ctx.createGain();
      // Warm low rumble
      const noise = makeLoopedNoise(ctx, 'pink');
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600;
      const baseGain = ctx.createGain();
      baseGain.gain.value = 0.4;
      noise.connect(filter).connect(baseGain).connect(master);
      noise.start();

      // Crackle bursts
      let fireStopped = false;
      const crackleTimers = [];
      function scheduleCrackle() {
        if (fireStopped) return;
        const delay = 30 + Math.random() * 200;
        const t = setTimeout(() => {
          if (fireStopped) return;
          const burstBuf = createNoiseBuffer(ctx, 'white', 0.08);
          const burst = ctx.createBufferSource();
          burst.buffer = burstBuf;
          const bp = ctx.createBiquadFilter();
          bp.type = 'bandpass';
          bp.frequency.value = 2000 + Math.random() * 3000;
          bp.Q.value = 2;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.15 + Math.random() * 0.15, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
          burst.connect(bp).connect(g).connect(master);
          burst.start();
          burst.stop(ctx.currentTime + 0.1);
          scheduleCrackle();
        }, delay);
        crackleTimers.push(t);
      }
      scheduleCrackle();

      return {
        masterGain: master,
        stop: () => {
          fireStopped = true;
          crackleTimers.forEach(clearTimeout);
          stopSafely(noise);
        }
      };
    },

    ocean: function(ctx) {
      const master = ctx.createGain();
      const noise = makeLoopedNoise(ctx, 'brown');
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1200;
      const gain = ctx.createGain();
      gain.gain.value = 0.5;

      // Slow swelling for waves (~6s cycle)
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.16;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.4;
      lfo.connect(lfoGain).connect(gain.gain);
      lfo.start();

      // Filter sweep for crash effect
      const lfoFilter = ctx.createOscillator();
      lfoFilter.type = 'sine';
      lfoFilter.frequency.value = 0.16;
      const lfoFilterGain = ctx.createGain();
      lfoFilterGain.gain.value = 1500;
      lfoFilter.connect(lfoFilterGain).connect(filter.frequency);
      lfoFilter.start();

      noise.connect(filter).connect(gain).connect(master);
      noise.start();

      return {
        masterGain: master,
        stop: () => {
          stopSafely(noise); stopSafely(lfo); stopSafely(lfoFilter);
        }
      };
    },

    stream: function(ctx) {
      const master = ctx.createGain();
      const noise = makeLoopedNoise(ctx, 'pink');
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 2000;
      bp.Q.value = 0.7;
      const gain = ctx.createGain();
      gain.gain.value = 0.7;
      noise.connect(bp).connect(gain).connect(master);
      noise.start();

      // Random burbles
      let streamStopped = false;
      const burbleTimers = [];
      function scheduleBurble() {
        if (streamStopped) return;
        const delay = 80 + Math.random() * 300;
        const t = setTimeout(() => {
          if (streamStopped) return;
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          const startFreq = 800 + Math.random() * 800;
          o.frequency.setValueAtTime(startFreq, ctx.currentTime);
          o.frequency.exponentialRampToValueAtTime(startFreq * 0.5, ctx.currentTime + 0.1);
          g.gain.setValueAtTime(0, ctx.currentTime);
          g.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
          o.connect(g).connect(master);
          o.start();
          o.stop(ctx.currentTime + 0.13);
          scheduleBurble();
        }, delay);
        burbleTimers.push(t);
      }
      scheduleBurble();

      return {
        masterGain: master,
        stop: () => {
          streamStopped = true;
          burbleTimers.forEach(clearTimeout);
          stopSafely(noise);
        }
      };
    },

    birds: function(ctx) {
      const master = ctx.createGain();
      // Subtle background — quiet wind
      const bg = makeLoopedNoise(ctx, 'brown');
      const bgFilter = ctx.createBiquadFilter();
      bgFilter.type = 'lowpass';
      bgFilter.frequency.value = 400;
      const bgGain = ctx.createGain();
      bgGain.gain.value = 0.1;
      bg.connect(bgFilter).connect(bgGain).connect(master);
      bg.start();

      // Bird chirps — FM synthesis
      let birdsStopped = false;
      const chirpTimers = [];
      function scheduleChirp() {
        if (birdsStopped) return;
        const delay = 800 + Math.random() * 4000;
        const t = setTimeout(() => {
          if (birdsStopped) return;
          const chirpCount = 1 + Math.floor(Math.random() * 4);
          for (let i = 0; i < chirpCount; i++) {
            setTimeout(() => {
              if (birdsStopped) return;
              const carrier = ctx.createOscillator();
              const modulator = ctx.createOscillator();
              const modGain = ctx.createGain();
              const ampGain = ctx.createGain();

              const baseFreq = 1800 + Math.random() * 2200;
              carrier.frequency.value = baseFreq;
              modulator.frequency.value = 8 + Math.random() * 12;
              modGain.gain.value = 200 + Math.random() * 600;

              modulator.connect(modGain).connect(carrier.frequency);

              const dur = 0.08 + Math.random() * 0.12;
              ampGain.gain.setValueAtTime(0, ctx.currentTime);
              ampGain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
              ampGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

              // Slight pitch sweep
              carrier.frequency.exponentialRampToValueAtTime(
                baseFreq * (0.7 + Math.random() * 0.6),
                ctx.currentTime + dur
              );

              carrier.connect(ampGain).connect(master);
              modulator.start();
              carrier.start();
              modulator.stop(ctx.currentTime + dur + 0.05);
              carrier.stop(ctx.currentTime + dur + 0.05);
            }, i * (80 + Math.random() * 120));
          }
          scheduleChirp();
        }, delay);
        chirpTimers.push(t);
      }
      scheduleChirp();

      return {
        masterGain: master,
        stop: () => {
          birdsStopped = true;
          chirpTimers.forEach(clearTimeout);
          stopSafely(bg);
        }
      };
    },

    forest: function(ctx) {
      const master = ctx.createGain();
      // Wind base
      const wind = makeLoopedNoise(ctx, 'brown');
      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'lowpass';
      windFilter.frequency.value = 600;
      const windGain = ctx.createGain();
      windGain.gain.value = 0.4;

      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.1;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.25;
      lfo.connect(lfoGain).connect(windGain.gain);
      lfo.start();

      wind.connect(windFilter).connect(windGain).connect(master);
      wind.start();

      // Leaf rustle bursts
      let forestStopped = false;
      const rustleTimers = [];
      function scheduleRustle() {
        if (forestStopped) return;
        const delay = 500 + Math.random() * 2500;
        const t = setTimeout(() => {
          if (forestStopped) return;
          const burst = ctx.createBufferSource();
          burst.buffer = createNoiseBuffer(ctx, 'pink', 0.5);
          const bp = ctx.createBiquadFilter();
          bp.type = 'bandpass';
          bp.frequency.value = 3000 + Math.random() * 2000;
          bp.Q.value = 0.8;
          const g = ctx.createGain();
          const dur = 0.3 + Math.random() * 0.4;
          g.gain.setValueAtTime(0, ctx.currentTime);
          g.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
          burst.connect(bp).connect(g).connect(master);
          burst.start();
          burst.stop(ctx.currentTime + dur + 0.1);
          scheduleRustle();
        }, delay);
        rustleTimers.push(t);
      }
      scheduleRustle();

      // Occasional birds
      const birdTimers = [];
      function scheduleBird() {
        if (forestStopped) return;
        const delay = 4000 + Math.random() * 9000;
        const t = setTimeout(() => {
          if (forestStopped) return;
          const carrier = ctx.createOscillator();
          const modulator = ctx.createOscillator();
          const modGain = ctx.createGain();
          const ampGain = ctx.createGain();
          const baseFreq = 1600 + Math.random() * 1800;
          carrier.frequency.value = baseFreq;
          modulator.frequency.value = 10 + Math.random() * 8;
          modGain.gain.value = 300;
          modulator.connect(modGain).connect(carrier.frequency);
          const dur = 0.12;
          ampGain.gain.setValueAtTime(0, ctx.currentTime);
          ampGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.02);
          ampGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
          carrier.connect(ampGain).connect(master);
          modulator.start();
          carrier.start();
          modulator.stop(ctx.currentTime + dur + 0.05);
          carrier.stop(ctx.currentTime + dur + 0.05);
          scheduleBird();
        }, delay);
        birdTimers.push(t);
      }
      scheduleBird();

      return {
        masterGain: master,
        stop: () => {
          forestStopped = true;
          rustleTimers.forEach(clearTimeout);
          birdTimers.forEach(clearTimeout);
          stopSafely(wind); stopSafely(lfo);
        }
      };
    }
  };

  function startNatureSound(id) {
    stopNatureSound(); // stop any current
    const ctx = getAudio();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const builder = NATURE_BUILDERS[id];
    if (!builder) return;
    const result = builder(ctx);
    const targetVol = (natureMasterVolume / 100) * (masterVolume / 100) * 0.5;
    result.masterGain.gain.setValueAtTime(0, ctx.currentTime);
    result.masterGain.gain.linearRampToValueAtTime(targetVol, ctx.currentTime + 1.2);
    result.masterGain.connect(ctx.destination);
    activeNature = { id, ...result };
    updateNatureBtn();
  }

  function stopNatureSound() {
    if (!activeNature) return;
    const ctx = getAudio();
    const m = activeNature.masterGain;
    const stopFn = activeNature.stop;
    if (ctx && m) {
      m.gain.cancelScheduledValues(ctx.currentTime);
      m.gain.setValueAtTime(m.gain.value, ctx.currentTime);
      m.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      setTimeout(() => {
        try { stopFn(); m.disconnect(); } catch(e) {}
      }, 700);
    } else {
      try { stopFn(); } catch(e) {}
    }
    activeNature = null;
    updateNatureBtn();
  }

  function updateNatureVolume() {
    if (!activeNature) return;
    const ctx = getAudio();
    if (!ctx) return;
    const targetVol = (natureMasterVolume / 100) * (masterVolume / 100) * 0.5;
    activeNature.masterGain.gain.linearRampToValueAtTime(targetVol, ctx.currentTime + 0.3);
  }

  function updateNatureBtn() {
    updateMixerActiveStates();
  }

  function renderNatureGrid() {
    const grid = document.getElementById('nature-grid');
    grid.innerHTML = '';
    NATURE_SOUNDS.forEach(s => {
      const cell = document.createElement('button');
      cell.className = 'nature-cell' + (activeNature && activeNature.id === s.id ? ' active' : '');
      cell.innerHTML =
        '<span class="icon">' + iconSvg(s.id, 22) + '</span>' +
        '<span class="name">' + s.name + '</span>';
      cell.onclick = () => {
        if (activeNature && activeNature.id === s.id) {
          stopNatureSound();
        } else {
          startNatureSound(s.id);
        }
        renderNatureGrid();
      };
      grid.appendChild(cell);
    });
  }


  // ===== Chill radio (HTML5 Audio + SomaFM) =====
  // Direct stream URLs from SomaFM. If a URL stops working in the future,
  // get the current one from https://somafm.com/{station}/directstreamlinks.html
  // NOTE: Streams require HTTPS origin. Won't work via file:// (browser security).
  const RADIO_STATIONS = [
    { id: 'groovesalad',  name: 'Groove Salad',   desc: 'Ambient/downtempo grooves',         url: 'https://ice5.somafm.com/groovesalad-128-mp3', icon: '🌿' },
    { id: 'fluid',        name: 'Fluid',          desc: 'Liquid trip-hop & chill hip-hop',   url: 'https://ice5.somafm.com/fluid-128-mp3',       icon: '💧' },
    { id: 'dronezone',    name: 'Drone Zone',     desc: 'Atmospheric textures, deep ambient', url: 'https://ice5.somafm.com/dronezone-128-mp3',  icon: '🌌' },
    { id: 'lush',         name: 'Lush',           desc: 'Sensuous, mellow vocals',           url: 'https://ice5.somafm.com/lush-128-mp3',        icon: '🌸' },
    { id: 'cliqhop',      name: 'Cliqhop IDM',    desc: 'Intelligent dance & chill electronic', url: 'https://ice5.somafm.com/cliqhop-128-mp3',  icon: '🎛️' },
    { id: 'spacestation', name: 'Space Station',  desc: 'Spaced-out ambient electronica',    url: 'https://ice5.somafm.com/spacestation-128-mp3', icon: '🚀' },
    { id: 'deepspaceone', name: 'Deep Space One', desc: 'Deep ambient & space music',        url: 'https://ice5.somafm.com/deepspaceone-128-mp3', icon: '🛸' },
    { id: 'defcon',       name: 'DEF CON Radio',  desc: 'Music for hacking',                 url: 'https://ice5.somafm.com/defcon-128-mp3',      icon: '⚡' }
  ];

  let radioAudio = null;
  let radioCurrentId = null;
  let radioVolume = 50;
  let radioHandlers = null;

  function startRadio(stationId) {
    const station = RADIO_STATIONS.find(s => s.id === stationId);
    if (!station) return;

    stopRadio();

    radioAudio = new Audio(station.url);
    radioAudio.preload = 'none';
    radioAudio.volume = (radioVolume / 100) * (masterVolume / 100);
    radioCurrentId = stationId;

    radioHandlers = {
      playing: () => { renderRadioList(); },
      error: (e) => {
      // Distinguish network vs likely CORS/format error for user feedback
      const code = radioAudio && radioAudio.error ? radioAudio.error.code : 0;
      const isCors = code === 0; // MediaError codes 1-4; 0 = unknown/CORS (no error object)
      const msg = isCors
        ? 'Blocked — needs HTTPS. Try another station.'
        : 'Unavailable — check connection or try another station.';
      // Show error in the radio item button desc for the failed station
      const list = document.getElementById('radio-list');
      if (list) {
        const items = list.querySelectorAll('.radio-item');
        items.forEach(item => {
          if (item.classList.contains('active')) {
            const desc = item.querySelector('.desc');
            if (desc) desc.textContent = msg;
          }
        });
      }
      stopRadio();
    }
    };
    radioAudio.addEventListener('playing', radioHandlers.playing);
    radioAudio.addEventListener('error', radioHandlers.error);

    radioAudio.play().catch((err) => {
      // Autoplay policy or network failure
      const list = document.getElementById('radio-list');
      if (list) {
        const items = list.querySelectorAll('.radio-item');
        items.forEach(item => {
          if (item.classList.contains('active')) {
            const desc = item.querySelector('.desc');
            if (desc) desc.textContent = 'Playback blocked — tap to retry.';
          }
        });
      }
      stopRadio();
    });

    updateRadioBtn();
    renderRadioList();
  }

  function stopRadio() {
    if (radioAudio) {
      try {
        if (radioHandlers) {
          radioAudio.removeEventListener('playing', radioHandlers.playing);
          radioAudio.removeEventListener('error', radioHandlers.error);
        }
        radioAudio.pause();
        radioAudio.src = '';
        radioAudio.load();
      } catch(e) { /* silent */ }
      radioAudio = null;
      radioHandlers = null;
    }
    if (radioCurrentId) {
      radioCurrentId = null;
      updateRadioBtn();
      renderRadioList();
    }
    updateMixerActiveStates();
  }

  function updateRadioVolume() {
    if (radioAudio) {
      radioAudio.volume = Math.max(0, (radioVolume / 100) * (masterVolume / 100));
    }
  }

  function updateRadioBtn() {
    const btn = document.getElementById('radio-btn');
    if (btn) btn.classList.toggle('has-active', radioCurrentId !== null);
    updateMixerActiveStates();
  }

  function renderRadioList() {
    const list = document.getElementById('radio-list');
    if (!list) return;
    list.innerHTML = '';
    RADIO_STATIONS.forEach(s => {
      const item = document.createElement('button');
      let cls = 'radio-item';
      const isActive = s.id === radioCurrentId;
      if (isActive) {
        cls += ' active';
        // 'loading' state when audio exists but isn't playing yet
        if (radioAudio && radioAudio.readyState < 3) cls += ' loading';
      }
      item.className = cls;

      const indicator = isActive
        ? '<svg class="play-indicator" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>'
        : '<svg class="play-indicator" viewBox="0 0 24 24" fill="currentColor"><polygon points="7 4 20 12 7 20 7 4"/></svg>';

      // Build children safely — name/desc come from RADIO_STATIONS (static) today, but
      // sanitize against future externalization. iconSvg + indicator are trusted constants.
      const iconWrap = document.createElement('div');
      iconWrap.className = 'icon';
      iconWrap.innerHTML = iconSvg(s.id, 16);
      const info = document.createElement('div');
      info.className = 'info';
      const nameEl = document.createElement('div');
      nameEl.className = 'name';
      nameEl.textContent = s.name;
      const descEl = document.createElement('div');
      descEl.className = 'desc';
      descEl.textContent = s.desc;
      info.appendChild(nameEl);
      info.appendChild(descEl);
      const indWrap = document.createElement('span');
      indWrap.innerHTML = indicator;
      item.appendChild(iconWrap);
      item.appendChild(info);
      while (indWrap.firstChild) item.appendChild(indWrap.firstChild);

      item.onclick = (ev) => {
        ev.stopPropagation();
        if (isActive) stopRadio();
        else startRadio(s.id);
      };
      list.appendChild(item);
    });
  }


  // ===== Init =====
  // Fix #15: disable radio if not HTTPS or localhost
  (function checkHttps() {
    const isSecure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    if (!isSecure) {
      const radioBtn = document.getElementById('radio-btn');
      if (radioBtn) {
        radioBtn.disabled = true;
        radioBtn.title = 'Radio requires HTTPS';
        radioBtn.style.opacity = '0.35';
        radioBtn.style.cursor = 'not-allowed';
      }
    }
  })();

  // ── Theme toggle ──────────────────────────────────────────────
  (function initTheme() {
    var saved = localStorage.getItem('neurosync-theme');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = saved ? saved === 'dark' : prefersDark;

    function applyTheme(dark) {
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
      var cb = document.getElementById('theme-toggle-btn');
      if (cb) cb.checked = dark;
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.content = dark ? '#0A0E1A' : '#F2F5FC';
    }

    applyTheme(isDark);

    document.getElementById('theme-toggle-btn').addEventListener('change', function() {
      var newDark = this.checked;
      applyTheme(newDark);
      localStorage.setItem('neurosync-theme', newDark ? 'dark' : 'light');
    });
  })();

  console.log('[neurosync] init starting...');
  loadState();
  console.log('[neurosync] state loaded');
  applyBandTheme();
  renderJourneyBar();
  renderBandSelector();
  renderJourneyTimeline();
  drawWave();

  // Listen for scroll on band selector to update fade indicators
  document.getElementById('band-selector').addEventListener('scroll', updateBandSelectorFades);
  window.addEventListener('resize', updateBandSelectorFades);

  // Sync UI to loaded config
  document.getElementById('volume-slider').value = cfg.volume;
  document.getElementById('volume-out').textContent = cfg.volume;
  document.getElementById('nature-volume').value = natureMasterVolume;
  document.getElementById('nature-volume-out').textContent = natureMasterVolume;
  document.getElementById('radio-volume').value = radioVolume;
  document.getElementById('radio-volume-out').textContent = radioVolume;
  document.getElementById('master-volume').value = masterVolume;
  document.getElementById('master-volume-out').textContent = masterVolume;
  updateAudioBarUI();
  renderNatureGrid();
  renderRadioList();

  // Sync interval card
  document.querySelectorAll('.interval-card').forEach(c => {
    c.classList.toggle('active',
      parseInt(c.dataset.f, 10) === cfg.focus &&
      parseInt(c.dataset.s, 10) === cfg.short &&
      parseInt(c.dataset.l, 10) === cfg.long
    );
  });

  render();
  renderDump();
  console.log('[neurosync] init complete - app ready');
})();
