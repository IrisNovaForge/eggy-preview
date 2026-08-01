// entity.js — DANBO World
// ============================================================
//  EGG MESH & ENTITY
// ============================================================
function _charMixHex(a,b,t){
    if(typeof _mixHex==='function')return _mixHex(a,b,t);
    t=Math.max(0,Math.min(1,t));
    var ar=(a>>16)&255,ag=(a>>8)&255,ab=a&255;
    var br=(b>>16)&255,bg=(b>>8)&255,bb=b&255;
    var r=Math.round(ar+(br-ar)*t),g=Math.round(ag+(bg-ag)*t),bl=Math.round(ab+(bb-ab)*t);
    return (r<<16)|(g<<8)|bl;
}

function _addCharacterPolish(g,body,color,accent,charType){
    accent=(accent===undefined||accent===null)?0xFFCC00:accent;
    var type=charType||'egg';
    var faceZ=(type==='bear')?0.86:((type==='bull'||type==='cat')?0.68:(type==='cockroach'?0.42:0.60));
    var beltR=(type==='bear')?0.70:((type==='bull'||type==='cat')?0.54:(type==='cockroach'?0.28:0.42));
    // Thin black back-face outline: makes each character read like a richer toy figure.
    var outline=new THREE.Mesh(body.geometry.clone(),new THREE.MeshBasicMaterial({
        color:0x121212,side:THREE.BackSide,transparent:true,opacity:0.18,depthWrite:false
    }));
    outline.position.copy(body.position);
    outline.scale.copy(body.scale).multiplyScalar(1.055);
    outline.renderOrder=-2;
    g.add(outline);
    g.userData._toonOutline=outline;

    // Glossy toy/plastic highlight: tiny additive decals sell the premium vinyl figure look.
    var glossMat=new THREE.MeshBasicMaterial({
        color:0xFFFFFF,transparent:true,opacity:0.24,depthWrite:false,depthTest:true,
        blending:THREE.AdditiveBlending,side:THREE.DoubleSide,fog:false
    });
    var bigGloss=new THREE.Mesh(new THREE.CircleGeometry(0.17,18),glossMat);
    bigGloss.position.set(-0.20,1.02,faceZ+0.055);
    bigGloss.scale.set(1.0,0.48,1);
    bigGloss.rotation.z=-0.25;
    body.add(bigGloss);
    var smallGloss=new THREE.Mesh(new THREE.CircleGeometry(0.055,14),glossMat.clone());
    smallGloss.material.opacity=0.18;
    smallGloss.position.set(0.22,0.98,faceZ+0.065);
    smallGloss.scale.set(1.0,0.62,1);
    body.add(smallGloss);

    // More expressive eyes: colored iris, tiny pupil, extra highlight, and eyebrows.
    var irisColor=_charMixHex(accent,0xFFFFFF,0.25);
    var irisG=new THREE.SphereGeometry(0.078,10,8);
    var tinyPupilG=new THREE.SphereGeometry(0.038,8,6);
    var tinyShineG=new THREE.SphereGeometry(0.018,6,4);
    var irisMat=toon(irisColor,{emissive:irisColor,emissiveIntensity:0.10});
    var browMat=toon(type==='egg'?0x222222:_charMixHex(color,0x111111,0.55));
    var detailEyes=[];
    [-1,1].forEach(function(s){
        var iris=new THREE.Mesh(irisG,irisMat);
        iris.position.set(s*0.24,0.865,faceZ);
        iris.scale.set(0.95,1.05,0.35);body.add(iris);detailEyes.push(iris);
        var pp=new THREE.Mesh(tinyPupilG,toon(0x111111));
        pp.position.set(s*0.24,0.858,faceZ+0.035);
        pp.scale.set(0.82,1.05,0.45);body.add(pp);detailEyes.push(pp);
        var sh=new THREE.Mesh(tinyShineG,toon(0xFFFFFF,{emissive:0xFFFFFF,emissiveIntensity:0.2}));
        sh.position.set(s*0.20,0.905,faceZ+0.07);body.add(sh);detailEyes.push(sh);
        var brow=new THREE.Mesh(new THREE.BoxGeometry(0.20,0.035,0.035),browMat);
        brow.position.set(s*0.24,1.075,faceZ-0.015);
        brow.rotation.z=-s*0.18;
        body.add(brow);
    });
    g.userData._irisDetails=detailEyes;

    // Costume silhouette: belt/collar/sash details are cheap meshes but visible close-up.
    var beltMat=toon(type==='egg'||type==='dog'?0x1F1F1F:_charMixHex(accent,0x111111,0.28));
    var belt=new THREE.Mesh(new THREE.TorusGeometry(beltR,0.026,6,28),beltMat);
    belt.position.set(0,0.22,0.02);belt.rotation.x=Math.PI/2;
    belt.scale.z=0.72;body.add(belt);
    var buckle=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.10,0.035),toon(_charMixHex(accent,0xFFFFFF,0.18),{emissive:accent,emissiveIntensity:0.10}));
    buckle.position.set(0,0.22,faceZ+0.005);body.add(buckle);
    [-1,1].forEach(function(s){
        var sash=new THREE.Mesh(new THREE.BoxGeometry(0.075,0.48,0.034),toon(_charMixHex(accent,0xFFFFFF,0.10)));
        sash.position.set(s*0.115,0.50,faceZ);
        sash.rotation.z=s*0.34;
        body.add(sash);
    });
    // Visible gloves / cuffs near the stub arms.
    [-1,1].forEach(function(s){
        var cuff=new THREE.Mesh(new THREE.SphereGeometry(0.085,8,6),toon(_charMixHex(accent,0xFFFFFF,0.20)));
        cuff.position.set(s*0.57,0.55,0.18);
        cuff.scale.set(1.15,0.75,0.85);
        body.add(cuff);
    });

    // Type-specific costume accents, so silhouettes are different even from a distance.
    if(type==='egg'){
        var giMat=toon(0xEDEDE6);
        [-1,1].forEach(function(s){
            var fold=new THREE.Mesh(new THREE.BoxGeometry(0.035,0.55,0.032),giMat);
            fold.position.set(s*0.10,0.52,faceZ+0.01);fold.rotation.z=-s*0.28;body.add(fold);
        });
        var knot=new THREE.Mesh(new THREE.SphereGeometry(0.055,6,4),toon(0xCC2222,{emissive:0xCC2222,emissiveIntensity:0.15}));
        knot.position.set(0.18,1.03,-0.35);body.add(knot);
    } else if(type==='dog'){
        var flameMat=toon(0xFFDD44,{emissive:0xFFAA00,emissiveIntensity:0.18});
        [-1,1].forEach(function(s){
            var flame=new THREE.Mesh(new THREE.ConeGeometry(0.045,0.22,4),flameMat);
            flame.position.set(s*0.20,0.46,faceZ+0.02);
            flame.rotation.z=s*0.28;body.add(flame);
        });
    } else if(type==='bull'){
        var ropeMat=toon(0xF2E0A8);
        var rope=new THREE.Mesh(new THREE.TorusGeometry(0.50,0.024,6,24),ropeMat);
        rope.position.set(0,0.48,0.04);rope.rotation.x=Math.PI/2;rope.scale.z=0.75;body.add(rope);
        for(var ri=0;ri<7;ri++){
            var bead=new THREE.Mesh(new THREE.SphereGeometry(0.035,6,4),ropeMat);
            var a=-0.9+ri*0.3;bead.position.set(Math.sin(a)*0.35,0.47,faceZ+Math.cos(a)*0.04);
            body.add(bead);
        }
    } else if(type==='cat'){
        var elecMat=toon(0xDFFF44,{emissive:0xCCFF00,emissiveIntensity:0.35});
        for(var ei=0;ei<4;ei++){
            var bolt=new THREE.Mesh(new THREE.BoxGeometry(0.035,0.34,0.036),elecMat);
            bolt.position.set(-0.30+ei*0.20,0.48+(ei%2)*0.10,faceZ+0.01);
            bolt.rotation.z=(ei%2?0.55:-0.55);body.add(bolt);
        }
    } else if(type==='rooster'){
        var tagMat=toon(0xDDDDDD,{emissive:0xAAAAAA,emissiveIntensity:0.1});
        var chain=new THREE.Mesh(new THREE.TorusGeometry(0.27,0.012,5,18),tagMat);
        chain.position.set(0,0.50,faceZ-0.05);chain.rotation.x=Math.PI/2;body.add(chain);
        var tag=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.16,0.025),tagMat);
        tag.position.set(0,0.36,faceZ+0.02);body.add(tag);
    } else if(type==='monkey'){
        var trimMat=toon(0xFFDD55,{emissive:0xFFAA00,emissiveIntensity:0.12});
        [-1,1].forEach(function(s){
            var trim=new THREE.Mesh(new THREE.BoxGeometry(0.032,0.60,0.032),trimMat);
            trim.position.set(s*0.19,0.50,faceZ+0.01);body.add(trim);
            var bracelet=new THREE.Mesh(new THREE.TorusGeometry(0.085,0.014,5,12),trimMat);
            bracelet.position.set(s*0.58,0.54,0.18);bracelet.rotation.y=Math.PI/2;body.add(bracelet);
        });
    } else if(type==='bear'){
        var wristMat=toon(0xCC3333,{emissive:0x661111,emissiveIntensity:0.08});
        [-1,1].forEach(function(s){
            var wrist=new THREE.Mesh(new THREE.TorusGeometry(0.13,0.026,6,16),wristMat);
            wrist.position.set(s*0.64,0.52,0.22);wrist.rotation.y=Math.PI/2;body.add(wrist);
        });
    } else if(type==='cockroach'){
        var beadMat=toon(0xFFF0CC);
        for(var bi=0;bi<8;bi++){
            var ba=-1.2+bi*0.34;
            var bead2=new THREE.Mesh(new THREE.SphereGeometry(0.032,6,4),beadMat);
            bead2.position.set(Math.sin(ba)*0.24,0.53,faceZ+Math.cos(ba)*0.035);
            body.add(bead2);
        }
        var wrap=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.06,0.035),toon(0xFFAA44));
        wrap.position.set(0,0.27,faceZ+0.01);body.add(wrap);
    }
}

function _makeSoftCapsule(radius,len,mat,tipMat){
    var limb=new THREE.Group();
    var shaft=new THREE.Mesh(new THREE.CylinderGeometry(radius*0.82,radius,len,8),mat);
    shaft.position.y=-len*0.5;limb.add(shaft);
    var capTop=new THREE.Mesh(new THREE.SphereGeometry(radius,8,6),mat);
    capTop.position.y=0;limb.add(capTop);
    var hand=new THREE.Mesh(new THREE.SphereGeometry(radius*1.32,10,8),tipMat||mat);
    hand.position.y=-len;hand.scale.set(1.08,0.86,1.0);limb.add(hand);
    limb.userData._hand=hand;
    return limb;
}

var _starShapeGeometryCache={};
function _starShapeGeometry(outerR,innerR,points){
    var key=[outerR,innerR,points||5].join(':');
    if(_starShapeGeometryCache[key])return _starShapeGeometryCache[key];
    var shape=new THREE.Shape();
    points=points||5;
    for(var i=0;i<points*2;i++){
        var a=-Math.PI/2+i*Math.PI/points;
        var r=(i%2===0)?outerR:innerR;
        var x=Math.cos(a)*r,y=Math.sin(a)*r;
        if(i===0)shape.moveTo(x,y);else shape.lineTo(x,y);
    }
    shape.closePath();
    _starShapeGeometryCache[key]=new THREE.ShapeGeometry(shape);
    return _starShapeGeometryCache[key];
}

