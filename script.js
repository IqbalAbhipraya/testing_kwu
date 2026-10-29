/* TORIKON site logic (v5 design): language, set pieces, ticket machine, order buttons, order tracker */
/* ---- Edit these values, then you are done ---- */
const CONFIG = {
  formUrl: 'https://forms.gle/k4NFjgcwinRq7EYQ7',   // your Google Form link
  trackerUrl: 'https://script.google.com/macros/s/AKfycbxc6lK4AfQYpckRbE0k8rh7K2jmon-MPOKoSNuD2yWnnHrQBF0i8_4AjAVSLng7D5Kp/exec', // Apps Script web app (ends in /exec); empty = demo data
  instagram: 'https://instagram.com/toorikon', // optional, shown in the footer
  pickupTime: '10.30 WIB' // pickup time on Friday, e.g. '16.00 - 18.00 WIB'. Shown everywhere the time appears
};

/* ---- Copy: Bahasa Indonesia is the default, English is the alternative ---- */
const I18N = {
  id: {
    title: 'Torikon: ayam krispi ala konbini, pre-order Sabtu–Rabu',
    skip: 'Langsung ke konten', homeLabel: 'Torikon, ke atas halaman', navLabel: 'Navigasi utama', langLabel: 'Bahasa',
    navMenu: 'Menu', navHow: 'Cara pesan', navTrack: 'Lacak pesanan',
    openPill: 'Pre-order dibuka', heroL2: 'Baru digoreng,', heroL3: 'untukmu.',
    heroLede: 'Ayam krispi ala konbini, yang biasa kamu ambil hangat dari etalase. Dibuat sendiri oleh anak Telkom University, Bandung.',
    ctaPreorder: 'Pesan sekarang →', ctaMenu: 'Lihat menu',
    schedOrder: 'Pre-order', schedOrderVal: 'Sabtu–Rabu', schedPickup: 'Ambil', schedPlace: 'Tempat',
    friday: 'Jumat', place: 'Parkiran GKU',
    heroHint: 'Gerakkan mouse di sekitar tas', stampSub: 'untuk pre-order',
    ticker: ['Agetate', 'Baru digoreng', 'Pre-order dibuka', 'Tori-Chiki Original', 'Spicy Chiki', 'Renyah di luar, bahagia di dalam', 'Itadakimasu'],
    menuTitle: 'Camilan hangat kami', menuLede: 'Langsung dari etalase hangat ke tanganmu. Pilih rasamu.',
    dragHint: 'Geser etalase untuk memutarnya',
    origDesc: 'Lapisan keemasan yang kriuk, juicy di dalam, bumbunya pas. Gurih dan sederhana.',
    spicyDesc: 'Gigitan juicy yang sama, dengan lapisan merah yang pedasnya pelan-pelan naik. Siapkan minum.',
    tagMild: 'Tidak pedas', tagHot: 'Pedas',
    orderOrig: 'Pesan Original →', orderSpicy: 'Pesan Spicy →',
    howKicker: 'ala mesin tiket', howTitle: 'Cara pre-order',
    howLede: 'Tekan tombol di mesin. Tiketmu tercetak tepat di sebelahnya, jadi kamu bisa baca tiap langkah tanpa scroll.',
    closesLabel: 'Pre-order tutup:', closesVal: 'Rabu', pickupLabel: 'Ambil:', keepWord: 'SIMPAN',
    openForm: 'Buka formulir pre-order →', ledHow: 'CARA PRE-ORDER!', keysLabel: 'Langkah cara pre-order',
    stepWord: 'LANGKAH', stepOf: 'LANGKAH {n} DARI {total}',
    steps: [
      { title: 'Isi formulir', text: 'Tekan Pre-order, lalu isi nama, nomor WhatsApp, menu dan jumlahnya.', link: 'form' },
      { title: 'Bayar setelah dikonfirmasi', text: 'Kami cek pesananmu dulu. Setelah dikonfirmasi, baru kamu bayar.' },
      { title: 'Ambil hari Jumat', text: 'Jumat, {time}, di Parkiran GKU.' },
      { title: 'Lacak pesanan', text: 'Cek status pesananmu di bawah pakai nomor WhatsApp-mu.', link: 'track' }
    ],
    toForm: 'Buka formulir →', toTrack: 'Ke pelacak ↓',
    trackKicker: 'ayamku di mana?', trackTitle: 'Lacak pesananmu',
    trackLede: 'Ketik nomor WhatsApp yang kamu pakai di formulir, tekan tombol merah besar, dan slip pesananmu tercetak di bawah.',
    phoneLabel: 'NOMOR WHATSAPP', phoneHint: '08xx, 628xx atau +628xx, semua bisa.',
    ready: 'SIAP ▌', printing: 'MENCETAK… ▌', printingSlip: 'Slip pesananmu lagi dicetak…',
    demoBtn: 'Belum pesan? Coba nomor demo', trackBtn: 'LACAK', trackBtnSub: 'cetak',
    slipHead: 'TORIKON ORDER SLIP · +62 {phone}', thanks: '*** TERIMA KASIH · ITADAKIMASU ***', again: 'Lacak nomor lain',
    hungry: 'Lapar belum?', footLede: 'Amankan porsimu di batch ini sebelum penggorengannya penuh. Renyah di luar, bahagia di dalam.',
    madeWith: 'Dibuat dengan cinta di Telkom University, Bandung', newTabSr: ' (tab baru)', newTab: '(tab baru)',
    toastNoForm: 'Tambahkan link Google Form di CONFIG.formUrl supaya tombol ini aktif.',
    shortTitle: 'Nomornya kurang panjang', shortBody: 'Masukkan nomor WhatsApp lengkap yang kamu pakai di formulir, misalnya 081234567890.',
    notFoundTitle: 'Belum ada pesanan dengan nomor ini', notFoundBody: 'Pastikan nomornya sama dengan yang di formulir. Baru pesan? Tunggu beberapa menit lalu cek lagi.',
    errorTitle: 'Data pesanan belum bisa dimuat', errorBody: 'Sistem kami lagi ada kendala. Coba lagi sebentar lagi, atau tanya kami lewat Instagram.',
    offlineTitle: 'Tidak bisa terhubung', offlineBody: 'Cek koneksi internetmu, lalu tekan LACAK lagi.',
    hello: 'Halo, {name}!', count1: '1 pesanan', countN: '{n} pesanan',
    ordersLabel: 'Daftar pesanan', progressLabel: 'Progres pesanan',
    noteReceived: 'Pesananmu sudah masuk. Tunggu konfirmasi dari kami, ya.',
    noteMake: 'Ayammu lagi digoreng sekarang.',
    noteReady: 'Pesananmu sudah siap. Ayo ambil di Parkiran GKU!',
    noteDone: 'Sudah diambil. Selamat menikmati!',
    stepDone: 'selesai', stepNow: 'sekarang'
  },
  en: {
    title: 'Torikon: konbini-style crispy chicken, pre-order Saturday to Wednesday',
    skip: 'Skip to content', homeLabel: 'Torikon, back to top', navLabel: 'Main navigation', langLabel: 'Language',
    navMenu: 'Menu', navHow: 'How to order', navTrack: 'Track order',
    openPill: 'Pre-orders open', heroL2: 'Freshly fried,', heroL3: 'just for you.',
    heroLede: 'Konbini-style crispy chicken, the kind you grab hot from the counter. Homemade by Telkom University students in Bandung.',
    ctaPreorder: 'Pre-order now →', ctaMenu: 'See the menu',
    schedOrder: 'Pre-order', schedOrderVal: 'Sat–Wed', schedPickup: 'Pickup', schedPlace: 'Where',
    friday: 'Friday', place: 'Parkiran GKU (parking lot)',
    heroHint: 'Move your mouse around the bag', stampSub: 'for pre-order',
    ticker: ['Agetate', 'Freshly fried', 'Pre-orders open', 'Tori-Chiki Original', 'Spicy Chiki', 'Crispy outside, happy inside', 'Itadakimasu'],
    menuTitle: 'Our hot snacks', menuLede: 'Straight from our warmer to your hands. Pick your flavour.',
    dragHint: 'Drag the warmer to turn it',
    origDesc: 'Crackly golden coat, juicy inside, seasoned just right. Savory and simple.',
    spicyDesc: 'The same juicy bite with a fiery red coat that builds slowly. Keep a drink close.',
    tagMild: 'Not spicy', tagHot: 'Spicy',
    orderOrig: 'Pre-order Original →', orderSpicy: 'Pre-order Spicy →',
    howKicker: 'ticket machine style', howTitle: 'How to pre-order',
    howLede: 'Press a button on the machine. Your ticket prints right next to it, so you can read each step without scrolling.',
    closesLabel: 'Closes:', closesVal: 'Wednesday', pickupLabel: 'Pickup:', keepWord: 'KEEP',
    openForm: 'Open the pre-order form →', ledHow: 'HOW TO PRE-ORDER!', keysLabel: 'How to pre-order steps',
    stepWord: 'STEP', stepOf: 'STEP {n} OF {total}',
    steps: [
      { title: 'Fill the form', text: 'Tap Pre-order and add your name, WhatsApp number, menu and how many.', link: 'form' },
      { title: 'Pay after we confirm', text: 'We check your order first. Once it is confirmed, you pay.' },
      { title: 'Pick up on Friday', text: 'Friday, {time}, at Parkiran GKU (parking lot).' },
      { title: 'Track your order', text: 'Check your order below with your WhatsApp number.', link: 'track' }
    ],
    toForm: 'Open the form →', toTrack: 'Go to the tracker ↓',
    trackKicker: "where's my chicken?", trackTitle: 'Track your order',
    trackLede: 'Type the WhatsApp number you used on the pre-order form, hit the big red button, and your order slip prints right below.',
    phoneLabel: 'WHATSAPP NUMBER', phoneHint: '08xx, 628xx and +628xx all work.',
    ready: 'READY ▌', printing: 'PRINTING… ▌', printingSlip: 'Printing your order slip…',
    demoBtn: 'No order yet? Try a demo number', trackBtn: 'TRACK', trackBtnSub: 'print it',
    slipHead: 'TORIKON ORDER SLIP · +62 {phone}', thanks: '*** THANK YOU · ITADAKIMASU ***', again: 'Track another number',
    hungry: 'Hungry yet?', footLede: 'Grab a spot in this batch before the fryer fills up. Crispy outside, happy inside.',
    madeWith: 'Made with love at Telkom University, Bandung', newTabSr: ' (opens in a new tab)', newTab: '(opens in a new tab)',
    toastNoForm: 'Add your Google Form link to CONFIG.formUrl to turn this button on.',
    shortTitle: 'That number looks too short', shortBody: 'Enter the full WhatsApp number you used on the form, for example 081234567890.',
    notFoundTitle: 'No orders for this number yet', notFoundBody: 'Make sure it matches the number on your form. Just ordered? Give us a few minutes, then check again.',
    errorTitle: 'We could not load your orders', errorBody: 'Something is wrong on our side. Try again in a bit, or message us on Instagram.',
    offlineTitle: 'Could not connect', offlineBody: 'Check your internet connection, then press TRACK again.',
    hello: 'Hi, {name}!', count1: '1 order', countN: '{n} orders',
    ordersLabel: 'Your orders', progressLabel: 'Order progress',
    noteReceived: 'We got your order. Hang tight for our confirmation.',
    noteMake: 'Your chicken is in the fryer right now.',
    noteReady: 'Your order is ready. Come pick it up at Parkiran GKU!',
    noteDone: 'Picked up. Enjoy your meal!',
    stepDone: 'done', stepNow: 'now'
  }
};

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
function el(tag, cls, text){ const e=document.createElement(tag); if(cls) e.className=cls; if(text!=null) e.textContent=text; return e; }
const SVGNS='http://www.w3.org/2000/svg';
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));

