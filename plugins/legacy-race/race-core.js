// race-core.js — Legacy race runtime loaded by plugins/legacy-race
// Source moved from js/race.js so race minigames live under plugins/.
// race.js — DANBO World
// ============================================================
//  RACE TRACK SYSTEM
// ============================================================
// Reuse the shared minigame container when the platformer was opened first.
var raceGroup = window.raceGroup;
if(!raceGroup){raceGroup=new THREE.Group();window.raceGroup=raceGroup;scene.add(raceGroup);}
raceGroup.visible = false;
const obstacleObjects = [];
const raceCoins = [];
const TRACK_W = (window.DANBO_MINIGAME_WASM&&DANBO_MINIGAME_WASM.race)?DANBO_MINIGAME_WASM.race.trackWidth():RACE_CONFIG.trackWidth;
let trackSegments = [];

function clearRace() {
    while(raceGroup.children.length){
        const c=raceGroup.children[0]; raceGroup.remove(c);
        c.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose();}});
    }
    obstacleObjects.length=0;
    for(var rc of raceCoins) raceGroup.remove(rc.mesh);
    raceCoins.length=0;
    // Remove race eggs
    for(const e of allEggs) if(!e.cityNPC) scene.remove(e.mesh);
    const keep=allEggs.filter(e=>e.cityNPC);
    allEggs.length=0; allEggs.push(...keep);
    playerEgg=null;
    _jumpCharging=false;_jumpCharge=0;if(_jumpChargeBar){scene.remove(_jumpChargeBar);_jumpChargeBar=null;}
    if(_sprintBar){scene.remove(_sprintBar);_sprintBar=null;}_sprintCharge=0;_ascendSmoke=false;
}

function getSegAt(z){for(var s of trackSegments)if(z>=s.startZ&&z<s.endZ)return s;return trackSegments[trackSegments.length-1];}
function getHW(z){const s=getSegAt(z);return s?s.width:TRACK_W;}
function getFloorY(z,x){
    const s=getSegAt(z);
    if(!s) return 0;
    var rw=window.DANBO_MINIGAME_WASM&&DANBO_MINIGAME_WASM.race;
    if(rw&&typeof rw.floorY==='function')return rw.floorY(s,z);
    if(s.type==='platforms') return -100; // no floor — must land on moving platforms
    if(s.type==='ramp'){const t=(z-s.startZ)/(s.endZ-s.startZ);return s.startY+t*(s.endY-s.startY);}
    return s.floorY||0;
}

const FLOOR_THEMES=RACE_CONFIG.floorThemes;

