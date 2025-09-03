// Adway Sawant Portfolio - Interactive Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    initNavigation();
    
    // Contact form functionality
    initContactForm();
    
    // Download resume functionality
    initDownloadResume();
    
    // Skills animations
    initSkillsAnimations();
    
    // Scroll animations
    initScrollAnimations();
});

// Navigation Management
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Enhanced smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Close mobile menu
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (navToggle) {
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navToggle && navMenu && 
            !navToggle.contains(event.target) && 
            !navMenu.contains(event.target)) {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // Active navigation link highlighting
    updateActiveNavLink();
    window.addEventListener('scroll', debounce(updateActiveNavLink, 10));
}

function initSmoothScrolling() {
    // Add smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            console.log('Clicking link to:', targetId);
            
            if (targetId && targetId !== '#' && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                console.log('Target element found:', targetElement);
                
                if (targetElement) {
                    const headerOffset = 80; // Account for fixed header
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset;
                    
                    console.log('Scrolling to position:', offsetPosition);
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Also handle the "Get In Touch" button in hero section
    const getInTouchBtn = document.querySelector('.hero__actions a[href="#contact"]');
    if (getInTouchBtn) {
        getInTouchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const headerOffset = 80;
                const elementPosition = contactSection.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    
    let current = '';
    const scrollPosition = window.scrollY + 150; // Adjusted offset for better detection
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    // If at the very top, highlight home
    if (window.scrollY < 100) {
        current = 'home';
    }
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Skills Section Animations
function initSkillsAnimations() {
    const skillCards = document.querySelectorAll('.skill__card');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Trigger staggered animation
                setTimeout(() => {
                    entry.target.style.animationPlayState = 'running';
                    entry.target.classList.add('animate-in');
                }, index * 100);
                
                // Unobserve once animated
                skillsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all skill cards
    skillCards.forEach((card, index) => {
        // Initially pause animations
        card.style.animationPlayState = 'paused';
        skillsObserver.observe(card);
        
        // Add hover effects for enhanced interactivity
        addSkillCardHoverEffects(card);
    });
}

function addSkillCardHoverEffects(card) {
    let hoverTimeout;
    
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.skill__icon i');
        
        // Add pulse effect
        if (icon) {
            icon.style.animation = 'skillIconPulse 0.6s ease-in-out';
        }
        
        // Add glow effect
        this.style.boxShadow = `
            0 20px 40px rgba(0, 212, 255, 0.2),
            0 0 30px rgba(0, 212, 255, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `;
        
        clearTimeout(hoverTimeout);
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.skill__icon i');
        
        hoverTimeout = setTimeout(() => {
            if (icon) {
                icon.style.animation = '';
            }
        }, 300);
    });
    
    // Add click effect for mobile
    card.addEventListener('click', function() {
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
}

// Contact Form Management
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (!contactForm || !formStatus) return;
    
    // Add real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Remove error styling when user starts typing
            this.classList.remove('error');
            const errorMsg = this.parentNode.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    });
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const subject = formData.get('subject').trim();
        const message = formData.get('message').trim();
        
        // Clear previous errors
        clearFormErrors();
        
        // Validate form
        const validation = validateContactForm(name, email, subject, message);
        
        if (!validation.isValid) {
            showFormStatus(validation.message, 'error');
            // Scroll to form if needed
            contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        
        // Submit form
        submitContactForm(name, email, subject, message);
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    
    if (!value && field.hasAttribute('required')) {
        isValid = false;
        message = `${field.previousElementSibling.textContent} is required.`;
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        message = 'Please enter a valid email address.';
    } else if (field.name === 'message' && value && value.length < 10) {
        isValid = false;
        message = 'Message must be at least 10 characters long.';
    }
    
    if (!isValid) {
        showFieldError(field, message);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#ff5459';
    errorElement.style.fontSize = '12px';
    errorElement.style.marginTop = '4px';
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

function clearFormErrors() {
    const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
    inputs.forEach(input => {
        clearFieldError(input);
    });
}

function validateContactForm(name, email, subject, message) {
    if (!name) {
        const nameField = document.getElementById('name');
        showFieldError(nameField, 'Name is required.');
        return { isValid: false, message: 'Please fill in all required fields.' };
    }
    
    if (!email) {
        const emailField = document.getElementById('email');
        showFieldError(emailField, 'Email is required.');
        return { isValid: false, message: 'Please fill in all required fields.' };
    }
    
    if (!isValidEmail(email)) {
        const emailField = document.getElementById('email');
        showFieldError(emailField, 'Please enter a valid email address.');
        return { isValid: false, message: 'Please enter a valid email address.' };
    }
    
    if (!subject) {
        const subjectField = document.getElementById('subject');
        showFieldError(subjectField, 'Subject is required.');
        return { isValid: false, message: 'Please fill in all required fields.' };
    }
    
    if (!message) {
        const messageField = document.getElementById('message');
        showFieldError(messageField, 'Message is required.');
        return { isValid: false, message: 'Please fill in all required fields.' };
    }
    
    if (message.length < 10) {
        const messageField = document.getElementById('message');
        showFieldError(messageField, 'Message must be at least 10 characters long.');
        return { isValid: false, message: 'Message must be at least 10 characters long.' };
    }
    
    return { isValid: true, message: '' };
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitContactForm(name, email, subject, message) {
    const submitButton = document.querySelector('#contactForm button[type="submit"]');
    const formStatus = document.getElementById('formStatus');
    
    if (!submitButton || !formStatus) return;
    
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // Simulate API call with timeout
    setTimeout(() => {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Show success message
        showFormStatus('Thank you for your message! I\'ll get back to you soon. Opening your email client...', 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
        clearFormErrors();
        
        // Create mailto link as fallback (no phone number included as requested)
        const mailtoLink = `mailto:adway100k@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        
        // Open default email client
        setTimeout(() => {
            window.location.href = mailtoLink;
        }, 1500);
        
    }, 1500);
}

function showFormStatus(message, type) {
    const formStatus = document.getElementById('formStatus');
    
    if (!formStatus) return;
    
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.classList.remove('hidden');
    
    // Hide status after 8 seconds
    setTimeout(() => {
        formStatus.classList.add('hidden');
    }, 8000);
}

// Download Resume Functionality
function initDownloadResume() {
    const downloadButton = document.getElementById('downloadResume');
    
    if (!downloadButton) return;
    
    downloadButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        const originalText = downloadButton.innerHTML;
        
        // Show loading state
        downloadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
        downloadButton.disabled = true;
        
        setTimeout(() => {
            // Create resume content (updated without phone number and BS Data Science)
            const resumeContent = generateResumeContent();
            
            // Create and download text file
            downloadTextFile('Adway_Sawant_Resume.txt', resumeContent);
            
            // Show success feedback
            downloadButton.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
            downloadButton.style.background = 'linear-gradient(45deg, #00ff88, #00cc66)';
            downloadButton.style.color = '#0a0a0a';
            
            // Reset button after 3 seconds
            setTimeout(() => {
                downloadButton.innerHTML = originalText;
                downloadButton.style.background = '';
                downloadButton.style.color = '';
                downloadButton.disabled = false;
            }, 3000);
            
            // Show additional feedback
            const successMessage = document.createElement('div');
            successMessage.textContent = 'Resume downloaded successfully!';
            successMessage.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(45deg, #00ff88, #00cc66);
                color: #0a0a0a;
                padding: 12px 20px;
                border-radius: 8px;
                font-weight: bold;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0, 255, 136, 0.3);
                transform: translateX(100%);
                transition: transform 0.3s ease;
            `;
            
            document.body.appendChild(successMessage);
            
            // Animate in
            setTimeout(() => {
                successMessage.style.transform = 'translateX(0)';
            }, 100);
            
            // Remove after 4 seconds
            setTimeout(() => {
                successMessage.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (document.body.contains(successMessage)) {
                        document.body.removeChild(successMessage);
                    }
                }, 300);
            }, 4000);
            
        }, 1000);
    });
}

function generateResumeContent() {
    return `
ADWAY SAWANT
AI/ML Enthusiast | Web Developer | Tech Entrepreneur | Freelancer

Contact Information:
Email: adway100k@gmail.com
Location: Nashik, Maharashtra, India

LinkedIn: https://www.linkedin.com/in/adway-sawant-815452327/
GitHub: https://github.com/adway-sawant94
Instagram: https://www.instagram.com/tech.studio_6?igsh=ZW5nMzB2Z25yZ2F3

ABOUT ME
========
I'm Adway Sawant, a passionate 2nd-year BTech AIML student with a strong inclination towards Artificial Intelligence, Machine Learning, and Tech. I've been actively involved in real-world projects and hackathons, building impactful solutions. I love exploring emerging technologies and combining technical knowledge with creativity to solve real-world problems. I aspire to join MAANG companies and want to establish my tech startup that I am currently working on, launch my own startup that drives positive tech disruption.

EDUCATION
=========
• BTech in AIML – Sandip Institute of Technology and Research Centre (SITRC) | 2023 – Present

TECHNICAL SKILLS
================
Programming Languages: Python (1+ years), C++ (1+ years), JavaScript (1+ years)
Web Development: HTML (1+ years), CSS (1+ years), React.js (1+ years), Node.js (1+ years)
AI/ML: Machine Learning (1+ years)
Databases: MongoDB (1+ years), MySQL (1+ years), Firebase (1+ years)
Tools: Git (1+ years)

PROJECTS
========
1. AI Resume Review Tool (In Development)
   - Description: A tool that uses AI to review resumes, suggest improvements, and analyze ATS compatibility
   - Technologies: HTML, CSS, Flask, OpenAI API
   - Features: Integrated AI suggestions, premium UI, Razorpay enabled

2. AI Legal Assistant (CrewAI)
   - Description: A voice-based legal assistant using LLMs to answer IPC/CrPC-related queries
   - Technologies: Python, CrewAI, LangChain
   - Status: Completed

CERTIFICATIONS
==============
• Machine Learning Using Python - Simplilearn (2024)

CONTACT
=======
I'm always open to discussing new opportunities, collaborations, and innovative projects in AI/ML and web development. Feel free to reach out!

Generated on: ${new Date().toLocaleDateString()}
    `.trim();
}

function downloadTextFile(filename, content) {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    
    element.href = URL.createObjectURL(file);
    element.download = filename;
    element.style.display = 'none';
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    // Clean up the URL object
    setTimeout(() => {
        URL.revokeObjectURL(element.href);
    }, 1000);
}

// Scroll Animations
function initScrollAnimations() {
    // Add intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.project__card, .stat, .education__item, .certification__card');
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add CSS for animations
    if (!document.querySelector('#scroll-animations-style')) {
        const style = document.createElement('style');
        style.id = 'scroll-animations-style';
        style.textContent = `
            .project__card, .stat, .education__item, .certification__card {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .fade-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            /* Skill card animations */
            .skill__card.animate-in {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            
            /* Skill icon pulse animation */
            @keyframes skillIconPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            /* Error styling for form fields */
            .form-control.error {
                border-color: #ff5459 !important;
                box-shadow: 0 0 0 3px rgba(255, 84, 89, 0.2) !important;
            }
            
            /* Enhanced skill card hover effects */
            .skill__card:hover .skill__icon {
                animation: skillIconPulse 0.6s ease-in-out !important;
            }
            
            @media (prefers-reduced-motion: reduce) {
                .project__card, .skill__card, .stat, .education__item, .certification__card {
                    opacity: 1;
                    transform: none;
                    transition: none;
                    animation: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add loading animation on page load
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add CSS for page load animation if not exists
    if (!document.querySelector('#page-load-style')) {
        const loadStyle = document.createElement('style');
        loadStyle.id = 'page-load-style';
        loadStyle.textContent = `
            body {
                opacity: 0;
                transition: opacity 0.5s ease-in-out;
            }
            
            body.loaded {
                opacity: 1;
            }
        `;
        document.head.appendChild(loadStyle);
    }
    
    // Initialize skills animations after page load
    setTimeout(initSkillsAnimations, 500);
});

// Console message for developers
console.log(`
🚀 Welcome to Adway Sawant's Portfolio!
💻 Built with modern web technologies
🎯 Focused on AI/ML and Tech Innovation
✨ Features modern card-based skills section with animations

Feel free to explore the code and reach out for collaborations!
GitHub: https://github.com/adway-sawant94
Email: adway100k@gmail.com
`);