function _addPremiumCharacterRig(g,body,color,accent,charType,feet){
    if(!g||!body)return;
    var type=charType||'egg';
    accent=(accent===undefined||accent===null)?0xFFCC66:accent;
    var faceZ=(type==='bear')?0.87:((type==='bull'||type==='cat')?0.70:(type==='cockroach'?0.45:0.60));
    var softBody=_charMixHex(color,0xFFFFFF,0.13);
    var gloveColor=(type==='egg'||type==='dog'||type==='monkey')?0xFFFFFF:_charMixHex(accent,0xFFFFFF,0.28);
    var armMat=toon(softBody);
    var gloveMat=toon(gloveColor,{emissive:_charMixHex(gloveColor,0xFFFFFF,0.15),emissiveIntensity:0.06});
    var cuffMat=toon(_charMixHex(accent,0xFFFFFF,0.28),{emissive:accent,emissiveIntensity:0.08});
    var decorArms=[];

    // Full, readable arms with mittens. These stay visible in idle/walk, while the
    // old hidden attack limbs are still used for punch/kick hit readability.
    [-1,1].forEach(function(s){
        var arm=_makeSoftCapsule(type==='bear'?0.105:0.082,type==='bear'?0.58:0.48,armMat,gloveMat);
        arm.position.set(s*((type==='bear')?0.75:0.58),(type==='bear')?0.80:0.78,0.10);
        arm.rotation.z=s*((type==='bear')?0.48:0.62);
        arm.rotation.x=0.05;
        arm.userData._side=s;arm.userData._restZ=arm.rotation.z;arm.userData._restX=arm.rotation.x;
        body.add(arm);decorArms.push(arm);
        var cuff=new THREE.Mesh(new THREE.TorusGeometry((type==='bear')?0.105:0.082,0.018,6,14),cuffMat);
        cuff.position.y=0.01;cuff.rotation.x=Math.PI/2;arm.add(cuff);
    });
    g.userData._decorArms=decorArms;

    // Shoe details make the small feet feel like designed toy parts instead of plain blobs.
    if(feet&&feet.length){
        var soleMat=toon(_charMixHex(accent,0x111111,0.32));
        var toeMat=toon(_charMixHex(accent,0xFFFFFF,0.40),{emissive:accent,emissiveIntensity:0.06});
        for(var fi=0;fi<feet.length;fi++){
            var ft=feet[fi];
            var sole=new THREE.Mesh(new THREE.BoxGeometry(0.24,0.032,0.16),soleMat);
            sole.position.set(0,-0.055,0.04);ft.add(sole);
            var toe=new THREE.Mesh(new THREE.SphereGeometry(0.045,6,4),toeMat);
            toe.position.set((fi===0?-0.025:0.025),0.01,0.145);
            toe.scale.set(1.15,0.55,0.75);ft.add(toe);
        }
    }

    // Soft pastel eyelids for real blink animation.
    var lidMat=toon(_charMixHex(color,0xFFE9F4,0.30),{transparent:true,opacity:0.98,side:THREE.DoubleSide});
    var blinkLids=[];
    [-1,1].forEach(function(s){
        var lid=new THREE.Mesh(new THREE.CircleGeometry(0.17,18),lidMat);
        lid.position.set(s*0.24,0.885,0.595);
        lid.scale.set(0.95,0.08,1);
        lid.visible=false;
        body.add(lid);blinkLids.push(lid);
    });
    g.userData._blinkLids=blinkLids;

    // Extra cheek stickers + glossy vinyl badge. Flat shapes are cheap but add charm up close.
    var heartMat=toon(0xFF8FB6,{transparent:true,opacity:0.86,side:THREE.DoubleSide,emissive:0xFF7FA8,emissiveIntensity:0.08});
    [-1,1].forEach(function(s){
        var heart=new THREE.Mesh(_starShapeGeometry(0.055,0.028,5),heartMat);
        heart.position.set(s*0.38,0.70,0.575);
        heart.rotation.z=s*0.18;
        body.add(heart);
    });
    var badgeMat=toon(_charMixHex(accent,0xFFFFFF,0.18),{emissive:accent,emissiveIntensity:0.16});
    var badge=new THREE.Mesh(_starShapeGeometry(0.08,0.042,5),badgeMat);
    badge.position.set(0.18,0.38,faceZ+0.025);
    badge.rotation.z=0.25;
    body.add(badge);
    g.userData._premiumBadge=badge;

    // Character-specific silhouette upgrades, kept simple/round so the game remains cute.
    if(type==='egg'){
        var scarfMat=toon(0xE9465D,{emissive:0xD83A52,emissiveIntensity:0.12});
        var scarf=new THREE.Mesh(new THREE.TorusGeometry(0.39,0.028,7,28),scarfMat);
        scarf.position.set(0,0.83,0.02);scarf.rotation.x=Math.PI/2;scarf.scale.z=0.78;body.add(scarf);
        [-1,1].forEach(function(s){
            var tail=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.26,0.026),scarfMat);
            tail.position.set(s*0.12,0.73,faceZ+0.015);tail.rotation.z=s*0.28;body.add(tail);
        });
    }else if(type==='dog'){
        var bandMat=toon(0xFFDD55,{emissive:0xFFB833,emissiveIntensity:0.14});
        var band=new THREE.Mesh(new THREE.TorusGeometry(0.40,0.025,7,24),bandMat);
        band.position.set(0,0.82,0.02);band.rotation.x=Math.PI/2;band.scale.z=0.76;body.add(band);
        var bone=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.055,0.03),toon(0xFFF4DD));
        bone.position.set(-0.16,0.42,faceZ+0.03);bone.rotation.z=-0.25;body.add(bone);
    }else if(type==='cat'){
        var lightningMat=toon(0xFFF45A,{emissive:0xF7FF33,emissiveIntensity:0.35});
        [-1,1].forEach(function(s){
            var bolt=new THREE.Mesh(_starShapeGeometry(0.075,0.024,4),lightningMat);
            bolt.position.set(s*0.52,0.92,0.31);bolt.rotation.z=s*0.75;body.add(bolt);
        });
    }else if(type==='rooster'){
        var medal=new THREE.Mesh(new THREE.CylinderGeometry(0.075,0.075,0.026,18),toon(0xFFD76A,{emissive:0xFFBB33,emissiveIntensity:0.16}));
        medal.position.set(0,0.36,faceZ+0.04);medal.rotation.x=Math.PI/2;body.add(medal);
        var medalStar=new THREE.Mesh(_starShapeGeometry(0.045,0.020,5),toon(0xFFFFFF,{emissive:0xFFFFFF,emissiveIntensity:0.12}));
        medalStar.position.set(0,0.36,faceZ+0.058);body.add(medalStar);
    }else if(type==='monkey'){
        var skirtMat=toon(0x6AA7FF,{emissive:0x4C88FF,emissiveIntensity:0.08});
        for(var ki=0;ki<5;ki++){
            var panel=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.22,4),skirtMat);
            panel.position.set((ki-2)*0.085,0.20,faceZ-0.03);
            panel.rotation.x=Math.PI;panel.rotation.z=(ki-2)*0.08;body.add(panel);
        }
    }else if(type==='bull'){
        var padMat=toon(_charMixHex(color,0xFFFFFF,0.22));
        [-1,1].forEach(function(s){
            var shoulder=new THREE.Mesh(new THREE.SphereGeometry(0.16,8,6),padMat);
            shoulder.position.set(s*0.58,0.84,0.06);shoulder.scale.set(1.2,0.85,0.8);body.add(shoulder);
        });
    }else if(type==='bear'){
        var beltMat=toon(0xEBC963,{emissive:0xC9A133,emissiveIntensity:0.10});
        var champ=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.16,0.045),beltMat);
        champ.position.set(0,0.20,faceZ+0.03);body.add(champ);
    }else if(type==='cockroach'){
        var wingGlow=toon(0xD8B07A,{transparent:true,opacity:0.33,side:THREE.DoubleSide});
        [-1,1].forEach(function(s){
            var wing=new THREE.Mesh(new THREE.SphereGeometry(0.18,8,6),wingGlow);
            wing.position.set(s*0.16,0.82,-0.42);
            wing.scale.set(0.55,1.55,0.16);wing.rotation.z=s*0.08;body.add(wing);
        });
    }
}

function _updateCharacterPremiumRig(egg,speed){
    if(!egg||!egg.mesh||!egg.mesh.userData)return;
    var ud=egg.mesh.userData;
    var now=(typeof performance!=='undefined'&&performance.now)?performance.now()*0.001:Date.now()*0.001;
    _animateCuteCharacterDetails(egg.mesh,now);
    var moving=speed>0.006&&egg.onGround;
    var phase=egg.walkPhase||0;
    if(ud._decorArms){
        var idleArmProfiles={
            egg:{frequency:1.65,amplitude:.052,x:.024},bull:{frequency:1.12,amplitude:.030,x:.016},
            cat:{frequency:1.42,amplitude:.022,x:.012},rooster:{frequency:.92,amplitude:.045,x:.030},
            dog:{frequency:1.82,amplitude:.060,x:.026},monkey:{frequency:2.05,amplitude:.072,x:.032},
            bear:{frequency:1.28,amplitude:.034,x:.014},cockroach:{frequency:.86,amplitude:.040,x:.020}
        },idleArm=idleArmProfiles[ud._charType]||idleArmProfiles.egg;
        for(var i=0;i<ud._decorArms.length;i++){
            var arm=ud._decorArms[i];
            var side=arm.userData._side||1;
            var restZ=arm.userData._restZ||side*0.6;
            var swing=moving?Math.sin(phase+side*Math.PI)*0.38:Math.sin(now*idleArm.frequency+side)*idleArm.amplitude;
            var tuck=(egg._atkAnim>0||egg.holding||egg.heldBy)?0.32:0;
            arm.rotation.z+=(restZ+swing+side*tuck-arm.rotation.z)*0.18;
            arm.rotation.x+=(0.05+Math.sin(now*(idleArm.frequency*.82)+side)*idleArm.x-arm.rotation.x)*0.14;
            if(arm.userData._hand){
                var handPulse=1+Math.sin(now*3.1+side)*0.018;
                arm.userData._hand.scale.setScalar(handPulse);
            }
        }
    }
    // Gentle eye tracking in the movement direction.
    if(ud._pupils){
        var lookX=Math.max(-0.028,Math.min(0.028,egg.vx*0.18));
        var lookY=egg.vy>0.03?0.018:(egg.vy<-0.04?-0.012:0);
        for(var pi=0;pi<ud._pupils.length;pi++){
            var ps=pi===0?-1:1,basePupil=ud._pupilBasePositions&&ud._pupilBasePositions[pi];
            var basePX=basePupil?basePupil.x:ps*.225,basePY=basePupil?basePupil.y:.165;
            ud._pupils[pi].position.x+=((basePX+lookX)-ud._pupils[pi].position.x)*0.16;
            ud._pupils[pi].position.y+=((basePY+lookY)-ud._pupils[pi].position.y)*0.16;
            if(ud._shines&&ud._shines[pi]){
                var baseShine=ud._shineBasePositions&&ud._shineBasePositions[pi];
                ud._shines[pi].position.x+=(((baseShine?baseShine.x:ps*.195)+lookX*.45)-ud._shines[pi].position.x)*.16;
                ud._shines[pi].position.y+=(((baseShine?baseShine.y:.245)+lookY*.35)-ud._shines[pi].position.y)*.16;
            }
        }
    }
    // Organic blink: short closed frames, random interval per character.
    if(egg._blinkWait===undefined)egg._blinkWait=45+Math.floor(Math.random()*110);
    if(egg._blinkTimer===undefined)egg._blinkTimer=0;
    if(egg._blinkTimer>0)egg._blinkTimer--;
    else{
        egg._blinkWait--;
        if(egg._blinkWait<=0){
            egg._blinkTimer=8;
            egg._blinkWait=110+Math.floor(Math.random()*190);
        }
    }
    var inPain=egg._hitStun>0||egg._stunTimer>0||egg.throwTimer>0||egg._electrocuted>0||egg._elecFlying>0;
    if(ud._blinkLids){
        var closed=0;
        if(!inPain&&egg._blinkTimer>0){
            var bt=egg._blinkTimer;
            closed=bt>4?(8-bt)/4:bt/4;
            closed=Math.max(0,Math.min(1,closed));
        }
        for(var li=0;li<ud._blinkLids.length;li++){
            var lid=ud._blinkLids[li];
            lid.visible=closed>0.04;
            lid.scale.set(0.95,0.10+closed*0.98,1);
        }
    }
    if(ud._premiumBadge){
        ud._premiumBadge.rotation.z+=0.012;
    }
}

function _animateCuteCharacterDetails(model,now){
    if(!model||!model.userData)return;
    var ud=model.userData;
    if(ud._flowerDetails){
        for(var fdi=0;fdi<ud._flowerDetails.length;fdi++){
            var flower=ud._flowerDetails[fdi],flowerPhase=flower.userData._phase||0;
            flower.rotation.z=(flower.userData._restZ||0)+Math.sin(now*0.9+flowerPhase)*0.035;
            var flowerPulse=0.985+Math.sin(now*1.25+flowerPhase)*0.018;
            flower.scale.setScalar(flowerPulse);
        }
    }
    if(ud._cloudwingDetails){
        for(var cwi=0;cwi<ud._cloudwingDetails.length;cwi++){
            var cloudDetail=ud._cloudwingDetails[cwi],cloudPhase=cloudDetail.userData._phase||0;
            cloudDetail.rotation.z=(cloudDetail.userData._restZ||0)+Math.sin(now*0.72+cloudPhase)*0.025;
            cloudDetail.position.y=(cloudDetail.userData._restY||0)+Math.sin(now*0.86+cloudPhase)*0.012;
        }
    }
    if(ud._forestLeaves){
        for(var hli=0;hli<ud._forestLeaves.length;hli++){
            var herbLeaf=ud._forestLeaves[hli];
            if(herbLeaf.userData._restZ===undefined)herbLeaf.userData._restZ=herbLeaf.rotation.z;
            herbLeaf.rotation.z=herbLeaf.userData._restZ+Math.sin(now*.78+hli*.74)*.045;
        }
    }
    var saltCrystalSparkles=ud._saltCrystalSparkles||ud._crystalSparkles;
    if(saltCrystalSparkles){
        for(var si=0;si<saltCrystalSparkles.length;si++){
            var sparkle=saltCrystalSparkles[si];
            var pulse=0.72+Math.sin(now*2.25+si*1.71)*0.28;
            var crystalPulse=(sparkle.userData._baseScale||1)*(0.82+pulse*0.24);
            if(sparkle.userData._baseScaleVec)sparkle.scale.copy(sparkle.userData._baseScaleVec).multiplyScalar(crystalPulse);
            else sparkle.scale.setScalar(crystalPulse);
            sparkle.material.opacity=0.34+pulse*0.34;
            sparkle.rotation.z=now*0.22*(si%2?1:-1)+si*0.48;
        }
    }
    if(ud._fruitbrewDetails){
        for(var fbi=0;fbi<ud._fruitbrewDetails.length;fbi++){
            var fruitDetail=ud._fruitbrewDetails[fbi],fruitPhase=fruitDetail.userData._phase||0;
            fruitDetail.rotation.z=(fruitDetail.userData._restZ||0)+Math.sin(now*0.92+fruitPhase)*0.035;
        }
    }
    var spiceIdleDetails=ud._spiceDetails||ud._rockDetails;
    if(spiceIdleDetails){
        for(var spi=0;spi<spiceIdleDetails.length;spi++){
            var spiceDetail=spiceIdleDetails[spi];
            if(spiceDetail.userData._restZ===undefined)spiceDetail.userData._restZ=spiceDetail.rotation.z;
            if(spiceDetail.userData._restY===undefined)spiceDetail.userData._restY=spiceDetail.position.y;
            spiceDetail.rotation.z=spiceDetail.userData._restZ+Math.sin(now*1.35+spi*.8)*.025;
            spiceDetail.position.y=spiceDetail.userData._restY+Math.max(0,Math.sin(now*1.8+spi))*.010;
        }
    }
    if(ud._berryDetails){
        for(var bdi=0;bdi<ud._berryDetails.length;bdi++){
            var berry=ud._berryDetails[bdi],berryPhase=berry.userData._phase||0;
            var berryPulse=0.96+Math.sin(now*1.35+berryPhase)*0.035;
            berry.scale.copy(berry.userData._baseScaleVec||new THREE.Vector3(1,1,1)).multiplyScalar(berryPulse);
            berry.rotation.z=(berry.userData._restZ||0)+Math.sin(now*0.72+berryPhase)*0.035;
        }
    }
    if(ud._goldenGrainDetails){
        for(var gdi=0;gdi<ud._goldenGrainDetails.length;gdi++){
            var grain=ud._goldenGrainDetails[gdi],grainPhase=grain.userData._phase||0;
            grain.rotation.z=(grain.userData._restZ||0)+Math.sin(now*0.68+grainPhase)*0.030;
        }
    }
    if(ud._travelGear){
        for(var tgi=0;tgi<ud._travelGear.length;tgi++){
            var gear=ud._travelGear[tgi],gearPhase=gear.userData._phase||0;
            gear.rotation.z=(gear.userData._restZ||0)+Math.sin(now*.72+gearPhase)*.018;
        }
    }
    if(ud._regionalMarks&&ud._charType==='bear'){
        for(var rmi=0;rmi<ud._regionalMarks.length;rmi++){
            var regionMat=ud._regionalMarks[rmi].material;
            if(regionMat&&regionMat.emissiveIntensity!==undefined)regionMat.emissiveIntensity=.07+Math.max(0,Math.sin(now*1.65+rmi*.55))*.055;
        }
    }
}

