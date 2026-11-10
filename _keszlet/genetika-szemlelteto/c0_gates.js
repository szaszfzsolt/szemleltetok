// ===== Tartalom =====
const GIRL = '#ff7eb6', BOY = '#3fd3ff', ILL = '#ff5d73', CAR = '#ffd23f', OKC = '#2fe59a';
const GATES = [
  { t: 'Sejtosztódás', c: C.cyan, d: 'Hogyan jut tovább a genetikai anyag sejtről sejtre és szülőről utódra?',
    lead: 'Testi sejtjeink mitózissal osztódnak, és megtartják a 46 kromoszómát. Az ivarszervekben meiózissal 23 kromoszómás ivarsejtek képződnek. A megtermékenyítéskor két ivarsejt egyesül, így a zigótában újra 46 kromoszóma lesz.',
    chips: [['2n = 46', 'testi sejt (diploid)'], ['n = 23', 'ivarsejt (haploid)'], ['Mitózis', 'számtartó osztódás'], ['Meiózis', 'számcsökkentő osztódás']] },
  { t: 'Fiú vagy lány?', c: C.purple, d: 'Ki dönti el a gyermek nemét, és mekkora az esély?',
    lead: 'A petesejtben mindig X kromoszóma van, a spermiumok fele X-et, fele Y-t hordoz. A gyermek nemét az dönti el, milyen spermium termékenyíti meg a petesejtet.',
    chips: [['22 + X', 'petesejt'], ['22 + X vagy Y', 'spermium'], ['XX', 'lány'], ['XY', 'fiú'], ['50%', 'esély mindkettőre']] },
  { t: 'Mendel és a Punnett-tábla', c: C.green, d: 'Hogyan számolható ki, milyen utódok születhetnek?',
    lead: 'Gregor Mendel borsókkal kísérletezve fedezte fel, hogyan adódnak át a tulajdonságok. A Punnett-táblán kiszámolhatjuk, milyen genotípusú utódok születhetnek, és mekkora valószínűséggel.',
    chips: [['P', 'szülői nemzedék'], ['F1', 'első utódnemzedék'], ['F2', 'második utódnemzedék'], ['3 : 1', 'lila : fehér az F2-ben'], ['ABO', 'vércsoportok']] },
  { t: 'Örökletes betegségek', c: C.red, d: 'Hogyan öröklődnek a génhibák, és mit mutat a családfa?',
    lead: 'Az örökletes betegségeket a szülők a génjeikkel vagy a kromoszómáikkal adják át az utódoknak. Ha a hibás gén testi kromoszómán van, autoszómális, ha nemi kromoszómán, heteroszómális (nemhez kötött) betegségről beszélünk.',
    chips: [['Autoszómális', 'testi kromoszómán'], ['Heteroszómális', 'nemi kromoszómán (X)'], ['Hordozó', 'egészséges heterozigóta'], ['Családfa', 'pedigré']] },
  { t: 'Mutációk', c: C.orange, d: 'Mi történik, ha megváltozik a genetikai anyag?',
    lead: 'A mutáció a genetikai anyag megváltozása. Érintheti egyetlen gén bázisait, egy kromoszóma szerkezetét vagy a kromoszómák számát. Mutációt környezeti tényezők, úgynevezett mutagének is kiválthatnak.',
    chips: [['Génmutáció', 'a bázisok változnak'], ['Kromoszóma-mutáció', 'a szerkezet változik'], ['Genommutáció', 'a szám változik'], ['Mutagének', 'sugárzás, vegyszer, vírus']] },
];

