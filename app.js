(function ensureStatusNodes(){
  if (!document.getElementById("state") || !document.getElementById("sim") || !document.getElementById("motorState")) {
    const f = document.createElement("footer");
    f.style.display = "none";
    f.setAttribute("aria-hidden", "true");
    ["sim", "state", "motorState"].forEach(id => {
      if (!document.getElementById(id)) {
        const s = document.createElement("span");
        s.id = id;
        f.appendChild(s);
      }
    });
    document.body.appendChild(f);
  }
})();
const sheet=document.getElementById('sheet'), sim=document.getElementById('sim'), state=document.getElementById('state'), motorState=document.getElementById('motorState');

/* IEC-style component library. Device designations follow common IEC/industrial practice.
   Exact reference designators can be overridden per project/component. */
const groups=[
 {name:'Power',color:'#00dba5',items:[]},
 {name:'Others',color:'#64748b',items:[]},
 {name:'Coils',color:'#8b5cf6',items:[]},
 {name:'Auxiliary Contacts',color:'#d4a017',items:[]},
 {name:'Switches',color:'#06b6d4',items:[]},
 {name:'Loads',color:'#f59e0b',items:[]},
 {name:'Main Contacts',color:'#10b981',items:[]},
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
 if(typeof syncComponentPorts==='function')syncComponentPorts(g);
 if(typeof refreshWiresForComponent==='function')refreshWiresForComponent(g);
 if(typeof syncConnectedPortStates==='function')syncConnectedPortStates();
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
 if(!wires.length){
  running=false;document.body.classList.remove('live');
  if(sim){sim.textContent='● OPEN CIRCUIT';sim.classList.remove('running');}
  if(motorState)motorState.textContent='Motor: OFF';
  if(state)state.textContent='OPEN CIRCUIT • CONNECT COMPONENT TERMINALS WITH WIRES FIRST';
  return;
 }
 const loadRx=/(pilot.?light|lamp|bulb|indicator|light.?source|coil|timer|motor|sensor|proximity|buzzer|siren|heater|contact)/i;
 const connectedIds=new Set(wires.flatMap(w=>[w.dataset.fromG,w.dataset.toG]).filter(Boolean));
 running=true;
 comps.forEach(g=>{
  if(connectedIds.has(g.dataset.uid) && loadRx.test((g.dataset.name||'')+' '+(g.dataset.type||''))){
   g.classList.add('device-on');
  }
 });
 // Phase 1 simulation colouring: colour each wire from the source terminal it touches.
 // RYB is intentionally fixed to L1=red, L2=yellow, L3=blue.
 const wireColourClasses=['wire-dc-positive','wire-dc-negative','wire-l1','wire-l2','wire-l3','wire-neutral'];
 const endpointInfo=(w,side)=>{
  const uid=w.dataset[side+'G'];
  const g=document.querySelector(`#dropLayer .dropped-symbol[data-uid="${uid}"]`);
  const label=String(w.dataset[side]||'').trim().toUpperCase();
  const componentText=((g?.dataset?.name||'')+' '+(g?.dataset?.type||'')).toUpperCase();
  return {label,componentText};
 };
 const classifyWire=w=>{
  const a=endpointInfo(w,'from'), b=endpointInfo(w,'to');
  const endpoints=[a,b];
  // Terminal names are authoritative; only colour by source terminals, not ordinary contact numbers.
  for(const e of endpoints){ if(/^L1$/.test(e.label)) return 'wire-l1'; }
  for(const e of endpoints){ if(/^L2$/.test(e.label)) return 'wire-l2'; }
  for(const e of endpoints){ if(/^L3$/.test(e.label)) return 'wire-l3'; }
  for(const e of endpoints){ if(/^(\+|POS|POSITIVE|DC\+|V\+)$/.test(e.label)) return 'wire-dc-positive'; }
  for(const e of endpoints){ if(/^(\-|−|NEG|NEGATIVE|DC-|V-)$/.test(e.label)) return 'wire-dc-negative'; }
  // Fallback for source components whose terminal labels are not explicit.
  for(const e of endpoints){
   if(/DC.*(POSITIVE|PLUS)|POSITIVE.*SUPPLY/.test(e.componentText)) return 'wire-dc-positive';
   if(/DC.*(NEGATIVE|MINUS)|NEGATIVE.*SUPPLY/.test(e.componentText)) return 'wire-dc-negative';
  }
  return '';
 };
 wires.forEach(w=>{
  w.classList.add('wire-live');
  w.classList.remove(...wireColourClasses);
  const colourClass=classifyWire(w);
  if(colourClass) w.classList.add(colourClass);
  // Keep legacy neutral styling only for neutral wires that aren't identified as DC negative.
  const ends=((w.dataset.from||'')+' '+(w.dataset.to||'')).toUpperCase();
  if(!colourClass && /(^|\s)N($|\s)|NEUTRAL/.test(ends)) w.classList.add('wire-neutral');
 });
 // Three-phase motor direction: phase sequence at U/V/W determines rotation.
 // L1(R)->U, L2(Y)->V, L3(B)->W is the reference clockwise sequence.
 const motorResults=[];
 const phaseForWire=w=>{
  if(w.classList.contains('wire-l1')) return 'R';
  if(w.classList.contains('wire-l2')) return 'Y';
  if(w.classList.contains('wire-l3')) return 'B';
  return '';
 };
 const terminalForMotorWire=(w,motor)=>{
  if(w.dataset.fromG===motor.dataset.uid) return String(w.dataset.from||'').trim().toUpperCase();
  if(w.dataset.toG===motor.dataset.uid) return String(w.dataset.to||'').trim().toUpperCase();
  return '';
 };
 comps.forEach(motor=>{
  const label=((motor.dataset.name||'')+' '+(motor.dataset.type||'')+' '+(motor.dataset.symbolFile||'')).toLowerCase();
  if(!/motor/.test(label)) return;
  motor.classList.remove('motor-rotating-cw','motor-rotating-ccw','motor-direction-unknown');
  const phaseAt={};
  wires.forEach(w=>{
   const term=terminalForMotorWire(w,motor);
   if(['U','V','W'].includes(term)){
    const phase=phaseForWire(w);
    if(phase) phaseAt[term]=phase;
   }
  });
  const sequence=[phaseAt.U,phaseAt.V,phaseAt.W];
  if(sequence.every(Boolean)){
   const signature=sequence.join('');
   // Cyclic phase permutations preserve direction; swapping any two phases reverses it.
   const cw=(signature==='RYB'||signature==='YBR'||signature==='BRY');
   const ccw=(signature==='RBY'||signature==='BYR'||signature==='YRB');
   if(cw) motor.classList.add('motor-rotating-cw');
   else if(ccw) motor.classList.add('motor-rotating-ccw');
   else motor.classList.add('motor-direction-unknown');
   motorResults.push(`${motor.dataset.ref||motor.dataset.name||'Motor'}: ${cw?'CLOCKWISE':ccw?'ANTICLOCKWISE':'PHASE SEQUENCE INVALID'}`);
  }else{
   motor.classList.add('motor-direction-unknown');
   motorResults.push(`${motor.dataset.ref||motor.dataset.name||'Motor'}: CHECK U/V/W PHASE CONNECTIONS`);
  }
 });
 render();
 if(motorResults.length && motorState) motorState.textContent='Motor: '+motorResults.join(' • ');
};
document.getElementById('stop').onclick=()=>{running=false;document.querySelectorAll('#dropLayer .device-on').forEach(g=>g.classList.remove('device-on'));document.querySelectorAll('#dropLayer .motor-rotating-cw, #dropLayer .motor-rotating-ccw, #dropLayer .motor-direction-unknown').forEach(g=>g.classList.remove('motor-rotating-cw','motor-rotating-ccw','motor-direction-unknown')); document.querySelectorAll('#wireLayer .connected-wire').forEach(w=>{w.classList.remove('wire-live','wire-dc-positive','wire-dc-negative','wire-l1','wire-l2','wire-l3','wire-neutral')});render()};
const _threeDBtn=document.getElementById('threeD');if(_threeDBtn)_threeDBtn.onclick=()=>alert('The 2D physical component view is the next workspace to build. Your existing SCHEMATIC workspace is unchanged.');
document.getElementById('delete').onclick=()=>{if(selected){selected.remove();selected=null;state.textContent='DELETED';}else state.textContent='CLICK A COMPONENT THEN PRESS DELETE';};

document.addEventListener('keydown',e=>{if(e.key==='Escape'){select(null);state.textContent='SELECTION CLEARED';return;}if(e.key==='Delete'&&selected){e.preventDefault();selected.remove();selected=null;state.textContent='DELETED';}});

document.getElementById('search').addEventListener('input',e=>{const q=e.target.value.toLowerCase().trim();document.querySelectorAll('#libraryGroups .component-category').forEach(btn=>{btn.style.display=btn.dataset.category.toLowerCase().includes(q)?'flex':'none';});const head=document.querySelector('#libraryGroups .component-results-head b');if(head)head.textContent=q?'FILTERED CATEGORIES':((document.querySelector('#libraryGroups .component-category.active')?.dataset.category||'ALL COMPONENTS').toUpperCase());});

function getPoint(e){try{const pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;const m=svg.getScreenCTM();if(m){const p=pt.matrixTransform(m.inverse());return{x:p.x,y:p.y};}}catch(_){}const r=svg.getBoundingClientRect(),vb=svg.viewBox.baseVal;return{x:vb.x+(e.clientX-r.left)*(vb.width/r.width),y:vb.y+(e.clientY-r.top)*(vb.height/r.height)};}
function nextReference(d){
 const s=((d&& (d.name||d.type))||'component').toLowerCase();
 let p='X';
 if(/contactor|main.?contact/.test(s))p='KM';
 else if(/aux.?contact|auxiliary/.test(s))p='K';
 else if(/overload|thermal/.test(s))p='F';
 else if(/breaker|mcb|fuse|isolator|protection/.test(s))p='Q';
 else if(/motor/.test(s))p='M';
 else if(/timer|delay/.test(s))p='KT';
 else if(/coil|relay/.test(s))p='K';
 else if(/push|button|emergency|selector|switch|limit/.test(s))p='S';
 else if(/pilot|lamp|led|indicator|beacon|bell|buzzer|light/.test(s))p='H';
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
function updateSelectionOutline(g){
 if(!g) return;
 const NS='http://www.w3.org/2000/svg';
 let outline=g.querySelector(':scope > .component-selection-outline');
 if(!outline){
  outline=document.createElementNS(NS,'rect');
  outline.setAttribute('class','component-selection-outline');
  outline.setAttribute('pointer-events','none');
  g.insertBefore(outline,g.firstChild);
 }
 // Calculate the visible artwork bounds in the parent component's coordinate system.
 // Ignore the transparent hit area, generic selection box, and reference tag.
 let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
 const add=(x,y,w,h)=>{
  if([x,y,w,h].every(Number.isFinite)){
   minX=Math.min(minX,x); minY=Math.min(minY,y);
   maxX=Math.max(maxX,x+w); maxY=Math.max(maxY,y+h);
  }
 };
 const inner=g.querySelector(':scope > svg');
 if(inner){
  const ix=Number(inner.getAttribute('x')||0);
  const iy=Number(inner.getAttribute('y')||0);
  const iw=Number(inner.getAttribute('width')||48);
  const ih=Number(inner.getAttribute('height')||32);
  const vb=(inner.getAttribute('viewBox')||'0 0 48 32').trim().split(/[ ,]+/).map(Number);
  const sx=vb.length===4&&vb[2] ? iw/vb[2] : 1;
  const sy=vb.length===4&&vb[3] ? ih/vb[3] : 1;
  for(const el of inner.querySelectorAll('path,line,circle,rect,polyline,polygon,text,ellipse,image')){
   try{
    const b=el.getBBox();
    add(ix+(b.x-(vb[0]||0))*sx,iy+(b.y-(vb[1]||0))*sy,b.width*sx,b.height*sy);
   }catch(_){}
  }
 }
 // Terminals are inside .component-ports in the current component layout.
 for(const port of g.querySelectorAll('.mag-port')){
  try{
   const b=port.getBBox();
   // Terminal geometry is positioned in the component group's coordinate system.
   add(b.x,b.y,b.width,b.height);
  }catch(_){}
 }
 if(!Number.isFinite(minX)){minX=15;minY=20;maxX=165;maxY=120;}
 const pad=2.5;
 outline.setAttribute('x',minX-pad);
 outline.setAttribute('y',minY-pad);
 outline.setAttribute('width',Math.max(1,maxX-minX+pad*2));
 outline.setAttribute('height',Math.max(1,maxY-minY+pad*2));
}
function select(g,openProperties=false){
 if(selected)selected.classList.remove('selected');
 selected=g;
 if(g){g.classList.add('selected');updateSelectionOutline(g);}
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

/* V7–V98: Unified IEC symbol terminal geometry, terminal selection, and wire connection engine */
const _oldIconV7 = icon;
const SVG_TERMINAL_CATALOG = {"earth_ground(1).svg":{"vb":[-31.72,59.15,442.45,471.95],"ports":[{"vx":191.5,"vy":126.82,"vw":20.5,"vh":17.35,"label":"PE","side":"top"}]},"earth_ground.svg":{"vb":[-31.72,59.15,442.45,471.95],"ports":[{"vx":191.5,"vy":126.82,"vw":20.5,"vh":17.35,"label":"PE","side":"top"}]},"earth_pe(1).svg":{"vb":[-25.5,57.33,435.0,464.0],"ports":[{"vx":191.51,"vy":449.8,"vw":17.51,"vh":16.96,"label":"PE","side":"bottom"}]},"earth_pe.svg":{"vb":[-25.5,57.33,435.0,464.0],"ports":[{"vx":191.51,"vy":449.8,"vw":17.51,"vh":16.96,"label":"PE","side":"bottom"}]},"source_dc_negative(1).svg":{"vb":[-16.5,52.84,435.0,464.0],"ports":[{"vx":200.51,"vy":446.6,"vw":17.51,"vh":17.1,"label":"NEG","side":"bottom"}]},"source_dc_negative.svg":{"vb":[-16.5,52.84,435.0,464.0],"ports":[{"vx":200.51,"vy":446.6,"vw":17.51,"vh":17.1,"label":"NEG","side":"bottom"}]},"source_dc_positive(1).svg":{"vb":[-24.5,52.85,435.0,464.0],"ports":[{"vx":192.51,"vy":447.46,"vw":17.51,"vh":17.2,"label":"POS","side":"bottom"}]},"source_dc_positive.svg":{"vb":[-24.5,52.85,435.0,464.0],"ports":[{"vx":192.51,"vy":447.46,"vw":17.51,"vh":17.2,"label":"POS","side":"bottom"}]},"source_dc_supply_pair(1).svg":{"vb":[83.0,50.41,435.0,464.0],"ports":[{"vx":200.51,"vy":442.09,"vw":17.51,"vh":16.89,"label":"+","side":"bottom"},{"vx":401.49,"vy":444.09,"vw":17.51,"vh":16.88,"label":"-","side":"bottom"}]},"source_dc_supply_pair.svg":{"vb":[83.0,50.41,435.0,464.0],"ports":[{"vx":200.51,"vy":442.09,"vw":17.51,"vh":16.89,"label":"+","side":"bottom"},{"vx":401.49,"vy":444.09,"vw":17.51,"vh":16.88,"label":"-","side":"bottom"}]},"terminal_l1_l2_l3(1).svg":{"vb":[9.88,51.92,579.24,464.0],"ports":[{"vx":99.5,"vy":443.82,"vw":17.51,"vh":17.02,"label":"L1","side":"bottom"},{"vx":301.49,"vy":446.88,"vw":17.51,"vh":17,"label":"L2","side":"bottom"},{"vx":499.49,"vy":446.88,"vw":17.51,"vh":17,"label":"L3","side":"bottom"}]},"terminal_l1_l2_l3.svg":{"vb":[9.88,51.92,579.24,464.0],"ports":[{"vx":99.5,"vy":443.82,"vw":17.51,"vh":17.02,"label":"L1","side":"bottom"},{"vx":301.49,"vy":446.88,"vw":17.51,"vh":17,"label":"L2","side":"bottom"},{"vx":499.49,"vy":446.88,"vw":17.51,"vh":17,"label":"L3","side":"bottom"}]},"terminal_l1_l2_l3_n(1).svg":{"vb":[9.88,52.41,778.24,464.0],"ports":[{"vx":99.5,"vy":446.88,"vw":17.51,"vh":16.96,"label":"L1","side":"bottom"},{"vx":300.49,"vy":448.06,"vw":17.51,"vh":16.96,"label":"L2","side":"bottom"},{"vx":499.49,"vy":445.94,"vw":17.51,"vh":16.96,"label":"L3","side":"bottom"},{"vx":699.49,"vy":443.94,"vw":17.51,"vh":16.96,"label":"N","side":"bottom"}]},"terminal_l1_l2_l3_n.svg":{"vb":[9.88,52.41,778.24,464.0],"ports":[{"vx":99.5,"vy":446.88,"vw":17.51,"vh":16.96,"label":"L1","side":"bottom"},{"vx":300.49,"vy":448.06,"vw":17.51,"vh":16.96,"label":"L2","side":"bottom"},{"vx":499.49,"vy":445.94,"vw":17.51,"vh":16.96,"label":"L3","side":"bottom"},{"vx":699.49,"vy":443.94,"vw":17.51,"vh":16.96,"label":"N","side":"bottom"}]},"terminal_neutral_n(1).svg":{"vb":[-24.5,55.34,435.0,464.0],"ports":[{"vx":192.51,"vy":447.81,"vw":17.51,"vh":16.97,"label":"N","side":"bottom"}]},"terminal_neutral_n.svg":{"vb":[-24.5,55.34,435.0,464.0],"ports":[{"vx":192.51,"vy":447.81,"vw":17.51,"vh":16.97,"label":"N","side":"bottom"}]},"terminal_phase_l(1).svg":{"vb":[-25.5,54.83,435.0,464.0],"ports":[{"vx":191.51,"vy":446.88,"vw":17.51,"vh":16.92,"label":"L","side":"bottom"}]},"terminal_phase_l.svg":{"vb":[-25.5,54.83,435.0,464.0],"ports":[{"vx":191.51,"vy":446.88,"vw":17.51,"vh":16.92,"label":"L","side":"bottom"}]},"coil_contactor.svg":{"vb":[90.5,1.21,435.0,464.0],"ports":[{"vx":308.34,"vy":96.35,"vw":17.75,"vh":16.8,"label":"A1","side":"top"},{"vx":309.01,"vy":370.07,"vw":17.75,"vh":16.8,"label":"A2","side":"bottom"}]},"coil_tof_timer.svg":{"vb":[86.01,80.21,435.0,464.0],"ports":[{"vx":309.01,"vy":180.29,"vw":17.51,"vh":16.76,"label":"A1","side":"top"},{"vx":310.01,"vy":444.13,"vw":17.51,"vh":16.76,"label":"A2","side":"bottom"}]},"coil_ton_timer.svg":{"vb":[81.1,302.76,435.0,464.0],"ports":[{"vx":305.01,"vy":399.81,"vw":17.51,"vh":16.8,"label":"A1","side":"top"},{"vx":304.9,"vy":669.72,"vw":17.51,"vh":16.8,"label":"A2","side":"bottom"}]},"coil_ton_tof_timer.svg":{"vb":[474.5,235.2,435.0,464.0],"ports":[{"vx":689,"vy":330.39,"vw":17.51,"vh":16.8,"label":"A1","side":"top"},{"vx":689,"vy":604.02,"vw":17.51,"vh":16.8,"label":"A2","side":"bottom"}]},"aux_contacts_nc.svg":{"vb":[1.26,53.65,435.0,464.0],"ports":[{"vx":192.01,"vy":121.32,"vw":17.51,"vh":16.85,"label":"21","side":"top"},{"vx":192.01,"vy":449.99,"vw":17.51,"vh":16.85,"label":"22","side":"bottom"}]},"aux_contacts_no.svg":{"vb":[-42.12,152.72,435.0,464.0],"ports":[{"vx":194.01,"vy":219.57,"vw":17.51,"vh":16.94,"label":"13","side":"top"},{"vx":194.01,"vy":549.86,"vw":17.51,"vh":16.94,"label":"14","side":"bottom"}]},"aux_contacts_off_delay_nc.svg":{"vb":[-71.16,53.22,435.0,464.0],"ports":[{"vx":195.01,"vy":120.5,"vw":17.51,"vh":16.89,"label":"65","side":"top"},{"vx":195.01,"vy":449.93,"vw":17.51,"vh":16.89,"label":"66","side":"bottom"}]},"aux_contacts_off_delay_no.svg":{"vb":[-93.15,48.13,435.16,464.17],"ports":[{"vx":196.01,"vy":114.64,"vw":17.51,"vh":16.98,"label":"67","side":"top"},{"vx":196.01,"vy":445.79,"vw":17.51,"vh":16.98,"label":"68","side":"bottom"}]},"aux_contacts_on_delay_nc.svg":{"vb":[-58.7,53.22,435.0,464.0],"ports":[{"vx":195.01,"vy":120.5,"vw":17.51,"vh":16.89,"label":"55","side":"top"},{"vx":195.01,"vy":449.93,"vw":17.51,"vh":16.89,"label":"56","side":"bottom"}]},"aux_contacts_on_delay_no.svg":{"vb":[-33.82,54.22,435.0,464.0],"ports":[{"vx":243.01,"vy":121.5,"vw":17.51,"vh":16.89,"label":"57","side":"top"},{"vx":243.01,"vy":450.93,"vw":17.51,"vh":16.89,"label":"58","side":"bottom"}]},"switch_3_position_selector i-0-ii(1).svg":{"vb":[90.55,57.13,435.16,464.17],"ports":[{"vx":332.01,"vy":123.64,"vw":17.51,"vh":16.98,"label":"11","side":"top"},{"vx":241.51,"vy":454.79,"vw":17.51,"vh":16.98,"label":"12","side":"bottom"},{"vx":422.51,"vy":454.79,"vw":17.51,"vh":16.98,"label":"14","side":"bottom"}]},"switch_3_position_selector i-0-ii.svg":{"vb":[90.55,57.13,435.16,464.17],"ports":[{"vx":332.01,"vy":123.64,"vw":17.51,"vh":16.98,"label":"11","side":"top"},{"vx":241.51,"vy":454.79,"vw":17.51,"vh":16.98,"label":"12","side":"bottom"},{"vx":422.51,"vy":454.79,"vw":17.51,"vh":16.98,"label":"14","side":"bottom"}]},"switch_3_position_selector i-ii-iii(1).svg":{"vb":[112.17,52.65,533.22,469.12],"ports":[{"vx":398.01,"vy":119.85,"vw":17.51,"vh":17.11,"label":"11","side":"top"},{"vx":199.31,"vy":453.58,"vw":17.51,"vh":17.11,"label":"12","side":"bottom"},{"vx":398.01,"vy":453.58,"vw":17.51,"vh":17.11,"label":"14","side":"bottom"},{"vx":599.1,"vy":454.57,"vw":17.51,"vh":17.11,"label":"16","side":"bottom"}]},"switch_3_position_selector i-ii-iii.svg":{"vb":[112.17,52.65,533.22,469.12],"ports":[{"vx":398.01,"vy":119.85,"vw":17.51,"vh":17.11,"label":"11","side":"top"},{"vx":199.31,"vy":453.58,"vw":17.51,"vh":17.11,"label":"12","side":"bottom"},{"vx":398.01,"vy":453.58,"vw":17.51,"vh":17.11,"label":"14","side":"bottom"},{"vx":599.1,"vy":454.57,"vw":17.51,"vh":17.11,"label":"16","side":"bottom"}]},"switch_con(1).svg":{"vb":[-40.76,45.0,435.38,464.4],"ports":[{"vx":196.01,"vy":111.5,"vw":17.51,"vh":16.89,"label":"11","side":"top"},{"vx":101.3,"vy":442.91,"vw":17.51,"vh":16.89,"label":"12","side":"bottom"},{"vx":300.71,"vy":439.93,"vw":17.51,"vh":16.89,"label":"14","side":"bottom"}]},"switch_con.svg":{"vb":[-40.76,45.0,435.38,464.4],"ports":[{"vx":196.01,"vy":111.5,"vw":17.51,"vh":16.89,"label":"11","side":"top"},{"vx":101.3,"vy":442.91,"vw":17.51,"vh":16.89,"label":"12","side":"bottom"},{"vx":300.71,"vy":439.93,"vw":17.51,"vh":16.89,"label":"14","side":"bottom"}]},"switch_nc(1).svg":{"vb":[-58.0,53.71,435.0,464.0],"ports":[{"vx":191.01,"vy":122.29,"vw":17.51,"vh":16.76,"label":"11","side":"top"},{"vx":191.01,"vy":449.13,"vw":17.51,"vh":16.76,"label":"12","side":"bottom"}]},"switch_nc.svg":{"vb":[-58.0,53.71,435.0,464.0],"ports":[{"vx":191.01,"vy":122.29,"vw":17.51,"vh":16.76,"label":"11","side":"top"},{"vx":191.01,"vy":449.13,"vw":17.51,"vh":16.76,"label":"12","side":"bottom"}]},"switch_no(1).svg":{"vb":[-70.5,2.88,448.76,478.68],"ports":[{"vx":225.01,"vy":71.46,"vw":17.51,"vh":17.51,"label":"13","side":"top"},{"vx":225.01,"vy":412.96,"vw":17.51,"vh":17.51,"label":"14","side":"bottom"}]},"switch_no.svg":{"vb":[-70.5,2.88,448.76,478.68],"ports":[{"vx":225.01,"vy":71.46,"vw":17.51,"vh":17.51,"label":"13","side":"top"},{"vx":225.01,"vy":412.96,"vw":17.51,"vh":17.51,"label":"14","side":"bottom"}]},"switch_pushbutton_con(1).svg":{"vb":[-31.65,2.88,448.76,478.68],"ports":[{"vx":200.01,"vy":71.46,"vw":17.51,"vh":17.51,"label":"11","side":"top"},{"vx":101.3,"vy":412.96,"vw":17.51,"vh":17.51,"label":"12","side":"bottom"},{"vx":297.71,"vy":412.96,"vw":17.51,"vh":17.51,"label":"14","side":"bottom"}]},"switch_pushbutton_con.svg":{"vb":[-31.65,2.88,448.76,478.68],"ports":[{"vx":200.01,"vy":71.46,"vw":17.51,"vh":17.51,"label":"11","side":"top"},{"vx":101.3,"vy":412.96,"vw":17.51,"vh":17.51,"label":"12","side":"bottom"},{"vx":297.71,"vy":412.96,"vw":17.51,"vh":17.51,"label":"14","side":"bottom"}]},"switch_pushbutton_nc(1).svg":{"vb":[-27.38,2.88,448.76,478.68],"ports":[{"vx":225.01,"vy":71.46,"vw":17.51,"vh":17.51,"label":"11","side":"top"},{"vx":225.01,"vy":412.96,"vw":17.51,"vh":17.51,"label":"12","side":"bottom"}]},"switch_pushbutton_nc.svg":{"vb":[-27.38,2.88,448.76,478.68],"ports":[{"vx":225.01,"vy":71.46,"vw":17.51,"vh":17.51,"label":"11","side":"top"},{"vx":225.01,"vy":412.96,"vw":17.51,"vh":17.51,"label":"12","side":"bottom"}]},"switch_pushbutton_no(1).svg":{"vb":[-55.0,2.88,448.76,478.68],"ports":[{"vx":225.01,"vy":71.46,"vw":17.51,"vh":17.51,"label":"13","side":"top"},{"vx":225.01,"vy":412.96,"vw":17.51,"vh":17.51,"label":"14","side":"bottom"}]},"switch_pushbutton_no.svg":{"vb":[-55.0,2.88,448.76,478.68],"ports":[{"vx":225.01,"vy":71.46,"vw":17.51,"vh":17.51,"label":"13","side":"top"},{"vx":225.01,"vy":412.96,"vw":17.51,"vh":17.51,"label":"14","side":"bottom"}]},"load_beacon(2).svg":{"vb":[10.59,-3.78,435.0,464.0],"ports":[{"vx":228.95,"vy":87.56,"vw":23.11,"vh":16.78,"label":"X1","side":"top"},{"vx":228.95,"vy":368.87,"vw":23.11,"vh":16.78,"label":"X2","side":"bottom"}]},"load_beacon.svg":{"vb":[10.59,-3.78,435.0,464.0],"ports":[{"vx":228.95,"vy":87.56,"vw":23.11,"vh":16.78,"label":"X1","side":"top"},{"vx":228.95,"vy":368.87,"vw":23.11,"vh":16.78,"label":"X2","side":"bottom"}]},"load_bell(2).svg":{"vb":[134.66,-1.79,435.0,464.0],"ports":[{"vx":303.15,"vy":91.49,"vw":17.65,"vh":14.23,"label":"X1","side":"top"},{"vx":303.15,"vy":368.94,"vw":17.65,"vh":14.23,"label":"X2","side":"bottom"}]},"load_bell.svg":{"vb":[134.66,-1.79,435.0,464.0],"ports":[{"vx":303.15,"vy":91.49,"vw":17.65,"vh":14.23,"label":"X1","side":"top"},{"vx":303.15,"vy":368.94,"vw":17.65,"vh":14.23,"label":"X2","side":"bottom"}]},"load_blinking_pilot_lamp(2).svg":{"vb":[191.49,78.7,435.0,464.0],"ports":[{"vx":385.37,"vy":176.16,"vw":17.6,"vh":16.67,"label":"X1","side":"top"},{"vx":385.35,"vy":445.26,"vw":17.57,"vh":16.66,"label":"X2","side":"bottom"}]},"load_blinking_pilot_lamp.svg":{"vb":[191.49,78.7,435.0,464.0],"ports":[{"vx":385.37,"vy":176.16,"vw":17.6,"vh":16.67,"label":"X1","side":"top"},{"vx":385.35,"vy":445.26,"vw":17.57,"vh":16.66,"label":"X2","side":"bottom"}]},"load_buzzer(2).svg":{"vb":[364.91,78.7,435.0,464.0],"ports":[{"vx":538.16,"vy":172.42,"vw":17.66,"vh":14.18,"label":"X1","side":"top"},{"vx":538.16,"vy":448.98,"vw":17.66,"vh":14.18,"label":"X2","side":"bottom"}]},"load_buzzer.svg":{"vb":[364.91,78.7,435.0,464.0],"ports":[{"vx":538.16,"vy":172.42,"vw":17.66,"vh":14.18,"label":"X1","side":"top"},{"vx":538.16,"vy":448.98,"vw":17.66,"vh":14.18,"label":"X2","side":"bottom"}]},"load_light(2).svg":{"vb":[166.5,155.71,435.0,464.0],"ports":[{"vx":384.01,"vy":255.22,"vw":17.51,"vh":16.71,"label":"X1","side":"top"},{"vx":384.01,"vy":520.2,"vw":17.51,"vh":16.71,"label":"X2","side":"bottom"}]},"load_light.svg":{"vb":[166.5,155.71,435.0,464.0],"ports":[{"vx":384.01,"vy":255.22,"vw":17.51,"vh":16.71,"label":"X1","side":"top"},{"vx":384.01,"vy":520.2,"vw":17.51,"vh":16.71,"label":"X2","side":"bottom"}]},"main_contacts_1p_no(1).svg":{"vb":[74.93,4.24,435.0,464.0],"ports":[{"vx":309.01,"vy":97.13,"vw":17.51,"vh":14.26,"label":"1","side":"top"},{"vx":309.01,"vy":375.33,"vw":17.51,"vh":14.26,"label":"2","side":"bottom"}]},"main_contacts_1p_no.svg":{"vb":[74.93,4.24,435.0,464.0],"ports":[{"vx":309.01,"vy":97.13,"vw":17.51,"vh":14.26,"label":"1","side":"top"},{"vx":309.01,"vy":375.33,"vw":17.51,"vh":14.26,"label":"2","side":"bottom"}]},"main_contacts_2p_no(1).svg":{"vb":[-44.12,2.22,435.0,464.0],"ports":[{"vx":94.26,"vy":97.1,"vw":17.51,"vh":14.06,"label":"1","side":"top"},{"vx":273.76,"vy":97.1,"vw":17.51,"vh":14.06,"label":"3","side":"top"},{"vx":94.26,"vy":371.33,"vw":17.51,"vh":14.06,"label":"2","side":"bottom"},{"vx":273.76,"vy":371.33,"vw":17.51,"vh":14.06,"label":"4","side":"bottom"}]},"main_contacts_2p_no.svg":{"vb":[-44.12,2.22,435.0,464.0],"ports":[{"vx":94.26,"vy":97.1,"vw":17.51,"vh":14.06,"label":"1","side":"top"},{"vx":273.76,"vy":97.1,"vw":17.51,"vh":14.06,"label":"3","side":"top"},{"vx":94.26,"vy":371.33,"vw":17.51,"vh":14.06,"label":"2","side":"bottom"},{"vx":273.76,"vy":371.33,"vw":17.51,"vh":14.06,"label":"4","side":"bottom"}]},"main_contacts_3p_no(1).svg":{"vb":[-6.0,29.21,453.76,484.01],"ports":[{"vx":78.5,"vy":102.46,"vw":17.51,"vh":17.51,"label":"1","side":"top"},{"vx":232.01,"vy":99.46,"vw":17.51,"vh":17.51,"label":"3","side":"top"},{"vx":384.51,"vy":98.46,"vw":17.51,"vh":17.51,"label":"5","side":"top"},{"vx":78.5,"vy":443.97,"vw":17.51,"vh":17.51,"label":"2","side":"bottom"},{"vx":231.01,"vy":439.97,"vw":17.51,"vh":17.51,"label":"4","side":"bottom"},{"vx":384.51,"vy":439.97,"vw":17.51,"vh":17.51,"label":"6","side":"bottom"}]},"main_contacts_3p_no.svg":{"vb":[-6.0,29.21,453.76,484.01],"ports":[{"vx":78.5,"vy":102.46,"vw":17.51,"vh":17.51,"label":"1","side":"top"},{"vx":232.01,"vy":99.46,"vw":17.51,"vh":17.51,"label":"3","side":"top"},{"vx":384.51,"vy":98.46,"vw":17.51,"vh":17.51,"label":"5","side":"top"},{"vx":78.5,"vy":443.97,"vw":17.51,"vh":17.51,"label":"2","side":"bottom"},{"vx":231.01,"vy":439.97,"vw":17.51,"vh":17.51,"label":"4","side":"bottom"},{"vx":384.51,"vy":439.97,"vw":17.51,"vh":17.51,"label":"6","side":"bottom"}]},"protection_circuit_breaker_1p(1).svg":{"vb":[-38.92,54.81,437.55,466.72],"ports":[{"vx":195.01,"vy":121.68,"vw":17.51,"vh":17.07,"label":"1","side":"top"},{"vx":195.01,"vy":454.65,"vw":17.51,"vh":17.07,"label":"2","side":"bottom"}]},"protection_circuit_breaker_1p.svg":{"vb":[-38.92,54.81,437.55,466.72],"ports":[{"vx":195.01,"vy":121.68,"vw":17.51,"vh":17.07,"label":"1","side":"top"},{"vx":195.01,"vy":454.65,"vw":17.51,"vh":17.07,"label":"2","side":"bottom"}]},"protection_circuit_breaker_2p(1).svg":{"vb":[-32.78,52.04,436.27,465.35],"ports":[{"vx":100.25,"vy":118.71,"vw":17.51,"vh":17,"label":"1","side":"top"},{"vx":300.76,"vy":118.71,"vw":17.51,"vh":17,"label":"3","side":"top"},{"vx":100.25,"vy":450.72,"vw":17.51,"vh":17,"label":"2","side":"bottom"},{"vx":300.76,"vy":450.72,"vw":17.51,"vh":17,"label":"4","side":"bottom"}]},"protection_circuit_breaker_2p.svg":{"vb":[-32.78,52.04,436.27,465.35],"ports":[{"vx":100.25,"vy":118.71,"vw":17.51,"vh":17,"label":"1","side":"top"},{"vx":300.76,"vy":118.71,"vw":17.51,"vh":17,"label":"3","side":"top"},{"vx":100.25,"vy":450.72,"vw":17.51,"vh":17,"label":"2","side":"bottom"},{"vx":300.76,"vy":450.72,"vw":17.51,"vh":17,"label":"4","side":"bottom"}]},"protection_circuit_breaker_3p(1).svg":{"vb":[21.47,50.73,527.77,467.95],"ports":[{"vx":100.5,"vy":118.77,"vw":17.51,"vh":17.07,"label":"1","side":"top"},{"vx":301.01,"vy":117.77,"vw":17.51,"vh":17.07,"label":"3","side":"top"},{"vx":500.51,"vy":118.77,"vw":17.51,"vh":17.07,"label":"5","side":"top"},{"vx":100.5,"vy":451.65,"vw":17.51,"vh":17.07,"label":"2","side":"bottom"},{"vx":301.01,"vy":450.65,"vw":17.51,"vh":17.07,"label":"4","side":"bottom"},{"vx":500.51,"vy":451.65,"vw":17.51,"vh":17.07,"label":"6","side":"bottom"}]},"protection_circuit_breaker_3p.svg":{"vb":[21.47,50.73,527.77,467.95],"ports":[{"vx":100.5,"vy":118.77,"vw":17.51,"vh":17.07,"label":"1","side":"top"},{"vx":301.01,"vy":117.77,"vw":17.51,"vh":17.07,"label":"3","side":"top"},{"vx":500.51,"vy":118.77,"vw":17.51,"vh":17.07,"label":"5","side":"top"},{"vx":100.5,"vy":451.65,"vw":17.51,"vh":17.07,"label":"2","side":"bottom"},{"vx":301.01,"vy":450.65,"vw":17.51,"vh":17.07,"label":"4","side":"bottom"},{"vx":500.51,"vy":451.65,"vw":17.51,"vh":17.07,"label":"6","side":"bottom"}]},"protection_fuse_1p(1).svg":{"vb":[5.5,53.22,435.0,464.0],"ports":[{"vx":223.01,"vy":120.5,"vw":17.51,"vh":16.89,"label":"1","side":"top"},{"vx":223.01,"vy":449.93,"vw":17.51,"vh":16.89,"label":"2","side":"bottom"}]},"protection_fuse_1p.svg":{"vb":[5.5,53.22,435.0,464.0],"ports":[{"vx":223.01,"vy":120.5,"vw":17.51,"vh":16.89,"label":"1","side":"top"},{"vx":223.01,"vy":449.93,"vw":17.51,"vh":16.89,"label":"2","side":"bottom"}]},"protection_fuse_2p(1).svg":{"vb":[-23.38,0.88,448.76,478.68],"ports":[{"vx":102.31,"vy":69.47,"vw":17.51,"vh":17.51,"label":"1","side":"top"},{"vx":299.71,"vy":69.47,"vw":17.51,"vh":17.51,"label":"3","side":"top"},{"vx":102.31,"vy":410.97,"vw":17.51,"vh":17.51,"label":"2","side":"bottom"},{"vx":299.71,"vy":410.97,"vw":17.51,"vh":17.51,"label":"4","side":"bottom"}]},"protection_fuse_2p.svg":{"vb":[-23.38,0.88,448.76,478.68],"ports":[{"vx":102.31,"vy":69.47,"vw":17.51,"vh":17.51,"label":"1","side":"top"},{"vx":299.71,"vy":69.47,"vw":17.51,"vh":17.51,"label":"3","side":"top"},{"vx":102.31,"vy":410.97,"vw":17.51,"vh":17.51,"label":"2","side":"bottom"},{"vx":299.71,"vy":410.97,"vw":17.51,"vh":17.51,"label":"4","side":"bottom"}]},"protection_fuse_3p(1).svg":{"vb":[36.25,52.79,528.49,466.83],"ports":[{"vx":100.5,"vy":121.63,"vw":17.51,"vh":16.97,"label":"1","side":"top"},{"vx":299.01,"vy":121.63,"vw":17.51,"vh":16.97,"label":"3","side":"top"},{"vx":500.51,"vy":119.63,"vw":17.51,"vh":16.97,"label":"5","side":"top"},{"vx":100.5,"vy":452.79,"vw":17.51,"vh":16.97,"label":"2","side":"bottom"},{"vx":299.01,"vy":452.79,"vw":17.51,"vh":16.97,"label":"4","side":"bottom"},{"vx":500.51,"vy":450.79,"vw":17.51,"vh":16.97,"label":"6","side":"bottom"}]},"protection_fuse_3p.svg":{"vb":[36.25,52.79,528.49,466.83],"ports":[{"vx":100.5,"vy":121.63,"vw":17.51,"vh":16.97,"label":"1","side":"top"},{"vx":299.01,"vy":121.63,"vw":17.51,"vh":16.97,"label":"3","side":"top"},{"vx":500.51,"vy":119.63,"vw":17.51,"vh":16.97,"label":"5","side":"top"},{"vx":100.5,"vy":452.79,"vw":17.51,"vh":16.97,"label":"2","side":"bottom"},{"vx":299.01,"vy":452.79,"vw":17.51,"vh":16.97,"label":"4","side":"bottom"},{"vx":500.51,"vy":450.79,"vw":17.51,"vh":16.97,"label":"6","side":"bottom"}]},"protection_fuse_4p(1).svg":{"vb":[35.79,51.63,727.93,466.41],"ports":[{"vx":100,"vy":118.42,"vw":17.51,"vh":16.99,"label":"1","side":"top"},{"vx":299.36,"vy":119.42,"vw":17.51,"vh":16.99,"label":"3","side":"top"},{"vx":501.01,"vy":118.42,"vw":17.51,"vh":16.99,"label":"5","side":"top"},{"vx":699.5,"vy":118.42,"vw":17.51,"vh":16.99,"label":"7","side":"top"},{"vx":100,"vy":450.25,"vw":17.51,"vh":16.99,"label":"2","side":"bottom"},{"vx":299.36,"vy":451.25,"vw":17.51,"vh":16.99,"label":"4","side":"bottom"},{"vx":501.01,"vy":450.25,"vw":17.51,"vh":16.99,"label":"6","side":"bottom"},{"vx":699.5,"vy":450.25,"vw":17.51,"vh":16.99,"label":"8","side":"bottom"}]},"protection_fuse_4p.svg":{"vb":[35.79,51.63,727.93,466.41],"ports":[{"vx":100,"vy":118.42,"vw":17.51,"vh":16.99,"label":"1","side":"top"},{"vx":299.36,"vy":119.42,"vw":17.51,"vh":16.99,"label":"3","side":"top"},{"vx":501.01,"vy":118.42,"vw":17.51,"vh":16.99,"label":"5","side":"top"},{"vx":699.5,"vy":118.42,"vw":17.51,"vh":16.99,"label":"7","side":"top"},{"vx":100,"vy":450.25,"vw":17.51,"vh":16.99,"label":"2","side":"bottom"},{"vx":299.36,"vy":451.25,"vw":17.51,"vh":16.99,"label":"4","side":"bottom"},{"vx":501.01,"vy":450.25,"vw":17.51,"vh":16.99,"label":"6","side":"bottom"},{"vx":699.5,"vy":450.25,"vw":17.51,"vh":16.99,"label":"8","side":"bottom"}]},"protection_fuse_isolator_1p(1).svg":{"vb":[221.93,151.18,435.85,464.91],"ports":[{"vx":453.36,"vy":217.8,"vw":17.51,"vh":17.01,"label":"1","side":"top"},{"vx":453.36,"vy":549.48,"vw":17.51,"vh":17.01,"label":"2","side":"bottom"}]},"protection_fuse_isolator_1p.svg":{"vb":[221.93,151.18,435.85,464.91],"ports":[{"vx":453.36,"vy":217.8,"vw":17.51,"vh":17.01,"label":"1","side":"top"},{"vx":453.36,"vy":549.48,"vw":17.51,"vh":17.01,"label":"2","side":"bottom"}]},"protection_fuse_isolator_2p(1).svg":{"vb":[267.58,147.04,437.05,466.19],"ports":[{"vx":400.36,"vy":213.8,"vw":17.51,"vh":16.97,"label":"1","side":"top"},{"vx":600.5,"vy":214.8,"vw":17.51,"vh":16.97,"label":"3","side":"top"},{"vx":400.36,"vy":545.48,"vw":17.51,"vh":16.97,"label":"2","side":"bottom"},{"vx":599.5,"vy":546.48,"vw":17.51,"vh":16.97,"label":"4","side":"bottom"}]},"protection_fuse_isolator_2p.svg":{"vb":[267.58,147.04,437.05,466.19],"ports":[{"vx":400.36,"vy":213.8,"vw":17.51,"vh":16.97,"label":"1","side":"top"},{"vx":600.5,"vy":214.8,"vw":17.51,"vh":16.97,"label":"3","side":"top"},{"vx":400.36,"vy":545.48,"vw":17.51,"vh":16.97,"label":"2","side":"bottom"},{"vx":599.5,"vy":546.48,"vw":17.51,"vh":16.97,"label":"4","side":"bottom"}]},"protection_fuse_isolator_3p(1).svg":{"vb":[305.52,143.21,561.67,472.85],"ports":[{"vx":400.36,"vy":215.8,"vw":17.51,"vh":16.97,"label":"1","side":"top"},{"vx":599.86,"vy":216.8,"vw":17.51,"vh":16.97,"label":"3","side":"top"},{"vx":799.36,"vy":210.8,"vw":17.51,"vh":16.97,"label":"5","side":"top"},{"vx":400.36,"vy":547.48,"vw":17.51,"vh":16.97,"label":"2","side":"bottom"},{"vx":599.86,"vy":548.48,"vw":17.51,"vh":16.97,"label":"4","side":"bottom"},{"vx":799.36,"vy":542.46,"vw":17.51,"vh":16.97,"label":"6","side":"bottom"}]},"protection_fuse_isolator_3p.svg":{"vb":[305.52,143.21,561.67,472.85],"ports":[{"vx":400.36,"vy":215.8,"vw":17.51,"vh":16.97,"label":"1","side":"top"},{"vx":599.86,"vy":216.8,"vw":17.51,"vh":16.97,"label":"3","side":"top"},{"vx":799.36,"vy":210.8,"vw":17.51,"vh":16.97,"label":"5","side":"top"},{"vx":400.36,"vy":547.48,"vw":17.51,"vh":16.97,"label":"2","side":"bottom"},{"vx":599.86,"vy":548.48,"vw":17.51,"vh":16.97,"label":"4","side":"bottom"},{"vx":799.36,"vy":542.46,"vw":17.51,"vh":16.97,"label":"6","side":"bottom"}]},"protection_fuse_isolator_4p(1).svg":{"vb":[306.16,153.21,762.1,464.85],"ports":[{"vx":400.36,"vy":219.8,"vw":17.51,"vh":16.97,"label":"1","side":"top"},{"vx":598.86,"vy":219.8,"vw":17.51,"vh":16.97,"label":"3","side":"top"},{"vx":800.36,"vy":219.8,"vw":17.51,"vh":16.97,"label":"5","side":"top"},{"vx":1001.07,"vy":219.8,"vw":17.51,"vh":16.97,"label":"7","side":"top"},{"vx":400.36,"vy":551.48,"vw":17.51,"vh":16.97,"label":"2","side":"bottom"},{"vx":598.86,"vy":548.48,"vw":17.51,"vh":16.97,"label":"4","side":"bottom"},{"vx":800.5,"vy":548.46,"vw":17.51,"vh":16.97,"label":"6","side":"bottom"},{"vx":1000.5,"vy":547.46,"vw":17.51,"vh":16.97,"label":"8","side":"bottom"}]},"protection_fuse_isolator_4p.svg":{"vb":[306.16,153.21,762.1,464.85],"ports":[{"vx":400.36,"vy":219.8,"vw":17.51,"vh":16.97,"label":"1","side":"top"},{"vx":598.86,"vy":219.8,"vw":17.51,"vh":16.97,"label":"3","side":"top"},{"vx":800.36,"vy":219.8,"vw":17.51,"vh":16.97,"label":"5","side":"top"},{"vx":1001.07,"vy":219.8,"vw":17.51,"vh":16.97,"label":"7","side":"top"},{"vx":400.36,"vy":551.48,"vw":17.51,"vh":16.97,"label":"2","side":"bottom"},{"vx":598.86,"vy":548.48,"vw":17.51,"vh":16.97,"label":"4","side":"bottom"},{"vx":800.5,"vy":548.46,"vw":17.51,"vh":16.97,"label":"6","side":"bottom"},{"vx":1000.5,"vy":547.46,"vw":17.51,"vh":16.97,"label":"8","side":"bottom"}]},"protection_motor_circuit_breaker_2p(1).svg":{"vb":[657.88,-58.43,863.15,920.69],"ports":[{"vx":1004.75,"vy":73.5,"vw":30.58,"vh":33.68,"label":"1","side":"top"},{"vx":1300.24,"vy":73.49,"vw":30.55,"vh":33.66,"label":"3","side":"top"},{"vx":1004.75,"vy":730.34,"vw":30.58,"vh":33.68,"label":"2","side":"bottom"},{"vx":1298.26,"vy":730.34,"vw":30.58,"vh":33.68,"label":"4","side":"bottom"}]},"protection_motor_circuit_breaker_2p.svg":{"vb":[657.88,-58.43,863.15,920.69],"ports":[{"vx":1004.75,"vy":73.5,"vw":30.58,"vh":33.68,"label":"1","side":"top"},{"vx":1300.24,"vy":73.49,"vw":30.55,"vh":33.66,"label":"3","side":"top"},{"vx":1004.75,"vy":730.34,"vw":30.58,"vh":33.68,"label":"2","side":"bottom"},{"vx":1298.26,"vy":730.34,"vw":30.58,"vh":33.68,"label":"4","side":"bottom"}]},"protection_motor_circuit_breaker_3p(1).svg":{"vb":[200.31,95.75,435.0,464.0],"ports":[{"vx":340.29,"vy":181.39,"vw":14.92,"vh":14.78,"label":"1","side":"top"},{"vx":440.2,"vy":182.94,"vw":14.92,"vh":14.78,"label":"3","side":"top"},{"vx":539.11,"vy":180.94,"vw":14.92,"vh":14.78,"label":"5","side":"top"},{"vx":339.28,"vy":473.56,"vw":14.92,"vh":14.8,"label":"2","side":"bottom"},{"vx":439.19,"vy":474.56,"vw":14.92,"vh":14.8,"label":"4","side":"bottom"},{"vx":539.1,"vy":472.56,"vw":14.92,"vh":14.8,"label":"6","side":"bottom"}]},"protection_motor_circuit_breaker_3p.svg":{"vb":[200.31,95.75,435.0,464.0],"ports":[{"vx":340.29,"vy":181.39,"vw":14.92,"vh":14.78,"label":"1","side":"top"},{"vx":440.2,"vy":182.94,"vw":14.92,"vh":14.78,"label":"3","side":"top"},{"vx":539.11,"vy":180.94,"vw":14.92,"vh":14.78,"label":"5","side":"top"},{"vx":339.28,"vy":473.56,"vw":14.92,"vh":14.8,"label":"2","side":"bottom"},{"vx":439.19,"vy":474.56,"vw":14.92,"vh":14.8,"label":"4","side":"bottom"},{"vx":539.1,"vy":472.56,"vw":14.92,"vh":14.8,"label":"6","side":"bottom"}]},"protection_thermal_overload_relay_2p(1).svg":{"vb":[344.19,49.71,447.99,464.0],"ports":[{"vx":442.38,"vy":116.6,"vw":21.39,"vh":16.92,"label":"1","side":"top"},{"vx":661.64,"vy":116.6,"vw":21.39,"vh":16.92,"label":"3","side":"top"},{"vx":442.39,"vy":446.82,"vw":21.39,"vh":16.92,"label":"2","side":"bottom"},{"vx":661.63,"vy":446.82,"vw":21.39,"vh":16.92,"label":"4","side":"bottom"}]},"protection_thermal_overload_relay_2p.svg":{"vb":[344.19,49.71,447.99,464.0],"ports":[{"vx":442.38,"vy":116.6,"vw":21.39,"vh":16.92,"label":"1","side":"top"},{"vx":661.64,"vy":116.6,"vw":21.39,"vh":16.92,"label":"3","side":"top"},{"vx":442.39,"vy":446.82,"vw":21.39,"vh":16.92,"label":"2","side":"bottom"},{"vx":661.63,"vy":446.82,"vw":21.39,"vh":16.92,"label":"4","side":"bottom"}]},"protection_thermal_overload_relay_3p(1).svg":{"vb":[23.66,1.39,647.68,479.24],"ports":[{"vx":111.5,"vy":70.46,"vw":17.51,"vh":17.51,"label":"1","side":"top"},{"vx":331.01,"vy":70.04,"vw":17.51,"vh":17.51,"label":"3","side":"top"},{"vx":550.51,"vy":70.46,"vw":17.51,"vh":17.51,"label":"5","side":"top"},{"vx":111.5,"vy":411.96,"vw":17.51,"vh":17.51,"label":"2","side":"bottom"},{"vx":331.01,"vy":411.54,"vw":17.51,"vh":17.51,"label":"4","side":"bottom"},{"vx":550.51,"vy":411.96,"vw":17.51,"vh":17.51,"label":"6","side":"bottom"}]},"protection_thermal_overload_relay_3p.svg":{"vb":[23.66,1.39,647.68,479.24],"ports":[{"vx":111.5,"vy":70.46,"vw":17.51,"vh":17.51,"label":"1","side":"top"},{"vx":331.01,"vy":70.04,"vw":17.51,"vh":17.51,"label":"3","side":"top"},{"vx":550.51,"vy":70.46,"vw":17.51,"vh":17.51,"label":"5","side":"top"},{"vx":111.5,"vy":411.96,"vw":17.51,"vh":17.51,"label":"2","side":"bottom"},{"vx":331.01,"vy":411.54,"vw":17.51,"vh":17.51,"label":"4","side":"bottom"},{"vx":550.51,"vy":411.96,"vw":17.51,"vh":17.51,"label":"6","side":"bottom"}]},"motor_dc_motor(2).svg":{"vb":[285.4,12.39,964.53,1028.83],"ports":[{"vx":671.24,"vy":176.69,"vw":29.75,"vh":29.5,"label":"A1","side":"top"},{"vx":866.93,"vy":177.88,"vw":29.73,"vh":29.49,"label":"A2","side":"top"}]},"motor_dc_motor.svg":{"vb":[285.4,12.39,964.53,1028.83],"ports":[{"vx":671.24,"vy":176.69,"vw":29.75,"vh":29.5,"label":"A1","side":"top"},{"vx":866.93,"vy":177.88,"vw":29.73,"vh":29.49,"label":"A2","side":"top"}]},"motor_single_phase(2).svg":{"vb":[353.75,-29.02,928.53,990.43],"ports":[{"vx":677.05,"vy":109.96,"vw":27.78,"vh":30.35,"label":"U","side":"top"},{"vx":867.47,"vy":109.96,"vw":27.78,"vh":30.35,"label":"V","side":"top"},{"vx":1156.22,"vy":119.96,"vw":27.78,"vh":30.35,"label":"PE","side":"top"}]},"motor_single_phase.svg":{"vb":[353.75,-29.02,928.53,990.43],"ports":[{"vx":677.05,"vy":109.96,"vw":27.78,"vh":30.35,"label":"U","side":"top"},{"vx":867.47,"vy":109.96,"vw":27.78,"vh":30.35,"label":"V","side":"top"},{"vx":1156.22,"vy":119.96,"vw":27.78,"vh":30.35,"label":"PE","side":"top"}]},"motor_three_phase(2).svg":{"vb":[264.27,265.91,980.47,963.07],"ports":[{"vx":483.2,"vy":401.07,"vw":30.03,"vh":29.53,"label":"U","side":"top"},{"vx":670.77,"vy":402.74,"vw":30.03,"vh":29.53,"label":"V","side":"top"},{"vx":863.31,"vy":404.4,"vw":30.03,"vh":29.53,"label":"W","side":"top"},{"vx":1152.69,"vy":407.09,"vw":30.02,"vh":29.49,"label":"PE","side":"top"}]},"motor_three_phase.svg":{"vb":[264.27,265.91,980.47,963.07],"ports":[{"vx":483.2,"vy":401.07,"vw":30.03,"vh":29.53,"label":"U","side":"top"},{"vx":670.77,"vy":402.74,"vw":30.03,"vh":29.53,"label":"V","side":"top"},{"vx":863.31,"vy":404.4,"vw":30.03,"vh":29.53,"label":"W","side":"top"},{"vx":1152.69,"vy":407.09,"vw":30.02,"vh":29.49,"label":"PE","side":"top"}]},"motor_three_phase_star_delta(2).svg":{"vb":[305.04,71.31,883.02,941.89],"ports":[{"vx":481.2,"vy":202.67,"vw":23.63,"vh":25.35,"label":"U1","side":"top"},{"vx":671.98,"vy":201.71,"vw":23.63,"vh":25.35,"label":"V1","side":"top"},{"vx":861.51,"vy":202.96,"vw":23.63,"vh":25.35,"label":"W1","side":"top"},{"vx":1069.79,"vy":214.21,"vw":23.63,"vh":25.35,"label":"PE","side":"top"},{"vx":479.95,"vy":879.6,"vw":23.63,"vh":25.35,"label":"W2","side":"bottom"},{"vx":673.23,"vy":879.02,"vw":23.63,"vh":25.35,"label":"U2","side":"bottom"},{"vx":862.76,"vy":877.77,"vw":23.63,"vh":25.35,"label":"V2","side":"bottom"}]},"motor_three_phase_star_delta.svg":{"vb":[305.04,71.31,883.02,941.89],"ports":[{"vx":481.2,"vy":202.67,"vw":23.63,"vh":25.35,"label":"U1","side":"top"},{"vx":671.98,"vy":201.71,"vw":23.63,"vh":25.35,"label":"V1","side":"top"},{"vx":861.51,"vy":202.96,"vw":23.63,"vh":25.35,"label":"W1","side":"top"},{"vx":1069.79,"vy":214.21,"vw":23.63,"vh":25.35,"label":"PE","side":"top"},{"vx":479.95,"vy":879.6,"vw":23.63,"vh":25.35,"label":"W2","side":"bottom"},{"vx":673.23,"vy":879.02,"vw":23.63,"vh":25.35,"label":"U2","side":"bottom"},{"vx":862.76,"vy":877.77,"vw":23.63,"vh":25.35,"label":"V2","side":"bottom"}]},"proximity_sensor_npn_nc(2).svg":{"vb":[-43.76,-70.15,627.62,626.76],"ports":[{"vx":518.91,"vy":96.38,"vw":29.62,"vh":30.68,"label":"BN","side":"right"},{"vx":514.16,"vy":197.23,"vw":30.13,"vh":28.17,"label":"BK","side":"right"},{"vx":516.91,"vy":299.6,"vw":29.62,"vh":26.18,"label":"BU","side":"right"}]},"proximity_sensor_npn_nc.svg":{"vb":[-43.76,-70.15,627.62,626.76],"ports":[{"vx":518.91,"vy":96.38,"vw":29.62,"vh":30.68,"label":"BN","side":"right"},{"vx":514.16,"vy":197.23,"vw":30.13,"vh":28.17,"label":"BK","side":"right"},{"vx":516.91,"vy":299.6,"vw":29.62,"vh":26.18,"label":"BU","side":"right"}]},"proximity_sensor_npn_no(2).svg":{"vb":[-44.77,-68.22,670.29,628.31],"ports":[{"vx":559.13,"vy":96.38,"vw":32.24,"vh":32.54,"label":"BN","side":"right"},{"vx":553.6,"vy":193.39,"vw":33.04,"vh":31.93,"label":"BK","side":"right"},{"vx":554.19,"vy":299.79,"vw":32.36,"vh":31.93,"label":"BU","side":"right"}]},"proximity_sensor_npn_no.svg":{"vb":[-44.77,-68.22,670.29,628.31],"ports":[{"vx":559.13,"vy":96.38,"vw":32.24,"vh":32.54,"label":"BN","side":"right"},{"vx":553.6,"vy":193.39,"vw":33.04,"vh":31.93,"label":"BK","side":"right"},{"vx":554.19,"vy":299.79,"vw":32.36,"vh":31.93,"label":"BU","side":"right"}]}};
const ESC_COMP_W = 120, ESC_COMP_H = 90, ESC_COMP_CX = 60, ESC_COMP_CY = 45;
const ESC_ART_X = 15, ESC_ART_Y = 13, ESC_ART_W = 90, ESC_ART_H = 63;

function getSvgCatalogEntry(typeOrFile) {
  let raw = String(typeOrFile || ''); try { raw = decodeURIComponent(raw); } catch (_) {} const asset = raw.split(/[\\/]/).pop().split('?')[0].toLowerCase();
  const canon = asset.replace(/\s*\(\d+\)(?=\.svg$)/i, '').replace(/\s*_\s*/g, '_');
  return SVG_TERMINAL_CATALOG[asset] || SVG_TERMINAL_CATALOG[canon] || null;
}
window.getSvgCatalogEntry = getSvgCatalogEntry;

function parseViewBoxTuple(vb) {
  if (!vb) return [0, 0, 100, 100];
  if (vb.length === 4) return [Number(vb[0]) || 0, Number(vb[1]) || 0, Number(vb[2]) || 100, Number(vb[3]) || 100];
  return [0, 0, Number(vb[0]) || 100, Number(vb[1]) || 100];
}

// Lock vertical height (ESC_ART_H = 63) and expand artwork width proportionally for multi-pole symbols
// so 1-phase, 2-pole, 3-phase, and 3-phase+N sources render at identical pole height and circle diameter.
function getComponentViewport(typeOrFile) {
  const entry = getSvgCatalogEntry(typeOrFile);
  if (entry && entry.vb) {
    const [, , vw, vh] = parseViewBoxTuple(entry.vb);
    if (vw > 0 && vh > 0) {
      const h = ESC_ART_H;
      const w = Math.max(ESC_ART_W, Math.round((vw / vh) * h * 100) / 100);
      const x = Math.round((ESC_COMP_CX - w / 2) * 100) / 100;
      return { x, y: ESC_ART_Y, w, h };
    }
  }
  return { x: ESC_ART_X, y: ESC_ART_Y, w: ESC_ART_W, h: ESC_ART_H };
}
window.getComponentViewport = getComponentViewport;

function portDefs(type) {
  const entry = getSvgCatalogEntry(type);
  if (entry) {
    const [vx0, vy0, vw, vh] = parseViewBoxTuple(entry.vb);
    const vp = getComponentViewport(type);
    const scale = Math.min(vp.w / vw, vp.h / vh);
    const drawW = vw * scale, drawH = vh * scale;
    const originX = vp.x + (vp.w - drawW) / 2;
    const originY = vp.y + (vp.h - drawH) / 2;
    return entry.ports.map((p, idx) => ({
      index: idx,
      x: Math.round((originX + (p.vx - vx0) * scale) * 100) / 100,
      y: Math.round((originY + (p.vy - vy0) * scale) * 100) / 100,
      lx: Math.round((originX + (p.vx - vx0) * scale) * 100) / 100,
      ly: Math.round((originY + (p.vy - vy0) * scale) * 100) / 100,
      w: Math.max(8, Math.round((p.vw || 10) * scale * 10) / 10 + 2.5),
      h: Math.max(8, Math.round((p.vh || 10) * scale * 10) / 10 + 2.5),
      label: p.label,
      side: p.side || 'top'
    }));
  }
  const v = (x, y, label, side) => ({ x, y, label, side });
  const asset = String(type || '').split('/').pop().toLowerCase();
  let raw = [];
  if (asset.endsWith('.svg')) {
    const poles = /(?:3p|3-pole|three-phase|three-pole)/.test(asset) ? 3 :
                  /(?:2p|2-pole|two-pole)/.test(asset) ? 2 :
                  /(?:1p|1-pole|single-pole)/.test(asset) ? 1 : 0;
    if (poles) {
      const xs = poles === 3 ? [8, 24, 40] : poles === 2 ? [16, 32] : [24];
      const top = poles === 3 ? ['1', '3', '5'] : poles === 2 ? ['1', '3'] : ['1'];
      const bottom = poles === 3 ? ['2', '4', '6'] : poles === 2 ? ['2', '4'] : ['2'];
      raw = [...xs.map((x, i) => v(x, 2, top[i], 'top')), ...xs.map((x, i) => v(x, 30, bottom[i], 'bottom'))];
    } else if (/(?:push-button|manual-button|emergency-stop|limit-switch|normally-open-contact|normally-close-contact|normally-closed-contact|changeover-contact)/.test(asset)) {
      raw = [v(24, 2, '13', 'top'), v(24, 30, '14', 'bottom')];
    } else if (/(?:coil|timer|relay)/.test(asset)) {
      raw = [v(24, 2, 'A1', 'top'), v(24, 30, 'A2', 'bottom')];
    }
  }
  if (!raw.length) {
    if (type === '3p') raw = [v(8, 2, 'L1', 'top'), v(24, 2, 'L2', 'top'), v(40, 2, 'L3', 'top'), v(8, 30, 'T1', 'bottom'), v(24, 30, 'T2', 'bottom'), v(40, 30, 'T3', 'bottom')];
    else if (['l1', 'l2', 'l3', 'n', 'dc-', 'dc+', 'pe', 'gnd'].includes(type)) {
      const lbl = type === 'dc-' ? '−' : type === 'dc+' ? '+' : type.toUpperCase();
      raw = [v(24, 2, lbl + '_1', 'top'), v(24, 30, lbl, 'bottom')];
    }
    else if (type === 'psu') raw = [v(7, 7, 'L', 'top'), v(17, 7, 'N', 'top'), v(31, 7, 'HV', 'top'), v(41, 7, 'PE', 'top'), v(7, 25, '+1', 'bottom'), v(17, 25, '+2', 'bottom'), v(31, 25, '−1', 'bottom'), v(41, 25, '−2', 'bottom')];
    else if (['tr1', 'tr3', 'gen3'].includes(type)) raw = [v(12, 2, '1', 'top'), v(36, 2, '3', 'top'), v(12, 30, '2', 'bottom'), v(36, 30, '4', 'bottom')];
    else if (['mainno', 'mainnc'].includes(type)) raw = [v(5, 16, '1/L1', 'left'), v(43, 16, '2/T1', 'right')];
    else if (['nc', 'auxnc', 'relaync', 'limitnc', 'tdnc', 'offnc', 'timernc'].includes(type)) raw = [v(5, 16, '21', 'left'), v(43, 16, '22', 'right')];
    else if (['no', 'auxno', 'relayno', 'start', 'stop', 'estop', 'limitno', 'foot', 'pressure', 'temperature', 'float', 'hand', 'tdno', 'offno', 'timerno'].includes(type)) raw = [v(5, 16, '13', 'left'), v(43, 16, '14', 'right')];
    else if (['change', 'changeover'].includes(type)) raw = [v(5, 16, '11', 'left'), v(43, 16, '14', 'right')];
    else if (['coil', 'relaycoil', 'powerrelay', 'interpose', 'latchrelay', 'ssr', 'reed', 'safetyrelay', 'ton', 'tof', 'multitimer', 'stimer', 'flasher', 'cyclic', 'stair', 'analogtimer', 'digitaltimer', 'programmable', 'counter', '3pcont', '4pcont', 'contaux', 'reverse', 'contimer', 'stardelta', 'latchcont'].includes(type)) raw = [v(24, 2, 'A1', 'top'), v(24, 30, 'A2', 'bottom')];
    else if (['motor3', 'motor1', 'motorDC', 'twospeed', 'motorsd', 'brake', 'gear'].includes(type)) raw = [v(14, 2, 'U', 'top'), v(24, 2, 'V', 'top'), v(34, 2, 'W', 'top'), v(24, 30, 'PE', 'bottom')];
    else if (['lamp', 'led', 'tower', 'pilot', 'buzzer', 'siren', 'heater', 'resistive', 'inductive', 'capacitive', 'solenoid'].includes(type)) raw = [v(24, 2, 'X1', 'top'), v(24, 30, 'X2', 'bottom')];
    else raw = [v(24, 2, '1', 'top'), v(24, 30, '2', 'bottom')];
  }
  const scale = Math.min(ESC_ART_W / 48, ESC_ART_H / 32);
  const drawW = 48 * scale, drawH = 32 * scale;
  const originX = ESC_ART_X + (ESC_ART_W - drawW) / 2;
  const originY = ESC_ART_Y + (ESC_ART_H - drawH) / 2;
  return raw.map((p, idx) => {
    const lx = Math.round((originX + p.x * scale) * 100) / 100;
    const ly = Math.round((originY + p.y * scale) * 100) / 100;
    return { index: idx, x: lx, y: ly, lx, ly, w: 8.5, h: 8.5, label: p.label, side: p.side || 'top' };
  });
}

function portsFor(g) {
  if (!g) return [];
  const key = g.dataset.symbolFile || g.dataset.porttype || g.dataset.type || '';
  const defs = portDefs(key);
  let labels = [];
  try { labels = JSON.parse(g.dataset.terminals || 'null') || []; } catch (_) {}
  return defs.map((p, i) => ({ ...p, index: i, label: labels[i] || p.label }));
}

function withPreviewPorts(type) {
  const base = icon(type).replace('</svg>', '');
  return base + '</svg>';
}

function nextReference(d) {
  const s = ((d && (d.name || d.type)) || 'component').toLowerCase();
  let p = 'X';
  if (/contactor|main.?contact/.test(s)) p = 'KM';
  else if (/aux.?contact|auxiliary/.test(s)) p = 'K';
  else if (/overload|thermal/.test(s)) p = 'F';
  else if (/breaker|mcb|fuse|isolator|protection/.test(s)) p = 'Q';
  else if (/motor/.test(s)) p = 'M';
  else if (/timer|delay/.test(s)) p = 'KT';
  else if (/coil|relay/.test(s)) p = 'K';
  else if (/push|button|emergency|selector|switch|limit|contact/.test(s)) p = 'S';
  else if (/pilot|lamp|led|indicator|beacon|bell|buzzer|light/.test(s)) p = 'H';
  else if (/earth|ground/.test(s)) p = 'PE';
  else if (/terminal|connector|block/.test(s)) p = 'X';
  else if (/transformer/.test(s)) p = 'T';
  else if (/sensor|proximity/.test(s)) p = 'B';
  const n = [...dropLayer.querySelectorAll('.dropped-symbol')].filter(g => (g.dataset.ref || '').startsWith(p)).length + 1;
  return p + n;
}

function syncComponentPorts(g) {
  if (!g) return;
  const NS = 'http://www.w3.org/2000/svg';
  let portsGroup = g.querySelector(':scope > .component-ports');
  if (!portsGroup) {
    portsGroup = document.createElementNS(NS, 'g');
    portsGroup.setAttribute('class', 'component-ports');
    g.appendChild(portsGroup);
  } else {
    portsGroup.replaceChildren();
  }
  const defs = portsFor(g);
  defs.forEach((p, idx) => {
    const r = document.createElementNS(NS, 'rect');
    r.setAttribute('class', 'mag-port');
    r.setAttribute('x', String(Math.round((p.lx - p.w / 2) * 100) / 100));
    r.setAttribute('y', String(Math.round((p.ly - p.h / 2) * 100) / 100));
    r.setAttribute('width', String(p.w));
    r.setAttribute('height', String(p.h));
    r.setAttribute('rx', '1.2');
    r.setAttribute('ry', '1.2');
    r.setAttribute('cx', String(p.lx));
    r.setAttribute('cy', String(p.ly));
    r.dataset.port = p.label;
    r.dataset.portIndex = String(idx);
    r.dataset.side = p.side || 'top';
    r.setAttribute('data-owner', 'component');
    const titleEl = document.createElementNS(NS, 'title');
    titleEl.textContent = `${g.dataset.ref || g.dataset.name || 'Component'} • Terminal ${p.label}`;
    r.appendChild(titleEl);
    portsGroup.appendChild(r);

    const t = document.createElementNS(NS, 'text');
    t.setAttribute('class', 'port-name');
    // Keep every terminal designation just to the right of its terminal point,
    // independent of whether the terminal is at the top, bottom, left, or right.
    t.setAttribute('x', String(p.lx + Math.max(8, p.w / 2 + 3)));
    t.setAttribute('y', String(p.ly + 3));
    t.setAttribute('text-anchor', 'start');
    t.setAttribute('font-size', '8');
    // Display polarity with standard + / - signs while preserving internal port IDs.
    const displayLabel = p.label === 'POS' ? '+' : (p.label === 'NEG' ? '−' : (p.label || ''));
    t.textContent = displayLabel;
    t.setAttribute('aria-label', p.label || 'Terminal');
    portsGroup.appendChild(t);
  });
  // Ensure .component-ports is at the top of the component group so terminals always receive pointer events first
  g.appendChild(portsGroup);
}
window.syncComponentPorts = syncComponentPorts;

function applyComponentTransform(g, x = Number(g.dataset.x || 0), y = Number(g.dataset.y || 0)) {
  if (!g) return;
  const angle = ((Number(g.dataset.rotation) || 0) % 360 + 360) % 360;
  g.setAttribute('transform', angle ? `translate(${x - ESC_COMP_CX},${y - ESC_COMP_CY}) rotate(${angle} ${ESC_COMP_CX} ${ESC_COMP_CY})` : `translate(${x - ESC_COMP_CX},${y - ESC_COMP_CY})`);
}
window.applyComponentTransform = applyComponentTransform;

function absolutePorts(g, x = Number(g?.dataset?.x || 0), y = Number(g?.dataset?.y || 0)) {
  if (!g) return [];
  const deg = ((Number(g.dataset.rotation) || 0) % 360 + 360) % 360;
  const rad = (deg * Math.PI) / 180, cos = Math.cos(rad), sin = Math.sin(rad);
  const sideOrder = ['top', 'right', 'bottom', 'left'];
  const steps = Math.round(deg / 90) % 4;
  const portEls = [...g.querySelectorAll(':scope > .component-ports .mag-port, .mag-port')];
  return portsFor(g).map((p, i) => {
    const dx = p.lx - ESC_COMP_CX, dy = p.ly - ESC_COMP_CY;
    const sIdx = sideOrder.indexOf(p.side || 'top');
    const rotatedSide = sIdx >= 0 ? sideOrder[(sIdx + steps) % 4] : (p.side || 'top');
    return {
      index: i,
      x: Math.round((x + dx * cos - dy * sin) * 100) / 100,
      y: Math.round((y + dx * sin + dy * cos) * 100) / 100,
      lx: p.lx,
      ly: p.ly,
      w: p.w,
      h: p.h,
      label: p.label,
      side: rotatedSide,
      g,
      el: portEls[i] || null
    };
  });
}
window.absolutePorts = absolutePorts;

function makeDropped(d, x, y) {
  const NS = 'http://www.w3.org/2000/svg', W = ESC_COMP_W, H = ESC_COMP_H;
  const g = document.createElementNS(NS, 'g');
  g.setAttribute('class', 'dropped-symbol');
  g.dataset.uid = 'C' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
  g.dataset.type = d.type;
  g.dataset.porttype = d.symbolFile || d.type;
  if (d.symbolFile) g.dataset.symbolFile = d.symbolFile;
  g.dataset.name = d.name;
  g.dataset.ref = d.ref || nextReference(d);
  g.dataset.value = d.value || '';
  g.dataset.accent = d.accent || '#e9f1ed';
  g.dataset.x = String(x);
  g.dataset.y = String(y);
  applyComponentTransform(g, x, y);

  const vp = getComponentViewport(d.symbolFile || d.type);
  const entry = getSvgCatalogEntry(d.symbolFile || d.type);
  const [, , vbW, vbH] = entry ? parseViewBoxTuple(entry.vb) : [0, 0, vp.w, vp.h];
  const drawScale = Math.min(vp.w / vbW, vp.h / vbH);
  const tightW = Math.max(36, Math.round(vbW * drawScale));
  const tightH = Math.max(36, Math.round(vbH * drawScale));

  const box = document.createElementNS(NS, 'rect');
  box.setAttribute('class', 'select-box');
  box.setAttribute('x', String(Math.round((ESC_COMP_CX - tightW / 2 - 4) * 100) / 100));
  box.setAttribute('y', String(Math.round((ESC_COMP_CY - tightH / 2 - 4) * 100) / 100));
  box.setAttribute('width', String(tightW + 8));
  box.setAttribute('height', String(tightH + 8));
  box.setAttribute('rx', '2');

  const ns = document.createElementNS(NS, 'svg');
  ns.setAttribute('x', String(vp.x));
  ns.setAttribute('y', String(vp.y));
  ns.setAttribute('width', String(vp.w));
  ns.setAttribute('height', String(vp.h));
  ns.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  ns.style.color = g.dataset.accent;
  ns.style.pointerEvents = 'none';
  if (d.symbolFile && /\.svg(?:$|\?)/i.test(d.symbolFile)) {
    ns.setAttribute('viewBox', `0 0 ${vp.w} ${vp.h}`);
    const im = document.createElementNS(NS, 'image');
    im.setAttribute('href', d.symbolFile);
    im.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', d.symbolFile);
    im.setAttribute('x', '0');
    im.setAttribute('y', '0');
    im.setAttribute('width', String(vp.w));
    im.setAttribute('height', String(vp.h));
    im.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    ns.appendChild(im);
    g.classList.add('original-svg-component');
  } else {
    ns.setAttribute('viewBox', '0 0 48 32');
    ns.innerHTML = icon(d.type).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  }

  const ports = document.createElementNS(NS, 'g');
  ports.setAttribute('class', 'component-ports');

  const label = document.createElementNS(NS, 'text');
  label.setAttribute('class', 'drop-label');
  label.setAttribute('x', String(W / 2));
  label.setAttribute('y', String(H - 3));
  label.setAttribute('text-anchor', 'middle');
  label.textContent = '';

  const tag = document.createElementNS(NS, 'text');
  tag.setAttribute('class', 'drop-tag');
  // Reference/tag name sits at the left side, vertically centered on the component.
  tag.setAttribute('x', String(Math.round((ESC_COMP_CX - tightW / 2 - 8) * 100) / 100));
  tag.setAttribute('y', String(ESC_COMP_CY + 4));
  tag.setAttribute('text-anchor', 'end');
  tag.setAttribute('font-size', '12');
  tag.style.fill = '#ffffff';
  tag.style.fontSize = '12px';
  tag.textContent = g.dataset.ref;

  const title = document.createElementNS(NS, 'title');
  title.textContent = (g.dataset.ref || '') + ' — ' + d.name + (g.dataset.value ? ' • ' + g.dataset.value : '');

  const comment = document.createElementNS(NS, 'text');
  comment.setAttribute('class', 'drop-comment');
  comment.setAttribute('x', '22');
  comment.setAttribute('y', '45');
  comment.setAttribute('text-anchor', 'middle');
  comment.setAttribute('transform', 'rotate(-90 22 45)');
  comment.textContent = g.dataset.comment || '';
  comment.style.display = g.dataset.comment ? '' : 'none';

  const hitW = Math.max(W - 24, tightW + 12);
  const hit = document.createElementNS(NS, 'rect');
  hit.setAttribute('class', 'component-hit-area');
  hit.setAttribute('x', String(Math.round((ESC_COMP_CX - hitW / 2) * 100) / 100));
  hit.setAttribute('y', '10');
  hit.setAttribute('width', String(hitW));
  hit.setAttribute('height', String(H - 20));
  hit.setAttribute('fill', 'transparent');
  hit.setAttribute('pointer-events', 'all');

  g.append(title, box, hit, ns, label, tag, comment, ports);
  syncComponentPorts(g);
  dropLayer.appendChild(g);
  select(g);
  enableMove(g);
  return g;
}

function findSnap(g, x, y) {
  let best = null, dist = 999;
  const mine = absolutePorts(g, x, y);
  document.querySelectorAll('.dropped-symbol').forEach(o => {
    if (o === g) return;
    absolutePorts(o).forEach(op => mine.forEach(mp => {
      const d = Math.hypot(op.x - mp.x, op.y - mp.y);
      if (d < 18 && d < dist) { dist = d; best = { x: x + (op.x - mp.x), y: y + (op.y - mp.y) }; }
    }));
  });
  return best;
}

let activeDrag = null;
let suppressNextComponentClick = false;
function enableMove(g) {
  g.style.pointerEvents = 'all';
  g.style.cursor = 'default';
}

// Final UI properties inspector: show only while a workspace component is selected.
(function initPropertyPanel(){
 const $=id=>document.getElementById(id);const panel=$('propertyPanel');if(!panel)return;
 $('propertyClose')?.addEventListener('click',()=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true');});
 $('propertyDelete')?.addEventListener('click',()=>{if(selected){selected.remove();select(null);state.textContent='COMPONENT DELETED';}});
 const setData=(id,key)=>$(id)?.addEventListener('change',e=>{if(!selected)return;selected.dataset[key]=e.target.value;if(key==='ref')selected.dataset.label=e.target.value;if(key==='x'||key==='y'){const x=+(selected.dataset.x||0),y=+(selected.dataset.y||0);applyComponentTransform(selected,x,y);}if(key==='ref'||key==='label'){const tag=selected.querySelector('.drop-tag');if(tag)tag.textContent=e.target.value;}});
 setData('propTag','ref');setData('propLabel','label');
 $('propShowTag')?.addEventListener('change',e=>{if(selected){const t=selected.querySelector('.drop-tag');if(t)t.style.display=e.target.checked?'':'none';}});
 $('propLineColor')?.addEventListener('change',e=>{if(selected)selected.querySelectorAll('path,line,circle,rect,polyline').forEach(n=>{if(n.closest('.mag-port'))return;n.style.stroke=e.target.value;});});
 $('propTextColor')?.addEventListener('change',e=>{if(selected)selected.querySelectorAll('text').forEach(n=>n.style.fill=e.target.value);});
 $('propLineWidth')?.addEventListener('change',e=>{if(selected)selected.querySelectorAll('path,line,circle,rect,polyline').forEach(n=>n.style.strokeWidth=e.target.value);});
 $('propFontSize')?.addEventListener('change',e=>{if(selected)selected.querySelectorAll('text').forEach(n=>n.style.fontSize=e.target.value+'px');});
 document.getElementById('sheet')?.addEventListener('pointerdown',e=>{if(!e.target.closest('.dropped-symbol')&&!e.target.closest('.connected-wire')&&!e.target.closest('#propertyPanel'))select(null);});
})();

renderLibrary();

/* V15: reliable component selection. Clicking a placed symbol selects it; Delete button/keyboard removes it. */
(function reliableSelection(){
  const layer=document.getElementById('dropLayer');
  if(!layer) return;
  layer.addEventListener('click',e=>{
    if(typeof window.resolvePortFromEvent==='function' && window.resolvePortFromEvent(e, 10)) return;
    const g=e.target.closest && e.target.closest('.dropped-symbol');
    if(!g) return;
    if(e.target.classList && e.target.classList.contains('mag-port')) return;
    select(g);
    state.textContent='SELECTED • '+(g.dataset.ref||g.dataset.name||'COMPONENT');
  },false);
  document.getElementById('delete').title='Select a component or wire, then click DELETE or press the Delete key';
})();

/* V10–V98 — Component terminal selection & orthogonal wire connection between components */
function computeWirePoints(fromPort, toPort, waypoints = []) {
  if (!fromPort || !toPort) return '';
  const ax = Math.round(fromPort.x * 100) / 100;
  const ay = Math.round(fromPort.y * 100) / 100;
  const bx = Math.round(toPort.x * 100) / 100;
  const by = Math.round(toPort.y * 100) / 100;
  const STUB = 14;

  if (waypoints && waypoints.length > 0) {
    const pts = [{ x: ax, y: ay }, ...waypoints.map(w => ({ x: Math.round(w.x * 100) / 100, y: Math.round(w.y * 100) / 100 })), { x: bx, y: by }];
    const out = [`${ax},${ay}`];
    const fromVert = (fromPort.side === 'top' || fromPort.side === 'bottom');
    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[i - 1], p1 = pts[i];
      if (Math.abs(p0.x - p1.x) > 1 && Math.abs(p0.y - p1.y) > 1) {
        if (i === 1 && fromVert) out.push(`${p0.x},${p1.y}`);
        else out.push(`${p1.x},${p0.y}`);
      }
      out.push(`${p1.x},${p1.y}`);
    }
    return out.join(' ');
  }

  const fromSide = fromPort.side || 'bottom';
  const toSide = toPort.side || (Math.abs(by - ay) >= Math.abs(bx - ax) ? (by > ay ? 'top' : 'bottom') : (bx > ax ? 'left' : 'right'));
  const fromVert = (fromSide === 'top' || fromSide === 'bottom');
  const toVert = (toSide === 'top' || toSide === 'bottom');

  if (fromVert && toVert) {
    // 1. bottom -> top
    if (fromSide === 'bottom' && toSide === 'top') {
      if (by >= ay - 2) {
        if (Math.abs(ax - bx) <= 1.5) return `${ax},${ay} ${bx},${by}`;
        const my = Math.round((ay + by) / 2);
        return `${ax},${ay} ${ax},${my} ${bx},${my} ${bx},${by}`;
      }
      const y1 = Math.round(ay + STUB);
      const y2 = Math.round(by - STUB);
      const mx = Math.abs(ax - bx) >= 36 ? Math.round((ax + bx) / 2) : Math.round(Math.max(ax, bx) + 32);
      return `${ax},${ay} ${ax},${y1} ${mx},${y1} ${mx},${y2} ${bx},${y2} ${bx},${by}`;
    }
    // 2. top -> bottom
    if (fromSide === 'top' && toSide === 'bottom') {
      if (by <= ay + 2) {
        if (Math.abs(ax - bx) <= 1.5) return `${ax},${ay} ${bx},${by}`;
        const my = Math.round((ay + by) / 2);
        return `${ax},${ay} ${ax},${my} ${bx},${my} ${bx},${by}`;
      }
      const y1 = Math.round(ay - STUB);
      const y2 = Math.round(by + STUB);
      const mx = Math.abs(ax - bx) >= 36 ? Math.round((ax + bx) / 2) : Math.round(Math.max(ax, bx) + 32);
      return `${ax},${ay} ${ax},${y1} ${mx},${y1} ${mx},${y2} ${bx},${y2} ${bx},${by}`;
    }
    // 3. bottom -> bottom
    if (fromSide === 'bottom' && toSide === 'bottom') {
      const yOut = Math.round(Math.max(ay, by) + STUB);
      if (Math.abs(ax - bx) < 32 && Math.abs(ay - by) > 20) {
        const y1 = Math.round(ay + STUB);
        const mx = Math.round(Math.max(ax, bx) + 32);
        return `${ax},${ay} ${ax},${y1} ${mx},${y1} ${mx},${yOut} ${bx},${yOut} ${bx},${by}`;
      }
      return `${ax},${ay} ${ax},${yOut} ${bx},${yOut} ${bx},${by}`;
    }
    // 4. top -> top
    if (fromSide === 'top' && toSide === 'top') {
      const yOut = Math.round(Math.min(ay, by) - STUB);
      if (Math.abs(ax - bx) < 32 && Math.abs(ay - by) > 20) {
        const y1 = Math.round(ay - STUB);
        const mx = Math.round(Math.max(ax, bx) + 32);
        return `${ax},${ay} ${ax},${y1} ${mx},${y1} ${mx},${yOut} ${bx},${yOut} ${bx},${by}`;
      }
      return `${ax},${ay} ${ax},${yOut} ${bx},${yOut} ${bx},${by}`;
    }
  }

  if (!fromVert && !toVert) {
    if (fromSide !== toSide && ((fromSide === 'right' && bx >= ax - 2) || (fromSide === 'left' && bx <= ax + 2))) {
      if (Math.abs(ay - by) <= 1.5) return `${ax},${ay} ${bx},${by}`;
      const mx = Math.round((ax + bx) / 2);
      return `${ax},${ay} ${mx},${ay} ${mx},${by} ${bx},${by}`;
    }
    const xOut = fromSide === 'left' ? Math.round(Math.min(ax, bx) - STUB) : Math.round(Math.max(ax, bx) + STUB);
    return `${ax},${ay} ${xOut},${ay} ${xOut},${by} ${bx},${by}`;
  }

  if (fromVert && !toVert) {
    if ((fromSide === 'bottom' && by >= ay) || (fromSide === 'top' && by <= ay)) {
      return `${ax},${ay} ${ax},${by} ${bx},${by}`;
    }
    const y1 = fromSide === 'bottom' ? Math.round(ay + STUB) : Math.round(ay - STUB);
    return `${ax},${ay} ${ax},${y1} ${bx},${y1} ${bx},${by}`;
  }

  if ((toSide === 'top' && by >= ay) || (toSide === 'bottom' && by <= ay)) {
    return `${ax},${ay} ${bx},${ay} ${bx},${by}`;
  }
  const x1 = fromSide === 'right' ? Math.round(ax + STUB) : Math.round(ax - STUB);
  return `${ax},${ay} ${x1},${ay} ${x1},${by} ${bx},${by}`;
}
window.computeWirePoints = computeWirePoints;

function resolveComponentPort(g, portIndex, portLabel) {
  if (!g) return null;
  const ports = absolutePorts(g);
  if (!ports.length) return null;
  const idx = Number(portIndex);
  if (portIndex !== undefined && portIndex !== '' && Number.isInteger(idx) && ports[idx]) {
    return ports[idx];
  }
  if (portLabel !== undefined && portLabel !== '') {
    const byLabel = ports.find(p => p.label === portLabel);
    if (byLabel) return byLabel;
  }
  return ports[0];
}
window.resolveComponentPort = resolveComponentPort;

function refreshWiresForComponent(moved) {
  const layer = document.getElementById('wireLayer');
  if (!layer) return;
  const targetUid = moved?.dataset?.uid;
  for (const wire of layer.querySelectorAll('.connected-wire')) {
    if (targetUid && wire.dataset.fromG !== targetUid && wire.dataset.toG !== targetUid) continue;
    const aG = document.querySelector(`#dropLayer .dropped-symbol[data-uid="${wire.dataset.fromG}"]`);
    const bG = document.querySelector(`#dropLayer .dropped-symbol[data-uid="${wire.dataset.toG}"]`);
    if (!aG || !bG) continue;
    const a = resolveComponentPort(aG, wire.dataset.fromIndex, wire.dataset.from);
    const b = resolveComponentPort(bG, wire.dataset.toIndex, wire.dataset.to);
    if (!a || !b) continue;
    let waypoints = [];
    if (!targetUid && wire.dataset.waypoints) {
      try { waypoints = JSON.parse(wire.dataset.waypoints) || []; } catch (_) {}
    } else if (targetUid) {
      delete wire.dataset.waypoints;
    }
    wire.setAttribute('points', computeWirePoints(a, b, waypoints));
  }
}
window.refreshWiresForComponent = refreshWiresForComponent;

function refreshAllWires() {
  refreshWiresForComponent(null);
}
window.refreshAllWires = refreshAllWires;

function syncConnectedPortStates() {
  const allPortEls = document.querySelectorAll('#dropLayer .mag-port');
  allPortEls.forEach(el => el.classList.remove('connected'));
  const wires = document.querySelectorAll('#wireLayer .connected-wire');
  wires.forEach(w => {
    const aG = document.querySelector(`#dropLayer .dropped-symbol[data-uid="${w.dataset.fromG}"]`);
    const bG = document.querySelector(`#dropLayer .dropped-symbol[data-uid="${w.dataset.toG}"]`);
    const a = resolveComponentPort(aG, w.dataset.fromIndex, w.dataset.from);
    const b = resolveComponentPort(bG, w.dataset.toIndex, w.dataset.to);
    if (a?.el) a.el.classList.add('connected');
    if (b?.el) b.el.classList.add('connected');
  });
}
window.syncConnectedPortStates = syncConnectedPortStates;

(function initMagneticWiring() {
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = document.getElementById('schematic');
  const dropLayerEl = document.getElementById('dropLayer');
  if (!svgEl || !dropLayerEl) return;

  let wireLayer = document.getElementById('wireLayer');
  if (!wireLayer) {
    wireLayer = document.createElementNS(NS, 'g');
    wireLayer.setAttribute('id', 'wireLayer');
    svgEl.insertBefore(wireLayer, dropLayerEl);
  }

  const guideLayer = document.createElementNS(NS, 'g');
  guideLayer.setAttribute('id', 'wireGuides');
  const guideX = document.createElementNS(NS, 'line');
  const guideY = document.createElementNS(NS, 'line');
  [guideX, guideY].forEach(l => { l.setAttribute('class', 'wire-guide'); guideLayer.appendChild(l); });
  svgEl.appendChild(guideLayer);

  const preview = document.createElementNS(NS, 'polyline');
  preview.setAttribute('class', 'wire-preview');
  preview.setAttribute('points', '');
  preview.style.display = 'none';
  wireLayer.appendChild(preview);

  function allPorts() {
    const out = [];
    document.querySelectorAll('#dropLayer .dropped-symbol').forEach(g => {
      absolutePorts(g).forEach(p => out.push(p));
    });
    return out;
  }
  window.allWorkspacePorts = allPorts;

  function resolvePortFromEvent(e, snapRadius = 11) {
    const directEl = e.target && e.target.closest ? e.target.closest('.mag-port') : null;
    if (directEl) {
      const g = directEl.closest('.dropped-symbol');
      if (g) {
        const p = resolveComponentPort(g, directEl.dataset.portIndex, directEl.dataset.port);
        if (p) return { ...p, el: directEl };
      }
    }
    if (snapRadius <= 0 || e.clientX == null || e.clientY == null) return null;
    const pt = getPoint(e);
    let best = null, bestD = snapRadius;
    for (const p of allPorts()) {
      const d = Math.hypot(p.x - pt.x, p.y - pt.y);
      if (d <= bestD) {
        best = p;
        bestD = d;
      }
    }
    return best;
  }
  window.resolvePortFromEvent = resolvePortFromEvent;

  function findNearestTargetPort(pt, sourcePort, maxDist = 16) {
    let best = null, bestD = maxDist;
    for (const p of allPorts()) {
      if (sourcePort && p.g === sourcePort.g && p.index === sourcePort.index) continue;
      const d = Math.hypot(p.x - pt.x, p.y - pt.y);
      if (d <= bestD) {
        best = p;
        bestD = d;
      }
    }
    return best;
  }

  let activePort = null;
  let selectedPort = null;
  let justCompletedOnDown = false;
  window.selectedWire = null;
  window.__escWiringActive = false;

  function clearConnectTargets() {
    document.querySelectorAll('#dropLayer .mag-port.connect-target').forEach(el => el.classList.remove('connect-target'));
  }

  function hideWireGuides() {
    guideX.style.display = 'none';
    guideY.style.display = 'none';
    preview.style.display = 'none';
    clearConnectTargets();
  }

  function selectWire(wireEl) {
    document.querySelectorAll('#wireLayer .connected-wire.wire-selected').forEach(w => w.classList.remove('wire-selected'));
    window.selectedWire = wireEl || null;
    if (wireEl) {
      select(null);
      wireEl.classList.add('wire-selected');
      state.textContent = `SELECTED WIRE • ${wireEl.dataset.from || '1'} ↔ ${wireEl.dataset.to || '2'} • PRESS DELETE TO REMOVE`;
    }
  }
  window.selectWire = selectWire;

  function selectTerminal(portInfo) {
    document.querySelectorAll('#dropLayer .mag-port.port-selected').forEach(el => el.classList.remove('port-selected'));
    selectedPort = portInfo || null;
    if (portInfo && portInfo.el) {
      portInfo.el.classList.add('port-selected');
    }
  }
  window.selectTerminal = selectTerminal;

  function cancelActiveWiring(msg = 'WIRING CANCELLED') {
    if (activePort && activePort.el) {
      activePort.el.classList.remove('port-active', 'selected');
    }
    document.querySelectorAll('#dropLayer .mag-port.port-active, #dropLayer .mag-port.selected').forEach(el => {
      el.classList.remove('port-active', 'selected');
    });
    activePort = null;
    window.__escWiringActive = false;
    hideWireGuides();
    if (msg && state) state.textContent = msg;
  }
  window.cancelActiveWiring = cancelActiveWiring;

  function createWireConnection(fromPort, toPort, waypoints = []) {
    if (!fromPort || !toPort || !fromPort.g || !toPort.g) return null;
    if (!fromPort.g.dataset.uid) fromPort.g.dataset.uid = 'C' + Date.now().toString(36);
    if (!toPort.g.dataset.uid) toPort.g.dataset.uid = 'C' + Date.now().toString(36);

    const freshFrom = resolveComponentPort(fromPort.g, fromPort.index, fromPort.label) || fromPort;
    const freshTo = resolveComponentPort(toPort.g, toPort.index, toPort.label) || toPort;

    const line = document.createElementNS(NS, 'polyline');
    line.setAttribute('class', 'connected-wire');
    line.setAttribute('points', computeWirePoints(freshFrom, freshTo, waypoints));
    line.dataset.from = freshFrom.label;
    line.dataset.to = freshTo.label;
    line.dataset.fromIndex = String(freshFrom.index);
    line.dataset.toIndex = String(freshTo.index);
    line.dataset.fromType = freshFrom.g.dataset.type || '';
    line.dataset.toType = freshTo.g.dataset.type || '';
    line.dataset.fromG = freshFrom.g.dataset.uid;
    line.dataset.toG = freshTo.g.dataset.uid;
    if (waypoints && waypoints.length) {
      line.dataset.waypoints = JSON.stringify(waypoints);
    }

    if (preview.parentNode === wireLayer) {
      wireLayer.insertBefore(line, preview);
    } else {
      wireLayer.appendChild(line);
    }

    if (activePort && activePort.el) {
      activePort.el.classList.remove('port-active', 'selected');
    }
    // A completed connection must not leave either endpoint glowing.
    // Terminal glow is reserved for hover and the in-progress wire source.
    selectTerminal(null);
    syncConnectedPortStates();
    const fromRef = freshFrom.g.dataset.ref || freshFrom.g.dataset.name || 'C1';
    const toRef = freshTo.g.dataset.ref || freshTo.g.dataset.name || 'C2';
    state.textContent = `CONNECTED • ${fromRef}:${freshFrom.label} ↔ ${toRef}:${freshTo.label}`;
    activePort = null;
    window.__escWiringActive = false;
    hideWireGuides();
    return line;
  }
  window.createWireConnection = createWireConnection;

  function startWiringFromPort(portInfo, pointerId = null) {
    selectWire(null);
    selectTerminal(portInfo);
    activePort = {
      ...portInfo,
      waypoints: [],
      pointerId,
      dragged: false
    };
    window.__escWiringActive = true;
    if (portInfo.el) {
      portInfo.el.classList.add('port-active', 'port-selected', 'selected');
    }
    preview.setAttribute('points', `${portInfo.x},${portInfo.y} ${portInfo.x},${portInfo.y}`);
    preview.style.display = 'block';
    const ref = portInfo.g.dataset.ref || portInfo.g.dataset.name || 'COMPONENT';
    state.textContent = `WIRE START • ${ref}:${portInfo.label} • CLICK DESTINATION TERMINAL`;
  }

  // Capture-phase pointerdown on svg handles terminal selection & wire initiation/completion before component drag
  svgEl.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    const hitPort = resolvePortFromEvent(e, 11);
    if (hitPort) {
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();

      if (!activePort) {
        justCompletedOnDown = false;
        startWiringFromPort(hitPort, e.pointerId);
        return;
      }

      // activePort is already set: check if clicking the exact same terminal or a target terminal
      if (activePort.g === hitPort.g && activePort.index === hitPort.index) {
        justCompletedOnDown = true;
        selectTerminal(null);
        cancelActiveWiring('WIRING CANCELLED');
        return;
      }

      // Clicked a different terminal: complete the wire connection!
      justCompletedOnDown = true;
      createWireConnection(activePort, hitPort, activePort.waypoints || []);
      return;
    }

    // Check if clicking an existing wire when not actively wiring
    if (!activePort) {
      const wireEl = e.target && e.target.closest ? e.target.closest('.connected-wire') : null;
      if (wireEl) {
        e.preventDefault();
        e.stopPropagation();
        selectWire(wireEl);
        return;
      }
      if (!e.target.closest('.dropped-symbol')) {
        selectWire(null);
        selectTerminal(null);
      }
    }
  }, true);

  // Live wire preview and magnetic target snapping during pointermove
  svgEl.addEventListener('pointermove', e => {
    const p = getPoint(e);
    if (!activePort) {
      // Highlight nearest terminal on hover
      clearConnectTargets();
      const hoverPort = resolvePortFromEvent(e, 10);
      if (hoverPort && hoverPort.el) hoverPort.el.classList.add('connect-target');
      return;
    }
    const freshStart = resolveComponentPort(activePort.g, activePort.index, activePort.label) || activePort;
    activePort.x = freshStart.x;
    activePort.y = freshStart.y;
    activePort.side = freshStart.side;

    if (Math.hypot(p.x - activePort.x, p.y - activePort.y) > 8) {
      activePort.dragged = true;
    }

    clearConnectTargets();
    const snapPort = findNearestTargetPort(p, activePort, 16);
    if (snapPort && snapPort.el) {
      snapPort.el.classList.add('connect-target');
    }
    const target = snapPort || { x: p.x, y: p.y };

    const vb = svgEl.viewBox.baseVal;
    const gx1 = vb ? vb.x - 2000 : -2000, gx2 = vb ? vb.x + vb.width + 2000 : 4000;
    const gy1 = vb ? vb.y - 2000 : -2000, gy2 = vb ? vb.y + vb.height + 2000 : 4000;
    guideX.setAttribute('x1', String(gx1)); guideX.setAttribute('y1', String(target.y));
    guideX.setAttribute('x2', String(gx2)); guideX.setAttribute('y2', String(target.y));
    guideY.setAttribute('x1', String(target.x)); guideY.setAttribute('y1', String(gy1));
    guideY.setAttribute('x2', String(target.x)); guideY.setAttribute('y2', String(gy2));
    guideX.style.display = 'block';
    guideY.style.display = 'block';

    preview.setAttribute('points', computeWirePoints(activePort, target, activePort.waypoints || []));
    preview.style.display = 'block';
  });

  // Support drag-and-release from Terminal 1 directly onto Terminal 2
  window.addEventListener('pointerup', e => {
    if (justCompletedOnDown) {
      justCompletedOnDown = false;
      return;
    }
    if (!activePort) return;
    const targetPort = resolvePortFromEvent(e, 16) || (e.clientX != null ? findNearestTargetPort(getPoint(e), activePort, 16) : null);
    if (targetPort && (targetPort.g !== activePort.g || targetPort.index !== activePort.index)) {
      e.preventDefault();
      e.stopPropagation();
      createWireConnection(activePort, targetPort, activePort.waypoints || []);
    }
  }, true);

  // Left-click on empty canvas while wiring adds a user-defined cable bend (waypoint)
  svgEl.addEventListener('click', e => {
    const hitPort = resolvePortFromEvent(e, 12);
    if (hitPort) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (!activePort) return;
    if (e.target.closest && (e.target.closest('.mag-port') || e.target.closest('.dropped-symbol'))) return;
    const p = getPoint(e);
    if (Math.hypot(p.x - activePort.x, p.y - activePort.y) < 10) return;
    activePort.waypoints.push({ x: Math.round(p.x), y: Math.round(p.y) });
    preview.setAttribute('points', computeWirePoints(activePort, { x: p.x, y: p.y }, activePort.waypoints));
    preview.style.display = 'block';
    state.textContent = `WIRE BEND ${activePort.waypoints.length} • CLICK DESTINATION TERMINAL OR RIGHT-CLICK TO CANCEL`;
  });

  // Right-click or Escape cancels unfinished cable
  svgEl.addEventListener('contextmenu', e => {
    if (!activePort) return;
    e.preventDefault();
    selectTerminal(null);
    cancelActiveWiring('WIRING CANCELLED');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (activePort) {
        selectTerminal(null);
        cancelActiveWiring('WIRING CANCELLED');
      } else {
        selectTerminal(null);
        selectWire(null);
      }
    }
  });

  const hint = document.querySelector('.hint');
  if (hint) hint.textContent = 'Click or drag between component terminals to connect wires. Press Escape to cancel.';
})();

/* V13: component selection/move/delete keeps magnetic wiring attached. */
(function enhancePlacedComponents() {
  const svgEl = document.getElementById('schematic');
  const layer = document.getElementById('dropLayer');
  const wires = document.getElementById('wireLayer');
  if (!svgEl || !layer) return;

  let uid = 1;
  function ensureId(g) {
    if (!g.dataset.uid) g.dataset.uid = 'C' + (uid++);
    if (!g.querySelector(':scope > .component-ports .mag-port')) syncComponentPorts(g);
  }
  const obs = new MutationObserver(() => {
    layer.querySelectorAll('.dropped-symbol').forEach(ensureId);
    syncConnectedPortStates();
  });
  obs.observe(layer, { childList: true });
  layer.querySelectorAll('.dropped-symbol').forEach(ensureId);

  const transformObserver = new MutationObserver(records => {
    let changed = false;
    for (const r of records) {
      if (r.type === 'attributes' && r.attributeName === 'transform' && r.target.classList?.contains('dropped-symbol')) {
        changed = true;
        ensureId(r.target);
        refreshWiresForComponent(r.target);
      }
    }
    if (changed) syncConnectedPortStates();
  });
  transformObserver.observe(layer, { subtree: true, attributes: true, attributeFilter: ['transform'] });

  function removeComponentOrWire(g) {
    if (window.selectedWire && window.selectedWire.isConnected) {
      window.selectedWire.remove();
      window.selectedWire = null;
      syncConnectedPortStates();
      state.textContent = 'WIRE DELETED';
      return;
    }
    if (!g) return;
    if (wires) {
      [...wires.querySelectorAll('.connected-wire')].forEach(line => {
        if (line.dataset.fromG === g.dataset.uid || line.dataset.toG === g.dataset.uid) line.remove();
      });
    }
    if (typeof window.cancelActiveWiring === 'function') window.cancelActiveWiring('');
    g.remove();
    if (selected === g) selected = null;
    syncConnectedPortStates();
    state.textContent = 'DELETED';
  }
  document.getElementById('delete').onclick = () => {
    if (window.selectedWire || selected) removeComponentOrWire(selected);
    else state.textContent = 'CLICK A COMPONENT OR WIRE THEN PRESS DELETE';
  };
  document.addEventListener('keydown', e => {
    if (e.key === 'Delete' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement) && (window.selectedWire || selected)) {
      e.preventDefault();
      removeComponentOrWire(selected);
    }
  }, true);
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
 let lastLibraryDragEnd = 0;
 function attachCardEvents(){
  host.querySelectorAll('.cat-head').forEach(head=>head.addEventListener('click',()=>{const cat=head.parentElement;cat.classList.toggle('open');head.querySelector('i').textContent=cat.classList.contains('open')?'⌃':'⌄'}));
  host.querySelectorAll('.symbol-btn').forEach(b=>{
   b.addEventListener('dragstart',e=>{e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('application/json',JSON.stringify({type:b.dataset.symbol,name:b.dataset.name,ref:b.dataset.ref,accent:b.dataset.accent,symbolFile:b.dataset.file,simColor:b.dataset.simColor||(window.getEscLoadSimColor?window.getEscLoadSimColor(b.dataset.file):'#ff3b30')}));document.getElementById('dropOverlay').classList.add('show');state.textContent='DRAGGING • '+b.dataset.name.toUpperCase()});
   b.addEventListener('dragend',()=>{lastLibraryDragEnd=Date.now();document.getElementById('dropOverlay').classList.remove('show');});
    b.addEventListener('click',e=>{
     const dot=e.target.closest&&e.target.closest('.load-color-dot');
     if(dot){e.preventDefault();e.stopPropagation();if(window.setEscLoadSimColor)window.setEscLoadSimColor(dot.dataset.color,dot.dataset.file||null);paint();return;}
     if(Date.now()-lastLibraryDragEnd<500)return;
    const r=svg.getBoundingClientRect();
    const p=getPoint({clientX:r.left+r.width/2,clientY:r.top+r.height/2});
    const d={type:b.dataset.symbol,name:b.dataset.name,ref:b.dataset.ref,accent:b.dataset.accent,symbolFile:b.dataset.file,simColor:b.dataset.simColor||(window.getEscLoadSimColor?window.getEscLoadSimColor(b.dataset.file):'#ff3b30')};
    makeDropped(d,Math.round(p.x),Math.round(p.y));
    state.textContent='PLACED • '+d.name.toUpperCase();
    e.preventDefault();
   });
  });
 }
 function renderAssets(items){
  const libraryCategories = [
   {name:'Sources', color:'#00dba5'},
   {name:'Others', color:'#64748b'}, {name:'Coils', color:'#8b5cf6'},
   {name:'Auxiliary Contacts', color:'#d4a017'}, {name:'Switches', color:'#06b6d4'},
   {name:'Loads', color:'#f59e0b'}, {name:'Main Contacts', color:'#10b981'},
   {name:'Protections', color:'#ef4444'}, {name:'Motors', color:'#2563eb'},
   {name:'Proximity Sensor', color:'#f97316'}
  ];
  const categoryIcons = {
   'Sources':'<circle cx="12" cy="12" r="9"/><path d="M4 12c2-7 5-7 8 0s6 7 8 0"/>',
   'Others':'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
   'Coils':'<path d="M2 12h3c0-9 4-9 4 0s4 9 4 0 4-9 4 0 3 9 5 0"/>',
   'Auxiliary Contacts':'<path d="M12 3v18M3 12h9l7-7M12 12l7 7"/>','Auxiliaries':'<path d="M12 3v18M3 12h9l7-7M12 12l7 7"/>',
   'Switches':'<circle cx="5" cy="17" r="2"/><path d="M7 16 19 5M16 19h5"/>',
   'Loads':'<circle cx="12" cy="12" r="9"/><path d="m6 6 12 12M18 6 6 18"/>',
   'Main Contacts':'<path d="M5 3v18M19 3v18M2 8h6M16 16h6M8 8l8 8"/>','Contactors':'<path d="M5 3v18M19 3v18M2 8h6M16 16h6M8 8l8 8"/>',
   'Protections':'<path d="M7 3h10v18H7zM10 3V1h4v2M9 17l6-6"/>',
   'Motors':'<circle cx="12" cy="12" r="9"/><path d="M2 12h3M19 12h3"/><text x="12" y="16" text-anchor="middle" font-size="11" fill="currentColor" stroke="none">M</text>',
   'Proximity Sensor':'<rect x="3" y="7" width="9" height="18" rx="1"/><path d="M16 10 Q23 16 16 22 M20 7 Q29 16 20 25 M24 4 Q34 16 24 28"/>'
  };
  const normalized = (items || []).map((it, i) => {
   const file = String(it.file || '').replace(/^\.\//,'');
   const name = it.name || it.original_filename || file.split('/').pop().replace(/\.svg$/i,'');
   const raw = String(it.category || '').toLowerCase() + ' ' + String(it.type || '').toLowerCase() + ' ' + name.toLowerCase();
   let category = 'Others';
   // Respect an explicit manifest category FIRST. Names like 'Auxiliary Contact 01'
   // must stay in Switches when the manifest says Switches; do not reclassify them.
   const declared = String(it.category || '').trim().toLowerCase();
   const explicitCategory = {
    'power':'Sources','source':'Sources','sources':'Sources',
    'others':'Others','coils':'Coils','auxiliaries':'Auxiliary Contacts','auxiliary contacts':'Auxiliary Contacts',
    'switches':'Switches','loads':'Loads','contactors':'Main Contacts','main contacts':'Main Contacts',
    'protections':'Protections','motors':'Motors','proximity sensor':'Proximity Sensor'
   }[declared];
   if (explicitCategory) category = explicitCategory;
   else if (/coil|timer|tof|ton/.test(name.toLowerCase()) || /(?:^|\/)esc-(?:contactor|ton|tof).*coil\.svg$/i.test(file)) category = 'Coils';
   else if (/power|source|supply|terminal|earth|ground|battery|acdc|three.phase|dc.positive|dc.negative/.test(raw)) category = 'Sources';
   else if (/auxiliar|auxiliary|aux contact/.test(raw)) category = 'Auxiliary Contacts';
   else if (/switch|push.button|selector|isolator/.test(raw)) category = 'Switches';
   else if (/motor/.test(raw)) category = 'Motors';
   else if (/contactor|main contact/.test(raw)) category = 'Main Contacts';
   else if (/breaker|protection|fuse|overload|thermal/.test(raw)) category = 'Protections';
   else if (/lamp|load|bell|horn|buzzer|indicator/.test(raw)) category = 'Loads';
   return {...it, file, name, category, type:it.type || name};
  });
  let activeCategory = null;
  function paint(){
   const q = (document.getElementById('search')?.value || '').trim().toLowerCase();
   const filtered = normalized.filter(it => (activeCategory===null || it.category===activeCategory) && (!q || (it.name+' '+it.category+' '+it.type).toLowerCase().includes(q)));
   const loadPaletteBar = activeCategory === 'Loads' ? (
     '<div class="load-color-bar" aria-label="Load indicator colour options">' +
     '<span class="load-color-bar-label">Colour:</span>' +
     (window.ESC_LOAD_COLOR_OPTIONS || [{name:'Red',hex:'#ff3b30'},{name:'Green',hex:'#22c55e'},{name:'Yellow',hex:'#ffd21f'},{name:'Blue',hex:'#3b82f6'},{name:'Orange',hex:'#ff9500'},{name:'Cyan',hex:'#00e5ff'}]).map(c =>
       `<span role="button" tabindex="0" class="load-color-dot ${window.getEscLoadSimColor && window.getEscLoadSimColor()===c.hex?'active':''}" data-color="${c.hex}" title="${c.name} indicator colour" aria-label="${c.name}" style="background:${c.hex}"></span>`
     ).join('') + '</div>'
   ) : '';
   const resultMarkup = '<div class="component-results-head"><b>'+(activeCategory===null?'SELECT A CATEGORY':activeCategory.toUpperCase())+'</b><span>'+filtered.length+' symbols</span></div>' +
    loadPaletteBar +
    (filtered.length ? '<div class="component-results">'+filtered.map(it=>{
      const cardColor = (window.getEscLoadSimColor ? window.getEscLoadSimColor(it.file) : '#ff3b30');
      const cardDots = it.category === 'Loads' ? (
        '<span class="card-load-dots" role="group" aria-label="Load colour">' +
        (window.ESC_LOAD_COLOR_OPTIONS || [{name:'Red',hex:'#ff3b30'},{name:'Green',hex:'#22c55e'},{name:'Yellow',hex:'#ffd21f'},{name:'Blue',hex:'#3b82f6'}]).slice(0,4).map(c =>
          `<i class="load-color-dot card-dot ${cardColor===c.hex?'active':''}" data-color="${c.hex}" data-file="${it.file.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" title="${c.name}" style="background:${c.hex}"></i>`
        ).join('') + '</span>'
      ) : '';
      return `<button type="button" class="symbol-btn" draggable="true" title="Drag ${it.name} into the schematic" data-symbol="${String(it.type).replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" data-name="${String(it.name).replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" data-ref="" data-accent="#e9f1ed" data-sim-color="${cardColor}" data-file="${it.file.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}"><img src="${it.file}" alt="" loading="lazy" onerror="this.style.display='none'"><span>${it.name}</span>${cardDots}</button>`;
    }).join('')+'</div>' : '<div class="component-results"><div class="library-empty">No symbols match this category or search.</div></div>');
   host.innerHTML = '<div class="component-category-list" role="list" aria-label="Component categories">' +
    libraryCategories.map(c=>{const expanded=activeCategory===c.name;const count=normalized.filter(it=>it.category===c.name).length;return `<div class="library-category-wrap"><button type="button" class="component-category ${expanded?'active':''}" data-category="${c.name}" style="--category-accent:${c.color}" aria-pressed="${expanded}" aria-expanded="${expanded}"><span class="category-icon ${c.name==='Proximity Sensor'?'proximity-category-icon':''}" aria-hidden="true"><svg viewBox="0 0 36 32" focusable="false" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${categoryIcons[c.name]||''}</svg></span><span class="category-mark" aria-hidden="true"></span><span class="category-name">${c.name}</span><span class="category-count">(${count})</span><span class="category-chevron ${expanded?'expanded':''}" aria-hidden="true">›</span></button>${expanded?resultMarkup:''}</div>`}).join('') + '</div>';
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
 const embeddedSymbolManifest = {"project":"ELECTRICAL SIMU CKT","count":56,"symbols":[{"file":"components/Power/earth_ground(1).svg","name":"Earth Ground","category":"Sources","original_filename":"earth_ground(1).svg","type":"Earth Ground"},{"file":"components/Power/earth_pe(1).svg","name":"Earth PE","category":"Sources","original_filename":"earth_pe(1).svg","type":"Earth PE"},{"file":"components/Power/source_dc_negative(1).svg","name":"Source DC Negative","category":"Sources","original_filename":"source_dc_negative(1).svg","type":"Source DC Negative"},{"file":"components/Power/source_dc_positive(1).svg","name":"Source DC Positive","category":"Sources","original_filename":"source_dc_positive(1).svg","type":"Source DC Positive"},{"file":"components/Power/source_dc_supply_pair(1).svg","name":"Source DC Supply Pair","category":"Sources","original_filename":"source_dc_supply_pair(1).svg","type":"Source DC Supply Pair"},{"file":"components/Power/terminal_l1_l2_l3(1).svg","name":"Terminal L1 L2 L3","category":"Sources","original_filename":"terminal_l1_l2_l3(1).svg","type":"Terminal L1 L2 L3"},{"file":"components/Power/terminal_l1_l2_l3_n(1).svg","name":"Terminal L1 L2 L3 N","category":"Sources","original_filename":"terminal_l1_l2_l3_n(1).svg","type":"Terminal L1 L2 L3 N"},{"file":"components/Power/terminal_neutral_n(1).svg","name":"Terminal Neutral N","category":"Sources","original_filename":"terminal_neutral_n(1).svg","type":"Terminal Neutral N"},{"file":"components/Power/terminal_phase_l(1).svg","name":"Terminal Phase L","category":"Sources","original_filename":"terminal_phase_l(1).svg","type":"Terminal Phase L"},{"file":"components/Coils/coil_contactor.svg","name":"Contactor Coil","category":"Coils","original_filename":"coil_contactor.svg","type":"Contactor Coil"},{"file":"components/Coils/coil_tof_timer.svg","name":"TOF Timer Coil","category":"Coils","original_filename":"coil_tof_timer.svg","type":"TOF Timer Coil"},{"file":"components/Coils/coil_ton_timer.svg","name":"TON Timer Coil","category":"Coils","original_filename":"coil_ton_timer.svg","type":"TON Timer Coil"},{"file":"components/Coils/coil_ton_tof_timer.svg","name":"TON/TOF Timer Coil","category":"Coils","original_filename":"coil_ton_tof_timer.svg","type":"TON/TOF Timer Coil"},{"file":"components/Auxiliary Contacts/aux_contacts_nc.svg","name":"Aux Contacts NC","category":"Auxiliary Contacts","original_filename":"aux_contacts_nc.svg","type":"Aux Contacts NC"},{"file":"components/Auxiliary Contacts/aux_contacts_no.svg","name":"Aux Contacts NO","category":"Auxiliary Contacts","original_filename":"aux_contacts_no.svg","type":"Aux Contacts NO"},{"file":"components/Auxiliary Contacts/aux_contacts_off_delay_nc.svg","name":"Aux Contacts Off Delay NC","category":"Auxiliary Contacts","original_filename":"aux_contacts_off_delay_nc.svg","type":"Aux Contacts Off Delay NC"},{"file":"components/Auxiliary Contacts/aux_contacts_off_delay_no.svg","name":"Aux Contacts Off Delay NO","category":"Auxiliary Contacts","original_filename":"aux_contacts_off_delay_no.svg","type":"Aux Contacts Off Delay NO"},{"file":"components/Auxiliary Contacts/aux_contacts_on_delay_nc.svg","name":"Aux Contacts On Delay NC","category":"Auxiliary Contacts","original_filename":"aux_contacts_on_delay_nc.svg","type":"Aux Contacts On Delay NC"},{"file":"components/Auxiliary Contacts/aux_contacts_on_delay_no.svg","name":"Aux Contacts On Delay NO","category":"Auxiliary Contacts","original_filename":"aux_contacts_on_delay_no.svg","type":"Aux Contacts On Delay NO"},{"file":"components/Switches/switch_3_position_selector I-0-II(1).svg","name":"3-Position Selector Switch I-0-II","category":"Switches","original_filename":"switch_3_position_selector I-0-II(1).svg","type":"3-Position Selector Switch I-0-II"},{"file":"components/Switches/switch_3_position_selector I-II-III(1).svg","name":"3-Position Selector Switch I-II-III","category":"Switches","original_filename":"switch_3_position_selector I-II-III(1).svg","type":"3-Position Selector Switch I-II-III"},{"file":"components/Switches/switch_con(1).svg","name":"Switch Changeover (CON)","category":"Switches","original_filename":"switch_con(1).svg","type":"Switch Changeover (CON)"},{"file":"components/Switches/switch_nc(1).svg","name":"Switch NC","category":"Switches","original_filename":"switch_nc(1).svg","type":"Switch NC"},{"file":"components/Switches/switch_no(1).svg","name":"Switch NO","category":"Switches","original_filename":"switch_no(1).svg","type":"Switch NO"},{"file":"components/Switches/switch_pushbutton_con(1).svg","name":"Pushbutton Changeover (CON)","category":"Switches","original_filename":"switch_pushbutton_con(1).svg","type":"Pushbutton Changeover (CON)"},{"file":"components/Switches/switch_pushbutton_nc(1).svg","name":"Pushbutton NC","category":"Switches","original_filename":"switch_pushbutton_nc(1).svg","type":"Pushbutton NC"},{"file":"components/Switches/switch_pushbutton_no(1).svg","name":"Pushbutton NO","category":"Switches","original_filename":"switch_pushbutton_no(1).svg","type":"Pushbutton NO"},{"file":"components/Loads/load_beacon(2).svg","name":"Beacon","category":"Loads","original_filename":"load_beacon(2).svg","type":"Beacon"},{"file":"components/Loads/load_bell(2).svg","name":"Bell","category":"Loads","original_filename":"load_bell(2).svg","type":"Bell"},{"file":"components/Loads/load_blinking_pilot_lamp(2).svg","name":"Blinking Pilot Lamp","category":"Loads","original_filename":"load_blinking_pilot_lamp(2).svg","type":"Blinking Pilot Lamp"},{"file":"components/Loads/load_buzzer(2).svg","name":"Buzzer","category":"Loads","original_filename":"load_buzzer(2).svg","type":"Buzzer"},{"file":"components/Loads/load_light(2).svg","name":"Pilot Light","category":"Loads","original_filename":"load_light(2).svg","type":"Pilot Light"},{"file":"components/Main Contacts/main_contacts_1p_no(1).svg","name":"Main Contacts 1P NO","category":"Main Contacts","original_filename":"main_contacts_1p_no(1).svg","type":"Main Contacts 1P NO"},{"file":"components/Main Contacts/main_contacts_2p_no(1).svg","name":"Main Contacts 2P NO","category":"Main Contacts","original_filename":"main_contacts_2p_no(1).svg","type":"Main Contacts 2P NO"},{"file":"components/Main Contacts/main_contacts_3p_no(1).svg","name":"Main Contacts 3P NO","category":"Main Contacts","original_filename":"main_contacts_3p_no(1).svg","type":"Main Contacts 3P NO"},{"file":"components/Protections/protection_circuit_breaker_1p(1).svg","name":"Circuit Breaker 1P","category":"Protections","original_filename":"protection_circuit_breaker_1p(1).svg","type":"Circuit Breaker 1P"},{"file":"components/Protections/protection_circuit_breaker_2p(1).svg","name":"Circuit Breaker 2P","category":"Protections","original_filename":"protection_circuit_breaker_2p(1).svg","type":"Circuit Breaker 2P"},{"file":"components/Protections/protection_circuit_breaker_3p(1).svg","name":"Circuit Breaker 3P","category":"Protections","original_filename":"protection_circuit_breaker_3p(1).svg","type":"Circuit Breaker 3P"},{"file":"components/Protections/protection_fuse_1p(1).svg","name":"Fuse 1P","category":"Protections","original_filename":"protection_fuse_1p(1).svg","type":"Fuse 1P"},{"file":"components/Protections/protection_fuse_2p(1).svg","name":"Fuse 2P","category":"Protections","original_filename":"protection_fuse_2p(1).svg","type":"Fuse 2P"},{"file":"components/Protections/protection_fuse_3p(1).svg","name":"Fuse 3P","category":"Protections","original_filename":"protection_fuse_3p(1).svg","type":"Fuse 3P"},{"file":"components/Protections/protection_fuse_4p(1).svg","name":"Fuse 4P","category":"Protections","original_filename":"protection_fuse_4p(1).svg","type":"Fuse 4P"},{"file":"components/Protections/protection_fuse_isolator_1p(1).svg","name":"Fuse Isolator 1P","category":"Protections","original_filename":"protection_fuse_isolator_1p(1).svg","type":"Fuse Isolator 1P"},{"file":"components/Protections/protection_fuse_isolator_2p(1).svg","name":"Fuse Isolator 2P","category":"Protections","original_filename":"protection_fuse_isolator_2p(1).svg","type":"Fuse Isolator 2P"},{"file":"components/Protections/protection_fuse_isolator_3p(1).svg","name":"Fuse Isolator 3P","category":"Protections","original_filename":"protection_fuse_isolator_3p(1).svg","type":"Fuse Isolator 3P"},{"file":"components/Protections/protection_fuse_isolator_4p(1).svg","name":"Fuse Isolator 4P","category":"Protections","original_filename":"protection_fuse_isolator_4p(1).svg","type":"Fuse Isolator 4P"},{"file":"components/Protections/protection_motor_circuit_breaker_2p(1).svg","name":"Motor Circuit Breaker 2P","category":"Protections","original_filename":"protection_motor_circuit_breaker_2p(1).svg","type":"Motor Circuit Breaker 2P"},{"file":"components/Protections/protection_motor_circuit_breaker_3p(1).svg","name":"Motor Circuit Breaker 3P","category":"Protections","original_filename":"protection_motor_circuit_breaker_3p(1).svg","type":"Motor Circuit Breaker 3P"},{"file":"components/Protections/protection_thermal_overload_relay_2p(1).svg","name":"Thermal Overload Relay 2P","category":"Protections","original_filename":"protection_thermal_overload_relay_2p(1).svg","type":"Thermal Overload Relay 2P"},{"file":"components/Protections/protection_thermal_overload_relay_3p(1).svg","name":"Thermal Overload Relay 3P","category":"Protections","original_filename":"protection_thermal_overload_relay_3p(1).svg","type":"Thermal Overload Relay 3P"},{"file":"components/Motors/motor_dc_motor(2).svg","name":"DC Motor","category":"Motors","original_filename":"motor_dc_motor(2).svg","type":"DC Motor"},{"file":"components/Motors/motor_single_phase(2).svg","name":"Single-Phase Motor","category":"Motors","original_filename":"motor_single_phase(2).svg","type":"Single-Phase Motor"},{"file":"components/Motors/motor_three_phase(2).svg","name":"Three-Phase Motor","category":"Motors","original_filename":"motor_three_phase(2).svg","type":"Three-Phase Motor"},{"file":"components/Motors/motor_three_phase_star_delta(2).svg","name":"Three-Phase Star-Delta Motor","category":"Motors","original_filename":"motor_three_phase_star_delta(2).svg","type":"Three-Phase Star-Delta Motor"},{"file":"components/Proximity Sensor/proximity_sensor_npn_nc(2).svg","name":"Proximity Sensor NPN NC","category":"Proximity Sensor","original_filename":"proximity_sensor_npn_nc(2).svg","type":"Proximity Sensor NPN NC"},{"file":"components/Proximity Sensor/proximity_sensor_npn_no(2).svg","name":"Proximity Sensor NPN NO","category":"Proximity Sensor","original_filename":"proximity_sensor_npn_no(2).svg","type":"Proximity Sensor NPN NO"}]};
 const assetItems = (embeddedSymbolManifest.symbols || []).filter(it => it.file && /\.svg$/i.test(it.file));
 if (assetItems.length) renderAssets(assetItems);
 else {
   host.innerHTML = '<div class="library-error">No SVG symbols were found in the embedded library.</div>';
 }


 // Ensure original SVG asset metadata and exact terminal overlays stay synchronized when dropped.
 const priorMakeDropped=makeDropped;
 makeDropped=function(d,x,y){
   const g=priorMakeDropped(d,x,y);
   if(d.symbolFile){
    g.dataset.symbolFile=d.symbolFile;
    g.dataset.porttype=d.symbolFile;
    g.classList.add('original-svg-component');
    syncComponentPorts(g);
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
/* V51: make every placed component reliably selectable by click. The property inspector follows the clicked component. */
(function installClickSelectionFallback(){
  const layer=document.getElementById('dropLayer');
  if(!layer) return;
  layer.addEventListener('click', function(e){
    if(typeof window.resolvePortFromEvent==='function' && window.resolvePortFromEvent(e, 11)) return;
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
    if(typeof window.resolvePortFromEvent==='function' && window.resolvePortFromEvent(e, 11)) return;
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
    if (target && target.closest && target.closest('.mag-port')) return;
    if (typeof window.resolvePortFromEvent === 'function' && window.resolvePortFromEvent(e, 11)) return;
    const g = target && target.closest ? target.closest('#dropLayer .dropped-symbol') : null;
    if (!g) return;
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
  canvas.addEventListener('dblclick', openForEvent, true);
  canvas.addEventListener('click', function(e) {
    if (e.detail !== 2) return;
    openForEvent(e);
  }, true);
})();

/* V70: tight symbol outline and independent terminal-square selection. */
(function tightSymbolAndTerminalSelectionV70(){
 const layer=document.getElementById('dropLayer'); if(!layer)return;
 layer.addEventListener('pointerdown',e=>{
  const port = (typeof window.resolvePortFromEvent === 'function') ? window.resolvePortFromEvent(e, 11)?.el : (e.target&&e.target.closest?e.target.closest('.mag-port'):null);
  if(!port)return;
  document.querySelectorAll('#dropLayer .mag-port.port-selected').forEach(p=>p.classList.remove('port-selected'));
  port.classList.add('port-selected');
 },true);
 layer.addEventListener('click',e=>{
  if(e.target&&e.target.closest&&e.target.closest('.mag-port')) return;
  if(!e.target||!e.target.closest)return;
  const g=e.target.closest('.dropped-symbol'); if(g&&g.classList.contains('selected'))updateSelectionOutline(g);
 },true);
})();










/* ============================================================================
   ESC V120: Interactive Run-Mode Circuit Simulation Engine
   - Inline SVG rendering for all 58 library components
   - Interactive switch, pushbutton, selector, breaker, isolator & contact actuation on click in RUN mode
   - Round colour option in Loads component list + live colour change for energized Loads & Coils
   - Full electrical continuity & potential solver (+ / -, Phase / Neutral, 3-Phase L1/L2/L3)
   - Automatic Contactor/Timer Coil -> Main Contacts & Auxiliary Contacts actuation
   - 3-Phase (UVW), Single-Phase, and DC Motor running animation in workspace under RUN mode
   ============================================================================ */
const SVG_INLINE_CATALOG = {"earth_ground(1).svg":{"vb":"-31.72 59.15 442.45 471.95","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.922941 0 36.3795)\" x1=\"191\" x2=\"191\" y1=\"97.9\" y2=\"414.39\"/>\n  <path d=\"m181.25,95.47l2.75,-4.36l4.75,-2.52l5.5,0.0l4.75,2.52l2.75,4.36l0.0,5.04l-2.75,4.36l-4.75,2.52l-5.5,0.0l-4.75,-2.52l-2.75,-4.36l0.0,-5.04z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.922941 0 36.3795)\"/>\n  <line fill=\"none\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.922941 0 36.3795)\" x1=\"44\" x2=\"335\" y1=\"418\" y2=\"416.19\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.922941 0 36.3795)\" x1=\"109\" x2=\"273\" y1=\"445.95\" y2=\"445.95\"/>\n  <line fill=\"none\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.922941 0 36.3795)\" x1=\"143\" x2=\"243\" y1=\"472.1\" y2=\"472.1\"/>\n </g>"},"earth_ground.svg":{"vb":"-31.72 59.15 442.45 471.95","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.922941 0 36.3795)\" x1=\"191\" x2=\"191\" y1=\"97.9\" y2=\"414.39\"/>\n  <path d=\"m181.25,95.47l2.75,-4.36l4.75,-2.52l5.5,0.0l4.75,2.52l2.75,4.36l0.0,5.04l-2.75,4.36l-4.75,2.52l-5.5,0.0l-4.75,-2.52l-2.75,-4.36l0.0,-5.04z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.922941 0 36.3795)\"/>\n  <line fill=\"none\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.922941 0 36.3795)\" x1=\"44\" x2=\"335\" y1=\"418\" y2=\"416.19\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.922941 0 36.3795)\" x1=\"109\" x2=\"273\" y1=\"445.95\" y2=\"445.95\"/>\n  <line fill=\"none\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.922941 0 36.3795)\" x1=\"143\" x2=\"243\" y1=\"472.1\" y2=\"472.1\"/>\n </g>"},"earth_pe(1).svg":{"vb":"-25.5 57.33 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <ellipse cx=\"240\" cy=\"120\" fill=\"none\" id=\"svg_11\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969009 -48 54.4876)\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" x1=\"192\" x2=\"192\" y1=\"225.6\" y2=\"442.09\"/>\n  <path d=\"m182.75,447.53l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.54l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.54z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" font-style=\"normal\" font-weight=\"normal\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1 0 0 0.969009 -48 54.4876) matrix(2.98998 0 0 2.42294 119.911 -430.792)\" x=\"41\" xml:space=\"preserve\" y=\"236\">PE</text>\n </g>"},"earth_pe.svg":{"vb":"-25.5 57.33 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <ellipse cx=\"240\" cy=\"120\" fill=\"none\" id=\"svg_11\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969009 -48 54.4876)\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" x1=\"192\" x2=\"192\" y1=\"225.6\" y2=\"442.09\"/>\n  <path d=\"m182.75,447.53l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.54l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.54z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" font-style=\"normal\" font-weight=\"normal\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1 0 0 0.969009 -48 54.4876) matrix(2.98998 0 0 2.42294 119.911 -430.792)\" x=\"41\" xml:space=\"preserve\" y=\"236\">PE</text>\n </g>"},"source_dc_negative(1).svg":{"vb":"-16.5 52.84 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <ellipse cx=\"250\" cy=\"120\" fill=\"none\" id=\"svg_11\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.976757 -49 48.1157)\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1.05324 -49 17.0546)\" x1=\"250\" x2=\"250\" y1=\"190\" y2=\"400\"/>\n  <line fill=\"none\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.976757 -49 48.1157)\" x1=\"205\" x2=\"293\" y1=\"122\" y2=\"122\"/>\n  <path d=\"m240.75,405.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.976757 -49 48.1157)\"/>\n </g>"},"source_dc_negative.svg":{"vb":"-16.5 52.84 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <ellipse cx=\"250\" cy=\"120\" fill=\"none\" id=\"svg_11\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.976757 -49 48.1157)\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1.05324 -49 17.0546)\" x1=\"250\" x2=\"250\" y1=\"190\" y2=\"400\"/>\n  <line fill=\"none\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.976757 -49 48.1157)\" x1=\"205\" x2=\"293\" y1=\"122\" y2=\"122\"/>\n  <path d=\"m240.75,405.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.976757 -49 48.1157)\"/>\n </g>"},"source_dc_positive(1).svg":{"vb":"-24.5 52.85 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <ellipse cx=\"240\" cy=\"120\" fill=\"none\" id=\"svg_11\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.981922 -47 46.8677)\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1.06301 -47 33.1866)\" x1=\"240\" x2=\"240\" y1=\"174.72\" y2=\"384.72\"/>\n  <line fill=\"none\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"10\" transform=\"translate(0 0) matrix(1 0 0 0.981922 -47 46.8677)\" x1=\"196\" x2=\"283\" y1=\"120\" y2=\"120\"/>\n  <path d=\"m230.75,405.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.981922 -47 46.8677)\"/>\n  <line fill=\"none\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0 0.981922 -1 0 314 -69.981)\" x1=\"196\" x2=\"281\" y1=\"121\" y2=\"121\"/>\n </g>"},"source_dc_positive.svg":{"vb":"-24.5 52.85 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <ellipse cx=\"240\" cy=\"120\" fill=\"none\" id=\"svg_11\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.981922 -47 46.8677)\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1.06301 -47 33.1866)\" x1=\"240\" x2=\"240\" y1=\"174.72\" y2=\"384.72\"/>\n  <line fill=\"none\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"10\" transform=\"translate(0 0) matrix(1 0 0 0.981922 -47 46.8677)\" x1=\"196\" x2=\"283\" y1=\"120\" y2=\"120\"/>\n  <path d=\"m230.75,405.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.981922 -47 46.8677)\"/>\n  <line fill=\"none\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0 0.981922 -1 0 314 -69.981)\" x1=\"196\" x2=\"281\" y1=\"121\" y2=\"121\"/>\n </g>"},"source_dc_supply_pair(1).svg":{"vb":"83.0 50.41 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <ellipse cx=\"240\" cy=\"120\" fill=\"none\" id=\"svg_11\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964227 -40 48.7171)\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1.04515 -40 15.846)\" x1=\"240\" x2=\"240\" y1=\"190\" y2=\"400\"/>\n  <line fill=\"none\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964227 -40 48.7171)\" x1=\"199\" x2=\"282\" y1=\"120\" y2=\"120\"/>\n  <path d=\"m231.75,405.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.964227 -40 48.7171)\"/>\n  <line fill=\"none\" id=\"svg_28\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964227 -40 48.7171)\" x1=\"240\" x2=\"240\" y1=\"76\" y2=\"164\"/>\n  <ellipse cx=\"527\" cy=\"117.93\" fill=\"none\" id=\"svg_33\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964227 -126 48.7171)\"/>\n  <line fill=\"none\" id=\"svg_32\" stroke=\"#666666\" stroke-width=\"10\" x1=\"401\" x2=\"401\" y1=\"209.92\" y2=\"438.41\"/>\n  <line fill=\"none\" id=\"svg_31\" stroke=\"#666666\" stroke-width=\"10\" x1=\"361\" x2=\"443\" y1=\"164.42\" y2=\"164.42\"/>\n  <path d=\"m392.74,441.83l2.35,-3.92l4.06,-2.26l4.69,0.0l4.06,2.26l2.35,3.92l0.0,4.52l-2.35,3.92l-4.06,2.26l-4.69,0.0l-4.06,-2.26l-2.35,-3.92l0.0,-4.52z\" fill=\"#666666\" id=\"svg_30\" stroke=\"#666666\" stroke-width=\"0\" transform=\"translate(0 0)\"/>\n </g>"},"source_dc_supply_pair.svg":{"vb":"83.0 50.41 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <ellipse cx=\"240\" cy=\"120\" fill=\"none\" id=\"svg_11\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964227 -40 48.7171)\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1.04515 -40 15.846)\" x1=\"240\" x2=\"240\" y1=\"190\" y2=\"400\"/>\n  <line fill=\"none\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964227 -40 48.7171)\" x1=\"199\" x2=\"282\" y1=\"120\" y2=\"120\"/>\n  <path d=\"m231.75,405.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.964227 -40 48.7171)\"/>\n  <line fill=\"none\" id=\"svg_28\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964227 -40 48.7171)\" x1=\"240\" x2=\"240\" y1=\"76\" y2=\"164\"/>\n  <ellipse cx=\"527\" cy=\"117.93\" fill=\"none\" id=\"svg_33\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964227 -126 48.7171)\"/>\n  <line fill=\"none\" id=\"svg_32\" stroke=\"#666666\" stroke-width=\"10\" x1=\"401\" x2=\"401\" y1=\"209.92\" y2=\"438.41\"/>\n  <line fill=\"none\" id=\"svg_31\" stroke=\"#666666\" stroke-width=\"10\" x1=\"361\" x2=\"443\" y1=\"164.42\" y2=\"164.42\"/>\n  <path d=\"m392.74,441.83l2.35,-3.92l4.06,-2.26l4.69,0.0l4.06,2.26l2.35,3.92l0.0,4.52l-2.35,3.92l-4.06,2.26l-4.69,0.0l-4.06,-2.26l-2.35,-3.92l0.0,-4.52z\" fill=\"#666666\" id=\"svg_30\" stroke=\"#666666\" stroke-width=\"0\" transform=\"translate(0 0)\"/>\n </g>"},"terminal_l1_l2_l3(1).svg":{"vb":"9.88 51.92 579.24 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1 0 0 0.971821 -21 41.6344) matrix(3.23577 0 0 3.04422 -46.524 -681.086)\" x=\"51\" xml:space=\"preserve\" y=\"275\">L1</text>\n  <ellipse cx=\"406\" cy=\"125.91\" fill=\"none\" id=\"svg_33\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971821 -104 40.6344)\"/>\n  <line fill=\"none\" id=\"svg_32\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1.07211 -83 -33.3058)\" x1=\"385\" x2=\"385\" y1=\"232.03\" y2=\"442.11\"/>\n  <path d=\"m375.74,445.6l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.56l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.56z\" fill=\"#666666\" id=\"svg_30\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 -83 -1)\"/>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1 0 0 1 -83 -1) matrix(1 0 0 0.971821 -21 41.6344) matrix(3.23577 0 0 3.04422 251.476 -683.086)\" x=\"47.6\" xml:space=\"preserve\" y=\"273.99\">L2</text>\n  <ellipse cx=\"695\" cy=\"123.86\" fill=\"none\" id=\"svg_4\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971821 -195 42.6344)\"/>\n  <line fill=\"none\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1.06788 -174 -29.2093)\" x1=\"674\" x2=\"674\" y1=\"230.03\" y2=\"439.11\"/>\n  <path d=\"m664.74,443.6l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.56l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.56z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 -174 1)\"/>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1 0 0 1 -174 1) matrix(1 0 0 0.971821 -21 41.6344) matrix(3.23577 0 0 3.04422 534.476 -683.086)\" x=\"50.69\" xml:space=\"preserve\" y=\"273.31\">L3</text>\n  <ellipse cx=\"118\" cy=\"130\" fill=\"none\" id=\"svg_11\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971821 -19 37.6344)\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1.03482 -19 11.4192)\" x1=\"118\" x2=\"118\" y1=\"200\" y2=\"410\"/>\n  <path d=\"m109.75,415.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.971821 -19 37.6344)\"/>\n </g>"},"terminal_l1_l2_l3.svg":{"vb":"9.88 51.92 579.24 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1 0 0 0.971821 -21 41.6344) matrix(3.23577 0 0 3.04422 -46.524 -681.086)\" x=\"51\" xml:space=\"preserve\" y=\"275\">L1</text>\n  <ellipse cx=\"406\" cy=\"125.91\" fill=\"none\" id=\"svg_33\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971821 -104 40.6344)\"/>\n  <line fill=\"none\" id=\"svg_32\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1.07211 -83 -33.3058)\" x1=\"385\" x2=\"385\" y1=\"232.03\" y2=\"442.11\"/>\n  <path d=\"m375.74,445.6l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.56l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.56z\" fill=\"#666666\" id=\"svg_30\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 -83 -1)\"/>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1 0 0 1 -83 -1) matrix(1 0 0 0.971821 -21 41.6344) matrix(3.23577 0 0 3.04422 251.476 -683.086)\" x=\"47.6\" xml:space=\"preserve\" y=\"273.99\">L2</text>\n  <ellipse cx=\"695\" cy=\"123.86\" fill=\"none\" id=\"svg_4\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971821 -195 42.6344)\"/>\n  <line fill=\"none\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1.06788 -174 -29.2093)\" x1=\"674\" x2=\"674\" y1=\"230.03\" y2=\"439.11\"/>\n  <path d=\"m664.74,443.6l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.56l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.56z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 -174 1)\"/>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1 0 0 1 -174 1) matrix(1 0 0 0.971821 -21 41.6344) matrix(3.23577 0 0 3.04422 534.476 -683.086)\" x=\"50.69\" xml:space=\"preserve\" y=\"273.31\">L3</text>\n  <ellipse cx=\"118\" cy=\"130\" fill=\"none\" id=\"svg_11\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971821 -19 37.6344)\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1.03482 -19 11.4192)\" x1=\"118\" x2=\"118\" y1=\"200\" y2=\"410\"/>\n  <path d=\"m109.75,415.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.971821 -19 37.6344)\"/>\n </g>"},"terminal_l1_l2_l3_n(1).svg":{"vb":"9.88 52.41 778.24 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <ellipse cx=\"100\" cy=\"126.9\" fill=\"none\" id=\"svg_11\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969571 -1 39.6432)\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" x1=\"99\" x2=\"99\" y1=\"211.56\" y2=\"439.17\"/>\n  <path d=\"m90.75,444.61l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.54l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.54z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <ellipse cx=\"302\" cy=\"129.13\" fill=\"none\" id=\"svg_33\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969571 -1 39.6432)\"/>\n  <line fill=\"none\" id=\"svg_32\" stroke=\"#666666\" stroke-width=\"10\" x1=\"301\" x2=\"301\" y1=\"212.71\" y2=\"444.32\"/>\n  <path d=\"m291.74,445.79l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.54l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.54z\" fill=\"#666666\" id=\"svg_30\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <ellipse cx=\"501\" cy=\"126.94\" fill=\"none\" id=\"svg_4\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969571 -1 39.6432)\"/>\n  <line fill=\"none\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"500\" x2=\"500\" y1=\"211.59\" y2=\"444.2\"/>\n  <path d=\"m490.74,443.67l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.54l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.54z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(3.23577 0 0 2.95159 -47.524 -620.718)\" x=\"45.44\" xml:space=\"preserve\" y=\"273.99\">L1</text>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1 0 0 0.969571 -1 39.6432) matrix(3.23577 0 0 3.04422 249.476 -687.086)\" x=\"16.08\" xml:space=\"preserve\" y=\"276.36\">L2</text>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(3.23577 0 0 2.95159 555.476 -622.657)\" x=\"-16.06\" xml:space=\"preserve\" y=\"274.32\">L3</text>\n  <ellipse cx=\"700\" cy=\"127.97\" fill=\"none\" id=\"svg_12\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969571 -1 39.6432)\"/>\n  <line fill=\"none\" id=\"svg_9\" stroke=\"#666666\" stroke-width=\"10\" x1=\"700\" x2=\"700\" y1=\"212.32\" y2=\"441.47\"/>\n  <path d=\"m690.74,441.67l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.54l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.54z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(3.96865 0 0 2.95159 807.099 -622.657)\" x=\"-26.86\" xml:space=\"preserve\" y=\"274.66\">N</text>\n </g>"},"terminal_l1_l2_l3_n.svg":{"vb":"9.88 52.41 778.24 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <ellipse cx=\"100\" cy=\"126.9\" fill=\"none\" id=\"svg_11\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969571 -1 39.6432)\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" x1=\"99\" x2=\"99\" y1=\"211.56\" y2=\"439.17\"/>\n  <path d=\"m90.75,444.61l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.54l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.54z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <ellipse cx=\"302\" cy=\"129.13\" fill=\"none\" id=\"svg_33\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969571 -1 39.6432)\"/>\n  <line fill=\"none\" id=\"svg_32\" stroke=\"#666666\" stroke-width=\"10\" x1=\"301\" x2=\"301\" y1=\"212.71\" y2=\"444.32\"/>\n  <path d=\"m291.74,445.79l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.54l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.54z\" fill=\"#666666\" id=\"svg_30\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <ellipse cx=\"501\" cy=\"126.94\" fill=\"none\" id=\"svg_4\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969571 -1 39.6432)\"/>\n  <line fill=\"none\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"500\" x2=\"500\" y1=\"211.59\" y2=\"444.2\"/>\n  <path d=\"m490.74,443.67l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.54l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.54z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(3.23577 0 0 2.95159 -47.524 -620.718)\" x=\"45.44\" xml:space=\"preserve\" y=\"273.99\">L1</text>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1 0 0 0.969571 -1 39.6432) matrix(3.23577 0 0 3.04422 249.476 -687.086)\" x=\"16.08\" xml:space=\"preserve\" y=\"276.36\">L2</text>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(3.23577 0 0 2.95159 555.476 -622.657)\" x=\"-16.06\" xml:space=\"preserve\" y=\"274.32\">L3</text>\n  <ellipse cx=\"700\" cy=\"127.97\" fill=\"none\" id=\"svg_12\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969571 -1 39.6432)\"/>\n  <line fill=\"none\" id=\"svg_9\" stroke=\"#666666\" stroke-width=\"10\" x1=\"700\" x2=\"700\" y1=\"212.32\" y2=\"441.47\"/>\n  <path d=\"m690.74,441.67l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.54l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.54z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(3.96865 0 0 2.95159 807.099 -622.657)\" x=\"-26.86\" xml:space=\"preserve\" y=\"274.66\">N</text>\n </g>"},"terminal_neutral_n(1).svg":{"vb":"-24.5 55.34 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <ellipse cx=\"213\" cy=\"121\" fill=\"none\" id=\"svg_11\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969009 -20 51.5186)\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1.03646 -20 24.0531)\" x1=\"213\" x2=\"213\" y1=\"191\" y2=\"401\"/>\n  <path d=\"m203.75,406.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.969009 -20 51.5186)\"/>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" font-weight=\"bold\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(3.23822 0 0 2.66355 -59.8193 -527.269)\" x=\"77.46\" xml:space=\"preserve\" y=\"270\">N</text>\n  <text fill=\"#666666\" font-family=\"Helvetica\" font-size=\"24\" font-weight=\"bold\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1 0 0 0.969009 -20 51.5186) matrix(6.88455 0 0 4.2203 196.621 -910.288)\" x=\"79\" xml:space=\"preserve\" y=\"270\"/>\n </g>"},"terminal_neutral_n.svg":{"vb":"-24.5 55.34 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <ellipse cx=\"213\" cy=\"121\" fill=\"none\" id=\"svg_11\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969009 -20 51.5186)\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1.03646 -20 24.0531)\" x1=\"213\" x2=\"213\" y1=\"191\" y2=\"401\"/>\n  <path d=\"m203.75,406.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.969009 -20 51.5186)\"/>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" font-weight=\"bold\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(3.23822 0 0 2.66355 -59.8193 -527.269)\" x=\"77.46\" xml:space=\"preserve\" y=\"270\">N</text>\n  <text fill=\"#666666\" font-family=\"Helvetica\" font-size=\"24\" font-weight=\"bold\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1 0 0 0.969009 -20 51.5186) matrix(6.88455 0 0 4.2203 196.621 -910.288)\" x=\"79\" xml:space=\"preserve\" y=\"270\"/>\n </g>"},"terminal_phase_l(1).svg":{"vb":"-25.5 54.83 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <ellipse cx=\"213\" cy=\"121\" fill=\"none\" id=\"svg_11\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.966426 -21 51.6451)\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" x1=\"192\" x2=\"192\" y1=\"222.23\" y2=\"439.18\"/>\n  <path d=\"m182.75,444.61l2.35,-3.92l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.92l0.0,4.54l-2.35,3.92l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.92l0.0,-4.54z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" font-weight=\"bold\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(3.23822 0 0 2.65646 -60.8193 -525.599)\" x=\"79\" xml:space=\"preserve\" y=\"270\">L</text>\n  <text fill=\"#666666\" font-family=\"Helvetica\" font-size=\"24\" font-weight=\"bold\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(6.88455 0 0 4.07861 175.621 -828.081)\" x=\"79\" xml:space=\"preserve\" y=\"270\"/>\n </g>"},"terminal_phase_l.svg":{"vb":"-25.5 54.83 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <ellipse cx=\"213\" cy=\"121\" fill=\"none\" id=\"svg_11\" rx=\"52\" ry=\"52\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.966426 -21 51.6451)\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" x1=\"192\" x2=\"192\" y1=\"222.23\" y2=\"439.18\"/>\n  <path d=\"m182.75,444.61l2.35,-3.92l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.92l0.0,4.54l-2.35,3.92l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.92l0.0,-4.54z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" font-weight=\"bold\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(3.23822 0 0 2.65646 -60.8193 -525.599)\" x=\"79\" xml:space=\"preserve\" y=\"270\">L</text>\n  <text fill=\"#666666\" font-family=\"Helvetica\" font-size=\"24\" font-weight=\"bold\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(6.88455 0 0 4.07861 175.621 -828.081)\" x=\"79\" xml:space=\"preserve\" y=\"270\"/>\n </g>"},"coil_contactor.svg":{"vb":"90.5 1.21 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Top terminal node (12-sided polygon) -->\n  <!-- Top vertical stem -->\n  <!-- Standard Contactor/Relay Coil Main Rectangle (exact 144x72 centerline proportion matching image_c9e202.png) -->\n  <!-- Bottom vertical stem -->\n  <!-- Bottom terminal node (12-sided polygon) -->\n  <path d=\"m331.01,40.97l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.0137 0 0 0.959596 -36.0822 54.7863)\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.0137 0 0 0.722709 -36.0822 63.774)\" x1=\"339.76\" x2=\"339.76\" y1=\"48.1\" y2=\"177.1\"/>\n  <rect fill=\"none\" height=\"72\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.24562 0 0 1.18621 -155.61 -0.887342)\" width=\"144\" x=\"300.19\" y=\"160.26\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"10\" x1=\"309\" x2=\"309\" y1=\"270.95\" y2=\"361.77\"/>\n  <path d=\"m331.67,326.21l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.0137 0 0 0.959596 -36.0822 54.7863)\"/>\n </g>"},"coil_tof_timer.svg":{"vb":"86.01 80.21 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Top terminal node (12-sided polygon) -->\n  <!-- Top vertical stem -->\n  <!-- Off-Delay Timer Coil Main Rectangle (exact 144x72 centerline proportion matching image_cb4662.png) -->\n  <!-- Left Solid Shaded Section (x=153 to x=198, leaving exact proportional gap to stem at x=225) -->\n  <!-- Vertical Divider on Right of Shaded Section (x=198) -->\n  <!-- Bottom vertical stem -->\n  <!-- Bottom terminal node (12-sided polygon) -->\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.644017 -32 93.1349)\" x1=\"341\" x2=\"341\" y1=\"137.78\" y2=\"266.78\"/>\n  <line fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.70176 -32 151.466)\" x1=\"342\" x2=\"342\" y1=\"279.37\" y2=\"408.37\"/>\n  <path d=\"m332.25,129.72l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.957071 -32 53.8979)\"/>\n  <path d=\"m333.25,405.39l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.957071 -32 53.8979)\"/>\n  <g id=\"svg_8\" transform=\"matrix(1.25486 0 0 1.16943 -657.716 -142.331)\">\n   <rect fill=\"none\" height=\"72\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.957071 -32 53.8979)\" width=\"144\" x=\"726\" y=\"310.58\"/>\n   <rect fill=\"#666666\" height=\"72\" id=\"svg_4\" transform=\"matrix(1 0 0 0.957071 -32 53.8979)\" width=\"45\" x=\"726\" y=\"310.58\"/>\n   <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"8\" x1=\"739\" x2=\"739\" y1=\"351.14\" y2=\"420.05\"/>\n  </g>\n </g>"},"coil_ton_timer.svg":{"vb":"81.1 302.76 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Top terminal node (12-sided polygon) -->\n  <!-- Top vertical stem -->\n  <!-- On-Delay Timer Coil Main Rectangle (exact 144x72 centerline proportion matching Screenshot 2026-10-15 144829.png) -->\n  <!-- Vertical Divider on Right of X Section (x=198, leaving exact proportional gap to stem at x=225) -->\n  <!-- \"X\" Cross inside Left Section (x=153 to x=198, y=204 to y=276) -->\n  <!-- Bottom vertical stem -->\n  <!-- Bottom terminal node (12-sided polygon) -->\n  <path d=\"m327.25,358.25l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.959596 -31 53.7863)\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.683311 -31 153.386)\" x1=\"336\" x2=\"336\" y1=\"362.98\" y2=\"491.98\"/>\n  <line fill=\"none\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.676921 -31 235.629)\" x1=\"335.89\" x2=\"335.89\" y1=\"503.61\" y2=\"632.61\"/>\n  <path d=\"m327.14,639.52l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.959596 -31 53.7863)\"/>\n  <rect fill=\"none\" height=\"72\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.25365 0 0 1.15191 -749.253 -92.9404)\" width=\"144\" x=\"764.1\" y=\"507.02\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.12408 0 0 1.20041 -620.608 -157.506)\" x1=\"782.14\" x2=\"782.14\" y1=\"540.32\" y2=\"609.41\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.12408 0 0 1.20041 -620.608 -157.506)\" x1=\"737.14\" x2=\"782.14\" y1=\"540.32\" y2=\"609.41\"/>\n  <line fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.12408 0 0 1.20041 -620.608 -157.506)\" x1=\"782.14\" x2=\"737.14\" y1=\"540.32\" y2=\"609.41\"/>\n </g>"},"coil_ton_tof_timer.svg":{"vb":"474.5 235.2 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Top terminal node (12-sided polygon) -->\n  <!-- Top vertical stem -->\n  <!-- Timer Coil Main Rectangle (exact 234x72 centerline proportion matching image_c969df.png) -->\n  <!-- Left Solid Shaded Section (x=108 to x=151) -->\n  <!-- Divider between Shaded Section and X Section (x=151) -->\n  <!-- Divider on Right of X Section (x=196, leaving exact proportional gap to stem at x=225) -->\n  <!-- \"X\" Cross inside Second Section (x=151 to x=196, y=204 to y=276) -->\n  <!-- Bottom vertical stem -->\n  <!-- Bottom terminal node (12-sided polygon) -->\n  <path d=\"m680.25,321.91l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.959391 0 19.2979)\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.716328 0 97.6525)\" x1=\"689\" x2=\"689\" y1=\"327.8\" y2=\"456.8\"/>\n  <line fill=\"none\" id=\"svg_9\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.73153 0 156.663)\" x1=\"689\" x2=\"689\" y1=\"472.52\" y2=\"601.52\"/>\n  <path d=\"m680.25,601.77l2.35,-3.9l4.06,-2.25l4.69,0.0l4.06,2.25l2.35,3.9l0.0,4.5l-2.35,3.9l-4.06,2.25l-4.69,0.0l-4.06,-2.25l-2.35,-3.9l0.0,-4.5z\" fill=\"#666666\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <g id=\"svg_11\" transform=\"translate(574 507.401) scale(1 1) translate(-574 -507.401) matrix(1 0 0 1.23952 3 -146.367)\">\n   <rect fill=\"none\" height=\"72\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.959391 0 19.2979)\" width=\"234\" x=\"572\" y=\"456.8\"/>\n   <rect fill=\"#666666\" height=\"72\" id=\"svg_4\" transform=\"matrix(1 0 0 0.959391 0 19.2979)\" width=\"43\" x=\"572\" y=\"456.8\"/>\n   <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"8\" x1=\"615\" x2=\"615\" y1=\"457.55\" y2=\"526.63\"/>\n   <line fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"8\" x1=\"660\" x2=\"660\" y1=\"457.55\" y2=\"526.63\"/>\n   <line fill=\"none\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"7.5\" x1=\"615\" x2=\"660\" y1=\"457.55\" y2=\"526.63\"/>\n   <line fill=\"none\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"7.5\" x1=\"660\" x2=\"615\" y1=\"457.55\" y2=\"526.63\"/>\n  </g>\n </g>"},"aux_contacts_nc.svg":{"vb":"1.26 53.65 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stem and Jog -->\n  <!-- Bottom Stem -->\n  <!-- Switch Flapper (Normally Closed Contact) -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"11\" Terminal Label -->\n  <!-- \"12\" Terminal Label -->\n  <!-- \"-K1\" Label Rotated -90deg -->\n  <path d=\"m216.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.962434 -33 52.5368)\"/>\n  <path d=\"m216.25,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.962434 -33 52.5368)\"/>\n  <path d=\"m225,75l0,103l60,1\" fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"9\" transform=\"matrix(1.03394 0 0 0.962434 -40.4009 52.5368)\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.962434 -33 52.5368)\" x1=\"225\" x2=\"225\" y1=\"308\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1.14665 0 0 1.07671 -65.2951 16.7671)\" x1=\"225\" x2=\"270\" y1=\"308\" y2=\"178\"/>\n </g>"},"aux_contacts_no.svg":{"vb":"-42.12 152.72 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <title>sunil</title>\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Stems -->\n  <!-- Switch Flapper (Normally Open Contact) -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"13\" Terminal Label -->\n  <!-- \"14\" Terminal Label -->\n  <!-- \"-K1\" Label Rotated -90deg -->\n  <path d=\"m216.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.967172 -31 150.451)\"/>\n  <path d=\"m216.25,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.967172 -31 150.451)\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.967172 -31 150.451)\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"167\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.967172 -31 150.451)\" x1=\"225\" x2=\"225\" y1=\"312\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.967172 -31 150.451)\" x1=\"225\" x2=\"179\" y1=\"312\" y2=\"172\"/>\n </g>"},"aux_contacts_off_delay_nc.svg":{"vb":"-71.16 53.22 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stem and Jog -->\n  <!-- Bottom Stem -->\n  <!-- Switch Flapper (Normally Closed Contact) -->\n  <!-- Contactor Mechanism (Parallel Lines) -->\n  <!-- Crosses the stem and connects to the flapper -->\n  <!-- Contactor C-Shape (Left-facing Half-circle) -->\n  <!-- Text Labels -->\n  <!-- \"55\" Terminal Label -->\n  <!-- \"56\" Terminal Label -->\n  <!-- \"-KM2\" Label Rotated -90deg -->\n  <path d=\"m216.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\"/>\n  <path d=\"m216.25,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\"/>\n  <path d=\"m225,75l0,103l55,0\" fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\" x1=\"225\" x2=\"225\" y1=\"308\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\" x1=\"225\" x2=\"271\" y1=\"308\" y2=\"166\"/>\n  <path d=\"m42.69,251.15a30.7,35.5 0 0 1 0,71\" fill=\"none\" id=\"svg_contactor_c\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_contactor_l1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\" x1=\"107.3\" x2=\"249.3\" y1=\"237.6\" y2=\"237.6\"/>\n  <line fill=\"none\" id=\"svg_contactor_l2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\" x1=\"107.3\" x2=\"244.37\" y1=\"249.9\" y2=\"249.9\"/>\n </g>"},"aux_contacts_off_delay_no.svg":{"vb":"-93.15 48.13 435.16 464.17","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Stems -->\n  <!-- Switch Flapper (Normally Open) -->\n  <!-- Contactor Mechanism (Parallel Lines) -->\n  <!-- Contactor C-Shape (Left-facing Half-circle) -->\n  <!-- Text Labels -->\n  <!-- \"67\" Terminal Label -->\n  <!-- \"68\" Terminal Label -->\n  <!-- Labels Rotated -90deg -->\n  <path d=\"m216.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.969697 -29 45.3397)\"/>\n  <path d=\"m216.25,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.969697 -29 45.3397)\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 -29 45.3397)\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"174.7\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 -29 45.3397)\" x1=\"225\" x2=\"225\" y1=\"309.7\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 -29 45.3397)\" x1=\"225\" x2=\"177.4\" y1=\"309.7\" y2=\"183.9\"/>\n  <path d=\"m44.1,245.97a30.7,35.68 0 0 1 0,71.37\" fill=\"none\" id=\"svg_contactor_c\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_contactor_l1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.27137 0 0 0.969697 -83.8168 45.3397)\" x1=\"128.3\" x2=\"197\" y1=\"237.6\" y2=\"237.6\"/>\n  <line fill=\"none\" id=\"svg_contactor_l2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.27137 0 0 0.969697 -83.8168 45.3397)\" x1=\"128.3\" x2=\"202\" y1=\"249.9\" y2=\"249.9\"/>\n </g>"},"aux_contacts_on_delay_nc.svg":{"vb":"-58.7 53.22 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stem and Jog -->\n  <!-- Bottom Stem -->\n  <!-- Switch Flapper (Normally Closed Contact) -->\n  <!-- Contactor Mechanism (Parallel Lines) -->\n  <!-- Crosses the stem and connects to the flapper -->\n  <!-- Contactor C-Shape (Left-facing Half-circle) -->\n  <!-- Text Labels -->\n  <!-- \"55\" Terminal Label -->\n  <!-- \"56\" Terminal Label -->\n  <!-- \"-KM2\" Label Rotated -90deg -->\n  <path d=\"m216.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\"/>\n  <path d=\"m186.25,447.66l2.35,-3.92l4.06,-2.26l4.69,0.0l4.06,2.26l2.35,3.92l0.0,4.53l-2.35,3.92l-4.06,2.26l-4.69,0.0l-4.06,-2.26l-2.35,-3.92l0.0,-4.53z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m225,75l0,103l55,0\" fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\" x1=\"225\" x2=\"225\" y1=\"308\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\" x1=\"225\" x2=\"271\" y1=\"308\" y2=\"166\"/>\n  <path d=\"m128.3,206.9a30.7,36.8 0 0 0 0,73.6\" fill=\"none\" id=\"svg_contactor_c\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\"/>\n  <line fill=\"none\" id=\"svg_contactor_l1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\" x1=\"107.3\" x2=\"249.3\" y1=\"237.6\" y2=\"237.6\"/>\n  <line fill=\"none\" id=\"svg_contactor_l2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\" x1=\"107.3\" x2=\"244.37\" y1=\"249.9\" y2=\"249.9\"/>\n </g>"},"aux_contacts_on_delay_no.svg":{"vb":"-33.82 54.22 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Stems -->\n  <!-- Switch Flapper (Normally Open) -->\n  <!-- Contactor Mechanism (Parallel Lines) -->\n  <!-- Contactor C-Shape (Left-facing Half-circle) -->\n  <!-- Text Labels -->\n  <!-- \"67\" Terminal Label -->\n  <!-- \"68\" Terminal Label -->\n  <!-- \"-KM1\" Label Rotated -90deg -->\n  <path d=\"m216.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.964646 18 52.563)\"/>\n  <path d=\"m216.25,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.964646 18 52.563)\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 18 52.563)\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"174.7\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 18 52.563)\" x1=\"225\" x2=\"225\" y1=\"309.7\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 18 52.563)\" x1=\"225\" x2=\"177.4\" y1=\"309.7\" y2=\"183.9\"/>\n  <path d=\"m128.3,206.9a30.7,36.8 0 0 0 0,73.6\" fill=\"none\" id=\"svg_contactor_c\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 18 52.563)\"/>\n  <line fill=\"none\" id=\"svg_contactor_l1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.32564 0 0 0.964646 -47.7802 52.563)\" x1=\"128.3\" x2=\"197\" y1=\"237.6\" y2=\"237.6\"/>\n  <line fill=\"none\" id=\"svg_contactor_l2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.32564 0 0 0.964646 -47.7802 52.563)\" x1=\"128.3\" x2=\"202\" y1=\"249.9\" y2=\"249.9\"/>\n </g>"},"switch_3_position_selector i-0-ii(1).svg":{"vb":"90.55 57.13 435.16 464.17","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- 12-Sided Polygon Terminal Nodes -->\n  <!-- Top Stem (Terminal 1) -->\n  <!-- Bottom Stems with Inward Jogs -->\n  <!-- Stem 2 (Normally Closed) -->\n  <!-- Stem 3 (Normally Open) -->\n  <!-- Floating Contact Pad for NO Side (Terminal 3) -->\n  <!-- Switch Flapper (SPDT / Changeover) -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Limit Switch Actuator Bracket (Step shape) -->\n  <!-- Text Labels -->\n  <!-- \"-S12\" Label Rotated -90deg -->\n  <path d=\"m216.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_term_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\"/>\n  <path d=\"m125.75,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_term_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\"/>\n  <path d=\"m306.75,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_term_3\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\"/>\n  <line fill=\"none\" id=\"svg_stem_1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"169\"/>\n  <path d=\"m134.5,405l0,-109.7l51.3,0\" fill=\"none\" id=\"svg_stem_2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\"/>\n  <path d=\"m315.5,405l0,-109.7l-51.3,0\" fill=\"none\" id=\"svg_stem_3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\"/>\n  <line fill=\"none\" id=\"svg_floating_pad_3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\" x1=\"210\" x2=\"240\" y1=\"295.3\" y2=\"295.3\"/>\n  <g id=\"svg_1\">\n   <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\" x1=\"175\" x2=\"225\" y1=\"305\" y2=\"169\"/>\n   <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" transform=\"matrix(1.30769 0 0 0.969697 43.9231 54.3397)\" x1=\"132\" x2=\"200\" y1=\"237\" y2=\"237\"/>\n   <path d=\"m132,207l-27,0l0,60l-27,0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\"/>\n  </g>\n </g>"},"switch_3_position_selector i-0-ii.svg":{"vb":"90.55 57.13 435.16 464.17","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- 12-Sided Polygon Terminal Nodes -->\n  <!-- Top Stem (Terminal 1) -->\n  <!-- Bottom Stems with Inward Jogs -->\n  <!-- Stem 2 (Normally Closed) -->\n  <!-- Stem 3 (Normally Open) -->\n  <!-- Floating Contact Pad for NO Side (Terminal 3) -->\n  <!-- Switch Flapper (SPDT / Changeover) -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Limit Switch Actuator Bracket (Step shape) -->\n  <!-- Text Labels -->\n  <!-- \"-S12\" Label Rotated -90deg -->\n  <path d=\"m216.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_term_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\"/>\n  <path d=\"m125.75,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_term_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\"/>\n  <path d=\"m306.75,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_term_3\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\"/>\n  <line fill=\"none\" id=\"svg_stem_1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"169\"/>\n  <path d=\"m134.5,405l0,-109.7l51.3,0\" fill=\"none\" id=\"svg_stem_2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\"/>\n  <path d=\"m315.5,405l0,-109.7l-51.3,0\" fill=\"none\" id=\"svg_stem_3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\"/>\n  <line fill=\"none\" id=\"svg_floating_pad_3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\" x1=\"210\" x2=\"240\" y1=\"295.3\" y2=\"295.3\"/>\n  <g id=\"svg_1\">\n   <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\" x1=\"175\" x2=\"225\" y1=\"305\" y2=\"169\"/>\n   <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" transform=\"matrix(1.30769 0 0 0.969697 43.9231 54.3397)\" x1=\"132\" x2=\"200\" y1=\"237\" y2=\"237\"/>\n   <path d=\"m132,207l-27,0l0,60l-27,0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\"/>\n  </g>\n </g>"},"switch_3_position_selector i-ii-iii(1).svg":{"vb":"112.17 52.65 533.22 469.12","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stem -->\n  <!-- Bottom Stems -->\n  <!-- Stem 2 (Normally Closed) -->\n  <!-- Stem 3 (Normally Open Position 2) -->\n  <!-- Stem 4 (Normally Open Position 3) -->\n  <!-- Switch Flapper (Multi-Position Limit Switch) -->\n  <!-- Rests in Position 1 (Normally closed to terminal 2) -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Limit Switch Actuator Bracket -->\n  <!-- Text Labels -->\n  <!-- \"1\" Terminal Label -->\n  <!-- \"2\" Terminal Label -->\n  <!-- \"3\" Terminal Label -->\n  <!-- \"4\" Terminal Label -->\n  <!-- \"-S13\" Label Rotated -90deg -->\n  <path d=\"m261.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.977271 128 50.0052)\"/>\n  <path d=\"m261.25,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.977271 128 50.0052)\"/>\n  <path d=\"m462.35,411.63l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.977271 128 50.0052)\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.977271 128 50.0052)\" x1=\"270\" x2=\"270\" y1=\"75\" y2=\"165\"/>\n  <line fill=\"none\" id=\"svg_stem_3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 57 0) matrix(1 0 0 0.977271 71 50.0052)\" x1=\"270\" x2=\"270\" y1=\"405\" y2=\"292.5\"/>\n  <line fill=\"none\" id=\"svg_stem_3_t\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 57 0) matrix(1 0 0 0.977271 71 50.0052)\" x1=\"249.1\" x2=\"295.7\" y1=\"292.5\" y2=\"292.5\"/>\n  <path d=\"m471.1,406.02l0,-112.5l-53.8,0\" fill=\"none\" id=\"svg_stem_4\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.977271 128 50.0052)\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.977271 128 50.0052)\" x1=\"124.6\" x2=\"270\" y1=\"297.8\" y2=\"165\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 57 0) matrix(1 0 0 0.977271 71 50.0052)\" x1=\"60\" x2=\"189.2\" y1=\"240.4\" y2=\"240.4\"/>\n  <path d=\"m98.7,211.43l-42.9,-1l0,57.4l-34.1,0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.977271 128 50.0052)\"/>\n  <path d=\"m83.55,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.977271 107 50.0052)\"/>\n  <path d=\"m92.3,405l0,-112.5l76.9,1\" fill=\"none\" id=\"svg_stem_2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.977271 107 50.0052)\"/>\n </g>"},"switch_3_position_selector i-ii-iii.svg":{"vb":"112.17 52.65 533.22 469.12","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stem -->\n  <!-- Bottom Stems -->\n  <!-- Stem 2 (Normally Closed) -->\n  <!-- Stem 3 (Normally Open Position 2) -->\n  <!-- Stem 4 (Normally Open Position 3) -->\n  <!-- Switch Flapper (Multi-Position Limit Switch) -->\n  <!-- Rests in Position 1 (Normally closed to terminal 2) -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Limit Switch Actuator Bracket -->\n  <!-- Text Labels -->\n  <!-- \"1\" Terminal Label -->\n  <!-- \"2\" Terminal Label -->\n  <!-- \"3\" Terminal Label -->\n  <!-- \"4\" Terminal Label -->\n  <!-- \"-S13\" Label Rotated -90deg -->\n  <path d=\"m261.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.977271 128 50.0052)\"/>\n  <path d=\"m261.25,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.977271 128 50.0052)\"/>\n  <path d=\"m462.35,411.63l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.977271 128 50.0052)\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.977271 128 50.0052)\" x1=\"270\" x2=\"270\" y1=\"75\" y2=\"165\"/>\n  <line fill=\"none\" id=\"svg_stem_3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 57 0) matrix(1 0 0 0.977271 71 50.0052)\" x1=\"270\" x2=\"270\" y1=\"405\" y2=\"292.5\"/>\n  <line fill=\"none\" id=\"svg_stem_3_t\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 57 0) matrix(1 0 0 0.977271 71 50.0052)\" x1=\"249.1\" x2=\"295.7\" y1=\"292.5\" y2=\"292.5\"/>\n  <path d=\"m471.1,406.02l0,-112.5l-53.8,0\" fill=\"none\" id=\"svg_stem_4\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.977271 128 50.0052)\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.977271 128 50.0052)\" x1=\"124.6\" x2=\"270\" y1=\"297.8\" y2=\"165\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 57 0) matrix(1 0 0 0.977271 71 50.0052)\" x1=\"60\" x2=\"189.2\" y1=\"240.4\" y2=\"240.4\"/>\n  <path d=\"m98.7,211.43l-42.9,-1l0,57.4l-34.1,0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.977271 128 50.0052)\"/>\n  <path d=\"m83.55,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.977271 107 50.0052)\"/>\n  <path d=\"m92.3,405l0,-112.5l76.9,1\" fill=\"none\" id=\"svg_stem_2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.977271 107 50.0052)\"/>\n </g>"},"switch_con(1).svg":{"vb":"-40.76 45.0 435.38 464.4","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stem -->\n  <!-- Bottom Stems with Inward Jogs -->\n  <!-- Stem 12 -->\n  <!-- Stem 14 -->\n  <!-- Switch Flapper (SPDT / Changeover Contact) -->\n  <!-- Normally closed to terminal 12 -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Pushbutton Actuator Bracket \"[\" -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"11\" Terminal Label -->\n  <!-- \"12\" Terminal Label -->\n  <!-- \"14\" Terminal Label -->\n  <!-- \"-S8\" Label Rotated -90deg -->\n  <path d=\"m216.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.964646 -29 42.563)\"/>\n  <path d=\"m121.55,412.68l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.964646 -29 42.563)\"/>\n  <path d=\"m320.95,409.58l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.964646 -29 42.563)\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 -31 -9) matrix(1 0 0 0.964646 2 51.563)\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"173.6\"/>\n  <path d=\"m101,436.68l0,-101.68l71.4,0\" fill=\"none\" id=\"svg_stem_12\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"m300.3,432.68l0,-98.68l-71.3,0.96\" fill=\"none\" id=\"svg_stem_14\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -29 42.563)\" x1=\"187.7\" x2=\"225\" y1=\"308.7\" y2=\"173.6\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -29 42.563)\" x1=\"109.4\" x2=\"205.7\" y1=\"242.2\" y2=\"242.2\"/>\n  <path d=\"m130.4,210.9l-26.4,1l0,64.6l-30.6,1\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -29 42.563)\"/>\n </g>"},"switch_con.svg":{"vb":"-40.76 45.0 435.38 464.4","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stem -->\n  <!-- Bottom Stems with Inward Jogs -->\n  <!-- Stem 12 -->\n  <!-- Stem 14 -->\n  <!-- Switch Flapper (SPDT / Changeover Contact) -->\n  <!-- Normally closed to terminal 12 -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Pushbutton Actuator Bracket \"[\" -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"11\" Terminal Label -->\n  <!-- \"12\" Terminal Label -->\n  <!-- \"14\" Terminal Label -->\n  <!-- \"-S8\" Label Rotated -90deg -->\n  <path d=\"m216.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.964646 -29 42.563)\"/>\n  <path d=\"m121.55,412.68l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.964646 -29 42.563)\"/>\n  <path d=\"m320.95,409.58l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.964646 -29 42.563)\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 -31 -9) matrix(1 0 0 0.964646 2 51.563)\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"173.6\"/>\n  <path d=\"m101,436.68l0,-101.68l71.4,0\" fill=\"none\" id=\"svg_stem_12\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"m300.3,432.68l0,-98.68l-71.3,0.96\" fill=\"none\" id=\"svg_stem_14\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -29 42.563)\" x1=\"187.7\" x2=\"225\" y1=\"308.7\" y2=\"173.6\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -29 42.563)\" x1=\"109.4\" x2=\"205.7\" y1=\"242.2\" y2=\"242.2\"/>\n  <path d=\"m130.4,210.9l-26.4,1l0,64.6l-30.6,1\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -29 42.563)\"/>\n </g>"},"switch_nc(1).svg":{"vb":"-58.0 53.71 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stem and Jog -->\n  <!-- Bottom Stem -->\n  <!-- Switch Flapper (Normally Closed) -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Pushbutton Actuator Bracket \"[\" -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"11\" Terminal Label -->\n  <!-- \"12\" Terminal Label -->\n  <!-- \"-S7\" Label Rotated -90deg -->\n  <path d=\"m216.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.957071 -34 53.8979)\"/>\n  <path d=\"m216.25,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.957071 -34 53.8979)\"/>\n  <path d=\"m225,75l0,106l63,-1.03\" fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.957071 -34 53.8979)\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.957071 -34 53.8979)\" x1=\"225\" x2=\"225\" y1=\"308\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.957071 -34 53.8979)\" x1=\"225\" x2=\"273\" y1=\"308\" y2=\"168\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.957071 -34 53.8979)\" x1=\"132\" x2=\"248\" y1=\"242\" y2=\"242\"/>\n  <path d=\"m155,211l-27,0l0,60l-29,1\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.957071 -34 53.8979)\"/>\n </g>"},"switch_nc.svg":{"vb":"-58.0 53.71 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stem and Jog -->\n  <!-- Bottom Stem -->\n  <!-- Switch Flapper (Normally Closed) -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Pushbutton Actuator Bracket \"[\" -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"11\" Terminal Label -->\n  <!-- \"12\" Terminal Label -->\n  <!-- \"-S7\" Label Rotated -90deg -->\n  <path d=\"m216.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.957071 -34 53.8979)\"/>\n  <path d=\"m216.25,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.957071 -34 53.8979)\"/>\n  <path d=\"m225,75l0,106l63,-1.03\" fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.957071 -34 53.8979)\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.957071 -34 53.8979)\" x1=\"225\" x2=\"225\" y1=\"308\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.957071 -34 53.8979)\" x1=\"225\" x2=\"273\" y1=\"308\" y2=\"168\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.957071 -34 53.8979)\" x1=\"132\" x2=\"248\" y1=\"242\" y2=\"242\"/>\n  <path d=\"m155,211l-27,0l0,60l-29,1\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.957071 -34 53.8979)\"/>\n </g>"},"switch_no(1).svg":{"vb":"-70.5 2.88 448.76 478.68","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <path d=\"m216.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m216.25,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <!-- Stems -->\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"167\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" x1=\"225\" x2=\"225\" y1=\"312\" y2=\"405\"/>\n  <!-- Switch Flapper (Normally Open) -->\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"225\" x2=\"179\" y1=\"312\" y2=\"172\"/>\n  <!-- Dashed Mechanical Link -->\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"105\" x2=\"202\" y1=\"242\" y2=\"242\"/>\n  <!-- Pushbutton Actuator Bracket \"[\" -->\n  <path d=\"m132,211l-27,0l0,60c-10.33,0.67 -20.67,-0.67 -31,0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"13\" Terminal Label -->\n  <!-- \"14\" Terminal Label -->\n  <!-- \"-S6\" Label Rotated -90deg -->\n </g>"},"switch_no.svg":{"vb":"-70.5 2.88 448.76 478.68","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <path d=\"m216.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m216.25,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <!-- Stems -->\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"167\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" x1=\"225\" x2=\"225\" y1=\"312\" y2=\"405\"/>\n  <!-- Switch Flapper (Normally Open) -->\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"225\" x2=\"179\" y1=\"312\" y2=\"172\"/>\n  <!-- Dashed Mechanical Link -->\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"105\" x2=\"202\" y1=\"242\" y2=\"242\"/>\n  <!-- Pushbutton Actuator Bracket \"[\" -->\n  <path d=\"m132,211l-27,0l0,60c-10.33,0.67 -20.67,-0.67 -31,0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"13\" Terminal Label -->\n  <!-- \"14\" Terminal Label -->\n  <!-- \"-S6\" Label Rotated -90deg -->\n </g>"},"switch_pushbutton_con(1).svg":{"vb":"-31.65 2.88 448.76 478.68","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stem -->\n  <!-- Bottom Stems with Inward Jogs -->\n  <!-- Stem 12 -->\n  <!-- Stem 14 -->\n  <!-- Switch Flapper (SPDT / Changeover Contact) -->\n  <!-- Normally closed to terminal 12 -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Pushbutton Actuator Bracket \"[\" -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"11\" Terminal Label -->\n  <!-- \"12\" Terminal Label -->\n  <!-- \"14\" Terminal Label -->\n  <!-- \"-S8\" Label Rotated -90deg -->\n  <path d=\"m216.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 -25 0)\"/>\n  <path d=\"m117.55,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 -25 0)\"/>\n  <path d=\"m313.95,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 -25 0)\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 -25 0)\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"173.6\"/>\n  <path d=\"m100,406.3l0,-102.3l75.4,0\" fill=\"none\" id=\"svg_stem_12\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"m297.7,406.3l0,-102.3l-69.3,0\" fill=\"none\" id=\"svg_stem_14\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 -25 0)\" x1=\"187.7\" x2=\"225\" y1=\"308.7\" y2=\"173.6\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 -25 0)\" x1=\"109.4\" x2=\"205.7\" y1=\"242.2\" y2=\"242.2\"/>\n  <path d=\"m130.4,210.9l-26.4,1l0,64.6l27.4,0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 -25 0)\"/>\n </g>"},"switch_pushbutton_con.svg":{"vb":"-31.65 2.88 448.76 478.68","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stem -->\n  <!-- Bottom Stems with Inward Jogs -->\n  <!-- Stem 12 -->\n  <!-- Stem 14 -->\n  <!-- Switch Flapper (SPDT / Changeover Contact) -->\n  <!-- Normally closed to terminal 12 -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Pushbutton Actuator Bracket \"[\" -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"11\" Terminal Label -->\n  <!-- \"12\" Terminal Label -->\n  <!-- \"14\" Terminal Label -->\n  <!-- \"-S8\" Label Rotated -90deg -->\n  <path d=\"m216.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 -25 0)\"/>\n  <path d=\"m117.55,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 -25 0)\"/>\n  <path d=\"m313.95,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 -25 0)\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 -25 0)\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"173.6\"/>\n  <path d=\"m100,406.3l0,-102.3l75.4,0\" fill=\"none\" id=\"svg_stem_12\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"m297.7,406.3l0,-102.3l-69.3,0\" fill=\"none\" id=\"svg_stem_14\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 -25 0)\" x1=\"187.7\" x2=\"225\" y1=\"308.7\" y2=\"173.6\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 -25 0)\" x1=\"109.4\" x2=\"205.7\" y1=\"242.2\" y2=\"242.2\"/>\n  <path d=\"m130.4,210.9l-26.4,1l0,64.6l27.4,0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 -25 0)\"/>\n </g>"},"switch_pushbutton_nc(1).svg":{"vb":"-27.38 2.88 448.76 478.68","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <path d=\"m216.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m216.25,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <!-- Top Stem and Jog -->\n  <path d=\"m225,75l0,103l64,1\" fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <!-- Bottom Stem -->\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" x1=\"225\" x2=\"225\" y1=\"308\" y2=\"405\"/>\n  <!-- Switch Flapper (Normally Closed) -->\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"225\" x2=\"271\" y1=\"308\" y2=\"172\"/>\n  <!-- Dashed Mechanical Link -->\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"111\" x2=\"248\" y1=\"242\" y2=\"242\"/>\n  <!-- Pushbutton Actuator Bracket \"[\" -->\n  <path d=\"m132,211l-27,0l0,60l27,0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"11\" Terminal Label -->\n  <!-- \"12\" Terminal Label -->\n  <!-- \"-S7\" Label Rotated -90deg -->\n </g>"},"switch_pushbutton_nc.svg":{"vb":"-27.38 2.88 448.76 478.68","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <path d=\"m216.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m216.25,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <!-- Top Stem and Jog -->\n  <path d=\"m225,75l0,103l64,1\" fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <!-- Bottom Stem -->\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" x1=\"225\" x2=\"225\" y1=\"308\" y2=\"405\"/>\n  <!-- Switch Flapper (Normally Closed) -->\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"225\" x2=\"271\" y1=\"308\" y2=\"172\"/>\n  <!-- Dashed Mechanical Link -->\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"111\" x2=\"248\" y1=\"242\" y2=\"242\"/>\n  <!-- Pushbutton Actuator Bracket \"[\" -->\n  <path d=\"m132,211l-27,0l0,60l27,0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"11\" Terminal Label -->\n  <!-- \"12\" Terminal Label -->\n  <!-- \"-S7\" Label Rotated -90deg -->\n </g>"},"switch_pushbutton_no(1).svg":{"vb":"-55.0 2.88 448.76 478.68","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <path d=\"m216.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m216.25,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <!-- Stems -->\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"8\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"167\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"8\" x1=\"225\" x2=\"225\" y1=\"312\" y2=\"405\"/>\n  <!-- Switch Flapper (Normally Open) -->\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"225\" x2=\"179\" y1=\"312\" y2=\"172\"/>\n  <!-- Dashed Mechanical Link -->\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"8\" x1=\"105\" x2=\"202\" y1=\"242\" y2=\"242\"/>\n  <!-- Pushbutton Actuator Bracket \"[\" -->\n  <path d=\"m132,211l-27,0l0,60l27,0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"8\"/>\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"13\" Terminal Label -->\n  <!-- \"14\" Terminal Label -->\n  <!-- \"-S6\" Label Rotated -90deg -->\n </g>"},"switch_pushbutton_no.svg":{"vb":"-55.0 2.88 448.76 478.68","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <path d=\"m216.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m216.25,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <!-- Stems -->\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"8\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"167\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"8\" x1=\"225\" x2=\"225\" y1=\"312\" y2=\"405\"/>\n  <!-- Switch Flapper (Normally Open) -->\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"225\" x2=\"179\" y1=\"312\" y2=\"172\"/>\n  <!-- Dashed Mechanical Link -->\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"8\" x1=\"105\" x2=\"202\" y1=\"242\" y2=\"242\"/>\n  <!-- Pushbutton Actuator Bracket \"[\" -->\n  <path d=\"m132,211l-27,0l0,60l27,0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"8\"/>\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"13\" Terminal Label -->\n  <!-- \"14\" Terminal Label -->\n  <!-- \"-S6\" Label Rotated -90deg -->\n </g>"},"load_beacon(2).svg":{"vb":"10.59 -3.78 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <defs>\n  <!-- Arrowhead marker for the rotation/flashing curved arrow -->\n  <marker id=\"arrow\" markerHeight=\"6\" markerWidth=\"6\" orient=\"auto-start-reverse\" refX=\"5\" refY=\"5\" viewBox=\"0 0 10 10\">\n   <path d=\"m0,1l10,4l-10,4l0,-8z\" fill=\"#666666\" id=\"svg_9\"/>\n  </marker>\n </defs>\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Top terminal node (12-sided polygon) -->\n  <!-- Top vertical stem -->\n  <!-- Rotating Beacon Circle (Diameter = 96px, Radius = 48px, centered at 225, 240) -->\n  <!-- Internal 'X' Cross inside Circle -->\n  <!-- Curved Rotation Arrow on the Right Side -->\n  <!-- Bottom vertical stem -->\n  <!-- Bottom terminal node (12-sided polygon) -->\n  <circle cx=\"225\" cy=\"183.66\" fill=\"none\" id=\"svg_3\" r=\"71.04\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.31977 0 0 0.958398 -71.0144 55.0767)\"/>\n  <path d=\"m217.39,85.31l3.1,-3.89l5.36,-2.25l6.19,0.0l5.36,2.25l3.1,3.89l0.0,4.5l-3.1,3.89l-5.36,2.25l-6.19,0.0l-5.36,-2.25l-3.1,-3.89l0.0,-4.5z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"228.93\" x2=\"228.93\" y1=\"89.89\" y2=\"161.15\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"7.5\" x1=\"167.59\" x2=\"288.29\" y1=\"183.43\" y2=\"277.74\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"7.5\" x1=\"291.11\" x2=\"165.78\" y1=\"184.46\" y2=\"279.73\"/>\n  <path d=\"m279,138.66a60,60 0 0 1 0,90\" fill=\"none\" id=\"svg_6\" marker-end=\"url(#arrow)\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"7\" transform=\"matrix(1.23329 0 0 1.66394 -43.809 -288.863) matrix(1.07012 0 0 0.575981 -22.0592 206.702)\"/>\n  <line fill=\"none\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"10\" x1=\"228.94\" x2=\"228.94\" y1=\"302.99\" y2=\"362.33\"/>\n  <path d=\"m218.53,325.07l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.31977 0 0 0.958398 -71.0144 55.0767)\"/>\n </g>"},"load_beacon.svg":{"vb":"10.59 -3.78 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <defs>\n  <!-- Arrowhead marker for the rotation/flashing curved arrow -->\n  <marker id=\"arrow\" markerHeight=\"6\" markerWidth=\"6\" orient=\"auto-start-reverse\" refX=\"5\" refY=\"5\" viewBox=\"0 0 10 10\">\n   <path d=\"m0,1l10,4l-10,4l0,-8z\" fill=\"#666666\" id=\"svg_9\"/>\n  </marker>\n </defs>\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Top terminal node (12-sided polygon) -->\n  <!-- Top vertical stem -->\n  <!-- Rotating Beacon Circle (Diameter = 96px, Radius = 48px, centered at 225, 240) -->\n  <!-- Internal 'X' Cross inside Circle -->\n  <!-- Curved Rotation Arrow on the Right Side -->\n  <!-- Bottom vertical stem -->\n  <!-- Bottom terminal node (12-sided polygon) -->\n  <circle cx=\"225\" cy=\"183.66\" fill=\"none\" id=\"svg_3\" r=\"71.04\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.31977 0 0 0.958398 -71.0144 55.0767)\"/>\n  <path d=\"m217.39,85.31l3.1,-3.89l5.36,-2.25l6.19,0.0l5.36,2.25l3.1,3.89l0.0,4.5l-3.1,3.89l-5.36,2.25l-6.19,0.0l-5.36,-2.25l-3.1,-3.89l0.0,-4.5z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"228.93\" x2=\"228.93\" y1=\"89.89\" y2=\"161.15\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"7.5\" x1=\"167.59\" x2=\"288.29\" y1=\"183.43\" y2=\"277.74\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"7.5\" x1=\"291.11\" x2=\"165.78\" y1=\"184.46\" y2=\"279.73\"/>\n  <path d=\"m279,138.66a60,60 0 0 1 0,90\" fill=\"none\" id=\"svg_6\" marker-end=\"url(#arrow)\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"7\" transform=\"matrix(1.23329 0 0 1.66394 -43.809 -288.863) matrix(1.07012 0 0 0.575981 -22.0592 206.702)\"/>\n  <line fill=\"none\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"10\" x1=\"228.94\" x2=\"228.94\" y1=\"302.99\" y2=\"362.33\"/>\n  <path d=\"m218.53,325.07l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.31977 0 0 0.958398 -71.0144 55.0767)\"/>\n </g>"},"load_bell(2).svg":{"vb":"134.66 -1.79 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Top terminal node (12-sided polygon at x=225, y=62.7) -->\n  <!-- Top vertical stem (along x=225 from top terminal down to y=204) and horizontal lead RIGHT to x=260 -->\n  <!-- Acoustic Horn / Buzzer D-shape Symbol (to the right of the stem, flat back at x=260 from y=176 to y=304, dome extending right to x=331) -->\n  <!-- Bottom horizontal lead (from flat back at x=260, y=276 LEFT to x=225) and vertical stem down to bottom terminal -->\n  <!-- Bottom terminal node (12-sided polygon at x=225, y=421.7) -->\n  <path d=\"m326.37,37.6l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.00797 0 0 0.812426 -34.6454 59.0334)\"/>\n  <path d=\"m335.12,43.49l0,129l35,0\" fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.00797 0 0 0.812426 -34.6454 59.0334)\"/>\n  <path d=\"m370.12,144.49l0,128a71,64 0 0 0 0,-128z\" fill=\"none\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.853371 0 10.2878) matrix(1.00797 0 0 0.95202 -34.6454 57.1212)\"/>\n  <path d=\"m370.12,244.49l-35,0l0,129\" fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.853371 0 10.2878) matrix(1.00797 0 0 0.95202 -34.6454 57.1212)\"/>\n  <path d=\"m326.37,379.11l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.853371 0 10.2878) matrix(1.00797 0 0 0.95202 -34.6454 57.1212)\"/>\n </g>"},"load_bell.svg":{"vb":"134.66 -1.79 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Top terminal node (12-sided polygon at x=225, y=62.7) -->\n  <!-- Top vertical stem (along x=225 from top terminal down to y=204) and horizontal lead RIGHT to x=260 -->\n  <!-- Acoustic Horn / Buzzer D-shape Symbol (to the right of the stem, flat back at x=260 from y=176 to y=304, dome extending right to x=331) -->\n  <!-- Bottom horizontal lead (from flat back at x=260, y=276 LEFT to x=225) and vertical stem down to bottom terminal -->\n  <!-- Bottom terminal node (12-sided polygon at x=225, y=421.7) -->\n  <path d=\"m326.37,37.6l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.00797 0 0 0.812426 -34.6454 59.0334)\"/>\n  <path d=\"m335.12,43.49l0,129l35,0\" fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.00797 0 0 0.812426 -34.6454 59.0334)\"/>\n  <path d=\"m370.12,144.49l0,128a71,64 0 0 0 0,-128z\" fill=\"none\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.853371 0 10.2878) matrix(1.00797 0 0 0.95202 -34.6454 57.1212)\"/>\n  <path d=\"m370.12,244.49l-35,0l0,129\" fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.853371 0 10.2878) matrix(1.00797 0 0 0.95202 -34.6454 57.1212)\"/>\n  <path d=\"m326.37,379.11l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.853371 0 10.2878) matrix(1.00797 0 0 0.95202 -34.6454 57.1212)\"/>\n </g>"},"load_blinking_pilot_lamp(2).svg":{"vb":"191.49 78.7 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Top terminal node (12-sided polygon at x=225, y=62.7) -->\n  <!-- Top vertical stem (from top terminal down to top of circle at y=168.5) -->\n  <!-- Indicator Lamp Circle (Centerline Radius = 71.5px, Centerline Diameter = 143px, matching image_e69089.png) -->\n  <!-- Internal 'X' Cross inside Circle -->\n  <!-- Flashing / Square-Wave Pulse Symbol on Right Side of Circle -->\n  <!-- Bottom vertical stem (from bottom of circle at y=311.5 down to bottom terminal) -->\n  <!-- Bottom terminal node (12-sided polygon at x=225, y=421.7) -->\n  <path d=\"m408.27,122.69l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.00508 0 0 0.95202 -33.7716 57.1212)\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.00508 0 0 0.625704 -33.7716 97.3309)\" x1=\"417.02\" x2=\"417.02\" y1=\"128.57\" y2=\"222.07\"/>\n  <circle cx=\"418.02\" cy=\"263.11\" fill=\"none\" id=\"svg_3\" r=\"71.04\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.00508 0 0 0.95202 -33.7716 57.1212)\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"10\" x1=\"335.55\" x2=\"437.19\" y1=\"259.47\" y2=\"355.74\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"10\" x1=\"437.19\" x2=\"335.55\" y1=\"259.47\" y2=\"355.74\"/>\n  <path d=\"m458.78,318.08l10.05,0l0,-22.85l24.12,0l0,22.85l10.05,0\" fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"7\"/>\n  <line fill=\"none\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.00508 0 0 0.659856 -33.7716 175.755)\" x1=\"417.02\" x2=\"417.02\" y1=\"306.25\" y2=\"399.75\"/>\n  <path d=\"m376.57,443.03l2.35,-3.87l4.08,-2.23l4.71,0.0l4.08,2.23l2.35,3.87l0.0,4.46l-2.35,3.87l-4.08,2.23l-4.71,0.0l-4.08,-2.23l-2.35,-3.87l0.0,-4.46z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"},"load_blinking_pilot_lamp.svg":{"vb":"191.49 78.7 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Top terminal node (12-sided polygon at x=225, y=62.7) -->\n  <!-- Top vertical stem (from top terminal down to top of circle at y=168.5) -->\n  <!-- Indicator Lamp Circle (Centerline Radius = 71.5px, Centerline Diameter = 143px, matching image_e69089.png) -->\n  <!-- Internal 'X' Cross inside Circle -->\n  <!-- Flashing / Square-Wave Pulse Symbol on Right Side of Circle -->\n  <!-- Bottom vertical stem (from bottom of circle at y=311.5 down to bottom terminal) -->\n  <!-- Bottom terminal node (12-sided polygon at x=225, y=421.7) -->\n  <path d=\"m408.27,122.69l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.00508 0 0 0.95202 -33.7716 57.1212)\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.00508 0 0 0.625704 -33.7716 97.3309)\" x1=\"417.02\" x2=\"417.02\" y1=\"128.57\" y2=\"222.07\"/>\n  <circle cx=\"418.02\" cy=\"263.11\" fill=\"none\" id=\"svg_3\" r=\"71.04\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.00508 0 0 0.95202 -33.7716 57.1212)\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"10\" x1=\"335.55\" x2=\"437.19\" y1=\"259.47\" y2=\"355.74\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"10\" x1=\"437.19\" x2=\"335.55\" y1=\"259.47\" y2=\"355.74\"/>\n  <path d=\"m458.78,318.08l10.05,0l0,-22.85l24.12,0l0,22.85l10.05,0\" fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"7\"/>\n  <line fill=\"none\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.00508 0 0 0.659856 -33.7716 175.755)\" x1=\"417.02\" x2=\"417.02\" y1=\"306.25\" y2=\"399.75\"/>\n  <path d=\"m376.57,443.03l2.35,-3.87l4.08,-2.23l4.71,0.0l4.08,2.23l2.35,3.87l0.0,4.46l-2.35,3.87l-4.08,2.23l-4.71,0.0l-4.08,-2.23l-2.35,-3.87l0.0,-4.46z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"},"load_buzzer(2).svg":{"vb":"364.91 78.7 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Top terminal node (12-sided polygon at x=225, y=62.7) -->\n  <!-- Top vertical stem (along x=225 from top terminal down to y=204) and horizontal lead RIGHT to bell dome at x=263 -->\n  <!-- Bell Symbol (Reversed D-shape: flat vertical back at x=321.5 from y=176 to y=304, curved dome facing left to x=250) -->\n  <!-- Bottom horizontal lead (from bell dome at x=263, y=276 LEFT to x=225) and vertical stem down to bottom terminal -->\n  <!-- Bottom terminal node (12-sided polygon at x=225, y=421.7) -->\n  <g id=\"svg_7\" transform=\"matrix(1 0 0 1.01916 0 -2.89709)\">\n   <path d=\"m560.29,125.38l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.828079 0 25.9893) matrix(1.0086 0 0 0.959594 -35.776 53.7867)\"/>\n   <path d=\"m569.04,131.27l0,129l38,0\" fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.828079 0 25.9893) matrix(1.0086 0 0 0.959594 -35.776 53.7867)\"/>\n   <path d=\"m665.54,232.27l0,128a71.5,64 0 0 1 0,-128z\" fill=\"none\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.828079 0 25.9893) matrix(1.0086 0 0 0.959594 -35.776 53.7867)\"/>\n   <path d=\"m607.04,332.27l-38,0l0,129\" fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.828079 0 25.9893) matrix(1.0086 0 0 0.959594 -35.776 53.7867)\"/>\n   <path d=\"m560.29,466.88l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.828079 0 25.9893) matrix(1.0086 0 0 0.959594 -35.776 53.7867)\"/>\n  </g>\n </g>"},"load_buzzer.svg":{"vb":"364.91 78.7 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Top terminal node (12-sided polygon at x=225, y=62.7) -->\n  <!-- Top vertical stem (along x=225 from top terminal down to y=204) and horizontal lead RIGHT to bell dome at x=263 -->\n  <!-- Bell Symbol (Reversed D-shape: flat vertical back at x=321.5 from y=176 to y=304, curved dome facing left to x=250) -->\n  <!-- Bottom horizontal lead (from bell dome at x=263, y=276 LEFT to x=225) and vertical stem down to bottom terminal -->\n  <!-- Bottom terminal node (12-sided polygon at x=225, y=421.7) -->\n  <g id=\"svg_7\" transform=\"matrix(1 0 0 1.01916 0 -2.89709)\">\n   <path d=\"m560.29,125.38l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.828079 0 25.9893) matrix(1.0086 0 0 0.959594 -35.776 53.7867)\"/>\n   <path d=\"m569.04,131.27l0,129l38,0\" fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.828079 0 25.9893) matrix(1.0086 0 0 0.959594 -35.776 53.7867)\"/>\n   <path d=\"m665.54,232.27l0,128a71.5,64 0 0 1 0,-128z\" fill=\"none\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.828079 0 25.9893) matrix(1.0086 0 0 0.959594 -35.776 53.7867)\"/>\n   <path d=\"m607.04,332.27l-38,0l0,129\" fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.828079 0 25.9893) matrix(1.0086 0 0 0.959594 -35.776 53.7867)\"/>\n   <path d=\"m560.29,466.88l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.828079 0 25.9893) matrix(1.0086 0 0 0.959594 -35.776 53.7867)\"/>\n  </g>\n </g>"},"load_light(2).svg":{"vb":"166.5 155.71 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Top terminal node (12-sided polygon) -->\n  <!-- Top vertical stem -->\n  <!-- Indicator Lamp Circle (Diameter = 96px, Radius = 48px, centered at 225, 240) -->\n  <!-- Internal 'X' Cross inside Circle -->\n  <!-- Bottom vertical stem -->\n  <!-- Bottom terminal node (12-sided polygon) -->\n  <path d=\"m407.25,206.35l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.954545 -32 56.0096)\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"9\" transform=\"matrix(1 0 0 0.507435 -32 130.949)\" x1=\"416\" x2=\"416\" y1=\"245.96\" y2=\"362.96\"/>\n  <circle cx=\"416\" cy=\"344.76\" fill=\"none\" id=\"svg_3\" r=\"71.04\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.954545 -32 56.0096)\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"8\" x1=\"338.32\" x2=\"430.68\" y1=\"339.85\" y2=\"431.9\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"7\" x1=\"433.44\" x2=\"335.8\" y1=\"341.56\" y2=\"429.39\"/>\n  <line fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.509932 -32 261.01)\" x1=\"416\" x2=\"416\" y1=\"382.25\" y2=\"499.25\"/>\n  <path d=\"m407.25,483.95l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.954545 -32 56.0096)\"/>\n </g>"},"load_light.svg":{"vb":"166.5 155.71 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Top terminal node (12-sided polygon) -->\n  <!-- Top vertical stem -->\n  <!-- Indicator Lamp Circle (Diameter = 96px, Radius = 48px, centered at 225, 240) -->\n  <!-- Internal 'X' Cross inside Circle -->\n  <!-- Bottom vertical stem -->\n  <!-- Bottom terminal node (12-sided polygon) -->\n  <path d=\"m407.25,206.35l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.954545 -32 56.0096)\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"9\" transform=\"matrix(1 0 0 0.507435 -32 130.949)\" x1=\"416\" x2=\"416\" y1=\"245.96\" y2=\"362.96\"/>\n  <circle cx=\"416\" cy=\"344.76\" fill=\"none\" id=\"svg_3\" r=\"71.04\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.954545 -32 56.0096)\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"8\" x1=\"338.32\" x2=\"430.68\" y1=\"339.85\" y2=\"431.9\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"7\" x1=\"433.44\" x2=\"335.8\" y1=\"341.56\" y2=\"429.39\"/>\n  <line fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.509932 -32 261.01)\" x1=\"416\" x2=\"416\" y1=\"382.25\" y2=\"499.25\"/>\n  <path d=\"m407.25,483.95l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.954545 -32 56.0096)\"/>\n </g>"},"main_contacts_1p_no(1).svg":{"vb":"74.93 4.24 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stem -->\n  <!-- Semi-Circle (Power Contact Half-moon) -->\n  <!-- Bottom Stem -->\n  <!-- Switch Flapper (Normally Open Power Contact) -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"1\" Terminal Label -->\n  <!-- \"2\" Terminal Label -->\n  <!-- \"-KM1\" Label Rotated -90deg -->\n  <g id=\"svg_3\" transform=\"matrix(1 0 0 0.840085 -204 30.231)\">\n   <path d=\"m377.25,23.74l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.969697 127 54.3397)\"/>\n   <path d=\"m377.25,365.25l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.969697 127 54.3397)\"/>\n   <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 127 54.3397)\" x1=\"386\" x2=\"386\" y1=\"29.63\" y2=\"143.03\"/>\n   <path d=\"m386,107.03a18,18 0 0 0 0,36\" fill=\"#666666\" id=\"svg_semi_circle\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.969697 127 54.3397)\"/>\n   <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 127 54.3397)\" x1=\"386\" x2=\"386\" y1=\"268.63\" y2=\"359.63\"/>\n   <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"513\" x2=\"471.1\" y1=\"314.82\" y2=\"177.03\"/>\n  </g>\n </g>"},"main_contacts_1p_no.svg":{"vb":"74.93 4.24 435.0 464.0","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stem -->\n  <!-- Semi-Circle (Power Contact Half-moon) -->\n  <!-- Bottom Stem -->\n  <!-- Switch Flapper (Normally Open Power Contact) -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"1\" Terminal Label -->\n  <!-- \"2\" Terminal Label -->\n  <!-- \"-KM1\" Label Rotated -90deg -->\n  <g id=\"svg_3\" transform=\"matrix(1 0 0 0.840085 -204 30.231)\">\n   <path d=\"m377.25,23.74l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.969697 127 54.3397)\"/>\n   <path d=\"m377.25,365.25l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.969697 127 54.3397)\"/>\n   <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 127 54.3397)\" x1=\"386\" x2=\"386\" y1=\"29.63\" y2=\"143.03\"/>\n   <path d=\"m386,107.03a18,18 0 0 0 0,36\" fill=\"#666666\" id=\"svg_semi_circle\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.969697 127 54.3397)\"/>\n   <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 127 54.3397)\" x1=\"386\" x2=\"386\" y1=\"268.63\" y2=\"359.63\"/>\n   <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"513\" x2=\"471.1\" y1=\"314.82\" y2=\"177.03\"/>\n  </g>\n </g>"},"main_contacts_2p_no(1).svg":{"vb":"-44.12 2.22 435.0 464.0","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems -->\n  <!-- Contactor Semi-Circle Arcs -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-KM3\" Label Rotated -90deg -->\n  <path d=\"m126.5,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.80303 -41 39.708)\"/>\n  <path d=\"m126.5,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.80303 -41 39.708)\"/>\n  <path d=\"m306.0,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.80303 -41 39.708)\"/>\n  <path d=\"m306.0,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.80303 -41 39.708)\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.80303 -41 39.708)\" x1=\"135.25\" x2=\"135.25\" y1=\"75\" y2=\"160\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.80303 -41 39.708)\" x1=\"314.75\" x2=\"314.75\" y1=\"75\" y2=\"160\"/>\n  <path d=\"m135.25,130a15,15 0 0 0 0,30\" fill=\"#666666\" id=\"svg_contactor_arc1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.80303 -41 39.708)\"/>\n  <path d=\"m314.75,130a15,15 0 0 0 0,30\" fill=\"#666666\" id=\"svg_contactor_arc2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.80303 -41 39.708)\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"94.25\" x2=\"94.25\" y1=\"293.06\" y2=\"364.94\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"273.75\" x2=\"273.75\" y1=\"293.06\" y2=\"364.94\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"94.25\" x2=\"64.25\" y1=\"293.06\" y2=\"172.21\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"273.75\" x2=\"243.75\" y1=\"293.06\" y2=\"172.21\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"79.25\" x2=\"258.75\" y1=\"232.64\" y2=\"232.64\"/>\n </g>"},"main_contacts_2p_no.svg":{"vb":"-44.12 2.22 435.0 464.0","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems -->\n  <!-- Contactor Semi-Circle Arcs -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-KM3\" Label Rotated -90deg -->\n  <path d=\"m126.5,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.80303 -41 39.708)\"/>\n  <path d=\"m126.5,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.80303 -41 39.708)\"/>\n  <path d=\"m306.0,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.80303 -41 39.708)\"/>\n  <path d=\"m306.0,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.80303 -41 39.708)\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.80303 -41 39.708)\" x1=\"135.25\" x2=\"135.25\" y1=\"75\" y2=\"160\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.80303 -41 39.708)\" x1=\"314.75\" x2=\"314.75\" y1=\"75\" y2=\"160\"/>\n  <path d=\"m135.25,130a15,15 0 0 0 0,30\" fill=\"#666666\" id=\"svg_contactor_arc1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.80303 -41 39.708)\"/>\n  <path d=\"m314.75,130a15,15 0 0 0 0,30\" fill=\"#666666\" id=\"svg_contactor_arc2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.80303 -41 39.708)\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"94.25\" x2=\"94.25\" y1=\"293.06\" y2=\"364.94\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"273.75\" x2=\"273.75\" y1=\"293.06\" y2=\"364.94\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"94.25\" x2=\"64.25\" y1=\"293.06\" y2=\"172.21\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"273.75\" x2=\"243.75\" y1=\"293.06\" y2=\"172.21\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"79.25\" x2=\"258.75\" y1=\"232.64\" y2=\"232.64\"/>\n </g>"},"main_contacts_3p_no(1).svg":{"vb":"-6.0 29.21 453.76 484.01","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems -->\n  <!-- Contactor Semi-Circle Arcs -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-KM2\" Label Rotated -90deg -->\n  <path d=\"m81.75,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 -12 31)\"/>\n  <path d=\"m81.75,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 -12 31)\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 1 -12 31)\" x1=\"90.5\" x2=\"90.5\" y1=\"75\" y2=\"160\"/>\n  <path d=\"m90.5,130a15,15 0 0 0 0,30\" fill=\"#666666\" id=\"svg_contactor_arc1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 1 -12 31)\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 1 -12 31)\" x1=\"90.5\" x2=\"90.5\" y1=\"315.5\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 1 -12 31)\" x1=\"90.5\" x2=\"60.5\" y1=\"315.5\" y2=\"165\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"8\" transform=\"matrix(0.850949 0 0 1 -1.49187 31)\" x1=\"75.5\" x2=\"434.5\" y1=\"240.25\" y2=\"240.25\"/>\n  <path d=\"m229.25,67.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 -6 30)\"/>\n  <path d=\"m222.25,437.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 1 6 -1) matrix(1 0 0 1 -12 31)\" x1=\"238\" x2=\"238\" y1=\"73\" y2=\"158\"/>\n  <path d=\"m238,128a15,15 0 0 0 0,30\" fill=\"#666666\" id=\"svg_contactor_arc2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 1 -6 30)\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 1 6 -1) matrix(1 0 0 1 -12 31)\" x1=\"238\" x2=\"238\" y1=\"313.5\" y2=\"403\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 1 6 -1) matrix(1 0 0 1 -12 31)\" x1=\"238\" x2=\"208\" y1=\"313.5\" y2=\"163\"/>\n  <path d=\"m440.75,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 -65 27)\"/>\n  <path d=\"m440.75,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 -65 27)\"/>\n  <line fill=\"none\" id=\"svg_stem_top3\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 1 -53 -4) matrix(1 0 0 1 -12 31)\" x1=\"449.5\" x2=\"449.5\" y1=\"75\" y2=\"160\"/>\n  <path d=\"m449.5,130a15,15 0 0 0 0,30\" fill=\"#666666\" id=\"svg_contactor_arc3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 1 -65 27)\"/>\n  <line fill=\"none\" id=\"svg_stem_bot3\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 1 -53 -4) matrix(1 0 0 1 -12 31)\" x1=\"449.5\" x2=\"449.5\" y1=\"315.5\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 1 -53 -4) matrix(1 0 0 1 -12 31)\" x1=\"449.5\" x2=\"419.5\" y1=\"315.5\" y2=\"165\"/>\n </g>"},"main_contacts_3p_no.svg":{"vb":"-6.0 29.21 453.76 484.01","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems -->\n  <!-- Contactor Semi-Circle Arcs -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-KM2\" Label Rotated -90deg -->\n  <path d=\"m81.75,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 -12 31)\"/>\n  <path d=\"m81.75,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 -12 31)\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 1 -12 31)\" x1=\"90.5\" x2=\"90.5\" y1=\"75\" y2=\"160\"/>\n  <path d=\"m90.5,130a15,15 0 0 0 0,30\" fill=\"#666666\" id=\"svg_contactor_arc1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 1 -12 31)\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 1 -12 31)\" x1=\"90.5\" x2=\"90.5\" y1=\"315.5\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 1 -12 31)\" x1=\"90.5\" x2=\"60.5\" y1=\"315.5\" y2=\"165\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"8\" transform=\"matrix(0.850949 0 0 1 -1.49187 31)\" x1=\"75.5\" x2=\"434.5\" y1=\"240.25\" y2=\"240.25\"/>\n  <path d=\"m229.25,67.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 -6 30)\"/>\n  <path d=\"m222.25,437.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 1 6 -1) matrix(1 0 0 1 -12 31)\" x1=\"238\" x2=\"238\" y1=\"73\" y2=\"158\"/>\n  <path d=\"m238,128a15,15 0 0 0 0,30\" fill=\"#666666\" id=\"svg_contactor_arc2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 1 -6 30)\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 1 6 -1) matrix(1 0 0 1 -12 31)\" x1=\"238\" x2=\"238\" y1=\"313.5\" y2=\"403\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 1 6 -1) matrix(1 0 0 1 -12 31)\" x1=\"238\" x2=\"208\" y1=\"313.5\" y2=\"163\"/>\n  <path d=\"m440.75,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 -65 27)\"/>\n  <path d=\"m440.75,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 -65 27)\"/>\n  <line fill=\"none\" id=\"svg_stem_top3\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 1 -53 -4) matrix(1 0 0 1 -12 31)\" x1=\"449.5\" x2=\"449.5\" y1=\"75\" y2=\"160\"/>\n  <path d=\"m449.5,130a15,15 0 0 0 0,30\" fill=\"#666666\" id=\"svg_contactor_arc3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 1 -65 27)\"/>\n  <line fill=\"none\" id=\"svg_stem_bot3\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 1 -53 -4) matrix(1 0 0 1 -12 31)\" x1=\"449.5\" x2=\"449.5\" y1=\"315.5\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 1 -53 -4) matrix(1 0 0 1 -12 31)\" x1=\"449.5\" x2=\"419.5\" y1=\"315.5\" y2=\"165\"/>\n </g>"},"protection_circuit_breaker_1p(1).svg":{"vb":"-38.92 54.81 437.55 466.72","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stem -->\n  <!-- Circuit Breaker 'X' Symbol -->\n  <!-- Bottom Stem -->\n  <!-- Switch Flapper (Normally Open) -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-Q1\" Label Rotated -90deg -->\n  <path d=\"m216.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.975005 -30 52.0031)\"/>\n  <path d=\"m216.25,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.975005 -30 52.0031)\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"8\" x1=\"195\" x2=\"195\" y1=\"114.13\" y2=\"221.87\"/>\n  <line fill=\"none\" id=\"svg_cb_x1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"translate(0 0) matrix(1 0 0 0.975005 -30 52.0031)\" x1=\"213.7\" x2=\"236.3\" y1=\"162.8\" y2=\"185.5\"/>\n  <line fill=\"none\" id=\"svg_cb_x2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.975005 -30 52.0031)\" x1=\"213.7\" x2=\"236.3\" y1=\"185.5\" y2=\"162.8\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"8\" transform=\"translate(0 0) matrix(1 0 0 0.975005 -30 52.0031)\" x1=\"225\" x2=\"225\" y1=\"298.9\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"translate(0 0) matrix(1 0 0 0.975005 -30 52.0031)\" x1=\"225\" x2=\"183.4\" y1=\"298.9\" y2=\"178\"/>\n </g>"},"protection_circuit_breaker_1p.svg":{"vb":"-38.92 54.81 437.55 466.72","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stem -->\n  <!-- Circuit Breaker 'X' Symbol -->\n  <!-- Bottom Stem -->\n  <!-- Switch Flapper (Normally Open) -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-Q1\" Label Rotated -90deg -->\n  <path d=\"m216.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.975005 -30 52.0031)\"/>\n  <path d=\"m216.25,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.975005 -30 52.0031)\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"8\" x1=\"195\" x2=\"195\" y1=\"114.13\" y2=\"221.87\"/>\n  <line fill=\"none\" id=\"svg_cb_x1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"translate(0 0) matrix(1 0 0 0.975005 -30 52.0031)\" x1=\"213.7\" x2=\"236.3\" y1=\"162.8\" y2=\"185.5\"/>\n  <line fill=\"none\" id=\"svg_cb_x2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.975005 -30 52.0031)\" x1=\"213.7\" x2=\"236.3\" y1=\"185.5\" y2=\"162.8\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"8\" transform=\"translate(0 0) matrix(1 0 0 0.975005 -30 52.0031)\" x1=\"225\" x2=\"225\" y1=\"298.9\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"translate(0 0) matrix(1 0 0 0.975005 -30 52.0031)\" x1=\"225\" x2=\"183.4\" y1=\"298.9\" y2=\"178\"/>\n </g>"},"protection_circuit_breaker_2p(1).svg":{"vb":"-32.78 52.04 436.27 465.35","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems -->\n  <!-- Circuit Breaker 'X' Symbols -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-Q2\" Label Rotated -90deg -->\n  <path d=\"m91.5,116.43l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.56l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.56z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m91.5,448.44l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.56l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.56z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m292.0,116.43l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.56l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.56z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m292.0,448.44l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.56l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.56z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"8\" x1=\"100.25\" x2=\"100.25\" y1=\"122.14\" y2=\"218.39\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"8\" x1=\"300.75\" x2=\"300.75\" y1=\"122.14\" y2=\"218.39\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"88.95\" x2=\"111.55\" y1=\"207.41\" y2=\"229.38\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"88.95\" x2=\"111.55\" y1=\"229.38\" y2=\"207.41\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"289.45\" x2=\"312.05\" y1=\"207.41\" y2=\"229.38\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"289.45\" x2=\"312.05\" y1=\"229.38\" y2=\"207.41\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"8\" x1=\"100.25\" x2=\"100.25\" y1=\"339.83\" y2=\"442.98\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"8\" x1=\"300.75\" x2=\"300.75\" y1=\"339.83\" y2=\"442.98\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"100.25\" x2=\"58.65\" y1=\"339.83\" y2=\"222.28\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"300.75\" x2=\"259.15\" y1=\"339.83\" y2=\"222.28\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"8\" x1=\"79.45\" x2=\"281.95\" y1=\"281.1\" y2=\"281.1\"/>\n </g>"},"protection_circuit_breaker_2p.svg":{"vb":"-32.78 52.04 436.27 465.35","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems -->\n  <!-- Circuit Breaker 'X' Symbols -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-Q2\" Label Rotated -90deg -->\n  <path d=\"m91.5,116.43l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.56l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.56z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m91.5,448.44l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.56l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.56z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m292.0,116.43l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.56l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.56z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m292.0,448.44l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.56l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.56z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"8\" x1=\"100.25\" x2=\"100.25\" y1=\"122.14\" y2=\"218.39\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"8\" x1=\"300.75\" x2=\"300.75\" y1=\"122.14\" y2=\"218.39\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"88.95\" x2=\"111.55\" y1=\"207.41\" y2=\"229.38\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"88.95\" x2=\"111.55\" y1=\"229.38\" y2=\"207.41\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"289.45\" x2=\"312.05\" y1=\"207.41\" y2=\"229.38\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"289.45\" x2=\"312.05\" y1=\"229.38\" y2=\"207.41\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"8\" x1=\"100.25\" x2=\"100.25\" y1=\"339.83\" y2=\"442.98\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"8\" x1=\"300.75\" x2=\"300.75\" y1=\"339.83\" y2=\"442.98\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"100.25\" x2=\"58.65\" y1=\"339.83\" y2=\"222.28\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"300.75\" x2=\"259.15\" y1=\"339.83\" y2=\"222.28\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"8\" x1=\"79.45\" x2=\"281.95\" y1=\"281.1\" y2=\"281.1\"/>\n </g>"},"protection_circuit_breaker_3p(1).svg":{"vb":"21.47 50.73 527.77 467.95","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems -->\n  <!-- Circuit Breaker 'X' Symbols -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-Q3\" Label Rotated -90deg -->\n  <path d=\"m91.75,116.48l2.35,-3.96l4.06,-2.29l4.69,0.0l4.06,2.29l2.35,3.96l0.0,4.57l-2.35,3.96l-4.06,2.29l-4.69,0.0l-4.06,-2.29l-2.35,-3.96l0.0,-4.57z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m91.75,449.37l2.35,-3.96l4.06,-2.29l4.69,0.0l4.06,2.29l2.35,3.96l0.0,4.57l-2.35,3.96l-4.06,2.29l-4.69,0.0l-4.06,-2.29l-2.35,-3.96l0.0,-4.57z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m292.25,115.48l2.35,-3.96l4.06,-2.29l4.69,0.0l4.06,2.29l2.35,3.96l0.0,4.57l-2.35,3.96l-4.06,2.29l-4.69,0.0l-4.06,-2.29l-2.35,-3.96l0.0,-4.57z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m292.25,448.37l2.35,-3.96l4.06,-2.29l4.69,0.0l4.06,2.29l2.35,3.96l0.0,4.57l-2.35,3.96l-4.06,2.29l-4.69,0.0l-4.06,-2.29l-2.35,-3.96l0.0,-4.57z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m491.75,116.48l2.35,-3.96l4.06,-2.29l4.69,0.0l4.06,2.29l2.35,3.96l0.0,4.57l-2.35,3.96l-4.06,2.29l-4.69,0.0l-4.06,-2.29l-2.35,-3.96l0.0,-4.57z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m491.75,449.37l2.35,-3.96l4.06,-2.29l4.69,0.0l4.06,2.29l2.35,3.96l0.0,4.57l-2.35,3.96l-4.06,2.29l-4.69,0.0l-4.06,-2.29l-2.35,-3.96l0.0,-4.57z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"100.5\" x2=\"100.5\" y1=\"122.22\" y2=\"218.72\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"301\" x2=\"301\" y1=\"121.22\" y2=\"217.72\"/>\n  <line fill=\"none\" id=\"svg_stem_top3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"500.5\" x2=\"500.5\" y1=\"122.22\" y2=\"218.72\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"89.2\" x2=\"111.8\" y1=\"207.71\" y2=\"229.74\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"89.2\" x2=\"111.8\" y1=\"229.74\" y2=\"207.71\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"289.7\" x2=\"312.3\" y1=\"206.71\" y2=\"228.74\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"289.7\" x2=\"312.3\" y1=\"228.74\" y2=\"206.71\"/>\n  <line fill=\"none\" id=\"svg_cb_x3_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"489.2\" x2=\"511.8\" y1=\"207.71\" y2=\"229.74\"/>\n  <line fill=\"none\" id=\"svg_cb_x3_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"489.2\" x2=\"511.8\" y1=\"229.74\" y2=\"207.71\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"100.5\" x2=\"100.5\" y1=\"340.47\" y2=\"443.89\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"301\" x2=\"301\" y1=\"339.47\" y2=\"442.89\"/>\n  <line fill=\"none\" id=\"svg_stem_bot3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"500.5\" x2=\"500.5\" y1=\"340.47\" y2=\"443.89\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"100.5\" x2=\"58.9\" y1=\"340.47\" y2=\"222.62\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"301\" x2=\"259.4\" y1=\"339.47\" y2=\"221.62\"/>\n  <line fill=\"none\" id=\"svg_flapper3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"500.5\" x2=\"458.9\" y1=\"340.47\" y2=\"222.62\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"76.7\" x2=\"478.7\" y1=\"280.59\" y2=\"280.59\"/>\n </g>"},"protection_circuit_breaker_3p.svg":{"vb":"21.47 50.73 527.77 467.95","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems -->\n  <!-- Circuit Breaker 'X' Symbols -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-Q3\" Label Rotated -90deg -->\n  <path d=\"m91.75,116.48l2.35,-3.96l4.06,-2.29l4.69,0.0l4.06,2.29l2.35,3.96l0.0,4.57l-2.35,3.96l-4.06,2.29l-4.69,0.0l-4.06,-2.29l-2.35,-3.96l0.0,-4.57z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m91.75,449.37l2.35,-3.96l4.06,-2.29l4.69,0.0l4.06,2.29l2.35,3.96l0.0,4.57l-2.35,3.96l-4.06,2.29l-4.69,0.0l-4.06,-2.29l-2.35,-3.96l0.0,-4.57z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m292.25,115.48l2.35,-3.96l4.06,-2.29l4.69,0.0l4.06,2.29l2.35,3.96l0.0,4.57l-2.35,3.96l-4.06,2.29l-4.69,0.0l-4.06,-2.29l-2.35,-3.96l0.0,-4.57z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m292.25,448.37l2.35,-3.96l4.06,-2.29l4.69,0.0l4.06,2.29l2.35,3.96l0.0,4.57l-2.35,3.96l-4.06,2.29l-4.69,0.0l-4.06,-2.29l-2.35,-3.96l0.0,-4.57z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m491.75,116.48l2.35,-3.96l4.06,-2.29l4.69,0.0l4.06,2.29l2.35,3.96l0.0,4.57l-2.35,3.96l-4.06,2.29l-4.69,0.0l-4.06,-2.29l-2.35,-3.96l0.0,-4.57z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m491.75,449.37l2.35,-3.96l4.06,-2.29l4.69,0.0l4.06,2.29l2.35,3.96l0.0,4.57l-2.35,3.96l-4.06,2.29l-4.69,0.0l-4.06,-2.29l-2.35,-3.96l0.0,-4.57z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"100.5\" x2=\"100.5\" y1=\"122.22\" y2=\"218.72\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"301\" x2=\"301\" y1=\"121.22\" y2=\"217.72\"/>\n  <line fill=\"none\" id=\"svg_stem_top3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"500.5\" x2=\"500.5\" y1=\"122.22\" y2=\"218.72\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"89.2\" x2=\"111.8\" y1=\"207.71\" y2=\"229.74\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"89.2\" x2=\"111.8\" y1=\"229.74\" y2=\"207.71\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"289.7\" x2=\"312.3\" y1=\"206.71\" y2=\"228.74\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"289.7\" x2=\"312.3\" y1=\"228.74\" y2=\"206.71\"/>\n  <line fill=\"none\" id=\"svg_cb_x3_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"489.2\" x2=\"511.8\" y1=\"207.71\" y2=\"229.74\"/>\n  <line fill=\"none\" id=\"svg_cb_x3_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"489.2\" x2=\"511.8\" y1=\"229.74\" y2=\"207.71\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"100.5\" x2=\"100.5\" y1=\"340.47\" y2=\"443.89\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"301\" x2=\"301\" y1=\"339.47\" y2=\"442.89\"/>\n  <line fill=\"none\" id=\"svg_stem_bot3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"500.5\" x2=\"500.5\" y1=\"340.47\" y2=\"443.89\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"100.5\" x2=\"58.9\" y1=\"340.47\" y2=\"222.62\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"301\" x2=\"259.4\" y1=\"339.47\" y2=\"221.62\"/>\n  <line fill=\"none\" id=\"svg_flapper3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"500.5\" x2=\"458.9\" y1=\"340.47\" y2=\"222.62\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"76.7\" x2=\"478.7\" y1=\"280.59\" y2=\"280.59\"/>\n </g>"},"protection_fuse_1p(1).svg":{"vb":"5.5 53.22 435.0 464.0","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Continuous Vertical Stem -->\n  <!-- Fuse Box Body -->\n  <!-- Center: (225, 242.2). Dimensions: Width 53.85, Height 95.73 -->\n  <!-- Text Labels -->\n  <!-- \"1\" Terminal Label -->\n  <!-- \"2\" Terminal Label -->\n  <!-- \"-F1\" Label Rotated -90deg -->\n  <path d=\"m216.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.964646 -2 51.5631)\"/>\n  <path d=\"m216.25,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.964646 -2 51.5631)\"/>\n  <line fill=\"none\" id=\"svg_stem\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -2 51.5631)\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"405\"/>\n  <rect fill=\"none\" height=\"95.8\" id=\"svg_fuse_box\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -2 51.5631)\" width=\"53.8\" x=\"198.1\" y=\"194.3\"/>\n </g>"},"protection_fuse_1p.svg":{"vb":"5.5 53.22 435.0 464.0","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Continuous Vertical Stem -->\n  <!-- Fuse Box Body -->\n  <!-- Center: (225, 242.2). Dimensions: Width 53.85, Height 95.73 -->\n  <!-- Text Labels -->\n  <!-- \"1\" Terminal Label -->\n  <!-- \"2\" Terminal Label -->\n  <!-- \"-F1\" Label Rotated -90deg -->\n  <path d=\"m216.25,69.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.964646 -2 51.5631)\"/>\n  <path d=\"m216.25,410.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.964646 -2 51.5631)\"/>\n  <line fill=\"none\" id=\"svg_stem\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -2 51.5631)\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"405\"/>\n  <rect fill=\"none\" height=\"95.8\" id=\"svg_fuse_box\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -2 51.5631)\" width=\"53.8\" x=\"198.1\" y=\"194.3\"/>\n </g>"},"protection_fuse_2p(1).svg":{"vb":"-23.38 0.88 448.76 478.68","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <path d=\"m93.55,67.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m93.55,408.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m290.95,67.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m290.95,408.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <!-- Continuous Vertical Stems -->\n  <line fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"102.3\" x2=\"102.3\" y1=\"73\" y2=\"403\"/>\n  <line fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"299.7\" x2=\"299.7\" y1=\"73\" y2=\"403\"/>\n  <!-- Fuse Box Bodies -->\n  <!-- Center Y: 242.2. Height: 92.7. Width: 50.9 -->\n  <rect fill=\"none\" height=\"92.7\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" width=\"50.9\" x=\"76.85\" y=\"193.85\"/>\n  <rect fill=\"none\" height=\"92.7\" id=\"svg_fuse_box2\" stroke=\"#666666\" stroke-width=\"10\" width=\"50.9\" x=\"274.25\" y=\"193.85\"/>\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"1\" Terminal Label -->\n  <!-- \"2\" Terminal Label -->\n  <!-- \"3\" Terminal Label -->\n  <!-- \"4\" Terminal Label -->\n  <!-- \"-F2\" Label Rotated -90deg -->\n </g>"},"protection_fuse_2p.svg":{"vb":"-23.38 0.88 448.76 478.68","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <path d=\"m93.55,67.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m93.55,408.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m290.95,67.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m290.95,408.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <!-- Continuous Vertical Stems -->\n  <line fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"102.3\" x2=\"102.3\" y1=\"73\" y2=\"403\"/>\n  <line fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"299.7\" x2=\"299.7\" y1=\"73\" y2=\"403\"/>\n  <!-- Fuse Box Bodies -->\n  <!-- Center Y: 242.2. Height: 92.7. Width: 50.9 -->\n  <rect fill=\"none\" height=\"92.7\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" width=\"50.9\" x=\"76.85\" y=\"193.85\"/>\n  <rect fill=\"none\" height=\"92.7\" id=\"svg_fuse_box2\" stroke=\"#666666\" stroke-width=\"10\" width=\"50.9\" x=\"274.25\" y=\"193.85\"/>\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"1\" Terminal Label -->\n  <!-- \"2\" Terminal Label -->\n  <!-- \"3\" Terminal Label -->\n  <!-- \"4\" Terminal Label -->\n  <!-- \"-F2\" Label Rotated -90deg -->\n </g>"},"protection_fuse_3p(1).svg":{"vb":"36.25 52.79 528.49 466.83","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Continuous Vertical Stems -->\n  <!-- Fuse Box Bodies -->\n  <!-- Center Y: 242.2. Height: 95.8. Width: 53.8 -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-F3\" Label Rotated -90deg -->\n  <path d=\"m491.75,117.36l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m491.75,448.51l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"500.5\" x2=\"500.5\" y1=\"123.07\" y2=\"443.07\"/>\n  <rect fill=\"none\" height=\"95.8\" id=\"svg_fuse_box3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 19 51.3397)\" width=\"53.8\" x=\"454.6\" y=\"193.27\"/>\n  <path d=\"m100.75,118.36l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 -9 1)\"/>\n  <path d=\"m100.75,449.51l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 -9 1)\"/>\n  <line fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 -9 1)\" x1=\"109.5\" x2=\"109.5\" y1=\"124.07\" y2=\"444.07\"/>\n  <rect fill=\"none\" height=\"95.8\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 -9 1) matrix(1 0 0 0.969697 19 51.3397)\" width=\"53.8\" x=\"63.6\" y=\"194.3\"/>\n  <path d=\"m280.25,118.36l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 10 1)\"/>\n  <path d=\"m280.25,449.51l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 10 1)\"/>\n  <line fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 10 1)\" x1=\"289\" x2=\"289\" y1=\"124.07\" y2=\"444.07\"/>\n  <rect fill=\"none\" height=\"95.8\" id=\"svg_fuse_box2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 10 1) matrix(1 0 0 0.969697 19 51.3397)\" width=\"53.8\" x=\"243.1\" y=\"194.3\"/>\n </g>"},"protection_fuse_3p.svg":{"vb":"36.25 52.79 528.49 466.83","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Continuous Vertical Stems -->\n  <!-- Fuse Box Bodies -->\n  <!-- Center Y: 242.2. Height: 95.8. Width: 53.8 -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-F3\" Label Rotated -90deg -->\n  <path d=\"m491.75,117.36l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m491.75,448.51l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"500.5\" x2=\"500.5\" y1=\"123.07\" y2=\"443.07\"/>\n  <rect fill=\"none\" height=\"95.8\" id=\"svg_fuse_box3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 19 51.3397)\" width=\"53.8\" x=\"454.6\" y=\"193.27\"/>\n  <path d=\"m100.75,118.36l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 -9 1)\"/>\n  <path d=\"m100.75,449.51l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 -9 1)\"/>\n  <line fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 -9 1)\" x1=\"109.5\" x2=\"109.5\" y1=\"124.07\" y2=\"444.07\"/>\n  <rect fill=\"none\" height=\"95.8\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 -9 1) matrix(1 0 0 0.969697 19 51.3397)\" width=\"53.8\" x=\"63.6\" y=\"194.3\"/>\n  <path d=\"m280.25,118.36l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 10 1)\"/>\n  <path d=\"m280.25,449.51l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 10 1)\"/>\n  <line fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 10 1)\" x1=\"289\" x2=\"289\" y1=\"124.07\" y2=\"444.07\"/>\n  <rect fill=\"none\" height=\"95.8\" id=\"svg_fuse_box2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 10 1) matrix(1 0 0 0.969697 19 51.3397)\" width=\"53.8\" x=\"243.1\" y=\"194.3\"/>\n </g>"},"protection_fuse_4p(1).svg":{"vb":"35.79 51.63 727.93 466.41","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Continuous Vertical Stems -->\n  <!-- Fuse Box Bodies -->\n  <!-- Text Labels -->\n  <!-- \"-F4\" Label Rotated -90deg -->\n  <path d=\"m91.25,116.15l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m91.25,447.97l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m290.61,117.15l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m290.61,448.97l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m492.25,116.15l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m492.25,447.97l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m690.75,116.15l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m690.75,447.97l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"100\" x2=\"100\" y1=\"121.87\" y2=\"442.51\"/>\n  <line fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"299.36\" x2=\"299.36\" y1=\"122.87\" y2=\"443.51\"/>\n  <line fill=\"none\" id=\"svg_stem3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"501\" x2=\"501\" y1=\"121.87\" y2=\"442.51\"/>\n  <line fill=\"none\" id=\"svg_stem4\" stroke=\"#666666\" stroke-width=\"10\" x1=\"699.5\" x2=\"699.5\" y1=\"121.87\" y2=\"442.51\"/>\n  <rect fill=\"none\" height=\"95.8\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971627 5 49.9973)\" width=\"53.8\" x=\"68.1\" y=\"193.27\"/>\n  <rect fill=\"none\" height=\"95.8\" id=\"svg_fuse_box2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971627 5 49.9973)\" width=\"53.8\" x=\"267.46\" y=\"194.3\"/>\n  <rect fill=\"none\" height=\"95.8\" id=\"svg_fuse_box3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971627 5 49.9973)\" width=\"53.8\" x=\"469.1\" y=\"193.27\"/>\n  <rect fill=\"none\" height=\"95.8\" id=\"svg_fuse_box4\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971627 5 49.9973)\" width=\"53.8\" x=\"667.6\" y=\"193.27\"/>\n </g>"},"protection_fuse_4p.svg":{"vb":"35.79 51.63 727.93 466.41","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Continuous Vertical Stems -->\n  <!-- Fuse Box Bodies -->\n  <!-- Text Labels -->\n  <!-- \"-F4\" Label Rotated -90deg -->\n  <path d=\"m91.25,116.15l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m91.25,447.97l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m290.61,117.15l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m290.61,448.97l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m492.25,116.15l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m492.25,447.97l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m690.75,116.15l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m690.75,447.97l2.35,-3.94l4.06,-2.28l4.69,0.0l4.06,2.28l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.28l-4.69,0.0l-4.06,-2.28l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"100\" x2=\"100\" y1=\"121.87\" y2=\"442.51\"/>\n  <line fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"299.36\" x2=\"299.36\" y1=\"122.87\" y2=\"443.51\"/>\n  <line fill=\"none\" id=\"svg_stem3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"501\" x2=\"501\" y1=\"121.87\" y2=\"442.51\"/>\n  <line fill=\"none\" id=\"svg_stem4\" stroke=\"#666666\" stroke-width=\"10\" x1=\"699.5\" x2=\"699.5\" y1=\"121.87\" y2=\"442.51\"/>\n  <rect fill=\"none\" height=\"95.8\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971627 5 49.9973)\" width=\"53.8\" x=\"68.1\" y=\"193.27\"/>\n  <rect fill=\"none\" height=\"95.8\" id=\"svg_fuse_box2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971627 5 49.9973)\" width=\"53.8\" x=\"267.46\" y=\"194.3\"/>\n  <rect fill=\"none\" height=\"95.8\" id=\"svg_fuse_box3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971627 5 49.9973)\" width=\"53.8\" x=\"469.1\" y=\"193.27\"/>\n  <rect fill=\"none\" height=\"95.8\" id=\"svg_fuse_box4\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971627 5 49.9973)\" width=\"53.8\" x=\"667.6\" y=\"193.27\"/>\n </g>"},"protection_fuse_isolator_1p(1).svg":{"vb":"221.93 151.18 435.85 464.91","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems & Disconnector Bars -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Rectangular Fuse Boxes on Flappers -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-F6\" Label Rotated -90deg -->\n  <path d=\"m444.61,190.54l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\"/>\n  <path d=\"m444.61,532.05l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"453.36\" x2=\"453.36\" y1=\"196.43\" y2=\"281.43\"/>\n  <line fill=\"none\" id=\"svg_disc_bar1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"423.36\" x2=\"483.36\" y1=\"281.43\" y2=\"281.43\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"453.36\" x2=\"453.36\" y1=\"436.93\" y2=\"526.43\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"453.17\" x2=\"406.4\" y1=\"436.19\" y2=\"290.03\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.963841 -0.258804 0.266477 0.936085 -89.0617 158.002)\" width=\"45\" x=\"415.86\" y=\"317.43\"/>\n </g>"},"protection_fuse_isolator_1p.svg":{"vb":"221.93 151.18 435.85 464.91","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems & Disconnector Bars -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Rectangular Fuse Boxes on Flappers -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-F6\" Label Rotated -90deg -->\n  <path d=\"m444.61,190.54l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\"/>\n  <path d=\"m444.61,532.05l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"453.36\" x2=\"453.36\" y1=\"196.43\" y2=\"281.43\"/>\n  <line fill=\"none\" id=\"svg_disc_bar1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"423.36\" x2=\"483.36\" y1=\"281.43\" y2=\"281.43\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"453.36\" x2=\"453.36\" y1=\"436.93\" y2=\"526.43\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"453.17\" x2=\"406.4\" y1=\"436.19\" y2=\"290.03\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.963841 -0.258804 0.266477 0.936085 -89.0617 158.002)\" width=\"45\" x=\"415.86\" y=\"317.43\"/>\n </g>"},"protection_fuse_isolator_2p(1).svg":{"vb":"267.58 147.04 437.05 466.19","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems & Disconnector Bars -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Rectangular Fuse Boxes on Flappers -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-F6\" Label Rotated -90deg -->\n  <path d=\"m391.61,211.53l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m391.61,543.2l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m591.75,212.53l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m590.75,544.2l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"400.36\" x2=\"400.36\" y1=\"217.25\" y2=\"299.8\"/>\n  <line fill=\"none\" id=\"svg_disc_bar1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"370.36\" x2=\"430.36\" y1=\"299.8\" y2=\"299.8\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"translate(0 0)\" x1=\"600\" x2=\"600\" y1=\"219\" y2=\"300.8\"/>\n  <line fill=\"none\" id=\"svg_disc_bar2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"568.86\" x2=\"628.86\" y1=\"300.8\" y2=\"300.8\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"400.36\" x2=\"400.36\" y1=\"450.82\" y2=\"537.74\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"598.86\" x2=\"598.86\" y1=\"451.82\" y2=\"538.74\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"400.17\" x2=\"353.4\" y1=\"450.1\" y2=\"308.15\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.963841 -0.258804 0.266477 0.936085 -89.0617 158.002)\" width=\"45\" x=\"365.87\" y=\"299.34\"/>\n  <line fill=\"none\" id=\"svg_13\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"599.18\" x2=\"552.4\" y1=\"451.1\" y2=\"309.15\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_14\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.963841 -0.258804 0.266478 0.936085 90.9383 158.002)\" width=\"45\" x=\"383.91\" y=\"305.39\"/>\n  <line fill=\"none\" id=\"svg_18\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"379.64\" x2=\"547.21\" y1=\"377.74\" y2=\"377.74\"/>\n </g>"},"protection_fuse_isolator_2p.svg":{"vb":"267.58 147.04 437.05 466.19","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems & Disconnector Bars -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Rectangular Fuse Boxes on Flappers -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-F6\" Label Rotated -90deg -->\n  <path d=\"m391.61,211.53l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m391.61,543.2l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m591.75,212.53l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m590.75,544.2l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"400.36\" x2=\"400.36\" y1=\"217.25\" y2=\"299.8\"/>\n  <line fill=\"none\" id=\"svg_disc_bar1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"370.36\" x2=\"430.36\" y1=\"299.8\" y2=\"299.8\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"translate(0 0)\" x1=\"600\" x2=\"600\" y1=\"219\" y2=\"300.8\"/>\n  <line fill=\"none\" id=\"svg_disc_bar2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"568.86\" x2=\"628.86\" y1=\"300.8\" y2=\"300.8\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"400.36\" x2=\"400.36\" y1=\"450.82\" y2=\"537.74\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"598.86\" x2=\"598.86\" y1=\"451.82\" y2=\"538.74\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"400.17\" x2=\"353.4\" y1=\"450.1\" y2=\"308.15\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.963841 -0.258804 0.266477 0.936085 -89.0617 158.002)\" width=\"45\" x=\"365.87\" y=\"299.34\"/>\n  <line fill=\"none\" id=\"svg_13\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"599.18\" x2=\"552.4\" y1=\"451.1\" y2=\"309.15\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_14\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.963841 -0.258804 0.266478 0.936085 90.9383 158.002)\" width=\"45\" x=\"383.91\" y=\"305.39\"/>\n  <line fill=\"none\" id=\"svg_18\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"379.64\" x2=\"547.21\" y1=\"377.74\" y2=\"377.74\"/>\n </g>"},"protection_fuse_isolator_3p(1).svg":{"vb":"305.52 143.21 561.67 472.85","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems & Disconnector Bars -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Rectangular Fuse Boxes on Flappers -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-F6\" Label Rotated -90deg -->\n  <path d=\"m391.61,213.53l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m391.61,545.2l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m591.11,214.53l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m591.11,546.2l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m790.61,208.53l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m790.61,540.19l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"400.36\" x2=\"400.36\" y1=\"219.25\" y2=\"301.8\"/>\n  <line fill=\"none\" id=\"svg_disc_bar1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"370.36\" x2=\"430.36\" y1=\"301.8\" y2=\"301.8\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"599.86\" x2=\"599.86\" y1=\"220.25\" y2=\"302.8\"/>\n  <line fill=\"none\" id=\"svg_disc_bar2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"569.86\" x2=\"629.86\" y1=\"302.8\" y2=\"302.8\"/>\n  <line fill=\"none\" id=\"svg_stem_top3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"799.36\" x2=\"799.36\" y1=\"214.24\" y2=\"296.8\"/>\n  <line fill=\"none\" id=\"svg_disc_bar3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"769.36\" x2=\"829.36\" y1=\"296.8\" y2=\"296.8\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"400.36\" x2=\"400.36\" y1=\"452.82\" y2=\"539.74\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"599.86\" x2=\"599.86\" y1=\"453.82\" y2=\"540.74\"/>\n  <line fill=\"none\" id=\"svg_stem_bot3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"799.36\" x2=\"799.36\" y1=\"447.82\" y2=\"534.74\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"374.64\" x2=\"770.5\" y1=\"378.74\" y2=\"378.74\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"400.17\" x2=\"353.4\" y1=\"452.1\" y2=\"310.15\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.963841 -0.258804 0.266477 0.936085 -89.0617 158.002)\" width=\"45\" x=\"365.33\" y=\"301.32\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"798.75\" x2=\"751.97\" y1=\"447.1\" y2=\"305.15\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.964348 -0.26327 0.262011 0.935578 270.902 160.143)\" width=\"45\" x=\"405.23\" y=\"306.96\"/>\n  <line fill=\"none\" id=\"svg_13\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"600.18\" x2=\"553.4\" y1=\"453.1\" y2=\"311.15\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_14\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.963841 -0.258804 0.266478 0.936085 90.9383 158.002)\" width=\"45\" x=\"384.33\" y=\"307.64\"/>\n  <line fill=\"none\" id=\"svg_21\" stroke=\"#666666\" stroke-width=\"10\" x1=\"799.36\" x2=\"799.36\" y1=\"214.24\" y2=\"296.8\"/>\n  <line fill=\"none\" id=\"svg_20\" stroke=\"#666666\" stroke-width=\"10\" x1=\"769.36\" x2=\"829.36\" y1=\"296.8\" y2=\"296.8\"/>\n  <line fill=\"none\" id=\"svg_19\" stroke=\"#666666\" stroke-width=\"10\" x1=\"799.36\" x2=\"799.36\" y1=\"447.82\" y2=\"534.74\"/>\n </g>"},"protection_fuse_isolator_3p.svg":{"vb":"305.52 143.21 561.67 472.85","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems & Disconnector Bars -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Rectangular Fuse Boxes on Flappers -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-F6\" Label Rotated -90deg -->\n  <path d=\"m391.61,213.53l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m391.61,545.2l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m591.11,214.53l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m591.11,546.2l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m790.61,208.53l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m790.61,540.19l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"400.36\" x2=\"400.36\" y1=\"219.25\" y2=\"301.8\"/>\n  <line fill=\"none\" id=\"svg_disc_bar1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"370.36\" x2=\"430.36\" y1=\"301.8\" y2=\"301.8\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"599.86\" x2=\"599.86\" y1=\"220.25\" y2=\"302.8\"/>\n  <line fill=\"none\" id=\"svg_disc_bar2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"569.86\" x2=\"629.86\" y1=\"302.8\" y2=\"302.8\"/>\n  <line fill=\"none\" id=\"svg_stem_top3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"799.36\" x2=\"799.36\" y1=\"214.24\" y2=\"296.8\"/>\n  <line fill=\"none\" id=\"svg_disc_bar3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"769.36\" x2=\"829.36\" y1=\"296.8\" y2=\"296.8\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"400.36\" x2=\"400.36\" y1=\"452.82\" y2=\"539.74\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"599.86\" x2=\"599.86\" y1=\"453.82\" y2=\"540.74\"/>\n  <line fill=\"none\" id=\"svg_stem_bot3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"799.36\" x2=\"799.36\" y1=\"447.82\" y2=\"534.74\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"374.64\" x2=\"770.5\" y1=\"378.74\" y2=\"378.74\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"400.17\" x2=\"353.4\" y1=\"452.1\" y2=\"310.15\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.963841 -0.258804 0.266477 0.936085 -89.0617 158.002)\" width=\"45\" x=\"365.33\" y=\"301.32\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"798.75\" x2=\"751.97\" y1=\"447.1\" y2=\"305.15\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.964348 -0.26327 0.262011 0.935578 270.902 160.143)\" width=\"45\" x=\"405.23\" y=\"306.96\"/>\n  <line fill=\"none\" id=\"svg_13\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"600.18\" x2=\"553.4\" y1=\"453.1\" y2=\"311.15\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_14\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.963841 -0.258804 0.266478 0.936085 90.9383 158.002)\" width=\"45\" x=\"384.33\" y=\"307.64\"/>\n  <line fill=\"none\" id=\"svg_21\" stroke=\"#666666\" stroke-width=\"10\" x1=\"799.36\" x2=\"799.36\" y1=\"214.24\" y2=\"296.8\"/>\n  <line fill=\"none\" id=\"svg_20\" stroke=\"#666666\" stroke-width=\"10\" x1=\"769.36\" x2=\"829.36\" y1=\"296.8\" y2=\"296.8\"/>\n  <line fill=\"none\" id=\"svg_19\" stroke=\"#666666\" stroke-width=\"10\" x1=\"799.36\" x2=\"799.36\" y1=\"447.82\" y2=\"534.74\"/>\n </g>"},"protection_fuse_isolator_4p(1).svg":{"vb":"306.16 153.21 762.1 464.85","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems & Disconnector Bars -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Rectangular Fuse Boxes on Flappers -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-F6\" Label Rotated -90deg -->\n  <path d=\"m391.61,217.53l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m391.61,549.2l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m590.11,217.53l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m590.11,546.2l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m791.61,217.53l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m791.75,546.19l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"400.36\" x2=\"400.36\" y1=\"223.25\" y2=\"305.8\"/>\n  <line fill=\"none\" id=\"svg_disc_bar1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"370.36\" x2=\"430.36\" y1=\"305.8\" y2=\"305.8\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"598.86\" x2=\"598.86\" y1=\"223.25\" y2=\"305.8\"/>\n  <line fill=\"none\" id=\"svg_disc_bar2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"568.86\" x2=\"628.86\" y1=\"305.8\" y2=\"305.8\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"400.36\" x2=\"400.36\" y1=\"456.82\" y2=\"543.74\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"598.86\" x2=\"598.86\" y1=\"453.82\" y2=\"540.74\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"381.64\" x2=\"968.79\" y1=\"383.74\" y2=\"383.74\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"400.17\" x2=\"353.4\" y1=\"456.1\" y2=\"314.15\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.963841 -0.258804 0.266477 0.936085 -89.0617 158.002)\" width=\"45\" x=\"364.23\" y=\"305.29\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"800\" x2=\"754.97\" y1=\"453.1\" y2=\"311.15\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.964348 -0.26327 0.262011 0.935578 270.902 160.143)\" width=\"45\" x=\"406.5\" y=\"313.73\"/>\n  <line fill=\"none\" id=\"svg_13\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"599.18\" x2=\"552.4\" y1=\"453.1\" y2=\"311.15\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_14\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.963841 -0.258804 0.266478 0.936085 90.9383 158.002)\" width=\"45\" x=\"383.36\" y=\"307.38\"/>\n  <line fill=\"none\" id=\"svg_21\" stroke=\"#666666\" stroke-width=\"10\" x1=\"800.36\" x2=\"800.36\" y1=\"223.24\" y2=\"305.8\"/>\n  <line fill=\"none\" id=\"svg_20\" stroke=\"#666666\" stroke-width=\"10\" x1=\"770.36\" x2=\"830.36\" y1=\"305.8\" y2=\"305.8\"/>\n  <line fill=\"none\" id=\"svg_19\" stroke=\"#666666\" stroke-width=\"10\" x1=\"801\" x2=\"801\" y1=\"453.82\" y2=\"540.74\"/>\n  <line fill=\"none\" id=\"svg_30\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"1000\" x2=\"954.68\" y1=\"452.1\" y2=\"310.15\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_29\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.964348 -0.26327 0.262011 0.935578 270.902 160.143)\" width=\"45\" x=\"599.15\" y=\"366.87\"/>\n  <path d=\"m992.32,217.53l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_28\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m991.75,545.19l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_27\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_26\" stroke=\"#666666\" stroke-width=\"10\" x1=\"1001.07\" x2=\"1001.07\" y1=\"223.24\" y2=\"305.8\"/>\n  <line fill=\"none\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"10\" x1=\"971.07\" x2=\"1031.07\" y1=\"305.8\" y2=\"305.8\"/>\n  <line fill=\"none\" id=\"svg_24\" stroke=\"#666666\" stroke-width=\"10\" x1=\"1001\" x2=\"1001\" y1=\"452.82\" y2=\"539.74\"/>\n </g>"},"protection_fuse_isolator_4p.svg":{"vb":"306.16 153.21 762.1 464.85","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems & Disconnector Bars -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Rectangular Fuse Boxes on Flappers -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-F6\" Label Rotated -90deg -->\n  <path d=\"m391.61,217.53l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m391.61,549.2l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m590.11,217.53l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m590.11,546.2l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m791.61,217.53l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m791.75,546.19l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"400.36\" x2=\"400.36\" y1=\"223.25\" y2=\"305.8\"/>\n  <line fill=\"none\" id=\"svg_disc_bar1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"370.36\" x2=\"430.36\" y1=\"305.8\" y2=\"305.8\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"598.86\" x2=\"598.86\" y1=\"223.25\" y2=\"305.8\"/>\n  <line fill=\"none\" id=\"svg_disc_bar2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"568.86\" x2=\"628.86\" y1=\"305.8\" y2=\"305.8\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"400.36\" x2=\"400.36\" y1=\"456.82\" y2=\"543.74\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"598.86\" x2=\"598.86\" y1=\"453.82\" y2=\"540.74\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"381.64\" x2=\"968.79\" y1=\"383.74\" y2=\"383.74\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"400.17\" x2=\"353.4\" y1=\"456.1\" y2=\"314.15\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.963841 -0.258804 0.266477 0.936085 -89.0617 158.002)\" width=\"45\" x=\"364.23\" y=\"305.29\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"800\" x2=\"754.97\" y1=\"453.1\" y2=\"311.15\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.964348 -0.26327 0.262011 0.935578 270.902 160.143)\" width=\"45\" x=\"406.5\" y=\"313.73\"/>\n  <line fill=\"none\" id=\"svg_13\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"599.18\" x2=\"552.4\" y1=\"453.1\" y2=\"311.15\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_14\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.963841 -0.258804 0.266478 0.936085 90.9383 158.002)\" width=\"45\" x=\"383.36\" y=\"307.38\"/>\n  <line fill=\"none\" id=\"svg_21\" stroke=\"#666666\" stroke-width=\"10\" x1=\"800.36\" x2=\"800.36\" y1=\"223.24\" y2=\"305.8\"/>\n  <line fill=\"none\" id=\"svg_20\" stroke=\"#666666\" stroke-width=\"10\" x1=\"770.36\" x2=\"830.36\" y1=\"305.8\" y2=\"305.8\"/>\n  <line fill=\"none\" id=\"svg_19\" stroke=\"#666666\" stroke-width=\"10\" x1=\"801\" x2=\"801\" y1=\"453.82\" y2=\"540.74\"/>\n  <line fill=\"none\" id=\"svg_30\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"1000\" x2=\"954.68\" y1=\"452.1\" y2=\"310.15\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_29\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.964348 -0.26327 0.262011 0.935578 270.902 160.143)\" width=\"45\" x=\"599.15\" y=\"366.87\"/>\n  <path d=\"m992.32,217.53l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_28\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m991.75,545.19l2.35,-3.94l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.94l0.0,4.55l-2.35,3.94l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.94l0.0,-4.55z\" fill=\"#666666\" id=\"svg_27\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_26\" stroke=\"#666666\" stroke-width=\"10\" x1=\"1001.07\" x2=\"1001.07\" y1=\"223.24\" y2=\"305.8\"/>\n  <line fill=\"none\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"10\" x1=\"971.07\" x2=\"1031.07\" y1=\"305.8\" y2=\"305.8\"/>\n  <line fill=\"none\" id=\"svg_24\" stroke=\"#666666\" stroke-width=\"10\" x1=\"1001\" x2=\"1001\" y1=\"452.82\" y2=\"539.74\"/>\n </g>"},"protection_motor_circuit_breaker_2p(1).svg":{"vb":"657.88 -58.43 863.15 920.69","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems -->\n  <!-- Circuit Breaker 'X' Symbols -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Connectors from Flapper to Protection Box -->\n  <!-- Protection Main Box (Thermal/Magnetic) -->\n  <!-- Thermal Overload Pulses -->\n  <!-- Magnetic Overcurrent Vectors (I>) -->\n  <!-- Bottom Stems -->\n  <!-- Mechanism Actuator Box -->\n  <!-- Left Latch (Manual Handle Indicator) -->\n  <!-- Dashed Mechanical Linkages -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-Q6\" Label Rotated -90deg -->\n  <path d=\"m774.17,260.47l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.74654 0 0 1.92345 -362.658 -432.012)\"/>\n  <path d=\"m774.17,601.96l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.74654 0 0 1.92345 -362.658 -432.012)\"/>\n  <path d=\"m1284.97,68.98l4.09,-7.81l7.09,-4.51l8.19,0.0l7.09,4.51l4.09,7.81l0.0,9.02l-4.09,7.81l-7.09,4.51l-8.19,0.0l-7.09,-4.51l-4.09,-7.81l0.0,-9.02z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m942.22,601.96l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.74654 0 0 1.92345 -362.658 -432.012)\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"1004.75\" x2=\"1004.75\" y1=\"80.3\" y2=\"209.18\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"1300.25\" x2=\"1300.25\" y1=\"80.3\" y2=\"209.18\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\" x1=\"771.62\" x2=\"794.22\" y1=\"310.05\" y2=\"332.65\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\" x1=\"771.62\" x2=\"794.22\" y1=\"332.65\" y2=\"310.05\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\" x1=\"940.82\" x2=\"963.42\" y1=\"310.05\" y2=\"332.65\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1.74654 0 0 1.92345 -362.658 -432.012)\" x1=\"940.82\" x2=\"963.42\" y1=\"332.65\" y2=\"310.05\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"1004.75\" x2=\"957.59\" y1=\"363.05\" y2=\"209.18\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"1300.25\" x2=\"1253.1\" y1=\"363.05\" y2=\"209.18\"/>\n  <line fill=\"none\" id=\"svg_conn1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"1004.75\" x2=\"1004.75\" y1=\"363.05\" y2=\"413.06\"/>\n  <line fill=\"none\" id=\"svg_conn2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"1300.25\" x2=\"1300.25\" y1=\"363.05\" y2=\"413.06\"/>\n  <rect fill=\"none\" height=\"107\" id=\"svg_prot_box\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.74654 0 0 1.92345 -362.657 -432.012)\" width=\"229.5\" x=\"757.92\" y=\"439.35\"/>\n  <line fill=\"none\" id=\"svg_prot_divider\" stroke=\"#666666\" stroke-width=\"10\" x1=\"961.09\" x2=\"1361.92\" y1=\"516.93\" y2=\"516.93\"/>\n  <path d=\"m782.92,454.35l25,0l0,30l-25,0l0,9\" fill=\"none\" id=\"svg_thermal1\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"8\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\"/>\n  <path d=\"m962.42,454.35l25,0l0,30l-25,0l0,9\" fill=\"none\" id=\"svg_thermal2\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"8\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\"/>\n  <g fill=\"none\" id=\"svg_5\" stroke=\"#000000\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"5\" transform=\"matrix(1.74654 0 0 1.92345 768.528 -63.9547)\">\n   <path fill=\"none\" d=\"m129.75,318l0,22m-5,-22l10,0m-10,22l10,0\" id=\"svg_6\" stroke=\"#666666\"/>\n   <path fill=\"none\" d=\"m144.75,320l15,9l-15,9\" id=\"svg_7\" stroke=\"#666666\"/>\n   <path fill=\"none\" d=\"m309.25,318l0,22m-5,-22l10,0m-10,22l10,0\" id=\"svg_8\" stroke=\"#666666\"/>\n   <path fill=\"none\" d=\"m324.75,320l15,9l-15,9\" id=\"svg_9\" stroke=\"#666666\"/>\n  </g>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"1004.75\" x2=\"1004.75\" y1=\"618.87\" y2=\"715.04\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"1298.25\" x2=\"1298.25\" y1=\"618.87\" y2=\"715.04\"/>\n  <rect fill=\"none\" height=\"50\" id=\"svg_mech_box\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.74654 0 0 1.92345 -362.657 -432.012)\" width=\"50\" x=\"687.42\" y=\"333.35\"/>\n  <line fill=\"none\" id=\"svg_mech_cross_v\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\" x1=\"712.42\" x2=\"712.42\" y1=\"333.35\" y2=\"383.35\"/>\n  <line fill=\"none\" id=\"svg_mech_cross_h\" stroke=\"#666666\" stroke-width=\"10\" x1=\"837.96\" x2=\"925.28\" y1=\"257.26\" y2=\"257.26\"/>\n  <line fill=\"none\" id=\"svg_latch_v\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\" x1=\"675.42\" x2=\"675.42\" y1=\"348.35\" y2=\"368.35\"/>\n  <line fill=\"none\" id=\"svg_latch_h\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"817\" x2=\"837.96\" y1=\"257.26\" y2=\"257.26\"/>\n  <line fill=\"none\" id=\"svg_dash_top\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"907.28\" x2=\"1276.68\" y1=\"257.26\" y2=\"257.26\"/>\n  <line fill=\"none\" id=\"svg_dash_vert\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"881.62\" x2=\"881.62\" y1=\"305.35\" y2=\"567.9\"/>\n  <line fill=\"none\" id=\"svg_dash_mid\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"881.62\" x2=\"961.09\" y1=\"464.99\" y2=\"464.99\"/>\n  <line fill=\"none\" id=\"svg_dash_bot\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"881.62\" x2=\"961.09\" y1=\"567.9\" y2=\"567.9\"/>\n </g>"},"protection_motor_circuit_breaker_2p.svg":{"vb":"657.88 -58.43 863.15 920.69","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems -->\n  <!-- Circuit Breaker 'X' Symbols -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Connectors from Flapper to Protection Box -->\n  <!-- Protection Main Box (Thermal/Magnetic) -->\n  <!-- Thermal Overload Pulses -->\n  <!-- Magnetic Overcurrent Vectors (I>) -->\n  <!-- Bottom Stems -->\n  <!-- Mechanism Actuator Box -->\n  <!-- Left Latch (Manual Handle Indicator) -->\n  <!-- Dashed Mechanical Linkages -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-Q6\" Label Rotated -90deg -->\n  <path d=\"m774.17,260.47l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.74654 0 0 1.92345 -362.658 -432.012)\"/>\n  <path d=\"m774.17,601.96l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.74654 0 0 1.92345 -362.658 -432.012)\"/>\n  <path d=\"m1284.97,68.98l4.09,-7.81l7.09,-4.51l8.19,0.0l7.09,4.51l4.09,7.81l0.0,9.02l-4.09,7.81l-7.09,4.51l-8.19,0.0l-7.09,-4.51l-4.09,-7.81l0.0,-9.02z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m942.22,601.96l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.74654 0 0 1.92345 -362.658 -432.012)\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"1004.75\" x2=\"1004.75\" y1=\"80.3\" y2=\"209.18\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"1300.25\" x2=\"1300.25\" y1=\"80.3\" y2=\"209.18\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\" x1=\"771.62\" x2=\"794.22\" y1=\"310.05\" y2=\"332.65\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\" x1=\"771.62\" x2=\"794.22\" y1=\"332.65\" y2=\"310.05\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\" x1=\"940.82\" x2=\"963.42\" y1=\"310.05\" y2=\"332.65\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1.74654 0 0 1.92345 -362.658 -432.012)\" x1=\"940.82\" x2=\"963.42\" y1=\"332.65\" y2=\"310.05\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"1004.75\" x2=\"957.59\" y1=\"363.05\" y2=\"209.18\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"1300.25\" x2=\"1253.1\" y1=\"363.05\" y2=\"209.18\"/>\n  <line fill=\"none\" id=\"svg_conn1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"1004.75\" x2=\"1004.75\" y1=\"363.05\" y2=\"413.06\"/>\n  <line fill=\"none\" id=\"svg_conn2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"1300.25\" x2=\"1300.25\" y1=\"363.05\" y2=\"413.06\"/>\n  <rect fill=\"none\" height=\"107\" id=\"svg_prot_box\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.74654 0 0 1.92345 -362.657 -432.012)\" width=\"229.5\" x=\"757.92\" y=\"439.35\"/>\n  <line fill=\"none\" id=\"svg_prot_divider\" stroke=\"#666666\" stroke-width=\"10\" x1=\"961.09\" x2=\"1361.92\" y1=\"516.93\" y2=\"516.93\"/>\n  <path d=\"m782.92,454.35l25,0l0,30l-25,0l0,9\" fill=\"none\" id=\"svg_thermal1\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"8\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\"/>\n  <path d=\"m962.42,454.35l25,0l0,30l-25,0l0,9\" fill=\"none\" id=\"svg_thermal2\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"8\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\"/>\n  <g fill=\"none\" id=\"svg_5\" stroke=\"#000000\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"5\" transform=\"matrix(1.74654 0 0 1.92345 768.528 -63.9547)\">\n   <path fill=\"none\" d=\"m129.75,318l0,22m-5,-22l10,0m-10,22l10,0\" id=\"svg_6\" stroke=\"#666666\"/>\n   <path fill=\"none\" d=\"m144.75,320l15,9l-15,9\" id=\"svg_7\" stroke=\"#666666\"/>\n   <path fill=\"none\" d=\"m309.25,318l0,22m-5,-22l10,0m-10,22l10,0\" id=\"svg_8\" stroke=\"#666666\"/>\n   <path fill=\"none\" d=\"m324.75,320l15,9l-15,9\" id=\"svg_9\" stroke=\"#666666\"/>\n  </g>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"1004.75\" x2=\"1004.75\" y1=\"618.87\" y2=\"715.04\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"1298.25\" x2=\"1298.25\" y1=\"618.87\" y2=\"715.04\"/>\n  <rect fill=\"none\" height=\"50\" id=\"svg_mech_box\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.74654 0 0 1.92345 -362.657 -432.012)\" width=\"50\" x=\"687.42\" y=\"333.35\"/>\n  <line fill=\"none\" id=\"svg_mech_cross_v\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\" x1=\"712.42\" x2=\"712.42\" y1=\"333.35\" y2=\"383.35\"/>\n  <line fill=\"none\" id=\"svg_mech_cross_h\" stroke=\"#666666\" stroke-width=\"10\" x1=\"837.96\" x2=\"925.28\" y1=\"257.26\" y2=\"257.26\"/>\n  <line fill=\"none\" id=\"svg_latch_v\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\" x1=\"675.42\" x2=\"675.42\" y1=\"348.35\" y2=\"368.35\"/>\n  <line fill=\"none\" id=\"svg_latch_h\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"817\" x2=\"837.96\" y1=\"257.26\" y2=\"257.26\"/>\n  <line fill=\"none\" id=\"svg_dash_top\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"907.28\" x2=\"1276.68\" y1=\"257.26\" y2=\"257.26\"/>\n  <line fill=\"none\" id=\"svg_dash_vert\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"881.62\" x2=\"881.62\" y1=\"305.35\" y2=\"567.9\"/>\n  <line fill=\"none\" id=\"svg_dash_mid\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"881.62\" x2=\"961.09\" y1=\"464.99\" y2=\"464.99\"/>\n  <line fill=\"none\" id=\"svg_dash_bot\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"881.62\" x2=\"961.09\" y1=\"567.9\" y2=\"567.9\"/>\n </g>"},"protection_motor_circuit_breaker_3p(1).svg":{"vb":"200.31 95.75 435.0 464.0","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems -->\n  <!-- Circuit Breaker 'X' Symbols -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Connectors from Flapper to Protection Box -->\n  <!-- Protection Main Box (Thermal/Magnetic) -->\n  <!-- Thermal Overload Pulses -->\n  <!-- Magnetic Overcurrent Vectors (I>) -->\n  <!-- Bottom Stems -->\n  <!-- Mechanism Actuator Box -->\n  <!-- Left Latch (Manual Handle Indicator) -->\n  <!-- Dashed Mechanical Linkages -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-Q5\" Label Rotated -90deg -->\n  <path d=\"m332.83,179.41l2.0,-3.43l3.46,-1.98l4.0,0.0l3.46,1.98l2.0,3.43l0.0,3.96l-2.0,3.43l-3.46,1.98l-4.0,0.0l-3.46,-1.98l-2.0,-3.43l0.0,-3.96z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m331.82,471.58l2.0,-3.43l3.46,-1.99l4.0,0.0l3.46,1.99l2.0,3.43l0.0,3.96l-2.0,3.43l-3.46,1.99l-4.0,0.0l-3.46,-1.99l-2.0,-3.43l0.0,-3.96z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m432.74,180.96l2.0,-3.43l3.46,-1.98l4.0,0.0l3.46,1.98l2.0,3.43l0.0,3.96l-2.0,3.43l-3.46,1.98l-4.0,0.0l-3.46,-1.98l-2.0,-3.43l0.0,-3.96z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m431.73,472.58l2.0,-3.43l3.46,-1.99l4.0,0.0l3.46,1.99l2.0,3.43l0.0,3.96l-2.0,3.43l-3.46,1.99l-4.0,0.0l-3.46,-1.99l-2.0,-3.43l0.0,-3.96z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m531.65,178.96l2.0,-3.43l3.46,-1.98l4.0,0.0l3.46,1.98l2.0,3.43l0.0,3.96l-2.0,3.43l-3.46,1.98l-4.0,0.0l-3.46,-1.98l-2.0,-3.43l0.0,-3.96z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m531.64,470.58l2.0,-3.43l3.46,-1.99l4.0,0.0l3.46,1.99l2.0,3.43l0.0,3.96l-2.0,3.43l-3.46,1.99l-4.0,0.0l-3.46,-1.99l-2.0,-3.43l0.0,-3.96z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"340.28\" x2=\"340.28\" y1=\"178.4\" y2=\"235.03\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"440.19\" x2=\"440.19\" y1=\"180.94\" y2=\"237.57\"/>\n  <line fill=\"none\" id=\"svg_stem_top3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"539.1\" x2=\"539.1\" y1=\"176.95\" y2=\"233.58\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"330.65\" x2=\"349.9\" y1=\"221.32\" y2=\"240.42\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"330.65\" x2=\"349.9\" y1=\"240.42\" y2=\"221.32\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"430.56\" x2=\"449.82\" y1=\"222.87\" y2=\"241.97\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"430.56\" x2=\"449.82\" y1=\"241.97\" y2=\"222.87\"/>\n  <line fill=\"none\" id=\"svg_cb_x3_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"529.47\" x2=\"548.73\" y1=\"220.87\" y2=\"239.97\"/>\n  <line fill=\"none\" id=\"svg_cb_x3_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"529.47\" x2=\"548.73\" y1=\"239.97\" y2=\"220.87\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"340.28\" x2=\"317.28\" y1=\"313.17\" y2=\"245.56\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"440.19\" x2=\"417.19\" y1=\"310.17\" y2=\"242.56\"/>\n  <line fill=\"none\" id=\"svg_flapper3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"539.1\" x2=\"516.1\" y1=\"308.17\" y2=\"240.56\"/>\n  <line fill=\"none\" id=\"svg_conn1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"340.28\" x2=\"340.28\" y1=\"313.17\" y2=\"335.15\"/>\n  <line fill=\"none\" id=\"svg_conn2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"440.19\" x2=\"440.19\" y1=\"309.17\" y2=\"331.15\"/>\n  <line fill=\"none\" id=\"svg_conn3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"539.1\" x2=\"539.1\" y1=\"308.17\" y2=\"330.15\"/>\n  <rect fill=\"none\" height=\"107\" id=\"svg_prot_box\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.851875 0 0 0.845193 63.7272 78.0583)\" width=\"340\" x=\"275.66\" y=\"303\"/>\n  <line fill=\"none\" id=\"svg_prot_divider\" stroke=\"#666666\" stroke-width=\"8\" x1=\"298.98\" x2=\"589.89\" y1=\"379.79\" y2=\"378.9\"/>\n  <path d=\"m320.28,346.83l21.3,0l0,25.36l-21.3,0l0,7.61\" fill=\"none\" id=\"svg_thermal1\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"8\"/>\n  <path d=\"m427.82,347.55l21.3,0l0,25.36l-21.3,0l0,7.61\" fill=\"none\" id=\"svg_thermal2\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"8\"/>\n  <path d=\"m527.82,346.83l21.3,0l0,25.36l-21.3,0l0,7.61\" fill=\"none\" id=\"svg_thermal3\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"8\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"339.27\" x2=\"339.27\" y1=\"424.58\" y2=\"466.84\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"439.19\" x2=\"439.19\" y1=\"425.58\" y2=\"467.84\"/>\n  <line fill=\"none\" id=\"svg_stem_bot3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"539.1\" x2=\"539.1\" y1=\"427.58\" y2=\"469.84\"/>\n  <rect fill=\"none\" height=\"50\" id=\"svg_mech_box\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.920181 0 0 0.997024 8.09184 1.5036) matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" width=\"50\" x=\"225.66\" y=\"197\"/>\n  <line fill=\"none\" id=\"svg_mech_cross_v\" stroke=\"#666666\" stroke-width=\"8\" x1=\"277.26\" x2=\"277.26\" y1=\"244.56\" y2=\"286.82\"/>\n  <line fill=\"none\" id=\"svg_mech_cross_h\" stroke=\"#666666\" stroke-width=\"10\" x1=\"255.96\" x2=\"298.55\" y1=\"265.69\" y2=\"265.69\"/>\n  <line fill=\"none\" id=\"svg_latch_v\" stroke=\"#666666\" stroke-width=\"10\" x1=\"245.74\" x2=\"245.74\" y1=\"257.24\" y2=\"274.14\"/>\n  <line fill=\"none\" id=\"svg_latch_h\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"8\" x1=\"245.74\" x2=\"255.96\" y1=\"265.69\" y2=\"265.69\"/>\n  <line fill=\"none\" id=\"svg_dash_top\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"318.56\" x2=\"528.82\" y1=\"266.55\" y2=\"266.69\"/>\n  <line fill=\"none\" id=\"svg_dash_vert\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"8\" x1=\"277.26\" x2=\"277.26\" y1=\"286.82\" y2=\"402.19\"/>\n  <line fill=\"none\" id=\"svg_dash_mid\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"8\" x1=\"277.26\" x2=\"298.98\" y1=\"356.97\" y2=\"356.97\"/>\n  <line fill=\"none\" id=\"svg_dash_bot\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"8\" x1=\"277.26\" x2=\"298.98\" y1=\"402.19\" y2=\"402.19\"/>\n  <g id=\"svg_8\" transform=\"matrix(1 0 0 1 -110.182 -8.45455)\">\n   <path d=\"m429.35,401.77l0,16.37m-2.92,-16.37l5.84,0m-5.84,16.37l5.84,0\" fill=\"none\" id=\"svg_9\" stroke=\"#666666\" stroke-width=\"4\"/>\n   <path d=\"m444.22,402.9l10.43,7.61l-10.43,7.61\" fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"4\"/>\n   <path d=\"m539.7,402.88l0,16.93m-3.48,-16.93l6.95,0m-6.95,16.93l6.95,0\" fill=\"none\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"4\"/>\n   <path d=\"m269.11,320l15,9l-15,9\" fill=\"none\" id=\"svg_12\" stroke=\"#666666\" stroke-width=\"4\" transform=\"matrix(0.695244 0 0 0.845193 365.252 132.996)\"/>\n   <path d=\"m391.26,314.65l0,22m-5,-22l10,0m-10,22l10,0\" fill=\"none\" id=\"svg_13\" stroke=\"#666666\" stroke-width=\"4\" transform=\"matrix(0.695244 0 0 0.803833 365.252 145.966)\"/>\n   <path d=\"m648.26,401.79l10.43,7.61l-10.43,7.61\" fill=\"none\" id=\"svg_14\" stroke=\"#666666\" stroke-width=\"4\"/>\n  </g>\n </g>"},"protection_motor_circuit_breaker_3p.svg":{"vb":"200.31 95.75 435.0 464.0","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems -->\n  <!-- Circuit Breaker 'X' Symbols -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Connectors from Flapper to Protection Box -->\n  <!-- Protection Main Box (Thermal/Magnetic) -->\n  <!-- Thermal Overload Pulses -->\n  <!-- Magnetic Overcurrent Vectors (I>) -->\n  <!-- Bottom Stems -->\n  <!-- Mechanism Actuator Box -->\n  <!-- Left Latch (Manual Handle Indicator) -->\n  <!-- Dashed Mechanical Linkages -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-Q5\" Label Rotated -90deg -->\n  <path d=\"m332.83,179.41l2.0,-3.43l3.46,-1.98l4.0,0.0l3.46,1.98l2.0,3.43l0.0,3.96l-2.0,3.43l-3.46,1.98l-4.0,0.0l-3.46,-1.98l-2.0,-3.43l0.0,-3.96z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m331.82,471.58l2.0,-3.43l3.46,-1.99l4.0,0.0l3.46,1.99l2.0,3.43l0.0,3.96l-2.0,3.43l-3.46,1.99l-4.0,0.0l-3.46,-1.99l-2.0,-3.43l0.0,-3.96z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m432.74,180.96l2.0,-3.43l3.46,-1.98l4.0,0.0l3.46,1.98l2.0,3.43l0.0,3.96l-2.0,3.43l-3.46,1.98l-4.0,0.0l-3.46,-1.98l-2.0,-3.43l0.0,-3.96z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m431.73,472.58l2.0,-3.43l3.46,-1.99l4.0,0.0l3.46,1.99l2.0,3.43l0.0,3.96l-2.0,3.43l-3.46,1.99l-4.0,0.0l-3.46,-1.99l-2.0,-3.43l0.0,-3.96z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m531.65,178.96l2.0,-3.43l3.46,-1.98l4.0,0.0l3.46,1.98l2.0,3.43l0.0,3.96l-2.0,3.43l-3.46,1.98l-4.0,0.0l-3.46,-1.98l-2.0,-3.43l0.0,-3.96z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m531.64,470.58l2.0,-3.43l3.46,-1.99l4.0,0.0l3.46,1.99l2.0,3.43l0.0,3.96l-2.0,3.43l-3.46,1.99l-4.0,0.0l-3.46,-1.99l-2.0,-3.43l0.0,-3.96z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"340.28\" x2=\"340.28\" y1=\"178.4\" y2=\"235.03\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"440.19\" x2=\"440.19\" y1=\"180.94\" y2=\"237.57\"/>\n  <line fill=\"none\" id=\"svg_stem_top3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"539.1\" x2=\"539.1\" y1=\"176.95\" y2=\"233.58\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"330.65\" x2=\"349.9\" y1=\"221.32\" y2=\"240.42\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"330.65\" x2=\"349.9\" y1=\"240.42\" y2=\"221.32\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"430.56\" x2=\"449.82\" y1=\"222.87\" y2=\"241.97\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"430.56\" x2=\"449.82\" y1=\"241.97\" y2=\"222.87\"/>\n  <line fill=\"none\" id=\"svg_cb_x3_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"529.47\" x2=\"548.73\" y1=\"220.87\" y2=\"239.97\"/>\n  <line fill=\"none\" id=\"svg_cb_x3_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"529.47\" x2=\"548.73\" y1=\"239.97\" y2=\"220.87\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"340.28\" x2=\"317.28\" y1=\"313.17\" y2=\"245.56\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"440.19\" x2=\"417.19\" y1=\"310.17\" y2=\"242.56\"/>\n  <line fill=\"none\" id=\"svg_flapper3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"539.1\" x2=\"516.1\" y1=\"308.17\" y2=\"240.56\"/>\n  <line fill=\"none\" id=\"svg_conn1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"340.28\" x2=\"340.28\" y1=\"313.17\" y2=\"335.15\"/>\n  <line fill=\"none\" id=\"svg_conn2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"440.19\" x2=\"440.19\" y1=\"309.17\" y2=\"331.15\"/>\n  <line fill=\"none\" id=\"svg_conn3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"539.1\" x2=\"539.1\" y1=\"308.17\" y2=\"330.15\"/>\n  <rect fill=\"none\" height=\"107\" id=\"svg_prot_box\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.851875 0 0 0.845193 63.7272 78.0583)\" width=\"340\" x=\"275.66\" y=\"303\"/>\n  <line fill=\"none\" id=\"svg_prot_divider\" stroke=\"#666666\" stroke-width=\"8\" x1=\"298.98\" x2=\"589.89\" y1=\"379.79\" y2=\"378.9\"/>\n  <path d=\"m320.28,346.83l21.3,0l0,25.36l-21.3,0l0,7.61\" fill=\"none\" id=\"svg_thermal1\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"8\"/>\n  <path d=\"m427.82,347.55l21.3,0l0,25.36l-21.3,0l0,7.61\" fill=\"none\" id=\"svg_thermal2\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"8\"/>\n  <path d=\"m527.82,346.83l21.3,0l0,25.36l-21.3,0l0,7.61\" fill=\"none\" id=\"svg_thermal3\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"8\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"339.27\" x2=\"339.27\" y1=\"424.58\" y2=\"466.84\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"439.19\" x2=\"439.19\" y1=\"425.58\" y2=\"467.84\"/>\n  <line fill=\"none\" id=\"svg_stem_bot3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"539.1\" x2=\"539.1\" y1=\"427.58\" y2=\"469.84\"/>\n  <rect fill=\"none\" height=\"50\" id=\"svg_mech_box\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.920181 0 0 0.997024 8.09184 1.5036) matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" width=\"50\" x=\"225.66\" y=\"197\"/>\n  <line fill=\"none\" id=\"svg_mech_cross_v\" stroke=\"#666666\" stroke-width=\"8\" x1=\"277.26\" x2=\"277.26\" y1=\"244.56\" y2=\"286.82\"/>\n  <line fill=\"none\" id=\"svg_mech_cross_h\" stroke=\"#666666\" stroke-width=\"10\" x1=\"255.96\" x2=\"298.55\" y1=\"265.69\" y2=\"265.69\"/>\n  <line fill=\"none\" id=\"svg_latch_v\" stroke=\"#666666\" stroke-width=\"10\" x1=\"245.74\" x2=\"245.74\" y1=\"257.24\" y2=\"274.14\"/>\n  <line fill=\"none\" id=\"svg_latch_h\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"8\" x1=\"245.74\" x2=\"255.96\" y1=\"265.69\" y2=\"265.69\"/>\n  <line fill=\"none\" id=\"svg_dash_top\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"318.56\" x2=\"528.82\" y1=\"266.55\" y2=\"266.69\"/>\n  <line fill=\"none\" id=\"svg_dash_vert\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"8\" x1=\"277.26\" x2=\"277.26\" y1=\"286.82\" y2=\"402.19\"/>\n  <line fill=\"none\" id=\"svg_dash_mid\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"8\" x1=\"277.26\" x2=\"298.98\" y1=\"356.97\" y2=\"356.97\"/>\n  <line fill=\"none\" id=\"svg_dash_bot\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"8\" x1=\"277.26\" x2=\"298.98\" y1=\"402.19\" y2=\"402.19\"/>\n  <g id=\"svg_8\" transform=\"matrix(1 0 0 1 -110.182 -8.45455)\">\n   <path d=\"m429.35,401.77l0,16.37m-2.92,-16.37l5.84,0m-5.84,16.37l5.84,0\" fill=\"none\" id=\"svg_9\" stroke=\"#666666\" stroke-width=\"4\"/>\n   <path d=\"m444.22,402.9l10.43,7.61l-10.43,7.61\" fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"4\"/>\n   <path d=\"m539.7,402.88l0,16.93m-3.48,-16.93l6.95,0m-6.95,16.93l6.95,0\" fill=\"none\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"4\"/>\n   <path d=\"m269.11,320l15,9l-15,9\" fill=\"none\" id=\"svg_12\" stroke=\"#666666\" stroke-width=\"4\" transform=\"matrix(0.695244 0 0 0.845193 365.252 132.996)\"/>\n   <path d=\"m391.26,314.65l0,22m-5,-22l10,0m-10,22l10,0\" fill=\"none\" id=\"svg_13\" stroke=\"#666666\" stroke-width=\"4\" transform=\"matrix(0.695244 0 0 0.803833 365.252 145.966)\"/>\n   <path d=\"m648.26,401.79l10.43,7.61l-10.43,7.61\" fill=\"none\" id=\"svg_14\" stroke=\"#666666\" stroke-width=\"4\"/>\n  </g>\n </g>"},"protection_thermal_overload_relay_2p(1).svg":{"vb":"344.19 49.71 447.99 464.0","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Main Enclosure Box -->\n  <!-- Continuous Thermal Overload Stems (Pole 1 & Pole 2) -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-F5\" Label Rotated -90deg -->\n  <path d=\"m431.69,114.33l2.87,-3.92l4.96,-2.27l5.73,0.0l4.96,2.27l2.87,3.92l0.0,4.54l-2.87,3.92l-4.96,2.27l-5.73,0.0l-4.96,-2.27l-2.87,-3.92l0.0,-4.54z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m432.5,444.55l2.35,-3.92l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.92l0.0,4.54l-2.35,3.92l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.92l0.0,-4.54z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.22141 0 0 1 -96.5665 0)\"/>\n  <path d=\"m650.94,114.33l2.87,-3.92l4.96,-2.27l5.73,0.0l4.96,2.27l2.87,3.92l0.0,4.54l-2.87,3.92l-4.96,2.27l-5.73,0.0l-4.96,-2.27l-2.87,-3.92l0.0,-4.54z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m612.0,444.55l2.35,-3.92l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.92l0.0,4.54l-2.35,3.92l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.92l0.0,-4.54z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.22141 0 0 1 -96.5665 0)\"/>\n  <rect fill=\"none\" height=\"100\" id=\"svg_prot_box\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.22141 0 0 0.967005 -96.5665 15.7785)\" width=\"306\" x=\"391.25\" y=\"222.8\"/>\n  <path d=\"m441.25,120.02l0,135.38l30,0l0,48.35l-30,0l0,135.38\" fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.22141 0 0 1 -96.5665 0)\"/>\n  <path d=\"m620.75,120.02l0,135.38l30,0l0,48.35l-30,0l0,135.38\" fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.22141 0 0 1 -96.5665 0)\"/>\n </g>"},"protection_thermal_overload_relay_2p.svg":{"vb":"344.19 49.71 447.99 464.0","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Main Enclosure Box -->\n  <!-- Continuous Thermal Overload Stems (Pole 1 & Pole 2) -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-F5\" Label Rotated -90deg -->\n  <path d=\"m431.69,114.33l2.87,-3.92l4.96,-2.27l5.73,0.0l4.96,2.27l2.87,3.92l0.0,4.54l-2.87,3.92l-4.96,2.27l-5.73,0.0l-4.96,-2.27l-2.87,-3.92l0.0,-4.54z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m432.5,444.55l2.35,-3.92l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.92l0.0,4.54l-2.35,3.92l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.92l0.0,-4.54z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.22141 0 0 1 -96.5665 0)\"/>\n  <path d=\"m650.94,114.33l2.87,-3.92l4.96,-2.27l5.73,0.0l4.96,2.27l2.87,3.92l0.0,4.54l-2.87,3.92l-4.96,2.27l-5.73,0.0l-4.96,-2.27l-2.87,-3.92l0.0,-4.54z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m612.0,444.55l2.35,-3.92l4.06,-2.27l4.69,0.0l4.06,2.27l2.35,3.92l0.0,4.54l-2.35,3.92l-4.06,2.27l-4.69,0.0l-4.06,-2.27l-2.35,-3.92l0.0,-4.54z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.22141 0 0 1 -96.5665 0)\"/>\n  <rect fill=\"none\" height=\"100\" id=\"svg_prot_box\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.22141 0 0 0.967005 -96.5665 15.7785)\" width=\"306\" x=\"391.25\" y=\"222.8\"/>\n  <path d=\"m441.25,120.02l0,135.38l30,0l0,48.35l-30,0l0,135.38\" fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.22141 0 0 1 -96.5665 0)\"/>\n  <path d=\"m620.75,120.02l0,135.38l30,0l0,48.35l-30,0l0,135.38\" fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.22141 0 0 1 -96.5665 0)\"/>\n </g>"},"protection_thermal_overload_relay_3p(1).svg":{"vb":"23.66 1.39 647.68 479.24","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <path d=\"m102.75,68.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m102.75,409.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <!-- Main Enclosure Box -->\n  <rect fill=\"none\" height=\"100\" id=\"svg_prot_box\" stroke=\"#666666\" stroke-width=\"10\" width=\"571\" x=\"62\" y=\"189\"/>\n  <!-- Continuous Thermal Overload Stems (Poles 1, 2, 3) -->\n  <path d=\"m111.5,74l0,140l30,0l0,50l-30,0l0,140\" fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-F3\" Label Rotated -90deg -->\n  <path d=\"m282.25,68.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 40 -0.42)\"/>\n  <path d=\"m282.25,409.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 40 -0.42)\"/>\n  <path d=\"m291,74l0,140l30,0l0,50l-30,0l0,140\" fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 40 -0.42) translate(0 0)\"/>\n  <path d=\"m461.75,68.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 80 0)\"/>\n  <path d=\"m461.75,409.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 80 0)\"/>\n  <path d=\"m470.5,74l0,140l30,0l0,50l-30,0l0,140\" fill=\"none\" id=\"svg_stem3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 80 0)\"/>\n </g>"},"protection_thermal_overload_relay_3p.svg":{"vb":"23.66 1.39 647.68 479.24","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <path d=\"m102.75,68.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m102.75,409.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <!-- Main Enclosure Box -->\n  <rect fill=\"none\" height=\"100\" id=\"svg_prot_box\" stroke=\"#666666\" stroke-width=\"10\" width=\"571\" x=\"62\" y=\"189\"/>\n  <!-- Continuous Thermal Overload Stems (Poles 1, 2, 3) -->\n  <path d=\"m111.5,74l0,140l30,0l0,50l-30,0l0,140\" fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-F3\" Label Rotated -90deg -->\n  <path d=\"m282.25,68.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 40 -0.42)\"/>\n  <path d=\"m282.25,409.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 40 -0.42)\"/>\n  <path d=\"m291,74l0,140l30,0l0,50l-30,0l0,140\" fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 40 -0.42) translate(0 0)\"/>\n  <path d=\"m461.75,68.12l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 80 0)\"/>\n  <path d=\"m461.75,409.62l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1 0 0 1 80 0)\"/>\n  <path d=\"m470.5,74l0,140l30,0l0,50l-30,0l0,140\" fill=\"none\" id=\"svg_stem3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 80 0)\"/>\n </g>"},"motor_dc_motor(2).svg":{"vb":"285.4 12.39 964.53 1028.83","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <title>sunil</title>\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- 2 Vertical Polygon Terminal Nodes (1, 2) -->\n  <!-- Vertical Stems (1, 2) -->\n  <!-- DC Motor Main Circle (Center = 225,285, Radius = 133.04px, Diameter = 266.08px) -->\n  <!-- Inner Motor Marking: M and DC Symbol (solid line + 3 dashes) -->\n  <path d=\"m464.82,224.11l2.66,-4.31l4.61,-2.49l5.33,0.0l4.61,2.49l2.66,4.31l0.0,4.97l-2.66,4.31l-4.61,2.49l-5.33,0.0l-4.61,-2.49l-2.66,-4.31l0.0,-4.97z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.49747 0 0 1.58844 -39.6956 -183.238)\"/>\n  <path d=\"m852.07,173.92l3.98,-6.84l6.9,-3.95l7.97,0.0l6.9,3.95l3.98,6.84l0.0,7.91l-3.98,6.84l-6.9,3.95l-7.97,0.0l-6.9,-3.95l-3.98,-6.84l0.0,-7.91z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <circle cx=\"486.93\" cy=\"485.15\" fill=\"none\" id=\"svg_motor_circle\" r=\"192\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.70008 0 0 1.68572 -60.1506 -228.868)\"/>\n  <line fill=\"none\" id=\"svg_t1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.49747 0 0 1.58844 -39.6956 -183.238)\" x1=\"474.25\" x2=\"474.25\" y1=\"204.12\" y2=\"288.8\"/>\n  <line fill=\"none\" id=\"svg_t2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.49747 0 0 1.58844 -39.6956 -183.238)\" x1=\"603.96\" x2=\"603.96\" y1=\"207.83\" y2=\"290.57\"/>\n  <path d=\"m500.44,437.45l0,-61.12l12.91,0l18.27,52.93l18.09,-52.93l12.91,0l0,61.12l-8.61,0l0,-51.08l-18.1,51.08l-8.76,0l-18.1,-51.08l0,51.08l-8.61,0z\" fill=\"#666666\" id=\"svg_m\" stroke-width=\"10\" transform=\"matrix(1.49747 0 0 1.58844 -39.6956 -183.238)\"/>\n  <line fill=\"none\" id=\"svg_dc_solid\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.49747 0 0 1.58844 -39.6956 -183.238)\" x1=\"483.79\" x2=\"579.25\" y1=\"480.07\" y2=\"480.07\"/>\n  <line fill=\"none\" id=\"svg_dc_dash1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.26272 0 0 1.33304 -23.6819 -100.36) matrix(1.18591 0 0 1.19159 -12.6819 -62.1724)\" x1=\"483.79\" x2=\"505.17\" y1=\"514.7\" y2=\"514.7\"/>\n  <line fill=\"none\" id=\"svg_dc_dash2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.49747 0 0 1.58844 -39.6956 -183.238)\" x1=\"520.84\" x2=\"542.2\" y1=\"514.7\" y2=\"514.7\"/>\n  <line fill=\"none\" id=\"svg_dc_dash3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.26272 0 0 1.33304 -23.6819 -100.36) matrix(1.18591 0 0 1.19159 -12.6819 -62.1724)\" x1=\"557.87\" x2=\"579.25\" y1=\"514.7\" y2=\"514.7\"/>\n </g>"},"motor_dc_motor.svg":{"vb":"285.4 12.39 964.53 1028.83","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <title>sunil</title>\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- 2 Vertical Polygon Terminal Nodes (1, 2) -->\n  <!-- Vertical Stems (1, 2) -->\n  <!-- DC Motor Main Circle (Center = 225,285, Radius = 133.04px, Diameter = 266.08px) -->\n  <!-- Inner Motor Marking: M and DC Symbol (solid line + 3 dashes) -->\n  <path d=\"m464.82,224.11l2.66,-4.31l4.61,-2.49l5.33,0.0l4.61,2.49l2.66,4.31l0.0,4.97l-2.66,4.31l-4.61,2.49l-5.33,0.0l-4.61,-2.49l-2.66,-4.31l0.0,-4.97z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.49747 0 0 1.58844 -39.6956 -183.238)\"/>\n  <path d=\"m852.07,173.92l3.98,-6.84l6.9,-3.95l7.97,0.0l6.9,3.95l3.98,6.84l0.0,7.91l-3.98,6.84l-6.9,3.95l-7.97,0.0l-6.9,-3.95l-3.98,-6.84l0.0,-7.91z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <circle cx=\"486.93\" cy=\"485.15\" fill=\"none\" id=\"svg_motor_circle\" r=\"192\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.70008 0 0 1.68572 -60.1506 -228.868)\"/>\n  <line fill=\"none\" id=\"svg_t1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.49747 0 0 1.58844 -39.6956 -183.238)\" x1=\"474.25\" x2=\"474.25\" y1=\"204.12\" y2=\"288.8\"/>\n  <line fill=\"none\" id=\"svg_t2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.49747 0 0 1.58844 -39.6956 -183.238)\" x1=\"603.96\" x2=\"603.96\" y1=\"207.83\" y2=\"290.57\"/>\n  <path d=\"m500.44,437.45l0,-61.12l12.91,0l18.27,52.93l18.09,-52.93l12.91,0l0,61.12l-8.61,0l0,-51.08l-18.1,51.08l-8.76,0l-18.1,-51.08l0,51.08l-8.61,0z\" fill=\"#666666\" id=\"svg_m\" stroke-width=\"10\" transform=\"matrix(1.49747 0 0 1.58844 -39.6956 -183.238)\"/>\n  <line fill=\"none\" id=\"svg_dc_solid\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.49747 0 0 1.58844 -39.6956 -183.238)\" x1=\"483.79\" x2=\"579.25\" y1=\"480.07\" y2=\"480.07\"/>\n  <line fill=\"none\" id=\"svg_dc_dash1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.26272 0 0 1.33304 -23.6819 -100.36) matrix(1.18591 0 0 1.19159 -12.6819 -62.1724)\" x1=\"483.79\" x2=\"505.17\" y1=\"514.7\" y2=\"514.7\"/>\n  <line fill=\"none\" id=\"svg_dc_dash2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.49747 0 0 1.58844 -39.6956 -183.238)\" x1=\"520.84\" x2=\"542.2\" y1=\"514.7\" y2=\"514.7\"/>\n  <line fill=\"none\" id=\"svg_dc_dash3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.26272 0 0 1.33304 -23.6819 -100.36) matrix(1.18591 0 0 1.19159 -12.6819 -62.1724)\" x1=\"557.87\" x2=\"579.25\" y1=\"514.7\" y2=\"514.7\"/>\n </g>"},"motor_single_phase(2).svg":{"vb":"353.75 -29.02 928.53 990.43","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <title>sunil</title>\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- 3 Polygon Terminal Nodes (1, 2, PE) -->\n  <!-- Top Stems (1, 2) -->\n  <!-- PE Stem, Horizontal Lead, and Concentric Curved Arc -->\n  <!-- Motor Main Circle (Center = 195,260, Radius = 133.04px, Diameter = 266.08px) -->\n  <!-- Inner Motor Marking: M1 ~ -->\n  <circle cx=\"195\" cy=\"260\" fill=\"none\" id=\"svg_motor_circle\" r=\"192\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.5868 0 0 1.73333 461.162 54.135)\"/>\n  <path d=\"m127.3,29.86l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.5868 0 0 1.73333 461.162 54.135)\"/>\n  <path d=\"m247.3,29.86l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.5868 0 0 1.73333 461.162 54.135)\"/>\n  <path d=\"m429.27,35.63l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.5868 0 0 1.73333 461.162 54.135)\"/>\n  <line fill=\"none\" id=\"svg_t1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.5868 0 0 1.73333 461.162 54.135)\" x1=\"136.05\" x2=\"136.05\" y1=\"23.46\" y2=\"79.72\"/>\n  <line fill=\"none\" id=\"svg_t2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.5868 0 0 1.73333 461.162 54.135)\" x1=\"256.05\" x2=\"256.05\" y1=\"23.46\" y2=\"79.72\"/>\n  <path d=\"m438.02,76.35l0,175l-18.26,0\" fill=\"none\" id=\"svg_pe_stem\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.5868 0 0 2.06211 461.162 -29.7342)\"/>\n  <path d=\"m412.79,204.39a161.74,161.74 0 0 1 0,93.92\" fill=\"none\" id=\"svg_pe_arc\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1.5868 0 0 1.89735 461.162 4.57533)\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"76\" font-weight=\"normal\" id=\"svg_m1\" stroke-width=\"10\" text-anchor=\"middle\" transform=\"matrix(1.5868 0 0 1.73333 461.162 54.135)\" x=\"196.31\" y=\"285.92\">M1</text>\n  <path d=\"m257.36,259.23c8,-14 16,-14 23.5,0c7.5,14 15.5,14 23.5,0\" fill=\"none\" id=\"svg_ac_tilde\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"6.5\" transform=\"matrix(1.5868 0 0 1.73333 461.162 54.135)\"/>\n </g>"},"motor_single_phase.svg":{"vb":"353.75 -29.02 928.53 990.43","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <title>sunil</title>\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- 3 Polygon Terminal Nodes (1, 2, PE) -->\n  <!-- Top Stems (1, 2) -->\n  <!-- PE Stem, Horizontal Lead, and Concentric Curved Arc -->\n  <!-- Motor Main Circle (Center = 195,260, Radius = 133.04px, Diameter = 266.08px) -->\n  <!-- Inner Motor Marking: M1 ~ -->\n  <circle cx=\"195\" cy=\"260\" fill=\"none\" id=\"svg_motor_circle\" r=\"192\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.5868 0 0 1.73333 461.162 54.135)\"/>\n  <path d=\"m127.3,29.86l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.5868 0 0 1.73333 461.162 54.135)\"/>\n  <path d=\"m247.3,29.86l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.5868 0 0 1.73333 461.162 54.135)\"/>\n  <path d=\"m429.27,35.63l2.35,-4.06l4.06,-2.35l4.69,0.0l4.06,2.35l2.35,4.06l0.0,4.69l-2.35,4.06l-4.06,2.35l-4.69,0.0l-4.06,-2.35l-2.35,-4.06l0.0,-4.69z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\" transform=\"matrix(1.5868 0 0 1.73333 461.162 54.135)\"/>\n  <line fill=\"none\" id=\"svg_t1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.5868 0 0 1.73333 461.162 54.135)\" x1=\"136.05\" x2=\"136.05\" y1=\"23.46\" y2=\"79.72\"/>\n  <line fill=\"none\" id=\"svg_t2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.5868 0 0 1.73333 461.162 54.135)\" x1=\"256.05\" x2=\"256.05\" y1=\"23.46\" y2=\"79.72\"/>\n  <path d=\"m438.02,76.35l0,175l-18.26,0\" fill=\"none\" id=\"svg_pe_stem\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.5868 0 0 2.06211 461.162 -29.7342)\"/>\n  <path d=\"m412.79,204.39a161.74,161.74 0 0 1 0,93.92\" fill=\"none\" id=\"svg_pe_arc\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1.5868 0 0 1.89735 461.162 4.57533)\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"76\" font-weight=\"normal\" id=\"svg_m1\" stroke-width=\"10\" text-anchor=\"middle\" transform=\"matrix(1.5868 0 0 1.73333 461.162 54.135)\" x=\"196.31\" y=\"285.92\">M1</text>\n  <path d=\"m257.36,259.23c8,-14 16,-14 23.5,0c7.5,14 15.5,14 23.5,0\" fill=\"none\" id=\"svg_ac_tilde\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"6.5\" transform=\"matrix(1.5868 0 0 1.73333 461.162 54.135)\"/>\n </g>"},"motor_three_phase(2).svg":{"vb":"264.27 265.91 980.47 963.07","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <title>sunil</title>\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- 3 Polygon Terminal Nodes (U, V, W) -->\n  <!-- Top Stems (U, V, W) -->\n  <!-- Motor Main Circle (Center = 225,255, Radius = 139.5px, Diameter = 279px) -->\n  <!-- Inner Motor Marking: M3 ~ -->\n  <circle cx=\"427.51\" cy=\"613.74\" fill=\"none\" id=\"svg_motor_circle\" r=\"192\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.71574 0 0 1.68628 -62.7552 -250.102)\"/>\n  <path d=\"m468.19,397.11l4.03,-6.85l6.96,-3.96l8.05,0.0l6.96,3.96l4.03,6.85l0.0,7.91l-4.03,6.85l-6.96,3.96l-8.05,0.0l-6.96,-3.96l-4.03,-6.85l0.0,-7.91z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m655.75,398.78l4.03,-6.85l6.96,-3.96l8.05,0.0l6.96,3.96l4.03,6.85l0.0,7.91l-4.03,6.85l-6.96,3.96l-8.05,0.0l-6.96,-3.96l-4.03,-6.85l0.0,-7.91z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m848.29,400.44l4.03,-6.85l6.96,-3.96l8.05,0.0l6.96,3.96l4.03,6.85l0.0,7.91l-4.03,6.85l-6.96,3.96l-8.05,0.0l-6.96,-3.96l-4.03,-6.85l0.0,-7.91z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_u\" stroke=\"#666666\" stroke-width=\"10\" x1=\"483.19\" x2=\"483.19\" y1=\"386.31\" y2=\"516.54\"/>\n  <line fill=\"none\" id=\"svg_v\" stroke=\"#666666\" stroke-width=\"10\" x1=\"670.76\" x2=\"670.76\" y1=\"387.98\" y2=\"456.27\"/>\n  <line fill=\"none\" id=\"svg_w\" stroke=\"#666666\" stroke-width=\"10\" x1=\"863.31\" x2=\"863.31\" y1=\"389.64\" y2=\"516.54\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"58\" font-weight=\"bold\" id=\"svg_m3\" text-anchor=\"middle\" transform=\"matrix(1.71574 0 0 1.68628 -62.7552 -250.102)\" x=\"421.54\" y=\"652.53\">M3</text>\n  <path d=\"m763.45,814.84c17.16,-38.78 34.32,-38.78 51.48,0c17.16,38.78 34.32,38.78 51.48,0\" fill=\"none\" id=\"svg_ac_tilde\" stroke=\"#666666\" stroke-width=\"7.5\"/>\n  <path d=\"m1137.68,403.14l4.03,-6.84l6.96,-3.95l8.04,0.0l6.96,3.95l4.03,6.84l0.0,7.91l-4.03,6.84l-6.96,3.95l-8.04,0.0l-6.96,-3.95l-4.03,-6.84l0.0,-7.91z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m801.27,453.2l0,199.76l-84.31,0\" fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.24576 0 0 1.99092 157.042 -485.637)\"/>\n  <path d=\"m709.37,586.6a184.4,231.6 0 0 1 0,131.62\" fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1.53247 0 0 1.51946 -47.2686 -174.046)\"/>\n </g>"},"motor_three_phase.svg":{"vb":"264.27 265.91 980.47 963.07","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <title>sunil</title>\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- 3 Polygon Terminal Nodes (U, V, W) -->\n  <!-- Top Stems (U, V, W) -->\n  <!-- Motor Main Circle (Center = 225,255, Radius = 139.5px, Diameter = 279px) -->\n  <!-- Inner Motor Marking: M3 ~ -->\n  <circle cx=\"427.51\" cy=\"613.74\" fill=\"none\" id=\"svg_motor_circle\" r=\"192\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.71574 0 0 1.68628 -62.7552 -250.102)\"/>\n  <path d=\"m468.19,397.11l4.03,-6.85l6.96,-3.96l8.05,0.0l6.96,3.96l4.03,6.85l0.0,7.91l-4.03,6.85l-6.96,3.96l-8.05,0.0l-6.96,-3.96l-4.03,-6.85l0.0,-7.91z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m655.75,398.78l4.03,-6.85l6.96,-3.96l8.05,0.0l6.96,3.96l4.03,6.85l0.0,7.91l-4.03,6.85l-6.96,3.96l-8.05,0.0l-6.96,-3.96l-4.03,-6.85l0.0,-7.91z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m848.29,400.44l4.03,-6.85l6.96,-3.96l8.05,0.0l6.96,3.96l4.03,6.85l0.0,7.91l-4.03,6.85l-6.96,3.96l-8.05,0.0l-6.96,-3.96l-4.03,-6.85l0.0,-7.91z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_u\" stroke=\"#666666\" stroke-width=\"10\" x1=\"483.19\" x2=\"483.19\" y1=\"386.31\" y2=\"516.54\"/>\n  <line fill=\"none\" id=\"svg_v\" stroke=\"#666666\" stroke-width=\"10\" x1=\"670.76\" x2=\"670.76\" y1=\"387.98\" y2=\"456.27\"/>\n  <line fill=\"none\" id=\"svg_w\" stroke=\"#666666\" stroke-width=\"10\" x1=\"863.31\" x2=\"863.31\" y1=\"389.64\" y2=\"516.54\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"58\" font-weight=\"bold\" id=\"svg_m3\" text-anchor=\"middle\" transform=\"matrix(1.71574 0 0 1.68628 -62.7552 -250.102)\" x=\"421.54\" y=\"652.53\">M3</text>\n  <path d=\"m763.45,814.84c17.16,-38.78 34.32,-38.78 51.48,0c17.16,38.78 34.32,38.78 51.48,0\" fill=\"none\" id=\"svg_ac_tilde\" stroke=\"#666666\" stroke-width=\"7.5\"/>\n  <path d=\"m1137.68,403.14l4.03,-6.84l6.96,-3.95l8.04,0.0l6.96,3.95l4.03,6.84l0.0,7.91l-4.03,6.84l-6.96,3.95l-8.04,0.0l-6.96,-3.95l-4.03,-6.84l0.0,-7.91z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m801.27,453.2l0,199.76l-84.31,0\" fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.24576 0 0 1.99092 157.042 -485.637)\"/>\n  <path d=\"m709.37,586.6a184.4,231.6 0 0 1 0,131.62\" fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1.53247 0 0 1.51946 -47.2686 -174.046)\"/>\n </g>"},"motor_three_phase_star_delta(2).svg":{"vb":"305.04 71.31 883.02 941.89","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <title>sunil</title>\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- 7 Polygon Terminal Nodes (U1, V1, W1, PE at top; W2, U2, V2 at bottom) -->\n  <!-- Top Stems (U1, V1, W1) -->\n  <!-- Bottom Stems (W2, U2, V2) -->\n  <!-- PE Stem, Horizontal Lead, and Concentric Curved Arc -->\n  <!-- Motor Main Circle (Center = 220,240, Radius = 134.1px, Diameter = 268.2px) -->\n  <!-- Inner Motor Markings: M3 ~ and Star/Delta -->\n  <circle cx=\"494.95\" cy=\"346.15\" fill=\"none\" id=\"svg_motor_circle\" r=\"192\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.35026 0 0 1.44836 2.42816 38.393)\"/>\n  <path d=\"m469.38,199.28l3.17,-5.88l5.48,-3.4l6.33,0.0l5.48,3.4l3.17,5.88l0.0,6.79l-3.17,5.88l-5.48,3.4l-6.33,0.0l-5.48,-3.4l-3.17,-5.88l0.0,-6.79z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m660.17,198.32l3.17,-5.88l5.48,-3.4l6.33,0.0l5.48,3.4l3.17,5.88l0.0,6.79l-3.17,5.88l-5.48,3.4l-6.33,0.0l-5.48,-3.4l-3.17,-5.88l0.0,-6.79z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m849.7,199.57l3.17,-5.88l5.48,-3.4l6.33,0.0l5.48,3.4l3.17,5.88l0.0,6.79l-3.17,5.88l-5.48,3.4l-6.33,0.0l-5.48,-3.4l-3.17,-5.88l0.0,-6.79z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m1057.98,210.82l3.17,-5.88l5.48,-3.4l6.33,0.0l5.48,3.4l3.17,5.88l0.0,6.79l-3.17,5.88l-5.48,3.4l-6.33,0.0l-5.48,-3.4l-3.17,-5.88l0.0,-6.79z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m468.13,876.21l3.17,-5.88l5.48,-3.4l6.33,0.0l5.48,3.4l3.17,5.88l0.0,6.79l-3.17,5.88l-5.48,3.4l-6.33,0.0l-5.48,-3.4l-3.17,-5.88l0.0,-6.79z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m661.42,875.63l3.17,-5.88l5.48,-3.4l6.33,0.0l5.48,3.4l3.17,5.88l0.0,6.79l-3.17,5.88l-5.48,3.4l-6.33,0.0l-5.48,-3.4l-3.17,-5.88l0.0,-6.79z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m850.95,874.38l3.17,-5.88l5.48,-3.4l6.33,0.0l5.48,3.4l3.17,5.88l0.0,6.79l-3.17,5.88l-5.48,3.4l-6.33,0.0l-5.48,-3.4l-3.17,-5.88l0.0,-6.79z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_u1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.35026 0 0 1.32378 24.0323 16.2289)\" x1=\"338.58\" x2=\"338.58\" y1=\"132.05\" y2=\"252.19\"/>\n  <line fill=\"none\" id=\"svg_v1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.35026 0 0 1.44836 24.0323 6.52897)\" x1=\"479.87\" x2=\"479.87\" y1=\"126.02\" y2=\"171.92\"/>\n  <line fill=\"none\" id=\"svg_w1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.35026 0 0 1.36271 24.0323 13.1977)\" x1=\"620.24\" x2=\"620.24\" y1=\"129.7\" y2=\"249.84\"/>\n  <line fill=\"none\" id=\"svg_w2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"479.95\" x2=\"479.95\" y1=\"721.45\" y2=\"895.46\"/>\n  <line fill=\"none\" id=\"svg_u2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.35026 0 0 1.55268 24.0323 -57.6893)\" x1=\"480.8\" x2=\"480.8\" y1=\"565.26\" y2=\"611.16\"/>\n  <line fill=\"none\" id=\"svg_v2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.35026 0 0 1.33935 24.0323 55.1643)\" x1=\"621.16\" x2=\"621.16\" y1=\"503.85\" y2=\"623.99\"/>\n  <path d=\"m774.49,193.33l0,180l-75.3,0\" fill=\"none\" id=\"svg_pe_stem\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.35026 0 0 1.77669 24.0323 -117.748)\"/>\n  <path d=\"m955,467.5a222.39,313.33 0 0 1 0,178.07\" fill=\"none\" id=\"svg_pe_arc\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"68\" font-weight=\"bold\" id=\"svg_m3\" stroke-width=\"5\" text-anchor=\"middle\" transform=\"matrix(1.35026 0 0 1.44836 386.064 181.12)\" x=\"189.07\" y=\"261.48\">M3</text>\n  <path d=\"m736.44,524.99c10.8,-23.17 21.6,-23.17 32.41,0c10.8,23.17 21.6,23.17 32.41,0\" fill=\"none\" id=\"svg_ac_tilde\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"25\" font-weight=\"bold\" id=\"svg_stardelta\" stroke-width=\"5\" text-anchor=\"middle\" transform=\"matrix(1.53983 0 0 1.86864 -104.466 -149.305)\" x=\"506.63\" y=\"415.75\">Star/Delta</text>\n </g>"},"motor_three_phase_star_delta.svg":{"vb":"305.04 71.31 883.02 941.89","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <title>sunil</title>\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- 7 Polygon Terminal Nodes (U1, V1, W1, PE at top; W2, U2, V2 at bottom) -->\n  <!-- Top Stems (U1, V1, W1) -->\n  <!-- Bottom Stems (W2, U2, V2) -->\n  <!-- PE Stem, Horizontal Lead, and Concentric Curved Arc -->\n  <!-- Motor Main Circle (Center = 220,240, Radius = 134.1px, Diameter = 268.2px) -->\n  <!-- Inner Motor Markings: M3 ~ and Star/Delta -->\n  <circle cx=\"494.95\" cy=\"346.15\" fill=\"none\" id=\"svg_motor_circle\" r=\"192\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.35026 0 0 1.44836 2.42816 38.393)\"/>\n  <path d=\"m469.38,199.28l3.17,-5.88l5.48,-3.4l6.33,0.0l5.48,3.4l3.17,5.88l0.0,6.79l-3.17,5.88l-5.48,3.4l-6.33,0.0l-5.48,-3.4l-3.17,-5.88l0.0,-6.79z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m660.17,198.32l3.17,-5.88l5.48,-3.4l6.33,0.0l5.48,3.4l3.17,5.88l0.0,6.79l-3.17,5.88l-5.48,3.4l-6.33,0.0l-5.48,-3.4l-3.17,-5.88l0.0,-6.79z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m849.7,199.57l3.17,-5.88l5.48,-3.4l6.33,0.0l5.48,3.4l3.17,5.88l0.0,6.79l-3.17,5.88l-5.48,3.4l-6.33,0.0l-5.48,-3.4l-3.17,-5.88l0.0,-6.79z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m1057.98,210.82l3.17,-5.88l5.48,-3.4l6.33,0.0l5.48,3.4l3.17,5.88l0.0,6.79l-3.17,5.88l-5.48,3.4l-6.33,0.0l-5.48,-3.4l-3.17,-5.88l0.0,-6.79z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m468.13,876.21l3.17,-5.88l5.48,-3.4l6.33,0.0l5.48,3.4l3.17,5.88l0.0,6.79l-3.17,5.88l-5.48,3.4l-6.33,0.0l-5.48,-3.4l-3.17,-5.88l0.0,-6.79z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m661.42,875.63l3.17,-5.88l5.48,-3.4l6.33,0.0l5.48,3.4l3.17,5.88l0.0,6.79l-3.17,5.88l-5.48,3.4l-6.33,0.0l-5.48,-3.4l-3.17,-5.88l0.0,-6.79z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m850.95,874.38l3.17,-5.88l5.48,-3.4l6.33,0.0l5.48,3.4l3.17,5.88l0.0,6.79l-3.17,5.88l-5.48,3.4l-6.33,0.0l-5.48,-3.4l-3.17,-5.88l0.0,-6.79z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_u1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.35026 0 0 1.32378 24.0323 16.2289)\" x1=\"338.58\" x2=\"338.58\" y1=\"132.05\" y2=\"252.19\"/>\n  <line fill=\"none\" id=\"svg_v1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.35026 0 0 1.44836 24.0323 6.52897)\" x1=\"479.87\" x2=\"479.87\" y1=\"126.02\" y2=\"171.92\"/>\n  <line fill=\"none\" id=\"svg_w1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.35026 0 0 1.36271 24.0323 13.1977)\" x1=\"620.24\" x2=\"620.24\" y1=\"129.7\" y2=\"249.84\"/>\n  <line fill=\"none\" id=\"svg_w2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"479.95\" x2=\"479.95\" y1=\"721.45\" y2=\"895.46\"/>\n  <line fill=\"none\" id=\"svg_u2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.35026 0 0 1.55268 24.0323 -57.6893)\" x1=\"480.8\" x2=\"480.8\" y1=\"565.26\" y2=\"611.16\"/>\n  <line fill=\"none\" id=\"svg_v2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.35026 0 0 1.33935 24.0323 55.1643)\" x1=\"621.16\" x2=\"621.16\" y1=\"503.85\" y2=\"623.99\"/>\n  <path d=\"m774.49,193.33l0,180l-75.3,0\" fill=\"none\" id=\"svg_pe_stem\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.35026 0 0 1.77669 24.0323 -117.748)\"/>\n  <path d=\"m955,467.5a222.39,313.33 0 0 1 0,178.07\" fill=\"none\" id=\"svg_pe_arc\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"68\" font-weight=\"bold\" id=\"svg_m3\" stroke-width=\"5\" text-anchor=\"middle\" transform=\"matrix(1.35026 0 0 1.44836 386.064 181.12)\" x=\"189.07\" y=\"261.48\">M3</text>\n  <path d=\"m736.44,524.99c10.8,-23.17 21.6,-23.17 32.41,0c10.8,23.17 21.6,23.17 32.41,0\" fill=\"none\" id=\"svg_ac_tilde\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"25\" font-weight=\"bold\" id=\"svg_stardelta\" stroke-width=\"5\" text-anchor=\"middle\" transform=\"matrix(1.53983 0 0 1.86864 -104.466 -149.305)\" x=\"506.63\" y=\"415.75\">Star/Delta</text>\n </g>"},"proximity_sensor_npn_nc(2).svg":{"vb":"-43.76 -70.15 627.62 626.76","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- 3 Polygon Terminal Nodes at wire ends -->\n  <!-- Main Sensor Block (Square Box) -->\n  <!-- Internal Sensor Optics Symbol (Diamond / Beam Indicator) -->\n  <!-- Internal Normally Open (NO) Switch Symbol -->\n  <!-- Output Wires (BN, BK, BU) -->\n  <!-- All Text Converted to Pure Vector Paths -->\n  <g fill=\"none\" id=\"svg_switch\" stroke=\"#666666\" stroke-width=\"5\" transform=\"matrix(1.0972 0 0 1 -0.619982 0)\"/>\n  <path fill=\"#666666\" id=\"svg_txt_bn\"/>\n  <path fill=\"#666666\" id=\"svg_txt_bk\"/>\n  <path fill=\"#666666\" id=\"svg_txt_bu\"/>\n  <path fill=\"#666666\" id=\"svg_txt_npn\"/>\n  <path fill=\"#666666\" id=\"svg_txt_no\"/>\n  <rect fill=\"none\" height=\"200\" id=\"svg_box\" stroke=\"#666666\" stroke-width=\"9\" transform=\"matrix(1.54986 0 0 1.937 -154.808 -284.291)\" width=\"180\" x=\"104\" y=\"151\"/>\n  <path d=\"m504.1,92.27l3.97,-7.12l6.87,-4.11l7.94,0.0l6.87,4.11l3.97,7.12l0.0,8.22l-3.97,7.12l-6.87,4.11l-7.94,0.0l-6.87,-4.11l-3.97,-7.12l0.0,-8.22z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m499.1,193.46l4.04,-6.54l6.99,-3.77l8.07,0.0l6.99,3.77l4.04,6.54l0.0,7.55l-4.04,6.54l-6.99,3.77l-8.07,0.0l-6.99,-3.77l-4.04,-6.54l0.0,-7.55z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m502.1,296.09l3.97,-6.08l6.87,-3.5l7.94,0.0l6.87,3.5l3.97,6.08l0.0,7.02l-3.97,6.08l-6.87,3.5l-7.94,0.0l-6.87,-3.5l-3.97,-6.08l0.0,-7.02z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <g fill=\"none\" id=\"svg_optics\" stroke=\"#666666\" stroke-width=\"5\" transform=\"matrix(1.54986 0 0 2.03924 -154.808 -299.454)\">\n   <polygon id=\"svg_4\" points=\"145.87499237060547,157.12498950958252 175.87500762939453,187.12498950958252 145.87499237060547,217.12498950958252 115.8749771118164,187.12498950958252\" stroke-width=\"5\"/>\n   <line id=\"svg_5\" stroke-width=\"5\" transform=\"rotate(90.5429 156.61 186.088)\" x1=\"137.65\" x2=\"175.57\" y1=\"186.09\" y2=\"186.09\"/>\n   <line id=\"svg_6\" stroke-width=\"5\" x1=\"135.17\" x2=\"135.17\" y1=\"167.53\" y2=\"206.69\"/>\n  </g>\n  <line id=\"svg_7\" x1=\"108.67\" x2=\"139.67\" y1=\"220.55\" y2=\"220.55\"/>\n  <line id=\"svg_8\" x1=\"139.67\" x2=\"209.41\" y1=\"220.55\" y2=\"169.57\"/>\n  <line id=\"svg_9\" stroke-dasharray=\"6,6\" x1=\"209.41\" x2=\"232.66\" y1=\"220.55\" y2=\"220.55\"/>\n  <line fill=\"none\" id=\"svg_wire_bn\" stroke=\"#666666\" stroke-width=\"10\" x1=\"288.24\" x2=\"510\" y1=\"99.38\" y2=\"99.38\"/>\n  <line fill=\"none\" id=\"svg_wire_bk\" stroke=\"#666666\" stroke-width=\"10\" x1=\"287.24\" x2=\"510\" y1=\"196.74\" y2=\"196.74\"/>\n  <line fill=\"none\" id=\"svg_wire_bu\" stroke=\"#666666\" stroke-width=\"10\" x1=\"287.24\" x2=\"510\" y1=\"300.09\" y2=\"300.09\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"5\" x1=\"68.91\" x2=\"137.65\" y1=\"252.91\" y2=\"251.14\"/>\n  <line fill=\"none\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"5\" x1=\"189.45\" x2=\"265.59\" y1=\"250.14\" y2=\"250.14\"/>\n  <line fill=\"none\" id=\"svg_12\" stroke=\"#666666\" stroke-width=\"5\" x1=\"133.15\" x2=\"203.16\" y1=\"252.05\" y2=\"216.58\"/>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_13\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1.54986 0 0 2.03924 -79.3359 -295.908)\" x=\"141.96\" xml:space=\"preserve\" y=\"374.67\">NPN NO</text>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_14\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1.54986 0 0 2.03924 -135.865 -269.998)\" x=\"350.43\" xml:space=\"preserve\" y=\"178.05\">BN</text>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_15\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1.54986 0 0 2.03924 -144.475 -245.074)\" x=\"357.61\" xml:space=\"preserve\" y=\"211.97\">BK</text>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_16\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1.54986 0 0 2.03924 -135.865 -276.796)\" x=\"353.48\" xml:space=\"preserve\" y=\"278.36\">BU</text>\n  <line fill=\"none\" id=\"svg_17\" stroke=\"#666666\" stroke-width=\"5\" x1=\"191.97\" x2=\"191.97\" y1=\"249.86\" y2=\"213.27\"/>\n </g>"},"proximity_sensor_npn_nc.svg":{"vb":"-43.76 -70.15 627.62 626.76","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- 3 Polygon Terminal Nodes at wire ends -->\n  <!-- Main Sensor Block (Square Box) -->\n  <!-- Internal Sensor Optics Symbol (Diamond / Beam Indicator) -->\n  <!-- Internal Normally Open (NO) Switch Symbol -->\n  <!-- Output Wires (BN, BK, BU) -->\n  <!-- All Text Converted to Pure Vector Paths -->\n  <g fill=\"none\" id=\"svg_switch\" stroke=\"#666666\" stroke-width=\"5\" transform=\"matrix(1.0972 0 0 1 -0.619982 0)\"/>\n  <path fill=\"#666666\" id=\"svg_txt_bn\"/>\n  <path fill=\"#666666\" id=\"svg_txt_bk\"/>\n  <path fill=\"#666666\" id=\"svg_txt_bu\"/>\n  <path fill=\"#666666\" id=\"svg_txt_npn\"/>\n  <path fill=\"#666666\" id=\"svg_txt_no\"/>\n  <rect fill=\"none\" height=\"200\" id=\"svg_box\" stroke=\"#666666\" stroke-width=\"9\" transform=\"matrix(1.54986 0 0 1.937 -154.808 -284.291)\" width=\"180\" x=\"104\" y=\"151\"/>\n  <path d=\"m504.1,92.27l3.97,-7.12l6.87,-4.11l7.94,0.0l6.87,4.11l3.97,7.12l0.0,8.22l-3.97,7.12l-6.87,4.11l-7.94,0.0l-6.87,-4.11l-3.97,-7.12l0.0,-8.22z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m499.1,193.46l4.04,-6.54l6.99,-3.77l8.07,0.0l6.99,3.77l4.04,6.54l0.0,7.55l-4.04,6.54l-6.99,3.77l-8.07,0.0l-6.99,-3.77l-4.04,-6.54l0.0,-7.55z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m502.1,296.09l3.97,-6.08l6.87,-3.5l7.94,0.0l6.87,3.5l3.97,6.08l0.0,7.02l-3.97,6.08l-6.87,3.5l-7.94,0.0l-6.87,-3.5l-3.97,-6.08l0.0,-7.02z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <g fill=\"none\" id=\"svg_optics\" stroke=\"#666666\" stroke-width=\"5\" transform=\"matrix(1.54986 0 0 2.03924 -154.808 -299.454)\">\n   <polygon id=\"svg_4\" points=\"145.87499237060547,157.12498950958252 175.87500762939453,187.12498950958252 145.87499237060547,217.12498950958252 115.8749771118164,187.12498950958252\" stroke-width=\"5\"/>\n   <line id=\"svg_5\" stroke-width=\"5\" transform=\"rotate(90.5429 156.61 186.088)\" x1=\"137.65\" x2=\"175.57\" y1=\"186.09\" y2=\"186.09\"/>\n   <line id=\"svg_6\" stroke-width=\"5\" x1=\"135.17\" x2=\"135.17\" y1=\"167.53\" y2=\"206.69\"/>\n  </g>\n  <line id=\"svg_7\" x1=\"108.67\" x2=\"139.67\" y1=\"220.55\" y2=\"220.55\"/>\n  <line id=\"svg_8\" x1=\"139.67\" x2=\"209.41\" y1=\"220.55\" y2=\"169.57\"/>\n  <line id=\"svg_9\" stroke-dasharray=\"6,6\" x1=\"209.41\" x2=\"232.66\" y1=\"220.55\" y2=\"220.55\"/>\n  <line fill=\"none\" id=\"svg_wire_bn\" stroke=\"#666666\" stroke-width=\"10\" x1=\"288.24\" x2=\"510\" y1=\"99.38\" y2=\"99.38\"/>\n  <line fill=\"none\" id=\"svg_wire_bk\" stroke=\"#666666\" stroke-width=\"10\" x1=\"287.24\" x2=\"510\" y1=\"196.74\" y2=\"196.74\"/>\n  <line fill=\"none\" id=\"svg_wire_bu\" stroke=\"#666666\" stroke-width=\"10\" x1=\"287.24\" x2=\"510\" y1=\"300.09\" y2=\"300.09\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"5\" x1=\"68.91\" x2=\"137.65\" y1=\"252.91\" y2=\"251.14\"/>\n  <line fill=\"none\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"5\" x1=\"189.45\" x2=\"265.59\" y1=\"250.14\" y2=\"250.14\"/>\n  <line fill=\"none\" id=\"svg_12\" stroke=\"#666666\" stroke-width=\"5\" x1=\"133.15\" x2=\"203.16\" y1=\"252.05\" y2=\"216.58\"/>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_13\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1.54986 0 0 2.03924 -79.3359 -295.908)\" x=\"141.96\" xml:space=\"preserve\" y=\"374.67\">NPN NO</text>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_14\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1.54986 0 0 2.03924 -135.865 -269.998)\" x=\"350.43\" xml:space=\"preserve\" y=\"178.05\">BN</text>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_15\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1.54986 0 0 2.03924 -144.475 -245.074)\" x=\"357.61\" xml:space=\"preserve\" y=\"211.97\">BK</text>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_16\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1.54986 0 0 2.03924 -135.865 -276.796)\" x=\"353.48\" xml:space=\"preserve\" y=\"278.36\">BU</text>\n  <line fill=\"none\" id=\"svg_17\" stroke=\"#666666\" stroke-width=\"5\" x1=\"191.97\" x2=\"191.97\" y1=\"249.86\" y2=\"213.27\"/>\n </g>"},"proximity_sensor_npn_no(2).svg":{"vb":"-44.77 -68.22 670.29 628.31","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- 3 Polygon Terminal Nodes at wire ends -->\n  <!-- Main Sensor Block (Square Box) -->\n  <!-- Internal Sensor Optics Symbol (Diamond / Beam Indicator) -->\n  <!-- Internal Normally Open (NO) Switch Symbol -->\n  <!-- Output Wires (BN, BK, BU) -->\n  <!-- All Text Converted to Pure Vector Paths -->\n  <path d=\"m543.01,92.02l4.32,-7.55l7.48,-4.36l8.64,0.0l7.48,4.36l4.32,7.55l0.0,8.72l-4.32,7.55l-7.48,4.36l-8.64,0.0l-7.48,-4.36l-4.32,-7.55l0.0,-8.72z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m537.08,189.12l4.42,-7.41l7.67,-4.28l8.86,0.0l7.67,4.28l4.42,7.41l0.0,8.55l-4.42,7.41l-7.67,4.28l-8.86,0.0l-7.67,-4.28l-4.42,-7.41l0.0,-8.55z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m538.01,295.51l4.33,-7.41l7.51,-4.28l8.68,0.0l7.51,4.28l4.33,7.41l0.0,8.55l-4.33,7.41l-7.51,4.28l-8.68,0.0l-7.51,-4.28l-4.33,-7.41l0.0,-8.55z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <rect fill=\"none\" height=\"200\" id=\"svg_box\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\" width=\"180\" x=\"104\" y=\"151\"/>\n  <g fill=\"none\" id=\"svg_optics\" stroke=\"#666666\" stroke-width=\"5\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\">\n   <polygon id=\"svg_4\" points=\"145.87499237060547,157.12498950958252 175.87500762939453,187.12498950958252 145.87499237060547,217.12498950958252 115.8749771118164,187.12498950958252\" stroke-width=\"5\"/>\n   <line id=\"svg_5\" stroke-width=\"5\" transform=\"rotate(90.5429 156.61 186.088)\" x1=\"137.65\" x2=\"175.57\" y1=\"186.09\" y2=\"186.09\"/>\n   <line id=\"svg_6\" stroke-width=\"5\" x1=\"135.17\" x2=\"135.17\" y1=\"167.53\" y2=\"206.69\"/>\n  </g>\n  <g fill=\"none\" id=\"svg_switch\" stroke=\"#666666\" stroke-width=\"5\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\"/>\n  <line id=\"svg_7\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\" x1=\"170\" x2=\"190\" y1=\"255\" y2=\"255\"/>\n  <line id=\"svg_8\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\" x1=\"190\" x2=\"235\" y1=\"255\" y2=\"230\"/>\n  <line id=\"svg_9\" stroke-dasharray=\"6,6\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\" x1=\"235\" x2=\"250\" y1=\"255\" y2=\"255\"/>\n  <line fill=\"none\" id=\"svg_wire_bn\" stroke=\"#666666\" stroke-width=\"10\" x1=\"291.34\" x2=\"546.67\" y1=\"96.38\" y2=\"96.38\"/>\n  <line fill=\"none\" id=\"svg_wire_bk\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.62255 0 0 0.986778 -176.241 -47.4155)\" x1=\"284.45\" x2=\"446.95\" y1=\"245.94\" y2=\"245.94\"/>\n  <line fill=\"none\" id=\"svg_wire_bu\" stroke=\"#666666\" stroke-width=\"10\" x1=\"286.4\" x2=\"544.11\" y1=\"302.91\" y2=\"302.91\"/>\n  <path fill=\"#666666\" id=\"svg_txt_bn\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\"/>\n  <path fill=\"#666666\" id=\"svg_txt_bk\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\"/>\n  <path fill=\"#666666\" id=\"svg_txt_bu\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\"/>\n  <path fill=\"#666666\" id=\"svg_txt_npn\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\"/>\n  <path fill=\"#666666\" id=\"svg_txt_no\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"5\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\" x1=\"144.35\" x2=\"188.7\" y1=\"270.87\" y2=\"270\"/>\n  <line fill=\"none\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"5\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\" x1=\"220.87\" x2=\"270\" y1=\"268.26\" y2=\"268.26\"/>\n  <line fill=\"none\" id=\"svg_12\" stroke=\"#666666\" stroke-width=\"5\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\" x1=\"187.83\" x2=\"229.57\" y1=\"269.57\" y2=\"244.78\"/>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_13\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046) matrix(1 0 0 1 48.6957 1.73913)\" x=\"142.61\" xml:space=\"preserve\" y=\"379.57\">NPN NO</text>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_14\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1.54927 0 0 2.00239 -136.699 -263.123)\" x=\"353.66\" xml:space=\"preserve\" y=\"171.32\">BN</text>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_15\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1.54927 0 0 2.00239 -145.306 -238.649)\" x=\"356.15\" xml:space=\"preserve\" y=\"209.21\">BK</text>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_16\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1.54927 0 0 2.00239 -136.699 -269.797)\" x=\"353.48\" xml:space=\"preserve\" y=\"277.55\">BU</text>\n </g>"},"proximity_sensor_npn_no.svg":{"vb":"-44.77 -68.22 670.29 628.31","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- 3 Polygon Terminal Nodes at wire ends -->\n  <!-- Main Sensor Block (Square Box) -->\n  <!-- Internal Sensor Optics Symbol (Diamond / Beam Indicator) -->\n  <!-- Internal Normally Open (NO) Switch Symbol -->\n  <!-- Output Wires (BN, BK, BU) -->\n  <!-- All Text Converted to Pure Vector Paths -->\n  <path d=\"m543.01,92.02l4.32,-7.55l7.48,-4.36l8.64,0.0l7.48,4.36l4.32,7.55l0.0,8.72l-4.32,7.55l-7.48,4.36l-8.64,0.0l-7.48,-4.36l-4.32,-7.55l0.0,-8.72z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m537.08,189.12l4.42,-7.41l7.67,-4.28l8.86,0.0l7.67,4.28l4.42,7.41l0.0,8.55l-4.42,7.41l-7.67,4.28l-8.86,0.0l-7.67,-4.28l-4.42,-7.41l0.0,-8.55z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"m538.01,295.51l4.33,-7.41l7.51,-4.28l8.68,0.0l7.51,4.28l4.33,7.41l0.0,8.55l-4.33,7.41l-7.51,4.28l-8.68,0.0l-7.51,-4.28l-4.33,-7.41l0.0,-8.55z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <rect fill=\"none\" height=\"200\" id=\"svg_box\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\" width=\"180\" x=\"104\" y=\"151\"/>\n  <g fill=\"none\" id=\"svg_optics\" stroke=\"#666666\" stroke-width=\"5\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\">\n   <polygon id=\"svg_4\" points=\"145.87499237060547,157.12498950958252 175.87500762939453,187.12498950958252 145.87499237060547,217.12498950958252 115.8749771118164,187.12498950958252\" stroke-width=\"5\"/>\n   <line id=\"svg_5\" stroke-width=\"5\" transform=\"rotate(90.5429 156.61 186.088)\" x1=\"137.65\" x2=\"175.57\" y1=\"186.09\" y2=\"186.09\"/>\n   <line id=\"svg_6\" stroke-width=\"5\" x1=\"135.17\" x2=\"135.17\" y1=\"167.53\" y2=\"206.69\"/>\n  </g>\n  <g fill=\"none\" id=\"svg_switch\" stroke=\"#666666\" stroke-width=\"5\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\"/>\n  <line id=\"svg_7\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\" x1=\"170\" x2=\"190\" y1=\"255\" y2=\"255\"/>\n  <line id=\"svg_8\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\" x1=\"190\" x2=\"235\" y1=\"255\" y2=\"230\"/>\n  <line id=\"svg_9\" stroke-dasharray=\"6,6\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\" x1=\"235\" x2=\"250\" y1=\"255\" y2=\"255\"/>\n  <line fill=\"none\" id=\"svg_wire_bn\" stroke=\"#666666\" stroke-width=\"10\" x1=\"291.34\" x2=\"546.67\" y1=\"96.38\" y2=\"96.38\"/>\n  <line fill=\"none\" id=\"svg_wire_bk\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.62255 0 0 0.986778 -176.241 -47.4155)\" x1=\"284.45\" x2=\"446.95\" y1=\"245.94\" y2=\"245.94\"/>\n  <line fill=\"none\" id=\"svg_wire_bu\" stroke=\"#666666\" stroke-width=\"10\" x1=\"286.4\" x2=\"544.11\" y1=\"302.91\" y2=\"302.91\"/>\n  <path fill=\"#666666\" id=\"svg_txt_bn\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\"/>\n  <path fill=\"#666666\" id=\"svg_txt_bk\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\"/>\n  <path fill=\"#666666\" id=\"svg_txt_bu\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\"/>\n  <path fill=\"#666666\" id=\"svg_txt_npn\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\"/>\n  <path fill=\"#666666\" id=\"svg_txt_no\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"5\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\" x1=\"144.35\" x2=\"188.7\" y1=\"270.87\" y2=\"270\"/>\n  <line fill=\"none\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"5\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\" x1=\"220.87\" x2=\"270\" y1=\"268.26\" y2=\"268.26\"/>\n  <line fill=\"none\" id=\"svg_12\" stroke=\"#666666\" stroke-width=\"5\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\" x1=\"187.83\" x2=\"229.57\" y1=\"269.57\" y2=\"244.78\"/>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_13\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046) matrix(1 0 0 1 48.6957 1.73913)\" x=\"142.61\" xml:space=\"preserve\" y=\"379.57\">NPN NO</text>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_14\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1.54927 0 0 2.00239 -136.699 -263.123)\" x=\"353.66\" xml:space=\"preserve\" y=\"171.32\">BN</text>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_15\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1.54927 0 0 2.00239 -145.306 -238.649)\" x=\"356.15\" xml:space=\"preserve\" y=\"209.21\">BK</text>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_16\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1.54927 0 0 2.00239 -136.699 -269.797)\" x=\"353.48\" xml:space=\"preserve\" y=\"277.55\">BU</text>\n </g>"}};

const ESC_LOAD_COLOR_OPTIONS = [
  { name: 'Red', hex: '#ff3b30' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Yellow', hex: '#ffd21f' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Orange', hex: '#ff9500' },
  { name: 'Cyan', hex: '#00e5ff' }
];

try { window.__escLoadSimColor = localStorage.getItem('esc-load-sim-color-v1') || '#ff3b30'; } catch (_) { window.__escLoadSimColor = '#ff3b30'; }
window.__escPerFileLoadColor = window.__escPerFileLoadColor || {};

window.getEscLoadSimColor = function(fileOrType) {
  if (fileOrType && window.__escPerFileLoadColor[fileOrType]) {
    return window.__escPerFileLoadColor[fileOrType];
  }
  return window.__escLoadSimColor || '#ff3b30';
};

window.setEscLoadSimColor = function(hex, fileKey) {
  if (!hex) return;
  window.__escLoadSimColor = hex;
  try { localStorage.setItem('esc-load-sim-color-v1', hex); } catch (_) {}
  if (fileKey) {
    window.__escPerFileLoadColor[fileKey] = hex;
  } else {
    Object.keys(window.__escPerFileLoadColor).forEach(k => { window.__escPerFileLoadColor[k] = hex; });
  }
  // Update selected component if it is a Load or Coil, or all Loads/Coils that don't have a custom override
  const targets = selected ? [selected] : [...document.querySelectorAll('#dropLayer .dropped-symbol')];
  targets.forEach(g => {
    const f = (g.dataset.symbolFile || g.dataset.porttype || '').toLowerCase();
    const n = ((g.dataset.name || '') + ' ' + (g.dataset.type || '')).toLowerCase();
    if (/load_|coil_|beacon|bell|lamp|buzzer|light|coil|timer/.test(f + ' ' + n)) {
      if (!fileKey || (g.dataset.symbolFile === fileKey)) {
        g.dataset.simColor = hex;
      }
    }
  });
  if (typeof window.evaluateCircuitSimulation === 'function' && running) {
    window.evaluateCircuitSimulation();
  }
};

function getAssetBasename(typeOrFile) {
  let raw = String(typeOrFile || '');
  try { raw = decodeURIComponent(raw); } catch (_) {}
  const base = raw.split(/[\\/]/).pop().split('?')[0].toLowerCase();
  return base.replace(/\s*\(\d+\)(?=\.svg$)/i, '').replace(/\s*_\s*/g, '_');
}
function getRawAssetBasename(typeOrFile) {
  let raw = String(typeOrFile || '');
  try { raw = decodeURIComponent(raw); } catch (_) {}
  return raw.split(/[\\/]/).pop().split('?')[0].toLowerCase();
}

function upgradeComponentToInlineSvg(g) {
  if (!g) return;
  const fileKey = g.dataset.symbolFile || g.dataset.porttype || g.dataset.type || '';
  const asset = getAssetBasename(fileKey);
  const inl = SVG_INLINE_CATALOG[asset];
  if (!inl) return;
  const ns = g.querySelector(':scope > svg:not(.select-box)');
  if (!ns) return;
  if (ns.dataset.inlineUpgraded === asset && !ns.querySelector('image')) return;
  const vp = getComponentViewport(fileKey);
  ns.setAttribute('x', String(vp.x));
  ns.setAttribute('y', String(vp.y));
  ns.setAttribute('width', String(vp.w));
  ns.setAttribute('height', String(vp.h));
  ns.setAttribute('viewBox', inl.vb);
  ns.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  ns.classList.add('comp-inline-svg');
  ns.dataset.inlineUpgraded = asset;
  // Namespace marker id if present so multiple beacons don't collide
  const uid = g.dataset.uid || ('u' + Math.random().toString(36).slice(2, 7));
  let markup = inl.inner;
  if (markup.includes('id="arrow"')) {
    markup = markup.replace(/id="arrow"/g, `id="arrow_${uid}"`).replace(/url\(#arrow\)/g, `url(#arrow_${uid})`);
  }
  ns.innerHTML = markup;
  if (!g.dataset.simColor) {
    g.dataset.simColor = window.getEscLoadSimColor(g.dataset.symbolFile || '');
  }
}
window.upgradeComponentToInlineSvg = upgradeComponentToInlineSvg;

function classifySimComponent(g) {
  if (!g) return 'other';
  const asset = getAssetBasename(g.dataset.symbolFile || g.dataset.porttype || g.dataset.type || '');
  const text = ((g.dataset.name || '') + ' ' + (g.dataset.type || '') + ' ' + asset).toLowerCase();
  if (/^earth_|^source_dc_|^terminal_/.test(asset) || /source|supply|terminal l1|terminal phase|terminal neutral|earth/.test(text)) return 'source';
  if (/^coil_/.test(asset) || /\bcoil\b|timer coil/.test(text)) return 'coil';
  if (/^load_/.test(asset) || /beacon|bell|pilot.?lamp|buzzer|pilot.?light|\bload\b/.test(text)) return 'load';
  if (/^motor_/.test(asset) || /\bmotor\b/.test(text)) return 'motor';
  if (/^proximity_sensor/.test(asset) || /proximity/.test(text)) return 'proximity';
  if (/^aux_contacts/.test(asset) || /aux.?contact/.test(text)) return 'aux_contact';
  if (/^main_contacts/.test(asset) || /main.?contact/.test(text)) return 'main_contact';
  if (/^switch_/.test(asset) || /switch|pushbutton|selector/.test(text)) return 'switch';
  if (/^protection_/.test(asset) || /breaker|isolator|fuse|overload/.test(text)) return 'protection';
  return 'other';
}
window.classifySimComponent = classifySimComponent;

function isOperableInRunMode(g) {
  const kind = classifySimComponent(g);
  return ['switch', 'aux_contact', 'main_contact', 'protection', 'proximity'].includes(kind);
}
window.isOperableInRunMode = isOperableInRunMode;

function saveOrigAttrs(el, attrs) {
  if (!el) return;
  attrs.forEach(a => {
    const key = 'orig_' + a;
    if (!(key in el.dataset)) {
      el.dataset[key] = el.getAttribute(a) ?? '';
    }
  });
}

function restoreOrigAttrs(el, attrs) {
  if (!el) return;
  attrs.forEach(a => {
    const key = 'orig_' + a;
    if (key in el.dataset) {
      const val = el.dataset[key];
      if (val === '') el.removeAttribute(a);
      else el.setAttribute(a, val);
    }
  });
}

function applyVisualSwitchPosition(g, stateStr) {
  if (!g) return;
  upgradeComponentToInlineSvg(g);
  const ns = g.querySelector(':scope > svg:not(.select-box)');
  if (!ns) return;
  const asset = getAssetBasename(g.dataset.symbolFile || g.dataset.porttype || g.dataset.type || '');
  const st = String(stateStr || '0');

  const setLine = (sel, x1, y1, x2, y2) => {
    const el = ns.querySelector(sel);
    if (!el) return;
    saveOrigAttrs(el, ['x1', 'y1', 'x2', 'y2', 'transform']);
    if (st === '0') {
      restoreOrigAttrs(el, ['x1', 'y1', 'x2', 'y2', 'transform']);
    } else {
      if (x1 != null) el.setAttribute('x1', String(x1));
      if (y1 != null) el.setAttribute('y1', String(y1));
      if (x2 != null) el.setAttribute('x2', String(x2));
      if (y2 != null) el.setAttribute('y2', String(y2));
    }
  };

  const closeFlapperToStem = (sel, closedY2) => {
    const el = ns.querySelector(sel);
    if (!el) return;
    saveOrigAttrs(el, ['x1', 'y1', 'x2', 'y2', 'transform']);
    if (st === '0') {
      restoreOrigAttrs(el, ['x1', 'y1', 'x2', 'y2', 'transform']);
    } else {
      const origX1 = el.dataset.orig_x1 || el.getAttribute('x1');
      if (origX1 != null) el.setAttribute('x2', String(origX1));
      if (closedY2 != null) el.setAttribute('y2', String(closedY2));
    }
  };

  if (asset === 'switch_no.svg' || asset === 'switch_pushbutton_no.svg' || asset === 'aux_contacts_no.svg') {
    closeFlapperToStem('#svg_flapper', 167);
  } else if (asset === 'aux_contacts_off_delay_no.svg' || asset === 'aux_contacts_on_delay_no.svg') {
    closeFlapperToStem('#svg_flapper', 174.7);
  } else if (asset === 'switch_nc.svg' || asset === 'switch_pushbutton_nc.svg') {
    setLine('#svg_flapper', 225, 308, 175, 172);
  } else if (asset === 'aux_contacts_nc.svg') {
    setLine('#svg_flapper', 225, 308, 180, 178);
  } else if (asset === 'aux_contacts_off_delay_nc.svg' || asset === 'aux_contacts_on_delay_nc.svg') {
    setLine('#svg_flapper', 225, 308, 175, 172);
  } else if (asset === 'switch_con.svg' || asset === 'switch_pushbutton_con.svg') {
    setLine('#svg_flapper', 262.3, 302.7, 225, 173.6);
  } else if (asset === 'switch_3_position_selector i-0-ii.svg') {
    const el = ns.querySelector('#svg_flapper');
    if (el) {
      saveOrigAttrs(el, ['x1', 'y1', 'x2', 'y2']);
      if (st === '0') restoreOrigAttrs(el, ['x1', 'y1', 'x2', 'y2']);
      else if (st === '1') { el.setAttribute('x1', '225'); el.setAttribute('y1', '295.3'); el.setAttribute('x2', '225'); el.setAttribute('y2', '169'); }
      else if (st === '2') { el.setAttribute('x1', '275'); el.setAttribute('y1', '305'); el.setAttribute('x2', '225'); el.setAttribute('y2', '169'); }
    }
  } else if (asset === 'switch_3_position_selector i-ii-iii.svg') {
    const el = ns.querySelector('#svg_flapper');
    if (el) {
      saveOrigAttrs(el, ['x1', 'y1', 'x2', 'y2']);
      if (st === '0') restoreOrigAttrs(el, ['x1', 'y1', 'x2', 'y2']);
      else if (st === '1') { el.setAttribute('x1', '270'); el.setAttribute('y1', '292.5'); el.setAttribute('x2', '270'); el.setAttribute('y2', '165'); }
      else if (st === '2') { el.setAttribute('x1', '417.3'); el.setAttribute('y1', '293.5'); el.setAttribute('x2', '270'); el.setAttribute('y2', '165'); }
    }
  } else if (asset === 'main_contacts_1p_no.svg') {
    closeFlapperToStem('#svg_flapper');
  } else if (asset === 'main_contacts_2p_no.svg') {
    closeFlapperToStem('#svg_flapper1');
    closeFlapperToStem('#svg_flapper2');
  } else if (asset === 'main_contacts_3p_no.svg') {
    closeFlapperToStem('#svg_flapper1');
    closeFlapperToStem('#svg_flapper2');
    closeFlapperToStem('#svg_flapper3');
  } else if (asset === 'main_contacts_4p_no.svg') {
    closeFlapperToStem('#svg_flapper1');
    closeFlapperToStem('#svg_flapper2');
    closeFlapperToStem('#svg_flapper3');
    closeFlapperToStem('#svg_flapper4');
  } else if (asset === 'protection_circuit_breaker_1p.svg') {
    closeFlapperToStem('#svg_flapper');
  } else if (asset === 'protection_circuit_breaker_2p.svg') {
    closeFlapperToStem('#svg_flapper1');
    closeFlapperToStem('#svg_flapper2');
  } else if (asset === 'protection_circuit_breaker_3p.svg') {
    closeFlapperToStem('#svg_flapper1');
    closeFlapperToStem('#svg_flapper2');
    closeFlapperToStem('#svg_flapper3');
  } else if (asset === 'protection_motor_circuit_breaker_2p.svg') {
    closeFlapperToStem('#svg_flapper1');
    closeFlapperToStem('#svg_flapper2');
  } else if (asset === 'protection_motor_circuit_breaker_3p.svg') {
    closeFlapperToStem('#svg_flapper1');
    closeFlapperToStem('#svg_flapper2');
    closeFlapperToStem('#svg_flapper3');
  } else if (asset.startsWith('protection_fuse_isolator_')) {
    closeFlapperToStem('#svg_flapper1');
    closeFlapperToStem('#svg_13');
    closeFlapperToStem('#svg_10');
    closeFlapperToStem('#svg_30');
    [
      ['#svg_fuse_box1', '#svg_flapper1', 330],
      ['#svg_14', '#svg_13', 335],
      ['#svg_11', '#svg_10', 335],
      ['#svg_29', '#svg_30', 335]
    ].forEach(([boxSel, flapSel, ry]) => {
      const box = ns.querySelector(boxSel);
      const flap = ns.querySelector(flapSel);
      if (!box || !flap) return;
      saveOrigAttrs(box, ['x', 'y', 'transform']);
      if (st === '0') restoreOrigAttrs(box, ['x', 'y', 'transform']);
      else {
        const stemX = parseFloat(flap.dataset.orig_x1 || flap.getAttribute('x1') || '400');
        box.setAttribute('transform', '');
        box.setAttribute('x', String(Math.round((stemX - 22.5) * 100) / 100));
        box.setAttribute('y', String(ry));
      }
    });
  } else if (asset === 'proximity_sensor_npn_nc.svg') {
    setLine('#svg_8', 139.67, 220.55, 209.41, 220.55);
  } else if (asset === 'proximity_sensor_npn_no.svg') {
    setLine('#svg_8', 190, 255, 235, 255);
    setLine('#svg_12', 187.83, 269.57, 229.57, 269.57);
  }

  g.classList.toggle('sim-switch-operated', st !== '0');
}
window.applyVisualSwitchPosition = applyVisualSwitchPosition;

function getInternalConductingPairs(g, effectiveState) {
  const asset = getAssetBasename(g.dataset.symbolFile || g.dataset.porttype || g.dataset.type || '');
  const st = String(effectiveState || '0');
  const ports = portsFor(g);
  const n = ports.length;

  // 3-position selectors
  if (asset === 'switch_3_position_selector i-0-ii.svg') {
    if (st === '0') return [[0, 1]]; // Pos I: 11-12
    if (st === '1') return [];       // Pos 0: OFF
    if (st === '2') return [[0, 2]]; // Pos II: 11-14
  }
  if (asset === 'switch_3_position_selector i-ii-iii.svg') {
    if (st === '0') return [[0, 1]]; // Pos I: 11-12
    if (st === '1') return [[0, 2]]; // Pos II: 11-14
    if (st === '2') return [[0, 3]]; // Pos III: 11-16
  }
  // Changeover switches
  if (asset === 'switch_con.svg' || asset === 'switch_pushbutton_con.svg') {
    return st === '0' ? [[0, 1]] : [[0, 2]];
  }
  // Normally Closed (NC) 1-pole switches & aux contacts
  if (/(?:_nc\.svg$|_nc\(1\)\.svg$)/.test(asset) && !asset.startsWith('proximity_')) {
    return st === '0' ? [[0, 1]] : [];
  }
  // Fuses & Thermal Overload Relays: normally closed (conducting) when st === '0'
  if (/^protection_fuse_[1234]p\.svg$|^protection_thermal_overload_relay_/.test(asset)) {
    if (st !== '0') return [];
    const poles = Math.floor(n / 2);
    const pairs = [];
    for (let i = 0; i < poles; i++) pairs.push([i, poles + i]);
    return pairs;
  }
  // Proximity sensors: 3 terminals [0: BN (+), 1: BK (out), 2: BU (-)]
  if (asset.startsWith('proximity_sensor_')) {
    const isNc = asset.includes('_nc');
    const closed = isNc ? (st === '0') : (st === '1');
    return closed ? [[1, 2]] : []; // NPN switches BK (1) to BU (2) when active
  }
  // All NO switches, NO aux contacts, Main contacts (1P..4P), Circuit Breakers (1P..3P), Motor Circuit Breakers (2P..3P), Fuse Isolators (1P..4P)
  const kind = classifySimComponent(g);
  if (['switch', 'aux_contact', 'main_contact', 'protection'].includes(kind)) {
    if (st === '0') return [];
    const poles = Math.floor(n / 2);
    const pairs = [];
    for (let i = 0; i < poles; i++) pairs.push([i, poles + i]);
    return pairs;
  }
  return [];
}

function getSourceTerminalPotentials(g) {
  const asset = getAssetBasename(g.dataset.symbolFile || g.dataset.porttype || g.dataset.type || '');
  if (asset === 'source_dc_positive.svg') return { 0: ['POS'] };
  if (asset === 'source_dc_negative.svg') return { 0: ['NEG'] };
  if (asset === 'source_dc_supply_pair.svg') return { 0: ['POS'], 1: ['NEG'] };
  if (asset === 'terminal_phase_l.svg') return { 0: ['L'] };
  if (asset === 'terminal_neutral_n.svg') return { 0: ['N'] };
  if (asset === 'terminal_l1_l2_l3.svg') return { 0: ['L1'], 1: ['L2'], 2: ['L3'] };
  if (asset === 'terminal_l1_l2_l3_n.svg') return { 0: ['L1'], 1: ['L2'], 2: ['L3'], 3: ['N'] };
  if (asset === 'earth_pe.svg' || asset === 'earth_ground.svg') return { 0: ['PE'] };
  return {};
}

function hasEnergizingPotentialDiff(sA, sB) {
  if (!sA || !sB || !sA.size || !sB.size) return false;
  // 1. DC + and -
  if ((sA.has('POS') && sB.has('NEG')) || (sA.has('NEG') && sB.has('POS'))) return true;
  // 2. AC Phase (L, L1, L2, L3) and Neutral (N)
  const phases = ['L', 'L1', 'L2', 'L3'];
  const aHasPhase = phases.some(p => sA.has(p));
  const bHasPhase = phases.some(p => sB.has(p));
  if ((aHasPhase && sB.has('N')) || (sA.has('N') && bHasPhase)) return true;
  // 3. AC Phase-to-Phase (two distinct phases among L1, L2, L3)
  for (const p1 of ['L1', 'L2', 'L3']) {
    for (const p2 of ['L1', 'L2', 'L3']) {
      if (p1 !== p2 && sA.has(p1) && sB.has(p2)) return true;
    }
  }
  return false;
}

function ensureMotorRotorOverlay(motor, runningDir) {
  upgradeComponentToInlineSvg(motor);
  const ns = motor.querySelector(':scope > svg:not(.select-box)');
  if (!ns) return;
  let badge = ns.querySelector('.sim-motor-rotor-group');
  if (!runningDir) {
    if (badge) badge.remove();
    return;
  }
  // Find exact #svg_motor_circle center and radius in root SVG coordinates
  const vb = (ns.getAttribute('viewBox') || '0 0 450 480').trim().split(/[ ,]+/).map(Number);
  let cx = (vb[0] || 0) + (vb[2] || 450) / 2;
  let cy = (vb[1] || 0) + (vb[3] || 480) * 0.56;
  let r = Math.min(vb[2] || 450, vb[3] || 480) * 0.24;
  const mc = ns.querySelector('#svg_motor_circle');
  if (mc) {
    try {
      const b = mc.getBBox();
      const m = ns.getScreenCTM().inverse().multiply(mc.getScreenCTM());
      const pCenter = new DOMPoint(b.x + b.width / 2, b.y + b.height / 2).matrixTransform(m);
      const pEdge = new DOMPoint(b.x + b.width, b.y + b.height / 2).matrixTransform(m);
      cx = Math.round(pCenter.x * 10) / 10;
      cy = Math.round(pCenter.y * 10) / 10;
      r = Math.round(Math.hypot(pEdge.x - pCenter.x, pEdge.y - pCenter.y) * 0.80 * 10) / 10;
    } catch (_) {}
  }
  const NS = 'http://www.w3.org/2000/svg';
  if (!badge) {
    badge = document.createElementNS(NS, 'g');
    badge.setAttribute('class', 'sim-motor-rotor-group');
    ns.appendChild(badge);
  }
  badge.setAttribute('transform', `translate(${cx}, ${cy})`);
  const spinClass = runningDir === 'CCW' ? 'sim-rotor-spin-ccw' : 'sim-rotor-spin-cw';
  badge.innerHTML = `<g class="${spinClass}">
    <circle class="sim-rotor-ring" cx="0" cy="0" r="${Math.round(r)}" fill="none" stroke="#22c55e" stroke-width="11" stroke-dasharray="${Math.round(r * 0.65)} ${Math.round(r * 0.48)}" stroke-linecap="round"/>
  </g>`;
}

function evaluateCircuitSimulation() {
  const comps = [...document.querySelectorAll('#dropLayer .dropped-symbol')];
  const wires = [...document.querySelectorAll('#wireLayer .connected-wire')];
  comps.forEach(upgradeComponentToInlineSvg);

  if (!running) {
    comps.forEach(g => {
      g.classList.remove('device-on', 'sim-energized', 'sim-blinking', 'motor-rotating-cw', 'motor-rotating-ccw', 'motor-direction-unknown', 'sim-switch-operated');
      g.style.removeProperty('--sim-active-color');
      delete g.dataset.simState;
      delete g.dataset.simManualOverride;
      applyVisualSwitchPosition(g, '0');
      ensureMotorRotorOverlay(g, null);
    });
    wires.forEach(w => {
      w.classList.remove('wire-live', 'wire-dc-positive', 'wire-dc-negative', 'wire-l1', 'wire-l2', 'wire-l3', 'wire-neutral');
    });
    return;
  }

  // Iterative solver (3 passes) so energized Contactor/Timer Coils actuate their linked Main/Aux Contacts
  let energizedCoils = new Set();
  let energizedCoilRefs = new Set();
  let nodePotentials = new Map();

  for (let pass = 0; pass < 3; pass++) {
    nodePotentials = new Map();
    const adj = new Map();
    const keyOf = (uid, idx) => `${uid}:${idx}`;
    const addEdge = (a, b) => {
      if (!adj.has(a)) adj.set(a, []);
      if (!adj.has(b)) adj.set(b, []);
      adj.get(a).push(b);
      adj.get(b).push(a);
    };

    // 1. Add external wire edges
    wires.forEach(w => {
      const fromG = w.dataset.fromG, toG = w.dataset.toG;
      if (!fromG || !toG) return;
      const aG = document.querySelector(`#dropLayer .dropped-symbol[data-uid="${fromG}"]`);
      const bG = document.querySelector(`#dropLayer .dropped-symbol[data-uid="${toG}"]`);
      if (!aG || !bG) return;
      const pA = resolveComponentPort(aG, w.dataset.fromIndex, w.dataset.from);
      const pB = resolveComponentPort(bG, w.dataset.toIndex, w.dataset.to);
      if (!pA || !pB) return;
      addEdge(keyOf(fromG, pA.index), keyOf(toG, pB.index));
    });

    // 2. Determine effective state of each switch/contact/breaker and add internal closed edges
    comps.forEach(g => {
      const uid = g.dataset.uid;
      const kind = classifySimComponent(g);
      let effState = g.dataset.simState || '0';

      if ((kind === 'aux_contact' || kind === 'main_contact') && g.dataset.simManualOverride !== '1') {
        const ref = String(g.dataset.ref || '').trim().toUpperCase();
        const numMatch = ref.match(/(\d+)$/);
        const numSuffix = numMatch ? numMatch[1] : '';
        const coilLinked = energizedCoilRefs.has(ref) ||
          (numSuffix && [...energizedCoilRefs].some(cr => cr.endsWith(numSuffix))) ||
          (energizedCoils.size === 1 && comps.filter(c => classifySimComponent(c) === 'coil').length === 1);
        effState = coilLinked ? '1' : '0';
      }
      g.dataset.simEffectiveState = effState;
      applyVisualSwitchPosition(g, effState);

      const pairs = getInternalConductingPairs(g, effState);
      pairs.forEach(([iA, iB]) => {
        addEdge(keyOf(uid, iA), keyOf(uid, iB));
      });
    });

    // 3. Inject potentials from sources and run BFS
    const queue = [];
    comps.forEach(g => {
      if (classifySimComponent(g) !== 'source') return;
      const uid = g.dataset.uid;
      const srcMap = getSourceTerminalPotentials(g);
      Object.entries(srcMap).forEach(([idxStr, pots]) => {
        const k = keyOf(uid, Number(idxStr));
        if (!nodePotentials.has(k)) nodePotentials.set(k, new Set());
        const set = nodePotentials.get(k);
        pots.forEach(p => {
          if (!set.has(p)) {
            set.add(p);
            queue.push([k, p]);
          }
        });
      });
    });

    while (queue.length > 0) {
      const [curr, pot] = queue.shift();
      const neighbors = adj.get(curr) || [];
      for (const nxt of neighbors) {
        if (!nodePotentials.has(nxt)) nodePotentials.set(nxt, new Set());
        const nSet = nodePotentials.get(nxt);
        if (!nSet.has(pot)) {
          nSet.add(pot);
          queue.push([nxt, pot]);
        }
      }
    }

    // 4. Check which coils are energized in this pass
    const nextCoils = new Set();
    const nextRefs = new Set();
    comps.forEach(g => {
      if (classifySimComponent(g) !== 'coil') return;
      const uid = g.dataset.uid;
      const s0 = nodePotentials.get(keyOf(uid, 0)) || new Set();
      const s1 = nodePotentials.get(keyOf(uid, 1)) || new Set();
      if (hasEnergizingPotentialDiff(s0, s1)) {
        nextCoils.add(uid);
        const ref = String(g.dataset.ref || '').trim().toUpperCase();
        if (ref) nextRefs.add(ref);
      }
    });

    energizedCoils = nextCoils;
    energizedCoilRefs = nextRefs;
  }

  // 5. Apply visual state to Coils, Loads, Proximity Sensors, and Motors
  const keyOf = (uid, idx) => `${uid}:${idx}`;
  const motorResults = [];

  comps.forEach(g => {
    const uid = g.dataset.uid;
    const kind = classifySimComponent(g);
    const asset = getAssetBasename(g.dataset.symbolFile || g.dataset.porttype || g.dataset.type || '');
    g.classList.remove('device-on', 'sim-energized', 'sim-blinking', 'motor-rotating-cw', 'motor-rotating-ccw', 'motor-direction-unknown');
    g.style.removeProperty('--sim-active-color');
    ensureMotorRotorOverlay(g, null);

    if (kind === 'coil' || kind === 'load') {
      const s0 = nodePotentials.get(keyOf(uid, 0)) || new Set();
      const s1 = nodePotentials.get(keyOf(uid, 1)) || new Set();
      const isOn = hasEnergizingPotentialDiff(s0, s1);
      if (isOn) {
        const chosenColor = g.dataset.simColor || window.getEscLoadSimColor(g.dataset.symbolFile || '');
        g.classList.add('device-on', 'sim-energized');
        if (asset.includes('blinking')) g.classList.add('sim-blinking');
        g.style.setProperty('--sim-active-color', chosenColor);
      }
    } else if (kind === 'proximity') {
      const sBN = nodePotentials.get(keyOf(uid, 0)) || new Set();
      const sBU = nodePotentials.get(keyOf(uid, 2)) || new Set();
      const powered = hasEnergizingPotentialDiff(sBN, sBU);
      if (powered) {
        g.classList.add('device-on', 'sim-energized');
        g.style.setProperty('--sim-active-color', '#00e5ff');
      }
    } else if (kind === 'motor') {
      if (asset.includes('dc_motor')) {
        const s0 = nodePotentials.get(keyOf(uid, 0)) || new Set();
        const s1 = nodePotentials.get(keyOf(uid, 1)) || new Set();
        const cw = (s0.has('POS') && s1.has('NEG')) || ((s0.has('L') || s0.has('L1')) && s1.has('N'));
        const ccw = (s0.has('NEG') && s1.has('POS')) || (s0.has('N') && (s1.has('L') || s1.has('L1')));
        if (cw || ccw) {
          g.classList.add('device-on', 'sim-energized', cw ? 'motor-rotating-cw' : 'motor-rotating-ccw');
          g.style.setProperty('--sim-active-color', '#22c55e');
          ensureMotorRotorOverlay(g, cw ? 'CW' : 'CCW');
          motorResults.push(`${g.dataset.ref || g.dataset.name || 'DC Motor'}: RUNNING (${cw ? 'CLOCKWISE' : 'ANTICLOCKWISE'})`);
        } else {
          g.classList.add('motor-direction-unknown');
          motorResults.push(`${g.dataset.ref || g.dataset.name || 'DC Motor'}: OFF`);
        }
      } else if (asset.includes('single_phase')) {
        const s0 = nodePotentials.get(keyOf(uid, 0)) || new Set();
        const s1 = nodePotentials.get(keyOf(uid, 1)) || new Set();
        if (hasEnergizingPotentialDiff(s0, s1)) {
          g.classList.add('device-on', 'sim-energized', 'motor-rotating-cw');
          g.style.setProperty('--sim-active-color', '#22c55e');
          ensureMotorRotorOverlay(g, 'CW');
          motorResults.push(`${g.dataset.ref || g.dataset.name || '1P Motor'}: RUNNING`);
        } else {
          g.classList.add('motor-direction-unknown');
          motorResults.push(`${g.dataset.ref || g.dataset.name || '1P Motor'}: OFF`);
        }
      } else {
        // 3-Phase Motor: requires all 3 phases L1, L2, L3 at U, V, W (ports 0, 1, 2)
        const sU = nodePotentials.get(keyOf(uid, 0)) || new Set();
        const sV = nodePotentials.get(keyOf(uid, 1)) || new Set();
        const sW = nodePotentials.get(keyOf(uid, 2)) || new Set();
        const pickPhase = s => (s.has('L1') ? 'R' : s.has('L2') ? 'Y' : s.has('L3') ? 'B' : '');
        const pU = pickPhase(sU), pV = pickPhase(sV), pW = pickPhase(sW);
        const allThreeConnected = Boolean(pU && pV && pW && new Set([pU, pV, pW]).size === 3);
        if (allThreeConnected) {
          const sig = pU + pV + pW;
          const cw = (sig === 'RYB' || sig === 'YBR' || sig === 'BRY');
          g.classList.add('device-on', 'sim-energized', cw ? 'motor-rotating-cw' : 'motor-rotating-ccw');
          g.style.setProperty('--sim-active-color', '#22c55e');
          ensureMotorRotorOverlay(g, cw ? 'CW' : 'CCW');
          motorResults.push(`${g.dataset.ref || g.dataset.name || '3P Motor'}: RUNNING (${cw ? 'CLOCKWISE' : 'ANTICLOCKWISE'})`);
        } else {
          g.classList.add('motor-direction-unknown');
          motorResults.push(`${g.dataset.ref || g.dataset.name || '3P Motor'}: STOPPED (CONNECT L1, L2, L3 TO U, V, W)`);
        }
      }
    }
  });

  // 6. Colour wires based on actual propagated potentials on each wire
  const wireColourClasses = ['wire-dc-positive', 'wire-dc-negative', 'wire-l1', 'wire-l2', 'wire-l3', 'wire-neutral'];
  wires.forEach(w => {
    w.classList.remove('wire-live', ...wireColourClasses);
    const fromG = w.dataset.fromG;
    const aG = document.querySelector(`#dropLayer .dropped-symbol[data-uid="${fromG}"]`);
    const pA = aG ? resolveComponentPort(aG, w.dataset.fromIndex, w.dataset.from) : null;
    const pots = (fromG && pA) ? (nodePotentials.get(keyOf(fromG, pA.index)) || new Set()) : new Set();
    if (pots.size > 0) {
      w.classList.add('wire-live');
      if (pots.has('L1')) w.classList.add('wire-l1');
      else if (pots.has('L2')) w.classList.add('wire-l2');
      else if (pots.has('L3')) w.classList.add('wire-l3');
      else if (pots.has('L')) w.classList.add('wire-l1');
      else if (pots.has('POS')) w.classList.add('wire-dc-positive');
      else if (pots.has('NEG')) w.classList.add('wire-dc-negative');
      else if (pots.has('N')) w.classList.add('wire-neutral');
    }
  });

  if (motorResults.length && motorState) {
    motorState.textContent = 'Motor: ' + motorResults.join(' • ');
  }
}
window.evaluateCircuitSimulation = evaluateCircuitSimulation;

function toggleComponentInRunMode(g) {
  if (!g || !running || !isOperableInRunMode(g)) return false;
  const asset = getAssetBasename(g.dataset.symbolFile || g.dataset.porttype || g.dataset.type || '');
  const current = String(g.dataset.simEffectiveState || g.dataset.simState || '0');
  let next = '1';
  if (asset.startsWith('switch_3_position_selector')) {
    next = current === '0' ? '1' : current === '1' ? '2' : '0';
  } else {
    next = current === '0' ? '1' : '0';
  }
  g.dataset.simState = next;
  g.dataset.simManualOverride = '1';
  evaluateCircuitSimulation();
  const label = g.dataset.ref ? `${g.dataset.ref} (${g.dataset.name || 'Switch'})` : (g.dataset.name || 'Switch');
  if (state) {
    state.textContent = `SIMULATION • ${label.toUpperCase()} → ${next === '0' ? 'NORMAL POSITION' : (next === '2' ? 'POSITION II/III' : 'OPERATED / CHANGED POSITION')}`;
  }
  return true;
}
window.toggleComponentInRunMode = toggleComponentInRunMode;

// Run-mode UI: keep the simulation controls simple without changing the circuit solver.
function setSimulationRunUI(active) {
  document.body.classList.toggle('simulation-run-ui', !!active);
  const libraryIsHidden = document.body.classList.contains('library-hidden');
  const libraryToggle = document.getElementById('libraryToggle');
  if (active && !libraryIsHidden && libraryToggle) libraryToggle.click();
  if (!active && document.body.classList.contains('library-hidden') && libraryToggle) libraryToggle.click();
}

// Override Play and Stop buttons to use the full interactive circuit solver
document.getElementById('play').onclick = () => {
  const wires = [...document.querySelectorAll('#wireLayer .connected-wire')];
  if (!wires.length) {
    running = false;
    document.body.classList.remove('live');
    setSimulationRunUI(false);
    if (sim) { sim.textContent = '● OPEN CIRCUIT'; sim.classList.remove('running'); }
    if (motorState) motorState.textContent = 'Motor: OFF';
    if (state) state.textContent = 'OPEN CIRCUIT • CONNECT COMPONENT TERMINALS WITH WIRES FIRST';
    return;
  }
  running = true;
  setSimulationRunUI(true);
  render();
  evaluateCircuitSimulation();
};

document.getElementById('stop').onclick = () => {
  running = false;
  evaluateCircuitSimulation();
  render();
  setSimulationRunUI(false);
};

// Upgrade makeDropped so every newly placed component uses inline SVG and carries its chosen Load/Coil colour
const _prevMakeDroppedV120 = makeDropped;
makeDropped = function(d, x, y) {
  const g = _prevMakeDroppedV120(d, x, y);
  if (g) {
    if (d && d.simColor) g.dataset.simColor = d.simColor;
    else if (!g.dataset.simColor) g.dataset.simColor = window.getEscLoadSimColor(d?.symbolFile || '');
    upgradeComponentToInlineSvg(g);
    if (running) evaluateCircuitSimulation();
  }
  return g;
};

// Upgrade any existing placed symbols immediately
document.querySelectorAll('#dropLayer .dropped-symbol').forEach(upgradeComponentToInlineSvg);

// Capture-phase pointerdown handler on #schematic so clicking any switch/contact/breaker in RUN mode
// immediately toggles its switch position before drag handlers can capture the pointer.

document.getElementById('libraryGroups')?.addEventListener('click', function(e) {
  const dot = e.target && e.target.closest ? e.target.closest('.load-color-dot') : null;
  if (!dot) return;
  e.preventDefault();
  e.stopPropagation();
  if (e.stopImmediatePropagation) e.stopImmediatePropagation();
  const color = dot.dataset.color;
  const fileKey = dot.dataset.file || null;
  window.setEscLoadSimColor(color, fileKey);
  const hostEl = document.getElementById('libraryGroups');
  if (!fileKey) {
    hostEl.querySelectorAll('.load-color-dot').forEach(d => d.classList.toggle('active', d.dataset.color === color));
    hostEl.querySelectorAll('.symbol-btn').forEach(b => { b.dataset.simColor = color; });
  } else {
    const card = dot.closest('.symbol-btn');
    if (card) {
      card.dataset.simColor = color;
      card.querySelectorAll('.load-color-dot').forEach(d => d.classList.toggle('active', d.dataset.color === color));
    }
  }
}, true);

document.getElementById('schematic')?.addEventListener('pointerdown', function(e) {
  if (!running || e.button !== 0) return;
  if (e.target && e.target.closest && e.target.closest('.mag-port')) return;
  if (typeof window.resolvePortFromEvent === 'function' && window.resolvePortFromEvent(e, 11)) return;
  const g = e.target && e.target.closest ? e.target.closest('#dropLayer .dropped-symbol') : null;
  if (!g || !isOperableInRunMode(g)) return;
  e.preventDefault();
  e.stopPropagation();
  if (e.stopImmediatePropagation) e.stopImmediatePropagation();
  toggleComponentInRunMode(g);
}, true);
