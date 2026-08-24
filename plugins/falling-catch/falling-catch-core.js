(function(){
    'use strict';

    var COPY={
        zhs:{
            title:'风中取物',eyebrow:'世界旅人的自然采样任务',intro:'带领世界旅人托住采集篮，接住风香草叶、莓林莓和金穗籽，同时避开苔痕风化石。',
            start:'开始接取',loading:'正在准备规则…',move:'左右移动',goal:'12分或坚持30秒即可过关',score:'得分',time:'时间',lives:'机会',
            ready:'准备好了',wasm:'WASM规则',fallback:'JS备用规则',caught:'接到了！',glimmerAppears:'蛋壳微光出现了！',lifeRestored:'蛋壳微光 +1机会',combo:'连续接取 ×{count}！',chain:'连收 ×{count}',phaseGather:'星风聚集',phaseAlternate:'双风交替',phaseConverge:'星风汇流！',hit:'小心石块！',win:'风野收获完成！',lose:'采样任务中断',
            winDetail:'你完成了这次自然接取挑战。',loseDetail:'机会已经用完，再试一次吧。',again:'再玩一次',exit:'退出试玩',points:'分',
            level:'第 {current} / {total} 关',next:'进入下一关',nextDetail:'下一关：{name}',unlockedDetail:'新关卡已解锁：{name}',campaignWin:'四关旅程完成！',campaignDetail:'你完成了风野、风丘、晶谷与星风汇流的全部挑战。',restartCampaign:'从第一关开始',framework:'框架测试',
            titleIntro:'跟随蛋宝走进四片风之场地，用头顶采集篮接住自然馈赠。',enterLevels:'进入关卡',chooseLevel:'选择关卡',backTitle:'返回标题',backLevels:'返回关卡选择',stageReady:'本关准备',allOpen:'依次完成关卡，解锁下一片风之场地',locked:'尚未解锁',lockedDetail:'完成上一关后解锁',currentProgress:'当前进度',touchMove:'左右拖动风芽摇杆',guideTitle:'本关物件',windSproutAppears:'跃风芽出现了！',windSproutStored:'跃风已经储存',jumpLabel:'跃风',jumpAction:'跃',jumpUnavailable:'本关没有跃风芽，跃起功能从第3关开启',jumpNeedSprout:'先接住跃风芽，才能使用跃起'
        },
        zht:{
            title:'風中取物',eyebrow:'世界旅人的自然採樣任務',intro:'帶領世界旅人托住採集籃，接住風香草葉、莓林莓和金穗籽，同時避開苔痕風化石。',
            start:'開始接取',loading:'正在準備規則…',move:'左右移動',goal:'12分或堅持30秒即可過關',score:'得分',time:'時間',lives:'機會',
            ready:'準備好了',wasm:'WASM規則',fallback:'JS備用規則',caught:'接到了！',glimmerAppears:'蛋殼微光出現了！',lifeRestored:'蛋殼微光 +1機會',combo:'連續接取 ×{count}！',chain:'連收 ×{count}',phaseGather:'星風聚集',phaseAlternate:'雙風交替',phaseConverge:'星風匯流！',hit:'小心石塊！',win:'風野收穫完成！',lose:'採樣任務中斷',
            winDetail:'你完成了這次自然接取挑戰。',loseDetail:'機會已經用完，再試一次吧。',again:'再玩一次',exit:'退出試玩',points:'分',
            level:'第 {current} / {total} 關',next:'進入下一關',nextDetail:'下一關：{name}',unlockedDetail:'新關卡已解鎖：{name}',campaignWin:'四關旅程完成！',campaignDetail:'你完成了風野、風丘、晶谷與星風匯流的全部挑戰。',restartCampaign:'從第一關開始',framework:'框架測試',
            titleIntro:'跟隨蛋寶走進四片風之場地，用頭頂採集籃接住自然饋贈。',enterLevels:'進入關卡',chooseLevel:'選擇關卡',backTitle:'返回標題',backLevels:'返回關卡選擇',stageReady:'本關準備',allOpen:'依次完成關卡，解鎖下一片風之場地',locked:'尚未解鎖',lockedDetail:'完成上一關後解鎖',currentProgress:'目前進度',touchMove:'左右拖動風芽搖桿',guideTitle:'本關物件',windSproutAppears:'躍風芽出現了！',windSproutStored:'躍風已經儲存',jumpLabel:'躍風',jumpAction:'躍',jumpUnavailable:'本關沒有躍風芽，躍起功能從第3關開啟',jumpNeedSprout:'先接住躍風芽，才能使用躍起'
        },
        ja:{
            title:'風の中でキャッチ',eyebrow:'世界の旅人の自然サンプリング',intro:'世界の旅人と採集かごを動かし、風香草の葉、森ベリー、金穂の種を集めながら苔むした風化石をよけよう。',
            start:'チャレンジ開始',loading:'ルールを準備中…',move:'左右に移動',goal:'12点または30秒でクリア',score:'スコア',time:'時間',lives:'チャンス',
            ready:'準備完了',wasm:'WASMルール',fallback:'JS予備ルール',caught:'キャッチ！',glimmerAppears:'卵殻の微光が現れた！',lifeRestored:'卵殻の微光 +1チャンス',combo:'連続キャッチ ×{count}！',chain:'連続 ×{count}',phaseGather:'星風が集まる',phaseAlternate:'二つの風が交替',phaseConverge:'星風が合流！',hit:'石に注意！',win:'収穫完了！',lose:'かごが壊れました',
            winDetail:'自然キャッチチャレンジを達成しました。',loseDetail:'チャンスを使い切りました。もう一度挑戦しよう。',again:'もう一度',exit:'終了',points:'点',
            level:'ステージ {current} / {total}',next:'次のステージへ',nextDetail:'次：{name}',unlockedDetail:'新しいステージを解放：{name}',campaignWin:'4ステージの旅が完了！',campaignDetail:'風のフィールドから星風の合流まで、すべての挑戦を達成しました。',restartCampaign:'最初から',framework:'枠組みテスト',
            titleIntro:'旅人と四つの風のフィールドへ。頭上のかごで自然の恵みを集めよう。',enterLevels:'ステージへ',chooseLevel:'ステージを選ぶ',backTitle:'タイトルへ',backLevels:'ステージ選択へ',stageReady:'ステージ準備',allOpen:'順番にクリアして次の風のフィールドを解放しよう',locked:'未解放',lockedDetail:'前のステージをクリアすると解放',currentProgress:'現在の進行',touchMove:'風芽スティックを左右へ',guideTitle:'このステージのアイテム',windSproutAppears:'跳風の芽が現れた！',windSproutStored:'跳風をためました',jumpLabel:'跳風',jumpAction:'跳',jumpUnavailable:'このステージには跳風の芽がありません。ジャンプはステージ3から使えます',jumpNeedSprout:'先に跳風の芽を取るとジャンプできます'
        },
        en:{
            title:'Catching in the Wind',eyebrow:'World Traveler field sampling',intro:'Guide a World Traveler holding a woven field basket, gather wind herbs, grove berries and golden grain seeds, and avoid mossy weathered stones.',
            start:'Start catching',loading:'Preparing rules…',move:'Move left and right',goal:'Reach 12 points or last 30 seconds',score:'Score',time:'Time',lives:'Chances',
            ready:'Ready',wasm:'WASM rules',fallback:'JS fallback rules',caught:'Caught!',glimmerAppears:'Eggshell Glimmer appeared!',lifeRestored:'Eggshell Glimmer +1 chance',combo:'Catch chain ×{count}!',chain:'Chain ×{count}',phaseGather:'Starwind gathering',phaseAlternate:'Twin winds alternating',phaseConverge:'Starwinds converge!',hit:'Watch the stones!',win:'Harvest complete!',lose:'The basket broke',
            winDetail:'You completed the nature catch challenge.',loseDetail:'No chances remain. Give it another try.',again:'Play again',exit:'Exit preview',points:'pts',
            level:'Stage {current} / {total}',next:'Next stage',nextDetail:'Next: {name}',unlockedDetail:'New stage unlocked: {name}',campaignWin:'Four-stage journey complete!',campaignDetail:'You cleared every challenge from Breezy Harvest through Starwind Confluence.',restartCampaign:'Start from Stage 1',framework:'Framework test',
            titleIntro:'Travel through four wind fields and gather nature gifts in the overhead basket.',enterLevels:'Enter Stages',chooseLevel:'Choose a Stage',backTitle:'Back to Title',backLevels:'Back to Stage Select',stageReady:'Stage Ready',allOpen:'Clear each stage in order to unlock the next wind field',locked:'Locked',lockedDetail:'Clear the previous stage to unlock',currentProgress:'Current progress',touchMove:'Slide the wind-bud stick sideways',guideTitle:'Stage Items',windSproutAppears:'Wind Sprout appeared!',windSproutStored:'Wind leap stored',jumpLabel:'Wind leap',jumpAction:'Leap',jumpUnavailable:'No Wind Sprout appears here. Leaping unlocks in Stage 3',jumpNeedSprout:'Catch a Wind Sprout before using Leap'
        }
    };

    var TRAVELERS={
        blossomTraveler:{file:'blossomTraveler.png',names:{zhs:'蜜蕊旅人',zht:'蜜蕊旅人',ja:'花蜜の旅人',en:'Blossom Traveler'},color:'#f5f5f0',accent:'#cc2222'},
        herbTraveler:{file:'herbTraveler.png',names:{zhs:'香草旅人',zht:'香草旅人',ja:'ハーブの旅人',en:'Herb Traveler'},color:'#bfe8a0',accent:'#8fd16a'},
        saltCrystalTraveler:{file:'saltCrystalTraveler.png',names:{zhs:'盐晶旅人',zht:'鹽晶旅人',ja:'塩晶の旅人',en:'Salt Crystal Traveler'},color:'#f4e9e1',accent:'#e7b6c8'},
        cloudwingTraveler:{file:'cloudwingTraveler.png',names:{zhs:'云翼旅人',zht:'雲翼旅人',ja:'雲翼の旅人',en:'Cloudwing Traveler'},color:'#ddf5ff',accent:'#78bfe6'},
        fruitbrewTraveler:{file:'fruitbrewTraveler.png',names:{zhs:'果酿旅人',zht:'果釀旅人',ja:'果実醸しの旅人',en:'Fruitbrew Traveler'},color:'#ff9c91',accent:'#78b766'},
        berryTraveler:{file:'berryTraveler.png',names:{zhs:'浆果旅人',zht:'漿果旅人',ja:'ベリーの旅人',en:'Berry Traveler'},color:'#557fcc',accent:'#d85c91'},
        spicyFlameTraveler:{file:'spicyFlameTraveler.png',names:{zhs:'辣焰旅人',zht:'辣焰旅人',ja:'辛炎の旅人',en:'Spicy Flame Traveler'},color:'#f26f52',accent:'#ffd05a'},
        goldenGrainTraveler:{file:'goldenGrainTraveler.png',names:{zhs:'金穗旅人',zht:'金穗旅人',ja:'金穂の旅人',en:'Golden Grain Traveler'},color:'#e8b95c',accent:'#f3d36a'}
    };

    function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
    function format(template,values){return String(template||'').replace(/\{(\w+)\}/g,function(match,key){return values[key]===undefined?match:values[key];});}
    function localeKey(lang){
        lang=String(lang||'').toLowerCase();
        if(lang.indexOf('zh-tw')===0||lang.indexOf('zh-hk')===0||lang==='zht')return 'zht';
        if(lang.indexOf('zh')===0||lang==='zhs')return 'zhs';
        if(lang.indexOf('ja')===0)return 'ja';
        return 'en';
    }
    function make(tag,className,text){
        var node=document.createElement(tag);
        if(className)node.className=className;
        if(text!==undefined)node.textContent=text;
        return node;
    }
    function travelerProfile(character,lang){
        character=character||{};
        var id=String(character.id||character.name||'herbTraveler');
        var base=TRAVELERS[id]||TRAVELERS.herbTraveler;
        return {
            id:TRAVELERS[id]?id:'herbTraveler',file:base.file,
            name:character.displayName||base.names[lang]||base.names.en,
            color:(character.style&&character.style.color)||base.color,
            accent:(character.style&&character.style.accent)||base.accent
        };
    }
    function canvasColor(value,fallback){
        if(typeof value==='number')return '#'+('000000'+(value>>>0).toString(16)).slice(-6);
        return typeof value==='string'&&value?value:fallback;
    }

    function create(options){
        options=options||{};
        if(!options.mount)throw new Error('falling-catch requires a mount element');
        if(!options.rules)throw new Error('falling-catch requires a rules engine');

        var mount=options.mount;
        var rules=options.rules;
        var lang=localeKey(options.lang||document.documentElement.lang||navigator.language);
        var text=COPY[lang]||COPY.en;
        var traveler=travelerProfile(options.character,lang);
        var characterRenderer=window.DanboFallingCatchCharacter&&typeof window.DanboFallingCatchCharacter.draw==='function'?window.DanboFallingCatchCharacter:null;
        var simplifiedTraveler=characterRenderer?characterRenderer.profile(traveler):null;
        var assetBase=String(options.assetBase||window.DANBO_FALLING_CATCH_BASE_URL||'plugins/falling-catch/');
        if(assetBase.charAt(assetBase.length-1)!=='/')assetBase+='/';
        var portraitValue=options.characterPortrait;
        var portraitUrl=portraitValue&&portraitValue.src?portraitValue.src:(typeof portraitValue==='string'?portraitValue:assetBase+'assets/travelers/'+traveler.file+'?v=0.4.13');
        var travelerImage=new Image();
        travelerImage.decoding='async';travelerImage.src=portraitUrl;
        var fallbackLevel={id:'breezy-harvest',number:1,status:'playable',mechanics:'base',rules:{durationMs:30000,targetScore:12,lives:3},basketOffsetY:-17.5,targetCatchBox:{halfWidth:2,topOffset:-2.8,bottomOffset:-.8,mode:'center'},spawnDistribution:{minX:7,maxX:93,zoneCount:5,minHorizontalGap:8,maxHorizontalGap:32,avoidRepeatZone:true,avoidConsecutiveObstacle:true},dropTuning:{fallSpeedMin:22,fallSpeedMax:24,spawnDelayMin:.76,spawnDelayMax:.90,baseDriftMax:1.5,obstacleRate:.28,avoidConsecutiveObstacle:true},recovery:{kind:'shell-glimmer',maxPerRound:1,maxLives:3,minElapsed:6,maxElapsed:26,delayMin:1.5,delayMax:3,urgentDelayMax:1.5,cooldown:8,minX:9,maxX:91,safeObstacleGap:16,fallSpeed:18},objectPresentation:{theme:'danbo-meadow',targets:['wind-herb-leaf','berry-grove-berry','golden-grain-seed'],obstacle:'moss-weathered-stone',visualScales:{leaf:.60,berry:.62,acorn:.58,stone:.58},stoneCollisionRadius:2.05,targetCollisionRadius:1.95},name:{zhs:'风野拾集',zht:'風野拾集',ja:'風のフィールド',en:'Breezy Harvest'},description:{zhs:text.intro,zht:text.intro,ja:text.intro,en:text.intro}};
        var levels=options.levels&&options.levels.length?options.levels.slice():[fallbackLevel];
        var storage=options.storage&&typeof options.storage.get==='function'&&typeof options.storage.set==='function'?options.storage:null;
        var bypassUnlocks=options.bypassUnlocks===true,progressionEnabled=!!storage&&!bypassUnlocks,progressKey='fallingCatch.progress.maxUnlockedLevel';
        var storedUnlocked=1;if(progressionEnabled){try{storedUnlocked=Number(storage.get(progressKey,1));}catch(error){storedUnlocked=1;}}
        var maxUnlockedLevel=progressionEnabled?clamp(Number.isFinite(storedUnlocked)?Math.floor(storedUnlocked):1,1,levels.length):levels.length;
        var currentLevelIndex=0,currentLevel=levels[0];
        var durationOverride=Number(options.durationMs),targetOverride=Number(options.targetScore),livesOverride=Number(options.lives);
        var durationMs=30000,targetScore=12,startingLives=3,lastResult=null;
        var externalInput=options.input&&typeof options.input.getMoveVector==='function'?options.input:null;
        var localTouchCapable=!externalInput&&(options.forceTouchControls===true||('ontouchstart' in window)||(navigator.maxTouchPoints||0)>0||(window.matchMedia&&window.matchMedia('(pointer:coarse)').matches));
        var initialSeed=(Number(options.seed)>>>0)||((Date.now()^Math.floor(Math.random()*0xffffffff))>>>0);
        var seed=initialSeed;
        var destroyed=false,phase='loading',raf=0,lastFrame=0,spawnClock=0,resultSent=false,stageTitleTimer=0;
        var initialScreen=options.initialScreen==='stage-title'?'stage-title':(options.initialScreen==='select'?'select':'title');
        var objects=[],bursts=[];
        var spawnState={lastZone:-1,lastX:null,lastObstacle:false,hasSpawned:false,lastSide:null,sideRemaining:0};
        var recoveryState={elapsed:0,state:'waiting',delay:0,cooldown:0,count:0};
        var jumpState={elapsed:0,state:'off',nextAt:null,count:0,charge:0,airborne:false,jumpElapsed:0,offsetY:0};
        var crosswindState={phase:'off',direction:1,remaining:0,cycle:0};
        var confluenceState={phase:'off',elapsed:0};
        var comboState={streak:0,best:0,awards:0};
        var collectorMotion={velocity:0,moveAmount:0,gaitPhase:0,input:0,facing:1,startPulse:0,stopPulse:0,turnPulse:0,turnDirection:0};
        var touchInput={active:false,x:0,pointerId:null},touchEngaged=false,touchControlsVisible=false;
        var worldHeight=62;
        var PLAYER_RENDER_SCALE=.3;
        var TRAVELER_VISUAL_SCALE=.85;
        var MOBILE_TRAVELER_VISUAL_SCALE=1.9656;
        var FALLING_OBJECT_VISUAL_SCALE=.88;
        var STONE_COLLISION_RADIUS=2.95;
        var DESKTOP_DROP_SCALE=.70;
        var MOBILE_DROP_SCALE=1.75;
        var desktopDropMedia=window.matchMedia?window.matchMedia('(min-width:768px) and (pointer:fine)'):null;
        var mobileScaleMedia=window.matchMedia?window.matchMedia('(max-width:640px) and (pointer:coarse)'):null;
        var player={x:50,y:54.3,w:17,h:5.4,speed:61};
        var pressed={left:false,right:false};

        function levelIndex(reference){
            if(reference===undefined||reference===null||reference==='')return 0;
            var numeric=Number(reference);
            if(Number.isFinite(numeric)&&Math.floor(numeric)===numeric&&numeric>=1&&numeric<=levels.length)return numeric-1;
            var id=String(reference);for(var i=0;i<levels.length;i++)if(levels[i].id===id)return i;
            return 0;
        }
        function isLevelUnlocked(index){return !progressionEnabled||index<maxUnlockedLevel;}
        function progressionSnapshot(){return {enabled:progressionEnabled,bypassed:bypassUnlocks,maxUnlockedLevel:maxUnlockedLevel,totalLevels:levels.length,key:progressKey};}
        function unlockNextLevel(){
            if(!progressionEnabled||currentLevelIndex+1>=levels.length||maxUnlockedLevel>=currentLevelIndex+2)return false;
            maxUnlockedLevel=currentLevelIndex+2;try{storage.set(progressKey,maxUnlockedLevel);}catch(error){}
            root.dataset.maxUnlockedLevel=String(maxUnlockedLevel);
            if(typeof options.onEvent==='function')options.onEvent('levelUnlock',{levelId:levels[maxUnlockedLevel-1].id,levelNumber:maxUnlockedLevel,totalLevels:levels.length});return true;
        }
        function localized(value){return value&&(value[lang]||value.en||value.zhs)||'';}
        function applyLevel(index){
            currentLevelIndex=clamp(index|0,0,levels.length-1);currentLevel=levels[currentLevelIndex];
            var levelRules=currentLevel.rules||{};
            durationMs=clamp(Number.isFinite(durationOverride)&&durationOverride>0?durationOverride:(Number(levelRules.durationMs)||30000),1000,600000)|0;
            targetScore=clamp(Number.isFinite(targetOverride)&&targetOverride>0?targetOverride:(Number(levelRules.targetScore)||12),1,999)|0;
            startingLives=clamp(Number.isFinite(livesOverride)&&livesOverride>0?livesOverride:(Number(levelRules.lives)||3),1,9)|0;
        }
        var requestedLevelIndex=levelIndex(options.startLevelId||options.levelId);applyLevel(isLevelUnlocked(requestedLevelIndex)?requestedLevelIndex:Math.max(0,maxUnlockedLevel-1));
        resetCrosswindState(false);
        resetConfluenceState(false);

        mount.innerHTML='';
        var root=make('section','dfc-shell');
        root.setAttribute('aria-label',text.title);
        root.dataset.characterRenderer=simplifiedTraveler?'simplified-canvas':'portrait-fallback';
        root.dataset.progression=progressionEnabled?'locked':'open';root.dataset.maxUnlockedLevel=String(maxUnlockedLevel);
        var top=make('header','dfc-topbar');
        var brand=make('div','dfc-brand');
        brand.appendChild(make('span','dfc-brand-mark','⌁'));
        var brandCopy=make('div','dfc-brand-copy');
        var brandTitle=make('strong','',text.title);brandCopy.appendChild(brandTitle);
        brandCopy.appendChild(make('small','',text.eyebrow));
        brand.appendChild(brandCopy);
        var topStatus=make('div','dfc-top-status');
        var travelerBadge=make('div','dfc-traveler-badge');
        var badgePortrait=make('img','dfc-traveler-badge-image');badgePortrait.src=portraitUrl;badgePortrait.alt='';
        travelerBadge.appendChild(badgePortrait);travelerBadge.appendChild(make('span','',traveler.name));
        var levelBadge=make('span','dfc-level-badge','');
        var modeBadge=make('span','dfc-mode',text.loading);
        topStatus.appendChild(travelerBadge);topStatus.appendChild(levelBadge);topStatus.appendChild(modeBadge);
        top.appendChild(brand);top.appendChild(topStatus);

        var stage=make('div','dfc-stage');
        var canvas=make('canvas','dfc-canvas');
        canvas.setAttribute('aria-label',text.intro);
        stage.appendChild(canvas);
        var hud=make('div','dfc-hud');
        var scoreBox=make('div','dfc-stat');scoreBox.appendChild(make('span','',text.score));var scoreValue=make('strong','','0');scoreBox.appendChild(scoreValue);
        var timeBox=make('div','dfc-stat dfc-stat-time');timeBox.appendChild(make('span','',text.time));var timeValue=make('strong','','30.0');timeBox.appendChild(timeValue);
        var livesBox=make('div','dfc-stat');livesBox.appendChild(make('span','',text.lives));var livesValue=make('strong','dfc-hearts','● ● ●');livesBox.appendChild(livesValue);
        hud.appendChild(scoreBox);hud.appendChild(timeBox);hud.appendChild(livesBox);stage.appendChild(hud);
        var notice=make('div','dfc-notice');stage.appendChild(notice);
        var confluenceStatus=make('div','dfc-confluence-status');
        var confluencePhaseValue=make('span','','');var comboValue=make('strong','','');confluenceStatus.appendChild(confluencePhaseValue);confluenceStatus.appendChild(comboValue);stage.appendChild(confluenceStatus);
        var jumpStatus=make('div','dfc-jump-status');var jumpStatusLabel=make('span','',text.jumpLabel);var jumpStatusValue=make('strong','','×0');jumpStatus.appendChild(jumpStatusLabel);jumpStatus.appendChild(jumpStatusValue);stage.appendChild(jumpStatus);
        var jumpButton=make('button','dfc-jump-button',text.jumpAction);jumpButton.type='button';jumpButton.hidden=true;jumpButton.disabled=true;jumpButton.dataset.state='waiting';jumpButton.setAttribute('aria-label',text.jumpAction);jumpButton.setAttribute('aria-disabled','true');

        var overlay=make('div','dfc-overlay');
        var card=make('div','dfc-card');overlay.appendChild(card);stage.appendChild(overlay);
        var introTraveler=make('div','dfc-intro-traveler');
        var introPortrait=make('img','');introPortrait.src=portraitUrl;introPortrait.alt=traveler.name;
        introTraveler.appendChild(introPortrait);introTraveler.appendChild(make('span','',traveler.name));
        var cardEyebrow=make('p','dfc-card-eyebrow',text.eyebrow);
        var cardTitle=make('h1','',text.title);
        var cardBody=make('p','dfc-card-body',text.intro);
        var goal=make('p','dfc-goal',text.goal);
        var primary=make('button','dfc-primary',text.loading);primary.type='button';primary.disabled=true;
        card.appendChild(introTraveler);card.appendChild(cardEyebrow);card.appendChild(cardTitle);card.appendChild(cardBody);card.appendChild(goal);card.appendChild(primary);

        var controls=make('div','dfc-controls');
        var touchJoystick=make('div','dfc-touch-joystick');touchJoystick.hidden=true;touchJoystick.setAttribute('role','application');touchJoystick.setAttribute('aria-label',text.touchMove);
        var touchBase=make('div','dfc-touch-joystick-base');var touchKnob=make('div','dfc-touch-joystick-knob');touchBase.appendChild(touchKnob);touchJoystick.appendChild(touchBase);
        var leftButton=make('button','dfc-move dfc-left','←');leftButton.type='button';leftButton.setAttribute('aria-label',text.move+' — left');
        var hint=make('div','dfc-control-hint');var hintLabel=make('span','',text.move),hintKeys=make('small','', 'A / D · ← / →');hint.appendChild(hintLabel);hint.appendChild(hintKeys);
        var rightButton=make('button','dfc-move dfc-right','→');rightButton.type='button';rightButton.setAttribute('aria-label',text.move+' — right');
        controls.appendChild(touchJoystick);controls.appendChild(leftButton);controls.appendChild(hint);controls.appendChild(rightButton);
        root.appendChild(top);root.appendChild(stage);root.appendChild(controls);root.appendChild(jumpButton);mount.appendChild(root);

        var context=canvas.getContext('2d');
        if(!context)throw new Error('Canvas 2D is unavailable');

        function snapshot(){
            var state=rules.snapshot();
            state.levelId=currentLevel.id;state.levelNumber=currentLevel.number||currentLevelIndex+1;state.totalLevels=levels.length;
            state.jumpCharge=jumpState.charge;state.airborne=jumpState.airborne;state.jumpOffsetY=jumpState.offsetY;
            state.maxUnlockedLevel=maxUnlockedLevel;state.progressionEnabled=progressionEnabled;
            return state;
        }
        function updateLevelPresentation(){
            var levelName=localized(currentLevel.name)||text.title;
            var levelLabel=format(text.level,{current:currentLevelIndex+1,total:levels.length});
            brandTitle.textContent=levelName;root.setAttribute('aria-label',levelName);root.dataset.levelId=currentLevel.id;root.dataset.levelNumber=String(currentLevelIndex+1);
            levelBadge.textContent=levelLabel;levelBadge.classList.toggle('dfc-level-framework',currentLevel.status==='framework');
            cardEyebrow.textContent=levelLabel+(currentLevel.status==='framework'?' · '+text.framework:'');
            cardTitle.textContent=levelName;cardBody.textContent=localized(currentLevel.description)||text.intro;
            goal.textContent=text.goal;canvas.setAttribute('aria-label',localized(currentLevel.description)||text.intro);
        }
        function updateHud(){
            var state=snapshot();
            var idle=phase!=='running'&&phase!=='result';
            var shownScore=idle?0:state.score,shownRemaining=idle?durationMs:state.remainingMs,shownLives=idle?startingLives:state.lives;
            scoreValue.textContent=String(shownScore);
            timeValue.textContent=(Math.max(0,shownRemaining)/1000).toFixed(1);
            var lifeText=[];for(var i=0;i<startingLives;i++)lifeText.push(i<shownLives?'●':'○');
            livesValue.textContent=lifeText.join(' ');
            livesBox.classList.toggle('dfc-danger',shownLives===1);
            updateConfluenceStatus();updateJumpUI();
        }
        function confluencePhaseText(){return confluenceState.phase==='gather'?text.phaseGather:(confluenceState.phase==='alternate'?text.phaseAlternate:text.phaseConverge);}
        function updateConfluenceStatus(){
            var visible=!!(currentLevel.confluence&&phase==='running');
            confluenceStatus.classList.toggle('dfc-show',visible);
            if(visible){confluencePhaseValue.textContent=confluencePhaseText();comboValue.textContent=format(text.chain,{count:comboState.streak});}
        }
        function updateJumpUI(){
            var running=phase==='running',available=!!(currentLevel.jumpPower&&running),touchAction=running&&(localTouchCapable||touchControlsVisible);
            jumpStatus.classList.toggle('dfc-show',available);jumpStatusValue.textContent='×'+jumpState.charge;
            jumpButton.hidden=!touchAction;jumpButton.disabled=jumpState.airborne;
            var buttonState=!available?'unavailable':(jumpState.airborne?'airborne':(jumpState.charge>0?'ready':'waiting')),logicallyDisabled=!available||jumpState.charge<=0||jumpState.airborne;jumpButton.dataset.state=buttonState;jumpButton.setAttribute('aria-disabled',logicallyDisabled?'true':'false');
            jumpButton.setAttribute('aria-label',text.jumpAction+(buttonState==='unavailable'?' · '+text.jumpUnavailable:(buttonState==='waiting'?' · '+text.jumpNeedSprout:'')));
            jumpButton.classList.toggle('dfc-ready',buttonState==='ready');root.dataset.jumpCharge=String(jumpState.charge);root.dataset.airborne=jumpState.airborne?'true':'false';root.dataset.touchJump=touchAction?'visible':'hidden';
        }
        function showNotice(message,tone){
            notice.textContent=message;
            notice.className='dfc-notice dfc-show '+(tone||'');
            clearTimeout(showNotice.timer);
            showNotice.timer=setTimeout(function(){notice.className='dfc-notice';},tone==='dfc-phase'||tone==='dfc-help'?1400:650);
        }
        function play(name){try{if(typeof options.play==='function')options.play(name);}catch(error){}}
        function random(){return rules.random();}
        function dropTuning(){return currentLevel.dropTuning||{};}
        function tunedRange(minimum,maximum,fallbackMin,fallbackMax){
            var min=Number(minimum),max=Number(maximum);if(!Number.isFinite(min))min=fallbackMin;if(!Number.isFinite(max))max=fallbackMax;if(max<min){var swap=max;max=min;min=swap;}return min+random()*(max-min);
        }
        function nextSpawnDelay(){var tuning=dropTuning();return tunedRange(tuning.spawnDelayMin,tuning.spawnDelayMax,.48,.90);}
        function resetSpawnState(){spawnState.lastZone=-1;spawnState.lastX=null;spawnState.lastObstacle=false;spawnState.hasSpawned=false;spawnState.lastSide=null;spawnState.sideRemaining=0;}
        function resetRecoveryState(){recoveryState.elapsed=0;recoveryState.state='waiting';recoveryState.delay=0;recoveryState.cooldown=0;recoveryState.count=0;}
        function resetJumpState(){jumpState.elapsed=0;jumpState.state=currentLevel.jumpPower?'waiting':'off';jumpState.nextAt=null;jumpState.count=0;jumpState.charge=0;jumpState.airborne=false;jumpState.jumpElapsed=0;jumpState.offsetY=0;updateJumpUI();}
        function resetCollectorMotion(){
            collectorMotion.velocity=0;collectorMotion.moveAmount=0;collectorMotion.gaitPhase=0;collectorMotion.input=0;collectorMotion.facing=1;
            collectorMotion.startPulse=0;collectorMotion.stopPulse=0;collectorMotion.turnPulse=0;collectorMotion.turnDirection=0;
        }
        function updateCollectorMotion(direction,dt){
            direction=direction>0?1:(direction<0?-1:0);
            var previous=collectorMotion.input;
            if(direction&&!previous)collectorMotion.startPulse=1;
            if(!direction&&previous)collectorMotion.stopPulse=1;
            if(direction&&previous&&direction!==previous){collectorMotion.turnPulse=1;collectorMotion.turnDirection=direction;}
            collectorMotion.input=direction;if(direction)collectorMotion.facing=direction;
            var velocityBlend=1-Math.exp(-dt*(direction?15:10)),moveBlend=1-Math.exp(-dt*(direction?13:8));
            collectorMotion.velocity+=(direction-collectorMotion.velocity)*velocityBlend;
            collectorMotion.moveAmount+=((direction?1:0)-collectorMotion.moveAmount)*moveBlend;
            if(collectorMotion.moveAmount>.01)collectorMotion.gaitPhase+=dt*(7.8+collectorMotion.moveAmount*4.4);
            collectorMotion.startPulse=Math.max(0,collectorMotion.startPulse-dt*4.2);
            collectorMotion.stopPulse=Math.max(0,collectorMotion.stopPulse-dt*3.6);
            collectorMotion.turnPulse=Math.max(0,collectorMotion.turnPulse-dt*3.8);
        }
        function motionPulse(value){return value>0?Math.sin((1-value)*Math.PI):0;}
        function collectorPose(){
            var move=clamp(collectorMotion.moveAmount,0,1),step=Math.sin(collectorMotion.gaitPhase),beat=Math.abs(step);
            var idle=Math.sin(performance.now()/360)*.18*(1-move*.82),start=motionPulse(collectorMotion.startPulse),stop=motionPulse(collectorMotion.stopPulse),turn=motionPulse(collectorMotion.turnPulse);
            var bodyX=step*.3*move+collectorMotion.turnDirection*turn*.42;
            var bodyY=idle-beat*.82*move+start*.42-stop*.34;
            var lean=collectorMotion.velocity*.1+step*.021*move-collectorMotion.turnDirection*turn*.095;
            var scaleX=1+beat*.045*move+start*.055+stop*.035;
            var scaleY=1-beat*.035*move-start*.065+stop*.028;
            return {
                move:move,step:step,beat:beat,facing:collectorMotion.facing,bodyX:bodyX,bodyY:bodyY,lean:lean,scaleX:scaleX,scaleY:scaleY,
                basketX:-collectorMotion.velocity*.34+step*.13*move+collectorMotion.turnDirection*turn*.18,
                basketY:bodyY*.38+beat*.13*move,
                basketRotation:-lean*.36-step*.027*move,
                basketScaleX:1,basketScaleY:1,
                shadowScaleX:1+beat*.075*move+start*.05,shadowScaleY:1-beat*.13*move-start*.04
            };
        }
        function collectorMotionSnapshot(){return {velocity:collectorMotion.velocity,moveAmount:collectorMotion.moveAmount,gaitPhase:collectorMotion.gaitPhase,input:collectorMotion.input,facing:collectorMotion.facing,startPulse:collectorMotion.startPulse,stopPulse:collectorMotion.stopPulse,turnPulse:collectorMotion.turnPulse};}
        function emitCrosswindPhase(){
            if(typeof options.onEvent==='function'&&currentLevel.crosswind)options.onEvent('crosswindPhase',{levelId:currentLevel.id,phase:crosswindState.phase,direction:crosswindState.direction,cycle:crosswindState.cycle,remaining:crosswindState.remaining});
        }
        function resetCrosswindState(notify){
            var crosswind=currentLevel&&currentLevel.crosswind;
            if(!crosswind){crosswindState.phase='off';crosswindState.direction=1;crosswindState.remaining=0;crosswindState.cycle=0;return;}
            crosswindState.phase='cue';crosswindState.direction=Number(crosswind.initialDirection)<0?-1:1;crosswindState.remaining=Number(crosswind.cueDuration)||.8;crosswindState.cycle=0;
            if(notify)emitCrosswindPhase();
        }
        function updateCrosswind(dt){
            var crosswind=currentLevel.crosswind;if(!crosswind)return;
            crosswindState.remaining-=dt;
            while(crosswindState.remaining<=0){
                var overflow=-crosswindState.remaining;
                if(crosswindState.phase==='cue'){
                    crosswindState.phase='active';crosswindState.remaining=(Number(crosswind.activeDuration)||3)-overflow;
                }else if(crosswindState.phase==='active'){
                    crosswindState.phase='calm';crosswindState.remaining=(Number(crosswind.calmDuration)||1)-overflow;
                }else{
                    crosswindState.phase='cue';crosswindState.direction*=-1;crosswindState.cycle++;crosswindState.remaining=(Number(crosswind.cueDuration)||.8)-overflow;
                }
                emitCrosswindPhase();
            }
        }
        function emitConfluencePhase(){
            if(typeof options.onEvent==='function'&&currentLevel.confluence)options.onEvent('confluencePhase',{levelId:currentLevel.id,phase:confluenceState.phase,elapsed:confluenceState.elapsed});
            if(phase==='running'){showNotice(confluencePhaseText(),'dfc-phase');updateConfluenceStatus();}
        }
        function resetConfluenceState(notify){
            if(!currentLevel||!currentLevel.confluence){confluenceState.phase='off';confluenceState.elapsed=0;return;}
            confluenceState.phase='gather';confluenceState.elapsed=0;if(notify)emitConfluencePhase();
        }
        function updateConfluence(dt){
            var config=currentLevel.confluence;if(!config)return;
            confluenceState.elapsed+=dt;
            var gatherEnd=Number(config.gatherDuration)||10,convergeStart=gatherEnd+(Number(config.alternateDuration)||10);
            var nextPhase=confluenceState.elapsed<gatherEnd?'gather':(confluenceState.elapsed<convergeStart?'alternate':'converge');
            if(nextPhase!==confluenceState.phase){
                confluenceState.phase=nextPhase;
                if(nextPhase==='alternate')resetCrosswindState(true);
                emitConfluencePhase();
            }
            if(confluenceState.phase!=='gather')updateCrosswind(dt);
        }
        function airflowEnabled(){
            if(!currentLevel.airflow)return false;
            if(!currentLevel.confluence)return true;
            if(confluenceState.phase==='gather'||confluenceState.phase==='converge')return true;
            return confluenceState.phase==='alternate'&&crosswindState.phase==='calm';
        }
        function crosswindEnabled(){return !!(currentLevel.crosswind&&(!currentLevel.confluence||confluenceState.phase!=='gather'));}
        function resetComboState(){comboState.streak=0;comboState.best=0;comboState.awards=0;}
        function breakCombo(reason){
            if(!currentLevel.confluence||comboState.streak<=0)return;
            var previous=comboState.streak;comboState.streak=0;
            updateConfluenceStatus();
            if(typeof options.onEvent==='function')options.onEvent('comboBreak',{levelId:currentLevel.id,reason:reason,previous:previous});
        }
        function distributedSpawnX(config){
            var minX=Number(config.minX),maxX=Number(config.maxX);if(!Number.isFinite(minX))minX=7;if(!Number.isFinite(maxX))maxX=93;if(maxX<minX){var swap=maxX;maxX=minX;minX=swap;}
            var zoneCount=Math.max(2,config.zoneCount|0),zoneWidth=(maxX-minX)/zoneCount,minGap=Math.max(0,Number(config.minHorizontalGap)||0),maxGap=Number(config.maxHorizontalGap);
            if(!Number.isFinite(maxGap)||maxGap<=0)maxGap=Infinity;if(maxGap<minGap)maxGap=minGap;
            var ranges=[];
            function addRange(zone,low,high){if(high>=low)ranges.push({zone:zone,low:low,high:high});}
            function collectRanges(allowRepeat){
                ranges.length=0;
                for(var zone=0;zone<zoneCount;zone++){
                    if(!allowRepeat&&config.avoidRepeatZone&&zone===spawnState.lastZone)continue;
                    var zoneLow=minX+zone*zoneWidth,zoneHigh=zone===zoneCount-1?maxX:zoneLow+zoneWidth;
                    if(spawnState.lastX===null){addRange(zone,zoneLow,zoneHigh);continue;}
                    addRange(zone,Math.max(zoneLow,spawnState.lastX-maxGap),Math.min(zoneHigh,spawnState.lastX-minGap));
                    addRange(zone,Math.max(zoneLow,spawnState.lastX+minGap),Math.min(zoneHigh,spawnState.lastX+maxGap));
                }
            }
            collectRanges(false);if(!ranges.length&&config.avoidRepeatZone)collectRanges(true);
            var chosen;
            if(ranges.length){var range=ranges[Math.floor(random()*ranges.length)];chosen={x:range.low+random()*(range.high-range.low),zone:range.zone};}
            else{var x=minX+random()*(maxX-minX);chosen={x:x,zone:Math.min(zoneCount-1,Math.floor((x-minX)/zoneWidth))};}
            spawnState.lastZone=chosen.zone;spawnState.lastX=chosen.x;
            return chosen;
        }
        function objectPresentation(){return currentLevel.objectPresentation||null;}
        function responsiveDropScale(){return desktopDropMedia&&desktopDropMedia.matches?DESKTOP_DROP_SCALE:(mobileScaleMedia&&mobileScaleMedia.matches?MOBILE_DROP_SCALE:1);}
        function responsiveCollisionScale(){return desktopDropMedia&&desktopDropMedia.matches?DESKTOP_DROP_SCALE:1;}
        function responsiveTravelerScale(){return mobileScaleMedia&&mobileScaleMedia.matches?MOBILE_TRAVELER_VISUAL_SCALE:TRAVELER_VISUAL_SCALE;}
        function responsiveBurstFontSize(){return mobileScaleMedia&&mobileScaleMedia.matches?4:2.4;}
        function fallingObjectScale(kind){
            var presentation=objectPresentation(),scales=presentation&&presentation.visualScales;
            var value=scales&&Number(scales[kind]);
            value=Number.isFinite(value)&&value>0?value:FALLING_OBJECT_VISUAL_SCALE;return value*responsiveDropScale();
        }
        function stoneCollisionRadius(){
            var presentation=objectPresentation(),value=presentation&&Number(presentation.stoneCollisionRadius);
            value=Number.isFinite(value)&&value>0?value:STONE_COLLISION_RADIUS;return value*responsiveCollisionScale();
        }
        function targetCollisionRadius(){
            var presentation=objectPresentation(),value=presentation&&Number(presentation.targetCollisionRadius);
            value=Number.isFinite(value)&&value>0?value:2.8;return value*responsiveCollisionScale();
        }
        function presentationKind(kind){
            var presentation=objectPresentation();
            if(!presentation)return kind;
            if(kind==='stone')return presentation.obstacle||kind;
            var index=['leaf','berry','acorn'].indexOf(kind);
            return index>=0&&presentation.targets&&presentation.targets[index]?presentation.targets[index]:kind;
        }
        function usesDanboMeadowObjects(){var presentation=objectPresentation();return !!(presentation&&presentation.theme==='danbo-meadow');}
        function spawnObject(){
            var distribution=currentLevel.spawnDistribution;
            var airflow=currentLevel.airflow;
            var tuning=dropTuning(),obstacleRate=Number(tuning.obstacleRate);if(!Number.isFinite(obstacleRate))obstacleRate=.28;obstacleRate=clamp(obstacleRate,0,.8);
            var obstacleRoll=random(),obstacle=obstacleRoll<obstacleRate;
            if(tuning.avoidConsecutiveObstacle||(distribution&&distribution.avoidConsecutiveObstacle)){
                if(spawnState.lastObstacle)obstacle=false;
                else obstacle=obstacleRoll<(spawnState.hasSpawned?obstacleRate/(1-obstacleRate):obstacleRate);
            }
            var kind=obstacle?'stone':['leaf','berry','acorn'][Math.floor(random()*3)];
            var spawnPosition;
            if(distribution)spawnPosition=distributedSpawnX(distribution);
            else if(airflow&&airflow.sideSpawn!==false){
                var sideGroupSize=Math.max(1,Number(airflow.sideGroupSize)||1),fromLeft;
                if(sideGroupSize>1&&spawnState.sideRemaining>0){fromLeft=spawnState.lastSide;spawnState.sideRemaining--;}
                else{fromLeft=random()<.5;spawnState.lastSide=fromLeft;spawnState.sideRemaining=sideGroupSize-1;}
                var sideMin=Number(airflow.spawnSideMinX)||18,sideMax=Number(airflow.spawnSideMaxX)||34;
                var sideX=sideMin+random()*(sideMax-sideMin);
                spawnPosition={x:fromLeft?sideX:100-sideX,zone:fromLeft?0:1,fromLeft:fromLeft};
            }else spawnPosition={x:7+random()*86,zone:-1};
            var driftMax=Number(tuning.baseDriftMax);if(!Number.isFinite(driftMax)||driftMax<0)driftMax=4;
            var spawnY=-6-random()*4,fallSpeed=tunedRange(tuning.fallSpeedMin,tuning.fallSpeedMax,22,32),drift=(random()*2-1)*driftMax;
            if(airflow&&!obstacle&&airflow.sideSpawn!==false){
                var diagonalMin=Number(airflow.diagonalMinSpeed)||10,diagonalMax=Number(airflow.diagonalMaxSpeed)||14;
                drift=(spawnPosition.fromLeft?1:-1)*(diagonalMin+random()*(diagonalMax-diagonalMin));
            }
            var item={
                type:obstacle?'obstacle':'target',kind:kind,presentationKind:presentationKind(kind),x:spawnPosition.x,y:spawnY,
                radius:kind==='stone'?stoneCollisionRadius():targetCollisionRadius(),vy:fallSpeed,drift:drift,
                turn:(random()-.5)*3.5,rotation:random()*Math.PI*2,
                airflowEligible:!!(airflow&&!obstacle&&airflow.affectedKinds&&airflow.affectedKinds.indexOf(kind)>=0),airflowState:'ready',airflowTimer:0,lastCrosswindCycle:-1
            };
            objects.push(item);spawnState.lastObstacle=obstacle;spawnState.hasSpawned=true;
            if(typeof options.onEvent==='function')options.onEvent('spawn',{levelId:currentLevel.id,type:item.type,kind:item.kind,presentationKind:item.presentationKind,x:item.x,zone:spawnPosition.zone,drift:item.drift,fallSpeed:item.vy,visualScale:fallingObjectScale(item.kind),collisionRadius:item.radius,airflowEligible:item.airflowEligible});
        }
        function recoverySpawnX(config){
            var minX=Number(config.minX),maxX=Number(config.maxX);if(!Number.isFinite(minX))minX=9;if(!Number.isFinite(maxX))maxX=91;if(maxX<minX){var swap=maxX;maxX=minX;minX=swap;}
            var safeGap=Math.max(0,Number(config.safeObstacleGap)||16),best={x:minX+(maxX-minX)*random(),clearance:-1};
            for(var attempt=0;attempt<8;attempt++){
                var candidate=minX+(maxX-minX)*random(),clearance=Infinity;
                for(var i=0;i<objects.length;i++)if(objects[i].type==='obstacle')clearance=Math.min(clearance,Math.abs(candidate-objects[i].x));
                if(clearance>best.clearance)best={x:candidate,clearance:clearance};
                if(clearance>=safeGap)return candidate;
            }
            return best.x;
        }
        function spawnRecovery(){
            var config=currentLevel.recovery;if(!config||recoveryState.count>=Math.max(1,Number(config.maxPerRound)||1)){recoveryState.state='done';return false;}
            var item={type:'recovery',kind:config.kind||'shell-glimmer',presentationKind:config.kind||'shell-glimmer',x:recoverySpawnX(config),y:-7,radius:2.35,vy:Number(config.fallSpeed)||18,drift:0,turn:.55,rotation:random()*Math.PI*2,age:0,floatPhase:random()*Math.PI*2,airflowEligible:false,airflowState:'immune',airflowTimer:0,lastCrosswindCycle:-1};
            objects.push(item);recoveryState.count++;recoveryState.state='spawned';showNotice(text.glimmerAppears,'dfc-good');
            if(typeof options.onEvent==='function'){options.onEvent('spawn',{levelId:currentLevel.id,type:item.type,kind:item.kind,presentationKind:item.presentationKind,x:item.x,zone:-1,drift:0,airflowEligible:false});options.onEvent('recoverySpawn',{levelId:currentLevel.id,kind:item.kind,x:item.x,count:recoveryState.count});}
            return true;
        }
        function completeRecoveryAttempt(){
            var config=currentLevel.recovery,maxPerRound=Math.max(1,Number(config&&config.maxPerRound)||1);
            if(recoveryState.count>=maxPerRound){recoveryState.state='done';recoveryState.cooldown=0;return;}
            recoveryState.state='cooldown';recoveryState.cooldown=Math.max(0,Number(config&&config.cooldown)||6);
        }
        function updateRecovery(dt){
            var config=currentLevel.recovery;if(!config||recoveryState.state==='done')return;
            recoveryState.elapsed+=dt;if(recoveryState.state==='spawned')return;
            var minElapsed=Math.max(0,Number(config.minElapsed)||6),maxElapsed=Math.max(minElapsed,Number(config.maxElapsed)||26),maxLives=Math.max(1,Number(config.maxLives)||3),maxPerRound=Math.max(1,Number(config.maxPerRound)||1);
            if(recoveryState.count>=maxPerRound){recoveryState.state='done';return;}
            if(recoveryState.state==='cooldown'){
                recoveryState.cooldown-=dt;if(recoveryState.cooldown>0)return;recoveryState.cooldown=0;recoveryState.state='waiting';
            }
            if(recoveryState.state==='waiting'){
                if(recoveryState.elapsed>maxElapsed)return;
                if(recoveryState.elapsed>=minElapsed&&rules.lives()<maxLives){
                    var delayMin=Math.max(0,Number(config.delayMin)||1.5),delayMax=Math.max(delayMin,Number(config.delayMax)||3);
                    recoveryState.delay=delayMin+random()*(delayMax-delayMin);
                    if(rules.lives()<=1){var urgentDelayMax=Math.max(0,Number(config.urgentDelayMax)||1.5);recoveryState.delay=Math.min(recoveryState.delay,urgentDelayMax);}
                    recoveryState.delay=Math.min(recoveryState.delay,Math.max(0,maxElapsed-recoveryState.elapsed));recoveryState.state='queued';
                }
            }
            if(recoveryState.state==='queued'){
                if(rules.lives()>=maxLives){recoveryState.state='waiting';recoveryState.delay=0;return;}
                recoveryState.delay-=dt;if(recoveryState.delay<=0)spawnRecovery();
            }
        }
        function scheduleJumpPower(initial){
            var config=currentLevel.jumpPower;if(!config)return false;
            var maxPerRound=Math.max(1,Number(config.maxPerRound)||1),maxElapsed=Math.max(0,Number(config.maxElapsed)||24);if(jumpState.count>=maxPerRound){jumpState.state='done';return false;}
            var earliest,latest;
            if(initial){earliest=Math.max(0,Number(config.minElapsed)||5);latest=Math.max(earliest,Number(config.firstLatest)||earliest);}
            else{earliest=jumpState.elapsed+Math.max(0,Number(config.cooldown)||8);latest=earliest+Math.max(0,Number(config.rescheduleJitter)||2);}
            latest=Math.min(maxElapsed,latest);if(earliest>maxElapsed){jumpState.state='done';return false;}
            jumpState.nextAt=earliest+random()*(latest-earliest);jumpState.state='waiting';return true;
        }
        function spawnJumpPower(){
            var config=currentLevel.jumpPower,maxPerRound=Math.max(1,Number(config&&config.maxPerRound)||1);if(!config||jumpState.count>=maxPerRound){jumpState.state='done';return false;}
            var item={type:'jump-power',kind:config.kind||'wind-sprout',presentationKind:config.kind||'wind-sprout',x:recoverySpawnX(config),y:-7,radius:2.25,vy:Number(config.fallSpeed)||20,drift:0,turn:.7,rotation:random()*Math.PI*2,age:0,floatPhase:random()*Math.PI*2,airflowEligible:false,airflowState:'immune',airflowTimer:0,lastCrosswindCycle:-1};
            objects.push(item);jumpState.count++;jumpState.state='falling';jumpState.nextAt=null;showNotice(text.windSproutAppears,'dfc-good');
            if(typeof options.onEvent==='function'){options.onEvent('spawn',{levelId:currentLevel.id,type:item.type,kind:item.kind,presentationKind:item.presentationKind,x:item.x,zone:-1,drift:0,fallSpeed:item.vy,visualScale:1,collisionRadius:item.radius,airflowEligible:false});options.onEvent('jumpPowerSpawn',{levelId:currentLevel.id,kind:item.kind,x:item.x,count:jumpState.count});}return true;
        }
        function completeJumpPowerDrop(caught,item){
            var config=currentLevel.jumpPower,maxPerRound=Math.max(1,Number(config&&config.maxPerRound)||1);
            if(caught){jumpState.charge=Math.min(Math.max(1,Number(config&&config.maxCharges)||1),jumpState.charge+1);jumpState.state='stored';jumpState.nextAt=null;showNotice(text.windSproutStored,'dfc-good');play('confirm');}
            else{jumpState.state=jumpState.count>=maxPerRound?'done':'waiting';jumpState.nextAt=null;}
            updateJumpUI();
            if(typeof options.onEvent==='function')options.onEvent(caught?'jumpPowerCollect':'jumpPowerMiss',{levelId:currentLevel.id,kind:item.kind,count:jumpState.count,charge:jumpState.charge});
        }
        function triggerJump(source){
            var config=currentLevel.jumpPower;if(phase!=='running'||!config||jumpState.charge<=0||jumpState.airborne)return false;
            jumpState.charge--;jumpState.airborne=true;jumpState.jumpElapsed=0;jumpState.offsetY=0;jumpState.state=jumpState.count>=Math.max(1,Number(config.maxPerRound)||1)?'done':'waiting';jumpState.nextAt=null;updateJumpUI();play('confirm');
            if(typeof options.onEvent==='function')options.onEvent('jumpStart',{levelId:currentLevel.id,source:source||'api',charge:jumpState.charge,duration:Number(config.jumpDuration)||.75,height:Number(config.jumpHeight)||10});return true;
        }
        function updateJumpPower(dt){
            var config=currentLevel.jumpPower;if(!config)return;
            if(externalInput&&typeof externalInput.consumeAction==='function'){try{if(externalInput.consumeAction('jump'))triggerJump('external');}catch(error){}}
            jumpState.elapsed+=dt;
            if(jumpState.airborne){
                var duration=Math.max(.2,Number(config.jumpDuration)||.75),height=Math.max(1,Number(config.jumpHeight)||10);jumpState.jumpElapsed+=dt;
                var progress=clamp(jumpState.jumpElapsed/duration,0,1);jumpState.offsetY=-height*Math.sin(Math.PI*progress);
                if(progress>=1){jumpState.airborne=false;jumpState.jumpElapsed=0;jumpState.offsetY=0;updateJumpUI();if(typeof options.onEvent==='function')options.onEvent('jumpLand',{levelId:currentLevel.id,charge:jumpState.charge});}
            }
            if(jumpState.state==='falling'||jumpState.state==='stored'||jumpState.state==='done'||jumpState.charge>0)return;
            if(jumpState.nextAt===null&&!scheduleJumpPower(jumpState.count===0))return;
            if(jumpState.elapsed>=jumpState.nextAt)spawnJumpPower();
        }
        function collectorY(){return player.y+jumpState.offsetY;}
        function jumpMotionSnapshot(){return {enabled:!!currentLevel.jumpPower,state:jumpState.state,count:jumpState.count,charge:jumpState.charge,airborne:jumpState.airborne,elapsed:jumpState.jumpElapsed,offsetY:jumpState.offsetY,nextAt:jumpState.nextAt};}
        function insideAirflow(item,airflow){
            return item.x>=airflow.centerX-airflow.halfWidth&&item.x<=airflow.centerX+airflow.halfWidth&&item.y>=airflow.top&&item.y<=airflow.bottom;
        }
        function moveObject(item,dt){
            var airflow=currentLevel.airflow,crosswind=currentLevel.crosswind,verticalSpeed=item.vy,horizontalSpeed=item.drift;
            if(item.type==='recovery'||item.type==='jump-power'){
                item.age=(item.age||0)+dt;horizontalSpeed=Math.sin(item.age*2.15+item.floatPhase)*(item.type==='jump-power'?0.52:0.72);item.y+=verticalSpeed*dt*(worldHeight/62);item.x+=horizontalSpeed*dt;item.rotation+=item.turn*dt;return;
            }
            if(airflow&&airflowEnabled()&&item.airflowEligible&&item.airflowState==='ready'&&insideAirflow(item,airflow)){
                item.airflowState='lifting';item.airflowTimer=Number(airflow.liftDuration)||.55;
                if(typeof options.onEvent==='function')options.onEvent('airflowEnter',{levelId:currentLevel.id,type:item.type,kind:item.kind,x:item.x,y:item.y});
            }
            if(airflow&&item.airflowState==='lifting'){
                item.airflowTimer-=dt;verticalSpeed=Number(airflow.liftSpeed)||-8;
                horizontalSpeed+=(item.x<airflow.centerX?1:-1)*(Number(airflow.horizontalPush)||0);
                if(item.airflowTimer<=0){item.airflowState='spent';item.drift*=.62;}
            }
            if(crosswind&&crosswindEnabled()&&crosswindState.phase==='active'){
                var windSpeed=Number(crosswind.speed)||0;
                horizontalSpeed=clamp(horizontalSpeed+crosswindState.direction*windSpeed,-(Number(crosswind.maxHorizontalSpeed)||12),Number(crosswind.maxHorizontalSpeed)||12);
                if(item.lastCrosswindCycle!==crosswindState.cycle){
                    item.lastCrosswindCycle=crosswindState.cycle;
                    if(typeof options.onEvent==='function')options.onEvent('crosswindApply',{levelId:currentLevel.id,type:item.type,kind:item.kind,direction:crosswindState.direction,speed:windSpeed,cycle:crosswindState.cycle});
                }
            }
            item.y+=verticalSpeed*dt*(worldHeight/62);item.x+=horizontalSpeed*dt;item.rotation+=item.turn*dt;
        }
        function circleRectHit(item){
            var centerY=collectorY(),left=player.x-player.w/2,right=player.x+player.w/2,top=centerY-player.h/2,bottom=centerY+player.h/2;
            var nearX=clamp(item.x,left,right),nearY=clamp(item.y,top,bottom);
            var dx=item.x-nearX,dy=item.y-nearY;
            return dx*dx+dy*dy<=item.radius*item.radius;
        }
        function targetHit(item){
            var box=currentLevel.targetCatchBox||(jumpState.airborne&&currentLevel.jumpPower&&currentLevel.jumpPower.catchBox);
            if(!box)return circleRectHit(item);
            var centerY=collectorY();return item.x>=player.x-box.halfWidth&&item.x<=player.x+box.halfWidth&&item.y>=centerY+box.topOffset&&item.y<=centerY+box.bottomOffset;
        }
        function jumpPowerHit(item){
            var box=currentLevel.jumpPower&&currentLevel.jumpPower.catchBox;if(!box)return targetHit(item);
            var centerY=collectorY();return item.x>=player.x-box.halfWidth&&item.x<=player.x+box.halfWidth&&item.y>=centerY+box.topOffset&&item.y<=centerY+box.bottomOffset;
        }
        function addBurst(item,label,color){
            bursts.push({x:item.x,y:item.y,label:label,color:color,life:1});
        }
        function handleObject(item){
            if(item.type==='jump-power'){
                completeJumpPowerDrop(true,item);addBurst(item,'↑','#dfffe0');
            }else if(item.type==='recovery'){
                var before=rules.lives(),cap=Math.max(1,Number(currentLevel.recovery&&currentLevel.recovery.maxLives)||3);rules.restore(1,cap);completeRecoveryAttempt();
                addBurst(item,'+1','#fff4c7');showNotice(text.lifeRestored,'dfc-good');play('confirm');
                if(typeof options.onEvent==='function')options.onEvent('recoveryCollect',{levelId:currentLevel.id,kind:item.kind,before:before,lives:rules.lives(),cap:cap});
            }else if(item.type==='target'){
                var points=1,comboAward=false;
                if(currentLevel.confluence){
                    var combo=currentLevel.confluence,every=Math.max(2,Number(combo.comboEvery)||3),bonus=Math.max(0,Number(combo.comboBonus)||1);
                    comboState.streak++;comboState.best=Math.max(comboState.best,comboState.streak);
                    if(comboState.streak%every===0){points+=bonus;comboState.awards+=bonus;comboAward=true;}
                    if(typeof options.onEvent==='function')options.onEvent('combo',{levelId:currentLevel.id,streak:comboState.streak,points:points,bonus:comboAward?bonus:0,best:comboState.best});
                }
                rules.collect(points);addBurst(item,'+'+points,comboAward?'#fff1a3':'#fff4b0');showNotice(comboAward?format(text.combo,{count:comboState.streak}):text.caught,'dfc-good');play('catch-success');
            }else{
                breakCombo('obstacle');
                rules.hit();addBurst(item,'−1','#ffd4cd');showNotice(text.hit,'dfc-bad');root.classList.remove('dfc-shake');void root.offsetWidth;root.classList.add('dfc-shake');play('obstacle-hit');
            }
            updateHud();
            if(rules.status()!==window.DanboFallingCatchRules.RUNNING)finishRound(rules.status());
        }
        function update(dt){
            var previousX=player.x;
            var keyboardDirection=pressed.left&&!pressed.right?-1:(pressed.right&&!pressed.left?1:0),touchDirection=touchMovement(),moveDirection=Math.abs(touchDirection)>.001?touchDirection:keyboardDirection;
            player.x+=player.speed*moveDirection*dt;
            player.x=clamp(player.x,player.w/2+1,100-player.w/2-1);
            var traveled=dt>0?(player.x-previousX)/(player.speed*dt):0;updateCollectorMotion(traveled,dt);
            if(currentLevel.confluence)updateConfluence(dt);else updateCrosswind(dt);
            updateRecovery(dt);updateJumpPower(dt);
            spawnClock-=dt;
            if(spawnClock<=0){spawnObject();spawnClock=nextSpawnDelay();}
            for(var i=objects.length-1;i>=0;i--){
                var item=objects[i];moveObject(item,dt);
                if(item.x<item.radius||item.x>100-item.radius)item.drift*=-1;
                var objectHit=item.type==='obstacle'?circleRectHit(item):(item.type==='jump-power'?jumpPowerHit(item):targetHit(item));
                if(objectHit){objects.splice(i,1);handleObject(item);if(phase!=='running')break;continue;}
                if(item.y>worldHeight+6){if(item.type==='target')breakCombo('miss');if(item.type==='recovery'){completeRecoveryAttempt();if(typeof options.onEvent==='function')options.onEvent('recoveryMiss',{levelId:currentLevel.id,kind:item.kind,count:recoveryState.count});}if(item.type==='jump-power')completeJumpPowerDrop(false,item);objects.splice(i,1);}
            }
            for(var b=bursts.length-1;b>=0;b--){bursts[b].life-=dt*1.6;bursts[b].y-=dt*5;if(bursts[b].life<=0)bursts.splice(b,1);}
            if(phase==='running'){
                rules.tick(Math.max(0,Math.round(dt*1000)));
                updateHud();
                if(rules.status()!==window.DanboFallingCatchRules.RUNNING)finishRound(rules.status());
            }
        }

        function drawBackground(){
            var ground=worldHeight-5.5,hillBack=worldHeight-25,hillFront=worldHeight-18;
            var gradient=context.createLinearGradient(0,0,0,worldHeight);
            gradient.addColorStop(0,'#9dded2');gradient.addColorStop(.64,'#dff1c5');gradient.addColorStop(1,'#f5e3a7');
            context.fillStyle=gradient;context.fillRect(0,0,100,worldHeight);
            context.fillStyle='rgba(255,250,218,.72)';context.beginPath();context.arc(82,Math.max(9,worldHeight*.13),5.2,0,Math.PI*2);context.fill();
            context.fillStyle='#87b895';context.beginPath();context.moveTo(0,hillBack+3);context.quadraticCurveTo(17,hillBack-8,36,hillBack+3);context.quadraticCurveTo(55,hillBack-12,76,hillBack+3);context.quadraticCurveTo(90,hillBack-6,100,hillBack+1);context.lineTo(100,worldHeight);context.lineTo(0,worldHeight);context.closePath();context.fill();
            context.fillStyle='#5f9878';context.beginPath();context.moveTo(0,hillFront);context.quadraticCurveTo(22,hillFront-10,44,hillFront);context.quadraticCurveTo(72,hillFront-12,100,hillFront+1);context.lineTo(100,worldHeight);context.lineTo(0,worldHeight);context.closePath();context.fill();
            context.fillStyle='#376d59';context.fillRect(0,ground,100,5.5);
            context.strokeStyle='rgba(255,255,255,.38)';context.lineWidth=.25;
            for(var i=0;i<6;i++){var x=8+i*18;context.beginPath();context.moveTo(x,16+(i%2)*5);context.bezierCurveTo(x+5,14,x+8,19,x+13,17);context.stroke();}
            context.strokeStyle='#7eb68a';context.lineWidth=.35;
            for(var g=0;g<24;g++){var gx=(g*17)%101;var gh=2+(g%4)*.5;context.beginPath();context.moveTo(gx,ground+1.5);context.quadraticCurveTo(gx-.9,ground+.5-gh*.5,gx-.2,ground-gh);context.stroke();}
        }
        function drawAirflow(){
            var airflow=currentLevel.airflow;if(!airflow||!airflowEnabled())return;
            var left=airflow.centerX-airflow.halfWidth,right=airflow.centerX+airflow.halfWidth,top=airflow.top,bottom=airflow.bottom;
            var wash=context.createLinearGradient(0,bottom,0,top);wash.addColorStop(0,'rgba(212,255,235,.04)');wash.addColorStop(.45,'rgba(222,255,243,.2)');wash.addColorStop(1,'rgba(255,255,245,.03)');
            context.fillStyle=wash;context.beginPath();context.moveTo(left+4,bottom);context.quadraticCurveTo(left-2,(top+bottom)/2,left+5,top);context.lineTo(right-5,top);context.quadraticCurveTo(right+2,(top+bottom)/2,right-4,bottom);context.closePath();context.fill();
            var now=performance.now()/1000;context.lineCap='round';
            for(var i=0;i<6;i++){
                var progress=(now*(.13+i*.012)+i*.173)%1;
                var y=bottom-progress*(bottom-top),sway=Math.sin(now*1.5+i*1.7)*3.2;
                context.globalAlpha=.22+.22*(1-progress);context.strokeStyle=i%2?'#f4fff1':'#c8f4df';context.lineWidth=.35+(i%3)*.09;
                context.beginPath();context.moveTo(airflow.centerX-5+sway,y+4);context.bezierCurveTo(airflow.centerX-10+sway,y+1,airflow.centerX+8-sway,y-2,airflow.centerX+3-sway,y-6);context.stroke();
                context.beginPath();context.moveTo(airflow.centerX+3-sway,y-6);context.lineTo(airflow.centerX+.8-sway,y-4.7);context.moveTo(airflow.centerX+3-sway,y-6);context.lineTo(airflow.centerX+4.4-sway,y-3.7);context.stroke();
            }
            context.globalAlpha=1;context.lineCap='butt';
        }
        function drawAirflowAura(item){
            if(item.airflowState!=='lifting')return;
            context.save();context.translate(item.x,item.y);context.strokeStyle='rgba(236,255,238,.75)';context.lineWidth=.35;context.beginPath();context.arc(0,0,item.radius*fallingObjectScale(item.kind)+1.2,0,Math.PI*2);context.stroke();context.restore();
        }
        function drawCrosswind(){
            var crosswind=currentLevel.crosswind;if(!crosswind||!crosswindEnabled()||crosswindState.phase==='off'||crosswindState.phase==='calm')return;
            var direction=crosswindState.direction,isCue=crosswindState.phase==='cue',now=performance.now()/1000;
            context.save();context.lineCap='round';
            if(isCue){
                var pulse=.68+Math.sin(now*7)*.18,sourceX=direction>0?2:98;
                context.globalAlpha=pulse;context.fillStyle='#fff0a8';context.fillRect(direction>0?0:96,7,4,39);
                context.globalAlpha=.9;context.fillStyle='rgba(38,76,68,.78)';context.fillRect(41,7,18,5.2);
                context.fillStyle='#fff7cf';context.textAlign='center';context.textBaseline='middle';context.font='800 3px system-ui, sans-serif';context.fillText(direction>0?'→  →  →':'←  ←  ←',50,9.6);
                context.strokeStyle='#fff0a8';context.lineWidth=.7;
                for(var c=0;c<3;c++){
                    var cy=19+c*9;context.beginPath();context.moveTo(sourceX,cy);context.lineTo(sourceX+direction*(8+c*2),cy);context.lineTo(sourceX+direction*(5.8+c*2),cy-1.5);context.moveTo(sourceX+direction*(8+c*2),cy);context.lineTo(sourceX+direction*(5.8+c*2),cy+1.5);context.stroke();
                }
            }else{
                context.strokeStyle='rgba(235,255,246,.64)';context.lineWidth=.42;
                for(var i=0;i<8;i++){
                    var progress=(now*(.42+i*.012)+i*.139)%1,x=direction>0?-18+progress*136:118-progress*136,y=13+(i%6)*6.2,length=8+(i%3)*2.5;
                    context.globalAlpha=.35+(i%3)*.13;context.beginPath();context.moveTo(x,y);context.bezierCurveTo(x+direction*length*.35,y-1.2,x+direction*length*.7,y+1.2,x+direction*length,y);context.stroke();
                }
            }
            context.globalAlpha=1;context.restore();
        }
        function drawConfluence(){
            if(!currentLevel.confluence)return;
            var now=performance.now()/1000,count=confluenceState.phase==='gather'?9:(confluenceState.phase==='alternate'?13:19);
            context.save();
            var tint=context.createLinearGradient(0,0,100,worldHeight);
            if(confluenceState.phase==='gather'){tint.addColorStop(0,'rgba(228,255,218,.03)');tint.addColorStop(1,'rgba(206,247,229,.08)');}
            else if(confluenceState.phase==='alternate'){tint.addColorStop(0,'rgba(212,246,255,.09)');tint.addColorStop(1,'rgba(239,224,255,.08)');}
            else{tint.addColorStop(0,'rgba(255,237,170,.12)');tint.addColorStop(.5,'rgba(224,243,255,.08)');tint.addColorStop(1,'rgba(236,216,255,.13)');}
            context.fillStyle=tint;context.fillRect(0,0,100,worldHeight);
            context.fillStyle=confluenceState.phase==='converge'?'#ffe58c':(confluenceState.phase==='alternate'?'#e9f9ff':'#eefbd5');
            for(var i=0;i<count;i++){
                var x=(i*23+now*(2.8+i%3))%106-3,y=8+(i*11)%41+Math.sin(now*1.7+i)*2.4,size=.5+(i%3)*.2;
                context.globalAlpha=.36+(i%4)*.13;context.beginPath();context.moveTo(x,y-size*2);context.lineTo(x+size*.55,y-size*.55);context.lineTo(x+size*2,y);context.lineTo(x+size*.55,y+size*.55);context.lineTo(x,y+size*2);context.lineTo(x-size*.55,y+size*.55);context.lineTo(x-size*2,y);context.lineTo(x-size*.55,y-size*.55);context.closePath();context.fill();
            }
            context.globalAlpha=1;context.restore();
        }
        function drawLeaf(item){
            context.save();context.translate(item.x,item.y);context.rotate(item.rotation);context.scale(fallingObjectScale(item.kind),fallingObjectScale(item.kind));
            if(usesDanboMeadowObjects()){
                context.strokeStyle='#557a49';context.lineWidth=.48;context.lineCap='round';context.beginPath();context.moveTo(-2.3,2.8);context.quadraticCurveTo(-.2,.3,1.7,-2.9);context.stroke();
                context.fillStyle='#79ad62';context.beginPath();context.moveTo(-.4,.8);context.quadraticCurveTo(-3.3,-.2,-3,-2.5);context.quadraticCurveTo(-.6,-2.7,.6,-.2);context.closePath();context.fill();
                context.fillStyle='#a6cf76';context.beginPath();context.moveTo(.5,-.7);context.quadraticCurveTo(3.2,-1.2,3,-3.4);context.quadraticCurveTo(.9,-3.7,.1,-1.5);context.closePath();context.fill();
                context.strokeStyle='rgba(238,255,210,.72)';context.lineWidth=.3;context.beginPath();context.moveTo(-2.25,-1.65);context.quadraticCurveTo(-1.2,-1.1,-.35,-.1);context.moveTo(2.35,-2.75);context.quadraticCurveTo(1.45,-2.2,.55,-1.05);context.stroke();
            }else{
                context.fillStyle='#f1c96b';context.beginPath();context.moveTo(-3,0);context.quadraticCurveTo(0,-3.4,3,0);context.quadraticCurveTo(0,3.4,-3,0);context.fill();context.strokeStyle='#8d7f43';context.lineWidth=.35;context.beginPath();context.moveTo(-2.2,0);context.lineTo(2.5,0);context.stroke();
            }
            context.restore();
        }
        function drawBerry(item){
            context.save();context.translate(item.x,item.y);context.rotate(item.rotation);context.scale(fallingObjectScale(item.kind),fallingObjectScale(item.kind));
            if(usesDanboMeadowObjects()){
                context.fillStyle='#6a4f9e';context.beginPath();context.arc(-1.25,.35,1.5,0,Math.PI*2);context.arc(1.2,.35,1.5,0,Math.PI*2);context.arc(0,1.65,1.55,0,Math.PI*2);context.fill();
                context.fillStyle='rgba(226,206,246,.72)';context.beginPath();context.arc(-1.65,-.05,.36,0,Math.PI*2);context.arc(.76,-.12,.32,0,Math.PI*2);context.arc(-.4,1.15,.3,0,Math.PI*2);context.fill();
                context.fillStyle='#628657';context.beginPath();context.moveTo(0,-.85);context.lineTo(-1.7,-2.2);context.lineTo(-.35,-2.05);context.lineTo(.15,-3);context.lineTo(.72,-1.95);context.lineTo(1.8,-2.28);context.lineTo(.95,-.72);context.closePath();context.fill();
            }else{
                context.fillStyle='#a94d68';context.beginPath();context.arc(-1.2,.4,1.55,0,Math.PI*2);context.arc(1.2,.4,1.55,0,Math.PI*2);context.arc(0,1.6,1.55,0,Math.PI*2);context.fill();context.fillStyle='#4f875e';context.beginPath();context.moveTo(0,-1);context.lineTo(-1.2,-2.6);context.lineTo(.2,-2);context.lineTo(1.5,-2.7);context.lineTo(1,-.8);context.closePath();context.fill();
            }
            context.restore();
        }
        function drawAcorn(item){
            context.save();context.translate(item.x,item.y);context.rotate(item.rotation);context.scale(fallingObjectScale(item.kind),fallingObjectScale(item.kind));
            if(usesDanboMeadowObjects()){
                context.fillStyle='#e4b94f';context.beginPath();context.moveTo(0,-3.45);context.bezierCurveTo(2.45,-1.8,2.25,1.55,0,3.35);context.bezierCurveTo(-2.25,1.55,-2.45,-1.8,0,-3.45);context.fill();
                context.fillStyle='#f4d876';context.beginPath();context.moveTo(0,-2.65);context.bezierCurveTo(1.25,-1.25,1.05,1.25,0,2.25);context.bezierCurveTo(-.65,.55,-.65,-1.1,0,-2.65);context.fill();
                context.strokeStyle='#9a7738';context.lineWidth=.38;context.beginPath();context.moveTo(0,-2.9);context.lineTo(0,2.55);context.moveTo(-1.15,-1.65);context.quadraticCurveTo(-2.5,-1.25,-2.75,-.25);context.moveTo(1.15,-1.65);context.quadraticCurveTo(2.5,-1.25,2.75,-.25);context.stroke();
            }else{
                context.fillStyle='#b97845';context.beginPath();context.ellipse(0,.5,2.2,2.8,0,0,Math.PI*2);context.fill();context.fillStyle='#6c7045';context.beginPath();context.arc(0,-1.3,2.25,Math.PI,Math.PI*2);context.lineTo(2,-.7);context.lineTo(-2,-.7);context.closePath();context.fill();context.strokeStyle='#6c7045';context.lineWidth=.45;context.beginPath();context.moveTo(0,-2.5);context.quadraticCurveTo(.2,-3.5,1,-3.7);context.stroke();
            }
            context.restore();
        }
        function drawStone(item){
            context.save();context.translate(item.x,item.y);context.rotate(item.rotation);context.scale(fallingObjectScale(item.kind),fallingObjectScale(item.kind));
            context.fillStyle=usesDanboMeadowObjects()?'#68736c':'#657270';context.beginPath();context.moveTo(-3.2,1.7);context.lineTo(-2.5,-1.8);context.lineTo(-.5,-3);context.lineTo(2.7,-1.8);context.lineTo(3.2,1.5);context.lineTo(1,3);context.lineTo(-1.8,2.7);context.closePath();context.fill();
            context.fillStyle=usesDanboMeadowObjects()?'#8b9588':'#87918d';context.beginPath();context.moveTo(-1.8,-1.4);context.lineTo(-.4,-2.4);context.lineTo(1.5,-1.7);context.lineTo(.4,-.8);context.closePath();context.fill();
            if(usesDanboMeadowObjects()){
                context.fillStyle='#6f925d';context.beginPath();context.moveTo(-2.75,-1.25);context.quadraticCurveTo(-1.75,-2.25,-.55,-2.45);context.lineTo(.5,-1.68);context.quadraticCurveTo(-.85,-1.2,-1.75,-.35);context.closePath();context.fill();context.fillStyle='#a8bc77';context.beginPath();context.arc(-1.45,-1.55,.38,0,Math.PI*2);context.arc(-.65,-1.82,.28,0,Math.PI*2);context.fill();
            }
            context.restore();
        }
        function drawEggshellGlimmer(item){
            var pulse=.92+Math.sin(performance.now()/240+item.floatPhase)*.08;
            context.save();context.translate(item.x,item.y);context.rotate(Math.sin(item.rotation*.7)*.12);context.scale(pulse,pulse);
            var aura=context.createRadialGradient(0,0,.25,0,0,5.3);aura.addColorStop(0,'rgba(255,251,205,.82)');aura.addColorStop(.42,'rgba(239,255,219,.38)');aura.addColorStop(1,'rgba(210,255,230,0)');context.fillStyle=aura;context.beginPath();context.arc(0,0,5.3,0,Math.PI*2);context.fill();
            context.fillStyle='#fff8dd';context.beginPath();context.moveTo(-.45,-2.65);context.bezierCurveTo(-2.45,-2.8,-3.45,-1.05,-3.1,.8);context.bezierCurveTo(-2.82,2.28,-1.45,3.02,-.3,2.1);context.quadraticCurveTo(-1.08,1.42,-.48,.76);context.quadraticCurveTo(-1.2,.12,-.42,-.48);context.quadraticCurveTo(-1.08,-1.12,-.45,-2.65);context.fill();
            context.fillStyle='#f3e8c9';context.beginPath();context.moveTo(.45,-2.65);context.bezierCurveTo(2.45,-2.8,3.45,-1.05,3.1,.8);context.bezierCurveTo(2.82,2.28,1.45,3.02,.3,2.1);context.quadraticCurveTo(1.08,1.42,.48,.76);context.quadraticCurveTo(1.2,.12,.42,-.48);context.quadraticCurveTo(1.08,-1.12,.45,-2.65);context.fill();
            context.fillStyle='rgba(255,255,255,.72)';context.beginPath();context.ellipse(-1.85,-1.18,.62,.9,-.42,0,Math.PI*2);context.fill();context.beginPath();context.ellipse(1.55,-1.38,.52,.76,.38,0,Math.PI*2);context.fill();
            var core=context.createRadialGradient(-.25,-.25,.12,0,0,2.25);core.addColorStop(0,'#fffbd1');core.addColorStop(.52,'#e6f6b0');core.addColorStop(1,'rgba(182,232,166,.08)');context.fillStyle=core;context.beginPath();context.arc(0,.05,2.25,0,Math.PI*2);context.fill();
            context.fillStyle='rgba(255,247,174,.78)';for(var i=0;i<3;i++){var angle=item.rotation+i*Math.PI*2/3;context.beginPath();context.arc(Math.cos(angle)*(3.45+i*.1),Math.sin(angle)*(2.7+i*.12),.28-i*.035,0,Math.PI*2);context.fill();}
            context.restore();
        }
        function drawWindSprout(item){
            var pulse=.96+Math.sin(performance.now()/210+item.floatPhase)*.06;
            context.save();context.translate(item.x,item.y);context.rotate(Math.sin(item.rotation*.55)*.14);context.scale(pulse,pulse);
            var aura=context.createRadialGradient(0,0,.3,0,0,5);aura.addColorStop(0,'rgba(226,255,226,.68)');aura.addColorStop(.5,'rgba(157,229,196,.26)');aura.addColorStop(1,'rgba(112,205,178,0)');context.fillStyle=aura;context.beginPath();context.arc(0,0,5,0,Math.PI*2);context.fill();
            var seed=context.createLinearGradient(-2,-2.8,2,3);seed.addColorStop(0,'#ecf7bd');seed.addColorStop(.56,'#9edca7');seed.addColorStop(1,'#68b58c');context.fillStyle=seed;context.beginPath();context.moveTo(0,-3.25);context.bezierCurveTo(2.65,-1.8,2.75,1.35,0,3.15);context.bezierCurveTo(-2.75,1.35,-2.65,-1.8,0,-3.25);context.fill();
            context.fillStyle='rgba(255,255,226,.78)';context.beginPath();context.moveTo(0,1.95);context.bezierCurveTo(-.72,.7,-.7,-.35,0,-1.55);context.bezierCurveTo(.7,-.35,.72,.7,0,1.95);context.fill();
            context.fillStyle='#75c59a';context.beginPath();context.moveTo(-.1,-2.55);context.bezierCurveTo(-2.05,-3.65,-3.05,-2.7,-2.48,-1.25);context.bezierCurveTo(-1.2,-1.2,-.45,-1.7,-.1,-2.55);context.fill();context.beginPath();context.moveTo(.1,-2.55);context.bezierCurveTo(2.05,-3.65,3.05,-2.7,2.48,-1.25);context.bezierCurveTo(1.2,-1.2,.45,-1.7,.1,-2.55);context.fill();
            context.fillStyle='rgba(247,255,208,.78)';for(var i=0;i<3;i++){var angle=item.rotation+i*Math.PI*2/3;context.beginPath();context.arc(Math.cos(angle)*(3.15+i*.12),Math.sin(angle)*(2.55+i*.08),.25-i*.035,0,Math.PI*2);context.fill();}
            context.restore();
        }
        function drawFallbackTraveler(bob){
            var body=canvasColor(traveler.color,'#bfe8a0'),accent=canvasColor(traveler.accent,'#8fd16a');
            context.save();context.translate(0,bob-6.8);
            context.fillStyle=body;context.beginPath();context.moveTo(0,-6.8);context.bezierCurveTo(-4.2,-6.2,-5.3,-1.2,-4.2,2.7);context.bezierCurveTo(-3.1,6,3.1,6,4.2,2.7);context.bezierCurveTo(5.3,-1.2,4.2,-6.2,0,-6.8);context.fill();
            context.strokeStyle='#4d6759';context.lineWidth=.35;context.fillStyle='#355f4b';
            context.beginPath();context.arc(-1.65,-1.4,.55,0,Math.PI*2);context.arc(1.65,-1.4,.55,0,Math.PI*2);context.fill();
            context.beginPath();context.arc(0,.25,1.35,.15,Math.PI-.15);context.stroke();
            context.strokeStyle=accent;context.lineWidth=1.1;context.beginPath();context.moveTo(0,-6.2);context.quadraticCurveTo(-1.4,-8,-2.8,-7.2);context.moveTo(0,-6.2);context.quadraticCurveTo(1.5,-8.2,3,-7.2);context.stroke();
            context.restore();
        }
        function transformCollectorPoint(x,y,pose){
            x*=pose.scaleX;y*=pose.scaleY;var cosine=Math.cos(pose.lean),sine=Math.sin(pose.lean);
            return {x:pose.bodyX+x*cosine-y*sine,y:pose.bodyY+x*sine+y*cosine};
        }
        function drawCollectorSteps(pose){
            if(phase!=='running'||pose.move<.08||jumpState.airborne)return;
            context.save();context.globalAlpha=.12+.2*pose.move;context.fillStyle=canvasColor(traveler.accent,'#8fd16a');
            var trail=-pose.facing,offset=(collectorMotion.gaitPhase%1)*1.2;
            for(var i=0;i<3;i++){var x=trail*(5.8+i*2.05+offset*.65),size=1.05-i*.2;context.beginPath();context.ellipse(x,3.45-i*.18,size,.42,0,0,Math.PI*2);context.fill();}
            context.restore();
        }
        function drawTravelerCollector(){
            var pose=collectorPose(),basketOffsetY=Number(currentLevel.basketOffsetY)||0,jumpRatio=currentLevel.jumpPower?Math.min(1,Math.abs(jumpState.offsetY)/(Number(currentLevel.jumpPower.jumpHeight)||10)):0;
            context.save();context.translate(player.x,player.y);
            context.translate(0,4.4);context.scale(PLAYER_RENDER_SCALE,PLAYER_RENDER_SCALE);context.translate(0,-4.4);
            drawCollectorSteps(pose);
            context.save();context.globalAlpha=1-jumpRatio*.58;context.translate(0,4.4);context.scale(pose.shadowScaleX*(1-jumpRatio*.3),pose.shadowScaleY*(1-jumpRatio*.18));context.translate(0,-4.4);context.fillStyle='rgba(41,79,64,.2)';context.beginPath();context.ellipse(0,4.4,8.4,1.45,0,0,Math.PI*2);context.fill();context.restore();
            if(jumpState.offsetY)context.translate(0,jumpState.offsetY/PLAYER_RENDER_SCALE);
            var travelerVisualScale=responsiveTravelerScale();
            context.save();context.translate(pose.bodyX,pose.bodyY);context.rotate(pose.lean);context.scale(pose.scaleX,pose.scaleY);context.scale(travelerVisualScale,travelerVisualScale);
            context.fillStyle=canvasColor(traveler.accent,'#8fd16a');context.globalAlpha=.16;context.beginPath();context.ellipse(0,-4.7,8.8,8.1,0,0,Math.PI*2);context.fill();context.globalAlpha=1;
            if(simplifiedTraveler){
                characterRenderer.draw(context,simplifiedTraveler,pose);
            }else if(travelerImage.complete&&travelerImage.naturalWidth){
                var sourceHeight=Math.max(1,Math.floor(travelerImage.naturalHeight*.85));
                context.drawImage(travelerImage,0,0,travelerImage.naturalWidth,sourceHeight,-7.4,-15.3,14.8,15.2);
            }else drawFallbackTraveler(0);
            context.restore();
            var hands=simplifiedTraveler?characterRenderer.handAnchors(pose):{left:{x:-3.4,y:-11.2},right:{x:3.4,y:-11.2}};
            var leftShoulder=transformCollectorPoint(hands.left.x*travelerVisualScale,hands.left.y*travelerVisualScale,pose),rightShoulder=transformCollectorPoint(hands.right.x*travelerVisualScale,hands.right.y*travelerVisualScale,pose);
            context.strokeStyle='rgba(160,116,65,.76)';context.lineWidth=1.05;context.lineCap='round';context.beginPath();
            if(basketOffsetY){context.moveTo(leftShoulder.x,leftShoulder.y);context.lineTo(pose.basketX-5.4,basketOffsetY+pose.basketY+2.2);context.moveTo(rightShoulder.x,rightShoulder.y);context.lineTo(pose.basketX+5.4,basketOffsetY+pose.basketY+2.2);}
            else{context.moveTo(leftShoulder.x,leftShoulder.y+7.7*TRAVELER_VISUAL_SCALE);context.lineTo(pose.basketX-5.4,pose.basketY-1);context.moveTo(rightShoulder.x,rightShoulder.y+7.7*TRAVELER_VISUAL_SCALE);context.lineTo(pose.basketX+5.4,pose.basketY-1);}
            context.stroke();context.save();context.translate(pose.basketX,basketOffsetY+pose.basketY);context.rotate(pose.basketRotation);context.scale(pose.basketScaleX,pose.basketScaleY);
            context.strokeStyle='rgba(183,134,74,.82)';context.lineWidth=1.15;context.lineCap='round';context.beginPath();context.arc(0,-1.05,5.65,Math.PI+.08,Math.PI*2-.08);context.stroke();
            var basketShade=context.createLinearGradient(0,-1,0,4.4);basketShade.addColorStop(0,'#deb978');basketShade.addColorStop(1,'#bd854d');context.fillStyle=basketShade;context.beginPath();context.moveTo(-6.55,-.75);context.quadraticCurveTo(-6.05,3.75,-4.8,4.05);context.quadraticCurveTo(0,5.05,4.8,4.05);context.quadraticCurveTo(6.05,3.75,6.55,-.75);context.closePath();context.fill();
            context.fillStyle='#f1d99a';context.beginPath();context.ellipse(0,-.8,6.7,1.12,0,0,Math.PI*2);context.fill();context.fillStyle='rgba(151,104,57,.25)';context.beginPath();context.ellipse(0,-.74,5.55,.62,0,0,Math.PI*2);context.fill();context.fillStyle='rgba(255,255,255,.16)';context.beginPath();context.ellipse(-2.6,1.55,1.45,2.05,-.18,0,Math.PI*2);context.fill();context.restore();context.restore();
        }
        function draw(){
            var rect=canvas.getBoundingClientRect();
            if(rect.width<=0||rect.height<=0)return;
            var dpr=Math.min(2,window.devicePixelRatio||1),pixelW=Math.round(rect.width*dpr),pixelH=Math.round(rect.height*dpr);
            if(canvas.width!==pixelW||canvas.height!==pixelH){canvas.width=pixelW;canvas.height=pixelH;}
            var scale=canvas.width/100;
            worldHeight=canvas.height/scale;
            player.y=worldHeight-7.7;
            context.setTransform(scale,0,0,scale,0,0);
            drawBackground();
            drawConfluence();
            drawAirflow();
            drawCrosswind();
            for(var i=0;i<objects.length;i++){
                var item=objects[i];drawAirflowAura(item);if(item.kind==='shell-glimmer')drawEggshellGlimmer(item);else if(item.kind==='wind-sprout')drawWindSprout(item);else if(item.kind==='leaf')drawLeaf(item);else if(item.kind==='berry')drawBerry(item);else if(item.kind==='acorn')drawAcorn(item);else drawStone(item);
            }
            drawTravelerCollector();
            var burstFontSize=responsiveBurstFontSize(),largePhoneBurst=burstFontSize>2.4;context.textAlign='center';context.textBaseline='middle';context.font='900 '+burstFontSize+'px system-ui, sans-serif';
            for(var b=0;b<bursts.length;b++){var burst=bursts[b];context.globalAlpha=clamp(burst.life,0,1);if(largePhoneBurst){context.lineWidth=.52;context.strokeStyle='rgba(37,76,61,.78)';context.strokeText(burst.label,burst.x,burst.y);}context.fillStyle=burst.color;context.fillText(burst.label,burst.x,burst.y);context.globalAlpha=1;}
        }
        function frame(now){
            if(destroyed)return;
            var dt=lastFrame?Math.min(.05,(now-lastFrame)/1000):0;lastFrame=now;
            if(document.hidden)dt=0;
            if(phase==='running')update(dt);
            draw();raf=requestAnimationFrame(frame);
        }

        function setScreen(name){root.dataset.screen=name;syncTouchControlMode(name==='running');}
        function clearStageTitleTimer(){if(stageTitleTimer){clearTimeout(stageTitleTimer);stageTitleTimer=0;}}
        function makeTitleEmblem(theme,compact){
            var emblem=make('div','dfc-title-emblem dfc-title-emblem-'+(theme||'harvest')+(compact?' dfc-title-emblem-compact':''));
            emblem.setAttribute('aria-hidden','true');
            var wind=make('span','dfc-title-wind');wind.appendChild(make('i'));wind.appendChild(make('i'));wind.appendChild(make('i'));
            var basket=make('span','dfc-title-basket');basket.appendChild(make('i'));basket.appendChild(make('i'));
            var drops=make('span','dfc-title-drops');drops.appendChild(make('i'));drops.appendChild(make('i'));drops.appendChild(make('i'));
            emblem.appendChild(wind);emblem.appendChild(basket);emblem.appendChild(drops);return emblem;
        }
        function makeItemGuide(){
            var items=currentLevel.guideItems||[];if(!items.length)return null;
            var section=make('section','dfc-item-guide');section.setAttribute('aria-label',text.guideTitle);
            section.appendChild(make('p','dfc-item-guide-title',text.guideTitle));
            var grid=make('div','dfc-item-guide-grid');
            for(var i=0;i<items.length;i++){
                var item=items[i],article=make('article','dfc-item-guide-entry');article.dataset.guideItem=item.kind||'item';
                var icon=make('i','dfc-item-guide-icon dfc-item-guide-icon-'+(item.kind||'item'));icon.setAttribute('aria-hidden','true');
                var copy=make('span','dfc-item-guide-copy');copy.appendChild(make('b','',localized(item.name)));copy.appendChild(make('small','',localized(item.description)));
                article.appendChild(icon);article.appendChild(copy);grid.appendChild(article);
            }
            section.appendChild(grid);return section;
        }
        function updateOverallPresentation(){
            brandTitle.textContent=text.title;root.setAttribute('aria-label',text.title);root.dataset.levelId='';root.dataset.levelNumber='0';
            levelBadge.textContent=text.chooseLevel;levelBadge.classList.remove('dfc-level-framework');
        }
        function showTitle(){
            if(destroyed)return false;clearStageTitleTimer();phase=phase==='loading'?'loading':'title';setScreen('title');updateOverallPresentation();
            card.className='dfc-card dfc-entry-card';card.innerHTML='';
            card.appendChild(makeTitleEmblem('harvest',false));card.appendChild(make('p','dfc-card-eyebrow',text.eyebrow));card.appendChild(make('h1','',text.title));card.appendChild(make('p','dfc-card-body',text.titleIntro));
            var enter=make('button','dfc-primary',phase==='loading'?text.loading:text.enterLevels);enter.type='button';enter.disabled=phase==='loading';enter.onclick=showLevelSelect;card.appendChild(enter);
            if(typeof options.onExit==='function'){var exitTitle=make('button','dfc-secondary dfc-title-exit',text.exit);exitTitle.type='button';exitTitle.onclick=function(){options.onExit({status:'exit',score:rules.score(),lives:rules.lives()});};card.appendChild(exitTitle);}
            overlay.classList.remove('dfc-hidden');updateHud();if(!enter.disabled)setTimeout(function(){try{enter.focus({preventScroll:true});}catch(error){enter.focus();}},0);return true;
        }
        function showLevelSelect(){
            if(destroyed||phase==='loading'||phase==='running')return false;clearStageTitleTimer();phase='select';setScreen('select');updateOverallPresentation();card.className='dfc-card dfc-level-card';card.innerHTML='';
            card.appendChild(makeTitleEmblem('harvest',true));card.appendChild(make('p','dfc-card-eyebrow',text.allOpen));card.appendChild(make('h1','',text.chooseLevel));
            var grid=make('div','dfc-level-grid');
            for(var i=0;i<levels.length;i++)(function(index){
                var level=levels[index],unlocked=isLevelUnlocked(index),current=progressionEnabled&&unlocked&&index===maxUnlockedLevel-1;
                var choice=make('button','dfc-level-choice dfc-level-choice-'+(level.titleTheme||level.mechanics||'base')+(unlocked?'':' dfc-level-choice-locked')+(current?' dfc-level-choice-current':''));choice.type='button';choice.dataset.levelId=level.id;choice.dataset.unlocked=unlocked?'true':'false';choice.disabled=!unlocked;
                choice.setAttribute('aria-label',format(text.level,{current:index+1,total:levels.length})+' '+localized(level.name)+(unlocked?'':' · '+text.locked));
                choice.appendChild(make('span','dfc-level-number',format(text.level,{current:index+1,total:levels.length})));if(current)choice.appendChild(make('span','dfc-level-current',text.currentProgress));choice.appendChild(make('strong','',localized(level.name)));choice.appendChild(make('small','',unlocked?(localized(level.tagline)||localized(level.description)):text.lockedDetail));
                if(!unlocked){var lock=make('i','dfc-level-lock');lock.setAttribute('aria-hidden','true');choice.appendChild(lock);}else choice.onclick=function(){showStageTitle(index+1,true);};grid.appendChild(choice);
            })(i);
            card.appendChild(grid);var back=make('button','dfc-secondary',text.backTitle);back.type='button';back.onclick=showTitle;card.appendChild(back);overlay.classList.remove('dfc-hidden');
            var first=grid.querySelector('button');if(first)setTimeout(function(){try{first.focus({preventScroll:true});}catch(error){first.focus();}},0);return true;
        }
        function resetLevelForMenu(reference){
            applyLevel(levelIndex(reference));objects.length=0;bursts.length=0;resetSpawnState();resetRecoveryState();resetJumpState();resetCrosswindState(false);resetConfluenceState(false);resetComboState();resetCollectorMotion();player.x=50;spawnClock=.32;resultSent=false;lastResult=null;
        }
        function buildReady(){
            if(destroyed||phase==='loading')return false;clearStageTitleTimer();phase='ready';setScreen('ready');updateLevelPresentation();card.className='dfc-card dfc-ready-card';card.innerHTML='';
            card.appendChild(introTraveler);card.appendChild(make('p','dfc-card-eyebrow',text.stageReady+' · '+format(text.level,{current:currentLevelIndex+1,total:levels.length})));card.appendChild(cardTitle);card.appendChild(cardBody);card.appendChild(goal);
            var itemGuide=makeItemGuide();if(itemGuide)card.appendChild(itemGuide);
            var actions=make('div','dfc-actions');primary.textContent=text.start;primary.disabled=false;primary.onclick=startRound;actions.appendChild(primary);var back=make('button','dfc-secondary',text.backLevels);back.type='button';back.onclick=showLevelSelect;actions.appendChild(back);card.appendChild(actions);
            overlay.classList.remove('dfc-hidden');updateHud();setTimeout(function(){try{primary.focus({preventScroll:true});}catch(error){primary.focus();}},0);return true;
        }
        function showStageTitle(reference,notify){
            var requestedIndex=levelIndex(reference);if(destroyed||phase==='loading'||phase==='running'||!isLevelUnlocked(requestedIndex))return false;clearStageTitleTimer();resetLevelForMenu(requestedIndex+1);phase='stage-title';setScreen('stage-title');updateLevelPresentation();card.className='dfc-card dfc-stage-title-card dfc-stage-title-'+(currentLevel.titleTheme||currentLevel.mechanics||'base');card.innerHTML='';
            card.appendChild(makeTitleEmblem(currentLevel.titleTheme||currentLevel.mechanics||'base',false));card.appendChild(make('p','dfc-card-eyebrow',format(text.level,{current:currentLevelIndex+1,total:levels.length})));card.appendChild(make('h1','',localized(currentLevel.name)||text.title));card.appendChild(make('p','dfc-stage-tagline',localized(currentLevel.tagline)||localized(currentLevel.description)));
            var progress=make('div','dfc-stage-progress');for(var i=0;i<levels.length;i++)progress.appendChild(make('i',i===currentLevelIndex?'dfc-active':''));card.appendChild(progress);overlay.classList.remove('dfc-hidden');updateHud();
            if(notify!==false&&typeof options.onEvent==='function')options.onEvent('levelChange',{levelId:currentLevel.id,levelNumber:currentLevelIndex+1,totalLevels:levels.length,status:currentLevel.status});
            stageTitleTimer=setTimeout(function(){stageTitleTimer=0;if(!destroyed&&phase==='stage-title')buildReady();},900);return true;
        }
        function selectLevel(reference){return showStageTitle(reference,true);}
        function goToNextLevel(){
            if(currentLevelIndex+1>=levels.length)return false;
            return selectLevel(currentLevelIndex+2);
        }
        function restartCampaign(){return selectLevel(1);}
        function startRound(){
            if(phase==='loading'||destroyed)return;
            clearStageTitleTimer();
            seed=(seed+0x9e3779b9)>>>0;
            rules.reset(seed,durationMs,startingLives,targetScore);
            objects.length=0;bursts.length=0;resetSpawnState();resetRecoveryState();resetJumpState();resetComboState();resetCollectorMotion();player.x=50;spawnClock=.32;resultSent=false;lastResult=null;phase='running';setScreen('running');resetCrosswindState(!currentLevel.confluence);resetConfluenceState(true);
            overlay.classList.add('dfc-hidden');if(card.contains(document.activeElement))document.activeElement.blur();updateHud();play('confirm');
            if(typeof options.onEvent==='function')options.onEvent('start',{seed:seed,durationMs:durationMs,targetScore:targetScore,lives:startingLives,rulesMode:rules.mode(),levelId:currentLevel.id,levelNumber:currentLevelIndex+1,totalLevels:levels.length});
        }
        function finishRound(status){
            if(phase!=='running')return;
            phase='result';setScreen('result');pressed.left=false;pressed.right=false;jumpState.airborne=false;jumpState.offsetY=0;updateJumpUI();
            updateConfluenceStatus();
            var state=snapshot(),won=status===window.DanboFallingCatchRules.WON;
            var reason=won?(state.score>=targetScore?'target':'timer'):'lives';
            var unlockedNow=won&&unlockNextLevel();
            var hasNext=won&&currentLevelIndex+1<levels.length;
            var result={status:won?'won':'lost',reason:reason,score:state.score,lives:state.lives,remainingMs:state.remainingMs,durationMs:durationMs,targetScore:targetScore,rulesMode:state.mode,seed:seed,levelId:currentLevel.id,levelNumber:currentLevelIndex+1,totalLevels:levels.length,hasNextLevel:hasNext,unlockedLevel:unlockedNow?maxUnlockedLevel:null,maxUnlockedLevel:maxUnlockedLevel,bestChain:comboState.best,comboBonus:comboState.awards};
            lastResult=result;
            card.className='dfc-card dfc-result-card';card.innerHTML='';
            var resultGlyph=make('div','dfc-result-glyph '+(won?'dfc-result-win':'dfc-result-lose'),won?'✓':'!');
            var resultTitle=won&&!hasNext&&levels.length>1?text.campaignWin:(won?text.win:text.lose);
            var resultDetail=won?(hasNext?format(unlockedNow?text.unlockedDetail:text.nextDetail,{name:localized(levels[currentLevelIndex+1].name)}):((levels.length>1)?text.campaignDetail:text.winDetail)):text.loseDetail;
            card.appendChild(resultGlyph);card.appendChild(make('p','dfc-card-eyebrow',format(text.level,{current:currentLevelIndex+1,total:levels.length})));card.appendChild(make('h1','',resultTitle));card.appendChild(make('p','dfc-card-body',resultDetail));
            var summary=make('div','dfc-summary');summary.appendChild(make('strong','',state.score+' '+text.points));summary.appendChild(make('span','',text.lives+' '+state.lives+' / '+startingLives));card.appendChild(summary);
            var actions=make('div','dfc-actions');
            if(hasNext){var next=make('button','dfc-primary dfc-next',text.next);next.type='button';next.onclick=goToNextLevel;actions.appendChild(next);}
            else{var again=make('button','dfc-primary',won&&levels.length>1?text.restartCampaign:text.again);again.type='button';again.onclick=won&&levels.length>1?restartCampaign:startRound;actions.appendChild(again);}
            var retry=hasNext?make('button','dfc-secondary',text.again):null;if(retry){retry.type='button';retry.onclick=startRound;actions.appendChild(retry);}
            var levelsButton=make('button','dfc-secondary',text.backLevels);levelsButton.type='button';levelsButton.onclick=showLevelSelect;actions.appendChild(levelsButton);
            if(typeof options.onExit==='function'){var exit=make('button','dfc-secondary',text.exit);exit.type='button';exit.onclick=function(){options.onExit(result);};actions.appendChild(exit);}card.appendChild(actions);
            overlay.classList.remove('dfc-hidden');play(won?'confirm':'cancel');
            focusMenuButton(card.querySelector('button:not(:disabled)'));
            if(!resultSent&&typeof options.onResult==='function'){resultSent=true;options.onResult(result);}
        }
        function setPressed(key,value){pressed[key]=value;}
        function bindHold(button,key){
            function down(event){event.preventDefault();setPressed(key,true);try{button.setPointerCapture(event.pointerId);}catch(error){}}
            function up(event){event.preventDefault();setPressed(key,false);}
            button.addEventListener('pointerdown',down);button.addEventListener('pointerup',up);button.addEventListener('pointercancel',up);button.addEventListener('lostpointercapture',up);
            return function(){button.removeEventListener('pointerdown',down);button.removeEventListener('pointerup',up);button.removeEventListener('pointercancel',up);button.removeEventListener('lostpointercapture',up);};
        }
        function resetTouchJoystick(){
            touchInput.active=false;touchInput.x=0;touchInput.pointerId=null;touchEngaged=false;if(touchKnob)touchKnob.style.transform='translateX(0)';
        }
        function syncTouchControlMode(active){
            var mode=active?'horizontal':'hidden',externalVisible=false;
            if(externalInput&&typeof externalInput.setTouchMode==='function')externalVisible=!!externalInput.setTouchMode(mode);
            touchControlsVisible=active&&(externalInput?externalVisible:localTouchCapable);touchJoystick.hidden=!(active&&localTouchCapable);
            root.classList.toggle('dfc-touch-active',touchControlsVisible);root.classList.toggle('dfc-external-touch',active&&externalVisible);root.dataset.touchControl=externalInput?(externalVisible?'external':'external-hidden'):(localTouchCapable?(active?'local':'local-hidden'):'buttons');
            hintLabel.textContent=touchControlsVisible?text.touchMove:text.move;hintKeys.textContent=touchControlsVisible?'': 'A / D · ← / →';
            if(!active)resetTouchJoystick();updateJumpUI();
        }
        function touchMovement(){
            if(phase!=='running')return 0;var value=externalInput?externalInput.getMoveVector():touchInput;
            if(!value||value.active===false){touchEngaged=false;return 0;}
            var raw=clamp(Number(value.x)||0,-1,1),magnitude=Math.abs(raw);
            if(touchEngaged){if(magnitude<=.13){touchEngaged=false;return 0;}}else{if(magnitude<.2)return 0;touchEngaged=true;}
            if(magnitude<=.16)return 0;var normalized=clamp((magnitude-.16)/.84,0,1);return Math.sign(raw)*Math.pow(normalized,1.25);
        }
        function localJoystickPointer(event){
            if(!localTouchCapable||phase!=='running')return;
            if(event.type==='pointerdown'){
                if(touchInput.active)return;touchInput.active=true;touchInput.pointerId=event.pointerId;try{touchJoystick.setPointerCapture(event.pointerId);}catch(error){}
            }else if(!touchInput.active||event.pointerId!==touchInput.pointerId)return;
            event.preventDefault();event.stopPropagation();
            if(event.type==='pointerup'||event.type==='pointercancel'||event.type==='lostpointercapture'){resetTouchJoystick();return;}
            var rect=touchBase.getBoundingClientRect(),knobRect=touchKnob.getBoundingClientRect();if(!rect.width)return;
            var maxX=Math.max(1,(rect.width-Math.min(knobRect.width||42,rect.width*.48))/2),dx=clamp(event.clientX-(rect.left+rect.width*.5),-maxX,maxX);
            touchInput.x=dx/maxX;touchKnob.style.transform='translateX('+dx+'px)';
        }
        function activateMenuButton(selector){
            var active=document.activeElement;if(!active||!card.contains(active)||active.disabled)active=card.querySelector(selector||'button:not(:disabled)');
            if(!active)return false;active.click();return true;
        }
        function focusMenuButton(button){
            if(!button||button.disabled)return false;try{button.focus({preventScroll:true});}catch(error){button.focus();}return true;
        }
        function moveMenuFocus(direction){
            var buttons=Array.prototype.slice.call(card.querySelectorAll('button:not(:disabled)'));if(!buttons.length)return false;
            var index=buttons.indexOf(document.activeElement);if(index<0)index=0;else index=(index+(direction<0?-1:1)+buttons.length)%buttons.length;
            return focusMenuButton(buttons[index]);
        }
        function keydown(event){
            if(phase==='running'&&(event.key==='ArrowLeft'||event.key==='a'||event.key==='A')){pressed.left=true;event.preventDefault();}
            if(phase==='running'&&(event.key==='ArrowRight'||event.key==='d'||event.key==='D')){pressed.right=true;event.preventDefault();}
            if(phase==='running'&&(event.key==='ArrowUp'||event.key==='w'||event.key==='W'||event.key===' ')){event.preventDefault();triggerJump('keyboard');}
            if(phase!=='running'&&(phase==='title'||phase==='select'||phase==='ready'||phase==='result')){
                if(event.key==='ArrowLeft'||event.key==='ArrowUp'||event.key==='a'||event.key==='A'||event.key==='w'||event.key==='W'){event.preventDefault();moveMenuFocus(-1);}
                if(event.key==='ArrowRight'||event.key==='ArrowDown'||event.key==='d'||event.key==='D'||event.key==='s'||event.key==='S'){event.preventDefault();moveMenuFocus(1);}
            }
            if((event.key==='Enter'||event.key===' ')&&(phase==='title'||phase==='select'||phase==='stage-title'||phase==='ready'||phase==='result')){
                event.preventDefault();
                if(phase==='stage-title')buildReady();else activateMenuButton();
            }
            if(event.key==='Escape'){
                if(phase==='select'){event.preventDefault();showTitle();}
                else if(phase==='stage-title'||phase==='ready'||phase==='result'){event.preventDefault();showLevelSelect();}
                else if(typeof options.onExit==='function'){event.preventDefault();options.onExit({status:'exit',score:rules.score(),lives:rules.lives()});}
            }
        }
        function keyup(event){
            if(event.key==='ArrowLeft'||event.key==='a'||event.key==='A')pressed.left=false;
            if(event.key==='ArrowRight'||event.key==='d'||event.key==='D')pressed.right=false;
        }
        function jumpButtonPointer(event){
            event.preventDefault();event.stopPropagation();
            if(phase!=='running')return;
            if(!currentLevel.jumpPower){showNotice(text.jumpUnavailable,'dfc-help');return;}
            if(jumpState.charge<=0){showNotice(text.jumpNeedSprout,'dfc-help');return;}
            triggerJump('touch');
        }
        var unbindLeft=bindHold(leftButton,'left'),unbindRight=bindHold(rightButton,'right');
        touchJoystick.addEventListener('pointerdown',localJoystickPointer);touchJoystick.addEventListener('pointermove',localJoystickPointer);touchJoystick.addEventListener('pointerup',localJoystickPointer);touchJoystick.addEventListener('pointercancel',localJoystickPointer);touchJoystick.addEventListener('lostpointercapture',localJoystickPointer);
        jumpButton.addEventListener('pointerdown',jumpButtonPointer);
        window.addEventListener('keydown',keydown,{passive:false});window.addEventListener('keyup',keyup);

        rules.ready.then(function(){
            if(destroyed)return;
            phase='title';modeBadge.textContent=rules.mode()==='wasm'?text.wasm:text.fallback;modeBadge.classList.add(rules.mode()==='wasm'?'dfc-mode-wasm':'dfc-mode-js');
            if(initialScreen==='stage-title')showStageTitle(currentLevelIndex+1,false);else if(initialScreen==='select')showLevelSelect();else showTitle();updateHud();
        });
        updateHud();raf=requestAnimationFrame(frame);

        return {
            start:startRound,
            snapshot:snapshot,
            motion:collectorMotionSnapshot,
            jump:triggerJump,
            jumpState:jumpMotionSnapshot,
            progress:progressionSnapshot,
            level:function(){return currentLevel;},
            selectLevel:selectLevel,
            showTitle:showTitle,
            showLevelSelect:showLevelSelect,
            screen:function(){return phase;},
            destroy:function(){
                if(destroyed)return;destroyed=true;cancelAnimationFrame(raf);clearTimeout(showNotice.timer);clearStageTitleTimer();
                syncTouchControlMode(false);unbindLeft();unbindRight();touchJoystick.removeEventListener('pointerdown',localJoystickPointer);touchJoystick.removeEventListener('pointermove',localJoystickPointer);touchJoystick.removeEventListener('pointerup',localJoystickPointer);touchJoystick.removeEventListener('pointercancel',localJoystickPointer);touchJoystick.removeEventListener('lostpointercapture',localJoystickPointer);jumpButton.removeEventListener('pointerdown',jumpButtonPointer);window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);mount.innerHTML='';
            }
        };
    }

    window.DanboFallingCatch={create:create};
})();
