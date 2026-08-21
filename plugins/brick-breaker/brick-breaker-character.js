(function(){
    'use strict';

    function numberColor(value,fallback){
        var number=Number(value);
        return Number.isFinite(number)&&number>=0&&number<=0xFFFFFF?Math.round(number):fallback;
    }
    function clamp(value,min,max){return Math.max(min,Math.min(max,value));}

    var MOTION={
        blossomTraveler:{catchStyle:'twirl',missStyle:'droop',moveStyle:'flow',catchDuration:.46,missDuration:.62,gaitSpeed:7.4,step:.022,lean:.074,turn:.13,idleFloat:.018,startDuration:.22,stopDuration:.24,aura:'✿'},
        herbTraveler:{catchStyle:'sprout',missStyle:'fold',moveStyle:'leafTurn',catchDuration:.38,missDuration:.48,gaitSpeed:10.8,step:.024,lean:.09,turn:.15,idleFloat:.012,startDuration:.24,stopDuration:.2,turnDuration:.18,aura:'❧'},
        saltCrystalTraveler:{catchStyle:'flash',missStyle:'freeze',moveStyle:'crystalSnap',catchDuration:.3,missDuration:.58,gaitSpeed:5.4,step:.006,lean:.022,turn:.04,idleFloat:.003,startDuration:.12,stopDuration:.12,turnDuration:.14,aura:'◇'},
        cloudwingTraveler:{catchStyle:'float',missStyle:'sink',moveStyle:'cloudDrift',catchDuration:.6,missDuration:.72,gaitSpeed:5.6,step:.01,lean:.045,turn:.075,idleFloat:.036,startDuration:.38,stopDuration:.42,turnDuration:.34,aura:'☁'},
        fruitbrewTraveler:{catchStyle:'doubleBounce',missStyle:'squash',moveStyle:'orchardBounce',catchDuration:.48,missDuration:.58,gaitSpeed:11.4,step:.035,lean:.09,turn:.12,idleFloat:.012,startDuration:.16,stopDuration:.32,turnDuration:.24,aura:'●'},
        berryTraveler:{catchStyle:'wiggle',missStyle:'tremble',moveStyle:'dash',catchDuration:.3,missDuration:.46,gaitSpeed:17.2,step:.04,lean:.19,turn:.22,idleFloat:.012,startDuration:.14,stopDuration:.34,aura:'✦'},
        spicyFlameTraveler:{catchStyle:'punch',missStyle:'recoil',moveStyle:'emberDrive',catchDuration:.3,missDuration:.44,gaitSpeed:12.8,step:.018,lean:.16,turn:.16,idleFloat:.007,startDuration:.13,stopDuration:.18,turnDuration:.12,aura:'▲'},
        goldenGrainTraveler:{catchStyle:'bow',missStyle:'slowBow',moveStyle:'plant',catchDuration:.54,missDuration:.68,gaitSpeed:5.2,step:.014,lean:.035,turn:.045,idleFloat:.01,startDuration:.36,stopDuration:.16,aura:'≋'}
    };

    var CRUISE_FOLLOW={
        blossomTraveler:{style:'velvetFlow',response:.16},
        herbTraveler:{style:'leafBend',response:.2},
        saltCrystalTraveler:{style:'crystalLock',response:.42},
        cloudwingTraveler:{style:'mistDrift',response:.1},
        fruitbrewTraveler:{style:'orchardBounce',response:.22},
        berryTraveler:{style:'berryJelly',response:.26},
        spicyFlameTraveler:{style:'emberDrive',response:.35},
        goldenGrainTraveler:{style:'claySet',response:.3}
    };

    function pulseAmount(state,dt){
        if(!state)return 0;
        state.elapsed=Math.min(state.duration,state.elapsed+Math.max(0,dt||0));
        var progress=state.duration?state.elapsed/state.duration:1;
        if(progress>=1)state.done=true;
        return Math.sin(Math.PI*progress);
    }

    function CharacterView(options){
        options=options||{};
        if(!options.mount)throw new Error('Brick breaker character mount missing');
        if(!window.THREE||typeof window.createEggMesh!=='function')throw new Error('Official traveler renderer missing');

        var character=options.character||{},style=character.style||{};
        this.characterId=character.id||'blossomTraveler';
        this.motion=MOTION[this.characterId]||MOTION.blossomTraveler;
        this.cruiseFollow=CRUISE_FOLLOW[this.characterId]||CRUISE_FOLLOW.blossomTraveler;
        this.bodyColor=numberColor(style.color,0xFFFDF2);
        this.accentColor=numberColor(style.accent,0xEF4A5B);
        this.mount=options.mount;
        this.board=options.board;
        this.stage=options.stage;
        this.lastX=480;
        this.walkPhase=0;
        this.reaction=null;
        this.lastNormalized=0;
        this.startMotion=null;
        this.stopMotion=null;
        this.turnMotion=null;
        this.baseScale=0.95;
        this.scene=new THREE.Scene();
        this.camera=new THREE.PerspectiveCamera(31,126/108,0.1,30);
        this.camera.position.set(0,0.82,4.55);
        this.camera.lookAt(0,0.74,0);
        this.renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power',premultipliedAlpha:true});
        this.renderer.setPixelRatio(Math.min(1.5,window.devicePixelRatio||1));
        this.renderer.setSize(252,216,false);
        this.renderer.setClearColor(0x000000,0);
        if('outputColorSpace' in this.renderer&&THREE.SRGBColorSpace)this.renderer.outputColorSpace=THREE.SRGBColorSpace;
        this.renderer.domElement.className='bb-character-canvas';
        this.renderer.domElement.setAttribute('aria-hidden','true');
        this.mount.setAttribute('data-character',this.characterId);
        this.mount.appendChild(this.renderer.domElement);

        this.scene.add(new THREE.HemisphereLight(0xFFF9E8,0x6F9B91,2.2));
        var key=new THREE.DirectionalLight(0xFFF7E5,3.0);key.position.set(-3,5,5);this.scene.add(key);
        var rim=new THREE.DirectionalLight(0xBCEEFF,1.35);rim.position.set(4,2,-3);this.scene.add(rim);

        this.model=window.createEggMesh(
            this.bodyColor,
            this.accentColor,
            this.characterId
        );
        this.model.scale.setScalar(this.baseScale);
        this.model.position.y=-0.03;
        var body=this.model.userData&&this.model.userData.body,bodyTop=1.8;
        if(body&&body.geometry){
            if(!body.geometry.boundingBox&&body.geometry.computeBoundingBox)body.geometry.computeBoundingBox();
            if(body.geometry.boundingBox)bodyTop=body.position.y+body.geometry.boundingBox.max.y*body.scale.y;
        }
        this.headAnchorY=this.model.position.y+bodyTop*this.model.scale.y;
        this.modelBaseY=this.model.position.y-this.headAnchorY;
        this.cruisePivot=new THREE.Group();
        this.cruisePivot.name='brick-breaker-head-anchored-cruise-pivot';
        this.cruisePivot.position.y=this.headAnchorY;
        this.model.position.y=this.modelBaseY;
        this.cruisePivot.add(this.model);
        this.scene.add(this.cruisePivot);
        this.rig={
            mesh:this.model,onGround:true,vx:0,vy:0,walkPhase:0,
            _atkAnim:0,holding:null,heldBy:null,_hitStun:0,_stunTimer:0,
            throwTimer:0,_electrocuted:0,_elecFlying:0
        };
    }

    CharacterView.prototype.react=function(type,offset){
        if(type!=='catch'&&type!=='miss')return;
        this.reaction={type:type,elapsed:0,duration:type==='catch'?this.motion.catchDuration:this.motion.missDuration,offset:type==='catch'?Math.max(-1,Math.min(1,Number(offset)||0)):0};
        this.mount.removeAttribute('data-reaction');
        void this.mount.offsetWidth;
        this.mount.setAttribute('data-reaction',type);
    };

    CharacterView.prototype.resetReaction=function(){this.reaction=null;this.mount.removeAttribute('data-reaction');};

    CharacterView.prototype.updateCruiseFollow=function(normalized,moving,dt){
        var pivot=this.cruisePivot,profile=this.cruiseFollow;if(!pivot||!profile)return;
        var phase=this.walkPhase,style=profile.style,wave=0,beat=0,targetX=0,targetY=0,targetZ=0,scaleX=1,scaleY=1,scaleZ=1;
        if(style==='velvetFlow'){
            wave=Math.sin(phase*.55);targetZ=moving*(-normalized*.028+wave*.036);targetY=wave*.015*moving;targetX=wave*.006*moving;
            scaleX=1+wave*.012*moving;scaleY=1-wave*.008*moving;
        }else if(style==='leafBend'){
            wave=Math.sin(phase*.72);targetZ=moving*(-normalized*.055+wave*.075);targetY=wave*.025*moving;targetX=Math.sin(phase*.36)*.012*moving;
            scaleX=1-wave*.018*moving;scaleY=1+Math.abs(wave)*.022*moving;
        }else if(style==='crystalLock'){
            wave=Math.sin(phase*1.15)>=0?1:-1;targetZ=moving*(-normalized*.01+wave*.008);targetY=wave*.004*moving;
            scaleX=1+wave*.0035*moving;scaleY=1-wave*.0035*moving;
        }else if(style==='mistDrift'){
            wave=Math.sin(phase*.34);targetZ=moving*(-normalized*.07+wave*.03);targetY=wave*.035*moving;targetX=(-.025+wave*.01)*moving;
            scaleX=1-.02*moving+wave*.006*moving;scaleY=1+.04*moving;scaleZ=1-.01*moving;
        }else if(style==='orchardBounce'){
            wave=Math.sin(phase*.8);beat=Math.abs(Math.sin(phase*1.25));targetZ=moving*(-normalized*.03+wave*.04);targetY=wave*.02*moving;targetX=beat*.02*moving;
            scaleX=1+beat*.045*moving;scaleY=1-beat*.05*moving;scaleZ=1+beat*.012*moving;
        }else if(style==='berryJelly'){
            wave=Math.sin(phase*1.8);beat=Math.abs(Math.sin(phase*1.8+.4));targetZ=moving*(-normalized*.085+wave*.07);targetY=wave*.04*moving;targetX=wave*.025*moving;
            scaleX=1+beat*.055*moving;scaleY=1-beat*.045*moving;scaleZ=1+beat*.018*moving;
        }else if(style==='emberDrive'){
            wave=Math.sin(phase*1.3);targetZ=moving*(-normalized*.115+wave*.012);targetY=-normalized*.025*moving;targetX=-.045*moving;
            scaleX=1-.025*moving;scaleY=1+.03*moving;scaleZ=1-.015*moving;
        }else if(style==='claySet'){
            wave=Math.sin(phase*.42);targetZ=moving*(-normalized*.014+wave*.012);targetX=wave*.005*moving;
            scaleX=1+.018*moving;scaleY=1-.012*moving;scaleZ=1+.008*moving;
        }
        var frames=clamp(Math.max(0,dt||0)*60,0,2.4),blend=1-Math.pow(1-(profile.response||.2),frames);
        pivot.rotation.x+=(targetX-pivot.rotation.x)*blend;pivot.rotation.y+=(targetY-pivot.rotation.y)*blend;pivot.rotation.z+=(targetZ-pivot.rotation.z)*blend;
        pivot.scale.x+=(scaleX-pivot.scale.x)*blend;pivot.scale.y+=(scaleY-pivot.scale.y)*blend;pivot.scale.z+=(scaleZ-pivot.scale.z)*blend;
        pivot.position.set(0,this.headAnchorY,0);
    };

    CharacterView.prototype.render=function(x,y,velocity,dt,ballVisual){
        var boardRect=this.board.getBoundingClientRect(),stageRect=this.stage.getBoundingClientRect();
        if(!boardRect.width||!boardRect.height)return;
        var sx=boardRect.width/960,sy=boardRect.height/720;
        this.mount.style.left=(boardRect.left-stageRect.left+(x-63)*sx)+'px';
        this.mount.style.top=(boardRect.top-stageRect.top+(y-35)*sy)+'px';
        this.mount.style.width=(126*sx)+'px';
        this.mount.style.height=(108*sy)+'px';

        var normalized=Math.max(-1,Math.min(1,(velocity||0)/690)),moving=Math.abs(normalized),previousNormalized=this.lastNormalized||0,previousMoving=Math.abs(previousNormalized);
        if(previousMoving<.025&&moving>=.025)this.startMotion={elapsed:0,duration:this.motion.startDuration||.18,direction:Math.sign(normalized)||1};
        if(previousMoving>.025&&moving<.015)this.stopMotion={elapsed:0,duration:this.motion.stopDuration||.2,direction:Math.sign(previousNormalized)||1};
        if(previousNormalized*normalized<-.006)this.turnMotion={elapsed:0,duration:this.motion.turnDuration||(this.motion.moveStyle==='dash'?.2:.26),direction:Math.sign(normalized)||1};
        var startDirection=this.startMotion?this.startMotion.direction:(Math.sign(normalized)||1),stopDirection=this.stopMotion?this.stopMotion.direction:(Math.sign(previousNormalized)||1),turnDirection=this.turnMotion?this.turnMotion.direction:(Math.sign(normalized)||1);
        var startAmount=pulseAmount(this.startMotion,dt),stopAmount=pulseAmount(this.stopMotion,dt),turnAmount=pulseAmount(this.turnMotion,dt);
        var orchardStopAmount=this.motion.moveStyle==='orchardBounce'&&this.stopMotion?Math.abs(Math.sin(Math.PI*2*clamp(this.stopMotion.elapsed/this.stopMotion.duration,0,1))):0;
        if(this.startMotion&&this.startMotion.done)this.startMotion=null;
        if(this.stopMotion&&this.stopMotion.done)this.stopMotion=null;
        if(this.turnMotion&&this.turnMotion.done)this.turnMotion=null;
        if(Math.abs(normalized)>0.01)this.walkPhase+=Math.max(0,dt||0)*this.motion.gaitSpeed*(.35+Math.abs(normalized)*.65);
        this.updateCruiseFollow(normalized,moving,dt);
        this.rig.vx=normalized;this.rig.walkPhase=this.walkPhase;
        var arms=this.model.userData&&this.model.userData._decorArms;
        if(arms)for(var ai=0;ai<arms.length;ai++){
            var oldOffset=arms[ai].userData._bbReactionZ||0;
            arms[ai].rotation.z-=oldOffset;arms[ai].userData._bbReactionZ=0;
        }
        if(typeof window._updateCharacterPremiumRig==='function')window._updateCharacterPremiumRig(this.rig,Math.abs(normalized));
        else if(typeof window._animateCuteCharacterDetails==='function')window._animateCuteCharacterDetails(this.model,performance.now()*0.001);

        var catchAmount=0,missAmount=0,reactionProgress=0,strikeAmount=0,reactionOffset=0;
        if(this.reaction){
            this.reaction.elapsed=Math.min(this.reaction.duration,this.reaction.elapsed+Math.max(0,dt||0));
            reactionProgress=this.reaction.elapsed/this.reaction.duration;
            if(this.reaction.type==='catch'){
                catchAmount=Math.sin(Math.PI*reactionProgress);reactionOffset=this.reaction.offset||0;
                if(reactionProgress<.12)strikeAmount=reactionProgress/.12;
                else if(reactionProgress<.68)strikeAmount=Math.pow(1-(reactionProgress-.12)/.56,1.55);
            }
            else missAmount=Math.sin(Math.PI*reactionProgress);
            if(this.reaction.elapsed>=this.reaction.duration){this.reaction=null;this.mount.removeAttribute('data-reaction');}
        }
        ballVisual=ballVisual||{};
        var previewAmount=0,previewOffset=0;
        if(ballVisual.vy>0&&Number.isFinite(ballVisual.x)&&Number.isFinite(ballVisual.y)){
            var approachDistance=y-ballVisual.y;
            if(approachDistance>8&&approachDistance<118){
                previewAmount=Math.max(0,Math.min(1,1-(approachDistance-8)/110));
                previewOffset=Math.max(-1,Math.min(1,(ballVisual.x-x)/((ballVisual.paddleWidth||154)*.5)));
            }
        }
        var receiveAmount=Math.max(previewAmount*.78,strikeAmount),receiveOffset=strikeAmount>0?reactionOffset:previewOffset;
        if(arms)for(var ri=0;ri<arms.length;ri++){
            var arm=arms[ri],side=arm.userData._side||1,offset=0;
            if(catchAmount){
                offset=(-side*.075-receiveOffset*.055)*catchAmount;
            }else if(missAmount){
                if(this.motion.missStyle==='freeze')offset=0;
                else if(this.motion.missStyle==='fold')offset=-side*.32*missAmount;
                else if(this.motion.missStyle==='sink')offset=side*.13*missAmount;
                else if(this.motion.missStyle==='squash')offset=-side*.28*missAmount;
                else if(this.motion.missStyle==='tremble')offset=-side*(.1+Math.sin(reactionProgress*Math.PI*8)*.09)*missAmount;
                else if(this.motion.missStyle==='recoil')offset=side*.28*missAmount;
                else if(this.motion.missStyle==='slowBow')offset=-side*.12*missAmount;
                else offset=-side*.16*missAmount;
            }
            arm.rotation.z+=offset;arm.userData._bbReactionZ=offset;
        }
        var catchX=0,catchY=0,catchZ=0,catchLift=0,scaleX=0,scaleY=0,scaleZ=0;
        if(catchAmount){
            if(this.motion.catchStyle==='twirl'){catchY=Math.sin(reactionProgress*Math.PI*2)*.52*catchAmount;catchZ=Math.sin(reactionProgress*Math.PI*2)*.11;catchLift=.14*catchAmount;scaleY=.028*catchAmount;}
            else if(this.motion.catchStyle==='sprout'){var sproutPress=clamp(reactionProgress/.24,0,1)*clamp((.48-reactionProgress)/.2,0,1);catchZ=-Math.sin(reactionProgress*Math.PI)*.09;catchLift=-.055*sproutPress+.18*catchAmount;scaleX=.07*sproutPress;scaleY=-.08*sproutPress+.095*catchAmount;}
            else if(this.motion.catchStyle==='flash'){var snap=Math.sin(Math.min(1,reactionProgress*2)*Math.PI);catchY=.16*Math.sin(reactionProgress*Math.PI*4);catchLift=.085*snap;scaleX=scaleY=scaleZ=.075*snap;}
            else if(this.motion.catchStyle==='float'){catchZ=Math.sin(reactionProgress*Math.PI*2)*.055;catchLift=.23*catchAmount;scaleY=.035*catchAmount;catchY=Math.sin(reactionProgress*Math.PI)*.09;}
            else if(this.motion.catchStyle==='doubleBounce'){var bounce=Math.abs(Math.sin(reactionProgress*Math.PI*2))*catchAmount;catchLift=.19*bounce;scaleX=.09*bounce;scaleY=-.1*bounce;}
            else if(this.motion.catchStyle==='wiggle'){catchZ=Math.sin(reactionProgress*Math.PI*4)*.19*catchAmount;catchY=Math.sin(reactionProgress*Math.PI*2)*.17*catchAmount;catchLift=.13*catchAmount;scaleX=.065*catchAmount;scaleY=-.055*catchAmount;}
            else if(this.motion.catchStyle==='punch'){var drive=Math.sin(Math.PI*clamp(reactionProgress/.46,0,1));catchX=-.24*drive+.11*catchAmount;catchZ=-.12*drive;catchLift=.12*drive;scaleX=.085*drive;scaleY=-.07*drive;}
            else if(this.motion.catchStyle==='bow'){
                var press=clamp(reactionProgress/.28,0,1)*clamp((.52-reactionProgress)/.18,0,1),release=reactionProgress>.32?Math.sin(Math.PI*clamp((reactionProgress-.32)/.68,0,1)):0;
                catchX=.29*press-.08*release;catchLift=-.09*press+.12*release;scaleX=.085*press;scaleY=-.11*press+.04*release;
            }
        }
        var missX=0,missY=0,missZ=0,missDrop=0;
        if(missAmount){
            if(this.motion.missStyle==='droop'){missX=.13*missAmount;missZ=.055*missAmount;missDrop=.065*missAmount;scaleY-=.035*missAmount;}
            else if(this.motion.missStyle==='fold'){missX=.16*missAmount;missDrop=.07*missAmount;scaleX-=.08*missAmount;}
            else if(this.motion.missStyle==='freeze'){missX=.08*missAmount;scaleX-=.04*missAmount;scaleY+=.02*missAmount;}
            else if(this.motion.missStyle==='sink'){missZ=Math.sin(reactionProgress*Math.PI*3)*.05*missAmount;missDrop=.14*missAmount;scaleY-=.05*missAmount;}
            else if(this.motion.missStyle==='squash'){missDrop=.09*missAmount;scaleX+=.11*missAmount;scaleY-=.14*missAmount;}
            else if(this.motion.missStyle==='tremble'){missZ=Math.sin(reactionProgress*Math.PI*10)*.1*missAmount;missDrop=.055*missAmount;}
            else if(this.motion.missStyle==='recoil'){missX=.22*missAmount;missY=-.18*missAmount;missDrop=.07*missAmount;scaleY-=.07*missAmount;}
            else if(this.motion.missStyle==='slowBow'){missX=.2*missAmount;missDrop=.045*missAmount;}
        }
        var impactSquash=0,bodyPop=0;
        if(catchAmount){
            if(reactionProgress<.18)impactSquash=Math.sin(Math.PI*reactionProgress/.18);
            if(reactionProgress>.1&&reactionProgress<.56)bodyPop=Math.sin(Math.PI*(reactionProgress-.1)/.46);
        }
        var impactWeight=this.motion.moveStyle==='plant'?1.18:(this.motion.moveStyle==='dash'?.92:(this.motion.moveStyle==='flow'?.78:1));
        scaleX+=previewAmount*.025+impactSquash*.09*impactWeight;
        scaleY-=previewAmount*.035+impactSquash*.115*impactWeight;
        scaleY+=bodyPop*.025;
        var gait=Math.sin(this.walkPhase),gaitLift=Math.abs(Math.sin(this.walkPhase))*this.motion.step*moving;
        var gaitSway=0;
        if(this.motion.catchStyle==='twirl'||this.motion.catchStyle==='bow')gaitSway=gait*.018*moving;
        else if(this.motion.catchStyle==='wiggle')gaitSway=gait*.035*moving;
        var motionX=0,motionY=0,motionZ=0,motionLift=0,motionDrop=0,motionScaleX=0,motionScaleY=0;
        if(this.motion.moveStyle==='flow'){
            motionZ=Math.sin(this.walkPhase*.52)*.042*moving+startDirection*.04*startAmount-stopDirection*.085*stopAmount+turnDirection*.055*turnAmount;
            motionLift=.045*startAmount+.025*stopAmount;motionY=Math.sin(this.walkPhase*.34)*.035*moving;
        }else if(this.motion.moveStyle==='dash'){
            motionZ=-startDirection*.15*startAmount+stopDirection*.23*stopAmount-turnDirection*.13*turnAmount+Math.sin(this.walkPhase*2)*.028*moving;
            motionY=-startDirection*.13*startAmount+stopDirection*.16*stopAmount;motionLift=.075*startAmount;motionDrop=.035*stopAmount;
            motionScaleX=.065*stopAmount;motionScaleY=-.075*stopAmount;
        }else if(this.motion.moveStyle==='plant'){
            motionX=.16*startAmount-.07*stopAmount;motionZ=-startDirection*.035*startAmount-stopDirection*.025*stopAmount;
            motionDrop=.09*startAmount+.045*stopAmount;motionScaleX=.065*startAmount+.11*stopAmount;motionScaleY=-.09*startAmount-.13*stopAmount;
        }else if(this.motion.moveStyle==='leafTurn'){
            motionZ=Math.sin(this.walkPhase*.72)*.052*moving+startDirection*.055*startAmount-stopDirection*.07*stopAmount+turnDirection*.21*turnAmount;
            motionY=Math.sin(this.walkPhase*.46)*.055*moving+turnDirection*.11*turnAmount;motionLift=.035*startAmount+.025*turnAmount;
            motionScaleX=.035*turnAmount;motionScaleY=-.04*turnAmount;
        }else if(this.motion.moveStyle==='crystalSnap'){
            motionZ=-startDirection*.035*startAmount+stopDirection*.045*stopAmount-turnDirection*.055*turnAmount;
            motionLift=.025*startAmount;motionScaleX=.055*(startAmount+stopAmount);motionScaleY=-.06*(startAmount+stopAmount);
        }else if(this.motion.moveStyle==='cloudDrift'){
            motionZ=Math.sin(this.walkPhase*.38)*.045*moving+startDirection*.035*startAmount-stopDirection*.065*stopAmount+turnDirection*.04*turnAmount;
            motionY=Math.sin(this.walkPhase*.27)*.07*moving;motionLift=.07*moving+.075*startAmount+.055*stopAmount;motionDrop=.018*turnAmount;
            motionScaleX=.03*stopAmount;motionScaleY=-.025*stopAmount;
        }else if(this.motion.moveStyle==='orchardBounce'){
            motionZ=Math.sin(this.walkPhase)*.045*moving-startDirection*.07*startAmount+stopDirection*.08*stopAmount;
            motionLift=.07*startAmount+.09*orchardStopAmount;motionDrop=.035*stopAmount;motionScaleX=.075*orchardStopAmount;motionScaleY=-.085*orchardStopAmount;
        }else if(this.motion.moveStyle==='emberDrive'){
            motionX=-.11*startAmount+.08*stopAmount;motionZ=-startDirection*.19*startAmount+stopDirection*.12*stopAmount-turnDirection*.24*turnAmount;
            motionY=-startDirection*.09*startAmount+turnDirection*.14*turnAmount;motionLift=.055*startAmount+.035*turnAmount;
            motionScaleX=.065*turnAmount;motionScaleY=-.075*turnAmount;
        }
        scaleX+=motionScaleX;scaleY+=motionScaleY;
        var targetZ=-normalized*this.motion.lean+gaitSway+motionZ+catchZ+missZ-receiveOffset*(.34+.12*Math.abs(receiveOffset))*receiveAmount;
        var targetY=normalized*this.motion.turn+motionY+catchY+missY;
        var targetX=(this.motion.catchStyle==='punch'?-moving*.035:0)+motionX+catchX+missX;
        this.model.rotation.z+=(targetZ-this.model.rotation.z)*(receiveAmount>0?.42:.24);
        this.model.rotation.y+=(targetY-this.model.rotation.y)*.18;
        this.model.rotation.x+=(targetX-this.model.rotation.x)*.24;
        var gaitSquash=(this.motion.catchStyle==='doubleBounce'||this.motion.catchStyle==='wiggle')?Math.abs(gait)*.012*moving:0;
        this.model.scale.x+=(this.baseScale*(1+scaleX+gaitSquash)-this.model.scale.x)*.28;
        this.model.scale.y+=(this.baseScale*(1+scaleY-gaitSquash)-this.model.scale.y)*.28;
        this.model.scale.z+=(this.baseScale*(1+scaleZ)-this.model.scale.z)*.28;
        var idle=Math.sin(performance.now()*(this.motion.catchStyle==='float'?.0016:.0022))*this.motion.idleFloat;
        var targetModelX=receiveOffset*.22*receiveAmount,positionBlend=receiveAmount>0?.46:.22;
        this.model.position.x+=(targetModelX-this.model.position.x)*positionBlend;
        this.model.position.y=this.modelBaseY+idle+gaitLift+motionLift-motionDrop+catchLift-missDrop-previewAmount*.045-impactSquash*.055+bodyPop*.085;
        this.renderer.render(this.scene,this.camera);
        this.lastX=x;
        this.lastNormalized=normalized;
    };

    CharacterView.prototype.destroy=function(){
        if(this.model){
            this.model.traverse(function(node){
                if(!node.material)return;
                var materials=Array.isArray(node.material)?node.material:[node.material];
                for(var i=0;i<materials.length;i++)if(materials[i]&&materials[i].dispose)materials[i].dispose();
            });
        }
        if(this.renderer){this.renderer.dispose();if(this.renderer.forceContextLoss)this.renderer.forceContextLoss();}
        if(this.mount&&this.mount.parentNode)this.mount.parentNode.removeChild(this.mount);
    };

    window.DanboBrickBreakerCharacter={
        create:function(options){
            try{return new CharacterView(options);}catch(error){
                console.warn('[brick-breaker] official traveler view unavailable',error);
                return null;
            }
        }
    };
})();
