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
const SVG_TERMINAL_CATALOG = {"earth_ground.svg":{"vb":[0.0,0.0,450.0,480.0],"ports":[{"vx":225.0,"vy":22.0,"vw":35.0,"vh":35.0,"label":"PE","side":"top"}]},"earth_pe.svg":{"vb":[0.0,0.0,450.0,480.0],"ports":[{"vx":225.0,"vy":416.71,"vw":35.0,"vh":35.0,"label":"PE","side":"bottom"}]},"source_dc_negative.svg":{"vb":[0.0,0.0,450.0,480.0],"ports":[{"vx":225.0,"vy":416.71,"vw":35.0,"vh":35.0,"label":"NEG","side":"bottom"}]},"source_dc_positive.svg":{"vb":[0.0,0.0,450.0,480.0],"ports":[{"vx":225.0,"vy":416.71,"vw":35.0,"vh":35.0,"label":"POS","side":"bottom"}]},"source_dc_supply_pair.svg":{"vb":[0.0,0.0,520.0,480.0],"ports":[{"vx":165.0,"vy":416.71,"vw":35.0,"vh":35.0,"label":"+","side":"bottom"},{"vx":355.0,"vy":416.71,"vw":35.0,"vh":35.0,"label":"-","side":"bottom"}]},"terminal_l1_l2_l3.svg":{"vb":[0.0,0.0,580.0,480.0],"ports":[{"vx":105.0,"vy":416.71,"vw":35.0,"vh":35.0,"label":"L1","side":"bottom"},{"vx":290.0,"vy":416.71,"vw":35.0,"vh":35.0,"label":"L2","side":"bottom"},{"vx":475.0,"vy":416.71,"vw":35.0,"vh":35.0,"label":"L3","side":"bottom"}]},"terminal_l1_l2_l3_n.svg":{"vb":[0.0,0.0,720.0,480.0],"ports":[{"vx":96.0,"vy":416.71,"vw":35.0,"vh":35.0,"label":"L1","side":"bottom"},{"vx":272.0,"vy":416.71,"vw":35.0,"vh":35.0,"label":"L2","side":"bottom"},{"vx":448.0,"vy":416.71,"vw":35.0,"vh":35.0,"label":"L3","side":"bottom"},{"vx":624.0,"vy":416.71,"vw":35.0,"vh":35.0,"label":"N","side":"bottom"}]},"terminal_neutral_n.svg":{"vb":[0.0,0.0,450.0,480.0],"ports":[{"vx":225.0,"vy":416.71,"vw":35.0,"vh":35.0,"label":"N","side":"bottom"}]},"terminal_phase_l.svg":{"vb":[0.0,0.0,450.0,480.0],"ports":[{"vx":225.0,"vy":416.71,"vw":35.0,"vh":35.0,"label":"L","side":"bottom"}]},"coil_contactor(1).svg":{"vb":[-26.96,53.65,437.93,467.13],"ports":[{"vh":33.59,"vw":35.48,"vx":192,"vy":114.96,"label":"A1","side":"top"},{"vh":33.59,"vw":35.48,"vx":192,"vy":459.46,"label":"A2","side":"bottom"}]},"coil_tof_timer(1).svg":{"vb":[-25.4,52.75,436.8,465.92],"ports":[{"vh":33.5,"vw":35,"vx":193,"vy":113.92,"label":"A1","side":"top"},{"vh":33.5,"vw":35,"vx":193,"vy":457.5,"label":"A2","side":"bottom"}]},"coil_ton_timer(1).svg":{"vb":[-24.97,52.65,437.93,467.13],"ports":[{"vh":33.59,"vw":35,"vx":194,"vy":113.96,"label":"A1","side":"top"},{"vh":33.59,"vw":35,"vx":194,"vy":458.46,"label":"A2","side":"bottom"}]},"coil_ton_tof_timer(1).svg":{"vb":[-26.92,52.7,437.84,467.03],"ports":[{"vh":33.58,"vw":35,"vx":192,"vy":114,"label":"A1","side":"top"},{"vh":33.58,"vw":35,"vx":192,"vy":458.42,"label":"A2","side":"bottom"}]},"aux_contacts_nc.svg":{"vb":[-3.33,52.62,436.93,466.06],"ports":[{"vh":33.69,"vw":35,"vx":192,"vy":112.89,"label":"21","side":"top"},{"vh":33.69,"vw":35,"vx":192,"vy":458.4,"label":"22","side":"bottom"}]},"aux_contacts_no.svg":{"vb":[-40.28,150.55,439.05,468.32],"ports":[{"vh":33.85,"vw":35,"vx":194,"vy":211.1,"label":"13","side":"top"},{"vh":33.85,"vw":35,"vx":194,"vy":558.32,"label":"14","side":"bottom"}]},"aux_contacts_off_delay _nc.svg":{"vb":[-72.62,51.65,437.92,467.11],"ports":[{"vh":33.76,"vw":35,"vx":195,"vy":112.06,"label":"65","side":"top"},{"vh":33.76,"vw":35,"vx":195,"vy":458.36,"label":"66","side":"bottom"}]},"aux_contacts_off_delay _no.svg":{"vb":[-92.29,45.45,440.17,469.52],"ports":[{"vh":33.94,"vw":35,"vx":196,"vy":106.15,"label":"67","side":"top"},{"vh":33.94,"vw":35,"vx":196,"vy":454.27,"label":"68","side":"bottom"}]},"aux_contacts_on_delay _nc.svg":{"vb":[-60.16,51.65,437.92,467.11],"ports":[{"vh":33.76,"vw":35,"vx":195,"vy":112.06,"label":"55","side":"top"},{"vh":33.76,"vw":35,"vx":195,"vy":458.36,"label":"56","side":"bottom"}]},"aux_contacts_on_delay _no.svg":{"vb":[-31.91,52.65,437.92,467.11],"ports":[{"vh":33.76,"vw":35,"vx":243,"vy":113.06,"label":"57","side":"top"},{"vh":33.76,"vw":35,"vx":243,"vy":459.36,"label":"58","side":"bottom"}]},"switch_3_position_selector i-0-ii.svg":{"vb":[91.41,54.45,440.17,469.52],"ports":[{"vh":33.94,"vw":35,"vx":332,"vy":115.15,"label":"11","side":"top"},{"vh":33.94,"vw":35,"vx":241.5,"vy":463.27,"label":"12","side":"bottom"},{"vh":33.94,"vw":35,"vx":422.5,"vy":463.27,"label":"14","side":"bottom"}]},"switch_3_position_selector i-ii-iii.svg":{"vb":[55.85,50.15,517.6,473.13],"ports":[{"vh":34.2,"vw":35,"vx":341,"vy":111.29,"label":"11","side":"top"},{"vh":34.2,"vw":35,"vx":163.3,"vy":462.13,"label":"12","side":"bottom"},{"vh":34.2,"vw":35,"vx":341,"vy":462.13,"label":"14","side":"bottom"},{"vh":34.2,"vw":35,"vx":515.1,"vy":462.13,"label":"16","side":"bottom"}]},"switch_con.svg":{"vb":[-19.66,51.65,437.92,467.11],"ports":[{"vh":33.76,"vw":35,"vx":227,"vy":112.06,"label":"11","side":"top"},{"vh":33.76,"vw":35,"vx":142.3,"vy":458.36,"label":"12","side":"bottom"},{"vh":33.76,"vw":35,"vx":307.7,"vy":458.36,"label":"14","side":"bottom"}]},"switch_nc.svg":{"vb":[-57.76,53.96,434.53,463.5],"ports":[{"vh":33.5,"vw":35,"vx":191,"vy":113.92,"label":"11","side":"top"},{"vh":33.5,"vw":35,"vx":191,"vy":457.5,"label":"12","side":"bottom"}]},"switch_no.svg":{"vb":[-69.61,0.22,453.72,483.97],"ports":[{"vh":35,"vw":35,"vx":225,"vy":62.71,"label":"13","side":"top"},{"vh":35,"vw":35,"vx":225,"vy":421.71,"label":"14","side":"bottom"}]},"switch_pushbutton_con.svg":{"vb":[-14.26,0.22,453.72,483.97],"ports":[{"vh":35,"vw":35,"vx":225,"vy":62.71,"label":"11","side":"top"},{"vh":35,"vw":35,"vx":140.3,"vy":421.71,"label":"12","side":"bottom"},{"vh":35,"vw":35,"vx":305.7,"vy":421.71,"label":"14","side":"bottom"}]},"switch_pushbutton_nc.svg":{"vb":[-29.86,0.22,453.72,483.97],"ports":[{"vh":35,"vw":35,"vx":225,"vy":62.71,"label":"11","side":"top"},{"vh":35,"vw":35,"vx":225,"vy":421.71,"label":"12","side":"bottom"}]},"switch_pushbutton_no.svg":{"vb":[-53.61,0.22,453.72,483.97],"ports":[{"vh":35,"vw":35,"vx":225,"vy":62.71,"label":"13","side":"top"},{"vh":35,"vw":35,"vx":225,"vy":421.71,"label":"14","side":"bottom"}]},"load_beacon(1).svg":{"vb":[21.71,53.93,437.4,466.56],"ports":[{"vh":33.54,"vw":46.19,"vx":225.93,"vy":115.18,"label":"X1","side":"top"},{"vh":33.54,"vw":46.19,"vx":225.93,"vy":459.24,"label":"X2","side":"bottom"}]},"load_bell(1).svg":{"vb":[19.48,55.95,434.55,463.52],"ports":[{"vh":33.32,"vw":35.28,"vx":192.15,"vy":116.82,"label":"X1","side":"top"},{"vh":33.32,"vw":35.28,"vx":192.15,"vy":458.6,"label":"X2","side":"bottom"}]},"load_blinking_pilot_lamp(1).svg":{"vb":[0.6,55.95,434.55,463.52],"ports":[{"vh":33.32,"vw":35.18,"vx":192.37,"vy":116.82,"label":"X1","side":"top"},{"vh":33.32,"vw":35.18,"vx":192.37,"vy":458.6,"label":"X2","side":"bottom"}]},"load_buzzer(1).svg":{"vb":[12.03,52.64,437.93,467.13],"ports":[{"vh":33.59,"vw":35.3,"vx":191.16,"vy":113.96,"label":"X1","side":"top"},{"vh":33.59,"vw":35.3,"vx":191.16,"vy":458.46,"label":"X2","side":"bottom"}]},"load_light(1).svg":{"vb":[-24.84,54.85,435.68,464.72],"ports":[{"vh":33.41,"vw":35,"vx":193,"vy":115.87,"label":"X1","side":"top"},{"vh":33.41,"vw":35,"vx":193,"vy":458.55,"label":"X2","side":"bottom"}]},"main_contacts_1p_no.svg":{"vb":[118.72,54.45,440.17,469.52],"ports":[{"vh":33.94,"vw":35,"vx":352,"vy":115.15,"label":"1","side":"top"},{"vh":33.94,"vw":35,"vx":352,"vy":463.27,"label":"2","side":"bottom"}]},"main_contacts_2p_no.svg":{"vb":[161.68,53.04,444.69,474.34],"ports":[{"vh":34.29,"vw":35,"vx":297.25,"vy":114.34,"label":"1","side":"top"},{"vh":34.29,"vw":35,"vx":476.75,"vy":114.34,"label":"3","side":"top"},{"vh":34.29,"vw":35,"vx":297.25,"vy":466.08,"label":"2","side":"bottom"},{"vh":34.29,"vw":35,"vx":476.75,"vy":466.08,"label":"4","side":"bottom"}]},"main_contacts_3p_no.svg":{"vb":[119.31,145.11,482.47,472.31],"ports":[{"vh":34.14,"vw":35,"vx":184.5,"vy":206.16,"label":"1","side":"top"},{"vh":34.14,"vw":35,"vx":364,"vy":206.16,"label":"3","side":"top"},{"vh":34.14,"vw":35,"vx":543.5,"vy":206.16,"label":"5","side":"top"},{"vh":34.14,"vw":35,"vx":184.5,"vy":556.38,"label":"2","side":"bottom"},{"vh":34.14,"vw":35,"vx":364,"vy":556.38,"label":"4","side":"bottom"},{"vh":34.14,"vw":35,"vx":543.5,"vy":556.38,"label":"6","side":"bottom"}]},"main_contacts_4p_no.svg":{"vb":[34.59,48.24,661.91,471.93],"ports":[{"vh":34.12,"vw":35,"vx":99.75,"vy":109.24,"label":"1","side":"top"},{"vh":34.12,"vw":35,"vx":279.25,"vy":109.24,"label":"3","side":"top"},{"vh":34.12,"vw":35,"vx":458.75,"vy":109.24,"label":"5","side":"top"},{"vh":34.12,"vw":35,"vx":638.25,"vy":109.24,"label":"7","side":"top"},{"vh":34.12,"vw":35,"vx":99.75,"vy":459.18,"label":"2","side":"bottom"},{"vh":34.12,"vw":35,"vx":279.25,"vy":459.18,"label":"4","side":"bottom"},{"vh":34.12,"vw":35,"vx":458.75,"vy":459.18,"label":"6","side":"bottom"},{"vh":34.12,"vw":35,"vx":638.25,"vy":459.18,"label":"8","side":"bottom"}]},"protection_circuit_breaker_1p.svg":{"vb":[-38.83,52.13,442.55,472.05],"ports":[{"vh":34.13,"vw":35,"vx":195,"vy":113.15,"label":"1","side":"top"},{"vh":34.13,"vw":35,"vx":195,"vy":463.17,"label":"2","side":"bottom"}]},"protection_circuit_breaker_2p.svg":{"vb":[-29.2,49.34,441.31,470.73],"ports":[{"vh":34.03,"vw":35,"vx":114.25,"vy":110.2,"label":"1","side":"top"},{"vh":34.03,"vw":35,"vx":293.75,"vy":110.2,"label":"3","side":"top"},{"vh":34.03,"vw":35,"vx":114.25,"vy":459.22,"label":"2","side":"bottom"},{"vh":34.03,"vw":35,"vx":293.75,"vy":459.22,"label":"4","side":"bottom"}]},"protection_circuit_breaker_3p.svg":{"vb":[12.15,49.24,501.61,471.93],"ports":[{"vh":34.12,"vw":35,"vx":96.5,"vy":110.24,"label":"1","side":"top"},{"vh":34.12,"vw":35,"vx":276,"vy":110.24,"label":"3","side":"top"},{"vh":34.12,"vw":35,"vx":455.5,"vy":110.24,"label":"5","side":"top"},{"vh":34.12,"vw":35,"vx":96.5,"vy":460.18,"label":"2","side":"bottom"},{"vh":34.12,"vw":35,"vx":276,"vy":460.18,"label":"4","side":"bottom"},{"vh":34.12,"vw":35,"vx":455.5,"vy":460.18,"label":"6","side":"bottom"}]},"protection_fuse_ isolator_1p.svg":{"vb":[219.43,148.52,440.85,470.24],"ports":[{"vh":33.99,"vw":35,"vx":453.36,"vy":209.31,"label":"1","side":"top"},{"vh":33.99,"vw":35,"vx":453.36,"vy":557.97,"label":"2","side":"bottom"}]},"protection_fuse_ isolator_2p.svg":{"vb":[309.18,148.52,440.85,470.24],"ports":[{"vh":33.99,"vw":35,"vx":453.36,"vy":209.31,"label":"1","side":"top"},{"vh":33.99,"vw":35,"vx":632.86,"vy":209.31,"label":"3","side":"top"},{"vh":33.99,"vw":35,"vx":453.36,"vy":557.97,"label":"2","side":"bottom"},{"vh":33.99,"vw":35,"vx":632.86,"vy":557.97,"label":"4","side":"bottom"}]},"protection_fuse_ isolator_3p.svg":{"vb":[353.73,148.52,531.25,470.24],"ports":[{"vh":33.99,"vw":35,"vx":453.36,"vy":209.31,"label":"1","side":"top"},{"vh":33.99,"vw":35,"vx":632.86,"vy":209.31,"label":"3","side":"top"},{"vh":33.99,"vw":35,"vx":812.36,"vy":209.31,"label":"5","side":"top"},{"vh":33.99,"vw":35,"vx":453.36,"vy":557.97,"label":"2","side":"bottom"},{"vh":33.99,"vw":35,"vx":632.86,"vy":557.97,"label":"4","side":"bottom"},{"vh":33.99,"vw":35,"vx":812.36,"vy":557.96,"label":"6","side":"bottom"}]},"protection_fuse_ isolator_4p.svg":{"vb":[353.73,148.52,716.96,470.24],"ports":[{"vh":33.99,"vw":35,"vx":453.36,"vy":209.31,"label":"1","side":"top"},{"vh":33.99,"vw":35,"vx":632.86,"vy":209.31,"label":"3","side":"top"},{"vh":33.99,"vw":35,"vx":812.36,"vy":209.31,"label":"5","side":"top"},{"vh":33.99,"vw":35,"vx":998.07,"vy":209.31,"label":"7","side":"top"},{"vh":33.99,"vw":35,"vx":453.36,"vy":557.97,"label":"2","side":"bottom"},{"vh":33.99,"vw":35,"vx":632.86,"vy":557.97,"label":"4","side":"bottom"},{"vh":33.99,"vw":35,"vx":812.36,"vy":557.96,"label":"6","side":"bottom"},{"vh":33.99,"vw":35,"vx":998.07,"vy":557.96,"label":"8","side":"bottom"}]},"protection_fuse_1p.svg":{"vb":[4.04,51.66,437.92,467.11],"ports":[{"vh":33.76,"vw":35,"vx":223,"vy":112.06,"label":"1","side":"top"},{"vh":33.76,"vw":35,"vx":223,"vy":458.36,"label":"2","side":"bottom"}]},"protection_fuse_2p.svg":{"vb":[-1.86,0.22,453.72,483.97],"ports":[{"vh":35,"vw":35,"vx":126.3,"vy":62.71,"label":"1","side":"top"},{"vh":35,"vw":35,"vx":323.7,"vy":62.71,"label":"3","side":"top"},{"vh":35,"vw":35,"vx":126.3,"vy":421.71,"label":"2","side":"bottom"},{"vh":35,"vw":35,"vx":323.7,"vy":421.71,"label":"4","side":"bottom"}]},"protection_fuse_3p.svg":{"vb":[40.04,51.45,497.92,469.52],"ports":[{"vh":33.94,"vw":35,"vx":109.5,"vy":112.15,"label":"1","side":"top"},{"vh":33.94,"vw":35,"vx":289,"vy":112.15,"label":"3","side":"top"},{"vh":33.94,"vw":35,"vx":468.5,"vy":112.15,"label":"5","side":"top"},{"vh":33.94,"vw":35,"vx":109.5,"vy":460.27,"label":"2","side":"bottom"},{"vh":33.94,"vw":35,"vx":289,"vy":460.27,"label":"4","side":"bottom"},{"vh":33.94,"vw":35,"vx":468.5,"vy":460.27,"label":"6","side":"bottom"}]},"protection_fuse_4p.svg":{"vb":[27.46,50.12,677.57,470.44],"ports":[{"vh":34.01,"vw":35,"vx":97,"vy":110.93,"label":"1","side":"top"},{"vh":34.01,"vw":35,"vx":276.5,"vy":110.93,"label":"3","side":"top"},{"vh":34.01,"vw":35,"vx":456,"vy":110.93,"label":"5","side":"top"},{"vh":34.01,"vw":35,"vx":635.5,"vy":110.93,"label":"7","side":"top"},{"vh":34.01,"vw":35,"vx":97,"vy":459.74,"label":"2","side":"bottom"},{"vh":34.01,"vw":35,"vx":276.5,"vy":459.74,"label":"4","side":"bottom"},{"vh":34.01,"vw":35,"vx":456,"vy":459.74,"label":"6","side":"bottom"},{"vh":34.01,"vw":35,"vx":635.5,"vy":459.74,"label":"8","side":"bottom"}]},"protection_motor_circuit_breaker_2p.svg":{"vb":[344.18,21.86,866.43,924.19],"ports":[{"vh":67.32,"vw":61.13,"vx":692.69,"vy":138.69,"label":"1","side":"top"},{"vh":67.32,"vw":61.13,"vx":1006.19,"vy":138.69,"label":"3","side":"top"},{"vh":67.32,"vw":61.13,"vx":692.69,"vy":829.21,"label":"2","side":"bottom"},{"vh":67.32,"vw":61.13,"vx":1006.19,"vy":829.21,"label":"4","side":"bottom"}]},"protection_motor_circuit_breaker_3p.svg":{"vb":[340.09,131.53,512.32,411.37],"ports":[{"vh":29.67,"vw":32.4,"vx":459,"vy":185.05,"label":"1","side":"top"},{"vh":29.67,"vw":32.4,"vx":625.18,"vy":185.05,"label":"3","side":"top"},{"vh":29.67,"vw":32.4,"vx":791.36,"vy":185.05,"label":"5","side":"top"},{"vh":29.67,"vw":32.4,"vx":459,"vy":489.38,"label":"2","side":"bottom"},{"vh":29.67,"vw":32.4,"vx":625.18,"vy":489.38,"label":"4","side":"bottom"},{"vh":29.67,"vw":32.4,"vx":791.35,"vy":489.38,"label":"6","side":"bottom"}]},"protection_thermal_overload_relay_2p.svg":{"vb":[8.51,53.59,438.98,468.24],"ports":[{"vh":33.85,"vw":35,"vx":138.25,"vy":114.13,"label":"1","side":"top"},{"vh":33.85,"vw":35,"vx":317.75,"vy":114.13,"label":"3","side":"top"},{"vh":33.85,"vw":35,"vx":138.25,"vy":461.29,"label":"2","side":"bottom"},{"vh":33.85,"vw":35,"vx":317.75,"vy":461.29,"label":"4","side":"bottom"}]},"protection_thermal_overload_relay_3p.svg":{"vb":[-3.22,0.22,546.44,483.97],"ports":[{"vh":35,"vw":35,"vx":90.5,"vy":62.71,"label":"1","side":"top"},{"vh":35,"vw":35,"vx":270,"vy":62.71,"label":"3","side":"top"},{"vh":35,"vw":35,"vx":449.5,"vy":62.71,"label":"5","side":"top"},{"vh":35,"vw":35,"vx":90.5,"vy":421.71,"label":"2","side":"bottom"},{"vh":35,"vw":35,"vx":270,"vy":421.71,"label":"4","side":"bottom"},{"vh":35,"vw":35,"vx":449.5,"vy":421.71,"label":"6","side":"bottom"}]},"motor_dc_motor(1).svg":{"vb":[12.29,-56.73,650.76,694.14],"ports":[{"vh":59.01,"vw":59.49,"vx":194.1,"vy":36.23,"label":"A1","side":"top"},{"vh":59,"vw":59.49,"vx":484.09,"vy":35.98,"label":"A2","side":"top"}]},"motor_single_phase(1).svg":{"vb":[-6.78,-57.05,661.24,705.32],"ports":[{"vh":60.67,"vw":55.54,"vx":183.38,"vy":37.47,"label":"U","side":"top"},{"vh":60.67,"vw":55.54,"vx":373.8,"vy":37.47,"label":"V","side":"top"},{"vh":60.67,"vw":55.54,"vx":564.21,"vy":37.47,"label":"PE","side":"top"}]},"motor_three_phase(1).svg":{"vb":[32.85,33.3,793.24,696.71],"ports":[{"vh":59.03,"vw":60.06,"vx":126.53,"vy":126.31,"label":"U","side":"top"},{"vh":59.03,"vw":60.06,"vx":332.42,"vy":126.31,"label":"V","side":"top"},{"vh":59.03,"vw":60.06,"vx":538.31,"vy":126.31,"label":"W","side":"top"},{"vh":59,"vw":60.04,"vx":737.33,"vy":126.24,"label":"PE","side":"top"}]},"motor_three_phase1.svg":{"vb":[-2.43,-2.59,454.86,485.18],"ports":[{"vh":35,"vw":35,"vx":105,"vy":60,"label":"U1","side":"top"},{"vh":35,"vw":35,"vx":225,"vy":60,"label":"V1","side":"top"},{"vh":35,"vw":35,"vx":345,"vy":60,"label":"W1","side":"top"},{"vh":35,"vw":35,"vx":105,"vy":420,"label":"W2","side":"bottom"},{"vh":35,"vw":35,"vx":225,"vy":420,"label":"U2","side":"bottom"},{"vh":35,"vw":35,"vx":345,"vy":420,"label":"V2","side":"bottom"}]},"motor_three_phase_star_delta(1).svg":{"vb":[50.48,36.27,655.74,699.46],"ports":[{"vh":50.69,"vw":47.26,"vx":137.45,"vy":125.29,"label":"U1","side":"top"},{"vh":50.69,"vw":47.26,"vx":299.49,"vy":125.29,"label":"V1","side":"top"},{"vh":50.69,"vw":47.26,"vx":461.52,"vy":125.29,"label":"W1","side":"top"},{"vh":50.69,"vw":47.26,"vx":623.55,"vy":125.29,"label":"PE","side":"top"},{"vh":50.69,"vw":47.26,"vx":137.45,"vy":646.7,"label":"W2","side":"bottom"},{"vh":50.69,"vw":47.26,"vx":299.49,"vy":646.7,"label":"U2","side":"bottom"},{"vh":50.69,"vw":47.26,"vx":461.52,"vy":646.7,"label":"V2","side":"bottom"}]},"proximity_sensor_npn_nc(1).svg":{"vb":[-45.55,-47.41,688.81,586.56],"ports":[{"vx":566.22,"vy":69.38,"vw":54.24,"vh":71.37,"label":"BN","side":"right"},{"vx":566.22,"vy":191.74,"vw":54.24,"vh":71.37,"label":"BK","side":"right"},{"vx":566.22,"vy":314.1,"vw":54.24,"vh":71.37,"label":"BU","side":"right"}]},"proximity_sensor_npn_no(1).svg":{"vb":[-45.61,-44.67,686.93,576.21],"ports":[{"vx":565.12,"vy":70.13,"vw":54.22,"vh":70.08,"label":"BN","side":"right"},{"vx":565.12,"vy":190.27,"vw":54.22,"vh":70.08,"label":"BK","side":"right"},{"vx":565.12,"vy":310.41,"vw":54.22,"vh":70.08,"label":"BU","side":"right"}]}};
const ESC_COMP_W = 120, ESC_COMP_H = 90, ESC_COMP_CX = 60, ESC_COMP_CY = 45;
const ESC_ART_X = 15, ESC_ART_Y = 13, ESC_ART_W = 90, ESC_ART_H = 63;

