document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // --- 2. Parallax Effect on Floating Abstract Shapes ---
    const floatingElements = document.querySelectorAll('.floating-element');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        floatingElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-speed')) || 0.1;
            const yPos = scrollY * speed;
            el.style.transform = `translateY(${yPos}px)`;
        });
    });


    // --- 3. Hamburger Menu Toggle ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close the mobile menu when a link is clicked
    const mobileLinks = navLinks.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });


    // --- 4. SCROLLSPY: Update Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        if (scrollY < 200) {
            current = 'home';
        }

        navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });


    // --- 5. ACTIVITIES CAROUSEL (Single-Lane Slideshow with Auto-Scroll & Seamless Loop) ---
    const carouselViewport = document.getElementById('carouselViewport');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    const carouselDots = document.getElementById('carouselDots');
    const activityCards = document.querySelectorAll('.activity-card');

    if (carouselViewport && carouselPrev && carouselNext && carouselDots && activityCards.length > 0) {
        
        let autoSlideTimer = null;
        let resumeTimer = null;
        let isLooping = false; // Prevents overlapping loops
        const AUTO_SLIDE_INTERVAL = 3500; // Auto-advance every 3.5 seconds
        const RESUME_DELAY = 6000;        // Resume auto-scroll 6s after user interaction

        // --- Build dots dynamically based on number of cards ---
        activityCards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                const card = activityCards[index];
                carouselViewport.scrollTo({
                    left: card.offsetLeft - carouselViewport.offsetLeft - 8,
                    behavior: 'smooth'
                });
                pauseAutoScroll();
            });
            
            carouselDots.appendChild(dot);
        });

        const dots = carouselDots.querySelectorAll('.dot');

        // --- Helper: Card width + gap between cards ---
        function getStepSize() {
            return activityCards[0].offsetWidth + 24; // 24px gap
        }

        // --- Helper: Check if we're at the end ---
        function isAtEnd() {
            const maxScroll = carouselViewport.scrollWidth - carouselViewport.clientWidth;
            return carouselViewport.scrollLeft >= maxScroll - 10;
        }

        // --- Loop back to the first card seamlessly ---
        function loopBackToStart() {
            if (isLooping) return; // Prevent double loops
            isLooping = true;

            // Smoothly scroll to the very end
            carouselViewport.scrollTo({ left: carouselViewport.scrollWidth, behavior: 'smooth' });
            
            // After the smooth scroll finishes, silently jump to the start
            setTimeout(() => {
                carouselViewport.scrollTo({ left: 0, behavior: 'auto' });
                isLooping = false;
            }, 900);
        }

        // --- Advance one card (with seamless loop) ---
        function advanceOneCard() {
            if (isLooping) return; // Skip if we're mid-loop
            if (isAtEnd()) {
                loopBackToStart();
            } else {
                carouselViewport.scrollBy({ left: getStepSize(), behavior: 'smooth' });
            }
        }

        // --- Auto-scroll controller ---
        function startAutoScroll() {
            if (autoSlideTimer) return; // Already running
            autoSlideTimer = setInterval(advanceOneCard, AUTO_SLIDE_INTERVAL);
        }

        function stopAutoScroll() {
            if (autoSlideTimer) {
                clearInterval(autoSlideTimer);
                autoSlideTimer = null;
            }
        }

        function pauseAutoScroll() {
            stopAutoScroll();
            if (resumeTimer) clearTimeout(resumeTimer);
            resumeTimer = setTimeout(startAutoScroll, RESUME_DELAY);
        }

        // --- Pause auto-scroll on hover (desktop) ---
        carouselViewport.addEventListener('mouseenter', stopAutoScroll);
        carouselViewport.addEventListener('mouseleave', startAutoScroll);

        // --- Arrow navigation ---
        carouselPrev.addEventListener('click', () => {
            carouselViewport.scrollBy({ left: -getStepSize(), behavior: 'smooth' });
            pauseAutoScroll();
        });

        carouselNext.addEventListener('click', () => {
            if (isAtEnd()) {
                loopBackToStart();
            } else {
                carouselViewport.scrollBy({ left: getStepSize(), behavior: 'smooth' });
            }
            pauseAutoScroll();
        });

        // --- Update dots & arrow states based on scroll position ---
        function updateCarouselState() {
            const scrollLeft = carouselViewport.scrollLeft;
            const step = getStepSize();
            const maxScroll = carouselViewport.scrollWidth - carouselViewport.clientWidth;

            const activeIndex = Math.min(
                Math.round(scrollLeft / step),
                activityCards.length - 1
            );

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === activeIndex);
            });

            // Fade arrows at edges
            carouselPrev.style.opacity = scrollLeft <= 5 ? '0.4' : '1';
            carouselNext.style.opacity = scrollLeft >= maxScroll - 5 ? '0.4' : '1';
        }

        carouselViewport.addEventListener('scroll', updateCarouselState);
        updateCarouselState();

        // --- Start auto-scrolling on load ---
        startAutoScroll();
    }


    // --- 6. TESTIMONIAL CAROUSEL ---
    const slides = document.querySelectorAll('.testimonial-slide');
    const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        testimonialDots.forEach(d => d.classList.remove('active'));
        slides[index].classList.add('active');
        testimonialDots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 6000);
    }

    function resetAutoSlide() {
        clearInterval(slideInterval);
        startAutoSlide();
    }

    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetAutoSlide();
        });
    });

    if (slides.length > 0) {
        startAutoSlide();
    }

});document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    revealElements.forEach(el => revealObserver.observe(el));


    // --- 2. Parallax Effect ---
    const floatingElements = document.querySelectorAll('.floating-element');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        floatingElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-speed')) || 0.1;
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });


    // --- 3. Hamburger Menu Toggle ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    const mobileLinks = navLinks.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });


    // --- 4. SCROLLSPY ---
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a');
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.scrollY;
        sections.forEach(section => {
            if (scrollY >= (section.offsetTop - 150)) current = section.getAttribute('id');
        });
        if (scrollY < 200) current = 'home';
        navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
        });
    });


    // --- 5. ACTIVITIES CAROUSEL ---
    const carouselViewport = document.getElementById('carouselViewport');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    const carouselDots = document.getElementById('carouselDots');
    const activityCards = document.querySelectorAll('.activity-card');

    if (carouselViewport && carouselPrev && carouselNext && carouselDots && activityCards.length > 0) {
        let autoSlideTimer = null;
        let resumeTimer = null;
        let isLooping = false;
        const AUTO_SLIDE_INTERVAL = 3500;
        const RESUME_DELAY = 6000;

        activityCards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                carouselViewport.scrollTo({ left: activityCards[index].offsetLeft - carouselViewport.offsetLeft - 8, behavior: 'smooth' });
                pauseAutoScroll();
            });
            carouselDots.appendChild(dot);
        });
        const dots = carouselDots.querySelectorAll('.dot');
        const getStepSize = () => activityCards[0].offsetWidth + 24;
        const isAtEnd = () => carouselViewport.scrollLeft >= (carouselViewport.scrollWidth - carouselViewport.clientWidth) - 10;

        function loopBackToStart() {
            if (isLooping) return;
            isLooping = true;
            carouselViewport.scrollTo({ left: carouselViewport.scrollWidth, behavior: 'smooth' });
            setTimeout(() => { carouselViewport.scrollTo({ left: 0, behavior: 'auto' }); isLooping = false; }, 900);
        }

        function advanceOneCard() {
            if (isLooping) return;
            if (isAtEnd()) loopBackToStart();
            else carouselViewport.scrollBy({ left: getStepSize(), behavior: 'smooth' });
        }

        const startAutoScroll = () => { if (!autoSlideTimer) autoSlideTimer = setInterval(advanceOneCard, AUTO_SLIDE_INTERVAL); };
        const stopAutoScroll = () => { if (autoSlideTimer) { clearInterval(autoSlideTimer); autoSlideTimer = null; } };
        const pauseAutoScroll = () => { stopAutoScroll(); if (resumeTimer) clearTimeout(resumeTimer); resumeTimer = setTimeout(startAutoScroll, RESUME_DELAY); };

        carouselViewport.addEventListener('mouseenter', stopAutoScroll);
        carouselViewport.addEventListener('mouseleave', startAutoScroll);
        carouselPrev.addEventListener('click', () => { carouselViewport.scrollBy({ left: -getStepSize(), behavior: 'smooth' }); pauseAutoScroll(); });
        carouselNext.addEventListener('click', () => { if (isAtEnd()) loopBackToStart(); else carouselViewport.scrollBy({ left: getStepSize(), behavior: 'smooth' }); pauseAutoScroll(); });

        const updateCarouselState = () => {
            const activeIndex = Math.min(Math.round(carouselViewport.scrollLeft / getStepSize()), activityCards.length - 1);
            dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
            carouselPrev.style.opacity = carouselViewport.scrollLeft <= 5 ? '0.4' : '1';
            carouselNext.style.opacity = isAtEnd() ? '0.4' : '1';
        };
        carouselViewport.addEventListener('scroll', updateCarouselState);
        updateCarouselState();
        startAutoScroll();
    }


    // --- 6. TESTIMONIAL CAROUSEL ---
    const slides = document.querySelectorAll('.testimonial-slide');
    const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        testimonialDots.forEach(d => d.classList.remove('active'));
        slides[index].classList.add('active');
        testimonialDots[index].classList.add('active');
        currentSlide = index;
    }

    const startAutoSlide = () => slideInterval = setInterval(() => showSlide((currentSlide + 1) % slides.length), 6000);
    
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            clearInterval(slideInterval);
            startAutoSlide();
        });
    });

    if (slides.length > 0) startAutoSlide();


    // --- 7. DONATE MODAL FUNCTIONALITY ---
    const donateModal = document.getElementById('donateModal');
    const closeModalBtn = document.getElementById('closeModal');
    const donateTriggers = document.querySelectorAll('.donate-trigger');

    donateTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            donateModal.classList.add('active');
        });
    });

    closeModalBtn.addEventListener('click', () => donateModal.classList.remove('active'));
    
    // Close modal when clicking outside the content
    donateModal.addEventListener('click', (e) => {
        if (e.target === donateModal) donateModal.classList.remove('active');
    });


    // --- 8. CONTACT FORM FUNCTIONALITY ---
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if(name && email && message) {
            // Here you would normally send the data to a server
            // For now, we simulate a successful submission
            const submitBtn = contactForm.querySelector('.form-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                alert(`Thank you, ${name}! Your message has been sent successfully. We will get back to you at ${email} shortly.`);
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1000);
        }
    });

});