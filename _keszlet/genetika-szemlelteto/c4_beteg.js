
// =====================================================================
// 08 – Autoszómális öröklődés
// =====================================================================
const alCol = a => a === a.toUpperCase() ? C.orange : C.cyan;
const gtSvg = (g, x, y, fs) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="${fs}">${[...g].map(a => `<tspan fill="${alCol(a)}">${a}</tspan>`).join('')}</text>`;
const AUT = [
  { n: 'Polidaktília', k: 'autoszómális domináns', L: 'P', dom: true, ill: 'polidaktíliás', ok: 'normális ujjszámú', pre: [1, 1],
    d: 'Fölös számú ujj a kézen vagy a lábon. Domináns génhiba: már egy P allél is elég a megjelenéséhez.', al: ['P = polidaktília (domináns)', 'p = normális (recesszív)'] },
  { n: 'Albinizmus', k: 'autoszómális recesszív', L: 'A', dom: false, ill: 'albínó', ok: 'egészséges', pre: [1, 2],
    d: 'A melanin hiánya a bőrből, a hajból és a szemből. Az albínók napérzékenyek. Csak aa genotípusnál jelenik meg.', al: ['A = normális (domináns)', 'a = albinizmus (recesszív)'] },
  { n: 'Cisztás fibrózis', k: 'autoszómális recesszív', L: 'F', dom: false, ill: 'beteg', ok: 'egészséges', pre: [1, 1],
    d: 'Főleg a tüdőt és a hasnyálmirigyet károsítja: bőséges nyák termelődik, amely elzárhatja a légutakat. Csak ff genotípusnál alakul ki.', al: ['F = normális (domináns)', 'f = cisztás fibrózis (recesszív)'] },
];
const autSt = (D, g) => { const big = g.includes(D.L), small = g.includes(D.L.toLowerCase()); return D.dom ? (big ? 2 : 0) : (!big ? 2 : small ? 1 : 0); };
const autPh = (D, g) => { const s = autSt(D, g); return s === 2 ? D.ill : s === 1 ? 'hordozó' : D.ok; };
SC.push({
  g: 3, title: 'Autoszómális öröklődés', short: 'Domináns és recesszív génhibák a testi kromoszómákon.',
  txt: 'Az <span class="k">autoszómális</span> betegségek génjei testi kromoszómákon vannak, ezért fiúkat és lányokat egyformán érintenek. A domináns génhibához egy hibás allél is elég. A recesszív betegség csak két hibás allélnál alakul ki: a heterozigóta ember egészséges <b>hordozó</b>.',
  think: [
    ['Miért nem leszel cisztás fibrózisos beteg, ha csak egyetlen hibás allélt örökölsz?', 'Mert a betegség recesszív: az egészséges, domináns F allél elnyomja. Ilyenkor hordozó vagy (Ff), de egészséges.'],
    ['Két polidaktíliás szülőnek normális ujjszámú gyermeke született. Mi a szülők genotípusa?', 'Mindkettő heterozigóta (Pp). Így 25% az esélye a pp, normális ujjszámú gyermeknek, és 75% a polidaktíliásnak.'],
    ['Az apa albínó, az anya nem, de az anya egyik szülője albínó volt. Mekkora eséllyel születik albínó gyermekük?', 'Az anya hordozó (Aa), az apa aa. Aa × aa: 50% az albínó gyermek esélye.'],
  ],
  tip: ['or', 'Tudtad?', 'Ha rokonok vállalnak közös gyermeket, megnő az esélye, hogy két azonos recesszív hibás allél találkozik. Ez is oka annak, hogy a közeli rokonok házasságát tiltják.'],
  init(st, ct) {
    this.d = 0; this.m = 1; this.f = 1;
    st.innerHTML = `<svg class="svgfull" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet"></svg>`; this.svg = st.querySelector('svg');
    this.sd = seg(AUT.map(a => a.n), i => { this.d = i; [this.m, this.f] = AUT[i].pre; this.mkSeg(); this.upd(); });
    this.wm = el('div', 'slider', '<span>Anya</span>'); this.wf = el('div', 'slider', '<span>Apa</span>');
    ct.append(this.sd, this.wm, this.wf); this.mkSeg();
    this.ph = photoLayer(st, ct, () => this.d === 0 ? 'polidaktilia' : this.d === 1 ? 'albino' : null); this.upd();
  },
  gts() { const L = AUT[this.d].L, l = L.toLowerCase(); return [L + L, L + l, l + l]; },
  mkSeg() {
    const G = this.gts();
    this.wm.querySelector('.seg') && this.wm.querySelector('.seg').remove(); this.wf.querySelector('.seg') && this.wf.querySelector('.seg').remove();
    this.sm = seg(G, i => { this.m = i; this.upd(); }, 'nc'); this.sf = seg(G, i => { this.f = i; this.upd(); }, 'nc');
    this.wm.appendChild(this.sm); this.wf.appendChild(this.sf);
  },
  space() { this.m = Math.floor(Math.random() * 3); this.f = Math.floor(Math.random() * 3); this.upd(); },
  kids() { const G = this.gts(), m = G[this.m], f = G[this.f], L = AUT[this.d].L; return [0, 1, 2, 3].map(i => [m[i >> 1], f[i & 1]].sort((a, b) => (a === L ? 0 : 1) - (b === L ? 0 : 1)).join('')); },
  upd() {
    this.sd.set(this.d); this.sm.set(this.m); this.sf.set(this.f); this.ph && this.ph.upd();
    const D = AUT[this.d], G = this.gts(), m = G[this.m], f = G[this.f], k = this.kids(), gx = 430, gy = 185, cw = 185, ch = 175;
    const stc = s => s === 2 ? ILL : s === 1 ? CAR : OKC;
    let h = svgT(615, 42, `${D.n.toUpperCase()} · ${D.k}`, 30, C.text, { ls: 1.5 });
    h += svgBox(20, 70, 290, 515);
    [[m, 'ANYA', 'f', 120], [f, 'APA', 'm', 360]].forEach(([g, n, sx, y]) => {
      const s = autSt(D, g); h += svgT(165, y, n, 24, sx === 'f' ? GIRL : BOY, { ls: 2 }) + kidSym(165, y + 70, 80, sx, s, ILL) + gtSvg(g, 165, y + 160, 44) + svgT(165, y + 192, autPh(D, g), 22, stc(s), { w: 600 });
    });
    h += svgT(gx + cw, 98, 'AZ APA IVARSEJTJEI', 20, BOY, { ls: 2 });
    for (let j = 0; j < 2; j++) h += `<circle cx="${gx + cw * (j + .5)}" cy="146" r="28" fill="rgba(10,24,52,.8)" stroke="${BOY}" stroke-width="3"/>` + gtSvg(f[j], gx + cw * (j + .5), 160, 38);
    for (let i = 0; i < 2; i++) { const y = gy + ch * (i + .5); h += `<circle cx="368" cy="${y}" r="28" fill="rgba(10,24,52,.8)" stroke="${GIRL}" stroke-width="3"/>` + gtSvg(m[i], 368, y + 13, 38); }
    k.forEach((g, i) => {
      const x = gx + (i & 1) * cw, y = gy + (i >> 1) * ch, s = autSt(D, g);
      h += svgBox(x + 6, y + 6, cw - 12, ch - 12, { f: rgba(stc(s), .08), s: rgba(stc(s), .5) }) + kidSym(x + cw / 2, y + 62, 60, null, s, ILL) + gtSvg(g, x + cw / 2, y + 128, 32) + svgT(x + cw / 2, y + 156, autPh(D, g), 20, stc(s), { w: 600 });
    });
    const P = [2, 1, 0].map(s => k.filter(g => autSt(D, g) === s).length / 4);
    h += svgT(915, 210, 'UTÓDOK', 20, C.dim, { ls: 2 });
    [['Beteg', P[0], ILL], ['Hordozó', P[1], CAR], ['Egészséges', P[2], OKC]].forEach(([n, p, c], i) => {
      if (D.dom && i === 1) return;
      const y = 250 + i * 105; h += svgT(915, y, n, 22, c, { w: 600 }) + svgT(915, y + 50, `${p * 100}%`, 44, p ? C.text : C.faint);
    });
    this.svg.innerHTML = h; UI.data(this);
  },
  data() {
    const D = AUT[this.d];
    return `<div class="dtitle">${D.n}</div><div class="dsub">${D.d}</div>${drow('Allélok', D.al[0], C.orange)}${drow('', D.al[1], C.cyan)}`;
  },
});

