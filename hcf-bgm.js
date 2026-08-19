/* HCF 背景配樂 — 跨頁接續 + 點擊靜音（桌面限定） */
(function(){
  if(!window.matchMedia||!matchMedia('(min-width:900px)').matches)return;
  if(window.__hcfBgm)return; window.__hcfBgm=1;                 /* 同頁防重複 */
  var KT='hcfBgmT', KM='hcfBgmMuted', START=35;
  var muted = sessionStorage.getItem(KM)==='1';                /* 跨頁記住靜音狀態 */
  var bgm=new Audio('hero-music.m4a'); bgm.preload='auto'; bgm.volume=0.5;
  var saved=parseFloat(sessionStorage.getItem(KT));
  var target=(isFinite(saved)&&saved>START)?saved:START;        /* 換頁從上次秒數續播 */
  bgm.addEventListener('loadedmetadata',function(){try{if(bgm.duration&&target<bgm.duration&&bgm.currentTime<target)bgm.currentTime=target;}catch(e){}});
  bgm.addEventListener('ended',function(){try{bgm.currentTime=START;bgm.play();}catch(e){}});
  function save(){try{if(bgm.currentTime>0)sessionStorage.setItem(KT,String(bgm.currentTime));}catch(e){}}
  setInterval(function(){if(!bgm.paused)save();},1000);
  window.addEventListener('pagehide',save); window.addEventListener('beforeunload',save);
  function tryPlay(){ if(muted)return; var p=bgm.play(); if(p&&p.catch)p.catch(function(){}); }
  /* 自動播放被擋時：首次互動接續播放 */
  var evs=['pointerdown','keydown','wheel','touchstart','scroll','mousemove'];
  function onGesture(){ tryPlay(); if(muted||!bgm.paused) evs.forEach(function(e){window.removeEventListener(e,onGesture,true);}); }
  evs.forEach(function(e){window.addEventListener(e,onGesture,{capture:true,passive:true});});
  document.addEventListener('visibilitychange',function(){ if(document.hidden){save();bgm.pause();} else tryPlay(); });
  if(!muted) tryPlay();

  /* 低調的點擊靜音鈕（右下小圓） */
  function mk(){
    if(document.getElementById('bgmBtn'))return;
    var btn=document.createElement('button'); btn.id='bgmBtn'; btn.type='button';
    btn.setAttribute('aria-label','背景音樂開關');
    btn.style.cssText='position:fixed;right:18px;bottom:20px;z-index:240;width:42px;height:42px;border-radius:50%;border:1px solid rgba(200,16,21,.55);background:rgba(17,17,17,.6);color:#fff;font-size:16px;line-height:1;cursor:pointer;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(0,0,0,.3);transition:opacity .2s,transform .2s;opacity:.7';
    btn.onmouseenter=function(){btn.style.opacity='1';btn.style.transform='scale(1.08)';};
    btn.onmouseleave=function(){btn.style.opacity='.7';btn.style.transform='none';};
    function ic(){ btn.textContent = muted ? '🔇' : '🔊'; }  /* 🔇 / 🔊 */
    ic();
    btn.addEventListener('click',function(e){
      e.stopPropagation(); muted=!muted;
      if(muted){ sessionStorage.setItem(KM,'1'); bgm.pause(); }
      else { sessionStorage.setItem(KM,'0'); var p=bgm.play(); if(p&&p.catch)p.catch(function(){}); }
      ic();
    });
    document.body.appendChild(btn);
  }
  if(document.body) mk(); else document.addEventListener('DOMContentLoaded',mk);
})();
