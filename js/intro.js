// intro.js - cinematic traveler / world-exploration title sequence
// Timeline: landscape -> two travelers meet -> routes awaken -> camera lift -> title.
var _introCanvas=document.getElementById('intro-canvas');
var _introCtx=_introCanvas?_introCanvas.getContext('2d'):null;
var _introStart=0;
var _introRunning=true;
var _introSkipped=false;
var _tapStartShown=false;

function _resizeIntroCanvas(){
    if(!_introCanvas)return;
    var dpr=Math.min(window.devicePixelRatio||1,2),parent=_introCanvas.parentElement;
    _introCanvas.width=Math.max(1,Math.round(parent.offsetWidth*dpr));
    _introCanvas.height=Math.max(1,Math.round(parent.offsetHeight*dpr));
}
_resizeIntroCanvas();window.addEventListener('resize',_resizeIntroCanvas);

function _introClamp(v,a,b){return Math.max(a,Math.min(b,v));}
function _introEase(v){v=_introClamp(v,0,1);return v*v*(3-2*v);}
function _introFade(t,start,duration){return _introEase((t-start)/duration);}
function _introBezier(a,b,c,d,u){var v=1-u;return v*v*v*a+3*v*v*u*b+3*v*u*u*c+u*u*u*d;}
function _introFitFont(ctx,text,maxSize,minSize,maxWidth,family){
    var size=maxSize;
    while(size>minSize){ctx.font='800 '+Math.floor(size)+'px '+family;if(ctx.measureText(text).width<=maxWidth)break;size-=1;}
    return Math.max(minSize,size);
}
function _prepareIntroUi(){
    document.title=L('title');
    var startButton=document.getElementById('start-btn');if(startButton)startButton.textContent=L('startBtn');
    // Version is drawn inside the cinematic title stack; suppress the legacy duplicate below it.
    var versionNode=document.getElementById('intro-version');
    if(versionNode){versionNode.style.visibility='hidden';versionNode.style.height='0';versionNode.style.margin='0';}
}

function _drawIntroSky(ctx,W,H,t){
    var sky=ctx.createLinearGradient(0,0,0,H);
    sky.addColorStop(0,'#72bed8');sky.addColorStop(.42,'#f7d49a');sky.addColorStop(1,'#f3a27f');
    ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
    var sunX=W*.78,sunY=H*.205,sunR=Math.min(W,H)*.07;
    var glow=ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,sunR*2.7);
    glow.addColorStop(0,'rgba(255,251,213,.96)');glow.addColorStop(.38,'rgba(255,224,157,.42)');glow.addColorStop(1,'rgba(255,224,157,0)');
    ctx.fillStyle=glow;ctx.fillRect(sunX-sunR*2.7,sunY-sunR*2.7,sunR*5.4,sunR*5.4);
    ctx.fillStyle='#fff4c9';ctx.beginPath();ctx.arc(sunX,sunY,sunR,0,Math.PI*2);ctx.fill();
    for(var c=0;c<6;c++){
        var cx=((c*.245+t*(.0042+c*.00055))%1.34-.17)*W;
        var cy=H*(.105+(c%3)*.068),cs=Math.min(W,H)*(.033+(c%2)*.011);
        ctx.fillStyle='rgba(255,255,255,'+(.51-c*.035)+')';ctx.beginPath();
        ctx.arc(cx,cy,cs,0,Math.PI*2);ctx.arc(cx+cs*.82,cy-cs*.13,cs*.72,0,Math.PI*2);ctx.arc(cx+cs*1.46,cy+cs*.02,cs*.57,0,Math.PI*2);ctx.fill();
    }
}

function _drawIntroHill(ctx,W,H,y,color,amp,phase){
    ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(0,H*1.2);
    for(var x=0;x<=W;x+=W/18)ctx.lineTo(x,y+Math.sin(x/W*Math.PI*2+phase)*amp+Math.sin(x/W*Math.PI*5+phase*.6)*amp*.24);
    ctx.lineTo(W,H*1.2);ctx.closePath();ctx.fill();
}

