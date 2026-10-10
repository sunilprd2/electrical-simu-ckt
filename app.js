const sheet=document.getElementById('sheet'), sim=document.getElementById('sim'), state=document.getElementById('state'), motorState=document.getElementById('motorState');

/* IEC-style component library. Device designations follow common IEC/industrial practice.
   Exact reference designators can be overridden per project/component. */
const groups=[
 {name:'POWER',color:'#0879df',items:[
  ['l1','Phase L'],['l1','Phase L1'],['l2','Phase L2'],['l3','Phase L3'],['n','Neutral N'],['pe','Earth PE'],
  ['3p','3-Phase Supply L1 + L2 + L3'],['3pn','3-Phase + Neutral L1 + L2 + L3 + N'],['3ppe','3-Phase + Earth L1 + L2 + L3 + PE'],['1pn','Single-Phase L + N'],['1pnpe','Single-Phase L + N + PE'],
  ['dc+','DC Positive Pole (+)'],['dc-','DC Negative Pole (−)'],['dcpair','DC Supply Pair (+ / −)'],
  ['tr1','Single-Phase Transformer'],['tr3','Three-Phase Transformer'],['psu','AC/DC Power Supply'],['psu3','3-Phase AC/DC Power Supply'],['pe','Protective Earth (PE)'],['gnd','Ground (GND)'],['gen3','3-Phase Generator']
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
 lib.innerHTML=groups.map((g,gi)=>`<section class="cat ${gi===0?'open':''}" data-group="${g.name}"><button class="cat-head" style="--accent:${g.color}"><span class="folder">▰</span><b>${g.name}</b><small>${g.items.length} symbols</small><i>${gi===0?'⌃':'⌄'}</i></button><div class="cat-body">${g.items.map(([type,name])=>{const ref=refPrefix(type);return `<button class="symbol-btn" draggable="true" data-symbol="${type}" data-name="${name}" data-ref="${ref}" data-accent="${g.color}" style="--accent:${g.color};color:${g.color}" title="${name} • IEC reference prefix ${ref}"><div class="symbol-preview">${withPreviewPorts(type)}</div><label>${name}</label></button>`}).join('')}</div></section>`).join('');
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
document.getElementById('threeD').onclick=()=>alert('The 2D physical component view is the next workspace to build. Your existing SCHEMATIC workspace is unchanged.');
document.getElementById('delete').onclick=()=>{if(selected){selected.remove();selected=null;state.textContent='DELETED';}else state.textContent='CLICK A COMPONENT THEN PRESS DELETE';};

document.addEventListener('keydown',e=>{if(e.key==='Escape'){select(null);state.textContent='SELECTION CLEARED';return;}if(e.key==='Delete'&&selected){e.preventDefault();selected.remove();selected=null;state.textContent='DELETED';}});

document.getElementById('search').addEventListener('input',e=>{const q=e.target.value.toLowerCase().trim();document.querySelectorAll('.library .cat').forEach(s=>{const match=s.textContent.toLowerCase().includes(q);s.style.display=match?'block':'none';if(q&&match){s.classList.add('open');s.querySelector('.cat-head i').textContent='⌃'}})});

function getPoint(e){const r=svg.getBoundingClientRect();const vb=svg.viewBox.baseVal;return {x:(e.clientX-r.left)*(vb.width/r.width),y:(e.clientY-r.top)*(vb.height/r.height)};}
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
 const NS='http://www.w3.org/2000/svg'; const g=document.createElementNS(NS,'g'); g.setAttribute('class','dropped-symbol'); g.dataset.type=d.type; g.dataset.porttype=d.symbolFile||d.type; g.dataset.name=d.name; g.dataset.ref=d.ref||nextReference(d); g.dataset.accent=d.accent||'#0879df'; g.style.setProperty('--component-accent',g.dataset.accent); g.dataset.x=x;g.dataset.y=y;g.setAttribute('transform',`translate(${x-36},${y-22})`);
 const box=document.createElementNS(NS,'rect'); box.setAttribute('class','select-box');box.setAttribute('x',0);box.setAttribute('y',0);box.setAttribute('width',72);box.setAttribute('height',44);box.setAttribute('rx',4);
 const ns=document.createElementNS(NS,'svg');ns.setAttribute('x',12);ns.setAttribute('y',4);ns.setAttribute('width',48);ns.setAttribute('height',32);ns.setAttribute('viewBox','0 0 48 32');ns.innerHTML=icon(d.type).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
 const label=document.createElementNS(NS,'text');label.setAttribute('class','drop-label');label.setAttribute('x',36);label.setAttribute('y',42);label.setAttribute('text-anchor','middle');label.textContent=d.name.length>20?d.name.slice(0,19)+'…':d.name;
 const title=document.createElementNS(NS,'title');title.textContent=(g.dataset.ref||'')+' — '+d.name+(g.dataset.value?' • '+g.dataset.value:'');g.appendChild(title);
 const tag=document.createElementNS(NS,'text');tag.setAttribute('class','drop-tag');tag.setAttribute('x',8);tag.setAttribute('y',23);tag.setAttribute('text-anchor','end');tag.setAttribute('fill',g.dataset.accent);tag.style.fill=g.dataset.accent;tag.style.fontWeight='400';tag.textContent=g.dataset.ref;
 g.append(box,ns,tag);dropLayer.appendChild(g);select(g);enableMove(g);
  g.addEventListener('dblclick',e=>{e.stopPropagation();const current=g.dataset.ref||tag.textContent;const next=prompt('Component designation (example: KM1, KM2, QF1, S0):',current);if(next&&next.trim()){g.dataset.ref=next.trim().toUpperCase();tag.textContent=g.dataset.ref;const title=g.querySelector('title');if(title)title.textContent=g.dataset.ref+' — '+d.name;}});
  return g;
}
function select(g){if(selected)selected.classList.remove('selected');selected=g;if(g)g.classList.add('selected');}
function enableMove(g){
 let moving=false,dx=0,dy=0;
 g.addEventListener('pointerdown',e=>{if(e.button!==0)return;if(e.target&&e.target.classList&&e.target.classList.contains('mag-port'))return;e.stopPropagation();select(g);moving=true;const p=getPoint(e);const x=+g.dataset.x,y=+g.dataset.y;dx=p.x-x;dy=p.y-y;g.setPointerCapture(e.pointerId);});
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
  const NS='http://www.w3.org/2000/svg', W=120, H=90;
  const g=document.createElementNS(NS,'g');
  g.setAttribute('class','dropped-symbol'); g.dataset.type=d.type; g.dataset.porttype=d.symbolFile||d.type; g.dataset.name=d.name; g.dataset.ref=d.ref||nextReference(d); g.dataset.value=d.value||''; g.dataset.accent=d.accent||'#e9f1ed'; g.dataset.x=x; g.dataset.y=y; g.dataset.uid='C'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,7);
  g.setAttribute('transform',`translate(${x-W/2},${y-H/2})`);

  // The symbol, its tails, terminal squares and labels are ONE SVG group.
  // Keep the symbol at its native 48x32 viewBox so magnetic ports line up exactly.
  const ns=document.createElementNS(NS,'svg'); ns.setAttribute('x',36); ns.setAttribute('y',28); ns.setAttribute('width',48); ns.setAttribute('height',32); ns.setAttribute('viewBox','0 0 48 32'); ns.setAttribute('preserveAspectRatio','none'); ns.style.color=g.dataset.accent; ns.style.pointerEvents='none';
  if(d.symbolFile && d.symbolFile.includes('/power-original/')){
    // Preserve the user's exact supplied SVG artwork in the workspace.
    ns.setAttribute('viewBox','0 0 100 100'); ns.setAttribute('x',10); ns.setAttribute('y',5); ns.setAttribute('width',100); ns.setAttribute('height',80);
    const im=document.createElementNS(NS,'image'); im.setAttribute('href',d.symbolFile); im.setAttribute('x',0); im.setAttribute('y',0); im.setAttribute('width',100); im.setAttribute('height',100); ns.appendChild(im);
  } else { ns.innerHTML=icon(d.type).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,''); }
  const ports=document.createElementNS(NS,'g'); ports.setAttribute('class','component-ports');
  portDefs(d.symbolFile||d.type).forEach(p=>{
    const r=document.createElementNS(NS,'circle'); r.setAttribute('class','mag-port'); r.setAttribute('cx',36+p.x); r.setAttribute('cy',28+p.y); r.setAttribute('r',2.1); r.dataset.port=p.label; r.setAttribute('data-owner','component'); ports.appendChild(r);
    const t=document.createElementNS(NS,'text'); t.setAttribute('class','port-name'); t.setAttribute('x',36+p.x); t.setAttribute('y',p.side==='top'?28+p.y-7:28+p.y+12); t.setAttribute('text-anchor','middle'); t.textContent=''; t.setAttribute('aria-label',p.label); ports.appendChild(t);
  });
  const label=document.createElementNS(NS,'text'); label.setAttribute('class','drop-label'); label.setAttribute('x',W/2); label.setAttribute('y',80); label.setAttribute('text-anchor','middle'); label.textContent='';
  const tag=document.createElementNS(NS,'text'); tag.setAttribute('class','drop-tag'); tag.setAttribute('x',W/2); tag.setAttribute('y',12); tag.setAttribute('text-anchor','middle'); tag.textContent=g.dataset.ref||nextReference(d);
  const title=document.createElementNS(NS,'title'); title.textContent=(g.dataset.ref||'')+' — '+d.name+(g.dataset.value?' • '+g.dataset.value:'');
  // Full-size transparent hit area makes the whole component selectable,
  // even when its SVG artwork contains thin lines with tiny click targets.
  const hit=document.createElementNS(NS,'rect');
  hit.setAttribute('class','component-hit-area');
  hit.setAttribute('x','0'); hit.setAttribute('y','0');
  hit.setAttribute('width',String(W)); hit.setAttribute('height',String(H));
  hit.setAttribute('fill','transparent'); hit.setAttribute('pointer-events','all');
  g.append(title,hit,ns,ports,label,tag); dropLayer.appendChild(g); select(g); enableMove(g); return g;
}
function absolutePorts(g,x=+g.dataset.x,y=+g.dataset.y){return portsFor(g).map(p=>({x:x-60+36+p.x,y:y-45+28+p.y,label:p.label}));}
function findSnap(g,x,y){let best=null,dist=999;const mine=absolutePorts(g,x,y);document.querySelectorAll('.dropped-symbol').forEach(o=>{if(o===g)return;absolutePorts(o).forEach(op=>mine.forEach(mp=>{const d=Math.hypot(op.x-mp.x,op.y-mp.y);if(d<18&&d<dist){dist=d;best={x:x+(op.x-mp.x),y:y+(op.y-mp.y)};}}));});return best;}
let activeDrag = null;
let suppressNextComponentClick = false;
function enableMove(g){
  // Each placed component is its own SVG group. Only the group that received
  // pointerdown is allowed to change position during this drag operation.
  g.style.pointerEvents = 'all';
  g.style.cursor = 'grab';
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
    g.style.cursor = 'grabbing';
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
  g.setAttribute('transform', `translate(${x - 60},${y - 45})`);
});
function finishComponentDrag(e) {
  if (!activeDrag || (e.pointerId != null && e.pointerId !== activeDrag.pointerId)) return;
  const g = activeDrag.component;
  const wasMoved = activeDrag.moved;
  if (g) {
    g.classList.remove('moving');
    g.style.cursor = 'grab';
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

  // Remove any accidental selection rectangle if an older function creates one.
  const cleanBoxes=()=>document.querySelectorAll('.dropped-symbol .select-box').forEach(x=>x.remove());
  cleanBoxes();
  const observer=new MutationObserver(cleanBoxes);
  observer.observe(dropLayerEl,{childList:true,subtree:true});

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
   b.addEventListener('click',()=>{state.textContent='DRAG '+b.dataset.name.toUpperCase()+' INTO SCHEMATIC'});
  });
 }
 function renderAssets(items){
  const buckets=new Map();
  items.forEach(it=>{const cat=it.category||categoryFor(it.file);if(!buckets.has(cat))buckets.set(cat,[]);buckets.get(cat).push(it)});
  const keys=[...categoryOrder.filter(k=>buckets.has(k)),...([...buckets.keys()].filter(k=>!categoryOrder.includes(k)))];
  host.innerHTML=keys.map((cat,idx)=>{
   const accent=cat==='POWER'?'#139fe8':(groups.find(g=>g.name.toLowerCase().includes(cat.toLowerCase().split(' ')[0]))||groups[idx%groups.length]).color;
   const entries=buckets.get(cat)||[];
   return `<section class="cat ${idx===0?'open':''}" data-group="${cat}"><button class="cat-head" style="--accent:${accent}"><span class="folder">▰</span><b>${cat.toUpperCase()}</b><small>${entries.length} symbols</small><i>${idx===0?'⌃':'⌄'}</i></button><div class="cat-body">${entries.map(it=>{const cleanFile=(it.file||'').split(/[\\/]/).pop();const name=(it.category==='POWER'&&it.name)?it.name:(powerLabels[cleanFile]||friendly(cleanFile)),slug=slugName(cleanFile),type=powerTypeMap[cleanFile]||typeMap[slug]||slug;const ref=prefix(type);return `<button class="symbol-btn" draggable="true" data-symbol="${type}" data-name="${name}" data-ref="${ref}" data-file="${it.file}" data-accent="${accent}" style="--accent:${accent};color:${accent}" title="${name}"><div class="symbol-preview asset-symbol-preview"><img class="asset-symbol" src="${it.file}" alt="${name}" loading="lazy"></div><label>${name}</label></button>`}).join('')}</div></section>`
  }).join('');
  attachCardEvents();
  // Fix asset paths robustly: try the listed assets/symbols path first, then
  // the same filename at the repository root (some SVGs were uploaded there).
  host.querySelectorAll('img.asset-symbol').forEach(img=>{
    img.addEventListener('error',function retryAssetPath(){
      if(!this.dataset.rootFallbackTried){
        this.dataset.rootFallbackTried='1';
        const original=this.getAttribute('src')||'';
        const filename=original.split('/').pop();
        this.setAttribute('src',filename);
        return;
      }
      // Don't leave a broken-image glyph if the file is absent: show a clear
      // placeholder so the missing asset can be identified during testing.
      if(!this.dataset.placeholderShown){
        this.dataset.placeholderShown='1';
        this.removeAttribute('src');
        this.alt='SVG missing: '+(this.getAttribute('alt')||'symbol');
        this.style.display='none';
        const wrap=this.closest('.symbol-preview');
        if(wrap){wrap.classList.add('asset-missing');wrap.setAttribute('title',this.alt);}
      }
    });
  });
  if(search && !search.dataset.assetSearch){search.dataset.assetSearch='1';search.addEventListener('input',()=>{const q=search.value.toLowerCase().trim();host.querySelectorAll('.cat').forEach(cat=>{const match=cat.textContent.toLowerCase().includes(q);cat.style.display=match?'block':'none';if(q&&match){cat.classList.add('open');cat.querySelector('.cat-head i').textContent='⌃'}})});}
 }
 // Embedded manifest makes the supplied SVG library work even when index.html is opened directly via file://.
 const embeddedSymbolManifest = {"project":"ELECTRICAL SIMU CKT","count":93,"symbols":[{"file":"assets/symbols/ac-motor-3p-3-terminal.svg","name":"ac-motor-3p-3-terminal","category":"Motors & Earthing","original_filename":"ac-motor-3p-3-terminal.svg"},{"file":"assets/symbols/ac-motor-3p-6-terminal.svg","name":"ac-motor-3p-6-terminal","category":"Motors & Earthing","original_filename":"ac-motor-3p-6-terminal.svg"},{"file":"assets/symbols/bell.svg","name":"bell","category":"Indicators & Signalling","original_filename":"bell.svg"},{"file":"assets/symbols/changeover-contact-break-before-make.svg","name":"changeover-contact-break-before-make","category":"Contacts & Relays","original_filename":"changeover-contact-break-before-make.svg"},{"file":"assets/symbols/changeover-contact-off-delay.svg","name":"changeover-contact-off-delay","category":"Contacts & Relays","original_filename":"changeover-contact-off-delay.svg"},{"file":"assets/symbols/changeover-contact-on-delay.svg","name":"changeover-contact-on-delay","category":"Contacts & Relays","original_filename":"changeover-contact-on-delay.svg"},{"file":"assets/symbols/changeover-contact-on-off-delay.svg","name":"changeover-contact-on-off-delay","category":"Contacts & Relays","original_filename":"changeover-contact-on-off-delay.svg"},{"file":"assets/symbols/circuit-breaker-1p.svg","name":"circuit-breaker-1p","category":"Breakers & Protection","original_filename":"circuit-breaker-1p.svg"},{"file":"assets/symbols/circuit-breaker-2p.svg","name":"circuit-breaker-2p","category":"Breakers & Protection","original_filename":"circuit-breaker-2p.svg"},{"file":"assets/symbols/circuit-breaker-3p.svg","name":"circuit-breaker-3p","category":"Breakers & Protection","original_filename":"circuit-breaker-3p.svg"},{"file":"assets/symbols/circuit-breaker-thermal-magnetic-2p.svg","name":"circuit-breaker-thermal-magnetic-2p","category":"Breakers & Protection","original_filename":"circuit-breaker-thermal-magnetic-2p.svg"},{"file":"assets/symbols/circuit-breaker-thermal-magnetic-3p.svg","name":"circuit-breaker-thermal-magnetic-3p","category":"Breakers & Protection","original_filename":"circuit-breaker-thermal-magnetic-3p.svg"},{"file":"assets/symbols/coil (1).svg","name":"coil (1)","category":"Contactors & Coils","original_filename":"coil (1).svg"},{"file":"assets/symbols/coil.svg","name":"coil","category":"Contactors & Coils","original_filename":"coil.svg"},{"file":"assets/symbols/contactor-3p-automatic-tripping.svg","name":"contactor-3p-automatic-tripping","category":"Contactors & Coils","original_filename":"contactor-3p-automatic-tripping.svg"},{"file":"assets/symbols/contactor-3p.svg","name":"contactor-3p","category":"Contactors & Coils","original_filename":"contactor-3p.svg"},{"file":"assets/symbols/counter-nc.svg","name":"counter-nc","category":"Contacts & Relays","original_filename":"counter-nc.svg"},{"file":"assets/symbols/counter-no.svg","name":"counter-no","category":"Contacts & Relays","original_filename":"counter-no.svg"},{"file":"assets/symbols/counter-pulse.svg","name":"counter-pulse","category":"Contacts & Relays","original_filename":"counter-pulse.svg"},{"file":"assets/symbols/counter-switch-nc.svg","name":"counter-switch-nc","category":"Control Devices & Switches","original_filename":"counter-switch-nc.svg"},{"file":"assets/symbols/counter-switch-no.svg","name":"counter-switch-no","category":"Control Devices & Switches","original_filename":"counter-switch-no.svg"},{"file":"assets/symbols/disconnector-isolator-2p.svg","name":"disconnector-isolator-2p","category":"Breakers & Protection","original_filename":"disconnector-isolator-2p.svg"},{"file":"assets/symbols/disconnector-isolator-3p.svg","name":"disconnector-isolator-3p","category":"Breakers & Protection","original_filename":"disconnector-isolator-3p.svg"},{"file":"assets/symbols/earth-ground.svg","name":"earth-ground","category":"Motors & Earthing","original_filename":"earth-ground.svg"},{"file":"assets/symbols/electronic-clock-nc-switch.svg","name":"electronic-clock-nc-switch","category":"Timers","original_filename":"electronic-clock-nc-switch.svg"},{"file":"assets/symbols/electronic-clock-no-switch.svg","name":"electronic-clock-no-switch","category":"Timers","original_filename":"electronic-clock-no-switch.svg"},{"file":"assets/symbols/electronic-clock-switch.svg","name":"electronic-clock-switch","category":"Timers","original_filename":"electronic-clock-switch.svg"},{"file":"assets/symbols/electronic-clock.svg","name":"electronic-clock","category":"Timers","original_filename":"electronic-clock.svg"},{"file":"assets/symbols/emergency-stop-nc-spring-return.svg","name":"emergency-stop-nc-spring-return","category":"Control Devices & Switches","original_filename":"emergency-stop-nc-spring-return.svg"},{"file":"assets/symbols/emergency-stop-no-spring-return.svg","name":"emergency-stop-no-spring-return","category":"Control Devices & Switches","original_filename":"emergency-stop-no-spring-return.svg"},{"file":"assets/symbols/emergency-stop-no-turn-reset.svg","name":"emergency-stop-no-turn-reset","category":"Control Devices & Switches","original_filename":"emergency-stop-no-turn-reset.svg"},{"file":"assets/symbols/fuse-2p.svg","name":"fuse-2p","category":"Breakers & Protection","original_filename":"fuse-2p.svg"},{"file":"assets/symbols/fuse-3p.svg","name":"fuse-3p","category":"Breakers & Protection","original_filename":"fuse-3p.svg"},{"file":"assets/symbols/fuse-disconnector-isolator-2p.svg","name":"fuse-disconnector-isolator-2p","category":"Breakers & Protection","original_filename":"fuse-disconnector-isolator-2p.svg"},{"file":"assets/symbols/fuse-disconnector-isolator-3p (1).svg","name":"fuse-disconnector-isolator-3p (1)","category":"Breakers & Protection","original_filename":"fuse-disconnector-isolator-3p (1).svg"},{"file":"assets/symbols/fuse-disconnector-isolator-3p.svg","name":"fuse-disconnector-isolator-3p","category":"Breakers & Protection","original_filename":"fuse-disconnector-isolator-3p.svg"},{"file":"assets/symbols/fuse-disconnector-w-motor-circuit-breaker-2p.svg","name":"fuse-disconnector-w-motor-circuit-breaker-2p","category":"Breakers & Protection","original_filename":"fuse-disconnector-w-motor-circuit-breaker-2p.svg"},{"file":"assets/symbols/fuse-disconnector-w-motor-circuit-breaker-3p.svg","name":"fuse-disconnector-w-motor-circuit-breaker-3p","category":"Breakers & Protection","original_filename":"fuse-disconnector-w-motor-circuit-breaker-3p.svg"},{"file":"assets/symbols/fuse-switch-3p.svg","name":"fuse-switch-3p","category":"Breakers & Protection","original_filename":"fuse-switch-3p.svg"},{"file":"assets/symbols/horn.svg","name":"horn","category":"Indicators & Signalling","original_filename":"horn.svg"},{"file":"assets/symbols/isolator-square-3d.svg","name":"isolator-square-3d","category":"Breakers & Protection","original_filename":"isolator-square-3d.svg"},{"file":"assets/symbols/key-switch-nc-maintained.svg","name":"key-switch-nc-maintained","category":"Control Devices & Switches","original_filename":"key-switch-nc-maintained.svg"},{"file":"assets/symbols/key-switch-nc-spring-return.svg","name":"key-switch-nc-spring-return","category":"Control Devices & Switches","original_filename":"key-switch-nc-spring-return.svg"},{"file":"assets/symbols/key-switch-no-maintained.svg","name":"key-switch-no-maintained","category":"Control Devices & Switches","original_filename":"key-switch-no-maintained.svg"},{"file":"assets/symbols/led-coil.svg","name":"led-coil","category":"Contactors & Coils","original_filename":"led-coil.svg"},{"file":"assets/symbols/limit-switch-nc.svg","name":"limit-switch-nc","category":"Control Devices & Switches","original_filename":"limit-switch-nc.svg"},{"file":"assets/symbols/limit-switch-no.svg","name":"limit-switch-no","category":"Control Devices & Switches","original_filename":"limit-switch-no.svg"},{"file":"assets/symbols/main-switch-1p.svg","name":"main-switch-1p","category":"Breakers & Protection","original_filename":"main-switch-1p.svg"},{"file":"assets/symbols/main-switch-2p.svg","name":"main-switch-2p","category":"Breakers & Protection","original_filename":"main-switch-2p.svg"},{"file":"assets/symbols/main-switch-3p.svg","name":"main-switch-3p","category":"Breakers & Protection","original_filename":"main-switch-3p.svg"},{"file":"assets/symbols/manual-button-nc-maintained.svg","name":"manual-button-nc-maintained","category":"Control Devices & Switches","original_filename":"manual-button-nc-maintained.svg"},{"file":"assets/symbols/manual-button-nc-spring-return.svg","name":"manual-button-nc-spring-return","category":"Control Devices & Switches","original_filename":"manual-button-nc-spring-return.svg"},{"file":"assets/symbols/manual-button-no-maintained.svg","name":"manual-button-no-maintained","category":"Control Devices & Switches","original_filename":"manual-button-no-maintained.svg"},{"file":"assets/symbols/manual-button-no-spring-return.svg","name":"manual-button-no-spring-return","category":"Control Devices & Switches","original_filename":"manual-button-no-spring-return.svg"},{"file":"assets/symbols/manual-switch.svg","name":"manual-switch","category":"Control Devices & Switches","original_filename":"manual-switch.svg"},{"file":"assets/symbols/motor-circuit-breaker-2p.svg","name":"motor-circuit-breaker-2p","category":"Breakers & Protection","original_filename":"motor-circuit-breaker-2p.svg"},{"file":"assets/symbols/motor-circuit-breaker-3p.svg","name":"motor-circuit-breaker-3p","category":"Breakers & Protection","original_filename":"motor-circuit-breaker-3p.svg"},{"file":"assets/symbols/normally-close-contact.svg","name":"normally-close-contact","category":"Contacts & Relays","original_filename":"normally-close-contact.svg"},{"file":"assets/symbols/normally-closed-contact.svg","name":"normally-closed-contact","category":"Contacts & Relays","original_filename":"normally-closed-contact.svg"},{"file":"assets/symbols/normally-open-contact (1).svg","name":"normally-open-contact (1)","category":"Contacts & Relays","original_filename":"normally-open-contact (1).svg"},{"file":"assets/symbols/normally-open-contact.svg","name":"normally-open-contact","category":"Contacts & Relays","original_filename":"normally-open-contact.svg"},{"file":"assets/symbols/off-delay-nc-contact(1).svg","name":"off-delay-nc-contact(1)","category":"Contacts & Relays","original_filename":"off-delay-nc-contact(1).svg"},{"file":"assets/symbols/off-delay-no-contact (1).svg","name":"off-delay-no-contact (1)","category":"Contacts & Relays","original_filename":"off-delay-no-contact (1).svg"},{"file":"assets/symbols/off-delay-no-contact (2).svg","name":"off-delay-no-contact (2)","category":"Contacts & Relays","original_filename":"off-delay-no-contact (2).svg"},{"file":"assets/symbols/off-delay-no-contact.svg","name":"off-delay-no-contact","category":"Contacts & Relays","original_filename":"off-delay-no-contact.svg"},{"file":"assets/symbols/off-delay-timer (1).svg","name":"off-delay-timer (1)","category":"Timers","original_filename":"off-delay-timer (1).svg"},{"file":"assets/symbols/off-delay-timer.svg","name":"off-delay-timer","category":"Timers","original_filename":"off-delay-timer.svg"},{"file":"assets/symbols/on-delay-nc-contact(1).svg","name":"on-delay-nc-contact(1)","category":"Contacts & Relays","original_filename":"on-delay-nc-contact(1).svg"},{"file":"assets/symbols/on-delay-no-contact (1).svg","name":"on-delay-no-contact (1)","category":"Contacts & Relays","original_filename":"on-delay-no-contact (1).svg"},{"file":"assets/symbols/on-delay-no-contact.svg","name":"on-delay-no-contact","category":"Contacts & Relays","original_filename":"on-delay-no-contact.svg"},{"file":"assets/symbols/on-delay-timer (1).svg","name":"on-delay-timer (1)","category":"Timers","original_filename":"on-delay-timer (1).svg"},{"file":"assets/symbols/on-delay-timer.svg","name":"on-delay-timer","category":"Timers","original_filename":"on-delay-timer.svg"},{"file":"assets/symbols/on-off-delay-nc-contact.svg","name":"on-off-delay-nc-contact","category":"Contacts & Relays","original_filename":"on-off-delay-nc-contact.svg"},{"file":"assets/symbols/on-off-delay-no-contact.svg","name":"on-off-delay-no-contact","category":"Contacts & Relays","original_filename":"on-off-delay-no-contact.svg"},{"file":"assets/symbols/pilot-light (1).svg","name":"pilot-light (1)","category":"Indicators & Signalling","original_filename":"pilot-light (1).svg"},{"file":"assets/symbols/pilot-light-blink.svg","name":"pilot-light-blink","category":"Indicators & Signalling","original_filename":"pilot-light-blink.svg"},{"file":"assets/symbols/pilot-light.svg","name":"pilot-light","category":"Indicators & Signalling","original_filename":"pilot-light.svg"},{"file":"assets/symbols/push-button-nc-maintained(1).svg","name":"push-button-nc-maintained(1)","category":"Control Devices & Switches","original_filename":"push-button-nc-maintained(1).svg"},{"file":"assets/symbols/push-button-nc-spring-return(1).svg","name":"push-button-nc-spring-return(1)","category":"Control Devices & Switches","original_filename":"push-button-nc-spring-return(1).svg"},{"file":"assets/symbols/push-button-no-key-maintained(1).svg","name":"push-button-no-key-maintained(1)","category":"Control Devices & Switches","original_filename":"push-button-no-key-maintained(1).svg"},{"file":"supply-3phase.svg","name":"supply-3phase","category":"Power Supply","original_filename":"supply-3phase.svg"},{"file":"supply-3phase-neutral-earth.svg","name":"supply-3phase-neutral-earth","category":"Power Supply","original_filename":"supply-3phase-neutral-earth.svg"},{"file":"supply-single-phase.svg","name":"supply-single-phase","category":"Power Supply","original_filename":"supply-single-phase.svg"},{"file":"supply-single-phase-earth.svg","name":"supply-single-phase-earth","category":"Power Supply","original_filename":"supply-single-phase-earth.svg"},{"file":"supply-dc-positive.svg","name":"supply-dc-positive","category":"Power Supply","original_filename":"supply-dc-positive.svg"},{"file":"supply-dc-negative.svg","name":"supply-dc-negative","category":"Power Supply","original_filename":"supply-dc-negative.svg"},{"file":"supply-earth.svg","name":"supply-earth","category":"Power Supply","original_filename":"supply-earth.svg"},{"file":"supply-ground.svg","name":"supply-ground","category":"Power Supply","original_filename":"supply-ground.svg"},{"file":"supply-phase-l.svg","name":"supply-phase-l","category":"Power Supply","original_filename":"supply-phase-l.svg"},{"file":"supply-neutral-n.svg","name":"supply-neutral-n","category":"Power Supply","original_filename":"supply-neutral-n.svg"},{"file":"supply-transformer-1phase.svg","name":"supply-transformer-1phase","category":"Power Supply","original_filename":"supply-transformer-1phase.svg"},{"file":"supply-transformer-3phase.svg","name":"supply-transformer-3phase","category":"Power Supply","original_filename":"supply-transformer-3phase.svg"},{"file":"supply-acdc.svg","name":"supply-acdc","category":"Power Supply","original_filename":"supply-acdc.svg"},{"file":"assets/symbols/gemini-svg.svg","name":"L1 + L2 + L3","category":"POWER","original_filename":"gemini-svg.svg","type":"3p"},{"file":"assets/symbols/gemini-svg (1).svg","name":"L1 + L2 + L3 + N + PE","category":"POWER","original_filename":"gemini-svg (1).svg","type":"3p"},{"file":"assets/symbols/gemini-svg (2).svg","name":"L + N","category":"POWER","original_filename":"gemini-svg (2).svg","type":"1pn"},{"file":"assets/symbols/gemini-svg (3).svg","name":"L + N + PE","category":"POWER","original_filename":"gemini-svg (3).svg","type":"1pnpe"},{"file":"assets/symbols/gemini-svg (4).svg","name":"DC Positive Pole","category":"POWER","original_filename":"gemini-svg (4).svg","type":"dc+"},{"file":"assets/symbols/gemini-svg (5).svg","name":"DC Negative Pole","category":"POWER","original_filename":"gemini-svg (5).svg","type":"dc-"},{"file":"assets/symbols/gemini-svg (6).svg","name":"Protective Earth (PE)","category":"POWER","original_filename":"gemini-svg (6).svg","type":"pe"},{"file":"assets/symbols/gemini-svg (7).svg","name":"Earth Ground","category":"POWER","original_filename":"gemini-svg (7).svg","type":"gnd"},{"file":"assets/symbols/gemini-svg (8).svg","name":"Phase L","category":"POWER","original_filename":"gemini-svg (8).svg","type":"l1"},{"file":"assets/symbols/gemini-svg (9).svg","name":"Neutral N","category":"POWER","original_filename":"gemini-svg (9).svg","type":"n"},{"file":"assets/symbols/gemini-svg (10).svg","name":"Single-Phase Transformer","category":"POWER","original_filename":"gemini-svg (10).svg","type":"tr1"},{"file":"assets/symbols/gemini-svg (11).svg","name":"Three-Phase Transformer","category":"POWER","original_filename":"gemini-svg (11).svg","type":"tr3"},{"file":"assets/symbols/gemini-svg (13).svg","name":"Original POWER SVG 13","category":"POWER","original_filename":"gemini-svg (13).svg","type":"psu"},{"file":"assets/symbols/gemini-svg (14).svg","name":"Original POWER SVG 14","category":"POWER","original_filename":"gemini-svg (14).svg","type":"psu"},{"file":"assets/symbols/gemini-svg (15).svg","name":"Original POWER SVG 15","category":"POWER","original_filename":"gemini-svg (15).svg","type":"psu"},{"file":"assets/symbols/gemini-svg (16).svg","name":"Original POWER SVG 16","category":"POWER","original_filename":"gemini-svg (16).svg","type":"psu"}]};
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
    g.style.cursor='grabbing';
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
    g.setAttribute('transform',`translate(${x-60},${y-45})`);
  }
  function finish(e){
    if(!drag || (e.pointerId!=null && e.pointerId!==drag.pointerId)) return;
    const g=drag.g;
    if(g){g.classList.remove('moving');g.style.cursor='grab';select(g);}
    if(drag.moved && g) state.textContent='MOVED • '+(g.dataset.ref||g.dataset.name||'COMPONENT');
    drag=null;
  }
  window.addEventListener('pointermove',move,{capture:true,passive:false});
  window.addEventListener('pointerup',finish,true);
  window.addEventListener('pointercancel',finish,true);
})();
