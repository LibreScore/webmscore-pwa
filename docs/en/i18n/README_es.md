# Webmscore PWA

&#8206;**English** | &#8206;[[+]](https://librescore.ddns.net/projects/librescore/docs)

La interfaz oficial de la herramienta webmscore: https://librescore.github.io/

## Desarrollando

Una vez que haya creado un proyecto e instalado las dependencias con `npm install` (o `pnpm install` o `yarn`), inicie un servidor de desarrollo:

```bash
npm run dev

# o inicie el servidor y abra la aplicación en una nueva pestaña del navegador
npm run dev -- --open
```

## Construcción

Antes de crear una versión de producción de su aplicación, instale un [adaptador](https://kit.svelte.dev/docs#adapters) para su entorno de destino. Luego:

```bash
npm run build
```

> Puede obtener una vista previa de la aplicación creada con `npm run preview`, independientemente de si instaló un adaptador. Esto _no_ debe usarse para servir su aplicación en producción.