function getSvgCatalogEntry(typeOrFile) {
  let raw = String(typeOrFile || ''); try { raw = decodeURIComponent(raw); } catch (_) {} const asset = raw.split(/[\\/]/).pop().split('?')[0].toLowerCase();
  return SVG_TERMINAL_CATALOG[asset] || null;
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
 const embeddedSymbolManifest = {"project":"ELECTRICAL SIMU CKT","count":58,"symbols":[{"file":"components/Power/earth_ground.svg","name":"Earth Ground","category":"Sources","original_filename":"earth_ground.svg","type":"Earth Ground"},{"file":"components/Power/earth_pe.svg","name":"Earth PE","category":"Sources","original_filename":"earth_pe.svg","type":"Earth PE"},{"file":"components/Power/source_dc_negative.svg","name":"Source DC Negative","category":"Sources","original_filename":"source_dc_negative.svg","type":"Source DC Negative"},{"file":"components/Power/source_dc_positive.svg","name":"Source DC Positive","category":"Sources","original_filename":"source_dc_positive.svg","type":"Source DC Positive"},{"file":"components/Power/source_dc_supply_pair.svg","name":"Source DC Supply Pair","category":"Sources","original_filename":"source_dc_supply_pair.svg","type":"Source DC Supply Pair"},{"file":"components/Power/terminal_l1_l2_l3.svg","name":"Terminal L1 L2 L3","category":"Sources","original_filename":"terminal_l1_l2_l3.svg","type":"Terminal L1 L2 L3"},{"file":"components/Power/terminal_l1_l2_l3_n.svg","name":"Terminal L1 L2 L3 N","category":"Sources","original_filename":"terminal_l1_l2_l3_n.svg","type":"Terminal L1 L2 L3 N"},{"file":"components/Power/terminal_neutral_n.svg","name":"Terminal Neutral N","category":"Sources","original_filename":"terminal_neutral_n.svg","type":"Terminal Neutral N"},{"file":"components/Power/terminal_phase_l.svg","name":"Terminal Phase L","category":"Sources","original_filename":"terminal_phase_l.svg","type":"Terminal Phase L"},{"file":"components/Coils/coil_contactor(1).svg","name":"Contactor Coil","category":"Coils","original_filename":"coil_contactor(1).svg","type":"Contactor Coil"},{"file":"components/Coils/coil_tof_timer(1).svg","name":"TOF Timer Coil","category":"Coils","original_filename":"coil_tof_timer(1).svg","type":"TOF Timer Coil"},{"file":"components/Coils/coil_ton_timer(1).svg","name":"TON Timer Coil","category":"Coils","original_filename":"coil_ton_timer(1).svg","type":"TON Timer Coil"},{"file":"components/Coils/coil_ton_tof_timer(1).svg","name":"TON/TOF Timer Coil","category":"Coils","original_filename":"coil_ton_tof_timer(1).svg","type":"TON/TOF Timer Coil"},{"file":"components/Auxiliary Contacts/aux_contacts_nc.svg","name":"Aux Contacts NC","category":"Auxiliary Contacts","original_filename":"aux_contacts_nc.svg","type":"Aux Contacts NC"},{"file":"components/Auxiliary Contacts/aux_contacts_no.svg","name":"Aux Contacts NO","category":"Auxiliary Contacts","original_filename":"aux_contacts_no.svg","type":"Aux Contacts NO"},{"file":"components/Auxiliary Contacts/aux_contacts_off_delay _nc.svg","name":"Aux Contacts Off Delay NC","category":"Auxiliary Contacts","original_filename":"aux_contacts_off_delay _nc.svg","type":"Aux Contacts Off Delay NC"},{"file":"components/Auxiliary Contacts/aux_contacts_off_delay _no.svg","name":"Aux Contacts Off Delay NO","category":"Auxiliary Contacts","original_filename":"aux_contacts_off_delay _no.svg","type":"Aux Contacts Off Delay NO"},{"file":"components/Auxiliary Contacts/aux_contacts_on_delay _nc.svg","name":"Aux Contacts On Delay NC","category":"Auxiliary Contacts","original_filename":"aux_contacts_on_delay _nc.svg","type":"Aux Contacts On Delay NC"},{"file":"components/Auxiliary Contacts/aux_contacts_on_delay _no.svg","name":"Aux Contacts On Delay NO","category":"Auxiliary Contacts","original_filename":"aux_contacts_on_delay _no.svg","type":"Aux Contacts On Delay NO"},{"file":"components/Switches/switch_3_position_selector I-0-II.svg","name":"3-Position Selector Switch I-0-II","category":"Switches","original_filename":"switch_3_position_selector I-0-II.svg","type":"3-Position Selector Switch I-0-II"},{"file":"components/Switches/switch_3_position_selector I-II-III.svg","name":"3-Position Selector Switch I-II-III","category":"Switches","original_filename":"switch_3_position_selector I-II-III.svg","type":"3-Position Selector Switch I-II-III"},{"file":"components/Switches/switch_con.svg","name":"Switch Changeover (CON)","category":"Switches","original_filename":"switch_con.svg","type":"Switch Changeover (CON)"},{"file":"components/Switches/switch_nc.svg","name":"Switch NC","category":"Switches","original_filename":"switch_nc.svg","type":"Switch NC"},{"file":"components/Switches/switch_no.svg","name":"Switch NO","category":"Switches","original_filename":"switch_no.svg","type":"Switch NO"},{"file":"components/Switches/switch_pushbutton_con.svg","name":"Pushbutton Changeover (CON)","category":"Switches","original_filename":"switch_pushbutton_con.svg","type":"Pushbutton Changeover (CON)"},{"file":"components/Switches/switch_pushbutton_nc.svg","name":"Pushbutton NC","category":"Switches","original_filename":"switch_pushbutton_nc.svg","type":"Pushbutton NC"},{"file":"components/Switches/switch_pushbutton_no.svg","name":"Pushbutton NO","category":"Switches","original_filename":"switch_pushbutton_no.svg","type":"Pushbutton NO"},{"file":"components/Loads/load_beacon(1).svg","name":"Beacon","category":"Loads","original_filename":"load_beacon(1).svg","type":"Beacon"},{"file":"components/Loads/load_bell(1).svg","name":"Bell","category":"Loads","original_filename":"load_bell(1).svg","type":"Bell"},{"file":"components/Loads/load_blinking_pilot_lamp(1).svg","name":"Blinking Pilot Lamp","category":"Loads","original_filename":"load_blinking_pilot_lamp(1).svg","type":"Blinking Pilot Lamp"},{"file":"components/Loads/load_buzzer(1).svg","name":"Buzzer","category":"Loads","original_filename":"load_buzzer(1).svg","type":"Buzzer"},{"file":"components/Loads/load_light(1).svg","name":"Pilot Light","category":"Loads","original_filename":"load_light(1).svg","type":"Pilot Light"},{"file":"components/Main Contacts/main_contacts_1p_no.svg","name":"Main Contacts 1P NO","category":"Main Contacts","original_filename":"main_contacts_1p_no.svg","type":"Main Contacts 1P NO"},{"file":"components/Main Contacts/main_contacts_2p_no.svg","name":"Main Contacts 2P NO","category":"Main Contacts","original_filename":"main_contacts_2p_no.svg","type":"Main Contacts 2P NO"},{"file":"components/Main Contacts/main_contacts_3p_no.svg","name":"Main Contacts 3P NO","category":"Main Contacts","original_filename":"main_contacts_3p_no.svg","type":"Main Contacts 3P NO"},{"file":"components/Main Contacts/main_contacts_4p_no.svg","name":"Main Contacts 4P NO","category":"Main Contacts","original_filename":"main_contacts_4p_no.svg","type":"Main Contacts 4P NO"},{"file":"components/Protections/protection_circuit_breaker_1p.svg","name":"Circuit Breaker 1P","category":"Protections","original_filename":"protection_circuit_breaker_1p.svg","type":"Circuit Breaker 1P"},{"file":"components/Protections/protection_circuit_breaker_2p.svg","name":"Circuit Breaker 2P","category":"Protections","original_filename":"protection_circuit_breaker_2p.svg","type":"Circuit Breaker 2P"},{"file":"components/Protections/protection_circuit_breaker_3p.svg","name":"Circuit Breaker 3P","category":"Protections","original_filename":"protection_circuit_breaker_3p.svg","type":"Circuit Breaker 3P"},{"file":"components/Protections/protection_fuse_ isolator_1p.svg","name":"Fuse Isolator 1P","category":"Protections","original_filename":"protection_fuse_ isolator_1p.svg","type":"Fuse Isolator 1P"},{"file":"components/Protections/protection_fuse_ isolator_2p.svg","name":"Fuse Isolator 2P","category":"Protections","original_filename":"protection_fuse_ isolator_2p.svg","type":"Fuse Isolator 2P"},{"file":"components/Protections/protection_fuse_ isolator_3p.svg","name":"Fuse Isolator 3P","category":"Protections","original_filename":"protection_fuse_ isolator_3p.svg","type":"Fuse Isolator 3P"},{"file":"components/Protections/protection_fuse_ isolator_4p.svg","name":"Fuse Isolator 4P","category":"Protections","original_filename":"protection_fuse_ isolator_4p.svg","type":"Fuse Isolator 4P"},{"file":"components/Protections/protection_fuse_1p.svg","name":"Fuse 1P","category":"Protections","original_filename":"protection_fuse_1p.svg","type":"Fuse 1P"},{"file":"components/Protections/protection_fuse_2p.svg","name":"Fuse 2P","category":"Protections","original_filename":"protection_fuse_2p.svg","type":"Fuse 2P"},{"file":"components/Protections/protection_fuse_3p.svg","name":"Fuse 3P","category":"Protections","original_filename":"protection_fuse_3p.svg","type":"Fuse 3P"},{"file":"components/Protections/protection_fuse_4p.svg","name":"Fuse 4P","category":"Protections","original_filename":"protection_fuse_4p.svg","type":"Fuse 4P"},{"file":"components/Protections/protection_motor_circuit_breaker_2p.svg","name":"Motor Circuit Breaker 2P","category":"Protections","original_filename":"protection_motor_circuit_breaker_2p.svg","type":"Motor Circuit Breaker 2P"},{"file":"components/Protections/protection_motor_circuit_breaker_3p.svg","name":"Motor Circuit Breaker 3P","category":"Protections","original_filename":"protection_motor_circuit_breaker_3p.svg","type":"Motor Circuit Breaker 3P"},{"file":"components/Protections/protection_thermal_overload_relay_2p.svg","name":"Thermal Overload Relay 2P","category":"Protections","original_filename":"protection_thermal_overload_relay_2p.svg","type":"Thermal Overload Relay 2P"},{"file":"components/Protections/protection_thermal_overload_relay_3p.svg","name":"Thermal Overload Relay 3P","category":"Protections","original_filename":"protection_thermal_overload_relay_3p.svg","type":"Thermal Overload Relay 3P"},{"file":"components/Motors/motor_dc_motor(1).svg","name":"DC Motor","category":"Motors","original_filename":"motor_dc_motor(1).svg","type":"DC Motor"},{"file":"components/Motors/motor_single_phase(1).svg","name":"Single-Phase Motor","category":"Motors","original_filename":"motor_single_phase(1).svg","type":"Single-Phase Motor"},{"file":"components/Motors/motor_three_phase(1).svg","name":"Three-Phase Motor","category":"Motors","original_filename":"motor_three_phase(1).svg","type":"Three-Phase Motor"},{"file":"components/Motors/motor_three_phase1.svg","name":"Three-Phase Motor (6-Terminal)","category":"Motors","original_filename":"motor_three_phase1.svg","type":"Three-Phase Motor (6-Terminal)"},{"file":"components/Motors/motor_three_phase_star_delta(1).svg","name":"Three-Phase Star-Delta Motor","category":"Motors","original_filename":"motor_three_phase_star_delta(1).svg","type":"Three-Phase Star-Delta Motor"},{"file":"components/Proximity Sensor/proximity_sensor_npn_nc(1).svg","name":"Proximity Sensor NPN NC","category":"Proximity Sensor","original_filename":"proximity_sensor_npn_nc(1).svg","type":"Proximity Sensor NPN NC"},{"file":"components/Proximity Sensor/proximity_sensor_npn_no(1).svg","name":"Proximity Sensor NPN NO","category":"Proximity Sensor","original_filename":"proximity_sensor_npn_no(1).svg","type":"Proximity Sensor NPN NO"}]};
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
const SVG_INLINE_CATALOG = {"earth_ground.svg":{"vb":"0 0 450 480","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <line fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" x1=\"225\" y1=\"22\" x2=\"225\" y2=\"373\" id=\"svg_10\"/>\n  <line fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" x1=\"78\" y1=\"376\" x2=\"372\" y2=\"376\" id=\"svg_1\"/>\n  <line fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" x1=\"143\" y1=\"408\" x2=\"307\" y2=\"408\" id=\"svg_2\"/>\n  <line fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" x1=\"175\" y1=\"437\" x2=\"275\" y2=\"437\" id=\"svg_3\"/>\n </g>"},"earth_pe.svg":{"vb":"0 0 450 480","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <ellipse fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" cx=\"225\" cy=\"120\" rx=\"71\" ry=\"71\"/>\n  <line fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" x1=\"225\" y1=\"190\" x2=\"225\" y2=\"400\"/>\n  <path fill=\"#666666\" stroke=\"#666666\" stroke-width=\"10\" d=\"m207.5,412.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\"/>\n  <text fill=\"#666666\" stroke=\"#666666\" stroke-width=\"0\" x=\"225\" y=\"143\" font-size=\"62\" font-family=\"Sans-serif\" text-anchor=\"middle\" font-weight=\"normal\">PE</text>\n </g>"},"source_dc_negative.svg":{"vb":"0 0 450 480","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <ellipse fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" cx=\"225\" cy=\"120\" rx=\"71\" ry=\"71\"/>\n  <line fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" x1=\"225\" y1=\"190\" x2=\"225\" y2=\"400\"/>\n  <path fill=\"#666666\" stroke=\"#666666\" stroke-width=\"10\" d=\"m207.5,412.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\"/>\n  <line fill=\"none\" stroke=\"#666666\" stroke-width=\"12\" x1=\"174\" y1=\"120\" x2=\"276\" y2=\"120\"/>\n </g>"},"source_dc_positive.svg":{"vb":"0 0 450 480","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <ellipse fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" cx=\"225\" cy=\"120\" rx=\"71\" ry=\"71\"/>\n  <line fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" x1=\"225\" y1=\"190\" x2=\"225\" y2=\"400\"/>\n  <path fill=\"#666666\" stroke=\"#666666\" stroke-width=\"10\" d=\"m207.5,412.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\"/>\n  <line fill=\"none\" stroke=\"#666666\" stroke-width=\"12\" x1=\"174\" y1=\"120\" x2=\"276\" y2=\"120\"/>\n  <line fill=\"none\" stroke=\"#666666\" stroke-width=\"12\" x1=\"225\" y1=\"69\" x2=\"225\" y2=\"171\"/>\n </g>"},"source_dc_supply_pair.svg":{"vb":"0 0 520 480","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <ellipse fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" cx=\"165\" cy=\"120\" rx=\"71\" ry=\"71\"/>\n  <line fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" x1=\"165\" y1=\"190\" x2=\"165\" y2=\"400\"/>\n  <path fill=\"#666666\" stroke=\"#666666\" stroke-width=\"10\" d=\"m147.5,412.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\"/>\n  <line fill=\"none\" stroke=\"#666666\" stroke-width=\"12\" x1=\"114\" y1=\"120\" x2=\"216\" y2=\"120\"/>\n  <line fill=\"none\" stroke=\"#666666\" stroke-width=\"12\" x1=\"165\" y1=\"69\" x2=\"165\" y2=\"171\"/>\n  <ellipse fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" cx=\"355\" cy=\"120\" rx=\"71\" ry=\"71\"/>\n  <line fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" x1=\"355\" y1=\"190\" x2=\"355\" y2=\"400\"/>\n  <path fill=\"#666666\" stroke=\"#666666\" stroke-width=\"10\" d=\"m337.5,412.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\"/>\n  <line fill=\"none\" stroke=\"#666666\" stroke-width=\"12\" x1=\"304\" y1=\"120\" x2=\"406\" y2=\"120\"/>\n </g>"},"terminal_l1_l2_l3.svg":{"vb":"0 0 580 480","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <ellipse fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" cx=\"105\" cy=\"120\" rx=\"71\" ry=\"71\"/>\n  <line fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" x1=\"105\" y1=\"190\" x2=\"105\" y2=\"400\"/>\n  <path fill=\"#666666\" stroke=\"#666666\" stroke-width=\"10\" d=\"m87.5,412.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\"/>\n  <text fill=\"#666666\" stroke=\"#666666\" stroke-width=\"0\" x=\"105\" y=\"143\" font-size=\"62\" font-family=\"Sans-serif\" text-anchor=\"middle\" font-weight=\"normal\">L1</text>\n  <ellipse fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" cx=\"290\" cy=\"120\" rx=\"71\" ry=\"71\"/>\n  <line fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" x1=\"290\" y1=\"190\" x2=\"290\" y2=\"400\"/>\n  <path fill=\"#666666\" stroke=\"#666666\" stroke-width=\"10\" d=\"m272.5,412.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\"/>\n  <text fill=\"#666666\" stroke=\"#666666\" stroke-width=\"0\" x=\"290\" y=\"143\" font-size=\"62\" font-family=\"Sans-serif\" text-anchor=\"middle\" font-weight=\"normal\">L2</text>\n  <ellipse fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" cx=\"475\" cy=\"120\" rx=\"71\" ry=\"71\"/>\n  <line fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" x1=\"475\" y1=\"190\" x2=\"475\" y2=\"400\"/>\n  <path fill=\"#666666\" stroke=\"#666666\" stroke-width=\"10\" d=\"m457.5,412.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\"/>\n  <text fill=\"#666666\" stroke=\"#666666\" stroke-width=\"0\" x=\"475\" y=\"143\" font-size=\"62\" font-family=\"Sans-serif\" text-anchor=\"middle\" font-weight=\"normal\">L3</text>\n </g>"},"terminal_l1_l2_l3_n.svg":{"vb":"0 0 720 480","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <ellipse fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" cx=\"96\" cy=\"120\" rx=\"71\" ry=\"71\"/>\n  <line fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" x1=\"96\" y1=\"190\" x2=\"96\" y2=\"400\"/>\n  <path fill=\"#666666\" stroke=\"#666666\" stroke-width=\"10\" d=\"m78.5,412.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\"/>\n  <text fill=\"#666666\" stroke=\"#666666\" stroke-width=\"0\" x=\"96\" y=\"143\" font-size=\"62\" font-family=\"Sans-serif\" text-anchor=\"middle\" font-weight=\"normal\">L1</text>\n  <ellipse fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" cx=\"272\" cy=\"120\" rx=\"71\" ry=\"71\"/>\n  <line fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" x1=\"272\" y1=\"190\" x2=\"272\" y2=\"400\"/>\n  <path fill=\"#666666\" stroke=\"#666666\" stroke-width=\"10\" d=\"m254.5,412.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\"/>\n  <text fill=\"#666666\" stroke=\"#666666\" stroke-width=\"0\" x=\"272\" y=\"143\" font-size=\"62\" font-family=\"Sans-serif\" text-anchor=\"middle\" font-weight=\"normal\">L2</text>\n  <ellipse fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" cx=\"448\" cy=\"120\" rx=\"71\" ry=\"71\"/>\n  <line fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" x1=\"448\" y1=\"190\" x2=\"448\" y2=\"400\"/>\n  <path fill=\"#666666\" stroke=\"#666666\" stroke-width=\"10\" d=\"m430.5,412.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\"/>\n  <text fill=\"#666666\" stroke=\"#666666\" stroke-width=\"0\" x=\"448\" y=\"143\" font-size=\"62\" font-family=\"Sans-serif\" text-anchor=\"middle\" font-weight=\"normal\">L3</text>\n  <ellipse fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" cx=\"624\" cy=\"120\" rx=\"71\" ry=\"71\"/>\n  <line fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" x1=\"624\" y1=\"190\" x2=\"624\" y2=\"400\"/>\n  <path fill=\"#666666\" stroke=\"#666666\" stroke-width=\"10\" d=\"m606.5,412.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\"/>\n  <text fill=\"#666666\" stroke=\"#666666\" stroke-width=\"0\" x=\"624\" y=\"143\" font-size=\"66\" font-family=\"Sans-serif\" text-anchor=\"middle\" font-weight=\"bold\">N</text>\n </g>"},"terminal_neutral_n.svg":{"vb":"0 0 450 480","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <ellipse fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" cx=\"225\" cy=\"120\" rx=\"71\" ry=\"71\"/>\n  <line fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" x1=\"225\" y1=\"190\" x2=\"225\" y2=\"400\"/>\n  <path fill=\"#666666\" stroke=\"#666666\" stroke-width=\"10\" d=\"m207.5,412.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\"/>\n  <text fill=\"#666666\" stroke=\"#666666\" stroke-width=\"0\" x=\"225\" y=\"143\" font-size=\"66\" font-family=\"Sans-serif\" text-anchor=\"middle\" font-weight=\"bold\">N</text>\n </g>"},"terminal_phase_l.svg":{"vb":"0 0 450 480","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <ellipse fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" cx=\"225\" cy=\"120\" rx=\"71\" ry=\"71\"/>\n  <line fill=\"none\" stroke=\"#666666\" stroke-width=\"13\" x1=\"225\" y1=\"190\" x2=\"225\" y2=\"400\"/>\n  <path fill=\"#666666\" stroke=\"#666666\" stroke-width=\"10\" d=\"m207.5,412.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\"/>\n  <text fill=\"#666666\" stroke=\"#666666\" stroke-width=\"0\" x=\"225\" y=\"143\" font-size=\"66\" font-family=\"Sans-serif\" text-anchor=\"middle\" font-weight=\"bold\">L</text>\n </g>"},"coil_contactor(1).svg":{"vb":"-26.96 53.65 437.93 467.13","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Top terminal node (12-sided polygon) -->\n  <!-- Top vertical stem -->\n  <!-- Standard Contactor/Relay Coil Main Rectangle (exact 144x72 centerline proportion matching image_c9e202.png) -->\n  <!-- Bottom vertical stem -->\n  <!-- Bottom terminal node (12-sided polygon) -->\n  <path d=\"m207.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.0137 0 0 0.959596 -36.0822 54.7863)\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.0137 0 0 0.959596 -36.0822 54.7863)\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"204\"/>\n  <rect fill=\"none\" height=\"72\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.0137 0 0 0.959596 -36.0822 54.7863)\" width=\"144\" x=\"153\" y=\"204\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.0137 0 0 0.959596 -36.0822 54.7863)\" x1=\"225\" x2=\"225\" y1=\"276\" y2=\"405\"/>\n  <path d=\"m207.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.0137 0 0 0.959596 -36.0822 54.7863)\"/>\n </g>"},"coil_tof_timer(1).svg":{"vb":"-25.4 52.75 436.8 465.92","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Top terminal node (12-sided polygon) -->\n  <!-- Top vertical stem -->\n  <!-- Off-Delay Timer Coil Main Rectangle (exact 144x72 centerline proportion matching image_cb4662.png) -->\n  <!-- Left Solid Shaded Section (x=153 to x=198, leaving exact proportional gap to stem at x=225) -->\n  <!-- Vertical Divider on Right of Shaded Section (x=198) -->\n  <!-- Bottom vertical stem -->\n  <!-- Bottom terminal node (12-sided polygon) -->\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.957071 -32 53.8979)\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"204\"/>\n  <line fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.957071 -32 53.8979)\" x1=\"225\" x2=\"225\" y1=\"276\" y2=\"405\"/>\n  <path d=\"m207.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.957071 -32 53.8979)\"/>\n  <rect fill=\"none\" height=\"72\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.957071 -32 53.8979)\" width=\"144\" x=\"153\" y=\"204\"/>\n  <rect fill=\"#666666\" height=\"72\" id=\"svg_4\" transform=\"matrix(1 0 0 0.957071 -32 53.8979)\" width=\"45\" x=\"153\" y=\"204\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.957071 -32 53.8979)\" x1=\"198\" x2=\"198\" y1=\"204\" y2=\"276\"/>\n  <path d=\"m207.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.957071 -32 53.8979)\"/>\n </g>"},"coil_ton_timer(1).svg":{"vb":"-24.97 52.65 437.93 467.13","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Top terminal node (12-sided polygon) -->\n  <!-- Top vertical stem -->\n  <!-- On-Delay Timer Coil Main Rectangle (exact 144x72 centerline proportion matching Screenshot 2026-10-15 144829.png) -->\n  <!-- Vertical Divider on Right of X Section (x=198, leaving exact proportional gap to stem at x=225) -->\n  <!-- \"X\" Cross inside Left Section (x=153 to x=198, y=204 to y=276) -->\n  <!-- Bottom vertical stem -->\n  <!-- Bottom terminal node (12-sided polygon) -->\n  <path d=\"m207.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.959596 -31 53.7863)\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.959596 -31 53.7863)\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"204\"/>\n  <rect fill=\"none\" height=\"72\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.959596 -31 53.7863)\" width=\"144\" x=\"153\" y=\"204\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.959596 -31 53.7863)\" x1=\"198\" x2=\"198\" y1=\"204\" y2=\"276\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"7.5\" transform=\"matrix(1 0 0 0.959596 -31 53.7863)\" x1=\"153\" x2=\"198\" y1=\"204\" y2=\"276\"/>\n  <line fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"7.5\" transform=\"matrix(1 0 0 0.959596 -31 53.7863)\" x1=\"198\" x2=\"153\" y1=\"204\" y2=\"276\"/>\n  <line fill=\"none\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.959596 -31 53.7863)\" x1=\"225\" x2=\"225\" y1=\"276\" y2=\"405\"/>\n  <path d=\"m207.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.959596 -31 53.7863)\"/>\n </g>"},"coil_ton_tof_timer(1).svg":{"vb":"-26.92 52.7 437.84 467.03","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Top terminal node (12-sided polygon) -->\n  <!-- Top vertical stem -->\n  <!-- Timer Coil Main Rectangle (exact 234x72 centerline proportion matching image_c969df.png) -->\n  <!-- Left Solid Shaded Section (x=108 to x=151) -->\n  <!-- Divider between Shaded Section and X Section (x=151) -->\n  <!-- Divider on Right of X Section (x=196, leaving exact proportional gap to stem at x=225) -->\n  <!-- \"X\" Cross inside Second Section (x=151 to x=196, y=204 to y=276) -->\n  <!-- Bottom vertical stem -->\n  <!-- Bottom terminal node (12-sided polygon) -->\n  <path d=\"m174.5,94.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.959391 0 19.2979)\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.959391 0 19.2979)\" x1=\"192\" x2=\"192\" y1=\"111\" y2=\"240\"/>\n  <rect fill=\"none\" height=\"72\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.959391 0 19.2979)\" width=\"234\" x=\"75\" y=\"240\"/>\n  <rect fill=\"#666666\" height=\"72\" id=\"svg_4\" transform=\"matrix(1 0 0 0.959391 0 19.2979)\" width=\"43\" x=\"75\" y=\"240\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.959391 0 19.2979)\" x1=\"118\" x2=\"118\" y1=\"240\" y2=\"312\"/>\n  <line fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.959391 0 19.2979)\" x1=\"163\" x2=\"163\" y1=\"240\" y2=\"312\"/>\n  <line fill=\"none\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"7.5\" transform=\"matrix(1 0 0 0.959391 0 19.2979)\" x1=\"118\" x2=\"163\" y1=\"240\" y2=\"312\"/>\n  <line fill=\"none\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"7.5\" transform=\"matrix(1 0 0 0.959391 0 19.2979)\" x1=\"163\" x2=\"118\" y1=\"240\" y2=\"312\"/>\n  <line fill=\"none\" id=\"svg_9\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.959391 0 19.2979)\" x1=\"192\" x2=\"192\" y1=\"312\" y2=\"441\"/>\n  <path d=\"m174.5,453.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.959391 0 19.2979)\"/>\n </g>"},"aux_contacts_nc.svg":{"vb":"-3.33 52.62 436.93 466.06","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stem and Jog -->\n  <!-- Bottom Stem -->\n  <!-- Switch Flapper (Normally Closed Contact) -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"11\" Terminal Label -->\n  <!-- \"12\" Terminal Label -->\n  <!-- \"-K1\" Label Rotated -90deg -->\n  <path d=\"m207.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.962434 -33 52.5368)\"/>\n  <path d=\"m207.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.962434 -33 52.5368)\"/>\n  <path d=\"m225,75l0,103l60,1\" fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"9\" transform=\"matrix(1.03394 0 0 0.962434 -40.4009 52.5368)\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.962434 -33 52.5368)\" x1=\"225\" x2=\"225\" y1=\"308\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1.14665 0 0 1.07671 -65.2951 16.7671)\" x1=\"225\" x2=\"270\" y1=\"308\" y2=\"178\"/>\n </g>"},"aux_contacts_no.svg":{"vb":"-40.28 150.55 439.05 468.32","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <title>sunil</title>\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Stems -->\n  <!-- Switch Flapper (Normally Open Contact) -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"13\" Terminal Label -->\n  <!-- \"14\" Terminal Label -->\n  <!-- \"-K1\" Label Rotated -90deg -->\n  <path d=\"m207.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.967172 -31 150.451)\"/>\n  <path d=\"m207.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.967172 -31 150.451)\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.967172 -31 150.451)\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"167\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.967172 -31 150.451)\" x1=\"225\" x2=\"225\" y1=\"312\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.967172 -31 150.451)\" x1=\"225\" x2=\"179\" y1=\"312\" y2=\"172\"/>\n </g>"},"aux_contacts_off_delay _nc.svg":{"vb":"-72.62 51.65 437.92 467.11","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stem and Jog -->\n  <!-- Bottom Stem -->\n  <!-- Switch Flapper (Normally Closed Contact) -->\n  <!-- Contactor Mechanism (Parallel Lines) -->\n  <!-- Crosses the stem and connects to the flapper -->\n  <!-- Contactor C-Shape (Left-facing Half-circle) -->\n  <!-- Text Labels -->\n  <!-- \"55\" Terminal Label -->\n  <!-- \"56\" Terminal Label -->\n  <!-- \"-KM2\" Label Rotated -90deg -->\n  <path d=\"m207.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\"/>\n  <path d=\"m207.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\"/>\n  <path d=\"m225,75l0,103l55,0\" fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\" x1=\"225\" x2=\"225\" y1=\"308\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\" x1=\"225\" x2=\"271\" y1=\"308\" y2=\"166\"/>\n  <path d=\"m42.69,251.15a30.7,35.5 0 0 1 0,71\" fill=\"none\" id=\"svg_contactor_c\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_contactor_l1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\" x1=\"107.3\" x2=\"249.3\" y1=\"237.6\" y2=\"237.6\"/>\n  <line fill=\"none\" id=\"svg_contactor_l2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\" x1=\"107.3\" x2=\"244.37\" y1=\"249.9\" y2=\"249.9\"/>\n </g>"},"aux_contacts_off_delay _no.svg":{"vb":"-92.29 45.45 440.17 469.52","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Stems -->\n  <!-- Switch Flapper (Normally Open) -->\n  <!-- Contactor Mechanism (Parallel Lines) -->\n  <!-- Contactor C-Shape (Left-facing Half-circle) -->\n  <!-- Text Labels -->\n  <!-- \"67\" Terminal Label -->\n  <!-- \"68\" Terminal Label -->\n  <!-- Labels Rotated -90deg -->\n  <path d=\"m207.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.969697 -29 45.3397)\"/>\n  <path d=\"m207.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.969697 -29 45.3397)\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 -29 45.3397)\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"174.7\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 -29 45.3397)\" x1=\"225\" x2=\"225\" y1=\"309.7\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 -29 45.3397)\" x1=\"225\" x2=\"177.4\" y1=\"309.7\" y2=\"183.9\"/>\n  <path d=\"m44.1,245.97a30.7,35.68 0 0 1 0,71.37\" fill=\"none\" id=\"svg_contactor_c\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_contactor_l1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.27137 0 0 0.969697 -83.8168 45.3397)\" x1=\"128.3\" x2=\"197\" y1=\"237.6\" y2=\"237.6\"/>\n  <line fill=\"none\" id=\"svg_contactor_l2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.27137 0 0 0.969697 -83.8168 45.3397)\" x1=\"128.3\" x2=\"202\" y1=\"249.9\" y2=\"249.9\"/>\n </g>"},"aux_contacts_on_delay _nc.svg":{"vb":"-60.16 51.65 437.92 467.11","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stem and Jog -->\n  <!-- Bottom Stem -->\n  <!-- Switch Flapper (Normally Closed Contact) -->\n  <!-- Contactor Mechanism (Parallel Lines) -->\n  <!-- Crosses the stem and connects to the flapper -->\n  <!-- Contactor C-Shape (Left-facing Half-circle) -->\n  <!-- Text Labels -->\n  <!-- \"55\" Terminal Label -->\n  <!-- \"56\" Terminal Label -->\n  <!-- \"-KM2\" Label Rotated -90deg -->\n  <path d=\"m207.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\"/>\n  <path d=\"m207.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\"/>\n  <path d=\"m225,75l0,103l55,0\" fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\" x1=\"225\" x2=\"225\" y1=\"308\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\" x1=\"225\" x2=\"271\" y1=\"308\" y2=\"166\"/>\n  <path d=\"m128.3,206.9a30.7,36.8 0 0 0 0,73.6\" fill=\"none\" id=\"svg_contactor_c\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\"/>\n  <line fill=\"none\" id=\"svg_contactor_l1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\" x1=\"107.3\" x2=\"249.3\" y1=\"237.6\" y2=\"237.6\"/>\n  <line fill=\"none\" id=\"svg_contactor_l2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -30 51.563)\" x1=\"107.3\" x2=\"244.37\" y1=\"249.9\" y2=\"249.9\"/>\n </g>"},"aux_contacts_on_delay _no.svg":{"vb":"-31.91 52.65 437.92 467.11","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Stems -->\n  <!-- Switch Flapper (Normally Open) -->\n  <!-- Contactor Mechanism (Parallel Lines) -->\n  <!-- Contactor C-Shape (Left-facing Half-circle) -->\n  <!-- Text Labels -->\n  <!-- \"67\" Terminal Label -->\n  <!-- \"68\" Terminal Label -->\n  <!-- \"-KM1\" Label Rotated -90deg -->\n  <path d=\"m207.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.964646 18 52.563)\"/>\n  <path d=\"m207.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.964646 18 52.563)\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 18 52.563)\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"174.7\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 18 52.563)\" x1=\"225\" x2=\"225\" y1=\"309.7\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 18 52.563)\" x1=\"225\" x2=\"177.4\" y1=\"309.7\" y2=\"183.9\"/>\n  <path d=\"m128.3,206.9a30.7,36.8 0 0 0 0,73.6\" fill=\"none\" id=\"svg_contactor_c\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 18 52.563)\"/>\n  <line fill=\"none\" id=\"svg_contactor_l1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.32564 0 0 0.964646 -47.7802 52.563)\" x1=\"128.3\" x2=\"197\" y1=\"237.6\" y2=\"237.6\"/>\n  <line fill=\"none\" id=\"svg_contactor_l2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.32564 0 0 0.964646 -47.7802 52.563)\" x1=\"128.3\" x2=\"202\" y1=\"249.9\" y2=\"249.9\"/>\n </g>"},"switch_3_position_selector i-0-ii.svg":{"vb":"91.41 54.45 440.17 469.52","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- 12-Sided Polygon Terminal Nodes -->\n  <!-- Top Stem (Terminal 1) -->\n  <!-- Bottom Stems with Inward Jogs -->\n  <!-- Stem 2 (Normally Closed) -->\n  <!-- Stem 3 (Normally Open) -->\n  <!-- Floating Contact Pad for NO Side (Terminal 3) -->\n  <!-- Switch Flapper (SPDT / Changeover) -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Limit Switch Actuator Bracket (Step shape) -->\n  <!-- Text Labels -->\n  <!-- \"-S12\" Label Rotated -90deg -->\n  <path d=\"m207.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_term_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.969697 107 54.3397) translate(0 0)\"/>\n  <path d=\"m117,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_term_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.969697 107 54.3397) translate(0 0)\"/>\n  <path d=\"m298,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_term_3\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\"/>\n  <line fill=\"none\" id=\"svg_stem_1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"169\"/>\n  <path d=\"m134.5,405l0,-109.7l51.3,0\" fill=\"none\" id=\"svg_stem_2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\"/>\n  <path d=\"m315.5,405l0,-109.7l-51.3,0\" fill=\"none\" id=\"svg_stem_3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\"/>\n  <line fill=\"none\" id=\"svg_floating_pad_3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\" x1=\"210\" x2=\"240\" y1=\"295.3\" y2=\"295.3\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\" x1=\"175\" x2=\"225\" y1=\"305\" y2=\"169\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" transform=\"matrix(1.30769 0 0 0.969697 43.9231 54.3397)\" x1=\"132\" x2=\"200\" y1=\"237\" y2=\"237\"/>\n  <path d=\"m132,207l-27,0l0,60l-27,0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 107 54.3397)\"/>\n </g>"},"switch_3_position_selector i-ii-iii.svg":{"vb":"55.85 50.15 517.6 473.13","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stem -->\n  <!-- Bottom Stems -->\n  <!-- Stem 2 (Normally Closed) -->\n  <!-- Stem 3 (Normally Open Position 2) -->\n  <!-- Stem 4 (Normally Open Position 3) -->\n  <!-- Switch Flapper (Multi-Position Limit Switch) -->\n  <!-- Rests in Position 1 (Normally closed to terminal 2) -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Limit Switch Actuator Bracket -->\n  <!-- Text Labels -->\n  <!-- \"1\" Terminal Label -->\n  <!-- \"2\" Terminal Label -->\n  <!-- \"3\" Terminal Label -->\n  <!-- \"4\" Terminal Label -->\n  <!-- \"-S13\" Label Rotated -90deg -->\n  <g id=\"svg_6\" transform=\"matrix(1 0 0 0.977271 71 50.0052)\">\n   <path d=\"m252.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\"/>\n   <path d=\"m74.8,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\"/>\n   <path d=\"m252.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"6\"/>\n   <path d=\"m426.6,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"6\"/>\n   <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270\" x2=\"270\" y1=\"75\" y2=\"165\"/>\n   <path d=\"m92.3,405l0,-112.5l53.9,0\" fill=\"none\" id=\"svg_stem_2\" stroke=\"#666666\" stroke-width=\"10\"/>\n   <line fill=\"none\" id=\"svg_stem_3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270\" x2=\"270\" y1=\"405\" y2=\"292.5\"/>\n   <line fill=\"none\" id=\"svg_stem_3_t\" stroke=\"#666666\" stroke-width=\"10\" x1=\"243.1\" x2=\"289.7\" y1=\"292.5\" y2=\"292.5\"/>\n   <path d=\"m444.1,405l0,-112.5l-53.8,0\" fill=\"none\" id=\"svg_stem_4\" stroke=\"#666666\" stroke-width=\"10\"/>\n   <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"124.6\" x2=\"270\" y1=\"297.8\" y2=\"165\"/>\n   <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"60\" x2=\"189.2\" y1=\"240.4\" y2=\"240.4\"/>\n   <path d=\"m104.7,214.5l-42.9,-1l0,57.4l-34.1,0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n  </g>\n </g>"},"switch_con.svg":{"vb":"-19.66 51.65 437.92 467.11","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stem -->\n  <!-- Bottom Stems with Inward Jogs -->\n  <!-- Stem 12 -->\n  <!-- Stem 14 -->\n  <!-- Switch Flapper (SPDT / Changeover Contact) -->\n  <!-- Normally closed to terminal 12 -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Pushbutton Actuator Bracket \"[\" -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"11\" Terminal Label -->\n  <!-- \"12\" Terminal Label -->\n  <!-- \"14\" Terminal Label -->\n  <!-- \"-S8\" Label Rotated -90deg -->\n  <path d=\"m207.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.964646 2 51.563)\"/>\n  <path d=\"m122.8,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.964646 2 51.563)\"/>\n  <path d=\"m288.2,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.964646 2 51.563)\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 2 51.563)\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"173.6\"/>\n  <path d=\"m140.3,405l0,-102.3l60.4,0\" fill=\"none\" id=\"svg_stem_12\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 2 51.563) matrix(1 0 0 1 0 0)\"/>\n  <path d=\"m305.7,405l0,-102.3l-45.3,0\" fill=\"none\" id=\"svg_stem_14\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 2 51.563)\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 2 51.563)\" x1=\"187.7\" x2=\"225\" y1=\"308.7\" y2=\"173.6\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 2 51.563)\" x1=\"109.4\" x2=\"205.7\" y1=\"242.2\" y2=\"242.2\"/>\n  <path d=\"m130.4,210.9l-26.4,1l0,64.6l-30.6,1\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 2 51.563)\"/>\n </g>"},"switch_nc.svg":{"vb":"-57.76 53.96 434.53 463.5","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stem and Jog -->\n  <!-- Bottom Stem -->\n  <!-- Switch Flapper (Normally Closed) -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Pushbutton Actuator Bracket \"[\" -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"11\" Terminal Label -->\n  <!-- \"12\" Terminal Label -->\n  <!-- \"-S7\" Label Rotated -90deg -->\n  <path d=\"m207.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.957071 -34 53.8979)\"/>\n  <path d=\"m207.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.957071 -34 53.8979)\"/>\n  <path d=\"m225,75l0,106l63,-1.03\" fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.957071 -34 53.8979)\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.957071 -34 53.8979)\" x1=\"225\" x2=\"225\" y1=\"308\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.957071 -34 53.8979)\" x1=\"225\" x2=\"273\" y1=\"308\" y2=\"168\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.957071 -34 53.8979)\" x1=\"132\" x2=\"248\" y1=\"242\" y2=\"242\"/>\n  <path d=\"m155,211l-27,0l0,60l-29,1\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.957071 -34 53.8979)\"/>\n </g>"},"switch_no.svg":{"vb":"-69.61 0.22 453.72 483.97","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <path d=\"m207.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m207.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <!-- Stems -->\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"167\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" x1=\"225\" x2=\"225\" y1=\"312\" y2=\"405\"/>\n  <!-- Switch Flapper (Normally Open) -->\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"225\" x2=\"179\" y1=\"312\" y2=\"172\"/>\n  <!-- Dashed Mechanical Link -->\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"105\" x2=\"202\" y1=\"242\" y2=\"242\"/>\n  <!-- Pushbutton Actuator Bracket \"[\" -->\n  <path d=\"m132,211l-27,0l0,60c-10.33,0.67 -20.67,-0.67 -31,0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"13\" Terminal Label -->\n  <!-- \"14\" Terminal Label -->\n  <!-- \"-S6\" Label Rotated -90deg -->\n </g>"},"switch_pushbutton_con.svg":{"vb":"-14.26 0.22 453.72 483.97","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <path d=\"m207.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m122.8,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m288.2,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <!-- Top Stem -->\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"173.6\"/>\n  <!-- Bottom Stems with Inward Jogs -->\n  <!-- Stem 12 -->\n  <path d=\"m140.3,405l0,-102.3l60.4,0\" fill=\"none\" id=\"svg_stem_12\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 1 0 0)\"/>\n  <!-- Stem 14 -->\n  <path d=\"m305.7,405l0,-102.3l-45.3,0\" fill=\"none\" id=\"svg_stem_14\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <!-- Switch Flapper (SPDT / Changeover Contact) -->\n  <!-- Normally closed to terminal 12 -->\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"187.7\" x2=\"225\" y1=\"308.7\" y2=\"173.6\"/>\n  <!-- Dashed Mechanical Link -->\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"109.4\" x2=\"205.7\" y1=\"242.2\" y2=\"242.2\"/>\n  <!-- Pushbutton Actuator Bracket \"[\" -->\n  <path d=\"m130.4,210.9l-26.4,1l0,64.6l27.4,0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"11\" Terminal Label -->\n  <!-- \"12\" Terminal Label -->\n  <!-- \"14\" Terminal Label -->\n  <!-- \"-S8\" Label Rotated -90deg -->\n </g>"},"switch_pushbutton_nc.svg":{"vb":"-29.86 0.22 453.72 483.97","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <path d=\"m207.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m207.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <!-- Top Stem and Jog -->\n  <path d=\"m225,75l0,103l64,1\" fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <!-- Bottom Stem -->\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" x1=\"225\" x2=\"225\" y1=\"308\" y2=\"405\"/>\n  <!-- Switch Flapper (Normally Closed) -->\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"225\" x2=\"271\" y1=\"308\" y2=\"172\"/>\n  <!-- Dashed Mechanical Link -->\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"111\" x2=\"248\" y1=\"242\" y2=\"242\"/>\n  <!-- Pushbutton Actuator Bracket \"[\" -->\n  <path d=\"m132,211l-27,0l0,60l27,0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"11\" Terminal Label -->\n  <!-- \"12\" Terminal Label -->\n  <!-- \"-S7\" Label Rotated -90deg -->\n </g>"},"switch_pushbutton_no.svg":{"vb":"-53.61 0.22 453.72 483.97","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <path d=\"m207.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m207.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <!-- Stems -->\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"8\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"167\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"8\" x1=\"225\" x2=\"225\" y1=\"312\" y2=\"405\"/>\n  <!-- Switch Flapper (Normally Open) -->\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"225\" x2=\"179\" y1=\"312\" y2=\"172\"/>\n  <!-- Dashed Mechanical Link -->\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"8\" x1=\"105\" x2=\"202\" y1=\"242\" y2=\"242\"/>\n  <!-- Pushbutton Actuator Bracket \"[\" -->\n  <path d=\"m132,211l-27,0l0,60l27,0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"8\"/>\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"13\" Terminal Label -->\n  <!-- \"14\" Terminal Label -->\n  <!-- \"-S6\" Label Rotated -90deg -->\n </g>"},"load_beacon(1).svg":{"vb":"21.71 53.93 437.4 466.56","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <defs>\n  <!-- Arrowhead marker for the rotation/flashing curved arrow -->\n  <marker id=\"arrow\" markerHeight=\"6\" markerWidth=\"6\" orient=\"auto-start-reverse\" refX=\"5\" refY=\"5\" viewBox=\"0 0 10 10\">\n   <path d=\"m0,1l10,4l-10,4l0,-8z\" fill=\"#666666\" id=\"svg_9\"/>\n  </marker>\n </defs>\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Top terminal node (12-sided polygon) -->\n  <!-- Top vertical stem -->\n  <!-- Rotating Beacon Circle (Diameter = 96px, Radius = 48px, centered at 225, 240) -->\n  <!-- Internal 'X' Cross inside Circle -->\n  <!-- Curved Rotation Arrow on the Right Side -->\n  <!-- Bottom vertical stem -->\n  <!-- Bottom terminal node (12-sided polygon) -->\n  <path d=\"m207.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.23329 0 0 1.66394 -43.809 -288.863) matrix(1.07012 0 0 0.575981 -22.0592 206.702)\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.23329 0 0 1.66394 -43.809 -288.863) matrix(1.07012 0 0 0.575981 -22.0592 206.702)\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"192\"/>\n  <circle cx=\"225\" cy=\"240\" fill=\"none\" id=\"svg_3\" r=\"52\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.23329 0 0 1.66394 -43.809 -288.863) matrix(1.07012 0 0 0.575981 -22.0592 206.702)\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"7.5\" transform=\"matrix(1.23329 0 0 1.66394 -43.809 -288.863) matrix(1.07012 0 0 0.575981 -22.0592 206.702)\" x1=\"191\" x2=\"259\" y1=\"206\" y2=\"274\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"7.5\" transform=\"matrix(1.23329 0 0 1.66394 -43.809 -288.863) matrix(1.07012 0 0 0.575981 -22.0592 206.702)\" x1=\"259\" x2=\"191\" y1=\"206\" y2=\"274\"/>\n  <path d=\"m279,195a60,60 0 0 1 0,90\" fill=\"none\" id=\"svg_6\" marker-end=\"url(#arrow)\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"7\" transform=\"matrix(1.23329 0 0 1.66394 -43.809 -288.863) matrix(1.07012 0 0 0.575981 -22.0592 206.702)\"/>\n  <line fill=\"none\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.23329 0 0 1.66394 -43.809 -288.863) matrix(1.07012 0 0 0.575981 -22.0592 206.702)\" x1=\"225\" x2=\"225\" y1=\"288\" y2=\"405\"/>\n  <path d=\"m207.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.23329 0 0 1.66394 -43.809 -288.863) matrix(1.07012 0 0 0.575981 -22.0592 206.702)\"/>\n </g>"},"load_bell(1).svg":{"vb":"19.48 55.95 434.55 463.52","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Top terminal node (12-sided polygon at x=225, y=62.7) -->\n  <!-- Top vertical stem (along x=225 from top terminal down to y=204) and horizontal lead RIGHT to x=260 -->\n  <!-- Acoustic Horn / Buzzer D-shape Symbol (to the right of the stem, flat back at x=260 from y=176 to y=304, dome extending right to x=331) -->\n  <!-- Bottom horizontal lead (from flat back at x=260, y=276 LEFT to x=225) and vertical stem down to bottom terminal -->\n  <!-- Bottom terminal node (12-sided polygon at x=225, y=421.7) -->\n  <path d=\"m207.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.00797 0 0 0.95202 -34.6454 57.1212)\"/>\n  <path d=\"m225,75l0,129l35,0\" fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.00797 0 0 0.95202 -34.6454 57.1212)\"/>\n  <path d=\"m260,176l0,128a71,64 0 0 0 0,-128z\" fill=\"none\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.00797 0 0 0.95202 -34.6454 57.1212)\"/>\n  <path d=\"m260,276l-35,0l0,129\" fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.00797 0 0 0.95202 -34.6454 57.1212)\"/>\n  <path d=\"m207.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.00797 0 0 0.95202 -34.6454 57.1212)\"/>\n </g>"},"load_blinking_pilot_lamp(1).svg":{"vb":"0.6 55.95 434.55 463.52","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Top terminal node (12-sided polygon at x=225, y=62.7) -->\n  <!-- Top vertical stem (from top terminal down to top of circle at y=168.5) -->\n  <!-- Indicator Lamp Circle (Centerline Radius = 71.5px, Centerline Diameter = 143px, matching image_e69089.png) -->\n  <!-- Internal 'X' Cross inside Circle -->\n  <!-- Flashing / Square-Wave Pulse Symbol on Right Side of Circle -->\n  <!-- Bottom vertical stem (from bottom of circle at y=311.5 down to bottom terminal) -->\n  <!-- Bottom terminal node (12-sided polygon at x=225, y=421.7) -->\n  <path d=\"m207.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.00508 0 0 0.95202 -33.7716 57.1212)\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.00508 0 0 0.95202 -33.7716 57.1212)\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"168.5\"/>\n  <circle cx=\"225\" cy=\"240\" fill=\"none\" id=\"svg_3\" r=\"72\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.00508 0 0 0.95202 -33.7716 57.1212)\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.00508 0 0 0.95202 -33.7716 57.1212)\" x1=\"174.44\" x2=\"275.56\" y1=\"189.44\" y2=\"290.56\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.00508 0 0 0.95202 -33.7716 57.1212)\" x1=\"275.56\" x2=\"174.44\" y1=\"189.44\" y2=\"290.56\"/>\n  <path d=\"m304,251l10,0l0,-24l24,0l0,24l10,0\" fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"7.5\" transform=\"matrix(1.00508 0 0 0.95202 -33.7716 57.1212)\"/>\n  <line fill=\"none\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.00508 0 0 0.95202 -33.7716 57.1212)\" x1=\"225\" x2=\"225\" y1=\"311.5\" y2=\"405\"/>\n  <path d=\"m207.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.00508 0 0 0.95202 -33.7716 57.1212)\"/>\n </g>"},"load_buzzer(1).svg":{"vb":"12.03 52.64 437.93 467.13","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Top terminal node (12-sided polygon at x=225, y=62.7) -->\n  <!-- Top vertical stem (along x=225 from top terminal down to y=204) and horizontal lead RIGHT to bell dome at x=263 -->\n  <!-- Bell Symbol (Reversed D-shape: flat vertical back at x=321.5 from y=176 to y=304, curved dome facing left to x=250) -->\n  <!-- Bottom horizontal lead (from bell dome at x=263, y=276 LEFT to x=225) and vertical stem down to bottom terminal -->\n  <!-- Bottom terminal node (12-sided polygon at x=225, y=421.7) -->\n  <path d=\"m207.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.0086 0 0 0.959594 -35.776 53.7867)\"/>\n  <path d=\"m225,75l0,129l38,0\" fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.0086 0 0 0.959594 -35.776 53.7867)\"/>\n  <path d=\"m321.5,176l0,128a71.5,64 0 0 1 0,-128z\" fill=\"none\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.0086 0 0 0.959594 -35.776 53.7867)\"/>\n  <path d=\"m263,276l-38,0l0,129\" fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.0086 0 0 0.959594 -35.776 53.7867)\"/>\n  <path d=\"m207.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.0086 0 0 0.959594 -35.776 53.7867)\"/>\n </g>"},"load_light(1).svg":{"vb":"-24.84 54.85 435.68 464.72","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Top terminal node (12-sided polygon) -->\n  <!-- Top vertical stem -->\n  <!-- Indicator Lamp Circle (Diameter = 96px, Radius = 48px, centered at 225, 240) -->\n  <!-- Internal 'X' Cross inside Circle -->\n  <!-- Bottom vertical stem -->\n  <!-- Bottom terminal node (12-sided polygon) -->\n  <path d=\"m207.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.954545 -32 56.0096)\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.954545 -32 56.0096)\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"192\"/>\n  <circle cx=\"225\" cy=\"240\" fill=\"none\" id=\"svg_3\" r=\"52\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.954545 -32 56.0096)\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"7.5\" transform=\"matrix(1 0 0 0.954545 -32 56.0096)\" x1=\"189\" x2=\"260\" y1=\"204\" y2=\"274\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"7.5\" transform=\"matrix(1 0 0 0.954545 -32 56.0096)\" x1=\"260\" x2=\"190\" y1=\"205\" y2=\"275\"/>\n  <line fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.954545 -32 56.0096)\" x1=\"225\" x2=\"225\" y1=\"288\" y2=\"405\"/>\n  <path d=\"m207.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.954545 -32 56.0096)\"/>\n </g>"},"main_contacts_1p_no.svg":{"vb":"118.72 54.45 440.17 469.52","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stem -->\n  <!-- Semi-Circle (Power Contact Half-moon) -->\n  <!-- Bottom Stem -->\n  <!-- Switch Flapper (Normally Open Power Contact) -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"1\" Terminal Label -->\n  <!-- \"2\" Terminal Label -->\n  <!-- \"-KM1\" Label Rotated -90deg -->\n  <path d=\"m207.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.969697 127 54.3397)\"/>\n  <path d=\"m207.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.969697 127 54.3397)\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 127 54.3397)\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"188.4\"/>\n  <path d=\"m225,152.4a18,18 0 0 0 0,36\" fill=\"#666666\" id=\"svg_semi_circle\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.969697 127 54.3397)\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 127 54.3397)\" x1=\"225\" x2=\"225\" y1=\"314\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"352\" x2=\"310.1\" y1=\"358.82\" y2=\"221.03\"/>\n </g>"},"main_contacts_2p_no.svg":{"vb":"161.68 53.04 444.69 474.34","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems -->\n  <!-- Semi-Circles (Power Contact Half-moons) -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open Power Contacts) -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels -->\n  <!-- Labels Rotated -90deg -->\n  <path d=\"m117.75,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.979798 24 7.82243) matrix(1 0 0 1 138 46)\"/>\n  <path d=\"m117.75,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.979798 24 7.82243) matrix(1 0 0 1 138 46)\"/>\n  <path d=\"m297.25,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.979798 24 7.82243) matrix(1 0 0 1 138 46)\"/>\n  <path d=\"m297.25,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.979798 24 7.82243) matrix(1 0 0 1 138 46)\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.979798 24 7.82243) matrix(1 0 0 1 138 46)\" x1=\"135.25\" x2=\"135.25\" y1=\"75\" y2=\"186.8\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.979798 24 7.82243) matrix(1 0 0 1 138 46)\" x1=\"314.75\" x2=\"314.75\" y1=\"75\" y2=\"186.8\"/>\n  <path d=\"m135.25,148a19.4,19.4 0 0 0 0,38.8\" fill=\"#666666\" id=\"svg_semi_circle_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.979798 24 7.82243) matrix(1 0 0 1 138 46)\"/>\n  <path d=\"m314.75,148a19.4,19.4 0 0 0 0,38.8\" fill=\"#666666\" id=\"svg_semi_circle_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.979798 24 7.82243) matrix(1 0 0 1 138 46)\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.979798 24 7.82243) matrix(1 0 0 1 138 46)\" x1=\"135.25\" x2=\"135.25\" y1=\"315.5\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.979798 24 7.82243) matrix(1 0 0 1 138 46)\" x1=\"314.75\" x2=\"314.75\" y1=\"315.5\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.979798 24 7.82243) matrix(1 0 0 1 138 46)\" x1=\"135.25\" x2=\"112.8\" y1=\"315.5\" y2=\"167.4\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.979798 24 7.82243) matrix(1 0 0 1 138 46)\" x1=\"314.75\" x2=\"292.3\" y1=\"315.5\" y2=\"167.4\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.979798 24 7.82243) matrix(1 0 0 1 138 46)\" x1=\"124.4\" x2=\"303.9\" y1=\"243.7\" y2=\"243.7\"/>\n </g>"},"main_contacts_3p_no.svg":{"vb":"119.31 145.11 482.47 472.31","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems -->\n  <!-- Semi-Circles (Power Contact Half-moons) -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open Power Contacts) -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels -->\n  <!-- Labels Rotated -90deg -->\n  <path d=\"m73,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.975542 94 144.982)\"/>\n  <path d=\"m73,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.975542 94 144.982)\"/>\n  <path d=\"m252.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.975542 94 144.982)\"/>\n  <path d=\"m252.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.975542 94 144.982)\"/>\n  <path d=\"m432,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.975542 94 144.982)\"/>\n  <path d=\"m432,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.975542 94 144.982)\"/>\n  <line fill=\"#666666\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.975542 94 144.982)\" x1=\"90.5\" x2=\"90.5\" y1=\"75\" y2=\"186.8\"/>\n  <line fill=\"#666666\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.975542 94 144.982)\" x1=\"270\" x2=\"270\" y1=\"75\" y2=\"186.8\"/>\n  <line fill=\"#666666\" id=\"svg_stem_top3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.975542 94 144.982)\" x1=\"449.5\" x2=\"449.5\" y1=\"75\" y2=\"186.8\"/>\n  <path d=\"m90.5,148a19.4,19.4 0 0 0 0,38.8\" fill=\"#666666\" id=\"svg_semi_circle_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.975542 94 144.982)\"/>\n  <path d=\"m270,148a19.4,19.4 0 0 0 0,38.8\" fill=\"#666666\" id=\"svg_semi_circle_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.975542 94 144.982)\"/>\n  <path d=\"m449.5,148a19.4,19.4 0 0 0 0,38.8\" fill=\"#666666\" id=\"svg_semi_circle_3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.975542 94 144.982)\"/>\n  <line fill=\"#666666\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"translate(0 0) matrix(1 0 0 0.975542 94 144.982)\" x1=\"90.5\" x2=\"90.5\" y1=\"315.5\" y2=\"405\"/>\n  <line fill=\"#666666\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.975542 94 144.982)\" x1=\"270\" x2=\"270\" y1=\"315.5\" y2=\"405\"/>\n  <line fill=\"#666666\" id=\"svg_stem_bot3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.975542 94 144.982)\" x1=\"449.5\" x2=\"449.5\" y1=\"315.5\" y2=\"405\"/>\n  <line fill=\"#666666\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.975542 94 144.982)\" x1=\"90.5\" x2=\"68.1\" y1=\"315.5\" y2=\"167.4\"/>\n  <line fill=\"#666666\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.975542 94 144.982)\" x1=\"270\" x2=\"247.6\" y1=\"315.5\" y2=\"167.4\"/>\n  <line fill=\"#666666\" id=\"svg_flapper3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.975542 94 144.982)\" x1=\"449.5\" x2=\"427.1\" y1=\"315.5\" y2=\"167.4\"/>\n  <line fill=\"#666666\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.975542 94 144.982)\" x1=\"79.7\" x2=\"438.7\" y1=\"243.7\" y2=\"243.7\"/>\n </g>"},"main_contacts_4p_no.svg":{"vb":"34.59 48.24 661.91 471.93","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems -->\n  <!-- Semi-Circles (Power Contact Half-moons) -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open Power Contacts) -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels -->\n  <!-- Labels Rotated -90deg -->\n  <path d=\"m73.25,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\"/>\n  <path d=\"m73.25,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\"/>\n  <path d=\"m252.75,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\"/>\n  <path d=\"m252.75,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\"/>\n  <path d=\"m432.25,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\"/>\n  <path d=\"m432.25,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\"/>\n  <path d=\"m611.75,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\"/>\n  <path d=\"m611.75,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\" x1=\"90.75\" x2=\"90.75\" y1=\"75\" y2=\"186.8\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\" x1=\"270.25\" x2=\"270.25\" y1=\"75\" y2=\"186.8\"/>\n  <line fill=\"none\" id=\"svg_stem_top3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\" x1=\"449.75\" x2=\"449.75\" y1=\"75\" y2=\"186.8\"/>\n  <line fill=\"none\" id=\"svg_stem_top4\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\" x1=\"629.25\" x2=\"629.25\" y1=\"75\" y2=\"186.8\"/>\n  <path d=\"m90.75,148a19.4,19.4 0 0 0 0,38.8\" fill=\"#666666\" id=\"svg_semi_circle_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\"/>\n  <path d=\"m270.25,148a19.4,19.4 0 0 0 0,38.8\" fill=\"#666666\" id=\"svg_semi_circle_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\"/>\n  <path d=\"m449.75,148a19.4,19.4 0 0 0 0,38.8\" fill=\"#666666\" id=\"svg_semi_circle_3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\"/>\n  <path d=\"m629.25,148a19.4,19.4 0 0 0 0,38.8\" fill=\"#666666\" id=\"svg_semi_circle_4\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\" x1=\"90.75\" x2=\"90.75\" y1=\"315.5\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\" x1=\"270.25\" x2=\"270.25\" y1=\"315.5\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_stem_bot3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\" x1=\"449.75\" x2=\"449.75\" y1=\"315.5\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_stem_bot4\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\" x1=\"629.25\" x2=\"629.25\" y1=\"315.5\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\" x1=\"90.75\" x2=\"68.35\" y1=\"315.5\" y2=\"167.4\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\" x1=\"270.25\" x2=\"247.85\" y1=\"315.5\" y2=\"167.4\"/>\n  <line fill=\"none\" id=\"svg_flapper3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\" x1=\"449.75\" x2=\"427.35\" y1=\"315.5\" y2=\"167.4\"/>\n  <line fill=\"none\" id=\"svg_flapper4\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\" x1=\"629.25\" x2=\"606.85\" y1=\"315.5\" y2=\"167.4\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 9 48.1164)\" x1=\"80\" x2=\"618.5\" y1=\"243.7\" y2=\"243.7\"/>\n </g>"},"protection_circuit_breaker_1p.svg":{"vb":"-38.83 52.13 442.55 472.05","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stem -->\n  <!-- Circuit Breaker 'X' Symbol -->\n  <!-- Bottom Stem -->\n  <!-- Switch Flapper (Normally Open) -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-Q1\" Label Rotated -90deg -->\n  <path d=\"m207.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.975005 -30 52.0031)\"/>\n  <path d=\"m207.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.975005 -30 52.0031)\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"8\" x1=\"195\" x2=\"195\" y1=\"114.13\" y2=\"221.87\"/>\n  <line fill=\"none\" id=\"svg_cb_x1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"translate(0 0) matrix(1 0 0 0.975005 -30 52.0031)\" x1=\"213.7\" x2=\"236.3\" y1=\"162.8\" y2=\"185.5\"/>\n  <line fill=\"none\" id=\"svg_cb_x2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.975005 -30 52.0031)\" x1=\"213.7\" x2=\"236.3\" y1=\"185.5\" y2=\"162.8\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"8\" transform=\"translate(0 0) matrix(1 0 0 0.975005 -30 52.0031)\" x1=\"225\" x2=\"225\" y1=\"298.9\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"translate(0 0) matrix(1 0 0 0.975005 -30 52.0031)\" x1=\"225\" x2=\"183.4\" y1=\"298.9\" y2=\"178\"/>\n </g>"},"protection_circuit_breaker_2p.svg":{"vb":"-29.2 49.34 441.31 470.73","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems -->\n  <!-- Circuit Breaker 'X' Symbols -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-Q2\" Label Rotated -90deg -->\n  <path d=\"m117.75,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.972221 -21 49.2283)\"/>\n  <path d=\"m117.75,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.972221 -21 49.2283)\"/>\n  <path d=\"m297.25,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.972221 -21 49.2283)\"/>\n  <path d=\"m297.25,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.972221 -21 49.2283)\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.972221 -21 49.2283)\" x1=\"135.25\" x2=\"135.25\" y1=\"75\" y2=\"174\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.972221 -21 49.2283)\" x1=\"314.75\" x2=\"314.75\" y1=\"75\" y2=\"174\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.972221 -21 49.2283)\" x1=\"123.95\" x2=\"146.55\" y1=\"162.7\" y2=\"185.3\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.972221 -21 49.2283)\" x1=\"123.95\" x2=\"146.55\" y1=\"185.3\" y2=\"162.7\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.972221 -21 49.2283)\" x1=\"303.45\" x2=\"326.05\" y1=\"162.7\" y2=\"185.3\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.972221 -21 49.2283)\" x1=\"303.45\" x2=\"326.05\" y1=\"185.3\" y2=\"162.7\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.972221 -21 49.2283)\" x1=\"135.25\" x2=\"135.25\" y1=\"298.9\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.972221 -21 49.2283)\" x1=\"314.75\" x2=\"314.75\" y1=\"298.9\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.972221 -21 49.2283)\" x1=\"135.25\" x2=\"93.65\" y1=\"298.9\" y2=\"178\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.972221 -21 49.2283)\" x1=\"314.75\" x2=\"273.15\" y1=\"298.9\" y2=\"178\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.972221 -21 49.2283)\" x1=\"114.45\" x2=\"293.95\" y1=\"238.5\" y2=\"238.5\"/>\n </g>"},"protection_circuit_breaker_3p.svg":{"vb":"12.15 49.24 501.61 471.93","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems -->\n  <!-- Circuit Breaker 'X' Symbols -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-Q3\" Label Rotated -90deg -->\n  <path d=\"m73,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.974747 6 49.1164)\"/>\n  <path d=\"m73,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.974747 6 49.1164)\"/>\n  <path d=\"m252.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.974747 6 49.1164)\"/>\n  <path d=\"m252.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.974747 6 49.1164)\"/>\n  <path d=\"m432,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.974747 6 49.1164)\"/>\n  <path d=\"m432,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.974747 6 49.1164)\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 6 49.1164)\" x1=\"90.5\" x2=\"90.5\" y1=\"75\" y2=\"174\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 6 49.1164)\" x1=\"270\" x2=\"270\" y1=\"75\" y2=\"174\"/>\n  <line fill=\"none\" id=\"svg_stem_top3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 6 49.1164)\" x1=\"449.5\" x2=\"449.5\" y1=\"75\" y2=\"174\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 6 49.1164)\" x1=\"79.2\" x2=\"101.8\" y1=\"162.7\" y2=\"185.3\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 6 49.1164)\" x1=\"79.2\" x2=\"101.8\" y1=\"185.3\" y2=\"162.7\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 6 49.1164)\" x1=\"258.7\" x2=\"281.3\" y1=\"162.7\" y2=\"185.3\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 6 49.1164)\" x1=\"258.7\" x2=\"281.3\" y1=\"185.3\" y2=\"162.7\"/>\n  <line fill=\"none\" id=\"svg_cb_x3_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 6 49.1164)\" x1=\"438.2\" x2=\"460.8\" y1=\"162.7\" y2=\"185.3\"/>\n  <line fill=\"none\" id=\"svg_cb_x3_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 6 49.1164)\" x1=\"438.2\" x2=\"460.8\" y1=\"185.3\" y2=\"162.7\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 6 49.1164)\" x1=\"90.5\" x2=\"90.5\" y1=\"298.9\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 6 49.1164)\" x1=\"270\" x2=\"270\" y1=\"298.9\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_stem_bot3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 6 49.1164)\" x1=\"449.5\" x2=\"449.5\" y1=\"298.9\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 6 49.1164)\" x1=\"90.5\" x2=\"48.9\" y1=\"298.9\" y2=\"178\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 6 49.1164)\" x1=\"270\" x2=\"228.4\" y1=\"298.9\" y2=\"178\"/>\n  <line fill=\"none\" id=\"svg_flapper3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 6 49.1164)\" x1=\"449.5\" x2=\"407.9\" y1=\"298.9\" y2=\"178\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.974747 6 49.1164)\" x1=\"69.7\" x2=\"428.7\" y1=\"238.5\" y2=\"238.5\"/>\n </g>"},"protection_fuse_ isolator_1p.svg":{"vb":"219.43 148.52 440.85 470.24","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems & Disconnector Bars -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Rectangular Fuse Boxes on Flappers -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-F6\" Label Rotated -90deg -->\n  <path d=\"m435.86,179.45l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\"/>\n  <path d=\"m435.86,538.45l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"453.36\" x2=\"453.36\" y1=\"196.43\" y2=\"281.43\"/>\n  <line fill=\"none\" id=\"svg_disc_bar1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"423.36\" x2=\"483.36\" y1=\"281.43\" y2=\"281.43\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"453.36\" x2=\"453.36\" y1=\"436.93\" y2=\"526.43\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"453.17\" x2=\"406.4\" y1=\"436.19\" y2=\"290.03\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.963841 -0.258804 0.266477 0.936085 -89.0617 158.002)\" width=\"45\" x=\"415.86\" y=\"317.43\"/>\n </g>"},"protection_fuse_ isolator_2p.svg":{"vb":"309.18 148.52 440.85 470.24","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems & Disconnector Bars -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Rectangular Fuse Boxes on Flappers -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-F6\" Label Rotated -90deg -->\n  <path d=\"m435.86,179.45l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\"/>\n  <path d=\"m435.86,538.45l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\"/>\n  <path d=\"m615.36,179.45l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\"/>\n  <path d=\"m615.36,538.45l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"453.36\" x2=\"453.36\" y1=\"196.43\" y2=\"281.43\"/>\n  <line fill=\"none\" id=\"svg_disc_bar1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"423.36\" x2=\"483.36\" y1=\"281.43\" y2=\"281.43\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"632.86\" x2=\"632.86\" y1=\"196.43\" y2=\"281.43\"/>\n  <line fill=\"none\" id=\"svg_disc_bar2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"602.86\" x2=\"662.86\" y1=\"281.43\" y2=\"281.43\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"453.36\" x2=\"453.36\" y1=\"436.93\" y2=\"526.43\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"632.86\" x2=\"632.86\" y1=\"436.93\" y2=\"526.43\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"453.17\" x2=\"406.4\" y1=\"436.19\" y2=\"290.03\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.963841 -0.258804 0.266477 0.936085 -89.0617 158.002)\" width=\"45\" x=\"415.86\" y=\"317.43\"/>\n  <line fill=\"none\" id=\"svg_13\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"633.18\" x2=\"586.4\" y1=\"436.19\" y2=\"290.03\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_14\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.963841 -0.258804 0.266478 0.936085 90.9383 158.002)\" width=\"45\" x=\"415.86\" y=\"317.43\"/>\n  <line fill=\"none\" id=\"svg_18\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"432.64\" x2=\"600.21\" y1=\"381.74\" y2=\"381.74\"/>\n </g>"},"protection_fuse_ isolator_3p.svg":{"vb":"353.73 148.52 531.25 470.24","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems & Disconnector Bars -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Rectangular Fuse Boxes on Flappers -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-F6\" Label Rotated -90deg -->\n  <path d=\"m435.86,179.45l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\"/>\n  <path d=\"m435.86,538.45l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\"/>\n  <path d=\"m615.36,179.45l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\"/>\n  <path d=\"m615.36,538.45l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\"/>\n  <path d=\"m794.86,204.75l4.69,-7.89l8.12,-4.55l9.38,0l8.12,4.55l4.69,7.89l0,9.11l-4.69,7.89l-8.12,4.55l-9.38,0l-8.12,-4.55l-4.69,-7.89l0,-9.11z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m794.86,553.41l4.69,-7.89l8.12,-4.55l9.38,0l8.12,4.55l4.69,7.89l0,9.11l-4.69,7.89l-8.12,4.55l-9.38,0l-8.12,-4.55l-4.69,-7.89l0,-9.11z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"453.36\" x2=\"453.36\" y1=\"196.43\" y2=\"281.43\"/>\n  <line fill=\"none\" id=\"svg_disc_bar1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"423.36\" x2=\"483.36\" y1=\"281.43\" y2=\"281.43\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"632.86\" x2=\"632.86\" y1=\"196.43\" y2=\"281.43\"/>\n  <line fill=\"none\" id=\"svg_disc_bar2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"602.86\" x2=\"662.86\" y1=\"281.43\" y2=\"281.43\"/>\n  <line fill=\"none\" id=\"svg_stem_top3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"812.36\" x2=\"812.36\" y1=\"221.24\" y2=\"303.8\"/>\n  <line fill=\"none\" id=\"svg_disc_bar3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"782.36\" x2=\"842.36\" y1=\"303.8\" y2=\"303.8\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"453.36\" x2=\"453.36\" y1=\"436.93\" y2=\"526.43\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"632.86\" x2=\"632.86\" y1=\"436.93\" y2=\"526.43\"/>\n  <line fill=\"none\" id=\"svg_stem_bot3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"812.36\" x2=\"812.36\" y1=\"454.82\" y2=\"541.74\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"432.64\" x2=\"784.5\" y1=\"381.74\" y2=\"381.74\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"453.17\" x2=\"406.4\" y1=\"436.19\" y2=\"290.03\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.963841 -0.258804 0.266477 0.936085 -89.0617 158.002)\" width=\"45\" x=\"415.86\" y=\"317.43\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"811.75\" x2=\"764.97\" y1=\"454.1\" y2=\"312.15\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.964348 -0.26327 0.262011 0.935578 270.902 160.143)\" width=\"45\" x=\"415.86\" y=\"317.43\"/>\n  <line fill=\"none\" id=\"svg_13\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"633.18\" x2=\"586.4\" y1=\"436.19\" y2=\"290.03\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_14\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.963841 -0.258804 0.266478 0.936085 90.9383 158.002)\" width=\"45\" x=\"415.86\" y=\"317.43\"/>\n  <path d=\"m794.86,204.75l4.69,-7.89l8.12,-4.55l9.38,0l8.12,4.55l4.69,7.89l0,9.11l-4.69,7.89l-8.12,4.55l-9.38,0l-8.12,-4.55l-4.69,-7.89l0,-9.11z\" fill=\"#666666\" id=\"svg_23\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m794.86,553.41l4.69,-7.89l8.12,-4.55l9.38,0l8.12,4.55l4.69,7.89l0,9.11l-4.69,7.89l-8.12,4.55l-9.38,0l-8.12,-4.55l-4.69,-7.89l0,-9.11z\" fill=\"#666666\" id=\"svg_22\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <line fill=\"none\" id=\"svg_21\" stroke=\"#666666\" stroke-width=\"10\" x1=\"812.36\" x2=\"812.36\" y1=\"221.24\" y2=\"303.8\"/>\n  <line fill=\"none\" id=\"svg_20\" stroke=\"#666666\" stroke-width=\"10\" x1=\"782.36\" x2=\"842.36\" y1=\"303.8\" y2=\"303.8\"/>\n  <line fill=\"none\" id=\"svg_19\" stroke=\"#666666\" stroke-width=\"10\" x1=\"812.36\" x2=\"812.36\" y1=\"454.82\" y2=\"541.74\"/>\n </g>"},"protection_fuse_ isolator_4p.svg":{"vb":"353.73 148.52 716.96 470.24","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems & Disconnector Bars -->\n  <!-- Bottom Stems -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Rectangular Fuse Boxes on Flappers -->\n  <!-- Dashed Mechanical Link -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-F6\" Label Rotated -90deg -->\n  <path d=\"m435.86,179.45l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\"/>\n  <path d=\"m435.86,538.45l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\"/>\n  <path d=\"m615.36,179.45l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\"/>\n  <path d=\"m615.36,538.45l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\"/>\n  <path d=\"m794.86,204.75l4.69,-7.89l8.12,-4.55l9.38,0l8.12,4.55l4.69,7.89l0,9.11l-4.69,7.89l-8.12,4.55l-9.38,0l-8.12,-4.55l-4.69,-7.89l0,-9.11z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m794.86,553.41l4.69,-7.89l8.12,-4.55l9.38,0l8.12,4.55l4.69,7.89l0,9.11l-4.69,7.89l-8.12,4.55l-9.38,0l-8.12,-4.55l-4.69,-7.89l0,-9.11z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"453.36\" x2=\"453.36\" y1=\"196.43\" y2=\"281.43\"/>\n  <line fill=\"none\" id=\"svg_disc_bar1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"423.36\" x2=\"483.36\" y1=\"281.43\" y2=\"281.43\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"632.86\" x2=\"632.86\" y1=\"196.43\" y2=\"281.43\"/>\n  <line fill=\"none\" id=\"svg_disc_bar2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"602.86\" x2=\"662.86\" y1=\"281.43\" y2=\"281.43\"/>\n  <line fill=\"none\" id=\"svg_stem_top3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"812.36\" x2=\"812.36\" y1=\"221.24\" y2=\"303.8\"/>\n  <line fill=\"none\" id=\"svg_disc_bar3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"782.36\" x2=\"842.36\" y1=\"303.8\" y2=\"303.8\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"453.36\" x2=\"453.36\" y1=\"436.93\" y2=\"526.43\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"632.86\" x2=\"632.86\" y1=\"436.93\" y2=\"526.43\"/>\n  <line fill=\"none\" id=\"svg_stem_bot3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"812.36\" x2=\"812.36\" y1=\"454.82\" y2=\"541.74\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"432.64\" x2=\"968.79\" y1=\"381.74\" y2=\"381.74\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"453.17\" x2=\"406.4\" y1=\"436.19\" y2=\"290.03\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.963841 -0.258804 0.266477 0.936085 -89.0617 158.002)\" width=\"45\" x=\"415.86\" y=\"317.43\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"811.75\" x2=\"764.97\" y1=\"454.1\" y2=\"312.15\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.964348 -0.26327 0.262011 0.935578 270.902 160.143)\" width=\"45\" x=\"415.86\" y=\"317.43\"/>\n  <line fill=\"none\" id=\"svg_13\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971202 0 30.4719)\" x1=\"633.18\" x2=\"586.4\" y1=\"436.19\" y2=\"290.03\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_14\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.963841 -0.258804 0.266478 0.936085 90.9383 158.002)\" width=\"45\" x=\"415.86\" y=\"317.43\"/>\n  <path d=\"m794.86,204.75l4.69,-7.89l8.12,-4.55l9.38,0l8.12,4.55l4.69,7.89l0,9.11l-4.69,7.89l-8.12,4.55l-9.38,0l-8.12,-4.55l-4.69,-7.89l0,-9.11z\" fill=\"#666666\" id=\"svg_23\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m794.86,553.41l4.69,-7.89l8.12,-4.55l9.38,0l8.12,4.55l4.69,7.89l0,9.11l-4.69,7.89l-8.12,4.55l-9.38,0l-8.12,-4.55l-4.69,-7.89l0,-9.11z\" fill=\"#666666\" id=\"svg_22\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <line fill=\"none\" id=\"svg_21\" stroke=\"#666666\" stroke-width=\"10\" x1=\"812.36\" x2=\"812.36\" y1=\"221.24\" y2=\"303.8\"/>\n  <line fill=\"none\" id=\"svg_20\" stroke=\"#666666\" stroke-width=\"10\" x1=\"782.36\" x2=\"842.36\" y1=\"303.8\" y2=\"303.8\"/>\n  <line fill=\"none\" id=\"svg_19\" stroke=\"#666666\" stroke-width=\"10\" x1=\"812.36\" x2=\"812.36\" y1=\"454.82\" y2=\"541.74\"/>\n  <line fill=\"none\" id=\"svg_30\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"997.46\" x2=\"950.68\" y1=\"454.1\" y2=\"312.15\"/>\n  <rect fill=\"none\" height=\"88\" id=\"svg_29\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.964348 -0.26327 0.262011 0.935578 270.902 160.143)\" width=\"45\" x=\"594.76\" y=\"367.77\"/>\n  <path d=\"m980.57,204.75l4.69,-7.89l8.12,-4.55l9.38,0l8.12,4.55l4.69,7.89l0,9.11l-4.69,7.89l-8.12,4.55l-9.38,0l-8.12,-4.55l-4.69,-7.89l0,-9.11z\" fill=\"#666666\" id=\"svg_28\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m980.57,553.41l4.69,-7.89l8.12,-4.55l9.38,0l8.12,4.55l4.69,7.89l0,9.11l-4.69,7.89l-8.12,4.55l-9.38,0l-8.12,-4.55l-4.69,-7.89l0,-9.11z\" fill=\"#666666\" id=\"svg_27\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <line fill=\"none\" id=\"svg_26\" stroke=\"#666666\" stroke-width=\"10\" x1=\"998.07\" x2=\"998.07\" y1=\"221.24\" y2=\"303.8\"/>\n  <line fill=\"none\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"10\" x1=\"968.07\" x2=\"1028.07\" y1=\"303.8\" y2=\"303.8\"/>\n  <line fill=\"none\" id=\"svg_24\" stroke=\"#666666\" stroke-width=\"10\" x1=\"998.07\" x2=\"998.07\" y1=\"454.82\" y2=\"541.74\"/>\n </g>"},"protection_fuse_1p.svg":{"vb":"4.04 51.66 437.92 467.11","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Continuous Vertical Stem -->\n  <!-- Fuse Box Body -->\n  <!-- Center: (225, 242.2). Dimensions: Width 53.85, Height 95.73 -->\n  <!-- Text Labels -->\n  <!-- \"1\" Terminal Label -->\n  <!-- \"2\" Terminal Label -->\n  <!-- \"-F1\" Label Rotated -90deg -->\n  <path d=\"m207.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.964646 -2 51.5631)\"/>\n  <path d=\"m207.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.964646 -2 51.5631)\"/>\n  <line fill=\"none\" id=\"svg_stem\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -2 51.5631)\" x1=\"225\" x2=\"225\" y1=\"75\" y2=\"405\"/>\n  <rect fill=\"none\" height=\"95.8\" id=\"svg_fuse_box\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.964646 -2 51.5631)\" width=\"53.8\" x=\"198.1\" y=\"194.3\"/>\n </g>"},"protection_fuse_2p.svg":{"vb":"-1.86 0.22 453.72 483.97","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <path d=\"m108.8,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m108.8,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m306.2,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m306.2,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <!-- Continuous Vertical Stems -->\n  <line fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"126.3\" x2=\"126.3\" y1=\"75\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"323.7\" x2=\"323.7\" y1=\"75\" y2=\"405\"/>\n  <!-- Fuse Box Bodies -->\n  <!-- Center Y: 242.2. Height: 92.7. Width: 50.9 -->\n  <rect fill=\"none\" height=\"92.7\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" width=\"50.9\" x=\"100.85\" y=\"195.85\"/>\n  <rect fill=\"none\" height=\"92.7\" id=\"svg_fuse_box2\" stroke=\"#666666\" stroke-width=\"10\" width=\"50.9\" x=\"298.25\" y=\"195.85\"/>\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"1\" Terminal Label -->\n  <!-- \"2\" Terminal Label -->\n  <!-- \"3\" Terminal Label -->\n  <!-- \"4\" Terminal Label -->\n  <!-- \"-F2\" Label Rotated -90deg -->\n </g>"},"protection_fuse_3p.svg":{"vb":"40.04 51.45 497.92 469.52","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Continuous Vertical Stems -->\n  <!-- Fuse Box Bodies -->\n  <!-- Center Y: 242.2. Height: 95.8. Width: 53.8 -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-F3\" Label Rotated -90deg -->\n  <path d=\"m73,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.969697 19 51.3397)\"/>\n  <path d=\"m73,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.969697 19 51.3397)\"/>\n  <path d=\"m252.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.969697 19 51.3397)\"/>\n  <path d=\"m252.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.969697 19 51.3397)\"/>\n  <path d=\"m432,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.969697 19 51.3397)\"/>\n  <path d=\"m432,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.969697 19 51.3397)\"/>\n  <line fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 19 51.3397)\" x1=\"90.5\" x2=\"90.5\" y1=\"75\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 19 51.3397)\" x1=\"270\" x2=\"270\" y1=\"75\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_stem3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 19 51.3397)\" x1=\"449.5\" x2=\"449.5\" y1=\"75\" y2=\"405\"/>\n  <rect fill=\"none\" height=\"95.8\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 19 51.3397)\" width=\"53.8\" x=\"63.6\" y=\"194.3\"/>\n  <rect fill=\"none\" height=\"95.8\" id=\"svg_fuse_box2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 19 51.3397)\" width=\"53.8\" x=\"243.1\" y=\"194.3\"/>\n  <rect fill=\"none\" height=\"95.8\" id=\"svg_fuse_box3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.969697 19 51.3397)\" width=\"53.8\" x=\"422.6\" y=\"194.3\"/>\n </g>"},"protection_fuse_4p.svg":{"vb":"27.46 50.12 677.57 470.44","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Continuous Vertical Stems -->\n  <!-- Fuse Box Bodies -->\n  <!-- Text Labels -->\n  <!-- \"-F4\" Label Rotated -90deg -->\n  <path d=\"m74.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.971627 5 49.9973)\"/>\n  <path d=\"m74.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.971627 5 49.9973)\"/>\n  <path d=\"m254,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.971627 5 49.9973)\"/>\n  <path d=\"m254,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.971627 5 49.9973)\"/>\n  <path d=\"m433.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.971627 5 49.9973)\"/>\n  <path d=\"m433.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.971627 5 49.9973)\"/>\n  <path d=\"m613,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.971627 5 49.9973)\"/>\n  <path d=\"m613,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.971627 5 49.9973)\"/>\n  <line fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971627 5 49.9973)\" x1=\"92\" x2=\"92\" y1=\"75\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971627 5 49.9973)\" x1=\"271.5\" x2=\"271.5\" y1=\"75\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_stem3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971627 5 49.9973)\" x1=\"451\" x2=\"451\" y1=\"75\" y2=\"405\"/>\n  <line fill=\"none\" id=\"svg_stem4\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971627 5 49.9973)\" x1=\"630.5\" x2=\"630.5\" y1=\"75\" y2=\"405\"/>\n  <rect fill=\"none\" height=\"95.8\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971627 5 49.9973)\" width=\"53.8\" x=\"65.1\" y=\"194.3\"/>\n  <rect fill=\"none\" height=\"95.8\" id=\"svg_fuse_box2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971627 5 49.9973)\" width=\"53.8\" x=\"244.6\" y=\"194.3\"/>\n  <rect fill=\"none\" height=\"95.8\" id=\"svg_fuse_box3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971627 5 49.9973)\" width=\"53.8\" x=\"424.1\" y=\"194.3\"/>\n  <rect fill=\"none\" height=\"95.8\" id=\"svg_fuse_box4\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1 0 0 0.971627 5 49.9973)\" width=\"53.8\" x=\"603.6\" y=\"194.3\"/>\n </g>"},"protection_motor_circuit_breaker_2p.svg":{"vb":"344.18 21.86 866.43 924.19","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems -->\n  <!-- Circuit Breaker 'X' Symbols -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Connectors from Flapper to Protection Box -->\n  <!-- Protection Main Box (Thermal/Magnetic) -->\n  <!-- Thermal Overload Pulses -->\n  <!-- Magnetic Overcurrent Vectors (I>) -->\n  <!-- Bottom Stems -->\n  <!-- Mechanism Actuator Box -->\n  <!-- Left Latch (Manual Handle Indicator) -->\n  <!-- Dashed Mechanical Linkages -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-Q6\" Label Rotated -90deg -->\n  <path d=\"m586.75,292.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\"/>\n  <path d=\"m586.75,651.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\"/>\n  <path d=\"m766.25,292.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\"/>\n  <path d=\"m766.25,651.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.74654 0 0 1.92345 -362.657 -432.012)\" x1=\"604.25\" x2=\"604.25\" y1=\"309\" y2=\"376\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.74654 0 0 1.92345 -362.657 -432.012)\" x1=\"783.75\" x2=\"783.75\" y1=\"309\" y2=\"376\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\" x1=\"592.95\" x2=\"615.55\" y1=\"352.7\" y2=\"375.3\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\" x1=\"592.95\" x2=\"615.55\" y1=\"375.3\" y2=\"352.7\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\" x1=\"772.45\" x2=\"795.05\" y1=\"352.7\" y2=\"375.3\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\" x1=\"772.45\" x2=\"795.05\" y1=\"375.3\" y2=\"352.7\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1.74654 0 0 1.92345 -362.657 -432.012)\" x1=\"604.25\" x2=\"577.25\" y1=\"456\" y2=\"376\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1.74654 0 0 1.92345 -362.657 -432.012)\" x1=\"783.75\" x2=\"756.75\" y1=\"456\" y2=\"376\"/>\n  <line fill=\"none\" id=\"svg_conn1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.74654 0 0 1.92345 -362.657 -432.012)\" x1=\"604.25\" x2=\"604.25\" y1=\"456\" y2=\"482\"/>\n  <line fill=\"none\" id=\"svg_conn2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.74654 0 0 1.92345 -362.657 -432.012)\" x1=\"783.75\" x2=\"783.75\" y1=\"456\" y2=\"482\"/>\n  <rect fill=\"none\" height=\"107\" id=\"svg_prot_box\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.74654 0 0 1.92345 -362.657 -432.012)\" width=\"229.5\" x=\"579.25\" y=\"482\"/>\n  <line fill=\"none\" id=\"svg_prot_divider\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.74654 0 0 1.92345 -362.657 -432.012)\" x1=\"579.25\" x2=\"808.75\" y1=\"536\" y2=\"536\"/>\n  <path d=\"m604.25,497l25,0l0,30l-25,0l0,9\" fill=\"none\" id=\"svg_thermal1\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"8\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\"/>\n  <path d=\"m783.75,497l25,0l0,30l-25,0l0,9\" fill=\"none\" id=\"svg_thermal2\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"8\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\"/>\n  <g fill=\"none\" id=\"svg_5\" stroke=\"#000000\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"5\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012) matrix(1 0 0 1 469 234)\">\n   <path d=\"m129.75,318l0,22m-5,-22l10,0m-10,22l10,0\" id=\"svg_6\" stroke=\"#666666\"/>\n   <path d=\"m144.75,320l15,9l-15,9\" id=\"svg_7\" stroke=\"#666666\"/>\n   <path d=\"m309.25,318l0,22m-5,-22l10,0m-10,22l10,0\" id=\"svg_8\" stroke=\"#666666\"/>\n   <path d=\"m324.75,320l15,9l-15,9\" id=\"svg_9\" stroke=\"#666666\"/>\n  </g>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.74654 0 0 1.92345 -362.657 -432.012)\" x1=\"604.25\" x2=\"604.25\" y1=\"589\" y2=\"639\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.74654 0 0 1.92345 -362.657 -432.012)\" x1=\"783.75\" x2=\"783.75\" y1=\"589\" y2=\"639\"/>\n  <rect fill=\"none\" height=\"50\" id=\"svg_mech_box\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.74654 0 0 1.92345 -362.657 -432.012)\" width=\"50\" x=\"508.75\" y=\"376\"/>\n  <line fill=\"none\" id=\"svg_mech_cross_v\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\" x1=\"533.75\" x2=\"533.75\" y1=\"376\" y2=\"426\"/>\n  <line fill=\"none\" id=\"svg_mech_cross_h\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.74654 0 0 1.92345 -362.657 -432.012)\" x1=\"508.75\" x2=\"558.75\" y1=\"401\" y2=\"401\"/>\n  <line fill=\"none\" id=\"svg_latch_v\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1.05417 0 0 1 -27.3509 0) matrix(1.65679 0 0 1.92345 -318.077 -432.012)\" x1=\"496.75\" x2=\"496.75\" y1=\"391\" y2=\"411\"/>\n  <line fill=\"none\" id=\"svg_latch_h\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" transform=\"matrix(1.74654 0 0 1.92345 -362.657 -432.012)\" x1=\"496.75\" x2=\"508.75\" y1=\"401\" y2=\"401\"/>\n  <line fill=\"none\" id=\"svg_dash_top\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" transform=\"matrix(1.74654 0 0 1.92345 -362.657 -432.012)\" x1=\"558.75\" x2=\"770.25\" y1=\"401\" y2=\"401\"/>\n  <line fill=\"none\" id=\"svg_dash_vert\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" transform=\"matrix(1.74654 0 0 1.92345 -362.657 -432.012)\" x1=\"533.75\" x2=\"533.75\" y1=\"426\" y2=\"562.5\"/>\n  <line fill=\"none\" id=\"svg_dash_mid\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" transform=\"matrix(1.74654 0 0 1.92345 -362.657 -432.012)\" x1=\"533.75\" x2=\"579.25\" y1=\"509\" y2=\"509\"/>\n  <line fill=\"none\" id=\"svg_dash_bot\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" transform=\"matrix(1.74654 0 0 1.92345 -362.657 -432.012)\" x1=\"533.75\" x2=\"579.25\" y1=\"562.5\" y2=\"562.5\"/>\n </g>"},"protection_motor_circuit_breaker_3p.svg":{"vb":"340.09 131.53 512.32 411.37","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Top Stems -->\n  <!-- Circuit Breaker 'X' Symbols -->\n  <!-- Switch Flappers (Normally Open) -->\n  <!-- Connectors from Flapper to Protection Box -->\n  <!-- Protection Main Box (Thermal/Magnetic) -->\n  <!-- Thermal Overload Pulses -->\n  <!-- Magnetic Overcurrent Vectors (I>) -->\n  <!-- Bottom Stems -->\n  <!-- Mechanism Actuator Box -->\n  <!-- Left Latch (Manual Handle Indicator) -->\n  <!-- Dashed Mechanical Linkages -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-Q5\" Label Rotated -90deg -->\n  <path d=\"m413,123.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\"/>\n  <path d=\"m442.8,485.4l4.34,-6.88l7.52,-3.98l8.68,0l7.52,3.98l4.34,6.88l0,7.95l-4.34,6.88l-7.52,3.98l-8.68,0l-7.52,-3.98l-4.34,-6.88l0,-7.95z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m592.5,123.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\"/>\n  <path d=\"m608.98,485.4l4.34,-6.88l7.52,-3.98l8.68,0l7.52,3.98l4.34,6.88l0,7.95l-4.34,6.88l-7.52,3.98l-8.68,0l-7.52,-3.98l-4.34,-6.88l0,-7.95z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m772,123.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\"/>\n  <path d=\"m775.15,485.4l4.34,-6.88l7.52,-3.98l8.68,0l7.52,3.98l4.34,6.88l0,7.95l-4.34,6.88l-7.52,3.98l-8.68,0l-7.52,-3.98l-4.34,-6.88l0,-7.95z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" x1=\"430.5\" x2=\"430.5\" y1=\"132.92\" y2=\"199.92\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" x1=\"610\" x2=\"610\" y1=\"134.1\" y2=\"201.1\"/>\n  <line fill=\"none\" id=\"svg_stem_top3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" x1=\"789.5\" x2=\"789.5\" y1=\"131.74\" y2=\"198.74\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" x1=\"419.2\" x2=\"441.8\" y1=\"183.7\" y2=\"206.3\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" x1=\"419.2\" x2=\"441.8\" y1=\"206.3\" y2=\"183.7\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" x1=\"598.7\" x2=\"621.3\" y1=\"183.7\" y2=\"206.3\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" x1=\"598.7\" x2=\"621.3\" y1=\"206.3\" y2=\"183.7\"/>\n  <line fill=\"none\" id=\"svg_cb_x3_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" x1=\"778.2\" x2=\"800.8\" y1=\"183.7\" y2=\"206.3\"/>\n  <line fill=\"none\" id=\"svg_cb_x3_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" x1=\"778.2\" x2=\"800.8\" y1=\"206.3\" y2=\"183.7\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" x1=\"430.5\" x2=\"403.5\" y1=\"287\" y2=\"207\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" x1=\"610\" x2=\"583\" y1=\"287\" y2=\"207\"/>\n  <line fill=\"none\" id=\"svg_flapper3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" x1=\"789.5\" x2=\"762.5\" y1=\"287\" y2=\"207\"/>\n  <line fill=\"none\" id=\"svg_conn1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" x1=\"430.5\" x2=\"430.5\" y1=\"287\" y2=\"313\"/>\n  <line fill=\"none\" id=\"svg_conn2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" x1=\"610\" x2=\"610\" y1=\"287\" y2=\"313\"/>\n  <line fill=\"none\" id=\"svg_conn3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" x1=\"789.5\" x2=\"789.5\" y1=\"287\" y2=\"313\"/>\n  <rect fill=\"none\" height=\"107\" id=\"svg_prot_box\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" width=\"409\" x=\"405.5\" y=\"313\"/>\n  <line fill=\"none\" id=\"svg_prot_divider\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" x1=\"405.5\" x2=\"814.5\" y1=\"367\" y2=\"367\"/>\n  <path d=\"m430.5,328l25,0l0,30l-25,0l0,9\" fill=\"none\" id=\"svg_thermal1\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"8\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\"/>\n  <path d=\"m610,328l25,0l0,30l-25,0l0,9\" fill=\"none\" id=\"svg_thermal2\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"8\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\"/>\n  <path d=\"m789.5,328l25,0l0,30l-25,0l0,9\" fill=\"none\" id=\"svg_thermal3\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"8\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\"/>\n  <g fill=\"none\" id=\"svg_8\" stroke=\"#000000\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"5\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832) matrix(1 0 0 1 340 65)\">\n   <path d=\"m85,318l0,22m-5,-22l10,0m-10,22l10,0\" id=\"svg_9\" stroke=\"#666666\"/>\n   <path d=\"m100,320l15,9l-15,9\" id=\"svg_10\" stroke=\"#666666\"/>\n   <path d=\"m264.5,318l0,22m-5,-22l10,0m-10,22l10,0\" id=\"svg_11\" stroke=\"#666666\"/>\n   <path d=\"m279.5,320l15,9l-15,9\" id=\"svg_12\" stroke=\"#666666\"/>\n   <path d=\"m444,318l0,22m-5,-22l10,0m-10,22l10,0\" id=\"svg_13\" stroke=\"#666666\"/>\n   <path d=\"m459,320l15,9l-15,9\" id=\"svg_14\" stroke=\"#666666\"/>\n  </g>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"459\" x2=\"459\" y1=\"432.82\" y2=\"475.21\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"625.18\" x2=\"625.18\" y1=\"432.82\" y2=\"475.21\"/>\n  <line fill=\"none\" id=\"svg_stem_bot3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"791.36\" x2=\"791.36\" y1=\"432.82\" y2=\"475.21\"/>\n  <rect fill=\"none\" height=\"50\" id=\"svg_mech_box\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" width=\"50\" x=\"355\" y=\"207\"/>\n  <line fill=\"none\" id=\"svg_mech_cross_v\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" x1=\"380\" x2=\"380\" y1=\"207\" y2=\"257\"/>\n  <line fill=\"none\" id=\"svg_mech_cross_h\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" x1=\"355\" x2=\"405\" y1=\"232\" y2=\"232\"/>\n  <line fill=\"none\" id=\"svg_latch_v\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" x1=\"343\" x2=\"343\" y1=\"222\" y2=\"242\"/>\n  <line fill=\"none\" id=\"svg_latch_h\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"8\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" x1=\"343\" x2=\"355\" y1=\"232\" y2=\"232\"/>\n  <line fill=\"none\" id=\"svg_dash_top\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"10\" x1=\"435.4\" x2=\"771.91\" y1=\"273.45\" y2=\"273.45\"/>\n  <line fill=\"none\" id=\"svg_dash_vert\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"8\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" x1=\"380\" x2=\"380\" y1=\"257\" y2=\"393.5\"/>\n  <line fill=\"none\" id=\"svg_dash_mid\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"8\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" x1=\"380\" x2=\"405.5\" y1=\"340\" y2=\"340\"/>\n  <line fill=\"none\" id=\"svg_dash_bot\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"8\" transform=\"matrix(0.925769 0 0 0.847716 60.4613 76.7832)\" x1=\"380\" x2=\"405.5\" y1=\"393.5\" y2=\"393.5\"/>\n </g>"},"protection_thermal_overload_relay_2p.svg":{"vb":"8.51 53.59 438.98 468.24","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <!-- Main Enclosure Box -->\n  <!-- Continuous Thermal Overload Stems (Pole 1 & Pole 2) -->\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-F5\" Label Rotated -90deg -->\n  <path d=\"m120.75,97.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.967005 0 15.7785)\"/>\n  <path d=\"m120.75,456.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.967005 0 15.7785)\"/>\n  <path d=\"m300.25,97.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.967005 0 15.7785)\"/>\n  <path d=\"m300.25,456.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1 0 0 0.967005 0 15.7785)\"/>\n  <rect fill=\"none\" height=\"100\" id=\"svg_prot_box\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.967005 0 15.7785)\" width=\"279.5\" x=\"88.25\" y=\"229\"/>\n  <path d=\"m138.25,114l0,140l30,0l0,50l-30,0l0,140\" fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.967005 0 15.7785)\"/>\n  <path d=\"m317.75,114l0,140l30,0l0,50l-30,0l0,140\" fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-width=\"8\" transform=\"matrix(1 0 0 0.967005 0 15.7785)\"/>\n </g>"},"protection_thermal_overload_relay_3p.svg":{"vb":"-3.22 0.22 546.44 483.97","inner":"<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- Terminal Nodes -->\n  <path d=\"m73,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m73,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m252.5,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m252.5,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m432,58.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m432,417.02l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <!-- Main Enclosure Box -->\n  <rect fill=\"none\" height=\"100\" id=\"svg_prot_box\" stroke=\"#666666\" stroke-width=\"10\" width=\"459\" x=\"40.5\" y=\"190\"/>\n  <!-- Continuous Thermal Overload Stems (Poles 1, 2, 3) -->\n  <path d=\"m90.5,75l0,140l30,0l0,50l-30,0l0,140\" fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"m270,75l0,140l30,0l0,50l-30,0l0,140\" fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"m449.5,75l0,140l30,0l0,50l-30,0l0,140\" fill=\"none\" id=\"svg_stem3\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <!-- Text Labels (Vector Paths) -->\n  <!-- \"-F3\" Label Rotated -90deg -->\n </g>"},"motor_dc_motor(1).svg":{"vb":"12.29 -56.73 650.76 694.14","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <title>sunil</title>\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- 2 Vertical Polygon Terminal Nodes (1, 2) -->\n  <!-- Vertical Stems (1, 2) -->\n  <!-- DC Motor Main Circle (Center = 225,285, Radius = 133.04px, Diameter = 266.08px) -->\n  <!-- Inner Motor Marking: M and DC Symbol (solid line + 3 dashes) -->\n  <path d=\"m136.26,133.19l5.32,-8.62l9.22,-4.98l10.65,0l9.22,4.98l5.32,8.62l0,9.95l-5.32,8.62l-9.22,4.98l-10.65,0l-9.22,-4.98l-5.32,-8.62l0,-9.95z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.26272 0 0 1.33304 -23.6819 -100.36) matrix(1.18591 0 0 1.19159 -12.6819 -62.1724)\"/>\n  <path d=\"m378.57,96.35l6.31,-10.27l10.93,-5.93l12.63,0l10.93,5.93l6.31,10.27l0,11.86l-6.31,10.27l-10.93,5.93l-12.63,0l-10.93,-5.93l-6.31,-10.27l0,-11.86z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.26272 0 0 1.33304 -23.6819 -100.36)\"/>\n  <circle cx=\"234\" cy=\"336\" fill=\"none\" id=\"svg_motor_circle\" r=\"139.2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.26272 0 0 1.33304 -23.6819 -100.36) matrix(1.34636 0 0 1.26457 -28.8811 -96.4025)\"/>\n  <line fill=\"none\" id=\"svg_t1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.26272 0 0 1.33304 -23.6819 -100.36) matrix(1.18591 0 0 1.19159 -12.6819 -62.1724)\" x1=\"155.62\" x2=\"155.62\" y1=\"124.98\" y2=\"209.66\"/>\n  <line fill=\"none\" id=\"svg_t2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.26272 0 0 1.33304 -23.6819 -100.36) matrix(1.18591 0 0 1.19159 -12.6819 -62.1724)\" x1=\"348.29\" x2=\"348.29\" y1=\"127.79\" y2=\"210.53\"/>\n  <path d=\"m220.92,320.53l0,-61.12l12.91,0l18.27,52.93l18.09,-52.93l12.91,0l0,61.12l-8.61,0l0,-51.08l-18.1,51.08l-8.76,0l-18.1,-51.08l0,51.08l-8.61,0z\" fill=\"#666666\" id=\"svg_m\" stroke-width=\"5\" transform=\"matrix(1.26272 0 0 1.33304 -23.6819 -100.36) matrix(1.18591 0 0 1.19159 -12.6819 -62.1724)\"/>\n  <line fill=\"none\" id=\"svg_dc_solid\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.26272 0 0 1.33304 -23.6819 -100.36) matrix(1.18591 0 0 1.19159 -12.6819 -62.1724)\" x1=\"204.27\" x2=\"299.73\" y1=\"363.15\" y2=\"363.15\"/>\n  <line fill=\"none\" id=\"svg_dc_dash1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.26272 0 0 1.33304 -23.6819 -100.36) matrix(1.18591 0 0 1.19159 -12.6819 -62.1724)\" x1=\"204.27\" x2=\"225.65\" y1=\"397.78\" y2=\"397.78\"/>\n  <line fill=\"none\" id=\"svg_dc_dash2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.26272 0 0 1.33304 -23.6819 -100.36) matrix(1.18591 0 0 1.19159 -12.6819 -62.1724)\" x1=\"241.32\" x2=\"262.68\" y1=\"397.78\" y2=\"397.78\"/>\n  <line fill=\"none\" id=\"svg_dc_dash3\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.26272 0 0 1.33304 -23.6819 -100.36) matrix(1.18591 0 0 1.19159 -12.6819 -62.1724)\" x1=\"278.35\" x2=\"299.73\" y1=\"397.78\" y2=\"397.78\"/>\n </g>"},"motor_single_phase(1).svg":{"vb":"-6.78 -57.05 661.24 705.32","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <title>sunil</title>\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- 3 Polygon Terminal Nodes (1, 2, PE) -->\n  <!-- Top Stems (1, 2) -->\n  <!-- PE Stem, Horizontal Lead, and Concentric Curved Arc -->\n  <!-- Motor Main Circle (Center = 195,260, Radius = 133.04px, Diameter = 266.08px) -->\n  <!-- Inner Motor Marking: M1 ~ -->\n  <path d=\"m117.5,80.31l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.5868 0 0 1.73333 -30.8383 -109.865)\"/>\n  <path d=\"m237.5,80.31l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.5868 0 0 1.73333 -30.8383 -109.865)\"/>\n  <path d=\"m357.5,80.31l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.5868 0 0 1.73333 -30.8383 -109.865)\"/>\n  <line fill=\"none\" id=\"svg_t1\" stroke=\"#666666\" stroke-width=\"7\" transform=\"matrix(1.36011 0 0 1.50131 0.264266 -90.6159)\" x1=\"135\" x2=\"135\" y1=\"85\" y2=\"141.26\"/>\n  <line fill=\"none\" id=\"svg_t2\" stroke=\"#666666\" stroke-width=\"5\" transform=\"matrix(2.04017 0 0 1.50052 -147.448 -90.526)\" x1=\"255\" x2=\"255\" y1=\"85\" y2=\"141.26\"/>\n  <path d=\"m375,85l0,175l-18.26,0\" fill=\"none\" id=\"svg_pe_stem\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.5868 0 0 1.73333 -30.8383 -109.865)\"/>\n  <path d=\"m349.77,213.04a161.74,161.74 0 0 1 0,93.92\" fill=\"none\" id=\"svg_pe_arc\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1.5868 0 0 1.73333 -30.8383 -109.865)\"/>\n  <circle cx=\"195\" cy=\"260\" fill=\"none\" id=\"svg_motor_circle\" r=\"139.2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.5868 0 0 1.73333 -30.8383 -109.865)\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"76\" font-weight=\"normal\" id=\"svg_m1\" stroke-width=\"5\" text-anchor=\"middle\" transform=\"matrix(1.5868 0 0 1.73333 -30.8383 -109.865)\" x=\"158.5\" y=\"284\">M1</text>\n  <path d=\"m229,265c8,-14 16,-14 23.5,0c7.5,14 15.5,14 23.5,0\" fill=\"none\" id=\"svg_ac_tilde\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"6.5\" transform=\"matrix(1.5868 0 0 1.73333 -30.8383 -109.865)\"/>\n </g>"},"motor_three_phase(1).svg":{"vb":"32.85 33.3 793.24 696.71","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <title>sunil</title>\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- 3 Polygon Terminal Nodes (U, V, W) -->\n  <!-- Top Stems (U, V, W) -->\n  <!-- Motor Main Circle (Center = 225,255, Radius = 139.5px, Diameter = 279px) -->\n  <!-- Inner Motor Marking: M3 ~ -->\n  <path d=\"m95.78,114.75l6.36,-11.39l11.01,-6.58l12.72,0l11.01,6.58l6.36,11.39l0,13.15l-6.36,11.39l-11.01,6.58l-12.72,0l-11.01,-6.58l-6.36,-11.39l0,-13.15z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.26542 0 0 1.20252 -24.7026 -19.5901)\"/>\n  <path d=\"m258.49,114.75l6.36,-11.39l11.01,-6.58l12.72,0l11.01,6.58l6.36,11.39l0,13.15l-6.36,11.39l-11.01,6.58l-12.72,0l-11.01,-6.58l-6.36,-11.39l0,-13.15z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.26542 0 0 1.20252 -24.7026 -19.5901)\"/>\n  <path d=\"m421.19,114.75l6.36,-11.39l11.01,-6.58l12.72,0l11.01,6.58l6.36,11.39l0,13.15l-6.36,11.39l-11.01,6.58l-12.72,0l-11.01,-6.58l-6.36,-11.39l0,-13.15z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.26542 0 0 1.20252 -24.7026 -19.5901)\"/>\n  <line fill=\"none\" id=\"svg_u\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.26542 0 0 1.20252 -24.7026 -19.5901)\" x1=\"119.51\" x2=\"119.51\" y1=\"121.33\" y2=\"273.98\"/>\n  <line fill=\"none\" id=\"svg_v\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.26542 0 0 1.20252 -24.7026 -19.5901)\" x1=\"282.22\" x2=\"282.22\" y1=\"121.33\" y2=\"178.12\"/>\n  <line fill=\"none\" id=\"svg_w\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.26542 0 0 1.20252 -24.7026 -19.5901)\" x1=\"444.92\" x2=\"444.92\" y1=\"121.33\" y2=\"273.98\"/>\n  <circle cx=\"230.32\" cy=\"403.22\" fill=\"none\" id=\"svg_motor_circle\" r=\"139.2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.71574 0 0 1.68628 -62.7552 -250.102)\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"58\" font-weight=\"bold\" id=\"svg_m3\" text-anchor=\"middle\" transform=\"matrix(1.26542 0 0 1.20252 -24.7026 -19.5901) matrix(1.21104 0 0 1.26356 -17.8328 -125.586) matrix(1.11959 0 0 1.10979 -10.1056 -52.316)\" x=\"191.32\" y=\"424.22\">M3</text>\n  <path d=\"m310.69,373.74c13.56,-32.25 27.12,-32.25 40.68,0c13.56,32.25 27.12,32.25 40.68,0\" fill=\"none\" id=\"svg_ac_tilde\" stroke=\"#666666\" stroke-width=\"7.5\" transform=\"matrix(1.26542 0 0 1.20252 -24.7026 -19.5901)\"/>\n  <path d=\"m492.39,192.42l5.25,-9.01l9.09,-5.2l10.5,0l9.09,5.2l5.25,9.01l0,10.41l-5.25,9.01l-9.09,5.2l-10.5,0l-9.09,-5.2l-5.25,-9.01l0,-10.41z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.26542 0 0 1.20252 -24.7026 -19.5901) matrix(1 0 0 1 0 -2.85714) matrix(1.21104 0 0 1.26356 -17.8328 -125.586)\"/>\n  <path d=\"m511.98,197.63l0,199.76l-84.31,0\" fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.26542 0 0 1.20252 -24.7026 -19.5901) matrix(1 0 0 1 0 -2.85714) matrix(1.21104 0 0 1.26356 -17.8328 -125.586)\"/>\n  <path d=\"m420.08,331.03a184.4,231.6 0 0 1 0,131.62\" fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1.26542 0 0 1.20252 -24.7026 -19.5901) matrix(1 0 0 1 0 -2.85714) matrix(1.21104 0 0 1.26356 -17.8328 -125.586)\"/>\n </g>"},"motor_three_phase1.svg":{"vb":"-2.43 -2.59 454.86 485.18","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <title>sunil</title>\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- 6 Polygon Terminal Nodes (U1, V1, W1 at top; W2, U2, V2 at bottom) -->\n  <path d=\"m87.5,55.31l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m207.5,55.31l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m327.5,55.31l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m87.5,415.31l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m207.5,415.31l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m327.5,415.31l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <!-- Top Stems (U1, V1, W1) -->\n  <line fill=\"none\" id=\"svg_u1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"105\" x2=\"105\" y1=\"60\" y2=\"166.7\"/>\n  <line fill=\"none\" id=\"svg_v1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"225\" x2=\"225\" y1=\"60\" y2=\"99.4\"/>\n  <line fill=\"none\" id=\"svg_w1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"345\" x2=\"345\" y1=\"60\" y2=\"166.7\"/>\n  <!-- Bottom Stems (W2, U2, V2) -->\n  <line fill=\"none\" id=\"svg_w2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"105\" x2=\"105\" y1=\"313.3\" y2=\"420\"/>\n  <line fill=\"none\" id=\"svg_u2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"225\" x2=\"225\" y1=\"380.6\" y2=\"420\"/>\n  <line fill=\"none\" id=\"svg_v2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"345\" x2=\"345\" y1=\"313.3\" y2=\"420\"/>\n  <!-- Motor Main Circle (Center = 225,240, Radius = 140.6px, Diameter = 281.2px) -->\n  <circle cx=\"225\" cy=\"240\" fill=\"none\" id=\"svg_motor_circle\" r=\"140.6\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <!-- Inner Motor Markings: M3 ~ and Star/Delta -->\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"64\" font-weight=\"bold\" id=\"svg_m3\" stroke=\"#666666\" text-anchor=\"middle\" x=\"185\" y=\"238\">M3</text>\n  <path d=\"m245,218c10,-20 20,-20 30,0c10,20 20,20 30,0\" fill=\"none\" id=\"svg_ac_tilde\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"24\" font-weight=\"bold\" id=\"svg_stardelta\" stroke=\"#666666\" text-anchor=\"middle\" x=\"225\" y=\"282\">Star/Delta</text>\n  <!-- Terminal Green Labels -->\n  <!-- Device Label Rotated (-M1) -->\n </g>"},"motor_three_phase_star_delta(1).svg":{"vb":"50.48 36.27 655.74 699.46","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <title>sunil</title>\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- 7 Polygon Terminal Nodes (U1, V1, W1, PE at top; W2, U2, V2 at bottom) -->\n  <!-- Top Stems (U1, V1, W1) -->\n  <!-- Bottom Stems (W2, U2, V2) -->\n  <!-- PE Stem, Horizontal Lead, and Concentric Curved Arc -->\n  <!-- Motor Main Circle (Center = 220,240, Radius = 134.1px, Diameter = 268.2px) -->\n  <!-- Inner Motor Markings: M3 ~ and Star/Delta -->\n  <path d=\"m66.5,77.31l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.35026 0 0 1.44836 24.0323 6.52897)\"/>\n  <path d=\"m186.5,77.31l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.35026 0 0 1.44836 24.0323 6.52897)\"/>\n  <path d=\"m306.5,77.31l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.35026 0 0 1.44836 24.0323 6.52897)\"/>\n  <path d=\"m426.5,77.31l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.35026 0 0 1.44836 24.0323 6.52897)\"/>\n  <path d=\"m66.5,437.31l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.35026 0 0 1.44836 24.0323 6.52897)\"/>\n  <path d=\"m186.5,437.31l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.35026 0 0 1.44836 24.0323 6.52897)\"/>\n  <path d=\"m306.5,437.31l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.35026 0 0 1.44836 24.0323 6.52897)\"/>\n  <line fill=\"none\" id=\"svg_u1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.35026 0 0 1.32378 24.0323 16.2289)\" x1=\"84\" x2=\"84\" y1=\"82\" y2=\"202.14\"/>\n  <line fill=\"none\" id=\"svg_v1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.35026 0 0 1.44836 24.0323 6.52897)\" x1=\"204\" x2=\"204\" y1=\"82\" y2=\"127.9\"/>\n  <line fill=\"none\" id=\"svg_w1\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.35026 0 0 1.36271 24.0323 13.1977)\" x1=\"324\" x2=\"324\" y1=\"82\" y2=\"202.14\"/>\n  <line fill=\"none\" id=\"svg_w2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"137.45\" x2=\"137.45\" y1=\"487.7\" y2=\"661.71\"/>\n  <line fill=\"none\" id=\"svg_u2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.35026 0 0 1.44836 24.0323 6.52897)\" x1=\"204\" x2=\"204\" y1=\"396.1\" y2=\"442\"/>\n  <line fill=\"none\" id=\"svg_v2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.35026 0 0 1.33935 24.0323 55.1643)\" x1=\"324\" x2=\"324\" y1=\"321.86\" y2=\"442\"/>\n  <path d=\"m444,82l0,180l-75.3,0\" fill=\"none\" id=\"svg_pe_stem\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.35026 0 0 1.44836 24.0323 6.52897)\"/>\n  <path d=\"m361.91,215.2a164.7,164.7 0 0 1 0,93.6\" fill=\"none\" id=\"svg_pe_arc\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" transform=\"matrix(1.35026 0 0 1.44836 24.0323 6.52897)\"/>\n  <circle cx=\"220\" cy=\"240\" fill=\"none\" id=\"svg_motor_circle\" r=\"139.2\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.35026 0 0 1.44836 2.42816 38.393)\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"68\" font-weight=\"bold\" id=\"svg_m3\" stroke-width=\"5\" text-anchor=\"middle\" transform=\"matrix(1.35026 0 0 1.44836 24.0323 6.52897) matrix(1 0 0 1 -16 22)\" x=\"190\" y=\"233\">M3</text>\n  <path d=\"m236,238c8,-16 16,-16 24,0c8,16 16,16 24,0\" fill=\"none\" id=\"svg_ac_tilde\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" transform=\"matrix(1.35026 0 0 1.44836 24.0323 6.52897)\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"25\" font-weight=\"bold\" id=\"svg_stardelta\" stroke-width=\"5\" text-anchor=\"middle\" transform=\"matrix(1.35026 0 0 1.44836 24.0323 6.52897) matrix(1 0 0 1 -16 22)\" x=\"220\" y=\"280\">Star/Delta</text>\n </g>"},"proximity_sensor_npn_nc(1).svg":{"vb":"-45.55 -47.41 688.81 586.56","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- 3 Polygon Terminal Nodes at wire ends -->\n  <!-- Main Sensor Block (Square Box) -->\n  <!-- Internal Sensor Optics Symbol (Diamond / Beam Indicator) -->\n  <!-- Internal Normally Open (NO) Switch Symbol -->\n  <!-- Output Wires (BN, BK, BU) -->\n  <!-- All Text Converted to Pure Vector Paths -->\n  <g fill=\"none\" id=\"svg_switch\" stroke=\"#666666\" stroke-width=\"5\" transform=\"matrix(1.0972 0 0 1 -0.619982 0)\"/>\n  <path fill=\"#666666\" id=\"svg_txt_bn\"/>\n  <path fill=\"#666666\" id=\"svg_txt_bk\"/>\n  <path fill=\"#666666\" id=\"svg_txt_bu\"/>\n  <path fill=\"#666666\" id=\"svg_txt_npn\"/>\n  <path fill=\"#666666\" id=\"svg_txt_no\"/>\n  <rect fill=\"none\" height=\"200\" id=\"svg_box\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.54986 0 0 2.03924 -154.808 -299.454)\" width=\"180\" x=\"104\" y=\"151\"/>\n  <path d=\"m539.1,59.82l7.27,-16.56l12.58,-9.56l14.54,0l12.58,9.56l7.27,16.56l0,19.13l-7.27,16.56l-12.58,9.56l-14.54,0l-12.58,-9.56l-7.27,-16.56l0,-19.13z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m539.1,182.17l7.27,-16.56l12.58,-9.56l14.54,0l12.58,9.56l7.27,16.56l0,19.13l-7.27,16.56l-12.58,9.56l-14.54,0l-12.58,-9.56l-7.27,-16.56l0,-19.13z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <path d=\"m539.1,304.53l7.27,-16.56l12.58,-9.56l14.54,0l12.58,9.56l7.27,16.56l0,19.13l-7.27,16.56l-12.58,9.56l-14.54,0l-12.58,-9.56l-7.27,-16.56l0,-19.13z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"6\"/>\n  <g fill=\"none\" id=\"svg_optics\" stroke=\"#666666\" stroke-width=\"5\" transform=\"matrix(1.54986 0 0 2.03924 -154.808 -299.454)\">\n   <polygon id=\"svg_4\" points=\"145.87499237060547,157.12498950958252 175.87500762939453,187.12498950958252 145.87499237060547,217.12498950958252 115.8749771118164,187.12498950958252\" stroke-width=\"5\"/>\n   <line id=\"svg_5\" stroke-width=\"5\" transform=\"rotate(90.5429 156.61 186.088)\" x1=\"137.65\" x2=\"175.57\" y1=\"186.09\" y2=\"186.09\"/>\n   <line id=\"svg_6\" stroke-width=\"5\" x1=\"135.17\" x2=\"135.17\" y1=\"167.53\" y2=\"206.69\"/>\n  </g>\n  <line id=\"svg_7\" x1=\"108.67\" x2=\"139.67\" y1=\"220.55\" y2=\"220.55\"/>\n  <line id=\"svg_8\" x1=\"139.67\" x2=\"209.41\" y1=\"220.55\" y2=\"169.57\"/>\n  <line id=\"svg_9\" stroke-dasharray=\"6,6\" x1=\"209.41\" x2=\"232.66\" y1=\"220.55\" y2=\"220.55\"/>\n  <line fill=\"none\" id=\"svg_wire_bn\" stroke=\"#666666\" stroke-width=\"10\" x1=\"287.24\" x2=\"539.1\" y1=\"69.38\" y2=\"69.38\"/>\n  <line fill=\"none\" id=\"svg_wire_bk\" stroke=\"#666666\" stroke-width=\"10\" x1=\"287.24\" x2=\"539.1\" y1=\"191.74\" y2=\"191.74\"/>\n  <line fill=\"none\" id=\"svg_wire_bu\" stroke=\"#666666\" stroke-width=\"10\" x1=\"287.24\" x2=\"539.1\" y1=\"314.09\" y2=\"314.09\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"5\" x1=\"68.91\" x2=\"137.65\" y1=\"252.91\" y2=\"251.14\"/>\n  <line fill=\"none\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"5\" x1=\"189.45\" x2=\"265.59\" y1=\"250.14\" y2=\"250.14\"/>\n  <line fill=\"none\" id=\"svg_12\" stroke=\"#666666\" stroke-width=\"5\" x1=\"133.15\" x2=\"203.16\" y1=\"252.05\" y2=\"216.58\"/>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_13\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1.54986 0 0 2.03924 -79.3359 -295.908)\" x=\"142.61\" xml:space=\"preserve\" y=\"379.57\">NPN NO</text>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_14\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1.54986 0 0 2.03924 -135.865 -269.998)\" x=\"350.43\" xml:space=\"preserve\" y=\"156.96\">BN</text>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_15\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1.54986 0 0 2.03924 -144.475 -245.074)\" x=\"356.96\" xml:space=\"preserve\" y=\"206.09\">BK</text>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_16\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1.54986 0 0 2.03924 -135.865 -276.796)\" x=\"353.48\" xml:space=\"preserve\" y=\"281.3\">BU</text>\n  <line fill=\"none\" id=\"svg_17\" stroke=\"#666666\" stroke-width=\"5\" x1=\"191.97\" x2=\"191.97\" y1=\"249.86\" y2=\"219.27\"/>\n </g>"},"proximity_sensor_npn_no(1).svg":{"vb":"-45.61 -44.67 686.93 576.21","inner":"<!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->\n <g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <!-- 3 Polygon Terminal Nodes at wire ends -->\n  <!-- Main Sensor Block (Square Box) -->\n  <!-- Internal Sensor Optics Symbol (Diamond / Beam Indicator) -->\n  <!-- Internal Normally Open (NO) Switch Symbol -->\n  <!-- Output Wires (BN, BK, BU) -->\n  <!-- All Text Converted to Pure Vector Paths -->\n  <path d=\"m447.72,176.18l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\"/>\n  <path d=\"m447.72,236.18l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\"/>\n  <path d=\"m447.72,296.18l4.69,-8.12l8.12,-4.69l9.38,0l8.12,4.69l4.69,8.12l0,9.38l-4.69,8.12l-8.12,4.69l-9.38,0l-8.12,-4.69l-4.69,-8.12l0,-9.38z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"6\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\"/>\n  <rect fill=\"none\" height=\"200\" id=\"svg_box\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\" width=\"180\" x=\"104\" y=\"151\"/>\n  <g fill=\"none\" id=\"svg_optics\" stroke=\"#666666\" stroke-width=\"5\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\">\n   <polygon id=\"svg_4\" points=\"145.87499237060547,157.12498950958252 175.87500762939453,187.12498950958252 145.87499237060547,217.12498950958252 115.8749771118164,187.12498950958252\" stroke-width=\"5\"/>\n   <line id=\"svg_5\" stroke-width=\"5\" transform=\"rotate(90.5429 156.61 186.088)\" x1=\"137.65\" x2=\"175.57\" y1=\"186.09\" y2=\"186.09\"/>\n   <line id=\"svg_6\" stroke-width=\"5\" x1=\"135.17\" x2=\"135.17\" y1=\"167.53\" y2=\"206.69\"/>\n  </g>\n  <g fill=\"none\" id=\"svg_switch\" stroke=\"#666666\" stroke-width=\"5\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\"/>\n  <line id=\"svg_7\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\" x1=\"170\" x2=\"190\" y1=\"255\" y2=\"255\"/>\n  <line id=\"svg_8\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\" x1=\"190\" x2=\"235\" y1=\"255\" y2=\"230\"/>\n  <line id=\"svg_9\" stroke-dasharray=\"6,6\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\" x1=\"235\" x2=\"250\" y1=\"255\" y2=\"255\"/>\n  <line fill=\"none\" id=\"svg_wire_bn\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\" x1=\"285.22\" x2=\"447.72\" y1=\"180.87\" y2=\"180.87\"/>\n  <line fill=\"none\" id=\"svg_wire_bk\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\" x1=\"285.22\" x2=\"447.72\" y1=\"240.87\" y2=\"240.87\"/>\n  <line fill=\"none\" id=\"svg_wire_bu\" stroke=\"#666666\" stroke-width=\"10\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\" x1=\"285.22\" x2=\"447.72\" y1=\"300.87\" y2=\"300.87\"/>\n  <path fill=\"#666666\" id=\"svg_txt_bn\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\"/>\n  <path fill=\"#666666\" id=\"svg_txt_bk\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\"/>\n  <path fill=\"#666666\" id=\"svg_txt_bu\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\"/>\n  <path fill=\"#666666\" id=\"svg_txt_npn\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\"/>\n  <path fill=\"#666666\" id=\"svg_txt_no\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"5\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\" x1=\"144.35\" x2=\"188.7\" y1=\"270.87\" y2=\"270\"/>\n  <line fill=\"none\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"5\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\" x1=\"220.87\" x2=\"270\" y1=\"268.26\" y2=\"268.26\"/>\n  <line fill=\"none\" id=\"svg_12\" stroke=\"#666666\" stroke-width=\"5\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046)\" x1=\"187.83\" x2=\"229.57\" y1=\"269.57\" y2=\"244.78\"/>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_13\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046) matrix(1 0 0 1 48.6957 1.73913)\" x=\"142.61\" xml:space=\"preserve\" y=\"379.57\">NPN NO</text>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_14\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046) matrix(1 0 0 1 12.2222 14.4444)\" x=\"350.43\" xml:space=\"preserve\" y=\"156.96\">BN</text>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_15\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046) matrix(1 0 0 1 6.66667 26.6667)\" x=\"356.96\" xml:space=\"preserve\" y=\"206.09\">BK</text>\n  <text fill=\"#666666\" font-family=\"Sans-serif\" font-size=\"24\" id=\"svg_16\" stroke=\"#666666\" stroke-width=\"0\" text-anchor=\"middle\" transform=\"matrix(1.54927 0 0 2.00239 -155.634 -292.046) matrix(1 0 0 1 12.2222 11.1111)\" x=\"353.48\" xml:space=\"preserve\" y=\"281.3\">BU</text>\n </g>"}};

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

  if (asset === 'switch_no.svg' || asset === 'switch_pushbutton_no.svg' || asset === 'aux_contacts_no.svg') {
    setLine('#svg_flapper', 225, 312, 225, 167);
  } else if (asset === 'aux_contacts_off_delay _no.svg' || asset === 'aux_contacts_on_delay _no.svg') {
    setLine('#svg_flapper', 225, 309.7, 225, 174.7);
  } else if (asset === 'switch_nc.svg') {
    setLine('#svg_flapper', 225, 308, 175, 172);
  } else if (asset === 'switch_pushbutton_nc.svg') {
    setLine('#svg_flapper', 225, 308, 175, 172);
  } else if (asset === 'aux_contacts_nc.svg') {
    setLine('#svg_flapper', 225, 308, 180, 178);
  } else if (asset === 'aux_contacts_off_delay _nc.svg' || asset === 'aux_contacts_on_delay _nc.svg') {
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
      else if (st === '2') { el.setAttribute('x1', '412'); el.setAttribute('y1', '297.8'); el.setAttribute('x2', '270'); el.setAttribute('y2', '165'); }
    }
  } else if (asset === 'main_contacts_1p_no.svg') {
    setLine('#svg_flapper', 352, 358.82, 352, 221.03);
  } else if (asset === 'main_contacts_2p_no.svg') {
    setLine('#svg_flapper1', 135.25, 315.5, 135.25, 167.4);
    setLine('#svg_flapper2', 314.75, 315.5, 314.75, 167.4);
  } else if (asset === 'main_contacts_3p_no.svg') {
    setLine('#svg_flapper1', 90.5, 315.5, 90.5, 167.4);
    setLine('#svg_flapper2', 270, 315.5, 270, 167.4);
    setLine('#svg_flapper3', 449.5, 315.5, 449.5, 167.4);
  } else if (asset === 'main_contacts_4p_no.svg') {
    setLine('#svg_flapper1', 90.75, 315.5, 90.75, 167.4);
    setLine('#svg_flapper2', 270.25, 315.5, 270.25, 167.4);
    setLine('#svg_flapper3', 449.75, 315.5, 449.75, 167.4);
    setLine('#svg_flapper4', 629.25, 315.5, 629.25, 167.4);
  } else if (asset === 'protection_circuit_breaker_1p.svg') {
    setLine('#svg_flapper', 225, 298.9, 225, 174);
  } else if (asset === 'protection_circuit_breaker_2p.svg') {
    setLine('#svg_flapper1', 135.25, 298.9, 135.25, 174);
    setLine('#svg_flapper2', 314.75, 298.9, 314.75, 174);
  } else if (asset === 'protection_circuit_breaker_3p.svg') {
    setLine('#svg_flapper1', 90.5, 298.9, 90.5, 174);
    setLine('#svg_flapper2', 270, 298.9, 270, 174);
    setLine('#svg_flapper3', 449.5, 298.9, 449.5, 174);
  } else if (asset === 'protection_motor_circuit_breaker_2p.svg') {
    setLine('#svg_flapper1', 604.25, 456, 604.25, 376);
    setLine('#svg_flapper2', 783.75, 456, 783.75, 376);
  } else if (asset === 'protection_motor_circuit_breaker_3p.svg') {
    setLine('#svg_flapper1', 430.5, 287, 430.5, 200);
    setLine('#svg_flapper2', 610, 287, 610, 200);
    setLine('#svg_flapper3', 789.5, 287, 789.5, 200);
  } else if (asset.startsWith('protection_fuse_ isolator_')) {
    setLine('#svg_flapper1', 453.36, 436.19, 453.36, 281.43);
    setLine('#svg_13', 632.86, 436.19, 632.86, 281.43);
    setLine('#svg_10', 812.36, 454.1, 812.36, 303.8);
    setLine('#svg_30', 998.07, 454.1, 998.07, 303.8);
    [
      ['#svg_fuse_box1', 430.86, 330],
      ['#svg_14', 610.36, 330],
      ['#svg_11', 789.86, 335],
      ['#svg_29', 975.57, 335]
    ].forEach(([sel, rx, ry]) => {
      const box = ns.querySelector(sel);
      if (!box) return;
      saveOrigAttrs(box, ['x', 'y', 'transform']);
      if (st === '0') restoreOrigAttrs(box, ['x', 'y', 'transform']);
      else {
        box.setAttribute('transform', '');
        box.setAttribute('x', String(rx));
        box.setAttribute('y', String(ry));
      }
    });
  } else if (asset === 'proximity_sensor_npn_nc(1).svg') {
    setLine('#svg_8', 139.67, 220.55, 209.41, 220.55);
  } else if (asset === 'proximity_sensor_npn_no(1).svg') {
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

// Override Play and Stop buttons to use the full interactive circuit solver
document.getElementById('play').onclick = () => {
  const wires = [...document.querySelectorAll('#wireLayer .connected-wire')];
  if (!wires.length) {
    running = false;
    document.body.classList.remove('live');
    if (sim) { sim.textContent = '● OPEN CIRCUIT'; sim.classList.remove('running'); }
    if (motorState) motorState.textContent = 'Motor: OFF';
    if (state) state.textContent = 'OPEN CIRCUIT • CONNECT COMPONENT TERMINALS WITH WIRES FIRST';
    return;
  }
  running = true;
  render();
  evaluateCircuitSimulation();
};

document.getElementById('stop').onclick = () => {
  running = false;
  evaluateCircuitSimulation();
  render();
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