function _drawIntroDestination(ctx,W,H,reveal){
    if(reveal<=0)return;
    ctx.save();ctx.globalAlpha=reveal;
    var y=H*.475,s=Math.min(W,H);
    // A compact, neutral travel settlement: rounded roofs, warm windows and a survey tower.
    ctx.fillStyle='rgba(49,91,78,.66)';
    for(var i=0;i<5;i++){
        var x=W*(.39+i*.055),bw=s*(.05+(i%2)*.012),bh=s*(.055+(i%3)*.012);
        ctx.beginPath();ctx.roundRect(x-bw*.5,y-bh,bw,bh,Math.max(3,s*.008));ctx.fill();
        ctx.fillStyle='rgba(255,224,153,.82)';ctx.fillRect(x-bw*.13,y-bh*.62,bw*.26,bh*.25);ctx.fillStyle='rgba(49,91,78,.66)';
    }
    var tx=W*.5,th=s*.15;
    ctx.fillStyle='rgba(43,78,70,.78)';ctx.beginPath();ctx.roundRect(tx-s*.019,y-th,s*.038,th,s*.013);ctx.fill();
    ctx.strokeStyle='rgba(255,244,207,.8)';ctx.lineWidth=Math.max(1,s*.004);ctx.beginPath();ctx.arc(tx,y-th,s*.031,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='rgba(255,236,171,.9)';ctx.beginPath();ctx.arc(tx,y-th,s*.009,0,Math.PI*2);ctx.fill();ctx.restore();
}

function _drawIntroWorld(ctx,W,H,t,cameraLift){
    ctx.save();ctx.translate(0,cameraLift);
    _drawIntroHill(ctx,W,H,H*.48,'#87b98d',H*.042,t*.018);
    _drawIntroHill(ctx,W,H,H*.58,'#619979',H*.056,1.6+t*.012);
    _drawIntroDestination(ctx,W,H,_introFade(t,4.9,1.15));
    _drawIntroHill(ctx,W,H,H*.70,'#3f7866',H*.05,3.2);
    ctx.restore();
}

function _introBranchPoint(side,p,W,H){
    p=_introClamp(p,0,1);
    if(side<0)return{x:_introBezier(-.08,.12,.25,.43,p)*W,y:_introBezier(.84,.73,.75,.68,p)*H};
    return{x:_introBezier(1.08,.9,.74,.57,p)*W,y:_introBezier(.81,.71,.76,.68,p)*H};
}
function _introSharedPoint(p,W,H){
    p=_introClamp(p,0,1);return{x:_introBezier(.5,.48,.57,.5,p)*W,y:_introBezier(.68,.6,.56,.485,p)*H};
}

function _drawIntroRoutes(ctx,W,H,t){
    ctx.save();ctx.lineCap='round';
    ctx.strokeStyle='rgba(255,239,196,.9)';ctx.lineWidth=Math.max(9,Math.min(W,H)*.027);
    ctx.beginPath();ctx.moveTo(-W*.06,H*.84);ctx.bezierCurveTo(W*.12,H*.73,W*.25,H*.75,W*.43,H*.68);ctx.stroke();
    ctx.beginPath();ctx.moveTo(W*1.06,H*.81);ctx.bezierCurveTo(W*.9,H*.71,W*.74,H*.76,W*.57,H*.68);ctx.stroke();
    var awaken=_introFade(t,4.05,1.25);
    ctx.globalAlpha=awaken;ctx.beginPath();ctx.moveTo(W*.43,H*.68);ctx.quadraticCurveTo(W*.47,H*.695,W*.5,H*.68);ctx.quadraticCurveTo(W*.53,H*.695,W*.57,H*.68);ctx.stroke();
    ctx.globalAlpha=.45+.55*awaken;ctx.beginPath();ctx.moveTo(W*.5,H*.68);ctx.bezierCurveTo(W*.48,H*.6,W*.57,H*.56,W*.5,H*.485);ctx.stroke();
    ctx.strokeStyle='rgba(177,127,83,.32)';ctx.lineWidth=Math.max(2,Math.min(W,H)*.005);ctx.setLineDash([Math.min(W,H)*.028,Math.min(W,H)*.038]);
    ctx.beginPath();ctx.moveTo(-W*.06,H*.84);ctx.bezierCurveTo(W*.12,H*.73,W*.25,H*.75,W*.43,H*.68);ctx.stroke();
    ctx.beginPath();ctx.moveTo(W*1.06,H*.81);ctx.bezierCurveTo(W*.9,H*.71,W*.74,H*.76,W*.57,H*.68);ctx.stroke();
    ctx.globalAlpha=awaken;ctx.beginPath();ctx.moveTo(W*.43,H*.68);ctx.quadraticCurveTo(W*.47,H*.695,W*.5,H*.68);ctx.quadraticCurveTo(W*.53,H*.695,W*.57,H*.68);ctx.stroke();
    ctx.globalAlpha=awaken;ctx.beginPath();ctx.moveTo(W*.5,H*.68);ctx.bezierCurveTo(W*.48,H*.6,W*.57,H*.56,W*.5,H*.485);ctx.stroke();
    ctx.setLineDash([]);ctx.restore();
}

function _drawIntroWaypoint(ctx,x,y,r,color,alpha,pulse){
    if(alpha<=0)return;ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);
    ctx.fillStyle='rgba(48,73,60,.74)';ctx.fillRect(-r*.11,0,r*.22,r*1.42);
    var radius=r*(1.55+pulse*.2),g=ctx.createRadialGradient(0,-r*.15,0,0,-r*.15,radius);
    g.addColorStop(0,color);g.addColorStop(.32,color.replace('1)','0.4)'));g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,-r*.15,radius,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=color;ctx.beginPath();ctx.arc(0,-r*.15,r*.43,0,Math.PI*2);ctx.fill();ctx.restore();
}

