const sheet=document.getElementById('sheet'), sim=document.getElementById('sim'), state=document.getElementById('state'), motorState=document.getElementById('motorState');

/* IEC-style component library. Device designations follow common IEC/industrial practice.
   Exact reference designators can be overridden per project/component. */
const groups=[
 {name:'POWER SUPPLY',color:'#0879df',items:[
  ['pe','Protective Earth (PE)'],['gnd','Ground (GND)'],['dc-','DC Negative (−)'],['dc+','DC Positive (+)'],['n','Neutral (N)'],['l1','Phase 1 (L1)'],['l2','Phase 2 (L2)'],['l3','Phase 3 (L3)'],['3p','3Φ Supply L1 L2 L3'],['gen3','3Φ Generator (GS3~)'],['tr1','Transformer 1Φ'],['tr3','Transformer 3Φ'],['psu','AC-DC Power Supply']
 ]},
 {name:'BREAKERS & PROTECTION',color:'#e21f2f',items:[
  ['disconnect','Disconnector (Q)'],['isolator','Isolator (QS)'],['acb','Air Circuit Breaker (ACB)'],['mccb','Moulded Case CB (MCCB)'],['mcb','Miniature CB (MCB)'],['fuse','Fuse (F)'],['hrc','HRC Fuse'],['fuseswitch','Fuse Switch'],['spd','Surge Protection (SPD)'],['thermal','Thermal Protector'],['magtrip','Magnetic Trip'],['mpcb','Motor Protection CB'],['elcb','ELCB / RCCB']
 ]},
 {name:'MCB / MCCB',color:'#c86a00',items:[
  ['1pmcb','1P MCB'],['2pmcb','2P MCB'],['3pmcb','3P MCB'],['4pmcb','4P MCB'],['1pmccb','1P MCCB'],['3pmccb','3P MCCB'],['4pmccb','4P MCCB'],['mcbaux','MCB with Aux'],['mccbsht','MCCB with Shunt Trip'],['mccbuv','MCCB with UV Trip'],['rcbo','RCBO'],['1pnmcb','1P+N MCB'],['dcmcb','DC MCB']
 ]},
 {name:'CONTACTORS',color:'#00a94f',items:[
  ['3pcont','3P Contactor (KM)'],['4pcont','4P Contactor (KM)'],['coil','Contactor Coil A1/A2'],['mainno','Main Contact NO'],['mainnc','Main Contact NC'],['auxno','Aux Contact NO (13-14)'],['auxnc','Aux Contact NC (21-22)'],['mechlink','Mechanical Link'],['contaux','Contactor with Aux'],['reverse','Reversing Contactor'],['contimer','Contactor with Timer'],['stardelta','Star-Delta Contactor'],['latchcont','Latching Contactor']
 ]},
 {name:'RELAYS',color:'#7b28c8',items:[
  ['relaycoil','Relay Coil (K)'],['relayno','Relay Contact NO'],['relaync','Relay Contact NC'],['changeover','Changeover NO/NC'],['powerrelay','Power Relay'],['interpose','Interface Relay'],['latchrelay','Latching Relay'],['ssr','Solid State Relay'],['reed','Reed Relay'],['overload','Overload Relay'],['thermalrelay','Thermal Relay (95-96)'],['auxrelay','Aux Relay (4PDT)'],['safetyrelay','Safety Relay']
 ]},
 {name:'AUXILIARY CONTACTS',color:'#9b8700',items:[
  ['no','NO Contact'],['nc','NC Contact'],['change','Changeover Contact'],['twinnc','Twin NC'],['twinno','Twin NO'],['linked','Mechanically Linked Contacts'],['tdno','Time Delayed NO (ON Delay)'],['tdnc','Time Delayed NC (ON Delay)'],['offno','OFF Delay NO'],['offnc','OFF Delay NC'],['auxblock','Auxiliary Block'],['auxfront','Aux Contact (Front)'],['auxside','Aux Contact (Side)']
 ]},
 {name:'CONTROL DEVICES',color:'#0879df',items:[
  ['start','Push Button NO (START)'],['stop','Push Button NC (STOP)'],['estop','Emergency Stop NC'],['sel2','Selector Switch 2-Position'],['sel3','Selector Switch 3-Position'],['key','Key Switch'],['toggle','Toggle Switch'],['limitno','Limit Switch NO'],['limitnc','Limit Switch NC'],['foot','Foot Switch'],['pressure','Pressure Switch'],['temperature','Temperature Switch'],['float','Float Switch'],['hand','Hand Lever Switch']
 ]},
 {name:'TIMERS & CONTROL RELAYS',color:'#00a94f',items:[
  ['ton','ON Delay Timer (TON)'],['tof','OFF Delay Timer (TOF)'],['multitimer','Multi-Function Timer'],['timernc','Time Relay NC'],['timerno','Time Relay NO'],['stimer','Star-Delta Timer'],['flasher','Flasher Relay'],['cyclic','Cyclic Timer'],['stair','Staircase Timer'],['analogtimer','Analog Timer'],['digitaltimer','Digital Timer'],['programmable','Programmable Timer'],['counter','Time Counter']
 ]},
 {name:'MOTORS & LOADS',color:'#e21f2f',items:[
  ['motor3','3Φ Motor (M3~)'],['motor1','1Φ Motor (M1~)'],['motorDC','DC Motor'],['twospeed','Two-Speed Motor'],['motorsd','Star/Delta Motor'],['brake','Brake Motor'],['gear','Gear Motor'],['heater','Heater'],['resistive','Resistive Load'],['inductive','Inductive Load'],['capacitive','Capacitive Load'],['solenoid','Solenoid'],['buzzer','Buzzer']
 ]},
 {name:'INDICATORS & METERS',color:'#c86a00',items:[
  ['lamp','Lamp / Indicator (H)'],['led','LED Indicator'],['buzzer','Buzzer'],['siren','Siren'],['tower','Tower Lamp'],['ammeter','Ammeter'],['voltmeter','Voltmeter'],['freq','Frequency Meter'],['kw','Power Meter (kW)'],['kwh','Energy Meter (kWh)'],['hour','Hour Meter'],['multimeter','Multi-Function Meter'],['pilot','Pilot Lamp R/Y/G']
 ]},
 {name:'PLC & I/O',color:'#7b28c8',items:[
  ['plc','PLC / CPU'],['di','Digital Input (DI)'],['do','Digital Output (DO)'],['ai','Analog Input (AI)'],['ao','Analog Output (AO)'],['relayout','Relay Output'],['rs485','Communication RS485'],['ethernet','Ethernet Port'],['profinet','PROFINET'],['terminalmodule','Terminal Module'],['iomodule','I/O Module'],['plcpower','PLC Power Supply 24V DC'],['expansion','Expansion Module']
 ]},
 {name:'SENSORS & FIELD DEVICES',color:'#00a9c7',items:[
  ['prox','Proximity Sensor (Inductive)'],['capsensor','Capacitive Sensor'],['photo','Photoelectric Sensor'],['ultra','Ultrasonic Sensor'],['limitsensor','Limit Sensor'],['pt100','Temperature Sensor (PT100)'],['presssensor','Pressure Sensor'],['flow','Flow Sensor'],['level','Level Sensor'],['speed','Speed Sensor'],['encoder','Position Sensor (Encoder)'],['current','Current Sensor'],['voltage','Voltage Sensor']
 ]},
 {name:'TERMINALS & WIRING',color:'#777f86',items:[
  ['terminal','Terminal (X)'],['terminalblock','Terminal Block (Multi)'],['cross','Cross Terminal'],['junction','Junction'],['crossconn','Wire Crossing (Connected)'],['crossnc','Wire Crossing (Not Connected)'],['entry','Cable Entry'],['cable','Cable'],['shield','Shielded Cable'],['ferrule','Ferrule'],['plug','Plug / Socket'],['test','Test Point'],['connector','Connector']
 ]}
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
function renderLibrary(){
 lib.innerHTML=groups.map((g,gi)=>`<section class="cat ${gi===0?'open':''}" data-group="${g.name}"><button class="cat-head" style="--accent:${g.color}"><span class="folder">▰</span><b>${g.name}</b><small>${g.items.length} symbols</small><i>${gi===0?'⌃':'⌄'}</i></button><div class="cat-body">${g.items.map(([type,name])=>{const ref=refPrefix(type);return `<button class="symbol-btn" draggable="true" data-symbol="${type}" data-name="${name}" data-ref="${ref}" data-accent="${g.color}" style="--accent:${g.color};color:${g.color}" title="${name} • IEC reference prefix ${ref}"><div class="symbol-preview">${withPreviewPorts(type)}</div><label>${name}</label><small>IEC: ${ref}</small></button>`}).join('')}</div></section>`).join('');
 document.querySelectorAll('.cat-head').forEach(head=>head.addEventListener('click',()=>{const cat=head.parentElement;cat.classList.toggle('open');head.querySelector('i').textContent=cat.classList.contains('open')?'⌃':'⌄'}));
 document.querySelectorAll('.symbol-btn').forEach(b=>{
  b.addEventListener('dragstart',e=>{e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('application/json',JSON.stringify({type:b.dataset.symbol,name:b.dataset.name,ref:b.dataset.ref,accent:b.dataset.accent}));document.getElementById('dropOverlay').classList.add('show');state.textContent='DRAGGING • '+b.dataset.name.toUpperCase();});
  b.addEventListener('dragend',()=>document.getElementById('dropOverlay').classList.remove('show'));
  b.addEventListener('click',()=>{state.textContent='DRAG '+b.dataset.name.toUpperCase()+' INTO SCHEMATIC';});
 });
}


const svg=document.getElementById('schematic'), dropLayer=document.getElementById('dropLayer'), overlay=document.getElementById('dropOverlay');
let running=false, selected=null, counter=1;
function render(){document.body.classList.toggle('live',running);sim.textContent=running?'● RUNNING':'● STOPPED';sim.classList.toggle('running',running);motorState.textContent=running?'Motor: RUNNING':'Motor: OFF';state.textContent=running?'SIMULATION • LIVE':'READY • 2D SCHEMATIC';}
document.getElementById('play').onclick=()=>{running=true;render()};
document.getElementById('stop').onclick=()=>{running=false;render()};
document.getElementById('threeD').onclick=()=>alert('3D view will use the same IEC circuit model as this 2D schematic.');
document.getElementById('delete').onclick=()=>{if(selected){selected.remove();selected=null;state.textContent='DELETED';}else state.textContent='CLICK A COMPONENT THEN PRESS DELETE';};

document.addEventListener('keydown',e=>{if(e.key==='Escape'){select(null);state.textContent='SELECTION CLEARED';return;}if(e.key==='Delete'&&selected){e.preventDefault();selected.remove();selected=null;state.textContent='DELETED';}});

document.getElementById('search').addEventListener('input',e=>{const q=e.target.value.toLowerCase().trim();document.querySelectorAll('.library .cat').forEach(s=>{const match=s.textContent.toLowerCase().includes(q);s.style.display=match?'block':'none';if(q&&match){s.classList.add('open');s.querySelector('.cat-head i').textContent='⌃'}})});

function getPoint(e){const r=svg.getBoundingClientRect();const vb=svg.viewBox.baseVal;return {x:(e.clientX-r.left)*(vb.width/r.width),y:(e.clientY-r.top)*(vb.height/r.height)};}
function makeDropped(d,x,y){
 const NS='http://www.w3.org/2000/svg'; const g=document.createElementNS(NS,'g'); g.setAttribute('class','dropped-symbol'); g.dataset.type=d.type; g.dataset.name=d.name; g.dataset.x=x;g.dataset.y=y;g.setAttribute('transform',`translate(${x-36},${y-22})`);
 const box=document.createElementNS(NS,'rect'); box.setAttribute('class','select-box');box.setAttribute('x',0);box.setAttribute('y',0);box.setAttribute('width',72);box.setAttribute('height',44);box.setAttribute('rx',4);
 const ns=document.createElementNS(NS,'svg');ns.setAttribute('x',12);ns.setAttribute('y',4);ns.setAttribute('width',48);ns.setAttribute('height',32);ns.setAttribute('viewBox','0 0 48 32');ns.innerHTML=icon(d.type).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
 const label=document.createElementNS(NS,'text');label.setAttribute('class','drop-label');label.setAttribute('x',36);label.setAttribute('y',42);label.setAttribute('text-anchor','middle');label.textContent=d.name.length>20?d.name.slice(0,19)+'…':d.name;
 const title=document.createElementNS(NS,'title');title.textContent=d.name+' | IEC reference '+(d.ref||refPrefix(d.type));g.appendChild(title);
 const tag=document.createElementNS(NS,'text');tag.setAttribute('class','drop-tag');tag.setAttribute('x',36);tag.setAttribute('y',-3);tag.setAttribute('text-anchor','middle');tag.textContent='-'+(d.ref||refPrefix(d.type))+counter++;
 g.append(box,ns,label,tag);dropLayer.appendChild(g);select(g);enableMove(g);return g;
}
function select(g){if(selected)selected.classList.remove('selected');selected=g;if(g)g.classList.add('selected');}
function enableMove(g){
 let moving=false,dx=0,dy=0;
 g.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.stopPropagation();select(g);moving=true;const p=getPoint(e);const x=+g.dataset.x,y=+g.dataset.y;dx=p.x-x;dy=p.y-y;g.setPointerCapture(e.pointerId);});
 g.addEventListener('pointermove',e=>{if(!moving)return;const p=getPoint(e);const x=Math.round(p.x-dx),y=Math.round(p.y-dy);g.dataset.x=x;g.dataset.y=y;g.setAttribute('transform',`translate(${x-36},${y-22})`);});
 g.addEventListener('pointerup',e=>{moving=false;try{g.releasePointerCapture(e.pointerId)}catch{}});
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
function withPreviewPorts(type){
  const base=icon(type).replace('</svg>','');
  const ports=portDefs(type).map(p=>`<rect class="port" x="${p.x-2}" y="${p.y-2}" width="4" height="4"/><text class="port-label" x="${p.x}" y="${p.side==='top'?p.y-3:p.y+8}" text-anchor="middle">${p.label}</text>`).join('');
  return base+ports+'</svg>';
}
function makeDropped(d,x,y){
  const NS='http://www.w3.org/2000/svg', W=120, H=90;
  const g=document.createElementNS(NS,'g');
  g.setAttribute('class','dropped-symbol'); g.dataset.type=d.type; g.dataset.name=d.name; g.dataset.accent=d.accent||'#e9f1ed'; g.dataset.x=x; g.dataset.y=y; g.dataset.uid='C'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,7);
  g.setAttribute('transform',`translate(${x-W/2},${y-H/2})`);

  // The symbol, its tails, terminal squares and labels are ONE SVG group.
  // Keep the symbol at its native 48x32 viewBox so magnetic ports line up exactly.
  const ns=document.createElementNS(NS,'svg'); ns.setAttribute('x',36); ns.setAttribute('y',28); ns.setAttribute('width',48); ns.setAttribute('height',32); ns.setAttribute('viewBox','0 0 48 32'); ns.setAttribute('preserveAspectRatio','none'); ns.style.color=g.dataset.accent; ns.style.pointerEvents='none'; ns.innerHTML=icon(d.type).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
  const ports=document.createElementNS(NS,'g'); ports.setAttribute('class','component-ports');
  portDefs(d.type).forEach(p=>{
    const r=document.createElementNS(NS,'rect'); r.setAttribute('class','mag-port'); r.setAttribute('x',36+p.x-3); r.setAttribute('y',28+p.y-3); r.setAttribute('width',6); r.setAttribute('height',6); r.dataset.port=p.label; r.setAttribute('data-owner','component'); ports.appendChild(r);
    const t=document.createElementNS(NS,'text'); t.setAttribute('class','port-name'); t.setAttribute('x',36+p.x); t.setAttribute('y',p.side==='top'?28+p.y-7:28+p.y+12); t.setAttribute('text-anchor','middle'); t.textContent=p.label; ports.appendChild(t);
  });
  const label=document.createElementNS(NS,'text'); label.setAttribute('class','drop-label'); label.setAttribute('x',W/2); label.setAttribute('y',80); label.setAttribute('text-anchor','middle'); label.textContent=d.name.length>28?d.name.slice(0,27)+'…':d.name;
  const tag=document.createElementNS(NS,'text'); tag.setAttribute('class','drop-tag'); tag.setAttribute('x',W/2); tag.setAttribute('y',12); tag.setAttribute('text-anchor','middle'); tag.textContent='-'+(d.ref||refPrefix(d.type))+counter++;
  const title=document.createElementNS(NS,'title'); title.textContent=d.name+' | IEC reference '+(d.ref||refPrefix(d.type));
  g.append(title,ns,ports,label,tag); dropLayer.appendChild(g); select(g); enableMove(g); return g;
}
function absolutePorts(g,x=+g.dataset.x,y=+g.dataset.y){return portDefs(g.dataset.type).map(p=>({x:x-70+46+p.x,y:y-50+30+p.y,label:p.label}));}
function findSnap(g,x,y){let best=null,dist=999;const mine=absolutePorts(g,x,y);document.querySelectorAll('.dropped-symbol').forEach(o=>{if(o===g)return;absolutePorts(o).forEach(op=>mine.forEach(mp=>{const d=Math.hypot(op.x-mp.x,op.y-mp.y);if(d<18&&d<dist){dist=d;best={x:x+(op.x-mp.x),y:y+(op.y-mp.y)};}}));});return best;}
function enableMove(g){
  let moving=false, moved=false, dx=0, dy=0;
  g.addEventListener('pointerdown',e=>{
    if(e.button!==0) return;
    if(e.target && e.target.classList && e.target.classList.contains('mag-port')) return;
    e.preventDefault(); e.stopPropagation();
    select(g);
    const p=getPoint(e); dx=p.x-(+g.dataset.x); dy=p.y-(+g.dataset.y);
    moving=true; moved=false;
    try{g.setPointerCapture(e.pointerId)}catch{}
  });
  g.addEventListener('pointermove',e=>{
    if(!moving) return;
    const p=getPoint(e);
    const x=Math.round(p.x-dx), y=Math.round(p.y-dy);
    if(Math.abs(x-(+g.dataset.x))>1 || Math.abs(y-(+g.dataset.y))>1) moved=true;
    g.dataset.x=x; g.dataset.y=y;
    g.setAttribute('transform',`translate(${x-70},${y-50})`);
    g.classList.add('moving');
  });
  g.addEventListener('pointerup',e=>{
    if(!moving) return;
    moving=false; g.classList.remove('moving');
    try{g.releasePointerCapture(e.pointerId)}catch{}
    select(g);
  });
  g.addEventListener('click',e=>{
    if(e.target && e.target.classList && e.target.classList.contains('mag-port')) return;
    e.stopPropagation(); select(g);
    state.textContent='SELECTED • '+(g.dataset.name||'COMPONENT').toUpperCase()+' • PRESS DELETE OR DRAG';
  });
}
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
    state.textContent='SELECTED • '+(g.dataset.name||'COMPONENT').toUpperCase()+' • PRESS DELETE OR DRAG';
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
      portDefs(g.dataset.type).forEach(p=>out.push(portAbs(g,p)));
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

  function startWire(e){
    if(e.button!==0) return;
    const port=e.target.closest && e.target.closest('.mag-port');
    if(!port) return;
    const g=port.closest('.dropped-symbol');
    if(!g) return;
    e.preventDefault(); e.stopPropagation();
    const pdef=portDefs(g.dataset.type).find(p=>p.label===port.dataset.port);
    if(!pdef) return;
    const start=portAbs(g,pdef);
    const poly=document.createElementNS(NS,'polyline');
    poly.setAttribute('class','wiring-preview');
    poly.setAttribute('points',`${start.x},${start.y} ${start.x},${start.y}`);
    wireLayer.appendChild(poly);
    wiring={start,source:g,poly,target:null};
    if(window.state) state.textContent='WIRING • DRAG TO ANOTHER TERMINAL';
    document.body.style.cursor='crosshair';
    window.addEventListener('pointermove',moveWire,true);
    window.addEventListener('pointerup',endWire,true);
  }
  function moveWire(e){
    if(!wiring) return;
    const pt=pointFromEvent(e);
    const target=nearestTarget(pt,wiring.start);
    wiring.target=target;
    const end=target||pt;
    wiring.poly.setAttribute('points',makePath(wiring.start,end));
    document.querySelectorAll('.mag-port').forEach(r=>r.classList.remove('connected'));
    if(target){
      const rr=target.g.querySelector(`.mag-port[data-port="${CSS.escape(target.label)}"]`);
      if(rr) rr.classList.add('connected');
    }
  }
  function endWire(e){
    if(!wiring) return;
    const w=wiring;
    window.removeEventListener('pointermove',moveWire,true);
    window.removeEventListener('pointerup',endWire,true);
    document.body.style.cursor='';
    document.querySelectorAll('.mag-port').forEach(r=>r.classList.remove('connected'));
    if(w.target && w.target.g!==w.source){
      const line=document.createElementNS(NS,'polyline');
      line.setAttribute('class','connected-wire');
      line.setAttribute('points',makePath(w.start,w.target));
      line.dataset.from=w.start.label;
      line.dataset.to=w.target.label;
      line.dataset.fromType=w.source.dataset.type;
      line.dataset.toType=w.target.g.dataset.type;
      line.dataset.fromG=w.source.dataset.uid||'';
      line.dataset.toG=w.target.g.dataset.uid||'';
      wireLayer.appendChild(line);
      setPortConnected(w.start); setPortConnected(w.target);
      state.textContent=`CONNECTED • ${w.start.label} ↔ ${w.target.label}`;
    }else{
      state.textContent='WIRING CANCELLED • DROP ON ANOTHER TERMINAL';
    }
    w.poly.remove();
    wiring=null;
  }
  dropLayerEl.addEventListener('pointerdown',startWire,true);

  // Prevent the normal component-move handler when the user starts on a magnetic port.
  dropLayerEl.addEventListener('click',e=>{
    if(e.target.classList && e.target.classList.contains('mag-port')) e.stopPropagation();
  },true);

  // Remove any accidental selection rectangle if an older function creates one.
  const cleanBoxes=()=>document.querySelectorAll('.dropped-symbol .select-box').forEach(x=>x.remove());
  cleanBoxes();
  const observer=new MutationObserver(cleanBoxes);
  observer.observe(dropLayerEl,{childList:true,subtree:true});

  const hint=document.querySelector('.hint');
  if(hint) hint.textContent='Drag a symbol from the left. To wire: drag the small square terminal on one component to the square terminal on another component. Release to snap-connect.';
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
    const ports=portDefs(g.dataset.type).map(p=>portAbs(g,p));
    [...wires.querySelectorAll('.connected-wire')].forEach(line=>{
      if(line.dataset.fromG!==g.dataset.uid && line.dataset.toG!==g.dataset.uid) return;
      const fromG=[...layer.querySelectorAll('.dropped-symbol')].find(x=>x.dataset.uid===line.dataset.fromG);
      const toG=[...layer.querySelectorAll('.dropped-symbol')].find(x=>x.dataset.uid===line.dataset.toG);
      if(!fromG||!toG) return;
      const fp=portDefs(fromG.dataset.type).map(p=>portAbs(fromG,p)).find(p=>p.label===line.dataset.from);
      const tp=portDefs(toG.dataset.type).map(p=>portAbs(toG,p)).find(p=>p.label===line.dataset.to);
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
            const from=gs.find(g=>portDefs(g.dataset.type).some(p=>p.label===n.dataset.from));
            const to=gs.find(g=>portDefs(g.dataset.type).some(p=>p.label===n.dataset.to));
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
