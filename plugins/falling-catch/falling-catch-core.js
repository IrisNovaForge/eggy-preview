(function(){
    'use strict';

    var COPY={
        zhs:{
            title:'风野拾集',eyebrow:'世界旅人的自然采样任务',intro:'带领世界旅人托住采集篮，接住风里落下的叶片、莓果和橡果，同时避开沉重的石块。',
            start:'开始接取',loading:'正在准备规则…',move:'左右移动',goal:'12分或坚持30秒即可过关',score:'得分',time:'时间',lives:'机会',
            ready:'准备好了',wasm:'WASM规则',fallback:'JS备用规则',caught:'接到了！',hit:'小心石块！',win:'风野收获完成！',lose:'采样任务中断',
            winDetail:'你完成了这次自然接取挑战。',loseDetail:'机会已经用完，再试一次吧。',again:'再玩一次',exit:'退出试玩',points:'分',
            level:'第 {current} / {total} 关',next:'进入下一关',nextDetail:'下一关：{name}',campaignWin:'四关框架测试完成！',campaignDetail:'四个关卡的顺序切换已经完成。',restartCampaign:'从第一关开始',framework:'框架测试'
        },
        zht:{
            title:'風野拾集',eyebrow:'世界旅人的自然採樣任務',intro:'帶領世界旅人托住採集籃，接住風裡落下的葉片、莓果和橡果，同時避開沉重的石塊。',
            start:'開始接取',loading:'正在準備規則…',move:'左右移動',goal:'12分或堅持30秒即可過關',score:'得分',time:'時間',lives:'機會',
            ready:'準備好了',wasm:'WASM規則',fallback:'JS備用規則',caught:'接到了！',hit:'小心石塊！',win:'風野收穫完成！',lose:'採樣任務中斷',
            winDetail:'你完成了這次自然接取挑戰。',loseDetail:'機會已經用完，再試一次吧。',again:'再玩一次',exit:'退出試玩',points:'分',
            level:'第 {current} / {total} 關',next:'進入下一關',nextDetail:'下一關：{name}',campaignWin:'四關框架測試完成！',campaignDetail:'四個關卡的順序切換已經完成。',restartCampaign:'從第一關開始',framework:'框架測試'
        },
        ja:{
            title:'風のフィールド',eyebrow:'世界の旅人の自然サンプリング',intro:'世界の旅人と採集かごを動かし、葉や木の実を集めながら重い石をよけよう。',
            start:'チャレンジ開始',loading:'ルールを準備中…',move:'左右に移動',goal:'12点または30秒でクリア',score:'スコア',time:'時間',lives:'チャンス',
            ready:'準備完了',wasm:'WASMルール',fallback:'JS予備ルール',caught:'キャッチ！',hit:'石に注意！',win:'収穫完了！',lose:'かごが壊れました',
            winDetail:'自然キャッチチャレンジを達成しました。',loseDetail:'チャンスを使い切りました。もう一度挑戦しよう。',again:'もう一度',exit:'終了',points:'点',
            level:'ステージ {current} / {total}',next:'次のステージへ',nextDetail:'次：{name}',campaignWin:'4ステージ切替テスト完了！',campaignDetail:'4つのステージを順番に切り替えました。',restartCampaign:'最初から',framework:'枠組みテスト'
        },
        en:{
            title:'Breezy Harvest',eyebrow:'World Traveler field sampling',intro:'Guide a World Traveler holding a woven field basket, collect leaves, berries and acorns, and stay clear of heavy stones.',
            start:'Start catching',loading:'Preparing rules…',move:'Move left and right',goal:'Reach 12 points or last 30 seconds',score:'Score',time:'Time',lives:'Chances',
            ready:'Ready',wasm:'WASM rules',fallback:'JS fallback rules',caught:'Caught!',hit:'Watch the stones!',win:'Harvest complete!',lose:'The basket broke',
            winDetail:'You completed the nature catch challenge.',loseDetail:'No chances remain. Give it another try.',again:'Play again',exit:'Exit preview',points:'pts',
            level:'Stage {current} / {total}',next:'Next stage',nextDetail:'Next: {name}',campaignWin:'Four-stage framework complete!',campaignDetail:'The four stages switched in sequence successfully.',restartCampaign:'Start from Stage 1',framework:'Framework test'
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
        var assetBase=String(options.assetBase||window.DANBO_FALLING_CATCH_BASE_URL||'plugins/falling-catch/');
        if(assetBase.charAt(assetBase.length-1)!=='/')assetBase+='/';
        var portraitValue=options.characterPortrait;
        var portraitUrl=portraitValue&&portraitValue.src?portraitValue.src:(typeof portraitValue==='string'?portraitValue:assetBase+'assets/travelers/'+traveler.file+'?v=0.2.3');
        var travelerImage=new Image();
        travelerImage.decoding='async';travelerImage.src=portraitUrl;
        var fallbackLevel={id:'breezy-harvest',number:1,status:'playable',mechanics:'base',rules:{durationMs:30000,targetScore:12,lives:3},basketOffsetY:-17.5,targetCatchBox:{halfWidth:2,topOffset:-2.8,bottomOffset:-.8,mode:'center'},name:{zhs:'风野拾集',zht:'風野拾集',ja:'風のフィールド',en:'Breezy Harvest'},description:{zhs:text.intro,zht:text.intro,ja:text.intro,en:text.intro}};
        var levels=options.levels&&options.levels.length?options.levels.slice():[fallbackLevel];
        var currentLevelIndex=0,currentLevel=levels[0];
        var durationOverride=Number(options.durationMs),targetOverride=Number(options.targetScore),livesOverride=Number(options.lives);
        var durationMs=30000,targetScore=12,startingLives=3,lastResult=null;
        var initialSeed=(Number(options.seed)>>>0)||((Date.now()^Math.floor(Math.random()*0xffffffff))>>>0);
        var seed=initialSeed;
        var destroyed=false,phase='loading',raf=0,lastFrame=0,spawnClock=0,resultSent=false;
        var objects=[],bursts=[];
        var worldHeight=62;
        var player={x:50,y:54.3,w:17,h:5.4,speed:61};
        var pressed={left:false,right:false};

        function levelIndex(reference){
            if(reference===undefined||reference===null||reference==='')return 0;
            var numeric=Number(reference);
            if(Number.isFinite(numeric)&&Math.floor(numeric)===numeric&&numeric>=1&&numeric<=levels.length)return numeric-1;
            var id=String(reference);for(var i=0;i<levels.length;i++)if(levels[i].id===id)return i;
            return 0;
        }
        function localized(value){return value&&(value[lang]||value.en||value.zhs)||'';}
        function applyLevel(index){
            currentLevelIndex=clamp(index|0,0,levels.length-1);currentLevel=levels[currentLevelIndex];
            var levelRules=currentLevel.rules||{};
            durationMs=clamp(Number.isFinite(durationOverride)&&durationOverride>0?durationOverride:(Number(levelRules.durationMs)||30000),1000,600000)|0;
            targetScore=clamp(Number.isFinite(targetOverride)&&targetOverride>0?targetOverride:(Number(levelRules.targetScore)||12),1,999)|0;
            startingLives=clamp(Number.isFinite(livesOverride)&&livesOverride>0?livesOverride:(Number(levelRules.lives)||3),1,9)|0;
        }
        applyLevel(levelIndex(options.startLevelId||options.levelId));

        mount.innerHTML='';
        var root=make('section','dfc-shell');
        root.setAttribute('aria-label',text.title);
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
        var leftButton=make('button','dfc-move dfc-left','←');leftButton.type='button';leftButton.setAttribute('aria-label',text.move+' — left');
        var hint=make('div','dfc-control-hint');hint.appendChild(make('span','',text.move));hint.appendChild(make('small','', 'A / D · ← / →'));
        var rightButton=make('button','dfc-move dfc-right','→');rightButton.type='button';rightButton.setAttribute('aria-label',text.move+' — right');
        controls.appendChild(leftButton);controls.appendChild(hint);controls.appendChild(rightButton);
        root.appendChild(top);root.appendChild(stage);root.appendChild(controls);mount.appendChild(root);

        var context=canvas.getContext('2d');
        if(!context)throw new Error('Canvas 2D is unavailable');

        function snapshot(){
            var state=rules.snapshot();
            state.levelId=currentLevel.id;state.levelNumber=currentLevel.number||currentLevelIndex+1;state.totalLevels=levels.length;
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
            var idle=phase==='loading'||phase==='ready';
            var shownScore=idle?0:state.score,shownRemaining=idle?durationMs:state.remainingMs,shownLives=idle?startingLives:state.lives;
            scoreValue.textContent=String(shownScore);
            timeValue.textContent=(Math.max(0,shownRemaining)/1000).toFixed(1);
            var lifeText=[];for(var i=0;i<startingLives;i++)lifeText.push(i<shownLives?'●':'○');
            livesValue.textContent=lifeText.join(' ');
            livesBox.classList.toggle('dfc-danger',shownLives===1);
        }
        function showNotice(message,tone){
            notice.textContent=message;
            notice.className='dfc-notice dfc-show '+(tone||'');
            clearTimeout(showNotice.timer);
            showNotice.timer=setTimeout(function(){notice.className='dfc-notice';},650);
        }
        function play(name){try{if(typeof options.play==='function')options.play(name);}catch(error){}}
        function random(){return rules.random();}
        function nextSpawnDelay(){return 0.48+random()*0.42;}
        function spawnObject(){
            var obstacle=random()<0.28;
            var kind=obstacle?'stone':['leaf','berry','acorn'][Math.floor(random()*3)];
            objects.push({
                type:obstacle?'obstacle':'target',kind:kind,x:7+random()*86,y:-6-random()*4,
                radius:kind==='stone'?3.2:2.8,vy:22+random()*10,drift:(random()-.5)*8,
                turn:(random()-.5)*3.5,rotation:random()*Math.PI*2
            });
        }
        function circleRectHit(item){
            var left=player.x-player.w/2,right=player.x+player.w/2,top=player.y-player.h/2,bottom=player.y+player.h/2;
            var nearX=clamp(item.x,left,right),nearY=clamp(item.y,top,bottom);
            var dx=item.x-nearX,dy=item.y-nearY;
            return dx*dx+dy*dy<=item.radius*item.radius;
        }
        function targetHit(item){
            var box=currentLevel.targetCatchBox;
            if(!box)return circleRectHit(item);
            return item.x>=player.x-box.halfWidth&&item.x<=player.x+box.halfWidth&&item.y>=player.y+box.topOffset&&item.y<=player.y+box.bottomOffset;
        }
        function addBurst(item,label,color){
            bursts.push({x:item.x,y:item.y,label:label,color:color,life:1});
        }
        function handleObject(item){
            if(item.type==='target'){
                rules.collect(1);addBurst(item,'+1','#fff4b0');showNotice(text.caught,'dfc-good');play('confirm');
            }else{
                rules.hit();addBurst(item,'−1','#ffd4cd');showNotice(text.hit,'dfc-bad');root.classList.remove('dfc-shake');void root.offsetWidth;root.classList.add('dfc-shake');play('cancel');
            }
            updateHud();
            if(rules.status()!==window.DanboFallingCatchRules.RUNNING)finishRound(rules.status());
        }
        function update(dt){
            if(pressed.left&&!pressed.right)player.x-=player.speed*dt;
            if(pressed.right&&!pressed.left)player.x+=player.speed*dt;
            player.x=clamp(player.x,player.w/2+1,100-player.w/2-1);
            spawnClock-=dt;
            if(spawnClock<=0){spawnObject();spawnClock=nextSpawnDelay();}
            for(var i=objects.length-1;i>=0;i--){
                var item=objects[i];item.y+=item.vy*dt*(worldHeight/62);item.x+=item.drift*dt;item.rotation+=item.turn*dt;
                if(item.x<item.radius||item.x>100-item.radius)item.drift*=-1;
                if(item.type==='target'?targetHit(item):circleRectHit(item)){objects.splice(i,1);handleObject(item);if(phase!=='running')break;continue;}
                if(item.y>worldHeight+6)objects.splice(i,1);
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
        function drawLeaf(item){
            context.save();context.translate(item.x,item.y);context.rotate(item.rotation);context.fillStyle='#f1c96b';context.beginPath();context.moveTo(-3,0);context.quadraticCurveTo(0,-3.4,3,0);context.quadraticCurveTo(0,3.4,-3,0);context.fill();context.strokeStyle='#8d7f43';context.lineWidth=.35;context.beginPath();context.moveTo(-2.2,0);context.lineTo(2.5,0);context.stroke();context.restore();
        }
        function drawBerry(item){
            context.save();context.translate(item.x,item.y);context.rotate(item.rotation);context.fillStyle='#a94d68';context.beginPath();context.arc(-1.2,.4,1.55,0,Math.PI*2);context.arc(1.2,.4,1.55,0,Math.PI*2);context.arc(0,1.6,1.55,0,Math.PI*2);context.fill();context.fillStyle='#4f875e';context.beginPath();context.moveTo(0,-1);context.lineTo(-1.2,-2.6);context.lineTo(.2,-2);context.lineTo(1.5,-2.7);context.lineTo(1,-.8);context.closePath();context.fill();context.restore();
        }
        function drawAcorn(item){
            context.save();context.translate(item.x,item.y);context.rotate(item.rotation);context.fillStyle='#b97845';context.beginPath();context.ellipse(0,.5,2.2,2.8,0,0,Math.PI*2);context.fill();context.fillStyle='#6c7045';context.beginPath();context.arc(0,-1.3,2.25,Math.PI,Math.PI*2);context.lineTo(2,-.7);context.lineTo(-2,-.7);context.closePath();context.fill();context.strokeStyle='#6c7045';context.lineWidth=.45;context.beginPath();context.moveTo(0,-2.5);context.quadraticCurveTo(.2,-3.5,1,-3.7);context.stroke();context.restore();
        }
        function drawStone(item){
            context.save();context.translate(item.x,item.y);context.rotate(item.rotation);context.fillStyle='#657270';context.beginPath();context.moveTo(-3.2,1.7);context.lineTo(-2.5,-1.8);context.lineTo(-.5,-3);context.lineTo(2.7,-1.8);context.lineTo(3.2,1.5);context.lineTo(1,3);context.lineTo(-1.8,2.7);context.closePath();context.fill();context.fillStyle='#87918d';context.beginPath();context.moveTo(-1.8,-1.4);context.lineTo(-.4,-2.4);context.lineTo(1.5,-1.7);context.lineTo(.4,-.8);context.closePath();context.fill();context.restore();
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
        function drawTravelerCollector(){
            var bob=phase==='running'?Math.sin(performance.now()/190)*.16:Math.sin(performance.now()/420)*.08;
            var basketOffsetY=Number(currentLevel.basketOffsetY)||0;
            context.save();context.translate(player.x,player.y);
            context.translate(0,4.4);context.scale(.3,.3);context.translate(0,-4.4);
            context.fillStyle='rgba(41,79,64,.2)';context.beginPath();context.ellipse(0,4.4,8.4,1.45,0,0,Math.PI*2);context.fill();
            context.fillStyle=canvasColor(traveler.accent,'#8fd16a');context.globalAlpha=.16;context.beginPath();context.ellipse(0,-4.7,8.8,8.1,0,0,Math.PI*2);context.fill();context.globalAlpha=1;
            if(travelerImage.complete&&travelerImage.naturalWidth){
                var sourceHeight=Math.max(1,Math.floor(travelerImage.naturalHeight*.85));
                context.drawImage(travelerImage,0,0,travelerImage.naturalWidth,sourceHeight,-7.4,-15.3+bob,14.8,15.2);
            }else drawFallbackTraveler(bob);
            context.strokeStyle='#76552f';context.lineWidth=.8;context.beginPath();
            if(basketOffsetY){context.moveTo(-3.4,-11.2+bob);context.lineTo(-5.4,basketOffsetY+2.2);context.moveTo(3.4,-11.2+bob);context.lineTo(5.4,basketOffsetY+2.2);}
            else{context.moveTo(-4.7,-3.5+bob);context.lineTo(-5.4,-1);context.moveTo(4.7,-3.5+bob);context.lineTo(5.4,-1);}
            context.stroke();context.save();context.translate(0,basketOffsetY);
            context.strokeStyle='#7b5b34';context.lineWidth=1;context.beginPath();context.arc(0,-1.1,5.7,Math.PI,Math.PI*2);context.stroke();
            context.fillStyle='#c49355';context.beginPath();context.moveTo(-6.7,-1);context.lineTo(6.7,-1);context.lineTo(5.4,3.6);context.quadraticCurveTo(0,4.7,-5.4,3.6);context.closePath();context.fill();
            context.strokeStyle='#8a6338';context.lineWidth=.4;for(var i=-4.5;i<=4.5;i+=2.25){context.beginPath();context.moveTo(i,-.7);context.lineTo(i*.78,3.7);context.stroke();}for(var y=.25;y<3.6;y+=1.05){context.beginPath();context.moveTo(-6.2+y*.24,y);context.lineTo(6.2-y*.24,y);context.stroke();}
            context.fillStyle='#ead58f';context.beginPath();context.ellipse(0,-1,6.9,1.08,0,0,Math.PI*2);context.fill();context.strokeStyle='#795631';context.lineWidth=.5;context.stroke();context.restore();context.restore();
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
            for(var i=0;i<objects.length;i++){
                var item=objects[i];if(item.kind==='leaf')drawLeaf(item);else if(item.kind==='berry')drawBerry(item);else if(item.kind==='acorn')drawAcorn(item);else drawStone(item);
            }
            drawTravelerCollector();
            context.textAlign='center';context.textBaseline='middle';context.font='700 2.4px system-ui, sans-serif';
            for(var b=0;b<bursts.length;b++){var burst=bursts[b];context.globalAlpha=clamp(burst.life,0,1);context.fillStyle=burst.color;context.fillText(burst.label,burst.x,burst.y);context.globalAlpha=1;}
        }
        function frame(now){
            if(destroyed)return;
            var dt=lastFrame?Math.min(.05,(now-lastFrame)/1000):0;lastFrame=now;
            if(document.hidden)dt=0;
            if(phase==='running')update(dt);
            draw();raf=requestAnimationFrame(frame);
        }

        function buildIntro(){
            card.innerHTML='';
            updateLevelPresentation();
            card.appendChild(introTraveler);card.appendChild(cardEyebrow);card.appendChild(cardTitle);card.appendChild(cardBody);card.appendChild(goal);card.appendChild(primary);
            primary.textContent=text.start;primary.disabled=phase==='loading';
            primary.onclick=startRound;
            overlay.classList.remove('dfc-hidden');
        }
        function selectLevel(reference){
            if(destroyed||phase==='running')return false;
            applyLevel(levelIndex(reference));objects.length=0;bursts.length=0;player.x=50;spawnClock=.32;resultSent=false;lastResult=null;
            phase=phase==='loading'?'loading':'ready';buildIntro();updateHud();
            if(typeof options.onEvent==='function')options.onEvent('levelChange',{levelId:currentLevel.id,levelNumber:currentLevelIndex+1,totalLevels:levels.length,status:currentLevel.status});
            return true;
        }
        function goToNextLevel(){
            if(currentLevelIndex+1>=levels.length)return false;
            return selectLevel(currentLevelIndex+2);
        }
        function restartCampaign(){return selectLevel(1);}
        function startRound(){
            if(phase==='loading'||destroyed)return;
            seed=(seed+0x9e3779b9)>>>0;
            rules.reset(seed,durationMs,startingLives,targetScore);
            objects.length=0;bursts.length=0;player.x=50;spawnClock=.32;resultSent=false;lastResult=null;phase='running';
            overlay.classList.add('dfc-hidden');updateHud();play('confirm');
            if(typeof options.onEvent==='function')options.onEvent('start',{seed:seed,durationMs:durationMs,targetScore:targetScore,lives:startingLives,rulesMode:rules.mode(),levelId:currentLevel.id,levelNumber:currentLevelIndex+1,totalLevels:levels.length});
        }
        function finishRound(status){
            if(phase!=='running')return;
            phase='result';pressed.left=false;pressed.right=false;
            var state=snapshot(),won=status===window.DanboFallingCatchRules.WON;
            var reason=won?(state.score>=targetScore?'target':'timer'):'lives';
            var hasNext=won&&currentLevelIndex+1<levels.length;
            var result={status:won?'won':'lost',reason:reason,score:state.score,lives:state.lives,remainingMs:state.remainingMs,durationMs:durationMs,targetScore:targetScore,rulesMode:state.mode,seed:seed,levelId:currentLevel.id,levelNumber:currentLevelIndex+1,totalLevels:levels.length,hasNextLevel:hasNext};
            lastResult=result;
            card.innerHTML='';
            var resultGlyph=make('div','dfc-result-glyph '+(won?'dfc-result-win':'dfc-result-lose'),won?'✓':'!');
            var resultTitle=won&&!hasNext&&levels.length>1?text.campaignWin:(won?text.win:text.lose);
            var resultDetail=won?(hasNext?format(text.nextDetail,{name:localized(levels[currentLevelIndex+1].name)}):((levels.length>1)?text.campaignDetail:text.winDetail)):text.loseDetail;
            card.appendChild(resultGlyph);card.appendChild(make('p','dfc-card-eyebrow',format(text.level,{current:currentLevelIndex+1,total:levels.length})));card.appendChild(make('h1','',resultTitle));card.appendChild(make('p','dfc-card-body',resultDetail));
            var summary=make('div','dfc-summary');summary.appendChild(make('strong','',state.score+' '+text.points));summary.appendChild(make('span','',text.lives+' '+state.lives+' / '+startingLives));card.appendChild(summary);
            var actions=make('div','dfc-actions');
            if(hasNext){var next=make('button','dfc-primary dfc-next',text.next);next.type='button';next.onclick=goToNextLevel;actions.appendChild(next);}
            else{var again=make('button','dfc-primary',won&&levels.length>1?text.restartCampaign:text.again);again.type='button';again.onclick=won&&levels.length>1?restartCampaign:startRound;actions.appendChild(again);}
            var retry=hasNext?make('button','dfc-secondary',text.again):null;if(retry){retry.type='button';retry.onclick=startRound;actions.appendChild(retry);}
            var exit=make('button','dfc-secondary',text.exit);exit.type='button';exit.onclick=function(){if(typeof options.onExit==='function')options.onExit(result);else{phase='ready';buildIntro();}};actions.appendChild(exit);card.appendChild(actions);
            overlay.classList.remove('dfc-hidden');play(won?'confirm':'cancel');
            if(!resultSent&&typeof options.onResult==='function'){resultSent=true;options.onResult(result);}
        }
        function setPressed(key,value){pressed[key]=value;}
        function bindHold(button,key){
            function down(event){event.preventDefault();setPressed(key,true);try{button.setPointerCapture(event.pointerId);}catch(error){}}
            function up(event){event.preventDefault();setPressed(key,false);}
            button.addEventListener('pointerdown',down);button.addEventListener('pointerup',up);button.addEventListener('pointercancel',up);button.addEventListener('lostpointercapture',up);
            return function(){button.removeEventListener('pointerdown',down);button.removeEventListener('pointerup',up);button.removeEventListener('pointercancel',up);button.removeEventListener('lostpointercapture',up);};
        }
        function keydown(event){
            if(event.key==='ArrowLeft'||event.key==='a'||event.key==='A'){pressed.left=true;event.preventDefault();}
            if(event.key==='ArrowRight'||event.key==='d'||event.key==='D'){pressed.right=true;event.preventDefault();}
            if((event.key==='Enter'||event.key===' ')&&(phase==='ready'||phase==='result')){
                event.preventDefault();
                if(phase==='result'&&lastResult&&lastResult.hasNextLevel)goToNextLevel();
                else if(phase==='result'&&lastResult&&lastResult.status==='won'&&levels.length>1)restartCampaign();
                else startRound();
            }
            if(event.key==='Escape'&&typeof options.onExit==='function'){event.preventDefault();options.onExit({status:'exit',score:rules.score(),lives:rules.lives()});}
        }
        function keyup(event){
            if(event.key==='ArrowLeft'||event.key==='a'||event.key==='A')pressed.left=false;
            if(event.key==='ArrowRight'||event.key==='d'||event.key==='D')pressed.right=false;
        }
        var unbindLeft=bindHold(leftButton,'left'),unbindRight=bindHold(rightButton,'right');
        window.addEventListener('keydown',keydown,{passive:false});window.addEventListener('keyup',keyup);

        rules.ready.then(function(){
            if(destroyed)return;
            phase='ready';modeBadge.textContent=rules.mode()==='wasm'?text.wasm:text.fallback;modeBadge.classList.add(rules.mode()==='wasm'?'dfc-mode-wasm':'dfc-mode-js');
            buildIntro();updateHud();
        });
        updateHud();raf=requestAnimationFrame(frame);

        return {
            start:startRound,
            snapshot:snapshot,
            level:function(){return currentLevel;},
            selectLevel:selectLevel,
            destroy:function(){
                if(destroyed)return;destroyed=true;cancelAnimationFrame(raf);clearTimeout(showNotice.timer);
                unbindLeft();unbindRight();window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);mount.innerHTML='';
            }
        };
    }

    window.DanboFallingCatch={create:create};
})();