function buildRaceTrack(ri){
    clearRace();
    const segs=[]; let cz=0, curY=0;
    // Track 4 keeps its countryside identity without the saturated green-speedway
    // palette that made the old boost/spring/collectible combination read as a
    // familiar commercial game. Other tracks keep their established palettes.
    const theme=ri===4?[0x9FAF82,0xB9A77A]:FLOOR_THEMES[ri%FLOOR_THEMES.length];
    function add(len,type,o={}){
        const seg={startZ:cz,endZ:cz+len,type,width:o.width||TRACK_W,floorY:curY,startY:curY,endY:curY,...o};
        if(type==='ramp'){seg.startY=curY;seg.endY=o.endY!==undefined?o.endY:curY;curY=seg.endY;}
        segs.push(seg); cz+=len;
    }

    if(ri===0){
        add(22,'flat');add(20,'spinners',{count:3});add(8,'flat');
        add(12,'ramp',{endY:3});add(16,'platforms',{count:4});add(12,'ramp',{endY:0});
        add(18,'hammers',{count:3});add(10,'flat');
        add(14,'conveyor',{count:3});add(8,'flat');
        add(16,'rollers',{count:2});add(10,'flat');
        add(8,'narrow',{width:5.5});add(16,'bumpers',{count:6});
        add(20,'pendulums',{count:3});add(10,'flat');
        add(14,'fallingBlocks',{count:6});add(12,'flat');
        // Track 0 decorations — Carnival / Crazy Course
        var _d0Z=0;for(var _di=0;_di<segs.length;_di++) _d0Z=Math.max(_d0Z,segs[_di].endZ);
        for(var _ti=0;_ti<15;_ti++){var _tz=_d0Z*(_ti+0.5)/15,_side=(_ti%2===0?-1:1);
            // Carnival tent triangles (colored cones along sides)
            var _tentC=[0xFF4444,0x44FF44,0x4444FF,0xFFFF00,0xFF44FF][_ti%5];
            var _tent=new THREE.Mesh(new THREE.ConeGeometry(1.5,3,4),toon(_tentC,{transparent:true,opacity:0.7}));
            _tent.position.set(_side*(TRACK_W+4),2,-_tz); raceGroup.add(_tent);
        }
        for(var _li=0;_li<10;_li++){var _lz=_d0Z*(_li+0.5)/10;
            // Spinning disco lights (emissive spheres)
            var _dcol=[0xFF00FF,0x00FFFF,0xFFFF00,0xFF8800,0x00FF88][_li%5];
            var _disco=new THREE.Mesh(new THREE.SphereGeometry(0.4,8,6),toon(_dcol,{emissive:_dcol,emissiveIntensity:0.8}));
            _disco.position.set((_li%2===0?-1:1)*(TRACK_W+2),5,-_lz); raceGroup.add(_disco);
        }
    } else if(ri===1){
        add(18,'flat');add(22,'spinners',{count:4});add(6,'flat');
        add(14,'ramp',{endY:4});add(20,'platforms',{count:6});add(14,'ramp',{endY:0});
        add(22,'hammers',{count:5});add(8,'flat');
        add(18,'conveyor',{count:5});add(6,'flat');
        add(20,'pendulums',{count:4});add(8,'flat');
        add(10,'narrow',{width:5});add(20,'bumpers',{count:10});
        add(18,'rollers',{count:3});add(8,'flat');
        add(16,'fallingBlocks',{count:8});add(10,'flat');
        // Track 1 decorations — Hammer Storm / Anvils & Sparks
        var _d1Z=0;for(var _di=0;_di<segs.length;_di++) _d1Z=Math.max(_d1Z,segs[_di].endZ);
        for(var _ai=0;_ai<12;_ai++){var _az=_d1Z*(_ai+0.5)/12,_as=(_ai%2===0?-1:1);
            // Anvil decorations (dark box + trapezoid top)
            var _anvBase=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.6,1.2),toon(0x444444));
            _anvBase.position.set(_as*(TRACK_W+4),0.3,-_az); raceGroup.add(_anvBase);
            var _anvTop=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.4,1.4),toon(0x555555));
            _anvTop.position.set(_as*(TRACK_W+4),0.8,-_az); raceGroup.add(_anvTop);
        }
        for(var _si=0;_si<16;_si++){var _sz=_d1Z*Math.random();
            // Sparks (small yellow emissive spheres)
            var _spark=new THREE.Mesh(new THREE.SphereGeometry(0.15,4,4),toon(0xFFDD00,{emissive:0xFFAA00,emissiveIntensity:0.9}));
            _spark.position.set((Math.random()-0.5)*(TRACK_W+6)*2,0.5+Math.random()*3,-_sz); raceGroup.add(_spark);
        }
        for(var _gi=0;_gi<6;_gi++){var _gz=_d1Z*(_gi+0.5)/6,_gs=(_gi%2===0?-1:1);
            // Iron girder frames (box outlines)
            var _gird=new THREE.Mesh(new THREE.BoxGeometry(0.2,4,0.2),toon(0x777777));
            _gird.position.set(_gs*(TRACK_W+6),2,-_gz); raceGroup.add(_gird);
            var _gTop=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.2,4),toon(0x777777));
            _gTop.position.set(_gs*(TRACK_W+6),4,-_gz); raceGroup.add(_gTop);
        }
    } else if(ri===2){
        add(14,'flat');add(24,'spinners',{count:5});add(6,'flat');
        add(16,'ramp',{endY:5});add(24,'platforms',{count:8});add(16,'ramp',{endY:0});
        add(24,'hammers',{count:6});add(6,'flat');
        add(20,'conveyor',{count:6});add(6,'flat');
        add(22,'pendulums',{count:5});add(6,'flat');
        add(8,'narrow',{width:4.5});add(22,'bumpers',{count:12});
        add(20,'rollers',{count:4});add(6,'flat');
        add(20,'fallingBlocks',{count:10});add(10,'flat');
        // Track 2 decorations — Extreme / Warning signs & danger tape
        var _d2Z=0;for(var _di=0;_di<segs.length;_di++) _d2Z=Math.max(_d2Z,segs[_di].endZ);
        for(var _wi=0;_wi<12;_wi++){var _wz=_d2Z*(_wi+0.5)/12,_ws=(_wi%2===0?-1:1);
            // Warning signs (yellow+black striped planes)
            var _sign=new THREE.Mesh(new THREE.PlaneGeometry(2,2),toon(0xFFCC00,{side:THREE.DoubleSide}));
            _sign.position.set(_ws*(TRACK_W+4),2.5,-_wz); _sign.rotation.y=_ws>0?-Math.PI/6:Math.PI/6; raceGroup.add(_sign);
            var _stripe=new THREE.Mesh(new THREE.PlaneGeometry(2,0.4),toon(0x222222,{side:THREE.DoubleSide}));
            _stripe.position.set(_ws*(TRACK_W+4),2.5,-_wz+0.01); _stripe.rotation.y=_ws>0?-Math.PI/6:Math.PI/6; raceGroup.add(_stripe);
        }
        for(var _ri2=0;_ri2<10;_ri2++){var _rz=_d2Z*(_ri2+0.5)/10;
            // Flashing red lights
            var _rLight=new THREE.Mesh(new THREE.SphereGeometry(0.35,6,6),toon(0xFF0000,{emissive:0xFF0000,emissiveIntensity:0.7}));
            _rLight.position.set((_ri2%2===0?-1:1)*(TRACK_W+3),4,-_rz); raceGroup.add(_rLight);
        }
        for(var _dti=0;_dti<8;_dti++){var _dtz=_d2Z*(_dti+0.5)/8,_dts=(_dti%2===0?-1:1);
            // Danger tape (stretched yellow+black boxes)
            var _tape=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.3,6),toon(0xFFDD00));
            _tape.position.set(_dts*(TRACK_W+2),1,-_dtz); raceGroup.add(_tape);
            var _tapeB=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.32,1),toon(0x222222));
            _tapeB.position.set(_dts*(TRACK_W+2),1,-_dtz); raceGroup.add(_tapeB);
        }
    } else if(ri===3){
        add(12,'flat');add(26,'spinners',{count:6});add(4,'flat');
        add(18,'ramp',{endY:6});add(28,'platforms',{count:10});add(18,'ramp',{endY:0});
        add(26,'hammers',{count:7});add(4,'flat');
        add(22,'conveyor',{count:7});add(4,'flat');
        add(24,'pendulums',{count:6});add(4,'flat');
        add(6,'narrow',{width:4});add(24,'bumpers',{count:14});
        add(22,'rollers',{count:5});add(4,'flat');
        add(22,'fallingBlocks',{count:12});add(10,'flat');
        // Track 3 decorations — Champion's Road / Trophies & golden arches
        var _d3Z=0;for(var _di=0;_di<segs.length;_di++) _d3Z=Math.max(_d3Z,segs[_di].endZ);
        // Red carpet strip on ground
        var _carpet=new THREE.Mesh(new THREE.BoxGeometry(4,0.06,_d3Z),toon(0xCC0000));
        _carpet.position.set(0,0.04,-_d3Z/2); raceGroup.add(_carpet);
        for(var _tri=0;_tri<10;_tri++){var _trz=_d3Z*(_tri+0.5)/10,_trs=(_tri%2===0?-1:1);
            // Trophy decorations (gold cylinder pedestal + sphere on top)
            var _ped=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.7,1.5,8),toon(0xFFD700));
            _ped.position.set(_trs*(TRACK_W+4),0.75,-_trz); raceGroup.add(_ped);
            var _cup=new THREE.Mesh(new THREE.CylinderGeometry(0.6,0.3,1,8),toon(0xFFD700,{emissive:0xFFAA00,emissiveIntensity:0.3}));
            _cup.position.set(_trs*(TRACK_W+4),2,-_trz); raceGroup.add(_cup);
            var _ball=new THREE.Mesh(new THREE.SphereGeometry(0.3,8,6),toon(0xFFD700,{emissive:0xFFDD00,emissiveIntensity:0.4}));
            _ball.position.set(_trs*(TRACK_W+4),2.8,-_trz); raceGroup.add(_ball);
        }
        for(var _arci=0;_arci<5;_arci++){var _arcz=_d3Z*(_arci+0.5)/5;
            // Golden arches over track
            var _garch=new THREE.Mesh(new THREE.TorusGeometry(6,0.3,8,16,Math.PI),toon(0xFFD700,{emissive:0xFFAA00,emissiveIntensity:0.2}));
            _garch.position.set(0,0,-_arcz); _garch.rotation.y=Math.PI/2; raceGroup.add(_garch);
        }
    } else if(ri===4){
        // Verdant Breeze Hills — muted countryside route with travel finds and wind-grown launchers
        add(20,'flat');add(12,'coins',{count:20});
        add(10,'boost');add(15,'flat');add(8,'ramp',{endY:3});
        add(12,'coins',{count:15});add(10,'springs',{count:4});
        add(12,'ramp',{endY:0});add(8,'flat');
        add(20,'bumpers',{count:8});add(10,'coins',{count:12});
        add(10,'boost');add(12,'flat');
        add(14,'ramp',{endY:4});add(18,'platforms',{count:6});add(14,'ramp',{endY:0});
        add(10,'coins',{count:18});add(8,'springs',{count:3});
        add(16,'spinners',{count:2});add(10,'flat');
        add(12,'coins',{count:20});add(10,'boost');
        add(10,'discoveryCrates',{count:3});add(12,'flat');
        // Track 4 decorations — muted meadow terraces, flowers and paired trail trees
        var _d4Z=0;for(var _di=0;_di<segs.length;_di++) _d4Z=Math.max(_d4Z,segs[_di].endZ);
        for(var _fi=0;_fi<14;_fi++){var _fz=_d4Z*(_fi+0.5)/14,_fs=(_fi%2===0?-1:1);
            // Flower patches (colored small spheres in clusters)
            var _flcols=[0xFF6688,0xFFAACC,0xFF44AA,0xFFDD44,0xFFFFFF];
            for(var _fp=0;_fp<4;_fp++){
                var _flower=new THREE.Mesh(new THREE.SphereGeometry(0.25,6,4),toon(_flcols[(_fi+_fp)%5]));
                _flower.position.set(_fs*(TRACK_W+3+_fp*0.7),0.25,-_fz+_fp*0.5); raceGroup.add(_flower);
            }
            // Green stem
            var _stem=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.5,4),toon(0x33AA33));
            _stem.position.set(_fs*(TRACK_W+4),0.25,-_fz); raceGroup.add(_stem);
        }
        for(var _li=0;_li<5;_li++){var _lz=_d4Z*(_li+0.5)/5;
            // Paired hillside trees form an open travel landmark without a racing loop silhouette.
            for(var _side=-1;_side<=1;_side+=2){
                var _trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.62,4.2,7),toon(0x71513B));
                _trunk.position.set(_side*(TRACK_W+3.6),2.1,-_lz);_trunk.rotation.z=_side*0.08;raceGroup.add(_trunk);
                for(var _ci=0;_ci<3;_ci++){
                    var _crown=new THREE.Mesh(new THREE.IcosahedronGeometry(1.35-0.12*_ci,1),toon([0x5FAE62,0x79C86D,0xA2D77A][_ci]));
                    _crown.scale.set(1.15,0.78,0.9);_crown.position.set(_side*(TRACK_W+3.6)+(_ci-1)*0.55,4.25+(_ci%2)*0.35,-_lz+(_ci-1)*0.45);raceGroup.add(_crown);
                }
            }
        }
    } else if(ri===5){
        // Flame Valley — boosts and conveyors, fast paced
        add(16,'flat');add(10,'boost');add(8,'coins',{count:10});
        add(14,'ramp',{endY:5});add(10,'coins',{count:12});add(14,'ramp',{endY:0});
        add(20,'conveyor',{count:6});add(6,'flat');
        add(10,'boost');add(12,'coins',{count:15});
        add(18,'spinners',{count:4});add(6,'flat');
        add(10,'springs',{count:5});add(8,'flat');
        add(16,'rollers',{count:3});add(10,'coins',{count:18});
        add(10,'boost');add(14,'flat');
        add(20,'hammers',{count:4});add(8,'coins',{count:10});
        add(12,'fallingBlocks',{count:6});add(10,'flat');
        // Track 5 decorations — Flame Valley / Lava streams, fire particles, volcanic rocks
        var _d5Z=0;for(var _di=0;_di<segs.length;_di++) _d5Z=Math.max(_d5Z,segs[_di].endZ);
        for(var _lvi=0;_lvi<2;_lvi++){var _lvs=(_lvi===0?-1:1);
            // Lava streams alongside track (orange+red glowing planes)
            var _lava=new THREE.Mesh(new THREE.BoxGeometry(3,0.1,_d5Z),toon(0xFF4400,{emissive:0xFF2200,emissiveIntensity:0.6}));
            _lava.position.set(_lvs*(TRACK_W+3),0.05,-_d5Z/2); raceGroup.add(_lava);
            var _lava2=new THREE.Mesh(new THREE.BoxGeometry(2,0.12,_d5Z),toon(0xFF6600,{emissive:0xFF4400,emissiveIntensity:0.8}));
            _lava2.position.set(_lvs*(TRACK_W+3.5),0.07,-_d5Z/2); raceGroup.add(_lava2);
        }
        for(var _fpi=0;_fpi<18;_fpi++){var _fpz=_d5Z*Math.random();
            // Fire particle meshes (small orange emissive spheres above lava)
            var _fcol=[0xFF6600,0xFF4400,0xFFAA00,0xFF8800][_fpi%4];
            var _fire=new THREE.Mesh(new THREE.SphereGeometry(0.2,4,4),toon(_fcol,{emissive:_fcol,emissiveIntensity:0.9}));
            _fire.position.set((_fpi%2===0?-1:1)*(TRACK_W+2+Math.random()*3),0.5+Math.random()*2,-_fpz); raceGroup.add(_fire);
        }
        for(var _vri=0;_vri<8;_vri++){var _vrz=_d5Z*(_vri+0.5)/8,_vrs=(_vri%2===0?-1:1);
            // Volcanic rock formations (dark irregular boxes/spheres)
            var _rock=new THREE.Mesh(new THREE.SphereGeometry(0.8+Math.random()*0.6,6,5),toon(0x333333));
            _rock.position.set(_vrs*(TRACK_W+5+Math.random()*2),0.6,-_vrz); raceGroup.add(_rock);
            var _rock2=new THREE.Mesh(new THREE.BoxGeometry(0.8,1.2,0.8),toon(0x2A2A2A));
            _rock2.position.set(_vrs*(TRACK_W+6),0.6,-_vrz+1); raceGroup.add(_rock2);
        }
    } else if(ri===6){
        // Ice Slide — wide track, springs, lots of coins
        add(20,'flat',{width:14});add(12,'coins',{count:25});
        add(10,'boost');add(10,'springs',{count:6});
        add(16,'ramp',{endY:3});add(12,'coins',{count:15});add(16,'ramp',{endY:0});
        add(14,'flat',{width:14});add(10,'boost');
        add(20,'bumpers',{count:10});add(10,'coins',{count:20});
        add(12,'springs',{count:4});add(8,'flat');
        add(18,'platforms',{count:8});add(10,'coins',{count:15});
        add(14,'ramp',{endY:4});add(10,'boost');add(14,'ramp',{endY:0});
        add(16,'pendulums',{count:3});add(12,'coins',{count:20});add(10,'flat');
        // Track 6 decorations — Ice Slide / Icicles, crystals, snow mounds
        var _d6Z=0;for(var _di=0;_di<segs.length;_di++) _d6Z=Math.max(_d6Z,segs[_di].endZ);
        for(var _ici=0;_ici<14;_ici++){var _icz=_d6Z*(_ici+0.5)/14,_ics=(_ici%2===0?-1:1);
            // Icicle decorations hanging from above (thin inverted cones)
            var _icicle=new THREE.Mesh(new THREE.ConeGeometry(0.2,2+Math.random(),5),toon(0xAADDFF,{transparent:true,opacity:0.7}));
            _icicle.rotation.x=Math.PI; _icicle.position.set(_ics*(TRACK_W+2+Math.random()*3),6+Math.random()*2,-_icz); raceGroup.add(_icicle);
        }
        for(var _ci=0;_ci<8;_ci++){var _cz=_d6Z*(_ci+0.5)/8,_cs=(_ci%2===0?-1:1);
            // Frozen crystal formations (transparent blue boxes)
            var _cryst=new THREE.Mesh(new THREE.BoxGeometry(0.6,1.5+Math.random(),0.6),toon(0x88CCFF,{transparent:true,opacity:0.5}));
            _cryst.rotation.y=Math.random()*Math.PI; _cryst.position.set(_cs*(TRACK_W+4),0.8,-_cz); raceGroup.add(_cryst);
            var _cryst2=new THREE.Mesh(new THREE.BoxGeometry(0.4,1+Math.random(),0.4),toon(0xAADDFF,{transparent:true,opacity:0.4}));
            _cryst2.rotation.y=Math.random()*Math.PI; _cryst2.position.set(_cs*(TRACK_W+4.5),0.6,-_cz+0.5); raceGroup.add(_cryst2);
        }
        for(var _smi=0;_smi<10;_smi++){var _smz=_d6Z*(_smi+0.5)/10,_sms=(_smi%2===0?-1:1);
            // Snow mounds (white half-spheres along edges)
            var _snow=new THREE.Mesh(new THREE.SphereGeometry(1+Math.random()*0.5,8,4,0,Math.PI*2,0,Math.PI/2),toon(0xFFFFFF));
            _snow.position.set(_sms*(TRACK_W+4),0,-_smz); raceGroup.add(_snow);
        }
    } else if(ri===7){
        // Rainbow Sky — high-altitude journey across irregular sky islets
        add(14,'flat');add(10,'coins',{count:15});add(10,'boost');
        add(16,'ramp',{endY:6});add(24,'platforms',{count:10});
        add(10,'coins',{count:20});add(16,'ramp',{endY:3});
        add(10,'springs',{count:6});add(12,'coins',{count:15});
        add(14,'ramp',{endY:6});add(20,'platforms',{count:8});add(14,'ramp',{endY:0});
        add(10,'boost');add(12,'coins',{count:25});
        add(18,'spinners',{count:3});add(8,'flat');
        add(10,'springs',{count:4});add(10,'coins',{count:20});
        add(16,'pendulums',{count:3});add(10,'boost');
        add(12,'coins',{count:15});add(10,'flat');
        // Track 7 decorations — asymmetric navigation sails and cloud puffs
        var _d7Z=0;for(var _di=0;_di<segs.length;_di++) _d7Z=Math.max(_d7Z,segs[_di].endZ);
        // A staggered set of fabric navigation sails replaces the concentric rainbow gate.
        var _sailCols=[0x4F8FA0,0xD57A68,0xE0B96F,0x7888B5];
        for(var _rbi=0;_rbi<5;_rbi++){
            var _sailSide=_rbi%2===0?-1:1;
            var _sailZ=_d7Z*(0.40+_rbi*0.045);
            var _sailPole=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.09,4.0+(_rbi%2)*0.8,6),toon(0x77634F));
            _sailPole.position.set(_sailSide*(2.1+_rbi*0.72),2.0+(_rbi%2)*0.4,-_sailZ);raceGroup.add(_sailPole);
            var _sail=new THREE.Mesh(new THREE.ConeGeometry(0.72,1.65,3),toon(_sailCols[_rbi%_sailCols.length],{side:THREE.DoubleSide}));
            _sail.scale.set(1.0,1.0,0.28);_sail.rotation.z=_sailSide*(0.18+_rbi*0.035);
            _sail.position.set(_sailPole.position.x+_sailSide*0.62,3.15+(_rbi%2)*0.55,-_sailZ);raceGroup.add(_sail);
        }
        for(var _sti=0;_sti<12;_sti++){var _stz=_d7Z*(_sti+0.45)/12;
            // Small cool-white route motes avoid a gold collectible trail silhouette.
            var _star=new THREE.Mesh(new THREE.OctahedronGeometry(0.20+(_sti%3)*0.035,0),toon(_sti%2?0xB9DDE2:0xE7E1D4,{emissive:0x718FA0,emissiveIntensity:0.24}));
            _star.position.set((_sti%2===0?-1:1)*(TRACK_W+2.5+(_sti%3)*0.7),4.2+(_sti%4)*0.65,-_stz); raceGroup.add(_star);
        }
        for(var _cli=0;_cli<12;_cli++){var _clz=_d7Z*(_cli+0.5)/12,_cls=(_cli%2===0?-1:1);
            // Cloud puffs along edges (white spheres clustered)
            for(var _cp=0;_cp<3;_cp++){
                var _cloud=new THREE.Mesh(new THREE.SphereGeometry(1+Math.random()*0.5,8,6),toon(0xFFFFFF,{transparent:true,opacity:0.6}));
                _cloud.position.set(_cls*(TRACK_W+4+_cp*1.2),3+Math.random()*2,-_clz+_cp*0.8); raceGroup.add(_cloud);
            }
        }
    } else if(ri===8){
        // Moss-Shade Trail — forest stump obstacles and woodland challenges
        add(20,'flat');add(14,'waystones',{count:4});add(8,'flat');
        add(10,'coins',{count:12});add(12,'forestCritters',{count:5});
        add(8,'flat');add(12,'ramp',{endY:3});
        add(16,'platforms',{count:5});add(12,'ramp',{endY:0});
        add(10,'waystones',{count:3});add(8,'coins',{count:10});
        add(14,'forestCritters',{count:6});add(8,'flat');
        add(10,'boost');add(12,'coins',{count:15});
        add(16,'spinners',{count:2});add(8,'flat');
        add(10,'waystones',{count:5});add(12,'forestCritters',{count:4});
        add(10,'discoveryCrates',{count:5});
        add(10,'coins',{count:18});add(10,'flat');
        // Track 8 decorations — Moss-Shade Trail / woodland growth, trail markers, and low walls
        var _d8Z=0;for(var _di=0;_di<segs.length;_di++) _d8Z=Math.max(_d8Z,segs[_di].endZ);
        for(var _mi=0;_mi<10;_mi++){var _mz=_d8Z*(_mi+0.5)/10,_ms=(_mi%2===0?-1:1);
            // Fern-and-stone clusters create a woodland silhouette without mascot-like fungi.
            var _fernBaseX=_ms*(TRACK_W+5);
            var _mStone=new THREE.Mesh(new THREE.DodecahedronGeometry(0.72+(_mi%3)*0.12,0),toon(0x727966));
            _mStone.scale.set(1.15,0.72,0.9);_mStone.position.set(_fernBaseX,0.58,-_mz);raceGroup.add(_mStone);
            for(var _leaf=0;_leaf<4;_leaf++){
                var _frond=new THREE.Mesh(new THREE.CapsuleGeometry(0.14,1.25,3,6),toon([0x507A46,0x639253,0x7AAA62][_leaf%3]));
                _frond.scale.set(1,1,0.38);_frond.position.set(_fernBaseX+(_leaf-1.5)*0.32,1.15+(_leaf%2)*0.2,-_mz+(_leaf%2?0.2:-0.15));_frond.rotation.z=(_leaf-1.5)*0.24;raceGroup.add(_frond);
            }
        }
        for(var _qi=0;_qi<8;_qi++){var _qz=_d8Z*(_qi+0.5)/8,_qs=(_qi%2===0?-1:1);
            // Wooden trail cache with a leaf emblem.
            var _cache=new THREE.Mesh(new THREE.BoxGeometry(1.35,1.0,1.15),toon(0x98704D));
            _cache.position.set(_qs*(TRACK_W+3),1.0,-_qz);raceGroup.add(_cache);
            var _cacheBand=new THREE.Mesh(new THREE.BoxGeometry(1.42,0.13,1.2),toon(0x5F7D57));
            _cacheBand.position.set(_qs*(TRACK_W+3),1.05,-_qz);raceGroup.add(_cacheBand);
            var _cacheLeaf=new THREE.Mesh(new THREE.CircleGeometry(0.28,7),toon(0xBBD783,{side:THREE.DoubleSide,}));
            _cacheLeaf.scale.set(0.68,1,1);_cacheLeaf.position.set(_qs*(TRACK_W+3),1.05,-_qz+0.581);_cacheLeaf.rotation.z=0.48;raceGroup.add(_cacheLeaf);
        }
        for(var _bi=0;_bi<6;_bi++){var _bz=_d8Z*(_bi+0.5)/6,_bs=(_bi%2===0?-1:1);
            // Brick pattern on walls (brown boxes stacked)
            for(var _br=0;_br<3;_br++){
                var _brick=new THREE.Mesh(new THREE.BoxGeometry(1.8,0.6,0.6),toon(0xAA5533));
                _brick.position.set(_bs*(TRACK_W+2.5),0.3+_br*0.65,-_bz+(_br%2)*0.4); raceGroup.add(_brick);
            }
        }
    } else if(ri===9){
        // Magma route — conveyors, falling blocks, waystones, fast pace
        add(16,'flat');add(10,'waystones',{count:3});
        add(14,'ramp',{endY:4});add(10,'forestCritters',{count:4});add(14,'ramp',{endY:0});
        add(18,'conveyor',{count:5});add(6,'flat');
        add(12,'waystones',{count:6});add(10,'coins',{count:12});
        add(16,'fallingBlocks',{count:8});add(6,'flat');
        add(10,'boost');add(12,'forestCritters',{count:6});
        add(8,'coins',{count:15});add(10,'waystones',{count:4});
        add(14,'hammers',{count:4});add(8,'flat');
        add(10,'springs',{count:4});add(12,'coins',{count:20});
        add(10,'forestCritters',{count:5});add(10,'flat');
        // Track 9 decorations — magma fortress walls, warm lamps and suspended links
        var _d9Z=0;for(var _di=0;_di<segs.length;_di++) _d9Z=Math.max(_d9Z,segs[_di].endZ);
        for(var _cwi=0;_cwi<10;_cwi++){var _cwz=_d9Z*(_cwi+0.5)/10,_cws=(_cwi%2===0?-1:1);
            // Castle wall segments along edges (gray crenellated boxes)
            var _wall=new THREE.Mesh(new THREE.BoxGeometry(1.5,3,3),toon(0x888888));
            _wall.position.set(_cws*(TRACK_W+4),1.5,-_cwz); raceGroup.add(_wall);
            // Crenellation on top
            for(var _cr=0;_cr<2;_cr++){
                var _cren=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.8,0.6),toon(0x888888));
                _cren.position.set(_cws*(TRACK_W+4)+(_cr-0.5)*0.8,3.4,-_cwz+(_cr-0.5)*1); raceGroup.add(_cren);
            }
        }
        for(var _tci=0;_tci<12;_tci++){var _tcz=_d9Z*(_tci+0.5)/12,_tcs=(_tci%2===0?-1:1);
            // Torch brackets (orange emissive on walls)
            var _torch=new THREE.Mesh(new THREE.SphereGeometry(0.3,6,4),toon(0xFF6600,{emissive:0xFF4400,emissiveIntensity:0.8}));
            _torch.position.set(_tcs*(TRACK_W+3.2),2.5,-_tcz); raceGroup.add(_torch);
            var _bracket=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,0.6,4),toon(0x555555));
            _bracket.rotation.z=Math.PI/2*_tcs; _bracket.position.set(_tcs*(TRACK_W+3.5),2.2,-_tcz); raceGroup.add(_bracket);
        }
        for(var _chi=0;_chi<8;_chi++){var _chz=_d9Z*(_chi+0.5)/8;
            // Chains hanging from above (gray cylinder links)
            for(var _cl=0;_cl<4;_cl++){
                var _link=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,0.5,4),toon(0x777777));
                _link.position.set((_chi%2===0?-1:1)*(TRACK_W+2),6-_cl*0.6,-_chz);
                _link.rotation.z=_cl%2===0?0:Math.PI/4; raceGroup.add(_link);
            }
        }
    } else if(ri===10){
        // Cloud Heaven — lots of platforms, springs, coins
        add(18,'flat',{width:14});add(10,'coins',{count:20});
        add(10,'springs',{count:5});add(8,'flat');
        add(16,'ramp',{endY:5});add(20,'platforms',{count:8});
        add(10,'coins',{count:15});add(16,'ramp',{endY:2});
        add(10,'waystones',{count:3});add(12,'forestCritters',{count:4});
        add(10,'boost');add(8,'flat');
        add(14,'ramp',{endY:6});add(22,'platforms',{count:10});add(14,'ramp',{endY:0});
        add(10,'springs',{count:6});add(12,'coins',{count:25});
        add(10,'discoveryCrates',{count:4});
        add(10,'waystones',{count:4});add(10,'coins',{count:15});add(10,'flat');
        // Track 10 decorations — Cloud Heaven / Angel statues, harps, sun beams
        var _d10Z=0;for(var _di=0;_di<segs.length;_di++) _d10Z=Math.max(_d10Z,segs[_di].endZ);
        for(var _agi=0;_agi<8;_agi++){var _agz=_d10Z*(_agi+0.5)/8,_ags=(_agi%2===0?-1:1);
            // Angel statue decorations (white sphere head + cone body + wings)
            var _abody=new THREE.Mesh(new THREE.ConeGeometry(0.7,2,8),toon(0xFFFFFF));
            _abody.position.set(_ags*(TRACK_W+5),1,-_agz); raceGroup.add(_abody);
            var _ahead=new THREE.Mesh(new THREE.SphereGeometry(0.4,8,6),toon(0xFFEEDD));
            _ahead.position.set(_ags*(TRACK_W+5),2.3,-_agz); raceGroup.add(_ahead);
            // Halo
            var _halo=new THREE.Mesh(new THREE.TorusGeometry(0.35,0.05,6,12),toon(0xFFDD00,{emissive:0xFFCC00,emissiveIntensity:0.6}));
            _halo.position.set(_ags*(TRACK_W+5),2.8,-_agz); _halo.rotation.x=Math.PI/2; raceGroup.add(_halo);
        }
        for(var _hi=0;_hi<6;_hi++){var _hz=_d10Z*(_hi+0.5)/6,_hs=(_hi%2===0?-1:1);
            // Harp shapes (gold torus + cylinder)
            var _hFrame=new THREE.Mesh(new THREE.TorusGeometry(1,0.08,6,12,Math.PI),toon(0xFFD700));
            _hFrame.position.set(_hs*(TRACK_W+3),3,-_hz); raceGroup.add(_hFrame);
            var _hBase=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,2,4),toon(0xFFD700));
            _hBase.position.set(_hs*(TRACK_W+3),2,-_hz); raceGroup.add(_hBase);
        }
        for(var _sbi=0;_sbi<6;_sbi++){var _sbz=_d10Z*(_sbi+0.5)/6;
            // Sun beams (transparent yellow planes angled down)
            var _beam=new THREE.Mesh(new THREE.PlaneGeometry(2,8),toon(0xFFFF88,{transparent:true,opacity:0.15,side:THREE.DoubleSide}));
            _beam.position.set((_sbi%2===0?-1:1)*(TRACK_W+2),5,-_sbz);
            _beam.rotation.z=(_sbi%2===0?1:-1)*0.3; _beam.rotation.y=Math.PI/4; raceGroup.add(_beam);
        }
    } else {
        // Obstacle Fortress — everything, max difficulty
        add(14,'flat');add(12,'waystones',{count:5});add(10,'forestCritters',{count:6});
        add(14,'ramp',{endY:5});add(10,'coins',{count:12});add(14,'ramp',{endY:0});
        add(18,'spinners',{count:4});add(6,'flat');
        add(14,'waystones',{count:6});add(12,'conveyor',{count:5});
        add(10,'forestCritters',{count:8});add(8,'coins',{count:15});
        add(16,'hammers',{count:5});add(6,'flat');
        add(12,'fallingBlocks',{count:10});add(10,'boost');
        add(14,'ramp',{endY:6});add(24,'platforms',{count:10});add(14,'ramp',{endY:0});
        add(10,'springs',{count:5});add(12,'pendulums',{count:4});
        add(10,'waystones',{count:4});add(12,'forestCritters',{count:6});
        add(10,'coins',{count:25});add(10,'flat');
        // Track 11 decorations — route beacons, expedition flags and observation rails
        var _d11Z=0;for(var _di=0;_di<segs.length;_di++) _d11Z=Math.max(_d11Z,segs[_di].endZ);
        for(var _ski=0;_ski<10;_ski++){var _skz=_d11Z*(_ski+0.5)/10,_sks=(_ski%2===0?-1:1);
            // Faceted stone wayfinder with a warm compass light.
            var _beacon=new THREE.Mesh(new THREE.CylinderGeometry(0.52,0.78,2.4,6),toon(0x756E66));
            _beacon.position.set(_sks*(TRACK_W+4),1.2,-_skz);_beacon.rotation.y=_ski*0.31;raceGroup.add(_beacon);
            var _beaconCap=new THREE.Mesh(new THREE.OctahedronGeometry(0.46,0),toon(0xE8C875,{emissive:0x8A6424,emissiveIntensity:0.22}));
            _beaconCap.position.set(_sks*(TRACK_W+4),2.7,-_skz);_beaconCap.scale.set(0.75,1.15,0.75);raceGroup.add(_beaconCap);
            var _beaconBand=new THREE.Mesh(new THREE.TorusGeometry(0.56,0.06,5,10),toon(0x9E8C72));
            _beaconBand.position.set(_sks*(TRACK_W+4),1.55,-_skz);_beaconBand.rotation.x=Math.PI/2;raceGroup.add(_beaconBand);
        }
        for(var _bni=0;_bni<12;_bni++){var _bnz=_d11Z*(_bni+0.5)/12,_bns=(_bni%2===0?-1:1);
            // Small asymmetric expedition flags replace the former ominous banners.
            var _flag=new THREE.Mesh(new THREE.PlaneGeometry(1.25,1.05),toon(_bni%3===0?0xD49B62:(_bni%3===1?0x6E9E8A:0x7C88A8),{side:THREE.DoubleSide}));
            _flag.position.set(_bns*(TRACK_W+3),4.35,-_bnz);_flag.rotation.y=_bns*0.12;raceGroup.add(_flag);
            var _pole=new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.07,3.4,5),toon(0x6B5848));
            _pole.position.set(_bns*(TRACK_W+3.72),3.3,-_bnz);raceGroup.add(_pole);
        }
        for(var _cgi=0;_cgi<6;_cgi++){var _cgz=_d11Z*(_cgi+0.5)/6;
            // Open timber observation rails keep the route readable without prison imagery.
            var _side2=(_cgi%2===0?-1:1);
            for(var _bar=0;_bar<3;_bar++){
                var _vbar=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.12,1.9,5),toon(0x715B45));
                _vbar.position.set(_side2*(TRACK_W+5)+(_bar-1)*0.75,0.95,-_cgz);raceGroup.add(_vbar);
            }
            var _hbar=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,2.25,5),toon(0x8A6E50));
            _hbar.rotation.z=Math.PI/2;_hbar.position.set(_side2*(TRACK_W+5),1.65,-_cgz);raceGroup.add(_hbar);
            var _lantern=new THREE.Mesh(new THREE.DodecahedronGeometry(0.28,0),toon(0xF3C96B,{emissive:0xA86B20,emissiveIntensity:0.28}));
            _lantern.position.set(_side2*(TRACK_W+5),2.18,-_cgz);raceGroup.add(_lantern);
        }
    }


    trackLength=cz; trackSegments=segs;
    const sm=1+ri*0.2;

    for(let si=0;si<segs.length;si++){
        const seg=segs[si], len=seg.endZ-seg.startZ, hw=seg.width;
        const midZ=seg.startZ+len/2, midY=(seg.startY+seg.endY)/2;

        if(seg.type==='ramp'){
            const fl=new THREE.Mesh(new THREE.BoxGeometry(hw*2,0.5,len),toon(theme[si%2]));
            fl.position.set(0,midY-0.25,-midZ);
            fl.rotation.x=Math.atan2(seg.endY-seg.startY,len);
            fl.receiveShadow=true; raceGroup.add(fl);
        } else if(seg.type!=='platforms'){
            const fl=new THREE.Mesh(new THREE.BoxGeometry(hw*2,0.5,len),toon(theme[si%2]));
            fl.position.set(0,seg.floorY-0.25,-midZ); fl.receiveShadow=true; raceGroup.add(fl);
        }
        if(seg.type!=='narrow'&&seg.type!=='platforms'){
            const wg=new THREE.BoxGeometry(0.5,2,len);
            [-1,1].forEach(side=>{
                const w=new THREE.Mesh(wg,toon(0x9977DD,{transparent:true,opacity:0.45}));
                w.position.set(side*hw,seg.floorY+0.75,-midZ); raceGroup.add(w);
            });
        }
        if(seg.type==='narrow'){
            const rg=new THREE.CylinderGeometry(0.06,0.06,len,4);
            [-1,1].forEach(side=>{
                const rail=new THREE.Mesh(rg,toon(0xFFCC00));
                rail.rotation.x=Math.PI/2; rail.position.set(side*hw,seg.floorY+0.6,-midZ); raceGroup.add(rail);
            });
        }
        buildObs(seg,ri,sm);
    }
    // Finish
    for(let i=0;i<10;i++){
        const c=new THREE.Mesh(new THREE.BoxGeometry(TRACK_W*2/10,0.08,0.6),toon(i%2===0?0x222222:0xffffff));
        c.position.set(-TRACK_W+TRACK_W/5+i*TRACK_W*2/10,0.04,-trackLength); raceGroup.add(c);
    }
    // Finish arch gate — large golden arch with glow
    const arch=new THREE.Mesh(new THREE.TorusGeometry(6,0.5,8,24,Math.PI),toon(0xFFD700,{emissive:0xFFAA00,emissiveIntensity:0.4}));
    arch.position.set(0,0,-trackLength); arch.rotation.y=Math.PI/2; raceGroup.add(arch);
    // Inner glow ring
    var archGlow=new THREE.Mesh(new THREE.TorusGeometry(6,0.2,6,24,Math.PI),new THREE.MeshBasicMaterial({color:0xFFDD44,transparent:true,opacity:0.3}));
    archGlow.position.copy(arch.position);archGlow.rotation.copy(arch.rotation);raceGroup.add(archGlow);
    // GOAL text above arch
    var goalCvs=document.createElement('canvas');goalCvs.width=256;goalCvs.height=64;
    var goalCtx2=goalCvs.getContext('2d');
    goalCtx2.fillStyle='rgba(0,0,0,0.6)';goalCtx2.fillRect(0,0,256,64);
    goalCtx2.fillStyle='#FFD700';goalCtx2.font='bold 40px sans-serif';goalCtx2.textAlign='center';
    goalCtx2.fillText('🏁 GOAL',128,46);
    var goalTex=new THREE.CanvasTexture(goalCvs);
    var goalSign=new THREE.Sprite(new THREE.SpriteMaterial({map:goalTex,transparent:true}));
    goalSign.scale.set(8,2,1);goalSign.position.set(0,8,-trackLength);raceGroup.add(goalSign);
    // Pillars on both sides
    [-1,1].forEach(function(s){
        var pillar=new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.5,7,8),toon(0xFFD700,{emissive:0xFFAA00,emissiveIntensity:0.3}));
        pillar.position.set(s*6,3.5,-trackLength);raceGroup.add(pillar);
    });
    // ---- Scatter power-up items along every track ----
    var _pitems=['star','shield','magnet'];
    for(var _pii=0;_pii<4;_pii++){
        var _piZ=20+_pii*trackLength/5;
        var _piType=_pitems[_pii%3];
        var _piG=new THREE.Group();
        if(_piType==='star'){
            var _psCore=new THREE.Mesh(new THREE.OctahedronGeometry(0.5,0),toon(0xFFDD00,{emissive:0xFFAA00,emissiveIntensity:0.6}));
            _piG.add(_psCore);
            var _psGlow=new THREE.Mesh(new THREE.SphereGeometry(0.6,8,6),toon(0xFFFF88,{transparent:true,opacity:0.3}));
            _piG.add(_psGlow);
        } else if(_piType==='shield'){
            var _pbCore=new THREE.Mesh(new THREE.SphereGeometry(0.5,10,8),toon(0x4488FF,{transparent:true,opacity:0.5,emissive:0x2266CC,emissiveIntensity:0.3}));
            _piG.add(_pbCore);
        } else {
            var _pmArc=new THREE.Mesh(new THREE.TorusGeometry(0.35,0.1,6,10,Math.PI),toon(0xFF2222,{emissive:0xCC0000,emissiveIntensity:0.3}));
            _piG.add(_pmArc);
            var _pmT1=new THREE.Mesh(new THREE.SphereGeometry(0.12,6,4),toon(0xCCCCCC));
            _pmT1.position.set(-0.35,0,0); _piG.add(_pmT1);
            var _pmT2=new THREE.Mesh(new THREE.SphereGeometry(0.12,6,4),toon(0xCCCCCC));
            _pmT2.position.set(0.35,0,0); _piG.add(_pmT2);
        }
        var _piFloorY=getFloorY(_piZ)||0;
        _piG.position.set((Math.sin(_pii*2.3))*3,_piFloorY+3,-_piZ);
        raceGroup.add(_piG);
        raceCoins.push({mesh:_piG,z:_piZ,x:(Math.sin(_pii*2.3))*3,fy:_piFloorY+3,collected:false,bobPhase:_pii*1.1,type:_piType});
    }
    return segs;
}

