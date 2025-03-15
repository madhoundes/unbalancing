// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize accordion functionality
    initAccordion();
    
    // The text to be typed for the heading
    const headingText = "Instant <span class='highlight'>Push Notifications</span> Maximum Conversions";
    
    // The paragraph text to animate after heading
    const paragraphText = "Increase Your Online Sales With Targeted Push Notifications, In-Page Ads, And Pop Traffic.";
    
    // Get the elements where the text will be typed/animated
    const typewriterElement = document.querySelector('.typewriter-text');
    const cursorElement = document.querySelector('.cursor');
    const typewriterContainer = document.getElementById('typewriter');
    const paragraphElement = document.querySelector('.hero-text p');
    const ctaButtonsElement = document.querySelector('.cta-buttons');
    const heroImage = document.querySelector('.hero-image');
    const heroImageImg = document.querySelector('.hero-image img');
    
    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize animations for niches grid
    initNichesGridAnimations();
    
    // Initialize animations for features grid
    initFeaturesGridAnimations();
    
    // Initialize alternative section title animations
    initSectionTitleAnimations();
    
    // Set initial states for hero elements
    gsap.set(typewriterElement, { opacity: 0 });
    gsap.set(paragraphElement, { opacity: 0, y: 15, visibility: 'hidden' }); // Hide paragraph completely
    gsap.set(ctaButtonsElement, { opacity: 0, y: 20, visibility: 'hidden' }); // Hide buttons completely
    gsap.set(heroImage, { opacity: 0, x: 50 });
    
    // Create a master timeline for hero animations
    const heroTl = gsap.timeline();
    
    // 1. First animate the mobile image from right
    heroTl.to(heroImage, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: "power2.out",
    });
    
    // 2. Then start the typewriter effect (slower than before)
    heroTl.add(() => {
        // Variables to control the typing
        let i = 0;
        let speed = 30; // Slower typing speed
        let htmlContent = '';
        let isTag = false;
        let currentTag = '';
        
        // Function to type the heading character by character
        function typeHeading() {
            if (i < headingText.length) {
                // Check if we're currently building an HTML tag
                if (headingText.charAt(i) === '<') {
                    isTag = true;
                    currentTag += headingText.charAt(i);
                } else if (headingText.charAt(i) === '>') {
                    isTag = false;
                    currentTag += headingText.charAt(i);
                    htmlContent += currentTag;
                    currentTag = '';
                } else if (isTag) {
                    currentTag += headingText.charAt(i);
                } else {
                    // If not in a tag, add the character to the visible content
                    htmlContent += headingText.charAt(i);
                    typewriterElement.innerHTML = htmlContent;
                }
                
                i++;
                // Use a consistent speed for smoother typing
                setTimeout(typeHeading, speed);
                
                // Start paragraph animation after a short delay when typing begins
                if (i === 3) { // After a few characters have been typed
                    // Make paragraph visible and start animation
                    gsap.set(paragraphElement, { visibility: 'visible' });
                    gsap.to(paragraphElement, {
                        opacity: 1,
                        y: 0,
                        duration: 0.3, // Quick fade-in
                        delay: 0.2, // 0.2s delay as requested
                        ease: "power2.out"
                    });
                }
            } else {
                // Heading animation complete
                typewriterContainer.classList.add('typing-done');
                cursorElement.classList.add('typing-done');
                
                // Signal to the main timeline that typing is complete
                heroTl.resume();
            }
        }
        
        // Make typewriter visible before starting
        gsap.to(typewriterElement, { opacity: 1, duration: 0.2 });
        
        // Start the typewriter effect
        typeHeading();
        
        // Pause the main timeline until typing is complete
        heroTl.pause();
    });
    
    // 4. Finally, animate the CTA buttons
    heroTl.to(ctaButtonsElement, {
        visibility: 'visible', // Make buttons visible first
        duration: 0,
        onComplete: function() {
            // Then animate their opacity and position
            gsap.to(ctaButtonsElement, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.out"
            });
        }
    });
    
    // Start the hero animation sequence
    heroTl.play();
});

// Function to initialize alternative section title animations (without SplitText)
function initSectionTitleAnimations() {
    // Get all section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    
    // Process each section title
    sectionTitles.forEach(title => {
        // Create a wrapper for the title to contain the animation
        const wrapper = document.createElement('div');
        wrapper.classList.add('title-wrapper');
        wrapper.style.overflow = 'hidden'; // Hide overflow for the slide-up effect
        
        // Replace the title with the wrapper and move the title inside
        title.parentNode.insertBefore(wrapper, title);
        wrapper.appendChild(title);
        
        // Set initial state
        gsap.set(title, { 
            y: 30,
            opacity: 0,
            visibility: 'hidden'
        });
        
        // Create a ScrollTrigger for this specific title
        ScrollTrigger.create({
            trigger: wrapper,
            start: "top 85%", // Start animation slightly earlier
            once: true, // Only trigger once for performance
            onEnter: () => {
                // Create animation timeline
                gsap.to(title, {
                    visibility: 'visible',
                    duration: 0,
                    onComplete: () => {
                        gsap.to(title, {
                            y: 0,
                            opacity: 1,
                            duration: 0.7,
                            ease: "power2.out"
                        });
                    }
                });
            }
        });
    });
}