/* ---------- language ---------- */
let lang='id';
try { const saved=localStorage.getItem('torikon-lang'); if(saved && I18N[saved]) lang=saved; } catch(e){}
function t(key, vars){ let s=(I18N[lang][key] ?? I18N.id[key] ?? key); if(vars && typeof s==='string') for(const k in vars) s=s.replace('{'+k+'}', vars[k]); return s; }
function applyLang(){
  document.documentElement.lang=lang;
  document.title=t('title');
  $$('[data-i18n]').forEach(n=>{ n.textContent=t(n.dataset.i18n); });
  $$('[data-i18n-label]').forEach(n=>{ n.setAttribute('aria-label', t(n.dataset.i18nLabel)); });
  $$('.lang__btn').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.lang===lang)));
  markNewTab();
  $$('.js-pickup-time').forEach(n=>{ n.textContent=CONFIG.pickupTime; });
  buildTicker(); buildKeys(); buildHungry();
  rerender();
}
$$('.lang__btn').forEach(b=>b.addEventListener('click',()=>{
  if(b.dataset.lang===lang) return;
  lang=b.dataset.lang; try { localStorage.setItem('torikon-lang', lang); } catch(e){}
  applyLang();
}));

/* ---------- ticker (LED board) ---------- */
function buildTicker(){
  const words=t('ticker'), box=$('#ticker'); box.replaceChildren();
  words.concat(words).forEach(w=>{ const s=el('span'); s.append(el('span',null,w), el('i',null,'✦')); box.append(s); });
}

