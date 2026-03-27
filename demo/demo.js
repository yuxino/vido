window.onload = function() {
    window.vi = new vido({
        el: "#V-Video", //select elm
        src: "https://img.yuxino.cn/static/vido/BV19t41187z2_p1.mp4", //video src
        w: "640px", //video width
        h: "360px", //video height
        autoplay: true,
        muted: true,
        playsinline: true
    });
};
