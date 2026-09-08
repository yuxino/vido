# Changelog

## 2.0.1

- Add a customizable multi-color progress track.
- Replace the incorrect avatar with the happy white-haired chibi from the supplied reference.
- Keep the website player plain by default; customization is opt-in.

## 2.0.0 — 2026-09-08

- Rebuild as a framework-free TypeScript player with ESM, CommonJS, browser-global and type declaration outputs. Remove Vue 1 and Grunt.
- Keep native video nodes, sources and events intact; provide lifecycle-safe `destroy()`, `setSource()` and `setTheme()`.
- Move neutral controls below the video and add a customizable SVG image progress companion, safe image URLs, motion preferences and reduced-motion support.
- Add direct playback-rate selection, optional WebVTT captions and capability-gated picture-in-picture, while retaining keyboard seeking, volume, fullscreen and error recovery.
- Add a 15 KiB gzip runtime budget, lifecycle and asynchronous regression coverage, a modern demo and bilingual migration notes.

This is a major version. Vue model methods, AMD and old `.v-*` styling internals are no longer supported.

## 1.0.2

- Restore Vido's original demo video, 初音未来 千本樱（电音版）, at `https://img.yuxino.cn/static/vido/BV19t41187z2_p1.mp4`.
- Update the demo title, direct-video fallback and README example; include the restored demo in the downloadable browser bundle.
- Keep the player runtime and all control, accessibility and fullscreen fixes from 1.0.1 unchanged.

## 1.0.1

- Keep the Vue 1.x constructor and returned media model compatible.
- Make playback controls keyboard accessible and use native ranges for touch, mouse, and keyboard seeking and volume changes.
- Limit the Space shortcut to the focused player. Keep controls visible on touch devices and during keyboard use.
- Track standard fullscreen events, support the standard exit method, and preserve the player's size after exiting. Show a message if fullscreen is unavailable.
- Set poster URLs as DOM attributes, disable seeking before a finite duration is available, and display media/playback errors.
- Add optional translated labels and stable control selectors. Synchronize UI when the native media volume, speed, or source changes.
- Remove the inactive next button, scope the stylesheet to the player, and respect reduced motion.
- Use a credited Big Buck Bunny trailer in the local demo; update the website to https://vido.yuxino.cn.
- Add module and browser regressions, source build CI, reproducible build banners, and retain bundled Vue license comments.

This update does not replace Vue/Grunt or add streaming engines, playlists, captions, or picture-in-picture controls.