/* ---------- warmer: pieces on the shelves ---------- */
(function fillWarmer(){
  const O=['assets/original-1.webp','assets/original-2.webp','assets/original-3.webp'], S=['assets/spicy-1.webp','assets/spicy-2.webp'];
  const tilt=['-14deg','8deg','-4deg','12deg','-10deg','5deg','-7deg','10deg'];
  const put=(id, list)=>{ const row=$(id); list.forEach(p=>{ const d=el('div','jp-piece'), pin=el('div','jp-pin'), im=el('img'); im.src=p.src; im.alt=''; im.draggable=false; im.style.transform='rotate('+p.rot+')'; pin.append(im); d.append(pin); row.append(d); }); };
  put('#origBack', tilt.map((r,n)=>({rot:r, src:O[(n+1)%3]})));
  put('#origFront', tilt.map((_,n)=>({rot:tilt[(n+3)%8], src:O[n%3]})));
  put('#spicyBack', [0,1,2,3,4].map(n=>({rot:tilt[(n+2)%8], src:S[n%2]})));
  put('#spicyFront', [0,1,2,3,4].map(n=>({rot:tilt[(n+5)%8], src:S[(n+1)%2]})));
})();

/* ---------- hero: the bag follows the pointer ---------- */
(function heroTilt(){
  const hero=$('.hero'), tiltEl=$('#heroTilt'); let tgt={x:0,y:0}, cur={x:0,y:0}, raf=null;
  const tick=()=>{
    cur.x+=(tgt.x-cur.x)*.09; cur.y+=(tgt.y-cur.y)*.09;
    tiltEl.style.transform='rotateX('+clamp(-8-cur.y*5,-13,-3).toFixed(2)+'deg) rotateY('+clamp(-20+cur.x*10,-30,-10).toFixed(2)+'deg)';
    raf=(Math.abs(tgt.x-cur.x)>.001||Math.abs(tgt.y-cur.y)>.001)?requestAnimationFrame(tick):null;
  };
  const run=()=>{ if(!raf) raf=requestAnimationFrame(tick); };
  hero.addEventListener('pointermove',e=>{
    if(e.pointerType==='touch' || reduced.matches) return;
    const r=hero.getBoundingClientRect();
    tgt={x:clamp(((e.clientX-r.left)/r.width-.5)*2,-1,1), y:clamp(((e.clientY-r.top)/r.height-.5)*2,-1,1)}; run();
  });
  hero.addEventListener('pointerleave',()=>{ tgt={x:0,y:0}; run(); });
})();

