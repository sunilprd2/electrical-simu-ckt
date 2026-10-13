const sheet=document.getElementById('sheet'), sim=document.getElementById('sim'), state=document.getElementById('state'), motorState=document.getElementById('motorState');

/* IEC-style component library. Device designations follow common IEC/industrial practice.
   Exact reference designators can be overridden per project/component. */
const groups=[
 {name:'Power',color:'#00dba5',items:[]},
 {name:'Others',color:'#64748b',items:[]},
 {name:'Coils',color:'#8b5cf6',items:[]},
 {name:'Auxiliaries',color:'#d4a017',items:[]},
 {name:'Switches',color:'#06b6d4',items:[]},
 {name:'Loads',color:'#f59e0b',items:[]},
 {name:'Contactors',color:'#10b981',items:[]},
 {name:'Protections',color:'#ef4444',items:[]},
 {name:'Motors',color:'#2563eb',items:[]}
];

function icon(type){
 const s='currentColor';
 const common=`stroke="${s}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
 const txt=(t)=>`<text x="24" y="20" text-anchor="middle" font-size="8" fill="${s}" font-family="Arial" font-weight="700">${t}</text>`;
 let body='';
 const contact=['no','auxno','mainno','relayno','start','limitno','foot','pressure','temperature','float','hand','twinnc','twinno','tdno','tdnc','offno','offnc','auxfront','auxside','change','changeover','mainnc','auxnc','relaync','stop','estop','limitnc'];
 const nc=['nc','auxnc','mainnc','relaync','stop','estop','limitnc','tdnc','offnc','twinnc'];
 if(type==='pe') body=`<line x1="24" y1="2" x2="24" y2="13" ${common}/><line x1="14" y1="13" x2="34" y2="13" ${common}/><line x1="17" y1="18" x2="31" y2="18" ${common}/><line x1="20" y1="23" x2="28" y2="23" ${common}/>`;
 else if(type==='gnd') body=`<line x1="24" y1="2" x2="24" y2="12" ${common}/><line x1="14" y1="12" x2="34" y2="12" ${common}/><line x1="17" y1="17" x2="31" y2="17" ${common}/><line x1="20" y1="22" x2="28" y2="22" ${common}/>`;
 else if(['dc-','dc+','n','l1','l2','l3'].includes(type)) body=`<line x1="24" y1="1" x2="24" y2="5" ${common}/><circle cx="24" cy="16" r="11" ${common}/><line x1="24" y1="27" x2="24" y2="31" ${common}/>${txt(type==='dc-'?'−':type==='dc+'?'+':type.toUpperCase())}`;
 else if(type==='3p') body=`<line x1="8" y1="1" x2="8" y2="8" ${common}/><line x1="24" y1="1" x2="24" y2="8" ${common}/><line x1="40" y1="1" x2="40" y2="8" ${common}/><circle cx="8" cy="15" r="6" ${common}/><circle cx="24" cy="15" r="6" ${common}/><circle cx="40" cy="15" r="6" ${common}/><line x1="8" y1="21" x2="8" y2="30" ${common}/><line x1="24" y1="21" x2="24" y2="30" ${common}/><line x1="40" y1="21" x2="40" y2="30" ${common}/><text x="8" y="17" text-anchor="middle" font-size="6" fill="${s}">L1</text><text x="24" y="17" text-anchor="middle" font-size="6" fill="${s}">L2</text><text x="40" y="17" text-anchor="middle" font-size="6" fill="${s}">L3</text>`;
 else if(['3pn','3ppe','1pn','1pnpe','dcpair'].includes(type)) {
  const xs=type==='1pn'||type==='1pnpe'?[16,32]:type==='dcpair'?[16,32]:type==='3pn'?[5,16,27,39]:[5,16,27,39];
  const labs=type==='1pn'?['L','N']:type==='1pnpe'?['L','N']:type==='dcpair'?['+','−']:type==='3pn'?['L1','L2','L3','N']:['L1','L2','L3','PE'];
  body=xs.map((x,i)=>`<circle cx="${x}" cy="8" r="5" ${common}/><line x1="${x}" y1="13" x2="${x}" y2="30" ${common}/><text x="${x}" y="10" text-anchor="middle" font-size="4.5" fill="${s}">${labs[i]}</text>`).join('');
 }
 else if(['psu3'].includes(type)) body=`<rect x="7" y="7" width="34" height="19" ${common}/><path d="M11 16 q3 -6 6 0 t6 0" ${common}/><line x1="27" y1="12" x2="36" y2="12" ${common}/><line x1="27" y1="16" x2="36" y2="16" ${common}/>${txt('AC/DC')}`;
 else if(type==='gen3') body=`<line x1="12" y1="1" x2="12" y2="7" ${common}/><line x1="24" y1="1" x2="24" y2="7" ${common}/><line x1="36" y1="1" x2="36" y2="7" ${common}/><circle cx="24" cy="16" r="10" ${common}/>${txt('G3~')}<line x1="12" y1="25" x2="12" y2="30" ${common}/><line x1="24" y1="25" x2="24" y2="30" ${common}/><line x1="36" y1="25" x2="36" y2="30" ${common}/>`;
 else if(['tr1','tr3'].includes(type)) body=`<circle cx="18" cy="16" r="7" ${common}/><circle cx="30" cy="16" r="7" ${common}/><line x1="24" y1="8" x2="24" y2="24" ${common}/>`;
 else if(type==='psu') body=`<rect x="12" y="7" width="24" height="18" ${common}/><line x1="16" y1="16" x2="32" y2="16" ${common}/><line x1="24" y1="11" x2="24" y2="21" ${common}/>`;
 else if(['disconnect','isolator','acb','mccb','mcb','mpcb','elcb','rcbo','1pmcb','2pmcb','3pmcb','4pmcb','1pmccb','3pmccb','4pmccb','mcbaux','mccbsht','mccbuv','1pnmcb','dcmcb'].includes(type)) body=`<line x1="24" y1="2" x2="24" y2="9" ${common}/><line x1="24" y1="23" x2="24" y2="30" ${common}/><line x1="17" y1="9" x2="30" y2="23" ${common}/>`;
 else if(type==='fuse') body=`<line x1="24" y1="1" x2="24" y2="8" ${common}/><rect x="16" y="8" width="16" height="14" ${common}/><line x1="18" y1="19" x2="30" y2="11" ${common}/><line x1="24" y1="22" x2="24" y2="31" ${common}/>`;
 else if(['hrc','fuseswitch','spd','thermal','magtrip'].includes(type)) body=`<line x1="24" y1="2" x2="24" y2="8" ${common}/><rect x="15" y="8" width="18" height="15" ${common}/><line x1="24" y1="23" x2="24" y2="30" ${common}/>`;
 else if(['3pcont','4pcont','contaux','reverse','contimer','stardelta','latchcont'].includes(type)) body=`<rect x="12" y="8" width="24" height="15" ${common}/>${txt('KM')}<line x1="24" y1="2" x2="24" y2="8" ${common}/><line x1="24" y1="23" x2="24" y2="30" ${common}/>`;
 else if(['coil','relaycoil','powerrelay','interpose','latchrelay','ssr','reed','safetyrelay'].includes(type)) body=`<rect x="14" y="8" width="20" height="15" ${common}/>${txt(type==='coil'?'KM':'K')}<line x1="24" y1="2" x2="24" y2="8" ${common}/><line x1="24" y1="23" x2="24" y2="30" ${common}/>`;
 else if(contact.includes(type)) body=`<line x1="5" y1="16" x2="17" y2="16" ${common}/><line x1="31" y1="16" x2="43" y2="16" ${common}/><line x1="17" y1="16" x2="30" y2="8" ${common}/>${nc.includes(type)?`<line x1="15" y1="7" x2="31" y2="23" ${common}/>`:''}`;
 else if(['ton','tof','multitimer','timernc','timerno','stimer','flasher','cyclic','stair','analogtimer','digitaltimer','programmable','counter'].includes(type)) body=`<rect x="11" y="7" width="26" height="19" ${common}/>${txt(type==='ton'?'TON':type==='tof'?'TOF':'KT')}`;
 else if(['motor3','motor1','motorDC','twospeed','motorsd','brake','gear'].includes(type)) body=`<line x1="24" y1="2" x2="24" y2="5" ${common}/><circle cx="24" cy="16" r="11" ${common}/>${txt(type==='motor3'?'M3~':type==='motor1'?'M1~':'M')}`;
 else if(['lamp','led','tower','pilot','buzzer','siren'].includes(type)) body=`<circle cx="24" cy="16" r="10" ${common}/><line x1="18" y1="10" x2="30" y2="22" ${common}/><line x1="30" y1="10" x2="18" y2="22" ${common}/>`;
 else if(['ammeter','voltmeter','freq','kw','kwh','hour','multimeter'].includes(type)) body=`<circle cx="24" cy="16" r="11" ${common}/>${txt(type==='ammeter'?'A':type==='voltmeter'?'V':type==='freq'?'Hz':type==='kw'?'kW':type==='kwh'?'kWh':type==='hour'?'h':'M')}`;
 else if(['plc','di','do','ai','ao','relayout','rs485','ethernet','profinet','terminalmodule','iomodule','plcpower','expansion'].includes(type)) body=`<rect x="8" y="6" width="32" height="20" ${common}/>${txt(type==='plc'?'PLC':type.toUpperCase())}`;
 else if(['prox','capsensor','photo','ultra','limitsensor','pt100','presssensor','flow','level','speed','encoder','current','voltage'].includes(type)) body=`<rect x="12" y="7" width="24" height="18" ${common}/>${txt(type==='pt100'?'PT100':type==='encoder'?'ENC':type==='current'?'I':type==='voltage'?'U':'S')}`;
 else if(['terminal','terminalblock','cross','junction','crossconn','crossnc','entry','cable','shield','ferrule','plug','test','connector'].includes(type)) body=`<line x1="4" y1="16" x2="44" y2="16" ${common}/><circle cx="24" cy="16" r="4" ${common}/>`;
 else body=`<rect x="12" y="7" width="24" height="18" ${common}/>${txt('IEC')}`;
 return `<svg class="lib-icon" viewBox="0 0 48 32" aria-hidden="true">${body}</svg>`;
}

function refPrefix(type){
 const m={pe:'PE',gnd:'PE',n:'N',l1:'L1',l2:'L2',l3:'L3','dc-':'-', 'dc+':'+', '3p':'X',gen3:'G',tr1:'T',tr3:'T',psu:'V',
 disconnect:'Q',isolator:'QS',acb:'Q',mccb:'Q',mcb:'Q',fuse:'F',hrc:'F',fuseswitch:'QF',spd:'F',thermal:'F',magtrip:'Q',mpcb:'Q',elcb:'Q',
 '1pmcb':'Q','2pmcb':'Q','3pmcb':'Q','4pmcb':'Q','1pmccb':'Q','3pmccb':'Q','4pmccb':'Q',mcbaux:'Q',mccbsht:'Q',mccbuv:'Q',rcbo:'Q','1pnmcb':'Q',dcmcb:'Q',
 '3pcont':'KM','4pcont':'KM',coil:'KM',mainno:'KM',mainnc:'KM',auxno:'KM',auxnc:'KM',mechlink:'KM',contaux:'KM',reverse:'KM',contimer:'KM',stardelta:'KM',latchcont:'KM',
 relaycoil:'K',relayno:'K',relaync:'K',changeover:'K',powerrelay:'K',interpose:'K',latchrelay:'K',ssr:'K',reed:'K',overload:'F',thermalrelay:'F',auxrelay:'K',safetyrelay:'K',
 no:'K',nc:'K',change:'K',twinnc:'K',twinno:'K',linked:'K',tdno:'KT',tdnc:'KT',offno:'KT',offnc:'KT',auxblock:'K',auxfront:'K',auxside:'K',
 start:'S',stop:'S',estop:'S',sel2:'S',sel3:'S',key:'S',toggle:'S',limitno:'S',limitnc:'S',foot:'S',pressure:'S',temperature:'S',float:'S',hand:'S',
 ton:'KT',tof:'KT',multitimer:'KT',timernc:'KT',timerno:'KT',stimer:'KT',flasher:'KT',cyclic:'KT',stair:'KT',analogtimer:'KT',digitaltimer:'KT',programmable:'KT',counter:'KT',
 motor3:'M',motor1:'M',motorDC:'M',twospeed:'M',motorsd:'M',brake:'M',gear:'M',heater:'E',resistive:'R',inductive:'L',capacitive:'C',solenoid:'Y',buzzer:'H',
 lamp:'H',led:'H',siren:'H',tower:'H',pilot:'H',ammeter:'P',voltmeter:'P',freq:'P',kw:'P',kwh:'P',hour:'P',multimeter:'P',
 plc:'A',di:'A',do:'A',ai:'A',ao:'A',relayout:'K',rs485:'A',ethernet:'A',profinet:'A',terminalmodule:'X',iomodule:'A',plcpower:'G',expansion:'A',
 prox:'B',capsensor:'B',photo:'B',ultra:'B',limitsensor:'B',pt100:'B',presssensor:'B',flow:'B',level:'B',speed:'B',encoder:'B',current:'B',voltage:'B',
 terminal:'X',terminalblock:'X',cross:'X',junction:'X',crossconn:'X',crossnc:'X',entry:'X',cable:'W',shield:'W',ferrule:'X',plug:'X',test:'X',connector:'X'};
 return m[type]||'X';
}

const lib=document.getElementById('libraryGroups');

function openComponentDetails(g){
 if(!g)return;
 const dlg=document.getElementById('componentDialog');
 document.getElementById('detailName').value=g.dataset.name||'';
 document.getElementById('detailRef').value=g.dataset.ref||'';
 document.getElementById('detailValue').value=g.dataset.value||'';
 const defs=portsFor(g);
 let terms=[];try{terms=JSON.parse(g.dataset.terminals||'null')||defs.map(p=>p.label)}catch{terms=defs.map(p=>p.label)}
 document.getElementById('detailTerminals').value=terms.join(', ');
 dlg.dataset.uid=g.dataset.uid;dlg.classList.add('open');dlg.setAttribute('aria-hidden','false');
}
function closeComponentDetails(){const dlg=document.getElementById('componentDialog');dlg.classList.remove('open');dlg.setAttribute('aria-hidden','true');}
document.getElementById('closeComponentDialog')?.addEventListener('click',closeComponentDetails);
document.getElementById('cancelComponentDialog')?.addEventListener('click',closeComponentDetails);
document.getElementById('componentDialog')?.addEventListener('click',e=>{if(e.target.id==='componentDialog')closeComponentDetails()});
document.getElementById('applyComponentDialog')?.addEventListener('click',()=>{
 const dlg=document.getElementById('componentDialog'), uid=dlg.dataset.uid;
 const g=[...document.querySelectorAll('#dropLayer .dropped-symbol')].find(n=>n.dataset.uid===uid); if(!g){closeComponentDetails();return;}
 const oldTitle=g.querySelector('title');
 g.dataset.name=document.getElementById('detailName').value.trim()||g.dataset.name;
 g.dataset.ref=document.getElementById('detailRef').value.trim().toUpperCase()||g.dataset.ref; const tag=g.querySelector('.drop-tag'); if(tag)tag.textContent=g.dataset.ref;
 g.dataset.value=document.getElementById('detailValue').value.trim();
 const terminals=document.getElementById('detailTerminals').value.split(',').map(s=>s.trim()).filter(Boolean);
 g.dataset.terminals=JSON.stringify(terminals);
 g.querySelectorAll('.mag-port').forEach((port,i)=>{if(terminals[i])port.dataset.port=terminals[i]});
 if(oldTitle)oldTitle.textContent=g.dataset.ref+' — '+g.dataset.name+(g.dataset.value?' • '+g.dataset.value:'');
 state.textContent='UPDATED • '+g.dataset.ref;
 closeComponentDetails();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeComponentDetails()});

function renderLibrary(){
 lib.innerHTML=groups.map((g,gi)=>`<section class="cat ${gi===0?'open':''}" data-group="${g.name}"><button class="cat-head" style="--accent:${g.color}"><span class="folder">▰</span><b>${g.name}</b><small>0 symbols</small><i>${gi===0?'⌃':'⌄'}</i></button><div class="cat-body"><div class="empty-library">No components yet.<br><small>Symbols will be added later.</small></div></div></section>`).join('');
 document.querySelectorAll('.cat-head').forEach(head=>head.addEventListener('click',()=>{const cat=head.parentElement;cat.classList.toggle('open');head.querySelector('i').textContent=cat.classList.contains('open')?'⌃':'⌄'}));
}

const svg=document.getElementById('schematic'), dropLayer=document.getElementById('dropLayer'), overlay=document.getElementById('dropOverlay');
let running=false, selected=null, counter=1;
function render(){document.body.classList.toggle('live',running);sim.textContent=running?'● RUNNING':'● STOPPED';sim.classList.toggle('running',running);motorState.textContent=running?'Motor: RUNNING':'Motor: OFF';state.textContent=running?'SIMULATION • LIVE':'READY • 2D SCHEMATIC';}
document.getElementById('play').onclick=()=>{
 const wires=[...document.querySelectorAll('#wireLayer .connected-wire')];
 const comps=[...document.querySelectorAll('#dropLayer .dropped-symbol')];
 const sourceRx=/(power|supply|phase|neutral|source|transformer|dc\+|dc-)/i;
 const lampRx=/(pilot.?light|lamp|bulb|indicator|light.?source)/i;
 const sources=comps.filter(g=>sourceRx.test((g.dataset.name||'')+' '+(g.dataset.type||'')));
 const lamps=comps.filter(g=>lampRx.test((g.dataset.name||'')+' '+(g.dataset.type||'')));
 const ids=new Set(wires.flatMap(w=>[w.dataset.fromG,w.dataset.toG]).filter(Boolean));
 const adj=new Map([...ids].map(id=>[id,[]]));
 wires.forEach((w,i)=>{const a=w.dataset.fromG,b=w.dataset.toG;if(a&&b&&adj.has(a)&&adj.has(b)){adj.get(a).push({id:b,edge:i});adj.get(b).push({id:a,edge:i});}});
 function reaches(start,target){const seen=new Set(),stack=[start];while(stack.length){const n=stack.pop();if(n===target)return true;if(seen.has(n))continue;seen.add(n);(adj.get(n)||[]).forEach(e=>{if(!seen.has(e.id))stack.push(e.id)});}return false;}
 function hasCycle(start){const seen=new Set();function walk(n,parentEdge){seen.add(n);for(const e of adj.get(n)||[]){if(!seen.has(e.id)){if(walk(e.id,e.edge))return true;}else if(e.edge!==parentEdge)return true;}return false;}return walk(start,-1);}
 const closed=sources.some(src=>lamps.some(lamp=>src.dataset.uid&&lamp.dataset.uid&&reaches(src.dataset.uid,lamp.dataset.uid)&&hasCycle(src.dataset.uid)));
 if(!closed){running=false;document.body.classList.remove('live');sim.textContent='● OPEN CIRCUIT';sim.classList.remove('running');motorState.textContent='Motor: OFF';state.textContent='OPEN CIRCUIT • CHECK SOURCE, LOAD AND RETURN WIRE';return;}
 running=true;document.querySelectorAll('#dropLayer .dropped-symbol').forEach(g=>{if(lampRx.test((g.dataset.name||'')+' '+(g.dataset.type||'')))g.classList.add('device-on')});document.querySelectorAll('#wireLayer .connected-wire').forEach(w=>{w.classList.add('wire-live');const ends=((w.dataset.from||'')+' '+(w.dataset.to||'')).toUpperCase();w.classList.toggle('wire-neutral',/\bN\b|NEUTRAL/.test(ends));});render();
};
document.getElementById('stop').onclick=()=>{running=false;document.querySelectorAll('#dropLayer .device-on').forEach(g=>g.classList.remove('device-on'));document.querySelectorAll('#wireLayer .connected-wire').forEach(w=>w.classList.remove('wire-live'));render()};
document.getElementById('threeD').onclick=()=>alert('The 2D physical component view is the next workspace to build. Your existing SCHEMATIC workspace is unchanged.');
document.getElementById('delete').onclick=()=>{if(selected){selected.remove();selected=null;state.textContent='DELETED';}else state.textContent='CLICK A COMPONENT THEN PRESS DELETE';};

document.addEventListener('keydown',e=>{if(e.key==='Escape'){select(null);state.textContent='SELECTION CLEARED';return;}if(e.key==='Delete'&&selected){e.preventDefault();selected.remove();selected=null;state.textContent='DELETED';}});

document.getElementById('search').addEventListener('input',e=>{const q=e.target.value.toLowerCase().trim();document.querySelectorAll('#libraryGroups .component-category').forEach(btn=>{btn.style.display=btn.dataset.category.toLowerCase().includes(q)?'flex':'none';});const head=document.querySelector('#libraryGroups .component-results-head b');if(head)head.textContent=q?'FILTERED CATEGORIES':((document.querySelector('#libraryGroups .component-category.active')?.dataset.category||'ALL COMPONENTS').toUpperCase());});

function getPoint(e){try{const pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;const m=svg.getScreenCTM();if(m){const p=pt.matrixTransform(m.inverse());return{x:p.x,y:p.y};}}catch(_){}const r=svg.getBoundingClientRect(),vb=svg.viewBox.baseVal;return{x:vb.x+(e.clientX-r.left)*(vb.width/r.width),y:vb.y+(e.clientY-r.top)*(vb.height/r.height)};}
function nextReference(d){
 const s=((d&& (d.name||d.type))||'component').toLowerCase();
 let p='X';
 if(/contactor/.test(s))p='KM';
 else if(/overload|thermal/.test(s))p='F';
 else if(/breaker|mcb|fuse|isolator|protection/.test(s))p='Q';
 else if(/motor/.test(s))p='M';
 else if(/timer|delay/.test(s))p='KT';
 else if(/coil|relay/.test(s))p='K';
 else if(/push|button|emergency|selector|switch|limit/.test(s))p='S';
 else if(/pilot|lamp|led|indicator/.test(s))p='H';
 else if(/earth|ground/.test(s))p='PE';
 else if(/terminal|connector|block/.test(s))p='X';
 else if(/transformer/.test(s))p='T';
 else if(/sensor/.test(s))p='B';
 const n=[...dropLayer.querySelectorAll('.dropped-symbol')].filter(g=>(g.dataset.ref||'').startsWith(p)).length+1;
 return p+n;
}
function makeDropped(d,x,y){
 const NS='http://www.w3.org/2000/svg'; const g=document.createElementNS(NS,'g'); g.setAttribute('class','dropped-symbol'); g.dataset.uid='esc-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7); g.dataset.type=d.type; g.dataset.porttype=d.symbolFile||d.type; g.dataset.name=d.name; g.dataset.ref=d.ref||nextReference(d); g.dataset.accent=d.accent||'#0879df'; g.style.setProperty('--component-accent',g.dataset.accent); g.dataset.x=x;g.dataset.y=y;g.setAttribute('transform',`translate(${x-36},${y-22})`);
 const box=document.createElementNS(NS,'rect'); box.setAttribute('class','select-box');box.setAttribute('x',0);box.setAttribute('y',0);box.setAttribute('width',72);box.setAttribute('height',44);box.setAttribute('rx',4);
 const ns=document.createElementNS(NS,'svg');ns.setAttribute('x',12);ns.setAttribute('y',4);ns.setAttribute('width',48);ns.setAttribute('height',32);ns.setAttribute('viewBox','0 0 48 32');ns.innerHTML=icon(d.type).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
 const label=document.createElementNS(NS,'text');label.setAttribute('class','drop-label');label.setAttribute('x',36);label.setAttribute('y',42);label.setAttribute('text-anchor','middle');label.textContent=d.name.length>20?d.name.slice(0,19)+'…':d.name;
 const title=document.createElementNS(NS,'title');title.textContent=(g.dataset.ref||'')+' — '+d.name+(g.dataset.value?' • '+g.dataset.value:'');g.appendChild(title);
 const tag=document.createElementNS(NS,'text');tag.setAttribute('class','drop-tag');tag.setAttribute('x',8);tag.setAttribute('y',23);tag.setAttribute('text-anchor','end');tag.setAttribute('fill',g.dataset.accent);tag.style.fill=g.dataset.accent;tag.style.fontWeight='400';tag.textContent=g.dataset.ref;
 g.append(box,ns,tag);dropLayer.appendChild(g);select(g);enableMove(g);
  g.addEventListener('dblclick',e=>{e.preventDefault();e.stopPropagation();select(g,true);});
  return g;
}
function select(g,openProperties=false){
 if(selected)selected.classList.remove('selected');
 selected=g;
 if(g)g.classList.add('selected');
 const panel=document.getElementById('propertyPanel');
 if(!panel)return;
 const shouldOpen=!!(g&&openProperties);
 panel.classList.toggle('open',shouldOpen);
 panel.setAttribute('aria-hidden',String(!shouldOpen));
 if(!shouldOpen)return;
 const put=(id,v)=>{const el=document.getElementById(id);if(el)el.value=v??''};
 const title=document.getElementById('propertyTitle');if(title)title.textContent=g.dataset.name||'Component';
 put('propType',g.dataset.name||'IEC component');put('propTag',g.dataset.ref||'');put('propLabel',g.dataset.label||g.dataset.name||'');put('propComment',g.dataset.comment||'');
 const note=g.querySelector('.drop-comment');if(note){note.textContent=g.dataset.comment||'';note.style.display=g.dataset.comment?'':'none';}
}
function enableMove(g){
 // Movement is handled once by installReliableIndividualDrag() below.
 // Do not attach a second per-component pointer controller; competing
 // pointer-capture handlers prevented reliable dragging in the workspace.
 g.style.pointerEvents = 'all';
 g.style.cursor = 'default';
}

svg.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='copy';overlay.classList.add('show');});
svg.addEventListener('dragleave',()=>overlay.classList.remove('show'));
svg.addEventListener('drop',e=>{e.preventDefault();overlay.classList.remove('show');let raw=e.dataTransfer.getData('application/json')||e.dataTransfer.getData('text/plain');if(!raw)return;let d;try{d=JSON.parse(raw)}catch{return;}const p=getPoint(e);makeDropped(d,Math.round(p.x),Math.round(p.y));state.textContent='PLACED • '+d.name.toUpperCase();});
svg.addEventListener('pointerdown',e=>{if(e.target===svg)select(null)});
render();

/* V7: clear IEC symbols with visible tails + magnetic square connection points */
const _oldIconV7 = icon;
function portDefs(type){
  const v=(x,y,label,side)=>({x,y,label,side});
  // SVG-asset terminal rails: place ports at the ends of vertical tails, not on the sides.
  const asset=String(type||'').split('/').pop().toLowerCase();
  if(asset.endsWith('.svg')){
    const poles=/(?:3p|3-pole|three-phase|three-pole)/.test(asset)?3:
                /(?:2p|2-pole|two-pole)/.test(asset)?2:
                /(?:1p|1-pole|single-pole)/.test(asset)?1:0;
    if(poles){
      const xs=poles===3?[8,24,40]:poles===2?[16,32]:[24];
      const top=poles===3?['1','3','5']:poles===2?['1','3']:['1'];
      const bottom=poles===3?['2','4','6']:poles===2?['2','4']:['2'];
      return [...xs.map((x,i)=>v(x,1,top[i],'top')),...xs.map((x,i)=>v(x,31,bottom[i],'bottom'))];
    }
    if(/(?:push-button|manual-button|emergency-stop|limit-switch|normally-open-contact|normally-close-contact|normally-closed-contact|changeover-contact)/.test(asset))
      return [v(8,1,'1','top'),v(40,31,'2','bottom')];
    if(/(?:coil|timer|relay)/.test(asset))
      return [v(24,1,'A1','top'),v(24,31,'A2','bottom')];
  }
  if(type==='3p') return [v(8,2,'L1','top'),v(24,2,'L2','top'),v(40,2,'L3','top'),v(8,30,'L1','bottom'),v(24,30,'L2','bottom'),v(40,30,'L3','bottom')];
  if(['l1','l2','l3','n','dc-','dc+','pe','gnd'].includes(type)) return [v(24,2,type==='dc-'?'−':type==='dc+'?'+':type.toUpperCase(),'top'),v(24,30,type==='dc-'?'−':type==='dc+'?'+':type.toUpperCase(),'bottom')];
  if(type==='psu') return [v(7,7,'L','top'),v(17,7,'N','top'),v(31,7,'HV','top'),v(41,7,'PE','top'),v(7,25,'+','bottom'),v(17,25,'+','bottom'),v(31,25,'−','bottom'),v(41,25,'−','bottom')];
  if(['tr1','tr3','gen3'].includes(type)) return [v(12,2,'1','top'),v(36,2,'2','top'),v(12,30,'1','bottom'),v(36,30,'2','bottom')];
  if(['no','nc','change','changeover','auxno','auxnc','mainno','mainnc','relayno','relaync','start','stop','estop','limitno','limitnc','foot','pressure','temperature','float','hand','tdno','tdnc','offno','offnc','timernc','timerno'].includes(type)) return [v(5,16,'1','left'),v(43,16,'2','right')];
  if(['coil','relaycoil','powerrelay','interpose','latchrelay','ssr','reed','safetyrelay','ton','tof','multitimer','stimer','flasher','cyclic','stair','analogtimer','digitaltimer','programmable','counter','3pcont','4pcont','contaux','reverse','contimer','stardelta','latchcont'].includes(type)) return [v(24,2,'A1','top'),v(24,30,'A2','bottom')];
  if(['motor3','motor1','motorDC','twospeed','motorsd','brake','gear'].includes(type)) return [v(14,2,'U','top'),v(24,2,'V','top'),v(34,2,'W','top'),v(24,30,'PE','bottom')];
  if(['lamp','led','tower','pilot','buzzer','siren','heater','resistive','inductive','capacitive','solenoid'].includes(type)) return [v(24,2,'X1','top'),v(24,30,'X2','bottom')];
  if(['ammeter','voltmeter','freq','kw','kwh','hour','multimeter'].includes(type)) return [v(24,2,'1','top'),v(24,30,'2','bottom')];
  return [v(24,2,'1','top'),v(24,30,'2','bottom')];
}
function portsFor(g){
 const defs=portDefs(g.dataset.porttype||g.dataset.type);
 let labels=[];try{labels=JSON.parse(g.dataset.terminals||'null')||[]}catch{}
 return defs.map((p,i)=>({...p,label:labels[i]||p.label}));
}
function withPreviewPorts(type){
  const base=icon(type).replace('</svg>','');
  return base+'</svg>';
}
function nextReference(d){
 const s=((d&& (d.name||d.type))||'component').toLowerCase();
 let p='X';
 if(/contactor/.test(s))p='KM';
 else if(/overload|thermal/.test(s))p='F';
 else if(/breaker|mcb|fuse|isolator|protection/.test(s))p='Q';
 else if(/motor/.test(s))p='M';
 else if(/timer|delay/.test(s))p='KT';
 else if(/coil|relay/.test(s))p='K';
 else if(/push|button|emergency|selector|switch|limit/.test(s))p='S';
 else if(/pilot|lamp|led|indicator/.test(s))p='H';
 else if(/earth|ground/.test(s))p='PE';
 else if(/terminal|connector|block/.test(s))p='X';
 else if(/transformer/.test(s))p='T';
 else if(/sensor/.test(s))p='B';
 const n=[...dropLayer.querySelectorAll('.dropped-symbol')].filter(g=>(g.dataset.ref||'').startsWith(p)).length+1;
 return p+n;
}
function makeDropped(d,x,y){
  const NS='http://www.w3.org/2000/svg', W=180, H=140;
  const g=document.createElementNS(NS,'g');
  g.setAttribute('class','dropped-symbol');
  g.dataset.uid='C'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,7);
  g.dataset.type=d.type; g.dataset.porttype=d.symbolFile||d.type; g.dataset.name=d.name;
  g.dataset.ref=d.ref||nextReference(d); g.dataset.value=d.value||'';
  g.dataset.accent=d.accent||'#e9f1ed'; g.dataset.x=x; g.dataset.y=y;
  g.setAttribute('transform',`translate(${x-W/2},${y-H/2})`);

  // Component artwork is scaled to 150 x 100 world units: one major grid square tall.
  // Port anchors use the exact same transform so wires continue to snap to terminals.
  const ART_X=15, ART_Y=20, ART_W=150, ART_H=100;
  const box=document.createElementNS(NS,'rect');
  box.setAttribute('class','select-box'); box.setAttribute('x',48); box.setAttribute('y',15);
  box.setAttribute('width',84); box.setAttribute('height',110); box.setAttribute('rx',2);
  const ns=document.createElementNS(NS,'svg');
  ns.setAttribute('x',ART_X); ns.setAttribute('y',ART_Y);
  ns.setAttribute('width',ART_W); ns.setAttribute('height',ART_H);
  ns.setAttribute('viewBox','0 0 48 32'); ns.setAttribute('preserveAspectRatio','xMidYMid meet');
  ns.style.color=g.dataset.accent; ns.style.pointerEvents='none';
  if(d.symbolFile && /\.svg(?:$|\?)/i.test(d.symbolFile)){
    const im=document.createElementNS(NS,'image');
    im.setAttribute('href',d.symbolFile); im.setAttribute('x',0); im.setAttribute('y',0);
    im.setAttribute('width',48); im.setAttribute('height',32);
    im.setAttribute('preserveAspectRatio','xMidYMid meet'); ns.appendChild(im);
  } else {
    ns.innerHTML=icon(d.type).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
  }
  const ports=document.createElementNS(NS,'g'); ports.setAttribute('class','component-ports');
  portDefs(d.symbolFile||d.type).forEach(p=>{
    const px=ART_X+(p.x/48)*ART_W, py=ART_Y+(p.y/32)*ART_H;
    const r=document.createElementNS(NS,'circle'); r.setAttribute('class','mag-port');
    r.setAttribute('cx',px); r.setAttribute('cy',py); r.setAttribute('r',3);
    r.dataset.port=p.label; r.setAttribute('data-owner','component'); ports.appendChild(r);
    const t=document.createElementNS(NS,'text'); t.setAttribute('class','port-name');
    t.setAttribute('x',px); t.setAttribute('y',p.side==='top'?py-9:py+15);
    t.setAttribute('text-anchor','middle'); t.textContent=''; t.setAttribute('aria-label',p.label); ports.appendChild(t);
  });
  const label=document.createElementNS(NS,'text'); label.setAttribute('class','drop-label');
  label.setAttribute('x',W/2); label.setAttribute('y',H-5); label.setAttribute('text-anchor','middle');
  label.textContent='';
  const tag=document.createElementNS(NS,'text'); tag.setAttribute('class','drop-tag');
  tag.setAttribute('x',W/2); tag.setAttribute('y',13); tag.setAttribute('text-anchor','middle');
  tag.textContent=g.dataset.ref;
  const title=document.createElementNS(NS,'title');
  title.textContent=(g.dataset.ref||'')+' — '+d.name+(g.dataset.value?' • '+g.dataset.value:'');
  const comment=document.createElementNS(NS,'text'); comment.setAttribute('class','drop-comment');
  comment.setAttribute('x','36'); comment.setAttribute('y','70'); comment.setAttribute('text-anchor','middle');
  comment.setAttribute('transform','rotate(-90 36 70)'); comment.textContent=g.dataset.comment||'';
  comment.style.display=g.dataset.comment?'':'none';
  const hit=document.createElementNS(NS,'rect'); hit.setAttribute('class','component-hit-area');
  hit.setAttribute('x',0); hit.setAttribute('y',0); hit.setAttribute('width',W); hit.setAttribute('height',H);
  hit.setAttribute('fill','transparent'); hit.setAttribute('pointer-events','all');
  g.append(title,box,hit,ns,ports,label,tag,comment); dropLayer.appendChild(g); select(g); enableMove(g);
  return g;
}
function applyComponentTransform(g,x=Number(g.dataset.x||0),y=Number(g.dataset.y||0)){
 const angle=((Number(g.dataset.rotation)||0)%360+360)%360;
 g.setAttribute('transform',`translate(${x-90},${y-70}) rotate(${angle} 90 70)`);
}
function absolutePorts(g,x=+g.dataset.x,y=+g.dataset.y){
 const ART_X=15,ART_Y=20,ART_W=150,ART_H=100;
 const angle=(Number(g.dataset.rotation)||0)*Math.PI/180,cos=Math.cos(angle),sin=Math.sin(angle);
 return portsFor(g).map(p=>{
   const lx=ART_X+(p.x/48)*ART_W,ly=ART_Y+(p.y/32)*ART_H,dx=lx-90,dy=ly-70;
   return {x:x+dx*cos-dy*sin,y:y+dx*sin+dy*cos,label:p.label};
 });
}
function findSnap(g,x,y){let best=null,dist=999;const mine=absolutePorts(g,x,y);document.querySelectorAll('.dropped-symbol').forEach(o=>{if(o===g)return;absolutePorts(o).forEach(op=>mine.forEach(mp=>{const d=Math.hypot(op.x-mp.x,op.y-mp.y);if(d<18&&d<dist){dist=d;best={x:x+(op.x-mp.x),y:y+(op.y-mp.y)};}}));});return best;}
let activeDrag = null;
let suppressNextComponentClick = false;
function enableMove(g){
  // Each placed component is its own SVG group. Only the group that received
  // pointerdown is allowed to change position during this drag operation.
  g.style.pointerEvents = 'all';
  g.style.cursor = 'default';
  g.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    if (e.target && e.target.classList && e.target.classList.contains('mag-port')) return;
    if (e.target && e.target.closest && e.target.closest('.connected-wire')) return;
    e.preventDefault();
    e.stopPropagation();
    select(g);
    const p = getPoint(e);
    activeDrag = {
      component: g,
      pointerId: e.pointerId,
      dx: p.x - Number(g.dataset.x || 0),
      dy: p.y - Number(g.dataset.y || 0),
      startX: p.x,
      startY: p.y,
      moved: false
    };
    g.classList.add('moving');
    g.style.cursor = 'default';
    try { svg.setPointerCapture(e.pointerId); } catch (_) {}
  });
  g.addEventListener('click', e => {
    if (e.target && e.target.classList && e.target.classList.contains('mag-port')) return;
    e.stopPropagation();
    if (suppressNextComponentClick) {
      suppressNextComponentClick = false;
      return;
    }
    select(g);
    state.textContent = 'SELECTED • ' + (g.dataset.ref || g.dataset.name || 'COMPONENT');
  });
}
// A single shared drag handler prevents competing components from moving together.
svg.addEventListener('pointermove', e => {
  if (!activeDrag || e.pointerId !== activeDrag.pointerId) return;
  const g = activeDrag.component;
  if (!g || !g.isConnected) { activeDrag = null; return; }
  const p = getPoint(e);
  const x = p.x - activeDrag.dx;
  const y = p.y - activeDrag.dy;
  if (Math.hypot(p.x - activeDrag.startX, p.y - activeDrag.startY) > 3) activeDrag.moved = true;
  // IMPORTANT: update only this exact component group, never the shared layer.
  g.dataset.x = x;
  g.dataset.y = y;
  applyComponentTransform(g,x,y);
});
function finishComponentDrag(e) {
  if (!activeDrag || (e.pointerId != null && e.pointerId !== activeDrag.pointerId)) return;
  const g = activeDrag.component;
  const wasMoved = activeDrag.moved;
  if (g) {
    g.classList.remove('moving');
    g.style.cursor = 'default';
    select(g);
  }
  activeDrag = null;
  if (wasMoved) {
    suppressNextComponentClick = true;
    state.textContent = 'MOVED • ' + (g?.dataset.ref || g?.dataset.name || 'COMPONENT');
    // Clear the click suppression if the browser doesn't synthesize a click.
    setTimeout(() => { suppressNextComponentClick = false; }, 250);
  }
  try { if (e.pointerId != null) svg.releasePointerCapture(e.pointerId); } catch (_) {}
}
svg.addEventListener('pointerup', finishComponentDrag);
svg.addEventListener('pointercancel', finishComponentDrag);

// Final UI properties inspector: show only while a workspace component is selected.
(function initPropertyPanel(){
 const $=id=>document.getElementById(id);const panel=$('propertyPanel');if(!panel)return;
 $('propertyClose')?.addEventListener('click',()=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true');});
 $('propertyDelete')?.addEventListener('click',()=>{if(selected){selected.remove();select(null);state.textContent='COMPONENT DELETED';}});
 const setData=(id,key)=>$(id)?.addEventListener('change',e=>{if(!selected)return;selected.dataset[key]=e.target.value;if(key==='ref')selected.dataset.label=e.target.value;if(key==='x'||key==='y'){const x=+(selected.dataset.x||0),y=+(selected.dataset.y||0);selected.setAttribute('transform',`translate(${x-36},${y-22})`);}if(key==='ref'||key==='label'){const tag=selected.querySelector('.drop-tag');if(tag)tag.textContent=e.target.value;}});
 setData('propTag','ref');setData('propLabel','label');
 $('propShowTag')?.addEventListener('change',e=>{if(selected){const t=selected.querySelector('.drop-tag');if(t)t.style.display=e.target.checked?'':'none';}});
 $('propLineColor')?.addEventListener('change',e=>{if(selected)selected.querySelectorAll('path,line,circle,rect,polyline').forEach(n=>{if(n.closest('.mag-port'))return;n.style.stroke=e.target.value;});});
 $('propTextColor')?.addEventListener('change',e=>{if(selected)selected.querySelectorAll('text').forEach(n=>n.style.fill=e.target.value);});
 $('propLineWidth')?.addEventListener('change',e=>{if(selected)selected.querySelectorAll('path,line,circle,rect,polyline').forEach(n=>n.style.strokeWidth=e.target.value);});
 $('propFontSize')?.addEventListener('change',e=>{if(selected)selected.querySelectorAll('text').forEach(n=>n.style.fontSize=e.target.value+'px');});
 document.getElementById('sheet')?.addEventListener('pointerdown',e=>{if(!e.target.closest('.dropped-symbol')&&!e.target.closest('#propertyPanel'))select(null);});
})();

renderLibrary();

/* V15: reliable component selection. Clicking a placed symbol selects it; Delete button/keyboard removes it. */
(function reliableSelection(){
  const layer=document.getElementById('dropLayer');
  if(!layer) return;
  layer.addEventListener('click',e=>{
    const g=e.target.closest && e.target.closest('.dropped-symbol');
    if(!g) return;
    if(e.target.classList && e.target.classList.contains('mag-port')) return;
    select(g);
    state.textContent='SELECTED • '+(g.dataset.ref||g.dataset.name||'COMPONENT');
  },false);
  document.getElementById('delete').title='Select a component, then click DELETE or press the Delete key';
})();

/* V10 — real terminal-to-terminal magnetic wiring.  Drag the small square terminal, not the symbol. */
(function initMagneticWiring(){
  const NS='http://www.w3.org/2000/svg';
  const svgEl=document.getElementById('schematic');
  const dropLayerEl=document.getElementById('dropLayer');
  if(!svgEl||!dropLayerEl) return;

  let wireLayer=document.getElementById('wireLayer');
  if(!wireLayer){
    wireLayer=document.createElementNS(NS,'g');
    wireLayer.setAttribute('id','wireLayer');
    svgEl.insertBefore(wireLayer,dropLayerEl);
  }
  let wiring=null;

  function portAbs(g,p){
    const x=+g.dataset.x, y=+g.dataset.y;
    return {x:x-24+p.x,y:y-20+p.y,label:p.label,g};
  }
  function allPorts(){
    const out=[];
    document.querySelectorAll('#dropLayer .dropped-symbol').forEach(g=>{
      portsFor(g).forEach(p=>out.push(portAbs(g,p)));
    });
    return out;
  }
  function pointFromEvent(e){return getPoint(e)}
  function makePath(a,b){
    const mx=Math.round((a.x+b.x)/2);
    return `${a.x},${a.y} ${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`;
  }
  function nearestTarget(pt,source){
    let best=null,bestD=18;
    for(const p of allPorts()){
      if(p.g===source.g && p.label===source.label) continue;
      const d=Math.hypot(p.x-pt.x,p.y-pt.y);
      if(d<bestD){best=p;bestD=d;}
    }
    return best;
  }
  function setPortConnected(p){
    if(!p||!p.g) return;
    const r=[...p.g.querySelectorAll('.mag-port')].find(x=>x.dataset.port===p.label);
    if(r) r.classList.add('connected');
  }

  let activePort=null;
  // Live CAD wire preview and alignment crosshairs, similar to the supplied reference video.
  const guideLayer=document.createElementNS(NS,'g');
  guideLayer.setAttribute('id','wireGuides');
  const guideX=document.createElementNS(NS,'line');
  const guideY=document.createElementNS(NS,'line');
  [guideX,guideY].forEach(l=>{l.setAttribute('class','wire-guide');guideLayer.appendChild(l);});
  svgEl.appendChild(guideLayer);
  const preview=document.createElementNS(NS,'polyline');
  preview.setAttribute('class','wire-preview');
  preview.setAttribute('points','');
  preview.style.display='none';
  wireLayer.appendChild(preview);
  function elbowPath(a,b){
    const dx=Math.abs(b.x-a.x),dy=Math.abs(b.y-a.y);
    if(dx<8||dy<8) return `${a.x},${a.y} ${b.x},${b.y}`;
    const mx=Math.round((a.x+b.x)/2);
    return `${a.x},${a.y} ${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`;
  }
  function orthogonalRoute(points){
    if(!points||points.length<2)return '';
    const out=[`${points[0].x},${points[0].y}`];
    for(let i=1;i<points.length;i++){
      const a=points[i-1],b=points[i];
      if(Math.abs(a.x-b.x)>1 && Math.abs(a.y-b.y)>1){
        // Default route: horizontal then vertical; every bend point remains user-controlled.
        out.push(`${b.x},${a.y}`);
      }
      out.push(`${b.x},${b.y}`);
    }
    return out.join(' ');
  }
  function hideWireGuides(){guideX.style.display='none';guideY.style.display='none';preview.style.display='none';}
  svgEl.addEventListener('pointermove',e=>{
    if(!activePort)return;
    const p=pointFromEvent(e);
    guideX.setAttribute('x1',0);guideX.setAttribute('y1',activePort.y);
    guideX.setAttribute('x2',svgEl.viewBox.baseVal.width);guideX.setAttribute('y2',activePort.y);
    guideY.setAttribute('x1',activePort.x);guideY.setAttribute('y1',0);
    guideY.setAttribute('x2',activePort.x);guideY.setAttribute('y2',svgEl.viewBox.baseVal.height);
    guideX.style.display='block';guideY.style.display='block';
    const route=[{x:activePort.x,y:activePort.y},...(activePort.waypoints||[]),p];
     preview.setAttribute('points',orthogonalRoute(route));preview.style.display='block';
  });
  function connectOnClick(e){
    const port=e.target.closest && e.target.closest('.mag-port');
    if(!port) return;
    const g=port.closest('.dropped-symbol'); if(!g) return;
    e.preventDefault(); e.stopPropagation();
    const pdef=portsFor(g).find(p=>p.label===port.dataset.port); if(!pdef) return;
    const current=portAbs(g,pdef);
    if(!activePort){
      activePort={...current,el:port,waypoints:[]};
      port.classList.add('port-active','selected');
      preview.setAttribute('points',`${current.x},${current.y} ${current.x},${current.y}`);
      preview.style.display='block';
      state.textContent=`WIRE START • ${current.label} • CLICK DESTINATION TERMINAL`;
      return;
    }
    if(activePort.g===g && activePort.label===current.label){
      activePort.el.classList.remove('port-active','selected'); activePort=null; hideWireGuides(); state.textContent='WIRING CANCELLED'; return;
    }
    if(activePort.g===g){state.textContent='CHOOSE A TERMINAL ON ANOTHER COMPONENT';return;}
    const line=document.createElementNS(NS,'polyline');
    line.setAttribute('class','connected-wire');
     line.setAttribute('points',orthogonalRoute([{x:activePort.x,y:activePort.y},...(activePort.waypoints||[]),{x:current.x,y:current.y}]));
    line.dataset.from=activePort.label; line.dataset.to=current.label;
    line.dataset.fromType=activePort.g.dataset.type; line.dataset.toType=g.dataset.type;
    line.dataset.fromG=activePort.g.dataset.uid||''; line.dataset.toG=g.dataset.uid||'';
    wireLayer.insertBefore(line,preview);
    activePort.el.classList.remove('port-active','selected');
    setPortConnected(activePort); setPortConnected(current);
    state.textContent=`CONNECTED • ${activePort.label} ↔ ${current.label}`; activePort=null;hideWireGuides();
  }
  dropLayerEl.addEventListener('click',connectOnClick,true);
  // Left-click on empty canvas while wiring to add a user-defined cable bend.
  svgEl.addEventListener('click',e=>{
    if(!activePort) return;
    if(e.target.closest && (e.target.closest('.mag-port') || e.target.closest('.dropped-symbol'))) return;
    const p=pointFromEvent(e);
    activePort.waypoints.push({x:Math.round(p.x),y:Math.round(p.y)});
    const pts=[{x:activePort.x,y:activePort.y},...activePort.waypoints,{x:p.x,y:p.y}];
    preview.setAttribute('points',orthogonalRoute(pts));
    preview.style.display='block';
    state.textContent=`WIRE BEND ${activePort.waypoints.length} • LEFT-CLICK TO ADD BEND • RIGHT-CLICK TO CANCEL`;
  });
  // Right-click cancels the unfinished cable without affecting completed wires.
  svgEl.addEventListener('contextmenu',e=>{
    if(!activePort) return;
    e.preventDefault();
    if(activePort.el) activePort.el.classList.remove('port-active','selected');
    activePort=null; hideWireGuides(); state.textContent='WIRING CANCELLED';
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&activePort){activePort.el.classList.remove('port-active','selected');activePort=null;hideWireGuides();state.textContent='WIRING CANCELLED';}});


  // Prevent the normal component-move handler when the user starts on a magnetic port.
  dropLayerEl.addEventListener('click',e=>{
    if(e.target.classList && e.target.classList.contains('mag-port')) e.stopPropagation();
  },true);

  // V53: retain the compact select-box attached to each component. Its transparent
  // hit area remains independent, while CSS only displays the tight outline on selection.

  const hint=document.querySelector('.hint');
  if(hint) hint.textContent='Click one terminal, then click a terminal on another component to connect. Press Escape to cancel.';
})();


/* V13: component selection/move/delete keeps magnetic wiring attached. */
(function enhancePlacedComponents(){
  const svgEl=document.getElementById('schematic');
  const layer=document.getElementById('dropLayer');
  const wires=document.getElementById('wireLayer');
  if(!svgEl||!layer) return;

  function portAbs(g,p){
    const x=+g.dataset.x,y=+g.dataset.y;
    return {x:x-24+p.x,y:y-20+p.y,label:p.label,g};
  }
  function updateWiresFor(g){
    if(!wires) return;
    const ports=portsFor(g).map(p=>portAbs(g,p));
    [...wires.querySelectorAll('.connected-wire')].forEach(line=>{
      if(line.dataset.fromG!==g.dataset.uid && line.dataset.toG!==g.dataset.uid) return;
      const fromG=[...layer.querySelectorAll('.dropped-symbol')].find(x=>x.dataset.uid===line.dataset.fromG);
      const toG=[...layer.querySelectorAll('.dropped-symbol')].find(x=>x.dataset.uid===line.dataset.toG);
      if(!fromG||!toG) return;
      const fp=portsFor(fromG).map(p=>portAbs(fromG,p)).find(p=>p.label===line.dataset.from);
      const tp=portsFor(toG).map(p=>portAbs(toG,p)).find(p=>p.label===line.dataset.to);
      if(!fp||!tp) return;
      const mx=Math.round((fp.x+tp.x)/2);
      line.setAttribute('points',`${fp.x},${fp.y} ${mx},${fp.y} ${mx},${tp.y} ${tp.x},${tp.y}`);
    });
  }
  function refreshAllWires(){[...layer.querySelectorAll('.dropped-symbol')].forEach(updateWiresFor);}

  // Give existing and future components a stable id and ensure moving does not break wires.
  let uid=1;
  function ensureId(g){ if(!g.dataset.uid) g.dataset.uid='C'+(uid++); }
  const obs=new MutationObserver(()=>layer.querySelectorAll('.dropped-symbol').forEach(ensureId));
  obs.observe(layer,{childList:true});
  layer.querySelectorAll('.dropped-symbol').forEach(ensureId);

  // Wrap the current move handler behavior by observing transforms and refreshing wires.
  const transformObserver=new MutationObserver(records=>{
    let changed=false;
    for(const r of records){ if(r.type==='attributes' && r.attributeName==='transform'){changed=true;ensureId(r.target);} }
    if(changed) refreshAllWires();
  });
  transformObserver.observe(layer,{subtree:true,attributes:true,attributeFilter:['transform']});

  // Delete selected component and its connected wires.
  function removeComponent(g){
    if(!g) return;
    if(wires){
      [...wires.querySelectorAll('.connected-wire')].forEach(line=>{
        if(line.dataset.fromG===g.dataset.uid||line.dataset.toG===g.dataset.uid) line.remove();
      });
    }
    g.remove();
    if(selected===g) selected=null;
    state.textContent='DELETED';
  }
  document.getElementById('delete').onclick=()=>{
    if(selected) removeComponent(selected);
    else state.textContent='CLICK A COMPONENT THEN PRESS DELETE';
  };
  document.addEventListener('keydown',e=>{
    if(e.key==='Delete' && selected){e.preventDefault();removeComponent(selected);}
  },true);

  // Click anywhere on a placed symbol selects it and gives a clean glow only.
  layer.addEventListener('pointerdown',e=>{
    const g=e.target.closest && e.target.closest('.dropped-symbol');
    if(g && !(e.target.classList&&e.target.classList.contains('mag-port'))) select(g);
  },true);

  // Add IDs to newly created wires after the V10 wiring code creates them.
  const wireObserver=new MutationObserver(records=>{
    for(const r of records){
      r.addedNodes.forEach(n=>{
        if(n.nodeType===1 && n.classList.contains('connected-wire')){
          // Infer endpoint component from the current labels/nearest port when IDs weren't assigned.
          if(!n.dataset.fromG||!n.dataset.toG){
            const gs=[...layer.querySelectorAll('.dropped-symbol')];
            const from=gs.find(g=>portsFor(g).some(p=>p.label===n.dataset.from));
            const to=gs.find(g=>portsFor(g).some(p=>p.label===n.dataset.to));
            if(from) ensureId(from); if(to) ensureId(to);
            if(from) n.dataset.fromG=from.dataset.uid;
            if(to) n.dataset.toG=to.dataset.uid;
          }
        }
      });
    }
    refreshAllWires();
  });
  if(wires) wireObserver.observe(wires,{childList:true});
})();

/* Re-render library after V13 symbol definitions; keeps 3-column, high-resolution previews. */
renderLibrary();


/* SVG SYMBOL LIBRARY INTEGRATION — loads the supplied original SVG files from assets/symbols. */
(function installOriginalSvgLibrary(){
 const host=document.getElementById('libraryGroups');
 const search=document.getElementById('search');
 const NS='http://www.w3.org/2000/svg';
 const categoryOrder=['POWER','Breakers & Protection','Contactors & Coils','Contacts & Relays','Control Devices & Switches','Timers','Motors & Earthing','Indicators & Signalling','PLC & I/O','Sensors & Field Devices','Terminals & Wiring','Other'];
 const typeMap={
  'supply-3phase':'3p',
  'supply-3phase-neutral-earth':'3p',
  'supply-single-phase':'gen1',
  'supply-single-phase-earth':'gen1',
  'supply-dc-positive':'dc+',
  'supply-dc-negative':'dc-',
  'supply-earth':'pe',
  'supply-ground':'gnd',
  'supply-phase-l':'l1',
  'supply-neutral-n':'n',
  'supply-transformer-1phase':'tr1',
  'supply-transformer-3phase':'tr3',
  'supply-acdc':'psu',
  'circuit-breaker-1p':'1pmcb','circuit-breaker-2p':'2pmcb','circuit-breaker-3p':'3pmcb',
  'circuit-breaker-thermal-magnetic-2p':'2pmcb','circuit-breaker-thermal-magnetic-3p':'3pmcb',
  'motor-circuit-breaker-2p':'2pmcb','motor-circuit-breaker-3p':'3pmcb',
  'ac-motor-3p-3-terminal':'motor3','ac-motor-3p-6-terminal':'motor3',
  'contactor-3p':'3pcont','contactor-3p-automatic-tripping':'3pcont',
  'coil':'coil','coil (1)':'coil','led-coil':'coil',
  'normally-open-contact':'no','normally-open-contact (1)':'no',
  'normally-close-contact':'nc','normally-closed-contact':'nc',
  'manual-button-no-spring-return':'start','manual-button-no-maintained':'start',
  'push-button-no-key-maintained(1)':'start','manual-button-nc-spring-return':'stop','manual-button-nc-maintained':'stop',
  'emergency-stop-nc-spring-return':'estop','emergency-stop-no-spring-return':'estop','emergency-stop-no-turn-reset':'estop',
  'limit-switch-no':'limitno','limit-switch-nc':'limitnc',
  'pilot-light':'pilot','pilot-light (1)':'pilot','pilot-light-blink':'pilot',
  'on-delay-timer':'ton','on-delay-timer (1)':'ton','off-delay-timer':'tof','off-delay-timer (1)':'tof',
  'on-delay-no-contact':'tdno','on-delay-no-contact (1)':'tdno','on-delay-nc-contact(1)':'tdnc',
  'off-delay-no-contact':'offno','off-delay-no-contact (1)':'offno','off-delay-no-contact (2)':'offno','off-delay-nc-contact(1)':'offnc',
  'on-off-delay-no-contact':'tdno','on-off-delay-nc-contact':'tdnc',
  'earth-ground':'pe','main-switch-1p':'1pmcb','main-switch-2p':'2pmcb','main-switch-3p':'3pmcb',
  'disconnector-isolator-2p':'disconnect','disconnector-isolator-3p':'disconnect','fuse-2p':'fuse','fuse-3p':'fuse','fuse-switch-3p':'fuseswitch',
  'fuse-disconnector-isolator-2p':'fuseswitch','fuse-disconnector-isolator-3p':'fuseswitch','fuse-disconnector-isolator-3p (1)':'fuseswitch',
  'fuse-disconnector-w-motor-circuit-breaker-2p':'mpcb','fuse-disconnector-w-motor-circuit-breaker-3p':'mpcb',
  'counter-switch-nc':'nc','counter-switch-no':'no','key-switch-nc-maintained':'nc','key-switch-nc-spring-return':'nc','key-switch-no-maintained':'no',
  'manual-switch':'toggle','counter-nc':'nc','counter-no':'no','counter-pulse':'counter',
  'changeover-contact-break-before-make':'changeover','changeover-contact-off-delay':'changeover','changeover-contact-on-delay':'changeover','changeover-contact-on-off-delay':'changeover',
  'bell':'buzzer','horn':'siren'
 };
 function slugName(s){return s.replace(/\.svg$/i,'')}
 function friendly(s){return slugName(String(s||'').split(/[\\/]/).pop()).replace(/\s*\(\d+\)/g,'').replace(/[-_]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}
 const powerTypeMap={
  'gemini-svg.svg':'3p',
  'gemini-svg (1).svg':'3p',
  'gemini-svg (2).svg':'1pn',
  'gemini-svg (3).svg':'1pnpe',
  'gemini-svg (4).svg':'dc+',
  'gemini-svg (5).svg':'dc-',
  'gemini-svg (6).svg':'pe',
  'gemini-svg (7).svg':'gnd',
  'gemini-svg (8).svg':'l1',
  'gemini-svg (9).svg':'n',
  'gemini-svg (10).svg':'tr1',
  'gemini-svg (11).svg':'tr3',
  'gemini-svg (13).svg':'psu',
  'gemini-svg (14).svg':'psu',
  'gemini-svg (15).svg':'psu',
  'gemini-svg (16).svg':'psu',
  'L1_L2_L3.svg':'3p',
  'L1_L2_L3_N.svg':'3p',
  'L1_L2_L3_N_PE.svg':'3p',
  '3_Phase_AC_DC_Converter.svg':'psu',
  'AC_DC_Power_Supply.svg':'psu',
  'DC_Negative_Power_Pole.svg':'dc-',
  'DC_Supply_Pair.svg':'dcPair',
  'DC_Positive_Pole.svg':'dc+',
  'Earth_Ground.svg':'gnd',
  'Phase_L.svg':'l1',
  'Phase_L1.svg':'l1',
  'Phase_L2.svg':'l1',
  'Phase_L3.svg':'l1',
  'L_Plus_N.svg':'gen1',
  'L_Plus_N_Plus_PE.svg':'gen1',
  'Neutral_N.svg':'n',
  'Protective_Earth_PE.svg':'pe'
 };
 const powerLabels={
  'supply-3phase.svg':'L1 + L2 + L3',
  'supply-3phase-neutral-earth.svg':'L1 + L2 + L3 + N + PE',
  'supply-single-phase.svg':'L + N',
  'supply-single-phase-earth.svg':'L + N + PE',
  'supply-dc-positive.svg':'DC Positive Pole',
  'supply-dc-negative.svg':'DC Negative Pole',
  'supply-earth.svg':'Protective Earth (PE)',
  'supply-ground.svg':'Earth Ground',
  'supply-phase-l.svg':'Phase L',
  'supply-neutral-n.svg':'Neutral N',
  'supply-transformer-1phase.svg':'Single-Phase Transformer',
  'supply-transformer-3phase.svg':'Three-Phase Transformer',
  'supply-acdc.svg':'AC/DC Power Supply'
 };
 function prefix(type){if(typeof refPrefix==='function')return refPrefix(type);return 'X'}
 function categoryFor(s){
  const n=slugName(s).toLowerCase();
  if(/motor|earth-ground/.test(n))return 'Motors & Earthing';
  if(/breaker|isolator|switch-3p|fuse|main-switch/.test(n))return 'Breakers & Protection';
  if(/contactor|coil/.test(n))return 'Contactors & Coils';
  if(/contact|counter-(nc|no|pulse)/.test(n))return 'Contacts & Relays';
  if(/button|emergency|key-switch|limit-switch|manual-switch|counter-switch/.test(n))return 'Control Devices & Switches';
  if(/timer|clock|delay/.test(n))return 'Timers';
  if(/pilot|bell|horn/.test(n))return 'Indicators & Signalling';
  return 'Other';
 }
 function attachCardEvents(){
  host.querySelectorAll('.cat-head').forEach(head=>head.addEventListener('click',()=>{const cat=head.parentElement;cat.classList.toggle('open');head.querySelector('i').textContent=cat.classList.contains('open')?'⌃':'⌄'}));
  host.querySelectorAll('.symbol-btn').forEach(b=>{
   b.addEventListener('dragstart',e=>{e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('application/json',JSON.stringify({type:b.dataset.symbol,name:b.dataset.name,ref:b.dataset.ref,accent:b.dataset.accent,symbolFile:b.dataset.file}));document.getElementById('dropOverlay').classList.add('show');state.textContent='DRAGGING • '+b.dataset.name.toUpperCase()});
   b.addEventListener('dragend',()=>document.getElementById('dropOverlay').classList.remove('show'));
   b.addEventListener('click',()=>{state.textContent='HOLD AND DRAG '+b.dataset.name.toUpperCase()+' INTO SCHEMATIC'});
  });
 }
 function renderAssets(items){
  const libraryCategories = [
   {name:'Power', color:'#00dba5'},
   {name:'Others', color:'#64748b'}, {name:'Coils', color:'#8b5cf6'},
   {name:'Auxiliaries', color:'#d4a017'}, {name:'Switches', color:'#06b6d4'},
   {name:'Loads', color:'#f59e0b'}, {name:'Contactors', color:'#10b981'},
   {name:'Protections', color:'#ef4444'}, {name:'Motors', color:'#2563eb'}
  ];
  const normalized = (items || []).map((it, i) => {
   const file = String(it.file || '').replace(/^\.\//,'');
   const name = it.name || it.original_filename || file.split('/').pop().replace(/\.svg$/i,'');
   const raw = String(it.category || '').toLowerCase() + ' ' + String(it.type || '').toLowerCase() + ' ' + name.toLowerCase();
   let category = 'Others';
   // Respect an explicit manifest category FIRST. Names like 'Auxiliary Contact 01'
   // must stay in Switches when the manifest says Switches; do not reclassify them.
   const declared = String(it.category || '').trim().toLowerCase();
   const explicitCategory = {
    'power':'Power','source':'Power','sources':'Power',
    'others':'Others','coils':'Coils','auxiliaries':'Auxiliaries',
    'switches':'Switches','loads':'Loads','contactors':'Contactors',
    'protections':'Protections','motors':'Motors'
   }[declared];
   if (explicitCategory) category = explicitCategory;
   else if (/coil|timer|tof|ton/.test(name.toLowerCase()) || /(?:^|\/)esc-(?:contactor|ton|tof).*coil\.svg$/i.test(file)) category = 'Coils';
   else if (/power|source|supply|terminal|earth|ground|battery|acdc|three.phase|dc.positive|dc.negative/.test(raw)) category = 'Power';
   else if (/auxiliar|auxiliary|aux contact/.test(raw)) category = 'Auxiliaries';
   else if (/switch|push.button|selector|isolator/.test(raw)) category = 'Switches';
   else if (/motor/.test(raw)) category = 'Motors';
   else if (/contactor/.test(raw)) category = 'Contactors';
   else if (/breaker|protection|fuse|overload|thermal/.test(raw)) category = 'Protections';
   else if (/lamp|load|bell|horn|buzzer|indicator/.test(raw)) category = 'Loads';
   return {...it, file, name, category, type:it.type || name};
  });
  let activeCategory = null;
  function paint(){
   const q = (document.getElementById('search')?.value || '').trim().toLowerCase();
   const filtered = normalized.filter(it => (activeCategory===null || it.category===activeCategory) && (!q || (it.name+' '+it.category+' '+it.type).toLowerCase().includes(q)));
   const resultMarkup = '<div class="component-results-head"><b>'+(activeCategory===null?'SELECT A CATEGORY':activeCategory.toUpperCase())+'</b><span>'+filtered.length+' symbols</span></div>' +
    (filtered.length ? '<div class="component-results">'+filtered.map(it=>`<button type="button" class="symbol-btn" draggable="true" title="Drag ${it.name} into the schematic" data-symbol="${String(it.type).replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" data-name="${String(it.name).replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" data-ref="" data-accent="#e9f1ed" data-file="${it.file.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}"><img src="${it.file}" alt="" loading="lazy" onerror="this.style.display='none'"><span>${it.name}</span></button>`).join('')+'</div>' : '<div class="component-results"><div class="library-empty">No symbols match this category or search.</div></div>');
   host.innerHTML = '<div class="component-category-list" role="list" aria-label="Component categories">' +
    libraryCategories.map(c=>{const expanded=activeCategory===c.name;return `<button type="button" class="component-category ${expanded?'active':''}" data-category="${c.name}" style="--category-accent:${c.color}" aria-pressed="${expanded}" aria-expanded="${expanded}"><span class="category-mark" aria-hidden="true"></span><span>${c.name}</span><small>${normalized.filter(it=>it.category===c.name).length}</small><span class="category-chevron ${expanded?'expanded':''}" aria-hidden="true">›</span></button>${expanded?resultMarkup:''}`}).join('') + '</div>';
   host.querySelectorAll('.component-category').forEach(btn=>btn.addEventListener('click',()=>{
    // Clicking the already-open category collapses its cards; clicking another category opens that section.
    activeCategory = activeCategory === btn.dataset.category ? null : btn.dataset.category;
    paint();
   }));
   attachCardEvents();
  }
  paint();
  document.getElementById('search')?.addEventListener('input', paint);
 }

 // Embedded manifest makes the supplied SVG library work even when index.html is opened directly via file://.
 const embeddedSymbolManifest = {"project":"ELECTRICAL SIMU CKT","count":35,"symbols":[{"file":"components/Power/01_DC_Negative.svg","name":"01 DC Negative","category":"Power","original_filename":"01_DC_Negative.svg"},{"file":"components/Power/02_DC_Positive.svg","name":"02 DC Positive","category":"Power","original_filename":"02_DC_Positive.svg"},{"file":"components/Power/03_Earth_Ground.svg","name":"03 Earth Ground","category":"Power","original_filename":"03_Earth_Ground.svg"},{"file":"components/Power/04_N_Terminal.svg","name":"04 N Terminal","category":"Power","original_filename":"04_N_Terminal.svg"},{"file":"components/Power/05_L1_Terminal.svg","name":"05 L1 Terminal","category":"Power","original_filename":"05_L1_Terminal.svg"},{"file":"components/Power/06_L2_Terminal.svg","name":"06 L2 Terminal","category":"Power","original_filename":"06_L2_Terminal.svg"},{"file":"components/Power/07_L3_Terminal.svg","name":"07 L3 Terminal","category":"Power","original_filename":"07_L3_Terminal.svg"},{"file":"components/Power/08_PE_Terminal.svg","name":"08 PE Terminal","category":"Power","original_filename":"08_PE_Terminal.svg"},{"file":"components/Power/09_Three_Phase_L1_L2_L3.svg","name":"09 Three Phase L1 L2 L3","category":"Power","original_filename":"09_Three_Phase_L1_L2_L3.svg"},{"file":"components/Power/10_Three_Phase_Neutral.svg","name":"10 Three Phase Neutral","category":"Power","original_filename":"10_Three_Phase_Neutral.svg"},{"file":"components/Power/11_Three_Phase_Neutral_PE.svg","name":"11 Three Phase Neutral PE","category":"Power","original_filename":"11_Three_Phase_Neutral_PE.svg"},{"file":"assets/symbols/esc-contactor-coil.svg","name":"Contactor Coil","category":"Coils","original_filename":"Contactor_Coil.svg","type":"Contactor Coil"},{"file":"assets/symbols/esc-tof-timer-coil.svg","name":"TOF Timer Coil (Off Delay)","category":"Coils","original_filename":"TOF_Timer_Coil.svg","type":"TOF Timer Coil (Off Delay)"},{"file":"assets/symbols/esc-ton-tof-timer-coil.svg","name":"TON/TOF Timer Coil (ON/OFF Delay)","category":"Coils","original_filename":"TON_TOF_Timer_Coil.svg","type":"TON/TOF Timer Coil (ON/OFF Delay)"},{"file":"assets/symbols/esc-ton-timer-coil.svg","name":"TON Timer Coil (On Delay)","category":"Coils","original_filename":"TON_Timer_Coil.svg","type":"TON Timer Coil (On Delay)"},{"file":"components/Switches/Contact_01.svg","name":"Contact 01","category":"Switches","original_filename":"Contact_01.svg","type":"Auxiliary Contact 01"},{"file":"components/Switches/Contact_02.svg","name":"Contact 02","category":"Switches","original_filename":"Contact_02.svg","type":"Auxiliary Contact 02"},{"file":"components/Switches/Contact_03.svg","name":"Contact 03","category":"Switches","original_filename":"Contact_03.svg","type":"Auxiliary Contact 03"},{"file":"components/Switches/Contact_04.svg","name":"Contact 04","category":"Switches","original_filename":"Contact_04.svg","type":"Auxiliary Contact 04"},{"file":"components/Switches/Contact_05.svg","name":"Contact 05","category":"Switches","original_filename":"Contact_05.svg","type":"Auxiliary Contact 05"},{"file":"components/Switches/Contact_06.svg","name":"Contact 06","category":"Switches","original_filename":"Contact_06.svg","type":"Auxiliary Contact 06"},{"file":"components/Switches/Contact_07.svg","name":"Contact 07","category":"Switches","original_filename":"Contact_07.svg","type":"Auxiliary Contact 07"},{"file":"components/Switches/Contact_08.svg","name":"Contact 08","category":"Switches","original_filename":"Contact_08.svg","type":"Auxiliary Contact 08"},{"file":"components/Switches/Contact_09.svg","name":"Contact 09","category":"Switches","original_filename":"Contact_09.svg","type":"Auxiliary Contact 09"},{"file":"components/Switches/Contact_10.svg","name":"Contact 10","category":"Switches","original_filename":"Contact_10.svg","type":"Auxiliary Contact 10"},{"file":"components/Switches/Contact_11.svg","name":"Contact 11","category":"Switches","original_filename":"Contact_11.svg","type":"Auxiliary Contact 11"},{"file":"components/Switches/Contact_12.svg","name":"Contact 12","category":"Switches","original_filename":"Contact_12.svg","type":"Auxiliary Contact 12"},{"file":"components/Switches/Contact_13.svg","name":"Contact 13","category":"Switches","original_filename":"Contact_13.svg","type":"Auxiliary Contact 13"},{"file":"components/Switches/Contact_14.svg","name":"Contact 14","category":"Switches","original_filename":"Contact_14.svg","type":"Auxiliary Contact 14"},{"file":"components/Switches/Contact_15.svg","name":"Contact 15","category":"Switches","original_filename":"Contact_15.svg","type":"Auxiliary Contact 15"},{"file":"components/Switches/Contact_16.svg","name":"Contact 16","category":"Switches","original_filename":"Contact_16.svg","type":"Auxiliary Contact 16"},{"file":"components/Switches/Contact_17.svg","name":"Contact 17","category":"Switches","original_filename":"Contact_17.svg","type":"Auxiliary Contact 17"},{"file":"components/Switches/Contact_18.svg","name":"Contact 18","category":"Switches","original_filename":"Contact_18.svg","type":"Auxiliary Contact 18"},{"file":"components/Switches/Contact_19.svg","name":"Contact 19","category":"Switches","original_filename":"Contact_19.svg","type":"Auxiliary Contact 19"},{"file":"components/Switches/Contact_20.svg","name":"Contact 20","category":"Switches","original_filename":"Contact_20.svg","type":"Auxiliary Contact 20"}]};
 const assetItems = (embeddedSymbolManifest.symbols || []).filter(it => it.file && /\.svg$/i.test(it.file));
 if (assetItems.length) renderAssets(assetItems);
 else {
   host.innerHTML = '<div class="library-error">No SVG symbols were found in the embedded library.</div>';
 }


 // Replace a generic drawn icon with the original SVG asset when one was dragged from the library.
 const priorMakeDropped=makeDropped;
 makeDropped=function(d,x,y){
   const g=priorMakeDropped(d,x,y);
   if(d.symbolFile){
    g.dataset.symbolFile=d.symbolFile;
    const old=g.querySelector('svg');
    if(old){
      old.innerHTML=''; old.setAttribute('x','15');old.setAttribute('y','13');old.setAttribute('width','90');old.setAttribute('height','63');old.setAttribute('viewBox','0 0 90 63');
      old.setAttribute('preserveAspectRatio','xMidYMid meet');
      const img=document.createElementNS(NS,'image');img.setAttribute('x','0');img.setAttribute('y','0');img.setAttribute('width','90');img.setAttribute('height','63');img.setAttribute('preserveAspectRatio','xMidYMid meet');img.setAttribute('href',d.symbolFile);img.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href',d.symbolFile);old.appendChild(img);
    }
    // Keep the real SVG symbol visually crisp while leaving the fixed terminal points as the interaction layer.
    g.classList.add('original-svg-component');
   }
   return g;
 };

 // Simulation interaction: in RUN mode, operating a placed control visibly changes its state.
 dropLayer.addEventListener('click',e=>{
   const g=e.target.closest&&e.target.closest('.dropped-symbol');
   if(!g||!running||e.target.classList.contains('mag-port'))return;
   const t=(g.dataset.type||'').toLowerCase();
   const n=(g.dataset.name||'').toLowerCase();
   if(/button|switch|contact|stop|start|limit|key|emergency|counter/.test(t+' '+n)){
     g.classList.toggle('device-on');
     const on=g.classList.contains('device-on');
     state.textContent=`SIMULATION • ${g.dataset.name.toUpperCase()} ${on?'OPERATED / CLOSED':'RELEASED / NORMAL'}`;
   }
 },true);
})();

/* ESC: toolbar labels are compact icons; expose each tool name on hover/focus. */
document.querySelectorAll('.top nav button').forEach(button=>{
  const label=button.querySelector('em');
  if(label){
    const name=label.textContent.trim();
    button.title=name;
    button.setAttribute('aria-label',name);
  }
});


/* Keep terminal-to-terminal wires attached when a component moves. */
function refreshWiresForComponent(moved){
 const layer=document.getElementById('wireLayer');if(!layer||!moved?.dataset?.uid)return;
 const portAt=(g,label)=>{const p=(absolutePorts(g)||[]).find(x=>x.label===label);return p?{x:p.x,y:p.y}:null};
 for(const wire of layer.querySelectorAll('.connected-wire')){
  if(wire.dataset.fromG!==moved.dataset.uid&&wire.dataset.toG!==moved.dataset.uid)continue;
  const aG=document.querySelector(`#dropLayer .dropped-symbol[data-uid="${wire.dataset.fromG}"]`),bG=document.querySelector(`#dropLayer .dropped-symbol[data-uid="${wire.dataset.toG}"]`);
  if(!aG||!bG)continue;const a=portAt(aG,wire.dataset.from),b=portAt(bG,wire.dataset.to);if(!a||!b)continue;
  const mx=Math.round((a.x+b.x)/2);wire.setAttribute('points',`${a.x},${a.y} ${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`);
 }
}

/* V51: make every placed component reliably selectable by click. The property inspector follows the clicked component. */
(function installClickSelectionFallback(){
  const layer=document.getElementById('dropLayer');
  if(!layer) return;
  layer.addEventListener('click', function(e){
    if(e.target && e.target.closest && e.target.closest('.mag-port')) return;
    const g=e.target && e.target.closest ? e.target.closest('.dropped-symbol') : null;
    if(!g) return;
    select(g);
    state.textContent='SELECTED • '+(g.dataset.ref||g.dataset.name||'COMPONENT');
  }, true);
})();

/* V18: final, delegated single-component selection and drag controller.
   It takes priority over older per-component handlers to avoid conflicts. */
(function installReliableIndividualDrag(){
  const layer=document.getElementById('dropLayer');
  const canvas=document.getElementById('schematic');
  if(!layer||!canvas) return;
  let drag=null;
  function point(e){ return getPoint(e); }
  layer.addEventListener('pointerdown', function(e){
    if(e.button!==0) return;
    const target=e.target;
    // Terminal clicks belong to the wiring tool, not component movement.
    if(target && target.closest && target.closest('.mag-port')) return;
    const g=target && target.closest ? target.closest('.dropped-symbol') : null;
    if(!g) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    select(g);
    state.textContent='SELECTED • '+(g.dataset.ref||g.dataset.name||'COMPONENT');
    const p=point(e);
    drag={g,pointerId:e.pointerId,dx:p.x-(+g.dataset.x||0),dy:p.y-(+g.dataset.y||0),moved:false};
    g.classList.add('moving');
    g.style.cursor='default';
    try{canvas.setPointerCapture(e.pointerId)}catch(_){}
  },true);
  function move(e){
    if(!drag || e.pointerId!==drag.pointerId) return;
    e.preventDefault();
    const g=drag.g;
    if(!g || !g.isConnected){drag=null;return;}
    const p=point(e), x=p.x-drag.dx, y=p.y-drag.dy;
    if(Math.hypot(x-(+g.dataset.x||0),y-(+g.dataset.y||0))>0.5) drag.moved=true;
    g.dataset.x=x; g.dataset.y=y;
    applyComponentTransform(g,x,y);refreshWiresForComponent(g);
  }
  function finish(e){
    if(!drag || (e.pointerId!=null && e.pointerId!==drag.pointerId)) return;
    const g=drag.g;
    if(g){g.classList.remove('moving');g.style.cursor='default';select(g);}
    if(drag.moved && g) state.textContent='MOVED • '+(g.dataset.ref||g.dataset.name||'COMPONENT');
    drag=null;
  }
  window.addEventListener('pointermove',move,{capture:true,passive:false});
  window.addEventListener('pointerup',finish,true);
  window.addEventListener('pointercancel',finish,true);
})();


/* V66: deterministic library toggle with explicit layout updates. */
(function setupLibraryCollapseV66(){
 const button=document.getElementById('libraryToggle');
 const arrow=document.getElementById('libraryCollapseArrow');
 const body=document.body, layout=document.querySelector('.layout');
 const library=layout&&layout.querySelector(':scope > .library');
 const work=layout&&layout.querySelector(':scope > .work');
 function setHidden(hidden){
  hidden=!!hidden; body.classList.toggle('library-hidden',hidden);
  if(library){
   if(hidden){['display','width','min-width','max-width','flex','padding','border-width'].forEach((k)=>library.style.setProperty(k,({'display':'none','width':'0','min-width':'0','max-width':'0','flex':'0 0 0','padding':'0','border-width':'0'})[k],'important'));}
   else {library.style.setProperty('display','block','important');library.style.setProperty('width','218px','important');library.style.setProperty('min-width','218px','important');library.style.setProperty('max-width','218px','important');library.style.setProperty('flex','0 0 218px','important');library.style.removeProperty('padding');library.style.removeProperty('border-width');}
  }
  if(work){work.style.setProperty('min-width','0','important');work.style.setProperty('flex',hidden?'1 1 100%':'1 1 auto','important');work.style.setProperty('width',hidden?'100%':'auto','important');work.style.setProperty('max-width',hidden?'100%':'none','important');}
  if(button){button.setAttribute('aria-pressed',String(!hidden));button.classList.toggle('active',!hidden);button.title=hidden?'Show component library':'Hide component library';button.setAttribute('aria-label',button.title);}
  if(arrow){arrow.title=hidden?'Library hidden':'Hide component library';arrow.setAttribute('aria-label',arrow.title);}
  window.dispatchEvent(new Event('resize'));
 }
 if(button) button.onclick=function(e){e.preventDefault();e.stopPropagation();setHidden(!body.classList.contains('library-hidden'));};
 if(arrow) arrow.onclick=function(e){e.preventDefault();e.stopPropagation();setHidden(true);};
 setHidden(true);
})();

/* V59: robust delegated double-click property opening for all placed symbols,
   including SVG library components and components restored from saved drawings. */
(function fixDelegatedPropertyDoubleClick(){
  const canvas = document.getElementById('schematic');
  const layer = document.getElementById('dropLayer');
  if (!canvas || !layer || typeof select !== 'function') return;
  function openForEvent(e) {
    const target = e.target;
    const g = target && target.closest ? target.closest('#dropLayer .dropped-symbol') : null;
    if (!g) return;
    // Avoid treating terminal squares as component body double-clicks; double-click
    // on the component's visible SVG or its surrounding symbol group is supported.
    select(g, true);
    const panel = document.getElementById('propertyPanel');
    if (panel) {
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
    }
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
  }
  // Use capture so older click/drag handlers cannot immediately close the panel.
  canvas.addEventListener('dblclick', openForEvent, true);
  // Some browser/SVG combinations suppress dblclick after drag-enabled pointer events.
  // A second click (detail === 2) opens the same panel as a reliable fallback.
  canvas.addEventListener('click', function(e) {
    if (e.detail !== 2) return;
    openForEvent(e);
  }, true);
})();
