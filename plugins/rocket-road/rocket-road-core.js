// Travel-road challenge plugin ? current internal module remains rocket-road for compatibility
// 3D presentation with top-down travel-road rules. Pure rules live in the existing WASM module with JS fallback.
(function(){
    'use strict';

    var PLAYER_Z=-8.5;
    var ROAD_SEG_LEN=8;
    var BUILD=2026062716;

    function api(){return window.DANBO_MINIGAME_WASM&&window.DANBO_MINIGAME_WASM.rocketRoad;}
    function n(v,d){v=Number(v);return isFinite(v)?v:(d||0);}
    function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
    function smooth(t){t=clamp(t,0,1);return t*t*(3-2*t);}
    function roadCenterAt(distance){
        var raw=Math.max(0,n(distance)), sid=Math.floor(raw/STAGE_LENGTH), d=raw-sid*STAGE_LENGTH, phase=sid*0.73, c=0;
        c+=Math.sin(Math.max(0,d-360)*0.0062+phase)*1.15*smooth((d-360)/260);
        c+=Math.sin(Math.max(0,d-1080)*0.0085+1.8+phase*0.7)*0.95*smooth((d-1080)/360);
        c+=Math.sin(Math.max(0,d-1880)*0.0072+3.1+phase*1.1)*1.25*smooth((d-1880)/420);
        c+=Math.sin(Math.max(0,d-2620)*0.0100+0.4+phase*0.5)*0.72*smooth((d-2620)/320);
        return clamp(c,-2.15,2.15);
    }
    function fmt3(v){v=Math.max(0,Math.floor(n(v)));return (v<10?'00':(v<100?'0':''))+v;}
    var STAGE_LENGTH=3300, STAGE_COUNT=6, TOTAL_LENGTH=STAGE_LENGTH*STAGE_COUNT;
    var STAGES=[
        {name:'绿城郊外',nameI18n:{zhs:'绿城郊外',zht:'綠城郊外',ja:'緑の街の郊外',en:'Green City Outskirts'},theme:'suburb',road:0xb8b9aa,fieldA:0x67d957,fieldB:0x78e962,edge:0x66866b,decor:[11,1,0,2,11,4]},
        {name:'森林弯道',nameI18n:{zhs:'森林弯道',zht:'森林彎道',ja:'森のカーブ',en:'Forest Bend'},theme:'forest',road:0xb7b8aa,fieldA:0x43b946,fieldB:0x5ed65b,edge:0x49623d,decor:[12,0,12,7,0,4]},
        {name:'港湾高架',nameI18n:{zhs:'港湾高架',zht:'港灣高架',ja:'港湾高架',en:'Harbor Overpass'},theme:'harbor',road:0xbfc0b5,fieldA:0x7fd9e8,fieldB:0x5fb7df,edge:0xe5dcc6,decor:[13,6,13,2,5,1]},
        {name:'海岸公路',nameI18n:{zhs:'海岸公路',zht:'海岸公路',ja:'海岸道路',en:'Coastal Highway'},theme:'coast',road:0xbec0ad,fieldA:0xe7c982,fieldB:0x65cbed,edge:0xd8bd7b,decor:[14,8,14,3,4,0]},
        {name:'峡谷荒原',nameI18n:{zhs:'峡谷荒原',zht:'峽谷荒原',ja:'峡谷荒野',en:'Canyon Wasteland'},theme:'canyon',road:0xb7b8a9,fieldA:0xd6a63f,fieldB:0xc38b2b,edge:0x8d5c36,decor:[15,9,15,0,4]},
        {name:'田园冲刺',nameI18n:{zhs:'田园冲刺',zht:'田園衝刺',ja:'田園スプリント',en:'Countryside Sprint'},theme:'farmland',road:0xbec0ac,fieldA:0xd6b846,fieldB:0x78d65a,edge:0x8f7846,decor:[16,10,16,5,1,0]}
    ];
    var RR_COPY={
        zhs:{gameName:'风迹赛道',subtitle:'3D画面 · 俯视旅途道路 · 单路线挑战',single:'单人游戏',multi:'多人游戏',developing:'开发中',scores:'高分榜',exit:'退出',overview:'共设六条独立场景路线；每次选择一条路线挑战，完成当前路线后才会解锁下一条路线。',rules:'规则模块',selectRoute:'选择路线',unlockHint:'完成上一条路线后，下一条路线才会开放',routeN:'路线 {n}',available:'可挑战',backTitle:'返回标题',controls:'←/→ 或 A/D 转向，↑/Space/W 高速，↓/S 减速。',locked:'请先完成上一条路线，再挑战这里',points:'分',noScores:'还没有记录，先跑一局吧。',routeComplete:'{route} 完成！',challengeEnded:'挑战结束',routeLabel:'路线',scoreLabel:'分数',distanceLabel:'距离',refuelLabel:'补油',collisionLabel:'碰撞',timeLabel:'用时',unlockedLabel:'已解锁',nextRoute:'挑战下一条路线',retry:'再来一次',direction:'方向',brake:'刹车',throttle:'油门',journeyProgress:'路线进度',travelTime:'旅途时间',passedVehicles:'已超过',journeyDistance:'已行进',powerOutput:'动力',journeyEnergy:'旅途能量',journeyReady:'旅程准备',multiComing:'多人模式已预留，等服务器房间接入后开放',skid:'打滑！反打方向稳住！',refuel:'补油 +{amount}'},
        zht:{gameName:'風跡賽道',subtitle:'3D畫面 · 俯視旅途道路 · 單路線挑戰',single:'單人遊戲',multi:'多人遊戲',developing:'開發中',scores:'高分榜',exit:'退出',overview:'共設六條獨立場景路線；每次選擇一條路線挑戰，完成目前路線後才會解鎖下一條路線。',rules:'規則模組',selectRoute:'選擇路線',unlockHint:'完成上一條路線後，下一條路線才會開放',routeN:'路線 {n}',available:'可挑戰',backTitle:'返回標題',controls:'←/→ 或 A/D 轉向，↑/Space/W 高速，↓/S 減速。',locked:'請先完成上一條路線，再挑戰這裡',points:'分',noScores:'還沒有紀錄，先跑一局吧。',routeComplete:'{route} 完成！',challengeEnded:'挑戰結束',routeLabel:'路線',scoreLabel:'分數',distanceLabel:'距離',refuelLabel:'補油',collisionLabel:'碰撞',timeLabel:'用時',unlockedLabel:'已解鎖',nextRoute:'挑戰下一條路線',retry:'再來一次',direction:'方向',brake:'煞車',throttle:'油門',journeyProgress:'路線進度',travelTime:'旅途時間',passedVehicles:'已超過',journeyDistance:'已行進',powerOutput:'動力',journeyEnergy:'旅途能量',journeyReady:'旅程準備',multiComing:'多人模式已預留，待伺服器房間接入後開放',skid:'打滑！反打方向穩住！',refuel:'補油 +{amount}'},
        ja:{gameName:'風のコース',subtitle:'3D表現 · 見下ろし旅路 · 1ルート挑戦',single:'シングルプレイ',multi:'マルチプレイ',developing:'開発中',scores:'ハイスコア',exit:'終了',overview:'全6本の独立したシーンルート。1回につき1ルートに挑戦し、現在のルートを完了すると次のルートが解放されます。',rules:'ルールモジュール',selectRoute:'ルート選択',unlockHint:'前のルートを完了すると、次のルートが解放されます',routeN:'ルート {n}',available:'挑戦可能',backTitle:'タイトルへ戻る',controls:'←/→ または A/D で方向転換、↑/Space/W で加速、↓/S で減速。',locked:'先に前のルートを完了してください',points:'点',noScores:'記録はまだありません。まず1回走ってみましょう。',routeComplete:'{route} 完了！',challengeEnded:'チャレンジ終了',routeLabel:'ルート',scoreLabel:'スコア',distanceLabel:'距離',refuelLabel:'給油',collisionLabel:'衝突',timeLabel:'タイム',unlockedLabel:'解放',nextRoute:'次のルートに挑戦',retry:'もう一度',direction:'方向',brake:'ブレーキ',throttle:'アクセル',journeyProgress:'ルート進行',travelTime:'旅の時間',passedVehicles:'追い越し',journeyDistance:'走行距離',powerOutput:'パワー',journeyEnergy:'旅のエネルギー',journeyReady:'旅の準備',multiComing:'マルチプレイはサーバールーム接続後に利用できます',skid:'スリップ！反対方向へ切って立て直そう！',refuel:'給油 +{amount}'},
        en:{gameName:'Wind Course',subtitle:'3D presentation · Top-down travel road · Single-route challenge',single:'Single Player',multi:'Multiplayer',developing:'In Development',scores:'High Scores',exit:'Exit',overview:'Six independent scenic routes are available. Complete the current route to unlock the next one.',rules:'Rules module',selectRoute:'Select Route',unlockHint:'Complete the previous route to unlock the next route',routeN:'Route {n}',available:'Available',backTitle:'Back to Title',controls:'←/→ or A/D to steer, ↑/Space/W to accelerate, ↓/S to brake.',locked:'Complete the previous route before challenging this one',points:'pts',noScores:'No records yet. Take your first run!',routeComplete:'{route} Complete!',challengeEnded:'Challenge Ended',routeLabel:'Route',scoreLabel:'Score',distanceLabel:'Distance',refuelLabel:'Fuel Pickups',collisionLabel:'Crashes',timeLabel:'Time',unlockedLabel:'Unlocked',nextRoute:'Challenge Next Route',retry:'Try Again',direction:'Steer',brake:'Brake',throttle:'Throttle',journeyProgress:'Route Progress',travelTime:'Travel Time',passedVehicles:'Passed',journeyDistance:'Distance',powerOutput:'Power',journeyEnergy:'Journey Energy',journeyReady:'Journey Ready',multiComing:'Multiplayer will open after server rooms are connected',skid:'Skidding! Counter-steer to recover!',refuel:'Fuel +{amount}'}
    };
    function rrLang(){var lang=(typeof _langCode!=='undefined'&&_langCode)||'en';return RR_COPY[lang]?lang:'en';}
    function rrText(key){var lang=rrLang(),copy=RR_COPY[lang]||RR_COPY.en;return copy[key]===undefined?(RR_COPY.en[key]||key):copy[key];}
    function rrFormat(key,values){var text=rrText(key),map=values||{};return text.replace(/\{([a-zA-Z0-9_]+)\}/g,function(_,name){return map[name]===undefined?'':map[name];});}
    function routeName(index){index=Math.max(0,Math.min(STAGE_COUNT-1,index|0));var st=STAGES[index]||STAGES[0],lang=rrLang(),place=(st.nameI18n&&(st.nameI18n[lang]||st.nameI18n.en||st.nameI18n.zhs))||st.name;return rrFormat('routeN',{n:index+1})+' · '+place;}
    function stageIndexAt(distance){return Math.max(0,Math.min(STAGE_COUNT-1,Math.floor(clamp(n(distance),0,TOTAL_LENGTH-0.001)/STAGE_LENGTH)));}
    function stageLocal(distance){var d=clamp(n(distance),0,TOTAL_LENGTH);return d-stageIndexAt(d)*STAGE_LENGTH;}
    function mergeT(local){return smooth(n(local)/85);}
    function splitActive(stage,local){return (stage|0)===0&&n(local)<135;}
    function driveCenterAt(local,stage){
        local=n(local);stage=stage|0;
        var base=roadCenterAt(stage*STAGE_LENGTH+local);
        return splitActive(stage,local)?base+3.05*(1-mergeT(local)):base;
    }
    function sideRoadCenterAt(local,stage){
        local=n(local);stage=stage|0;
        var base=roadCenterAt(stage*STAGE_LENGTH+local);
        return splitActive(stage,local)?base-3.05*(1-mergeT(local)):base;
    }
    function effectiveRoadWidth(width,local,stage){
        width=n(width,10);local=n(local);stage=stage|0;
        return splitActive(stage,local)?(5.15+(width-5.15)*mergeT(local)):width;
    }
    function sideRoadWidth(local,stage){
        local=n(local);stage=stage|0;
        if(!splitActive(stage,local))return 0;
        return 5.15*(1-smooth((local-45)/65));
    }
    function roadOuterBounds(local,stage,width){
        var cx=driveCenterAt(local,stage), half=n(width,10)*0.5, minX=cx-half, maxX=cx+half, bw=sideRoadWidth(local,stage);
        if(bw>0.08){
            var sc=sideRoadCenterAt(local,stage), bh=bw*0.5;
            minX=Math.min(minX,sc-bh);maxX=Math.max(maxX,sc+bh);
        }
        return {min:minX,max:maxX,center:(minX+maxX)*0.5,width:maxX-minX};
    }
    function esc(s){return String(s===undefined||s===null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
    function mat(color,opts){opts=opts||{};return new THREE.MeshStandardMaterial({color:color,roughness:opts.roughness===undefined?0.72:opts.roughness,metalness:opts.metalness||0,emissive:opts.emissive||0x000000,emissiveIntensity:opts.emissiveIntensity||0});}
    function colorFromCharacter(ch){var c=ch&&ch.style&&ch.style.color;if(!(typeof c==='number'&&isFinite(c)))c=ch&&ch.color;return (typeof c==='number'&&isFinite(c))?c:0x80EA7A;}
    function accentFromCharacter(ch){var c=ch&&ch.style&&ch.style.accent;if(!(typeof c==='number'&&isFinite(c)))c=ch&&ch.accent;return (typeof c==='number'&&isFinite(c))?c:0xffe15d;}
    function keyFromCharacter(ch){return String((ch&&(ch.canonicalId||ch.id||ch.key||ch.name))||'blossomTraveler').toLowerCase();}
    function charByIndex(i){
        var defs=(typeof CHAR_DEFS!=='undefined'&&CHAR_DEFS)||[];
        if(!defs.length)return {id:'blossomTraveler',name:'blossomTraveler',color:0xf5f5f0,accent:0xcc2222};
        i=Math.abs(i|0)%defs.length;return defs[i]||defs[0];
    }
    function addBox(parent,w,h,d,color,x,y,z){var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color));m.position.set(x||0,y||0,z||0);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
    function addWheel(parent,x,z){var geo=new THREE.CylinderGeometry(0.28,0.28,0.36,12);var mesh=new THREE.Mesh(geo,mat(0x252B35,{roughness:0.9}));mesh.rotation.z=Math.PI/2;mesh.position.set(x,0.28,z);mesh.castShadow=true;parent.add(mesh);return mesh;}
    function addCone(parent,r,h,color,x,y,z,rx,rz){var m=new THREE.Mesh(new THREE.ConeGeometry(r,h,10),mat(color));m.position.set(x||0,y||0,z||0);m.rotation.x=rx||0;m.rotation.z=rz||0;m.castShadow=true;parent.add(m);return m;}
    function addSoftShell(parent,w,h,d,color,x,y,z,opts){
        opts=opts||{};
        var radius=Math.max(0.18,Math.min(w*0.46,d*0.23)),length=Math.max(0.12,d-radius*2);
        var geo=new THREE.CapsuleGeometry(radius,length,opts.caps||5,opts.segments||12);
        var mesh=new THREE.Mesh(geo,mat(color,{roughness:opts.roughness===undefined?0.74:opts.roughness,metalness:opts.metalness||0,emissive:opts.emissive||0,emissiveIntensity:opts.emissiveIntensity||0}));
        mesh.rotation.x=Math.PI/2;mesh.scale.set(w/(radius*2),1,h/(radius*2));mesh.position.set(x||0,y||0,z||0);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
    }
    function addBlob(parent,rx,ry,rz,color,x,y,z,opts){
        opts=opts||{};var mesh=new THREE.Mesh(new THREE.SphereGeometry(1,opts.segments||10,opts.rings||7),mat(color,{roughness:opts.roughness===undefined?0.86:opts.roughness,emissive:opts.emissive||0,emissiveIntensity:opts.emissiveIntensity||0}));
        mesh.scale.set(rx,ry,rz);mesh.position.set(x||0,y||0,z||0);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
    }
    function addTravelBadge(parent,color,x,y,z){
        var badge=new THREE.Mesh(new THREE.CircleGeometry(0.17,12),mat(color,{roughness:0.72,emissive:color,emissiveIntensity:0.05}));
        badge.rotation.x=-Math.PI/2;badge.position.set(x||0,y||0,z||0);parent.add(badge);
        var mark=addBox(parent,0.18,0.025,0.045,0xfff8d9,x||0,(y||0)+0.015,(z||0)+0.01);mark.rotation.y=-0.38;return badge;
    }
    function blendColor(a,b,t){var c=new THREE.Color(a);c.lerp(new THREE.Color(b),clamp(t,0,1));return c.getHex();}
    function landscapeTexture(base,accent,seed,repeat,theme){
        var canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;var x=canvas.getContext('2d'),baseColor=new THREE.Color(base),accentColor=new THREE.Color(accent);
        x.fillStyle=baseColor.getStyle();x.fillRect(0,0,256,256);x.lineCap='round';x.lineJoin='round';
        for(var i=0;i<12;i++){
            var px=(seed*43+i*67)%310-27,py=(seed*71+i*47)%310-27,rx=35+((seed+i*29)%72),ry=24+((seed*3+i*17)%58),mix=0.18+((i+seed)%5)*0.075;
            x.globalAlpha=0.065+(i%4)*0.018;x.fillStyle=baseColor.clone().lerp(accentColor,mix).getStyle();x.beginPath();x.ellipse(px,py,rx,ry,(i%7)*0.23,0,Math.PI*2);x.fill();
        }
        if(theme==='suburb'){
            x.globalAlpha=0.11;x.strokeStyle=baseColor.clone().lerp(new THREE.Color(0xe8dfbd),0.48).getStyle();x.lineWidth=12;
            x.beginPath();x.moveTo(-18,205);x.bezierCurveTo(54,176,74,92,142,108);x.bezierCurveTo(198,122,214,52,280,43);x.stroke();
            x.globalAlpha=0.1;x.fillStyle=accentColor.clone().lerp(new THREE.Color(0xf1e8c8),0.35).getStyle();for(var sp=0;sp<7;sp++){x.beginPath();x.arc(22+sp*39,34+(sp%3)*71,6+(sp%2)*3,0,Math.PI*2);x.fill();}
        }else if(theme==='forest'){
            x.globalAlpha=0.12;x.fillStyle=baseColor.clone().multiplyScalar(0.72).getStyle();for(var fr=0;fr<15;fr++){x.beginPath();x.ellipse((fr*61+seed*9)%286-15,(fr*37+seed*13)%286-15,18+(fr%4)*7,13+(fr%3)*6,fr*0.31,0,Math.PI*2);x.fill();}
            x.globalAlpha=0.12;x.strokeStyle=new THREE.Color(0x6f563b).getStyle();x.lineWidth=5;for(var lg=0;lg<6;lg++){x.beginPath();x.moveTo(16+lg*46,50+(lg%2)*94);x.lineTo(38+lg*43,62+(lg%3)*88);x.stroke();}
        }else if(theme==='harbor'){
            x.globalAlpha=0.15;x.strokeStyle=new THREE.Color(0xd7f3ef).getStyle();x.lineWidth=5;for(var hw=0;hw<7;hw++){var hy=24+hw*34;x.beginPath();x.moveTo(-15,hy);x.bezierCurveTo(45,hy-13,78,hy+14,132,hy);x.bezierCurveTo(185,hy-13,220,hy+12,275,hy-2);x.stroke();}
            x.globalAlpha=0.09;x.fillStyle=new THREE.Color(0x356f82).getStyle();for(var hb=0;hb<5;hb++){x.beginPath();x.arc(32+hb*52,72+(hb%2)*116,5,0,Math.PI*2);x.fill();}
        }else if(theme==='coast'){
            x.globalAlpha=0.13;x.fillStyle=new THREE.Color(0xf2d99d).getStyle();for(var du=0;du<7;du++){x.beginPath();x.ellipse(18+du*43,42+(du%3)*82,34,16,du*0.17,0,Math.PI*2);x.fill();}
            x.globalAlpha=0.2;x.strokeStyle=new THREE.Color(0xe7fbf3).getStyle();x.lineWidth=4;for(var cw=0;cw<6;cw++){var cy=68+cw*31;x.beginPath();x.moveTo(-20,cy);x.bezierCurveTo(42,cy-9,78,cy+9,132,cy);x.bezierCurveTo(188,cy-9,218,cy+8,278,cy-1);x.stroke();}
        }else if(theme==='canyon'){
            x.globalAlpha=0.14;x.strokeStyle=new THREE.Color(0x85532f).getStyle();x.lineWidth=3;for(var cr=0;cr<7;cr++){var sx=18+cr*39,sy=12+(cr%3)*79;x.beginPath();x.moveTo(sx,sy);x.lineTo(sx+12,sy+18);x.lineTo(sx+4,sy+34);x.lineTo(sx+18,sy+49);x.stroke();}
            x.globalAlpha=0.1;x.fillStyle=new THREE.Color(0xe5bd65).getStyle();for(var cp=0;cp<8;cp++){x.beginPath();x.ellipse((cp*73+24)%258,(cp*47+61)%258,19+(cp%3)*8,11+(cp%2)*5,cp*0.4,0,Math.PI*2);x.fill();}
        }else if(theme==='farmland'){
            x.globalAlpha=0.13;x.strokeStyle=new THREE.Color(0xe9d377).getStyle();x.lineWidth=9;for(var rw=-2;rw<9;rw++){x.beginPath();x.moveTo(-30,rw*37+seed%19);x.lineTo(286,rw*37-62+seed%19);x.stroke();}
            x.globalAlpha=0.11;x.strokeStyle=new THREE.Color(0x6fac4f).getStyle();x.lineWidth=4;for(var gr=-1;gr<8;gr++){x.beginPath();x.moveTo(-20,gr*43+28);x.lineTo(278,gr*43-24);x.stroke();}
        }
        x.globalAlpha=0.065;x.strokeStyle=accentColor.getStyle();x.lineWidth=15;x.beginPath();x.moveTo(-20,72+(seed%4)*19);x.bezierCurveTo(68,30+(seed%5)*18,156,126-(seed%3)*17,282,64+(seed%6)*15);x.stroke();x.globalAlpha=1;
        var tex=new THREE.CanvasTexture(canvas);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(repeat||1.35,repeat||1.35);if(THREE.SRGBColorSpace)tex.colorSpace=THREE.SRGBColorSpace;tex.needsUpdate=true;return tex;
    }
    function landscapeMat(base,accent,seed,repeat,theme){return new THREE.MeshStandardMaterial({color:0xffffff,map:landscapeTexture(base,accent,seed,repeat,theme),roughness:0.94,metalness:0});}
    function addMiniDriver(parent,ch,scale,x,y,z,opts){
        opts=opts||{};
        var hero=!!opts.hero;
        var g=new THREE.Group(), bodyColor=colorFromCharacter(ch), accent=accentFromCharacter(ch), key=keyFromCharacter(ch);
        g.position.set(x||0,y||0,z||0);g.scale.setScalar(scale||1);
        if(hero){
            var seat=new THREE.Mesh(new THREE.TorusGeometry(0.48,0.055,8,30),mat(0xffffff,{roughness:0.55,emissive:accent,emissiveIntensity:0.08}));
            seat.rotation.x=Math.PI/2;seat.position.set(0,0.02,0);seat.castShadow=true;g.add(seat);
        }
        var body=new THREE.Mesh(new THREE.SphereGeometry(hero?0.46:0.38,hero?22:18,hero?16:12),mat(bodyColor,{roughness:0.82}));body.scale.set(0.9,1.06,0.84);body.position.y=0.08;body.castShadow=true;g.add(body);
        var head=new THREE.Mesh(new THREE.SphereGeometry(hero?0.37:0.3,hero?22:18,hero?16:12),mat(bodyColor,{roughness:0.82}));head.scale.set(0.98,0.92,0.94);head.position.set(0,hero?0.56:0.46,hero?0.02:0.08);head.castShadow=true;g.add(head);
        var eyeGeo=new THREE.SphereGeometry(hero?0.052:0.04,8,6), eyeMat=mat(0x1f2933);
        var e1=new THREE.Mesh(eyeGeo,eyeMat),e2=new THREE.Mesh(eyeGeo,eyeMat);e1.position.set(-0.1,0.5,0.34);e2.position.set(0.1,0.5,0.34);g.add(e1);g.add(e2);
        if(hero){
            e1.position.set(-0.13,0.61,-0.34);e2.position.set(0.13,0.61,-0.34);
            var shineGeo=new THREE.SphereGeometry(0.016,6,4), shineMat=mat(0xffffff,{emissive:0xffffff,emissiveIntensity:0.25});
            var sh1=new THREE.Mesh(shineGeo,shineMat),sh2=new THREE.Mesh(shineGeo,shineMat);sh1.position.set(-0.145,0.628,-0.377);sh2.position.set(0.115,0.628,-0.377);g.add(sh1);g.add(sh2);
            var cheekGeo=new THREE.SphereGeometry(0.045,8,6), cheekMat=mat(0xff8ba0,{roughness:0.8});
            var c1=new THREE.Mesh(cheekGeo,cheekMat),c2=new THREE.Mesh(cheekGeo,cheekMat);c1.scale.set(1.25,0.72,0.42);c2.scale.set(1.25,0.72,0.42);c1.position.set(-0.28,0.51,-0.32);c2.position.set(0.28,0.51,-0.32);g.add(c1);g.add(c2);
            addBox(g,0.44,0.08,0.07,accent,0,0.9,-0.06);
        }
        if(key.indexOf('herbtraveler')>=0){
            var herbStem=addBox(g,0.045,0.28,0.045,0x4f7d4d,0,0.72,0.04);herbStem.rotation.z=-0.12;
            addBlob(g,0.16,0.055,0.09,0x79ad62,-0.11,0.79,0.04,{roughness:0.9});
            addBlob(g,0.13,0.05,0.08,0x91c974,0.11,0.70,0.04,{roughness:0.9});
        }else if(key.indexOf('saltcrystaltraveler')>=0){
            addCone(g,0.10,0.31,0xbfe8f5,-0.12,0.74,0.02,0,-0.12);
            addCone(g,0.08,0.24,0xe8f8ff,0.10,0.70,0.03,0,0.16);
        }else if(key.indexOf('cloudwingtraveler')>=0){
            addBlob(g,0.17,0.08,0.10,0xf2f9ff,-0.13,0.70,0.02,{roughness:0.78});
            addBlob(g,0.19,0.09,0.11,0xe5f4ff,0.02,0.75,0.02,{roughness:0.78});
            addBlob(g,0.14,0.07,0.09,0xf8fcff,0.16,0.69,0.02,{roughness:0.78});
        }else if(key.indexOf('fruitbrewtraveler')>=0){
            addBlob(g,0.13,0.13,0.10,0xe96f6b,0,0.70,0.03,{roughness:0.62});
            var fruitLeaf=addBlob(g,0.12,0.04,0.07,0x6f9d54,0.09,0.82,0.03,{roughness:0.9});fruitLeaf.rotation.z=-0.48;
        }else if(key.indexOf('berrytraveler')>=0){
            [-1,0,1].forEach(function(i){addBlob(g,0.085,0.085,0.07,i===0?0x9d4b84:0xd26491,i*.10,0.70+Math.abs(i)*.045,0.03,{roughness:0.58});});
        }else if(key.indexOf('spicyflametraveler')>=0){
            var chili=addBlob(g,0.11,0.19,0.08,0xe85c3d,0,0.71,0.03,{roughness:0.8});chili.rotation.z=-0.45;
            var chiliLeaf=addCone(g,0.05,0.13,0x63844b,0.10,0.84,0.03,0,-0.55);chiliLeaf.rotation.z=-0.45;
        }else if(key.indexOf('goldengraintraveler')>=0){
            var wheatStem=addBox(g,0.035,0.34,0.035,0x9c7334,0,0.71,0.03);wheatStem.rotation.z=-0.15;
            for(var wi=-1;wi<=1;wi++){var grain=addBlob(g,0.055,0.10,0.05,0xe5bd58,wi*.065,0.75+wi*.07,0.03,{roughness:0.82});grain.rotation.z=wi*.3;}
        }else{
            var flowerCenter=addBlob(g,0.09,0.09,0.065,0xffd766,0,0.72,0.03,{roughness:0.72});
            for(var pi=0;pi<5;pi++){var pa=pi*Math.PI*2/5,petal=addBlob(g,0.11,0.055,0.065,accent,Math.cos(pa)*.13,0.72+Math.sin(pa)*.13,0.03,{roughness:0.82});petal.rotation.z=pa;}
        }
        parent.add(g);return g;
    }

    var fallback={
        levelLength:function(){return 3300;},
        maxFuel:function(){return 100;},
        roadWidthAt:function(distance){var d=clamp(n(distance),0,3300);if(d<420)return 10.8;if(d<880)return 11.4;if(d<1260)return 9.7;if(d<1710)return 11.1;if(d<2260)return 8.9;if(d<2860)return 10.2;return 11.7;},
        laneX:function(lane,width){lane=Math.max(0,Math.min(3,lane|0));var inner=n(width,10)*0.84;return -inner*0.5+inner*(lane+0.5)/4;},
        eventCount:function(){return 90;},
        eventAt:function(i){
            i=Math.max(0,Math.min(89,i|0));var j,z,l,t,b=0;
            if(i<18){j=i;z=46+j*38;l=(j*2+1)%4;t=(j===5||j===14)?5:(j%6===0?2:1);b=t===5?18:0;return [z,l,t,0,j%3,b];}
            if(i<42){j=i-18;z=970+j*45;l=(j*3+2)%4;t=(j===4||j===17)?5:(j%8===0?6:(j%7===0?4:(j%3===0?3:2)));b=t===5?20:0;return [z,l,t,0,j%4,b];}
            if(i<68){j=i-42;z=1880+j*40;l=(j*5+1)%4;t=(j===8||j===21)?5:(j%6===0?6:(j%7===2?4:(j%2===0?3:2)));b=t===5?22:0;return [z,l,t,0,j%5,b];}
            j=i-68;z=2850+j*29;l=(j*7+3)%4;t=(j===11)?5:(j%9===0?6:(j%5===0?4:(j%3===0?3:2)));b=t===5?24:0;return [z,l,t,0,j%6,b];
        },
        speedFor:function(turbo,brake,spinning,fuel){if(fuel<=0)return 0;var s=brake?26:(turbo?62:48);if(spinning)s=20;if(fuel<12)s*=0.72;return s;},
        speedStep:function(current,turbo,brake,spinning,fuel,dt){current=clamp(n(current),0,84);var target=fallback.speedFor(turbo,brake,spinning,fuel),rate;if(target>current)rate=turbo?50:36;else if(fuel<=0)rate=64;else if(spinning)rate=58;else if(brake)rate=56;else rate=26;if(current<5&&target>current)rate*=1.35;var maxDelta=rate*clamp(n(dt),0,0.08),delta=target-current;if(Math.abs(delta)<=maxDelta)return target;return clamp(current+(delta<0?-1:1)*maxDelta,0,84);},
        fuelAfter:function(fuel,dt,turbo,brake){var r=turbo?1.55:(brake?0.55:0.82);return clamp(n(fuel)-r*n(dt),0,100);},
        playerStep:function(x,vx,steer,dt,spinning,width){var control=spinning?0.22:1;vx+=clamp(steer,-1,1)*58*control*dt;var drag=Math.abs(steer)<0.01?10.0:4.8;vx*=clamp(1-drag*dt,0,1);vx=clamp(vx,-21,21);var half=width*0.5-0.68;x+=vx*dt;if(x>half){x=half;vx=-Math.abs(vx)*0.32;}if(x<-half){x=-half;vx=Math.abs(vx)*0.32;}return [x,vx];},
        collide:function(px,pz,ox,oz,t){var hx=1.1,hz=2.05;if(t===4){hx=1.55;hz=3.15;}else if(t===5){hx=1.18;hz=2.15;}else if(t===6){hx=1.65;hz=1.15;}else if(t===3){hx=1.16;hz=2.2;}else if(t===2){hx=1.2;hz=2.25;}return Math.abs(px-ox)<=hx&&Math.abs(pz-oz)<=hz;},
        score:function(progress,fuel,pickups,crashes,finished){var s=Math.floor(clamp(progress,0,3300)*3)+pickups*500+Math.floor(Math.max(0,fuel)*22)-crashes*350+(finished?2500:0);return Math.max(0,s);},
        finishReached:function(progress){return progress>=3300;}
    };

    function rules(){
        var a=api();
        return {
            mode:a?a.mode:'js-fallback',
            levelLength:function(){return a&&a.levelLength?a.levelLength():fallback.levelLength();},
            maxFuel:function(){return a&&a.maxFuel?a.maxFuel():fallback.maxFuel();},
            roadWidthAt:function(d){return a&&a.roadWidthAt?a.roadWidthAt(d):fallback.roadWidthAt(d);},
            laneX:function(l,w){return a&&a.laneX?a.laneX(l,w):fallback.laneX(l,w);},
            eventCount:function(){return a&&a.eventCount?a.eventCount():fallback.eventCount();},
            eventAt:function(i){return a&&a.eventAt?a.eventAt(i):fallback.eventAt(i);},
            speedFor:function(t,b,s,f){return a&&a.speedFor?a.speedFor(t,b,s,f):fallback.speedFor(t,b,s,f);},
            speedStep:function(cur,t,b,s,f,dt){return a&&a.speedStep?a.speedStep(cur,t,b,s,f,dt):fallback.speedStep(cur,t,b,s,f,dt);},
            fuelAfter:function(f,dt,t,b){return a&&a.fuelAfter?a.fuelAfter(f,dt,t,b):fallback.fuelAfter(f,dt,t,b);},
            playerStep:function(x,vx,st,dt,sp,w){return a&&a.playerStep?a.playerStep(x,vx,st,dt,sp,w):fallback.playerStep(x,vx,st,dt,sp,w);},
            collide:function(px,pz,ox,oz,t){return a&&a.collide?a.collide(px,pz,ox,oz,t):fallback.collide(px,pz,ox,oz,t);},
            score:function(p,f,pk,c,fin){return a&&a.score?a.score(p,f,pk,c,fin):fallback.score(p,f,pk,c,fin);},
            finishReached:function(p){return a&&a.finishReached?a.finishReached(p):fallback.finishReached(p);}
        };
    }

    function DanboRocketRoad(ctx){
        this.ctx=ctx;this.ch=ctx.character||{};this.R=rules();this.stageId=0;this.unlockedStage=this.getUnlockedStage();this.state='title';this.keys={};this.touch={};this.objects={};this.hitEvents={};this.eventCache=[];this.running=true;this.last=performance.now();this.menuIndex=0;this.toastTimer=0;
        if(ctx.api&&ctx.api.setTitle)ctx.api.setTitle(rrText('gameName'));
        this.root=document.createElement('div');this.root.className='rr-root';this.root.innerHTML=this.html();ctx.mount.appendChild(this.root);
        this.canvas=this.root.querySelector('canvas');this.panel=this.root.querySelector('.rr-panel');this.hud=this.root.querySelector('.rr-hud');this.toast=this.root.querySelector('.rr-toast');this.touchLayer=this.root.querySelector('.rr-touch');this.steerPad=this.root.querySelector('[data-steer-pad]');this.steerKnob=this.root.querySelector('.rr-steer-knob');this.countdownEl=this.root.querySelector('.rr-countdown');this.stageEl=this.root.querySelector('.rr-stage-banner');this.startRankEl=this.root.querySelector('.rr-start-rank');
        this.init3D();this.bind();this.showTitle();
        if(ctx.net)ctx.net.send('minigame.ready',{pluginId:ctx.pluginId,characterId:this.ch.id,build:BUILD});
        var self=this;this.raf=requestAnimationFrame(function(t){self.loop(t);});
    }

    DanboRocketRoad.prototype.html=function(){
        return '<style>'+
        '.rr-root{position:absolute;inset:0;overflow:hidden;background:#05070c;font-family:"Segoe UI",Arial,sans-serif;color:#fff;touch-action:none;}'+
        '.rr-root canvas{position:absolute;inset:0;width:100%;height:100%;display:block;}'+
        '.rr-panel{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(90vw,520px);max-height:calc(100vh - 24px);overflow-y:auto;box-sizing:border-box;padding:24px;border-radius:28px;background:linear-gradient(180deg,rgba(21,42,75,.92),rgba(9,18,38,.96));box-shadow:0 26px 70px rgba(0,0,0,.45),inset 0 0 0 3px rgba(255,255,255,.12);text-align:center;backdrop-filter:blur(8px);scrollbar-width:thin;}'+
        '.rr-title{font-size:36px;font-weight:1000;letter-spacing:.04em;color:#fff6a0;text-shadow:0 4px 0 #b95b1a,0 0 20px rgba(255,220,80,.55);margin:0 0 4px;}'+
        '.rr-sub{opacity:.85;font-size:14px;margin-bottom:18px;}'+
        '.rr-menu-btn{display:block;width:100%;border:0;border-radius:18px;margin:10px 0;padding:14px 16px;background:linear-gradient(180deg,#ffe180,#ffab3d);color:#5a2e08;font-size:18px;font-weight:1000;box-shadow:0 5px 0 #b85d1b;cursor:pointer;}'+
        '.rr-menu-btn:hover,.rr-menu-btn.rr-selected{filter:brightness(1.1);transform:translateY(-1px);}'+
        '.rr-menu-btn[disabled]{opacity:.48;filter:grayscale(.25);cursor:not-allowed;box-shadow:0 4px 0 #555;background:#bfc5cf;color:#334;}'+
        '.rr-small{font-size:12px;opacity:.75;line-height:1.55;margin-top:14px;}'+
        '.rr-hud{position:absolute;inset:0;display:none;pointer-events:none;font-family:"Segoe UI","Noto Sans SC",Arial,sans-serif;color:#21453f;}'+
        '.rr-route-progress{position:absolute;left:18px;right:126px;top:14px;height:48px;box-sizing:border-box;padding:8px 13px 8px 9px;border:1px solid rgba(255,255,255,.78);border-radius:18px;background:linear-gradient(135deg,rgba(246,255,238,.92),rgba(219,248,239,.87));box-shadow:0 8px 24px rgba(34,91,76,.2),inset 0 1px 0 rgba(255,255,255,.92);backdrop-filter:blur(9px);display:grid;grid-template-columns:32px minmax(70px,1fr) auto;align-items:center;gap:9px;}'+
        '.rr-route-icon{width:32px;height:32px;border-radius:50%;background:linear-gradient(145deg,#79dca6,#4bbbc0);color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;box-shadow:0 4px 10px rgba(44,156,137,.28);transform:rotate(-8deg);}'+
        '.rr-progress-copy{min-width:0;}'+
        '.rr-progress-label{font-size:11px;font-weight:800;letter-spacing:.05em;color:#3d6f64;line-height:1.2;margin-bottom:4px;}'+
        '.rr-progress-track{height:7px;border-radius:999px;background:rgba(69,124,107,.17);overflow:hidden;box-shadow:inset 0 1px 2px rgba(40,91,77,.16);}'+
        '.rr-progress-track i{display:block;height:100%;width:0;border-radius:inherit;background:linear-gradient(90deg,#66d391,#5bc9c4 58%,#f5c85d);box-shadow:0 0 10px rgba(84,199,169,.48);transition:width .18s linear;}'+
        '.rr-progress-pct{min-width:42px;text-align:right;font-size:18px;line-height:1;font-weight:900;color:#2c776c;}'+
        '.rr-travel-card{position:absolute;right:14px;top:70px;width:158px;box-sizing:border-box;padding:10px;border:1px solid rgba(255,255,255,.72);border-radius:20px;background:linear-gradient(160deg,rgba(247,255,241,.91),rgba(211,241,235,.87));box-shadow:0 10px 28px rgba(30,75,67,.22),inset 0 1px 0 rgba(255,255,255,.9);backdrop-filter:blur(9px);}'+
        '.rr-stat-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:7px;}'+
        '.rr-stat{min-width:0;padding:7px 6px;border-radius:13px;background:rgba(255,255,255,.56);box-shadow:inset 0 0 0 1px rgba(84,149,127,.1);}'+
        '.rr-stat-label{display:block;color:#578176;font-size:10px;font-weight:800;white-space:nowrap;}'+
        '.rr-stat-icon{font-size:13px;color:#45a98d;font-style:normal;}'+
        '.rr-stat-value{display:flex;align-items:center;gap:4px;margin-top:2px;color:#245a51;font-size:17px;line-height:1.05;font-weight:900;white-space:nowrap;}'+
        '.rr-distance{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:7px 2px 5px;color:#578176;font-size:10px;font-weight:800;}'+
        '.rr-distance b{color:#2c6a60;font-size:13px;white-space:nowrap;}'+
        '.rr-gauge{margin-top:7px;}'+
        '.rr-gauge-head{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:4px;color:#527d72;font-size:10px;font-weight:800;}'+
        '.rr-gauge-head span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}'+
        '.rr-gauge-head i{font-style:normal;color:#4bae91;}'+
        '.rr-gauge-track{height:7px;border-radius:999px;background:rgba(60,113,98,.15);overflow:hidden;box-shadow:inset 0 1px 2px rgba(39,88,74,.14);}'+
        '.rr-gauge-track i{display:block;height:100%;width:0;border-radius:inherit;transition:width .12s linear;}'+
        '.rr-gauge-track.power i{background:linear-gradient(90deg,#68c7d0,#6c9fe6);box-shadow:0 0 8px rgba(78,165,211,.34);}'+
        '.rr-gauge-track.energy i{background:linear-gradient(90deg,#75d68f,#f0d15f);box-shadow:0 0 8px rgba(106,203,125,.34);}'+
        '.rr-top-exit{position:absolute;right:14px;top:14px;min-width:96px;height:40px;pointer-events:auto;border:1px solid rgba(255,255,255,.75);border-radius:15px;padding:0 14px;background:linear-gradient(145deg,rgba(246,255,238,.94),rgba(214,244,234,.9));box-shadow:0 7px 20px rgba(31,82,70,.18);color:#2f6d61;font-weight:900;font-size:12px;}'+
        '.rr-top-exit:hover{filter:brightness(1.04);transform:translateY(-1px);}'+
        '.rr-start-rank{position:absolute;left:calc(50% - 46px);top:14%;transform:translateX(-50%);display:none;pointer-events:none;text-align:center;padding:9px 18px;border:1px solid rgba(255,255,255,.78);border-radius:20px;background:linear-gradient(135deg,rgba(245,255,238,.9),rgba(205,244,235,.86));box-shadow:0 10px 26px rgba(32,82,71,.22);backdrop-filter:blur(7px);}'+
        '.rr-start-rank span{display:inline-block;margin-right:7px;font-size:23px;line-height:1;color:#49ad95;transform:rotate(-10deg);}'+
        '.rr-start-rank b{font-size:clamp(16px,3vw,23px);line-height:1;color:#2c6c61;font-weight:900;}'+
        '.rr-sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important;}'+
        '.rr-toast{position:absolute;left:50%;bottom:22%;transform:translateX(-50%);padding:10px 16px;border-radius:18px;background:rgba(0,0,0,.66);font-weight:900;display:none;}'+
        '.rr-stage-banner{position:absolute;left:calc(50% - 46px);top:8%;transform:translate(-50%,-50%);display:none;pointer-events:none;padding:6px 14px;border:1px solid rgba(255,255,255,.76);border-radius:15px;background:linear-gradient(135deg,rgba(244,255,237,.92),rgba(205,243,235,.88));box-shadow:0 7px 20px rgba(30,75,67,.18);font-size:clamp(12px,3.3vw,17px);font-weight:900;color:#2d6b60;letter-spacing:.03em;white-space:nowrap;}'+
        '.rr-countdown{position:absolute;left:calc(50% - 46px);top:43%;transform:translate(-50%,-50%);display:none;pointer-events:none;font-size:clamp(56px,16vw,126px);font-weight:1000;color:#f9ffe9;text-shadow:0 7px 0 #45a990,0 0 28px rgba(172,255,217,.86),0 18px 40px rgba(20,72,61,.34);letter-spacing:.04em;}'+
        '.rr-touch{position:absolute;inset:0;display:none;pointer-events:none;}'+
        '.rr-steer-pad{position:absolute;left:24px;bottom:calc(92px + env(safe-area-inset-bottom));width:98px;height:98px;border-radius:50%;border:3px solid rgba(255,255,255,.38);background:radial-gradient(circle,rgba(255,255,255,.24),rgba(255,255,255,.08));box-shadow:0 7px 18px rgba(0,0,0,.26),inset 0 0 0 2px rgba(255,255,255,.13);pointer-events:auto;touch-action:none;}'+
        '.rr-steer-pad:before{content:attr(data-label);position:absolute;left:0;right:0;top:-22px;text-align:center;color:rgba(255,255,255,.82);font-size:12px;font-weight:1000;text-shadow:0 2px 3px #000;}'+
        '.rr-steer-knob{position:absolute;left:50%;top:50%;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(255,255,255,.72);box-shadow:0 5px 16px rgba(0,0,0,.35),inset 0 0 0 4px rgba(255,255,255,.42);color:#2c4762;font-size:18px;font-weight:1000;display:flex;align-items:center;justify-content:center;}'+
        '.rr-pedal{position:absolute;bottom:calc(82px + env(safe-area-inset-bottom));width:92px;height:44px;border-radius:14px 14px 22px 22px;border:2px solid rgba(255,255,255,.42);color:#fff;font-size:15px;font-weight:1000;pointer-events:auto;text-shadow:0 2px 3px #000;transform:skewX(-8deg);box-shadow:0 7px 14px rgba(0,0,0,.36),inset 0 5px 0 rgba(255,255,255,.18),inset 0 -5px 0 rgba(0,0,0,.18);}'+
        '.rr-pedal:after{content:"";position:absolute;left:12px;right:12px;top:9px;bottom:9px;border-radius:10px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.32) 0 4px,transparent 4px 12px);opacity:.65;pointer-events:none;}'+
        '.rr-throttle{right:96px;background:linear-gradient(180deg,rgba(255,230,105,.64),rgba(255,145,31,.58))!important;border-color:rgba(255,224,128,.7)!important;}'+
        '.rr-brake{right:224px;background:linear-gradient(180deg,rgba(135,220,255,.58),rgba(58,132,255,.48))!important;border-color:rgba(160,220,255,.72)!important;}'+
        '.rr-pedal.rr-pressed{filter:brightness(1.24);transform:skewX(-8deg) translateY(5px) scale(.98);box-shadow:0 4px 10px rgba(0,0,0,.42),0 0 22px rgba(255,232,120,.45),inset 0 4px 0 rgba(255,255,255,.16),inset 0 -3px 0 rgba(0,0,0,.24);}'+
        '.rr-list{margin:12px 0;text-align:left;background:rgba(255,255,255,.08);border-radius:18px;padding:12px 16px;line-height:1.8;}'+
        '@media (max-width:760px),(max-height:520px){.rr-title{font-size:28px}.rr-panel{padding:18px}.rr-touch{display:block}.rr-menu-btn{padding:12px;font-size:16px}.rr-route-progress{left:9px;right:86px;top:8px;height:40px;padding:6px 9px 6px 6px;border-radius:15px;grid-template-columns:28px minmax(54px,1fr) auto;gap:7px}.rr-route-icon{width:28px;height:28px;font-size:19px}.rr-progress-label{font-size:9px;margin-bottom:3px}.rr-progress-track{height:6px}.rr-progress-pct{min-width:35px;font-size:15px}.rr-top-exit{right:8px;top:8px;min-width:70px;height:40px;padding:0 9px;border-radius:14px;font-size:11px}.rr-travel-card{right:8px;top:56px;width:136px;padding:8px;border-radius:17px}.rr-stat-grid{grid-template-columns:1.22fr .78fr;gap:5px}.rr-stat{padding:5px 4px;border-radius:11px}.rr-stat-label{font-size:8px;gap:2px}.rr-stat-icon{font-size:11px}.rr-stat-value{font-size:15px}.rr-distance{margin:5px 1px 4px;font-size:8px}.rr-distance b{font-size:11px}.rr-gauge{margin-top:5px}.rr-gauge-head{font-size:8px;margin-bottom:3px}.rr-gauge-track{height:6px}.rr-countdown,.rr-stage-banner,.rr-start-rank{left:calc(50% - 42px)}.rr-start-rank{top:15%;padding:7px 12px}.rr-start-rank span{font-size:18px}.rr-start-rank b{font-size:14px}.rr-steer-pad{left:30px;bottom:calc(88px + env(safe-area-inset-bottom));width:88px;height:88px}.rr-steer-knob{width:40px;height:40px;margin:-20px 0 0 -20px}.rr-pedal{bottom:calc(92px + env(safe-area-inset-bottom));width:86px;height:42px}.rr-throttle{right:98px}.rr-brake{right:224px}}'+
        '</style><canvas></canvas><div class="rr-hud"><div class="rr-route-progress"><div class="rr-route-icon">≈</div><div class="rr-progress-copy"><div class="rr-progress-label">'+esc(rrText('journeyProgress'))+'</div><div class="rr-progress-track"><i data-progress-line></i></div></div><b class="rr-progress-pct" data-progress-pct>0%</b></div><button class="rr-top-exit" data-action="quit-run">'+esc(rrText('exit'))+'</button><div class="rr-travel-card"><div class="rr-stat-grid"><div class="rr-stat"><span class="rr-stat-label">'+esc(rrText('travelTime'))+'</span><b class="rr-stat-value"><i class="rr-stat-icon">◷</i><span data-time>0′00</span></b></div><div class="rr-stat"><span class="rr-stat-label">'+esc(rrText('passedVehicles'))+'</span><b class="rr-stat-value"><i class="rr-stat-icon">↗</i><span data-cars>0</span></b></div></div><div class="rr-distance"><span>'+esc(rrText('journeyDistance'))+'</span><b data-km>000Km</b></div><div class="rr-gauge"><div class="rr-gauge-head"><span>'+esc(rrText('powerOutput'))+'</span><i>≈</i></div><div class="rr-gauge-track power"><i data-rpm></i></div></div><div class="rr-gauge"><div class="rr-gauge-head"><span>'+esc(rrText('journeyEnergy'))+'</span><i>✦</i></div><div class="rr-gauge-track energy"><i data-fuel></i></div></div></div><span class="rr-sr-only" data-rank>40</span></div><div class="rr-start-rank"><span>≈</span><b>'+esc(rrText('journeyReady'))+'</b><i class="rr-sr-only" data-start-rank>40</i></div><div class="rr-panel"></div><div class="rr-stage-banner"></div><div class="rr-countdown"></div><div class="rr-toast"></div><div class="rr-touch"><div class="rr-steer-pad" data-steer-pad data-label="'+esc(rrText('direction'))+'"><div class="rr-steer-knob">↔</div></div><button class="rr-pedal rr-brake" data-touch="brake">'+esc(rrText('brake'))+'</button><button class="rr-pedal rr-throttle" data-touch="boost">'+esc(rrText('throttle'))+'</button></div>';
    };

    DanboRocketRoad.prototype.init3D=function(){
        this.renderer=new THREE.WebGLRenderer({canvas:this.canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
        this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
        if(THREE.SRGBColorSpace)this.renderer.outputColorSpace=THREE.SRGBColorSpace;
        this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x6bdd72);this.scene.fog=null;
        this.camera=new THREE.OrthographicCamera(-14,14,24,-22,0.1,220);this.camera.up.set(0,0,1);this.camera.position.set(0,72,5);this.camera.lookAt(0,0,5);
        var hemi=new THREE.HemisphereLight(0xffffff,0x7ccf68,1.65);this.scene.add(hemi);
        var sun=new THREE.DirectionalLight(0xfff3d5,1.25);sun.position.set(-16,42,-18);this.scene.add(sun);
        this.world=new THREE.Group();this.scene.add(this.world);
        this.roadGroup=new THREE.Group();this.world.add(this.roadGroup);
        this.objectGroup=new THREE.Group();this.world.add(this.objectGroup);
        this.sceneryGroup=new THREE.Group();this.world.add(this.sceneryGroup);
        this.startGridGroup=new THREE.Group();this.world.add(this.startGridGroup);
        this.roadSegments=[];this.decorItems=[];this.startGridCars=[];this.buildRoadSegments();this.buildScenery();this.buildStartGrid();this.finishGroup=this.buildFinishGate();this.world.add(this.finishGroup);this.player=this.buildPlayerCar();this.world.add(this.player);
        this.resize();
    };

    DanboRocketRoad.prototype.buildRoadSegments=function(){
        var roadGeo=new THREE.BoxGeometry(1,0.08,1), railGeo=new THREE.BoxGeometry(0.18,0.22,1), markGeo=new THREE.BoxGeometry(0.11,0.04,1.35), flowerGeo=new THREE.BoxGeometry(0.14,0.05,0.14);
        this.stageMats=STAGES.map(function(st,sid){return {
            road:mat(st.road,{roughness:0.9}),
            edge:mat(st.edge,{emissive:0x000000,emissiveIntensity:0}),
            mark:mat(0xf7f4e1,{emissive:0x111100,emissiveIntensity:0.04}),
            fields:[landscapeMat(st.fieldA,st.fieldB,11+sid*17,1.15,st.theme),landscapeMat(st.fieldB,st.fieldA,23+sid*17,1.3,st.theme),landscapeMat(st.fieldA,blendColor(st.fieldA,st.fieldB,0.55),37+sid*17,1.22,st.theme),landscapeMat(st.fieldB,blendColor(st.fieldB,st.fieldA,0.45),49+sid*17,1.38,st.theme)],
            ground:landscapeMat(st.fieldA,st.fieldB,67+sid*19,2.35,st.theme)
        };});
        var roadMat=this.stageMats[0].road, edgeMat=this.stageMats[0].edge, markMat=this.stageMats[0].mark;
        var fieldMats=this.stageMats[0].fields,
            flowerMats=[mat(0xffef66,{emissive:0x443300,emissiveIntensity:0.06}),mat(0xff7db5,{emissive:0x331122,emissiveIntensity:0.06}),mat(0xffffff),mat(0x48c9ff,{emissive:0x113344,emissiveIntensity:0.05})];
        for(var i=0;i<24;i++){
            var g=new THREE.Group();
            var road=new THREE.Mesh(roadGeo,roadMat);road.scale.set(10,1,ROAD_SEG_LEN+0.35);road.receiveShadow=true;g.add(road);g.road=road;
            var lf=new THREE.Mesh(roadGeo,fieldMats[i%fieldMats.length]), rf=new THREE.Mesh(roadGeo,fieldMats[(i+2)%fieldMats.length]);g.fieldSpan=18;lf.scale.set(g.fieldSpan,0.45,ROAD_SEG_LEN+0.35);rf.scale.set(g.fieldSpan,0.45,ROAD_SEG_LEN+0.35);lf.position.y=rf.position.y=-0.03;lf.visible=rf.visible=false;lf.receiveShadow=rf.receiveShadow=true;g.add(lf);g.add(rf);g.leftField=lf;g.rightField=rf;
            var l=new THREE.Mesh(railGeo,edgeMat), r=new THREE.Mesh(railGeo,edgeMat);l.scale.z=r.scale.z=ROAD_SEG_LEN+0.35;l.position.y=r.position.y=0.22;g.add(l);g.add(r);g.leftRail=l;g.rightRail=r;
            g.marks=[];for(var m=0;m<3;m++){var mk=new THREE.Mesh(markGeo,markMat);mk.position.y=0.08;g.add(mk);g.marks.push(mk);}
            var br=new THREE.Mesh(roadGeo,roadMat);br.scale.set(5.15,1,ROAD_SEG_LEN+0.35);br.position.y=0.005;br.receiveShadow=true;br.visible=false;g.add(br);g.branchRoad=br;
            g.branchRails=[];for(var brs=0;brs<2;brs++){var brRail=new THREE.Mesh(railGeo,edgeMat);brRail.scale.z=ROAD_SEG_LEN+0.35;brRail.position.y=0.23;brRail.visible=false;g.add(brRail);g.branchRails.push(brRail);}
            g.branchMarks=[];for(var bm=0;bm<2;bm++){var bmk=new THREE.Mesh(markGeo,markMat);bmk.position.y=0.09;bmk.visible=false;g.add(bmk);g.branchMarks.push(bmk);}
            g.flowers=[];for(var f=0;f<12;f++){var fl=new THREE.Mesh(flowerGeo,flowerMats[(i+f)%flowerMats.length]);fl.position.y=0.07;fl.receiveShadow=true;g.add(fl);g.flowers.push(fl);}
            this.roadGroup.add(g);this.roadSegments.push(g);
        }
        var grassGeo=new THREE.PlaneGeometry(260,260);var grass=new THREE.Mesh(grassGeo,this.stageMats[0].ground);grass.rotation.x=-Math.PI/2;grass.position.y=-0.08;grass.receiveShadow=true;this.ground=grass;this.world.add(grass);
    };

    DanboRocketRoad.prototype.buildPlayerCar=function(){
        var g=new THREE.Group(),bodyColor=0xf27b62,trimColor=0xf6cf68,glassColor=0x8fd8de;
        addSoftShell(g,1.65,0.5,2.75,bodyColor,0,0.46,0,{roughness:0.72});
        addSoftShell(g,1.5,0.16,2.5,0xf7dd9a,0,0.3,0,{roughness:0.82});
        addSoftShell(g,1.2,0.38,1.22,trimColor,0,0.82,-0.02,{roughness:0.76});
        addSoftShell(g,0.88,0.12,0.68,glassColor,0,1.055,0.25,{roughness:0.38});
        addBox(g,0.92,0.08,0.12,0xf9f2dc,0,0.64,1.31);
        addBox(g,1.02,0.07,0.66,0x7d5a3d,0,0.84,-0.85);
        addBox(g,0.08,0.08,0.72,0xe9d7b7,-0.45,0.91,-0.85);addBox(g,0.08,0.08,0.72,0xe9d7b7,0.45,0.91,-0.85);
        addSoftShell(g,0.56,0.24,0.38,0x6db48b,-0.22,1.0,-0.84,{roughness:0.9});
        addSoftShell(g,0.38,0.2,0.32,0xeaa75f,0.3,0.98,-0.84,{roughness:0.9});
        addTravelBadge(g,0x5fc49e,0,0.79,0.86);
        addWheel(g,-0.92,-0.82);addWheel(g,0.92,-0.82);addWheel(g,-0.92,0.86);addWheel(g,0.92,0.86);
        var flagPole=addBox(g,0.035,0.28,0.035,0xf3ead7,0.52,1.02,-0.98);flagPole.rotation.z=-0.08;
        var flag=new THREE.Mesh(new THREE.PlaneGeometry(0.32,0.2),new THREE.MeshStandardMaterial({color:0x76cfa4,roughness:0.78,side:THREE.DoubleSide}));flag.rotation.x=-Math.PI/2;flag.rotation.z=-0.18;flag.position.set(0.38,1.18,-0.98);g.add(flag);
        var trail=new THREE.Group(),trailMat=new THREE.MeshBasicMaterial({color:0x9bead1,transparent:true,opacity:0.62,depthWrite:false});
        for(var ti=0;ti<3;ti++){var streak=new THREE.Mesh(new THREE.SphereGeometry(0.18,8,6),trailMat);streak.scale.set(0.72-ti*0.14,0.22,1.8+ti*0.45);streak.position.set((ti-1)*0.31,0,-0.42-ti*0.38);trail.add(streak);}
        trail.position.set(0,0.4,-1.48);g.add(trail);g.flame=trail;
        g.driver=addMiniDriver(g,this.ch,1.52,0,1.25,-0.34,{hero:true});
        g.position.set(0,0.2,PLAYER_Z);return g;
    };

    DanboRocketRoad.prototype.makeObject=function(type,id){
        var g=new THREE.Group();type=type|0;g.userData.type=type;
        if(type===6){
            var mud=new THREE.Mesh(new THREE.CylinderGeometry(1.25,1.55,0.04,24),mat(0x735d45,{roughness:0.98}));mud.scale.z=0.62;mud.position.y=0.06;g.add(mud);
            addBlob(g,0.58,0.025,0.32,0x9b805d,-0.38,0.09,0.08,{segments:8,rings:5});addBlob(g,0.42,0.024,0.25,0x5f7550,0.48,0.095,-0.18,{segments:8,rings:5});
            for(var li=0;li<4;li++){var leaf=addBox(g,0.2,0.025,0.08,li%2?0xc28b45:0x7ca35b,-0.58+li*0.38,0.12,(li%2?0.28:-0.3));leaf.rotation.y=-0.55+li*0.38;}
            return g;
        }
        var color=type===2?0xe9876d:(type===3?0x6da6d9:(type===4?0x70b39a:(type===5?0xe7bf58:0xe6c66f)));
        var w=type===4?2.1:1.45,d=type===4?3.9:2.55,h=type===4?0.78:0.46;
        addSoftShell(g,w,h,d,color,0,0.42,0,{roughness:0.8});
        if(type===4){
            addSoftShell(g,w*0.82,0.62,d*0.5,0xd9c39a,0,0.86,-0.68,{roughness:0.9});
            addSoftShell(g,w*0.72,0.34,d*0.24,0x9ed9dc,0,0.9,1.15,{roughness:0.44});
            addBox(g,w*0.66,0.08,0.1,0xf3ead5,0,0.67,1.82);
        }else{
            addSoftShell(g,w*0.74,0.34,d*0.43,type===5?0xf6f0d5:0x9ed9dc,0,0.82,0.2,{roughness:type===5?0.82:0.44});
            addBox(g,w*0.58,0.06,d*0.3,0x806549,0,0.86,-0.68);
            if(type===1){addSoftShell(g,0.46,0.2,0.32,0x77ae78,-0.2,0.98,-0.66,{roughness:0.9});addTravelBadge(g,0x5bb898,0,0.72,0.92);}
            else if(type===2){addSoftShell(g,0.62,0.22,0.34,0xe9b25d,0,0.98,-0.66,{roughness:0.9});addBox(g,0.08,0.05,0.55,0xf3e3c0,-0.48,0.72,-0.62);addBox(g,0.08,0.05,0.55,0xf3e3c0,0.48,0.72,-0.62);}
            else if(type===3){addBox(g,0.56,0.14,0.38,0xf4e7c2,0,0.98,-0.65);addTravelBadge(g,0xf3c85f,0,0.75,0.92);}
        }
        addWheel(g,-w*0.58,-d*0.28);addWheel(g,w*0.58,-d*0.28);addWheel(g,-w*0.58,d*0.32);addWheel(g,w*0.58,d*0.32);
        if(type!==5)g.driver=addMiniDriver(g,charByIndex((id||0)*3+type),type===4?0.72:0.62,0,0.92,0.16);
        if(type===5){
            for(var si=0;si<3;si++){var supply=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.16,0.48,10),mat(si===1?0x7fcf9e:0xf5e7ad,{roughness:0.72}));supply.rotation.z=Math.PI/2;supply.position.set(-0.36+si*0.36,1.02,-0.48);g.add(supply);}
            var halo=new THREE.Mesh(new THREE.TorusGeometry(1.18,0.055,8,28),mat(0x8ee3b5,{emissive:0x43c98c,emissiveIntensity:0.36}));halo.rotation.x=Math.PI/2;halo.position.y=1.08;g.add(halo);g.halo=halo;
        }
        return g;
    };

    DanboRocketRoad.prototype.makeDecor=function(kind){
        var g=new THREE.Group();kind=kind|0;g.userData.kind=kind;
        if(kind===0){
            var trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.27,1.3,8),mat(0x8b6746,{roughness:0.96}));trunk.position.y=0.65;g.add(trunk);
            var branch=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.12,0.82,7),mat(0x8b6746,{roughness:0.96}));branch.position.set(0.24,1.12,0);branch.rotation.z=-0.62;g.add(branch);
            addBlob(g,0.78,0.68,0.7,0x55ba68,-0.26,1.72,0,{segments:10,rings:7});addBlob(g,0.72,0.62,0.64,0x6aca72,0.38,1.88,0.06,{segments:10,rings:7});addBlob(g,0.56,0.5,0.52,0x83d47b,0.02,2.25,-0.04,{segments:9,rings:6});
            addBlob(g,0.42,0.22,0.38,0x3fae62,-0.82,0.24,0.22,{segments:8,rings:5});addBlob(g,0.36,0.19,0.34,0x75c96c,0.68,0.2,-0.18,{segments:8,rings:5});
        }else if(kind===1){
            addBox(g,2.75,0.14,1.85,0x8bc979,0,0.07,0.02);
            addBox(g,2.3,1.15,1.24,0xf3d9ae,0,0.64,0);
            var roof=new THREE.Mesh(new THREE.ConeGeometry(1.72,0.72,4),mat(0xc96f5d,{roughness:0.9}));roof.scale.z=0.72;roof.rotation.y=Math.PI/4;roof.position.y=1.55;g.add(roof);
            addBox(g,0.44,0.66,0.08,0x79573f,0,0.4,0.67);addBox(g,0.42,0.28,0.06,0x91d5dc,-0.72,0.82,0.66);addBox(g,0.42,0.28,0.06,0x91d5dc,0.72,0.82,0.66);
            addBox(g,1.5,0.08,0.5,0xc39b67,0,0.16,0.98);addBox(g,1.35,0.08,0.12,0x8a6947,0,0.4,1.12);addBox(g,0.12,0.42,0.12,0x8a6947,-0.55,0.22,1.12);addBox(g,0.12,0.42,0.12,0x8a6947,0.55,0.22,1.12);
            addBox(g,0.09,0.78,0.09,0x876345,-1.56,0.39,0.62);addSoftShell(g,0.48,0.28,0.34,0x6ca7a1,-1.56,0.78,0.62,{roughness:0.88});
            for(var fp=0;fp<5;fp++){addBox(g,0.08,0.34,0.08,0xd7b77a,-1.3+fp*0.64,0.17,-1.03);addBox(g,0.54,0.07,0.08,0xcfa76b,-1.04+fp*0.64,0.34,-1.03);}
        }else if(kind===2){
            addBox(g,2.9,0.12,1.55,0xb7d5b0,0,0.06,0.18);
            addBox(g,2.3,1.02,1.05,0xf2e4bd,0,0.57,0.15);addBox(g,2.6,0.18,1.34,0x6eb5a0,0,1.14,0.15);
            addBox(g,2.72,0.12,0.62,0xe8cc82,0,1.02,0.9);addBox(g,0.5,0.5,0.06,0x87cbd4,-0.72,0.38,0.73);addBox(g,0.5,0.5,0.06,0x87cbd4,0.72,0.38,0.73);
            addBox(g,1.25,0.1,0.42,0x947354,-1.8,0.42,0.54);addBox(g,0.12,0.7,0.12,0x806145,-2.25,0.36,0.54);addBox(g,0.12,0.7,0.12,0x806145,-1.35,0.36,0.54);
            addBox(g,0.12,1.85,0.12,0x876344,1.65,0.92,0.5);addBox(g,1.35,0.34,0.12,0x70bd9d,2.18,1.52,0.5);addBox(g,0.72,0.24,0.13,0xf2d46f,2.32,1.08,0.5);
            addBlob(g,0.4,0.22,0.36,0x5bbd72,1.8,0.2,-0.5,{segments:8,rings:5});addBlob(g,0.32,0.18,0.3,0x84cc75,2.32,0.18,-0.35,{segments:8,rings:5});
        }else if(kind===3){
            addBox(g,0.1,2.15,0.1,0x92704d,0,1.08,0);
            for(var b=0;b<4;b++){var ribbon=addBox(g,0.62-b*0.07,0.06,0.16,[0x70c8a0,0xf1c968,0xe98c73,0x83b8d8][b],0.28+(b%2)*0.08,1.8-b*0.38,0);ribbon.rotation.y=(b%2?0.18:-0.2);}
            addBlob(g,0.42,0.18,0.34,0x66b875,-0.34,0.18,0.16,{segments:8,rings:5});
        }else if(kind===4){
            addBlob(g,1.18,0.18,0.5,0x43ad67,0,0.1,0.08,{segments:10,rings:5});
            for(var f=0;f<7;f++){addBlob(g,0.15+(f%2)*0.04,0.13,0.15,f%3===0?0xf3ca64:(f%3===1?0xe98eaa:0xf7efe0),-0.92+f*0.31,0.27,(f%2)*0.22,{segments:8,rings:5});}
        }else if(kind===5){
            addBlob(g,0.62,0.16,0.48,0x819b70,0,0.08,0,{segments:9,rings:5});addBox(g,0.13,2.1,0.13,0x886448,0,1.05,0);
            var signA=addBox(g,1.25,0.32,0.1,0x67b79b,0.38,1.7,0);signA.rotation.z=-0.06;
            var signB=addBox(g,1.05,0.28,0.1,0xe5bd65,-0.34,1.28,0);signB.rotation.z=0.07;
            addBox(g,0.48,0.06,0.12,0xf7f0d8,0.58,1.7,0.06).rotation.z=-0.06;addBox(g,0.4,0.06,0.12,0xf7f0d8,-0.5,1.28,0.06).rotation.z=0.07;
        }else if(kind===6){
            addSoftShell(g,2.75,0.14,6.8,0xb89060,0,0.17,0,{roughness:0.96});
            for(var s=0;s<5;s++)addBox(g,2.62,0.025,0.07,s%2?0xd8b57c:0xc69c65,0,0.25,-2.7+s*1.35);
            addBox(g,0.12,0.7,7.1,0x7e6044,-1.55,0.45,0);addBox(g,0.12,0.7,7.1,0x7e6044,1.55,0.45,0);
            for(var bp=0;bp<3;bp++){addBox(g,0.09,0.72,0.09,0x98734e,-1.55,0.46,-2.7+bp*2.7);addBox(g,0.09,0.72,0.09,0x98734e,1.55,0.46,-2.7+bp*2.7);}
            for(var ww=0;ww<4;ww++)addSoftShell(g,0.5,0.025,1.1,0xd9f7ee,(ww%2?-2.05:2.05),0.08,-2.4+ww*1.55,{roughness:0.7});
        }else if(kind===8){
            addBlob(g,1.7,0.08,3.7,0xe8cf93,-0.72,0.07,0,{segments:18,rings:8});addBlob(g,1.05,0.055,2.5,0xf1dda7,1.12,0.075,0.45,{segments:16,rings:7});
            for(var w=0;w<5;w++){addSoftShell(g,1.7-(w%2)*0.24,0.028,0.15,0xd9faf2,1.3,0.12,-2.8+w*1.42,{roughness:0.72});addBlob(g,0.22,0.14,0.18,w%2?0xa89a7d:0xc3b28c,-1.2,0.17,-2.7+w*1.35,{segments:8,rings:5});}
            for(var cg=0;cg<7;cg++){var grass=addBox(g,0.055,0.5+(cg%3)*0.12,0.055,cg%2?0x78a95c:0x91b96a,-2.0+(cg%3)*0.24,0.25,-3+cg*0.95);grass.rotation.z=(cg%2?0.28:-0.28);}
            var parasol=new THREE.Mesh(new THREE.ConeGeometry(0.72,0.25,12),mat(0xf28c72,{roughness:0.84}));parasol.position.set(0.1,0.52,1.75);parasol.rotation.y=0.18;g.add(parasol);addBox(g,0.07,0.85,0.07,0xf1e5c8,0.1,0.32,1.75);
        }else if(kind===9){
            for(var r=0;r<6;r++){var rock=new THREE.Mesh(new THREE.DodecahedronGeometry(0.55+(r%3)*0.16,0),mat(r%2?0x9a633d:0xb47848,{roughness:0.98}));rock.scale.set(1.15,0.72+(r%2)*0.25,0.82);rock.position.set((r%2?0.42:-0.28),0.35+(r%2)*0.14,-3+r*1.2);rock.rotation.set(r*0.17,r*0.43,r*0.11);g.add(rock);}
            addBlob(g,0.34,0.2,0.3,0x79945a,-0.85,0.18,-1.45,{segments:8,rings:5});addBlob(g,0.28,0.16,0.24,0xa6a15e,-0.72,0.15,1.65,{segments:8,rings:5});
        }else if(kind===10){
            addBlob(g,2.1,0.07,4.15,0xd2b95f,0,0.055,0,{segments:18,rings:8});
            for(var fy=0;fy<7;fy++)addSoftShell(g,3.25,0.04,0.16,fy%2?0xe5d27d:0xcaa747,0,0.12,-3.15+fy*1.04,{roughness:0.96});
            for(var fx=0;fx<4;fx++)addSoftShell(g,0.055,0.06,6.75,fx%2?0xe6cb68:0xb9963f,-1.18+fx*0.79,0.16,0,{roughness:0.96});
            addBox(g,0.1,1.65,0.1,0x886546,1.35,0.82,-2.35);for(var blade=0;blade<4;blade++){var wb=addBox(g,0.12,0.92,0.06,0xf2e7c7,1.35,1.56,-2.35);wb.rotation.z=blade*Math.PI/2;}
            addBox(g,0.1,0.58,7.2,0xa57d4d,-1.72,0.32,0);for(var pp=0;pp<6;pp++)addBox(g,0.1,0.7,0.1,0x8f6b45,-1.72,0.35,-3+pp*1.2);
        }else if(kind===11){
            addBlob(g,1.55,0.07,2.15,0xb8d99a,-0.42,0.06,-0.48,{segments:18,rings:8});addBlob(g,1.28,0.065,1.7,0xa8cf8c,0.75,0.065,0.82,{segments:16,rings:7});
            var pathA=addSoftShell(g,0.55,0.05,2.15,0xe7deb9,-0.58,0.13,-0.62,{roughness:0.95});pathA.rotation.y=0.34;var pathB=addSoftShell(g,0.52,0.05,1.95,0xefe5c4,0.42,0.13,0.85,{roughness:0.95});pathB.rotation.y=-0.38;
            addBox(g,1.32,0.12,0.46,0x9a744f,0.6,0.5,0.72);addBox(g,0.1,0.82,0.1,0x806044,0.1,0.41,0.72);addBox(g,0.1,0.82,0.1,0x806044,1.1,0.41,0.72);
            addBox(g,0.1,1.85,0.1,0x6e7165,-1.28,0.92,-0.35);var lamp=new THREE.Mesh(new THREE.SphereGeometry(0.24,12,8),mat(0xffefb0,{emissive:0xffd36b,emissiveIntensity:0.22,roughness:0.54}));lamp.position.set(-1.28,1.88,-0.35);g.add(lamp);
            addBlob(g,0.52,0.25,0.48,0x5fbf70,1.25,0.22,-1.15,{segments:9,rings:6});addBlob(g,0.38,0.2,0.34,0x82cf78,0.82,0.18,-1.42,{segments:9,rings:6});
        }else if(kind===12){
            addBlob(g,2.25,0.055,3.85,0x3d8e48,0,0.04,0,{segments:18,rings:8});
            for(var ft=0;ft<3;ft++){var tx=-1.05+ft*1.05,tz=-1.8+(ft%2)*2.8;var tr=new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.24,1.2,8),mat(0x79583e,{roughness:0.98}));tr.position.set(tx,0.6,tz);g.add(tr);addBlob(g,0.72,0.62,0.66,ft%2?0x4fa85a:0x377f47,tx,1.5,tz,{segments:10,rings:7});addBlob(g,0.5,0.46,0.48,0x6abc62,tx+0.34,1.72,tz-0.18,{segments:9,rings:6});}
            var log=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.25,2.2,9),mat(0x8e6543,{roughness:0.98}));log.rotation.z=Math.PI/2;log.rotation.y=0.28;log.position.set(0.25,0.27,0.35);g.add(log);
            for(var mu=0;mu<4;mu++){var cap=new THREE.Mesh(new THREE.SphereGeometry(0.12,8,5),mat(mu%2?0xf0d07a:0xe98972,{roughness:0.92}));cap.scale.y=0.55;cap.position.set(-0.5+mu*0.34,0.18,1.55+(mu%2)*0.24);g.add(cap);}
        }else if(kind===13){
            addSoftShell(g,2.35,0.13,5.9,0xa9794d,0,0.16,0,{roughness:0.96});for(var dp=0;dp<5;dp++)addBox(g,2.28,0.025,0.07,dp%2?0xd0a36c:0xbd8b58,0,0.25,-2.3+dp*1.18);
            for(var mp=0;mp<4;mp++){var mx=mp%2?-1.34:1.34,mz=-2.25+Math.floor(mp/2)*4.5;var post=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.15,0.9,9),mat(0x76553e,{roughness:0.98}));post.position.set(mx,0.45,mz);g.add(post);}
            addBox(g,0.72,0.52,0.72,0xe2b96f,-0.42,0.28,0.55);addBox(g,0.62,0.44,0.62,0x6da8a0,0.48,0.24,-0.1);
            for(var by=0;by<3;by++){var buoy=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.22,0.45,10),mat(by%2?0xfff1ce:0xee806a,{roughness:0.76}));buoy.position.set(1.9,0.23,-1.65+by*1.7);g.add(buoy);}
        }else if(kind===14){
            addBlob(g,2.2,0.08,3.9,0xe9ce8d,0,0.06,0,{segments:18,rings:8});addBlob(g,1.35,0.06,2.45,0xf3dfa7,-0.85,0.08,-0.55,{segments:16,rings:7});
            for(var dg=0;dg<9;dg++){var blade2=addBox(g,0.05,0.52+(dg%3)*0.12,0.05,dg%2?0x6e9e58:0x87ae62,-1.45+(dg%3)*0.25,0.25,-3.1+dg*0.72);blade2.rotation.z=dg%2?0.3:-0.3;}
            for(var sh=0;sh<5;sh++){var shell=new THREE.Mesh(new THREE.TorusGeometry(0.13+(sh%2)*0.04,0.035,6,12,Math.PI*1.35),mat(sh%2?0xf1a984:0xffe5c2,{roughness:0.86}));shell.rotation.x=Math.PI/2;shell.rotation.z=sh*0.6;shell.position.set(0.45+(sh%2)*0.65,0.13,-2.3+sh*1.08);g.add(shell);}
            for(var sw=0;sw<4;sw++)addSoftShell(g,1.35,0.025,0.14,0xdff9f1,1.72,0.1,-2.25+sw*1.45,{roughness:0.7});
        }else if(kind===15){
            addBlob(g,2.3,0.07,3.9,0xc88c3f,0,0.05,0,{segments:18,rings:8});
            for(var rr=0;rr<8;rr++){var crk=new THREE.Mesh(new THREE.DodecahedronGeometry(0.48+(rr%3)*0.18,0),mat(rr%2?0x925936:0xb86f3f,{roughness:0.99}));crk.scale.set(1.25,0.7+(rr%2)*0.35,0.86);crk.position.set((rr%2?0.72:-0.56)+(rr%3)*0.18,0.36+(rr%2)*0.16,-3.1+rr*0.86);crk.rotation.set(rr*0.14,rr*0.47,rr*0.09);g.add(crk);}
            addBlob(g,0.48,0.2,0.44,0x788854,-1.25,0.18,1.4,{segments:8,rings:5});for(var twig=0;twig<4;twig++){var dry=addBox(g,0.045,0.72,0.045,0x765338,1.25,0.35,-1.2);dry.rotation.z=-0.55+twig*0.35;}
        }else if(kind===16){
            addBlob(g,2.25,0.065,3.9,0xcdb457,0,0.05,0,{segments:18,rings:8});for(var crop=0;crop<7;crop++)addSoftShell(g,3.35,0.035,0.13,crop%2?0xe7cf72:0xb9943f,0,0.12,-3.05+crop*1.0,{roughness:0.98});
            addBox(g,0.1,1.58,0.1,0x866142,1.28,0.79,-2.18);for(var fb=0;fb<4;fb++){var blade3=addBox(g,0.11,0.88,0.055,0xf1e6c7,1.28,1.48,-2.18);blade3.rotation.z=fb*Math.PI/2;}
            addBox(g,0.09,0.55,6.5,0xa57a47,-1.7,0.3,0);for(var fence=0;fence<6;fence++)addBox(g,0.11,0.72,0.11,0x8d6742,-1.7,0.36,-2.8+fence*1.12);
            for(var hay=0;hay<3;hay++){var bale=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.42,0.55,12),mat(0xe0bd57,{roughness:0.98}));bale.rotation.z=Math.PI/2;bale.position.set(0.25+hay*0.63,0.43,1.65+(hay%2)*0.45);g.add(bale);}
        }else{
            addBox(g,1.75,0.07,2.65,0xb9d69b,0,0.04,0);
            addBox(g,1.25,0.12,0.45,0x9b7650,0,0.48,0.45);addBox(g,0.12,0.86,0.12,0x826043,-0.5,0.43,0.45);addBox(g,0.12,0.86,0.12,0x826043,0.5,0.43,0.45);
            addBox(g,1.4,0.04,1.0,0xe7ad78,0,0.09,-0.72);addBox(g,0.62,0.035,0.42,0xf2d06f,-0.28,0.12,-0.75);addBox(g,0.62,0.035,0.42,0x73b69b,0.35,0.125,-0.47);
            addBox(g,0.11,1.3,0.11,0x8b6746,0.82,0.65,-0.42);addBox(g,0.82,0.25,0.1,0x6cb69a,1.15,1.12,-0.42);
            addBlob(g,0.36,0.2,0.32,0x5eaf68,-0.75,0.18,0.82,{segments:8,rings:5});
        }
        g.traverse(function(o){if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
        return g;
    };

    DanboRocketRoad.prototype.buildScenery=function(){
        this.decorItems=[];
        var length=this.R.levelLength?this.R.levelLength():3300, sid=this.stageId||0, st=STAGES[sid]||STAGES[0];
        for(var i=0;i<104;i++){
            var abs=18+i*34+(i%5)*5;if(abs>length+220)break;
            for(var s=0;s<2;s++){
                var side=s?1:-1, kind;
                if(side>0&&i%5===1)kind=st.decor[(i+s)%st.decor.length];else if(i%9===0)kind=st.decor[(i+2+s)%st.decor.length];else kind=st.decor[(i+s*3)%st.decor.length];
                var mesh=this.makeDecor(kind), isBuilding=(kind===1||kind===2||kind===11), isLandscape=(kind===6||kind===8||kind===10||kind===13||kind===14||kind===15||kind===16);
                var off=(kind===6||kind===13)?3.85:(isLandscape?(2.75+((i+s)%2)*0.42):(isBuilding?(0.72+((i+s)%3)*0.4):(2.05+((i+s)%4)*0.72)));
                this.decorItems.push({abs:abs+(s?10:0),side:side,offset:off,kind:kind,mesh:mesh,scale:(kind===6||kind===13)?0.94:(isLandscape?(0.86+((i+s)%3)*0.08):(isBuilding?(1.02+((i+s)%3)*0.1):(0.84+((i+s)%3)*0.12))),spin:(i%7)*0.2});
                this.sceneryGroup.add(mesh);
            }
        }
    };

    DanboRocketRoad.prototype.rebuildScenery=function(){
        if(!this.sceneryGroup)return;
        while(this.sceneryGroup.children.length)this.sceneryGroup.remove(this.sceneryGroup.children[0]);
        this.decorItems=[];this.buildScenery();
    };

    DanboRocketRoad.prototype.buildStartGrid=function(){
        this.startGridCars=[];
        var slots=[
            {lane:0,z:7,type:1,offset:0.18,yaw:-0.045},{lane:2,z:15,type:2,offset:-0.12,yaw:0.035},
            {lane:1,z:26,type:3,offset:0.24,yaw:-0.025},{lane:3,z:38,type:1,offset:-0.2,yaw:0.05},
            {lane:0,z:53,type:4,offset:0.08,yaw:-0.035},{lane:2,z:69,type:2,offset:0.2,yaw:0.025},
            {lane:3,z:86,type:1,offset:-0.16,yaw:-0.04},{lane:1,z:104,type:3,offset:0.1,yaw:0.035},
            {lane:0,z:125,type:1,offset:0.2,yaw:-0.03},{lane:3,z:148,type:4,offset:-0.14,yaw:0.04},
            {lane:1,z:173,type:2,offset:0.16,yaw:-0.025},{lane:2,z:200,type:1,offset:-0.18,yaw:0.03}
        ];
        for(var i=0;i<slots.length;i++){
            var s=slots[i], mesh=this.makeObject(s.type,100+i);
            mesh.visible=false;this.startGridGroup.add(mesh);
            this.startGridCars.push({mesh:mesh,lane:s.lane,z:s.z,type:s.type,offset:s.offset||0,yaw:s.yaw||0,launch:10+i*3});
        }
    };

    DanboRocketRoad.prototype.buildFinishGate=function(){
        var g=new THREE.Group();g.visible=false;
        var arrivalMat=mat(0x8bd9b2,{roughness:0.82}), ringMat=mat(0xffd76e,{roughness:0.7,emissive:0x6b4a12,emissiveIntensity:0.04});
        var arrivalPad=new THREE.Mesh(new THREE.CylinderGeometry(1,1,0.07,40),arrivalMat);arrivalPad.position.y=0.08;arrivalPad.scale.set(1.7,1,1.25);arrivalPad.receiveShadow=true;g.add(arrivalPad);g.arrivalPad=arrivalPad;
        var routeRing=new THREE.Mesh(new THREE.TorusGeometry(0.72,0.1,8,32),ringMat);routeRing.rotation.x=Math.PI/2;routeRing.position.y=0.17;g.add(routeRing);g.routeRing=routeRing;
        var needle=addBox(g,0.13,0.05,0.92,0xfff3cf,0,0.19,0.05);needle.rotation.y=-0.48;var needleTip=addSoftShell(g,0.3,0.055,0.48,0xf08a6c,0.2,0.2,-0.3,{roughness:0.75});needleTip.rotation.y=-0.48;
        g.routeDots=[];for(var d=0;d<4;d++){var dot=new THREE.Mesh(new THREE.SphereGeometry(0.13-d*0.012,10,7),mat(d%2?0xffd76e:0x73cdb0,{roughness:0.78}));dot.scale.y=0.38;dot.position.set((d%2?-0.28:0.3),0.15,1.25+d*0.55);g.add(dot);g.routeDots.push(dot);}
        var poleMat=mat(0x826449,{roughness:0.96});
        g.leftPole=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.16,3.25,10),poleMat);g.rightPole=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.16,3.25,10),poleMat);g.leftPole.position.y=g.rightPole.position.y=1.62;g.add(g.leftPole);g.add(g.rightPole);
        g.topBar=new THREE.Mesh(new THREE.BoxGeometry(1,0.2,0.2),mat(0x72b995,{roughness:0.84}));g.topBar.position.y=3.14;g.add(g.topBar);
        var banner=new THREE.Group();addSoftShell(banner,3.65,0.22,0.82,0x6bc3a4,0,3.24,0,{roughness:0.78});
        var badge=new THREE.Mesh(new THREE.TorusGeometry(0.24,0.065,8,24),ringMat);badge.rotation.x=Math.PI/2;badge.position.set(0,3.48,0);banner.add(badge);addBox(banner,0.07,0.04,0.32,0xfff4d1,0,3.5,0).rotation.y=-0.45;
        addBlob(banner,0.25,0.12,0.22,0x9fd57c,-1.42,3.38,0,{segments:9,rings:5});addBlob(banner,0.25,0.12,0.22,0x9fd57c,1.42,3.38,0,{segments:9,rings:5});g.add(banner);g.banner=banner;g.flags=[];
        return g;
    };

    DanboRocketRoad.prototype.bind=function(){
        var self=this;
        this.onResize=function(){self.resize();};window.addEventListener('resize',this.onResize);
        this.onKeyDown=function(e){
            if(!self.running)return;var code=e.code||e.key;self.keys[code]=true;
            if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space','KeyA','KeyD','KeyW','KeyS','Enter','Escape'].indexOf(code)>=0){e.preventDefault();e.stopImmediatePropagation();}
            if(self.state==='title'){
                if(code==='Enter'||code==='Space')self.startGame();
                else if(code==='Escape')self.exit();
            }else if(self.state==='scores'){
                if(code==='Escape'||code==='Enter'||code==='Space')self.showTitle();
            }else if(self.state==='result'){
                if(code==='Enter'||code==='Space')self.startGame();
                else if(code==='Escape')self.showTitle();
            }else if((self.state==='playing'||self.state==='countdown')&&code==='Escape')self.finish(false,'quit');
        };
        this.onKeyUp=function(e){self.keys[e.code||e.key]=false;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space','KeyA','KeyD','KeyW','KeyS'].indexOf(e.code||e.key)>=0){e.preventDefault();e.stopImmediatePropagation();}};
        window.addEventListener('keydown',this.onKeyDown,true);window.addEventListener('keyup',this.onKeyUp,true);
        this.onClick=function(e){var b=e.target&&e.target.closest?e.target.closest('[data-action]'):null;if(!b||b.disabled)return;var a=b.getAttribute('data-action');if(a==='single')self.showStages();else if(a==='stage')self.startGame(Number(b.getAttribute('data-stage')||0));else if(a==='next-stage')self.startGame(Math.min(STAGE_COUNT-1,(self.stageId||0)+1));else if(a==='multi')self.showToast(rrText('multiComing'));else if(a==='scores')self.showScores();else if(a==='exit')self.exit();else if(a==='title')self.showTitle();else if(a==='retry')self.startGame(self.stageId||0);else if(a==='quit-run')self.finish(false,'quit');};
        this.root.addEventListener('click',this.onClick);
        function resetSteer(){self.touch.steer=0;if(self.steerKnob)self.steerKnob.style.transform='translateX(0px)';}
        function steerFromEvent(e){
            if(!self.steerPad)return;
            var r=self.steerPad.getBoundingClientRect(), dx=e.clientX-(r.left+r.width*0.5), v=clamp(dx/(r.width*0.32),-1,1);
            self.touch.steer=v;if(self.steerKnob)self.steerKnob.style.transform='translateX('+Math.round(v*r.width*0.25)+'px)';
        }
        this.onPointer=function(e){
            var b=e.target&&e.target.closest?e.target.closest('[data-touch]'):null;if(!b)return;e.preventDefault();
            var k=b.getAttribute('data-touch'), down=e.type==='pointerdown';self.touch[k]=down&&e.type!=='pointercancel';
            b.classList.toggle('rr-pressed',!!self.touch[k]);
            if(down){var ac=self.ensureAudio();if(ac&&ac.state==='suspended'&&ac.resume)ac.resume();}
        };
        this.onSteerDown=function(e){if(!self.steerPad)return;e.preventDefault();self.steerPointer=e.pointerId;if(self.steerPad.setPointerCapture)try{self.steerPad.setPointerCapture(e.pointerId);}catch(_e){}steerFromEvent(e);var ac=self.ensureAudio();if(ac&&ac.state==='suspended'&&ac.resume)ac.resume();};
        this.onSteerMove=function(e){if(self.steerPointer!==e.pointerId)return;e.preventDefault();steerFromEvent(e);};
        this.onSteerEnd=function(e){if(self.steerPointer!==e.pointerId)return;e.preventDefault();self.steerPointer=null;resetSteer();if(self.steerPad&&self.steerPad.releasePointerCapture)try{self.steerPad.releasePointerCapture(e.pointerId);}catch(_e2){};};
        this.touchLayer.addEventListener('pointerdown',this.onPointer);this.touchLayer.addEventListener('pointerup',this.onPointer);this.touchLayer.addEventListener('pointercancel',this.onPointer);this.touchLayer.addEventListener('pointerleave',this.onPointer);
        if(this.steerPad){this.steerPad.addEventListener('pointerdown',this.onSteerDown);this.steerPad.addEventListener('pointermove',this.onSteerMove);this.steerPad.addEventListener('pointerup',this.onSteerEnd);this.steerPad.addEventListener('pointercancel',this.onSteerEnd);}
    };

    DanboRocketRoad.prototype.resize=function(){
        var w=this.root.clientWidth||innerWidth,h=this.root.clientHeight||innerHeight;this.renderer.setSize(w,h,false);
        var aspect=w/h, halfH=23, panel=(w<=760?84:92), xShift=(panel/w)*halfH*aspect*0.9;
        this.camera.left=-halfH*aspect+xShift;this.camera.right=halfH*aspect+xShift;this.camera.top=24;this.camera.bottom=-22;this.camera.updateProjectionMatrix();
    };

    DanboRocketRoad.prototype.showTitle=function(){
        this.stopMusic();this.state='title';this.hud.style.display='none';this.touchLayer.style.display='none';this.panel.style.display='block';this.countdownEl.style.display='none';this.stageEl.style.display='none';if(this.startRankEl)this.startRankEl.style.display='none';
        var mode=(api()&&api().mode)||'js-fallback';
        this.panel.innerHTML='<h1 class="rr-title">🚗 '+esc(rrText('gameName'))+'</h1><div class="rr-sub">'+esc(rrText('subtitle'))+'</div>'+
            '<button class="rr-menu-btn rr-selected" data-action="single">'+esc(rrText('single'))+'</button>'+
            '<button class="rr-menu-btn" data-action="multi">'+esc(rrText('multi'))+' <span style="font-size:12px;opacity:.7">'+esc(rrText('developing'))+'</span></button>'+
            '<button class="rr-menu-btn" data-action="scores">'+esc(rrText('scores'))+'</button>'+
            '<button class="rr-menu-btn" data-action="exit">'+esc(rrText('exit'))+'</button>'+
            '<div class="rr-small">'+esc(rrText('overview'))+'<br>'+esc(rrText('rules'))+': '+esc(mode)+' · build '+BUILD+'</div>';
    };

    DanboRocketRoad.prototype.showStages=function(){
        this.stopMusic();this.state='stageSelect';this.hud.style.display='none';this.touchLayer.style.display='none';this.panel.style.display='block';this.countdownEl.style.display='none';this.stageEl.style.display='none';if(this.startRankEl)this.startRankEl.style.display='none';
        var unlocked=this.getUnlockedStage(), html='<h1 class="rr-title">🗺️ '+esc(rrText('selectRoute'))+'</h1><div class="rr-sub">'+esc(rrText('unlockHint'))+'</div>';
        for(var i=0;i<STAGE_COUNT;i++){
            var locked=i>unlocked;
            html+='<button class="rr-menu-btn" '+(locked?'disabled ':'')+'data-action="stage" data-stage="'+i+'">'+(locked?'🔒 ':'')+esc(routeName(i))+(locked?'':' <span style="font-size:12px;opacity:.72">'+esc(rrText('available'))+'</span>')+'</button>';
        }
        html+='<button class="rr-menu-btn" data-action="title">'+esc(rrText('backTitle'))+'</button><div class="rr-small">'+esc(rrText('controls'))+'</div>';
        this.panel.innerHTML=html;
    };

    DanboRocketRoad.prototype.startGame=function(stageId){
        stageId=clamp(stageId|0,0,STAGE_COUNT-1);
        if(stageId>this.getUnlockedStage()){this.showToast(rrText('locked'));this.showStages();return;}
        this.stageId=stageId;this.rebuildScenery();
        this.state='countdown';this.panel.style.display='none';this.hud.style.display='flex';this.touchLayer.style.display=(('ontouchstart' in window)||(navigator.maxTouchPoints>0))?'block':'none';
        this.R=rules();this.progress=0;this.fuel=this.R.maxFuel();this.speed=0;this.score=0;this.pickups=0;this.crashes=0;this.carX=0;this.carVx=0;this.spin=0;this.spinDir=1;this.elapsed=0;this.netAcc=0;this.hitEvents={};this.throttleSfxT=0;this.brakeSfxT=0;this.touch={steer:0};if(this.steerKnob)this.steerKnob.style.transform='translateX(0px)';
        this.countdown=3.15;this.countdownText='';this.countdownEl.textContent='3';this.countdownEl.style.display='block';this.stageEl.textContent=routeName(this.stageId);this.stageEl.style.display='block';if(this.startRankEl)this.startRankEl.style.display='block';this.startMusic();
        for(var k in this.objects){if(this.objects[k]&&this.objects[k].mesh)this.objects[k].mesh.visible=false;}
        if(this.ctx.net)this.ctx.net.send('minigame.startIntent',{pluginId:this.ctx.pluginId,characterId:this.ch.id,mode:'single',stage:this.stageId,seed:BUILD});
    };

    DanboRocketRoad.prototype.showScores=function(){
        this.stopMusic();this.state='scores';this.hud.style.display='none';this.touchLayer.style.display='none';this.panel.style.display='block';this.countdownEl.style.display='none';this.stageEl.style.display='none';if(this.startRankEl)this.startRankEl.style.display='none';
        var scores=this.getScores();var rows=scores.length?scores.map(function(s,i){return '<div><b>#'+(i+1)+'</b> '+esc(s.name||'Traveler')+' — '+esc(s.score)+' '+esc(rrText('points'))+' <span style="opacity:.75">'+esc(routeName(s.stage||0))+'</span> <span style="opacity:.55">'+esc(s.date||'')+'</span></div>';}).join(''):'<div style="text-align:center;opacity:.75">'+esc(rrText('noScores'))+'</div>';
        this.panel.innerHTML='<h1 class="rr-title">🏆 '+esc(rrText('scores'))+'</h1><div class="rr-list">'+rows+'</div><button class="rr-menu-btn" data-action="title">'+esc(rrText('backTitle'))+'</button>';
    };

    DanboRocketRoad.prototype.finish=function(win,reason){
        if(this.state!=='playing'&&this.state!=='countdown')return;this.stopMusic();if(win)this.playFinishJingle();this.state='result';this.hud.style.display='none';this.touchLayer.style.display='none';this.panel.style.display='block';this.countdownEl.style.display='none';this.stageEl.style.display='none';if(this.startRankEl)this.startRankEl.style.display='none';
        var finalScore=this.R.score(this.progress,this.fuel,this.pickups,this.crashes,win?1:0);this.score=finalScore;this.saveScore(finalScore);
        if(win)this.unlockStage(this.stageId||0);
        if(this.ctx.net)this.ctx.net.send('minigame.finishIntent',{pluginId:this.ctx.pluginId,stage:this.stageId||0,score:finalScore,finished:!!win,reason:reason||'',time:this.elapsed,crashes:this.crashes,pickups:this.pickups});
        var nextOk=win&&(this.stageId||0)<STAGE_COUNT-1, stageName=routeName(this.stageId);
        this.panel.innerHTML='<h1 class="rr-title">'+(win?'🧭 '+esc(rrFormat('routeComplete',{route:stageName})):'💥 '+esc(rrText('challengeEnded')))+'</h1>'+
            '<div class="rr-list"><div>'+esc(rrText('routeLabel'))+': <b>'+esc(stageName)+'</b></div><div>'+esc(rrText('scoreLabel'))+': <b>'+finalScore+'</b></div><div>'+esc(rrText('distanceLabel'))+': '+Math.floor(clamp(this.progress/this.R.levelLength()*100,0,100))+'%</div><div>'+esc(rrText('refuelLabel'))+': '+this.pickups+'</div><div>'+esc(rrText('collisionLabel'))+': '+this.crashes+'</div><div>'+esc(rrText('timeLabel'))+': '+this.elapsed.toFixed(1)+'s</div>'+(nextOk?'<div>'+esc(rrText('unlockedLabel'))+': <b>'+esc(routeName((this.stageId||0)+1))+'</b></div>':'')+'</div>'+
            (nextOk?'<button class="rr-menu-btn" data-action="next-stage">'+esc(rrText('nextRoute'))+'</button>':'')+
            '<button class="rr-menu-btn" data-action="retry">'+esc(rrText('retry'))+'</button><button class="rr-menu-btn" data-action="single">'+esc(rrText('selectRoute'))+'</button><button class="rr-menu-btn" data-action="scores">'+esc(rrText('scores'))+'</button><button class="rr-menu-btn" data-action="title">'+esc(rrText('backTitle'))+'</button><button class="rr-menu-btn" data-action="exit">'+esc(rrText('exit'))+'</button>';
    };

    DanboRocketRoad.prototype.getUnlockedStage=function(){
        var v=this.ctx.storage&&this.ctx.storage.get('rocketRoadUnlockedStage',0);
        return clamp(v|0,0,STAGE_COUNT-1);
    };
    DanboRocketRoad.prototype.unlockStage=function(stage){
        var next=clamp((stage|0)+1,0,STAGE_COUNT-1);
        if(next>this.getUnlockedStage()&&this.ctx.storage)this.ctx.storage.set('rocketRoadUnlockedStage',next);
        this.unlockedStage=this.getUnlockedStage();
    };
    DanboRocketRoad.prototype.getScores=function(){return (this.ctx.storage&&this.ctx.storage.get('rocketRoadScores',[]))||[];};
    DanboRocketRoad.prototype.saveScore=function(score){var list=this.getScores();list.push({stage:this.stageId||0,stageName:routeName(this.stageId||0),score:score,name:this.ch.displayName||this.ch.name||'Traveler',date:new Date().toISOString().slice(0,10)});list.sort(function(a,b){return b.score-a.score;});list=list.slice(0,12);if(this.ctx.storage)this.ctx.storage.set('rocketRoadScores',list);};
    DanboRocketRoad.prototype.showToast=function(text){this.toast.textContent=text;this.toast.style.display='block';this.toastTimer=2.2;};
    DanboRocketRoad.prototype.exit=function(){this.stopMusic();if(this.ctx.net)this.ctx.net.send('minigame.stopIntent',{pluginId:this.ctx.pluginId,status:'exit'});this.ctx.api.finish({status:'exit',pluginId:this.ctx.pluginId});};

    DanboRocketRoad.prototype.ensureAudio=function(){
        if(this.audioCtx)return this.audioCtx;
        var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;
        this.audioCtx=new AC();this.musicGain=this.audioCtx.createGain();this.musicGain.gain.value=0.055;this.musicGain.connect(this.audioCtx.destination);
        this.sfxGain=this.audioCtx.createGain();this.sfxGain.gain.value=0.22;this.sfxGain.connect(this.audioCtx.destination);return this.audioCtx;
    };

    DanboRocketRoad.prototype.tone=function(freq,dur,delay,type,gain){
        var ctx=this.ensureAudio();if(!ctx||!this.musicGain)return;
        var when=ctx.currentTime+(delay||0), osc=ctx.createOscillator(), g=ctx.createGain();
        osc.type=type||'square';osc.frequency.setValueAtTime(freq,when);
        g.gain.setValueAtTime(0.0001,when);g.gain.linearRampToValueAtTime(gain||0.18,when+0.015);g.gain.exponentialRampToValueAtTime(0.0001,when+Math.max(0.04,dur||0.12));
        osc.connect(g);g.connect(this.musicGain);osc.start(when);osc.stop(when+(dur||0.12)+0.05);
    };

    DanboRocketRoad.prototype.startMusic=function(){
        var ctx=this.ensureAudio();if(!ctx)return;this.stopMusic(false);if(ctx.state==='suspended'&&ctx.resume)ctx.resume();
        var self=this, melody=[392,494,587,659,587,494,440,392,330,392,494,587,740,659,587,494], bass=[196,196,247,247,220,220,196,196];
        this.musicPlaying=true;this.musicBeat=0;
        var tick=function(){
            if(!self.musicPlaying||!self.running)return;
            var i=self.musicBeat++,
                lead=melody[i%melody.length],
                b=bass[Math.floor(i/2)%bass.length];
            self.tone(lead,0.12,0,'square',0.12);
            if(i%2===0)self.tone(b,0.18,0,'triangle',0.08);
            if(i%8===6)self.tone(lead*1.5,0.08,0.04,'sine',0.055);
            self.musicTimer=setTimeout(tick,145);
        };
        tick();
    };

    DanboRocketRoad.prototype.stopMusic=function(){
        this.musicPlaying=false;if(this.musicTimer){clearTimeout(this.musicTimer);this.musicTimer=0;}
    };

    DanboRocketRoad.prototype.playCountdownBeep=function(go){
        this.tone(go?784:523,go?0.22:0.12,0,go?'square':'sine',go?0.26:0.2);
        if(go)this.tone(1175,0.18,0.06,'square',0.14);
    };

    DanboRocketRoad.prototype.playFinishJingle=function(){
        this.tone(523,0.15,0,'square',0.22);this.tone(659,0.15,0.16,'square',0.22);this.tone(784,0.16,0.32,'square',0.22);this.tone(1046,0.32,0.5,'triangle',0.24);
    };

    DanboRocketRoad.prototype.sfxTone=function(freq,dur,type,gain,endFreq){
        var ctx=this.ensureAudio();if(!ctx||!this.sfxGain)return;if(ctx.state==='suspended'&&ctx.resume)ctx.resume();
        var when=ctx.currentTime, osc=ctx.createOscillator(), g=ctx.createGain();
        osc.type=type||'sawtooth';osc.frequency.setValueAtTime(freq,when);
        if(endFreq)osc.frequency.exponentialRampToValueAtTime(Math.max(20,endFreq),when+Math.max(0.03,dur||0.1));
        g.gain.setValueAtTime(0.0001,when);g.gain.linearRampToValueAtTime(gain||0.12,when+0.012);g.gain.exponentialRampToValueAtTime(0.0001,when+Math.max(0.04,dur||0.1));
        osc.connect(g);g.connect(this.sfxGain);osc.start(when);osc.stop(when+(dur||0.1)+0.04);
    };

    DanboRocketRoad.prototype.playThrottleSfx=function(){
        var base=90+clamp(this.speed||0,0,68)*2.1;
        this.sfxTone(base,0.105,'sawtooth',0.10,base*1.35);
        this.sfxTone(base*0.52,0.12,'triangle',0.055,base*0.64);
    };

    DanboRocketRoad.prototype.playBrakeSfx=function(){
        this.sfxTone(520,0.16,'sawtooth',0.12,210);
        this.sfxTone(880,0.08,'square',0.045,420);
    };

    DanboRocketRoad.prototype.updateControlSfx=function(inp,dt){
        if(this.state!=='playing')return;
        if(inp.turbo){this.throttleSfxT=(this.throttleSfxT||0)-dt;if(this.throttleSfxT<=0){this.playThrottleSfx();this.throttleSfxT=0.105;}}else this.throttleSfxT=0;
        if(inp.brake){this.brakeSfxT=(this.brakeSfxT||0)-dt;if(this.brakeSfxT<=0){this.playBrakeSfx();this.brakeSfxT=0.18;}}else this.brakeSfxT=0;
    };

    DanboRocketRoad.prototype.inputState=function(){
        var left=this.keys.ArrowLeft||this.keys.KeyA||this.touch.left,right=this.keys.ArrowRight||this.keys.KeyD||this.touch.right;
        var pad=n(this.touch.steer,0), steer=Math.abs(pad)>0.04?-pad:((left?1:0)-(right?1:0));
        return {steer:steer,turbo:!!(this.keys.ArrowUp||this.keys.KeyW||this.keys.Space||this.touch.boost),brake:!!(this.keys.ArrowDown||this.keys.KeyS||this.touch.brake)};
    };

    DanboRocketRoad.prototype.updateCountdown=function(dt){
        this.countdown-=dt;
        var text=this.countdown>2.15?'3':(this.countdown>1.15?'2':(this.countdown>0.15?'1':'GO!'));
        if(text!==this.countdownText){this.countdownText=text;this.countdownEl.textContent=text;this.countdownEl.style.display='block';this.playCountdownBeep(text==='GO!');}
        if(this.countdown<=-0.32){this.state='playing';this.countdownEl.style.display='none';this.stageEl.style.display='none';if(this.startRankEl)this.startRankEl.style.display='none';this.countdownText='';}
    };

    DanboRocketRoad.prototype.updatePlaying=function(dt){
        this.elapsed+=dt;var inp=this.inputState(), width=effectiveRoadWidth(this.R.roadWidthAt(this.progress),this.progress,this.stageId||0);
        this.updateControlSfx(inp,dt);
        var step=this.R.playerStep(this.carX,this.carVx,inp.steer,dt,this.spin>0?1:0,width);this.carX=step[0];this.carVx=step[1];
        if(this.spin>0)this.spin=Math.max(0,this.spin-dt);
        this.targetSpeed=this.R.speedFor(inp.turbo?1:0,inp.brake?1:0,this.spin>0?1:0,this.fuel);
        this.speed=this.R.speedStep(this.speed||0,inp.turbo?1:0,inp.brake?1:0,this.spin>0?1:0,this.fuel,dt);
        this.progress+=this.speed*dt;this.fuel=this.R.fuelAfter(this.fuel,dt,inp.turbo?1:0,inp.brake?1:0);
        this.checkCollisions();
        if(Math.abs(this.carX)>width*0.5-0.82&&this.spin<=0){this.crash(0.8,this.carX>0?-1:1,2.4);}
        this.score=this.R.score(this.progress,this.fuel,this.pickups,this.crashes,0);
        this.netAcc+=dt;if(this.ctx.net&&this.netAcc>0.2){this.netAcc=0;this.ctx.net.send('input.drive',{steer:inp.steer,turbo:inp.turbo,brake:inp.brake,progress:this.progress});}
        if(this.R.finishReached(this.progress))this.finish(true,'finish');else if(this.fuel<=0.01)this.finish(false,'fuel');
    };

    DanboRocketRoad.prototype.crash=function(duration,dir,fuelLoss){this.spin=Math.max(this.spin,duration||1);this.spinDir=dir||1;this.crashes++;this.fuel=clamp(this.fuel-(fuelLoss||6),0,this.R.maxFuel());this.carVx+=this.spinDir*8;this.showToast(rrText('skid'));};

    DanboRocketRoad.prototype.checkCollisions=function(){
        var count=this.R.eventCount();
        for(var i=0;i<count;i++){
            if(this.hitEvents[i])continue;var ev=this.R.eventAt(i), type=ev[2]|0, rel=this.eventRel(ev,i,type);if(rel<-4||rel>6)continue;
            var width=effectiveRoadWidth(this.R.roadWidthAt(ev[0]),ev[0],this.stageId||0),x=driveCenterAt(ev[0],this.stageId||0)+this.R.laneX(ev[1]|0,width);x+=this.objectSway(type,ev[4],i);
            var px=driveCenterAt(this.progress||0,this.stageId||0)+(this.carX||0);
            if(this.R.collide(px,0,x,rel,type)){
                this.hitEvents[i]=true;
                if(type===5){this.pickups++;this.fuel=clamp(this.fuel+(ev[5]||20),0,this.R.maxFuel());this.showToast(rrFormat('refuel',{amount:Math.floor(ev[5]||20)}));if(this.objects[i])this.objects[i].mesh.visible=false;}
                else if(type===6){this.crash(0.95,(this.carX<x?-1:1),2.5);}
                else this.crash(type===4?1.3:1.05,(this.carX<x?-1:1),type===4?8:5.5);
            }
        }
    };

    DanboRocketRoad.prototype.objectSway=function(type,pattern,id){
        if(type===2)return Math.sin(this.elapsed*1.8+pattern+id)*0.42;
        if(type===3)return Math.sin(this.elapsed*3.0+id)*0.24;
        return 0;
    };

    DanboRocketRoad.prototype.trafficSpeed=function(type,pattern,id){
        if(this.state!=='playing')return 0;
        var sid=this.stageId||0, mul=1+sid*0.08;
        if(type===1)return (10+(pattern||0)*1.1)*mul;      // same direction, slower than player
        if(type===2)return (18+Math.sin(this.elapsed*0.7+id)*5)*mul;
        if(type===3)return (-12-Math.abs(Math.sin(id))*5)*(1+sid*0.05); // oncoming / passing traffic
        if(type===4)return 7+sid*0.7;
        return 0;
    };

    DanboRocketRoad.prototype.eventRel=function(ev,id,type){
        type=type|0;
        return ev[0]+this.trafficSpeed(type,ev[4],id)*this.elapsed-this.progress;
    };

    DanboRocketRoad.prototype.updateRoad=function(){
        var first=this.progress-(this.progress%ROAD_SEG_LEN)-32,activeSid=this.stageId||0,activeMats=this.stageMats&&this.stageMats[activeSid];
        if(this.ground&&activeMats&&activeMats.ground){this.ground.material=activeMats.ground;var groundMap=this.ground.material.map;if(groundMap){groundMap.offset.y=((this.progress||0)*groundMap.repeat.y/260)%1;}}
        for(var i=0;i<this.roadSegments.length;i++){
            var abs=first+i*ROAD_SEG_LEN, sid=this.stageId||0, rel=abs-this.progress, g=this.roadSegments[i], rawWidth=this.R.roadWidthAt(abs), width=effectiveRoadWidth(rawWidth,abs,sid), cx=driveCenterAt(abs,sid), mats=this.stageMats&&this.stageMats[sid];
            if(mats){g.road.material=mats.road;g.leftRail.material=g.rightRail.material=mats.edge;g.leftField.material=mats.fields[i%mats.fields.length];g.rightField.material=mats.fields[(i+2)%mats.fields.length];for(var mm=0;mm<g.marks.length;mm++)g.marks[mm].material=mats.mark;if(g.branchRoad)g.branchRoad.material=mats.road;if(g.branchRails)for(var rr=0;rr<g.branchRails.length;rr++)g.branchRails[rr].material=mats.edge;if(g.branchMarks)for(var bb=0;bb<g.branchMarks.length;bb++)g.branchMarks[bb].material=mats.mark;}
            var bounds=roadOuterBounds(abs,sid,width);
            g.position.set(cx,0,PLAYER_Z+rel);g.road.scale.x=width;g.road.scale.z=ROAD_SEG_LEN+0.35;
            var fieldHalf=(g.fieldSpan||4.2)*0.5+0.25;g.leftField.position.x=(bounds.min-cx)-fieldHalf;g.rightField.position.x=(bounds.max-cx)+fieldHalf;g.leftField.scale.z=g.rightField.scale.z=ROAD_SEG_LEN+0.35;
            g.leftRail.position.x=-width*0.5-0.18;g.rightRail.position.x=width*0.5+0.18;
            for(var m=0;m<g.marks.length;m++){var mk=g.marks[m];mk.position.x=(-width*0.25)+(m*width*0.25);mk.visible=((Math.floor(abs/ROAD_SEG_LEN)+m)%2)===0;}
            var bw=sideRoadWidth(abs,sid), bcx=sideRoadCenterAt(abs,sid)-cx;
            if(g.branchRoad){
                var showBranch=bw>0.08;
                g.branchRoad.visible=showBranch;g.branchRoad.position.x=bcx;g.branchRoad.scale.x=bw;g.branchRoad.scale.z=ROAD_SEG_LEN+0.35;
                for(var bi=0;bi<g.branchRails.length;bi++){var br=g.branchRails[bi];br.visible=showBranch;br.position.x=bcx+(bi===0?-bw*0.5-0.16:bw*0.5+0.16);br.scale.z=ROAD_SEG_LEN+0.35;}
                for(var bj=0;bj<g.branchMarks.length;bj++){var bm=g.branchMarks[bj];bm.visible=showBranch&&((Math.floor(abs/ROAD_SEG_LEN)+bj)%2)===0;bm.position.x=bcx+(-bw*0.18+bj*bw*0.36);}
            }
            for(var f=0;f<g.flowers.length;f++){
                var fl=g.flowers[f], side=f<6?-1:1, row=f%6, wob=((Math.floor(abs/ROAD_SEG_LEN)+row)%2)*0.24;
                fl.position.x=(side<0?(bounds.min-cx):(bounds.max-cx))+side*(0.72+(row%3)*0.78+wob);
                fl.position.z=-ROAD_SEG_LEN*0.42+row*1.45;
                fl.visible=((Math.floor(abs/ROAD_SEG_LEN)+f)%3)!==0;
            }
        }
    };

    DanboRocketRoad.prototype.updateObjects=function(){
        var count=this.R.eventCount();
        for(var i=0;i<count;i++){
            var ev=this.R.eventAt(i), type=ev[2]|0, rel=this.eventRel(ev,i,type);
            var obj=this.objects[i];
            if(rel<-14||rel>110||this.hitEvents[i]&&type===5){if(obj)obj.mesh.visible=false;continue;}
            if(!obj){obj={mesh:this.makeObject(type,i),type:type};this.objects[i]=obj;this.objectGroup.add(obj.mesh);}obj.mesh.visible=true;
            var width=effectiveRoadWidth(this.R.roadWidthAt(ev[0]),ev[0],this.stageId||0), x=driveCenterAt(ev[0],this.stageId||0)+this.R.laneX(ev[1]|0,width)+this.objectSway(type,ev[4],i);
            obj.mesh.position.set(x,0.02,PLAYER_Z+rel);
            obj.mesh.rotation.y=(type===3?Math.PI:0)+Math.sin(this.elapsed*1.5+i)*0.025;
            if(obj.mesh.halo)obj.mesh.halo.rotation.z+=0.04;
            if(obj.mesh.driver)obj.mesh.driver.rotation.y=Math.sin(this.elapsed*2+i)*0.05;
        }
    };

    DanboRocketRoad.prototype.updateStartGrid=function(){
        if(!this.startGridCars)return;
        var show=this.state==='countdown'||(this.state==='playing'&&this.elapsed<1.6);
        this.startGridGroup.visible=!!show;
        for(var i=0;i<this.startGridCars.length;i++){
            var c=this.startGridCars[i], mesh=c.mesh;
            if(!show){mesh.visible=false;continue;}
            var width=effectiveRoadWidth(this.R.roadWidthAt(this.progress+c.z),this.progress+c.z,this.stageId||0), x=driveCenterAt(this.progress+c.z,this.stageId||0)+this.R.laneX(c.lane,width)+(c.offset||0), launch=this.state==='playing'?this.elapsed*(c.launch+22):0;
            mesh.visible=true;mesh.position.set(x,0.02,PLAYER_Z+c.z+launch);
            mesh.rotation.y=c.yaw||0;mesh.rotation.z=Math.sin((this.elapsed||0)*4+i)*0.012;
        }
    };

    DanboRocketRoad.prototype.updateScenery=function(){
        if(!this.decorItems)return;
        for(var i=0;i<this.decorItems.length;i++){
            var d=this.decorItems[i], rel=d.abs-this.progress, mesh=d.mesh;
            if(rel<-58||rel>150){mesh.visible=false;continue;}
            var sid=this.stageId||0, width=effectiveRoadWidth(this.R.roadWidthAt(d.abs),d.abs,sid), bounds=roadOuterBounds(d.abs,sid,width), x=(d.side<0?bounds.min-d.offset:bounds.max+d.offset);
            mesh.visible=true;mesh.position.set(x,0,PLAYER_Z+rel);mesh.scale.setScalar(d.scale);
            var aligned=(d.kind===6||d.kind===7||d.kind===8||d.kind===10||d.kind===13||d.kind===14||d.kind===16);
            mesh.rotation.y=aligned?0:(d.side<0?0.42:-0.42);
            if((i%6)===3&&!aligned)mesh.rotation.y+=Math.sin(this.elapsed*1.2+d.spin)*0.12;
        }
    };

    DanboRocketRoad.prototype.updateFinishGate=function(){
        if(!this.finishGroup)return;
        var finish=this.R.levelLength(), rel=finish-this.progress, g=this.finishGroup;
        if(rel<-12||rel>150){g.visible=false;return;}
        var width=effectiveRoadWidth(this.R.roadWidthAt(finish),finish,this.stageId||0);
        g.visible=true;g.position.set(driveCenterAt(finish,this.stageId||0),0,PLAYER_Z+rel);
        if(g.arrivalPad)g.arrivalPad.scale.x=Math.max(1.55,width*0.17);g.leftPole.position.x=-(width*0.5+0.95);g.rightPole.position.x=width*0.5+0.95;g.topBar.scale.x=width+2.1;
        for(var i=0;i<g.flags.length;i++){
            var f=g.flags[i], side=f.userData.side||1;
            f.position.x=side*(width*0.5+0.95)+(side<0?-0.56:0.56);f.position.z=0;f.rotation.y=side<0?Math.PI:0;
            f.position.y=3.15+(i%2)*0.62+Math.sin(this.elapsed*5+i)*0.05;
        }
        if(g.banner)g.banner.position.x=0;
    };

    DanboRocketRoad.prototype.updateVisuals=function(dt){
        this.updateRoad();this.updateObjects();this.updateStartGrid();this.updateScenery();this.updateFinishGate();
        var cx=driveCenterAt(this.progress||0,this.stageId||0);
        this.player.position.x=cx+(this.carX||0);this.player.rotation.z=-(this.carVx||0)*0.018+(this.spin>0?Math.sin(this.elapsed*28)*0.18*this.spinDir:0);this.player.rotation.y=(this.spin>0?Math.sin(this.elapsed*21)*0.22*this.spinDir:0);
        if(this.player.flame){var inp=this.inputState(),thrust=clamp((this.speed||0)/58,0.15,1);var s=(inp.turbo&&this.state==='playing')?(0.95+0.45*thrust):(0.42+0.42*thrust);this.player.flame.scale.set(s,s,0.55+thrust*0.45+Math.sin(this.elapsed*28)*0.16);this.player.flame.visible=this.state==='playing'&&this.speed>2;}
        this.world.position.x=0;
        this.camera.position.x=cx+(this.carX||0)*0.08;this.camera.position.z=5;this.camera.lookAt(this.camera.position.x,0,5);
    };

    DanboRocketRoad.prototype.updateHud=function(){
        if(this.state!=='playing'&&this.state!=='countdown')return;var pct=clamp(this.progress/this.R.levelLength(),0,1), fuelPct=clamp(this.fuel/this.R.maxFuel(),0,1);
        var passed=0,count=this.R.eventCount();
        for(var i=0;i<count;i++){var ev=this.R.eventAt(i),typ=ev[2]|0;if(typ!==5&&typ!==6&&this.eventRel(ev,i,typ)<-3)passed++;}
        var rank=Math.max(1,40-Math.floor(passed/2)-Math.floor((this.progress||0)/260));
        var mins=Math.floor((this.elapsed||0)/60), secs=Math.floor((this.elapsed||0)%60);
        var q=function(sel){return this.root.querySelector(sel);}.bind(this), el;
        if((el=q('[data-rank]')))el.textContent=rank;
        if((el=q('[data-start-rank]')))el.textContent=rank;
        if((el=q('[data-time]')))el.textContent=mins+'′'+(secs<10?'0':'')+secs;
        if((el=q('[data-cars]')))el.textContent=passed;
        if((el=q('[data-km]')))el.textContent=fmt3((this.progress||0)/35.5)+'Km';
        if((el=q('[data-progress-line]')))el.style.width=(pct*100)+'%';
        if((el=q('[data-progress-pct]')))el.textContent=Math.floor(pct*100)+'%';
        if((el=q('[data-rpm]')))el.style.width=(clamp((this.speed||0)/62,0,1)*100)+'%';
        if((el=q('[data-fuel]')))el.style.width=(fuelPct*100)+'%';
    };

    DanboRocketRoad.prototype.loop=function(t){
        if(!this.running)return;var dt=Math.min(0.04,(t-this.last)/1000||0.016);this.last=t;
        if(this.toastTimer>0){this.toastTimer-=dt;if(this.toastTimer<=0)this.toast.style.display='none';}
        if(this.state==='countdown')this.updateCountdown(dt);else if(this.state==='playing')this.updatePlaying(dt);
        this.updateVisuals(dt);this.updateHud();this.renderer.render(this.scene,this.camera);
        var self=this;this.raf=requestAnimationFrame(function(nt){self.loop(nt);});
    };

    DanboRocketRoad.prototype.dispose=function(){
        this.running=false;this.stopMusic();if(this.raf)cancelAnimationFrame(this.raf);window.removeEventListener('resize',this.onResize);window.removeEventListener('keydown',this.onKeyDown,true);window.removeEventListener('keyup',this.onKeyUp,true);if(this.root)this.root.removeEventListener('click',this.onClick);
        if(this.renderer){var dispose=function(o){if(o.geometry)o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(function(m){if(m.map)m.map.dispose();m.dispose();});else{if(o.material.map)o.material.map.dispose();o.material.dispose();}}};this.scene.traverse(dispose);this.renderer.dispose();}
        if(this.root&&this.root.parentNode)this.root.parentNode.removeChild(this.root);
    };

    window.DanboRocketRoad={start:function(ctx){return new DanboRocketRoad(ctx);},fallback:fallback};
})();
