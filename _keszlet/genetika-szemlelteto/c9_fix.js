
// a jelenetek szövegeiben is valódi felső index legyen (Xᴰ → X<sup>D</sup>)
SC.forEach(s => { s.txt = xhtml(s.txt); s.think = s.think.map(([q, a]) => [xhtml(q), xhtml(a)]); if (s.tip) s.tip[2] = xhtml(s.tip[2]); });