// ============================================================
//  OBSTACLE BUILDER
// ============================================================
function buildObs(seg,ri,sm){
    const len=seg.endZ-seg.startZ, hw=seg.width, fy=seg.floorY||0;

    if(seg.type==='spinners') for(let i=0;i<seg.count;i++){
        const oz=seg.startZ+(i+1)*len/(seg.count+1), al=hw*0.85;
        const piv=new THREE.Group(); piv.position.set(0,fy+1.2,-oz);
        const pl=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.35,1.2,8),toon(0x666666));
        pl.position.set(0,-0.6,0); pl.castShadow=true; piv.add(pl);
        const arm=new THREE.Mesh(new THREE.BoxGeometry(al*2,0.55,0.55),toon(0xFF4444)); arm.castShadow=true; piv.add(arm);
        [-1,1].forEach(s=>{const cp=new THREE.Mesh(new THREE.SphereGeometry(0.45,8,6),toon(0xCC0000));cp.position.x=s*al;cp.castShadow=true;piv.add(cp);});
        raceGroup.add(piv);
        obstacleObjects.push({type:'spinner',mesh:piv,data:{z:oz,fy,armLen:al,speed:(0.012+ri*0.004)*(i%2===0?1:-1)*sm,angle:i*Math.PI/Math.max(seg.count,1)}});
    }
    if(seg.type==='hammers') for(let i=0;i<seg.count;i++){
        const oz=seg.startZ+(i+1)*len/(seg.count+1), side=i%2===0?-1:1, al=4+ri*0.5;
        const pg=new THREE.Group(); pg.position.set(side*(hw+1),fy+5,-oz);
        pg.add(new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.15,5,6),toon(0x888888)));
        const sw=new THREE.Group();
        const rod=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,al,4),toon(0x999999)); rod.position.y=-al/2; sw.add(rod);
        const hd=new THREE.Mesh(new THREE.SphereGeometry(0.9,10,8),toon(0xFF6633)); hd.position.y=-al; hd.castShadow=true; sw.add(hd);
        [-1,1].forEach(s=>{
            const ew=new THREE.Mesh(new THREE.SphereGeometry(0.14,6,4),toon(0xffffff)); ew.position.set(s*0.28,-al+0.18,0.7); sw.add(ew);
            const eb=new THREE.Mesh(new THREE.SphereGeometry(0.08,4,4),toon(0x222222)); eb.position.set(s*0.28,-al+0.14,0.78); sw.add(eb);
        });
        pg.add(sw); raceGroup.add(pg);
        obstacleObjects.push({type:'hammer',mesh:pg,swing:sw,data:{z:oz,fy,armLen:al,side,speed:(0.016+ri*0.004)*sm,angle:0,pivotX:side*(hw+1),pivotY:fy+5}});
    }
    if(seg.type==='rollers') for(let i=0;i<seg.count;i++){
        const oz=seg.startZ+(i+1)*len/(seg.count+1);
        const rl=new THREE.Mesh(new THREE.CylinderGeometry(0.8,0.8,hw*1.8,12),toon(0xE74C3C));
        rl.rotation.z=Math.PI/2; rl.position.set(0,fy+0.8,-oz); rl.castShadow=true; raceGroup.add(rl);
        obstacleObjects.push({type:'roller',mesh:rl,data:{z:oz,fy,radius:0.8,speed:0.035*sm}});
    }
    if(seg.type==='bumpers') for(let i=0;i<seg.count;i++){
        const oz=seg.startZ+Math.random()*len, ox=(Math.random()-0.5)*hw*1.4, r=0.5+Math.random()*0.3;
        const bm=new THREE.Mesh(new THREE.SphereGeometry(r,10,8),toon(0xFF69B4,{emissive:0xFF1493,emissiveIntensity:0.15}));
        bm.position.set(ox,fy+r,-oz); bm.castShadow=true; raceGroup.add(bm);
        obstacleObjects.push({type:'bumper',mesh:bm,data:{z:oz,fy,x:ox,radius:r,pulse:Math.random()*Math.PI*2}});
    }
    if(seg.type==='pendulums') for(let i=0;i<seg.count;i++){
        const oz=seg.startZ+(i+1)*len/(seg.count+1), chainLen=5+ri*0.5;
        const pg=new THREE.Group(); pg.position.set(0,fy+8,-oz);
        pg.add(new THREE.Mesh(new THREE.BoxGeometry(hw*1.6,0.4,0.4),toon(0x888888)));
        const arm=new THREE.Group();
        const chain=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,chainLen,4),toon(0xAAAAAA));
        chain.position.set(0,-chainLen/2,0); arm.add(chain);
        const ball=new THREE.Mesh(new THREE.SphereGeometry(1.0,10,8),toon(0x9933FF)); ball.position.y=-chainLen; ball.castShadow=true; arm.add(ball);
        pg.add(arm); raceGroup.add(pg);
        obstacleObjects.push({type:'pendulum',mesh:pg,arm,data:{z:oz,fy,chainLen,speed:(0.013+ri*0.003)*sm,angle:i*0.8,pivotY:fy+8}});
    }
    if(seg.type==='platforms') for(let i=0;i<seg.count;i++){
        const oz=seg.startZ+(i+0.5)*len/seg.count;
        const pw=5+Math.random()*3, pd=3.5;
        const hasJourneyPlatform=ri===4||ri===6||ri===7||ri===10;
        const pm=hasJourneyPlatform?_makeJourneyPlatformVisual(ri,pw,pd,i):new THREE.Mesh(new THREE.BoxGeometry(pw,0.5,pd),toon(0x44AADD));
        pm.position.set(0,fy-0.25,-oz); pm.castShadow=true; pm.receiveShadow=true; raceGroup.add(pm);
        const moveRange=hw*0.35;
        pm.position.x=(i%2===0?-1:1)*moveRange*0.5;
        obstacleObjects.push({type:'platform',mesh:pm,data:{z:oz,fy,width:pw,depth:pd,moveRange,speed:(0.008+ri*0.003)*sm*(i%2===0?1:-1),phase:i*Math.PI/seg.count}});
    }
    if(seg.type==='conveyor') for(let i=0;i<seg.count;i++){
        const oz=seg.startZ+(i+1)*len/(seg.count+1);
        const beltLen=6, beltW=hw*1.2;
        const belt=new THREE.Mesh(new THREE.BoxGeometry(beltW,0.15,beltLen),toon(0x555555));
        belt.position.set(0,fy+0.08,-oz); raceGroup.add(belt);
        const dir=(i%2===0)?1:-1;
        for(let a=0;a<3;a++){
            const arr=new THREE.Mesh(new THREE.ConeGeometry(0.3,0.6,4),toon(0xFFFF00,{transparent:true,opacity:0.5}));
            arr.rotation.x=dir>0?0:Math.PI; arr.rotation.z=Math.PI;
            arr.position.set((a-1)*2,fy+0.2,-oz); raceGroup.add(arr);
        }
        obstacleObjects.push({type:'conveyor',mesh:belt,data:{z:oz,fy,halfLen:beltLen/2,halfW:beltW/2,pushX:dir*(0.04+ri*0.01)*sm,pushZ:0}});
    }
    if(seg.type==='fallingBlocks') for(let i=0;i<seg.count;i++){
        const oz=seg.startZ+Math.random()*len, ox=(Math.random()-0.5)*hw*1.4;
        const bSize=1.2+Math.random()*0.8;
        const block=new THREE.Mesh(new THREE.BoxGeometry(bSize,bSize,bSize),toon(0xFF8844));
        block.position.set(ox,fy+12+Math.random()*5,-oz); block.castShadow=true; raceGroup.add(block);
        const shadow=new THREE.Mesh(new THREE.CircleGeometry(bSize*0.6,8),toon(0xFF0000,{transparent:true,opacity:0,side:THREE.DoubleSide}));
        shadow.rotation.x=-Math.PI/2; shadow.position.set(ox,fy+0.05,-oz); raceGroup.add(shadow);
        obstacleObjects.push({type:'fallingBlock',mesh:block,shadow,data:{z:oz,fy,x:ox,size:bSize,baseY:fy+12+Math.random()*5,fallSpeed:0,falling:false,onGround:false,timer:100+Math.random()*160,resetTimer:0,warningTime:60}});
    }
    // ---- Collectibles; selected routes use local, non-coin travel finds ----
    if(seg.type==='coins') for(let i=0;i<(seg.count||10);i++){
        var collectibleCount=seg.count||10;
        var isHerbLeaf=Number(ri)===8;
        var isOriginalTravelFind=Number(ri)===4||Number(ri)===6||Number(ri)===7||Number(ri)===10;
        var oz=seg.startZ+(i+0.5)*len/collectibleCount;
        var ox=(Math.sin(i*1.7))*hw*0.5;
        var collectibleFy=fy;
        var leafSeed=Math.round(seg.startZ*31)+i*17+809;
        if(isHerbLeaf){
            var leafPlacement=_herbLeafPlacement(collectibleCount,i,seg.startZ,len,hw,leafSeed);
            oz=leafPlacement.z;
            ox=leafPlacement.x;
            // Keep the existing fy+1.2 pickup convention while varying the
            // visible base height from near-ground leaves to lightly suspended ones.
            collectibleFy=fy+leafPlacement.lift-1.2;
        }else if(isOriginalTravelFind){
            var travelPlacement=_travelFindPlacement(ri,collectibleCount,i,seg.startZ,len,hw,leafSeed);
            oz=travelPlacement.z;
            ox=travelPlacement.x;
            collectibleFy=fy+travelPlacement.lift-1.2;
        }
        const coinG=isHerbLeaf?_makeHerbLeafCollectible(1.04,i,leafSeed):(isOriginalTravelFind?_makeTravelFindCollectible(ri,1.04,i,leafSeed):((typeof _makeCinematicCoinMesh==='function')?_makeCinematicCoinMesh(1.04):new THREE.Group()));
        coinG.position.set(ox,collectibleFy+1.2,-oz);
        raceGroup.add(coinG);
        var visualMotion=coinG.userData._raceCollectibleMotion||coinG.userData._herbLeafMotion;
        raceCoins.push({mesh:coinG,z:oz,x:ox,fy:collectibleFy,collected:false,bobPhase:visualMotion?visualMotion.phase:i*0.5});
    }
    // ---- Boost pads ----
    if(seg.type==='boost'){
        const padCount=3;
        for(let i=0;i<padCount;i++){
            const oz=seg.startZ+(i+1)*len/(padCount+1);
            const padW=hw*1.2, padD=3;
            const hasJourneyBoost=ri===4||ri===6||ri===7||ri===10;
            const pad=hasJourneyBoost?_makeJourneyBoostVisual(ri,padW,padD,i):new THREE.Mesh(new THREE.BoxGeometry(padW,0.15,padD),toon(0x00CCFF,{emissive:0x0088FF,emissiveIntensity:0.5}));
            pad.position.set(0,hasJourneyBoost?fy:fy+0.08,-oz); pad.receiveShadow=true; raceGroup.add(pad);
            if(!hasJourneyBoost){
                // Arrow indicators remain on the established tracks only.
                for(let a=0;a<3;a++){
                    const arr=new THREE.Mesh(new THREE.ConeGeometry(0.4,0.8,4),toon(0xFFFF00,{emissive:0xFFDD00,emissiveIntensity:0.4,transparent:true,opacity:0.7}));
                    arr.rotation.x=Math.PI; arr.position.set((a-1)*2.5,fy+0.25,-oz);
                    raceGroup.add(arr);
                }
            }
            obstacleObjects.push({type:'boost',mesh:pad,data:{z:oz,fy:fy,halfW:padW/2,halfD:padD/2,strength:0.35}});
        }
    }
    // ---- Spring pads ----
    if(seg.type==='springs') for(let i=0;i<(seg.count||3);i++){
        const oz=seg.startZ+(i+1)*len/((seg.count||3)+1);
        const ox=(i%2===0?-1:1)*hw*0.25*(i%3);
        const hasJourneyLauncher=ri===4||ri===6||ri===7||ri===10;
        const sg2=hasJourneyLauncher?_makeJourneyLauncherVisual(ri,i):new THREE.Group();
        if(!hasJourneyLauncher){
            // Base cylinder
            const base2=new THREE.Mesh(new THREE.CylinderGeometry(0.6,0.7,0.3,10),toon(0xFF4444));
            base2.position.y=0.15; sg2.add(base2);
            // Spring coil (stacked torus)
            for(let c=0;c<3;c++){
                const coil=new THREE.Mesh(new THREE.TorusGeometry(0.35,0.06,6,12),toon(0xCCCCCC));
                coil.position.y=0.4+c*0.18; coil.rotation.x=Math.PI/2; sg2.add(coil);
            }
            // Top plate
            const top2=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.5,0.15,10),toon(0xFF6666,{emissive:0xFF2222,emissiveIntensity:0.3}));
            top2.position.y=1.0; sg2.add(top2);
        }
        sg2.position.set(ox,fy,-oz);
        raceGroup.add(sg2);
        obstacleObjects.push({type:'spring',mesh:sg2,data:{z:oz,fy:fy,x:ox,radius:0.7,jumpForce:0.5,anim:0}});
    }
    // ---- Cylindrical obstacles; race 8 uses original mossy forest stumps ----
    if(seg.type==='waystones') for(let i=0;i<(seg.count||3);i++){
        const oz=seg.startZ+(i+1)*len/((seg.count||3)+1);
        const ox=(i%2===0?-1:1)*hw*0.3*(0.5+Math.random()*0.5);
        const pH=2.0+Math.random()*1.5;
        const pg=new THREE.Group();
        const useMossStumpVisual=Number(ri)===8;
        if(useMossStumpVisual){
            // Low-poly tapered trunk: solid, faceted, and slightly asymmetric.
            const trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.68,0.88,pH,7),toon(0x765744));
            trunk.position.y=pH/2;
            trunk.rotation.y=(i%7)*0.19;
            trunk.scale.x=0.95+(i%3)*0.035;
            trunk.castShadow=true;
            pg.add(trunk);

            // A solid warm wood cut replaces the widened hollow stump silhouette.
            const cutTop=new THREE.Mesh(new THREE.CylinderGeometry(0.62,0.69,0.16,7),toon(0xB58A5C));
            cutTop.position.y=pH+0.04;
            cutTop.rotation.y=trunk.rotation.y+0.12;
            cutTop.castShadow=true;
            pg.add(cutTop);

            // Sparse bark ridges keep the silhouette natural without adding texture assets.
            for(let b=0;b<2;b++){
                const barkAngle=(i*1.37+b*2.45)%6.283;
                const ridge=new THREE.Mesh(new THREE.BoxGeometry(0.09,pH*(0.24+b*0.06),0.055),toon(b===0?0x5C4336:0x8A674E));
                ridge.position.set(Math.sin(barkAngle)*0.70,pH*(0.30+b*0.22),Math.cos(barkAngle)*0.70);
                ridge.rotation.y=barkAngle;
                pg.add(ridge);
            }

            // Small deterministic moss clumps connect the obstacle to the forest theme.
            for(let m=0;m<2;m++){
                const mossAngle=(i*0.91+m*2.8+0.4)%6.283;
                const moss=new THREE.Mesh(new THREE.IcosahedronGeometry(0.25+m*0.05,0),toon(m===0?0x657A42:0x78924C));
                moss.scale.set(1.35,0.55,0.85);
                moss.position.set(Math.sin(mossAngle)*0.62,pH-(m*0.24),Math.cos(mossAngle)*0.62);
                moss.castShadow=true;
                pg.add(moss);
            }
        }else{
            // Faceted route waystone used by the remaining courses.
            const body2=new THREE.Mesh(new THREE.CylinderGeometry(0.58,0.92,pH,6),toon(0x766E63));
            body2.position.y=pH/2;body2.rotation.y=(i%6)*0.21;body2.castShadow=true;pg.add(body2);
            const cap2=new THREE.Mesh(new THREE.ConeGeometry(0.72,0.62,6),toon(0xA89A82));
            cap2.position.y=pH+0.31;cap2.rotation.y=body2.rotation.y;cap2.castShadow=true;pg.add(cap2);
            const marker2=new THREE.Mesh(new THREE.OctahedronGeometry(0.22,0),toon(0xC8D59A,{emissive:0x687B48,emissiveIntensity:0.12,}));
            marker2.position.set(0,pH*0.58,0.59);pg.add(marker2);
        }
        pg.position.set(ox,fy,-oz);
        raceGroup.add(pg);
        obstacleObjects.push({type:'waystone',mesh:pg,data:{z:oz,fy:fy,x:ox,radius:1.0,height:pH}});
    }
    // ---- Walking seed crawlers ----
    if(seg.type==='forestCritters') for(let i=0;i<(seg.count||3);i++){
        const oz=seg.startZ+(i+1)*len/((seg.count||3)+1);
        const ox=(Math.random()-0.5)*hw*1.0;
        const gg=new THREE.Group();
        // A faceted seed pod with a small leaf vane; no cap, stem or mascot face.
        const pod=new THREE.Mesh(new THREE.CapsuleGeometry(0.38,0.62,4,7),toon(i%2?0x8B6B4F:0x756149));
        pod.position.y=0.55;pod.scale.set(1.15,0.92,0.95);pod.castShadow=true;gg.add(pod);
        const seam=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.55,0.04),toon(0xB39A72));
        seam.position.set(0,0.58,0.39);seam.rotation.z=0.12;gg.add(seam);
        const leaf=new THREE.Mesh(new THREE.CircleGeometry(0.28,7),toon(0x6E9855,{side:THREE.DoubleSide,}));
        leaf.scale.set(0.55,1,1);leaf.position.set(0.20,1.05,0);leaf.rotation.set(-0.3,0.25,-0.65);gg.add(leaf);
        [-1,1].forEach(function(side){
            var root=new THREE.Mesh(new THREE.ConeGeometry(0.13,0.38,5),toon(0x5B4A3D));
            root.position.set(side*0.26,0.12,0);root.rotation.z=side*0.7;gg.add(root);
        });
        gg.position.set(ox,fy,-oz);raceGroup.add(gg);
        obstacleObjects.push({type:'seedCrawler',mesh:gg,data:{z:oz,fy:fy,x:ox,startX:ox,radius:0.6,walkDir:i%2===0?1:-1,walkRange:hw*0.6,walkSpeed:(0.02+ri*0.003)*sm,phase:i*Math.PI}});
    }
    // ---- Discovery crates (hit from below for travel items) ----
    if(seg.type==='discoveryCrates') for(var qi=0;qi<(seg.count||3);qi++){
        var qoz=seg.startZ+(qi+1)*len/((seg.count||3)+1);
        var qox=(qi%2===0?-1:1)*hw*0.2*(1+qi%3);
        var qbH=4; // height above floor
        var qg=new THREE.Group();
        // Rough timber cache with a small compass-diamond emblem.
        var qBox=new THREE.Mesh(new THREE.BoxGeometry(2,1.6,1.8),toon(0x8A674A));qg.add(qBox);
        for(var _cb=-1;_cb<=1;_cb+=2){
            var _band=new THREE.Mesh(new THREE.BoxGeometry(0.16,1.72,1.88),toon(0x52675C));_band.position.x=_cb*0.62;qg.add(_band);
        }
        var qMark=new THREE.Mesh(new THREE.OctahedronGeometry(0.30,0),toon(0xC6D88D,{emissive:0x526B43,emissiveIntensity:0.12}));
        qMark.scale.set(0.72,1,0.28);qMark.position.set(0,0,0.96);qg.add(qMark);
        var qMark2=qMark.clone();qMark2.position.z=-0.96;qg.add(qMark2);
        qg.position.set(qox,fy+qbH,-qoz);
        raceGroup.add(qg);
        obstacleObjects.push({type:'discoveryCrate',mesh:qg,data:{z:qoz,fy:fy,x:qox,baseY:fy+qbH,used:false,_bouncing:false,_bounceT:0,_coinMeshes:[]}});
        // Place a power-up item on top of every other discovery crate
        if(qi%2===0){
            var _itemTypes=['star','shield','magnet'];
            var _itemType=_itemTypes[qi%3];
            var _itemG=new THREE.Group();
            if(_itemType==='star'){
                // Gold star
                var _starCore=new THREE.Mesh(new THREE.OctahedronGeometry(0.5,0),toon(0xFFDD00,{emissive:0xFFAA00,emissiveIntensity:0.6}));
                _itemG.add(_starCore);
                var _starGlow=new THREE.Mesh(new THREE.SphereGeometry(0.6,8,6),toon(0xFFFF88,{transparent:true,opacity:0.3}));
                _itemG.add(_starGlow);
            } else if(_itemType==='shield'){
                // Blue transparent sphere
                var _shCore=new THREE.Mesh(new THREE.SphereGeometry(0.5,10,8),toon(0x4488FF,{transparent:true,opacity:0.5,emissive:0x2266CC,emissiveIntensity:0.3}));
                _itemG.add(_shCore);
            } else {
                // Red magnet (horseshoe shape = torus arc + cylinders)
                var _magArc=new THREE.Mesh(new THREE.TorusGeometry(0.35,0.1,6,10,Math.PI),toon(0xFF2222,{emissive:0xCC0000,emissiveIntensity:0.3}));
                _itemG.add(_magArc);
                var _magTip1=new THREE.Mesh(new THREE.SphereGeometry(0.12,6,4),toon(0xCCCCCC));
                _magTip1.position.set(-0.35,0,0); _itemG.add(_magTip1);
                var _magTip2=new THREE.Mesh(new THREE.SphereGeometry(0.12,6,4),toon(0xCCCCCC));
                _magTip2.position.set(0.35,0,0); _itemG.add(_magTip2);
            }
            _itemG.position.set(qox,fy+qbH+1.8,-qoz);
            raceGroup.add(_itemG);
            raceCoins.push({mesh:_itemG,z:qoz,x:qox,fy:fy+qbH+1.8,collected:false,bobPhase:qi*0.7,type:_itemType});
        }
    }
}

