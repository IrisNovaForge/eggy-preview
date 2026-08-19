// ============================================================
// Traveler action effects
// Public function names and a few state fields remain stable for plugin compatibility.
// The visible geometry, motion language and timing are project-owned travel motifs.
// ============================================================
if(!window._allProjectiles) window._allProjectiles=[];

function _moveHitDetect(sourceEgg, projPos, range, callback){
    for(var i=0;i<allEggs.length;i++){
        var t=allEggs[i];
        if(t===sourceEgg||!t.alive||t.heldBy)continue;
        var dx=t.mesh.position.x-projPos.x,dz=t.mesh.position.z-projPos.z;
        var dist=DANBO_WASM.len2D(dx,dz);
        if(dist<range&&callback(t,dist,dx,dz))return true;
    }
    return false;
}

function _moveApplyKnockback(target,dx,dz,dist,force,vy,opts){
    opts=opts||{};target.vx+=dx*force;target.vz+=dz*force;target.vy=vy;
    target.squash=opts.squash||0.5;target.throwTimer=opts.throwTimer||25;target._bounces=opts.bounces||1;
    if(opts.stunDmg)_addStunDamage(target,opts.stunDmg);
    if(opts.fire)target._onFire=opts.fire;
    if(opts.electrocute){target._electrocuted=opts.electrocute;target._elecKnockDir={x:-dx/(dist||1),z:-dz/(dist||1)};target.vx=0;target.vz=0;}
    if(opts.slashEffect)spawnSlashEffect(target,opts.slashDir||0);
    _dropNpcStolenCoins(target);playHitSound(target.mesh.position.x,target.mesh.position.z);
}

function _travelerLeafGeometry(scale){
    var s=scale||1,shape=new THREE.Shape();
    shape.moveTo(0,-0.55*s);
    shape.bezierCurveTo(0.48*s,-0.22*s,0.42*s,0.34*s,0,0.62*s);
    shape.bezierCurveTo(-0.42*s,0.34*s,-0.48*s,-0.22*s,0,-0.55*s);
    return new THREE.ShapeGeometry(shape,4);
}
function _travelerMat(color,opacity){return new THREE.MeshBasicMaterial({color:color,transparent:true,opacity:opacity,side:THREE.DoubleSide,depthWrite:false});}
function _createTravelerProjectile(type,params,radius){
    var grp=new THREE.Group(),main=params.color||0x73C96B,accent=params.ringColor||0xD7F2A4;
    if(type==='windRibbon'){
        // Wind ribbons: three offset strips, not a crescent or blade.
        for(var i=0;i<3;i++){
            var r=new THREE.Mesh(new THREE.PlaneGeometry(0.98-i*0.14,0.16,3,1),_travelerMat(i===1?accent:main,0.72-i*0.11));
            r.position.set((i-1)*0.18,(i-1)*0.22,0);r.rotation.z=(i-1)*0.16;grp.add(r);
        }
    }else if(type==='grainPod'){
        // Faceted grain pod and orbiting seeds; intentionally no flame shape/palette.
        var pod=new THREE.Mesh(new THREE.OctahedronGeometry(radius*0.9,0),_travelerMat(0xD9B85F,0.9));
        pod.scale.set(0.72,1.15,0.72);grp.add(pod);
        for(var j=0;j<5;j++){
            var grain=new THREE.Mesh(new THREE.SphereGeometry(0.09,5,4),_travelerMat(j%2?0xF4D98A:0x8FAF55,0.78));
            var a=j*Math.PI*2/5;grain.position.set(Math.sin(a)*0.46,Math.cos(a)*0.28,Math.cos(a)*0.22);grp.add(grain);
        }
    }else{
        var core=new THREE.Mesh(new THREE.OctahedronGeometry(radius,1),_travelerMat(main,0.86));
        core.scale.set(0.9,1.08,0.9);grp.add(core);
        for(var k=0;k<3;k++){
            var leaf=new THREE.Mesh(_travelerLeafGeometry(radius*0.72),_travelerMat(k===1?accent:main,0.72));
            leaf.position.set(Math.sin(k*2.1)*radius*0.7,Math.cos(k*1.7)*radius*0.42,Math.cos(k*2.1)*radius*0.55);
            leaf.rotation.set(k*0.55,k*1.3,k*0.7);grp.add(leaf);
        }
    }
    return grp;
}

