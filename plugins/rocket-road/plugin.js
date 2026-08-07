(function(){
    'use strict';
    if(!window.DANBO_PLUGIN_HOST){console.warn('[rocket-road] Plugin host missing');return;}

    window.DANBO_PLUGIN_HOST.register({
        id:'rocket-road',
        version:'0.1.3',
        name:{zhs:'风迹赛道',zht:'風跡賽道',ja:'風のコース',en:'Wind Course'},
        description:{
            zhs:'原创竞速小游戏：3D画面、2D俯视路线玩法和独立WASM规则模块。',
            zht:'原創競速小遊戲：3D畫面、2D俯視路線玩法和獨立WASM規則模組。',
            ja:'3D表現、2D俯瞰ルート走行、独立したWASMルールモジュールを備えたオリジナルレースミニゲーム。',
            en:'An original racing minigame with 3D presentation, 2D top-down route gameplay, and an independent WASM rules module.'
        },
        create:function(ctx){
            if(ctx.net)ctx.net.send('minigame.startIntent',{pluginId:ctx.pluginId,characterId:ctx.character.id,screen:'title'});
            if(window.DanboRocketRoad&&typeof window.DanboRocketRoad.start==='function'){
                var game=window.DanboRocketRoad.start(ctx);
                return {
                    update:function(){},
                    destroy:function(result){
                        if(ctx.net)ctx.net.send('minigame.stopIntent',{pluginId:ctx.pluginId,result:result||{}});
                        if(game&&typeof game.dispose==='function')game.dispose();
                    }
                };
            }
            console.error('[rocket-road] runtime missing');
            ctx.api.finish({status:'error',reason:'rocket runtime missing'});
            return {destroy:function(){}};
        }
    });
})();
