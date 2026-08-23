(function(){
    'use strict';

    var RUNNING=0,WON=1,LOST=2;

    function clamp(value,min,max){return Math.max(min,Math.min(max,value));}

    function makeFallback(){
        var state={score:0,lives:3,remainingMs:30000,targetScore:12,status:RUNNING,rng:0x6d2b79f5};
        return {
            reset:function(seed,durationMs,lives,targetScore){
                state.score=0;
                state.lives=clamp(lives|0,1,9);
                state.remainingMs=clamp(durationMs|0,1000,600000);
                state.targetScore=clamp(targetScore|0,1,999);
                state.status=RUNNING;
                state.rng=(seed>>>0)||0x6d2b79f5;
            },
            tick:function(deltaMs){
                if(state.status!==RUNNING)return state.status;
                state.remainingMs=Math.max(0,state.remainingMs-clamp(deltaMs|0,0,250));
                if(state.remainingMs===0)state.status=WON;
                return state.status;
            },
            collect:function(value){
                if(state.status!==RUNNING)return state.status;
                state.score=Math.min(2147483647,state.score+clamp(value|0,0,100));
                if(state.score>=state.targetScore)state.status=WON;
                return state.status;
            },
            hit:function(){
                if(state.status!==RUNNING)return state.status;
                state.lives=Math.max(0,state.lives-1);
                if(state.lives===0)state.status=LOST;
                return state.status;
            },
            restore:function(value,maxLives){
                if(state.status!==RUNNING)return state.status;
                state.lives=Math.min(clamp(maxLives|0,1,9),state.lives+clamp(value|0,0,9));
                return state.status;
            },
            score:function(){return state.score;},
            lives:function(){return state.lives;},
            remainingMs:function(){return state.remainingMs;},
            status:function(){return state.status;},
            randomU32:function(){
                var value=state.rng>>>0;
                value^=(value<<13)>>>0;
                value^=value>>>17;
                value^=(value<<5)>>>0;
                state.rng=(value>>>0)||0x6d2b79f5;
                return state.rng;
            }
        };
    }

    function makeWasm(exports){
        return {
            reset:function(seed,durationMs,lives,targetScore){exports.danbo_falling_catch_reset(seed>>>0,durationMs|0,lives|0,targetScore|0);},
            tick:function(deltaMs){return exports.danbo_falling_catch_tick(deltaMs|0);},
            collect:function(value){return exports.danbo_falling_catch_collect(value|0);},
            hit:function(){return exports.danbo_falling_catch_hit();},
            restore:function(value,maxLives){return exports.danbo_falling_catch_restore(value|0,maxLives|0);},
            score:function(){return exports.danbo_falling_catch_score();},
            lives:function(){return exports.danbo_falling_catch_lives();},
            remainingMs:function(){return exports.danbo_falling_catch_remaining_ms();},
            status:function(){return exports.danbo_falling_catch_status();},
            randomU32:function(){return exports.danbo_falling_catch_random_u32()>>>0;}
        };
    }

    function create(options){
        options=options||{};
        var backend=makeFallback();
        var mode='js';
        var loadError=null;
        var ready=Promise.resolve();
        if(window.DanboFallingCatchWasm&&window.DanboFallingCatchWasm.load){
            ready=window.DanboFallingCatchWasm.load(options).then(function(exports){
                backend=makeWasm(exports);
                mode='wasm';
            }).catch(function(error){
                loadError=error;
                mode='js';
                console.warn('[falling-catch] WASM unavailable; using JS rules',error&&error.message?error.message:error);
            });
        }
        return {
            ready:ready,
            mode:function(){return mode;},
            error:function(){return loadError;},
            reset:function(seed,durationMs,lives,targetScore){return backend.reset(seed,durationMs,lives,targetScore);},
            tick:function(deltaMs){return backend.tick(deltaMs);},
            collect:function(value){return backend.collect(value);},
            hit:function(){return backend.hit();},
            restore:function(value,maxLives){return backend.restore(value,maxLives);},
            score:function(){return backend.score();},
            lives:function(){return backend.lives();},
            remainingMs:function(){return backend.remainingMs();},
            status:function(){return backend.status();},
            random:function(){return backend.randomU32()/4294967296;},
            snapshot:function(){return {score:backend.score(),lives:backend.lives(),remainingMs:backend.remainingMs(),status:backend.status(),mode:mode};}
        };
    }

    window.DanboFallingCatchRules={create:create,RUNNING:RUNNING,WON:WON,LOST:LOST};
})();
