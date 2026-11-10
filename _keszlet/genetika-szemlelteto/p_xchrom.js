// X alakú (két kromatidás) kromoszóma: a karok a centroméránál szétnyílnak
function drawXChrom(ctx, len, w, cen, seed, a, spread, sep = 1, col = C.cyan, pinch = .45) {
  for (const s of [-1, 1]) for (const top of [true, false]) {
    ctx.save(); ctx.rotate(s * spread * (top ? 1 : -1)); ctx.translate(s * w * .5 * sep, 0);
    ctx.beginPath(); ctx.rect(-w * 2, top ? -len : 0, w * 4, len); ctx.clip();
    drawChromatid(ctx, len, w, cen, seed, a, col, pinch); ctx.restore();
  }
}
