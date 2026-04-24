# VELYOS — Web Handoff

> **Pro web designera.** Tohle je rozcestník — co je hotové, jak spustit, kam se podívat, co dokončit.
>
> Projekt: Astro 5 · statický web · 10 stránek · brand VELYOS

---

## 1. Rychlý start

**Otevřít v prohlížeči:**
```bash
cd site
npm install       # jen poprvé
npm run dev       # spustí na http://localhost:4321
```

**Build pro nasazení:**
```bash
npm run build     # generuje dist/ — čistý statický web, 10 HTML + assets
npm run preview   # preview buildu lokálně
```

**Testy:**
```bash
npm test                       # všechno (funkční + vizuální)
npm run test:functional        # jen funkční (HTTP 200, H1, CTA, navigace)
npm run test:visual            # vizuální regrese (screenshoty)
npm run test:visual:update     # po designových změnách obnoví baseline
npm run test:ui                # interaktivní UI mode
```

---

## 2. Struktura projektu

```
site/
├── astro.config.mjs           ← Astro config + sitemap integrace
├── package.json               ← npm scripty + dependencies
├── playwright.config.ts       ← testing config
├── tsconfig.json
│
├── public/                    ← statické assety (kopírované 1:1 do dist)
│   ├── favicon.svg
│   ├── apple-touch-icon.svg
│   ├── og-image.png           ← 1200×630 social preview
│   ├── robots.txt
│   └── scripts/main.js        ← vanilla JS: animace, scroll reveals, widget
│
├── src/
│   ├── styles/global.css      ← KOMPLETNÍ brand systém (~1500 řádků)
│   │                            CSS proměnné: --velocity-black, --velocity-orange,
│   │                            --signal-gold, --ivory-silver, --deep-velocity
│   │
│   ├── layouts/
│   │   └── Layout.astro       ← base layout: head, header, footer, widget, meta
│   │
│   ├── components/            ← 21 komponent
│   │   ├── Header.astro           sticky nav s brand, linky, kontakt dropdown
│   │   ├── NavContact.astro       tmavý dropdown panel s e-mail/telefon/agent
│   │   ├── Footer.astro           4-sloupcový footer + legal řádek
│   │   │
│   │   ├── Hero.astro             slot-based hero s glow + grid
│   │   ├── SectionHead.astro      eyebrow + h2 + volitelný lead
│   │   ├── CtaBand.astro          finální CTA sekce (slot pro tlačítka)
│   │   │
│   │   ├── Features.astro         grid kontejner (2/3 sloupce)
│   │   ├── Feature.astro          jedna karta (num + title + body)
│   │   ├── Steps.astro            kroky procesu (3/4)
│   │   ├── Step.astro
│   │   ├── Audience.astro         cílovka cards
│   │   ├── AudienceCard.astro
│   │   ├── Timeline.astro         day-in-life (jen /jednotlivci)
│   │   ├── TimelineRow.astro
│   │   ├── Pricing.astro          3-sloupcové ceny
│   │   ├── Price.astro
│   │   ├── Duo.astro              2 sloupce s NEBO dividerem
│   │   ├── Split.astro            2 akcentované karty (jen /)
│   │   ├── SplitCard.astro
│   │   ├── Callout.astro          editorial citační blok
│   │   ├── Note.astro             gold-bordered informační boxík
│   │   ├── GrantBlock.astro       dotační blok (jen /firmy pricing)
│   │   ├── AgentDiagnostic.astro  sekce odkazující na /diagnostika
│   │   └── DiagnosticForm.astro   strukturovaný formulář (na /diagnostika)
│   │
│   └── pages/                 ← 10 stránek, 1:1 k URL
│       ├── index.astro             → /
│       ├── firmy.astro             → /firmy
│       ├── jednotlivci.astro       → /jednotlivci
│       ├── diagnostika.astro       → /diagnostika
│       ├── o-nas.astro             → /o-nas
│       ├── pristup.astro           → /pristup
│       ├── pripadove-studie.astro  → /pripadove-studie (Vzory nasazení)
│       ├── kontakt.astro           → /kontakt
│       ├── impresum.astro          → /impresum
│       └── ochrana-osobnich-udaju.astro → /ochrana-osobnich-udaju
│
└── tests/
    ├── pages.spec.ts          ← funkční testy (40)
    └── visual.spec.ts         ← vizuální regrese (32 snapshotů)
```

