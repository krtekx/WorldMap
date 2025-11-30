(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))D(a);new MutationObserver(a=>{for(const d of a)if(d.type==="childList")for(const k of d.addedNodes)k.tagName==="LINK"&&k.rel==="modulepreload"&&D(k)}).observe(document,{childList:!0,subtree:!0});function m(a){const d={};return a.integrity&&(d.integrity=a.integrity),a.referrerPolicy&&(d.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?d.credentials="include":a.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function D(a){if(a.ep)return;a.ep=!0;const d=m(a);fetch(a.href,d)}})();const ke=[{id:1,y:40.8,x:51.4,lat:49.7597,lng:16.6647,title:"Moravská Třebová",description:"Domov L. V. Holzmaistera a sídlo muzea, kam zasílal své sbírky.",image:"/assets/images/item_24.jpg",region:"Europe",visitDate:"1885"},{id:2,y:47.3,x:55.5,lat:31.2001,lng:29.9187,title:"Egypt - Alexandrie",description:"Starověký přístav. Získání koptských textilií.",image:"/assets/images/item_18.jpg",region:"North Africa",visitDate:"1891"},{id:3,y:47.3,x:56.9,lat:30.0444,lng:31.2357,title:"Egypt - Káhira",description:"Centrum obchodu na Blízkém východě. Nákup starožitností na trhu Chán al-Chalílí.",image:"/assets/images/item_17.jpg",region:"North Africa",visitDate:"1891"},{id:4,y:48.9,x:57.7,lat:29.9668,lng:32.5498,title:"Egypt - Suez",description:"Průjezd Suezským průplavem, klíčovým bodem cesty na východ.",image:"/assets/images/item_19.jpg",region:"North Africa",visitDate:"1891"},{id:5,y:52,x:62,lat:12.8654,lng:45.0187,title:"Jemen - Aden",description:"Důležitá zastávka pro doplnění uhlí. Nákup aromatických pryskyřic.",image:"/assets/images/item_20.jpg",region:"Middle East",visitDate:"1891"},{id:6,y:54.2,x:70.1,lat:6.9271,lng:79.8612,title:"Srí Lanka - Kolombo",description:"Zastávka na cestě do Asie. Nákup drahokamů a tradičních masek.",image:"/assets/images/item_7.jpg",region:"South Asia",visitDate:"1891"},{id:7,y:56.9,x:75.6,lat:1.3521,lng:103.8198,title:"Singapur",description:"Křižovatka obchodních cest. Zde se Holzmaister setkal s obchodníky z celého světa.",image:"/assets/images/item_12.jpg",region:"South East Asia",visitDate:"1891"},{id:8,y:58.3,x:77.2,lat:-6.2088,lng:106.8456,title:"Indonésie - Batávie (Jakarta)",description:"Nizozemská východní Indie. Sběr krisů (tradičních dýk) a batikovaných látek.",image:"/assets/images/item_11.jpg",region:"South East Asia",visitDate:"1891"},{id:9,y:54.4,x:74.9,lat:13.7563,lng:100.5018,title:"Thajsko - Bangkok",description:"Království Siam. Návštěva chrámů a získání sošky Buddhy.",image:"/assets/images/item_13.jpg",region:"South East Asia",visitDate:"1892"},{id:10,y:51.7,x:68.2,lat:19.076,lng:72.8777,title:"Indie - Bombaj",description:"Vstupní brána do Indie. Fascinace rušnými trhy a architekturou viktoriánské gotiky.",image:"/assets/images/item_8.jpg",region:"South Asia",visitDate:"1892"},{id:11,y:48.9,x:68,lat:28.7041,lng:77.1025,title:"Indie - Dillí",description:"Návštěva Červené pevnosti a získání mogulskejch miniatur.",image:"/assets/images/item_9.jpg",region:"South Asia",visitDate:"1892"},{id:12,y:50.1,x:70.7,lat:25.3176,lng:82.9739,title:"Indie - Váránasí",description:"Posvátné město na Ganze. Pozorování rituálů a nákup rituálních nádob.",image:"/assets/images/item_10.jpg",region:"South Asia",visitDate:"1892"},{id:13,y:48.8,x:79.4,lat:31.2304,lng:121.4737,title:"Čína - Šanghaj",description:"Rušný přístav a brána do Číny. Sbírka obsahuje porcelánové vázy z dynastie Čching zakoupené na nábřeží Bund.",image:"/assets/images/item_4.jpg",region:"East Asia",visitDate:"1892"},{id:14,y:51.9,x:76.6,lat:22.3193,lng:114.1694,title:"Čína - Hongkong",description:"Britská kolonie v době návštěvy. Holzmaistera fascinovala směs východní a západní architektury.",image:"/assets/images/item_5.jpg",region:"East Asia",visitDate:"1892"},{id:15,y:47.2,x:78.3,lat:39.9042,lng:116.4074,title:"Čína - Peking",description:"Návštěva Zakázaného města. Získání tradičního hedvábného oděvu pro muzeum.",image:"https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=800",region:"East Asia",visitDate:"1892"},{id:16,y:44.5,x:85.3,lat:35.4437,lng:139.638,title:"Japonsko - Jokohama",description:"Hlavní přístav, kterým Holzmaister připlul do Japonska. Zde zakoupil 'Japonské album' s ručně kolorovanými fotografiemi.",image:"/assets/images/item_3.jpg",region:"East Asia",visitDate:"1893"},{id:17,y:46.2,x:84.5,lat:35.6762,lng:139.6503,title:"Japonsko - Tokio",description:"Císařské město, kde Holzmaister strávil několik týdnů. Zde získal vzácné lakované krabičky a samurajské doplňky.",image:"/assets/images/item_1.jpg",region:"East Asia",visitDate:"1893"},{id:18,y:45.3,x:83.9,lat:35.0116,lng:135.7681,title:"Japonsko - Kjóto",description:"Starobylé hlavní město. Fotografie zachycuje chrám Kinkaku-dži, který Holzmaister navštívil během období kvetoucích sakur.",image:"/assets/images/item_2.jpg",region:"East Asia",visitDate:"1893"},{id:19,y:61.2,x:95.1,lat:-17.7134,lng:178.065,title:"Fidži",description:"Exotická zastávka v Pacifiku. Ukázky domorodého umění.",image:"/assets/images/item_25.jpg",region:"Oceania",visitDate:"1893"},{id:20,y:68.1,x:94.1,lat:-36.8485,lng:174.7633,title:"Nový Zéland - Auckland",description:"Setkání s Maorskou kulturou. Do sbírky přibyly řezby ze dřeva a nefritu.",image:"/assets/images/item_16.jpg",region:"Oceania",visitDate:"1893"},{id:21,y:65.1,x:88.2,lat:-33.8688,lng:151.2093,title:"Austrálie - Sydney",description:"Přístavní město v Oceánii. Získání domorodých artefaktů a bumerangů.",image:"/assets/images/item_14.jpg",region:"Australia",visitDate:"1893"},{id:22,y:67.6,x:86.8,lat:-37.8136,lng:144.9631,title:"Austrálie - Melbourne",description:"Bohaté město díky zlaté horečce. Návštěva botanických zahrad.",image:"/assets/images/item_15.jpg",region:"Australia",visitDate:"1893"},{id:23,y:46.4,x:58.4,lat:31.7683,lng:35.2137,title:"Jeruzalém",description:"Svaté město. Získání upomínkových předmětů z olivového dřeva.",image:"/assets/images/item_21.jpg",region:"Middle East",visitDate:"1894"},{id:24,y:45.1,x:58.7,lat:33.5138,lng:36.2765,title:"Damašek",description:"Jedno z nejstarších měst. Obdivování damašské oceli a látek.",image:"/assets/images/item_22.jpg",region:"Middle East",visitDate:"1894"},{id:25,y:44.8,x:28.2,lat:40.7128,lng:-74.006,title:"New York",description:"Dlouhodobé působení Holzmaistera v USA, odkud podporoval muzeum.",image:"/assets/images/item_23.jpg",region:"North America",visitDate:"1895-1920"}],Le="antigravity_gem_hints",Me="antigravity_revealed_gems";function We(s=25){let r=Ke();return(!r||Object.keys(r).length===0)&&(r=ut(s),mt(r)),r}function ut(s){const r={},m=[1,2,3,4,5];return Array.from({length:s},(k,q)=>q+1).sort(()=>Math.random()-.5).slice(0,5).forEach((k,q)=>{r[k]=m[q]}),r}function Ke(){try{const s=localStorage.getItem(Le);return s?JSON.parse(s):{}}catch(s){return console.error("Error loading gem hints:",s),{}}}function mt(s){try{localStorage.setItem(Le,JSON.stringify(s))}catch(r){console.error("Error saving gem hints:",r)}}function pt(s){return Ke()[s]||null}function Ve(){try{const s=localStorage.getItem(Me);return s?JSON.parse(s):[]}catch(s){return console.error("Error loading revealed gems:",s),[]}}function gt(s){try{localStorage.setItem(Me,JSON.stringify(s))}catch(r){console.error("Error saving revealed gems:",r)}}function vt(s,r){const m=Ve(),D=r.filter(d=>d.type===s).map(d=>d.id),a=[...new Set([...m,...D])];return gt(a),a}function Qe(s){return Ve().includes(s)}function ft(){localStorage.removeItem(Le),localStorage.removeItem(Me)}const Se=[{id:1,x:15.5,y:23.2,code:"TRA-1888",type:1,revealed:!1},{id:2,x:45.3,y:12.8,code:"TRA-3421",type:1,revealed:!1},{id:3,x:72.1,y:65.4,code:"TRA-5692",type:1,revealed:!1},{id:4,x:45.8,y:67.3,code:"MOR-2341",type:2,revealed:!1},{id:5,x:18.6,y:54.7,code:"MOR-7823",type:2,revealed:!1},{id:6,x:83.2,y:28.9,code:"MOR-4156",type:2,revealed:!1},{id:7,x:78.2,y:34.6,code:"JAP-5729",type:3,revealed:!1},{id:8,x:32.4,y:78.1,code:"JAP-9184",type:3,revealed:!1},{id:9,x:56.7,y:19.3,code:"JAP-2637",type:3,revealed:!1},{id:10,x:62.1,y:52.8,code:"IND-8432",type:4,revealed:!1},{id:11,x:24.8,y:38.5,code:"IND-1947",type:4,revealed:!1},{id:12,x:91.3,y:71.2,code:"IND-5281",type:4,revealed:!1},{id:13,x:88.7,y:71.4,code:"AUS-3156",type:5,revealed:!1},{id:14,x:12.9,y:58.6,code:"AUS-7429",type:5,revealed:!1},{id:15,x:67.5,y:43.9,code:"AUS-8163",type:5,revealed:!1}];let K=null;function ht(s,r,m=[],D=null){pe();const a=document.createElement("div");a.classList.add("modal-overlay");const d=m.findIndex(v=>v.id===s.id),k=(d-1+m.length)%m.length,q=(d+1)%m.length,w=pt(s.id);let X="";if(w){const v=Se.some(F=>F.type===w&&Qe(F.id));X=`
        <div class="gem-hint-bar">
            <div class="gem-hint-content">
                <img src="/assets/gems/gem_0${w}.png" alt="Gem Hint" class="gem-hint-icon">
                <div class="gem-hint-text">
                    <strong>Hidden Gem Detected!</strong>
                    <span>This location holds a clue to finding rare crystals.</span>
                </div>
                <button class="${v?"gem-reveal-btn disabled":"gem-reveal-btn"}" data-gem-type="${w}" ${v?"disabled":""}>
                    ${v?"Gems Revealed!":"Unhide Gems on Map"}
                </button>
            </div>
        </div>
      `}a.innerHTML=`
    <div class="modal-content">
      <div class="modal-image-container">
        ${X}
        <img src="${s.image}" alt="${s.title}" class="modal-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
        <div class="modal-image-placeholder" style="display: none;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="1">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>Chybí fotografie</span>
        </div>
        <div class="modal-region-tag">${s.region}</div>
      </div>
      <div class="modal-info">
        <button class="close-button">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
        <div class="modal-location-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
            </svg>
            LOKACE Č. ${s.id}
        </div>
        <h2 class="modal-title">${s.title}</h2>
        ${s.visitDate?`<div class="modal-visit-date">Navštíveno: ${s.visitDate}</div>`:""}
        <div class="modal-divider"></div>
        <p class="modal-description">${s.description}</p>
        
        <div class="modal-nav-buttons">
            <button class="nav-btn prev-btn">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Předchozí
            </button>
            <button class="nav-btn next-btn">
                Další
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>

        <div class="modal-footer">Sbírka L. V. Holzmaistera</div>
      </div>
    </div>
    `,r.appendChild(a),requestAnimationFrame(()=>{a.classList.add("active")}),a.querySelector(".close-button").addEventListener("click",pe),a.addEventListener("click",v=>{v.target===a&&pe()});const E=a.querySelector(".gem-reveal-btn");E&&!E.classList.contains("disabled")&&E.addEventListener("click",v=>{v.stopPropagation();const y=parseInt(E.dataset.gemType);vt(y,Se),E.textContent="Gems Revealed!",E.classList.add("disabled"),E.disabled=!0,window.dispatchEvent(new CustomEvent("gemRevealed",{detail:{gemType:y}}))}),D&&(a.querySelector(".prev-btn").addEventListener("click",()=>{a.classList.remove("active"),setTimeout(()=>{a.parentNode&&a.parentNode.removeChild(a),K=null,D(k)},3e3)}),a.querySelector(".next-btn").addEventListener("click",()=>{a.classList.remove("active"),setTimeout(()=>{a.parentNode&&a.parentNode.removeChild(a),K=null,D(q)},3e3)})),K=a}function pe(){if(K){const s=K;s.classList.remove("active"),setTimeout(()=>{s.parentNode&&s.parentNode.removeChild(s)},3e3),K=null}}class yt{constructor(r){this.onStart=r,this.overlay=null,this.init()}init(){this.overlay=document.createElement("div"),this.overlay.classList.add("idle-screen-overlay"),this.overlay.innerHTML=`
            <div class="start-game-container">
                <img src="/assets/start_jorney.png" class="start-game-bg" alt="Start Journey">
                <button class="start-game-btn">
                    <img src="/assets/start_button.png" alt="Start Game">
                </button>
            </div>
        `,this.overlay.style.cssText=`
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s ease;
        `,document.body.appendChild(this.overlay);const r=this.overlay.querySelector(".start-game-btn");r&&r.addEventListener("click",m=>{m.stopPropagation(),this.hide(),this.onStart&&this.onStart()})}show(){this.overlay&&(console.log("Showing Start Page"),this.overlay.style.opacity="1",this.overlay.style.pointerEvents="auto",setTimeout(()=>{window.dispatchEvent(new CustomEvent("gameReset"))},100))}hide(){this.overlay&&(console.log("Hiding Start Page"),this.overlay.style.opacity="0",this.overlay.style.pointerEvents="none")}}let Ze,Ue;const bt=6e4,xt=12e4;let ve=null;function kt(){console.log("=== IDLE TIMER INIT START ==="),ve=new yt(()=>{console.log("Start Game clicked - starting idle tracking"),Et()}),console.log("Initializing IdleTimer - Showing Start Page"),requestAnimationFrame(()=>{ve.show(),setTimeout(()=>{window.dispatchEvent(new CustomEvent("gameReset"))},100)}),console.log("=== IDLE TIMER INIT END ===")}function Et(){console.log("Starting idle tracking..."),R(),["mousedown","mousemove","keypress","scroll","touchstart","click"].forEach(r=>{document.addEventListener(r,R,{passive:!0})})}function R(){clearTimeout(Ze),clearTimeout(Ue),Ue=setTimeout(St,bt),Ze=setTimeout(Lt,xt)}function St(){console.log("1 minute idle - resetting zoom..."),window.dispatchEvent(new CustomEvent("zoomReset"))}function Lt(){console.log("2 minutes idle - showing Start Game page..."),pe(),ve&&ve.show(),window.dispatchEvent(new CustomEvent("gameReset"))}let ge=null;function Mt(s,r){Ee();const m=document.createElement("div");m.classList.add("gem-modal-overlay");const a=`/assets/gems/gem_0${s.type||s.id%5+1}.png`;m.innerHTML=`
        <div class="gem-modal-content">
            <div class="gem-modal-icon">
                <img src="${a}" alt="Gem" style="width: 80px; height: 80px; object-fit: contain;">
            </div>
            <h2 class="gem-modal-title">Hidden Artifact Found!</h2>
            <p class="gem-modal-subtitle">You have discovered a secret location.</p>
            <div class="gem-modal-code-label">SECRET CODE</div>
            <div class="gem-modal-code">${s.code}</div>
            <button class="gem-modal-close">Close</button>
        </div>
    `,r.appendChild(m),requestAnimationFrame(()=>{m.classList.add("active")}),m.querySelector(".gem-modal-close").addEventListener("click",Ee),m.addEventListener("click",k=>{k.target===m&&Ee()}),ge=m}function Ee(){if(ge){const s=ge;s.classList.remove("active"),setTimeout(()=>{s.parentNode&&s.parentNode.removeChild(s)},500),ge=null}}const wt="/assets/WorldMap_bg_1k.jpg",Tt="/assets/WorldMap_bg_2k.jpg",Dt="/assets/WorldMap_bg_4k.jpg",At="/assets/WorldMap_bg_8k.jpg",qt="/assets/16k_aa.jpg",jt="/assets/16k_ab.jpg",zt="/assets/16k_ba.jpg",Yt="/assets/16k_bb.jpg";function It(s,r){let m=1,D=0,a=0,d=!1,k=!1,q=null,w=[...ke],X=[...Se],N=!1,E={x:0,y:0},v=0,y=0,j=1,S=1,F=.5,ee=!1,we=0,Te=0,De=0,fe=0;We(ke.length);const p=document.createElement("div");p.classList.add("map-content-wrapper"),s.appendChild(p);const te=document.createElement("div");te.classList.add("map-background-container");const O=[{src:wt,res:"1k",element:null},{src:Tt,res:"2k",element:null},{src:Dt,res:"4k",element:null},{src:At,res:"8k",element:null}],et=[{src:qt,position:"top-left",element:null},{src:jt,position:"top-right",element:null},{src:zt,position:"bottom-left",element:null},{src:Yt,position:"bottom-right",element:null}];O.forEach((e,t)=>{const n=document.createElement("img");n.src=e.src,n.classList.add("map-layer"),n.dataset.res=e.res,t===0?n.classList.add("base-layer"):n.classList.add("overlay-layer"),n.ondragstart=i=>i.preventDefault(),te.appendChild(n),e.element=n});const W=document.createElement("div");W.classList.add("tiles-16k-container"),W.style.cssText=`
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
        z-index: 2;
    `,et.forEach(e=>{const t=document.createElement("img");t.src=e.src,t.style.cssText="width: 100%; height: 100%; display: block; object-fit: cover;",t.ondragstart=n=>n.preventDefault(),W.appendChild(t),e.element=t}),te.appendChild(W),p.appendChild(te);let ne=0,Ae=0,qe=!1,je=!1,ze=null;const tt=300;function nt(){let e=0,t=!1;return m<=1?e=0:m<=2?e=1:m<=4?e=2:m<=8?e=3:(e=3,t=!0),(e!==Ae||t!==je)&&(Ae=e,je=t,clearTimeout(ze),ze=setTimeout(()=>{st(e,t)},tt)),qe?Ye():O[ne].src.split("/").pop()}function Ye(){const e=s.getBoundingClientRect(),t=e.width/2,n=e.height/2,i=(t-_)/M,l=(n-C)/M,c=p.offsetWidth,g=p.offsetHeight,f=i/c*100,T=l/g*100;let Y="";return T<50?Y=f<50?"16k_aa.jpg":"16k_ab.jpg":Y=f<50?"16k_ba.jpg":"16k_bb.jpg",Y}function st(e,t=!1){ne=e,qe=t,O.forEach((i,l)=>{l<=e?l>0&&(t&&l===3?i.element.classList.remove("active"):i.element.classList.add("active")):i.element.classList.remove("active")}),t?W.style.opacity="1":W.style.opacity="0";const n=t?Ye():O[ne].src.split("/").pop();xe(n)}let M=1,_=0,C=0,u=1,b=0,x=0;const Z=16;let se=null,Ie;const it=6e4;function $(){clearTimeout(Ie),Ie=setTimeout(()=>{u=ie(),b=0,x=0,z()},it)}$();function ie(){const e=s.offsetWidth,t=s.offsetHeight;p.offsetWidth;const n=p.offsetHeight||t;return n===0?1:Math.max(1,t/n)}let he=null;function Pe(e,t=!0){if(e<0||e>=w.length)return;const n=w[e];p.querySelectorAll(".map-point").forEach(h=>h.classList.remove("active"));const l=p.querySelector(`.map-point[data-id="${n.id}"]`);l&&l.classList.add("active");const c=s.getBoundingClientRect(),g=c.width/2,f=c.height/2,T=p.offsetWidth,Y=p.offsetHeight,I=n.x/100*T,P=n.y/100*Y;if(t){let h=u*2;h<2&&(h=2),h>Z&&(h=Z),u=h,he=h}else he&&(u=he);b=g-I*u,x=f-P*u,z(),se=()=>{ht(n,r,w,h=>{Pe(h,!1)}),R(),$()}}function oe(){p.querySelectorAll(".map-point").forEach(t=>t.remove()),w.forEach((t,n)=>{const i=document.createElement("div");i.classList.add("map-point"),d&&i.classList.add("draggable"),i.style.left=`${t.x}%`,i.style.top=`${t.y}%`,i.dataset.id=t.id;const l=document.createElement("div");l.classList.add("map-point-label"),l.textContent=t.title,i.appendChild(l);const c=g=>{d||(g.stopPropagation(),R(),$(),Pe(n))};i.addEventListener("click",c),i.addEventListener("touchstart",g=>{d||c(g)},{passive:!0}),i.addEventListener("mousedown",g=>{d&&(g.stopPropagation(),k=!0,q=t.id,i.classList.add("dragging"))}),p.appendChild(i)})}oe();function ye(){p.querySelectorAll(".gem-point").forEach(t=>t.remove()),X.forEach(t=>{const n=document.createElement("div");n.classList.add("gem-point"),n.style.left=`${t.x}%`,n.style.top=`${t.y}%`,n.dataset.id=t.id;const i=t.type||t.id%5+1;n.style.backgroundImage=`url('/assets/gems/gem_0${i}.png')`,n.addEventListener("click",l=>{d||N||(l.stopPropagation(),Mt(t,r),R(),$())}),p.appendChild(n)}),be()}function be(){p.querySelectorAll(".gem-point").forEach(t=>{const n=parseInt(t.dataset.id),i=Qe(n);M>=8||i?(t.classList.add("visible"),i&&M<8?t.classList.add("revealed-low-zoom"):t.classList.remove("revealed-low-zoom")):(t.classList.remove("visible"),t.classList.remove("revealed-low-zoom"))})}window.addEventListener("gemRevealed",()=>{be()}),window.addEventListener("zoomReset",()=>{console.log("Zoom resetting to initial view..."),u=ie(),b=0,x=0,z()}),window.addEventListener("gameReset",()=>{console.log("Game Resetting..."),ft();const e=[];for(let n=1;n<=5;n++)for(let i=0;i<3;i++)e.push(n);for(let n=e.length-1;n>0;n--){const i=Math.floor(Math.random()*(n+1));[e[n],e[i]]=[e[i],e[n]]}X.forEach((n,i)=>{i<e.length&&(n.type=e[i])}),We(ke.length),ye(),u=ie(),b=0,x=0,z()}),ye();function z(){const e=s.offsetWidth,t=s.offsetHeight,n=p.offsetWidth,i=p.offsetHeight,l=ie();u<l&&(u=l),u>Z&&(u=Z);const c=0,g=e-n*u,f=0,T=t-i*u;b=Math.min(Math.max(b,g),c),x=Math.min(Math.max(x,T),f)}function ot(e){return e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2}const at=.05;let H=null,G={version:"...",prompts:0,timeSpentMinutes:0};async function lt(){try{G=await(await fetch("/production.json")).json(),xe(O[ne].src.split("/").pop())}catch(e){console.error("Failed to load production data",e)}}function Re(e){const t=Math.floor(e/60),n=e%60;return`${t}h ${n}m`}function rt(){H=document.createElement("div"),H.classList.add("debug-panel"),H.innerHTML=`
            <div class="debug-version">v${G.version} | P: ${G.prompts} | T: ${Re(G.timeSpentMinutes)}</div>
            <div class="debug-date">${new Date().toLocaleDateString("cs-CZ")}</div>
            <div class="debug-bg">BG: <span class="debug-bg-name">...</span></div>
            <div class="debug-zoom">Zoom: <span class="debug-zoom-value">1.00x</span></div>
            <div class="debug-coords">X: <span class="debug-x">0</span>% Y: <span class="debug-y">0</span>%</div>
        `,document.body.appendChild(H)}function xe(e){if(!H)return;const t=H.querySelector(".debug-version"),n=H.querySelector(".debug-bg-name"),i=H.querySelector(".debug-zoom-value"),l=H.querySelector(".debug-x"),c=H.querySelector(".debug-y");t&&(t.textContent=`v${G.version} | P: ${G.prompts} | T: ${Re(G.timeSpentMinutes)}`),n&&(n.textContent=e),i&&(i.textContent=`${M.toFixed(2)}x`),l&&(l.textContent=E.x.toFixed(1)),c&&(c.textContent=E.y.toFixed(1))}rt(),lt();function _e(){const e=Math.abs(b-_),t=Math.abs(x-C),n=Math.abs(u-M),i=Math.sqrt(e*e+t*t)+n*100,c=Math.min(i/1e3,1),g=ot(1-c),f=at+g*.05;_+=(b-_)*f,C+=(x-C)*f,M+=(u-M)*f,Math.abs(b-_)<.5&&Math.abs(x-C)<.5&&Math.abs(u-M)<.005&&(_=b,C=x,M=u,se&&(se(),se=null)),p.style.transform=`translate(${_}px, ${C}px) scale(${M})`;const Y=nt();xe(Y),be(),m=M,D=_,a=C,requestAnimationFrame(_e)}requestAnimationFrame(_e),s.addEventListener("wheel",e=>{e.preventDefault(),R(),$();const t=s.getBoundingClientRect(),n=e.clientX-t.left,i=e.clientY-t.top,l=(n-b)/u,c=(i-x)/u,g=-e.deltaY,f=1.2;g>0?u*=f:u/=f,z(),b=n-l*u,x=i-c*u,z()},{passive:!1}),s.addEventListener("dblclick",e=>{e.preventDefault(),R(),$();const t=s.getBoundingClientRect(),n=e.clientX-t.left,i=e.clientY-t.top;let c=u*2;c>Z&&(c=Z);const g=t.width/2,f=t.height/2,T=(n-b)/u,Y=(i-x)/u;u=c,b=g-T*u,x=f-Y*u,z()});let U=!1,B=0,J=0,ae=null,Ce=1;function He(e){const t=e[0].clientX-e[1].clientX,n=e[0].clientY-e[1].clientY;return Math.hypot(t,n)}function Xe(e){const t=(e[0].clientX+e[1].clientX)/2,n=(e[0].clientY+e[1].clientY)/2;return{x:t,y:n}}function Ne(e){if(!(d&&k))if(R(),$(),e.touches){if(e.touches.length===1)U=!0,B=e.touches[0].clientX,J=e.touches[0].clientY,s.style.cursor="grabbing";else if(e.touches.length===2){U=!1,ae=He(e.touches),Ce=u;const t=Xe(e.touches);B=t.x,J=t.y}}else U=!0,B=e.clientX,J=e.clientY,s.style.cursor="grabbing"}function $e(e){R(),$();const t=e.clientX||(e.touches?e.touches[0].clientX:0),n=e.clientY||(e.touches?e.touches[0].clientY:0),i=s.getBoundingClientRect(),l=t-i.left,c=n-i.top,g=(l-_)/M,f=(c-C)/M,T=p.offsetWidth,Y=p.offsetHeight;if(E.x=g/T*100,E.y=f/Y*100,d&&k&&q){e.preventDefault();let I=E.x,P=E.y;I=Math.max(0,Math.min(100,I)),P=Math.max(0,Math.min(100,P));const h=p.querySelector(`.map-point[data-id="${q}"]`);h&&(h.style.left=`${I}%`,h.style.top=`${P}%`);const Q=w.findIndex(dt=>dt.id===q);Q!==-1&&(w[Q].x=Math.round(I*10)/10,w[Q].y=Math.round(P*10)/10);const me=o.querySelector(".coord-x"),Je=o.querySelector(".coord-y");me&&Je&&(me.textContent=I.toFixed(1),Je.textContent=P.toFixed(1));return}if(e.touches&&e.touches.length===2){e.preventDefault();const I=He(e.touches);if(ae){const P=I/ae;u=Ce*P;const h=Xe(e.touches),Q=h.x-B,me=h.y-J;b+=Q,x+=me,B=h.x,J=h.y,z()}}else if(U){e.preventDefault();const I=t-B,P=n-J;b+=I,x+=P,B=t,J=n,z()}}function Fe(e){if(N&&!U){if(e.clientX||e.changedTouches&&e.changedTouches[0].clientX,e.clientY||e.changedTouches&&e.changedTouches[0].clientY,e.target.closest(".edit-mode-ui")||e.target.closest(".map-point"))return;const t={id:X.length+1,x:Math.round(E.x*10)/10,y:Math.round(E.y*10)/10,code:ct()};X.push(t),ye();return}if(U=!1,ae=null,s.style.cursor="default",k){k=!1;const t=p.querySelector(`.map-point[data-id="${q}"]`);t&&t.classList.remove("dragging"),q=null}}function ct(){const e=["TRA","MOR","JAP","IND","AUS","EGY","CHN"],t=e[Math.floor(Math.random()*e.length)],n=Math.floor(Math.random()*9e3)+1e3;return`${t}-${n}`}s.addEventListener("mousedown",Ne),s.addEventListener("touchstart",Ne,{passive:!1}),window.addEventListener("mousemove",$e),window.addEventListener("touchmove",$e,{passive:!1}),window.addEventListener("mouseup",Fe),window.addEventListener("touchend",Fe),window.addEventListener("resize",()=>{z()}),O[0].element&&(O[0].element.onload=()=>{z(),_=b,C=x,M=u});const V=document.createElement("div");V.classList.add("admin-trigger"),V.innerHTML=`
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
        </svg>
    `,V.title="Edit Mode",document.body.appendChild(V);const A=document.createElement("div");A.classList.add("reference-overlay"),p.insertBefore(A,p.firstChild);const le=document.createElement("div");le.classList.add("ref-handle","ref-handle-top"),le.innerHTML='<div class="handle-line"></div>',A.appendChild(le);const re=document.createElement("div");re.classList.add("ref-handle","ref-handle-bottom"),re.innerHTML='<div class="handle-line"></div>',A.appendChild(re),A.addEventListener("mousedown",e=>{!d||!A.classList.contains("active")||e.target.closest(".ref-handle")||(ee=!0,we=e.clientX,Te=e.clientY,De=v,fe=y,A.style.cursor="grabbing",e.stopPropagation())}),window.addEventListener("mousemove",e=>{if(ee){const t=e.clientX-we,n=e.clientY-Te;v=De+t,y=fe+n,o.querySelector(".input-ref-x").value=v.toFixed(1),o.querySelector(".input-ref-y").value=y.toFixed(1),L()}}),window.addEventListener("mouseup",()=>{ee&&(ee=!1,A.style.cursor="grab")});let ce=!1,de=null,Oe=0,ue=1;function Ge(e,t){!d||!A.classList.contains("active")||(ce=!0,de=t,Oe=e.clientY,ue=S,e.stopPropagation(),e.preventDefault())}le.addEventListener("mousedown",e=>Ge(e,"top")),re.addEventListener("mousedown",e=>Ge(e,"bottom")),window.addEventListener("mousemove",e=>{if(ce){const n=(e.clientY-Oe)/500;if(de==="top"){S=Math.max(.1,Math.min(3,ue-n));const i=s.offsetHeight;y=fe+(ue-S)*i}else de==="bottom"&&(S=Math.max(.1,Math.min(3,ue+n)));o.querySelector(".input-ref-scaley").value=S.toFixed(2),o.querySelector(".input-ref-y").value=y.toFixed(1),L()}}),window.addEventListener("mouseup",()=>{ce&&(ce=!1,de=null)});const o=document.createElement("div");o.classList.add("edit-mode-ui"),o.innerHTML=`
        <button class="btn-close-edit">X</button>
        <div class="edit-mode-indicator">EDIT MODE ACTIVE</div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <button class="btn-toggle-ref">Toggle Reference Map</button>
            <button class="btn-toggle-gems">Add Gems Mode</button>
            <button class="btn-submit">Save Locations</button>
            <button class="btn-save-gems">Save Gems</button>
        </div>
        
        <div class="ref-controls-panel">
            <div class="ref-controls-title">Reference Map Controls</div>
            
            <div class="control-group">
                <label>Position X:</label>
                <button class="btn-adjust" data-action="x-minus">-</button>
                <input type="number" class="input-ref-x" value="0" step="0.1">
                <button class="btn-adjust" data-action="x-plus">+</button>
            </div>
            
            <div class="control-group">
                <label>Position Y:</label>
                <button class="btn-adjust" data-action="y-minus">-</button>
                <input type="number" class="input-ref-y" value="0" step="0.1">
                <button class="btn-adjust" data-action="y-plus">+</button>
            </div>
            
            <div class="control-group">
                <label>Scale X:</label>
                <button class="btn-adjust" data-action="scalex-minus">-</button>
                <input type="number" class="input-ref-scalex" value="1.0" step="0.01" min="0.1" max="3">
                <button class="btn-adjust" data-action="scalex-plus">+</button>
            </div>
            
            <div class="control-group">
                <label>Scale Y:</label>
                <button class="btn-adjust" data-action="scaley-minus">-</button>
                <input type="number" class="input-ref-scaley" value="1.0" step="0.01" min="0.1" max="3">
                <button class="btn-adjust" data-action="scaley-plus">+</button>
            </div>
            
            <div class="control-group">
                <label>Opacity:</label>
                <input type="range" class="input-ref-opacity" min="0" max="1" step="0.05" value="0.5">
                <span class="opacity-value">0.5</span>
            </div>
            
            <div class="control-group">
                <button class="btn-reset-ref">Reset Reference Map</button>
            </div>
            
            <div class="control-group">
                <button class="btn-auto-position">Auto-Position All Points</button>
            </div>
            
            <div class="coordinate-display">
                <div>Mouse: <span class="coord-x">--</span>%, <span class="coord-y">--</span>%</div>
            </div>
        </div>
    `,document.body.appendChild(o);const Be=e=>{d=e,d?(o.classList.add("active"),oe()):(o.classList.remove("active"),A.classList.remove("active"),oe())};V.addEventListener("click",()=>Be(!0)),o.querySelector(".btn-close-edit").addEventListener("click",()=>Be(!1)),o.querySelector(".btn-toggle-ref").addEventListener("click",()=>{A.classList.toggle("active")}),o.querySelector(".btn-toggle-gems").addEventListener("click",e=>{N=!N,e.target.textContent=N?"Stop Adding Gems":"Add Gems Mode",e.target.style.backgroundColor=N?"#FF6B6B":"",s.style.cursor=N?"crosshair":"default"}),o.querySelector(".btn-submit").addEventListener("click",()=>{const e="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(w,null,2)),t=document.createElement("a");t.setAttribute("href",e),t.setAttribute("download","locations.json"),document.body.appendChild(t),t.click(),t.remove()}),o.querySelector(".btn-save-gems").addEventListener("click",()=>{const e="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(X,null,2)),t=document.createElement("a");t.setAttribute("href",e),t.setAttribute("download","gems.json"),document.body.appendChild(t),t.click(),t.remove()});function L(){A.style.transform=`translate(${v}px, ${y}px) scale(${j}, ${S})`,A.style.opacity=F}o.querySelector('[data-action="x-minus"]').addEventListener("click",()=>{v-=.1,o.querySelector(".input-ref-x").value=v.toFixed(1),L()}),o.querySelector('[data-action="x-plus"]').addEventListener("click",()=>{v+=.1,o.querySelector(".input-ref-x").value=v.toFixed(1),L()}),o.querySelector(".input-ref-x").addEventListener("input",e=>{v=parseFloat(e.target.value)||0,L()}),o.querySelector('[data-action="y-minus"]').addEventListener("click",()=>{y-=.1,o.querySelector(".input-ref-y").value=y.toFixed(1),L()}),o.querySelector('[data-action="y-plus"]').addEventListener("click",()=>{y+=.1,o.querySelector(".input-ref-y").value=y.toFixed(1),L()}),o.querySelector(".input-ref-y").addEventListener("input",e=>{y=parseFloat(e.target.value)||0,L()}),o.querySelector('[data-action="scalex-minus"]').addEventListener("click",()=>{j=Math.max(.1,j-.01),o.querySelector(".input-ref-scalex").value=j.toFixed(2),L()}),o.querySelector('[data-action="scalex-plus"]').addEventListener("click",()=>{j=Math.min(3,j+.01),o.querySelector(".input-ref-scalex").value=j.toFixed(2),L()}),o.querySelector(".input-ref-scalex").addEventListener("input",e=>{j=parseFloat(e.target.value)||1,L()}),o.querySelector('[data-action="scaley-minus"]').addEventListener("click",()=>{S=Math.max(.1,S-.01),o.querySelector(".input-ref-scaley").value=S.toFixed(2),L()}),o.querySelector('[data-action="scaley-plus"]').addEventListener("click",()=>{S=Math.min(3,S+.01),o.querySelector(".input-ref-scaley").value=S.toFixed(2),L()}),o.querySelector(".input-ref-scaley").addEventListener("input",e=>{S=parseFloat(e.target.value)||1,L()}),o.querySelector(".input-ref-opacity").addEventListener("input",e=>{F=parseFloat(e.target.value),o.querySelector(".opacity-value").textContent=F.toFixed(2),L()}),o.querySelector(".btn-reset-ref").addEventListener("click",()=>{v=0,y=0,j=1,S=1,F=.5,o.querySelector(".input-ref-x").value=0,o.querySelector(".input-ref-y").value=0,o.querySelector(".input-ref-scalex").value=1,o.querySelector(".input-ref-scaley").value=1,o.querySelector(".input-ref-opacity").value=.5,o.querySelector(".opacity-value").textContent="0.50",L()}),s.addEventListener("mousemove",e=>{if(!d)return;const t=s.getBoundingClientRect(),n=e.clientX-t.left-D,i=e.clientY-t.top-a;let l=n/(t.width*m)*100,c=i/(t.height*m)*100;l=Math.max(0,Math.min(100,l)),c=Math.max(0,Math.min(100,c)),o.querySelector(".coord-x").textContent=l.toFixed(1),o.querySelector(".coord-y").textContent=c.toFixed(1)}),o.querySelector(".btn-auto-position").addEventListener("click",()=>{function e(i,l){const c=(l+180)/360*100,g=i*Math.PI/180,T=(1-Math.log(Math.tan(Math.PI/4+g/2))/Math.PI)*50;return{x:c,y:T}}const t=p.offsetWidth,n=p.offsetHeight;w.forEach(i=>{if(i.lat!==void 0&&i.lng!==void 0){const l=e(i.lat,i.lng);let c=l.x/100*t,g=l.y/100*n;c=c*j,g=g*S,c=c+v,g=g+y;const f=c/t*100,T=g/n*100;i.x=Math.round(f*10)/10,i.y=Math.round(T*10)/10}}),oe(),alert("All points have been auto-positioned based on their geographic coordinates and the current reference map alignment!")}),document.addEventListener("click",R),document.addEventListener("touchstart",R,{passive:!0})}document.addEventListener("DOMContentLoaded",()=>{const s=document.querySelector("#app");s&&(s.innerHTML=`
      <div class="kiosk-container">
        <div id="map-container"></div>
        <div id="modal-container"></div>
      </div>
    `,It(document.querySelector("#map-container"),document.querySelector("#modal-container")),kt())});
