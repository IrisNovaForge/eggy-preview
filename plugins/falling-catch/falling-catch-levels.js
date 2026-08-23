(function(){
    'use strict';

    var SHARED_RULES=Object.freeze({
        durationMs:30000,
        targetScore:12,
        lives:3
    });
    var HEAD_BASKET_CATCH=Object.freeze({halfWidth:2,topOffset:-2.8,bottomOffset:-.8,mode:'center'});
    var STAGE_ONE_SPAWN=Object.freeze({minX:7,maxX:93,zoneCount:5,minHorizontalGap:12,avoidRepeatZone:true,avoidConsecutiveObstacle:true});
    var STAGE_TWO_AIRFLOW=Object.freeze({
        centerX:50,halfWidth:14,top:14,bottom:46,
        affectedKinds:Object.freeze(['leaf','berry']),liftDuration:.55,liftSpeed:-8,horizontalPush:3.8,
        spawnSideMinX:18,spawnSideMaxX:34,diagonalMinSpeed:10,diagonalMaxSpeed:14
    });
    var STAGE_THREE_CROSSWIND=Object.freeze({
        cueDuration:.8,activeDuration:3,calmDuration:1,
        speed:7.5,maxHorizontalSpeed:12,initialDirection:1
    });

    var LEVELS=[
        {
            id:'breezy-harvest',number:1,status:'playable',mechanics:'base',rules:SHARED_RULES,basketOffsetY:-17.5,targetCatchBox:HEAD_BASKET_CATCH,spawnDistribution:STAGE_ONE_SPAWN,
            name:{zhs:'风野拾集',zht:'風野拾集',ja:'風のフィールド',en:'Breezy Harvest'},
            description:{
                zhs:'带领世界旅人托住采集篮，接住风里落下的叶片、莓果和橡果，同时避开沉重的石块。',
                zht:'帶領世界旅人托住採集籃，接住風裡落下的葉片、莓果和橡果，同時避開沉重的石塊。',
                ja:'世界の旅人と採集かごを動かし、葉や木の実を集めながら重い石をよけよう。',
                en:'Guide a World Traveler holding a woven field basket, collect leaves, berries and acorns, and stay clear of heavy stones.'
            }
        },
        {
            id:'wind-hill-rise',number:2,status:'playable',mechanics:'updraft',rules:SHARED_RULES,basketOffsetY:-17.5,targetCatchBox:HEAD_BASKET_CATCH,airflow:STAGE_TWO_AIRFLOW,
            name:{zhs:'风丘跃起',zht:'風丘躍起',ja:'風丘の上昇',en:'Windhill Rise'},
            description:{zhs:'左右移动头顶采集篮，判断斜向落物的路线；轻盈的自然物进入风丘上升气流后会短暂上浮并改变轨迹。',zht:'左右移動頭頂採集籃，判斷斜向落物的路線；輕盈的自然物進入風丘上升氣流後會短暫上浮並改變軌跡。',ja:'頭上のかごを左右に動かし、斜めに落ちる自然物を集めよう。軽い自然物は上昇気流で一度浮かび、軌道が変わります。',en:'Move the overhead basket left and right to read diagonal paths. Light natural objects briefly rise and change course inside the hill updraft.'}
        },
        {
            id:'crystal-valley-turn',number:3,status:'playable',mechanics:'crosswind',rules:SHARED_RULES,crosswind:STAGE_THREE_CROSSWIND,
            name:{zhs:'晶谷回旋',zht:'晶谷迴旋',ja:'晶谷の旋回',en:'Crystal Valley Turn'},
            description:{zhs:'观察风向预告，在左右交替的周期横风中判断目标物和障碍物不断偏移的落点。',zht:'觀察風向預告，在左右交替的週期橫風中判斷目標物和障礙物不斷偏移的落點。',ja:'風向きの予告を見て、左右交互に吹く横風でずれる落下物と障害物の着地点を読もう。',en:'Watch the direction cue and read the shifting landing points of collectibles and hazards in alternating crosswinds.'}
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
