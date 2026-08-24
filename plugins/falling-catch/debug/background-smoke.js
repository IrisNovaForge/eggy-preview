(function(){
    'use strict';
    var mount=document.getElementById('mount'),report=document.getElementById('report'),levels=window.DanboFallingCatchLevels.all(),expected=['meadow-field','wind-hill','crystal-valley','starwind-summit'],hashes=[],game,timer;
    function finish(error){clearTimeout(timer);if(game&&game.destroy)game.destroy();if(error){report.textContent='FAIL  '+(error&&error.stack||error);document.body.dataset.status='failed';throw error;}report.textContent='PASS  all four stages expose and render distinct original procedural background themes';document.body.dataset.status='passed';}
    function canvasHash(canvas){
        var context=canvas.getContext('2d'),width=canvas.width,height=canvas.height,data=context.getImageData(0,0,width,height).data,hash=2166136261;
        for(var y=8;y<height;y+=Math.max(8,Math.floor(height/12)))for(var x=8;x<width;x+=Math.max(8,Math.floor(width/20))){var index=(y*width+x)*4;hash^=data[index];hash=Math.imul(hash,16777619);hash^=data[index+1];hash=Math.imul(hash,16777619);hash^=data[index+2];hash=Math.imul(hash,16777619);}
        return hash>>>0;
    }
    function inspect(index){
        if(game){game.destroy();game=null;}
        if(index>=levels.length){try{if(new Set(hashes).size!==4)throw new Error('background render hashes are not distinct: '+hashes.join(','));finish();}catch(error){finish(error);}return;}
        var rules=window.DanboFallingCatchRules.create({forceFallback:true});game=window.DanboFallingCatch.create({mount:mount,rules:rules,levels:[levels[index]],lang:'en',seed:700+index,character:{id:'herbTraveler'}});
        rules.ready.then(function(){setTimeout(function(){try{var shell=mount.querySelector('.dfc-shell'),canvas=mount.querySelector('canvas');if(!shell||shell.dataset.backgroundTheme!==expected[index])throw new Error('Stage '+(index+1)+' background theme mismatch');if(!canvas||!canvas.width||!canvas.height)throw new Error('Stage '+(index+1)+' canvas did not render');hashes.push(canvasHash(canvas));inspect(index+1);}catch(error){finish(error);}},140);}).catch(finish);
    }
    try{inspect(0);timer=setTimeout(function(){finish(new Error('Timed out while inspecting four procedural backgrounds'));},7000);}catch(error){finish(error);}
})();
