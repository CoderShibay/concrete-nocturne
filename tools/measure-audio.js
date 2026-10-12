// Measures how loud each sound layer is in a district, in dB (RMS), so levels can be set against the music.
// Usage: node tools/measure-audio.js [zone ...]      e.g. node tools/measure-audio.js port density soon
// It serves a patched copy of concrete-nocturne.html (the source file is not changed): the copy starts the drive
// in the named zone and exposes the radio object. It reads each layer for 3 seconds, 9 seconds after the start.
// Three layers need more than this table: the wind swells over 11 seconds and this window falls in its trough (its top
// is about 6 dB louder than shown); a clank is a short hit, so read its peak, not its RMS; and the office hum is only
// heard beside a lit building, which the start position is not.
const { chromium } = require('/Users/alisyed/.npm/_npx/86170c4cd1c5da32/node_modules/playwright-core');
const http = require('http'), fs = require('fs'), path = require('path');
const zones = process.argv.slice(2).length ? process.argv.slice(2) : ['corridor', 'port', 'density', 'soon', 'newtown', 'office', 'field'];
let src = fs.readFileSync(path.join(__dirname, '..', 'concrete-nocturne.html'), 'utf8');
const patch = (a, b) => { if (!src.includes(a)) throw new Error('patch point not found: ' + a); src = src.replace(a, b); };
patch('if (!cur) pick = ZONES[0];', 'if (!cur) pick = window.__zone || ZONES[0];');
patch('const radio = {', 'const radio = window.__radio = {');
const page = '<!doctype html><html><head><meta charset="utf-8"></head><body>' + src + '</body></html>';
const srv = http.createServer((q, r) => { r.setHeader('content-type', 'text/html'); r.end(page); }).listen(8947);
(async () => {
  const b = await chromium.launch({ executablePath: process.env.HOME + '/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  console.log('zone       music   rain   port    tv     ac   wind    hum  clank master');
  for (const zone of zones) {
    const p = await b.newPage({ viewport: { width: 900, height: 600 } });
    await p.addInitScript(z => { window.__zone = z; }, zone);
    await p.goto('http://localhost:8947/'); await p.waitForTimeout(3000);
    await p.click('#go'); await p.waitForTimeout(9000);
    const res = await p.evaluate(async () => {
      const r = window.__radio, ctx = r.ctx; if (!ctx) return null;
      const nodes = { music: r.duck, rain: r.rainDuck, port: r.portG, tv: r.densG, ac: r.acG, wind: r.windG, hum: r.humG, clank: r.clankG, master: r.master };
      const taps = {}; for (const k in nodes) if (nodes[k]) { const a = ctx.createAnalyser(); a.fftSize = 2048; nodes[k].connect(a); taps[k] = a; }
      const sum = {}; for (const k in taps) sum[k] = 0;
      const buf = new Float32Array(2048), N = 60;
      for (let i = 0; i < N; i++) {
        await new Promise(ok => setTimeout(ok, 50));
        for (const k in taps) { taps[k].getFloatTimeDomainData(buf); let s = 0; for (const v of buf) s += v * v; sum[k] += s / buf.length; }
      }
      const out = {}; for (const k in nodes) out[k] = taps[k] ? Math.round(200 * Math.log10(Math.sqrt(sum[k] / N) + 1e-9)) / 10 : null;
      return out;
    });
    const f = v => (v === null ? '   n/a' : v < -120 ? ' silent' : String(v).padStart(6)) + ' ';
    console.log(zone.padEnd(9), res ? ['music', 'rain', 'port', 'tv', 'ac', 'wind', 'hum', 'clank', 'master'].map(k => f(res[k])).join('') : 'no audio context');
    await p.close();
  }
  await b.close(); srv.close();
})();
