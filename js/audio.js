// audio.js — DANBO World
// ---- Audio System (procedural, no files needed) ----
let audioCtx=null, soundEnabled=true, sfxEnabled=true, _audioUnlocked=false;
function _danboPluginBusyForAudio(){
    return !!(window._danboPluginTransition||(window.DANBO_PLUGIN_HOST&&window.DANBO_PLUGIN_HOST.getActive&&window.DANBO_PLUGIN_HOST.getActive()));
}
// iOS 17+ audio session hint
try{if(navigator.audioSession)navigator.audioSession.type='transient';}catch(e){}
// Pause/resume audio when tab loses/gains focus
document.addEventListener('visibilitychange',function(){
    if(document.hidden){
        if(audioCtx&&audioCtx.state==='running')audioCtx.suspend();
    } else {
        if(audioCtx&&audioCtx.state==='suspended'&&soundEnabled){
            // Mute SFX briefly, stop all BGM before resume to prevent overlap
            window._sfxMuted=true;
            stopBGM();stopSelectBGM();stopTitleBGM();if(typeof stopRaceBGM==='function')stopRaceBGM();
            setTimeout(function(){
                if(audioCtx)audioCtx.resume();
                // Restart appropriate BGM after resume
                setTimeout(function(){
                    if(!_danboPluginBusyForAudio())window._sfxMuted=false;
                    if(gameState==='city'&&!_danboPluginBusyForAudio())startBGM();
                    else if(gameState==='menu')startTitleBGM();
                    else if(gameState==='select')startSelectBGM();
                },500);
            },300);
        }
    }
});
function ensureAudio(){
    if(!audioCtx){
        var AC=window.AudioContext||window.webkitAudioContext;
        if(AC)audioCtx=new AC();
    }
    if(audioCtx&&audioCtx.state==='suspended')audioCtx.resume();
    return audioCtx;
}
// Silent HTML audio element trick — helps unlock on iOS Safari
var _silentAudio=null;
function _playSilentHtml(){
    if(_silentAudio)return;
    try{
        _silentAudio=document.createElement('audio');
        _silentAudio.setAttribute('playsinline','');
        _silentAudio.setAttribute('webkit-playsinline','');
        // Tiny silent WAV data URI
        _silentAudio.src='data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
        _silentAudio.volume=0.01;
        _silentAudio.play().catch(function(){});
    }catch(e){}
}
// Mobile audio unlock — aggressive multi-strategy approach
function _unlockAudio(){
    if(_audioUnlocked&&audioCtx&&audioCtx.state==='running')return;
    // Strategy 1: silent HTML audio element (iOS needs this)
    _playSilentHtml();
    // Strategy 2: create AudioContext inside gesture
    if(!audioCtx){
        var AC=window.AudioContext||window.webkitAudioContext;
        if(AC)audioCtx=new AC();
    }
    if(!audioCtx)return;
    // Strategy 3: resume + silent buffer
    audioCtx.resume();
    try{
        var b=audioCtx.createBuffer(1,1,audioCtx.sampleRate||22050);
        var s=audioCtx.createBufferSource();s.buffer=b;s.connect(audioCtx.destination);s.start(0);
    }catch(e){}
    if(audioCtx.state==='running')_audioUnlocked=true;
    // Strategy 4: check again after a tick
    setTimeout(function(){
        if(audioCtx&&audioCtx.state==='running')_audioUnlocked=true;
        else if(audioCtx)audioCtx.resume();
        // Start title BGM once audio is unlocked and we're on start screen
        if(_audioUnlocked&&!titleBgmPlaying&&gameState==='menu'){
            var ss=document.getElementById('start-screen');
            if(ss&&ss.classList.contains('active'))startTitleBGM();
        }
    },100);
}
// Keep retrying on every touch/click/key until unlocked
document.addEventListener('touchstart',_unlockAudio,{passive:true});
document.addEventListener('touchend',_unlockAudio,{passive:true});
document.addEventListener('click',_unlockAudio);
document.addEventListener('pointerdown',_unlockAudio,{passive:true});
document.addEventListener('keydown',_unlockAudio);

// Music toggle button
var musicBtn=document.getElementById("music-btn");
if(musicBtn) musicBtn.addEventListener("click",function(){
    soundEnabled=!soundEnabled;
    musicBtn.textContent=soundEnabled?"🎵":"🚫";
    musicBtn.classList.toggle("muted",!soundEnabled);
    if(!soundEnabled){stopBGM();stopRaceBGM();stopSelectBGM();stopTitleBGM();}
    else if(gameState==="city"&&!_danboPluginBusyForAudio()) startBGM();
    else if(gameState==="racing"||gameState==="raceIntro") startRaceBGM(currentRaceIndex);
});
// SFX toggle button
var sfxBtn=document.getElementById("sfx-btn");
if(sfxBtn) sfxBtn.addEventListener("click",function(){
    sfxEnabled=!sfxEnabled;
    sfxBtn.textContent=sfxEnabled?"🔊":"🔇";
    sfxBtn.classList.toggle("muted",!sfxEnabled);
});

