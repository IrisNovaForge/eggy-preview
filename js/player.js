// player.js — DANBO World
// ============================================================
//  PLAYER INPUT
// ============================================================
// Stun meter system: accumulate damage, stun when threshold exceeded
// stunAmount: light=8, medium=15, heavy=25, slam=40, special=20
// Returns true if the target gets stunned
function _addStunDamage(egg,amount){
    if(!egg._stunMeter)egg._stunMeter=0;
    if(!egg._stunThreshold)egg._stunThreshold=STUN_CONFIG.threshold;
    // If already stunned, getting hit clears the stun
    if(egg._stunTimer>0){egg._stunTimer=0;egg._stunMeter=0;return false;}
    egg._stunMeter+=amount;
    if(egg._stunMeter>=egg._stunThreshold&&egg._stunTimer<=0){
        var overflow=egg._stunMeter-egg._stunThreshold;
        egg._stunTimer=Math.floor(60+overflow*0.5);
        egg._stunMeter=0;
        return true;
    }
    return false;
}
function handlePlayerInput(){
    try{
    if(!playerEgg||!playerEgg.alive)return;
    if(_portalConfirmOpen)return;
    if(playerEgg.finished&&gameState==='racing')return;
    if(playerEgg._fallPenalty>0)return;
    if(playerEgg.heldBy)return;
    // Cannot control while thrown or stunned (except struggle when held)
    if(playerEgg.throwTimer>0||playerEgg._stunTimer>0){
        // Interrupt: drop held items and cancel ALL special moves
        if(playerEgg.holding){var _ih=playerEgg.holding;_ih.heldBy=null;playerEgg.holding=null;if(_ih.struggleBar){_ih.mesh.remove(_ih.struggleBar);_ih.struggleBar=null;}playerEgg.grabCD=20;}
        if(playerEgg.holdingProp){playerEgg.holdingProp.grabbed=false;playerEgg.holdingProp=null;playerEgg.grabCD=20;}
        if(playerEgg.holdingObs){playerEgg.holdingObs._grabbed=false;playerEgg.holdingObs=null;playerEgg.grabCD=20;}
        _jumpCharging=false;_jumpCharge=0;_chargeHoldTimer=0;
        playerEgg._throwCharging=false;playerEgg._throwCharge=0;
        _sprintCharge=0;
        // Cancel all special moves
        playerEgg._bodySlam=false;playerEgg._bodySlamTarget=null;
        playerEgg._trailSweepActive=0;playerEgg._trailSweepDir=0;
        playerEgg._canopyLiftReady=false;playerEgg._canopyLiftSeq=0;playerEgg._canopyLiftActive=0;
        playerEgg._comboCount=0;playerEgg._comboTimer=0;
        // Cancel dash attacks
        if(playerEgg._travelDashTimer>0){playerEgg._travelDashTimer=0;playerEgg.mesh.scale.set(1,1,1);playerEgg.mesh.rotation.x=0;
            var _cdB=playerEgg.mesh.userData.body;if(_cdB)_cdB.rotation.x=0;
            playerEgg._dashDirX=undefined;playerEgg._dashDirZ=undefined;playerEgg._dashFaceY=undefined;playerEgg._crystalGlide=false;}
        playerEgg._crystalPulseTimer=0;
        if(playerEgg._elecParticles)for(var _epc=0;_epc<playerEgg._elecParticles.length;_epc++)playerEgg._elecParticles[_epc].visible=false;
        playerEgg._travelGlideTimer=0;playerEgg._travelGlideDirX=undefined;playerEgg._travelGlideDirZ=undefined;playerEgg._travelGlideFalling=false;
        playerEgg._cloudVaultTimer=0;playerEgg._cloudVaultFwdX=undefined;playerEgg._cloudVaultFwdZ=undefined;playerEgg._cloudMarkLaunched=false;
        // Don't hide blade arc — let it continue flying independently
        if(window._cloudMark&&window._cloudMark.visible){
            window._cloudMarkDrift={faceY:playerEgg._cloudMarkFaceY||0,life:40};
        }
        playerEgg._leafFlurryTimer=0;
        playerEgg._berryFlurryTimer=0;
        playerEgg._harvestFan=0;
        // Hide attack limbs
        var _iud=playerEgg.mesh.userData;
        if(_iud.rightArm)_iud.rightArm.visible=false;
        if(_iud.leftArm)_iud.leftArm.visible=false;
        if(_iud.rightLeg)_iud.rightLeg.visible=false;
        if(_iud.leftLeg)_iud.leftLeg.visible=false;
        playerEgg._atkAnim=0;
        // Reset any interrupted vertical-scale animation
        if(playerEgg.mesh.scale.y<0){playerEgg.mesh.scale.y=1;playerEgg.squash=1;}
        if(playerEgg.throwTimer>0)return;
    }
    // Hitstun flinch — can't act but no stun stars; also cancel special moves
    if(playerEgg._hitStun>0){
        playerEgg._hitStun--;playerEgg.vx*=0.85;playerEgg.vz*=0.85;
        playerEgg._trailSweepActive=0;playerEgg._comboCount=0;
        return;
    }
    if(playerEgg._stunTimer>0){
        // Mash directions to escape stun faster
        if(keys['KeyA']||keys['KeyD']||keys['KeyW']||keys['KeyS']||keys['ArrowLeft']||keys['ArrowRight']||keys['ArrowUp']||keys['ArrowDown']||joyActive){
            playerEgg._stunTimer-=2; // mashing doubles escape speed
        }
        playerEgg._stunTimer--;playerEgg.vx*=0.9;playerEgg.vz*=0.9;
        // Show stun progress bar
        if(!playerEgg._stunMax)playerEgg._stunMax=playerEgg._stunTimer+1;
        var _stunPct=Math.max(0,playerEgg._stunTimer/playerEgg._stunMax);
        ensureStruggleBar();
        struggleBarDiv.style.display='block';
        var _sfill=document.getElementById('struggle-fill');
        if(_sfill)_sfill.style.width=(_stunPct*100)+'%';
        var _stext=document.getElementById('struggle-text');
        if(_stext)_stext.textContent=L('struggle');
        // Cancel trail burst on stun
        if(_trailBurstActive){_trailBurstActive=false;_trailBurstTimer=0;_trailBurstSpeed=0;if(_trailBurstBar)_trailBurstBar.visible=false;}
        if(playerEgg._stunTimer<=0){playerEgg._stunMax=0;struggleBarDiv.style.display='none';}
        return;}
    // Player electrocuted — can't move
    if(playerEgg._electrocuted>0||playerEgg._elecFlying>0){
        playerEgg.vx=0;playerEgg.vz=0;
        if(playerEgg._electrocuted>0)playerEgg.vy=0;
        return;
    }
    // ---- TPS Input State (clean state machine) ----
    // Raw input
    var _rawMX=0,_rawMZ=0;
    if(keys['KeyA']||keys['ArrowLeft'])_rawMX-=1;
    if(keys['KeyD']||keys['ArrowRight'])_rawMX+=1;
    if(keys['KeyW']||keys['ArrowUp'])_rawMZ-=1;
    if(keys['KeyS']||keys['ArrowDown'])_rawMZ+=1;
    if(joyActive){_rawMX+=joyVec.x;_rawMZ+=joyVec.y;}

    var mx=_rawMX,mz=_rawMZ;
    // TPS state: idle / forward / backward
    window._tpsMoveState='idle'; // default

    if(_tpsCamMode&&(_rawMX||_rawMZ)){
        // Transform raw input to camera-relative world coordinates
        var _tcos=Math.cos(_tpsCamYaw),_tsin=Math.sin(_tpsCamYaw);
        mx=_rawMX*_tcos+_rawMZ*_tsin;
        mz=-_rawMX*_tsin+_rawMZ*_tcos;

        // Determine move state from raw (untransformed) input
        var _hasBack=_rawMZ>0.3;
        var _hasFwd=_rawMZ<-0.3;
        var _hasSide=Math.abs(_rawMX)>0.3;

        if(_hasBack&&!_hasFwd&&!_hasSide){
            // Pure backward: slow retreat, no turn
            mx*=0.4;mz*=0.4;
            window._tpsMoveState='backward';
        } else {
            window._tpsMoveState='forward';
        }
    }
    // Sprint: hold F — gradual speed ramp (only when not holding something)
    var _holdAnything=playerEgg.holding||playerEgg.holdingProp||playerEgg.holdingObs;
    var holdingF=keys['KeyF']&&!_portalConfirmOpen&&!_holdAnything;
    var sprintPct=_updateSprintBar(holdingF);
    var _powerBoost=(playerEgg._speedBoost>0)?2:1;
    var accelMul=(1+sprintPct*1.0)*_powerBoost;
    var speedMul=(1+sprintPct*1.0)*_powerBoost;
    const _moveNorm=DANBO_WASM.norm2D(mx,mz,0.1);
    const len=_moveNorm[2];
    if(_moveNorm[3]){
        mx=_moveNorm[0];mz=_moveNorm[1];
        // Stop movement during attack animation (punch/kick)
        if(!playerEgg._atkAnim){
            playerEgg.vx+=mx*MOVE_ACCEL*accelMul;playerEgg.vz+=mz*MOVE_ACCEL*accelMul;
        }
    }
    if(playerEgg._dashBounceTimer>0)playerEgg._dashBounceTimer--;
    // Snow footstep effect — bigger puffs
    if(currentCityStyle===7&&len>0.1&&playerEgg.onGround){
        if(!playerEgg._snowStepTick)playerEgg._snowStepTick=0;
        playerEgg._snowStepTick++;
        if(playerEgg._snowStepTick%3===0){
            for(var _sfi=0;_sfi<3;_sfi++){
                var _sfSize=0.2+Math.random()*0.2;
                var _sfMesh=new THREE.Mesh(new THREE.SphereGeometry(_sfSize,4,3),new THREE.MeshBasicMaterial({color:0xFFFFFF,transparent:true,opacity:0.7,depthTest:false}));
                _sfMesh.position.set(playerEgg.mesh.position.x+(Math.random()-0.5)*0.6,playerEgg.mesh.position.y+0.15,playerEgg.mesh.position.z+(Math.random()-0.5)*0.6);
                scene.add(_sfMesh);
                var _sfa=Math.random()*Math.PI*2;
                _chargeParticles.push({mesh:_sfMesh,vx:Math.cos(_sfa)*0.03,vy:0.02+Math.random()*0.02,vz:Math.sin(_sfa)*0.03,life:20+Math.random()*15,maxLife:35,type:'dust'});
            }
        }
    } else {playerEgg._snowStepTick=0;}
    // Sprint smoke + ground dust
    if(sprintPct>0.15&&playerEgg.onGround&&len>0.1){
        if(!playerEgg._sprintSmokeTick)playerEgg._sprintSmokeTick=0;
        playerEgg._sprintSmokeTick++;
        if(playerEgg._sprintSmokeTick%3===0)_spawnButtSmoke(playerEgg,sprintPct*0.6);
        if(playerEgg._sprintSmokeTick%5===0)_spawnGroundDust(playerEgg.mesh.position.x,playerEgg.mesh.position.y,playerEgg.mesh.position.z,sprintPct*0.3);
    } else { playerEgg._sprintSmokeTick=0; }
    // ---- Traveler trail burst ----
    if(_trailBurstActive){
        _trailBurstTimer--;
        if(_trailBurstTimer<=0){_trailBurstActive=false;_trailBurstSpeed=0;if(_trailBurstBar)_trailBurstBar.visible=false;playerEgg.squash=1.0;var _sdB2=playerEgg.mesh.userData.body;if(_sdB2){_sdB2.scale.set(1,1,1);_sdB2.rotation.x=0;}}
        else{
            // Steering during trail burst — WASD/joystick can curve the direction
            var sdSteerX=0, sdSteerZ=0;
            if(keys['KeyA']||keys['ArrowLeft'])sdSteerX-=1;
            if(keys['KeyD']||keys['ArrowRight'])sdSteerX+=1;
            if(keys['KeyW']||keys['ArrowUp'])sdSteerZ-=1;
            if(keys['KeyS']||keys['ArrowDown'])sdSteerZ+=1;
            if(joyActive){sdSteerX+=joyVec.x;sdSteerZ+=joyVec.y;}
            var _sdNorm=DANBO_WASM.norm2D(sdSteerX,sdSteerZ,0.1);
            if(_sdNorm[3]){
                sdSteerX=_sdNorm[0];sdSteerZ=_sdNorm[1];
                // Blend steering into dash direction (turn rate)
                var turnRate=0.06;
                playerEgg._dashDirX+=(sdSteerX-playerEgg._dashDirX)*turnRate;
                playerEgg._dashDirZ+=(sdSteerZ-playerEgg._dashDirZ)*turnRate;
                var _dashNorm=DANBO_WASM.norm2D(playerEgg._dashDirX,playerEgg._dashDirZ,0.000001);
                playerEgg._dashDirX=_dashNorm[3]?_dashNorm[0]:playerEgg._dashDirX;
                playerEgg._dashDirZ=_dashNorm[3]?_dashNorm[1]:playerEgg._dashDirZ;
            }
            // Apply dash velocity
            playerEgg.vx=playerEgg._dashDirX*_trailBurstSpeed;
            playerEgg.vz=playerEgg._dashDirZ*_trailBurstSpeed;
            // No speed decay — constant speed until bar depletes
            // Show trail-burst progress bar
            var sdBarPct=_trailBurstTimer/_trailBurstTimerMax;
            if(!_trailBurstBar){_trailBurstBar=_createTrailBurstBar();scene.add(_trailBurstBar);}
            _trailBurstBar.visible=true;
            _trailBurstBar.position.set(playerEgg.mesh.position.x,playerEgg.mesh.position.y+2.8,playerEgg.mesh.position.z);
            _drawTrailBurstBar(_trailBurstBar,sdBarPct);
            // Upright wind-assisted travel burst; the character never becomes a rolling ball
            playerEgg.squash=0.96;
            var _sdBody=playerEgg.mesh.userData.body;
            if(_sdBody){_sdBody.scale.set(0.98,1.03,0.98);_sdBody.rotation.x=0;}
            playerEgg.mesh.rotation.y=Math.atan2(playerEgg._dashDirX,playerEgg._dashDirZ);
            // Keep egg on ground during trail burst
            if(playerEgg.mesh.position.y<0.6)playerEgg.mesh.position.y=0.6;
            playerEgg.vy=0;playerEgg.onGround=true;
            // Spawn ground dust while dashing
            if(_trailBurstTimer%2===0)_spawnGroundDust(playerEgg.mesh.position.x,playerEgg.mesh.position.y,playerEgg.mesh.position.z,0.4);
            // Hit NPCs during trail burst — knock them away
            for(var sdi=0;sdi<allEggs.length;sdi++){
                var sde=allEggs[sdi];
                if(sde===playerEgg||!sde.alive||sde.heldBy)continue;
                var sddx=sde.mesh.position.x-playerEgg.mesh.position.x;
                var sddz=sde.mesh.position.z-playerEgg.mesh.position.z;
                var sddy=sde.mesh.position.y-playerEgg.mesh.position.y;
                var sdd=DANBO_WASM.len3D(sddx,sddy,sddz);
                // Only hit NPCs at similar height (within 1.5 units vertically on flat cities)
                if(currentCityStyle!==5&&!DANBO_WASM.absDeltaWithin(sddy,0,1.5))continue;
                if(sdd<2.5&&sdd>0.01){
                    var sdForce=_trailBurstSpeed*2;
                    sde.vx+=sddx/sdd*sdForce;sde.vy+=0.2+sdForce*0.3;sde.vz+=sddz/sdd*sdForce;
                    sde.throwTimer=COMBAT.stomp.throwTimer;sde._bounces=COMBAT.stomp.bounces;sde.squash=COMBAT.stomp.squash;
                    _addStunDamage(sde,COMBAT.stomp.stunDmg);
                    playHitSound();
                    _dropNpcStolenCoins(sde);
                }
            }
            // Hit city props during trail burst — knock them away
            for(var sdpi=0;sdpi<cityProps.length;sdpi++){
                var sdp=cityProps[sdpi];
                if(sdp.grabbed)continue;
                var spdx=sdp.group.position.x-playerEgg.mesh.position.x;
                var spdz=sdp.group.position.z-playerEgg.mesh.position.z;
                var spdy=sdp.group.position.y-playerEgg.mesh.position.y;
                if(currentCityStyle!==5&&!DANBO_WASM.absDeltaWithin(spdy,0,1.5))continue;
                var spdd=DANBO_WASM.len3D(spdx,spdy,spdz);
                if(spdd<3.0&&spdd>0.01){
                    var spForce=_trailBurstSpeed*1.5;
                    sdp.throwVx=spdx/spdd*spForce;sdp.throwVy=0.15+spForce*0.2;sdp.throwVz=spdz/spdd*spForce;
                    sdp.throwTimer=30;sdp._bounces=2;
                    playHitSound();
                }
            }
        }
    }
    // Charge jump: release Space within 0.3s = normal jump, hold past 0.3s = charge mode
    var _onGroundOrGrace=playerEgg.onGround;
    if(!playerEgg.onGround&&_jumpCharging){
        if(!playerEgg._chargeGrace)playerEgg._chargeGrace=0;
        playerEgg._chargeGrace++;
        if(playerEgg._chargeGrace<=8)_onGroundOrGrace=true;
    } else {
        playerEgg._chargeGrace=0;
    }
    if(!playerEgg._spaceHoldFrames)playerEgg._spaceHoldFrames=0;
    var _chargeDelay=18; // 0.3s at 60fps
    if(keys['Space']&&_onGroundOrGrace){
        // Charge jump works while holding (needed for body slam combo)
        playerEgg._spaceHoldFrames++;
        // After 0.3s hold, enter charge mode (no instant jump)
        if(playerEgg._spaceHoldFrames>=_chargeDelay&&!_jumpCharging){
            _jumpCharging=true;_jumpCharge=0;_chargeBeepTimer=0;_chargeHoldTimer=0;
        }
        if(_jumpCharging){
            if(_jumpCharge<_jumpChargeMax){
                _jumpCharge=Math.min(_jumpCharge+1,_jumpChargeMax);
                var pct=_jumpCharge/_jumpChargeMax;
                var beepInterval=Math.max(3,Math.floor(15-pct*12));
                _chargeBeepTimer++;
                if(_chargeBeepTimer>=beepInterval){_chargeBeepTimer=0;_playChargeBeep(pct);}
                if(_jumpCharge%4===0)_spawnButtSmoke(playerEgg,pct);
            } else {
                _chargeHoldTimer++;
                _chargeBeepTimer++;
                if(_chargeBeepTimer>=3){_chargeBeepTimer=0;_playChargeBeep(0.8+0.2*Math.random());}
                if(_chargeHoldTimer%3===0)_spawnButtSmoke(playerEgg,1.0);
                if(_chargeHoldTimer>=_chargeHoldMax){
                    _jumpCharge=0;_jumpCharging=false;_chargeHoldTimer=0;
                }
            }
        }
    }
    if(!keys['Space']||!_onGroundOrGrace){
        if(_onGroundOrGrace){
            if(_jumpCharging&&_jumpCharge>0){
                // Release from charge mode → charged jump
                var pct2=_jumpCharge/_jumpChargeMax;
                var jumpF=JUMP_FORCE*(1.6+pct2*2.4);
                playerEgg.vy=jumpF;
                playerEgg.squash=0.65-pct2*0.2;
                playJumpSound();
                if(pct2>0.15)_spawnGroundDust(playerEgg.mesh.position.x,playerEgg.mesh.position.y,playerEgg.mesh.position.z,pct2);
                _ascendSmoke=true;_ascendSmokePct=pct2;
            } else if(!_jumpCharging&&playerEgg._spaceHoldFrames>0&&playerEgg._spaceHoldFrames<_chargeDelay){
                // Released before 0.3s → normal tap jump
                playerEgg.vy=JUMP_FORCE*1.5;
            playerEgg.squash=0.96;
            }
        }
        _jumpCharging=false;_jumpCharge=0;_chargeHoldTimer=0;
        if(!keys['Space']){playerEgg._spaceHoldFrames=0;}
    }
    _updateChargeBar();
    // Ascending butt smoke while rising from charged jump
    if(_ascendSmoke&&playerEgg.vy>0&&!playerEgg.onGround){
        _spawnButtSmoke(playerEgg,_ascendSmokePct*0.7);
    }
    if(_ascendSmoke&&playerEgg.vy<=0&&!playerEgg.onGround){
        _ascendSmoke=false;
    }
    if(!_trailBurstActive){
        var curMax=MAX_SPEED*speedMul;
        var _cap=DANBO_WASM.clampVel2D(playerEgg.vx,playerEgg.vz,curMax);
        if(_cap[3]&&!playerEgg._travelDashTimer){playerEgg.vx=_cap[0];playerEgg.vz=_cap[1];}
    }
    // Grab / Throw (F key)
    if(playerEgg.grabCD>0) playerEgg.grabCD--;
    if(!playerEgg._fHoldFrames)playerEgg._fHoldFrames=0;
    if(!playerEgg._throwCharging)playerEgg._throwCharging=false;
    var _throwChargeDelay=18; // 0.3s at 60fps
    var _throwChargeMax=60; // 1 second max charge
    var _holdingSomething=playerEgg.holding||playerEgg.holdingProp||playerEgg.holdingObs;
    // Normal state check — block all new moves during any special move
    var _inSpecialMove=!!(playerEgg._trailSweepActive||playerEgg._canopyLiftActive||playerEgg._bodySlam||_trailBurstActive||playerEgg._travelGlideTimer||playerEgg._travelGlideFalling||playerEgg._cloudVaultTimer||playerEgg._harvestFan);
    // Track F press (blocked during special moves)
    if(keys['KeyF']&&!playerEgg._fWasDown&&playerEgg.grabCD<=0&&!_inSpecialMove){
        // ---- Downward carry impact: holding NPC + in air + holding down + press F ----
        if(playerEgg.holding&&!playerEgg.onGround&&(keys['KeyS']||keys['ArrowDown'])){
            var _bsHeld=playerEgg.holding;
            _bsHeld.heldBy=null;playerEgg.holding=null;
            if(_bsHeld.struggleBar){_bsHeld.mesh.remove(_bsHeld.struggleBar);_bsHeld.struggleBar=null;}
            // Slam down fast
            playerEgg.vy=-0.6;playerEgg.vx*=0.1;playerEgg.vz*=0.1;
            playerEgg._bodySlam=true;playerEgg._bodySlamTarget=_bsHeld;
            playerEgg._bodySlamStartY=playerEgg.mesh.position.y; // track height for damage
            // Place held NPC below player
            _bsHeld.mesh.position.set(playerEgg.mesh.position.x,playerEgg.mesh.position.y-1.5,playerEgg.mesh.position.z);
            _bsHeld.vy=-0.6;_bsHeld.vx=0;_bsHeld.vz=0;
            playerEgg.grabCD=30;
            playThrowSound();
            playerEgg._fPressStart=false;playerEgg._fHoldFrames=0;playerEgg._fWasDown=true;
        }
        else {
        playerEgg._fPressStart=true;
        playerEgg._fHoldFrames=0;
        playerEgg._throwCharging=false;
        playerEgg._throwCharge=0;
        playerEgg._justGrabbed=false;
        }
    }
    // Count hold frames while F is down (skip during special moves)
    if(keys['KeyF']&&!_inSpecialMove){
        playerEgg._fHoldFrames++;
        // Charge throw: holding something + held past 0.3s
        if(_holdingSomething&&playerEgg._fHoldFrames>=_throwChargeDelay){
            playerEgg._throwCharging=true;
            playerEgg._throwCharge=Math.min((playerEgg._throwCharge||0)+1,_throwChargeMax);
        }
    }
    // F released (skip during special moves)
    if(!keys['KeyF']&&playerEgg._fWasDown&&!_inSpecialMove){
        if(playerEgg._throwCharging&&_holdingSomething&&!playerEgg._justGrabbed){
            // Charge throw release → power throw
            var dir=playerEgg.mesh.rotation.y;
            var chargePct=(playerEgg._throwCharge||0)/_throwChargeMax;
            var throwMul=1+chargePct*4;
            if(playerEgg.holding){
                var held=playerEgg.holding;
                held.heldBy=null; playerEgg.holding=null; if(held.struggleBar){held.mesh.remove(held.struggleBar);held.struggleBar=null;}
                held.mesh.position.set(playerEgg.mesh.position.x+Math.sin(dir)*2, playerEgg.mesh.position.y+0.5, playerEgg.mesh.position.z+Math.cos(dir)*2);
                var tw=held.weight||1.0;var tf=0.5/tw*throwMul;held.vx=Math.sin(dir)*tf;held.vy=0.05+chargePct*0.25;held.vz=Math.cos(dir)*tf;held._throwTotal=80+Math.floor(chargePct*100);held.throwTimer=held._throwTotal;held._bounces=2+Math.floor(chargePct*2);held._chargeDrag=0.985+chargePct*0.01;
                held.squash=0.5; playerEgg.grabCD=20;
                playThrowSound();
                held._dropCoinsOnLand=true;held._coinsDropped=false;
            } else if(playerEgg.holdingProp){
                var prop=playerEgg.holdingProp;
                playerEgg.holdingProp=null;
                var pw=prop.weight||1.0;var pf=2.5/pw*throwMul;prop.throwVx=Math.sin(dir)*pf;prop.throwVy=0.18+chargePct*0.25;prop.throwVz=Math.cos(dir)*pf;prop._bounces=2+Math.floor(chargePct*2);prop.throwTimer=25+Math.floor(chargePct*60);prop._chargeDrag=0.98-chargePct*0.02;
                prop.group.position.set(playerEgg.mesh.position.x+Math.sin(dir)*1.5, playerEgg.mesh.position.y+0.5, playerEgg.mesh.position.z+Math.cos(dir)*1.5);
                playerEgg.grabCD=20; playThrowSound();
            } else if(playerEgg.holdingObs){
                var obs=playerEgg.holdingObs;
                playerEgg.holdingObs=null;
                obs._grabbed=false;
                obs.mesh.position.set(playerEgg.mesh.position.x+Math.sin(dir)*1.5, playerEgg.mesh.position.y+0.5, playerEgg.mesh.position.z+Math.cos(dir)*1.5);
                var ow=obs._weight||2.0;var of2=4.5/ow*throwMul;obs._throwVx=Math.sin(dir)*of2;obs._throwVy=0.18+chargePct*0.25;obs._throwVz=Math.cos(dir)*of2;obs._throwTimer=Math.floor((50+20/ow)*(1+chargePct*1.5));obs._bounces=2+Math.floor(chargePct*2);obs._chargeDrag=0.98-chargePct*0.02;
                playerEgg.grabCD=20; playThrowSound();
            }
        } else if(_holdingSomething&&!playerEgg._justGrabbed&&playerEgg._fHoldFrames<_throwChargeDelay&&playerEgg._fHoldFrames>0){
            // Quick tap F while holding → normal throw (separate press from grab)
            if(playerEgg.holdingProp){
                var prop=playerEgg.holdingProp;
                playerEgg.holdingProp=null;
                var dir1=playerEgg.mesh.rotation.y;
                var pw=prop.weight||1.0;var pf=2.5/pw;prop.throwVx=Math.sin(dir1)*pf;prop.throwVy=0.18;prop.throwVz=Math.cos(dir1)*pf;prop._bounces=2;prop.throwTimer=25;prop._chargeDrag=0;
                prop.group.position.set(playerEgg.mesh.position.x+Math.sin(dir1)*1.5, playerEgg.mesh.position.y+0.5, playerEgg.mesh.position.z+Math.cos(dir1)*1.5);
                playerEgg.grabCD=20; playThrowSound();
            } else if(playerEgg.holdingObs){
                var obs=playerEgg.holdingObs;
                playerEgg.holdingObs=null;
                obs._grabbed=false;
                var dir0=playerEgg.mesh.rotation.y;
                obs.mesh.position.set(playerEgg.mesh.position.x+Math.sin(dir0)*1.5, playerEgg.mesh.position.y+0.5, playerEgg.mesh.position.z+Math.cos(dir0)*1.5);
                var ow=obs._weight||2.0;var of2=4.5/ow;obs._throwVx=Math.sin(dir0)*of2;obs._throwVy=0.18;obs._throwVz=Math.cos(dir0)*of2;obs._throwTimer=Math.floor(50+20/ow);obs._bounces=2;
                playerEgg.grabCD=20; playThrowSound();
            } else if(playerEgg.holding){
                var held2=playerEgg.holding;
                held2.heldBy=null; playerEgg.holding=null; if(held2.struggleBar){held2.mesh.remove(held2.struggleBar);held2.struggleBar=null;}
                var dir2=playerEgg.mesh.rotation.y;
                held2.mesh.position.set(playerEgg.mesh.position.x+Math.sin(dir2)*2, playerEgg.mesh.position.y+0.5, playerEgg.mesh.position.z+Math.cos(dir2)*2);
                var tw2=held2.weight||1.0;var tf2=0.4/tw2;held2.vx=Math.sin(dir2)*tf2;held2.vy=0.15;held2.vz=Math.cos(dir2)*tf2;held2._throwTotal=80;held2.throwTimer=80;held2._bounces=2;held2._chargeDrag=0.992;
                held2.squash=0.5; playerEgg.grabCD=20;
                playThrowSound();
                held2._dropCoinsOnLand=true;held2._coinsDropped=false;
            }
        }
        playerEgg._throwCharging=false;playerEgg._throwCharge=0;playerEgg._fHoldFrames=0;playerEgg._fPressStart=false;
    }
    // Grab on first press (only when not holding anything)
    if(playerEgg._fPressStart&&!_holdingSomething&&playerEgg.grabCD<=0){
        playerEgg._fPressStart=false;
        var nearest=null, nearDist=STUN_CONFIG.grabRange;
        for(var ei=0;ei<allEggs.length;ei++){
            var e=allEggs[ei];
            if(e===playerEgg||!e.alive||e.heldBy||e.holding)continue;
            var dx2=e.mesh.position.x-playerEgg.mesh.position.x;
            var dz2=e.mesh.position.z-playerEgg.mesh.position.z;
            var d2=DANBO_WASM.len2D(dx2,dz2);
            if(d2<nearDist){nearDist=d2;nearest=e;}
        }
        if(nearest){
            playerEgg.holding=nearest; nearest.heldBy=playerEgg;
            // Drop any prop the grabbed NPC was holding
            if(nearest.holdingProp){nearest.holdingProp.grabbed=false;nearest.holdingProp=null;}
            nearest.struggleMax=300+Math.floor(Math.random()*240); nearest.struggleTimer=nearest.struggleMax;
            playerEgg.grabCD=20; playGrabSound();
            playerEgg._justGrabbed=true;
        } else {
            var nearObs=null, nearObsDist=3.0;
            for(var oi=0;oi<_danboRaceObstacles().length;oi++){
                var ob=_danboRaceObstacles()[oi];
                if(ob._grabbed)continue;
                if(ob.type==='spinner'||ob.type==='pendulum'||ob.type==='conveyor'||ob.type==='platform')continue;
                var ox=ob.mesh.position.x-playerEgg.mesh.position.x;
                var oz=ob.mesh.position.z-playerEgg.mesh.position.z;
                var od=DANBO_WASM.len2D(ox,oz);
                if(od<nearObsDist){nearObsDist=od;nearObs=ob;}
            }
            if(nearObs){
                playerEgg.holdingObs=nearObs;
                nearObs._grabbed=true;nearObs._weight=(nearObs.type==='bumper'?1.5:nearObs.type==='fallingBlock'?2.5:2.0);
                nearObs._origPos={x:nearObs.mesh.position.x,y:nearObs.mesh.position.y,z:nearObs.mesh.position.z};
                nearObs._throwTimer=0;nearObs._throwVx=0;nearObs._throwVy=0;nearObs._throwVz=0;
                nearObs.mesh.rotation.set(0,0,0);
                playerEgg.grabCD=20; playGrabSound();
                playerEgg._justGrabbed=true;
            } else if(gameState==='city'){
                var nearProp=null, nearPropDist=3.0;
                for(var cpi=0;cpi<cityProps.length;cpi++){
                        var cpp=cityProps[cpi];
                        if(cpp.grabbed)continue;
                        var cpx=cpp.group.position.x-playerEgg.mesh.position.x;
                        var cpz=cpp.group.position.z-playerEgg.mesh.position.z;
                        var cpd=DANBO_WASM.len2D(cpx,cpz);
                        if(cpd<nearPropDist){nearPropDist=cpd;nearProp=cpp;}
                    }
                    if(nearProp){
                        playerEgg.holdingProp=nearProp;
                        nearProp.grabbed=true;
                        nearProp.throwTimer=0;nearProp.throwVx=0;nearProp.throwVy=0;nearProp.throwVz=0;
                        nearProp.group.rotation.set(0,0,0);
                        playerEgg.grabCD=20; playGrabSound();
                        playerEgg._justGrabbed=true;
                    }
            }
        }
    }
    // Show charge throw bar while charging
    if(playerEgg._throwCharging&&_holdingSomething){
        var chPct=(playerEgg._throwCharge||0)/60;
        if(chPct>0.01){
            if(!playerEgg._throwChargeBar){
                var tc=document.createElement('canvas');tc.width=128;tc.height=16;
                var ttex=new THREE.CanvasTexture(tc);
                playerEgg._throwChargeBar=new THREE.Sprite(new THREE.SpriteMaterial({map:ttex,transparent:true}));
                playerEgg._throwChargeBar.scale.set(2,0.3,1);
                scene.add(playerEgg._throwChargeBar);
            }
            playerEgg._throwChargeBar.visible=true;
            playerEgg._throwChargeBar.position.set(playerEgg.mesh.position.x,playerEgg.mesh.position.y+3.2,playerEgg.mesh.position.z);
            var tctx=playerEgg._throwChargeBar.material.map.image.getContext('2d');
            tctx.clearRect(0,0,128,16);
            tctx.fillStyle='rgba(0,0,0,0.5)';tctx.fillRect(0,0,128,16);
            var grd=tctx.createLinearGradient(0,0,128*chPct,0);
            grd.addColorStop(0,'#FF4444');grd.addColorStop(1,'#FFAA00');
            tctx.fillStyle=grd;tctx.fillRect(2,2,124*chPct,12);
            playerEgg._throwChargeBar.material.map.needsUpdate=true;
        }
    } else {
        if(playerEgg._throwChargeBar){playerEgg._throwChargeBar.visible=false;}
    }
    // ---- Punch (R) / Kick (T) with visible limbs ----
    // Block all combat input during any special move
    if(_inSpecialMove){
        playerEgg._rWasDown=!!keys['KeyR'];
        playerEgg._tWasDown=!!keys['KeyT'];
    } else {
    // Light hits = hitstun flinch (NO stun stars), combo finisher/aerial = knockdown fly
    if(!playerEgg._comboCount)playerEgg._comboCount=0;
    if(!playerEgg._comboTimer)playerEgg._comboTimer=0;
    if(!playerEgg._attackCD)playerEgg._attackCD=0;
    if(playerEgg._attackCD>0)playerEgg._attackCD--;
    if(playerEgg._comboTimer>0)playerEgg._comboTimer--;
    if(playerEgg._comboTimer<=0)playerEgg._comboCount=0;
    // Attack limb animation timer
    if(!playerEgg._atkAnim)playerEgg._atkAnim=0;
    if(playerEgg._atkAnim>0&&!playerEgg._canopyLiftActive&&!playerEgg._trailSweepActive&&!playerEgg._travelDashTimer&&!playerEgg._travelGlideTimer){
        playerEgg._atkAnim--;
        if(playerEgg._atkAnim<=0){
            var _ud=playerEgg.mesh.userData;
            if(_ud.rightArm){_ud.rightArm.visible=false;_ud.rightArm.scale.set(1,1,1);_ud.rightArm.position.set(0.4,0.2,0.7);}
            if(_ud.leftArm){_ud.leftArm.visible=false;_ud.leftArm.scale.set(1,1,1);_ud.leftArm.position.set(-0.4,0.2,0.7);}
            if(_ud.rightLeg){_ud.rightLeg.visible=false;_ud.rightLeg.scale.set(1,1,1);_ud.rightLeg.position.set(0.22,0.1,0.5);_ud.rightLeg.rotation.x=-Math.PI/3;}
            if(_ud.leftLeg){_ud.leftLeg.visible=false;_ud.leftLeg.scale.set(1,1,1);_ud.leftLeg.position.set(-0.22,0.1,0.5);_ud.leftLeg.rotation.x=-Math.PI/3;}
            // body.rotation.x managed by physics.js
        }
    }
    // Traveler rhythm inputs: special actions are formed by two attack taps.
    // R,R = ranged/pulse; T,T = mobility/sweep; T,R and R,T = cross actions.
    // This works with keyboard and the existing mobile R/T buttons and deliberately
    // avoids the retired directional and charge sequences.
    if(!playerEgg._travelTapTimer)playerEgg._travelTapTimer=0;
    if(playerEgg._travelTapTimer>0)playerEgg._travelTapTimer--;
    else playerEgg._travelLastTap='';
    var _travelCombo='';
    var _travelREdge=!!keys['KeyR']&&!playerEgg._rWasDown;
    var _travelTEdge=!!keys['KeyT']&&!playerEgg._tWasDown;
    if(_travelREdge||_travelTEdge){
        var _travelTap=_travelREdge?'R':'T';
        if(playerEgg._travelLastTap&&playerEgg._travelTapTimer>0){
            _travelCombo=playerEgg._travelLastTap+_travelTap;
            playerEgg._travelLastTap='';playerEgg._travelTapTimer=0;
        }else{playerEgg._travelLastTap=_travelTap;playerEgg._travelTapTimer=38;}
    }
    // Spicy Traveler cross-tap gust — R+T held together (checked before normal R press)
    var _travelerId=playerEgg.mesh.userData._travelerId||'blossomTraveler';
    if(_travelCombo==='RT'&&_travelerId==='spicyFlameTraveler'&&playerEgg._attackCD<=0&&!playerEgg.holding&&!playerEgg._trailSweepActive){
        playerEgg._comboCount=0;playerEgg._attackCD=40;
        MoveSpin_execute(playerEgg,playerEgg.mesh.rotation.y,{duration:MOVE_PARAMS.spicyFlameTraveler.spiceGust.duration,isSpiceGust:true});
        playerEgg._atkAnim=62;playerEgg.squash=0.9;
        // Show both arms extended at eye level
        var _lud=playerEgg.mesh.userData;
        if(_lud.rightArm){_lud.rightArm.visible=true;_lud.rightArm.position.set(0.6,0.88,0);_lud.rightArm.scale.set(1.5,1.5,1.5);}
        if(_lud.leftArm){_lud.leftArm.visible=true;_lud.leftArm.position.set(-0.6,0.88,0);_lud.leftArm.scale.set(1.5,1.5,1.5);}
        _shoutMove(playerEgg,MOVE_PARAMS.spicyFlameTraveler.spiceGust.shout);
    }
    // Punch (R) — character-specific special moves on command input
    if(keys['KeyR']&&!playerEgg._rWasDown&&playerEgg._attackCD<=0&&!playerEgg.holding){
        var _isRouteCast=(_travelCombo==='RR')&&!window._playerTravelProjectile;
        var _routeMove=_findMove(_travelerId,'routeCast');
        var _crossMove=_findMove(_travelerId,'crossAction');
        // ---- Double-tap R pulse actions ----
        if(_travelCombo==='RR'&&_routeMove&&_routeMove.type==='leafFlurry'){
            _shoutMove(playerEgg,_routeMove.shout);
            playerEgg._comboCount=0;playerEgg._attackCD=_routeMove.cd||4;
            MoveRapidHit_execute(playerEgg,'punch');
        }
        // ---- Salt-crystal pulse on double-tap R ----
        else if(_travelCombo==='RR'&&_routeMove&&_routeMove.type==='electric'){
            _shoutMove(playerEgg,_routeMove.shout);
            playerEgg._comboCount=0;playerEgg._attackCD=4;
            MoveElectric_execute(playerEgg,{duration:60});
            if(sfxEnabled){var _beCtx3=ensureAudio();if(_beCtx3){var _bet3=_beCtx3.currentTime;var _beo3=_beCtx3.createOscillator();var _beg3=_beCtx3.createGain();_beo3.type='square';_beo3.frequency.setValueAtTime(800,_bet3);_beo3.frequency.linearRampToValueAtTime(2000,_bet3+0.1);_beg3.gain.setValueAtTime(0.08,_bet3);_beg3.gain.exponentialRampToValueAtTime(0.001,_bet3+0.3);_beo3.connect(_beg3);_beg3.connect(_beCtx3.destination);_beo3.start(_bet3);_beo3.stop(_bet3+0.3);}}
        }
        // ---- COMMAND INPUT SPECIALS ----
        else if(_isRouteCast&&_routeMove&&(_travelerId==='blossomTraveler'||_travelerId==='fruitbrewTraveler')){
            // Traveler ranged action
            _shoutMove(playerEgg,_routeMove.shout);
            playerEgg._comboCount=0;playerEgg._attackCD=_routeMove.cd;
            var _hDir=playerEgg._moveDir;
            var _hColor=(_routeMove.color!==undefined)?_routeMove.color:0x44AAFF;
            var _hRingColor=(_routeMove.ringColor!==undefined)?_routeMove.ringColor:0x88DDFF;
            MoveProjectile_execute(playerEgg,_hDir,{speed:_routeMove.speed,life:_routeMove.life,color:_hColor,ringColor:_hRingColor,burns:_routeMove.burns,isPlayer:true,type:'normal'});
            playerEgg._atkAnim=15;playerEgg.squash=0.8;
            if(sfxEnabled){var _hCtx=ensureAudio();if(_hCtx){var _ht=_hCtx.currentTime;var _ho=_hCtx.createOscillator();var _hg=_hCtx.createGain();_ho.type='sine';_ho.frequency.setValueAtTime(300,_ht);_ho.frequency.exponentialRampToValueAtTime(150,_ht+0.3);_hg.gain.setValueAtTime(0.1,_ht);_hg.gain.exponentialRampToValueAtTime(0.001,_ht+0.35);_ho.connect(_hg);_hg.connect(_hCtx.destination);_ho.start(_ht);_ho.stop(_ht+0.35);}}
        } else if(_isRouteCast&&_routeMove&&_travelerId==='goldenGrainTraveler'){
            // 金穗冲击 (金穗旅人) — slow projectile, burns on hit
            _shoutMove(playerEgg,_routeMove.shout);
            playerEgg._comboCount=0;playerEgg._attackCD=MOVE_PARAMS.goldenGrainTraveler.grainPod.cd;
            var _yfDir=playerEgg._moveDir;
            MoveProjectile_execute(playerEgg,_yfDir,{speed:MOVE_PARAMS.goldenGrainTraveler.grainPod.speed,life:MOVE_PARAMS.goldenGrainTraveler.grainPod.life,color:MOVE_PARAMS.goldenGrainTraveler.grainPod.color,ringColor:MOVE_PARAMS.goldenGrainTraveler.grainPod.ringColor,burns:MOVE_PARAMS.goldenGrainTraveler.grainPod.burns,isPlayer:true,type:'grainPod'});
            playerEgg._atkAnim=15;playerEgg.squash=0.8;
        } else if(_isRouteCast&&_routeMove&&(_travelerId==='cloudwingTraveler')&&!window._playerTravelProjectile){
            // 轻风弧光 (云翼旅人) — warm crescent projectile
            _shoutMove(playerEgg,_routeMove.shout);
            playerEgg._comboCount=0;playerEgg._attackCD=MOVE_PARAMS.cloudwingTraveler.windRibbon.cd;
            var _sbDir=playerEgg._moveDir;
            MoveProjectile_execute(playerEgg,_sbDir,{speed:MOVE_PARAMS.cloudwingTraveler.windRibbon.speed,life:MOVE_PARAMS.cloudwingTraveler.windRibbon.life,color:MOVE_PARAMS.cloudwingTraveler.windRibbon.color,ringColor:MOVE_PARAMS.cloudwingTraveler.windRibbon.ringColor,isPlayer:true,type:'windRibbon'});
            playerEgg._atkAnim=12;playerEgg.squash=0.85;
            // Compact wind-ribbon impact sound
            if(sfxEnabled){var _sbSCtx=ensureAudio();if(_sbSCtx){var _sbt=_sbSCtx.currentTime;
                // Sharp crack
                var _sbb=_sbSCtx.createBuffer(1,Math.floor(_sbSCtx.sampleRate*0.15),_sbSCtx.sampleRate);
                var _sbd=_sbb.getChannelData(0);
                for(var _sbsi=0;_sbsi<_sbd.length;_sbsi++){var _sbp=_sbsi/_sbd.length;_sbd[_sbsi]=(Math.random()-0.5)*0.8*Math.exp(-_sbp*8);}
                var _sbs=_sbSCtx.createBufferSource();_sbs.buffer=_sbb;
                var _sbg2=_sbSCtx.createGain();_sbg2.gain.value=0.25;
                _sbs.connect(_sbg2);_sbg2.connect(_sbSCtx.destination);_sbs.start(_sbt);_sbs.stop(_sbt+0.15);
                // Low boom
                var _sbo=_sbSCtx.createOscillator();var _sbog=_sbSCtx.createGain();
                _sbo.type='sine';_sbo.frequency.setValueAtTime(120,_sbt);_sbo.frequency.exponentialRampToValueAtTime(40,_sbt+0.2);
                _sbog.gain.setValueAtTime(0.2,_sbt);_sbog.gain.exponentialRampToValueAtTime(0.001,_sbt+0.25);
                _sbo.connect(_sbog);_sbog.connect(_sbSCtx.destination);_sbo.start(_sbt);_sbo.stop(_sbt+0.25);
            }}
            playerEgg._atkAnim=12;playerEgg.squash=0.85;
        } else if(_travelCombo==='TR'&&_crossMove&&_travelerId==='herbTraveler'){
            // 森林摇摆 (香草旅人) — ←→+R charge dash
            _shoutMove(playerEgg,_crossMove.shout);
            playerEgg._comboCount=0;playerEgg._attackCD=MOVE_PARAMS.herbTraveler.herbDash.cd;
            var _shDir=playerEgg._moveDir;
            MoveDash_execute(playerEgg,_shDir,{isDash:true,speed:MOVE_PARAMS.herbTraveler.herbDash.speed,duration:MOVE_PARAMS.herbTraveler.herbDash.duration});
            playerEgg._atkAnim=62;
        } else if(_travelCombo==='TR'&&_crossMove&&(_travelerId==='blossomTraveler'||_travelerId==='fruitbrewTraveler')){
            // Canopy lift
            _shoutMove(playerEgg,_crossMove.shout);
            playerEgg._comboCount=0;playerEgg._attackCD=30;
            var _shFaceDir=playerEgg.mesh.rotation.y;
            var _shParams=MOVE_PARAMS[_travelerId].canopyLift;
            MoveCanopyLift_execute(playerEgg,_shFaceDir,{duration:_shParams.duration,jumpMul:_shParams.jumpMul,fwdSpeed:_shParams.fwdSpeed});
            if(sfxEnabled){var _sCtx=ensureAudio();if(_sCtx){var _st=_sCtx.currentTime;var _so=_sCtx.createOscillator();var _sg=_sCtx.createGain();_so.type='sawtooth';_so.frequency.setValueAtTime(200,_st);_so.frequency.exponentialRampToValueAtTime(1200,_st+0.2);_so.frequency.exponentialRampToValueAtTime(800,_st+0.35);_sg.gain.setValueAtTime(0.12,_st);_sg.gain.exponentialRampToValueAtTime(0.001,_st+0.4);_so.connect(_sg);_sg.connect(_sCtx.destination);_so.start(_st);_so.stop(_st+0.4);}}
            playJumpSound();
        } else if(_isRouteCast&&_routeMove&&_travelerId==='berryTraveler'&&!window._playerTravelProjectile){
            // 暮林果迹 (浆果旅人)
            _shoutMove(playerEgg,_routeMove.shout);
            playerEgg._comboCount=0;playerEgg._attackCD=MOVE_PARAMS.berryTraveler.berryCast.cd;
            var _sbDir2=playerEgg._moveDir;
            MoveProjectile_execute(playerEgg,_sbDir2,{speed:MOVE_PARAMS.berryTraveler.berryCast.speed,life:MOVE_PARAMS.berryTraveler.berryCast.life,color:MOVE_PARAMS.berryTraveler.berryCast.color,ringColor:MOVE_PARAMS.berryTraveler.berryCast.ringColor,isPlayer:true,type:'normal',radius:0.5,npcRadius:0.5});
            playerEgg._atkAnim=12;playerEgg.squash=0.85;
        } else if(_travelCombo==='TR'&&_crossMove&&(_travelerId==='saltCrystalTraveler')){
            // 盐晶辉光（盐晶旅人）— ←→+R，低姿态晶光滑行
            _shoutMove(playerEgg,_crossMove.shout);
            playerEgg._comboCount=0;playerEgg._attackCD=MOVE_PARAMS.saltCrystalTraveler.crystalGlide.cd;
            var _brDir=playerEgg._moveDir;
            MoveDash_execute(playerEgg,_brDir,{isRoll:true,speed:MOVE_PARAMS.saltCrystalTraveler.crystalGlide.speed,duration:MOVE_PARAMS.saltCrystalTraveler.crystalGlide.duration});
        } else if(_travelCombo==='TR'&&_crossMove&&_travelerId==='goldenGrainTraveler'){
            // 田野横扫 (金穗旅人) — ←→+R, short range burst
            _shoutMove(playerEgg,_crossMove.shout);
            playerEgg._comboCount=0;playerEgg._attackCD=40;
            MoveHarvestFan_execute(playerEgg,playerEgg._moveDir,MOVE_PARAMS.goldenGrainTraveler.harvestFan);
            // Fire breath sound
            if(sfxEnabled){var _yfCtx=ensureAudio();if(_yfCtx){var _yft=_yfCtx.currentTime;
                var _yfo=_yfCtx.createOscillator();var _yfn=_yfCtx.createBufferSource();
                var _yfg=_yfCtx.createGain();_yfo.type='sawtooth';
                _yfo.frequency.setValueAtTime(100,_yft);_yfo.frequency.linearRampToValueAtTime(300,_yft+0.2);_yfo.frequency.linearRampToValueAtTime(80,_yft+0.8);
                _yfg.gain.setValueAtTime(0.1,_yft);_yfg.gain.linearRampToValueAtTime(0.15,_yft+0.2);_yfg.gain.exponentialRampToValueAtTime(0.001,_yft+0.9);
                _yfo.connect(_yfg);_yfg.connect(_yfCtx.destination);_yfo.start(_yft);_yfo.stop(_yft+0.9);
            }}
        } else {
        // Normal punch combo
        playerEgg._comboCount++;playerEgg._comboTimer=25;playerEgg._attackCD=8;
        var _punchArm=(playerEgg._comboCount%2===1)?playerEgg.mesh.userData.rightArm:playerEgg.mesh.userData.leftArm;
        var _pArmZ=0.9;
        var _pArmS=new THREE.Vector3(1.3,1.3,1.3);
        if(_punchArm){_punchArm.visible=true;_punchArm.position.set(_punchArm===playerEgg.mesh.userData.rightArm?0.3:-0.3,0.2,_pArmZ);_punchArm.scale.copy(_pArmS);}
        playerEgg._atkAnim=8;
        var _atkDir=playerEgg.mesh.rotation.y;
        var _isFinisher=(playerEgg._comboCount>=3)&&_travelerId!=='herbTraveler'&&_travelerId!=='saltCrystalTraveler'; // Herb Traveler/Salt Crystal Traveler skip finisher (use rapid-press instead)
        var _isAerial=!playerEgg.onGround;
        // Finisher visual: show both arms or herbDash
        if(_isFinisher){
            var _finType=Math.floor(Math.random()*3);
            var _fud=playerEgg.mesh.userData;
            var _finZ=0.9;
            var _finSx=1.5;
            var _finSz=2;
            if(_finType===0){
                // Big punch — both arms forward
                if(_fud.rightArm){_fud.rightArm.visible=true;_fud.rightArm.position.set(0.2,0.85,_finZ);_fud.rightArm.scale.set(_finSx,1.2,_finSz);}
                if(_fud.leftArm){_fud.leftArm.visible=true;_fud.leftArm.position.set(-0.2,0.85,_finZ);_fud.leftArm.scale.set(_finSx,1.2,_finSz);}
            } else if(_finType===1){
                // Herb dash — body lunge forward
                if(_fud.body)_fud.body.rotation.x=-0.5;
            }
            // Tail whip: just extra squash
            playerEgg._atkAnim=14;
        }
        for(var _ai=0;_ai<allEggs.length;_ai++){
            var _ae=allEggs[_ai];if(_ae===playerEgg||!_ae.alive||_ae.heldBy)continue;
            if(_ae._slamImmune>0)continue;
            var _adx=_ae.mesh.position.x-playerEgg.mesh.position.x;
            var _adz=_ae.mesh.position.z-playerEgg.mesh.position.z;
            var _aHit=DANBO_WASM.arcHit2D(_adx,_adz,_atkDir,2.5*playerEgg._extendedRange,0.01,Math.PI/3);
            var _ad=_aHit[0];
            if(_aHit[3]){
                    if(_isFinisher||_isAerial){
                        var _kf=0.4+(_isAerial?0.2:0);
                        _ae.vx+=_adx/_ad*_kf;_ae.vz+=_adz/_ad*_kf;
                        _ae.vy=_isAerial?0.25:0.2;
                        _ae.squash=COMBAT.punch.squash;_ae.throwTimer=COMBAT.punch.throwTimer;_ae._bounces=COMBAT.punch.bounces;
                        _addStunDamage(_ae,_isAerial?COMBAT.punch.aerialStunDmg:COMBAT.punch.stunDmg);
                    } else {
                        _ae.vx+=_adx/_ad*0.08;_ae.vz+=_adz/_ad*0.08;
                        _ae.squash=0.78;_ae._hitStun=12;
                    }
                    _dropNpcStolenCoins(_ae);playHitSound();
            }
        }
        playerEgg.squash=_isFinisher?0.75:0.88;
        // Punch swing sound
        if(sfxEnabled){var _pCtx=ensureAudio();if(_pCtx){var _pt2=_pCtx.currentTime;
            var _po=_pCtx.createOscillator();var _pg=_pCtx.createGain();
            _po.type='sawtooth';_po.frequency.setValueAtTime(_isFinisher?400:600,_pt2);_po.frequency.exponentialRampToValueAtTime(200,_pt2+0.08);
            _pg.gain.setValueAtTime(0.06,_pt2);_pg.gain.exponentialRampToValueAtTime(0.001,_pt2+0.1);
            _po.connect(_pg);_pg.connect(_pCtx.destination);_po.start(_pt2);_po.stop(_pt2+0.1);
        }}
        if(_isFinisher){playerEgg._comboCount=0;playerEgg._attackCD=18;}
        }
    }
    // Kick (T) — character-specific kick specials
    if(keys['KeyT']&&!playerEgg._tWasDown&&playerEgg._attackCD<=0&&!playerEgg.holding){
        var _isTrailSweep=(_travelCombo==='TT');
        var _npcOnlyKickMove=_findMove(_travelerId,'npcAction');
        var _sweepMove=_findMove(_travelerId,'trailSweep');
        // Character-specific kick specials
        if(_isTrailSweep&&_sweepMove&&(_travelerId==='blossomTraveler'||_travelerId==='fruitbrewTraveler')){
            // Trail sweep
            _shoutMove(playerEgg,_sweepMove.shout);
            playerEgg._comboCount=0;playerEgg._attackCD=40;
            MoveSpin_execute(playerEgg,playerEgg._moveDir,{duration:MOVE_PARAMS[_travelerId].trailSweep.duration});
            // Show both legs extended
            var _tud=playerEgg.mesh.userData;
            if(_tud.rightLeg){_tud.rightLeg.visible=true;_tud.rightLeg.position.set(0.3,0.15,0.6);_tud.rightLeg.rotation.x=-Math.PI/2;}
            if(_tud.leftLeg){_tud.leftLeg.visible=true;_tud.leftLeg.position.set(-0.3,0.15,0.6);_tud.leftLeg.rotation.x=-Math.PI/2;}
            playerEgg._atkAnim=96;
            // Trail-sweep sound
            if(sfxEnabled){var _tCtx=ensureAudio();if(_tCtx){var _tt=_tCtx.currentTime;
                var _to=_tCtx.createOscillator();var _tg2=_tCtx.createGain();
                _to.type='sawtooth';_to.frequency.setValueAtTime(150,_tt);_to.frequency.linearRampToValueAtTime(400,_tt+0.3);_to.frequency.linearRampToValueAtTime(150,_tt+0.6);
                _tg2.gain.setValueAtTime(0.08,_tt);_tg2.gain.linearRampToValueAtTime(0.12,_tt+0.3);_tg2.gain.exponentialRampToValueAtTime(0.001,_tt+1.5);
                _to.connect(_tg2);_tg2.connect(_tCtx.destination);_to.start(_tt);_to.stop(_tt+1.5);
            }}
        } else if(_isTrailSweep&&_sweepMove&&_travelerId==='berryTraveler'){
            // Twilight hop sweep
            playerEgg._comboCount=0;playerEgg._attackCD=35;
            MoveSpin_execute(playerEgg,playerEgg._moveDir,{duration:MOVE_PARAMS.berryTraveler.twilightSweep.duration,jumpMul:MOVE_PARAMS.berryTraveler.twilightSweep.jumpMul});
            playerEgg._atkAnim=62;
            _shoutMove(playerEgg,_sweepMove.shout);
            // Layered twilight chirp
            if(sfxEnabled){var _sbkCtx=ensureAudio();if(_sbkCtx){var _sbkt=_sbkCtx.currentTime;
                var _sbko1=_sbkCtx.createOscillator();var _sbkg1=_sbkCtx.createGain();
                _sbko1.type='sine';_sbko1.frequency.setValueAtTime(1200,_sbkt);_sbko1.frequency.exponentialRampToValueAtTime(2000,_sbkt+0.1);_sbko1.frequency.exponentialRampToValueAtTime(800,_sbkt+0.3);_sbko1.frequency.exponentialRampToValueAtTime(1800,_sbkt+0.5);_sbko1.frequency.exponentialRampToValueAtTime(600,_sbkt+0.8);
                _sbkg1.gain.setValueAtTime(0.1,_sbkt);_sbkg1.gain.linearRampToValueAtTime(0.15,_sbkt+0.15);_sbkg1.gain.exponentialRampToValueAtTime(0.001,_sbkt+0.9);
                _sbko1.connect(_sbkg1);_sbkg1.connect(_sbkCtx.destination);_sbko1.start(_sbkt);_sbko1.stop(_sbkt+0.9);
                // Harmonic overtone for bird-like quality
                var _sbko2=_sbkCtx.createOscillator();var _sbkg2=_sbkCtx.createGain();
                _sbko2.type='triangle';_sbko2.frequency.setValueAtTime(2400,_sbkt);_sbko2.frequency.exponentialRampToValueAtTime(3500,_sbkt+0.1);_sbko2.frequency.exponentialRampToValueAtTime(1500,_sbkt+0.5);
                _sbkg2.gain.setValueAtTime(0.04,_sbkt);_sbkg2.gain.exponentialRampToValueAtTime(0.001,_sbkt+0.6);
                _sbko2.connect(_sbkg2);_sbkg2.connect(_sbkCtx.destination);_sbko2.start(_sbkt);_sbko2.stop(_sbkt+0.6);
            }}
        } else if(_isTrailSweep&&_sweepMove&&(_travelerId==='cloudwingTraveler')){
            // 云步回旋 (云翼旅人) — backflip with blade arc
            _shoutMove(playerEgg,_sweepMove.shout);
            playerEgg._comboCount=0;playerEgg._attackCD=35;
            var _gsFaceDir=playerEgg._moveDir;
            MoveCloudVault_execute(playerEgg,_gsFaceDir,MOVE_PARAMS.cloudwingTraveler.cloudVault);
            playJumpSound();
        } else {
        // Normal kick
        playerEgg._comboCount++;playerEgg._comboTimer=25;playerEgg._attackCD=12;
        var _kickLeg=(playerEgg._comboCount%2===1)?playerEgg.mesh.userData.rightLeg:playerEgg.mesh.userData.leftLeg;
        var _kLegZ=0.7;
        if(_kickLeg){_kickLeg.visible=true;_kickLeg.position.z=_kLegZ;_kickLeg.rotation.x=-Math.PI/2.5;}
        playerEgg._atkAnim=10;
        var _kDir=playerEgg.mesh.rotation.y;
        var _kFinisher=(playerEgg._comboCount>=3)&&_travelerId!=='berryTraveler'; // Berry Traveler skips finisher (use rapid-press instead)
        var _kAerial=!playerEgg.onGround;
        if(_kFinisher){
            // Finisher kick: show both legs
            var _kud=playerEgg.mesh.userData;
            var _kFinZ=0.8;
            var _kFinS=1;
            if(_kud.rightLeg){_kud.rightLeg.visible=true;_kud.rightLeg.position.z=_kFinZ;_kud.rightLeg.rotation.x=-Math.PI/2;_kud.rightLeg.scale.set(1,1,_kFinS);}
            if(_kud.leftLeg){_kud.leftLeg.visible=true;_kud.leftLeg.position.z=_kFinZ;_kud.leftLeg.rotation.x=-Math.PI/2;_kud.leftLeg.scale.set(1,1,_kFinS);}
            playerEgg._atkAnim=14;
        }
        for(var _ki=0;_ki<allEggs.length;_ki++){
            var _ke=allEggs[_ki];if(_ke===playerEgg||!_ke.alive||_ke.heldBy)continue;
            if(_ke._slamImmune>0)continue;
            var _kdx=_ke.mesh.position.x-playerEgg.mesh.position.x;
            var _kdz=_ke.mesh.position.z-playerEgg.mesh.position.z;
            var _kHit=DANBO_WASM.arcHit2D(_kdx,_kdz,_kDir,3.0*playerEgg._extendedRange,0.01,Math.PI/3);
            var _kd=_kHit[0];
            if(_kHit[3]){
                    if(_kFinisher||_kAerial){
                        var _kkf=0.5+(_kAerial?0.25:0);
                        _ke.vx+=_kdx/_kd*_kkf;_ke.vz+=_kdz/_kd*_kkf;
                        _ke.vy=_kAerial?0.3:0.25;
                        _ke.squash=COMBAT.kick.squash;_ke.throwTimer=COMBAT.kick.throwTimer;_ke._bounces=COMBAT.kick.bounces;
                        _addStunDamage(_ke,_kAerial?COMBAT.kick.aerialStunDmg:COMBAT.kick.stunDmg);
                    } else {
                        _ke.vx+=_kdx/_kd*0.12;_ke.vz+=_kdz/_kd*0.12;
                        _ke.squash=0.72;_ke._hitStun=15;
                    }
                    _dropNpcStolenCoins(_ke);playHitSound();
                }
            }
        playerEgg.squash=_kFinisher?0.7:0.82;
        // Kick swing sound
        if(sfxEnabled){var _kCtx=ensureAudio();if(_kCtx){var _kt2=_kCtx.currentTime;
            var _ko=_kCtx.createOscillator();var _kg2=_kCtx.createGain();
            _ko.type='sawtooth';_ko.frequency.setValueAtTime(_kFinisher?300:500,_kt2);_ko.frequency.exponentialRampToValueAtTime(150,_kt2+0.1);
            _kg2.gain.setValueAtTime(0.07,_kt2);_kg2.gain.exponentialRampToValueAtTime(0.001,_kt2+0.12);
            _ko.connect(_kg2);_kg2.connect(_kCtx.destination);_ko.start(_kt2);_ko.stop(_kt2+0.12);
        }}
        if(_kFinisher){playerEgg._comboCount=0;playerEgg._attackCD=22;}
        } // end normal kick (else from trail sweep)
    }
    playerEgg._rWasDown=!!keys['KeyR'];
    playerEgg._tWasDown=!!keys['KeyT'];
    } // end combat block (else from _inSpecialMove)
    // ---- Canopy-lift update ----
    if(playerEgg._canopyLiftActive>0){
        MoveCanopyLift_update(playerEgg);
    } else {
        if(window._canopyLiftFist)window._canopyLiftFist.visible=false;
        if(window._canopyLiftLeaves)for(var _sdl=0;_sdl<window._canopyLiftLeaves.length;_sdl++)window._canopyLiftLeaves[_sdl].visible=false;
    }
    // ---- Trail-sweep update ----
    if(playerEgg._trailSweepActive>0){
        MoveSpin_update(playerEgg, function(){
            var _lmx=0,_lmz=0;
            if(keys['KeyA']||keys['ArrowLeft'])_lmx-=1;
            if(keys['KeyD']||keys['ArrowRight'])_lmx+=1;
            if(keys['KeyW']||keys['ArrowUp'])_lmz-=1;
            if(keys['KeyS']||keys['ArrowDown'])_lmz+=1;
            if(joyActive){_lmx+=joyVec.x;_lmz+=joyVec.y;}
            return {mx:_lmx,mz:_lmz,
                up:!!(keys['KeyW']||keys['ArrowUp']),
                down:!!(keys['KeyS']||keys['ArrowDown']),
                left:!!(keys['KeyA']||keys['ArrowLeft']),
                right:!!(keys['KeyD']||keys['ArrowRight'])};
        });
    } else {
        if(window._trailSweepLeaves)for(var _ttl=0;_ttl<window._trailSweepLeaves.length;_ttl++)window._trailSweepLeaves[_ttl].visible=false;
    }
    // ---- Cloudwing travel vault ----
    if(playerEgg._cloudVaultTimer>0){
        playerEgg._cloudVaultTimer--;
        if(playerEgg._cloudVaultFwdX!==undefined){playerEgg.vx=playerEgg._cloudVaultFwdX;playerEgg.vz=playerEgg._cloudVaultFwdZ;}
        playerEgg._dashBounceTimer=4;
        if(window._cloudMark){
            var _gaFace3=playerEgg._cloudMarkFaceY,_gaElapsed=42-playerEgg._cloudVaultTimer,_gaDrift=1.0+_gaElapsed*0.018;
            window._cloudMark.visible=true;
            window._cloudMark.position.set(playerEgg.mesh.position.x+Math.sin(_gaFace3)*_gaDrift,playerEgg.mesh.position.y+0.8+Math.sin(_gaElapsed*0.16)*0.18,playerEgg.mesh.position.z+Math.cos(_gaFace3)*_gaDrift);
            window._cloudMark.rotation.set(-Math.PI/2,_gaFace3,Math.sin(_gaElapsed*0.12)*0.18);
            window._cloudMark.scale.setScalar(0.88+Math.sin(_gaElapsed*0.2)*0.08);
            if(window._cloudMark.material)window._cloudMark.material.opacity=0.64;
        }
        if(playerEgg._cloudVaultTimer%6===0){
            for(var _gsi=0;_gsi<allEggs.length;_gsi++){
                var _gse=allEggs[_gsi];if(_gse===playerEgg||!_gse.alive||_gse.heldBy||_gse._slamImmune>0)continue;
                var _gsdx=_gse.mesh.position.x-playerEgg.mesh.position.x,_gsdz=_gse.mesh.position.z-playerEgg.mesh.position.z,_gsdy=_gse.mesh.position.y-playerEgg.mesh.position.y;
                var _gsd=DANBO_WASM.len3D(_gsdx,_gsdy,_gsdz);
                if(_gsd<3.2&&_gsd>0.01){_gse.vx+=_gsdx/_gsd*COMBAT.cloudVault.force;_gse.vz+=_gsdz/_gsd*COMBAT.cloudVault.force;_gse.vy=COMBAT.cloudVault.vy;_gse.squash=COMBAT.cloudVault.squash;_gse.throwTimer=COMBAT.cloudVault.throwTimer;_gse._bounces=COMBAT.cloudVault.bounces;_addStunDamage(_gse,COMBAT.cloudVault.stunDmg);_dropNpcStolenCoins(_gse);playHitSound();}
            }
        }
        if(playerEgg._cloudVaultTimer<24&&(playerEgg.vy<=0||playerEgg.onGround))playerEgg._cloudVaultTimer=0;
        if(playerEgg._cloudVaultTimer<=0){if(window._cloudMark)window._cloudMark.visible=false;playerEgg._cloudVaultFwdX=undefined;playerEgg._cloudVaultFwdZ=undefined;playerEgg._cloudMarkLaunched=false;}
    }else if(window._cloudMark){window._cloudMark.visible=false;}
    // ---- Herb flurry animation (compatibility timer) ----
    if(!playerEgg._leafFlurryTimer)playerEgg._leafFlurryTimer=0;
    if(playerEgg._leafFlurryTimer>0){
        var _hInputFn=function(){
            var _hmx=0,_hmz=0;
            if(keys['KeyA']||keys['ArrowLeft'])_hmx-=1;
            if(keys['KeyD']||keys['ArrowRight'])_hmx+=1;
            if(keys['KeyW']||keys['ArrowUp'])_hmz-=1;
            if(keys['KeyS']||keys['ArrowDown'])_hmz+=1;
            if(joyActive){_hmx+=joyVec.x;_hmz+=joyVec.y;}
            return {mx:_hmx,mz:_hmz};
        };
        MoveRapidHit_update(playerEgg,'punch',!!keys['KeyR'],_hInputFn);
    }
    // ---- 星星攻击 (rapid kick) continuous animation (unified) ----
    if(!playerEgg._berryFlurryTimer)playerEgg._berryFlurryTimer=0;
    if(playerEgg._berryFlurryTimer>0){
        var _ckInputFn=function(){
            var _ckmx=0,_ckmz=0;
            if(keys['KeyA']||keys['ArrowLeft'])_ckmx-=1;
            if(keys['KeyD']||keys['ArrowRight'])_ckmx+=1;
            if(keys['KeyW']||keys['ArrowUp'])_ckmz-=1;
            if(keys['KeyS']||keys['ArrowDown'])_ckmz+=1;
            if(joyActive){_ckmx+=joyVec.x;_ckmz+=joyVec.y;}
            return {mx:_ckmx,mz:_ckmz};
        };
        MoveRapidHit_update(playerEgg,'kick',!!keys['KeyT'],_ckInputFn);
    }
    // ---- Salt-crystal pulse ----
    if(playerEgg._crystalPulseTimer>0){
        playerEgg._crystalPulseTimer--;playerEgg.vx*=0.35;playerEgg.vz*=0.35;
        if(!playerEgg._elecParticles){playerEgg._elecParticles=[];for(var _epi=0;_epi<10;_epi++){var _ep=new THREE.Mesh(new THREE.OctahedronGeometry(0.14+(_epi%3)*0.025,0),new THREE.MeshBasicMaterial({color:_epi%2?0xBFE8DE:0xF3E7BC,transparent:true,opacity:0.72}));_ep.visible=false;scene.add(_ep);playerEgg._elecParticles.push(_ep);}}
        var _pulsePhase=(38-playerEgg._crystalPulseTimer)*0.16,_epCx=playerEgg.mesh.position.x,_epCy=playerEgg.mesh.position.y+0.55,_epCz=playerEgg.mesh.position.z;
        for(var _epj=0;_epj<playerEgg._elecParticles.length;_epj++){var _epp=playerEgg._elecParticles[_epj],_epAngle=_epj*Math.PI*2/playerEgg._elecParticles.length+_pulsePhase,_epLen=0.75+(_epj%3)*0.28;_epp.visible=true;_epp.position.set(_epCx+Math.sin(_epAngle)*_epLen,_epCy+Math.sin(_pulsePhase*0.8+_epj)*0.38,_epCz+Math.cos(_epAngle)*_epLen);_epp.rotation.set(_epAngle*0.4,_epAngle,_pulsePhase);_epp.scale.setScalar(0.82+Math.sin(_pulsePhase+_epj)*0.12);}
        for(var _bsi=0;_bsi<allEggs.length;_bsi++){var _bse=allEggs[_bsi];if(_bse===playerEgg||!_bse.alive||_bse.heldBy)continue;var _bsdx=_bse.mesh.position.x-playerEgg.mesh.position.x,_bsdz=_bse.mesh.position.z-playerEgg.mesh.position.z;if(DANBO_WASM.len2D(_bsdx,_bsdz)<3.6&&!_bse._electrocuted&&!_bse._elecFlying){_bse._electrocuted=COMBAT.electric.electrocuteDuration;_bse._slamImmune=160;var _elDist=Math.max(0.1,DANBO_WASM.len2D(_bsdx,_bsdz));_bse._elecKnockDir={x:_bsdx/_elDist,z:_bsdz/_elDist};_bse.vx=0;_bse.vz=0;_bse.vy=0;_dropNpcStolenCoins(_bse);if(_bse.isPlayer)playHitSound();}}
        if(playerEgg._crystalPulseTimer<=0&&playerEgg._elecParticles)for(var _epk=0;_epk<playerEgg._elecParticles.length;_epk++)playerEgg._elecParticles[_epk].visible=false;
    }
    // ---- Golden-grain harvest fan ----
    if(!playerEgg._harvestFan)playerEgg._harvestFan=0;
    if(playerEgg._harvestFan>0){
        playerEgg._harvestFan--;playerEgg.vx*=0.82;playerEgg.vz*=0.82;
        var _yfFace=playerEgg._harvestFanDir||playerEgg.mesh.rotation.y;
        if(playerEgg._harvestFan%4===0){var _leafDist=1.0+Math.random()*2.8,_leafSide=(Math.random()-0.5)*1.5;var _fp2=new THREE.Mesh(_travelerLeafGeometry(0.26+Math.random()*0.16),new THREE.MeshBasicMaterial({color:Math.random()>0.45?0xE5C86B:0x8DAE5A,transparent:true,opacity:0.78,side:THREE.DoubleSide,depthWrite:false}));_fp2.position.set(playerEgg.mesh.position.x+Math.sin(_yfFace)*_leafDist+Math.cos(_yfFace)*_leafSide,playerEgg.mesh.position.y+0.2+Math.random()*0.65,playerEgg.mesh.position.z+Math.cos(_yfFace)*_leafDist-Math.sin(_yfFace)*_leafSide);_fp2.rotation.set(-0.5,Math.random()*Math.PI*2,Math.random()*0.8-0.4);scene.add(_fp2);if(!window._harvestFanParticles)window._harvestFanParticles=[];window._harvestFanParticles.push({mesh:_fp2,life:18,drift:(Math.random()-0.5)*0.025});}
        if(playerEgg._harvestFan%6===0){for(var _yfi=0;_yfi<allEggs.length;_yfi++){var _yfe=allEggs[_yfi];if(_yfe===playerEgg||!_yfe.alive||_yfe.heldBy||_yfe._slamImmune>0)continue;var _yfdx=_yfe.mesh.position.x-playerEgg.mesh.position.x,_yfdz=_yfe.mesh.position.z-playerEgg.mesh.position.z,_yfHit=DANBO_WASM.coneDotHit2D(_yfdx,_yfdz,_yfFace,4,0.01,0.3);if(_yfHit[2]){var _yd=Math.max(0.1,DANBO_WASM.len2D(_yfdx,_yfdz));_yfe.vx+=_yfdx/_yd*0.14;_yfe.vz+=_yfdz/_yd*0.14;_yfe._hitStun=12;_addStunDamage(_yfe,COMBAT.harvestFan.stunDmg);_dropNpcStolenCoins(_yfe);playHitSound();}}}
        if(playerEgg._harvestFan<=0)playerEgg._harvestFanDir=undefined;
    }
    if(window._harvestFanParticles){for(var _yfpi=window._harvestFanParticles.length-1;_yfpi>=0;_yfpi--){var _yfpp=window._harvestFanParticles[_yfpi];_yfpp.life--;_yfpp.mesh.position.y+=0.015;_yfpp.mesh.position.x+=_yfpp.drift;_yfpp.mesh.rotation.z+=0.045;_yfpp.mesh.material.opacity=_yfpp.life/18*0.78;if(_yfpp.life<=0){scene.remove(_yfpp.mesh);window._harvestFanParticles.splice(_yfpi,1);}}}
    // ---- Salt-prism glide ----
    if(!playerEgg._travelGlideTimer)playerEgg._travelGlideTimer=0;
    if(playerEgg._travelGlideTimer>0){
        playerEgg._travelGlideTimer--;
        if(playerEgg._travelGlideDirX!==undefined){playerEgg.vx=playerEgg._travelGlideDirX;playerEgg.vz=playerEgg._travelGlideDirZ;}
        playerEgg.vy=0;playerEgg.mesh.rotation.x=0;playerEgg.mesh.rotation.z=Math.sin(playerEgg._travelGlideTimer*0.22)*0.06;
        if(playerEgg._travelGlideTimer%5===0){var _trailShard=new THREE.Mesh(new THREE.OctahedronGeometry(0.14,0),new THREE.MeshBasicMaterial({color:0xC7E8DF,transparent:true,opacity:0.6}));_trailShard.position.set(playerEgg.mesh.position.x,playerEgg.mesh.position.y+0.3,playerEgg.mesh.position.z);scene.add(_trailShard);if(!window._travelGlideShards)window._travelGlideShards=[];window._travelGlideShards.push({mesh:_trailShard,life:14});}
        if(playerEgg._travelGlideTimer%5===0){for(var _bri=0;_bri<allEggs.length;_bri++){var _bre=allEggs[_bri];if(_bre===playerEgg||!_bre.alive||_bre.heldBy)continue;var _brdx=_bre.mesh.position.x-playerEgg.mesh.position.x,_brdz=_bre.mesh.position.z-playerEgg.mesh.position.z,_brd=DANBO_WASM.len2D(_brdx,_brdz);if(_brd<2.4&&_brd>0.01){_bre.vx+=playerEgg.vx*0.65;_bre.vz+=playerEgg.vz*0.65;_bre.vy=0.2;_bre.squash=COMBAT.kick.squash;_bre.throwTimer=COMBAT.crystalGlide.throwTimer;_bre._bounces=COMBAT.crystalGlide.bounces;_addStunDamage(_bre,COMBAT.crystalGlide.stunDmg);_dropNpcStolenCoins(_bre);playHitSound();playerEgg._travelGlideDirX*=-0.22;playerEgg._travelGlideDirZ*=-0.22;playerEgg._travelGlideTimer=0;break;}}}
        for(var _bci2=0;_bci2<cityColliders.length;_bci2++){var _bc2=cityColliders[_bci2];if(DANBO_WASM.aabb2D(playerEgg.mesh.position.x,playerEgg.mesh.position.z,_bc2.x,_bc2.z,_bc2.hw,_bc2.hd,1)&&playerEgg.mesh.position.y<(_bc2.h||6)){playerEgg._travelGlideDirX*=-0.22;playerEgg._travelGlideDirZ*=-0.22;playerEgg._travelGlideTimer=0;playHitSound();break;}}
        if(playerEgg._travelGlideTimer<=0){playerEgg.vx*=0.3;playerEgg.vz*=0.3;playerEgg._travelGlideDirX=undefined;playerEgg._travelGlideDirZ=undefined;playerEgg.mesh.rotation.z=0;}
    }
    playerEgg._travelGlideFalling=false;
    if(window._travelGlideShards){for(var _tgi=window._travelGlideShards.length-1;_tgi>=0;_tgi--){var _tgs=window._travelGlideShards[_tgi];_tgs.life--;_tgs.mesh.position.y+=0.025;_tgs.mesh.rotation.y+=0.12;_tgs.mesh.material.opacity=_tgs.life/14*0.6;if(_tgs.life<=0){scene.remove(_tgs.mesh);window._travelGlideShards.splice(_tgi,1);}}}
    // ---- Herb trail-step dash ----
    if(playerEgg._travelDashTimer>0){
        playerEgg._travelDashTimer--;
        // Maintain constant dash speed (override friction)
        if(playerEgg._dashDirX!==undefined){
            playerEgg.vx=playerEgg._dashDirX;playerEgg.vz=playerEgg._dashDirZ;
        }
        // Upright trail step with a light natural sway; no torpedo or rolling pose.
        playerEgg.mesh.rotation.x=0;
        playerEgg.mesh.rotation.z=Math.sin(playerEgg._travelDashTimer*0.28)*0.05;
        if(playerEgg._dashDirX!==undefined&&playerEgg._travelDashTimer%5===0){
            var _dashLeaf=new THREE.Mesh(_travelerLeafGeometry(0.2),new THREE.MeshBasicMaterial({color:0x7FBF63,transparent:true,opacity:0.55,side:THREE.DoubleSide,depthWrite:false}));
            _dashLeaf.position.set(playerEgg.mesh.position.x,playerEgg.mesh.position.y+0.3,playerEgg.mesh.position.z);
            _dashLeaf.rotation.z=Math.random()*Math.PI;scene.add(_dashLeaf);
            if(!window._travelDashLeaves)window._travelDashLeaves=[];window._travelDashLeaves.push({mesh:_dashLeaf,life:14});
        }
        for(var _hdi=0;_hdi<allEggs.length;_hdi++){
            var _hde=allEggs[_hdi];if(_hde===playerEgg||!_hde.alive||_hde.heldBy)continue;
            var _hddx=_hde.mesh.position.x-playerEgg.mesh.position.x;
            var _hddz=_hde.mesh.position.z-playerEgg.mesh.position.z;
            if(DANBO_WASM.len2D(_hddx,_hddz)<2.5){
                _hde.vx+=playerEgg.vx*0.8;_hde.vz+=playerEgg.vz*0.8;_hde.vy=0.25;
                _hde.squash=COMBAT.kick.squash;_hde.throwTimer=COMBAT.herbDash.throwTimer;_hde._bounces=COMBAT.herbDash.bounces;_addStunDamage(_hde,COMBAT.herbDash.stunDmg);
                _dropNpcStolenCoins(_hde);playHitSound();
                // Push back 2 units along dash direction
                playerEgg.mesh.position.x-=playerEgg._dashDirX/2;
                playerEgg.mesh.position.z-=playerEgg._dashDirZ/2;
                playerEgg.vx=-playerEgg._dashDirX*0.4;playerEgg.vz=-playerEgg._dashDirZ*0.4;
                playerEgg._travelDashTimer=0;playerEgg._travelDashBounced=true;
                playerEgg._dashBounceTimer=30;
                playerEgg.vy=0.15;
            }
        }
        // Building collision bounce during dash
        for(var _dci=0;_dci<cityColliders.length;_dci++){
            var _dc=cityColliders[_dci];
            var _ddx=playerEgg.mesh.position.x-_dc.x,_ddz=playerEgg.mesh.position.z-_dc.z;
            if(DANBO_WASM.aabb2D(playerEgg.mesh.position.x,playerEgg.mesh.position.z,_dc.x,_dc.z,_dc.hw,_dc.hd,1)&&playerEgg.mesh.position.y<(_dc.h||6)){
                // Push out along dash direction (back to where we came from)
                var _pushBack=2.0;
                playerEgg.mesh.position.x-=playerEgg._dashDirX/_pushBack;
                playerEgg.mesh.position.z-=playerEgg._dashDirZ/_pushBack;
                // Bounce back
                playerEgg.vx=-playerEgg._dashDirX*0.4;playerEgg.vz=-playerEgg._dashDirZ*0.4;
                playerEgg.vy=0.15;
                playerEgg._travelDashTimer=0;playerEgg._travelDashBounced=true;
                playerEgg._dashBounceTimer=30;
                playHitSound();break;
            }
        }
        if(playerEgg._travelDashTimer<=0){playerEgg.vx*=0.2;playerEgg.vz*=0.2;playerEgg._crystalGlide=false;
            playerEgg.mesh.rotation.order='XYZ';playerEgg.mesh.rotation.x=0;playerEgg.mesh.rotation.z=0;
            var _hdEndB=playerEgg.mesh.userData.body;if(_hdEndB){_hdEndB.rotation.x=0;_hdEndB.position.z=0;}
            // Restore original facing direction after bounce
            if(playerEgg._dashFaceY!==undefined)playerEgg.mesh.rotation.y=playerEgg._dashFaceY;
            playerEgg._dashDirX=undefined;playerEgg._dashDirZ=undefined;playerEgg._dashFaceY=undefined;
            playerEgg.mesh.rotation.x=0;
            playerEgg.mesh.rotation.order='XYZ';playerEgg.mesh.rotation.x=0;playerEgg.mesh.rotation.z=0;
            playerEgg.mesh.scale.set(1,1,1);
            var _hdBody=playerEgg.mesh.userData.body;if(_hdBody)_hdBody.rotation.x=0;
        }
    }
    if(window._travelDashLeaves){for(var _tdli=window._travelDashLeaves.length-1;_tdli>=0;_tdli--){var _tdl=window._travelDashLeaves[_tdli];_tdl.life--;_tdl.mesh.position.y+=0.018;_tdl.mesh.rotation.z+=0.04;_tdl.mesh.material.opacity=_tdl.life/14*0.55;if(_tdl.life<=0){scene.remove(_tdl.mesh);window._travelDashLeaves.splice(_tdli,1);}}}
    // ---- Traveler action direction ----
    // Specials are resolved by the R/T rhythm taps above.
    playerEgg._moveDir=playerEgg.mesh.rotation.y;
    playerEgg._extendedRange=1.0;
    // ---- Body Slam landing impact (height-based damage) ----
    if(playerEgg._bodySlam&&playerEgg.onGround){
        playerEgg._bodySlam=false;
        var _bst=playerEgg._bodySlamTarget;
        var _slamH=Math.max(1,(playerEgg._bodySlamStartY||3));
        var _slamPower=Math.min(_slamH/20,3); // 0-3 power scale based on height
        if(_bst&&_bst.alive){
            // Crush NPC: flatten + bounce away — stronger from higher
            _bst.mesh.position.set(playerEgg.mesh.position.x,0.1,playerEgg.mesh.position.z);
            _bst.squash=0.1+0.1/(1+_slamPower);
            var _bsDir=playerEgg.mesh.rotation.y+Math.PI*(Math.random()-0.5);
            var _bsForce=0.4+_slamPower*0.3;
            _bst.vx=Math.sin(_bsDir)*_bsForce;_bst.vy=0.3+_slamPower*0.2;_bst.vz=Math.cos(_bsDir)*_bsForce;
            _bst.throwTimer=COMBAT.bodySlam.baseThrowTimer+Math.floor(_slamPower*20);_bst._bounces=COMBAT.bodySlam.bounces;
            _addStunDamage(_bst,COMBAT.bodySlam.stunDmg);
            _dropNpcStolenCoins(_bst);
            playHitSound();
            // Screen shake effect (camera wobble)
            if(playerEgg._bodySlamStartY>5){
                // Big impact: ground dust ring
                for(var _dri=0;_dri<8;_dri++){
                    var _dra=_dri/8*Math.PI*2;
                    _spawnGroundDust(playerEgg.mesh.position.x+Math.cos(_dra)*2,0,playerEgg.mesh.position.z+Math.sin(_dra)*2,0.5+_slamPower*0.3);
                }
            }
            // Player bounces up — higher from bigger slam + brief immunity
            playerEgg.vy=0.2+_slamPower*0.1;playerEgg.squash=0.4;
            playerEgg.throwTimer=0;playerEgg._stunTimer=0; // clear any stun
            playerEgg.grabCD=Math.max(playerEgg.grabCD,20);
            playerEgg._slamImmune=30; // 0.5s immunity from thrown NPC bounce-back
            _spawnGroundDust(playerEgg.mesh.position.x,0,playerEgg.mesh.position.z,0.6+_slamPower*0.4);
            // Body slam impact sound — heavy thud
            if(sfxEnabled){var _bsCtx=ensureAudio();if(_bsCtx){var _bst2=_bsCtx.currentTime;
                var _bso=_bsCtx.createOscillator();var _bsg=_bsCtx.createGain();
                _bso.type='sine';_bso.frequency.setValueAtTime(80+_slamPower*20,_bst2);_bso.frequency.exponentialRampToValueAtTime(30,_bst2+0.3);
                _bsg.gain.setValueAtTime(0.15,_bst2);_bsg.gain.exponentialRampToValueAtTime(0.001,_bst2+0.35);
                _bso.connect(_bsg);_bsg.connect(_bsCtx.destination);_bso.start(_bst2);_bso.stop(_bst2+0.35);
            }}
        }
        playerEgg._bodySlamTarget=null;playerEgg._bodySlamStartY=0;
    }
    playerEgg._fWasDown=!!keys['KeyF'];
    }catch(e){console.error('handlePlayerInput error:',e.message,e.stack);}
}
