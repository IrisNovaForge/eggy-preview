(function(){
    'use strict';
    var report=document.getElementById('report'),lines=[];
    function assert(condition,message){if(!condition)throw new Error(message);lines.push('PASS  '+message);}
    function finish(error){
        if(error){report.textContent='FAIL  '+(error&&error.stack||error);document.body.dataset.status='failed';throw error;}
        report.textContent=lines.join('\n');document.body.dataset.status='passed';
    }
    try{
        var levels=window.DanboFallingCatchLevels.all();
        assert(levels.length===4,'four levels are registered');
        assert(levels.map(function(level){return level.id;}).join(',')==='breezy-harvest,wind-hill-rise,crystal-valley-turn,starwind-confluence','level order is stable');
        assert(levels[0].rules.durationMs===30000&&levels[0].rules.targetScore===12&&levels[0].rules.lives===3,'Stage 1 keeps the original 30s / 12 points / 3 chances');
        assert(levels[0].targetCatchBox.mode==='center'&&levels[0].targetCatchBox.halfWidth===2&&levels[0].targetCatchBox.topOffset===-2.8&&levels[0].targetCatchBox.bottomOffset===-.8,'Stage 1 uses the basket-sized center-entry catch box');
        assert(levels.slice(1).every(function(level){return !level.targetCatchBox;}),'Stages 2-4 keep their existing target collision behavior');
        assert(levels.slice(1).every(function(level){return level.status==='framework'&&level.mechanics==='base';}),'Stages 2-4 are framework-only and reuse base mechanics');
        var starts=[],rules=window.DanboFallingCatchRules.create({forceFallback:true});
        var game=window.DanboFallingCatch.create({mount:document.getElementById('mount'),rules:rules,levels:levels,lang:'zhs',seed:5,character:{id:'herbTraveler'},onEvent:function(type,payload){if(type==='start')starts.push(payload);}});
        rules.ready.then(function(){
            setTimeout(function(){
                try{
                    assert(game.level().id==='breezy-harvest','campaign starts at Stage 1');
                    assert(document.querySelector('.dfc-shell').dataset.levelNumber==='1','Stage 1 is reflected in the shared shell');
                    assert(window.DanboFallingCatchLevels.next('breezy-harvest').id==='wind-hill-rise','ordered level registry resolves the next stage');
                    assert(game.selectLevel(2)&&game.level().id==='wind-hill-rise','shared selector switches to Stage 2');
                    assert(document.querySelector('.dfc-card').textContent.indexOf('框架测试')>=0,'Stage 2 is clearly marked as framework-only');
                    assert(game.selectLevel(3)&&game.level().id==='crystal-valley-turn','shared selector switches to Stage 3');
                    assert(game.selectLevel('starwind-confluence')&&game.level().number===4,'shared selector switches to Stage 4 by id');
                    assert(game.selectLevel(1)&&game.level().id==='breezy-harvest','shared selector returns to Stage 1');
                    game.start();
                    assert(starts[0].durationMs===30000&&starts[0].targetScore===12&&starts[0].lives===3,'Stage 1 start payload keeps original values');
                    assert(game.selectLevel(2)===false,'level switching is guarded while a stage is running');
                    rules.collect(12);
                    setTimeout(function(){
                        try{
                            var next=document.querySelector('.dfc-next');assert(!!next,'winning Stage 1 exposes the shared next-stage action');next.click();
                            assert(game.level().id==='wind-hill-rise','next-stage action switches to Stage 2');
                            game.destroy();assert(document.getElementById('mount').children.length===0,'campaign destroy cleans the mount');finish();
                        }catch(error){finish(error);}
                    },80);
                }catch(error){finish(error);}
            },50);
        }).catch(finish);
    }catch(error){finish(error);}
})();
