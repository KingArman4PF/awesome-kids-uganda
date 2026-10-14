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


    // --- 5. ACTIVITIES CAROUSEL (Single-Lane Slideshow) ---
    const carouselViewport = document.getElementById('carouselViewport');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    const carouselDots = document.getElementById('carouselDots');
    const activityCards = document.querySelectorAll('.activity-card');

    if (carouselViewport && carouselPrev && carouselNext && carouselDots && activityCards.length > 0) {
        
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
            });
            
            carouselDots.appendChild(dot);
        });

        const dots = carouselDots.querySelectorAll('.dot');

        // --- Arrow navigation ---
        carouselPrev.addEventListener('click', () => {
            const cardWidth = activityCards[0].offsetWidth + 24;
            carouselViewport.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });

        carouselNext.addEventListener('click', () => {
            const cardWidth = activityCards[0].offsetWidth + 24;
            carouselViewport.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });

        // --- Update dots & arrow states based on scroll position ---
        function updateCarouselState() {
            const scrollLeft = carouselViewport.scrollLeft;
            const cardWidth = activityCards[0].offsetWidth + 24;
            const maxScroll = carouselViewport.scrollWidth - carouselViewport.clientWidth;

            const activeIndex = Math.round(scrollLeft / cardWidth);

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === activeIndex);
            });

            carouselPrev.style.opacity = scrollLeft <= 5 ? '0.4' : '1';
            carouselNext.style.opacity = scrollLeft >= maxScroll - 5 ? '0.4' : '1';
        }

        carouselViewport.addEventListener('scroll', updateCarouselState);
        updateCarouselState();
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

});