function MoveProjectile_execute(egg,dir,params){
    var type=params.type||'normal',spd=params.speed,life=params.life;
    var sx=egg.mesh.position.x+Math.sin(dir)*1.5,sy=egg.mesh.position.y+0.7,sz=egg.mesh.position.z+Math.cos(dir)*1.5;
    var radius=params.isPlayer?(params.radius||0.42):(params.npcRadius||0.36);
    var ball=_createTravelerProjectile(type,params,radius);ball.position.set(sx,sy,sz);ball.rotation.y=dir;scene.add(ball);
    var ring=new THREE.Mesh(_travelerLeafGeometry(radius*0.9),_travelerMat(params.ringColor||0xD7F2A4,0.34));
    ring.position.copy(ball.position);ring.rotation.x=-Math.PI/2;scene.add(ring);
    var proj={ball:ball,ring:ring,vx:Math.sin(dir)*spd,vz:Math.cos(dir)*spd,life:life,owner:egg,burns:!!params.burns,
        isWindRibbon:type==='windRibbon',isGrainPod:type==='grainPod',isPlayer:!!params.isPlayer,phase:Math.random()*Math.PI*2,baseY:sy,dir:dir};
    if(params.isPlayer)window._playerTravelProjectile=proj;
    window._allProjectiles.push(proj);return proj;
}
function MoveProjectile_update(proj){
    proj.ball.position.x+=proj.vx;proj.ball.position.z+=proj.vz;proj.phase+=proj.isWindRibbon?0.12:0.085;
    proj.ball.position.y=proj.baseY+Math.sin(proj.phase)*0.13;
    var side=Math.sin(proj.phase*0.73)*0.018;proj.ball.position.x+=Math.cos(proj.dir)*side;proj.ball.position.z-=Math.sin(proj.dir)*side;
    proj.ring.position.copy(proj.ball.position);proj.ring.rotation.z+=0.07;proj.ball.rotation.z+=proj.isWindRibbon?0.035:0.075;
    if(proj.isGrainPod&&proj.ball.children){for(var i=1;i<proj.ball.children.length;i++){var ch=proj.ball.children[i],a=proj.phase+i*1.2;ch.position.set(Math.sin(a)*0.46,Math.cos(a*0.8)*0.26,Math.cos(a)*0.28);}}
    proj.life--;
    if(proj.ball.children)for(var oi=0;oi<proj.ball.children.length;oi++)if(proj.ball.children[oi].material)proj.ball.children[oi].material.opacity=Math.min(proj.ball.children[oi].material.opacity,proj.life/30);
    if(proj.ring&&proj.ring.material)proj.ring.material.opacity=Math.min(0.34,proj.life/30);
    _moveHitDetect(proj.owner,proj.ball.position,1.5,function(target){
        target.vx+=proj.vx*COMBAT.projectile.knockbackMul;target.vz+=proj.vz*COMBAT.projectile.knockbackMul;target.vy=COMBAT.projectile.vy;
        target.squash=COMBAT.projectile.squash;target.throwTimer=COMBAT.projectile.throwTimer;target._bounces=COMBAT.projectile.bounces;
        if(proj.isPlayer)_addStunDamage(target,COMBAT.projectile.stunDmg);else target._stunTimer=COMBAT.projectile.npcStunTimer;
        if(proj.burns)target._onFire=COMBAT.projectile.fireDuration;
        _dropNpcStolenCoins(target);playHitSound(target.mesh.position.x,target.mesh.position.z);proj.life=0;return true;
    });
    return proj.life>0;
}
function MoveProjectile_cleanup(proj){scene.remove(proj.ball);scene.remove(proj.ring);if(proj.isPlayer&&window._playerTravelProjectile===proj)window._playerTravelProjectile=null;}

