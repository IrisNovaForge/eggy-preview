(function(){
    'use strict';
    var prefix='brick_breaker_debug:';
    var storage={
        get:function(key,fallback){try{var raw=localStorage.getItem(prefix+key);return raw===null?fallback:JSON.parse(raw);}catch(error){return fallback;}},
        set:function(key,value){try{localStorage.setItem(prefix+key,JSON.stringify(value));return true;}catch(error){return false;}}
    };
    var characters={
        blossomTraveler:{displayName:'花香旅人',trait:'柔瓣节奏｜顺滑均衡',color:0xFFFDF2,accent:0xEF4A5B},
        herbTraveler:{displayName:'香草旅人',trait:'柔叶折返｜稳进快转',color:0xBFE8A0,accent:0x8FD16A},
        saltCrystalTraveler:{displayName:'盐晶旅人',trait:'晶点定步｜疾起疾停',color:0xF4E9E1,accent:0xE7B6C8},
        cloudwingTraveler:{displayName:'云翼旅人',trait:'云步轻浮｜缓起缓停',color:0xDDF5FF,accent:0x78BFE6},
        fruitbrewTraveler:{displayName:'果酿旅人',trait:'果园弹步｜快起双收',color:0xFF9C91,accent:0x78B766},
        berryTraveler:{displayName:'浆果旅人',trait:'浆果灵步｜疾起滑停',color:0x557FCC,accent:0xD85C91},
        spicyFlameTraveler:{displayName:'辣焰旅人',trait:'辣焰冲势｜短促强转',color:0xF26F52,accent:0xFFD05A},
        goldenGrainTraveler:{displayName:'金穗旅人',trait:'金穗稳守｜缓起稳停',color:0xE8B95C,accent:0xF3D36A}
    };
    var params=new URLSearchParams(location.search),requested=params.get('character')||'',requestedLevel=Number(params.get('level')),level=requestedLevel>=2&&requestedLevel<=6?requestedLevel:1;
    var characterId=characters[requested]?requested:'blossomTraveler',definition=characters[characterId];
    var character={id:characterId,displayName:definition.displayName,style:{color:definition.color,accent:definition.accent}};
    document.title='星光弹球工坊｜插件调试';
    window.brickBreakerDebug=window.DanboBrickBreaker.create({
        mount:document.getElementById('brick-breaker-debug'),
        character:character,
        characterPortrait:{src:'../portraits/'+characterId+'.png'},
        level:level,
        storage:storage,
        rules:window.DanboBrickBreakerRules.create(),
        onExit:function(){window.brickBreakerDebug.showTitle();}
    });
    if(params.get('direct')==='1')window.brickBreakerDebug.showLevelIntro(level);
})();