function _createCuteRoundCharacterMesh(color,accent,charType){
    var g=new THREE.Group(),type=charType||'egg';
    accent=(accent===undefined||accent===null)?0xFF6F7D:accent;
    var high=window.DANBO_VISUAL_QUALITY&&DANBO_VISUAL_QUALITY.high;
    var fallbackProfile={bodyX:1,bodyY:1,bodyZ:1,topTaper:.06,lowerFullness:.04,face:'gentle',material:'matte'};
    var profile=(typeof DANBO_TRAVELER_VISUAL_PROFILES!=='undefined'&&DANBO_TRAVELER_VISUAL_PROFILES[type])||fallbackProfile;
    var bodyGeo=new THREE.SphereGeometry(0.70,high?48:28,high?32:20);
    var bp=bodyGeo.attributes.position;
    for(var bi=0;bi<bp.count;bi++){
        var x=bp.getX(bi),y=bp.getY(bi),z=bp.getZ(bi),ny=y/0.70;
        // All travelers share the same animation-safe topology, but each profile
        // bakes a different regional silhouette into the vertices.  This avoids
        // eight recolours of one perfect egg while keeping collision and moves intact.
        var topBlend=Math.max(0,Math.min(1,(ny-.08)/.92));
        var baseBlend=Math.max(0,Math.min(1,(-ny-.02)/.98));
        var waistBlend=Math.exp(-Math.pow((ny+.12)/.29,2));
        var taper=1.075-(ny+1)*.075;
        var width=taper*(profile.bodyX||1)*(1-topBlend*(profile.topTaper||0)+baseBlend*(profile.lowerFullness||0)-waistBlend*(type==='egg'?.014:0));
        var angle=Math.atan2(z,x),facet=1+(profile.facet||0)*Math.cos((type==='cat'?6:5)*angle);
        var sideAsymmetry=x>=0?1+(profile.asymmetry||0):1-(profile.asymmetry||0)*.62;
        x*=width*facet*sideAsymmetry;
        var chestBlend=Math.exp(-Math.pow((ny-.10)/.36,2));
        var backBlend=Math.exp(-Math.pow((ny+.02)/.48,2));
        z*=(profile.bodyZ||1)*(0.965+(1-ny)*.035)*facet*(z>0?1.025*(1+chestBlend*(type==='egg'?.024:.010)):0.986*(1+backBlend*.018));
        y*=1.16*(profile.bodyY||1);
        if(y<-0.61)y=-0.61+(y+0.61)*0.28;
        bp.setXYZ(bi,x,y,z);
    }
    bodyGeo.computeVertexNormals();
    var bodyOptsByType={
        egg:{pastelAmount:.025,roughness:.72,metalness:0,clearcoat:.035,clearcoatRoughness:.82,envMapIntensity:.24,sheen:.18,sheenRoughness:.86,sheenColor:_charMixHex(color,0xFFFFFF,.25)},
        bull:{pastelAmount:.030,roughness:.86,metalness:0,clearcoat:.018,clearcoatRoughness:.90,envMapIntensity:.17},
        cat:{pastelAmount:.018,roughness:.30,metalness:.01,clearcoat:.48,clearcoatRoughness:.20,envMapIntensity:.58,transparent:true,opacity:.95,flatShading:true},
        rooster:{pastelAmount:.045,roughness:.70,metalness:0,clearcoat:.035,clearcoatRoughness:.78,envMapIntensity:.25,transparent:true,opacity:.97},
        dog:{pastelAmount:.028,roughness:.49,metalness:0,clearcoat:.16,clearcoatRoughness:.38,envMapIntensity:.35},
        monkey:{pastelAmount:.018,roughness:.43,metalness:0,clearcoat:.18,clearcoatRoughness:.34,envMapIntensity:.38},
        bear:{pastelAmount:.010,roughness:.90,metalness:0,clearcoat:.015,clearcoatRoughness:.92,envMapIntensity:.12,flatShading:true,emissive:_charMixHex(color,0x5E160F,.72),emissiveIntensity:.025},
        cockroach:{pastelAmount:.018,roughness:.79,metalness:0,clearcoat:.025,clearcoatRoughness:.85,envMapIntensity:.18}
    };
    var bodyOpts=bodyOptsByType[type]||bodyOptsByType.egg;
    var bodyMat=softPBR(color,bodyOpts);
    var body=new THREE.Mesh(bodyGeo,bodyMat);body.position.y=0.79;body.castShadow=true;body.receiveShadow=true;g.add(body);

    var outline=new THREE.Mesh(bodyGeo.clone(),new THREE.MeshBasicMaterial({color:0x251F38,side:THREE.BackSide,transparent:true,opacity:0.065,depthWrite:false}));
    outline.scale.setScalar(1.025);outline.renderOrder=-2;body.add(outline);g.userData._toonOutline=outline;

    var shellColor=_charMixHex(color,0xDCCFB8,0.42);
    var shellMat=softPBR(shellColor,type==='bear'?
        {pastelAmount:0.01,roughness:0.90,clearcoat:0.02,envMapIntensity:0.12}:
        (type==='egg'?
        {pastelAmount:0.02,roughness:0.72,clearcoat:0.035,clearcoatRoughness:0.78,envMapIntensity:0.24}:
        {pastelAmount:0.02,roughness:0.42,clearcoat:0.22,clearcoatRoughness:0.28,envMapIntensity:0.40}));
    // Keep the torso as one integrated silhouette. The old front plate caused a
    // protruding "chin", while the circular rear plate and torus read as a wheel.

    var gloss=new THREE.Mesh(new THREE.CircleGeometry(0.10,20),new THREE.MeshBasicMaterial({color:0xFFFFFF,transparent:true,opacity:0.10,depthWrite:false,side:THREE.DoubleSide,blending:THREE.NormalBlending,fog:false}));
    gloss.position.set(-0.32,0.39,0.70);gloss.scale.set(0.72,0.28,1);gloss.rotation.z=-0.28;
    if(type==='egg')gloss.material.opacity=0.025;
    body.add(gloss);

    if(type==='egg'){
        // Feather-edged cream wash: it conforms to the torso and does not create
        // the protruding plate/chin silhouette of the retired face mask.
        var faceWashMat=new THREE.ShaderMaterial({
            uniforms:{
                uFaceColor:{value:new THREE.Color(0xFFF0D8)},
                uFaceOpacity:{value:0.24}
            },
            vertexShader:[
                'varying vec3 vFaceLocal;',
                'void main(){',
                '  vFaceLocal=position;',
                '  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);',
                '}'
            ].join('\n'),
            fragmentShader:[
                'uniform vec3 uFaceColor;',
                'uniform float uFaceOpacity;',
                'varying vec3 vFaceLocal;',
                'void main(){',
                '  vec2 faceUv=vec2(vFaceLocal.x/0.52,(vFaceLocal.y-0.015)/0.48);',
                '  float faceEdge=1.0-smoothstep(0.56,1.0,dot(faceUv,faceUv));',
                '  float frontFade=smoothstep(0.34,0.61,vFaceLocal.z);',
                '  float alpha=faceEdge*frontFade*uFaceOpacity;',
                '  if(alpha<0.004)discard;',
                '  gl_FragColor=vec4(uFaceColor,alpha);',
                '}'
            ].join('\n'),
            transparent:true,depthWrite:false,side:THREE.FrontSide,
            polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2
        });
        var faceWash=new THREE.Mesh(bodyGeo.clone(),faceWashMat);
        faceWash.name='danbo-blossom-soft-face-wash';
        faceWash.scale.setScalar(1.002);
        faceWash.renderOrder=1;
        body.add(faceWash);
        g.userData._softFaceWash=faceWash;
    }

    var faceProfiles={
        egg:{spacing:.222,eyeX:.60,eyeY:1.05,eyeLevel:.205,browY:.385,browTilt:.13,smileHalf:.100,smileDip:-.174},
        bull:{spacing:.230,eyeX:.68,eyeY:.91,eyeLevel:.202,browY:.370,browTilt:.06,smileHalf:.118,smileDip:-.184},
        cat:{spacing:.224,eyeX:.70,eyeY:.80,eyeLevel:.218,browY:.356,browTilt:-.02,smileHalf:.088,smileDip:-.154},
        rooster:{spacing:.218,eyeX:.61,eyeY:1.08,eyeLevel:.224,browY:.404,browTilt:.10,smileHalf:.112,smileDip:-.178},
        dog:{spacing:.236,eyeX:.72,eyeY:.98,eyeLevel:.205,browY:.386,browTilt:.08,smileHalf:.126,smileDip:-.194},
        monkey:{spacing:.235,eyeX:.72,eyeY:1.12,eyeLevel:.213,browY:.405,browTilt:.18,smileHalf:.132,smileDip:-.205},
        bear:{spacing:.232,eyeX:.68,eyeY:.86,eyeLevel:.205,browY:.353,browTilt:-.20,smileHalf:.105,smileDip:-.162,asym:.010},
        cockroach:{spacing:.214,eyeX:.59,eyeY:.94,eyeLevel:.218,browY:.374,browTilt:.01,smileHalf:.092,smileDip:-.165}
    },faceProfile=faceProfiles[type]||faceProfiles.egg;
    var faceSurface=.665*(profile.bodyZ||1);
    var eyeG=new THREE.SphereGeometry(0.128,high?24:16,high?18:12);
    var eyeMat=softPBR(0xFFFDF7,{pastelAmount:0,roughness:0.25,clearcoat:0.43,clearcoatRoughness:0.17,envMapIntensity:0.48});
    var irisPalette={egg:0x647FCE,bull:0x4F916A,cat:0x4B9DD6,rooster:0x687BCB,dog:0xA15E92,monkey:0x5C69B7,bear:0x5D708D,cockroach:0x765FA9};
    var irisColor=irisPalette[type]||0x557FC7;
    var irisMat=softPBR(irisColor,{pastelAmount:0,roughness:0.20,clearcoat:0.38,emissive:_charMixHex(irisColor,0x111B36,0.62),emissiveIntensity:0.045});
    var pupilMat=softPBR(0x101522,{pastelAmount:0,roughness:0.16,clearcoat:0.48,envMapIntensity:0.44});
    var shineMat=new THREE.MeshBasicMaterial({color:0xFFFFFF,fog:false});
    var lashMat=softPBR(0x282236,{pastelAmount:0,roughness:0.58});
    var _eyeWhites=[],_pupils=[],_shines=[],_eyeBaseScales=[],_pupilBasePositions=[],_shineBasePositions=[];
    [-1,1].forEach(function(s){
        var eyeY=faceProfile.eyeLevel+(s>0?(faceProfile.asym||0):0);
        var eye=new THREE.Mesh(eyeG,eyeMat);eye.position.set(s*faceProfile.spacing,eyeY,faceSurface);eye.scale.set(faceProfile.eyeX,faceProfile.eyeY,0.27);body.add(eye);_eyeWhites.push(eye);_eyeBaseScales.push(eye.scale.clone());
        var iris=new THREE.Mesh(new THREE.SphereGeometry(0.106,high?22:14,high?16:10),irisMat);iris.position.set(s*faceProfile.spacing,eyeY-.038,faceSurface+.037);iris.scale.set(.77*faceProfile.eyeX/.62,1.10*faceProfile.eyeY/1.06,.22);body.add(iris);_pupils.push(iris);_pupilBasePositions.push(iris.position.clone());
        var pupil=new THREE.Mesh(new THREE.SphereGeometry(0.055,high?16:10,high?12:8),pupilMat);pupil.position.set(0,-0.006,0.096);pupil.scale.set(0.88,1.14,0.26);iris.add(pupil);
        var hi=new THREE.Mesh(new THREE.SphereGeometry(0.034,10,8),shineMat);hi.position.set(s*(faceProfile.spacing-.030),eyeY+.047,faceSurface+.054);hi.scale.z=0.18;body.add(hi);_shines.push(hi);_shineBasePositions.push(hi.position.clone());
        var hi2=new THREE.Mesh(new THREE.SphereGeometry(0.016,8,6),shineMat);hi2.position.set(s*(faceProfile.spacing+.022),eyeY-.022,faceSurface+.056);hi2.scale.z=0.16;body.add(hi2);
        var lashCurve=new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(s*(faceProfile.spacing+.080),eyeY+.100,faceSurface+.035),
            new THREE.Vector3(s*faceProfile.spacing,eyeY+.138,faceSurface+.055),
            new THREE.Vector3(s*(faceProfile.spacing-.080),eyeY+.102,faceSurface+.035)
        );
        body.add(new THREE.Mesh(new THREE.TubeGeometry(lashCurve,10,0.009,6,false),lashMat));
        var browCurve=new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(s*(faceProfile.spacing+.070),faceProfile.browY-s*faceProfile.browTilt*.035,faceSurface+.020),
            new THREE.Vector3(s*faceProfile.spacing,faceProfile.browY+.018,faceSurface+.040),
            new THREE.Vector3(s*(faceProfile.spacing-.070),faceProfile.browY+s*faceProfile.browTilt*.035,faceSurface+.020)
        );
        var brow=new THREE.Mesh(new THREE.TubeGeometry(browCurve,8,0.012,6,false),softPBR(_charMixHex(color,0x241F2B,.72),{pastelAmount:0,roughness:.70}));
        brow.rotation.z=s*faceProfile.browTilt;body.add(brow);
    });
    var smileHalf=faceProfile.smileHalf,smileDip=faceProfile.smileDip;
    var smileCurve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(-smileHalf,-0.13,faceSurface+.053),new THREE.Vector3(0,smileDip,faceSurface+.067),new THREE.Vector3(smileHalf,-0.13,faceSurface+.053));
    var smile=new THREE.Mesh(new THREE.TubeGeometry(smileCurve,14,0.015,8,false),softPBR(0x342333,{pastelAmount:0,roughness:0.62}));body.add(smile);
    // Fruitbrew Traveler's coral shell was nearly the same hue/value as the shared
    // blush. Give only this variant a deeper raspberry cheek so it stays legible
    // in the fixed warm selection light and remains consistent in gameplay.
    var blushColor=type==='dog'?0xE64870:0xFF779F;
    var blushOpacity=type==='dog'?0.58:0.43;
    var blushG=new THREE.CircleGeometry(0.103,24),blushM=toon(blushColor,{transparent:true,opacity:blushOpacity,side:THREE.DoubleSide});
    [-1,1].forEach(function(s){var bl=new THREE.Mesh(blushG,blushM);bl.position.set(s*0.41,-0.055,0.635);bl.scale.set(1.22,0.62,1);bl.rotation.y=s*0.34;body.add(bl);});

    function makeBlossomPetalGlove(size,material,name){
        var glove=new THREE.Group();glove.name=name||'danbo-blossom-petal-glove';
        var palm=new THREE.Mesh(new THREE.SphereGeometry(size*0.72,high?22:14,high?16:10),material);
        palm.scale.set(1.0,0.92,0.70);palm.castShadow=true;glove.add(palm);
        for(var gi=0;gi<4;gi++){
            var ga=Math.PI*0.25+gi*Math.PI*0.5;
            var petalFinger=new THREE.Mesh(new THREE.SphereGeometry(size*0.34,high?18:11,high?12:8),material);
            petalFinger.position.set(Math.cos(ga)*size*0.57,Math.sin(ga)*size*0.57,0.008);
            petalFinger.scale.set(0.82,1.06,0.66);
            petalFinger.rotation.z=ga-Math.PI*0.5;petalFinger.castShadow=true;glove.add(petalFinger);
        }
        return glove;
    }

    function makeRegionalHand(handType,size,baseMaterial){
        if(handType==='egg')return makeBlossomPetalGlove(size,baseMaterial,'danbo-character-hand');
        var glove=new THREE.Group();glove.name='danbo-character-hand';
        var detailMat=softPBR(_charMixHex(accent,0xFFFFFF,.24),{pastelAmount:.015,roughness:handType==='cat'?.30:.70,clearcoat:handType==='cat'?.35:.025,envMapIntensity:handType==='cat'?.46:.18});
        var palm;
        if(handType==='cat'){
            palm=new THREE.Mesh(new THREE.OctahedronGeometry(size*.82,1),detailMat);palm.scale.set(.92,1.05,.66);
        }else if(handType==='bear'){
            palm=new THREE.Mesh(new THREE.DodecahedronGeometry(size*.78,0),softPBR(_charMixHex(accent,0x5B2B28,.45),{roughness:.91,clearcoat:0,flatShading:true}));palm.scale.set(1.05,.92,.72);
        }else{
            palm=new THREE.Mesh(new THREE.SphereGeometry(size*.74,high?20:13,high?14:9),baseMaterial);palm.scale.set(1.06,.90,.68);
        }
        palm.castShadow=true;glove.add(palm);
        if(handType==='bull'||handType==='cockroach'){
            var leaf=new THREE.Mesh(new THREE.SphereGeometry(size*.44,high?16:10,high?10:7),detailMat);
            leaf.position.set(0,size*.30,.01);leaf.scale.set(handType==='bull'?1.12:.78,handType==='bull'?.44:1.16,.50);leaf.rotation.z=handType==='bull'?.48:0;glove.add(leaf);
            var vein=new THREE.Mesh(new THREE.BoxGeometry(.018,size*.58,.018),softPBR(_charMixHex(accent,0x4A5B2C,.50),{roughness:.86}));vein.position.z=size*.45;vein.rotation.z=handType==='bull'?.48:0;glove.add(vein);
        }else if(handType==='rooster'){
            [[-.34,.10,.43],[0,.28,.50],[.34,.08,.41]].forEach(function(cp){var puff=new THREE.Mesh(new THREE.SphereGeometry(size*cp[2],high?16:10,high?10:7),detailMat);puff.position.set(size*cp[0],size*cp[1],.01);puff.scale.z=.62;glove.add(puff);});
        }else if(handType==='dog'){
            var orchardLeaf=new THREE.Mesh(new THREE.SphereGeometry(size*.34,high?16:10,high?10:7),softPBR(0x6B9F55,{roughness:.80}));orchardLeaf.position.set(size*.36,size*.24,.015);orchardLeaf.scale.set(1.15,.40,.52);orchardLeaf.rotation.z=-.55;glove.add(orchardLeaf);
        }else if(handType==='monkey'){
            [-1,1].forEach(function(s){var berryPad=new THREE.Mesh(new THREE.SphereGeometry(size*.30,high?16:10,high?10:7),detailMat);berryPad.position.set(s*size*.30,size*.18,.015);berryPad.scale.z=.65;glove.add(berryPad);});
        }else if(handType==='bear'){
            var ember=new THREE.Mesh(new THREE.BoxGeometry(size*.62,.022,.022),softPBR(0xFFB24F,{roughness:.48,emissive:0x7A1F0B,emissiveIntensity:.10}));ember.position.set(0,-size*.04,size*.58);ember.rotation.z=.46;glove.add(ember);
        }
        return glove;
    }

    var decorArms=[],armMat=softPBR(color,type==='bear'?
        {pastelAmount:0.018,roughness:0.91,clearcoat:0.02,envMapIntensity:0.11}:
        (type==='egg'?
        {pastelAmount:0.025,roughness:0.66,clearcoat:0.055,clearcoatRoughness:0.72,envMapIntensity:0.29}:
        {pastelAmount:0.045,roughness:0.31,clearcoat:0.40,clearcoatRoughness:0.22,envMapIntensity:0.60}));
    [-1,1].forEach(function(s){
        var armRadius=type==='bear'?0.165:0.142;
        var handRadius=type==='bear'?0.215:0.188;
        var armG=new THREE.Group(),arm=new THREE.Mesh(new THREE.SphereGeometry(armRadius,high?22:14,high?14:9),armMat);
        arm.position.y=type==='egg'?-0.115:-0.10;arm.scale.set(0.68,type==='egg'?1.78:1.55,0.60);arm.castShadow=true;armG.add(arm);
        var hand;
        hand=makeRegionalHand(type,handRadius,shellMat);
        hand.position.set(0,type==='egg'?-0.405:-0.36,0.035);
        hand.scale.setScalar(1);armG.add(hand);armG.userData._hand=hand;armG.userData._baseHandRadius=handRadius;
        var armSpread=(type==='bear'||type==='dog'||type==='monkey')?.72:(type==='egg'?.705:(type==='rooster'?.61:.65));
        armG.position.set(s*armSpread,0.00,0.015);armG.rotation.z=s*(type==='rooster'?.43:.48);armG.userData._side=s;armG.userData._restZ=armG.rotation.z;body.add(armG);decorArms.push(armG);
    });
    g.userData._decorArms=decorArms;

    var footColor=_charMixHex(accent,0xFF667A,0.14),ftM=softPBR(footColor,type==='bear'?
        {pastelAmount:0.012,roughness:0.84,clearcoat:0.035,clearcoatRoughness:0.78,envMapIntensity:0.14}:
        (type==='egg'?
        {pastelAmount:0.02,roughness:0.82,clearcoat:0.018,clearcoatRoughness:0.88,envMapIntensity:0.18}:
        {pastelAmount:0.025,roughness:0.26,clearcoat:0.58,clearcoatRoughness:0.16,envMapIntensity:0.72}));
    function makeRegionalFoot(footType,side){
        var shoe=new THREE.Group();shoe.name='danbo-'+footType+'-traveler-shoe';
        var main;
        if(footType==='cat'){
            main=new THREE.Mesh(new THREE.OctahedronGeometry(.25,1),ftM);main.scale.set(1.18,.45,1.34);main.rotation.x=.08;
        }else if(footType==='bear'){
            main=new THREE.Mesh(new THREE.DodecahedronGeometry(.245,0),ftM);main.scale.set(1.34,.48,1.48);main.rotation.y=-side*.08;
        }else{
            var shoeGeo=new THREE.SphereGeometry(.22,high?28:16,high?18:10);shoeGeo.scale(1.42,.54,1.74);
            main=new THREE.Mesh(shoeGeo,ftM);
        }
        main.castShadow=true;main.receiveShadow=true;shoe.add(main);
        if(footType==='bull'){
            var leafToe=new THREE.Mesh(new THREE.SphereGeometry(.13,high?18:11,high?11:7),softPBR(0x568C4E,{roughness:.84}));leafToe.position.set(side*.025,.02,.27);leafToe.scale.set(1.05,.30,1.38);leafToe.rotation.y=-side*.12;shoe.add(leafToe);
        }else if(footType==='rooster'){
            var cloudMat=softPBR(0xF2FAFF,{roughness:.73,transparent:true,opacity:.95});
            [-1,0,1].forEach(function(i){var lobe=new THREE.Mesh(new THREE.SphereGeometry(.095,high?16:10,high?10:7),cloudMat);lobe.position.set(i*.085,.015,.19+Math.abs(i)*.012);lobe.scale.set(1.12,.58,.90);shoe.add(lobe);});
        }else if(footType==='dog'){
            var fruitLeaf=new THREE.Mesh(new THREE.SphereGeometry(.085,high?16:10,high?10:7),softPBR(0x6D9B55,{roughness:.80}));fruitLeaf.position.set(side*.07,.065,.22);fruitLeaf.scale.set(1.28,.34,.62);fruitLeaf.rotation.z=side*.45;shoe.add(fruitLeaf);
        }else if(footType==='monkey'){
            var berryStem=new THREE.Mesh(new THREE.CylinderGeometry(.020,.028,.14,7),softPBR(0x47764D,{roughness:.86}));berryStem.position.set(side*.04,.10,.18);berryStem.rotation.z=-side*.40;shoe.add(berryStem);
        }else if(footType==='bear'){
            var lavaSole=new THREE.Mesh(new THREE.BoxGeometry(.36,.025,.40),softPBR(0xFF9B3D,{roughness:.58,emissive:0x7C210B,emissiveIntensity:.10}));lavaSole.position.set(0,-.10,.03);lavaSole.rotation.y=-side*.05;shoe.add(lavaSole);
        }else if(footType==='cockroach'){
            var husk=new THREE.Mesh(new THREE.SphereGeometry(.12,high?16:10,high?10:7),softPBR(0xF0C75C,{roughness:.66}));husk.position.set(0,.035,.22);husk.scale.set(.52,.70,1.34);shoe.add(husk);
        }else if(footType==='egg'){
            var petalToe=new THREE.Mesh(_starShapeGeometry(.075,.038,5),softPBR(_charMixHex(accent,0xFFFFFF,.36),{roughness:.76,side:THREE.DoubleSide}));petalToe.position.set(side*.035,.065,.285);petalToe.rotation.x=-.18;shoe.add(petalToe);
        }
        return shoe;
    }
    var feet=[];
    [-1,1].forEach(function(s){var ft=makeRegionalFoot(type,s);ft.position.set(s*.29,.105,.15);ft.rotation.y=-s*.08;g.add(ft);feet.push(ft);});

    var cloudwingDetails=[],saltCrystalSparkles=[],saltCrystalEars=[],fruitbrewDetails=[],flowerDetails=[],forestLeaves=[],spiceDetails=[],spiceSurfaceMarks=[],berryDetails=[],goldenGrainDetails=[];
    if(type==='egg'){
        // A soft dimensional blossom replaces the hidden spike crown. Rounded
        // petals keep Blossom Traveler floral, readable and friendly at every distance.
        var flowerGroup=new THREE.Group();flowerGroup.name='danbo-flower-blossom';
        flowerGroup.position.set(-0.27,0.58,0.48);flowerGroup.rotation.z=-0.12;
        flowerGroup.userData._restZ=flowerGroup.rotation.z;flowerGroup.userData._phase=0.55;
        var petalColor=_charMixHex(accent,0xFFF2F6,0.38);
        var petalMat=softPBR(petalColor,{pastelAmount:0.02,roughness:0.74,clearcoat:0.035,clearcoatRoughness:0.82,envMapIntensity:0.23,sheen:0.16,sheenRoughness:0.82,sheenColor:_charMixHex(petalColor,0xFFFFFF,0.24)});
        var flowerCenterMat=softPBR(0xFFD66D,{pastelAmount:0,roughness:0.56,clearcoat:0.07,clearcoatRoughness:0.68,emissive:0x9B5D12,emissiveIntensity:0.028});
        for(var ei=0;ei<5;ei++){
            var pa=ei*Math.PI*2/5-Math.PI/2;
            var petal=new THREE.Mesh(new THREE.SphereGeometry(0.072,high?18:12,high?12:8),petalMat);
            petal.position.set(Math.cos(pa)*0.070,Math.sin(pa)*0.070,-0.012-Math.max(0,-Math.sin(pa))*0.014);
            petal.scale.set(0.60,1.04,0.36);petal.rotation.set(-Math.sin(pa)*0.10,Math.cos(pa)*0.12,pa+Math.PI/2);petal.castShadow=true;flowerGroup.add(petal);
        }
        var flowerCenter=new THREE.Mesh(new THREE.SphereGeometry(0.050,high?18:12,high?12:8),flowerCenterMat);
        flowerCenter.position.z=0.045;flowerCenter.scale.z=0.52;flowerCenter.castShadow=true;flowerGroup.add(flowerCenter);
        body.add(flowerGroup);flowerDetails.push(flowerGroup);
    }else if(type==='dog'){
        // Fruitbrew Traveler: two low orchard sprigs replace the old candy-ear
        // silhouette. Rounded fruit and leaves stay readable without suggesting
        // a rabbit, demon horn, or love-symbol character.
        var fruitBranchMat=softPBR(0x8A6746,{roughness:0.86,clearcoat:0});
        var fruitLeafMat=softPBR(0x5F9D55,{roughness:0.78,clearcoat:0.02,envMapIntensity:0.16});
        var ripeFruitMat=softPBR(0xE85C58,{roughness:0.38,clearcoat:0.20,clearcoatRoughness:0.30});
        [-1,1].forEach(function(s){
            var sprig=new THREE.Group();sprig.name='danbo-fruitbrew-orchard-sprig';
            sprig.position.set(s*0.34,0.62,0.02);sprig.rotation.z=-s*0.58;
            sprig.userData._restZ=sprig.rotation.z;sprig.userData._phase=s<0?0.35:1.45;
            var branch=new THREE.Mesh(new THREE.CylinderGeometry(0.018,0.026,0.40,8),fruitBranchMat);
            branch.position.y=0.15;branch.rotation.z=-s*0.12;branch.castShadow=true;sprig.add(branch);
            [-1,1].forEach(function(ls){
                var leaf=new THREE.Mesh(new THREE.SphereGeometry(0.105,high?18:11,high?12:8),fruitLeafMat);
                leaf.position.set(ls*0.10,0.18+ls*0.045,0.018);leaf.scale.set(1.24,0.43,0.62);
                leaf.rotation.z=ls*0.62;leaf.castShadow=true;sprig.add(leaf);
            });
            var fruit=new THREE.Mesh(new THREE.SphereGeometry(0.105,high?22:14,high?16:10),ripeFruitMat);
            fruit.position.set(s*0.045,-0.02,0.055);fruit.scale.set(1.02,0.94,0.90);fruit.castShadow=true;sprig.add(fruit);
            body.add(sprig);fruitbrewDetails.push(sprig);
        });
    }else if(type==='cat'){
        // Salt Crystal Traveler uses two compact round crystal forms instead of
        // animal ears. The warm pearl-and-rose palette suggests natural halite,
        // not glass or an ice-element character.
        // Both layers stay in body-local space, so the gameplay and selection
        // models remain identical while the silhouette stays soft and original.
        var crystalEarMat=softPBR(_charMixHex(color,0xE9FBFF,0.20),{pastelAmount:0.015,roughness:0.27,metalness:0.01,clearcoat:0.56,clearcoatRoughness:0.17,envMapIntensity:0.62});
        var crystalEarInnerMat=softPBR(_charMixHex(accent,0xFFF5FA,0.40),{pastelAmount:0.01,roughness:0.24,clearcoat:0.50,clearcoatRoughness:0.16,envMapIntensity:0.54});
        [-1,1].forEach(function(s){
            var earRoot=new THREE.Group();
            earRoot.name='danbo-crystal-round-ear';
            earRoot.position.set(s*0.43,0.54,0.005);
            earRoot.rotation.z=-s*0.10;
            var ear=new THREE.Mesh(new THREE.SphereGeometry(0.185,high?26:16,high?18:11),crystalEarMat);
            ear.scale.set(1.00,1.08,0.54);ear.castShadow=true;earRoot.add(ear);
            var inner=new THREE.Mesh(new THREE.SphereGeometry(0.112,high?22:14,high?16:10),crystalEarInnerMat);
            inner.position.set(0,-0.006,0.087);inner.scale.set(0.94,1.02,0.30);inner.castShadow=false;earRoot.add(inner);
            body.add(earRoot);saltCrystalEars.push(earRoot);
        });
        var crystalCrest=new THREE.Mesh(new THREE.OctahedronGeometry(0.062,0),softPBR(0xF6DCE8,{pastelAmount:0,roughness:0.25,metalness:0.01,clearcoat:0.46,clearcoatRoughness:0.18,emissive:0x765064,emissiveIntensity:0.045,transparent:true,opacity:0.88}));
        crystalCrest.name='danbo-salt-crystal-crest';crystalCrest.position.set(0,0.835,0.02);crystalCrest.scale.set(0.82,1.34,0.66);crystalCrest.userData._baseScale=1;crystalCrest.userData._baseScaleVec=crystalCrest.scale.clone();
        body.add(crystalCrest);saltCrystalSparkles.push(crystalCrest);
        var crystalMat=softPBR(0xE7C3D3,{pastelAmount:0,roughness:0.24,metalness:0.01,clearcoat:0.52,clearcoatRoughness:0.16,emissive:0x684654,emissiveIntensity:0.045,transparent:true,opacity:0.82,depthWrite:false});
        [[-0.39,0.33,0.58,0.065],[0.40,0.04,0.57,0.052],[-0.33,-0.20,0.61,0.045],[0.30,0.48,0.53,0.040]].forEach(function(cp,ci){
            var gem=new THREE.Mesh(new THREE.OctahedronGeometry(cp[3],0),crystalMat.clone());
            gem.position.set(cp[0],cp[1],cp[2]);gem.scale.set(0.68,1.34,0.42);gem.rotation.z=ci*0.61;body.add(gem);saltCrystalSparkles.push(gem);
            gem.userData._baseScale=1;gem.userData._baseScaleVec=gem.scale.clone();
        });
        for(var csi=0;csi<(high?4:2);csi++){
            var sparkle=new THREE.Mesh(_starShapeGeometry(0.040,0.010,4),new THREE.MeshBasicMaterial({color:0xFFFFFF,transparent:true,opacity:0.58,depthWrite:false,fog:false,side:THREE.DoubleSide}));
            var sp=[[-0.31,0.43],[0.34,0.28],[-0.29,-0.10],[0.27,-0.24]][csi];
            sparkle.position.set(sp[0],sp[1],0.714);sparkle.userData._baseScale=0.82+csi*0.08;body.add(sparkle);saltCrystalSparkles.push(sparkle);
        }
    }else if(type==='rooster'){
        // Cloudwing Traveler carries a practical cloud cape and navigation ring.
        // They replace the religious halo and feather wings while preserving a
        // light, airy silhouette appropriate to an eggshell traveler.
        var navRingMat=softPBR(0x6FAFD2,{roughness:0.30,metalness:0.08,clearcoat:0.35,emissive:0x2D6682,emissiveIntensity:0.045});
        var navRing=new THREE.Mesh(new THREE.TorusGeometry(0.19,0.022,8,28),navRingMat);
        navRing.name='danbo-cloudwing-navigation-ring';navRing.position.set(0.33,0.49,0.52);navRing.rotation.set(0.18,0.42,0.12);
        navRing.userData._restZ=navRing.rotation.z;navRing.userData._restY=navRing.position.y;navRing.userData._phase=0.4;body.add(navRing);cloudwingDetails.push(navRing);
        var cloudCape=new THREE.Group();cloudCape.name='danbo-cloudwing-cloud-cape';cloudCape.position.set(0,0.06,-0.38);
        cloudCape.userData._restZ=0;cloudCape.userData._restY=cloudCape.position.y;cloudCape.userData._phase=1.1;
        var cloudCapeMat=softPBR(0xF4FBFF,{pastelAmount:0,roughness:0.62,clearcoat:0.04,transparent:true,opacity:0.88,depthWrite:false,envMapIntensity:0.24});
        [[-0.25,0.19,0.24],[0,0.25,0.29],[0.25,0.19,0.24],[-0.13,-0.03,0.20],[0.13,-0.03,0.20]].forEach(function(cp){
            var cloudLobe=new THREE.Mesh(new THREE.SphereGeometry(cp[2],high?20:12,high?14:9),cloudCapeMat);
            cloudLobe.position.set(cp[0],cp[1],0);cloudLobe.scale.set(1.16,0.78,0.34);cloudLobe.castShadow=high;cloudCape.add(cloudLobe);
        });
        body.add(cloudCape);cloudwingDetails.push(cloudCape);
        var dewBottle=new THREE.Group();dewBottle.name='danbo-cloudwing-dew-bottle';dewBottle.position.set(-0.37,0.22,0.55);dewBottle.rotation.z=0.18;
        dewBottle.userData._restZ=dewBottle.rotation.z;dewBottle.userData._restY=dewBottle.position.y;dewBottle.userData._phase=2.0;
        var dewGlass=softPBR(0x9CE4F3,{roughness:0.18,clearcoat:0.55,transparent:true,opacity:0.72,depthWrite:false});
        var bottle=new THREE.Mesh(new THREE.SphereGeometry(0.075,high?18:11,high?12:8),dewGlass);bottle.scale.set(0.78,1.20,0.62);dewBottle.add(bottle);
        var stopper=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.030,0.055,8),navRingMat);stopper.position.y=0.09;dewBottle.add(stopper);
        body.add(dewBottle);cloudwingDetails.push(dewBottle);
    }else if(type==='monkey'){
        // Berry Traveler: a twilight vine, leaves and wild berries replace the
        // old constellation crest. No zodiac lines or divination symbols remain.
        var berryVineMat=softPBR(0x47764D,{roughness:0.84,clearcoat:0.01,envMapIntensity:0.13});
        var berryLeafMat=softPBR(0x6B9B5C,{roughness:0.80,clearcoat:0.02,envMapIntensity:0.15});
        var berryMat=softPBR(0x9F3F7A,{roughness:0.34,clearcoat:0.28,clearcoatRoughness:0.24});
        var berryGroup=new THREE.Group();berryGroup.name='danbo-berry-traveler-vine';berryGroup.position.set(0,0.30,0.55);berryGroup.rotation.z=-0.10;
        berryGroup.userData._restZ=berryGroup.rotation.z;berryGroup.userData._phase=0.6;berryGroup.userData._baseScaleVec=berryGroup.scale.clone();
        var berryCurve=new THREE.CubicBezierCurve3(new THREE.Vector3(-0.42,0.18,0),new THREE.Vector3(-0.12,0.34,0.035),new THREE.Vector3(0.14,-0.05,0.035),new THREE.Vector3(0.40,0.12,0));
        var vine=new THREE.Mesh(new THREE.TubeGeometry(berryCurve,high?24:15,0.018,7,false),berryVineMat);vine.castShadow=true;berryGroup.add(vine);
        [[-0.27,0.22,-0.55],[-0.04,0.17,0.52],[0.22,0.08,-0.48]].forEach(function(lp){
            var leaf=new THREE.Mesh(new THREE.SphereGeometry(0.083,high?16:10,high?10:7),berryLeafMat);
            leaf.position.set(lp[0],lp[1],0.015);leaf.scale.set(1.25,0.42,0.58);leaf.rotation.z=lp[2];leaf.castShadow=true;berryGroup.add(leaf);
        });
        [[-0.18,0.11,0.074],[0.04,0.05,0.068],[0.28,0.13,0.060]].forEach(function(bp){
            var wildBerry=new THREE.Mesh(new THREE.SphereGeometry(bp[2],high?18:11,high?12:8),berryMat);
            wildBerry.position.set(bp[0],bp[1],0.055);wildBerry.scale.set(1.04,0.96,0.86);wildBerry.castShadow=true;berryGroup.add(wildBerry);
        });
        body.add(berryGroup);berryDetails.push(berryGroup);
    }else if(type==='bull'){
        // Herb Traveler: a readable crown of leaves, kept compact enough to be a motif.
        var stemM=softPBR(0x356E3E,{roughness:0.88}),leafM=softPBR(0x5AAE60,{roughness:0.80,clearcoat:0.025,envMapIntensity:0.18}),leafLightM=softPBR(0x82C967,{roughness:0.82,envMapIntensity:0.16});
        var stem=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.037,0.30,8),stemM);stem.position.set(0,0.78,0.015);stem.rotation.z=-0.06;body.add(stem);
        [[-0.13,0.91,-0.52,1.42],[0.13,0.92,0.52,1.42],[0.00,1.00,0.04,1.22]].forEach(function(lp,li){
            var leaf=new THREE.Mesh(new THREE.SphereGeometry(0.13,high?20:12,high?12:8),li===2?leafLightM:leafM);
            leaf.position.set(lp[0],lp[1],0.045);leaf.scale.set(lp[3],0.45,0.72);leaf.rotation.z=lp[2];leaf.castShadow=true;body.add(leaf);forestLeaves.push(leaf);
        });
        var forestBud=new THREE.Mesh(new THREE.SphereGeometry(0.052,high?18:10,high?12:8),softPBR(0xF3A956,{roughness:0.44,clearcoat:0.10}));
        forestBud.position.set(0.055,0.990,0.135);forestBud.scale.set(0.92,1.02,0.76);forestBud.castShadow=true;body.add(forestBud);forestLeaves.push(forestBud);
    }else if(type==='bear'){
        // Spicy Flame Traveler carries a small chili-and-leaf keepsake. The
        // motif is about collecting volcanic spices, not destructive fire powers.
        var chiliGroup=new THREE.Group();chiliGroup.name='danbo-spicy-flame-chili';
        chiliGroup.position.set(0.34,0.35,0.57);chiliGroup.rotation.z=-0.28;
        var chiliMat=softPBR(0xD93B31,{pastelAmount:0.006,roughness:0.42,metalness:0,clearcoat:0.18,clearcoatRoughness:0.28,envMapIntensity:0.30});
        var chiliLightMat=softPBR(0xF56A42,{pastelAmount:0.004,roughness:0.38,metalness:0,clearcoat:0.22,clearcoatRoughness:0.24,envMapIntensity:0.32});
        var spiceLeafMat=softPBR(0x4F8E48,{pastelAmount:0.01,roughness:0.76,metalness:0,clearcoat:0.015,envMapIntensity:0.15});
        var chiliCurve=new THREE.CubicBezierCurve3(
            new THREE.Vector3(-0.02,0.14,0),new THREE.Vector3(0.13,0.08,0.012),
            new THREE.Vector3(0.13,-0.14,0.012),new THREE.Vector3(-0.02,-0.22,0)
        );
        var chiliPod=new THREE.Mesh(new THREE.TubeGeometry(chiliCurve,high?18:12,0.055,high?10:7,false),chiliMat);
        chiliPod.castShadow=true;chiliGroup.add(chiliPod);
        var chiliTip=new THREE.Mesh(new THREE.SphereGeometry(0.052,high?18:12,high?12:8),chiliLightMat);
        chiliTip.position.set(-0.02,-0.22,0);chiliTip.scale.set(0.65,1.18,0.72);chiliTip.rotation.z=0.36;chiliTip.castShadow=true;chiliGroup.add(chiliTip);
        var chiliStem=new THREE.Mesh(new THREE.CylinderGeometry(0.018,0.026,0.12,8),spiceLeafMat);
        chiliStem.position.set(-0.055,0.19,0);chiliStem.rotation.z=-0.46;chiliStem.castShadow=true;chiliGroup.add(chiliStem);
        [-1,1].forEach(function(s){
            var spiceLeaf=new THREE.Mesh(new THREE.SphereGeometry(0.064,high?16:10,high?10:7),spiceLeafMat);
            spiceLeaf.position.set(-0.055+s*0.045,0.175,0);spiceLeaf.scale.set(1.05,0.38,0.46);spiceLeaf.rotation.z=s*0.72;spiceLeaf.castShadow=true;chiliGroup.add(spiceLeaf);
        });
        body.add(chiliGroup);spiceDetails.push(chiliGroup);
        // A few matte volcanic-spice beads keep the silhouette lively without
        // restoring the former rock chunks or face cracks.
        var spiceBeadMat=softPBR(0x6F3A32,{pastelAmount:0.006,roughness:0.90,metalness:0,clearcoat:0,envMapIntensity:0.08});
        [[-0.38,0.50,0.53,0.042],[-0.44,0.40,0.50,0.030],[0.46,-0.10,0.48,0.034]].forEach(function(bp,bi){
            var bead=new THREE.Mesh(new THREE.SphereGeometry(bp[3],high?14:9,high?10:7),spiceBeadMat);
            bead.position.set(bp[0],bp[1],bp[2]);bead.scale.set(1.15,0.78,0.66);bead.rotation.z=bi*0.52;
            bead.castShadow=true;body.add(bead);spiceSurfaceMarks.push(bead);
        });
    }else if(type==='cockroach'){
        // Golden Grain Traveler: a compact wheat sprig and seed pouch replace
        // the old wind crest, grounding the identity in fields and rural travel.
        var grainStemMat=softPBR(0xA87A35,{roughness:0.84,clearcoat:0.01,envMapIntensity:0.12});
        var grainMat=softPBR(0xF0C75C,{roughness:0.52,clearcoat:0.08,clearcoatRoughness:0.42});
        var grainLeafMat=softPBR(0x8FA758,{roughness:0.82,clearcoat:0.01,envMapIntensity:0.13});
        var grainGroup=new THREE.Group();grainGroup.name='danbo-golden-grain-sprig';grainGroup.position.set(0.30,0.34,0.53);grainGroup.rotation.z=-0.30;
        grainGroup.userData._restZ=grainGroup.rotation.z;grainGroup.userData._phase=0.8;
        var grainStem=new THREE.Mesh(new THREE.CylinderGeometry(0.014,0.022,0.58,8),grainStemMat);grainStem.position.y=0.18;grainStem.castShadow=true;grainGroup.add(grainStem);
        for(var kernelIndex=0;kernelIndex<6;kernelIndex++){
            var kernelSide=kernelIndex%2?-1:1,kernelY=0.20+Math.floor(kernelIndex/2)*0.095;
            var kernel=new THREE.Mesh(new THREE.SphereGeometry(0.052,high?16:10,high?10:7),grainMat);
            kernel.position.set(kernelSide*0.052,kernelY,0.015);kernel.scale.set(0.60,1.10,0.52);kernel.rotation.z=-kernelSide*0.48;kernel.castShadow=true;grainGroup.add(kernel);
        }
        [-1,1].forEach(function(s){
            var grainLeaf=new THREE.Mesh(new THREE.SphereGeometry(0.095,high?16:10,high?10:7),grainLeafMat);
            grainLeaf.position.set(s*0.075,0.02+s*0.025,0);grainLeaf.scale.set(1.42,0.34,0.52);grainLeaf.rotation.z=s*0.72;grainLeaf.castShadow=true;grainGroup.add(grainLeaf);
        });
        body.add(grainGroup);goldenGrainDetails.push(grainGroup);
        var seedPouch=new THREE.Mesh(new THREE.SphereGeometry(0.105,high?18:11,high?12:8),softPBR(0x9B6D43,{roughness:0.90,clearcoat:0}));
        seedPouch.name='danbo-golden-grain-seed-pouch';seedPouch.position.set(-0.36,-0.18,0.55);seedPouch.scale.set(0.92,1.12,0.58);
        seedPouch.userData._restZ=0.08;seedPouch.userData._phase=1.7;seedPouch.rotation.z=seedPouch.userData._restZ;body.add(seedPouch);goldenGrainDetails.push(seedPouch);
    }

    // Quiet regional markings: readable close up, deliberately sparse at game
    // distance.  All sit on the body surface and therefore move with the rig.
    var regionalMarks=[],travelGear=[];
    function addRegionalLine(points,material,radius){
        var curve=new THREE.CatmullRomCurve3(points.map(function(p){return new THREE.Vector3(p[0],p[1],faceSurface+.045+(p[2]||0));}));
        var mark=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(5,points.length*4),radius||.010,5,false),material);
        body.add(mark);regionalMarks.push(mark);return mark;
    }
    var markMat=softPBR(_charMixHex(accent,0xFFFFFF,.16),{pastelAmount:0,roughness:type==='cat'?.30:.74,clearcoat:type==='cat'?.25:.015,emissive:type==='bear'?0x79200F:0x000000,emissiveIntensity:type==='bear'?.10:0});
    if(type==='egg'){
        [-.22,0,.22].forEach(function(x,mi){var petalMark=new THREE.Mesh(_starShapeGeometry(.052,.025,5),markMat);petalMark.position.set(x,-.38+Math.abs(mi-1)*.035,faceSurface+.048);petalMark.scale.set(1,1.22,1);petalMark.rotation.z=(mi-1)*.24;body.add(petalMark);regionalMarks.push(petalMark);});
    }else if(type==='bull'){
        addRegionalLine([[0,-.48],[0,-.34],[.01,-.20]],markMat,.009);
        [[-.20,-.43,0,-.34],[.20,-.35,0,-.26],[-.17,-.28,0,-.21]].forEach(function(v){addRegionalLine([[0,v[1]],[v[0],v[3]]],markMat,.008);});
    }else if(type==='cat'){
        addRegionalLine([[-.32,-.47],[-.15,-.35],[-.01,-.46],[.18,-.32],[.34,-.44]],markMat,.010);
        addRegionalLine([[-.18,-.30],[-.04,-.21],[.10,-.29]],markMat,.008);
    }else if(type==='rooster'){
        [-1,1].forEach(function(s){var cloudCurl=new THREE.Mesh(new THREE.TorusGeometry(.09,.009,6,18,Math.PI*1.45),markMat);cloudCurl.position.set(s*.17,-.41,faceSurface+.042);cloudCurl.rotation.z=s<0?.55:2.15;body.add(cloudCurl);regionalMarks.push(cloudCurl);});
    }else if(type==='dog'){
        var fruitMark=new THREE.Mesh(new THREE.SphereGeometry(.065,high?16:10,high?10:7),markMat);fruitMark.position.set(.12,-.31,faceSurface+.035);fruitMark.scale.set(1,.92,.20);body.add(fruitMark);regionalMarks.push(fruitMark);
        var fruitMarkLeaf=new THREE.Mesh(new THREE.SphereGeometry(.055,high?14:9,high?9:6),softPBR(0x5B8E4D,{roughness:.82}));fruitMarkLeaf.position.set(.18,-.25,faceSurface+.050);fruitMarkLeaf.scale.set(1.18,.38,.20);fruitMarkLeaf.rotation.z=-.55;body.add(fruitMarkLeaf);regionalMarks.push(fruitMarkLeaf);
    }else if(type==='monkey'){
        [-.10,.04,.18].forEach(function(x,mi){var berryMark=new THREE.Mesh(new THREE.SphereGeometry(.046,high?14:9,high?9:6),markMat);berryMark.position.set(x,-.34+Math.abs(mi-1)*.04,faceSurface+.047);berryMark.scale.z=.25;body.add(berryMark);regionalMarks.push(berryMark);});
    }else if(type==='bear'){
        addRegionalLine([[-.40,-.40],[-.29,-.31],[-.35,-.20],[-.25,-.11]],markMat,.012);
        addRegionalLine([[.16,-.47],[.29,-.38],[.22,-.27],[.36,-.16]],markMat,.010);
    }else if(type==='cockroach'){
        addRegionalLine([[0,-.48],[0,-.18]],markMat,.009);
        for(var wi=0;wi<3;wi++){
            var wy=-.44+wi*.10;addRegionalLine([[0,wy],[-.16,wy+.07]],markMat,.008);addRegionalLine([[0,wy+.025],[.16,wy+.095]],markMat,.008);
        }
    }

    function addTravelerPouch(name,x,y,pouchColor,shape){
        var gear=new THREE.Group();gear.name=name;gear.position.set(x,y,faceSurface-.01);gear.userData._restZ=x<0?.08:-.08;gear.userData._phase=travelGear.length*.73+.4;gear.rotation.z=gear.userData._restZ;
        var pouchMat=softPBR(pouchColor,{roughness:.88,clearcoat:0,envMapIntensity:.13});
        var pouch=shape==='box'?new THREE.Mesh(new THREE.BoxGeometry(.19,.18,.075),pouchMat):new THREE.Mesh(new THREE.SphereGeometry(.12,high?16:10,high?10:7),pouchMat);
        pouch.scale.set(shape==='box'?1:1.05,shape==='box'?1:.92,.62);gear.add(pouch);
        var flap=new THREE.Mesh(new THREE.BoxGeometry(.15,.045,.028),softPBR(_charMixHex(pouchColor,0xFFFFFF,.22),{roughness:.82}));flap.position.set(0,.045,.060);gear.add(flap);
        body.add(gear);travelGear.push(gear);return gear;
    }
    if(type==='egg'){
        var mapRoll=new THREE.Group();mapRoll.name='danbo-blossom-map-roll';mapRoll.position.set(.38,-.24,faceSurface-.02);mapRoll.rotation.z=-.24;mapRoll.userData._restZ=mapRoll.rotation.z;mapRoll.userData._phase=.9;
        var roll=new THREE.Mesh(new THREE.CylinderGeometry(.052,.052,.25,10),softPBR(0xF5E0B8,{roughness:.86}));roll.rotation.z=Math.PI/2;mapRoll.add(roll);
        [-1,1].forEach(function(s){var tie=new THREE.Mesh(new THREE.TorusGeometry(.052,.009,5,12),softPBR(accent,{roughness:.70}));tie.position.x=s*.07;tie.rotation.y=Math.PI/2;mapRoll.add(tie);});body.add(mapRoll);travelGear.push(mapRoll);
    }else if(type==='bull')addTravelerPouch('danbo-herb-sample-pouch',-.39,-.25,0x7A6847,'round');
    else if(type==='cat'){
        var compass=new THREE.Group();compass.name='danbo-salt-crystal-compass';compass.position.set(-.31,-.25,faceSurface+.015);compass.userData._restZ=.05;compass.userData._phase=1.2;
        var compassCase=new THREE.Mesh(new THREE.CylinderGeometry(.085,.085,.028,20),softPBR(0xB98B70,{roughness:.42,metalness:.16}));compassCase.rotation.x=Math.PI/2;compass.add(compassCase);
        var needle=new THREE.Mesh(new THREE.ConeGeometry(.018,.10,4),softPBR(accent,{roughness:.40}));needle.position.z=.025;compass.add(needle);body.add(compass);travelGear.push(compass);
    }else if(type==='dog')addTravelerPouch('danbo-fruitbrew-field-pouch',-.41,-.23,0x9C6750,'round');
    else if(type==='monkey')addTravelerPouch('danbo-berry-gathering-pouch',.42,-.24,0x6B4B70,'box');
    else if(type==='bear')addTravelerPouch('danbo-spicy-flame-spice-pouch',-.42,-.23,0x633B35,'round');

    var lidMat=softPBR(_charMixHex(color,0xFFE9F4,0.30),{roughness:0.42}),blinkLids=[];
    [-1,1].forEach(function(s){var lid=new THREE.Mesh(new THREE.CircleGeometry(0.145,24),lidMat);lid.position.set(s*faceProfile.spacing,faceProfile.eyeLevel+(s>0?(faceProfile.asym||0):0),faceSurface+.058);lid.scale.set(faceProfile.eyeX/.62,.08,1);lid.visible=false;body.add(lid);blinkLids.push(lid);});g.userData._blinkLids=blinkLids;

    var fistMat=softPBR(0xFFFFFF,type==='egg'?{roughness:0.72,clearcoat:0.03,envMapIntensity:0.22}:{roughness:0.35});
    var rightArm=makeRegionalHand(type,.235,fistMat),leftArm=makeRegionalHand(type,.235,fistMat);
    rightArm.name='danbo-combat-hand-right';leftArm.name='danbo-combat-hand-left';
    rightArm.position.set(0.4,0.2,0.7);leftArm.position.set(-0.4,0.2,0.7);rightArm.visible=leftArm.visible=false;body.add(rightArm);body.add(leftArm);
    var legMat=softPBR(accent,type==='egg'?{roughness:0.68,clearcoat:0.04,envMapIntensity:0.25}:{roughness:0.38});
    var legLength={egg:.828,bull:.76,cat:.72,rooster:.82,dog:.70,monkey:.66,bear:.78,cockroach:.80}[type]||.72;
    var rightLeg=new THREE.Mesh(new THREE.CylinderGeometry(0.10,0.14,legLength,10),legMat),leftLeg=new THREE.Mesh(new THREE.CylinderGeometry(0.10,0.14,legLength,10),legMat);
    rightLeg.position.set(0.24,0.12,0.52);leftLeg.position.set(-0.24,0.12,0.52);rightLeg.rotation.x=leftLeg.rotation.x=-Math.PI/3;rightLeg.visible=leftLeg.visible=false;g.add(rightLeg);g.add(leftLeg);

    g.userData.body=body;g.userData.feet=feet;g.userData._charType=charType;
    g.userData._cloudwingDetails=cloudwingDetails;g.userData._saltCrystalSparkles=saltCrystalSparkles;g.userData._saltCrystalEars=saltCrystalEars;
    g.userData._spiceDetails=spiceDetails;g.userData._spiceSurfaceMarks=spiceSurfaceMarks;
    // Legacy aliases keep older selection gestures and external extensions working.
    g.userData._crystalSparkles=saltCrystalSparkles;g.userData._crystalEars=saltCrystalEars;
    g.userData._rockDetails=spiceDetails;g.userData._rockSurfaceMarks=spiceSurfaceMarks;
    g.userData._fruitbrewDetails=fruitbrewDetails;g.userData._flowerDetails=flowerDetails;g.userData._forestLeaves=forestLeaves;g.userData._berryDetails=berryDetails;g.userData._goldenGrainDetails=goldenGrainDetails;
    g.userData._regionalMarks=regionalMarks;g.userData._travelGear=travelGear;
    g.userData._eyeWhites=_eyeWhites;g.userData._pupils=_pupils;g.userData._shines=_shines;g.userData._eyeBaseScales=_eyeBaseScales;g.userData._pupilBasePositions=_pupilBasePositions;g.userData._shineBasePositions=_shineBasePositions;g.userData._smile=smile;g.userData._eyeY=faceProfile.eyeLevel;
    g.userData._travelerProfile=profile;g.userData._bodyBaseY=body.position.y;
    g.userData.rightArm=rightArm;g.userData.leftArm=leftArm;g.userData.rightLeg=rightLeg;g.userData.leftLeg=leftLeg;
    return g;
}

