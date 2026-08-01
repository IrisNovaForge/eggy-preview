// ============================================================
//  data-characters.js — Character stats & move parameters
// ============================================================

// ---- Physics constants ----
var CHAR_PHYSICS={
    GRAVITY:0.018, JUMP_FORCE:0.28, MOVE_ACCEL:0.016, MAX_SPEED:0.22, FRICTION:0.92
};

// ---- Stun system ----
var STUN_CONFIG={
    threshold:100,
    damage:{light:8,medium:15,heavy:25,slam:40,special:20},
    hitStunFrames:5,
    grabRange:2.5,
    piledriverRange:5.0
};

// ---- Combat constants (centralized) ----
var COMBAT={
    // Projectile hit
    projectile:{knockbackMul:0.8, vy:0.15, squash:0.5, throwTimer:25, bounces:1, stunDmg:15, npcStunTimer:50, fireDuration:120},
    // Shoryuken/uppercut hit
    shoryuken:{force:0.6, vy:0.4, squash:0.3, throwTimer:50, bounces:2, stunDmg:15, kenFireDuration:90},
    // Tatsumaki/spin hit
    spin:{force:0.6, vy:0.35, squash:0.3, throwTimer:50, bounces:2, stunDmg:15},
    // Rapid hit (hyakuretsu)
    rapidHit:{force:0.5, vy:0.25, squash:0.3, throwTimer:45, bounces:2, stunDmg:10},
    // Blanka roll hit
    blankaRoll:{throwTimer:45, bounces:2, stunDmg:10},
    // Honda dash hit
    hondaDash:{throwTimer:45, bounces:2, stunDmg:10},
    // Somersault kick hit
    somersault:{force:0.6, vy:0.35, squash:0.3, throwTimer:50, bounces:2, stunDmg:20},
    // Electric
    electric:{electrocuteDuration:90},
    // Yoga flame
    yogaFlame:{fireDuration:120, fireStun:90, stunDmg:20},
    // Normal punch hit
    punch:{throwTimer:30, bounces:1, squash:0.4, stunDmg:10, aerialStunDmg:30},
    // Normal kick hit
    kick:{throwTimer:45, bounces:2, squash:0.3, stunDmg:10, aerialStunDmg:30},
    // Body slam
    bodySlam:{baseThrowTimer:40, bounces:2, stunDmg:50},
    // Piledriver
    piledriver:{throwTimer:80, bounces:3, stunTimer:180},
    // Grab/throw
    grab:{stunDmg:20, throwTimer:50, bounces:2, squash:0.3},
    // Stomp/dive attack
    stomp:{baseVy:0.2, throwTimer:20, bounces:1, squash:0.4, stunDmg:30},
    // Prop/object impact
    propImpact:{throwTimer:15, bounces:1, squash:0.4},
    // NPC throw
    npcThrow:{throwTotal:60, throwTimer:60, bounces:2},
    // NPC piledriver
    npcPiledriver:{throwTimer:40, bounces:1, stunDmg:50},
    // NPC body slam
    npcBodySlam:{throwTimer:40, bounces:2, stunTimer:80}
};

