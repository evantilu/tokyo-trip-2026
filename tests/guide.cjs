const fs=require('fs'),vm=require('vm'),assert=require('assert');
const file=require('path').resolve(__dirname,'../site/index.html');
const html=fs.readFileSync(file,'utf8');
class El{constructor(id){this.id=id;this.innerHTML='';this.textContent='';this.value='';this.clientWidth=820;this.clientHeight=560;this.dataset={};this.checked=false;this.classList={toggle(){}};this.scrollIntoView=function(){};this.selectedOptions=[{text:'先保留，待店家確認'}]}
querySelectorAll(sel){if(this._q&&this._q.sel===sel&&this._q.html===this.innerHTML)return this._q.nodes;let attr=sel==='button'?'day':sel==='input'?'check':sel==='[data-phone-day]'?'phone-day':'point';const nodes=[...this.innerHTML.matchAll(new RegExp('data-'+attr+'="([^"]+)"','g'))].map(m=>{const e=new El('');e.dataset[attr==='phone-day'?'phoneDay':attr]=m[1];return e});this._q={sel,html:this.innerHTML,nodes};return nodes}setAttribute(){} }
const els={};const ctx={document:{addEventListener(){},querySelectorAll(){return[]},getElementById:id=>els[id]||(els[id]=new El(id)),createElement:()=>({click(){}})},localStorage:{getItem(){return null},setItem(){}},window:{print(){},addEventListener(){}},console,URL:{createObjectURL(){return'blob:test'},revokeObjectURL(){}},Blob,setTimeout,Date};
vm.createContext(ctx);vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],ctx);
function run(s){return vm.runInContext(s,ctx)}
assert.equal((els.phoneDates.innerHTML.match(/data-phone-day=/g)||[]).length,5);assert(els.map.innerHTML.includes('data:image/png;base64,'));assert.equal((els.map.innerHTML.match(/<image /g)||[]).length,20);
for(const day of ['17','18','19','20','21']){run(`state.selected='${day}';render();`);assert(els.guide.innerHTML.includes('11/'+day));assert(!/undefined|NaN/.test(els.map.innerHTML.replace(/href="data:image[^"]+"/g,'')));assert(!/undefined|NaN/.test(els.guide.innerHTML));if(day==='19'||day==='20')fs.writeFileSync('/tmp/tokyo-guide-map-'+day+'.svg',els.map.innerHTML);}
run("state.bikeDay='19';state.selected='18';render()");assert(els.guide.innerHTML.includes('下北澤線路街'));assert(els.guide.innerHTML.includes('11/16（一）15:00'));
run("state.selected='19';render()");assert(els.guide.innerHTML.includes('購車／取貨優先'));
run("state.bikeMode='city';render()");assert(els.guide.innerHTML.includes('東京站、丸之內到日本橋'));
run("state.bikeDay='18';state.bikeMode='hold';state.selected='19';render()");assert(els.guide.innerHTML.includes('11/17（二）15:00'));
for(let i=0;i<15;i++)run('zoom(.75)');assert(!/NaN/.test(els.map.innerHTML.replace(/href="data:image[^"]+"/g,'')));for(let i=0;i<15;i++)run('zoom(1.33)');assert(!/NaN/.test(els.map.innerHTML.replace(/href="data:image[^"]+"/g,'')));
run('mapAll=true;render()');assert(els.mapAside.innerHTML.includes('全部範圍'));assert(!/NaN/.test(els.map.innerHTML.replace(/href="data:image[^"]+"/g,'')));
run("state.selected='17';mapAll=false;render()");fs.writeFileSync('/tmp/tokyo-guide-map-17.svg',els.map.innerHTML);
assert.equal((els.printDays.innerHTML.match(/day-print/g)||[]).length,5);assert(els.printDays.innerHTML.includes('11/21'));
els.map.clientWidth=375;els.map.clientHeight=340;run("state.selected='19';render();");assert(!/NaN/.test(els.map.innerHTML.replace(/href="data:image[^"]+"/g,'')));els.expandMap.onclick();assert.equal(els.expandMap.textContent,'關閉大地圖');els.expandMap.onclick();assert.equal(els.expandMap.textContent,'展開地圖');els.fitWalk.onclick();assert(els.map.innerHTML.includes('BONUS TRACK'));els.phoneDates.querySelectorAll('[data-phone-day]')[3].onclick();assert(els.guide.innerHTML.includes('11/20'));console.log(JSON.stringify({days:5,tiles:20,dateSwap:'passed',cityFallback:'passed',onsenDeadlines:'passed',mapZoom:'passed',fullPrint:'passed',allPointsInsideTiles:run('Object.values(points).every(p=>{const[x,y]=project(p.ll);return x>=0&&x<=1280&&y>=0&&y<=1024})')}));

// Exercise the added tour using the same runtime as the existing free itinerary.
for(const e of Object.values(els))e.style={};
const oldGet=ctx.document.getElementById;
ctx.document.getElementById=id=>{const e=oldGet(id);e.style=e.style||{};return e};
El.prototype.before=El.prototype.after=El.prototype.prepend=function(){};
El.prototype.addEventListener=function(){};
const oldQuery=El.prototype.querySelectorAll;
El.prototype.querySelectorAll=function(sel){
 if(sel==='[data-tour-day]'){
  if(this._tourHTML===this.innerHTML)return this._tourNodes;
  this._tourHTML=this.innerHTML;
  return this._tourNodes=[...this.innerHTML.matchAll(/data-tour-day="([^"]+)"/g)].map(m=>{const e=new El('');e.dataset.tourDay=m[1];return e});
 }
 if(sel==='[data-start-free]')return this.innerHTML.includes('data-start-free')?[new El('')]:[];
 return oldQuery.call(this,sel);
};
ctx.document.createElement=()=>new El('');
ctx.document.querySelector=()=>new El('nav');
ctx.location={hash:''};
run("state.notes='retain this note';state.checks.shipping=true");
vm.runInContext(fs.readFileSync(require('path').resolve(__dirname,'../site/tour.js'),'utf8'),ctx);
assert.equal(run('state.mode'),'tour');
assert.equal((els.phoneDates.innerHTML.match(/data-tour-day=/g)||[]).length,6);
assert(els.overview.hidden&&els.guide.hidden&&els.mapsection.hidden);
for(const day of ['12','13','14','15','16','17']){
 run(`selectTour('${day}',false)`);
 assert(els.tourGuide.innerHTML.includes('11/'+day));
 assert(!/undefined|NaN/.test(els.tourGuide.innerHTML));
 assert.equal((els.printDays.innerHTML.match(/day-print/g)||[]).length,11);
}
run("selectTour('12',false)");assert(els.tourPrev.disabled);
els.tourNext.onclick();assert.equal(run('state.tourDay'),'13');
run("selectTour('17',false)");els.tourNext.onclick();
assert.equal(run('state.mode'),'free');assert.equal(run('state.selected'),'17');
assert(!els.guide.hidden&&!els.mapsection.hidden&&els.tour.hidden);
assert.equal((els.phoneDates.innerHTML.match(/data-phone-day=/g)||[]).length,5);
els.phoneDates.querySelectorAll('[data-phone-day]')[3].onclick();assert(els.guide.innerHTML.includes('11/20'));
run("selectTour('15',false)");
els.phoneDates.querySelectorAll('[data-tour-day]')[4].onclick();assert.equal(run('state.tourDay'),'16');
assert.equal(run('state.notes'),'retain this note');assert.equal(run('state.checks.shipping'),true);
assert.equal(run('STORAGE'),'tokyo-guide-20261110-v4');
assert.equal(run('Object.values(tourDays).reduce((n,d)=>n+d.stops.length,0)'),26);
assert(els.printDays.innerHTML.includes('申請中'));assert(els.printDays.innerHTML.includes('路過不下車'));
console.log('PASS: six tour days, both modes, date buttons, next-day handoff, eleven print sections, saved notes preserved');
