
// =====================================================================
// 03 – A nemek genetikai meghatározása
// =====================================================================
function svgChrom(x, y, len, w, col, lab, fs = 30) {
  const pts = chromPts(len, w, .42, .3, 24).map(p => [p[0] + x, p[1] + y]);
  return `<path d="M${pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L')}Z" fill="${rgba(col, .35)}" stroke="${col}" stroke-width="3"/>` +
    (lab ? svgT(x, y + len * .58 + fs * .9, lab, fs, col) : '');
}
const eggSvg = (x, y, r, lab) => `<circle cx="${x}" cy="${y}" r="${r * 1.25}" fill="${rgba(C.yellow, .08)}"/><circle cx="${x}" cy="${y}" r="${r}" fill="rgba(60,30,110,.55)" stroke="${C.purple}" stroke-width="3"/>${svgT(x, y + r * .36, lab, r, GIRL)}`;
const spermSvg = (x, y, r, lab, col) => `<path d="M${x - r * 1.1} ${y} q${-r * .6} ${-r * .5} ${-r * 1.2} 0 t${-r * 1.2} 0 t${-r * 1.2} 0" fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round"/><ellipse cx="${x}" cy="${y}" rx="${r * 1.15}" ry="${r * .85}" fill="${rgba(col, .25)}" stroke="${col}" stroke-width="3"/>${svgT(x, y + r * .32, lab, r * .9, col)}`;
SC.push({
  g: 1, title: 'A nemek meghatározása', short: 'XX vagy XY? Az apa ivarsejtje dönt.',
  txt: 'A nők nemi kromoszómái <span class="k">XX</span>, a férfiaké <span class="k">XY</span>. Minden <b>petesejtben</b> X kromoszóma van (22 + X). A <b>spermiumok</b> fele X-et, fele Y-t hordoz (22 + X vagy 22 + Y). Ha X-es spermium termékenyít meg, lány, ha Y-os, fiú születik.',
  think: [
    ['Melyik szülő ivarsejtje dönti el a gyermek nemét?', 'Az apáé: a spermium hordozhat X-et vagy Y-t, a petesejt mindig X-et.'],
    ['Mekkora valószínűséggel születik fiú?', '50% (1/2): a négy lehetséges esetből kettő XY.'],
    ['Honnan kapja a fiú az X kromoszómáját?', 'Az anyjától. Az Y-t az apjától kapja.'],
  ],
  tip: ['cy', 'Punnett-négyzet', 'Négy négyzetből álló háló. Az oldalai mentén a két szülő ivarsejtjeit írjuk fel, a négyzetekbe pedig azt, ami a találkozásukból létrejön.'],
  init(st, ct) {
    this.rev = [0, 0, 0, 0];
    const gx = 560, gy = 160, cw = 200;
    let h = `<svg class="svgfull" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">`;
    h += svgBox(20, 30, 320, 260) + svgT(180, 74, 'ANYA', 30, GIRL, { ls: 3 }) + svgChrom(130, 160, 120, 38, GIRL, 'X') + svgChrom(230, 160, 120, 38, GIRL, 'X') + svgT(180, 280, 'XX · ivarsejtjei: X', 22, C.dim, { w: 600 });
    h += svgBox(20, 320, 320, 260) + svgT(180, 364, 'APA', 30, BOY, { ls: 3 }) + svgChrom(130, 450, 120, 38, BOY, 'X') + svgChrom(230, 430, 56, 38, C.orange, 'Y') + svgT(180, 570, 'XY · ivarsejtjei: X vagy Y', 22, C.dim, { w: 600 });
    h += svgT(gx + cw, 34, 'SPERMIUMOK (APA)', 22, BOY, { ls: 2 }) + svgT(408, gy + cw, 'PETESEJTEK', 22, GIRL, { ls: 2 }) + svgT(408, gy + cw + 28, '(ANYA)', 22, GIRL, { ls: 2 });
    h += spermSvg(gx + cw * .5 + 30, 100, 30, 'X', BOY) + spermSvg(gx + cw * 1.5 + 30, 100, 30, 'Y', C.orange);
    h += eggSvg(488, gy + cw * .5 - 40, 34, 'X') + eggSvg(488, gy + cw * 1.5 + 40, 34, 'X');
    for (let i = 0; i < 4; i++) { const r = i >> 1, c = i & 1; h += `<g class="cellb" data-i="${i}" style="cursor:pointer"><rect x="${gx + c * cw + 6}" y="${gy + r * cw + 6}" width="${cw - 12}" height="${cw - 12}" rx="14" fill="rgba(10,24,52,.6)" stroke="rgba(110,170,255,.35)" stroke-width="2"/><g id="pc${i}"></g></g>`; }
    h += svgT(gx + cw, 590, '', 30, C.text, { id: 'pres' }) + `</svg>`;
    st.innerHTML = h; this.svg = st.querySelector('svg');
    this.svg.querySelectorAll('.cellb').forEach(g => g.onclick = () => { this.rev[+g.dataset.i] = 1; this.upd(); });
    ct.append(btn(I.next + 'Megtermékenyítés', () => this.space(), 'o'), btn(I.reset + 'Újra', () => { this.rev = [0, 0, 0, 0]; this.upd(); }));
    this.ph = photoLayer(st, ct, () => 'kariotipus'); this.ph.upd();
    this.upd();
  },
  space() { const i = this.rev.indexOf(0); if (i < 0) this.rev = [0, 0, 0, 0]; else this.rev[i] = 1; this.upd(); },
  upd() {
    const gx = 560, gy = 160, cw = 200;
    for (let i = 0; i < 4; i++) {
      const r = i >> 1, c = i & 1, x = gx + c * cw + cw / 2, y = gy + r * cw + cw / 2, boy = c === 1, g = this.svg.querySelector('#pc' + i);
      g.innerHTML = this.rev[i] ? kidSym(x, y - 8, 84, boy ? 'm' : 'f', 0) + svgT(x, y + 70, boy ? 'XY · FIÚ' : 'XX · LÁNY', 26, boy ? BOY : GIRL)
        : svgT(x, y + 22, '?', 70, C.faint);
    }
    const n = this.rev.reduce((a, b) => a + b, 0), done = n === 4;
    const pr = this.svg.querySelector('#pres'); pr.textContent = done ? '2 lány : 2 fiú → 50% lány, 50% fiú' : ''; pr.setAttribute('fill', C.green);
    UI.data(this);
  },
  data() {
    const n = this.rev.reduce((a, b) => a + b, 0);
    return `<div class="dtitle">Ivarsejtek</div>${drow('Petesejt', '100% X', GIRL)}${drow('Spermium', '50% X · 50% Y', BOY)}${drow('Kitöltve', n + ' / 4')}${n === 4 ? drow('Lány · fiú', '50% · 50%', C.green) : ''}`;
  },
});

