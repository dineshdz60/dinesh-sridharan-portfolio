(function(){'use strict';
if(typeof gsap==='undefined')return;
if(typeof ScrollTrigger!=='undefined')gsap.registerPlugin(ScrollTrigger);
const reveals=document.querySelectorAll('.reveal');
if(typeof IntersectionObserver!=='undefined'){
const obs=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -60px 0px'});
reveals.forEach(el=>obs.observe(el));}else{reveals.forEach(el=>el.classList.add('visible'));}
const heroWords=document.querySelectorAll('.hero-title .word');
if(heroWords.length)gsap.fromTo(heroWords,{y:60,opacity:0},{y:0,opacity:1,stagger:.08,duration:1,ease:'power3.out',delay:.8});
const heroLabel=document.querySelector('.hero-label');
if(heroLabel)gsap.fromTo(heroLabel,{opacity:0,y:20},{opacity:.45,y:0,duration:.8,delay:.6,ease:'power2.out'});
const heroSub=document.querySelector('.hero-sub');
if(heroSub)gsap.fromTo(heroSub,{opacity:0,y:20},{opacity:.55,y:0,duration:.8,delay:1.2,ease:'power2.out'});
const heroCta=document.querySelector('.hero-cta');
if(heroCta)gsap.fromTo(heroCta,{opacity:0,y:20},{opacity:1,y:0,duration:.8,delay:1.4,ease:'power2.out'});
const pageTitle=document.querySelector('.page-title');
if(pageTitle)gsap.fromTo(pageTitle,{y:80,opacity:0},{y:0,opacity:1,duration:1,delay:.3,ease:'power3.out'});
const statNums=document.querySelectorAll('.stat-num');
statNums.forEach(el=>{const raw=el.textContent.trim();const num=parseFloat(raw);if(isNaN(num))return;const suffix=raw.replace(/[0-9.]/g,'');const trigger=el.closest('.about-stats')||el;const o=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(!e.isIntersecting)return;let start=0;const step=num/60;const iv=setInterval(()=>{start=Math.min(start+step,num);el.textContent=(Number.isInteger(num)?Math.round(start):start.toFixed(0))+suffix;if(start>=num)clearInterval(iv);},16);o.unobserve(trigger);});},{threshold:.5});o.observe(trigger);});
if(typeof ScrollTrigger!=='undefined'){
const serviceItems=document.querySelectorAll('.service-item');
if(serviceItems.length)gsap.fromTo(serviceItems,{opacity:0,x:-30},{opacity:1,x:0,stagger:.1,duration:.7,ease:'power2.out',scrollTrigger:{trigger:'.services-list',start:'top 80%'}});
const timelineItems=document.querySelectorAll('.timeline-item');
if(timelineItems.length)gsap.fromTo(timelineItems,{opacity:0,x:-40},{opacity:1,x:0,stagger:.15,duration:.8,ease:'power2.out',scrollTrigger:{trigger:'.timeline',start:'top 80%'}});
const projectCards=document.querySelectorAll('.project-card');
if(projectCards.length)gsap.fromTo(projectCards,{opacity:0,y:50},{opacity:1,y:0,stagger:.12,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.projects-grid',start:'top 80%'}});}
const marqueeTrack=document.querySelector('.marquee-track');
if(marqueeTrack){marqueeTrack.addEventListener('mouseenter',()=>{marqueeTrack.style.animationPlayState='paused';});marqueeTrack.addEventListener('mouseleave',()=>{marqueeTrack.style.animationPlayState='running';});}
const overlay=document.createElement('div');
overlay.style.cssText='position:fixed;inset:0;background:#0a0a0a;z-index:9990;pointer-events:none;opacity:0;transition:opacity .35s ease;';
document.body.appendChild(overlay);
document.querySelectorAll('a[href]').forEach(link=>{const href=link.getAttribute('href');if(!href||href.startsWith('http')||href.startsWith('mailto')||href.startsWith('#')||href.startsWith('tel'))return;link.addEventListener('click',(e)=>{e.preventDefault();overlay.style.opacity='1';overlay.style.pointerEvents='all';setTimeout(()=>{window.location.href=href;},360);});});
window.addEventListener('load',()=>{overlay.style.opacity='0';overlay.style.pointerEvents='none';});
document.querySelectorAll('.btn').forEach(btn=>{btn.addEventListener('mousemove',(e)=>{const rect=btn.getBoundingClientRect();const x=e.clientX-rect.left-rect.width/2;const y=e.clientY-rect.top-rect.height/2;btn.style.transform='translate('+(x*.15)+'px,'+(y*.25)+'px)';});btn.addEventListener('mouseleave',()=>{btn.style.transform='';});});
document.querySelectorAll('.work-item').forEach(item=>{const visual=item.querySelector('.work-placeholder');if(!visual)return;item.addEventListener('mousemove',(e)=>{const rect=item.getBoundingClientRect();const x=(e.clientX-rect.left)/rect.width-.5;const y=(e.clientY-rect.top)/rect.height-.5;visual.style.transform='scale(1.03) translate('+(x*10)+'px,'+(y*6)+'px)';});item.addEventListener('mouseleave',()=>{visual.style.transform='';});});
})();
