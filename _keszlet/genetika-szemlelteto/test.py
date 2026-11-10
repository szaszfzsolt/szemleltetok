import sys, os
from playwright.sync_api import sync_playwright
W=os.path.dirname(os.path.abspath(__file__))
which=sys.argv[1] if len(sys.argv)>1 else 'all'
sizes=[('d1920',1920,1080,''),('d1366',1366,768,''),('p844',844,390,'-telefon'),('p740',740,360,'-telefon')]
if which!='all': sizes=[s for s in sizes if s[0] in which.split(',')]
scenes=[int(x) for x in sys.argv[2].split(',')] if len(sys.argv)>2 else None
os.makedirs(W+'/shots',exist_ok=True)
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-angle=swiftshader'])
    for name,w,h,suf in sizes:
        pg=b.new_page(viewport={'width':w,'height':h})
        errs=[]
        pg.on('pageerror',lambda e:errs.append('PAGE '+str(e)))
        pg.on('console',lambda m:errs.append('CON '+m.text) if m.type=='error' else None)
        pg.goto('file://'+W+f'/out/genetikai-anyag-atorokitese{suf}.html'); pg.wait_for_timeout(800)
        n=pg.evaluate('window.__sc.length')
        if scenes is None or 0 in scenes:
            pg.screenshot(path=f'{W}/shots/{name}_home.png')
        for i in range(1,n+1):
            if scenes and i not in scenes: continue
            pg.evaluate(f"location.hash='#s{i}'"); pg.wait_for_timeout(700)
            pg.screenshot(path=f'{W}/shots/{name}_s{i:02d}.png')
        if scenes is None:
            pg.evaluate("location.hash='#g1'"); pg.wait_for_timeout(500); pg.screenshot(path=f'{W}/shots/{name}_g1.png')
            pg.evaluate("location.hash='#jatek'"); pg.wait_for_timeout(500); pg.screenshot(path=f'{W}/shots/{name}_jatek.png')
        print(name,'scenes',n,'errors',len(errs)); [print('  ',e[:300]) for e in errs[:10]]
        pg.close()
    b.close()