// ===== Valódi fotók =====
const PH = {
  kariotipusno: { img: 'kariotipusno', tag: 'Mikroszkópos fotó · 4800×',
    cap: 'Egy nő valódi kromoszómái mikroszkóp alatt (46,XX), még rendezetlenül, úgy, ahogy egy osztódó sejtben látszanak. A kariogramot úgy készítik, hogy az ilyen képről kivágják a kromoszómákat, és méret és alak szerint párokba rendezik.',
    src: 'Josef Reischig · Wikimedia Commons · CC BY-SA 3.0' },
  turner: { img: 'turner', tag: 'Mikroszkópos fotó (kariogram)', light: true,
    cap: 'Turner-kóros nő kariotípusa (45,X). Jobbra lent csak egyetlen X kromoszóma van: a második nemi kromoszóma hiányzik.',
    src: 'The cat · Wikimedia Commons · CC BY-SA 3.0 / GFDL' },
  klinefelter: { img: 'klinefelter', tag: 'Mikroszkópos fotó (kariogram) · utólag színezve',
    cap: 'Klinefelter-kóros férfi kariotípusa (47,XXY). Jobbra lent két X és egy kis Y kromoszóma látható. A színeket utólag, számítógéppel adták a képhez: a valóságban a kromoszómák nem ilyen színűek.',
    src: 'Wessex Regional Genetics Centre · Wellcome Collection · CC BY 4.0' },
  spermium: { img: 'spermium', tag: 'Elektronmikroszkópos fotó · 1000×',
    cap: 'Valódi emberi spermiumok pásztázó elektronmikroszkóp alatt. Jól látszik a fejük és a hosszú farokrészük (ostoruk). A háttér egy szűrő, a fekete pöttyök a lyukai.',
    src: 'Forskerunv · Wikimedia Commons · közkincs' },
  polidaktilia: { img: 'polidaktilia', tag: 'Röntgenfelvétel',
    cap: 'Egy tízéves fiú bal kezének röntgenképe: hat ujja van. A polidaktília domináns öröklődésű: már egy P allél is elég hozzá.',
    src: 'Drgnu23 · Wikimedia Commons · CC BY-SA 3.0 / GFDL' },
  albino: { img: 'albino', tag: 'Fotó',
    cap: 'Albinizmussal élő fiú. A bőréből, a hajából és a szeméből hiányzik a melanin festékanyag, ezért nagyon érzékeny a napfényre. Recesszív öröklődésű: csak aa genotípusnál alakul ki.',
    src: 'Karl Neilson · Wikimedia Commons · CC BY-SA 3.0 / GFDL' },
  ishihara8: { img: 'ishihara8', tag: 'Fotó',
    cap: 'Ishihara-féle színlátásvizsgáló táblák (1917–1959). Ép színlátással számok látszanak a pöttyök között, például 74, 6 és 5. A vörös-zöld színtévesztő nem látja őket, vagy más számot olvas.',
    src: 'Wellcome Collection · Wikimedia Commons · CC BY 4.0' },
  downkariotipus: { img: 'downkariotipus', tag: 'Ábra (kariogram)', light: true,
    cap: 'Down-kóros ember kariotípusa. A 21-es kromoszómából kettő helyett három van: ez a 21-es triszómia. Az utolsó helyen a nemi kromoszómák: XY (fiú) vagy XX (lány) – az ábrán az angol „or” szó jelentése: vagy.',
    src: 'National Human Genome Research Institute (NHGRI) · Wikimedia Commons · közkincs' },
  mitozis: { img: 'mitozis', tag: 'Mikroszkópos fotó · 1200×',
    cap: 'Valódi sejtek a hagyma gyökércsúcsából, festve. A legtöbb sejtben nyugvó sejtmag látszik. Néhány sejtben fonalakká tekeredett kromoszómák vannak, a bal oldali középső sejtben pedig a kromatidák már a sejt két pólusa felé húzódnak.',
    src: 'Josef Reischig · Wikimedia Commons · CC BY-SA 3.0' },
  virag: { pair: ['lila', 'feher'], tag: 'Fotó', labels: ['LILA – AA vagy Aa', 'FEHÉR – aa'],
    cap: 'Valódi borsóvirágok. Mendel ilyen lila és fehér virágú borsókat keresztezett. A lila szín domináns, a fehér recesszív.',
    src: 'Lila: Rasbak · CC BY-SA 3.0 · Fehér: net_efekt · CC BY 2.0 · Wikimedia Commons' },
  kariotipus: { img: 'kariotipus', tag: 'Mikroszkópos fotó (kariogram)', light: true,
    cap: 'Egy férfi valódi kariotípusa: 22 pár autoszóma, az utolsó pár X és Y. A fiú az apjától kapja az Y kromoszómát.',
    src: 'National Human Genome Research Institute (NHGRI) · Wikimedia Commons · közkincs' },
};

