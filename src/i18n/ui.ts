// VELYOS — sdílené UI stringy pro všechny jazyky
// Brand terms (VELYOS, Velocity Operating System, Velocity, OS) se nepřekládají.

export type Lang = 'cs' | 'en' | 'de';

export const LANGS: Lang[] = ['cs', 'en', 'de'];

export const LANG_NAMES: Record<Lang, string> = {
    cs: 'Čeština',
    en: 'English',
    de: 'Deutsch',
};

export const LANG_FLAGS: Record<Lang, string> = {
    cs: 'CS',
    en: 'EN',
    de: 'DE',
};

/** URL prefix pro daný jazyk — CZ je v kořeni */
export function langPrefix(lang: Lang): string {
    return lang === 'cs' ? '' : `/${lang}`;
}

/** Vytvoří URL pro danou cestu v daném jazyce */
export function localeUrl(path: string, lang: Lang): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${langPrefix(lang)}${cleanPath}`;
}

/** Detekce jazyka z aktuální URL */
export function detectLang(pathname: string): Lang {
    if (pathname.startsWith('/en/') || pathname === '/en') return 'en';
    if (pathname.startsWith('/de/') || pathname === '/de') return 'de';
    return 'cs';
}

// ========== UI SLOVNÍK ==========

export const ui = {
    // Navigation
    nav: {
        cs: {
            companies: 'Pro firmy',
            individuals: 'Pro jednotlivce',
            whatWeBuild: 'Co stavíme',
            contact: 'Kontakt',
            contactDirect: 'Přímý kontakt na obchod',
            contactTagline: 'Bez obchodníka. Bez prezentace.',
            contactEmail: 'E-mail',
            contactPhone: 'Telefon',
            contactPhoneNote: 'Po registraci firmy',
            contactAgent: 'Hlasový agent · 24/7',
            contactAgentCta: 'Spustit diagnostiku',
            contactFootnote: 'Bez obchodníka. Napište rovnou — odpovídáme rychle.',
            menuOpen: 'Otevřít menu',
            menuClose: 'Zavřít menu',
            primaryCta: 'Zažádat o konzultaci',
            diagnosticCta: 'Spustit diagnostiku',
        },
        en: {
            companies: 'For companies',
            individuals: 'For individuals',
            whatWeBuild: 'What we build',
            contact: 'Contact',
            contactDirect: 'Direct line to sales',
            contactTagline: 'No sales pitch. No presentation.',
            contactEmail: 'Email',
            contactPhone: 'Phone',
            contactPhoneNote: 'Available after company registration',
            contactAgent: 'Voice agent · 24/7',
            contactAgentCta: 'Start diagnostic',
            contactFootnote: 'No sales team. Write directly — we respond fast.',
            menuOpen: 'Open menu',
            menuClose: 'Close menu',
            primaryCta: 'Request consultation',
            diagnosticCta: 'Start diagnostic',
        },
        de: {
            companies: 'Für Unternehmen',
            individuals: 'Für Einzelpersonen',
            whatWeBuild: 'Was wir bauen',
            contact: 'Kontakt',
            contactDirect: 'Direkter Draht zum Vertrieb',
            contactTagline: 'Kein Verkaufspitch. Keine Präsentation.',
            contactEmail: 'E-Mail',
            contactPhone: 'Telefon',
            contactPhoneNote: 'Verfügbar nach Firmenregistrierung',
            contactAgent: 'Sprachassistent · 24/7',
            contactAgentCta: 'Diagnose starten',
            contactFootnote: 'Kein Vertriebsteam. Schreiben Sie direkt — wir antworten schnell.',
            menuOpen: 'Menü öffnen',
            menuClose: 'Menü schließen',
            primaryCta: 'Beratung anfordern',
            diagnosticCta: 'Diagnose starten',
        },
    },

    // Footer
    footer: {
        cs: {
            columnSystem: 'Systém',
            columnFirm: 'Firma',
            columnContact: 'Přímý kontakt',
            linkHome: 'Rozcestník',
            linkCompanies: 'Pro firmy',
            linkIndividuals: 'Pro jednotlivce',
            linkWhatWeBuild: 'Co stavíme',
            linkAbout: 'O nás',
            linkApproach: 'Přístup',
            linkCases: 'Vzory nasazení',
            linkContact: 'Kontakt',
            phoneAfterReg: 'Telefon po registraci',
            linkedInAfterReg: 'LinkedIn po registraci',
            location: 'Františkovy Lázně · EU',
            legalImpresum: 'Impresum',
            legalGdpr: 'Ochrana osobních údajů',
            copyright: 'Přijímáme omezený počet klientů ročně.',
        },
        en: {
            columnSystem: 'System',
            columnFirm: 'Company',
            columnContact: 'Direct contact',
            linkHome: 'Home',
            linkCompanies: 'For companies',
            linkIndividuals: 'For individuals',
            linkWhatWeBuild: 'What we build',
            linkAbout: 'About',
            linkApproach: 'Approach',
            linkCases: 'Use cases',
            linkContact: 'Contact',
            phoneAfterReg: 'Phone after registration',
            linkedInAfterReg: 'LinkedIn after registration',
            location: 'Františkovy Lázně · EU',
            legalImpresum: 'Imprint',
            legalGdpr: 'Privacy policy',
            copyright: 'We accept a limited number of clients per year.',
        },
        de: {
            columnSystem: 'System',
            columnFirm: 'Unternehmen',
            columnContact: 'Direkter Kontakt',
            linkHome: 'Startseite',
            linkCompanies: 'Für Unternehmen',
            linkIndividuals: 'Für Einzelpersonen',
            linkWhatWeBuild: 'Was wir bauen',
            linkAbout: 'Über uns',
            linkApproach: 'Unser Ansatz',
            linkCases: 'Anwendungsbeispiele',
            linkContact: 'Kontakt',
            phoneAfterReg: 'Telefon nach Registrierung',
            linkedInAfterReg: 'LinkedIn nach Registrierung',
            location: 'Františkovy Lázně · EU',
            legalImpresum: 'Impressum',
            legalGdpr: 'Datenschutz',
            copyright: 'Wir nehmen nur eine begrenzte Anzahl von Kunden pro Jahr an.',
        },
    },
} as const;

/** Helper: získá UI string pro daný jazyk a sekci */
export function t<K extends keyof typeof ui>(lang: Lang, section: K) {
    return ui[section][lang];
}
