# VELYOS — Web

> **„The Velocity Operating System."**
>
> Marketing web pro VELYOS — firmu, která bonitním klientům automatizuje procesy,
> kde ztrácejí nejvíc času.

Živá verze: [**stepanmanda.github.io**](https://stepanmanda.github.io)

---

## Rychlý start

```bash
npm install       # první spuštění
npm run dev       # dev server na http://localhost:4321
npm run build     # produkční build do dist/
npm run preview   # preview buildu lokálně
```

**Testy:**
```bash
npm test                    # všechny (funkční + vizuální)
npm run test:functional
npm run test:visual
npm run test:visual:update  # po designových změnách
```

---

## Tech stack

- **Astro 5** — statický site generátor
- **Vanilla JS + CSS** — žádný framework navíc
- **ElevenLabs ConvAI** — hlasový diagnostický agent
- **Playwright** — funkční + vizuální testy
- **GitHub Actions** — automatický deploy při push na `main`

---

## Struktura

```
.
├── public/                   ← statické assety (favicon, og-image, scripts, robots.txt)
├── src/
│   ├── styles/global.css     ← brand systém (CSS proměnné, komponenty)
│   ├── layouts/Layout.astro  ← base layout s head, header, footer
│   ├── components/           ← 21 reusable komponent
│   └── pages/                ← 10 stránek (1:1 URL)
├── tests/                    ← Playwright testy
├── .github/workflows/        ← CI/CD (auto-deploy)
├── astro.config.mjs
├── playwright.config.ts
├── HANDOFF.md                ← kompletní handoff pro designera
└── README.md                 ← tenhle soubor
```

Podrobný popis pro designera / nové collaborátory najdeš v [HANDOFF.md](./HANDOFF.md).

---

## Deploy

Deploy probíhá automaticky po každém `git push origin main`.
GitHub Actions:
1. Nainstaluje závislosti (`npm ci`)
2. Spustí `npm run build`
3. Nasadí `dist/` na GitHub Pages

Sledovat průběh: [Actions tab](https://github.com/stepanmanda/stepanmanda.github.io/actions)

---

## Autor

**Štěpán Manda** — [stepan@velyos.ai](mailto:stepan@velyos.ai)

© VELYOS · Františkovy Lázně · CZ
