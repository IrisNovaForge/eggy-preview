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
        assert(all.length===4&&all.every(function(level){return level.recovery&&level.recovery.kind==='shell-glimmer';}),'all four stages share the eggshell glimmer recovery rule');
        assert(all.every(function(level){return level.recovery.maxPerRound===1&&level.recovery.maxLives===3;}),'every stage limits recovery to once and caps chances at three');
        var level=Object.assign({},all[0],{recovery:Object.assign({},all[0].recovery,{minElapsed:.05,maxElapsed:.3,delayMin:.02,delayMax:.02,minX:50,maxX:50,safeObstacleGap:0,fallSpeed:120})});
        var rules=window.DanboFallingCatchRules.create({forceFallback:true});
        var game=window.DanboFallingCatch.create({mount:document.getElementById('mount'),rules:rules,levels:[level],lang:'en',seed:911,durationMs:5000,targetScore:999,lives:2,character:{id:'herbTraveler'},onEvent:function(type,payload){if(type.indexOf('recovery')===0)events.push({type:type,payload:payload});}});
        rules.ready.then(function(){
            game.start();setTimeout(function(){
                try{
                    var spawns=events.filter(function(event){return event.type==='recoverySpawn';}),collects=events.filter(function(event){return event.type==='recoveryCollect';});
                    assert(spawns.length===1,'one eggshell glimmer appears after chances are below three');
                    assert(collects.length===1,'the overhead basket catches the eggshell glimmer');
                    assert(collects[0].payload.before===2&&collects[0].payload.lives===3,'catching it restores exactly one chance');
                    assert(game.snapshot().score===0,'recovery does not change the score');
                    setTimeout(function(){try{assert(events.filter(function(event){return event.type==='recoverySpawn';}).length===1,'the same stage never spawns a second recovery');finish(null,game);}catch(error){finish(error,game);}},500);
                }catch(error){finish(error,game);}
            },900);
        }).catch(function(error){finish(error,game);});
    }catch(error){finish(error);}
})();
