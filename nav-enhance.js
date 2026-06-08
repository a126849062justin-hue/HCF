/* HCF 導覽強化（給 inline-nav 頁面用）：左側抽屜 + 桌面/手機 hover 英文 + 點外部關閉 */
(function(){
  var mnav=document.getElementById('mnav'),burger=document.getElementById('burger')||document.querySelector('.nav-burger');
  if(!mnav&&!burger&&!document.querySelector('.nav-links'))return;

  /* 1) 注入 CSS（抽屜 + 英文切換） */
  var css=
   '@media(min-width:921px){'
   +'.nav-links a[data-en]{position:relative}'
   +'.nav-links a[data-en]::before{content:attr(data-en);position:absolute;left:50%;top:50%;transform:translate(-50%,calc(-50% + 6px));opacity:0;transition:opacity .22s,transform .22s;font-family:var(--en,Oswald,sans-serif);font-weight:700;letter-spacing:.12em;font-size:.78rem;white-space:nowrap;pointer-events:none;color:#fff}'
   +'.nav.sc .nav-links a[data-en]::before{color:var(--ink,#111)}'
   +'.nav-links a[data-en]:hover{color:transparent}'
   +'.nav-links a[data-en]:hover>i{opacity:0}'
   +'.nav-links a[data-en]:hover::before{opacity:1;transform:translate(-50%,-50%)}'
   +'.ndd-m a[data-en]{position:relative}'
   +'.ndd-m a[data-en]::before{content:attr(data-en);position:absolute;left:18px;top:50%;transform:translateY(-50%);opacity:0;transition:.2s;font-family:var(--en,Oswald,sans-serif);font-weight:700;letter-spacing:.1em;font-size:.74rem;color:var(--red,#C81015);pointer-events:none}'
   +'.ndd-m a[data-en]:hover{color:transparent!important}'
   +'.ndd-m a[data-en]:hover::before{opacity:1}'
   +'}'
   +'@media(max-width:920px){'
   +'#mnav.mnav{position:fixed;top:0;left:0;bottom:0;width:min(80vw,310px);height:100dvh;transform:translateX(-100%);transition:transform .3s ease;display:flex!important;z-index:1200;overflow-y:auto;box-shadow:6px 0 44px rgba(0,0,0,.42);padding:60px 0 26px;border-bottom:0}'
   +'#mnav.mnav.open{transform:translateX(0)}'
   +'.mnav-close{position:absolute;top:12px;right:12px;width:38px;height:38px;border:0;background:none;font-size:1.5rem;line-height:1;color:#111;cursor:pointer;z-index:2}'
   +'.mnav-ov{position:fixed;inset:0;background:rgba(0,0,0,.5);opacity:0;visibility:hidden;transition:.3s;z-index:1100}'
   +'.mnav-ov.open{opacity:1;visibility:visible}'
   +'body.mnav-lock{overflow:hidden}'
   +'.mnav a[data-en],.mnav .msub-t[data-en]{position:relative}'
   +'.mnav a[data-en]::after,.mnav .msub-t[data-en]::after{content:attr(data-en);position:absolute;left:24px;top:50%;transform:translateY(-50%);opacity:0;transition:.2s;font-family:var(--en,Oswald,sans-serif);font-weight:700;letter-spacing:.1em;font-size:.9rem;color:var(--red,#C81015);pointer-events:none}'
   +'.mnav a[data-en]:hover,.mnav a[data-en]:active{color:transparent}'
   +'.mnav a[data-en]:hover::after,.mnav a[data-en]:active::after{opacity:1}'
   +'}';
  var st=document.createElement('style');st.id='hcf-nav-enh';st.textContent=css;document.head.appendChild(st);

  /* 2) 依文字自動補英文（不需逐頁改 HTML） */
  var MAP={'首頁':'HOME','最新資訊':'NEWS','品牌哲學':'BRAND','課程介紹':'CLASS','課程總覽':'OVERVIEW','團體課程':'GROUP','私人課程':'PRIVATE','最新課表':'SCHEDULE','教練團隊':'COACHES','課程方案':'PRICING','商城':'SHOP','會員登入':'LOGIN'};
  document.querySelectorAll('.nav-links a, .ndd-m a, .mnav a, .mnav .msub-t').forEach(function(el){
    if(el.classList.contains('nav-cta')||el.classList.contains('cta'))return;
    var t=(el.textContent||'').replace(/[▾＋\s]/g,'').trim();
    if(MAP[t])el.setAttribute('data-en',MAP[t]);
  });

  /* 3) 抽屜開關 + 遮罩 + 點外部關閉 + 鎖捲動 */
  if(!mnav||!burger)return;
  var ov=document.createElement('div');ov.className='mnav-ov';document.body.appendChild(ov);
  function close(){mnav.classList.remove('open');ov.classList.remove('open');document.body.classList.remove('mnav-lock');}
  function open(){mnav.classList.add('open');ov.classList.add('open');document.body.classList.add('mnav-lock');}
  if(!mnav.querySelector('.mnav-close')){var xb=document.createElement('button');xb.className='mnav-close';xb.setAttribute('aria-label','關閉');xb.textContent='✕';xb.onclick=close;mnav.insertBefore(xb,mnav.firstChild);}
  burger.onclick=function(){mnav.classList.contains('open')?close():open();};
  ov.onclick=close;
  mnav.addEventListener('click',function(e){
    if(e.target.closest('.msub-t'))return;
    if(e.target.tagName==='A')close();
  });
  document.addEventListener('click',function(e){
    if(!mnav.classList.contains('open'))return;
    if(mnav.contains(e.target))return;
    if(e.target===burger||burger.contains(e.target))return;
    close();
  });
})();
