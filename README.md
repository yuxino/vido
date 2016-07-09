# vido

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Nbsaw/vido/blob/master/LICENSE)      [![version](https://img.shields.io/badge/version-0.1-blue.svg)](https://github.com/Nbsaw/vido)    [![Ass](https://img.shields.io/badge/Transaction%20type-Ass-brightgreen.svg)](https://github.com/Nbsaw/vido)           [![build](https://img.shields.io/jenkins/s/https/jenkins.qa.ubuntu.com/precise-desktop-amd64_default.svg?maxAge=2592000)](https://github.com/Nbsaw/vido)     [![build](https://img.shields.io/badge/dependency-VUE.js-brightgreen.svg)](http://vuejs.org/)      [![twitter](https://img.shields.io/twitter/url/http/shields.io.svg?style=social&maxAge=2592000)](https://twitter.com/nbsaw)

##Introduction

[demo](https://nbsaw.github.io/vido/)

<font size=4>a beautiful html 5 video</font>

<br />

![image](http://7xqvgr.com1.z0.glb.clouddn.com/C8%29AG@%5BHY7ZAD~YAJG%281360.png)


##Install

```bash
    git clone git@github.com:Nbsaw/vido.git
```
<br />

##Usage

###HTML

```html
<div id="V-Video" class="v-video"></div>
```


```javascript
vi = new vido({
    el: "#V-Video",//select elm
    src: "http://7xqvgr.com1.z0.glb.clouddn.com/demo.mp4",//video src
    w: "640px",//video width
    h: "360px",//video height
    autoplay: true//autoplay
});
```

**Options**


```css
/*Change color*/
.v-point,.v-loaded {
    background: red;
}
```

such as rgb(98, 222, 216)


![image](http://7xqvgr.com1.z0.glb.clouddn.com/UC%7BOS52NK35VHZNJ4OG@74R.png)

## Todo

- [ ] List API
- [ ] Ui adjustment
- [ ] next set
- [ ] Fix some bug
