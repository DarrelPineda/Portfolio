// Animation Controllers and Effects
class AnimationController {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setup3DEffects();
        this.setupHoverAnimations();
        this.setupButtonAnimations();
        this.setupTextAnimations();
        this.setupGlowEffects();
        this.setupMorphingShapes();
    }

    // Advanced scroll-triggered animations
    setupScrollAnimations() {
        // Create intersection observer with different thresholds
        const observerOptions = {
            threshold: [0, 0.1, 0.5, 1],
            rootMargin: '-50px 0px -50px 0px'
        };

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                const animationType = element.dataset.animation || 'fadeInUp';
                const delay = element.dataset.delay || 0;

                if (entry.isIntersecting) {
                    setTimeout(() => {
                        this.triggerAnimation(element, animationType);
                    }, delay);
                }
            });
        }, observerOptions);

        // Observe elements with animation data attributes
        document.querySelectorAll('[data-animation]').forEach(el => {
            animationObserver.observe(el);
        });

        // Staggered animations for groups
        this.setupStaggeredAnimations();
    }

    // Staggered animations for card groups
    setupStaggeredAnimations() {
        const cardGroups = document.querySelectorAll('.projects-grid, .skills');
        
        cardGroups.forEach(group => {
            const cards = group.querySelectorAll('.project-card, .skill-tag');
            
            const groupObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        cards.forEach((card, index) => {
                            setTimeout(() => {
                                card.classList.add('animate-fade-in-up');
                                card.style.animationDelay = `${index * 0.1}s`;
                            }, index * 100);
                        });
                        groupObserver.unobserve(group);
                    }
                });
            }, { threshold: 0.2 });

            groupObserver.observe(group);
        });
    }

    // 3D tilt and rotate effects
    setup3DEffects() {
        const cards = document.querySelectorAll('.project-card, .contact-item');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transformStyle = 'preserve-3d';
            });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    translateZ(20px)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });

        // 3D hover effect for skill tags
        this.setup3DSkillTags();
    }

    setup3DSkillTags() {
        const skillTags = document.querySelectorAll('.skill-tag');
        
        skillTags.forEach(tag => {
            tag.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) rotateX(10deg) scale(1.05)';
                this.style.boxShadow = '0 15px 30px rgba(99, 102, 241, 0.4)';
            });
            
            tag.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) rotateX(0) scale(1)';
                this.style.boxShadow = 'none';
            });
        });
    }

    // Advanced hover animations
    setupHoverAnimations() {
        // Magnetic button effect
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });

            button.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const deltaX = (x - centerX) * 0.2;
                const deltaY = (y - centerY) * 0.2;
                
                this.style.transform = `translate(${deltaX}px, ${deltaY}px) translateY(-3px)`;
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translate(0px, 0px) translateY(0px)';
            });
        });

        // Image zoom and overlay effects
        this.setupImageHoverEffects();
    }

    setupImageHoverEffects() {
        const projectImages = document.querySelectorAll('.project-image');
        
        projectImages.forEach(imageContainer => {
            const img = imageContainer.querySelector('img');
            const overlay = imageContainer.querySelector('.project-overlay');
            
            imageContainer.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.2) rotate(2deg)';
                img.style.filter = 'brightness(0.7) saturate(1.2)';
                overlay.style.opacity = '1';
                overlay.style.backdropFilter = 'blur(5px)';
            });
            
            imageContainer.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1) rotate(0deg)';
                img.style.filter = 'brightness(1) saturate(1)';
                overlay.style.opacity = '0';
                overlay.style.backdropFilter = 'blur(0px)';
            });
        });
    }

    // Interactive button animations
    setupButtonAnimations() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            // Ripple effect on click
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    left: ${x}px;
                    top: ${y}px;
                    width: ${size}px;
                    height: ${size}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });

            // Loading state animation
            this.setupLoadingAnimation(button);
        });
    }

    setupLoadingAnimation(button) {
        const originalHTML = button.innerHTML;
        
        button.showLoading = function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            this.classList.add('loading');
        };
        
        button.hideLoading = function() {
            this.innerHTML = originalHTML;
            this.disabled = false;
            this.classList.remove('loading');
        };
        
        button.showSuccess = function(message = 'Success!') {
            this.innerHTML = `<i class="fas fa-check"></i> ${message}`;
            this.classList.add('success');
            setTimeout(() => {
                this.hideLoading();
                this.classList.remove('success');
            }, 2000);
        };
        
        button.showError = function(message = 'Error!') {
            this.innerHTML = `<i class="fas fa-times"></i> ${message}`;
            this.classList.add('error');
            setTimeout(() => {
                this.hideLoading();
                this.classList.remove('error');
            }, 2000);
        };
    }

    // Text reveal and typing animations
    setupTextAnimations() {
        // Animated counter for numbers
        this.setupCounterAnimations();
        
        // Text reveal on scroll
        this.setupTextRevealAnimations();
        
        // Glitch text effect
        this.setupGlitchTextEffect();
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.counter);
                    const duration = parseInt(counter.dataset.duration) || 2000;
                    const increment = target / (duration / 16);
                    
                    let current = 0;
                    const timer = setInterval(() => {
                        current += increment;
                        counter.textContent = Math.floor(current);
                        
                        if (current >= target) {
                            counter.textContent = target;
                            clearInterval(timer);
                        }
                    }, 16);
                    
                    counterObserver.unobserve(counter);
                }
            });
        });
        
        counters.forEach(counter => counterObserver.observe(counter));
    }

    setupTextRevealAnimations() {
        const textElements = document.querySelectorAll('[data-text-reveal]');
        
        textElements.forEach(element => {
            const text = element.textContent;
            element.innerHTML = '';
            
            const words = text.split(' ');
            words.forEach((word, index) => {
                const span = document.createElement('span');
                span.textContent = word + ' ';
                span.style.opacity = '0';
                span.style.transform = 'translateY(20px)';
                span.style.display = 'inline-block';
                span.style.transition = `all 0.6s ease ${index * 0.1}s`;
                element.appendChild(span);
            });
            
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const spans = entry.target.querySelectorAll('span');
                        spans.forEach(span => {
                            span.style.opacity = '1';
                            span.style.transform = 'translateY(0)';
                        });
                        revealObserver.unobserve(entry.target);
                    }
                });
            });
            
            revealObserver.observe(element);
        });
    }

    setupGlitchTextEffect() {
        const glitchElements = document.querySelectorAll('[data-glitch]');
        
        glitchElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                const originalText = this.textContent;
                const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
                let iterations = 0;
                
                const glitchInterval = setInterval(() => {
                    this.textContent = originalText
                        .split('')
                        .map((char, index) => {
                            if (index < iterations) {
                                return originalText[index];
                            }
                            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                        })
                        .join('');
                    
                    if (iterations >= originalText.length) {
                        clearInterval(glitchInterval);
                        this.textContent = originalText;
                    }
                    
                    iterations += 1 / 3;
                }, 50);
            });
        });
    }

    // Glow and light effects
    setupGlowEffects() {
        // Dynamic glow on hover
        const glowElements = document.querySelectorAll('[data-glow]');
        
        glowElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.filter = 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.8))';
                this.style.transform = 'scale(1.02)';
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.filter = 'none';
                this.style.transform = 'scale(1)';
            });
        });

        // Ambient light following cursor
        this.setupAmbientLighting();
    }

    setupAmbientLighting() {
        const lightEffect = document.createElement('div');
        lightEffect.style.cssText = `
            position: fixed;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            transition: opacity 0.3s ease;
            opacity: 0;
        `;
        document.body.appendChild(lightEffect);
        
        document.addEventListener('mousemove', (e) => {
            lightEffect.style.left = (e.clientX - 100) + 'px';
            lightEffect.style.top = (e.clientY - 100) + 'px';
            lightEffect.style.opacity = '1';
        });
        
        document.addEventListener('mouseleave', () => {
            lightEffect.style.opacity = '0';
        });
    }

    // Morphing shape animations
    setupMorphingShapes() {
        const shapes = document.querySelectorAll('.floating-element');
        
        shapes.forEach((shape, index) => {
            // Different morphing patterns for each shape
            const morphPatterns = [
                'polygon(50% 0%, 0% 100%, 100% 100%)',
                'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                'circle(50% at 50% 50%)'
            ];
            
            let currentPattern = 0;
            
            setInterval(() => {
                shape.style.clipPath = morphPatterns[currentPattern];
                currentPattern = (currentPattern + 1) % morphPatterns.length;
            }, 3000 + (index * 1000));
        });
    }

    // Trigger specific animation
    triggerAnimation(element, animationType) {
        element.classList.add('animate-' + animationType);
        
        // Remove animation class after completion to allow re-triggering
        element.addEventListener('animationend', function handler() {
            element.classList.remove('animate-' + animationType);
            element.removeEventListener('animationend', handler);
        });
    }

    // Pause/resume animations (for performance)
    pauseAnimations() {
        document.documentElement.style.setProperty('--animation-play-state', 'paused');
    }

    resumeAnimations() {
        document.documentElement.style.setProperty('--animation-play-state', 'running');
    }

    // Check if animations should be reduced
    respectsReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
}

