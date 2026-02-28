/* ============================================
   DFY PROMPT PACK — INTERACTIONS & ANIMATIONS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // === LOADING SCREEN ===
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
        }, 1800);
        document.body.style.overflow = 'hidden';
    }

    // === NAVBAR SCROLL EFFECT ===
    const nav = document.querySelector('.nav');
    const saleBanner = document.querySelector('.sale-banner');
    let bannerHeight = saleBanner ? saleBanner.offsetHeight : 0;

    window.addEventListener('scroll', () => {
        if (window.scrollY > bannerHeight + 20) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // === SCROLL REVEAL (Intersection Observer) ===
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't unobserve to allow re-entry effects if desired
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // === ANIMATED COUNTERS ===
    const counters = document.querySelectorAll('[data-counter]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.counted) {
                entry.target.dataset.counted = 'true';
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));

    function animateCounter(el) {
        const target = parseInt(el.dataset.counter);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);

            el.textContent = prefix + current.toLocaleString('en-IN') + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // === FAQ ACCORDION ===
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(i => i.classList.remove('active'));

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // === COUNTDOWN TIMER ===
    function startCountdown() {
        const hoursEl = document.getElementById('cd-hours');
        const minsEl = document.getElementById('cd-mins');
        const secsEl = document.getElementById('cd-secs');

        if (!hoursEl || !minsEl || !secsEl) return;

        // Set end time to midnight tonight (or 24h from first visit)
        let endTime = localStorage.getItem('countdown_end');
        if (!endTime || parseInt(endTime) < Date.now()) {
            endTime = Date.now() + 24 * 60 * 60 * 1000;
            localStorage.setItem('countdown_end', endTime);
        }

        function update() {
            const now = Date.now();
            const diff = Math.max(0, parseInt(endTime) - now);

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            hoursEl.textContent = String(hours).padStart(2, '0');
            minsEl.textContent = String(mins).padStart(2, '0');
            secsEl.textContent = String(secs).padStart(2, '0');

            if (diff > 0) {
                requestAnimationFrame(update);
            } else {
                // Reset
                localStorage.removeItem('countdown_end');
                startCountdown();
            }
        }

        update();
    }

    startCountdown();

    // === BEFORE/AFTER SLIDER ===
    const baSliders = document.querySelectorAll('.ba-slider');

    baSliders.forEach(slider => {
        const afterImg = slider.querySelector('.ba-after');
        const handle = slider.querySelector('.ba-handle');
        let isDragging = false;

        function updatePosition(x) {
            const rect = slider.getBoundingClientRect();
            let percent = ((x - rect.left) / rect.width) * 100;
            percent = Math.max(5, Math.min(95, percent));

            afterImg.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
            handle.style.left = percent + '%';
        }

        slider.addEventListener('mousedown', (e) => {
            isDragging = true;
            updatePosition(e.clientX);
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                updatePosition(e.clientX);
            }
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Touch events
        slider.addEventListener('touchstart', (e) => {
            isDragging = true;
            updatePosition(e.touches[0].clientX);
        });

        slider.addEventListener('touchmove', (e) => {
            if (isDragging) {
                e.preventDefault();
                updatePosition(e.touches[0].clientX);
            }
        });

        slider.addEventListener('touchend', () => {
            isDragging = false;
        });
    });

    // === SMOOTH SCROLL FOR ANCHOR LINKS ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === PARALLAX ON HERO PARTICLES ===
    const heroSection = document.querySelector('.hero');
    const particles = document.querySelectorAll('.particle');

    if (heroSection && particles.length > 0) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                particles.forEach((p, i) => {
                    const speed = 0.15 + (i * 0.05);
                    p.style.transform = `translateY(${scrolled * speed}px)`;
                });
            }
        });
    }

    // === MAGNETIC CTA BUTTON EFFECT ===
    const magneticBtns = document.querySelectorAll('.btn-primary');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.03)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0) scale(1)';
        });
    });

    // === STAGGERED LETTER ANIMATION FOR LOADER ===
    const loaderText = document.querySelector('.loader-text');
    if (loaderText) {
        const text = loaderText.textContent;
        loaderText.innerHTML = '';
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.animationDelay = `${0.05 * i}s`;
            loaderText.appendChild(span);
        });
    }
});
