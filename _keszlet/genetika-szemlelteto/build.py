import json, re, glob, os
W = os.path.dirname(os.path.abspath(__file__))
rd = lambda f: open(os.path.join(W, f), encoding='utf-8').read()

TITLE = 'A genetikai anyag átörökítése'
head = rd('p_head.html')
head = head.replace('<title>A genetikai anyag – 8. osztály</title>', f'<title>{TITLE} – 8. osztály</title>')
head += '\n' + rd('extra.css')
body = rd('p_body.html')
body = body.replace('<b>A genetikai anyag</b><span>', f'<b>{TITLE}</b><span>')
body = body.replace('Öröklődés és változékonyság · 1. lecke', 'Öröklődés és változékonyság · 2. lecke')
body = body.replace('<h1>A genetikai<br><em>anyag</em></h1>', '<h1>A genetikai anyag<br><em>átörökítése</em></h1>')
body = re.sub(r'<p class="lead">.*?</p>', '<p class="lead">Hogyan jut el a <b>DNS</b> a szülőktől az utódokig? Megnézzük, hogyan osztódnak a sejtek, ki dönti el, hogy fiú vagy lány születik, hogyan számolható ki az öröklődés a <b>Punnett-táblán</b>, és mi történik, ha a genetikai anyag <b>megváltozik</b>.</p>', body, count=1, flags=re.S)

assets = {}
for f in glob.glob(os.path.join(W, 'img', '*')):
    k = os.path.splitext(os.path.basename(f))[0]
    import base64
    mime = 'image/jpeg' if f.endswith(('.jpg', '.jpeg')) else 'image/svg+xml' if f.endswith('.svg') else 'image/png'
    assets[k] = f'data:{mime};base64,' + base64.b64encode(open(f, 'rb').read()).decode()

game = rd('p_game.js')
game = game.replace("KEY = 'gen8_kerdeszsak_v1'", "KEY = 'gen8b_kerdeszsak_v1'")
game = game.replace("TEAMS = [{ n: 'Spirál', c: C.cyan }, { n: 'Kromatida', c: C.orange }]", "TEAMS = [{ n: 'Domináns', c: C.cyan }, { n: 'Recesszív', c: C.orange }]")
import solo_patch
game = solo_patch.apply(game)
main = rd('p_main.js')
main = re.sub(r"\n\s*else if \(view === 'scene' && si === 2 && /\^\[atgc\]\$/i\.test\(e\.key\)\) cur\.fill\(e\.key\.toUpperCase\(\)\);", '', main)
main = main.replace('gate panel hud gquest" style="--gc:${C.green}"', 'gate panel hud gquest" style="--gc:${C.yellow}"')
assert 'C.yellow' in main

parts = ['p_core.js', 'p_xchrom.js', 'c0_gates.js', 'p_photo.js'] + sorted(glob.glob(os.path.join(W, 'c[1-9]*.js'))) + ['qb.js']
js = "(()=>{\nconst ASSETS = " + json.dumps(assets) + ";\n" + '\n'.join(rd(os.path.basename(p)) for p in parts) + '\n' + game + '\n' + main

desk = head + '\n' + body + '\n' + js
# telefonos változat: a meglévő telefonos CSS + osztály
ph_css = rd('p_phone.css')
phone = desk.replace('<html lang="hu">', '<html lang="hu" class="phone">').replace('\n</style>', '\n' + ph_css + '\n' + rd('extra_phone.css') + solo_patch.CSS + '\n</style>', 1)
out = os.path.join(W, 'out'); os.makedirs(out, exist_ok=True)
open(os.path.join(out, 'genetikai-anyag-atorokitese.html'), 'w', encoding='utf-8').write(desk)
open(os.path.join(out, 'genetikai-anyag-atorokitese-telefon.html'), 'w', encoding='utf-8').write(phone)
print('ok', len(desk), len(phone))