// Solid, abstract herb leaf used only by Moss-Shade Trail collectibles.
// The pointed asymmetric outline and raised vein are built from Three.js
// geometry, with no image, texture, or external model dependency.
function _herbLeafNoise(seed){
    var value=Math.sin((Number(seed)||0)*12.9898+78.233)*43758.5453;
    return value-Math.floor(value);
}

function _herbLeafPlacement(count,index,startZ,length,halfWidth,seed){
    // Repeating 2/4/3-leaf clusters create quiet gaps without changing count.
    var pattern=[2,4,3],groups=[],remaining=count,patternIndex=0;
    while(remaining>0){
        var size=Math.min(pattern[patternIndex%pattern.length],remaining);
        groups.push(size);remaining-=size;patternIndex++;
    }
    var cursor=0,groupIndex=0;
    for(;groupIndex<groups.length;groupIndex++){
        if(index<cursor+groups[groupIndex])break;
        cursor+=groups[groupIndex];
    }
    var groupSize=groups[groupIndex]||1;
    var within=index-cursor;
    var groupBand=length/groups.length;
    var clusterSpread=Math.min(0.78,groupBand/(groupSize+2));
    var localOffset=(within-(groupSize-1)*0.5)*clusterSpread;
    var z=startZ+(groupIndex+0.5)*groupBand+localOffset+(_herbLeafNoise(seed+3)-0.5)*0.22;
    var clusterX=(_herbLeafNoise(Math.round(startZ*7)+groupIndex*41+19)-0.5)*halfWidth*0.72;
    var x=clusterX+(_herbLeafNoise(seed+11)-0.5)*halfWidth*0.20;
    x=Math.max(-halfWidth*0.62,Math.min(halfWidth*0.62,x));
    return {x:x,z:z,lift:0.46+_herbLeafNoise(seed+23)*0.68};
}

