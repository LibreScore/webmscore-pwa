<div dir="ltr" align="left">

‎[English](/docs/en/README.md) | ‎[español](/docs/es/LÉAME.md) | ‎[français](/docs/fr/LISEZMOI.md) | ‎**magyar** | ‎[Melayu](/docs/ms/BACASAYA.md) | ‎[[+]](https://weblate.librescore.org/projects/librescore/docs)

[//]: # "\+\_==!|!=_=!|!==_/+/ ***DO NOT EDIT ABOVE THIS LINE*** /+/^^+#|#+^+#|#+^^\+\"

# Webmscore PWA

<div align="center">

[![Discord](https://img.shields.io/discord/774491656643674122?color=5865F2&label=&labelColor=555555&logo=discord&logoColor=FFFFFF)](https://discord.gg/DKu7cUZ4XQ) [![Weblate](https://weblate.librescore.org/widgets/librescore/-/webmscore-pwa/svg-badge.svg)](https://weblate.librescore.org/engage/librescore)

A webmscore eszköz hivatalos kezelőfelülete: <https://webmscore-pwa.librescore.org>

</div>

## Fejlesztés

Miután csináltál egy új projektet és telepítetted a függőségeket az `npm install` (vagy az `pnpm install` vagy `yarn`) paranccsal, indítsd el egy fejlesztői szervert:

```bash
npm run dev

# vagy indítsa el a szervert, és nyissa meg az alkalmazást egy új böngészőlapon
npm run dev -- --open
```

## Összeállítás

Mielőtt létrehozná az alkalmazás általános elérhetőségi kiadását, telepítsen egy [adaptert](https://kit.svelte.dev/docs#adapters) a célkörnyezethez. Utána:

```bash
npm run build
```

> Megtekintheti a most elkészített alkalmazás előnézetét az `npm run preview` segítségével, függetlenül attól, hogy telepített-e adaptert. Ezt _nem_ szabad arra használni, hogy általánosan elérhető állapotban jelenítse meg az alkalmazást.

</div>
