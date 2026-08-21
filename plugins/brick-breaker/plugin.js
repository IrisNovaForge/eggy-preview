(function(){
    'use strict';
    if(!window.DANBO_PLUGIN_HOST){console.warn('[brick-breaker] Plugin host missing');return;}

    var scriptUrl=(document.currentScript&&document.currentScript.src)||'';
    var runtimeBase=window.DANBO_BRICK_BREAKER_BASE_URL||(scriptUrl?new URL('.',scriptUrl).href:'plugins/brick-breaker/');
    var pluginAssetVersion='v=20260821.25';
    window.DANBO_BRICK_BREAKER_BASE_URL=runtimeBase;

    function ensureStyle(){
        if(document.getElementById('brick-breaker-style'))return;
        var link=document.createElement('link');link.id='brick-breaker-style';link.rel='stylesheet';
        link.href=runtimeBase+'brick-breaker.css?'+pluginAssetVersion;
        document.head.appendChild(link);
    }
    function pageLang(){
        var lang=(document.documentElement.lang||navigator.language||'en').toLowerCase();
        if(lang.indexOf('zh-tw')===0||lang.indexOf('zh-hk')===0||lang.indexOf('zh-hant')===0)return 'zht';
        if(lang.indexOf('zh')===0)return 'zhs';
        if(lang.indexOf('ja')===0)return 'ja';
        return 'en';
    }

    window.DANBO_PLUGIN_HOST.register({
        id:'brick-breaker',
        version:'0.8.0',
        name:{zhs:'星光弹球工坊',zht:'星光彈球工坊',ja:'星明かりのブロック工房',en:'Starlight Block Workshop'},
        description:{
            zhs:'原创视觉的基础打砖块小游戏。移动挡板，让光球清理全部彩色方块。',
            zht:'原創視覺的基礎打磚塊小遊戲。移動擋板，讓光球清理全部彩色方塊。',
            ja:'オリジナル表現の基本ブロック崩し。パドルで光のボールを導き、カラーブロックを消そう。',
            en:'An original presentation of the classic paddle, ball and block-clearing idea.'
        },
        create:function(ctx){
            ensureStyle();
            if(!window.DanboBrickBreaker||!window.DanboBrickBreakerRules){
                console.error('[brick-breaker] runtime missing');
                ctx.api.finish({status:'error',reason:'runtime missing'});
                return {destroy:function(){}};
            }
            if(ctx.api&&ctx.api.setTitle)ctx.api.setTitle('Starlight Block Workshop');
            if(ctx.net)ctx.net.send('minigame.ready',{pluginId:ctx.pluginId,characterId:ctx.character&&ctx.character.id});
            var characterPortrait=null;
            try{
                if(typeof window.DANBO_GET_CHARACTER_PORTRAIT==='function')characterPortrait=window.DANBO_GET_CHARACTER_PORTRAIT(ctx.character&&ctx.character.id);
            }catch(error){console.warn('[brick-breaker] selected character portrait unavailable',error);}
            var game=window.DanboBrickBreaker.create({
                mount:ctx.mount,
                character:ctx.character,
                characterPortrait:characterPortrait,
                rules:window.DanboBrickBreakerRules.create(),
                storage:ctx.storage,
                lang:(ctx.options&&ctx.options.lang)||pageLang(),
                onEvent:function(type,payload){
                    if(type==='start'&&ctx.net)ctx.net.send('minigame.startIntent',{pluginId:ctx.pluginId,characterId:ctx.character&&ctx.character.id,mode:'single',rules:'basic',payload:payload||{}});
                },
                onResult:function(result){
                    if(ctx.net)ctx.net.send('minigame.finishIntent',{pluginId:ctx.pluginId,score:result.score,finished:result.status==='finished',reason:result.status,time:result.time,remaining:result.remaining});
                },
                onExit:function(result){ctx.api.finish(result||{status:'exit'});}
            });
            return {
                update:function(){},
                destroy:function(){if(game&&game.destroy)game.destroy();}
            };
        }
    });
})();
