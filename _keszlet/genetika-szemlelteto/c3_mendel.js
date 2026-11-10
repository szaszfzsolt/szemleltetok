
// =====================================================================
// 05 – Mendel kísérlete
// =====================================================================
const LILA = '#a65ee6', FEHER = '#f2eefa';
function flowerCv(ctx, x, y, s, purple, a = 1) {
  if (a <= .01) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = '#4c9a33'; ctx.lineWidth = Math.max(1.5, s * .08); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y + s * .2); ctx.quadraticCurveTo(x - s * .1, y + s * .7, x, y + s * 1.05); ctx.stroke();
  ctx.fillStyle = '#5aa83c'; ctx.beginPath(); ctx.ellipse(x + s * .2, y + s * .72, s * .22, s * .09, -.5, 0, TAU); ctx.fill();
  const c = purple ? LILA : FEHER, d = purple ? '#6b2fa8' : '#b9b2cc';
  for (let k = 0; k < 5; k++) {
    const an = -Math.PI / 2 + k * TAU / 5, px = x + Math.cos(an) * s * .3, py = y + Math.sin(an) * s * .3;
    const g = ctx.createRadialGradient(px, py, s * .02, px, py, s * .34); g.addColorStop(0, c); g.addColorStop(1, d);
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(px, py, s * .3, s * .21, an, 0, TAU); ctx.fill();
  }
  ctx.fillStyle = C.yellow; ctx.beginPath(); ctx.arc(x, y, s * .11, 0, TAU); ctx.fill();
  ctx.restore();
}
const gtCol = g => g.includes('A') ? C.orange : C.cyan;
function gtText(ctx, g, x, y, fs, a = 1) {
  ctx.save(); ctx.globalAlpha *= a; font(ctx, fs, 700, true, .04); ctx.textBaseline = 'middle';
  const w0 = ctx.measureText(g[0]).width, w1 = ctx.measureText(g[1]).width; let xx = x - (w0 + w1) / 2;
  ctx.shadowColor = 'rgba(0,0,0,.85)'; ctx.shadowBlur = 6; ctx.textAlign = 'left';
  ctx.fillStyle = gtCol(g[0]); ctx.fillText(g[0], xx, y); ctx.fillStyle = gtCol(g[1]); ctx.fillText(g[1], xx + w0, y);
  ctx.restore();
}
const MSTEP = [
  ['P – szülői nemzedék', 'Mendel tiszta vonalú lila virágú (AA) és fehér virágú (aa) borsót keresztezett.'],
  ['F1 – első nemzedék', 'Minden utód lila virágú lett (Aa). A fehér szín nem tűnt el: a recesszív allél rejtve tovább öröklődik.'],
  ['F2 – második nemzedék', 'Az F1 növényeket egymással keresztezte (Aa × Aa). Az utódok 3/4 része lila, 1/4 része fehér virágú lett.'],
];
SC.push({
  g: 2, title: 'Mendel kísérlete', short: 'Lila × fehér borsó: hová tűnik el a fehér szín?',
  txt: '<b>Gregor Mendel</b> borsónövényekkel tanulmányozta az öröklődést. A szülői nemzedéket <span class="k">P</span>-vel, az első utódnemzedéket <span class="k">F1</span>-gyel, a másodikat <span class="k">F2</span>-vel jelöljük. A szülői allélok keresztezése a <b>genetikai rekombináció</b>.',
  think: [
    ['Milyen virágúak lettek az F1 nemzedék növényei?', 'Mind lila virágúak (Aa): a lila szín domináns.'],
    ['Miért jelent meg újra a fehér szín az F2-ben?', 'Mert az F1 növények hordozták a recesszív „a” allélt. Ha két „a” találkozik (aa), a virág fehér.'],
    ['Mekkora az F2-ben a lila és a fehér virágú növények aránya?', '3/4 lila és 1/4 fehér, azaz 75% : 25%, vagyis 3 : 1.'],
  ],
  tip: ['or', 'Tudtad?', `<img class="tipimg" src="${ASSETS.mendel}" alt="Gregor Mendel">Gregor Mendel (1822–1884) szerzetes volt, a kolostorkertben több ezer borsónövénnyel kísérletezett. Az öröklődés szabályait több mint 150 éve fedezte fel.<span class="tipsrc">Fotó: Wikimedia Commons · közkincs</span>`],
  init(st, ct) {
    this.cv = Cv(st); this.s = 0; this.v = 0; this.L = 0; this.F = 0; this.field = [];
    this.sg = seg(['P', 'F1', 'F2'], i => { this.s = i; this.upd(); });
    this.bs = btn('+100 F2 mag', () => this.sow(100), 'o');
    ct.append(navBtn(-1, () => { this.s = Math.max(0, this.s - 1); this.upd(); }), this.sg, navBtn(1, () => { this.s = Math.min(2, this.s + 1); this.upd(); }), this.bs, btn(I.reset + 'Újra', () => { this.L = this.F = 0; this.field = []; UI.data(this); }));
    this.ph = photoLayer(st, ct, () => 'virag'); this.ph.upd();
    this.upd();
  },
  sow(n) {
    if (this.s < 2) { this.s = 2; this.upd(); }
    for (let i = 0; i < n; i++) { const g = (Math.random() < .5 ? 'A' : 'a') + (Math.random() < .5 ? 'A' : 'a'); const p = g.includes('A'); p ? this.L++ : this.F++; if (this.field.length < 300) this.field.push(p); }
    UI.data(this);
  },
  space() { if (this.s < 2) { this.s++; this.upd(); } else this.sow(100); },
  upd() { this.sg.set(this.s); this.bs.style.display = this.s === 2 ? '' : 'none'; UI.data(this); },
  data() {
    const m = MSTEP[this.s], n = this.L + this.F;
    let h = `<div class="dtitle">${m[0]}</div><div class="dsub">${m[1]}</div>`;
    if (this.s === 2) h += drow('Genotípus', '1 AA : 2 Aa : 1 aa') + drow('Fenotípus', '3 lila : 1 fehér', C.green);
    if (this.s === 2 && n) h += drow(`Elvetett magok (${n})`, `${this.L} lila · ${this.F} fehér`, LILA) + drow('Arány', this.F ? (this.L / this.F).toFixed(2).replace('.', ',') + ' : 1' : '–', C.orange);
    return h;
  },
  tick(dt, T) {
    this.v += (this.s - this.v) * Math.min(1, dt * 4);
    const o = this.cv.fit(), ctx = o.ctx, W = o.w, H = o.h, fs = clamp(Math.min(W, H) * .034, 12, 28), field = this.s === 2;
    const LW = W * (this.v > 1.5 ? lerp(1, .56, clamp(this.v - 1, 0, 1)) : 1), s = Math.min(LW * .085, H * .1);
    const Y = [H * .15, H * .44, H * .72], al = i => clamp(this.v - i + 1, 0, 1);
    const row = (i, gts, lab) => {
      const a = al(i); if (a <= 0) return;
      text(ctx, lab, LW * .06, Y[i], C.green, fs * 1.4, 'center', 700);
      const n = gts.length, x0 = LW * .2, x1 = LW * .92;
      gts.forEach((g, j) => { const x = n === 1 ? (x0 + x1) / 2 : x0 + (x1 - x0) * (j + .5) / n; flowerCv(ctx, x, Y[i] - s * .25, s, g.includes('A'), a); gtText(ctx, g, x, Y[i] + s * 1.05, fs * 1.15, a); });
    };
    // P sor: két szülő × jellel
    if (al(0) > 0) {
      text(ctx, 'P', LW * .06, Y[0], C.green, fs * 1.4, 'center', 700);
      flowerCv(ctx, LW * .38, Y[0] - s * .25, s, true); gtText(ctx, 'AA', LW * .38, Y[0] + s * 1.05, fs * 1.15);
      text(ctx, '×', LW * .56, Y[0], C.text, fs * 1.6, 'center', 700);
      flowerCv(ctx, LW * .74, Y[0] - s * .25, s, false); gtText(ctx, 'aa', LW * .74, Y[0] + s * 1.05, fs * 1.15);
    }
    const arrow = (i) => { const a = al(i + 1); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = rgba(C.text, .35); ctx.lineWidth = 2; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(LW * .56, Y[i] + s * 1.5); ctx.lineTo(LW * .56, Y[i + 1] - s * .85); ctx.stroke(); ctx.restore(); };
    arrow(0); arrow(1);
    row(1, ['Aa', 'Aa', 'Aa', 'Aa'], 'F1');
    row(2, ['AA', 'Aa', 'Aa', 'aa'], 'F2');
    if (al(1) > .9 && this.s === 1) text(ctx, '100% lila', LW * .56, Y[1] + s * 1.9, LILA, fs, 'center', 700);
    if (al(2) > .9) text(ctx, '3/4 lila : 1/4 fehér', LW * .56, Y[2] + s * 1.9, C.green, fs, 'center', 700);
    // F2 mező
    if (field && this.v > 1.5) {
      const a = clamp((this.v - 1.5) * 2, 0, 1), fx = W * .6, fw = W * .37, fy = H * .14, fh = H * .72;
      ctx.save(); ctx.globalAlpha *= a;
      ctx.fillStyle = 'rgba(40,70,30,.18)'; ctx.strokeStyle = 'rgba(90,168,60,.4)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(fx, fy, fw, fh, 12); ctx.fill(); ctx.stroke();
      text(ctx, 'AZ F2 NEMZEDÉK A KERTBEN', fx + fw / 2, fy - fs * .9, C.text, fs, 'center', 700);
      const cols = 15, cw = fw / cols, rs = Math.min(cw * .9, fh / 20);
      this.field.forEach((p, i) => { const r = Math.floor(i / cols), c = i % cols; if (r < 20) flowerCv(ctx, fx + cw * (c + .5), fy + fh / 20 * (r + .45), rs * .9, p); });
      if (!this.field.length) text(ctx, 'Vess magokat a „+100 F2 mag” gombbal!', fx + fw / 2, fy + fh / 2, C.dim, fs * .9, 'center', 600);
      const n = this.L + this.F;
      if (n) text(ctx, `${this.L} lila : ${this.F} fehér ≈ ${(this.L / Math.max(1, this.F)).toFixed(1).replace('.', ',')} : 1`, fx + fw / 2, fy + fh + fs * 1.2, C.orange, fs * 1.05, 'center', 700);
      ctx.restore();
    }
  },
});

