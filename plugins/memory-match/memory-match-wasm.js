(function(global){
    'use strict';
    var cached=null;

    function wrap(exports){
        return {
            seed:function(value){exports.mm_seed((Number(value)||0)>>>0);},
            nextU32:function(){return exports.mm_next_u32()>>>0;},
            samePair:function(a,b){return !!exports.mm_same_pair(a|0,b|0);},
            isComplete:function(matched,total){return !!exports.mm_is_complete(matched|0,total|0);}
        };
    }

    async function instantiate(url){
        var response=await fetch(url,{cache:'no-store'});
        if(!response.ok)throw new Error('WASM request failed: '+response.status);
        if(WebAssembly.instantiateStreaming){
            try{return (await WebAssembly.instantiateStreaming(response.clone(),{})).instance.exports;}
            catch(error){/* Servers without application/wasm use the buffer fallback below. */}
        }
        return (await WebAssembly.instantiate(await response.arrayBuffer(),{})).instance.exports;
    }

    global.DanboMemoryMatchWasm={
        load:function(url){
            if(!cached)cached=instantiate(url).then(wrap).catch(function(error){
                console.warn('[memory-match] WASM unavailable; using JS fallback',error);
                return null;
            });
            return cached;
        },
        resetForTest:function(){cached=null;}
    };
})(window);

