// Anti palavra órfã: cola palavras curtas (a, o, e, os, de, da...) à palavra seguinte
// com espaço inseparável, para nunca terminarem uma linha. Opera só em nós de texto,
// preservando spans internos (ex.: destaque vermelho no título).
(function () {
    var curtas = new Set(['a', 'o', 'e', 'à', 'é', 'os', 'as', 'de', 'do', 'da', 'no', 'na', 'em', 'ao', 'ou', 'se', 'um']);
    function colar(root) {
        var alvos = root.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li');
        alvos.forEach(function (el) {
            var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
            var nos = [], n;
            while ((n = walker.nextNode())) nos.push(n);
            nos.forEach(function (tn) {
                var t = tn.textContent, prev = null;
                // repete até estabilizar (cobre palavras curtas em sequência)
                while (t !== prev) {
                    prev = t;
                    t = t.replace(/(^|\s)([A-Za-zÀ-ÿ]{1,2}) (?=\S)/g, function (m, pre, w) {
                        return curtas.has(w.toLowerCase()) ? pre + w + ' ' : m;
                    });
                }
                if (t !== tn.textContent) tn.textContent = t;
            });

            // Palavra curta logo antes de um <span> (destaque): cola através da fronteira de nó.
            Array.prototype.forEach.call(el.childNodes, function (node) {
                if (node.nodeType === 1 && node.previousSibling && node.previousSibling.nodeType === 3) {
                    var pt = node.previousSibling;
                    pt.textContent = pt.textContent.replace(/(^|\s)([A-Za-zÀ-ÿ]{1,2})\s+$/, function (m, pre, w) {
                        return curtas.has(w.toLowerCase()) ? pre + w + ' ' : m;
                    });
                }
            });
        });

        // Passe de seguranca: nenhum bloco colado pode ficar mais largo que a caixa.
        // Se um elemento estourar, desfaz o nbsp do fim ate caber (evita corte de palavra).
        function trocarUltimoNbsp(el) {
            var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
            var ns = [], nn;
            while ((nn = walker.nextNode())) ns.push(nn);
            for (var i = ns.length - 1; i >= 0; i--) {
                var s = ns[i].textContent, idx = s.lastIndexOf(' ');
                if (idx >= 0) { ns[i].textContent = s.slice(0, idx) + ' ' + s.slice(idx + 1); return true; }
            }
            return false;
        }
        alvos.forEach(function (el) {
            var guarda = 0;
            while (el.scrollWidth > el.clientWidth + 1 && guarda++ < 30) {
                if (!trocarUltimoNbsp(el)) break;
            }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { colar(document.body); });
    } else {
        colar(document.body);
    }
})();

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

// Theme Toggle
// Padrão: tema claro, onde as bandas escuras e claras se alternam ao longo da página.
// Tema escuro: as bandas claras viram grafite, mantendo o mesmo ritmo de contraste.
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

// Ícone (lua/sol) é trocado por CSS via [data-theme]; o JS só ajusta o estado.
const applyTheme = (theme) => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
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
