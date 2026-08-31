/* HCF 共用互動 hcf.js — 由各頁引用 */
(function(){
// ===== 共用元件注入：nav / 浮動層 / 頁尾 =====
var page=document.body.dataset.page||'';
var NAV='<div class="nav-in">\
<a class="nav-logo" href="index.html"><img src="assets/final-logo.png" alt="HCF"><span class="nlk"><b>HCF</b><em>COMBAT SYSTEM</em></span></a>\
<nav class="nav-links">\
<a href="index.html" data-p="home" data-en="HOME">首頁</a>\
<a href="news.html" data-p="news" data-en="EVENTS">最新活動</a>\
<a href="philosophy.html" data-p="phil" data-en="BRAND">品牌哲學</a>\
<div class="ndd"><a href="courses.html" data-p="courses" data-en="CLASS">課程介紹<i>▾</i></a><div class="ndd-m"><a href="courses.html" data-en="OVERVIEW">課程總覽</a><a href="group-classes.html" data-en="GROUP">團體課程</a><a href="private-training.html" data-en="PRIVATE">私人課程</a></div></div>\
<a href="schedule.html" data-p="sched" data-en="SCHEDULE">最新課表</a>\
<a href="team.html" data-p="team" data-en="COACHES">教練團隊</a>\
<a href="pricing.html" data-p="pricing" data-en="PRICING">課程方案</a><a href="partnership.html" data-p="partnership" data-en="CORPORATE">企業合作</a><a href="shop.html" data-p="shop" data-en="SHOP">商城</a>\
<a class="nav-cta" href="booking.html"><svg class="cta-bolt" viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path fill="currentColor" d="M13 2 3 14h7l-1 8 10-12h-7z"/></svg>立即預約</a>\
</nav>\
<button class="nav-burger" id="burger" aria-label="選單"><span></span><span></span><span></span></button>\
</div>\
<nav class="mnav" id="mnav">\
<a href="index.html" data-en="HOME">首頁</a><a href="news.html" data-en="EVENTS">最新活動</a><a href="philosophy.html" data-en="BRAND">品牌哲學</a>\
<button class="msub-t open" type="button" data-en="CLASS">課程介紹<i>＋</i></button><div class="msub msub-grid open"><a href="group-classes.html" data-en="GROUP">團體課程</a><a href="private-training.html" data-en="PRIVATE">私人課程</a><a href="muaythai.html" data-en="MUAY THAI">泰拳訓練</a><a href="kickboxing.html" data-en="KICKBOXING">踢拳訓練</a><a href="sanda.html" data-en="SANDA">散打訓練</a><a href="strength.html" data-en="S&amp;C">肌力體能</a></div><a href="team.html" data-en="COACHES">教練團隊</a><button class="msub-t open" type="button" data-en="PRICING">課程方案<i>＋</i></button><div class="msub msub-grid open"><a href="pricing.html" data-en="PRICING">價目表</a><a href="packages.html" data-en="BUNDLE">套組方案</a><a href="schedule.html" data-en="SCHEDULE">課表</a><a href="partnership.html" data-en="CORPORATE">企業合作</a></div><a href="survey.html" data-en="FAQ">新手問答</a><a href="shop.html" data-en="SHOP">商城</a><a href="https://www.fit-book.com.tw/hsinchucombat" target="_blank" rel="noopener" data-en="LOGIN">會員登入</a>\
<a class="cta" href="booking.html">立即預約 $400 體驗</a><div class="mnav-social"><a href="https://www.instagram.com/hc.combat2022/" target="_blank" rel="noopener" data-s="ig" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 2a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM17.5 6a1 1 0 110 2 1 1 0 010-2z"/></svg></a><a href="https://m.facebook.com/hsinchucombat/" target="_blank" rel="noopener" data-s="fb" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.6V3.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.7v3h2.4v8h3.4z"/></svg></a><a href="https://youtube.com/playlist?list=PLFtibVDr-YTBsPUoEfClpei2ttq1mGtKN" target="_blank" rel="noopener" data-s="yt" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 00-1.7-1.7C19.4 5.2 12 5.2 12 5.2s-7.4 0-8.9.4A2.5 2.5 0 001.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7c.2.9.9 1.5 1.7 1.7 1.5.4 8.9.4 8.9.4s7.4 0 8.9-.4a2.5 2.5 0 001.7-1.7c.4-1.5.4-4.7.4-4.7zM9.8 15.1V8.9l5.3 3.1-5.3 3.1z"/></svg></a><a href="https://lin.ee/7lidUv0" target="_blank" rel="noopener" data-s="line" aria-label="LINE"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.5c-5 0-9 3.2-9 7.2 0 3.5 3 6.5 7.2 7.1.3.05.6.15.7.35.06.2.04.5.02.7l-.12.75c-.03.2-.17.86.77.47s5.1-3 6.9-5.2c1.2-1.4 1.8-2.8 1.8-4.4 0-4-4-7.2-9.06-7.2z"/></svg></a></div></nav>';
var nav=document.getElementById('nav'); if(nav){nav.innerHTML=NAV;
  var on=nav.querySelector('[data-p="'+page+'"]'); if(on)on.classList.add('on');}

/* ===== 導覽強化：左側抽屜 + 桌面 hover 英文 ===== */
var NAVCSS=document.createElement('style');NAVCSS.id='hcf-nav-x';NAVCSS.textContent=
'@media(min-width:921px){'
+'.nav-links a[data-en]{position:relative}'
+'.nav-links a[data-en]::before{content:attr(data-en);position:absolute;left:50%;top:50%;transform:translate(-50%,calc(-50% + 6px));opacity:0;transition:opacity .22s,transform .22s;font-family:var(--en,Oswald,sans-serif);font-weight:700;letter-spacing:.12em;font-size:.78rem;white-space:nowrap;pointer-events:none;color:#fff}'
+'.nav.sc .nav-links a[data-en]::before{color:var(--ink,#111)}'
+'.nav-links a[data-en]:hover{color:transparent}'
+'.nav-links a[data-en]:hover>i{opacity:0}'
+'.nav-links a[data-en]:hover::before{opacity:1;transform:translate(-50%,-50%)}'
+'}'
+'@media(max-width:920px){'
+'#mnav.mnav{position:fixed;top:0;left:0;bottom:0;width:min(80vw,310px);height:100dvh;transform:translateX(-100%);transition:transform .3s ease;display:flex!important;z-index:1200;overflow-y:auto;box-shadow:6px 0 44px rgba(0,0,0,.42);padding:60px 0 26px;border-bottom:0}'
+'#mnav.mnav.open{transform:translateX(0)}'
+'.mnav-close{position:absolute;top:12px;right:12px;width:38px;height:38px;border:0;background:none;font-size:1.5rem;line-height:1;color:#111;cursor:pointer}'
+'.mnav-ov{position:fixed;inset:0;background:rgba(0,0,0,.5);opacity:0;visibility:hidden;transition:.3s;z-index:1100}'
+'.mnav-ov.open{opacity:1;visibility:visible}'
+'body.mnav-lock{overflow:hidden}'
+'body.mnav-lock .nav{z-index:1300}'
+'}';
document.head.appendChild(NAVCSS);

var NAVCSS2=document.createElement('style');NAVCSS2.id='hcf-nav-x2';NAVCSS2.textContent=
'@media(min-width:921px){'
+'.ndd-m a[data-en]{position:relative}'
+'.ndd-m a[data-en]::before{content:attr(data-en);position:absolute;left:18px;top:50%;transform:translateY(-50%);opacity:0;transition:.2s;font-family:var(--en,Oswald,sans-serif);font-weight:700;letter-spacing:.1em;font-size:.74rem;color:var(--red,#C81015);pointer-events:none}'
+'.ndd-m a[data-en]:hover{color:transparent!important}'
+'.ndd-m a[data-en]:hover::before{opacity:1}'
+'}'
+'@media(max-width:920px){'
+'.mnav a[data-en],.mnav .msub-t[data-en]{position:relative}'
+'.mnav a[data-en]::after,.mnav .msub-t[data-en]::after{content:attr(data-en);position:absolute;left:24px;top:50%;transform:translateY(-50%);opacity:0;transition:.2s;font-family:var(--en,Oswald,sans-serif);font-weight:700;letter-spacing:.1em;font-size:.9rem;color:var(--red,#C81015);pointer-events:none}'
+'.mnav a[data-en]:hover,.mnav a[data-en]:active{color:transparent}'
+'.mnav a[data-en]:hover::after,.mnav a[data-en]:active::after{opacity:1}'
+'}';
document.head.appendChild(NAVCSS2);



var FLOAT='<button class="totop" id="totop" aria-label="回頂部">TOP</button>\
<div class="mcta">\
<a class="m1" href="booking.html">立即預約 $400 體驗</a>\
<a class="m2" href="https://lin.ee/7lidUv0" target="_blank" rel="noopener">LINE 諮詢</a></div>';
document.body.insertAdjacentHTML('beforeend',FLOAT);

var FOOT='<div class="fin-in">\
<div class="fin-k">HCF COMBAT HSINCHU</div>\
<div class="fin-q">這輩子總要為自己<i>贏一次</i></div>\
<div class="fin-btns">\
<a class="hb1" href="booking.html">立即預約 $400 體驗</a>\
<a class="hb2" href="https://lin.ee/7lidUv0" target="_blank" rel="noopener">LINE 諮詢</a></div></div>\
<div class="fin-foot">\
<div><h5>HCF 新竹格鬥</h5><p>Honor 榮譽 · Courage 勇氣 · Faith 信念</p><p>泰拳 / 散打 / 踢拳 / 肌力體能</p></div>\
<div><h5>聯絡我們</h5><p>新竹市北區林森路 301 號 2 樓</p><a href="tel:0925571225">0925-571-225</a><a href="https://lin.ee/7lidUv0" target="_blank" rel="noopener">LINE 線上諮詢</a></div>\
<div><h5>快速連結</h5><a href="coach-huang.html">總教練 黃謙和</a><a href="team.html" data-en="COACHES">教練團隊</a><a href="group-classes.html" data-en="GROUP">團體課程</a><a href="private-training.html" data-en="PRIVATE">私人課程</a><a href="schedule.html" data-en="SCHEDULE">最新課表</a><a href="pricing.html" data-en="PRICING">課程方案</a><a href="shop.html" data-en="SHOP">商城</a><a href="https://www.fit-book.com.tw/hsinchucombat" target="_blank" rel="noopener" data-en="LOGIN">會員登入</a></div>\
<div><h5>加入社群</h5>\
<div class="fin-social"><a class="fs-ic" href="https://www.instagram.com/hc.combat2022/" target="_blank" rel="noopener" data-s="ig" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 2a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM17.5 6a1 1 0 110 2 1 1 0 010-2z"/></svg></a><a class="fs-ic" href="https://m.facebook.com/hsinchucombat/" target="_blank" rel="noopener" data-s="fb" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.6V3.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.7v3h2.4v8h3.4z"/></svg></a><a class="fs-ic" href="https://youtube.com/playlist?list=PLFtibVDr-YTBsPUoEfClpei2ttq1mGtKN" target="_blank" rel="noopener" data-s="yt" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 00-1.7-1.7C19.4 5.2 12 5.2 12 5.2s-7.4 0-8.9.4A2.5 2.5 0 001.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7c.2.9.9 1.5 1.7 1.7 1.5.4 8.9.4 8.9.4s7.4 0 8.9-.4a2.5 2.5 0 001.7-1.7c.4-1.5.4-4.7.4-4.7zM9.8 15.1V8.9l5.3 3.1-5.3 3.1z"/></svg></a><a class="fs-ic" href="https://lin.ee/7lidUv0" target="_blank" rel="noopener" data-s="line" aria-label="LINE"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.5c-5 0-9 3.2-9 7.2 0 3.5 3 6.5 7.2 7.1.3.05.6.15.7.35.06.2.04.5.02.7l-.12.75c-.03.2-.17.86.77.47s5.1-3 6.9-5.2c1.2-1.4 1.8-2.8 1.8-4.4 0-4-4-7.2-9.06-7.2z"/></svg></a></div></div></div>\
<div class="fin-copy">© 2026 HCF COMBAT HSINCHU · 新竹 HCF 格鬥</div>';
var fin=document.getElementById('finale'); if(fin)fin.innerHTML=FOOT;

document.querySelectorAll('.ribbon-track').forEach(function(r){
  r.innerHTML=('<span>HONOR · COURAGE · FAITH · </span>').repeat(12);
});

// ===== Nav / 回頂部 =====
var totop=document.getElementById('totop');
function onScroll(){var y=scrollY;
  if(nav)nav.classList.toggle('sc',y>Math.min(innerHeight*0.45,360));
  totop.classList.toggle('on',y>innerHeight*1.2);}
addEventListener('scroll',onScroll,{passive:true});onScroll();
totop.onclick=function(){scrollTo({top:0,behavior:'smooth'})};
var burger=document.getElementById('burger'),mnav=document.getElementById('mnav');
var navOv=document.createElement('div');navOv.className='mnav-ov';document.body.appendChild(navOv);
function navClose(){if(!mnav)return;mnav.classList.remove('open');navOv.classList.remove('open');document.body.classList.remove('mnav-lock');}
function navOpen(){mnav.classList.add('open');navOv.classList.add('open');document.body.classList.add('mnav-lock');}
if(mnav&&!mnav.querySelector('.mnav-close')){var xb=document.createElement('button');xb.className='mnav-close';xb.setAttribute('aria-label','關閉');xb.textContent='\u2715';xb.onclick=navClose;mnav.insertAdjacentHTML('afterbegin','');mnav.insertBefore(xb,mnav.firstChild);}
if(burger)burger.onclick=function(){mnav.classList.contains('open')?navClose():navOpen()};
navOv.onclick=navClose;
document.addEventListener('click',function(e){
  if(!mnav||!mnav.classList.contains('open'))return;
  if(mnav.contains(e.target))return;
  if(burger&&(e.target===burger||burger.contains(e.target)))return;
  navClose();
});
if(mnav)mnav.addEventListener('click',function(e){
  var t=e.target.closest('.msub-t');
  if(t){t.classList.toggle('open');t.nextElementSibling.classList.toggle('open');return;}
  if(e.target.tagName==='A')navClose();});

// ===== Reveal =====
var io=new IntersectionObserver(function(es){es.forEach(function(e){
  if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
document.querySelectorAll('.rv').forEach(function(el){io.observe(el)});

// ===== 數字滾動 =====
var cio=new IntersectionObserver(function(es){es.forEach(function(e){
  if(!e.isIntersecting)return;cio.unobserve(e.target);
  var el=e.target,end=+el.dataset.cnt,t0=null;
  function step(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/1300);
    el.textContent=Math.round(end*(1-Math.pow(1-k,3)));
    if(k<1)requestAnimationFrame(step)}
  requestAnimationFrame(step);})},{threshold:.5});
document.querySelectorAll('[data-cnt]').forEach(function(el){cio.observe(el)});

})();


/* ===== 左側問卷入口 ===== */
(function(){
  if(document.body.dataset.page==='survey'||document.body.dataset.page==='status'||document.querySelector('.svtab'))return;
  var st=document.createElement('style');
  st.textContent=".svtab{position:fixed;left:0;top:50%;transform:translateY(-50%);z-index:140;display:flex;flex-direction:column;align-items:center;background:#C81015;color:#fff;text-decoration:none;font-weight:900;font-size:.86rem;line-height:1.5;text-align:center;padding:13px 9px;width:max-content;border-radius:0 14px 14px 0;box-shadow:5px 0 22px rgba(200,16,21,.5);transition:padding .25s,background .25s;animation:svwig 4.5s ease-in-out infinite}.svtab:hover{background:#9B0B0F;padding-left:15px;animation:none}.svtab b{display:block;font-family:inherit}@keyframes svwig{0%,82%,100%{transform:translateY(-50%) translateX(0)}88%{transform:translateY(-50%) translateX(6px)}94%{transform:translateY(-50%) translateX(-1px)}}@keyframes svwigm{0%,82%,100%{transform:translateX(0)}88%{transform:translateX(5px)}94%{transform:translateX(-1px)}}@media(max-width:880px){.svtab{top:104px;transform:none;font-size:.76rem;padding:11px 7px;border-radius:0 12px 12px 0;box-shadow:4px 0 16px rgba(200,16,21,.5);animation:svwigm 4.5s ease-in-out infinite}}";
  document.head.appendChild(st);
  var a=document.createElement('a');
  a.className='svtab';a.href='status.html';
  a.innerHTML='<b>點</b><b>擊</b><b>領</b><b>取</b><b>獎</b><b>勵</b><b>🎁</b>';
  document.body.appendChild(a);
})();


/* ===== 質感升級：滾動進度條 + Hero 沉浸互動（游標光暈 + 輕視差） ===== */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var de=document.documentElement;
  var bar=document.createElement('div');bar.id='scrollbar';document.body.appendChild(bar);
  function sb(){var st=window.pageYOffset||de.scrollTop||0;var sc=de.scrollHeight-window.innerHeight;bar.style.width=(sc>0?(st/sc*100):0).toFixed(2)+'%';}
  addEventListener('scroll',sb,{passive:true});addEventListener('resize',sb,{passive:true});sb();
  var phero=document.querySelector('.phero');
  if(phero){
    var glow=document.createElement('div');glow.className='glow';phero.appendChild(glow);
    if(!reduce&&matchMedia('(hover:hover) and (pointer:fine)').matches){
      phero.addEventListener('pointermove',function(e){var r=phero.getBoundingClientRect();phero.style.setProperty('--mx',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');phero.style.setProperty('--my',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');});
      var bg=phero.querySelector('.bgimg');
      if(bg){bg.style.transform='scale(1.12)';var tk=false;addEventListener('scroll',function(){if(tk)return;tk=true;requestAnimationFrame(function(){tk=false;var top=phero.getBoundingClientRect().top;bg.style.transform='translateY('+(top*-0.05).toFixed(1)+'px) scale(1.12)';});},{passive:true});}
    }
  }
})();

/* ===== 質感升級 v2：進場串接錯開 + 桌機磁吸 CTA ===== */
(function(){
  var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(rm)return;
  /* 同一容器內的 .rv 依序錯開浮現 */
  document.querySelectorAll('.rv').forEach(function(el){
    var p=el.parentNode; if(!p||!p.children)return;
    var sibs=[].filter.call(p.children,function(c){return c.classList&&c.classList.contains('rv');});
    var idx=sibs.indexOf(el);
    if(idx>0)el.style.transitionDelay=Math.min(idx*70,350)+'ms';
  });
  /* 主要 CTA 磁吸（桌機精準指標） */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches){
    document.querySelectorAll('.hb1,.b1').forEach(function(btn){
      btn.addEventListener('pointermove',function(e){
        var r=btn.getBoundingClientRect();
        var x=(e.clientX-r.left-r.width/2)*0.18, y=(e.clientY-r.top-r.height/2)*0.30;
        btn.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px) skewX(-10deg)';
      });
      btn.addEventListener('pointerleave',function(){btn.style.transform='';});
    });
  }
})();

/* 全站背景配樂（跨頁接續，桌面限定） */
(function(){var s=document.createElement('script');s.src='hcf-bgm.js';s.defer=true;(document.head||document.documentElement).appendChild(s);})();
