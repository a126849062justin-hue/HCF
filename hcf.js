/* HCF 共用互動 hcf.js — 由各頁引用 */
(function(){
// ===== 共用元件注入：nav / 浮動層 / 頁尾 =====
var page=document.body.dataset.page||'';
var NAV='<div class="nav-in">\
<a class="nav-logo" href="index.html"><img src="assets/final-logo.png" alt="HCF"><b data-en="HCF COMBAT">新竹格鬥</b></a>\
<nav class="nav-links">\
<a href="index.html" data-p="home" data-en="HOME">首頁</a>\
<a href="news.html" data-p="news" data-en="NEWS">最新資訊</a>\
<a href="philosophy.html" data-p="phil" data-en="BRAND">品牌哲學</a>\
<div class="ndd"><a href="courses.html" data-p="courses" data-en="CLASS">課程介紹<i>▾</i></a><div class="ndd-m"><a href="courses.html" data-en="OVERVIEW">課程總覽</a><a href="group-classes.html" data-en="GROUP">團體課程</a><a href="private-training.html" data-en="PRIVATE">私人課程</a></div></div>\
<a href="schedule.html" data-p="sched" data-en="SCHEDULE">最新課表</a>\
<a href="team.html" data-p="team" data-en="COACHES">教練團隊</a>\
<a href="pricing.html" data-p="pricing" data-en="PRICING">課程方案</a><a href="shop.html" data-p="shop" data-en="SHOP">商城</a>\
<a class="nav-cta" href="https://www.fit-book.com.tw/hsinchucombat/plan/588" target="_blank" rel="noopener">立即預約</a>\
</nav>\
<button class="nav-burger" id="burger" aria-label="選單"><span></span><span></span><span></span></button>\
</div>\
<nav class="mnav" id="mnav">\
<a href="index.html" data-en="HOME">首頁</a><a href="news.html" data-en="NEWS">最新資訊</a><a href="philosophy.html" data-en="BRAND">品牌哲學</a>\
<button class="msub-t" type="button" data-en="CLASS">課程介紹<i>＋</i></button><div class="msub"><a href="courses.html" data-en="OVERVIEW">課程總覽</a><a href="group-classes.html" data-en="GROUP">團體課程</a><a href="private-training.html" data-en="PRIVATE">私人課程</a></div><a href="schedule.html" data-en="SCHEDULE">最新課表</a><a href="team.html" data-en="COACHES">教練團隊</a><a href="pricing.html" data-en="PRICING">課程方案</a><a href="shop.html" data-en="SHOP">商城</a><a href="https://www.fit-book.com.tw/hsinchucombat" target="_blank" rel="noopener" data-en="LOGIN">會員登入</a>\
<a class="cta" href="https://www.fit-book.com.tw/hsinchucombat/plan/588" target="_blank" rel="noopener">立即預約 $400 體驗</a></nav>';
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
+'}';
document.head.appendChild(NAVCSS);

var NAVCSS3=document.createElement('style');NAVCSS3.id='hcf-nav-x3';NAVCSS3.textContent=
'.nav-logo b[data-en]{position:relative;display:inline-block}'
+'.nav-logo b[data-en]::before{content:attr(data-en);position:absolute;left:0;top:50%;transform:translateY(-50%);white-space:nowrap;opacity:0;transition:opacity .22s;font-style:normal;pointer-events:none;color:#fff}'
+'.nav.sc .nav-logo b[data-en]::before{color:var(--ink,#111)}'
+'.nav-logo:hover b[data-en],.nav-logo:active b[data-en]{color:transparent}'
+'.nav-logo:hover b[data-en]::before,.nav-logo:active b[data-en]::before{opacity:1}';
document.head.appendChild(NAVCSS3);


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
<button class="shark" id="sharkBtn" aria-label="AI 客服"><img src="shark_logo.png" alt="AI 鯊魚客服"></button>\
<div class="chatbox" id="chatbox">\
<div class="cb-h"><span>HCF AI 鯊魚客服</span><button id="cbClose" aria-label="關閉">✕</button></div>\
<div class="cb-log" id="cbLog"><div class="m ai">嗨！我是 HCF 的 AI 鯊魚 🦈 想問課程、價格或預約都可以問我！</div></div>\
<div class="cb-chips" id="cbChips"><button>價格方案</button><button>最新課表</button><button>怎麼預約</button><button>新手入門</button></div><div class="cb-in"><input id="cbIn" placeholder="輸入問題…" maxlength="200"><button id="cbSend">送出</button></div></div>\
<div class="mcta">\
<a class="m1" href="https://www.fit-book.com.tw/hsinchucombat/plan/588" target="_blank" rel="noopener">立即預約 $400 體驗</a>\
<a class="m2" href="https://lin.ee/7lidUv0" target="_blank" rel="noopener">LINE 諮詢</a></div>';
document.body.insertAdjacentHTML('beforeend',FLOAT);

var FOOT='<div class="fin-in">\
<div class="fin-k">HCF COMBAT HSINCHU</div>\
<div class="fin-q">這輩子總要為自己<i>贏一次</i></div>\
<div class="fin-btns">\
<a class="hb1" href="https://www.fit-book.com.tw/hsinchucombat/plan/588" target="_blank" rel="noopener">立即預約 $400 體驗</a>\
<a class="hb2" href="https://lin.ee/7lidUv0" target="_blank" rel="noopener">LINE 諮詢</a></div></div>\
<div class="fin-foot">\
<div><h5>HCF 新竹格鬥</h5><p>Honor 榮譽 · Courage 勇氣 · Faith 信念</p><p>泰拳 / 散打 / 踢拳 / 肌力體能</p></div>\
<div><h5>聯絡我們</h5><p>新竹市北區林森路 301 號 2 樓</p><a href="tel:0925571225">0925-571-225</a><a href="https://lin.ee/7lidUv0" target="_blank" rel="noopener">LINE 線上諮詢</a></div>\
<div><h5>快速連結</h5><a href="coach-huang.html">總教練 黃謙和</a><a href="team.html" data-en="COACHES">教練團隊</a><a href="group-classes.html" data-en="GROUP">團體課程</a><a href="private-training.html" data-en="PRIVATE">私人課程</a><a href="schedule.html" data-en="SCHEDULE">最新課表</a><a href="pricing.html" data-en="PRICING">課程方案</a><a href="shop.html" data-en="SHOP">商城</a><a href="https://www.fit-book.com.tw/hsinchucombat" target="_blank" rel="noopener" data-en="LOGIN">會員登入</a></div>\
<div><h5>加入社群</h5>\
<a class="fsoc" href="https://lin.ee/7lidUv0" target="_blank" rel="noopener"><i>LINE</i>領取專屬優惠</a>\
<a class="fsoc" href="https://www.instagram.com/hc.combat2022/" target="_blank" rel="noopener"><i>IG</i>最新消息 @hc.combat2022</a>\
<a class="fsoc" href="https://m.facebook.com/hsinchucombat/" target="_blank" rel="noopener"><i>FB</i>賽事公告與訓練紀錄</a>\
<a class="fsoc" href="https://youtube.com/playlist?list=PLFtibVDr-YTBsPUoEfClpei2ttq1mGtKN" target="_blank" rel="noopener"><i>YT</i>格鬥鋼鐵人賽事影片</a>\
<a class="fsoc" href="https://www.fit-book.com.tw/hsinchucombat/plan/588" target="_blank" rel="noopener"><i>GO</i>預約 $400 體驗課</a></div></div>\
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

// ===== AI 鯊魚 =====
var cb=document.getElementById('chatbox'),log=document.getElementById('cbLog'),cin=document.getElementById('cbIn');
document.getElementById('sharkBtn').onclick=function(){cb.classList.toggle('open');var nd=document.getElementById('hcfNudge');if(nd)nd.remove();if(cb.classList.contains('open')){cin.focus();if(window.hcfTrack)hcfTrack('ai_open');}};
/* 主動出擊小氣泡（每次造訪一次、依頁面客製話術） */
(function(){
  if(sessionStorage.getItem('hcfNudged'))return;
  var MSG={'pricing':'方案怎麼選最划算？問我，1 秒回 🦈','schedule':'不知道上哪堂？跟我說你的目標','plans-proposal':'選好目標了嗎？我幫你配課','group-classes':'新手第一堂該上什麼？問我','private-training':'想知道私人課怎麼開始？問我','survey':'做完問卷有疑問？直接問我','story':'想跟大可一樣開始改變？問我'};
  var key=Object.keys(MSG).find(function(k){return location.pathname.indexOf(k)>-1});
  var txt=key?MSG[key]:'嗨！課程・價格・預約，問我秒回 🦈';
  setTimeout(function(){
    if(cb.classList.contains('open'))return;
    sessionStorage.setItem('hcfNudged','1');
    var n=document.createElement('button');
    n.id='hcfNudge';n.type='button';n.textContent=txt;
    n.style.cssText='position:fixed;right:84px;bottom:96px;z-index:380;background:#fff;color:#111;border:1.5px solid #C81015;box-shadow:0 14px 36px rgba(17,17,17,.25);padding:12px 16px;font-weight:700;font-size:.86rem;cursor:pointer;border-radius:14px 14px 2px 14px;max-width:230px;text-align:left;line-height:1.5;font-family:inherit';
    document.body.appendChild(n);
    n.onclick=function(){n.remove();cb.classList.add('open');cin.focus();if(window.hcfTrack)hcfTrack('ai_nudge_click');};
    setTimeout(function(){if(n.parentNode)n.remove()},14000);
  },16000);
})();

document.getElementById('cbClose').onclick=function(){cb.classList.remove('open')};
function add(t,cls){var d=document.createElement('div');d.className='m '+cls;d.textContent=t;log.appendChild(d);log.scrollTop=log.scrollHeight}
var FAQ=[
 {lead:1,k:['價','錢','費','方案','多少'],a:'費用速覽：團體課首堂體驗 $400、MAX 月票 $5,500 當月團課無限；私人課體驗 $1,400 起。完整價格在「課程方案」頁，想看一對一細節輸入「私人課」🦈'},
 {k:['課表','時間','幾點','星期','禮拜'],a:'最新課表線上即時查詢：平日 11:00、19:30、20:40 開課，週末特訓 11:00 起。全預約制、滿 3 人開課，導覽列點「最新課表」就能看！'},
 {lead:1,k:['預約','報名','體驗','怎麼上'],a:'預約超簡單：FitBook 線上選時段（首堂 $400），或加官方 LINE 由真人幫你排。第一次來穿運動服、帶水壺毛巾，拳套裝備館內免費借！'},
 {lead:1,k:['私人','一對一','1對1','私教','打靶'],a:'私人課三種型態：一對一 60 分（體驗 $1,400）、一對二 60 分（體驗 $2,400）、私人打靶 40 分（$1,000）。加 LINE 預約一對一評估，教練幫你客製菜單！'},
 {lead:1,k:['團體','團課'],a:'團體課四大體系：泰拳、散打、踢拳、肌力體能，LV.1 零基礎友善、不對打。首堂 $400，到「課程介紹 → 團體課程」挑一條路線！'},
 {k:['大可','蛻變','減肥','減重','瘦身','變瘦'],a:'你說的是大可吧！他用一年從 104 公斤練到 74 公斤，還站上擂台拿下優勝 🏆 完整故事（含前後對比互動）在官網「高大可的蛻變故事」頁——首頁往下滑就能看到入口。想跟他一樣開始，$400 體驗課就是他的起點！'},
 {lead:1,k:['新手','零基礎','沒學過','第一次','初學','害怕'],a:'零基礎完全 OK！最多人從「新手泰拳」開始：第一堂從站架教起、不對打、教練全程帶。$400 體驗課就是設計給沒底子的你 💪'},
 {k:['地址','位置','在哪','怎麼去','停車','交通'],a:'基地在新竹市北區林森路 301 號 2 樓。找不到路直接打 0925-571-225，我們帶你上來！'},
 {k:['營業','幾點開','開到','公休'],a:'營業時間：平日 11:00–22:00、週末 11:00–16:00，全預約制喔！'},
 {k:['教練','黃謙和','鋼鐵人'],a:'總教練黃謙和「格鬥鋼鐵人」：42 勝、台灣泰拳 63KG 衛冕冠軍，MPF07 傷後復出 TKO 首勝。導覽「教練團隊」看完整互動年鑑與賽事影片！'},
 {k:['小孩','兒童','親子','樂齡','長輩'],a:'兒童格鬥營與樂齡體能小班正在籌備開班！到「30秒測你的命定格鬥課」問卷投下一票、留 LINE，開班第一時間通知你 🎁'}
];
function faqHit(v){for(var i=0;i<FAQ.length;i++){for(var j=0;j<FAQ[i].k.length;j++){if(v.indexOf(FAQ[i].k[j])>-1)return FAQ[i];}}return null;}
function addHTML(h){var d=document.createElement('div');d.className='m ai';d.innerHTML=h;log.appendChild(d);log.scrollTop=log.scrollHeight;}
function addActs(lead){
  var h='<div class="cb-acts"><a href="https://www.fit-book.com.tw/hsinchucombat/plan/588" target="_blank" rel="noopener">🥊 立即預約 $400</a><a href="https://lin.ee/7lidUv0" target="_blank" rel="noopener">💬 加 LINE 真人聊</a>';
  if(lead&&window.HCF_BACKEND)h+='<button type="button" class="cb-leadbtn">📞 留電話，教練回覆你</button>';
  h+='</div>';
  addHTML(h);
}
log.addEventListener('click',function(e){
  if(e.target.classList.contains('cb-leadbtn')){
    e.target.disabled=true;
    addHTML('<div class="cb-leadform"><input class="lf-n" placeholder="怎麼稱呼你"><input class="lf-p" placeholder="電話或 LINE ID" maxlength="40"><button type="button" class="cb-leadsend">送出，等教練聯絡</button></div>');
  }
  if(e.target.classList.contains('cb-leadsend')){
    var f=e.target.closest('.cb-leadform');
    var n=f.querySelector('.lf-n').value.trim(),p=f.querySelector('.lf-p').value.trim();
    if(!p){f.querySelector('.lf-p').focus();return;}
    fetch(window.HCF_BACKEND+'/api/lead',{method:'POST',keepalive:true,body:JSON.stringify({name:n,contact:p,source:'ai-chat'})});
    if(window.hcfTrack)hcfTrack('ai_lead_submit');
    f.outerHTML='<div class="m ai">收到！教練會盡快聯絡你 🦈 想更快也可以直接加 LINE！</div>';
  }
});
function send(qTxt){var v=(qTxt||cin.value).trim();if(!v)return;add(v,'me');cin.value='';
  if(window.hcfTrack)hcfTrack('ai_question',{q:v.slice(0,60)});
  var hit=faqHit(v);
  if(hit){setTimeout(function(){add(hit.a,'ai');addActs(!!hit.lead);},380);return;}
  fetch('/.netlify/functions/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:v})})
   .then(function(r){return r.json()}).then(function(d){add(d.reply||d.message||'收到！','ai')})
   .catch(function(){add('我先記下你的問題了！可以先加 LINE（lin.ee/7lidUv0）由真人為你服務，或試試輸入「價格」「課表」「預約」我馬上回答 🦈','ai');addActs(true)});}
document.getElementById('cbSend').onclick=function(){send()};
document.getElementById('cbChips').addEventListener('click',function(e){var b=e.target.closest('button');if(b)send(b.textContent);});
cin.addEventListener('keydown',function(e){if(e.key==='Enter')send()});
})();


/* ===== 左側問卷入口 ===== */
(function(){
  if(document.body.dataset.page==='survey'||document.querySelector('.svtab'))return;
  var st=document.createElement('style');
  st.textContent=".svtab{position:fixed;left:0;top:50%;transform:translateY(-50%);z-index:140;background:#C81015;color:#fff;text-decoration:none;font-weight:900;font-size:.9rem;line-height:1.55;text-align:center;padding:12px 9px;width:max-content;border-radius:0 12px 12px 0;box-shadow:6px 0 18px rgba(200,16,21,.35);transition:.25s}.svtab:hover{background:#9B0B0F;padding-left:13px}.svtab em{font-style:normal;display:block;margin-bottom:2px}.svtab b{display:block;font-family:inherit}@media(max-width:680px){.svtab{font-size:.78rem;padding:10px 7px;line-height:1.45}}";
  document.head.appendChild(st);
  var a=document.createElement('a');
  a.className='svtab';a.href='survey.html';
  a.innerHTML='<b>30</b><b>秒</b><b>測</b><b>你</b><b>的</b><b>命</b><b>定</b><b>格</b><b>鬥</b><b>課</b>';
  document.body.appendChild(a);
})();