// Language toggle button — dropdown menu
var _langOrder=['auto','zhs','zht','ja','en'];
var _langLabels={auto:'Auto',zhs:'\u7B80\u4F53\u4E2D\u6587',zht:'\u7E41\u9AD4\u4E2D\u6587',ja:'\u65E5\u672C\u8A9E',en:'English'};
var _langShort={auto:'',zhs:'\u7B80',zht:'\u7E41',ja:'JP',en:'EN'};
var _autoLabels={zhs:'\u81EA\u52A8',zht:'\u81EA\u52D5',ja:'\u81EA\u52D5',en:'Auto'};
var langBtn=document.getElementById("lang-btn");
var _langMenuOpen=false, _langMenu=null;
function _getLangBtnText(){
    if(_langMode==='auto')return '\uD83C\uDF10'+(_autoLabels[_langCode]||'Auto');
    return '\uD83C\uDF10'+(_langShort[_langMode]||'');
}
function _closeLangMenu(){
    if(_langMenu&&_langMenu.parentNode){_langMenu.parentNode.removeChild(_langMenu);}
    _langMenu=null;_langMenuOpen=false;
}
function _openLangMenu(){
    if(_langMenuOpen){_closeLangMenu();return;}
    _langMenuOpen=true;
    _langMenu=document.createElement('div');
    _langMenu.style.cssText='position:absolute;top:100%;right:0;margin-top:4px;background:rgba(0,0,0,0.85);border:2px solid rgba(255,255,255,0.3);border-radius:10px;padding:4px 0;min-width:130px;backdrop-filter:blur(8px);z-index:99;';
    for(var li=0;li<_langOrder.length;li++){
        (function(code){
            var item=document.createElement('div');
            var isActive=(code===_langMode);
            var label=_langLabels[code];
            if(code==='auto')label=(_autoLabels[_langCode]||'Auto')+' ('+_langLabels[_autoLangCode]+')';
            item.textContent=(isActive?'\u2714 ':'\u2003 ')+label;
            item.style.cssText='padding:7px 14px;color:#fff;font-size:14px;cursor:pointer;white-space:nowrap;'+(isActive?'background:rgba(255,255,255,0.15);':'');
            item.addEventListener('mouseenter',function(){item.style.background='rgba(255,255,255,0.2)';});
            item.addEventListener('mouseleave',function(){item.style.background=isActive?'rgba(255,255,255,0.15)':'';});
            item.addEventListener('click',function(e){
                e.stopPropagation();
                _langMode=code;
                if(_langMode==='auto'){_langCode=_autoLangCode;}
                else{_langCode=_langMode;}
                try{localStorage.setItem('danbo_lang',_langMode);}catch(e2){}
                _applyLang();
                _closeLangMenu();
            });
            _langMenu.appendChild(item);
        })(_langOrder[li]);
    }
    langBtn.style.position='relative';
    langBtn.appendChild(_langMenu);
    // Close on outside click
    setTimeout(function(){
        document.addEventListener('click',_langMenuOutsideClick,{once:true});
    },0);
}
function _langMenuOutsideClick(e){
    if(_langMenu&&!_langMenu.contains(e.target)&&e.target!==langBtn){_closeLangMenu();}
    else if(_langMenuOpen){setTimeout(function(){document.addEventListener('click',_langMenuOutsideClick,{once:true});},0);}
}
function _applyLang(){
    // Re-localize arrays
    for(var i=0;i<CHARACTERS.length;i++){CHARACTERS[i].name=I18N.charNames[_langCode][i]||CHARACTERS[i].name;}
    for(var i=0;i<CITY_STYLES.length;i++){CITY_STYLES[i].name=I18N.cityNames[_langCode][i]||CITY_STYLES[i].name;}
    for(var i=0;i<RACES.length;i++){RACES[i].name=I18N.raceNames[_langCode][i]||RACES[i].name;RACES[i].desc=I18N.raceDescs[_langCode][i]||RACES[i].desc;}
    // Re-localize HTML
    document.documentElement.lang=_langCode==='zhs'?'zh-CN':_langCode==='zht'?'zh-TW':_langCode==='ja'?'ja':'en';
    document.title=L('title');
    var h1=document.querySelector('#start-screen h1');if(h1)h1.textContent=L('title');
    var sub=document.querySelector('.subtitle');if(sub)sub.textContent=L('subtitle');
    var ver=document.querySelector('.version-text');if(ver)ver.textContent=L('version');
    var slo=document.querySelector('.slogan-text');if(slo)slo.textContent=L('slogan');
    var sb=document.getElementById('start-btn');if(sb)sb.textContent=L('startBtn');
    var st=document.querySelector('.select-title');if(st)st.textContent=L('selectTitle');
    var cb=document.getElementById('confirm-btn');if(cb)cb.textContent=L('confirmBtn');
    var py=document.getElementById('portal-yes');if(py)py.textContent=L('portalYes');
    var pn=document.getElementById('portal-no');if(pn)pn.textContent=L('portalNo');
    var mb=document.getElementById('music-btn');if(mb)mb.title=L('music');
    var sb2=document.getElementById('sfx-btn');if(sb2)sb2.title=L('sfx');
    var pills=document.querySelectorAll('#city-hud .hud-pill');
    if(pills.length>=3)pills[2].textContent=L('grabThrow');
    var zh=document.getElementById('zoom-hud');if(zh)zh.textContent=L('zoomHint');
    var rb=document.getElementById('race-back-btn');if(rb)rb.textContent=L('raceBack');
    var bc=document.getElementById('back-city-btn');if(bc)bc.textContent=L('backCity');
    var rt=document.getElementById('result-title');if(rt)rt.textContent=L('resultDone');
    var gb=document.getElementById('grab-btn');if(gb)gb.textContent=L('grab');
    var jb=document.getElementById('jump-btn');if(jb)jb.textContent=L('jump');
    var pb=document.getElementById('punch-btn');if(pb)pb.textContent=L('punch');
    var kb=document.getElementById('kick-btn');if(kb)kb.textContent=L('kick');
    var cn=document.getElementById('city-name-hud');if(cn)cn.textContent=CITY_STYLES[currentCityStyle].name;
    var pn2=document.getElementById('traveler-char-name');if(pn2&&CHARACTERS[selectedChar])pn2.textContent=CHARACTERS[selectedChar].name;
    if(langBtn)langBtn.textContent=_getLangBtnText();
    // Update struggle bar text
    var stText=document.getElementById('struggle-text');if(stText)stText.textContent=L('struggle');
    // Update chat placeholder
    var chatF=document.getElementById('chat-field');if(chatF)chatF.placeholder=L('chatPlaceholder');
    // Rebuild travel-beacon signs with new city names
    if(typeof buildWarpPipes==='function'&&typeof cityGroup!=='undefined'&&gameState==='city'){buildWarpPipes();}
    // Update portal names/descs to match new language
    if(typeof portals!=='undefined'){
        for(var pi2=0;pi2<portals.length;pi2++){
            var _pr=portals[pi2];
            if(_pr.raceIndex>=0&&_pr.raceIndex<RACES.length){
                _pr.name=RACES[_pr.raceIndex].name;
                _pr.desc=RACES[_pr.raceIndex].desc;
            }else if(_pr._i18nName||_pr._i18nDesc){
                if(_pr._i18nName)_pr.name=_pr._i18nName[_langCode]||_pr._i18nName.en||_pr._i18nName.zhs||_pr.name;
                if(_pr._i18nDesc)_pr.desc=_pr._i18nDesc[_langCode]||_pr._i18nDesc.en||_pr._i18nDesc.zhs||_pr.desc;
            }
        }
    }
    // Portal signs are canvas textures - rebuild them would need full portal rebuild
    // Just update the portal object names (prompt text uses these)
    // Rebuild move name translations from MOVE_PARAMS
    if(typeof _moveNames!=='undefined'&&typeof MOVE_PARAMS!=='undefined'){
        for(var _mk in _moveNames)delete _moveNames[_mk];
        for(var _ct2 in MOVE_PARAMS){for(var _mk2 in MOVE_PARAMS[_ct2]){var _m2=MOVE_PARAMS[_ct2][_mk2];if(_m2&&_m2.shout&&_m2.text)_moveNames[_m2.shout]=_m2.text;}}
    }
    // Update select grid cell labels
    var _cells=document.querySelectorAll('.char-cell .char-label');
    for(var ci2=0;ci2<_cells.length&&ci2<CHARACTERS.length;ci2++){
        _cells[ci2].textContent=CHARACTERS[ci2].name;
        if(_cells[ci2].parentElement)_cells[ci2].parentElement.setAttribute('aria-label',CHARACTERS[ci2].name);
    }
    // Update Traveler select if visible
    if(typeof _updateTravelerSelect==='function'&&typeof selectedChar!=='undefined'){_updateTravelerSelect(selectedChar);}
}
if(langBtn){
    langBtn.textContent=_getLangBtnText();
    langBtn.addEventListener("click",function(e){
        e.stopPropagation();
        _openLangMenu();
    });
}

