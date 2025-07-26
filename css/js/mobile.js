// Mobile-specific JavaScript functionality
class MobileController {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isTablet = this.detectTablet();
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.init();
    }

    init() {
        if (this.isMobile || this.isTablet) {
            this.setupMobileNavigation();
            this.setupTouchGestures();
            this.setupMobileOptimizations();
            this.setupOrientationHandling();
            this.setupTouchFeedback();
            this.setupMobileScrollEffects();
        }
    }

    // Device detection
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }

    detectTablet() {
        return /iPad|Android/i.test(navigator.userAgent) && 
               window.innerWidth > 768 && window.innerWidth <= 1024;
    }

    // Mobile navigation setup
    setupMobileNavigation() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const navLinks = document.querySelector('.nav-links');
        const navbar = document.querySelector('nav');
        
        if (!mobileMenu || !navLinks) return;

        // Mobile menu toggle
        mobileMenu.addEventListener('click', () => {
            const isActive = navLinks.classList.contains('active');
            
            if (isActive) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        });

        // Close menu when clicking on links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    openMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        navLinks.classList.add('active');
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent body scroll
        
        // Add animation class to menu items
        const menuItems = navLinks.querySelectorAll('li');
        menuItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.animation = `slideInFromRight 0.3s ease ${index * 0.1}s forwards`;
            }, 100);
        });
    }

    closeMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        navLinks.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = ''; // Restore body scroll
        
        // Clear animations
        const menuItems = navLinks.querySelectorAll('li');
        menuItems.forEach(item => {
            item.style.animation = '';
        });
    }

    // Touch gesture handling
    setupTouchGestures() {
        // Swipe to close mobile menu
        document.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            this.touchEndY = e.changedTouches[0].clientY;
            this.handleSwipeGesture();
        }, { passive: true });

        // Pull-to-refresh prevention (optional)
        this.preventPullToRefresh();

        // Touch-friendly hover effects
        this.setupTouchHoverEffects();
    }

    handleSwipeGesture() {
        const swipeThreshold = 50;
        const swipeDistance = this.touchEndY - this.touchStartY;
        
        // Swipe right to close menu
        if (Math.abs(swipeDistance) > swipeThreshold) {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks && navLinks.classList.contains('active')) {
                this.closeMobileMenu();
            }
        }
    }

    preventPullToRefresh() {
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].pageY;
        }, { passive: false });
        
        document.addEventListener('touchmove', (e) => {
            const y = e.touches[0].pageY;
            // Prevent pull-to-refresh if at top of page and pulling down
            if (window.scrollY === 0 && y > startY) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    setupTouchHoverEffects() {
        // Convert hover effects to touch-friendly interactions
        const hoverElements = document.querySelectorAll('.btn, .project-card, .skill-tag');
        
        hoverElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, { passive: true });
            
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 300);
            }, { passive: true });
        });
    }

    // Mobile-specific optimizations
    setupMobileOptimizations() {
        // Reduce animations on mobile for better performance
        if (this.isMobile) {
            this.reduceMobileAnimations();
        }

        // Optimize images for mobile
        this.optimizeMobileImages();

        // Setup viewport meta tag optimization
        this.optimizeViewport();

        // Handle safe area insets (for iPhone X+)
        this.handleSafeAreaInsets();
    }

    reduceMobileAnimations() {
        // Disable complex animations on low-end devices
        const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
        
        if (isLowEndDevice) {
            document.documentElement.style.setProperty('--animation-duration', '0.2s');
            
            // Disable particle effects
            const particleElements = document.querySelectorAll('.floating-element');
            particleElements.forEach(el => {
                el.style.animation = 'none';
            });
        }
    }

    optimizeMobileImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Add loading="lazy" for better performance
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Optimize image quality on mobile
            if (this.isMobile && img.src.includes('unsplash')) {
                const url = new URL(img.src);
                url.searchParams.set('w', '800'); // Reduce width for mobile
                url.searchParams.set('q', '75'); // Reduce quality slightly
                img.src = url.toString();
            }
        });
    }

    optimizeViewport() {
        let viewportMeta = document.querySelector('meta[name="viewport"]');
        
        if (!viewportMeta) {
            viewportMeta = document.createElement('meta');
            viewportMeta.name = 'viewport';
            document.head.appendChild(viewportMeta);
        }
        
        // Enhanced viewport settings for better mobile experience
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, shrink-to-fit=no';
    }

    handleSafeAreaInsets() {
        // Check if device supports safe area insets
        if (CSS.supports('padding: max(0px)')) {
            document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
            document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
            document.documentElement.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left)');
            document.documentElement.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right)');
            
            // Apply safe area padding to navigation
            const nav = document.querySelector('nav');
            if (nav) {
                nav.style.paddingTop = 'max(1rem, env(safe-area-inset-top))';
            }
        }
    }

    // Orientation change handling
    setupOrientationHandling() {
        window.addEventListener('orientationchange', () => {
            // Close mobile menu on orientation change
            this.closeMobileMenu();
            
            // Recalculate dimensions after orientation change
            setTimeout(() => {
                this.handleOrientationChange();
            }, 500);
        });

        // Handle resize events (for Android)
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    handleOrientationChange() {
        // Update viewport height for mobile browsers
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Adjust hero section height
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.minHeight = `${window.innerHeight}px`;
        }
        
        // Trigger resize on form elements to fix iOS bugs
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.blur();
        });
    }

    handleResize() {
        // Update mobile/tablet detection
        this.isMobile = this.detectMobile();
        this.isTablet = this.detectTablet();
        
        // Close mobile menu if screen becomes desktop size
        if (!this.isMobile && !this.isTablet) {
            this.closeMobileMenu();
        }
        
        this.handleOrientationChange();
    }

    // Touch feedback effects
    setupTouchFeedback() {
        // Add haptic feedback for supported devices
        const buttons = document.querySelectorAll('.btn, .project-link, .social-links a');
        
        buttons.forEach(button => {
            button.addEventListener('touchstart', () => {
                // Haptic feedback
                if (window.navigator && window.navigator.vibrate) {
                    window.navigator.vibrate(10);
                }
                
                // Visual feedback
                button.style.transform = 'scale(0.95)';
            }, { passive: true });
            
            button.addEventListener('touchend', () => {
                button.style.transform = '';
            }, { passive: true });
        });
    }

    // Mobile-optimized scroll effects
    setupMobileScrollEffects() {
        let ticking = false;
        
        const optimizedScrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleMobileScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        // Use passive listeners for better performance
        window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    }

    handleMobileScroll() {
        const scrollY = window.scrollY;
        
        // Hide/show navbar based on scroll direction (mobile only)
        if (this.isMobile) {
            const navbar = document.querySelector('nav');
            if (navbar) {
                if (scrollY > this.lastScrollY && scrollY > 100) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
                this.lastScrollY = scrollY;
            }
        }
        
        // Reduced parallax effect on mobile for better performance
        if (!this.isMobile) {
            const parallaxElements = document.querySelectorAll('.floating-element');
            parallaxElements.forEach((element, index) => {
                const speed = 0.3 + (index * 0.05); // Reduced speed
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }
    }

    // Form handling for mobile
    setupMobileFormHandling() {
        const inputs = document.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Prevent zoom on input focus (iOS)
            input.addEventListener('focus', () => {
                if (this.isMobile) {
                    const viewport = document.querySelector('meta[name=viewport]');
                    if (viewport) {
                        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
                    }
                }
            });
            
            input.addEventListener('blur', () => {
                if (this.isMobile) {
                    const viewport = document.querySelector('meta[name=viewport]');
                    if (viewport) {
                        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
                    }
                }
            });
        });
    }

    // Performance monitoring for mobile
    monitorMobilePerformance() {
        // Check if device has sufficient performance
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (connection) {
            // Adjust quality based on connection
            if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
                this.enableDataSaverMode();
            }
        }
        
        // Monitor memory usage
        if ('memory' in performance) {
            const memoryInfo = performance.memory;
            const memoryUsage = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
            
            if (memoryUsage > 0.8) {
                this.enableLowMemoryMode();
            }
        }
    }

    enableDataSaverMode() {
        console.log('Data saver mode enabled');
        
        // Disable non-essential animations
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
        
        // Remove background effects
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach(el => el.style.display = 'none');
    }

    enableLowMemoryMode() {
        console.log('Low memory mode enabled');
        
        // Disable all animations
        document.documentElement.style.setProperty('--animation-duration', '0s');
        
        // Remove particle effects
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => particle.remove());
    }

    // Utility methods
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    getScreenSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            ratio: window.devicePixelRatio || 1
        };
    }

    // Cleanup method
    destroy() {
        // Remove event listeners and clean up
        window.removeEventListener('orientationchange', this.handleOrientationChange);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('touchstart', this.handleSwipeGesture);
        document.removeEventListener('touchend', this.handleSwipeGesture);
    }
}

