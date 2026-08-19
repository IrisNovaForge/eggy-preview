(function(){
    'use strict';
    var prefix='brick_breaker_standalone:';
    var storage={
        get:function(key,fallback){try{var raw=localStorage.getItem(prefix+key);return raw===null?fallback:JSON.parse(raw);}catch(e){return fallback;}},
        set:function(key,value){try{localStorage.setItem(prefix+key,JSON.stringify(value));return true;}catch(e){return false;}}
    };
    var characters={
        blossomTraveler:{displayName:'Blossom Traveler',color:0xF5F5F0,accent:0xCC2222},
        herbTraveler:{displayName:'Herb Traveler',color:0xBFE8A0,accent:0x8FD16A},
        saltCrystalTraveler:{displayName:'Salt Crystal Traveler',color:0xF4E9E1,accent:0xE7B6C8},
        cloudwingTraveler:{displayName:'Cloudwing Traveler',color:0xDDF5FF,accent:0x78BFE6},
        fruitbrewTraveler:{displayName:'Fruitbrew Traveler',color:0xFF9C91,accent:0x78B766},
        berryTraveler:{displayName:'Berry Traveler',color:0x557FCC,accent:0xD85C91},
        spicyFlameTraveler:{displayName:'Spicy Flame Traveler',color:0xF26F52,accent:0xFFD05A},
        goldenGrainTraveler:{displayName:'Golden Grain Traveler',color:0xE8B95C,accent:0xF3D36A}
    };
    var requested='';
    try{requested=new URLSearchParams(location.search).get('character')||'';}catch(error){}
    var characterId=characters[requested]?requested:'blossomTraveler',definition=characters[characterId];
    var character={id:characterId,displayName:definition.displayName,style:{color:definition.color,accent:definition.accent}};
    window.brickBreakerStandalone=window.DanboBrickBreaker.create({
        mount:document.getElementById('brick-breaker-standalone'),
        character:character,
        characterPortrait:{src:'../portraits/'+characterId+'.png'},
        storage:storage,
        rules:window.DanboBrickBreakerRules.create(),
        onExit:function(){window.brickBreakerStandalone.showTitle();}
    });
})();
