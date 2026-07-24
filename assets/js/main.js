// Mobile Navigation Toggle
const mobileToggle = document.getElementById('mobile-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileToggle.classList.toggle('active');
        mobileMenu.classList.toggle('hidden');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            mobileMenu.classList.add('hidden');
            mobileToggle.classList.remove('active');
        }
    });
}

// WhatsApp Floating Menu Toggle
const waToggle = document.getElementById('wa-toggle');
const waMenu = document.getElementById('whatsapp-menu');

if (waToggle && waMenu) {
    waToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        waMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!waMenu.contains(e.target) && !waToggle.contains(e.target)) {
            waMenu.classList.add('hidden');
        }
    });
}

// Theme Toggle (Default Futuristic Dark Mode)
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'dark';

const applyTheme = (theme) => {
    if (theme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeToggle) themeToggle.innerText = '☀️';
    } else {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.innerText = '🌙';
    }
};

// Set initial theme state
applyTheme(currentTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
}

// Counter Animation for Statistics
const animateCounters = () => {
    const counters = document.querySelectorAll('.counter-number');
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 seconds animation
        const startTime = performance.now();
        const startValue = 0;

        const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (easeOutQuad)
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            const currentCount = Math.floor(easeProgress * (target - startValue) + startValue);

            counter.innerText = currentCount.toLocaleString('pt-BR');

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target.toLocaleString('pt-BR');
            }
        };

        requestAnimationFrame(updateCount);
    });
};

// Header Scroll Shadow Effect
const header = document.querySelector('.main-header');
const handleScroll = () => {
    if (window.scrollY > 40) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }
};

window.addEventListener('scroll', handleScroll);
handleScroll();

// Intersection Observer for Reveal Animations & Counter Trigger
const observerOptions = {
    threshold: 0.15
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            
            // Trigger counter animation when stats section is visible
            if (entry.target.classList.contains('counter-section')) {
                animateCounters();
            }
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
document.querySelectorAll('.counter-section').forEach(el => revealObserver.observe(el));
