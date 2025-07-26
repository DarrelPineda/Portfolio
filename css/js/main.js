// Main JavaScript functionality
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollEffects();
        this.setupProgressBar();
        this.setupTypingEffect();
        this.setupContactForm();
        this.setupImageLoading();
        this.setupParticleSystem();
        this.setupThemeDetection();
    }

    // Event Listeners
    setupEventListeners() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const navHeight = document.querySelector('nav').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    this.closeMobileMenu();
                }
            });
        });

        // Navbar scroll effect
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navbar.style.background = 'rgba(15, 23, 42, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(15, 23, 42, 0.9)';
            }
            
            // Hide/show navbar on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });

        // Update active navigation link
        window.addEventListener('scroll', () => {
            this.updateActiveNavLink();
        });

        // Resize event for responsive updates
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }

    // Mobile menu functionality
    closeMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        navLinks.classList.remove('active');
        mobileMenu.classList.remove('active');
    }

    // Update active navigation link based on scroll position
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }

    // Scroll animations
    setupScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Add staggered animation for child elements
                    const children = entry.target.querySelectorAll('.project-card, .skill-tag, .contact-item');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.style.animationDelay = `${index * 0.1}s`;
                            child.classList.add('animate-fade-in-up');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in').forEach(el => {
            observer.observe(el);
        });

        // Parallax effect for floating elements
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.floating-element');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // Progress bar
    setupProgressBar() {
        const progressBar = document.getElementById('progress-bar') || this.createProgressBar();
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const maxHeight = document.body.scrollHeight - window.innerHeight;
            const progress = (scrolled / maxHeight) * 100;
            progressBar.style.width = Math.min(progress, 100) + '%';
        });
    }

    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.id = 'progress-bar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        return progressBar;
    }

    // Typing effect for hero subtitle
    setupTypingEffect() {
        const subtitle = document.querySelector('.hero .subtitle');
        if (!subtitle) return;

        const text = subtitle.textContent;
        subtitle.textContent = '';
        subtitle.style.borderRight = '2px solid var(--primary-color)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    subtitle.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        // Start typing effect after hero animation
        setTimeout(typeWriter, 2000);
    }

    // Contact form handling
    setupContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            try {
                // Simulate API call (replace with actual endpoint)
                await this.simulateFormSubmission(formData);
                
                // Success state
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.classList.remove('loading');
                submitBtn.classList.add('success');
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                
                // Show success message
                this.showNotification('Message sent successfully!', 'success');
                
                // Reset form
                form.reset();
                
            } catch (error) {
                // Error state
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed to Send';
                submitBtn.classList.remove('loading');
                submitBtn.classList.add('error');
                
                this.showNotification('Failed to send message. Please try again.', 'error');
            }
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading', 'success', 'error');
                submitBtn.style.background = '';
            }, 3000);
        });

        // Real-time form validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
            input.addEventListener('input', () => this.clearInputError(input));
        });
    }

    async simulateFormSubmission(formData) {
        // Simulate network delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success (90% of the time)
                if (Math.random() > 0.1) {
                    resolve({ status: 'success' });
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }

    validateInput(input) {
        const value = input.value.trim();
        let isValid = true;
        
        // Clear previous errors
        this.clearInputError(input);
        
        // Validation rules
        if (input.hasAttribute('required') && !value) {
            this.showInputError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && value && !this.isValidEmail(value)) {
            this.showInputError(input, 'Please enter a valid email address');
            isValid = false;
        }
        
        return isValid;
    }

    showInputError(input, message) {
        input.classList.add('error');
        
        let errorDiv = input.parentNode.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = `
                color: var(--error-color);
                font-size: 0.8rem;
                margin-top: 0.5rem;
                animation: fadeInUp 0.3s ease;
            `;
            input.parentNode.appendChild(errorDiv);
        }
        
        errorDiv.textContent = message;
    }

    clearInputError(input) {
        input.classList.remove('error');
        const errorDiv = input.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideInFromRight 0.5s ease;
            max-width: 300px;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutToRight 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    // Image loading
    setupImageLoading() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
                this.style.animation = 'fadeIn 0.5s ease forwards';
            });
            
            // Add loading placeholder
            if (!img.complete) {
                img.style.opacity = '0';
                img.style.filter = 'blur(5px)';
            }
        });
    }

    // Particle system
    setupParticleSystem() {
        let particles = [];
        let animationId;

        const createParticle = (x, y) => {
            const particle = {
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 1,
                decay: Math.random() * 0.02 + 0.01,
                size: Math.random() * 3 + 1,
                color: `hsl(${240 + Math.random() * 60}, 70%, 60%)`
            };
            return particle;
        };

        const updateParticles = () => {
            particles.forEach((particle, index) => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.life -= particle.decay;
                particle.vy += 0.1; // gravity
                
                if (particle.life <= 0) {
                    particles.splice(index, 1);
                }
            });
            
            if (particles.length > 0) {
                animationId = requestAnimationFrame(updateParticles);
            }
        };

        const renderParticles = () => {
            particles.forEach(particle => {
                const element = document.createElement('div');
                element.style.cssText = `
                    position: fixed;
                    left: ${particle.x}px;
                    top: ${particle.y}px;
                    width: ${particle.size}px;
                    height: ${particle.size}px;
                    background: ${particle.color};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    opacity: ${particle.life};
                `;
                document.body.appendChild(element);
                
                setTimeout(() => element.remove(), 100);
            });
        };

        // Create particles on interaction
        document.addEventListener('click', (e) => {
            for (let i = 0; i < 5; i++) {
                particles.push(createParticle(e.clientX, e.clientY));
            }
            
            if (particles.length > 0 && !animationId) {
                updateParticles();
            }
            
            renderParticles();
        });

        // Floating cursor particles
        let mouseTimeout;
        document.addEventListener('mousemove', (e) => {
            clearTimeout(mouseTimeout);
            
            if (Math.random() > 0.95) {
                particles.push(createParticle(e.clientX, e.clientY));
                renderParticles();
                
                if (particles.length > 0 && !animationId) {
                    updateParticles();
                }
            }
        });
    }

    // Theme detection
    setupThemeDetection() {
        // Detect user's preferred color scheme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Listen for changes in color scheme preference
        prefersDark.addEventListener('change', (e) => {
            // Update theme if needed
            this.updateTheme(e.matches ? 'dark' : 'light');
        });
    }

    updateTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update meta theme-color
        let themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (!themeColorMeta) {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.name = 'theme-color';
            document.head.appendChild(themeColorMeta);
        }
        
        themeColorMeta.content = theme === 'dark' ? '#0f172a' : '#ffffff';
    }

    // Handle window resize
    handleResize() {
        // Update parallax calculations
        this.setupScrollEffects();
        
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
    }

    // Utility methods
    debounce(func, wait) {
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Performance monitoring
    measurePerformance() {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
        }
    }

    // Error handling
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('JavaScript Error:', e.error);
            // Optionally send error to analytics service
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled Promise Rejection:', e.reason);
            // Optionally send error to analytics service
        });
    }
}