/* ---------- warmer: drag to turn ---------- */
(function warmerDrag(){
  const stage=$('#stage'), turn=$('#warmer'); let drag=null, ry=0, raf=null;
  stage.addEventListener('pointerdown',e=>{
    if(e.button!==undefined && e.button!==0) return;
    drag={x:e.clientX, ry}; try{ stage.setPointerCapture(e.pointerId); }catch(err){} stage.classList.add('jp-dragging');
  });
  stage.addEventListener('pointermove',e=>{
    if(!drag) return;
    ry=clamp(drag.ry+(e.clientX-drag.x)*.12,-20,20);
    if(!raf) raf=requestAnimationFrame(()=>{ raf=null; turn.style.transform='rotateX(10deg) rotateY('+ry.toFixed(2)+'deg)'; });
  });
  const end=()=>{ if(!drag) return; drag=null; stage.classList.remove('jp-dragging'); };
  stage.addEventListener('pointerup',end); stage.addEventListener('pointercancel',end);
})();

/* ---------- how to pre-order: ticket machine (v6) ---------- */
const PREORDER_URL = CONFIG.formUrl; // the Google Form link
const ICONS=[
  'M9 3h6v3H9z M7 4.5H5V21h14V4.5h-2 M8 11h8 M8 15h5',          // fill the form
  'M3 7h18v12H3z M3 11h18 M16 15h2',                             // pay after we confirm
  'M6 8h12l-1 13H7z M9 8V6a3 3 0 0 1 6 0v2',                     // pick up on Friday
  'M11 4a7 7 0 1 0 0 14a7 7 0 0 0 0-14z M20 20l-4-4'             // track
];
const howEl=$('#how'), keysEl=howEl.querySelector('[data-keys]'), outEl=howEl.querySelector('[data-out]');
const numEl=howEl.querySelector('[data-screen-num]'), titleEl=howEl.querySelector('[data-screen-title]');
let step=0;
function icon(d){ const s=document.createElementNS(SVGNS,'svg'); s.setAttribute('viewBox','0 0 24 24'); s.setAttribute('aria-hidden','true'); const p=document.createElementNS(SVGNS,'path'); p.setAttribute('d',d); s.append(p); return s; }

