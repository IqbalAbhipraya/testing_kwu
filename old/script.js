/* TORIKON site logic: menu, order buttons, order tracker, bilingual support */
/* ---- Edit these values, then you are done ---- */
const CONFIG = {
  formUrl: 'https://forms.gle/mZKQudvXEUE7D7Ty5',   // your Google Form link
  trackerUrl: 'https://script.google.com/macros/s/AKfycbw11jg4D_8gfogGQhviVET-Hom6LAlDvUIg_pEEfklQ4zQFuYeKQ2GQ16y0f9zCRF_jtA/exec', // Apps Script web app (ends in /exec); empty = demo data
  instagram: 'https://instagram.com/torisnacks.tup', // optional, shown in the footer
  circle: '#D5E1F5', // color of the circle behind the hero logo, e.g. '#FFE9B8'. Use 'none' to remove the circle
  photo: '',       // optional: a real photo of your chicken, e.g. 'chicken.jpg' in this folder (replaces the logo in the hero circle)
  menu: [
    {name:'Original', kind:'orig', sym:'nugget',    tag:'Classic', pic:'gold', desc:'The classic. Crispy outside, juicy inside.', price:''},
    {name:'Spicy',    kind:'hot',  sym:'nuggetHot', tag:'Hot',     pic:'red',  desc:'The same crunch with a spicy kick.',        price:''}
  ]
};

const $ = s => document.querySelector(s);
function el(tag, cls, text){ const e=document.createElement(tag); if(cls) e.className=cls; if(text!=null) e.textContent=text; return e; }
const SVGNS='http://www.w3.org/2000/svg';
function sym(id, vb, cls){ const s=document.createElementNS(SVGNS,'svg'); s.setAttribute('viewBox',vb); if(cls) s.setAttribute('class',cls); s.setAttribute('aria-hidden','true'); const u=document.createElementNS(SVGNS,'use'); u.setAttribute('href','#'+id); s.append(u); return s; }

/* Language State (Default: Indonesian 'id') */
let currentLang = localStorage.getItem('torikon_lang') || 'id';

function getT() {
  if (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[currentLang]) {
    return TRANSLATIONS[currentLang];
  }
  return (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS.id) ? TRANSLATIONS.id : {};
}

/* menu cards */
function renderMenu() {
  const t = getT();
  const grid = $('#menuGrid');
  if (!grid) return;
  grid.replaceChildren();

  const mi = (t && t.menuItems) || {};

  CONFIG.menu.forEach(m => {
    const itemTrans = mi[m.kind] || {};
    const name = itemTrans.name || m.name;
    const tag = itemTrans.tag || m.tag;
    const desc = itemTrans.desc || m.desc;
    const orderBtnText = itemTrans.orderBtn || (currentLang === 'id' ? 'Pesan Varian Ini' : 'Order this');

    const c = el('article', 'item ' + m.kind), pic = el('div', 'pic ' + m.pic);
    pic.append(el('span', 'tag', tag), sym(m.sym, '0 0 200 160', 'big'));
    const f = el('div', 'foot');
    if (m.price) f.append(el('span', 'price', m.price));
    const b = el('a', 'btn btn-gold btn-sm order-link', orderBtnText);
    b.href = '#order';
    f.append(b);
    c.append(pic, el('h3', '', name), el('p', 'd', desc), f);
    grid.append(c);
  });

  const packTrans = mi.pack || {};
  const packTag = packTrans.tag || (currentLang === 'id' ? 'Kemasan' : 'The pack');
  const packName = packTrans.name || (currentLang === 'id' ? 'Kemasan Sobek Praktis' : 'Tear-to-open pack');
  const packDesc = packTrans.desc || (currentLang === 'id' ? 'Dikemas seperti versi aslinya di Jepang: sobek sepanjang garis dan langsung nikmati kerenyahannya.' : 'Packaged like the Japanese original: tear along the line and the crunch is ready.');

  const packCard = el('article', 'item'), pic = el('div', 'pic sky');
  pic.append(el('span', 'tag', packTag), sym('pack', '0 0 220 250', 'big'));
  packCard.append(pic, el('h3', '', packName), el('p', 'd', packDesc));
  grid.append(packCard);

  wireOrderLinks();
}

/* optional real photo */
if(CONFIG.photo){ const im=el('img','photo'); im.src=CONFIG.photo; im.alt='Torikon fried chicken'; $('#disc').replaceChildren(im); }
if(CONFIG.circle==='none') $('#disc').classList.add('none'); else $('#disc').style.setProperty('--disc',CONFIG.circle);