function createEggMesh(color, accent, charType) {
    // Always use the clean mascot mesh. The older detailed mesh below is kept as
    // a fallback reference only, but we no longer enter it so cached style flags
    // cannot bring back the cluttered/human-looking characters.
    return _createCuteRoundCharacterMesh(color,accent,charType);
    var g = new THREE.Group();
    var bodyGeo = new THREE.SphereGeometry(0.6,20,14);
    var pos = bodyGeo.attributes.position;
    // Species-specific body deformation
    if (charType==='dog') {
        // Ken — normal build (same as Ryu)
        for(var i=0;i<pos.count;i++){
            var y=pos.getY(i); var t=(y+0.6)/1.2;
            var s=0.9+0.25*Math.sin(t*Math.PI)-0.08*t;
            pos.setX(i,pos.getX(i)*s); pos.setZ(i,pos.getZ(i)*s); pos.setY(i,y*1.05);
        }
    } else if (charType==='monkey') {
        // Chun-Li — slim feminine build, narrower waist, taller
        for(var i=0;i<pos.count;i++){
            var y=pos.getY(i); var t=(y+0.6)/1.2;
            var s=0.7+0.2*Math.sin(t*Math.PI)-0.1*t;
            pos.setX(i,pos.getX(i)*s); pos.setZ(i,pos.getZ(i)*s); pos.setY(i,y*1.15);
        }
    } else if (charType==='rooster') {
        // Guile — normal build (same as Ryu)
        for(var i=0;i<pos.count;i++){
            var y=pos.getY(i); var t=(y+0.6)/1.2;
            var s=0.9+0.25*Math.sin(t*Math.PI)-0.08*t;
            pos.setX(i,pos.getX(i)*s); pos.setZ(i,pos.getZ(i)*s); pos.setY(i,y*1.05);
        }
    } else if (charType==='cockroach') {
        // Dhalsim — very thin and tall
        for(var i=0;i<pos.count;i++){
            var y=pos.getY(i); var t=(y+0.6)/1.2;
            var s=0.45+0.1*Math.sin(t*Math.PI);
            pos.setX(i,pos.getX(i)*s); pos.setZ(i,pos.getZ(i)*s); pos.setY(i,y*1.2);
        }
    } else if (charType==='cat') {
        // Blanka — round ball shape
        for(var i=0;i<pos.count;i++){
            var y=pos.getY(i); var t=(y+0.6)/1.2;
            var s=1.1+0.2*Math.sin(t*Math.PI);
            pos.setX(i,pos.getX(i)*s); pos.setZ(i,pos.getZ(i)*s); pos.setY(i,y*0.9);
        }
    } else if (charType==='bull') {
        // Honda/Buffalo — round ball shape
        for(var i=0;i<pos.count;i++){
            var y=pos.getY(i); var t=(y+0.6)/1.2;
            var s=1.1+0.2*Math.sin(t*Math.PI);
            pos.setX(i,pos.getX(i)*s); pos.setZ(i,pos.getZ(i)*s); pos.setY(i,y*0.9);
        }
    } else if (charType==='bear') {
        // Zangief/Bear — 1.5x bigger than normal, muscular
        for(var i=0;i<pos.count;i++){
            var y=pos.getY(i); var t=(y+0.6)/1.2;
            var s=(0.9+0.25*Math.sin(t*Math.PI)-0.08*t)*1.5;
            pos.setX(i,pos.getX(i)*s); pos.setZ(i,pos.getZ(i)*s); pos.setY(i,y*1.05);
        }
    } else {
        for(var i=0;i<pos.count;i++){
            var y=pos.getY(i); var t=(y+0.6)/1.2;
            var s=0.9+0.25*Math.sin(t*Math.PI)-0.08*t;
            pos.setX(i,pos.getX(i)*s); pos.setZ(i,pos.getZ(i)*s); pos.setY(i,y*1.1);
        }
    }
    bodyGeo.computeVertexNormals();
    var body=new THREE.Mesh(bodyGeo,toon(color));
    body.position.y=0.7; body.receiveShadow=true; g.add(body);

    // Cracked eggshell — ONLY for egg character
    if (charType==='egg') {
        var shellMat=toon(0xFFFFF0);
        for(var si=0;si<5;si++){
            var sa=si/5*Math.PI*2+0.3;
            var sh=0.08+Math.random()*0.12;
            var sw=0.15+Math.random()*0.08;
            var shard=new THREE.Mesh(new THREE.BoxGeometry(sw,sh,0.03),shellMat);
            shard.position.set(Math.cos(sa)*0.28,1.15+sh*0.5,Math.sin(sa)*0.28);
            shard.rotation.z=Math.cos(sa)*0.3;
            shard.rotation.x=-Math.sin(sa)*0.3;
            shard.rotation.y=sa;
            body.add(shard);
        }
        var rimGeo=new THREE.TorusGeometry(0.3,0.03,6,16);
        var rim=new THREE.Mesh(rimGeo,shellMat);
        rim.position.y=1.12;rim.rotation.x=Math.PI/2;
        body.add(rim);
        // Ryu headband — red band around top of head with trailing ends
        var hbMat=toon(0xCC2222);
        var hbGeo=new THREE.TorusGeometry(0.32,0.035,6,20);
        var headband=new THREE.Mesh(hbGeo,hbMat);
        headband.position.y=1.05;headband.rotation.x=Math.PI/2;
        body.add(headband);
        // Trailing ends at back
        [-1,1].forEach(function(s){
            var trail=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.22,0.025),hbMat);
            trail.position.set(s*0.12,0.92,-0.32);
            trail.rotation.z=s*0.25;trail.rotation.x=0.3;
            body.add(trail);
        });
    }

    // Big cute eyes
    var eyeWhiteG=new THREE.SphereGeometry(0.17,12,10);
    var pupilG=new THREE.SphereGeometry(0.1,10,8);
    var shineG=new THREE.SphereGeometry(0.04,6,4);
    var eyeY=0.88;
    var _eyeWhites=[],_pupils=[],_shines=[];
    [-1,1].forEach(function(s){
        var ew=new THREE.Mesh(eyeWhiteG,toon(0xffffff));
        ew.position.set(s*0.24, eyeY, 0.46); ew.scale.set(1,1.2,0.7);
        body.add(ew);_eyeWhites.push(ew);
        var ep=new THREE.Mesh(pupilG,toon(0x222222));
        ep.position.set(s*0.24, eyeY-0.02, 0.53);
        body.add(ep);_pupils.push(ep);
        var es=new THREE.Mesh(shineG,toon(0xffffff));
        es.position.set(s*0.24+s*0.04, eyeY+0.04, 0.56);
        body.add(es);_shines.push(es);
    });

    // Smile
    var smileCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-0.12, 0.62, 0.52),
        new THREE.Vector3(0, 0.56, 0.55),
        new THREE.Vector3(0.12, 0.62, 0.52)
    );
    var smileGeo = new THREE.TubeGeometry(smileCurve, 10, 0.025, 6, false);
    var _smileMesh=new THREE.Mesh(smileGeo, toon(0x333333));
    body.add(_smileMesh);

    // Blush cheeks
    var blG=new THREE.CircleGeometry(0.1,12);
    var blM=toon(0xff7777,{transparent:true,opacity:0.45,side:THREE.DoubleSide});
    [-1,1].forEach(function(s){
        var bl=new THREE.Mesh(blG,blM);
        bl.position.set(s*0.38, 0.72, 0.42); bl.rotation.y=s*0.5;
        body.add(bl);
    });

    // Small arms (Q-style stubs)
    var armMat=toon(color);
    [-1,1].forEach(function(s){
        var arm=new THREE.Mesh(new THREE.SphereGeometry(0.1,6,4),armMat);
        arm.position.set(s*0.52,0.65,0);
        arm.scale.set(0.8,1.2,0.8);
        body.add(arm);
    });

    // Character-specific features
    if (charType==='dog') {
        var earG=new THREE.SphereGeometry(0.18,8,6); earG.scale(1,1.8,0.6);
        [-1,1].forEach(function(s){
            var ear=new THREE.Mesh(earG,toon(0xA0704A));
            ear.position.set(s*0.42,1.05,0.1); ear.rotation.z=s*0.6;
            body.add(ear);
        });
        var nose=new THREE.Mesh(new THREE.SphereGeometry(0.1,6,4),toon(0x333333));
        nose.position.set(0,0.72,0.55); body.add(nose);
        // Short tail
        var dtail=new THREE.Mesh(new THREE.SphereGeometry(0.1,6,4),toon(0xA0704A));
        dtail.position.set(0,0.75,-0.55); dtail.scale.set(0.8,1.2,0.8);
        body.add(dtail);
        // Ken blonde hair tuft — spiky yellow on top
        var kenHairMat=toon(0xFFDD44);
        for(var khi=0;khi<6;khi++){
            var kha=khi/6*Math.PI*2;
            var spike=new THREE.Mesh(new THREE.ConeGeometry(0.05,0.2,4),kenHairMat);
            spike.position.set(Math.cos(kha)*0.12,1.2+Math.random()*0.08,Math.sin(kha)*0.1);
            spike.rotation.z=Math.cos(kha)*0.4;spike.rotation.x=-Math.sin(kha)*0.3;
            body.add(spike);
        }
        // Center tall spike
        var centerSpike=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.25,4),kenHairMat);
        centerSpike.position.set(0,1.3,0);
        body.add(centerSpike);
        // Protruding muzzle/snout
        var dogSnout=new THREE.Mesh(new THREE.SphereGeometry(0.15,8,6),toon(0xC08060));
        dogSnout.position.set(0,0.68,0.55);dogSnout.scale.set(1.0,0.7,0.7);
        body.add(dogSnout);
        // Small tongue hanging out
        var tongue=new THREE.Mesh(new THREE.SphereGeometry(0.05,6,4),toon(0xFF6688));
        tongue.position.set(0.04,0.58,0.6);tongue.scale.set(0.8,1.5,0.5);
        body.add(tongue);
        // Paw-print toes on feet
        [-1,1].forEach(function(s){
            for(var pi=0;pi<3;pi++){
                var paw=new THREE.Mesh(new THREE.SphereGeometry(0.03,4,4),toon(0x555555));
                paw.position.set(s*0.2+(pi-1)*0.05,-0.58,0.14);
                body.add(paw);
            }
            // Central pad
            var pad=new THREE.Mesh(new THREE.SphereGeometry(0.04,4,4),toon(0x555555));
            pad.position.set(s*0.2,-0.56,0.08);
            body.add(pad);
        });
    } else if (charType==='cat') {
        // Blanka — wild beast traits
        var cearG=new THREE.ConeGeometry(0.14,0.35,4);
        [-1,1].forEach(function(s){
            var ear=new THREE.Mesh(cearG,toon(color));
            ear.position.set(s*0.32,1.2,0.1);ear.rotation.z=s*0.2;
            body.add(ear);
            var inner=new THREE.Mesh(new THREE.ConeGeometry(0.08,0.2,4),toon(0xFFBBAA));
            inner.position.set(s*0.32,1.18,0.14);inner.rotation.z=s*0.2;
            body.add(inner);
        });
        // Wild mane — orange, more prominent
        for(var _bmi=0;_bmi<12;_bmi++){
            var _bma=_bmi/12*Math.PI*2;
            var spike=new THREE.Mesh(new THREE.ConeGeometry(0.08,0.35,4),toon(0xFF8800));
            spike.position.set(Math.cos(_bma)*0.38,1.1+Math.random()*0.2,Math.sin(_bma)*0.25);
            spike.rotation.z=Math.cos(_bma)*0.5;spike.rotation.x=-Math.sin(_bma)*0.4;
            body.add(spike);
        }
        // Extra top mane tufts
        for(var _bti=0;_bti<4;_bti++){
            var _bta=_bti/4*Math.PI*2+0.4;
            var topSpike=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.28,4),toon(0xFF8800));
            topSpike.position.set(Math.cos(_bta)*0.15,1.35,Math.sin(_bta)*0.12);
            body.add(topSpike);
        }
        // Fangs
        [-1,1].forEach(function(s){
            var fang=new THREE.Mesh(new THREE.ConeGeometry(0.03,0.1,4),toon(0xFFFFFF));
            fang.position.set(s*0.12,0.5,0.55);fang.rotation.x=Math.PI;
            body.add(fang);
        });
        var whG=new THREE.CylinderGeometry(0.008,0.008,0.4,3);
        [-1,1].forEach(function(s){
            for(var w=-1;w<=1;w++){
                var wh=new THREE.Mesh(whG,toon(0x888888));
                wh.position.set(s*0.35,0.7+w*0.06,0.45);
                wh.rotation.z=Math.PI/2+s*0.15+w*0.1;
                body.add(wh);
            }
        });
        // Curved tail
        var catTailPts=[];
        for(var ct=0;ct<=8;ct++){
            var ctt=ct/8;
            catTailPts.push(new THREE.Vector3(0, 0.7+ctt*0.4, -0.5-ctt*0.5+Math.sin(ctt*Math.PI)*0.2));
        }
        var catTailCurve=new THREE.CatmullRomCurve3(catTailPts);
        var catTailGeo=new THREE.TubeGeometry(catTailCurve,12,0.04,6,false);
        body.add(new THREE.Mesh(catTailGeo,toon(color)));
        // Darker stripe markings on body (3 horizontal stripes)
        var stripeMat=toon(0x1A6600);
        for(var sti=0;sti<3;sti++){
            var stripeY=0.35+sti*0.2;
            // Front stripe
            var stripeF=new THREE.Mesh(new THREE.BoxGeometry(0.45,0.04,0.02),stripeMat);
            stripeF.position.set(0,stripeY,0.52);body.add(stripeF);
            // Left side stripe
            var stripeL=new THREE.Mesh(new THREE.BoxGeometry(0.02,0.04,0.35),stripeMat);
            stripeL.position.set(-0.52,stripeY,0.1);body.add(stripeL);
            // Right side stripe
            var stripeR=new THREE.Mesh(new THREE.BoxGeometry(0.02,0.04,0.35),stripeMat);
            stripeR.position.set(0.52,stripeY,0.1);body.add(stripeR);
        }
        // Bigger cat-like slit pupils (cover existing round pupils)
        [-1,1].forEach(function(s){
            var slitPupil=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.18,0.02),toon(0x111111));
            slitPupil.position.set(s*0.24,0.86,0.555);
            body.add(slitPupil);
        });
    } else if (charType==='monkey') {
        var mearG=new THREE.SphereGeometry(0.18,8,6);
        [-1,1].forEach(function(s){
            var ear=new THREE.Mesh(mearG,toon(0xFFCC88));
            ear.position.set(s*0.5,0.9,0); ear.scale.z=0.5;
            body.add(ear);
            var inner=new THREE.Mesh(new THREE.SphereGeometry(0.12,6,4),toon(0xD4956B));
            inner.position.set(s*0.5,0.9,0.05); inner.scale.z=0.5;
            body.add(inner);
        });
        var muz=new THREE.Mesh(new THREE.SphereGeometry(0.2,8,6),toon(0xFFCC88));
        muz.position.set(0,0.65,0.45); muz.scale.set(1.2,0.8,0.6);
        body.add(muz);
        // Chun-Li hair buns — two spheres on sides with ribbons
        var bunMat=toon(0x222222);
        [-1,1].forEach(function(s){
            var bun=new THREE.Mesh(new THREE.SphereGeometry(0.16,8,6),bunMat);
            bun.position.set(s*0.48,1.15,0);
            body.add(bun);
            // Bun cover/wrap
            var wrap=new THREE.Mesh(new THREE.TorusGeometry(0.12,0.03,6,12),toon(0xFFFFFF));
            wrap.position.set(s*0.48,1.15,0);wrap.rotation.y=Math.PI/2;
            body.add(wrap);
            // Ribbon trailing down
            var ribbon=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.25,0.02),toon(0xFFFFFF));
            ribbon.position.set(s*0.52,0.95,0);ribbon.rotation.z=s*0.15;
            body.add(ribbon);
        });
        // Long tail (>=0.6x body)
        var monkTailPts=[];
        for(var mt=0;mt<=10;mt++){
            var mtt=mt/10;
            monkTailPts.push(new THREE.Vector3(
                Math.sin(mtt*Math.PI*0.5)*0.15,
                0.6-mtt*0.3+Math.sin(mtt*Math.PI)*0.3,
                -0.5-mtt*0.7
            ));
        }
        var monkTailCurve=new THREE.CatmullRomCurve3(monkTailPts);
        var monkTailGeo=new THREE.TubeGeometry(monkTailCurve,14,0.04,6,false);
        body.add(new THREE.Mesh(monkTailGeo,toon(0x2255CC)));
        // Lighter belly patch (front of body)
        var bellyPatch=new THREE.Mesh(new THREE.SphereGeometry(0.3,10,8),toon(0xFFDDBB));
        bellyPatch.position.set(0,0.45,0.38);bellyPatch.scale.set(0.8,1.0,0.3);
        body.add(bellyPatch);
        // Curled tail tip with puff ball
        var tailPuff=new THREE.Mesh(new THREE.SphereGeometry(0.07,6,4),toon(0x2255CC));
        tailPuff.position.set(0.15,0.35,-1.15);
        body.add(tailPuff);
    } else if (charType==='rooster') {
        for(var ri=0;ri<3;ri++){
            var cb=new THREE.Mesh(new THREE.SphereGeometry(0.1,6,4),toon(0xFF3333));
            cb.position.set(-0.08+ri*0.08,1.25+Math.abs(ri-1)*0.04,0.15);
            body.add(cb);
        }
        var wat=new THREE.Mesh(new THREE.SphereGeometry(0.08,6,4),toon(0xFF3333));
        wat.position.set(0,0.52,0.5); wat.scale.y=1.5; body.add(wat);
        var beak=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.18,4),toon(0xFFAA00));
        beak.position.set(0,0.7,0.58); beak.rotation.x=-Math.PI/2;
        body.add(beak);
        // Guile blonde flat-top — rectangular yellow block on top
        var flatTop=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.2,0.3),toon(0xFFDD44));
        flatTop.position.set(0,1.35,0);
        body.add(flatTop);
        // Flat-top side edges for sharp military look
        [-1,1].forEach(function(s){
            var sideFlat=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.18,0.25),toon(0xFFDD44));
            sideFlat.position.set(s*0.22,1.33,0);
            body.add(sideFlat);
        });
        // Bigger wings (scaled up)
        [-1,1].forEach(function(s){
            var wing=new THREE.Mesh(new THREE.SphereGeometry(0.25,8,6),toon(0x556B2F));
            wing.position.set(s*0.58,0.6,-0.05);
            wing.scale.set(0.5,1.3,1.0); wing.rotation.z=s*0.3;
            body.add(wing);
            // Wing tip feather detail
            var wingTip=new THREE.Mesh(new THREE.ConeGeometry(0.08,0.2,4),toon(0x556B2F));
            wingTip.position.set(s*0.72,0.45,-0.05);wingTip.rotation.z=s*0.8;
            body.add(wingTip);
        });
        // Fan-shaped tail feathers (more feathers spread wider)
        for(var fi=0;fi<7;fi++){
            var fAngle=(fi-3)*0.25;
            var fColor=(fi%2===0)?0x556B2F:0xFFDD44;
            var feather=new THREE.Mesh(new THREE.ConeGeometry(0.05,0.45,4),toon(fColor));
            feather.position.set(Math.sin(fAngle)*0.15,0.8+Math.abs(fi-3)*0.04,-0.55);
            feather.rotation.x=0.5+Math.abs(fi-3)*0.08;
            feather.rotation.y=fAngle*0.3;
            body.add(feather);
        }
        // Spurs on feet
        [-1,1].forEach(function(s){
            var spur=new THREE.Mesh(new THREE.ConeGeometry(0.025,0.12,4),toon(0xCCAA00));
            spur.position.set(s*0.2,-0.6,-0.08);spur.rotation.x=0.5;
            body.add(spur);
        });
    } else if (charType==='cockroach') {
        // Dhalsim — elongated body with skull necklace
        // Twin-tail antennae (hair-style)
        var antennae=[];
        [-1,1].forEach(function(s){
            var antPts=[];
            for(var ai=0;ai<=6;ai++){
                var att=ai/6;
                antPts.push(new THREE.Vector3(s*0.1+s*att*0.35, 1.1+att*0.5, 0.1-att*0.15));
            }
            var antCurve=new THREE.CatmullRomCurve3(antPts);
            var antGeo=new THREE.TubeGeometry(antCurve,10,0.025,6,false);
            var ant=new THREE.Mesh(antGeo,toon(0x5C2E0A));
            ant.userData._antSide=s;
            body.add(ant);
            antennae.push(ant);
            var tip=new THREE.Mesh(new THREE.SphereGeometry(0.05,6,4),toon(0x8B6040));
            tip.position.set(s*0.45,1.6,-0.05);
            tip.userData._antSide=s;
            body.add(tip);
            antennae.push(tip);
        });
        g.userData._antennae=antennae;
        // Shell line
        var sline=new THREE.Mesh(new THREE.BoxGeometry(0.02,0.6,0.02),toon(0x3D2215));
        sline.position.set(0,0.8,-0.1); body.add(sline);
        // Small legs
        [-1,1].forEach(function(s){
            for(var j=0;j<2;j++){
                var leg=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.015,0.25,3),toon(0x5C2E0A));
                leg.position.set(s*0.45,0.4+j*0.25,0); leg.rotation.z=s*0.8;
                body.add(leg);
            }
        });
        // Skull necklace — 3 small white spheres around neck
        var skullMat=toon(0xFFFFFF);
        for(var ski=0;ski<3;ski++){
            var ska=(ski-1)*0.7;
            var skull=new THREE.Mesh(new THREE.SphereGeometry(0.06,6,4),skullMat);
            skull.position.set(Math.sin(ska)*0.35,0.48,Math.cos(ska)*0.35);
            body.add(skull);
            // Eye holes on each skull
            [-1,1].forEach(function(s){
                var hole=new THREE.Mesh(new THREE.SphereGeometry(0.015,4,3),toon(0x111111));
                hole.position.set(Math.sin(ska)*0.35+s*0.02,0.5,Math.cos(ska)*0.35+0.03);
                body.add(hole);
            });
        }
        // Elongate body slightly more
        body.scale.y=1.1;
        // Wing cases on back (two elliptical translucent shapes)
        var wingCaseMat=toon(0x7B5030,{transparent:true,opacity:0.5});
        [-1,1].forEach(function(s){
            var wingCase=new THREE.Mesh(new THREE.SphereGeometry(0.22,8,6),wingCaseMat);
            wingCase.position.set(s*0.12,0.7,-0.35);
            wingCase.scale.set(0.8,1.4,0.3);
            wingCase.rotation.z=s*0.15;
            body.add(wingCase);
        });
        // Wider/flatter body shape enhancement
        body.scale.x=1.15;body.scale.z=0.9;
    } else if (charType==='bull') {
        // Buffalo (野牛) — Honda moveset
        // Big bull horns (牛魔王 style) — horizontal outward then curve up
        [-1,1].forEach(function(s){
            // Horn root — thick, horizontal outward from head sides
            var hornRoot=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.1,0.25,8),toon(0x333333));
            hornRoot.position.set(s*0.35,1.0,0.0);hornRoot.rotation.z=s*Math.PI/2;body.add(hornRoot);
            // Horn mid — angled upward
            var hornMid=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.08,0.25,8),toon(0x444444));
            hornMid.position.set(s*0.55,1.1,0.0);hornMid.rotation.z=s*Math.PI/3;body.add(hornMid);
            // Horn tip — pointed upward
            var hornTip=new THREE.Mesh(new THREE.ConeGeometry(0.04,0.2,6),toon(0xCCBB88));
            hornTip.position.set(s*0.62,1.3,0.0);hornTip.rotation.z=s*Math.PI/6;body.add(hornTip);
        });
        // Nose ring
        var ringG=new THREE.TorusGeometry(0.06,0.015,6,12,Math.PI);
        var ring=new THREE.Mesh(ringG,toon(0xCCAA00));
        ring.position.set(0,0.6,0.58);ring.rotation.x=Math.PI/2;body.add(ring);
        // Wide nostrils
        [-1,1].forEach(function(s){
            var nos=new THREE.Mesh(new THREE.SphereGeometry(0.04,4,4),toon(0x2A1A0A));
            nos.position.set(s*0.08,0.65,0.55);body.add(nos);
        });
        // Sumo topknot (Honda trait)
        var topknot=new THREE.Mesh(new THREE.SphereGeometry(0.1,6,4),toon(0x222222));
        topknot.position.set(0,1.22,0);body.add(topknot);
        // Face paint stripes (Honda signature)
        [-1,1].forEach(function(s){
            var blueStripe=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.25,0.02),toon(0x2244AA));
            blueStripe.position.set(s*0.16,0.82,0.56);body.add(blueStripe);
        });
        var redStripe=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.05,0.02),toon(0xCC2222));
        redStripe.position.set(0,0.9,0.55);body.add(redStripe);
        // Short tail
        var bufTail=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.01,0.2,4),toon(0x2A1A0A));
        bufTail.position.set(0,0.65,-0.55);bufTail.rotation.x=0.5;body.add(bufTail);
        var tailTuft=new THREE.Mesh(new THREE.SphereGeometry(0.04,4,4),toon(0x222222));
        tailTuft.position.set(0,0.58,-0.63);body.add(tailTuft);
        // Wider protruding muzzle/snout area
        var bullSnout=new THREE.Mesh(new THREE.SphereGeometry(0.2,8,6),toon(0x3A2A1A));
        bullSnout.position.set(0,0.62,0.52);bullSnout.scale.set(1.3,0.7,0.6);
        body.add(bullSnout);
        // Bigger nostrils (replace small ones with larger)
        [-1,1].forEach(function(s){
            var bigNos=new THREE.Mesh(new THREE.SphereGeometry(0.06,6,4),toon(0x1A0A00));
            bigNos.position.set(s*0.1,0.6,0.6);body.add(bigNos);
        });
        // Hoof-shaped darker feet
        [-1,1].forEach(function(s){
            var hoof=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.12,0.06,8),toon(0x2A1A0A));
            hoof.position.set(s*0.2,-0.6,0.06);
            body.add(hoof);
        });
    } else if (charType==='bear') {
        // Bear with boar mask (Inosuke style) — Zangief moveset
        // Round bear ears
        [-1,1].forEach(function(s){
            var ear=new THREE.Mesh(new THREE.SphereGeometry(0.14,8,6),toon(0x6B4A2A));
            ear.position.set(s*0.35,1.15,0.05);body.add(ear);
            var earInner=new THREE.Mesh(new THREE.SphereGeometry(0.08,6,4),toon(0xAA7755));
            earInner.position.set(s*0.35,1.15,0.1);body.add(earInner);
        });
        // Boar mask on face (lighter color, snout shape)
        var mask=new THREE.Mesh(new THREE.SphereGeometry(0.35,8,6),toon(0xDDCCAA));
        mask.position.set(0,0.82,0.35);mask.scale.set(1,0.8,0.6);body.add(mask);
        // Boar snout
        var snout=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.14,0.15,8),toon(0xCCBB99));
        snout.position.set(0,0.7,0.55);snout.rotation.x=Math.PI/2;body.add(snout);
        [-1,1].forEach(function(s){
            var nos=new THREE.Mesh(new THREE.SphereGeometry(0.035,4,4),toon(0x885544));
            nos.position.set(s*0.05,0.7,0.63);body.add(nos);
        });
        // Boar tusks
        [-1,1].forEach(function(s){
            var tusk=new THREE.Mesh(new THREE.ConeGeometry(0.025,0.12,4),toon(0xFFFFF0));
            tusk.position.set(s*0.1,0.6,0.58);tusk.rotation.x=-0.3;tusk.rotation.z=s*0.2;body.add(tusk);
        });
        // Chest hair — Zangief trait (bigger, more visible)
        var chestHairMat=toon(0x8B4513);
        for(var chi=0;chi<9;chi++){
            var cha=(chi-4)*0.1;
            var chv=0.35+Math.abs(chi-4)*0.02;
            var hair=new THREE.Mesh(new THREE.ConeGeometry(0.04,0.18,3),chestHairMat);
            hair.position.set(cha,chv,0.5);hair.rotation.x=-0.4;
            body.add(hair);
        }
        // Scars — Zangief trait (large X-shaped scars on chest)
        var scarMat=toon(0xFF6666);
        // Big X scar on chest center
        var scar1=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.05,0.05),scarMat);
        scar1.position.set(0,0.25,0.5);scar1.rotation.z=0.6;body.add(scar1);
        var scar2=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.05,0.05),scarMat);
        scar2.position.set(0,0.25,0.5);scar2.rotation.z=-0.6;body.add(scar2);
        // Scar on left side
        var scar3=new THREE.Mesh(new THREE.BoxGeometry(0.35,0.05,0.05),scarMat);
        scar3.position.set(-0.45,0.3,0.2);scar3.rotation.z=0.4;body.add(scar3);
        // Scar on right side
        var scar4=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.05,0.05),scarMat);
        scar4.position.set(0.45,0.2,0.15);scar4.rotation.z=-0.3;body.add(scar4);
        // Scar on back
        var scar5=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.05,0.05),scarMat);
        scar5.position.set(0.1,0.3,-0.45);scar5.rotation.z=0.5;body.add(scar5);
        // Short stubby bear tail
        var bearTail=new THREE.Mesh(new THREE.SphereGeometry(0.08,6,4),toon(0x6B4A2A));
        bearTail.position.set(0,0.65,-0.55);body.add(bearTail);
        // Bigger bear paws (larger arms/stubs)
        var bearPawMat=toon(0x6B4A2A);
        [-1,1].forEach(function(s){
            var paw=new THREE.Mesh(new THREE.SphereGeometry(0.18,8,6),bearPawMat);
            paw.position.set(s*0.6,0.55,0.1);paw.scale.set(0.9,1.0,0.9);
            body.add(paw);
            // Visible claws (small cones on paws)
            for(var ci=0;ci<3;ci++){
                var claw=new THREE.Mesh(new THREE.ConeGeometry(0.02,0.1,4),toon(0xEEDDCC));
                claw.position.set(s*0.65+(ci-1)*0.06,0.42,0.15);
                claw.rotation.x=-0.3;
                body.add(claw);
            }
        });
    }

    _addCharacterPolish(g,body,color,accent,charType);

    // Feet
    var ftG=new THREE.SphereGeometry(0.14,8,6); ftG.scale(1.1,0.45,1.4);
    var ftM=toon(accent||0xFFCC00);
    var feet=[];
    [-1,1].forEach(function(s){ var ft=new THREE.Mesh(ftG,ftM); ft.position.set(s*0.2,0.05,0.06); g.add(ft); feet.push(ft); });
    _addPremiumCharacterRig(g,body,color,accent,charType,feet);
    // Attack limbs (hidden by default, shown during punch/kick)
    var armMat=toon(accent||0xFFCC00);
    var fistMat=toon(0xFFFFFF); // white fists for visibility
    // Fists — white spheres, clearly outside body surface
    var rightArm=new THREE.Mesh(new THREE.SphereGeometry(0.18,8,6),fistMat);
    rightArm.position.set(0.4,0.2,0.7);rightArm.visible=false;body.add(rightArm);
    var leftArm=new THREE.Mesh(new THREE.SphereGeometry(0.18,8,6),fistMat);
    leftArm.position.set(-0.4,0.2,0.7);leftArm.visible=false;body.add(leftArm);
    // Legs — cylinders on the group
    var rightLeg=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.13,0.7,6),armMat);
    rightLeg.position.set(0.22,0.1,0.5);rightLeg.rotation.x=-Math.PI/3;rightLeg.visible=false;g.add(rightLeg);
    var leftLeg=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.13,0.7,6),armMat);
    leftLeg.position.set(-0.22,0.1,0.5);leftLeg.rotation.x=-Math.PI/3;leftLeg.visible=false;g.add(leftLeg);
    g.userData.body=body; g.userData.feet=feet; g.userData._charType=charType;
    g.userData._eyeWhites=_eyeWhites;g.userData._pupils=_pupils;g.userData._shines=_shines;g.userData._smile=_smileMesh;g.userData._eyeY=eyeY;
    g.userData.rightArm=rightArm;g.userData.leftArm=leftArm;
    g.userData.rightLeg=rightLeg;g.userData.leftLeg=leftLeg;
    return g;
}