// ---- Character definitions ----
var CHAR_DEFS=[
    {id:'blossomTraveler',name:'egg',birthCity:6,color:0xF5F5F0,accent:0xCC2222,icon:'\uD83E\uDD5A',mapX:200,mapY:110,
     bodyShape:'normal',portraitRx:55,portraitRy:70,miniRx:0.32,miniRy:0.38},
    {id:'herbTraveler',legacyId:'forestEgg',name:'bull',birthCity:7,color:0xBFE8A0,accent:0x8FD16A,icon:'\uD83D\uDC03',mapX:110,mapY:55,
     bodyShape:'round',portraitRx:65,portraitRy:60,miniRx:0.38,miniRy:0.34},
    {id:'crystalEgg',canonicalId:'saltCrystalTraveler',legacyId:'crystalEgg',nameKey:'saltCrystalTraveler',name:'cat',birthCity:2,color:0xF4E9E1,accent:0xE7B6C8,icon:'\uD83D\uDC8E',mapX:300,mapY:52,
     bodyShape:'round',portraitRx:65,portraitRy:60,miniRx:0.38,miniRy:0.34},
    {id:'angelEgg',canonicalId:'cloudwingTraveler',legacyId:'angelEgg',aliases:['angelEgg'],nameKey:'cloudwingTraveler',name:'rooster',legacyType:'rooster',birthCity:0,color:0xDDF5FF,accent:0x78BFE6,icon:'\u2601\uFE0F',mapX:200,mapY:34,
     bodyShape:'normal',portraitRx:55,portraitRy:70,miniRx:0.32,miniRy:0.38},
    {id:'candyEgg',canonicalId:'fruitbrewTraveler',legacyId:'candyEgg',aliases:['candyEgg'],nameKey:'fruitbrewTraveler',name:'dog',legacyType:'dog',birthCity:4,color:0xFF9C91,accent:0x78B766,icon:'\uD83C\uDF4E',mapX:335,mapY:120,
     bodyShape:'normal',portraitRx:55,portraitRy:70,miniRx:0.32,miniRy:0.38},
    {id:'starEgg',canonicalId:'berryTraveler',legacyId:'starEgg',aliases:['starEgg'],nameKey:'berryTraveler',name:'monkey',legacyType:'monkey',birthCity:5,color:0x557FCC,accent:0xD85C91,icon:'\uD83E\uDED0',mapX:95,mapY:165,
     bodyShape:'slim',portraitRx:42,portraitRy:75,miniRx:0.25,miniRy:0.42},
    {id:'rockEgg',canonicalId:'spicyFlameTraveler',legacyId:'rockEgg',nameKey:'spicyFlameTraveler',name:'bear',birthCity:3,color:0xF26F52,accent:0xFFD05A,icon:'\uD83C\uDF36\uFE0F',mapX:55,mapY:105,
     bodyShape:'big',portraitRx:72,portraitRy:72,miniRx:0.42,miniRy:0.40},
    {id:'windEgg',canonicalId:'goldenGrainTraveler',legacyId:'windEgg',aliases:['windEgg'],nameKey:'goldenGrainTraveler',name:'cockroach',legacyType:'cockroach',birthCity:1,color:0xE8B95C,accent:0xF3D36A,icon:'\uD83C\uDF3E',mapX:320,mapY:175,
     bodyShape:'thin',portraitRx:30,portraitRy:78,miniRx:0.20,miniRy:0.42}
];

