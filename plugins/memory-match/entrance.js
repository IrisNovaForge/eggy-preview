(function(){
    'use strict';
    if(!window.DANBO_PLUGIN_HOST||!window.DANBO_PLUGIN_HOST.registerEntrance)return;
    var NAME={zhs:'记忆配对屋',zht:'記憶配對屋',ja:'メモリーペアの家',en:'Memory Pair House'};
    var DESC={zhs:'进入记忆配对挑战？',zht:'進入記憶配對挑戰？',ja:'メモリーペアに挑戦しますか？',en:'Enter the memory pair challenge?'};
    window.DANBO_PLUGIN_HOST.registerEntrance({
        id:'memory-match-house',pluginId:'memory-match',hiddenType:'memoryMatch',targetStyle:-99,disabledCityStyles:[5],name:NAME,desc:DESC,color:0x76cfa4,
        create:function(ctx){
            if(!ctx||!ctx.THREE||!ctx.cityGroup||ctx.currentCityStyle===5)return null;
            var THREE=ctx.THREE,toon=ctx.toon||function(color){return new THREE.MeshBasicMaterial({color:color});};
            var group=new THREE.Group();group.position.set(15,0,-15);
            function box(w,h,d,color,x,y,z){var mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),toon(color));mesh.position.set(x||0,y||0,z||0);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);return mesh;}
            box(7.2,.28,6.2,0x315e57,0,.14,0);box(6.2,3.7,5.1,0xfffaed,0,2,0);box(6.8,.5,5.7,0x76cfa4,0,4,0);box(2.5,2.4,.15,0x4c7770,0,1.35,2.62);
            var colors=[0xef6978,0x75a966,0x74a7c7,0x8b9bd0];
            for(var row=0;row<2;row++)for(var col=0;col<4;col++)box(.58,.76,.13,colors[col],-1.18+col*.79,3.05-row*.88,2.68);
            var ring=new THREE.Mesh(new THREE.TorusGeometry(.6,.07,8,24),new THREE.MeshBasicMaterial({color:0x76cfa4,transparent:true,opacity:.01}));ring.position.set(0,.18,3.25);group.add(ring);
            var inner=new THREE.Mesh(new THREE.CircleGeometry(.6,20),new THREE.MeshBasicMaterial({color:0xffe69b,transparent:true,opacity:.01,side:THREE.DoubleSide}));inner.position.set(0,.2,3.25);inner.rotation.x=-Math.PI/2;group.add(inner);
            if(ctx.makeSign)ctx.makeSign(group,NAME[ctx.lang]||NAME.en,0xffe69b,{x:0,y:5.05,z:2.62},{x:5.4,y:.7,z:1});
            return {group:group,ring:ring,inner:inner,x:15,z:-11.75,y:0,color:0x76cfa4,name:NAME,desc:DESC,pluginId:'memory-match',hiddenType:'memoryMatch',targetStyle:-99};
        }
    });
})();

