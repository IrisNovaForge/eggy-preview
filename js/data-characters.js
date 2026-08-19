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
    grabRange:2.5
};

// ---- Combat constants (centralized) ----
var COMBAT={
    // Projectile hit
    projectile:{knockbackMul:0.8, vy:0.15, squash:0.5, throwTimer:25, bounces:1, stunDmg:15, npcStunTimer:50, fireDuration:120},
    // Canopy-lift hit
    canopyLift:{force:0.6, vy:0.4, squash:0.3, throwTimer:50, bounces:2, stunDmg:15, emberTrailDuration:90},
    // Trail sweep/spin hit
    spin:{force:0.6, vy:0.35, squash:0.3, throwTimer:50, bounces:2, stunDmg:15},
    // Rapid hit (leafFlurry)
    rapidHit:{force:0.5, vy:0.25, squash:0.3, throwTimer:45, bounces:2, stunDmg:10},
    // Salt Crystal Traveler roll hit
    crystalGlide:{throwTimer:45, bounces:2, stunDmg:10},
    // Herb Traveler dash hit
    herbDash:{throwTimer:45, bounces:2, stunDmg:10},
    // Cloud vault kick hit
    cloudVault:{force:0.6, vy:0.35, squash:0.3, throwTimer:50, bounces:2, stunDmg:20},
    // Electric
    electric:{electrocuteDuration:90},
    // Harvest fan
    harvestFan:{fireDuration:120, fireStun:90, stunDmg:20},
    // Normal punch hit
    punch:{throwTimer:30, bounces:1, squash:0.4, stunDmg:10, aerialStunDmg:30},
    // Normal kick hit
    kick:{throwTimer:45, bounces:2, squash:0.3, stunDmg:10, aerialStunDmg:30},
    // Body slam
    bodySlam:{baseThrowTimer:40, bounces:2, stunDmg:50},
    // Grab/throw
    grab:{stunDmg:20, throwTimer:50, bounces:2, squash:0.3},
    // Stomp/dive attack
    stomp:{baseVy:0.2, throwTimer:20, bounces:1, squash:0.4, stunDmg:30},
    // Prop/object impact
    propImpact:{throwTimer:15, bounces:1, squash:0.4},
    // NPC throw
    npcThrow:{throwTotal:60, throwTimer:60, bounces:2},
    // NPC body slam
    npcBodySlam:{throwTimer:40, bounces:2, stunTimer:80}
};

// ---- Character definitions ----
var CHAR_DEFS=[
    {id:'blossomTraveler',legacyId:'egg',name:'blossomTraveler',birthCity:6,color:0xF5F5F0,accent:0xCC2222,icon:'\uD83C\uDF3C',mapX:200,mapY:110},
    {id:'herbTraveler',legacyId:'forestEgg',name:'herbTraveler',birthCity:7,color:0xBFE8A0,accent:0x8FD16A,icon:'\uD83C\uDF32',mapX:110,mapY:55},
    {id:'saltCrystalTraveler',legacyId:'crystalEgg',nameKey:'saltCrystalTraveler',name:'saltCrystalTraveler',birthCity:2,color:0xF4E9E1,accent:0xE7B6C8,icon:'\uD83D\uDC8E',mapX:300,mapY:52},
    {id:'cloudwingTraveler',legacyId:'angelEgg',nameKey:'cloudwingTraveler',name:'cloudwingTraveler',birthCity:0,color:0xDDF5FF,accent:0x78BFE6,icon:'\u2601\uFE0F',mapX:200,mapY:34},
    {id:'fruitbrewTraveler',legacyId:'candyEgg',nameKey:'fruitbrewTraveler',name:'fruitbrewTraveler',birthCity:4,color:0xFF9C91,accent:0x78B766,icon:'\uD83C\uDF4E',mapX:335,mapY:120},
    {id:'berryTraveler',legacyId:'starEgg',nameKey:'berryTraveler',name:'berryTraveler',birthCity:5,color:0x557FCC,accent:0xD85C91,icon:'\uD83E\uDED0',mapX:95,mapY:165},
    {id:'spicyFlameTraveler',legacyId:'rockEgg',nameKey:'spicyFlameTraveler',name:'spicyFlameTraveler',birthCity:3,color:0xF26F52,accent:0xFFD05A,icon:'\uD83C\uDF36\uFE0F',mapX:55,mapY:105},
    {id:'goldenGrainTraveler',legacyId:'windEgg',nameKey:'goldenGrainTraveler',name:'goldenGrainTraveler',birthCity:1,color:0xE8B95C,accent:0xF3D36A,icon:'\uD83C\uDF3E',mapX:320,mapY:175}
];