/* build the four keys (rebuilt on a language switch) */
function buildKeys(){
  keysEl.replaceChildren();
  t('steps').forEach((st,i)=>{
    const b=el('button','tkh-key'); b.type='button'; b.dataset.step=i; b.setAttribute('aria-pressed','false');
    const top=el('span','tkh-key-top'); top.append(el('span',null,t('stepWord')+' '+(i+1)), el('span','tkh-key-dot'));
    const body=el('span','tkh-key-body'), ic=el('span','tkh-key-icon'); ic.append(icon(ICONS[i]));
    body.append(ic, el('span','tkh-key-label',st.title));
    b.append(top, body);
    b.addEventListener('click',()=>select(i));
    keysEl.append(b);
  });
  select(step);
}

function ticket(st, i){
  const total=t('steps').length, tk=el('div','tkh-ticket'), main=el('div','tkh-ticket-main');
  const head=el('div','tkh-ticket-head'); head.append(el('span','tkh-ticket-brand','TORIKON'), el('span','tkh-ticket-step',t('stepOf',{n:i+1, total})));
  const body=el('div','tkh-ticket-body'); body.append(el('h3',null,st.title), el('p',null,st.text.replace('{time}',CONFIG.pickupTime)));
  if(st.link==='form'){ const a=el('a','order-link',t('toForm')); a.href=PREORDER_URL || '#how'; body.append(a); wireOrder(a); }
  if(st.link==='track'){ const a=el('a',null,t('toTrack')); a.href='#track'; body.append(a); }
  main.append(head, body);
  const tear=el('div','tkh-tear'); tear.setAttribute('aria-hidden','true');
  const stub=el('div','tkh-stub'); stub.setAttribute('aria-hidden','true');
  stub.append(el('span','tkh-stub-num','0'+(i+1)), el('span','tkh-stub-keep',t('keepWord')), el('span','tkh-stub-code'));
  tk.append(main, tear, stub);
  return tk;
}

