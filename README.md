# Drukmeter — "Waar zit je druk?"

Vragenlijst voor directieteams (39 vragen in drie lagen) met een persoonlijke link per deelnemer,
en een facilitatorscherm op `/admin` met per deelnemer een printbaar persoonlijk rapport en per team een PowerPoint met het teambeeld.
Gespreksinstrument, geen gevalideerde test.

## Opzetten
1. **Supabase** (regio EU; hetzelfde project als Nextpedition mag): voer `supabase/schema.sql` uit in de SQL-editor.
2. **Vercel**: importeer deze repository. Zet de vier variabelen uit `.env.example` onder Environment Variables.
3. Open `/admin`, log in met `ADMIN_PASSWORD`, maak een team aan en voeg de namen toe (één per regel).
4. Kopieer de links en stuur ze rond. Wie klaar is, staat op "ingevuld".
5. **Rapporten en teampresentatie** → persoonlijke rapporten printen als PDF (A4, marges "geen", achtergrondafbeeldingen aan) en de teampresentatie downloaden.

## Inhoud aanpassen
- Vragen en schalen: `src/lib/items.ts`. De volgorde van `ITEMS` bepaalt hoe antwoorden worden opgeslagen: verander die niet meer zodra er antwoorden binnen zijn.
- Teksten en suggesties in het rapport: `TXT` in `src/lib/rapport.ts`.
