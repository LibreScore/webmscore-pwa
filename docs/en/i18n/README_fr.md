# Webmscore PWA

&#8206;**English** | &#8206;[[+]](https://librescore.ddns.net/projects/librescore/docs)

L'interface officielle de l'outil webmscore : https://librescore.github.io/

## Développement

Une fois que vous avez créé un projet et installé les dépendances avec `npm install` (ou `pnpm install` ou `yarn`), démarrez un serveur de développement :

```bash
npm run dev

# ou démarrez le serveur et ouvrez l'application dans un nouvel onglet du navigateur
npm run dev -- --open
```

## Construction

Avant de créer une version de production de votre application, installez un [adaptateur](https://kit.svelte.dev/docs#adapters) pour votre environnement cible. Puis :

```bash
npm run build
```

> Vous pouvez prévisualiser l'application construite avec `npm run preview`, que vous ayez installé un adaptateur ou non. Cela ne doit _pas_ être utilisé pour diffuser votre application en production.
