window.onload = function() {
    window.vi = new vido({
        el: "#V-Video", //select elm
        src: "https://media.w3.org/2010/05/bunny/trailer.mp4", // Big Buck Bunny trailer (CC BY 3.0)
        w: "100%",
        h: "100%",
        autoplay: false,
        muted: true,
        playsinline: true
    });
};
