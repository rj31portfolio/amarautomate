(() => {
    'use strict';
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nav = document.querySelector('#brand-nav');
    const toggle = document.querySelector('.menu-toggle');
    const productsMenu = nav.querySelector('.products-menu');
    const productsSummary = productsMenu.querySelector('summary');
    const desktopPointer = matchMedia('(min-width: 1200px) and (hover: hover) and (pointer: fine)');
    let menuCloseTimer;
    function closeProducts() { clearTimeout(menuCloseTimer); productsMenu.open = false; }
    function closeMenu() { closeProducts(); nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open navigation'); }
    toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); });
    productsMenu.addEventListener('pointerenter', () => { clearTimeout(menuCloseTimer); if (desktopPointer.matches) productsMenu.open = true; });
    productsMenu.addEventListener('pointerleave', () => { if (desktopPointer.matches) menuCloseTimer = setTimeout(() => { if (!productsMenu.contains(document.activeElement)) closeProducts(); }, 220); });
    productsMenu.addEventListener('focusout', () => { setTimeout(() => { if (!productsMenu.contains(document.activeElement) && !productsMenu.matches(':hover')) closeProducts(); }, 0); });
    productsMenu.addEventListener('toggle', () => productsSummary.setAttribute('aria-expanded', String(productsMenu.open)));
    productsSummary.setAttribute('aria-expanded', 'false');
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (productsMenu.open) { closeProducts(); productsSummary.focus(); } else if (nav.classList.contains('open')) { closeMenu(); toggle.focus(); } } });
    document.addEventListener('click', e => { if (!e.target.closest('.products-menu')) closeProducts(); });
    matchMedia('(min-width: 1200px)').addEventListener('change', closeMenu);
    nav.querySelectorAll('a').forEach(a => { if (new URL(a.href).pathname === location.pathname && !new URL(a.href).hash && !new URL(a.href).search) { a.classList.add('current'); a.setAttribute('aria-current', 'page'); } a.addEventListener('click', closeMenu); });
    document.querySelectorAll('#footer .footer-contact img').forEach(img => { const logo = document.createElement('a'); logo.className = 'brand-logo'; logo.href = 'index.html'; logo.setAttribute('aria-label', 'Amar Automats home'); img.replaceWith(logo); });
    const about = document.querySelector('#about');
    if (about) { const cards = about.querySelector('.icon-boxes>.row'); if (cards) { const section = document.createElement('section'); section.id = 'capabilities'; section.className = 'capabilities-section'; section.innerHTML = '<div class="container"><p class="eyebrow">OUR CAPABILITIES</p><h2>COMPREHENSIVE MANUFACTURING SOLUTIONS</h2></div>'; cards.className = 'capability-grid'; section.firstElementChild.append(cards); about.after(section); cards.querySelectorAll('a[href=""]').forEach(a => a.href = 'about.html'); } }
    const hero = document.querySelector('.brand-hero');
    if (hero) {
        const video = hero.querySelector('video'); const pause = hero.querySelector('.media-pause'); const dots = [...hero.querySelectorAll('.slide-dot')]; let current = 0, paused = reduced, timer;
        function show(index) { current = index; hero.classList.toggle('still', index === 1); dots.forEach((dot, i) => { dot.classList.toggle('active', i === index); dot.setAttribute('aria-pressed', String(i === index)); }); if (index === 0 && !paused) video.play().catch(() => { }); else video.pause(); }
        function schedule() { clearInterval(timer); if (!paused) timer = setInterval(() => show(1 - current), 9000); pause.setAttribute('aria-label', paused ? 'Play hero motion' : 'Pause hero motion'); pause.innerHTML = '<i class="bi bi-' + (paused ? 'play' : 'pause') + '" aria-hidden="true"></i>'; }
        dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); schedule(); })); pause.addEventListener('click', () => { paused = !paused; show(current); schedule(); }); show(1); schedule(); document.addEventListener('visibilitychange', () => { if (document.hidden) { clearInterval(timer); video.pause(); } else { show(current); schedule(); } });
    }
    const productMap = { 'Lock Link': 'lock-link.html', 'Indicator Springs Insert Bolts': 'indicator-springs-and-insert-bolts.html', 'Pivot Screws': 'pivot-screws.html', 'Insert Bolts': 'insert-bolt.html' };
    document.querySelectorAll('.team .member').forEach(card => { const heading = card.querySelector('h4'); const img = card.querySelector('img'); if (img && heading && !img.alt) img.alt = heading.textContent.trim(); if (heading && productMap[heading.textContent.trim()] && !card.closest('a') && !card.querySelector('a')) { const link = document.createElement('a'); link.href = productMap[heading.textContent.trim()]; link.className = 'product-link'; link.textContent = heading.textContent; heading.replaceChildren(link); } });
    const popular = document.querySelector('#team>.container:first-child>.row');
    const allProducts = document.querySelector('#team>.container:nth-child(2)'); if (allProducts) { allProducts.id = 'all-products'; const link = document.createElement('a'); link.href = '#all-products'; link.className = 'brand-button'; link.textContent = 'VIEW ALL PRODUCTS →'; popular?.parentElement.append(link); }
    if (popular) { popular.classList.add('product-carousel'); popular.id = 'popular-products'; const heading = document.querySelector('#team .section-title'); heading.classList.add('carousel-heading'); const controls = document.createElement('div'); controls.className = 'product-controls'; controls.innerHTML = '<button aria-label="Previous products" aria-controls="popular-products">←</button><button aria-label="Next products" aria-controls="popular-products">→</button>'; controls.querySelectorAll('button').forEach((button, i) => button.addEventListener('click', () => popular.scrollBy({ left: (i ? 1 : -1) * popular.clientWidth * .8, behavior: reduced ? 'instant' : 'smooth' }))); heading.append(controls); }
    document.querySelectorAll('.quality-section .card-img-top').forEach(img => { const link = document.createElement('a'); link.href = img.src; link.className = 'certificate-lightbox'; link.setAttribute('aria-label', 'View ' + img.closest('.card').querySelector('h5').textContent + ' certificate'); img.before(link); link.append(img); }); if (window.GLightbox) GLightbox({ selector: '.certificate-lightbox' });
    document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(input => { input.setAttribute('aria-label', input.placeholder); });
    document.querySelectorAll('iframe').forEach(frame => { frame.title = 'Amar Automats location'; frame.loading = 'lazy'; });
    document.querySelectorAll('img').forEach(img => { if (!img.closest('#header')) img.loading = 'lazy'; });
    const subject = new URLSearchParams(location.search).get('subject'); const field = document.querySelector('input[name="subject"]'); if (field && subject) field.value = subject === 'Quote' ? 'Request a quote' : subject === 'Careers' ? 'Careers enquiry' : subject;
})();