// Background music — cheerful multi-layer procedural BGM
let bgmPlaying=false, bgmGain=null, bgmNodes=[], _bgmTimer=null;
function startBGM(){
    if(bgmPlaying||!soundEnabled)return;
    const ctx=ensureAudio(); bgmPlaying=true;
    if(ctx.state==='suspended'){ctx.resume().then(function(){if(bgmPlaying){if(currentCityStyle===5)_playMoonBGMLoop(ctx);else _playBGMLoop(ctx);}});return;}
    if(currentCityStyle===5)_playMoonBGMLoop(ctx);else _playBGMLoop(ctx);
}
function _playBGMLoop(ctx){
    // Dispatch to per-city BGM
    if(currentCityStyle===1)return _playDesertBGM(ctx);
    if(currentCityStyle===2)return _playIceBGM(ctx);
    if(currentCityStyle===3)return _playLavaBGM(ctx);
    if(currentCityStyle===4)return _playCandyBGM(ctx);
    if(currentCityStyle===6)return _playSakuraBGM(ctx);
    if(currentCityStyle===7)return _playSnowBGM(ctx);
    return _playDefaultBGM(ctx);
}
// Helper: generic looping BGM engine
// mels: array of melody arrays (e.g. [melA, melB, melC, melD])
function _bgmEngine(ctx,mels,chords,noteLen,vol,leadType,bassVol,padType){
    bgmGain=ctx.createGain();bgmGain.gain.value=vol||0.15;bgmGain.connect(ctx.destination);
    var loopCount=0;
    function playLoop(){
        if(!bgmPlaying)return;
        var now=ctx.currentTime;var mel=mels[loopCount%mels.length];loopCount++;
        for(var i=0;i<mel.length;i++){
            var o=ctx.createOscillator();var g=ctx.createGain();
            o.type=leadType||'triangle';o.frequency.setValueAtTime(mel[i],now+i*noteLen);
            o.frequency.exponentialRampToValueAtTime(mel[i]*1.01,now+i*noteLen+noteLen*0.3);
            o.frequency.exponentialRampToValueAtTime(mel[i],now+i*noteLen+noteLen*0.8);
            g.gain.setValueAtTime(0,now+i*noteLen);g.gain.linearRampToValueAtTime(0.14,now+i*noteLen+0.02);
            g.gain.setValueAtTime(0.12,now+i*noteLen+noteLen*0.5);g.gain.exponentialRampToValueAtTime(0.005,now+i*noteLen+noteLen*0.95);
            o.connect(g);g.connect(bgmGain);o.start(now+i*noteLen);o.stop(now+i*noteLen+noteLen);bgmNodes.push(o);
            if(i%2===0){var h=ctx.createOscillator();var hg=ctx.createGain();h.type='sine';h.frequency.value=mel[i]*1.25;
                hg.gain.setValueAtTime(0.04,now+i*noteLen);hg.gain.exponentialRampToValueAtTime(0.003,now+i*noteLen+noteLen*1.8);
                h.connect(hg);hg.connect(bgmGain);h.start(now+i*noteLen);h.stop(now+i*noteLen+noteLen*2);bgmNodes.push(h);}
            if(i%4===0){var ci=Math.floor(i/4)%chords.length;
                for(var cn=0;cn<chords[ci].length;cn++){var co=ctx.createOscillator();var cg=ctx.createGain();
                    co.type=padType||'sine';co.frequency.value=chords[ci][cn];cg.gain.setValueAtTime(0.035,now+i*noteLen);
                    cg.gain.exponentialRampToValueAtTime(0.005,now+i*noteLen+noteLen*3.8);co.connect(cg);cg.connect(bgmGain);
                    co.start(now+i*noteLen);co.stop(now+i*noteLen+noteLen*4);bgmNodes.push(co);}
                var bo=ctx.createOscillator();var bg2=ctx.createGain();bo.type='sine';bo.frequency.value=chords[ci][0]*0.5;
                bg2.gain.setValueAtTime(bassVol||0.1,now+i*noteLen);bg2.gain.exponentialRampToValueAtTime(0.008,now+i*noteLen+noteLen*3.8);
                bo.connect(bg2);bg2.connect(bgmGain);bo.start(now+i*noteLen);bo.stop(now+i*noteLen+noteLen*4);bgmNodes.push(bo);}
            if(i%4===0){var kb=ctx.createBuffer(1,Math.floor(ctx.sampleRate*0.08),ctx.sampleRate);var kd=kb.getChannelData(0);
                for(var s=0;s<kd.length;s++){var p=s/kd.length;kd[s]=Math.sin(p*Math.PI*8*(1-p*0.8))*0.4*Math.exp(-p*6);}
                var ks=ctx.createBufferSource();var kg=ctx.createGain();kg.gain.value=0.12;ks.buffer=kb;ks.connect(kg);kg.connect(bgmGain);
                ks.start(now+i*noteLen);ks.stop(now+i*noteLen+0.08);bgmNodes.push(ks);}
            if(i%2===1){var hb=ctx.createBuffer(1,Math.floor(ctx.sampleRate*0.03),ctx.sampleRate);var hd=hb.getChannelData(0);
                for(var s2=0;s2<hd.length;s2++)hd[s2]=(Math.random()-0.5)*0.15*Math.exp(-s2/(hd.length*0.1));
                var hs=ctx.createBufferSource();var hg2=ctx.createGain();hg2.gain.value=0.06;hs.buffer=hb;hs.connect(hg2);hg2.connect(bgmGain);
                hs.start(now+i*noteLen);hs.stop(now+i*noteLen+0.03);bgmNodes.push(hs);}
        }
        _bgmTimer=setTimeout(playLoop,mel.length*noteLen*1000);
    }
    playLoop();
}
// City 0: Default — cheerful C major
function _playDefaultBGM(ctx){
    var chords=[[262,330,392],[220,262,330],[175,220,262],[196,247,294],[262,330,392],[220,262,330],[175,220,262],[196,247,330]];
    var melA=[784,880,784,659,698,784,880,988,784,659,523,587,659,784,880,784,
              880,988,880,784,659,698,784,880,784,659,587,523,587,659,784,880,
              988,880,784,659,523,587,659,784,880,988,1047,988,880,784,659,587,523,659];
    var melB=[659,698,784,880,784,698,659,587,523,587,659,523,440,494,523,659,
              784,698,659,587,523,587,659,784,880,784,698,659,587,523,494,523,
              587,659,784,880,784,659,523,440,494,523,587,659,784,880,784,698];
    var melC=[523,587,659,784,880,988,880,784,659,587,523,494,523,587,659,784,
              988,880,784,659,587,659,784,880,988,1047,988,880,784,659,587,659,
              784,880,988,880,784,659,523,587,659,784,880,784,659,523,494,523];
    var melD=[880,784,659,523,587,659,784,880,784,698,659,587,523,440,494,523,
              659,784,880,784,659,587,523,587,659,784,880,988,880,784,698,784,
              880,988,1047,988,880,784,659,587,523,587,659,784,880,988,880,784];
    _bgmEngine(ctx,[melA,melB,melC,melD],chords,0.18,0.15,'triangle');
}
// City 1: Desert — Arabic/mysterious Phrygian mode, slower
function _playDesertBGM(ctx){
    var chords=[[220,277,330],[208,262,311],[196,247,294],[220,277,349]];
    var melA=[660,622,587,554,587,622,660,698,660,622,554,523,494,523,554,587,
              622,660,698,740,698,660,622,587,554,523,554,587,622,660,698,660];
    var melB=[698,660,622,587,554,523,554,587,622,660,698,740,698,660,622,587,
              554,523,494,523,554,587,622,660,622,587,554,523,494,466,494,523];
    var melC=[587,554,523,494,523,554,587,622,660,698,740,698,660,622,587,554,
              523,554,587,622,660,698,660,622,587,554,523,554,587,622,660,698];
    var melD=[740,698,660,622,587,554,523,494,523,554,587,622,660,698,740,784,
              740,698,660,622,587,622,660,698,660,622,587,554,523,494,523,554];
    _bgmEngine(ctx,[melA,melB,melC,melD],chords,0.24,0.13,'sawtooth',0.08);
}
// City 2: Ice — gentle, crystalline, high register
function _playIceBGM(ctx){
    var chords=[[330,415,494],[294,370,440],[262,330,392],[294,370,494]];
    var melA=[988,880,784,880,988,1047,988,880,784,698,784,880,988,1047,1175,988,
              1175,1047,988,880,784,880,988,1047,1175,1319,1175,1047,988,880,784,880,
              988,1047,1175,1047,988,880,784,698];
    var melB=[784,880,988,880,784,698,659,698,784,880,784,698,659,587,659,784,
              880,988,1047,988,880,784,698,784,880,988,880,784,698,659,698,784,
              880,988,1047,1175,1047,988,880,784];
    var melC=[1175,1047,988,880,988,1047,1175,1319,1175,1047,988,880,784,880,988,1047,
              988,880,784,698,659,698,784,880,988,1047,1175,1047,988,880,784,698,
              659,698,784,880,988,1047,988,880];
    var melD=[659,698,784,880,988,1047,988,880,784,698,784,880,988,1175,1319,1175,
              1047,988,880,784,880,988,1047,988,880,784,698,659,587,659,698,784,
              880,988,1047,1175,1319,1175,1047,988];
    _bgmEngine(ctx,[melA,melB,melC,melD],chords,0.20,0.12,'sine',0.06,'sine');
}
// City 3: Lava — heavy, dark, minor key with distorted bass
function _playLavaBGM(ctx){
    var chords=[[147,175,220],[131,165,196],[147,175,220],[165,196,247]];
    var melA=[440,415,392,349,330,349,392,440,494,440,392,349,330,294,330,349,
              392,440,494,523,494,440,392,349,330,294,262,294,330,349,392,440,
              494,523,587,523,494,440];
    var melB=[494,440,392,440,494,523,494,440,392,349,330,294,262,294,330,392,
              440,494,523,494,440,392,349,330,294,330,349,392,440,494,440,392,
              349,330,294,330,349,392];
    var melC=[330,349,392,440,494,523,587,523,494,440,392,349,330,294,262,247,
              262,294,330,349,392,440,494,440,392,349,330,349,392,440,494,523,
              587,523,494,440,392,349];
    var melD=[523,494,440,392,349,330,294,330,349,392,440,494,523,587,523,494,
              440,392,349,330,294,262,294,330,349,392,440,415,392,349,330,349,
              392,440,494,523,494,440];
    _bgmEngine(ctx,[melA,melB,melC,melD],chords,0.22,0.14,'sawtooth',0.13);
}
// City 4: Candy — bouncy, playful, major pentatonic
function _playCandyBGM(ctx){
    var chords=[[330,415,523],[294,370,440],[349,440,523],[392,494,587]];
    var melA=[523,587,659,784,659,587,523,659,784,880,784,659,523,587,659,784,
              880,988,880,784,659,587,523,587,659,784,880,784,659,523,587,659,
              784,880,988,1047,988,880,784,659,523,587,659,784,880,988,880,784];
    var melB=[880,784,659,587,523,587,659,784,880,988,880,784,659,587,523,659,
              784,880,988,1047,988,880,784,659,587,523,587,659,784,880,784,659,
              523,587,659,784,880,784,659,523,587,659,784,880,988,1047,988,880];
    var melC=[659,784,880,988,880,784,659,523,587,659,784,880,988,1047,988,880,
              784,659,523,587,659,784,880,784,659,587,523,587,659,784,880,988,
              1047,988,880,784,659,523,587,659,784,880,988,880,784,659,587,523];
    var melD=[1047,988,880,784,659,587,523,587,659,784,880,988,880,784,659,523,
              587,659,784,880,784,659,523,587,659,784,880,988,1047,988,880,784,
              659,587,523,587,659,784,880,988,1047,988,880,784,659,523,587,659];
    _bgmEngine(ctx,[melA,melB,melC,melD],chords,0.16,0.14,'triangle',0.08);
}
// City 6: Sakura — gentle Japanese pentatonic (C,D,E,G,A), slow and serene
function _playSakuraBGM(ctx){
    // Miyako-bushi scale (都節音階): C=262,Db=277,F=349,G=392,Ab=415
    // Extended with octave: C5=523,Db5=554,F5=698,G5=784,Ab5=831
    var chords=[[262,349,392],[277,349,415],[262,392,523],[349,415,523],[277,392,554],[262,349,523]];
    var melA=[523,415,392,349,277,262,277,349, 392,415,523,554,523,415,392,349,
              262,277,349,392,415,523,415,392, 349,277,262,349,392,415,523,554,
              698,523,415,392,349,277,349,392];
    var melB=[554,523,415,392,349,277,262,277, 349,392,415,523,554,698,554,523,
              415,392,349,262,277,349,392,415, 523,554,523,415,392,349,277,262,
              277,349,392,415,523,554,698,784];
    var melC=[392,349,277,262,277,349,392,415, 523,554,698,554,523,415,392,349,
              277,262,277,349,392,415,523,554, 523,415,392,349,277,262,349,392,
              415,523,554,698,554,523,415,392];
    var melD=[698,554,523,415,392,349,277,262, 277,349,392,415,523,554,698,784,
              698,554,523,415,392,349,277,349, 392,415,523,554,698,554,523,415,
              392,349,277,262,277,349,392,415];
    var melE=[262,349,392,523,415,392,349,277, 262,277,349,392,415,523,554,523,
              415,392,349,277,262,349,392,415, 523,554,698,554,523,415,392,349,
              277,262,277,349,392,415,523,554];
    var melF=[784,698,554,523,415,392,349,277, 262,277,349,392,415,523,554,698,
              784,698,554,523,415,392,349,277, 349,392,415,523,554,523,415,392,
              349,277,262,277,349,392,415,523];
    _bgmEngine(ctx,[melA,melB,melC,melD,melE,melF],chords,0.28,0.1,'triangle',0.05,'sine');
}
function _playSnowBGM(ctx){
    // Original winter-path theme: airy 6/8 phrases with irregular rests implied by repeated tones.
    // The intervals and four-part cycle were written for this project and do not target an existing song.
    var chords=[[246.94,311.13,369.99],[220.00,293.66,369.99],[277.18,329.63,415.30],[207.65,277.18,329.63]];
    var driftA=[493.88,554.37,622.25,554.37,466.16,415.30,369.99,415.30,493.88,622.25,739.99,622.25,
                554.37,493.88,415.30,369.99,415.30,466.16,554.37,493.88,415.30,369.99,329.63,369.99];
    var driftB=[369.99,415.30,493.88,554.37,493.88,415.30,369.99,329.63,369.99,466.16,554.37,622.25,
                739.99,622.25,554.37,493.88,415.30,493.88,554.37,466.16,415.30,369.99,329.63,311.13];
    var driftC=[622.25,554.37,493.88,415.30,466.16,554.37,622.25,739.99,622.25,493.88,415.30,369.99,
                329.63,369.99,415.30,493.88,554.37,493.88,415.30,369.99,415.30,466.16,415.30,369.99];
    var driftD=[415.30,493.88,554.37,622.25,554.37,493.88,415.30,369.99,329.63,369.99,415.30,466.16,
                554.37,622.25,554.37,466.16,415.30,369.99,329.63,311.13,329.63,369.99,415.30,369.99];
    _bgmEngine(ctx,[driftA,driftB,driftC,driftD],chords,0.29,0.075,'sine',0.035,'sine');
}
function stopBGM(){bgmPlaying=false;if(_bgmTimer){clearTimeout(_bgmTimer);_bgmTimer=null;}bgmNodes.forEach(function(n){try{n.stop();}catch(e){}});bgmNodes=[];if(bgmGain){bgmGain.gain.value=0;bgmGain=null;}}

