(function(){
    'use strict';
    if(!window.DANBO_PLUGIN_HOST||!window.DANBO_PLUGIN_HOST.registerEntrance){console.warn('[falling-catch entrance] Plugin host missing');return;}

    var NAME={zhs:'🍃 风野拾集',zht:'🍃 風野拾集',ja:'🍃 風のフィールド',en:'🍃 Breezy Harvest'};
    var DESC={zhs:'进入风野，接取自然落物并避开石块？',zht:'進入風野，接取自然落物並避開石塊？',ja:'風のフィールドで木の実を集めますか？',en:'Enter the meadow to catch nature finds and avoid stones?'};
    function locale(map,lang){return map[lang]||map.en||map.zhs||'';}

    window.DANBO_PLUGIN_HOST.registerEntrance({
        id:'falling-catch-meadow',pluginId:'falling-catch',hiddenType:'fallingCatch',targetStyle:-99,
        disabledCityStyles:[5],name:NAME,desc:DESC,color:0x74a86f,
        create:function(ctx){
            if(!ctx||!ctx.THREE||!ctx.cityGroup||ctx.currentCityStyle===5)return null;
            var THREE=ctx.THREE,toon=ctx.toon||function(color){return new THREE.MeshBasicMaterial({color:color});};
            var group=new THREE.Group();group.position.set(13,0,-16);
            function mesh(geometry,color,x,y,z,parent){var item=new THREE.Mesh(geometry,toon(color));item.position.set(x||0,y||0,z||0);item.castShadow=true;item.receiveShadow=true;(parent||group).add(item);return item;}
            mesh(new THREE.CylinderGeometry(3.8,4.4,.34,12),0x50765d,0,.17,0);
            for(var p=-1;p<=1;p+=2){mesh(new THREE.CylinderGeometry(.16,.2,3.2,8),0x826442,p*2.6,1.6,0);}
            var canopy=mesh(new THREE.ConeGeometry(4.3,1.7,7),0x79a96f,0,3.55,0);canopy.rotation.y=.25;
            mesh(new THREE.TorusGeometry(1.6,.18,8,22,Math.PI),0xc59a58,0,1.45,.45).rotation.z=Math.PI;
            var basket=mesh(new THREE.CylinderGeometry(1.45,1.1,1.05,12),0xc89655,0,.72,.45);basket.scale.z=.62;
            var leafColors=[0xe5c45f,0xa2bd66,0xc76f70];
            for(var i=0;i<7;i++){
                var leaf=mesh(new THREE.SphereGeometry(.25,8,6),leafColors[i%leafColors.length],-2.4+i*.8,2.4+(i%2)*.28,.2);
                leaf.scale.set(1.5,.55,.35);leaf.rotation.z=(i%2?-.35:.35);
            }
            var ring=new THREE.Mesh(new THREE.TorusGeometry(.62,.07,8,24),new THREE.MeshBasicMaterial({color:0x74a86f,transparent:true,opacity:.01}));ring.position.set(0,.18,4.1);group.add(ring);
            var inner=new THREE.Mesh(new THREE.CircleGeometry(.62,20),new THREE.MeshBasicMaterial({color:0xf3d783,transparent:true,opacity:.01,side:THREE.DoubleSide}));inner.position.set(0,.2,4.1);inner.rotation.x=-Math.PI/2;group.add(inner);
            if(ctx.makeSign)ctx.makeSign(group,locale(NAME,ctx.lang||'en'),0xf3d783,{x:0,y:4.65,z:1.1},{x:5.5,y:.72,z:1});
            return {group:group,ring:ring,inner:inner,x:13,z:-11.9,y:0,color:0x74a86f,name:NAME,desc:DESC,pluginId:'falling-catch',hiddenType:'fallingCatch',targetStyle:-99};
        }
    });
})();
