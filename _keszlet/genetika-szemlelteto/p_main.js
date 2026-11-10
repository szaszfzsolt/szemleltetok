// ===== Navigáció és fő ciklus =====
let view = 'home', gi = 0, si = 0, cur = null;
const pad = n => String(n).padStart(2, '0');

function show(id) {
  for (const v of ['home', 'gate', 'scene', 'game']) {
    const e = $('#' + v);
    if (v === id) { e.classList.add('on'); requestAnimationFrame(() => requestAnimationFrame(() => e.classList.add('vis'))); }
    else e.classList.remove('on', 'vis');
  }
  view = id; crumbs();
}
function crumbs() {
  const c = $('#crumbs'); let h = '';
  if (view !== 'home') h += `<a data-go="home">Kezdőlap</a>`;
  if (view === 'gate') h += `<i>/</i><b>${GATES[gi].t}</b>`;
  if (view === 'scene') h += `<i>/</i><a data-go="gate">${GATES[gi].t}</a><i>/</i><b>${pad(si + 1)} ${SC[si].title}</b>`;
  if (view === 'game') h += `<i>/</i><b>Záró küldetés</b>`;
  c.innerHTML = h;
  c.querySelectorAll('a').forEach(a => a.onclick = () => a.dataset.go === 'home' ? goHome() : goGate(gi));
}
const setHash = h => { try { history.replaceState(null, '', h ? '#' + h : location.pathname + location.search); } catch (e) { } };

function goHome() { UI.cur = cur = null; GAME.stop(); show('home'); setHash(''); }
function goGame() { UI.cur = cur = null; GAME.setup(); show('game'); setHash('jatek'); }
function goGate(i) {
  gi = i; UI.cur = cur = null; const G = GATES[i];
  const v = $('#gate'); v.style.setProperty('--kc', G.c);
  $('#gKick').textContent = `${i + 1}. témakör`; $('#gKick').style.color = G.c;
  $('#gTitle').textContent = G.t; $('#gLead').textContent = G.lead;
  $('#gChips').innerHTML = G.chips.map(([b, s]) => `<div class="chip"><b>${b}</b><span>${s}</span></div>`).join('');
  const cards = $('#gCards'); cards.innerHTML = '';
  SC.forEach((s, j) => {
    if (s.g !== i) return;
    const b = el('button', 'scard panel hud', `<div class="n">${pad(j + 1)}</div><div><div class="t">${s.title}</div><div class="d">${s.short}</div></div>`);
    b.onclick = () => goScene(j); cards.appendChild(b);
  });
  show('gate'); setHash('g' + (i + 1));
}
function goScene(i) {
  si = i; const s = SC[i]; gi = s.g; const G = GATES[s.g];
  $('#scene').style.setProperty('--kc', G.c);
  $('#sKick').textContent = `${G.t} · ${pad(i + 1)}`; $('#sKick').style.color = G.c;
  $('#sTitle').textContent = s.title; $('#sTxt').innerHTML = s.txt;
  SC.forEach(x => x.el && x.el.classList.remove('on'));
  UI.cur = cur = s;
  if (!s.el) { s.el = el('div', 'sc on'); $('#stage').appendChild(s.el); s.cel = el('div'); s.cel.style.display = 'contents'; s.init(s.el, s.cel); }
  s.el.classList.add('on');
  const ctrl = $('#ctrl'); ctrl.innerHTML = ''; ctrl.appendChild(s.cel);
  // haladásjelző
  $('#prog').innerHTML = SC.map((x, j) => `<i class="${j === i ? 'on' : j < i ? 'done' : ''}" style="${j === i ? `background:${GATES[x.g].c};box-shadow:0 0 .5rem ${GATES[x.g].c}` : j < i ? `background:${rgba(GATES[x.g].c, .5)}` : ''}"></i>`).join('');
  // Gondolkodj!
  const th = $('#think');
  th.innerHTML = `<div class="head">${I.bulb}Gondolkodj!</div>` +
    s.think.map(([q, a]) => `<button class="q"><div class="qt">${q}</div><div class="qh">Koppints a válaszért</div><div class="qa">${a}</div></button>`).join('') +
    (s.tip ? `<div class="tip ${s.tip[0]}"><b>${s.tip[1]}</b>${s.tip[2]}</div>` : '') +
    `<div class="scnav"><button class="btn" id="pv">${I.prev}Előző</button><button class="btn o" id="nx">${i === SC.length - 1 ? 'Kezdőlap' : 'Következő'}${I.next}</button></div>`;
  th.querySelectorAll('.q').forEach(q => q.onclick = () => q.classList.toggle('open'));
  th.querySelector('#pv').onclick = () => i > 0 ? goScene(i - 1) : goGate(gi);
  th.querySelector('#nx').onclick = () => i < SC.length - 1 ? goScene(i + 1) : goHome();
  th.scrollTop = 0; if (PHONE) $('#scene .left').scrollTop = 0;
  $('#sData').innerHTML = s.data();
  show('scene'); setHash('s' + (i + 1));
}

// kezdőlapi kapuk
$('#gates').innerHTML = GATES.map((g, i) => `<button class="gate panel hud" style="--gc:${g.c}" data-i="${i}"><div class="n">${pad(i + 1)}</div><div class="t">${g.t}</div><div class="d">${g.d}</div><div class="go">${SC.filter(s => s.g === i).length} jelenet →</div></button>`).join('')
  + `<button class="gate panel hud gquest" style="--gc:${C.green}" data-i="q"><div class="n">★</div><div class="t">Záró küldetés</div><div class="d">Csapatverseny ${QB.length} kérdésből, minden játékban új kérdésekkel.</div><div class="go">Játék →</div></button>`;