function _drawIntroTraveler(ctx,x,y,s,step,alpha,palette,facing,gesture){
    if(alpha<=0)return;ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y+Math.sin(step)*s*.026);ctx.scale(facing||1,1);ctx.rotate(Math.sin(step*.5)*.018);
    // Backpack, scarf and satchel keep both figures readable as distinct travelers.
    ctx.fillStyle=palette.pack;ctx.beginPath();ctx.roundRect(-s*.43,-s*.28,s*.23,s*.53,s*.09);ctx.fill();
    ctx.fillStyle=palette.scarf;ctx.beginPath();ctx.moveTo(-s*.18,-s*.36);ctx.quadraticCurveTo(-s*.62,-s*.45-Math.sin(step)*s*.065,-s*.72,-s*.2);ctx.quadraticCurveTo(-s*.51,-s*.25,-s*.19,-s*.17);ctx.closePath();ctx.fill();
    var body=ctx.createLinearGradient(0,-s*.58,0,s*.44);body.addColorStop(0,palette.top);body.addColorStop(1,palette.bottom);ctx.fillStyle=body;ctx.beginPath();ctx.moveTo(0,-s*.64);ctx.bezierCurveTo(s*.32,-s*.57,s*.43,-s*.18,s*.39,s*.2);ctx.bezierCurveTo(s*.33,s*.5,-s*.33,s*.5,-s*.39,s*.2);ctx.bezierCurveTo(-s*.44,-s*.18,-s*.3,-s*.56,0,-s*.64);ctx.fill();
    ctx.fillStyle='rgba(255,248,229,.9)';ctx.beginPath();ctx.ellipse(s*.09,-s*.16,s*.18,s*.145,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#31463e';ctx.beginPath();ctx.arc(s*.135,-s*.16,s*.05,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#6f5546';ctx.lineWidth=Math.max(1,s*.024);ctx.beginPath();ctx.arc(s*.11,s*.015,s*.09,.16*Math.PI,.84*Math.PI);ctx.stroke();
    ctx.strokeStyle=palette.bottom;ctx.lineWidth=Math.max(2,s*.075);ctx.lineCap='round';
    var handY=gesture?s*(-.02-.16*Math.sin(_introClamp(gesture,0,1)*Math.PI)):s*.08;
    ctx.beginPath();ctx.moveTo(s*.28,-s*.02);ctx.quadraticCurveTo(s*.48,-s*.04,s*.52,handY);ctx.stroke();
    ctx.fillStyle=palette.hand;ctx.beginPath();ctx.arc(s*.52,handY,s*.075,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=palette.shoe;ctx.beginPath();ctx.ellipse(-s*.2,s*.48,s*.19,s*.085,-.12,0,Math.PI*2);ctx.ellipse(s*.19,s*.48,s*.19,s*.085,.12,0,Math.PI*2);ctx.fill();ctx.restore();
}

function _drawSharedMap(ctx,W,H,t){
    var open=_introFade(t,3.18,.48)*(1-_introFade(t,4.45,.35));if(open<=0)return;
    var s=Math.min(W,H),w=s*.19*open,h=s*.105,x=W*.5,y=H*.655;
    ctx.save();ctx.globalAlpha=Math.min(1,open*1.4);ctx.translate(x,y);ctx.fillStyle='#fff0c4';ctx.strokeStyle='rgba(109,83,58,.55)';ctx.lineWidth=Math.max(1,s*.003);ctx.beginPath();ctx.roundRect(-w*.5,-h*.5,w,h,s*.012);ctx.fill();ctx.stroke();
    ctx.strokeStyle='#77a88a';ctx.lineWidth=Math.max(1,s*.005);ctx.setLineDash([s*.012,s*.009]);ctx.beginPath();ctx.moveTo(-w*.34,h*.2);ctx.quadraticCurveTo(-w*.05,-h*.32,w*.34,-h*.06);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#e68f78';ctx.beginPath();ctx.arc(w*.32,-h*.07,s*.012,0,Math.PI*2);ctx.fill();ctx.restore();
}

function _drawIntroCompass(ctx,x,y,r,alpha){
    if(alpha<=0)return;ctx.save();ctx.translate(x,y);ctx.globalAlpha=alpha;ctx.strokeStyle='#fff4cf';ctx.lineWidth=Math.max(2,r*.05);ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.stroke();ctx.rotate(-.28);
    ctx.fillStyle='#fff4cf';ctx.beginPath();ctx.moveTo(0,-r*.76);ctx.lineTo(r*.2,0);ctx.lineTo(0,r*.76);ctx.lineTo(-r*.2,0);ctx.closePath();ctx.fill();
    ctx.fillStyle='#77a98b';ctx.beginPath();ctx.moveTo(0,-r*.55);ctx.lineTo(r*.1,0);ctx.lineTo(0,r*.1);ctx.lineTo(-r*.1,0);ctx.closePath();ctx.fill();ctx.restore();
}

function _drawIntroTitle(ctx,W,H,t,scale){
    var alpha=_introFade(t,6.95,.78);if(alpha<=0)return;
    var family='"Segoe UI","PingFang SC","Yu Gothic",sans-serif',panelW=Math.min(W*.84,820*scale),panelH=Math.max(132,184*scale),panelY=H*.36;
    ctx.save();ctx.globalAlpha=alpha;ctx.translate(0,(1-alpha)*18*scale);
    var glow=ctx.createRadialGradient(W*.5,panelY,0,W*.5,panelY,panelW*.6);glow.addColorStop(0,'rgba(255,241,196,.18)');glow.addColorStop(1,'rgba(255,241,196,0)');ctx.fillStyle=glow;ctx.fillRect(W*.5-panelW*.7,panelY-panelH,panelW*1.4,panelH*2);
    ctx.fillStyle='rgba(29,65,58,.77)';ctx.beginPath();ctx.roundRect(W*.5-panelW*.5,panelY-panelH*.5,panelW,panelH,Math.max(18,26*scale));ctx.fill();
    ctx.strokeStyle='rgba(255,245,210,.52)';ctx.lineWidth=Math.max(1,2*scale);ctx.stroke();
    ctx.textAlign='center';ctx.textBaseline='alphabetic';var title=L('title');
    var titleSize=_introFitFont(ctx,title,Math.max(34,64*scale),Math.max(22,29*scale),panelW*.88,family);
    ctx.font='800 '+Math.floor(titleSize)+'px '+family;ctx.fillStyle='#fff2c8';ctx.shadowColor='rgba(248,190,108,.32)';ctx.shadowBlur=16*scale;ctx.fillText(title,W*.5,panelY-panelH*.12);ctx.shadowBlur=0;
    var subtitle=L('subtitle'),normalizedTitle=String(title).replace(/\s/g,'').toUpperCase(),normalizedSub=String(subtitle).replace(/\s/g,'').toUpperCase();
    if(subtitle&&normalizedSub!==normalizedTitle){ctx.fillStyle='rgba(255,255,255,.77)';ctx.font='700 '+Math.max(10,14*scale)+'px '+family;ctx.fillText(subtitle,W*.5,panelY+panelH*.075);}
    ctx.fillStyle='rgba(255,255,255,.66)';ctx.font='italic '+Math.max(10,13*scale)+'px '+family;ctx.fillText(L('slogan'),W*.5,panelY+panelH*.25);
    ctx.fillStyle='rgba(255,255,255,.48)';ctx.font=Math.max(9,11*scale)+'px '+family;ctx.fillText(L('version'),W*.5,panelY+panelH*.39);ctx.restore();
}

function _renderIntro(now){
    if(!_introRunning||!_introCtx||!_introCanvas)return;
    if(!_introStart)_introStart=now;
    var t=(now-_introStart)/1000,W=_introCanvas.width,H=_introCanvas.height,ctx=_introCtx,scale=Math.min(W,H)/600;
    var lift=_introFade(t,6.28,1.12),cameraLift=lift*H*.17;
    _drawIntroSky(ctx,W,H,t);_drawIntroWorld(ctx,W,H,t,cameraLift);
    ctx.save();ctx.translate(0,cameraLift);_drawIntroRoutes(ctx,W,H,t);

    var colors=['rgba(244,151,155,1)','rgba(123,190,121,1)','rgba(185,226,229,1)','rgba(255,225,151,1)','rgba(179,142,202,1)','rgba(116,158,211,1)','rgba(229,130,91,1)','rgba(224,190,96,1)'];
    for(var i=0;i<8;i++){
        var wp=i<3?_introBranchPoint(-1,.26+i*.27,W,H):(i<6?_introBranchPoint(1,.22+(i-3)*.28,W,H):_introSharedPoint(.35+(i-6)*.42,W,H));
        var wa=_introFade(t,4.05+i*.18,.48),pulse=.5+.5*Math.sin(t*3+i*.8);_drawIntroWaypoint(ctx,wp.x,wp.y,Math.max(5,8*scale),colors[i],wa,pulse);
    }

    var arriveA=_introEase((t-.95)/2.05),arriveB=_introEase((t-1.65)/1.75),depart=_introEase((t-4.45)/1.65),shared=_introSharedPoint(depart*.78,W,H);
    var pairSpacing=Math.max(26,34*scale);
    var a=depart>0?{x:shared.x-pairSpacing,y:shared.y}:{x:_introBranchPoint(-1,arriveA,W,H).x,y:_introBranchPoint(-1,arriveA,W,H).y};
    var b=depart>0?{x:shared.x+pairSpacing,y:shared.y}:{x:_introBranchPoint(1,arriveB,W,H).x,y:_introBranchPoint(1,arriveB,W,H).y};
    var travelerFade=1-_introFade(t,6.45,.72),gesture=(t>3.15&&t<4.35)?(t-3.15)/1.2:0;
    _drawIntroTraveler(ctx,a.x,a.y-Math.min(W,H)*.045,Math.max(31,63*scale),t*6,travelerFade*_introFade(t,.7,.5),{top:'#f2d78e',bottom:'#c9805e',pack:'#668866',scarf:'#eb8f73',hand:'#f3ce8b',shoe:'#6d5945'},1,gesture);
    _drawIntroTraveler(ctx,b.x,b.y-Math.min(W,H)*.045,Math.max(29,59*scale),t*6+1.2,travelerFade*_introFade(t,1.45,.5),{top:'#c9dba7',bottom:'#7ca27e',pack:'#6c6f91',scarf:'#d79aae',hand:'#d8d8a8',shoe:'#555f56'},-1,gesture*.86);
    _drawSharedMap(ctx,W,H,t);ctx.restore();

    // A route-shaped light ribbon replaces the old combat climax.
    var ribbon=_introFade(t,4.78,1.15)*(1-_introFade(t,6.7,.7));
    if(ribbon>0){ctx.save();ctx.translate(0,cameraLift);ctx.globalAlpha=ribbon*.7;ctx.strokeStyle='rgba(255,244,194,.92)';ctx.lineWidth=Math.max(2,5*scale);ctx.shadowColor='#ffe2a0';ctx.shadowBlur=18*scale;ctx.beginPath();ctx.moveTo(W*.5,H*.68);ctx.bezierCurveTo(W*.48,H*.6,W*.57,H*.56,W*.5,H*.485);ctx.stroke();ctx.restore();}
    if(t<2.35)_drawIntroCompass(ctx,W*.5,H*.285,Math.min(W,H)*.062,_introFade(t,.12,.55)*(1-_introFade(t,1.62,.62)));
    _drawIntroTitle(ctx,W,H,t,scale);

    if(t>8.15){
        _introSkipped=true;_introCanvas.style.pointerEvents='none';var btn=document.getElementById('start-btn');if(btn)btn.style.opacity='1';
        if(Math.floor(t*2)%2===0){var prompt={zhs:'\u5F00\u59CB\u65C5\u7A0B',zht:'\u958B\u59CB\u65C5\u7A0B',ja:'\u5192\u967A\u3092\u59CB\u3081\u308B',en:'PRESS START'}[_langCode]||'PRESS START';ctx.fillStyle='rgba(255,255,255,.92)';ctx.font='700 '+Math.max(14,19*scale)+'px "Segoe UI","PingFang SC","Yu Gothic",sans-serif';ctx.textAlign='center';ctx.fillText(prompt,W*.5,H*.805);}
    }
    if(_introRunning)requestAnimationFrame(_renderIntro);
}

function _startIntro(){_introStart=0;_introRunning=true;_introSkipped=false;_prepareIntroUi();_resizeIntroCanvas();if(_introCanvas)_introCanvas.style.pointerEvents='auto';requestAnimationFrame(_renderIntro);}
function _skipIntro(){
    if(_introSkipped)return;var now=performance.now?performance.now():Date.now();if(!_introStart)return;var elapsed=(now-_introStart)/1000;if(elapsed<.7)return;
    // Preserve the old safe staged skip rhythm without forcing viewers through a combat beat.
    if(elapsed<4.45)_introStart=now-4450;else if(elapsed<7.18)_introStart=now-7180;else _introStart=now-8250;
}
function _showTapStart(){
    if(_tapStartShown||!_introCtx||!_introCanvas)return;_tapStartShown=true;_prepareIntroUi();
    function draw(){
        if(!_tapStartShown||_introStart)return;_resizeIntroCanvas();var W=_introCanvas.width,H=_introCanvas.height,ctx=_introCtx,scale=Math.min(W,H)/600;
        _drawIntroSky(ctx,W,H,0);_drawIntroWorld(ctx,W,H,0,0);ctx.fillStyle='rgba(27,64,57,.58)';ctx.fillRect(0,0,W,H);_drawIntroCompass(ctx,W*.5,H*.29,Math.min(W,H)*.072,1);
        ctx.textAlign='center';ctx.fillStyle='#fff4cf';var family='"Segoe UI","PingFang SC","Yu Gothic",sans-serif',title=L('title');var fs=_introFitFont(ctx,title,Math.max(30,52*scale),Math.max(22,28*scale),W*.82,family);ctx.font='800 '+Math.floor(fs)+'px '+family;ctx.fillText(title,W*.5,H*.48);
        if(Math.floor(Date.now()/550)%2===0){var tap={zhs:'\u70B9\u51FB\u5F00\u59CB',zht:'\u9EDE\u64CA\u958B\u59CB',ja:'\u30BF\u30C3\u30D7\u3057\u3066\u30B9\u30BF\u30FC\u30C8',en:'TAP TO START'}[_langCode]||'TAP TO START';ctx.fillStyle='rgba(255,255,255,.88)';ctx.font='700 '+Math.max(15,21*scale)+'px '+family;ctx.fillText(tap,W*.5,H*.61);}requestAnimationFrame(draw);
    }
    draw();
}
function _onTapStart(){if(_introStart)return;_unlockAudio();_startIntro();}
function _onTapStartKey(){if(!_introStart)_onTapStart();else if(!_introSkipped)_skipIntro();}
if(_introCanvas){_introCanvas.addEventListener('click',function(){if(!_introStart)_onTapStart();else if(!_introSkipped)_skipIntro();});_introCanvas.addEventListener('touchstart',function(){if(!_introStart)_onTapStart();else if(!_introSkipped)_skipIntro();},{passive:true});}
document.addEventListener('keydown',_onTapStartKey);_showTapStart();
