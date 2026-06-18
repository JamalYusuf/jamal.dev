function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function toggleTheme() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.toggle('hidden');
}

function submitContactForm(e) {
    e.preventDefault();
    const form = e.target;
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    button.innerHTML = 'Sending...';
    button.disabled = true;

    setTimeout(() => {
        form.innerHTML = `
            <div class="text-center py-8">
                <i class="fa-solid fa-check-circle text-5xl mb-4" style="color: var(--primary);"></i>
                <h3 class="font-semibold text-2xl">Thank you.</h3>
                <p class="mt-2 text-gray-600 dark:text-gray-400">Your message has been received. I'll get back to you within 48 hours.</p>
            </div>
        `;
    }, 1200);

    return false;
}

function filterPosts(category) {
    const posts = document.querySelectorAll('#posts-grid .post-card');
    posts.forEach(post => {
        if (category === 'all' || post.dataset.category === category) {
            post.style.display = '';
        } else {
            post.style.display = 'none';
        }
    });
}

function initFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    if (!buttons.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', function () {
            const text = this.textContent.toLowerCase();
            let category = 'all';
            if (text.includes('ai')) category = 'ai';
            else if (text.includes('design')) category = 'design';
            else if (text.includes('engineering')) category = 'engineering';
            else if (text.includes('leadership')) category = 'leadership';

            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterPosts(category);
        });
    });
}

function initReadingProgress() {
    const progressBar = document.getElementById('reading-progress');
    const content = document.querySelector('.blog-content');
    if (!progressBar || !content) return;

    function updateProgress() {
        const contentTop = content.getBoundingClientRect().top;
        const contentHeight = content.offsetHeight;
        let progress = 0;
        if (contentTop < 0) {
            const scrolled = Math.abs(contentTop);
            progress = Math.min((scrolled / contentHeight) * 100, 100);
        }
        progressBar.style.width = `${progress}%`;
    }

    window.addEventListener('scroll', updateProgress);
    updateProgress();
}

const TOC_EXCLUDED_SELECTOR = '.section-toc, .section-sidebar, .site-footer, nav.redline-section-nav, [aria-hidden="true"]';

function getTOCScrollOffset() {
    const nav = document.querySelector('nav.sticky');
    return (nav?.offsetHeight || 80) + 28;
}

function resolveTOCEntry(node) {
    if (node.matches('h2[id], h3[id]')) {
        return {
            id: node.id,
            text: node.textContent.trim(),
            level: node.tagName === 'H2' ? 2 : 3,
            node
        };
    }

    if (node.matches('.redline-showcase-section[id]')) {
        const title = node.querySelector('.redline-showcase-heading, h2, h3');
        if (!title) return null;
        return {
            id: node.id,
            text: title.textContent.trim(),
            level: 2,
            node
        };
    }

    return null;
}

function collectTOCEntries(scope) {
    const entries = [];
    const seen = new Set();
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_ELEMENT, {
        acceptNode(node) {
            if (node.closest(TOC_EXCLUDED_SELECTOR)) return NodeFilter.FILTER_REJECT;
            if (node.matches('h2[id], h3[id], .redline-showcase-section[id]')) {
                return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
        }
    });

    let current = walker.nextNode();
    while (current) {
        const entry = resolveTOCEntry(current);
        if (entry && !seen.has(entry.id)) {
            seen.add(entry.id);
            entries.push(entry);
        }
        current = walker.nextNode();
    }

    return entries;
}

function findTOCScope(panel) {
    return panel.closest('[data-toc-scope]')
        || panel.closest('.section-detail-grid')?.querySelector('[data-toc-scope]')
        || document.querySelector('[data-toc-scope]');
}