// Lunaglow survey BGM ? original slow orbital pulses and glassy navigation tones.
function _playMoonBGMLoop(ctx){
    var chords=[[196.00,246.94,329.63],[174.61,220.00,293.66],[207.65,261.63,349.23],[185.00,233.08,311.13]];
    // Five-note cells rotate across a 5/4 phrase for a calm exploratory pulse.
    var orbitA=[392.00,493.88,659.25,587.33,493.88,440.00,523.25,698.46,659.25,523.25,
                493.88,392.00,440.00,523.25,587.33,659.25,587.33,493.88,440.00,392.00];
    var orbitB=[523.25,659.25,783.99,698.46,587.33,493.88,587.33,659.25,523.25,440.00,
                392.00,493.88,587.33,698.46,659.25,587.33,523.25,440.00,493.88,392.00];
    var orbitC=[440.00,523.25,659.25,783.99,698.46,587.33,493.88,392.00,493.88,587.33,
                698.46,659.25,523.25,440.00,392.00,440.00,523.25,587.33,493.88,392.00];
    _bgmEngine(ctx,[orbitA,orbitB,orbitC],chords,0.31,0.085,'sine',0.032,'triangle');
}

// Character selection BGM ? original warm traveler carousel
let selectBgmPlaying=false, selectBgmGain=null, selectBgmNodes=[], selectBgmTimer=null;
function startSelectBGM(){
    if(selectBgmPlaying||!soundEnabled)return;
    stopBGM();
    var ctx=ensureAudio();
    if(ctx.state==='suspended'){ctx.resume().then(function(){if(!selectBgmPlaying){selectBgmPlaying=true;_selectLoop(ctx);}});selectBgmPlaying=true;return;}
    selectBgmPlaying=true;_selectLoop(ctx);
}
function _selectLoop(ctx){
    // A gentle 5/4 travel motif with asymmetric phrasing, soft mallets and airy pads.
    // All sound is synthesized at runtime; no external score or style reference is used.
    selectBgmGain=ctx.createGain();selectBgmGain.gain.value=0.115;selectBgmGain.connect(ctx.destination);
    var bpm=104,step=60/bpm/2;
    var notes=[293.66,369.99,440,329.63,392,493.88,440,369.99,329.63,246.94,
               293.66,440,523.25,493.88,392,369.99,329.63,440,392,293.66];
    var pads=[[146.83,220,293.66],[164.81,246.94,329.63],[123.47,196,293.66],[146.83,233.08,349.23]];
    function tone(freq,at,dur,type,vol,cutoff){
        var o=ctx.createOscillator(),f=ctx.createBiquadFilter(),g=ctx.createGain();
        o.type=type;o.frequency.value=freq;f.type='lowpass';f.frequency.value=cutoff||1800;f.Q.value=.55;
        g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(vol,at+.025);g.gain.exponentialRampToValueAtTime(.0001,at+dur);
        o.connect(f);f.connect(g);g.connect(selectBgmGain);o.start(at);o.stop(at+dur+.03);selectBgmNodes.push(o);
    }
    function rustle(at,dur){
        var n=Math.max(1,Math.floor(ctx.sampleRate*dur)),buf=ctx.createBuffer(1,n,ctx.sampleRate),d=buf.getChannelData(0);
        for(var i=0;i<n;i++){var p=i/n;d[i]=(Math.random()*2-1)*Math.sin(Math.PI*p)*.18;}
        var src=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();src.buffer=buf;f.type='bandpass';f.frequency.value=1050;f.Q.value=.8;g.gain.value=.018;
        src.connect(f);f.connect(g);g.connect(selectBgmGain);src.start(at);src.stop(at+dur);selectBgmNodes.push(src);
    }
    function schedule(){
        if(!selectBgmPlaying)return;
        var now=ctx.currentTime+.06;
        for(var i=0;i<notes.length;i++){
            var at=now+i*step,n=notes[i];tone(n,at,step*.72,i%5===0?'sine':'triangle',i%5===0?.055:.039,1550);
            if(i%5===2)tone(n*2,at+.035,step*.46,'sine',.012,2400);
            if(i%5===0){var chord=pads[(i/5)%pads.length];for(var c=0;c<chord.length;c++)tone(chord[c],at,step*4.75,'sine',.016,1200);rustle(at+.08,step*1.2);}
            if(i%10===7)tone(n*1.5,at+.05,step*1.4,'triangle',.014,2100);
        }
        selectBgmTimer=setTimeout(schedule,notes.length*step*1000);
    }
    schedule();
}
function stopSelectBGM(){selectBgmPlaying=false;if(selectBgmTimer){clearTimeout(selectBgmTimer);selectBgmTimer=null;}selectBgmNodes.forEach(function(n){try{n.stop();}catch(e){}});selectBgmNodes=[];if(selectBgmGain){selectBgmGain.gain.value=0;selectBgmGain=null;}}

