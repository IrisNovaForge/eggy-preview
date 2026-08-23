(function(){
    'use strict';
    var report=document.getElementById('report'),lines=[],phases=[],applications=[];
    function assert(condition,message){if(!condition)throw new Error(message);lines.push('PASS  '+message);}
    function finish(error,game){
        if(game&&game.destroy)game.destroy();
        if(error){report.textContent='FAIL  '+(error&&error.stack||error);document.body.dataset.status='failed';throw error;}
        report.textContent=lines.join('\n');document.body.dataset.status='passed';
    }
    try{
        var levels=window.DanboFallingCatchLevels.all(),rules=window.DanboFallingCatchRules.create({forceFallback:true});
        var game=window.DanboFallingCatch.create({mount:document.getElementById('mount'),rules:rules,levels:levels,startLevelId:'crystal-valley-turn',lang:'en',seed:317,character:{id:'herbTraveler'},durationMs:10000,targetScore:999,lives:9,onEvent:function(type,payload){if(type==='crosswindPhase')phases.push(payload);if(type==='crosswindApply')applications.push(payload);}});
        rules.ready.then(function(){
            setTimeout(function(){game.start();},30);
            setTimeout(function(){
                try{
                    assert(game.level().id==='crystal-valley-turn','direct test starts Stage 3');
                    assert(phases.length>=5,'captured a full crosswind cycle and the next active phase');
                    assert(phases[0].phase==='cue'&&phases[0].direction===1,'cycle begins with a left-to-right direction cue');
                    assert(phases[1].phase==='active'&&phases[1].direction===1,'cue becomes an active left-to-right crosswind');
                    assert(phases[2].phase==='calm'&&phases[2].direction===1,'active crosswind is followed by a calm phase');
                    assert(phases[3].phase==='cue'&&phases[3].direction===-1,'direction reverses before the next active phase');
                    assert(phases[4].phase==='active'&&phases[4].direction===-1,'the reverse cue becomes an active right-to-left crosswind');
                    assert(applications.length>=2,'crosswind was applied to falling objects');
                    assert(applications.every(function(entry){return entry.levelId==='crystal-valley-turn'&&entry.speed===7.5;}),'every target and obstacle uses the same Stage 3 wind strength');
                    finish(null,game);
                }catch(error){finish(error,game);}
            },6400);
        }).catch(function(error){finish(error,game);});
    }catch(error){finish(error);}
})();
