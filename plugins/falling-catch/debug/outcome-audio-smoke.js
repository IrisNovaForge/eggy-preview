(function(){
    'use strict';
    var mount=document.getElementById('mount'),report=document.getElementById('report'),game,timer;
    function finish(error){clearTimeout(timer);if(game&&game.destroy)game.destroy();if(error){report.textContent='FAIL  '+(error&&error.stack||error);document.body.dataset.status='failed';throw error;}report.textContent='PASS  clear and failed results request only their dedicated outcome sounds';document.body.dataset.status='passed';}
    function makeLevel(kind){
        var base=window.DanboFallingCatchLevels.get(1),failure=kind==='failure';
        return Object.assign({},base,{
            recovery:null,jumpPower:null,
            spawnDistribution:{minX:failure?50:8,maxX:failure?50:8,zoneCount:1,minHorizontalGap:0,maxHorizontalGap:0,avoidRepeatZone:false,avoidConsecutiveObstacle:false},
            dropTuning:Object.assign({},base.dropTuning,{fallSpeedMin:failure?120:10,fallSpeedMax:failure?120:10,spawnDelayMin:10,spawnDelayMax:10,baseDriftMax:0,obstacleRate:failure?.8:0,avoidConsecutiveObstacle:false})
        });
    }
    function runFailure(){
        var names=[],rules=window.DanboFallingCatchRules.create({forceFallback:true});
        game=window.DanboFallingCatch.create({mount:mount,rules:rules,levels:[makeLevel('failure')],lang:'en',seed:1,durationMs:4000,targetScore:999,lives:1,character:{id:'herbTraveler'},play:function(name){
            names.push(name);if(name==='round-fail')setTimeout(function(){try{if(names.filter(function(value){return value==='round-fail';}).length!==1)throw new Error('round-fail fired more than once');if(names.indexOf('level-clear')>=0)throw new Error('failed result requested level-clear');if(names.indexOf('cancel')>=0)throw new Error('failed result retained generic cancel');finish();}catch(error){finish(error);}},0);
        }});
        rules.ready.then(function(){game.start();names.length=0;}).catch(finish);
    }
    function runClear(){
        var names=[],rules=window.DanboFallingCatchRules.create({forceFallback:true});
        game=window.DanboFallingCatch.create({mount:mount,rules:rules,levels:[makeLevel('clear')],lang:'en',seed:9,durationMs:1000,targetScore:999,lives:3,character:{id:'herbTraveler'},play:function(name){
            names.push(name);if(name==='level-clear')setTimeout(function(){try{if(names.filter(function(value){return value==='level-clear';}).length!==1)throw new Error('level-clear fired more than once');if(names.indexOf('round-fail')>=0)throw new Error('clear result requested round-fail');game.destroy();game=null;runFailure();}catch(error){finish(error);}},0);
        }});
        rules.ready.then(function(){game.start();names.length=0;}).catch(finish);
    }
    try{runClear();timer=setTimeout(function(){finish(new Error('Timed out waiting for both deterministic outcome sounds'));},7000);}catch(error){finish(error);}
})();
