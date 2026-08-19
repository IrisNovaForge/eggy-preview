(function(){
    'use strict';
    var prefix='brick_breaker_standalone:';
    var storage={
        get:function(key,fallback){try{var raw=localStorage.getItem(prefix+key);return raw===null?fallback:JSON.parse(raw);}catch(e){return fallback;}},
        set:function(key,value){try{localStorage.setItem(prefix+key,JSON.stringify(value));return true;}catch(e){return false;}}
    };
    window.brickBreakerStandalone=window.DanboBrickBreaker.create({
        mount:document.getElementById('brick-breaker-standalone'),
        storage:storage,
        rules:window.DanboBrickBreakerRules.create(),
        onExit:function(){window.brickBreakerStandalone.showTitle();}
    });
})();
