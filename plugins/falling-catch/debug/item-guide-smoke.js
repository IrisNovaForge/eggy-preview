(function(){
    'use strict';
    var report=document.getElementById('report'),mount=document.getElementById('mount'),lines=[],game,timer;
    function assert(condition,message){if(!condition)throw new Error(message);lines.push('PASS  '+message);}
    function finish(error){clearTimeout(timer);if(game&&game.destroy)game.destroy();if(error){report.textContent='FAIL  '+(error&&error.stack||error);document.body.dataset.status='failed';throw error;}report.textContent=lines.join('\n');document.body.dataset.status='passed';}
    try{
        var levels=window.DanboFallingCatchLevels.all(),expected=[
            ['harvest','stone','glimmer'],
            ['airflow-collectibles','seed','stone','glimmer'],
            ['wind-collectibles','stone','glimmer','sprout'],
            ['combo-collectibles','stone','glimmer','sprout']
        ];
        assert(levels.length===4&&levels.every(function(level,index){return level.guideItems&&level.guideItems.length===expected[index].length;}),'all four stages own explicit item-guide data');
        assert(levels[0].guideItems.every(function(item){return item.kind!=='sprout';})&&levels[1].guideItems.every(function(item){return item.kind!=='sprout';}),'Stages 1 and 2 do not advertise the unavailable Wind Sprout');
        var rules=window.DanboFallingCatchRules.create({forceFallback:true});
        game=window.DanboFallingCatch.create({mount:mount,rules:rules,levels:levels,lang:'zhs',seed:72,character:{id:'herbTraveler'}});
        function inspect(index){
            game.selectLevel(index+1);setTimeout(function(){try{
                assert(game.screen()==='ready','Stage '+(index+1)+' reaches its ready explanation');
                assert(!mount.querySelector('.dfc-ready-card .dfc-card-body'),'Stage '+(index+1)+' omits its requested introductory instruction line');
                var guide=mount.querySelector('.dfc-item-guide'),entries=Array.prototype.slice.call(mount.querySelectorAll('.dfc-item-guide-entry'));
                assert(guide&&guide.getAttribute('aria-label')==='本关物件','Stage '+(index+1)+' exposes the localized 本关物件 section');
                assert(entries.map(function(entry){return entry.dataset.guideItem;}).join(',')===expected[index].join(','),'Stage '+(index+1)+' lists only its actual item types in authored order');
                assert(entries.every(function(entry){return entry.querySelector('b').textContent&&entry.querySelector('small').textContent&&entry.querySelector('.dfc-item-guide-icon');}),'Stage '+(index+1)+' gives every item an original icon, name and effect');
                if(index===0)assert(guide.textContent.indexOf('自然采样物')>=0&&guide.textContent.indexOf('黯化硬壳')>=0&&guide.textContent.indexOf('恢复1次')>=0,'Stage 1 explains natural samples, hardened-shell loss and Eggshell Glimmer recovery');
                if(index===1)assert(guide.textContent.indexOf('轻盈自然物')>=0&&guide.textContent.indexOf('不受上升气流影响')>=0,'Stage 2 distinguishes light natural items from the stable Goldengrain Seed');
                if(index===2)assert(guide.textContent.indexOf('周期横风')>=0&&guide.textContent.indexOf('最多出现1次')>=0,'Stage 3 explains crosswind behavior and its one Wind Sprout');
                if(index===3)assert(guide.textContent.indexOf('连续接住3个')>=0&&guide.textContent.indexOf('最多出现2次')>=0,'Stage 4 explains the chain bonus and two Wind Sprouts');
                if(index+1<levels.length)inspect(index+1);else finish();
            }catch(error){finish(error);}},980);
        }
        rules.ready.then(function(){inspect(0);}).catch(finish);
        timer=setTimeout(function(){finish(new Error('Timed out while checking the four item guides'));},6500);
    }catch(error){finish(error);}
})();
