(function(){
    'use strict';
    var report=document.getElementById('report'),lines=[];
    function assert(condition,message){if(!condition)throw new Error(message);lines.push('PASS  '+message);}
    function finish(error,game){if(game&&game.destroy)game.destroy();if(error){report.textContent='FAIL  '+(error&&error.stack||error);document.body.dataset.status='failed';throw error;}report.textContent=lines.join('\n');document.body.dataset.status='passed';}
    try{
        var rules=window.DanboFallingCatchRules.create({forceFallback:true});
        var game=window.DanboFallingCatch.create({mount:document.getElementById('mount'),rules:rules,levels:window.DanboFallingCatchLevels.all(),lang:'zhs',seed:19,character:{id:'herbTraveler'}});
        rules.ready.then(function(){
            try{
                assert(game.screen()==='title'&&!!document.querySelector('.dfc-entry-card'),'plugin opens on the game title page');
                assert(!document.querySelector('.dfc-brand-copy small'),'top brand does not render the removed overall-game subtitle');
                assert(!document.querySelector('.dfc-entry-card .dfc-card-eyebrow'),'title card does not render the removed overall-game subtitle');
                assert(!document.querySelector('.dfc-traveler-badge'),'top bar does not render a decorative Traveler portrait');
                assert(document.querySelector('.dfc-entry-card h1').textContent==='风中取物','the overall game title uses 风中取物 while stage names remain independent');
                assert(!document.querySelector('.dfc-entry-card .dfc-intro-traveler'),'the overall title card does not show the selected Traveler portrait option');
                assert(document.querySelector('.dfc-entry-card').textContent.indexOf('进入关卡')>=0,'title page exposes the stage entry action');
                game.showLevelSelect();
                assert(game.screen()==='select'&&document.querySelectorAll('.dfc-level-choice').length===4,'stage selection shows all four stages');
                document.querySelector('[data-level-id="crystal-valley-turn"]').click();
                assert(game.screen()==='stage-title'&&document.querySelector('.dfc-stage-title-card').textContent.indexOf('回旋')>=0,'selected Stage 3 opens its dedicated title page');
                assert(!document.querySelector('.dfc-stage-title-card img'),'stage title page contains no Traveler portrait');
                setTimeout(function(){
                    try{
                        assert(game.screen()==='ready'&&document.querySelector('.dfc-ready-card').textContent.indexOf('开始接取')>=0,'stage title advances to the stage ready page');
                        assert(!document.querySelector('.dfc-ready-card img')&&!document.querySelector('.dfc-intro-traveler'),'stage ready page contains no Traveler portrait');
                        assert(document.querySelector('.dfc-ready-card').textContent.indexOf('30秒')>=0,'ready page keeps the shared goal values visible');
                        finish(null,game);
                    }catch(error){finish(error,game);}
                },980);
            }catch(error){finish(error,game);}
        }).catch(function(error){finish(error,game);});
    }catch(error){finish(error);}
})();
