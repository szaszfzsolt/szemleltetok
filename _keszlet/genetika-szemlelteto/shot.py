# használat: python3 shot.py név szélesség magasság telefon(0/1) jelenet "js parancs" [várakozás ms]
import sys, os
from playwright.sync_api import sync_playwright
W=os.path.dirname(os.path.abspath(__file__))
name,w,h,ph,sc,js=sys.argv[1],int(sys.argv[2]),int(sys.argv[3]),sys.argv[4]=='1',int(sys.argv[5]),sys.argv[6]
wait=int(sys.argv[7]) if len(sys.argv)>7 else 2500
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-angle=swiftshader']); pg=b.new_page(viewport={'width':w,'height':h})
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file://'+W+'/out/genetikai-anyag-atorokitese'+('-telefon' if ph else '')+'.html'); pg.wait_for_timeout(600)
    pg.evaluate(f"location.hash='#s{sc}'"); pg.wait_for_timeout(500)
    if js: pg.evaluate(f"(()=>{{const s=window.__sc[{sc-1}]; {js} }})()")
    pg.wait_for_timeout(wait); pg.screenshot(path=f'{W}/shots/{name}.png'); print('errors',errs); b.close()
