(function(){
    'use strict';

    var THEMES={
        blossomTraveler:{body:'#f6f3e9',accent:'#cc5f68',topper:'blossom'},
        herbTraveler:{body:'#bfe8a0',accent:'#6da85a',topper:'sprout'},
        saltCrystalTraveler:{body:'#f4e9e1',accent:'#d79ab6',topper:'crystal'},
        cloudwingTraveler:{body:'#ddf5ff',accent:'#69add4',topper:'cloud'},
        fruitbrewTraveler:{body:'#ffaaa0',accent:'#6ea65d',topper:'fruit'},
        berryTraveler:{body:'#718fcf',accent:'#d85c91',topper:'berry'},
        spicyFlameTraveler:{body:'#f37b5d',accent:'#ffd05a',topper:'flame'},
        goldenGrainTraveler:{body:'#e8ba61',accent:'#f3d36a',topper:'grain'}
    };

    function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
    function profile(character){
        character=character||{};var id=String(character.id||'herbTraveler'),theme=THEMES[id]||THEMES.herbTraveler;
        return {id:THEMES[id]?id:'herbTraveler',body:character.color||theme.body,accent:character.accent||theme.accent,topper:theme.topper};
    }
    function ellipse(context,x,y,rx,ry,rotation){context.beginPath();context.ellipse(x,y,rx,ry,rotation||0,0,Math.PI*2);context.fill();}
    function eggPath(context){
        context.beginPath();context.moveTo(0,-13.15);context.bezierCurveTo(-4.05,-13.05,-5.65,-8.7,-5.35,-4.45);context.bezierCurveTo(-5.05,-.8,-2.85,.35,0,.35);context.bezierCurveTo(2.85,.35,5.05,-.8,5.35,-4.45);context.bezierCurveTo(5.65,-8.7,4.05,-13.05,0,-13.15);context.closePath();
    }
    function handAnchors(state){
        state=state||{};var move=clamp(Number(state.move)||0,0,1),step=Number(state.step)||0,sway=step*.18*move;
        return {left:{x:-3.35+sway,y:-11.15},right:{x:3.35+sway,y:-11.15}};
    }
    function drawArm(context,side,hand,state,colors){
        var move=clamp(Number(state.move)||0,0,1),step=Number(state.step)||0,shoulderX=side*4.15,shoulderY=-7.25,elbowX=side*(5.3-step*.22*move),elbowY=-9.25+Math.abs(step)*.12*move;
        context.lineCap='round';context.lineJoin='round';context.strokeStyle=colors.body;context.lineWidth=2.15;context.beginPath();context.moveTo(shoulderX,shoulderY);context.quadraticCurveTo(elbowX,elbowY,hand.x,hand.y);context.stroke();
        context.fillStyle=colors.body;ellipse(context,hand.x,hand.y,1.02,.9,0);
    }
    function drawFeet(context,state,colors){
        var move=clamp(Number(state.move)||0,0,1),step=Number(state.step)||0;
        var leftLift=Math.max(0,step)*1.15*move,rightLift=Math.max(0,-step)*1.15*move,stride=step*.58*move;
        context.fillStyle=colors.accent;
        ellipse(context,-2.6+stride,-.05-leftLift,1.82,.78,-.08);
        ellipse(context,2.6+stride,-.05-rightLift,1.82,.78,.08);
    }
    function drawFace(context){
        context.fillStyle='#35594f';ellipse(context,-1.72,-8.12,.55,.66,0);ellipse(context,1.72,-8.12,.55,.66,0);
        context.fillStyle='rgba(255,255,255,.78)';ellipse(context,-1.9,-8.35,.16,.2,0);ellipse(context,1.54,-8.35,.16,.2,0);
        context.fillStyle='#35594f';ellipse(context,0,-6.48,.82,.24,0);
        context.fillStyle='rgba(226,102,106,.3)';ellipse(context,-3.05,-6.62,.58,.3,0);ellipse(context,3.05,-6.62,.58,.3,0);
    }
    function drawTopper(context,view,state){
        var sway=(Number(state.step)||0)*.12*clamp(Number(state.move)||0,0,1),accent=view.accent;
        context.save();context.translate(sway,0);context.fillStyle=accent;
        if(view.topper==='blossom'){
            for(var i=0;i<5;i++){var angle=-Math.PI/2+i*Math.PI*2/5;ellipse(context,Math.cos(angle)*1.1,-14.05+Math.sin(angle)*.72,.78,.48,angle,0);}context.fillStyle='#f3c85e';ellipse(context,0,-14.05,.52,.52,0);
        }else if(view.topper==='sprout'){
            context.beginPath();context.moveTo(0,-13.05);context.quadraticCurveTo(-.25,-14.45,-1.95,-14.75);context.quadraticCurveTo(-1.7,-13.35,-.2,-13.3);context.closePath();context.fill();context.beginPath();context.moveTo(0,-13.05);context.quadraticCurveTo(.35,-14.6,2.05,-14.45);context.quadraticCurveTo(1.65,-13.2,.2,-13.25);context.closePath();context.fill();
        }else if(view.topper==='crystal'){
            context.beginPath();context.moveTo(0,-15.45);context.lineTo(1.65,-13.7);context.quadraticCurveTo(1.2,-12.85,.55,-12.8);context.lineTo(-1.35,-13.25);context.quadraticCurveTo(-1.75,-14.15,-1.45,-14.55);context.closePath();context.fill();context.fillStyle='rgba(255,255,255,.48)';context.beginPath();context.moveTo(-.15,-14.9);context.quadraticCurveTo(.55,-14.15,.42,-13.25);context.quadraticCurveTo(-.2,-13.7,-.15,-14.9);context.fill();
        }else if(view.topper==='cloud'){
            ellipse(context,-1.25,-13.65,1.25,.72,0);ellipse(context,.15,-14.15,1.4,1,0);ellipse(context,1.45,-13.62,1.2,.68,0);context.fillStyle='#78bfe6';context.beginPath();context.moveTo(.1,-12.9);context.quadraticCurveTo(-.65,-11.95,.1,-11.35);context.quadraticCurveTo(.85,-11.95,.1,-12.9);context.fill();
        }else if(view.topper==='fruit'){
            context.fillStyle='#e76f67';ellipse(context,-.25,-13.75,1.25,1.05,0);context.fillStyle=accent;context.beginPath();context.moveTo(0,-14.45);context.quadraticCurveTo(1.65,-15.3,2.25,-14.1);context.quadraticCurveTo(1.15,-13.7,.1,-14.05);context.closePath();context.fill();
        }else if(view.topper==='berry'){
            context.fillStyle=accent;ellipse(context,-1.05,-13.7,.95,.9,0);ellipse(context,.85,-13.65,.95,.9,0);ellipse(context,-.05,-14.55,.9,.86,0);context.fillStyle='#87b56d';context.beginPath();context.moveTo(0,-14.9);context.lineTo(-1.45,-15.3);context.lineTo(-.55,-14.35);context.lineTo(.7,-15.35);context.lineTo(.65,-14.25);context.closePath();context.fill();
        }else if(view.topper==='flame'){
            context.beginPath();context.moveTo(0,-15.75);context.quadraticCurveTo(.25,-14.55,1.4,-14.05);context.quadraticCurveTo(2.05,-12.75,.35,-12.45);context.quadraticCurveTo(-1.9,-12.55,-1.35,-14.15);context.quadraticCurveTo(-.55,-13.65,0,-15.75);context.fill();context.fillStyle='#fff0a0';context.beginPath();context.moveTo(.1,-14.45);context.quadraticCurveTo(1,-13.3,.1,-12.85);context.quadraticCurveTo(-.75,-13.35,.1,-14.45);context.fill();
        }else{
            context.fillStyle='#b58c45';ellipse(context,0,-14.15,.22,1.35,0);context.fillStyle=accent;ellipse(context,-.85,-14.85,.75,.42,-.5);ellipse(context,.82,-14.15,.75,.42,.48);ellipse(context,-.78,-13.55,.7,.4,-.45);
        }
        context.restore();
    }
    function draw(context,view,state){
        view=view||profile();state=state||{};var colors={body:view.body,accent:view.accent},hands=handAnchors(state);
        drawFeet(context,state,colors);drawArm(context,-1,hands.left,state,colors);drawArm(context,1,hands.right,state,colors);
        context.fillStyle=view.body;eggPath(context);context.fill();
        context.save();eggPath(context);context.clip();var shade=context.createLinearGradient(-4,-12,4,0);shade.addColorStop(0,'rgba(255,255,255,.64)');shade.addColorStop(.55,'rgba(255,255,255,.05)');shade.addColorStop(1,'rgba(53,95,81,.12)');context.fillStyle=shade;context.fillRect(-6,-14,12,15);context.fillStyle='rgba(51,87,75,.06)';ellipse(context,0,-.2,4.25,1.15,0);context.restore();
        context.fillStyle='rgba(255,255,255,.46)';ellipse(context,-2.15,-10.65,1.2,2.1,.28);drawFace(context);drawTopper(context,view,state);
    }
    function allProfiles(){var result=[];Object.keys(THEMES).forEach(function(id){result.push(profile({id:id}));});return result;}

    window.DanboFallingCatchCharacter={profile:profile,draw:draw,handAnchors:handAnchors,allProfiles:allProfiles};
})();
