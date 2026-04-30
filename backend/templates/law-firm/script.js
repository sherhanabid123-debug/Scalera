document.addEventListener('DOMContentLoaded',()=>{
const navbar=document.getElementById('navbar');
const hamburger=document.getElementById('hamburger');
const navLinks=document.getElementById('nav-links');
window.addEventListener('scroll',()=>{navbar.classList.toggle('scrolled',window.scrollY>60)});
hamburger?.addEventListener('click',()=>{navLinks.classList.toggle('active')});
document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{e.preventDefault();const t=document.querySelector(a.getAttribute('href'));if(t){t.scrollIntoView({behavior:'smooth'});navLinks.classList.remove('active')}})});
const observer=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}})},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelectorAll('.stat-number').forEach(el=>{const target=+el.dataset.target;const obs=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){let current=0;const step=target/50;const timer=setInterval(()=>{current+=step;if(current>=target){el.textContent=target;clearInterval(timer)}else{el.textContent=Math.floor(current)}},30);obs.unobserve(el)}},{threshold:.5});obs.observe(el)});
});
