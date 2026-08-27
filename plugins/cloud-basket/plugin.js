(function(){
    'use strict';
    if(!window.DANBO_PLUGIN_HOST){console.warn('[cloud-basket] Plugin host missing');return;}

    var scriptUrl=(document.currentScript&&document.currentScript.src)||'';
    var runtimeBase=window.DANBO_CLOUD_BASKET_BASE_URL||(scriptUrl?new URL('.',scriptUrl).href:'plugins/cloud-basket/');
    var assetVersion='v=20260827.2';
    window.DANBO_CLOUD_BASKET_BASE_URL=runtimeBase;

    function ensureStyle(){
        if(document.getElementById('cloud-basket-style'))return;
        var link=document.createElement('link');link.id='cloud-basket-style';link.rel='stylesheet';link.href=runtimeBase+'cloud-basket.css?'+assetVersion;document.head.appendChild(link);
    }

    window.DANBO_PLUGIN_HOST.register({
        id:'cloud-basket',version:'0.2.2',
        name:{zhs:'梦光验货',zht:'夢光驗貨',ja:'夢光チェック',en:'Dreamlight Inspection'},
        description:{zhs:'观察目标特征，点击三个候选中完全相同的梦光素材。',zht:'觀察目標特徵，點擊三個候選中完全相同的夢光素材。',ja:'目標の特徴を見て、同じ夢光素材を選ぼう。',en:'Observe the target and select the identical dreamlight material.'},
        create:function(ctx){
            ensureStyle();
            if(ctx.api&&ctx.api.setTitle)ctx.api.setTitle('梦光验货');
            var game=window.DanboCloudBasket.create({
                mount:ctx.mount,
                character:ctx.character,
                rules:window.DanboCloudBasketRules.create({durationSeconds:45}),
                onResult:function(result){
                    if(ctx.net)ctx.net.send('minigame.finishIntent',{pluginId:ctx.pluginId,status:result.status,correct:result.correct,wrong:result.wrong,answered:result.answered,accuracy:result.accuracy,durationSeconds:result.durationSeconds});
                },
                onExit:function(result){ctx.api.finish(result||{status:'exit'});}
            });
            return {update:function(){},destroy:function(){if(game)game.destroy();}};
        }
    });
})();