function _makeHerbLeafCollectible(scale,index,seed){
    var variant=Math.abs(Number(index)||0);
    var leftW=0.32+(variant%3)*0.018;
    var rightW=0.35+((variant+1)%3)*0.014;
    var leafShape=new THREE.Shape();
    leafShape.moveTo(0,-0.47);
    leafShape.bezierCurveTo(-leftW*0.82,-0.34,-leftW,0.02,-leftW*0.64,0.28);
    leafShape.bezierCurveTo(-leftW*0.34,0.43,-0.08,0.50,0.025,0.54);
    leafShape.bezierCurveTo(rightW*0.16,0.43,rightW*0.92,0.25,rightW,0.01);
    leafShape.bezierCurveTo(rightW*0.82,-0.25,rightW*0.30,-0.41,0,-0.47);

    var leafGeo=new THREE.ExtrudeGeometry(leafShape,{
        depth:0.085,steps:1,curveSegments:8,
        bevelEnabled:true,bevelSegments:1,bevelSize:0.018,bevelThickness:0.014
    });
    leafGeo.translate(0,0,-0.0425);
    var leafMat=softPBR(variant%2===0?0x5F8B46:0x688F4A,{
        pastelAmount:0.035,roughness:0.74,metalness:0,clearcoat:0.04,
        clearcoatRoughness:0.82,envMapIntensity:0.62
    });
    var veinMat=softPBR(variant%2===0?0xB5CC68:0xA9C45D,{
        pastelAmount:0.02,roughness:0.70,metalness:0,envMapIntensity:0.55
    });
    var group=new THREE.Group();
    var leaf=new THREE.Mesh(leafGeo,leafMat);
    leaf.castShadow=true;
    group.add(leaf);

    var veinGeo=new THREE.BoxGeometry(0.045,0.66,0.025);
    var frontVein=new THREE.Mesh(veinGeo,veinMat);
    frontVein.position.set(0.012,-0.035,0.066);
    frontVein.rotation.z=-0.035;
    group.add(frontVein);
    var backVein=new THREE.Mesh(veinGeo,veinMat);
    backVein.position.set(0.012,-0.035,-0.066);
    backVein.rotation.z=-0.035;
    group.add(backVein);

    var baseScale=(scale===undefined?1:scale)*(0.90+_herbLeafNoise(seed+37)*0.20);
    var baseTiltX=(_herbLeafNoise(seed+43)-0.5)*0.34;
    var baseTiltZ=(_herbLeafNoise(seed+47)-0.5)*0.42;
    group.rotation.set(baseTiltX,_herbLeafNoise(seed+41)*Math.PI*2,baseTiltZ);
    group.scale.setScalar(baseScale);
    group.userData._herbLeafCollectible=true;
    group.userData._herbLeafMotion={
        phase:_herbLeafNoise(seed+53)*Math.PI*2,
        speed:0.004+_herbLeafNoise(seed+59)*0.022,
        amplitude:0.006+_herbLeafNoise(seed+61)*0.070,
        drift:0.004+_herbLeafNoise(seed+67)*0.050,
        driftPhase:_herbLeafNoise(seed+71)*Math.PI*2,
        baseTiltX:baseTiltX,
        baseTiltZ:baseTiltZ,
        sway:0.008+_herbLeafNoise(seed+73)*0.045,
        spin:(_herbLeafNoise(seed+79)-0.5)*0.012,
        lastDx:0,
        lastDz:0
    };
    return group;
}

