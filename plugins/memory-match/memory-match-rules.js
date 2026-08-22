(function(global){
    'use strict';

    var FACE_IDS=[
        'blossomTraveler','herbTraveler','saltCrystalTraveler','cloudwingTraveler',
        'fruitbrewTraveler','berryTraveler','spicyFlameTraveler','goldenGrainTraveler'
    ];

    function normalizeSeed(value){
        var seed=(Number(value)||0)>>>0;
        return seed||0x6d2b79f5;
    }

    function fallbackRandom(seed){
        var state=normalizeSeed(seed);
        return function(){
            state^=state<<13;state^=state>>>17;state^=state<<5;
            return state>>>0;
        };
    }

    function makeRules(options){
        options=options||{};
        var wasm=options.wasm||null;

        function randomSource(seed){
            if(wasm&&typeof wasm.seed==='function'&&typeof wasm.nextU32==='function'){
                wasm.seed(normalizeSeed(seed));
                return function(){return wasm.nextU32()>>>0;};
            }
            return fallbackRandom(seed);
        }

        return {
            id:'memory-match',
            mode:wasm?'wasm':'js-fallback',
            faceIds:FACE_IDS.slice(),
            createDeck:function(pairCount,seed){
                pairCount=Math.max(1,Math.min(FACE_IDS.length,pairCount|0||8));
                var deck=[];
                for(var pairId=0;pairId<pairCount;pairId++){
                    deck.push({pairId:pairId,faceId:FACE_IDS[pairId]});
                    deck.push({pairId:pairId,faceId:FACE_IDS[pairId]});
                }
                var next=randomSource(seed);
                for(var index=deck.length-1;index>0;index--){
                    var swapIndex=next()%(index+1);
                    var held=deck[index];deck[index]=deck[swapIndex];deck[swapIndex]=held;
                }
                return deck.map(function(card,index){
                    return {id:index,pairId:card.pairId,faceId:card.faceId,state:'down'};
                });
            },
            samePair:function(first,second){
                if(!first||!second||first.id===second.id)return false;
                if(wasm&&typeof wasm.samePair==='function')return wasm.samePair(first.pairId,second.pairId);
                return first.pairId===second.pairId;
            },
            isComplete:function(matchedPairs,totalPairs){
                if(wasm&&typeof wasm.isComplete==='function')return wasm.isComplete(matchedPairs,totalPairs);
                return (matchedPairs|0)>=(totalPairs|0);
            }
        };
    }

    global.DanboMemoryMatchRules={create:makeRules,faceIds:FACE_IDS.slice()};
})(window);

