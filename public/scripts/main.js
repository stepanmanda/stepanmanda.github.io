/* VELYOS — interactivity
   Cinematic hero + scroll reveals + ROI calculator + view transitions
   ------------------------------------------------------------------ */

function initVelyos() {
    "use strict";

    // Safety: ensure hero titles always become visible even if split fails downstream.
    setTimeout(() => {
        document.querySelectorAll(".hero__title:not(.is-split)").forEach((t) => {
            t.classList.add("is-split");
        });
    }, 500);

    // Remove first-load gate AFTER initial hero animations finish — future navigations
    // (via Astro View Transitions) won't replay the cinematic stagger.
    if (document.documentElement.classList.contains("first-load")) {
        setTimeout(() => {
            document.documentElement.classList.remove("first-load");
        }, 2200);
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Scroll reveals ------------------------------------ */
    const revealTargets = document.querySelectorAll("[data-reveal], [data-stagger]");

    if ("IntersectionObserver" in window && revealTargets.length) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );

        revealTargets.forEach((el) => observer.observe(el));
    } else {
        revealTargets.forEach((el) => el.classList.add("is-visible"));
    }

    /* Logo boot animace — jen jednou za session ---------- */
    const logoAlreadyBooted = sessionStorage.getItem("velyos-booted");
    if (!logoAlreadyBooted && !prefersReducedMotion) {
        const brandLogos = document.querySelectorAll(".brand");
        brandLogos.forEach((brand) => {
            if (brand.dataset.bootInit) return;
            brand.dataset.bootInit = "1";

            // Wrap VELY písmena a OS (jako dvě části)
            const velyText = "VELY";
            const beforeOs = brand.childNodes[0];
            if (beforeOs && beforeOs.nodeType === Node.TEXT_NODE) {
                const frag = document.createDocumentFragment();
                velyText.split("").forEach((ch, i) => {
                    const span = document.createElement("span");
                    span.className = "brand-letter";
                    span.style.setProperty("--letter-index", i);
                    span.textContent = ch;
                    frag.appendChild(span);
                });
                beforeOs.parentNode.replaceChild(frag, beforeOs);
            }

            // OS span
            const osSpan = brand.querySelector(".os");
            if (osSpan && !osSpan.dataset.bootInit) {
                osSpan.dataset.bootInit = "1";
                osSpan.classList.add("brand-letter", "brand-letter--os");
                osSpan.style.setProperty("--letter-index", velyText.length);
            }
        });

        document.documentElement.classList.add("velyos-boot");
        sessionStorage.setItem("velyos-booted", "1");

        // Po dokončení animace (~900ms) vypneme třídu — další navigace nemá boot
        setTimeout(() => {
            document.documentElement.classList.remove("velyos-boot");
        }, 1200);
    }

    /* ================================================
       HERO — CINEMATIC MODE
       Canvas mesh gradient + per-word reveal + multi-layer parallax
       ================================================ */
    const hero = document.querySelector("[data-hero-cinematic]");

    if (hero) {
        // 1. Mouse parallax — nastavuje CSS custom properties pro všechny vrstvy
        if (!prefersReducedMotion) {
            let parallaxRaf = null;
            hero.addEventListener("mousemove", (e) => {
                if (parallaxRaf) return;
                parallaxRaf = requestAnimationFrame(() => {
                    const rect = hero.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    hero.style.setProperty("--mouse-x", x.toFixed(3));
                    hero.style.setProperty("--mouse-y", y.toFixed(3));
                    parallaxRaf = null;
                });
            });

            hero.addEventListener("mouseleave", () => {
                hero.style.setProperty("--mouse-x", "0");
                hero.style.setProperty("--mouse-y", "0");
            });
        }

        // 2. Split H1 na jednotlivá slova pro reveal animaci
        const title = hero.querySelector(".hero__title");
        if (title && !title.dataset.split) {
            title.dataset.split = "1";
            title.classList.add("is-split");
            // Najdeme všechny text nodes + preservujeme spans (.accent)
            const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
            const textNodes = [];
            let node;
            while ((node = walker.nextNode())) textNodes.push(node);

            let wordIndex = 0;
            textNodes.forEach((textNode) => {
                const words = textNode.textContent.split(/(\s+)/);
                const frag = document.createDocumentFragment();
                words.forEach((w) => {
                    if (/^\s+$/.test(w)) {
                        frag.appendChild(document.createTextNode(w));
                    } else if (w.length) {
                        const span = document.createElement("span");
                        span.className = "word";
                        span.style.setProperty("--word-index", wordIndex);
                        span.textContent = w;
                        frag.appendChild(span);
                        wordIndex++;
                    }
                });
                textNode.parentNode.replaceChild(frag, textNode);
            });
        }

        // 3. Canvas mesh gradient — animovaný pozadí z „plujících" barevných sfér
        const canvas = hero.querySelector(".hero__mesh");
        if (canvas && !prefersReducedMotion) {
            const ctx = canvas.getContext("2d", { alpha: true });
            if (ctx) {
                let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
                let animId = null;

                // 4 barevné sféry s vlastními trajektoriemi — „floating mesh"
                // Barvy z brand palety: Velocity Orange + Signal Gold + Deep Velocity
                const blobs = [
                    { x: 0.25, y: 0.30, r: 0.55, color: "rgba(232, 93, 31, 0.28)",  vx: 0.00018, vy: 0.00012 },
                    { x: 0.75, y: 0.70, r: 0.60, color: "rgba(184, 147, 92, 0.22)", vx: -0.00014, vy: -0.00018 },
                ];

                const resize = () => {
                    const rect = hero.getBoundingClientRect();
                    width = rect.width;
                    height = rect.height;
                    canvas.width = width * dpr;
                    canvas.height = height * dpr;
                    ctx.scale(dpr, dpr);
                };

                const draw = (timestamp) => {
                    ctx.clearRect(0, 0, width, height);

                    blobs.forEach((b) => {
                        // Floating — harmonický posun + bounds
                        b.x += b.vx;
                        b.y += b.vy;
                        if (b.x < 0.1 || b.x > 0.9) b.vx *= -1;
                        if (b.y < 0.1 || b.y > 0.9) b.vy *= -1;

                        // Jemný „breathing" efekt na radius (sinusoida)
                        const breath = 1 + Math.sin(timestamp * 0.0003 + b.x * 10) * 0.08;
                        const r = Math.max(width, height) * b.r * breath;

                        const grd = ctx.createRadialGradient(
                            b.x * width, b.y * height, 0,
                            b.x * width, b.y * height, r
                        );
                        grd.addColorStop(0, b.color);
                        grd.addColorStop(1, "rgba(0, 0, 0, 0)");
                        ctx.fillStyle = grd;
                        ctx.fillRect(0, 0, width, height);
                    });

                    animId = requestAnimationFrame(draw);
                };

                // Spustíme až když je hero viditelný (IntersectionObserver — šetří CPU)
                let running = false;
                const startAnim = () => {
                    if (running) return;
                    running = true;
                    resize();
                    canvas.classList.add("is-ready");
                    animId = requestAnimationFrame(draw);
                };
                const stopAnim = () => {
                    running = false;
                    if (animId) cancelAnimationFrame(animId);
                };

                // Expose pro astro:before-swap cleanup
                canvas.__velyosStop = stopAnim;

                if ("IntersectionObserver" in window) {
                    const heroObs = new IntersectionObserver((entries) => {
                        entries.forEach((e) => e.isIntersecting ? startAnim() : stopAnim());
                    }, { threshold: 0.05 });
                    heroObs.observe(hero);
                } else {
                    startAnim();
                }

                // Resize handler (debounced)
                let resizeTimeout;
                window.addEventListener("resize", () => {
                    clearTimeout(resizeTimeout);
                    resizeTimeout = setTimeout(resize, 150);
                }, { passive: true });

                // Pauza když tab není focused (šetří CPU)
                document.addEventListener("visibilitychange", () => {
                    if (document.hidden) stopAnim();
                    else if (hero.getBoundingClientRect().top < window.innerHeight) startAnim();
                });
            }
        } else if (canvas) {
            // Reduced motion — canvas skrýt (statický gradient jako background fallback)
            canvas.style.display = "none";
        }
    }

    /* Meta čísla — count-up ------------------------------ */
    const counters = document.querySelectorAll("[data-count]");
    if (counters.length && !prefersReducedMotion) {
        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    const target = parseFloat(el.dataset.count);
                    const decimals = parseInt(el.dataset.decimals || "0", 10);
                    const suffix = el.dataset.suffix || "";
                    const duration = 1200;
                    const start = performance.now();

                    const tick = (now) => {
                        const progress = Math.min((now - start) / duration, 1);
                        // ease-out
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const value = target * eased;
                        el.textContent = value.toFixed(decimals) + suffix;
                        if (progress < 1) requestAnimationFrame(tick);
                    };

                    requestAnimationFrame(tick);
                    counterObserver.unobserve(el);
                });
            },
            { threshold: 0.4 }
        );

        counters.forEach((el) => counterObserver.observe(el));
    } else if (counters.length) {
        // reduced motion — rovnou zobrazíme finální hodnotu
        counters.forEach((el) => {
            const target = parseFloat(el.dataset.count);
            const decimals = parseInt(el.dataset.decimals || "0", 10);
            const suffix = el.dataset.suffix || "";
            el.textContent = target.toFixed(decimals) + suffix;
        });
    }

    /* Magnetický efekt + ripple na primárních CTA tlačítkách ------ */
    if (!prefersReducedMotion) {
        document.querySelectorAll(".btn--primary.btn--lg, .btn--dark.btn--lg").forEach((btn) => {
            btn.addEventListener("mousemove", (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
            });
            btn.addEventListener("mouseleave", () => {
                btn.style.transform = "";
            });
        });
    }

    /* Ripple efekt na všech primárních CTA (funguje i s reduced motion — rychlý) */
    document.querySelectorAll(".btn--primary, .btn--dark").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const rect = btn.getBoundingClientRect();
            const ripple = document.createElement("span");
            ripple.className = "btn__ripple";
            const size = Math.max(rect.width, rect.height) * 1.6;
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            btn.appendChild(ripple);
            ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
        });
    });

    /* Scroll parallax — elementy s data-parallax se posunou pomaleji */
    if (!prefersReducedMotion) {
        const parallaxEls = document.querySelectorAll("[data-parallax]");
        if (parallaxEls.length) {
            let parallaxScrollRaf = null;
            const updateParallax = () => {
                parallaxScrollRaf = null;
                parallaxEls.forEach((el) => {
                    const rect = el.getBoundingClientRect();
                    const vh = window.innerHeight;
                    // Jen pokud je element viditelný (nebo blízko)
                    if (rect.bottom < -200 || rect.top > vh + 200) return;
                    const speed = parseFloat(el.dataset.parallax) || 0.2;
                    // Relativní pozice středu elementu vůči středu viewportu
                    const centerOffset = rect.top + rect.height / 2 - vh / 2;
                    const translateY = -centerOffset * speed;
                    el.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
                });
            };
            window.addEventListener("scroll", () => {
                if (parallaxScrollRaf) return;
                parallaxScrollRaf = requestAnimationFrame(updateParallax);
            }, { passive: true });
            updateParallax();
        }
    }

    /* Ambient section glow — tvoří se při scroll na každé .section--editorial / hero-like */
    // (jen vizuální — CSS už má breathing animaci)

    /* Sticky header — shadow po scrollu ------------------- */
    const header = document.querySelector(".site-header");
    const scrollProgress = document.querySelector(".scroll-progress");
    if (header || scrollProgress) {
        let scrollRaf = null;
        const onScroll = () => {
            scrollRaf = null;
            if (header) {
                if (window.scrollY > 8) header.classList.add("is-scrolled");
                else header.classList.remove("is-scrolled");
            }
            if (scrollProgress) {
                const doc = document.documentElement;
                const max = doc.scrollHeight - doc.clientHeight;
                const pct = max > 0 ? window.scrollY / max : 0;
                scrollProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, pct))})`;
            }
        };
        onScroll();
        window.addEventListener("scroll", () => {
            if (scrollRaf) return;
            scrollRaf = requestAnimationFrame(onScroll);
        }, { passive: true });
        window.addEventListener("resize", () => {
            if (scrollRaf) return;
            scrollRaf = requestAnimationFrame(onScroll);
        }, { passive: true });
    }

    /* ElevenLabs widget — vynutit collapsed default ------- */
    // Widget se může načíst už rozbalený (podle nastavení v ElevenLabs
    // dashboardu). Pošleme mu collapse event, aby začínal sbalený —
    // uživatel ho rozklikne, když chce mluvit.
    const collapseElevenLabsWidget = () => {
        document.dispatchEvent(
            new CustomEvent("elevenlabs-agent:expand", {
                detail: { action: "collapse" },
            })
        );
    };

    // Několikrát, protože widget se inicializuje asynchronně
    // a event se posílá dřív, než je posluchač zaregistrovaný.
    [50, 300, 800, 1500, 3000].forEach((delay) => {
        setTimeout(collapseElevenLabsWidget, delay);
    });

    /* Nav Kontakt — popover toggle ------------------------ */
    const contactTrigger = document.querySelector(".nav-contact__trigger");
    const contactPanel = document.querySelector(".nav-contact__panel");

    if (contactTrigger && contactPanel) {
        const closePanel = () => {
            contactPanel.classList.remove("is-open");
            contactTrigger.setAttribute("aria-expanded", "false");
        };

        const openPanel = () => {
            contactPanel.classList.add("is-open");
            contactTrigger.setAttribute("aria-expanded", "true");
        };

        contactTrigger.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = contactPanel.classList.contains("is-open");
            if (isOpen) closePanel();
            else openPanel();
        });

        // Klik mimo panel zavře
        document.addEventListener("click", (e) => {
            if (!contactPanel.contains(e.target) && !contactTrigger.contains(e.target)) {
                closePanel();
            }
        });

        // ESC zavře
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closePanel();
        });

        // Scroll pryč z hero zavře (ať nepřekáží)
        let scrollClose = null;
        window.addEventListener("scroll", () => {
            if (!contactPanel.classList.contains("is-open")) return;
            if (scrollClose) clearTimeout(scrollClose);
            scrollClose = setTimeout(closePanel, 150);
        }, { passive: true });
    }

    /* Mobile hamburger drawer ---------------------------- */
    const navToggle = document.getElementById("nav-toggle");
    const mobileDrawer = document.getElementById("mobile-drawer");

    if (navToggle && mobileDrawer) {
        const openDrawer = () => {
            mobileDrawer.classList.add("is-open");
            navToggle.setAttribute("aria-expanded", "true");
            navToggle.setAttribute("aria-label", "Zavřít menu");
            mobileDrawer.setAttribute("aria-hidden", "false");
            document.body.classList.add("nav-open");
        };

        const closeDrawer = () => {
            mobileDrawer.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.setAttribute("aria-label", "Otevřít menu");
            mobileDrawer.setAttribute("aria-hidden", "true");
            document.body.classList.remove("nav-open");
        };

        const toggleDrawer = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            const isOpen = mobileDrawer.classList.contains("is-open");
            if (isOpen) closeDrawer();
            else openDrawer();
        };

        navToggle.addEventListener("click", toggleDrawer);
        // Backup pro staré iOS Safari kde click event někdy nedoskočí
        navToggle.addEventListener("touchend", (e) => {
            // Jen pokud prst nezačal přetahovat
            e.preventDefault();
            toggleDrawer(e);
        }, { passive: false });

        // Klik na link v draweru → zavřít (pro interní anchor odkazy)
        mobileDrawer.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                // Při přechodu na jinou stránku se drawer zavře sám (nový page load).
                // Tady jen pro navigaci v rámci stránky.
                closeDrawer();
            });
        });

        // ESC zavře drawer
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && mobileDrawer.classList.contains("is-open")) {
                closeDrawer();
            }
        });

        // Při resize nad breakpoint drawer zavřít (kdyby uživatel rotoval)
        let resizeTimeout;
        window.addEventListener("resize", () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth > 880 && mobileDrawer.classList.contains("is-open")) {
                    closeDrawer();
                }
            }, 100);
        });
    }

    /* Section Jump — dropdown navigator floating bottom-left.
       Populated from sections with numbered eyebrows ("· 02 · Label").
       Hidden until scrolled past hero, hides on mobile via CSS. */
    const jump = document.querySelector("[data-section-jump]");
    const jumpTrigger = document.querySelector("[data-section-jump-trigger]");
    const jumpPanel = document.querySelector("[data-section-jump-panel]");
    const jumpCurrent = document.querySelector("[data-section-jump-current]");
    const jumpLabel = document.querySelector("[data-section-jump-label]");
    const jumpDefaultLabel = jumpLabel ? (jumpLabel.dataset.defaultLabel || jumpLabel.textContent) : null;
    const jumpDefaultNum = jumpCurrent ? jumpCurrent.textContent : "§";

    if (jump && jumpTrigger && jumpPanel) {
        jumpPanel.replaceChildren();
        jump.classList.remove("is-open");

        const candidateSections = document.querySelectorAll("main section, body > section");
        const jumpSections = [];
        candidateSections.forEach((section) => {
            const eyebrow = section.querySelector(".section-head .eyebrow, .eyebrow");
            if (!eyebrow) return;
            const text = eyebrow.textContent.trim();
            const match = text.match(/^·\s*(\d+)\s*·\s*(.+)$/);
            if (!match) return;
            jumpSections.push({ el: section, num: match[1], label: match[2].trim() });
        });

        if (jumpSections.length >= 3) {
            const items = [];

            const openJump = () => {
                jump.classList.add("is-open");
                jumpTrigger.setAttribute("aria-expanded", "true");
            };
            const closeJump = () => {
                jump.classList.remove("is-open");
                jumpTrigger.setAttribute("aria-expanded", "false");
            };

            jumpSections.forEach((s) => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "section-jump__item";
                btn.setAttribute("role", "menuitem");

                const num = document.createElement("span");
                num.className = "section-jump__item-num";
                num.textContent = s.num;

                const label = document.createElement("span");
                label.className = "section-jump__item-label";
                label.textContent = s.label;

                btn.append(num, label);
                btn.addEventListener("click", () => {
                    s.el.scrollIntoView({ behavior: "smooth", block: "start" });
                    closeJump();
                });
                jumpPanel.appendChild(btn);
                items.push({ btn, num: s.num, section: s.el });
            });

            // Attach trigger/document listeners only once — prevents double-toggle
            // when initVelyos runs again on astro:page-load.
            if (!jumpTrigger.dataset.bound) {
                jumpTrigger.dataset.bound = "1";
                jumpTrigger.addEventListener("click", (e) => {
                    e.stopPropagation();
                    jump.classList.contains("is-open") ? closeJump() : openJump();
                });

                document.addEventListener("click", (e) => {
                    if (!jump.contains(e.target)) closeJump();
                });

                document.addEventListener("keydown", (e) => {
                    if (e.key === "Escape") closeJump();
                });
            }

            // Track active section — updates trigger badge, trigger label, and panel highlight
            const activeSections = new Set();
            const resolveActive = () => {
                // If we have an active section — use it. Otherwise restore default.
                if (activeSections.size === 0) {
                    items.forEach((d) => d.btn.classList.remove("is-active"));
                    if (jumpCurrent) jumpCurrent.textContent = jumpDefaultNum;
                    if (jumpLabel) jumpLabel.textContent = jumpDefaultLabel;
                    return;
                }
                // Pick topmost (smallest num) active section
                const active = [...activeSections].sort((a, b) =>
                    parseInt(a.num, 10) - parseInt(b.num, 10)
                )[0];
                const entry = items.find((d) => d.section === active.el);
                if (!entry) return;
                items.forEach((d) => d.btn.classList.remove("is-active"));
                entry.btn.classList.add("is-active");
                if (jumpCurrent) jumpCurrent.textContent = active.num;
                if (jumpLabel) jumpLabel.textContent = active.label;
            };

            const sectionObs = new IntersectionObserver((entries) => {
                entries.forEach((e) => {
                    const sec = jumpSections.find((s) => s.el === e.target);
                    if (!sec) return;
                    if (e.isIntersecting) activeSections.add(sec);
                    else activeSections.delete(sec);
                });
                resolveActive();
            }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
            jumpSections.forEach((s) => sectionObs.observe(s.el));

            // Close dropdown on manual scroll (keeps UX clean as user navigates)
            if (!jump.dataset.scrollBound) {
                jump.dataset.scrollBound = "1";
                let scrollCloseRaf = null;
                window.addEventListener("scroll", () => {
                    if (scrollCloseRaf) return;
                    scrollCloseRaf = requestAnimationFrame(() => {
                        scrollCloseRaf = null;
                        if (jump.classList.contains("is-open")) closeJump();
                    });
                }, { passive: true });
            }

            // Mark as ready — CSS reveals the trigger
            jump.classList.add("is-ready");
        }
    }

    /* Pause CSS animations out of viewport — velký scroll perf win.
       Najde všechny elementy s costly infinite animations a toggle
       class `.is-paused` podle IntersectionObserver. */
    if ("IntersectionObserver" in window) {
        const PAUSE_SELECTORS = [
            ".hero__glow",
            ".hero__glow--primary",
            ".hero__glow--secondary",
            ".hero__grid",
            ".cta-band__glow",
            ".roi__glow",
            ".agent-diagnostic__glow",
        ];
        const animated = document.querySelectorAll(PAUSE_SELECTORS.join(", "));
        if (animated.length) {
            const animObs = new IntersectionObserver((entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) e.target.classList.remove("is-paused");
                    else e.target.classList.add("is-paused");
                });
            }, { rootMargin: "100px" });
            animated.forEach((el) => animObs.observe(el));
        }
    }
}

// Spusť při normálním načtení
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVelyos);
} else {
    initVelyos();
}

// Po View Transitions (Astro) — nové stránce znovu inicializovat vše
document.addEventListener('astro:page-load', initVelyos);

// Před odchodem ze stránky — cleanup běžících canvas animací (pokud existují)
document.addEventListener('astro:before-swap', () => {
    const canvas = document.querySelector('.hero__mesh');
    if (canvas && canvas.__velyosStop) {
        canvas.__velyosStop();
    }
});
