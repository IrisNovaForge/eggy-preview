import * as THREE from '../vendor/three-r180/three.module.min.js';

window.THREE=THREE;
window.DANBO_VISUAL_QUALITY={mode:'balanced',high:false,low:false};

function material(color){return new THREE.MeshToonMaterial({color:color});}
function mesh(geometry,color){return new THREE.Mesh(geometry,material(color));}

window.createEggMesh=function(bodyColor,accentColor){
    var group=new THREE.Group();
    var body=mesh(new THREE.SphereGeometry(.72,32,24),bodyColor);body.scale.set(1,1.17,.9);body.position.y=.72;group.add(body);
    var belly=mesh(new THREE.SphereGeometry(.48,24,18),0xfff8e8);belly.scale.set(1,.9,.32);belly.position.set(0,.56,.58);group.add(belly);
    var eyeGeo=new THREE.SphereGeometry(.065,16,12);
    var leftEye=mesh(eyeGeo,0x273450);leftEye.position.set(-.22,.9,.66);group.add(leftEye);
    var rightEye=mesh(eyeGeo,0x273450);rightEye.position.set(.22,.9,.66);group.add(rightEye);
    var mouth=new THREE.Mesh(new THREE.TorusGeometry(.085,.018,8,20,Math.PI),material(accentColor));mouth.rotation.z=Math.PI;mouth.position.set(0,.69,.69);group.add(mouth);
    var arms=[];
    [-1,1].forEach(function(side){
        var pivot=new THREE.Group();pivot.position.set(side*.66,.66,0);pivot.userData._side=side;
        var arm=mesh(new THREE.CapsuleGeometry(.075,.28,5,10),bodyColor);arm.rotation.z=-side*.42;arm.position.set(side*.12,-.08,0);pivot.add(arm);group.add(pivot);arms.push(pivot);
    });
    [-1,1].forEach(function(side){var foot=mesh(new THREE.SphereGeometry(.16,18,12),accentColor);foot.scale.set(1.25,.55,1.35);foot.position.set(side*.3,.02,.05);group.add(foot);});
    var star=mesh(new THREE.OctahedronGeometry(.1),0xffd65c);star.position.set(0,1.48,.05);star.rotation.z=.3;group.add(star);
    group.userData._decorArms=arms;
    return group;
};
window._updateCharacterPremiumRig=function(){};
window._animateCuteCharacterDetails=function(){};

function loadScript(source){
    return new Promise(function(resolve,reject){
        var script=document.createElement('script');script.src=source;script.onload=resolve;script.onerror=reject;document.body.appendChild(script);
    });
}

try{
    await loadScript('../brick-breaker-wasm.js');
    await loadScript('../brick-breaker-character.js');
    await loadScript('../brick-breaker-rules.js');
    await loadScript('../brick-breaker-core.js');
    await loadScript('debug.js');
}catch(error){
    console.error('[brick-breaker] debug startup failed',error);
    document.getElementById('brick-breaker-debug').textContent='Plugin debug preview failed to start.';
}
