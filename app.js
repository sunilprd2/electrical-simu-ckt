const sheet=document.getElementById('sheet'), sim=document.getElementById('sim'), state=document.getElementById('state'), motorState=document.getElementById('motorState');
let running=false;

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
 const s='#e9f1ed';
 const common=`stroke="${s}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
 const text=(t)=>`<text x="24" y="28" text-anchor="middle" font-size="10" fill="${s}" font-family="Arial" font-weight="700">${t}</text>`;
 let body='';
 if(['pe','gnd'].includes(type)) body='<line x1="24" y1="3" x2="24" y2="14"/><line x1="14" y1="14" x2="34" y2="14"/><line x1="17" y1="18" x2="31" y2="18"/><line x1="20" y1="22" x2="28" y2="22"/>';
 else if(['dc-','dc+','n','l1','l2','l3'].includes(type)) body=`<circle cx="24" cy="15" r="11" ${common}/>${text(type==='dc-'?'−':type==='dc+'?'+':type.toUpperCase())}`;
 else if(['mcb','1pmcb','2pmcb','3pmcb','4pmcb','1pmccb','3pmccb','4pmccb','disconnect','isolator','acb','mccb','mpcb','elcb','rcbo','1pnmcb','dcmcb'].includes(type)) body=`<line x1="24" y1="2" x2="24" y2="9" ${common}/><line x1="24" y1="21" x2="24" y2="29" ${common}/><line x1="17" y1="9" x2="29" y2="21" ${common}/>`;
 else if(['fuse','hrc','fuseswitch','spd','thermal','magtrip'].includes(type)) body=`<line x1="24" y1="2" x2="24" y2="8" ${common}/><rect x="16" y="8" width="16" height="14" ${common}/><line x1="24" y1="22" x2="24" y2="29" ${common}/>`;
 else if(['3pcont','4pcont','contaux','reverse','contimer','stardelta','latchcont','contactor'].includes(type)) body=`<rect x="14" y="8" width="20" height="14" ${common}/>${text('KM')}<line x1="24" y1="2" x2="24" y2="8" ${common}/><line x1="24" y1="22" x2="24" y2="29" ${common}/>`;
 else if(['coil','relaycoil','powerrelay','interpose','latchrelay','ssr','reed','safetyrelay'].includes(type)) body=`<rect x="15" y="8" width="18" height="14" ${common}/>${text(type==='coil'?'KM':'K')}<line x1="24" y1="2" x2="24" y2="8" ${common}/><line x1="24" y1="22" x2="24" y2="29" ${common}/>`;
 else if(['no','auxno','mainno','relayno','start','limitno','foot','pressure','temperature','float','hand','twinnc','twinno','tdno','tdnc','offno','offnc','auxfront','auxside','change','changeover','mainnc','auxnc','relaync','stop','estop','limitnc'].includes(type)) { const nc=['nc','auxnc','mainnc','relaync','stop','estop','limitnc','tdnc','offnc','twinnc'].includes(type); body=`<line x1="8" y1="15" x2="18" y2="15" ${common}/><line x1="30" y1="15" x2="40" y2="15" ${common}/><line x1="18" y1="15" x2="29" y2="8" ${common}/>${nc?'<line x1="17" y1="7" x2="31" y2="22" '+common+'/>':''}`; }
 else if(['motor3','motor1','motorDC','twospeed','motorsd','brake','gear'].includes(type)) body=`<line x1="24" y1="2" x2="24" y2="5" ${common}/><circle cx="24" cy="16" r="11" ${common}/>${text(type==='motor3'?'M3~':type==='motor1'?'M1~':'M')}`;
 else if(['lamp','led','tower','pilot','buzzer','siren'].includes(type)) body=`<circle cx="24" cy="16" r="10" ${common}/><line x1="18" y1="10" x2="30" y2="22" ${common}/><line x1="30" y1="10" x2="18" y2="22" ${common}/>`;
 else if(['ammeter','voltmeter','freq','kw','kwh','hour','multimeter'].includes(type)) body=`<circle cx="24" cy="16" r="11" ${common}/>${text(type==='ammeter'?'A':type==='voltmeter'?'V':type==='freq'?'Hz':type==='kw'?'kW':type==='kwh'?'kWh':type==='hour'?'h':'M')}`;
 else if(['ton','tof','multitimer','timernc','timerno','stimer','flasher','cyclic','stair','analogtimer','digitaltimer','programmable','counter'].includes(type)) body=`<rect x="12" y="7" width="24" height="18" ${common}/>${text(type==='ton'?'TON':type==='tof'?'TOF':'KT')}`;
 else if(['plc','di','do','ai','ao','relayout','rs485','ethernet','profinet','terminalmodule','iomodule','plcpower','expansion'].includes(type)) body=`<rect x="9" y="6" width="30" height="20" ${common}/>${text(type==='plc'?'PLC':type.toUpperCase())}`;
 else if(['tr1','tr3','gen3','3p','psu'].includes(type)) body=`<circle cx="18" cy="16" r="7" ${common}/><circle cx="30" cy="16" r="7" ${common}/>`;
 else if(['prox','capsensor','photo','ultra','limitsensor','pt100','presssensor','flow','level','speed','encoder','current','voltage'].includes(type)) body=`<rect x="13" y="7" width="22" height="18" ${common}/>${text(type==='pt100'?'PT100':type==='encoder'?'ENC':type==='current'?'I':type==='voltage'?'U':'S')}`;
 else if(['terminal','terminalblock','cross','junction','crossconn','crossnc','entry','cable','shield','ferrule','plug','test','connector'].includes(type)) body=`<line x1="5" y1="16" x2="43" y2="16" ${common}/><circle cx="24" cy="16" r="4" ${common}/>`;
 else body=`<rect x="13" y="7" width="22" height="18" ${common}/>${text('IEC')}`;
 return `<svg viewBox="0 0 48 32" aria-hidden="true">${body}</svg>`;
}

const lib=document.getElementById('libraryGroups');
function renderLibrary(){
 lib.innerHTML=groups.map((g,gi)=>`<section class="cat ${gi===0?'open':''}" data-group="${g.name}"><button class="cat-head" style="--accent:${g.color}"><span class="folder">▰</span><b>${g.name}</b><small>${g.items.length}</small><i>${gi===0?'⌃':'⌄'}</i></button><div class="cat-body">${g.items.map(([type,name])=>`<button class="symbol-btn" draggable="true" data-symbol="${type}" data-name="${name}" title="${name}">${icon(type)}<label>${name}</label></button>`).join('')}</div></section>`).join('');
 document.querySelectorAll('.cat-head').forEach(head=>head.addEventListener('click',()=>{const cat=head.parentElement;cat.classList.toggle('open');head.querySelector('i').textContent=cat.classList.contains('open')?'⌃':'⌄'}));
 document.querySelectorAll('.symbol-btn').forEach(b=>{
  b.addEventListener('click',()=>{state.textContent='ADD '+b.dataset.name.toUpperCase()+' • drag into schematic';});
  b.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',JSON.stringify({type:b.dataset.symbol,name:b.dataset.name}));state.textContent='DROP '+b.dataset.name.toUpperCase()+' ON SCHEMATIC';});
 });
}
renderLibrary();

function render(){document.body.classList.toggle('live',running);sim.textContent=running?'● RUNNING':'● STOPPED';sim.classList.toggle('running',running);motorState.textContent=running?'Motor: RUNNING':'Motor: OFF';state.textContent=running?'SIMULATION • LIVE':'READY • 2D SCHEMATIC';}
document.getElementById('play').onclick=()=>{running=true;render()};
document.getElementById('stop').onclick=()=>{running=false;render()};
document.getElementById('threeD').onclick=()=>alert('3D view will use the same IEC circuit model as this 2D schematic.');
document.getElementById('delete').onclick=()=>alert('Select a component, then Delete. Full editor tools are being added in the next build.');

document.getElementById('search').addEventListener('input',e=>{const q=e.target.value.toLowerCase().trim();document.querySelectorAll('.library .cat').forEach(s=>{const match=s.textContent.toLowerCase().includes(q);s.style.display=match?'block':'none';if(q&&match){s.classList.add('open');s.querySelector('.cat-head i').textContent='⌃'}})});

// Basic drop placement: creates a compact SVG label on the sheet without changing the demo circuit.
sheet.addEventListener('dragover',e=>e.preventDefault());
sheet.addEventListener('drop',e=>{
 e.preventDefault(); const raw=e.dataTransfer.getData('text/plain'); if(!raw)return; let d; try{d=JSON.parse(raw)}catch{return;}
 const r=sheet.getBoundingClientRect(); const x=Math.max(20,Math.min(1150,e.clientX-r.left)); const y=Math.max(50,Math.min(700,e.clientY-r.top));
 const svg=document.getElementById('schematic'); const NS='http://www.w3.org/2000/svg'; const g=document.createElementNS(NS,'g'); g.setAttribute('class','dropped');
 const rect=document.createElementNS(NS,'rect'); rect.setAttribute('x',x-42);rect.setAttribute('y',y-23);rect.setAttribute('width',84);rect.setAttribute('height',46);rect.setAttribute('rx',4);rect.setAttribute('fill','#151c20');rect.setAttribute('stroke','#50f0a1');rect.setAttribute('stroke-width','1.5');
 const t=document.createElementNS(NS,'text');t.setAttribute('x',x);t.setAttribute('y',y+4);t.setAttribute('text-anchor','middle');t.setAttribute('fill','#e9f1ed');t.setAttribute('font-size','9');t.setAttribute('font-family','Arial');t.textContent=d.name.length>18?d.name.slice(0,18)+'…':d.name;
 const tag=document.createElementNS(NS,'text');tag.setAttribute('x',x);tag.setAttribute('y',y+16);tag.setAttribute('text-anchor','middle');tag.setAttribute('fill','#50f0a1');tag.setAttribute('font-size','8');tag.setAttribute('font-family','Arial');tag.textContent=d.type.toUpperCase();
 g.append(rect,t,tag);svg.appendChild(g);state.textContent='PLACED • '+d.name.toUpperCase();
});
render();