// iOS-specific fixes
class IOSFixes {
    constructor() {
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (this.isIOS) {
            this.init();
        }
    }

    init() {
        this.fixViewportHeight();
        this.fixScrollBounce();
        this.fixInputZoom();
        this.fixSafeArea();
    }

    fixViewportHeight() {
        // Fix the infamous iOS viewport height issue
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', () => {
            setTimeout(setVH, 500);
        });
    }

    fixScrollBounce() {
        // Prevent elastic scrolling on iOS
        document.body.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                const scrollY = window.pageYOffset;
                const innerHeight = window.innerHeight;
                const bodyHeight = document.body.offsetHeight;
                
                if (scrollY === 0) {
                    window.scrollTo(0, 1);
                } else if (scrollY + innerHeight >= bodyHeight) {
                    window.scrollTo(0, bodyHeight - innerHeight - 1);
                }
            }
        }, { passive: false });
    }

    fixInputZoom() {
        // Prevent zoom on input focus
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.fontSize = '16px'; // Prevent zoom
            });
            
            input.addEventListener('blur', () => {
                input.style.fontSize = ''; // Reset
            });
        });
    }

    fixSafeArea() {
        // Handle safe area insets for iPhone X+
        if (window.CSS && CSS.supports('padding: max(0px)')) {
            const nav = document.querySelector('nav');
            const footer = document.querySelector('footer');
            
            if (nav) {
                nav.style.paddingTop = 'max(1rem, env(safe-area-inset-top))';
                nav.style.paddingLeft = 'max(2rem, env(safe-area-inset-left))';
                nav.style.paddingRight = 'max(2rem, env(safe-area-inset-right))';
            }
            
            if (footer) {
                footer.style.paddingBottom = 'max(2rem, env(safe-area-inset-bottom))';
            }
        }
    }
}

// Initialize mobile functionality
document.addEventListener('DOMContentLoaded', () => {
    const mobileController = new MobileController();
    const iossFixes = new IOSFixes();
    
    // Monitor performance on mobile
    if (mobileController.isMobile) {
        mobileController.monitorMobilePerformance();
        mobileController.setupMobileFormHandling();
    }
    
    // Add mobile-specific CSS classes
    if (mobileController.isMobile) {
        document.body.classList.add('is-mobile');
    }
    
    if (mobileController.isTablet) {
        document.body.classList.add('is-tablet');
    }
    
    if (mobileController.isTouchDevice()) {
        document.body.classList.add('is-touch');
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MobileController, IOSFixes };
}