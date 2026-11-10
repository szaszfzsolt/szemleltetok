
// ===== Záró küldetés – kérdésbank =====
// Megállapodás: az o[] tömbben a 0. elem MINDIG a helyes válasz (a játék keveri).
// s: 0 = könnyű (1 pont), 1 = közepes (2 pont), 2 = nehéz (3 pont)
// Tipográfiai idézőjel a JS-szövegekben NEM lehet (JÁTÉKMESTER 16. pont).
const QB = [
  // ---------- KÖNNYŰ ----------
  { s: 0, q: 'Hány kromoszóma van egy emberi testi sejtben?', o: ['46', '23', '44', '92'], e: 'A testi sejtek diploidok: 46 kromoszómájuk (23 pár) van.' },
  { s: 0, q: 'Hány kromoszóma van egy emberi ivarsejtben?', o: ['23', '46', '22', '44'], e: 'Az ivarsejtek haploidok: 23 kromoszómájuk van.' },
  { s: 0, q: 'Melyik a számcsökkentő sejtosztódás?', o: ['A meiózis', 'A mitózis', 'A megtermékenyítés', 'A mutáció'], e: 'A meiózisban a kromoszómaszám feleződik (2n → n).' },
  { s: 0, q: 'Mi jön létre a petesejt és a spermium egyesülésekor?', o: ['Zigóta', 'Gaméta', 'Kromatida', 'Daganat'], e: 'A megtermékenyített petesejt a zigóta: az új egyed első, egysejtes létformája.' },
  { s: 0, q: 'Milyen nemi kromoszómái vannak egy nőnek?', o: ['XX', 'XY', 'YY', 'X0'], e: 'A nők nemi kromoszómái XX, a férfiaké XY.' },
  { s: 0, q: 'Milyen nemi kromoszóma lehet egy spermiumban?', o: ['X vagy Y', 'Csak X', 'Csak Y', 'X és Y együtt'], e: 'A spermiumok fele X-et, fele Y-t hordoz.' },
  { s: 0, q: 'Milyen növénnyel kísérletezett Gregor Mendel?', o: ['Borsóval', 'Babbal', 'Kukoricával', 'Búzával'], e: 'Mendel borsónövényekkel tanulmányozta az öröklődést.' },
  { s: 0, q: 'Mit jelöl az F1 a keresztezéseknél?', o: ['Az első utódnemzedéket', 'A szülői nemzedéket', 'A domináns allélt', 'A második utódnemzedéket'], e: 'P = szülők, F1 = első, F2 = második utódnemzedék.' },
  { s: 0, q: 'Mire szolgál a Punnett-tábla?', o: ['Az utódok genotípusának kiszámítására', 'A kromoszómák megszámlálására', 'A DNS bázisainak leolvasására', 'A vércsoport meghatározására mikroszkóppal'], e: 'A Punnett-táblán a szülők ivarsejtjeiből kiszámoljuk a lehetséges utódokat és esélyüket.' },
  { s: 0, q: 'Mi a mutáció?', o: ['A genetikai anyag megváltozása', 'A sejt osztódása', 'Az ivarsejtek egyesülése', 'A kromoszómák párba rendeződése'], e: 'A mutáció a DNS, a gének vagy a kromoszómák megváltozása.' },
  { s: 0, q: 'Melyik betegség jellemzője a fölös számú ujj?', o: ['Polidaktília', 'Albinizmus', 'Hemofília', 'Daltonizmus'], e: 'Polidaktília (sokujjúság): fölös ujj a kézen vagy a lábon.' },
  { s: 0, q: 'Mi a daltonizmus?', o: ['Színtévesztés', 'Vérzékenység', 'Sokujjúság', 'Festékhiány a bőrben'], e: 'A daltonista főleg a vöröset és a zöldet nem tudja megkülönböztetni.' },
  { s: 0, q: 'Mi a hemofília másik neve?', o: ['Vérzékenység', 'Színtévesztés', 'Sokujjúság', 'Forrtujjúság'], e: 'Hemofíliában a vér nem alvad meg rendesen, kis sérülésre is vérzés alakul ki.' },
  { s: 0, q: 'A családfán mit jelöl a négyzet?', o: ['Férfit', 'Nőt', 'Házasságot', 'Hordozót'], e: 'Négyzet: férfi, kör: nő.' },
  { s: 0, q: 'Melyik a 21-es kromoszóma triszómiája?', o: ['Down-kór', 'Turner-kór', 'Klinefelter-kór', 'Daltonizmus'], e: 'A Down-kórban a 21-es kromoszómából három van.' },

  // ---------- KÖZEPES ----------
  { s: 1, q: 'Hány leánysejt keletkezik egy sejtből a mitózissal?', o: ['2', '4', '1', '46'], e: 'A mitózis két, az anyasejttel azonos kromoszómaszámú leánysejtet hoz létre.' },
  { s: 1, q: 'Hány ivarsejt keletkezik egy anyasejtből a meiózissal?', o: ['4', '2', '1', '23'], e: 'A meiózis két szakaszából négy haploid ivarsejt jön létre.' },
  { s: 1, q: 'Hol zajlik a meiózis?', o: ['Az ivarszervekben', 'A bőrben', 'A csontvelőben', 'Minden testi sejtben'], e: 'Ivarsejtek az ivarszervekben (petefészek, here) képződnek meiózissal.' },
  { s: 1, q: 'Mi a géncsere szerepe a meiózisban?', o: ['Változatos ivarsejtek jönnek létre', 'Megduplázza a kromoszómaszámot', 'Kijavítja a mutációkat', 'Eltávolítja az Y kromoszómát'], e: 'Az anyai és az apai kromoszómák között géncsere történik: ez a rekombináció.' },
  { s: 1, q: 'Melyik szülő ivarsejtje dönti el a gyermek nemét?', o: ['Az apáé', 'Az anyáé', 'Mindkettőé egyformán', 'Egyiké sem'], e: 'A petesejt mindig X-et hordoz, a spermium X-et vagy Y-t.' },
  { s: 1, q: 'Egy párnak három lánya van. Mekkora az esélye, hogy a negyedik gyermek fiú lesz?', o: ['50%', '100%', '75%', '25%'], e: 'Minden szülés független az előzőektől: az esély mindig 50%.' },
  { s: 1, q: 'Lila AA és fehér aa borsót kereszteztek. Milyenek az F1 utódok?', o: ['Mind lila (Aa)', 'Mind fehér (aa)', 'Fele lila, fele fehér', '3 lila : 1 fehér'], e: 'Minden utód Aa lesz; a lila szín domináns.' },
  { s: 1, q: 'Aa × Aa keresztezésnél mekkora arányban lesz fehér (aa) utód?', o: ['25%', '50%', '75%', '0%'], e: 'A négy négyzetből egy aa: 1/4 = 25%.' },
  { s: 1, q: 'Mi a 0-s vércsoportú ember genotípusa?', o: ['ℓℓ', 'Lᴬℓ', 'LᴬLᴮ', 'Lᴮℓ'], e: 'A 0-s vércsoport csak két recesszív ℓ allélnál alakul ki.' },
  { s: 1, q: 'Ki a betegséghordozó?', o: ['Egészséges heterozigóta, aki hibás recesszív allélt hordoz', 'Aki beteg, de nem tud róla', 'Akinek két hibás allélja van', 'Aki mutagén anyaggal dolgozik'], e: 'A hordozó heterozigóta: a hibás recesszív allél nála nem nyilvánul meg.' },
  { s: 1, q: 'Hol van a nemhez kötött betegségek génje legtöbbször?', o: ['Az X kromoszómán', 'Az Y kromoszómán', 'A 21-es kromoszómán', 'A mitokondriumban'], e: 'A heteroszómális betegségek mutáns génjei többnyire az X kromoszómán vannak.' },
  { s: 1, q: 'Miért gyakoribb a daltonizmus a fiúknál?', o: ['Mert egy X-ük van, egy hibás allél is elég', 'Mert két X kromoszómájuk van', 'Mert az Y kromoszóma okozza', 'Mert a betegség domináns'], e: 'A lányban a másik, ép X elnyomhatja a hibás allélt; a fiúnak nincs második X-e.' },
  { s: 1, q: 'Melyik mutáció öröklődhet az utódokra?', o: ['Az ivarsejtben bekövetkező', 'A bőrsejtben bekövetkező', 'A májsejtben bekövetkező', 'Bármelyik testi sejtben bekövetkező'], e: 'Csak az ivarsejtek mutációja jut el az utódokhoz.' },
  { s: 1, q: 'Melyik fizikai mutagén tényező?', o: ['Az UV-sugárzás', 'Az alkohol', 'A vírus', 'A cigarettafüst'], e: 'Fizikai mutagének: UV-, röntgen- és gammasugárzás, hősokk.' },
  { s: 1, q: 'Mi jellemzi a Turner-kórt?', o: ['Egy X kromoszóma hiányzik (45,X0)', 'Fölös X kromoszóma férfiban (47,XXY)', 'Három 21-es kromoszóma', 'Az 5-ös kromoszóma rövidebb'], e: 'Turner-kór: a nőnek csak egy X kromoszómája van.' },

  // ---------- NEHÉZ ----------
  { s: 2, q: 'Mi történne, ha az ivarsejtek nem meiózissal képződnének?', o: ['Nemzedékenként duplázódna a kromoszómaszám', 'Minden utód fiú lenne', 'Eltűnnének a recesszív allélok', 'Semmi nem változna'], e: 'Két 46-os ivarsejtből 92-es zigóta lenne, a következő nemzedékben 184-es.' },
  { s: 2, q: 'Két polidaktíliás szülőnek normális ujjszámú gyermeke született. Mi a szülők genotípusa?', o: ['Mindkettő Pp', 'Mindkettő PP', 'PP és pp', 'Mindkettő pp'], e: 'A pp gyermek mindkét szülőtől p-t kapott, tehát mindkettő heterozigóta.' },
  { s: 2, q: 'Két Pp szülő esetén mekkora a polidaktíliás gyermek esélye?', o: ['75%', '25%', '50%', '100%'], e: 'PP, Pp, Pp: négyből három esetben van P allél.' },
  { s: 2, q: 'Két egészséges szülő is hordozza a cisztás fibrózis allélját (Ff). Mekkora eséllyel lesz beteg a gyermekük?', o: ['25%', '50%', '75%', '0%'], e: 'Ff × Ff: egy ff, két Ff és egy FF négyzet.' },
  { s: 2, q: 'Az apa albínó, az anya nem, de az anya egyik szülője albínó volt. Mekkora eséllyel születik albínó gyermekük?', o: ['50%', '25%', '75%', '100%'], e: 'Az anya hordozó (Aa), az apa aa: Aa × aa → 50% aa.' },
  { s: 2, q: 'A szülők vércsoportja 0 és AB. Milyen vércsoportú gyermekük lehet?', o: ['A vagy B', 'Csak AB', '0 vagy AB', 'Bármelyik'], e: 'ℓℓ × LᴬLᴮ: a gyermek Lᴬℓ (A) vagy Lᴮℓ (B) lesz.' },
  { s: 2, q: 'Lehet-e két A vércsoportú szülőnek 0-s gyermeke?', o: ['Igen, ha mindketten Lᴬℓ genotípusúak', 'Nem, soha', 'Igen, ha mindketten LᴬLᴬ genotípusúak', 'Csak ha az egyikük AB'], e: 'Lᴬℓ × Lᴬℓ: 25% eséllyel ℓℓ, azaz 0-s gyermek.' },
  { s: 2, q: 'Az anya hordozó a daltonizmusra, az apa egészséges. Mekkora eséllyel daltonista egy FIÚGYERMEKÜK?', o: ['50%', '25%', '0%', '100%'], e: 'A fiú az anyjától kapja az X-et: fele eséllyel a hibásat.' },
  { s: 2, q: 'Az anya hordozó a daltonizmusra, az apa egészséges. Mekkora eséllyel daltonista egy LÁNYGYERMEKÜK?', o: ['0%', '25%', '50%', '100%'], e: 'A lány az apjától ép X-et kap, így legfeljebb hordozó lehet.' },
  { s: 2, q: 'Egy lány édesapja vérzékeny, édesanyja egészséges (nem hordozó). Mi igaz a lányra?', o: ['Biztosan hordozó', 'Biztosan vérzékeny', 'Biztosan nem hordozó', '50% eséllyel vérzékeny'], e: 'Az apjától a hibás X-et kapja, az anyjától épet: hordozó, de egészséges.' },
  { s: 2, q: 'A daltonista nagyapa lánya nem daltonista. Mi a lány genotípusa?', o: ['Hordozó heterozigóta', 'Ép homozigóta', 'Daltonista homozigóta', 'Nem lehet tudni'], e: 'A lány mindig megkapja az apja X kromoszómáját – itt a hibásat.' },
  { s: 2, q: 'Hány kromoszómája van egy Klinefelter-kóros férfinak?', o: ['47', '45', '46', '48'], e: 'Klinefelter-kór: 47,XXY – eggyel több X kromoszóma.' },
  { s: 2, q: 'Miért nem születik 0Y kariotípusú gyermek?', o: ['Az X-en létfontosságú gének vannak, az embrió elhal', 'Mert az Y kromoszóma mindig elvész', 'Mert a petesejtben nincs kromoszóma', 'Mert a 0Y kariotípus nőt jelent'], e: 'Az X kromoszóma nélkül az embrió már a méhen belül elhal.' },
  { s: 2, q: 'Melyik genommutáció?', o: ['A Down-kór', 'Az albinizmus', 'A hemofília', 'A macskanyávogás-szindróma'], e: 'A Down-kórban a kromoszómák száma változik meg (47).' },
  { s: 2, q: 'Hogyan alakul ki a daganat?', o: ['Egy testi sejt mutáció után ellenőrzés nélkül osztódik', 'Egy ivarsejt kétszer termékenyül meg', 'A sejtek abbahagyják az osztódást', 'Két sejt összeolvad'], e: 'A szomatikus mutáció nem öröklődik, de rákot okozhat.' },
];
