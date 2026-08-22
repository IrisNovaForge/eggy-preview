(function(){
    'use strict';
    var mount=document.getElementById('memory-match-debug');
    var params=new URLSearchParams(location.search);
    window.DanboMemoryMatchWasm.load('../wasm/danbo_memory_match.wasm?v=20260822.1').then(function(wasm){
        window.memoryMatchDebugGame=window.DanboMemoryMatch.create({
            mount:mount,assetBase:'../',rules:window.DanboMemoryMatchRules.create({wasm:wasm}),pairCount:8,
            autoStart:params.get('direct')==='1',seed:params.has('seed')?Number(params.get('seed')):undefined
        });
    });
})();