/* order buttons */
let toastTimer;
function toast(t){ let x=$('.toast'); if(!x){x=el('div','toast');x.setAttribute('role','status');document.body.append(x);} x.textContent=t; x.hidden=false; clearTimeout(toastTimer); toastTimer=setTimeout(()=>{x.hidden=true},4000); }
function wireOrderLinks(){
  document.querySelectorAll('.order-link').forEach(a=>{
    if(CONFIG.formUrl){ a.href=CONFIG.formUrl; a.target='_blank'; a.rel='noopener'; }
    else a.addEventListener('click',e=>{
      e.preventDefault();
      const t = getT();
      toast((t.tracker && t.tracker.toastNoForm) || 'Add your Google Form link to CONFIG.formUrl');
    });
  });
}
if(CONFIG.instagram){ $('#igLink').href=CONFIG.instagram; $('#ig').hidden=false; }

/* tracker */
const STATUS = {
  onmake: { key: 'onmake', cls: 'st-make', step: 0 },
  done: { key: 'done', cls: 'st-done', step: 1 },
  readytodeliver: { key: 'readytodeliver', cls: 'st-ready', step: 2 },
  delivered: { key: 'delivered', cls: 'st-delivered', step: 3 },
  canceled: { key: 'canceled', cls: 'st-canceled', step: -1 }
};

const DEMO = [
  {timestamp:'2026-10-19T12:30:10',name:'Sample Customer',phone:'081234567890',items:'Original (2x)',status:'On-Make'},
  {timestamp:'2026-10-18T18:15:00',name:'Sample Customer',phone:'081234567890',items:'Spicy (1x)',status:'Done'},
  {timestamp:'2026-10-17T13:05:00',name:'Sample Customer',phone:'081234567890',items:'Spicy (2x), Original (1x)',status:'Ready to Deliver'},
  {timestamp:'2026-10-15T19:20:00',name:'Sample Customer',phone:'081234567890',items:'Original (1x)',status:'Delivered'},
  {timestamp:'2026-10-12T14:10:00',name:'Sample Customer',phone:'081234567890',items:'Original (1x)',status:'Canceled'}
];

