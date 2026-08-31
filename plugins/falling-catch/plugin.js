(function(){
    'use strict';
    if(!window.DANBO_PLUGIN_HOST){console.warn('[falling-catch] Plugin host missing');return;}

    var scriptUrl=(document.currentScript&&document.currentScript.src)||'';
    var runtimeBase=window.DANBO_FALLING_CATCH_BASE_URL||(scriptUrl?new URL('.',scriptUrl).href:'plugins/falling-catch/');
    var assetVersion='v=0.4.25';
    window.DANBO_FALLING_CATCH_BASE_URL=runtimeBase;

    function ensureStyle(){
        if(document.getElementById('falling-catch-style'))return;
        var link=document.createElement('link');
        link.id='falling-catch-style';link.rel='stylesheet';link.href=runtimeBase+'falling-catch.css?'+assetVersion;
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
        id:'falling-catch',
        version:'0.4.25',
        name:{zhs:'风中取物',zht:'風中取物',ja:'風の中でキャッチ',en:'Catching in the Wind'},
        description:{
            zhs:'移动头顶采集篮接取蛋宝世界的自然落物并避开障碍，在三次机会内完成30秒挑战。',
            zht:'移動頭頂採集籃接取蛋寶世界的自然落物並避開障礙，在三次機會內完成30秒挑戰。',
            ja:'頭上の採集かごで蛋宝世界の自然物を集め、障害物を避ける30秒チャレンジ。',
            en:'Move the overhead field basket, gather DANBO World nature objects and avoid hazards in a 30-second challenge.'
        },
        create:function(ctx){
            ensureStyle();
            if(!window.DanboFallingCatch||!window.DanboFallingCatchRules||!window.DanboFallingCatchLevels){
                console.error('[falling-catch] runtime missing');
                ctx.api.finish({status:'error',reason:'runtime missing'});
                return {destroy:function(){}};
            }
            if(ctx.api&&ctx.api.setTitle)ctx.api.setTitle('Catching in the Wind');
            var opts=ctx.options||{};
            var characterPortrait=null;
            try{
                if(typeof window.DANBO_GET_CHARACTER_PORTRAIT==='function')characterPortrait=window.DANBO_GET_CHARACTER_PORTRAIT(ctx.character&&ctx.character.id);
            }catch(error){console.warn('[falling-catch] selected traveler portrait unavailable',error);}
            var rules=window.DanboFallingCatchRules.create({baseUrl:runtimeBase,assetVersion:assetVersion,forceFallback:!!opts.forceFallback});
            var pluginAudio=window.DanboFallingCatchAudio&&typeof window.DanboFallingCatchAudio.create==='function'?window.DanboFallingCatchAudio.create({assetBase:runtimeBase,assetVersion:assetVersion}):null;
            var game=window.DanboFallingCatch.create({
                mount:ctx.mount,
                rules:rules,
                levels:window.DanboFallingCatchLevels.all(),
                startLevelId:opts.levelId||opts.startLevelId,
                initialScreen:opts.initialScreen,
                character:ctx.character,
                characterPortrait:characterPortrait,
                input:ctx.input||null,
                storage:ctx.storage||null,
                bypassUnlocks:opts.bypassUnlocks===true,
                assetBase:runtimeBase,
                lang:opts.lang||pageLang(),
                seed:opts.seed,
                durationMs:opts.durationMs,
                targetScore:opts.targetScore,
                lives:opts.lives,
                play:function(name){if(pluginAudio&&pluginAudio.play(name))return;if(ctx.api&&ctx.api.play)ctx.api.play(name);},
                onEvent:function(type,payload){
                    if(type==='start'&&ctx.net)ctx.net.send('minigame.startIntent',{pluginId:ctx.pluginId,characterId:ctx.character&&ctx.character.id,mode:'single',rules:'falling-catch-mvp',payload:payload||{}});
                },
                onResult:function(result){
                    if(ctx.net)ctx.net.send('minigame.finishIntent',{pluginId:ctx.pluginId,status:result.status,reason:result.reason,score:result.score,lives:result.lives,remainingMs:result.remainingMs,rulesMode:result.rulesMode,levelId:result.levelId,levelNumber:result.levelNumber,totalLevels:result.totalLevels,hasNextLevel:result.hasNextLevel,unlockedLevel:result.unlockedLevel,maxUnlockedLevel:result.maxUnlockedLevel,bestChain:result.bestChain,comboBonus:result.comboBonus});
                },
                onExit:function(result){ctx.api.finish(result||{status:'exit'});}
            });
            return {
                update:function(){},
                destroy:function(){if(game&&game.destroy)game.destroy();if(pluginAudio&&pluginAudio.destroy)pluginAudio.destroy();}
            };
        }
    });
})();
