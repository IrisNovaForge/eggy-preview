(function(){
    'use strict';
    var externalBases=window.DANBO_PLUGIN_ASSET_BASES||{};
    var brickBreakerBase=String(externalBases['brick-breaker']||'https://irisnovaforge.github.io/eggy-preview/plugins/brick-breaker/');
    if(brickBreakerBase.charAt(brickBreakerBase.length-1)!=='/')brickBreakerBase+='/';
    var brickBreakerAssetVersion='v=20260821.16';
    function brickBreakerAsset(file){return brickBreakerBase+file+'?'+brickBreakerAssetVersion;}
    window.DANBO_PLUGIN_MANIFEST=[
        {
            id:'legacy-race',
            name:'经典竞速赛道',
            version:'0.2.0',
            enabled:true,
            scripts:['plugins/legacy-race/race-core.js','plugins/legacy-race/race-flow.js','plugins/legacy-race/plugin.js'],
            networkReady:true,
            legacyAdapter:false,
            description:'竞速赛道插件：核心赛道构建代码位于本插件目录，入口通过 DANBO_PLUGIN_HOST 启动。'
        },
        {
            id:'legacy-platformer',
            name:'探索之门',
            version:'0.2.0',
            enabled:true,
            scripts:['plugins/legacy-platformer/platformer-core.js','plugins/legacy-platformer/plugin.js'],
            networkReady:true,
            legacyAdapter:false,
            description:'横版平台关插件：核心关卡代码位于本插件目录，入口通过 DANBO_PLUGIN_HOST 启动。'
        },
        {
            id:'rocket-road',
            name:{zhs:'风迹赛道',zht:'風跡賽道',ja:'風のコース',en:'Wind Course'},
            version:'0.1.3',
            enabled:true,
            entranceScript:'plugins/rocket-road/entrance.js',
            scripts:['plugins/rocket-road/rocket-road-core.js','plugins/rocket-road/plugin.js'],
            networkReady:true,
            legacyAdapter:false,
            description:{
                zhs:'风迹赛道原创竞速小游戏：3D画面、2D俯视路线玩法和独立WASM规则模块。',
                zht:'風跡賽道原創競速小遊戲：3D畫面、2D俯視路線玩法和獨立WASM規則模組。',
                ja:'「風のコース」は、3D表現、2D俯瞰ルート走行、独立したWASMルールモジュールを備えたオリジナルレースミニゲームです。',
                en:'Wind Course is an original racing minigame with 3D presentation, 2D top-down route gameplay, and an independent WASM rules module.'
            }
        },
        {
            id:'brick-breaker',
            name:{zhs:'星光弹球工坊',zht:'星光彈球工坊',ja:'星明かりのブロック工房',en:'Starlight Block Workshop'},
            version:'0.5.2',
            enabled:true,
            entranceScript:brickBreakerAsset('entrance.js'),
            scripts:[brickBreakerAsset('brick-breaker-wasm.js'),brickBreakerAsset('brick-breaker-rules.js'),brickBreakerAsset('brick-breaker-character.js'),brickBreakerAsset('brick-breaker-core.js'),brickBreakerAsset('plugin.js')],
            networkReady:true,
            legacyAdapter:false,
            description:{
                zhs:'原创视觉的通用基础打砖块小游戏。',
                zht:'原創視覺的通用基礎打磚塊小遊戲。',
                ja:'オリジナル表現の基本ブロック崩しミニゲーム。',
                en:'A generic brick-breaker minigame with an original project-native presentation.'
            }
        },
        {
            id:'ability-card',
            name:'角色能力卡测试',
            version:'0.1.0',
            enabled:true,
            script:'plugins/ability-card/plugin.js',
            networkReady:true,
            devOnly:true,
            description:'示例小游戏插件：只接收当前角色编号、名字、能力和基础数值，并通过房间 API 发送意图。'
        }
    ];
    if(window.DANBO_PLUGIN_HOST&&window.DANBO_PLUGIN_HOST.setManifest){
        window.DANBO_PLUGIN_HOST.setManifest(window.DANBO_PLUGIN_MANIFEST);
    }
})();
