(function(){
    'use strict';
    var mount=document.getElementById('mount'),report=document.getElementById('report'),lines=[];
    function assert(condition,message){if(!condition)throw new Error(message);lines.push('PASS  '+message);}
    function finish(error,game){if(game&&game.destroy)game.destroy();if(error){report.textContent='FAIL  '+(error&&error.stack||error);document.body.dataset.status='failed';throw error;}report.textContent=lines.join('\n');document.body.dataset.status='passed';}
    function makeGame(extra){
        var rules=window.DanboFallingCatchRules.create({forceFallback:true}),options={mount:mount,rules:rules,levels:window.DanboFallingCatchLevels.all(),lang:'en',seed:414,durationMs:600000,targetScore:999,character:{id:'herbTraveler'}};
        Object.keys(extra||{}).forEach(function(key){options[key]=extra[key];});return {rules:rules,game:window.DanboFallingCatch.create(options)};
    }
    try{
        var local=makeGame({forceTouchControls:true});local.rules.ready.then(function(){
            try{
                var joystick=document.querySelector('.dfc-touch-joystick'),jumpButton=document.querySelector('.dfc-jump-button');assert(joystick.hidden,'local wind-bud stick stays hidden on menus');local.game.start();
                assert(!joystick.hidden&&document.querySelector('.dfc-shell').dataset.touchControl==='local','touch gameplay reveals the original local single-axis stick');
                assert(!jumpButton.hidden&&!jumpButton.disabled&&jumpButton.dataset.state==='unavailable'&&jumpButton.getAttribute('aria-disabled')==='true'&&document.querySelector('.dfc-shell').dataset.touchJump==='visible','the mobile Leap handle remains visible but visually unavailable in Stage 1');
                jumpButton.dispatchEvent(new PointerEvent('pointerdown',{pointerId:6,pointerType:'touch',bubbles:true,cancelable:true}));
                assert(document.querySelector('.dfc-notice').textContent.indexOf('Stage 3')>=0&&document.querySelector('.dfc-notice').classList.contains('dfc-help'),'tapping the unavailable Stage 1 Leap handle explains when the feature begins');
                var base=joystick.querySelector('.dfc-touch-joystick-base'),knob=joystick.querySelector('.dfc-touch-joystick-knob'),rect=base.getBoundingClientRect(),knobRect=knob.getBoundingClientRect(),x=rect.left+rect.width*.82,y=rect.top+rect.height*.5;
                assert(Math.abs(rect.width-rect.height)<1&&parseFloat(getComputedStyle(base).borderTopLeftRadius)>=rect.width*.49,'local wind-bud base uses the original soft circular handle shape');
                assert(Math.abs(knobRect.width-42)<1&&Math.abs(knobRect.height-50)<1,'egg-shaped knob keeps its original proportions');
                joystick.dispatchEvent(new PointerEvent('pointerdown',{pointerId:7,pointerType:'touch',clientX:x,clientY:y,bubbles:true,cancelable:true}));
                joystick.dispatchEvent(new PointerEvent('pointermove',{pointerId:7,pointerType:'touch',clientX:x,clientY:y,bubbles:true,cancelable:true}));
                setTimeout(function(){try{
                    assert(local.game.motion().velocity>.1&&local.game.motion().facing===1,'right stick displacement moves the Traveler right');
                    assert(knob.style.transform.indexOf('translateX')===0,'the soft egg-shaped knob follows the pointer');
                    joystick.dispatchEvent(new PointerEvent('pointerup',{pointerId:7,pointerType:'touch',clientX:x,clientY:y,bubbles:true,cancelable:true}));
                    assert(knob.style.transform==='translateX(0px)'||knob.style.transform==='translateX(0)','release recenters the stick');
                    local.game.destroy();
                    var input={state:{active:true,x:-.82,y:0},modes:[],setTouchMode:function(mode){this.modes.push(mode);return mode==='horizontal';},getMoveVector:function(){return this.state;}},external=makeGame({input:input});
                    external.rules.ready.then(function(){
                        try{external.game.start();setTimeout(function(){try{
                                assert(document.querySelector('.dfc-shell').dataset.touchControl==='external','shared host input replaces the local stick when available');
                                assert(input.modes.indexOf('horizontal')>=0,'plugin requests horizontal-only host controls during gameplay');
                                assert(external.game.motion().velocity<-.1&&external.game.motion().facing===-1,'host move vector drives the same movement controller');
                                external.game.destroy();assert(input.modes[input.modes.length-1]==='hidden','destroy hides shared host controls');finish(null);
                            }catch(error){finish(error,external.game);}},260);
                        }catch(error){finish(error,external.game);}
                    }).catch(function(error){finish(error,external.game);});
                }catch(error){finish(error,local.game);}},260);
            }catch(error){finish(error,local.game);}
        }).catch(function(error){finish(error,local.game);});
    }catch(error){finish(error);}
})();
