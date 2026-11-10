
// =====================================================================
// 11 – Mutációk
// =====================================================================
const MUTM = [
  { n: 'Génmutáció', s: 'A DNS bázissorrendje változik meg', d: 'Egy gén bázissorrendje megváltozik: például egyetlen bázis helyére másik kerül. Így megváltozhat a gén „üzenete”.', ex: 'albinizmus, daltonizmus, hemofília' },
  { n: 'Kromoszóma-mutáció', s: 'Egy kromoszóma szerkezete változik meg', d: 'Egy kromoszóma szerkezete változik meg: egy darabja elveszhet. Az 5-ös kromoszóma rövid karának hiánya okozza a macskanyávogás-szindrómát.', ex: 'macskanyávogás-szindróma (cri du chat)' },
  { n: 'Genommutáció', s: 'A kromoszómák száma változik meg', d: 'A kromoszómák száma változik meg: egy kromoszómából három lesz (triszómia), vagy egy hiányzik. A 21-es kromoszóma triszómiája a Down-kór.', ex: 'Down-, Turner-, Klinefelter-kór' },
  { n: 'Szomatikus mutáció – rák', s: 'Egy testi sejt génjei változnak meg', d: 'A testi (szomatikus) sejt mutációja nem öröklődik, de rákot okozhat: a mutáns sejt ellenőrzés nélkül osztódni kezd, és daganat alakul ki.', ex: 'daganatos betegségek' },
];
const RAK = ['2A · Normális sejtek', '2B · Egy sejt mutációt szenved', '2C · A mutáns sejt ellenőrzés nélkül osztódik', '2D · Daganat alakul ki'];
SC.push({
  g: 4, title: 'A mutációk típusai', short: 'Gén, kromoszóma vagy egész genom: mi változhat meg?',
  txt: 'A <span class="k">mutáció</span> a genetikai anyag megváltozása. Aszerint, hogy mekkora részét érinti, lehet <b>gén-</b>, <b>kromoszóma-</b> és <b>genommutáció</b>. Ha ivarsejtben történik, öröklődhet; ha testi (szomatikus) sejtben, nem öröklődik, de daganatot okozhat.',
  think: [
    ['Melyik mutáció öröklődhet az utódokra: az ivarsejti vagy a szomatikus?', 'Az ivarsejti mutáció. A testi sejtek mutációja nem jut el az utódokhoz.'],
    ['Lehet-e egy mutáció hasznos?', 'Ritkán igen: segítheti az alkalmazkodást a környezethez. A legtöbb mutáció azonban semleges vagy káros.'],
    ['Hogyan alakul ki a daganat?', 'Egy testi sejt mutációt szenved, és ellenőrzés nélkül osztódni kezd. A sok mutáns sejtből álló tömeg a daganat.'],
  ],
  tip: ['or', 'Mutagén tényezők', '<span class="w">Fizikai:</span> UV-, röntgen- és gammasugárzás, hősokk. <span class="w">Kémiai:</span> a dohányfüst mérgező anyagai, alkohol, egyes festékanyagok, rovar- és gombaölő szerek. <span class="w">Biológiai:</span> vírusok, kórokozók.'],
  init(st, ct) {
    this.cv = Cv(st); this.mode = 0; this.ev = 0; this.t = 0;
    this.seq = 'ATGCCGTAGCTAGG'.split(''); this.orig = this.seq.slice(); this.mp = -1;
    this.sm = seg(MUTM.map(m => m.n.split(' – ')[0].replace('Szomatikus mutáció', 'Rák')), i => { this.mode = i; this.reset(); });
    this.bm = btn(I.next + 'Mutáció!', () => this.space(), 'o');
    ct.append(this.sm, this.bm, btn(I.reset + 'Vissza', () => this.reset()));
    this.sm.set(0); this.reset();
  },
  reset() { this.ev = 0; this.t = 0; this.seq = this.orig.slice(); this.mp = -1; this.grow = 0; this.tum = null; this.sm.set(this.mode); UI.data(this); },
  space() {
    this.ev = 1; this.t = 0;
    if (this.mode === 0) { this.seq = this.orig.slice(); this.mp = 2 + Math.floor(Math.random() * 10); const o = this.orig[this.mp]; const ch = 'ATGC'.replace(o, ''); this.seq[this.mp] = ch[Math.floor(Math.random() * 3)]; }
    if (this.mode === 3) { this.tum = { c: 6 + Math.floor(Math.random() * 4), r: 3 + Math.floor(Math.random() * 2), set: new Set(), acc: 0 }; this.tum.set.add(this.tum.c + ',' + this.tum.r); }
    UI.data(this);
  },
  data() {
    const m = MUTM[this.mode];
    let h = `<div class="dtitle">${m.n}</div><div class="dsub">${m.d}</div>${drow('Példa', m.ex, C.orange)}`;
    if (this.mode === 3) h += drow('Lépés', RAK[this.stage()].split(' · ')[0], C.red);
    return h;
  },
  stage() { if (!this.ev || !this.tum) return 0; const n = this.tum.set.size; return n < 2 ? 1 : n < 14 ? 2 : 3; },
  tick(dt, T) {
    this.t += dt;
    const o = this.cv.fit(), ctx = o.ctx, W = o.w, H = o.h, fs = clamp(Math.min(W, H) * .034, 12, 28), m = MUTM[this.mode];
    text(ctx, m.s.toUpperCase(), W / 2, H * .06, C.text, fs * 1.05, 'center', 700);
    const flash = this.ev ? Math.max(0, 1 - this.t * 1.5) : 0;
    if (flash > 0) { ctx.fillStyle = `rgba(255,210,63,${.12 * flash})`; ctx.fillRect(0, 0, W, H); }
    if (this.mode === 0) {
      const n = this.seq.length, bw = Math.min(W * .9 / n, H * .1), x0 = W / 2 - bw * n / 2;
      const strand = (y, seq, lab, hl) => {
        text(ctx, lab, W / 2, y - bw * 1.05, C.dim, fs * .9, 'center', 700);
        seq.forEach((b, i) => {
          const x = x0 + i * bw, c2 = PAIR[b];
          for (const [bb, yy] of [[b, y], [c2, y + bw * 1.15]]) {
            ctx.fillStyle = rgba(BC[bb], .22); ctx.strokeStyle = BC[bb]; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.roundRect(x + bw * .08, yy - bw * .45, bw * .84, bw * .9, bw * .15); ctx.fill(); ctx.stroke();
            text(ctx, bb, x + bw / 2, yy, BC[bb], bw * .55, 'center', 700);
          }
          if (hl && i === this.mp) { ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 4; ctx.shadowColor = C.red; ctx.shadowBlur = 14 + 10 * Math.sin(T * 5); ctx.beginPath(); ctx.roundRect(x - bw * .02, y - bw * .6, bw * 1.04, bw * 2.35, bw * .2); ctx.stroke(); ctx.restore(); }
        });
      };
      strand(H * .3, this.orig, 'EREDETI GÉNSZAKASZ', false);
      strand(H * .64, this.seq, this.ev ? 'A MUTÁCIÓ UTÁN' : 'MÉG NEM TÖRTÉNT MUTÁCIÓ', true);
      if (this.ev && this.mp >= 0) text(ctx, `A ${this.mp + 1}. bázispár megváltozott: ${this.orig[this.mp]}–${PAIR[this.orig[this.mp]]} helyett ${this.seq[this.mp]}–${PAIR[this.seq[this.mp]]}`, W / 2, H * .92, C.red, fs, 'center', 700);
      else text(ctx, 'Nyomd meg a „Mutáció!” gombot!', W / 2, H * .92, C.faint, fs * .9, 'center', 600);
    } else if (this.mode === 1) {
      const len = H * .62, w = Math.min(W * .07, len * .2), cen = .27, cy = H * .5 + len * (cen - .5) + H * .04;
      const p = this.ev ? ease(clamp(this.t / 1.6, 0, 1)) : 0, cut = -cen * len * .45;
      for (const [x, lab, mut] of [[W * .3, 'NORMÁLIS 5-ÖS', false], [W * .7, this.ev ? 'MUTÁNS 5-ÖS' : '5-ÖS KROMOSZÓMA', true]]) {
        if (mut) {
          sister(ctx, x, cy, len, w, C.cyan, 1, cen, 0, .07, [cut, 1e9]);
          ctx.save(); ctx.translate(w * 1.8 * p, -len * .1 * p); ctx.globalAlpha *= 1 - p * .75;
          ctx.translate(x, cy); ctx.rotate(.4 * p); ctx.translate(-x, -cy);
          sister(ctx, x, cy, len, w, this.ev ? C.red : C.cyan, 1, cen, 0, .07, [-1e9, cut]); ctx.restore();
        } else sister(ctx, x, cy, len, w, C.cyan, 1, cen);
        text(ctx, lab, x, cy + len * (1 - cen) + fs * 1.4, mut && this.ev ? C.red : C.text, fs, 'center', 700);
      }
      label(ctx, 'Rövid kar', W * .3 - w * 1.1, cy - cen * len * .6, W * .1, cy - cen * len * .9, C.dim, fs * .85);
      label(ctx, 'Centroméra', W * .3 + w * .35, cy, W * .46, cy + len * .1, C.dim, fs * .85);
      if (p > .6) text(ctx, 'Elveszett darab', Math.min(W * .7 + w * 2.6, W - fs * 4.5), cy - len * .45, C.red, fs * .9, 'center', 700);
      text(ctx, this.ev ? 'A rövid kar egy része hiányzik → macskanyávogás-szindróma' : 'Nyomd meg a „Mutáció!” gombot!', W / 2, H * .95, this.ev ? C.red : C.faint, fs * .95, 'center', 600);
    } else if (this.mode === 2) {
      const len = H * .3, w = Math.min(W * .05, len * .26), cy = H * .45;
      const pair = (x, n, a3) => { for (let k = 0; k < n; k++) { const xx = x + (k - (n - 1) / 2) * w * 2.8, a = k === 2 ? a3 : 1; sister(ctx, xx, cy, len, w, k === 2 ? C.red : C.cyan, a, .27, k === 2 ? 18 * a3 : 0); } };
      const a3 = this.ev ? ease(clamp(this.t / 1.2, 0, 1)) : 0;
      pair(W * .28, 2, 1); pair(W * .72, this.ev ? 3 : 2, a3);
      text(ctx, '21-ES KROMOSZÓMAPÁR', W * .28, cy + len * .9, C.text, fs, 'center', 700); text(ctx, '2 db · 46 kromoszóma', W * .28, cy + len * .9 + fs * 1.3, C.dim, fs * .9, 'center', 600);
      text(ctx, this.ev ? '21-ES TRISZÓMIA' : '21-ES KROMOSZÓMAPÁR', W * .72, cy + len * .9, this.ev ? C.red : C.text, fs, 'center', 700);
      text(ctx, this.ev ? '3 db · 47 kromoszóma → Down-kór' : '2 db · 46 kromoszóma', W * .72, cy + len * .9 + fs * 1.3, this.ev ? C.red : C.dim, fs * .9, 'center', 600);
      text(ctx, this.ev ? 'A meiózisban a pár nem vált szét: az ivarsejtbe két 21-es került.' : 'Nyomd meg a „Mutáció!” gombot!', W / 2, H * .93, this.ev ? C.text : C.faint, fs * .9, 'center', 600);
    } else {
      const cols = 15, rows = 8, cw = W * .86 / cols, ch = H * .62 / rows, x0 = W * .07, y0 = H * .16, r = Math.min(cw, ch) * .46;
      if (this.tum) { this.tum.acc += dt; if (this.tum.acc > .55 && this.tum.set.size < 60) { this.tum.acc = 0; const add = []; for (const k of this.tum.set) { const [c, rr] = k.split(',').map(Number); const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]][Math.floor(Math.random() * 4)]; add.push((c + nb[0]) + ',' + (rr + nb[1])); } add.forEach(k => { const [c, rr] = k.split(',').map(Number); if (c >= 0 && c < cols && rr >= 0 && rr < rows) this.tum.set.add(k); else this.tum.set.add(k); }); UI.data(this); } }
      const R = rng(5);
      for (let rr = 0; rr < rows; rr++) for (let c = 0; c < cols; c++) {
        const x = x0 + (c + .5 + (rr % 2) * .5) * cw, y = y0 + (rr + .5) * ch, mut = this.tum && this.tum.set.has(c + ',' + rr);
        const rad = r * (mut ? 1.12 : 1) * (.92 + R() * .12);
        ctx.fillStyle = mut ? 'rgba(255,93,115,.35)' : 'rgba(46,155,255,.14)'; ctx.strokeStyle = mut ? C.red : rgba(C.cyan, .7); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, y, rad, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.fillStyle = mut ? '#a0203a' : '#3d2f96'; ctx.beginPath(); ctx.arc(x + rad * .1, y - rad * .05, rad * .38, 0, TAU); ctx.fill();
      }
      // a szöveten kívülre nőtt sejtek (daganat)
      if (this.tum) {
        const out = [...this.tum.set].map(k => k.split(',').map(Number)).filter(([c, rr]) => c < 0 || c >= cols || rr < 0 || rr >= rows);
        const extra = Math.max(0, this.tum.set.size - 18), cx = x0 + (this.tum.c + .5) * cw, cy = y0 + (this.tum.r + .5) * ch, R2 = rng(9);
        for (let i = 0; i < Math.min(40, extra + out.length); i++) { const a = R2() * TAU, d = Math.sqrt(R2()) * r * (1.2 + Math.sqrt(extra) * .55); ctx.fillStyle = 'rgba(255,93,115,.55)'; ctx.strokeStyle = C.red; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d * .8, r * .9, 0, TAU); ctx.fill(); ctx.stroke(); }
      }
      const s = this.stage();
      text(ctx, RAK[s], W / 2, H * .88, s ? C.red : C.text, fs * 1.05, 'center', 700);
      if (!this.ev) text(ctx, 'Nyomd meg a „Mutáció!” gombot!', W / 2, H * .95, C.faint, fs * .9, 'center', 600);
    }
  },
});

