const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');
const { Vido } = require('../dist/vido.cjs');
function fixture({ nested = true, initialError = null } = {}) {
  const dom = new JSDOM(`<div id="host" class="host"><p>Keep me</p>${nested ? '<video controls poster="old.jpg"><source src="a.mp4" type="video/mp4"></video>' : ''}</div>`, { url: 'https://example.test/' });
  const { document, Event } = dom.window;
  const el = document.getElementById('host');
  const video = el.querySelector('video') ?? document.createElement('video');
  const state = { paused: true, duration: NaN, currentTime: 0, ended: false, error: initialError, playCalls: 0, pauseCalls: 0, loadCalls: 0 };
  for (const key of ['paused', 'duration', 'currentTime', 'ended', 'error']) Object.defineProperty(video, key, { configurable: true, get: () => state[key], set: value => { state[key] = value; } });
  Object.defineProperty(video, 'buffered', { value: { length: 0 } });
  video.play = () => { state.playCalls++; state.paused = false; video.dispatchEvent(new Event('play')); return Promise.resolve(); };
  video.pause = () => { state.pauseCalls++; state.paused = true; video.dispatchEvent(new Event('pause')); };
  video.load = () => { state.loadCalls++; state.currentTime = 0; state.duration = NaN; state.error = null; video.dispatchEvent(new Event('emptied')); };
  const tracks = new dom.window.EventTarget();
  tracks[Symbol.iterator] = function* () {};
  Object.defineProperty(video, 'textTracks', { value: tracks });
  const player = new Vido({ el, video, lang: 'en' });
  const fire = name => video.dispatchEvent(new Event(name));
  const control = name => el.querySelector(`[data-vido-control="${name}"]`);
  return { dom, el, video, state, player, fire, control, Event, tracks };
}
const tick = () => new Promise(resolve => setImmediate(resolve));

