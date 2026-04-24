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

// ========== Form stringy (diagnostický formulář) ==========
export const formStrings = {
    cs: {
        name: 'Jméno a příjmení',
        namePh: 'Štěpán Novák',
        position: 'Pozice ve firmě',
        positionOwner: 'Majitel / jednatel',
        positionCeo: 'Ředitel / CEO',
        positionManager: 'Manažer / vedoucí',
        positionIt: 'IT / provoz',
        positionOther: 'Jiné',
        company: 'Firma',
        companyPh: 'VELYOS s.r.o.',
        industry: 'Obor',
        indHealth: 'Zdravotnictví',
        indConstr: 'Stavebnictví',
        indReal: 'Reality',
        indProfServices: 'Profesionální služby (právo, poradenství, účetnictví)',
        indEcom: 'E-commerce / retail',
        indMfg: 'Výroba',
        indServices: 'Služby (B2C)',
        indOther: 'Jiné',
        size: 'Velikost týmu',
        size10: '1–10 lidí',
        size50: '11–50 lidí',
        size200: '51–200 lidí',
        size200Plus: '200+ lidí',
        pain: 'Kde vám utíká nejvíc času?',
        painHint: 'Krátký popis — administrativa, dokumentace, propočty, komunikace…',
        painPh: 'Např. Obchodníci tráví denně 3–4 hodiny přípravou nabídek, než se dostanou k novému klientovi.',
        hours: 'Odhad ztraceného času týdně',
        hoursUnknown: '— nevím —',
        hours10: 'Do 10 hodin týdně',
        hours30: '10–30 hodin týdně',
        hours100: '30–100 hodin týdně',
        hours100Plus: 'Přes 100 hodin týdně',
        priority: 'Priorita řešení',
        priorityCrit: 'Kritická — potřebujeme teď',
        priorityHigh: 'Vysoká — do 3 měsíců',
        priorityMid: 'Střední — letos',
        priorityExplore: 'Zatím zjišťujeme',
        email: 'E-mail',
        emailPh: 'vy@firma.cz',
        phone: 'Telefon',
        phonePh: '+420 777 777 777',
        optional: '(nepovinné)',
        when: 'Kdy vás máme zastihnout?',
        whenPh: 'Např. zítra dopoledne, nebo kdykoliv po 16:00',
        select: '— vyberte —',
        gdpr: 'Souhlasím se zpracováním poskytnutých údajů pro účely diagnostiky a kontaktu ze strany VELYOS. Data nikde nesdílíme, neprodáváme, ani nepoužíváme k tréninku cizích modelů.',
        submit: 'Odeslat diagnostiku',
        submitNote: 'Po odeslání dostanete do 24 hodin odpověď od specialisty. Pokud chcete rychleji, rovnou si promluvte s agentem →',
        gdprAlert: 'Prosím potvrďte souhlas se zpracováním údajů.',
        mailSubject: 'Diagnostika — ',
        mailSubjectFallback: 'nová poptávka',
    },
    en: {
        name: 'Full name',
        namePh: 'John Smith',
        position: 'Position at company',
        positionOwner: 'Founder / owner',
        positionCeo: 'CEO / managing director',
        positionManager: 'Manager / team lead',
        positionIt: 'IT / operations',
        positionOther: 'Other',
        company: 'Company',
        companyPh: 'Acme Inc.',
        industry: 'Industry',
        indHealth: 'Healthcare',
        indConstr: 'Construction',
        indReal: 'Real estate',
        indProfServices: 'Professional services (law, consulting, accounting)',
        indEcom: 'E-commerce / retail',
        indMfg: 'Manufacturing',
        indServices: 'Services (B2C)',
        indOther: 'Other',
        size: 'Team size',
        size10: '1–10 people',
        size50: '11–50 people',
        size200: '51–200 people',
        size200Plus: '200+ people',
        pain: 'Where is time leaking most?',
        painHint: 'Short description — admin, documentation, quotes, communication…',
        painPh: 'E.g. Sales reps spend 3–4 hours a day preparing proposals before they get to a new client.',
        hours: 'Estimated time lost per week',
        hoursUnknown: '— not sure —',
        hours10: 'Up to 10 hours / week',
        hours30: '10–30 hours / week',
        hours100: '30–100 hours / week',
        hours100Plus: 'Over 100 hours / week',
        priority: 'Priority',
        priorityCrit: 'Critical — we need it now',
        priorityHigh: 'High — within 3 months',
        priorityMid: 'Medium — this year',
        priorityExplore: 'Still exploring',
        email: 'Email',
        emailPh: 'you@company.com',
        phone: 'Phone',
        phonePh: '+1 555 555 5555',
        optional: '(optional)',
        when: 'When should we reach you?',
        whenPh: 'E.g. tomorrow morning, or any time after 4 pm',
        select: '— select —',
        gdpr: 'I agree to the processing of the provided data for diagnostic and contact purposes by VELYOS. We never share, sell, or use your data to train third-party models.',
        submit: 'Send diagnostic',
        submitNote: 'After submission, a specialist will respond within 24 hours. Want it faster? Just talk to the agent →',
        gdprAlert: 'Please confirm consent to data processing.',
        mailSubject: 'Diagnostic — ',
        mailSubjectFallback: 'new inquiry',
    },
    de: {
        name: 'Vor- und Nachname',
        namePh: 'Max Mustermann',
        position: 'Position im Unternehmen',
        positionOwner: 'Inhaber / Geschäftsführer',
        positionCeo: 'CEO / Vorstand',
        positionManager: 'Manager / Teamleiter',
        positionIt: 'IT / Betrieb',
        positionOther: 'Sonstiges',
        company: 'Unternehmen',
        companyPh: 'Muster GmbH',
        industry: 'Branche',
        indHealth: 'Gesundheitswesen',
        indConstr: 'Bauwesen',
        indReal: 'Immobilien',
        indProfServices: 'Professionelle Dienstleistungen (Recht, Beratung, Buchhaltung)',
        indEcom: 'E-Commerce / Einzelhandel',
        indMfg: 'Produktion',
        indServices: 'Dienstleistungen (B2C)',
        indOther: 'Sonstiges',
        size: 'Teamgröße',
        size10: '1–10 Personen',
        size50: '11–50 Personen',
        size200: '51–200 Personen',
        size200Plus: '200+ Personen',
        pain: 'Wo verlieren Sie am meisten Zeit?',
        painHint: 'Kurze Beschreibung — Verwaltung, Dokumentation, Angebote, Kommunikation…',
        painPh: 'Z.B. Vertriebler verbringen täglich 3–4 Stunden mit Angebotsvorbereitung, bevor sie zum neuen Kunden kommen.',
        hours: 'Geschätzte verlorene Zeit pro Woche',
        hoursUnknown: '— nicht sicher —',
        hours10: 'Bis zu 10 Stunden / Woche',
        hours30: '10–30 Stunden / Woche',
        hours100: '30–100 Stunden / Woche',
        hours100Plus: 'Über 100 Stunden / Woche',
        priority: 'Priorität',
        priorityCrit: 'Kritisch — wir brauchen es jetzt',
        priorityHigh: 'Hoch — in 3 Monaten',
        priorityMid: 'Mittel — dieses Jahr',
        priorityExplore: 'Wir sondieren noch',
        email: 'E-Mail',
        emailPh: 'sie@firma.de',
        phone: 'Telefon',
        phonePh: '+49 151 12345678',
        optional: '(optional)',
        when: 'Wann sollen wir Sie erreichen?',
        whenPh: 'Z.B. morgen vormittag, oder jederzeit nach 16 Uhr',
        select: '— auswählen —',
        gdpr: 'Ich stimme der Verarbeitung der angegebenen Daten für Diagnose- und Kontaktzwecke durch VELYOS zu. Wir teilen, verkaufen oder nutzen Ihre Daten nicht zum Training fremder Modelle.',
        submit: 'Diagnose absenden',
        submitNote: 'Nach dem Absenden meldet sich ein Spezialist innerhalb von 24 Stunden. Schneller? Einfach mit dem Agenten sprechen →',
        gdprAlert: 'Bitte bestätigen Sie die Einwilligung zur Datenverarbeitung.',
        mailSubject: 'Diagnose — ',
        mailSubjectFallback: 'neue Anfrage',
    },
} as const;