// Deterministic visual noise keeps route layouts stable between reloads while
// avoiding a mechanically repeated collectible trail.
function _travelVisualNoise(seed){
    var value=Math.sin((Number(seed)||0)*12.9898+78.233)*43758.5453;
    return value-Math.floor(value);
}

function _travelFindPlacement(ri,count,index,startZ,length,halfWidth,seed){
    var patterns={4:[3,2,4],6:[2,3,2],7:[3,4,2],10:[2,4,3]};
    var pattern=patterns[Number(ri)]||[3,2,3];
    var groups=[],remaining=count,patternIndex=0;
    while(remaining>0){
        var groupSize=Math.min(pattern[patternIndex%pattern.length],remaining);
        groups.push(groupSize);remaining-=groupSize;patternIndex++;
    }
    var cursor=0,groupIndex=0;
    for(;groupIndex<groups.length;groupIndex++){
        if(index<cursor+groups[groupIndex])break;
        cursor+=groups[groupIndex];
    }
    var within=index-cursor,activeSize=groups[groupIndex]||1;
    var band=length/groups.length;
    var groupJitter=(_travelVisualNoise(seed-groupIndex*29+ri*101)-0.5)*band*0.22;
    var localStep=Math.min(0.46,band/(activeSize+2));
    var z=startZ+(groupIndex+0.5)*band+groupJitter+(within-(activeSize-1)*0.5)*localStep;
    z=Math.max(startZ+0.28,Math.min(startZ+length-0.28,z));

    // Each cluster favours a different side/centre lane, with a little internal spread.
    var laneSequence=[-0.44,0.18,0.46,-0.08,0.34,-0.38];
    var clusterX=laneSequence[(groupIndex+ri)%laneSequence.length]*halfWidth;
    var localX=(within-(activeSize-1)*0.5)*Math.min(0.58,halfWidth*0.10);
    var x=clusterX+localX+(_travelVisualNoise(seed+groupIndex*43+within*7)-0.5)*halfWidth*0.12;
    x=Math.max(-halfWidth*0.62,Math.min(halfWidth*0.62,x));
    return {x:x,z:z,lift:0.72+_travelVisualNoise(seed+67)*0.64};
}

