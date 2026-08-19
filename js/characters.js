// characters.js — DANBO World
// Shared art-direction data for the eight regional travelers.  Runtime systems
// use the same canonical traveler ids so art, combat and plugins cannot drift.
const DANBO_TRAVELER_VISUAL_PROFILES={
    blossomTraveler:{silhouette:'soft-bean',bodyX:1.09,bodyY:0.90,bodyZ:1.02,topTaper:0.05,lowerFullness:0.07,asymmetry:0.010,face:'gentle',hands:'petal',feet:'blossom',material:'velvet',idle:'petal-breathe'},
    herbTraveler:{silhouette:'seed',bodyX:0.94,bodyY:1.07,bodyZ:0.98,topTaper:0.09,lowerFullness:0.02,asymmetry:0.004,face:'natural',hands:'leaf',feet:'leaf',material:'matte-botanical',idle:'leaf-sway'},
    saltCrystalTraveler:{silhouette:'soft-crystal',bodyX:1.01,bodyY:0.98,bodyZ:0.99,topTaper:0.06,lowerFullness:0.04,facet:0.026,face:'calm',hands:'crystal',feet:'crystal',material:'salt-crystal',idle:'crystal-glint'},
    cloudwingTraveler:{silhouette:'light-tall',bodyX:0.91,bodyY:1.08,bodyZ:0.94,topTaper:0.10,lowerFullness:0.01,face:'easygoing',hands:'cloud',feet:'cloud',material:'soft-mist',idle:'cloud-float'},
    fruitbrewTraveler:{silhouette:'round-orchard',bodyX:1.10,bodyY:0.95,bodyZ:1.04,topTaper:0.035,lowerFullness:0.06,face:'friendly',hands:'orchard',feet:'orchard',material:'fruit-satin',idle:'orchard-bounce'},
    berryTraveler:{silhouette:'short-plump',bodyX:1.13,bodyY:0.89,bodyZ:1.06,topTaper:0.035,lowerFullness:0.08,face:'lively',hands:'berry',feet:'berry',material:'berry-jelly',idle:'berry-sway'},
    spicyFlameTraveler:{silhouette:'water-drop',bodyX:1.04,bodyY:1.02,bodyZ:1.01,topTaper:0.14,lowerFullness:0.10,facet:0.010,face:'confident',hands:'volcanic',feet:'volcanic',material:'volcanic-matte',idle:'ember-pulse'},
    goldenGrainTraveler:{silhouette:'grain',bodyX:0.92,bodyY:1.08,bodyZ:0.96,topTaper:0.10,lowerFullness:0.045,face:'steady',hands:'grain',feet:'grain',material:'warm-clay',idle:'wheat-sway'}
};
// One narrow compatibility boundary for old saves/plugins.  No gameplay or art
// branch uses these aliases after resolution.
const DANBO_TRAVELER_COMPAT_ALIASES={
    egg:'blossomTraveler',
    forestEgg:'herbTraveler',crystalEgg:'saltCrystalTraveler',angelEgg:'cloudwingTraveler',
    candyEgg:'fruitbrewTraveler',starEgg:'berryTraveler',rockEgg:'spicyFlameTraveler',windEgg:'goldenGrainTraveler'
};
function resolveTravelerId(value){
    var id=String(value||'blossomTraveler');
    return DANBO_TRAVELER_VISUAL_PROFILES[id]?id:(DANBO_TRAVELER_COMPAT_ALIASES[id]||'blossomTraveler');
}
const CHARACTERS = [
    // Traveler select screen layout: top row L→R, bottom row L→R
    {id:'blossomTraveler',legacyId:'egg',name:'花香旅人',birthCity:6,color:0xFFFDF2,accent:0xEF4A5B,icon:'\uD83C\uDF3C',mapX:200,mapY:110},
    {id:'herbTraveler',legacyId:'forestEgg',name:'香草旅人',birthCity:7,color:0xBFE8A0,accent:0x8FD16A,icon:'\uD83C\uDF32',mapX:110,mapY:55},
    {id:'saltCrystalTraveler',legacyId:'crystalEgg',nameKey:'saltCrystalTraveler',name:'盐晶旅人',birthCity:2,color:0xF4E9E1,accent:0xE7B6C8,icon:'\uD83D\uDC8E',mapX:300,mapY:52},
    {id:'cloudwingTraveler',legacyId:'angelEgg',nameKey:'cloudwingTraveler',name:'云翼旅人',birthCity:0,color:0xDDF5FF,accent:0x78BFE6,icon:'\u2601\uFE0F',mapX:200,mapY:34},
    // Warm orchard coral keeps the fruit-themed details and raspberry cheeks readable.
    {id:'fruitbrewTraveler',legacyId:'candyEgg',nameKey:'fruitbrewTraveler',name:'果酿旅人',birthCity:4,color:0xFF9C91,accent:0x78B766,icon:'\uD83C\uDF4E',mapX:335,mapY:120},
    {id:'berryTraveler',legacyId:'starEgg',nameKey:'berryTraveler',name:'浆果旅人',birthCity:5,color:0x557FCC,accent:0xD85C91,icon:'\uD83E\uDED0',mapX:95,mapY:165},
    {id:'spicyFlameTraveler',legacyId:'rockEgg',nameKey:'spicyFlameTraveler',name:'辣焰旅人',birthCity:3,color:0xF26F52,accent:0xFFD05A,icon:'\uD83C\uDF36\uFE0F',mapX:55,mapY:105},
    {id:'goldenGrainTraveler',legacyId:'windEgg',nameKey:'goldenGrainTraveler',name:'金穗旅人',birthCity:1,color:0xE8B95C,accent:0xF3D36A,icon:'\uD83C\uDF3E',mapX:320,mapY:175},
];
let selectedChar = 0;
// Apply localized character names
for(var _ci=0;_ci<CHARACTERS.length;_ci++){CHARACTERS[_ci].name=I18N.charNames[_langCode][_ci]||CHARACTERS[_ci].name;}
const AI_COLORS=[0xFFAA44,0x66DD66,0xFF5555,0x88CCDD,0xEEEE55,0xCC88CC,0xFFBBCC,0xAA88BB,0xFF8855,0x77BBFF,0xBB88FF,0xFFCC88,0xAAFF77,0xFF77AA,0x77DDDD,0xDDAA55];

// ---- Traveler Character Select Grid ----
const charGrid = document.getElementById('char-grid');