// ========== URL routing per jazyk ==========
// Každá page má v URL sémantický slug v daném jazyce.
// Interní klíč (routeKey) je stálý — používá se pro aktivní stav, hreflang, atd.

export type RouteKey =
    | 'home'
    | 'firmy'
    | 'jednotlivci'
    | 'diagnostika'
    | 'o-nas'
    | 'pristup'
    | 'pripadove-studie'
    | 'kontakt'
    | 'impresum'
    | 'ochrana-osobnich-udaju';

export const ROUTES: Record<RouteKey, Record<Lang, string>> = {
    'home': { cs: '/', en: '/en', de: '/de' },
    'firmy': { cs: '/firmy', en: '/en/companies', de: '/de/unternehmen' },
    'jednotlivci': { cs: '/jednotlivci', en: '/en/individuals', de: '/de/einzelpersonen' },
    'diagnostika': { cs: '/diagnostika', en: '/en/diagnostic', de: '/de/diagnose' },
    'o-nas': { cs: '/o-nas', en: '/en/about', de: '/de/ueber-uns' },
    'pristup': { cs: '/pristup', en: '/en/approach', de: '/de/ansatz' },
    'pripadove-studie': { cs: '/pripadove-studie', en: '/en/use-cases', de: '/de/anwendungsbeispiele' },
    'kontakt': { cs: '/kontakt', en: '/en/contact', de: '/de/kontakt' },
    'impresum': { cs: '/impresum', en: '/impresum', de: '/impresum' }, // právní — jen CZ
    'ochrana-osobnich-udaju': { cs: '/ochrana-osobnich-udaju', en: '/ochrana-osobnich-udaju', de: '/ochrana-osobnich-udaju' }, // právní — jen CZ
};

/** Vrátí URL pro danou route v daném jazyce */
export function route(key: RouteKey, lang: Lang): string {
    return ROUTES[key][lang];
}
