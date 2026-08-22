(function(){
    'use strict';

    var COPY={
        zhs:{
            title:'风野拾集',eyebrow:'30秒自然接取挑战',intro:'移动叶编篮，接住从风里落下的叶片、莓果和橡果，同时避开沉重的石块。',
            start:'开始接取',loading:'正在准备规则…',move:'左右移动',goal:'12分或坚持30秒即可过关',score:'得分',time:'时间',lives:'机会',
            ready:'准备好了',wasm:'WASM规则',fallback:'JS备用规则',caught:'接到了！',hit:'小心石块！',win:'风野收获完成！',lose:'篮子被砸坏了',
            winDetail:'你完成了这次自然接取挑战。',loseDetail:'机会已经用完，再试一次吧。',again:'再玩一次',exit:'退出试玩',points:'分'
        },
        zht:{
            title:'風野拾集',eyebrow:'30秒自然接取挑戰',intro:'移動葉編籃，接住從風裡落下的葉片、莓果和橡果，同時避開沉重的石塊。',
            start:'開始接取',loading:'正在準備規則…',move:'左右移動',goal:'12分或堅持30秒即可過關',score:'得分',time:'時間',lives:'機會',
            ready:'準備好了',wasm:'WASM規則',fallback:'JS備用規則',caught:'接到了！',hit:'小心石塊！',win:'風野收穫完成！',lose:'籃子被砸壞了',
            winDetail:'你完成了這次自然接取挑戰。',loseDetail:'機會已經用完，再試一次吧。',again:'再玩一次',exit:'退出試玩',points:'分'
        },
        ja:{
            title:'風のフィールド',eyebrow:'30秒の自然キャッチチャレンジ',intro:'葉編みのかごを動かし、葉や木の実を集めながら重い石をよけよう。',
            start:'チャレンジ開始',loading:'ルールを準備中…',move:'左右に移動',goal:'12点または30秒でクリア',score:'スコア',time:'時間',lives:'チャンス',
            ready:'準備完了',wasm:'WASMルール',fallback:'JS予備ルール',caught:'キャッチ！',hit:'石に注意！',win:'収穫完了！',lose:'かごが壊れました',
            winDetail:'自然キャッチチャレンジを達成しました。',loseDetail:'チャンスを使い切りました。もう一度挑戦しよう。',again:'もう一度',exit:'終了',points:'点'
        },
        en:{
            title:'Breezy Harvest',eyebrow:'30-second nature catch',intro:'Guide a woven leaf basket, collect leaves, berries and acorns, and stay clear of heavy stones.',
            start:'Start catching',loading:'Preparing rules…',move:'Move left and right',goal:'Reach 12 points or last 30 seconds',score:'Score',time:'Time',lives:'Chances',
            ready:'Ready',wasm:'WASM rules',fallback:'JS fallback rules',caught:'Caught!',hit:'Watch the stones!',win:'Harvest complete!',lose:'The basket broke',
            winDetail:'You completed the nature catch challenge.',loseDetail:'No chances remain. Give it another try.',again:'Play again',exit:'Exit preview',points:'pts'
        }
    };

    function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
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

    function create(options){
        options=options||{};
        if(!options.mount)throw new Error('falling-catch requires a mount element');
        if(!options.rules)throw new Error('falling-catch requires a rules engine');

        var mount=options.mount;
        var rules=options.rules;
        var lang=localeKey(options.lang||document.documentElement.lang||navigator.language);
        var text=COPY[lang]||COPY.en;
        var durationMs=clamp(Number(options.durationMs)||30000,1000,600000)|0;
        var targetScore=clamp(Number(options.targetScore)||12,1,999)|0;
        var startingLives=clamp(Number(options.lives)||3,1,9)|0;
        var initialSeed=(Number(options.seed)>>>0)||((Date.now()^Math.floor(Math.random()*0xffffffff))>>>0);
        var seed=initialSeed;
        var destroyed=false,phase='loading',raf=0,lastFrame=0,spawnClock=0,resultSent=false;
        var objects=[],bursts=[];
        var worldHeight=62;
        var player={x:50,y:54.3,w:17,h:5.4,speed:61};
        var pressed={left:false,right:false};

        mount.innerHTML='';
        var root=make('section','dfc-shell');
        root.setAttribute('aria-label',text.title);
        var top=make('header','dfc-topbar');
        var brand=make('div','dfc-brand');
        brand.appendChild(make('span','dfc-brand-mark','⌁'));
        var brandCopy=make('div','dfc-brand-copy');
        brandCopy.appendChild(make('strong','',text.title));
        brandCopy.appendChild(make('small','',text.eyebrow));
        brand.appendChild(brandCopy);
        var modeBadge=make('span','dfc-mode',text.loading);
        top.appendChild(brand);top.appendChild(modeBadge);

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
        var introGlyph=make('div','dfc-intro-glyph');introGlyph.innerHTML='<i></i><i></i><i></i>';
        var cardEyebrow=make('p','dfc-card-eyebrow',text.eyebrow);
        var cardTitle=make('h1','',text.title);
        var cardBody=make('p','dfc-card-body',text.intro);
        var goal=make('p','dfc-goal',text.goal);
        var primary=make('button','dfc-primary',text.loading);primary.type='button';primary.disabled=true;
        card.appendChild(introGlyph);card.appendChild(cardEyebrow);card.appendChild(cardTitle);card.appendChild(cardBody);card.appendChild(goal);card.appendChild(primary);

        var controls=make('div','dfc-controls');
        var leftButton=make('button','dfc-move dfc-left','←');leftButton.type='button';leftButton.setAttribute('aria-label',text.move+' — left');
        var hint=make('div','dfc-control-hint');hint.appendChild(make('span','',text.move));hint.appendChild(make('small','', 'A / D · ← / →'));
        var rightButton=make('button','dfc-move dfc-right','→');rightButton.type='button';rightButton.setAttribute('aria-label',text.move+' — right');
        controls.appendChild(leftButton);controls.appendChild(hint);controls.appendChild(rightButton);
        root.appendChild(top);root.appendChild(stage);root.appendChild(controls);mount.appendChild(root);

        var context=canvas.getContext('2d');
        if(!context)throw new Error('Canvas 2D is unavailable');

        function snapshot(){return rules.snapshot();}
        function updateHud(){
            var state=snapshot();
            scoreValue.textContent=String(state.score);
            timeValue.textContent=(Math.max(0,state.remainingMs)/1000).toFixed(1);
            var lifeText=[];for(var i=0;i<startingLives;i++)lifeText.push(i<state.lives?'●':'○');
            livesValue.textContent=lifeText.join(' ');
            livesBox.classList.toggle('dfc-danger',state.lives===1);
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
                if(circleRectHit(item)){objects.splice(i,1);handleObject(item);if(phase!=='running')break;continue;}
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
        function drawBasket(){
            context.save();context.translate(player.x,player.y);context.fillStyle='rgba(41,79,64,.18)';context.beginPath();context.ellipse(0,4.1,10,1.8,0,0,Math.PI*2);context.fill();
            context.strokeStyle='#7b5b34';context.lineWidth=1.2;context.beginPath();context.arc(0,-1,7,Math.PI,Math.PI*2);context.stroke();
            context.fillStyle='#c49355';context.beginPath();context.moveTo(-8,-1);context.lineTo(8,-1);context.lineTo(6.2,4);context.quadraticCurveTo(0,5.4,-6.2,4);context.closePath();context.fill();
            context.strokeStyle='#8a6338';context.lineWidth=.45;for(var i=-5;i<=5;i+=2.5){context.beginPath();context.moveTo(i,-.7);context.lineTo(i*.78,4.1);context.stroke();}for(var y=.4;y<4;y+=1.2){context.beginPath();context.moveTo(-7.5+y*.25,y);context.lineTo(7.5-y*.25,y);context.stroke();}
            context.fillStyle='#e6d18c';context.beginPath();context.ellipse(0,-1,8.2,1.35,0,0,Math.PI*2);context.fill();context.strokeStyle='#795631';context.lineWidth=.55;context.stroke();context.restore();
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
            drawBasket();
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
            card.appendChild(introGlyph);card.appendChild(cardEyebrow);card.appendChild(cardTitle);card.appendChild(cardBody);card.appendChild(goal);card.appendChild(primary);
            primary.textContent=text.start;primary.disabled=phase==='loading';
            primary.onclick=startRound;
            overlay.classList.remove('dfc-hidden');
        }
        function startRound(){
            if(phase==='loading'||destroyed)return;
            seed=(seed+0x9e3779b9)>>>0;
            rules.reset(seed,durationMs,startingLives,targetScore);
            objects.length=0;bursts.length=0;player.x=50;spawnClock=.32;resultSent=false;phase='running';
            overlay.classList.add('dfc-hidden');updateHud();play('confirm');
            if(typeof options.onEvent==='function')options.onEvent('start',{seed:seed,durationMs:durationMs,targetScore:targetScore,lives:startingLives,rulesMode:rules.mode()});
        }
        function finishRound(status){
            if(phase!=='running')return;
            phase='result';pressed.left=false;pressed.right=false;
            var state=snapshot(),won=status===window.DanboFallingCatchRules.WON;
            var reason=won?(state.score>=targetScore?'target':'timer'):'lives';
            var result={status:won?'won':'lost',reason:reason,score:state.score,lives:state.lives,remainingMs:state.remainingMs,durationMs:durationMs,targetScore:targetScore,rulesMode:state.mode,seed:seed};
            card.innerHTML='';
            var resultGlyph=make('div','dfc-result-glyph '+(won?'dfc-result-win':'dfc-result-lose'),won?'✓':'!');
            card.appendChild(resultGlyph);card.appendChild(make('p','dfc-card-eyebrow',won?text.ready:text.hit));card.appendChild(make('h1','',won?text.win:text.lose));card.appendChild(make('p','dfc-card-body',won?text.winDetail:text.loseDetail));
            var summary=make('div','dfc-summary');summary.appendChild(make('strong','',state.score+' '+text.points));summary.appendChild(make('span','',text.lives+' '+state.lives+' / '+startingLives));card.appendChild(summary);
            var actions=make('div','dfc-actions');var again=make('button','dfc-primary',text.again);again.type='button';again.onclick=startRound;var exit=make('button','dfc-secondary',text.exit);exit.type='button';exit.onclick=function(){if(typeof options.onExit==='function')options.onExit(result);else{phase='ready';buildIntro();}};actions.appendChild(again);actions.appendChild(exit);card.appendChild(actions);
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
            if((event.key==='Enter'||event.key===' ')&&(phase==='ready'||phase==='result')){event.preventDefault();startRound();}
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
            destroy:function(){
                if(destroyed)return;destroyed=true;cancelAnimationFrame(raf);clearTimeout(showNotice.timer);
                unbindLeft();unbindRight();window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);mount.innerHTML='';
            }
        };
    }

    window.DanboFallingCatch={create:create};
})();
