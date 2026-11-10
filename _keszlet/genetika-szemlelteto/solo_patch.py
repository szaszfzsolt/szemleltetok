"""Egyéni mód a záró küldetéshez: telefonon (PHONE) egy játékos játszik.
Ugyanaz a játékmotor; a csapatos részek SOLO esetén kimaradnak.
Használat: apply(js_szoveg) -> javított szöveg (assertekkel)."""

REPL = [
 # állandó
 ("const GAME = (() => {\n", "const GAME = (() => {\n  const SOLO = PHONE;                                   // telefonon egyéni játék\n"),
 # kezdőkép
 ("""          <h2>Genetikai <em>csapatverseny</em></h2>""",
  """          <h2>Genetikai <em>${SOLO ? 'próba' : 'csapatverseny'}</em></h2>"""),
 ("""        <p class="glead">Két csapat felváltva felel. Minden kérdésre <b>${TIME} másodperc</b> jut. A nehezebb kérdés többet ér, a helyes sorozatért kombóbónusz jár, és csapatonként egyszer bevethető a <b>Felező</b>, a <b>Duplázás</b> és a <b>Pontlopás</b>.</p>
        <div class="gteams">""",
  """        <p class="glead">${SOLO ? `Egyedül játszol. Minden kérdésre <b>${TIME} másodperc</b> jut. A nehezebb kérdés többet ér, a helyes sorozatért kombóbónusz jár, és egyszer bevethető a <b>Felező</b> és a <b>Duplázás</b>. A végén megkapod a rangodat és a hibáid magyarázatát.` : `Két csapat felváltva felel. Minden kérdésre <b>${TIME} másodperc</b> jut. A nehezebb kérdés többet ér, a helyes sorozatért kombóbónusz jár, és csapatonként egyszer bevethető a <b>Felező</b>, a <b>Duplázás</b> és a <b>Pontlopás</b>.`}</p>
        <div class="gteams"${SOLO ? ' style="display:none"' : ''}>"""),
 ("""<span>kérdés · kb. ${Math.round(n * 0.7)} perc</span>""", """<span>kérdés · kb. ${Math.round(n * (SOLO ? 0.5 : 0.7))} perc</span>"""),
 # pontmaximum
 ("qs.forEach((qi, k) => st.maxBase[k % 2] += QB[qi].s + 1);", "qs.forEach((qi, k) => st.maxBase[SOLO ? 0 : k % 2] += QB[qi].s + 1);"),
 # eredményjelzők
 ("""      <div class="gtop">
        ${[0, 1].map(t => `<div class="gsc panel" id="gsc${t}" style="--tc:${TEAMS[t].c}">
          <div class="gsc-h"><span>${t ? 'B' : 'A'} csapat</span><b>${TEAMS[t].n}</b></div>""",
  """      <div class="gtop${SOLO ? ' solo' : ''}">
        ${(SOLO ? [0] : [0, 1]).map(t => `<div class="gsc panel" id="gsc${t}" style="--tc:${TEAMS[t].c}">
          <div class="gsc-h"><span>${SOLO ? 'Egyéni játék' : (t ? 'B' : 'A') + ' csapat'}</span><b>${SOLO ? 'Te' : TEAMS[t].n}</b></div>"""),
 ("""            <button class="gtac" data-t="${t}" data-k="p" title="Helyes: az ellenfél −1 · rossz: saját −1">${TI.p}<span>Pontlopás</span></button>
          </div>
        </div>`).join(`<div class="gmid"><div class="gprog" id="gprog"></div><div class="gnum" id="gnum"></div></div>`)}""",
  """            ${SOLO ? '' : `<button class="gtac" data-t="${t}" data-k="p" title="Helyes: az ellenfél −1 · rossz: saját −1">${TI.p}<span>Pontlopás</span></button>`}
          </div>
        </div>`).join(`<div class="gmid"><div class="gprog" id="gprog"></div><div class="gnum" id="gnum"></div></div>`)}${SOLO ? `<div class="gmid"><div class="gprog" id="gprog"></div><div class="gnum" id="gnum"></div></div>` : ''}"""),
 # kérdés
 ("""    $g('#gturn').innerHTML = `Felel: <b style="color:${TEAMS[t].c}">${TEAMS[t].n}</b>`;""",
  """    $g('#gturn').innerHTML = SOLO ? `Pontjaid: <b style="color:${TEAMS[0].c}">${st.score[0]}</b>` : `Felel: <b style="color:${TEAMS[t].c}">${TEAMS[t].n}</b>`;"""),
 ("""    $g('#gprog').innerHTML = st.qs.map((q, k) => `<i style="${k < st.k ? `background:${rgba(TEAMS[k % 2].c, .55)}` : k === st.k ? `background:${TEAMS[k % 2].c};box-shadow:0 0 .5rem ${TEAMS[k % 2].c}` : ''}"></i>`).join('');
    [0, 1].forEach(x => $g('#gsc' + x).classList.toggle('act', x === t));""",
  """    const pc = k => TEAMS[SOLO ? 0 : k % 2].c;
    $g('#gprog').innerHTML = st.qs.map((q, k) => `<i style="${k < st.k ? `background:${rgba(pc(k), .55)}` : k === st.k ? `background:${pc(k)};box-shadow:0 0 .5rem ${pc(k)}` : ''}"></i>`).join('');
    [0, 1].forEach(x => { const s = $g('#gsc' + x); if (s) s.classList.toggle('act', x === t); });"""),
 # következő kérdés: nincs csapatváltás
 ("st.k++; st.turn = 1 - st.turn; ask();", "st.k++; if (!SOLO) st.turn = 1 - st.turn; ask();"),
 # pontjelzés
 ("""    [0, 1].forEach(t => {
      $g('#gpts' + t).textContent = st.score[t];""",
  """    if (SOLO && $g('#gturn')) $g('#gturn').innerHTML = `Pontjaid: <b style="color:${TEAMS[0].c}">${st.score[0]}</b>`;
    (SOLO ? [0] : [0, 1]).forEach(t => {
      $g('#gpts' + t).textContent = st.score[t];"""),
 # eredmény
 ("""    const [a, b] = st.score, win = a === b ? -1 : a > b ? 0 : 1;
    const miss = st.miss.map(i => QB[i]);""",
  """    const [a, b] = st.score, win = SOLO ? 0 : a === b ? -1 : a > b ? 0 : 1;
    const miss = st.miss.map(i => QB[i]);
    if (SOLO) return soloResult(miss);"""),
 ("""  function burstEnd(t) {""",
  """  function soloResult(miss) {
    const n = stars(0), pct = Math.round(st.right[0] / st.n * 100);
    $g('#gw').innerHTML = `
      <div class="gend">
        <div class="kicker" style="text-align:center">Egyéni próba · eredmény</div>
        <h2 class="gwin"><span style="color:${C.orange}">${RANKS[n - 1]}</span></h2>
        <div class="gres solo"><div class="gresc panel hud win" style="--tc:${TEAMS[0].c};--kc:${TEAMS[0].c}">
          ${badge(n, TEAMS[0].c)}<div><span class="gres-n">Eredményed</span><b class="gres-p">${st.score[0]} pont</b>
          <span class="gres-r">${RANKS[n - 1]}</span><span class="gres-s">${st.right[0]} / ${st.n} helyes válasz (${pct}%)</span></div></div></div>
        <div class="gmiss panel">
          <div class="dtitle">${miss.length ? `Ezeket érdemes átnézni (${miss.length})` : 'Hibátlan kör – nincs átnéznivaló!'}</div>
          ${miss.map(Q => `<div class="gmi"><b>${Q.q}</b><span>${Q.o[0]}<br><small style="color:var(--dim);font-weight:400">${Q.e}</small></span></div>`).join('')}
        </div>
        <div class="gendb"><button class="btn o" id="gagain">${I.reset}Új próba – új kérdésekkel</button><button class="btn" id="ghome">Kezdőlap</button></div>
      </div>`;
    $g('#gagain').onclick = setup; $g('#ghome').onclick = () => goHome();
    if (n >= 3) for (let i = 0; i < 3; i++) setTimeout(() => burstEnd(0), i * 350);
  }
  function burstEnd(t) {"""),
]

CSS = """
/* egyéni (telefonos) záró küldetés */
html.phone .gtop.solo{grid-template-columns:1fr auto}
html.phone .gres.solo{grid-template-columns:1fr}
html.phone .gmi span{max-width:55%}
"""

def apply(js):
    for a, b in REPL:
        assert js.count(a) == 1, ('nem található / nem egyedi', a[:80], js.count(a))
        js = js.replace(a, b)
    return js