// ============================================================
// Title screen BGM - original light exploration theme
// ============================================================
var titleBgmPlaying=false, titleBgmGain=null, titleBgmNodes=[], titleBgmTimer=null;
function startTitleBGM(){
    if(titleBgmPlaying||!soundEnabled)return;
    var ctx=ensureAudio();
    if(!ctx)return;
    if(ctx.state==='suspended'){ctx.resume().then(function(){if(!titleBgmPlaying){titleBgmPlaying=true;_titleLoop(ctx);}});titleBgmPlaying=true;return;}
    titleBgmPlaying=true;_titleLoop(ctx);
}
function _titleLoop(ctx){
    // Original 6/8 exploration cue: plucked map-notes, warm pads and a light wind bell.
    // It is synthesized from oscillators/noise at runtime and imports no external audio.
    titleBgmGain=ctx.createGain();titleBgmGain.gain.value=0.12;titleBgmGain.connect(ctx.destination);
    var tempo=92,step=60/tempo/2;
    var melody=[293.66,369.99,440.00,493.88,440.00,369.99,329.63,369.99,440.00,554.37,493.88,440.00,
                293.66,329.63,369.99,440.00,369.99,329.63,246.94,293.66,369.99,329.63,293.66,246.94];
    var chords=[[146.83,220.00,293.66],[123.47,185.00,246.94],[164.81,246.94,329.63],[110.00,164.81,220.00]];
    function tone(freq,when,dur,type,vol,attack){
        var o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();o.type=type;o.frequency.value=freq;f.type='lowpass';f.frequency.value=1800;f.Q.value=.45;
        g.gain.setValueAtTime(0.0001,when);g.gain.exponentialRampToValueAtTime(vol,when+(attack||.018));g.gain.exponentialRampToValueAtTime(0.0001,when+dur);
        o.connect(f);f.connect(g);g.connect(titleBgmGain);o.start(when);o.stop(when+dur+.02);titleBgmNodes.push(o);
    }
    function breath(when,dur,vol){
        var len=Math.max(1,Math.floor(ctx.sampleRate*dur)),b=ctx.createBuffer(1,len,ctx.sampleRate),d=b.getChannelData(0);
        for(var i=0;i<len;i++){var p=i/len;d[i]=(Math.random()*2-1)*Math.sin(Math.PI*p)*.22;}
        var src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),g=ctx.createGain();src.buffer=b;filter.type='bandpass';filter.frequency.value=1250;filter.Q.value=.7;g.gain.value=vol;src.connect(filter);filter.connect(g);g.connect(titleBgmGain);src.start(when);src.stop(when+dur);titleBgmNodes.push(src);
    }
    function schedule(){
        if(!titleBgmPlaying)return;
        var now=ctx.currentTime+.06;
        for(var i=0;i<melody.length;i++){
            var at=now+i*step,note=melody[i];tone(note,at,step*.82,'triangle',i%6===0?.065:.045,.014);
            if(i%3===1)tone(note*2,at+.04,step*.38,'sine',.012,.01);
            if(i%6===0){var chord=chords[(i/6)%chords.length];for(var c=0;c<chord.length;c++)tone(chord[c],at,step*5.7,'sine',.018,.32);breath(at+.02,step*1.5,.018);}
            if(i%12===9){tone(note*2.5,at,step*2.1,'sine',.018,.006);tone(note*3,at+.08,step*1.7,'sine',.01,.006);}
        }
        titleBgmTimer=setTimeout(schedule,melody.length*step*1000);
    }
    schedule();
}
function stopTitleBGM(){titleBgmPlaying=false;if(titleBgmTimer){clearTimeout(titleBgmTimer);titleBgmTimer=null;}titleBgmNodes.forEach(function(n){try{n.stop();}catch(e){}});titleBgmNodes=[];if(titleBgmGain){titleBgmGain.gain.value=0;titleBgmGain=null;}}

