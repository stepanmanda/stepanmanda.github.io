/* VELYOS — preview interactivity
   Scroll reveals + hero parallax glow + count-up + magnetic brand link
   ------------------------------------------------------------------ */

(function () {
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

    /* Hero — glow follows cursor (subtilní parallax) ---- */
    const hero = document.querySelector(".hero");
    const glow = document.querySelector(".hero__glow");

    if (hero && glow && !prefersReducedMotion) {
        let rafId = null;
        hero.addEventListener("mousemove", (e) => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                const rect = hero.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                glow.style.transform = `translate3d(${(x - 0.5) * 60}px, ${(y - 0.5) * 60}px, 0)`;
                rafId = null;
            });
        });

        hero.addEventListener("mouseleave", () => {
            glow.style.transform = "";
        });
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

        navToggle.addEventListener("click", () => {
            const isOpen = mobileDrawer.classList.contains("is-open");
            if (isOpen) closeDrawer();
            else openDrawer();
        });

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
