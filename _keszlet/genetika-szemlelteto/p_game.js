const LVN = ['Könnyű', 'Közepes', 'Nehéz'], LVC = [C.green, C.cyan, C.orange];

// ===== Záró küldetés – csapatverseny (JÁTÉKMESTER-szabályok) =====
const GAME = (() => {
  const TIME = 20, TEAMS = [{ n: 'Spirál', c: C.cyan }, { n: 'Kromatida', c: C.orange }];
  const MIX = { 8: [2, 4, 2], 12: [4, 4, 4], 16: [6, 6, 4] };       // nehézségi szintenként, csapatonként páros
  const RANKS = ['Gyakornok', 'Laboráns', 'Kutató', 'Genetikus', 'Vezető genetikus'];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const KEY = 'gen8_kerdeszsak_v1';
  const ids = lv => QB.map((q, i) => q.s === lv ? i : -1).filter(i => i >= 0);

  // --- húzós zsák: a még nem látott kérdések jönnek először, játékok között is ---
  let bag = null;
  function loadBag() {
    if (bag) return bag;
    try { const b = JSON.parse(localStorage.getItem(KEY) || 'null'); if (b && b.length === 3) bag = b.map((l, lv) => l.filter(i => QB[i] && QB[i].s === lv)); } catch (e) { }
    if (!bag) bag = [[], [], []];
    return bag;
  }
  function saveBag() { try { localStorage.setItem(KEY, JSON.stringify(bag)); } catch (e) { } }
  function draw(lv, n, avoid) {
    loadBag(); const out = [];
    while (out.length < n) {
      if (!bag[lv].length) bag[lv] = shuffle(ids(lv).filter(i => !avoid.has(i) && !out.includes(i)));
      if (!bag[lv].length) bag[lv] = shuffle(ids(lv).filter(i => !out.includes(i)));
      out.push(bag[lv].shift());
    }
    saveBag(); return out;
  }
  const unseen = () => { loadBag(); return bag.reduce((a, l) => a + l.length, 0); };

  // --- állapot ---
  let st = null, root = null, tmr = null;
  const $g = s => root.querySelector(s);

  function build() {
    root = $('#game');
    root.innerHTML = `<div class="gwrap" id="gw"></div>`;
  }

  // ---------- kezdőkép ----------
  function setup() {
    clearTimer(); st = null;
    const left = unseen(), fresh = left === 0 ? QB.length : left;
    $g('#gw').innerHTML = `
      <div class="gsetup">
        <div class="titlebox gtitle"><i></i><i></i><i></i><i></i>
          <div class="kicker">Öröklődés és változékonyság · Záró küldetés</div>
          <h2>Genetikai <em>csapatverseny</em></h2>
        </div>
        <p class="glead">Két csapat felváltva felel. Minden kérdésre <b>${TIME} másodperc</b> jut. A nehezebb kérdés többet ér, a helyes sorozatért kombóbónusz jár, és csapatonként egyszer bevethető a <b>Felező</b>, a <b>Duplázás</b> és a <b>Pontlopás</b>.</p>
        <div class="gteams">${TEAMS.map((t, i) => `<div class="gteam panel" style="--tc:${t.c}"><span>${i ? 'B' : 'A'} csapat</span><b>${t.n}</b></div>`).join('<div class="gvs">VS</div>')}</div>
        <div class="dtitle" style="justify-content:center">Hány kérdés legyen?</div>
        <div class="glen">${[8, 12, 16].map(n => `<button class="glenb panel hud" data-n="${n}"><b>${n}</b><span>kérdés · kb. ${Math.round(n * 0.7)} perc</span></button>`).join('')}</div>
        <div class="grules">
          <div><b style="color:${LVC[0]}">Könnyű</b> 1 pont · <b style="color:${LVC[1]}">Közepes</b> 2 pont · <b style="color:${LVC[2]}">Nehéz</b> 3 pont</div>
          <div>Kombó: 3 helyes egymás után +1 · 5 helyes +2 · 7-től minden páratlannál +1</div>
          <div>Kérdésbank: ${QB.length} kérdés · még nem látott ebben a körben: <b>${fresh}</b> <button class="glink" id="gReset">Bank újrakeverése</button></div>
        </div>
      </div>`;
    root.querySelectorAll('.glenb').forEach(b => b.onclick = () => start(+b.dataset.n));
    $g('#gReset').onclick = () => { bag = [[], [], []]; saveBag(); setup(); };
  }

  // ---------- játék ----------
  function start(n) {
    const mix = MIX[n], used = new Set(), qs = [];
    mix.forEach((k, lv) => { const d = draw(lv, k, used); d.forEach(i => used.add(i)); qs.push(...d); });
    st = { n, qs, k: 0, turn: 0, score: [0, 0], combo: [0, 0], base: [0, 0], maxBase: [0, 0], right: [0, 0],
      tac: [{ f: 1, d: 1, p: 1 }, { f: 1, d: 1, p: 1 }], miss: [], phase: 'q' };
    qs.forEach((qi, k) => st.maxBase[k % 2] += QB[qi].s + 1);
    render(); ask();
  }
  function render() {
    $g('#gw').innerHTML = `
      <div class="gtop">
        ${[0, 1].map(t => `<div class="gsc panel" id="gsc${t}" style="--tc:${TEAMS[t].c}">
          <div class="gsc-h"><span>${t ? 'B' : 'A'} csapat</span><b>${TEAMS[t].n}</b></div>
          <div class="gsc-pts" id="gpts${t}">0</div>
          <div class="gsc-combo" id="gcmb${t}"></div>
          <div class="gtacs">
            <button class="gtac" data-t="${t}" data-k="f" title="Két rossz válasz eltűnik">${TI.f}<span>Felező</span></button>
            <button class="gtac" data-t="${t}" data-k="d" title="Helyes: dupla pont · rossz: −1">${TI.d}<span>Duplázás</span></button>
            <button class="gtac" data-t="${t}" data-k="p" title="Helyes: az ellenfél −1 · rossz: saját −1">${TI.p}<span>Pontlopás</span></button>
          </div>
        </div>`).join(`<div class="gmid"><div class="gprog" id="gprog"></div><div class="gnum" id="gnum"></div></div>`)}
      </div>
      <div class="gq panel hud" id="gq">
        <div class="gq-head"><span class="glv" id="glv"></span><span class="gturn" id="gturn"></span><div class="gtimer" id="gtimer"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19" class="tr-bg"/><circle cx="22" cy="22" r="19" class="tr" id="gtr"/></svg><b id="gtn">${TIME}</b></div></div>
        <div class="gq-text" id="gqt"></div>
        <div class="gopts" id="gopts"></div>
        <div class="gfb" id="gfb"></div>
      </div>`;
    root.querySelectorAll('.gtac').forEach(b => b.onclick = () => tactic(+b.dataset.t, b.dataset.k));
    updScore();
  }
  function ask() {
    const qi = st.qs[st.k], Q = QB[qi];
    st.order = shuffle([0, 1, 2, 3]);                  // véletlenszerű opció-sorrend minden kérdésnél
    st.ans = st.order.indexOf(0);                       // a helyes (eredeti 0.) új helye
    st.hidden = new Set(); st.used = null; st.phase = 'q'; st.left = TIME; st.paused = false;
    const t = st.turn;
    $g('#gq').style.setProperty('--kc', TEAMS[t].c);
    $g('#glv').innerHTML = `<i style="background:${LVC[Q.s]}"></i>${LVN[Q.s]} · ${Q.s + 1} pont`;
    $g('#gturn').innerHTML = `Felel: <b style="color:${TEAMS[t].c}">${TEAMS[t].n}</b>`;
    $g('#gqt').textContent = Q.q;
    $g('#gopts').innerHTML = st.order.map((oi, j) => `<button class="gopt" data-j="${j}"><span class="gl">${'ABCD'[j]}</span><span class="gtx">${Q.o[oi]}</span></button>`).join('');
    root.querySelectorAll('.gopt').forEach(b => b.onclick = () => answer(+b.dataset.j));
    $g('#gfb').innerHTML = ''; $g('#gfb').className = 'gfb';
    $g('#gnum').textContent = `${st.k + 1} / ${st.n}`;
    $g('#gprog').innerHTML = st.qs.map((q, k) => `<i style="${k < st.k ? `background:${rgba(TEAMS[k % 2].c, .55)}` : k === st.k ? `background:${TEAMS[k % 2].c};box-shadow:0 0 .5rem ${TEAMS[k % 2].c}` : ''}"></i>`).join('');
    [0, 1].forEach(x => $g('#gsc' + x).classList.toggle('act', x === t));
    updTac(); startTimer();
  }
  function updTac() {
    root.querySelectorAll('.gtac').forEach(b => {
      const t = +b.dataset.t, k = b.dataset.k, avail = st.tac[t][k];
      b.classList.toggle('used', !avail);
      b.classList.toggle('on', st.used === k && t === st.turn);
      b.disabled = !avail || t !== st.turn || st.phase !== 'q' || !!st.used;
    });
  }
  function tactic(t, k) {
    if (!st || st.phase !== 'q' || t !== st.turn || st.used || !st.tac[t][k]) return;
    st.tac[t][k] = 0; st.used = k;
    st.combo = [0, 0]; st.noCombo = true;              // kombótörés: mindkét csapatnál
    if (k === 'f') {                                    // Felező: két rossz válasz eltűnik, a helyes soha
      const wrong = shuffle([0, 1, 2, 3].filter(j => j !== st.ans)).slice(0, 2);
      wrong.forEach(j => { st.hidden.add(j); const b = $g(`.gopt[data-j="${j}"]`); b.classList.add('gone'); b.disabled = true; });
    }
    flash(t, { f: 'Felező bevetve', d: 'Duplázás: dupla pont vagy −1', p: 'Pontlopás: az ellenfél −1 vagy saját −1' }[k]);
    updTac(); updScore();
  }
  function answer(j) {
    if (!st || st.phase !== 'q' || st.hidden.has(j)) return;
    finish(j);
  }
  function finish(j) {                                  // j = -1: lejárt az idő
    st.phase = 'fb'; clearTimer();
    const t = st.turn, o = 1 - t, Q = QB[st.qs[st.k]], ok = j === st.ans, base = Q.s + 1;
    let gain = 0, oppLoss = 0, bonus = 0;
    if (ok) {
      st.right[t]++; st.base[t] += base;
      gain = st.used === 'd' ? base * 2 : base;
      if (st.used === 'p') oppLoss = 1;
      if (!st.noCombo) { st.combo[t]++; bonus = comboBonus(st.combo[t]); }
      gain += bonus;
    } else {
      if (st.used === 'd' || st.used === 'p') gain = -1;
      st.combo[t] = 0;                                  // időtúllépés/hiba: csak a saját kombó nullázódik
      st.miss.push(st.qs[st.k]);
    }
    st.noCombo = false;
    st.score[t] = Math.max(0, st.score[t] + gain);
    st.score[o] = Math.max(0, st.score[o] - oppLoss);
    root.querySelectorAll('.gopt').forEach(b => { const x = +b.dataset.j; b.disabled = true; if (x === st.ans) b.classList.add('ok'); else if (x === j) b.classList.add('bad'); });
    const msg = j < 0 ? 'Lejárt az idő!' : ok ? 'Helyes válasz!' : 'Nem ez a helyes válasz.';
    const pts = [gain > 0 ? `+${gain} pont` : gain < 0 ? `${gain} pont` : '', bonus ? `(ebből kombó +${bonus})` : '', oppLoss ? `· ${TEAMS[o].n} −1` : ''].filter(Boolean).join(' ');
    const last = st.k === st.n - 1;
    $g('#gfb').className = 'gfb ' + (ok ? 'ok' : 'bad');
    $g('#gfb').innerHTML = `<div class="gfb-t"><b>${msg}</b> <span>${pts}</span></div><div class="gfb-e">${Q.e}</div><button class="btn o" id="gnext">${last ? 'Eredmény' : 'Következő kérdés'}${I.next}</button>`;
    $g('#gnext').onclick = next;
    if (ok) burst(t);
    pop(t, gain); if (oppLoss) pop(o, -oppLoss);
    updScore(); updTac();
  }
  function comboBonus(c) { return c === 3 ? 1 : c === 5 ? 2 : (c >= 7 && c % 2 === 1) ? 1 : 0; }
  function next() {
    if (!st || st.phase !== 'fb') return;
    if (st.k >= st.n - 1) return result();
    st.k++; st.turn = 1 - st.turn; ask();
  }
  function updScore() {
    [0, 1].forEach(t => {
      $g('#gpts' + t).textContent = st.score[t];
      const c = Math.min(st.combo[t], 7);
      $g('#gcmb' + t).innerHTML = `<span>Kombó</span>${[...Array(7)].map((_, i) => `<i class="${i < c ? 'on' : ''}"></i>`).join('')}`;
    });
  }
  function pop(t, v) {
    if (!v) return; const e = el('div', 'gpop ' + (v > 0 ? 'p' : 'm'), (v > 0 ? '+' : '') + v);
    $g('#gsc' + t).appendChild(e); setTimeout(() => e.remove(), 1400);
  }
  function flash(t, txt) {
    const e = el('div', 'gflash', txt); e.style.setProperty('--tc', TEAMS[t].c);
    $g('#gq').appendChild(e); setTimeout(() => e.remove(), 1800);
  }
  function burst(t) {
    const host = $g('#gq'), r = host.getBoundingClientRect();
    for (let i = 0; i < 18; i++) {
      const p = el('i', 'gspark'), a = Math.random() * TAU, d = 60 + Math.random() * 140;
      p.style.background = [TEAMS[t].c, BC.A, BC.T, BC.G, BC.C][i % 5];
      p.style.left = r.width / 2 + 'px'; p.style.top = r.height * .45 + 'px';
      p.style.setProperty('--dx', Math.cos(a) * d + 'px'); p.style.setProperty('--dy', Math.sin(a) * d + 'px');
      host.appendChild(p); setTimeout(() => p.remove(), 900);
    }
  }

  // ---------- időzítő ----------
  function startTimer() {
    clearTimer(); drawTimer();
    let lastT = performance.now();
    tmr = setInterval(() => {
      const now = performance.now(), dt = (now - lastT) / 1000; lastT = now;
      if (!st || st.phase !== 'q' || st.paused || view !== 'game') return;
      st.left = Math.max(0, st.left - dt); drawTimer();
      if (st.left <= 0) finish(-1);
    }, 100);
  }
  function clearTimer() { if (tmr) { clearInterval(tmr); tmr = null; } }
  function drawTimer() {
    const tr = $g('#gtr'), tn = $g('#gtn'), box = $g('#gtimer'); if (!tr || !tn || !box) return;   // null-ellenőrzés
    const f = st.left / TIME, L = 2 * Math.PI * 19;
    tr.style.strokeDasharray = L; tr.style.strokeDashoffset = L * (1 - f);
    tn.textContent = Math.ceil(st.left);
    box.classList.toggle('warn', st.left <= 10 && st.left > 5);
    box.classList.toggle('crit', st.left <= 5);
    box.classList.toggle('pause', !!st.paused);
  }

  // ---------- eredmény ----------
  function stars(t) { const p = st.maxBase[t] ? st.base[t] / st.maxBase[t] : 0; return p >= .9 ? 5 : p >= .75 ? 4 : p >= .55 ? 3 : p >= .35 ? 2 : 1; }
  function badge(n, col) {
    const s = [...Array(5)].map((_, i) => { const a = -Math.PI / 2 + (i - 2) * .42, x = 50 + Math.cos(a) * 33, y = 54 + Math.sin(a) * 33; return `<path transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(.55)" d="M0,-10 L2.9,-3.1 10,-3.1 4.3,1.2 6.5,8.1 0,4 -6.5,8.1 -4.3,1.2 -10,-3.1 -2.9,-3.1Z" fill="${i < n ? C.orange : 'rgba(157,179,214,.25)'}"/>`; }).join('');
    return `<svg viewBox="0 0 100 100" class="gbadge"><circle cx="50" cy="50" r="46" fill="#061634" stroke="${C.orange}" stroke-width="3"/><circle cx="50" cy="50" r="40" fill="none" stroke="${col}" stroke-width="1.2" opacity=".7"/>${s}<text x="50" y="66" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="26" fill="${col}">${n}</text></svg>`;
  }
  function result() {
    clearTimer(); st.phase = 'end';
    const [a, b] = st.score, win = a === b ? -1 : a > b ? 0 : 1;
    const miss = st.miss.map(i => QB[i]);
    $g('#gw').innerHTML = `
      <div class="gend">
        <div class="kicker" style="text-align:center">Záró küldetés · eredmény</div>
        <h2 class="gwin">${win < 0 ? 'Döntetlen!' : `<span style="color:${TEAMS[win].c}">${TEAMS[win].n}</span> nyert!`}</h2>
        <div class="gres">${[0, 1].map(t => { const n = stars(t); return `<div class="gresc panel hud${t === win ? ' win' : ''}" style="--tc:${TEAMS[t].c};--kc:${TEAMS[t].c}">
          ${badge(n, TEAMS[t].c)}<div><span class="gres-n">${TEAMS[t].n}</span><b class="gres-p">${st.score[t]} pont</b>
          <span class="gres-r">${RANKS[n - 1]}</span><span class="gres-s">${st.right[t]} / ${st.n / 2} helyes válasz</span></div></div>`; }).join('')}</div>
        <div class="gmiss panel">
          <div class="dtitle">${miss.length ? `Ezeket érdemes átnézni (${miss.length})` : 'Hibátlan kör – nincs átnéznivaló!'}</div>
          ${miss.map(Q => `<div class="gmi"><b>${Q.q}</b><span>${Q.o[0]}</span></div>`).join('')}
        </div>
        <div class="gendb"><button class="btn o" id="gagain">${I.reset}Új játék – új kérdésekkel</button><button class="btn" id="ghome">Kezdőlap</button></div>
      </div>`;
    $g('#gagain').onclick = setup; $g('#ghome').onclick = () => goHome();
    if (win >= 0) for (let i = 0; i < 3; i++) setTimeout(() => burstEnd(win), i * 350);
  }
  function burstEnd(t) {
    const host = $g('.gend'); if (!host) return; const r = host.getBoundingClientRect();
    for (let i = 0; i < 26; i++) {
      const p = el('i', 'gspark'), a = Math.random() * TAU, d = 80 + Math.random() * 260;
      p.style.background = [TEAMS[t].c, BC.A, BC.T, BC.G, BC.C, C.orange][i % 6];
      p.style.left = r.width * (.3 + .4 * Math.random()) + 'px'; p.style.top = r.height * .25 + 'px';
      p.style.setProperty('--dx', Math.cos(a) * d + 'px'); p.style.setProperty('--dy', Math.sin(a) * d + 'px');
      host.appendChild(p); setTimeout(() => p.remove(), 900);
    }
  }

  // ---------- billentyűk ----------
  function key(e) {
    if (!st) return false;
    const k = e.key.toLowerCase();
    if (st.phase === 'q') {
      const m = { a: 0, b: 1, c: 2, d: 3, 1: 0, 2: 1, 3: 2, 4: 3 }[k];
      if (m != null) { answer(m); return true; }
      if (e.key === ' ') { st.paused = !st.paused; drawTimer(); return true; }   // szóköz: időzítő megállítása
    } else if (st.phase === 'fb' && (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight')) { next(); return true; }
    return false;
  }
  const TI = {
    f: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v18"/></svg>',
    d: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 7h6M8 4v6M13 14h6M16 11v6"/></svg>',
    p: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h14M13 7l5 5-5 5"/><path d="M4 5v14"/></svg>',
  };
  return { build, setup, key, stop: clearTimer, get st() { return st; }, comboBonus, _draw: draw, _bag: () => bag, _finish: j => finish(j), _answerCorrect: () => answer(st.ans) };
})();
