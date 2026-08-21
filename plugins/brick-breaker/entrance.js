(function(){
    'use strict';
    if(!window.DANBO_PLUGIN_HOST||!window.DANBO_PLUGIN_HOST.registerEntrance){console.warn('[brick-breaker entrance] Plugin host missing');return;}

    var NAME={zhs:'✨ 星光碰撞',zht:'✨ 星光碰撞',ja:'✨ 星明かりの衝突',en:'✨ Starlight Collision'};
    var DESC={zhs:'进入挑战，接住光球并完成清理？',zht:'進入挑戰，接住光球並完成清理？',ja:'チャレンジに入り、光のボールを受け止めますか？',en:'Enter the challenge and catch the light ball?'};
    function locale(map,lang){return map[lang]||map.en||map.zhs||'';}

    window.DANBO_PLUGIN_HOST.registerEntrance({
        id:'brick-breaker-workshop',pluginId:'brick-breaker',hiddenType:'brickBreaker',targetStyle:-99,
        disabledCityStyles:[5],name:NAME,desc:DESC,color:0x76CFA4,
        create:function(ctx){
            if(!ctx||!ctx.THREE||!ctx.cityGroup||ctx.currentCityStyle===5)return null;
            var THREE=ctx.THREE,toon=ctx.toon||function(color){return new THREE.MeshBasicMaterial({color:color});};
            var group=new THREE.Group();group.position.set(-15,0,-15);
            function box(w,h,d,color,x,y,z,parent){
                var mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),toon(color));mesh.position.set(x||0,y||0,z||0);mesh.castShadow=true;mesh.receiveShadow=true;(parent||group).add(mesh);return mesh;
            }
            box(7.6,.28,6.6,0x315E57,0,.14,0);
            box(6.6,3.8,5.4,0xF5F0D9,0,2.02,0);
            box(7.1,.48,5.9,0x76CFA4,0,4.03,0);
            box(7.5,.22,6.3,0xFFF0A5,0,4.37,0);
            box(2.6,2.45,.15,0x4C7770,0,1.38,2.76);
            box(2.25,.16,.2,0x8AE0BB,0,.56,2.89);

            var colors=[0x76CFA4,0x75C8D3,0x8BAEE8,0xF0A5B9,0xF0C96D];
            for(var row=0;row<3;row++)for(var col=0;col<5;col++){
                box(.67,.34,.14,colors[(row+col)%colors.length],-1.52+col*.76,3.08-row*.48,2.82);
            }
            var ball=new THREE.Mesh(new THREE.SphereGeometry(.28,16,12),toon(0xFFF3A1));ball.position.set(0,2.02,2.92);ball.castShadow=true;group.add(ball);
            var glowRing=new THREE.Mesh(new THREE.TorusGeometry(.42,.045,7,24),toon(0xFFFFFF));glowRing.position.copy(ball.position);glowRing.rotation.x=Math.PI/2;group.add(glowRing);

            for(var side=-1;side<=1;side+=2){
                var post=new THREE.Mesh(new THREE.CylinderGeometry(.13,.17,2.3,10),toon(0x65B995));post.position.set(side*3.2,1.18,2.48);post.castShadow=true;group.add(post);
                var lamp=new THREE.Mesh(new THREE.SphereGeometry(.24,12,8),toon(0xFFF0A5));lamp.position.set(side*3.2,2.45,2.48);group.add(lamp);
            }

            var ring=new THREE.Mesh(new THREE.TorusGeometry(.6,.07,8,24),new THREE.MeshBasicMaterial({color:0x76CFA4,transparent:true,opacity:.01}));ring.position.set(0,.18,3.4);group.add(ring);
            var inner=new THREE.Mesh(new THREE.CircleGeometry(.6,20),new THREE.MeshBasicMaterial({color:0xFFF0A5,transparent:true,opacity:.01,side:THREE.DoubleSide}));inner.position.set(0,.2,3.4);inner.rotation.x=-Math.PI/2;group.add(inner);

            if(ctx.makeSign)ctx.makeSign(group,locale(NAME,ctx.lang||'en'),0xFFF0A5,{x:0,y:5.18,z:2.75},{x:5.8,y:.72,z:1});
            return {group:group,ring:ring,inner:inner,x:-15,z:-11.6,y:0,color:0x76CFA4,name:NAME,desc:DESC,pluginId:'brick-breaker',hiddenType:'brickBreaker',targetStyle:-99};
        }
    });
})();
