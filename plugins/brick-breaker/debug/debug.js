(function(){
    'use strict';
    var prefix='brick_breaker_debug:';
    var storage={
        get:function(key,fallback){try{var raw=localStorage.getItem(prefix+key);return raw===null?fallback:JSON.parse(raw);}catch(error){return fallback;}},
        set:function(key,value){try{localStorage.setItem(prefix+key,JSON.stringify(value));return true;}catch(error){return false;}}
    };
    var characters={
        blossomTraveler:{displayName:'花香旅人',color:0xFFFDF2,accent:0xEF4A5B},
        herbTraveler:{displayName:'香草旅人',color:0xBFE8A0,accent:0x8FD16A},
        saltCrystalTraveler:{displayName:'盐晶旅人',color:0xF4E9E1,accent:0xE7B6C8},
        cloudwingTraveler:{displayName:'云翼旅人',color:0xDDF5FF,accent:0x78BFE6},
        fruitbrewTraveler:{displayName:'果酿旅人',color:0xFF9C91,accent:0x78B766},
        berryTraveler:{displayName:'浆果旅人',color:0x557FCC,accent:0xD85C91},
        spicyFlameTraveler:{displayName:'辣焰旅人',color:0xF26F52,accent:0xFFD05A},
        goldenGrainTraveler:{displayName:'金穗旅人',color:0xE8B95C,accent:0xF3D36A}
    };
    var params=new URLSearchParams(location.search),requested=params.get('character')||'';
    var characterId=characters[requested]?requested:'blossomTraveler',definition=characters[characterId];
    var character={id:characterId,displayName:definition.displayName,style:{color:definition.color,accent:definition.accent}};
    var picker=document.getElementById('brick-breaker-character-picker');
    if(picker){
        Object.keys(characters).forEach(function(id){var option=document.createElement('option');option.value=id;option.textContent=characters[id].displayName;picker.appendChild(option);});
        picker.value=characterId;
        picker.addEventListener('change',function(){var next=new URLSearchParams(location.search);next.set('character',picker.value);location.search=next.toString();});
    }
    window.brickBreakerDebug=window.DanboBrickBreaker.create({
        mount:document.getElementById('brick-breaker-debug'),
        character:character,
        characterPortrait:{src:'../portraits/'+characterId+'.png'},
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