// =====================================================================
// 09 – Nemhez kötött öröklődés
// =====================================================================
const XL = [
  { n: 'Daltonizmus', a: ['Xᴰ', 'Xᵈ'], ill: 'daltonista', pre: [1, 0],
    d: 'Látászavar: az érintett elsősorban a vörös és a zöld színt nem tudja megkülönböztetni.' },
  { n: 'Hemofília', a: ['Xᴴ', 'Xʰ'], ill: 'vérzékeny', pre: [0, 1],
    d: 'Vérzékenység: hiányoznak a véralvadásért felelős faktorok, kisebb sérüléskor is vérzés alakul ki. A véralvadás ideje 6–7-szer hosszabb a normálisnál.' },
];
const XBAD = ['Xᵈ', 'Xʰ'];
const xlSt = (g, boy) => { const b = g.filter(a => XBAD.includes(a)).length; return boy ? (b ? 2 : 0) : (b === 2 ? 2 : b ? 1 : 0); };
function deutSvg(filter) {
  // gyümölcsös tál – piros és zöld színek
  let h = `<g${filter ? ' filter="url(#deut)"' : ''}>`;
  h += `<rect x="0" y="0" width="400" height="300" rx="16" fill="#1d3b22"/>`;
  for (let i = 0; i < 9; i++) h += `<ellipse cx="${30 + i * 45}" cy="${40 + (i % 3) * 20}" rx="34" ry="16" transform="rotate(${-20 + i * 9} ${30 + i * 45} ${40 + (i % 3) * 20})" fill="${i % 2 ? '#3f9a32' : '#58b83f'}"/>`;
  h += `<ellipse cx="200" cy="250" rx="170" ry="40" fill="#8a5a2b"/><ellipse cx="200" cy="232" rx="170" ry="34" fill="#b07a40"/>`;
  const fr = [[95, 200, '#d81f1f'], [150, 185, '#7cc23a'], [210, 195, '#e0261d'], [265, 182, '#6db52f'], [315, 202, '#cf2020'], [125, 150, '#e83a2a'], [185, 140, '#80c43c'], [245, 145, '#d92a22'], [295, 152, '#74bd35']];
  for (const [x, y, c] of fr) h += `<circle cx="${x}" cy="${y}" r="32" fill="${c}"/><circle cx="${x - 10}" cy="${y - 11}" r="9" fill="rgba(255,255,255,.35)"/><path d="M${x} ${y - 30} q4 -12 10 -16" stroke="#5a3a1a" stroke-width="4" fill="none"/>`;
  h += `<g transform="translate(345 40)"><rect x="-22" y="-8" width="44" height="120" rx="10" fill="#222"/><circle cy="18" r="14" fill="#e3261d"/><circle cy="52" r="14" fill="#444"/><circle cy="86" r="14" fill="#3cc23a"/></g>`;
  return h + '</g>';
}
SC.push({
  g: 3, title: 'Nemhez kötött öröklődés', short: 'Miért gyakoribb a daltonizmus a fiúknál?',
  txt: 'A <span class="k">heteroszómális</span> (nemhez kötött) betegségek génjei a nemi kromoszómákon, legtöbbször az <b>X</b>-en vannak. A lánynak két X-e van: ha csak az egyiken hibás az allél, egészséges <b>hordozó</b>. A fiúnak csak egy X-e van, ezért egyetlen hibás allél is elég a betegséghez.',
  think: [
    ['A szülőknek nincs daltonizmusa, de az anya apjának van. Mi a szülők genotípusa?', 'Anya: XᴰXᵈ (hordozó, az apjától kapta a hibás X-et), apa: XᴰY.'],
    ['Mekkora az esélye, hogy ennek a párnak daltonista gyermeke születik?', 'Az összes gyermekre nézve 25%. A fiúgyermekek fele (50%) lehet daltonista, a lányok közül egy sem.'],
    ['Egy lány édesapja vérzékeny, édesanyja egészséges. Indokolt-e a félelme?', 'Ő maga nem lesz beteg: biztosan hordozó (XᴴXʰ), mert az apjától a hibás X-et kapta. A fiai viszont 50%-os eséllyel vérzékenyek lehetnek.'],
  ],
  tip: ['cy', 'Jelölés', 'A nemhez kötött allélokat az X kromoszóma mellé írjuk: Xᴰ = ép színlátás, Xᵈ = daltonizmus. Az Y kromoszómán nincs ilyen gén.'],
  init(st, ct) {
    this.d = 0; this.m = 1; this.f = 0; this.view = 0;
    st.innerHTML = `<svg class="svgfull" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet"></svg>`; this.svg = st.querySelector('svg');
    this.sd = seg(XL.map(a => a.n), i => { this.d = i; [this.m, this.f] = XL[i].pre; if (i) this.view = 0; this.upd(); });
    this.sm = seg(['', '', ''], i => { this.m = i; this.view = 0; this.upd(); }, 'nc'); this.sf = seg(['', ''], i => { this.f = i; this.view = 0; this.upd(); }, 'nc');
    this.sv = btn('Így lát a daltonista', () => { this.view = (this.view + 1) % 3; this.upd(); });
    ct.append(this.sd, labeled('Anya', this.sm), labeled('Apa', this.sf), this.sv);
    this.ph = photoLayer(st, ct, () => this.d === 0 ? 'ishihara8' : null); this.upd();
  },
  space() { if (this.d === 0) { this.view = (this.view + 1) % 3; this.upd(); } },
  G() { const [A, a] = XL[this.d].a; return { M: [[A, A], [A, a], [a, a]], F: [[A, 'Y'], [a, 'Y']] }; },
  upd() {
    const D = XL[this.d], { M, F } = this.G(), m = M[this.m], f = F[this.f];
    this.sd.set(this.d);
    this.sm.querySelectorAll('button').forEach((b, i) => b.innerHTML = xhtml(M[i].join(''))); this.sf.querySelectorAll('button').forEach((b, i) => b.innerHTML = xhtml(F[i].join('')));
    this.sm.set(this.m); this.sf.set(this.f); this.sv.style.display = this.d === 0 ? '' : 'none'; this.sv.classList.toggle('o', !!this.view);
    this.sv.textContent = ['Így lát a daltonista', 'Színlátásvizsgáló tábla', 'Vissza a táblázathoz'][this.view]; this.ph && this.ph.upd();
    let h = `<defs><filter id="deut" color-interpolation-filters="linearRGB"><feColorMatrix type="matrix" values="0.367 0.861 -0.228 0 0  0.280 0.673 0.047 0 0  -0.012 0.043 0.969 0 0  0 0 0 1 0"/></filter></defs>`;
    if (this.view === 2) {
      h += svgT(500, 60, 'SZÍNLÁTÁSVIZSGÁLÓ TÁBLA KÉTFÉLE SZEMMEL', 30, C.text, { ls: 2 });
      h += `<image href="${ASSETS.ishihara9}" x="110" y="95" width="340" height="340"/><image href="${ASSETS.ishihara9}" x="550" y="95" width="340" height="340" filter="url(#deut)"/>`;
      h += svgT(280, 480, 'ÉP SZÍNLÁTÁS: 74', 28, C.green, { ls: 2 }) + svgT(720, 480, 'DALTONISTA SZEM', 28, C.orange, { ls: 2 });
      h += svgT(500, 535, 'A vörös-zöld színtévesztő a számot nem látja, vagy más számot (pl. 21) olvas.', 23, C.dim, { f: 'Barlow', w: 500 });
      h += svgT(500, 568, 'Ishihara 9. tábla · Shinobu Ishihara (vektorizálta: Pbrks) · Wikimedia Commons · közkincs · a jobb oldali kép közelítő szimuláció', 16, C.faint, { f: 'Barlow', w: 500 });
      this.svg.innerHTML = h; UI.data(this); return;
    }
    if (this.view) {
      h += svgT(500, 60, 'UGYANAZ A KÉP KÉTFÉLE SZEMMEL', 30, C.text, { ls: 2 });
      h += `<g transform="translate(70 120)">${deutSvg(false)}</g><g transform="translate(530 120)">${deutSvg(true)}</g>`;
      h += svgT(270, 470, 'ÉP SZÍNLÁTÁS', 28, C.green, { ls: 2 }) + svgT(730, 470, 'DALTONISTA SZEM', 28, C.orange, { ls: 2 });
      h += svgT(500, 540, 'A piros és a zöld szín szinte egyformának látszik. (Közelítő szimuláció.)', 24, C.dim, { f: 'Barlow', w: 500 });
      this.svg.innerHTML = h; UI.data(this); return;
    }
    const gx = 430, gy = 185, cw = 185, ch = 175, stc = s => s === 2 ? ILL : s === 1 ? CAR : OKC;
    h += svgT(615, 42, `${D.n.toUpperCase()} · X kromoszómához kötött, recesszív`, 28, C.text, { ls: 1.5 });
    h += svgBox(20, 70, 290, 515);
    const ms = xlSt(m, false), fs = xlSt(f, true);
    h += svgT(165, 120, 'ANYA', 24, GIRL, { ls: 2 }) + kidSym(165, 190, 80, 'f', ms) + svgT(165, 280, xsvg(m.join('')), 44, C.text) + svgT(165, 312, ms === 2 ? D.ill : ms ? 'hordozó' : 'egészséges', 22, stc(ms), { w: 600 });
    h += svgT(165, 360, 'APA', 24, BOY, { ls: 2 }) + kidSym(165, 430, 80, 'm', fs) + svgT(165, 520, xsvg(f.join('')), 44, C.text) + svgT(165, 552, fs === 2 ? D.ill : 'egészséges', 22, stc(fs), { w: 600 });
    h += svgT(gx + cw, 98, 'AZ APA IVARSEJTJEI', 20, BOY, { ls: 2 });
    for (let j = 0; j < 2; j++) h += `<circle cx="${gx + cw * (j + .5)}" cy="146" r="30" fill="rgba(10,24,52,.8)" stroke="${BOY}" stroke-width="3"/>` + svgT(gx + cw * (j + .5), 160, xsvg(f[j]), 36, C.text);
    for (let i = 0; i < 2; i++) { const y = gy + ch * (i + .5); h += `<circle cx="366" cy="${y}" r="30" fill="rgba(10,24,52,.8)" stroke="${GIRL}" stroke-width="3"/>` + svgT(366, y + 13, xsvg(m[i]), 36, C.text); }
    const kids = [];
    for (let i = 0; i < 4; i++) {
      const r = i >> 1, c = i & 1, g = [m[r], f[c]], boy = f[c] === 'Y', s = xlSt(g, boy), x = gx + c * cw, y = gy + r * ch; kids.push([boy, s]);
      h += svgBox(x + 6, y + 6, cw - 12, ch - 12, { f: rgba(stc(s), .08), s: rgba(stc(s), .5) }) + kidSym(x + cw / 2, y + 62, 60, boy ? 'm' : 'f', s) + svgT(x + cw / 2, y + 128, xsvg(g.join('')), 30, C.text) + svgT(x + cw / 2, y + 156, (boy ? 'fiú · ' : 'lány · ') + (s === 2 ? D.ill : s ? 'hordozó' : 'egészséges'), 19, stc(s), { w: 600 });
    }
    const girls = kids.filter(k => !k[0]), boys = kids.filter(k => k[0]);
    const pp = (arr, s) => arr.filter(k => k[1] === s).length / arr.length;
    h += svgT(915, 210, 'LÁNYOK', 22, GIRL, { ls: 2 }) + svgT(915, 250, `${pp(girls, 2) * 100}% ${D.ill}`, 22, pp(girls, 2) ? ILL : C.faint, { w: 600 }) + svgT(915, 280, `${pp(girls, 1) * 100}% hordozó`, 22, pp(girls, 1) ? CAR : C.faint, { w: 600 });
    h += svgT(915, 370, 'FIÚK', 22, BOY, { ls: 2 }) + svgT(915, 410, `${pp(boys, 2) * 100}% ${D.ill}`, 22, pp(boys, 2) ? ILL : C.faint, { w: 600 });
    h += svgT(915, 500, 'ÖSSZESEN', 20, C.dim, { ls: 2 }) + svgT(915, 545, `${kids.filter(k => k[1] === 2).length * 25}%`, 40, C.text);
    this.svg.innerHTML = h; UI.data(this);
  },
  data() {
    const D = XL[this.d];
    return `<div class="dtitle">${D.n}</div><div class="dsub">${D.d}</div>${drow('Ép allél', xhtml(D.a[0]), C.green)}${drow('Hibás allél', xhtml(D.a[1]), ILL)}${drow('Hordozó lehet', 'csak nő (XX)', CAR)}`;
  },
});

