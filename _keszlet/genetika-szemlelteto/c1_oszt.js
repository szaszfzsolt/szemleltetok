
// =====================================================================
// 01 – Mitózis és meiózis
// =====================================================================
// egyszerűsített modell: 2 kromoszómapár (2n = 4); anyai = kék, apai = narancs
const MCH = [{ p: 0, m: 1, len: .34 }, { p: 0, m: 0, len: .34 }, { p: 1, m: 1, len: .22 }, { p: 1, m: 0, len: .22 }];
const MW = .072;
const MBASE = [[-.3, -.1, .35], [.24, .14, -.45], [-.04, .36, 1.25], [.3, -.3, .2]];
// lépésenként: sejtek [x, y, rx, ry] + kromatidák [kromoszóma][kromatida] = [x, y, rot, alfa]
function mLayout(meio, s) {
  const out = { cells: [], ch: [] }, off = (r, k) => [Math.cos(r) * k, Math.sin(r) * k];
  const put = (c, j, x, y, rot = 0, a = 1) => { (out.ch[c] = out.ch[c] || [])[j] = [x, y, rot, a]; };
  if (s <= 1) {
    out.cells = [[0, 0, .78, .78]];
    MCH.forEach((c, i) => { const [x, y, r] = MBASE[i]; const [dx, dy] = off(r, MW * .55 * s); put(i, 0, x - dx, y - dy, r); put(i, 1, x + dx, y + dy, r, s); });
    return out;
  }
  if (!meio) {
    const Y = [-.47, -.11, .2, .44];
    if (s === 2) { out.cells = [[0, 0, .82, .8]]; MCH.forEach((c, i) => { put(i, 0, -MW * .55, Y[i]); put(i, 1, MW * .55, Y[i]); }); }
    if (s === 3) { out.cells = [[0, 0, 1.08, .78]]; MCH.forEach((c, i) => { put(i, 0, -.64, Y[i] * .9); put(i, 1, .64, Y[i] * .9); }); }
    if (s === 4) { out.cells = [[-.86, 0, .62, .62], [.86, 0, .62, .62]]; MCH.forEach((c, i) => { const [x, y, r] = MBASE[i]; put(i, 0, -.86 + x * .72, y * .72, r); put(i, 1, .86 + x * .72, y * .72, r); }); }
    return out;
  }
  const PY = [-.28, -.28, .3, .3];
  if (s === 2) { out.cells = [[0, 0, .82, .8]]; MCH.forEach((c, i) => { const x = c.m ? -.13 : .13; put(i, 0, x - MW * .55, PY[i]); put(i, 1, x + MW * .55, PY[i]); }); }
  if (s === 3) { out.cells = [[-.86, 0, .62, .62], [.86, 0, .62, .62]]; MCH.forEach((c, i) => { const x = c.m ? -.86 : .86; put(i, 0, x - MW * .55, PY[i] * .8); put(i, 1, x + MW * .55, PY[i] * .8); }); }
  if (s === 4) {
    const X4 = [-1.26, -.42, .42, 1.26]; out.cells = X4.map(x => [x, 0, .37, .37]);
    MCH.forEach((c, i) => { const base = c.m ? 0 : 2; const dx = c.p ? -.07 : .1, dy = c.p ? -.04 : .05; put(i, 0, X4[base] + dx, dy); put(i, 1, X4[base + 1] + dx, dy); });
  }
  return out;
}
const MST = [
  [['Anyasejt (2n)', 'Egy testi sejt két kromoszómapárral. Minden párból az egyik kromoszóma az anyától (kék), a másik az apától (narancs) származik.'],
   ['A DNS megkettőződik', 'Osztódás előtt a DNS megkettőződik: az egykromatidás kromoszómák kétkromatidássá válnak.'],
   ['A kromoszómák a sejt közepén', 'Az osztódási orsó fonalai a centromérához kapcsolódnak, a kromoszómák a sejt közepén sorakoznak.'],
   ['A kromatidák szétválnak', 'A fonalak a testvérkromatidákat a sejt két pólusára húzzák.'],
   ['Két leánysejt (2n)', 'Két leánysejt keletkezik. Kromoszómaszámuk és genetikai anyaguk azonos az anyasejtével.']],
  [['Anyasejt (2n)', 'Egy ivarszervben lévő sejt két kromoszómapárral: anyai (kék) és apai (narancs) kromoszómák.'],
   ['A DNS megkettőződik', 'A meiózis előtt is megkettőződik a DNS: minden kromoszóma két kromatidából áll.'],
   ['Párba rendeződés, géncsere', 'A homológ kromoszómák párba állnak. Az anyai és az apai kromoszómák között géncsere történik: ez a rekombináció.'],
   ['1. meiózis: a párok szétválnak', 'A homológ párok tagjai két sejtbe kerülnek. A kromoszómaszám feleződik.'],
   ['2. meiózis: 4 ivarsejt (n)', 'A kromatidák is szétválnak. Négy ivarsejt keletkezik, mindegyikben fele annyi kromoszóma van, és mind különbözik.']],
];
SC.push({
  g: 0, title: 'Mitózis és meiózis', short: 'Két osztódás: az egyik megtartja, a másik felezi a kromoszómaszámot.',
  txt: 'A <span class="k">mitózis</span> olyan sejtosztódás, amelynek során a leánysejtek kromoszómaszáma megegyezik az anyasejtével (2n → 2n). A <span class="k">meiózis</span> számcsökkentő osztódás: az ivarszervekben zajlik, és fele annyi kromoszómás ivarsejtek keletkeznek (2n → n).',
  think: [
    ['Hol zajlik a meiózis?', 'Az ivarszervekben (petefészekben, herében), ivarsejtek képződésekor.'],
    ['Hány kromoszóma van egy emberi testi sejtben és egy ivarsejtben?', 'Testi sejtben 46 (2n), ivarsejtben 23 (n).'],
    ['Miért nem egyforma két testvér, ha ugyanazoktól a szülőktől származnak?', 'Mert a meiózisban a géncsere és a párok véletlenszerű szétválása miatt minden ivarsejt más génkombinációt kap.'],
    ['Növeli vagy csökkenti a rekombináció a faj változékonyságát?', 'Növeli: változatos ivarsejtek, így változatos utódok jönnek létre.'],
  ],
  tip: ['or', 'Szómagyarázat', 'A <span class="w">mitosz</span> görögül fonalat jelent (az osztódási orsó fonalairól). A <span class="w">meion</span> görögül kisebbet, csökkentettet jelent.'],
  init(st, ct) {
    this.cv = Cv(st); this.mode = 0; this.s = 0; this.v = 0; this.auto = false; this.ta = 0;
    this.pb = playBtn(() => this.space());
    this.sm = seg(['Mitózis', 'Meiózis'], i => { this.mode = i; this.s = 0; this.v = 0; this.stop(); this.upd(); });
    this.sg = seg(['1', '2', '3', '4', '5'], i => { this.s = i; this.stop(); this.upd(); }, 'base');
    ct.append(this.sm, this.pb, navBtn(-1, () => { this.s = Math.max(0, this.s - 1); this.stop(); this.upd(); }), this.sg, navBtn(1, () => { this.s = Math.min(4, this.s + 1); this.stop(); this.upd(); }));
    this.ph = photoLayer(st, ct, () => this.mode === 0 ? 'mitozis' : null, () => this.stop());
    this.sm.set(0); this.upd();
  },
  stop() { this.auto = false; this.pb.set(false); },
  space() { this.auto = !this.auto; this.pb.set(this.auto); this.ta = 0; if (this.auto && this.s === 4) { this.s = 0; this.v = 0; this.upd(); } },
  upd() { this.sg.set(this.s); this.ph && this.ph.upd(); UI.data(this); },
  data() {
    const x = MST[this.mode][this.s], mi = this.mode === 0;
    return `<div class="dtitle">${mi ? 'Mitózis' : 'Meiózis'} · ${this.s + 1}/5</div><div class="dbig">${x[0]}</div><div class="dsub">${x[1]}</div>
      ${drow('Kromoszómaszám (ember)', mi ? '46 → 46' : '46 → 23', mi ? C.cyan : C.orange)}${drow('Leánysejtek', mi ? '2 testi sejt' : '4 ivarsejt')}${drow('Hol zajlik?', mi ? 'testi sejtekben' : 'ivarszervekben')}`;
  },
  tick(dt, T) {
    if (this.auto) { this.ta += dt; if (this.ta > 3.2) { this.ta = 0; if (this.s < 4) { this.s++; this.upd(); } else this.stop(); } }
    const d = this.s - this.v; this.v += Math.sign(d) * Math.min(Math.abs(d), dt * (Math.abs(d) > 1.5 ? 3 : .9));
    const o = this.cv.fit(), ctx = o.ctx, W = o.w, H = o.h, cx = W / 2, cy = H * .53, S = Math.min(W / (3.3 + (this.mode ? .3 * clamp(this.v - 3, 0, 1) : 0)), H / 2.15), fs = clamp(Math.min(W, H) * .034, 12, 28);
    const meio = this.mode === 1, k = Math.min(3, Math.floor(this.v + 1e-6)), f = ease(this.v - k);
    const A = mLayout(meio, k), B = mLayout(meio, k + 1);
    // sejtek (átúsztatással)
    for (const [L, a] of [[A, 1 - f], [B, f]]) for (const c of L.cells) cellShape(ctx, cx + c[0] * S, cy + c[1] * S, c[2] * S, c[3] * S, a);
    // osztódási orsó
    const sp = meio ? clamp(1 - Math.abs(this.v - 2.5) / 1.1, 0, 1) : clamp(1 - Math.abs(this.v - 2.5) / 1.1, 0, 1);
    const P = [];
    MCH.forEach((c, i) => [0, 1].forEach(j => {
      const a = A.ch[i][j], b = B.ch[i][j];
      P.push({ i, j, x: lerp(a[0], b[0], f), y: lerp(a[1], b[1], f), r: lerp(a[2], b[2], f), al: lerp(a[3], b[3], f) });
    }));
    if (sp > .01) {
      const px = (meio ? .95 : 1.02) * S * (this.v > 3 && meio ? 1 : 1);
      ctx.save(); ctx.strokeStyle = rgba(C.text, .28 * sp); ctx.lineWidth = 1.2;
      for (const q of P) {
        const left = meio ? MCH[q.i].m === 1 : q.j === 0;
        ctx.beginPath(); ctx.moveTo(cx + (left ? -px : px), cy); ctx.lineTo(cx + q.x * S, cy + q.y * S); ctx.stroke();
      }
      for (const sx of [-1, 1]) { ctx.fillStyle = rgba(C.yellow, .8 * sp); ctx.beginPath(); ctx.arc(cx + sx * px, cy, S * .03, 0, TAU); ctx.fill(); }
      ctx.restore();
    }
    // kromatidák
    const gx = meio ? clamp((this.v - 1.4) / .6, 0, 1) : 0;
    for (const q of P) {
      const c = MCH[q.i], col = c.m ? C.cyan : C.orange, x = cx + q.x * S, y = cy + q.y * S, len = c.len * S, w = MW * S;
      chromo(ctx, x, y, len, w, col, q.al, q.r);
      // géncsere: a belső kromatidák karjának vége kicserélődik
      const inner = (c.m && q.j === 1) || (!c.m && q.j === 0);
      if (gx > 0 && inner && q.al > .1) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(q.r); pathPts(ctx, chromPts(len, w, .4, .36, 28)); ctx.clip();
        ctx.globalAlpha *= gx * q.al; ctx.fillStyle = c.m ? C.orange : C.cyan; ctx.fillRect(-w, len * .32, w * 2, len * .3); ctx.restore();
      }
    }
    // feliratok
    const st = MST[this.mode][this.s];
    text(ctx, st[0], cx, H * .06, C.text, fs * 1.15, 'center', 700, true, .06);
    if (Math.abs(d) < .01) {
      if (this.s === 4) {
        const Lc = mLayout(meio, 4).cells;
        Lc.forEach(c => text(ctx, meio ? 'n = 2' : '2n = 4', cx + c[0] * S, cy + (c[1] + c[3]) * S + fs * 1.1, meio ? C.orange : C.green, fs, 'center', 700));
      } else if (this.s <= 1) text(ctx, '2n = 4', cx, cy + .78 * S + fs * 1.1, C.green, fs, 'center', 700);
      if (this.s === 1) { const q = P.find(p => p.i === 0 && p.j === 1); label(ctx, 'Két kromatida', cx + q.x * S + MW * S * .5, cy + q.y * S + MCH[0].len * S * .3, cx + S * .95, cy - S * .55, C.text, fs * .9); }
      if (this.s === 2 && meio) label(ctx, 'Géncsere', cx + (-.13 + MW * .55) * S, cy + (-.28 + .14) * S, cx + S * .9, cy - S * .6, C.yellow, fs * .9);
      if (this.s === 2 && !meio) label(ctx, 'Osztódási orsó', cx + .6 * S, cy + .05 * S, cx + S * 1.05, cy - S * .62, C.yellow, fs * .9);
    }
    if (H > 420) text(ctx, 'Egyszerűsített modell: 2 kromoszómapár (az embernél 23 pár)', cx, H * .965, C.faint, fs * .8, 'center', 500);
    let lx = W * .03; const ly = H * .05;
    if (W > 560) for (const [t, c] of [['anyai', C.cyan], ['apai', C.orange]]) { ctx.fillStyle = c; ctx.fillRect(lx, ly - fs * .3, fs * .6, fs * .6); text(ctx, t, lx + fs * .8, ly, C.dim, fs * .8, 'left', 600); lx += fs * 4; }
  },
});

