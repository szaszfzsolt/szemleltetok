// ===== Alapok =====
const $ = s => document.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const PHONE = document.documentElement.classList.contains('phone');
const C = { blue:'#2e9bff', cyan:'#3fd3ff', green:'#2fe59a', orange:'#ff8a1e', text:'#eef5ff', dim:'#9db3d6', faint:'#5f7aa3', red:'#ff5d73', purple:'#b07cff', yellow:'#ffd23f' };
const BC = { A:'#ff5d73', T:'#ffd23f', G:'#3fd3ff', C:'#b07cff' };
const BN = { A:'Adenin', T:'Timin', G:'Guanin', C:'Citozin' };
const PAIR = { A:'T', T:'A', G:'C', C:'G' };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => { t = clamp(t, 0, 1); return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
const TAU = Math.PI * 2;
function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${n >> 8 & 255},${n & 255},${a})`; };
const mixHex = (h1, h2, t) => { const a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16); const m = (s) => Math.round(lerp(a >> s & 255, b >> s & 255, t)); return `rgb(${m(16)},${m(8)},${m(0)})`; };

const I = {
  play: '<svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z"/></svg>',
  pause: '<svg viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>',
  prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>',
  shuffle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>',
  reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
};

// ===== Vászon =====
function Cv(parent) {
  const cv = document.createElement('canvas');
  parent.appendChild(cv);
  const o = { cv, ctx: cv.getContext('2d'), w: 0, h: 0,
    fit() {
      const r = cv.getBoundingClientRect(); const d = Math.min(window.devicePixelRatio || 1, 2);
      const W = Math.max(1, Math.round(r.width * d)), H = Math.max(1, Math.round(r.height * d));
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
      o.w = r.width; o.h = r.height; o.ctx.setTransform(d, 0, 0, d, 0, 0); o.ctx.clearRect(0, 0, o.w, o.h); return o;
    } };
  return o;
}
function font(ctx, px, w = 600, cond = true, ls = .1) {
  ctx.font = `${w} ${px}px "${cond ? 'Barlow Condensed' : 'Barlow'}"`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = (px * ls).toFixed(1) + 'px';
}
// felirat vezetővonallal
function label(ctx, txt, x, y, lx, ly, col, fs, align) {
  ctx.save();
  font(ctx, fs, 600, true, .12); ctx.textBaseline = 'middle';
  const al = align || (lx < x ? 'right' : 'left'); ctx.textAlign = al;
  const cw = ctx.canvas.clientWidth || 1e4, ch = ctx.canvas.clientHeight || 1e4, tw = ctx.measureText(txt.toUpperCase()).width + txt.length * fs * .12 + fs * .4;
  if (al === 'right') lx = clamp(lx, tw + 6, cw - 6); else if (al === 'left') lx = clamp(lx, 6, cw - tw - 6);
  ly = clamp(ly, fs, ch - fs);
  ctx.strokeStyle = rgba(col, .85); ctx.lineWidth = Math.max(1.2, fs * .07);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(lx, ly); ctx.stroke();
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, fs * .17, 0, TAU); ctx.fill();
  ctx.shadowColor = 'rgba(0,0,0,.9)'; ctx.shadowBlur = 8;
  ctx.fillText(txt.toUpperCase(), lx + (al === 'right' ? -fs * .4 : al === 'left' ? fs * .4 : 0), ly);
  ctx.restore();
}
function text(ctx, txt, x, y, col, fs, align = 'center', w = 600, cond = true, ls = .1) {
  ctx.save(); font(ctx, fs, w, cond, ls); ctx.fillStyle = col; ctx.textAlign = align; ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,.85)'; ctx.shadowBlur = 8; ctx.fillText(txt, x, y); ctx.restore();
}

// ===== DNS kettős spirál (közös rajzoló) =====
// o: x0,y0,x1,y1 tengely; r sugár; n bázispár; phase; twist (1 = spirál, 0 = létra); seq; alpha; bw (váz vastagság); rw (fok vastagság)
function helix(ctx, o) {
  const dx = o.x1 - o.x0, dy = o.y1 - o.y0, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, vx = -uy, vy = ux;
  const n = o.n, tw = o.twist ?? 1, a = o.alpha ?? 1, turn = o.turn || 10, seq = o.seq || 'ATGCGTAC';
  const th = t => tw * (t * TAU / turn + (o.phase || 0));
  const P = (t, s) => { const q = th(t); const off = s * o.r * Math.cos(q); const along = (t + .5) / n * L; return [o.x0 + ux * along + vx * off, o.y0 + uy * along + vy * off, s * Math.sin(q)]; };
  const bw = o.bw || o.r * .14, rw = o.rw || o.r * .11;
  const M = n * 10, back = [], front = [];
  for (const s of [1, -1]) {
    let p = P(-.5, s);
    for (let k = 1; k <= M; k++) {
      const t = -.5 + k / M * n, q = P(t, s);
      ((p[2] + q[2]) / 2 < -.02 ? back : front).push([p, q, (p[2] + q[2]) / 2]);
      p = q;
    }
  }
  ctx.save(); ctx.lineCap = 'round';
  // hátsó váz
  ctx.strokeStyle = `rgba(140,170,215,${.42 * a})`; ctx.lineWidth = bw * .85; ctx.beginPath();
  for (const [p, q] of back) { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); } ctx.stroke();
  // bázispárok
  for (let i = 0; i < n; i++) {
    const b1 = seq[i % seq.length], b2 = PAIR[b1];
    const p1 = P(i, 1), p2 = P(i, -1), mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2;
    const ra = a * (.55 + .45 * Math.abs(Math.cos(th(i))));
    let gx = 0, gy = 0;
    const len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) || 1, ex = (p2[0] - p1[0]) / len, ey = (p2[1] - p1[1]) / len;
    if (o.hb && tw < .5) { const g = o.r * .2 * (1 - tw * 2); gx = ex * g; gy = ey * g; }
    ctx.lineWidth = rw;
    ctx.strokeStyle = rgba(BC[b1], ra); ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(mx - gx, my - gy); ctx.stroke();
    ctx.strokeStyle = rgba(BC[b2], ra); ctx.beginPath(); ctx.moveTo(mx + gx, my + gy); ctx.lineTo(p2[0], p2[1]); ctx.stroke();
    if (o.hb && tw < .5) {
      const k = (b1 === 'A' || b1 === 'T') ? 2 : 3, sp = rw * .55;
      ctx.strokeStyle = `rgba(238,245,255,${.85 * a * (1 - tw * 2)})`; ctx.lineWidth = Math.max(1, rw * .16); ctx.setLineDash([rw * .22, rw * .18]);
      for (let j = 0; j < k; j++) { const off = (j - (k - 1) / 2) * sp; const ox = ux * off, oy = uy * off; ctx.beginPath(); ctx.moveTo(mx - gx + ox, my - gy + oy); ctx.lineTo(mx + gx + ox, my + gy + oy); ctx.stroke(); }
      ctx.setLineDash([]);
    }
  }
  // elülső váz – fénylő
  ctx.strokeStyle = `rgba(63,211,255,${.18 * a})`; ctx.lineWidth = bw * 2.4; ctx.beginPath();
  for (const [p, q] of front) { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); } ctx.stroke();
  ctx.strokeStyle = `rgba(228,240,255,${.95 * a})`; ctx.lineWidth = bw; ctx.beginPath();
  for (const [p, q] of front) { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); } ctx.stroke();
  // betűk létrán
  if (o.labels && tw < .4) {
    const la = a * (1 - tw / .4), fs = o.fs || o.r * .4;
    for (let i = 0; i < n; i++) {
      const b1 = seq[i % seq.length], p1 = P(i, 1), p2 = P(i, -1);
      text(ctx, b1, p1[0] + vx * fs * 1.05, p1[1] + vy * fs * 1.05, rgba(BC[b1], la), fs, 'center', 700);
      text(ctx, PAIR[b1], p2[0] - vx * fs * 1.05, p2[1] - vy * fs * 1.05, rgba(BC[PAIR[b1]], la), fs, 'center', 700);
    }
  }
  ctx.restore();
  return P;
}

// ===== Kromoszóma körvonala (centroméra a 0 pontban) =====
function chromPts(len, w, cen, pinch = .42, N = 46) {
  const hw = w / 2, top = -cen * len, Lp = [], Rp = [];
  for (let k = 0; k <= N; k++) {
    const y = top + k / N * len, d = Math.min(y - top, top + len - y);
    let h = d < hw ? Math.sqrt(Math.max(0, hw * hw - (hw - d) * (hw - d))) : hw;
    h *= 1 - pinch * Math.exp(-Math.pow(y / (w * .6), 2));
    Lp.push([-h, y]); Rp.push([h, y]);
  }
  return Lp.concat(Rp.reverse());
}
function pathPts(ctx, pts, dx = 0, dy = 0) { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0] + dx, p[1] + dy) : ctx.moveTo(p[0] + dx, p[1] + dy)); ctx.closePath(); }
const svgPath = (pts, dx = 0) => 'M' + pts.map(p => (p[0] + dx).toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'Z';

// egy kromatida rajza vásznon (lokális koordinátákban, centroméra = 0,0)
function drawChromatid(ctx, len, w, cen, seed, a, col = C.cyan, pinch = .42) {
  const pts = chromPts(len, w, cen, pinch), R = rng(seed);
  ctx.save(); ctx.globalAlpha *= a;
  pathPts(ctx, pts);
  const g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
  g.addColorStop(0, '#0e3a78'); g.addColorStop(.45, '#2a7fd0'); g.addColorStop(1, '#0b2d60');
  ctx.fillStyle = g; ctx.fill();
  ctx.save(); ctx.clip();
  // feltekeredett fonalak érzete
  ctx.strokeStyle = 'rgba(140,215,255,.32)'; ctx.lineWidth = Math.max(1, w * .035);
  const top = -cen * len;
  for (let i = 0; i < len * 1.4 / w * 9; i++) {
    const x = (R() - .5) * w, y = top + R() * len, r = w * (.08 + R() * .14);
    ctx.beginPath(); ctx.arc(x, y, r, R() * TAU, R() * TAU + 3.5); ctx.stroke();
  }
  // csíkok
  ctx.fillStyle = 'rgba(3,12,32,.42)';
  for (let i = 0; i < 6 + len / w * 1.2; i++) { const y = top + R() * len, hh = len * (.012 + R() * .03); ctx.fillRect(-w, y, w * 2, hh); }
  ctx.restore();
  ctx.strokeStyle = rgba(col, .95); ctx.lineWidth = Math.max(1.2, w * .045); pathPts(ctx, pts); ctx.stroke();
  ctx.restore();
}

// ===== Háttér: csillagmező + ködök =====
function drawSky() {
  const cv = $('#sky'), d = Math.min(devicePixelRatio || 1, 2);
  cv.width = innerWidth * d; cv.height = innerHeight * d;
  const ctx = cv.getContext('2d'); ctx.scale(d, d);
  const W = innerWidth, H = innerHeight, R = rng(11);
  const neb = [[.18, .25, C.blue, .10], [.82, .7, C.purple, .07], [.6, .15, C.cyan, .06], [.3, .85, C.green, .04]];
  for (const [x, y, c, a] of neb) { const g = ctx.createRadialGradient(x * W, y * H, 0, x * W, y * H, .45 * Math.max(W, H)); g.addColorStop(0, rgba(c, a)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  for (let i = 0; i < W * H / 2600; i++) {
    const x = R() * W, y = R() * H, s = R();
    ctx.fillStyle = `rgba(220,235,255,${.15 + s * .55})`; ctx.beginPath(); ctx.arc(x, y, .4 + s * s * 1.3, 0, TAU); ctx.fill();
  }
}
