(function(){
    'use strict';

    var SHARED_RULES=Object.freeze({
        durationMs:30000,
        targetScore:12,
        lives:3
    });
    var HEAD_BASKET_CATCH=Object.freeze({halfWidth:2,topOffset:-2.8,bottomOffset:-.8,mode:'center'});
    function eggshellGlimmer(maxPerRound,minElapsed,cooldown){return Object.freeze({
        kind:'shell-glimmer',maxPerRound:maxPerRound,maxLives:3,
        minElapsed:minElapsed,maxElapsed:26,delayMin:1.5,delayMax:3,urgentDelayMax:1.5,cooldown:cooldown,
        minX:9,maxX:91,safeObstacleGap:16,fallSpeed:18
    });}
    var STAGE_ONE_RECOVERY=eggshellGlimmer(1,6,8);
    var STAGE_TWO_RECOVERY=eggshellGlimmer(2,5,7);
    var STAGE_THREE_RECOVERY=eggshellGlimmer(2,4,6);
    var STAGE_FOUR_RECOVERY=eggshellGlimmer(3,4,5);
    var STAGE_ONE_SPAWN=Object.freeze({minX:7,maxX:93,zoneCount:5,minHorizontalGap:8,maxHorizontalGap:32,avoidRepeatZone:true,avoidConsecutiveObstacle:true});
    var STAGE_THREE_SPAWN=Object.freeze({minX:7,maxX:93,zoneCount:5,minHorizontalGap:8,maxHorizontalGap:32,avoidRepeatZone:true,avoidConsecutiveObstacle:true});
    var STAGE_FOUR_SPAWN=Object.freeze({minX:7,maxX:93,zoneCount:5,minHorizontalGap:8,maxHorizontalGap:32,avoidRepeatZone:true,avoidConsecutiveObstacle:true});
    var STAGE_ONE_OBJECTS=Object.freeze({
        theme:'danbo-eggshell',
        targets:Object.freeze(['verdant-shell-fragment','berryglow-shell-fragment','goldengrain-shell-fragment']),
        obstacle:'dull-hardened-shell',
        visualScales:Object.freeze({leaf:.60,berry:.62,acorn:.58,stone:.58}),
        stoneCollisionRadius:2.05,targetCollisionRadius:1.95
    });
    var SHARED_SMALL_OBJECTS=Object.freeze({
        theme:'danbo-eggshell',
        targets:Object.freeze(['verdant-shell-fragment','berryglow-shell-fragment','goldengrain-shell-fragment']),
        obstacle:'dull-hardened-shell',
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
    function windSprout(maxPerRound,minElapsed,firstLatest,maxElapsed){return Object.freeze({
        kind:'wind-sprout',maxPerRound:maxPerRound,maxCharges:1,
        minElapsed:minElapsed,firstLatest:firstLatest,maxElapsed:maxElapsed,cooldown:8,rescheduleJitter:2,
        minX:9,maxX:91,safeObstacleGap:14,fallSpeed:20,
        jumpDuration:.75,jumpHeight:10,catchBox:HEAD_BASKET_CATCH
    });}
    var STAGE_THREE_JUMP=windSprout(1,7,14,18);
    var STAGE_FOUR_JUMP=windSprout(2,5,10,24);
    function guideItem(kind,name,description){return Object.freeze({kind:kind,name:Object.freeze(name),description:Object.freeze(description)});}
    function itemGuide(items){return Object.freeze(items);}
    var STAGE_ONE_GUIDE=itemGuide([
        guideItem('harvest',{zhs:'蛋壳采样物',zht:'蛋殼採樣物',ja:'卵殻サンプル',en:'Eggshell Samples'},{zhs:'青芽壳片、莓霞壳片与金穗壳片；接住任意一种获得1分。',zht:'青芽殼片、莓霞殼片與金穗殼片；接住任意一種獲得1分。',ja:'青芽・ベリー霞・金穂の殻片。どれを取っても1点。',en:'Verdant, Berryglow and Goldengrain shell fragments; each catch awards 1 point.'}),
        guideItem('stone',{zhs:'黯化硬壳',zht:'黯化硬殼',ja:'くすみ硬殻',en:'Dull Hardened Shell'},{zhs:'碰到后失去1次机会。',zht:'碰到後失去1次機會。',ja:'触れるとチャンスを1回失います。',en:'Touching it removes 1 chance.'}),
        guideItem('glimmer',{zhs:'蛋壳微光',zht:'蛋殼微光',ja:'卵殻の微光',en:'Eggshell Glimmer'},{zhs:'机会不足3次时可能出现；接住恢复1次，本关最多出现1次。',zht:'機會不足3次時可能出現；接住恢復1次，本關最多出現1次。',ja:'チャンスが3未満の時に現れることがあります。取ると1回回復し、このステージでは最大1回。',en:'May appear below 3 chances; catch it to restore 1. Up to 1 can appear in this stage.'})
    ]);
    var STAGE_TWO_GUIDE=itemGuide([
        guideItem('airflow-collectibles',{zhs:'轻盈壳片',zht:'輕盈殼片',ja:'軽い殻片',en:'Light Shell Fragments'},{zhs:'青芽壳片与莓霞壳片；接住获得1分，会被上升气流托起。',zht:'青芽殼片與莓霞殼片；接住獲得1分，會被上升氣流托起。',ja:'青芽とベリー霞の殻片。1点になり、上昇気流で持ち上がります。',en:'Verdant and Berryglow fragments award 1 point and can be lifted by the updraft.'}),
        guideItem('seed',{zhs:'金穗壳片',zht:'金穗殼片',ja:'金穂の殻片',en:'Goldengrain Fragment'},{zhs:'接住获得1分，不受上升气流影响。',zht:'接住獲得1分，不受上升氣流影響。',ja:'取ると1点。上昇気流の影響を受けません。',en:'Catch it for 1 point; it is not affected by the updraft.'}),
        guideItem('stone',{zhs:'黯化硬壳',zht:'黯化硬殼',ja:'くすみ硬殻',en:'Dull Hardened Shell'},{zhs:'碰到后失去1次机会。',zht:'碰到後失去1次機會。',ja:'触れるとチャンスを1回失います。',en:'Touching it removes 1 chance.'}),
        guideItem('glimmer',{zhs:'蛋壳微光',zht:'蛋殼微光',ja:'卵殻の微光',en:'Eggshell Glimmer'},{zhs:'机会不足3次时可能出现；接住恢复1次，本关最多出现2次。',zht:'機會不足3次時可能出現；接住恢復1次，本關最多出現2次。',ja:'チャンスが3未満の時に現れることがあります。取ると1回回復し、最大2回。',en:'May appear below 3 chances; catch it to restore 1. Up to 2 can appear in this stage.'})
    ]);
    var STAGE_THREE_GUIDE=itemGuide([
        guideItem('wind-collectibles',{zhs:'风行壳片',zht:'風行殼片',ja:'風流れの殻片',en:'Windborne Shell Fragments'},{zhs:'青芽壳片、莓霞壳片与金穗壳片均为1分，并会随周期横风产生偏移。',zht:'青芽殼片、莓霞殼片與金穗殼片均為1分，並會隨週期橫風產生偏移。',ja:'3種の殻片は各1点。周期横風で横へ流されます。',en:'All three shell fragments award 1 point and drift with the periodic crosswind.'}),
        guideItem('stone',{zhs:'黯化硬壳',zht:'黯化硬殼',ja:'くすみ硬殻',en:'Dull Hardened Shell'},{zhs:'碰到失去1次机会，也会随横风偏移。',zht:'碰到失去1次機會，也會隨橫風偏移。',ja:'触れるとチャンスを1回失い、横風でも流されます。',en:'Touching it removes 1 chance; it also drifts with the crosswind.'}),
        guideItem('glimmer',{zhs:'蛋壳微光',zht:'蛋殼微光',ja:'卵殻の微光',en:'Eggshell Glimmer'},{zhs:'机会不足3次时可能出现；接住恢复1次，不受横风影响，本关最多出现2次。',zht:'機會不足3次時可能出現；接住恢復1次，不受橫風影響，本關最多出現2次。',ja:'チャンスが3未満の時に現れ、取ると1回回復。横風の影響を受けず、最大2回。',en:'May appear below 3 chances; restores 1, ignores crosswind, and can appear up to 2 times.'}),
        guideItem('sprout',{zhs:'跃风芽',zht:'躍風芽',ja:'跳風の芽',en:'Wind Sprout'},{zhs:'本关最多出现1次；接住可储存1次主动跃起。',zht:'本關最多出現1次；接住可儲存1次主動躍起。',ja:'このステージでは最大1回。取ると手動ジャンプを1回ためられます。',en:'Up to 1 can appear; catching it stores 1 manual leap.'})
    ]);
    var STAGE_FOUR_GUIDE=itemGuide([
        guideItem('combo-collectibles',{zhs:'汇流壳片',zht:'匯流殼片',ja:'合流の殻片',en:'Confluence Shell Fragments'},{zhs:'三种壳片各1分；连续接住3个额外获得1分，并会受到场地气流影响。',zht:'三種殼片各1分；連續接住3個額外獲得1分，並會受到場地氣流影響。',ja:'3種の殻片は各1点。3個連続で追加1点になり、場の気流にも影響されます。',en:'All three fragments award 1 point; every 3-catch chain adds 1 bonus point. Field winds affect them.'}),
        guideItem('stone',{zhs:'黯化硬壳',zht:'黯化硬殼',ja:'くすみ硬殻',en:'Dull Hardened Shell'},{zhs:'碰到失去1次机会，并会随汇流横风偏移。',zht:'碰到失去1次機會，並會隨匯流橫風偏移。',ja:'触れるとチャンスを1回失い、合流する横風でも流されます。',en:'Touching it removes 1 chance, and confluence crosswinds shift it sideways.'}),
        guideItem('glimmer',{zhs:'蛋壳微光',zht:'蛋殼微光',ja:'卵殻の微光',en:'Eggshell Glimmer'},{zhs:'机会不足3次时可能出现；接住恢复1次，不受风影响，本关最多出现3次。',zht:'機會不足3次時可能出現；接住恢復1次，不受風影響，本關最多出現3次。',ja:'チャンスが3未満の時に現れ、取ると1回回復。風の影響を受けず、最大3回。',en:'May appear below 3 chances; restores 1, ignores wind, and can appear up to 3 times.'}),
        guideItem('sprout',{zhs:'跃风芽',zht:'躍風芽',ja:'跳風の芽',en:'Wind Sprout'},{zhs:'本关最多出现2次；每次接住可储存1次主动跃起。',zht:'本關最多出現2次；每次接住可儲存1次主動躍起。',ja:'このステージでは最大2回。取るたびに手動ジャンプを1回ためられます。',en:'Up to 2 can appear; each catch stores 1 manual leap.'})
    ]);

    var LEVELS=[
        {
            id:'breezy-harvest',number:1,status:'playable',mechanics:'base',rules:SHARED_RULES,basketOffsetY:-17.5,targetCatchBox:HEAD_BASKET_CATCH,spawnDistribution:STAGE_ONE_SPAWN,dropTuning:STAGE_ONE_DROPS,objectPresentation:STAGE_ONE_OBJECTS,recovery:STAGE_ONE_RECOVERY,guideItems:STAGE_ONE_GUIDE,
            name:{zhs:'收集',zht:'收集',ja:'収集',en:'Gather'},
            tagline:{zhs:'收集青芽壳片、莓霞壳片与金穗壳片',zht:'收集青芽殼片、莓霞殼片與金穗殼片',ja:'青芽・ベリー霞・金穂の殻片を集めよう',en:'Gather Verdant, Berryglow and Goldengrain shell fragments'},
            titleTheme:'meadow',backgroundTheme:'meadow-field',
            description:{
                zhs:'用头顶采集篮接住青芽壳片、莓霞壳片和金穗壳片，同时避开黯化硬壳。本关没有跃风芽，跃起从第3关开启。',
                zht:'用頭頂採集籃接住青芽殼片、莓霞殼片和金穗殼片，同時避開黯化硬殼。本關沒有躍風芽，躍起從第3關開啟。',
                ja:'頭上の採集かごで三種の殻片を集め、くすみ硬殻をよけよう。このステージに跳風の芽はなく、ジャンプはステージ3から使えます。',
                en:'Catch three kinds of shell fragments and avoid dull hardened shells. No Wind Sprout appears here; leaping begins in Stage 3.'
            }
        },
        {
            id:'wind-hill-rise',number:2,status:'playable',mechanics:'updraft',rules:SHARED_RULES,basketOffsetY:-17.5,targetCatchBox:HEAD_BASKET_CATCH,dropTuning:STAGE_TWO_DROPS,objectPresentation:SHARED_SMALL_OBJECTS,airflow:STAGE_TWO_AIRFLOW,recovery:STAGE_TWO_RECOVERY,guideItems:STAGE_TWO_GUIDE,
            name:{zhs:'跃起',zht:'躍起',ja:'跳躍',en:'Leap'},
            tagline:{zhs:'留意上升气流改变落点',zht:'留意上升氣流改變落點',ja:'上昇気流による着地点の変化を読もう',en:'Read how the updraft changes each landing point'},
            titleTheme:'updraft',backgroundTheme:'wind-hill',
            description:{zhs:'左右移动头顶采集篮，判断斜向落物的路线；轻盈自然物会被上升气流改变轨迹。本关没有跃风芽，跃起从第3关开启。',zht:'左右移動頭頂採集籃，判斷斜向落物的路線；輕盈自然物會被上升氣流改變軌跡。本關沒有躍風芽，躍起從第3關開啟。',ja:'斜めに落ちる自然物と上昇気流で変わる軌道を読もう。このステージに跳風の芽はなく、ジャンプはステージ3から使えます。',en:'Read diagonal paths altered by the updraft. No Wind Sprout appears here; leaping begins in Stage 3.'}
        },
        {
            id:'crystal-valley-turn',number:3,status:'playable',mechanics:'crosswind',rules:SHARED_RULES,spawnDistribution:STAGE_THREE_SPAWN,dropTuning:STAGE_THREE_DROPS,objectPresentation:SHARED_SMALL_OBJECTS,crosswind:STAGE_THREE_CROSSWIND,recovery:STAGE_THREE_RECOVERY,jumpPower:STAGE_THREE_JUMP,guideItems:STAGE_THREE_GUIDE,
            name:{zhs:'回旋',zht:'迴旋',ja:'旋回',en:'Spiral'},
            tagline:{zhs:'观察预告，判断横风方向',zht:'觀察預告，判斷橫風方向',ja:'予告を見て横風の向きを判断しよう',en:'Watch the cue and judge the crosswind direction'},
            titleTheme:'crystal',backgroundTheme:'crystal-valley',
            description:{zhs:'观察周期横风并判断偏移落点。接住低概率出现的跃风芽可储存1次跃起，用↑、W、空格或触屏跃起键主动取得高处落物。',zht:'觀察週期橫風並判斷偏移落點。接住低機率出現的躍風芽可儲存1次躍起，用↑、W、空白鍵或觸屏躍起鍵主動取得高處落物。',ja:'周期横風による着地点のずれを読もう。まれに現れる跳風の芽を集めるとジャンプを1回ためられ、↑・W・Spaceまたはタッチボタンで高い落下物を取りに行けます。',en:'Read the shifting landing points in the periodic crosswind. Catch the rare Wind Sprout to store one leap, then use Up, W, Space or the touch leap button to reach a high drop.'}
        },
        {
            id:'starwind-confluence',number:4,status:'playable',mechanics:'confluence',rules:SHARED_RULES,basketOffsetY:-17.5,targetCatchBox:HEAD_BASKET_CATCH,spawnDistribution:STAGE_FOUR_SPAWN,dropTuning:STAGE_FOUR_DROPS,objectPresentation:SHARED_SMALL_OBJECTS,airflow:STAGE_FOUR_AIRFLOW,crosswind:STAGE_FOUR_CROSSWIND,confluence:STAGE_FOUR_CONFLUENCE,recovery:STAGE_FOUR_RECOVERY,jumpPower:STAGE_FOUR_JUMP,guideItems:STAGE_FOUR_GUIDE,
            name:{zhs:'汇流',zht:'匯流',ja:'合流',en:'Confluence'},
            tagline:{zhs:'连续接取，迎接最终汇流',zht:'連續接取，迎接最終匯流',ja:'連続キャッチで最後の合流へ',en:'Build a catch chain through the final confluence'},
            titleTheme:'starwind',backgroundTheme:'starwind-summit',
            description:{zhs:'在落物、气流和横风汇合的最终挑战中连续接取；每连续接到3个目标物可获得1分奖励。本关最多出现2次跃风芽，每次可储存1次主动跃起。',zht:'在落物、氣流和橫風匯合的最終挑戰中連續接取；每連續接到3個目標物可獲得1分獎勵。本關最多出現2次躍風芽，每次可儲存1次主動躍起。',ja:'落下物・上昇気流・横風が合流する最終チャレンジ。3個連続で1点ボーナス。このステージでは跳風の芽が最大2回現れ、それぞれジャンプを1回ためられます。',en:'Face the final convergence of drops, updrafts and crosswinds. Every three catches awards one bonus point. Up to two Wind Sprouts appear, each storing one manual leap.'}
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
