<div align="center">
  <img src="docs/vido-avatar.png" width="112" alt="vido">
  <h1>vido</h1>
  <p>A custom HTML5 video player built on Vue 1.x.</p>
  <a href="https://vido.yuxino.cn">Website & interactive demo</a>
</div>

## Try it

```bash
npm install
npm test
npm start
```

Open [the local demo](http://127.0.0.1:4321/demo/index.html). It starts paused and muted. You can play, pause, seek, change volume, switch playback speed, and enter fullscreen where the browser supports it.

The source remains a Vue 1.0.26 player with a Grunt build. Version 1.0.2 restores Vido's original demo video and keeps the 1.0.1 control fixes: native keyboard/touch sliders, named buttons, scoped keyboard shortcuts, modern fullscreen state handling, translated labels, and visible media errors. The `new vido(...)` interface remains compatible; the unused next button has been removed.

## Add a player

Load the bundled Vue runtime before Vido, then mount one player per empty target element:

```html
<link rel="stylesheet" href="dist/vido.min.css">
<script src="dist/vue.min.js"></script>
<script src="dist/vido.min.js"></script>

<div id="V-Video" class="v-video"></div>
<script>
var player = new vido({
    el: "#V-Video",
    src: "https://img.yuxino.cn/static/vido/BV19t41187z2_p1.mp4",
    w: "640px",
    h: "360px",
    autoplay: false,
    muted: true,
    playsinline: true
});
</script>
```

Replace `src` and the optional `poster` with your own media URLs. `el` accepts an element ID, not an arbitrary CSS selector. Width and height are CSS lengths; for a responsive player, put the target in a wrapper with `aspect-ratio: 16 / 9` and pass `w: "100%", h: "100%"`.

| Option | Default | Meaning |
| --- | --- | --- |
| `el` | Required | Empty target element ID, such as `#V-Video` |
| `src` | None | A browser-playable media URL |
| `w`, `h` | Container styles | CSS width and height |
| `autoplay` | `false` | Request playback after loading; the browser may reject it |
| `muted` | `false` | Start with sound muted |
| `playsinline` | `true` | Request inline playback on mobile |
| `poster` | None | Image shown before playback |
| `labels` | Chinese labels | Override individual control and status strings |

Autoplay is best effort. Use `muted: true` when requesting it; an audible autoplay request can be blocked. Changing the autoplay setting does not override browser policy.

The return value is the existing Vue model. `player.video` is the real `HTMLVideoElement`, so standard media methods, properties, and events are available:

```javascript
player.video.addEventListener("timeupdate", function () {
    console.log(player.video.currentTime);
});
player.video.pause();
player.src = "/another-movie.mp4";
```

A `play()` call returns the browser's promise where supported; handle rejection in your own code. There is no dedicated `destroy()` API. For React or another framework, use an isolated iframe that loads these scripts and CSS, and remove the iframe when unmounting. This keeps the legacy Vue runtime and its document listeners inside the player document. Add `allow="fullscreen"` and `allowfullscreen` to enable iframe fullscreen.

## Controls and labels

Tab through the buttons and sliders. When the player itself has focus, Space toggles playback. Buttons use native Space/Enter behavior; sliders support arrow keys and Home/End. Escape closes the settings panel. Shortcuts elsewhere on the page do not control playback.

Settings cycle through playback speeds `0.5`, `0.75`, `1`, `1.25`, `1.5`, and `2`. A native volume slider is exposed on touch screens, although some mobile browsers reserve volume control for device buttons. Fullscreen support depends on the browser and iframe permissions.

Optional English labels:

```javascript
labels: {
    player: "Vido video player", play: "Play", pause: "Pause", seek: "Playback position",
    mute: "Mute", unmute: "Unmute", volume: "Volume", fullscreen: "Fullscreen",
    exitFullscreen: "Exit fullscreen", settings: "Settings", autoplay: "Autoplay",
    speed: "Playback speed", normal: "Normal", on: "On", off: "Off",
    error: "The video could not load. Check the video URL or connection.",
    playDenied: "Playback could not start. Press play to try again.",
    fullscreenUnavailable: "Fullscreen is unavailable in this browser."
}
```

Controls have stable `data-vido-control` values: `player`, `play`, `seek`, `mute`, `volume`, `fullscreen`, `settings`, `autoplay`, and `speed`. The seek input ranges from `0` to `1000` as a fraction of duration; volume ranges from `0` to `1`. The message area has `data-vido-role="status"`. Use these selectors for integration or tests, and standard media events for playback state.

## Styling

The original red progress accent remains customizable:

```css
.v-point,
.v-loaded {
    background: #fff;
}
```

The stylesheet is scoped to the player. Controls remain visible on touch devices and while keyboard focus is inside the player. Player animations respect `prefers-reduced-motion`.

## Scope and checks

Vido uses the browser's HTML media support. It does not include an HLS/DASH engine, playlist, quality selector, caption menu, picture-in-picture control, or download feature. Browser codec support still applies. The historical Vue/Grunt toolchain has not been replaced by a React player.

- `npm test` builds `src/` into `dist/` and checks both module exports.
- [Browser regression page](http://127.0.0.1:4321/tests/regression.html) tests the source build; append `?dist=1` to test the distributed bundle. It reports its own pass count and does not load a video.
- Use the demo for real playback, pointer/touch, keyboard, seeking, volume, and fullscreen checks. A passing build alone is not a browser compatibility test.

## Demo media

The demo uses Vido's original CDN sample, [初音未来 千本樱（电音版）](https://img.yuxino.cn/static/vido/BV19t41187z2_p1.mp4), corresponding to [BV19t41187z2](https://www.bilibili.com/video/BV19t41187z2/). The demo and example load that URL directly; the repository does not modify or bundle the video.

## Code license

Vido code is [MIT licensed](LICENSE). The bundled Vue runtime is © 2016 Evan You and also MIT licensed.
