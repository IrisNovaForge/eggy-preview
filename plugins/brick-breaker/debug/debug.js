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
    var params=new URLSearchParams(location.search),requested=params.get('character')||'',requestedLevel=Number(params.get('level')),level=requestedLevel===2||requestedLevel===3||requestedLevel===4?requestedLevel:1;
    var characterId=characters[requested]?requested:'blossomTraveler',definition=characters[characterId];
    var character={id:characterId,displayName:definition.displayName,style:{color:definition.color,accent:definition.accent}};
    var picker=document.getElementById('brick-breaker-character-picker');
    if(picker){
        Object.keys(characters).forEach(function(id){var option=document.createElement('option');option.value=id;option.textContent=characters[id].displayName;picker.appendChild(option);});
        picker.value=characterId;
        picker.addEventListener('change',function(){var next=new URLSearchParams(location.search);next.set('character',picker.value);location.search=next.toString();});
    }
    var traitLabel=document.getElementById('brick-breaker-trait-label');if(traitLabel)traitLabel.textContent=(level===2?'芽围轻摆｜':(level===3?'双层柔壳｜':(level===4?'柔性偏转｜':'')))+definition.trait;
    if(level===2)document.title='芽围轻摆｜插件调试';else if(level===3)document.title='双层柔壳｜插件调试';else if(level===4)document.title='柔性偏转｜插件调试';
    window.brickBreakerDebug=window.DanboBrickBreaker.create({
        mount:document.getElementById('brick-breaker-debug'),
        character:character,
        characterPortrait:{src:'../portraits/'+characterId+'.png'},
        level:level,
        storage:storage,
        rules:window.DanboBrickBreakerRules.create(),
        onExit:function(){window.brickBreakerDebug.showTitle();}
    });
    document.querySelectorAll('[data-debug-reaction]').forEach(function(button){
        button.addEventListener('click',function(){
            var game=window.brickBreakerDebug,type=button.getAttribute('data-debug-reaction');
            if(!game)return;
            if(game.state==='title')game.startGame();
            if(game.state==='ready')game.launch();
            if(type==='catch')game.triggerPadFeedback();
            if(game.characterView&&game.characterView.react)game.characterView.react(type,type==='catch'?game.padFeedback.offset:0);
        });
    });
})();
