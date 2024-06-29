<div dir="ltr" align="left">

‎[العربية](/docs/ar/اقرأني.md) | ‎[English](/docs/en/README.md) | ‎[español](/docs/es/LÉAME.md) | ‎**français** | ‎[magyar](/docs/hu/OLVASSAEL.md) | ‎[Melayu](/docs/ms/BACASAYA.md) | ‎[русский](/docs/ru/ПРОЧТИМЕНЯ.md) | ‎[简体中文](/docs/zh-Hans/自述文件.md) | ‎[[+]](https://weblate.librescore.org/projects/librescore/docs)

[//]: # "\+\_==!|!=_=!|!==_/+/ ***NE MODIFIEZ PAS AU-DESSUS DE CETTE LIGNE*** /+/^^+#|#+^+#|#+^^\+\"

# App web progressive de Webmscore

<div align="center">

[![Discord](https://img.shields.io/discord/774491656643674122?color=5865F2&label=&labelColor=555555&logo=discord&logoColor=FFFFFF)](https://discord.gg/DKu7cUZ4XQ) [![Weblate](https://weblate.librescore.org/widgets/librescore/-/webmscore-pwa/svg-badge.svg)](https://weblate.librescore.org/engage/librescore)

L'interface officielle de l'outil webmscore : <https://webmscore-pwa.librescore.org>

</div>

## Développement

Une fois que vous avez créé un projet et installé les dépendances avec `npm install` (ou `pnpm install` ou `yarn`), démarrez un serveur de développement :

```bash
npm run dev

# ou démarrez le serveur et ouvrez l'application dans un nouvel onglet du navigateur
npm run dev -- --open
```

## Compilation

Avant de créer une version de production de votre application, installez un [adaptateur](https://kit.svelte.dev/docs#adapters) pour votre environnement cible. Puis :

```bash
npm run build
```

> Vous pouvez prévisualiser l'application construite avec `npm run preview`, que vous ayez installé un adaptateur ou non. Cela ne doit _pas_ être utilisé pour diffuser votre application en production.

</div>