// ===== Közös rajzolók =====
// kromoszóma (egy kromatida) színezett kitöltéssel; centroméra a (x, y) pontban
function chromo(ctx, x, y, len, w, col, a = 1, rot = 0, cen = .4, glow = 0) {
  if (a <= .01) return;
  const pts = chromPts(len, w, cen, .36, 28);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot);
  if (glow) { ctx.shadowColor = col; ctx.shadowBlur = glow; }
  pathPts(ctx, pts);
  const g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
  g.addColorStop(0, mixHex(col, '#000000', .55)); g.addColorStop(.45, col); g.addColorStop(1, mixHex(col, '#000000', .6));
  ctx.fillStyle = g; ctx.fill(); ctx.shadowBlur = 0;
  ctx.strokeStyle = mixHex(col, '#ffffff', .45); ctx.lineWidth = Math.max(1, w * .08); ctx.stroke();
  ctx.restore();
}
// sejt hártyával
function cellShape(ctx, x, y, rx, ry, a = 1, col = C.cyan) {
  if (a <= .01) return;
  ctx.save(); ctx.globalAlpha *= a;
  const g = ctx.createRadialGradient(x, y, Math.min(rx, ry) * .2, x, y, Math.max(rx, ry));
  g.addColorStop(0, rgba(col, .04)); g.addColorStop(1, rgba(col, .2));
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = rgba(col, .18); ctx.lineWidth = Math.min(rx, ry) * .07; ctx.stroke();
  ctx.strokeStyle = rgba(col, .9); ctx.lineWidth = Math.max(1.2, Math.min(rx, ry) * .018); ctx.stroke();
  ctx.restore();
}
// SVG: családfajel / gyerekikon. sex: 'm' férfi (négyzet), 'f' nő (kör), null: rombusz (ismeretlen nem)
// st: 0 egészséges, 1 hordozó, 2 beteg, -1 ismeretlen
let _sid = 0;
function pedSym(x, y, r, sex, st, col = ILL) {
  const id = 'pc' + (++_sid);
  const shape = sex === 'm' ? `<rect x="${x - r}" y="${y - r}" width="${2 * r}" height="${2 * r}" rx="${r * .14}"`
    : sex === 'f' ? `<circle cx="${x}" cy="${y}" r="${r}"`
    : `<rect x="${x - r * .78}" y="${y - r * .78}" width="${r * 1.56}" height="${r * 1.56}" rx="${r * .12}" transform="rotate(45 ${x} ${y})"`;
  let h = `${shape} fill="${st === 2 ? col : 'rgba(5,14,32,.75)'}"/>`;
  if (st === 1) h += `<clipPath id="${id}"><rect x="${x}" y="${y - r * 1.2}" width="${r * 1.2}" height="${r * 2.4}"/></clipPath>${shape} fill="${col}" clip-path="url(#${id})"/>`;
  h += `${shape} fill="none" stroke="${st === -1 ? C.dim : st === 0 ? C.text : col}" stroke-width="${Math.max(2, r * .12)}"${st === -1 ? ` stroke-dasharray="${(r * .32).toFixed(1)} ${(r * .2).toFixed(1)}"` : ''}/>`;
  if (st === -1) h += `<text x="${x}" y="${y + r * .36}" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="${r}" fill="${C.dim}">?</text>`;
  return h;
}
// SVG: kis gyerekfigura (lány / fiú), kitöltése a családfa-szabály szerint
function kidSym(x, y, s, sex, st, col = ILL) {
  const id = 'kc' + (++_sid), base = sex === 'f' ? GIRL : sex === 'm' ? BOY : C.text;
  const body = sex === 'f'
    ? `M${x} ${y - s * .12} L${x + s * .42} ${y + s * .62} L${x - s * .42} ${y + s * .62} Z`
    : `M${x - s * .3} ${y - s * .1} h${s * .6} a${s * .08} ${s * .08} 0 0 1 ${s * .08} ${s * .08} v${s * .64} h${-s * .76} v${-s * .64} a${s * .08} ${s * .08} 0 0 1 ${s * .08} ${-s * .08}Z`;
  const head = `<circle cx="${x}" cy="${y - s * .38}" r="${s * .22}"`;
  const fillBody = st === 2 ? col : 'rgba(5,14,32,.75)';
  let h = `<path d="${body}" fill="${fillBody}"/>${head} fill="${fillBody}"/>`;
  if (st === 1) h += `<clipPath id="${id}"><rect x="${x}" y="${y - s}" width="${s}" height="${s * 2}"/></clipPath><path d="${body}" fill="${col}" clip-path="url(#${id})"/>${head} fill="${col}" clip-path="url(#${id})"/>`;
  const sc = st === 0 ? base : st === -1 ? C.dim : col;
  h += `<path d="${body}" fill="none" stroke="${sc}" stroke-width="${Math.max(2, s * .06)}" stroke-linejoin="round"/>${head} fill="none" stroke="${sc}" stroke-width="${Math.max(2, s * .06)}"/>`;
  if (sex === 'f') h += `<path d="M${x - s * .24} ${y - s * .42} q${-s * .1} ${s * .3} ${-s * .02} ${s * .36} M${x + s * .24} ${y - s * .42} q${s * .1} ${s * .3} ${s * .02} ${s * .36}" stroke="${sc}" stroke-width="${Math.max(2, s * .05)}" fill="none" stroke-linecap="round"/>`;
  return h;
}
const svgT = (x, y, txt, fs, col, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a || 'middle'}" font-family="${o.f || 'Barlow Condensed'}" font-weight="${o.w || 700}" font-size="${fs}"${o.ls ? ` letter-spacing="${o.ls}"` : ''} fill="${col}"${o.id ? ` id="${o.id}"` : ''}>${txt}</text>`;
const svgBox = (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r ?? 14}" fill="${o.f || 'rgba(10,24,52,.6)'}" stroke="${o.s || 'rgba(110,170,255,.3)'}" stroke-width="${o.sw || 2}"${o.id ? ` id="${o.id}"` : ''}${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
const pct = v => (Math.round(v * 1000) / 10).toString().replace('.', ',') + '%';
const sup = s => s.replace(/\^([A-Za-z])/g, (m, c) => `<tspan font-size="70%" dy="-0.55em">${c}</tspan><tspan dy="0.55em"> </tspan>`);
const supH = s => s.replace(/\^([A-Za-z])/g, '<sup>$1</sup>');