function _ensureTrailSweepLeaves(){
    if(window._trailSweepLeaves)return;
    window._trailSweepLeaves=[];
    var colors=[0x89C96A,0xF3D36A,0xF39AA5,0xA7D9E8];
    for(var i=0;i<10;i++){
        var leaf=new THREE.Mesh(_travelerLeafGeometry(0.32-i*0.012),_travelerMat(colors[i%colors.length],0.56));
        leaf.visible=false;scene.add(leaf);window._trailSweepLeaves.push(leaf);
    }
}
function MoveSpin_execute(egg,dir,params){
    egg._trailSweepActive=Math.min(params.duration||45,48);egg._trailSweepDir=dir;egg._trailSweepPhase=0;
    egg._isSpiceGust=!!params.isSpiceGust;egg.vy=egg._isSpiceGust?0:0.08;
}
function MoveSpin_update(egg,inputFn){
    egg._trailSweepActive--;egg._trailSweepPhase=(egg._trailSweepPhase||0)+0.22;
    var ud=egg.mesh.userData,phase=egg._trailSweepPhase;
    // Alternating travel-cloak sweep; the body never performs a continuous 360-degree spin.
    if(ud.rightArm){ud.rightArm.visible=true;ud.rightArm.position.set(0.48,0.28,0.75+Math.sin(phase)*0.35);}
    if(ud.leftArm){ud.leftArm.visible=true;ud.leftArm.position.set(-0.48,0.28,0.75-Math.sin(phase)*0.35);}
    if(!egg._trailSweepDir)egg._trailSweepDir=egg.mesh.rotation.y;
    if(inputFn){var inp=inputFn(),len=DANBO_WASM.len2D(inp.mx,inp.mz);if(egg._isSpiceGust&&len>0.1)egg._trailSweepDir=Math.atan2(inp.mx,inp.mz);else egg._trailSweepDir+=((inp.left?1:0)-(inp.right?1:0))*0.018;}
    var sway=Math.sin(phase)*0.34,speed=egg._isSpiceGust?0.72:1.05;
    egg.vx=Math.sin(egg._trailSweepDir+sway)*MAX_SPEED*speed;egg.vz=Math.cos(egg._trailSweepDir+sway)*MAX_SPEED*speed;
    if(egg._isSpiceGust)egg.vy=0;
    if(egg.mesh.position.y<0.45)egg.mesh.position.y=0.45;
    _ensureTrailSweepLeaves();
    if(egg.isPlayer){for(var i=0;i<window._trailSweepLeaves.length;i++){var leaf=window._trailSweepLeaves[i],a=phase-i*0.34,r=0.72+i*0.07;leaf.visible=true;leaf.position.set(egg.mesh.position.x+Math.sin(a)*r,egg.mesh.position.y+0.35+Math.sin(a*0.7)*0.32,egg.mesh.position.z+Math.cos(a)*r);leaf.rotation.set(-0.5,a,a*0.4);}}
    _moveHitDetect(egg,egg.mesh.position,3.1,function(t,dist,dx,dz){if(t._slamImmune>0)return false;if(!t._trailSweepHitCD)t._trailSweepHitCD=0;if(t._trailSweepHitCD>0){t._trailSweepHitCD--;return false;}var d=dist||1;_moveApplyKnockback(t,dx/d,dz/d,dist,COMBAT.spin.force,COMBAT.spin.vy,{squash:COMBAT.spin.squash,throwTimer:COMBAT.spin.throwTimer,bounces:COMBAT.spin.bounces,stunDmg:COMBAT.spin.stunDmg});t._trailSweepHitCD=14;return false;});
    if(egg._trailSweepActive<=0){MoveSpin_end(egg);return false;}return true;
}
function MoveSpin_end(egg){egg.vx*=0.3;egg.vz*=0.3;egg._trailSweepDir=0;egg._isSpiceGust=false;if(window._trailSweepLeaves)for(var i=0;i<window._trailSweepLeaves.length;i++)window._trailSweepLeaves[i].visible=false;var ud=egg.mesh.userData;if(ud.rightArm)ud.rightArm.visible=false;if(ud.leftArm)ud.leftArm.visible=false;}

