# Changelog

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
