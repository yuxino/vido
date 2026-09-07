window.onload = function() {
    window.vi = new vido({
        el: "#V-Video", //select elm
        src: "https://img.yuxino.cn/static/vido/BV19t41187z2_p1.mp4", // Original Vido demo: 初音未来 千本樱（电音版）
        w: "100%",
        h: "100%",
        autoplay: false,
        muted: true,
        playsinline: true
    });
};
