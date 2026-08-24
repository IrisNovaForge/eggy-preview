(function(){
    'use strict';
    var mount=document.getElementById('mount'),report=document.getElementById('report'),game,timer,names=[];
    function finish(error){clearTimeout(timer);if(game&&game.destroy)game.destroy();if(error){report.textContent='FAIL  '+(error&&error.stack||error);document.body.dataset.status='failed';throw error;}report.textContent='PASS  an obstacle collision requests only obstacle-hit';document.body.dataset.status='passed';}
    try{
        var base=window.DanboFallingCatchLevels.get(1),level=Object.assign({},base,{
            recovery:null,jumpPower:null,
            spawnDistribution:{minX:50,maxX:50,zoneCount:1,minHorizontalGap:0,maxHorizontalGap:0,avoidRepeatZone:false,avoidConsecutiveObstacle:false},
            dropTuning:Object.assign({},base.dropTuning,{fallSpeedMin:120,fallSpeedMax:120,spawnDelayMin:10,spawnDelayMax:10,baseDriftMax:0,obstacleRate:.8,avoidConsecutiveObstacle:false})
        });
        var rules=window.DanboFallingCatchRules.create({forceFallback:true});
        game=window.DanboFallingCatch.create({mount:mount,rules:rules,levels:[level],lang:'en',seed:1,durationMs:4000,targetScore:999,lives:3,character:{id:'herbTraveler'},play:function(name){
            names.push(name);if(name==='obstacle-hit')setTimeout(function(){try{if(names.filter(function(value){return value==='obstacle-hit';}).length!==1)throw new Error('obstacle-hit sound fired more than once');if(names.indexOf('catch-success')>=0)throw new Error('obstacle collision incorrectly requested catch-success');if(names.indexOf('cancel')>=0)throw new Error('obstacle collision retained the generic cancel sound');finish();}catch(error){finish(error);}},0);
        }});
        rules.ready.then(function(){game.start();}).catch(finish);
        timer=setTimeout(function(){finish(new Error('Timed out waiting for the deterministic obstacle-hit event: '+names.join(',')));},3000);
    }catch(error){finish(error);}
})();
