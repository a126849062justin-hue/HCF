/* ============================================================
   HCF 數據追蹤 hcf-analytics.js — 全站 21 頁共用
   後台 = Google Analytics 4：申請後把 G-XXXXXXXXXX 填入下方 GA_ID
   未填 ID 時事件仍會記錄在 dataLayer 與本機 localStorage(hcf_ev)，
   填入後自動上報 GA4，可在 GA4 後台看完整漏斗。
   ============================================================ */
(function(){
  var GA_ID='G-ZCPVLM3SY0';      // ← 申請 GA4 後填入，例如 'G-AB12CD34EF'
  var BACKEND='https://hcf-admin.onrender.com';    // ← 已對接 HCF 獨立後台（onrender，服務名 hcf-admin）；留空＝不啟用

  window.HCF_BACKEND=BACKEND;
  /* 內容快取：公告列／課表／消息／價格（各頁自行取用） */
  window.HCF_CONTENT=BACKEND?fetch(BACKEND+'/api/public/content').then(function(r){return r.json()}).catch(function(){return{}}):Promise.resolve({});

  window.dataLayer=window.dataLayer||[];
  function gtag(){dataLayer.push(arguments);}
  if(GA_ID){
    var s=document.createElement('script');s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id='+GA_ID;
    document.head.appendChild(s);
    gtag('js',new Date());
    gtag('config',GA_ID,{page_path:location.pathname});
  }

  window.hcfTrack=function(name,params){
    params=params||{};params.page=location.pathname;
    if(GA_ID)gtag('event',name,params);
    else dataLayer.push(Object.assign({event:name},params));
    if(BACKEND){
      try{
        var payload=JSON.stringify({name:name,params:params});
        if(navigator.sendBeacon)navigator.sendBeacon(BACKEND+'/api/track',payload);
        else fetch(BACKEND+'/api/track',{method:'POST',body:payload,keepalive:true});
      }catch(e){}
    }
    try{
      var a=JSON.parse(localStorage.getItem('hcf_ev')||'[]');
      a.push({e:name,p:params,t:Date.now()});
      if(a.length>300)a=a.slice(-300);
      localStorage.setItem('hcf_ev',JSON.stringify(a));
    }catch(e){}
  };

  /* 每頁瀏覽 */
  if(BACKEND)hcfTrack('page_view');

  /* 全站公告列（後台「內容管理」開關） */
  window.HCF_CONTENT.then(function(c){
    var a=c&&c.announcement;
    if(!a||!a.on||!a.text)return;
    var bar=document.createElement(a.link?'a':'div');
    if(a.link)bar.href=a.link;
    bar.id='hcfAnn';
    bar.textContent=a.text;
    bar.style.cssText='position:fixed;top:0;left:0;right:0;z-index:400;background:#C81015;color:#fff;font-weight:700;font-size:.86rem;letter-spacing:.04em;text-align:center;padding:9px 14px;text-decoration:none;box-shadow:0 4px 14px rgba(200,16,21,.35);font-family:inherit;line-height:1.4';
    document.body.appendChild(bar);
    function shift(){
      var h=bar.offsetHeight;
      var nav=document.querySelector('.nav');if(nav)nav.style.top=h+'px';
      var sv=document.querySelector('.svtab');if(sv)sv.style.marginTop=(h/2)+'px';
    }
    shift();addEventListener('resize',shift);
  });

  /* 關鍵行為自動追蹤（事件代理，免逐頁掛碼） */
  document.addEventListener('click',function(e){
    var el=e.target.closest('a,button');if(!el)return;
    var h=el.href||'';
    if(h.indexOf('fit-book.com')>-1)hcfTrack('cta_booking',{label:(el.textContent||'').trim().slice(0,30)});
    else if(h.indexOf('lin.ee')>-1)hcfTrack('cta_line',{label:(el.textContent||'').trim().slice(0,30)});
    else if(h.indexOf('instagram.com')>-1)hcfTrack('social_click',{platform:'ig'});
    else if(h.indexOf('facebook.com')>-1)hcfTrack('social_click',{platform:'fb'});
    else if(h.indexOf('youtube.com')>-1)hcfTrack('social_click',{platform:'yt'});
    else if(h.indexOf('tel:')===0)hcfTrack('cta_phone');
    else if(el.classList&&el.classList.contains('svtab'))hcfTrack('survey_tab_click');
    else if(h.indexOf('survey.html')>-1)hcfTrack('nav_survey');
    else if(h.indexOf('schedule.html')>-1)hcfTrack('nav_schedule');
    else if(h.indexOf('group-classes.html')>-1)hcfTrack('nav_group');
    else if(h.indexOf('private-training.html')>-1)hcfTrack('nav_private');
    else if(h.indexOf('plans-proposal.html')>-1){
      var g=(h.split('g=')[1]||'').slice(0,2);
      hcfTrack('nav_goals',g?{goal:g}:{});
    }
  },true);

  /* 閱讀深度（每頁一次性 50% / 90%） */
  var d50=false,d90=false;
  addEventListener('scroll',function(){
    var sh=document.documentElement.scrollHeight||1;
    var p=(scrollY+innerHeight)/sh;
    if(!d50&&p>.5){d50=true;hcfTrack('scroll_50');}
    if(!d90&&p>.9){d90=true;hcfTrack('scroll_90');}
  },{passive:true});
})();