---

## 3. Brand paleta — CSS proměnné

**Všechny barvy a tokeny jsou v `src/styles/global.css`** v `:root`. Brand-wide změna = úprava jedné hodnoty.

| Token | Hex | Použití |
|---|---|---|
| `--velocity-black` | `#0B0F19` | Primární text, tmavá pozadí (agent card, footer) |
| `--ivory-silver` | `#F5F3EE` | Hlavní pozadí webu |
| `--alpine-white` | `#FFFFFF` | Karty, featury, forms |
| `--velocity-orange` | `#E85D1F` | CTA, accent, „OS" v logu, kontrolky |
| `--signal-gold` | `#B8935C` | Eyebrows, linky, disciplína/prestiž |
| `--deep-velocity` | `#1E3A5F` | Technická hloubka (málo používáno) |
| `--mist-gray` | `#8891A3` | Podpůrný text |

Typografie: `Inter` (hlavní) · `JetBrains Mono` (čísla, eyebrows) · `Fraunces Italic` (citace, tagline).

---

## 4. ElevenLabs widget

Agent ID `cu9gllbBtpZWU6CuJXky` je **globálně v `Layout.astro`** — pluje jako floating button v pravém dolním rohu na každé stránce.

**Styling:** widget přebírá CSS proměnné `--el-*` nastavené v `global.css` na `elevenlabs-convai` selectoru. Brand-consistent Alpine White base + Velocity Orange accent.

**Prompt agenta:** kompletní system prompt je v `../VELYOS_Brand/07_agent_diagnostika_prompt.md`. Vkládá se do ElevenLabs dashboardu (agent settings → System prompt).

**Collapsed default:** widget se defaultně rozbalí, proto v `public/scripts/main.js` posílá na `document` event `elevenlabs-agent:expand { action: 'collapse' }` pětkrát po načtení (50/300/800/1500/3000 ms). Doporučení: v ElevenLabs dashboardu nastavit „Default state = Closed", pak JS workaround odstranit.

---

## 5. Stav obsahu — co je hotové, co dokončit

### ✅ Dokončené
- 10 stránek s plným obsahem
- Brand identita (paleta, typo, komponenty, animace)
- Nav + footer s legal řádkem (Impresum · GDPR · Kontakt)
- GDPR privacy policy
- Impresum (OSVČ struktura)
- Favicon + OG image + sitemap + robots.txt
- Kontakt dropdown panel v navu (tmavý, premium)
- `/diagnostika` s formulářem + ElevenLabs widget
- Playwright testy (71 pass, 1 skip)

### ⏳ K dokončení (označeno v kódu)

**1. IČO a DIČ** — po registraci živnosti
- Soubor: `src/pages/impresum.astro`
- Najdi text: `— doplníme po registraci —`
- Nahraď skutečnými čísly

**2. Telefon** — po zřízení
- Aktuálně *„Doplníme po registraci firmy"* (místa: nav dropdown, footer, /kontakt karta, /kontakt FAQ, /impresum)
- Najdi `<!-- TODO -->` a hledat text *„po registraci firmy"*
- Obnovit `<a href="tel:+420...">` linky v:
  - `src/components/NavContact.astro`
  - `src/components/Footer.astro`
  - `src/pages/kontakt.astro`
  - `src/pages/impresum.astro`

**3. LinkedIn URL** — po založení firemní stránky
- Aktuálně *„LinkedIn po registraci firmy"*
- Nahradit `<span>` elementem `<a href="https://linkedin.com/company/velyos">LinkedIn</a>`
- Místa: `Footer.astro`, `/o-nas` karta kontakt, `/kontakt` karta média

**4. `hello@velyos.ai`** — vytvořit alias/mailbox
- Používá se na `/kontakt` pro media & partnery
- Pokud nechceme mít, smazat celou kartu a ponechat jen `stepan@velyos.ai`

