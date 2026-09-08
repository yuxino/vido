import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
const banner = '/*! Vido 2.0.0 | MIT License */';
const shared = { entryPoints: ['src/vido.ts'], bundle: true, target: ['es2020'], banner: { js: banner } };
await Promise.all([
  build({ ...shared, format: 'esm', outfile: 'dist/vido.js' }),
  build({ ...shared, format: 'cjs', outfile: 'dist/vido.cjs' }),
  build({ ...shared, format: 'iife', globalName: 'VidoModule', minify: true, outfile: 'dist/vido.min.js', footer: { js: 'globalThis.vido = globalThis.Vido = VidoModule.default;' } }),
  build({ entryPoints: ['src/vido.css'], outfile: 'dist/vido.css', minify: true, banner: { css: banner } })
]);
await writeFile('dist/vido.min.css', await readFile('dist/vido.css'));
const bytes = gzipSync(await readFile('dist/vido.min.js')).length;
if (bytes > 15 * 1024) throw new Error(`Runtime gzip budget exceeded: ${bytes}`);
console.log(`Vido runtime: ${(bytes / 1024).toFixed(2)} KiB gzip; zero runtime dependencies.`);
