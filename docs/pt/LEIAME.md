<div dir="ltr" align="left">

‎[العربية](/docs/ar/اقرأني.md) | ‎[čeština](/docs/cs/PŘEČTĚTEMĚ.md) | ‎[English](/docs/en/README.md) | ‎[español](/docs/es/LÉAME.md) | ‎[français](/docs/fr/LISEZMOI.md) | ‎[magyar](/docs/hu/OLVASSAEL.md) | ‎[Melayu](/docs/ms/BACASAYA.md) | ‎**português** | ‎[русский](/docs/ru/ПРОЧТИМЕНЯ.md) | ‎[简体中文](/docs/zh-Hans/自述文件.md) | ‎[[+]](https://weblate.librescore.org/projects/librescore/docs)

[//]: # "\+\_==!|!=_=!|!==_/+/ ***NÃO EDITE ACIMA DESTA LINHA*** /+/^^+#|#+^+#|#+^^\+\"

# PWA Webmscore

<div align="center">

[![Discord](https://img.shields.io/discord/774491656643674122?color=5865F2&label=&labelColor=555555&logo=discord&logoColor=FFFFFF)](https://discord.gg/DKu7cUZ4XQ) [![Weblate](https://weblate.librescore.org/widgets/librescore/-/webmscore-pwa/svg-badge.svg)](https://weblate.librescore.org/engage/librescore)

Frontend oficial do Webmscore: <https://webmscore-pwa.librescore.org>

</div>

## Desenvolvimento

Após criar um projeto e instalar as dependências com `npm install` (ou `pnpm install` ou `yarn`), inicie um servidor de desenvolvimento:

```bash
npm run dev

# ou inicie o servidor e abra o aplicativo em uma nova guia do navegador
npm run dev -- --open
```

## Criando uma Build

Antes de criar uma versão de produção do seu aplicativo, instale um [adaptador](https://kit.svelte.dev/docs#adapters) para o seu ambiente-alvo. Então:

```bash
npm run build
```

> Você pode pré-visualizar o aplicativo com `npm run preview`, independentemente de ter instalado um adaptador. Isso _não_ deve ser usado para servir o seu aplicativo em produção.

</div>