const allEggs=[];
let playerEgg=null;

var PLAYER_ARROW_DEFAULT_Y=2.25;
var PLAYER_ARROW_EQUIPMENT_CLEARANCE=0.55;
function _updatePlayerArrowClearance(cosmeticRoot){
    if(!playerEgg||!playerEgg.arrow||!playerEgg.mesh)return;
    var baseY=PLAYER_ARROW_DEFAULT_Y;
    if(cosmeticRoot&&cosmeticRoot.children&&cosmeticRoot.children.length){
        playerEgg.mesh.updateMatrixWorld(true);
        var bounds=new THREE.Box3().setFromObject(cosmeticRoot);
        if(!bounds.isEmpty()){
            var topPoint=bounds.getCenter(new THREE.Vector3());topPoint.y=bounds.max.y;
            var topLocal=playerEgg.mesh.worldToLocal(topPoint);
            baseY=Math.max(baseY,topLocal.y+PLAYER_ARROW_EQUIPMENT_CLEARANCE);
        }
    }
    playerEgg.arrow.userData.baseY=baseY;
    playerEgg.arrow.position.set(0,baseY,0);
}

function createEgg(x,z,color,accent,isPlayer,targetScene,charType){
    const mesh=createEggMesh(color,accent,charType);
    mesh.position.set(x,0.01,z);
    (targetScene||scene).add(mesh);
    let arrow=null;
    if(isPlayer){
        const ag=new THREE.ConeGeometry(0.25,0.5,8);
        arrow=new THREE.Mesh(ag,toon(0xFFCC00,{emissive:0xFFCC00,emissiveIntensity:0.4}));
        arrow.rotation.x=Math.PI;
        arrow.position.set(0,PLAYER_ARROW_DEFAULT_Y,0);
        arrow.userData.baseY=PLAYER_ARROW_DEFAULT_Y;
        mesh.add(arrow);
    }
    const egg={
        mesh, vx:0,vy:0,vz:0, onGround:false, isPlayer,
        alive:true, finished:false, finishOrder:-1,
        radius:0.55, squash:1, arrow, walkPhase:0,
        aiSkill:0.4+Math.random()*0.6,
        aiTargetX:x, aiReactTimer:Math.random()*30, aiJumpCD:0,
        conveyorVx:0, conveyorVz:0, onPlatform:null,
        heldBy:null, holding:null, grabCD:0, struggleTimer:0, struggleMax:0, struggleBar:null, throwTimer:0, holdingObs:null, holdingProp:null, weight:1.0, _stunTimer:0,
        _origColor:color, _stunMeter:0, _stunThreshold:100,
        _extendedRange:1.0, _hitStun:0, _slamImmune:0,
    };
    allEggs.push(egg);
    return egg;
}