// =====================================================================
// 10 – Családfa
// =====================================================================
// p: [id, x, gen, nem, látható állapot, felfedett állapot, genotípus, magyarázat]
const PED = [
  { n: 'Daltonizmus', ill: 'daltonista', task: 'A szülőknek nincs daltonizmusa, de az anya apjának van.',
    p: [['ga', 200, 0, 'm', 2, 2, 'XᵈY', 'A nagyapa daltonista: egyetlen X kromoszómáján hibás allél van.'],
      ['gm', 380, 0, 'f', 0, 0, 'XᴰX…', 'A nagymama nem daltonista. Az anya tőle ép X-et kapott.'],
      ['m', 290, 1, 'f', 0, 1, 'XᴰXᵈ', 'Az anya hordozó: az apjától (a nagyapától) biztosan a hibás Xᵈ-t kapta, mert a lány mindig az apja X kromoszómáját örökli.'],
      ['f', 530, 1, 'm', 0, 0, 'XᴰY', 'Az apa nem daltonista, tehát ép X-e van.'],
      ['k1', 260, 2, 'm', -1, -1, '50%', 'Fiúgyermek: 50% eséllyel daltonista (XᵈY), mert az anyjától a hibás vagy az ép X-et kaphatja.'],
      ['k2', 370, 2, 'f', -1, -1, '0%', 'Lánygyermek: nem lesz daltonista, mert az apjától ép X-et kap. 50% eséllyel hordozó.'],
      ['k3', 480, 2, 'm', -1, -1, '50%', 'Fiúgyermek: 50% eséllyel daltonista.'],
      ['k4', 590, 2, 'f', -1, -1, '0%', 'Lánygyermek: 0% eséllyel daltonista, 50% eséllyel hordozó.']],
    sum: 'Összes gyermekre nézve 25%, a fiúkra nézve 50% a daltonizmus esélye.' },
  { n: 'Albinizmus', ill: 'albínó', task: 'Az apa albínó, az anya nem, de az anya egyik szülője albínó volt.',
    p: [['ga', 200, 0, 'm', 2, 2, 'aa', 'Az anya apja albínó volt: aa genotípusú.'],
      ['gm', 380, 0, 'f', 0, 0, 'A…', 'Az anya anyja nem albínó.'],
      ['m', 290, 1, 'f', 0, 1, 'Aa', 'Az anya nem albínó, de az albínó apjától biztosan egy „a” allélt kapott: hordozó (Aa).'],
      ['f', 530, 1, 'm', 2, 2, 'aa', 'Az apa albínó: aa.'],
      ['k1', 260, 2, 'm', -1, -1, '50%', 'Aa × aa: a gyermek 50% eséllyel albínó (aa), 50% eséllyel hordozó (Aa).'],
      ['k2', 370, 2, 'f', -1, -1, '50%', 'Autoszómális betegség: a lányokat ugyanúgy érinti, 50% az esély.'],
      ['k3', 480, 2, 'm', -1, -1, '50%', '50% albínó, 50% hordozó.'],
      ['k4', 590, 2, 'f', -1, -1, '50%', '50% albínó, 50% hordozó.']],
    sum: 'Minden gyermek 50% eséllyel albínó, fiú és lány egyformán.' },
];
const PGY = [120, 290, 450];
SC.push({
  g: 3, title: 'Családfa', short: 'Olvasd le a családfáról, ki lehet hordozó!',
  txt: 'A <span class="k">családfa</span> (pedigré) egyezményes jelekkel mutatja, hogyan öröklődik egy tulajdonság vagy betegség több nemzedéken át. <b>Négyzet</b> a férfi, <b>kör</b> a nő. A <b>sötét</b> jel beteget, a <b>félig sötét</b> hordozót jelöl. A generációkat római számokkal jelöljük.',
  think: [
    ['Hogyan jelöljük a családfán a beteg nőt és az egészséges férfit?', 'A beteg nő sötét (kitöltött) kör, az egészséges férfi üres négyzet.'],
    ['Miért lehet biztosan tudni, hogy a daltonista nagyapa lánya hordozó?', 'Mert a lány mindig megkapja az apja X kromoszómáját – ez a nagyapánál a hibás Xᵈ.'],
    ['Mit jelent a vízszintes vonal két jel között?', 'Házasságot (a szülőpárt). A belőle lefelé induló vonalak az utódokhoz vezetnek.'],
  ],
  tip: ['cy', 'Koppints a jelekre!', 'Minden személy genotípusa és a következtetés menete megjelenik. A gyerekeknél a valószínűséget látod.'],
  init(st, ct) {
    this.d = 0; this.rev = {}; this.sel = null;
    st.innerHTML = `<svg class="svgfull" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet"></svg>`; this.svg = st.querySelector('svg');
    this.svg.addEventListener('click', e => { const g = e.target.closest('[data-p]'); if (!g) return; this.sel = g.dataset.p; this.rev[this.sel] = 1; this.upd(); });
    this.sd = seg(PED.map(p => p.n), i => { this.d = i; this.rev = {}; this.sel = null; this.upd(); });
    ct.append(this.sd, btn('Mind felfed', () => { PED[this.d].p.forEach(p => this.rev[p[0]] = 1); this.upd(); }, 'o'), btn(I.reset + 'Elrejt', () => { this.rev = {}; this.sel = null; this.upd(); }));
    this.upd();
  },
  space() { const p = PED[this.d].p.find(q => !this.rev[q[0]]); if (p) { this.rev[p[0]] = 1; this.sel = p[0]; } else { this.rev = {}; this.sel = null; } this.upd(); },
  upd() {
    this.sd.set(this.d);
    const P = PED[this.d], by = id => P.p.find(q => q[0] === id), r = 30;
    let h = svgT(40, 40, P.task, 24, C.text, { a: 'start', f: 'Barlow', w: 500 });
    ['I.', 'II.', 'III.'].forEach((g, i) => h += svgT(60, PGY[i] + 12, g, 34, C.dim));
    const ln = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(238,245,255,.55)" stroke-width="3"/>`;
    // házasságok és leszármazás
    h += ln(200 + r, PGY[0], 380 - r, PGY[0]) + ln(290, PGY[0], 290, PGY[1] - r);
    h += ln(290 + r, PGY[1], 530 - r, PGY[1]) + ln(410, PGY[1], 410, PGY[2] - 62) + ln(260, PGY[2] - 62, 590, PGY[2] - 62);
    for (const x of [260, 370, 480, 590]) h += ln(x, PGY[2] - 62, x, PGY[2] - r);
    for (const q of P.p) {
      const [id, x, gn, sx, s0, s1, gt] = q, y = PGY[gn], rv = this.rev[id], s = rv ? s1 : s0, sel = this.sel === id;
      h += `<g data-p="${id}" style="cursor:pointer">${sel ? `<circle cx="${x}" cy="${y}" r="${r + 16}" fill="${rgba(C.orange, .14)}" stroke="${C.orange}" stroke-width="2"/>` : ''}${pedSym(x, y, r, sx, s, ILL)}`;
      h += `<rect x="${x - 55}" y="${y - r - 10}" width="110" height="${2 * r + 70}" fill="transparent"/>`;
      if (rv) h += gn === 2 ? svgT(x, y + r + 34, gt, 26, s1 === -1 && gt !== '0%' ? ILL : C.green) : svgT(x, y + r + 34, xsvg(gt), 26, C.text);
      h += '</g>';
    }
    // jelmagyarázat
    const lg = [['m', 0, 'egészséges férfi'], ['f', 0, 'egészséges nő'], ['m', 2, 'beteg férfi'], ['f', 2, 'beteg nő'], ['f', 1, 'hordozó nő']];
    h += svgBox(700, 70, 280, 330) + svgT(840, 108, 'JELMAGYARÁZAT', 20, C.dim, { ls: 2 });
    lg.forEach(([sx, s, t], i) => { const y = 150 + i * 46; h += pedSym(735, y, 15, sx, s, ILL) + svgT(765, y + 8, t, 22, C.text, { a: 'start', f: 'Barlow', w: 500 }); });
    h += ln(720, 382, 750, 382) + svgT(765, 390, 'házasság', 22, C.text, { a: 'start', f: 'Barlow', w: 500 });
    const all = P.p.every(q => this.rev[q[0]]);
    if (all) h += svgBox(700, 420, 280, 140, { s: rgba(C.green, .6) }) + `<foreignObject x="712" y="430" width="256" height="124"><div xmlns="http://www.w3.org/1999/xhtml" style="font:500 21px Barlow;color:#eef5ff;line-height:1.3">${P.sum}</div></foreignObject>`;
    this.svg.innerHTML = h; UI.data(this);
  },
  data() {
    const P = PED[this.d], q = this.sel && P.p.find(x => x[0] === this.sel);
    const nm = { ga: 'Nagyapa (I.)', gm: 'Nagymama (I.)', m: 'Anya (II.)', f: 'Apa (II.)', k1: 'Fiú (III.)', k2: 'Lány (III.)', k3: 'Fiú (III.)', k4: 'Lány (III.)' };
    if (!q) return `<div class="dtitle">${P.n}</div><div class="dsub">Koppints egy személyre a családfán! Kezdd a nagyszülőkkel, és haladj lefelé.</div>`;
    return `<div class="dtitle">${nm[q[0]]}</div><div class="dbig">${xhtml(q[6])}</div><div class="dsub">${xhtml(q[7])}</div>`;
  },
});
