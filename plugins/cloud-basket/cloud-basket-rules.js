(function(root,factory){
    'use strict';
    var api=factory();
    if(typeof module==='object'&&module.exports)module.exports=api;
    if(root)root.DanboCloudBasketRules=api;
})(typeof window!=='undefined'?window:globalThis,function(){
    'use strict';

    var TONES=['blue','gold','pink'];
    var MARKS=['dot','ring','star'];

    function create(options){
        options=options||{};
        return {
            level:1,
            durationSeconds:Math.max(10,Number(options.durationSeconds)||45),
            candidateCount:3,
            tones:TONES.slice(),
            marks:MARKS.slice()
        };
    }

    function randomSource(seed){
        var state=(Number(seed)||0x6d2b79f5)>>>0;
        return function(){state^=state<<13;state^=state>>>17;state^=state<<5;return state>>>0;};
    }

    function keyOf(item){return item.tone+'|'+item.mark;}

    function differenceCount(first,second){
        if(!first||!second)return 2;
        return (first.tone===second.tone?0:1)+(first.mark===second.mark?0:1);
    }

    function createRound(rules,seed,roundIndex){
        var next=randomSource(((Number(seed)||0x51f15e)^(Number(roundIndex)||0)*0x9e3779b1)>>>0);
        var target={tone:rules.tones[next()%rules.tones.length],mark:rules.marks[next()%rules.marks.length]};
        var alternatives=[];
        rules.tones.forEach(function(tone){if(tone!==target.tone)alternatives.push({tone:tone,mark:target.mark});});
        rules.marks.forEach(function(mark){if(mark!==target.mark)alternatives.push({tone:target.tone,mark:mark});});
        for(var index=alternatives.length-1;index>0;index--){
            var swapIndex=next()%(index+1),held=alternatives[index];alternatives[index]=alternatives[swapIndex];alternatives[swapIndex]=held;
        }
        var correctIndex=next()%rules.candidateCount,candidates=new Array(rules.candidateCount),alternativeIndex=0;
        for(var candidateIndex=0;candidateIndex<candidates.length;candidateIndex++){
            candidates[candidateIndex]=candidateIndex===correctIndex?{tone:target.tone,mark:target.mark}:alternatives[alternativeIndex++];
        }
        return {level:1,target:target,candidates:candidates,correctIndex:correctIndex};
    }

    function isCorrect(round,index){return !!round&&Number(index)===round.correctIndex;}
    function createState(rules){return {level:1,status:'playing',correct:0,wrong:0,answered:0,remainingSeconds:rules.durationSeconds};}
    function answer(state,correct){if(!state||state.status!=='playing')return state;state.answered+=1;if(correct)state.correct+=1;else state.wrong+=1;return state;}
    function accuracy(state){return !state||!state.answered?100:Math.round(state.correct/state.answered*100);}
    function updateTime(state,remainingSeconds){if(!state||state.status!=='playing')return state&&state.status;state.remainingSeconds=Math.max(0,Number(remainingSeconds)||0);if(state.remainingSeconds<=0)state.status='complete';return state.status;}

    return {tones:TONES.slice(),marks:MARKS.slice(),create:create,createRound:createRound,isCorrect:isCorrect,createState:createState,answer:answer,accuracy:accuracy,updateTime:updateTime,keyOf:keyOf,differenceCount:differenceCount};
});
