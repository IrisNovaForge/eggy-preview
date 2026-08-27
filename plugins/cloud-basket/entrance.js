(function(){
    'use strict';
    if(!window.DANBO_PLUGIN_HOST||!window.DANBO_PLUGIN_HOST.registerEntrance)return;
    var NAME={zhs:'梦光验货所',zht:'夢光驗貨所',ja:'夢光チェック所',en:'Dreamlight Inspection'};
    var DESC={zhs:'开始一场梦光观察训练吗？',zht:'開始一場夢光觀察訓練嗎？',ja:'夢光の観察トレーニングを始めますか？',en:'Begin a dreamlight observation session?'};
    window.DANBO_PLUGIN_HOST.registerEntrance({
        id:'cloud-basket-depot',pluginId:'cloud-basket',hiddenType:'cloudBasket',targetStyle:-99,disabledCityStyles:[],name:NAME,desc:DESC,color:0x8fd8f4,
        create:function(ctx){
            if(!ctx||!ctx.THREE||!ctx.cityGroup)return null;
            var THREE=ctx.THREE,toon=ctx.toon||function(color){return new THREE.MeshBasicMaterial({color:color});};
            var group=new THREE.Group();group.position.set(12,0,-13);
            function box(w,h,d,color,x,y,z){var mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),toon(color));mesh.position.set(x||0,y||0,z||0);mesh.castShadow=true;group.add(mesh);return mesh;}
            box(6.8,.3,5.8,0x4c8298,0,.15,0);box(5.8,3.5,4.8,0xfff6dc,0,1.9,0);box(6.5,.55,5.5,0x8fd8f4,0,3.9,0);box(2.2,2.5,.18,0x78a8bb,0,1.4,2.48);
            for(var i=-1;i<=1;i++)box(.7,.7,.35,[0x6bc4e6,0xf6c451,0xf29a92][i+1],i*1.25,3.05,2.55);
            if(ctx.makeSign)ctx.makeSign(group,NAME[ctx.lang]||NAME.en,0xffe7a6,{x:0,y:4.9,z:2.45},{x:5.1,y:.65,z:1});
            return {group:group,x:12,z:-10.1,y:0,color:0x8fd8f4,name:NAME,desc:DESC,pluginId:'cloud-basket',hiddenType:'cloudBasket',targetStyle:-99};
        }
    });
})();
