(function(global){
    'use strict';

    var WORDS={
        shape:{orb:'露珠形',sprout:'叶芽形',fluff:'云绒形'},
        tone:{blue:'晴空蓝',gold:'暖阳黄',pink:'晚霞粉'},
        mark:{dot:'圆点印',line:'短线印',star:'星光印'}
    };

    function create(options){
        options=options||{};
        var mount=options.mount;
        if(!mount)throw new Error('dreamlight inspection requires a mount element');
        var rules=options.rules||global.DanboCloudBasketRules.create();
        var destroyed=false,raf=0,startedAt=0,lastFrame=0,state=null,round=null,roundIndex=0,focusedChoice=0,locked=false,audioContext=null,resultReported=false;
        var seed=Number(options.seed)||((Date.now()^Math.floor(Math.random()*0xffffffff))>>>0);

        mount.innerHTML=''+
          '<div class="cloud-basket-root" data-mode="intro">'+
            '<div class="dreamlight-sky"><i></i><i></i><i></i></div>'+
            '<header class="dreamlight-hud"><div class="dreamlight-pill">正确<strong data-correct>0</strong></div><div class="dreamlight-pill dreamlight-time">剩余<strong data-time>45</strong></div><div class="dreamlight-pill">准确率<strong data-accuracy>100%</strong></div></header>'+
            '<main class="dreamlight-board">'+
              '<p class="dreamlight-instruction">找出和目标完全相同的梦光素材</p>'+
              '<section class="dreamlight-target-card"><span class="dreamlight-card-label">本题目标</span><div class="dreamlight-target" data-target></div><p data-target-words></p></section>'+
              '<div class="dreamlight-divider"><span>点击候选，或用方向键选择后按 Enter</span></div>'+
              '<section class="dreamlight-candidates" data-candidates></section>'+
              '<div class="dreamlight-feedback" data-feedback aria-live="polite"></div>'+
            '</main>'+
            '<div class="dreamlight-inspector" aria-hidden="true"><div class="dreamlight-lens"></div><div class="dreamlight-egg"><i></i><i></i><b></b></div></div>'+
            '<div class="cloud-basket-overlay" data-intro><section class="cloud-basket-card"><div class="dreamlight-title-mark"><span>✦</span></div><h1>梦光验货</h1><p class="cloud-basket-subtitle">观察目标的颜色、外形和印记，点击三个候选中完全相同的一个。</p><div class="cloud-basket-how"><span class="cloud-basket-tag">点击或按 1 / 2 / 3</span><span class="cloud-basket-tag">↑ ↓ ← → ＋ Enter</span><span class="cloud-basket-tag">45秒</span></div><button class="cloud-basket-primary" data-start>开始验货</button></section></div>'+
            '<div class="cloud-basket-overlay" data-result hidden><section class="cloud-basket-card"><div class="dreamlight-title-mark"><span>✓</span></div><h1>验货完成</h1><div class="dreamlight-result-grid"><div><strong data-result-correct>0</strong><span>正确</span></div><div><strong data-result-wrong>0</strong><span>错误</span></div><div><strong data-result-accuracy>100%</strong><span>准确率</span></div></div><button class="cloud-basket-primary" data-restart>再验一次</button><button class="cloud-basket-secondary" data-exit>退出试玩</button></section></div>'+
          '</div>';

        var root=mount.querySelector('.cloud-basket-root');
        var intro=mount.querySelector('[data-intro]');
        var result=mount.querySelector('[data-result]');
        var correctNode=mount.querySelector('[data-correct]');
        var timeNode=mount.querySelector('[data-time]');
        var accuracyNode=mount.querySelector('[data-accuracy]');
        var targetNode=mount.querySelector('[data-target]');
        var targetWordsNode=mount.querySelector('[data-target-words]');
        var candidatesNode=mount.querySelector('[data-candidates]');
        var feedbackNode=mount.querySelector('[data-feedback]');

        function tone(frequency,duration,delay,type){
            try{
                audioContext=audioContext||new (global.AudioContext||global.webkitAudioContext)();
                var start=audioContext.currentTime+(delay||0),osc=audioContext.createOscillator(),gain=audioContext.createGain();
                osc.type=type||'sine';osc.frequency.setValueAtTime(frequency,start);gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(.07,start+.012);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
                osc.connect(gain);gain.connect(audioContext.destination);osc.start(start);osc.stop(start+duration+.02);
            }catch(error){}
        }

        function itemMarkup(item){
            return '<div class="dreamlight-material shape-'+item.shape+' tone-'+item.tone+'"><span class="mark-'+item.mark+'">'+(item.mark==='star'?'✦':'')+'</span></div>';
        }

        function wordsFor(item){return WORDS.tone[item.tone]+' · '+WORDS.shape[item.shape]+' · '+WORDS.mark[item.mark];}

        function updateHud(){
            correctNode.textContent=String(state?state.correct:0);
            accuracyNode.textContent=String(global.DanboCloudBasketRules.accuracy(state))+'%';
            root.dataset.answered=String(state?state.answered:0);
        }

        function renderFocus(){
            var buttons=candidatesNode.querySelectorAll('[data-choice]');
            for(var index=0;index<buttons.length;index++){
                var selected=index===focusedChoice;buttons[index].classList.toggle('is-focused',selected);buttons[index].setAttribute('aria-current',selected?'true':'false');
            }
            root.dataset.focusedChoice=String(focusedChoice+1);
        }

        function focusChoice(index){
            if(!state||state.status!=='playing'||locked)return;
            focusedChoice=(Number(index)+rules.candidateCount)%rules.candidateCount;renderFocus();tone(310,.045,0);
        }

        function renderRound(){
            round=global.DanboCloudBasketRules.createRound(rules,seed,roundIndex++);locked=false;focusedChoice=0;
            targetNode.innerHTML=itemMarkup(round.target);targetWordsNode.textContent=wordsFor(round.target);
            candidatesNode.innerHTML=round.candidates.map(function(item,index){return '<button class="dreamlight-choice" data-choice="'+index+'" aria-label="候选 '+(index+1)+'：'+wordsFor(item)+'"><span class="dreamlight-choice-key">'+(index+1)+'</span>'+itemMarkup(item)+'</button>';}).join('');
            feedbackNode.textContent='';feedbackNode.className='dreamlight-feedback';root.dataset.roundReady='true';renderFocus();
        }

        function answer(index){
            if(!state||state.status!=='playing'||locked)return;
            index=Number(index);if(index<0||index>=round.candidates.length)return;locked=true;
            focusedChoice=index;renderFocus();
            var correct=global.DanboCloudBasketRules.isCorrect(round,index),buttons=candidatesNode.querySelectorAll('[data-choice]');
            buttons[index].classList.add('is-pressed');setTimeout(function(){if(buttons[index])buttons[index].classList.remove('is-pressed');},130);
            global.DanboCloudBasketRules.answer(state,correct);updateHud();
            buttons[round.correctIndex].classList.add('is-correct');
            if(correct){feedbackNode.textContent='验货正确';feedbackNode.classList.add('is-correct');tone(523,.18,0);tone(659,.22,.08);}
            else{buttons[index].classList.add('is-wrong');feedbackNode.textContent='再仔细观察下一件';feedbackNode.classList.add('is-wrong');tone(220,.2,0,'triangle');}
            setTimeout(function(){if(!destroyed&&state&&state.status==='playing')renderRound();},360);
        }

        function start(){
            state=global.DanboCloudBasketRules.createState(rules);roundIndex=0;startedAt=performance.now();lastFrame=startedAt;resultReported=false;
            intro.hidden=true;result.hidden=true;root.dataset.mode='playing';timeNode.textContent=String(rules.durationSeconds);updateHud();renderRound();
            root.tabIndex=0;try{root.focus({preventScroll:true});}catch(error){root.focus();}
            if(audioContext&&audioContext.state==='suspended')audioContext.resume();
        }

        function finish(){
            if(!state||state.status==='result')return;
            state.status='result';root.dataset.mode='result';
            result.querySelector('[data-result-correct]').textContent=String(state.correct);
            result.querySelector('[data-result-wrong]').textContent=String(state.wrong);
            result.querySelector('[data-result-accuracy]').textContent=String(global.DanboCloudBasketRules.accuracy(state))+'%';
            result.hidden=false;
            if(!resultReported&&typeof options.onResult==='function'){
                resultReported=true;options.onResult({status:'complete',correct:state.correct,wrong:state.wrong,answered:state.answered,accuracy:global.DanboCloudBasketRules.accuracy(state),durationSeconds:rules.durationSeconds});
            }
        }

        function frame(now){
            if(destroyed)return;
            if(state&&state.status==='playing'){
                var remaining=Math.min(rules.durationSeconds,Math.max(0,rules.durationSeconds-(now-startedAt)/1000));
                global.DanboCloudBasketRules.updateTime(state,remaining);timeNode.textContent=String(Math.ceil(remaining));
                if(state.status==='complete')finish();
            }
            lastFrame=now;raf=requestAnimationFrame(frame);
        }

        function onCandidate(event){
            var button=event.target.closest('[data-choice]');if(button){focusedChoice=Number(button.getAttribute('data-choice'));answer(focusedChoice);}
        }

        function onKey(event){
            var code=event.code||'',directIndex=-1;
            if(event.key==='1'||code==='Digit1'||code==='Numpad1')directIndex=0;
            else if(event.key==='2'||code==='Digit2'||code==='Numpad2')directIndex=1;
            else if(event.key==='3'||code==='Digit3'||code==='Numpad3')directIndex=2;
            if(state&&state.status==='playing'){
                if(directIndex>=0){event.preventDefault();root.dataset.lastKeyboard='choice-'+(directIndex+1);focusedChoice=directIndex;renderFocus();answer(directIndex);}
                else if(event.key==='ArrowLeft'||event.key==='ArrowUp'||event.keyCode===37||event.keyCode===38){event.preventDefault();root.dataset.lastKeyboard=event.key==='ArrowUp'||event.keyCode===38?'up':'left';focusChoice(focusedChoice-1);}
                else if(event.key==='ArrowRight'||event.key==='ArrowDown'||event.keyCode===39||event.keyCode===40){event.preventDefault();root.dataset.lastKeyboard=event.key==='ArrowDown'||event.keyCode===40?'down':'right';focusChoice(focusedChoice+1);}
                else if(event.key==='Enter'||event.key===' '){event.preventDefault();root.dataset.lastKeyboard='confirm';answer(focusedChoice);}
            }else if(event.key==='Enter'||event.key===' '){event.preventDefault();start();}
        }

        mount.querySelector('[data-start]').addEventListener('click',start);
        mount.querySelector('[data-restart]').addEventListener('click',start);
        mount.querySelector('[data-exit]').addEventListener('click',function(){if(typeof options.onExit==='function')options.onExit({status:'exit',correct:state?state.correct:0});});
        candidatesNode.addEventListener('click',onCandidate);
        root.addEventListener('pointerdown',function(){setTimeout(function(){if(!destroyed)try{root.focus({preventScroll:true});}catch(error){root.focus();}},0);});
        global.addEventListener('keydown',onKey);raf=requestAnimationFrame(frame);

        return {start:start,destroy:function(){destroyed=true;cancelAnimationFrame(raf);global.removeEventListener('keydown',onKey);mount.innerHTML='';}};
    }

    global.DanboCloudBasket={create:create};
})(window);
