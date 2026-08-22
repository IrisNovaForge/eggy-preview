(async function(){
    'use strict';
    var report=document.getElementById('report'),failures=[];
    function check(value,message){if(!value)failures.push(message);}
    function wait(ms){return new Promise(function(resolve){setTimeout(resolve,ms);});}
    var rules=window.DanboMemoryMatchRules.create();
    [6,8,10,12].forEach(function(pairCount){
        var faces=[];for(var f=0;f<pairCount;f++)faces.push('test-face-'+f);
        var first=rules.createDeck(faces,12345),second=rules.createDeck(faces,12345),counts={};
        check(first.length===pairCount*2,'level deck length '+pairCount);
        check(first.map(function(x){return x.faceId;}).join(',')===second.map(function(x){return x.faceId;}).join(','),'seed determinism '+pairCount);
        first.forEach(function(card){counts[card.faceId]=(counts[card.faceId]||0)+1;});
        check(Object.keys(counts).length===pairCount&&Object.keys(counts).every(function(key){return counts[key]===2;}),'exact pairs '+pairCount);
    });
    var saved={},storage={get:function(key,fallback){return Object.prototype.hasOwnProperty.call(saved,key)?saved[key]:fallback;},set:function(key,value){saved[key]=value;}};
    var results=[],game=window.DanboMemoryMatch.create({mount:document.getElementById('mount'),assetBase:'../',rules:rules,storage:storage,autoStart:true,startLevel:1,seed:12345,mismatchDelayMs:18,matchDelayMs:5,timerTickMs:10,targetSecondsByLevel:{3:.04,4:.04},onResult:function(result){results.push(result);}});
    var levels=game.getLevels();check(levels.map(function(level){return level.pairs;}).join(',')==='6,8,10,12','four configured pair counts');
    check(levels.map(function(level){return level.faceCount;}).join(',')==='6,8,10,12','four unique face sets');
    check(levels.map(function(level){return level.timeMode;}).join(',')==='none,stopwatch,target,target','four timing modes');
    var state=game.getState(),groups={};state.cards.forEach(function(card,index){(groups[card.pairId]||(groups[card.pairId]=[])).push(index);});
    var keys=Object.keys(groups),wrongA=groups[keys[0]][0],wrongB=groups[keys[1]][0];
    check(game.flip(wrongA),'first wrong flip accepted');check(game.flip(wrongB),'second wrong flip accepted');check(!game.flip(groups[keys[2]][0]),'third card locked');
    await wait(30);state=game.getState();check(state.cards[wrongA].state==='down'&&state.cards[wrongB].state==='down','mismatch returns down');
    async function solveCurrent(expectedLevel,expectedPairs){
        var current=game.getState(),map={};current.cards.forEach(function(card,index){(map[card.pairId]||(map[card.pairId]=[])).push(index);});
        check(current.level===expectedLevel,'started level '+expectedLevel);check(current.cards.length===expectedPairs*2,'card count level '+expectedLevel);
        check(new Set(current.cards.map(function(card){return card.faceId;})).size===expectedPairs,'face uniqueness level '+expectedLevel);
        for(var key of Object.keys(map)){current=game.getState();var pair=map[key];if(current.cards[pair[0]].state==='matched')continue;game.flip(pair[0]);game.flip(pair[1]);await wait(9);}
        await wait(18);current=game.getState();check(current.status==='won','win level '+expectedLevel);check(current.matchedPairs===expectedPairs,'all pairs level '+expectedLevel);
    }
    await solveCurrent(1,6);check(game.getState().timeMode==='none'&&game.getState().elapsedSeconds===0,'level one has no clock');check(game.getState().unlockedLevel===2&&saved.unlockedLevel===2,'level two unlocks');check(!game.start(4,9),'locked level cannot start');
    check(game.start(2,222),'level two starts');await solveCurrent(2,8);check(game.getState().elapsedSeconds>0&&!game.getState().targetExpired,'level two records time without target');check(game.getState().unlockedLevel===3,'level three unlocks');
    check(game.start(3,333),'level three starts');await wait(60);check(game.getState().targetExpired&&game.getState().status==='playing','level three target expiry continues play');await solveCurrent(3,10);check(game.getState().unlockedLevel===4,'level four unlocks');
    check(game.start(4,444),'level four starts');await wait(60);check(game.getState().targetExpired&&game.getState().status==='playing','level four target expiry continues play');await solveCurrent(4,12);check(results.length===4,'one result per level');check(results[2].withinTarget===false&&results[3].withinTarget===false,'soft target result recorded');
    game.restart(777);state=game.getState();check(state.status==='playing'&&state.level===4&&state.matchedPairs===0&&state.attempts===0,'restart resets current level');
    game.destroy();check(document.getElementById('mount').children.length===0,'destroy clears mount');
    report.textContent=failures.length?'FAIL\n'+failures.join('\n'):'PASS';report.id=failures.length?'report-fail':'report-pass';document.title=failures.length?'FAIL':'PASS';
})();
