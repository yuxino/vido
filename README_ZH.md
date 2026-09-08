<div align="center">
  <img src="docs/vido-avatar.png" width="112" alt="Vido Q 版放映员头像">
  <h1>vido 2</h1>
  <p>一个小小的视频播放器，进度条上也可以有你的头像。</p>
  <a href="https://vido.yuxino.cn">网站与交互演示</a>
</div>

[English](README.md) · [简体中文](README_ZH.md)

Vido 2 用 TypeScript 重新写过，**不依赖框架，也没有运行时依赖**。按钮放在画面下面，播放、音量、拖动和字幕交给浏览器原生视频接口。你可以给进度条换一张头像，让它陪着视频慢慢往前走。没选头像时，就是一颗普通的小圆点。

## 试试看

```bash
npm install
npm test
npm start
```

打开[本地演示](http://127.0.0.1:4321/demo/index.html)，初始为暂停、静音。构建会生成 ESM、CommonJS、浏览器全局脚本和 TypeScript 类型。浏览器脚本目前压缩传输约 5.4 KiB，构建限制为 15 KiB。

## 接到网站里

先放一个能独立播放的原生视频。JavaScript 还没加载时，它也能用：

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
    lang: 'zh',
    avatar: '/my-avatar.svg'
  });
</script>
```

也可以传入空容器和 `src`，或者用 `video` 指定已有的视频元素。原来的 `<source>`、`<track>` 会保留。普通网页加载 `dist/vido.min.js` 后，可以用 `new vido(...)` 或 `new Vido(...)`。使用包管理器时，从 `vido` 导入播放器，从 `vido/style.css` 导入样式。

```ts
import Vido from 'vido';
import 'vido/style.css';

const player = new Vido({ el: wrapper, video, lang: 'zh' });
player.setTheme({ avatar: '/my-avatar.svg', accent: '#555', motion: false });
player.setSource('/another-movie.mp4', '/another-poster.webp');
// 原生视频的方法和事件仍然可用。
await player.video.play();
// 页面组件卸载时清理监听和界面，恢复原生视频按钮。
player.destroy();
```

模块可以在服务端导入；创建播放器放在页面挂载之后，卸载时调用 `destroy()`。不需要 iframe 或 Vue。已有视频会回到原来的位置，保留换过的视频源和播放进度。`setSource(url)` 和 `player.src = url` 会清除上一段视频的封面，需要新封面时传入第二个参数；由 Vido 新建的视频会被移除。自己调用 `player.video.play()` 时，要处理浏览器返回的失败结果。

## 换成自己喜欢的样子

| 选项 | 默认值 | 用途 |
| --- | --- | --- |
| `el` | 必填 | 容器元素或 CSS 选择器 |
| `video` | 容器内第一个视频 | 要接管的原生视频；没有时自动创建 |
| `src`、`poster` | 沿用已有视频 | 视频地址和封面地址 |
| `lang` | `'zh'` | `'zh'` 或 `'en'`；`labels` 可覆盖单条文案 |
| `avatar` | 小圆点 | 图片地址或 `false`；支持 SVG、普通图片和图片 blob URL |
| `accent` | 中性深灰 | 进度和焦点颜色，接受 CSS 颜色值 |
| `motion` | `true` | 播放时头像轻轻晃动；始终尊重系统的减少动态效果设置 |
| `autoplay`、`muted`、`loop` | 沿用已有视频 | 原生播放设置；自动播放一定从静音开始 |
| `playsinline` | `true` | 支持时在手机页面内播放 |
| `tracks` | 不新增 | WebVTT 字幕：`{src, srclang, label, default?}` |
| `w`、`h` | 自适应 | 兼容旧版的宽度和视频区域高度，接受 CSS 长度或像素数字 |

`setTheme()` 只更新传入的字段。`avatar: false` 会换回圆点。头像通过 SVG 的 `<image>` 地址加载，不把外部 SVG 代码插进页面。你可以在自己的上传界面里创建图片 blob URL，再传给播放器；不用时由你的应用释放这个 URL。Vido 不上传图片、不记录观看行为，也不保存偏好。

有字幕轨道时才显示字幕选择。跨域 VTT 需要服务器允许 CORS，并为视频设置 `crossorigin`。画中画和全屏按浏览器能力显示，是否能打开还受权限限制；iPhone 可以使用系统原生全屏。在限制网页音量调节的手机上，用设备音量键。

## 按钮和键盘

用 Tab 切换按钮、滑块和选择框。焦点停在播放器画面上时，空格/K 切换播放，左右方向键前后跳五秒，M 静音，F 全屏。焦点在滑块上时，方向键和 Home/End 仍按滑块的原生方式工作；其他地方的按键不会控制播放器。

速度有 0.5、0.75、1、1.25、1.5、2 倍。加载中会提示，加载失败可以重试。不内置 HLS/DASH 引擎、播放列表、账号或统计功能。浏览器支持哪些格式、服务器是否支持分段读取，仍然会影响播放。

稳定的 `data-vido-control` 名称：`player`、`play`、`seek`、`mute`、`volume`、`speed`、`captions`、`pip`、`fullscreen`、`retry`。进度范围是 0–1000，代表完整时长的比例；音量为 0–1。状态提示使用 `data-vido-role="status"`，根元素的 `data-vido-state` 跟随原生播放/暂停状态。

## 验证与旧版迁移

`npm test` 检查模块和服务端导入、原生状态同步、视频节点保留、销毁、过期播放请求、错误恢复及头像地址安全。`npm run build` 检查类型和体积。[浏览器回归页面](http://127.0.0.1:4321/tests/regression.html) 用来检查真实浏览器中的 DOM 行为。视频解码、声音、全屏和手机体验还要用演示页验证，DOM 测试通过不等于所有设备都能播放。

[1.x → 2.0 迁移说明](docs/migration-v2.md)。Vue 模型方法和旧版 `.v-*` 样式内部接口已移除。

## 演示素材与许可

演示沿用 Vido 原来的[初音未来 千本樱（电音版）](https://img.yuxino.cn/static/vido/BV19t41187z2_p1.mp4)，对应 [BV19t41187z2](https://www.bilibili.com/video/BV19t41187z2/)。页面直接加载外部视频地址，仓库不打包或修改视频。

Vido 代码使用 [MIT 许可](LICENSE)。2.0 不再包含 Vue；Vue 1.0.26 运行时及其 MIT 版权说明保留在历史 1.x 版本中，不进入 2.0 分发包。角色素材见[品牌图片说明](docs/brand-artwork.md)。

## 可编辑头像

`avatars/gavin.svg` 参照 Ashita 已有的黑白发、紫眼角色绘制，使用可编辑的矢量路径。演示默认用它作为进度条头像。复制到自己的网站后把地址传给 `avatar`，也可以换成自己的图片；头像不会内嵌在播放器脚本里。
