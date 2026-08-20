(function(){
    'use strict';

    function numberColor(value,fallback){
        var number=Number(value);
        return Number.isFinite(number)&&number>=0&&number<=0xFFFFFF?Math.round(number):fallback;
    }

    var MOTION={
        blossomTraveler:{catchLift:.12,catchTilt:.055,wave:'single',missTilt:.11,idleFloat:.008},
        herbTraveler:{catchLift:.08,catchTilt:.035,wave:'open',missTilt:.09,idleFloat:.012},
        saltCrystalTraveler:{catchLift:.065,catchTilt:.018,wave:'glint',missTilt:.075,idleFloat:.004},
        cloudwingTraveler:{catchLift:.15,catchTilt:.04,wave:'float',missTilt:.08,idleFloat:.025},
        fruitbrewTraveler:{catchLift:.13,catchTilt:.05,wave:'double',missTilt:.13,idleFloat:.01},
        berryTraveler:{catchLift:.14,catchTilt:.08,wave:'wiggle',missTilt:.14,idleFloat:.014},
        spicyFlameTraveler:{catchLift:.11,catchTilt:.025,wave:'cheer',missTilt:.1,idleFloat:.006},
        goldenGrainTraveler:{catchLift:.075,catchTilt:.025,wave:'bow',missTilt:.085,idleFloat:.016}
    };

    function CharacterView(options){
        options=options||{};
        if(!options.mount)throw new Error('Brick breaker character mount missing');
        if(!window.THREE||typeof window.createEggMesh!=='function')throw new Error('Official traveler renderer missing');

        var character=options.character||{},style=character.style||{};
        this.characterId=character.id||'blossomTraveler';
        this.motion=MOTION[this.characterId]||MOTION.blossomTraveler;
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
        this.mount.appendChild(this.renderer.domElement);

        this.scene.add(new THREE.HemisphereLight(0xFFF9E8,0x6F9B91,2.2));
        var key=new THREE.DirectionalLight(0xFFF7E5,3.0);key.position.set(-3,5,5);this.scene.add(key);
        var rim=new THREE.DirectionalLight(0xBCEEFF,1.35);rim.position.set(4,2,-3);this.scene.add(rim);

        this.model=window.createEggMesh(
            numberColor(style.color,0xFFFDF2),
            numberColor(style.accent,0xEF4A5B),
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

    CharacterView.prototype.react=function(type){
        if(type!=='catch'&&type!=='miss')return;
        this.reaction={type:type,elapsed:0,duration:type==='catch'?.34:.52};
    };

    CharacterView.prototype.resetReaction=function(){this.reaction=null;};

    CharacterView.prototype.render=function(x,y,velocity,dt){
        var boardRect=this.board.getBoundingClientRect(),stageRect=this.stage.getBoundingClientRect();
        if(!boardRect.width||!boardRect.height)return;
        var sx=boardRect.width/960,sy=boardRect.height/720;
        this.mount.style.left=(boardRect.left-stageRect.left+(x-63)*sx)+'px';
        this.mount.style.top=(boardRect.top-stageRect.top+(y+4)*sy)+'px';
        this.mount.style.width=(126*sx)+'px';
        this.mount.style.height=(108*sy)+'px';

        var normalized=Math.max(-1,Math.min(1,(velocity||0)/690));
        if(Math.abs(normalized)>0.01)this.walkPhase+=Math.max(0,dt||0)*10.5*Math.abs(normalized);
        this.rig.vx=normalized;this.rig.walkPhase=this.walkPhase;
        var arms=this.model.userData&&this.model.userData._decorArms;
        if(arms)for(var ai=0;ai<arms.length;ai++){
            var oldOffset=arms[ai].userData._bbReactionZ||0;
            arms[ai].rotation.z-=oldOffset;arms[ai].userData._bbReactionZ=0;
        }
        if(typeof window._updateCharacterPremiumRig==='function')window._updateCharacterPremiumRig(this.rig,Math.abs(normalized));
        else if(typeof window._animateCuteCharacterDetails==='function')window._animateCuteCharacterDetails(this.model,performance.now()*0.001);

        var catchAmount=0,missAmount=0,reactionProgress=0;
        if(this.reaction){
            this.reaction.elapsed=Math.min(this.reaction.duration,this.reaction.elapsed+Math.max(0,dt||0));
            reactionProgress=this.reaction.elapsed/this.reaction.duration;
            if(this.reaction.type==='catch')catchAmount=Math.sin(Math.PI*reactionProgress);
            else missAmount=Math.sin(Math.PI*reactionProgress);
            if(this.reaction.elapsed>=this.reaction.duration)this.reaction=null;
        }
        if(arms)for(var ri=0;ri<arms.length;ri++){
            var arm=arms[ri],side=arm.userData._side||1,offset=0;
            if(catchAmount){
                if(this.motion.wave==='single'&&side>0)offset=side*(.27+Math.sin(reactionProgress*Math.PI*3)*.07)*catchAmount;
                else if(this.motion.wave==='open')offset=side*.19*catchAmount;
                else if(this.motion.wave==='glint')offset=side*(.12+Math.sin(reactionProgress*Math.PI*4)*.045)*catchAmount;
                else if(this.motion.wave==='float')offset=side*.24*catchAmount;
                else if(this.motion.wave==='double')offset=side*(.24+Math.sin(reactionProgress*Math.PI*2)*.045)*catchAmount;
                else if(this.motion.wave==='wiggle')offset=side*(.2+Math.sin(reactionProgress*Math.PI*5)*.09)*catchAmount;
                else if(this.motion.wave==='cheer')offset=-side*.26*catchAmount;
                else if(this.motion.wave==='bow')offset=-side*.11*catchAmount;
            }
            else if(missAmount)offset=-side*.16*missAmount;
            arm.rotation.z+=offset;arm.userData._bbReactionZ=offset;
        }
        var reactionTilt=catchAmount*Math.sin(reactionProgress*Math.PI*2)*this.motion.catchTilt;
        this.model.rotation.z+=((-normalized*0.075+reactionTilt)-this.model.rotation.z)*0.2;
        this.model.rotation.y+=(normalized*0.10-this.model.rotation.y)*0.12;
        this.model.rotation.x+=(missAmount*this.motion.missTilt-this.model.rotation.x)*0.24;
        var catchPulse=this.motion.wave==='glint'?Math.sin(reactionProgress*Math.PI*2)*.018:0;
        var squash=(this.motion.wave==='double'||this.motion.wave==='wiggle')?catchAmount*.025:0;
        this.model.scale.x+=(this.baseScale*(1+squash+catchPulse)-this.model.scale.x)*0.24;
        this.model.scale.y+=(this.baseScale*(1-squash-missAmount*.045+catchPulse)-this.model.scale.y)*0.24;
        this.model.scale.z+=(this.baseScale*(1+catchPulse)-this.model.scale.z)*0.24;
        var idle=Math.sin(performance.now()*.0022)*this.motion.idleFloat;
        this.model.position.y=-0.03+idle+Math.sin(this.walkPhase*2)*0.018*Math.abs(normalized)+catchAmount*this.motion.catchLift-missAmount*.055;
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
