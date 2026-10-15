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
 wires.forEach(w=>{
  w.classList.add('wire-live');
  const ends=((w.dataset.from||'')+' '+(w.dataset.to||'')).toUpperCase();
  w.classList.toggle('wire-neutral',/\bN\b|NEUTRAL|NEG|−|-/.test(ends));
 });
 render();
};
document.getElementById('stop').onclick=()=>{running=false;document.querySelectorAll('#dropLayer .device-on').forEach(g=>g.classList.remove('device-on'));document.querySelectorAll('#wireLayer .connected-wire').forEach(w=>w.classList.remove('wire-live'));render()};
const _threeDBtn=document.getElementById('threeD');if(_threeDBtn)_threeDBtn.onclick=()=>alert('The 2D physical component view is the next workspace to build. Your existing SCHEMATIC workspace is unchanged.');
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
const SVG_TERMINAL_CATALOG = {"01_dc_negative.svg":{"vb":[100.0,100.0],"ports":[{"vx":50.0,"vy":82.5,"vw":9.0,"vh":9.0,"label":"NEG","side":"bottom"}]},"02_dc_positive.svg":{"vb":[100.0,100.0],"ports":[{"vx":50.0,"vy":82.5,"vw":9.0,"vh":9.0,"label":"POS","side":"bottom"}]},"03_earth_ground.svg":{"vb":[100.0,100.0],"ports":[{"vx":50.0,"vy":8.0,"vw":9.0,"vh":9.0,"label":"PE","side":"top"}]},"04_n_terminal.svg":{"vb":[100.0,100.0],"ports":[{"vx":50.0,"vy":82.5,"vw":9.0,"vh":9.0,"label":"N","side":"bottom"}]},"05_l1_terminal.svg":{"vb":[100.0,100.0],"ports":[{"vx":50.0,"vy":82.5,"vw":9.0,"vh":9.0,"label":"L1","side":"bottom"}]},"06_l2_terminal.svg":{"vb":[100.0,100.0],"ports":[{"vx":50.0,"vy":82.5,"vw":9.0,"vh":9.0,"label":"L2","side":"bottom"}]},"07_l3_terminal.svg":{"vb":[100.0,100.0],"ports":[{"vx":50.0,"vy":82.5,"vw":9.0,"vh":9.0,"label":"L3","side":"bottom"}]},"08_pe_terminal.svg":{"vb":[100.0,100.0],"ports":[{"vx":50.0,"vy":82.5,"vw":9.0,"vh":9.0,"label":"PE","side":"bottom"}]},"09_three_phase_l1_l2_l3.svg":{"vb":[160.0,100.0],"ports":[{"vx":30.0,"vy":82.5,"vw":9.0,"vh":9.0,"label":"L1","side":"bottom"},{"vx":80.0,"vy":82.5,"vw":9.0,"vh":9.0,"label":"L2","side":"bottom"},{"vx":130.0,"vy":82.5,"vw":9.0,"vh":9.0,"label":"L3","side":"bottom"}]},"10_three_phase_neutral.svg":{"vb":[200.0,100.0],"ports":[{"vx":25.0,"vy":82.5,"vw":9.0,"vh":9.0,"label":"L1","side":"bottom"},{"vx":75.0,"vy":82.5,"vw":9.0,"vh":9.0,"label":"L2","side":"bottom"},{"vx":125.0,"vy":82.5,"vw":9.0,"vh":9.0,"label":"L3","side":"bottom"},{"vx":175.0,"vy":82.5,"vw":9.0,"vh":9.0,"label":"N","side":"bottom"}]},"11_three_phase_neutral_pe.svg":{"vb":[250.0,100.0],"ports":[{"vx":25.0,"vy":82.5,"vw":9.0,"vh":9.0,"label":"L1","side":"bottom"},{"vx":75.0,"vy":82.5,"vw":9.0,"vh":9.0,"label":"L2","side":"bottom"},{"vx":125.0,"vy":82.5,"vw":9.0,"vh":9.0,"label":"L3","side":"bottom"},{"vx":175.0,"vy":82.5,"vw":9.0,"vh":9.0,"label":"N","side":"bottom"},{"vx":225.0,"vy":82.5,"vw":9.0,"vh":9.0,"label":"PE","side":"bottom"}]},"esc-contactor-coil.svg":{"vb":[100.0,120.0],"ports":[{"vx":50.0,"vy":13.0,"vw":9.0,"vh":9.0,"label":"A1","side":"top"},{"vx":50.0,"vy":95.5,"vw":9.0,"vh":9.0,"label":"A2","side":"bottom"}]},"esc-tof-timer-coil.svg":{"vb":[100.0,120.0],"ports":[{"vx":50.0,"vy":13.0,"vw":9.0,"vh":9.0,"label":"A1","side":"top"},{"vx":50.0,"vy":95.5,"vw":9.0,"vh":9.0,"label":"A2","side":"bottom"}]},"esc-ton-timer-coil.svg":{"vb":[100.0,120.0],"ports":[{"vx":50.0,"vy":13.0,"vw":9.0,"vh":9.0,"label":"A1","side":"top"},{"vx":50.0,"vy":95.5,"vw":9.0,"vh":9.0,"label":"A2","side":"bottom"}]},"esc-ton-tof-timer-coil.svg":{"vb":[100.0,120.0],"ports":[{"vx":50.0,"vy":13.0,"vw":9.0,"vh":9.0,"label":"A1","side":"top"},{"vx":50.0,"vy":95.5,"vw":9.0,"vh":9.0,"label":"A2","side":"bottom"}]},"contactor_coil.svg":{"vb":[100.0,120.0],"ports":[{"vx":50.0,"vy":13.0,"vw":9.0,"vh":9.0,"label":"A1","side":"top"},{"vx":50.0,"vy":95.5,"vw":9.0,"vh":9.0,"label":"A2","side":"bottom"}]},"tof_timer_coil.svg":{"vb":[100.0,120.0],"ports":[{"vx":50.0,"vy":13.0,"vw":9.0,"vh":9.0,"label":"A1","side":"top"},{"vx":50.0,"vy":95.5,"vw":9.0,"vh":9.0,"label":"A2","side":"bottom"}]},"ton_tof_timer_coil.svg":{"vb":[100.0,120.0],"ports":[{"vx":50.0,"vy":13.0,"vw":9.0,"vh":9.0,"label":"A1","side":"top"},{"vx":50.0,"vy":95.5,"vw":9.0,"vh":9.0,"label":"A2","side":"bottom"}]},"ton_timer_coil.svg":{"vb":[100.0,120.0],"ports":[{"vx":50.0,"vy":13.0,"vw":9.0,"vh":9.0,"label":"A1","side":"top"},{"vx":50.0,"vy":95.5,"vw":9.0,"vh":9.0,"label":"A2","side":"bottom"}]},"contact_01.svg":{"vb":[127.0,148.0],"ports":[{"vx":56.5,"vy":15.5,"vw":11.0,"vh":11.0,"label":"11","side":"top"},{"vx":27.5,"vy":132.5,"vw":11.0,"vh":11.0,"label":"12","side":"bottom"},{"vx":85.5,"vy":132.5,"vw":11.0,"vh":11.0,"label":"14","side":"bottom"}]},"contact_02.svg":{"vb":[198.0,186.0],"ports":[{"vx":71.0,"vy":15.0,"vw":14.0,"vh":14.0,"label":"13","side":"top"},{"vx":147.5,"vy":15.5,"vw":15.0,"vh":15.0,"label":"21","side":"top"},{"vx":71.0,"vy":168.0,"vw":14.0,"vh":14.0,"label":"14","side":"bottom"},{"vx":147.5,"vy":167.5,"vw":15.0,"vh":15.0,"label":"22","side":"bottom"}]},"contact_03.svg":{"vb":[155.0,199.0],"ports":[{"vx":101.0,"vy":17.0,"vw":16.0,"vh":16.0,"label":"13","side":"top"},{"vx":101.0,"vy":180.0,"vw":16.0,"vh":16.0,"label":"14","side":"bottom"}]},"contact_04.svg":{"vb":[123.0,209.0],"ports":[{"vx":67.5,"vy":18.5,"vw":17.0,"vh":17.0,"label":"13","side":"top"},{"vx":67.5,"vy":189.5,"vw":17.0,"vh":17.0,"label":"14","side":"bottom"}]},"contact_05.svg":{"vb":[243.0,243.0],"ports":[{"vx":77.5,"vy":19.5,"vw":19.0,"vh":19.0,"label":"13","side":"top"},{"vx":178.5,"vy":19.5,"vw":19.0,"vh":19.0,"label":"21","side":"top"},{"vx":77.5,"vy":221.5,"vw":19.0,"vh":19.0,"label":"14","side":"bottom"},{"vx":178.5,"vy":221.5,"vw":19.0,"vh":19.0,"label":"22","side":"bottom"}]},"contact_06.svg":{"vb":[183.0,232.0],"ports":[{"vx":74.0,"vy":19.0,"vw":18.0,"vh":18.0,"label":"11","side":"top"},{"vx":26.0,"vy":211.0,"vw":18.0,"vh":18.0,"label":"12","side":"bottom"},{"vx":122.0,"vy":211.0,"vw":18.0,"vh":18.0,"label":"14","side":"bottom"}]},"contact_07.svg":{"vb":[198.0,212.0],"ports":[{"vx":68.5,"vy":17.5,"vw":17.0,"vh":17.0,"label":"13","side":"top"},{"vx":156.5,"vy":17.5,"vw":17.0,"vh":17.0,"label":"21","side":"top"},{"vx":68.5,"vy":192.5,"vw":17.0,"vh":17.0,"label":"14","side":"bottom"},{"vx":156.5,"vy":192.5,"vw":17.0,"vh":17.0,"label":"22","side":"bottom"}]},"contact_08.svg":{"vb":[145.0,225.0],"ports":[{"vx":85.0,"vy":18.0,"vw":18.0,"vh":18.0,"label":"13","side":"top"},{"vx":85.0,"vy":205.0,"vw":18.0,"vh":18.0,"label":"14","side":"bottom"}]},"contact_09.svg":{"vb":[181.0,284.0],"ports":[{"vx":107.5,"vy":21.5,"vw":23.0,"vh":23.0,"label":"13","side":"top"},{"vx":107.5,"vy":260.5,"vw":23.0,"vh":23.0,"label":"14","side":"bottom"}]},"contact_10.svg":{"vb":[224.0,226.0],"ports":[{"vx":85.5,"vy":17.5,"vw":17.0,"vh":17.0,"label":"13","side":"top"},{"vx":179.0,"vy":18.0,"vw":18.0,"vh":18.0,"label":"21","side":"top"},{"vx":85.5,"vy":205.5,"vw":17.0,"vh":17.0,"label":"14","side":"bottom"},{"vx":179.0,"vy":205.0,"vw":18.0,"vh":18.0,"label":"22","side":"bottom"}]},"contact_11.svg":{"vb":[269.0,226.0],"ports":[{"vx":132.0,"vy":18.0,"vw":18.0,"vh":18.0,"label":"11","side":"top"},{"vx":38.5,"vy":205.5,"vw":17.0,"vh":17.0,"label":"12","side":"bottom"},{"vx":226.0,"vy":205.0,"vw":18.0,"vh":18.0,"label":"14","side":"bottom"}]},"contact_12.svg":{"vb":[271.0,226.0],"ports":[{"vx":133.0,"vy":18.0,"vw":18.0,"vh":18.0,"label":"11","side":"top"},{"vx":39.0,"vy":205.0,"vw":18.0,"vh":18.0,"label":"12","side":"bottom"},{"vx":133.0,"vy":205.0,"vw":18.0,"vh":18.0,"label":"14","side":"bottom"},{"vx":226.5,"vy":205.5,"vw":17.0,"vh":17.0,"label":"16","side":"bottom"}]},"contact_13.svg":{"vb":[148.0,226.0],"ports":[{"vx":87.5,"vy":17.5,"vw":17.0,"vh":17.0,"label":"13","side":"top"},{"vx":87.5,"vy":205.5,"vw":17.0,"vh":17.0,"label":"14","side":"bottom"}]},"contact_14.svg":{"vb":[146.0,226.0],"ports":[{"vx":87.5,"vy":17.5,"vw":17.0,"vh":17.0,"label":"13","side":"top"},{"vx":87.5,"vy":205.5,"vw":17.0,"vh":17.0,"label":"14","side":"bottom"}]},"contact_15.svg":{"vb":[241.0,226.0],"ports":[{"vx":88.0,"vy":18.0,"vw":18.0,"vh":18.0,"label":"13","side":"top"},{"vx":181.5,"vy":17.5,"vw":17.0,"vh":17.0,"label":"21","side":"top"},{"vx":88.0,"vy":205.0,"vw":18.0,"vh":18.0,"label":"14","side":"bottom"},{"vx":181.5,"vy":205.5,"vw":17.0,"vh":17.0,"label":"22","side":"bottom"}]},"contact_16.svg":{"vb":[213.0,247.0],"ports":[{"vx":96.0,"vy":20.0,"vw":20.0,"vh":20.0,"label":"11","side":"top"},{"vx":44.0,"vy":225.0,"vw":20.0,"vh":20.0,"label":"12","side":"bottom"},{"vx":147.5,"vy":225.5,"vw":19.0,"vh":19.0,"label":"14","side":"bottom"}]},"contact_17.svg":{"vb":[161.0,247.0],"ports":[{"vx":96.0,"vy":20.0,"vw":20.0,"vh":20.0,"label":"13","side":"top"},{"vx":96.0,"vy":226.0,"vw":20.0,"vh":20.0,"label":"14","side":"bottom"}]},"contact_18.svg":{"vb":[124.0,189.0],"ports":[{"vx":73.5,"vy":17.5,"vw":15.0,"vh":15.0,"label":"13","side":"top"},{"vx":73.5,"vy":171.5,"vw":15.0,"vh":15.0,"label":"14","side":"bottom"}]},"contact_19.svg":{"vb":[202.0,189.0],"ports":[{"vx":74.0,"vy":17.0,"vw":14.0,"vh":14.0,"label":"13","side":"top"},{"vx":151.0,"vy":17.0,"vw":14.0,"vh":14.0,"label":"21","side":"top"},{"vx":74.0,"vy":172.0,"vw":14.0,"vh":14.0,"label":"14","side":"bottom"},{"vx":151.0,"vy":172.0,"vw":14.0,"vh":14.0,"label":"22","side":"bottom"}]},"contact_20.svg":{"vb":[164.0,189.0],"ports":[{"vx":74.0,"vy":17.0,"vw":14.0,"vh":14.0,"label":"11","side":"top"},{"vx":35.5,"vy":171.5,"vw":15.0,"vh":15.0,"label":"12","side":"bottom"},{"vx":112.5,"vy":171.5,"vw":15.0,"vh":15.0,"label":"14","side":"bottom"}]},"inductive_proximity_sensor.svg":{"vb":[160.0,100.0],"ports":[{"vx":26.0,"vy":50.0,"vw":20.0,"vh":12.0,"label":"1","side":"left"},{"vx":134.0,"vy":50.0,"vw":20.0,"vh":12.0,"label":"2","side":"right"}]}};
const ESC_COMP_W = 120, ESC_COMP_H = 90, ESC_COMP_CX = 60, ESC_COMP_CY = 45;
const ESC_ART_X = 15, ESC_ART_Y = 13, ESC_ART_W = 90, ESC_ART_H = 63;