test('ESM and CJS import without browser globals; browser bundle exports both constructors', async () => {
  assert.equal((await import('../dist/vido.js')).default.name, 'Vido');
  assert.equal(typeof Vido, 'function');
  const context = {}; vm.runInNewContext(fs.readFileSync('dist/vido.min.js', 'utf8'), context);
  assert.equal(typeof context.vido, 'function'); assert.equal(context.Vido, context.vido);
  assert.throws(() => new Vido({ el: '#missing' }), /target element not found/);
});
test('enhancement preserves source children and destroy restores native video and unrelated DOM', () => {
  const f = fixture(); const source = f.video.querySelector('source');
  assert.equal(f.video.controls, false); assert.equal(source.getAttribute('src'), 'a.mp4');
  assert.throws(() => new Vido({ el: f.el }), /already has a player/);
  f.player.destroy(); f.player.destroy();
  assert.equal(f.el.className, 'host'); assert.equal(f.el.getAttribute('tabindex'), null);
  assert.equal(f.el.querySelector('.vido-shell'), null); assert.equal(f.video.controls, true);
  assert.equal(f.video.parentElement, f.el); assert.equal(f.video.querySelector('source'), source);
  assert.equal(f.el.firstElementChild.textContent, 'Keep me');
  const second = new Vido({ el: f.el, video: f.video }); second.destroy();
});
test('destroy restores a supplied video from a different location', () => {
  const f = fixture({ nested: false });
  f.player.destroy();
  const holder = f.dom.window.document.createElement('section'); holder.append(f.video); f.el.after(holder);
  const player = new Vido({ el: f.el, video: f.video }); player.destroy();
  assert.equal(f.video.parentElement, holder);
});
test('native media events drive controls and native seek guards unknown/infinite duration', () => {
  const f = fixture(); assert.equal(f.control('seek').disabled, true);
  f.state.duration = 100; f.state.currentTime = 25; f.fire('loadedmetadata');
  assert.equal(f.control('seek').value, '250'); assert.equal(f.control('seek').disabled, false);
  f.control('seek').value = '800'; f.control('seek').dispatchEvent(new f.Event('input'));
  assert.equal(f.state.currentTime, 80);
  f.video.play(); assert.equal(f.control('play').getAttribute('aria-label'), 'Pause');
  f.video.pause(); assert.equal(f.control('play').getAttribute('aria-label'), 'Play');
  f.state.duration = Infinity; f.fire('durationchange'); assert.equal(f.control('seek').disabled, true);
  assert.match(f.el.textContent, /Live/); f.player.destroy();
});
test('rejected play gives recoverable feedback; source changes ignore old rejections', async () => {
  const f = fixture(); let reject;
  f.video.play = () => new Promise((_, r) => { reject = r; });
  f.control('play').click(); reject(new Error('denied')); await tick();
  assert.match(f.el.querySelector('[role="status"]').textContent, /Playback could not start/);
  f.control('play').click(); f.player.setSource('b.mp4', 'b.jpg'); reject(new Error('stale')); await tick();
  assert.equal(f.el.querySelector('[role="status"]').hidden, true);
  assert.equal(f.player.src, 'b.mp4'); assert.match(f.video.poster, /b.jpg$/);
  f.player.destroy();
});
test('pending play can be cancelled and detached controls cannot change playback', async () => {
  const f = fixture(); let reject;
  f.video.play = () => new Promise((_, r) => { reject = r; });
  const play = f.control('play'); play.click(); play.click();
  assert.equal(f.state.pauseCalls, 1); reject(new Error('cancelled')); await tick();
  assert.equal(f.el.querySelector('[role="status"]').hidden, true);
  play.click(); f.player.destroy(); reject(new Error('after destroy')); await tick();
  const before = f.state.pauseCalls; play.click(); assert.equal(f.state.pauseCalls, before);
  assert.equal(f.el.querySelector('[role="status"]'), null);
});
test('media failure offers retry and clears when a new source loads', () => {
  const f = fixture(); f.state.error = { code: 4 }; f.fire('error');
  assert.equal(f.control('seek').disabled, true); assert.equal(f.control('retry').hidden, false);
  f.control('retry').click(); assert.equal(f.state.loadCalls, 1); assert.equal(f.state.playCalls, 1);
  f.fire('canplay'); assert.equal(f.el.querySelector('[role="status"]').hidden, true); f.player.destroy();
});
test('DIY image accepts safe URL as image href and rejects script schemes/markup; motion and color isolated', () => {
  const f = fixture(); f.player.setTheme({ avatar: '/avatar.svg', accent: '#555', motion: false });
  const image = f.el.querySelector('.vido-companion image');
  assert.equal(image.getAttribute('href'), 'https://example.test/avatar.svg');
  assert.equal(f.el.dataset.vidoMotion, 'false');
  f.player.setTheme({ avatar: 'javascript:alert(1)' });
  assert.equal(image.getAttribute('href'), ''); assert.equal(f.el.querySelector('script'), null);
  f.player.setTheme({ avatar: false }); assert.equal(f.el.classList.contains('vido-has-avatar'), false);
  f.player.destroy(); assert.equal(f.el.getAttribute('style'), null);
});
test('autoplay always starts muted and options do not discard supplied source nodes', () => {
  const f = fixture(); f.player.destroy();
  const player = new Vido({ el: f.el, video: f.video, autoplay: true, muted: false, tracks: [{ src: '/captions.vtt', srclang: 'en', label: 'English' }] });
  assert.equal(f.video.autoplay, true); assert.equal(f.video.muted, true);
  assert.equal(f.video.querySelectorAll('source').length, 1); assert.equal(f.video.querySelectorAll('track').length, 1);
  player.destroy(); assert.equal(f.video.querySelectorAll('track').length, 0);
});
test('shortcuts scoped to player surface leave input and page interactions alone', () => {
  const f = fixture(); f.state.duration = 100; f.state.currentTime = 20; f.fire('loadedmetadata');
  f.el.dispatchEvent(new f.dom.window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
  assert.equal(f.state.currentTime, 25);
  f.control('seek').dispatchEvent(new f.dom.window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  assert.equal(f.state.currentTime, 25);
  f.dom.window.document.dispatchEvent(new f.dom.window.KeyboardEvent('keydown', { key: ' ', bubbles: true }));
  assert.equal(f.state.playCalls, 0); f.player.destroy();
});
test('the same video cannot be mounted in two different containers', () => {
  const f = fixture(), other = f.dom.window.document.createElement('div');
  assert.throws(() => new Vido({ el: other, video: f.video }), /video already has a player/);
  f.player.destroy();
});
test('a pending fullscreen entry resolves safely after destroy', async () => {
  const f = fixture(); f.player.destroy(); let complete, exits = 0;
  f.el.requestFullscreen = () => new Promise(resolve => { complete = () => { Object.defineProperty(f.dom.window.document, 'fullscreenElement', { configurable: true, value: f.el }); resolve(); }; });
  f.dom.window.document.exitFullscreen = () => { exits++; Object.defineProperty(f.dom.window.document, 'fullscreenElement', { configurable: true, value: null }); return Promise.resolve(); };
  const player = new Vido({ el: f.el, video: f.video });
  f.el.querySelector('[data-vido-control="fullscreen"]').click();
  player.destroy(); complete(); await tick(); assert.equal(exits, 1);
});
test('destroy closes this video picture-in-picture, leaving other videos alone', () => {
  const f = fixture(); let exits = 0;
  Object.defineProperty(f.dom.window.document, 'pictureInPictureElement', { configurable: true, value: f.video });
  f.dom.window.document.exitPictureInPicture = () => { exits++; return Promise.resolve(); };
  f.player.destroy(); assert.equal(exits, 1);
});
test('late enhancement of an already-failed native video immediately exposes error and retry', () => {
  const f = fixture({ initialError: { code: 4 } });
  assert.equal(f.el.querySelector('[role="status"]').hidden, false);
  assert.match(f.el.querySelector('[role="status"]').textContent, /video could not load/);
  assert.equal(f.control('retry').hidden, false);
  assert.equal(f.control('seek').disabled, true);
  f.control('retry').click();
  assert.equal(f.state.loadCalls, 1); assert.equal(f.state.playCalls, 1);
  f.fire('canplay'); assert.equal(f.el.querySelector('[role="status"]').hidden, true);
  f.player.destroy();
});
test('source replacement clears stale artwork and offers recovery for a failed replacement', () => {
  const f = fixture(); assert.equal(f.video.getAttribute('poster'), 'old.jpg');
  f.player.setSource('broken.mp4'); assert.equal(f.video.hasAttribute('poster'), false);
  f.state.error = { code: 4 }; f.fire('error');
  assert.equal(f.control('retry').hidden, false);
  f.control('retry').click(); assert.equal(f.state.loadCalls, 2); assert.equal(f.state.playCalls, 1);
  f.player.setSource('good.mp4', 'good.jpg'); assert.equal(f.video.getAttribute('poster'), 'good.jpg');
  f.state.duration = 42; f.fire('loadedmetadata'); f.fire('canplay');
  assert.equal(f.control('seek').disabled, false); assert.equal(f.el.querySelector('[role="status"]').hidden, true);
  f.player.src = 'third.mp4'; assert.equal(f.video.hasAttribute('poster'), false);
  f.player.destroy();
});
