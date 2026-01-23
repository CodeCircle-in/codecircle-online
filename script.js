// ========================================
// WAIT FOR DOM CONTENT TO LOAD
// ========================================
document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // MOBILE NAVBAR TOGGLE
    // ========================================
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    menuToggle.addEventListener('click', function () {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navLinkItems = document.querySelectorAll('.nav-link');
    navLinkItems.forEach(link => {
        link.addEventListener('click', function () {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (event) {
        const isClickInsideNav = navLinks.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);

        if (!isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });


    // ========================================
    // SMOOTH SCROLLING
    // ========================================
    const allLinks = document.querySelectorAll('a[href^="#"]');

    allLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Only handle internal links (starting with #)
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const headerOffset = 80; // Account for fixed header
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });


    // ========================================
    // STICKY HEADER & SCROLL EFFECTS
    // ========================================
    const header = document.getElementById('header');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    // ========================================
    // ACTIVE NAVBAR LINK ON SCROLL
    // ========================================
    const sections = document.querySelectorAll('section[id]');

    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll);


    // ========================================
    // SCROLL TO TOP BUTTON
    // ========================================
    const scrollToTopBtn = document.getElementById('scrollToTop');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 500) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    // ========================================
    // SCROLL ANIMATIONS (Fade In on Scroll)
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Add scroll-animate class to elements we want to animate
    const animateElements = document.querySelectorAll(`
        .card,
        .topic-card,
        .community-card,
        .update-card,
        .section-header
    `);

    animateElements.forEach(element => {
        element.classList.add('scroll-animate');
        observer.observe(element);
    });


    // ========================================
    // CONTACT FORM VALIDATION & SUBMISSION
    // ========================================
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Basic validation
        if (name === '' || email === '' || message === '') {
            alert('Please fill in all fields!');
            return;
        }

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address!');
            return;
        }

        // Name validation (at least 2 characters)
        if (name.length < 2) {
            alert('Please enter a valid name (at least 2 characters)!');
            return;
        }

        // Message validation (at least 10 characters)
        if (message.length < 10) {
            alert('Please enter a message with at least 10 characters!');
            return;
        }

        // If validation passes, show success message
        contactForm.style.display = 'none';
        formMessage.classList.remove('hidden');

        // Log form data (in real app, this would be sent to a server)
        console.log('Form submitted with data:', {
            name: name,
            email: email,
            message: message,
            timestamp: new Date().toISOString()
        });

        // Reset form after 3 seconds and show it again
        setTimeout(function () {
            contactForm.reset();
            contactForm.style.display = 'block';
            formMessage.classList.add('hidden');
        }, 5000);
    });


    // ========================================
    // PREVENT FORM SUBMISSION ON ENTER (except in textarea)
    // ========================================
    const formInputs = contactForm.querySelectorAll('input');
    formInputs.forEach(input => {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    });


    // ========================================
    // ADD HOVER EFFECT TO CARDS (Optional Enhancement)
    // ========================================
    const cards = document.querySelectorAll('.card, .topic-card, .community-card, .update-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });


    // ========================================
    // INITIALIZE ANIMATIONS ON PAGE LOAD
    // ========================================
    console.log('CodeCircle.online - Website loaded successfully!');
    console.log('Built with love for students');

    // Add a small delay before showing hero animations
    setTimeout(function () {
        const fadeInElements = document.querySelectorAll('.fade-in');
        fadeInElements.forEach(element => {
            element.style.opacity = '1';
        });
    }, 100);

});


// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Debounce function for scroll events
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Apply debounce to scroll events for better performance
window.addEventListener('scroll', debounce(function () {
    // Any additional scroll-based logic can go here
}));


// ========================================
// ACCESSIBILITY IMPROVEMENTS
// ========================================

// Add keyboard navigation support
document.addEventListener('keydown', function (e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');

        if (navLinks.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    }
});


// ========================================
// CONSOLE STYLE (Fun Easter Egg)
// ========================================
console.log('%cCodeCircle.online', 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 20px; padding: 10px; border-radius: 5px; font-weight: bold;');
console.log('%cJoin our community: https://example.com/discord', 'color: #8b5cf6; font-size: 14px;');
console.log('%cInterested in the code? Check out the source!', 'color: #3b82f6; font-size: 14px;');