function _ensureCanopyLift(){
    if(window._canopyLiftLeaves)return;
    window._canopyLiftLeaves=[];window._canopyLiftLeafMats={blue:_travelerMat(0xA9D98A,0.72),blueHead:_travelerMat(0xF6E49A,0.82),fire:_travelerMat(0xF09A7A,0.72),fireHead:_travelerMat(0xFFE0A3,0.82)};
    for(var i=0;i<12;i++){var p=new THREE.Mesh(_travelerLeafGeometry(0.38-i*0.014),window._canopyLiftLeafMats[i?'blue':'blueHead']);p.visible=false;scene.add(p);window._canopyLiftLeaves.push(p);}
    window._canopyLiftFist=new THREE.Mesh(_travelerLeafGeometry(0.35),_travelerMat(0xFFF4C8,0.8));window._canopyLiftFist.visible=false;scene.add(window._canopyLiftFist);
}
function MoveCanopyLift_execute(egg,dir,params){
    egg._canopyLiftActive=Math.min(params.duration||55,52);egg.vy=JUMP_FORCE*(params.jumpMul||1.25);var f=(params.fwdSpeed||0.2)*0.72;
    egg.vx=Math.sin(dir)*f;egg.vz=Math.cos(dir)*f;egg.squash=0.58;egg._canopyLiftFwdX=egg.vx;egg._canopyLiftFwdZ=egg.vz;egg._canopyLiftStartSet=false;egg._canopyLiftDir=dir;
}
function MoveCanopyLift_update(egg){
    _ensureCanopyLift();var ud=egg.mesh.userData;if(ud.rightArm){ud.rightArm.visible=true;ud.rightArm.position.set(0.42,0.88,0.45);ud.rightArm.scale.set(1.1,1.35,1.1);}
    window._canopyLiftFist.visible=!!egg.isPlayer;window._canopyLiftFist.position.set(egg.mesh.position.x+Math.sin(egg._canopyLiftDir)*0.45,egg.mesh.position.y+1.65,egg.mesh.position.z+Math.cos(egg._canopyLiftDir)*0.45);
    if(egg._canopyLiftFwdX!==undefined){egg.vx=egg._canopyLiftFwdX;egg.vz=egg._canopyLiftFwdZ;}
    if(!egg._canopyLiftStartSet){egg._canopyLiftStartSet=true;egg._canopyLiftStartX=egg.mesh.position.x;egg._canopyLiftStartY=egg.mesh.position.y;egg._canopyLiftStartZ=egg.mesh.position.z;}
    if(egg.isPlayer){for(var i=0;i<window._canopyLiftLeaves.length;i++){var p=window._canopyLiftLeaves[i],t=i/window._canopyLiftLeaves.length,a=egg._canopyLiftDir+Math.sin(i*1.7)*0.35;p.visible=true;p.position.set(egg.mesh.position.x*(1-t)+egg._canopyLiftStartX*t+Math.sin(a)*0.42,egg.mesh.position.y*(1-t)+egg._canopyLiftStartY*t+0.3,egg.mesh.position.z*(1-t)+egg._canopyLiftStartZ*t+Math.cos(a)*0.42);p.rotation.z=a+i*0.35;}}
    if(egg._canopyLiftActive%6===0)_moveHitDetect(egg,egg.mesh.position,2.8,function(t,dist,dx,dz){var d=dist||1;_moveApplyKnockback(t,dx/d,dz/d,dist,COMBAT.canopyLift.force,COMBAT.canopyLift.vy,{squash:COMBAT.canopyLift.squash,throwTimer:COMBAT.canopyLift.throwTimer,bounces:COMBAT.canopyLift.bounces,stunDmg:COMBAT.canopyLift.stunDmg});return false;});
    egg._canopyLiftActive--;if(egg._canopyLiftActive<34&&(egg.vy<=0||egg.onGround)||egg._canopyLiftActive<=0){MoveCanopyLift_end(egg);return false;}return true;
}
function MoveCanopyLift_end(egg){egg._canopyLiftActive=0;egg._canopyLiftStartSet=false;egg._canopyLiftFwdX=undefined;egg._canopyLiftFwdZ=undefined;if(window._canopyLiftFist)window._canopyLiftFist.visible=false;if(window._canopyLiftLeaves)for(var i=0;i<window._canopyLiftLeaves.length;i++)window._canopyLiftLeaves[i].visible=false;var a=egg.mesh.userData.rightArm;if(a){a.visible=false;a.scale.set(1,1,1);}}

