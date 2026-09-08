const fs=require('fs');
(async()=>{
 const tabs=await(await fetch('http://localhost:9222/json')).json();const tab=tabs.find(t=>t.url==='about:blank')||tabs.find(t=>t.url.startsWith('file:'));const ws=new WebSocket(tab.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let seq=0;const pending=new Map();const errors=[];
 ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text+': '+m.params.exceptionDetails.exception?.description);};
 const send=(method,params={})=>new Promise(resolve=>{const id=++seq;pending.set(id,resolve);ws.send(JSON.stringify({id,method,params}));});
 const evaluate=async expression=>(await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result?.result?.value;
 await send('Runtime.enable');await send('Page.enable');
 const root='file:///C:/Users/hp/Downloads/well-known/';
 async function open(file,width,height){await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<768});await send('Page.navigate',{url:root+file});await new Promise(r=>setTimeout(r,1800));}
 const results=[];
 for(const [file,width,height,name]of [['index.html',1440,1100,'desktop-preview'],['index.html',390,844,'mobile-preview'],['automotive-bushes.html',390,844,'product-preview'],['contact.html?subject=Quote',768,1024,'contact-preview']]){
  await open(file,width,height);const result=await evaluate(`({title:document.title,overflow:document.documentElement.scrollWidth>innerWidth,brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.getAttribute('src')),navLinks:document.querySelectorAll('#brand-nav a').length,subject:document.querySelector('[name="subject"]')?.value})`);
  if(width<1200){result.mobileMenu=await evaluate(`(()=>{const b=document.querySelector('.menu-toggle');b.click();const open=b.getAttribute('aria-expanded')==='true'&&getComputedStyle(document.querySelector('#brand-nav')).display==='flex';b.click();return open&&b.getAttribute('aria-expanded')==='false'})()`);}
  if(file==='index.html'){result.slider=await evaluate(`(()=>{document.querySelector('[data-slide="0"]').click();const pass=document.querySelector('[data-slide="0"]').getAttribute('aria-pressed')==='true';document.querySelector('[data-slide="1"]').click();document.querySelector('.media-pause').click();return pass})()`);}
  await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false}).then(r=>fs.writeFileSync(name+'.png',Buffer.from(r.result.data,'base64')));results.push({file,width,...result});
 }
 const pages=fs.readdirSync('.').filter(f=>f.endsWith('.html'));let preserved=0;const failures=[];
 function content(html){return html.replace(/<!--[\s\S]*?-->/g,'').match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();}
 function images(html){return [...html.replace(/<!--[\s\S]*?-->/g,'').matchAll(/<img[^>]*src="([^"]*product[^\"]*)"/g)].map(m=>m[1]);}
 for(const file of pages){const before=fs.readFileSync('.redesign-originals/'+file,'utf8'),after=fs.readFileSync(file,'utf8');if(content(before)===content(after)&&JSON.stringify(images(before))===JSON.stringify(images(after)))preserved++;else failures.push(file);}
 console.log(JSON.stringify({results,contentPreserved:preserved,totalPages:pages.length,contentFailures:failures,errors},null,2));
 fs.writeFileSync('verification.json',JSON.stringify({results,contentPreserved:preserved,totalPages:pages.length,contentFailures:failures,errors},null,2));await send('Browser.close');ws.close();
})();