// =====================================================================
// 06 – Punnett-tábla
// =====================================================================
const CROSS = [['AA', 'aa'], ['Aa', 'Aa'], ['Aa', 'aa'], ['AA', 'Aa']];
const norm = g => g.split('').sort((a, b) => (a === 'A' ? 0 : 1) - (b === 'A' ? 0 : 1)).join('');
const OPTS = ['?', 'AA', 'Aa', 'aa'];
SC.push({
  g: 2, title: 'Töltsd ki a Punnett-táblát!', short: 'Minden szülő egy allélt ad – számold ki az utódokat!',
  txt: 'A <span class="k">Punnett-tábla</span> segítségével kiszámolhatjuk, milyen genotípusú utódok születhetnek, és mekkora valószínűséggel. Az oldalakra a szülők <b>ivarsejtjeit</b> írjuk: mindegyik ivarsejt a két allél közül <b>csak egyet</b> visz magával.',
  think: [
    ['Hány allélt visz magával egy ivarsejt egy génből?', 'Csak egyet a kettő közül, mert az ivarsejt haploid.'],
    ['Aa × aa keresztezésnél milyen arányban lesznek fehér virágú utódok?', '50%-ban (2/4): a fele Aa (lila), a fele aa (fehér).'],
    ['Születhet-e fehér virágú utód, ha az egyik szülő AA?', 'Nem: az AA szülő minden utódnak A allélt ad, így minden utód lila lesz.'],
  ],
  tip: ['cy', 'Így dolgozz', '1. Írd fel a szülők ivarsejtjeit az oldalakra. 2. Minden négyzetbe írd be a sorának és az oszlopának az allélját. 3. Számold meg, hány négyzetben milyen genotípus van: egy négyzet = 1/4 = 25%.'],
  init(st, ct) {
    this.c = 1; this.v = ['?', '?', '?', '?']; this.chk = false;
    st.innerHTML = `<svg class="svgfull" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet"></svg>`; this.svg = st.querySelector('svg');
    this.sc = seg(CROSS.map(c => `${c[0]} × ${c[1]}`), i => { this.c = i; this.v = ['?', '?', '?', '?']; this.chk = false; this.upd(); }, 'nc');
    ct.append(labeled('Keresztezés', this.sc), btn('Ellenőrzés', () => { this.chk = true; this.upd(); }, 'o'), btn('Megoldás', () => { this.v = this.sol(); this.chk = true; this.upd(); }), btn(I.reset + 'Törlés', () => { this.v = ['?', '?', '?', '?']; this.chk = false; this.upd(); }));
    this.svg.addEventListener('click', e => { const g = e.target.closest('[data-i]'); if (!g) return; const i = +g.dataset.i; this.v[i] = OPTS[(OPTS.indexOf(this.v[i]) + 1) % 4]; this.chk = false; this.upd(); });
    this.upd();
  },
  sol() { const [m, f] = CROSS[this.c]; return [0, 1, 2, 3].map(i => norm(m[i >> 1] + f[i & 1])); },
  space() { const i = this.v.findIndex((x, j) => x !== this.sol()[j]); if (i >= 0) { this.v[i] = this.sol()[i]; this.chk = true; this.upd(); } },
  upd() {
    this.sc.set(this.c);
    const [m, f] = CROSS[this.c], sol = this.sol(), ok = this.v.every((x, i) => x === sol[i]);
    const ph = g => g.includes('A') ? 'lila' : 'fehér';
    const gx = 420, gy = 175, cw = 200, ch = 180;
    const gt = (g, x, y, fs) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="${fs}">${g.split('').map(a => `<tspan fill="${gtCol(a)}">${a}</tspan>`).join('')}</text>`;
    let h = svgBox(20, 30, 290, 540) + svgT(165, 74, 'SZÜLŐK', 24, C.dim, { ls: 3 });
    h += svgT(165, 130, 'ANYA', 26, GIRL, { ls: 2 }) + gt(m, 165, 190, 64) + svgT(165, 226, ph(m) + ' virágú', 22, C.dim, { w: 600 });
    h += svgT(165, 290, '×', 50, C.text);
    h += svgT(165, 360, 'APA', 26, BOY, { ls: 2 }) + gt(f, 165, 420, 64) + svgT(165, 456, ph(f) + ' virágú', 22, C.dim, { w: 600 });
    h += svgT(165, 530, 'Koppints a négyzetekre!', 20, C.faint, { w: 600 });
    // fejlécek: ivarsejtek
    h += svgT(gx + cw, 60, 'AZ APA IVARSEJTJEI', 22, BOY, { ls: 2 });
    for (let j = 0; j < 2; j++) h += `<circle cx="${gx + cw * (j + .5)}" cy="125" r="34" fill="rgba(10,24,52,.8)" stroke="${BOY}" stroke-width="3"/>` + gt(f[j], gx + cw * (j + .5), 141, 46);
    h += svgT(352, gy + ch - 8, 'AZ ANYA', 20, GIRL, { ls: 2 }) + svgT(352, gy + ch + 18, 'IVARSEJTJEI', 20, GIRL, { ls: 2 });
    for (let i = 0; i < 2; i++) h += `<circle cx="352" cy="${gy + ch * (i + .5) + (i ? 46 : -46)}" r="34" fill="rgba(10,24,52,.8)" stroke="${GIRL}" stroke-width="3"/>` + gt(m[i], 352, gy + ch * (i + .5) + (i ? 46 : -46) + 16, 46);
    for (let i = 0; i < 4; i++) {
      const r = i >> 1, c = i & 1, x = gx + c * cw, y = gy + r * ch, v = this.v[i];
      const good = v === sol[i], stroke = this.chk && v !== '?' ? (good ? C.green : C.red) : 'rgba(110,170,255,.4)';
      const fill = v === '?' ? 'rgba(10,24,52,.6)' : v.includes('A') ? rgba(LILA, .22) : rgba(FEHER, .12);
      h += `<g data-i="${i}" style="cursor:pointer"><rect x="${x + 6}" y="${y + 6}" width="${cw - 12}" height="${ch - 12}" rx="14" fill="${fill}" stroke="${stroke}" stroke-width="${this.chk && v !== '?' ? 4 : 2}" ${v === '?' ? 'stroke-dasharray="8 6"' : ''}/>`;
      h += v === '?' ? svgT(x + cw / 2, y + ch / 2 + 22, '?', 64, C.faint) : gt(v, x + cw / 2, y + ch / 2 + 6, 64) + svgT(x + cw / 2, y + ch / 2 + 46, ph(v), 24, v.includes('A') ? LILA : FEHER, { w: 600 });
      h += `</g>`;
    }
    // eredmény
    if (this.chk && ok) {
      const cnt = k => sol.filter(x => x === k).length, nL = sol.filter(x => x.includes('A')).length;
      const g = ['AA', 'Aa', 'aa'].filter(k => cnt(k)).map(k => `${cnt(k)} ${k}`).join(' : ');
      h += svgBox(850, 175, 140, 360, { s: rgba(C.green, .6) }) + svgT(920, 215, 'KÉSZ!', 30, C.green, { ls: 2 });
      h += svgT(920, 270, 'GENOTÍPUS', 18, C.dim, { ls: 2 }) + svgT(920, 305, g, 24, C.text);
      h += svgT(920, 370, 'FENOTÍPUS', 18, C.dim, { ls: 2 }) + svgT(920, 405, `${nL} lila`, 26, LILA) + svgT(920, 437, `${4 - nL} fehér`, 26, FEHER);
      h += svgT(920, 500, `${nL * 25}% : ${(4 - nL) * 25}%`, 26, C.orange);
    } else if (this.chk) {
      const bad = this.v.filter((x, i) => x !== sol[i]).length;
      h += svgT(gx + cw, 585, this.v.includes('?') ? 'Tölts ki minden négyzetet!' : `${bad} négyzet még hibás – próbáld újra!`, 26, C.red);
    }
    this.svg.innerHTML = h; UI.data(this);
  },
  data() {
    const [m, f] = CROSS[this.c], sol = this.sol(), ok = this.chk && this.v.every((x, i) => x === sol[i]);
    const nL = sol.filter(x => x.includes('A')).length;
    return `<div class="dtitle">Keresztezés</div><div class="dbig">${m} × ${f}</div><div class="dsub">A = lila (domináns), a = fehér (recesszív)</div>${drow('Anya ivarsejtjei', `${m[0]} vagy ${m[1]}`, GIRL)}${drow('Apa ivarsejtjei', `${f[0]} vagy ${f[1]}`, BOY)}${ok ? drow('Lila utód esélye', nL * 25 + '%', LILA) : drow('Állapot', 'kitöltésre vár', C.dim)}`;
  },
});

// =====================================================================
// 07 – Vércsoportok (ABO)
// =====================================================================
const BG = [['AA', 'LᴬLᴬ'], ['Ao', 'Lᴬℓ'], ['BB', 'LᴮLᴮ'], ['Bo', 'Lᴮℓ'], ['AB', 'LᴬLᴮ'], ['oo', 'ℓℓ']];
const AL = { A: 'Lᴬ', B: 'Lᴮ', o: 'ℓ' };
const bgOf = g => g.includes('A') && g.includes('B') ? 'AB' : g.includes('A') ? 'A' : g.includes('B') ? 'B' : '0';
const BGC = { A: C.orange, B: C.cyan, AB: C.purple, '0': C.green };
const bgNorm = g => g.split('').sort((a, b) => 'ABo'.indexOf(a) - 'ABo'.indexOf(b)).join('');
const gtL = g => g.split('').map(a => AL[a]).join('');
const drop = (x, y, r, col, lab) => `<path d="M${x} ${y - r * 1.45} C ${x + r * .5} ${y - r * .75} ${x + r} ${y - r * .2} ${x + r} ${y + r * .25} A ${r} ${r} 0 1 1 ${x - r} ${y + r * .25} C ${x - r} ${y - r * .2} ${x - r * .5} ${y - r * .75} ${x} ${y - r * 1.45} Z" fill="${rgba(col, .28)}" stroke="${col}" stroke-width="3"/>` + svgT(x, y + r * .55, lab, r * (lab.length > 1 ? .8 : 1.05), col);
SC.push({
  g: 2, title: 'Vércsoportok öröklődése', short: 'A, B, AB vagy 0? Számold ki a gyerekek vércsoportját!',
  txt: 'Az ABO vércsoportot egy gén három allélja határozza meg: <span class="k">Lᴬ</span>, <span class="k">Lᴮ</span> és <span class="k">ℓ</span>. Az Lᴬ és az Lᴮ domináns a ℓ-lel szemben, egymás mellett pedig mindkettő megnyilvánul (AB). A 0-s vércsoport csak <b>ℓℓ</b> genotípusnál alakul ki.',
  think: [
    ['A szülők vércsoportja 0 és AB. Milyen vércsoportúak lehetnek a gyermekek?', 'A (Lᴬℓ) vagy B (Lᴮℓ), 50–50%-ban. 0-s és AB-s gyermekük nem születhet.'],
    ['Lehet-e két A vércsoportú szülőnek 0-s gyermeke?', 'Igen, ha mindkét szülő Lᴬℓ genotípusú: ilyenkor 25% az esély.'],
    ['Milyen genotípusú egy 0-s vércsoportú ember?', 'ℓℓ – a recesszív allélból két példány.'],
  ],
  tip: ['or', 'Rh-faktor', 'A vércsoportokhoz tartozik az Rh-faktor is: a D allél domináns (Rh+), a d recesszív. A dd genotípusú ember Rh-negatív.'],
  init(st, ct) {
    this.m = 5; this.f = 4;
    st.innerHTML = `<svg class="svgfull" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet"></svg>`; this.svg = st.querySelector('svg');
    this.sm = seg(BG.map(b => b[1]), i => { this.m = i; this.upd(); }, 'base'); this.sf = seg(BG.map(b => b[1]), i => { this.f = i; this.upd(); }, 'base');
    ct.append(labeled('Anya', this.sm), labeled('Apa', this.sf), btn(I.shuffle + 'Véletlen', () => this.space()));
    this.upd();
  },
  space() { this.m = Math.floor(Math.random() * 6); this.f = Math.floor(Math.random() * 6); this.upd(); },
  kids() { const m = BG[this.m][0], f = BG[this.f][0]; return [0, 1, 2, 3].map(i => bgNorm(m[i >> 1] + f[i & 1])); },
  upd() {
    this.sm.set(this.m); this.sf.set(this.f);
    const m = BG[this.m][0], f = BG[this.f][0], k = this.kids(), gx = 420, gy = 175, cw = 190, ch = 180;
    let h = svgBox(20, 30, 290, 260) + svgT(165, 72, 'ANYA', 26, GIRL, { ls: 2 }) + drop(165, 168, 46, BGC[bgOf(m)], bgOf(m)) + svgT(165, 270, gtL(m), 34, C.text);
    h += svgBox(20, 310, 290, 260) + svgT(165, 352, 'APA', 26, BOY, { ls: 2 }) + drop(165, 448, 46, BGC[bgOf(f)], bgOf(f)) + svgT(165, 550, gtL(f), 34, C.text);
    h += svgT(gx + cw, 60, 'AZ APA IVARSEJTJEI', 22, BOY, { ls: 2 });
    for (let j = 0; j < 2; j++) h += `<circle cx="${gx + cw * (j + .5)}" cy="125" r="34" fill="rgba(10,24,52,.8)" stroke="${BOY}" stroke-width="3"/>` + svgT(gx + cw * (j + .5), 140, AL[f[j]], 40, C.text);
    for (let i = 0; i < 2; i++) { const y = gy + ch * (i + .5); h += `<circle cx="358" cy="${y}" r="34" fill="rgba(10,24,52,.8)" stroke="${GIRL}" stroke-width="3"/>` + svgT(358, y + 15, AL[m[i]], 40, C.text); }
    k.forEach((g, i) => {
      const x = gx + (i & 1) * cw, y = gy + (i >> 1) * ch, b = bgOf(g);
      h += svgBox(x + 6, y + 6, cw - 12, ch - 12, { f: rgba(BGC[b], .1), s: rgba(BGC[b], .55) }) + drop(x + cw / 2, y + 70, 30, BGC[b], b) + svgT(x + cw / 2, y + 150, gtL(g), 30, C.text);
    });
    // összesítés
    const P = { A: 0, B: 0, AB: 0, '0': 0 }; k.forEach(g => P[bgOf(g)] += .25);
    h += svgT(905, 60, 'GYEREKEK', 22, C.dim, { ls: 2 });
    ['A', 'B', 'AB', '0'].forEach((b, i) => {
      const y = 100 + i * 118, w = 110 * P[b];
      h += svgT(845, y + 34, b, 34, BGC[b]) + `<rect x="870" y="${y + 10}" width="110" height="34" rx="6" fill="rgba(110,170,255,.12)"/><rect x="870" y="${y + 10}" width="${w}" height="34" rx="6" fill="${BGC[b]}"/>`;
      h += svgT(925, y + 74, P[b] ? `${P[b] * 100}%` : 'nem lehet', 24, P[b] ? C.text : C.faint, { w: 600 });
    });
    this.svg.innerHTML = h; UI.data(this);
  },
  data() {
    const m = BG[this.m][0], f = BG[this.f][0], k = this.kids(), set = [...new Set(k.map(bgOf))];
    const no = ['A', 'B', 'AB', '0'].filter(b => !set.includes(b));
    return `<div class="dtitle">Család</div>${drow('Anya', `${bgOf(m)} (${gtL(m)})`, BGC[bgOf(m)])}${drow('Apa', `${bgOf(f)} (${gtL(f)})`, BGC[bgOf(f)])}${drow('Lehetséges', set.join(', '), C.green)}${drow('Nem születhet', no.length ? no.join(', ') : '–', C.red)}`;
  },
});