// Particle system for interactive effects
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.canvas = this.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.init();
    }

    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        document.body.appendChild(canvas);
        return canvas;
    }

    init() {
        this.resize();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        
        document.addEventListener('mousemove', (e) => {
            if (Math.random() > 0.9) {
                this.createParticle(e.clientX, e.clientY);
            }
        });
        
        document.addEventListener('click', (e) => {
            for (let i = 0; i < 10; i++) {
                this.createParticle(
                    e.clientX + (Math.random() - 0.5) * 20,
                    e.clientY + (Math.random() - 0.5) * 20
                );
            }
        });
    }

    createParticle(x, y) {
        const particle = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 1,
            decay: Math.random() * 0.02 + 0.01,
            size: Math.random() * 4 + 2,
            color: `hsl(${240 + Math.random() * 60}, 70%, ${50 + Math.random() * 30}%)`,
            alpha: 1
        };
        
        this.particles.push(particle);
    }

    updateParticles() {
        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            particle.alpha = particle.life;
            particle.vy += 0.05; // gravity
            
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
            }
        });
    }

    renderParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    animate() {
        this.updateParticles();
        this.renderParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const animationController = new AnimationController();
    
    // Only initialize particle system if not reduced motion
    if (!animationController.respectsReducedMotion()) {
        const particleSystem = new ParticleSystem();
    }
    
    // Performance monitoring
    let isTabVisible = true;
    document.addEventListener('visibilitychange', () => {
        isTabVisible = !document.hidden;
        if (isTabVisible) {
            animationController.resumeAnimations();
        } else {
            animationController.pauseAnimations();
        }
    });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnimationController, ParticleSystem };
}