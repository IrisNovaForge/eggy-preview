(function(){
    'use strict';

    function numberColor(value,fallback){
        var number=Number(value);
        return Number.isFinite(number)&&number>=0&&number<=0xFFFFFF?Math.round(number):fallback;
    }

    var MOTION={
        blossomTraveler:{catchStyle:'twirl',missStyle:'droop',catchDuration:.48,missDuration:.62,gaitSpeed:8.4,step:.016,lean:.052,turn:.09,idleFloat:.01,aura:'✿'},
        herbTraveler:{catchStyle:'sprout',missStyle:'fold',catchDuration:.36,missDuration:.48,gaitSpeed:13.2,step:.026,lean:.105,turn:.12,idleFloat:.008,aura:'❧'},
        saltCrystalTraveler:{catchStyle:'flash',missStyle:'freeze',catchDuration:.28,missDuration:.58,gaitSpeed:5.8,step:.004,lean:.026,turn:.045,idleFloat:.003,aura:'◇'},
        cloudwingTraveler:{catchStyle:'float',missStyle:'sink',catchDuration:.64,missDuration:.72,gaitSpeed:6.8,step:.007,lean:.038,turn:.065,idleFloat:.032,aura:'☁'},
        fruitbrewTraveler:{catchStyle:'doubleBounce',missStyle:'squash',catchDuration:.52,missDuration:.58,gaitSpeed:9.6,step:.028,lean:.075,turn:.1,idleFloat:.01,aura:'●'},
        berryTraveler:{catchStyle:'wiggle',missStyle:'tremble',catchDuration:.42,missDuration:.46,gaitSpeed:14.4,step:.025,lean:.115,turn:.14,idleFloat:.014,aura:'✦'},
        spicyFlameTraveler:{catchStyle:'punch',missStyle:'recoil',catchDuration:.3,missDuration:.44,gaitSpeed:12.4,step:.019,lean:.14,turn:.13,idleFloat:.006,aura:'▲'},
        goldenGrainTraveler:{catchStyle:'bow',missStyle:'slowBow',catchDuration:.6,missDuration:.68,gaitSpeed:7.2,step:.012,lean:.048,turn:.07,idleFloat:.016,aura:'≋'}
    };

    function CharacterView(options){
        options=options||{};
        if(!options.mount)throw new Error('Brick breaker character mount missing');
        if(!window.THREE||typeof window.createEggMesh!=='function')throw new Error('Official traveler renderer missing');

        var character=options.character||{},style=character.style||{};
        this.characterId=character.id||'blossomTraveler';
        this.motion=MOTION[this.characterId]||MOTION.blossomTraveler;
        this.bodyColor=numberColor(style.color,0xFFFDF2);
        this.accentColor=numberColor(style.accent,0xEF4A5B);
        this.mount=options.mount;
        this.board=options.board;
        this.stage=options.stage;
        this.lastX=480;
        this.walkPhase=0;
        this.reaction=null;
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
        this.scene.add(this.model);
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

    CharacterView.prototype.render=function(x,y,velocity,dt,ballVisual){
        var boardRect=this.board.getBoundingClientRect(),stageRect=this.stage.getBoundingClientRect();
        if(!boardRect.width||!boardRect.height)return;
        var sx=boardRect.width/960,sy=boardRect.height/720;
        this.mount.style.left=(boardRect.left-stageRect.left+(x-63)*sx)+'px';
        this.mount.style.top=(boardRect.top-stageRect.top+(y-35)*sy)+'px';
        this.mount.style.width=(126*sx)+'px';
        this.mount.style.height=(108*sy)+'px';

        var normalized=Math.max(-1,Math.min(1,(velocity||0)/690));
        if(Math.abs(normalized)>0.01)this.walkPhase+=Math.max(0,dt||0)*this.motion.gaitSpeed*(.35+Math.abs(normalized)*.65);
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
                else if(this.motion.missStyle==='fold')offset=-side*.25*missAmount;
                else if(this.motion.missStyle==='sink')offset=side*.09*missAmount;
                else if(this.motion.missStyle==='squash')offset=-side*.22*missAmount;
                else if(this.motion.missStyle==='tremble')offset=-side*(.1+Math.sin(reactionProgress*Math.PI*8)*.09)*missAmount;
                else if(this.motion.missStyle==='recoil')offset=side*.2*missAmount;
                else if(this.motion.missStyle==='slowBow')offset=-side*.12*missAmount;
                else offset=-side*.16*missAmount;
            }
            arm.rotation.z+=offset;arm.userData._bbReactionZ=offset;
        }
        var catchX=0,catchY=0,catchZ=0,catchLift=0,scaleX=0,scaleY=0,scaleZ=0;
        if(catchAmount){
            if(this.motion.catchStyle==='twirl'){catchY=Math.sin(reactionProgress*Math.PI*2)*.32*catchAmount;catchZ=Math.sin(reactionProgress*Math.PI*2)*.07;catchLift=.11*catchAmount;}
            else if(this.motion.catchStyle==='sprout'){catchZ=-Math.sin(reactionProgress*Math.PI)*.045;catchLift=.1*catchAmount;scaleY=.035*catchAmount;}
            else if(this.motion.catchStyle==='flash'){var snap=Math.sin(Math.min(1,reactionProgress*2)*Math.PI);catchY=.08*Math.sin(reactionProgress*Math.PI*4);catchLift=.055*snap;scaleX=scaleY=scaleZ=.045*snap;}
            else if(this.motion.catchStyle==='float'){catchZ=Math.sin(reactionProgress*Math.PI*2)*.035;catchLift=.17*catchAmount;scaleY=.018*catchAmount;}
            else if(this.motion.catchStyle==='doubleBounce'){var bounce=Math.abs(Math.sin(reactionProgress*Math.PI*2))*catchAmount;catchLift=.13*bounce;scaleX=.055*bounce;scaleY=-.055*bounce;}
            else if(this.motion.catchStyle==='wiggle'){catchZ=Math.sin(reactionProgress*Math.PI*7)*.12*catchAmount;catchY=Math.sin(reactionProgress*Math.PI*5)*.1*catchAmount;catchLift=.105*catchAmount;scaleX=.035*catchAmount;scaleY=-.025*catchAmount;}
            else if(this.motion.catchStyle==='punch'){catchX=-.1*catchAmount;catchZ=-.055*catchAmount;catchLift=.085*catchAmount;scaleY=.025*catchAmount;}
            else if(this.motion.catchStyle==='bow'){catchX=.15*catchAmount;catchLift=.045*catchAmount;}
        }
        var missX=0,missY=0,missZ=0,missDrop=0;
        if(missAmount){
            if(this.motion.missStyle==='droop'){missX=.13*missAmount;missZ=.055*missAmount;missDrop=.065*missAmount;scaleY-=.035*missAmount;}
            else if(this.motion.missStyle==='fold'){missX=.1*missAmount;missDrop=.045*missAmount;scaleX-=.045*missAmount;}
            else if(this.motion.missStyle==='freeze'){missX=.055*missAmount;scaleX-=.018*missAmount;scaleY+=.012*missAmount;}
            else if(this.motion.missStyle==='sink'){missZ=Math.sin(reactionProgress*Math.PI*3)*.035*missAmount;missDrop=.105*missAmount;scaleY-=.03*missAmount;}
            else if(this.motion.missStyle==='squash'){missDrop=.07*missAmount;scaleX+=.07*missAmount;scaleY-=.09*missAmount;}
            else if(this.motion.missStyle==='tremble'){missZ=Math.sin(reactionProgress*Math.PI*10)*.1*missAmount;missDrop=.055*missAmount;}
            else if(this.motion.missStyle==='recoil'){missX=.15*missAmount;missY=-.12*missAmount;missDrop=.05*missAmount;scaleY-=.045*missAmount;}
            else if(this.motion.missStyle==='slowBow'){missX=.2*missAmount;missDrop=.045*missAmount;}
        }
        var impactSquash=0,bodyPop=0;
        if(catchAmount){
            if(reactionProgress<.18)impactSquash=Math.sin(Math.PI*reactionProgress/.18);
            if(reactionProgress>.1&&reactionProgress<.56)bodyPop=Math.sin(Math.PI*(reactionProgress-.1)/.46);
        }
        scaleX+=previewAmount*.025+impactSquash*.09;
        scaleY-=previewAmount*.035+impactSquash*.115;
        scaleY+=bodyPop*.025;
        var moving=Math.abs(normalized),gait=Math.sin(this.walkPhase),gaitLift=Math.abs(Math.sin(this.walkPhase))*this.motion.step*moving;
        var gaitSway=0;
        if(this.motion.catchStyle==='twirl'||this.motion.catchStyle==='bow')gaitSway=gait*.018*moving;
        else if(this.motion.catchStyle==='wiggle')gaitSway=gait*.035*moving;
        var targetZ=-normalized*this.motion.lean+gaitSway+catchZ+missZ-receiveOffset*(.34+.12*Math.abs(receiveOffset))*receiveAmount;
        var targetY=normalized*this.motion.turn+catchY+missY;
        var targetX=(this.motion.catchStyle==='punch'?-moving*.035:0)+catchX+missX;
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
        this.model.position.y=-.03+idle+gaitLift+catchLift-missDrop-previewAmount*.045-impactSquash*.055+bodyPop*.085;
        this.renderer.render(this.scene,this.camera);
        this.lastX=x;
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
