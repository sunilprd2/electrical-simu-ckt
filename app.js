const sheet=document.getElementById("sheet"), sim=document.getElementById("sim"), state=document.getElementById("state"), motorState=document.getElementById("motorState");let running=false;
document.querySelectorAll(".cat-head").forEach(head=>head.addEventListener("click",()=>{
  const cat=head.parentElement; cat.classList.toggle("open");
  head.querySelector("i").textContent=cat.classList.contains("open")?"⌃":"⌄";
}));
function render(){document.body.classList.toggle("live",running);sim.textContent=running?"● RUNNING":"● STOPPED";sim.classList.toggle("running",running);motorState.textContent=running?"Motor: RUNNING":"Motor: OFF";state.textContent=running?"SIMULATION • LIVE":"READY • 2D SCHEMATIC";}
document.getElementById("play").onclick=()=>{running=true;render()};document.getElementById("stop").onclick=()=>{running=false;render()};
document.getElementById("threeD").onclick=()=>alert("3D view is the next module. It will use the same circuit model as this 2D schematic.");
document.getElementById("delete").onclick=()=>alert("Select a component, then Delete. Full selection/editing is being added to the next build.");
document.querySelectorAll("[data-symbol]").forEach(b=>b.addEventListener("click",()=>{state.textContent="ADD "+b.dataset.symbol.toUpperCase()+" • click/drag into schematic";}));
document.getElementById("search").addEventListener("input",e=>{const q=e.target.value.toLowerCase();document.querySelectorAll(".library section").forEach(s=>s.style.display=s.textContent.toLowerCase().includes(q)?"block":"none")});
render();