function _makeTravelFindCollectible(ri,scale,index,seed){
    var route=Number(ri),group=new THREE.Group();
    var variant=Math.abs(Number(index)||0);
    if(route===4){
        // Wind seed: a warm solid pod with two offset sage fins.
        var pod=new THREE.Mesh(new THREE.DodecahedronGeometry(0.42,0),softPBR(variant%2?0xC87F55:0xB96B4C,{roughness:0.72,metalness:0,envMapIntensity:0.62}));
        pod.scale.set(0.74,1.14,0.56);pod.rotation.z=(variant%3-1)*0.10;group.add(pod);
        for(var f=0;f<2;f++){
            var fin=new THREE.Mesh(new THREE.ConeGeometry(0.20,0.72,5),softPBR(f?0x6F9270:0x89A477,{roughness:0.78,metalness:0}));
            fin.scale.z=0.45;fin.position.set((f?1:-1)*0.27,0.28,-0.02);fin.rotation.z=(f?1:-1)*0.72;group.add(fin);
        }
    }else if(route===6){
        // Frost shard: three solid, differently angled crystal splinters.
        var iceCols=[0xBFE8EE,0x7DC6D9,0xDCEFF4];
        for(var s=0;s<3;s++){
            var shard=new THREE.Mesh(new THREE.ConeGeometry(0.19+s*0.025,0.82-s*0.10,5),softPBR(iceCols[(variant+s)%iceCols.length],{roughness:0.34,metalness:0,clearcoat:0.12,envMapIntensity:0.86}));
            shard.position.set((s-1)*0.20,(s===1?0.08:-0.04),s===1?0.05:-0.03);shard.rotation.z=(s-1)*0.28;group.add(shard);
        }
    }else if(route===7){
        // Sky pennant: a compact kite marker with unequal fabric tails.
        var kite=new THREE.Mesh(new THREE.OctahedronGeometry(0.43,0),softPBR(variant%2?0xD77F70:0x5D97A6,{roughness:0.60,metalness:0,envMapIntensity:0.72}));
        kite.scale.set(0.82,1.22,0.36);group.add(kite);
        for(var t=0;t<2;t++){
            var tail=new THREE.Mesh(new THREE.BoxGeometry(0.11,0.55-t*0.12,0.055),softPBR(t?0xE6BE76:0xEEE7D4,{roughness:0.78,metalness:0}));
            tail.position.set((t?1:-1)*0.13,-0.55,0);tail.rotation.z=(t?1:-1)*0.18;group.add(tail);
        }
    }else{
        // Cloud seal: a blue-violet waymark resting on three tiny cloud beads.
        var seal=new THREE.Mesh(new THREE.OctahedronGeometry(0.40,0),softPBR(variant%2?0x8298C7:0x6FAFBD,{roughness:0.48,metalness:0,clearcoat:0.08,envMapIntensity:0.78}));
        seal.scale.set(0.78,1.18,0.42);seal.position.y=0.10;group.add(seal);
        for(var c=0;c<3;c++){
            var bead=new THREE.Mesh(new THREE.IcosahedronGeometry(0.17+(c===1?0.04:0),0),softPBR(c===1?0xEFF2EE:0xD8E5E9,{roughness:0.88,metalness:0}));
            bead.scale.set(1.15,0.66,0.78);bead.position.set((c-1)*0.22,-0.40,(c%2)*0.04);group.add(bead);
        }
    }
    var baseScale=(scale===undefined?1:scale)*(0.91+_travelVisualNoise(seed+11)*0.18);
    var baseTiltX=(_travelVisualNoise(seed+17)-0.5)*0.34;
    var baseTiltZ=(_travelVisualNoise(seed+23)-0.5)*0.38;
    group.scale.setScalar(baseScale);
    group.rotation.set(baseTiltX,_travelVisualNoise(seed+29)*Math.PI*2,baseTiltZ);
    group.userData._raceCollectibleMotion={
        phase:_travelVisualNoise(seed+31)*Math.PI*2,
        speed:0.006+_travelVisualNoise(seed+37)*0.014,
        amplitude:0.025+_travelVisualNoise(seed+41)*0.085,
        drift:0.008+_travelVisualNoise(seed+43)*0.055,
        driftPhase:_travelVisualNoise(seed+47)*Math.PI*2,
        baseTiltX:baseTiltX,baseTiltZ:baseTiltZ,
        sway:0.012+_travelVisualNoise(seed+53)*0.042,
        spin:(_travelVisualNoise(seed+59)-0.5)*0.009,
        lastDx:0,lastDz:0
    };
    return group;
}

