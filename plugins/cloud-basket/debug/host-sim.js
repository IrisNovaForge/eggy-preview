(function(){
    'use strict';
    var mount=document.getElementById('cloud-basket-debug');
    var memory={};
    window.DANBO_PLUGIN_HOST={
        registerEntrance:function(){},
        register:function(definition){
            window.cloudBasketDebugPlugin=definition;
            window.cloudBasketDebugInstance=definition.create({
                pluginId:'cloud-basket',
                mount:mount,
                character:{id:'dreamlightInspector',displayName:'验货蛋宝',style:{color:'#fff3c6',accent:'#ef8a7c'}},
                storage:{get:function(key,fallback){return Object.prototype.hasOwnProperty.call(memory,key)?memory[key]:fallback;},set:function(key,value){memory[key]=value;return true;},remove:function(key){delete memory[key];}},
                net:{mode:'offline',online:false,roomId:'offline-cloud-basket',selfId:'local-preview',send:function(type,payload){window.cloudBasketLastMessage={type:type,payload:payload};return true;},on:function(){return function(){};},off:function(){},getSnapshot:function(){return {mode:'offline',players:[{id:'local-preview',self:true}]};}},
                api:{setTitle:function(text){document.title=text+'｜独立插件试玩';},play:function(){},finish:function(){location.reload();}}
            });
            if(new URLSearchParams(location.search).get('direct')==='1'){
                setTimeout(function(){
                    var button=mount.querySelector('[data-start]');
                    if(button){
                        button.click();
                        var pick=new URLSearchParams(location.search).get('pick');
                        if(pick==='1'||pick==='2'||pick==='3')window.dispatchEvent(new KeyboardEvent('keydown',{key:pick,code:'Digit'+pick}));
                        var keys=new URLSearchParams(location.search).get('keys');
                        if(keys)keys.split(',').forEach(function(key,index){
                            setTimeout(function(){window.dispatchEvent(new KeyboardEvent('keydown',{key:key,code:key}));},80*(index+1));
                        });
                        document.body.dataset.smoke='running';
                    }
                },50);
            }
        }
    };
    window.addEventListener('error',function(){document.body.dataset.smoke='error';});
})();
