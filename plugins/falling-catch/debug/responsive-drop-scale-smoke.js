(function(){
    'use strict';
    var mount=document.getElementById('mount'),report=document.getElementById('report'),lines=[],nativeMatchMedia=window.matchMedia.bind(window);
    function assert(condition,message){if(!condition)throw new Error(message);lines.push('PASS  '+message);}
    function closeTo(actual,expected){return Math.abs(actual-expected)<1e-9;}
    function setMode(desktop,phone){window.matchMedia=function(query){if(query.indexOf('(min-width:768px)')>=0&&query.indexOf('(pointer:fine)')>=0)return {matches:desktop,media:query,addEventListener:function(){},removeEventListener:function(){}};if(query.indexOf('(max-width:640px)')>=0&&query.indexOf('(pointer:coarse)')>=0)return {matches:phone,media:query,addEventListener:function(){},removeEventListener:function(){}};return nativeMatchMedia(query);};}
    function run(desktop,phone,done){
        setMode(desktop,phone);var spawn=null,rules=window.DanboFallingCatchRules.create({forceFallback:true}),game=window.DanboFallingCatch.create({mount:mount,rules:rules,levels:window.DanboFallingCatchLevels.all(),lang:'en',seed:731,durationMs:5000,targetScore:999,lives:3,character:{id:'herbTraveler'},onEvent:function(type,payload){if(type==='spawn'&&payload.type!=='recovery'&&!spawn)spawn=payload;}});
        rules.ready.then(function(){game.start();setTimeout(function(){game.destroy();done(null,spawn);},520);}).catch(function(error){game.destroy();done(error);});
    }
    function finish(error){window.matchMedia=nativeMatchMedia;if(error){report.textContent='FAIL  '+(error&&error.stack||error);document.body.dataset.status='failed';throw error;}report.textContent=lines.join('\n');document.body.dataset.status='passed';}
    run(true,false,function(error,desktop){
        if(error)return finish(error);
        run(false,true,function(nextError,phone){
            try{
                if(nextError)throw nextError;assert(!!desktop&&!!phone,'captured ordinary drops in desktop and small-phone modes');
                var baseScales={leaf:.60,berry:.62,acorn:.58,stone:.58};
                assert(closeTo(desktop.visualScale,baseScales[desktop.kind]*.70),'desktop ordinary-drop artwork uses the 70 percent multiplier');
                assert(closeTo(phone.visualScale,baseScales[phone.kind]*1.25),'small-phone ordinary-drop artwork uses the 125 percent multiplier');
                var desktopBaseRadius=desktop.kind==='stone'?2.05:1.95,phoneBaseRadius=phone.kind==='stone'?2.05:1.95;
                assert(closeTo(desktop.collisionRadius,desktopBaseRadius*.70),'desktop collision radius follows the smaller silhouette');
                assert(closeTo(phone.collisionRadius,phoneBaseRadius),'small-phone collision radius remains unchanged');finish();
            }catch(testError){finish(testError);}
        });
    });
})();