// ---- Special move parameters per character ----
var MOVE_PARAMS={
    // ================================================================
    // 蜜蕊旅人 (legacy combat type: egg) — 微弱蛋拳(→→+R) / 蜜蕊旅人拳(↓↑+R) / 百花拳击(←→+T)
    // ================================================================
    blossomTraveler:{
        // 微弱蛋拳：一发轻柔的蛋能量弹，威力很小、不点燃
        weakPunch:{
            trigger:'ffR',input:'→→+R',        // forward-forward + punch
            name:'微弱蛋拳',type:'projectile',shout:'微弱蛋拳！',
            text:{zhs:'微弱蛋拳！',zht:'微弱蛋拳！',ja:'ふんわりエッグパンチ！',en:'Tiny Egg Punch!'},
            speed:0.3,life:80,color:0xFFE1B0,ringColor:0xFFF3D6,
            burns:false,          // gentle — no fire
            damage:4,stunDmg:6,   // weak damage & stun
            cd:22                 // cooldown frames
        },
        // 蜜蕊旅人拳：向上升腾、绽放花朵的上升重击
        shoryuken:{
            trigger:'bfR',input:'↓↑+R',        // down-up + punch
            name:'蜜蕊旅人拳',type:'shoryuken',shout:'蜜蕊旅人拳！',
            text:{zhs:'蜜蕊旅人拳！',zht:'蜜蕊旅人拳！',ja:'蜜花の旅人アッパー！',en:'Blossom Traveler Uppercut!'},
            jumpMul:1.6,fwdSpeed:0.15,duration:65,
            damage:20,stunDmg:15,
            cd:30
        },
        // 百花拳击：旋转散花的连环击
        tatsumaki:{
            trigger:'bfT',input:'←→+T',        // back-forward + kick
            name:'百花拳击',type:'tatsumaki',shout:'百花拳击！',
            text:{zhs:'百花拳击！',zht:'百花拳擊！',ja:'ひゃっかエッグスピン！',en:'Hundred Flowers Spin!'},
            duration:94,hitForce:0.5,hitVy:0.3,
            damage:12,stunDmg:15,hitCD:12,
            cd:40
        }
    },
    // ================================================================
    // 果酿旅人 (legacy combat type: dog) — 果香冲击(→→+R) / 果枝跃击(↓↑+R) / 果园回旋(←→+T)
    // ================================================================
    dog:{
        // 果香冲击：保留原有远程攻击玩法
        hadouken:{
            trigger:'ffR',input:'→→+R',
            name:'果香冲击',type:'projectile',shout:'果香冲击！',
            text:{zhs:'果香冲击！',zht:'果香衝擊！',ja:'フルーツアロマストライク！',en:'Fruit Aroma Strike!'},
            speed:0.35,life:120,color:0x4488FF,ringColor:0x88AAFF,
            burns:false,
            damage:10,stunDmg:15,
            cd:25
        },
        // 果枝跃击：保留原有上升重击与命中效果
        shoryuken:{
            trigger:'bfR',input:'↓↑+R',
            name:'果枝跃击',type:'shoryuken',shout:'果枝跃击！',
            text:{zhs:'果枝跃击！',zht:'果枝躍擊！',ja:'果樹ブランチアッパー！',en:'Orchard Branch Uppercut!'},
            jumpMul:1.7,fwdSpeed:0.35,duration:75,
            fire:true,            // this uppercut sets target on fire
            damage:22,stunDmg:15,
            cd:30
        },
        // 果园回旋：保留原有旋转连击
        tatsumaki:{
            trigger:'bfT',input:'←→+T',
            name:'果园回旋',type:'tatsumaki',shout:'果园回旋！',
            text:{zhs:'果园回旋！',zht:'果園迴旋！',ja:'オーチャードスピン！',en:'Orchard Spin!'},
            duration:94,hitForce:0.5,hitVy:0.3,
            damage:12,stunDmg:15,hitCD:12,
            cd:40
        }
    },
    // ================================================================
    // 香草旅人 (legacy combat type: bull) — 叶片蛋拳(R) / 森林摇摆(←→+R)
    // ================================================================
    herbTraveler:{
        // 叶片蛋拳：连打的叶片乱拳（原百裂掌）
        hyakuretsu:{
            trigger:'alwaysR',input:'R (always)',   // normal punch = leaf flurry
            name:'叶片蛋拳',type:'hyakuretsu',shout:'叶片蛋拳！',
            text:{zhs:'叶片蛋拳！',zht:'葉片蛋拳！',ja:'リーフエッグパンチ！',en:'Leaf Egg Punch!'},
            cd:4,range:2.5,hitForce:0.5,hitVy:0.25,
            damage:8,stunDmg:10
        },
        // 森林摇摆：稳沉的冲撞（原头槌冲撞）
        headbutt:{
            trigger:'bfR',input:'←→+R',        // back-forward + punch
            name:'森林摇摆',type:'dash',shout:'森林摇摆！',
            text:{zhs:'森林摇摆！',zht:'森林搖擺！',ja:'フォレストスウェイ！',en:'Forest Sway!'},
            speed:2,duration:60,cd:70,
            damage:15,stunDmg:20
        }
    },
    // ================================================================
    // 盐晶旅人 (legacy combat type: cat) — 晶石闪击(R) / 盐晶辉光(←→+R)
    // ================================================================
    cat:{
        // 晶石闪击：近身结晶脉冲
        electric:{
            trigger:'alwaysR',input:'R (always)',   // normal punch = crystal zap
            name:'晶石闪击',type:'electric',shout:'晶石闪击！',
            text:{zhs:'晶石闪击！',zht:'晶石閃擊！',ja:'結晶ストライク！',en:'Crystal Strike!'},
            duration:60,range:2.5,
            damage:8,stunDmg:15,
            electrocuteDuration:90 // frames target is frozen
        },
        // 盐晶辉光：保留原滚动冲撞玩法
        roll:{
            trigger:'bfR',input:'←→+R',        // back-forward + punch
            name:'盐晶辉光',type:'roll',shout:'盐晶辉光！',
            text:{zhs:'盐晶辉光！',zht:'鹽晶輝光！',ja:'塩晶の輝き！',en:'Salt Crystal Gleam!'},
            speed:3,duration:60,cd:35,
            damage:15,stunDmg:20
        }
    },
    // ================================================================
    // 云翼旅人 (legacy combat type: rooster) — 轻风弧光(→→+R) / 云步回旋(←→+T)
    // ================================================================
    rooster:{
        // 轻风弧光：保留原有能量弧玩法
        sonicBoom:{
            trigger:'ffR',input:'→→+R',        // forward-forward + punch
            name:'轻风弧光',type:'projectile',shout:'轻风弧光！',
            text:{zhs:'轻风弧光！',zht:'輕風弧光！',ja:'そよ風アーク！',en:'Breeze Arc!'},
            speed:0.5,life:100,color:0xFFDD44,ringColor:0xFFFF88,
            damage:10,stunDmg:15,
            cd:20
        },
        // 云步回旋：保留原有腾空后翻踢
        somersault:{
            trigger:'bfT',input:'←→+T',        // back-forward + kick
            name:'云步回旋',type:'somersault',shout:'云步回旋！',
            text:{zhs:'云步回旋！',zht:'雲步迴旋！',ja:'クラウドステップスピン！',en:'Cloudstep Spin!'},
            jumpMul:1.6,duration:65,arcSpeed:0.2,arcLife:30,
            damage:18,stunDmg:20,
            cd:35
        }
    },
    // ================================================================
    // 浆果旅人 (legacy combat type: monkey) — 暮林果迹(→→+R) / 藤蔓连踢(T) / 夜林回旋(←→+T)
    // ================================================================
    monkey:{
        // 暮林果迹：保留原有远程攻击玩法
        kikouken:{
            trigger:'ffR',input:'→→+R',        // forward-forward + punch
            name:'暮林果迹',type:'projectile',shout:'暮林果迹！',
            text:{zhs:'暮林果迹！',zht:'暮林果跡！',ja:'夕森ベリートレイル！',en:'Twilight Berry Trail!'},
            speed:0.5,life:100,color:0x88BBFF,ringColor:0x88FF88,
            damage:10,stunDmg:15,
            cd:20
        },
        // 藤蔓连踢：保留原有连续踢击
        hyakuretsuKick:{
            trigger:'alwaysT',input:'T (always)',   // normal kick = rapid kicks
            name:'藤蔓连踢',type:'hyakuretsuKick',shout:'藤蔓连踢！',
            text:{zhs:'藤蔓连踢！',zht:'藤蔓連踢！',ja:'ベリーヴァインキック！',en:'Berry Vine Kicks!'},
            cd:4,range:2.5,hitForce:0.5,hitVy:0.25,
            damage:8,stunDmg:10
        },
        // 夜林回旋：保留原有旋转升空踢
        spinningBird:{
            trigger:'bfT',input:'←→+T',        // back-forward + kick
            name:'夜林回旋',type:'spinningBird',shout:'夜林回旋！',
            text:{zhs:'夜林回旋！',zht:'夜林迴旋！',ja:'ナイトウッドスピン！',en:'Nightwood Spin!'},
            jumpMul:1.2,duration:60,
            damage:15,stunDmg:15,
            cd:35
        }
    },
    // ================================================================
    // 辣焰旅人 (legacy combat type: bear) — 辛香冲击(R+T) / 辛香回旋摔(→←→+F)
    // ================================================================
    bear:{
        // 辛香冲击：保留原双臂横扫玩法
        lariat:{
            trigger:'RT',input:'R+T (hold)',   // punch + kick held together
            name:'辛香冲击',type:'lariat',shout:'辛香冲击！',
            text:{zhs:'辛香冲击！',zht:'辛香衝擊！',ja:'スパイスストライク！',en:'Spice Strike!'},
            duration:60,hitForce:0.5,hitVy:0.3,
            damage:12,stunDmg:15,hitCD:12,
            cd:40
        },
        // 辛香回旋摔：保留现有擒抱与回旋玩法
        piledriver:{
            trigger:'fbfF',input:'→←→+F',       // forward-back-forward + grab
            name:'辛香回旋摔',type:'piledriver',shout:'辛香回旋摔！',
            text:{zhs:'辛香回旋摔！',zht:'辛香迴旋摔！',ja:'スパイススピンスラム！',en:'Spice Spin Slam!'},
            range:5.0,riseFrames:40,pauseFrames:8,slamFrames:12,maxHeight:15,
            damage:35,stunDmg:50, // devastating
            cd:80
        }
    },
    // ================================================================
    // 金穗旅人 (legacy combat type: cockroach) — 金穗冲击(→→+R) / 田野横扫(←→+R) / 田野延展(被动:攻击范围加长)
    // ================================================================
    cockroach:{
        // 金穗冲击：保留原有缓慢飞行的远程攻击
        yogaFire:{
            trigger:'ffR',input:'→→+R',        // forward-forward + punch
            name:'金穗冲击',type:'projectile',shout:'金穗冲击！',
            text:{zhs:'金穗冲击！',zht:'金穗衝擊！',ja:'金穂ストライク！',en:'Golden Grain Strike!'},
            speed:0.2,life:180,color:0xFF6600,ringColor:0xFFAA00,
            burns:true,
            damage:10,stunDmg:15,
            cd:30
        },
        // 田野横扫：保留原有近身范围爆发
        yogaFlame:{
            trigger:'bfR',input:'←→+R',        // back-forward + punch
            name:'田野横扫',type:'yogaFlame',shout:'田野横扫！',
            text:{zhs:'田野横扫！',zht:'田野橫掃！',ja:'フィールドスイープ！',en:'Field Sweep!'},
            duration:60,range:4,
            damage:15,stunDmg:20,
            fireDuration:120,     // 2 seconds effect
            fireStun:90,          // 1.5 seconds frozen
            cd:40
        },
        // 田野延展（被动）：攻击范围加长
        extendedRange:2.5,
        // Slower attack speed
        punchCD:32,kickCD:36,punchAnim:28,kickAnim:28,
        comboTimerPunch:40,comboTimerKick:45,
        // Normal punch/kick damage (long range)
        normalPunchDmg:6,normalKickDmg:8
    }
};

