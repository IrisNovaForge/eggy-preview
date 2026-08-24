(function(){
    'use strict';
    var mount=document.getElementById('mount'),report=document.getElementById('report'),game,timer,names=[];
    function finish(error){clearTimeout(timer);if(game&&game.destroy)game.destroy();if(error){report.textContent='FAIL  '+(error&&error.stack||error);document.body.dataset.status='failed';throw error;}report.textContent='PASS  an ordinary target catch requests only catch-success';document.body.dataset.status='passed';}
    try{
        var base=window.DanboFallingCatchLevels.get(1),level=Object.assign({},base,{
            recovery:null,jumpPower:null,
            targetCatchBox:{halfWidth:2,topOffset:-6,bottomOffset:2,mode:'center'},
            spawnDistribution:{minX:50,maxX:50,zoneCount:1,minHorizontalGap:0,maxHorizontalGap:0,avoidRepeatZone:false,avoidConsecutiveObstacle:true},
            dropTuning:Object.assign({},base.dropTuning,{fallSpeedMin:40,fallSpeedMax:40,spawnDelayMin:10,spawnDelayMax:10,baseDriftMax:0,obstacleRate:0})
        });
        var rules=window.DanboFallingCatchRules.create({forceFallback:true});
        game=window.DanboFallingCatch.create({mount:mount,rules:rules,levels:[level],lang:'en',seed:912,durationMs:4000,targetScore:999,lives:3,character:{id:'herbTraveler'},play:function(name){
            names.push(name);if(name==='catch-success')setTimeout(function(){try{if(names.filter(function(value){return value==='catch-success';}).length!==1)throw new Error('ordinary catch sound fired more than once');if(names.indexOf('cancel')>=0)throw new Error('ordinary catch incorrectly requested the hazard sound');finish();}catch(error){finish(error);}},0);
        }});
        rules.ready.then(function(){game.start();}).catch(finish);
        timer=setTimeout(function(){finish(new Error('Timed out waiting for the deterministic ordinary catch sound event: '+names.join(',')));},3000);
    }catch(error){finish(error);}
})();
