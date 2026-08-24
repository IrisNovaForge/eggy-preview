(function(){
    'use strict';

    var SOUNDS=Object.freeze({
        'catch-success':Object.freeze({file:'assets/audio/catch-success.wav',volume:.82,poolSize:4}),
        'obstacle-hit':Object.freeze({file:'assets/audio/obstacle-hit.wav',volume:.78,poolSize:3}),
        'level-clear':Object.freeze({file:'assets/audio/outcome-clear.wav',volume:.78,poolSize:1}),
        'round-fail':Object.freeze({file:'assets/audio/outcome-retry.wav',volume:.76,poolSize:1})
    });

    function create(options){
        options=options||{};
        var assetBase=String(options.assetBase||window.DANBO_FALLING_CATCH_BASE_URL||'plugins/falling-catch/');
        if(assetBase.charAt(assetBase.length-1)!=='/')assetBase+='/';
        var version=String(options.assetVersion||'');
        var suffix=version?'?'+version.replace(/^\?/,''):'';
        var entries={},destroyed=false;

        function createNode(definition){
            var node=new Audio(assetBase+definition.file+suffix);
            node.preload='auto';node.volume=definition.volume;return node;
        }
        Object.keys(SOUNDS).forEach(function(name){
            var definition=SOUNDS[name],nodes=[];
            for(var i=0;i<definition.poolSize;i++)nodes.push(createNode(definition));
            entries[name]={nodes:nodes,cursor:0};
        });

        function play(name){
            var entry=entries[name];if(!entry||destroyed)return false;
            var node=null;
            for(var i=0;i<entry.nodes.length;i++){var candidate=entry.nodes[i];if(candidate.paused||candidate.ended){node=candidate;break;}}
            if(!node){node=entry.nodes[entry.cursor];entry.cursor=(entry.cursor+1)%entry.nodes.length;try{node.pause();}catch(error){}}
            try{node.currentTime=0;var result=node.play();if(result&&typeof result.catch==='function')result.catch(function(){});}catch(error){}
            return true;
        }
        function destroy(){
            if(destroyed)return;destroyed=true;
            Object.keys(entries).forEach(function(name){entries[name].nodes.forEach(function(node){try{node.pause();node.removeAttribute('src');node.load();}catch(error){}});});
            entries={};
        }
        return {play:play,has:function(name){return !!entries[name];},destroy:destroy};
    }

    window.DanboFallingCatchAudio={create:create,sounds:SOUNDS};
})();
