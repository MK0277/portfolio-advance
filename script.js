const menuButton=document.querySelector(".menu-toggle");
const nav=document.querySelector(".nav-links");
menuButton?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(open));});
nav?.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("open");menuButton?.setAttribute("aria-expanded","false");}));

// Subtle perspective response while the pointer is inside the hero.
// Replace the placeholder with a transparent portrait when the photo is ready.
const hero=document.querySelector(".hero");
const portrait=document.querySelector(".portrait-placeholder");
let targetX=0,targetY=0,currentX=0,currentY=0,frame=0;
function animatePortrait(){
  currentX+=(targetX-currentX)*.09;
  currentY+=(targetY-currentY)*.09;
  if(portrait) portrait.style.transform=`rotateY(${currentX}deg) rotateX(${currentY}deg)`;
  if(Math.abs(targetX-currentX)>.02||Math.abs(targetY-currentY)>.02) frame=requestAnimationFrame(animatePortrait);
  else frame=0;
}
function pointAt(x,y){
  const r=hero.getBoundingClientRect();
  const nx=(x-r.left)/r.width-.5;
  const ny=(y-r.top)/r.height-.5;
  targetX=Math.max(-10,Math.min(10,nx*20));
  targetY=Math.max(-6,Math.min(6,-ny*12));
  if(!frame) frame=requestAnimationFrame(animatePortrait);
}
hero?.addEventListener("pointermove",e=>{if(e.pointerType==="mouse")pointAt(e.clientX,e.clientY);});
hero?.addEventListener("pointerleave",()=>{targetX=0;targetY=0;if(!frame)frame=requestAnimationFrame(animatePortrait);});
hero?.addEventListener("touchmove",e=>{if(e.touches[0])pointAt(e.touches[0].clientX,e.touches[0].clientY);},{passive:true});
hero?.addEventListener("touchend",()=>{targetX=0;targetY=0;if(!frame)frame=requestAnimationFrame(animatePortrait);});
