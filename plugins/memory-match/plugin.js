(function(){
    'use strict';
    if(!window.DANBO_PLUGIN_HOST){console.warn('[memory-match] Plugin host missing');return;}

    var scriptUrl=(document.currentScript&&document.currentScript.src)||'';
    var runtimeBase=window.DANBO_MEMORY_MATCH_BASE_URL||(scriptUrl?new URL('.',scriptUrl).href:'plugins/memory-match/');
    var assetVersion='v=20260822.2';
    window.DANBO_MEMORY_MATCH_BASE_URL=runtimeBase;

    function ensureStyle(){
        if(document.getElementById('memory-match-style'))return;
        var link=document.createElement('link');link.id='memory-match-style';link.rel='stylesheet';link.href=runtimeBase+'memory-match.css?'+assetVersion;document.head.appendChild(link);
    }

    window.DANBO_PLUGIN_HOST.register({
        id:'memory-match',version:'0.2.0',
        name:{zhs:'蛋宝记忆配对',zht:'蛋寶記憶配對',ja:'ダンボのメモリーペア',en:'DANBO Memory Pairs'},
        description:{zhs:'翻开两张记忆牌，找出全部相同的旅人。',zht:'翻開兩張記憶牌，找出全部相同的旅人。',ja:'2枚ずつめくり、同じ旅人をすべて見つけよう。',en:'Reveal two memory tiles at a time and match every traveler pair.'},
        create:function(ctx){
            ensureStyle();var game=null,destroyed=false;
            if(ctx.api&&ctx.api.setTitle)ctx.api.setTitle('DANBO Memory Pairs');
            window.DanboMemoryMatchWasm.load(runtimeBase+'wasm/danbo_memory_match.wasm?'+assetVersion).then(function(wasm){
                if(destroyed)return;
                game=window.DanboMemoryMatch.create({
                    mount:ctx.mount,assetBase:runtimeBase,rules:window.DanboMemoryMatchRules.create({wasm:wasm}),storage:ctx.storage,
                    onResult:function(result){if(ctx.net)ctx.net.send('minigame.finishIntent',{pluginId:ctx.pluginId,status:result.status,level:result.level,attempts:result.attempts,pairs:result.pairs});},
                    onExit:function(result){ctx.api.finish(result||{status:'exit'});}
                });
            });
            return {update:function(){},destroy:function(){destroyed=true;if(game)game.destroy();}};
        }
    });
})();
