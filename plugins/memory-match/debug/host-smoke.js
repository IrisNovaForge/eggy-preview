(async function(){
    'use strict';
    var failures=[],finishCount=0,report=document.getElementById('report');
    function check(value,message){if(!value)failures.push(message);}
    function wait(ms){return new Promise(function(resolve){setTimeout(resolve,ms);});}
    check(!!window.__mmPlugins['memory-match'],'plugin registered');
    check(!!window.__mmEntrances['memory-match-house'],'entrance registered');
    var controller=window.__mmPlugins['memory-match'].create({
        pluginId:'memory-match',mount:document.getElementById('mount'),character:{id:'blossomTraveler'},net:{send:function(){}},
        api:{setTitle:function(){},finish:function(){finishCount++;}}
    });
    await wait(250);
    check(document.querySelectorAll('.mm-card').length===0,'title has no active cards before start');
    document.querySelector('[data-mm-start]').click();
    check(document.querySelectorAll('.mm-card').length===16,'plugin creates sixteen cards');
    document.querySelector('[data-mm-exit]').click();check(finishCount===1,'exit calls host finish once');
    controller.destroy();check(document.getElementById('mount').children.length===0,'host destroy clears mount');
    report.textContent=failures.length?'FAIL\n'+failures.join('\n'):'PASS';report.id=failures.length?'report-fail':'report-pass';document.title=failures.length?'FAIL':'PASS';
})();
