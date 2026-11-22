/* Kis futtató a vászonról exportált drótvázakhoz (x-dc sablon: {{lyukak}}, sc-for, sc-if, események, DCLogic). */
(function () {
  'use strict';
  window.DCLogic = class DCLogic {
    constructor(props) { this.props = props || {}; this.state = {}; }
    setState(p) {
      const next = typeof p === 'function' ? p(this.state, this.props) : p;
      this.state = Object.assign({}, this.state, next);
      if (this.__rerender) this.__rerender();
    }
    forceUpdate() { if (this.__rerender) this.__rerender(); }
  };

  const WHOLE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;
  const ANY = /\{\{\s*([^}]+?)\s*\}\}/g;

  function lookup(path, scope) {
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(path)) return parseFloat(path);
    const parts = path.split('.');
    let v = scope;
    for (const k of parts) { if (v == null) return undefined; v = v[k]; }
    return v;
  }
  const str = (v) => (v == null ? '' : String(v));

  function renderNodes(src, scope, out, ctx) {
    for (const n of Array.from(src.childNodes)) renderNode(n, scope, out, ctx);
  }

  function renderNode(n, scope, out, ctx) {
    if (n.nodeType === 3) {
      out.appendChild(document.createTextNode(n.nodeValue.replace(ANY, (_, p) => str(lookup(p, scope)))));
      return;
    }
    if (n.nodeType !== 1) return;
    const tag = n.localName;
    if (tag === 'helmet') return;
    if (tag === 'sc-for') {
      const m = WHOLE.exec(n.getAttribute('list') || '');
      const list = m ? lookup(m[1], scope) : [];
      const as = n.getAttribute('as') || 'item';
      (list || []).forEach((item, i) => {
        const s = Object.create(scope); s[as] = item; s.$index = i;
        renderNodes(n.content || n, s, out, ctx);
      });
      return;
    }
    if (tag === 'sc-if') {
      const m = WHOLE.exec(n.getAttribute('value') || '');
      if (m && lookup(m[1], scope)) renderNodes(n, scope, out, ctx);
      return;
    }
    const el = n.namespaceURI === 'http://www.w3.org/2000/svg'
      ? document.createElementNS(n.namespaceURI, tag) : document.createElement(tag);
    for (const a of Array.from(n.attributes)) {
      const name = a.name, val = a.value;
      if (/^on[a-z]+$/.test(name)) {
        const m = WHOLE.exec(val);
        const fn = m ? lookup(m[1], scope) : null;
        if (typeof fn === 'function') {
          const id = ctx.handlers.push(fn) - 1;
          el.setAttribute('data-dc-' + name.slice(2), String(id));
        }
        continue;
      }
      const m = WHOLE.exec(val);
      let v = m ? lookup(m[1], scope) : val.replace(ANY, (_, p) => str(lookup(p, scope)));
      if (v === false || v == null) continue;
      if (v === true) v = '';
      el.setAttribute(name, String(v));
    }
    if (tag === 'input' && el.hasAttribute('value')) el.value = el.getAttribute('value');
    renderNodes(n, scope, el, ctx);
    out.appendChild(el);
  }

  // Egyszerű DOM-összefésülés, hogy a futó animációk és a csúszka ne induljanak újra.
  function morph(cur, next) {
    const a = Array.from(cur.childNodes), b = Array.from(next.childNodes);
    for (let i = 0; i < b.length; i++) {
      const x = a[i], y = b[i];
      if (!x) { cur.appendChild(y); continue; }
      if (x.nodeType !== y.nodeType || x.nodeName !== y.nodeName) { cur.replaceChild(y, x); continue; }
      if (x.nodeType === 3) { if (x.nodeValue !== y.nodeValue) x.nodeValue = y.nodeValue; continue; }
      if (x.nodeType === 1) {
        for (const at of Array.from(x.attributes)) if (!y.hasAttribute(at.name)) x.removeAttribute(at.name);
        for (const at of Array.from(y.attributes)) if (x.getAttribute(at.name) !== at.value) x.setAttribute(at.name, at.value);
        if (x.localName === 'input' && y.hasAttribute('value') && document.activeElement !== x) x.value = y.getAttribute('value');
        morph(x, y);
      }
    }
    for (let i = a.length - 1; i >= b.length; i--) cur.removeChild(a[i]);
  }

  function boot() {
    const xdc = document.querySelector('x-dc');
    const scriptEl = document.querySelector('script[data-dc-script]');
    if (!xdc) return;
    const helmet = xdc.querySelector('helmet');
    if (helmet) Array.from(helmet.children).forEach((c) => document.head.appendChild(c.cloneNode(true)));
    const tpl = xdc.cloneNode(true);
    const h2 = tpl.querySelector('helmet'); if (h2) h2.remove();
    const props = {};
    try { const d = JSON.parse(scriptEl.getAttribute('data-props') || '{}'); for (const k in d) if (k[0] !== '$' && d[k] && 'default' in d[k]) props[k] = d[k].default; } catch (e) { }
    let comp;
    try { const C = new Function(scriptEl.textContent + '\n;return Component;')(); comp = new C(props); }
    catch (e) { console.error('DC-szkript hiba', e); comp = { renderVals: () => ({}), state: {} }; }
    const root = document.createElement('div');
    root.className = 'dc-root';
    xdc.replaceWith(root);
    let ctx = { handlers: [] };
    const render = () => {
      ctx = { handlers: [] };
      const frag = document.createElement('div');
      let vals = {};
      try { vals = comp.renderVals() || {}; } catch (e) { console.error(e); }
      renderNodes(tpl, vals, frag, ctx);
      morph(root, frag);
    };
    let queued = false;
    comp.__rerender = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; render(); }); } };
    ['click', 'change', 'input'].forEach((type) => {
      root.addEventListener(type, (ev) => {
        const key = type === 'input' ? 'change' : type;
        if (type === 'change' && ev.target.type === 'range') return;
        const t = ev.target.closest('[data-dc-' + key + ']');
        if (!t || !root.contains(t)) return;
        const fn = ctx.handlers[+t.getAttribute('data-dc-' + key)];
        if (fn) fn(ev);
      });
    });
    render();
    if (comp.componentDidMount) comp.componentDidMount();
    window.__ready = true;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