document.querySelectorAll('.gate').forEach(b => b.onclick = () => b.dataset.i === 'q' ? goGame() : goGate(+b.dataset.i));
GAME.build();
$('#bHome').onclick = goHome; $('#badge').onclick = goHome;

// teljes képernyő
function fullscreen() {
  const d = document;
  if (!d.fullscreenElement && !d.webkitFullscreenElement) {
    const e = d.documentElement, r = e.requestFullscreen || e.webkitRequestFullscreen;
    if (r) { try { const p = r.call(e); if (p && p.then) p.then(() => { try { screen.orientation.lock('landscape').catch(() => { }); } catch (x) { } }).catch(() => { }); } catch (x) { } }
  } else { const x = d.exitFullscreen || d.webkitExitFullscreen; if (x) x.call(d); }
}
$('#bFull').onclick = fullscreen; $('#bRotFull').onclick = fullscreen;

// billentyűk
addEventListener('keydown', e => {
  if (e.target && e.target.tagName === 'INPUT' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return;
  if (view === 'game' && GAME.key(e)) { e.preventDefault(); return; }
  if (e.key === ' ') { e.preventDefault(); if (view === 'scene' && cur && cur.space) cur.space(); }
  else if (e.key === 'f' || e.key === 'F') fullscreen();
  else if (e.key === 'Escape') { if (view === 'scene') goGate(gi); else if (view === 'gate' || view === 'game') goHome(); }
  else if (e.key === 'ArrowRight') { if (view === 'scene') { si < SC.length - 1 && goScene(si + 1); } else if (view === 'gate') { const j = SC.findIndex(s => s.g === gi); goScene(j); } }
  else if (e.key === 'ArrowLeft') { if (view === 'scene') { si > 0 ? goScene(si - 1) : goGate(gi); } }
  else if (view === 'scene' && si === 2 && /^[atgc]$/i.test(e.key)) cur.fill(e.key.toUpperCase());
});

// jelvény spirálja
(() => {
  let h = ''; const n = 7;
  for (let i = 0; i < n; i++) { const y = 34 + i * 7.4, q = i * .9, x1 = 60 + 17 * Math.cos(q), x2 = 60 - 17 * Math.cos(q), b = 'ATGCGTA'[i]; h += `<line x1="${x1.toFixed(1)}" y1="${y}" x2="60" y2="${y}" stroke="${BC[b]}" stroke-width="2.4"/><line x1="60" y1="${y}" x2="${x2.toFixed(1)}" y2="${y}" stroke="${BC[PAIR[b]]}" stroke-width="2.4"/>`; }
  for (const s of [1, -1]) { let d = ''; for (let k = 0; k <= 60; k++) { const y = 30.3 + k / 60 * 51.8, q = (y - 34) / 7.4 * .9; d += (k ? 'L' : 'M') + (60 + s * 17 * Math.cos(q)).toFixed(1) + ' ' + y.toFixed(1); } h += `<path d="${d}" fill="none" stroke="#eef5ff" stroke-width="2.6" stroke-linecap="round"/>`; }
  $('#badgeHelix').innerHTML = h;
})();

// kezdőlapi forgó DNS
const homeCv = { cv: $('#homeHelix') };
function homeDraw(T) {
  const cv = homeCv.cv, r0 = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
  if (cv.width !== Math.round(r0.width * d) || cv.height !== Math.round(r0.height * d)) { cv.width = Math.round(r0.width * d); cv.height = Math.round(r0.height * d); }
  const ctx = cv.getContext('2d'); ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, r0.width, r0.height);
  const W = r0.width, H = r0.height, r = Math.min(W * .26, H * .14);
  const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * .5); g.addColorStop(0, 'rgba(63,211,255,.10)'); g.addColorStop(1, 'rgba(63,211,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  helix(ctx, { x0: W / 2 + r * .3, y0: H * .02, x1: W / 2 - r * .3, y1: H * .98, r, n: 24, phase: T * .45, seq: 'ATGCGTACCGATTAGCATGCAATG', bw: r * .1, rw: r * .085 });
}

let last = performance.now(), TT = 0;
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now; TT += dt;
  if (view === 'home') homeDraw(TT); else if (view === 'scene' && cur && cur.tick) cur.tick(dt, TT);
  requestAnimationFrame(frame);
}

// telefon: a Gondolkodj! panel a bal oldali sávba kerül
if (PHONE) { $('#scene .left').appendChild($('#think')); }

drawSky(); addEventListener('resize', drawSky);
function route() {
  const h = (location.hash || '').slice(1), m = /^([sg])(\d+)$/.exec(h);
  if (m && m[1] === 's' && SC[+m[2] - 1]) goScene(+m[2] - 1);
  else if (m && m[1] === 'g' && GATES[+m[2] - 1]) goGate(+m[2] - 1);
  else if (h === 'jatek') goGame();
  else goHome();
}
addEventListener('hashchange', route);
window.__sc = SC; window.__game = GAME;
(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => { route(); requestAnimationFrame(frame); });

})();
</script>
</body>
</html>
