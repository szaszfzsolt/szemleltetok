import sys, os
from playwright.sync_api import sync_playwright
f=sys.argv[1]; pre=sys.argv[2]
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-angle=swiftshader'])
    for w,h in [(844,390),(740,360)]:
        pg=b.new_page(viewport={'width':w,'height':h}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+f+'#jatek'); pg.wait_for_timeout(800); pg.screenshot(path=f'shots/{pre}_setup_{w}.png')
        pg.click('.glenb[data-n="8"]'); pg.wait_for_timeout(400); pg.screenshot(path=f'shots/{pre}_q_{w}.png')
        for i in range(8):
            if i%3==2: pg.evaluate('window.__game._finish(-1)')
            else: pg.evaluate('window.__game._answerCorrect()')
            pg.wait_for_timeout(150)
            if i==0: pg.screenshot(path=f'shots/{pre}_fb_{w}.png')
            pg.keyboard.press('Enter'); pg.wait_for_timeout(200)
        pg.screenshot(path=f'shots/{pre}_end_{w}.png'); print(w,'errors',errs); pg.close()
    b.close()
