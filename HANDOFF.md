# Overdracht — Drukmeter ("Waar zit je druk?")

Lees dit eerst. De code in deze map is af en getest. Bouw hem niet opnieuw op: ga verder vanaf hier.

## Wat het is
Een vragenlijst over waar de druk zit, voor Nederlandse directieteams, met rapportage. Govert van Sandwijk (organisatiepsycholoog, Time To Grow B.V.) zet hem in als gespreksinstrument vóór een teamsessie. Het is uitdrukkelijk **niet gevalideerd** ("libelle-test"): het geeft spreiding en aanknopingspunten, geen oordeel. De vragenlijst is afgeleid van het stilgezette product Unload.ai.

Uitgangspunt in alle teksten: **druk hoort bij een directierol.** De vraag is niet óf iemand druk ervaart, maar waar die zich ophoopt en of het herstel het bijhoudt.

## Flow
1. Govert maakt op `/admin` (met wachtwoord) een team aan en plakt de namen. Elke deelnemer krijgt een persoonlijke link `/p/<token>`.
2. De deelnemer vult 31 vragen en één open vraag in (ongeveer 8 minuten) en ziet zelf **geen** uitslag. De uitslag krijgt hij in de sessie.
3. Govert ziet per deelnemer of die "ingevuld" heeft. Per deelnemer kan hij een persoonlijke toelichting schrijven.
4. Twee rapportsoorten, af te drukken als PDF via de browser (A4):
   - **Sessierapport:** één A4-teamoverzicht plus één A4 per persoon.
   - **Uitgebreid persoonlijk rapport (5 pagina's):** voorblad, uitleg en profiel, de zes vlakken in detail (van zwaar naar licht, met de eigen antwoorden onder "Wat je aangaf" of "Wat goed gaat"), en tot slot de winstpunten, "Wat je vasthoudt", werk en privé, de toelichting van Govert en invulvragen voor terugkoppeling.

## Inhoud
- Zes vlakken: Taaklast, Beslislast, Relatielast, Rollast, Hersteltekort (hoge score = weinig herstel), Verborgen last. Vijf items per vlak, Verborgen last heeft er zes, in totaal 31. Werk en privé zit in items O5 en V6 en krijgt in het rapport een eigen blok.
- Scoring: 1–5, met omgekeerde items (T4, O2, H2, H3, H4). Score per vlak = (gemiddelde − 1) / 4 × 100. Banden: 0–39 ruimte (groen), 40–64 voelbaar (geel), 65–100 zwaar (oranje).
- Teamoverzicht: anonieme stippen per vlak, teamgemiddelde, de vlaggen "gedeelde spanning" (minstens de helft zwaar, of een gemiddelde van 60 of hoger) en "uiteenlopend" (spreiding van 40 of meer), de top-4 uitspraken waarin het team zich herkent, en per aandachtspunt een gespreksvraag plus een mogelijke teamafspraak. Onder 4 deelnemers verschijnt een waarschuwing over herleidbaarheid.
- **Verander de volgorde van `ITEMS` in `src/lib/items.ts` niet meer** zodra er antwoorden binnen zijn: de antwoorden worden opgeslagen als een reeks van 31 cijfers in die volgorde.

## Techniek
- Next.js 14 (App Router, TypeScript) op Vercel, met Supabase (Postgres, regio EU) dat alleen via de server benaderd wordt met de service-role-sleutel. RLS staat aan, zonder policies.
- Het is dezelfde opzet als Goverts Bever/Nextpedition-app (repo govert1970/Nextpedition). Supabase mag hetzelfde project zijn, want de tabellen hebben het prefix `dm_`.
- Tabellen: `dm_teams`, `dm_deelnemers` (met token, antwoorden, open_antwoord, notitie, ingevuld_op). Het schema staat in `supabase/schema.sql`.
- De facilitator logt in met `ADMIN_PASSWORD`. De sessie zit in een HMAC-cookie op basis van `ADMIN_SECRET`.
- Belangrijke bestanden: `src/lib/items.ts` (vragen en schalen), `src/lib/rapport.ts` (scoring, sessierapport, suggestieteksten `TXT`), `src/lib/uitgebreid.ts` (uitgebreid rapport en voorblad), `src/app/p/[token]/page.tsx` (vragenlijst), `src/app/admin/*` (facilitator en rapport), `src/app/api/*`.

## Vastgelegde vormkeuzes
- **TTGG-stijl**, niet de stijl van govertvansandwijk.com: Corbel, kopjes in kleinkapitaal, de vier logo-dots.
- Kleuren uit het logo: oranje #EB7A2C, groen #8ABA40, geel #F5D508, lichtblauw #71C0E8. Knoppen en UI gebruiken een donkerder blauw (#3A87B8), omdat witte tekst op lichtblauw slecht leesbaar is.
- **Voorblad: optie 1, vastgelegd.** Een witte pagina met het echte TTG-logo linksboven (`public/ttg-logo.png`), vier egale cirkels rechtsboven die van de pagina aflopen, de titel "Waar zit je druk?", de naam onder een zwarte lijn en "Vertrouwelijk · alleen voor [voornaam]".
- Geen kleurverlopen of overlappende cirkels op het voorblad. Die zijn geprobeerd en afgewezen.

## Status
- De code is gebouwd, de typecheck is in orde, `npm run build` slaagt, en de vragenlijst en rapporten zijn getest met nepdata (Playwright → PDF).
- **Nog niet online.** Nog niet getest tegen een echte Supabase-database.

## Volgende stappen
1. Maak een lege **private** GitHub-repo `drukmeter` onder govert1970 en push deze code.
2. Supabase: voer `supabase/schema.sql` uit in de SQL-editor (dat mag opnieuw, het is idempotent).
3. Vercel: importeer de repo en zet de variabelen `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (zelfde als Bever), `ADMIN_PASSWORD` en `ADMIN_SECRET` (nieuw, minstens 24 tekens).
4. Doe een testronde: een testteam met Govert als enige deelnemer, één keer invullen, dan beide rapporten printen.
5. Daarna gaan de echte links naar het team.

## Werkwijze met Govert
Schrijf in het Nederlands, direct en zonder omhaal. Maak kleine, gerichte wijzigingen en herstructureer niet zonder dat hij erom vraagt. Laat resultaten zien (PDF of screenshots) in plaats van ze te beschrijven. De klantdata is vertrouwelijk, dus de repo moet private blijven.
