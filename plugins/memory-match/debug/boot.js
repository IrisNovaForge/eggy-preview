(function(){
    'use strict';
    var mount=document.getElementById('memory-match-debug');
    var params=new URLSearchParams(location.search);
    var requestedLevel=Math.max(1,Math.min(4,Number(params.get('level'))||1));
    var targetOverrides={};if(params.has('target'))targetOverrides[requestedLevel]=Math.max(.1,Number(params.get('target'))||1);
    window.DanboMemoryMatchWasm.load('../wasm/danbo_memory_match.wasm?v=20260822.3').then(function(wasm){
        window.memoryMatchDebugGame=window.DanboMemoryMatch.create({
            mount:mount,assetBase:'../',rules:window.DanboMemoryMatchRules.create({wasm:wasm}),
            autoStart:params.get('direct')==='1',startLevel:requestedLevel,unlockAll:params.get('unlock')==='1'||params.has('level'),
            seed:params.has('seed')?Number(params.get('seed')):undefined,targetSecondsByLevel:targetOverrides
        });
    });
})();