// Utility functions
const utils = {
    // Smooth scroll to element
    scrollToElement(element, offset = 0) {
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Generate random ID
    generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    },

    // Format date
    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },

    // Copy text to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        }
    },

    // Lazy load images
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
};

// Analytics (optional)
const analytics = {
    // Track page views
    trackPageView(page) {
        // Replace with your analytics service
        console.log('Page view:', page);
    },

    // Track events
    trackEvent(category, action, label) {
        // Replace with your analytics service
        console.log('Event:', { category, action, label });
    },

    // Track form submissions
    trackFormSubmission(formName) {
        this.trackEvent('Form', 'Submit', formName);
    },

    // Track button clicks
    trackButtonClick(buttonName) {
        this.trackEvent('Button', 'Click', buttonName);
    }
};

// Service Worker registration (for PWA support)
const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered successfully:', registration);
        } catch (error) {
            console.log('Service Worker registration failed:', error);
        }
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main app
    const app = new PortfolioApp();
    
    // Setup error handling
    app.setupErrorHandling();
    
    // Measure performance
    window.addEventListener('load', () => {
        app.measurePerformance();
    });
    
    // Initialize lazy loading
    utils.lazyLoadImages();
    
    // Register service worker
    // registerServiceWorker();
    
    // Track initial page view
    analytics.trackPageView(window.location.pathname);
    
    console.log('Portfolio app initialized successfully!');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioApp, utils, analytics };
}