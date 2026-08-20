import * as THREE from '../vendor/three-r180/three.module.min.js';

window.THREE=THREE;
window.DANBO_VISUAL_QUALITY={mode:'balanced',high:false,low:false};

function material(color){return new THREE.MeshToonMaterial({color:color});}
function mesh(geometry,color){return new THREE.Mesh(geometry,material(color));}

window.createEggMesh=function(bodyColor,accentColor,characterId){
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
    function add(geometry,color,x,y,z,sx,sy,sz,rz){var part=mesh(geometry,color);part.position.set(x,y,z);part.scale.set(sx||1,sy||1,sz||1);part.rotation.z=rz||0;group.add(part);return part;}
    if(characterId==='blossomTraveler'){
        for(var p=0;p<5;p++){var angle=p*Math.PI*2/5;add(new THREE.SphereGeometry(.1,14,10),0xef4a5b,Math.cos(angle)*.16,1.48+Math.sin(angle)*.13,.04,1,.62,.72,angle);}
        add(new THREE.SphereGeometry(.075,14,10),0xffd65c,0,1.48,.09,1,1,.8,0);
    }else if(characterId==='herbTraveler'){
        add(new THREE.SphereGeometry(.14,16,12),0x62a960,-.07,1.5,.02,.58,1.35,.42,-.48);add(new THREE.SphereGeometry(.12,16,12),0x8fd16a,.1,1.48,.01,.5,1.2,.4,.62);
    }else if(characterId==='saltCrystalTraveler'){
        add(new THREE.OctahedronGeometry(.13),0x9bd8ef,0,1.53,.02,.72,1.38,.62,0);add(new THREE.OctahedronGeometry(.09),0xe7b6c8,-.17,1.43,.01,.72,1.15,.58,-.3);add(new THREE.OctahedronGeometry(.08),0xf5f0ff,.16,1.42,.01,.65,1,.55,.28);
    }else if(characterId==='cloudwingTraveler'){
        add(new THREE.SphereGeometry(.15,16,12),0xffffff,-.13,1.46,.01,1,.7,.65,0);add(new THREE.SphereGeometry(.18,16,12),0xe7f8ff,.03,1.5,.02,1,.75,.65,0);add(new THREE.SphereGeometry(.13,16,12),0xffffff,.2,1.45,.01,1,.68,.62,0);
    }else if(characterId==='fruitbrewTraveler'){
        add(new THREE.SphereGeometry(.15,18,12),0xf06f68,0,1.47,.02,1,1,.8,0);add(new THREE.SphereGeometry(.1,14,10),0x78b766,.12,1.58,.02,.75,.38,.42,-.55);
    }else if(characterId==='berryTraveler'){
        add(new THREE.SphereGeometry(.095,16,12),0xd85c91,-.09,1.46,.02,1,1,.75,0);add(new THREE.SphereGeometry(.095,16,12),0x7657b8,.09,1.46,.02,1,1,.75,0);add(new THREE.SphereGeometry(.095,16,12),0xb86ac0,0,1.59,.02,1,1,.75,0);
    }else if(characterId==='spicyFlameTraveler'){
        add(new THREE.ConeGeometry(.15,.32,8),0xf26f52,0,1.53,.02,1,1,.68,0);add(new THREE.ConeGeometry(.075,.18,8),0xffd05a,.02,1.51,.13,1,1,.7,0);
    }else{
        add(new THREE.CapsuleGeometry(.025,.28,4,8),0x9c7434,0,1.43,.02,1,1,1,0);[-1,1].forEach(function(side){for(var g=0;g<3;g++)add(new THREE.SphereGeometry(.055,12,8),0xf3d36a,side*.07,1.38+g*.09,.02,1,.58,.55,side*.45);});
    }
    group.userData._decorArms=arms;
    return group;
};
window._updateCharacterPremiumRig=function(){};
window._animateCuteCharacterDetails=function(){};

const BUILD='20260820.8';
function loadScript(source){
    return new Promise(function(resolve,reject){
        var script=document.createElement('script');script.src=source+(source.indexOf('?')>=0?'&':'?')+'v='+BUILD;script.onload=resolve;script.onerror=reject;document.body.appendChild(script);
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
