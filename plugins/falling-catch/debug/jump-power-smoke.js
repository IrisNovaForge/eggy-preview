(function(){
    'use strict';
    var mount=document.getElementById('mount'),report=document.getElementById('report'),lines=[],events=[],game,timeout;
    function assert(condition,message){if(!condition)throw new Error(message);lines.push('PASS  '+message);}
    function finish(error){clearTimeout(timeout);if(game&&game.destroy)game.destroy();if(error){report.textContent='FAIL  '+(error&&error.stack||error);document.body.dataset.status='failed';throw error;}report.textContent=lines.join('\n');document.body.dataset.status='passed';}
    function later(callback,delay){setTimeout(function(){try{callback();}catch(error){finish(error);}},delay);}
    try{
        var all=window.DanboFallingCatchLevels.all();
        assert(!all[0].jumpPower&&!all[1].jumpPower,'Stages 1 and 2 remain free of the jump-power rule');
        assert(all[2].jumpPower&&all[2].jumpPower.kind==='wind-sprout'&&all[2].jumpPower.maxPerRound===1,'Stage 3 contains one original Wind Sprout appearance');
        assert(all[3].jumpPower&&all[3].jumpPower.kind==='wind-sprout'&&all[3].jumpPower.maxPerRound===2,'Stage 4 contains up to two Wind Sprout appearances');
        assert(all[2].jumpPower.maxCharges===1&&all[3].jumpPower.maxCharges===1,'both stages store at most one manual jump');
        var level=Object.assign({},all[3],{
            jumpPower:Object.assign({},all[3].jumpPower,{minElapsed:.05,firstLatest:.05,maxElapsed:5,cooldown:.08,rescheduleJitter:0,minX:50,maxX:50,safeObstacleGap:0,fallSpeed:120,jumpDuration:.42,jumpHeight:10}),
            recovery:null,
            dropTuning:Object.assign({},all[3].dropTuning,{spawnDelayMin:10,spawnDelayMax:10,obstacleRate:0}),
            spawnDistribution:{minX:7,maxX:7,zoneCount:5,minHorizontalGap:0,maxHorizontalGap:0,avoidRepeatZone:false,avoidConsecutiveObstacle:true}
        });
        var rules=window.DanboFallingCatchRules.create({forceFallback:true}),jumpNumber=0;
        game=window.DanboFallingCatch.create({mount:mount,rules:rules,levels:[level],lang:'en',seed:118,durationMs:7000,targetScore:999,lives:3,forceTouchControls:true,character:{id:'herbTraveler'},onEvent:function(type,payload){
            if(type.indexOf('jump')===0)events.push({type:type,payload:payload});
            if(type==='jumpPowerCollect')later(function(){
                assert(game.snapshot().jumpCharge===1,'catching a Wind Sprout stores one jump without changing the life counter');
                var button=mount.querySelector('.dfc-jump-button');assert(button&&!button.hidden&&!button.disabled,'touch play exposes an enabled circular jump control when charged');
                if(jumpNumber===0)button.dispatchEvent(new PointerEvent('pointerdown',{pointerId:19,pointerType:'touch',bubbles:true,cancelable:true}));
                else window.dispatchEvent(new KeyboardEvent('keydown',{key:' ',bubbles:true,cancelable:true}));
                assert(game.jumpState().airborne&&game.snapshot().jumpCharge===0,'using the control consumes the stored jump and starts the rise');
                later(function(){assert(game.jumpState().offsetY<-3,'the Traveler and overhead basket visibly rise during the jump arc');},100);
            },0);
            if(type==='jumpStart')jumpNumber++;
            if(type==='jumpLand'&&jumpNumber===2)later(function(){
                assert(game.jumpState().offsetY===0&&!game.jumpState().airborne,'the jump returns cleanly to the ground');
                var starts=events.filter(function(event){return event.type==='jumpStart';});
                assert(starts.length===2&&starts[0].payload.source==='touch'&&starts[1].payload.source==='keyboard','touch and keyboard use the same single-use jump mechanic');
                assert(events.filter(function(event){return event.type==='jumpPowerSpawn';}).length===2,'the Stage 4 appearance cap stops after two separated Wind Sprouts');
                assert(game.snapshot().score===0&&game.snapshot().lives===3,'Wind Sprouts and jumps do not alter score or chances');finish();
            },0);
        }});
        rules.ready.then(function(){game.start();}).catch(finish);
        timeout=setTimeout(function(){finish(new Error('Timed out waiting for both Wind Sprout jumps'));},5000);
    }catch(error){finish(error);}
})();
