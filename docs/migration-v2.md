# Vido 1.x → 2.0

Vido 2 replaces Vue 1.0.26 and Grunt with a TypeScript runtime and an esbuild/TypeScript build. It has zero runtime dependencies. This is a major version: Vue models, AMD loading and `.v-*` CSS internals are removed.

## Existing plain-script pages

Remove the Vue script. Load `dist/vido.min.js` and `dist/vido.css`. The browser constructor remains `new vido({el, src, w, h, autoplay, muted, playsinline, poster, labels})`. `el` now accepts an element or a CSS selector. Use a plain container; remove fixed `aspect-ratio` wrappers that assumed the controls covered the picture. Controls now occupy their own space below it. `h` sizes the video surface rather than the whole player. Existing `.v-video` styles should be removed.

`player.video` is the native video. `player.src = url` remains supported; `player.setSource(url, poster)` also updates the poster. Omitting the poster (including `player.src = url`) clears the old one so unrelated artwork cannot follow a new source. `$watch`, `$destroy` and other Vue APIs are gone. Listen with `player.video.addEventListener(...)` and clean up the player with `player.destroy()`.

## Modern applications

```ts
import Vido from 'vido';
import 'vido/style.css';
const player = new Vido({ el: container, video: nativeVideo, lang: 'en' });
// React effect cleanup, Vue onBeforeUnmount, or equivalent:
player.destroy();
```

The constructor is not run on the server. It preserves the supplied video node, sources, existing subtitles and existing listeners. `destroy()` removes Vido listeners, added tracks and controls, restores the original video location and class, and enables native controls. It does not rewind the video or undo source changes. If Vido created the video, it pauses and removes it. Do not mount two players into one container concurrently; destroy the first instance before remounting.

Browser-global, ESM and CommonJS builds expose Vido. CommonJS uses `const { Vido } = require('vido')` or `.default`. CSS is scoped under `.vido`. The old `vido.min.css` path remains an alias, but custom `.v-loaded` colors become `accent` or `--vido-accent` on `.vido`.

Use `lang: 'en'` instead of passing every translated label. Existing matching `labels` keys still work. Settings/autoplay panels were replaced by a direct speed select; VTT captions and picture-in-picture are shown when available. Requested autoplay always starts muted, even if `muted: false` was passed.

## 中文摘要

- 删除 Vue 脚本，只加载 Vido 的 JS 和 CSS。原来的 `new vido(...)` 基本参数仍可用。
- 播放按钮移到画面下面；去掉假定按钮覆盖视频的固定比例外框。`h` 现在代表视频区域高度。
- `player.video` 和 `player.src = ...` 保留；用原生视频事件替代 `$watch`，用 `destroy()` 替代 `$destroy`。
- React/Vue 等组件挂载后创建，卸载时销毁。已有视频节点和来源保留，销毁后恢复原生按钮；不会自动倒回开头。
- `.v-*` 旧样式不再生效，颜色改用 `accent` 或 `--vido-accent`；头像用 `avatar` 图片地址。
- 自动播放始终静音开始。速度直接选择，有字幕时才显示字幕菜单。