function getSvgCatalogEntry(typeOrFile) {
  const asset = String(typeOrFile || '').split(/[\\/]/).pop().split('?')[0].toLowerCase();
  return SVG_TERMINAL_CATALOG[asset] || null;
}

function portDefs(type) {
  const entry = getSvgCatalogEntry(type);
  if (entry) {
    const [vw, vh] = entry.vb;
    const scale = Math.min(ESC_ART_W / vw, ESC_ART_H / vh);
    const drawW = vw * scale, drawH = vh * scale;
    const originX = ESC_ART_X + (ESC_ART_W - drawW) / 2;
    const originY = ESC_ART_Y + (ESC_ART_H - drawH) / 2;
    return entry.ports.map((p, idx) => ({
      index: idx,
      x: Math.round((originX + p.vx * scale) * 100) / 100,
      y: Math.round((originY + p.vy * scale) * 100) / 100,
      lx: Math.round((originX + p.vx * scale) * 100) / 100,
      ly: Math.round((originY + p.vy * scale) * 100) / 100,
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
    else if (['no', 'nc', 'change', 'changeover', 'auxno', 'auxnc', 'mainno', 'mainnc', 'relayno', 'relaync', 'start', 'stop', 'estop', 'limitno', 'limitnc', 'foot', 'pressure', 'temperature', 'float', 'hand', 'tdno', 'tdnc', 'offno', 'offnc', 'timernc', 'timerno'].includes(type)) raw = [v(5, 16, '13', 'left'), v(43, 16, '14', 'right')];
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
  if (/contactor/.test(s)) p = 'KM';
  else if (/overload|thermal/.test(s)) p = 'F';
  else if (/breaker|mcb|fuse|isolator|protection/.test(s)) p = 'Q';
  else if (/motor/.test(s)) p = 'M';
  else if (/timer|delay/.test(s)) p = 'KT';
  else if (/coil|relay/.test(s)) p = 'K';
  else if (/push|button|emergency|selector|switch|limit|contact/.test(s)) p = 'S';
  else if (/pilot|lamp|led|indicator/.test(s)) p = 'H';
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
    t.setAttribute('x', String(p.lx));
    t.setAttribute('y', String(p.side === 'top' ? p.ly - 8 : p.ly + 13));
    t.setAttribute('text-anchor', 'middle');
    t.textContent = '';
    t.setAttribute('aria-label', p.label);
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

  const box = document.createElementNS(NS, 'rect');
  box.setAttribute('class', 'select-box');
  box.setAttribute('x', '32');
  box.setAttribute('y', '11');
  box.setAttribute('width', '56');
  box.setAttribute('height', '68');
  box.setAttribute('rx', '2');

  const ns = document.createElementNS(NS, 'svg');
  ns.setAttribute('x', String(ESC_ART_X));
  ns.setAttribute('y', String(ESC_ART_Y));
  ns.setAttribute('width', String(ESC_ART_W));
  ns.setAttribute('height', String(ESC_ART_H));
  ns.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  ns.style.color = g.dataset.accent;
  ns.style.pointerEvents = 'none';
  if (d.symbolFile && /\.svg(?:$|\?)/i.test(d.symbolFile)) {
    ns.setAttribute('viewBox', `0 0 ${ESC_ART_W} ${ESC_ART_H}`);
    const im = document.createElementNS(NS, 'image');
    im.setAttribute('href', d.symbolFile);
    im.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', d.symbolFile);
    im.setAttribute('x', '0');
    im.setAttribute('y', '0');
    im.setAttribute('width', String(ESC_ART_W));
    im.setAttribute('height', String(ESC_ART_H));
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
  tag.setAttribute('x', String(W / 2));
  tag.setAttribute('y', '10');
  tag.setAttribute('text-anchor', 'middle');
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

  const hit = document.createElementNS(NS, 'rect');
  hit.setAttribute('class', 'component-hit-area');
  hit.setAttribute('x', '12');
  hit.setAttribute('y', '10');
  hit.setAttribute('width', String(W - 24));
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
    selectTerminal(freshTo);
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
   b.addEventListener('dragstart',e=>{e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('application/json',JSON.stringify({type:b.dataset.symbol,name:b.dataset.name,ref:b.dataset.ref,accent:b.dataset.accent,symbolFile:b.dataset.file}));document.getElementById('dropOverlay').classList.add('show');state.textContent='DRAGGING • '+b.dataset.name.toUpperCase()});
   b.addEventListener('dragend',()=>{lastLibraryDragEnd=Date.now();document.getElementById('dropOverlay').classList.remove('show');});
   b.addEventListener('click',e=>{
    if(Date.now()-lastLibraryDragEnd<500)return;
    const r=svg.getBoundingClientRect();
    const p=getPoint({clientX:r.left+r.width/2,clientY:r.top+r.height/2});
    const d={type:b.dataset.symbol,name:b.dataset.name,ref:b.dataset.ref,accent:b.dataset.accent,symbolFile:b.dataset.file};
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
   {name:'Auxiliaries', color:'#d4a017'}, {name:'Switches', color:'#06b6d4'},
   {name:'Loads', color:'#f59e0b'}, {name:'Contactors', color:'#10b981'},
   {name:'Protections', color:'#ef4444'}, {name:'Motors', color:'#2563eb'},
   {name:'Proximity Sensor', color:'#f97316'}
  ];
  const categoryIcons = {
   'Sources':'<circle cx="12" cy="12" r="9"/><path d="M4 12c2-7 5-7 8 0s6 7 8 0"/>',
   'Others':'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
   'Coils':'<path d="M2 12h3c0-9 4-9 4 0s4 9 4 0 4-9 4 0 3 9 5 0"/>',
   'Auxiliaries':'<path d="M12 3v18M3 12h9l7-7M12 12l7 7"/>',
   'Switches':'<circle cx="5" cy="17" r="2"/><path d="M7 16 19 5M16 19h5"/>',
   'Loads':'<circle cx="12" cy="12" r="9"/><path d="m6 6 12 12M18 6 6 18"/>',
   'Contactors':'<path d="M5 3v18M19 3v18M2 8h6M16 16h6M8 8l8 8"/>',
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
    'others':'Others','coils':'Coils','auxiliaries':'Auxiliaries',
    'switches':'Switches','loads':'Loads','contactors':'Contactors',
    'protections':'Protections','motors':'Motors','proximity sensor':'Proximity Sensor'
   }[declared];
   if (explicitCategory) category = explicitCategory;
   else if (/coil|timer|tof|ton/.test(name.toLowerCase()) || /(?:^|\/)esc-(?:contactor|ton|tof).*coil\.svg$/i.test(file)) category = 'Coils';
   else if (/power|source|supply|terminal|earth|ground|battery|acdc|three.phase|dc.positive|dc.negative/.test(raw)) category = 'Sources';
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
 const embeddedSymbolManifest = {"project":"ELECTRICAL SIMU CKT","count":36,"symbols":[{"file":"components/Power/01_DC_Negative.svg","name":"01 DC Negative","category":"Power","original_filename":"01_DC_Negative.svg"},{"file":"components/Power/02_DC_Positive.svg","name":"02 DC Positive","category":"Power","original_filename":"02_DC_Positive.svg"},{"file":"components/Power/03_Earth_Ground.svg","name":"03 Earth Ground","category":"Power","original_filename":"03_Earth_Ground.svg"},{"file":"components/Power/04_N_Terminal.svg","name":"04 N Terminal","category":"Power","original_filename":"04_N_Terminal.svg"},{"file":"components/Power/05_L1_Terminal.svg","name":"05 L1 Terminal","category":"Power","original_filename":"05_L1_Terminal.svg"},{"file":"components/Power/06_L2_Terminal.svg","name":"06 L2 Terminal","category":"Power","original_filename":"06_L2_Terminal.svg"},{"file":"components/Power/07_L3_Terminal.svg","name":"07 L3 Terminal","category":"Power","original_filename":"07_L3_Terminal.svg"},{"file":"components/Power/08_PE_Terminal.svg","name":"08 PE Terminal","category":"Power","original_filename":"08_PE_Terminal.svg"},{"file":"components/Power/09_Three_Phase_L1_L2_L3.svg","name":"09 Three Phase L1 L2 L3","category":"Power","original_filename":"09_Three_Phase_L1_L2_L3.svg"},{"file":"components/Power/10_Three_Phase_Neutral.svg","name":"10 Three Phase Neutral","category":"Power","original_filename":"10_Three_Phase_Neutral.svg"},{"file":"components/Power/11_Three_Phase_Neutral_PE.svg","name":"11 Three Phase Neutral PE","category":"Power","original_filename":"11_Three_Phase_Neutral_PE.svg"},{"file":"assets/symbols/esc-contactor-coil.svg","name":"Contactor Coil","category":"Coils","original_filename":"Contactor_Coil.svg","type":"Contactor Coil"},{"file":"assets/symbols/esc-tof-timer-coil.svg","name":"TOF Timer Coil (Off Delay)","category":"Coils","original_filename":"TOF_Timer_Coil.svg","type":"TOF Timer Coil (Off Delay)"},{"file":"assets/symbols/esc-ton-tof-timer-coil.svg","name":"TON/TOF Timer Coil (ON/OFF Delay)","category":"Coils","original_filename":"TON_TOF_Timer_Coil.svg","type":"TON/TOF Timer Coil (ON/OFF Delay)"},{"file":"assets/symbols/esc-ton-timer-coil.svg","name":"TON Timer Coil (On Delay)","category":"Coils","original_filename":"TON_Timer_Coil.svg","type":"TON Timer Coil (On Delay)"},{"file":"components/Switches/Contact_01.svg","name":"Contact 01","category":"Switches","original_filename":"Contact_01.svg","type":"Auxiliary Contact 01"},{"file":"components/Switches/Contact_02.svg","name":"Contact 02","category":"Switches","original_filename":"Contact_02.svg","type":"Auxiliary Contact 02"},{"file":"components/Switches/Contact_03.svg","name":"Contact 03","category":"Switches","original_filename":"Contact_03.svg","type":"Auxiliary Contact 03"},{"file":"components/Switches/Contact_04.svg","name":"Contact 04","category":"Switches","original_filename":"Contact_04.svg","type":"Auxiliary Contact 04"},{"file":"components/Switches/Contact_05.svg","name":"Contact 05","category":"Switches","original_filename":"Contact_05.svg","type":"Auxiliary Contact 05"},{"file":"components/Switches/Contact_06.svg","name":"Contact 06","category":"Switches","original_filename":"Contact_06.svg","type":"Auxiliary Contact 06"},{"file":"components/Switches/Contact_07.svg","name":"Contact 07","category":"Switches","original_filename":"Contact_07.svg","type":"Auxiliary Contact 07"},{"file":"components/Switches/Contact_08.svg","name":"Contact 08","category":"Switches","original_filename":"Contact_08.svg","type":"Auxiliary Contact 08"},{"file":"components/Switches/Contact_09.svg","name":"Contact 09","category":"Switches","original_filename":"Contact_09.svg","type":"Auxiliary Contact 09"},{"file":"components/Switches/Contact_10.svg","name":"Contact 10","category":"Switches","original_filename":"Contact_10.svg","type":"Auxiliary Contact 10"},{"file":"components/Switches/Contact_11.svg","name":"Contact 11","category":"Switches","original_filename":"Contact_11.svg","type":"Auxiliary Contact 11"},{"file":"components/Switches/Contact_12.svg","name":"Contact 12","category":"Switches","original_filename":"Contact_12.svg","type":"Auxiliary Contact 12"},{"file":"components/Switches/Contact_13.svg","name":"Contact 13","category":"Switches","original_filename":"Contact_13.svg","type":"Auxiliary Contact 13"},{"file":"components/Switches/Contact_14.svg","name":"Contact 14","category":"Switches","original_filename":"Contact_14.svg","type":"Auxiliary Contact 14"},{"file":"components/Switches/Contact_15.svg","name":"Contact 15","category":"Switches","original_filename":"Contact_15.svg","type":"Auxiliary Contact 15"},{"file":"components/Switches/Contact_16.svg","name":"Contact 16","category":"Switches","original_filename":"Contact_16.svg","type":"Auxiliary Contact 16"},{"file":"components/Switches/Contact_17.svg","name":"Contact 17","category":"Switches","original_filename":"Contact_17.svg","type":"Auxiliary Contact 17"},{"file":"components/Switches/Contact_18.svg","name":"Contact 18","category":"Switches","original_filename":"Contact_18.svg","type":"Auxiliary Contact 18"},{"file":"components/Switches/Contact_19.svg","name":"Contact 19","category":"Switches","original_filename":"Contact_19.svg","type":"Auxiliary Contact 19"},{"file":"components/Switches/Contact_20.svg","name":"Contact 20","category":"Switches","original_filename":"Contact_20.svg","type":"Auxiliary Contact 20"},{"file":"components/Proximity Sensor/Inductive_Proximity_Sensor.svg","name":"Inductive Proximity Sensor","category":"Proximity Sensor","original_filename":"Inductive_Proximity_Sensor.svg","type":"Inductive Proximity Sensor"}]};
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
