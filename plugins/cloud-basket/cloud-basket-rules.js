(function(root,factory){
    'use strict';
    var api=factory();
    if(typeof module==='object'&&module.exports)module.exports=api;
    if(root)root.DanboCloudBasketRules=api;
})(typeof window!=='undefined'?window:globalThis,function(){
    'use strict';

    var SHAPES=['orb','sprout','fluff'];
    var TONES=['blue','gold','pink'];
    var MARKS=['dot','line','star'];

    function create(options){
        options=options||{};
        return {
            durationSeconds:Math.max(10,Number(options.durationSeconds)||45),
            candidateCount:3,
            shapes:SHAPES.slice(),
            tones:TONES.slice(),
            marks:MARKS.slice()
        };
    }

    function randomSource(seed){
        var state=(Number(seed)||0x6d2b79f5)>>>0;
        return function(){state^=state<<13;state^=state>>>17;state^=state<<5;return state>>>0;};
    }

    function keyOf(item){return item.shape+'|'+item.tone+'|'+item.mark;}

    function createRound(rules,seed,roundIndex){
        var next=randomSource(((Number(seed)||0x51f15e)^(Number(roundIndex)||0)*0x9e3779b1)>>>0);
        var target={
            shape:rules.shapes[next()%rules.shapes.length],
            tone:rules.tones[next()%rules.tones.length],
            mark:rules.marks[next()%rules.marks.length]
        };
        var correctIndex=next()%rules.candidateCount;
        var candidates=new Array(rules.candidateCount),alternatives=[];
        ['shape','tone','mark'].forEach(function(field){
            var values=field==='shape'?rules.shapes:(field==='tone'?rules.tones:rules.marks);
            values.forEach(function(value){
                if(value===target[field])return;
                var candidate={shape:target.shape,tone:target.tone,mark:target.mark};candidate[field]=value;alternatives.push(candidate);
            });
        });
        for(var shuffleIndex=alternatives.length-1;shuffleIndex>0;shuffleIndex--){
            var swapIndex=next()%(shuffleIndex+1),held=alternatives[shuffleIndex];alternatives[shuffleIndex]=alternatives[swapIndex];alternatives[swapIndex]=held;
        }
        candidates[correctIndex]={shape:target.shape,tone:target.tone,mark:target.mark};
        var alternativeIndex=0;
        for(var index=0;index<candidates.length;index++)if(index!==correctIndex)candidates[index]=alternatives[alternativeIndex++];
        return {target:target,candidates:candidates,correctIndex:correctIndex};
    }

    function isCorrect(round,index){return !!round&&Number(index)===round.correctIndex;}

    function createState(rules){return {status:'playing',correct:0,wrong:0,answered:0,remainingSeconds:rules.durationSeconds};}

    function answer(state,correct){
        if(!state||state.status!=='playing')return state;
        state.answered+=1;if(correct)state.correct+=1;else state.wrong+=1;return state;
    }

    function accuracy(state){return !state||!state.answered?100:Math.round(state.correct/state.answered*100);}

    function updateTime(state,remainingSeconds){
        if(!state||state.status!=='playing')return state&&state.status;
        state.remainingSeconds=Math.max(0,Number(remainingSeconds)||0);
        if(state.remainingSeconds<=0)state.status='complete';
        return state.status;
    }

    return {shapes:SHAPES.slice(),tones:TONES.slice(),marks:MARKS.slice(),create:create,createRound:createRound,isCorrect:isCorrect,createState:createState,answer:answer,accuracy:accuracy,updateTime:updateTime,keyOf:keyOf};
});