// ============================================================
// Race BGM — 3 styles for 12 levels
// ============================================================
var raceBgmPlaying=false, raceBgmGain=null, raceBgmNodes=[], raceBgmTimer=null;
function stopRaceBGM(){raceBgmPlaying=false;if(raceBgmTimer){clearTimeout(raceBgmTimer);raceBgmTimer=null;}raceBgmNodes.forEach(function(n){try{n.stop();}catch(e){}});raceBgmNodes=[];if(raceBgmGain){raceBgmGain.gain.value=0;raceBgmGain=null;}}
function startRaceBGM(ri){
    if(raceBgmPlaying||!soundEnabled)return;
    stopBGM();stopSelectBGM();
    var ctx=ensureAudio();raceBgmPlaying=true;
    if(ctx.state==='suspended'){ctx.resume().then(function(){if(raceBgmPlaying)_raceBgmLoop(ctx,ri);});return;}
    _raceBgmLoop(ctx,ri);
}
function _raceBgmLoop(ctx,ri){
    raceBgmGain=ctx.createGain();raceBgmGain.gain.value=0.13;raceBgmGain.connect(ctx.destination);
    // Original route score: three neutral travel palettes selected by course group.
    var palette=(ri<4)?0:(ri<8)?1:2;
    var themes=[
        {step:0.22,root:196,scale:[0,2,5,7,9],path:[0,2,4,3,1,2,0,-1,0,3,4,2,1,3,2,0],wave:'triangle'},
        {step:0.19,root:220,scale:[0,3,5,7,10],path:[0,1,3,2,4,3,1,0,2,4,3,2,0,1,2,-1],wave:'sine'},
        {step:0.25,root:174.61,scale:[0,2,4,7,11],path:[0,2,1,3,2,4,3,1,0,1,3,4,2,1,0,-1],wave:'triangle'}
    ];
    var theme=themes[palette],cycle=0;
    function freqFor(degree){
        var oct=Math.floor(degree/theme.scale.length),idx=((degree%theme.scale.length)+theme.scale.length)%theme.scale.length;
        return theme.root*Math.pow(2,(theme.scale[idx]+oct*12)/12);
    }
    function tone(freq,at,dur,type,vol){
        var o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();
        o.type=type;o.frequency.setValueAtTime(freq,at);f.type='lowpass';f.frequency.value=1400;
        g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(vol,at+0.018);g.gain.exponentialRampToValueAtTime(0.001,at+dur);
        o.connect(f);f.connect(g);g.connect(raceBgmGain);o.start(at);o.stop(at+dur+0.02);raceBgmNodes.push(o);
    }
    function breath(at,dur,vol){
        var len=Math.max(1,Math.floor(ctx.sampleRate*dur)),b=ctx.createBuffer(1,len,ctx.sampleRate),d=b.getChannelData(0);
        for(var j=0;j<len;j++){var q=j/len;d[j]=(Math.random()*2-1)*Math.sin(Math.PI*q)*Math.exp(-q*2);}
        var src=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();src.buffer=b;f.type='bandpass';f.frequency.value=900+palette*180;f.Q.value=0.8;g.gain.value=vol;
        src.connect(f);f.connect(g);g.connect(raceBgmGain);src.start(at);src.stop(at+dur);raceBgmNodes.push(src);
    }
    function doLoop(){
        if(!raceBgmPlaying)return;
        var now=ctx.currentTime+0.04,step=theme.step,path=theme.path;
        for(var i=0;i<path.length;i++){
            var at=now+i*step,degree=path[(i+cycle)%path.length],freq=freqFor(degree+5);
            tone(freq,at,step*0.82,theme.wave,i%4===0?0.075:0.052);
            if(i%4===0){
                var bassDegree=[0,3,1,4][(i/4+cycle)%4];
                tone(freqFor(bassDegree-5),at,step*3.5,'sine',0.055);
                tone(freqFor(bassDegree),at,step*2.8,'triangle',0.018);
            }
            if(i%4===2)breath(at,step*0.55,0.018);
            if(i%8===6)tone(freq*1.5,at+step*0.12,step*1.1,'sine',0.018);
        }
        cycle=(cycle+3)%path.length;
        raceBgmTimer=setTimeout(doLoop,path.length*step*1000);
    }
    doLoop();
}
// Soft procedural walking sound with cooldown
let lastStepTime=0;
function playStepSound(){
    if(!sfxEnabled) return;
    const now=performance.now();
    if(now-lastStepTime<180) return; // min 180ms between steps
    lastStepTime=now;
    const ctx=ensureAudio();
    const t=ctx.currentTime;
    // Soft "pa" — short pitched tap
    const osc=ctx.createOscillator();
    const g=ctx.createGain();
    osc.type='sine';
    const pitch=380+Math.random()*40; // slight variation
    osc.frequency.setValueAtTime(pitch, t);
    osc.frequency.exponentialRampToValueAtTime(pitch*0.6, t+0.06);
    g.gain.setValueAtTime(0.07, t);
    g.gain.linearRampToValueAtTime(0.04, t+0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t+0.08);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t); osc.stop(t+0.08);
    // Soft "ta" layer — tiny noise pop
    const buf=ctx.createBuffer(1, Math.floor(ctx.sampleRate*0.03), ctx.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()-0.5)*0.15*Math.exp(-i/(d.length*0.15));
    const ns=ctx.createBufferSource();
    const ng=ctx.createGain(); ng.gain.value=0.04;
    ns.buffer=buf; ns.connect(ng); ng.connect(ctx.destination);
    ns.start(t+0.01); ns.stop(t+0.04);
}

