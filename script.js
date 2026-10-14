function sendHearts(e){
  const layer=document.getElementById('heartsLayer');
  const x=e?.clientX??innerWidth/2, y=e?.clientY??innerHeight*.65;
  for(let i=0;i<22;i++){
    const h=document.createElement('span');h.className='heart';
    h.textContent=Math.random()>.5?'♥':'♡';
    h.style.left=x+(Math.random()-.5)*120+'px';
    h.style.top=y+(Math.random()-.5)*50+'px';
    h.style.fontSize=(14+Math.random()*20)+'px';
    h.style.animationDuration=(1.2+Math.random()*.9)+'s';
    layer.appendChild(h);setTimeout(()=>h.remove(),2300);
  }
}
const crown=document.querySelector('.crown-fallback');
if(crown) crown.addEventListener('click',()=>{crown.classList.remove('spin');void crown.offsetWidth;crown.classList.add('spin');sendHearts({clientX:innerWidth/2,clientY:innerHeight/2});});
