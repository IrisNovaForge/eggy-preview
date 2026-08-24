(function(){
    'use strict';
    var report=document.getElementById('report'),lines=[];
    function assert(condition,message){if(!condition)throw new Error(message);lines.push('PASS  '+message);}
    try{
        assert(window.DanboFallingCatchAudio&&window.DanboFallingCatchAudio.sounds['catch-success'],'the plugin declares only the selected ordinary catch sound');
        assert(Object.keys(window.DanboFallingCatchAudio.sounds).length===1,'no other gameplay or UI sound is bundled');
        var audio=window.DanboFallingCatchAudio.create({assetBase:window.DANBO_FALLING_CATCH_BASE_URL,assetVersion:'v=test'});
        assert(window.__audioNodes.length===4&&window.__audioNodes.every(function(node){return /assets\/audio\/catch-success\.wav\?v=test$/.test(node.src);}), 'the selected WAV is preloaded into a short overlap-safe pool');
        assert(audio.play('catch-success')&&window.__audioNodes[0].playCount===1&&window.__audioNodes[0].currentTime===0,'ordinary catch restarts and plays the selected sound');
        assert(audio.play('confirm')===false,'unrelated existing events are not replaced by the catch sound');
        audio.destroy();assert(window.__audioNodes.every(function(node){return node.pauseCount>=1&&!node.src;}),'destroy stops and releases every audio node');
        report.textContent=lines.join('\n');document.body.dataset.status='passed';
    }catch(error){report.textContent='FAIL  '+(error&&error.stack||error);document.body.dataset.status='failed';throw error;}
})();
