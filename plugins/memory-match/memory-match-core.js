(function(global){
    'use strict';

    var FACES={
        blossomTraveler:{name:'花香旅人',accent:'#ef6978',soft:'#fff1f2'},
        herbTraveler:{name:'香草旅人',accent:'#75a966',soft:'#eef8e9'},
        saltCrystalTraveler:{name:'盐晶旅人',accent:'#74a7c7',soft:'#edf7fb'},
        cloudwingTraveler:{name:'云翼旅人',accent:'#8b9bd0',soft:'#f1f3fd'},
        fruitbrewTraveler:{name:'果酿旅人',accent:'#d89755',soft:'#fff3e3'},
        berryTraveler:{name:'浆果旅人',accent:'#b65e8a',soft:'#fbedf5'},
        spicyFlameTraveler:{name:'辣焰旅人',accent:'#db684d',soft:'#fff0e9'},
        goldenGrainTraveler:{name:'金穗旅人',accent:'#c7a24d',soft:'#fff7dc'}
    };

    function safeSeed(value){return ((Number(value)||Date.now())>>>0)||0x6d2b79f5;}
    function joinPath(base,file){base=String(base||'');return base+(base&&base.charAt(base.length-1)!=='/'?'/':'')+file;}

    function create(options){
        options=options||{};
        if(!options.mount)throw new Error('memory-match requires a mount element');
        var mount=options.mount;
        var rules=options.rules||global.DanboMemoryMatchRules.create();
        var assetBase=String(options.assetBase||'');
        var pairCount=Math.max(1,Math.min(8,options.pairCount|0||8));
        var mismatchDelay=Math.max(20,Number(options.mismatchDelayMs)||760);
        var matchDelay=Math.max(0,Number(options.matchDelayMs)||180);
        var status='title',cards=[],selected=[],matchedPairs=0,attempts=0,inputLocked=false;
        var runId=0,pendingTimer=0,destroyed=false,resultSent=false;

        mount.innerHTML=''+
            '<section class="mm-game" aria-label="蛋宝翻牌记忆">'+
              '<div class="mm-sky-dot mm-sky-dot-a"></div><div class="mm-sky-dot mm-sky-dot-b"></div>'+
              '<header class="mm-header">'+
                '<div class="mm-brand"><span class="mm-brand-mark" aria-hidden="true"></span><div><b>蛋宝记忆配对</b><small>MEMORY PAIRS</small></div></div>'+
                '<div class="mm-stats" aria-live="polite"><span>配对 <b data-mm-matches>0 / '+pairCount+'</b></span><span>尝试 <b data-mm-attempts>0</b></span></div>'+
              '</header>'+
              '<main class="mm-board-wrap">'+
                '<div class="mm-board" data-mm-board aria-label="记忆卡牌区域"></div>'+
                '<div class="mm-panel is-visible" data-mm-title-panel role="dialog" aria-modal="true">'+
                  '<div class="mm-panel-emblem" aria-hidden="true"><i></i><i></i><i></i></div>'+
                  '<p class="mm-kicker">DANBO MEMORY</p><h1>找出相同的旅人</h1>'+
                  '<p>每次揭开两张记忆牌。相同会留下，不同会轻轻收回。</p>'+
                  '<button class="mm-primary" type="button" data-mm-start>开始配对</button>'+
                '</div>'+
                '<div class="mm-panel mm-result" data-mm-result-panel role="dialog" aria-modal="true">'+
                  '<div class="mm-finish-mark" aria-hidden="true">✓</div><p class="mm-kicker">ALL PAIRED</p><h2>记忆配对完成</h2>'+
                  '<p>你用了 <b data-mm-result-attempts>0</b> 次尝试找到了全部旅人。</p>'+
                  '<div class="mm-panel-actions"><button class="mm-primary" type="button" data-mm-restart>再来一次</button><button class="mm-secondary" type="button" data-mm-result-exit>退出</button></div>'+
                '</div>'+
              '</main>'+
              '<footer class="mm-footer"><span>选择两张记忆牌</span><div><button type="button" data-mm-footer-restart>重新开始</button><button type="button" data-mm-exit>退出</button></div></footer>'+
            '</section>';

        var board=mount.querySelector('[data-mm-board]');
        var titlePanel=mount.querySelector('[data-mm-title-panel]');
        var resultPanel=mount.querySelector('[data-mm-result-panel]');
        var matchText=mount.querySelector('[data-mm-matches]');
        var attemptText=mount.querySelector('[data-mm-attempts]');
        var resultAttempts=mount.querySelector('[data-mm-result-attempts]');

        function clearPending(){if(pendingTimer){clearTimeout(pendingTimer);pendingTimer=0;}}
        function schedule(callback,delay){
            clearPending();var expectedRun=runId;
            pendingTimer=setTimeout(function(){
                pendingTimer=0;
                if(destroyed||expectedRun!==runId)return;
                callback();
            },delay);
        }
        function faceFor(card){return FACES[card.faceId]||FACES.blossomTraveler;}
        function cardMarkup(card,index){
            var face=faceFor(card),up=card.state==='up'||card.state==='matched',matched=card.state==='matched';
            var classes='mm-card'+(up?' is-up':'')+(matched?' is-matched':'');
            var label=matched?'已配对：'+face.name:(up?'已揭开：'+face.name:'第'+(index+1)+'张记忆牌，未揭开');
            return '<button class="'+classes+'" type="button" data-card-index="'+index+'" aria-label="'+label+'" '+(matched?'disabled':'')+' style="--face-accent:'+face.accent+';--face-soft:'+face.soft+'">'+
                '<span class="mm-card-shell">'+
                  '<span class="mm-card-back" aria-hidden="true"><i class="mm-back-egg"></i><i class="mm-back-orbit"></i><i class="mm-back-star mm-back-star-a"></i><i class="mm-back-star mm-back-star-b"></i></span>'+
                  '<span class="mm-card-front" aria-hidden="true"><span class="mm-portrait-wrap"><img src="'+joinPath(assetBase,'assets/card-faces/'+card.faceId+'.png')+'" alt=""></span><b>'+face.name+'</b><i class="mm-match-check">✓</i></span>'+
                '</span></button>';
        }
        function renderCards(){
            board.innerHTML=cards.map(cardMarkup).join('');
            board.setAttribute('aria-busy',inputLocked?'true':'false');
            matchText.textContent=matchedPairs+' / '+pairCount;
            attemptText.textContent=String(attempts);
        }
        function showPanel(panel,visible){if(panel)panel.classList.toggle('is-visible',!!visible);}
        function startGame(seed){
            if(destroyed)return;
            clearPending();runId++;resultSent=false;
            cards=rules.createDeck(pairCount,safeSeed(seed));selected=[];matchedPairs=0;attempts=0;inputLocked=false;status='playing';
            showPanel(titlePanel,false);showPanel(resultPanel,false);renderCards();
            var first=board.querySelector('.mm-card');if(first)first.focus({preventScroll:true});
        }
        function returnToTitle(){
            clearPending();runId++;status='title';inputLocked=false;selected=[];
            showPanel(resultPanel,false);showPanel(titlePanel,true);
        }
        function completeGame(){
            status='won';inputLocked=true;renderCards();resultAttempts.textContent=String(attempts);showPanel(resultPanel,true);
            if(!resultSent&&typeof options.onResult==='function'){
                resultSent=true;options.onResult({status:'finished',matchedPairs:matchedPairs,attempts:attempts,pairs:pairCount});
            }
            var restart=mount.querySelector('[data-mm-restart]');if(restart)restart.focus({preventScroll:true});
        }
        function finishSelection(matched){
            var first=cards[selected[0]],second=cards[selected[1]];
            if(!first||!second){selected=[];inputLocked=false;status='playing';renderCards();return;}
            if(matched){
                first.state='matched';second.state='matched';matchedPairs++;
            }else{
                first.state='down';second.state='down';
            }
            selected=[];inputLocked=false;status='playing';renderCards();
            if(rules.isComplete(matchedPairs,pairCount))completeGame();
        }
        function flip(index){
            index=index|0;
            if(destroyed||status!=='playing'||inputLocked||index<0||index>=cards.length)return false;
            var card=cards[index];if(!card||card.state!=='down')return false;
            card.state='up';selected.push(index);renderCards();
            if(selected.length<2)return true;
            attempts++;inputLocked=true;status='resolving';renderCards();
            var matched=rules.samePair(cards[selected[0]],cards[selected[1]]);
            schedule(function(){finishSelection(matched);},matched?matchDelay:mismatchDelay);
            return true;
        }
        function exitGame(){
            var result={status:'exit',matchedPairs:matchedPairs,attempts:attempts,pairs:pairCount};
            if(typeof options.onExit==='function'){
                clearPending();status='exiting';inputLocked=true;options.onExit(result);
            }else returnToTitle();
        }
        function onClick(event){
            var target=event.target.closest('button');if(!target||!mount.contains(target))return;
            if(target.hasAttribute('data-card-index')){flip(Number(target.getAttribute('data-card-index')));return;}
            if(target.hasAttribute('data-mm-start')){startGame();return;}
            if(target.hasAttribute('data-mm-restart')||target.hasAttribute('data-mm-footer-restart')){startGame();return;}
            if(target.hasAttribute('data-mm-exit')||target.hasAttribute('data-mm-result-exit'))exitGame();
        }
        mount.addEventListener('click',onClick);
        renderCards();
        if(options.autoStart)startGame(options.seed);

        return {
            start:startGame,
            restart:startGame,
            flip:flip,
            getState:function(){return {status:status,cards:cards.map(function(card){return {id:card.id,pairId:card.pairId,faceId:card.faceId,state:card.state};}),selected:selected.slice(),matchedPairs:matchedPairs,attempts:attempts,inputLocked:inputLocked,runId:runId};},
            destroy:function(){
                if(destroyed)return;destroyed=true;status='destroyed';runId++;clearPending();mount.removeEventListener('click',onClick);mount.innerHTML='';
            }
        };
    }

    global.DanboMemoryMatch={create:create,faces:FACES};
})(window);