// felső indexes allélbetűk (Xᴰ, Xᵈ, Xᴴ, Xʰ) – a betűtípusban nincsenek, ezért valódi felső indexként írjuk ki
const SUPM = { 'ᴰ': 'D', 'ᵈ': 'd', 'ᴴ': 'H', 'ʰ': 'h' };
const xsvg = s => String(s).replace(/[ᴰᵈᴴʰ]/g, c => `<tspan dy="-0.42em" font-size="64%">${SUPM[c]}</tspan><tspan dy="0.42em" font-size="10%">\u00a0</tspan>`);
const xhtml = s => String(s).replace(/[ᴰᵈᴴʰ]/g, c => `<sup>${SUPM[c]}</sup>`);

// testvérkromatidák: a centroméránál összekapcsolódnak, a karok kissé szétállnak (X alak)
// clip: [yMin, yMax] a kromoszóma saját koordinátáiban (pl. elveszett darab rajzához)
function sister(ctx, x, y, len, w, col, a = 1, cen = .4, glow = 0, sp = .07, clip = null) {
  if (a <= .01) return;
  const top = -cen * len;
  for (const s of [-1, 1]) for (const up of [true, false]) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(up ? s * sp : -s * sp); ctx.translate(s * w * .33, 0);
    ctx.beginPath(); const y0 = up ? top - w : 0, y1 = up ? 0 : top + len + w;
    const c0 = clip ? Math.max(y0, clip[0]) : y0, c1 = clip ? Math.min(y1, clip[1]) : y1;
    if (c1 <= c0) { ctx.restore(); continue; }
    ctx.rect(-w * 2, c0, w * 4, c1 - c0); ctx.clip();
    chromo(ctx, 0, 0, len, w, col, a, 0, cen, glow);
    ctx.restore();
  }
}