function MoveDash_execute(egg,dir,params){
    if(params.isDash){egg.vx=Math.sin(dir)*MAX_SPEED*params.speed;egg.vz=Math.cos(dir)*MAX_SPEED*params.speed;egg._dashDirX=Math.sin(dir)*MAX_SPEED*2;egg._dashDirZ=Math.cos(dir)*MAX_SPEED*2;egg._dashFaceY=dir;egg._travelDashTimer=Math.min(params.duration||36,36);egg._travelDashTotal=egg._travelDashTimer;egg._travelDashBounced=false;egg.squash=0.72;}
    else if(params.isRoll){egg._travelGlideTimer=Math.min(params.duration||34,34);egg._travelGlideDirX=Math.sin(dir)*MAX_SPEED*params.speed;egg._travelGlideDirZ=Math.cos(dir)*MAX_SPEED*params.speed;egg._dashFaceY=dir;egg._travelGlideFalling=false;egg._crystalGlideAngle=0;egg.squash=0.88;}
}
function MoveRapidHit_execute(egg,limbType){if(limbType==='punch'){egg._leafFlurryTimer=24;egg._leafFlurryTick=0;}else{egg._berryFlurryTimer=24;egg._berryFlurryTick=0;}egg.vx*=0.25;egg.vz*=0.25;egg.squash=0.9;}
function MoveRapidHit_update(egg,limbType,holdKey,inputFn){
    var punch=limbType==='punch',timer=punch?--egg._leafFlurryTimer:--egg._berryFlurryTimer,tick=punch?++egg._leafFlurryTick:++egg._berryFlurryTick;
    var ud=egg.mesh.userData,limb=(Math.floor(tick/4)%2===0)?(punch?ud.rightArm:ud.rightLeg):(punch?ud.leftArm:ud.leftLeg);
    if(limb){limb.visible=true;var side=(limb===ud.rightArm||limb===ud.rightLeg)?0.32:-0.32;limb.position.set(side,punch?0.25:0.08,0.85+Math.sin(tick*0.7)*0.32);limb.scale.set(1.12,1.12,1.12);}
    egg.vx*=0.55;egg.vz*=0.55;
    if(tick%6===0)_moveHitDetect(egg,egg.mesh.position,2.5,function(t,dist,dx,dz){var d=dist||1;_moveApplyKnockback(t,dx/d,dz/d,dist,COMBAT.rapidHit.force,COMBAT.rapidHit.vy,{squash:COMBAT.rapidHit.squash,throwTimer:COMBAT.rapidHit.throwTimer,bounces:COMBAT.rapidHit.bounces,stunDmg:COMBAT.rapidHit.stunDmg});return false;});
    if(timer<=0){MoveRapidHit_end(egg,limbType);return false;}return true;
}
function MoveRapidHit_end(egg,limbType){var ud=egg.mesh.userData,arr=limbType==='punch'?[ud.rightArm,ud.leftArm]:[ud.rightLeg,ud.leftLeg];for(var i=0;i<arr.length;i++)if(arr[i]){arr[i].visible=false;arr[i].scale.set(1,1,1);}}
function MoveElectric_execute(egg,params){egg._crystalPulseTimer=Math.min(params.duration||38,38);egg.squash=0.72;}
function MoveHarvestFan_execute(egg,dir,params){egg._harvestFan=Math.min(params.duration||36,36);egg._harvestFanDir=dir;egg.squash=0.88;}
function MoveCloudVault_execute(egg,dir,params){
    egg.vy=JUMP_FORCE*Math.min(params.jumpMul||1.2,1.25);egg.vx=Math.sin(dir)*0.12;egg.vz=Math.cos(dir)*0.12;egg.squash=0.62;
    egg._cloudVaultTimer=Math.min(params.duration||42,42);egg._cloudVaultFwdX=egg.vx;egg._cloudVaultFwdZ=egg.vz;egg._cloudMarkFaceY=dir;
    if(!window._cloudMark){window._cloudMark=new THREE.Mesh(_travelerLeafGeometry(1.35),_travelerMat(0xBCE8E1,0.66));var inner=new THREE.Mesh(_travelerLeafGeometry(0.76),_travelerMat(0xFFF2BC,0.52));inner.position.z=0.01;window._cloudMark.add(inner);scene.add(window._cloudMark);}
    window._cloudMark.visible=false;egg._cloudMarkLaunched=false;
}
