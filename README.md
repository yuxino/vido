<div align="center">
  <img src="docs/vido-avatar.png" width="112" alt="Vido chibi projectionist portrait">
  <h1>vido 2</h1>
  <p>A little video player. A progress companion you can make your own.</p>
  <a href="https://vido.yuxino.cn">Website & interactive demo</a>
</div>

[English](README.md) · [简体中文](README_ZH.md)

Vido 2 is a fresh TypeScript player with **no framework or runtime dependencies**. Its controls sit below the picture. Playback, volume, seeking and captions use the browser's native video APIs; a small SVG image can follow your progress. It starts with a simple dot until you choose an avatar.

## Try it

```bash
npm install
npm test
npm start
```

Open [the local demo](http://127.0.0.1:4321/demo/index.html). It starts paused and muted. The build produces ESM, CommonJS, browser-global JavaScript and TypeScript declarations. The browser runtime has an enforced 15 KiB gzip budget; current output is about 5.4 KiB.

## Add a player

For a website, keep a native video in the HTML so it also works before JavaScript loads:

```html
<link rel="stylesheet" href="dist/vido.css">
<div id="player">
  <video controls playsinline preload="metadata" poster="/poster.webp">
    <source src="/movie.mp4" type="video/mp4">
  </video>
</div>
<script type="module">
  import Vido from './dist/vido.js';
  const player = new Vido({
    el: '#player',
    lang: 'en',
    avatar: '/my-avatar.svg'
  });
</script>
```

The constructor also accepts an empty container with `src`, or an explicit `video` element. Existing `<source>` and `<track>` elements stay intact. For a plain script, load `dist/vido.min.js` and use `new vido(...)` or `new Vido(...)`. With a package/bundler, import the class from `vido` and CSS from `vido/style.css`.

```ts
import Vido from 'vido';
import 'vido/style.css';

const player = new Vido({ el: wrapper, video, lang: 'en' });
player.setTheme({ avatar: '/my-avatar.svg', accent: '#555', motion: false });
player.setSource('/another-movie.mp4', '/another-poster.webp');
// Standard native video methods and events remain available.
await player.video.play();
// Framework cleanup: remove listeners/UI and restore native video controls.
player.destroy();
```

Imports are safe during server rendering. Construct the player after mounting and call `destroy()` when unmounting. There is no iframe or Vue runtime to manage. A supplied video is returned to its original DOM position; source changes and playback position remain. `setSource(url)` and `player.src = url` clear the previous poster; pass a second argument to set a new one. A video created by Vido is removed on destruction. Handle rejection when calling `player.video.play()` yourself.

## Make it yours

| Option | Default | Meaning |
| --- | --- | --- |
| `el` | Required | A container element or CSS selector |
| `video` | First video inside `el` | A native video to enhance; otherwise Vido creates one |
| `src`, `poster` | Existing video values | Media and preview URLs |
| `lang` | `'zh'` | `'zh'` or `'en'`; `labels` overrides individual strings |
| `avatar` | Plain dot | An image URL or `false`; SVG, raster and image blob URLs work |
| `accent` | Neutral charcoal | A CSS color for progress and focus |
| `motion` | `true` | Gentle avatar movement during playback; reduced-motion settings take priority |
| `autoplay`, `muted`, `loop` | Existing video values | Native playback settings; requested autoplay always starts muted |
| `playsinline` | `true` | Inline playback on supported mobile browsers |
| `tracks` | None added | WebVTT subtitle tracks: `{src, srclang, label, default?}` |
| `w`, `h` | Responsive | Legacy width and video-surface height, as CSS lengths or pixel numbers |

`setTheme()` updates only the fields you supply. Pass `avatar: false` to return to the dot. Avatars load through an SVG `<image>` URL; custom markup is never inserted into the page. An upload UI can create an image blob URL and pass it to `setTheme`; your app owns that URL and should revoke it when no longer used. Nothing is uploaded by Vido. The library does not store preferences or track viewers.

Subtitles appear in a native select only when caption/subtitle tracks exist. Cross-origin VTT needs appropriate CORS headers and the video's `crossorigin` attribute. Picture-in-picture and fullscreen buttons appear when their APIs are available; actual use also depends on browser permissions. On iPhone, fullscreen can use the native video player. Device buttons control volume where mobile browsers restrict it.

## Controls

Tab moves between native buttons, ranges and selects. With focus on the player surface, Space/K toggles playback, Left/Right seeks five seconds, M toggles mute and F opens fullscreen. Focused sliders keep their native arrow/Home/End behavior. Shortcuts elsewhere on the page are untouched.

Speeds: 0.5×, 0.75×, 1×, 1.25×, 1.5×, 2×. Loading and media errors are visible; failed media can be retried. There is no HLS/DASH engine, playlist, account system, analytics or autoplay-with-sound workaround. Browser codec support and server byte-range support still matter.

Stable `data-vido-control` selectors: `player`, `play`, `seek`, `mute`, `volume`, `speed`, `captions`, `pip`, `fullscreen`, `retry`. Seek ranges from 0 to 1000 as a fraction of duration. Volume ranges from 0 to 1. Status uses `data-vido-role="status"`; root `data-vido-state` reflects native paused/playing state.

## Checks and migration

`npm test` checks module/SSR compatibility, native-state synchronization, preserved video nodes, destruction, stale play promises, recovery and safe avatar URLs. `npm run build` verifies types and the runtime budget. [The browser regression page](http://127.0.0.1:4321/tests/regression.html) exercises DOM behavior in a real browser; use the demo for actual decoding, audio, fullscreen and device checks. Automated DOM tests do not prove playback compatibility.

See [the 1.x → 2.0 migration notes](docs/migration-v2.md). Vue model methods and old `.v-*` CSS internals are intentionally gone.

## Demo media and license

The demo uses the original Vido sample, [初音未来 千本樱（电音版）](https://img.yuxino.cn/static/vido/BV19t41187z2_p1.mp4), from [BV19t41187z2](https://www.bilibili.com/video/BV19t41187z2/). It loads that external URL directly; the repository does not bundle or modify the video.

Vido code is [MIT licensed](LICENSE). Vido 2 no longer includes Vue. The Vue 1.0.26 runtime and its MIT copyright notice remain in historical 1.x revisions, not in the 2.0 distribution. Artwork is documented in [brand artwork notes](docs/brand-artwork.md).

## Editable avatar

`avatars/gavin.svg` is a small editable vector based on the existing Ashita character (black-and-white hair, purple eyes). The demo uses it as the progress companion. Copy it into your site and pass its URL as `avatar`, or use your own image; no artwork is embedded in the JavaScript bundle.
