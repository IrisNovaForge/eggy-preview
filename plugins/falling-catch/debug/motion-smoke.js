(function(){
    'use strict';
    var report=document.getElementById('report'),lines=[];
    function assert(condition,message){if(!condition)throw new Error(message);lines.push('PASS  '+message);}
    function finish(error,game){
        if(game&&game.destroy)game.destroy();
        if(error){report.textContent='FAIL  '+(error&&error.stack||error);document.body.dataset.status='failed';throw error;}
        report.textContent=lines.join('\n');document.body.dataset.status='passed';
    }
    try{
        var rules=window.DanboFallingCatchRules.create({forceFallback:true});
        var game=window.DanboFallingCatch.create({mount:document.getElementById('mount'),rules:rules,levels:window.DanboFallingCatchLevels.all(),lang:'en',seed:902,character:{id:'herbTraveler'},durationMs:600000,targetScore:999});
        rules.ready.then(function(){
            game.start();window.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight'}));
            setTimeout(function(){
                try{
                    var running=game.motion();
                    assert(document.querySelector('.dfc-shell').dataset.characterRenderer==='simplified-canvas','gameplay uses the independent simplified character renderer');
                    assert(running.moveAmount>.15,'right movement builds a visible run amount ('+running.moveAmount.toFixed(3)+')');
                    assert(running.velocity>.15&&running.facing===1,'motion follows the travel direction ('+running.velocity.toFixed(3)+')');
                    assert(running.gaitPhase>.05,'movement advances the gait cycle ('+running.gaitPhase.toFixed(3)+')');
                    window.dispatchEvent(new KeyboardEvent('keyup',{key:'ArrowRight'}));
                    finish(null,game);
                }catch(error){finish(error,game);}
            },260);
        }).catch(function(error){finish(error,game);});
    }catch(error){finish(error);}
})();
