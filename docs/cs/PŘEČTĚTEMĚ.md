<div dir="ltr" align="left">

‎[العربية](/docs/ar/اقرأني.md) | ‎**čeština** | ‎[English](/docs/en/README.md) | ‎[español](/docs/es/LÉAME.md) | ‎[français](/docs/fr/LISEZMOI.md) | ‎[magyar](/docs/hu/OLVASSAEL.md) | ‎[Melayu](/docs/ms/BACASAYA.md) | ‎[português](/docs/pt/LEIAME.md) | ‎[русский](/docs/ru/ПРОЧТИМЕНЯ.md) | ‎[简体中文](/docs/zh-Hans/自述文件.md) | ‎[[+]](https://weblate.librescore.org/projects/librescore/docs)

[//]: # "\+\_==!|!=_=!|!==_/+/ ***NEUPRAVUJTE NAD TENTO ŘÁDEK*** /+/^^+#|#+^+#|#+^^\+\"

# Progresivní webové aplikace Webmscore

<div align="center">

[![Discord](https://img.shields.io/discord/774491656643674122?color=5865F2&label=&labelColor=555555&logo=discord&logoColor=FFFFFF)](https://discord.gg/DKu7cUZ4XQ) [![Weblate](https://weblate.librescore.org/widgets/librescore/-/webmscore-pwa/svg-badge.svg)](https://weblate.librescore.org/engage/librescore)

Oficiální rozhraní pro nástroj webmscore: <https://webmscore-pwa.librescore.org>

</div>

## Vývoj

Po vytvoření projektu a instalaci závislostí pomocí `npm install` (nebo `pnpm install` nebo `yarn`), spusťte vývojářský server:

```bash
npm run dev

# nebo spusťte server a otevřete aplikaci v novém panelu prohlížeče
npm run dev -- --open
```

## Kompilace

Před vytvořením produkční verze vaší aplikace nainstalujte [adaptér](https://kit.svelte.dev/docs#adapters) pro vaše cílové prostředí. Poté:

```bash
npm run build
```

> Náhled sestavené aplikace zobrazíte příkazem `npm run preview`, nezávisle na tom, zda máte nainstalovaný adaptér. Toto _není_ doporučeno pro doručování vaší aplikace v produkčním režimu.

</div>