// ---- Distance-based volume attenuation ----
function _sfxVolume(worldX,worldZ){
    if(!playerEgg||!playerEgg.mesh)return 1;
    if(isNaN(worldX)||isNaN(worldZ))return 0;
    return DANBO_WASM.sfxVolume(playerEgg.mesh.position.x,playerEgg.mesh.position.z,worldX,worldZ);
}

// Jump sound
function playJumpSound(srcX,srcZ){
    if(!sfxEnabled||window._sfxMuted) return;
    var _vol=(srcX!==undefined)?_sfxVolume(srcX,srcZ):1;
    if(_vol<=0)return;
    const ctx=ensureAudio();
    const osc=ctx.createOscillator();
    const g=ctx.createGain();
    osc.type='sine';
    osc.frequency.setValueAtTime(300,ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600,ctx.currentTime+0.12);
    g.gain.setValueAtTime(0.1*_vol,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.15);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime+0.15);
}

// Coin collect sound
function playCoinSound(){
    if(!sfxEnabled) return;
    const ctx=ensureAudio();
    [800,1200].forEach((f,i)=>{
        const osc=ctx.createOscillator();
        const g=ctx.createGain();
        osc.type='sine'; osc.frequency.value=f;
        g.gain.setValueAtTime(0.12,ctx.currentTime+i*0.08);
        g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+i*0.08+0.12);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(ctx.currentTime+i*0.08); osc.stop(ctx.currentTime+i*0.08+0.12);
    });
}
function playChestSound(rare){
    if(!sfxEnabled) return;
    const ctx=ensureAudio();
    const notes=rare?[523,659,784,1047]:[440,587,784]; // rare = brighter 4-note flourish
    notes.forEach((f,i)=>{
        const osc=ctx.createOscillator();
        const g=ctx.createGain();
        osc.type='triangle'; osc.frequency.value=f;
        const t0=ctx.currentTime+i*0.07;
        g.gain.setValueAtTime(0.13,t0);
        g.gain.exponentialRampToValueAtTime(0.001,t0+0.18);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(t0); osc.stop(t0+0.18);
    });
}

