# GYM GAN – Interaktive Programmier-Rallye

Web-App für die Projektwoche am Gymnasium Ganderkesee. Zwei Bereiche:

- 🎯 **Rallye** – fünf interaktive Stationen (Reaktionsspiel, Lernmethoden, Selbstlernzentrum, Logik, KI). Fortschritt bleibt lokal (localStorage).
- 💻 **Programme** – gemeinsame Cloud-Bibliothek für Scratch-Projekte und andere Programme, gehostet über **Supabase**.

Deploy-Ziel: **Vercel**.

---

## 1) Lokal starten

```bash
npm install
cp .env.example .env.local   # Werte eintragen (siehe „Supabase-Setup“)
npm run dev
```

Läuft auf http://localhost:5173.

## 2) Supabase-Setup (einmalig)

1. Auf [app.supabase.com](https://app.supabase.com) einloggen und **New Project** anlegen (Region: eu-central-1 empfohlen).
2. In der neuen Instanz → **SQL Editor** → Inhalt von [`supabase/schema.sql`](supabase/schema.sql) einfügen und ausführen.
3. **Project Settings → API** öffnen und in `.env.local` eintragen:
   - `VITE_SUPABASE_URL` = *Project URL*
   - `VITE_SUPABASE_ANON_KEY` = *anon public key*
4. Server neu starten (`npm run dev`).

Danach:
- Ein Klick auf **+ Programm hinzufügen** lädt die `.sb3`-Datei in den Bucket `program-files` hoch.
- Optionale Vorschaubilder landen in `program-thumbnails`.
- Alle Programme werden über die Tabelle `programs` synchron gehalten – jede:r Besucher:in sieht dieselbe Bibliothek.

### Sicherheit & RLS

Das mitgelieferte Schema öffnet Lesen **und** Schreiben für alle. Das ist für die Projektwochen-Präsentation gewollt. Für Produktivbetrieb solltet ihr:

- In der Supabase-Konsole → **Authentication** einen Nutzer anlegen und die Policies auf `auth.role() = 'authenticated'` umstellen.
- Oder mit einem Passwort-Schutz vor dem Upload arbeiten (z. B. Vercel Password Protection auf `/programme/neu`).

## 3) Deploy auf Vercel

1. Repo auf GitHub/GitLab pushen.
2. Auf [vercel.com](https://vercel.com/new) → **Import Project** → Repo auswählen.
3. Framework wird automatisch als **Vite** erkannt (siehe `vercel.json`).
4. Unter **Environment Variables** die beiden Werte aus dem Supabase-Setup eintragen:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. **Deploy** klicken.

Vercel baut mit `npm run build` und serviert `dist/`. Der `vercel.json`-Rewrite sorgt dafür, dass tiefe SPA-Routes (z. B. `/programme/xyz`) auch nach einem Full-Reload funktionieren.

## 4) Projektstruktur

```
src/
├── pages/         Routen (Home, Rallye, Programme, About, Präsentation…)
├── stations/      5 spielbare Stationen (lazy geladen)
├── components/    Wiederverwendbare UI-Bausteine
├── data/          Stations-Konfiguration
├── store/         Zustand-Stores (Rallye, Programme, Rating)
├── lib/           Supabase-Client, kleine Utilities
└── styles/        Tailwind + globales CSS
```

Wichtige Dateien:

- [`src/lib/supabase.ts`](src/lib/supabase.ts) – Client-Setup, Tabellen-/Bucket-Namen.
- [`src/store/programsStore.ts`](src/store/programsStore.ts) – gesamte Cloud-Kommunikation.
- [`src/data/stationsConfig.ts`](src/data/stationsConfig.ts) – Stations-Registry (hier neue Stationen ergänzen).
- [`supabase/schema.sql`](supabase/schema.sql) – DB-Schema für neue Supabase-Instanzen.

## 5) Nützliche Kommandos

```bash
npm run dev         # Vite Dev-Server (Hot Reload)
npm run build       # Production-Build (dist/)
npm run preview     # Preview des Production-Builds
```

## 6) Präsentations-Modus

`/praesentation` bietet Direktsprünge zu allen Stationen und Programmen – ideal, wenn wir während der Vorführung schnell wechseln müssen.
