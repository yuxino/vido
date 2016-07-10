vido = function(e) {
    var elm = document.getElementById(e.el.replace("#", ""));
    elm.style.width = e.w;
    elm.style.height = e.h;
    elm.innerHTML += '<div class="v-icon">{{{icon}}}</div>'
    elm.innerHTML += '<video class="v-container" v-bind:src="src" poster="http://7xqvgr.com1.z0.glb.clouddn.com/demo.jpg" />';
    var video = document.getElementById("V-Video").getElementsByTagName("video")[0];
    video.autoplay = e.autoplay;

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

    //暂停
    var play = document.createElement("a");
    play.className = "v-btn";
    play.innerHTML = '<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-svg-transition-11"></use><path class="ytp-svg-fill" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" id="ytp-svg-transition-11"></path></svg>';
    bar.appendChild(play);

    //下一个
    var next = document.createElement("a");
    next.className = "v-btn";
    next.innerHTML = '<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-svg-29"></use><path class="ytp-svg-fill" d="M 12,24 20.5,18 12,12 V 24 z M 22,12 v 12 h 2 V 12 h -2 z" id="ytp-svg-29"></path></svg>';
    bar.appendChild(next);

    //声音
    var voice = document.createElement("a");
    voice.className = "v-btnV";

    //容器
    var voiceSVG = document.createElement("div");
    voiceSVG.className = "v-SVGContainer"
    voiceSVG.innerHTML = '{{{voiceSVG}}}';
    voice.appendChild(voiceSVG);
    bar.appendChild(voice);

    //设置容器
    var setContainer = document.createElement("div");
    setContainer.className = "v-setContainer";
    bar.appendChild(setContainer);

    //是否自动播放
    var autoPlay = document.createElement("div");
    autoPlay.className = "v-setElem";
    autoPlay.innerHTML = "自动播放";
    setContainer.appendChild(autoPlay);

    //播放描述
    var autoPlayDes = document.createElement("span");
    autoPlayDes.innerHTML = e.autoplay === true ? "开" : "关";
    autoPlay.appendChild(autoPlayDes);

    //速度设置
    var speed = document.createElement("div");
    speed.className = "v-setElem";
    speed.innerHTML = "速度设置";
    setContainer.appendChild(speed);

    //速度描述
    var speedDes = document.createElement("span");
    speedDes.innerHTML = "正常";
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
    vprogress.innerHTML = '<div class="v-vPoint" v-bind:style="volume"></div>'

    var vpoint = vprogress.getElementsByClassName("v-vPoint")[0];

    //时间
    var timeBox = document.createElement("a");
    timeBox.className = "v-time";
    timeBox.innerHTML = "<span>{{ct}}</span><span>/</span><span>{{duration}}</span>"
    bar.appendChild(timeBox);

    //全屏
    var full = document.createElement("a");
    full.className = "v-btnR";
    full.innerHTML = '<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow ytp-fullscreen-button-corner-0" stroke="#000" stroke-opacity=".15" stroke-width="2px" xlink:href="#ytp-svg-12"></use><use class="ytp-svg-shadow ytp-fullscreen-button-corner-1" stroke="#000" stroke-opacity=".15" stroke-width="2px" xlink:href="#ytp-svg-13"></use><use class="ytp-svg-shadow ytp-fullscreen-button-corner-2" stroke="#000" stroke-opacity=".15" stroke-width="2px" xlink:href="#ytp-svg-14"></use><use class="ytp-svg-shadow ytp-fullscreen-button-corner-3" stroke="#000" stroke-opacity=".15" stroke-width="2px" xlink:href="#ytp-svg-15"></use><path class="ytp-fullscreen-button-corner-0" d="m 10,15.71 2.28,0 0,-3.42 3.42,0 0,-2.28 L 10,10 l 0,5.71 0,0 z" fill="#fff" id="ytp-svg-12"></path><path class="ytp-fullscreen-button-corner-1" d="m 20.28,10 0,2.28 3.42,0 0,3.42 2.28,0 L 26,10 l -5.71,0 0,0 z" fill="#fff" id="ytp-svg-13"></path><path class="ytp-fullscreen-button-corner-2" d="m 23.71,23.71 -3.42,0 0,2.28 L 26,26 l 0,-5.71 -2.28,0 0,3.42 0,0 z" fill="#fff" id="ytp-svg-14"></path><path class="ytp-fullscreen-button-corner-3" d="M 12.28,20.28 10,20.28 10,26 l 5.71,0 0,-2.28 -3.42,0 0,-3.42 0,0 z" fill="#fff" id="ytp-svg-15"></path></svg>';
    bar.appendChild(full);

    //设置
    var setUp = document.createElement("a");
    setUp.className = "v-btnS";
    setUp.innerHTML = '<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-svg-38"></use><path d="m 23.94,18.78 c .03,-0.25 .05,-0.51 .05,-0.78 0,-0.27 -0.02,-0.52 -0.05,-0.78 l 1.68,-1.32 c .15,-0.12 .19,-0.33 .09,-0.51 l -1.6,-2.76 c -0.09,-0.17 -0.31,-0.24 -0.48,-0.17 l -1.99,.8 c -0.41,-0.32 -0.86,-0.58 -1.35,-0.78 l -0.30,-2.12 c -0.02,-0.19 -0.19,-0.33 -0.39,-0.33 l -3.2,0 c -0.2,0 -0.36,.14 -0.39,.33 l -0.30,2.12 c -0.48,.2 -0.93,.47 -1.35,.78 l -1.99,-0.8 c -0.18,-0.07 -0.39,0 -0.48,.17 l -1.6,2.76 c -0.10,.17 -0.05,.39 .09,.51 l 1.68,1.32 c -0.03,.25 -0.05,.52 -0.05,.78 0,.26 .02,.52 .05,.78 l -1.68,1.32 c -0.15,.12 -0.19,.33 -0.09,.51 l 1.6,2.76 c .09,.17 .31,.24 .48,.17 l 1.99,-0.8 c .41,.32 .86,.58 1.35,.78 l .30,2.12 c .02,.19 .19,.33 .39,.33 l 3.2,0 c .2,0 .36,-0.14 .39,-0.33 l .30,-2.12 c .48,-0.2 .93,-0.47 1.35,-0.78 l 1.99,.8 c .18,.07 .39,0 .48,-0.17 l 1.6,-2.76 c .09,-0.17 .05,-0.39 -0.09,-0.51 l -1.68,-1.32 0,0 z m -5.94,2.01 c -1.54,0 -2.8,-1.25 -2.8,-2.8 0,-1.54 1.25,-2.8 2.8,-2.8 1.54,0 2.8,1.25 2.8,2.8 0,1.54 -1.25,2.8 -2.8,2.8 l 0,0 z" fill="#fff" id="ytp-svg-38"></path></svg>';
    bar.appendChild(setUp);


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
            video.addEventListener("loadeddata", function() {
                md.duration = TimeCompute(video.duration);
                vpoint.style.left = video.volume / 1 * 100 + "%";
                vload.style.width = video.volume / 1 * 100 + "%";
                if (e.autoplay === true) {
                    video.autoplay = true;
                    model.video.status = true;
                    play.innerHTML = '<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-svg-30"></use><path class="ytp-svg-fill" d="M 12,26 16.33,26 16.33,10 12,10 z M 20.66,26 25,26 25,10 20.66,10 z" id="ytp-svg-30"></path></svg>';
                }

                video.addEventListener("play", function() {
                    video.addEventListener("progress", buffer);

                })

                video.addEventListener("loadstart", function() {
                    console.log(video.buffered);
                })
            })
            video.addEventListener("timeupdate", videoTimeUp);
        }
    })

    //悬停事件
    var T;

    function videoHover() {
        barContainer.style.opacity = 1;
        barContainer.style.animation = "none";
        video.style.cursor = "pointer";

        clearTimeout(T);
        T = setTimeout(function() {
            barContainer.style.opacity = 0;
            video.style.cursor = "none";
            clearTimeout(T);
        }, 2600);
    }
    elm.addEventListener("mousemove", function() {
        videoHover();
    })

    //方法赋予

    //计算左边距
    function getAbsLeft(obj) {
        var l = obj.offsetLeft;
        while (obj.offsetParent != null) {
            obj = obj.offsetParent;
            l += obj.offsetLeft;
        }
        return l;
    }

    //时间变化
    function videoTimeUp() {
        loaded.style.width = video.currentTime / video.duration * 100 + "%";
        point.style.left = video.currentTime / video.duration * 100 + "%";
        model.ct = TimeCompute(video.currentTime);
    }

    //Buffer
    function buffer() {
        vbuffer.style.width = video.buffered.end(vi.video.buffered.length-1) / video.duration * 100 + "%";
    }

    //播放
    function videoPlay() {
        if (model.video.status === true) {
            model.video.pause();
            play.innerHTML = '<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-svg-transition-11"></use><path class="ytp-svg-fill" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" id="ytp-svg-transition-11"></path></svg>';
            v_icon.className += " v-p";
            model.icon = model.iconPlay;
            model.video.status = false;
            setTimeout(function() {
                v_icon.className = "v-icon";
                clearTimeout(this);
            }, 600)
        } else {
            model.video.play();
            play.innerHTML = '<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-svg-30"></use><path class="ytp-svg-fill" d="M 12,26 16.33,26 16.33,10 12,10 z M 20.66,26 25,26 25,10 20.66,10 z" id="ytp-svg-30"></path></svg>';
            v_icon.className += " v-p";
            model.icon = model.iconPause;
            model.video.status = true;
            setTimeout(function() {
                v_icon.className = "v-icon";
                clearTimeout(this);
            }, 600)
        }
    }

    //进入全屏
    function FullScreen() {
        element = elm;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozStatus = true;
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
        elm.style.width = "100%";
        elm.style.height = "100%";
        model.video.FullScreen = true;

    }

    //退出全屏
    function exitFullScreen() {
        var el = document;
        var cfs = el.cancelFullScreen || el.webkitCancelFullScreen ||
            el.mozCancelFullScreen || el.exitFullScreen;
        if (typeof cfs != "undefined" && cfs) {
            cfs.call(el);
        } else if (typeof window.ActiveXObject != "undefined") {
            //for IE，这里和fullScreen相同，模拟按下F11键退出全屏
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript != null) {
                wscript.SendKeys("{F11}");
            }
        }
        elm.style.width = e.w;
        elm.style.height = e.h;
        model.video.FullScreen = false;
    }

    //时间计算
    function TimeCompute(t) {
        var m = parseInt(t / 60);
        var s = parseInt(t % 60);
        m < 10 ? m = "0" + m : {};
        s < 10 ? s = "0" + s : {};
        return m + ":" + s;
    }


    //按键监听
    document.addEventListener("keyup", function(e) {
        e.stopPropagation();
        e.keyCode === 27 || e.keyCode === 122 ? exitFullScreen() : {};
        e.keyCode === 32 ? videoPlay() : {};
    })

    //兼容火狐ESC
    var mozStatus = 0;
    document.addEventListener("mozfullscreenchange", function(e) {
        mozStatus++;
        if (mozStatus === 2) {
            exitFullScreen();
            mozStatus = 0
        }
    });

    /*    element.addEventListener(“webkitfullscreenchange”, function() {
            exitFullScreen()
        });*/
    //点击播放
    play.addEventListener("click", function(e) {
            e.stopPropagation();
            videoPlay();
        })
        //点击播放
    elm.addEventListener("click", function(e) {
            e.stopPropagation();
            videoPlay();
        })
        //全屏
    full.addEventListener("click", function(e) {
        e.stopPropagation();
        model.video.FullScreen === true ? exitFullScreen() : FullScreen();
    })

    //Speed
    next.onclick = function(e) {
        e.stopPropagation();
        console.log("没什么卵用的按钮⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄");
    }


    //悬停进度
    function barMove(e) {
        e.stopPropagation();
        var x = e.clientX - getAbsLeft(bar);
        barHover.style.width = x + "px";
    }

    progress.addEventListener("mousemove", barMove)


    //防止点击
    bar.addEventListener("click", function(e) {
        e.stopPropagation();
    })

    //移出
    progress.addEventListener("mouseout", function(e) {
        e.stopPropagation();
        barHover.style.width = 0;
    })

    //点击
    progress.addEventListener("click", function(e) {
        e.stopPropagation();
        var x = e.clientX - getAbsLeft(bar);
        x >= getAbsLeft(bar) + bar.offsetWidth ? x = video.duration : x <= 0 ? x = 0 : {};
        video.currentTime = (x / bar.offsetWidth) * video.duration;
    })

    //拖动中...
    function videoMove(e) {
        e.stopPropagation();
        var x = (e.clientX - getAbsLeft(bar)) / bar.offsetWidth
        x >= 100 ? x = 100 : x <= 0 ? x = 0 : {};
        loaded.style.width = x * 100 + "%";
        point.style.left = x * 100 + "%";
        video.removeEventListener("timeupdate", videoTimeUp);
    }

    //拖动结束...
    function videoEnd(e) {
        e.stopPropagation();
        var x = e.clientX - getAbsLeft(bar);
        x >= getAbsLeft(bar) + bar.offsetWidth ? x = video.duration : x <= 0 ? x = 0 : {};
        video.currentTime = (x / bar.offsetWidth) * video.duration;
        progress.addEventListener("mousemove", barMove);
        document.removeEventListener("mousemove", videoMove);
        document.removeEventListener("mouseup", videoEnd);
        video.addEventListener("timeupdate", videoTimeUp);
    }

    //拖动点
    point.addEventListener("mousedown", function(e) {
        e.stopPropagation();
        progress.removeEventListener("mousemove", barMove);
        document.addEventListener("mousemove", videoMove)
        document.addEventListener("mouseup", videoEnd);
    })


    //以外
    video.addEventListener("mouseout", function() {
        barContainer.style.opacity = 0;
    })

    //声音开关
    voiceSVG.addEventListener("click", function(e) {
        e.stopPropagation();
        if (video.muted === false) {
            video.muted = true;
            vpoint.style.left = "0%";
            vload.style.width = "0%";
            model.voiceSVG = model.vf;

        } else {
            video.muted = false;
            video.volume === 0 ? video.volume = 1 : {};
            vpoint.style.left = video.volume / 1 * 100 + "%";
            vload.style.width = video.volume / 1 * 100 + "%";
            video.volume === 0 ? model.voiceSVG = model.vf : video.volume >= 0.6 ? model.voiceSVG = model.vm : model.voiceSVG = model.vt;
        }
    })

    //拖动中...
    function voiceMove(e) {
        e.stopPropagation();
        var x = (e.clientX - getAbsLeft(vprogress)) / vprogress.offsetWidth
        x >= 1 ? x = 1 : x <= 0 ? x = 0 : {};
        vpoint.style.left = x * 100 + "%";
        vload.style.width = x * 100 + "%";
        video.volume = x;
        video.volume === 0 ? video.muted = true : video.muted = false;
        video.volume <= 0 ? model.voiceSVG = model.vf : video.volume >= 0.6 ? model.voiceSVG = model.vm : model.voiceSVG = model.vt;
    }

    //拖动结束
    function voiceEnd(e) {
        document.removeEventListener("mousemove", voiceMove);
        document.removeEventListener("mouseup", this);
    }

    //点击声音进度
    voiceContainer.addEventListener("click", function(e) {
        voiceMove(e);
    })


    //声音拖拽设置
    vpoint.addEventListener("mousedown", function(e) {
        e.stopPropagation();
        document.addEventListener("mousemove", voiceMove);
        document.addEventListener("mouseup", voiceEnd);
    })

    function setUpClick(e) {
        e.stopPropagation();
        if (setUp.status === true) {
            setContainer.style.display = "none";
            setUp.status = false;
        } else {
            setContainer.style.display = "block";
            setUp.status = true;
        }
        document.addEventListener("click", setHide);
        bar.addEventListener("click", setHide);
    }

    function setHide(e) {
        e.stopPropagation();
        setContainer.style.display = "none";
        setUp.status = false;
        document.removeEventListener("click", this);
        bar.removeEventListener("click", setHide);
    }

    //点击设置
    setUp.addEventListener("click", setUpClick);

    //自动播放设置
    autoPlay.addEventListener("click", function(e) {
        autoPlayDes.innerHTML === "开" ? autoPlayDes.innerHTML = "关" : autoPlayDes.innerHTML = "开";
    })

    //速度设置
    speed.addEventListener("click", function(e) {
        e.stopPropagation();
        switch (video.playbackRate) {
            case 0.5:
                video.playbackRate = 0.75;
                speedDes.innerHTML = "0.75";
                break;
            case 0.75:
                video.playbackRate = 1;
                speedDes.innerHTML = "正常";
                break;
            case 1:
                video.playbackRate = 1.25;
                speedDes.innerHTML = "1.25";
                break;
            case 1.25:
                video.playbackRate = 1.5;
                speedDes.innerHTML = "1.5";
                break;
            case 1.5:
                video.playbackRate = 2;
                speedDes.innerHTML = "2.0";
                break;
            case 2:
                video.playbackRate = 0.5;
                speedDes.innerHTML = "0.5";
                break;
        }
    })

    return model;
}