function statusOf(raw){
  const k = String(raw || '').trim().toLowerCase();
  if (/cancel|batal/.test(k)) return STATUS.canceled;
  if (/delivered|terkirim|diambil/.test(k)) return STATUS.delivered;
  if (/ready|siap/.test(k)) return STATUS.readytodeliver;
  if (/^done$|done|matang|selesai masak/.test(k)) return STATUS.done;
  if (/make|goreng|proses|masak|received|terima/.test(k)) return STATUS.onmake;
  if (/selesai/.test(k)) return STATUS.delivered;
  return null;
}
function norm(p){ let d=String(p||'').replace(/\D/g,''); if(d.startsWith('62')) d='0'+d.slice(2); else if(d.startsWith('8')) d='0'+d; return d; }
function when(ts){ if(/^\d{4}-\d{2}-\d{2}T/.test(ts)){ const d=new Date(ts); if(!isNaN(d)) return d; } return null; }
function fmt(ts){ const d=when(ts); return d? d.toLocaleString('id-ID',{day:'numeric',month:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'}) : String(ts||''); }
const out=$('#out');
function say(title, body){ out.replaceChildren(); const m=el('div','msg'); m.append(el('b','',title)); if(body){ m.append(el('br'), document.createTextNode(body)); } out.append(m); }

function getStatusLabel(s, raw) {
  const t = getT();
  if (!s) return raw || t.stUnk || 'Received';
  if (s.key === 'onmake') return t.stMake || 'On-Make';
  if (s.key === 'done') return t.stDone || 'Done';
  if (s.key === 'readytodeliver') return t.stReady || 'Ready to Deliver';
  if (s.key === 'delivered') return t.stDelivered || 'Delivered';
  if (s.key === 'canceled') return t.stCanceled || 'Canceled';
  return s.label || raw;
}

let lastOrders = null;

function render(orders){
  lastOrders = orders;
  const t = getT();
  const tr = t.tracker || {};

  if(!orders.length){
    say(tr.notFound || 'Pesanan tidak ditemukan', tr.notFoundDesc || 'Pastikan nomor WhatsApp Anda sesuai.');
    return;
  }
  orders.sort((a,b)=>(when(b.timestamp)||0)-(when(a.timestamp)||0));
  out.replaceChildren();

  const who=el('div','card who');
  who.append(
    el('strong','',(tr.customer || 'Pelanggan: ') + (orders[0].name||'-')),
    el('span','', tr.foundCount ? tr.foundCount(orders.length) : ('Ditemukan ' + orders.length + ' pesanan'))
  );
  out.append(who);

  const stepsList = tr.steps || ['Sedang Dibuat', 'Selesai Dimasak', 'Siap Diantar', 'Sudah Diterima'];

  orders.forEach(o=>{
    const s=statusOf(o.status);
    const c=el('div','card'), top=el('div','o-top');
    top.append(
      el('span','o-date',fmt(o.timestamp)),
      el('span','st '+(s?s.cls:'st-unk'), getStatusLabel(s, o.status))
    );
    const item=el('div','o-item');
    item.append(el('b','', tr.item || 'Menu: '), document.createTextNode(o.items||'-'));
    c.append(top,item);

    if (s && s.key === 'canceled') {
      const cancelBox = el('div', 'cancel-notice');
      cancelBox.append(document.createTextNode(tr.canceledMsg || 'Pesanan ini telah dibatalkan.'));
      c.append(cancelBox);
    } else if (s && s.step >= 0) {
      const p = el('div', 'prog');
      stepsList.forEach((n,i)=>{
        const d=el('div',i<=s.step?'on':'');
        const dot=el('span','dot');
        if(i===s.step) dot.append(sym('nugget','0 0 200 160'));
        d.append(dot, document.createTextNode(n));
        p.append(d);
      });
      c.append(p);
    }
    out.append(c);
  });
}

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function lookup(raw){
  const t = getT();
  const tr = t.tracker || {};
  const n=norm(raw);
  if(n.length<9){
    say(tr.promptNum || 'Masukkan nomor WhatsApp kamu', tr.promptDesc || 'Gunakan nomor WhatsApp yang sama dengan formulir pesanan.');
    return;
  }
  say(tr.checking || 'Memeriksa status pesanan...');
  try{
    let orders;
    if(CONFIG.trackerUrl){
      const url=CONFIG.trackerUrl+(CONFIG.trackerUrl.includes('?')?'&':'?')+'phoneNo='+encodeURIComponent(n)+'&phone='+encodeURIComponent(n);
      const r=await fetch(url,{redirect:'follow'}); if(!r.ok) throw new Error('bad');
      const data=await r.json();
      if(data.status==='not_found') orders=[];
      else if(Array.isArray(data.orders)) orders=data.orders.map(o=>({timestamp:o.timestamp,name:o.name||data.customerName,items:o.items||o.menu,status:o.status||o.orderStatus}));
      else throw new Error('bad');
    } else {
      await sleep(350);
      orders=DEMO.filter(o=>norm(o.phone)===n).map(o=>({...o}));
    }
    render(orders);
  }catch(e){
    say(tr.errorTitle || 'Gagal memuat pesananmu', tr.errorDesc || 'Silakan coba beberapa saat lagi.');
  }
}

$('#trackForm').addEventListener('submit',e=>{ e.preventDefault(); lookup($('#phone').value); });
if(!CONFIG.trackerUrl){
  $('#demoTag').hidden=false; $('#demoHint').hidden=false;
  $('#fill').addEventListener('click',()=>{ $('#phone').value='081234567890'; lookup('081234567890'); });
}

/* Apply Language */
function applyTranslations(lang) {
  currentLang = lang;
  localStorage.setItem('torikon_lang', lang);
  document.documentElement.lang = lang;
  const t = getT();
  if (!t) return;

  if (t.pageTitle) document.title = t.pageTitle;

  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      if (element.tagName === 'INPUT') {
        element.placeholder = t[key];
      } else if (t[key].includes('<mark>') || t[key].includes('<svg')) {
        element.innerHTML = t[key];
      } else {
        element.textContent = t[key];
      }
    }
  });

  const seal = document.getElementById('sealText');
  if (seal && t.badgeText) {
    seal.textContent = t.badgeText;
  }

  const langBtn = document.getElementById('langToggle');
  if (langBtn) {
    langBtn.textContent = t.langBtn;
    langBtn.setAttribute('aria-label', t.langAria || 'Switch Language');
  }

  renderMenu();
  if (lastOrders) {
    render(lastOrders);
  }
}

const langToggleBtn = document.getElementById('langToggle');
if (langToggleBtn) {
  langToggleBtn.addEventListener('click', () => {
    const nextLang = currentLang === 'id' ? 'en' : 'id';
    applyTranslations(nextLang);
  });
}

/* Initialize Default Language */
applyTranslations(currentLang);