// fotóréteg a jelenet színpadán; getKey() → PH kulcs vagy null
function photoLayer(st, ct, getKey, onTog) {
  const L = el('div', 'photo'); st.appendChild(L);
  const tg = el('button', 'toggle', '<i></i>Fotó'); tg.setAttribute('aria-pressed', 'false');
  const ft = el('button', 'toggle', '<i></i>Film'); ft.setAttribute('aria-pressed', 'false');
  const o = { on: false, film: false, L, tg, ft, key: null,
    upd() {
      const k = getKey(); o.key = k;
      tg.style.display = k ? '' : 'none';
      if (!k) o.on = false;
      const P = k && PH[k];
      ft.style.display = o.on && P && P.film ? '' : 'none';
      if (!(P && P.film)) o.film = false;
      tg.setAttribute('aria-pressed', o.on); ft.setAttribute('aria-pressed', o.film);
      L.classList.toggle('on', o.on);
      if (!o.on || !P) { L.innerHTML = ''; L.dataset.k = ''; return; }
      const id = k + (o.film ? ':f' : '');
      if (L.dataset.k === id) return;
      L.dataset.k = id;
      const isF = o.film, tagTxt = isF ? 'Film · gyorsított' : P.tag;
      let media;
      if (isF) media = `<div class="pframe"><video src="${ASSETS[P.film]}" autoplay muted loop playsinline></video></div>`;
      else if (P.pair) media = `<div class="ppair">${P.pair.map((a, i) => `<div class="pframe"><img src="${ASSETS[a]}" alt=""><span class="plab">${P.labels[i]}</span></div>`).join('')}</div>`;
      else media = `<div class="pframe${P.light ? ' light' : ''}${P.wide ? ' wide' : ''}"><img src="${ASSETS[P.img]}" alt=""></div>`;
      L.innerHTML = `<div class="pmedia"><span class="ptag">${tagTxt}</span>${media}</div>
        <div class="pcap">${isF ? P.fcap : P.cap}</div><div class="psrc">Forrás: ${isF ? P.fsrc : P.src}</div>`;
    } };
  tg.onclick = () => { o.on = !o.on; o.film = false; o.upd(); onTog && onTog(); };
  ft.onclick = () => { o.film = !o.film; o.upd(); };
  ct.append(tg, ft);
  return o;
}

// ===== UI-segédek =====
const UI = { cur: null, data(s) { if (UI.cur === s) $('#sData').innerHTML = s.data(); } };
function seg(labels, onSel, cls = '') {
  const s = el('div', 'seg ' + cls);
  const bs = labels.map((l, i) => { const b = el('button', null, l); b.onclick = () => { s.set(i); onSel(i); }; s.appendChild(b); return b; });
  s.set = i => bs.forEach((b, j) => b.classList.toggle('on', j === i));
  return s;
}
function playBtn(on) { const b = el('button', 'play'); b.innerHTML = I.play; b.title = 'Indítás / megállítás (szóköz)'; b.set = p => b.innerHTML = p ? I.pause : I.play; b.onclick = on; return b; }
function btn(html, on, cls = '') { const b = el('button', 'btn ' + cls, html); b.onclick = on; return b; }
function slider(txt, val, on) {
  const w = el('label', 'slider', `<span>${txt}</span>`); const r = el('input'); r.type = 'range'; r.min = 0; r.max = 1; r.step = .01; r.value = val;
  r.oninput = () => on(+r.value); w.appendChild(r); w.r = r; return w;
}
function labeled(txt, node) { const w = el('div', 'slider', `<span>${txt}</span>`); w.appendChild(node); return w; }
function navBtn(dir, on) { const b = el('button', 'nav', dir < 0 ? I.prev : I.next); b.onclick = on; return b; }
const drow = (k, v, col) => `<div class="drow"><span>${k}</span><b${col ? ` style="color:${col}"` : ''}>${v}</b></div>`;

const SC = [];