// ---- Drop shadow (dark circle projected straight down) ----
var _dropShadowMesh=null;
function _ensureDropShadow(){
    if(_dropShadowMesh)return;
    var geo=new THREE.CircleGeometry(0.7,16);
    var mat=new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0.35,depthWrite:false});
    _dropShadowMesh=new THREE.Mesh(geo,mat);
    _dropShadowMesh.rotation.x=-Math.PI/2;
    _dropShadowMesh.renderOrder=1;
    scene.add(_dropShadowMesh);
}
function _updateDropShadow(){
    if(!playerEgg||!playerEgg.mesh){if(_dropShadowMesh)_dropShadowMesh.visible=false;return;}
    _ensureDropShadow();
    var px=playerEgg.mesh.position.x, py=playerEgg.mesh.position.y, pz=playerEgg.mesh.position.z;
    var isCity=(gameState==='city');
    var groundY=0;
    if(isCity){
        // Check building roofs, props, clouds for highest surface below player
        for(var bi=0;bi<cityColliders.length;bi++){
            var c=cityColliders[bi];
            var dx=px-c.x, dz=pz-c.z;
            // Cone roof
            if(c.roofR&&c.roofH){
                var dist=DANBO_WASM.dist2D(px,pz,c.x,c.z);
                if(dist<c.roofR){
                    var roofBase=c.h||6;
                    var surfY=roofBase+(1-dist/c.roofR)*c.roofH;
                    if(surfY<py&&surfY>groundY)groundY=surfY;
                }
            }
            // Flat roof top
            if(DANBO_WASM.aabb2D(px,pz,c.x,c.z,c.hw,c.hd,0)){
                var roofY2=(c.h||6);
                if(roofY2<py&&roofY2>groundY)groundY=roofY2;
            }
        }
        // Cloud platforms
        for(var ci3=0;ci3<cityCloudPlatforms.length;ci3++){
            var cl=cityCloudPlatforms[ci3];
            if(DANBO_WASM.aabb2D(px,pz,cl.x,cl.z,cl.hw,cl.hd,0)){
                var clTop=cl.y+(cl.top||1.2);
                if(clTop<py&&clTop>groundY)groundY=clTop;
            }
        }
    } else {
        // Race track floor
        var gz=-pz;
        groundY=getFloorY(gz,px);
        if(groundY<-10)groundY=0;
    }
    _dropShadowMesh.visible=true;
    _dropShadowMesh.position.set(px,groundY+0.05,pz);
    // Scale shadow based on height — smaller when higher up
    var height=py-groundY;
    var sc=Math.max(0.3,1.2-height*0.04);
    _dropShadowMesh.scale.set(sc,sc,sc);
    _dropShadowMesh.material.opacity=Math.max(0.08,0.35-height*0.012);
}
