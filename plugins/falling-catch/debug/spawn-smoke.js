(function(){
    'use strict';
    var report=document.getElementById('report'),lines=[],spawns=[];
    function assert(condition,message){if(!condition)throw new Error(message);lines.push('PASS  '+message);}
    function finish(error,game){
        if(game&&game.destroy)game.destroy();
        if(error){report.textContent='FAIL  '+(error&&error.stack||error);document.body.dataset.status='failed';throw error;}
        report.textContent=lines.join('\n');document.body.dataset.status='passed';
    }
    try{
        var levels=window.DanboFallingCatchLevels.all(),rules=window.DanboFallingCatchRules.create({forceFallback:true});
        var game=window.DanboFallingCatch.create({mount:document.getElementById('mount'),rules:rules,levels:levels,lang:'en',seed:731,character:{id:'herbTraveler'},durationMs:10000,targetScore:999,onEvent:function(type,payload){if(type==='spawn')spawns.push(payload);}});
        rules.ready.then(function(){
            setTimeout(function(){game.start();},30);
            setTimeout(function(){
                try{
                    assert(spawns.length>=7,'captured at least seven Stage 1 spawns');
                    for(var i=0;i<spawns.length;i++){
                        assert(spawns[i].x>=7&&spawns[i].x<=93,'spawn '+(i+1)+' remains inside 7-93');
                        if(i>0){
                            assert(spawns[i].zone!==spawns[i-1].zone,'spawn '+(i+1)+' does not repeat the previous zone');
                            assert(Math.abs(spawns[i].x-spawns[i-1].x)>=12-1e-9,'spawn '+(i+1)+' keeps the 12-unit horizontal gap');
                            assert(!(spawns[i].type==='obstacle'&&spawns[i-1].type==='obstacle'),'spawn '+(i+1)+' does not repeat an obstacle');
                        }
                    }
                    assert(spawns.every(function(spawn){return spawn.levelId==='breezy-harvest';}),'spawn planner is scoped to Stage 1');
                    var stageOneKinds={leaf:'wind-herb-leaf',berry:'berry-grove-berry',acorn:'golden-grain-seed',stone:'moss-weathered-stone'};
                    assert(spawns.every(function(spawn){return spawn.presentationKind===stageOneKinds[spawn.kind];}),'Stage 1 spawns use the DANBO meadow presentation kinds');
                    finish(null,game);
                }catch(error){finish(error,game);}
            },5600);
        }).catch(function(error){finish(error,game);});
    }catch(error){finish(error);}
})();