// Function to initialize accordion
function initAccordion() {
    const accordionButtons = document.querySelectorAll('.accordion-button');
    
    // Set initial state for all accordion content panels
    const accordionContents = document.querySelectorAll('.accordion-content');
    accordionContents.forEach(content => {
        // Initialize all panels as closed but visible for GSAP
        content.classList.remove('active');
        content.style.display = 'block';
        content.style.height = '0';
        content.style.overflow = 'hidden';
        content.style.opacity = 0;
        
        // Force GPU acceleration for smoother animations
        gsap.set(content, {
            willChange: 'height, opacity',
            force3D: true,
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d'
        });
    });
    
    // Pre-calculate heights for all accordion contents to avoid measuring during transitions
    const contentHeights = new Map();
    
    // Function to calculate and store heights (called on init and window resize)
    function updateContentHeights() {
        accordionContents.forEach(content => {
            // Temporarily reset styles to measure actual height
            const originalStyles = {
                display: content.style.display,
                height: content.style.height,
                opacity: content.style.opacity,
                overflow: content.style.overflow,
                position: content.style.position,
                visibility: content.style.visibility
            };
            
            // Make content temporarily visible for measurement
            content.style.height = 'auto';
            content.style.opacity = '0';
            content.style.position = 'absolute';
            content.style.visibility = 'hidden';
            content.style.display = 'block';
            content.style.overflow = 'visible';
            
            // Get the height
            const height = content.offsetHeight;
            contentHeights.set(content, height);
            
            // Restore original styles
            content.style.display = originalStyles.display;
            content.style.height = originalStyles.height;
            content.style.opacity = originalStyles.opacity;
            content.style.overflow = originalStyles.overflow;
            content.style.position = originalStyles.position;
            content.style.visibility = originalStyles.visibility;
        });
    }
    
    // Calculate heights initially
    updateContentHeights();
    
    // Update heights on window resize (debounced)
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateContentHeights, 250);
    });
    
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the parent accordion item for animation
            const accordionItem = this.parentElement;
            
            // Toggle active class on the button
            this.classList.toggle('active');
            
            // Get the content panel
            const content = this.nextElementSibling;
            const isOpen = this.classList.contains('active');
            
            // Cancel any ongoing animations first
            gsap.killTweensOf(content);
            
            if (isOpen) {
                // Get pre-calculated height
                const height = contentHeights.get(content);
                
                // Animate opening with improved performance
                gsap.fromTo(content, 
                    { 
                        height: 0, 
                        opacity: 0 
                    },
                    {
                        height: height,
                        opacity: 1,
                        duration: 0.25,
                        ease: 'power2.out',
                        overwrite: true,
                        onComplete: () => {
                            // Set to auto after animation completes
                            content.style.height = 'auto';
                        }
                    }
                );
            } else {
                // First set a specific height (from auto) to enable animation
                const currentHeight = content.offsetHeight;
                gsap.set(content, { height: currentHeight });
                
                // Animate closing with improved performance
                gsap.to(content, {
                    height: 0,
                    opacity: 0,
                    duration: 0.2,
                    ease: 'power2.inOut',
                    overwrite: true
                });
            }
        });
    });
}

// Function to initialize animations for the niches grid
function initNichesGridAnimations() {
    // Get all niche cards
    const nicheCards = document.querySelectorAll('.niches-grid .niche-card');
    
    // Set initial state for all niche cards (invisible and scaled down)
    gsap.set(nicheCards, { 
        opacity: 0,
        scale: 0.95, // Less dramatic initial scale for smoother animation
        y: 15 // Reduced offset for subtler animation
    });
    
    // Create the animation timeline with improved performance
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.niches-section',
            start: 'top 75%', // Start slightly earlier for a more natural feel
            toggleActions: 'play none none none',
            once: true, // Only play once for better performance
        }
    });
    
    // Add staggered animations to the timeline with optimized settings
    tl.to(nicheCards, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4, // Faster duration for more efficient animation
        ease: 'power3.out', // More professional easing function
        stagger: {
            amount: 0.5, // Reduced stagger time for faster overall animation
            from: 'start',
            grid: 'auto',
            ease: 'power1.inOut' // Smoother stagger timing
        },
        clearProps: 'scale,y' // Clear props after animation for better performance
    });
    
    // More efficient hover animations for niche cards
    nicheCards.forEach(card => {
        // Use a single event listener for better performance
        card.addEventListener('mouseenter', () => {
            gsap.to(card.querySelector('.niche-image'), {
                scale: 1.03, // Subtler scale for more professional look
                duration: 0.3, // Faster for more responsive feel
                ease: 'power2.out',
                overwrite: 'auto' // Prevent animation conflicts
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card.querySelector('.niche-image'), {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        });
    });
}

// Function to initialize animations for features grid
function initFeaturesGridAnimations() {
    // Get all feature cards
    const featureCards = document.querySelectorAll('.features-grid .feature-card');
    
    // Create a ScrollTrigger for the features grid
    ScrollTrigger.create({
        trigger: '.features-grid',
        start: "top 75%", // Start animation when the top of the grid is 75% from the top of the viewport
        once: true, // Only trigger once for performance
        onEnter: () => {
            // Create a timeline for staggered animation
            const tl = gsap.timeline();
            
            // Animate each card with a delay between them
            featureCards.forEach((card, index) => {
                // Set initial state with GSAP for better control
                gsap.set(card, { 
                    opacity: 0,
                    x: -20,
                    force3D: true // Hardware acceleration
                });
                
                // Add card animation to timeline with staggered delay
                tl.to(card, {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    onComplete: () => card.classList.add('animated')
                }, index * 0.3); // 0.3s delay between each card
            });
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
}); 