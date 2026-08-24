(function(){
    'use strict';
    var plugins={},active=null;
    var params=new URLSearchParams(location.search);
    var memory={};
    var travelerIds=['blossomTraveler','herbTraveler','saltCrystalTraveler','cloudwingTraveler','fruitbrewTraveler','berryTraveler','spicyFlameTraveler','goldenGrainTraveler'];
    var travelerNames={blossomTraveler:'蜜蕊旅人',herbTraveler:'香草旅人',saltCrystalTraveler:'盐晶旅人',cloudwingTraveler:'云翼旅人',fruitbrewTraveler:'果酿旅人',berryTraveler:'浆果旅人',spicyFlameTraveler:'辣焰旅人',goldenGrainTraveler:'金穗旅人'};
    var selectedTraveler=params.get('character');if(travelerIds.indexOf(selectedTraveler)<0)selectedTraveler='herbTraveler';
    window.DANBO_FALLING_CATCH_BASE_URL=new URL('../',location.href).href;
    window.DANBO_PLUGIN_HOST={
        register:function(plugin){plugins[plugin.id]=plugin;},
        registerEntrance:function(){},
        start:function(id,options){
            if(active&&active.destroy)active.destroy({status:'replaced'});
            var plugin=plugins[id];if(!plugin)throw new Error('Debug plugin not registered: '+id);
            var mount=document.getElementById('game');
            var ctx={
                pluginId:id,options:options||{},mount:mount,
                character:{schemaVersion:1,id:selectedTraveler,name:selectedTraveler,displayName:travelerNames[selectedTraveler],style:{},stats:{},abilities:[]},
                storage:{get:function(key,fallback){if(Object.prototype.hasOwnProperty.call(memory,key))return memory[key];try{var stored=localStorage.getItem('falling-catch.debug.'+key);if(stored!==null){memory[key]=JSON.parse(stored);return memory[key];}}catch(error){}return fallback;},set:function(key,value){memory[key]=value;try{localStorage.setItem('falling-catch.debug.'+key,JSON.stringify(value));}catch(error){}}},
                net:{send:function(type,payload){window.__fallingCatchEvents.push({type:type,payload:payload});}},
                api:{
                    setTitle:function(title){document.title=title+' · 独立试玩';},
                    play:function(){},
                    finish:function(result){window.__fallingCatchResult=result||{status:'exit'};if(active&&active.destroy)active.destroy(result);active=null;showExit(result);}
                }
            };
            active=plugin.create(ctx);return active;
        },
        stop:function(result){if(active&&active.destroy)active.destroy(result||{status:'stopped'});active=null;}
    };
    window.__fallingCatchEvents=[];
    function numberParam(name,fallback){var value=Number(params.get(name));return Number.isFinite(value)&&value>0?value:fallback;}
    function showExit(result){
        var mount=document.getElementById('game');mount.innerHTML='';
        var box=document.createElement('div');box.style.cssText='height:100%;display:grid;place-items:center;padding:24px;background:#dff1c5;font-family:system-ui,sans-serif;color:#24483f;text-align:center';
        var button=document.createElement('button');button.textContent='重新进入独立试玩';button.style.cssText='border:0;border-radius:14px;padding:13px 18px;background:#4f8b68;color:white;font-weight:800;cursor:pointer';button.onclick=start;
        var inner=document.createElement('div');var title=document.createElement('h1');title.textContent='已退出风中取物';var detail=document.createElement('p');detail.textContent=result&&result.score!==undefined?'本轮得分：'+result.score:'可以随时重新进入。';inner.appendChild(title);inner.appendChild(detail);inner.appendChild(button);box.appendChild(inner);mount.appendChild(box);
    }
    function start(){
        window.DANBO_PLUGIN_HOST.start('falling-catch',{
            lang:params.get('lang')||'zhs',seed:numberParam('seed',12345),durationMs:numberParam('duration',30)*1000,
            targetScore:numberParam('target',12),levelId:params.get('level')||1,initialScreen:params.has('level')?'stage-title':(params.get('screen')==='levels'?'select':'title'),bypassUnlocks:params.has('level'),forceFallback:params.get('fallback')==='1'
        });
        if(params.get('autoplay')==='1'){
            var attempts=0,timer=setInterval(function(){var button=document.querySelector('.dfc-primary');attempts++;if(button&&!button.disabled){clearInterval(timer);button.click();}else if(attempts>40)clearInterval(timer);},50);
        }
    }
    document.addEventListener('DOMContentLoaded',start);
})();
