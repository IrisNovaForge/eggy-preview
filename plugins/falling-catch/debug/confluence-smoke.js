(function(){
    'use strict';
    var report=document.getElementById('report'),lines=[],confluencePhases=[],windPhases=[],combos=[],spawns=[];
    function assert(condition,message){if(!condition)throw new Error(message);lines.push('PASS  '+message);}
    function finish(error,game){
        if(game&&game.destroy)game.destroy();
        if(error){report.textContent='FAIL  '+(error&&error.stack||error);document.body.dataset.status='failed';throw error;}
        report.textContent=lines.join('\n');document.body.dataset.status='passed';
    }
    try{
        var levels=window.DanboFallingCatchLevels.all(),stage=levels[3];
        levels[3]=Object.assign({},stage,{
            rules:{durationMs:6000,targetScore:999,lives:9},
            targetCatchBox:{halfWidth:60,topOffset:-100,bottomOffset:10,mode:'center'},
            confluence:{gatherDuration:.8,alternateDuration:.8,comboEvery:3,comboBonus:1},
            crosswind:{cueDuration:.2,activeDuration:.4,calmDuration:.2,speed:6,maxHorizontalSpeed:10,initialDirection:1}
        });
        var rules=window.DanboFallingCatchRules.create({forceFallback:true});
        var game=window.DanboFallingCatch.create({mount:document.getElementById('mount'),rules:rules,levels:levels,startLevelId:'starwind-confluence',lang:'en',seed:409,character:{id:'herbTraveler'},targetScore:999,lives:9,onEvent:function(type,payload){if(type==='confluencePhase')confluencePhases.push(payload);if(type==='crosswindPhase')windPhases.push(payload);if(type==='combo')combos.push(payload);if(type==='spawn')spawns.push(payload);}});
        rules.ready.then(function(){
            setTimeout(function(){game.start();},30);
            setTimeout(function(){
                try{
                    assert(game.level().id==='starwind-confluence','direct test starts Stage 4');
                    assert(confluencePhases.map(function(entry){return entry.phase;}).slice(0,3).join(',')==='gather,alternate,converge','Stage 4 advances through gather, alternate and converge phases');
                    assert(windPhases.some(function(entry){return entry.phase==='cue';})&&windPhases.some(function(entry){return entry.phase==='active';}),'periodic crosswind begins only after the gather phase');
                    assert(combos.length>=3,'wide test basket recorded at least three consecutive catches');
                    assert(combos.some(function(entry){return entry.streak===3&&entry.bonus===1&&entry.points===2;}),'every third catch awards one bonus point');
                    assert(spawns.every(function(spawn){return spawn.fallSpeed>=28&&spawn.fallSpeed<=30;}),'Stage 4 uses the fastest narrow fall-speed band');
                    assert(document.querySelector('.dfc-confluence-status.dfc-show').textContent.indexOf('Chain')>=0,'persistent Stage 4 status shows the current phase and catch chain');
                    assert(stage.rules.durationMs===30000&&stage.rules.targetScore===12&&stage.rules.lives===3,'production Stage 4 keeps 30 seconds, 12 points and three chances');
                    finish(null,game);
                }catch(error){finish(error,game);}
            },5200);
        }).catch(function(error){finish(error,game);});
    }catch(error){finish(error);}
})();