// =====================================================================
// 12 – Kromoszóma-rendellenességek (kariotípus)
// =====================================================================
const KLEN = { 1: 248, 2: 242, 3: 198, 4: 190, 5: 181, 6: 171, 7: 159, 8: 145, 9: 138, 10: 134, 11: 135, 12: 133, 13: 114, 14: 107, 15: 102, 16: 90, 17: 83, 18: 80, 19: 59, 20: 64, 21: 47, 22: 51, X: 156, Y: 57 };
const KCEN = { 1: .5, 2: .39, 3: .47, 4: .27, 5: .27, 6: .35, 7: .38, 8: .31, 9: .36, 10: .3, 11: .4, 12: .27, 13: .15, 14: .15, 15: .17, 16: .41, 17: .3, 18: .22, 19: .45, 20: .44, 21: .27, 22: .29, X: .39, Y: .18 };
const KROWS = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11, 12], [13, 14, 15, 16, 17, 18], [19, 20, 21, 22, 'S']];
const KAR = [
  { n: 'Nő', f: '46,XX', sex: ['X', 'X'], hl: null, d: 'Normális női kariotípus: 22 pár autoszóma és két X kromoszóma.' },
  { n: 'Férfi', f: '46,XY', sex: ['X', 'Y'], hl: null, d: 'Normális férfi kariotípus: 22 pár autoszóma, egy X és egy Y kromoszóma.' },
  { n: 'Down-kór', f: '47 · 21-es triszómia', sex: ['X', 'Y'], hl: 21, tri: 21, d: 'Autoszómális genommutáció: a 21-es kromoszómából három van. Jellemző a rövid nyak, a ferde szemrés, gyakran szívrendellenesség és tanulási nehézség. Az érintettek sokszor nagyon barátságosak, egyes területeken kreatívak lehetnek.' },
  { n: 'Turner-kór', f: '45,X0', sex: ['X'], hl: 'S', d: 'Heteroszómális genommutáció nőknél: csak egy X kromoszóma van. Alacsony termet, testi alulfejlettség és gyakran meddőség jellemzi.', fr: 'kb. 1 : 2500 nő' },
  { n: 'Klinefelter-kór', f: '47,XXY', sex: ['X', 'X', 'Y'], hl: 'S', d: 'Heteroszómális genommutáció férfiaknál: egy fölös X kromoszóma van. Az érintett férfi általában magas, a másodlagos nemi jellegek késve jelennek meg, és általában nemzőképtelen.', fr: 'kb. 1 : 1000 fiú' },
  { n: 'X-triszómia', f: '47,XXX', sex: ['X', 'X', 'X'], hl: 'S', d: 'Heteroszómális genommutáció nőknél: három X kromoszóma van.' },
];
SC.push({
  g: 4, title: 'Kromoszóma-rendellenességek', short: 'Számold meg a kromoszómákat a kariotípuson!',
  txt: 'A <span class="k">genommutációk</span> a kromoszómák számát változtatják meg. Általában akkor jönnek létre, ha a meiózisban egy kromoszómapár nem válik szét, és az ivarsejtbe eggyel több vagy kevesebb kromoszóma kerül. A kariotípuson ez jól látható.',
  think: [
    ['Hány kromoszóma van a Down-kóros ember sejtjeiben?', '47: a 21-es kromoszómából kettő helyett három van (21-es triszómia).'],
    ['Melyik rendellenességben hiányzik egy kromoszóma?', 'A Turner-kórban (45,X0): a nőnek csak egy X kromoszómája van.'],
    ['Miért nem születik soha 0Y kariotípusú gyermek?', 'Mert az X kromoszómán létfontosságú gének vannak. A 0Y embrió már a méhen belül elhal.'],
    ['Autoszómális vagy heteroszómális genommutáció a Klinefelter-kór?', 'Heteroszómális: a nemi kromoszómák száma változik (XXY).'],
  ],
  tip: ['cy', 'Tudtad?', 'Az X kromoszóma hiánya (X-monoszómia) a legtöbb esetben már a terhesség alatt az embrió elhalásához vezet: a tankönyv szerint az ilyen terhességek 95%-a vetéléssel végződik.'],
  init(st, ct) {
    this.cv = Cv(st); this.k = 0;
    this.sk = seg(KAR.map(k => k.n), i => { this.k = i; this.upd(); });
    ct.append(this.sk); this.ph = photoLayer(st, ct, () => ['kariotipusno', 'kariotipus', 'downkariotipus', 'turner', 'klinefelter', null][this.k]); this.upd();
  },
  space() { this.k = (this.k + 1) % KAR.length; this.upd(); },
  upd() { this.sk.set(this.k); this.ph && this.ph.upd(); UI.data(this); },
  count() { const K = KAR[this.k]; return 44 + K.sex.length + (K.tri ? 1 : 0); },
  data() {
    const K = KAR[this.k], n = this.count();
    return `<div class="dtitle">${K.n}</div><div class="dbig" style="color:${n === 46 ? C.green : C.red}">${K.f}</div><div class="dsub">${K.d}</div>${drow('Kromoszómák száma', n, n === 46 ? C.green : C.red)}${K.fr ? drow('Gyakoriság (tankönyv)', K.fr) : ''}`;
  },
  tick(dt, T) {
    const o = this.cv.fit(), ctx = o.ctx, W = o.w, H = o.h, fs = clamp(Math.min(W, H) * .03, 11, 24), K = KAR[this.k];
    const top = H * .1, rh = H * .8 / 4, unit = rh * .62 / 248, slot = W * .92 / 7;
    text(ctx, `${K.n.toUpperCase()} · ${this.count()} KROMOSZÓMA`, W / 2, H * .05, this.count() === 46 ? C.text : C.red, fs * 1.2, 'center', 700);
    KROWS.forEach((row, ri) => {
      const x0 = W / 2 - row.length * slot / 2, base = top + rh * (ri + 1) - fs * 1.5;
      row.forEach((id, j) => {
        const cx = x0 + (j + .5) * slot, items = id === 'S' ? K.sex : Array(id === K.tri ? 3 : 2).fill(id), hl = K.hl === id;
        if (hl) { ctx.save(); ctx.fillStyle = rgba(C.red, .1 + .05 * Math.sin(T * 4)); ctx.strokeStyle = rgba(C.red, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(cx - slot * .47, base - rh * .78, slot * .94, rh * .78 + fs * 1.4, 10); ctx.fill(); ctx.stroke(); ctx.restore(); }
        const gap = Math.min(slot / (items.length + .6), unit * 60);
        items.forEach((c, k) => {
          const len = KLEN[c] * unit, w = Math.max(3, unit * 22), x = cx + (k - (items.length - 1) / 2) * gap, cen = KCEN[c], y = base - len * (1 - cen);
          const col = c === 'X' ? GIRL : c === 'Y' ? BOY : (hl && k === 2 ? C.red : '#2e9bff');
          sister(ctx, x, y, len, w, col, 1, cen, 0, .05);
        });
        text(ctx, id === 'S' ? K.sex.join('') || '–' : String(id), cx, base + fs * .8, hl ? C.red : C.dim, fs, 'center', 700);
      });
    });
  },
});
