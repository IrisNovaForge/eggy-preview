import * as THREE from '../../../js/vendor/three-r180/three.module.min.js';

window.THREE=THREE;
window.DANBO_VISUAL_QUALITY={mode:'balanced',high:false,low:false};
window.DANBO_TRAVELER_VISUAL_PROFILES={
    blossomTraveler:{silhouette:'soft-bean',bodyX:1.09,bodyY:0.90,bodyZ:1.02,topTaper:0.05,lowerFullness:0.07,asymmetry:0.010,face:'gentle',hands:'petal',feet:'blossom',material:'velvet',idle:'petal-breathe'},
    herbTraveler:{silhouette:'seed',bodyX:0.94,bodyY:1.07,bodyZ:0.98,topTaper:0.09,lowerFullness:0.02,asymmetry:0.004,face:'natural',hands:'leaf',feet:'leaf',material:'matte-botanical',idle:'leaf-sway'},
    saltCrystalTraveler:{silhouette:'soft-crystal',bodyX:1.01,bodyY:0.98,bodyZ:0.99,topTaper:0.06,lowerFullness:0.04,facet:0.026,face:'calm',hands:'crystal',feet:'crystal',material:'salt-crystal',idle:'crystal-glint'},
    cloudwingTraveler:{silhouette:'light-tall',bodyX:0.91,bodyY:1.08,bodyZ:0.94,topTaper:0.10,lowerFullness:0.01,face:'easygoing',hands:'cloud',feet:'cloud',material:'soft-mist',idle:'cloud-float'},
    fruitbrewTraveler:{silhouette:'round-orchard',bodyX:1.10,bodyY:0.95,bodyZ:1.04,topTaper:0.035,lowerFullness:0.06,face:'friendly',hands:'orchard',feet:'orchard',material:'fruit-satin',idle:'orchard-bounce'},
    berryTraveler:{silhouette:'short-plump',bodyX:1.13,bodyY:0.89,bodyZ:1.06,topTaper:0.035,lowerFullness:0.08,face:'lively',hands:'berry',feet:'berry',material:'berry-jelly',idle:'berry-sway'},
    spicyFlameTraveler:{silhouette:'water-drop',bodyX:1.04,bodyY:1.02,bodyZ:1.01,topTaper:0.14,lowerFullness:0.10,facet:0.010,face:'confident',hands:'volcanic',feet:'volcanic',material:'volcanic-matte',idle:'ember-pulse'},
    goldenGrainTraveler:{silhouette:'grain',bodyX:0.92,bodyY:1.08,bodyZ:0.96,topTaper:0.10,lowerFullness:0.045,face:'steady',hands:'grain',feet:'grain',material:'warm-clay',idle:'wheat-sway'}
};
window.resolveTravelerId=function(value){
    var aliases={egg:'blossomTraveler',forestEgg:'herbTraveler',crystalEgg:'saltCrystalTraveler',angelEgg:'cloudwingTraveler',candyEgg:'fruitbrewTraveler',starEgg:'berryTraveler',rockEgg:'spicyFlameTraveler',windEgg:'goldenGrainTraveler'};
    var id=String(value||'blossomTraveler');
    return window.DANBO_TRAVELER_VISUAL_PROFILES[id]?id:(aliases[id]||'blossomTraveler');
};
window._cleanMaterialOptions=function(opts){
    var clean={};opts=opts||{};
    for(var key in opts)if(Object.prototype.hasOwnProperty.call(opts,key)&&opts[key]!==undefined)clean[key]=opts[key];
    return clean;
};
window._cutePastelHex=function(color,amount){
    if(typeof color!=='number')return color;
    amount=amount===undefined?0.16:amount;
    var r=(color>>16)&255,g=(color>>8)&255,b=color&255,lum=r*.299+g*.587+b*.114;
    if(lum<72)amount=Math.max(amount,.24);else if(lum>220)amount=Math.min(amount,.08);
    r=Math.round(r+(255-r)*amount);g=Math.round(g+(255-g)*amount);b=Math.round(b+(255-b)*amount);
    return (r<<16)|(g<<8)|b;
};
window.toon=function(color,opts){
    opts=window._cleanMaterialOptions(opts);var pastelAmount=opts.pastelAmount;delete opts.pastelAmount;delete opts.noPastel;
    return new THREE.MeshToonMaterial(Object.assign({color:window._cutePastelHex(color===undefined?0xFFFFFF:color,pastelAmount)},opts));
};
window.softPBR=function(color,opts){
    opts=window._cleanMaterialOptions(opts);var pastelAmount=opts.pastelAmount;delete opts.pastelAmount;
    var wantsPhysical=opts.clearcoat!==undefined||opts.sheen!==undefined||opts.transmission!==undefined||opts.iridescence!==undefined;
    var MaterialType=wantsPhysical&&THREE.MeshPhysicalMaterial?THREE.MeshPhysicalMaterial:THREE.MeshStandardMaterial;
    return new MaterialType(Object.assign({color:window._cutePastelHex(color===undefined?0xFFFFFF:color,pastelAmount===undefined?.07:pastelAmount),roughness:opts.roughness===undefined?.72:opts.roughness,metalness:opts.metalness===undefined?0:opts.metalness},opts));
};

function loadScript(source){
    return new Promise(function(resolve,reject){
        var script=document.createElement('script');script.src=source;script.onload=resolve;script.onerror=reject;document.body.appendChild(script);
    });
}

try{
    await loadScript('../../../js/entity.js?v=20260819.6');
    await loadScript('../brick-breaker-character.js?v=20260819.6');
    await loadScript('../brick-breaker-rules.js?v=20260819.6');
    await loadScript('../brick-breaker-core.js?v=20260819.6');
    await loadScript('standalone.js?v=20260819.6');
}catch(error){
    console.error('[brick-breaker] standalone startup failed',error);
    document.getElementById('brick-breaker-standalone').textContent='Game preview failed to start.';
}
