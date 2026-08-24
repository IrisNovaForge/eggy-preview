(function(){
    'use strict';
    var report=document.getElementById('report'),lines=[];
    function assert(condition,message){if(!condition)throw new Error(message);lines.push('PASS  '+message);}
    try{
        assert(window.DanboFallingCatchAudio&&window.DanboFallingCatchAudio.sounds['catch-success'],'the plugin declares the selected ordinary catch sound');
        assert(window.DanboFallingCatchAudio.sounds['obstacle-hit'],'the plugin declares the selected obstacle-hit sound');
        assert(window.DanboFallingCatchAudio.sounds['level-clear'],'the plugin declares the original level-clear sound');
        assert(window.DanboFallingCatchAudio.sounds['round-fail'],'the plugin declares the original round-fail sound');
        assert(Object.keys(window.DanboFallingCatchAudio.sounds).length===4,'only the four approved gameplay sounds are bundled');
        var audio=window.DanboFallingCatchAudio.create({assetBase:window.DANBO_FALLING_CATCH_BASE_URL,assetVersion:'v=test'});
        var catchNodes=window.__audioNodes.filter(function(node){return /assets\/audio\/catch-success\.wav\?v=test$/.test(node.src);});
        var hitNodes=window.__audioNodes.filter(function(node){return /assets\/audio\/obstacle-hit\.wav\?v=test$/.test(node.src);});
        var clearNodes=window.__audioNodes.filter(function(node){return /assets\/audio\/level-clear\.wav\?v=test$/.test(node.src);});
        var failNodes=window.__audioNodes.filter(function(node){return /assets\/audio\/round-fail\.wav\?v=test$/.test(node.src);});
        assert(catchNodes.length===4,'the catch WAV is preloaded into its overlap-safe pool');
        assert(hitNodes.length===3,'the obstacle WAV is preloaded into a compact overlap-safe pool');
        assert(clearNodes.length===1&&failNodes.length===1,'each outcome WAV uses one dedicated node');
        assert(audio.play('catch-success')&&window.__audioNodes[0].playCount===1&&window.__audioNodes[0].currentTime===0,'ordinary catch restarts and plays the selected sound');
        assert(audio.play('obstacle-hit')&&hitNodes[0].playCount===1&&hitNodes[0].currentTime===0,'obstacle collision restarts and plays the selected sound');
        assert(audio.play('level-clear')&&clearNodes[0].playCount===1,'level clear plays its dedicated sound');
        assert(audio.play('round-fail')&&failNodes[0].playCount===1,'round failure plays its dedicated sound');
        assert(audio.play('confirm')===false,'unrelated existing events are not replaced by either plugin sound');
        audio.destroy();assert(window.__audioNodes.every(function(node){return node.pauseCount>=1&&!node.src;}),'destroy stops and releases every audio node');
        report.textContent=lines.join('\n');document.body.dataset.status='passed';
    }catch(error){report.textContent='FAIL  '+(error&&error.stack||error);document.body.dataset.status='failed';throw error;}
})();