function renderTOC(panel, entries) {
    panel.innerHTML = '';

    if (!entries.length) {
        panel.innerHTML = '<p class="section-toc-empty text-xs text-muted">No sections on this page.</p>';
        return [];
    }

    const list = document.createElement('div');
    list.className = 'toc-list';

    entries.forEach((entry) => {
        const link = document.createElement('a');
        link.href = '#' + entry.id;
        link.className = 'toc-link block' + (entry.level === 3 ? ' toc-link--child' : '');
        link.textContent = entry.text;
        list.appendChild(link);
    });

    panel.appendChild(list);
    return list.querySelectorAll('.toc-link');
}

function bindTOCScrollSpy(entries, links) {
    if (!entries.length || !links.length) return;

    let ticking = false;

    const updateActive = () => {
        ticking = false;
        const offset = getTOCScrollOffset();
        const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 48;
        let activeId = entries[0].id;

        if (nearBottom) {
            activeId = entries[entries.length - 1].id;
        } else {
            for (const entry of entries) {
                if (entry.node.getBoundingClientRect().top <= offset) {
                    activeId = entry.id;
                } else {
                    break;
                }
            }
        }

        links.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + activeId);
        });
    };

    const onScroll = () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateActive);
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateActive();
}

function initResearchIndexTabs() {
    const root = document.querySelector('[data-research-tabs]');
    if (!root) return;

    const tabs = root.querySelectorAll('[data-research-tab]');
    const panels = root.querySelectorAll('[data-research-panel]');

    const activate = (id) => {
        tabs.forEach((tab) => {
            const isActive = tab.dataset.researchTab === id;
            tab.classList.toggle('is-active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        panels.forEach((panel) => {
            const isActive = panel.dataset.researchPanel === id;
            panel.classList.toggle('is-active', isActive);
            panel.hidden = !isActive;
        });
    };

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => activate(tab.dataset.researchTab));
    });
}

function initTOC() {
    const panels = document.querySelectorAll('[data-toc-autobuild]');
    if (!panels.length) return;

    panels.forEach((panel) => {
        const scope = findTOCScope(panel);
        if (!scope) return;

        const entries = collectTOCEntries(scope);
        const links = renderTOC(panel, entries);
        bindTOCScrollSpy(entries, links);
    });
}

function copyLink(btn) {
    navigator.clipboard.writeText(window.location.href).then(() => {
        const originalText = btn.innerText;
        btn.innerText = 'Copied!';
        setTimeout(() => { btn.innerText = originalText; }, 1500);
    }).catch(() => {
        prompt('Copy this link:', window.location.href);
    });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
        if (e.metaKey && e.key === '/') {
            e.preventDefault();
            toggleTheme();
        }
    });
}

function initResumeAnchors() {
    const tabs = document.querySelectorAll('[data-resume-tab]');
    const sections = document.querySelectorAll('#resume-summary, #resume-impact, #resume-experience');
    if (!tabs.length || !sections.length) return;

    const showPanel = (id) => {
        sections.forEach(section => {
            const isActive = section.id === id;
            section.hidden = !isActive;
            section.classList.toggle('is-active', isActive);
        });

        tabs.forEach(tab => {
            const isActive = tab.getAttribute('href') === '#' + id;
            tab.classList.toggle('is-active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();
            const id = tab.getAttribute('href')?.slice(1);
            if (id) showPanel(id);
        });
    });

    const defaultId = sections[0]?.id;
    if (defaultId) showPanel(defaultId);
}

