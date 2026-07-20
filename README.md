# Buslfurs-Website

Statische Astro-Website für Termine, externe Anmeldungen und Bildergalerien der Buslfurs-Community.

> **Vor dem öffentlichen Start:** Beispieltermine, Gruppentexte, Impressum, Datenschutz, Domain und Kubernetes-Platzhalter ersetzen.

## Lokal entwickeln

Voraussetzungen: Node.js 22 und npm.

```bash
npm install
npm run dev
```

Qualitätsprüfung:

```bash
npm test
npm run build
```

Die Produktionsausgabe liegt anschließend in `dist/`.

## Termine pflegen

Jeder Termin ist eine Markdown-Datei unter `src/content/events/`. Die vorhandenen Beispieldateien zeigen alle wichtigen Felder.

```yaml
---
title: "Sommer-Stammtisch"
slug: "sommer-stammtisch"
summary: "Kurze Beschreibung für die Terminübersicht."
start: 2026-08-22T17:00:00+02:00
end: 2026-08-22T22:00:00+02:00
location: "Name des Treffpunkts"
mapUrl: "https://www.openstreetmap.org/..."
registrationUrl: "https://anmeldung.example.org/..."
registrationDeadline: 2026-08-20T23:59:00+02:00
status: "open"
galleries:
  - label: "Galerie von Furryname"
    url: "https://galerie.example.org/..."
    photographer: "Furryname"
---
```

Erlaubte Statuswerte sind `open`, `full`, `closed` und `cancelled`. `mapUrl`, Anmeldung, Anmeldeschluss, Bild und Galerien sind optional. Die Website hostet keine Galeriebilder, sondern ausschließlich die angegebenen externen Links.

Events werden in der Zeitzone `Europe/Berlin` nach ihrem Endzeitpunkt automatisch in kommende und vergangene Termine aufgeteilt. Der tägliche GitHub-Workflow baut die Site neu, damit die Einordnung aktuell bleibt.

## Logo und Gestaltung

- `brand/logo-original.png` ist das unveränderte, nicht öffentlich ausgelieferte Original.
- `public/logo.png` ist eine verkleinerte, eng zugeschnittene Webfassung.
- `public/favicon.png` ist die kompakte Browser-Icon-Variante.
- Das Original nicht überschreiben. Neue Exportvarianten erhalten eigene Dateinamen.

## Container

```bash
docker build --build-arg SITE_URL=https://brusler-furs.de -t buslfurs-web .
docker run --rm -p 8080:8080 buslfurs-web
```

Der Health-Endpunkt liegt unter `/healthz`.

## GitHub und GHCR

Der Publish-Workflow benötigt:

1. ein GitHub-Repository mit Actions-Berechtigung `Read and write permissions`,
2. optional die Repository-Variable `SITE_URL`, falls die voreingestellte URL `https://brusler-furs.de` überschrieben werden soll,
3. ein nach dem ersten Build auf **public** gestelltes GHCR-Package,
4. Erlaubnis für den Actions-Bot, das Production-Overlay auf `main` zu aktualisieren.

Bei geschütztem `main` sollte statt des direkten Pushs eine Ausnahme für `github-actions[bot]` oder ein separater Deployment-Branch konfiguriert werden.

## Kubernetes und GitOps

Vor dem ersten Rollout anpassen:

- bei einem Domainwechsel den Host `brusler-furs.de` in `deploy/overlays/production/kustomization.yaml`
- bei Bedarf Traefik-Certificate-Resolver `letsencrypt` in `deploy/base/ingress.yaml`
- initialen Image-Namen `ghcr.io/OWNER/REPOSITORY`

Manifest prüfen:

```bash
kustomize build deploy/overlays/production
```

Der GitOps-Controller muss `deploy/overlays/production` beobachten. GitHub Actions schreibt nach jedem erfolgreichen Image-Build den unveränderlichen Image-Tag in dieses Overlay.

## Staging

Das Staging-Overlay veröffentlicht dieselbe Site ohne Zugangsschutz unter `https://staging.brusler-furs.de`. Der Response-Header `X-Robots-Tag: noindex, nofollow, noarchive` verhindert, dass Suchmaschinen die temporäre Umgebung indexieren oder archivieren.

Manifest prüfen:

```bash
kustomize build deploy/overlays/staging
```

Der GitOps-Controller kann zusätzlich `deploy/overlays/staging` beobachten. Der Publish-Workflow aktualisiert Production und Staging auf denselben unveränderlichen Image-Tag.
