
# Smart Ocean — Bahari Yetu, Maisha Yetu

Smart Ocean is a bilingual demonstration MVP for small-scale fishers in Zanzibar. It brings together illustrative fishing areas, trip planning, catch records, safety preparation and sample market workflows.

## Demo data and safety

Ocean conditions, suitability labels, estimated distances, species examples, buyer listings and prices in this MVP are simulated. Map pins are approximate reference points and are not navigation coordinates. The app has no live weather source, AI fish-location model, official marine alert integration, SMS/USSD provider, or backend authentication. Always consult trusted local marine safety information before departure.

## Run locally

Requirements: Node.js and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To create and check the production bundle:

```sh
npm run build
npm run lint
```

## Features

- Kiswahili and English interface.
- Demo account registration and sign-in stored in the current browser.
- Unguja/Pemba selection and Zanzibar departure stations.
- Leaflet/OpenStreetMap with illustrative zone markers and a directory of 29 coastal areas.
- Safety checklist, local trip plans, catch records, sample sales and trip reports.
- Responsive grouped navigation for desktop and mobile.

Trip, catch, plan, sale and account data use browser `localStorage`. They are not synchronized between devices. Demo account storage is not suitable for production authentication.

## Tech stack

React, TypeScript, Vite, React Router, Tailwind CSS, Leaflet, React Leaflet and Lucide React.

## Hosting

The Vite production output is `dist/`. Configure the host to serve `index.html` as a fallback for client-side routes such as `/map` and `/trips`.

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
