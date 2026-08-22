(async function(){
    'use strict';
    var report=document.getElementById('report'),failures=[];
    function check(value,message){if(!value)failures.push(message);}
    function wait(ms){return new Promise(function(resolve){setTimeout(resolve,ms);});}
    var rules=window.DanboMemoryMatchRules.create();
    var first=rules.createDeck(8,12345),second=rules.createDeck(8,12345);
    check(first.length===16,'deck length');
    check(first.map(function(x){return x.pairId;}).join(',')===second.map(function(x){return x.pairId;}).join(','),'seed determinism');
    var counts={};first.forEach(function(card){counts[card.pairId]=(counts[card.pairId]||0)+1;});
    check(Object.keys(counts).length===8&&Object.keys(counts).every(function(key){return counts[key]===2;}),'exact pairs');
    var results=0,game=window.DanboMemoryMatch.create({mount:document.getElementById('mount'),assetBase:'../',rules:rules,autoStart:true,seed:12345,mismatchDelayMs:25,matchDelayMs:10,onResult:function(){results++;}});
    var state=game.getState(),groups={};state.cards.forEach(function(card,index){(groups[card.pairId]||(groups[card.pairId]=[])).push(index);});
    var keys=Object.keys(groups),wrongA=groups[keys[0]][0],wrongB=groups[keys[1]][0];
    check(game.flip(wrongA),'first wrong flip accepted');check(game.flip(wrongB),'second wrong flip accepted');check(!game.flip(groups[keys[2]][0]),'third card locked');
    await wait(50);state=game.getState();check(state.cards[wrongA].state==='down'&&state.cards[wrongB].state==='down','mismatch returns down');
    for(var i=0;i<keys.length;i++){state=game.getState();var pair=groups[keys[i]];if(state.cards[pair[0]].state==='matched')continue;game.flip(pair[0]);game.flip(pair[1]);await wait(18);}
    await wait(30);state=game.getState();check(state.status==='won','game wins');check(state.matchedPairs===8,'all pairs matched');check(results===1,'result emitted once');
    game.restart(777);state=game.getState();check(state.status==='playing'&&state.matchedPairs===0&&state.attempts===0,'restart resets state');game.destroy();check(document.getElementById('mount').children.length===0,'destroy clears mount');
    report.textContent=failures.length?'FAIL\n'+failures.join('\n'):'PASS';report.id=failures.length?'report-fail':'report-pass';document.title=failures.length?'FAIL':'PASS';
})();

