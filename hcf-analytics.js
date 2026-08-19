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
    else if(el.classList&&el.classList.contains('svtab'))hcfTrack(el.classList.contains('voice')?'voice_tab_click':'survey_tab_click');
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

/* ===== 左側「說真話」老闆信箱側標（與問卷側標堆疊） ===== */
(function(){
  if(document.body.dataset.page==='survey')return; // 問卷/投訴頁本身不顯示
  function place(){
    var sv=document.querySelector('.svtab');
    if(!sv||document.querySelector('.svtab.voice'))return true;
    var st=document.createElement('style');
    st.textContent='.vtab-wrap{position:fixed;left:0;top:50%;transform:translateY(-50%);z-index:140;display:flex;flex-direction:column;gap:10px;align-items:flex-start}'
      +'.vtab-wrap .svtab{position:static!important;top:auto!important;transform:none!important;margin:0!important}'
      +'.svtab.voice{background:#2b1210;box-shadow:6px 0 20px rgba(0,0,0,.55),inset -3px 0 0 rgba(200,16,21,.9);border-top:1px solid rgba(184,149,85,.45);border-bottom:1px solid rgba(184,149,85,.45)}.svtab.voice:hover{background:#3a1512}'
      +'@media(max-width:920px){.vtab-wrap{top:88px;transform:none;gap:8px}}';
    document.head.appendChild(st);
    var wrap=document.createElement('div');wrap.className='vtab-wrap';
    sv.parentNode.insertBefore(wrap,sv);wrap.appendChild(sv);
    var v=document.createElement('a');v.className='svtab voice';v.href='complaint.html';
    v.setAttribute('aria-label','老闆我要投訴');
    v.innerHTML='<b>老</b><b>闆</b><b>我</b><b>要</b><b>投</b><b>訴</b>';
    wrap.appendChild(v);
    return true;
  }
  if(!place()){var n=0,t=setInterval(function(){if(place()||++n>20)clearInterval(t);},150);}
})();

/* ===== 頁尾快速連結 & 手機選單 加入「套組方案 / 老闆信箱」入口 ===== */
(function(){
  var ENTRIES=[{href:'packages.html',label:'套組方案'},{href:'complaint.html',label:'老闆我要投訴'}];
  var MNAV_ENTRIES=[{href:'complaint.html',label:'老闆我要投訴'}]; /* 手機漢堡選單不放套組方案 */
  function addLinks(box,list){
    (list||ENTRIES).forEach(function(e){
      if(!box.querySelector('a[href="'+e.href+'"]')){
        var a=document.createElement('a');a.href=e.href;a.textContent=e.label;box.appendChild(a);
      }
    });
  }
  function inject(){
    var doneM=false,doneF=false;
    var mnav=document.getElementById('mnav');
    if(mnav){addLinks(mnav,MNAV_ENTRIES);doneM=true;}
    var h5s=document.getElementsByTagName('h5'),box=null,i;
    for(i=0;i<h5s.length;i++){if((h5s[i].textContent||'').trim()==='快速連結'){box=h5s[i].parentNode;break;}}
    if(box){addLinks(box);doneF=true;}
    return doneM&&doneF;
  }
  if(!inject()){var n=0,t=setInterval(function(){if(inject()||++n>25)clearInterval(t);},150);}
})();