// =====================================================================
// 04 – A negyedik baba
// =====================================================================
function kidCv(ctx, x, y, s, sex, a = 1) {
  ctx.save(); ctx.globalAlpha *= a;
  const col = sex === 'f' ? GIRL : sex === 'm' ? BOY : C.dim;
  ctx.fillStyle = rgba(col, sex ? .3 : .08); ctx.strokeStyle = col; ctx.lineWidth = Math.max(2, s * .05); ctx.lineJoin = 'round';
  ctx.beginPath();
  if (sex === 'f') { ctx.moveTo(x, y - s * .12); ctx.lineTo(x + s * .42, y + s * .62); ctx.lineTo(x - s * .42, y + s * .62); ctx.closePath(); }
  else ctx.roundRect(x - s * .34, y - s * .1, s * .68, s * .72, s * .1);
  if (!sex) ctx.setLineDash([s * .08, s * .06]);
  ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y - s * .38, s * .22, 0, TAU); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
  if (!sex) text(ctx, '?', x, y + s * .28, C.dim, s * .45, 'center', 700);
  ctx.restore();
}
SC.push({
  g: 1, title: 'A negyedik baba', short: 'Három lány után biztosan fiú jön?',
  txt: 'Egy párnak <b>három lánya</b> van, és várják a negyedik babát. A barátok szerint most már biztosan <b>fiú</b> lesz. Igazuk van? Próbáld ki sok családdal! Minden gyermeknél újra <span class="k">50% az esély</span> a fiúra és a lányra.',
  think: [
    ['Miért gondolhatják a barátok, hogy most fiú jön?', 'Mert úgy érzik, hogy három lány után „ki kell egyenlítődnie” az aránynak.'],
    ['Miért nincs igazuk?', 'Mert minden megtermékenyítés független az előzőektől: a spermium most is 50%-os eséllyel hordoz X-et vagy Y-t.'],
    ['Mekkora az esélye, hogy a negyedik baba lány lesz?', 'Ugyanúgy 50%.'],
  ],
  tip: ['or', 'Kihívás', 'A tankönyvi feladat (MEN, 18. o.): magyarázd meg, miért gondolhatják ezt a barátok, és miért nincs igazuk!'],
  init(st, ct) {
    this.cv = Cv(st); this.f = 0; this.m = 0; this.last = null; this.flash = 0;
    ct.append(btn(I.next + 'Megszületik a baba', () => this.space(), 'o'), btn('+100 család', () => this.many(100)), btn('+1000 család', () => this.many(1000)), btn(I.reset + 'Újra', () => { this.f = this.m = 0; this.last = null; UI.data(this); }));
  },
  space() { this.last = Math.random() < .5 ? 'f' : 'm'; this[this.last]++; this.flash = 1; UI.data(this); },
  many(n) { for (let i = 0; i < n; i++) this[Math.random() < .5 ? 'f' : 'm']++; this.last = null; UI.data(this); },
  data() {
    const n = this.f + this.m, p = v => n ? pct(v / n) : '–';
    return `<div class="dtitle">Negyedik gyermekek</div><div class="dbig">${n} család</div>${drow('Fiú', `${this.m} (${p(this.m)})`, BOY)}${drow('Lány', `${this.f} (${p(this.f)})`, GIRL)}<div class="dsub" style="margin-top:.5rem">Minél több családot nézünk, annál közelebb kerül az arány az 50–50%-hoz.</div>`;
  },
  tick(dt, T) {
    this.flash = Math.max(0, this.flash - dt * 1.2);
    const o = this.cv.fit(), ctx = o.ctx, W = o.w, H = o.h, fs = clamp(Math.min(W, H) * .036, 12, 28);
    // család
    const s = Math.min(W * .085, H * .2), y0 = H * .36, x0 = W * .08;
    text(ctx, 'A CSALÁD', W * .27, H * .08, C.text, fs * 1.05, 'center', 700);
    for (let i = 0; i < 3; i++) { kidCv(ctx, x0 + s * .6 + i * s * 1.15, y0, s, 'f'); text(ctx, `${i + 1}.`, x0 + s * .6 + i * s * 1.15, y0 + s * .85, C.dim, fs * .9); }
    const bx = x0 + s * .6 + 3 * s * 1.15 + s * .2;
    if (this.flash > 0 && this.last) { ctx.save(); ctx.shadowColor = this.last === 'f' ? GIRL : BOY; ctx.shadowBlur = 30 * this.flash; kidCv(ctx, bx, y0, s * 1.15, this.last); ctx.restore(); }
    else kidCv(ctx, bx, y0, s * 1.15, this.last || null);
    text(ctx, '4.', bx, y0 + s * .95, C.orange, fs, 'center', 700);
    text(ctx, this.last ? (this.last === 'f' ? 'Most lány született!' : 'Most fiú született!') : 'Fiú vagy lány?', W * .27, H * .68, this.last === 'f' ? GIRL : this.last === 'm' ? BOY : C.dim, fs * 1.1, 'center', 700);
    text(ctx, 'Minden babánál újra 50% : 50%', W * .27, H * .76, C.dim, fs * .9, 'center', 600);
    // oszlopdiagram
    const n = this.f + this.m, cx0 = W * .6, cw = W * .14, base = H * .82, top = H * .18, hh = base - top;
    text(ctx, 'A NEGYEDIK BABA SOK CSALÁDBAN', W * .74, H * .08, C.text, fs * 1.05, 'center', 700);
    ctx.strokeStyle = rgba(C.text, .25); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx0 - cw * .3, base); ctx.lineTo(cx0 + cw * 2.6, base); ctx.stroke();
    ctx.setLineDash([6, 6]); ctx.strokeStyle = rgba(C.green, .7); ctx.beginPath(); ctx.moveTo(cx0 - cw * .3, base - hh * .5); ctx.lineTo(cx0 + cw * 2.6, base - hh * .5); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, '50%', cx0 + cw * 2.6, base - hh * .5 - fs * .7, C.green, fs * .85, 'right', 700);
    [['FIÚ', this.m, BOY], ['LÁNY', this.f, GIRL]].forEach(([l, v, c], i) => {
      const x = cx0 + i * cw * 1.3, h = n ? hh * v / n : 0;
      const g = ctx.createLinearGradient(0, base - h, 0, base); g.addColorStop(0, c); g.addColorStop(1, rgba(c, .25));
      ctx.fillStyle = g; ctx.fillRect(x, base - h, cw, h);
      text(ctx, l, x + cw / 2, base + fs * 1.1, c, fs, 'center', 700);
      text(ctx, n ? pct(v / n) : '–', x + cw / 2, base - h - fs * .8, C.text, fs * 1.1, 'center', 700);
    });
    text(ctx, n ? `${n} család` : 'Még nincs adat', cx0 + cw * 1.15, base + fs * 2.4, C.dim, fs * .9, 'center', 600);
  },
});
