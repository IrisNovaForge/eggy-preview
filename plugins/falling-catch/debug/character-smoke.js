(function(){
    'use strict';
    var report=document.getElementById('report'),canvas=document.getElementById('canvas'),context=canvas.getContext('2d'),lines=[];
    function assert(condition,message){if(!condition)throw new Error(message);lines.push('PASS  '+message);}
    try{
        var renderer=window.DanboFallingCatchCharacter,profiles=renderer.allProfiles();
        assert(profiles.length===8,'all eight DANBO Traveler themes have simplified profiles');
        assert(new Set(profiles.map(function(item){return item.topper;})).size===8,'each Traveler has one readable original topper motif');
        profiles.forEach(function(view,index){
            var column=index%4,row=Math.floor(index/4);context.save();context.translate(100+column*200,112+row*126);context.scale(3.5,3.5);
            renderer.draw(context,view,{move:1,step:index%2?.7:-.7});context.restore();
            var hands=renderer.handAnchors({move:1,step:.5});assert(Number.isFinite(hands.left.x)&&Number.isFinite(hands.right.y),'profile '+(index+1)+' exposes stable collector hand anchors');
        });
        report.textContent=lines.join('\n');document.body.dataset.status='passed';
    }catch(error){report.textContent='FAIL  '+(error&&error.stack||error);document.body.dataset.status='failed';throw error;}
})();
