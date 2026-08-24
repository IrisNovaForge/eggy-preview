(function(){
    'use strict';

    var SHARED_RULES=Object.freeze({
        durationMs:30000,
        targetScore:12,
        lives:3
    });
    var HEAD_BASKET_CATCH=Object.freeze({halfWidth:2,topOffset:-2.8,bottomOffset:-.8,mode:'center'});
    var EGG_SHELL_GLIMMER=Object.freeze({
        kind:'shell-glimmer',maxPerRound:1,maxLives:3,
        minElapsed:8,maxElapsed:22,delayMin:2,delayMax:4,
        minX:9,maxX:91,safeObstacleGap:16,fallSpeed:18
    });
    var STAGE_ONE_SPAWN=Object.freeze({minX:7,maxX:93,zoneCount:5,minHorizontalGap:8,maxHorizontalGap:32,avoidRepeatZone:true,avoidConsecutiveObstacle:true});
    var STAGE_THREE_SPAWN=Object.freeze({minX:7,maxX:93,zoneCount:5,minHorizontalGap:8,maxHorizontalGap:32,avoidRepeatZone:true,avoidConsecutiveObstacle:true});
    var STAGE_FOUR_SPAWN=Object.freeze({minX:7,maxX:93,zoneCount:5,minHorizontalGap:8,maxHorizontalGap:32,avoidRepeatZone:true,avoidConsecutiveObstacle:true});
    var STAGE_ONE_OBJECTS=Object.freeze({
        theme:'danbo-meadow',
        targets:Object.freeze(['wind-herb-leaf','berry-grove-berry','golden-grain-seed']),
        obstacle:'moss-weathered-stone',
        visualScales:Object.freeze({leaf:.60,berry:.62,acorn:.58,stone:.58}),
        stoneCollisionRadius:2.05,targetCollisionRadius:1.95
    });
    var SHARED_SMALL_OBJECTS=Object.freeze({
        visualScales:Object.freeze({leaf:.66,berry:.66,acorn:.64,stone:.64}),
        stoneCollisionRadius:2.2,targetCollisionRadius:2.15
    });
    var STAGE_ONE_DROPS=Object.freeze({fallSpeedMin:22,fallSpeedMax:24,spawnDelayMin:.76,spawnDelayMax:.90,baseDriftMax:1.5,obstacleRate:.28,avoidConsecutiveObstacle:true});
    var STAGE_TWO_DROPS=Object.freeze({fallSpeedMin:24,fallSpeedMax:26,spawnDelayMin:.67,spawnDelayMax:.79,baseDriftMax:1.5,obstacleRate:.28,avoidConsecutiveObstacle:true});
    var STAGE_THREE_DROPS=Object.freeze({fallSpeedMin:26,fallSpeedMax:28,spawnDelayMin:.59,spawnDelayMax:.69,baseDriftMax:1.5,obstacleRate:.28,avoidConsecutiveObstacle:true});
    var STAGE_FOUR_DROPS=Object.freeze({fallSpeedMin:28,fallSpeedMax:30,spawnDelayMin:.52,spawnDelayMax:.62,baseDriftMax:1.5,obstacleRate:.28,avoidConsecutiveObstacle:true});
    var STAGE_TWO_AIRFLOW=Object.freeze({
        centerX:50,halfWidth:14,top:14,bottom:46,
        affectedKinds:Object.freeze(['leaf','berry']),liftDuration:.55,liftSpeed:-8,horizontalPush:3.8,
        sideSpawn:true,spawnSideMinX:18,spawnSideMaxX:34,sideGroupSize:2,diagonalMinSpeed:10,diagonalMaxSpeed:14
    });
    var STAGE_THREE_CROSSWIND=Object.freeze({
        cueDuration:.8,activeDuration:3,calmDuration:1,
        speed:7.5,maxHorizontalSpeed:12,initialDirection:1
    });
    var STAGE_FOUR_AIRFLOW=Object.freeze({
        centerX:50,halfWidth:14,top:14,bottom:46,
        affectedKinds:Object.freeze(['leaf','berry']),liftDuration:.5,liftSpeed:-7,horizontalPush:3.2,
        sideSpawn:false
    });
    var STAGE_FOUR_CROSSWIND=Object.freeze({
        cueDuration:.8,activeDuration:3,calmDuration:1,
        speed:7,maxHorizontalSpeed:11,initialDirection:1
    });
    var STAGE_FOUR_CONFLUENCE=Object.freeze({
        gatherDuration:4,alternateDuration:6,comboEvery:3,comboBonus:1
    });

    var LEVELS=[
        {
            id:'breezy-harvest',number:1,status:'playable',mechanics:'base',rules:SHARED_RULES,basketOffsetY:-17.5,targetCatchBox:HEAD_BASKET_CATCH,spawnDistribution:STAGE_ONE_SPAWN,dropTuning:STAGE_ONE_DROPS,objectPresentation:STAGE_ONE_OBJECTS,recovery:EGG_SHELL_GLIMMER,
            name:{zhs:'风野拾集',zht:'風野拾集',ja:'風のフィールド',en:'Breezy Harvest'},
            tagline:{zhs:'收集风香草叶、莓林莓与金穗籽',zht:'收集風香草葉、莓林莓與金穗籽',ja:'風香草の葉、森ベリー、金穂の種を集めよう',en:'Gather wind herbs, grove berries and golden grain seeds'},
            titleTheme:'meadow',
            description:{
                zhs:'带领世界旅人托住采集篮，接住风香草叶、莓林莓和金穗籽，同时避开苔痕风化石。',
                zht:'帶領世界旅人托住採集籃，接住風香草葉、莓林莓和金穗籽，同時避開苔痕風化石。',
                ja:'世界の旅人と採集かごを動かし、風香草の葉、森ベリー、金穂の種を集めながら苔むした風化石をよけよう。',
                en:'Guide a World Traveler holding a woven field basket, gather wind herbs, grove berries and golden grain seeds, and avoid mossy weathered stones.'
            }
        },
        {
            id:'wind-hill-rise',number:2,status:'playable',mechanics:'updraft',rules:SHARED_RULES,basketOffsetY:-17.5,targetCatchBox:HEAD_BASKET_CATCH,dropTuning:STAGE_TWO_DROPS,objectPresentation:SHARED_SMALL_OBJECTS,airflow:STAGE_TWO_AIRFLOW,recovery:EGG_SHELL_GLIMMER,
            name:{zhs:'风丘跃起',zht:'風丘躍起',ja:'風丘の上昇',en:'Windhill Rise'},
            tagline:{zhs:'留意上升气流改变落点',zht:'留意上升氣流改變落點',ja:'上昇気流による着地点の変化を読もう',en:'Read how the updraft changes each landing point'},
            titleTheme:'updraft',
            description:{zhs:'左右移动头顶采集篮，判断斜向落物的路线；轻盈的自然物进入风丘上升气流后会短暂上浮并改变轨迹。',zht:'左右移動頭頂採集籃，判斷斜向落物的路線；輕盈的自然物進入風丘上升氣流後會短暫上浮並改變軌跡。',ja:'頭上のかごを左右に動かし、斜めに落ちる自然物を集めよう。軽い自然物は上昇気流で一度浮かび、軌道が変わります。',en:'Move the overhead basket left and right to read diagonal paths. Light natural objects briefly rise and change course inside the hill updraft.'}
        },
        {
            id:'crystal-valley-turn',number:3,status:'playable',mechanics:'crosswind',rules:SHARED_RULES,spawnDistribution:STAGE_THREE_SPAWN,dropTuning:STAGE_THREE_DROPS,objectPresentation:SHARED_SMALL_OBJECTS,crosswind:STAGE_THREE_CROSSWIND,recovery:EGG_SHELL_GLIMMER,
            name:{zhs:'晶谷回旋',zht:'晶谷迴旋',ja:'晶谷の旋回',en:'Crystal Valley Turn'},
            tagline:{zhs:'观察预告，判断横风方向',zht:'觀察預告，判斷橫風方向',ja:'予告を見て横風の向きを判断しよう',en:'Watch the cue and judge the crosswind direction'},
            titleTheme:'crystal',
            description:{zhs:'观察风向预告，在左右交替的周期横风中判断目标物和障碍物不断偏移的落点。',zht:'觀察風向預告，在左右交替的週期橫風中判斷目標物和障礙物不斷偏移的落點。',ja:'風向きの予告を見て、左右交互に吹く横風でずれる落下物と障害物の着地点を読もう。',en:'Watch the direction cue and read the shifting landing points of collectibles and hazards in alternating crosswinds.'}
        },
        {
            id:'starwind-confluence',number:4,status:'playable',mechanics:'confluence',rules:SHARED_RULES,basketOffsetY:-17.5,targetCatchBox:HEAD_BASKET_CATCH,spawnDistribution:STAGE_FOUR_SPAWN,dropTuning:STAGE_FOUR_DROPS,objectPresentation:SHARED_SMALL_OBJECTS,airflow:STAGE_FOUR_AIRFLOW,crosswind:STAGE_FOUR_CROSSWIND,confluence:STAGE_FOUR_CONFLUENCE,recovery:EGG_SHELL_GLIMMER,
            name:{zhs:'星风汇流',zht:'星風匯流',ja:'星風の合流',en:'Starwind Confluence'},
            tagline:{zhs:'连续接取，迎接最终汇流',zht:'連續接取，迎接最終匯流',ja:'連続キャッチで最後の合流へ',en:'Build a catch chain through the final confluence'},
            titleTheme:'starwind',
            description:{zhs:'在分散落物、上升气流和周期横风逐步汇合的最终挑战中连续接取；每连续接到3个目标物可获得1分奖励。',zht:'在分散落物、上升氣流和週期橫風逐步匯合的最終挑戰中連續接取；每連續接到3個目標物可獲得1分獎勵。',ja:'分散落下、上昇気流、周期横風が段階的に合流する最終チャレンジ。3個連続で集めるたびに1点ボーナス。',en:'Face a final challenge where distributed drops, updrafts and periodic crosswinds converge in stages. Every three catches in a row awards one bonus point.'}
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