**5. Štěpán rozšířený bio**
- Aktuální verze v `src/pages/o-nas.astro` je krátká (3 věty). Možno rozšířit o:
  - Fotku (přidat do `public/foto-stepan.jpg`, referencovat v kartě)
  - Osobní LinkedIn (osobní vs. firemní)
  - Konkrétní roky v DHL
  - Předchozí úspěšné podnikání (krátký příklad)

### 🎨 Ke zvážení (pro designera)

- **Reálné fotky/obrázky** — aktuálně je to typografický web bez fotek. Možná doplnit: foto zakladatele, ilustrační foto klienta v akci, workplace shots.
- **Mikro-animace** při scrollu jsou implementované (Intersection Observer, CSS keyframes). Designer může přidat víc — např. parallax u hero glow.
- **Mobile-first review** — web je responsive, ale mobilní zobrazení by chtělo dedikovaný QA pass.
- **Dark mode** — momentálně není. Pokud chceme, je to přes `prefers-color-scheme` v CSS na `:root`.

---

## 6. Testy — dokumentace chování

Testy v `tests/` slouží jako **dokumentace očekávaného chování**. Pokud něco designer změní a test praskne, musí vědět proč.

**Funkční testy** (`tests/pages.spec.ts`) kontrolují:
- Všech 10 stránek vrací 200
- H1, title, header, footer jsou přítomné
- Navigace mezi stránkami funguje
- CTA tlačítka vedou na správné URL
- Žádné mrtvé `href="#"` odkazy
- Footer legal linky (Impresum, GDPR, Kontakt)
- `/diagnostika` formulář má pole + ElevenLabs widget
- Nav Kontakt dropdown se otevírá

**Vizuální testy** (`tests/visual.spec.ts`) — screenshoty 10 stránek × 2 viewporty (desktop 1440×900 + mobile Pixel 7). Po každé designové změně spustit:
```bash
npm run test:visual:update    # obnoví baseline
npm run test:visual           # potvrdí že nic jiného se nerozbilo
```

---

## 7. Deploy — rychlý návod

Po změnách:

```bash
npm run build                 # vytvoří dist/
```

**Tři varianty nasazení (vyber jednu):**

### Varianta A — Cloudflare Pages (doporučeno, zdarma, rychlé)

1. Přihlas se na [dash.cloudflare.com](https://dash.cloudflare.com) (nebo si zřiď zdarma)
2. Workers & Pages → Create application → Pages → Upload assets
3. Drag & drop celou složku `site/dist/` do uploaderu
4. Dostaneš URL typu `velyos.pages.dev`

**CLI alternativa:**
```bash
npx wrangler login                    # otevře browser pro auth
npx wrangler pages deploy ./dist --project-name=velyos
```

### Varianta B — Vercel (zdarma, automatický z Git)

```bash
npx vercel login
npx vercel --prod ./dist
```

### Varianta C — Netlify Drop (nejrychlejší, bez účtu)

1. Otevři [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag & drop celou `site/dist/`
3. Hotovo za 10 sekund — dostaneš URL

Pozor: Netlify Drop je „demo-grade". Pro ostrý provoz použij variant A nebo B s vlastní doménou.

### Vlastní doména (velyos.ai)

Po nasazení doménu přidáš v dashboardu (Cloudflare/Vercel/Netlify):
1. Přidej custom domain `velyos.ai`
2. Dashboard ti ukáže DNS záznamy (`CNAME` nebo `A`)
3. U registrátora domény (např. v Cloudflare DNS, nebo původního registrátora) nastav ty záznamy
4. Za pár minut doména běží s automatickým HTTPS

---

## 8. Preview ribbon

V `Layout.astro` je `<div class="preview-ribbon">PREVIEW</div>` — oranžový pruh v rohu. **Před ostrým spuštěním odstranit** (jeden řádek).

---

## 9. Kontakt na tvůrce

**Obsah a copy:**
Štěpán Manda — [stepan@velyos.ai](mailto:stepan@velyos.ai)

**Brand book:**
Plný brand book v `../VELYOS_Brand/01_brand_book.md`
Original copy brief: `../velyos-web-*.md` soubory

---

*VELYOS Web Handoff — v0.2 preview · připraveno k designérskému review*
