// Lightweight interactions for the landing page

// Smooth scroll for internal links (handle all anchors like #contact, ignore bare "#")
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e){
        const href = this.getAttribute('href');
        if(href && href.startsWith('#') && href.length > 1){
            e.preventDefault();
            const target = document.querySelector(href);
            if(target) target.scrollIntoView({behavior:'smooth'});
        }
    });
});

// Sticky header visual on scroll
const header = document.querySelector('header');
function updateHeader(){
    if(window.scrollY > 50){
        header.style.background = 'rgba(5,8,22,.95)';
        header.style.boxShadow = '0 10px 30px rgba(0,0,0,.3)';
    } else {
        header.style.background = 'rgba(10,15,35,.65)';
        header.style.boxShadow = 'none';
    }
}
window.addEventListener('scroll', updateHeader);
updateHeader();

// Active nav link based on section in view
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('nav a');
function updateActiveNav(){
    let current = '';
    sections.forEach(section=>{
        const top = section.offsetTop - 160;
        if(window.scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach(link=>{
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}
window.addEventListener('scroll', updateActiveNav);
window.addEventListener('load', updateActiveNav);

// Scroll reveal
const revealItems = document.querySelectorAll('.card,.service-card,.about-content,.counter-box,.project,.price-card,.hero-text,.hero-image');
function reveal(){
    const windowHeight = window.innerHeight;
    revealItems.forEach(item=>{
        const elementTop = item.getBoundingClientRect().top;
        if(elementTop < windowHeight - 120){
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }
    });
}
revealItems.forEach(item=>{
    item.style.opacity = '0';
    item.style.transform = 'translateY(60px)';
    item.style.transition = 'all .8s ease';
});
window.addEventListener('scroll', reveal);

// Animated counters (reads data-target or inner text)
const counters = document.querySelectorAll('.counter-box h2');
const speed = 200;
counters.forEach(counter=>{
    const raw = counter.getAttribute('data-target') || counter.innerText;
    const number = parseInt(String(raw).replace(/\D/g,'')) || 0;
    const update = ()=>{
        const current = +counter.getAttribute('data-count') || 0;
        const increment = Math.max(1, Math.floor(number / speed));
        if(current < number){
            const value = Math.min(number, current + increment);
            counter.setAttribute('data-count', value);
            counter.innerText = value + (raw.includes('+')?'+': raw.includes('%')?'%':'');
            setTimeout(update, 15);
        } else {
            counter.innerText = raw;
        }
    };
    update();
});

// Back to top button
const topButton = document.createElement('button');
topButton.innerHTML = '↑';
topButton.id = 'topButton';
document.body.appendChild(topButton);
topButton.style.position='fixed';
topButton.style.bottom='30px';
topButton.style.right='30px';
topButton.style.width='55px';
topButton.style.height='55px';
topButton.style.borderRadius='50%';
topButton.style.border='none';
topButton.style.cursor='pointer';
topButton.style.fontSize='22px';
topButton.style.background='#38bdf8';
topButton.style.color='#fff';
topButton.style.display='none';
topButton.style.zIndex='999';
topButton.style.boxShadow='0 10px 25px rgba(0,0,0,.3)';
topButton.style.transition='.3s';
window.addEventListener('scroll',()=>{
    topButton.style.display = window.scrollY > 400 ? 'block' : 'none';
});
topButton.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

// Contact form handling (client-only)
const form = document.getElementById('contactForm');
if(form){
    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        alert('✅ Thank you! Your message has been sent successfully.');
        form.reset();
    });
}

// Hero float fallback (CSS handles primary animation)
const heroImage = document.querySelector('.hero-image img');
if(heroImage){
    let move = 0;
    setInterval(()=>{
        move = move === 0 ? 8 : 0;
        heroImage.style.transform = `translateY(${move}px)`;
    }, 2200);
}

// Button hover enhancement (kept subtle)
document.querySelectorAll('.btn').forEach(btn=>{
    btn.addEventListener('mouseenter', ()=> btn.style.transform = 'translateY(-5px) scale(1.02)');
    btn.addEventListener('mouseleave', ()=> btn.style.transform = 'translateY(0) scale(1)');
});

// Page load: remove loader and reveal
window.addEventListener('load', ()=>{
    const loader = document.getElementById('loader');
    if(loader){ loader.style.opacity='0'; loader.style.pointerEvents='none'; setTimeout(()=>loader.remove(),600); }
    document.body.style.opacity = '1';
    reveal();
});

// Live Demo modal: open when clicking Live Demo button
const demoBtn = document.querySelector('.btn-outline');
const demoModal = document.getElementById('liveDemoModal');
const demoClose = demoModal ? demoModal.querySelector('.modal-close') : null;
function openDemo(){
    if(!demoModal) return;
    demoModal.classList.add('open');
    demoModal.setAttribute('aria-hidden','false');
}
function closeDemo(){
    if(!demoModal) return;
    demoModal.classList.remove('open');
    demoModal.setAttribute('aria-hidden','true');
}
if(demoBtn){
    demoBtn.addEventListener('click',(e)=>{
        e.preventDefault();
        openDemo();
    });
}
if(demoClose){
    demoClose.addEventListener('click', closeDemo);
}
if(demoModal){
    demoModal.addEventListener('click',(e)=>{
        if(e.target === demoModal) closeDemo();
    });
    window.addEventListener('keyup',(e)=>{ if(e.key === 'Escape') closeDemo(); });
}

// Read More toggle for About section
const readBtn = document.getElementById('readMoreBtn');
const aboutMore = document.getElementById('aboutMore');
if(readBtn && aboutMore){
    readBtn.addEventListener('click', ()=>{
        const opening = !aboutMore.classList.contains('open');
        if(opening){
            aboutMore.hidden = false;
            // allow next frame for transition
            requestAnimationFrame(()=>{
                aboutMore.classList.add('open');
                aboutMore.style.maxHeight = aboutMore.scrollHeight + 'px';
            });
            readBtn.setAttribute('aria-expanded','true');
            readBtn.textContent = 'Show Less';
            aboutMore.scrollIntoView({behavior:'smooth', block:'start'});
        } else {
            aboutMore.classList.remove('open');
            aboutMore.style.maxHeight = '0';
            readBtn.setAttribute('aria-expanded','false');
            readBtn.textContent = 'Read More';
            // hide after transition
            setTimeout(()=> aboutMore.hidden = true, 400);
        }
    });
}

// Pricing: populate plan select when user clicks 'Choose'
const planSelect = document.getElementById('planSelect');
document.querySelectorAll('.choose-btn').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
        // read data-plan and set select value
        const plan = btn.getAttribute('data-plan') || '';
        if(planSelect && plan){
            planSelect.value = plan;
        }
        // allow smooth-scroll handler to run; focus message after scroll
        setTimeout(()=>{
            if(planSelect) planSelect.focus();
        }, 600);
    });
});