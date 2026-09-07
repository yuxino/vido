(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function() { return factory; });
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.vido = factory;
    }
})(this, function(e) {
    e = e || {};
    if (typeof e.el !== "string") {
        throw new Error("vido: el must be an element ID such as #V-Video");
    }
    var elm = document.getElementById(e.el.replace("#", ""));
    if (!elm) {
        throw new Error("vido: target element not found: " + e.el);
    }
    e.autoplay = e.autoplay === true;
    e.muted = e.muted === true;
    e.playsinline = e.playsinline !== false;
    var labels = {
        player: "Vido 视频播放器", play: "播放", pause: "暂停", seek: "播放进度",
        mute: "静音", unmute: "取消静音", volume: "音量", fullscreen: "全屏",
        exitFullscreen: "退出全屏", settings: "设置", autoplay: "自动播放",
        speed: "播放速度", normal: "正常", on: "开", off: "关",
        error: "视频未能加载，请检查视频地址或网络。",
        playDenied: "播放未能开始，请再次按播放。",
        fullscreenUnavailable: "此浏览器暂时无法进入全屏。"
    };
    Object.keys(labels).forEach(function(key) {
        if (e.labels && typeof e.labels[key] === "string") labels[key] = e.labels[key];
    });
    function control(element, name, label) {
        element.setAttribute("data-vido-control", name);
        element.setAttribute("aria-label", label);
        if (name !== "player" && name !== "mute") element.setAttribute("v-pre", "");
        if (element.tagName === "BUTTON") element.type = "button";
        return element;
    }
    control(elm, "player", labels.player);
    elm.setAttribute("role", "group");
    elm.tabIndex = 0;
    elm.style.width = e.w;
    elm.style.height = e.h;
    elm.innerHTML += '<div class="v-icon">{{{icon}}}</div>';
    var video = document.createElement("video");
    video.className = "v-container";
    video.setAttribute("v-pre", "");
    if (e.src) video.src = e.src;
    if (e.poster) video.setAttribute("poster", e.poster);
    video.preload = "metadata";
    elm.appendChild(video);
    video.autoplay = e.autoplay;
    video.muted = e.muted;
    video.defaultMuted = e.muted;
    if (e.playsinline) {
        video.setAttribute("playsinline", "playsinline");
        video.setAttribute("webkit-playsinline", "webkit-playsinline");
    }

    //图标
    var v_icon = elm.getElementsByTagName("div")[0];

    //bar-container
    var barContainer = document.createElement("div");
    barContainer.className = "v-mask";
    elm.appendChild(barContainer);

    //tools-br
    var bar = document.createElement("div");
    bar.className = "v-bar";
    barContainer.appendChild(bar);

    //进度条
    var progress = document.createElement("div");
    progress.className = "v-progress";
    bar.appendChild(progress);

    //悬停进度
    var barHover = document.createElement("div");
    barHover.className = "v-barHover";
    progress.appendChild(barHover);

    //已缓存
    var vbuffer = document.createElement("div");
    vbuffer.className = "v-buffer";
    progress.appendChild(vbuffer);

    //已播放进度
    var loaded = document.createElement("div");
    loaded.className = "v-loaded";
    progress.appendChild(loaded);

    //点
    var point = document.createElement("div");
    point.className = "v-point";
    progress.appendChild(point);

    var seek = control(document.createElement("input"), "seek", labels.seek);
    seek.type = "range";
    seek.className = "v-range v-seek";
    seek.min = 0;
    seek.max = 1000;
    seek.step = 1;
    seek.value = 0;
    seek.disabled = true;
    progress.appendChild(seek);

    //暂停
    var play = control(document.createElement("button"), "play", labels.play);
    play.className = "v-btn";
    play.innerHTML = '<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-svg-transition-11"></use><path class="ytp-svg-fill" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" id="ytp-svg-transition-11"></path></svg>';
    bar.appendChild(play);

    //声音
    var voice = document.createElement("div");
    voice.className = "v-btnV";

    //容器
    var voiceSVG = control(document.createElement("button"), "mute", labels.mute);
    voiceSVG.className = "v-SVGContainer";
    voiceSVG.innerHTML = '{{{voiceSVG}}}';
    voice.appendChild(voiceSVG);
    bar.appendChild(voice);

    //设置容器
    var setContainer = document.createElement("div");
    setContainer.className = "v-setContainer";
    bar.appendChild(setContainer);

    //是否自动播放
    var autoPlay = control(document.createElement("button"), "autoplay", labels.autoplay);
    autoPlay.className = "v-setElem";
    autoPlay.textContent = labels.autoplay;
    autoPlay.setAttribute("aria-pressed", String(e.autoplay));
    setContainer.appendChild(autoPlay);

    //播放描述
    var autoPlayDes = document.createElement("span");
    autoPlayDes.textContent = e.autoplay ? labels.on : labels.off;
    autoPlay.appendChild(autoPlayDes);

    //速度设置
    var speed = control(document.createElement("button"), "speed", labels.speed);
    speed.className = "v-setElem";
    speed.textContent = labels.speed;
    setContainer.appendChild(speed);

    //速度描述
    var speedDes = document.createElement("span");
    speedDes.textContent = labels.normal;
    speed.appendChild(speedDes);

    //声音操作区域
    var voiceContainer = document.createElement("div");
    voiceContainer.className = "v-vContainer";
    voice.appendChild(voiceContainer);

    //声音进度/容器
    var vprogress = document.createElement("div");
    vprogress.className = "v-vprogress";
    voiceContainer.appendChild(vprogress);

    //实际进度
    var vload = document.createElement("div");
    vload.className = "v-vload";
    voiceContainer.appendChild(vload);

    //声音点
    vprogress.innerHTML = '<div class="v-vPoint"></div>';

    var vpoint = vprogress.getElementsByClassName("v-vPoint")[0];

    var volume = control(document.createElement("input"), "volume", labels.volume);
    volume.type = "range";
    volume.className = "v-range v-volume";
    volume.min = 0;
    volume.max = 1;
    volume.step = 0.01;
    volume.value = e.muted ? 0 : video.volume;
    voiceContainer.appendChild(volume);

    //时间
    var timeBox = document.createElement("span");
    timeBox.className = "v-time";
    timeBox.innerHTML = "<span>{{ct}}</span><span>/</span><span>{{duration}}</span>";
    bar.appendChild(timeBox);

    //全屏
    var full = control(document.createElement("button"), "fullscreen", labels.fullscreen);
    full.className = "v-btnR";
    full.innerHTML = '<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow ytp-fullscreen-button-corner-0" stroke="#000" stroke-opacity=".15" stroke-width="2px" xlink:href="#ytp-svg-12"></use><use class="ytp-svg-shadow ytp-fullscreen-button-corner-1" stroke="#000" stroke-opacity=".15" stroke-width="2px" xlink:href="#ytp-svg-13"></use><use class="ytp-svg-shadow ytp-fullscreen-button-corner-2" stroke="#000" stroke-opacity=".15" stroke-width="2px" xlink:href="#ytp-svg-14"></use><use class="ytp-svg-shadow ytp-fullscreen-button-corner-3" stroke="#000" stroke-opacity=".15" stroke-width="2px" xlink:href="#ytp-svg-15"></use><path class="ytp-fullscreen-button-corner-0" d="m 10,15.71 2.28,0 0,-3.42 3.42,0 0,-2.28 L 10,10 l 0,5.71 0,0 z" fill="#fff" id="ytp-svg-12"></path><path class="ytp-fullscreen-button-corner-1" d="m 20.28,10 0,2.28 3.42,0 0,3.42 2.28,0 L 26,10 l -5.71,0 0,0 z" fill="#fff" id="ytp-svg-13"></path><path class="ytp-fullscreen-button-corner-2" d="m 23.71,23.71 -3.42,0 0,2.28 L 26,26 l 0,-5.71 -2.28,0 0,3.42 0,0 z" fill="#fff" id="ytp-svg-14"></path><path class="ytp-fullscreen-button-corner-3" d="M 12.28,20.28 10,20.28 10,26 l 5.71,0 0,-2.28 -3.42,0 0,-3.42 0,0 z" fill="#fff" id="ytp-svg-15"></path></svg>';
    bar.appendChild(full);

    //设置
    var setUp = control(document.createElement("button"), "settings", labels.settings);
    setUp.setAttribute("aria-expanded", "false");
    setUp.className = "v-btnS";
    setUp.innerHTML = '<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-svg-38"></use><path d="m 23.94,18.78 c .03,-0.25 .05,-0.51 .05,-0.78 0,-0.27 -0.02,-0.52 -0.05,-0.78 l 1.68,-1.32 c .15,-0.12 .19,-0.33 .09,-0.51 l -1.6,-2.76 c -0.09,-0.17 -0.31,-0.24 -0.48,-0.17 l -1.99,.8 c -0.41,-0.32 -0.86,-0.58 -1.35,-0.78 l -0.30,-2.12 c -0.02,-0.19 -0.19,-0.33 -0.39,-0.33 l -3.2,0 c -0.2,0 -0.36,.14 -0.39,.33 l -0.30,2.12 c -0.48,.2 -0.93,.47 -1.35,.78 l -1.99,-0.8 c -0.18,-0.07 -0.39,0 -0.48,.17 l -1.6,2.76 c -0.10,.17 -0.05,.39 .09,.51 l 1.68,1.32 c -0.03,.25 -0.05,.52 -0.05,.78 0,.26 .02,.52 .05,.78 l -1.68,1.32 c -0.15,.12 -0.19,.33 -0.09,.51 l 1.6,2.76 c .09,.17 .31,.24 .48,.17 l 1.99,-0.8 c .41,.32 .86,.58 1.35,.78 l .30,2.12 c .02,.19 .19,.33 .39,.33 l 3.2,0 c .2,0 .36,-0.14 .39,-0.33 l .30,-2.12 c .48,-0.2 .93,-0.47 1.35,-0.78 l 1.99,.8 c .18,.07 .39,0 .48,-0.17 l 1.6,-2.76 c .09,-0.17 .05,-0.39 -0.09,-0.51 l -1.68,-1.32 0,0 z m -5.94,2.01 c -1.54,0 -2.8,-1.25 -2.8,-2.8 0,-1.54 1.25,-2.8 2.8,-2.8 1.54,0 2.8,1.25 2.8,2.8 0,1.54 -1.25,2.8 -2.8,2.8 l 0,0 z" fill="#fff" id="ytp-svg-38"></path></svg>';
    bar.appendChild(setUp);

    var status = document.createElement("div");
    status.className = "v-status";
    status.setAttribute("data-vido-role", "status");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.hidden = true;
    elm.appendChild(status);
    var playRequest = 0;


    //Vue 绑定
    var model = new Vue({
        el: e.el,
        data: {
            video: video,
            src: e.src, //视频路径
            w: e.w + "px", //宽度
            h: e.h + "px", //高度
            icon: '<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-svg-30"></use><path class="ytp-svg-fill" d="M 12,26 16.33,26 16.33,10 12,10 z M 20.66,26 25,26 25,10 20.66,10 z" id="ytp-svg-30"></path></svg>',
            iconPause: '<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-svg-30"></use><path class="ytp-svg-fill" d="M 12,26 16.33,26 16.33,10 12,10 z M 20.66,26 25,26 25,10 20.66,10 z" id="ytp-svg-30"></path></svg>',
            iconPlay: '<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewbox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-svg-32"></use><path class="ytp-svg-fill" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" id="ytp-svg-32"></path></svg>',
            voiceSVG: '<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-svg-47"></use><path class="ytp-svg-fill" d="m 9,15.37 0,5.25 3.58,0 4.48,4.37 0,-14 -4.48,4.37 -3.58,0 0,0 z M21,18 C21,16.43 20.01,15.08 18.78,14.42 l0,7.16 C20.1,20.92 21,19.57 21,18 z M 18.78,10.2 18.78,12.04 C21.35,12.8 23.22,15.18 23.22,18 23.22,20.82 21.35,23.2 18.78,23.96 L18.78,25.8 C22.34,24.99 25,21.8 25,18 25,14.2 22.34,11.01 18.78,10.2 z" id="ytp-svg-47"></path><svg class="ytp-svg-sound-mute-group" style="opacity: 0;"><use class="ytp-svg-shadow" xlink:href="#ytp-svg-48"></use><path class="ytp-svg-fill" d="M 26.11,15.73 24.85,14.5 22.52,16.76 20.20,14.5 18.94,15.73 21.26,18 18.94,20.26 20.20,21.5 22.52,19.23 24.85,21.5 26.11,20.26 23.79,18 l 2.32,-2.26 0,0 z" id="ytp-svg-48"></path></svg></svg>',
            vf: '<svg xmlns:xlink="http://www.w3.org/1999/xlink"  height="100%" version="1.1" viewBox="0 0 36 36"><use class="ytp-svg-shadow" xlink:href="#ytp-svg-47"></use><path class="ytp-svg-fill" d="m 9,15.37 0,5.25 3.58,0 4.48,4.37 0,-14 -4.48,4.37 -3.58,0 0,0 z" id="ytp-svg-47"></path><svg class="ytp-svg-sound-mute-group" style="opacity: 1;"><use class="ytp-svg-shadow" xlink:href="#ytp-svg-48"></use><path class="ytp-svg-fill" d="M 26.11,15.73 24.85,14.5 22.52,16.76 20.20,14.5 18.94,15.73 21.26,18 18.94,20.26 20.20,21.5 22.52,19.23 24.85,21.5 26.11,20.26 23.79,18 l 2.32,-2.26 0,0 z" id="ytp-svg-48"></path></svg></svg>',
            vt: '<svg xmlns:xlink="http://www.w3.org/1999/xlink"  height="100%" version="1.1" viewBox="0 0 36 36"><use class="ytp-svg-shadow" xlink:href="#ytp-svg-47"></use><path class="ytp-svg-fill" d="m 9,15.37 0,5.25 3.58,0 4.48,4.37 0,-14 -4.48,4.37 -3.58,0 0,0 z M21,18 C21,16.43 20.01,15.08 18.78,14.42 l0,7.16 C20.1,20.92 21,19.57 21,18 z" id="ytp-svg-47"></path><svg class="ytp-svg-sound-mute-group" style="opacity: 0;"><use class="ytp-svg-shadow" xlink:href="#ytp-svg-48"></use><path class="ytp-svg-fill" d="M 26.11,15.73 24.85,14.5 22.52,16.76 20.20,14.5 18.94,15.73 21.26,18 18.94,20.26 20.20,21.5 22.52,19.23 24.85,21.5 26.11,20.26 23.79,18 l 2.32,-2.26 0,0 z" id="ytp-svg-48"></path></svg></svg>',
            vm: '<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-svg-47"></use><path class="ytp-svg-fill" d="m 9,15.37 0,5.25 3.58,0 4.48,4.37 0,-14 -4.48,4.37 -3.58,0 0,0 z M21,18 C21,16.43 20.01,15.08 18.78,14.42 l0,7.16 C20.1,20.92 21,19.57 21,18 z M 18.78,10.2 18.78,12.04 C21.35,12.8 23.22,15.18 23.22,18 23.22,20.82 21.35,23.2 18.78,23.96 L18.78,25.8 C22.34,24.99 25,21.8 25,18 25,14.2 22.34,11.01 18.78,10.2 z" id="ytp-svg-47"></path><svg class="ytp-svg-sound-mute-group" style="opacity: 0;"><use class="ytp-svg-shadow" xlink:href="#ytp-svg-48"></use><path class="ytp-svg-fill" d="M 26.11,15.73 24.85,14.5 22.52,16.76 20.20,14.5 18.94,15.73 21.26,18 18.94,20.26 20.20,21.5 22.52,19.23 24.85,21.5 26.11,20.26 23.79,18 l 2.32,-2.26 0,0 z" id="ytp-svg-48"></path></svg></svg>',
            duration: "00:00",
            ct: "00:00"
        },
        created: function() {
            var md = this;
            elm.appendChild(video);
            video.addEventListener("loadedmetadata", syncDuration);
            video.addEventListener("durationchange", syncDuration);
            video.addEventListener("loadeddata", function() {
                setStatus("");
                syncDuration();
                if (e.autoplay === true) {
                    attemptPlay();
                }
            });
            video.addEventListener("emptied", function() {
                playRequest++;
                seek.disabled = true;
                md.duration = "00:00";
                vbuffer.style.width = "0%";
                videoTimeUp();
                setStatus("");
            });
            video.addEventListener("error", function() {
                seek.disabled = true;
                syncPausedUI();
                setStatus(labels.error);
            });
            video.addEventListener("progress", buffer);
            video.addEventListener("timeupdate", videoTimeUp);
            video.addEventListener("play", syncPlayingUI);
            video.addEventListener("pause", syncPausedUI);
            video.addEventListener("ended", syncPausedUI);
            video.addEventListener("volumechange", syncVolume);
            video.addEventListener("ratechange", syncRate);
        }
    });
    model.$watch("src", function(source) {
        if (source) video.src = source;
        else video.removeAttribute("src");
        video.load();
    });
    syncVolume();
    syncRate();

    function setStatus(message) {
        status.textContent = message;
        status.hidden = !message;
    }

    function syncDuration() {
        seek.disabled = !isFinite(video.duration) || video.duration <= 0;
        model.duration = TimeCompute(video.duration);
        videoTimeUp();
    }

    function syncVolume() {
        var value = video.muted ? 0 : video.volume;
        vpoint.style.left = value * 100 + "%";
        vload.style.width = value * 100 + "%";
        volume.value = value;
        volume.setAttribute("aria-valuetext", Math.round(value * 100) + "%");
        voiceSVG.setAttribute("aria-label", value === 0 ? labels.unmute : labels.mute);
        voiceSVG.setAttribute("aria-pressed", String(video.muted));
        model.voiceSVG = value === 0 ? model.vf : value >= 0.6 ? model.vm : model.vt;
    }

    function syncRate() {
        speedDes.textContent = video.playbackRate === 1 ? labels.normal : video.playbackRate + "×";
        speed.setAttribute("aria-label", labels.speed + ": " + video.playbackRate + "×");
    }

    //悬停事件
    var T;

    function videoHover() {
        barContainer.style.opacity = 1;
        barContainer.style.animation = "none";
        video.style.cursor = "pointer";

        clearTimeout(T);
        T = setTimeout(function() {
            if (!video.paused && !elm.contains(document.activeElement) && !setUp.status) {
                barContainer.style.opacity = 0;
                video.style.cursor = "none";
            }
        }, 2600);
    }
    elm.addEventListener("mousemove", function() {
        videoHover();
    });
    elm.addEventListener("focusin", videoHover);
    elm.addEventListener("touchstart", videoHover, { passive: true });

    //方法赋予

    //时间变化
    function videoTimeUp() {
        var fraction = isFinite(video.duration) && video.duration > 0 ? video.currentTime / video.duration : 0;
        loaded.style.width = fraction * 100 + "%";
        point.style.left = fraction * 100 + "%";
        seek.value = fraction * 1000;
        seek.setAttribute("aria-valuetext", TimeCompute(video.currentTime) + " / " + TimeCompute(video.duration));
        model.ct = TimeCompute(video.currentTime);
    }

    //Buffer
    function buffer() {
        if (video.buffered.length > 0 && video.duration) {
            vbuffer.style.width = video.buffered.end(video.buffered.length - 1) / video.duration * 100 + "%";
        }
    }

    function syncPlayingUI() {
        if (video.paused) return;
        play.setAttribute("aria-label", labels.pause);
        elm.setAttribute("data-vido-state", "playing");
        setStatus("");
        play.innerHTML = '<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-svg-30"></use><path class="ytp-svg-fill" d="M 12,26 16.33,26 16.33,10 12,10 z M 20.66,26 25,26 25,10 20.66,10 z" id="ytp-svg-30"></path></svg>';
        v_icon.className += " v-p";
        model.icon = model.iconPause;
        model.video.status = true;
        setTimeout(function() {
            v_icon.className = "v-icon";
            clearTimeout(this);
        }, 600);
    }

    function syncPausedUI() {
        play.setAttribute("aria-label", labels.play);
        elm.setAttribute("data-vido-state", "paused");
        barContainer.style.opacity = 1;
        video.style.cursor = "pointer";
        play.innerHTML = '<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-svg-transition-11"></use><path class="ytp-svg-fill" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" id="ytp-svg-transition-11"></path></svg>';
        v_icon.className += " v-p";
        model.icon = model.iconPlay;
        model.video.status = false;
        setTimeout(function() {
            v_icon.className = "v-icon";
            clearTimeout(this);
        }, 600);
    }

    function attemptPlay() {
        var request = ++playRequest;
        var source = video.src;
        var playResult = model.video.play();
        if (playResult && typeof playResult.then === "function") {
            playResult.catch(function(error) {
                if (request !== playRequest || source !== video.src || !video.paused || (error && error.name === "AbortError")) return;
                syncPausedUI();
                setStatus(video.error ? labels.error : labels.playDenied);
            });
        } else {
            syncPlayingUI();
        }
    }

    //播放
    function videoPlay() {
        if (!video.paused) {
            playRequest++;
            model.video.pause();
        } else {
            attemptPlay();
        }
    }

    //进入全屏
    function fullscreenElement() {
        return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    }

    function syncFullscreen() {
        model.video.FullScreen = fullscreenElement() === elm || video.webkitDisplayingFullscreen === true;
        full.setAttribute("aria-label", model.video.FullScreen ? labels.exitFullscreen : labels.fullscreen);
        full.setAttribute("aria-pressed", String(model.video.FullScreen));
    }

    function fullscreenAction(action, target) {
        if (!action) {
            setStatus(labels.fullscreenUnavailable);
            return;
        }
        try {
            var result = action.call(target);
            if (result && typeof result.then === "function") {
                result.then(syncFullscreen).catch(function() { setStatus(labels.fullscreenUnavailable); });
            }
        } catch (error) {
            setStatus(labels.fullscreenUnavailable);
        }
    }

    function FullScreen() {
        var action = elm.requestFullscreen || elm.webkitRequestFullscreen || elm.mozRequestFullScreen || elm.msRequestFullscreen;
        fullscreenAction(action || video.webkitEnterFullscreen, action ? elm : video);
    }

    //退出全屏
    function exitFullScreen() {
        if (video.webkitDisplayingFullscreen && video.webkitExitFullscreen) {
            fullscreenAction(video.webkitExitFullscreen, video);
        } else if (fullscreenElement() === elm) {
            fullscreenAction(document.exitFullscreen || document.webkitExitFullscreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.msExitFullscreen, document);
        }
    }

    //时间计算
    function TimeCompute(t) {
        if (!isFinite(t) || t < 0) return "00:00";
        var m = parseInt(t / 60);
        var s = parseInt(t % 60);
        if (m < 10) m = "0" + m;
        if (s < 10) s = "0" + s;
        return m + ":" + s;
    }


    //按键监听
    elm.addEventListener("keydown", function(event) {
        if ((event.target === elm || event.target === video) && (event.key === " " || event.keyCode === 32)) {
            event.preventDefault();
            videoPlay();
        } else if (event.key === "Escape" && setUp.status) {
            setHide();
            setUp.focus();
        }
    });
    ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"].forEach(function(name) {
        document.addEventListener(name, syncFullscreen);
    });
    video.addEventListener("webkitbeginfullscreen", syncFullscreen);
    video.addEventListener("webkitendfullscreen", syncFullscreen);

    //点击播放
    play.addEventListener("click", function(e) {
        e.stopPropagation();
        videoPlay();
    });
    //点击播放
    elm.addEventListener("click", function(e) {
        e.stopPropagation();
        if (e.target === elm || e.target === video) videoPlay();
    });
    //全屏
    full.addEventListener("click", function(e) {
        e.stopPropagation();
        syncFullscreen();
        if (model.video.FullScreen === true)
            exitFullScreen();
        else
            FullScreen();
    });

    // Native ranges provide pointer, touch and keyboard input in the same control.
    progress.addEventListener("mousemove", function(event) {
        var rect = progress.getBoundingClientRect();
        var fraction = rect.width ? (event.clientX - rect.left) / rect.width : 0;
        barHover.style.width = Math.max(0, Math.min(1, fraction)) * 100 + "%";
    });
    progress.addEventListener("mouseleave", function() {
        barHover.style.width = "0%";
    });
    bar.addEventListener("click", function(event) { event.stopPropagation(); });
    seek.addEventListener("input", function() {
        if (!isFinite(video.duration) || video.duration <= 0) return;
        video.currentTime = Number(seek.value) / 1000 * video.duration;
        videoTimeUp();
    });
    voiceSVG.addEventListener("click", function(event) {
        event.stopPropagation();
        if (video.muted || video.volume === 0) {
            if (video.volume === 0) video.volume = 1;
            video.muted = false;
        } else {
            video.muted = true;
        }
        syncVolume();
    });
    volume.addEventListener("input", function() {
        video.volume = Number(volume.value);
        video.muted = video.volume === 0;
        syncVolume();
    });

    function setUpClick(event) {
        event.stopPropagation();
        if (setUp.status) {
            setHide();
        } else {
            setContainer.style.display = "block";
            setUp.status = true;
            setUp.setAttribute("aria-expanded", "true");
            document.addEventListener("click", setHide);
            autoPlay.focus();
        }
    }

    function setHide() {
        setContainer.style.display = "none";
        setUp.status = false;
        setUp.setAttribute("aria-expanded", "false");
        document.removeEventListener("click", setHide);
    }

    setUp.addEventListener("click", setUpClick);
    autoPlay.addEventListener("click", function(event) {
        event.stopPropagation();
        e.autoplay = !video.autoplay;
        video.autoplay = e.autoplay;
        autoPlayDes.textContent = e.autoplay ? labels.on : labels.off;
        autoPlay.setAttribute("aria-pressed", String(e.autoplay));
        if (e.autoplay && video.paused) attemptPlay();
    });
    speed.addEventListener("click", function(event) {
        event.stopPropagation();
        var rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
        video.playbackRate = rates[(rates.indexOf(video.playbackRate) + 1) % rates.length];
        syncRate();
    });
    syncPausedUI();
    syncFullscreen();
    return model;
});
