(function(){
    'use strict';
    var report=document.getElementById('report');
    try{
        var plugin=window.__hostPlugins['falling-catch'];if(!plugin)throw new Error('plugin did not register');
        var finished=null,instance=plugin.create({pluginId:'falling-catch',options:{seed:4,durationMs:2000,targetScore:99,forceFallback:true,lang:'en'},mount:document.getElementById('mount'),character:{id:'test'},storage:{get:function(k,d){return d;},set:function(){}},api:{setTitle:function(){},play:function(){},finish:function(result){finished=result;}},net:null});
        if(!instance||typeof instance.destroy!=='function')throw new Error('plugin lifecycle missing destroy');
        setTimeout(function(){
            var button=document.querySelector('.dfc-entry-card .dfc-primary');if(!button||button.disabled)throw new Error('title page did not become ready');button.click();
            var level=document.querySelector('.dfc-level-choice');if(!level)throw new Error('stage selection did not open');level.click();
            setTimeout(function(){
                var start=document.querySelector('.dfc-ready-card .dfc-primary');if(!start||start.disabled)throw new Error('stage ready page did not open');start.click();
                if(!document.querySelector('.dfc-shell'))throw new Error('game shell missing');
                instance.destroy();if(document.getElementById('mount').children.length!==0)throw new Error('destroy did not clean mount');
                report.textContent='PASS host create / title / select / stage title / ready / start / destroy';document.body.dataset.status='passed';document.body.dataset.finished=finished?'yes':'no';
            },1050);
        },250);
    }catch(error){report.textContent='FAIL '+error.message;document.body.dataset.status='failed';throw error;}
})();
