(function(){
    'use strict';

    function numberColor(value,fallback){
        var number=Number(value);
        return Number.isFinite(number)&&number>=0&&number<=0xFFFFFF?Math.round(number):fallback;
    }

    function CharacterView(options){
        options=options||{};
        if(!options.mount)throw new Error('Brick breaker character mount missing');
        if(!window.THREE||typeof window.createEggMesh!=='function')throw new Error('Official traveler renderer missing');

        var character=options.character||{},style=character.style||{};
        this.mount=options.mount;
        this.board=options.board;
        this.stage=options.stage;
        this.lastX=480;
        this.walkPhase=0;
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
            character.id||'blossomTraveler'
        );
        this.model.scale.setScalar(0.95);
        this.model.position.y=-0.03;
        this.scene.add(this.model);
        this.rig={
            mesh:this.model,onGround:true,vx:0,vy:0,walkPhase:0,
            _atkAnim:0,holding:null,heldBy:null,_hitStun:0,_stunTimer:0,
            throwTimer:0,_electrocuted:0,_elecFlying:0
        };
    }

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
        if(typeof window._updateCharacterPremiumRig==='function')window._updateCharacterPremiumRig(this.rig,Math.abs(normalized));
        else if(typeof window._animateCuteCharacterDetails==='function')window._animateCuteCharacterDetails(this.model,performance.now()*0.001);
        this.model.rotation.z+=((-normalized*0.075)-this.model.rotation.z)*0.16;
        this.model.rotation.y+=(normalized*0.10-this.model.rotation.y)*0.12;
        this.model.position.y=-0.03+Math.sin(this.walkPhase*2)*0.018*Math.abs(normalized);
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
