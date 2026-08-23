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
        assert(levels[0].spawnDistribution.minX===7&&levels[0].spawnDistribution.maxX===93&&levels[0].spawnDistribution.zoneCount===5&&levels[0].spawnDistribution.minHorizontalGap===12&&levels[0].spawnDistribution.avoidRepeatZone&&levels[0].spawnDistribution.avoidConsecutiveObstacle,'Stage 1 uses the five-zone distributed spawn plan');
        assert(levels[1].targetCatchBox===levels[0].targetCatchBox&&levels[1].basketOffsetY===-17.5,'Stage 2 keeps the same overhead basket and center-entry catch box');
        assert(levels[1].status==='playable'&&levels[1].mechanics==='updraft'&&!!levels[1].airflow,'Stage 2 enables only the updraft mechanic');
        assert(levels[1].airflow.affectedKinds.join(',')==='leaf,berry'&&levels[1].airflow.liftSpeed<0,'Stage 2 updraft affects only lightweight targets and produces lift');
        assert(!levels[1].spawnDistribution&&!levels[2].spawnDistribution&&levels[3].spawnDistribution===levels[0].spawnDistribution,'only Stages 1 and 4 use the shared five-zone distribution');
        assert(!levels[2].targetCatchBox&&!levels[2].airflow&&levels[2].status==='playable'&&levels[2].mechanics==='crosswind','Stage 3 adds crosswind without changing its existing catch behavior');
        assert(levels[2].crosswind.cueDuration===.8&&levels[2].crosswind.activeDuration===3&&levels[2].crosswind.calmDuration===1&&levels[2].crosswind.speed===7.5,'Stage 3 registers the isolated periodic crosswind values');
        assert(levels[3].status==='playable'&&levels[3].mechanics==='confluence'&&levels[3].basketOffsetY===-17.5&&levels[3].targetCatchBox===levels[0].targetCatchBox,'Stage 4 enables confluence with the shared overhead basket catch box');
        assert(levels[3].spawnDistribution===levels[0].spawnDistribution&&levels[3].airflow.sideSpawn===false&&levels[3].airflow.liftSpeed===-7&&levels[3].crosswind.speed===7,'Stage 4 safely reuses distributed spawning with clear finale wind strength');
        assert(levels[3].confluence.gatherDuration===4&&levels[3].confluence.alternateDuration===6&&levels[3].confluence.comboEvery===3&&levels[3].confluence.comboBonus===1,'Stage 4 reaches convergence after 10 seconds and keeps its three-catch bonus');
        var starts=[],rules=window.DanboFallingCatchRules.create({forceFallback:true});
        var game=window.DanboFallingCatch.create({mount:document.getElementById('mount'),rules:rules,levels:levels,lang:'zhs',seed:5,character:{id:'herbTraveler'},onEvent:function(type,payload){if(type==='start')starts.push(payload);}});
        rules.ready.then(function(){
            setTimeout(function(){
                try{
                    assert(game.level().id==='breezy-harvest','campaign starts at Stage 1');
                    assert(document.querySelector('.dfc-shell').dataset.levelNumber==='1','Stage 1 is reflected in the shared shell');
                    assert(window.DanboFallingCatchLevels.next('breezy-harvest').id==='wind-hill-rise','ordered level registry resolves the next stage');
                    assert(game.selectLevel(2)&&game.level().id==='wind-hill-rise','shared selector switches to Stage 2');
                    assert(document.querySelector('.dfc-card').textContent.indexOf('上升气流')>=0,'Stage 2 intro explains the updraft');
                    assert(document.querySelector('.dfc-card').textContent.indexOf('框架测试')<0,'Stage 2 is no longer marked as framework-only');
                    assert(game.selectLevel(3)&&game.level().id==='crystal-valley-turn','shared selector switches to Stage 3');
                    assert(document.querySelector('.dfc-card').textContent.indexOf('周期横风')>=0,'Stage 3 intro explains the periodic crosswind');
                    assert(document.querySelector('.dfc-card').textContent.indexOf('框架测试')<0,'Stage 3 is no longer marked as framework-only');
                    assert(game.selectLevel('starwind-confluence')&&game.level().number===4,'shared selector switches to Stage 4 by id');
                    assert(document.querySelector('.dfc-card').textContent.indexOf('连续接取')>=0,'Stage 4 intro explains the catch-chain reward');
                    assert(document.querySelector('.dfc-card').textContent.indexOf('框架测试')<0,'Stage 4 is no longer marked as framework-only');
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