function select(i){
  step=i;
  const steps=t('steps');
  keysEl.querySelectorAll('.tkh-key').forEach((k,n)=>k.setAttribute('aria-pressed', n===i?'true':'false'));
  numEl.textContent=(i+1)+'/'+steps.length;
  titleEl.textContent=steps[i].title;
  // replacing the element restarts the slide-out animation
  outEl.replaceChildren(ticket(steps[i], i));
  markNewTab();
}

/* ---------- footer: jumping letters ---------- */
function buildHungry(){
  const h=$('#hungry'); h.replaceChildren(); let n=0;
  // letters of one word stay together so a line never breaks inside a word
  t('hungry').split(' ').forEach((word,w)=>{
    const wrap=el('span','hungry__word'); wrap.setAttribute('aria-hidden','true');
    if(w) wrap.append(el('span','jp-jin',' '));
    [...word].forEach(ch=>{ const o=el('span','jp-jump'), i=el('span','jp-jin',ch); o.style.animationDelay=(n++*.08).toFixed(2)+'s'; o.append(i); wrap.append(o); });
    h.append(wrap);
  });
}

/* ---------- order buttons ---------- */
let toastTimer;
function toast(msg){ let x=$('.toast'); if(!x){x=el('div','toast');x.setAttribute('role','status');document.body.append(x);} x.textContent=msg; x.hidden=false; clearTimeout(toastTimer); toastTimer=setTimeout(()=>{x.hidden=true},4000); }
function wireOrder(a){
  if(a.dataset.wired) return; a.dataset.wired='1';
  if(CONFIG.formUrl){ a.href=CONFIG.formUrl; a.target='_blank'; a.rel='noopener'; }
  else a.addEventListener('click',e=>{ e.preventDefault(); toast(t('toastNoForm')); });
}
/* screen readers hear that order links open a new tab; re-added after each language switch */
function markNewTab(){
  if(!CONFIG.formUrl) return;
  $$('.order-link').forEach(a=>{ let s=a.querySelector('.sr'); if(!s){ s=el('span','sr'); a.append(s); } s.textContent=' '+t('newTab'); });
}
$$('.order-link').forEach(wireOrder);
if(CONFIG.instagram){ $('#igLink').href=CONFIG.instagram; } else { $('#igLink').removeAttribute('target'); }

