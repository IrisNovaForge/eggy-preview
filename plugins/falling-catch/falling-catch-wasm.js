(function(){
    'use strict';

    var ownScript=(document.currentScript&&document.currentScript.src)||'';
    var ownBase=ownScript?new URL('.',ownScript).href:'plugins/falling-catch/';
    var cached=null;

    function instantiate(url){
        if(typeof WebAssembly==='undefined')return Promise.reject(new Error('WebAssembly unavailable'));
        if(typeof WebAssembly.instantiateStreaming==='function'){
            return WebAssembly.instantiateStreaming(fetch(url),{}).catch(function(){
                return fetch(url).then(function(response){
                    if(!response.ok)throw new Error('WASM request failed: '+response.status);
                    return response.arrayBuffer();
                }).then(function(bytes){return WebAssembly.instantiate(bytes,{});});
            });
        }
        return fetch(url).then(function(response){
            if(!response.ok)throw new Error('WASM request failed: '+response.status);
            return response.arrayBuffer();
        }).then(function(bytes){return WebAssembly.instantiate(bytes,{});});
    }

    function load(options){
        options=options||{};
        if(options.forceFallback)return Promise.reject(new Error('WASM fallback forced for testing'));
        if(cached)return cached;
        var base=options.baseUrl||window.DANBO_FALLING_CATCH_BASE_URL||ownBase;
        if(base.charAt(base.length-1)!=='/')base+='/';
        var version=options.assetVersion||'v=0.4.23';
        cached=instantiate(base+'wasm/danbo_falling_catch.wasm?'+version).then(function(result){
            var exports=result.instance?result.instance.exports:result.exports;
            if(!exports||exports.danbo_falling_catch_abi_version()!==1||typeof exports.danbo_falling_catch_restore!=='function')throw new Error('Unsupported falling-catch WASM ABI');
            return exports;
        }).catch(function(error){
            cached=null;
            throw error;
        });
        return cached;
    }

    window.DanboFallingCatchWasm={load:load,baseUrl:ownBase};
})();
