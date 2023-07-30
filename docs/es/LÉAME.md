<div dir="ltr" align="left">

‎[English](/docs/en/README.md) | ‎**español** | ‎[français](/docs/fr/LISEZMOI.md) | ‎[magyar](/docs/hu/OLVASSAEL.md) | ‎[Melayu](/docs/ms/BACASAYA.md) | ‎[[+]](https://weblate.librescore.org/projects/librescore/docs)

[//]: # "\+\_==!|!=_=!|!==_/+/ ***DO NOT EDIT ABOVE THIS LINE*** /+/^^+#|#+^+#|#+^^\+\"

# App web progresiva de Webmscore

<div align="center">

[![Discord](https://img.shields.io/discord/774491656643674122?color=5865F2&label=&labelColor=555555&logo=discord&logoColor=FFFFFF)](https://discord.gg/DKu7cUZ4XQ) [![Weblate](https://weblate.librescore.org/widgets/librescore/-/webmscore-pwa/svg-badge.svg)](https://weblate.librescore.org/engage/librescore)

La interfaz oficial de la herramienta webmscore: <https://webmscore-pwa.librescore.org>

</div>

## Desarrollando

Una vez que haya creado un proyecto e instalado las dependencias con `npm install` (o `pnpm install` o `yarn`), inicie un servidor de desarrollo:

```bash
npm run dev

# o inicie el servidor y abra la app en una nueva pestaña del navegador
npm run dev -- --open
```

## Compilación

Antes de crear una versión de producción de su app, instale un [adaptador](https://kit.svelte.dev/docs#adapters) para su entorno de destino. Luego:

```bash
npm run build
```

> Puede obtener una vista previa de la app creada con `npm run preview`, independientemente de si instaló un adaptador. Esto _no_ debe usarse para servir su app en producción.

</div>
