(function(){
    'use strict';
    var report=document.getElementById('report'),lines=[],events=[];
    function assert(condition,message){if(!condition)throw new Error(message);lines.push('PASS  '+message);}
    function finish(error,game){
        if(game&&game.destroy)game.destroy();
        if(error){report.textContent='FAIL  '+(error&&error.stack||error);document.body.dataset.status='failed';throw error;}
        report.textContent=lines.join('\n');document.body.dataset.status='passed';
    }
    try{
        var all=window.DanboFallingCatchLevels.all();
        assert(all.length===4&&all.every(function(level){return level.recovery&&level.recovery.kind==='shell-glimmer';}),'all four stages use the Returning Breeze Dewlight recovery rule');
        assert(all.map(function(level){return level.recovery.maxPerRound;}).join(',')==='1,2,2,3','recovery appearance caps increase across the four-stage difficulty curve');
        assert(all.map(function(level){return level.recovery.cooldown;}).join(',')==='8,7,6,5','recovery cooldowns shorten as stage difficulty increases');
        assert(all.every(function(level){return level.recovery.maxLives===3&&level.recovery.maxElapsed===26&&level.recovery.fallSpeed===18;}),'every stage keeps the three-chance cap, catchable late recovery window and fair fixed recovery speed');
        var level=Object.assign({},all[3],{
            recovery:Object.assign({},all[3].recovery,{minElapsed:.05,maxElapsed:4,delayMin:.02,delayMax:.02,urgentDelayMax:.02,cooldown:.05,minX:50,maxX:50,safeObstacleGap:0,fallSpeed:120}),
            dropTuning:Object.assign({},all[3].dropTuning,{spawnDelayMin:10,spawnDelayMax:10,obstacleRate:0}),
            spawnDistribution:{minX:7,maxX:7,zoneCount:5,minHorizontalGap:0,maxHorizontalGap:0,avoidRepeatZone:false,avoidConsecutiveObstacle:true}
        });
        var rules=window.DanboFallingCatchRules.create({forceFallback:true});
        var game=window.DanboFallingCatch.create({mount:document.getElementById('mount'),rules:rules,levels:[level],lang:'en',seed:911,durationMs:7000,targetScore:999,lives:2,character:{id:'herbTraveler'},onEvent:function(type,payload){
            if(type.indexOf('recovery')===0){events.push({type:type,payload:payload});if(type==='recoveryCollect'&&payload.lives===3&&events.filter(function(event){return event.type==='recoveryCollect';}).length<3)setTimeout(function(){rules.hit();},30);}
        }});
        rules.ready.then(function(){
            game.start();setTimeout(function(){
                try{
                    var spawns=events.filter(function(event){return event.type==='recoverySpawn';}),collects=events.filter(function(event){return event.type==='recoveryCollect';});
                    assert(spawns.length===3&&spawns.map(function(event){return event.payload.count;}).join(',')==='1,2,3','Stage 4 can schedule three separated recovery appearances');
                    assert(collects.length===3,'the overhead basket can catch every scheduled recovery');
                    assert(collects.every(function(event){return event.payload.before===2&&event.payload.lives===3;}),'each catch restores exactly one chance up to the cap');
                    assert(game.snapshot().score===0,'recovery appearances do not change the score');
                    rules.hit();setTimeout(function(){try{assert(events.filter(function(event){return event.type==='recoverySpawn';}).length===3,'the stage cap prevents a fourth recovery appearance');finish(null,game);}catch(error){finish(error,game);}},500);
                }catch(error){finish(error,game);}
            },3800);
        }).catch(function(error){finish(error,game);});
    }catch(error){finish(error);}
})();
