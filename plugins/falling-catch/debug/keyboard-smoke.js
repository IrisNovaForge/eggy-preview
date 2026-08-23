(function(){
    'use strict';
    var report=document.getElementById('report'),lines=[];
    function assert(condition,message){if(!condition)throw new Error(message);lines.push('PASS  '+message);}
    function key(value,type){window.dispatchEvent(new KeyboardEvent(type||'keydown',{key:value,bubbles:true,cancelable:true}));}
    function finish(error,game){if(game&&game.destroy)game.destroy();if(error){report.textContent='FAIL  '+(error&&error.stack||error);document.body.dataset.status='failed';throw error;}report.textContent=lines.join('\n');document.body.dataset.status='passed';}
    try{
        var rules=window.DanboFallingCatchRules.create({forceFallback:true});
        var game=window.DanboFallingCatch.create({mount:document.getElementById('mount'),rules:rules,levels:window.DanboFallingCatchLevels.all(),lang:'en',seed:313,durationMs:1000,targetScore:999,character:{id:'herbTraveler'},onExit:function(){}});
        rules.ready.then(function(){setTimeout(function(){
            try{
                assert(game.screen()==='title'&&document.activeElement.classList.contains('dfc-primary'),'title page focuses its primary action');
                key('ArrowRight');assert(document.activeElement.classList.contains('dfc-title-exit'),'right arrow moves title focus to Exit');
                key('ArrowLeft');assert(document.activeElement.classList.contains('dfc-primary'),'left arrow returns title focus to Enter Stages');
                key('Enter');
                setTimeout(function(){try{
                    assert(game.screen()==='select'&&document.activeElement.dataset.levelId==='breezy-harvest','Enter opens stage selection and focuses Stage 1');
                    key('ArrowRight');key('ArrowRight');assert(document.activeElement.dataset.levelId==='crystal-valley-turn','arrow keys move focus through stage choices');
                    key('Enter');assert(game.screen()==='stage-title'&&game.level().id==='crystal-valley-turn','Enter selects the focused stage');
                    key('Enter');
                    setTimeout(function(){try{
                        assert(game.screen()==='ready'&&document.activeElement.classList.contains('dfc-primary'),'Enter skips the stage title and focuses Start');
                        key('ArrowRight');assert(document.activeElement.classList.contains('dfc-secondary'),'ready screen arrows reach the Back action');
                        key('ArrowLeft');key('Enter');assert(game.screen()==='running','Enter starts the round from the focused Start action');
                        assert(!document.querySelector('.dfc-card').contains(document.activeElement),'gameplay clears hidden menu focus');
                        key('ArrowRight');setTimeout(function(){try{
                            assert(game.motion().input===1,'right arrow remains gameplay movement while running');key('ArrowRight','keyup');
                            setTimeout(function(){try{
                                assert(game.screen()==='result','timer completion opens the result screen');
                                setTimeout(function(){try{
                                    var resultCard=document.querySelector('.dfc-card');if(!resultCard.contains(document.activeElement))key('ArrowRight');assert(resultCard.contains(document.activeElement),'result screen arrows acquire an action');
                                    var primary=document.activeElement;key('ArrowRight');assert(document.activeElement!==primary,'result screen arrows move between actions');
                                    key('Escape');assert(game.screen()==='select','Escape returns from results to stage selection');
                                    finish(null,game);
                                }catch(error){finish(error,game);}},30);
                            }catch(error){finish(error,game);}},2200);
                        }catch(error){finish(error,game);}},50);
                    }catch(error){finish(error,game);}},25);
                }catch(error){finish(error,game);}},25);
            }catch(error){finish(error,game);}
        },25);}).catch(function(error){finish(error,game);});
    }catch(error){finish(error);}
})();
