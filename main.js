/* =========================================
   CAROL TERAPEUTA - MAIN.JS
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // -----------------------------------------
    // Loader
    // -----------------------------------------
    const loader = document.getElementById('loader');
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.classList.add('hidden');
        }, 500);
    });

    // -----------------------------------------
    // Header Scroll Effect
    // -----------------------------------------
    const header = document.getElementById('header');
    let lastScroll = 0;

    function handleHeaderScroll() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll();

    // -----------------------------------------
    // Mobile Menu Toggle
    // -----------------------------------------
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    function toggleMenu() {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    function closeMenu() {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    menuToggle.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeMenu();
        }
    });

    // -----------------------------------------
    // Smooth Scroll for Anchor Links
    // -----------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // -----------------------------------------
    // Active Navigation Link on Scroll
    // -----------------------------------------
    const sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink();

    // -----------------------------------------
    // Counter Animation
    // -----------------------------------------
    const counters = document.querySelectorAll('[data-count]');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            };

            updateCounter();
        });

        countersAnimated = true;
    }

    // Trigger counter animation when hero stats are visible
    const heroStats = document.querySelector('.hero-stats');
    
    if (heroStats) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(heroStats);
    }

    // -----------------------------------------
    // Scroll Reveal Animation
    // -----------------------------------------
    const revealElements = document.querySelectorAll(
        '.pain-card, .service-card, .journey-step, .testimonial-card, ' +
        '.about-content, .about-image-wrapper, .section-header, ' +
        '.community-content, .cta-wrapper'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal', 'active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        element.classList.add('reveal');
        revealObserver.observe(element);
    });

    // -----------------------------------------
    // Staggered Animation for Grid Items
    // -----------------------------------------
    function addStaggeredAnimation(selector, containerSelector) {
        const containers = document.querySelectorAll(containerSelector);
        
        containers.forEach(container => {
            const items = container.querySelectorAll(selector);
            
            const containerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        items.forEach((item, index) => {
                            setTimeout(() => {
                                item.classList.add('active');
                            }, index * 100);
                        });
                        containerObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            containerObserver.observe(container);
        });
    }

    addStaggeredAnimation('.pain-card', '.pain-grid');
    addStaggeredAnimation('.service-card', '.services-grid');
    addStaggeredAnimation('.journey-step', '.journey-grid');
    addStaggeredAnimation('.testimonial-card', '.testimonials-grid');

    // -----------------------------------------
    // Form Handling
    // -----------------------------------------
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            // Basic validation
            if (!data.nome || !data.email || !data.interesse) {
                showNotification('Por favor, preencha os campos obrigatórios.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Por favor, insira um e-mail válido.', 'error');
                return;
            }

            // Simulate form submission
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;

            // Here you would normally send the data to a server
            // For now, we'll redirect to WhatsApp with the form data
            setTimeout(() => {
                const message = `Olá Carol! Meu nome é ${data.nome}.%0A%0A` +
                    `Tenho interesse em: ${data.interesse}%0A%0A` +
                    `${data.mensagem ? 'Mensagem: ' + data.mensagem : ''}%0A%0A` +
                    `Meu e-mail: ${data.email}` +
                    `${data.telefone ? '%0AMeu telefone: ' + data.telefone : ''}`;

                window.open(`https://wa.me/5500000000000?text=${message}`, '_blank');

                submitButton.textContent = 'Enviado!';
                
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    contactForm.reset();
                }, 2000);

            }, 1000);
        });
    }

    // -----------------------------------------
    // Notification System
    // -----------------------------------------
    function showNotification(message, type = 'success') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Fechar">&times;</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'error' ? '#722F37' : '#25D366'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 16px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            font-size: 14px;
        `;

        // Add animation keyframes
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                    opacity: 0.8;
                }
                .notification-close:hover {
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Close button functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // -----------------------------------------
    // Parallax Effect for Hero
    // -----------------------------------------
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            
            if (scrolled < heroHeight) {
                const opacity = 1 - (scrolled / heroHeight) * 0.5;
                const translateY = scrolled * 0.3;
                
                const heroContent = hero.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.transform = `translateY(${translateY}px)`;
                    heroContent.style.opacity = opacity;
                }
            }
        });
    }

    // -----------------------------------------
    // Lazy Loading Images
    // -----------------------------------------
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // -----------------------------------------
    // Hover Effects for Cards
    // -----------------------------------------
    const cards = document.querySelectorAll('.pain-card, .service-card, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // -----------------------------------------
    // WhatsApp Button Visibility
    // -----------------------------------------
    const whatsappFloat = document.querySelector('.whatsapp-float');
    
    if (whatsappFloat) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                whatsappFloat.style.opacity = '1';
                whatsappFloat.style.visibility = 'visible';
            } else {
                whatsappFloat.style.opacity = '0';
                whatsappFloat.style.visibility = 'hidden';
            }
        });

        // Initial state
        whatsappFloat.style.opacity = '0';
        whatsappFloat.style.visibility = 'hidden';
        whatsappFloat.style.transition = 'opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease';
    }

    // -----------------------------------------
    // Preload Critical Resources
    // -----------------------------------------
    function preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = src;
        });
    }

    // -----------------------------------------
    // Accessibility: Focus Management
    // -----------------------------------------
    document.addEventListener('keydown', function(e) {
        // Tab trap for mobile menu
        if (nav.classList.contains('active')) {
            const focusableElements = nav.querySelectorAll('a, button');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });

    // -----------------------------------------
    // Performance: Debounce Scroll Events
    // -----------------------------------------
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

    // Apply debounce to scroll-heavy functions
    const debouncedHighlight = debounce(highlightNavLink, 10);
    window.removeEventListener('scroll', highlightNavLink);
    window.addEventListener('scroll', debouncedHighlight);

    // -----------------------------------------
    // Console Welcome Message
    // -----------------------------------------
    console.log(
        '%c✨ Carol Terapeuta Sistêmica ✨',
        'background: #722F37; color: #A4721C; font-size: 16px; padding: 10px 20px; border-radius: 4px; font-weight: bold;'
    );
    console.log(
        '%cSite desenvolvido com carinho e intenção.',
        'color: #722F37; font-size: 12px;'
    );

});
