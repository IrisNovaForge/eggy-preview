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

function _updateCharacterPremiumRig(egg,speed){
    if(!egg||!egg.mesh||!egg.mesh.userData)return;
    var ud=egg.mesh.userData;
    var now=(typeof performance!=='undefined'&&performance.now)?performance.now()*0.001:Date.now()*0.001;
    _animateCuteCharacterDetails(egg.mesh,now);
    var moving=speed>0.006&&egg.onGround;
    var phase=egg.walkPhase||0;
    if(ud._decorArms){
        var idleArmProfiles={
            blossomTraveler:{frequency:1.65,amplitude:.052,x:.024},herbTraveler:{frequency:1.12,amplitude:.030,x:.016},
            saltCrystalTraveler:{frequency:1.42,amplitude:.022,x:.012},cloudwingTraveler:{frequency:.92,amplitude:.045,x:.030},
            fruitbrewTraveler:{frequency:1.82,amplitude:.060,x:.026},berryTraveler:{frequency:2.05,amplitude:.072,x:.032},
            spicyFlameTraveler:{frequency:1.28,amplitude:.034,x:.014},goldenGrainTraveler:{frequency:.86,amplitude:.040,x:.020}
        },idleArm=idleArmProfiles[ud._travelerId]||idleArmProfiles.blossomTraveler;
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
    var saltCrystalSparkles=ud._saltCrystalSparkles;
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
    var spiceIdleDetails=ud._spiceDetails;
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
    if(ud._regionalMarks&&ud._travelerId==='spicyFlameTraveler'){
        for(var rmi=0;rmi<ud._regionalMarks.length;rmi++){
            var regionMat=ud._regionalMarks[rmi].material;
            if(regionMat&&regionMat.emissiveIntensity!==undefined)regionMat.emissiveIntensity=.07+Math.max(0,Math.sin(now*1.65+rmi*.55))*.055;
        }
    }
}

function _createCuteRoundCharacterMesh(color,accent,travelerId){
    var g=new THREE.Group(),type=(typeof resolveTravelerId==='function'?resolveTravelerId(travelerId):travelerId)||'blossomTraveler';
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
        // eight recolours of one identical body while keeping collision and moves intact.
        var topBlend=Math.max(0,Math.min(1,(ny-.08)/.92));
        var baseBlend=Math.max(0,Math.min(1,(-ny-.02)/.98));
        var waistBlend=Math.exp(-Math.pow((ny+.12)/.29,2));
        var taper=1.075-(ny+1)*.075;
        var width=taper*(profile.bodyX||1)*(1-topBlend*(profile.topTaper||0)+baseBlend*(profile.lowerFullness||0)-waistBlend*(type==='blossomTraveler'?.014:0));
        var angle=Math.atan2(z,x),facet=1+(profile.facet||0)*Math.cos((type==='saltCrystalTraveler'?6:5)*angle);
        var sideAsymmetry=x>=0?1+(profile.asymmetry||0):1-(profile.asymmetry||0)*.62;
        x*=width*facet*sideAsymmetry;
        var chestBlend=Math.exp(-Math.pow((ny-.10)/.36,2));
        var backBlend=Math.exp(-Math.pow((ny+.02)/.48,2));
        z*=(profile.bodyZ||1)*(0.965+(1-ny)*.035)*facet*(z>0?1.025*(1+chestBlend*(type==='blossomTraveler'?.024:.010)):0.986*(1+backBlend*.018));
        y*=1.16*(profile.bodyY||1);
        if(y<-0.61)y=-0.61+(y+0.61)*0.28;
        bp.setXYZ(bi,x,y,z);
    }
    bodyGeo.computeVertexNormals();
    var bodyOptsByTraveler={
        blossomTraveler:{pastelAmount:.025,roughness:.72,metalness:0,clearcoat:.035,clearcoatRoughness:.82,envMapIntensity:.24,sheen:.18,sheenRoughness:.86,sheenColor:_charMixHex(color,0xFFFFFF,.25)},
        herbTraveler:{pastelAmount:.030,roughness:.86,metalness:0,clearcoat:.018,clearcoatRoughness:.90,envMapIntensity:.17},
        saltCrystalTraveler:{pastelAmount:.018,roughness:.30,metalness:.01,clearcoat:.48,clearcoatRoughness:.20,envMapIntensity:.58,transparent:true,opacity:.95,flatShading:true},
        cloudwingTraveler:{pastelAmount:.045,roughness:.70,metalness:0,clearcoat:.035,clearcoatRoughness:.78,envMapIntensity:.25,transparent:true,opacity:.97},
        fruitbrewTraveler:{pastelAmount:.028,roughness:.49,metalness:0,clearcoat:.16,clearcoatRoughness:.38,envMapIntensity:.35},
        berryTraveler:{pastelAmount:.018,roughness:.43,metalness:0,clearcoat:.18,clearcoatRoughness:.34,envMapIntensity:.38},
        spicyFlameTraveler:{pastelAmount:.010,roughness:.90,metalness:0,clearcoat:.015,clearcoatRoughness:.92,envMapIntensity:.12,flatShading:true,emissive:_charMixHex(color,0x5E160F,.72),emissiveIntensity:.025},
        goldenGrainTraveler:{pastelAmount:.018,roughness:.79,metalness:0,clearcoat:.025,clearcoatRoughness:.85,envMapIntensity:.18}
    };
    var bodyOpts=bodyOptsByTraveler[type]||bodyOptsByTraveler.blossomTraveler;
    var bodyMat=softPBR(color,bodyOpts);
    var body=new THREE.Mesh(bodyGeo,bodyMat);body.position.y=0.79;body.castShadow=true;body.receiveShadow=true;g.add(body);

    var outline=new THREE.Mesh(bodyGeo.clone(),new THREE.MeshBasicMaterial({color:0x251F38,side:THREE.BackSide,transparent:true,opacity:0.065,depthWrite:false}));
    outline.scale.setScalar(1.025);outline.renderOrder=-2;body.add(outline);g.userData._toonOutline=outline;

    var shellColor=_charMixHex(color,0xDCCFB8,0.42);
    var shellMat=softPBR(shellColor,type==='spicyFlameTraveler'?
        {pastelAmount:0.01,roughness:0.90,clearcoat:0.02,envMapIntensity:0.12}:
        (type==='blossomTraveler'?
        {pastelAmount:0.02,roughness:0.72,clearcoat:0.035,clearcoatRoughness:0.78,envMapIntensity:0.24}:
        {pastelAmount:0.02,roughness:0.42,clearcoat:0.22,clearcoatRoughness:0.28,envMapIntensity:0.40}));
    // Keep the torso as one integrated silhouette. The old front plate caused a
    // protruding "chin", while the circular rear plate and torus read as a wheel.

    var gloss=new THREE.Mesh(new THREE.CircleGeometry(0.10,20),new THREE.MeshBasicMaterial({color:0xFFFFFF,transparent:true,opacity:0.10,depthWrite:false,side:THREE.DoubleSide,blending:THREE.NormalBlending,fog:false}));
    gloss.position.set(-0.32,0.39,0.70);gloss.scale.set(0.72,0.28,1);gloss.rotation.z=-0.28;
    if(type==='blossomTraveler')gloss.material.opacity=0.025;
    body.add(gloss);

    if(type==='blossomTraveler'){
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
        blossomTraveler:{spacing:.222,eyeX:.60,eyeY:1.05,eyeLevel:.205,browY:.385,browTilt:.13,smileHalf:.100,smileDip:-.174},
        herbTraveler:{spacing:.230,eyeX:.68,eyeY:.91,eyeLevel:.202,browY:.370,browTilt:.06,smileHalf:.118,smileDip:-.184},
        saltCrystalTraveler:{spacing:.224,eyeX:.70,eyeY:.80,eyeLevel:.218,browY:.356,browTilt:-.02,smileHalf:.088,smileDip:-.154},
        cloudwingTraveler:{spacing:.218,eyeX:.61,eyeY:1.08,eyeLevel:.224,browY:.404,browTilt:.10,smileHalf:.112,smileDip:-.178},
        fruitbrewTraveler:{spacing:.236,eyeX:.72,eyeY:.98,eyeLevel:.205,browY:.386,browTilt:.08,smileHalf:.126,smileDip:-.194},
        berryTraveler:{spacing:.235,eyeX:.72,eyeY:1.12,eyeLevel:.213,browY:.405,browTilt:.18,smileHalf:.132,smileDip:-.205},
        spicyFlameTraveler:{spacing:.232,eyeX:.68,eyeY:.86,eyeLevel:.205,browY:.353,browTilt:-.20,smileHalf:.105,smileDip:-.162,asym:.010},
        goldenGrainTraveler:{spacing:.214,eyeX:.59,eyeY:.94,eyeLevel:.218,browY:.374,browTilt:.01,smileHalf:.092,smileDip:-.165}
    },faceProfile=faceProfiles[type]||faceProfiles.blossomTraveler;
    var faceSurface=.665*(profile.bodyZ||1);
    var eyeG=new THREE.SphereGeometry(0.128,high?24:16,high?18:12);
    var eyeMat=softPBR(0xFFFDF7,{pastelAmount:0,roughness:0.25,clearcoat:0.43,clearcoatRoughness:0.17,envMapIntensity:0.48});
    var irisPalette={blossomTraveler:0x647FCE,herbTraveler:0x4F916A,saltCrystalTraveler:0x4B9DD6,cloudwingTraveler:0x687BCB,fruitbrewTraveler:0xA15E92,berryTraveler:0x5C69B7,spicyFlameTraveler:0x5D708D,goldenGrainTraveler:0x765FA9};
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
    var blushColor=type==='fruitbrewTraveler'?0xE64870:0xFF779F;
    var blushOpacity=type==='fruitbrewTraveler'?0.58:0.43;
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
        if(handType==='blossomTraveler')return makeBlossomPetalGlove(size,baseMaterial,'danbo-character-hand');
        var glove=new THREE.Group();glove.name='danbo-character-hand';
        var detailMat=softPBR(_charMixHex(accent,0xFFFFFF,.24),{pastelAmount:.015,roughness:handType==='saltCrystalTraveler'?.30:.70,clearcoat:handType==='saltCrystalTraveler'?.35:.025,envMapIntensity:handType==='saltCrystalTraveler'?.46:.18});
        var palm;
        if(handType==='saltCrystalTraveler'){
            palm=new THREE.Mesh(new THREE.OctahedronGeometry(size*.82,1),detailMat);palm.scale.set(.92,1.05,.66);
        }else if(handType==='spicyFlameTraveler'){
            palm=new THREE.Mesh(new THREE.DodecahedronGeometry(size*.78,0),softPBR(_charMixHex(accent,0x5B2B28,.45),{roughness:.91,clearcoat:0,flatShading:true}));palm.scale.set(1.05,.92,.72);
        }else{
            palm=new THREE.Mesh(new THREE.SphereGeometry(size*.74,high?20:13,high?14:9),baseMaterial);palm.scale.set(1.06,.90,.68);
        }
        palm.castShadow=true;glove.add(palm);
        if(handType==='herbTraveler'||handType==='goldenGrainTraveler'){
            var leaf=new THREE.Mesh(new THREE.SphereGeometry(size*.44,high?16:10,high?10:7),detailMat);
            leaf.position.set(0,size*.30,.01);leaf.scale.set(handType==='herbTraveler'?1.12:.78,handType==='herbTraveler'?.44:1.16,.50);leaf.rotation.z=handType==='herbTraveler'?.48:0;glove.add(leaf);
            var vein=new THREE.Mesh(new THREE.BoxGeometry(.018,size*.58,.018),softPBR(_charMixHex(accent,0x4A5B2C,.50),{roughness:.86}));vein.position.z=size*.45;vein.rotation.z=handType==='herbTraveler'?.48:0;glove.add(vein);
        }else if(handType==='cloudwingTraveler'){
            [[-.34,.10,.43],[0,.28,.50],[.34,.08,.41]].forEach(function(cp){var puff=new THREE.Mesh(new THREE.SphereGeometry(size*cp[2],high?16:10,high?10:7),detailMat);puff.position.set(size*cp[0],size*cp[1],.01);puff.scale.z=.62;glove.add(puff);});
        }else if(handType==='fruitbrewTraveler'){
            var orchardLeaf=new THREE.Mesh(new THREE.SphereGeometry(size*.34,high?16:10,high?10:7),softPBR(0x6B9F55,{roughness:.80}));orchardLeaf.position.set(size*.36,size*.24,.015);orchardLeaf.scale.set(1.15,.40,.52);orchardLeaf.rotation.z=-.55;glove.add(orchardLeaf);
        }else if(handType==='berryTraveler'){
            [-1,1].forEach(function(s){var berryPad=new THREE.Mesh(new THREE.SphereGeometry(size*.30,high?16:10,high?10:7),detailMat);berryPad.position.set(s*size*.30,size*.18,.015);berryPad.scale.z=.65;glove.add(berryPad);});
        }else if(handType==='spicyFlameTraveler'){
            var ember=new THREE.Mesh(new THREE.BoxGeometry(size*.62,.022,.022),softPBR(0xFFB24F,{roughness:.48,emissive:0x7A1F0B,emissiveIntensity:.10}));ember.position.set(0,-size*.04,size*.58);ember.rotation.z=.46;glove.add(ember);
        }
        return glove;
    }

    var decorArms=[],armMat=softPBR(color,type==='spicyFlameTraveler'?
        {pastelAmount:0.018,roughness:0.91,clearcoat:0.02,envMapIntensity:0.11}:
        (type==='blossomTraveler'?
        {pastelAmount:0.025,roughness:0.66,clearcoat:0.055,clearcoatRoughness:0.72,envMapIntensity:0.29}:
        {pastelAmount:0.045,roughness:0.31,clearcoat:0.40,clearcoatRoughness:0.22,envMapIntensity:0.60}));
    [-1,1].forEach(function(s){
        var armRadius=type==='spicyFlameTraveler'?0.165:0.142;
        var handRadius=type==='spicyFlameTraveler'?0.215:0.188;
        var armG=new THREE.Group(),arm=new THREE.Mesh(new THREE.SphereGeometry(armRadius,high?22:14,high?14:9),armMat);
        arm.position.y=type==='blossomTraveler'?-0.115:-0.10;arm.scale.set(0.68,type==='blossomTraveler'?1.78:1.55,0.60);arm.castShadow=true;armG.add(arm);
        var hand;
        hand=makeRegionalHand(type,handRadius,shellMat);
        hand.position.set(0,type==='blossomTraveler'?-0.405:-0.36,0.035);
        hand.scale.setScalar(1);armG.add(hand);armG.userData._hand=hand;armG.userData._baseHandRadius=handRadius;
        var armSpread=(type==='spicyFlameTraveler'||type==='fruitbrewTraveler'||type==='berryTraveler')?.72:(type==='blossomTraveler'?.705:(type==='cloudwingTraveler'?.61:.65));
        armG.position.set(s*armSpread,0.00,0.015);armG.rotation.z=s*(type==='cloudwingTraveler'?.43:.48);armG.userData._side=s;armG.userData._restZ=armG.rotation.z;body.add(armG);decorArms.push(armG);
    });
    g.userData._decorArms=decorArms;

    var footColor=_charMixHex(accent,0xFF667A,0.14),ftM=softPBR(footColor,type==='spicyFlameTraveler'?
        {pastelAmount:0.012,roughness:0.84,clearcoat:0.035,clearcoatRoughness:0.78,envMapIntensity:0.14}:
        (type==='blossomTraveler'?
        {pastelAmount:0.02,roughness:0.82,clearcoat:0.018,clearcoatRoughness:0.88,envMapIntensity:0.18}:
        {pastelAmount:0.025,roughness:0.26,clearcoat:0.58,clearcoatRoughness:0.16,envMapIntensity:0.72}));
    function makeRegionalFoot(footType,side){
        var shoe=new THREE.Group();shoe.name='danbo-'+footType+'-traveler-shoe';
        var main;
        if(footType==='saltCrystalTraveler'){
            main=new THREE.Mesh(new THREE.OctahedronGeometry(.25,1),ftM);main.scale.set(1.18,.45,1.34);main.rotation.x=.08;
        }else if(footType==='spicyFlameTraveler'){
            main=new THREE.Mesh(new THREE.DodecahedronGeometry(.245,0),ftM);main.scale.set(1.34,.48,1.48);main.rotation.y=-side*.08;
        }else{
            var shoeGeo=new THREE.SphereGeometry(.22,high?28:16,high?18:10);shoeGeo.scale(1.42,.54,1.74);
            main=new THREE.Mesh(shoeGeo,ftM);
        }
        main.castShadow=true;main.receiveShadow=true;shoe.add(main);
        if(footType==='herbTraveler'){
            var leafToe=new THREE.Mesh(new THREE.SphereGeometry(.13,high?18:11,high?11:7),softPBR(0x568C4E,{roughness:.84}));leafToe.position.set(side*.025,.02,.27);leafToe.scale.set(1.05,.30,1.38);leafToe.rotation.y=-side*.12;shoe.add(leafToe);
        }else if(footType==='cloudwingTraveler'){
            var cloudMat=softPBR(0xF2FAFF,{roughness:.73,transparent:true,opacity:.95});
            [-1,0,1].forEach(function(i){var lobe=new THREE.Mesh(new THREE.SphereGeometry(.095,high?16:10,high?10:7),cloudMat);lobe.position.set(i*.085,.015,.19+Math.abs(i)*.012);lobe.scale.set(1.12,.58,.90);shoe.add(lobe);});
        }else if(footType==='fruitbrewTraveler'){
            var fruitLeaf=new THREE.Mesh(new THREE.SphereGeometry(.085,high?16:10,high?10:7),softPBR(0x6D9B55,{roughness:.80}));fruitLeaf.position.set(side*.07,.065,.22);fruitLeaf.scale.set(1.28,.34,.62);fruitLeaf.rotation.z=side*.45;shoe.add(fruitLeaf);
        }else if(footType==='berryTraveler'){
            var berryStem=new THREE.Mesh(new THREE.CylinderGeometry(.020,.028,.14,7),softPBR(0x47764D,{roughness:.86}));berryStem.position.set(side*.04,.10,.18);berryStem.rotation.z=-side*.40;shoe.add(berryStem);
        }else if(footType==='spicyFlameTraveler'){
            var lavaSole=new THREE.Mesh(new THREE.BoxGeometry(.36,.025,.40),softPBR(0xFF9B3D,{roughness:.58,emissive:0x7C210B,emissiveIntensity:.10}));lavaSole.position.set(0,-.10,.03);lavaSole.rotation.y=-side*.05;shoe.add(lavaSole);
        }else if(footType==='goldenGrainTraveler'){
            var husk=new THREE.Mesh(new THREE.SphereGeometry(.12,high?16:10,high?10:7),softPBR(0xF0C75C,{roughness:.66}));husk.position.set(0,.035,.22);husk.scale.set(.52,.70,1.34);shoe.add(husk);
        }else if(footType==='blossomTraveler'){
            var petalToe=new THREE.Mesh(_starShapeGeometry(.075,.038,5),softPBR(_charMixHex(accent,0xFFFFFF,.36),{roughness:.76,side:THREE.DoubleSide}));petalToe.position.set(side*.035,.065,.285);petalToe.rotation.x=-.18;shoe.add(petalToe);
        }
        return shoe;
    }
    var feet=[];
    [-1,1].forEach(function(s){var ft=makeRegionalFoot(type,s);ft.position.set(s*.29,.105,.15);ft.rotation.y=-s*.08;g.add(ft);feet.push(ft);});

    var cloudwingDetails=[],saltCrystalSparkles=[],saltCrystalEars=[],fruitbrewDetails=[],flowerDetails=[],forestLeaves=[],herbShellDetails=[],spiceDetails=[],spiceSurfaceMarks=[],berryDetails=[],goldenGrainDetails=[];
    if(type==='blossomTraveler'){
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
    }else if(type==='fruitbrewTraveler'){
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
    }else if(type==='saltCrystalTraveler'){
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
    }else if(type==='cloudwingTraveler'){
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
    }else if(type==='berryTraveler'){
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
    }else if(type==='herbTraveler'){
        // Herb Traveler shell-life test: the plant is rooted in an asymmetric
        // opening instead of sitting on top of one uninterrupted shell silhouette.
        var herbOuterShellMat=softPBR(_charMixHex(color,0x4F7F49,.12),{pastelAmount:.015,roughness:.88,metalness:0,clearcoat:.008,envMapIntensity:.14});
        var herbInnerShellMat=softPBR(_charMixHex(color,0xE4D2A5,.46),{pastelAmount:.01,roughness:.94,metalness:0,clearcoat:0,envMapIntensity:.10,side:THREE.DoubleSide});
        var herbCavityMat=softPBR(0x405D39,{pastelAmount:0,roughness:.96,metalness:0,clearcoat:0,envMapIntensity:.06,side:THREE.DoubleSide});
        var herbCrackMat=softPBR(0x4C6D42,{pastelAmount:0,roughness:.98,metalness:0,clearcoat:0,envMapIntensity:.05});
        var herbShellOpening=new THREE.Group();herbShellOpening.name='danbo-herb-shell-opening';
        herbShellOpening.position.set(-0.070,0.648,0.055);herbShellOpening.rotation.set(-.08,.06,-.09);body.add(herbShellOpening);herbShellDetails.push(herbShellOpening);
        // A recessed dark centre plus an uneven raised rim reads as a missing
        // shell section with depth. Each rim lobe has a different scale/angle,
        // so the opening never becomes a tidy badge or symmetrical saw-tooth.
        var herbCavity=new THREE.Mesh(new THREE.CircleGeometry(.208,high?28:18),herbCavityMat);
        herbCavity.position.set(.010,.038,.612);herbCavity.scale.set(1.26,.72,1);herbCavity.rotation.z=-.11;herbShellOpening.add(herbCavity);
        [[-.205,-.008,.068,.132,-.48],[.205,.028,.062,.145,.36],[-.118,.168,.070,.110,-.16],[.045,.194,.058,.096,.12],[.142,.154,.052,.088,.45],[-.238,.105,.048,.083,-.68]].forEach(function(sp,si){
            var shellPiece=new THREE.Mesh(new THREE.SphereGeometry(sp[2],high?20:12,high?12:8),si===2||si===4?herbInnerShellMat:herbOuterShellMat);
            shellPiece.position.set(sp[0],sp[1],.632);shellPiece.scale.set(.88,sp[3]/sp[2],.30);shellPiece.rotation.z=sp[4];shellPiece.castShadow=true;herbShellOpening.add(shellPiece);
        });
        var herbInnerLip=new THREE.Mesh(new THREE.TorusGeometry(.195,.018,high?10:7,high?34:22,Math.PI*1.50),herbInnerShellMat);
        herbInnerLip.position.set(.010,.040,.642);herbInnerLip.scale.set(1.20,.70,1);herbInnerLip.rotation.z=.56;herbShellOpening.add(herbInnerLip);
        // Two irregular crack branches leave the opening; their unequal paths
        // remain localized above and beside the face.
        function addHerbShellCrack(points,radius){
            var curve=new THREE.CatmullRomCurve3(points.map(function(p){return new THREE.Vector3(p[0],p[1],p[2]);}));
            var crack=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(7,points.length*4),radius,5,false),herbCrackMat);
            crack.name='danbo-herb-shell-crack';body.add(crack);herbShellDetails.push(crack);return crack;
        }
        addHerbShellCrack([[-.235,.610,.618],[-.315,.555,.642],[-.282,.500,.650]],.0075);
        addHerbShellCrack([[.145,.640,.615],[.220,.600,.640],[.205,.548,.650]],.0065);
        addHerbShellCrack([[-.304,.550,.638],[-.370,.535,.630],[-.405,.498,.615]],.0055);
        // Root collar and stems emerge from the recess, establishing a direct
        // structural connection between living plant and shell layers.
        var stemM=softPBR(0x356E3E,{roughness:0.88}),rootM=softPBR(0x6F8050,{roughness:.92,clearcoat:0}),leafM=softPBR(0x5AAE60,{roughness:0.80,clearcoat:0.025,envMapIntensity:0.18}),leafLightM=softPBR(0x82C967,{roughness:0.82,envMapIntensity:0.16});
        var rootCollar=new THREE.Mesh(new THREE.TorusGeometry(.105,.014,7,20,Math.PI*1.40),rootM);rootCollar.position.set(-.060,.698,.662);rootCollar.scale.set(1.00,.52,1);rootCollar.rotation.z=.44;body.add(rootCollar);herbShellDetails.push(rootCollar);
        var stem=new THREE.Mesh(new THREE.CylinderGeometry(0.020,0.031,0.25,8),stemM);stem.position.set(-.060,0.777,0.666);stem.rotation.z=-0.12;stem.castShadow=true;body.add(stem);forestLeaves.push(stem);
        [[-0.145,0.840,-0.60,1.28],[0.075,0.862,0.48,1.28],[-0.045,0.948,-0.04,1.10]].forEach(function(lp,li){
            var leaf=new THREE.Mesh(new THREE.SphereGeometry(0.13,high?20:12,high?12:8),li===2?leafLightM:leafM);
            leaf.position.set(lp[0],lp[1],0.665);leaf.scale.set(lp[3],0.38,0.64);leaf.rotation.z=lp[2];leaf.castShadow=true;body.add(leaf);forestLeaves.push(leaf);
        });
        // One small runner follows the shorter right crack rather than spreading
        // decorations evenly over the shell.
        var runnerCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(.10,.710,.662),new THREE.Vector3(.18,.66,.672),new THREE.Vector3(.225,.59,.665)]);
        var runner=new THREE.Mesh(new THREE.TubeGeometry(runnerCurve,10,.010,6,false),stemM);body.add(runner);forestLeaves.push(runner);
        var runnerLeaf=new THREE.Mesh(new THREE.SphereGeometry(.060,high?16:10,high?10:7),leafM);runnerLeaf.position.set(.235,.595,.670);runnerLeaf.scale.set(1.26,.40,.50);runnerLeaf.rotation.z=-.48;body.add(runnerLeaf);forestLeaves.push(runnerLeaf);
        var forestBud=new THREE.Mesh(new THREE.SphereGeometry(0.052,high?18:10,high?12:8),softPBR(0xF3A956,{roughness:0.44,clearcoat:0.10}));
        forestBud.position.set(-0.005,0.935,0.700);forestBud.scale.set(0.82,0.92,0.70);forestBud.castShadow=true;body.add(forestBud);forestLeaves.push(forestBud);
    }else if(type==='spicyFlameTraveler'){
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
    }else if(type==='goldenGrainTraveler'){
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
    var markMat=softPBR(_charMixHex(accent,0xFFFFFF,.16),{pastelAmount:0,roughness:type==='saltCrystalTraveler'?.30:.74,clearcoat:type==='saltCrystalTraveler'?.25:.015,emissive:type==='spicyFlameTraveler'?0x79200F:0x000000,emissiveIntensity:type==='spicyFlameTraveler'?.10:0});
    if(type==='blossomTraveler'){
        [-.22,0,.22].forEach(function(x,mi){var petalMark=new THREE.Mesh(_starShapeGeometry(.052,.025,5),markMat);petalMark.position.set(x,-.38+Math.abs(mi-1)*.035,faceSurface+.048);petalMark.scale.set(1,1.22,1);petalMark.rotation.z=(mi-1)*.24;body.add(petalMark);regionalMarks.push(petalMark);});
    }else if(type==='herbTraveler'){
        addRegionalLine([[0,-.48],[0,-.34],[.01,-.20]],markMat,.009);
        [[-.20,-.43,0,-.34],[.20,-.35,0,-.26],[-.17,-.28,0,-.21]].forEach(function(v){addRegionalLine([[0,v[1]],[v[0],v[3]]],markMat,.008);});
    }else if(type==='saltCrystalTraveler'){
        addRegionalLine([[-.32,-.47],[-.15,-.35],[-.01,-.46],[.18,-.32],[.34,-.44]],markMat,.010);
        addRegionalLine([[-.18,-.30],[-.04,-.21],[.10,-.29]],markMat,.008);
    }else if(type==='cloudwingTraveler'){
        [-1,1].forEach(function(s){var cloudCurl=new THREE.Mesh(new THREE.TorusGeometry(.09,.009,6,18,Math.PI*1.45),markMat);cloudCurl.position.set(s*.17,-.41,faceSurface+.042);cloudCurl.rotation.z=s<0?.55:2.15;body.add(cloudCurl);regionalMarks.push(cloudCurl);});
    }else if(type==='fruitbrewTraveler'){
        var fruitMark=new THREE.Mesh(new THREE.SphereGeometry(.065,high?16:10,high?10:7),markMat);fruitMark.position.set(.12,-.31,faceSurface+.035);fruitMark.scale.set(1,.92,.20);body.add(fruitMark);regionalMarks.push(fruitMark);
        var fruitMarkLeaf=new THREE.Mesh(new THREE.SphereGeometry(.055,high?14:9,high?9:6),softPBR(0x5B8E4D,{roughness:.82}));fruitMarkLeaf.position.set(.18,-.25,faceSurface+.050);fruitMarkLeaf.scale.set(1.18,.38,.20);fruitMarkLeaf.rotation.z=-.55;body.add(fruitMarkLeaf);regionalMarks.push(fruitMarkLeaf);
    }else if(type==='berryTraveler'){
        [-.10,.04,.18].forEach(function(x,mi){var berryMark=new THREE.Mesh(new THREE.SphereGeometry(.046,high?14:9,high?9:6),markMat);berryMark.position.set(x,-.34+Math.abs(mi-1)*.04,faceSurface+.047);berryMark.scale.z=.25;body.add(berryMark);regionalMarks.push(berryMark);});
    }else if(type==='spicyFlameTraveler'){
        addRegionalLine([[-.40,-.40],[-.29,-.31],[-.35,-.20],[-.25,-.11]],markMat,.012);
        addRegionalLine([[.16,-.47],[.29,-.38],[.22,-.27],[.36,-.16]],markMat,.010);
    }else if(type==='goldenGrainTraveler'){
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
    if(type==='blossomTraveler'){
        var mapRoll=new THREE.Group();mapRoll.name='danbo-blossom-map-roll';mapRoll.position.set(.38,-.24,faceSurface-.02);mapRoll.rotation.z=-.24;mapRoll.userData._restZ=mapRoll.rotation.z;mapRoll.userData._phase=.9;
        var roll=new THREE.Mesh(new THREE.CylinderGeometry(.052,.052,.25,10),softPBR(0xF5E0B8,{roughness:.86}));roll.rotation.z=Math.PI/2;mapRoll.add(roll);
        [-1,1].forEach(function(s){var tie=new THREE.Mesh(new THREE.TorusGeometry(.052,.009,5,12),softPBR(accent,{roughness:.70}));tie.position.x=s*.07;tie.rotation.y=Math.PI/2;mapRoll.add(tie);});body.add(mapRoll);travelGear.push(mapRoll);
    }else if(type==='herbTraveler')addTravelerPouch('danbo-herb-sample-pouch',-.39,-.25,0x7A6847,'round');
    else if(type==='saltCrystalTraveler'){
        var compass=new THREE.Group();compass.name='danbo-salt-crystal-compass';compass.position.set(-.31,-.25,faceSurface+.015);compass.userData._restZ=.05;compass.userData._phase=1.2;
        var compassCase=new THREE.Mesh(new THREE.CylinderGeometry(.085,.085,.028,20),softPBR(0xB98B70,{roughness:.42,metalness:.16}));compassCase.rotation.x=Math.PI/2;compass.add(compassCase);
        var needle=new THREE.Mesh(new THREE.ConeGeometry(.018,.10,4),softPBR(accent,{roughness:.40}));needle.position.z=.025;compass.add(needle);body.add(compass);travelGear.push(compass);
    }else if(type==='fruitbrewTraveler')addTravelerPouch('danbo-fruitbrew-field-pouch',-.41,-.23,0x9C6750,'round');
    else if(type==='berryTraveler')addTravelerPouch('danbo-berry-gathering-pouch',.42,-.24,0x6B4B70,'box');
    else if(type==='spicyFlameTraveler')addTravelerPouch('danbo-spicy-flame-spice-pouch',-.42,-.23,0x633B35,'round');

    var lidMat=softPBR(_charMixHex(color,0xFFE9F4,0.30),{roughness:0.42}),blinkLids=[];
    [-1,1].forEach(function(s){var lid=new THREE.Mesh(new THREE.CircleGeometry(0.145,24),lidMat);lid.position.set(s*faceProfile.spacing,faceProfile.eyeLevel+(s>0?(faceProfile.asym||0):0),faceSurface+.058);lid.scale.set(faceProfile.eyeX/.62,.08,1);lid.visible=false;body.add(lid);blinkLids.push(lid);});g.userData._blinkLids=blinkLids;

    var fistMat=softPBR(0xFFFFFF,type==='blossomTraveler'?{roughness:0.72,clearcoat:0.03,envMapIntensity:0.22}:{roughness:0.35});
    var rightArm=makeRegionalHand(type,.235,fistMat),leftArm=makeRegionalHand(type,.235,fistMat);
    rightArm.name='danbo-combat-hand-right';leftArm.name='danbo-combat-hand-left';
    rightArm.position.set(0.4,0.2,0.7);leftArm.position.set(-0.4,0.2,0.7);rightArm.visible=leftArm.visible=false;body.add(rightArm);body.add(leftArm);
    var legMat=softPBR(accent,type==='blossomTraveler'?{roughness:0.68,clearcoat:0.04,envMapIntensity:0.25}:{roughness:0.38});
    var legLength={blossomTraveler:.828,herbTraveler:.76,saltCrystalTraveler:.72,cloudwingTraveler:.82,fruitbrewTraveler:.70,berryTraveler:.66,spicyFlameTraveler:.78,goldenGrainTraveler:.80}[type]||.72;
    var rightLeg=new THREE.Mesh(new THREE.CylinderGeometry(0.10,0.14,legLength,10),legMat),leftLeg=new THREE.Mesh(new THREE.CylinderGeometry(0.10,0.14,legLength,10),legMat);
    rightLeg.position.set(0.24,0.12,0.52);leftLeg.position.set(-0.24,0.12,0.52);rightLeg.rotation.x=leftLeg.rotation.x=-Math.PI/3;rightLeg.visible=leftLeg.visible=false;g.add(rightLeg);g.add(leftLeg);

    g.userData.body=body;g.userData.feet=feet;g.userData._travelerId=type;
    g.userData._cloudwingDetails=cloudwingDetails;g.userData._saltCrystalSparkles=saltCrystalSparkles;g.userData._saltCrystalEars=saltCrystalEars;
    g.userData._spiceDetails=spiceDetails;g.userData._spiceSurfaceMarks=spiceSurfaceMarks;
    g.userData._fruitbrewDetails=fruitbrewDetails;g.userData._flowerDetails=flowerDetails;g.userData._forestLeaves=forestLeaves;g.userData._herbShellDetails=herbShellDetails;g.userData._berryDetails=berryDetails;g.userData._goldenGrainDetails=goldenGrainDetails;
    g.userData._regionalMarks=regionalMarks;g.userData._travelGear=travelGear;
    g.userData._eyeWhites=_eyeWhites;g.userData._pupils=_pupils;g.userData._shines=_shines;g.userData._eyeBaseScales=_eyeBaseScales;g.userData._pupilBasePositions=_pupilBasePositions;g.userData._shineBasePositions=_shineBasePositions;g.userData._smile=smile;g.userData._eyeY=faceProfile.eyeLevel;
    g.userData._travelerProfile=profile;g.userData._bodyBaseY=body.position.y;
    g.userData.rightArm=rightArm;g.userData.leftArm=leftArm;g.userData.rightLeg=rightLeg;g.userData.leftLeg=leftLeg;
    return g;
}

function createEggMesh(color, accent, travelerId) {
    // Both character selection and gameplay use the same traveler mesh factory.
    // Character identity comes from regional silhouettes, travel gear and natural
    // materials rather than one-to-one mappings to commercial fighting characters.
    return _createCuteRoundCharacterMesh(color,accent,travelerId);
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

function createEgg(x,z,color,accent,isPlayer,targetScene,travelerId){
    const mesh=createEggMesh(color,accent,travelerId);
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