// =====================================================================
// 02 – Megtermékenyítés
// =====================================================================
const ZR = (() => { const R = rng(31); return [...Array(200)].map(() => ({ a: R() * TAU, d: Math.sqrt(R()) * .82, r: R() * 3, l: .7 + R() * .6 })); })();
function rods(ctx, x, y, r, n, col, off = 0, a = 1) {
  ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1.2, r * .055); ctx.strokeStyle = col;
  const m = Math.min(n, 92);
  for (let i = 0; i < m; i++) { const z = ZR[(i + off) % ZR.length], px = x + Math.cos(z.a) * z.d * r, py = y + Math.sin(z.a) * z.d * r, L = r * .13 * z.l; ctx.beginPath(); ctx.moveTo(px - Math.cos(z.r) * L, py - Math.sin(z.r) * L); ctx.lineTo(px + Math.cos(z.r) * L, py + Math.sin(z.r) * L); ctx.stroke(); }
  ctx.restore();
}
SC.push({
  g: 0, title: 'Megtermékenyítés', short: '23 + 23 = 46: így lesz a zigóta.',
  txt: 'Az <span class="k">ivarsejtek</span> (gaméták) haploidok: 23 kromoszómájuk van. A <b>petesejt</b> a petefészekben, a <b>spermium</b> a herékben képződik. A megtermékenyítéskor egyesülnek, és létrejön a <span class="k">zigóta</span>: az új egyed első, egysejtes létformája, újra 46 kromoszómával.',
  think: [
    ['Mi történne, ha a megtermékenyítést nem előzné meg a számcsökkentés?', 'A kromoszómaszám nemzedékről nemzedékre megduplázódna: 92, 184, 368… Ezért szükséges a meiózis.'],
    ['Melyik szülőtől kapjuk a kromoszómáink felét?', 'Mindkettőtől: 23 kromoszómát az anyától (petesejt), 23-at az apától (spermium).'],
    ['Mi a különbség a zigóta és az ivarsejt kromoszómaszáma között?', 'A zigóta diploid (46, 2n), az ivarsejt haploid (23, n).'],
  ],
  tip: ['or', 'Tudtad?', 'Noha a petesejt jóval nagyobb a spermiumnál, kromoszómaszáma ugyanannyi: normálisan 23.'],
  init(st, ct) {
    this.cv = Cv(st); this.mode = 0; this.t = 0; this.play = false; this.gen = 0;
    this.pb = playBtn(() => this.space());
    this.sm = seg(['Számcsökkentéssel', 'Számcsökkentés nélkül'], i => { this.mode = i; this.gen = 0; this.t = 0; this.play = false; this.pb.set(false); this.upd(); });
    this.bg = btn(I.next + 'Következő nemzedék', () => { this.gen = Math.min(4, this.gen + 1); this.t = 0; this.play = true; this.pb.set(true); UI.data(this); });
    ct.append(this.pb, this.sm, btn(I.reset + 'Újra', () => { this.t = 0; this.gen = 0; this.play = false; this.pb.set(false); UI.data(this); }), this.bg);
    this.ph = photoLayer(st, ct, () => 'spermium', () => { this.play = false; this.pb.set(false); }); this.ph.upd();
    this.sm.set(0); this.upd();
  },
  space() { if (this.t >= 1) this.t = 0; this.play = !this.play; this.pb.set(this.play); },
  upd() { this.bg.style.display = this.mode ? '' : 'none'; UI.data(this); },
  nums() { const g = this.mode ? 46 * Math.pow(2, this.gen) : 23; return [g, g * 2]; },
  data() {
    const [g, z] = this.nums();
    if (!this.mode) return `<div class="dtitle">Kromoszómaszámok</div>${drow('Petesejt (n)', '23 = 22 + X', C.cyan)}${drow('Spermium (n)', '23 = 22 + X vagy Y', C.orange)}${drow('Zigóta (2n)', '46', C.green)}<div class="dsub" style="margin-top:.5rem">A meiózis felezi, a megtermékenyítés helyreállítja a kromoszómaszámot.</div>`;
    return `<div class="dtitle">Mi lenne, ha…</div><div class="dbig" style="color:${C.red}">${z} kromoszóma</div><div class="dsub">${this.gen + 1}. nemzedék zigótája, ha az ivarsejtek nem feleznék a kromoszómaszámot.</div>${drow('Ivarsejt', g)}${drow('Zigóta', z, C.red)}`;
  },
  tick(dt, T) {
    if (this.play) { this.t = Math.min(1, this.t + dt / 5); if (this.t >= 1) { this.play = false; this.pb.set(false); } }
    const o = this.cv.fit(), ctx = o.ctx, W = o.w, H = o.h, fs = clamp(Math.min(W, H) * .035, 12, 28), [g, z] = this.nums(), bad = this.mode === 1;
    const ex = W * .62, ey = H * .5, er = Math.min(H * .34, W * .24);
    // petesejt + sugárkoszorú
    ctx.save();
    const cg = ctx.createRadialGradient(ex, ey, er * .9, ex, ey, er * 1.25); cg.addColorStop(0, rgba(C.yellow, .16)); cg.addColorStop(1, rgba(C.yellow, 0));
    ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(ex, ey, er * 1.25, 0, TAU); ctx.fill(); ctx.restore();
    cellShape(ctx, ex, ey, er, er, 1, C.purple);
    const t = this.t, sIn = clamp((t - .05) / .5, 0, 1), merge = clamp((t - .58) / .25, 0, 1), done = clamp((t - .85) / .12, 0, 1);
    // spermium
    const hx = lerp(W * .07, ex - er * .98, ease(sIn)), hy = ey + Math.sin(T * 6) * H * .02 * (1 - sIn), hr = er * .09;
    if (merge < 1) {
      ctx.save(); ctx.globalAlpha *= 1 - merge;
      ctx.strokeStyle = rgba(C.orange, .8); ctx.lineWidth = Math.max(1.5, hr * .18); ctx.beginPath();
      for (let k = 0; k <= 40; k++) { const u = k / 40, x = hx - hr * 1.2 - u * er * .75, y = hy + Math.sin(u * 9 - T * 14) * hr * .45 * u; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
      ctx.fillStyle = rgba(C.orange, .35); ctx.strokeStyle = C.orange; ctx.beginPath(); ctx.ellipse(hx, hy, hr * 1.3, hr, 0, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    // sejtmagok
    const nr = er * .3, mx = ex - er * .32, my = ey - er * .05, fx = lerp(hx, ex + er * .28, merge), fy = lerp(hy, ey + er * .1, merge);
    const zx = ex, zy = ey;
    if (done < 1) {
      const a = 1 - done;
      const ax = lerp(mx, zx, done), bx = lerp(fx, zx, done);
      ctx.save(); ctx.globalAlpha *= a;
      ctx.fillStyle = 'rgba(30,20,80,.75)'; ctx.strokeStyle = C.purple; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ax, my, nr, 0, TAU); ctx.fill(); ctx.stroke();
      rods(ctx, ax, my, nr, Math.min(g, 92), C.cyan);
      const fr = lerp(hr * .8, nr, merge);
      if (merge > 0) { ctx.fillStyle = 'rgba(60,30,10,.7)'; ctx.strokeStyle = C.orange; ctx.beginPath(); ctx.arc(bx, fy, fr, 0, TAU); ctx.fill(); ctx.stroke(); rods(ctx, bx, fy, fr, Math.min(g, 92), C.orange, 97, merge); }
      ctx.restore();
    }
    if (done > 0) {
      ctx.save(); ctx.globalAlpha *= done;
      ctx.fillStyle = 'rgba(30,20,80,.8)'; ctx.strokeStyle = bad ? C.red : C.green; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(zx, zy, nr * 1.25, 0, TAU); ctx.fill(); ctx.stroke();
      rods(ctx, zx, zy, nr * 1.25, Math.min(g, 46), C.cyan); rods(ctx, zx, zy, nr * 1.25, Math.min(g, 46), C.orange, 97);
      ctx.restore();
    }
    // feliratok
    const lab = (s, x, y, c) => text(ctx, s, x, y, c, fs, 'center', 700);
    if (t < .58) {
      lab(`PETESEJT · ${g}`, mx, my - nr - fs * .9, C.cyan);
      lab(`SPERMIUM · ${g}`, hx, hy - hr * 2 - fs * .5, C.orange);
    } else if (done < .5) lab(`${g} + ${g}`, ex, ey - nr * 1.3 - fs, C.text);
    if (done > .5) { lab(`ZIGÓTA · ${z}`, zx, zy - nr * 1.25 - fs, bad ? C.red : C.green); text(ctx, bad ? `${z} kromoszóma – nemzedékről nemzedékre kétszer annyi!` : '46 kromoszóma (2n) – újra annyi, mint a szülők testi sejtjeiben', W / 2, H * .93, bad ? C.red : C.dim, fs * .9, 'center', 600); }
    text(ctx, bad ? `HA NEM LENNE MEIÓZIS · ${this.gen + 1}. NEMZEDÉK` : 'MEGTERMÉKENYÍTÉS', W / 2, H * .06, bad ? C.red : C.text, fs * 1.05, 'center', 700);
    if (t === 0) text(ctx, 'Indítsd el a ▶ gombbal!', W * .2, H * .82, C.faint, fs * .9, 'center', 600);
  },
});
