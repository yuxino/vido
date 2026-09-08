/*! Vido 2.0.2 | MIT License */

// src/vido.ts
var strings = {
  en: { player: "Vido video player", play: "Play", pause: "Pause", seek: "Playback position", mute: "Mute", unmute: "Unmute", volume: "Volume", fullscreen: "Fullscreen", exitFullscreen: "Exit fullscreen", speed: "Playback speed", captions: "Captions", off: "Off", pip: "Picture in picture", exitPip: "Exit picture in picture", error: "This video could not load. Check the address or connection.", playDenied: "Playback could not start. Press play to try again.", unavailable: "This action is unavailable in your browser.", loading: "Loading video\u2026", retry: "Retry", live: "Live" },
  zh: { player: "Vido \u89C6\u9891\u64AD\u653E\u5668", play: "\u64AD\u653E", pause: "\u6682\u505C", seek: "\u64AD\u653E\u8FDB\u5EA6", mute: "\u9759\u97F3", unmute: "\u53D6\u6D88\u9759\u97F3", volume: "\u97F3\u91CF", fullscreen: "\u5168\u5C4F", exitFullscreen: "\u9000\u51FA\u5168\u5C4F", speed: "\u64AD\u653E\u901F\u5EA6", captions: "\u5B57\u5E55", off: "\u5173\u95ED", pip: "\u753B\u4E2D\u753B", exitPip: "\u9000\u51FA\u753B\u4E2D\u753B", error: "\u89C6\u9891\u6CA1\u80FD\u52A0\u8F7D\uFF0C\u8BF7\u68C0\u67E5\u5730\u5740\u6216\u7F51\u7EDC\u3002", playDenied: "\u8FD8\u6CA1\u80FD\u5F00\u59CB\u64AD\u653E\uFF0C\u8BF7\u518D\u6309\u4E00\u6B21\u64AD\u653E\u3002", unavailable: "\u6B64\u6D4F\u89C8\u5668\u6682\u65F6\u65E0\u6CD5\u5B8C\u6210\u8FD9\u4E2A\u64CD\u4F5C\u3002", loading: "\u89C6\u9891\u52A0\u8F7D\u4E2D\u2026", retry: "\u91CD\u8BD5", live: "\u76F4\u64AD" }
};
var icons = {
  play: '<path d="m9 5 11 7-11 7Z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  volume: '<path d="M11 5 6 9H3v6h3l5 4ZM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  muted: '<path d="M11 5 6 9H3v6h3l5 4Zm5 4 5 6m0-6-5 6"/>',
  fullscreen: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
  exitFullscreen: '<path d="M3 8h5V3m8 0v5h5M8 21v-5H3m13 5v-5h5"/>',
  pip: '<rect x="2" y="4" width="20" height="16" rx="2"/><rect x="11" y="11" width="8" height="6" rx="1"/>',
  retry: '<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>'
};
var activePlayers = /* @__PURE__ */ new WeakMap();
var activeVideos = /* @__PURE__ */ new WeakMap();
var formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const s = Math.floor(seconds), h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60;
  return `${h ? `${h}:` : ""}${h ? String(m).padStart(2, "0") : m}:${String(s % 60).padStart(2, "0")}`;
};
var Vido = class {
  constructor(options) {
    this.cleanup = [];
    this.addedTracks = [];
    this.destroyed = false;
    this.playRequest = 0;
    this.pendingPlay = false;
    this.generation = 0;
    this.errorVisible = false;
    if (!options?.el) throw new Error("vido: el is required");
    const target = typeof options.el === "string" ? typeof document !== "undefined" ? document.querySelector(options.el) : null : options.el;
    if (!target || target.nodeType !== 1) throw new Error("vido: target element not found");
    if (activePlayers.has(target)) throw new Error("vido: target already has a player; destroy it before mounting again");
    if (target.tagName === "VIDEO") throw new Error("vido: el must be a container; pass the video with the video option");
    this.el = target;
    this.doc = target.ownerDocument;
    this.labels = { ...strings[options.lang ?? "zh"], ...options.labels };
    const existing = options.video ?? target.querySelector("video");
    if (existing && existing.tagName !== "VIDEO") throw new Error("vido: video must be an HTMLVideoElement");
    if (existing && activeVideos.has(existing)) throw new Error("vido: video already has a player; destroy it before mounting again");
    this.video = existing ?? this.doc.createElement("video");
    this.supplied = !!existing;
    this.originalVideoClass = this.video.className;
    this.originalRootAttributes = ["class", "style", "role", "tabindex", "aria-label", "data-vido-control", "data-vido-state", "data-vido-motion"].map((name) => [name, target.getAttribute(name)]);
    if (existing?.parentNode) {
      this.placeholder = this.doc.createComment("vido video position");
      existing.before(this.placeholder);
    }
    target.classList.add("vido");
    target.setAttribute("role", "group");
    target.setAttribute("aria-label", this.labels.player);
    target.setAttribute("data-vido-control", "player");
    target.tabIndex = 0;
    if (options.w !== void 0) target.style.width = typeof options.w === "number" ? `${options.w}px` : options.w;
    this.shell = this.node("div", "vido-shell");
    this.surface = this.node("div", "vido-surface");
    if (options.h !== void 0) this.surface.style.height = typeof options.h === "number" ? `${options.h}px` : options.h;
    this.video.classList.add("vido-video");
    this.video.controls = false;
    if (!this.video.hasAttribute("preload")) this.video.preload = "metadata";
    this.video.playsInline = options.playsinline !== false;
    if (options.muted !== void 0) this.video.muted = this.video.defaultMuted = options.muted;
    if (options.loop !== void 0) this.video.loop = options.loop;
    if (options.poster !== void 0) this.video.poster = options.poster;
    if (options.src !== void 0) this.video.src = options.src;
    if (options.autoplay !== void 0) this.video.autoplay = options.autoplay;
    if (this.video.autoplay) this.video.muted = this.video.defaultMuted = true;
    this.surface.append(this.video);
    this.shell.append(this.surface);
    const controls = this.node("div", "vido-controls");
    const progress = this.node("div", "vido-progress");
    progress.append(this.node("div", "vido-track"), this.node("div", "vido-buffer"), this.node("div", "vido-progress-fill"));
    this.seek = this.range("seek", this.labels.seek, "1000", "1");
    this.seek.classList.add("vido-seek");
    this.seek.disabled = true;
    const svgNS = "http://www.w3.org/2000/svg";
    this.marker = this.doc.createElementNS(svgNS, "svg");
    this.marker.setAttribute("class", "vido-companion");
    this.marker.setAttribute("viewBox", "0 0 40 40");
    this.marker.setAttribute("aria-hidden", "true");
    this.marker.setAttribute("focusable", "false");
    this.markerImage = this.doc.createElementNS(svgNS, "image");
    for (const key of ["width", "height"]) this.markerImage.setAttribute(key, "40");
    this.markerImage.setAttribute("preserveAspectRatio", "xMidYMid meet");
    this.marker.append(this.markerImage);
    progress.append(this.marker, this.seek);
    controls.append(progress);
    const row = this.node("div", "vido-toolbar");
    this.playButton = this.button("play", this.labels.play, "play");
    this.muteButton = this.button("mute", this.labels.mute, "volume");
    this.volume = this.range("volume", this.labels.volume, "1", "0.01");
    this.volume.classList.add("vido-volume");
    this.time = this.node("span", "vido-time");
    this.speed = this.select("speed", this.labels.speed);
    for (const rate of [0.5, 0.75, 1, 1.25, 1.5, 2]) this.speed.add(this.option(String(rate), `${rate}\xD7`));
    this.captions = this.select("captions", this.labels.captions);
    this.captions.classList.add("vido-captions");
    this.fullButton = this.button("fullscreen", this.labels.fullscreen, "fullscreen");
    this.pipButton = this.button("pip", this.labels.pip, "pip");
    this.pipButton.hidden = !this.doc.pictureInPictureEnabled || typeof this.video.requestPictureInPicture !== "function" || this.video.disablePictureInPicture;
    this.fullButton.hidden = !(target.requestFullscreen || target.webkitRequestFullscreen || this.video.webkitEnterFullscreen);
    row.append(this.playButton, this.muteButton, this.volume, this.time, this.speed, this.captions, this.pipButton, this.fullButton);
    controls.append(row);
    this.status = this.node("div", "vido-status");
    this.status.setAttribute("data-vido-role", "status");
    this.status.setAttribute("role", "status");
    this.status.setAttribute("aria-live", "polite");
    this.statusText = this.node("span");
    this.retry = this.button("retry", this.labels.retry, "retry");
    this.retry.append(this.doc.createTextNode(this.labels.retry));
    this.status.append(this.statusText, this.retry);
    this.shell.append(controls, this.status);
    target.append(this.shell);
    for (const track of options.tracks ?? []) {
      const element = this.node("track");
      element.kind = "subtitles";
      element.src = track.src;
      element.srclang = track.srclang;
      element.label = track.label;
      element.default = !!track.default;
      this.video.append(element);
      this.addedTracks.push(element);
    }
    this.bindEvents();
    this.setTheme(options);
    this.sync();
    this.syncCaptions();
    this.message(this.video.error ? this.labels.error : "", !!this.video.error);
    activePlayers.set(target, this);
    activeVideos.set(this.video, this);
  }
  get src() {
    return this.video.getAttribute("src") ?? this.video.currentSrc;
  }
  set src(value) {
    this.setSource(value);
  }
  /** Replace media and clear the old poster unless a new poster is supplied. */
  setSource(src, poster) {
    if (this.destroyed) return;
    this.generation++;
    this.playRequest++;
    this.pendingPlay = false;
    this.video.pause();
    this.video.removeAttribute("src");
    if (src) this.video.src = src;
    if (poster) this.video.poster = poster;
    else this.video.removeAttribute("poster");
    this.message("");
    this.video.load();
    this.sync();
  }
  setTheme(theme) {
    if (this.destroyed) return;
    if (theme.accent !== void 0) {
      const test = this.doc.createElement("span");
      test.style.color = theme.accent;
      if (test.style.color) this.el.style.setProperty("--vido-accent", theme.accent);
    }
    if (theme.colors === false) {
      this.el.classList.remove("vido-multicolor");
      this.el.style.removeProperty("--vido-palette");
    } else if (Array.isArray(theme.colors) && theme.colors.length >= 2 && theme.colors.length <= 6) {
      const probe = this.doc.createElement("span");
      const colors = theme.colors.map((color) => {
        if (typeof color !== "string" || /^(inherit|initial|unset|revert|revert-layer)$/i.test(color.trim()) || /(?:var|env)\(/i.test(color)) return "";
        probe.style.color = "";
        probe.style.color = color;
        return probe.style.color;
      });
      if (colors.every(Boolean)) {
        const stops = colors.map((color, index) => {
          const start = index * 100 / colors.length, end = (index + 1) * 100 / colors.length;
          const from = index === 0 ? "0%" : `calc(${start}% + 1px)`;
          const to = index === colors.length - 1 ? "100%" : `calc(${end}% - 1px)`;
          return `${color} ${from}, ${color} ${to}` + (index === colors.length - 1 ? "" : `, #fff ${to}, #fff calc(${end}% + 1px)`);
        });
        this.el.style.setProperty("--vido-palette", `linear-gradient(90deg, ${stops.join(", ")})`);
        this.el.classList.add("vido-multicolor");
      }
    }
    if (theme.motion !== void 0) this.el.dataset.vidoMotion = String(theme.motion);
    if (theme.avatar !== void 0) {
      let url = "";
      if (theme.avatar) {
        try {
          const parsed = new URL(theme.avatar, this.doc.baseURI);
          if (["https:", "http:", "blob:"].includes(parsed.protocol) || /^data:image\/(?:svg\+xml|png|jpeg|webp|gif|avif);/i.test(theme.avatar)) url = parsed.href;
        } catch {
        }
      }
      this.markerImage.setAttribute("href", url);
      this.marker.style.display = url ? "" : "none";
      this.el.classList.toggle("vido-has-avatar", !!url);
    }
    if (!this.markerImage.getAttribute("href")) this.marker.style.display = "none";
  }
  destroy() {
    if (this.destroyed) return;
    const wasPending = this.pendingPlay;
    this.destroyed = true;
    this.generation++;
    this.playRequest++;
    this.pendingPlay = false;
    this.cleanup.splice(0).forEach((remove) => remove());
    this.exitPresentation();
    for (const track of this.addedTracks) track.remove();
    if (wasPending || !this.supplied) this.video.pause();
    if (this.supplied) {
      this.video.controls = true;
      this.video.className = this.originalVideoClass;
      if (this.placeholder?.parentNode) this.placeholder.replaceWith(this.video);
      else this.el.insertBefore(this.video, this.shell);
    }
    this.shell.remove();
    for (const [name, value] of this.originalRootAttributes) {
      if (value === null) this.el.removeAttribute(name);
      else this.el.setAttribute(name, value);
    }
    activePlayers.delete(this.el);
    activeVideos.delete(this.video);
  }
  node(tag, className = "") {
    const element = this.doc.createElement(tag);
    element.className = className;
    return element;
  }
  icon(button, name) {
    button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icons[name]}</svg>`;
  }
  button(name, label, icon) {
    const b = this.node("button", "vido-button");
    b.type = "button";
    b.dataset.vidoControl = name;
    b.setAttribute("aria-label", label);
    b.title = label;
    this.icon(b, icon);
    return b;
  }
  range(name, label, max, step) {
    const input = this.node("input");
    input.type = "range";
    input.min = "0";
    input.max = max;
    input.step = step;
    input.value = "0";
    input.dataset.vidoControl = name;
    input.setAttribute("aria-label", label);
    return input;
  }
  select(name, label) {
    const select = this.node("select", "vido-select");
    select.dataset.vidoControl = name;
    select.setAttribute("aria-label", label);
    select.title = label;
    return select;
  }
  option(value, label) {
    const option = this.node("option");
    option.value = value;
    option.textContent = label;
    return option;
  }
  on(target, name, callback) {
    target.addEventListener(name, callback);
    this.cleanup.push(() => target.removeEventListener(name, callback));
  }
  message(text, error = false) {
    this.errorVisible = error;
    this.statusText.textContent = text;
    this.status.hidden = !text;
    this.retry.hidden = !error;
  }
  async play() {
    const request = ++this.playRequest, generation = this.generation;
    this.pendingPlay = true;
    this.message("");
    try {
      await this.video.play();
    } catch (error) {
      if (!this.destroyed && request === this.playRequest && generation === this.generation && error?.name !== "AbortError") this.message(this.labels.playDenied);
    } finally {
      if (!this.destroyed && request === this.playRequest && generation === this.generation) {
        this.pendingPlay = false;
        this.sync();
      }
    }
  }
  toggle() {
    if (this.destroyed) return;
    if (this.pendingPlay || !this.video.paused) {
      this.playRequest++;
      this.pendingPlay = false;
      this.video.pause();
    } else if (this.video.error) {
      this.video.load();
      void this.play();
    } else void this.play();
  }
  sync() {
    if (this.destroyed) return;
    const v = this.video, duration = v.duration;
    const valid = Number.isFinite(duration) && duration > 0;
    const ratio = valid ? Math.min(1, Math.max(0, v.currentTime / duration)) : 0;
    this.el.style.setProperty("--vido-progress", `${ratio * 100}%`);
    this.el.dataset.vidoState = v.paused || v.ended ? "paused" : "playing";
    this.seek.disabled = !valid || !!v.error;
    this.seek.value = String(ratio * 1e3);
    this.seek.setAttribute("aria-valuetext", `${formatTime(v.currentTime)} / ${formatTime(duration)}`);
    this.time.textContent = `${formatTime(v.currentTime)} / ${duration === Infinity ? this.labels.live : formatTime(duration)}`;
    let buffered = 0;
    if (valid) for (let i = 0; i < v.buffered.length; i++) {
      if (v.buffered.start(i) <= v.currentTime && v.buffered.end(i) >= v.currentTime) buffered = v.buffered.end(i) / duration;
    }
    this.el.style.setProperty("--vido-buffer", `${Math.min(1, buffered) * 100}%`);
    const paused = v.paused || v.ended;
    this.icon(this.playButton, paused ? "play" : "pause");
    this.label(this.playButton, paused ? this.labels.play : this.labels.pause);
    const muted = v.muted || v.volume === 0;
    this.icon(this.muteButton, muted ? "muted" : "volume");
    this.label(this.muteButton, muted ? this.labels.unmute : this.labels.mute);
    this.muteButton.setAttribute("aria-pressed", String(muted));
    this.volume.value = String(muted ? 0 : v.volume);
    this.volume.setAttribute("aria-valuetext", `${Math.round(Number(this.volume.value) * 100)}%`);
    this.speed.value = String(v.playbackRate);
    const fullscreen = this.doc.fullscreenElement === this.el || this.doc.webkitFullscreenElement === this.el || v.webkitDisplayingFullscreen;
    this.icon(this.fullButton, fullscreen ? "exitFullscreen" : "fullscreen");
    this.label(this.fullButton, fullscreen ? this.labels.exitFullscreen : this.labels.fullscreen);
    this.fullButton.setAttribute("aria-pressed", String(!!fullscreen));
    this.label(this.pipButton, this.doc.pictureInPictureElement === v ? this.labels.exitPip : this.labels.pip);
    this.pipButton.setAttribute("aria-pressed", String(this.doc.pictureInPictureElement === v));
  }
  label(button, label) {
    button.title = label;
    button.setAttribute("aria-label", label);
  }
  syncCaptions() {
    const tracks = Array.from(this.video.textTracks).filter((t) => t.kind === "subtitles" || t.kind === "captions");
    this.captions.replaceChildren(this.option("-1", this.labels.off));
    tracks.forEach((track, index) => this.captions.add(this.option(String(index), track.label || track.language || String(index + 1))));
    this.captions.hidden = !tracks.length;
    this.captions.value = String(tracks.findIndex((track) => track.mode === "showing"));
  }
  bindEvents() {
    const v = this.video;
    for (const name of ["timeupdate", "durationchange", "progress", "volumechange", "ratechange", "play", "pause", "ended", "loadedmetadata", "enterpictureinpicture", "leavepictureinpicture", "webkitbeginfullscreen", "webkitendfullscreen"]) this.on(v, name, () => this.sync());
    for (const name of ["playing", "canplay", "loadeddata"]) this.on(v, name, () => {
      if (!v.error) this.message("");
    });
    this.on(v, "waiting", () => {
      if (!v.paused && !this.errorVisible) this.message(this.labels.loading);
    });
    this.on(v, "pause", () => {
      if (!this.errorVisible) this.message("");
    });
    this.on(v, "emptied", () => {
      this.playRequest++;
      this.pendingPlay = false;
      this.message("");
      this.sync();
    });
    this.on(v, "error", () => {
      this.playRequest++;
      this.pendingPlay = false;
      this.message(this.labels.error, true);
      this.sync();
    });
    this.on(this.playButton, "click", () => this.toggle());
    this.on(v, "click", () => this.toggle());
    this.on(this.retry, "click", () => {
      v.load();
      void this.play();
    });
    this.on(this.seek, "input", () => {
      if (!this.seek.disabled) {
        v.currentTime = Number(this.seek.value) / 1e3 * v.duration;
        this.sync();
      }
    });
    this.on(this.muteButton, "click", () => {
      if (v.muted || !v.volume) {
        if (!v.volume) v.volume = 1;
        v.muted = false;
      } else v.muted = true;
      this.sync();
    });
    this.on(this.volume, "input", () => {
      v.volume = Number(this.volume.value);
      v.muted = v.volume === 0;
      this.sync();
    });
    this.on(this.speed, "change", () => {
      v.playbackRate = Number(this.speed.value);
    });
    this.on(this.captions, "change", () => Array.from(v.textTracks).filter((t) => t.kind === "subtitles" || t.kind === "captions").forEach((track, i) => {
      track.mode = i === Number(this.captions.value) ? "showing" : "disabled";
    }));
    for (const name of ["addtrack", "removetrack", "change"]) this.on(v.textTracks, name, () => this.syncCaptions());
    for (const track of v.querySelectorAll("track")) this.on(track, "load", () => this.syncCaptions());
    this.on(this.fullButton, "click", () => {
      void this.fullscreen();
    });
    this.on(this.pipButton, "click", () => {
      void this.pictureInPicture();
    });
    for (const name of ["fullscreenchange", "webkitfullscreenchange"]) this.on(this.doc, name, () => this.sync());
    this.on(this.el, "keydown", (event) => {
      if (event.target !== this.el && event.target !== v) return;
      const e = event;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === " " || e.key.toLowerCase() === "k") {
        e.preventDefault();
        this.toggle();
      } else if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && !this.seek.disabled) {
        e.preventDefault();
        v.currentTime = Math.min(v.duration, Math.max(0, v.currentTime + (e.key === "ArrowRight" ? 5 : -5)));
        this.sync();
      } else if (e.key.toLowerCase() === "m") {
        e.preventDefault();
        this.muteButton.click();
      } else if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        void this.fullscreen();
      }
    });
    this.on(this.markerImage, "error", () => {
      this.marker.style.display = "none";
      this.el.classList.remove("vido-has-avatar");
    });
  }
  async fullscreen() {
    const generation = this.generation, doc = this.doc, target = this.el, video = this.video;
    try {
      if (doc.fullscreenElement === target && doc.exitFullscreen) await doc.exitFullscreen();
      else if (doc.webkitFullscreenElement === target && doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
      else if (video.webkitDisplayingFullscreen && video.webkitExitFullscreen) video.webkitExitFullscreen();
      else if (target.requestFullscreen) await target.requestFullscreen();
      else if (target.webkitRequestFullscreen) await target.webkitRequestFullscreen();
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
      else throw new Error("unavailable");
    } catch {
      if (!this.destroyed && generation === this.generation) this.message(this.labels.unavailable);
    }
    if (this.destroyed && !activeVideos.has(this.video)) this.exitPresentation();
  }
  async pictureInPicture() {
    const generation = this.generation;
    try {
      if (this.doc.pictureInPictureElement === this.video) await this.doc.exitPictureInPicture();
      else await this.video.requestPictureInPicture();
    } catch {
      if (!this.destroyed && generation === this.generation) this.message(this.labels.unavailable);
    }
    if (this.destroyed && !activeVideos.has(this.video)) this.exitPresentation();
  }
  exitPresentation() {
    const doc = this.doc, video = this.video;
    try {
      if (doc.fullscreenElement === this.el) void Promise.resolve(doc.exitFullscreen()).catch(() => {
      });
      else if (doc.webkitFullscreenElement === this.el && doc.webkitExitFullscreen) void Promise.resolve(doc.webkitExitFullscreen()).catch(() => {
      });
      else if (video.webkitDisplayingFullscreen) video.webkitExitFullscreen?.();
    } catch {
    }
    try {
      if (doc.pictureInPictureElement === video) void Promise.resolve(doc.exitPictureInPicture()).catch(() => {
      });
    } catch {
    }
  }
};
var vido_default = Vido;
export {
  Vido,
  vido_default as default
};
