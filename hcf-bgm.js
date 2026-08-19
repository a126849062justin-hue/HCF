/* HCF 背景配樂 — 跨頁接續播放（sessionStorage 記住位置；桌面限定） */
(function(){
  if(!window.matchMedia||!matchMedia('(min-width:900px)').matches)return;
  if(window.__hcfBgm)return; window.__hcfBgm=1;              /* 同頁防重複 */
  var KT='hcfBgmT', KM='hcfBgmMuted', START=35;
  if(sessionStorage.getItem(KM)==='1')return;                /* 使用者曾靜音則整站不播 */
  var bgm=new Audio('hero-music.m4a'); bgm.preload='auto'; bgm.volume=0.5;
  var saved=parseFloat(sessionStorage.getItem(KT));
  var target=(isFinite(saved)&&saved>START)?saved:START;     /* 換頁從上次秒數續播 */
  bgm.addEventListener('loadedmetadata',function(){try{if(bgm.duration&&target<bgm.duration&&bgm.currentTime<target)bgm.currentTime=target;}catch(e){}});
  bgm.addEventListener('ended',function(){try{bgm.currentTime=START;bgm.play();}catch(e){}});
  function save(){try{if(bgm.currentTime>0)sessionStorage.setItem(KT,String(bgm.currentTime));}catch(e){}}
  setInterval(function(){if(!bgm.paused)save();},1000);
  window.addEventListener('pagehide',save);
  window.addEventListener('beforeunload',save);
  function tryPlay(){var p=bgm.play();if(p&&p.catch)p.catch(function(){});}
  tryPlay();
  /* 自動播放被擋時：首次互動接續播放 */
  var evs=['pointerdown','keydown','wheel','touchstart','scroll','mousemove'];
  function onGesture(){tryPlay();if(!bgm.paused)evs.forEach(function(e){window.removeEventListener(e,onGesture,true);});}
  evs.forEach(function(e){window.addEventListener(e,onGesture,{capture:true,passive:true});});
  document.addEventListener('visibilitychange',function(){if(document.hidden){save();}else{tryPlay();}});
})();