// Keep the legacy combat/save type "egg" working without exposing a duplicate
// character entry when MOVE_PARAMS is enumerated for localized move labels.
Object.defineProperty(MOVE_PARAMS,'egg',{
    value:MOVE_PARAMS.blossomTraveler,
    enumerable:false,
    configurable:false,
    writable:false
});
Object.defineProperty(MOVE_PARAMS,'bull',{
    value:MOVE_PARAMS.herbTraveler,
    enumerable:false,
    configurable:false,
    writable:false
});

// ---- Common move damage values ----
var COMMON_DAMAGE={
    normalPunch:5,          // basic punch hit
    normalKick:6,           // basic kick hit
    finisherPunch:12,       // 3rd combo punch
    finisherKick:15,        // 3rd combo kick
    aerialHit:10,           // air attack
    throwBase:8,            // normal throw
    chargeThrowMax:20,      // max charge throw
    bodySlam:25,            // jump + down slam
    grabDamage:0            // grab itself does no damage
};

// ---- NPC AI special move chances ----
var NPC_MOVE_CHANCE={
    hadouken:0.02,shoryuken:0.008,tatsumaki:0.008,
    hyakuretsu:0.02,headbutt:0.008,
    electric:0.01,roll:0.006,
    sonicBoom:0.015,somersault:0.008,
    kikouken:0.015,hyakuretsuKick:0.015,spinningBird:0.006,
    lariat:0.008,piledriver:0.008,
    yogaFire:0.02,yogaFlame:0.006
};

