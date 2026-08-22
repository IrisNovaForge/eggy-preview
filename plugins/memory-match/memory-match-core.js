(function(global){
    'use strict';

    var TRAVELERS={
        blossomTraveler:{name:'花香旅人',accent:'#ef6978',soft:'#fff1f2',motif:'blossom'},
        herbTraveler:{name:'香草旅人',accent:'#75a966',soft:'#eef8e9',motif:'leaf'},
        saltCrystalTraveler:{name:'盐晶旅人',accent:'#74a7c7',soft:'#edf7fb',motif:'crystal'},
        cloudwingTraveler:{name:'云翼旅人',accent:'#8b9bd0',soft:'#f1f3fd',motif:'cloud'},
        fruitbrewTraveler:{name:'果酿旅人',accent:'#d89755',soft:'#fff3e3',motif:'fruit'},
        berryTraveler:{name:'浆果旅人',accent:'#b65e8a',soft:'#fbedf5',motif:'berry'},
        spicyFlameTraveler:{name:'辣焰旅人',accent:'#db684d',soft:'#fff0e9',motif:'flame'},
        goldenGrainTraveler:{name:'金穗旅人',accent:'#c7a24d',soft:'#fff7dc',motif:'grain'}
    };
    var TRAVELER_IDS=Object.keys(TRAVELERS);
    var FACES={};
    TRAVELER_IDS.forEach(function(id){
        var traveler=TRAVELERS[id];
        FACES['portrait-'+id]={id:'portrait-'+id,name:traveler.name,accent:traveler.accent,soft:traveler.soft,visual:'portrait',travelerId:id};
        FACES['motif-'+id]={id:'motif-'+id,name:traveler.name+'印记',accent:traveler.accent,soft:traveler.soft,visual:'motif',motif:traveler.motif};
    });
    FACES['close-blossomTraveler']={id:'close-blossomTraveler',name:'花香旅人近影',accent:'#d95d72',soft:'#fff0f3',visual:'portrait',travelerId:'blossomTraveler',close:true};
    FACES['close-berryTraveler']={id:'close-berryTraveler',name:'浆果旅人近影',accent:'#a95682',soft:'#f9e9f2',visual:'portrait',travelerId:'berryTraveler',close:true};
    ['petal','leaf','crystal','grain'].forEach(function(family){
        var palette={petal:['#d95d72','#fff0f3'],leaf:['#6f9f61','#eef7e9'],crystal:['#6f9fc0','#edf7fb'],grain:['#bc9540','#fff6d8']}[family];
        for(var variant=1;variant<=3;variant++){
            var key='emblem-'+family+'-'+variant;
            FACES[key]={id:key,name:'记忆印记 '+family+' '+variant,accent:palette[0],soft:palette[1],visual:'emblem',motif:family,variant:variant};
        }
    });

    function portraitIds(ids){return ids.map(function(id){return 'portrait-'+id;});}
    var LEVELS=[
        {id:1,name:'旅人初见',difficulty:'入门',hint:'从轮廓、颜色和名字认识旅人',pairs:6,timeMode:'none',timeLabel:'不限时',desktopColumns:3,mobileColumns:3,showNames:true,faces:portraitIds(['blossomTraveler','saltCrystalTraveler','cloudwingTraveler','fruitbrewTraveler','spicyFlameTraveler','goldenGrainTraveler'])},
        {id:2,name:'八位旅人',difficulty:'标准',hint:'移除名字，记住八位旅人的外形',pairs:8,timeMode:'stopwatch',timeLabel:'记录用时',desktopColumns:4,mobileColumns:4,showNames:false,faces:portraitIds(TRAVELER_IDS)},
        {id:3,name:'角色印记',difficulty:'进阶',hint:'分辨角色装饰与相近的局部构图',pairs:10,timeMode:'target',targetSeconds:180,timeLabel:'目标 03:00',desktopColumns:5,mobileColumns:4,showNames:false,faces:TRAVELER_IDS.map(function(id){return 'motif-'+id;}).concat(['close-blossomTraveler','close-berryTraveler'])},
        {id:4,name:'细节记忆',difficulty:'挑战',hint:'在相似印记中记住方向、数量和位置',pairs:12,timeMode:'target',targetSeconds:150,timeLabel:'目标 02:30',desktopColumns:6,mobileColumns:4,showNames:false,faces:['emblem-petal-1','emblem-petal-2','emblem-petal-3','emblem-leaf-1','emblem-leaf-2','emblem-leaf-3','emblem-crystal-1','emblem-crystal-2','emblem-crystal-3','emblem-grain-1','emblem-grain-2','emblem-grain-3']}
    ];

    function safeSeed(value){return ((Number(value)||Date.now())>>>0)||0x6d2b79f5;}
    function joinPath(base,file){base=String(base||'');return base+(base&&base.charAt(base.length-1)!=='/'?'/':'')+file;}
    function clamp(value,min,max){return Math.max(min,Math.min(max,Number(value)||0));}
    function esc(value){return String(value).replace(/[&<>"']/g,function(char){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char];});}
    function levelById(id){return LEVELS[Math.max(0,Math.min(LEVELS.length-1,(id|0)-1))]||LEVELS[0];}

    function motifSvg(type){
        var open='<svg class="mm-face-svg" viewBox="0 0 100 100" aria-hidden="true"><path class="mm-svg-egg" d="M50 9C30 9 18 30 18 55c0 23 13 36 32 36s32-13 32-36C82 30 70 9 50 9Z"/>';
        var close='</svg>';
        if(type==='blossom')return open+'<g class="mm-svg-fill" transform="translate(50 50)"><ellipse ry="24" rx="11" transform="rotate(0) translate(0 -16)"/><ellipse ry="24" rx="11" transform="rotate(72) translate(0 -16)"/><ellipse ry="24" rx="11" transform="rotate(144) translate(0 -16)"/><ellipse ry="24" rx="11" transform="rotate(216) translate(0 -16)"/><ellipse ry="24" rx="11" transform="rotate(288) translate(0 -16)"/><circle r="9" class="mm-svg-core"/></g>'+close;
        if(type==='leaf')return open+'<path class="mm-svg-line" d="M31 77C47 59 50 43 53 22M47 58C30 59 25 47 27 35c15-1 24 7 20 23ZM52 43c4-15 15-21 28-18 0 15-9 25-28 18Z"/>'+close;
        if(type==='crystal')return open+'<g class="mm-svg-fill"><path d="M50 17 68 43 58 78 42 78 32 43Z"/><path class="mm-svg-core" d="M50 17 50 78 32 43ZM50 17 68 43 50 49Z"/><path d="M23 54 34 41 41 70 31 80ZM77 54 66 41 59 70 69 80Z"/></g>'+close;
        if(type==='cloud')return open+'<path class="mm-svg-fill" d="M26 60c-11-2-12-17-2-22 2-13 20-17 28-7 10-7 25 0 24 13 10 4 8 19-3 20H29Z"/><path class="mm-svg-line" d="M31 68c-4 9-11 13-19 12M69 68c4 9 11 13 19 12M38 72c-2 8-7 13-13 16M62 72c2 8 7 13 13 16"/>'+close;
        if(type==='fruit')return open+'<path class="mm-svg-line" d="M28 32c20 2 33 11 43 28M52 42c8-11 16-14 25-12"/><g class="mm-svg-fill"><circle cx="39" cy="49" r="14"/><circle cx="61" cy="61" r="16"/><circle cx="34" cy="72" r="11"/><path d="M67 30c7-9 14-10 21-5-5 9-12 12-21 5Z"/></g>'+close;
        if(type==='berry')return open+'<g class="mm-svg-fill"><circle cx="39" cy="42" r="12"/><circle cx="58" cy="39" r="12"/><circle cx="30" cy="59" r="12"/><circle cx="50" cy="59" r="13"/><circle cx="69" cy="57" r="11"/><circle cx="43" cy="76" r="11"/><circle cx="61" cy="74" r="10"/><path d="M48 29c-8-10-17-10-24-4 7 8 15 10 24 4ZM52 29c8-10 17-10 24-4-7 8-15 10-24 4Z"/></g>'+close;
        if(type==='flame')return open+'<path class="mm-svg-fill" d="M55 14c2 18 20 25 18 47-2 19-14 29-28 27-17-2-25-15-20-31 4-12 14-18 18-32 6 6 8 13 8 21 7-7 8-20 4-32Z"/><path class="mm-svg-core" d="M51 48c9 9 10 18 4 25-5 6-16 5-20-3-4-9 4-15 8-22 2 6 5 8 8 0Z"/>'+close;
        return open+'<path class="mm-svg-line" d="M49 82V19M49 36c-11-1-18-7-21-17 11 0 18 5 21 17ZM49 51c-13-1-21-7-24-18 13 0 21 6 24 18ZM50 43c11-1 18-7 21-17-11 0-18 5-21 17ZM50 60c13-1 21-7 24-18-13 0-21 6-24 18ZM50 70c10-1 16-5 20-13"/>'+close;
    }

    function emblemSvg(family,variant){
        var core='<svg class="mm-face-svg mm-emblem-svg" viewBox="0 0 100 100" aria-hidden="true"><path class="mm-svg-egg" d="M50 8C31 8 19 29 19 55c0 23 12 36 31 36s31-13 31-36C81 29 69 8 50 8Z"/><path class="mm-svg-orbit" d="M18 57c20 12 49 12 65-4"/>';
        var dots=variant===1?'<circle class="mm-svg-dot" cx="29" cy="29" r="3"/><circle class="mm-svg-dot" cx="72" cy="69" r="2"/>':variant===2?'<circle class="mm-svg-dot" cx="70" cy="27" r="3"/><circle class="mm-svg-dot" cx="30" cy="73" r="2"/>':'<circle class="mm-svg-dot" cx="27" cy="65" r="3"/><circle class="mm-svg-dot" cx="73" cy="37" r="2"/>';
        var shape='';
        if(family==='petal'){
            var count=variant+3;shape='<g class="mm-svg-fill" transform="translate(50 49)">';
            for(var i=0;i<count;i++)shape+='<ellipse rx="7" ry="18" transform="rotate('+(i*360/count)+') translate(0 -13)"/>';
            shape+='<circle class="mm-svg-core" r="7"/></g>';
        }else if(family==='leaf'){
            shape=variant===1?'<path class="mm-svg-line" d="M35 72c12-18 18-34 22-49M45 53c-13 0-19-8-17-19 12 0 20 7 17 19ZM53 40c4-11 12-16 22-13 0 11-7 18-22 13Z"/>':variant===2?'<path class="mm-svg-line" d="M65 74C52 56 46 40 43 22M55 55c13 0 19-8 17-19-12 0-20 7-17 19ZM46 43c-4-11-12-16-22-13 0 11 7 18 22 13Z"/>':'<path class="mm-svg-line" d="M50 76V22M49 46c-14 0-22-7-23-19 14 0 22 7 23 19ZM51 59c14 0 22-7 23-19-14 0-22 7-23 19Z"/>';
        }else if(family==='crystal'){
            shape=variant===1?'<path class="mm-svg-fill" d="M50 21 66 45 57 75H43l-9-30Z"/><path class="mm-svg-core" d="M50 21v54L34 45Z"/>':variant===2?'<g class="mm-svg-fill"><path d="M41 27 54 49 47 75H34l-7-26Z"/><path d="M62 20 75 44 67 70H54l-6-26Z"/></g>':'<g class="mm-svg-fill"><path d="M50 18 62 41 56 70H44l-6-29Z"/><path d="M30 42 40 56 36 75H25l-5-19ZM70 42 80 56l-5 19H64l-4-19Z"/></g>';
        }else{
            shape=variant===1?'<path class="mm-svg-line" d="M50 77V23M49 44c-12-1-19-7-21-17 12 0 19 6 21 17ZM50 59c12-1 19-7 21-17-12 0-19 6-21 17Z"/>':variant===2?'<path class="mm-svg-line" d="M50 78V22M49 39c-10-1-16-6-19-14M49 53c-13-1-21-7-24-18M50 46c10-1 16-6 19-14M50 62c13-1 21-7 24-18"/>':'<path class="mm-svg-line" d="M50 80V20M49 36c-9-1-15-5-18-12M49 49c-12-1-19-6-22-16M49 63c-14-1-22-7-25-18M50 42c9-1 15-5 18-12M50 56c12-1 19-6 22-16M50 70c10-1 17-5 21-13"/>';
        }
        return core+dots+shape+'</svg>';
    }

    function create(options){
        options=options||{};
        if(!options.mount)throw new Error('memory-match requires a mount element');
        var mount=options.mount,rules=options.rules||global.DanboMemoryMatchRules.create(),assetBase=String(options.assetBase||'');
        var mismatchDelay=Math.max(20,Number(options.mismatchDelayMs)||760),matchDelay=Math.max(0,Number(options.matchDelayMs)||180);
        var storage=options.storage||null,status='title',cards=[],selected=[],matchedPairs=0,attempts=0,inputLocked=false;
        var runId=0,pendingTimer=0,clockTimer=0,destroyed=false,resultSent=false,currentLevel=LEVELS[0],selectedLevel=1;
        var startedAt=0,elapsedMs=0,targetExpired=false;
        var unlockedLevel=options.unlockAll?LEVELS.length:clamp(readStorage('unlockedLevel',1),1,LEVELS.length)|0;

        mount.innerHTML=''+
            '<section class="mm-game" aria-label="蛋宝翻牌记忆">'+
              '<div class="mm-sky-dot mm-sky-dot-a"></div><div class="mm-sky-dot mm-sky-dot-b"></div>'+
              '<header class="mm-header"><div class="mm-brand"><span class="mm-brand-mark" aria-hidden="true"></span><div><b>蛋宝记忆配对</b><small>MEMORY PAIRS</small></div></div>'+
                '<div class="mm-stats" aria-live="polite"><span data-mm-level-chip>第1关 · 入门</span><span class="mm-time" data-mm-time>不限时</span><span>配对 <b data-mm-matches>0 / 6</b></span><span>尝试 <b data-mm-attempts>0</b></span></div></header>'+
              '<main class="mm-board-wrap"><div class="mm-board" data-mm-board aria-label="记忆卡牌区域"></div>'+
                '<div class="mm-panel mm-title-panel is-visible" data-mm-title-panel role="dialog" aria-modal="true">'+
                  '<div class="mm-panel-emblem" aria-hidden="true"><i></i><i></i><i></i></div><p class="mm-kicker">DANBO MEMORY</p><h1>四段记忆旅程</h1><p>从完整旅人开始，逐步记住轮廓、印记与细节。</p>'+
                  '<div class="mm-level-list" data-mm-level-list></div><button class="mm-primary" type="button" data-mm-start>开始挑战</button></div>'+
                '<div class="mm-panel mm-result" data-mm-result-panel role="dialog" aria-modal="true"><div class="mm-finish-mark" aria-hidden="true">✓</div><p class="mm-kicker">ALL PAIRED</p><h2 data-mm-result-title>关卡完成</h2><p>你用了 <b data-mm-result-attempts>0</b> 次尝试完成全部 <b data-mm-result-pairs>0</b> 组配对。</p><p class="mm-result-time" data-mm-result-time>本关不限时</p>'+
                  '<div class="mm-panel-actions"><button class="mm-primary" type="button" data-mm-next>下一关</button><button class="mm-secondary" type="button" data-mm-restart>重玩</button><button class="mm-secondary" type="button" data-mm-level-select>选关</button></div></div></main>'+
              '<footer class="mm-footer"><span data-mm-footer-hint>选择两张记忆牌</span><div><button type="button" data-mm-footer-restart>重新开始</button><button type="button" data-mm-exit>退出</button></div></footer></section>';

        var board=mount.querySelector('[data-mm-board]'),titlePanel=mount.querySelector('[data-mm-title-panel]'),resultPanel=mount.querySelector('[data-mm-result-panel]');
        var matchText=mount.querySelector('[data-mm-matches]'),attemptText=mount.querySelector('[data-mm-attempts]'),levelChip=mount.querySelector('[data-mm-level-chip]'),timeText=mount.querySelector('[data-mm-time]');
        var resultAttempts=mount.querySelector('[data-mm-result-attempts]'),resultPairs=mount.querySelector('[data-mm-result-pairs]'),resultTitle=mount.querySelector('[data-mm-result-title]'),resultTime=mount.querySelector('[data-mm-result-time]');
        var nextButton=mount.querySelector('[data-mm-next]'),levelList=mount.querySelector('[data-mm-level-list]'),footerHint=mount.querySelector('[data-mm-footer-hint]');

        function readStorage(key,fallback){
            try{
                if(storage&&typeof storage.get==='function')return storage.get(key,fallback);
                var value=global.localStorage&&global.localStorage.getItem('memory-match:'+key);return value===null||value===undefined?fallback:JSON.parse(value);
            }catch(error){return fallback;}
        }
        function writeStorage(key,value){
            try{
                if(storage&&typeof storage.set==='function')storage.set(key,value);
                else if(global.localStorage)global.localStorage.setItem('memory-match:'+key,JSON.stringify(value));
            }catch(error){/* Progress persistence must never block play. */}
        }
        function targetSecondsFor(level){
            var override=options.targetSecondsByLevel&&Number(options.targetSecondsByLevel[level.id]);
            return override>0?override:Number(level.targetSeconds)||0;
        }
        function formatClock(milliseconds,roundUp){
            var seconds=Math.max(0,roundUp?Math.ceil(milliseconds/1000):Math.floor(milliseconds/1000));
            var minutes=Math.floor(seconds/60);seconds%=60;
            return String(minutes).padStart(2,'0')+':'+String(seconds).padStart(2,'0');
        }
        function updateClock(){
            if(!startedAt||currentLevel.timeMode==='none')return;
            elapsedMs=Math.max(0,performance.now()-startedAt);
            timeText.classList.remove('is-expired');
            if(currentLevel.timeMode==='stopwatch'){
                timeText.textContent='用时 '+formatClock(elapsedMs,false);return;
            }
            var targetMs=targetSecondsFor(currentLevel)*1000,remaining=targetMs-elapsedMs;
            if(remaining<=0){targetExpired=true;timeText.classList.add('is-expired');timeText.textContent='目标已过 · 继续';}
            else timeText.textContent='剩余 '+formatClock(remaining,true);
        }
        function stopClock(updateFirst){
            if(updateFirst)updateClock();
            if(clockTimer){clearInterval(clockTimer);clockTimer=0;}startedAt=0;
        }
        function startClock(){
            stopClock(false);startedAt=performance.now();elapsedMs=0;targetExpired=false;timeText.classList.remove('is-expired');
            if(currentLevel.timeMode==='none'){startedAt=0;timeText.textContent='不限时';return;}
            updateClock();clockTimer=setInterval(updateClock,Math.max(20,Number(options.timerTickMs)||250));
        }
        function clearPending(){if(pendingTimer){clearTimeout(pendingTimer);pendingTimer=0;}}
        function schedule(callback,delay){clearPending();var expectedRun=runId;pendingTimer=setTimeout(function(){pendingTimer=0;if(!destroyed&&expectedRun===runId)callback();},delay);}
        function showPanel(panel,visible){if(panel)panel.classList.toggle('is-visible',!!visible);}
        function faceFor(card){return FACES[card.faceId]||FACES['portrait-blossomTraveler'];}
        function visualMarkup(face){
            if(face.visual==='portrait')return '<span class="mm-portrait-wrap'+(face.close?' is-close':'')+'"><img src="'+joinPath(assetBase,'assets/card-faces/'+face.travelerId+'.png')+'" alt=""></span>';
            if(face.visual==='emblem')return '<span class="mm-symbol-wrap mm-emblem-wrap">'+emblemSvg(face.motif,face.variant)+'</span>';
            return '<span class="mm-symbol-wrap">'+motifSvg(face.motif)+'</span>';
        }
        function cardMarkup(card,index){
            var face=faceFor(card),up=card.state==='up'||card.state==='matched',matched=card.state==='matched';
            var classes='mm-card'+(up?' is-up':'')+(matched?' is-matched':'');
            var label=matched?'已配对：'+face.name:(up?'已揭开：'+face.name:'第'+(index+1)+'张记忆牌，未揭开');
            var name=currentLevel.showNames?'<b class="mm-face-name">'+esc(face.name)+'</b>':'';
            return '<button class="'+classes+'" type="button" data-card-index="'+index+'" aria-label="'+esc(label)+'" '+(matched?'disabled':'')+' style="--face-accent:'+face.accent+';--face-soft:'+face.soft+'"><span class="mm-card-shell">'+
                '<span class="mm-card-back" aria-hidden="true"><i class="mm-back-egg"></i><i class="mm-back-orbit"></i><i class="mm-back-star mm-back-star-a"></i><i class="mm-back-star mm-back-star-b"></i></span>'+
                '<span class="mm-card-front" aria-hidden="true">'+visualMarkup(face)+name+'<i class="mm-match-check">✓</i></span></span></button>';
        }
        function configureBoard(){
            board.dataset.level=String(currentLevel.id);board.style.setProperty('--mm-cols',String(currentLevel.desktopColumns));board.style.setProperty('--mm-mobile-cols',String(currentLevel.mobileColumns));
            levelChip.textContent='第'+currentLevel.id+'关 · '+currentLevel.difficulty;timeText.textContent=currentLevel.timeLabel;timeText.classList.remove('is-expired');footerHint.textContent=currentLevel.name+'｜'+currentLevel.hint;
        }
        function updateStats(){matchText.textContent=matchedPairs+' / '+currentLevel.pairs;attemptText.textContent=String(attempts);}
        function renderCards(){board.innerHTML=cards.map(cardMarkup).join('');board.setAttribute('aria-busy',inputLocked?'true':'false');updateStats();}
        function renderLevels(){
            levelList.innerHTML=LEVELS.map(function(level){
                var locked=!options.unlockAll&&level.id>unlockedLevel,selected=level.id===selectedLevel;
                return '<button type="button" class="mm-level-card'+(selected?' is-selected':'')+'" data-level-id="'+level.id+'" '+(locked?'disabled aria-label="第'+level.id+'关尚未解锁"':'')+'><span>第'+level.id+'关</span><b>'+level.name+'</b><small>'+level.pairs+'组 · '+(locked?'尚未解锁':level.timeLabel)+'</small><i aria-hidden="true">'+(locked?'锁':level.difficulty)+'</i></button>';
            }).join('');
        }
        function startGame(levelId,seed){
            if(destroyed)return false;
            var requested=levelById(levelId||selectedLevel);
            if(!options.unlockAll&&requested.id>unlockedLevel)return false;
            clearPending();stopClock(false);runId++;resultSent=false;currentLevel=requested;selectedLevel=requested.id;
            cards=rules.createDeck(currentLevel.faces,safeSeed(seed));selected=[];matchedPairs=0;attempts=0;inputLocked=false;status='playing';
            configureBoard();showPanel(titlePanel,false);showPanel(resultPanel,false);renderCards();startClock();
            var first=board.querySelector('.mm-card');if(first)first.focus({preventScroll:true});return true;
        }
        function returnToTitle(){
            clearPending();stopClock(false);startedAt=0;elapsedMs=0;targetExpired=false;runId++;status='title';inputLocked=false;selected=[];cards=[];selectedLevel=Math.min(Math.max(selectedLevel,1),unlockedLevel);currentLevel=levelById(selectedLevel);
            configureBoard();renderCards();renderLevels();showPanel(resultPanel,false);showPanel(titlePanel,true);
            var chosen=levelList.querySelector('.is-selected');if(chosen)chosen.focus({preventScroll:true});
        }
        function completeGame(){
            stopClock(true);status='won';inputLocked=true;
            if(currentLevel.id<LEVELS.length&&unlockedLevel<currentLevel.id+1){unlockedLevel=currentLevel.id+1;writeStorage('unlockedLevel',unlockedLevel);}
            renderCards();resultAttempts.textContent=String(attempts);resultPairs.textContent=String(currentLevel.pairs);resultTitle.textContent='第'+currentLevel.id+'关 · '+currentLevel.name+'完成';
            if(currentLevel.timeMode==='none')resultTime.textContent='本关不限时，按自己的节奏完成。';
            else if(currentLevel.timeMode==='stopwatch')resultTime.textContent='完成用时 '+formatClock(elapsedMs,false)+'。';
            else resultTime.textContent=(targetExpired?'目标时间已过后完成':'在目标时间内完成')+' · 用时 '+formatClock(elapsedMs,false)+'。';
            nextButton.textContent=currentLevel.id<LEVELS.length?'下一关':'再次挑战';showPanel(resultPanel,true);
            if(!resultSent&&typeof options.onResult==='function'){
                resultSent=true;options.onResult({status:'finished',level:currentLevel.id,levelName:currentLevel.name,matchedPairs:matchedPairs,attempts:attempts,pairs:currentLevel.pairs,unlockedLevel:unlockedLevel,timeMode:currentLevel.timeMode,elapsedSeconds:elapsedMs/1000,targetSeconds:targetSecondsFor(currentLevel)||null,withinTarget:currentLevel.timeMode!=='target'||!targetExpired});
            }
            nextButton.focus({preventScroll:true});
        }
        function finishSelection(matched){
            var first=cards[selected[0]],second=cards[selected[1]];
            if(!first||!second){selected=[];inputLocked=false;status='playing';renderCards();return;}
            if(matched){first.state='matched';second.state='matched';matchedPairs++;}else{first.state='down';second.state='down';}
            selected=[];inputLocked=false;status='playing';renderCards();if(rules.isComplete(matchedPairs,currentLevel.pairs))completeGame();
        }
        function flip(index){
            index=index|0;if(destroyed||status!=='playing'||inputLocked||index<0||index>=cards.length)return false;
            var card=cards[index];if(!card||card.state!=='down')return false;
            card.state='up';selected.push(index);renderCards();if(selected.length<2)return true;
            attempts++;inputLocked=true;status='resolving';renderCards();var matched=rules.samePair(cards[selected[0]],cards[selected[1]]);
            schedule(function(){finishSelection(matched);},matched?matchDelay:mismatchDelay);return true;
        }
        function exitGame(){
            updateClock();var result={status:'exit',level:currentLevel.id,matchedPairs:matchedPairs,attempts:attempts,pairs:currentLevel.pairs,elapsedSeconds:elapsedMs/1000};
            if(typeof options.onExit==='function'){clearPending();stopClock(false);status='exiting';inputLocked=true;options.onExit(result);}else returnToTitle();
        }
        function onClick(event){
            var target=event.target.closest('button');if(!target||!mount.contains(target))return;
            if(target.hasAttribute('data-card-index')){flip(Number(target.getAttribute('data-card-index')));return;}
            if(target.hasAttribute('data-level-id')){selectedLevel=Number(target.getAttribute('data-level-id'));currentLevel=levelById(selectedLevel);configureBoard();renderLevels();updateStats();return;}
            if(target.hasAttribute('data-mm-start')){startGame(selectedLevel);return;}
            if(target.hasAttribute('data-mm-restart')||target.hasAttribute('data-mm-footer-restart')){startGame(currentLevel.id);return;}
            if(target.hasAttribute('data-mm-next')){startGame(currentLevel.id<LEVELS.length?currentLevel.id+1:currentLevel.id);return;}
            if(target.hasAttribute('data-mm-level-select')){returnToTitle();return;}
            if(target.hasAttribute('data-mm-exit'))exitGame();
        }
        mount.addEventListener('click',onClick);currentLevel=levelById(selectedLevel);configureBoard();renderLevels();renderCards();
        if(options.autoStart)startGame(options.startLevel||1,options.seed);

        return {
            start:startGame,restart:function(seed){return startGame(currentLevel.id,seed);},flip:flip,showLevels:returnToTitle,
            getLevels:function(){return LEVELS.map(function(level){return {id:level.id,name:level.name,difficulty:level.difficulty,pairs:level.pairs,timeMode:level.timeMode,targetSeconds:targetSecondsFor(level)||null,timeLabel:level.timeLabel,desktopColumns:level.desktopColumns,mobileColumns:level.mobileColumns,faceCount:level.faces.length};});},
            getState:function(){updateClock();return {status:status,level:currentLevel.id,unlockedLevel:unlockedLevel,cards:cards.map(function(card){return {id:card.id,pairId:card.pairId,faceId:card.faceId,state:card.state};}),selected:selected.slice(),matchedPairs:matchedPairs,attempts:attempts,inputLocked:inputLocked,runId:runId,timeMode:currentLevel.timeMode,elapsedSeconds:elapsedMs/1000,targetSeconds:targetSecondsFor(currentLevel)||null,targetExpired:targetExpired};},
            destroy:function(){if(destroyed)return;destroyed=true;status='destroyed';runId++;clearPending();stopClock(false);mount.removeEventListener('click',onClick);mount.innerHTML='';}
        };
    }

    global.DanboMemoryMatch={create:create,faces:FACES,levels:LEVELS};
})(window);
