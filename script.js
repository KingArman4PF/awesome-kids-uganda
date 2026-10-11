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


    // --- 3. Auto-Hide Navbar on Scroll ---
    const navbar = document.querySelector('.glass-nav');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // If at the very top of the page
        if (currentScrollY === 0) {
            navbar.classList.remove('nav-up');
            navbar.classList.add('at-top');
        } else {
            navbar.classList.remove('at-top');

            // If scrolling down, hide navbar. If scrolling up, show navbar.
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                navbar.classList.add('nav-up');
            } else {
                navbar.classList.remove('nav-up');
            }
        }

        lastScrollY = currentScrollY;
    });


    // --- 4. Hamburger Menu Toggle ---
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

});