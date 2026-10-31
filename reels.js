(function(){
  "use strict";

  const W=window.WEDDING||{};
  const DEFAULT_REELS=[
    "assets/reel01.mp4","assets/reel02.mp4","assets/reel03.mp4","assets/reel04.mp4","assets/reel05.mp4",
    "assets/reel06.mp4","assets/reel07.mp4","assets/reel08.mp4","assets/reel09.mp4","assets/reel10.mp4"
  ];
  const srcs=(Array.isArray(W.reelVideos)?W.reelVideos:DEFAULT_REELS)
    .filter(s=>typeof s==="string"&&s.trim())
    .slice(0,10)
    .map(s=>s.trim());

  const $id=id=>document.getElementById(id);
  const viewport=$id("reelsViewport"),track=$id("reelsTrack"),loading=$id("reelsLoading"),empty=$id("reelsEmpty"),ui=$id("reelsUi"),countEl=$id("reelsCount");
  const muteBtn=$id("reelsMute"),likeBtn=$id("reelsLike"),likeCountEl=$id("reelsLikeCount"),commentBtn=$id("reelsComment"),commentCountEl=$id("reelsCommentCount"),shareBtn=$id("reelsShare"),shareCountEl=$id("reelsShareCount"),saveBtn=$id("reelsSave"),saveCountEl=$id("reelsSaveCount");
  const followBtn=$id("reelsFollow"),pauseOverlay=$id("reelsPause"),progressBar=$id("reelsProgressBar"),navShare=$id("reelsNavShare");
  const sheet=$id("reelsSheet"),sheetClose=$id("reelsSheetClose"),sheetCount=$id("reelsSheetCount"),commentsEl=$id("reelsComments");
  const shareSheet=$id("reelsShareSheet"),shareClose=$id("reelsShareClose"),shareWa=$id("reelsShareWa"),shareCopy=$id("reelsShareCopy"),shareStatus=$id("reelsShareStatus"),closeBtn=$id("reelsClose");

  const required=[viewport,track,loading,empty,ui,countEl,muteBtn,likeBtn,likeCountEl,commentBtn,commentCountEl,shareBtn,shareCountEl,saveBtn,saveCountEl,followBtn,pauseOverlay,progressBar,navShare,sheet,sheetClose,sheetCount,commentsEl,shareSheet,shareClose,shareWa,shareCopy,shareStatus,closeBtn];
  if(required.some(el=>!el))return;

  const ICON={
    muted:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16.5 8.5l5 7M21.5 8.5l-5 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    sound:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16.5 8.2a5 5 0 0 1 0 7.6M19 5.8a8.5 8.5 0 0 1 0 12.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  };
  const LIKES=[93900,88200,124000,76000,54300,21000,97500,46000,68000,83000];
  const COMMENTS=[245,312,178,96,421,132,209,154,188,276];
  const SHARES=[1200,890,2400,670,1500,430,1100,760,980,1320];
  const SAVES=[3400,2100,4600,1800,3900,1200,2800,1600,2200,3100];
  const SAMPLE_COMMENTS=[
    {n:"ananya_verma",i:"AV",c:"#c2185b",t:"बहुत ही खूबसूरत जोड़ी ❤️",time:"2 घंटे",likes:"12"},
    {n:"rahul_sahani",i:"RS",c:"#2e7d32",t:"Congratulations Aayush & Puja! 🎉",time:"3 घंटे",likes:"8"},
    {n:"priya.bihar",i:"PB",c:"#8e0f22",t:"शादी की ढेर सारी शुभकामनाएँ ❤️",time:"4 घंटे",likes:"15"},
    {n:"amit_kumar",i:"AK",c:"#b8860b",t:"Made for each other! 💕",time:"5 घंटे",likes:"6"},
    {n:"shreya_singh",i:"SS",c:"#6a1b9a",t:"ये जोड़ी हमेशा खुश रहे 🌸",time:"6 घंटे",likes:"9"},
    {n:"wedding_vibes",i:"WV",c:"#ad1457",t:"Beautiful moments! 💐",time:"8 घंटे",likes:"4"}
  ];
  const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;

  let slides=[],liked=[],saved=[],active=-1,userPaused=false,muted=true,following=false,scrollRaf=0,resizeRaf=0;

  function videoAt(i){const s=slides[i];return s?s.querySelector("video"):null}
  function format(n){
    n=Math.max(0,Math.round(n));
    if(n>=1000000){const v=n/1000000;return (v>=10?v.toFixed(0):v.toFixed(1)).replace(/\.0$/,"")+"M"}
    if(n>=1000){const v=n/1000;return (v>=100?v.toFixed(0):v.toFixed(1)).replace(/\.0$/,"")+"K"}
    return String(n);
  }
  function paintMute(){
    muteBtn.innerHTML=muted?ICON.muted:ICON.sound;
    muteBtn.setAttribute("aria-pressed",String(!muted));
    muteBtn.setAttribute("aria-label",muted?"आवाज़ चालू करें":"आवाज़ बंद करें");
  }
  function paintPause(){
    const s=slides[active],v=videoAt(active);
    const show=!!s&&!!v&&v.paused&&s.classList.contains("is-ready")&&!s.classList.contains("is-error");
    pauseOverlay.classList.toggle("is-visible",show);
    pauseOverlay.setAttribute("aria-hidden",String(!show));
  }
  function applyMute(){
    slides.forEach((_,i)=>{const v=videoAt(i);if(v)v.muted=muted});
    paintMute();
  }
  function load(i,auto){
    if(i<0||i>=slides.length)return null;
    const s=slides[i],v=s.querySelector("video");
    if(!v)return null;
    if(!v.getAttribute("src")){v.preload=auto?"auto":"metadata";v.src=s.dataset.src;v.load()}
    else if(auto&&v.preload!=="auto"){v.preload="auto"}
    return v;
  }
  function playActive(){
    if(document.hidden||userPaused||active<0)return;
    const current=active;
    slides.forEach((_,i)=>{if(i!==current){const o=videoAt(i);if(o&&!o.paused)o.pause()}});
    const v=load(current,true);
    if(!v)return;
    v.muted=muted;
    pauseOverlay.classList.remove("is-visible");
    const p=v.play();
    if(p&&p.then){
      p.then(()=>{if(active===current)paintPause()}).catch(()=>{if(active===current)paintPause()});
    }
  }
  function pauseAll(){slides.forEach((_,i)=>{const v=videoAt(i);if(v&&!v.paused)v.pause()})}
  function updateProgress(v){
    const d=v&&isFinite(v.duration)?v.duration:0;
    const p=d?Math.min(100,Math.max(0,(v.currentTime/d)*100)):0;
    progressBar.style.width=p.toFixed(2)+"%";
  }
  function updateCounts(i){
    const n=slides.length?((i%slides.length)+slides.length)%slides.length:0;
    const isLiked=!!liked[i],isSaved=!!saved[i];
    likeCountEl.textContent=format(LIKES[n%LIKES.length]+(isLiked?1:0));
    commentCountEl.textContent=format(COMMENTS[n%COMMENTS.length]);
    shareCountEl.textContent=format(SHARES[n%SHARES.length]);
    saveCountEl.textContent=format(SAVES[n%SAVES.length]+(isSaved?1:0));
    likeBtn.classList.toggle("is-liked",isLiked);
    likeBtn.setAttribute("aria-pressed",String(isLiked));
    likeBtn.setAttribute("aria-label",isLiked?"पसंद हटाएँ":"पसंद करें");
    saveBtn.classList.toggle("is-saved",isSaved);
    saveBtn.setAttribute("aria-pressed",String(isSaved));
    saveBtn.setAttribute("aria-label",isSaved?"सेव हटाएँ":"सेव करें");
  }
  function loadAround(){load(active,true);load(active-1,false);load(active+1,false)}
  function activateVisible(){loadAround();if(!userPaused)playActive()}

  function setActive(i,opts){
    if(!slides.length)return;
    i=Math.max(0,Math.min(slides.length-1,i));
    if(i===active&&!(opts&&opts.force))return;
    if(i!==active){const prev=videoAt(active);if(prev&&!prev.paused)prev.pause();userPaused=false}
    active=i;
    slides.forEach((s,n)=>s.classList.toggle("is-active",n===i));
    countEl.textContent=(i+1)+"/"+slides.length;
    updateCounts(i);
    progressBar.style.width="0%";
    pauseOverlay.classList.remove("is-visible");
    activateVisible();
  }

  function togglePlay(){
    const v=videoAt(active);
    if(!v)return;
    if(v.paused){
      userPaused=false;
      v.muted=muted;
      pauseOverlay.classList.remove("is-visible");
      const p=v.play();
      if(p&&p.catch)p.catch(()=>paintPause());
    }else{
      userPaused=true;
      v.pause();
      paintPause();
    }
  }

  function bindSlide(slide,i){
    const v=slide.querySelector("video");
    if(!v)return;
    v.addEventListener("click",()=>{if(active!==i)setActive(i);else togglePlay()});
    v.addEventListener("play",()=>{if(i===active)paintPause()});
    v.addEventListener("pause",()=>{if(i===active)paintPause()});
    v.addEventListener("playing",()=>{slide.classList.add("is-ready");if(i===active)paintPause()});
    v.addEventListener("loadeddata",()=>slide.classList.add("is-ready"));
    v.addEventListener("canplay",()=>slide.classList.add("is-ready"));
    v.addEventListener("waiting",()=>{if(i===active)slide.classList.remove("is-ready")});
    v.addEventListener("error",()=>{slide.classList.add("is-error");slide.classList.remove("is-ready");if(i===active){paintPause();progressBar.style.width="0%"}});
    v.addEventListener("timeupdate",()=>{if(i===active)updateProgress(v)});
    v.addEventListener("loadedmetadata",()=>{if(i===active)updateProgress(v)});
    v.addEventListener("seeking",()=>{if(i===active)updateProgress(v)});
    v.addEventListener("seeked",()=>{if(i===active)updateProgress(v)});
  }

  function build(found){
    loading.hidden=true;
    if(!found.length){countEl.textContent="0/0";empty.hidden=false;ui.hidden=true;track.hidden=true;pauseOverlay.classList.remove("is-visible");return}
    empty.hidden=true;
    track.hidden=false;
    ui.hidden=false;
    track.replaceChildren();
    slides=found.map((src,idx)=>{
      const art=document.createElement("article");
      art.className="reel-slide";
      art.dataset.src=src;
      art.innerHTML='<video class="reel-video" playsinline loop muted preload="none" aria-label="शादी की झलकी '+(idx+1)+'"></video><div class="reel-load" aria-hidden="true"><span class="reels-spin"></span></div><div class="reel-err" role="status"><span class="reel-err-ic" aria-hidden="true">⚠</span><p>यह वीडियो अभी नहीं चल सका।</p></div>';
      bindSlide(art,idx);
      track.appendChild(art);
      return art;
    });
    liked=found.map(()=>false);
    saved=found.map(()=>false);
    applyMute();
    setActive(0,{force:true});
    viewport.scrollTop=0;
  }

  async function probe(src){
    const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),12000);
    try{
      let res=await fetch(src,{method:"HEAD",cache:"no-store",signal:ctl.signal});
      if(res.status===405||res.status===501){
        res=await fetch(src,{headers:{Range:"bytes=0-0"},cache:"no-store",signal:ctl.signal});
      }
      if(!res.ok&&res.status!==206)return false;
      const type=(res.headers.get("content-type")||"").toLowerCase();
      return !type||type.startsWith("video/")||type.includes("mp4")||type.includes("octet-stream");
    }catch(e){return false}
    finally{clearTimeout(timer)}
  }

  (async()=>{const ok=await Promise.all(srcs.map(probe));build(srcs.filter((_,i)=>ok[i]))})();

  viewport.addEventListener("scroll",()=>{
    if(scrollRaf)return;
    scrollRaf=requestAnimationFrame(()=>{
      scrollRaf=0;
      const h=viewport.clientHeight;
      if(!h)return;
      const i=Math.round(viewport.scrollTop/h);
      if(i!==active)setActive(i);
    });
  },{passive:true});

  viewport.addEventListener("keydown",e=>{
    if(!slides.length)return;
    if(sheet.classList.contains("is-open")||shareSheet.classList.contains("is-open"))return;
    let n=null;
    if(e.key==="ArrowDown"||e.key==="PageDown"||e.key==="ArrowRight")n=active+1;
    else if(e.key==="ArrowUp"||e.key==="PageUp"||e.key==="ArrowLeft")n=active-1;
    else if(e.key===" "){e.preventDefault();togglePlay();return}
    else if(e.key==="Home"){e.preventDefault();n=0}
    else if(e.key==="End"){e.preventDefault();n=slides.length-1}
    if(n!==null){e.preventDefault();n=Math.max(0,Math.min(slides.length-1,n));viewport.scrollTo({top:n*viewport.clientHeight,behavior:reduce?"auto":"smooth"})}
  });

  window.addEventListener("resize",()=>{
    if(!slides.length)return;
    cancelAnimationFrame(resizeRaf);
    resizeRaf=requestAnimationFrame(()=>{
      const h=viewport.clientHeight;
      if(h)viewport.scrollTop=active*h;
    });
  });

  muteBtn.addEventListener("click",()=>{muted=!muted;applyMute()});
  likeBtn.addEventListener("click",()=>{
    if(active<0)return;
    const on=!liked[active];
    liked[active]=on;
    updateCounts(active);
    if(on){likeBtn.classList.remove("is-liked");void likeBtn.offsetWidth;likeBtn.classList.add("is-liked")}
  });
  saveBtn.addEventListener("click",()=>{
    if(active<0)return;
    saved[active]=!saved[active];
    updateCounts(active);
  });
  followBtn.addEventListener("click",()=>{
    following=!following;
    followBtn.textContent=following?"Following":"Follow";
    followBtn.classList.toggle("is-following",following);
    followBtn.setAttribute("aria-pressed",String(following));
  });

  function renderComments(){
    commentsEl.replaceChildren();
    const frag=document.createDocumentFragment();
    SAMPLE_COMMENTS.forEach(c=>{
      const row=document.createElement("div");row.className="reels-comment";
      const av=document.createElement("span");av.className="reels-cavatar";av.style.setProperty("--ca",c.c);av.textContent=c.i;av.setAttribute("aria-hidden","true");
      const body=document.createElement("div");body.className="reels-cbody";
      const u=document.createElement("div");u.className="cu";u.textContent=c.n;
      const t=document.createElement("p");t.className="ct";t.textContent=c.t;
      const meta=document.createElement("div");meta.className="reels-cmeta";
      const time=document.createElement("span");time.textContent=c.time;
      const likes=document.createElement("span");likes.textContent="❤ "+c.likes;
      meta.append(time,likes);body.append(u,t,meta);row.append(av,body);frag.appendChild(row);
    });
    commentsEl.appendChild(frag);
  }

  function syncLock(){document.body.classList.toggle("reels-sheet-open",sheet.classList.contains("is-open")||shareSheet.classList.contains("is-open"))}
  function openSheet(el,trigger){
    if(el===sheet){if(shareSheet.classList.contains("is-open"))closeSheet(shareSheet,false)}
    else if(sheet.classList.contains("is-open"))closeSheet(sheet,false);
    el._lastFocus=trigger||document.activeElement;
    clearTimeout(el._timer);
    el.hidden=false;
    requestAnimationFrame(()=>{el.classList.add("is-open");syncLock()});
  }
  function closeSheet(el,restore){
    el.classList.remove("is-open");
    clearTimeout(el._timer);
    el._timer=setTimeout(()=>{el.hidden=true},360);
    syncLock();
    if(restore!==false&&el._lastFocus&&document.contains(el._lastFocus))el._lastFocus.focus({preventScroll:true});
  }

  commentBtn.addEventListener("click",()=>{
    if(active<0)return;
    sheetCount.textContent=format(COMMENTS[active%COMMENTS.length]);
    renderComments();
    openSheet(sheet,commentBtn);
    setTimeout(()=>{if(sheet.classList.contains("is-open"))sheetClose.focus({preventScroll:true})},380);
  });
  sheetClose.addEventListener("click",()=>closeSheet(sheet));
  shareClose.addEventListener("click",()=>closeSheet(shareSheet));
  [sheet,shareSheet].forEach(el=>{const bd=el.querySelector(".reels-sheet-backdrop");if(bd)bd.addEventListener("click",()=>closeSheet(el))});

  function shareUrl(){try{return new URL("reels.html",location.href).href}catch(e){return location.href}}
  function shareText(){return "आयुष ♥ पूजा — हमारी शादी की झलकियाँ देखें ❤️"}
  function openShareSheet(url,text,trigger){
    shareWa.href="https://wa.me/?text="+encodeURIComponent(text+"\n"+url);
    shareStatus.textContent="";
    shareSheet._url=url;
    shareSheet._text=text;
    openSheet(shareSheet,trigger||shareBtn);
  }
  async function doShare(trigger){
    const url=shareUrl(),text=shareText(),data={title:"Wedding Reels — आयुष ♥ पूजा",text,url};
    if(navigator.share&&(!navigator.canShare||navigator.canShare(data))){
      try{await navigator.share(data);return}catch(e){if(e&&e.name==="AbortError")return}
    }
    openShareSheet(url,text,trigger);
  }
  shareBtn.addEventListener("click",()=>doShare(shareBtn));
  navShare.addEventListener("click",()=>doShare(navShare));

  async function copyText(text){
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(text);return true}
    }catch(e){}
    try{
      const t=document.createElement("textarea");
      t.value=text;
      t.setAttribute("readonly","");
      t.style.position="fixed";
      t.style.top="0";
      t.style.left="-9999px";
      t.style.opacity="0";
      document.body.appendChild(t);
      t.focus();
      t.select();
      t.setSelectionRange(0,t.value.length);
      const ok=document.execCommand("copy");
      t.remove();
      return ok;
    }catch(e){return false}
  }
  shareCopy.addEventListener("click",async()=>{
    const text=(shareSheet._text||shareText())+"\n"+(shareSheet._url||shareUrl());
    const ok=await copyText(text);
    shareStatus.textContent=ok?"लिंक कॉपी हो गया ✓":"लिंक कॉपी नहीं हो सका";
  });

  const sameSiteReferrer=(()=>{
    try{
      const r=new URL(document.referrer);
      return r.origin===location.origin&&(r.pathname.endsWith("/")||r.pathname.endsWith("/index.html"));
    }catch(e){return false}
  })();
  closeBtn.addEventListener("click",e=>{
    if(sameSiteReferrer&&history.length>1){e.preventDefault();history.back()}
  });

  document.addEventListener("keydown",e=>{
    if(e.key!=="Escape")return;
    if(sheet.classList.contains("is-open")){closeSheet(sheet);return}
    if(shareSheet.classList.contains("is-open")){closeSheet(shareSheet);return}
    closeBtn.click();
  });

  document.addEventListener("visibilitychange",()=>{
    if(document.hidden)pauseAll();
    else if(!userPaused)playActive();
  });

  paintMute();
})();
