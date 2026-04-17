(function(){'use strict';
const cursor=document.getElementById('cursor');
const follower=document.getElementById('cursorFollower');
let mouseX=0,mouseY=0,followerX=0,followerY=0;
document.addEventListener('mousemove',(e)=>{mouseX=e.clientX;mouseY=e.clientY;if(cursor){cursor.style.left=mouseX+'px';cursor.style.top=mouseY+'px';}});
function animateFollower(){followerX+=(mouseX-followerX)*.12;followerY+=(mouseY-followerY)*.12;if(follower){follower.style.left=followerX+'px';follower.style.top=followerY+'px';}requestAnimationFrame(animateFollower);}
animateFollower();
document.querySelectorAll('a,button,.project-card,.service-item,.work-item,.filter-btn').forEach(el=>{el.addEventListener('mouseenter',()=>{if(cursor)cursor.classList.add('cursor-hover');if(follower)follower.classList.add('cursor-follower-hover');});el.addEventListener('mouseleave',()=>{if(cursor)cursor.classList.remove('cursor-hover');if(follower)follower.classList.remove('cursor-follower-hover');});});
const menuToggle=document.getElementById('menuToggle');
const menuClose=document.getElementById('menuClose');
const menuOverlay=document.getElementById('menuOverlay');
function openMenu(){if(!menuOverlay)return;menuOverlay.classList.add('is-open');document.body.style.overflow='hidden';}
function closeMenu(){if(!menuOverlay)return;menuOverlay.classList.remove('is-open');document.body.style.overflow='';}
if(menuToggle)menuToggle.addEventListener('click',openMenu);
if(menuClose)menuClose.addEventListener('click',closeMenu);
if(menuOverlay){menuOverlay.addEventListener('click',(e)=>{if(e.target===menuOverlay||e.target.classList.contains('menu-overlay-bg'))closeMenu();});}
document.addEventListener('keydown',(e)=>{if(e.key==='Escape')closeMenu();});
const nav=document.getElementById('mainNav');
window.addEventListener('scroll',()=>{if(!nav)return;nav.classList.toggle('scrolled',window.scrollY>80);},{passive:true});
const filterBtns=document.querySelectorAll('.filter-btn');
const workItems=document.querySelectorAll('.work-item[data-category]');
filterBtns.forEach(btn=>{btn.addEventListener('click',()=>{filterBtns.forEach(b=>b.classList.remove('active'));btn.classList.add('active');const filter=btn.dataset.filter;workItems.forEach(item=>{const show=filter==='all'||item.dataset.category===filter;item.style.display=show?'':'none';});});});
const form=document.getElementById('contactForm');
const success=document.getElementById('formSuccess');
if(form){form.addEventListener('submit',(e)=>{e.preventDefault();if(success){success.style.display='block';form.reset();setTimeout(()=>{success.style.display='none';},5000);}});}
})();
