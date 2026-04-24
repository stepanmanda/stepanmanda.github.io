/* VELYOS — interactivity
   Cinematic hero + scroll reveals + ROI calculator + view transitions
   ------------------------------------------------------------------ */

function initVelyos() {
    "use strict";

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
                    { x: 0.25, y: 0.30, r: 0.45, color: "rgba(232, 93, 31, 0.28)",  vx: 0.00018, vy: 0.00012 },
                    { x: 0.70, y: 0.25, r: 0.55, color: "rgba(184, 147, 92, 0.25)", vx: -0.00014, vy: 0.00020 },
                    { x: 0.35, y: 0.80, r: 0.50, color: "rgba(184, 147, 92, 0.18)", vx: 0.00016, vy: -0.00016 },
                    { x: 0.80, y: 0.70, r: 0.40, color: "rgba(232, 93, 31, 0.15)",  vx: -0.00012, vy: -0.00014 },
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

    /* Magnetický efekt na primárních CTA tlačítkách ------ */
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

    /* Sticky header — shadow po scrollu ------------------- */
    const header = document.querySelector(".site-header");
    if (header) {
        const onScroll = () => {
            if (window.scrollY > 8) header.classList.add("is-scrolled");
            else header.classList.remove("is-scrolled");
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
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
})();