function initRedlineShowcase() {
    const showcase = document.querySelector('.redline-showcase');
    if (!showcase) return;

    const compareGrid = showcase.querySelector('[data-compare-panel]');
    const compareToggles = showcase.querySelectorAll('.redline-compare-toggle');
    compareToggles.forEach((btn) => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.compareView;
            if (!view || !compareGrid) return;
            compareToggles.forEach((b) => b.classList.toggle('is-active', b === btn));
            compareGrid.dataset.comparePanel = view;
        });
    });

    const copyToast = document.getElementById('redline-copy-toast');
    let copyTimer;
    showcase.querySelectorAll('[data-copy-token]').forEach((swatch) => {
        swatch.addEventListener('click', () => {
            const token = swatch.dataset.copyToken;
            if (!token) return;
            navigator.clipboard.writeText(`var(${token})`).then(() => {
                showcase.querySelectorAll('.redline-swatch.is-copied').forEach((el) => {
                    el.classList.remove('is-copied');
                });
                swatch.classList.add('is-copied');
                if (copyToast) {
                    copyToast.textContent = `Copied var(${token})`;
                    copyToast.hidden = false;
                    clearTimeout(copyTimer);
                    copyTimer = setTimeout(() => {
                        copyToast.hidden = true;
                    }, 2000);
                }
            }).catch(() => {
                if (copyToast) {
                    copyToast.textContent = token;
                    copyToast.hidden = false;
                }
            });
        });
    });

    const dashboard = document.getElementById('redline-dashboard-demo');
    if (dashboard) {
        const tabs = dashboard.querySelectorAll('[data-dashboard-tab]');
        const panels = dashboard.querySelectorAll('[data-dashboard-panel]');
        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const id = tab.dataset.dashboardTab;
                tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
                panels.forEach((panel) => {
                    const isActive = panel.dataset.dashboardPanel === id;
                    panel.classList.toggle('is-active', isActive);
                    panel.hidden = !isActive;
                });
            });
        });
    }

    const navLinks = document.querySelectorAll('.redline-section-nav-link');
    const sections = [...navLinks]
        .map((link) => {
            const id = link.getAttribute('href')?.slice(1);
            const el = id ? document.getElementById(id) : null;
            return el ? { link, el } : null;
        })
        .filter(Boolean);

    if (sections.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    navLinks.forEach((link) => {
                        link.classList.toggle(
                            'is-active',
                            link.getAttribute('href') === `#${entry.target.id}`
                        );
                    });
                }
            });
        }, { rootMargin: '-40% 0px -45% 0px', threshold: 0 });

        sections.forEach(({ el }) => observer.observe(el));
    }
}

function initScrollToTop() {
    const button = document.getElementById('scroll-to-top');
    if (!button) return;

    const threshold = 400;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function toggleVisibility() {
        const show = window.scrollY > threshold;
        button.classList.toggle('is-visible', show);
        button.hidden = !show;
    }

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
        button.blur();
    });

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
}

function initHeroVideo() {
    const video = document.querySelector('.hero-home-video');
    if (!video) return;

    let sources = [];
    try {
        sources = JSON.parse(video.dataset.sources || '[]');
    } catch (e) {
        return;
    }

    if (!sources.length && video.dataset.src) {
        sources = [video.dataset.src];
    }
    if (!sources.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let currentIndex = 0;

    const playCurrent = () => {
        video.play().then(() => {
            video.classList.add('is-playing');
            video.closest('.hero-home')?.classList.add('has-video-playing');
        }).catch(() => {
            video.classList.remove('is-playing');
            video.closest('.hero-home')?.classList.remove('has-video-playing');
        });
    };

    const loadVideoAt = (index) => {
        currentIndex = index;
        video.src = sources[currentIndex];

        if (video.readyState >= 2) {
            playCurrent();
        } else {
            video.addEventListener('loadeddata', playCurrent, { once: true });
            video.load();
        }
    };

    video.addEventListener('ended', () => {
        const nextIndex = (currentIndex + 1) % sources.length;
        loadVideoAt(nextIndex);
    });

    const startPlaylist = () => {
        if (video.dataset.loaded === 'true') return;
        video.dataset.loaded = 'true';
        loadVideoAt(0);
    };

    const scheduleLoad = () => {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(startPlaylist, { timeout: 2500 });
        } else {
            setTimeout(startPlaylist, 200);
        }
    };

    if (document.readyState === 'complete') {
        scheduleLoad();
    } else {
        window.addEventListener('load', scheduleLoad, { once: true });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    initializeTheme();
    setupKeyboardShortcuts();
    initFilters();
    initReadingProgress();
    initResearchIndexTabs();
    initTOC();
    initHeroVideo();
    initResumeAnchors();
    initScrollToTop();
    initRedlineShowcase();
});