// Hit/bump sound
var _splashCooldown=0;
function playSplashSound(){
    if(!sfxEnabled||_splashCooldown>0) return;
    _splashCooldown=20;
    var ctx=ensureAudio();if(!ctx)return;
    // Filtered noise burst for water splash
    var bufSize=ctx.sampleRate*0.15;
    var buf=ctx.createBuffer(1,bufSize,ctx.sampleRate);
    var d=buf.getChannelData(0);
    for(var i=0;i<bufSize;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/bufSize*4);
    var src=ctx.createBufferSource();src.buffer=buf;
    var filt=ctx.createBiquadFilter();filt.type='bandpass';filt.frequency.value=2000;filt.Q.value=0.8;
    var g=ctx.createGain();g.gain.setValueAtTime(0.12,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.15);
    src.connect(filt);filt.connect(g);g.connect(ctx.destination);
    src.start();src.stop(ctx.currentTime+0.15);
}
function playHitSound(srcX,srcZ){
    if(!sfxEnabled||window._sfxMuted) return;
    var _vol=(srcX!==undefined)?_sfxVolume(srcX,srcZ):1;
    if(_vol<=0)return;
    const ctx=ensureAudio();
    const osc=ctx.createOscillator();
    const g=ctx.createGain();
    osc.type='sawtooth'; osc.frequency.value=120;
    g.gain.setValueAtTime(0.08*_vol,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.1);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime+0.1);
}

// Grab sound — short "boop"
function playGrabSound(srcX,srcZ){
    if(!sfxEnabled||window._sfxMuted) return;
    var _vol=(srcX!==undefined)?_sfxVolume(srcX,srcZ):1;
    if(_vol<=0)return;
    const ctx=ensureAudio(); const t=ctx.currentTime;
    const osc=ctx.createOscillator(); const g=ctx.createGain();
    osc.type='sine'; osc.frequency.setValueAtTime(500,t); osc.frequency.exponentialRampToValueAtTime(350,t+0.1);
    g.gain.setValueAtTime(0.1,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
    osc.connect(g); g.connect(ctx.destination); osc.start(t); osc.stop(t+0.12);
}

// Throw sound — whoosh
function playThrowSound(srcX,srcZ){
    if(!sfxEnabled||window._sfxMuted) return;
    var _vol=(srcX!==undefined)?_sfxVolume(srcX,srcZ):1;
    if(_vol<=0)return;
    const ctx=ensureAudio(); const t=ctx.currentTime;
    const buf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*0.15),ctx.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++){const p=i/d.length;d[i]=(Math.random()-0.5)*0.3*Math.sin(p*Math.PI)*Math.exp(-p*2);}
    const ns=ctx.createBufferSource(); const ng=ctx.createGain(); ng.gain.value=0.12;
    ns.buffer=buf; ns.connect(ng); ng.connect(ctx.destination); ns.start(t); ns.stop(t+0.15);
    // Rising pitch layer
    const osc=ctx.createOscillator(); const g=ctx.createGain();
    osc.type='sine'; osc.frequency.setValueAtTime(200,t); osc.frequency.exponentialRampToValueAtTime(800,t+0.12);
    g.gain.setValueAtTime(0.06,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
    osc.connect(g); g.connect(ctx.destination); osc.start(t); osc.stop(t+0.15);
}

// Menu sound effects
function playMenuMove(){
    if(!sfxEnabled)return;var ctx=ensureAudio();var t=ctx.currentTime;
    // Short layered movement accent
    var o=ctx.createOscillator();var g=ctx.createGain();
    o.type='square';o.frequency.setValueAtTime(880,t);o.frequency.exponentialRampToValueAtTime(660,t+0.04);
    g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.06);
    o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+0.06);
    // Click layer
    var o2=ctx.createOscillator();var g2=ctx.createGain();
    o2.type='sine';o2.frequency.value=1200;
    g2.gain.setValueAtTime(0.06,t);g2.gain.exponentialRampToValueAtTime(0.001,t+0.03);
    o2.connect(g2);g2.connect(ctx.destination);o2.start(t);o2.stop(t+0.03);
}
function playMenuConfirm(){
    if(!sfxEnabled)return;var ctx=ensureAudio();var t=ctx.currentTime;
    // Epic rising confirm — 5 rapid notes ascending with power chord
    var notes=[523,659,784,988,1318];
    notes.forEach(function(f,i){
        var o=ctx.createOscillator();var g=ctx.createGain();
        o.type='sawtooth';o.frequency.value=f;
        g.gain.setValueAtTime(0.12,t+i*0.05);g.gain.exponentialRampToValueAtTime(0.001,t+i*0.05+0.15);
        o.connect(g);g.connect(ctx.destination);o.start(t+i*0.05);o.stop(t+i*0.05+0.15);
        // Octave layer
        var o2=ctx.createOscillator();var g2=ctx.createGain();
        o2.type='triangle';o2.frequency.value=f*2;
        g2.gain.setValueAtTime(0.06,t+i*0.05);g2.gain.exponentialRampToValueAtTime(0.001,t+i*0.05+0.12);
        o2.connect(g2);g2.connect(ctx.destination);o2.start(t+i*0.05);o2.stop(t+i*0.05+0.12);
    });
    // Final impact burst
    var nb=ctx.createBuffer(1,Math.floor(ctx.sampleRate*0.1),ctx.sampleRate);
    var nd=nb.getChannelData(0);
    for(var s=0;s<nd.length;s++){var p=s/nd.length;nd[s]=Math.sin(p*Math.PI*20)*0.3*Math.exp(-p*4);}
    var ns=ctx.createBufferSource();var ng=ctx.createGain();ng.gain.value=0.1;
    ns.buffer=nb;ns.connect(ng);ng.connect(ctx.destination);ns.start(t+0.25);ns.stop(t+0.35);
}
