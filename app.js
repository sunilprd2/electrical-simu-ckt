const statusEl=document.getElementById("status");
const simState=document.getElementById("simState");
const motorState=document.getElementById("motorState");
const motor=document.getElementById("motor");
const coil=document.getElementById("coil");
const k1=document.getElementById("k1");
const aux=document.getElementById("aux");
const start=document.getElementById("start");
const stop=document.getElementById("stop");
let running=false, held=false;

function render(){
  const active=running && !held;
  motor.classList.toggle("running",active);
  coil.classList.toggle("on",active);
  k1.classList.toggle("on",active);
  aux.classList.toggle("on",active);
  simState.textContent=active?"● RUNNING":"● STOPPED";
  simState.classList.toggle("running",active);
  motorState.textContent=active?"Motor: RUNNING":"Motor: OFF";
  statusEl.textContent=active?"SIMULATION • LIVE":"READY • 2D EDIT MODE";
}
document.getElementById("playBtn").addEventListener("click",()=>{running=true;held=false;render()});
document.getElementById("stopBtn").addEventListener("click",()=>{running=false;held=false;render()});
start.addEventListener("click",()=>{if(!held){running=true;render()}});
stop.addEventListener("click",()=>{running=false;render()});
document.getElementById("holdBtn").addEventListener("click",()=>{held=!held;render()});
document.getElementById("deleteBtn").addEventListener("click",()=>alert("Delete mode: select a component in the next editor build."));
document.getElementById("threeDBtn").addEventListener("click",()=>alert("3D engine is Phase 2. It will use this same circuit model."));
document.getElementById("valuesBtn").addEventListener("click",()=>alert("Values panel will show live voltage, current and device states."));
document.getElementById("viewBtn").addEventListener("click",()=>alert("View controls will be added to the 2D editor."));
document.querySelectorAll(".part").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const type=btn.dataset.type;
    if(type){statusEl.textContent=`READY • ADD ${type.toUpperCase()}`;}
    else statusEl.textContent="READY • COMPONENT SELECTED";
  });
});
document.getElementById("search").addEventListener("input",e=>{
  const q=e.target.value.toLowerCase();
  document.querySelectorAll(".group").forEach(g=>{
    const text=g.textContent.toLowerCase();
    g.style.display=text.includes(q)?"block":"none";
  });
});
render();