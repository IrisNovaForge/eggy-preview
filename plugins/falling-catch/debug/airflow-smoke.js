(function(){
    'use strict';
    var report=document.getElementById('report'),lines=[],spawns=[],entries=[];
    function assert(condition,message){if(!condition)throw new Error(message);lines.push('PASS  '+message);}
    function finish(error,game){
        if(game&&game.destroy)game.destroy();
        if(error){report.textContent='FAIL  '+(error&&error.stack||error);document.body.dataset.status='failed';throw error;}
        report.textContent=lines.join('\n');document.body.dataset.status='passed';
    }
    try{
        var levels=window.DanboFallingCatchLevels.all(),rules=window.DanboFallingCatchRules.create({forceFallback:true});
        var game=window.DanboFallingCatch.create({mount:document.getElementById('mount'),rules:rules,levels:levels,startLevelId:'wind-hill-rise',lang:'en',seed:2026,character:{id:'herbTraveler'},durationMs:12000,targetScore:999,onEvent:function(type,payload){if(type==='spawn')spawns.push(payload);if(type==='airflowEnter')entries.push(payload);}});
        rules.ready.then(function(){
            setTimeout(function(){game.start();},30);
            setTimeout(function(){
                try{
                    assert(game.level().id==='wind-hill-rise','direct test starts Stage 2');
                    assert(spawns.length>=7,'captured at least seven Stage 2 spawns');
                    assert(spawns.every(function(spawn){return spawn.levelId==='wind-hill-rise';}),'all recorded spawns belong to Stage 2');
                    assert(spawns.every(function(spawn){return spawn.x>=18&&spawn.x<=34||spawn.x>=66&&spawn.x<=82;}),'Stage 2 spawns use the two diagonal entry lanes');
                    assert(spawns.filter(function(spawn){return spawn.type==='target';}).every(function(spawn){return Math.abs(spawn.drift)>=10&&Math.abs(spawn.drift)<=14;}),'Stage 2 targets begin on clear diagonal paths');
                    assert(spawns.every(function(spawn){return spawn.fallSpeed>=24&&spawn.fallSpeed<=26;}),'Stage 2 uses its faster narrow fall-speed band');
                    assert(spawns.every(function(spawn,index){return index%2===0||spawn.zone===spawns[index-1].zone;}),'Stage 2 holds each diagonal entry side for a readable two-drop group');
                    assert(spawns.every(function(spawn,index){return index===0||!(spawn.type==='obstacle'&&spawns[index-1].type==='obstacle');}),'Stage 2 never generates consecutive stones');
                    assert(spawns.filter(function(spawn){return spawn.airflowEligible;}).every(function(spawn){return spawn.kind==='leaf'||spawn.kind==='berry';}),'only lightweight target kinds are airflow eligible');
                    assert(entries.length>=1,'at least one lightweight target entered the updraft');
                    assert(entries.every(function(entry){return entry.levelId==='wind-hill-rise'&&entry.type==='target'&&entry.x>=36&&entry.x<=64&&entry.y>=14&&entry.y<=46;}),'updraft entry events stay inside the Stage 2 airflow field');
                    finish(null,game);
                }catch(error){finish(error,game);}
            },7200);
        }).catch(function(error){finish(error,game);});
    }catch(error){finish(error);}
})();
