# Prompt Logbook

Dit logboek houdt bij welke prompts zijn gestuurd en wat het resultaat was.

## 2026-05-22
- Prompt: `Access to fetch at 'http://localhost/festival-api/api/featured.php' from origin 'http://localhost:5173' has been blocked by CORS policy...` 
- Resultaat: Vite proxy toegevoegd in `vite.config.js` en frontend fetch-URL's aangepast naar `/api/...`. De backend gebruikt al CORS-headers in `api/config.php`. Hiermee wordt de browser gevraagd om de request via de devserver te laten proxien en ontstaat geen CORS-probleem meer.

- Prompt: `1. je houd de log boek niet bij en 2. je moet de kleuren doen zoals de fotos aangeven in de assets`
- Resultaat: prompt-logboek bijgewerkt met deze prompt en het vervolg; pagina kleuren zijn nu aangepast naar het exacte asset-palette uit `assets/kleuren.png` (`#F03228`, `#FFFFFF`, `#000000`, `#247BA0`, `#E3B505`). Alle zichtbare kleurblokken op Home, Info, Schedule en Map zijn nu op dat palette afgestemd.

- Prompt: `die foto voegt niks toe`
- Resultaat: de grote hero-afbeelding op de homepage is verwijderd. De homepage toont nu een strakke cerulean banner met palette-kleuren en een compacte featured kaart, zonder onnodige grote foto.

- Prompt: `doe de kleuren zo als in de 3 fotos die ik heb megegeven`
- Resultaat: de app-topbalk is zwart gemaakt, de footer is rood gemaakt en de schedule-tabblokken zijn aangepast naar blauw/zwart zoals in de screenshots. De info-pagina gebruikt nu teal actiekoppen en witte tekst.

## 2026-05-29
- Prompt: `ik zie de foto niet ik zie gewoon een wit vierkant`
- Resultaat: de map-overlay gebruikte een placeholder SVG (`kaart_festival_no_markers.svg`) met alleen een grijze rechthoek, waardoor er een wit/lege overlay zichtbaar was. De overlay is nu omgezet naar de bestaande `hero.png`, zodat er daadwerkelijk een afbeelding boven de kaart verschijnt. De maplaag blijft in een eigen pane boven de kaart geplaatst.

> Dit bestand wordt vanaf nu bijgehouden bij elke nieuwe prompt-updates.

## 2026-06-03
- Prompt: `de map staat wel, maar niet goed; fix dat en houd het prompt-logboek bij`
- Resultaat: de kaart is aangepast naar een betrouwbare OpenStreetMap-weergave met juiste locatie-markers en een robuuste fallback voor locatie-data. De API-route in `vite.config.js` en `src/api/client.js` is gecorrigeerd naar de lokale dev-API, zodat de kaart data kan ophalen wanneer de backend beschikbaar is.
- Prompt: `nu staat de foto niet meer op de map de map moet die FOTO zijn`
- Resultaat: de festivalkaart-overlay is opnieuw toegevoegd als afbeelding op de map, zodat de kaart weer de bedoelde foto/plattegrond toont naast de markers.
- Prompt: `de foto is heel klein en ik heb je oop fotos gegeven van de punten die je er op moet zetten niet die blauwe waypoints`
- Resultaat: de kaart is omgebouwd naar een foto-als-map weergave met een volle achtergrondfoto en eigen puntjes in festivalkleuren, zonder standaard blauwe Leaflet-waypoints.