function _makeJourneyPlatformVisual(ri,width,depth,index){
    var route=Number(ri),group=new THREE.Group();
    var count=route===7||route===10?4:3;
    for(var i=0;i<count;i++){
        var piece;
        if(route===4){
            piece=new THREE.Mesh(new THREE.CylinderGeometry(1.18,1.34,0.46,7),softPBR(i%2?0x8B8067:0xA28F6E,{roughness:0.86,metalness:0}));
            piece.scale.set(width/(count*1.65),1,depth*0.28);piece.rotation.y=i*0.31;
        }else if(route===6){
            piece=new THREE.Mesh(new THREE.CylinderGeometry(1.15,1.00,0.42,6),softPBR(i%2?0xA9D5DF:0xD5EAEC,{roughness:0.38,metalness:0,clearcoat:0.10}));
            piece.scale.set(width/(count*1.65),1,depth*0.30);piece.rotation.y=i*0.42;
        }else{
            piece=new THREE.Mesh(new THREE.IcosahedronGeometry(1,1),softPBR(route===7?(i%2?0xDDE8EA:0xF1ECE1):(i%2?0xD7E4EB:0xEDEEE8),{roughness:0.90,metalness:0}));
            piece.scale.set(width/(count*1.48),0.34,depth*0.31);piece.rotation.y=i*0.47;
        }
        piece.position.set((i-(count-1)*0.5)*width/(count+0.35),i%2?0.05:-0.03,(i%3-1)*0.22);
        piece.castShadow=true;piece.receiveShadow=true;group.add(piece);
    }
    group.userData._journeyPlatform=route;
    return group;
}

function _makeJourneyBoostVisual(ri,width,depth,index){
    var route=Number(ri),group=new THREE.Group();
    var colours=route===4?[0x6F9270,0x93AA78]:route===6?[0x82C7D5,0xD3EDF0]:route===7?[0x5D97A6,0xD77F70]:[0x7FAFBE,0xDCEAEC];
    for(var i=0;i<5;i++){
        var x=(i-2)*width/5.6;
        var base=new THREE.Mesh(new THREE.DodecahedronGeometry(0.24+(i%2)*0.04,0),softPBR(route===4?0x86745E:(route===6?0xB7D6DC:0xE4E7E2),{roughness:0.82,metalness:0}));
        base.scale.set(1.15,0.52,0.88);base.position.set(x,0.13,(i%2?0.20:-0.16));group.add(base);
        var vane=new THREE.Mesh(new THREE.ConeGeometry(0.20+(i%3)*0.025,0.92+(i%2)*0.18,route===7?3:5),softPBR(colours[i%2],{roughness:0.62,metalness:0,emissive:colours[i%2],emissiveIntensity:0.08}));
        vane.position.set(x,0.72,(i%2?0.16:-0.12));vane.rotation.z=(i-2)*0.075;vane.scale.z=route===7?0.30:0.55;
        vane.userData._journeyVane=true;vane.userData._baseRotZ=vane.rotation.z;group.add(vane);
    }
    group.userData._journeyBoostMotion={phase:index*0.83+route*0.37};
    return group;
}

function _makeJourneyLauncherVisual(ri,index){
    var route=Number(ri),group=new THREE.Group();
    var baseColour=route===4?0x806B51:(route===6?0xD5E9EA:(route===7?0xE7E9E3:0xDCE7EC));
    var base=new THREE.Mesh(new THREE.DodecahedronGeometry(0.72,0),softPBR(baseColour,{roughness:0.86,metalness:0}));
    base.scale.set(1.0,0.24,0.92);base.position.y=0.18;group.add(base);
    var bladeCols=route===4?[0x668B61,0x8BA66F]:route===6?[0x79BED0,0xC4E5EA]:route===7?[0x5C96A6,0xD98272]:[0x79AFC0,0xB8D9E2];
    for(var i=0;i<5;i++){
        var angle=i*Math.PI*2/5+(index%3)*0.13;
        var blade=new THREE.Mesh(new THREE.ConeGeometry(0.18,0.78+(i%2)*0.14,route===7?3:5),softPBR(bladeCols[i%2],{roughness:0.64,metalness:0,transparent:route===10,opacity:route===10?0.82:1}));
        blade.position.set(Math.cos(angle)*0.34,0.55,Math.sin(angle)*0.34);blade.rotation.z=Math.cos(angle)*0.42;blade.rotation.x=Math.sin(angle)*0.32;
        blade.userData._journeyVane=true;blade.userData._baseRotZ=blade.rotation.z;group.add(blade);
    }
    var breeze=new THREE.Mesh(new THREE.ConeGeometry(0.34,1.25,7,1,true),new THREE.MeshBasicMaterial({color:route===4?0xBBD6A1:0xCDEDF1,transparent:true,opacity:0.16,side:THREE.DoubleSide,depthWrite:false}));
    breeze.position.y=0.82;breeze.rotation.x=Math.PI;group.add(breeze);
    group.userData._journeyLauncher=route;
    return group;
}
