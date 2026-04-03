document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. HERO CAROUSEL LOGIC
       ========================================= */
    const slides = document.querySelectorAll('.carousel-slide');
    
    // ONLY RUN CAROUSEL IF SLIDES EXIST ON THE CURRENT PAGE
    if (slides.length > 0) {
        const nextBtn = document.querySelector('.next');
        const prevBtn = document.querySelector('.prev');
        
        let currentSlide = 0;
        const totalSlides = slides.length;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        }

        nextBtn.addEventListener('click', () => { 
            nextSlide(); 
            resetInterval(); 
        });
        
        prevBtn.addEventListener('click', () => { 
            prevSlide(); 
            resetInterval(); 
        });

        let slideInterval = setInterval(nextSlide, 5000);

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }
    }

    /* =========================================
       2. MAGNETIC BUTTONS & LINKS
       ========================================= */
    const magneticElements = document.querySelectorAll('.nav-links a, .btn');
    
    magneticElements.forEach(elem => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            // Calculate distance from center of the element
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move the element 30% of the distance toward the cursor
            elem.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        // Snap back into place
        elem.addEventListener('mouseleave', () => {
            elem.style.transform = 'translate(0px, 0px)';
        });
    });

    /* =========================================
       3. SPATIAL 3D CARD TILT
       ========================================= */
    const cards = document.querySelectorAll('.card, .team-member');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation based on mouse position (max 10 degrees)
            const rotateX = ((y - centerY) / centerY) * -10; 
            const rotateY = ((x - centerX) / centerX) * 10;
            
            // Apply 3D transform with a slight pop-out scale
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.borderColor = 'var(--accent-primary)';
        });

        card.addEventListener('mouseleave', () => {
            // Reset to flat when mouse leaves
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        });
    });
});

/* =========================================
   4. AUTOMATIC ACTIVE NAV LINK
   ========================================= */
// Get the current page filename (e.g., 'team.html' or 'index.html')
const currentPath = window.location.pathname.split('/').pop() || 'index.html';

// Select all the links in the navigation bar
const navLinks = document.querySelectorAll('.nav-links a');

// Loop through each link
navLinks.forEach(link => {
    // If the link's href matches the current page, add the active class
    if (link.getAttribute('href') === currentPath) {
        link.classList.add('active-link');
    }
});

/* =========================================
   5. MOBILE HAMBURGER MENU
   ========================================= */
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-links');

if (hamburger) {
    // Toggle menu open/close on click
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu automatically when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

/* =========================================
   6. TOUCAN PARALLAX EFFECT
   ========================================= */
// Add to your existing script.js or create a new file
document.addEventListener('mousemove', function(e) {
    // Get mouse position relative to the viewport
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Select all elements that should track the mouse (class 'toucan-head' in SVGs)
    const heads = document.querySelectorAll('.toucan-head');

    heads.forEach(head => {
        // Calculate the center of the head element
        const rect = head.getBoundingClientRect();
        const headX = rect.left + rect.width / 2;
        const headY = rect.top + rect.height / 2;

        // Calculate the angle and distance from head center to mouse
        const angleRad = Math.atan2(mouseY - headY, mouseX - headX);
        const angleDeg = angleRad * (180 / Math.PI);
        const dist = Math.hypot(mouseX - headX, mouseY - headY);

        // Define tracking intensity based on distance (closer = more movement)
        const intensity = Math.max(0, 1 - dist / 500) * 15; // Max 15 degree tracking

        // Determine correct rotation direction (positive/negative)
        let trackingRotation = angleDeg;
        // On the right side, the SVG is already flipped, so rotation must be reversed.
        if (head.closest('.toucan-right')) {
            trackingRotation = -angleDeg;
        }

        // Clip rotation to a functional range (e.g., +/- 15 degrees)
        const finalRotation = Math.max(-15, Math.min(15, trackingRotation));

        // Apply rotation to only the head group in the SVG
        head.style.transform = `rotate(${finalRotation}deg)`;
    });
});