/* ---------- tracker ---------- */
const STATUS = {
  received:{label:'Order Received',cls:'pill--received',note:'noteReceived',step:-1},
  onmake:{label:'On-Make',cls:'pill--make',note:'noteMake',step:0},
  readytopickup:{label:'Ready to Pick Up',cls:'pill--ready',note:'noteReady',step:1},
  complete:{label:'Complete',cls:'pill--done',note:'noteDone',step:2}
};
const STEPS=['On-Make','Ready to Pick Up','Complete'];
const DEMO = [
  {timestamp:'2026-10-12T19:20:10',name:'Sample Customer',phone:'081234567890',items:'Original',status:'On-Make'},
  {timestamp:'2026-10-05T21:51:24',name:'Sample Customer',phone:'081234567890',items:'Original, Spicy',status:'Complete'},
  {timestamp:'2026-10-14T10:02:00',name:'Sample Customer',phone:'081234567890',items:'Spicy',status:''},
  {timestamp:'2026-10-09T13:05:00',name:'Another Customer',phone:'089912345678',items:'Spicy',status:'Ready to Pick Up'}
];
/* Accepts 'On-Make', 'Ready to Pick Up', 'Complete' and also Indonesian / older labels from the sheet. Empty = Order Received */
function statusOf(raw){
  const k=String(raw||'').trim().toLowerCase();
  if(!k || /received|terima/.test(k)) return STATUS.received;
  if(/ready|siap/.test(k)) return STATUS.readytopickup;
  if(/complete|done|deliver|pick(ed)? ?up|selesai|diambil/.test(k)) return STATUS.complete;
  if(/make|goreng|proses|masak/.test(k)) return STATUS.onmake;
  return null;
}
function norm(p){ let d=String(p||'').replace(/\D/g,''); if(d.startsWith('62')) d='0'+d.slice(2); else if(d.startsWith('8')) d='0'+d; return d; }
function when(ts){ if(/^\d{4}-\d{2}-\d{2}T/.test(ts)){ const d=new Date(ts); if(!isNaN(d)) return d; } return null; }
function fmt(ts){ const d=when(ts); return d? d.toLocaleString(lang==='en'?'en-GB':'id-ID',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}) : String(ts||''); }
const out=$('#out'), statusLine=$('#printerStatus');
let last=null; // last result, so a language switch can re-render it without replaying the print

function setStatus(kind, key){
  statusLine.replaceChildren();
  if(kind==='err'){ const s=el('span','err','ERR · '+t(key+'Title')+'. '+t(key+'Body')); statusLine.append(s); }
  else statusLine.append(el('span','jp-neon',t(kind==='busy'?'printing':'ready')));
}
function show(state, animate=true){ last=state; draw(animate); }
function rerender(){ if(last) draw(false); else setStatus('ready'); }
function draw(animate){
  if(last.kind==='busy'){ setStatus('busy'); out.replaceChildren(); const b=el('div','loading'), im=el('img'); im.src='assets/original-3.webp'; im.alt=''; im.className='jp-floatz'; b.append(im, el('span',null,t('printingSlip'))); out.append(b); }
  else if(last.kind==='msg'){ setStatus('err', last.key); out.replaceChildren(); }
  else { setStatus('ready'); render(last, animate); }
}

function render(st, animate){
  const orders=st.orders.slice().sort((a,b)=>(when(b.timestamp)||0)-(when(a.timestamp)||0));
  out.replaceChildren();
  const slip=el('div','slip'+(animate && !reduced.matches?' jp-receipt':'')); slip.id='jp-result';
  const shown=st.phone.replace(/^0/,'').replace(/(\d{3})(\d{4})(\d*)/,'$1 $2 $3').trim();
  const who=el('div','slip__who'); who.append(el('h3',null,t('hello',{name:st.name||'-'})), el('p',null, st.total===1?t('count1'):t('countN',{n:st.total})));
  const list=el('div'); list.setAttribute('role','list'); list.setAttribute('aria-label',t('ordersLabel'));
  orders.forEach((o,i)=>{
    const s=statusOf(o.status);
    const art=el('article','order'+(animate?' jp-order':'')); art.setAttribute('role','listitem'); art.style.animationDelay=(.5+i*.25)+'s';
    const top=el('div','order__top'); top.append(el('span','order__date',fmt(o.timestamp)), el('span','pill '+(s?s.cls:'pill--received'), s?s.label:o.status));
    art.append(top, el('div','order__items',o.items||'-'));
    if(s){ art.append(el('div','order__msg',t(s.note)), stages(s.step, animate)); }
    list.append(art);
  });
  const thanks=el('div','slip__thanks',t('thanks'));
  const again=el('div','slip__again'), btn=el('button','jp-btn btn btn--plain',t('again')); btn.type='button';
  btn.addEventListener('click',()=>{ last=null; out.replaceChildren(); setStatus('ready'); const i=$('#phone'); i.value=''; i.focus(); });
  again.append(btn);
  slip.append(el('div','slip__head',t('slipHead',{phone:shown})), who, list, thanks, again);
  out.append(slip);
  if(animate) setTimeout(()=>slip.scrollIntoView({behavior:reduced.matches?'auto':'smooth', block:'start'}),150);
}

