(function(){
    'use strict';

    var SHARED_RULES=Object.freeze({
        durationMs:30000,
        targetScore:12,
        lives:3
    });

    var LEVELS=[
        {
            id:'breezy-harvest',number:1,status:'playable',mechanics:'base',rules:SHARED_RULES,
            name:{zhs:'风野拾集',zht:'風野拾集',ja:'風のフィールド',en:'Breezy Harvest'},
            description:{
                zhs:'带领世界旅人托住采集篮，接住风里落下的叶片、莓果和橡果，同时避开沉重的石块。',
                zht:'帶領世界旅人托住採集籃，接住風裡落下的葉片、莓果和橡果，同時避開沉重的石塊。',
                ja:'世界の旅人と採集かごを動かし、葉や木の実を集めながら重い石をよけよう。',
                en:'Guide a World Traveler holding a woven field basket, collect leaves, berries and acorns, and stay clear of heavy stones.'
            }
        },
        {
            id:'wind-hill-rise',number:2,status:'framework',mechanics:'base',rules:SHARED_RULES,
            name:{zhs:'风丘跃起',zht:'風丘躍起',ja:'風丘の上昇',en:'Windhill Rise'},
            description:{zhs:'第二关框架已就绪，当前暂用第一关基础规则进行顺序切换测试。',zht:'第二關框架已就緒，目前暫用第一關基礎規則進行順序切換測試。',ja:'第2ステージの枠組みです。現在は第1ステージの基本ルールで切替を確認します。',en:'Stage 2 framework is ready and temporarily uses the Stage 1 base rules for sequence testing.'}
        },
        {
            id:'crystal-valley-turn',number:3,status:'framework',mechanics:'base',rules:SHARED_RULES,
            name:{zhs:'晶谷回旋',zht:'晶谷迴旋',ja:'晶谷の旋回',en:'Crystal Valley Turn'},
            description:{zhs:'第三关框架已就绪，当前暂用第一关基础规则进行顺序切换测试。',zht:'第三關框架已就緒，目前暫用第一關基礎規則進行順序切換測試。',ja:'第3ステージの枠組みです。現在は第1ステージの基本ルールで切替を確認します。',en:'Stage 3 framework is ready and temporarily uses the Stage 1 base rules for sequence testing.'}
        },
        {
            id:'starwind-confluence',number:4,status:'framework',mechanics:'base',rules:SHARED_RULES,
            name:{zhs:'星风汇流',zht:'星風匯流',ja:'星風の合流',en:'Starwind Confluence'},
            description:{zhs:'第四关框架已就绪，当前暂用第一关基础规则进行顺序切换测试。',zht:'第四關框架已就緒，目前暫用第一關基礎規則進行順序切換測試。',ja:'第4ステージの枠組みです。現在は第1ステージの基本ルールで切替を確認します。',en:'Stage 4 framework is ready and temporarily uses the Stage 1 base rules for sequence testing.'}
        }
    ];

    for(var i=0;i<LEVELS.length;i++)Object.freeze(LEVELS[i]);
    Object.freeze(LEVELS);

    function all(){return LEVELS.slice();}
    function indexOf(reference){
        if(reference===undefined||reference===null||reference==='')return 0;
        var numeric=Number(reference);
        if(Number.isFinite(numeric)&&Math.floor(numeric)===numeric&&numeric>=1&&numeric<=LEVELS.length)return numeric-1;
        var id=String(reference);
        for(var i=0;i<LEVELS.length;i++)if(LEVELS[i].id===id)return i;
        return 0;
    }
    function get(reference){return LEVELS[indexOf(reference)];}
    function next(reference){var index=indexOf(reference)+1;return index<LEVELS.length?LEVELS[index]:null;}
    function localize(value,lang){return value&&(value[lang]||value.en||value.zhs)||'';}

    window.DanboFallingCatchLevels={all:all,get:get,next:next,indexOf:indexOf,localize:localize,count:LEVELS.length};
})();