// ---- Trigger helpers ----
function _findMove(charType,trigger){
    var moves=MOVE_PARAMS[charType];if(!moves)return null;
    for(var key in moves){var m=moves[key];if(m&&m.trigger===trigger)return m;}
    return null;
}
function _getMoves(charType){
    var moves=MOVE_PARAMS[charType];if(!moves)return [];
    var r=[];for(var key in moves){var m=moves[key];if(m&&m.trigger)r.push(m);}return r;
}
function _hasMove(charType,trigger){return !!_findMove(charType,trigger);}
function _playMoveSFX(md){
    if(!md||!md.sfx||!sfxEnabled)return;
    try{var c=ensureAudio();if(!c)return;var t=c.currentTime;var s=md.sfx;
        var o=c.createOscillator();var g=c.createGain();
        o.type=s.type||'sine';o.frequency.setValueAtTime(s.freqStart||300,t);
        o.frequency.exponentialRampToValueAtTime(Math.max(s.freqEnd||150,1),t+(s.dur||0.3)*0.8);
        g.gain.setValueAtTime(s.gain||0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+(s.dur||0.3));
        o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+(s.dur||0.3));
    }catch(e){}
}
function _shoutMoveData(egg,md){
    if(!md||!egg)return;var txt=md.shout||'';
    if(md.text){txt=md.text[_langCode]||md.text.en||txt;}
    if(typeof _showChatBubble==='function')_showChatBubble(egg,txt,60);
}
