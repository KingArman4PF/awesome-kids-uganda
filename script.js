document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed so it doesn't animate again
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.15, // trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px" // trigger slightly before it hits the bottom
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // --- 2. Parallax Effect on Floating Elements ---
    const floatingElements = document.querySelectorAll('.floating-element');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        floatingElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-speed')) || 0.1;
            // Move the element based on scroll position and its speed
            const yPos = scrollY * speed;
            
            // Apply the transform. We use translateY to move it up/down.
            // Note: Using requestAnimationFrame is better for performance, 
            // but this simple version works perfectly for a few elements.
            el.style.transform = `translateY(${yPos}px)`;
        });
    });

});