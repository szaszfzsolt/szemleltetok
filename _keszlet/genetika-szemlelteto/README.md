# Építőkészlet: egyfájlos szemléltető (minta: A genetikai anyag átörökítése)

Ebből a készletből épül a `biologia/8-osztaly/genetikai-anyag-atorokitese.html` és a telefonos változata.
A mappa neve aláhúzással kezdődik, ezért a GitHub Pages nem teszi közzé oldalként; csak forrás.

## Építés
```
python3 build.py            # → out/<név>.html és out/<név>-telefon.html
python3 test.py all         # minden jelenet 4 felbontáson, hibák száma (Playwright + Chromium)
python3 shot.py név 1920 1080 0 5 "s.space();"   # egy jelenet képernyőképe, JS-sel beállítva
```

## Fájlok
| Fájl | Mi van benne |
|---|---|
| `p_head.html` | fej, beágyazott Barlow-betűk, alap-CSS (az első szemléltetőből) |
| `p_body.html` | felső sáv, kezdőlap, kapu-, jelenet- és játéknézet |
| `p_core.js`, `p_xchrom.js`, `p_photo.js` | közös segédek: vászon, feliratok, DNS-spirál, kromoszóma, fotóréteg, gombok |
| `p_game.js` | záró küldetés (csapatverseny) |
| `solo_patch.py` | egyéni mód telefonra (`SOLO = PHONE`), a build alkalmazza |
| `p_main.js` | navigáció, billentyűk, fő ciklus |
| `p_phone.css`, `extra*.css` | telefonos és kiegészítő stílusok |
| `c0_gates.js` | témakörök (kapuk), fotók leírása és forrása (PH), közös rajzolók |
| `c1…c5_*.js` | jelenetek témakörönként (`SC.push({...})`) |
| `c9_fix.js` | utófeldolgozás (felső indexes allélbetűk) |
| `qb.js` | kérdésbank (`o[0]` mindig a helyes válasz; tipográfiai idézőjel nem lehet) |
| `img/` | beágyazott képek (a forrásuk a `c0_gates.js` PH-bejegyzéseiben) |
| `notebooklm_valasz.md` | a NotebookLM-ből kinyert tananyag (Litera + MEN) |

## Új szemléltető ebből
1. Másold a mappát új néven, a `build.py`-ban írd át a címet, a leckeszámot és a kimeneti fájlnevet.
2. Cseréld a `c*.js` jeleneteket, a `c0_gates.js` kapuit és fotóit, valamint a `qb.js` kérdéseit.
3. A `build.py` a `game` és a `main` szövegében néhány nevet cserél (csapatnevek, kérdészsák-kulcs): ezeket igazítsd az új témához.
