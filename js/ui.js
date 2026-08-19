// ui.js — DANBO World
// Selection transition fallback used only when the 3D hero launch is unavailable.
var _planeAnim=null;
function _startPlaneAnim(fromX,fromY,toX,toY,callback){
    var pc=document.getElementById('traveler-route-canvas');if(!pc)return callback();
    pc.style.display='block';
    var pctx=pc.getContext('2d');
    pc.width=pc.parentElement.offsetWidth;pc.height=pc.parentElement.offsetHeight;
    // Plane engine sound
    var _planeCtx=ensureAudio();
    var _planeNodes=[];
    if(_planeCtx&&sfxEnabled){try{
        // Jet whoosh — filtered noise + rising pitch
        var dur=1.5;
        var nb=_planeCtx.createBuffer(1,Math.floor(_planeCtx.sampleRate*dur),_planeCtx.sampleRate);
        var nd=nb.getChannelData(0);
        for(var si=0;si<nd.length;si++){var p=si/nd.length;nd[si]=(Math.random()-0.5)*0.3*Math.exp(-p*1.5)*(0.3+0.7*Math.sin(p*Math.PI));}
        var ns=_planeCtx.createBufferSource();ns.buffer=nb;
        var flt=_planeCtx.createBiquadFilter();flt.type='bandpass';flt.frequency.setValueAtTime(400,_planeCtx.currentTime);flt.frequency.exponentialRampToValueAtTime(2000,_planeCtx.currentTime+dur*0.7);flt.Q.value=1.5;
        var ng=_planeCtx.createGain();ng.gain.setValueAtTime(0,_planeCtx.currentTime);ng.gain.linearRampToValueAtTime(0.12,_planeCtx.currentTime+0.15);ng.gain.setValueAtTime(0.1,_planeCtx.currentTime+dur*0.6);ng.gain.exponentialRampToValueAtTime(0.005,_planeCtx.currentTime+dur);
        ns.connect(flt);flt.connect(ng);ng.connect(_planeCtx.destination);ns.start();ns.stop(_planeCtx.currentTime+dur);
        _planeNodes.push(ns);
        // Engine hum
        var eo=_planeCtx.createOscillator();eo.type='sawtooth';eo.frequency.setValueAtTime(80,_planeCtx.currentTime);eo.frequency.exponentialRampToValueAtTime(200,_planeCtx.currentTime+dur*0.8);
        var eg=_planeCtx.createGain();eg.gain.setValueAtTime(0,_planeCtx.currentTime);eg.gain.linearRampToValueAtTime(0.04,_planeCtx.currentTime+0.1);eg.gain.setValueAtTime(0.03,_planeCtx.currentTime+dur*0.6);eg.gain.exponentialRampToValueAtTime(0.003,_planeCtx.currentTime+dur);
        eo.connect(eg);eg.connect(_planeCtx.destination);eo.start();eo.stop(_planeCtx.currentTime+dur);
        _planeNodes.push(eo);
    }catch(e){}}
    // Start from character's country on map, fly off screen
    var _mapEl=document.getElementById('traveler-map-canvas');
    var sx,sy;
    if(_mapEl){
        var _mapRect=_mapEl.getBoundingClientRect();
        var _pcRect=pc.parentElement.getBoundingClientRect();
        sx=_mapRect.left-_pcRect.left+fromX/400*_mapRect.width;
        sy=_mapRect.top-_pcRect.top+fromY/220*_mapRect.height;
    } else {
        sx=fromX/400*pc.width;sy=fromY/220*pc.height*0.6+pc.height*0.15;
    }
    // Hardcoded endpoint: fly off screen right
    var ex=pc.width+60;
    var ey=pc.height*0.3;
    var t=0;
    _planeAnim=setInterval(function(){
        t+=0.02;
        pctx.clearRect(0,0,pc.width,pc.height);
        var cx=sx+(ex-sx)*t;var cy=sy+(ey-sy)*t-Math.sin(t*Math.PI)*50;
        // Trail
        pctx.strokeStyle='rgba(255,255,255,0.3)';pctx.lineWidth=2;
        pctx.beginPath();pctx.moveTo(sx,sy);
        pctx.quadraticCurveTo((sx+cx)/2,Math.min(sy,cy)-40,cx,cy);
        pctx.stroke();
        // Plane
        pctx.fillStyle='#FFFFFF';
        pctx.beginPath();
        var dx=ex-sx,dy=ey-sy;
        var angle=Math.atan2(dy-Math.cos(t*Math.PI)*50*(Math.PI),dx);
        pctx.save();pctx.translate(cx,cy);pctx.rotate(angle);
        pctx.moveTo(12,0);pctx.lineTo(-10,-7);pctx.lineTo(-6,0);pctx.lineTo(-10,7);
        pctx.closePath();pctx.fill();pctx.restore();
        if(t>=1){
            clearInterval(_planeAnim);_planeAnim=null;
            pc.style.display='none';
            callback();
        }
    },30);
}

function _updateTravelerSelect(idx){
    var ch=CHARACTERS[idx];
    // Update name (egg characters have no nationality — name only, no flag/English)
    var nameEl=document.getElementById('traveler-char-name');
    if(nameEl)nameEl.textContent=ch.name;
    // The current select screen uses the same real-time 3D mascot model as gameplay.
    if(typeof window._update3DCharacterSelect==='function')window._update3DCharacterSelect(idx);
}

CHARACTERS.forEach((ch,i) => {
    const cell = document.createElement('div');
    cell.className = 'char-cell' + (i===0?' selected':'');
    cell.dataset.charIndex=String(i);
    cell.setAttribute('role','button');
    cell.setAttribute('tabindex','0');
    cell.setAttribute('aria-label',ch.name);
    cell.style.setProperty('--card-rgb',((ch.accent>>16)&255)+','+((ch.accent>>8)&255)+','+(ch.accent&255));
    var num=document.createElement('span');num.className='char-number';num.textContent=String(i+1).padStart(2,'0');cell.appendChild(num);
    var fallback=document.createElement('span');fallback.className='char-fallback';fallback.textContent=ch.icon;cell.appendChild(fallback);
    var label=document.createElement('span');label.className='char-label';label.textContent=ch.name;cell.appendChild(label);
    cell.addEventListener('click', () => {
        document.querySelectorAll('.char-cell').forEach(c=>c.classList.remove('selected'));
        cell.classList.add('selected');
        selectedChar = i;
        _updateTravelerSelect(i);
        if(typeof window._play3DSelectCardGesture==='function')window._play3DSelectCardGesture(i);
        playMenuMove();
    });
    cell.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();cell.click();}});
    if (charGrid) charGrid.appendChild(cell);
});

// ---- State ----
let gameState = 'menu'; // menu, city, raceIntro, racing, raceResult
let coins = 0, nearPortal = null, countdownTimer = null;
// ---- Tower of Babel state ----
var _babylonTriggered=false, _babylonTower=null, _babylonRising=false, _babylonRiseY=-52;
var _earthquakeTimer=0, _earthquakeIntensity=0;
var _babylonPromptDismissed=false;
var _babylonElevator=false, _babylonElevDir=0, _babylonElevY=0; // elevator ride state
var _moonPipePromptOpen=false, _moonPipeDismissed=false; // moon pipe prompt state
let raceCoinScore = 0;
let finishedEggs=[], playerFinished=false, trackLength=0, currentRaceIndex=-1;

// ---- Jump charge system ----
var _jumpCharging=false, _jumpCharge=0, _jumpChargeMax=60, _jumpChargeBar=null;
