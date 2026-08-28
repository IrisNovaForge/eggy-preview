(function(){
    'use strict';
    if(!window.DANBO_PLUGIN_HOST){console.warn('[cloud-basket] Plugin host missing');return;}

    var scriptUrl=(document.currentScript&&document.currentScript.src)||'';
    var runtimeBase=window.DANBO_CLOUD_BASKET_BASE_URL||(scriptUrl?new URL('.',scriptUrl).href:'plugins/cloud-basket/');
    var assetVersion='v=20260828.1';
    window.DANBO_CLOUD_BASKET_BASE_URL=runtimeBase;

    function ensureStyle(){
        if(document.getElementById('cloud-basket-style'))return;
        var link=document.createElement('link');link.id='cloud-basket-style';link.rel='stylesheet';link.href=runtimeBase+'cloud-basket.css?'+assetVersion;document.head.appendChild(link);
    }

    window.DANBO_PLUGIN_HOST.register({
        id:'cloud-basket',version:'0.3.0',
        name:{zhs:'蛋壳匹配',zht:'蛋殼匹配',ja:'たまご殻合わせ',en:'Eggshell Match'},
        description:{zhs:'第一关：观察颜色和印记，找出与目标完全相同的蛋壳。',zht:'第一關：觀察顏色和印記，找出與目標完全相同的蛋殼。',ja:'ステージ1：色と印を見て、目標と同じたまご殻を選ぼう。',en:'Level 1: compare color and mark to find the eggshell identical to the target.'},
        create:function(ctx){
            ensureStyle();
            if(ctx.api&&ctx.api.setTitle)ctx.api.setTitle('蛋壳匹配');
            var game=window.DanboCloudBasket.create({
                mount:ctx.mount,
                character:ctx.character,
                rules:window.DanboCloudBasketRules.create({durationSeconds:45}),
                onResult:function(result){
                    if(ctx.net)ctx.net.send('minigame.finishIntent',{pluginId:ctx.pluginId,status:result.status,level:1,correct:result.correct,wrong:result.wrong,answered:result.answered,accuracy:result.accuracy,durationSeconds:result.durationSeconds});
                },
                onExit:function(result){ctx.api.finish(result||{status:'exit'});}
            });
            return {update:function(){},destroy:function(){if(game)game.destroy();}};
        }
    });
})();
