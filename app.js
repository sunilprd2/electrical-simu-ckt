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
 const asset=getAssetBasename(g.dataset.symbolFile||g.dataset.porttype||g.dataset.type||'');
 const fieldRow=document.getElementById('detailFieldModelRow');
 const fieldModel=document.getElementById('detailFieldModel');
 const hasDcFieldModel=asset==='motor_dc_motor.svg';
 if(fieldRow)fieldRow.style.display=hasDcFieldModel?'':'none';
 if(fieldModel)fieldModel.value=g.dataset.motorFieldModel==='wound'?'wound':'permanent';
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
 let terminals=document.getElementById('detailTerminals').value.split(',').map(s=>s.trim()).filter(Boolean);
 const asset=getAssetBasename(g.dataset.symbolFile||g.dataset.porttype||g.dataset.type||'');
 if(asset==='motor_dc_motor.svg'){
  const fieldModel=document.getElementById('detailFieldModel')?.value==='wound'?'wound':'permanent';
  if(fieldModel==='wound'){
   g.dataset.motorFieldModel='wound';
   if(terminals.length<4)terminals=['A1','A2','F1','F2'];
  }else{
   const wasWound=g.dataset.motorFieldModel==='wound';
   delete g.dataset.motorFieldModel;
   if(wasWound&&terminals.length>=4)terminals=terminals.slice(0,2);
  }
 }else delete g.dataset.motorFieldModel;
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
const _threeDBtn=document.getElementById('threeD');if(_threeDBtn)_threeDBtn.onclick=()=>{if(state)state.textContent='2D PHYSICAL VIEW COMING SOON';};
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
 if(g){g.classList.add('selected');updateSelectionOutline(g);} if(typeof window.updateSelectedTerminalAxes==='function')window.updateSelectedTerminalAxes(g);
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
svg.addEventListener('drop',e=>{e.preventDefault();overlay.classList.remove('show');let raw=e.dataTransfer.getData('application/json')||e.dataTransfer.getData('text/plain');if(!raw)return;let d;try{d=JSON.parse(raw)}catch{return;}const p=getPoint(e);let sx=Math.round(p.x/12)*12,sy=Math.round(p.y/12)*12,bd=25;document.querySelectorAll('#dropLayer .dropped-symbol').forEach(o=>{const ox=Number(o.dataset.x||0),dd=Math.abs(p.x-ox);if(dd<bd){bd=dd;sx=ox;}});makeDropped(d,sx,sy);state.textContent='PLACED • '+d.name.toUpperCase();});
svg.addEventListener('pointerdown',e=>{if(e.target===svg)select(null)});
render();

/* V7–V98: Unified IEC symbol terminal geometry, terminal selection, and wire connection engine */
const _oldIconV7 = icon;
const SVG_TERMINAL_CATALOG = {"earth_ground(1).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_25", "label": "PE", "side": "top"}]}, "earth_ground.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_25", "label": "PE", "side": "top"}]}, "earth_pe(1).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_25", "label": "PE", "side": "bottom"}]}, "earth_pe.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_25", "label": "PE", "side": "bottom"}]}, "source_dc_negative(1).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_25", "label": "\u2212", "side": "bottom"}]}, "source_dc_negative.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_25", "label": "\u2212", "side": "bottom"}]}, "source_dc_positive(1).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_25", "label": "+", "side": "bottom"}]}, "source_dc_positive.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_25", "label": "+", "side": "bottom"}]}, "source_dc_supply_pair(1).svg": {"vb": [0, 0, 450.0, 472.5], "ports": [{"vx": 135.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_25", "label": "+", "side": "bottom"}, {"vx": 315.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_30", "label": "-", "side": "bottom"}]}, "source_dc_supply_pair.svg": {"vb": [0, 0, 450.0, 472.5], "ports": [{"vx": 135.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_25", "label": "+", "side": "bottom"}, {"vx": 315.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_30", "label": "-", "side": "bottom"}]}, "terminal_l1_l2_l3(1).svg": {"vb": [0, 0, 540.0, 472.5], "ports": [{"vx": 90.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_25", "label": "L1", "side": "bottom"}, {"vx": 270.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_30", "label": "L2", "side": "bottom"}, {"vx": 450.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "L3", "side": "bottom"}]}, "terminal_l1_l2_l3.svg": {"vb": [0, 0, 540.0, 472.5], "ports": [{"vx": 90.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_25", "label": "L1", "side": "bottom"}, {"vx": 270.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_30", "label": "L2", "side": "bottom"}, {"vx": 450.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "L3", "side": "bottom"}]}, "terminal_l1_l2_l3_n(1).svg": {"vb": [0, 0, 720.0, 472.5], "ports": [{"vx": 90.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_25", "label": "L1", "side": "bottom"}, {"vx": 270.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_30", "label": "L2", "side": "bottom"}, {"vx": 450.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "L3", "side": "bottom"}, {"vx": 630.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_8", "label": "N", "side": "bottom"}]}, "terminal_l1_l2_l3_n.svg": {"vb": [0, 0, 720.0, 472.5], "ports": [{"vx": 90.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_25", "label": "L1", "side": "bottom"}, {"vx": 270.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_30", "label": "L2", "side": "bottom"}, {"vx": 450.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "L3", "side": "bottom"}, {"vx": 630.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_8", "label": "N", "side": "bottom"}]}, "terminal_neutral_n(1).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_25", "label": "N", "side": "bottom"}]}, "terminal_neutral_n.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_25", "label": "N", "side": "bottom"}]}, "terminal_phase_l(1).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_25", "label": "L", "side": "bottom"}]}, "terminal_phase_l.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_25", "label": "L", "side": "bottom"}]}, "coil_contactor.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "A1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "A2", "side": "bottom"}]}, "coil_tof_timer.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "A1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_7", "label": "A2", "side": "bottom"}]}, "coil_ton_timer.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "A1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_8", "label": "A2", "side": "bottom"}]}, "coil_ton_tof_timer.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "A1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_10", "label": "A2", "side": "bottom"}]}, "aux_contacts_nc.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "21", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "22", "side": "bottom"}]}, "aux_contacts_no.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "13", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "14", "side": "bottom"}]}, "aux_contacts_off_delay_nc.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "65", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "66", "side": "bottom"}]}, "aux_contacts_off_delay_no.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "67", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "68", "side": "bottom"}]}, "aux_contacts_on_delay_nc.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "55", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "56", "side": "bottom"}]}, "aux_contacts_on_delay_no.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "57", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "58", "side": "bottom"}]}, "switch_3_position_selector i-0-ii(1).svg": {"vb": [0, 0, 540.0, 472.5], "ports": [{"vx": 270.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_term_1", "label": "11", "side": "top"}, {"vx": 90.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_term_2", "label": "12", "side": "bottom"}, {"vx": 450.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_term_3", "label": "14", "side": "bottom"}]}, "switch_3_position_selector i-0-ii.svg": {"vb": [0, 0, 540.0, 472.5], "ports": [{"vx": 270.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_term_1", "label": "11", "side": "top"}, {"vx": 90.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_term_2", "label": "12", "side": "bottom"}, {"vx": 450.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_term_3", "label": "14", "side": "bottom"}]}, "switch_3_position_selector i-ii-iii(1).svg": {"vb": [0, 0, 540.0, 472.5], "ports": [{"vx": 270.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "11", "side": "top"}, {"vx": 90.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "12", "side": "bottom"}, {"vx": 270.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "14", "side": "bottom"}, {"vx": 450.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "16", "side": "bottom"}]}, "switch_3_position_selector i-ii-iii.svg": {"vb": [0, 0, 540.0, 472.5], "ports": [{"vx": 270.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "11", "side": "top"}, {"vx": 90.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "12", "side": "bottom"}, {"vx": 270.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "14", "side": "bottom"}, {"vx": 450.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "16", "side": "bottom"}]}, "switch_con(1).svg": {"vb": [0, 0, 450.0, 472.5], "ports": [{"vx": 225.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "11", "side": "top"}, {"vx": 135.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "12", "side": "bottom"}, {"vx": 315.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "14", "side": "bottom"}]}, "switch_con.svg": {"vb": [0, 0, 450.0, 472.5], "ports": [{"vx": 225.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "11", "side": "top"}, {"vx": 135.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "12", "side": "bottom"}, {"vx": 315.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "14", "side": "bottom"}]}, "switch_nc(1).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "11", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "12", "side": "bottom"}]}, "switch_nc.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "11", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "12", "side": "bottom"}]}, "switch_no(1).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "13", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "14", "side": "bottom"}]}, "switch_no.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "13", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "14", "side": "bottom"}]}, "switch_pushbutton_con(1).svg": {"vb": [0, 0, 450.0, 472.5], "ports": [{"vx": 225.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "11", "side": "top"}, {"vx": 135.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "12", "side": "bottom"}, {"vx": 315.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "14", "side": "bottom"}]}, "switch_pushbutton_con.svg": {"vb": [0, 0, 450.0, 472.5], "ports": [{"vx": 225.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "11", "side": "top"}, {"vx": 135.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "12", "side": "bottom"}, {"vx": 315.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "14", "side": "bottom"}]}, "switch_pushbutton_nc(1).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "11", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "12", "side": "bottom"}]}, "switch_pushbutton_nc.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "11", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "12", "side": "bottom"}]}, "switch_pushbutton_no(1).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "13", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "14", "side": "bottom"}]}, "switch_pushbutton_no.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "13", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "14", "side": "bottom"}]}, "load_beacon(2).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "X1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_8", "label": "X2", "side": "bottom"}]}, "load_beacon.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "X1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_8", "label": "X2", "side": "bottom"}]}, "load_bell(2).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "X1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "X2", "side": "bottom"}]}, "load_bell.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "X1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "X2", "side": "bottom"}]}, "load_blinking_pilot_lamp(2).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "X1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_8", "label": "X2", "side": "bottom"}]}, "load_blinking_pilot_lamp.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "X1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_8", "label": "X2", "side": "bottom"}]}, "load_buzzer(2).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "X1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "X2", "side": "bottom"}]}, "load_buzzer.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "X1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "X2", "side": "bottom"}]}, "load_light(2).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "X1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_7", "label": "X2", "side": "bottom"}]}, "load_light.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "X1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_7", "label": "X2", "side": "bottom"}]}, "main_contacts_1p_no(1).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}]}, "main_contacts_1p_no.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}]}, "main_contacts_2p_no(1).svg": {"vb": [0, 0, 450.0, 472.5], "ports": [{"vx": 135.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 315.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 135.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 315.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}]}, "main_contacts_2p_no.svg": {"vb": [0, 0, 450.0, 472.5], "ports": [{"vx": 135.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 315.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 135.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 315.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}]}, "main_contacts_3p_no(1).svg": {"vb": [0, 0, 540.0, 472.5], "ports": [{"vx": 90.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 270.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 450.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "5", "side": "top"}, {"vx": 90.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 270.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}, {"vx": 450.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_6", "label": "6", "side": "bottom"}]}, "main_contacts_3p_no.svg": {"vb": [0, 0, 540.0, 472.5], "ports": [{"vx": 90.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 270.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 450.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "5", "side": "top"}, {"vx": 90.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 270.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}, {"vx": 450.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_6", "label": "6", "side": "bottom"}]}, "protection_circuit_breaker_1p(1).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}]}, "protection_circuit_breaker_1p.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}]}, "protection_circuit_breaker_2p(1).svg": {"vb": [0, 0, 450.0, 472.5], "ports": [{"vx": 135.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 315.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 135.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 315.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}]}, "protection_circuit_breaker_2p.svg": {"vb": [0, 0, 450.0, 472.5], "ports": [{"vx": 135.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 315.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 135.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 315.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}]}, "protection_circuit_breaker_3p(1).svg": {"vb": [0, 0, 540.0, 472.5], "ports": [{"vx": 90.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 270.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 450.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "5", "side": "top"}, {"vx": 90.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 270.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}, {"vx": 450.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_6", "label": "6", "side": "bottom"}]}, "protection_circuit_breaker_3p.svg": {"vb": [0, 0, 540.0, 472.5], "ports": [{"vx": 90.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 270.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 450.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "5", "side": "top"}, {"vx": 90.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 270.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}, {"vx": 450.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_6", "label": "6", "side": "bottom"}]}, "protection_fuse_1p(1).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}]}, "protection_fuse_1p.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}]}, "protection_fuse_2p(1).svg": {"vb": [0, 0, 450.0, 472.5], "ports": [{"vx": 135.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 315.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 135.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 315.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}]}, "protection_fuse_2p.svg": {"vb": [0, 0, 450.0, 472.5], "ports": [{"vx": 135.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 315.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 135.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 315.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}]}, "protection_fuse_3p(1).svg": {"vb": [0, 0, 540.0, 472.5], "ports": [{"vx": 90.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 270.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 450.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "5", "side": "top"}, {"vx": 90.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 270.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}, {"vx": 450.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_6", "label": "6", "side": "bottom"}]}, "protection_fuse_3p.svg": {"vb": [0, 0, 540.0, 472.5], "ports": [{"vx": 90.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 270.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 450.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "5", "side": "top"}, {"vx": 90.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 270.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}, {"vx": 450.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_6", "label": "6", "side": "bottom"}]}, "protection_fuse_4p(1).svg": {"vb": [0, 0, 720.0, 472.5], "ports": [{"vx": 90.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 270.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 450.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "5", "side": "top"}, {"vx": 630.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_7", "label": "7", "side": "top"}, {"vx": 90.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 270.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}, {"vx": 450.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_6", "label": "6", "side": "bottom"}, {"vx": 630.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_8", "label": "8", "side": "bottom"}]}, "protection_fuse_4p.svg": {"vb": [0, 0, 720.0, 472.5], "ports": [{"vx": 90.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 270.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 450.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "5", "side": "top"}, {"vx": 630.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_7", "label": "7", "side": "top"}, {"vx": 90.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 270.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}, {"vx": 450.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_6", "label": "6", "side": "bottom"}, {"vx": 630.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_8", "label": "8", "side": "bottom"}]}, "protection_fuse_isolator_1p(1).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}]}, "protection_fuse_isolator_1p.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}]}, "protection_fuse_isolator_2p(1).svg": {"vb": [0, 0, 450.0, 472.5], "ports": [{"vx": 135.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 315.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 135.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 315.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}]}, "protection_fuse_isolator_2p.svg": {"vb": [0, 0, 450.0, 472.5], "ports": [{"vx": 135.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 315.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 135.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 315.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}]}, "protection_fuse_isolator_3p(1).svg": {"vb": [0, 0, 540.0, 472.5], "ports": [{"vx": 90.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 270.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 450.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "5", "side": "top"}, {"vx": 90.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 270.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}, {"vx": 450.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_6", "label": "6", "side": "bottom"}]}, "protection_fuse_isolator_3p.svg": {"vb": [0, 0, 540.0, 472.5], "ports": [{"vx": 90.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 270.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 450.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "5", "side": "top"}, {"vx": 90.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 270.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}, {"vx": 450.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_6", "label": "6", "side": "bottom"}]}, "protection_fuse_isolator_4p(1).svg": {"vb": [0, 0, 720.0, 472.5], "ports": [{"vx": 90.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 270.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 450.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "5", "side": "top"}, {"vx": 630.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_7", "label": "7", "side": "top"}, {"vx": 90.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 270.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}, {"vx": 450.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_6", "label": "6", "side": "bottom"}, {"vx": 630.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_8", "label": "8", "side": "bottom"}]}, "protection_fuse_isolator_4p.svg": {"vb": [0, 0, 720.0, 472.5], "ports": [{"vx": 90.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 270.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 450.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "5", "side": "top"}, {"vx": 630.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_7", "label": "7", "side": "top"}, {"vx": 90.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 270.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}, {"vx": 450.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_6", "label": "6", "side": "bottom"}, {"vx": 630.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_8", "label": "8", "side": "bottom"}]}, "protection_motor_circuit_breaker_2p(1).svg": {"vb": [0, 0, 480.0, 472.5], "ports": [{"vx": 180.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 360.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 180.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 360.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}]}, "protection_motor_circuit_breaker_2p.svg": {"vb": [0, 0, 480.0, 472.5], "ports": [{"vx": 180.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 360.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 180.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 360.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}]}, "protection_motor_circuit_breaker_3p(1).svg": {"vb": [0, 0, 660.0, 472.5], "ports": [{"vx": 180.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 360.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 540.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "5", "side": "top"}, {"vx": 180.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 360.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}, {"vx": 540.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_6", "label": "6", "side": "bottom"}]}, "protection_motor_circuit_breaker_3p.svg": {"vb": [0, 0, 660.0, 472.5], "ports": [{"vx": 180.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 360.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 540.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "5", "side": "top"}, {"vx": 180.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 360.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}, {"vx": 540.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_6", "label": "6", "side": "bottom"}]}, "protection_thermal_overload_relay_2p(1).svg": {"vb": [0, 0, 450.0, 472.5], "ports": [{"vx": 135.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 315.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 135.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 315.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}]}, "protection_thermal_overload_relay_2p.svg": {"vb": [0, 0, 450.0, 472.5], "ports": [{"vx": 135.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 315.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 135.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 315.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}]}, "protection_thermal_overload_relay_3p(1).svg": {"vb": [0, 0, 540.0, 472.5], "ports": [{"vx": 90.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 270.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 450.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "5", "side": "top"}, {"vx": 90.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 270.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}, {"vx": 450.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_6", "label": "6", "side": "bottom"}]}, "protection_thermal_overload_relay_3p.svg": {"vb": [0, 0, 540.0, 472.5], "ports": [{"vx": 90.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "1", "side": "top"}, {"vx": 270.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "3", "side": "top"}, {"vx": 450.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "5", "side": "top"}, {"vx": 90.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "2", "side": "bottom"}, {"vx": 270.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "4", "side": "bottom"}, {"vx": 450.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_6", "label": "6", "side": "bottom"}]}, "motor_dc_motor(2).svg": {"vb": [0, 0, 560.0, 580.0], "ports": [{"vx": 190.0, "vy": 56.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "A1", "side": "top"}, {"vx": 370.0, "vy": 56.0, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "A2", "side": "top"}]}, "motor_dc_motor.svg": {"vb": [0, 0, 560.0, 580.0], "ports": [{"vx": 190.0, "vy": 56.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "A1", "side": "top"}, {"vx": 370.0, "vy": 56.0, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "A2", "side": "top"}]}, "motor_single_phase(2).svg": {"vb": [0, 0, 680.0, 580.0], "ports": [{"vx": 190.0, "vy": 56.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "U", "side": "top"}, {"vx": 370.0, "vy": 56.0, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "V", "side": "top"}, {"vx": 550.0, "vy": 56.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "PE", "side": "top"}]}, "motor_single_phase.svg": {"vb": [0, 0, 680.0, 580.0], "ports": [{"vx": 190.0, "vy": 56.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "U", "side": "top"}, {"vx": 370.0, "vy": 56.0, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "V", "side": "top"}, {"vx": 550.0, "vy": 56.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "PE", "side": "top"}]}, "motor_three_phase(2).svg": {"vb": [0, 0, 760.0, 580.0], "ports": [{"vx": 110.0, "vy": 56.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "U", "side": "top"}, {"vx": 290.0, "vy": 56.0, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "V", "side": "top"}, {"vx": 470.0, "vy": 56.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "W", "side": "top"}, {"vx": 650.0, "vy": 56.0, "vw": 20.0, "vh": 20.0, "tid": "svg_6", "label": "PE", "side": "top"}]}, "motor_three_phase.svg": {"vb": [0, 0, 760.0, 580.0], "ports": [{"vx": 110.0, "vy": 56.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "U", "side": "top"}, {"vx": 290.0, "vy": 56.0, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "V", "side": "top"}, {"vx": 470.0, "vy": 56.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "W", "side": "top"}, {"vx": 650.0, "vy": 56.0, "vw": 20.0, "vh": 20.0, "tid": "svg_6", "label": "PE", "side": "top"}]}, "motor_three_phase_star_delta(2).svg": {"vb": [0, 0, 760.0, 640.0], "ports": [{"vx": 110.0, "vy": 52.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "U1", "side": "top"}, {"vx": 290.0, "vy": 52.0, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "V1", "side": "top"}, {"vx": 470.0, "vy": 52.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "W1", "side": "top"}, {"vx": 650.0, "vy": 52.0, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "PE", "side": "top"}, {"vx": 110.0, "vy": 588.0, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "W2", "side": "bottom"}, {"vx": 290.0, "vy": 588.0, "vw": 20.0, "vh": 20.0, "tid": "svg_6", "label": "U2", "side": "bottom"}, {"vx": 470.0, "vy": 588.0, "vw": 20.0, "vh": 20.0, "tid": "svg_7", "label": "V2", "side": "bottom"}]}, "motor_three_phase_star_delta.svg": {"vb": [0, 0, 760.0, 640.0], "ports": [{"vx": 110.0, "vy": 52.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "U1", "side": "top"}, {"vx": 290.0, "vy": 52.0, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "V1", "side": "top"}, {"vx": 470.0, "vy": 52.0, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "W1", "side": "top"}, {"vx": 650.0, "vy": 52.0, "vw": 20.0, "vh": 20.0, "tid": "svg_4", "label": "PE", "side": "top"}, {"vx": 110.0, "vy": 588.0, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "W2", "side": "bottom"}, {"vx": 290.0, "vy": 588.0, "vw": 20.0, "vh": 20.0, "tid": "svg_6", "label": "U2", "side": "bottom"}, {"vx": 470.0, "vy": 588.0, "vw": 20.0, "vh": 20.0, "tid": "svg_7", "label": "V2", "side": "bottom"}]}, "proximity_sensor_npn_nc(2).svg": {"vb": [0, 0, 580.0, 472.5], "ports": [{"vx": 510.0, "vy": 116.25, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "BN", "side": "right"}, {"vx": 510.0, "vy": 236.25, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "BK", "side": "right"}, {"vx": 510.0, "vy": 356.25, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "BU", "side": "right"}]}, "proximity_sensor_npn_nc.svg": {"vb": [0, 0, 580.0, 472.5], "ports": [{"vx": 510.0, "vy": 116.25, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "BN", "side": "right"}, {"vx": 510.0, "vy": 236.25, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "BK", "side": "right"}, {"vx": 510.0, "vy": 356.25, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "BU", "side": "right"}]}, "proximity_sensor_npn_no(2).svg": {"vb": [0, 0, 580.0, 472.5], "ports": [{"vx": 510.0, "vy": 116.25, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "BN", "side": "right"}, {"vx": 510.0, "vy": 236.25, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "BK", "side": "right"}, {"vx": 510.0, "vy": 356.25, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "BU", "side": "right"}]}, "proximity_sensor_npn_no.svg": {"vb": [0, 0, 580.0, 472.5], "ports": [{"vx": 510.0, "vy": 116.25, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "BN", "side": "right"}, {"vx": 510.0, "vy": 236.25, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "BK", "side": "right"}, {"vx": 510.0, "vy": 356.25, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "BU", "side": "right"}]}, "coil_contactor(1).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "A1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "A2", "side": "bottom"}]}, "coil_tof_timer(1).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "A1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_7", "label": "A2", "side": "bottom"}]}, "coil_ton_timer(1).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "A1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_8", "label": "A2", "side": "bottom"}]}, "coil_ton_tof_timer(1).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "A1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_10", "label": "A2", "side": "bottom"}]}, "load_light(1).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "X1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_7", "label": "X2", "side": "bottom"}]}, "load_pilot_light.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "X1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_7", "label": "X2", "side": "bottom"}]}, "load_blinking_pilot_lamp(1).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "X1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_8", "label": "X2", "side": "bottom"}]}, "load_beacon(1).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "X1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_8", "label": "X2", "side": "bottom"}]}, "load_bell(1).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "X1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "X2", "side": "bottom"}]}, "load_buzzer(1).svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "X1", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_5", "label": "X2", "side": "bottom"}]}, "ac_to_dc_power_supply.svg": {"vb": [0, 0, 540.0, 472.5], "ports": [{"vx": 135.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_term_l", "label": "L", "side": "top"}, {"vx": 315.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_term_n", "label": "N", "side": "top"}, {"vx": 435.0, "vy": 236.25, "vw": 20.0, "vh": 20.0, "tid": "svg_term_pe", "label": "PE", "side": "right"}, {"vx": 135.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_term_pos", "label": "+", "side": "bottom"}, {"vx": 315.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_term_neg", "label": "-", "side": "bottom"}]}, "ac to dc power supply.svg": {"vb": [0, 0, 540.0, 472.5], "ports": [{"vx": 135.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_term_l", "label": "L", "side": "top"}, {"vx": 315.0, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_term_n", "label": "N", "side": "top"}, {"vx": 435.0, "vy": 236.25, "vw": 20.0, "vh": 20.0, "tid": "svg_term_pe", "label": "PE", "side": "right"}, {"vx": 135.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_term_pos", "label": "+", "side": "bottom"}, {"vx": 315.0, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_term_neg", "label": "-", "side": "bottom"}]}, "proximity_sensor_pnp_nc(2).svg": {"vb": [0, 0, 580.0, 472.5], "ports": [{"vx": 510.0, "vy": 116.25, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "BN", "side": "right"}, {"vx": 510.0, "vy": 236.25, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "BK", "side": "right"}, {"vx": 510.0, "vy": 356.25, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "BU", "side": "right"}]}, "proximity_sensor_pnp_nc.svg": {"vb": [0, 0, 580.0, 472.5], "ports": [{"vx": 510.0, "vy": 116.25, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "BN", "side": "right"}, {"vx": 510.0, "vy": 236.25, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "BK", "side": "right"}, {"vx": 510.0, "vy": 356.25, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "BU", "side": "right"}]}, "proximity_sensor_pnp_no(2).svg": {"vb": [0, 0, 580.0, 472.5], "ports": [{"vx": 510.0, "vy": 116.25, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "BN", "side": "right"}, {"vx": 510.0, "vy": 236.25, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "BK", "side": "right"}, {"vx": 510.0, "vy": 356.25, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "BU", "side": "right"}]}, "proximity_sensor_pnp_no.svg": {"vb": [0, 0, 580.0, 472.5], "ports": [{"vx": 510.0, "vy": 116.25, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "BN", "side": "right"}, {"vx": 510.0, "vy": 236.25, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "BK", "side": "right"}, {"vx": 510.0, "vy": 356.25, "vw": 20.0, "vh": 20.0, "tid": "svg_3", "label": "BU", "side": "right"}]}, "aux_contacts_thermal_nc.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "95", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "96", "side": "bottom"}]}, "aux_contacts_thermal_no.svg": {"vb": [0, 0, 435.0, 472.5], "ports": [{"vx": 217.5, "vy": 68.0, "vw": 20.0, "vh": 20.0, "tid": "svg_1", "label": "97", "side": "top"}, {"vx": 217.5, "vy": 404.5, "vw": 20.0, "vh": 20.0, "tid": "svg_2", "label": "98", "side": "bottom"}]}};
var SVG_INLINE_CATALOG = {"earth_ground(1).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"340\"/>\n  <line fill=\"none\" id=\"svg_g1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"149.5\" x2=\"285.5\" y1=\"340\" y2=\"340\"/>\n  <line fill=\"none\" id=\"svg_g2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"173.5\" x2=\"261.5\" y1=\"366\" y2=\"366\"/>\n  <line fill=\"none\" id=\"svg_g3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"197.5\" x2=\"237.5\" y1=\"392\" y2=\"392\"/>\n </g>"}, "earth_ground.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"340\"/>\n  <line fill=\"none\" id=\"svg_g1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"149.5\" x2=\"285.5\" y1=\"340\" y2=\"340\"/>\n  <line fill=\"none\" id=\"svg_g2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"173.5\" x2=\"261.5\" y1=\"366\" y2=\"366\"/>\n  <line fill=\"none\" id=\"svg_g3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"197.5\" x2=\"237.5\" y1=\"392\" y2=\"392\"/>\n </g>"}, "earth_pe(1).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <circle cx=\"217.5\" cy=\"110.0\" fill=\"none\" id=\"svg_11\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_1\" text-anchor=\"middle\" x=\"217.5\" y=\"122.0\">PE</text>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "earth_pe.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <circle cx=\"217.5\" cy=\"110.0\" fill=\"none\" id=\"svg_11\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_1\" text-anchor=\"middle\" x=\"217.5\" y=\"122.0\">PE</text>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "source_dc_negative(1).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <circle cx=\"217.5\" cy=\"110.0\" fill=\"none\" id=\"svg_11\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <line fill=\"none\" id=\"svg_8\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"197.5\" x2=\"237.5\" y1=\"110.0\" y2=\"110.0\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "source_dc_negative.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <circle cx=\"217.5\" cy=\"110.0\" fill=\"none\" id=\"svg_11\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <line fill=\"none\" id=\"svg_8\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"197.5\" x2=\"237.5\" y1=\"110.0\" y2=\"110.0\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "source_dc_positive(1).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <circle cx=\"217.5\" cy=\"110.0\" fill=\"none\" id=\"svg_11\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <line fill=\"none\" id=\"svg_8\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"197.5\" x2=\"237.5\" y1=\"110.0\" y2=\"110.0\"/>\n  <line fill=\"none\" id=\"svg_28\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"217.5\" x2=\"217.5\" y1=\"90.0\" y2=\"130.0\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "source_dc_positive.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <circle cx=\"217.5\" cy=\"110.0\" fill=\"none\" id=\"svg_11\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <line fill=\"none\" id=\"svg_8\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"197.5\" x2=\"237.5\" y1=\"110.0\" y2=\"110.0\"/>\n  <line fill=\"none\" id=\"svg_28\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"217.5\" x2=\"217.5\" y1=\"90.0\" y2=\"130.0\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "source_dc_supply_pair(1).svg": {"vb": "0 0 450.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <circle cx=\"135.0\" cy=\"110.0\" fill=\"none\" id=\"svg_11\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <line fill=\"none\" id=\"svg_8\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"115.0\" x2=\"155.0\" y1=\"110.0\" y2=\"110.0\"/>\n  <line fill=\"none\" id=\"svg_28\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"135.0\" x2=\"135.0\" y1=\"90.0\" y2=\"130.0\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" x1=\"135.0\" x2=\"135.0\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 131.18,390.25 L 138.82,390.25 L 145.43,394.07 L 149.25,400.68 L 149.25,408.32 L 145.43,414.93 L 138.82,418.75 L 131.18,418.75 L 124.57,414.93 L 120.75,408.32 L 120.75,400.68 L 124.57,394.07 Z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <circle cx=\"315.0\" cy=\"110.0\" fill=\"none\" id=\"svg_33\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <line fill=\"none\" id=\"svg_31\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"295.0\" x2=\"335.0\" y1=\"110.0\" y2=\"110.0\"/>\n  <line fill=\"none\" id=\"svg_32\" stroke=\"#666666\" stroke-width=\"10\" x1=\"315.0\" x2=\"315.0\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 311.18,390.25 L 318.82,390.25 L 325.43,394.07 L 329.25,400.68 L 329.25,408.32 L 325.43,414.93 L 318.82,418.75 L 311.18,418.75 L 304.57,414.93 L 300.75,408.32 L 300.75,400.68 L 304.57,394.07 Z\" fill=\"#666666\" id=\"svg_30\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "source_dc_supply_pair.svg": {"vb": "0 0 450.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <circle cx=\"135.0\" cy=\"110.0\" fill=\"none\" id=\"svg_11\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <line fill=\"none\" id=\"svg_8\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"115.0\" x2=\"155.0\" y1=\"110.0\" y2=\"110.0\"/>\n  <line fill=\"none\" id=\"svg_28\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"135.0\" x2=\"135.0\" y1=\"90.0\" y2=\"130.0\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" x1=\"135.0\" x2=\"135.0\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 131.18,390.25 L 138.82,390.25 L 145.43,394.07 L 149.25,400.68 L 149.25,408.32 L 145.43,414.93 L 138.82,418.75 L 131.18,418.75 L 124.57,414.93 L 120.75,408.32 L 120.75,400.68 L 124.57,394.07 Z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <circle cx=\"315.0\" cy=\"110.0\" fill=\"none\" id=\"svg_33\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <line fill=\"none\" id=\"svg_31\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"295.0\" x2=\"335.0\" y1=\"110.0\" y2=\"110.0\"/>\n  <line fill=\"none\" id=\"svg_32\" stroke=\"#666666\" stroke-width=\"10\" x1=\"315.0\" x2=\"315.0\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 311.18,390.25 L 318.82,390.25 L 325.43,394.07 L 329.25,400.68 L 329.25,408.32 L 325.43,414.93 L 318.82,418.75 L 311.18,418.75 L 304.57,414.93 L 300.75,408.32 L 300.75,400.68 L 304.57,394.07 Z\" fill=\"#666666\" id=\"svg_30\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "terminal_l1_l2_l3(1).svg": {"vb": "0 0 540.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <circle cx=\"90.0\" cy=\"110.0\" fill=\"none\" id=\"svg_c1\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_t1\" text-anchor=\"middle\" x=\"90.0\" y=\"122.0\">L1</text>\n  <line fill=\"none\" id=\"svg_s1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"90.0\" x2=\"90.0\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 86.18,390.25 L 93.82,390.25 L 100.43,394.07 L 104.25,400.68 L 104.25,408.32 L 100.43,414.93 L 93.82,418.75 L 86.18,418.75 L 79.57,414.93 L 75.75,408.32 L 75.75,400.68 L 79.57,394.07 Z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <circle cx=\"270.0\" cy=\"110.0\" fill=\"none\" id=\"svg_c2\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_t2\" text-anchor=\"middle\" x=\"270.0\" y=\"122.0\">L2</text>\n  <line fill=\"none\" id=\"svg_s2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 266.18,390.25 L 273.82,390.25 L 280.43,394.07 L 284.25,400.68 L 284.25,408.32 L 280.43,414.93 L 273.82,418.75 L 266.18,418.75 L 259.57,414.93 L 255.75,408.32 L 255.75,400.68 L 259.57,394.07 Z\" fill=\"#666666\" id=\"svg_30\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <circle cx=\"450.0\" cy=\"110.0\" fill=\"none\" id=\"svg_c3\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_t3\" text-anchor=\"middle\" x=\"450.0\" y=\"122.0\">L3</text>\n  <line fill=\"none\" id=\"svg_s3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"450.0\" x2=\"450.0\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 446.18,390.25 L 453.82,390.25 L 460.43,394.07 L 464.25,400.68 L 464.25,408.32 L 460.43,414.93 L 453.82,418.75 L 446.18,418.75 L 439.57,414.93 L 435.75,408.32 L 435.75,400.68 L 439.57,394.07 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "terminal_l1_l2_l3.svg": {"vb": "0 0 540.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <circle cx=\"90.0\" cy=\"110.0\" fill=\"none\" id=\"svg_c1\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_t1\" text-anchor=\"middle\" x=\"90.0\" y=\"122.0\">L1</text>\n  <line fill=\"none\" id=\"svg_s1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"90.0\" x2=\"90.0\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 86.18,390.25 L 93.82,390.25 L 100.43,394.07 L 104.25,400.68 L 104.25,408.32 L 100.43,414.93 L 93.82,418.75 L 86.18,418.75 L 79.57,414.93 L 75.75,408.32 L 75.75,400.68 L 79.57,394.07 Z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <circle cx=\"270.0\" cy=\"110.0\" fill=\"none\" id=\"svg_c2\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_t2\" text-anchor=\"middle\" x=\"270.0\" y=\"122.0\">L2</text>\n  <line fill=\"none\" id=\"svg_s2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 266.18,390.25 L 273.82,390.25 L 280.43,394.07 L 284.25,400.68 L 284.25,408.32 L 280.43,414.93 L 273.82,418.75 L 266.18,418.75 L 259.57,414.93 L 255.75,408.32 L 255.75,400.68 L 259.57,394.07 Z\" fill=\"#666666\" id=\"svg_30\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <circle cx=\"450.0\" cy=\"110.0\" fill=\"none\" id=\"svg_c3\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_t3\" text-anchor=\"middle\" x=\"450.0\" y=\"122.0\">L3</text>\n  <line fill=\"none\" id=\"svg_s3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"450.0\" x2=\"450.0\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 446.18,390.25 L 453.82,390.25 L 460.43,394.07 L 464.25,400.68 L 464.25,408.32 L 460.43,414.93 L 453.82,418.75 L 446.18,418.75 L 439.57,414.93 L 435.75,408.32 L 435.75,400.68 L 439.57,394.07 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "terminal_l1_l2_l3_n(1).svg": {"vb": "0 0 720.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <circle cx=\"90.0\" cy=\"110.0\" fill=\"none\" id=\"svg_c1\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_t1\" text-anchor=\"middle\" x=\"90.0\" y=\"122.0\">L1</text>\n  <line fill=\"none\" id=\"svg_s1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"90.0\" x2=\"90.0\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 86.18,390.25 L 93.82,390.25 L 100.43,394.07 L 104.25,400.68 L 104.25,408.32 L 100.43,414.93 L 93.82,418.75 L 86.18,418.75 L 79.57,414.93 L 75.75,408.32 L 75.75,400.68 L 79.57,394.07 Z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <circle cx=\"270.0\" cy=\"110.0\" fill=\"none\" id=\"svg_c2\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_t2\" text-anchor=\"middle\" x=\"270.0\" y=\"122.0\">L2</text>\n  <line fill=\"none\" id=\"svg_s2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 266.18,390.25 L 273.82,390.25 L 280.43,394.07 L 284.25,400.68 L 284.25,408.32 L 280.43,414.93 L 273.82,418.75 L 266.18,418.75 L 259.57,414.93 L 255.75,408.32 L 255.75,400.68 L 259.57,394.07 Z\" fill=\"#666666\" id=\"svg_30\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <circle cx=\"450.0\" cy=\"110.0\" fill=\"none\" id=\"svg_c3\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_t3\" text-anchor=\"middle\" x=\"450.0\" y=\"122.0\">L3</text>\n  <line fill=\"none\" id=\"svg_s3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"450.0\" x2=\"450.0\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 446.18,390.25 L 453.82,390.25 L 460.43,394.07 L 464.25,400.68 L 464.25,408.32 L 460.43,414.93 L 453.82,418.75 L 446.18,418.75 L 439.57,414.93 L 435.75,408.32 L 435.75,400.68 L 439.57,394.07 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <circle cx=\"630.0\" cy=\"110.0\" fill=\"none\" id=\"svg_c4\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_t4\" text-anchor=\"middle\" x=\"630.0\" y=\"122.0\">N</text>\n  <line fill=\"none\" id=\"svg_s4\" stroke=\"#666666\" stroke-width=\"10\" x1=\"630.0\" x2=\"630.0\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 626.18,390.25 L 633.82,390.25 L 640.43,394.07 L 644.25,400.68 L 644.25,408.32 L 640.43,414.93 L 633.82,418.75 L 626.18,418.75 L 619.57,414.93 L 615.75,408.32 L 615.75,400.68 L 619.57,394.07 Z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "terminal_l1_l2_l3_n.svg": {"vb": "0 0 720.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <circle cx=\"90.0\" cy=\"110.0\" fill=\"none\" id=\"svg_c1\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_t1\" text-anchor=\"middle\" x=\"90.0\" y=\"122.0\">L1</text>\n  <line fill=\"none\" id=\"svg_s1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"90.0\" x2=\"90.0\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 86.18,390.25 L 93.82,390.25 L 100.43,394.07 L 104.25,400.68 L 104.25,408.32 L 100.43,414.93 L 93.82,418.75 L 86.18,418.75 L 79.57,414.93 L 75.75,408.32 L 75.75,400.68 L 79.57,394.07 Z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <circle cx=\"270.0\" cy=\"110.0\" fill=\"none\" id=\"svg_c2\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_t2\" text-anchor=\"middle\" x=\"270.0\" y=\"122.0\">L2</text>\n  <line fill=\"none\" id=\"svg_s2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 266.18,390.25 L 273.82,390.25 L 280.43,394.07 L 284.25,400.68 L 284.25,408.32 L 280.43,414.93 L 273.82,418.75 L 266.18,418.75 L 259.57,414.93 L 255.75,408.32 L 255.75,400.68 L 259.57,394.07 Z\" fill=\"#666666\" id=\"svg_30\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <circle cx=\"450.0\" cy=\"110.0\" fill=\"none\" id=\"svg_c3\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_t3\" text-anchor=\"middle\" x=\"450.0\" y=\"122.0\">L3</text>\n  <line fill=\"none\" id=\"svg_s3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"450.0\" x2=\"450.0\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 446.18,390.25 L 453.82,390.25 L 460.43,394.07 L 464.25,400.68 L 464.25,408.32 L 460.43,414.93 L 453.82,418.75 L 446.18,418.75 L 439.57,414.93 L 435.75,408.32 L 435.75,400.68 L 439.57,394.07 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <circle cx=\"630.0\" cy=\"110.0\" fill=\"none\" id=\"svg_c4\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_t4\" text-anchor=\"middle\" x=\"630.0\" y=\"122.0\">N</text>\n  <line fill=\"none\" id=\"svg_s4\" stroke=\"#666666\" stroke-width=\"10\" x1=\"630.0\" x2=\"630.0\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 626.18,390.25 L 633.82,390.25 L 640.43,394.07 L 644.25,400.68 L 644.25,408.32 L 640.43,414.93 L 633.82,418.75 L 626.18,418.75 L 619.57,414.93 L 615.75,408.32 L 615.75,400.68 L 619.57,394.07 Z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "terminal_neutral_n(1).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <circle cx=\"217.5\" cy=\"110.0\" fill=\"none\" id=\"svg_11\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"38\" font-weight=\"bold\" id=\"svg_1\" text-anchor=\"middle\" x=\"217.5\" y=\"123.0\">N</text>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "terminal_neutral_n.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <circle cx=\"217.5\" cy=\"110.0\" fill=\"none\" id=\"svg_11\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"38\" font-weight=\"bold\" id=\"svg_1\" text-anchor=\"middle\" x=\"217.5\" y=\"123.0\">N</text>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "terminal_phase_l(1).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <circle cx=\"217.5\" cy=\"110.0\" fill=\"none\" id=\"svg_11\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"38\" font-weight=\"bold\" id=\"svg_1\" text-anchor=\"middle\" x=\"217.5\" y=\"123.0\">L</text>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "terminal_phase_l.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <circle cx=\"217.5\" cy=\"110.0\" fill=\"none\" id=\"svg_11\" r=\"36.0\" stroke=\"#666666\" stroke-width=\"9\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"38\" font-weight=\"bold\" id=\"svg_1\" text-anchor=\"middle\" x=\"217.5\" y=\"123.0\">L</text>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"146.0\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_25\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "coil_contactor.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"192.5\"/>\n  <rect fill=\"none\" height=\"87.5\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\" width=\"180.0\" x=\"127.5\" y=\"192.5\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"280.0\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "coil_tof_timer.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"192.5\"/>\n  <rect fill=\"none\" height=\"87.5\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\" width=\"185.0\" x=\"100.0\" y=\"192.5\"/>\n  <rect fill=\"#666666\" height=\"87.5\" id=\"svg_4\" stroke=\"none\" width=\"55.0\" x=\"100.0\" y=\"192.5\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"10\" x1=\"155.0\" x2=\"155.0\" y1=\"192.5\" y2=\"280.0\"/>\n  <line fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"280.0\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "coil_ton_timer.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"192.5\"/>\n  <rect fill=\"none\" height=\"87.5\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\" width=\"185.0\" x=\"100.0\" y=\"192.5\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"9\" x1=\"155.0\" x2=\"155.0\" y1=\"192.5\" y2=\"280.0\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"8\" x1=\"100.0\" x2=\"155.0\" y1=\"192.5\" y2=\"280.0\"/>\n  <line fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"8\" x1=\"155.0\" x2=\"100.0\" y1=\"192.5\" y2=\"280.0\"/>\n  <line fill=\"none\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"280.0\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "coil_ton_tof_timer.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"192.5\"/>\n  <rect fill=\"none\" height=\"87.5\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\" width=\"230.0\" x=\"70.0\" y=\"192.5\"/>\n  <rect fill=\"#666666\" height=\"87.5\" id=\"svg_4\" stroke=\"none\" width=\"46.0\" x=\"70.0\" y=\"192.5\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"9\" x1=\"116.0\" x2=\"116.0\" y1=\"192.5\" y2=\"280.0\"/>\n  <line fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"9\" x1=\"162.0\" x2=\"162.0\" y1=\"192.5\" y2=\"280.0\"/>\n  <line fill=\"none\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"8\" x1=\"116.0\" x2=\"162.0\" y1=\"192.5\" y2=\"280.0\"/>\n  <line fill=\"none\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"8\" x1=\"162.0\" x2=\"116.0\" y1=\"192.5\" y2=\"280.0\"/>\n  <line fill=\"none\" id=\"svg_9\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"280.0\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "aux_contacts_nc.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 217.5,76.0 L 217.5,168.0 L 271.5,168.0\" fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"217.5\" x2=\"263.5\" y1=\"304.0\" y2=\"160.0\"/>\n </g>"}, "aux_contacts_no.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"168.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"217.5\" x2=\"171.5\" y1=\"304.0\" y2=\"170.0\"/>\n </g>"}, "aux_contacts_off_delay_nc.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 217.5,76.0 L 217.5,168.0 L 271.5,168.0\" fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"217.5\" x2=\"263.5\" y1=\"304.0\" y2=\"160.0\"/>\n  <path d=\"M 132.5,202.0 A 26,34 0 0 1 132.5,270.0\" fill=\"none\" id=\"svg_contactor_c\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_contactor_l1\" stroke=\"#666666\" stroke-width=\"9\" x1=\"158.5\" x2=\"238.5\" y1=\"230.0\" y2=\"230.0\"/>\n  <line fill=\"none\" id=\"svg_contactor_l2\" stroke=\"#666666\" stroke-width=\"9\" x1=\"158.5\" x2=\"242.5\" y1=\"242.0\" y2=\"242.0\"/>\n </g>"}, "aux_contacts_off_delay_no.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"168.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"217.5\" x2=\"171.5\" y1=\"304.0\" y2=\"170.0\"/>\n  <path d=\"M 86.5,202.0 A 26,34 0 0 1 86.5,270.0\" fill=\"none\" id=\"svg_contactor_c\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_contactor_l1\" stroke=\"#666666\" stroke-width=\"9\" x1=\"112.5\" x2=\"192.5\" y1=\"230.0\" y2=\"230.0\"/>\n  <line fill=\"none\" id=\"svg_contactor_l2\" stroke=\"#666666\" stroke-width=\"9\" x1=\"112.5\" x2=\"196.5\" y1=\"242.0\" y2=\"242.0\"/>\n </g>"}, "aux_contacts_on_delay_nc.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 217.5,76.0 L 217.5,168.0 L 271.5,168.0\" fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"217.5\" x2=\"263.5\" y1=\"304.0\" y2=\"160.0\"/>\n  <path d=\"M 184.5,202.0 A 26,34 0 0 0 184.5,270.0\" fill=\"none\" id=\"svg_contactor_c\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_contactor_l1\" stroke=\"#666666\" stroke-width=\"9\" x1=\"158.5\" x2=\"238.5\" y1=\"230.0\" y2=\"230.0\"/>\n  <line fill=\"none\" id=\"svg_contactor_l2\" stroke=\"#666666\" stroke-width=\"9\" x1=\"158.5\" x2=\"242.5\" y1=\"242.0\" y2=\"242.0\"/>\n </g>"}, "aux_contacts_on_delay_no.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"168.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"217.5\" x2=\"171.5\" y1=\"304.0\" y2=\"170.0\"/>\n  <path d=\"M 138.5,202.0 A 26,34 0 0 0 138.5,270.0\" fill=\"none\" id=\"svg_contactor_c\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_contactor_l1\" stroke=\"#666666\" stroke-width=\"9\" x1=\"112.5\" x2=\"192.5\" y1=\"230.0\" y2=\"230.0\"/>\n  <line fill=\"none\" id=\"svg_contactor_l2\" stroke=\"#666666\" stroke-width=\"9\" x1=\"112.5\" x2=\"196.5\" y1=\"242.0\" y2=\"242.0\"/>\n </g>"}, "switch_3_position_selector i-0-ii(1).svg": {"vb": "0 0 540.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 266.18,53.75 L 273.82,53.75 L 280.43,57.57 L 284.25,64.18 L 284.25,71.82 L 280.43,78.43 L 273.82,82.25 L 266.18,82.25 L 259.57,78.43 L 255.75,71.82 L 255.75,64.18 L 259.57,57.57 Z\" fill=\"#666666\" id=\"svg_term_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 86.18,390.25 L 93.82,390.25 L 100.43,394.07 L 104.25,400.68 L 104.25,408.32 L 100.43,414.93 L 93.82,418.75 L 86.18,418.75 L 79.57,414.93 L 75.75,408.32 L 75.75,400.68 L 79.57,394.07 Z\" fill=\"#666666\" id=\"svg_term_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 446.18,390.25 L 453.82,390.25 L 460.43,394.07 L 464.25,400.68 L 464.25,408.32 L 460.43,414.93 L 453.82,418.75 L 446.18,418.75 L 439.57,414.93 L 435.75,408.32 L 435.75,400.68 L 439.57,394.07 Z\" fill=\"#666666\" id=\"svg_term_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"76.0\" y2=\"168.0\"/>\n  <path d=\"M 90.0,396.5 L 90.0,296 L 200,296\" fill=\"none\" id=\"svg_stem_2\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_floating_pad_3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"252\" x2=\"288\" y1=\"296\" y2=\"296\"/>\n  <path d=\"M 450.0,396.5 L 450.0,296 L 340,296\" fill=\"none\" id=\"svg_stem_3\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"190\" x2=\"270.0\" y1=\"304\" y2=\"168.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"130.0\" x2=\"230.0\" y1=\"236.0\" y2=\"236.0\"/>\n  <path d=\"M 154.0,208.0 L 130.0,208.0 L 130.0,264.0 L 106.0,264.0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"26\" font-weight=\"bold\" id=\"svg_selector_mode_text\" text-anchor=\"middle\" x=\"62.0\" y=\"340.0\">I-0-II</text>\n </g>"}, "switch_3_position_selector i-0-ii.svg": {"vb": "0 0 540.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 266.18,53.75 L 273.82,53.75 L 280.43,57.57 L 284.25,64.18 L 284.25,71.82 L 280.43,78.43 L 273.82,82.25 L 266.18,82.25 L 259.57,78.43 L 255.75,71.82 L 255.75,64.18 L 259.57,57.57 Z\" fill=\"#666666\" id=\"svg_term_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 86.18,390.25 L 93.82,390.25 L 100.43,394.07 L 104.25,400.68 L 104.25,408.32 L 100.43,414.93 L 93.82,418.75 L 86.18,418.75 L 79.57,414.93 L 75.75,408.32 L 75.75,400.68 L 79.57,394.07 Z\" fill=\"#666666\" id=\"svg_term_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 446.18,390.25 L 453.82,390.25 L 460.43,394.07 L 464.25,400.68 L 464.25,408.32 L 460.43,414.93 L 453.82,418.75 L 446.18,418.75 L 439.57,414.93 L 435.75,408.32 L 435.75,400.68 L 439.57,394.07 Z\" fill=\"#666666\" id=\"svg_term_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"76.0\" y2=\"168.0\"/>\n  <path d=\"M 90.0,396.5 L 90.0,296 L 200,296\" fill=\"none\" id=\"svg_stem_2\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_floating_pad_3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"252\" x2=\"288\" y1=\"296\" y2=\"296\"/>\n  <path d=\"M 450.0,396.5 L 450.0,296 L 340,296\" fill=\"none\" id=\"svg_stem_3\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"190\" x2=\"270.0\" y1=\"304\" y2=\"168.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"130.0\" x2=\"230.0\" y1=\"236.0\" y2=\"236.0\"/>\n  <path d=\"M 154.0,208.0 L 130.0,208.0 L 130.0,264.0 L 106.0,264.0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"26\" font-weight=\"bold\" id=\"svg_selector_mode_text\" text-anchor=\"middle\" x=\"62.0\" y=\"340.0\">I-0-II</text>\n </g>"}, "switch_3_position_selector i-ii-iii(1).svg": {"vb": "0 0 540.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 266.18,53.75 L 273.82,53.75 L 280.43,57.57 L 284.25,64.18 L 284.25,71.82 L 280.43,78.43 L 273.82,82.25 L 266.18,82.25 L 259.57,78.43 L 255.75,71.82 L 255.75,64.18 L 259.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 86.18,390.25 L 93.82,390.25 L 100.43,394.07 L 104.25,400.68 L 104.25,408.32 L 100.43,414.93 L 93.82,418.75 L 86.18,418.75 L 79.57,414.93 L 75.75,408.32 L 75.75,400.68 L 79.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 266.18,390.25 L 273.82,390.25 L 280.43,394.07 L 284.25,400.68 L 284.25,408.32 L 280.43,414.93 L 273.82,418.75 L 266.18,418.75 L 259.57,414.93 L 255.75,408.32 L 255.75,400.68 L 259.57,394.07 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 446.18,390.25 L 453.82,390.25 L 460.43,394.07 L 464.25,400.68 L 464.25,408.32 L 460.43,414.93 L 453.82,418.75 L 446.18,418.75 L 439.57,414.93 L 435.75,408.32 L 435.75,400.68 L 439.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"76.0\" y2=\"168.0\"/>\n  <path d=\"M 90.0,396.5 L 90.0,296 L 200,296\" fill=\"none\" id=\"svg_stem_2\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_stem_3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"396.5\" y2=\"296\"/>\n  <line fill=\"none\" id=\"svg_stem_3_t\" stroke=\"#666666\" stroke-width=\"10\" x1=\"252\" x2=\"288\" y1=\"296\" y2=\"296\"/>\n  <path d=\"M 450.0,396.5 L 450.0,296 L 340,296\" fill=\"none\" id=\"svg_stem_4\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"190\" x2=\"270.0\" y1=\"304\" y2=\"168.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"130.0\" x2=\"230.0\" y1=\"236.0\" y2=\"236.0\"/>\n  <path d=\"M 154.0,208.0 L 130.0,208.0 L 130.0,264.0 L 106.0,264.0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"26\" font-weight=\"bold\" id=\"svg_selector_mode_text\" text-anchor=\"middle\" x=\"62.0\" y=\"340.0\">I-II-III</text>\n </g>"}, "switch_3_position_selector i-ii-iii.svg": {"vb": "0 0 540.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 266.18,53.75 L 273.82,53.75 L 280.43,57.57 L 284.25,64.18 L 284.25,71.82 L 280.43,78.43 L 273.82,82.25 L 266.18,82.25 L 259.57,78.43 L 255.75,71.82 L 255.75,64.18 L 259.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 86.18,390.25 L 93.82,390.25 L 100.43,394.07 L 104.25,400.68 L 104.25,408.32 L 100.43,414.93 L 93.82,418.75 L 86.18,418.75 L 79.57,414.93 L 75.75,408.32 L 75.75,400.68 L 79.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 266.18,390.25 L 273.82,390.25 L 280.43,394.07 L 284.25,400.68 L 284.25,408.32 L 280.43,414.93 L 273.82,418.75 L 266.18,418.75 L 259.57,414.93 L 255.75,408.32 L 255.75,400.68 L 259.57,394.07 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 446.18,390.25 L 453.82,390.25 L 460.43,394.07 L 464.25,400.68 L 464.25,408.32 L 460.43,414.93 L 453.82,418.75 L 446.18,418.75 L 439.57,414.93 L 435.75,408.32 L 435.75,400.68 L 439.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"76.0\" y2=\"168.0\"/>\n  <path d=\"M 90.0,396.5 L 90.0,296 L 200,296\" fill=\"none\" id=\"svg_stem_2\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_stem_3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"396.5\" y2=\"296\"/>\n  <line fill=\"none\" id=\"svg_stem_3_t\" stroke=\"#666666\" stroke-width=\"10\" x1=\"252\" x2=\"288\" y1=\"296\" y2=\"296\"/>\n  <path d=\"M 450.0,396.5 L 450.0,296 L 340,296\" fill=\"none\" id=\"svg_stem_4\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"190\" x2=\"270.0\" y1=\"304\" y2=\"168.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"130.0\" x2=\"230.0\" y1=\"236.0\" y2=\"236.0\"/>\n  <path d=\"M 154.0,208.0 L 130.0,208.0 L 130.0,264.0 L 106.0,264.0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"26\" font-weight=\"bold\" id=\"svg_selector_mode_text\" text-anchor=\"middle\" x=\"62.0\" y=\"340.0\">I-II-III</text>\n </g>"}, "switch_con(1).svg": {"vb": "0 0 450.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 221.18,53.75 L 228.82,53.75 L 235.43,57.57 L 239.25,64.18 L 239.25,71.82 L 235.43,78.43 L 228.82,82.25 L 221.18,82.25 L 214.57,78.43 L 210.75,71.82 L 210.75,64.18 L 214.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 131.18,390.25 L 138.82,390.25 L 145.43,394.07 L 149.25,400.68 L 149.25,408.32 L 145.43,414.93 L 138.82,418.75 L 131.18,418.75 L 124.57,414.93 L 120.75,408.32 L 120.75,400.68 L 124.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 311.18,390.25 L 318.82,390.25 L 325.43,394.07 L 329.25,400.68 L 329.25,408.32 L 325.43,414.93 L 318.82,418.75 L 311.18,418.75 L 304.57,414.93 L 300.75,408.32 L 300.75,400.68 L 304.57,394.07 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" x1=\"225.0\" x2=\"225.0\" y1=\"76.0\" y2=\"168.0\"/>\n  <path d=\"M 135.0,396.5 L 135.0,296 L 195,296\" fill=\"none\" id=\"svg_stem_12\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 315.0,396.5 L 315.0,296 L 255,296\" fill=\"none\" id=\"svg_stem_14\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"185\" x2=\"225.0\" y1=\"304\" y2=\"168.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"117.0\" x2=\"205.0\" y1=\"236.0\" y2=\"236.0\"/>\n  <path d=\"M 141.0,208.0 L 117.0,208.0 L 117.0,264.0 L 93.0,264.0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n </g>"}, "switch_con.svg": {"vb": "0 0 450.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 221.18,53.75 L 228.82,53.75 L 235.43,57.57 L 239.25,64.18 L 239.25,71.82 L 235.43,78.43 L 228.82,82.25 L 221.18,82.25 L 214.57,78.43 L 210.75,71.82 L 210.75,64.18 L 214.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 131.18,390.25 L 138.82,390.25 L 145.43,394.07 L 149.25,400.68 L 149.25,408.32 L 145.43,414.93 L 138.82,418.75 L 131.18,418.75 L 124.57,414.93 L 120.75,408.32 L 120.75,400.68 L 124.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 311.18,390.25 L 318.82,390.25 L 325.43,394.07 L 329.25,400.68 L 329.25,408.32 L 325.43,414.93 L 318.82,418.75 L 311.18,418.75 L 304.57,414.93 L 300.75,408.32 L 300.75,400.68 L 304.57,394.07 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" x1=\"225.0\" x2=\"225.0\" y1=\"76.0\" y2=\"168.0\"/>\n  <path d=\"M 135.0,396.5 L 135.0,296 L 195,296\" fill=\"none\" id=\"svg_stem_12\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 315.0,396.5 L 315.0,296 L 255,296\" fill=\"none\" id=\"svg_stem_14\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"185\" x2=\"225.0\" y1=\"304\" y2=\"168.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"117.0\" x2=\"205.0\" y1=\"236.0\" y2=\"236.0\"/>\n  <path d=\"M 141.0,208.0 L 117.0,208.0 L 117.0,264.0 L 93.0,264.0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n </g>"}, "switch_nc(1).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 217.5,76.0 L 217.5,168.0 L 271.5,168.0\" fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"217.5\" x2=\"263.5\" y1=\"304.0\" y2=\"160.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"154.5\" x2=\"240.5\" y1=\"236.0\" y2=\"236.0\"/>\n  <path d=\"M 178.5,208.0 L 154.5,208.0 L 154.5,264.0 L 130.5,264.0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n </g>"}, "switch_nc.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 217.5,76.0 L 217.5,168.0 L 271.5,168.0\" fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"217.5\" x2=\"263.5\" y1=\"304.0\" y2=\"160.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"154.5\" x2=\"240.5\" y1=\"236.0\" y2=\"236.0\"/>\n  <path d=\"M 178.5,208.0 L 154.5,208.0 L 154.5,264.0 L 130.5,264.0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n </g>"}, "switch_no(1).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"168.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"217.5\" x2=\"171.5\" y1=\"304.0\" y2=\"170.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"108.5\" x2=\"194.5\" y1=\"236.0\" y2=\"236.0\"/>\n  <path d=\"M 132.5,208.0 L 108.5,208.0 L 108.5,264.0 L 84.5,264.0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n </g>"}, "switch_no.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"168.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"217.5\" x2=\"171.5\" y1=\"304.0\" y2=\"170.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"108.5\" x2=\"194.5\" y1=\"236.0\" y2=\"236.0\"/>\n  <path d=\"M 132.5,208.0 L 108.5,208.0 L 108.5,264.0 L 84.5,264.0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n </g>"}, "switch_pushbutton_con(1).svg": {"vb": "0 0 450.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 221.18,53.75 L 228.82,53.75 L 235.43,57.57 L 239.25,64.18 L 239.25,71.82 L 235.43,78.43 L 228.82,82.25 L 221.18,82.25 L 214.57,78.43 L 210.75,71.82 L 210.75,64.18 L 214.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 131.18,390.25 L 138.82,390.25 L 145.43,394.07 L 149.25,400.68 L 149.25,408.32 L 145.43,414.93 L 138.82,418.75 L 131.18,418.75 L 124.57,414.93 L 120.75,408.32 L 120.75,400.68 L 124.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 311.18,390.25 L 318.82,390.25 L 325.43,394.07 L 329.25,400.68 L 329.25,408.32 L 325.43,414.93 L 318.82,418.75 L 311.18,418.75 L 304.57,414.93 L 300.75,408.32 L 300.75,400.68 L 304.57,394.07 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" x1=\"225.0\" x2=\"225.0\" y1=\"76.0\" y2=\"168.0\"/>\n  <path d=\"M 135.0,396.5 L 135.0,296 L 195,296\" fill=\"none\" id=\"svg_stem_12\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 315.0,396.5 L 315.0,296 L 255,296\" fill=\"none\" id=\"svg_stem_14\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"185\" x2=\"225.0\" y1=\"304\" y2=\"168.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"117.0\" x2=\"205.0\" y1=\"236.0\" y2=\"236.0\"/>\n  <path d=\"M 143.0,208.0 L 117.0,208.0 L 117.0,264.0 L 143.0,264.0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n </g>"}, "switch_pushbutton_con.svg": {"vb": "0 0 450.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 221.18,53.75 L 228.82,53.75 L 235.43,57.57 L 239.25,64.18 L 239.25,71.82 L 235.43,78.43 L 228.82,82.25 L 221.18,82.25 L 214.57,78.43 L 210.75,71.82 L 210.75,64.18 L 214.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 131.18,390.25 L 138.82,390.25 L 145.43,394.07 L 149.25,400.68 L 149.25,408.32 L 145.43,414.93 L 138.82,418.75 L 131.18,418.75 L 124.57,414.93 L 120.75,408.32 L 120.75,400.68 L 124.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 311.18,390.25 L 318.82,390.25 L 325.43,394.07 L 329.25,400.68 L 329.25,408.32 L 325.43,414.93 L 318.82,418.75 L 311.18,418.75 L 304.57,414.93 L 300.75,408.32 L 300.75,400.68 L 304.57,394.07 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" x1=\"225.0\" x2=\"225.0\" y1=\"76.0\" y2=\"168.0\"/>\n  <path d=\"M 135.0,396.5 L 135.0,296 L 195,296\" fill=\"none\" id=\"svg_stem_12\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 315.0,396.5 L 315.0,296 L 255,296\" fill=\"none\" id=\"svg_stem_14\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"185\" x2=\"225.0\" y1=\"304\" y2=\"168.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"117.0\" x2=\"205.0\" y1=\"236.0\" y2=\"236.0\"/>\n  <path d=\"M 143.0,208.0 L 117.0,208.0 L 117.0,264.0 L 143.0,264.0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n </g>"}, "switch_pushbutton_nc(1).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 217.5,76.0 L 217.5,168.0 L 271.5,168.0\" fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"217.5\" x2=\"263.5\" y1=\"304.0\" y2=\"160.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"154.5\" x2=\"240.5\" y1=\"236.0\" y2=\"236.0\"/>\n  <path d=\"M 180.5,208.0 L 154.5,208.0 L 154.5,264.0 L 180.5,264.0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n </g>"}, "switch_pushbutton_nc.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 217.5,76.0 L 217.5,168.0 L 271.5,168.0\" fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"217.5\" x2=\"263.5\" y1=\"304.0\" y2=\"160.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"154.5\" x2=\"240.5\" y1=\"236.0\" y2=\"236.0\"/>\n  <path d=\"M 180.5,208.0 L 154.5,208.0 L 154.5,264.0 L 180.5,264.0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n </g>"}, "switch_pushbutton_no(1).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"168.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"217.5\" x2=\"171.5\" y1=\"304.0\" y2=\"170.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"108.5\" x2=\"194.5\" y1=\"236.0\" y2=\"236.0\"/>\n  <path d=\"M 134.5,208.0 L 108.5,208.0 L 108.5,264.0 L 134.5,264.0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n </g>"}, "switch_pushbutton_no.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"168.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"217.5\" x2=\"171.5\" y1=\"304.0\" y2=\"170.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"108.5\" x2=\"194.5\" y1=\"236.0\" y2=\"236.0\"/>\n  <path d=\"M 134.5,208.0 L 108.5,208.0 L 108.5,264.0 L 134.5,264.0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n </g>"}, "load_beacon(2).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"168.25\"/>\n  <circle cx=\"217.5\" cy=\"236.25\" fill=\"none\" id=\"svg_3\" r=\"68.0\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"9\" x1=\"169.42000000000002\" x2=\"265.58\" y1=\"188.17000000000002\" y2=\"284.33\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"9\" x1=\"265.58\" x2=\"169.42000000000002\" y1=\"188.17000000000002\" y2=\"284.33\"/>\n  <path d=\"M 303.5,202.25 A 42,42 0 0 1 303.5,270.25\" fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\"/>\n  <polygon fill=\"#666666\" id=\"svg_9\" points=\"299.5,274.25 317.5,264.25 305.5,254.25\"/>\n  <line fill=\"none\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.25\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "load_beacon.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"168.25\"/>\n  <circle cx=\"217.5\" cy=\"236.25\" fill=\"none\" id=\"svg_3\" r=\"68.0\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"9\" x1=\"169.42000000000002\" x2=\"265.58\" y1=\"188.17000000000002\" y2=\"284.33\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"9\" x1=\"265.58\" x2=\"169.42000000000002\" y1=\"188.17000000000002\" y2=\"284.33\"/>\n  <path d=\"M 303.5,202.25 A 42,42 0 0 1 303.5,270.25\" fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\"/>\n  <polygon fill=\"#666666\" id=\"svg_9\" points=\"299.5,274.25 317.5,264.25 305.5,254.25\"/>\n  <line fill=\"none\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.25\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "load_bell(2).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 217.5,76.0 L 217.5,196 L 251.5,196\" fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 251.5,172 L 251.5,300 A 64,64 0 0 0 251.5,172 Z\" fill=\"none\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 251.5,276 L 217.5,276 L 217.5,396.5\" fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "load_bell.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 217.5,76.0 L 217.5,196 L 251.5,196\" fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 251.5,172 L 251.5,300 A 64,64 0 0 0 251.5,172 Z\" fill=\"none\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 251.5,276 L 217.5,276 L 217.5,396.5\" fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "load_blinking_pilot_lamp(2).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"168.25\"/>\n  <circle cx=\"217.5\" cy=\"236.25\" fill=\"none\" id=\"svg_3\" r=\"68.0\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"9\" x1=\"169.42000000000002\" x2=\"265.58\" y1=\"188.17000000000002\" y2=\"284.33\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"9\" x1=\"265.58\" x2=\"169.42000000000002\" y1=\"188.17000000000002\" y2=\"284.33\"/>\n  <path d=\"M 303.5,248.25 L 315.5,248.25 L 315.5,222.25 L 339.5,222.25 L 339.5,248.25 L 351.5,248.25\" fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"7.5\"/>\n  <line fill=\"none\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.25\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "load_blinking_pilot_lamp.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"168.25\"/>\n  <circle cx=\"217.5\" cy=\"236.25\" fill=\"none\" id=\"svg_3\" r=\"68.0\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"9\" x1=\"169.42000000000002\" x2=\"265.58\" y1=\"188.17000000000002\" y2=\"284.33\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"9\" x1=\"265.58\" x2=\"169.42000000000002\" y1=\"188.17000000000002\" y2=\"284.33\"/>\n  <path d=\"M 303.5,248.25 L 315.5,248.25 L 315.5,222.25 L 339.5,222.25 L 339.5,248.25 L 351.5,248.25\" fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"7.5\"/>\n  <line fill=\"none\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.25\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "load_buzzer(2).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 217.5,76.0 L 217.5,196 L 257.5,196\" fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 311.5,172 L 311.5,300 A 64,64 0 0 1 311.5,172 Z\" fill=\"none\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 257.5,276 L 217.5,276 L 217.5,396.5\" fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "load_buzzer.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 217.5,76.0 L 217.5,196 L 257.5,196\" fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 311.5,172 L 311.5,300 A 64,64 0 0 1 311.5,172 Z\" fill=\"none\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 257.5,276 L 217.5,276 L 217.5,396.5\" fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "load_light(2).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"168.25\"/>\n  <circle cx=\"217.5\" cy=\"236.25\" fill=\"none\" id=\"svg_3\" r=\"68.0\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"9\" x1=\"169.42000000000002\" x2=\"265.58\" y1=\"188.17000000000002\" y2=\"284.33\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"9\" x1=\"265.58\" x2=\"169.42000000000002\" y1=\"188.17000000000002\" y2=\"284.33\"/>\n  <line fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.25\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "load_light.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"168.25\"/>\n  <circle cx=\"217.5\" cy=\"236.25\" fill=\"none\" id=\"svg_3\" r=\"68.0\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"9\" x1=\"169.42000000000002\" x2=\"265.58\" y1=\"188.17000000000002\" y2=\"284.33\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"9\" x1=\"265.58\" x2=\"169.42000000000002\" y1=\"188.17000000000002\" y2=\"284.33\"/>\n  <line fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.25\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "main_contacts_1p_no(1).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"172.0\"/>\n  <path d=\"M 217.5,144.0 A 14,14 0 0 0 217.5,172.0\" fill=\"none\" id=\"svg_contactor_arc1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"300.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"217.5\" x2=\"179.5\" y1=\"300.0\" y2=\"170.0\"/>\n </g>"}, "main_contacts_1p_no.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"172.0\"/>\n  <path d=\"M 217.5,144.0 A 14,14 0 0 0 217.5,172.0\" fill=\"none\" id=\"svg_contactor_arc1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"300.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"217.5\" x2=\"179.5\" y1=\"300.0\" y2=\"170.0\"/>\n </g>"}, "main_contacts_2p_no(1).svg": {"vb": "0 0 450.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 131.18,53.75 L 138.82,53.75 L 145.43,57.57 L 149.25,64.18 L 149.25,71.82 L 145.43,78.43 L 138.82,82.25 L 131.18,82.25 L 124.57,78.43 L 120.75,71.82 L 120.75,64.18 L 124.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 131.18,390.25 L 138.82,390.25 L 145.43,394.07 L 149.25,400.68 L 149.25,408.32 L 145.43,414.93 L 138.82,418.75 L 131.18,418.75 L 124.57,414.93 L 120.75,408.32 L 120.75,400.68 L 124.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"135.0\" x2=\"135.0\" y1=\"76.0\" y2=\"172.0\"/>\n  <path d=\"M 135.0,144.0 A 14,14 0 0 0 135.0,172.0\" fill=\"none\" id=\"svg_contactor_arc1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"135.0\" x2=\"135.0\" y1=\"300.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"135.0\" x2=\"97.0\" y1=\"300.0\" y2=\"170.0\"/>\n  <path d=\"M 311.18,53.75 L 318.82,53.75 L 325.43,57.57 L 329.25,64.18 L 329.25,71.82 L 325.43,78.43 L 318.82,82.25 L 311.18,82.25 L 304.57,78.43 L 300.75,71.82 L 300.75,64.18 L 304.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 311.18,390.25 L 318.82,390.25 L 325.43,394.07 L 329.25,400.68 L 329.25,408.32 L 325.43,414.93 L 318.82,418.75 L 311.18,418.75 L 304.57,414.93 L 300.75,408.32 L 300.75,400.68 L 304.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"315.0\" x2=\"315.0\" y1=\"76.0\" y2=\"172.0\"/>\n  <path d=\"M 315.0,144.0 A 14,14 0 0 0 315.0,172.0\" fill=\"none\" id=\"svg_contactor_arc2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"315.0\" x2=\"315.0\" y1=\"300.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"315.0\" x2=\"277.0\" y1=\"300.0\" y2=\"170.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"116.0\" x2=\"296.0\" y1=\"236\" y2=\"236\"/>\n </g>"}, "main_contacts_2p_no.svg": {"vb": "0 0 450.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 131.18,53.75 L 138.82,53.75 L 145.43,57.57 L 149.25,64.18 L 149.25,71.82 L 145.43,78.43 L 138.82,82.25 L 131.18,82.25 L 124.57,78.43 L 120.75,71.82 L 120.75,64.18 L 124.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 131.18,390.25 L 138.82,390.25 L 145.43,394.07 L 149.25,400.68 L 149.25,408.32 L 145.43,414.93 L 138.82,418.75 L 131.18,418.75 L 124.57,414.93 L 120.75,408.32 L 120.75,400.68 L 124.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"135.0\" x2=\"135.0\" y1=\"76.0\" y2=\"172.0\"/>\n  <path d=\"M 135.0,144.0 A 14,14 0 0 0 135.0,172.0\" fill=\"none\" id=\"svg_contactor_arc1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"135.0\" x2=\"135.0\" y1=\"300.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"135.0\" x2=\"97.0\" y1=\"300.0\" y2=\"170.0\"/>\n  <path d=\"M 311.18,53.75 L 318.82,53.75 L 325.43,57.57 L 329.25,64.18 L 329.25,71.82 L 325.43,78.43 L 318.82,82.25 L 311.18,82.25 L 304.57,78.43 L 300.75,71.82 L 300.75,64.18 L 304.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 311.18,390.25 L 318.82,390.25 L 325.43,394.07 L 329.25,400.68 L 329.25,408.32 L 325.43,414.93 L 318.82,418.75 L 311.18,418.75 L 304.57,414.93 L 300.75,408.32 L 300.75,400.68 L 304.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"315.0\" x2=\"315.0\" y1=\"76.0\" y2=\"172.0\"/>\n  <path d=\"M 315.0,144.0 A 14,14 0 0 0 315.0,172.0\" fill=\"none\" id=\"svg_contactor_arc2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"315.0\" x2=\"315.0\" y1=\"300.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"315.0\" x2=\"277.0\" y1=\"300.0\" y2=\"170.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"116.0\" x2=\"296.0\" y1=\"236\" y2=\"236\"/>\n </g>"}, "main_contacts_3p_no(1).svg": {"vb": "0 0 540.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 86.18,53.75 L 93.82,53.75 L 100.43,57.57 L 104.25,64.18 L 104.25,71.82 L 100.43,78.43 L 93.82,82.25 L 86.18,82.25 L 79.57,78.43 L 75.75,71.82 L 75.75,64.18 L 79.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 86.18,390.25 L 93.82,390.25 L 100.43,394.07 L 104.25,400.68 L 104.25,408.32 L 100.43,414.93 L 93.82,418.75 L 86.18,418.75 L 79.57,414.93 L 75.75,408.32 L 75.75,400.68 L 79.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"90.0\" x2=\"90.0\" y1=\"76.0\" y2=\"172.0\"/>\n  <path d=\"M 90.0,144.0 A 14,14 0 0 0 90.0,172.0\" fill=\"none\" id=\"svg_contactor_arc1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"90.0\" x2=\"90.0\" y1=\"300.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"90.0\" x2=\"52.0\" y1=\"300.0\" y2=\"170.0\"/>\n  <path d=\"M 266.18,53.75 L 273.82,53.75 L 280.43,57.57 L 284.25,64.18 L 284.25,71.82 L 280.43,78.43 L 273.82,82.25 L 266.18,82.25 L 259.57,78.43 L 255.75,71.82 L 255.75,64.18 L 259.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 266.18,390.25 L 273.82,390.25 L 280.43,394.07 L 284.25,400.68 L 284.25,408.32 L 280.43,414.93 L 273.82,418.75 L 266.18,418.75 L 259.57,414.93 L 255.75,408.32 L 255.75,400.68 L 259.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"76.0\" y2=\"172.0\"/>\n  <path d=\"M 270.0,144.0 A 14,14 0 0 0 270.0,172.0\" fill=\"none\" id=\"svg_contactor_arc2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"300.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"270.0\" x2=\"232.0\" y1=\"300.0\" y2=\"170.0\"/>\n  <path d=\"M 446.18,53.75 L 453.82,53.75 L 460.43,57.57 L 464.25,64.18 L 464.25,71.82 L 460.43,78.43 L 453.82,82.25 L 446.18,82.25 L 439.57,78.43 L 435.75,71.82 L 435.75,64.18 L 439.57,57.57 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 446.18,390.25 L 453.82,390.25 L 460.43,394.07 L 464.25,400.68 L 464.25,408.32 L 460.43,414.93 L 453.82,418.75 L 446.18,418.75 L 439.57,414.93 L 435.75,408.32 L 435.75,400.68 L 439.57,394.07 Z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"450.0\" x2=\"450.0\" y1=\"76.0\" y2=\"172.0\"/>\n  <path d=\"M 450.0,144.0 A 14,14 0 0 0 450.0,172.0\" fill=\"none\" id=\"svg_contactor_arc3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_stem_bot3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"450.0\" x2=\"450.0\" y1=\"300.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"450.0\" x2=\"412.0\" y1=\"300.0\" y2=\"170.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"71.0\" x2=\"431.0\" y1=\"236\" y2=\"236\"/>\n </g>"}, "main_contacts_3p_no.svg": {"vb": "0 0 540.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 86.18,53.75 L 93.82,53.75 L 100.43,57.57 L 104.25,64.18 L 104.25,71.82 L 100.43,78.43 L 93.82,82.25 L 86.18,82.25 L 79.57,78.43 L 75.75,71.82 L 75.75,64.18 L 79.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 86.18,390.25 L 93.82,390.25 L 100.43,394.07 L 104.25,400.68 L 104.25,408.32 L 100.43,414.93 L 93.82,418.75 L 86.18,418.75 L 79.57,414.93 L 75.75,408.32 L 75.75,400.68 L 79.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"90.0\" x2=\"90.0\" y1=\"76.0\" y2=\"172.0\"/>\n  <path d=\"M 90.0,144.0 A 14,14 0 0 0 90.0,172.0\" fill=\"none\" id=\"svg_contactor_arc1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"90.0\" x2=\"90.0\" y1=\"300.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"90.0\" x2=\"52.0\" y1=\"300.0\" y2=\"170.0\"/>\n  <path d=\"M 266.18,53.75 L 273.82,53.75 L 280.43,57.57 L 284.25,64.18 L 284.25,71.82 L 280.43,78.43 L 273.82,82.25 L 266.18,82.25 L 259.57,78.43 L 255.75,71.82 L 255.75,64.18 L 259.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 266.18,390.25 L 273.82,390.25 L 280.43,394.07 L 284.25,400.68 L 284.25,408.32 L 280.43,414.93 L 273.82,418.75 L 266.18,418.75 L 259.57,414.93 L 255.75,408.32 L 255.75,400.68 L 259.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"76.0\" y2=\"172.0\"/>\n  <path d=\"M 270.0,144.0 A 14,14 0 0 0 270.0,172.0\" fill=\"none\" id=\"svg_contactor_arc2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"300.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"270.0\" x2=\"232.0\" y1=\"300.0\" y2=\"170.0\"/>\n  <path d=\"M 446.18,53.75 L 453.82,53.75 L 460.43,57.57 L 464.25,64.18 L 464.25,71.82 L 460.43,78.43 L 453.82,82.25 L 446.18,82.25 L 439.57,78.43 L 435.75,71.82 L 435.75,64.18 L 439.57,57.57 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 446.18,390.25 L 453.82,390.25 L 460.43,394.07 L 464.25,400.68 L 464.25,408.32 L 460.43,414.93 L 453.82,418.75 L 446.18,418.75 L 439.57,414.93 L 435.75,408.32 L 435.75,400.68 L 439.57,394.07 Z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"450.0\" x2=\"450.0\" y1=\"76.0\" y2=\"172.0\"/>\n  <path d=\"M 450.0,144.0 A 14,14 0 0 0 450.0,172.0\" fill=\"none\" id=\"svg_contactor_arc3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_stem_bot3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"450.0\" x2=\"450.0\" y1=\"300.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"450.0\" x2=\"412.0\" y1=\"300.0\" y2=\"170.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"71.0\" x2=\"431.0\" y1=\"236\" y2=\"236\"/>\n </g>"}, "protection_circuit_breaker_1p(1).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"172.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"206.5\" x2=\"228.5\" y1=\"161.0\" y2=\"183.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"206.5\" x2=\"228.5\" y1=\"183.0\" y2=\"161.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"300.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"217.5\" x2=\"177.5\" y1=\"300.0\" y2=\"174.0\"/>\n </g>"}, "protection_circuit_breaker_1p.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"172.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"206.5\" x2=\"228.5\" y1=\"161.0\" y2=\"183.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"206.5\" x2=\"228.5\" y1=\"183.0\" y2=\"161.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"300.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"217.5\" x2=\"177.5\" y1=\"300.0\" y2=\"174.0\"/>\n </g>"}, "protection_circuit_breaker_2p(1).svg": {"vb": "0 0 450.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 131.18,53.75 L 138.82,53.75 L 145.43,57.57 L 149.25,64.18 L 149.25,71.82 L 145.43,78.43 L 138.82,82.25 L 131.18,82.25 L 124.57,78.43 L 120.75,71.82 L 120.75,64.18 L 124.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 131.18,390.25 L 138.82,390.25 L 145.43,394.07 L 149.25,400.68 L 149.25,408.32 L 145.43,414.93 L 138.82,418.75 L 131.18,418.75 L 124.57,414.93 L 120.75,408.32 L 120.75,400.68 L 124.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"135.0\" x2=\"135.0\" y1=\"76.0\" y2=\"172.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"124.0\" x2=\"146.0\" y1=\"161.0\" y2=\"183.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"124.0\" x2=\"146.0\" y1=\"183.0\" y2=\"161.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"135.0\" x2=\"135.0\" y1=\"300.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"135.0\" x2=\"95.0\" y1=\"300.0\" y2=\"174.0\"/>\n  <path d=\"M 311.18,53.75 L 318.82,53.75 L 325.43,57.57 L 329.25,64.18 L 329.25,71.82 L 325.43,78.43 L 318.82,82.25 L 311.18,82.25 L 304.57,78.43 L 300.75,71.82 L 300.75,64.18 L 304.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 311.18,390.25 L 318.82,390.25 L 325.43,394.07 L 329.25,400.68 L 329.25,408.32 L 325.43,414.93 L 318.82,418.75 L 311.18,418.75 L 304.57,414.93 L 300.75,408.32 L 300.75,400.68 L 304.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"315.0\" x2=\"315.0\" y1=\"76.0\" y2=\"172.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"304.0\" x2=\"326.0\" y1=\"161.0\" y2=\"183.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"304.0\" x2=\"326.0\" y1=\"183.0\" y2=\"161.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"315.0\" x2=\"315.0\" y1=\"300.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"315.0\" x2=\"275.0\" y1=\"300.0\" y2=\"174.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"115.0\" x2=\"295.0\" y1=\"236\" y2=\"236\"/>\n </g>"}, "protection_circuit_breaker_2p.svg": {"vb": "0 0 450.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 131.18,53.75 L 138.82,53.75 L 145.43,57.57 L 149.25,64.18 L 149.25,71.82 L 145.43,78.43 L 138.82,82.25 L 131.18,82.25 L 124.57,78.43 L 120.75,71.82 L 120.75,64.18 L 124.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 131.18,390.25 L 138.82,390.25 L 145.43,394.07 L 149.25,400.68 L 149.25,408.32 L 145.43,414.93 L 138.82,418.75 L 131.18,418.75 L 124.57,414.93 L 120.75,408.32 L 120.75,400.68 L 124.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"135.0\" x2=\"135.0\" y1=\"76.0\" y2=\"172.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"124.0\" x2=\"146.0\" y1=\"161.0\" y2=\"183.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"124.0\" x2=\"146.0\" y1=\"183.0\" y2=\"161.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"135.0\" x2=\"135.0\" y1=\"300.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"135.0\" x2=\"95.0\" y1=\"300.0\" y2=\"174.0\"/>\n  <path d=\"M 311.18,53.75 L 318.82,53.75 L 325.43,57.57 L 329.25,64.18 L 329.25,71.82 L 325.43,78.43 L 318.82,82.25 L 311.18,82.25 L 304.57,78.43 L 300.75,71.82 L 300.75,64.18 L 304.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 311.18,390.25 L 318.82,390.25 L 325.43,394.07 L 329.25,400.68 L 329.25,408.32 L 325.43,414.93 L 318.82,418.75 L 311.18,418.75 L 304.57,414.93 L 300.75,408.32 L 300.75,400.68 L 304.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"315.0\" x2=\"315.0\" y1=\"76.0\" y2=\"172.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"304.0\" x2=\"326.0\" y1=\"161.0\" y2=\"183.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"304.0\" x2=\"326.0\" y1=\"183.0\" y2=\"161.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"315.0\" x2=\"315.0\" y1=\"300.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"315.0\" x2=\"275.0\" y1=\"300.0\" y2=\"174.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"115.0\" x2=\"295.0\" y1=\"236\" y2=\"236\"/>\n </g>"}, "protection_circuit_breaker_3p(1).svg": {"vb": "0 0 540.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 86.18,53.75 L 93.82,53.75 L 100.43,57.57 L 104.25,64.18 L 104.25,71.82 L 100.43,78.43 L 93.82,82.25 L 86.18,82.25 L 79.57,78.43 L 75.75,71.82 L 75.75,64.18 L 79.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 86.18,390.25 L 93.82,390.25 L 100.43,394.07 L 104.25,400.68 L 104.25,408.32 L 100.43,414.93 L 93.82,418.75 L 86.18,418.75 L 79.57,414.93 L 75.75,408.32 L 75.75,400.68 L 79.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"90.0\" x2=\"90.0\" y1=\"76.0\" y2=\"172.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"79.0\" x2=\"101.0\" y1=\"161.0\" y2=\"183.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"79.0\" x2=\"101.0\" y1=\"183.0\" y2=\"161.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"90.0\" x2=\"90.0\" y1=\"300.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"90.0\" x2=\"50.0\" y1=\"300.0\" y2=\"174.0\"/>\n  <path d=\"M 266.18,53.75 L 273.82,53.75 L 280.43,57.57 L 284.25,64.18 L 284.25,71.82 L 280.43,78.43 L 273.82,82.25 L 266.18,82.25 L 259.57,78.43 L 255.75,71.82 L 255.75,64.18 L 259.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 266.18,390.25 L 273.82,390.25 L 280.43,394.07 L 284.25,400.68 L 284.25,408.32 L 280.43,414.93 L 273.82,418.75 L 266.18,418.75 L 259.57,414.93 L 255.75,408.32 L 255.75,400.68 L 259.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"76.0\" y2=\"172.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"259.0\" x2=\"281.0\" y1=\"161.0\" y2=\"183.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"259.0\" x2=\"281.0\" y1=\"183.0\" y2=\"161.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"300.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"270.0\" x2=\"230.0\" y1=\"300.0\" y2=\"174.0\"/>\n  <path d=\"M 446.18,53.75 L 453.82,53.75 L 460.43,57.57 L 464.25,64.18 L 464.25,71.82 L 460.43,78.43 L 453.82,82.25 L 446.18,82.25 L 439.57,78.43 L 435.75,71.82 L 435.75,64.18 L 439.57,57.57 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 446.18,390.25 L 453.82,390.25 L 460.43,394.07 L 464.25,400.68 L 464.25,408.32 L 460.43,414.93 L 453.82,418.75 L 446.18,418.75 L 439.57,414.93 L 435.75,408.32 L 435.75,400.68 L 439.57,394.07 Z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"450.0\" x2=\"450.0\" y1=\"76.0\" y2=\"172.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x3_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"439.0\" x2=\"461.0\" y1=\"161.0\" y2=\"183.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x3_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"439.0\" x2=\"461.0\" y1=\"183.0\" y2=\"161.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"450.0\" x2=\"450.0\" y1=\"300.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"450.0\" x2=\"410.0\" y1=\"300.0\" y2=\"174.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"70.0\" x2=\"430.0\" y1=\"236\" y2=\"236\"/>\n </g>"}, "protection_circuit_breaker_3p.svg": {"vb": "0 0 540.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 86.18,53.75 L 93.82,53.75 L 100.43,57.57 L 104.25,64.18 L 104.25,71.82 L 100.43,78.43 L 93.82,82.25 L 86.18,82.25 L 79.57,78.43 L 75.75,71.82 L 75.75,64.18 L 79.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 86.18,390.25 L 93.82,390.25 L 100.43,394.07 L 104.25,400.68 L 104.25,408.32 L 100.43,414.93 L 93.82,418.75 L 86.18,418.75 L 79.57,414.93 L 75.75,408.32 L 75.75,400.68 L 79.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"90.0\" x2=\"90.0\" y1=\"76.0\" y2=\"172.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"79.0\" x2=\"101.0\" y1=\"161.0\" y2=\"183.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"79.0\" x2=\"101.0\" y1=\"183.0\" y2=\"161.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"90.0\" x2=\"90.0\" y1=\"300.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"90.0\" x2=\"50.0\" y1=\"300.0\" y2=\"174.0\"/>\n  <path d=\"M 266.18,53.75 L 273.82,53.75 L 280.43,57.57 L 284.25,64.18 L 284.25,71.82 L 280.43,78.43 L 273.82,82.25 L 266.18,82.25 L 259.57,78.43 L 255.75,71.82 L 255.75,64.18 L 259.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 266.18,390.25 L 273.82,390.25 L 280.43,394.07 L 284.25,400.68 L 284.25,408.32 L 280.43,414.93 L 273.82,418.75 L 266.18,418.75 L 259.57,414.93 L 255.75,408.32 L 255.75,400.68 L 259.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"76.0\" y2=\"172.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"259.0\" x2=\"281.0\" y1=\"161.0\" y2=\"183.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"259.0\" x2=\"281.0\" y1=\"183.0\" y2=\"161.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"300.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"270.0\" x2=\"230.0\" y1=\"300.0\" y2=\"174.0\"/>\n  <path d=\"M 446.18,53.75 L 453.82,53.75 L 460.43,57.57 L 464.25,64.18 L 464.25,71.82 L 460.43,78.43 L 453.82,82.25 L 446.18,82.25 L 439.57,78.43 L 435.75,71.82 L 435.75,64.18 L 439.57,57.57 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 446.18,390.25 L 453.82,390.25 L 460.43,394.07 L 464.25,400.68 L 464.25,408.32 L 460.43,414.93 L 453.82,418.75 L 446.18,418.75 L 439.57,414.93 L 435.75,408.32 L 435.75,400.68 L 439.57,394.07 Z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"450.0\" x2=\"450.0\" y1=\"76.0\" y2=\"172.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x3_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"439.0\" x2=\"461.0\" y1=\"161.0\" y2=\"183.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x3_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"439.0\" x2=\"461.0\" y1=\"183.0\" y2=\"161.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"450.0\" x2=\"450.0\" y1=\"300.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"450.0\" x2=\"410.0\" y1=\"300.0\" y2=\"174.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"70.0\" x2=\"430.0\" y1=\"236\" y2=\"236\"/>\n </g>"}, "protection_fuse_1p(1).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"396.5\"/>\n  <rect fill=\"none\" height=\"96.0\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" width=\"52.0\" x=\"191.5\" y=\"188.25\"/>\n </g>"}, "protection_fuse_1p.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"396.5\"/>\n  <rect fill=\"none\" height=\"96.0\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" width=\"52.0\" x=\"191.5\" y=\"188.25\"/>\n </g>"}, "protection_fuse_2p(1).svg": {"vb": "0 0 450.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 131.18,53.75 L 138.82,53.75 L 145.43,57.57 L 149.25,64.18 L 149.25,71.82 L 145.43,78.43 L 138.82,82.25 L 131.18,82.25 L 124.57,78.43 L 120.75,71.82 L 120.75,64.18 L 124.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 131.18,390.25 L 138.82,390.25 L 145.43,394.07 L 149.25,400.68 L 149.25,408.32 L 145.43,414.93 L 138.82,418.75 L 131.18,418.75 L 124.57,414.93 L 120.75,408.32 L 120.75,400.68 L 124.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"135.0\" x2=\"135.0\" y1=\"76.0\" y2=\"396.5\"/>\n  <rect fill=\"none\" height=\"96.0\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" width=\"52.0\" x=\"109.0\" y=\"188.25\"/>\n  <path d=\"M 311.18,53.75 L 318.82,53.75 L 325.43,57.57 L 329.25,64.18 L 329.25,71.82 L 325.43,78.43 L 318.82,82.25 L 311.18,82.25 L 304.57,78.43 L 300.75,71.82 L 300.75,64.18 L 304.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 311.18,390.25 L 318.82,390.25 L 325.43,394.07 L 329.25,400.68 L 329.25,408.32 L 325.43,414.93 L 318.82,418.75 L 311.18,418.75 L 304.57,414.93 L 300.75,408.32 L 300.75,400.68 L 304.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"315.0\" x2=\"315.0\" y1=\"76.0\" y2=\"396.5\"/>\n  <rect fill=\"none\" height=\"96.0\" id=\"svg_fuse_box2\" stroke=\"#666666\" stroke-width=\"10\" width=\"52.0\" x=\"289.0\" y=\"188.25\"/>\n </g>"}, "protection_fuse_2p.svg": {"vb": "0 0 450.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 131.18,53.75 L 138.82,53.75 L 145.43,57.57 L 149.25,64.18 L 149.25,71.82 L 145.43,78.43 L 138.82,82.25 L 131.18,82.25 L 124.57,78.43 L 120.75,71.82 L 120.75,64.18 L 124.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 131.18,390.25 L 138.82,390.25 L 145.43,394.07 L 149.25,400.68 L 149.25,408.32 L 145.43,414.93 L 138.82,418.75 L 131.18,418.75 L 124.57,414.93 L 120.75,408.32 L 120.75,400.68 L 124.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"135.0\" x2=\"135.0\" y1=\"76.0\" y2=\"396.5\"/>\n  <rect fill=\"none\" height=\"96.0\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" width=\"52.0\" x=\"109.0\" y=\"188.25\"/>\n  <path d=\"M 311.18,53.75 L 318.82,53.75 L 325.43,57.57 L 329.25,64.18 L 329.25,71.82 L 325.43,78.43 L 318.82,82.25 L 311.18,82.25 L 304.57,78.43 L 300.75,71.82 L 300.75,64.18 L 304.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 311.18,390.25 L 318.82,390.25 L 325.43,394.07 L 329.25,400.68 L 329.25,408.32 L 325.43,414.93 L 318.82,418.75 L 311.18,418.75 L 304.57,414.93 L 300.75,408.32 L 300.75,400.68 L 304.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"315.0\" x2=\"315.0\" y1=\"76.0\" y2=\"396.5\"/>\n  <rect fill=\"none\" height=\"96.0\" id=\"svg_fuse_box2\" stroke=\"#666666\" stroke-width=\"10\" width=\"52.0\" x=\"289.0\" y=\"188.25\"/>\n </g>"}, "protection_fuse_3p(1).svg": {"vb": "0 0 540.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 86.18,53.75 L 93.82,53.75 L 100.43,57.57 L 104.25,64.18 L 104.25,71.82 L 100.43,78.43 L 93.82,82.25 L 86.18,82.25 L 79.57,78.43 L 75.75,71.82 L 75.75,64.18 L 79.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 86.18,390.25 L 93.82,390.25 L 100.43,394.07 L 104.25,400.68 L 104.25,408.32 L 100.43,414.93 L 93.82,418.75 L 86.18,418.75 L 79.57,414.93 L 75.75,408.32 L 75.75,400.68 L 79.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"90.0\" x2=\"90.0\" y1=\"76.0\" y2=\"396.5\"/>\n  <rect fill=\"none\" height=\"96.0\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" width=\"52.0\" x=\"64.0\" y=\"188.25\"/>\n  <path d=\"M 266.18,53.75 L 273.82,53.75 L 280.43,57.57 L 284.25,64.18 L 284.25,71.82 L 280.43,78.43 L 273.82,82.25 L 266.18,82.25 L 259.57,78.43 L 255.75,71.82 L 255.75,64.18 L 259.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 266.18,390.25 L 273.82,390.25 L 280.43,394.07 L 284.25,400.68 L 284.25,408.32 L 280.43,414.93 L 273.82,418.75 L 266.18,418.75 L 259.57,414.93 L 255.75,408.32 L 255.75,400.68 L 259.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"76.0\" y2=\"396.5\"/>\n  <rect fill=\"none\" height=\"96.0\" id=\"svg_fuse_box2\" stroke=\"#666666\" stroke-width=\"10\" width=\"52.0\" x=\"244.0\" y=\"188.25\"/>\n  <path d=\"M 446.18,53.75 L 453.82,53.75 L 460.43,57.57 L 464.25,64.18 L 464.25,71.82 L 460.43,78.43 L 453.82,82.25 L 446.18,82.25 L 439.57,78.43 L 435.75,71.82 L 435.75,64.18 L 439.57,57.57 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 446.18,390.25 L 453.82,390.25 L 460.43,394.07 L 464.25,400.68 L 464.25,408.32 L 460.43,414.93 L 453.82,418.75 L 446.18,418.75 L 439.57,414.93 L 435.75,408.32 L 435.75,400.68 L 439.57,394.07 Z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"450.0\" x2=\"450.0\" y1=\"76.0\" y2=\"396.5\"/>\n  <rect fill=\"none\" height=\"96.0\" id=\"svg_fuse_box3\" stroke=\"#666666\" stroke-width=\"10\" width=\"52.0\" x=\"424.0\" y=\"188.25\"/>\n </g>"}, "protection_fuse_3p.svg": {"vb": "0 0 540.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 86.18,53.75 L 93.82,53.75 L 100.43,57.57 L 104.25,64.18 L 104.25,71.82 L 100.43,78.43 L 93.82,82.25 L 86.18,82.25 L 79.57,78.43 L 75.75,71.82 L 75.75,64.18 L 79.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 86.18,390.25 L 93.82,390.25 L 100.43,394.07 L 104.25,400.68 L 104.25,408.32 L 100.43,414.93 L 93.82,418.75 L 86.18,418.75 L 79.57,414.93 L 75.75,408.32 L 75.75,400.68 L 79.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"90.0\" x2=\"90.0\" y1=\"76.0\" y2=\"396.5\"/>\n  <rect fill=\"none\" height=\"96.0\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" width=\"52.0\" x=\"64.0\" y=\"188.25\"/>\n  <path d=\"M 266.18,53.75 L 273.82,53.75 L 280.43,57.57 L 284.25,64.18 L 284.25,71.82 L 280.43,78.43 L 273.82,82.25 L 266.18,82.25 L 259.57,78.43 L 255.75,71.82 L 255.75,64.18 L 259.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 266.18,390.25 L 273.82,390.25 L 280.43,394.07 L 284.25,400.68 L 284.25,408.32 L 280.43,414.93 L 273.82,418.75 L 266.18,418.75 L 259.57,414.93 L 255.75,408.32 L 255.75,400.68 L 259.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"76.0\" y2=\"396.5\"/>\n  <rect fill=\"none\" height=\"96.0\" id=\"svg_fuse_box2\" stroke=\"#666666\" stroke-width=\"10\" width=\"52.0\" x=\"244.0\" y=\"188.25\"/>\n  <path d=\"M 446.18,53.75 L 453.82,53.75 L 460.43,57.57 L 464.25,64.18 L 464.25,71.82 L 460.43,78.43 L 453.82,82.25 L 446.18,82.25 L 439.57,78.43 L 435.75,71.82 L 435.75,64.18 L 439.57,57.57 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 446.18,390.25 L 453.82,390.25 L 460.43,394.07 L 464.25,400.68 L 464.25,408.32 L 460.43,414.93 L 453.82,418.75 L 446.18,418.75 L 439.57,414.93 L 435.75,408.32 L 435.75,400.68 L 439.57,394.07 Z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"450.0\" x2=\"450.0\" y1=\"76.0\" y2=\"396.5\"/>\n  <rect fill=\"none\" height=\"96.0\" id=\"svg_fuse_box3\" stroke=\"#666666\" stroke-width=\"10\" width=\"52.0\" x=\"424.0\" y=\"188.25\"/>\n </g>"}, "protection_fuse_4p(1).svg": {"vb": "0 0 720.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 86.18,53.75 L 93.82,53.75 L 100.43,57.57 L 104.25,64.18 L 104.25,71.82 L 100.43,78.43 L 93.82,82.25 L 86.18,82.25 L 79.57,78.43 L 75.75,71.82 L 75.75,64.18 L 79.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 86.18,390.25 L 93.82,390.25 L 100.43,394.07 L 104.25,400.68 L 104.25,408.32 L 100.43,414.93 L 93.82,418.75 L 86.18,418.75 L 79.57,414.93 L 75.75,408.32 L 75.75,400.68 L 79.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"90.0\" x2=\"90.0\" y1=\"76.0\" y2=\"396.5\"/>\n  <rect fill=\"none\" height=\"96.0\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" width=\"52.0\" x=\"64.0\" y=\"188.25\"/>\n  <path d=\"M 266.18,53.75 L 273.82,53.75 L 280.43,57.57 L 284.25,64.18 L 284.25,71.82 L 280.43,78.43 L 273.82,82.25 L 266.18,82.25 L 259.57,78.43 L 255.75,71.82 L 255.75,64.18 L 259.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 266.18,390.25 L 273.82,390.25 L 280.43,394.07 L 284.25,400.68 L 284.25,408.32 L 280.43,414.93 L 273.82,418.75 L 266.18,418.75 L 259.57,414.93 L 255.75,408.32 L 255.75,400.68 L 259.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"76.0\" y2=\"396.5\"/>\n  <rect fill=\"none\" height=\"96.0\" id=\"svg_fuse_box2\" stroke=\"#666666\" stroke-width=\"10\" width=\"52.0\" x=\"244.0\" y=\"188.25\"/>\n  <path d=\"M 446.18,53.75 L 453.82,53.75 L 460.43,57.57 L 464.25,64.18 L 464.25,71.82 L 460.43,78.43 L 453.82,82.25 L 446.18,82.25 L 439.57,78.43 L 435.75,71.82 L 435.75,64.18 L 439.57,57.57 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 446.18,390.25 L 453.82,390.25 L 460.43,394.07 L 464.25,400.68 L 464.25,408.32 L 460.43,414.93 L 453.82,418.75 L 446.18,418.75 L 439.57,414.93 L 435.75,408.32 L 435.75,400.68 L 439.57,394.07 Z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"450.0\" x2=\"450.0\" y1=\"76.0\" y2=\"396.5\"/>\n  <rect fill=\"none\" height=\"96.0\" id=\"svg_fuse_box3\" stroke=\"#666666\" stroke-width=\"10\" width=\"52.0\" x=\"424.0\" y=\"188.25\"/>\n  <path d=\"M 626.18,53.75 L 633.82,53.75 L 640.43,57.57 L 644.25,64.18 L 644.25,71.82 L 640.43,78.43 L 633.82,82.25 L 626.18,82.25 L 619.57,78.43 L 615.75,71.82 L 615.75,64.18 L 619.57,57.57 Z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 626.18,390.25 L 633.82,390.25 L 640.43,394.07 L 644.25,400.68 L 644.25,408.32 L 640.43,414.93 L 633.82,418.75 L 626.18,418.75 L 619.57,414.93 L 615.75,408.32 L 615.75,400.68 L 619.57,394.07 Z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem4\" stroke=\"#666666\" stroke-width=\"10\" x1=\"630.0\" x2=\"630.0\" y1=\"76.0\" y2=\"396.5\"/>\n  <rect fill=\"none\" height=\"96.0\" id=\"svg_fuse_box4\" stroke=\"#666666\" stroke-width=\"10\" width=\"52.0\" x=\"604.0\" y=\"188.25\"/>\n </g>"}, "protection_fuse_4p.svg": {"vb": "0 0 720.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 86.18,53.75 L 93.82,53.75 L 100.43,57.57 L 104.25,64.18 L 104.25,71.82 L 100.43,78.43 L 93.82,82.25 L 86.18,82.25 L 79.57,78.43 L 75.75,71.82 L 75.75,64.18 L 79.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 86.18,390.25 L 93.82,390.25 L 100.43,394.07 L 104.25,400.68 L 104.25,408.32 L 100.43,414.93 L 93.82,418.75 L 86.18,418.75 L 79.57,414.93 L 75.75,408.32 L 75.75,400.68 L 79.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"90.0\" x2=\"90.0\" y1=\"76.0\" y2=\"396.5\"/>\n  <rect fill=\"none\" height=\"96.0\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"10\" width=\"52.0\" x=\"64.0\" y=\"188.25\"/>\n  <path d=\"M 266.18,53.75 L 273.82,53.75 L 280.43,57.57 L 284.25,64.18 L 284.25,71.82 L 280.43,78.43 L 273.82,82.25 L 266.18,82.25 L 259.57,78.43 L 255.75,71.82 L 255.75,64.18 L 259.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 266.18,390.25 L 273.82,390.25 L 280.43,394.07 L 284.25,400.68 L 284.25,408.32 L 280.43,414.93 L 273.82,418.75 L 266.18,418.75 L 259.57,414.93 L 255.75,408.32 L 255.75,400.68 L 259.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"76.0\" y2=\"396.5\"/>\n  <rect fill=\"none\" height=\"96.0\" id=\"svg_fuse_box2\" stroke=\"#666666\" stroke-width=\"10\" width=\"52.0\" x=\"244.0\" y=\"188.25\"/>\n  <path d=\"M 446.18,53.75 L 453.82,53.75 L 460.43,57.57 L 464.25,64.18 L 464.25,71.82 L 460.43,78.43 L 453.82,82.25 L 446.18,82.25 L 439.57,78.43 L 435.75,71.82 L 435.75,64.18 L 439.57,57.57 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 446.18,390.25 L 453.82,390.25 L 460.43,394.07 L 464.25,400.68 L 464.25,408.32 L 460.43,414.93 L 453.82,418.75 L 446.18,418.75 L 439.57,414.93 L 435.75,408.32 L 435.75,400.68 L 439.57,394.07 Z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"450.0\" x2=\"450.0\" y1=\"76.0\" y2=\"396.5\"/>\n  <rect fill=\"none\" height=\"96.0\" id=\"svg_fuse_box3\" stroke=\"#666666\" stroke-width=\"10\" width=\"52.0\" x=\"424.0\" y=\"188.25\"/>\n  <path d=\"M 626.18,53.75 L 633.82,53.75 L 640.43,57.57 L 644.25,64.18 L 644.25,71.82 L 640.43,78.43 L 633.82,82.25 L 626.18,82.25 L 619.57,78.43 L 615.75,71.82 L 615.75,64.18 L 619.57,57.57 Z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 626.18,390.25 L 633.82,390.25 L 640.43,394.07 L 644.25,400.68 L 644.25,408.32 L 640.43,414.93 L 633.82,418.75 L 626.18,418.75 L 619.57,414.93 L 615.75,408.32 L 615.75,400.68 L 619.57,394.07 Z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem4\" stroke=\"#666666\" stroke-width=\"10\" x1=\"630.0\" x2=\"630.0\" y1=\"76.0\" y2=\"396.5\"/>\n  <rect fill=\"none\" height=\"96.0\" id=\"svg_fuse_box4\" stroke=\"#666666\" stroke-width=\"10\" width=\"52.0\" x=\"604.0\" y=\"188.25\"/>\n </g>"}, "protection_fuse_isolator_1p(1).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_disc_bar1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"195.5\" x2=\"239.5\" y1=\"162.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"312.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"217.5\" x2=\"175.5\" y1=\"312.0\" y2=\"170\"/>\n  <rect fill=\"none\" height=\"76.0\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"9\" transform=\"rotate(-16.5 196.5 241.0)\" width=\"38.0\" x=\"177.5\" y=\"203.0\"/>\n </g>"}, "protection_fuse_isolator_1p.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_disc_bar1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"195.5\" x2=\"239.5\" y1=\"162.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"312.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"217.5\" x2=\"175.5\" y1=\"312.0\" y2=\"170\"/>\n  <rect fill=\"none\" height=\"76.0\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"9\" transform=\"rotate(-16.5 196.5 241.0)\" width=\"38.0\" x=\"177.5\" y=\"203.0\"/>\n </g>"}, "protection_fuse_isolator_2p(1).svg": {"vb": "0 0 450.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 131.18,53.75 L 138.82,53.75 L 145.43,57.57 L 149.25,64.18 L 149.25,71.82 L 145.43,78.43 L 138.82,82.25 L 131.18,82.25 L 124.57,78.43 L 120.75,71.82 L 120.75,64.18 L 124.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 131.18,390.25 L 138.82,390.25 L 145.43,394.07 L 149.25,400.68 L 149.25,408.32 L 145.43,414.93 L 138.82,418.75 L 131.18,418.75 L 124.57,414.93 L 120.75,408.32 L 120.75,400.68 L 124.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"135.0\" x2=\"135.0\" y1=\"76.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_disc_bar1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"113.0\" x2=\"157.0\" y1=\"162.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"135.0\" x2=\"135.0\" y1=\"312.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"135.0\" x2=\"93.0\" y1=\"312.0\" y2=\"170\"/>\n  <rect fill=\"none\" height=\"76.0\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"9\" transform=\"rotate(-16.5 114.0 241.0)\" width=\"38.0\" x=\"95.0\" y=\"203.0\"/>\n  <path d=\"M 311.18,53.75 L 318.82,53.75 L 325.43,57.57 L 329.25,64.18 L 329.25,71.82 L 325.43,78.43 L 318.82,82.25 L 311.18,82.25 L 304.57,78.43 L 300.75,71.82 L 300.75,64.18 L 304.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 311.18,390.25 L 318.82,390.25 L 325.43,394.07 L 329.25,400.68 L 329.25,408.32 L 325.43,414.93 L 318.82,418.75 L 311.18,418.75 L 304.57,414.93 L 300.75,408.32 L 300.75,400.68 L 304.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"315.0\" x2=\"315.0\" y1=\"76.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_disc_bar2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"293.0\" x2=\"337.0\" y1=\"162.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"315.0\" x2=\"315.0\" y1=\"312.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_13\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"315.0\" x2=\"273.0\" y1=\"312.0\" y2=\"170\"/>\n  <rect fill=\"none\" height=\"76.0\" id=\"svg_14\" stroke=\"#666666\" stroke-width=\"9\" transform=\"rotate(-16.5 294.0 241.0)\" width=\"38.0\" x=\"275.0\" y=\"203.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"114.0\" x2=\"294.0\" y1=\"241\" y2=\"241\"/>\n </g>"}, "protection_fuse_isolator_2p.svg": {"vb": "0 0 450.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 131.18,53.75 L 138.82,53.75 L 145.43,57.57 L 149.25,64.18 L 149.25,71.82 L 145.43,78.43 L 138.82,82.25 L 131.18,82.25 L 124.57,78.43 L 120.75,71.82 L 120.75,64.18 L 124.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 131.18,390.25 L 138.82,390.25 L 145.43,394.07 L 149.25,400.68 L 149.25,408.32 L 145.43,414.93 L 138.82,418.75 L 131.18,418.75 L 124.57,414.93 L 120.75,408.32 L 120.75,400.68 L 124.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"135.0\" x2=\"135.0\" y1=\"76.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_disc_bar1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"113.0\" x2=\"157.0\" y1=\"162.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"135.0\" x2=\"135.0\" y1=\"312.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"135.0\" x2=\"93.0\" y1=\"312.0\" y2=\"170\"/>\n  <rect fill=\"none\" height=\"76.0\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"9\" transform=\"rotate(-16.5 114.0 241.0)\" width=\"38.0\" x=\"95.0\" y=\"203.0\"/>\n  <path d=\"M 311.18,53.75 L 318.82,53.75 L 325.43,57.57 L 329.25,64.18 L 329.25,71.82 L 325.43,78.43 L 318.82,82.25 L 311.18,82.25 L 304.57,78.43 L 300.75,71.82 L 300.75,64.18 L 304.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 311.18,390.25 L 318.82,390.25 L 325.43,394.07 L 329.25,400.68 L 329.25,408.32 L 325.43,414.93 L 318.82,418.75 L 311.18,418.75 L 304.57,414.93 L 300.75,408.32 L 300.75,400.68 L 304.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"315.0\" x2=\"315.0\" y1=\"76.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_disc_bar2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"293.0\" x2=\"337.0\" y1=\"162.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"315.0\" x2=\"315.0\" y1=\"312.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_13\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"315.0\" x2=\"273.0\" y1=\"312.0\" y2=\"170\"/>\n  <rect fill=\"none\" height=\"76.0\" id=\"svg_14\" stroke=\"#666666\" stroke-width=\"9\" transform=\"rotate(-16.5 294.0 241.0)\" width=\"38.0\" x=\"275.0\" y=\"203.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"114.0\" x2=\"294.0\" y1=\"241\" y2=\"241\"/>\n </g>"}, "protection_fuse_isolator_3p(1).svg": {"vb": "0 0 540.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 86.18,53.75 L 93.82,53.75 L 100.43,57.57 L 104.25,64.18 L 104.25,71.82 L 100.43,78.43 L 93.82,82.25 L 86.18,82.25 L 79.57,78.43 L 75.75,71.82 L 75.75,64.18 L 79.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 86.18,390.25 L 93.82,390.25 L 100.43,394.07 L 104.25,400.68 L 104.25,408.32 L 100.43,414.93 L 93.82,418.75 L 86.18,418.75 L 79.57,414.93 L 75.75,408.32 L 75.75,400.68 L 79.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"90.0\" x2=\"90.0\" y1=\"76.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_disc_bar1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"68.0\" x2=\"112.0\" y1=\"162.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"90.0\" x2=\"90.0\" y1=\"312.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"90.0\" x2=\"48.0\" y1=\"312.0\" y2=\"170\"/>\n  <rect fill=\"none\" height=\"76.0\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"9\" transform=\"rotate(-16.5 69.0 241.0)\" width=\"38.0\" x=\"50.0\" y=\"203.0\"/>\n  <path d=\"M 266.18,53.75 L 273.82,53.75 L 280.43,57.57 L 284.25,64.18 L 284.25,71.82 L 280.43,78.43 L 273.82,82.25 L 266.18,82.25 L 259.57,78.43 L 255.75,71.82 L 255.75,64.18 L 259.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 266.18,390.25 L 273.82,390.25 L 280.43,394.07 L 284.25,400.68 L 284.25,408.32 L 280.43,414.93 L 273.82,418.75 L 266.18,418.75 L 259.57,414.93 L 255.75,408.32 L 255.75,400.68 L 259.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"76.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_disc_bar2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"248.0\" x2=\"292.0\" y1=\"162.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"312.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_13\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"270.0\" x2=\"228.0\" y1=\"312.0\" y2=\"170\"/>\n  <rect fill=\"none\" height=\"76.0\" id=\"svg_14\" stroke=\"#666666\" stroke-width=\"9\" transform=\"rotate(-16.5 249.0 241.0)\" width=\"38.0\" x=\"230.0\" y=\"203.0\"/>\n  <path d=\"M 446.18,53.75 L 453.82,53.75 L 460.43,57.57 L 464.25,64.18 L 464.25,71.82 L 460.43,78.43 L 453.82,82.25 L 446.18,82.25 L 439.57,78.43 L 435.75,71.82 L 435.75,64.18 L 439.57,57.57 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 446.18,390.25 L 453.82,390.25 L 460.43,394.07 L 464.25,400.68 L 464.25,408.32 L 460.43,414.93 L 453.82,418.75 L 446.18,418.75 L 439.57,414.93 L 435.75,408.32 L 435.75,400.68 L 439.57,394.07 Z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"450.0\" x2=\"450.0\" y1=\"76.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_disc_bar3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"428.0\" x2=\"472.0\" y1=\"162.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"450.0\" x2=\"450.0\" y1=\"312.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"450.0\" x2=\"408.0\" y1=\"312.0\" y2=\"170\"/>\n  <rect fill=\"none\" height=\"76.0\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"9\" transform=\"rotate(-16.5 429.0 241.0)\" width=\"38.0\" x=\"410.0\" y=\"203.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"69.0\" x2=\"429.0\" y1=\"241\" y2=\"241\"/>\n </g>"}, "protection_fuse_isolator_3p.svg": {"vb": "0 0 540.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 86.18,53.75 L 93.82,53.75 L 100.43,57.57 L 104.25,64.18 L 104.25,71.82 L 100.43,78.43 L 93.82,82.25 L 86.18,82.25 L 79.57,78.43 L 75.75,71.82 L 75.75,64.18 L 79.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 86.18,390.25 L 93.82,390.25 L 100.43,394.07 L 104.25,400.68 L 104.25,408.32 L 100.43,414.93 L 93.82,418.75 L 86.18,418.75 L 79.57,414.93 L 75.75,408.32 L 75.75,400.68 L 79.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"90.0\" x2=\"90.0\" y1=\"76.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_disc_bar1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"68.0\" x2=\"112.0\" y1=\"162.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"90.0\" x2=\"90.0\" y1=\"312.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"90.0\" x2=\"48.0\" y1=\"312.0\" y2=\"170\"/>\n  <rect fill=\"none\" height=\"76.0\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"9\" transform=\"rotate(-16.5 69.0 241.0)\" width=\"38.0\" x=\"50.0\" y=\"203.0\"/>\n  <path d=\"M 266.18,53.75 L 273.82,53.75 L 280.43,57.57 L 284.25,64.18 L 284.25,71.82 L 280.43,78.43 L 273.82,82.25 L 266.18,82.25 L 259.57,78.43 L 255.75,71.82 L 255.75,64.18 L 259.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 266.18,390.25 L 273.82,390.25 L 280.43,394.07 L 284.25,400.68 L 284.25,408.32 L 280.43,414.93 L 273.82,418.75 L 266.18,418.75 L 259.57,414.93 L 255.75,408.32 L 255.75,400.68 L 259.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"76.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_disc_bar2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"248.0\" x2=\"292.0\" y1=\"162.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"312.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_13\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"270.0\" x2=\"228.0\" y1=\"312.0\" y2=\"170\"/>\n  <rect fill=\"none\" height=\"76.0\" id=\"svg_14\" stroke=\"#666666\" stroke-width=\"9\" transform=\"rotate(-16.5 249.0 241.0)\" width=\"38.0\" x=\"230.0\" y=\"203.0\"/>\n  <path d=\"M 446.18,53.75 L 453.82,53.75 L 460.43,57.57 L 464.25,64.18 L 464.25,71.82 L 460.43,78.43 L 453.82,82.25 L 446.18,82.25 L 439.57,78.43 L 435.75,71.82 L 435.75,64.18 L 439.57,57.57 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 446.18,390.25 L 453.82,390.25 L 460.43,394.07 L 464.25,400.68 L 464.25,408.32 L 460.43,414.93 L 453.82,418.75 L 446.18,418.75 L 439.57,414.93 L 435.75,408.32 L 435.75,400.68 L 439.57,394.07 Z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"450.0\" x2=\"450.0\" y1=\"76.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_disc_bar3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"428.0\" x2=\"472.0\" y1=\"162.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"450.0\" x2=\"450.0\" y1=\"312.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"450.0\" x2=\"408.0\" y1=\"312.0\" y2=\"170\"/>\n  <rect fill=\"none\" height=\"76.0\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"9\" transform=\"rotate(-16.5 429.0 241.0)\" width=\"38.0\" x=\"410.0\" y=\"203.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"69.0\" x2=\"429.0\" y1=\"241\" y2=\"241\"/>\n </g>"}, "protection_fuse_isolator_4p(1).svg": {"vb": "0 0 720.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 86.18,53.75 L 93.82,53.75 L 100.43,57.57 L 104.25,64.18 L 104.25,71.82 L 100.43,78.43 L 93.82,82.25 L 86.18,82.25 L 79.57,78.43 L 75.75,71.82 L 75.75,64.18 L 79.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 86.18,390.25 L 93.82,390.25 L 100.43,394.07 L 104.25,400.68 L 104.25,408.32 L 100.43,414.93 L 93.82,418.75 L 86.18,418.75 L 79.57,414.93 L 75.75,408.32 L 75.75,400.68 L 79.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"90.0\" x2=\"90.0\" y1=\"76.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_disc_bar1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"68.0\" x2=\"112.0\" y1=\"162.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"90.0\" x2=\"90.0\" y1=\"312.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"90.0\" x2=\"48.0\" y1=\"312.0\" y2=\"170\"/>\n  <rect fill=\"none\" height=\"76.0\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"9\" transform=\"rotate(-16.5 69.0 241.0)\" width=\"38.0\" x=\"50.0\" y=\"203.0\"/>\n  <path d=\"M 266.18,53.75 L 273.82,53.75 L 280.43,57.57 L 284.25,64.18 L 284.25,71.82 L 280.43,78.43 L 273.82,82.25 L 266.18,82.25 L 259.57,78.43 L 255.75,71.82 L 255.75,64.18 L 259.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 266.18,390.25 L 273.82,390.25 L 280.43,394.07 L 284.25,400.68 L 284.25,408.32 L 280.43,414.93 L 273.82,418.75 L 266.18,418.75 L 259.57,414.93 L 255.75,408.32 L 255.75,400.68 L 259.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"76.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_disc_bar2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"248.0\" x2=\"292.0\" y1=\"162.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"312.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_13\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"270.0\" x2=\"228.0\" y1=\"312.0\" y2=\"170\"/>\n  <rect fill=\"none\" height=\"76.0\" id=\"svg_14\" stroke=\"#666666\" stroke-width=\"9\" transform=\"rotate(-16.5 249.0 241.0)\" width=\"38.0\" x=\"230.0\" y=\"203.0\"/>\n  <path d=\"M 446.18,53.75 L 453.82,53.75 L 460.43,57.57 L 464.25,64.18 L 464.25,71.82 L 460.43,78.43 L 453.82,82.25 L 446.18,82.25 L 439.57,78.43 L 435.75,71.82 L 435.75,64.18 L 439.57,57.57 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 446.18,390.25 L 453.82,390.25 L 460.43,394.07 L 464.25,400.68 L 464.25,408.32 L 460.43,414.93 L 453.82,418.75 L 446.18,418.75 L 439.57,414.93 L 435.75,408.32 L 435.75,400.68 L 439.57,394.07 Z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"450.0\" x2=\"450.0\" y1=\"76.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_disc_bar3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"428.0\" x2=\"472.0\" y1=\"162.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"450.0\" x2=\"450.0\" y1=\"312.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"450.0\" x2=\"408.0\" y1=\"312.0\" y2=\"170\"/>\n  <rect fill=\"none\" height=\"76.0\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"9\" transform=\"rotate(-16.5 429.0 241.0)\" width=\"38.0\" x=\"410.0\" y=\"203.0\"/>\n  <path d=\"M 626.18,53.75 L 633.82,53.75 L 640.43,57.57 L 644.25,64.18 L 644.25,71.82 L 640.43,78.43 L 633.82,82.25 L 626.18,82.25 L 619.57,78.43 L 615.75,71.82 L 615.75,64.18 L 619.57,57.57 Z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 626.18,390.25 L 633.82,390.25 L 640.43,394.07 L 644.25,400.68 L 644.25,408.32 L 640.43,414.93 L 633.82,418.75 L 626.18,418.75 L 619.57,414.93 L 615.75,408.32 L 615.75,400.68 L 619.57,394.07 Z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top4\" stroke=\"#666666\" stroke-width=\"10\" x1=\"630.0\" x2=\"630.0\" y1=\"76.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_disc_bar4\" stroke=\"#666666\" stroke-width=\"10\" x1=\"608.0\" x2=\"652.0\" y1=\"162.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot4\" stroke=\"#666666\" stroke-width=\"10\" x1=\"630.0\" x2=\"630.0\" y1=\"312.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_30\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"630.0\" x2=\"588.0\" y1=\"312.0\" y2=\"170\"/>\n  <rect fill=\"none\" height=\"76.0\" id=\"svg_29\" stroke=\"#666666\" stroke-width=\"9\" transform=\"rotate(-16.5 609.0 241.0)\" width=\"38.0\" x=\"590.0\" y=\"203.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"69.0\" x2=\"609.0\" y1=\"241\" y2=\"241\"/>\n </g>"}, "protection_fuse_isolator_4p.svg": {"vb": "0 0 720.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 86.18,53.75 L 93.82,53.75 L 100.43,57.57 L 104.25,64.18 L 104.25,71.82 L 100.43,78.43 L 93.82,82.25 L 86.18,82.25 L 79.57,78.43 L 75.75,71.82 L 75.75,64.18 L 79.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 86.18,390.25 L 93.82,390.25 L 100.43,394.07 L 104.25,400.68 L 104.25,408.32 L 100.43,414.93 L 93.82,418.75 L 86.18,418.75 L 79.57,414.93 L 75.75,408.32 L 75.75,400.68 L 79.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"90.0\" x2=\"90.0\" y1=\"76.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_disc_bar1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"68.0\" x2=\"112.0\" y1=\"162.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"90.0\" x2=\"90.0\" y1=\"312.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"90.0\" x2=\"48.0\" y1=\"312.0\" y2=\"170\"/>\n  <rect fill=\"none\" height=\"76.0\" id=\"svg_fuse_box1\" stroke=\"#666666\" stroke-width=\"9\" transform=\"rotate(-16.5 69.0 241.0)\" width=\"38.0\" x=\"50.0\" y=\"203.0\"/>\n  <path d=\"M 266.18,53.75 L 273.82,53.75 L 280.43,57.57 L 284.25,64.18 L 284.25,71.82 L 280.43,78.43 L 273.82,82.25 L 266.18,82.25 L 259.57,78.43 L 255.75,71.82 L 255.75,64.18 L 259.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 266.18,390.25 L 273.82,390.25 L 280.43,394.07 L 284.25,400.68 L 284.25,408.32 L 280.43,414.93 L 273.82,418.75 L 266.18,418.75 L 259.57,414.93 L 255.75,408.32 L 255.75,400.68 L 259.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"76.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_disc_bar2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"248.0\" x2=\"292.0\" y1=\"162.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"270.0\" x2=\"270.0\" y1=\"312.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_13\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"270.0\" x2=\"228.0\" y1=\"312.0\" y2=\"170\"/>\n  <rect fill=\"none\" height=\"76.0\" id=\"svg_14\" stroke=\"#666666\" stroke-width=\"9\" transform=\"rotate(-16.5 249.0 241.0)\" width=\"38.0\" x=\"230.0\" y=\"203.0\"/>\n  <path d=\"M 446.18,53.75 L 453.82,53.75 L 460.43,57.57 L 464.25,64.18 L 464.25,71.82 L 460.43,78.43 L 453.82,82.25 L 446.18,82.25 L 439.57,78.43 L 435.75,71.82 L 435.75,64.18 L 439.57,57.57 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 446.18,390.25 L 453.82,390.25 L 460.43,394.07 L 464.25,400.68 L 464.25,408.32 L 460.43,414.93 L 453.82,418.75 L 446.18,418.75 L 439.57,414.93 L 435.75,408.32 L 435.75,400.68 L 439.57,394.07 Z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"450.0\" x2=\"450.0\" y1=\"76.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_disc_bar3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"428.0\" x2=\"472.0\" y1=\"162.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"450.0\" x2=\"450.0\" y1=\"312.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"450.0\" x2=\"408.0\" y1=\"312.0\" y2=\"170\"/>\n  <rect fill=\"none\" height=\"76.0\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"9\" transform=\"rotate(-16.5 429.0 241.0)\" width=\"38.0\" x=\"410.0\" y=\"203.0\"/>\n  <path d=\"M 626.18,53.75 L 633.82,53.75 L 640.43,57.57 L 644.25,64.18 L 644.25,71.82 L 640.43,78.43 L 633.82,82.25 L 626.18,82.25 L 619.57,78.43 L 615.75,71.82 L 615.75,64.18 L 619.57,57.57 Z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 626.18,390.25 L 633.82,390.25 L 640.43,394.07 L 644.25,400.68 L 644.25,408.32 L 640.43,414.93 L 633.82,418.75 L 626.18,418.75 L 619.57,414.93 L 615.75,408.32 L 615.75,400.68 L 619.57,394.07 Z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top4\" stroke=\"#666666\" stroke-width=\"10\" x1=\"630.0\" x2=\"630.0\" y1=\"76.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_disc_bar4\" stroke=\"#666666\" stroke-width=\"10\" x1=\"608.0\" x2=\"652.0\" y1=\"162.0\" y2=\"162.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot4\" stroke=\"#666666\" stroke-width=\"10\" x1=\"630.0\" x2=\"630.0\" y1=\"312.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_30\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"630.0\" x2=\"588.0\" y1=\"312.0\" y2=\"170\"/>\n  <rect fill=\"none\" height=\"76.0\" id=\"svg_29\" stroke=\"#666666\" stroke-width=\"9\" transform=\"rotate(-16.5 609.0 241.0)\" width=\"38.0\" x=\"590.0\" y=\"203.0\"/>\n  <line fill=\"none\" id=\"svg_dash\" stroke=\"#666666\" stroke-dasharray=\"10,10\" stroke-width=\"9\" x1=\"69.0\" x2=\"609.0\" y1=\"241\" y2=\"241\"/>\n </g>"}, "protection_motor_circuit_breaker_2p(1).svg": {"vb": "0 0 480.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <rect fill=\"none\" height=\"96.0\" id=\"svg_prot_box\" stroke=\"#666666\" stroke-width=\"9\" width=\"276.0\" x=\"132.0\" y=\"242.0\"/>\n  <line fill=\"none\" id=\"svg_prot_divider\" stroke=\"#666666\" stroke-width=\"8\" x1=\"132.0\" x2=\"408.0\" y1=\"290.0\" y2=\"290.0\"/>\n  <rect fill=\"none\" height=\"40.0\" id=\"svg_mech_box\" stroke=\"#666666\" stroke-width=\"8\" width=\"40.0\" x=\"52.0\" y=\"158.0\"/>\n  <line fill=\"none\" id=\"svg_mech_cross_v\" stroke=\"#666666\" stroke-width=\"7\" x1=\"72.0\" x2=\"72.0\" y1=\"158.0\" y2=\"198.0\"/>\n  <line fill=\"none\" id=\"svg_mech_cross_h\" stroke=\"#666666\" stroke-width=\"7\" x1=\"52.0\" x2=\"92.0\" y1=\"178.0\" y2=\"178.0\"/>\n  <line fill=\"none\" id=\"svg_latch_v\" stroke=\"#666666\" stroke-width=\"8\" x1=\"38.0\" x2=\"38.0\" y1=\"168.0\" y2=\"188.0\"/>\n  <line fill=\"none\" id=\"svg_latch_h\" stroke=\"#666666\" stroke-dasharray=\"6,6\" stroke-width=\"7\" x1=\"38.0\" x2=\"52.0\" y1=\"178.0\" y2=\"178.0\"/>\n  <line fill=\"none\" id=\"svg_dash_top\" stroke=\"#666666\" stroke-dasharray=\"8,8\" stroke-width=\"8\" x1=\"92.0\" x2=\"342.0\" y1=\"178.0\" y2=\"178.0\"/>\n  <line fill=\"none\" id=\"svg_dash_vert\" stroke=\"#666666\" stroke-dasharray=\"8,8\" stroke-width=\"7\" x1=\"72.0\" x2=\"72.0\" y1=\"198.0\" y2=\"314.0\"/>\n  <line fill=\"none\" id=\"svg_dash_mid\" stroke=\"#666666\" stroke-dasharray=\"8,8\" stroke-width=\"7\" x1=\"72.0\" x2=\"132.0\" y1=\"266.0\" y2=\"266.0\"/>\n  <line fill=\"none\" id=\"svg_dash_bot\" stroke=\"#666666\" stroke-dasharray=\"8,8\" stroke-width=\"7\" x1=\"72.0\" x2=\"132.0\" y1=\"314.0\" y2=\"314.0\"/>\n  <path d=\"M 176.18,53.75 L 183.82,53.75 L 190.43,57.57 L 194.25,64.18 L 194.25,71.82 L 190.43,78.43 L 183.82,82.25 L 176.18,82.25 L 169.57,78.43 L 165.75,71.82 L 165.75,64.18 L 169.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 176.18,390.25 L 183.82,390.25 L 190.43,394.07 L 194.25,400.68 L 194.25,408.32 L 190.43,414.93 L 183.82,418.75 L 176.18,418.75 L 169.57,414.93 L 165.75,408.32 L 165.75,400.68 L 169.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"180.0\" x2=\"180.0\" y1=\"76.0\" y2=\"138.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"170.0\" x2=\"190.0\" y1=\"128.0\" y2=\"148.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"170.0\" x2=\"190.0\" y1=\"148.0\" y2=\"128.0\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"180.0\" x2=\"146.0\" y1=\"218.0\" y2=\"142.0\"/>\n  <line fill=\"none\" id=\"svg_conn1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"180.0\" x2=\"180.0\" y1=\"218.0\" y2=\"242.0\"/>\n  <path d=\"M 168.0,254.0 L 190.0,254.0 L 190.0,278.0 L 168.0,278.0 L 168.0,286.0\" fill=\"none\" id=\"svg_thermal1\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"7\"/>\n  <path d=\"M 166.0,304.0 L 166.0,324.0 M 161.0,304.0 L 171.0,304.0 M 161.0,324.0 L 171.0,324.0\" fill=\"none\" id=\"svg_mag_i1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"5\"/>\n  <path d=\"M 182.0,306.0 L 196.0,314.0 L 182.0,322.0\" fill=\"none\" id=\"svg_mag_gt1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"5\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"180.0\" x2=\"180.0\" y1=\"338.0\" y2=\"396.5\"/>\n  <path d=\"M 356.18,53.75 L 363.82,53.75 L 370.43,57.57 L 374.25,64.18 L 374.25,71.82 L 370.43,78.43 L 363.82,82.25 L 356.18,82.25 L 349.57,78.43 L 345.75,71.82 L 345.75,64.18 L 349.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 356.18,390.25 L 363.82,390.25 L 370.43,394.07 L 374.25,400.68 L 374.25,408.32 L 370.43,414.93 L 363.82,418.75 L 356.18,418.75 L 349.57,414.93 L 345.75,408.32 L 345.75,400.68 L 349.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"360.0\" x2=\"360.0\" y1=\"76.0\" y2=\"138.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"350.0\" x2=\"370.0\" y1=\"128.0\" y2=\"148.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"350.0\" x2=\"370.0\" y1=\"148.0\" y2=\"128.0\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"360.0\" x2=\"326.0\" y1=\"218.0\" y2=\"142.0\"/>\n  <line fill=\"none\" id=\"svg_conn2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"360.0\" x2=\"360.0\" y1=\"218.0\" y2=\"242.0\"/>\n  <path d=\"M 348.0,254.0 L 370.0,254.0 L 370.0,278.0 L 348.0,278.0 L 348.0,286.0\" fill=\"none\" id=\"svg_thermal2\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"7\"/>\n  <path d=\"M 346.0,304.0 L 346.0,324.0 M 341.0,304.0 L 351.0,304.0 M 341.0,324.0 L 351.0,324.0\" fill=\"none\" id=\"svg_mag_i2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"5\"/>\n  <path d=\"M 362.0,306.0 L 376.0,314.0 L 362.0,322.0\" fill=\"none\" id=\"svg_mag_gt2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"5\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"360.0\" x2=\"360.0\" y1=\"338.0\" y2=\"396.5\"/>\n </g>"}, "protection_motor_circuit_breaker_2p.svg": {"vb": "0 0 480.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <rect fill=\"none\" height=\"96.0\" id=\"svg_prot_box\" stroke=\"#666666\" stroke-width=\"9\" width=\"276.0\" x=\"132.0\" y=\"242.0\"/>\n  <line fill=\"none\" id=\"svg_prot_divider\" stroke=\"#666666\" stroke-width=\"8\" x1=\"132.0\" x2=\"408.0\" y1=\"290.0\" y2=\"290.0\"/>\n  <rect fill=\"none\" height=\"40.0\" id=\"svg_mech_box\" stroke=\"#666666\" stroke-width=\"8\" width=\"40.0\" x=\"52.0\" y=\"158.0\"/>\n  <line fill=\"none\" id=\"svg_mech_cross_v\" stroke=\"#666666\" stroke-width=\"7\" x1=\"72.0\" x2=\"72.0\" y1=\"158.0\" y2=\"198.0\"/>\n  <line fill=\"none\" id=\"svg_mech_cross_h\" stroke=\"#666666\" stroke-width=\"7\" x1=\"52.0\" x2=\"92.0\" y1=\"178.0\" y2=\"178.0\"/>\n  <line fill=\"none\" id=\"svg_latch_v\" stroke=\"#666666\" stroke-width=\"8\" x1=\"38.0\" x2=\"38.0\" y1=\"168.0\" y2=\"188.0\"/>\n  <line fill=\"none\" id=\"svg_latch_h\" stroke=\"#666666\" stroke-dasharray=\"6,6\" stroke-width=\"7\" x1=\"38.0\" x2=\"52.0\" y1=\"178.0\" y2=\"178.0\"/>\n  <line fill=\"none\" id=\"svg_dash_top\" stroke=\"#666666\" stroke-dasharray=\"8,8\" stroke-width=\"8\" x1=\"92.0\" x2=\"342.0\" y1=\"178.0\" y2=\"178.0\"/>\n  <line fill=\"none\" id=\"svg_dash_vert\" stroke=\"#666666\" stroke-dasharray=\"8,8\" stroke-width=\"7\" x1=\"72.0\" x2=\"72.0\" y1=\"198.0\" y2=\"314.0\"/>\n  <line fill=\"none\" id=\"svg_dash_mid\" stroke=\"#666666\" stroke-dasharray=\"8,8\" stroke-width=\"7\" x1=\"72.0\" x2=\"132.0\" y1=\"266.0\" y2=\"266.0\"/>\n  <line fill=\"none\" id=\"svg_dash_bot\" stroke=\"#666666\" stroke-dasharray=\"8,8\" stroke-width=\"7\" x1=\"72.0\" x2=\"132.0\" y1=\"314.0\" y2=\"314.0\"/>\n  <path d=\"M 176.18,53.75 L 183.82,53.75 L 190.43,57.57 L 194.25,64.18 L 194.25,71.82 L 190.43,78.43 L 183.82,82.25 L 176.18,82.25 L 169.57,78.43 L 165.75,71.82 L 165.75,64.18 L 169.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 176.18,390.25 L 183.82,390.25 L 190.43,394.07 L 194.25,400.68 L 194.25,408.32 L 190.43,414.93 L 183.82,418.75 L 176.18,418.75 L 169.57,414.93 L 165.75,408.32 L 165.75,400.68 L 169.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"180.0\" x2=\"180.0\" y1=\"76.0\" y2=\"138.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"170.0\" x2=\"190.0\" y1=\"128.0\" y2=\"148.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"170.0\" x2=\"190.0\" y1=\"148.0\" y2=\"128.0\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"180.0\" x2=\"146.0\" y1=\"218.0\" y2=\"142.0\"/>\n  <line fill=\"none\" id=\"svg_conn1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"180.0\" x2=\"180.0\" y1=\"218.0\" y2=\"242.0\"/>\n  <path d=\"M 168.0,254.0 L 190.0,254.0 L 190.0,278.0 L 168.0,278.0 L 168.0,286.0\" fill=\"none\" id=\"svg_thermal1\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"7\"/>\n  <path d=\"M 166.0,304.0 L 166.0,324.0 M 161.0,304.0 L 171.0,304.0 M 161.0,324.0 L 171.0,324.0\" fill=\"none\" id=\"svg_mag_i1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"5\"/>\n  <path d=\"M 182.0,306.0 L 196.0,314.0 L 182.0,322.0\" fill=\"none\" id=\"svg_mag_gt1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"5\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"180.0\" x2=\"180.0\" y1=\"338.0\" y2=\"396.5\"/>\n  <path d=\"M 356.18,53.75 L 363.82,53.75 L 370.43,57.57 L 374.25,64.18 L 374.25,71.82 L 370.43,78.43 L 363.82,82.25 L 356.18,82.25 L 349.57,78.43 L 345.75,71.82 L 345.75,64.18 L 349.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 356.18,390.25 L 363.82,390.25 L 370.43,394.07 L 374.25,400.68 L 374.25,408.32 L 370.43,414.93 L 363.82,418.75 L 356.18,418.75 L 349.57,414.93 L 345.75,408.32 L 345.75,400.68 L 349.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"360.0\" x2=\"360.0\" y1=\"76.0\" y2=\"138.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"350.0\" x2=\"370.0\" y1=\"128.0\" y2=\"148.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"350.0\" x2=\"370.0\" y1=\"148.0\" y2=\"128.0\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"360.0\" x2=\"326.0\" y1=\"218.0\" y2=\"142.0\"/>\n  <line fill=\"none\" id=\"svg_conn2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"360.0\" x2=\"360.0\" y1=\"218.0\" y2=\"242.0\"/>\n  <path d=\"M 348.0,254.0 L 370.0,254.0 L 370.0,278.0 L 348.0,278.0 L 348.0,286.0\" fill=\"none\" id=\"svg_thermal2\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"7\"/>\n  <path d=\"M 346.0,304.0 L 346.0,324.0 M 341.0,304.0 L 351.0,304.0 M 341.0,324.0 L 351.0,324.0\" fill=\"none\" id=\"svg_mag_i2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"5\"/>\n  <path d=\"M 362.0,306.0 L 376.0,314.0 L 362.0,322.0\" fill=\"none\" id=\"svg_mag_gt2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"5\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"360.0\" x2=\"360.0\" y1=\"338.0\" y2=\"396.5\"/>\n </g>"}, "protection_motor_circuit_breaker_3p(1).svg": {"vb": "0 0 660.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <rect fill=\"none\" height=\"96.0\" id=\"svg_prot_box\" stroke=\"#666666\" stroke-width=\"9\" width=\"456.0\" x=\"132.0\" y=\"242.0\"/>\n  <line fill=\"none\" id=\"svg_prot_divider\" stroke=\"#666666\" stroke-width=\"8\" x1=\"132.0\" x2=\"588.0\" y1=\"290.0\" y2=\"290.0\"/>\n  <rect fill=\"none\" height=\"40.0\" id=\"svg_mech_box\" stroke=\"#666666\" stroke-width=\"8\" width=\"40.0\" x=\"52.0\" y=\"158.0\"/>\n  <line fill=\"none\" id=\"svg_mech_cross_v\" stroke=\"#666666\" stroke-width=\"7\" x1=\"72.0\" x2=\"72.0\" y1=\"158.0\" y2=\"198.0\"/>\n  <line fill=\"none\" id=\"svg_mech_cross_h\" stroke=\"#666666\" stroke-width=\"7\" x1=\"52.0\" x2=\"92.0\" y1=\"178.0\" y2=\"178.0\"/>\n  <line fill=\"none\" id=\"svg_latch_v\" stroke=\"#666666\" stroke-width=\"8\" x1=\"38.0\" x2=\"38.0\" y1=\"168.0\" y2=\"188.0\"/>\n  <line fill=\"none\" id=\"svg_latch_h\" stroke=\"#666666\" stroke-dasharray=\"6,6\" stroke-width=\"7\" x1=\"38.0\" x2=\"52.0\" y1=\"178.0\" y2=\"178.0\"/>\n  <line fill=\"none\" id=\"svg_dash_top\" stroke=\"#666666\" stroke-dasharray=\"8,8\" stroke-width=\"8\" x1=\"92.0\" x2=\"522.0\" y1=\"178.0\" y2=\"178.0\"/>\n  <line fill=\"none\" id=\"svg_dash_vert\" stroke=\"#666666\" stroke-dasharray=\"8,8\" stroke-width=\"7\" x1=\"72.0\" x2=\"72.0\" y1=\"198.0\" y2=\"314.0\"/>\n  <line fill=\"none\" id=\"svg_dash_mid\" stroke=\"#666666\" stroke-dasharray=\"8,8\" stroke-width=\"7\" x1=\"72.0\" x2=\"132.0\" y1=\"266.0\" y2=\"266.0\"/>\n  <line fill=\"none\" id=\"svg_dash_bot\" stroke=\"#666666\" stroke-dasharray=\"8,8\" stroke-width=\"7\" x1=\"72.0\" x2=\"132.0\" y1=\"314.0\" y2=\"314.0\"/>\n  <path d=\"M 176.18,53.75 L 183.82,53.75 L 190.43,57.57 L 194.25,64.18 L 194.25,71.82 L 190.43,78.43 L 183.82,82.25 L 176.18,82.25 L 169.57,78.43 L 165.75,71.82 L 165.75,64.18 L 169.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 176.18,390.25 L 183.82,390.25 L 190.43,394.07 L 194.25,400.68 L 194.25,408.32 L 190.43,414.93 L 183.82,418.75 L 176.18,418.75 L 169.57,414.93 L 165.75,408.32 L 165.75,400.68 L 169.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"180.0\" x2=\"180.0\" y1=\"76.0\" y2=\"138.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"170.0\" x2=\"190.0\" y1=\"128.0\" y2=\"148.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"170.0\" x2=\"190.0\" y1=\"148.0\" y2=\"128.0\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"180.0\" x2=\"146.0\" y1=\"218.0\" y2=\"142.0\"/>\n  <line fill=\"none\" id=\"svg_conn1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"180.0\" x2=\"180.0\" y1=\"218.0\" y2=\"242.0\"/>\n  <path d=\"M 168.0,254.0 L 190.0,254.0 L 190.0,278.0 L 168.0,278.0 L 168.0,286.0\" fill=\"none\" id=\"svg_thermal1\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"7\"/>\n  <path d=\"M 166.0,304.0 L 166.0,324.0 M 161.0,304.0 L 171.0,304.0 M 161.0,324.0 L 171.0,324.0\" fill=\"none\" id=\"svg_mag_i1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"5\"/>\n  <path d=\"M 182.0,306.0 L 196.0,314.0 L 182.0,322.0\" fill=\"none\" id=\"svg_mag_gt1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"5\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"180.0\" x2=\"180.0\" y1=\"338.0\" y2=\"396.5\"/>\n  <path d=\"M 356.18,53.75 L 363.82,53.75 L 370.43,57.57 L 374.25,64.18 L 374.25,71.82 L 370.43,78.43 L 363.82,82.25 L 356.18,82.25 L 349.57,78.43 L 345.75,71.82 L 345.75,64.18 L 349.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 356.18,390.25 L 363.82,390.25 L 370.43,394.07 L 374.25,400.68 L 374.25,408.32 L 370.43,414.93 L 363.82,418.75 L 356.18,418.75 L 349.57,414.93 L 345.75,408.32 L 345.75,400.68 L 349.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"360.0\" x2=\"360.0\" y1=\"76.0\" y2=\"138.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"350.0\" x2=\"370.0\" y1=\"128.0\" y2=\"148.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"350.0\" x2=\"370.0\" y1=\"148.0\" y2=\"128.0\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"360.0\" x2=\"326.0\" y1=\"218.0\" y2=\"142.0\"/>\n  <line fill=\"none\" id=\"svg_conn2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"360.0\" x2=\"360.0\" y1=\"218.0\" y2=\"242.0\"/>\n  <path d=\"M 348.0,254.0 L 370.0,254.0 L 370.0,278.0 L 348.0,278.0 L 348.0,286.0\" fill=\"none\" id=\"svg_thermal2\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"7\"/>\n  <path d=\"M 346.0,304.0 L 346.0,324.0 M 341.0,304.0 L 351.0,304.0 M 341.0,324.0 L 351.0,324.0\" fill=\"none\" id=\"svg_mag_i2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"5\"/>\n  <path d=\"M 362.0,306.0 L 376.0,314.0 L 362.0,322.0\" fill=\"none\" id=\"svg_mag_gt2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"5\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"360.0\" x2=\"360.0\" y1=\"338.0\" y2=\"396.5\"/>\n  <path d=\"M 536.18,53.75 L 543.82,53.75 L 550.43,57.57 L 554.25,64.18 L 554.25,71.82 L 550.43,78.43 L 543.82,82.25 L 536.18,82.25 L 529.57,78.43 L 525.75,71.82 L 525.75,64.18 L 529.57,57.57 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 536.18,390.25 L 543.82,390.25 L 550.43,394.07 L 554.25,400.68 L 554.25,408.32 L 550.43,414.93 L 543.82,418.75 L 536.18,418.75 L 529.57,414.93 L 525.75,408.32 L 525.75,400.68 L 529.57,394.07 Z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"540.0\" x2=\"540.0\" y1=\"76.0\" y2=\"138.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x3_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"530.0\" x2=\"550.0\" y1=\"128.0\" y2=\"148.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x3_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"530.0\" x2=\"550.0\" y1=\"148.0\" y2=\"128.0\"/>\n  <line fill=\"none\" id=\"svg_flapper3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"540.0\" x2=\"506.0\" y1=\"218.0\" y2=\"142.0\"/>\n  <line fill=\"none\" id=\"svg_conn3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"540.0\" x2=\"540.0\" y1=\"218.0\" y2=\"242.0\"/>\n  <path d=\"M 528.0,254.0 L 550.0,254.0 L 550.0,278.0 L 528.0,278.0 L 528.0,286.0\" fill=\"none\" id=\"svg_thermal3\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"7\"/>\n  <path d=\"M 526.0,304.0 L 526.0,324.0 M 521.0,304.0 L 531.0,304.0 M 521.0,324.0 L 531.0,324.0\" fill=\"none\" id=\"svg_mag_i3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"5\"/>\n  <path d=\"M 542.0,306.0 L 556.0,314.0 L 542.0,322.0\" fill=\"none\" id=\"svg_mag_gt3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"5\"/>\n  <line fill=\"none\" id=\"svg_stem_bot3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"540.0\" x2=\"540.0\" y1=\"338.0\" y2=\"396.5\"/>\n </g>"}, "protection_motor_circuit_breaker_3p.svg": {"vb": "0 0 660.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <rect fill=\"none\" height=\"96.0\" id=\"svg_prot_box\" stroke=\"#666666\" stroke-width=\"9\" width=\"456.0\" x=\"132.0\" y=\"242.0\"/>\n  <line fill=\"none\" id=\"svg_prot_divider\" stroke=\"#666666\" stroke-width=\"8\" x1=\"132.0\" x2=\"588.0\" y1=\"290.0\" y2=\"290.0\"/>\n  <rect fill=\"none\" height=\"40.0\" id=\"svg_mech_box\" stroke=\"#666666\" stroke-width=\"8\" width=\"40.0\" x=\"52.0\" y=\"158.0\"/>\n  <line fill=\"none\" id=\"svg_mech_cross_v\" stroke=\"#666666\" stroke-width=\"7\" x1=\"72.0\" x2=\"72.0\" y1=\"158.0\" y2=\"198.0\"/>\n  <line fill=\"none\" id=\"svg_mech_cross_h\" stroke=\"#666666\" stroke-width=\"7\" x1=\"52.0\" x2=\"92.0\" y1=\"178.0\" y2=\"178.0\"/>\n  <line fill=\"none\" id=\"svg_latch_v\" stroke=\"#666666\" stroke-width=\"8\" x1=\"38.0\" x2=\"38.0\" y1=\"168.0\" y2=\"188.0\"/>\n  <line fill=\"none\" id=\"svg_latch_h\" stroke=\"#666666\" stroke-dasharray=\"6,6\" stroke-width=\"7\" x1=\"38.0\" x2=\"52.0\" y1=\"178.0\" y2=\"178.0\"/>\n  <line fill=\"none\" id=\"svg_dash_top\" stroke=\"#666666\" stroke-dasharray=\"8,8\" stroke-width=\"8\" x1=\"92.0\" x2=\"522.0\" y1=\"178.0\" y2=\"178.0\"/>\n  <line fill=\"none\" id=\"svg_dash_vert\" stroke=\"#666666\" stroke-dasharray=\"8,8\" stroke-width=\"7\" x1=\"72.0\" x2=\"72.0\" y1=\"198.0\" y2=\"314.0\"/>\n  <line fill=\"none\" id=\"svg_dash_mid\" stroke=\"#666666\" stroke-dasharray=\"8,8\" stroke-width=\"7\" x1=\"72.0\" x2=\"132.0\" y1=\"266.0\" y2=\"266.0\"/>\n  <line fill=\"none\" id=\"svg_dash_bot\" stroke=\"#666666\" stroke-dasharray=\"8,8\" stroke-width=\"7\" x1=\"72.0\" x2=\"132.0\" y1=\"314.0\" y2=\"314.0\"/>\n  <path d=\"M 176.18,53.75 L 183.82,53.75 L 190.43,57.57 L 194.25,64.18 L 194.25,71.82 L 190.43,78.43 L 183.82,82.25 L 176.18,82.25 L 169.57,78.43 L 165.75,71.82 L 165.75,64.18 L 169.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 176.18,390.25 L 183.82,390.25 L 190.43,394.07 L 194.25,400.68 L 194.25,408.32 L 190.43,414.93 L 183.82,418.75 L 176.18,418.75 L 169.57,414.93 L 165.75,408.32 L 165.75,400.68 L 169.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"180.0\" x2=\"180.0\" y1=\"76.0\" y2=\"138.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"170.0\" x2=\"190.0\" y1=\"128.0\" y2=\"148.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x1_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"170.0\" x2=\"190.0\" y1=\"148.0\" y2=\"128.0\"/>\n  <line fill=\"none\" id=\"svg_flapper1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"180.0\" x2=\"146.0\" y1=\"218.0\" y2=\"142.0\"/>\n  <line fill=\"none\" id=\"svg_conn1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"180.0\" x2=\"180.0\" y1=\"218.0\" y2=\"242.0\"/>\n  <path d=\"M 168.0,254.0 L 190.0,254.0 L 190.0,278.0 L 168.0,278.0 L 168.0,286.0\" fill=\"none\" id=\"svg_thermal1\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"7\"/>\n  <path d=\"M 166.0,304.0 L 166.0,324.0 M 161.0,304.0 L 171.0,304.0 M 161.0,324.0 L 171.0,324.0\" fill=\"none\" id=\"svg_mag_i1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"5\"/>\n  <path d=\"M 182.0,306.0 L 196.0,314.0 L 182.0,322.0\" fill=\"none\" id=\"svg_mag_gt1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"5\"/>\n  <line fill=\"none\" id=\"svg_stem_bot1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"180.0\" x2=\"180.0\" y1=\"338.0\" y2=\"396.5\"/>\n  <path d=\"M 356.18,53.75 L 363.82,53.75 L 370.43,57.57 L 374.25,64.18 L 374.25,71.82 L 370.43,78.43 L 363.82,82.25 L 356.18,82.25 L 349.57,78.43 L 345.75,71.82 L 345.75,64.18 L 349.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 356.18,390.25 L 363.82,390.25 L 370.43,394.07 L 374.25,400.68 L 374.25,408.32 L 370.43,414.93 L 363.82,418.75 L 356.18,418.75 L 349.57,414.93 L 345.75,408.32 L 345.75,400.68 L 349.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"360.0\" x2=\"360.0\" y1=\"76.0\" y2=\"138.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"350.0\" x2=\"370.0\" y1=\"128.0\" y2=\"148.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x2_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"350.0\" x2=\"370.0\" y1=\"148.0\" y2=\"128.0\"/>\n  <line fill=\"none\" id=\"svg_flapper2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"360.0\" x2=\"326.0\" y1=\"218.0\" y2=\"142.0\"/>\n  <line fill=\"none\" id=\"svg_conn2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"360.0\" x2=\"360.0\" y1=\"218.0\" y2=\"242.0\"/>\n  <path d=\"M 348.0,254.0 L 370.0,254.0 L 370.0,278.0 L 348.0,278.0 L 348.0,286.0\" fill=\"none\" id=\"svg_thermal2\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"7\"/>\n  <path d=\"M 346.0,304.0 L 346.0,324.0 M 341.0,304.0 L 351.0,304.0 M 341.0,324.0 L 351.0,324.0\" fill=\"none\" id=\"svg_mag_i2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"5\"/>\n  <path d=\"M 362.0,306.0 L 376.0,314.0 L 362.0,322.0\" fill=\"none\" id=\"svg_mag_gt2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"5\"/>\n  <line fill=\"none\" id=\"svg_stem_bot2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"360.0\" x2=\"360.0\" y1=\"338.0\" y2=\"396.5\"/>\n  <path d=\"M 536.18,53.75 L 543.82,53.75 L 550.43,57.57 L 554.25,64.18 L 554.25,71.82 L 550.43,78.43 L 543.82,82.25 L 536.18,82.25 L 529.57,78.43 L 525.75,71.82 L 525.75,64.18 L 529.57,57.57 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 536.18,390.25 L 543.82,390.25 L 550.43,394.07 L 554.25,400.68 L 554.25,408.32 L 550.43,414.93 L 543.82,418.75 L 536.18,418.75 L 529.57,414.93 L 525.75,408.32 L 525.75,400.68 L 529.57,394.07 Z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"540.0\" x2=\"540.0\" y1=\"76.0\" y2=\"138.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x3_1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"530.0\" x2=\"550.0\" y1=\"128.0\" y2=\"148.0\"/>\n  <line fill=\"none\" id=\"svg_cb_x3_2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"530.0\" x2=\"550.0\" y1=\"148.0\" y2=\"128.0\"/>\n  <line fill=\"none\" id=\"svg_flapper3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"540.0\" x2=\"506.0\" y1=\"218.0\" y2=\"142.0\"/>\n  <line fill=\"none\" id=\"svg_conn3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"540.0\" x2=\"540.0\" y1=\"218.0\" y2=\"242.0\"/>\n  <path d=\"M 528.0,254.0 L 550.0,254.0 L 550.0,278.0 L 528.0,278.0 L 528.0,286.0\" fill=\"none\" id=\"svg_thermal3\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"7\"/>\n  <path d=\"M 526.0,304.0 L 526.0,324.0 M 521.0,304.0 L 531.0,304.0 M 521.0,324.0 L 531.0,324.0\" fill=\"none\" id=\"svg_mag_i3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"5\"/>\n  <path d=\"M 542.0,306.0 L 556.0,314.0 L 542.0,322.0\" fill=\"none\" id=\"svg_mag_gt3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"5\"/>\n  <line fill=\"none\" id=\"svg_stem_bot3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"540.0\" x2=\"540.0\" y1=\"338.0\" y2=\"396.5\"/>\n </g>"}, "protection_thermal_overload_relay_2p(1).svg": {"vb": "0 0 450.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <rect fill=\"none\" height=\"100.0\" id=\"svg_prot_box\" stroke=\"#666666\" stroke-width=\"10\" width=\"300.0\" x=\"80.0\" y=\"186.0\"/>\n  <path d=\"M 131.18,53.75 L 138.82,53.75 L 145.43,57.57 L 149.25,64.18 L 149.25,71.82 L 145.43,78.43 L 138.82,82.25 L 131.18,82.25 L 124.57,78.43 L 120.75,71.82 L 120.75,64.18 L 124.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 131.18,390.25 L 138.82,390.25 L 145.43,394.07 L 149.25,400.68 L 149.25,408.32 L 145.43,414.93 L 138.82,418.75 L 131.18,418.75 L 124.57,414.93 L 120.75,408.32 L 120.75,400.68 L 124.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 135.0,76.0 L 135.0,212 L 163.0,212 L 163.0,260 L 135.0,260 L 135.0,396.5\" fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n  <path d=\"M 311.18,53.75 L 318.82,53.75 L 325.43,57.57 L 329.25,64.18 L 329.25,71.82 L 325.43,78.43 L 318.82,82.25 L 311.18,82.25 L 304.57,78.43 L 300.75,71.82 L 300.75,64.18 L 304.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 311.18,390.25 L 318.82,390.25 L 325.43,394.07 L 329.25,400.68 L 329.25,408.32 L 325.43,414.93 L 318.82,418.75 L 311.18,418.75 L 304.57,414.93 L 300.75,408.32 L 300.75,400.68 L 304.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 315.0,76.0 L 315.0,212 L 343.0,212 L 343.0,260 L 315.0,260 L 315.0,396.5\" fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n </g>"}, "protection_thermal_overload_relay_2p.svg": {"vb": "0 0 450.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <rect fill=\"none\" height=\"100.0\" id=\"svg_prot_box\" stroke=\"#666666\" stroke-width=\"10\" width=\"300.0\" x=\"80.0\" y=\"186.0\"/>\n  <path d=\"M 131.18,53.75 L 138.82,53.75 L 145.43,57.57 L 149.25,64.18 L 149.25,71.82 L 145.43,78.43 L 138.82,82.25 L 131.18,82.25 L 124.57,78.43 L 120.75,71.82 L 120.75,64.18 L 124.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 131.18,390.25 L 138.82,390.25 L 145.43,394.07 L 149.25,400.68 L 149.25,408.32 L 145.43,414.93 L 138.82,418.75 L 131.18,418.75 L 124.57,414.93 L 120.75,408.32 L 120.75,400.68 L 124.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 135.0,76.0 L 135.0,212 L 163.0,212 L 163.0,260 L 135.0,260 L 135.0,396.5\" fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n  <path d=\"M 311.18,53.75 L 318.82,53.75 L 325.43,57.57 L 329.25,64.18 L 329.25,71.82 L 325.43,78.43 L 318.82,82.25 L 311.18,82.25 L 304.57,78.43 L 300.75,71.82 L 300.75,64.18 L 304.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 311.18,390.25 L 318.82,390.25 L 325.43,394.07 L 329.25,400.68 L 329.25,408.32 L 325.43,414.93 L 318.82,418.75 L 311.18,418.75 L 304.57,414.93 L 300.75,408.32 L 300.75,400.68 L 304.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 315.0,76.0 L 315.0,212 L 343.0,212 L 343.0,260 L 315.0,260 L 315.0,396.5\" fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n </g>"}, "protection_thermal_overload_relay_3p(1).svg": {"vb": "0 0 540.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <rect fill=\"none\" height=\"100.0\" id=\"svg_prot_box\" stroke=\"#666666\" stroke-width=\"10\" width=\"480.0\" x=\"35.0\" y=\"186.0\"/>\n  <path d=\"M 86.18,53.75 L 93.82,53.75 L 100.43,57.57 L 104.25,64.18 L 104.25,71.82 L 100.43,78.43 L 93.82,82.25 L 86.18,82.25 L 79.57,78.43 L 75.75,71.82 L 75.75,64.18 L 79.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 86.18,390.25 L 93.82,390.25 L 100.43,394.07 L 104.25,400.68 L 104.25,408.32 L 100.43,414.93 L 93.82,418.75 L 86.18,418.75 L 79.57,414.93 L 75.75,408.32 L 75.75,400.68 L 79.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 90.0,76.0 L 90.0,212 L 118.0,212 L 118.0,260 L 90.0,260 L 90.0,396.5\" fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n  <path d=\"M 266.18,53.75 L 273.82,53.75 L 280.43,57.57 L 284.25,64.18 L 284.25,71.82 L 280.43,78.43 L 273.82,82.25 L 266.18,82.25 L 259.57,78.43 L 255.75,71.82 L 255.75,64.18 L 259.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 266.18,390.25 L 273.82,390.25 L 280.43,394.07 L 284.25,400.68 L 284.25,408.32 L 280.43,414.93 L 273.82,418.75 L 266.18,418.75 L 259.57,414.93 L 255.75,408.32 L 255.75,400.68 L 259.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 270.0,76.0 L 270.0,212 L 298.0,212 L 298.0,260 L 270.0,260 L 270.0,396.5\" fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n  <path d=\"M 446.18,53.75 L 453.82,53.75 L 460.43,57.57 L 464.25,64.18 L 464.25,71.82 L 460.43,78.43 L 453.82,82.25 L 446.18,82.25 L 439.57,78.43 L 435.75,71.82 L 435.75,64.18 L 439.57,57.57 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 446.18,390.25 L 453.82,390.25 L 460.43,394.07 L 464.25,400.68 L 464.25,408.32 L 460.43,414.93 L 453.82,418.75 L 446.18,418.75 L 439.57,414.93 L 435.75,408.32 L 435.75,400.68 L 439.57,394.07 Z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 450.0,76.0 L 450.0,212 L 478.0,212 L 478.0,260 L 450.0,260 L 450.0,396.5\" fill=\"none\" id=\"svg_stem3\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n </g>"}, "protection_thermal_overload_relay_3p.svg": {"vb": "0 0 540.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <rect fill=\"none\" height=\"100.0\" id=\"svg_prot_box\" stroke=\"#666666\" stroke-width=\"10\" width=\"480.0\" x=\"35.0\" y=\"186.0\"/>\n  <path d=\"M 86.18,53.75 L 93.82,53.75 L 100.43,57.57 L 104.25,64.18 L 104.25,71.82 L 100.43,78.43 L 93.82,82.25 L 86.18,82.25 L 79.57,78.43 L 75.75,71.82 L 75.75,64.18 L 79.57,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 86.18,390.25 L 93.82,390.25 L 100.43,394.07 L 104.25,400.68 L 104.25,408.32 L 100.43,414.93 L 93.82,418.75 L 86.18,418.75 L 79.57,414.93 L 75.75,408.32 L 75.75,400.68 L 79.57,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 90.0,76.0 L 90.0,212 L 118.0,212 L 118.0,260 L 90.0,260 L 90.0,396.5\" fill=\"none\" id=\"svg_stem1\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n  <path d=\"M 266.18,53.75 L 273.82,53.75 L 280.43,57.57 L 284.25,64.18 L 284.25,71.82 L 280.43,78.43 L 273.82,82.25 L 266.18,82.25 L 259.57,78.43 L 255.75,71.82 L 255.75,64.18 L 259.57,57.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 266.18,390.25 L 273.82,390.25 L 280.43,394.07 L 284.25,400.68 L 284.25,408.32 L 280.43,414.93 L 273.82,418.75 L 266.18,418.75 L 259.57,414.93 L 255.75,408.32 L 255.75,400.68 L 259.57,394.07 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 270.0,76.0 L 270.0,212 L 298.0,212 L 298.0,260 L 270.0,260 L 270.0,396.5\" fill=\"none\" id=\"svg_stem2\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n  <path d=\"M 446.18,53.75 L 453.82,53.75 L 460.43,57.57 L 464.25,64.18 L 464.25,71.82 L 460.43,78.43 L 453.82,82.25 L 446.18,82.25 L 439.57,78.43 L 435.75,71.82 L 435.75,64.18 L 439.57,57.57 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 446.18,390.25 L 453.82,390.25 L 460.43,394.07 L 464.25,400.68 L 464.25,408.32 L 460.43,414.93 L 453.82,418.75 L 446.18,418.75 L 439.57,414.93 L 435.75,408.32 L 435.75,400.68 L 439.57,394.07 Z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 450.0,76.0 L 450.0,212 L 478.0,212 L 478.0,260 L 450.0,260 L 450.0,396.5\" fill=\"none\" id=\"svg_stem3\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n </g>"}, "motor_dc_motor(2).svg": {"vb": "0 0 560.0 580.0", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <circle cx=\"280.0\" cy=\"326.0\" fill=\"none\" id=\"svg_motor_circle\" r=\"205.0\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 186.18,41.75 L 193.82,41.75 L 200.43,45.57 L 204.25,52.18 L 204.25,59.82 L 200.43,66.43 L 193.82,70.25 L 186.18,70.25 L 179.57,66.43 L 175.75,59.82 L 175.75,52.18 L 179.57,45.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 366.18,41.75 L 373.82,41.75 L 380.43,45.57 L 384.25,52.18 L 384.25,59.82 L 380.43,66.43 L 373.82,70.25 L 366.18,70.25 L 359.57,66.43 L 355.75,59.82 L 355.75,52.18 L 359.57,45.57 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_t1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"190.0\" x2=\"190.0\" y1=\"64.0\" y2=\"141.81\"/>\n  <line fill=\"none\" id=\"svg_t2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"370.0\" x2=\"370.0\" y1=\"64.0\" y2=\"141.81\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"84\" font-weight=\"bold\" id=\"svg_m\" text-anchor=\"middle\" x=\"280.0\" y=\"316.0\">M</text>\n  <line fill=\"none\" id=\"svg_dc_solid\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"216.0\" x2=\"344.0\" y1=\"356.0\" y2=\"356.0\"/>\n  <line fill=\"none\" id=\"svg_dc_dash1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"216.0\" x2=\"248.0\" y1=\"384.0\" y2=\"384.0\"/>\n  <line fill=\"none\" id=\"svg_dc_dash2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"264.0\" x2=\"296.0\" y1=\"384.0\" y2=\"384.0\"/>\n  <line fill=\"none\" id=\"svg_dc_dash3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"312.0\" x2=\"344.0\" y1=\"384.0\" y2=\"384.0\"/>\n </g>"}, "motor_dc_motor.svg": {"vb": "0 0 560.0 580.0", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <circle cx=\"280.0\" cy=\"326.0\" fill=\"none\" id=\"svg_motor_circle\" r=\"205.0\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 186.18,41.75 L 193.82,41.75 L 200.43,45.57 L 204.25,52.18 L 204.25,59.82 L 200.43,66.43 L 193.82,70.25 L 186.18,70.25 L 179.57,66.43 L 175.75,59.82 L 175.75,52.18 L 179.57,45.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 366.18,41.75 L 373.82,41.75 L 380.43,45.57 L 384.25,52.18 L 384.25,59.82 L 380.43,66.43 L 373.82,70.25 L 366.18,70.25 L 359.57,66.43 L 355.75,59.82 L 355.75,52.18 L 359.57,45.57 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_t1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"190.0\" x2=\"190.0\" y1=\"64.0\" y2=\"141.81\"/>\n  <line fill=\"none\" id=\"svg_t2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"370.0\" x2=\"370.0\" y1=\"64.0\" y2=\"141.81\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"84\" font-weight=\"bold\" id=\"svg_m\" text-anchor=\"middle\" x=\"280.0\" y=\"316.0\">M</text>\n  <line fill=\"none\" id=\"svg_dc_solid\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"216.0\" x2=\"344.0\" y1=\"356.0\" y2=\"356.0\"/>\n  <line fill=\"none\" id=\"svg_dc_dash1\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"216.0\" x2=\"248.0\" y1=\"384.0\" y2=\"384.0\"/>\n  <line fill=\"none\" id=\"svg_dc_dash2\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"264.0\" x2=\"296.0\" y1=\"384.0\" y2=\"384.0\"/>\n  <line fill=\"none\" id=\"svg_dc_dash3\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"312.0\" x2=\"344.0\" y1=\"384.0\" y2=\"384.0\"/>\n </g>"}, "motor_single_phase(2).svg": {"vb": "0 0 680.0 580.0", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <circle cx=\"280.0\" cy=\"326.0\" fill=\"none\" id=\"svg_motor_circle\" r=\"205.0\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 186.18,41.75 L 193.82,41.75 L 200.43,45.57 L 204.25,52.18 L 204.25,59.82 L 200.43,66.43 L 193.82,70.25 L 186.18,70.25 L 179.57,66.43 L 175.75,59.82 L 175.75,52.18 L 179.57,45.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 366.18,41.75 L 373.82,41.75 L 380.43,45.57 L 384.25,52.18 L 384.25,59.82 L 380.43,66.43 L 373.82,70.25 L 366.18,70.25 L 359.57,66.43 L 355.75,59.82 L 355.75,52.18 L 359.57,45.57 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 546.18,41.75 L 553.82,41.75 L 560.43,45.57 L 564.25,52.18 L 564.25,59.82 L 560.43,66.43 L 553.82,70.25 L 546.18,70.25 L 539.57,66.43 L 535.75,59.82 L 535.75,52.18 L 539.57,45.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_t1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"190.0\" x2=\"190.0\" y1=\"64.0\" y2=\"141.81\"/>\n  <line fill=\"none\" id=\"svg_t2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"370.0\" x2=\"370.0\" y1=\"64.0\" y2=\"141.81\"/>\n  <path d=\"M 550.0,64.0 L 550.0,326.0 L 511.0,326.0\" fill=\"none\" id=\"svg_pe_stem\" stroke=\"#666666\" stroke-linejoin=\"round\" stroke-width=\"10\"/>\n  <path d=\"M 491.03,232.04 A 231.0,231.0 0 0 1 491.03,419.96\" fill=\"none\" id=\"svg_pe_arc\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"76\" font-weight=\"bold\" id=\"svg_m1\" text-anchor=\"middle\" x=\"280.0\" y=\"326.0\">M 1</text>\n  <path d=\"M 234.0,374.0 C 250.0,346.0 265.0,346.0 280.0,374.0 C 295.0,402.0 310.0,402.0 326.0,374.0\" fill=\"none\" id=\"svg_ac_tilde\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\"/>\n </g>"}, "motor_single_phase.svg": {"vb": "0 0 680.0 580.0", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <circle cx=\"280.0\" cy=\"326.0\" fill=\"none\" id=\"svg_motor_circle\" r=\"205.0\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 186.18,41.75 L 193.82,41.75 L 200.43,45.57 L 204.25,52.18 L 204.25,59.82 L 200.43,66.43 L 193.82,70.25 L 186.18,70.25 L 179.57,66.43 L 175.75,59.82 L 175.75,52.18 L 179.57,45.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 366.18,41.75 L 373.82,41.75 L 380.43,45.57 L 384.25,52.18 L 384.25,59.82 L 380.43,66.43 L 373.82,70.25 L 366.18,70.25 L 359.57,66.43 L 355.75,59.82 L 355.75,52.18 L 359.57,45.57 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 546.18,41.75 L 553.82,41.75 L 560.43,45.57 L 564.25,52.18 L 564.25,59.82 L 560.43,66.43 L 553.82,70.25 L 546.18,70.25 L 539.57,66.43 L 535.75,59.82 L 535.75,52.18 L 539.57,45.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_t1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"190.0\" x2=\"190.0\" y1=\"64.0\" y2=\"141.81\"/>\n  <line fill=\"none\" id=\"svg_t2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"370.0\" x2=\"370.0\" y1=\"64.0\" y2=\"141.81\"/>\n  <path d=\"M 550.0,64.0 L 550.0,326.0 L 511.0,326.0\" fill=\"none\" id=\"svg_pe_stem\" stroke=\"#666666\" stroke-linejoin=\"round\" stroke-width=\"10\"/>\n  <path d=\"M 491.03,232.04 A 231.0,231.0 0 0 1 491.03,419.96\" fill=\"none\" id=\"svg_pe_arc\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"76\" font-weight=\"bold\" id=\"svg_m1\" text-anchor=\"middle\" x=\"280.0\" y=\"326.0\">M 1</text>\n  <path d=\"M 234.0,374.0 C 250.0,346.0 265.0,346.0 280.0,374.0 C 295.0,402.0 310.0,402.0 326.0,374.0\" fill=\"none\" id=\"svg_ac_tilde\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\"/>\n </g>"}, "motor_three_phase(2).svg": {"vb": "0 0 760.0 580.0", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <circle cx=\"290.0\" cy=\"326.0\" fill=\"none\" id=\"svg_motor_circle\" r=\"205.0\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 106.18,41.75 L 113.82,41.75 L 120.43,45.57 L 124.25,52.18 L 124.25,59.82 L 120.43,66.43 L 113.82,70.25 L 106.18,70.25 L 99.57,66.43 L 95.75,59.82 L 95.75,52.18 L 99.57,45.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 286.18,41.75 L 293.82,41.75 L 300.43,45.57 L 304.25,52.18 L 304.25,59.82 L 300.43,66.43 L 293.82,70.25 L 286.18,70.25 L 279.57,66.43 L 275.75,59.82 L 275.75,52.18 L 279.57,45.57 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 466.18,41.75 L 473.82,41.75 L 480.43,45.57 L 484.25,52.18 L 484.25,59.82 L 480.43,66.43 L 473.82,70.25 L 466.18,70.25 L 459.57,66.43 L 455.75,59.82 L 455.75,52.18 L 459.57,45.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 646.18,41.75 L 653.82,41.75 L 660.43,45.57 L 664.25,52.18 L 664.25,59.82 L 660.43,66.43 L 653.82,70.25 L 646.18,70.25 L 639.57,66.43 L 635.75,59.82 L 635.75,52.18 L 639.57,45.57 Z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_u\" stroke=\"#666666\" stroke-width=\"10\" x1=\"110.0\" x2=\"110.0\" y1=\"64.0\" y2=\"227.89\"/>\n  <line fill=\"none\" id=\"svg_v\" stroke=\"#666666\" stroke-width=\"10\" x1=\"290.0\" x2=\"290.0\" y1=\"64.0\" y2=\"121.0\"/>\n  <line fill=\"none\" id=\"svg_w\" stroke=\"#666666\" stroke-width=\"10\" x1=\"470.0\" x2=\"470.0\" y1=\"64.0\" y2=\"227.89\"/>\n  <path d=\"M 650.0,64.0 L 650.0,326.0 L 521.0,326.0\" fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-linejoin=\"round\" stroke-width=\"10\"/>\n  <path d=\"M 501.03,232.04 A 231.0,231.0 0 0 1 501.03,419.96\" fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"76\" font-weight=\"bold\" id=\"svg_m3\" text-anchor=\"middle\" x=\"290.0\" y=\"326.0\">M 3</text>\n  <path d=\"M 244.0,374.0 C 260.0,346.0 275.0,346.0 290.0,374.0 C 305.0,402.0 320.0,402.0 336.0,374.0\" fill=\"none\" id=\"svg_ac_tilde\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\"/>\n </g>"}, "motor_three_phase.svg": {"vb": "0 0 760.0 580.0", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <circle cx=\"290.0\" cy=\"326.0\" fill=\"none\" id=\"svg_motor_circle\" r=\"205.0\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 106.18,41.75 L 113.82,41.75 L 120.43,45.57 L 124.25,52.18 L 124.25,59.82 L 120.43,66.43 L 113.82,70.25 L 106.18,70.25 L 99.57,66.43 L 95.75,59.82 L 95.75,52.18 L 99.57,45.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 286.18,41.75 L 293.82,41.75 L 300.43,45.57 L 304.25,52.18 L 304.25,59.82 L 300.43,66.43 L 293.82,70.25 L 286.18,70.25 L 279.57,66.43 L 275.75,59.82 L 275.75,52.18 L 279.57,45.57 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 466.18,41.75 L 473.82,41.75 L 480.43,45.57 L 484.25,52.18 L 484.25,59.82 L 480.43,66.43 L 473.82,70.25 L 466.18,70.25 L 459.57,66.43 L 455.75,59.82 L 455.75,52.18 L 459.57,45.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 646.18,41.75 L 653.82,41.75 L 660.43,45.57 L 664.25,52.18 L 664.25,59.82 L 660.43,66.43 L 653.82,70.25 L 646.18,70.25 L 639.57,66.43 L 635.75,59.82 L 635.75,52.18 L 639.57,45.57 Z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_u\" stroke=\"#666666\" stroke-width=\"10\" x1=\"110.0\" x2=\"110.0\" y1=\"64.0\" y2=\"227.89\"/>\n  <line fill=\"none\" id=\"svg_v\" stroke=\"#666666\" stroke-width=\"10\" x1=\"290.0\" x2=\"290.0\" y1=\"64.0\" y2=\"121.0\"/>\n  <line fill=\"none\" id=\"svg_w\" stroke=\"#666666\" stroke-width=\"10\" x1=\"470.0\" x2=\"470.0\" y1=\"64.0\" y2=\"227.89\"/>\n  <path d=\"M 650.0,64.0 L 650.0,326.0 L 521.0,326.0\" fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-linejoin=\"round\" stroke-width=\"10\"/>\n  <path d=\"M 501.03,232.04 A 231.0,231.0 0 0 1 501.03,419.96\" fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"76\" font-weight=\"bold\" id=\"svg_m3\" text-anchor=\"middle\" x=\"290.0\" y=\"326.0\">M 3</text>\n  <path d=\"M 244.0,374.0 C 260.0,346.0 275.0,346.0 290.0,374.0 C 305.0,402.0 320.0,402.0 336.0,374.0\" fill=\"none\" id=\"svg_ac_tilde\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\"/>\n </g>"}, "motor_three_phase_star_delta(2).svg": {"vb": "0 0 760.0 640.0", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <circle cx=\"290.0\" cy=\"320.0\" fill=\"none\" id=\"svg_motor_circle\" r=\"205.0\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 106.18,37.75 L 113.82,37.75 L 120.43,41.57 L 124.25,48.18 L 124.25,55.82 L 120.43,62.43 L 113.82,66.25 L 106.18,66.25 L 99.57,62.43 L 95.75,55.82 L 95.75,48.18 L 99.57,41.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 286.18,37.75 L 293.82,37.75 L 300.43,41.57 L 304.25,48.18 L 304.25,55.82 L 300.43,62.43 L 293.82,66.25 L 286.18,66.25 L 279.57,62.43 L 275.75,55.82 L 275.75,48.18 L 279.57,41.57 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 466.18,37.75 L 473.82,37.75 L 480.43,41.57 L 484.25,48.18 L 484.25,55.82 L 480.43,62.43 L 473.82,66.25 L 466.18,66.25 L 459.57,62.43 L 455.75,55.82 L 455.75,48.18 L 459.57,41.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 646.18,37.75 L 653.82,37.75 L 660.43,41.57 L 664.25,48.18 L 664.25,55.82 L 660.43,62.43 L 653.82,66.25 L 646.18,66.25 L 639.57,62.43 L 635.75,55.82 L 635.75,48.18 L 639.57,41.57 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 106.18,573.75 L 113.82,573.75 L 120.43,577.57 L 124.25,584.18 L 124.25,591.82 L 120.43,598.43 L 113.82,602.25 L 106.18,602.25 L 99.57,598.43 L 95.75,591.82 L 95.75,584.18 L 99.57,577.57 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 286.18,573.75 L 293.82,573.75 L 300.43,577.57 L 304.25,584.18 L 304.25,591.82 L 300.43,598.43 L 293.82,602.25 L 286.18,602.25 L 279.57,598.43 L 275.75,591.82 L 275.75,584.18 L 279.57,577.57 Z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 466.18,573.75 L 473.82,573.75 L 480.43,577.57 L 484.25,584.18 L 484.25,591.82 L 480.43,598.43 L 473.82,602.25 L 466.18,602.25 L 459.57,598.43 L 455.75,591.82 L 455.75,584.18 L 459.57,577.57 Z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_u1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"110.0\" x2=\"110.0\" y1=\"60.0\" y2=\"221.89\"/>\n  <line fill=\"none\" id=\"svg_v1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"290.0\" x2=\"290.0\" y1=\"60.0\" y2=\"115.0\"/>\n  <line fill=\"none\" id=\"svg_w1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"470.0\" x2=\"470.0\" y1=\"60.0\" y2=\"221.89\"/>\n  <line fill=\"none\" id=\"svg_w2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"110.0\" x2=\"110.0\" y1=\"418.11\" y2=\"580.0\"/>\n  <line fill=\"none\" id=\"svg_u2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"290.0\" x2=\"290.0\" y1=\"525.0\" y2=\"580.0\"/>\n  <line fill=\"none\" id=\"svg_v2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"470.0\" x2=\"470.0\" y1=\"418.11\" y2=\"580.0\"/>\n  <path d=\"M 650.0,60.0 L 650.0,320.0 L 521.0,320.0\" fill=\"none\" id=\"svg_pe_stem\" stroke=\"#666666\" stroke-linejoin=\"round\" stroke-width=\"10\"/>\n  <path d=\"M 501.03,226.04 A 231.0,231.0 0 0 1 501.03,413.96\" fill=\"none\" id=\"svg_pe_arc\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"68\" font-weight=\"bold\" id=\"svg_m3\" text-anchor=\"middle\" x=\"290.0\" y=\"284.0\">M 3</text>\n  <path d=\"M 250.0,324.0 C 264.0,300.0 277.0,300.0 290.0,324.0 C 303.0,348.0 316.0,348.0 330.0,324.0\" fill=\"none\" id=\"svg_ac_tilde\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"44\" font-weight=\"bold\" id=\"svg_star_sym\" text-anchor=\"middle\" x=\"248.0\" y=\"394.0\">Y</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"38\" font-weight=\"bold\" id=\"svg_sd_slash\" text-anchor=\"middle\" x=\"290.0\" y=\"392.0\">/</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"44\" font-weight=\"bold\" id=\"svg_delta_sym\" text-anchor=\"middle\" x=\"332.0\" y=\"394.0\">\u0394</text>\n </g>"}, "motor_three_phase_star_delta.svg": {"vb": "0 0 760.0 640.0", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <circle cx=\"290.0\" cy=\"320.0\" fill=\"none\" id=\"svg_motor_circle\" r=\"205.0\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 106.18,37.75 L 113.82,37.75 L 120.43,41.57 L 124.25,48.18 L 124.25,55.82 L 120.43,62.43 L 113.82,66.25 L 106.18,66.25 L 99.57,62.43 L 95.75,55.82 L 95.75,48.18 L 99.57,41.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 286.18,37.75 L 293.82,37.75 L 300.43,41.57 L 304.25,48.18 L 304.25,55.82 L 300.43,62.43 L 293.82,66.25 L 286.18,66.25 L 279.57,62.43 L 275.75,55.82 L 275.75,48.18 L 279.57,41.57 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 466.18,37.75 L 473.82,37.75 L 480.43,41.57 L 484.25,48.18 L 484.25,55.82 L 480.43,62.43 L 473.82,66.25 L 466.18,66.25 L 459.57,62.43 L 455.75,55.82 L 455.75,48.18 L 459.57,41.57 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 646.18,37.75 L 653.82,37.75 L 660.43,41.57 L 664.25,48.18 L 664.25,55.82 L 660.43,62.43 L 653.82,66.25 L 646.18,66.25 L 639.57,62.43 L 635.75,55.82 L 635.75,48.18 L 639.57,41.57 Z\" fill=\"#666666\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 106.18,573.75 L 113.82,573.75 L 120.43,577.57 L 124.25,584.18 L 124.25,591.82 L 120.43,598.43 L 113.82,602.25 L 106.18,602.25 L 99.57,598.43 L 95.75,591.82 L 95.75,584.18 L 99.57,577.57 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 286.18,573.75 L 293.82,573.75 L 300.43,577.57 L 304.25,584.18 L 304.25,591.82 L 300.43,598.43 L 293.82,602.25 L 286.18,602.25 L 279.57,598.43 L 275.75,591.82 L 275.75,584.18 L 279.57,577.57 Z\" fill=\"#666666\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 466.18,573.75 L 473.82,573.75 L 480.43,577.57 L 484.25,584.18 L 484.25,591.82 L 480.43,598.43 L 473.82,602.25 L 466.18,602.25 L 459.57,598.43 L 455.75,591.82 L 455.75,584.18 L 459.57,577.57 Z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_u1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"110.0\" x2=\"110.0\" y1=\"60.0\" y2=\"221.89\"/>\n  <line fill=\"none\" id=\"svg_v1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"290.0\" x2=\"290.0\" y1=\"60.0\" y2=\"115.0\"/>\n  <line fill=\"none\" id=\"svg_w1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"470.0\" x2=\"470.0\" y1=\"60.0\" y2=\"221.89\"/>\n  <line fill=\"none\" id=\"svg_w2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"110.0\" x2=\"110.0\" y1=\"418.11\" y2=\"580.0\"/>\n  <line fill=\"none\" id=\"svg_u2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"290.0\" x2=\"290.0\" y1=\"525.0\" y2=\"580.0\"/>\n  <line fill=\"none\" id=\"svg_v2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"470.0\" x2=\"470.0\" y1=\"418.11\" y2=\"580.0\"/>\n  <path d=\"M 650.0,60.0 L 650.0,320.0 L 521.0,320.0\" fill=\"none\" id=\"svg_pe_stem\" stroke=\"#666666\" stroke-linejoin=\"round\" stroke-width=\"10\"/>\n  <path d=\"M 501.03,226.04 A 231.0,231.0 0 0 1 501.03,413.96\" fill=\"none\" id=\"svg_pe_arc\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"68\" font-weight=\"bold\" id=\"svg_m3\" text-anchor=\"middle\" x=\"290.0\" y=\"284.0\">M 3</text>\n  <path d=\"M 250.0,324.0 C 264.0,300.0 277.0,300.0 290.0,324.0 C 303.0,348.0 316.0,348.0 330.0,324.0\" fill=\"none\" id=\"svg_ac_tilde\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"44\" font-weight=\"bold\" id=\"svg_star_sym\" text-anchor=\"middle\" x=\"248.0\" y=\"394.0\">Y</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"38\" font-weight=\"bold\" id=\"svg_sd_slash\" text-anchor=\"middle\" x=\"290.0\" y=\"392.0\">/</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"44\" font-weight=\"bold\" id=\"svg_delta_sym\" text-anchor=\"middle\" x=\"332.0\" y=\"394.0\">\u0394</text>\n </g>"}, "proximity_sensor_npn_nc(2).svg": {"vb": "0 0 580.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <rect fill=\"none\" height=\"360.0\" id=\"svg_box\" stroke=\"#666666\" stroke-width=\"10\" width=\"260.0\" x=\"40.0\" y=\"56.25\"/>\n  <path d=\"M 506.18,102.00 L 513.82,102.00 L 520.43,105.82 L 524.25,112.43 L 524.25,120.07 L 520.43,126.68 L 513.82,130.50 L 506.18,130.50 L 499.57,126.68 L 495.75,120.07 L 495.75,112.43 L 499.57,105.82 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 506.18,222.00 L 513.82,222.00 L 520.43,225.82 L 524.25,232.43 L 524.25,240.07 L 520.43,246.68 L 513.82,250.50 L 506.18,250.50 L 499.57,246.68 L 495.75,240.07 L 495.75,232.43 L 499.57,225.82 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 506.18,342.00 L 513.82,342.00 L 520.43,345.82 L 524.25,352.43 L 524.25,360.07 L 520.43,366.68 L 513.82,370.50 L 506.18,370.50 L 499.57,366.68 L 495.75,360.07 L 495.75,352.43 L 499.57,345.82 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <g fill=\"none\" id=\"svg_optics\" stroke=\"#666666\" stroke-width=\"8\">\n   <polygon id=\"svg_4\" points=\"170.0,84.0 214.0,128.0 170.0,172.0 126.0,128.0\" stroke-width=\"8\"/>\n   <line id=\"svg_5\" stroke-width=\"7\" x1=\"156.0\" x2=\"156.0\" y1=\"100.0\" y2=\"156.0\"/>\n   <line id=\"svg_6\" stroke-width=\"7\" x1=\"184.0\" x2=\"184.0\" y1=\"100.0\" y2=\"156.0\"/>\n  </g>\n  <line fill=\"none\" id=\"svg_wire_bn\" stroke=\"#666666\" stroke-width=\"10\" x1=\"300.0\" x2=\"500.0\" y1=\"116.25\" y2=\"116.25\"/>\n  <line fill=\"none\" id=\"svg_wire_bk\" stroke=\"#666666\" stroke-width=\"10\" x1=\"300.0\" x2=\"500.0\" y1=\"236.25\" y2=\"236.25\"/>\n  <line fill=\"none\" id=\"svg_wire_bu\" stroke=\"#666666\" stroke-width=\"10\" x1=\"300.0\" x2=\"500.0\" y1=\"356.25\" y2=\"356.25\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_14\" text-anchor=\"middle\" x=\"400\" y=\"100.25\">BN</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_15\" text-anchor=\"middle\" x=\"400\" y=\"220.25\">BK</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_16\" text-anchor=\"middle\" x=\"400\" y=\"340.25\">BU</text>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"9\" x1=\"75\" x2=\"135\" y1=\"250\" y2=\"250\"/>\n  <line fill=\"none\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"9\" x1=\"205\" x2=\"265\" y1=\"250\" y2=\"250\"/>\n  <line fill=\"none\" id=\"svg_17\" stroke=\"#666666\" stroke-width=\"9\" x1=\"205\" x2=\"205\" y1=\"250\" y2=\"212\"/>\n  <line fill=\"none\" id=\"svg_12\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"135\" x2=\"214\" y1=\"250\" y2=\"216\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"36\" font-weight=\"bold\" id=\"svg_13\" text-anchor=\"middle\" x=\"170\" y=\"382\">NPN NC</text>\n </g>"}, "proximity_sensor_npn_nc.svg": {"vb": "0 0 580.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <rect fill=\"none\" height=\"360.0\" id=\"svg_box\" stroke=\"#666666\" stroke-width=\"10\" width=\"260.0\" x=\"40.0\" y=\"56.25\"/>\n  <path d=\"M 506.18,102.00 L 513.82,102.00 L 520.43,105.82 L 524.25,112.43 L 524.25,120.07 L 520.43,126.68 L 513.82,130.50 L 506.18,130.50 L 499.57,126.68 L 495.75,120.07 L 495.75,112.43 L 499.57,105.82 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 506.18,222.00 L 513.82,222.00 L 520.43,225.82 L 524.25,232.43 L 524.25,240.07 L 520.43,246.68 L 513.82,250.50 L 506.18,250.50 L 499.57,246.68 L 495.75,240.07 L 495.75,232.43 L 499.57,225.82 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 506.18,342.00 L 513.82,342.00 L 520.43,345.82 L 524.25,352.43 L 524.25,360.07 L 520.43,366.68 L 513.82,370.50 L 506.18,370.50 L 499.57,366.68 L 495.75,360.07 L 495.75,352.43 L 499.57,345.82 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <g fill=\"none\" id=\"svg_optics\" stroke=\"#666666\" stroke-width=\"8\">\n   <polygon id=\"svg_4\" points=\"170.0,84.0 214.0,128.0 170.0,172.0 126.0,128.0\" stroke-width=\"8\"/>\n   <line id=\"svg_5\" stroke-width=\"7\" x1=\"156.0\" x2=\"156.0\" y1=\"100.0\" y2=\"156.0\"/>\n   <line id=\"svg_6\" stroke-width=\"7\" x1=\"184.0\" x2=\"184.0\" y1=\"100.0\" y2=\"156.0\"/>\n  </g>\n  <line fill=\"none\" id=\"svg_wire_bn\" stroke=\"#666666\" stroke-width=\"10\" x1=\"300.0\" x2=\"500.0\" y1=\"116.25\" y2=\"116.25\"/>\n  <line fill=\"none\" id=\"svg_wire_bk\" stroke=\"#666666\" stroke-width=\"10\" x1=\"300.0\" x2=\"500.0\" y1=\"236.25\" y2=\"236.25\"/>\n  <line fill=\"none\" id=\"svg_wire_bu\" stroke=\"#666666\" stroke-width=\"10\" x1=\"300.0\" x2=\"500.0\" y1=\"356.25\" y2=\"356.25\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_14\" text-anchor=\"middle\" x=\"400\" y=\"100.25\">BN</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_15\" text-anchor=\"middle\" x=\"400\" y=\"220.25\">BK</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_16\" text-anchor=\"middle\" x=\"400\" y=\"340.25\">BU</text>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"9\" x1=\"75\" x2=\"135\" y1=\"250\" y2=\"250\"/>\n  <line fill=\"none\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"9\" x1=\"205\" x2=\"265\" y1=\"250\" y2=\"250\"/>\n  <line fill=\"none\" id=\"svg_17\" stroke=\"#666666\" stroke-width=\"9\" x1=\"205\" x2=\"205\" y1=\"250\" y2=\"212\"/>\n  <line fill=\"none\" id=\"svg_12\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"135\" x2=\"214\" y1=\"250\" y2=\"216\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"36\" font-weight=\"bold\" id=\"svg_13\" text-anchor=\"middle\" x=\"170\" y=\"382\">NPN NC</text>\n </g>"}, "proximity_sensor_npn_no(2).svg": {"vb": "0 0 580.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <rect fill=\"none\" height=\"360.0\" id=\"svg_box\" stroke=\"#666666\" stroke-width=\"10\" width=\"260.0\" x=\"40.0\" y=\"56.25\"/>\n  <path d=\"M 506.18,102.00 L 513.82,102.00 L 520.43,105.82 L 524.25,112.43 L 524.25,120.07 L 520.43,126.68 L 513.82,130.50 L 506.18,130.50 L 499.57,126.68 L 495.75,120.07 L 495.75,112.43 L 499.57,105.82 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 506.18,222.00 L 513.82,222.00 L 520.43,225.82 L 524.25,232.43 L 524.25,240.07 L 520.43,246.68 L 513.82,250.50 L 506.18,250.50 L 499.57,246.68 L 495.75,240.07 L 495.75,232.43 L 499.57,225.82 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 506.18,342.00 L 513.82,342.00 L 520.43,345.82 L 524.25,352.43 L 524.25,360.07 L 520.43,366.68 L 513.82,370.50 L 506.18,370.50 L 499.57,366.68 L 495.75,360.07 L 495.75,352.43 L 499.57,345.82 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <g fill=\"none\" id=\"svg_optics\" stroke=\"#666666\" stroke-width=\"8\">\n   <polygon id=\"svg_4\" points=\"170.0,84.0 214.0,128.0 170.0,172.0 126.0,128.0\" stroke-width=\"8\"/>\n   <line id=\"svg_5\" stroke-width=\"7\" x1=\"156.0\" x2=\"156.0\" y1=\"100.0\" y2=\"156.0\"/>\n   <line id=\"svg_6\" stroke-width=\"7\" x1=\"184.0\" x2=\"184.0\" y1=\"100.0\" y2=\"156.0\"/>\n  </g>\n  <line fill=\"none\" id=\"svg_wire_bn\" stroke=\"#666666\" stroke-width=\"10\" x1=\"300.0\" x2=\"500.0\" y1=\"116.25\" y2=\"116.25\"/>\n  <line fill=\"none\" id=\"svg_wire_bk\" stroke=\"#666666\" stroke-width=\"10\" x1=\"300.0\" x2=\"500.0\" y1=\"236.25\" y2=\"236.25\"/>\n  <line fill=\"none\" id=\"svg_wire_bu\" stroke=\"#666666\" stroke-width=\"10\" x1=\"300.0\" x2=\"500.0\" y1=\"356.25\" y2=\"356.25\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_14\" text-anchor=\"middle\" x=\"400\" y=\"100.25\">BN</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_15\" text-anchor=\"middle\" x=\"400\" y=\"220.25\">BK</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_16\" text-anchor=\"middle\" x=\"400\" y=\"340.25\">BU</text>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"9\" x1=\"75\" x2=\"135\" y1=\"250\" y2=\"250\"/>\n  <line fill=\"none\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"9\" x1=\"205\" x2=\"265\" y1=\"250\" y2=\"250\"/>\n  <line fill=\"none\" id=\"svg_12\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"135\" x2=\"205\" y1=\"250\" y2=\"208\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"36\" font-weight=\"bold\" id=\"svg_13\" text-anchor=\"middle\" x=\"170\" y=\"382\">NPN NO</text>\n </g>"}, "proximity_sensor_npn_no.svg": {"vb": "0 0 580.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <rect fill=\"none\" height=\"360.0\" id=\"svg_box\" stroke=\"#666666\" stroke-width=\"10\" width=\"260.0\" x=\"40.0\" y=\"56.25\"/>\n  <path d=\"M 506.18,102.00 L 513.82,102.00 L 520.43,105.82 L 524.25,112.43 L 524.25,120.07 L 520.43,126.68 L 513.82,130.50 L 506.18,130.50 L 499.57,126.68 L 495.75,120.07 L 495.75,112.43 L 499.57,105.82 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 506.18,222.00 L 513.82,222.00 L 520.43,225.82 L 524.25,232.43 L 524.25,240.07 L 520.43,246.68 L 513.82,250.50 L 506.18,250.50 L 499.57,246.68 L 495.75,240.07 L 495.75,232.43 L 499.57,225.82 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 506.18,342.00 L 513.82,342.00 L 520.43,345.82 L 524.25,352.43 L 524.25,360.07 L 520.43,366.68 L 513.82,370.50 L 506.18,370.50 L 499.57,366.68 L 495.75,360.07 L 495.75,352.43 L 499.57,345.82 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <g fill=\"none\" id=\"svg_optics\" stroke=\"#666666\" stroke-width=\"8\">\n   <polygon id=\"svg_4\" points=\"170.0,84.0 214.0,128.0 170.0,172.0 126.0,128.0\" stroke-width=\"8\"/>\n   <line id=\"svg_5\" stroke-width=\"7\" x1=\"156.0\" x2=\"156.0\" y1=\"100.0\" y2=\"156.0\"/>\n   <line id=\"svg_6\" stroke-width=\"7\" x1=\"184.0\" x2=\"184.0\" y1=\"100.0\" y2=\"156.0\"/>\n  </g>\n  <line fill=\"none\" id=\"svg_wire_bn\" stroke=\"#666666\" stroke-width=\"10\" x1=\"300.0\" x2=\"500.0\" y1=\"116.25\" y2=\"116.25\"/>\n  <line fill=\"none\" id=\"svg_wire_bk\" stroke=\"#666666\" stroke-width=\"10\" x1=\"300.0\" x2=\"500.0\" y1=\"236.25\" y2=\"236.25\"/>\n  <line fill=\"none\" id=\"svg_wire_bu\" stroke=\"#666666\" stroke-width=\"10\" x1=\"300.0\" x2=\"500.0\" y1=\"356.25\" y2=\"356.25\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_14\" text-anchor=\"middle\" x=\"400\" y=\"100.25\">BN</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_15\" text-anchor=\"middle\" x=\"400\" y=\"220.25\">BK</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_16\" text-anchor=\"middle\" x=\"400\" y=\"340.25\">BU</text>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"9\" x1=\"75\" x2=\"135\" y1=\"250\" y2=\"250\"/>\n  <line fill=\"none\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"9\" x1=\"205\" x2=\"265\" y1=\"250\" y2=\"250\"/>\n  <line fill=\"none\" id=\"svg_12\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"135\" x2=\"205\" y1=\"250\" y2=\"208\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"36\" font-weight=\"bold\" id=\"svg_13\" text-anchor=\"middle\" x=\"170\" y=\"382\">NPN NO</text>\n </g>"}, "coil_contactor(1).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"192.5\"/>\n  <rect fill=\"none\" height=\"87.5\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\" width=\"180.0\" x=\"127.5\" y=\"192.5\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"280.0\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "coil_tof_timer(1).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"192.5\"/>\n  <rect fill=\"none\" height=\"87.5\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\" width=\"185.0\" x=\"100.0\" y=\"192.5\"/>\n  <rect fill=\"#666666\" height=\"87.5\" id=\"svg_4\" stroke=\"none\" width=\"55.0\" x=\"100.0\" y=\"192.5\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"10\" x1=\"155.0\" x2=\"155.0\" y1=\"192.5\" y2=\"280.0\"/>\n  <line fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"280.0\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "coil_ton_timer(1).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"192.5\"/>\n  <rect fill=\"none\" height=\"87.5\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\" width=\"185.0\" x=\"100.0\" y=\"192.5\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"9\" x1=\"155.0\" x2=\"155.0\" y1=\"192.5\" y2=\"280.0\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"8\" x1=\"100.0\" x2=\"155.0\" y1=\"192.5\" y2=\"280.0\"/>\n  <line fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"8\" x1=\"155.0\" x2=\"100.0\" y1=\"192.5\" y2=\"280.0\"/>\n  <line fill=\"none\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"280.0\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "coil_ton_tof_timer(1).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"192.5\"/>\n  <rect fill=\"none\" height=\"87.5\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\" width=\"230.0\" x=\"70.0\" y=\"192.5\"/>\n  <rect fill=\"#666666\" height=\"87.5\" id=\"svg_4\" stroke=\"none\" width=\"46.0\" x=\"70.0\" y=\"192.5\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"9\" x1=\"116.0\" x2=\"116.0\" y1=\"192.5\" y2=\"280.0\"/>\n  <line fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"9\" x1=\"162.0\" x2=\"162.0\" y1=\"192.5\" y2=\"280.0\"/>\n  <line fill=\"none\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"8\" x1=\"116.0\" x2=\"162.0\" y1=\"192.5\" y2=\"280.0\"/>\n  <line fill=\"none\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"8\" x1=\"162.0\" x2=\"116.0\" y1=\"192.5\" y2=\"280.0\"/>\n  <line fill=\"none\" id=\"svg_9\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"280.0\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "load_light(1).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"168.25\"/>\n  <circle cx=\"217.5\" cy=\"236.25\" fill=\"none\" id=\"svg_3\" r=\"68.0\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"9\" x1=\"169.42000000000002\" x2=\"265.58\" y1=\"188.17000000000002\" y2=\"284.33\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"9\" x1=\"265.58\" x2=\"169.42000000000002\" y1=\"188.17000000000002\" y2=\"284.33\"/>\n  <line fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.25\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "load_pilot_light.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"168.25\"/>\n  <circle cx=\"217.5\" cy=\"236.25\" fill=\"none\" id=\"svg_3\" r=\"68.0\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"9\" x1=\"169.42000000000002\" x2=\"265.58\" y1=\"188.17000000000002\" y2=\"284.33\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"9\" x1=\"265.58\" x2=\"169.42000000000002\" y1=\"188.17000000000002\" y2=\"284.33\"/>\n  <line fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.25\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "load_blinking_pilot_lamp(1).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"168.25\"/>\n  <circle cx=\"217.5\" cy=\"236.25\" fill=\"none\" id=\"svg_3\" r=\"68.0\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"9\" x1=\"169.42000000000002\" x2=\"265.58\" y1=\"188.17000000000002\" y2=\"284.33\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"9\" x1=\"265.58\" x2=\"169.42000000000002\" y1=\"188.17000000000002\" y2=\"284.33\"/>\n  <path d=\"M 303.5,248.25 L 315.5,248.25 L 315.5,222.25 L 339.5,222.25 L 339.5,248.25 L 351.5,248.25\" fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"7.5\"/>\n  <line fill=\"none\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.25\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "load_beacon(1).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"168.25\"/>\n  <circle cx=\"217.5\" cy=\"236.25\" fill=\"none\" id=\"svg_3\" r=\"68.0\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"9\" x1=\"169.42000000000002\" x2=\"265.58\" y1=\"188.17000000000002\" y2=\"284.33\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"9\" x1=\"265.58\" x2=\"169.42000000000002\" y1=\"188.17000000000002\" y2=\"284.33\"/>\n  <path d=\"M 303.5,202.25 A 42,42 0 0 1 303.5,270.25\" fill=\"none\" id=\"svg_6\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\"/>\n  <polygon fill=\"#666666\" id=\"svg_9\" points=\"299.5,274.25 317.5,264.25 305.5,254.25\"/>\n  <line fill=\"none\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.25\" y2=\"396.5\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_8\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "load_bell(1).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 217.5,76.0 L 217.5,196 L 251.5,196\" fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 251.5,172 L 251.5,300 A 64,64 0 0 0 251.5,172 Z\" fill=\"none\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 251.5,276 L 217.5,276 L 217.5,396.5\" fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "load_buzzer(1).svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 217.5,76.0 L 217.5,196 L 257.5,196\" fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 311.5,172 L 311.5,300 A 64,64 0 0 1 311.5,172 Z\" fill=\"none\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 257.5,276 L 217.5,276 L 217.5,396.5\" fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"0\"/>\n </g>"}, "ac_to_dc_power_supply.svg": {"vb": "0 0 540.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 131.18,53.75 L 138.82,53.75 L 145.43,57.57 L 149.25,64.18 L 149.25,71.82 L 145.43,78.43 L 138.82,82.25 L 131.18,82.25 L 124.57,78.43 L 120.75,71.82 L 120.75,64.18 L 124.57,57.57 Z\" fill=\"#666666\" id=\"svg_term_l\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 311.18,53.75 L 318.82,53.75 L 325.43,57.57 L 329.25,64.18 L 329.25,71.82 L 325.43,78.43 L 318.82,82.25 L 311.18,82.25 L 304.57,78.43 L 300.75,71.82 L 300.75,64.18 L 304.57,57.57 Z\" fill=\"#666666\" id=\"svg_term_n\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 431.18,222.00 L 438.82,222.00 L 445.43,225.82 L 449.25,232.43 L 449.25,240.07 L 445.43,246.68 L 438.82,250.50 L 431.18,250.50 L 424.57,246.68 L 420.75,240.07 L 420.75,232.43 L 424.57,225.82 Z\" fill=\"#666666\" id=\"svg_term_pe\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 131.18,390.25 L 138.82,390.25 L 145.43,394.07 L 149.25,400.68 L 149.25,408.32 L 145.43,414.93 L 138.82,418.75 L 131.18,418.75 L 124.57,414.93 L 120.75,408.32 L 120.75,400.68 L 124.57,394.07 Z\" fill=\"#666666\" id=\"svg_term_pos\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 311.18,390.25 L 318.82,390.25 L 325.43,394.07 L 329.25,400.68 L 329.25,408.32 L 325.43,414.93 L 318.82,418.75 L 311.18,418.75 L 304.57,414.93 L 300.75,408.32 L 300.75,400.68 L 304.57,394.07 Z\" fill=\"#666666\" id=\"svg_term_neg\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"135.0\" x2=\"135.0\" y1=\"76.0\" y2=\"126.25\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"315.0\" x2=\"315.0\" y1=\"76.0\" y2=\"126.25\"/>\n  <line fill=\"none\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"365.0\" x2=\"425.0\" y1=\"236.25\" y2=\"236.25\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"10\" x1=\"135.0\" x2=\"135.0\" y1=\"346.25\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"10\" x1=\"315.0\" x2=\"315.0\" y1=\"346.25\" y2=\"396.5\"/>\n  <rect fill=\"none\" height=\"220.0\" id=\"svg_6\" stroke=\"#666666\" stroke-linejoin=\"round\" stroke-width=\"10\" width=\"280.0\" x=\"85.0\" y=\"126.25\"/>\n  <line fill=\"none\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"9\" x1=\"85.0\" x2=\"365.0\" y1=\"346.25\" y2=\"126.25\"/>\n  <path d=\"M 110.0,220.0 Q 132.5,182.0 155.0,220.0 T 200.0,220.0\" fill=\"none\" id=\"svg_8\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\"/>\n  <line fill=\"none\" id=\"svg_9\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"238.0\" x2=\"312.0\" y1=\"286.0\" y2=\"286.0\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-dasharray=\"14,10\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"238.0\" x2=\"312.0\" y1=\"302.0\" y2=\"302.0\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"30\" font-weight=\"bold\" id=\"svg_11\" text-anchor=\"middle\" x=\"135.0\" y=\"160.0\">L</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"30\" font-weight=\"bold\" id=\"svg_12\" text-anchor=\"middle\" x=\"315.0\" y=\"160.0\">N</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"28\" font-weight=\"bold\" id=\"svg_13\" text-anchor=\"middle\" x=\"330.0\" y=\"246.0\">PE</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_14\" text-anchor=\"middle\" x=\"135.0\" y=\"334.0\">+</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"36\" font-weight=\"bold\" id=\"svg_15\" text-anchor=\"middle\" x=\"315.0\" y=\"334.0\">-</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"26\" font-weight=\"bold\" id=\"svg_16\" text-anchor=\"middle\" x=\"275.0\" y=\"272.0\">24V DC</text>\n </g>"}, "ac to dc power supply.svg": {"vb": "0 0 540.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 131.18,53.75 L 138.82,53.75 L 145.43,57.57 L 149.25,64.18 L 149.25,71.82 L 145.43,78.43 L 138.82,82.25 L 131.18,82.25 L 124.57,78.43 L 120.75,71.82 L 120.75,64.18 L 124.57,57.57 Z\" fill=\"#666666\" id=\"svg_term_l\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 311.18,53.75 L 318.82,53.75 L 325.43,57.57 L 329.25,64.18 L 329.25,71.82 L 325.43,78.43 L 318.82,82.25 L 311.18,82.25 L 304.57,78.43 L 300.75,71.82 L 300.75,64.18 L 304.57,57.57 Z\" fill=\"#666666\" id=\"svg_term_n\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 431.18,222.00 L 438.82,222.00 L 445.43,225.82 L 449.25,232.43 L 449.25,240.07 L 445.43,246.68 L 438.82,250.50 L 431.18,250.50 L 424.57,246.68 L 420.75,240.07 L 420.75,232.43 L 424.57,225.82 Z\" fill=\"#666666\" id=\"svg_term_pe\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 131.18,390.25 L 138.82,390.25 L 145.43,394.07 L 149.25,400.68 L 149.25,408.32 L 145.43,414.93 L 138.82,418.75 L 131.18,418.75 L 124.57,414.93 L 120.75,408.32 L 120.75,400.68 L 124.57,394.07 Z\" fill=\"#666666\" id=\"svg_term_pos\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 311.18,390.25 L 318.82,390.25 L 325.43,394.07 L 329.25,400.68 L 329.25,408.32 L 325.43,414.93 L 318.82,418.75 L 311.18,418.75 L 304.57,414.93 L 300.75,408.32 L 300.75,400.68 L 304.57,394.07 Z\" fill=\"#666666\" id=\"svg_term_neg\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"10\" x1=\"135.0\" x2=\"135.0\" y1=\"76.0\" y2=\"126.25\"/>\n  <line fill=\"none\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"10\" x1=\"315.0\" x2=\"315.0\" y1=\"76.0\" y2=\"126.25\"/>\n  <line fill=\"none\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"10\" x1=\"365.0\" x2=\"425.0\" y1=\"236.25\" y2=\"236.25\"/>\n  <line fill=\"none\" id=\"svg_4\" stroke=\"#666666\" stroke-width=\"10\" x1=\"135.0\" x2=\"135.0\" y1=\"346.25\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_5\" stroke=\"#666666\" stroke-width=\"10\" x1=\"315.0\" x2=\"315.0\" y1=\"346.25\" y2=\"396.5\"/>\n  <rect fill=\"none\" height=\"220.0\" id=\"svg_6\" stroke=\"#666666\" stroke-linejoin=\"round\" stroke-width=\"10\" width=\"280.0\" x=\"85.0\" y=\"126.25\"/>\n  <line fill=\"none\" id=\"svg_7\" stroke=\"#666666\" stroke-width=\"9\" x1=\"85.0\" x2=\"365.0\" y1=\"346.25\" y2=\"126.25\"/>\n  <path d=\"M 110.0,220.0 Q 132.5,182.0 155.0,220.0 T 200.0,220.0\" fill=\"none\" id=\"svg_8\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\"/>\n  <line fill=\"none\" id=\"svg_9\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"238.0\" x2=\"312.0\" y1=\"286.0\" y2=\"286.0\"/>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-dasharray=\"14,10\" stroke-linecap=\"round\" stroke-width=\"8\" x1=\"238.0\" x2=\"312.0\" y1=\"302.0\" y2=\"302.0\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"30\" font-weight=\"bold\" id=\"svg_11\" text-anchor=\"middle\" x=\"135.0\" y=\"160.0\">L</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"30\" font-weight=\"bold\" id=\"svg_12\" text-anchor=\"middle\" x=\"315.0\" y=\"160.0\">N</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"28\" font-weight=\"bold\" id=\"svg_13\" text-anchor=\"middle\" x=\"330.0\" y=\"246.0\">PE</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_14\" text-anchor=\"middle\" x=\"135.0\" y=\"334.0\">+</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"36\" font-weight=\"bold\" id=\"svg_15\" text-anchor=\"middle\" x=\"315.0\" y=\"334.0\">-</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"26\" font-weight=\"bold\" id=\"svg_16\" text-anchor=\"middle\" x=\"275.0\" y=\"272.0\">24V DC</text>\n </g>"}, "proximity_sensor_pnp_nc(2).svg": {"vb": "0 0 580.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <rect fill=\"none\" height=\"360.0\" id=\"svg_box\" stroke=\"#666666\" stroke-width=\"10\" width=\"260.0\" x=\"40.0\" y=\"56.25\"/>\n  <path d=\"M 506.18,102.00 L 513.82,102.00 L 520.43,105.82 L 524.25,112.43 L 524.25,120.07 L 520.43,126.68 L 513.82,130.50 L 506.18,130.50 L 499.57,126.68 L 495.75,120.07 L 495.75,112.43 L 499.57,105.82 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 506.18,222.00 L 513.82,222.00 L 520.43,225.82 L 524.25,232.43 L 524.25,240.07 L 520.43,246.68 L 513.82,250.50 L 506.18,250.50 L 499.57,246.68 L 495.75,240.07 L 495.75,232.43 L 499.57,225.82 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 506.18,342.00 L 513.82,342.00 L 520.43,345.82 L 524.25,352.43 L 524.25,360.07 L 520.43,366.68 L 513.82,370.50 L 506.18,370.50 L 499.57,366.68 L 495.75,360.07 L 495.75,352.43 L 499.57,345.82 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <g fill=\"none\" id=\"svg_optics\" stroke=\"#666666\" stroke-width=\"8\">\n   <polygon id=\"svg_4\" points=\"170.0,84.0 214.0,128.0 170.0,172.0 126.0,128.0\" stroke-width=\"8\"/>\n   <line id=\"svg_5\" stroke-width=\"7\" x1=\"156.0\" x2=\"156.0\" y1=\"100.0\" y2=\"156.0\"/>\n   <line id=\"svg_6\" stroke-width=\"7\" x1=\"184.0\" x2=\"184.0\" y1=\"100.0\" y2=\"156.0\"/>\n  </g>\n  <line fill=\"none\" id=\"svg_wire_bn\" stroke=\"#666666\" stroke-width=\"10\" x1=\"300.0\" x2=\"500.0\" y1=\"116.25\" y2=\"116.25\"/>\n  <line fill=\"none\" id=\"svg_wire_bk\" stroke=\"#666666\" stroke-width=\"10\" x1=\"300.0\" x2=\"500.0\" y1=\"236.25\" y2=\"236.25\"/>\n  <line fill=\"none\" id=\"svg_wire_bu\" stroke=\"#666666\" stroke-width=\"10\" x1=\"300.0\" x2=\"500.0\" y1=\"356.25\" y2=\"356.25\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_14\" text-anchor=\"middle\" x=\"400\" y=\"100.25\">BN</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_15\" text-anchor=\"middle\" x=\"400\" y=\"220.25\">BK</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_16\" text-anchor=\"middle\" x=\"400\" y=\"340.25\">BU</text>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"9\" x1=\"75\" x2=\"135\" y1=\"250\" y2=\"250\"/>\n  <line fill=\"none\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"9\" x1=\"205\" x2=\"265\" y1=\"250\" y2=\"250\"/>\n  <line fill=\"none\" id=\"svg_17\" stroke=\"#666666\" stroke-width=\"9\" x1=\"205\" x2=\"205\" y1=\"250\" y2=\"212\"/>\n  <line fill=\"none\" id=\"svg_12\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"135\" x2=\"214\" y1=\"250\" y2=\"216\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"36\" font-weight=\"bold\" id=\"svg_13\" text-anchor=\"middle\" x=\"170\" y=\"382\">PNP NC</text>\n </g>"}, "proximity_sensor_pnp_nc.svg": {"vb": "0 0 580.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <rect fill=\"none\" height=\"360.0\" id=\"svg_box\" stroke=\"#666666\" stroke-width=\"10\" width=\"260.0\" x=\"40.0\" y=\"56.25\"/>\n  <path d=\"M 506.18,102.00 L 513.82,102.00 L 520.43,105.82 L 524.25,112.43 L 524.25,120.07 L 520.43,126.68 L 513.82,130.50 L 506.18,130.50 L 499.57,126.68 L 495.75,120.07 L 495.75,112.43 L 499.57,105.82 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 506.18,222.00 L 513.82,222.00 L 520.43,225.82 L 524.25,232.43 L 524.25,240.07 L 520.43,246.68 L 513.82,250.50 L 506.18,250.50 L 499.57,246.68 L 495.75,240.07 L 495.75,232.43 L 499.57,225.82 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 506.18,342.00 L 513.82,342.00 L 520.43,345.82 L 524.25,352.43 L 524.25,360.07 L 520.43,366.68 L 513.82,370.50 L 506.18,370.50 L 499.57,366.68 L 495.75,360.07 L 495.75,352.43 L 499.57,345.82 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <g fill=\"none\" id=\"svg_optics\" stroke=\"#666666\" stroke-width=\"8\">\n   <polygon id=\"svg_4\" points=\"170.0,84.0 214.0,128.0 170.0,172.0 126.0,128.0\" stroke-width=\"8\"/>\n   <line id=\"svg_5\" stroke-width=\"7\" x1=\"156.0\" x2=\"156.0\" y1=\"100.0\" y2=\"156.0\"/>\n   <line id=\"svg_6\" stroke-width=\"7\" x1=\"184.0\" x2=\"184.0\" y1=\"100.0\" y2=\"156.0\"/>\n  </g>\n  <line fill=\"none\" id=\"svg_wire_bn\" stroke=\"#666666\" stroke-width=\"10\" x1=\"300.0\" x2=\"500.0\" y1=\"116.25\" y2=\"116.25\"/>\n  <line fill=\"none\" id=\"svg_wire_bk\" stroke=\"#666666\" stroke-width=\"10\" x1=\"300.0\" x2=\"500.0\" y1=\"236.25\" y2=\"236.25\"/>\n  <line fill=\"none\" id=\"svg_wire_bu\" stroke=\"#666666\" stroke-width=\"10\" x1=\"300.0\" x2=\"500.0\" y1=\"356.25\" y2=\"356.25\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_14\" text-anchor=\"middle\" x=\"400\" y=\"100.25\">BN</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_15\" text-anchor=\"middle\" x=\"400\" y=\"220.25\">BK</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_16\" text-anchor=\"middle\" x=\"400\" y=\"340.25\">BU</text>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"9\" x1=\"75\" x2=\"135\" y1=\"250\" y2=\"250\"/>\n  <line fill=\"none\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"9\" x1=\"205\" x2=\"265\" y1=\"250\" y2=\"250\"/>\n  <line fill=\"none\" id=\"svg_17\" stroke=\"#666666\" stroke-width=\"9\" x1=\"205\" x2=\"205\" y1=\"250\" y2=\"212\"/>\n  <line fill=\"none\" id=\"svg_12\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"135\" x2=\"214\" y1=\"250\" y2=\"216\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"36\" font-weight=\"bold\" id=\"svg_13\" text-anchor=\"middle\" x=\"170\" y=\"382\">PNP NC</text>\n </g>"}, "proximity_sensor_pnp_no(2).svg": {"vb": "0 0 580.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <rect fill=\"none\" height=\"360.0\" id=\"svg_box\" stroke=\"#666666\" stroke-width=\"10\" width=\"260.0\" x=\"40.0\" y=\"56.25\"/>\n  <path d=\"M 506.18,102.00 L 513.82,102.00 L 520.43,105.82 L 524.25,112.43 L 524.25,120.07 L 520.43,126.68 L 513.82,130.50 L 506.18,130.50 L 499.57,126.68 L 495.75,120.07 L 495.75,112.43 L 499.57,105.82 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 506.18,222.00 L 513.82,222.00 L 520.43,225.82 L 524.25,232.43 L 524.25,240.07 L 520.43,246.68 L 513.82,250.50 L 506.18,250.50 L 499.57,246.68 L 495.75,240.07 L 495.75,232.43 L 499.57,225.82 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 506.18,342.00 L 513.82,342.00 L 520.43,345.82 L 524.25,352.43 L 524.25,360.07 L 520.43,366.68 L 513.82,370.50 L 506.18,370.50 L 499.57,366.68 L 495.75,360.07 L 495.75,352.43 L 499.57,345.82 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <g fill=\"none\" id=\"svg_optics\" stroke=\"#666666\" stroke-width=\"8\">\n   <polygon id=\"svg_4\" points=\"170.0,84.0 214.0,128.0 170.0,172.0 126.0,128.0\" stroke-width=\"8\"/>\n   <line id=\"svg_5\" stroke-width=\"7\" x1=\"156.0\" x2=\"156.0\" y1=\"100.0\" y2=\"156.0\"/>\n   <line id=\"svg_6\" stroke-width=\"7\" x1=\"184.0\" x2=\"184.0\" y1=\"100.0\" y2=\"156.0\"/>\n  </g>\n  <line fill=\"none\" id=\"svg_wire_bn\" stroke=\"#666666\" stroke-width=\"10\" x1=\"300.0\" x2=\"500.0\" y1=\"116.25\" y2=\"116.25\"/>\n  <line fill=\"none\" id=\"svg_wire_bk\" stroke=\"#666666\" stroke-width=\"10\" x1=\"300.0\" x2=\"500.0\" y1=\"236.25\" y2=\"236.25\"/>\n  <line fill=\"none\" id=\"svg_wire_bu\" stroke=\"#666666\" stroke-width=\"10\" x1=\"300.0\" x2=\"500.0\" y1=\"356.25\" y2=\"356.25\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_14\" text-anchor=\"middle\" x=\"400\" y=\"100.25\">BN</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_15\" text-anchor=\"middle\" x=\"400\" y=\"220.25\">BK</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_16\" text-anchor=\"middle\" x=\"400\" y=\"340.25\">BU</text>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"9\" x1=\"75\" x2=\"135\" y1=\"250\" y2=\"250\"/>\n  <line fill=\"none\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"9\" x1=\"205\" x2=\"265\" y1=\"250\" y2=\"250\"/>\n  <line fill=\"none\" id=\"svg_12\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"135\" x2=\"205\" y1=\"250\" y2=\"208\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"36\" font-weight=\"bold\" id=\"svg_13\" text-anchor=\"middle\" x=\"170\" y=\"382\">PNP NO</text>\n </g>"}, "proximity_sensor_pnp_no.svg": {"vb": "0 0 580.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <rect fill=\"none\" height=\"360.0\" id=\"svg_box\" stroke=\"#666666\" stroke-width=\"10\" width=\"260.0\" x=\"40.0\" y=\"56.25\"/>\n  <path d=\"M 506.18,102.00 L 513.82,102.00 L 520.43,105.82 L 524.25,112.43 L 524.25,120.07 L 520.43,126.68 L 513.82,130.50 L 506.18,130.50 L 499.57,126.68 L 495.75,120.07 L 495.75,112.43 L 499.57,105.82 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 506.18,222.00 L 513.82,222.00 L 520.43,225.82 L 524.25,232.43 L 524.25,240.07 L 520.43,246.68 L 513.82,250.50 L 506.18,250.50 L 499.57,246.68 L 495.75,240.07 L 495.75,232.43 L 499.57,225.82 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 506.18,342.00 L 513.82,342.00 L 520.43,345.82 L 524.25,352.43 L 524.25,360.07 L 520.43,366.68 L 513.82,370.50 L 506.18,370.50 L 499.57,366.68 L 495.75,360.07 L 495.75,352.43 L 499.57,345.82 Z\" fill=\"#666666\" id=\"svg_3\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <g fill=\"none\" id=\"svg_optics\" stroke=\"#666666\" stroke-width=\"8\">\n   <polygon id=\"svg_4\" points=\"170.0,84.0 214.0,128.0 170.0,172.0 126.0,128.0\" stroke-width=\"8\"/>\n   <line id=\"svg_5\" stroke-width=\"7\" x1=\"156.0\" x2=\"156.0\" y1=\"100.0\" y2=\"156.0\"/>\n   <line id=\"svg_6\" stroke-width=\"7\" x1=\"184.0\" x2=\"184.0\" y1=\"100.0\" y2=\"156.0\"/>\n  </g>\n  <line fill=\"none\" id=\"svg_wire_bn\" stroke=\"#666666\" stroke-width=\"10\" x1=\"300.0\" x2=\"500.0\" y1=\"116.25\" y2=\"116.25\"/>\n  <line fill=\"none\" id=\"svg_wire_bk\" stroke=\"#666666\" stroke-width=\"10\" x1=\"300.0\" x2=\"500.0\" y1=\"236.25\" y2=\"236.25\"/>\n  <line fill=\"none\" id=\"svg_wire_bu\" stroke=\"#666666\" stroke-width=\"10\" x1=\"300.0\" x2=\"500.0\" y1=\"356.25\" y2=\"356.25\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_14\" text-anchor=\"middle\" x=\"400\" y=\"100.25\">BN</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_15\" text-anchor=\"middle\" x=\"400\" y=\"220.25\">BK</text>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"34\" font-weight=\"bold\" id=\"svg_16\" text-anchor=\"middle\" x=\"400\" y=\"340.25\">BU</text>\n  <line fill=\"none\" id=\"svg_10\" stroke=\"#666666\" stroke-width=\"9\" x1=\"75\" x2=\"135\" y1=\"250\" y2=\"250\"/>\n  <line fill=\"none\" id=\"svg_11\" stroke=\"#666666\" stroke-width=\"9\" x1=\"205\" x2=\"265\" y1=\"250\" y2=\"250\"/>\n  <line fill=\"none\" id=\"svg_12\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"9\" x1=\"135\" x2=\"205\" y1=\"250\" y2=\"208\"/>\n  <text fill=\"#666666\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"36\" font-weight=\"bold\" id=\"svg_13\" text-anchor=\"middle\" x=\"170\" y=\"382\">PNP NO</text>\n </g>"}, "aux_contacts_thermal_nc.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 217.5,76.0 L 217.5,168.0 L 271.5,168.0\" fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"217.5\" x2=\"263.5\" y1=\"304.0\" y2=\"160.0\"/>\n  <path d=\"M 136.5,266.0 L 136.5,236.0 L 239.2,236.0 M 164.5,236.0 L 164.5,266.0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n </g>"}, "aux_contacts_thermal_no.svg": {"vb": "0 0 435.0 472.5", "inner": "<g class=\"layer\" display=\"inline\">\n  <title>Layer 1</title>\n  <path d=\"M 213.68,53.75 L 221.32,53.75 L 227.93,57.57 L 231.75,64.18 L 231.75,71.82 L 227.93,78.43 L 221.32,82.25 L 213.68,82.25 L 207.07,78.43 L 203.25,71.82 L 203.25,64.18 L 207.07,57.57 Z\" fill=\"#666666\" id=\"svg_1\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <path d=\"M 213.68,390.25 L 221.32,390.25 L 227.93,394.07 L 231.75,400.68 L 231.75,408.32 L 227.93,414.93 L 221.32,418.75 L 213.68,418.75 L 207.07,414.93 L 203.25,408.32 L 203.25,400.68 L 207.07,394.07 Z\" fill=\"#666666\" id=\"svg_2\" stroke=\"#666666\" stroke-width=\"0\"/>\n  <line fill=\"none\" id=\"svg_stem_top\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"76.0\" y2=\"168.0\"/>\n  <line fill=\"none\" id=\"svg_stem_bot\" stroke=\"#666666\" stroke-width=\"10\" x1=\"217.5\" x2=\"217.5\" y1=\"304.0\" y2=\"396.5\"/>\n  <line fill=\"none\" id=\"svg_flapper\" stroke=\"#666666\" stroke-linecap=\"round\" stroke-width=\"10\" x1=\"217.5\" x2=\"171.5\" y1=\"304.0\" y2=\"170.0\"/>\n  <path d=\"M 92.5,266.0 L 92.5,236.0 L 194.2,236.0 M 120.5,236.0 L 120.5,266.0\" fill=\"none\" id=\"svg_actuator\" stroke=\"#666666\" stroke-linecap=\"square\" stroke-width=\"10\"/>\n </g>"}};
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
      const h = vh > 500 ? Math.round((vh * ESC_ART_H / 472.5) * 100) / 100 : ESC_ART_H;
      const w = Math.max(ESC_ART_W, (vw / vh) * h);
      const x = ESC_COMP_CX - w / 2;
      const y = vh > 500 ? Math.round(((ESC_ART_Y + ESC_ART_H / 2) - h / 2) * 100) / 100 : ESC_ART_Y;
      return { x, y, w, h };
    }
  }
  return { x: ESC_ART_X, y: ESC_ART_Y, w: ESC_ART_W, h: ESC_ART_H };
}
window.getComponentViewport = getComponentViewport;

function portDefs(type, includeDcFieldPorts = false) {
  const entry = getSvgCatalogEntry(type);
  if (entry) {
    const [vx0, vy0, vw, vh] = parseViewBoxTuple(entry.vb);
    const vp = getComponentViewport(type);
    const scale = Math.min(vp.w / vw, vp.h / vh);
    const drawW = vw * scale, drawH = vh * scale;
    const originX = vp.x + (vp.w - drawW) / 2;
    const originY = vp.y + (vp.h - drawH) / 2;
    const mapPort = (p, idx) => ({
      index: idx,
      x: Math.round((originX + (p.vx - vx0) * scale) * 100) / 100,
      y: Math.round((originY + (p.vy - vy0) * scale) * 100) / 100,
      lx: Math.round((originX + (p.vx - vx0) * scale) * 100) / 100,
      ly: Math.round((originY + (p.vy - vy0) * scale) * 100) / 100,
      w: 3.8,
      h: 3.8,
      label: p.label,
      side: p.side || 'top',
      tid: p.tid || ''
    });
    const defs = entry.ports.map(mapPort);
    if (includeDcFieldPorts && getAssetBasename(type) === 'motor_dc_motor.svg') {
      // Optional wound-field terminals sit below the motor body; the default DC model remains two-terminal.
      [{ vx: 190, vy: 548, label: 'F1', side: 'bottom', tid: 'sim_field_f1' },
       { vx: 370, vy: 548, label: 'F2', side: 'bottom', tid: 'sim_field_f2' }]
        .forEach(p => defs.push(mapPort(p, defs.length)));
    }
    return defs;
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
  const defs = portDefs(key, g.dataset.motorFieldModel === 'wound');
  let labels = [];
  try { labels = JSON.parse(g.dataset.terminals || 'null') || []; } catch (_) {}
  if (!labels.length) {
    const asset = typeof getAssetBasename === 'function' ? getAssetBasename(key) : String(key).toLowerCase();
    const refClean = String(g.dataset.ref || '').trim().replace(/^-+/, '').toUpperCase();
    const isOverloadRole = g.dataset.contactRole === 'overload' || /^F(?:R)?\d*$/i.test(refClean) || asset.includes('thermal');
    if (isOverloadRole && (asset === 'aux_contacts_nc.svg' || asset === 'aux_contacts_thermal_nc.svg')) {
      labels = ['95', '96'];
    } else if (isOverloadRole && (asset === 'aux_contacts_no.svg' || asset === 'aux_contacts_thermal_no.svg')) {
      labels = ['97', '98'];
    }
  }
  return defs.map((p, i) => ({ ...p, index: i, label: labels[i] || p.label }));
}

function withPreviewPorts(type) {
  const base = icon(type).replace('</svg>', '');
  return base + '</svg>';
}

function nextReference(d) {
  const s = ((d && (d.name || d.type || d.symbolFile)) || 'component').toLowerCase();
  let p = 'X';
  const isLinkedContact = /main.?contact|aux.?contact|auxiliary|thermal.?relay/.test(s);
  if (/on.?delay|off.?delay|timer|\btof\b|\bton\b/.test(s)) p = 'KT';
  else if (/overload|thermal/.test(s)) p = 'F';
  else if (/contactor|main.?contact/.test(s)) p = 'KM';
  else if (/aux.?contact|auxiliary/.test(s)) p = 'KM';
  else if (/\bfuse\b/.test(s) && !/isolator/.test(s)) p = 'F';
  else if (/breaker|mcb|isolator|protection/.test(s)) p = 'Q';
  else if (/motor/.test(s)) p = 'M';
  else if (/coil|relay/.test(s)) p = 'KM';
  else if (/push|button|emergency|selector|switch|limit/.test(s)) p = 'S';
  else if (/pilot|lamp|led|indicator|beacon|bell|buzzer|light/.test(s)) p = 'H';
  else if (/earth|ground|\bpe\b/.test(s)) p = 'PE';
  else if (/terminal|connector|block|source|supply/.test(s)) p = 'X';
  else if (/ac.?to.?dc|power.?supply|converter/.test(s)) p = 'PS';
  else if (/transformer/.test(s)) p = 'T';
  else if (/sensor|proximity/.test(s)) p = 'B';

  const existing = [...dropLayer.querySelectorAll('.dropped-symbol')];
  // Linked contacts (Main Contacts / Aux Contacts) default to matching the most recently placed controlling coil (KM / KT) if one exists
  if (isLinkedContact) {
    const matchingCoil = [...existing].reverse().find(g => {
      const r = String(g.dataset.ref || '').replace(/^-+/, '').toUpperCase();
      return r.startsWith(p);
    });
    if (matchingCoil) return matchingCoil.dataset.ref;
  }
  const usedNums = new Set();
  existing.forEach(g => {
    const r = String(g.dataset.ref || '').trim().replace(/^-+/, '').toUpperCase();
    if (r.startsWith(p)) {
      const num = parseInt(r.slice(p.length), 10);
      if (Number.isInteger(num) && num > 0) usedNums.add(num);
    }
  });
  let n = 1;
  while (usedNums.has(n)) n++;
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
    const r = document.createElementNS(NS, 'polygon');
    r.setAttribute('class', 'mag-port');
    // 12-sided polygon matching .svg-terminal-node with exact flat-to-flat diameter = p.w (3.8 workspace units)
    const rad = (p.w || 3.8) / 2;
    const d1 = Math.round(rad * 0.26795 * 100) / 100;
    const d2 = Math.round(rad * 0.73205 * 100) / 100;
    const d3 = Math.round(rad * 1.00000 * 100) / 100;
    const cx = p.lx, cy = p.ly;
    const pts = [
      [cx - d1, cy - d3], [cx + d1, cy - d3], [cx + d2, cy - d2],
      [cx + d3, cy - d1], [cx + d3, cy + d1], [cx + d2, cy + d2],
      [cx + d1, cy + d3], [cx - d1, cy + d3], [cx - d2, cy + d2],
      [cx - d3, cy + d1], [cx - d3, cy - d1], [cx - d2, cy - d2]
    ].map(([px, py]) => `${Math.round(px * 100) / 100},${Math.round(py * 100) / 100}`).join(' ');
    r.setAttribute('points', pts);
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
  applySharedLabelColourToComponent(g);
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

window.ESC_TERMINAL_SIZE = 3.8;

function snapComponentToTerminalAxes(g, rawX, rawY, snapTol = 6) {
  if (!g || typeof window.absolutePorts !== 'function') {
    return { x: rawX, y: rawY, snappedX: false, snappedY: false };
  }
  const curX = Number(g.dataset.x) || 0;
  const curY = Number(g.dataset.y) || 0;
  const myPorts = window.absolutePorts(g).map(p => ({
    dx: p.x - curX,
    dy: p.y - curY
  }));
  if (!myPorts.length) {
    return { x: rawX, y: rawY, snappedX: false, snappedY: false };
  }

  const otherPorts = [];
  document.querySelectorAll('#dropLayer .dropped-symbol').forEach(other => {
    if (other === g) return;
    window.absolutePorts(other).forEach(op => otherPorts.push(op));
  });
  if (!otherPorts.length) {
    return { x: rawX, y: rawY, snappedX: false, snappedY: false };
  }

  // Evaluate candidate X snap offsets (prioritize offsets that align the most terminals simultaneously, e.g. U1-V1-W1 with L1-L2-L3)
  const xBuckets = new Map();
  myPorts.forEach(mp => {
    const candX = rawX + mp.dx;
    otherPorts.forEach(op => {
      const diff = op.x - candX;
      if (Math.abs(diff) <= snapTol) {
        const key = Math.round(diff * 2) / 2;
        let b = xBuckets.get(key);
        if (!b) {
          b = { diff, count: 0, absDiff: Math.abs(diff) };
          xBuckets.set(key, b);
        }
        b.count += 1;
        if (Math.abs(diff) < b.absDiff) {
          b.diff = diff;
          b.absDiff = Math.abs(diff);
        }
      }
    });
  });

  let bestX = null;
  for (const b of xBuckets.values()) {
    if (
      !bestX ||
      b.count > bestX.count ||
      (b.count === bestX.count && b.absDiff < bestX.absDiff)
    ) {
      bestX = b;
    }
  }

  // Evaluate candidate Y snap offsets
  const yBuckets = new Map();
  myPorts.forEach(mp => {
    const candY = rawY + mp.dy;
    otherPorts.forEach(op => {
      const diff = op.y - candY;
      if (Math.abs(diff) <= snapTol) {
        const key = Math.round(diff * 2) / 2;
        let b = yBuckets.get(key);
        if (!b) {
          b = { diff, count: 0, absDiff: Math.abs(diff) };
          yBuckets.set(key, b);
        }
        b.count += 1;
        if (Math.abs(diff) < b.absDiff) {
          b.diff = diff;
          b.absDiff = Math.abs(diff);
        }
      }
    });
  });

  let bestY = null;
  for (const b of yBuckets.values()) {
    if (
      !bestY ||
      b.count > bestY.count ||
      (b.count === bestY.count && b.absDiff < bestY.absDiff)
    ) {
      bestY = b;
    }
  }

  const finalX = bestX ? Math.round((rawX + bestX.diff) * 100) / 100 : rawX;
  const finalY = bestY ? Math.round((rawY + bestY.diff) * 100) / 100 : rawY;
  return {
    x: finalX,
    y: finalY,
    snappedX: Boolean(bestX),
    snappedY: Boolean(bestY)
  };
}
window.snapComponentToTerminalAxes = snapComponentToTerminalAxes;


function layoutComponentAnnotations(g) {
  if (!g) return;
  const box = g.querySelector(':scope > .select-box');
  const boxX = Number(box?.getAttribute('x'));
  // The artwork has an internal margin inside its viewBox; move the tag into
  // that margin so it sits close to the visible symbol instead of the box edge.
  const tagX = Math.round((Number.isFinite(boxX) ? boxX + 14 : ESC_COMP_CX - 24) * 100) / 100;
  const tag = g.querySelector(':scope > .drop-tag');
  if (tag) {
    const identity = `${g.dataset.symbolFile || ''} ${g.dataset.porttype || ''} ${g.dataset.type || ''} ${g.dataset.name || ''}`.toLowerCase();
    const isEarthSymbol = /earth|ground|protective.?earth/.test(identity) || /^pe\d*$/i.test(g.dataset.ref || '');
    if (isEarthSymbol) {
      tag.classList.add('annotation-suppressed');
      tag.dataset.annotationSuppressed = 'earth';
    } else if (tag.dataset.annotationSuppressed === 'earth') {
      tag.classList.remove('annotation-suppressed');
      delete tag.dataset.annotationSuppressed;
    }
    // Keep the reference tag horizontal and just outside the component artwork.
    tag.setAttribute('x', String(tagX));
    tag.setAttribute('y', String(ESC_COMP_CY + 4));
    tag.setAttribute('text-anchor', 'end');
    tag.removeAttribute('transform');
    tag.setAttribute('font-size', '9');
    tag.style.fontSize = '9px';
  }
  const comment = g.querySelector(':scope > .drop-comment');
  if (comment) {
    // Place the vertical comment in its own column to the left of the component tag.
    const commentX = Math.round((tagX - 20) * 100) / 100;
    comment.setAttribute('x', String(commentX));
    comment.setAttribute('y', String(ESC_COMP_CY + 4));
    comment.setAttribute('text-anchor', 'middle');
    const commentY = ESC_COMP_CY + 4;
    comment.setAttribute('transform', `rotate(-90 ${commentX} ${commentY})`);
  }
}
window.layoutComponentAnnotations = layoutComponentAnnotations;

function applySharedLabelColourToComponent(g, colour) {
  if (!g) return;
  const sharedColour = colour || getComputedStyle(document.documentElement).getPropertyValue('--esc-tag-terminal-color').trim() || '#00d9f5';
  g.querySelectorAll(':scope > .drop-tag, :scope > .component-ports .port-name').forEach(label => {
    label.style.setProperty('fill', sharedColour, 'important');
    label.style.setProperty('color', sharedColour, 'important');
  });
}
window.applySharedLabelColourToComponent = applySharedLabelColourToComponent;

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
  // Final position is applied by layoutComponentAnnotations after the annotation nodes exist.
  tag.setAttribute('x', String(Math.round((ESC_COMP_CX - tightW / 2 - 8) * 100) / 100));
  tag.setAttribute('y', String(ESC_COMP_CY + 4));
  tag.setAttribute('text-anchor', 'end');
  tag.setAttribute('font-size', '9');
  tag.style.fill = '#ffffff';
  tag.style.fontSize = '9px';
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
  layoutComponentAnnotations(g);
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
function simplifyWirePointString(rawPoints) {
  const parsed = String(rawPoints || '').trim().split(/\s+/).filter(Boolean).map(pair => {
    const [x, y] = pair.split(',').map(Number);
    return { x, y };
  }).filter(point => Number.isFinite(point.x) && Number.isFinite(point.y));
  if (parsed.length < 2) return String(rawPoints || '');

  const points = [];
  parsed.forEach((point, index) => {
    const previous = points[points.length - 1];
    if (!previous || Math.hypot(point.x - previous.x, point.y - previous.y) > 0.01 || index === parsed.length - 1) {
      points.push(point);
    }
    while (points.length >= 3) {
      const a = points[points.length - 3];
      const b = points[points.length - 2];
      const c = points[points.length - 1];
      const sameRow = Math.abs(a.y - b.y) <= 0.01 && Math.abs(b.y - c.y) <= 0.01;
      const sameColumn = Math.abs(a.x - b.x) <= 0.01 && Math.abs(b.x - c.x) <= 0.01;
      if (!sameRow && !sameColumn) break;
      points.splice(points.length - 2, 1);
    }
  });
  if (points.length === 1) points.push(parsed[parsed.length - 1]);
  return points.map(point => `${Math.round(point.x * 100) / 100},${Math.round(point.y * 100) / 100}`).join(' ');
}

function computeWirePointsRaw(fromPort, toPort, waypoints = []) {
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
    const pIdx = (typeof fromPort.index === 'number' ? fromPort.index : (typeof toPort.index === 'number' ? toPort.index : 0)) % 4;
    // 1. bottom -> top
    if (fromSide === 'bottom' && toSide === 'top') {
      if (by >= ay - 2) {
        if (Math.abs(ax - bx) <= 1.5) return `${ax},${ay} ${bx},${by}`;
        const spanY = Math.max(0, by - ay);
        const dirX = bx >= ax ? 1 : -1;
        const maxOff = Math.floor(spanY * 0.35);
        const laneOff = spanY >= 24 ? Math.max(-maxOff, Math.min(maxOff, Math.round((pIdx - 1) * 8 * dirX))) : 0;
        const my = Math.round((ay + by) / 2 + laneOff);
        return `${ax},${ay} ${ax},${my} ${bx},${my} ${bx},${by}`;
      }
      const y1 = Math.round(ay + STUB + pIdx * 6);
      const y2 = Math.round(by - STUB - pIdx * 6);
      const mx = Math.abs(ax - bx) >= 36 ? Math.round((ax + bx) / 2 + (pIdx - 1) * 8) : Math.round(Math.max(ax, bx) + 32 + pIdx * 8);
      return `${ax},${ay} ${ax},${y1} ${mx},${y1} ${mx},${y2} ${bx},${y2} ${bx},${by}`;
    }
    // 2. top -> bottom
    if (fromSide === 'top' && toSide === 'bottom') {
      if (by <= ay + 2) {
        if (Math.abs(ax - bx) <= 1.5) return `${ax},${ay} ${bx},${by}`;
        const spanY = Math.max(0, ay - by);
        const dirX = bx >= ax ? -1 : 1;
        const maxOff = Math.floor(spanY * 0.35);
        const laneOff = spanY >= 24 ? Math.max(-maxOff, Math.min(maxOff, Math.round((pIdx - 1) * 8 * dirX))) : 0;
        const my = Math.round((ay + by) / 2 + laneOff);
        return `${ax},${ay} ${ax},${my} ${bx},${my} ${bx},${by}`;
      }
      const y1 = Math.round(ay - STUB - pIdx * 6);
      const y2 = Math.round(by + STUB + pIdx * 6);
      const mx = Math.abs(ax - bx) >= 36 ? Math.round((ax + bx) / 2 + (pIdx - 1) * 8) : Math.round(Math.max(ax, bx) + 32 + pIdx * 8);
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
function computeWirePoints(fromPort, toPort, waypoints = []) {
  return simplifyWirePointString(computeWirePointsRaw(fromPort, toPort, waypoints));
}
window.computeWirePoints = computeWirePoints;

/* Click to Connect Mode Wire Router:
   - If the two terminals are aligned horizontally (|ay - by| <= 2) or vertically (|ax - bx| <= 2),
     no 3-route option or 90-degree bend is needed: returns a direct 1-segment straight line.
   - If the two terminals are misaligned (|ax - bx| > 2 and |ay - by| > 2),
     3-route option occurs: returns 3 orthogonal segments with two 90-degree bends (VHV or HVH).
   - If a component is dragged into aligned position, automatically straightens with no 90-degree bend. */
function computeClickToConnectRouteRaw(fromPort, toPort, customMid = null, customOrient = null) {
  if (!fromPort || !toPort) return { points: '', orient: 'VHV', mid: 0, aligned: false };
  const ax = Math.round(fromPort.x * 100) / 100;
  const ay = Math.round(fromPort.y * 100) / 100;
  const bx = Math.round(toPort.x * 100) / 100;
  const by = Math.round(toPort.y * 100) / 100;
  const dx = Math.abs(bx - ax);
  const dy = Math.abs(by - ay);

  // Aligned horizontally or vertically -> straight 1-segment wire with no 90-degree bend
  if ((dx <= 2 || dy <= 2) && (customMid === null || customMid === '')) {
    return {
      points: `${ax},${ay} ${bx},${by}`,
      orient: dx <= 2 ? 'V' : 'H',
      mid: dx <= 2 ? ax : ay,
      aligned: true
    };
  }

  const GRID = 10;
  const snapG = v => Math.round(v / GRID) * GRID;
  const fromSide = fromPort.side || '';
  const toSide = toPort.side || '';
  const fromVert = (fromSide === 'top' || fromSide === 'bottom');
  const toVert = (toSide === 'top' || toSide === 'bottom');

  let orient = customOrient;
  if (orient !== 'HVH' && orient !== 'VHV') {
    if (fromVert && toVert) {
      orient = 'VHV';
    } else if (!fromVert && !toVert && (fromSide === 'left' || fromSide === 'right' || toSide === 'left' || toSide === 'right')) {
      orient = 'HVH';
    } else {
      orient = dy >= dx ? 'VHV' : 'HVH';
    }
  }

  if (orient === 'HVH') {
    let mx;
    if (customMid !== null && customMid !== '' && Number.isFinite(Number(customMid))) {
      mx = snapG(Number(customMid));
    } else if (fromSide === 'right' && toSide === 'right') {
      mx = snapG(Math.max(ax, bx) + 20);
    } else if (fromSide === 'left' && toSide === 'left') {
      mx = snapG(Math.min(ax, bx) - 20);
    } else {
      mx = snapG((ax + bx) / 2);
      if (Math.abs(mx - ax) < 2 || Math.abs(mx - bx) < 2) {
        mx = Math.round(((ax + bx) / 2) * 100) / 100;
      }
    }
    return {
      points: `${ax},${ay} ${mx},${ay} ${mx},${by} ${bx},${by}`,
      orient: 'HVH',
      mid: mx,
      aligned: false
    };
  }

  let my;
  if (customMid !== null && customMid !== '' && Number.isFinite(Number(customMid))) {
    my = snapG(Number(customMid));
  } else if (fromSide === 'bottom' && toSide === 'bottom') {
    my = snapG(Math.max(ay, by) + 20);
  } else if (fromSide === 'top' && toSide === 'top') {
    my = snapG(Math.min(ay, by) - 20);
  } else {
    my = snapG((ay + by) / 2);
    if (Math.abs(my - ay) < 2 || Math.abs(my - by) < 2) {
      my = Math.round(((ay + by) / 2) * 100) / 100;
    }
  }
  return {
    points: `${ax},${ay} ${ax},${my} ${bx},${my} ${bx},${by}`,
    orient: 'VHV',
    mid: my,
    aligned: false
  };
}
function computeClickToConnectRoute(fromPort, toPort, customMid = null, customOrient = null) {
  const route = computeClickToConnectRouteRaw(fromPort, toPort, customMid, customOrient);
  return { ...route, points: simplifyWirePointString(route.points) };
}
window.computeClickToConnectRoute = computeClickToConnectRoute;

function computeClickToConnectPoints(fromPort, toPort, customMid = null, customOrient = null) {
  return computeClickToConnectRoute(fromPort, toPort, customMid, customOrient).points;
}
window.computeClickToConnectPoints = computeClickToConnectPoints;

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
    const isAlignedNow = (Math.abs(a.x - b.x) <= 2 || Math.abs(a.y - b.y) <= 2);
    if (targetUid || isAlignedNow) {
      delete wire.dataset.waypoints;
      delete wire.dataset.customPoints;
      delete wire.dataset.orthoMid;
      delete wire.dataset.orthoOrient;
    }
    if (wire.dataset.routingMode === 'click-to-connect') {
      if (!targetUid && !isAlignedNow && wire.dataset.customPoints) {
        wire.setAttribute('points', wire.dataset.customPoints);
        continue;
      }
      const route = computeClickToConnectRoute(
        a,
        b,
        (!targetUid && !isAlignedNow) ? wire.dataset.orthoMid : null,
        (!targetUid && !isAlignedNow) ? wire.dataset.orthoOrient : null
      );
      wire.dataset.orthoOrient = route.orient;
      wire.dataset.orthoMid = String(route.mid);
      wire.setAttribute('points', route.points);
      continue;
    }
    if (isAlignedNow && !wire.dataset.branchWireFixed) {
      const ax = Math.round(a.x * 100) / 100, ay = Math.round(a.y * 100) / 100;
      const bx = Math.round(b.x * 100) / 100, by = Math.round(b.y * 100) / 100;
      wire.setAttribute('points', `${ax},${ay} ${bx},${by}`);
      continue;
    }
    let waypoints = [];
    if (!targetUid && wire.dataset.waypoints) {
      try { waypoints = JSON.parse(wire.dataset.waypoints) || []; } catch (_) {}
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

  function isClickToConnectMode() {
    const toggleEl = document.getElementById('clickToConnectToggle');
    if (toggleEl) return Boolean(toggleEl.checked);
    return Boolean(
      window.__escClickToConnectMode ||
      document.body.classList.contains('click-to-connect-mode')
    );
  }
  window.isClickToConnectMode = isClickToConnectMode;
  window.isDragConnectMode = isClickToConnectMode;

  function clearConnectTargets() {
    document.querySelectorAll('#dropLayer .mag-port.connect-target').forEach(el => el.classList.remove('connect-target'));
  }

  function clearEndpointGlow() {
    document.querySelectorAll('#dropLayer .mag-port.port-connected-glow').forEach(el => el.classList.remove('port-connected-glow'));
  }
  window.clearEndpointGlow = clearEndpointGlow;

  function hideWireGuides() {
    guideX.style.display = 'none';
    guideY.style.display = 'none';
    preview.setAttribute('points', '');
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

  function selectTerminal(portInfo, keepExisting = false) {
    if (!keepExisting) {
      document.querySelectorAll('#dropLayer .mag-port.port-selected').forEach(el => el.classList.remove('port-selected'));
    }
    selectedPort = portInfo || null;
    if (portInfo && portInfo.el) {
      portInfo.el.classList.add('port-selected');
    }
  }
  window.selectTerminal = selectTerminal;

  function cancelActiveWiring(msg = 'WIRING CANCELLED') {
    if (activePort && activePort.el) {
      activePort.el.classList.remove('port-active', 'port-selected', 'selected', 'click-connect-source');
    }
    document.querySelectorAll('#dropLayer .mag-port.port-active, #dropLayer .mag-port.port-selected, #dropLayer .mag-port.selected').forEach(el => {
      el.classList.remove('port-active', 'port-selected', 'selected', 'click-connect-source');
    });
    activePort = null;
    window.__escWiringActive = false;
    hideWireGuides();
    if (msg && state) state.textContent = msg;
  }
  window.cancelActiveWiring = cancelActiveWiring;

  function createWireConnection(fromPort, toPort, waypoints = [], modeOverride = null) {
    if (!fromPort || !toPort || !fromPort.g || !toPort.g) return null;
    if (!fromPort.g.isConnected || !toPort.g.isConnected) return null;
    if (fromPort.g === toPort.g && fromPort.index === toPort.index) return null;

    const useClickToConnect = modeOverride
      ? (modeOverride === 'click-to-connect')
      : (fromPort.mode ? fromPort.mode === 'click-to-connect' : isClickToConnectMode());

    if (useClickToConnect && fromPort.g === toPort.g) {
      return null;
    }

    if (!fromPort.g.dataset.uid) fromPort.g.dataset.uid = 'C' + Date.now().toString(36);
    if (!toPort.g.dataset.uid) toPort.g.dataset.uid = 'C' + Date.now().toString(36);

    const freshFrom = resolveComponentPort(fromPort.g, fromPort.index, fromPort.label) || fromPort;
    const freshTo = resolveComponentPort(toPort.g, toPort.index, toPort.label) || toPort;

    const line = document.createElementNS(NS, 'polyline');
    line.setAttribute('class', 'connected-wire');

    if (useClickToConnect) {
      const route = computeClickToConnectRoute(freshFrom, freshTo);
      line.setAttribute('points', route.points);
      line.dataset.routingMode = 'click-to-connect';
      line.dataset.orthoOrient = route.orient;
      line.dataset.orthoMid = String(route.mid);
    } else {
      const isAligned = (!waypoints || !waypoints.length) && (Math.abs(freshFrom.x - freshTo.x) <= 2 || Math.abs(freshFrom.y - freshTo.y) <= 2);
      if (isAligned) {
        const ax = Math.round(freshFrom.x * 100) / 100, ay = Math.round(freshFrom.y * 100) / 100;
        const bx = Math.round(freshTo.x * 100) / 100, by = Math.round(freshTo.y * 100) / 100;
        line.setAttribute('points', `${ax},${ay} ${bx},${by}`);
      } else {
        line.setAttribute('points', computeWirePoints(freshFrom, freshTo, waypoints));
      }
      line.dataset.routingMode = 'default';
      if (waypoints && waypoints.length) {
        line.dataset.waypoints = JSON.stringify(waypoints);
      }
    }

    line.dataset.from = freshFrom.label;
    line.dataset.to = freshTo.label;
    line.dataset.fromIndex = String(freshFrom.index);
    line.dataset.toIndex = String(freshTo.index);
    line.dataset.fromType = freshFrom.g.dataset.type || '';
    line.dataset.toType = freshTo.g.dataset.type || '';
    line.dataset.fromG = freshFrom.g.dataset.uid;
    line.dataset.toG = freshTo.g.dataset.uid;

    if (preview.parentNode === wireLayer) {
      wireLayer.insertBefore(line, preview);
    } else {
      wireLayer.appendChild(line);
    }

    if (activePort && activePort.el) {
      activePort.el.classList.remove('port-active', 'selected', 'click-connect-source');
    }
    document.querySelectorAll('#dropLayer .mag-port.port-active, #dropLayer .mag-port.selected').forEach(el => {
      el.classList.remove('port-active', 'selected', 'click-connect-source');
    });

    // Keep both connected terminals glowing with the neon circle (.port-connected-glow & .port-selected)
    // as in the early design!
    clearEndpointGlow();
    selectTerminal(null);
    if (freshFrom && freshFrom.el) {
      freshFrom.el.classList.add('port-connected-glow', 'port-selected');
    }
    if (freshTo && freshTo.el) {
      freshTo.el.classList.add('port-connected-glow', 'port-selected');
    }
    selectedPort = freshTo;

    syncConnectedPortStates();
    const fromRef = freshFrom.g.dataset.ref || freshFrom.g.dataset.name || 'C1';
    const toRef = freshTo.g.dataset.ref || freshTo.g.dataset.name || 'C2';
    state.textContent = `CONNECTED • ${fromRef}:${freshFrom.label} ↔ ${toRef}:${freshTo.label}`;
    activePort = null;
    window.__escWiringActive = false;
    hideWireGuides();
    if (running && typeof evaluateCircuitSimulation === 'function') {
      evaluateCircuitSimulation();
    }
    return line;
  }
  window.createWireConnection = createWireConnection;

  function startWiringFromPort(portInfo, pointerId = null) {
    if (!portInfo || !portInfo.g || !portInfo.g.isConnected) return;
    const clickConnect = isClickToConnectMode();
    selectWire(null);
    clearEndpointGlow();
    selectTerminal(portInfo, false);
    activePort = {
      ...portInfo,
      waypoints: [],
      pointerId,
      dragged: false,
      mode: clickConnect ? 'click-to-connect' : 'default'
    };
    window.__escWiringActive = true;
    if (portInfo.el) {
      portInfo.el.classList.add('port-active', 'port-selected', 'selected');
      if (clickConnect) portInfo.el.classList.add('click-connect-source');
    }
    const ref = portInfo.g.dataset.ref || portInfo.g.dataset.name || 'COMPONENT';
    if (clickConnect) {
      // Click to Connect mode: terminal glows as starting point; user does not need to hold left mouse button.
      preview.setAttribute('points', '');
      preview.style.display = 'none';
      guideX.style.display = 'none';
      guideY.style.display = 'none';
      state.textContent = `CLICK TO CONNECT • ${ref}:${portInfo.label} • CLICK ANOTHER COMPONENT TERMINAL TO CONNECT`;
    } else {
      // Early wire connection system: live wire preview from starting terminal.
      preview.setAttribute('points', `${portInfo.x},${portInfo.y} ${portInfo.x},${portInfo.y}`);
      preview.style.display = 'block';
      state.textContent = `WIRE START • ${ref}:${portInfo.label} • CLICK ANOTHER TERMINAL TO CONNECT`;
    }
  }

  function handlePortInteraction(hitPort, pointerId = null) {
    if (!hitPort || !hitPort.g || !hitPort.g.isConnected) return false;
    if (!activePort) {
      justCompletedOnDown = false;
      startWiringFromPort(hitPort, pointerId);
      return true;
    }

    // Clicking the exact same starting terminal cancels active wiring
    if (activePort.g === hitPort.g && activePort.index === hitPort.index) {
      justCompletedOnDown = true;
      clearEndpointGlow();
      selectTerminal(null);
      cancelActiveWiring('WIRING CANCELLED');
      return true;
    }

    const clickConnect = (activePort.mode === 'click-to-connect') || isClickToConnectMode();
    if (clickConnect && activePort.g === hitPort.g) {
      justCompletedOnDown = true;
      if (state) state.textContent = 'SELECT A TERMINAL ON ANOTHER COMPONENT';
      return true;
    }

    justCompletedOnDown = true;
    createWireConnection(activePort, hitPort, activePort.waypoints || [], clickConnect ? 'click-to-connect' : 'default');
    return true;
  }

  svgEl.addEventListener('pointerdown', e => {
    if (e.button !== 0 || running || document.body.classList.contains('live')) return;
    const hitPort = resolvePortFromEvent(e, 11);
    if (hitPort) {
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      handlePortInteraction(hitPort, e.pointerId);
      return;
    }

    // In Early Wire Connection mode: if actively wiring and user clicks on an existing wire segment, create a T-branch wire with a joint point!
    if (activePort && activePort.mode !== 'click-to-connect' && !isClickToConnectMode() && typeof window.findNearestPointOnExistingWire === "function") {
      const wireHit = window.findNearestPointOnExistingWire(getPoint(e), 9);
      if (wireHit && wireHit.wire) {
        const targetG = document.querySelector(`#dropLayer .dropped-symbol[data-uid="${wireHit.wire.dataset.fromG}"]`);
        const targetPort = targetG ? resolveComponentPort(targetG, wireHit.wire.dataset.fromIndex, wireHit.wire.dataset.from) : null;
        if (targetPort) {
          e.preventDefault();
          e.stopPropagation();
          if (e.stopImmediatePropagation) e.stopImmediatePropagation();
          justCompletedOnDown = true;
          const wps = activePort.waypoints ? [...activePort.waypoints] : [];
          const freshFrom = resolveComponentPort(activePort.g, activePort.index, activePort.label) || activePort;
          const bSide = wireHit.isHorizontal
            ? (freshFrom.y <= wireHit.y ? "top" : "bottom")
            : (freshFrom.x <= wireHit.x ? "left" : "right");
          const branchLine = createWireConnection(activePort, targetPort, wps, 'default');
          if (branchLine) {
            branchLine.dataset.branchWireFixed = "1";
            branchLine.dataset.branchX = String(wireHit.x);
            branchLine.dataset.branchY = String(wireHit.y);
            branchLine.dataset.branchSide = bSide;
            branchLine.setAttribute("points", computeWirePoints(freshFrom, { x: wireHit.x, y: wireHit.y, side: bSide, index: 0 }, wps));
            if (typeof window.updateWireBranchJoints === "function") window.updateWireBranchJoints();
          }
          return;
        }
      }
    }

    // Check if clicking an existing wire when not actively wiring
    if (!activePort) {
      const wireEl = e.target && e.target.closest ? e.target.closest('.connected-wire') : null;
      if (wireEl) {
        e.preventDefault();
        e.stopPropagation();
        clearEndpointGlow();
        selectTerminal(null);
        selectWire(wireEl);
        return;
      }
      if (!e.target.closest('.dropped-symbol')) {
        selectWire(null);
        clearEndpointGlow();
        selectTerminal(null);
      }
    }
  }, true);

  // Clicking elsewhere on the workspace abandons a pending wire start.
  // Terminal clicks are handled above, and successful wire branches clear activePort first.
  document.addEventListener('pointerdown', e => {
    if (e.button !== 0 || !activePort) return;
    if (!e.target?.closest?.('#sheet, #schematic')) return;
    if (resolvePortFromEvent(e, 11)) return;
    cancelActiveWiring('WIRING CANCELLED');
    selectTerminal(null);
  });

  // Live wire preview and magnetic target snapping during pointermove
  svgEl.addEventListener('pointermove', e => {
    if (running || document.body.classList.contains('live')) return;
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
    if (freshStart.el) {
      activePort.el = freshStart.el;
      activePort.el.classList.add('port-active', 'port-selected', 'selected');
    }

    if (Math.hypot(p.x - activePort.x, p.y - activePort.y) > 6) {
      activePort.dragged = true;
    }

    clearConnectTargets();
    const clickConnect = (activePort.mode === 'click-to-connect') || isClickToConnectMode();
    const snapPort = findNearestTargetPort(p, activePort, 16);
    if (snapPort && snapPort.el && (!clickConnect || snapPort.g !== activePort.g)) {
      snapPort.el.classList.add('connect-target');
    }

    if (clickConnect) {
      preview.style.display = 'none';
      guideX.style.display = 'none';
      guideY.style.display = 'none';
      return;
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

  // In Early Wire Connection mode: support drag-and-release from Terminal 1 directly onto Terminal 2
  window.addEventListener('pointerup', e => {
    if (justCompletedOnDown) {
      justCompletedOnDown = false;
      return;
    }
    if (!activePort) return;
    const clickConnect = (activePort.mode === 'click-to-connect') || isClickToConnectMode();
    if (clickConnect) return;

    const targetPort = resolvePortFromEvent(e, 16) || (e.clientX != null ? findNearestTargetPort(getPoint(e), activePort, 16) : null);
    if (targetPort && (targetPort.g !== activePort.g || targetPort.index !== activePort.index)) {
      e.preventDefault();
      e.stopPropagation();
      createWireConnection(activePort, targetPort, activePort.waypoints || [], 'default');
    }
  }, true);

  // Left-click on empty canvas while wiring in Early Wire Connection mode adds a user-defined cable bend (waypoint)
  svgEl.addEventListener('click', e => {
    const hitPort = resolvePortFromEvent(e, 12);
    if (hitPort) {
      e.preventDefault();
      e.stopPropagation();
      // Pointer clicks are already handled on pointerdown. Only handle click-only
      // activation here (for example, keyboard activation), so a normal click
      // followed by release cannot select the same terminal twice and cancel.
      if (e.detail === 0) {
        handlePortInteraction(hitPort, null);
      }
      return;
    }
    if (!activePort) return;
    if ((activePort.mode === 'click-to-connect') || isClickToConnectMode()) return;
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
    clearEndpointGlow();
    selectTerminal(null);
    cancelActiveWiring('WIRING CANCELLED');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (activePort) {
        clearEndpointGlow();
        selectTerminal(null);
        cancelActiveWiring('WIRING CANCELLED');
      } else {
        clearEndpointGlow();
        selectTerminal(null);
        selectWire(null);
      }
    }
  });

  const hint = document.querySelector('.hint');
  if (hint) hint.textContent = 'Click two terminals to connect by default, or click Drag Connect to drag wires between terminals.';
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
    layoutComponentAnnotations(g);
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
     if(e.detail > 1) return;
     window.__escLastLibInsertTime = Date.now();
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
   {name:'Sources', color:'#12d6a0'},
   {name:'Coils', color:'#b58aff'},
   {name:'Auxiliary Contacts', color:'#e879f9'}, {name:'Switches', color:'#ffd43b'},
   {name:'Loads', color:'#22d3ee'}, {name:'Main Contacts', color:'#ff944d'},
   {name:'Protections', color:'#34e5b5'}, {name:'Motors', color:'#ff4d8d'},
   {name:'Proximity Sensor', color:'#f97316'}
  ];
  const categoryColorMap = Object.fromEntries(libraryCategories.map(c => [c.name, c.color]));
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
   // Load colour selection belongs to a placed Pilot Light's properties, not the library.
   const loadPaletteBar = '';
   const activeCatColor = categoryColorMap[activeCategory] || '#12d6a0';
   const resultMarkup = loadPaletteBar +
    (filtered.length ? `<div class="component-results" style="--category-accent:${activeCatColor}">`+filtered.map(it=>{
      const cardColor = (window.getEscLoadSimColor ? window.getEscLoadSimColor(it.file) : '#ff3b30');
      const itemCatColor = categoryColorMap[it.category] || activeCatColor;
      const cardDots = '';
      const inlEntry = (typeof getSvgInlineEntry === 'function') ? getSvgInlineEntry(it.file) : null;
      const imgSrc = inlEntry ? ('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${inlEntry.vb}">${inlEntry.inner}</svg>`)) : it.file;
      return `<button type="button" class="symbol-btn" draggable="true" title="Drag ${it.name} into the schematic" style="--category-accent:${itemCatColor};border-color:${itemCatColor}" data-category="${it.category}" data-symbol="${String(it.type).replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" data-name="${String(it.name).replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" data-ref="" data-accent="#e9f1ed" data-sim-color="${cardColor}" data-file="${it.file.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}"><img src="${imgSrc}" alt="" loading="lazy" onerror="this.style.display='none'"><span>${it.name}</span>${cardDots}</button>`;
    }).join('')+'</div>' : '<div class="component-results"><div class="library-empty">No symbols match this category or search.</div></div>');
   host.innerHTML = '<div class="component-category-list" role="list" aria-label="Component categories">' +
    libraryCategories.map(c=>{const expanded=activeCategory===c.name;const count=normalized.filter(it=>it.category===c.name).length;return `<div class="library-category-wrap" data-category="${c.name}" style="--category-accent:${c.color}"><button type="button" class="component-category ${expanded?'active':''}" data-category="${c.name}" style="--category-accent:${c.color}" aria-pressed="${expanded}" aria-expanded="${expanded}"><span class="category-icon ${c.name==='Proximity Sensor'?'proximity-category-icon':''}" aria-hidden="true"><svg viewBox="0 0 36 32" focusable="false" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${categoryIcons[c.name]||''}</svg></span><span class="category-mark" aria-hidden="true"></span><span class="category-name">${c.name}</span><span class="category-count">(${count})</span><span class="category-chevron ${expanded?'expanded':''}" aria-hidden="true">›</span></button>${expanded?resultMarkup:''}</div>`}).join('') + '</div>';
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
 const embeddedSymbolManifest = {"project": "ELECTRICAL SIMU CKT", "count": 61, "symbols": [{"file": "components/Power/earth_ground(1).svg", "name": "Earth Ground", "category": "Sources", "original_filename": "earth_ground(1).svg", "type": "Earth Ground"}, {"file": "components/Power/earth_pe(1).svg", "name": "Earth PE", "category": "Sources", "original_filename": "earth_pe(1).svg", "type": "Earth PE"}, {"file": "components/Power/source_dc_negative(1).svg", "name": "Source DC Negative", "category": "Sources", "original_filename": "source_dc_negative(1).svg", "type": "Source DC Negative"}, {"file": "components/Power/source_dc_positive(1).svg", "name": "Source DC Positive", "category": "Sources", "original_filename": "source_dc_positive(1).svg", "type": "Source DC Positive"}, {"file": "components/Power/source_dc_supply_pair(1).svg", "name": "Source DC Supply Pair", "category": "Sources", "original_filename": "source_dc_supply_pair(1).svg", "type": "Source DC Supply Pair"}, {"file": "components/Power/terminal_l1_l2_l3(1).svg", "name": "Terminal L1 L2 L3", "category": "Sources", "original_filename": "terminal_l1_l2_l3(1).svg", "type": "Terminal L1 L2 L3"}, {"file": "components/Power/terminal_l1_l2_l3_n(1).svg", "name": "Terminal L1 L2 L3 N", "category": "Sources", "original_filename": "terminal_l1_l2_l3_n(1).svg", "type": "Terminal L1 L2 L3 N"}, {"file": "components/Power/terminal_neutral_n(1).svg", "name": "Terminal Neutral N", "category": "Sources", "original_filename": "terminal_neutral_n(1).svg", "type": "Terminal Neutral N"}, {"file": "components/Power/terminal_phase_l(1).svg", "name": "Terminal Phase L", "category": "Sources", "original_filename": "terminal_phase_l(1).svg", "type": "Terminal Phase L"}, {"file": "components/Power/ac_to_dc_power_supply.svg", "name": "AC to DC Power Supply", "category": "Sources", "original_filename": "ac_to_dc_power_supply.svg", "type": "AC to DC Power Supply"}, {"file": "components/Coils/coil_contactor.svg", "name": "Contactor Coil", "category": "Coils", "original_filename": "coil_contactor.svg", "type": "Contactor Coil"}, {"file": "components/Coils/coil_tof_timer.svg", "name": "TOF Timer Coil", "category": "Coils", "original_filename": "coil_tof_timer.svg", "type": "TOF Timer Coil"}, {"file": "components/Coils/coil_ton_timer.svg", "name": "TON Timer Coil", "category": "Coils", "original_filename": "coil_ton_timer.svg", "type": "TON Timer Coil"}, {"file": "components/Coils/coil_ton_tof_timer.svg", "name": "TON/TOF Timer Coil", "category": "Coils", "original_filename": "coil_ton_tof_timer.svg", "type": "TON/TOF Timer Coil"}, {"file": "components/Auxiliary Contacts/aux_contacts_nc.svg", "name": "Aux Contacts NC", "category": "Auxiliary Contacts", "original_filename": "aux_contacts_nc.svg", "type": "Aux Contacts NC"}, {"file": "components/Auxiliary Contacts/aux_contacts_no.svg", "name": "Aux Contacts NO", "category": "Auxiliary Contacts", "original_filename": "aux_contacts_no.svg", "type": "Aux Contacts NO"}, {"file": "components/Auxiliary Contacts/aux_contacts_off_delay_nc.svg", "name": "Aux Contacts Off Delay NC", "category": "Auxiliary Contacts", "original_filename": "aux_contacts_off_delay_nc.svg", "type": "Aux Contacts Off Delay NC"}, {"file": "components/Auxiliary Contacts/aux_contacts_off_delay_no.svg", "name": "Aux Contacts Off Delay NO", "category": "Auxiliary Contacts", "original_filename": "aux_contacts_off_delay_no.svg", "type": "Aux Contacts Off Delay NO"}, {"file": "components/Auxiliary Contacts/aux_contacts_on_delay_nc.svg", "name": "Aux Contacts On Delay NC", "category": "Auxiliary Contacts", "original_filename": "aux_contacts_on_delay_nc.svg", "type": "Aux Contacts On Delay NC"}, {"file": "components/Auxiliary Contacts/aux_contacts_on_delay_no.svg", "name": "Aux Contacts On Delay NO", "category": "Auxiliary Contacts", "original_filename": "aux_contacts_on_delay_no.svg", "type": "Aux Contacts On Delay NO"}, {"file": "components/Auxiliary Contacts/aux_contacts_thermal_nc.svg", "name": "Thermal Relay NC", "category": "Auxiliary Contacts", "original_filename": "aux_contacts_thermal_nc.svg", "type": "Thermal Relay NC"}, {"file": "components/Auxiliary Contacts/aux_contacts_thermal_no.svg", "name": "Thermal Relay NO", "category": "Auxiliary Contacts", "original_filename": "aux_contacts_thermal_no.svg", "type": "Thermal Relay NO"}, {"file": "components/Switches/switch_3_position_selector I-0-II(1).svg", "name": "3-Position Selector Switch I-0-II", "category": "Switches", "original_filename": "switch_3_position_selector I-0-II(1).svg", "type": "3-Position Selector Switch I-0-II"}, {"file": "components/Switches/switch_3_position_selector I-II-III(1).svg", "name": "3-Position Selector Switch I-II-III", "category": "Switches", "original_filename": "switch_3_position_selector I-II-III(1).svg", "type": "3-Position Selector Switch I-II-III"}, {"file": "components/Switches/switch_con(1).svg", "name": "Switch Changeover (CON)", "category": "Switches", "original_filename": "switch_con(1).svg", "type": "Switch Changeover (CON)"}, {"file": "components/Switches/switch_nc(1).svg", "name": "Switch NC", "category": "Switches", "original_filename": "switch_nc(1).svg", "type": "Switch NC"}, {"file": "components/Switches/switch_no(1).svg", "name": "Switch NO", "category": "Switches", "original_filename": "switch_no(1).svg", "type": "Switch NO"}, {"file": "components/Switches/switch_pushbutton_con(1).svg", "name": "Pushbutton Changeover (CON)", "category": "Switches", "original_filename": "switch_pushbutton_con(1).svg", "type": "Pushbutton Changeover (CON)"}, {"file": "components/Switches/switch_pushbutton_nc(1).svg", "name": "Pushbutton NC", "category": "Switches", "original_filename": "switch_pushbutton_nc(1).svg", "type": "Pushbutton NC"}, {"file": "components/Switches/switch_pushbutton_no(1).svg", "name": "Pushbutton NO", "category": "Switches", "original_filename": "switch_pushbutton_no(1).svg", "type": "Pushbutton NO"}, {"file": "components/Loads/load_beacon(2).svg", "name": "Beacon", "category": "Loads", "original_filename": "load_beacon(2).svg", "type": "Beacon"}, {"file": "components/Loads/load_bell(2).svg", "name": "Bell", "category": "Loads", "original_filename": "load_bell(2).svg", "type": "Bell"}, {"file": "components/Loads/load_blinking_pilot_lamp(2).svg", "name": "Blinking Pilot Lamp", "category": "Loads", "original_filename": "load_blinking_pilot_lamp(2).svg", "type": "Blinking Pilot Lamp"}, {"file": "components/Loads/load_buzzer(2).svg", "name": "Buzzer", "category": "Loads", "original_filename": "load_buzzer(2).svg", "type": "Buzzer"}, {"file": "components/Loads/load_light(2).svg", "name": "Pilot Light", "category": "Loads", "original_filename": "load_light(2).svg", "type": "Pilot Light"}, {"file": "components/Main Contacts/main_contacts_1p_no(1).svg", "name": "Main Contacts 1P NO", "category": "Main Contacts", "original_filename": "main_contacts_1p_no(1).svg", "type": "Main Contacts 1P NO"}, {"file": "components/Main Contacts/main_contacts_2p_no(1).svg", "name": "Main Contacts 2P NO", "category": "Main Contacts", "original_filename": "main_contacts_2p_no(1).svg", "type": "Main Contacts 2P NO"}, {"file": "components/Main Contacts/main_contacts_3p_no(1).svg", "name": "Main Contacts 3P NO", "category": "Main Contacts", "original_filename": "main_contacts_3p_no(1).svg", "type": "Main Contacts 3P NO"}, {"file": "components/Protections/protection_circuit_breaker_1p(1).svg", "name": "Circuit Breaker 1P", "category": "Protections", "original_filename": "protection_circuit_breaker_1p(1).svg", "type": "Circuit Breaker 1P"}, {"file": "components/Protections/protection_circuit_breaker_2p(1).svg", "name": "Circuit Breaker 2P", "category": "Protections", "original_filename": "protection_circuit_breaker_2p(1).svg", "type": "Circuit Breaker 2P"}, {"file": "components/Protections/protection_circuit_breaker_3p(1).svg", "name": "Circuit Breaker 3P", "category": "Protections", "original_filename": "protection_circuit_breaker_3p(1).svg", "type": "Circuit Breaker 3P"}, {"file": "components/Protections/protection_fuse_1p(1).svg", "name": "Fuse 1P", "category": "Protections", "original_filename": "protection_fuse_1p(1).svg", "type": "Fuse 1P"}, {"file": "components/Protections/protection_fuse_2p(1).svg", "name": "Fuse 2P", "category": "Protections", "original_filename": "protection_fuse_2p(1).svg", "type": "Fuse 2P"}, {"file": "components/Protections/protection_fuse_3p(1).svg", "name": "Fuse 3P", "category": "Protections", "original_filename": "protection_fuse_3p(1).svg", "type": "Fuse 3P"}, {"file": "components/Protections/protection_fuse_4p(1).svg", "name": "Fuse 4P", "category": "Protections", "original_filename": "protection_fuse_4p(1).svg", "type": "Fuse 4P"}, {"file": "components/Protections/protection_fuse_isolator_1p(1).svg", "name": "Fuse Isolator 1P", "category": "Protections", "original_filename": "protection_fuse_isolator_1p(1).svg", "type": "Fuse Isolator 1P"}, {"file": "components/Protections/protection_fuse_isolator_2p(1).svg", "name": "Fuse Isolator 2P", "category": "Protections", "original_filename": "protection_fuse_isolator_2p(1).svg", "type": "Fuse Isolator 2P"}, {"file": "components/Protections/protection_fuse_isolator_3p(1).svg", "name": "Fuse Isolator 3P", "category": "Protections", "original_filename": "protection_fuse_isolator_3p(1).svg", "type": "Fuse Isolator 3P"}, {"file": "components/Protections/protection_fuse_isolator_4p(1).svg", "name": "Fuse Isolator 4P", "category": "Protections", "original_filename": "protection_fuse_isolator_4p(1).svg", "type": "Fuse Isolator 4P"}, {"file": "components/Protections/protection_motor_circuit_breaker_2p(1).svg", "name": "Motor Circuit Breaker 2P", "category": "Protections", "original_filename": "protection_motor_circuit_breaker_2p(1).svg", "type": "Motor Circuit Breaker 2P"}, {"file": "components/Protections/protection_motor_circuit_breaker_3p(1).svg", "name": "Motor Circuit Breaker 3P", "category": "Protections", "original_filename": "protection_motor_circuit_breaker_3p(1).svg", "type": "Motor Circuit Breaker 3P"}, {"file": "components/Protections/protection_thermal_overload_relay_2p(1).svg", "name": "Thermal Overload Relay 2P", "category": "Protections", "original_filename": "protection_thermal_overload_relay_2p(1).svg", "type": "Thermal Overload Relay 2P"}, {"file": "components/Protections/protection_thermal_overload_relay_3p(1).svg", "name": "Thermal Overload Relay 3P", "category": "Protections", "original_filename": "protection_thermal_overload_relay_3p(1).svg", "type": "Thermal Overload Relay 3P"}, {"file": "components/Motors/motor_dc_motor(2).svg", "name": "DC Motor", "category": "Motors", "original_filename": "motor_dc_motor(2).svg", "type": "DC Motor"}, {"file": "components/Motors/motor_single_phase(2).svg", "name": "Single-Phase Motor", "category": "Motors", "original_filename": "motor_single_phase(2).svg", "type": "Single-Phase Motor"}, {"file": "components/Motors/motor_three_phase(2).svg", "name": "Three-Phase Motor", "category": "Motors", "original_filename": "motor_three_phase(2).svg", "type": "Three-Phase Motor"}, {"file": "components/Motors/motor_three_phase_star_delta(2).svg", "name": "Three-Phase Star-Delta Motor", "category": "Motors", "original_filename": "motor_three_phase_star_delta(2).svg", "type": "Three-Phase Star-Delta Motor"}, {"file": "components/Proximity Sensor/proximity_sensor_npn_nc(2).svg", "name": "Proximity Sensor NPN NC", "category": "Proximity Sensor", "original_filename": "proximity_sensor_npn_nc(2).svg", "type": "Proximity Sensor NPN NC"}, {"file": "components/Proximity Sensor/proximity_sensor_npn_no(2).svg", "name": "Proximity Sensor NPN NO", "category": "Proximity Sensor", "original_filename": "proximity_sensor_npn_no(2).svg", "type": "Proximity Sensor NPN NO"}, {"file": "components/Proximity Sensor/proximity_sensor_pnp_nc(2).svg", "name": "Proximity Sensor PNP NC", "category": "Proximity Sensor", "original_filename": "proximity_sensor_pnp_nc(2).svg", "type": "Proximity Sensor PNP NC"}, {"file": "components/Proximity Sensor/proximity_sensor_pnp_no(2).svg", "name": "Proximity Sensor PNP NO", "category": "Proximity Sensor", "original_filename": "proximity_sensor_pnp_no(2).svg", "type": "Proximity Sensor PNP NO"}]};
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

 // Legacy click listener disabled in favor of V131 spring-return & run-mode pointer controller.
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
    if(running || document.body.classList.contains('live')) return;
    if(typeof window.resolvePortFromEvent==='function' && window.resolvePortFromEvent(e, 11)) return;
    if(e.target && e.target.closest && e.target.closest('.mag-port')) return;
    const g=e.target && e.target.closest ? e.target.closest('.dropped-symbol') : null;
    if(!g) return;
    const panelOpen = document.getElementById('propertyPanel')?.classList.contains('open') && selected === g;
    const isDbl = e.detail >= 2 || panelOpen;
    select(g, isDbl);
    state.textContent = (isDbl ? 'COMPONENT DETAILS • ' : 'SELECTED • ') + (g.dataset.ref||g.dataset.name||'COMPONENT');
  }, true);
})();

/* V18: final, delegated single-component selection and drag controller.
   It takes priority over older per-component handlers to avoid conflicts. */
(function installReliableIndividualDrag(){
  const layer=document.getElementById('dropLayer');
  const canvas=document.getElementById('schematic');
  if(!layer||!canvas) return;
  let drag=null;
  let lastPress={g:null, time:0};
  function point(e){ return getPoint(e); }
  layer.addEventListener('pointerdown', function(e){
    if(e.button!==0 || running || document.body.classList.contains('live') || window.__escWiringActive) return;
    const target=e.target;
    if(target && target.closest && target.closest('.mag-port')) return;
    if(typeof window.resolvePortFromEvent==='function' && window.resolvePortFromEvent(e, 11)) return;
    const g=target && target.closest ? target.closest('.dropped-symbol') : null;
    if(!g) return;
    const now = Date.now();
    const isDouble = (e.detail >= 2) || (lastPress.g === g && (now - lastPress.time) <= 450);
    lastPress = isDouble ? {g:null, time:0} : {g, time:now};
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (isDouble) {
      drag = null;
      select(g, true);
      const panel = document.getElementById('propertyPanel');
      if (panel) {
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
      }
      state.textContent = 'COMPONENT DETAILS • ' + (g.dataset.ref||g.dataset.name||'COMPONENT');
      return;
    }
    const keepOpen = document.getElementById('propertyPanel')?.classList.contains('open') && selected === g;
    select(g, Boolean(keepOpen));
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
    const p=point(e);
    const rawX = p.x - drag.dx;
    const rawY = p.y - drag.dy;
    let x = Math.round(rawX / 12) * 12;
    let y = Math.round(rawY / 12) * 12;
    let bestDx = 19;
    document.querySelectorAll('#dropLayer .dropped-symbol').forEach(o => {
      if (o === g) return;
      const ox = Number(o.dataset.x || 0);
      const d = Math.abs(rawX - ox);
      if (d < bestDx) { bestDx = d; x = ox; }
    });
    // Also snap to exact terminal alignment (vertical or horizontal) with connected wire partner terminals
    const gDefs = portsFor(g);
    const uid = g.dataset.uid;
    if (uid && gDefs.length) {
      let bestTermDx = 14, bestTermDy = 14;
      document.querySelectorAll('#wireLayer .connected-wire').forEach(w => {
        let myIdx = null, otherUid = null, otherIdx = null, otherLbl = null;
        if (w.dataset.fromG === uid) {
          myIdx = Number(w.dataset.fromIndex);
          otherUid = w.dataset.toG;
          otherIdx = w.dataset.toIndex;
          otherLbl = w.dataset.to;
        } else if (w.dataset.toG === uid) {
          myIdx = Number(w.dataset.toIndex);
          otherUid = w.dataset.fromG;
          otherIdx = w.dataset.fromIndex;
          otherLbl = w.dataset.from;
        }
        if (myIdx === null || !otherUid) return;
        const myDef = gDefs[myIdx] || gDefs[0];
        const otherG = document.querySelector(`#dropLayer .dropped-symbol[data-uid="${otherUid}"]`);
        const otherPort = otherG ? resolveComponentPort(otherG, otherIdx, otherLbl) : null;
        if (!myDef || !otherPort) return;
        const targetX = otherPort.x + 60 - myDef.lx;
        const targetY = otherPort.y + 45 - myDef.ly;
        const dtx = Math.abs(rawX - targetX);
        const dty = Math.abs(rawY - targetY);
        if (dtx < bestTermDx) { bestTermDx = dtx; x = Math.round(targetX * 100) / 100; }
        if (dty < bestTermDy) { bestTermDy = dty; y = Math.round(targetY * 100) / 100; }
      });
    }
    if(Math.hypot(x-(+g.dataset.x||0),y-(+g.dataset.y||0))>0.5) {
      drag.moved=true;
      lastPress={g:null, time:0};
    }
    g.dataset.x=x; g.dataset.y=y;
    applyComponentTransform(g,x,y);
    refreshWiresForComponent(g);
    if (typeof window.updateSelectedTerminalAxes === 'function' && selected === g) {
      window.updateSelectedTerminalAxes(g);
    }
  }
  function finish(e){
    if(!drag || (e.pointerId!=null && e.pointerId!==drag.pointerId)) return;
    const g=drag.g;
    const wasMoved=drag.moved;
    drag=null;
    if(g){
      g.classList.remove('moving');
      g.style.cursor='default';
      const keepOpen = document.getElementById('propertyPanel')?.classList.contains('open') && selected === g && !wasMoved;
      select(g, Boolean(keepOpen));
    }
    if(wasMoved && g) state.textContent='MOVED • '+(g.dataset.ref||g.dataset.name||'COMPONENT');
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
  function findSymbolFromEvent(e) {
    const target = e.target;
    let g = target && target.closest ? target.closest('#dropLayer .dropped-symbol') : null;
    if (!g && e.clientX != null && e.clientY != null && document.elementsFromPoint) {
      for (const el of document.elementsFromPoint(e.clientX, e.clientY)) {
        const cand = el.closest && el.closest('#dropLayer .dropped-symbol');
        if (cand) { g = cand; break; }
      }
    }
    return g;
  }
  function openForEvent(e) {
    if (running || document.body.classList.contains('live')) return;
    const target = e.target;
    if (target && target.closest && target.closest('.mag-port')) return;
    if (typeof window.resolvePortFromEvent === 'function' && window.resolvePortFromEvent(e, 11)) return;
    const g = findSymbolFromEvent(e);
    if (!g) return;
    select(g, true);
    const panel = document.getElementById('propertyPanel');
    if (panel) {
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
    }
    if (state) state.textContent = 'COMPONENT DETAILS • ' + (g.dataset.ref || g.dataset.name || 'COMPONENT');
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
  }
  canvas.addEventListener('dblclick', openForEvent, true);
  canvas.addEventListener('click', function(e) {
    if (e.detail < 2) return;
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

function getSvgInlineEntry(typeOrFile) {
  if (typeof SVG_INLINE_CATALOG === "undefined") return null;
  let raw = String(typeOrFile || "");
  try { raw = decodeURIComponent(raw); } catch (_) {}
  const base = raw.split(/[\\/]/).pop().split("?")[0].toLowerCase();
  const canon = base.replace(/\s*\(\d+\)(?=\.svg$)/i, "").replace(/\s*_\s*/g, "_");
  return SVG_INLINE_CATALOG[base] || SVG_INLINE_CATALOG[canon] || null;
}
window.getSvgInlineEntry = getSvgInlineEntry;

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

function normalizeDeviceRef(refStr) {
  return String(refStr || '').trim().replace(/^-+/, '').replace(/\.0+$/, '').toUpperCase();
}
window.normalizeDeviceRef = normalizeDeviceRef;

function classifySimComponent(g) {
  if (!g) return 'other';
  const asset = getAssetBasename(g.dataset.symbolFile || g.dataset.porttype || g.dataset.type || '');
  const text = ((g.dataset.name || '') + ' ' + (g.dataset.type || '') + ' ' + asset).toLowerCase();
  if (/^earth_|^source_dc_|^terminal_|^ac_to_dc_power_supply/.test(asset) || /source|supply|terminal l1|terminal phase|terminal neutral|earth|ac to dc/.test(text)) return 'source';
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

function classifyProtectionSubkind(g) {
  const asset = getAssetBasename(g?.dataset?.symbolFile || g?.dataset?.porttype || g?.dataset?.type || '');
  if (/^protection_fuse_[1234]p\.svg$/.test(asset)) return 'fuse';
  if (/^protection_fuse_isolator_/.test(asset)) return 'fuse_isolator';
  if (/^protection_thermal_overload_relay_/.test(asset)) return 'overload_relay';
  if (/^protection_motor_circuit_breaker_/.test(asset)) return 'mcb_motor';
  if (/^protection_circuit_breaker_/.test(asset)) return 'circuit_breaker';
  return 'breaker';
}
window.classifyProtectionSubkind = classifyProtectionSubkind;

function ensureUniqueOrValidTag(g, proposedRaw) {
  if (!g) return '';
  const trimmed = String(proposedRaw || '').trim();
  if (!trimmed) return g.dataset.ref || nextReference(g.dataset);
  const hasLeadingDash = trimmed.startsWith('-');
  const norm = normalizeDeviceRef(trimmed);
  const kind = classifySimComponent(g);
  // Contacts (main_contact, aux_contact) are allowed and expected to share tags with their controlling Coil (KM/K/KT) or Overload Relay (F)
  if (kind === 'main_contact' || kind === 'aux_contact') {
    return (hasLeadingDash ? '-' : '') + norm;
  }
  // For standalone primary devices, prevent accidental duplicate tag with another primary device of the same category
  const others = [...document.querySelectorAll('#dropLayer .dropped-symbol')].filter(o => {
    if (o === g) return false;
    const oKind = classifySimComponent(o);
    if (oKind === 'main_contact' || oKind === 'aux_contact') return false;
    return normalizeDeviceRef(o.dataset.ref) === norm;
  });
  if (others.length === 0) {
    return (hasLeadingDash ? '-' : '') + norm;
  }
  // Auto-disambiguate duplicate primary tag
  const m = norm.match(/^([A-Z]+)(\d*)$/);
  const prefix = m ? m[1] : norm;
  const used = new Set(
    [...document.querySelectorAll('#dropLayer .dropped-symbol')]
      .filter(o => o !== g)
      .map(o => normalizeDeviceRef(o.dataset.ref))
  );
  let idx = 1;
  while (used.has(prefix + idx)) idx++;
  const resolved = (hasLeadingDash ? '-' : '') + prefix + idx;
  if (state) state.textContent = `DUPLICATE TAG PREVENTED • ASSIGNED UNIQUE TAG ${resolved}`;
  return resolved;
}
window.ensureUniqueOrValidTag = ensureUniqueOrValidTag;

function upgradeComponentToInlineSvg(g) {
  if (!g) return;
  const fileKey = g.dataset.symbolFile || g.dataset.porttype || g.dataset.type || '';
  const asset = getAssetBasename(fileKey);
  const inl = SVG_INLINE_CATALOG[asset];
  if (!inl) return;
  const ns = g.querySelector(':scope > svg:not(.select-box)');
  if (!ns) return;
  if (ns.dataset.inlineUpgraded !== asset || ns.querySelector('image')) {
    const vp = getComponentViewport(fileKey);
    ns.setAttribute('x', String(vp.x));
    ns.setAttribute('y', String(vp.y));
    ns.setAttribute('width', String(vp.w));
    ns.setAttribute('height', String(vp.h));
    ns.setAttribute('viewBox', inl.vb);
    ns.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    ns.classList.add('comp-inline-svg');
    ns.dataset.inlineUpgraded = asset;
    const uid = g.dataset.uid || ('u' + Math.random().toString(36).slice(2, 7));
    let markup = inl.inner;
    if (markup.includes('id="arrow"')) {
      markup = markup.replace(/id="arrow"/g, `id="arrow_${uid}`).replace(/url\(#arrow\)/g, `url(#arrow_${uid})`);
    }
    ns.innerHTML = markup;
  }
  // Older builds tinted artwork text that matched a terminal name; restore those labels
  // to the normal component colour and reserve the shared label setting for external tags.
  ns.querySelectorAll('.svg-terminal-label').forEach(text => {
    text.classList.remove('svg-terminal-label');
    if (text.style.getPropertyPriority('fill') === 'important') text.style.removeProperty('fill');
    if (text.style.getPropertyPriority('color') === 'important') text.style.removeProperty('color');
  });
  if (!g.dataset.simColor) {
    g.dataset.simColor = window.getEscLoadSimColor(g.dataset.symbolFile || '');
  }
  // Tag SVG terminal polygon nodes so they display as hollow hexagonal/polygon terminals when unconnected
  // and disappear cleanly without gaps when a wire is connected.
  const entry = getSvgCatalogEntry(fileKey);
  if (entry && Array.isArray(entry.ports)) {
    entry.ports.forEach((p, idx) => {
      if (!p.tid) return;
      const termEl = ns.querySelector('#' + CSS.escape(p.tid));
      if (termEl) {
        termEl.classList.add('svg-terminal-node');
        termEl.dataset.portIndex = String(idx);
      }
    });
  }
  // Update proximity sensor text label if configured as PNP or NC/NO
  if (classifySimComponent(g) === 'proximity') {
    const pol = (g.dataset.sensorPolarity || (asset.includes('pnp') ? 'PNP' : 'NPN')).toUpperCase();
    const cType = (g.dataset.sensorContact || (asset.includes('_nc') ? 'NC' : 'NO')).toUpperCase();
    const lblNode = ns.querySelector('#svg_13');
    if (lblNode) lblNode.textContent = `${pol} ${cType}`;
  }
  applySharedLabelColourToComponent(g);
}
window.upgradeComponentToInlineSvg = upgradeComponentToInlineSvg;

// Enhance syncConnectedPortStates so visible hollow hexagonal/polygon terminal markers
// disappear when connected by a wire and are restored when the wire is deleted or disconnected.
const _origSyncConnectedPortStates = window.syncConnectedPortStates;
window.syncConnectedPortStates = function() {
  if (typeof _origSyncConnectedPortStates === 'function') {
    _origSyncConnectedPortStates();
  }
  document.querySelectorAll('#dropLayer .dropped-symbol').forEach(g => {
    upgradeComponentToInlineSvg(g);
    const portEls = [...g.querySelectorAll(':scope > .component-ports .mag-port')];
    const ns = g.querySelector(':scope > svg:not(.select-box)');
    if (!ns) return;
    ns.querySelectorAll('.svg-terminal-node').forEach(termNode => {
      const idx = Number(termNode.dataset.portIndex);
      const portEl = portEls[idx];
      const isConn = Boolean(portEl && portEl.classList.contains('connected'));
      termNode.classList.remove('terminal-connected-hidden');
    });
  });
  if (typeof window.updateWireConductorIdentification === 'function') {
    window.updateWireConductorIdentification();
  }
};
syncConnectedPortStates = window.syncConnectedPortStates;

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

  const shiftActuatorElements = (selectors, dx, dy = 0, active = (st !== '0')) => {
    selectors.forEach(sel => {
      const el = ns.querySelector(sel);
      if (!el) return;
      saveOrigAttrs(el, ['transform']);
      if (!active || (dx === 0 && dy === 0)) {
        restoreOrigAttrs(el, ['transform']);
      } else {
        const baseTf = (el.dataset.orig_transform || '').trim();
        el.setAttribute('transform', (baseTf ? baseTf + ' ' : '') + `translate(${dx}, ${dy})`);
      }
    });
  };

  if (
    asset === 'switch_no.svg' ||
    asset === 'switch_pushbutton_no.svg' ||
    asset === 'aux_contacts_no.svg' ||
    asset === 'aux_contacts_thermal_no.svg' ||
    asset === 'aux_contacts_off_delay_no.svg' ||
    asset === 'aux_contacts_on_delay_no.svg'
  ) {
    // 1-pole NO: blade closes from (217.5,304)->(171.5,170) to vertical (217.5,304)->(217.5,168).
    // Blade midpoint at y=236 shifts right by +23 SVG units, so mechanical handle & link move +23.
    closeFlapperToStem('#svg_flapper', 168);
    shiftActuatorElements(
      ['#svg_dash', '#svg_actuator', '#svg_contactor_c', '#svg_contactor_l1', '#svg_contactor_l2'],
      23, 0
    );
  } else if (
    asset === 'switch_nc.svg' ||
    asset === 'switch_pushbutton_nc.svg' ||
    asset === 'aux_contacts_nc.svg' ||
    asset === 'aux_contacts_thermal_nc.svg' ||
    asset === 'aux_contacts_off_delay_nc.svg' ||
    asset === 'aux_contacts_on_delay_nc.svg'
  ) {
    // 1-pole NC: blade opens from (217.5,304)->(263.5,160) to left (217.5,304)->(171.5,170).
    // Blade midpoint at y=236 shifts left by -46 SVG units, so mechanical handle & link move -46.
    setLine('#svg_flapper', 217.5, 304, 171.5, 170);
    shiftActuatorElements(
      ['#svg_dash', '#svg_actuator', '#svg_contactor_c', '#svg_contactor_l1', '#svg_contactor_l2'],
      -46, 0
    );
  } else if (asset === 'switch_con.svg' || asset === 'switch_pushbutton_con.svg') {
    // Changeover (CON): blade pivots from left throw (185,304)->(225,168) to right throw (265,304)->(225,168).
    // Midpoint at y=236 shifts right by +40 SVG units.
    setLine('#svg_flapper', 265, 304, 225, 168);
    shiftActuatorElements(['#svg_dash', '#svg_actuator'], 40, 0);
  } else if (asset === 'switch_3_position_selector i-0-ii.svg' || asset === 'switch_3_position_selector i-ii-iii.svg') {
    const el = ns.querySelector('#svg_flapper');
    if (el) {
      saveOrigAttrs(el, ['x1', 'y1', 'x2', 'y2']);
      if (st === '0') {
        restoreOrigAttrs(el, ['x1', 'y1', 'x2', 'y2']);
        shiftActuatorElements(['#svg_dash', '#svg_actuator'], 0, 0, false);
      } else if (st === '1') {
        el.setAttribute('x1', '270'); el.setAttribute('y1', '296'); el.setAttribute('x2', '270'); el.setAttribute('y2', '168');
        shiftActuatorElements(['#svg_dash', '#svg_actuator'], 40, 0, true);
      } else if (st === '2') {
        el.setAttribute('x1', '350'); el.setAttribute('y1', '304'); el.setAttribute('x2', '270'); el.setAttribute('y2', '168');
        shiftActuatorElements(['#svg_dash', '#svg_actuator'], 80, 0, true);
      }
    }
  } else if (asset === 'main_contacts_1p_no.svg') {
    closeFlapperToStem('#svg_flapper', 168);
  } else if (asset === 'main_contacts_2p_no.svg') {
    closeFlapperToStem('#svg_flapper1', 168);
    closeFlapperToStem('#svg_flapper2', 168);
    shiftActuatorElements(['#svg_dash'], 19, 0);
  } else if (asset === 'main_contacts_3p_no.svg') {
    closeFlapperToStem('#svg_flapper1', 168);
    closeFlapperToStem('#svg_flapper2', 168);
    closeFlapperToStem('#svg_flapper3', 168);
    shiftActuatorElements(['#svg_dash'], 19, 0);
  } else if (asset === 'main_contacts_4p_no.svg') {
    closeFlapperToStem('#svg_flapper1', 168);
    closeFlapperToStem('#svg_flapper2', 168);
    closeFlapperToStem('#svg_flapper3', 168);
    closeFlapperToStem('#svg_flapper4', 168);
    shiftActuatorElements(['#svg_dash'], 19, 0);
  } else if (asset === 'protection_circuit_breaker_1p.svg') {
    closeFlapperToStem('#svg_flapper', 168);
  } else if (asset === 'protection_circuit_breaker_2p.svg') {
    closeFlapperToStem('#svg_flapper1', 168);
    closeFlapperToStem('#svg_flapper2', 168);
    shiftActuatorElements(['#svg_dash'], 20, 0);
  } else if (asset === 'protection_circuit_breaker_3p.svg') {
    closeFlapperToStem('#svg_flapper1', 168);
    closeFlapperToStem('#svg_flapper2', 168);
    closeFlapperToStem('#svg_flapper3', 168);
    shiftActuatorElements(['#svg_dash'], 20, 0);
  } else if (asset === 'protection_motor_circuit_breaker_2p.svg') {
    closeFlapperToStem('#svg_flapper1', 138);
    closeFlapperToStem('#svg_flapper2', 138);
    setLine('#svg_dash_top', 92, 178, 359, 178);
  } else if (asset === 'protection_motor_circuit_breaker_3p.svg') {
    closeFlapperToStem('#svg_flapper1', 138);
    closeFlapperToStem('#svg_flapper2', 138);
    closeFlapperToStem('#svg_flapper3', 138);
    setLine('#svg_dash_top', 92, 178, 539, 178);
  } else if (asset.startsWith('protection_fuse_isolator_')) {
    closeFlapperToStem('#svg_flapper1', 168);
    closeFlapperToStem('#svg_13', 168);
    closeFlapperToStem('#svg_10', 168);
    closeFlapperToStem('#svg_30', 168);
    shiftActuatorElements(['#svg_dash'], 21, 0);
    [
      ['#svg_fuse_box1', '#svg_flapper1', 203],
      ['#svg_14', '#svg_13', 203],
      ['#svg_11', '#svg_10', 203],
      ['#svg_29', '#svg_30', 203]
    ].forEach(([boxSel, flapSel, ry]) => {
      const box = ns.querySelector(boxSel);
      const flap = ns.querySelector(flapSel);
      if (!box || !flap) return;
      saveOrigAttrs(box, ['x', 'y', 'transform']);
      if (st === '0') restoreOrigAttrs(box, ['x', 'y', 'transform']);
      else {
        const stemX = parseFloat(flap.dataset.orig_x1 || flap.getAttribute('x1') || '217.5');
        box.setAttribute('transform', '');
        box.setAttribute('x', String(Math.round((stemX - 19) * 100) / 100));
        box.setAttribute('y', String(ry));
      }
    });
  } else if (asset.startsWith('proximity_sensor_')) {
    const cType = (g.dataset.sensorContact || (asset.includes('_nc') ? 'NC' : 'NO')).toUpperCase();
    const isNc = (cType === 'NC');
    const targetDet = (st === '1');
    const contactClosed = isNc ? !targetDet : targetDet;
    const post17 = ns.querySelector('#svg_17');
    if (post17) post17.style.display = isNc ? '' : 'none';
    const blade12 = ns.querySelector('#svg_12');
    if (blade12) {
      saveOrigAttrs(blade12, ['x1', 'y1', 'x2', 'y2']);
      if (contactClosed) {
        if (isNc && post17) {
          blade12.setAttribute('x1', '135');
          blade12.setAttribute('y1', '250');
          blade12.setAttribute('x2', '214');
          blade12.setAttribute('y2', '216');
        } else {
          blade12.setAttribute('x1', '135');
          blade12.setAttribute('y1', '250');
          blade12.setAttribute('x2', '208');
          blade12.setAttribute('y2', '250');
        }
      } else {
        if (isNc) {
          blade12.setAttribute('x1', '135');
          blade12.setAttribute('y1', '250');
          blade12.setAttribute('x2', '202');
          blade12.setAttribute('y2', '292');
        } else {
          blade12.setAttribute('x1', '135');
          blade12.setAttribute('y1', '250');
          blade12.setAttribute('x2', '205');
          blade12.setAttribute('y2', '208');
        }
      }
    }
  }

  g.classList.toggle('sim-switch-operated', st !== '0');
}
window.applyVisualSwitchPosition = applyVisualSwitchPosition;

function updateStarDeltaInternalHighlight(motor, mode) {
  if (!motor) return;
  upgradeComponentToInlineSvg(motor);
  const ns = motor.querySelector(':scope > svg:not(.select-box)');
  if (!ns) return;
  let pill = ns.querySelector('#svg_sd_active_pill');
  const starEl = ns.querySelector('#svg_star_sym');
  const slashEl = ns.querySelector('#svg_sd_slash');
  const deltaEl = ns.querySelector('#svg_delta_sym');
  if (!starEl || !deltaEl) {
    if (pill) pill.remove();
    return;
  }
  if (!mode || (mode !== 'STAR' && mode !== 'DELTA')) {
    if (pill) pill.remove();
    return;
  }
  const NS = 'http://www.w3.org/2000/svg';
  if (!pill) {
    pill = document.createElementNS(NS, 'rect');
    pill.setAttribute('id', 'svg_sd_active_pill');
    pill.setAttribute('width', '56');
    pill.setAttribute('height', '52');
    pill.setAttribute('rx', '12');
    pill.setAttribute('fill', '#06281e');
    pill.setAttribute('stroke', '#00e676');
    pill.setAttribute('stroke-width', '4.5');
    starEl.parentNode.insertBefore(pill, starEl);
  }
  const activeEl = mode === 'STAR' ? starEl : deltaEl;
  const cx = parseFloat(activeEl.getAttribute('x') || (mode === 'STAR' ? '248' : '332'));
  const cyBase = parseFloat(activeEl.getAttribute('y') || '394');
  pill.setAttribute('x', String(Math.round(cx - 28)));
  pill.setAttribute('y', String(Math.round(cyBase - 42)));
}
window.updateStarDeltaInternalHighlight = updateStarDeltaInternalHighlight;

function ensureComponentSimBadge(g, text, badgeClass) {
  let badge = g.querySelector(':scope > .sim-state-badge');
  if (!text) {
    if (badge) badge.remove();
    return;
  }
  const NS = 'http://www.w3.org/2000/svg';
  const vp = getComponentViewport(g.dataset.symbolFile || g.dataset.porttype || g.dataset.type || '');
  const badgeY = (vp && vp.h > 70) ? Math.round(44.5 + vp.h / 2 + 14) : 84;
  if (!badge) {
    badge = document.createElementNS(NS, 'text');
    badge.setAttribute('class', 'sim-state-badge');
    badge.setAttribute('x', '60');
    badge.setAttribute('y', String(badgeY));
    badge.setAttribute('text-anchor', 'middle');
    badge.setAttribute('font-size', '7.5');
    badge.setAttribute('font-weight', '700');
    badge.setAttribute('pointer-events', 'none');
    g.appendChild(badge);
  } else {
    badge.setAttribute('y', String(badgeY));
  }
  badge.setAttribute('class', 'sim-state-badge ' + (badgeClass || ''));
  badge.textContent = text;
}

function getInternalConductingPairs(g, effectiveState, sensorPowered = true) {
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
  // Pure Fuses (1P..4P): conduct when healthy (fuseState !== 'blown' and st === '0'), open when blown
  if (/^protection_fuse_[1234]p\.svg$/.test(asset)) {
    if (g.dataset.fuseState === 'blown' || st !== '0') return [];
    const poles = Math.floor(n / 2);
    const pairs = [];
    for (let i = 0; i < poles; i++) pairs.push([i, poles + i]);
    return pairs;
  }
  // Thermal Overload Relays (2P..3P): main power heater paths conduct unless open; tripping opens the linked 95-96 NC auxiliary contact (and if no external 95-96 contact is placed, can optionally interrupt or signal overload)
  if (/^protection_thermal_overload_relay_/.test(asset)) {
    // Check if an external auxiliary contact is linked to this overload relay
    const myRef = normalizeDeviceRef(g.dataset.ref);
    const myNum = (myRef.match(/(\d+)$/) || [])[1] || '';
    const hasLinkedAux = [...document.querySelectorAll('#dropLayer .dropped-symbol')].some(o => {
      if (o === g || classifySimComponent(o) !== 'aux_contact') return false;
      const oRef = normalizeDeviceRef(o.dataset.ref);
      const oAsset = getAssetBasename(o.dataset.symbolFile || o.dataset.porttype || o.dataset.type || '');
      return oRef === myRef || oAsset.includes('thermal') || (myNum && /^F(?:R)?\d+$/i.test(oRef) && oRef.endsWith(myNum));
    });
    // If tripped and no separate 95-96 control contact is on the sheet, open the overload relay path so standalone power-circuit overload tests also stop the motor
    if ((g.dataset.overloadState === 'tripped' || st !== '0') && !hasLinkedAux) return [];
    const poles = Math.floor(n / 2);
    const pairs = [];
    for (let i = 0; i < poles; i++) pairs.push([i, poles + i]);
    return pairs;
  }
  // Fuse Isolators (1P..4P): require both closed isolator blade (st === '1') AND healthy fuse link (fuseState !== 'blown')
  if (asset.startsWith('protection_fuse_isolator_')) {
    if (g.dataset.fuseState === 'blown' || st === '0') return [];
    const poles = Math.floor(n / 2);
    const pairs = [];
    for (let i = 0; i < poles; i++) pairs.push([i, poles + i]);
    return pairs;
  }
  // Circuit Breakers & Motor Circuit Breakers: require closed state (st === '1') and not tripped (breakerState !== 'tripped')
  if (asset.startsWith('protection_circuit_breaker_') || asset.startsWith('protection_motor_circuit_breaker_')) {
    if (g.dataset.breakerState === 'tripped' || st === '0') return [];
    const poles = Math.floor(n / 2);
    const pairs = [];
    for (let i = 0; i < poles; i++) pairs.push([i, poles + i]);
    return pairs;
  }
  // Proximity sensors: 3 terminals [0: BN (+V), 1: BK (Output), 2: BU (0V)]
  if (asset.startsWith('proximity_sensor_')) {
    if (!sensorPowered) return [];
    const cType = (g.dataset.sensorContact || (asset.includes('_nc') ? 'NC' : 'NO')).toUpperCase();
    const isNc = (cType === 'NC');
    const targetDet = (st === '1');
    const outputActive = isNc ? !targetDet : targetDet;
    if (!outputActive) return [];
    const pol = (g.dataset.sensorPolarity || (asset.includes('pnp') ? 'PNP' : 'NPN')).toUpperCase();
    if (pol === 'PNP') return [[0, 1]];
    // For NPN, standard output sinks BK (1) to BU (2, 0V).
    // If the user did not explicitly override polarity and wired their load between BK (1) and 0V/N (sourcing style),
    // detect if BK's external load is tied only to NEG/N and auto-source from BN (0) so user circuits work either way.
    if (g.dataset.sensorPolarityExplicit !== '1' && g.dataset.autoSourceLoad === '1') {
      return [[0, 1]];
    }
    return [[1, 2]];
  }
  // All NO switches, NO aux contacts, Main contacts (1P..4P)
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

function getSourceTerminalPotentials(g, energizedConverters) {
  const asset = getAssetBasename(g.dataset.symbolFile || g.dataset.porttype || g.dataset.type || '');
  if (asset === 'ac_to_dc_power_supply.svg') {
    if (!energizedConverters || energizedConverters.has(g.dataset.uid)) {
      return { 2: ['PE'], 3: ['POS'], 4: ['NEG'] };
    }
    return { 2: ['PE'] };
  }
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

function hasShortCircuitConflict(potSet) {
  if (!potSet || potSet.size < 2) return false;
  if (potSet.has('POS') && potSet.has('NEG')) return true;
  const phases = ['L', 'L1', 'L2', 'L3'].filter(p => potSet.has(p));
  if (phases.length > 0 && potSet.has('N')) return true;
  const threePhases = ['L1', 'L2', 'L3'].filter(p => potSet.has(p));
  if (threePhases.length >= 2) return true;
  return false;
}

function hasEarthFaultConflict(potSet) {
  // A neutral-to-PE bond can be intentional; treat energized line/DC conductors to PE as faults.
  return Boolean(potSet && potSet.has('PE') && [...potSet].some(p => p !== 'PE' && p !== 'N'));
}

function hasElectricalFaultConflict(potSet) {
  return hasShortCircuitConflict(potSet) || hasEarthFaultConflict(potSet);
}

function diagnoseThreePhaseMotor(g, phaseByTerminal, terminalPotentials, addDiagnostic) {
  const ref = g.dataset.ref || g.dataset.name || '3P MOTOR';
  const terminalNames = ['U', 'V', 'W'];
  const badIndex = terminalPotentials.findIndex(hasElectricalFaultConflict);
  let diagnostic;
  if (badIndex >= 0) {
    const p = terminalPotentials[badIndex] || new Set();
    const reason = hasEarthFaultConflict(p) ? 'EARTH FAULT' : 'SHORT CIRCUIT';
    diagnostic = { code: 'motor-terminal-fault', message: `${ref}: ${reason} at motor terminal ${terminalNames[badIndex]}.` };
  } else {
    const seen = new Map();
    const repeated = [];
    phaseByTerminal.forEach((phase, i) => {
      if (!phase) return;
      if (seen.has(phase)) repeated.push(`${phase} at ${terminalNames[seen.get(phase)]} and ${terminalNames[i]}`);
      else seen.set(phase, i);
    });
    if (repeated.length) {
      diagnostic = { code: 'motor-phase-miswire', message: `${ref}: PHASE MISWIRE — ${repeated.join(', ')}; use three distinct phases.` };
    } else {
      const missing = phaseByTerminal.map((phase, i) => phase ? '' : `${terminalNames[i]} (expected ${['L1', 'L2', 'L3'][i]})`).filter(Boolean);
      const hasAnyPhase = phaseByTerminal.some(Boolean);
      diagnostic = hasAnyPhase
        ? { code: 'motor-phase-loss', message: `${ref}: PHASE LOSS — no phase reaches ${missing.join(', ')}.` }
        : { code: 'motor-no-supply', message: `${ref}: NO SUPPLY — no three-phase power reaches U/V/W.` };
    }
  }
  addDiagnostic(diagnostic.code, diagnostic.message, 'fault');
  return diagnostic;
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
  const ar = Math.round(r * 0.92);
  // Red rotation-direction arrow along top arc indicating CW or CCW rotation
  const dirArrowMarkup = runningDir === 'CCW'
    ? `<path class="sim-motor-dir-arrow" d="M ${Math.round(ar * 0.55)} ${Math.round(-ar * 0.72)} A ${ar} ${ar} 0 0 0 ${Math.round(-ar * 0.55)} ${Math.round(-ar * 0.72)}" fill="none" stroke="#ff3030" stroke-width="12" stroke-linecap="round"/>
       <polygon class="sim-motor-dir-head" points="${Math.round(-ar * 0.55)},${Math.round(-ar * 0.72)} ${Math.round(-ar * 0.22)},${Math.round(-ar * 0.96)} ${Math.round(-ar * 0.28)},${Math.round(-ar * 0.50)}" fill="#ff3030" stroke="none"/>`
    : `<path class="sim-motor-dir-arrow" d="M ${Math.round(-ar * 0.55)} ${Math.round(-ar * 0.72)} A ${ar} ${ar} 0 0 1 ${Math.round(ar * 0.55)} ${Math.round(-ar * 0.72)}" fill="none" stroke="#ff3030" stroke-width="12" stroke-linecap="round"/>
       <polygon class="sim-motor-dir-head" points="${Math.round(ar * 0.55)},${Math.round(-ar * 0.72)} ${Math.round(ar * 0.22)},${Math.round(-ar * 0.96)} ${Math.round(ar * 0.28)},${Math.round(-ar * 0.50)}" fill="#ff3030" stroke="none"/>`;
  badge.innerHTML = `<g class="${spinClass}">
    <circle class="sim-rotor-ring" cx="0" cy="0" r="${Math.round(r)}" fill="none" stroke="#22c55e" stroke-width="11" stroke-dasharray="${Math.round(r * 0.65)} ${Math.round(r * 0.48)}" stroke-linecap="round"/>
  </g>${dirArrowMarkup}`;
}

// ============================================================================
// Deterministic Simulation Clock & Industrial Timer State Engine (TON / TOF / TON-TOF)
// ============================================================================
window.__escTimerStateMap = window.__escTimerStateMap || new Map();
window.__escSimClockMs = 0;
window.__escLastTickWallMs = 0;
window.__escSimClockInterval = null;

function resetSimulationTimers() {
  window.__escTimerStateMap.clear();
  window.__escActiveCoils = new Set();
  window.__escActiveCoilRefs = new Set();
  window.__escSimClockMs = 0;
  window.__escLastTickWallMs = Date.now();
}

function stepSimulationTimers(dtMs) {
  if (!running || dtMs <= 0) return false;
  window.__escSimClockMs += dtMs;
  let anyChanged = false;
  const comps = [...document.querySelectorAll('#dropLayer .dropped-symbol')];
  comps.forEach(g => {
    if (classifySimComponent(g) !== 'coil') return;
    const asset = getAssetBasename(g.dataset.symbolFile || g.dataset.porttype || g.dataset.type || '');
    if (!/timer/.test(asset)) return;
    const uid = g.dataset.uid;
    const st = window.__escTimerStateMap.get(uid);
    if (!st) return;
    const tonMs = Math.max(0, (parseFloat(g.dataset.tonDelay) || 3) * 1000);
    const tofMs = Math.max(0, (parseFloat(g.dataset.tofDelay) || 3) * 1000);

    if (asset === 'coil_ton_timer.svg') {
      if (st.energized && !st.tonDone) {
        st.elapsedTonMs = Math.min(tonMs, (st.elapsedTonMs || 0) + dtMs);
        anyChanged = true;
        if (st.elapsedTonMs >= tonMs) {
          st.tonDone = true;
        }
      }
    } else if (asset === 'coil_tof_timer.svg') {
      if (!st.energized && st.tofActive) {
        st.elapsedTofMs = Math.min(tofMs, (st.elapsedTofMs || 0) + dtMs);
        anyChanged = true;
        if (st.elapsedTofMs >= tofMs) {
          st.tofActive = false;
        }
      }
    } else if (asset === 'coil_ton_tof_timer.svg') {
      if (st.energized && !st.tonDone) {
        st.elapsedTonMs = Math.min(tonMs, (st.elapsedTonMs || 0) + dtMs);
        anyChanged = true;
        if (st.elapsedTonMs >= tonMs) {
          st.tonDone = true;
          st.tofActive = true;
          st.elapsedTofMs = 0;
        }
      } else if (!st.energized && st.tofActive) {
        st.elapsedTofMs = Math.min(tofMs, (st.elapsedTofMs || 0) + dtMs);
        anyChanged = true;
        if (st.elapsedTofMs >= tofMs) {
          st.tofActive = false;
        }
      }
    }
  });
  if (anyChanged) {
    evaluateCircuitSimulation();
  }
  return anyChanged;
}

window.advanceSimulationTime = function(ms) {
  const step = 100;
  let rem = Number(ms) || 0;
  while (rem > 0) {
    const dt = Math.min(step, rem);
    stepSimulationTimers(dt);
    rem -= dt;
  }
  evaluateCircuitSimulation();
};

function startSimClockLoop() {
  stopSimClockLoop();
  window.__escLastTickWallMs = Date.now();
  window.__escSimClockInterval = window.setInterval(() => {
    if (!running) return;
    const now = Date.now();
    const dt = Math.max(0, Math.min(500, now - (window.__escLastTickWallMs || now)));
    window.__escLastTickWallMs = now;
    if (dt > 0) stepSimulationTimers(dt);
  }, 100);
}

function stopSimClockLoop() {
  if (window.__escSimClockInterval) {
    clearInterval(window.__escSimClockInterval);
    window.__escSimClockInterval = null;
  }
}

function renderSimulationDiagnostics(diagnostics = [], active = running) {
  const panel = document.getElementById('simulationDiagnostics');
  const list = document.getElementById('diagnosticList');
  const faults = active && Array.isArray(diagnostics) ? diagnostics.filter(item => item && item.severity !== 'info') : [];
  if (!panel || !list) return;
  panel.hidden = faults.length === 0;
  if (!faults.length) {
    list.replaceChildren();
    return;
  }
  const rows = faults.map(item => {
    const row = document.createElement('div');
    row.className = 'diagnostic-item';
    row.textContent = item.message;
    return row;
  });
  list.replaceChildren(...rows);
}
window.renderSimulationDiagnostics = renderSimulationDiagnostics;

// Compute static conductor identification from connected source terminals even in edit mode or de-energised branches
function updateWireConductorIdentification(livePotentialsMap = window.__escLastNodePotentials) {
  const wires = [...document.querySelectorAll('#wireLayer .connected-wire')];
  const keyOf = (uid, idx) => `${uid}:${idx}`;
  const wireColourClasses = ['wire-dc-positive', 'wire-dc-negative', 'wire-l1', 'wire-l2', 'wire-l3', 'wire-l', 'wire-neutral', 'wire-pe', 'wire-deenergized'];

  // Before simulation (when Run tab is OFF), all wires strictly use the user's chosen Wire Colour.
  // Phase / polarity colours (L1, L2, L3, L, N, PE, +VE, -VE) apply ONLY when Simulation Run is ON.
  const isSimRunning = Boolean(running && document.body.classList.contains('live'));
  if (!isSimRunning) {
    wires.forEach(w => {
      w.classList.remove('wire-live', ...wireColourClasses);
      w.style.removeProperty('stroke');
    });
    return;
  }

  wires.forEach(w => {
    w.classList.remove('wire-live', ...wireColourClasses);
    w.style.removeProperty('stroke');

    const fromG = w.dataset.fromG;
    const toG = w.dataset.toG;
    const aG = fromG ? document.querySelector(`#dropLayer .dropped-symbol[data-uid="${fromG}"]`) : null;
    const bG = toG ? document.querySelector(`#dropLayer .dropped-symbol[data-uid="${toG}"]`) : null;
    const pA = aG ? resolveComponentPort(aG, w.dataset.fromIndex, w.dataset.from) : null;
    const pB = bG ? resolveComponentPort(bG, w.dataset.toIndex, w.dataset.to) : null;
    const nodeKeyA = (fromG && pA) ? keyOf(fromG, pA.index) : '';
    const nodeKeyB = (toG && pB) ? keyOf(toG, pB.index) : '';

    const livePots = new Set();
    if (livePotentialsMap) {
      if (nodeKeyA && livePotentialsMap.has(nodeKeyA)) {
        livePotentialsMap.get(nodeKeyA).forEach(p => livePots.add(p));
      }
      if (nodeKeyB && livePotentialsMap.has(nodeKeyB)) {
        livePotentialsMap.get(nodeKeyB).forEach(p => livePots.add(p));
      }
    }

    let cClass = '';
    if (livePots.has('PE')) cClass = 'wire-pe';
    else if (livePots.has('L1')) cClass = 'wire-l1';
    else if (livePots.has('L2')) cClass = 'wire-l2';
    else if (livePots.has('L3')) cClass = 'wire-l3';
    else if (livePots.has('L')) cClass = 'wire-l';
    else if (livePots.has('POS')) cClass = 'wire-dc-positive';
    else if (livePots.has('NEG')) cClass = 'wire-dc-negative';
    else if (livePots.has('N')) cClass = 'wire-neutral';

    if (livePots.size > 0 && cClass) {
      w.classList.add('wire-live', cClass);
    } else {
      w.classList.add('wire-deenergized');
    }
  });
}
window.updateWireConductorIdentification = updateWireConductorIdentification;

function evaluateCircuitSimulation() {
  const comps = [...document.querySelectorAll('#dropLayer .dropped-symbol')];
  const wires = [...document.querySelectorAll('#wireLayer .connected-wire')];
  comps.forEach(upgradeComponentToInlineSvg);

  if (!running) {
    stopSimClockLoop();
    resetSimulationTimers();
    comps.forEach(g => {
      g.classList.remove(
        'device-on', 'sim-energized', 'sim-blinking',
        'motor-rotating-cw', 'motor-rotating-ccw', 'motor-direction-unknown',
        'motor-mode-star', 'motor-mode-delta', 'motor-secondary-open-warn',
        'sim-switch-operated', 'sim-timer-timing', 'sim-timer-done'
      );
      updateStarDeltaInternalHighlight(g, null);
      g.style.removeProperty('--sim-active-color');
      // Preserve latched faults (fuseState === 'blown', breakerState === 'tripped', manual overloadState === 'tripped')
      // while resetting transient switch/coil/sensor simulation states
      const sub = classifyProtectionSubkind(g);
      if (sub === 'overload_relay' && g.dataset.resetMode === 'auto') {
        g.dataset.overloadState = 'normal';
      }
      const isBlown = g.dataset.fuseState === 'blown';
      const isTripped = g.dataset.breakerState === 'tripped' || g.dataset.overloadState === 'tripped';
      g.classList.toggle('sim-fuse-blown', isBlown);
      g.classList.toggle('sim-fault-tripped', isTripped);
      if (isBlown) ensureComponentSimBadge(g, 'BLOWN', 'badge-fault');
      else if (isTripped) ensureComponentSimBadge(g, 'TRIPPED', 'badge-fault');
      else ensureComponentSimBadge(g, '', '');

      delete g.dataset.simState;
      delete g.dataset.simEffectiveState;
      delete g.dataset.simManualOverride;
      delete g.dataset.targetDetected;
      applyVisualSwitchPosition(g, '0');
      ensureMotorRotorOverlay(g, null);
    });
    window.__escLastNodePotentials = null;
    updateWireConductorIdentification(null);
    if (motorState) motorState.textContent = 'Motor: OFF';
    renderSimulationDiagnostics([], false);
    return;
  }

  const keyOf = (uid, idx) => `${uid}:${idx}`;
  const diagnostics = [];
  const diagnosticKeys = new Set();
  const addDiagnostic = (code, message, severity = 'fault') => {
    const key = `${code}|${message}`;
    if (diagnosticKeys.has(key)) return;
    diagnosticKeys.add(key);
    diagnostics.push({ code, message, severity });
  };

  // Collect tripped Thermal Overload Relay references (e.g., F1)
  const getTrippedOverloadRefs = () => {
    const set = new Set();
    comps.forEach(g => {
      if (classifyProtectionSubkind(g) === 'overload_relay' && (g.dataset.overloadState === 'tripped' || g.dataset.simState === '1')) {
        const r = normalizeDeviceRef(g.dataset.ref);
        if (r) set.add(r);
      }
    });
    return set;
  };

  // Multi-pass fixed-point solver (up to 6 passes) for coils, holding contacts, timers, overload contacts, and proximity sensors
  let energizedCoils = new Set(window.__escActiveCoils || []);
  let energizedCoilRefs = new Set(window.__escActiveCoilRefs || []);
  let timerContactActiveRefs = { onDelay: new Set(), offDelay: new Set() };
  let poweredSensors = new Set();
  let energizedConverters = new Set();
  let nodePotentials = new Map();
  let adj = new Map();

  for (let pass = 0; pass < 6; pass++) {
    const trippedOverloadRefs = getTrippedOverloadRefs();
    nodePotentials = new Map();
    adj = new Map();
    const addEdge = (a, b) => {
      if (!adj.has(a)) adj.set(a, []);
      if (!adj.has(b)) adj.set(b, []);
      adj.get(a).push(b);
      adj.get(b).push(a);
    };

    // 1. External wire edges
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

    // 2. Effective state of each component and internal conducting pairs
    comps.forEach(g => {
      const uid = g.dataset.uid;
      const kind = classifySimComponent(g);
      const asset = getAssetBasename(g.dataset.symbolFile || g.dataset.porttype || g.dataset.type || '');
      let effState = g.dataset.simState || '0';

      if (kind === 'proximity') {
        effState = (g.dataset.targetDetected === '1' || g.dataset.simState === '1') ? '1' : '0';
      } else if (kind === 'protection') {
        const sub = classifyProtectionSubkind(g);
        if (sub === 'fuse') {
          effState = g.dataset.fuseState === 'blown' ? '1' : '0';
        } else if (sub === 'overload_relay') {
          effState = (g.dataset.overloadState === 'tripped' || g.dataset.simState === '1') ? '1' : '0';
        } else if (sub === 'fuse_isolator') {
          effState = (g.dataset.fuseState !== 'blown' && g.dataset.simState === '1') ? '1' : '0';
        } else {
          // circuit_breaker / mcb_motor
          if (g.dataset.breakerState === 'tripped') effState = '0';
          else if (g.dataset.breakerState === 'closed') effState = '1';
          else effState = g.dataset.simState || '0';
        }
      } else if ((kind === 'aux_contact' || kind === 'main_contact') && g.dataset.simManualOverride !== '1') {
        const ref = normalizeDeviceRef(g.dataset.ref);
        const numMatch = ref.match(/(\d+)$/);
        const numSuffix = numMatch ? numMatch[1] : '';
        const isOverloadContact = (g.dataset.contactRole === 'overload') || asset.includes('thermal') || /^F(?:R)?\d*$/i.test(ref) || trippedOverloadRefs.has(ref);

        if (isOverloadContact && kind === 'aux_contact') {
          // Linked to Thermal Overload Relay (95-96 NC opens when tripped; 97-98 NO closes when tripped)
          const anyOverloadTripped = trippedOverloadRefs.has(ref) ||
            (numSuffix && [...trippedOverloadRefs].some(r => r.endsWith(numSuffix))) ||
            (trippedOverloadRefs.size > 0 && comps.filter(c => classifyProtectionSubkind(c) === 'overload_relay').length === 1);
          effState = anyOverloadTripped ? '1' : '0';
        } else if (asset.includes('on_delay')) {
          const matched = timerContactActiveRefs.onDelay.has(ref) ||
            (numSuffix && [...timerContactActiveRefs.onDelay].some(r => r.endsWith(numSuffix)));
          effState = matched ? '1' : '0';
        } else if (asset.includes('off_delay')) {
          const matched = timerContactActiveRefs.offDelay.has(ref) ||
            (numSuffix && [...timerContactActiveRefs.offDelay].some(r => r.endsWith(numSuffix)));
          effState = matched ? '1' : '0';
        } else {
          // Standard contactor/relay main or auxiliary contact
          const coilLinked = energizedCoilRefs.has(ref) ||
            (numSuffix && [...energizedCoilRefs].some(cr => cr.endsWith(numSuffix))) ||
            (energizedCoils.size === 1 && comps.filter(c => classifySimComponent(c) === 'coil').length === 1);
          effState = coilLinked ? '1' : '0';
        }
      }

      g.dataset.simEffectiveState = effState;
      applyVisualSwitchPosition(g, effState);

      const isSensPow = kind === 'proximity' ? poweredSensors.has(uid) : true;
      const pairs = getInternalConductingPairs(g, effState, isSensPow);
      pairs.forEach(([iA, iB]) => {
        addEdge(keyOf(uid, iA), keyOf(uid, iB));
      });
    });

    // 3. Inject potentials from sources and propagate via BFS
    const queue = [];
    comps.forEach(g => {
      if (classifySimComponent(g) !== 'source') return;
      const uid = g.dataset.uid;
      const srcMap = getSourceTerminalPotentials(g, energizedConverters);
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

    // 3b. Detect direct short circuits on any conducting protective device and automatically blow fuse / trip breaker
    let faultClearedInPass = false;
    comps.forEach(g => {
      if (classifySimComponent(g) !== 'protection') return;
      const sub = classifyProtectionSubkind(g);
      const uid = g.dataset.uid;
      const pairs = getInternalConductingPairs(g, g.dataset.simEffectiveState || '0', true);
      if (!pairs.length) return;
      for (const [iA] of pairs) {
        const pSet = nodePotentials.get(keyOf(uid, iA));
        if (hasShortCircuitConflict(pSet)) {
          if (sub === 'fuse' || sub === 'fuse_isolator') {
            g.dataset.fuseState = 'blown';
            g.dataset.simTripCause = 'short-circuit';
            g.dataset.simState = '0';
            faultClearedInPass = true;
            if (state) state.textContent = `FAULT • SHORT CIRCUIT CLEARED BY FUSE ${g.dataset.ref || ''}`;
          } else if (sub === 'circuit_breaker' || sub === 'mcb_motor') {
            g.dataset.breakerState = 'tripped';
            g.dataset.simTripCause = 'short-circuit';
            g.dataset.simState = '0';
            faultClearedInPass = true;
            if (state) state.textContent = `FAULT • SHORT CIRCUIT TRIPPED BREAKER ${g.dataset.ref || ''}`;
          }
          break;
        }
      }
    });
    if (faultClearedInPass) continue;

    // 3c. Evaluate AC-to-DC Power Supplies (L = port 0, N = port 1 -> outputs + = port 3, - = port 4)
    const nextEnergizedConverters = new Set();
    comps.forEach(g => {
      const asset = getAssetBasename(g.dataset.symbolFile || g.dataset.porttype || g.dataset.type || '');
      if (asset !== 'ac_to_dc_power_supply.svg') return;
      const uid = g.dataset.uid;
      const hasAcInputWires = ((adj.get(keyOf(uid, 0)) || []).length > 0) || ((adj.get(keyOf(uid, 1)) || []).length > 0);
      const sL = nodePotentials.get(keyOf(uid, 0)) || new Set();
      const sN = nodePotentials.get(keyOf(uid, 1)) || new Set();
      if (!hasAcInputWires || (hasEnergizingPotentialDiff(sL, sN) && !hasShortCircuitConflict(sL))) {
        nextEnergizedConverters.add(uid);
      }
    });
    energizedConverters = nextEnergizedConverters;

    // 4. Evaluate proximity sensor power supply (BN = port 0, BU = port 2)
    const nextPoweredSensors = new Set();
    comps.forEach(g => {
      if (classifySimComponent(g) !== 'proximity') return;
      const uid = g.dataset.uid;
      const sBN = nodePotentials.get(keyOf(uid, 0)) || new Set();
      const sBU = nodePotentials.get(keyOf(uid, 2)) || new Set();
      const validDc = (sBN.has('POS') && sBU.has('NEG')) || (sBN.has('NEG') && sBU.has('POS'));
      const validAc = ((sBN.has('L') || sBN.has('L1') || sBN.has('L2') || sBN.has('L3')) && sBU.has('N')) ||
                      (sBN.has('N') && (sBU.has('L') || sBU.has('L1') || sBU.has('L2') || sBU.has('L3')));
      if (validDc || validAc) nextPoweredSensors.add(uid);

      // Check if a 2-terminal load/coil connected to BK (port 1) has its opposite terminal tied to NEG/N (and not POS/L)
      if (g.dataset.sensorPolarityExplicit !== '1') {
        const bkKey = keyOf(uid, 1);
        const bkNeighbors = adj.get(bkKey) || [];
        let needsSource = false;
        let needsSink = false;
        comps.forEach(other => {
          const oKind = classifySimComponent(other);
          if (oKind !== 'load' && oKind !== 'coil') return;
          const oUid = other.dataset.uid;
          const k0 = keyOf(oUid, 0), k1 = keyOf(oUid, 1);
          const p0 = nodePotentials.get(k0) || new Set();
          const p1 = nodePotentials.get(k1) || new Set();
          if (bkNeighbors.includes(k0)) {
            if (p1.has('POS') || p1.has('L') || p1.has('L1') || p1.has('L2') || p1.has('L3')) needsSink = true;
            else if (p1.has('NEG') || p1.has('N')) needsSource = true;
          } else if (bkNeighbors.includes(k1)) {
            if (p0.has('POS') || p0.has('L') || p0.has('L1') || p0.has('L2') || p0.has('L3')) needsSink = true;
            else if (p0.has('NEG') || p0.has('N')) needsSource = true;
          }
        });
        g.dataset.autoSourceLoad = (needsSource && !needsSink) ? '1' : '0';
      }
    });
    poweredSensors = nextPoweredSensors;

    // 5. Evaluate Coils and Industrial Timers
    const nextCoils = new Set();
    const nextRefs = new Set();
    const nextTimerOnDelay = new Set();
    const nextTimerOffDelay = new Set();

    comps.forEach(g => {
      if (classifySimComponent(g) !== 'coil') return;
      const uid = g.dataset.uid;
      const asset = getAssetBasename(g.dataset.symbolFile || g.dataset.porttype || g.dataset.type || '');
      const ref = normalizeDeviceRef(g.dataset.ref);
      const s0 = nodePotentials.get(keyOf(uid, 0)) || new Set();
      const s1 = nodePotentials.get(keyOf(uid, 1)) || new Set();
      const isEnergized = hasEnergizingPotentialDiff(s0, s1) && !hasElectricalFaultConflict(s0) && !hasElectricalFaultConflict(s1);

      if (!/timer/.test(asset)) {
        // Instantaneous Contactor / Relay Coil
        if (isEnergized) {
          nextCoils.add(uid);
          if (ref) nextRefs.add(ref);
        }
      } else {
        // Industrial Timer Coil (TON, TOF, TON/TOF)
        const tonMs = Math.max(0, (parseFloat(g.dataset.tonDelay) || 3) * 1000);
        const tofMs = Math.max(0, (parseFloat(g.dataset.tofDelay) || 3) * 1000);
        let tState = window.__escTimerStateMap.get(uid);
        if (!tState) {
          tState = { energized: false, elapsedTonMs: 0, tonDone: false, elapsedTofMs: 0, tofActive: false };
          window.__escTimerStateMap.set(uid, tState);
        }

        if (asset === 'coil_ton_timer.svg') {
          if (isEnergized) {
            if (!tState.energized) {
              tState.energized = true;
              if (tonMs <= 0) tState.tonDone = true;
            }
            if (tState.tonDone) {
              nextCoils.add(uid);
              if (ref) { nextRefs.add(ref); nextTimerOnDelay.add(ref); }
            }
          } else {
            tState.energized = false;
            tState.elapsedTonMs = 0;
            tState.tonDone = false;
          }
        } else if (asset === 'coil_tof_timer.svg') {
          if (isEnergized) {
            tState.energized = true;
            tState.tofActive = true;
            tState.elapsedTofMs = 0;
          } else {
            if (tState.energized) {
              tState.energized = false;
              if (tofMs <= 0) tState.tofActive = false;
            }
          }
          if (tState.tofActive) {
            nextCoils.add(uid);
            if (ref) { nextRefs.add(ref); nextTimerOffDelay.add(ref); }
          }
        } else if (asset === 'coil_ton_tof_timer.svg') {
          if (isEnergized) {
            if (!tState.energized) {
              tState.energized = true;
              if (tonMs <= 0) { tState.tonDone = true; tState.tofActive = true; }
            }
          } else {
            if (tState.energized) {
              tState.energized = false;
              tState.elapsedTonMs = 0;
              tState.tonDone = false;
              if (tofMs <= 0) tState.tofActive = false;
            }
          }
          if (tState.tonDone) {
            nextCoils.add(uid);
            if (ref) { nextRefs.add(ref); nextTimerOnDelay.add(ref); }
          }
          if (tState.tofActive) {
            nextCoils.add(uid);
            if (ref) { nextRefs.add(ref); nextTimerOffDelay.add(ref); }
          }
        }
      }
    });

    energizedCoils = nextCoils;
    energizedCoilRefs = nextRefs;
    timerContactActiveRefs = { onDelay: nextTimerOnDelay, offDelay: nextTimerOffDelay };
  }
  window.__escActiveCoils = energizedCoils;
  window.__escActiveCoilRefs = energizedCoilRefs;

  const componentsByUid = new Map(comps.map(g => [g.dataset.uid, g]));
  const describeNode = nodeKey => {
    const splitAt = nodeKey.lastIndexOf(':');
    const g = componentsByUid.get(nodeKey.slice(0, splitAt));
    if (!g) return 'an unidentified connection';
    const port = resolveComponentPort(g, Number(nodeKey.slice(splitAt + 1)));
    return `${g.dataset.ref || g.dataset.name || 'Component'}:${port?.label || 'terminal'}`;
  };
  const reportedPotentialFaults = new Set();
  nodePotentials.forEach((potentials, nodeKey) => {
    const phases = ['L1', 'L2', 'L3'].filter(p => potentials.has(p));
    const line = ['L', 'L1', 'L2', 'L3'].find(p => potentials.has(p));
    let shortCode = '';
    let shortText = '';
    if (potentials.has('POS') && potentials.has('NEG')) {
      shortCode = 'dc-short'; shortText = 'DC positive-to-negative short circuit';
    } else if (phases.length > 1) {
      shortCode = 'phase-short'; shortText = `phase-to-phase short circuit (${phases.join(' + ')})`;
    } else if (line && potentials.has('N')) {
      shortCode = 'line-neutral-short'; shortText = `${line}-to-neutral short circuit`;
    }
    if (shortCode && hasShortCircuitConflict(potentials)) {
      const signature = `${shortCode}|${[...potentials].sort().join(',')}`;
      if (!reportedPotentialFaults.has(signature)) {
        reportedPotentialFaults.add(signature);
        addDiagnostic(shortCode, `SHORT CIRCUIT — ${shortText} at ${describeNode(nodeKey)}.`);
      }
    }
    if (hasEarthFaultConflict(potentials)) {
      const conductors = [...potentials].filter(p => p !== 'PE' && p !== 'N').sort();
      const signature = `earth-fault|${conductors.join(',')}`;
      if (!reportedPotentialFaults.has(signature)) {
        reportedPotentialFaults.add(signature);
        addDiagnostic('earth-fault', `EARTH FAULT — ${conductors.join(' / ')} is connected to PE at ${describeNode(nodeKey)}.`);
      }
    }
  });
  comps.forEach(g => {
    if (classifySimComponent(g) !== 'protection') return;
    const ref = g.dataset.ref || g.dataset.name || 'Protection device';
    const sub = classifyProtectionSubkind(g);
    if (sub === 'fuse' && g.dataset.fuseState === 'blown') {
      const message = g.dataset.simTripCause === 'short-circuit'
        ? `SHORT CIRCUIT — ${ref} fuse opened to interrupt the fault; check the wiring before replacement.`
        : `${ref}: fuse is blown; the protected circuit is open.`;
      addDiagnostic('fuse-open', message, g.dataset.simTripCause === 'short-circuit' ? 'fault' : 'warning');
    } else if (g.dataset.breakerState === 'tripped') {
      const message = g.dataset.simTripCause === 'short-circuit'
        ? `SHORT CIRCUIT — ${ref} tripped to interrupt the fault; clear the wiring fault before reset.`
        : `${ref}: circuit breaker tripped; reset it after checking the circuit.`;
      addDiagnostic('breaker-tripped', message, g.dataset.simTripCause === 'short-circuit' ? 'fault' : 'warning');
    } else if (g.dataset.overloadState === 'tripped') {
      addDiagnostic('overload-tripped', `${ref}: thermal overload relay tripped; reset it after checking the motor load.`, 'warning');
    }
  });

  // 6. Apply visual state to Coils, Timers, Loads, Protections, Proximity Sensors, and Motors
  const motorResults = [];

  comps.forEach(g => {
    const uid = g.dataset.uid;
    const kind = classifySimComponent(g);
    const asset = getAssetBasename(g.dataset.symbolFile || g.dataset.porttype || g.dataset.type || '');
    g.classList.remove(
      'device-on', 'sim-energized', 'sim-blinking',
      'motor-rotating-cw', 'motor-rotating-ccw', 'motor-direction-unknown',
      'motor-mode-star', 'motor-mode-delta', 'motor-secondary-open-warn',
      'sim-fuse-blown', 'sim-fault-tripped', 'sim-timer-timing', 'sim-timer-done'
    );
    g.style.removeProperty('--sim-active-color');
    ensureMotorRotorOverlay(g, null);
    updateStarDeltaInternalHighlight(g, null);
    ensureComponentSimBadge(g, '', '');

    if (asset === 'ac_to_dc_power_supply.svg') {
      const isConvOn = energizedConverters.has(uid);
      if (isConvOn) {
        g.classList.add('device-on');
      }
    } else if (kind === 'protection') {
      const sub = classifyProtectionSubkind(g);
      if (g.dataset.fuseState === 'blown') {
        g.classList.add('sim-fuse-blown');
        ensureComponentSimBadge(g, 'BLOWN', 'badge-fault');
      } else if (g.dataset.breakerState === 'tripped' || g.dataset.overloadState === 'tripped' || (sub === 'overload_relay' && g.dataset.simEffectiveState === '1')) {
        g.classList.add('sim-fault-tripped');
        ensureComponentSimBadge(g, 'TRIPPED', 'badge-fault');
      }
    } else if (kind === 'coil' || kind === 'load') {
      const s0 = nodePotentials.get(keyOf(uid, 0)) || new Set();
      const s1 = nodePotentials.get(keyOf(uid, 1)) || new Set();
      const isOn = hasEnergizingPotentialDiff(s0, s1) && !hasElectricalFaultConflict(s0) && !hasElectricalFaultConflict(s1);
      const chosenColor = g.dataset.simColor || window.getEscLoadSimColor(g.dataset.symbolFile || '');

      if (/timer/.test(asset)) {
        const tState = window.__escTimerStateMap.get(uid);
        const tonMs = Math.max(0, (parseFloat(g.dataset.tonDelay) || 3) * 1000);
        const tofMs = Math.max(0, (parseFloat(g.dataset.tofDelay) || 3) * 1000);
        if (asset === 'coil_ton_timer.svg' && tState) {
          if (tState.tonDone) {
            g.classList.add('device-on', 'sim-energized', 'sim-timer-done');
            g.style.setProperty('--sim-active-color', chosenColor);
            ensureComponentSimBadge(g, `TON ${(tonMs/1000).toFixed(1)}s ✓`, 'badge-ok');
          } else if (tState.energized) {
            g.classList.add('device-on', 'sim-energized', 'sim-timer-timing');
            g.style.setProperty('--sim-active-color', '#f59e0b');
            const rem = Math.max(0, (tonMs - (tState.elapsedTonMs || 0)) / 1000);
            ensureComponentSimBadge(g, `TON ${rem.toFixed(1)}s`, 'badge-warn');
          }
        } else if (asset === 'coil_tof_timer.svg' && tState) {
          if (tState.energized && tState.tofActive) {
            g.classList.add('device-on', 'sim-energized', 'sim-timer-done');
            g.style.setProperty('--sim-active-color', chosenColor);
            ensureComponentSimBadge(g, `TOF ARMED`, 'badge-ok');
          } else if (!tState.energized && tState.tofActive) {
            g.classList.add('device-on', 'sim-energized', 'sim-timer-timing');
            g.style.setProperty('--sim-active-color', '#f59e0b');
            const rem = Math.max(0, (tofMs - (tState.elapsedTofMs || 0)) / 1000);
            ensureComponentSimBadge(g, `TOF ${rem.toFixed(1)}s`, 'badge-warn');
          }
        } else if (tState && (tState.energized || tState.tofActive)) {
          g.classList.add('device-on', 'sim-energized');
          g.style.setProperty('--sim-active-color', chosenColor);
          ensureComponentSimBadge(g, tState.tonDone ? 'DONE' : 'TIMING', 'badge-ok');
        }
      } else if (isOn) {
        g.classList.add('device-on', 'sim-energized');
        if (asset.includes('blinking')) g.classList.add('sim-blinking');
        g.style.setProperty('--sim-active-color', chosenColor);
      }
    } else if (kind === 'proximity') {
      const sBN = nodePotentials.get(keyOf(uid, 0)) || new Set();
      const sBU = nodePotentials.get(keyOf(uid, 2)) || new Set();
      const powered = (sBN.has('POS') && sBU.has('NEG')) || (sBN.has('NEG') && sBU.has('POS')) ||
        ((sBN.has('L') || sBN.has('L1') || sBN.has('L2') || sBN.has('L3')) && sBU.has('N')) ||
        (sBN.has('N') && (sBU.has('L') || sBU.has('L1') || sBU.has('L2') || sBU.has('L3')));
      const pol = (g.dataset.sensorPolarity || (asset.includes('pnp') ? 'PNP' : 'NPN')).toUpperCase();
      const det = (g.dataset.targetDetected === '1' || g.dataset.simState === '1');
      if (powered) {
        g.classList.add('device-on', 'sim-energized');
        g.style.setProperty('--sim-active-color', det ? '#22c55e' : '#00e5ff');
        ensureComponentSimBadge(g, `${pol} • ${det ? 'TARGET' : 'READY'}`, det ? 'badge-ok' : '');
      } else {
        ensureComponentSimBadge(g, `${pol} • NO PWR`, '');
      }
    } else if (kind === 'motor') {
      const overrideDir = (g.dataset.motorDir || 'auto').toUpperCase();
      if (asset.includes('dc_motor')) {
        const s0 = nodePotentials.get(keyOf(uid, 0)) || new Set();
        const s1 = nodePotentials.get(keyOf(uid, 1)) || new Set();
        const ref = g.dataset.ref || g.dataset.name || 'DC Motor';
        const armatureFault = hasElectricalFaultConflict(s0) || hasElectricalFaultConflict(s1);
        if (armatureFault) {
          const reason = hasEarthFaultConflict(s0) || hasEarthFaultConflict(s1) ? 'EARTH FAULT' : 'SHORT CIRCUIT';
          addDiagnostic('dc-motor-terminal-fault', `${ref}: ${reason} at the armature terminals.`);
          ensureComponentSimBadge(g, reason, 'badge-fault');
          g.classList.add('motor-direction-unknown');
          motorResults.push(`${ref}: STOPPED • ${reason}`);
          return;
        }
        const armatureEnergized = hasEnergizingPotentialDiff(s0, s1);
        if (armatureEnergized && g.dataset.motorFieldModel === 'wound') {
          const defs = portsFor(g);
          const f1Index = defs.findIndex(p => /^(F1|F\+|FIELD1|FIELD\+)$/.test(String(p.label || '').toUpperCase()));
          const f2Index = defs.findIndex(p => /^(F2|F-|FIELD2|FIELD-)$/.test(String(p.label || '').toUpperCase()));
          const f1 = f1Index >= 0 ? (nodePotentials.get(keyOf(uid, f1Index)) || new Set()) : new Set();
          const f2 = f2Index >= 0 ? (nodePotentials.get(keyOf(uid, f2Index)) || new Set()) : new Set();
          const fieldPowered = (f1.has('POS') && f2.has('NEG')) || (f1.has('NEG') && f2.has('POS'));
          if (!fieldPowered) {
            addDiagnostic('dc-field-loss', `${ref}: FIELD LOSS — the armature is supplied but F1/F2 have no DC field supply.`);
            ensureComponentSimBadge(g, 'FIELD LOSS', 'badge-fault');
            g.classList.add('motor-direction-unknown');
            motorResults.push(`${ref}: STOPPED • FIELD LOSS`);
            return;
          }
        }
        const cw = (s0.has('POS') && s1.has('NEG')) || ((s0.has('L') || s0.has('L1')) && s1.has('N'));
        const ccw = (s0.has('NEG') && s1.has('POS')) || (s0.has('N') && (s1.has('L') || s1.has('L1')));
        if (cw || ccw) {
          const finalDir = (overrideDir === 'CW' || overrideDir === 'CCW') ? overrideDir : (cw ? 'CW' : 'CCW');
          g.classList.add('device-on', 'sim-energized', finalDir === 'CW' ? 'motor-rotating-cw' : 'motor-rotating-ccw');
          g.style.setProperty('--sim-active-color', '#22c55e');
          ensureMotorRotorOverlay(g, finalDir);
          motorResults.push(`${g.dataset.ref || g.dataset.name || 'DC Motor'}: RUNNING (${finalDir === 'CW' ? 'CLOCKWISE' : 'ANTICLOCKWISE'})`);
        } else {
          g.classList.add('motor-direction-unknown');
          if (s0.size || s1.size) {
            addDiagnostic('dc-motor-wiring', `${ref}: INVALID SUPPLY — connect opposite DC polarities to A1/A2.`, 'warning');
            ensureComponentSimBadge(g, 'CHECK SUPPLY', 'badge-warn');
            motorResults.push(`${ref}: STOPPED • CHECK DC SUPPLY`);
          } else motorResults.push(`${ref}: OFF`);
        }
      } else if (asset.includes('single_phase')) {
        const s0 = nodePotentials.get(keyOf(uid, 0)) || new Set();
        const s1 = nodePotentials.get(keyOf(uid, 1)) || new Set();
        if (hasEnergizingPotentialDiff(s0, s1) && !hasElectricalFaultConflict(s0) && !hasElectricalFaultConflict(s1)) {
          const finalDir = (overrideDir === 'CCW') ? 'CCW' : 'CW';
          g.classList.add('device-on', 'sim-energized', finalDir === 'CW' ? 'motor-rotating-cw' : 'motor-rotating-ccw');
          g.style.setProperty('--sim-active-color', '#22c55e');
          ensureMotorRotorOverlay(g, finalDir);
          motorResults.push(`${g.dataset.ref || g.dataset.name || '1P Motor'}: RUNNING (${finalDir})`);
        } else {
          g.classList.add('motor-direction-unknown');
          const ref = g.dataset.ref || g.dataset.name || '1P Motor';
          if (hasElectricalFaultConflict(s0) || hasElectricalFaultConflict(s1)) {
            const reason = hasEarthFaultConflict(s0) || hasEarthFaultConflict(s1) ? 'EARTH FAULT' : 'SHORT CIRCUIT';
            addDiagnostic('single-phase-motor-fault', `${ref}: ${reason} at the motor terminals.`);
            ensureComponentSimBadge(g, reason, 'badge-fault');
            motorResults.push(`${ref}: STOPPED • ${reason}`);
          } else {
            if (s0.size || s1.size) addDiagnostic('single-phase-motor-supply', `${ref}: NO VALID SUPPLY across the motor terminals.`, 'warning');
            motorResults.push(`${ref}: OFF`);
          }
        }
      } else {
        // 3-Phase or Star-Delta Motor: requires all 3 phases L1, L2, L3 at U1, V1, W1 (ports 0, 1, 2)
        const sU = nodePotentials.get(keyOf(uid, 0)) || new Set();
        const sV = nodePotentials.get(keyOf(uid, 1)) || new Set();
        const sW = nodePotentials.get(keyOf(uid, 2)) || new Set();
        const pickPhase = s => (s.has('L1') ? 'R' : s.has('L2') ? 'Y' : s.has('L3') ? 'B' : '');
        const pU = pickPhase(sU), pV = pickPhase(sV), pW = pickPhase(sW);
        const primaryThreePhases = Boolean(
          pU && pV && pW &&
          new Set([pU, pV, pW]).size === 3 &&
          !hasElectricalFaultConflict(sU) && !hasElectricalFaultConflict(sV) && !hasElectricalFaultConflict(sW)
        );

        if (asset.includes('star_delta')) {
          // Star-Delta Motor (7 ports: 0:U1, 1:V1, 2:W1, 3:PE, 4:W2, 5:U2, 6:V2)
          // MUST have secondary side (W2, U2, V2) connected in either Star (Y) or Delta (Δ) to run!
          const arePortsConnected = (portA, portB) => {
            const start = keyOf(uid, portA);
            const target = keyOf(uid, portB);
            if (start === target) return true;
            const visited = new Set([start]);
            const q = [start];
            while (q.length > 0) {
              const curr = q.shift();
              for (const nxt of (adj.get(curr) || [])) {
                if (nxt === target) return true;
                if (!visited.has(nxt)) {
                  visited.add(nxt);
                  q.push(nxt);
                }
              }
            }
            return false;
          };

          const sW2 = nodePotentials.get(keyOf(uid, 4)) || new Set();
          const sU2 = nodePotentials.get(keyOf(uid, 5)) || new Set();
          const sV2 = nodePotentials.get(keyOf(uid, 6)) || new Set();
          const pW2 = pickPhase(sW2), pU2 = pickPhase(sU2), pV2 = pickPhase(sV2);

          // Star (Y): W2 (4), U2 (5), V2 (6) are bridged together in the active circuit graph without phase short
          const starBridged = arePortsConnected(4, 5) && arePortsConnected(5, 6);
          const starValid = starBridged && !hasElectricalFaultConflict(sW2) && !pW2 && !pU2 && !pV2;

          // Delta (Δ): W2 (4), U2 (5), V2 (6) are not bridged in star, and each winding (U1-U2, V1-V2, W1-W2)
          // is connected phase-to-phase across the 3 phases
          const deltaTopology = !starBridged && (
            (arePortsConnected(4, 0) && arePortsConnected(5, 1) && arePortsConnected(6, 2)) ||
            (arePortsConnected(4, 1) && arePortsConnected(5, 2) && arePortsConnected(6, 0)) ||
            (arePortsConnected(4, 0) && arePortsConnected(5, 2) && arePortsConnected(6, 1)) ||
            (arePortsConnected(4, 2) && arePortsConnected(5, 0) && arePortsConnected(6, 1))
          );
          const deltaPotentialsValid = !starBridged &&
            Boolean(pW2 && pU2 && pV2 && new Set([pW2, pU2, pV2]).size === 3) &&
            hasEnergizingPotentialDiff(sU, sU2) &&
            hasEnergizingPotentialDiff(sV, sV2) &&
            hasEnergizingPotentialDiff(sW, sW2) &&
            !hasElectricalFaultConflict(sW2) && !hasElectricalFaultConflict(sU2) && !hasElectricalFaultConflict(sV2);
          const deltaValid = deltaPotentialsValid || (primaryThreePhases && deltaTopology);

          // Highlight Y or Δ inside the motor whenever Star or Delta topology is present
          const activeMode = starValid ? 'STAR' : (deltaValid || deltaTopology) ? 'DELTA' : null;
          if (activeMode === 'STAR') {
            g.classList.add('motor-mode-star');
            updateStarDeltaInternalHighlight(g, 'STAR');
          } else if (activeMode === 'DELTA') {
            g.classList.add('motor-mode-delta');
            updateStarDeltaInternalHighlight(g, 'DELTA');
          }

          if (primaryThreePhases && (starValid || deltaValid)) {
            const sig = pU + pV + pW;
            const seqCw = (sig === 'RYB' || sig === 'YBR' || sig === 'BRY');
            const finalDir = (overrideDir === 'CW' || overrideDir === 'CCW') ? overrideDir : (seqCw ? 'CW' : 'CCW');
            const modeLabel = starValid ? 'STAR (Y)' : 'DELTA (Δ)';
            g.classList.add('device-on', 'sim-energized', finalDir === 'CW' ? 'motor-rotating-cw' : 'motor-rotating-ccw');
            g.style.setProperty('--sim-active-color', '#22c55e');
            ensureMotorRotorOverlay(g, finalDir);
            ensureComponentSimBadge(g, `${modeLabel} • ${finalDir}`, 'badge-ok');
            motorResults.push(`${g.dataset.ref || g.dataset.name || '3P Y/Δ Motor'}: RUNNING IN ${modeLabel} (${finalDir === 'CW' ? 'CLOCKWISE' : 'ANTICLOCKWISE'})`);
          } else if (primaryThreePhases && !starValid && !deltaValid) {
            // Primary (U1, V1, W1) is energized with L1, L2, L3, but secondary (W2, U2, V2) is NOT connected in Y or Δ!
            g.classList.add('motor-direction-unknown', 'motor-secondary-open-warn');
            ensureComponentSimBadge(g, '⚠ SECONDARY (W2-U2-V2) NOT CONNECTED', 'badge-warn');
            const refLabel = g.dataset.ref || g.dataset.name || 'M1';
            addDiagnostic('star-delta-winding', `${refLabel}: WINDING CONNECTION ERROR — W2/U2/V2 are not connected in a valid star or delta pattern.`, 'warning');
            motorResults.push(`${refLabel}: WARNING — SECONDARY (W2, U2, V2) NOT CONNECTED IN STAR (Y) OR DELTA (Δ)`);
            if (state) {
              state.textContent = `WARNING • ${refLabel.toUpperCase()} SECONDARY SIDE (W2, U2, V2) NOT CONNECTED IN STAR (Y) OR DELTA (Δ)`;
            }
          } else {
            g.classList.add('motor-direction-unknown');
            if (activeMode) {
              ensureComponentSimBadge(g, `${activeMode === 'STAR' ? 'STAR (Y)' : 'DELTA (Δ)'} • STOPPED`, '');
            }
            motorResults.push(`${g.dataset.ref || g.dataset.name || '3P Y/Δ Motor'}: STOPPED (CONNECT L1, L2, L3 TO U1, V1, W1 & W2, U2, V2 IN Y/Δ)`);
          }
        } else {
          // Standard 3-Phase Motor (ports 0:U1, 1:V1, 2:W1, 3:PE)
          if (primaryThreePhases) {
            const sig = pU + pV + pW;
            const seqCw = (sig === 'RYB' || sig === 'YBR' || sig === 'BRY');
            const finalDir = (overrideDir === 'CW' || overrideDir === 'CCW') ? overrideDir : (seqCw ? 'CW' : 'CCW');
            g.classList.add('device-on', 'sim-energized', finalDir === 'CW' ? 'motor-rotating-cw' : 'motor-rotating-ccw');
            g.style.setProperty('--sim-active-color', '#22c55e');
            ensureMotorRotorOverlay(g, finalDir);
            motorResults.push(`${g.dataset.ref || g.dataset.name || '3P Motor'}: RUNNING (${finalDir === 'CW' ? 'CLOCKWISE' : 'ANTICLOCKWISE'})`);
          } else {
            g.classList.add('motor-direction-unknown');
            motorResults.push(`${g.dataset.ref || g.dataset.name || '3P Motor'}: STOPPED (CONNECT L1, L2, L3 TO U1, V1, W1)`);
          }
        }
      }
    }
  });

  comps.forEach(g => {
    if (classifySimComponent(g) !== 'motor') return;
    const asset = getAssetBasename(g.dataset.symbolFile || g.dataset.porttype || g.dataset.type || '');
    if (asset.includes('dc_motor') || asset.includes('single_phase')) return;
    const uid = g.dataset.uid;
    const sets = [0, 1, 2].map(i => nodePotentials.get(keyOf(uid, i)) || new Set());
    const pick = s => s.has('L1') ? 'R' : s.has('L2') ? 'Y' : s.has('L3') ? 'B' : '';
    const phases = sets.map(pick);
    const hasThreeDistinctPhases = phases.every(Boolean) && new Set(phases).size === 3 && !sets.some(hasElectricalFaultConflict);
    if (g.classList.contains('motor-secondary-open-warn') && hasThreeDistinctPhases) {
      addDiagnostic('star-delta-winding', `${g.dataset.ref || g.dataset.name || 'Motor'}: WINDING CONNECTION ERROR — connect W2/U2/V2 in a valid star or delta pattern.`, 'warning');
    } else if (!hasThreeDistinctPhases) {
      const issue = diagnoseThreePhaseMotor(g, phases, sets, addDiagnostic);
      ensureComponentSimBadge(g, issue.code === 'motor-phase-loss' ? 'PHASE LOSS' : issue.code === 'motor-phase-miswire' ? 'MISWIRED' : issue.code === 'motor-terminal-fault' ? 'FAULT' : 'NO SUPPLY', 'badge-fault');
    }
  });

  // 7. Update wire conductor identification and live glow
  window.__escLastNodePotentials = nodePotentials;
  updateWireConductorIdentification(nodePotentials);

  if (motorResults.length && motorState) {
    motorState.textContent = 'Motor: ' + motorResults.join(' • ');
  }
  renderSimulationDiagnostics(diagnostics, true);
}
window.evaluateCircuitSimulation = evaluateCircuitSimulation;

function toggleComponentInRunMode(g, shiftKey = false) {
  if (!g || !running || !isOperableInRunMode(g)) return false;
  const kind = classifySimComponent(g);
  const asset = getAssetBasename(g.dataset.symbolFile || g.dataset.porttype || g.dataset.type || '');
  const label = g.dataset.ref ? `${g.dataset.ref} (${g.dataset.name || 'Component'})` : (g.dataset.name || 'Component');

  // 1. Pure Fuse: not an ordinary user-operated switch! Only Shift+click or Properties blows/replaces it.
  if (kind === 'protection') {
    const sub = classifyProtectionSubkind(g);
    if (sub === 'fuse') {
      if (!shiftKey) {
        const isBlown = g.dataset.fuseState === 'blown';
        if (state) state.textContent = `FUSE ${label.toUpperCase()} IS ${isBlown ? 'BLOWN (OPEN FAULT) • DOUBLE-CLICK TO REPLACE IN PROPERTIES' : 'HEALTHY • FUSES ARE NOT ORDINARY SWITCHES (DOUBLE-CLICK OR SHIFT+CLICK TO TEST BLOWN FAULT)'}`;
        return false;
      }
      g.dataset.fuseState = g.dataset.fuseState === 'blown' ? 'healthy' : 'blown';
      if (g.dataset.fuseState === 'blown') g.dataset.simTripCause = 'manual';
      else delete g.dataset.simTripCause;
      g.dataset.simState = g.dataset.fuseState === 'blown' ? '1' : '0';
      evaluateCircuitSimulation();
      if (state) state.textContent = `FUSE ${label.toUpperCase()} → ${g.dataset.fuseState === 'blown' ? 'BLOWN (CIRCUIT INTERRUPTED)' : 'REPLACED (HEALTHY)'}`;
      return true;
    }
    if (sub === 'overload_relay') {
      const wasTripped = (g.dataset.overloadState === 'tripped' || g.dataset.simState === '1');
      g.dataset.overloadState = wasTripped ? 'normal' : 'tripped';
      g.dataset.simState = wasTripped ? '0' : '1';
      evaluateCircuitSimulation();
      if (state) state.textContent = `THERMAL OVERLOAD ${label.toUpperCase()} → ${wasTripped ? 'RESET (NORMAL)' : 'TRIPPED (95-96 OPEN, 97-98 CLOSED)'}`;
      return true;
    }
    if (sub === 'circuit_breaker' || sub === 'mcb_motor') {
      if (shiftKey) {
        g.dataset.breakerState = 'tripped';
        g.dataset.simTripCause = 'manual';
        g.dataset.simState = '0';
        evaluateCircuitSimulation();
        if (state) state.textContent = `BREAKER ${label.toUpperCase()} → TRIPPED (FAULT)`;
        return true;
      }
      if (g.dataset.breakerState === 'tripped') {
        g.dataset.breakerState = 'open';
        delete g.dataset.simTripCause;
        g.dataset.simState = '0';
        evaluateCircuitSimulation();
        if (state) state.textContent = `BREAKER ${label.toUpperCase()} → RESET TO OPEN (CLICK AGAIN TO CLOSE)`;
        return true;
      }
      const next = (g.dataset.simEffectiveState || g.dataset.simState || '0') === '0' ? '1' : '0';
      g.dataset.breakerState = next === '1' ? 'closed' : 'open';
      g.dataset.simState = next;
      evaluateCircuitSimulation();
      if (state) state.textContent = `BREAKER ${label.toUpperCase()} → ${next === '1' ? 'CLOSED (ON)' : 'OPEN (OFF)'}`;
      return true;
    }
    if (sub === 'fuse_isolator') {
      if (g.dataset.fuseState === 'blown') {
        if (state) state.textContent = `FUSE ISOLATOR ${label.toUpperCase()} • FUSE IS BLOWN (REPLACE FUSE IN PROPERTIES FIRST)`;
        return false;
      }
    }
  }

  // 2. Proximity Sensor: toggle Target Detected state
  if (kind === 'proximity') {
    const cur = (g.dataset.targetDetected === '1' || g.dataset.simState === '1') ? '1' : '0';
    const next = cur === '0' ? '1' : '0';
    g.dataset.targetDetected = next;
    g.dataset.simState = next;
    evaluateCircuitSimulation();
    if (state) state.textContent = `PROXIMITY SENSOR ${label.toUpperCase()} → ${next === '1' ? 'TARGET DETECTED' : 'NO TARGET'}`;
    return true;
  }

  // 3. Switches, Pushbuttons, Selectors, Isolators, Contacts
  const current = String(g.dataset.simEffectiveState || g.dataset.simState || '0');
  let next = '1';
  if (asset.startsWith('switch_3_position_selector')) {
    next = current === '0' ? '1' : current === '1' ? '2' : '0';
  } else {
    next = current === '0' ? '1' : '0';
  }
  g.dataset.simState = next;
  if (kind === 'aux_contact' || kind === 'main_contact') {
    g.dataset.simManualOverride = '1';
  }
  evaluateCircuitSimulation();
  if (state) {
    state.textContent = `SIMULATION • ${label.toUpperCase()} → ${next === '0' ? 'NORMAL POSITION' : (next === '2' ? 'POSITION II/III' : 'OPERATED / CHANGED POSITION')}`;
  }
  return true;
}
window.toggleComponentInRunMode = toggleComponentInRunMode;

function setSimulationRunUI(active) {
  document.body.classList.toggle('simulation-run-ui', !!active);
  if (active) {
    if (typeof window.cancelActiveWiring === 'function') window.cancelActiveWiring('');
    if (typeof window.clearEndpointGlow === 'function') window.clearEndpointGlow();
    if (typeof window.selectTerminal === 'function') window.selectTerminal(null);
    if (typeof select === 'function') select(null, false);
    const panel = document.getElementById('propertyPanel');
    if (panel) { panel.classList.remove('open'); panel.setAttribute('aria-hidden', 'true'); }
  }
  const libraryIsHidden = document.body.classList.contains('library-hidden');
  const libraryToggle = document.getElementById('libraryToggle');
  if (active && !libraryIsHidden && libraryToggle) libraryToggle.click();
  if (!active && document.body.classList.contains('library-hidden') && libraryToggle) libraryToggle.click();
}

document.getElementById('play').onclick = () => {
  const wires = [...document.querySelectorAll('#wireLayer .connected-wire')];
  if (!wires.length) {
    running = false;
    document.body.classList.remove('live');
    setSimulationRunUI(false);
    renderSimulationDiagnostics([], false);
    if (sim) { sim.textContent = '● OPEN CIRCUIT'; sim.classList.remove('running'); }
    if (motorState) motorState.textContent = 'Motor: OFF';
    if (state) state.textContent = 'OPEN CIRCUIT • CONNECT COMPONENT TERMINALS WITH WIRES FIRST';
    return;
  }
  running = true;
  resetSimulationTimers();
  setSimulationRunUI(true);
  render();
  evaluateCircuitSimulation();
  startSimClockLoop();
};

document.getElementById('stop').onclick = () => {
  running = false;
  evaluateCircuitSimulation();
  render();
  setSimulationRunUI(false);
};

// Upgrade makeDropped so every newly placed component uses inline SVG, unique/valid IEC tag, and default attributes
const _prevMakeDroppedV120 = makeDropped;
makeDropped = function(d, x, y) {
  const g = _prevMakeDroppedV120(d, x, y);
  if (g) {
    if (d && d.simColor) g.dataset.simColor = d.simColor;
    else if (!g.dataset.simColor) g.dataset.simColor = window.getEscLoadSimColor(d?.symbolFile || '');
    const asset = getAssetBasename(g.dataset.symbolFile || g.dataset.porttype || g.dataset.type || '');
    if (/timer/.test(asset)) {
      if (!g.dataset.tonDelay) g.dataset.tonDelay = '3';
      if (!g.dataset.tofDelay) g.dataset.tofDelay = '3';
    }
    if (asset.includes('thermal') && classifySimComponent(g) === 'aux_contact') {
      g.dataset.contactRole = 'overload';
    }
    if (classifySimComponent(g) === 'proximity') {
      if (!g.dataset.sensorPolarity) g.dataset.sensorPolarity = asset.includes('pnp') ? 'PNP' : 'NPN';
      if (!g.dataset.sensorContact) g.dataset.sensorContact = asset.includes('_nc') ? 'NC' : 'NO';
    }
    upgradeComponentToInlineSvg(g);
    syncComponentPorts(g);
    syncConnectedPortStates();
    if (typeof window.applyEscWorkspaceColours === 'function') window.applyEscWorkspaceColours();
    if (running) evaluateCircuitSimulation();
  }
  return g;
};

document.querySelectorAll('#dropLayer .dropped-symbol').forEach(g => {
  upgradeComponentToInlineSvg(g);
  syncComponentPorts(g);
  layoutComponentAnnotations(g);
});
syncConnectedPortStates();

// ============================================================================
// Component Properties Dashboard Integration (#propertyPanel)
// Supports editing Tag (with duplicate protection), Lamp Colour, Timer Delays,
// Fuse Healthy/Blown state, Breaker/Overload Trip/Reset, Proximity NPN/PNP & NO/NC,
// Contact linking role (Contactor vs Overload 95-96/97-98), and Motor Direction.
// ============================================================================
(function installIndustrialPropertiesDashboard() {
  const panel = document.getElementById('propertyPanel');
  const content = panel?.querySelector('.property-content');
  const actions = panel?.querySelector('.property-actions');
  if (!panel || !content || !actions) return;

  let dynBox = document.getElementById('escSimPropsContainer');
  if (!dynBox) {
    dynBox = document.createElement('div');
    dynBox.id = 'escSimPropsContainer';
    dynBox.className = 'esc-sim-props-container';
    content.insertBefore(dynBox, actions);
  }

  dynBox.addEventListener('click', function(e) {
    const dot = e.target && e.target.closest ? e.target.closest('.prop-sim-color-dot') : null;
    if (!dot) return;
    const select = dynBox.querySelector('#propSimColor');
    if (select) select.value = dot.dataset.color;
    dynBox.querySelectorAll('.prop-sim-color-dot').forEach(item => item.classList.toggle('active', item === dot));
  });

  function populateDynamicProperties(g) {
    if (!g || !dynBox) return;
    const kind = classifySimComponent(g);
    const asset = getAssetBasename(g.dataset.symbolFile || g.dataset.porttype || g.dataset.type || '');
    const sub = classifyProtectionSubkind(g);
    let html = '';

    const lightIdentity = ((g.dataset.name || '') + ' ' + asset + ' ' + (g.dataset.type || '')).toLowerCase();
    const isSignalLight = /pilot.?light|blinking.*lamp|beacon|signal.*lamp|indicator.*lamp/.test(lightIdentity);
    if (isSignalLight) {
      const curColor = g.dataset.simColor || window.getEscLoadSimColor(g.dataset.symbolFile || '');
      const opts = ESC_LOAD_COLOR_OPTIONS.map(o => `<option value="${o.hex}" ${o.hex.toLowerCase() === curColor.toLowerCase() ? 'selected' : ''}>${o.name} (${o.hex})</option>`).join('');
      const swatches = ESC_LOAD_COLOR_OPTIONS.map(o => `<button type="button" class="prop-sim-color-dot ${o.hex.toLowerCase() === curColor.toLowerCase() ? 'active' : ''}" data-color="${o.hex}" title="${o.name}" aria-label="${o.name}" style="background:${o.hex}"></button>`).join('');
      html += `<div class="pilot-light-colour"><label>Colour</label><div class="prop-sim-color-palette" role="group" aria-label="Signal light colour">${swatches}</div><select id="propSimColor" aria-hidden="true" tabindex="-1">${opts}</select></div>`;
    } 
    // Common IEC tag and two-part number controls are available for every component.
    // Keep the second dropdown's first/default value at zero when no decimal suffix exists.
    {
      const baseTag = content.querySelector('label:has(#propTag)');
      if (baseTag) baseTag.style.display = 'none';
      const fullTag = String(g.dataset.ref || 'Q0.0');
      const tagMatch = fullTag.match(/^([A-Za-z_-]+)(.*)$/);
      const tagPrefix = tagMatch ? tagMatch[1] : 'Q';
      const tagNumber = tagMatch ? tagMatch[2] : fullTag.replace(/^[A-Za-z_-]+/, '');
      const numberParts = String(tagNumber || '0.0').split('.');
      const number1 = /^\d+$/.test(numberParts[0] || '') ? numberParts[0] : '0';
      const number2 = /^\d+$/.test(numberParts[1] || '') ? numberParts[1] : '0';
      const commonTags = ['Q','F','FR','K','KM','KA','KT','S','SB','SA','H','HL','HA','M','G','T','X','P','B','Y','W','R','L','Other'];
      const tagList = [...new Set([tagPrefix, ...commonTags])];
      const tagOptions = tagList.map(t => `<option value="${t}" ${t.toLowerCase() === tagPrefix.toLowerCase() ? 'selected' : ''}>${t === 'Other' ? 'Other / custom' : t}</option>`).join('');
      const numberOptions = (current) => { const vals = Array.from({length:100}, (_, i) => String(i)); if (!vals.includes(String(current))) vals.push(String(current)); return vals.sort((a,b)=>Number(a)-Number(b)).map(v => `<option value="${v}" ${String(current) === v ? 'selected' : ''}>${v}</option>`).join(''); };
      html += `<div class="signal-tag-number signal-tag-number-common"><label for="propTagType">Tag</label><select id="propTagType" required>${tagOptions}</select><label for="propTagNumber1">Number</label><div class="signal-number-inline"><select id="propTagNumber1" aria-label="Number before decimal" required>${numberOptions(number1)}</select><span class="signal-number-dot">.</span><select id="propTagNumber2" aria-label="Number after decimal" required>${numberOptions(number2)}</select></div></div>`;
    }
    if (kind === 'coil' && /timer/.test(asset)) {
      const ton = g.dataset.tonDelay || '3';
      const tof = g.dataset.tofDelay || '3';
      if (asset.includes('ton')) {
        html += `<label>On-Delay Duration TON (s)<input id="propTonDelay" type="number" min="0.1" step="0.1" value="${ton}"></label>`;
      }
      if (asset.includes('tof')) {
        html += `<label>Off-Delay Duration TOF (s)<input id="propTofDelay" type="number" min="0.1" step="0.1" value="${tof}"></label>`;
      }
    }
    if (kind === 'aux_contact') {
      const refClean = normalizeDeviceRef(g.dataset.ref);
      const curRole = g.dataset.contactRole || ((asset.includes('thermal') || /^F(?:R)?\d*$/i.test(refClean)) ? 'overload' : (/^KT/i.test(refClean) ? 'timer' : 'contactor'));
      html += `<label>Contact Function<select id="propContactRole">
        <option value="contactor" ${curRole === 'contactor' ? 'selected' : ''}>Contactor / Relay (13-14 / 21-22)</option>
        <option value="overload" ${curRole === 'overload' ? 'selected' : ''}>Thermal Overload (95-96 / 97-98)</option>
        <option value="timer" ${curRole === 'timer' ? 'selected' : ''}>Timer Contact (55-56 / 57-58 / 65-66 / 67-68)</option>
      </select></label>`;
    }
    if (kind === 'protection') {
      if (sub === 'fuse' || sub === 'fuse_isolator') {
        const fs = g.dataset.fuseState || 'healthy';
        html += `<label>Fuse Link Status<select id="propFuseState">
          <option value="healthy" ${fs === 'healthy' ? 'selected' : ''}>Healthy (Conducting)</option>
          <option value="blown" ${fs === 'blown' ? 'selected' : ''}>Blown (Open Circuit Fault)</option>
        </select></label>`;
      } else if (sub === 'overload_relay') {
        const os = g.dataset.overloadState || 'normal';
        const rm = g.dataset.resetMode || 'manual';
        html += `<label>Overload Relay State<select id="propOverloadState">
          <option value="normal" ${os === 'normal' ? 'selected' : ''}>Normal (95-96 Closed)</option>
          <option value="tripped" ${os === 'tripped' ? 'selected' : ''}>Tripped (95-96 Open, 97-98 Closed)</option>
        </select></label>
        <label>Reset Mode<select id="propResetMode">
          <option value="manual" ${rm === 'manual' ? 'selected' : ''}>Manual Reset</option>
          <option value="auto" ${rm === 'auto' ? 'selected' : ''}>Automatic Reset on Stop</option>
        </select></label>`;
      } else {
        const bs = g.dataset.breakerState || 'open';
        html += `<label>Circuit Breaker State<select id="propBreakerState">
          <option value="open" ${bs === 'open' ? 'selected' : ''}>Open (OFF)</option>
          <option value="closed" ${bs === 'closed' ? 'selected' : ''}>Closed (ON)</option>
          <option value="tripped" ${bs === 'tripped' ? 'selected' : ''}>Tripped (Fault Interrupted)</option>
        </select></label>`;
      }
    }
    if (kind === 'proximity') {
      const pol = (g.dataset.sensorPolarity || (asset.includes('pnp') ? 'PNP' : 'NPN')).toUpperCase();
      const con = (g.dataset.sensorContact || (asset.includes('_nc') ? 'NC' : 'NO')).toUpperCase();
      const det = (g.dataset.targetDetected === '1' || g.dataset.simState === '1') ? '1' : '0';
      html += `<label>Sensor Output Type<select id="propSensorPolarity">
        <option value="NPN" ${pol === 'NPN' ? 'selected' : ''}>NPN (Sinking Output to 0V / BU)</option>
        <option value="PNP" ${pol === 'PNP' ? 'selected' : ''}>PNP (Sourcing Output from +V / BN)</option>
      </select></label>
      <label>Output Logic<select id="propSensorContact">
        <option value="NO" ${con === 'NO' ? 'selected' : ''}>Normally Open (NO)</option>
        <option value="NC" ${con === 'NC' ? 'selected' : ''}>Normally Closed (NC)</option>
      </select></label>
      <label>Simulated Target<select id="propTargetDetected">
        <option value="0" ${det === '0' ? 'selected' : ''}>No Target (0)</option>
        <option value="1" ${det === '1' ? 'selected' : ''}>Target Detected (1)</option>
      </select></label>`;
    }
    if (kind === 'motor') {
      const dir = (g.dataset.motorDir || 'auto').toUpperCase();
      html += `<label>Rotation Direction<select id="propMotorDir">
        <option value="auto" ${dir === 'AUTO' ? 'selected' : ''}>Auto (From Phase Sequence / Polarity)</option>
        <option value="CW" ${dir === 'CW' ? 'selected' : ''}>Clockwise (CW)</option>
        <option value="CCW" ${dir === 'CCW' ? 'selected' : ''}>Counter-Clockwise (CCW)</option>
      </select></label>`;
    }
    dynBox.dataset.tagEdited = '0';
    dynBox.dataset.polarityEdited = '0';
    dynBox.innerHTML = html;
  }

  const _origSelect = window.select || select;
  window.select = function(g, openProperties = false) {
    _origSelect(g, openProperties);
    if (g) populateDynamicProperties(g);
  };
  select = window.select;

  // Track user edits on tag dropdowns and polarity selector
  dynBox.addEventListener('change', function(e) {
    const id = e.target?.id || '';
    if (id === 'propTagType' || id === 'propTagNumber1' || id === 'propTagNumber2') {
      dynBox.dataset.tagEdited = '1';
    }
    if (id === 'propSensorPolarity') {
      dynBox.dataset.polarityEdited = '1';
    }
  });

  // Hook Save button (#propertyOk) in capture phase to apply all industrial properties and validate unique tags
  document.getElementById('propertyOk')?.addEventListener('click', function() {
    if (!selected || !selected.isConnected) return;
    const g = selected;
    const tagTypeEl = document.getElementById('propTagType');
    const tagNumber1El = document.getElementById('propTagNumber1');
    const tagNumber2El = document.getElementById('propTagNumber2');
    let rawTag = document.getElementById('propTag')?.value.trim() || g.dataset.ref || '';
    if (tagTypeEl && tagNumber1El && tagNumber2El && (dynBox.dataset.tagEdited === '1' || /\.\d+$/.test(rawTag))) {
      const numberValue = (tagNumber2El.value === '0' && !/\.\d+$/.test(g.dataset.ref || '') && dynBox.dataset.tagEdited !== '1')
        ? `${tagNumber1El.value}`
        : `${tagNumber1El.value}.${tagNumber2El.value}`;
      const prefix = tagTypeEl.value === 'Other' ? ((g.dataset.ref || '').match(/^[A-Za-z_-]+/)?.[0] || 'Q') : tagTypeEl.value;
      rawTag = prefix + numberValue;
      const tagInput = document.getElementById('propTag');
      if (tagInput) tagInput.value = rawTag;
    }
    if (rawTag) {
      const validTag = ensureUniqueOrValidTag(g, rawTag);
      g.dataset.ref = validTag;
      const tagInput = document.getElementById('propTag');
      if (tagInput) tagInput.value = validTag;
      const t = g.querySelector('.drop-tag');
      if (t) t.textContent = validTag;
    }
    const simColorEl = document.getElementById('propSimColor');
    if (simColorEl && simColorEl.value) {
      g.dataset.simColor = simColorEl.value;
    }
    const tonEl = document.getElementById('propTonDelay');
    if (tonEl && tonEl.value) g.dataset.tonDelay = String(Math.max(0.1, parseFloat(tonEl.value) || 3));
    const tofEl = document.getElementById('propTofDelay');
    if (tofEl && tofEl.value) g.dataset.tofDelay = String(Math.max(0.1, parseFloat(tofEl.value) || 3));
    const roleEl = document.getElementById('propContactRole');
    if (roleEl && roleEl.value) {
      g.dataset.contactRole = roleEl.value;
      delete g.dataset.terminals;
    }
    const fuseEl = document.getElementById('propFuseState');
    if (fuseEl && fuseEl.value) {
      g.dataset.fuseState = fuseEl.value;
      g.dataset.simState = fuseEl.value === 'blown' ? '1' : '0';
    }
    const ovlEl = document.getElementById('propOverloadState');
    if (ovlEl && ovlEl.value) {
      g.dataset.overloadState = ovlEl.value;
      g.dataset.simState = ovlEl.value === 'tripped' ? '1' : '0';
    }
    const rmEl = document.getElementById('propResetMode');
    if (rmEl && rmEl.value) g.dataset.resetMode = rmEl.value;
    const brkEl = document.getElementById('propBreakerState');
    if (brkEl && brkEl.value) {
      g.dataset.breakerState = brkEl.value;
      g.dataset.simState = brkEl.value === 'closed' ? '1' : '0';
    }
    const polEl = document.getElementById('propSensorPolarity');
    if (polEl && polEl.value) {
      if (dynBox.dataset.polarityEdited === '1' || polEl.value.toUpperCase() === 'PNP') {
        g.dataset.sensorPolarityExplicit = '1';
      }
      g.dataset.sensorPolarity = polEl.value;
    }
    const conEl = document.getElementById('propSensorContact');
    if (conEl && conEl.value) g.dataset.sensorContact = conEl.value;
    const detEl = document.getElementById('propTargetDetected');
    if (detEl && detEl.value != null) {
      g.dataset.targetDetected = detEl.value;
      g.dataset.simState = detEl.value;
    }
    const mDirEl = document.getElementById('propMotorDir');
    if (mDirEl && mDirEl.value) g.dataset.motorDir = mDirEl.value;

    upgradeComponentToInlineSvg(g);
    syncComponentPorts(g);
    refreshWiresForComponent(g);
    syncConnectedPortStates();
    if (running) evaluateCircuitSimulation();
    else {
      const isBlown = g.dataset.fuseState === 'blown';
      const isTripped = g.dataset.breakerState === 'tripped' || g.dataset.overloadState === 'tripped';
      g.classList.toggle('sim-fuse-blown', isBlown);
      g.classList.toggle('sim-fault-tripped', isTripped);
      if (isBlown) ensureComponentSimBadge(g, 'BLOWN', 'badge-fault');
      else if (isTripped) ensureComponentSimBadge(g, 'TRIPPED', 'badge-fault');
      else ensureComponentSimBadge(g, '', '');
    }
  }, true);
})();

// ============================================================================
// Multi-select, group movement, and group deletion for placed components and wires.
(function installGroupSelectionAndDrag() {
  const svg = document.getElementById('schematic');
  if (!svg) return;
  let groupDrag = null;
  let marqueeDrag = null;
  let marqueeRect = null;

  const groupItems = () => [...document.querySelectorAll(
    '#dropLayer .dropped-symbol.group-selected, #wireLayer .connected-wire.wire-selected'
  )];
  const componentItems = () => [...document.querySelectorAll('#dropLayer .dropped-symbol.group-selected')];
  const wireItems = () => [...document.querySelectorAll('#wireLayer .connected-wire.wire-selected')];

  function clearGroupSelection() {
    document.querySelectorAll('#dropLayer .dropped-symbol.group-selected').forEach(item => item.classList.remove('group-selected'));
    document.querySelectorAll('#wireLayer .connected-wire.wire-selected').forEach(item => item.classList.remove('wire-selected'));
    window.selectedWire = null;
    if (typeof select === 'function') select(null, false);
  }

  function selectGroupItem(item) {
    const isWire = item.classList.contains('connected-wire');
    const className = isWire ? 'wire-selected' : 'group-selected';
    const adding = !item.classList.contains(className);
    if (adding) {
      item.classList.add(className);
      if (isWire) {
        if (typeof select === 'function') select(null, false);
        window.selectedWire = item;
      } else {
        updateSelectionOutline(item);
        if (typeof select === 'function') select(item, false);
      }
    } else {
      item.classList.remove(className);
      if (isWire && window.selectedWire === item) {
        window.selectedWire = wireItems()[0] || null;
      }
      if (!isWire && typeof selected !== 'undefined' && selected === item) {
        select(componentItems()[0] || null, false);
      }
    }
  }

  function parsePoints(value) {
    return String(value || '').trim().split(/\s+/).filter(Boolean).map(pair => {
      const [x, y] = pair.split(',').map(Number);
      return { x, y };
    }).filter(point => Number.isFinite(point.x) && Number.isFinite(point.y));
  }

  function pointsText(points) {
    return points.map(point => `${Math.round(point.x * 100) / 100},${Math.round(point.y * 100) / 100}`).join(' ');
  }

  function shiftPointText(value, dx, dy) {
    return pointsText(parsePoints(value).map(point => ({ x: point.x + dx, y: point.y + dy })));
  }

  function snapshotWire(wire) {
    return {
      element: wire,
      fromUid: wire.dataset.fromG || '',
      toUid: wire.dataset.toG || '',
      points: wire.getAttribute('points') || '',
      waypoints: wire.dataset.waypoints || '',
      customPoints: wire.dataset.customPoints || '',
      routingMode: wire.dataset.routingMode || 'default',
      orthoOrient: wire.dataset.orthoOrient || 'VHV',
      orthoMid: wire.dataset.orthoMid || '',
      branchFixed: wire.dataset.branchWireFixed === '1',
      branchX: wire.dataset.branchX || '',
      branchY: wire.dataset.branchY || '',
      branchSide: wire.dataset.branchSide || 'top'
    };
  }

  function getComponentByUid(uid) {
    return [...document.querySelectorAll('#dropLayer .dropped-symbol')].find(item => item.dataset.uid === uid) || null;
  }

  function resolveRecordPorts(record) {
    const wire = record.element;
    const from = getComponentByUid(record.fromUid);
    const to = getComponentByUid(record.toUid);
    return {
      from,
      to,
      a: from ? resolveComponentPort(from, wire.dataset.fromIndex, wire.dataset.from) : null,
      b: to ? resolveComponentPort(to, wire.dataset.toIndex, wire.dataset.to) : null
    };
  }

  function setWireRoute(wire, a, b, clickMode = false) {
    if (!a || !b) return;
    if (clickMode) {
      const route = computeClickToConnectRoute(a, b);
      wire.setAttribute('points', route.points);
      wire.dataset.orthoOrient = route.orient;
      wire.dataset.orthoMid = String(route.mid);
      delete wire.dataset.customPoints;
      return;
    }
    const aligned = Math.abs(a.x - b.x) <= 2 || Math.abs(a.y - b.y) <= 2;
    wire.setAttribute('points', aligned
      ? `${Math.round(a.x * 100) / 100},${Math.round(a.y * 100) / 100} ${Math.round(b.x * 100) / 100},${Math.round(b.y * 100) / 100}`
      : computeWirePoints(a, b, []));
    delete wire.dataset.waypoints;
    delete wire.dataset.customPoints;
  }

  function moveWireOnly(record, dx, dy) {
    const wire = record.element;
    const { a, b } = resolveRecordPorts(record);
    if (!a || !b) return;
    if (record.routingMode === 'click-to-connect') {
      const orient = record.orthoOrient === 'HVH' ? 'HVH' : 'VHV';
      const mid = Number(record.orthoMid);
      const shiftedMid = Number.isFinite(mid) ? mid + (orient === 'HVH' ? dx : dy) : null;
      const route = computeClickToConnectRoute(a, b, shiftedMid, orient);
      wire.setAttribute('points', route.points);
      wire.dataset.orthoOrient = route.orient;
      wire.dataset.orthoMid = String(route.mid);
      wire.dataset.customPoints = route.points;
      return;
    }
    let waypoints = [];
    if (record.waypoints) {
      try { waypoints = JSON.parse(record.waypoints) || []; } catch (_) {}
    }
    if (!waypoints.length) {
      const pts = parsePoints(record.points);
      waypoints = pts.slice(1, -1).map(point => ({ x: point.x, y: point.y }));
      if (!waypoints.length) {
        waypoints = [{ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }];
      }
    }
    waypoints = waypoints.map(point => ({ x: Number(point.x) + dx, y: Number(point.y) + dy }));
    wire.dataset.waypoints = JSON.stringify(waypoints);
    wire.setAttribute('points', computeWirePoints(a, b, waypoints));
  }

  function moveGroupWire(record, dx, dy, movingUids) {
    const wire = record.element;
    const fromMoves = movingUids.has(record.fromUid);
    const toMoves = movingUids.has(record.toUid);
    const isSelected = wire.classList.contains('wire-selected');
    const { a, b } = resolveRecordPorts(record);
    if (fromMoves && toMoves) {
      wire.setAttribute('points', shiftPointText(record.points, dx, dy));
      if (record.customPoints) wire.dataset.customPoints = shiftPointText(record.customPoints, dx, dy);
      if (record.waypoints) {
        try {
          const moved = JSON.parse(record.waypoints).map(point => ({ x: Number(point.x) + dx, y: Number(point.y) + dy }));
          wire.dataset.waypoints = JSON.stringify(moved);
        } catch (_) {}
      }
      const mid = Number(record.orthoMid);
      if (Number.isFinite(mid)) wire.dataset.orthoMid = String(mid + (record.orthoOrient === 'HVH' ? dx : dy));
      if (record.branchFixed) {
        wire.dataset.branchX = String(Number(record.branchX) + dx);
        wire.dataset.branchY = String(Number(record.branchY) + dy);
      }
      return;
    }
    if (fromMoves || toMoves) {
      if (record.branchFixed && a) {
        const shiftBranch = toMoves;
        const bx = Number(record.branchX) + (shiftBranch ? dx : 0);
        const by = Number(record.branchY) + (shiftBranch ? dy : 0);
        if (Number.isFinite(bx) && Number.isFinite(by)) {
          wire.dataset.branchX = String(bx);
          wire.dataset.branchY = String(by);
          wire.setAttribute('points', computeWirePoints(a, { x: bx, y: by, side: record.branchSide, index: 0 }, []));
          return;
        }
      }
      setWireRoute(wire, a, b, record.routingMode === 'click-to-connect');
      return;
    }
    if (isSelected) moveWireOnly(record, dx, dy);
  }

  function removeGroupSelection() {
    const components = componentItems();
    const wires = new Set(wireItems());
    components.forEach(component => {
      const uid = component.dataset.uid;
      if (!uid) return;
      document.querySelectorAll('#wireLayer .connected-wire').forEach(wire => {
        if (wire.dataset.fromG === uid || wire.dataset.toG === uid) wires.add(wire);
      });
    });
    wires.forEach(wire => wire.remove());
    components.forEach(component => component.remove());
    clearGroupSelection();
    if (typeof syncConnectedPortStates === 'function') syncConnectedPortStates();
    if (typeof window.refreshAllWires === 'function') window.refreshAllWires();
    if (typeof window.updateWireBranchJoints === 'function') window.updateWireBranchJoints();
    if (state) state.textContent = components.length + wires.size > 1 ? 'GROUP DELETED' : 'ITEM DELETED';
  }

  function beginGroupDrag(e, items) {
    const point = getPoint(e);
    const components = items.filter(item => item.classList.contains('dropped-symbol'));
    const componentRecords = components.map(item => ({
      element: item,
      x: Number(item.dataset.x) || 0,
      y: Number(item.dataset.y) || 0,
      uid: item.dataset.uid || ''
    }));
    const allWires = [...document.querySelectorAll('#wireLayer .connected-wire')].map(snapshotWire);
    groupDrag = {
      pointerId: e.pointerId,
      startX: point.x,
      startY: point.y,
      components: componentRecords,
      wires: allWires,
      moved: false
    };
    components.forEach(item => item.classList.add('moving'));
    try { svg.setPointerCapture(e.pointerId); } catch (_) {}
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  function beginMarquee(e) {
    const point = getPoint(e);
    marqueeRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    marqueeRect.setAttribute('class', 'group-marquee-window');
    marqueeRect.setAttribute('pointer-events', 'none');
    marqueeRect.setAttribute('x', String(point.x));
    marqueeRect.setAttribute('y', String(point.y));
    marqueeRect.setAttribute('width', '0');
    marqueeRect.setAttribute('height', '0');
    svg.appendChild(marqueeRect);
    marqueeDrag = {
      pointerId: e.pointerId,
      startX: point.x,
      startY: point.y,
      x: point.x,
      y: point.y,
      startClientX: e.clientX,
      startClientY: e.clientY,
      clientX: e.clientX,
      clientY: e.clientY,
      moved: false
    };
    try { svg.setPointerCapture(e.pointerId); } catch (_) {}
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  function updateMarquee(point, clientX, clientY) {
    if (!marqueeDrag || !marqueeRect) return;
    marqueeDrag.x = point.x;
    marqueeDrag.y = point.y;
    marqueeDrag.clientX = clientX;
    marqueeDrag.clientY = clientY;
    marqueeDrag.moved = Math.hypot(clientX - marqueeDrag.startClientX, clientY - marqueeDrag.startClientY) > 4;
    const left = Math.min(marqueeDrag.startX, point.x);
    const top = Math.min(marqueeDrag.startY, point.y);
    marqueeRect.setAttribute('x', String(left));
    marqueeRect.setAttribute('y', String(top));
    marqueeRect.setAttribute('width', String(Math.abs(point.x - marqueeDrag.startX)));
    marqueeRect.setAttribute('height', String(Math.abs(point.y - marqueeDrag.startY)));
    marqueeRect.setAttribute('class', clientX < marqueeDrag.startClientX ? 'group-marquee-crossing' : 'group-marquee-window');
  }

  function elementBoundsOnScreen(element) {
    try {
      const box = element.getBoundingClientRect();
      if (!box.width && !box.height) return null;
      return { left: box.left, right: box.right, top: box.top, bottom: box.bottom };
    } catch (_) {
      return null;
    }
  }

  function wirePointsOnScreen(wire) {
    const matrix = svg.getScreenCTM();
    if (!matrix) return [];
    return parsePoints(wire.getAttribute('points')).map(value => {
      const point = svg.createSVGPoint();
      point.x = value.x;
      point.y = value.y;
      const screenPoint = point.matrixTransform(matrix);
      return { x: screenPoint.x, y: screenPoint.y };
    });
  }

  function pointsWithinRect(points, rect) {
    return points.length > 0 && points.every(point => point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom);
  }

  function wireCrossesRect(points, rect) {
    if (points.length < 2) return pointsWithinRect(points, rect);
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      if (a.x === b.x) {
        if (a.x >= rect.left && a.x <= rect.right && Math.max(Math.min(a.y, b.y), rect.top) <= Math.min(Math.max(a.y, b.y), rect.bottom)) return true;
      } else if (a.y === b.y) {
        if (a.y >= rect.top && a.y <= rect.bottom && Math.max(Math.min(a.x, b.x), rect.left) <= Math.min(Math.max(a.x, b.x), rect.right)) return true;
      } else {
        const minX = Math.min(a.x, b.x), maxX = Math.max(a.x, b.x);
        const minY = Math.min(a.y, b.y), maxY = Math.max(a.y, b.y);
        if (maxX >= rect.left && minX <= rect.right && maxY >= rect.top && minY <= rect.bottom) return true;
      }
    }
    return false;
  }

  function finishMarquee() {
    if (!marqueeDrag) return;
    const drag = marqueeDrag;
    marqueeDrag = null;
    if (marqueeRect?.isConnected) marqueeRect.remove();
    marqueeRect = null;
    if (!drag.moved) return;

    const rect = {
      left: Math.min(drag.startClientX, drag.clientX),
      right: Math.max(drag.startClientX, drag.clientX),
      top: Math.min(drag.startClientY, drag.clientY),
      bottom: Math.max(drag.startClientY, drag.clientY)
    };
    const crossing = drag.clientX < drag.startClientX;
    clearGroupSelection();
    const components = [...document.querySelectorAll('#dropLayer .dropped-symbol')].filter(component => {
      const bounds = elementBoundsOnScreen(component);
      if (!bounds) return false;
      const enclosed = bounds.left >= rect.left && bounds.right <= rect.right && bounds.top >= rect.top && bounds.bottom <= rect.bottom;
      const intersects = bounds.right >= rect.left && bounds.left <= rect.right && bounds.bottom >= rect.top && bounds.top <= rect.bottom;
      return crossing ? intersects : enclosed;
    });
    components.forEach(component => {
      component.classList.add('group-selected');
      updateSelectionOutline(component);
    });
    const selectedUids = new Set(components.map(component => component.dataset.uid).filter(Boolean));
    const wires = [...document.querySelectorAll('#wireLayer .connected-wire')].filter(wire => {
      const points = wirePointsOnScreen(wire);
      const fitsBox = crossing ? wireCrossesRect(points, rect) : pointsWithinRect(points, rect);
      const connectsSelectedComponents = selectedUids.has(wire.dataset.fromG) && selectedUids.has(wire.dataset.toG);
      return fitsBox || connectsSelectedComponents;
    });
    wires.forEach(wire => wire.classList.add('wire-selected'));
    window.selectedWire = wires[0] || null;
    if (components.length && typeof select === 'function') select(components[0], false);
    if (state) state.textContent = `${components.length + wires.length} ITEMS SELECTED`;
  }

  function onPointerDown(e) {
    if (running || document.body.classList.contains('live') || window.__escWiringActive || window.__escWireEditingActive) return;
    if (e.button === 2) {
      if (e.target?.closest?.('#sheet, #schematic')) beginMarquee(e);
      return;
    }
    if (e.button !== 0) return;
    if (e.target?.closest?.('.mag-port') || (typeof window.resolvePortFromEvent === 'function' && window.resolvePortFromEvent(e, 11))) return;
    const component = e.target?.closest?.('#dropLayer .dropped-symbol') || null;
    const wire = e.target?.closest?.('#wireLayer .connected-wire') || null;
    const item = component || wire;
    const additive = e.shiftKey || e.ctrlKey || e.metaKey;

    if (additive && item) {
      e.preventDefault();
      e.stopImmediatePropagation();
      selectGroupItem(item);
      return;
    }
    if (item && groupItems().length > 1 && item.classList.contains(component ? 'group-selected' : 'wire-selected')) {
      if (e.detail >= 2) {
        clearGroupSelection();
        return;
      }
      beginGroupDrag(e, groupItems());
      return;
    }
    if (e.target?.closest?.('#schematic') && groupItems().length) clearGroupSelection();
  }

  function onPointerMove(e) {
    if (marqueeDrag && e.pointerId === marqueeDrag.pointerId) {
      e.preventDefault();
      e.stopImmediatePropagation();
      updateMarquee(getPoint(e), e.clientX, e.clientY);
      return;
    }
    if (!groupDrag || e.pointerId !== groupDrag.pointerId) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const point = getPoint(e);
    const rawDx = point.x - groupDrag.startX;
    const rawDy = point.y - groupDrag.startY;
    if (Math.hypot(rawDx, rawDy) > 2) groupDrag.moved = true;
    if (!groupDrag.moved) return;
    const dx = Math.round(rawDx / 12) * 12;
    const dy = Math.round(rawDy / 12) * 12;
    const movingUids = new Set(groupDrag.components.map(record => record.uid).filter(Boolean));
    groupDrag.components.forEach(record => {
      const x = record.x + dx, y = record.y + dy;
      record.element.dataset.x = String(x);
      record.element.dataset.y = String(y);
      applyComponentTransform(record.element, x, y);
    });
    groupDrag.wires.forEach(record => moveGroupWire(record, dx, dy, movingUids));
    if (typeof window.updateWireBranchJoints === 'function') window.updateWireBranchJoints();
    if (typeof window.updateSelectedTerminalAxes === 'function' && typeof selected !== 'undefined') window.updateSelectedTerminalAxes(selected);
  }

  function onPointerEnd(e) {
    if (marqueeDrag && (e.pointerId == null || e.pointerId === marqueeDrag.pointerId)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      updateMarquee(getPoint(e), e.clientX, e.clientY);
      finishMarquee();
      return;
    }
    if (!groupDrag || (e.pointerId != null && e.pointerId !== groupDrag.pointerId)) return;
    e.stopImmediatePropagation();
    groupDrag.components.forEach(record => record.element.classList.remove('moving'));
    groupDrag = null;
  }

  window.addEventListener('pointerdown', onPointerDown, true);
  window.addEventListener('pointermove', onPointerMove, { capture: true, passive: false });
  window.addEventListener('pointerup', onPointerEnd, true);
  window.addEventListener('pointercancel', onPointerEnd, true);
  window.addEventListener('contextmenu', e => {
    if (e.target?.closest?.('#sheet, #schematic')) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
  window.addEventListener('keydown', e => {
    const typing = e.target?.closest?.('input, textarea, select, [contenteditable="true"]');
    if (typing) return;
    if (e.key === 'Escape' && groupItems().length) {
      clearGroupSelection();
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    if ((e.key === 'Delete' || e.key === 'Backspace') && groupItems().length) {
      removeGroupSelection();
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
  document.getElementById('delete')?.addEventListener('click', e => {
    if (!groupItems().length) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    removeGroupSelection();
  }, true);
})();

// Wire Dragging / Rerouting in Edit Mode & Save/Load Helper API
// ============================================================================
(function installWireRerouteDragging() {
  const svgEl = document.getElementById('schematic');
  if (!svgEl) return;
  let draggingWire = null;

  window.addEventListener('pointerdown', function(e) {
    if (running || e.button !== 0 || window.__escWiringActive) return;
    if (e.target && e.target.closest && e.target.closest('.mag-port')) return;
    const wireEl = e.target && e.target.closest ? e.target.closest('#wireLayer .connected-wire') : null;
    if (!wireEl) return;
    const pt = getPoint(e);
    draggingWire = {
      wire: wireEl,
      pointerId: e.pointerId,
      startX: pt.x,
      startY: pt.y,
      moved: false
    };
  }, true);

  window.addEventListener('pointermove', function(e) {
    if (!draggingWire || e.pointerId !== draggingWire.pointerId) return;
    const pt = getPoint(e);
    if (Math.hypot(pt.x - draggingWire.startX, pt.y - draggingWire.startY) > 4) {
      draggingWire.moved = true;
    }
    if (!draggingWire.moved) return;
    const w = draggingWire.wire;
    const aG = document.querySelector(`#dropLayer .dropped-symbol[data-uid="${w.dataset.fromG}"]`);
    const bG = document.querySelector(`#dropLayer .dropped-symbol[data-uid="${w.dataset.toG}"]`);
    if (!aG || !bG) return;
    const a = resolveComponentPort(aG, w.dataset.fromIndex, w.dataset.from);
    const b = resolveComponentPort(bG, w.dataset.toIndex, w.dataset.to);
    if (!a || !b) return;
    const snapX = Math.round(pt.x / 10) * 10;
    const snapY = Math.round(pt.y / 10) * 10;
    if (w.dataset.routingMode === 'click-to-connect') {
      const orient = w.dataset.orthoOrient === 'HVH' ? 'HVH' : 'VHV';
      const midVal = orient === 'HVH' ? snapX : snapY;
      const route = computeClickToConnectRoute(a, b, midVal, orient);
      w.dataset.orthoOrient = route.orient;
      w.dataset.orthoMid = String(route.mid);
      w.dataset.customPoints = route.points;
      w.setAttribute('points', route.points);
      return;
    }
    const waypoints = [{ x: snapX, y: snapY }];
    w.dataset.waypoints = JSON.stringify(waypoints);
    w.setAttribute('points', computeWirePoints(a, b, waypoints));
  }, true);

  const endWireDrag = function(e) {
    if (!draggingWire || (e.pointerId != null && e.pointerId !== draggingWire.pointerId)) return;
    if (draggingWire.moved && state) {
      state.textContent = 'WIRE REROUTED';
    }
    draggingWire = null;
  };
  window.addEventListener('pointerup', endWireDrag, true);
  window.addEventListener('pointercancel', endWireDrag, true);
})();

window.exportEscProjectData = function(name = 'Untitled ESC Drawing') {
  const drop = document.getElementById('dropLayer');
  const wireLayerEl = document.getElementById('wireLayer');
  const wiresClone = wireLayerEl ? wireLayerEl.cloneNode(true) : null;
  wiresClone?.querySelectorAll('.wire-preview').forEach(n => n.remove());
  return JSON.stringify({
    format: 'ESC-DRAWING',
    version: 1,
    name,
    savedAt: new Date().toISOString(),
    viewBox: svg?.getAttribute('viewBox') || '0 0 1200 760',
    elements: drop ? drop.innerHTML : '',
    wires: wiresClone ? wiresClone.innerHTML : ''
  }, null, 2);
};

window.importEscProjectData = function(jsonStr) {
  const data = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
  if (!data || data.format !== 'ESC-DRAWING') throw new Error('Invalid ESC drawing format');
  const drop = document.getElementById('dropLayer');
  const wireLayerEl = document.getElementById('wireLayer');
  if (drop) {
    drop.innerHTML = data.elements || '';
  }
  if (wireLayerEl) {
    wireLayerEl.querySelectorAll('.connected-wire').forEach(w => w.remove());
    if (data.wires) {
      const temp = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      temp.innerHTML = data.wires;
      const previewEl = wireLayerEl.querySelector('.wire-preview');
      [...temp.querySelectorAll('.connected-wire')].forEach(w => {
        if (previewEl) wireLayerEl.insertBefore(w, previewEl);
        else wireLayerEl.appendChild(w);
      });
    }
  }
  drop?.querySelectorAll('.dropped-symbol').forEach(g => {
    upgradeComponentToInlineSvg(g);
    syncComponentPorts(g);
    enableMove(g);
    layoutComponentAnnotations(g);
  });
  refreshAllWires();
  syncConnectedPortStates();
  if (running) evaluateCircuitSimulation();
  return true;
};

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

/* Replaced by V131 Run-Mode Spring-Return & Maintained Switch Controller */


/* === ESC V131 REFINEMENTS: SPRING-RETURN PUSHBUTTONS, 3-POS SELECTOR BAR, WIRE JOINT POINTS === */
(function installEscV131Refinements() {
  const NS = 'http://www.w3.org/2000/svg';

  // -------------------------------------------------------------------------
  // A. SPRING-RETURN (MOMENTARY) PUSHBUTTONS vs MAINTAINED SWITCHES
  // -------------------------------------------------------------------------
  function isSpringReturnSwitch(g) {
    if (!g) return false;
    if (g.dataset.switchReturnMode === 'maintained') return false;
    if (g.dataset.switchReturnMode === 'spring') return true;
    const asset = getAssetBasename(g.dataset.symbolFile || g.dataset.porttype || g.dataset.type || '');
    const text = ((g.dataset.name || '') + ' ' + (g.dataset.type || '') + ' ' + asset).toLowerCase();
    return /pushbutton|push\s*button|spring[_\s-]*return/.test(text);
  }
  window.isSpringReturnSwitch = isSpringReturnSwitch;

  function isThreePositionSelector(g) {
    if (!g) return false;
    const asset = getAssetBasename(g.dataset.symbolFile || g.dataset.porttype || g.dataset.type || '');
    const text = ((g.dataset.name || '') + ' ' + (g.dataset.type || '') + ' ' + asset).toLowerCase();
    return asset.startsWith('switch_3_position_selector') || /3-position\s*selector/.test(text);
  }
  window.isThreePositionSelector = isThreePositionSelector;

  function getSelectorSwitchMode(g) {
    if (!g) return window.__escDefaultSelectorMode || 'I-II-III';
    if (g.dataset.selectorMode === 'I-0-II' || g.dataset.selectorMode === 'I-II-III') {
      return g.dataset.selectorMode;
    }
    const asset = getAssetBasename(g.dataset.symbolFile || g.dataset.porttype || g.dataset.type || '');
    return asset.includes('i-0-ii') ? 'I-0-II' : 'I-II-III';
  }
  window.getSelectorSwitchMode = getSelectorSwitchMode;

  window.__escActiveSpringSwitch = null;

  function releaseActiveSpringSwitch() {
    const g = window.__escActiveSpringSwitch;
    if (!g) return;
    window.__escActiveSpringSwitch = null;
    if (g.isConnected && running) {
      g.dataset.simState = '0';
      evaluateCircuitSimulation();
      const label = g.dataset.ref ? `${g.dataset.ref} (${g.dataset.name || 'Pushbutton'})` : (g.dataset.name || 'Pushbutton');
      if (state) state.textContent = `SIMULATION • ${label.toUpperCase()} → SPRING RETURNED TO NORMAL`;
    }
    updateSelectorSwitchBarUI();
  }
  window.releaseActiveSpringSwitch = releaseActiveSpringSwitch;

  document.getElementById('schematic')?.addEventListener('pointerdown', function(e) {
    if (!running || e.button !== 0) return;
    if (e.target && e.target.closest && e.target.closest('.mag-port')) return;
    if (typeof window.resolvePortFromEvent === 'function' && window.resolvePortFromEvent(e, 11)) return;
    const g = e.target && e.target.closest ? e.target.closest('#dropLayer .dropped-symbol') : null;
    if (!g || !isOperableInRunMode(g)) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();

    // Spring-return (momentary) pushbutton: press & hold to operate, release to spring back!
    // (Holding Shift while clicking allows latching for hands-free testing if desired.)
    if (isSpringReturnSwitch(g) && !e.shiftKey) {
      g.dataset.simState = '1';
      window.__escActiveSpringSwitch = g;
      evaluateCircuitSimulation();
      const label = g.dataset.ref ? `${g.dataset.ref} (${g.dataset.name || 'Pushbutton'})` : (g.dataset.name || 'Pushbutton');
      if (state) state.textContent = `SIMULATION • ${label.toUpperCase()} PRESSED (SPRING RETURN — RELEASE TO RETURN)`;
      return;
    }

    toggleComponentInRunMode(g, !!e.shiftKey);
    updateSelectorSwitchBarUI();
  }, true);

  window.addEventListener('pointerup', releaseActiveSpringSwitch, true);
  window.addEventListener('pointercancel', releaseActiveSpringSwitch, true);
  window.addEventListener('blur', releaseActiveSpringSwitch);

  // -------------------------------------------------------------------------
  // B. 3-POSITION SELECTOR SWITCH (I-II-III & I-0-II) SAME SIZE &
  //    LOWER-LEFT BOTTOM SWITCH CHANGE OPTION BAR
  // -------------------------------------------------------------------------
  window.__escDefaultSelectorMode = 'I-II-III';
  window.__escLastSelectorSwitch = null;

  function setSelectorSwitchMode(g, targetMode) {
    const mode = (String(targetMode || '').toUpperCase() === 'I-0-II') ? 'I-0-II' : 'I-II-III';
    window.__escDefaultSelectorMode = mode;
    if (!g || !isThreePositionSelector(g)) {
      updateSelectorSwitchBarUI();
      return;
    }

    const oldPorts = portsFor(g);
    const newFile = mode === 'I-0-II'
      ? 'components/Switches/switch_3_position_selector I-0-II(1).svg'
      : 'components/Switches/switch_3_position_selector I-II-III(1).svg';
    const newName = mode === 'I-0-II'
      ? '3-Position Selector Switch I-0-II'
      : '3-Position Selector Switch I-II-III';

    g.dataset.selectorMode = mode;
    g.dataset.symbolFile = newFile;
    g.dataset.porttype = newFile;
    g.dataset.type = newName;
    g.dataset.name = newName;
    delete g.dataset.terminals;
    delete g.dataset.escBoxReady;

    const ns = g.querySelector(':scope > svg:not(.select-box)');
    if (ns) delete ns.dataset.inlineUpgraded;

    upgradeComponentToInlineSvg(g);
    syncComponentPorts(g);

    const newPorts = portsFor(g);
    const uid = g.dataset.uid;
    // Remap existing connected wires gracefully
    document.querySelectorAll('#wireLayer .connected-wire').forEach(w => {
      if (w.dataset.fromG === uid) {
        const oldLbl = w.dataset.from;
        const oldIdx = Number(w.dataset.fromIndex);
        let mapped = newPorts.find(p => p.label === oldLbl);
        if (!mapped) {
          // If switching I-II-III (ports 0:11, 1:12, 2:14, 3:16) <-> I-0-II (ports 0:11, 1:12, 2:14 at right)
          if (mode === 'I-0-II' && (oldLbl === '16' || oldIdx === 3)) mapped = newPorts[2];
          else if (mode === 'I-0-II' && oldIdx === 2) mapped = newPorts[2];
          else mapped = newPorts[Math.min(oldIdx, newPorts.length - 1)];
        }
        if (mapped) {
          w.dataset.fromIndex = String(mapped.index);
          w.dataset.from = mapped.label;
        }
      }
      if (w.dataset.toG === uid) {
        const oldLbl = w.dataset.to;
        const oldIdx = Number(w.dataset.toIndex);
        let mapped = newPorts.find(p => p.label === oldLbl);
        if (!mapped) {
          if (mode === 'I-0-II' && (oldLbl === '16' || oldIdx === 3)) mapped = newPorts[2];
          else if (mode === 'I-0-II' && oldIdx === 2) mapped = newPorts[2];
          else mapped = newPorts[Math.min(oldIdx, newPorts.length - 1)];
        }
        if (mapped) {
          w.dataset.toIndex = String(mapped.index);
          w.dataset.to = mapped.label;
        }
      }
    });

    const titleEl = g.querySelector('title');
    if (titleEl) titleEl.textContent = (g.dataset.ref || '') + ' — ' + newName;
    if (selected === g) {
      const propTitle = document.getElementById('propertyTitle');
      if (propTitle) propTitle.textContent = newName;
      const propType = document.getElementById('propType');
      if (propType) propType.value = newName;
    }

    applyVisualSwitchPosition(g, g.dataset.simEffectiveState || g.dataset.simState || '0');
    refreshWiresForComponent(g);
    syncConnectedPortStates();
    if (running) evaluateCircuitSimulation();
    updateSelectorSwitchBarUI();
    if (state) state.textContent = `SELECTOR SWITCH ${(g.dataset.ref || 'S').toUpperCase()} SET TO ${mode}`;
  }
  window.setSelectorSwitchMode = setSelectorSwitchMode;

  function getActiveSelectorComponent() {
    if (selected && selected.isConnected && isThreePositionSelector(selected)) {
      window.__escLastSelectorSwitch = selected;
      return selected;
    }
    if (window.__escLastSelectorSwitch && window.__escLastSelectorSwitch.isConnected && isThreePositionSelector(window.__escLastSelectorSwitch)) {
      return window.__escLastSelectorSwitch;
    }
    const allSel = [...document.querySelectorAll('#dropLayer .dropped-symbol')].filter(isThreePositionSelector);
    if (allSel.length > 0) {
      window.__escLastSelectorSwitch = allSel[allSel.length - 1];
      return window.__escLastSelectorSwitch;
    }
    return null;
  }

  function ensureSelectorSwitchBar() {
    const workEl = document.querySelector('.work');
    if (!workEl) return null;
    let bar = document.getElementById('escSelectorSwitchBar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'escSelectorSwitchBar';
      bar.className = 'esc-selector-switch-bar';
      bar.setAttribute('role', 'group');
      bar.setAttribute('aria-label', '3-Position Selector Switch Option');
      bar.innerHTML = `
        <span class="bar-title" id="escSelectorBarTitle">SWITCH:</span>
        <button type="button" class="sel-mode-btn active" data-sel-mode="I-II-III" title="Set 3-Position Selector Switch to I-II-III">I-II-III</button>
        <button type="button" class="sel-mode-btn" data-sel-mode="I-0-II" title="Set 3-Position Selector Switch to I-0-II">I-0-II</button>
        <span class="bar-sep"></span>
        <button type="button" class="sel-pos-btn active" data-sel-pos="0" title="Position 1">I</button>
        <button type="button" class="sel-pos-btn" data-sel-pos="1" title="Position 2">II</button>
        <button type="button" class="sel-pos-btn" data-sel-pos="2" title="Position 3">III</button>
      `;
      workEl.appendChild(bar);

      bar.addEventListener('click', function(e) {
        const modeBtn = e.target.closest('.sel-mode-btn');
        if (modeBtn) {
          e.preventDefault();
          e.stopPropagation();
          const mode = modeBtn.dataset.selMode;
          const targetG = getActiveSelectorComponent();
          if (targetG) {
            setSelectorSwitchMode(targetG, mode);
          } else {
            window.__escDefaultSelectorMode = mode;
            updateSelectorSwitchBarUI();
          }
          return;
        }
        const posBtn = e.target.closest('.sel-pos-btn');
        if (posBtn) {
          e.preventDefault();
          e.stopPropagation();
          const pos = posBtn.dataset.selPos || '0';
          const targetG = getActiveSelectorComponent();
          if (targetG) {
            targetG.dataset.simState = pos;
            targetG.dataset.simEffectiveState = pos;
            applyVisualSwitchPosition(targetG, pos);
            if (running) evaluateCircuitSimulation();
            updateSelectorSwitchBarUI();
            const mode = getSelectorSwitchMode(targetG);
            const posNames = mode === 'I-0-II' ? ['I', '0', 'II'] : ['I', 'II', 'III'];
            if (state) state.textContent = `SELECTOR ${(targetG.dataset.ref || 'S').toUpperCase()} (${mode}) → POSITION ${posNames[Number(pos)] || 'I'}`;
          }
        }
      });
    }
    return bar;
  }

  function updateSelectorSwitchBarUI() {
    const bar = ensureSelectorSwitchBar();
    if (!bar) return;
    const allSel = [...document.querySelectorAll('#dropLayer .dropped-symbol')].filter(isThreePositionSelector);
    const switchesCatOpen = Boolean(document.querySelector('#libraryGroups .component-category.active[data-category="Switches"]'));
    const targetG = getActiveSelectorComponent();
    const shouldShow = (allSel.length > 0) || switchesCatOpen;
    bar.classList.toggle('visible', shouldShow);
    if (!shouldShow) return;

    const mode = targetG ? getSelectorSwitchMode(targetG) : (window.__escDefaultSelectorMode || 'I-II-III');
    const pos = targetG ? String(targetG.dataset.simEffectiveState || targetG.dataset.simState || '0') : '0';
    const titleSpan = bar.querySelector('#escSelectorBarTitle');
    if (titleSpan) {
      titleSpan.textContent = targetG ? `${targetG.dataset.ref || 'S'} SWITCH:` : 'SELECTOR:';
    }
    bar.querySelectorAll('.sel-mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.selMode === mode);
    });
    const posLabels = mode === 'I-0-II' ? ['I', '0', 'II'] : ['I', 'II', 'III'];
    bar.querySelectorAll('.sel-pos-btn').forEach((btn, idx) => {
      btn.textContent = posLabels[idx] || String(idx + 1);
      btn.classList.toggle('active', btn.dataset.selPos === pos);
    });
  }
  window.updateSelectorSwitchBarUI = updateSelectorSwitchBarUI;

  // Allow clicking the lower-left "I-II-III" / "I-0-II" text directly on the selector switch symbol to toggle between I-II-III and I-0-II
  document.getElementById('schematic')?.addEventListener('pointerdown', function(e) {
    if (running || e.button !== 0) return;
    const modeTxt = e.target && e.target.closest ? e.target.closest('#svg_selector_mode_text') : null;
    if (!modeTxt) return;
    const g = modeTxt.closest('.dropped-symbol');
    if (!g || !isThreePositionSelector(g)) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    const curMode = getSelectorSwitchMode(g);
    const nextMode = curMode === 'I-II-III' ? 'I-0-II' : 'I-II-III';
    setSelectorSwitchMode(g, nextMode);
  }, true);

  // Observe selection, library category clicks, and dropLayer changes to keep the lower-left selector bar updated
  const dropEl = document.getElementById('dropLayer');
  if (dropEl) {
    new MutationObserver(() => updateSelectorSwitchBarUI()).observe(dropEl, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'data-selector-mode', 'data-sim-state']
    });
  }
  document.getElementById('libraryGroups')?.addEventListener('click', () => {
    setTimeout(updateSelectorSwitchBarUI, 20);
  });

  // Also inject Selector Switch Mode (I-II-III vs I-0-II) and Switch Return Mode (Spring Return vs Maintained) into #propertyPanel
  const dynBox = document.getElementById('escSimPropsContainer');
  if (dynBox) {
    const injectSwitchProps = () => {
      if (!selected || !selected.isConnected) return;
      if (classifySimComponent(selected) !== 'switch') return;
      if (isThreePositionSelector(selected)) {
        if (!dynBox.querySelector('#propSelectorMode')) {
          const curMode = getSelectorSwitchMode(selected);
          const lbl = document.createElement('label');
          lbl.innerHTML = `Selector Switch Option<select id="propSelectorMode">
            <option value="I-II-III" ${curMode === 'I-II-III' ? 'selected' : ''}>I-II-III (3-Throw)</option>
            <option value="I-0-II" ${curMode === 'I-0-II' ? 'selected' : ''}>I-0-II (Center OFF)</option>
          </select>`;
          dynBox.appendChild(lbl);
        }
      } else {
        if (!dynBox.querySelector('#propSwitchReturnMode')) {
          const isSpring = isSpringReturnSwitch(selected);
          const lbl = document.createElement('label');
          lbl.innerHTML = `Switch Action<select id="propSwitchReturnMode">
            <option value="spring" ${isSpring ? 'selected' : ''}>Spring Return (Momentary)</option>
            <option value="maintained" ${!isSpring ? 'selected' : ''}>Maintained (Latched)</option>
          </select>`;
          dynBox.appendChild(lbl);
        }
      }
    };
    new MutationObserver(injectSwitchProps).observe(dynBox, { childList: true });
    document.getElementById('propertyOk')?.addEventListener('click', function() {
      if (!selected || !selected.isConnected) return;
      const selModeEl = document.getElementById('propSelectorMode');
      if (selModeEl && selModeEl.value && isThreePositionSelector(selected)) {
        setSelectorSwitchMode(selected, selModeEl.value);
      }
      const retModeEl = document.getElementById('propSwitchReturnMode');
      if (retModeEl && retModeEl.value) {
        selected.dataset.switchReturnMode = retModeEl.value;
      }
    }, true);
  }

  // -------------------------------------------------------------------------
  // C. WIRE BRANCH JOINT POINTS (JUNCTION DOTS) & WIRE-TO-WIRE T-BRANCHING
  // -------------------------------------------------------------------------
  function parseWirePolylinePoints(wireEl) {
    const raw = (wireEl.getAttribute('points') || '').trim();
    if (!raw) return [];
    const pts = [];
    raw.split(/\s+/).forEach(tok => {
      const [xs, ys] = tok.split(',');
      const x = parseFloat(xs), y = parseFloat(ys);
      if (Number.isFinite(x) && Number.isFinite(y)) {
        if (!pts.length || Math.hypot(x - pts[pts.length - 1].x, y - pts[pts.length - 1].y) > 0.5) {
          pts.push({ x, y });
        }
      }
    });
    return pts;
  }

  function pointToSegmentDistance(px, py, ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay;
    const lenSq = dx * dx + dy * dy;
    if (lenSq < 0.0001) return { dist: Math.hypot(px - ax, py - ay), x: ax, y: ay, t: 0 };
    let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
    const qx = ax + t * dx, qy = ay + t * dy;
    return { dist: Math.hypot(px - qx, py - qy), x: qx, y: qy, t };
  }

  function getWireDirectionsAtPoint(pts, px, py, tol = 2.5) {
    const dirs = [];
    const addDir = (dx, dy) => {
      const len = Math.hypot(dx, dy);
      if (len < 1.5) return;
      const ux = Math.round((dx / len) * 10) / 10;
      const uy = Math.round((dy / len) * 10) / 10;
      if (!dirs.some(d => Math.hypot(d.ux - ux, d.uy - uy) < 0.35)) {
        dirs.push({ ux, uy });
      }
    };
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      const proj = pointToSegmentDistance(px, py, a.x, a.y, b.x, b.y);
      if (proj.dist <= tol) {
        addDir(a.x - px, a.y - py);
        addDir(b.x - px, b.y - py);
      }
    }
    return dirs;
  }

  function updateWireBranchJoints() {
    const wireLayer = document.getElementById('wireLayer');
    if (!wireLayer) return;
    let jointLayer = document.getElementById('wireJointLayer');
    if (!jointLayer) {
      jointLayer = document.createElementNS(NS, 'g');
      jointLayer.setAttribute('id', 'wireJointLayer');
      wireLayer.appendChild(jointLayer);
    } else {
      // Keep jointLayer at the top of wireLayer
      if ( wireLayer.lastElementChild !== jointLayer ) {
        wireLayer.appendChild(jointLayer);
      }
      jointLayer.replaceChildren();
    }

    const wires = [...wireLayer.querySelectorAll('.connected-wire')];
    if (wires.length < 2) return;

    const wireData = wires.map(w => ({
      el: w,
      pts: parseWirePolylinePoints(w),
      classes: [...w.classList].filter(c => c.startsWith('wire-'))
    })).filter(w => w.pts.length >= 2);

    const candidatePoints = [];
    const addCandidate = (x, y, forceJunction = false) => {
      const rx = Math.round(x * 10) / 10;
      const ry = Math.round(y * 10) / 10;
      const existing = candidatePoints.find(p => Math.hypot(p.x - rx, p.y - ry) <= 3.5);
      if (existing) {
        if (forceJunction) existing.force = true;
      } else {
        candidatePoints.push({ x: rx, y: ry, force: forceJunction });
      }
    };

    // 1. Collect all vertices of all wires that touch another wire's segment or vertex
    for (let i = 0; i < wireData.length; i++) {
      const wA = wireData[i];
      for (let j = i + 1; j < wireData.length; j++) {
        const wB = wireData[j];
        // Check vertices of wA against segments of wB
        for (let vi = 0; vi < wA.pts.length; vi++) {
          const v = wA.pts[vi];
          const isEndpointA = (vi === 0 || vi === wA.pts.length - 1);
          for (let si = 0; si < wB.pts.length - 1; si++) {
            const b0 = wB.pts[si], b1 = wB.pts[si + 1];
            const proj = pointToSegmentDistance(v.x, v.y, b0.x, b0.y, b1.x, b1.y);
            if (proj.dist <= 2.5) {
              // If an endpoint of wA lands on the interior of a segment of wB, it's definitely a T-branch!
              const onInteriorB = (Math.hypot(proj.x - b0.x, proj.y - b0.y) > 3 && Math.hypot(proj.x - b1.x, proj.y - b1.y) > 3);
              addCandidate(proj.x, proj.y, isEndpointA && onInteriorB);
            }
          }
        }
        // Check vertices of wB against segments of wA
        for (let vi = 0; vi < wB.pts.length; vi++) {
          const v = wB.pts[vi];
          const isEndpointB = (vi === 0 || vi === wB.pts.length - 1);
          for (let si = 0; si < wA.pts.length - 1; si++) {
            const a0 = wA.pts[si], a1 = wA.pts[si + 1];
            const proj = pointToSegmentDistance(v.x, v.y, a0.x, a0.y, a1.x, a1.y);
            if (proj.dist <= 2.5) {
              const onInteriorA = (Math.hypot(proj.x - a0.x, proj.y - a0.y) > 3 && Math.hypot(proj.x - a1.x, proj.y - a1.y) > 3);
              addCandidate(proj.x, proj.y, isEndpointB && onInteriorA);
            }
          }
        }
      }
    }

    // 2. Filter candidates: a candidate is a true branch/joint point if:
    //    - It is forced (e.g. wire endpoint landing on another wire's interior), OR
    //    - 3 or more distinct wire segment directions meet at (x, y) (e.g. T-split where two wires sharing a stem diverge!), OR
    //    - 2 or more wire endpoints meet at the same terminal and diverge immediately (2+ distinct directions at a shared terminal).
    candidatePoints.forEach(cand => {
      const allDirs = [];
      let endpointCount = 0;
      const liveClasses = new Set();

      wireData.forEach(w => {
        const dirs = getWireDirectionsAtPoint(w.pts, cand.x, cand.y, 2.8);
        if (dirs.length > 0) {
          w.classes.forEach(c => liveClasses.add(c));
          dirs.forEach(d => {
            if (!allDirs.some(ad => Math.hypot(ad.ux - d.ux, ad.uy - d.uy) < 0.35)) {
              allDirs.push(d);
            }
          });
        }
        const pStart = w.pts[0], pEnd = w.pts[w.pts.length - 1];
        if (Math.hypot(pStart.x - cand.x, pStart.y - cand.y) <= 2.8 || Math.hypot(pEnd.x - cand.x, pEnd.y - cand.y) <= 2.8) {
          endpointCount++;
        }
      });

      const isBranchJoint = cand.force || (allDirs.length >= 3) || (endpointCount >= 2 && allDirs.length >= 2);
      if (!isBranchJoint) return;

      const dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('class', ['wire-joint-point', ...liveClasses].join(' '));
      dot.setAttribute('cx', String(cand.x));
      dot.setAttribute('cy', String(cand.y));
      dot.setAttribute('r', '2.2');
      jointLayer.appendChild(dot);
    });
  }
  window.updateWireBranchJoints = updateWireBranchJoints;

  // Support Wire-to-Wire T-Branching when clicking on an existing wire while wiring from a terminal
  function findNearestPointOnExistingWire(pt, maxDist = 9) {
    const wireLayer = document.getElementById('wireLayer');
    if (!wireLayer) return null;
    let best = null, bestD = maxDist;
    for (const w of wireLayer.querySelectorAll('.connected-wire')) {
      const pts = parseWirePolylinePoints(w);
      for (let i = 0; i < pts.length - 1; i++) {
        const proj = pointToSegmentDistance(pt.x, pt.y, pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y);
        if (proj.dist <= bestD) {
          bestD = proj.dist;
          best = {
            wire: w,
            x: Math.round(proj.x * 100) / 100,
            y: Math.round(proj.y * 100) / 100,
            isHorizontal: Math.abs(pts[i].y - pts[i + 1].y) <= Math.abs(pts[i].x - pts[i + 1].x)
          };
        }
      }
    }
    return best;
  }
  window.findNearestPointOnExistingWire = findNearestPointOnExistingWire;

  // Enhance refreshWiresForComponent so wires with a fixed branch point (dataset.branchWireFixed === "1")
  // route cleanly to their branch point on the target wire, and then update all joint points.
  const _origRefreshWiresForComponent = window.refreshWiresForComponent;
  window.refreshWiresForComponent = function(moved) {
    if (typeof _origRefreshWiresForComponent === 'function') {
      _origRefreshWiresForComponent(moved);
    }
    const layer = document.getElementById('wireLayer');
    if (layer) {
      for (const wire of layer.querySelectorAll('.connected-wire[data-branch-wire-fixed="1"]')) {
        const aG = document.querySelector(`#dropLayer .dropped-symbol[data-uid="${wire.dataset.fromG}"]`);
        if (!aG) continue;
        const a = resolveComponentPort(aG, wire.dataset.fromIndex, wire.dataset.from);
        if (!a) continue;
        const bx = parseFloat(wire.dataset.branchX);
        const by = parseFloat(wire.dataset.branchY);
        const bSide = wire.dataset.branchSide || 'top';
        if (Number.isFinite(bx) && Number.isFinite(by)) {
          wire.setAttribute('points', computeWirePoints(a, { x: bx, y: by, side: bSide, index: 0 }, []));
        }
      }
    }
    updateWireBranchJoints();
  };
  refreshWiresForComponent = window.refreshWiresForComponent;

  const _origRefreshAllWires = window.refreshAllWires;
  window.refreshAllWires = function() {
    if (typeof _origRefreshAllWires === 'function') _origRefreshAllWires();
    updateWireBranchJoints();
  };
  refreshAllWires = window.refreshAllWires;

  const _origCreateWireConnection = window.createWireConnection;
  window.createWireConnection = function(fromPort, toPort, waypoints = []) {
    const line = _origCreateWireConnection ? _origCreateWireConnection(fromPort, toPort, waypoints) : null;
    updateWireBranchJoints();
    return line;
  };

  const _origUpdateWireConductorId = window.updateWireConductorIdentification;
  window.updateWireConductorIdentification = function(livePotentialsMap) {
    if (typeof _origUpdateWireConductorId === 'function') {
      _origUpdateWireConductorId(livePotentialsMap);
    }
    updateWireBranchJoints();
  };
  updateWireConductorIdentification = window.updateWireConductorIdentification;

  updateSelectorSwitchBarUI();
  updateWireBranchJoints();
})();