// ---- Special move parameters per character ----
var MOVE_PARAMS={
    // ================================================================
    // 花香旅人 — 花瓣轻拳(→→+R) / 花香上勾拳(↓↑+R) / 百花旋击(←→+T)
    // ================================================================
    blossomTraveler:{
        // 花瓣轻拳：一枚轻柔花瓣能量，威力较小、不点燃
        weakPunch:{
            trigger:'routeCast',input:'R, R',        // two punch taps
            name:'花瓣轻拳',type:'projectile',shout:'花瓣轻拳！',
            text:{zhs:'花瓣轻拳！',zht:'花瓣輕拳！',ja:'花びらパンチ！',en:'Petal Punch!'},
            speed:0.3,life:80,color:0xFFE1B0,ringColor:0xFFF3D6,
            burns:false,          // gentle — no fire
            damage:4,stunDmg:6,   // weak damage & stun
            cd:22                 // cooldown frames
        },
        // 花香上勾拳：向上升腾、绽放花朵的上升重击
        canopyLift:{
            trigger:'crossAction',input:'T, R',        // kick then punch
            name:'花香上勾拳',type:'canopyLift',shout:'花香上勾拳！',
            text:{zhs:'花香上勾拳！',zht:'花香上勾拳！',ja:'花香アッパー！',en:'Blossom Uppercut!'},
            jumpMul:1.6,fwdSpeed:0.15,duration:65,
            damage:20,stunDmg:15,
            cd:30
        },
        // 百花旋击：旋转散花的连环击
        trailSweep:{
            trigger:'trailSweep',input:'T, T',        // two kick taps
            name:'百花旋击',type:'trailSweep',shout:'百花旋击！',
            text:{zhs:'百花旋击！',zht:'百花旋擊！',ja:'百花スピン！',en:'Hundred Flowers Spin!'},
            duration:94,hitForce:0.5,hitVy:0.3,
            damage:12,stunDmg:15,hitCD:12,
            cd:40
        }
    },
    // ================================================================
    // 果酿旅人 — 果香冲击(→→+R) / 果枝跃击(↓↑+R) / 果园回旋(←→+T)
    // ================================================================
    fruitbrewTraveler:{
        // 果香冲击：保留原有远程攻击玩法
        seedCast:{
            trigger:'routeCast',input:'R, R',
            name:'果香冲击',type:'projectile',shout:'果香冲击！',
            text:{zhs:'果香冲击！',zht:'果香衝擊！',ja:'フルーツアロマストライク！',en:'Fruit Aroma Strike!'},
            speed:0.35,life:120,color:0x4488FF,ringColor:0x88AAFF,
            burns:false,
            damage:10,stunDmg:15,
            cd:25
        },
        // 果枝跃击：保留原有上升重击与命中效果
        canopyLift:{
            trigger:'crossAction',input:'T, R',
            name:'果枝跃击',type:'canopyLift',shout:'果枝跃击！',
            text:{zhs:'果枝跃击！',zht:'果枝躍擊！',ja:'果樹ブランチアッパー！',en:'Orchard Branch Uppercut!'},
            jumpMul:1.7,fwdSpeed:0.35,duration:75,
            fire:true,            // adds a brief warm trail on contact
            damage:22,stunDmg:15,
            cd:30
        },
        // 果园回旋：保留原有旋转连击
        trailSweep:{
            trigger:'trailSweep',input:'T, T',
            name:'果园回旋',type:'trailSweep',shout:'果园回旋！',
            text:{zhs:'果园回旋！',zht:'果園迴旋！',ja:'オーチャードスピン！',en:'Orchard Spin!'},
            duration:94,hitForce:0.5,hitVy:0.3,
            damage:12,stunDmg:15,hitCD:12,
            cd:40
        }
    },
    // ================================================================
    // 香草旅人 — 叶片轻拳(R) / 森林摇摆(←→+R)
    // ================================================================
    herbTraveler:{
        // 叶片轻拳：连续的叶片轻击
        leafFlurry:{
            trigger:'routeCast',input:'R, R',   // normal punch = leaf flurry
            name:'叶片轻拳',type:'leafFlurry',shout:'叶片轻拳！',
            text:{zhs:'叶片轻拳！',zht:'葉片輕拳！',ja:'リーフパンチ！',en:'Leaf Punch!'},
            cd:4,range:2.5,hitForce:0.5,hitVy:0.25,
            damage:8,stunDmg:10
        },
        // 森林摇摆：稳沉的冲撞（原头槌冲撞）
        herbDash:{
            trigger:'crossAction',input:'T, R',        // kick then punch
            name:'森林摇摆',type:'dash',shout:'森林摇摆！',
            text:{zhs:'森林摇摆！',zht:'森林搖擺！',ja:'フォレストスウェイ！',en:'Forest Sway!'},
            speed:2,duration:60,cd:70,
            damage:15,stunDmg:20
        }
    },
    // ================================================================
    // 盐晶旅人 — 晶石闪击(R) / 盐晶辉光(←→+R)
    // ================================================================
    saltCrystalTraveler:{
        // 晶石闪击：近身结晶脉冲
        electric:{
            trigger:'routeCast',input:'R, R',   // normal punch = crystal zap
            name:'晶石闪击',type:'electric',shout:'晶石闪击！',
            text:{zhs:'晶石闪击！',zht:'晶石閃擊！',ja:'結晶ストライク！',en:'Crystal Strike!'},
            duration:60,range:2.5,
            damage:8,stunDmg:15,
            electrocuteDuration:90 // frames target is frozen
        },
        // 盐晶辉光：保留原滚动冲撞玩法
        crystalGlide:{
            trigger:'crossAction',input:'T, R',        // kick then punch
            name:'盐晶辉光',type:'crystalGlide',shout:'盐晶辉光！',
            text:{zhs:'盐晶辉光！',zht:'鹽晶輝光！',ja:'塩晶の輝き！',en:'Salt Crystal Gleam!'},
            speed:3,duration:60,cd:35,
            damage:15,stunDmg:20
        }
    },
    // ================================================================
    // 云翼旅人 — 轻风弧光(→→+R) / 云步回旋(←→+T)
    // ================================================================
    cloudwingTraveler:{
        // 轻风弧光：保留原有能量弧玩法
        windRibbon:{
            trigger:'routeCast',input:'R, R',        // two punch taps
            name:'轻风弧光',type:'projectile',shout:'轻风弧光！',
            text:{zhs:'轻风弧光！',zht:'輕風弧光！',ja:'そよ風アーク！',en:'Breeze Arc!'},
            speed:0.5,life:100,color:0xFFDD44,ringColor:0xFFFF88,
            damage:10,stunDmg:15,
            cd:20
        },
        // 云步回旋：保留原有腾空后翻踢
        cloudVault:{
            trigger:'trailSweep',input:'T, T',        // two kick taps
            name:'云步回旋',type:'cloudVault',shout:'云步回旋！',
            text:{zhs:'云步回旋！',zht:'雲步迴旋！',ja:'クラウドステップスピン！',en:'Cloudstep Spin!'},
            jumpMul:1.6,duration:65,arcSpeed:0.2,arcLife:30,
            damage:18,stunDmg:20,
            cd:35
        }
    },
    // ================================================================
    // 浆果旅人 — 暮林果迹(→→+R) / 藤蔓连踢(T) / 夜林回旋(←→+T)
    // ================================================================
    berryTraveler:{
        // 暮林果迹：保留原有远程攻击玩法
        berryCast:{
            trigger:'routeCast',input:'R, R',        // two punch taps
            name:'暮林果迹',type:'projectile',shout:'暮林果迹！',
            text:{zhs:'暮林果迹！',zht:'暮林果跡！',ja:'夕森ベリートレイル！',en:'Twilight Berry Trail!'},
            speed:0.5,life:100,color:0x88BBFF,ringColor:0x88FF88,
            damage:10,stunDmg:15,
            cd:20
        },
        // 藤蔓连踢：保留原有连续踢击
        berryFlurry:{
            trigger:'npcAction',input:'',   // normal kick = rapid kicks
            name:'藤蔓连踢',type:'berryFlurry',shout:'藤蔓连踢！',
            text:{zhs:'藤蔓连踢！',zht:'藤蔓連踢！',ja:'ベリーヴァインキック！',en:'Berry Vine Kicks!'},
            cd:4,range:2.5,hitForce:0.5,hitVy:0.25,
            damage:8,stunDmg:10
        },
        // 夜林回旋：保留原有旋转升空踢
        twilightSweep:{
            trigger:'trailSweep',input:'T, T',        // two kick taps
            name:'夜林回旋',type:'twilightSweep',shout:'夜林回旋！',
            text:{zhs:'夜林回旋！',zht:'夜林迴旋！',ja:'ナイトウッドスピン！',en:'Nightwood Spin!'},
            jumpMul:1.2,duration:60,
            damage:15,stunDmg:15,
            cd:35
        }
    },
    // ================================================================
    // 辣焰旅人 — 辛香冲击(R+T) / 辛香回旋摔(→←→+F)
    // ================================================================
    spicyFlameTraveler:{
        // 辛香冲击：保留原双臂横扫玩法
        spiceGust:{
            trigger:'RT',input:'R+T (hold)',   // punch + kick held together
            name:'辛香冲击',type:'spiceGust',shout:'辛香冲击！',
            text:{zhs:'辛香冲击！',zht:'辛香衝擊！',ja:'スパイスストライク！',en:'Spice Strike!'},
            duration:60,hitForce:0.5,hitVy:0.3,
            damage:12,stunDmg:15,hitCD:12,
            cd:40
        },
    },
    // ================================================================
    // 金穗旅人 — 金穗冲击(→→+R) / 田野横扫(←→+R) / 田野延展(被动:攻击范围加长)
    // ================================================================
    goldenGrainTraveler:{
        // 金穗冲击：保留原有缓慢飞行的远程攻击
        grainPod:{
            trigger:'routeCast',input:'R, R',        // two punch taps
            name:'金穗冲击',type:'projectile',shout:'金穗冲击！',
            text:{zhs:'金穗冲击！',zht:'金穗衝擊！',ja:'金穂ストライク！',en:'Golden Grain Strike!'},
            speed:0.2,life:180,color:0xFF6600,ringColor:0xFFAA00,
            burns:true,
            damage:10,stunDmg:15,
            cd:30
        },
        // 田野横扫：保留原有近身范围爆发
        harvestFan:{
            trigger:'crossAction',input:'T, R',        // kick then punch
            name:'田野横扫',type:'harvestFan',shout:'田野横扫！',
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
    seedCast:0.02,canopyLift:0.008,trailSweep:0.008,
    leafFlurry:0.02,herbDash:0.008,
    electric:0.01,roll:0.006,
    windRibbon:0.015,cloudVault:0.008,
    berryCast:0.015,berryFlurry:0.015,twilightSweep:0.006,
    spiceGust:0.008,
    grainPod:0.02,harvestFan:0.006
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
