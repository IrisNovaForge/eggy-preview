(function(){
    'use strict';
    var report=document.getElementById('report'),lines=[];
    function assert(condition,message){if(!condition)throw new Error(message);lines.push('PASS  '+message);}
    var forceFallback=new URLSearchParams(location.search).get('fallback')==='1';
    var rules=window.DanboFallingCatchRules.create({baseUrl:new URL('../',location.href).href,forceFallback:forceFallback});
    rules.ready.then(function(){
        rules.reset(99,1000,3,2);
        assert(rules.snapshot().score===0,'reset starts at zero points');
        assert(rules.collect(1)===0,'first collectible keeps the round running');
        assert(rules.collect(1)===1,'target score wins the round');
        rules.reset(99,30000,3,12);
        assert(rules.hit()===0&&rules.lives()===2,'first obstacle removes one chance');
        rules.hit();assert(rules.hit()===2&&rules.lives()===0,'third obstacle loses the round');
        rules.reset(99,1000,3,12);for(var i=0;i<4;i++)rules.tick(250);
        assert(rules.status()===1&&rules.remainingMs()===0,'surviving the timer wins');
        rules.reset(77,30000,3,12);var first=rules.random();rules.reset(77,30000,3,12);
        assert(first===rules.random(),'seeded random sequence is repeatable');
        lines.push('MODE  '+rules.mode());report.textContent=lines.join('\n');document.body.dataset.status='passed';document.body.dataset.mode=rules.mode();
    }).catch(function(error){report.textContent='FAIL  '+(error&&error.stack||error);document.body.dataset.status='failed';throw error;});
})();
