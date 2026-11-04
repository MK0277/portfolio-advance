const menuButton=document.querySelector(".menu-toggle");
const nav=document.querySelector(".nav-links");
menuButton?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(open));});
nav?.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("open");menuButton?.setAttribute("aria-expanded","false");}));

const hero=document.querySelector(".hero");
const portrait=document.querySelector(".hero-artwork");
const motionButton=document.querySelector("#motionEnable");
let targetX=0,targetY=0,currentX=0,currentY=0,frame=0;
let sensorActive=false,baseBeta=null,baseGamma=null,lastPointer=0;
function animatePortrait(){
  currentX+=(targetX-currentX)*.09;
  currentY+=(targetY-currentY)*.09;
  if(portrait) portrait.style.transform=`rotateY(${currentX}deg) rotateX(${currentY}deg)`;
  if(Math.abs(targetX-currentX)>.02||Math.abs(targetY-currentY)>.02) frame=requestAnimationFrame(animatePortrait);
  else frame=0;
}
function setTarget(x,y){
  targetX=Math.max(-13,Math.min(13,x));
  targetY=Math.max(-9,Math.min(9,y));
  if(!frame)frame=requestAnimationFrame(animatePortrait);
}
function pointAt(x,y){
  const r=hero.getBoundingClientRect();
  setTarget(((x-r.left)/r.width-.5)*20,-((y-r.top)/r.height-.5)*12);
}
hero?.addEventListener("pointermove",e=>{if(e.pointerType==="mouse"&&!sensorActive){lastPointer=Date.now();pointAt(e.clientX,e.clientY);}});
hero?.addEventListener("pointerleave",()=>{if(!sensorActive)setTarget(0,0);});
hero?.addEventListener("touchmove",e=>{if(!sensorActive&&e.touches[0])pointAt(e.touches[0].clientX,e.touches[0].clientY);},{passive:true});
hero?.addEventListener("touchend",()=>{if(!sensorActive)setTarget(0,0);});

function handleOrientation(event){
  if(event.beta===null||event.gamma===null)return;
  if(baseBeta===null){baseBeta=event.beta;baseGamma=event.gamma;}
  const beta=((event.beta-baseBeta+540)%360)-180;
  const gamma=((event.gamma-baseGamma+540)%360)-180;
  // Map physical tilt to a restrained, smooth portrait lean.
  setTarget(Math.max(-13,Math.min(13,gamma*.55)),Math.max(-9,Math.min(9,-beta*.35)));
}
async function enableMotion(){
  if(!("DeviceOrientationEvent" in window)){
    motionButton.textContent="MOTION SENSOR NOT SUPPORTED";
    return;
  }
  try{
    if(typeof DeviceOrientationEvent.requestPermission==="function"){
      const permission=await DeviceOrientationEvent.requestPermission();
      if(permission!=="granted")throw new Error("Motion permission was not granted");
    }
    baseBeta=null;baseGamma=null;
    window.addEventListener("deviceorientation",handleOrientation,true);
    sensorActive=true;
    motionButton.setAttribute("aria-pressed","true");
    motionButton.innerHTML='<span class="motion-dot"></span>MOTION SENSOR ON · TAP TO TURN OFF';
    motionButton.onclick=disableMotion;
  }catch(error){
    motionButton.textContent=location.protocol!=="https:"&&location.hostname!=="localhost"?"ENABLE MOTION ON HTTPS":"MOTION PERMISSION DENIED · TAP TO RETRY";
    motionButton.onclick=enableMotion;
  }
}
function disableMotion(){
  window.removeEventListener("deviceorientation",handleOrientation,true);
  sensorActive=false;baseBeta=null;baseGamma=null;
  motionButton.setAttribute("aria-pressed","false");
  motionButton.innerHTML='<span class="motion-dot"></span>ENABLE MOTION SENSOR';
  motionButton.onclick=enableMotion;
  setTarget(0,0);
}
if(motionButton)motionButton.addEventListener("click",enableMotion);