/* three stops; the chicken rides to the current one (parked at the start when just received) */
function stages(step, animate){
  const p=step<0?0:step*50, box=el('div','stages');
  const tr=el('div','stages__track'); tr.setAttribute('aria-hidden','true');
  const bar=el('div','stages__bar'+(animate?' jp-bar':'')); bar.style.width=p+'%'; bar.setAttribute('aria-hidden','true');
  box.append(tr, bar);
  const ol=el('ol'); ol.setAttribute('aria-label',t('progressLabel'));
  STEPS.forEach((n,k)=>{
    const li=el('li','stage-pt'+(k<=step?' is-on':'')); li.style.left=(k*50)+'%';
    const dot=el('span','stage-pt__dot'); dot.setAttribute('aria-hidden','true');
    const lab=el('span','stage-pt__label',n);
    if(k<=step) lab.append(el('span','sr',' ('+(k===step?t('stepNow'):t('stepDone'))+')'));
    li.append(dot, lab); ol.append(li);
  });
  box.append(ol);
  const rider=el('div','rider'); rider.setAttribute('aria-hidden','true');
  const mv=el('div','rider__move'+(animate?' jp-rider':'')); mv.style.transform='translateX('+p+'%)';
  const im=el('img','jp-floatz'); im.src='assets/original-3.webp'; im.alt=''; im.draggable=false;
  mv.append(im); rider.append(mv); box.append(rider);
  return box;
}

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let busy=false;
async function lookup(raw){
  if(busy) return;
  const n=norm(raw), input=$('#phone');
  if(n.length<9){ show({kind:'msg',key:'short'}); input.setAttribute('aria-invalid','true'); input.focus(); return; }
  input.removeAttribute('aria-invalid');
  // aria-disabled instead of disabled, so keyboard focus stays on the button
  const btn=$('#trackForm button[type=submit]'); busy=true; btn.setAttribute('aria-disabled','true');
  show({kind:'busy'});
  try{
    let orders, name, total;
    if(CONFIG.trackerUrl){
      const url=CONFIG.trackerUrl+(CONFIG.trackerUrl.includes('?')?'&':'?')+'phoneNo='+encodeURIComponent(n)+'&phone='+encodeURIComponent(n);
      let r;
      try { r=await fetch(url,{redirect:'follow'}); } catch(e){ show({kind:'msg',key:'offline'}); return; }
      if(!r.ok) throw new Error('bad');
      const data=await r.json();
      if(data.status==='not_found') orders=[];
      else if(data.status==='error') throw new Error('bad');
      else if(Array.isArray(data.orders)){
        orders=data.orders.map(o=>({timestamp:o.timestamp,name:o.name||data.customerName,items:o.items||o.menu,status:o.status||o.orderStatus}));
        name=data.customerName; total=Number(data.totalOrders)||orders.length;
      }
      else throw new Error('bad');
    } else { await sleep(350); orders=DEMO.filter(o=>norm(o.phone)===n).map(o=>({...o})); }
    if(!orders.length){ show({kind:'msg',key:'notFound'}); return; }
    show({kind:'orders', phone:n, name:name||orders[0].name, total:total||orders.length, orders});
  }catch(e){ show({kind:'msg',key: navigator.onLine===false?'offline':'error'}); }
  finally{ busy=false; btn.removeAttribute('aria-disabled'); }
}
$('#trackForm').addEventListener('submit',e=>{ e.preventDefault(); lookup($('#phone').value); });
if(!CONFIG.trackerUrl){
  $('#fill').hidden=false;
  $('#fill').addEventListener('click',()=>{ $('#phone').value='81234567890'; lookup('81234567890'); });
}

applyLang();
