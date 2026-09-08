<div align="center">
  <img src="docs/vido-avatar.png" width="112" alt="Vido 白发 Q 版放映员圆形特写">
  <h1>vido</h1>
  <p>基于 Vue 1.x 的可自定义 HTML5 视频播放器。</p>
  <a href="https://vido.yuxino.cn">官网与交互演示</a>
</div>

[English](README.md) · [简体中文](README_ZH.md)

## 本地体验

```bash
npm install
npm test
npm start
```

打开[本地演示](http://127.0.0.1:4321/demo/index.html)。播放器默认暂停并静音，可以播放、暂停、拖动进度、调整音量与倍速，并在浏览器支持时进入全屏。

源码仍使用 Vue 1.0.26 和 Grunt。1.0.2 恢复了 Vido 原有演示视频，并保留 1.0.1 的控件修复：支持键盘和触摸的原生滑块、具名按钮、限定在播放器内生效的快捷键、现代全屏状态处理、可翻译标签与媒体错误提示。`new vido(...)` 接口保持兼容；未实现功能的“下一集”按钮已经移除。

## 接入播放器

先加载随项目提供的 Vue，再加载 Vido。每个空容器挂载一个播放器：

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

把 `src` 和可选的 `poster` 换成自己的媒体地址。`el` 接受元素 ID，不支持任意 CSS 选择器。宽高使用 CSS 长度；响应式播放器可以放在设置了 `aspect-ratio: 16 / 9` 的外层容器中，再传入 `w: "100%", h: "100%"`。

| 选项 | 默认值 | 含义 |
| --- | --- | --- |
| `el` | 必填 | 空容器的元素 ID，例如 `#V-Video` |
| `src` | 无 | 浏览器可播放的媒体地址 |
| `w`, `h` | 容器样式 | CSS 宽度和高度 |
| `autoplay` | `false` | 加载后尝试播放；浏览器可能拒绝 |
| `muted` | `false` | 初始静音 |
| `playsinline` | `true` | 请求在移动端内联播放 |
| `poster` | 无 | 播放前显示的封面 |
| `labels` | 中文标签 | 覆盖各个控件和状态文案 |

自动播放受浏览器策略限制。请求自动播放时建议设置 `muted: true`；有声自动播放可能被阻止。切换自动播放选项不能绕过浏览器策略。

返回值是现有 Vue 模型。`player.video` 为真实的 `HTMLVideoElement`，可使用标准媒体方法、属性和事件：

```javascript
player.video.addEventListener("timeupdate", function () {
    console.log(player.video.currentTime);
});
player.video.pause();
player.src = "/another-movie.mp4";
```

支持的浏览器中，`play()` 返回 Promise；请自行处理播放被拒绝的情况。项目没有专用的 `destroy()` API。与 React 等框架集成时，建议在隔离 iframe 中加载这些脚本与样式，并在组件卸载时移除 iframe，让旧 Vue 运行时和文档监听器留在播放器文档内。iframe 需设置 `allow="fullscreen"` 和 `allowfullscreen` 才能启用全屏。

## 控件与文案

使用 Tab 在按钮和滑块间移动。播放器自身获得焦点后，空格切换播放与暂停。按钮遵循原生空格和 Enter 行为；滑块支持方向键以及 Home / End。Escape 关闭设置面板。页面其他区域的快捷键不会控制播放器。

设置中可以依次切换 `0.5`、`0.75`、`1`、`1.25`、`1.5` 和 `2` 倍速。触摸屏也会显示原生音量滑块，但部分移动浏览器仅允许通过设备按键调整音量。全屏支持取决于浏览器与 iframe 权限。

可选的英文标签：

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

控件提供稳定的 `data-vido-control` 值：`player`、`play`、`seek`、`mute`、`volume`、`fullscreen`、`settings`、`autoplay` 和 `speed`。进度输入范围为 `0` 到 `1000`，代表总时长的比例；音量范围为 `0` 到 `1`。消息区域标记为 `data-vido-role="status"`。集成或测试时可使用这些选择器，播放状态通过标准媒体事件获取。

## 样式

原有的红色进度强调色可以覆盖：

```css
.v-point,
.v-loaded {
    background: #fff;
}
```

样式限定在播放器范围内。触摸设备以及播放器内部获得键盘焦点时，控件保持可见。动画遵循 `prefers-reduced-motion`。

## 功能范围与检查

Vido 使用浏览器的 HTML 媒体能力，不包含 HLS / DASH 引擎、播放列表、清晰度选择、字幕菜单、画中画控件或下载功能。可播放格式受浏览器编解码器支持限制。原来的 Vue / Grunt 工具链没有替换成 React 播放器。

- `npm test` 将 `src/` 构建到 `dist/`，并检查两个模块导出。
- [浏览器回归页面](http://127.0.0.1:4321/tests/regression.html) 检查源码版本，追加 `?dist=1` 可检查分发包。页面报告自己的通过数量，不加载视频。
- 真实播放、鼠标或触摸操作、键盘、进度、音量及全屏需在演示页面检查。构建通过不等于浏览器兼容性验证。

## 演示素材

演示使用 Vido 原有 CDN 样片[初音未来 千本樱（电音版）](https://img.yuxino.cn/static/vido/BV19t41187z2_p1.mp4)，对应 [BV19t41187z2](https://www.bilibili.com/video/BV19t41187z2/)。演示和接入示例直接读取该地址，仓库不修改或打包视频。

## 代码许可

Vido 代码使用 [MIT 许可](LICENSE)。随项目提供的 Vue 运行时 © 2016 Evan You，同样使用 MIT 许可。
