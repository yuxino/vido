import Vido from '../dist/vido.js';
const player = new Vido({ el: '#player', lang: 'en', muted: true, avatar: '../avatars/gavin-happy.png', colors: ['#aaa0e8', '#efb4c5', '#f0d6a3', '#b9cbef'] });
let avatarURL;
document.getElementById('avatar').addEventListener('change', event => {
  const file = event.target.files?.[0];
  if (!file || !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) return;
  if (avatarURL) URL.revokeObjectURL(avatarURL);
  avatarURL = URL.createObjectURL(file);
  player.setTheme({ avatar: avatarURL });
});
document.getElementById('motion').addEventListener('change', event => player.setTheme({ motion: event.target.checked }));
document.getElementById('reset').addEventListener('click', () => {
  player.setTheme({ avatar: false });
  if (avatarURL) URL.revokeObjectURL(avatarURL);
  avatarURL = undefined;
  document.getElementById('avatar').value = '';
});
window.addEventListener('pagehide', () => { player.destroy(); if (avatarURL) URL.revokeObjectURL(avatarURL); }, { once: true });
