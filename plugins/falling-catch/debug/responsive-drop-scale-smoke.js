(function(){
    'use strict';
    var mount=document.getElementById('mount'),report=document.getElementById('report'),lines=[],nativeMatchMedia=window.matchMedia.bind(window);
    function assert(condition,message){if(!condition)throw new Error(message);lines.push('PASS  '+message);}
    function closeTo(actual,expected){return Math.abs(actual-expected)<1e-9;}
    function setDesktopMode(active){window.matchMedia=function(query){if(query.indexOf('(min-width:768px)')>=0&&query.indexOf('(pointer:fine)')>=0)return {matches:active,media:query,addEventListener:function(){},removeEventListener:function(){}};return nativeMatchMedia(query);};}
    function run(active,done){
        setDesktopMode(active);var spawn=null,rules=window.DanboFallingCatchRules.create({forceFallback:true}),game=window.DanboFallingCatch.create({mount:mount,rules:rules,levels:window.DanboFallingCatchLevels.all(),lang:'en',seed:731,durationMs:5000,targetScore:999,lives:3,character:{id:'herbTraveler'},onEvent:function(type,payload){if(type==='spawn'&&payload.type!=='recovery'&&!spawn)spawn=payload;}});
        rules.ready.then(function(){game.start();setTimeout(function(){game.destroy();done(null,spawn);},520);}).catch(function(error){game.destroy();done(error);});
    }
    function finish(error){window.matchMedia=nativeMatchMedia;if(error){report.textContent='FAIL  '+(error&&error.stack||error);document.body.dataset.status='failed';throw error;}report.textContent=lines.join('\n');document.body.dataset.status='passed';}
    run(true,function(error,desktop){
        if(error)return finish(error);
        run(false,function(nextError,mobile){
            try{
                if(nextError)throw nextError;assert(!!desktop&&!!mobile,'captured ordinary drops in desktop and mobile modes');
                var baseScales={leaf:.60,berry:.62,acorn:.58,stone:.58};
                assert(closeTo(desktop.visualScale,baseScales[desktop.kind]*.70),'desktop ordinary-drop artwork uses the 70 percent multiplier');
                assert(closeTo(mobile.visualScale,baseScales[mobile.kind]),'mobile ordinary-drop artwork keeps its existing scale');
                var desktopBaseRadius=desktop.kind==='stone'?2.05:1.95,mobileBaseRadius=mobile.kind==='stone'?2.05:1.95;
                assert(closeTo(desktop.collisionRadius,desktopBaseRadius*.70),'desktop collision radius follows the smaller silhouette');
                assert(closeTo(mobile.collisionRadius,mobileBaseRadius),'mobile collision radius remains unchanged');finish();
            }catch(testError){finish(testError);}
        });
    });
})();
