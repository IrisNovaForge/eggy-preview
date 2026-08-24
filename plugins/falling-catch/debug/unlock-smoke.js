(function(){
    'use strict';
    var mount=document.getElementById('mount'),report=document.getElementById('report'),lines=[],game,timeout;
    var values={},writes=[],events=[],results=[],key='fallingCatch.progress.maxUnlockedLevel';
    var storage={get:function(name,fallback){return Object.prototype.hasOwnProperty.call(values,name)?values[name]:fallback;},set:function(name,value){values[name]=value;writes.push({name:name,value:value});}};
    function assert(condition,message){if(!condition)throw new Error(message);lines.push('PASS  '+message);}
    function finish(error){clearTimeout(timeout);if(game&&game.destroy)game.destroy();if(error){report.textContent='FAIL  '+(error&&error.stack||error);document.body.dataset.status='failed';throw error;}report.textContent=lines.join('\n');document.body.dataset.status='passed';}
    function later(callback,delay){setTimeout(function(){try{callback();}catch(error){finish(error);}},delay);}
    function makeGame(extra){
        var rules=window.DanboFallingCatchRules.create({forceFallback:true}),options={mount:mount,rules:rules,levels:window.DanboFallingCatchLevels.all(),lang:'zhs',seed:810,durationMs:10000,targetScore:1,lives:3,storage:storage,initialScreen:'select',character:{id:'herbTraveler'},onEvent:function(type,payload){events.push({type:type,payload:payload});},onResult:function(result){results.push(result);}};
        Object.keys(extra||{}).forEach(function(name){options[name]=extra[name];});return {rules:rules,game:window.DanboFallingCatch.create(options)};
    }
    try{
        var first=makeGame();game=first.game;first.rules.ready.then(function(){try{
            assert(game.progress().enabled&&game.progress().maxUnlockedLevel===1,'a new persisted campaign starts with only Stage 1 unlocked');
            var choices=mount.querySelectorAll('.dfc-level-choice');assert(choices.length===4&&!choices[0].disabled&&choices[1].disabled&&choices[2].disabled&&choices[3].disabled,'the stage screen disables Stages 2–4 for a new campaign');
            assert(mount.querySelectorAll('.dfc-level-lock').length===3&&mount.querySelector('.dfc-level-choice-current').dataset.levelId==='breezy-harvest','locked stages use the original egg-lock marker and Stage 1 is the current frontier');
            assert(game.selectLevel(3)===false&&game.level().id==='breezy-harvest','a locked stage cannot be entered through the shared selector');
            assert(game.selectLevel(1),'the unlocked first stage remains selectable');game.start();first.rules.collect(1);
            later(function(){
                assert(game.progress().maxUnlockedLevel===2&&values[key]===2,'winning Stage 1 persists exactly the next unlocked stage');
                assert(events.filter(function(event){return event.type==='levelUnlock';}).length===1&&events.filter(function(event){return event.type==='levelUnlock';})[0].payload.levelNumber===2,'the first clear emits one Stage 2 unlock event');
                assert(results[0].unlockedLevel===2&&mount.querySelector('.dfc-card-body').textContent.indexOf('新关卡已解锁')>=0,'the clear result announces the newly unlocked stage');
                game.showLevelSelect();choices=mount.querySelectorAll('.dfc-level-choice');assert(!choices[1].disabled&&choices[2].disabled,'returning to stage select immediately enables only Stage 2');
                game.destroy();var second=makeGame();game=second.game;second.rules.ready.then(function(){try{
                    assert(game.progress().maxUnlockedLevel===2,'the Stage 2 unlock survives recreating the plugin');
                    assert(game.selectLevel(2),'the persisted Stage 2 can be entered');game.start();second.rules.collect(1);
                    later(function(){
                        assert(game.progress().maxUnlockedLevel===3&&values[key]===3,'winning Stage 2 unlocks and persists only Stage 3');
                        assert(game.selectLevel(3),'the newly unlocked Stage 3 can be entered from the result');game.start();second.rules.hit();second.rules.hit();second.rules.hit();
                        later(function(){
                            assert(game.progress().maxUnlockedLevel===3&&values[key]===3,'failing Stage 3 does not unlock Stage 4');
                            game.destroy();var cleanValues={},directStorage={get:function(name,fallback){return Object.prototype.hasOwnProperty.call(cleanValues,name)?cleanValues[name]:fallback;},set:function(name,value){cleanValues[name]=value;}},direct=makeGame({storage:directStorage,bypassUnlocks:true,startLevelId:'starwind-confluence',initialScreen:'stage-title'});game=direct.game;direct.rules.ready.then(function(){try{
                                assert(!game.progress().enabled&&game.progress().bypassed&&game.level().id==='starwind-confluence','the explicit debug bypass can still open Stage 4 directly');
                                assert(!Object.prototype.hasOwnProperty.call(cleanValues,key),'debug direct access does not write formal campaign progress');
                                assert(writes.map(function(write){return write.value;}).join(',')==='2,3','formal progress writes only the two earned unlocks');finish();
                            }catch(error){finish(error);}}).catch(finish);
                        },100);
                    },100);
                }catch(error){finish(error);}}).catch(finish);
            },100);
        }catch(error){finish(error);}}).catch(finish);
        timeout=setTimeout(function(){finish(new Error('Timed out while checking sequential unlock progress'));},7000);
    }catch(error){finish(error);}
})();
