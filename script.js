document.addEventListener('DOMContentLoaded', () => {
    // 1. Particle Background System
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const particleCount = 200;
    const connectionDistance = 150;
    const mouseRadius = 150;
    let mouse = { x: null, y: null };

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.baseX = this.x;
            this.baseY = this.y;
        }

        update() {
            // Move particles
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off edges
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;

            // Mouse interaction (Repulsion)
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouseRadius) {
                const force = (mouseRadius - distance) / mouseRadius;
                const directionX = dx / distance;
                const directionY = dy / distance;
                this.x -= directionX * force * 5;
                this.y -= directionY * force * 5;
            }
        }

        draw() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // Connect particles
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    const opacity = 1 - (distance / connectionDistance);
                    ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    init();
    animate();

    // 2. Cursor Glow Effect
    const cursorGlow = document.getElementById('cursor-glow');
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    // 3. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Scroll Reveal Animations
    const rippleElements = document.querySelectorAll('#reveal-1, #reveal-2, #reveal-3, #reveal-4');
    
    // Initial hero reveal
    rippleElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 200 * (index + 1));
    });

    // Intersection Observer for section reveals
    const observerOptions = {
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.glass-card, .skills-category, .edu-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100 * index);
                });
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        sectionObserver.observe(section);
        
        const animateItems = section.querySelectorAll('.glass-card, .skills-category, .edu-card');
        animateItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(40px)';
            item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // 5. Smooth Scrolling
    const links = document.querySelectorAll('.nav-links a, .nav-cta a, .hero-btns a, .mobile-nav-links a, .mobile-nav-cta a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSector = document.getElementById(targetId);
                if (targetSector) {
                    window.scrollTo({
                        top: targetSector.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 6. Mobile Menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a, .mobile-nav-cta a');

    if (mobileMenuBtn && mobileMenuClose && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        });

        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }
});
