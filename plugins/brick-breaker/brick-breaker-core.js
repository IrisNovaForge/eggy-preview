(function(){
    'use strict';

    var W=960,H=720,PORTRAIT_H=1040,PORTRAIT_Y_START=300,PORTRAIT_Y_END=560,TOUCH_DEAD_ZONE=.16,TOUCH_START_THRESHOLD=.20,TOUCH_STOP_THRESHOLD=.18,TOUCH_RESPONSE_CURVE=1.35,STARTING_LIVES=3;
    var LEVEL_BALL_SPEEDS={1:370,2:400,3:440,4:500,5:540,6:560};
    var LEVEL_SEED_LIMITS={1:2,2:3,3:3,4:6,5:4,6:4};
    var CORE_ASSET_BASE=(function(){try{var source=document.currentScript&&document.currentScript.src;return source?new URL('.',source).href:String(window.DANBO_BRICK_BREAKER_BASE_URL||'');}catch(error){return '';}})();
    var BRICK_CONTACT_AUDIO_URL=CORE_ASSET_BASE?new URL('audio/brick-contact-a.wav?v=20260822.45',CORE_ASSET_BASE).href:'';
    var CHARACTER_HEAD_BOUNCE_AUDIO_URL=CORE_ASSET_BASE?new URL('audio/character-head-bounce-c.wav?v=20260822.46',CORE_ASSET_BASE).href:'';
    var ITEM_CATCH_AUDIO_URL=CORE_ASSET_BASE?new URL('audio/item-catch-b.wav?v=20260822.47',CORE_ASSET_BASE).href:'';
    var EGGSHELL_POWER_AUDIO_URL=CORE_ASSET_BASE?new URL('audio/eggshell-power-launch-b.wav?v=20260822.48',CORE_ASSET_BASE).href:'';
    var BALL_DROP_AUDIO_URL=CORE_ASSET_BASE?new URL('audio/ball-drop-a.wav?v=20260822.49',CORE_ASSET_BASE).href:'';
    var STAGE_CLEAR_AUDIO_URL=CORE_ASSET_BASE?new URL('audio/stage-clear-b.wav?v=20260822.49',CORE_ASSET_BASE).href:'';
    var STAGE_FAIL_AUDIO_URL=CORE_ASSET_BASE?new URL('audio/stage-fail-a.wav?v=20260822.49',CORE_ASSET_BASE).href:'';
    var BGM_AUDIO_URL=CORE_ASSET_BASE?new URL('audio/starlight-collision-bgm-candidate-b.mp3?v=20260822.52',CORE_ASSET_BASE).href:'';
    var WORLD_PALETTE=['#f29a91','#f5b67f','#f2d36f','#9fd1a9','#82c7d5','#b8abd6'];
    var STAGE_WORLDS={
        1:{sky:['#8fd8e8','#c8eadf','#ffe1aa'],horizon:'#91cfb2',ground:'#79bd99',light:'#fff4c8',accent:'#f29a91'},
        2:{sky:['#91d8e7','#c5eadc','#f8dca8'],horizon:'#8bcaae',ground:'#72b794',light:'#fff2c2',accent:'#7ec6d3'},
        3:{sky:['#99d9e5','#d3ebdc','#ffe4b5'],horizon:'#a3d1b2',ground:'#83bc9b',light:'#fff5d3',accent:'#f2b183'},
        4:{sky:['#90d3e4','#c9e6dc','#ffd9ad'],horizon:'#94cab0',ground:'#76b394',light:'#fff0c7',accent:'#efa092'},
        5:{sky:['#8fc7dc','#c8dcdf','#f5d0aa'],horizon:'#9ebfac',ground:'#789e91',light:'#ffe8bd',accent:'#b9a8d3'},
        6:{sky:['#89cfe2','#c9e5d8','#ffd49c'],horizon:'#9ac9a8',ground:'#76ae8e',light:'#fff0b7',accent:'#ef9b82'}
    };
    function stageWorldFor(level){return STAGE_WORLDS[level]||STAGE_WORLDS[1];}
    var STAGE_SELECT_COPY={
        zhs:{enter:'进入关卡',select:'选择关卡',stagePrefix:'第',stageSuffix:'关',next:'进入下一关',back:'返回关卡选择',locked:'尚未解锁',levels:['破壳花园','芽围轻摆','双层柔壳','柔性偏转','回芽星巢','群芽汇辉']},
        zht:{enter:'進入關卡',select:'選擇關卡',stagePrefix:'第',stageSuffix:'關',next:'進入下一關',back:'返回關卡選擇',locked:'尚未解鎖',levels:['破殼花園','芽圍輕擺','雙層柔殼','柔性偏轉','回芽星巢','群芽匯輝']},
        ja:{enter:'ステージへ',select:'ステージを選ぶ',stagePrefix:'ステージ',stageSuffix:'',next:'次のステージへ',back:'ステージ選択へ',locked:'未解放',levels:['殻ひらく花園','芽囲いのそよぎ','二重の柔殻','やわらか偏向','芽帰りの星巣','集う芽の輝き']},
        en:{enter:'Enter Stages',select:'Choose a Stage',stagePrefix:'Stage ',stageSuffix:'',next:'Next Stage',back:'Back to Stage Select',locked:'Locked',levels:['Shellbreak Garden','Swaying Budring','Double Soft-shell','Gentle Deflection','Returning Bud Nest','Gathered Budglow']}
    };
    var STAGE_THREE_COPY={
        zhs:{basic:'第三关 · 双层柔壳 · 慢风绒由柔壳蓄成'},
        zht:{basic:'第三關 · 雙層柔殼 · 慢風絨由柔殼蓄成'},
        ja:{basic:'ステージ3 · 二重の柔殻 · 柔殻からそよ風の綿が生まれる'},
        en:{basic:'Stage 3 · Double Soft-shell · Breeze fluff gathers from cleared shells'}
    };
    var STAGE_FIVE_COPY={
        zhs:{speed:'球速',buff:'柔辉芽核',basic:'第五关 · 回芽星巢 · 元气蛋壳、慢风与星路芽'},
        zht:{speed:'球速',buff:'柔輝芽核',basic:'第五關 · 回芽星巢 · 元氣蛋殼、慢風與星路芽'},
        ja:{speed:'速度',buff:'柔光の芽核',basic:'ステージ5 · 芽の星巣 · 元気の卵殻、そよ風、星の芽'},
        en:{speed:'Speed',buff:'Softglow Bud Core',basic:'Stage 5 · Bud Star Nest · Vitality shell, breeze and star-path buds'}
    };
    var STAGE_SIX_COPY={
        zhs:{speed:'球速',basic:'第六关 · 群芽汇辉 · 元气蛋壳与柔辉同行'},
        zht:{speed:'球速',basic:'第六關 · 群芽匯輝 · 元氣蛋殼與柔輝同行'},
        ja:{speed:'速度',basic:'ステージ6 · 芽光の集い · 元気の卵殻と柔光の同行'},
        en:{speed:'Speed',basic:'Stage 6 · Gathered Budglow · Vitality shell and softglow company'}
    };
    var ITEM_GUIDE_COPY={
        zhs:{title:'本关物件',hazard:{name:'沉壳团',desc:'碰到损失1颗光球',prompt:'避开沉壳团 · 碰到损失1颗光球',result:'光球 −1'},seed:{name:'蛋壳威力',desc:'接住蛋形能量后七连发，本关最多{limit}次',prompt:'接住后可释放蛋壳威力',result:'蛋壳威力已就绪'},life:{name:'元气蛋壳',desc:'光球＋1并获得本关快速移动',prompt:'接住元气蛋壳 · 光球＋1并加快移动',result:'光球＋1 · 快速移动'},slow:{name:'慢风绒',desc:'暂时降低球速',prompt:'接到后暂时降低球速',result:'慢风生效'},clear:{name:'星路芽',desc:'清理最多5块砖',prompt:'接到后清理最多5块砖',result:'清理5块'},buff:{name:'柔辉芽核',desc:'三击砖掉落，当前仅收集',prompt:'三击砖掉落 · 当前只收集',result:'柔辉已收集'},multi:{name:'柔辉芽核',desc:'接住后暂时变成2颗光球',prompt:'接住后光球暂时同行',result:'柔辉同行 · 场上2颗',status:'柔辉同行 · 场上2颗'}},
        zht:{title:'本關物件',hazard:{name:'沉殼團',desc:'碰到損失1顆光球',prompt:'避開沉殼團 · 碰到損失1顆光球',result:'光球 −1'},seed:{name:'蛋殼威力',desc:'接住蛋形能量後七連發，本關最多{limit}次',prompt:'接住後可釋放蛋殼威力',result:'蛋殼威力已就緒'},life:{name:'元氣蛋殼',desc:'光球＋1並獲得本關快速移動',prompt:'接住元氣蛋殼 · 光球＋1並加快移動',result:'光球＋1 · 快速移動'},slow:{name:'慢風絨',desc:'暫時降低球速',prompt:'接到後暫時降低球速',result:'慢風生效'},clear:{name:'星路芽',desc:'清理最多5塊磚',prompt:'接到後清理最多5塊磚',result:'清理5塊'},buff:{name:'柔輝芽核',desc:'三擊磚掉落，目前僅收集',prompt:'三擊磚掉落 · 目前只收集',result:'柔輝已收集'},multi:{name:'柔輝芽核',desc:'接住後暫時變成2顆光球',prompt:'接住後光球暫時同行',result:'柔輝同行 · 場上2顆',status:'柔輝同行 · 場上2顆'}},
        ja:{title:'このステージのアイテム',hazard:{name:'沈み殻の房',desc:'触れるとボールを1つ失う',prompt:'沈み殻の房をよけよう · ボール−1',result:'ボール −1'},seed:{name:'卵殻パワー',desc:'卵形エネルギーで7連射・このステージは最大{limit}回',prompt:'受け取ると卵殻パワーを放てる',result:'卵殻パワーの準備完了'},life:{name:'元気の卵殻',desc:'ボール＋1・このステージ中は高速移動',prompt:'元気の卵殻 · ボール＋1と高速移動',result:'ボール＋1 · 高速移動'},slow:{name:'そよ風の綿',desc:'一時的に速度を下げる',prompt:'受け取ると一時的に速度が下がる',result:'そよ風が発動'},clear:{name:'星路の芽',desc:'最大5個のブロックを消す',prompt:'受け取ると最大5個を清掃',result:'5個を清掃'},buff:{name:'柔光の芽核',desc:'3回ブロックから落下・今は収集のみ',prompt:'3回ブロックから落下 · 今は収集のみ',result:'柔光を収集'},multi:{name:'柔光の芽核',desc:'受け取ると一時的にボールが2つになる',prompt:'受け取ると光球が一時同行',result:'柔光同行 · 2つ',status:'柔光同行 · 2つ'}},
        en:{title:'Stage Items',hazard:{name:'Sunk-shell Cluster',desc:'Lose 1 ball on contact',prompt:'Avoid the sunk-shell cluster · Ball −1',result:'Ball −1'},seed:{name:'Eggshell Power',desc:'Catch the egg energy for a 7-shot stream, up to {limit} times this stage',prompt:'Catch it to ready Eggshell Power',result:'Eggshell Power ready'},life:{name:'Vitality Shell',desc:'Ball +1 and fast movement for this stage',prompt:'Catch it · Ball +1 and faster movement',result:'Ball +1 · Fast movement'},slow:{name:'Breeze Fluff',desc:'Temporarily slows the ball',prompt:'Catch to slow the ball briefly',result:'Breeze active'},clear:{name:'Star-path Bud',desc:'Clears up to 5 bricks',prompt:'Catch to clear up to 5 bricks',result:'5 bricks cleared'},buff:{name:'Softglow Bud Core',desc:'Drops from 3-hit bricks; collection only',prompt:'From 3-hit bricks · collection only',result:'Softglow collected'},multi:{name:'Softglow Bud Core',desc:'Temporarily makes 2 light balls',prompt:'Catch for brief light-ball company',result:'Softglow company · 2 active',status:'Softglow company · 2 active'}}
    };
    var ITEM_GUIDE_ICONS={hazard:'!',seed:'⌁',life:'⌣',slow:'≈',clear:'✦',buff:'···',multi:'••'};
    var ITEM_NOTICE_COLORS={hazard:{soft:'#dce7e4',ink:'#385c5d'},seed:{soft:'#fff3d8',ink:'#a97032'},life:{soft:'#fff0d4',ink:'#bd714f'},slow:{soft:'#def2fb',ink:'#4e91b6'},clear:{soft:'#fff1b9',ink:'#a97726'},buff:{soft:'#eee0f5',ink:'#9169aa'},multi:{soft:'#eee0f5',ink:'#9169aa'}};
    var COPY={
        zhs:{name:'星光碰撞',sub:'接住光球，完成挑战！',start:'开始挑战',resume:'继续',restart:'重新开始',exit:'返回奇境',score:'得分',best:'最佳',lives:'光球',left:'剩余',seed:'蛋壳威力',seedReady:'就绪',seedWaiting:'等待',seedSpent:'用完',attack:'释放威力',ready:'准备发球',readyHint:'按空格、点击画面或轻触按钮发球',pause:'暂停',paused:'旅程暂停',won:'星光清扫完成',lost:'光球用完了',again:'再来一次',title:'返回标题',controls:'← → / A D 移动蛋宝；手机使用左下摇杆左右移动。',seedControls:'E / 手机版「击」按钮使用接住的蛋形能量。',fourthBasic:'第四关 · 柔性偏转 · 最多6次蛋壳威力，每次最多清理3块砖',basic:'基础玩法 · 清空全部砖块通关',launch:'发球'},
        zht:{name:'星光碰撞',sub:'接住光球，完成挑戰！',start:'開始挑戰',resume:'繼續',restart:'重新開始',exit:'返回奇境',score:'得分',best:'最佳',lives:'光球',left:'剩餘',seed:'蛋殼威力',seedReady:'就緒',seedWaiting:'等待',seedSpent:'用完',attack:'釋放威力',ready:'準備發球',readyHint:'按空白鍵、點擊畫面或輕觸按鈕發球',pause:'暫停',paused:'旅程暫停',won:'方塊全部清理完成！',lost:'光球用完了',again:'再來一次',title:'返回標題',controls:'← → / A D 移動蛋寶；手機使用左下搖桿左右移動。',seedControls:'E / 手機版「击」按鈕使用接住的蛋形能量。',fourthBasic:'第四關 · 柔性偏轉 · 最多6次蛋殼威力，每次最多清理3塊磚',basic:'基礎玩法 · 清空全部磚塊通關',launch:'發球'},
        ja:{name:'星明かりの衝突',sub:'光のボールを受け止め、チャレンジを達成しよう！',start:'チャレンジ開始',resume:'つづける',restart:'もう一度',exit:'世界へ戻る',score:'スコア',best:'ベスト',lives:'ボール',left:'のこり',seed:'卵殻パワー',seedReady:'準備OK',seedWaiting:'待機',seedSpent:'終了',attack:'パワーを放つ',ready:'サーブの準備',readyHint:'スペース、画面クリック、またはボタンでスタート',pause:'一時停止',paused:'一時停止中',won:'すべてのブロックを消しました！',lost:'ボールがなくなりました',again:'もう一度',title:'タイトルへ',controls:'← → / A D で移動。スマホは左下のスティックで左右に移動。',seedControls:'E またはモバイルの「击」ボタンで、受け取った卵形エネルギーを使います。',fourthBasic:'ステージ4 · やわらか反射 · 卵殻パワーは最大6回',basic:'基本ルール · すべてのブロックを消すとクリア',launch:'スタート'},
        en:{name:'Starlight Collision',sub:'Catch the light ball and complete the challenge!',start:'Start Challenge',resume:'Resume',restart:'Restart',exit:'Return to World',score:'Score',best:'Best',lives:'Balls',left:'Left',seed:'Eggshell Power',seedReady:'Ready',seedWaiting:'Waiting',seedSpent:'Spent',attack:'Release Power',ready:'Ready to Serve',readyHint:'Press Space, click the board, or tap the button',pause:'Pause',paused:'Journey Paused',won:'All blocks cleared!',lost:'No light balls left',again:'Play Again',title:'Back to Title',controls:'Move with ← → / A D. On mobile, use the lower-left stick to move sideways.',seedControls:'Press E or the mobile Hit button to use the caught egg energy.',fourthBasic:'Stage 4 · Soft deflection · Up to 6 Eggshell Power uses',basic:'Basic rules · Clear every brick to finish',launch:'Launch'}
    };

    var THEMES={
        blossomTraveler:{motif:'petal',glyph:'✿',sky:['#fff1f5','#f5f6d9','#f4d3dc'],palette:['#f5a8bd','#f7c7cf','#f3d882','#a8d7a0','#ef9cad','#f7d7c2'],accent:'#e85270',soft:'#fff2f5',glow:'rgba(232,82,112,.42)',ball:'#e85270',ballCore:'#ffd6df',spark:'#fff1b8'},
        herbTraveler:{motif:'leaf',glyph:'❧',sky:['#dff4cf','#d4eed0','#f2e9b8'],palette:['#6fba73','#8dcd7d','#b0d680','#67aa83','#c2dc92','#7fc190'],accent:'#4d9864',soft:'#edf8df',glow:'rgba(77,152,100,.42)',ball:'#4d9864',ballCore:'#dff5a7',spark:'#efffb9'},
        saltCrystalTraveler:{motif:'crystal',glyph:'◇',sky:['#e8f8ff','#f4eefa','#dcefff'],palette:['#83cfe2','#a8ddeb','#cbbfe6','#efbfd5','#9abce5','#c7e8ed'],accent:'#6e9fcf',soft:'#f1f7ff',glow:'rgba(110,159,207,.46)',ball:'#6e9fcf',ballCore:'#f9efff',spark:'#ffffff'},
        cloudwingTraveler:{motif:'cloud',glyph:'☁',sky:['#dff6ff','#eaf7ff','#f9edca'],palette:['#93cee8','#b5dded','#d4e8ef','#89bddd','#e8dcae','#afd7e7'],accent:'#579dcc',soft:'#edfaff',glow:'rgba(87,157,204,.42)',ball:'#579dcc',ballCore:'#eefcff',spark:'#ffffff'},
        fruitbrewTraveler:{motif:'orchard',glyph:'●',sky:['#fff0df','#ffe5d7','#e8f0c2'],palette:['#f49c87','#ef766f','#f5b36f','#9bc477','#d9d57a','#f0a17a'],accent:'#d95f5a',soft:'#fff1e7',glow:'rgba(217,95,90,.42)',ball:'#d95f5a',ballCore:'#ffe5a8',spark:'#fff2ad'},
        berryTraveler:{motif:'berry',glyph:'✦',sky:['#e6e4ff','#f1dff1','#cfdcf7'],palette:['#657dc8','#7f6fc0','#b36bad','#d47cae','#718fd4','#9d70bd'],accent:'#6d5fb0',soft:'#f0edff',glow:'rgba(109,95,176,.46)',ball:'#6d5fb0',ballCore:'#f5c8e5',spark:'#ffd8f0'},
        spicyFlameTraveler:{motif:'flame',glyph:'▲',sky:['#ffe2bd','#f7b68d','#ef826e'],palette:['#f07155','#e95345','#f69b4f','#dc5948','#f4bd55','#e8784f'],accent:'#d84b38',soft:'#fff0d8',glow:'rgba(216,75,56,.5)',ball:'#d84b38',ballCore:'#ffd45e',spark:'#fff0a0'},
        goldenGrainTraveler:{motif:'grain',glyph:'≋',sky:['#fff0bd','#f3d89a','#dfe3b5'],palette:['#d9a943','#e9bd59','#c78f3f','#f0cd72','#bda35a','#dfb853'],accent:'#b78635',soft:'#fff5d4',glow:'rgba(183,134,53,.44)',ball:'#b78635',ballCore:'#fff0a3',spark:'#fff5ba'}
    };
    function themeFor(id){return THEMES[id]||THEMES.blossomTraveler;}
    function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
    function handlingFor(id){
        var profiles={
            blossomTraveler:{id:'blossomTraveler',trait:'柔瓣节奏',active:true,accel:6900,brake:6900,pointerGain:10,steer:1,feedback:'petalArc'},
            herbTraveler:{id:'herbTraveler',trait:'柔叶折返',active:true,accel:4600,brake:5175,reverseAccel:27600,pointerGain:10,steer:.96,feedback:'leafFlick'},
            saltCrystalTraveler:{id:'saltCrystalTraveler',trait:'晶点定步',active:true,accel:13800,brake:13800,pointerGain:10,steer:1.02,feedback:'crystalGlint'},
            cloudwingTraveler:{id:'cloudwingTraveler',trait:'云步轻浮',active:true,accel:3185,brake:2760,pointerGain:10,steer:.9,feedback:'mistRibbon'},
            fruitbrewTraveler:{id:'fruitbrewTraveler',trait:'果园弹步',active:true,accel:8280,brake:4140,pointerGain:10,steer:1.06,feedback:'orchardDouble'},
            berryTraveler:{id:'berryTraveler',trait:'浆果灵步',active:true,accel:20700,brake:2435,pointerGain:10,steer:.84,feedback:'berryDots'},
            spicyFlameTraveler:{id:'spicyFlameTraveler',trait:'辣焰冲势',active:true,accel:13800,brake:8280,reverseAccel:41400,pointerGain:10,steer:1.12,feedback:'emberSlash'},
            goldenGrainTraveler:{id:'goldenGrainTraveler',trait:'金穗稳守',active:true,accel:2435,brake:20700,pointerGain:10,steer:1.16,feedback:'grainLift'}
        };
        return profiles[id]||{id:'standard',trait:'标准手感',active:false,accel:0,brake:0,pointerGain:10,steer:1,feedback:'softGlow'};
    }
    function esc(s){return String(s===undefined?'':s).replace(/[&<>'"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c];});}
    function cssColor(value,fallback){
        var number=Number(value);
        return Number.isFinite(number)&&number>=0&&number<=0xFFFFFF?'#'+Math.round(number).toString(16).padStart(6,'0'):fallback;
    }
    function portraitSource(portrait){
        var source=typeof portrait==='string'?portrait:(portrait&&portrait.src);
        source=String(source||'');
        if(/^data:image\/png;base64,[a-z0-9+/=]+$/i.test(source))return source;
        try{
            var url=new URL(source,document.baseURI);
            if(url.origin===location.origin&&/\.png$/i.test(url.pathname))return source;
        }catch(error){}
        return '';
    }
    function visualCharacter(character,portrait){
        character=character||{};
        var style=character.style||{};
        return {
            id:String(character.id||'blossomTraveler'),
            name:String(character.displayName||character.name||character.id||'Traveler'),
            color:cssColor(style.color,'#F5F5F0'),
            accent:cssColor(style.accent,'#CC2222'),
            portrait:portraitSource(portrait)
        };
    }
    function detectLang(requested){
        if(COPY[requested])return requested;
        var nav=(navigator.language||'en').toLowerCase();
        if(nav.indexOf('zh-tw')===0||nav.indexOf('zh-hk')===0||nav.indexOf('zh-hant')===0)return 'zht';
        if(nav.indexOf('zh')===0)return 'zhs';
        if(nav.indexOf('ja')===0)return 'ja';
        return 'en';
    }

    function Game(options){
        options=options||{};
        if(!options.mount)throw new Error('BrickBreaker requires mount');
        this.options=options;
        this.lang=detectLang(options.lang);
        this.t=COPY[this.lang];
        this.character=visualCharacter(options.character,options.characterPortrait);
        this.theme=themeFor(this.character.id);
        this.handling=handlingFor(this.character.id);
        var requestedLevel=Number(options.level);
        this.level=requestedLevel>=2&&requestedLevel<=6?requestedLevel:1;
        this.stageSelectText=STAGE_SELECT_COPY[this.lang]||STAGE_SELECT_COPY.en;
        this.stageFiveText=STAGE_FIVE_COPY[this.lang]||STAGE_FIVE_COPY.en;
        this.stageSixText=STAGE_SIX_COPY[this.lang]||STAGE_SIX_COPY.en;
        this.stageThreeText=STAGE_THREE_COPY[this.lang]||STAGE_THREE_COPY.en;
        this.itemGuideText=ITEM_GUIDE_COPY[this.lang]||ITEM_GUIDE_COPY.en;
        this.stageWorld=stageWorldFor(this.level);
        this.stageSky=this.stageWorld.sky.slice();
        this.stagePalette=WORLD_PALETTE;
        this.rules=options.rules||(window.DanboBrickBreakerRules&&DanboBrickBreakerRules.create());
        if(!this.rules)throw new Error('BrickBreaker rules missing');
        this.storage=options.storage||{get:function(k,d){return d;},set:function(){}};
        this.externalInput=options.input&&typeof options.input.getMoveVector==='function'?options.input:null;
        this.best=Number(this.storage.get('bestScore',0))||0;
        this.maxUnlockedLevel=clamp(Math.round(Number(this.storage.get('maxUnlockedLevel',1))||1),1,6);
        this.root=document.createElement('div');
        this.root.className='bb-root';
        this.root.setAttribute('data-character',this.character.id);
        this.root.setAttribute('data-level',String(this.level));
        this.root.style.setProperty('--bb-theme-accent',this.theme.accent);
        this.root.style.setProperty('--bb-theme-soft',this.theme.soft);
        this.root.style.setProperty('--bb-theme-glow',this.theme.glow);
        this.root.style.setProperty('--bb-theme-sky-a',this.stageSky[0]);
        this.root.style.setProperty('--bb-theme-sky-b',this.stageSky[1]);
        this.root.style.setProperty('--bb-theme-sky-c',this.stageSky[2]);
        this.root.style.setProperty('--bb-world-horizon',this.stageWorld.horizon);
        this.root.style.setProperty('--bb-world-ground',this.stageWorld.ground);
        this.root.style.setProperty('--bb-world-light',this.stageWorld.light);
        this.root.innerHTML=this.markup();
        options.mount.appendChild(this.root);
        this.canvas=this.root.querySelector('.bb-canvas');
        this.ctx2d=this.canvas.getContext('2d');
        this.canvas.width=W;this.canvas.height=H;
        this.presentationHeight=H;this.presentationExtra=0;this.boundPresentationResize=this.syncPresentation.bind(this);this.syncPresentation();
        this.stage=this.root.querySelector('.bb-stage');
        this.characterMount=this.root.querySelector('.bb-character-player');
        this.characterView=window.DanboBrickBreakerCharacter&&window.DanboBrickBreakerCharacter.create({
            mount:this.characterMount,board:this.canvas,stage:this.stage,character:options.character
        });
        this.overlay=this.root.querySelector('.bb-overlay');
        this.card=this.root.querySelector('.bb-card');
        this.localJoystick=this.root.querySelector('.bb-touch-joystick');
        this.localJoystickKnob=this.root.querySelector('.bb-touch-joystick-knob');
        this.localJoystickInput={active:false,x:0,y:0,pointerId:null};
        this.localPunch=this.root.querySelector('.bb-touch-punch');
        this.localPunchInput={active:false,pointerId:null};
        this.localJoystickCapable=!this.externalInput&&(('ontouchstart' in window)||(navigator.maxTouchPoints||0)>0||(window.matchMedia&&window.matchMedia('(pointer:coarse)').matches));
        this.touchControlMode='';this.touchControlsVisible=false;this.touchPunchReady=null;this.touchPunchWasDown=false;this.touchJoystickEngaged=false;
        this.keys={left:false,right:false};
        this.pointerX=null;this.pointerActive=false;this.pointerId=null;this.pointerIsTouch=false;
        this.touchDragStartX=0;this.touchDragInput=0;
        this.running=true;this.state='title';this.last=performance.now();this.raf=0;this.missTimer=0;this.introTimer=0;this.audioCtx=null;this.bgmAudio=null;
        this.brickContactAudioData=null;this.brickContactAudioBuffer=null;this.brickContactAudioLoad=null;this.brickContactAudioDecode=null;this.lastBrickContactAudioAt=-Infinity;this.preloadBrickContactAudio();
        this.characterHeadAudioData=null;this.characterHeadAudioBuffer=null;this.characterHeadAudioLoad=null;this.characterHeadAudioDecode=null;this.lastCharacterHeadAudioAt=-Infinity;this.preloadCharacterHeadAudio();
        this.itemCatchAudioData=null;this.itemCatchAudioBuffer=null;this.itemCatchAudioLoad=null;this.itemCatchAudioDecode=null;this.lastItemCatchAudioAt=-Infinity;this.preloadItemCatchAudio();
        this.eggshellPowerAudioData=null;this.eggshellPowerAudioBuffer=null;this.eggshellPowerAudioLoad=null;this.eggshellPowerAudioDecode=null;this.lastEggshellPowerAudioAt=-Infinity;this.preloadEggshellPowerAudio();
        this.ballDropAudioData=null;this.ballDropAudioBuffer=null;this.ballDropAudioLoad=null;this.ballDropAudioDecode=null;this.lastBallDropAudioAt=-Infinity;this.preloadBallDropAudio();
        this.stageClearAudioData=null;this.stageClearAudioBuffer=null;this.stageClearAudioLoad=null;this.stageClearAudioDecode=null;this.preloadStageClearAudio();
        this.stageFailAudioData=null;this.stageFailAudioBuffer=null;this.stageFailAudioLoad=null;this.stageFailAudioDecode=null;this.preloadStageFailAudio();
        this.boundKeyDown=this.keyDown.bind(this);
        this.boundKeyUp=this.keyUp.bind(this);
        this.boundPointer=this.pointer.bind(this);
        this.boundLocalJoystick=this.localJoystickPointer.bind(this);
        this.boundLocalPunch=this.localPunchPointer.bind(this);
        this.boundClick=this.click.bind(this);
        window.addEventListener('keydown',this.boundKeyDown,true);
        window.addEventListener('keyup',this.boundKeyUp,true);
        window.addEventListener('resize',this.boundPresentationResize);
        window.addEventListener('orientationchange',this.boundPresentationResize);
        this.canvas.addEventListener('pointerdown',this.boundPointer);
        this.canvas.addEventListener('pointermove',this.boundPointer);
        this.canvas.addEventListener('pointerup',this.boundPointer);
        this.canvas.addEventListener('pointercancel',this.boundPointer);
        if(this.localJoystick){this.localJoystick.addEventListener('pointerdown',this.boundLocalJoystick);this.localJoystick.addEventListener('pointermove',this.boundLocalJoystick);this.localJoystick.addEventListener('pointerup',this.boundLocalJoystick);this.localJoystick.addEventListener('pointercancel',this.boundLocalJoystick);}
        if(this.localPunch){this.localPunch.addEventListener('pointerdown',this.boundLocalPunch);this.localPunch.addEventListener('pointerup',this.boundLocalPunch);this.localPunch.addEventListener('pointercancel',this.boundLocalPunch);}
        this.root.addEventListener('click',this.boundClick);
        this.resetBoard();this.showTitle();
        var self=this;this.raf=requestAnimationFrame(function(t){self.loop(t);});
    }

    Game.prototype.syncPresentation=function(){
        var portrait=!!(window.matchMedia&&window.matchMedia('(max-width: 720px) and (orientation: portrait)').matches);
        var targetHeight=portrait?PORTRAIT_H:H;
        this.presentationHeight=targetHeight;this.presentationExtra=targetHeight-H;
        if(this.root)this.root.classList.toggle('bb-portrait-stage',portrait);
        if(this.canvas&&this.canvas.height!==targetHeight)this.canvas.height=targetHeight;
        return portrait;
    };
    Game.prototype.presentationY=function(y){
        var extra=this.presentationExtra||0;if(!extra||typeof y!=='number')return y;
        if(y<=PORTRAIT_Y_START)return y;
        if(y>=PORTRAIT_Y_END)return y+extra;
        var t=(y-PORTRAIT_Y_START)/(PORTRAIT_Y_END-PORTRAIT_Y_START),smooth=t*t*(3-2*t);
        return y+extra*smooth;
    };
    Game.prototype.applyPresentationCoordinates=function(){
        if(!this.presentationExtra)return [];
        var self=this,changes=[],seen=[],yKeys={y:1,baseY:1,sourceY:1,impactY:1,contactY:1};
        function visited(value){for(var vi=0;vi<seen.length;vi++)if(seen[vi]===value)return true;seen.push(value);return false;}
        function walk(value){
            if(!value||typeof value!=='object'||visited(value))return;
            if(Array.isArray(value)){for(var ai=0;ai<value.length;ai++)walk(value[ai]);return;}
            var keys=Object.keys(value);
            for(var ki=0;ki<keys.length;ki++){
                var key=keys[ki],child=value[key];
                if(yKeys[key]&&typeof child==='number'){changes.push([value,key,child]);value[key]=self.presentationY(child);}
                else if(child&&typeof child==='object')walk(child);
            }
        }
        [this.paddle,this.ball,this.companionBalls,this.bricks,this.hitEffects,this.hazard,this.earlyLifeDrop,
         this.stageThreeSlowDrop,this.stageThreeGatherEffects,this.stageThreeCollectEffects,this.seedDrop,this.seedProjectiles,this.seedBursts,
         this.stageFiveDrop,this.stageFiveCollectEffects,this.stageFiveClearPaths,this.stageFiveBuffDrops,this.stageFiveBuffCollectEffects,
         this.stageSixDrops,this.stageSixSplitEffects,this.stageSixDissolveEffects,this.stageSixCollectEffects,
         this.itemHints,this.itemResultEffects,this.padFeedback].forEach(walk);
        return changes;
    };
    Game.prototype.restorePresentationCoordinates=function(changes){
        for(var i=changes.length-1;i>=0;i--){var change=changes[i];change[0][change[1]]=change[2];}
    };

    Game.prototype.markup=function(){
        var t=this.t,character=this.character;
        var characterVisual=character.portrait?'<img class="bb-character-portrait" src="'+esc(character.portrait)+'" alt="">':'';
        var seedHud='<div class="bb-hud-pill bb-seed-pill" hidden><span>'+esc(t.seed)+'</span><b data-seeds>○ 6</b></div>';
        var speedHud='<div class="bb-hud-pill bb-speed-pill" hidden><span data-speed-label>'+esc(this.stageFiveText.speed)+'</span><b data-ball-speed>'+LEVEL_BALL_SPEEDS[this.level]+'</b></div>';
        var seedButton='<button class="bb-seed-attack" data-action="seed" hidden disabled><span>'+esc(t.attack)+'</span><b data-seed-ready>6</b></button>';
        return '<div class="bb-sky" aria-hidden="true"><i></i><i></i><i></i></div>'+
            '<header class="bb-hud" aria-label="Game status">'+
              '<div class="bb-character-badge" role="img" aria-label="'+esc(character.name)+'" title="'+esc(character.name)+'" style="--bb-character-color:'+character.color+';--bb-character-accent:'+character.accent+'">'+
                characterVisual+
                '<span class="bb-character-emblem">'+esc(this.theme.glyph)+'</span>'+
              '</div>'+
              '<div class="bb-hud-pill"><span>'+esc(t.score)+'</span><b data-score>0000</b></div>'+
              '<div class="bb-hud-pill"><span>'+esc(t.best)+'</span><b data-best>'+this.best+'</b></div>'+
              '<div class="bb-hud-pill"><span>'+esc(t.lives)+'</span><b data-lives>● ● ●</b></div>'+
              '<div class="bb-hud-pill"><span>'+esc(t.left)+'</span><b data-left>48</b></div>'+
              seedHud+speedHud+
              '<button class="bb-icon-btn" data-action="pause" aria-label="'+esc(t.pause)+'">Ⅱ</button>'+
              '<button class="bb-exit-btn" data-action="exit">'+esc(t.exit)+'</button>'+
            '</header>'+
            '<main class="bb-stage"><canvas class="bb-canvas" width="960" height="720"></canvas><div class="bb-character-player" aria-hidden="true"></div></main>'+
            '<div class="bb-touch-joystick" role="application" aria-label="Horizontal movement" hidden><div class="bb-touch-joystick-base"><div class="bb-touch-joystick-knob"></div></div></div>'+
            '<button type="button" class="bb-touch-punch" aria-label="击" aria-disabled="true" hidden>击</button>'+
            '<div class="bb-overlay"><section class="bb-card"></section></div>'+
            '<button class="bb-launch" data-action="launch" tabindex="-1">'+esc(t.launch)+'</button>'+
            seedButton+
            '<aside class="bb-item-whisper" data-item-whisper data-type="seed" role="status" aria-live="polite" aria-hidden="true"><i data-item-whisper-icon aria-hidden="true"></i><span><b data-item-whisper-name></b><small data-item-whisper-copy></small></span></aside>'+
            '<footer class="bb-tip" data-controls>'+esc(t.controls)+'</footer>';
    };

    Game.prototype.itemGuideTypes=function(){
        var types=this.level===2?['hazard','life']:(this.level===3?['slow','life']:(this.level===5?['life','slow','clear','buff']:(this.level===6?['life','multi']:[])));
        types.push('seed');return types;
    };
    Game.prototype.itemGuideHtml=function(){
        var types=this.itemGuideTypes();if(!types.length)return '';
        var html='<section class="bb-item-guide" aria-label="'+esc(this.itemGuideText.title)+'"><p>'+esc(this.itemGuideText.title)+'</p><div>';
        for(var i=0;i<types.length;i++){var type=types[i],copy=this.itemGuideText[type],desc=type==='seed'?copy.desc.replace('{limit}',String(this.seedLimit)):copy.desc;html+='<article data-guide-item="'+esc(type)+'"><i aria-hidden="true">'+esc(ITEM_GUIDE_ICONS[type])+'</i><span><b>'+esc(copy.name)+'</b><small>'+esc(desc)+'</small></span></article>';}
        return html+'</div></section>';
    };
    Game.prototype.stageLabel=function(level){return this.stageSelectText.stagePrefix+level+this.stageSelectText.stageSuffix;};
    Game.prototype.stageName=function(level){return this.stageSelectText.levels[level-1]||this.stageSelectText.levels[0];};
    Game.prototype.stageBasicCopy=function(){var t=this.t;return this.level===3?this.stageThreeText.basic:(this.level===4?t.fourthBasic:(this.level===5?this.stageFiveText.basic:(this.level===6?this.stageSixText.basic:t.basic)));};
    Game.prototype.titleHtml=function(){var t=this.t;return '<div class="bb-mark" aria-hidden="true"><span></span><span></span><span></span></div><p class="bb-character-theme"><span>'+esc(this.theme.glyph)+'</span>'+esc(this.character.name)+'</p><h1>'+esc(t.name)+'</h1><p class="bb-sub">'+esc(t.sub)+'</p><button class="bb-primary" data-action="levels">'+esc(this.stageSelectText.enter)+'</button>';};
    Game.prototype.levelSelectHtml=function(){
        var html='<div class="bb-mark bb-level-mark" aria-hidden="true"><span></span><span></span><span></span></div><p class="bb-kicker">BLOCK &amp; LIGHT</p><h2>'+esc(this.stageSelectText.select)+'</h2><div class="bb-level-grid">';
        for(var level=1;level<=6;level++){var locked=level>this.maxUnlockedLevel;html+='<button type="button" class="bb-level-choice" data-action="select-level" data-level="'+level+'" aria-label="'+esc(this.stageLabel(level)+' '+this.stageName(level)+(locked?' · '+this.stageSelectText.locked:''))+'"'+(locked?' disabled':'')+'>'+esc(this.stageName(level))+'</button>';}
        return html+'</div>';
    };
    Game.prototype.levelIntroHtml=function(){return '<div class="bb-stage-sprout" aria-hidden="true"><i></i><i></i><i></i></div><p class="bb-kicker">'+esc(this.stageLabel(this.level))+'</p><h2>'+esc(this.stageName(this.level))+'</h2>';};
    Game.prototype.clearIntroTimer=function(){if(this.introTimer){clearTimeout(this.introTimer);this.introTimer=0;}};
    Game.prototype.focusElement=function(element){if(!element)return false;try{element.focus({preventScroll:true});}catch(error){element.focus();}return document.activeElement===element;};
    Game.prototype.clearMenuFocus=function(){var active=document.activeElement;if(active&&this.card.contains(active)&&active.blur)active.blur();};
    Game.prototype.setGameplayControlsFocusable=function(enabled){var controls=this.root.querySelectorAll('.bb-icon-btn,.bb-exit-btn,.bb-seed-attack');for(var i=0;i<controls.length;i++)controls[i].tabIndex=enabled?0:-1;};
    Game.prototype.focusFirstAction=function(selector){return this.focusElement(this.card.querySelector(selector||'button:not(:disabled)'));};
    Game.prototype.menuButtons=function(){return Array.prototype.slice.call(this.card.querySelectorAll('button:not(:disabled)'));};
    Game.prototype.moveMenuFocus=function(direction){
        var buttons=this.menuButtons();if(!buttons.length)return false;var index=buttons.indexOf(document.activeElement);if(index<0)index=direction<0?0:-1;index=(index+direction+buttons.length)%buttons.length;return this.focusElement(buttons[index]);
    };
    Game.prototype.moveLevelFocus=function(code){
        var buttons=Array.prototype.slice.call(this.card.querySelectorAll('.bb-level-choice')),active=document.activeElement,index=buttons.indexOf(active);if(index<0){this.focusFirstAction('.bb-level-choice:not(:disabled)');return true;}
        var target=index;if(code==='ArrowLeft'&&index%2===1)target=index-1;else if(code==='ArrowRight'&&index%2===0)target=index+1;else if(code==='ArrowUp'&&index>=2)target=index-2;else if(code==='ArrowDown'&&index+2<buttons.length)target=index+2;else if(code==='Home')target=0;else if(code==='End'){for(target=buttons.length-1;target>0&&buttons[target].disabled;target--){}}
        if(buttons[target]&&!buttons[target].disabled)this.focusElement(buttons[target]);return true;
    };
    Game.prototype.activateFocusedAction=function(){var active=document.activeElement;if(!active||!this.card.contains(active)||active.disabled)active=this.card.querySelector('button:not(:disabled)');if(!active)return false;this.focusElement(active);active.click();return true;};
    Game.prototype.showTitle=function(){this.clearIntroTimer();this.stopBgm(true);this.state='title';this.overlay.hidden=false;this.card.className='bb-card bb-entry-card';this.card.innerHTML=this.titleHtml();this.root.classList.remove('bb-playing');this.setGameplayControlsFocusable(false);this.updateHud();this.focusFirstAction();};
    Game.prototype.showLevelSelect=function(){this.clearIntroTimer();this.stopBgm(true);this.state='select';this.overlay.hidden=false;this.card.className='bb-card bb-level-card';this.card.innerHTML=this.levelSelectHtml();this.root.classList.remove('bb-playing');this.setGameplayControlsFocusable(false);this.updateHud();this.focusFirstAction('.bb-level-choice:not(:disabled)');};
    Game.prototype.applyLevelPresentation=function(level){
        this.level=clamp(Math.round(Number(level)||1),1,6);this.root.setAttribute('data-level',String(this.level));
        this.stageWorld=stageWorldFor(this.level);this.stageSky=this.stageWorld.sky.slice();this.stagePalette=WORLD_PALETTE;
        this.root.style.setProperty('--bb-theme-sky-a',this.stageSky[0]);this.root.style.setProperty('--bb-theme-sky-b',this.stageSky[1]);this.root.style.setProperty('--bb-theme-sky-c',this.stageSky[2]);
        this.root.style.setProperty('--bb-world-horizon',this.stageWorld.horizon);this.root.style.setProperty('--bb-world-ground',this.stageWorld.ground);this.root.style.setProperty('--bb-world-light',this.stageWorld.light);
        var seedPill=this.root.querySelector('.bb-seed-pill'),speedPill=this.root.querySelector('.bb-speed-pill'),seedButton=this.root.querySelector('.bb-seed-attack'),controls=this.root.querySelector('[data-controls]'),speedLabel=this.root.querySelector('[data-speed-label]');
        if(seedPill)seedPill.hidden=false;if(speedPill)speedPill.hidden=this.level<5;if(seedButton)seedButton.hidden=false;
        if(speedLabel)speedLabel.textContent=this.level===6?this.stageSixText.speed:this.stageFiveText.speed;
        if(controls)controls.textContent=this.t.controls+' '+this.t.seedControls;
    };
    Game.prototype.showLevelIntro=function(level,bypassLock){
        var requestedLevel=clamp(Math.round(Number(level)||1),1,6);if(!bypassLock&&requestedLevel>this.maxUnlockedLevel){this.showLevelSelect();return false;}
        this.clearIntroTimer();this.applyLevelPresentation(requestedLevel);this.resetBoard();this.state='stage-intro';this.root.classList.add('bb-playing');this.overlay.hidden=false;this.card.className='bb-card bb-stage-card';this.card.innerHTML=this.levelIntroHtml();this.setGameplayControlsFocusable(false);this.updateHud();
        if(this.options.onEvent)this.options.onEvent('levelSelect',{level:this.level,name:this.stageName(this.level)});
        var self=this;this.introTimer=setTimeout(function(){self.introTimer=0;if(self.running&&self.state==='stage-intro')self.startGame();},900);return true;
    };
    Game.prototype.unlockNextLevel=function(){
        if(this.level>=6||this.level>this.maxUnlockedLevel||this.maxUnlockedLevel>=this.level+1)return false;
        this.maxUnlockedLevel=this.level+1;this.storage.set('maxUnlockedLevel',this.maxUnlockedLevel);
        if(this.options.onEvent)this.options.onEvent('levelUnlock',{level:this.maxUnlockedLevel,name:this.stageName(this.maxUnlockedLevel)});return true;
    };

    Game.prototype.showItemHint=function(type,target){
        if(!this.itemGuideText[type]||this.seenItemHints[type])return false;
        this.seenItemHints[type]=true;this.itemHints.push({type:type,target:target,x:target&&target.x||W*.5,y:target&&target.y||H*.5,age:0,duration:1.35});return true;
    };
    Game.prototype.showItemResult=function(type,x,y){
        if(!this.itemGuideText[type])return false;
        this.itemResultEffects.push({type:type,x:x===undefined?this.paddle.x:x,y:y===undefined?this.paddle.y-42:y,age:0,duration:.88});return true;
    };

    Game.prototype.itemWhisperCandidate=function(){
        if(this.state!=='playing')return null;
        if(this.itemResultEffects.length){
            var result=this.itemResultEffects[this.itemResultEffects.length-1];
            return {type:result.type,kind:'result'};
        }
        var active=[];
        if(this.level===2&&this.hazard&&(this.hazard.state==='warning'||this.hazard.state==='falling'))active.push({type:'hazard',y:this.hazard.y});
        if((this.level===2||this.level===3)&&this.earlyLifeDrop)active.push({type:'life',y:this.earlyLifeDrop.y});
        if(this.level===3&&this.stageThreeSlowDrop)active.push({type:'slow',y:this.stageThreeSlowDrop.y});
        if(this.seedDrop)active.push({type:'seed',y:this.seedDrop.y});
        if(this.level===5){
            if(this.stageFiveDrop)active.push({type:this.stageFiveDrop.type,y:this.stageFiveDrop.y});
            for(var i=0;i<this.stageFiveBuffDrops.length;i++)active.push({type:'buff',y:this.stageFiveBuffDrops[i].y});
        }
        if(this.level===6){
            for(var stageSixDropIndex=0;stageSixDropIndex<this.stageSixDrops.length;stageSixDropIndex++)active.push({type:this.stageSixDrops[stageSixDropIndex].type,y:this.stageSixDrops[stageSixDropIndex].y});
        }
        if(!active.length)return this.level===6&&this.companionBalls.length?{type:'multi',kind:'status'}:null;
        active.sort(function(a,b){return b.y-a.y;});
        return {type:active[0].type,kind:'prompt'};
    };

    Game.prototype.updateItemWhisper=function(){
        var element=this.root&&this.root.querySelector('[data-item-whisper]');if(!element)return;
        var candidate=this.itemWhisperCandidate();
        if(!candidate){element.classList.remove('is-visible','is-result');element.setAttribute('aria-hidden','true');this.itemWhisperKey='';return;}
        var copy=this.itemGuideText[candidate.type];if(!copy)return;
        var key=candidate.type+':'+candidate.kind;
        if(this.itemWhisperKey!==key){
            element.setAttribute('data-type',candidate.type);
            var icon=element.querySelector('[data-item-whisper-icon]'),name=element.querySelector('[data-item-whisper-name]'),detail=element.querySelector('[data-item-whisper-copy]');
            if(icon)icon.textContent=ITEM_GUIDE_ICONS[candidate.type]||'·';
            if(name)name.textContent=copy.name;
            if(detail)detail.textContent=candidate.kind==='result'?copy.result:(candidate.kind==='status'?(copy.status||copy.result):(copy.prompt||copy.desc));
            this.itemWhisperKey=key;
        }
        element.classList.toggle('is-result',candidate.kind==='result');element.classList.add('is-visible');element.setAttribute('aria-hidden','false');
    };

    Game.prototype.resetBoard=function(){
        if(this.missTimer){clearTimeout(this.missTimer);this.missTimer=0;}
        this.keys.left=false;this.keys.right=false;this.pointerActive=false;this.pointerId=null;this.pointerX=null;this.pointerIsTouch=false;this.touchDragStartX=0;this.touchDragInput=0;this.touchJoystickEngaged=false;
        this.score=0;this.lives=STARTING_LIVES;this.misses=0;this.serveId=0;this.resolvedServeId=-1;this.remaining=0;this.elapsed=0;this.missHandled=false;
        if(this.characterView&&this.characterView.resetReaction)this.characterView.resetReaction();
        this.paddle={x:W*0.5,y:H-100,w:154,h:22,speed:690,baseSpeed:690,fastSpeed:980,controlVx:0};
        this.ball={x:W*0.5,y:this.paddle.y-28,vx:0,vy:0,r:11,speed:LEVEL_BALL_SPEEDS[this.level]||LEVEL_BALL_SPEEDS[1],companion:false,age:0};
        this.companionBalls=[];
        this.bricks=[];this.hitEffects=[];this.brickMotionTime=0;this.brickMotionDirection=1;
        this.hazard=null;this.hazardClock=0;this.hazardNextAt=6;this.hazardNextGroup='left';this.hazardSpawnCount=0;this.hazardDisabled=this.level!==2;
        this.earlyLifeDrop=null;this.earlyLifeDestroyed=0;this.earlyLifeIssued=false;this.earlyLifeThreshold=this.level===2?16:24;this.vitalitySpeedActive=false;
        this.stageThreeSlowDrop=null;this.stageThreeReinforcedCleared=0;this.stageThreeSlowAttempts=0;this.stageThreeSlowCaught=false;this.stageThreeSlowTime=0;this.stageThreeRecoverTime=0;this.stageThreeRecoverDuration=.7;this.stageThreeSlowSpeed=390;this.stageThreeGatherEffects=[];this.stageThreeCollectEffects=[];
        this.seedDrop=null;this.seedProjectiles=[];this.seedVolleyQueue=0;this.seedVolleyClock=0;this.seedVolleyInterval=.055;this.seedVolleyClears=0;this.seedVolleyClearLimit=3;this.seedVolleyActive=false;this.seedBursts=[];this.seedClock=0;this.seedNextAt=7;this.seedSpawnCount=0;this.seedMisses=0;this.seedHeld=false;this.seedUses=0;this.seedLimit=LEVEL_SEED_LIMITS[this.level]||2;this.seedDropLimit=this.seedLimit;this.seedCooldown=0;
        this.stageFiveDrop=null;this.stageFiveDropClock=0;this.stageFiveNextAt=10+Math.random()*5;this.stageFiveDropCount=0;
        this.stageFiveSlowTime=0;this.stageFiveRecoverTime=0;this.stageFiveRecoverDuration=.8;this.stageFiveSlowSpeed=440;
        this.stageFiveCollectEffects=[];this.stageFiveClearPaths=[];
        this.stageFiveBuffDrops=[];this.stageFiveBuffCollectEffects=[];this.stageFiveBuffCollected=0;
        this.stageSixDrops=[];this.stageSixDestroyed=0;this.stageSixLifeIssued=false;this.stageSixLifeThreshold=21;
        this.stageSixMultiTime=0;this.stageSixMultiDuration=10;this.stageSixSplitEffects=[];this.stageSixDissolveEffects=[];this.stageSixCollectEffects=[];
        this.seenItemHints={};this.itemHints=[];this.itemResultEffects=[];this.itemWhisperKey='';
        this.padFeedback={active:false,age:0,duration:.2,offset:0,contactX:0,contactY:0};
        this.ballFeedback={active:false,age:0,duration:.09,axis:'y',strength:.16,type:'catch'};
        this.root.classList.remove('bb-vitality-fast');
        // Keep every stage's brick field inside the upper two-fifths of the board.
        // Layout coordinates below remain the authored source shapes; only their
        // presentation is compacted here so all six stages retain the same design.
        var sourceBw=82,bw=68,bh=18,brickTop=48,brickYScale=.56,brickXScale=.88,boardCenterX=480;
        var shellLayout={
            growth:[[446,82],[416,116],[536,126],[316,130],[531,158],[347,164],[439,202],[439,244]],
            leftShell:[[164,202],[250,198],[336,201],[92,235],[184,241],[276,233],[70,278],[162,280],[254,281],[346,273],[101,319],[193,327],[285,316],[377,324],[174,363],[266,360],[358,368]],
            rightShell:[[622,190],[704,184],[806,190],[646,223],[730,232],[814,234],[554,268],[646,260],[730,270],[814,270],[566,306],[658,315],[750,312],[550,352],[642,354],[726,356]],
            fragments:[[144,402],[242,438],[350,405],[542,421],[660,394],[758,422],[814,372]]
        };
        var swayLayout={
            fixed:[[439,70],[405,108],[503,112],[413,148],[321,150],[505,152],[597,154],[369,190],[505,192],[413,230],[505,232],[553,268],[369,270],[461,272],[413,310],[505,312],[553,348],[369,350],[461,352],[461,392]],
            left:[[131,178],[223,178],[82,218],[174,218],[266,218],[86,258],[178,258],[270,258],[82,298],[174,298],[266,298],[146,338],[238,338],[206,378]],
            right:[[704,174],[796,174],[610,216],[702,216],[794,216],[652,256],[744,256],[836,256],[652,296],[744,296],[836,296],[652,336],[744,336],[710,374]]
        };
        var doubleShellLayout={
            crown:[[439,70],[393,106],[485,108],[347,144],[439,146],[531,144],[393,184],[485,184],[439,222],[393,260],[485,260],[439,298],[397,338],[481,338]],
            leftSprout:[[165,150],[257,152],[137,188],[223,190],[309,188],[93,228],[185,230],[277,228],[117,268],[209,270],[301,268],[151,308],[243,310],[335,308],[193,348],[285,350],[239,390]],
            rightSprout:[[615,154],[707,152],[569,192],[655,194],[741,190],[601,232],[693,230],[785,234],[577,272],[669,274],[761,270],[565,312],[657,310],[749,314],[593,352],[685,350],[639,392]],
            roots:[[142,392],[326,390],[418,390],[510,390],[731,392],[206,430],[452,432],[698,430]]
        };
        var eggyLayout={
            crown:[[395,60],[483,60],[351,96],[439,96],[527,96]],
            head:[[307,132],[395,132],[483,132],[571,132],[263,168],[351,168],[439,168],[527,168],[615,168]],
            arms:[[219,204],[307,204],[395,204],[483,204],[571,204],[659,204],[131,240],[219,240],[307,240],[395,240],[483,240],[571,240],[659,240],[747,240]],
            body:[[219,276],[307,276],[395,276],[483,276],[571,276],[659,276],[263,312],[351,312],[439,312],[527,312],[615,312],[351,348],[439,348],[527,348],[395,384],[483,384]],
            feet:[[263,430],[351,430],[527,430],[615,430]]
        };
        var budStarLayout={
            fixed:[[351,72],[439,72],[527,72],[307,108],[395,108],[483,108],[571,108],[351,144],[439,144],[527,144],[307,180],[395,180],[483,180],[571,180],[351,216],[527,216],[307,252],[571,252],[307,288],[571,288],[351,324],[527,324],[307,360],[395,360],[483,360],[571,360],[351,396],[439,396],[527,396],[263,432],[351,432],[439,432],[527,432],[615,432],[351,468],[527,468]],
            left:[[119,144],[207,144],[75,180],[163,180],[75,216],[163,216],[119,252],[207,252]],
            right:[[671,144],[759,144],[715,180],[803,180],[715,216],[803,216],[671,252],[759,252]]
        };
        var gatheredBudLayout={
            crown:[[303,60],[393,60],[487,60],[575,64],[259,98],[349,96],[531,98],[619,102]],
            upper:[[173,135],[263,132],[353,136],[529,132],[619,136],[709,134],[127,171],[217,168],[307,172],[397,168],[487,172],[577,168],[667,172],[757,170]],
            wings:[[83,207],[173,204],[263,208],[353,204],[529,208],[619,204],[709,208],[799,205],[129,244],[219,240],[309,244],[399,240],[489,244],[579,240],[669,244],[759,242]],
            heart:[[175,280],[265,276],[355,280],[531,276],[621,280],[711,278],[219,316],[309,312],[399,316],[489,312],[579,316],[669,314]],
            lower:[[263,352],[353,348],[443,352],[533,348],[623,352],[219,388],[309,384],[399,388],[489,384],[579,388],[669,386],[307,424],[443,428],[579,424]]
        };
        var reinforcedCells={
            '393,106':true,'485,108':true,'347,144':true,'531,144':true,'393,260':true,'485,260':true,
            '223,190':true,'209,270':true,'243,310':true,'655,194':true,'669,274':true,'657,310':true
        };
        var stageFiveReinforcedCells={'395,108':true,'483,108':true,'307,180':true,'571,180':true,'307,288':true,'571,288':true,'351,432':true,'527,432':true};
        var stageFiveTripleCells={'395,108':true,'483,108':true,'351,432':true,'527,432':true};
        var stageSixReinforcedCells={'263,132':true,'619,136':true,'173,204':true,'709,208':true,'309,244':true,'669,244':true,'263,352':true,'623,352':true};
        var stageSixTripleCells={'399,316':true,'489,312':true};
        var cells=[];
        function addCells(list,motionGroup){for(var ci=0;ci<list.length;ci++)cells.push({x:list[ci][0],y:list[ci][1],motionGroup:motionGroup});}
        if(this.level===2){addCells(swayLayout.fixed,'fixed');addCells(swayLayout.left,'left');addCells(swayLayout.right,'right');}
        else if(this.level===3){addCells(doubleShellLayout.crown,'fixed');addCells(doubleShellLayout.leftSprout,'fixed');addCells(doubleShellLayout.rightSprout,'fixed');addCells(doubleShellLayout.roots,'fixed');}
        else if(this.level===4){addCells(eggyLayout.crown,'fixed');addCells(eggyLayout.head,'fixed');addCells(eggyLayout.arms,'fixed');addCells(eggyLayout.body,'fixed');addCells(eggyLayout.feet,'fixed');}
        else if(this.level===5){addCells(budStarLayout.fixed,'fixed');addCells(budStarLayout.left,'left');addCells(budStarLayout.right,'right');}
        else if(this.level===6){addCells(gatheredBudLayout.crown,'fixed');addCells(gatheredBudLayout.upper,'fixed');addCells(gatheredBudLayout.wings,'fixed');addCells(gatheredBudLayout.heart,'fixed');addCells(gatheredBudLayout.lower,'fixed');}
        else{addCells(shellLayout.growth,'fixed');addCells(shellLayout.leftShell,'fixed');addCells(shellLayout.rightShell,'fixed');addCells(shellLayout.fragments,'fixed');}
        cells.sort(function(a,b){return a.y-b.y||a.x-b.x;});
        var paletteCounts=this.level===3?[10,9,9,9,10,9]:(this.level===5?[9,9,9,9,8,8]:(this.level===6?[8,10,12,12,12,10]:[9,8,8,8,8,7])),paletteRow=0,rowEnd=paletteCounts[0],colors=this.stagePalette;
        for(var cellIndex=0;cellIndex<cells.length;cellIndex++){
            while(cellIndex>=rowEnd&&paletteRow<paletteCounts.length-1){paletteRow++;rowEnd+=paletteCounts[paletteRow];}
            var cell=cells[cellIndex],key=cell.x+','+cell.y,stageFiveTriple=this.level===5&&stageFiveTripleCells[key]===true,stageSixTriple=this.level===6&&stageSixTripleCells[key]===true,triple=stageFiveTriple||stageSixTriple;
            var reinforced=triple||(this.level===3&&reinforcedCells[key]===true)||(this.level===5&&stageFiveReinforcedCells[key]===true)||(this.level===6&&stageSixReinforcedCells[key]===true),maxHits=triple?3:(reinforced?2:1);
            var sourceCenterX=cell.x+sourceBw*.5;
            var brickX=boardCenterX+(sourceCenterX-boardCenterX)*brickXScale-bw*.5,brickY=brickTop+(cell.y-60)*brickYScale;
            this.bricks.push({x:brickX,y:brickY,baseX:brickX,baseY:brickY,motionGroup:cell.motionGroup,w:bw,h:bh,row:paletteRow,col:cellIndex%9,color:colors[paletteRow],alive:true,reinforced:reinforced,buffCarrier:stageFiveTriple,multiCarrier:stageSixTriple,buffDropped:false,maxHits:maxHits,hitsRemaining:maxHits,hitCooldown:0,shellPulseAge:-1,shellPulseDuration:.2,shellImpactX:0,shellImpactY:0});this.remaining++;
        }
        if(this.level===2||this.level===5)this.updateBrickMotion(0);
        this.updateHud();
    };

    Game.prototype.updateBrickMotion=function(dt){
        if(this.level!==2&&this.level!==5)return;
        this.brickMotionTime+=Math.max(0,dt||0);
        var travel=1.8,hold=.3,cycle=travel*2+hold*2,cycleTime=this.brickMotionTime%cycle;
        var offset=-16,direction=0,progress,eased;
        if(cycleTime<travel){
            progress=cycleTime/travel;eased=progress*progress*(3-2*progress);
            offset=-16+32*eased;direction=Math.sin(progress*Math.PI);
        }else if(cycleTime<travel+hold){
            offset=16;
        }else if(cycleTime<travel*2+hold){
            progress=(cycleTime-travel-hold)/travel;eased=progress*progress*(3-2*progress);
            offset=16-32*eased;direction=-Math.sin(progress*Math.PI);
        }
        this.brickMotionDirection=direction;
        for(var i=0;i<this.bricks.length;i++){
            var brick=this.bricks[i];
            brick.x=brick.baseX+(brick.motionGroup==='left'?offset:(brick.motionGroup==='right'?-offset:0));
            brick.y=brick.baseY;
        }
    };

    Game.prototype.spawnHazard=function(){
        if(this.level!==2||this.hazard||this.hazardDisabled)return false;
        var requested=this.hazardNextGroup,candidates=this.bricks.filter(function(brick){return brick.alive&&brick.motionGroup===requested;});
        if(!candidates.length){requested=requested==='left'?'right':'left';candidates=this.bricks.filter(function(brick){return brick.alive&&brick.motionGroup===requested;});}
        if(!candidates.length){this.hazardDisabled=true;return false;}
        candidates.sort(function(a,b){return a.x-b.x||a.y-b.y;});
        var source=candidates[this.hazardSpawnCount%candidates.length];
        this.hazardSpawnCount++;this.hazardNextGroup=requested==='left'?'right':'left';this.hazardNextAt=this.hazardClock+9;
        this.hazard={state:'warning',source:source,x:source.x+source.w*.5,y:source.y+source.h+16,w:28,h:38,age:0,warningDuration:.5,speed:160,hitDuration:.16};this.showItemHint('hazard',this.hazard);
        return true;
    };

    Game.prototype.hazardCharacterRect=function(){
        return {x:this.paddle.x-34,y:this.paddle.y-10,w:68,h:58};
    };

    Game.prototype.hitHazard=function(){
        var hazard=this.hazard;if(!hazard||hazard.state!=='falling')return;
        hazard.state='hit';hazard.age=0;hazard.source=null;
        this.misses++;this.lives=Math.max(0,this.lives-1);this.updateHud();
        this.showItemResult('hazard',hazard.x,hazard.y-22);
        if(this.characterView&&this.characterView.react)this.characterView.react('miss');
        if(this.options.onEvent)this.options.onEvent('hazardHit',{lives:this.lives});
        if(this.lives<=0)this.finishRound(false);
    };

    Game.prototype.updateHazard=function(dt){
        if(this.level!==2||this.state!=='playing')return;
        this.hazardClock+=Math.max(0,dt||0);
        if(!this.hazard){if(!this.hazardDisabled&&this.hazardClock>=this.hazardNextAt)this.spawnHazard();return;}
        var hazard=this.hazard;
        if(hazard.state==='warning'){
            if(hazard.source&&hazard.source.alive){hazard.x=hazard.source.x+hazard.source.w*.5;hazard.y=hazard.source.y+hazard.source.h+16;}
            hazard.age+=dt;
            if(hazard.age>=hazard.warningDuration){
                var overflow=hazard.age-hazard.warningDuration;hazard.state='falling';hazard.source=null;hazard.age=overflow;hazard.y+=hazard.speed*overflow;
            }
            return;
        }
        if(hazard.state==='hit'){
            hazard.age+=dt;if(hazard.age>=hazard.hitDuration)this.hazard=null;return;
        }
        hazard.age+=dt;hazard.y+=hazard.speed*dt;
        var body=this.hazardCharacterRect(),left=hazard.x-hazard.w*.5,top=hazard.y-hazard.h*.5;
        if(left<body.x+body.w&&left+hazard.w>body.x&&top<body.y+body.h&&top+hazard.h>body.y){this.hitHazard();return;}
        if(top>H+12)this.hazard=null;
    };

    Game.prototype.activateVitalityShell=function(drop,source){
        this.lives++;
        this.vitalitySpeedActive=true;this.paddle.speed=this.paddle.fastSpeed;this.root.classList.add('bb-vitality-fast');
        this.showItemResult('life',drop&&drop.x,this.paddle.y-54);this.playSoftCollision('catch');this.updateHud();
        if(this.characterView&&this.characterView.react)this.characterView.react('catch',clamp((((drop&&drop.x)||this.paddle.x)-this.paddle.x)/(this.paddle.w*.5),-1,1));
        if(this.options.onEvent)this.options.onEvent('vitalityShell',{source:source||'stage',lives:this.lives,paddleSpeed:this.paddle.speed});
        return true;
    };

    Game.prototype.spawnEarlyLife=function(brick){
        if((this.level!==2&&this.level!==3)||!brick||this.earlyLifeDrop||this.earlyLifeIssued)return false;
        this.earlyLifeIssued=true;this.earlyLifeDrop={type:'life',x:brick.x+brick.w*.5,y:brick.y+brick.h*.5,r:14,speed:114,age:0,sourceX:brick.x+brick.w*.5,sourceY:brick.y+brick.h*.5};
        this.showItemHint('life',this.earlyLifeDrop);return true;
    };

    Game.prototype.stageEarlyBrickCleared=function(brick){
        if((this.level!==2&&this.level!==3)||!brick)return;
        this.earlyLifeDestroyed++;
        if(!this.earlyLifeIssued&&this.earlyLifeDestroyed>=this.earlyLifeThreshold&&brick.maxHits===1)this.spawnEarlyLife(brick);
    };

    Game.prototype.updateEarlyLife=function(dt){
        if((this.level!==2&&this.level!==3)||this.state!=='playing'||!this.earlyLifeDrop)return;
        var drop=this.earlyLifeDrop;drop.age+=dt;drop.y+=drop.speed*dt;
        if(this.rules.circleRectHit(drop.x,drop.y,drop.r,this.stageFiveCatchRect())){
            this.earlyLifeDrop=null;this.activateVitalityShell(drop,'stage'+this.level);return;
        }
        if(drop.y-drop.r>H+12)this.earlyLifeDrop=null;
    };

    Game.prototype.spawnStageThreeSlow=function(brick){
        if(this.level!==3||!brick||this.stageThreeSlowDrop||this.stageThreeSlowCaught||this.stageThreeSlowAttempts>=2)return false;
        this.stageThreeSlowAttempts++;
        this.stageThreeSlowDrop={type:'slow',x:brick.x+brick.w*.5,y:brick.y+brick.h*.5,r:14,speed:112,age:0,sourceX:brick.x+brick.w*.5,sourceY:brick.y+brick.h*.5};
        this.stageThreeGatherEffects.push({x:brick.x+brick.w*.5,y:brick.y+brick.h*.5,age:0,duration:.3});this.showItemHint('slow',this.stageThreeSlowDrop);return true;
    };

    Game.prototype.stageThreeBrickCleared=function(brick){
        if(this.level!==3||!brick||brick.maxHits!==2)return;
        this.stageThreeReinforcedCleared++;
        var threshold=this.stageThreeSlowAttempts===0?4:8;
        if(!this.stageThreeSlowCaught&&!this.stageThreeSlowDrop&&this.stageThreeSlowAttempts<2&&this.stageThreeReinforcedCleared>=threshold)this.spawnStageThreeSlow(brick);
    };

    Game.prototype.collectStageThreeSlow=function(drop){
        if(!drop||this.level!==3)return false;
        this.stageThreeSlowDrop=null;this.stageThreeSlowCaught=true;this.stageThreeSlowTime=6;this.stageThreeRecoverTime=0;this.setBallSpeed(this.stageThreeSlowSpeed);
        this.stageThreeCollectEffects.push({x:drop.x,y:this.paddle.y-20,age:0,duration:.72});this.showItemResult('slow',drop.x,this.paddle.y-54);this.playSoftCollision('catch');this.updateHud();
        if(this.characterView&&this.characterView.react)this.characterView.react('catch',clamp((drop.x-this.paddle.x)/(this.paddle.w*.5),-1,1));
        if(this.options.onEvent)this.options.onEvent('stageThreeSlow',{speed:this.ball.speed,duration:6,reinforcedCleared:this.stageThreeReinforcedCleared});return true;
    };

    Game.prototype.updateStageThreeSlow=function(dt){
        if(this.level!==3||this.state!=='playing')return;
        if(this.stageThreeSlowTime>0){
            this.stageThreeSlowTime=Math.max(0,this.stageThreeSlowTime-dt);if(this.stageThreeSlowTime===0)this.stageThreeRecoverTime=this.stageThreeRecoverDuration;
        }else if(this.stageThreeRecoverTime>0){
            this.stageThreeRecoverTime=Math.max(0,this.stageThreeRecoverTime-dt);
            var progress=1-this.stageThreeRecoverTime/this.stageThreeRecoverDuration,eased=progress*progress*(3-2*progress);
            this.setBallSpeed(this.stageThreeSlowSpeed+(LEVEL_BALL_SPEEDS[3]-this.stageThreeSlowSpeed)*eased);if(this.stageThreeRecoverTime===0)this.setBallSpeed(LEVEL_BALL_SPEEDS[3]);
        }
        if(this.stageThreeSlowDrop){
            var drop=this.stageThreeSlowDrop;drop.age+=dt;drop.y+=drop.speed*dt;var catchRect=this.stageFiveCatchRect();
            if(this.rules.circleRectHit(drop.x,drop.y,drop.r,catchRect))this.collectStageThreeSlow(drop);
            else if(drop.y-drop.r>H+12)this.stageThreeSlowDrop=null;
        }
        for(var gatherIndex=this.stageThreeGatherEffects.length-1;gatherIndex>=0;gatherIndex--){this.stageThreeGatherEffects[gatherIndex].age+=dt;if(this.stageThreeGatherEffects[gatherIndex].age>=this.stageThreeGatherEffects[gatherIndex].duration)this.stageThreeGatherEffects.splice(gatherIndex,1);}
        for(var collectIndex=this.stageThreeCollectEffects.length-1;collectIndex>=0;collectIndex--){this.stageThreeCollectEffects[collectIndex].age+=dt;if(this.stageThreeCollectEffects[collectIndex].age>=this.stageThreeCollectEffects[collectIndex].duration)this.stageThreeCollectEffects.splice(collectIndex,1);}
    };

    Game.prototype.seedCatchRect=function(){
        return {x:this.paddle.x-48,y:this.paddle.y-42,w:96,h:54};
    };

    Game.prototype.spawnSeedDrop=function(){
        if(this.seedDrop||this.seedHeld||this.seedUses>=this.seedLimit||this.seedSpawnCount>=this.seedDropLimit)return false;
        var lanes=[216,704,348,612,480,282,678,414,546],x=lanes[this.seedSpawnCount%lanes.length];
        this.seedSpawnCount++;this.seedDrop={x:x,y:52,r:11,speed:108,age:0};this.showItemHint('seed',this.seedDrop);
        return true;
    };

    Game.prototype.launchSeedAttack=function(){
        if(this.state!=='playing'||!this.seedHeld||this.seedUses>=this.seedLimit||this.seedCooldown>0||this.seedVolleyActive)return false;
        this.seedHeld=false;this.seedUses++;this.seedCooldown=.42;
        this.seedVolleyActive=true;this.seedVolleyQueue=7;this.seedVolleyClock=0;this.seedVolleyClears=0;this.seedProjectiles=[];this.spawnSeedPetal();
        this.playEggshellPowerAudio();
        this.seedNextAt=this.seedClock+7;this.updateHud();
        if(this.characterView&&this.characterView.react)this.characterView.react('catch',0);
        return true;
    };

    Game.prototype.spawnSeedPetal=function(){
        if(!this.seedVolleyActive||this.seedVolleyQueue<=0)return false;
        var index=7-this.seedVolleyQueue,offsets=[0,-8,8,-15,15,-22,22],sideVx=[0,-18,18,-32,32,-46,46];
        this.seedProjectiles.push({x:this.paddle.x+offsets[index],y:this.paddle.y-46-Math.abs(offsets[index])*.08,vx:sideVx[index],vy:-480,r:5.8,age:0,petal:index});
        this.seedVolleyQueue--;this.seedVolleyClock=this.seedVolleyInterval;return true;
    };

    Game.prototype.addSeedBrickFeedback=function(brick,impactX,impactY){
        var baseAngle=Math.PI*.5;
        this.hitEffects.push({
            x:brick.x,y:brick.y,w:brick.w,h:brick.h,row:brick.row,col:brick.col,color:brick.color,sparkColor:this.theme.spark,age:0,duration:.22,
            impactX:impactX,impactY:impactY,axis:'y',normalX:0,normalY:1,
            sparks:[
                {angle:baseAngle-.5,speed:31,radius:2.7,color:brick.color},
                {angle:baseAngle,speed:38,radius:2.3,color:this.theme.spark},
                {angle:baseAngle+.5,speed:34,radius:2.5,color:brick.color}
            ]
        });
        this.seedBursts.push({x:impactX,y:impactY,age:0,duration:.28});this.playSoftCollision('brick');
    };

    Game.prototype.updateSeedSystem=function(dt){
        if(this.state!=='playing')return;
        this.seedClock+=Math.max(0,dt||0);this.seedCooldown=Math.max(0,this.seedCooldown-dt);
        if(!this.seedDrop&&!this.seedHeld&&!this.seedVolleyActive&&this.seedUses<this.seedLimit&&this.seedSpawnCount<this.seedDropLimit&&this.seedClock>=this.seedNextAt)this.spawnSeedDrop();
        if(this.seedDrop){
            var drop=this.seedDrop;drop.age+=dt;drop.y+=drop.speed*dt;
            var catchRect=this.seedCatchRect(),dropLeft=drop.x-drop.r,dropTop=drop.y-drop.r;
            if(dropLeft<catchRect.x+catchRect.w&&dropLeft+drop.r*2>catchRect.x&&dropTop<catchRect.y+catchRect.h&&dropTop+drop.r*2>catchRect.y){
                this.seedHeld=true;this.seedDrop=null;this.updateHud();this.showItemResult('seed',drop.x,this.paddle.y-45);this.playSoftCollision('catch');
                if(this.characterView&&this.characterView.react)this.characterView.react('catch',0);
            }else if(dropTop>H+12){this.seedDrop=null;this.seedMisses++;this.seedNextAt=this.seedClock+7;this.updateHud();}
        }
        if(!this.seedVolleyActive)return;
        if(this.seedVolleyQueue>0){this.seedVolleyClock-=dt;while(this.seedVolleyQueue>0&&this.seedVolleyClock<=0){this.spawnSeedPetal();}}
        for(var projectileIndex=this.seedProjectiles.length-1;projectileIndex>=0;projectileIndex--){
            var projectile=this.seedProjectiles[projectileIndex];projectile.age+=dt;projectile.x+=projectile.vx*dt;projectile.y+=projectile.vy*dt;
            var consumed=false;
            for(var i=0;i<this.bricks.length;i++){
                var brick=this.bricks[i];if(!brick.alive||!this.rules.circleRectHit(projectile.x,projectile.y,projectile.r,brick))continue;
                this.addSeedBrickFeedback(brick,projectile.x,clamp(projectile.y,brick.y,brick.y+brick.h));
                brick.hitsRemaining=0;brick.alive=false;this.remaining--;this.score+=this.rules.scoreForBrick(brick.row);this.seedVolleyClears++;consumed=true;
                if(brick.buffCarrier&&!brick.buffDropped)this.spawnStageFiveBuffDrop(brick);
                if(this.level===2||this.level===3)this.stageEarlyBrickCleared(brick);
                if(this.level===3)this.stageThreeBrickCleared(brick);
                if(this.level===6)this.stageSixBrickCleared(brick);
                this.updateHud();
                if(this.rules.isWin(this.remaining)){this.finishRound(true);return;}
                if(this.seedVolleyClears>=this.seedVolleyClearLimit){
                    for(var fadeIndex=0;fadeIndex<this.seedProjectiles.length;fadeIndex++){var fading=this.seedProjectiles[fadeIndex];this.seedBursts.push({x:fading.x,y:fading.y,age:0,duration:.2});}
                    this.seedProjectiles=[];this.seedVolleyQueue=0;this.seedVolleyActive=false;return;
                }
                break;
            }
            if(consumed||projectile.y+projectile.r<20||projectile.x+projectile.r<20||projectile.x-projectile.r>W-20)this.seedProjectiles.splice(projectileIndex,1);
        }
        if(this.seedVolleyQueue===0&&!this.seedProjectiles.length)this.seedVolleyActive=false;
    };

    Game.prototype.setBallSpeed=function(speed){
        var b=this.ball,length=Math.hypot(b.vx,b.vy);b.speed=Math.max(1,Number(speed)||1);
        if(length>0){b.vx=b.vx/length*b.speed;b.vy=b.vy/length*b.speed;}
    };

    Game.prototype.stageFiveCatchRect=function(){
        return {x:this.paddle.x-this.paddle.w*.5,y:this.paddle.y-this.paddle.h*.5,w:this.paddle.w,h:this.paddle.h};
    };

    Game.prototype.spawnStageFiveDrop=function(){
        if(this.level!==5||this.stageFiveDrop)return false;
        var candidates=this.bricks.filter(function(brick){return brick.alive;});if(!candidates.length)return false;
        var source=candidates[Math.floor(Math.random()*candidates.length)],roll=Math.random(),type=roll<.28?'life':(roll<.68?'slow':'clear');
        this.stageFiveDropCount++;this.stageFiveDrop={type:type,x:source.x+source.w*.5,y:source.y+source.h+15,r:14,speed:118,age:0,sourceX:source.x+source.w*.5,sourceY:source.y+source.h*.5};this.showItemHint(type,this.stageFiveDrop);
        return true;
    };

    Game.prototype.spawnStageFiveBuffDrop=function(brick){
        if(this.level!==5||!brick||!brick.buffCarrier||brick.buffDropped)return false;
        brick.buffDropped=true;
        var drop={x:brick.x+brick.w*.5,y:brick.y+brick.h*.5,r:13,speed:112,age:0,sourceX:brick.x+brick.w*.5,sourceY:brick.y+brick.h*.5};this.stageFiveBuffDrops.push(drop);this.showItemHint('buff',drop);
        return true;
    };

    Game.prototype.collectStageFiveBuffDrop=function(drop,index){
        if(!drop)return false;
        if(index===undefined)index=this.stageFiveBuffDrops.indexOf(drop);
        if(index>=0)this.stageFiveBuffDrops.splice(index,1);
        this.stageFiveBuffCollected++;
        this.stageFiveBuffCollectEffects.push({x:drop.x,y:this.paddle.y-22,age:0,duration:.82});
        this.showItemResult('buff',drop.x,this.paddle.y-54);
        this.playSoftCollision('catch');
        if(this.characterView&&this.characterView.react)this.characterView.react('catch',clamp((drop.x-this.paddle.x)/(this.paddle.w*.5),-1,1));
        if(this.options.onEvent)this.options.onEvent('stageFiveBuffCollected',{item:'softglowBudCore',name:this.stageFiveText.buff,collected:this.stageFiveBuffCollected});
        return true;
    };

    Game.prototype.updateStageFiveBuffDrops=function(dt){
        if(this.level!==5||this.state!=='playing')return;
        var catchRect=this.stageFiveCatchRect();
        for(var dropIndex=this.stageFiveBuffDrops.length-1;dropIndex>=0;dropIndex--){
            var drop=this.stageFiveBuffDrops[dropIndex];drop.age+=dt;drop.y+=drop.speed*dt;
            if(this.rules.circleRectHit(drop.x,drop.y,drop.r,catchRect)){this.collectStageFiveBuffDrop(drop,dropIndex);continue;}
            if(drop.y-drop.r>H+12)this.stageFiveBuffDrops.splice(dropIndex,1);
        }
    };

    Game.prototype.clearStageFiveBricks=function(originX){
        var alive=this.bricks.filter(function(brick){return brick.alive;}),snapshot=alive.slice();
        function neighbors(brick){
            var cx=brick.x+brick.w*.5,cy=brick.y+brick.h*.5,count=0;
            for(var i=0;i<snapshot.length;i++){var other=snapshot[i];if(other===brick)continue;var ox=other.x+other.w*.5,oy=other.y+other.h*.5;if(Math.abs(ox-cx)<=100&&Math.abs(oy-cy)<=45)count++;}
            return count;
        }
        alive.sort(function(a,b){
            var scoreA=(a.buffCarrier?10000:0)+neighbors(a)*100+(a.reinforced?-38:0)+Math.abs(a.x+a.w*.5-originX)*.02;
            var scoreB=(b.buffCarrier?10000:0)+neighbors(b)*100+(b.reinforced?-38:0)+Math.abs(b.x+b.w*.5-originX)*.02;
            return scoreA-scoreB||a.y-b.y||a.x-b.x;
        });
        var targets=alive.slice(0,5),points=[];
        for(var targetIndex=0;targetIndex<targets.length;targetIndex++){
            var brick=targets[targetIndex],impactX=brick.x+brick.w*.5,impactY=brick.y+brick.h*.5,baseAngle=Math.PI*.5;
            this.hitEffects.push({
                x:brick.x,y:brick.y,w:brick.w,h:brick.h,row:brick.row,col:brick.col,color:brick.color,sparkColor:this.theme.spark,age:0,duration:.24,
                impactX:impactX,impactY:impactY,axis:'y',normalX:0,normalY:1,
                sparks:[{angle:baseAngle-.52,speed:34,radius:2.7,color:brick.color},{angle:baseAngle,speed:42,radius:2.4,color:this.theme.spark},{angle:baseAngle+.52,speed:36,radius:2.6,color:brick.color}]
            });
            brick.hitsRemaining=0;brick.alive=false;if(brick.buffCarrier)brick.buffDropped=true;this.remaining--;this.score+=this.rules.scoreForBrick(brick.row);points.push({x:impactX,y:impactY});
        }
        if(points.length){this.stageFiveClearPaths.push({x:originX,y:this.paddle.y-18,points:points,age:0,duration:.48});this.playSoftCollision('brick');}
        this.updateHud();
        if(this.rules.isWin(this.remaining))this.finishRound(true);
        return targets.length;
    };

    Game.prototype.collectStageFiveDrop=function(drop){
        if(!drop)return false;
        if(drop.type==='life')this.activateVitalityShell(drop,'stage5');
        else if(drop.type==='slow'){
            this.stageFiveSlowTime=8;this.stageFiveRecoverTime=0;this.setBallSpeed(this.stageFiveSlowSpeed);
        }else if(drop.type==='clear')this.clearStageFiveBricks(drop.x);
        this.stageFiveCollectEffects.push({type:drop.type,x:drop.x,y:this.paddle.y-20,age:0,duration:.72});
        if(drop.type!=='life')this.showItemResult(drop.type,drop.x,this.paddle.y-54);
        this.stageFiveDrop=null;this.stageFiveNextAt=this.stageFiveDropClock+10+Math.random()*5;this.updateHud();
        if(drop.type!=='life'){this.playSoftCollision('catch');if(this.characterView&&this.characterView.react)this.characterView.react('catch',clamp((drop.x-this.paddle.x)/(this.paddle.w*.5),-1,1));}
        if(this.options.onEvent)this.options.onEvent('stageFiveItem',{type:drop.type,lives:this.lives,speed:this.ball.speed,remaining:this.remaining});
        return true;
    };

    Game.prototype.updateStageFiveItems=function(dt){
        if(this.level!==5||this.state!=='playing')return;
        this.stageFiveDropClock+=Math.max(0,dt||0);
        if(this.stageFiveSlowTime>0){
            this.stageFiveSlowTime=Math.max(0,this.stageFiveSlowTime-dt);
            if(this.stageFiveSlowTime===0)this.stageFiveRecoverTime=this.stageFiveRecoverDuration;
        }else if(this.stageFiveRecoverTime>0){
            this.stageFiveRecoverTime=Math.max(0,this.stageFiveRecoverTime-dt);
            var progress=1-this.stageFiveRecoverTime/this.stageFiveRecoverDuration,eased=progress*progress*(3-2*progress);
            this.setBallSpeed(this.stageFiveSlowSpeed+(LEVEL_BALL_SPEEDS[5]-this.stageFiveSlowSpeed)*eased);
            if(this.stageFiveRecoverTime===0)this.setBallSpeed(LEVEL_BALL_SPEEDS[5]);
        }
        if(!this.stageFiveDrop){if(this.stageFiveDropClock>=this.stageFiveNextAt)this.spawnStageFiveDrop();return;}
        var drop=this.stageFiveDrop;drop.age+=dt;drop.y+=drop.speed*dt;
        var catchRect=this.stageFiveCatchRect();
        if(this.rules.circleRectHit(drop.x,drop.y,drop.r,catchRect)){this.collectStageFiveDrop(drop);return;}
        if(drop.y-drop.r>H+12){this.stageFiveDrop=null;this.stageFiveNextAt=this.stageFiveDropClock+10+Math.random()*5;}
    };

    Game.prototype.spawnStageSixDrop=function(type,brick){
        if(this.level!==6||!brick||(type!=='life'&&type!=='multi'))return false;
        if(type==='multi'){if(!brick.multiCarrier||brick.buffDropped)return false;brick.buffDropped=true;}
        var drop={type:type,x:brick.x+brick.w*.5,y:brick.y+brick.h*.5,r:type==='life'?14:13,speed:type==='life'?116:110,age:0,sourceX:brick.x+brick.w*.5,sourceY:brick.y+brick.h*.5};
        this.stageSixDrops.push(drop);this.showItemHint(type,drop);return true;
    };

    Game.prototype.stageSixBrickCleared=function(brick){
        if(this.level!==6||!brick)return;
        this.stageSixDestroyed++;
        if(!this.stageSixLifeIssued&&this.stageSixDestroyed>=this.stageSixLifeThreshold&&!brick.multiCarrier){this.stageSixLifeIssued=true;this.spawnStageSixDrop('life',brick);}
        if(brick.multiCarrier&&!brick.buffDropped)this.spawnStageSixDrop('multi',brick);
    };

    Game.prototype.activateStageSixMulti=function(originX,originY){
        if(this.level!==6||this.state!=='playing')return false;
        this.stageSixMultiTime=this.stageSixMultiDuration;
        if(!this.companionBalls.length){
            var b=this.ball,turn=(b.vx>=0?1:-1)*Math.PI/9,cos=Math.cos(turn),sin=Math.sin(turn),companion={
                x:clamp(b.x-b.vy/b.speed*8,26+b.r,W-26-b.r),y:clamp(b.y+b.vx/b.speed*8,28+b.r,H-b.r),
                vx:b.vx*cos-b.vy*sin,vy:b.vx*sin+b.vy*cos,r:b.r,speed:b.speed,companion:true,age:0
            };
            this.companionBalls.push(companion);
        }
        this.stageSixSplitEffects.push({x:this.ball.x,y:this.ball.y,age:0,duration:.34});
        this.showItemResult('multi',originX===undefined?this.paddle.x:originX,originY===undefined?this.paddle.y-54:originY);
        if(this.options.onEvent)this.options.onEvent('stageSixMulti',{activeBalls:1+this.companionBalls.length,duration:this.stageSixMultiDuration});
        return true;
    };

    Game.prototype.collectStageSixDrop=function(drop,index){
        if(!drop)return false;
        if(index===undefined)index=this.stageSixDrops.indexOf(drop);
        if(index>=0)this.stageSixDrops.splice(index,1);
        if(drop.type==='life'){
            this.activateVitalityShell(drop,'stage6');this.stageSixCollectEffects.push({type:'life',x:drop.x,y:this.paddle.y-20,age:0,duration:.72});
        }else{
            this.stageSixCollectEffects.push({type:'multi',x:drop.x,y:this.paddle.y-20,age:0,duration:.72});this.activateStageSixMulti(drop.x,this.paddle.y-54);
            this.playSoftCollision('catch');
            if(this.characterView&&this.characterView.react)this.characterView.react('catch',clamp((drop.x-this.paddle.x)/(this.paddle.w*.5),-1,1));
        }
        this.updateHud();
        if(this.options.onEvent)this.options.onEvent('stageSixItem',{type:drop.type,lives:this.lives,activeBalls:1+this.companionBalls.length,remaining:this.remaining});
        return true;
    };

    Game.prototype.updateStageSixItems=function(dt){
        if(this.level!==6||this.state!=='playing')return;
        if(this.companionBalls.length){
            this.stageSixMultiTime=Math.max(0,this.stageSixMultiTime-dt);
            for(var companionIndex=0;companionIndex<this.companionBalls.length;companionIndex++)this.companionBalls[companionIndex].age+=dt;
            if(this.stageSixMultiTime===0){
                for(var dissolveIndex=0;dissolveIndex<this.companionBalls.length;dissolveIndex++)this.stageSixDissolveEffects.push({x:this.companionBalls[dissolveIndex].x,y:this.companionBalls[dissolveIndex].y,age:0,duration:.36});
                this.companionBalls=[];
            }
        }else this.stageSixMultiTime=0;
        var catchRect=this.stageFiveCatchRect();
        for(var dropIndex=this.stageSixDrops.length-1;dropIndex>=0;dropIndex--){
            var drop=this.stageSixDrops[dropIndex];drop.age+=dt;drop.y+=drop.speed*dt;
            if(this.rules.circleRectHit(drop.x,drop.y,drop.r,catchRect)){this.collectStageSixDrop(drop,dropIndex);continue;}
            if(drop.y-drop.r>H+12)this.stageSixDrops.splice(dropIndex,1);
        }
        for(var splitIndex=this.stageSixSplitEffects.length-1;splitIndex>=0;splitIndex--){this.stageSixSplitEffects[splitIndex].age+=dt;if(this.stageSixSplitEffects[splitIndex].age>=this.stageSixSplitEffects[splitIndex].duration)this.stageSixSplitEffects.splice(splitIndex,1);}
        for(var fadeIndex=this.stageSixDissolveEffects.length-1;fadeIndex>=0;fadeIndex--){this.stageSixDissolveEffects[fadeIndex].age+=dt;if(this.stageSixDissolveEffects[fadeIndex].age>=this.stageSixDissolveEffects[fadeIndex].duration)this.stageSixDissolveEffects.splice(fadeIndex,1);}
        for(var collectIndex=this.stageSixCollectEffects.length-1;collectIndex>=0;collectIndex--){this.stageSixCollectEffects[collectIndex].age+=dt;if(this.stageSixCollectEffects[collectIndex].age>=this.stageSixCollectEffects[collectIndex].duration)this.stageSixCollectEffects.splice(collectIndex,1);}
    };

    Game.prototype.startGame=function(){
        this.clearIntroTimer();this.stopBgm(true);this.resetBoard();this.state='ready';this.root.classList.add('bb-playing');this.showReady();
        if(this.options.onEvent)this.options.onEvent('start',{score:0,lives:this.lives,level:this.level,name:this.stageName(this.level)});
    };
    Game.prototype.showReady=function(){var t=this.t;this.overlay.hidden=false;this.card.className='bb-card bb-ready-card';this.card.innerHTML='<p class="bb-kicker">'+esc(this.stageLabel(this.level)+' · '+this.stageName(this.level))+'</p><div class="bb-mini-ball">●</div><h2>'+esc(t.ready)+'</h2><p>'+esc(t.readyHint)+'</p>'+this.itemGuideHtml()+'<button class="bb-primary" data-action="launch">'+esc(t.launch)+'</button><p class="bb-note">'+esc(this.stageBasicCopy())+'</p>';this.setGameplayControlsFocusable(false);this.focusFirstAction();};
    Game.prototype.launch=function(){
        if(this.state!=='ready')return;
        this.ensureAudio();
        this.playBgm();
        this.serveId++;this.missHandled=false;
        var direction=(Math.floor(this.elapsed*10)%2?1:-1),launchVx=this.ball.speed*.42;
        this.ball.vx=direction*launchVx;this.ball.vy=-Math.sqrt(this.ball.speed*this.ball.speed-launchVx*launchVx);
        this.state='playing';this.overlay.hidden=true;this.clearMenuFocus();this.setGameplayControlsFocusable(true);
    };
    Game.prototype.togglePause=function(){
        if(this.state==='playing'){
            this.pauseBgm();this.state='paused';this.overlay.hidden=false;this.card.className='bb-card bb-pause-card';this.card.innerHTML='<h2>'+esc(this.t.paused)+'</h2><button class="bb-primary" data-action="resume">'+esc(this.t.resume)+'</button><button class="bb-secondary" data-action="restart">'+esc(this.t.restart)+'</button>';this.setGameplayControlsFocusable(false);this.focusFirstAction();
        }else if(this.state==='paused'){this.state='playing';this.playBgm();this.overlay.hidden=true;this.clearMenuFocus();this.setGameplayControlsFocusable(true);}
    };

    Game.prototype.finishRound=function(won){
        this.stopBgm(true);
        this.state=won?'won':'lost';
        this.playRoundResultAudio(won);
        if(won)this.unlockNextLevel();
        if(this.score>this.best){this.best=this.score;this.storage.set('bestScore',this.best);}
        this.updateHud();this.overlay.hidden=false;
        this.card.className='bb-card bb-result-card';
        var primary=won?(this.level<6?'<button class="bb-primary" data-action="next">'+esc(this.stageSelectText.next)+'</button>':'<button class="bb-primary" data-action="levels">'+esc(this.stageSelectText.back)+'</button>'):'<button class="bb-primary" data-action="start">'+esc(this.t.again)+'</button>';
        this.card.innerHTML='<div class="bb-result-icon">'+(won?'✦':'○')+'</div><p class="bb-kicker">'+esc(this.stageLabel(this.level)+' · '+this.stageName(this.level))+'</p><h2>'+esc(won?this.t.won:this.t.lost)+'</h2><p class="bb-result-score">'+esc(this.t.score)+' <b>'+this.score+'</b></p>'+primary+(won&&this.level===6?'':'<button class="bb-secondary" data-action="levels">'+esc(this.stageSelectText.back)+'</button>');
        this.setGameplayControlsFocusable(false);this.focusFirstAction();
        if(this.options.onResult)this.options.onResult({status:won?(this.level===6?'finished':'stage-cleared'):'failed',level:this.level,name:this.stageName(this.level),score:this.score,best:this.best,lives:this.lives,remaining:this.remaining,time:this.elapsed});
    };

    Game.prototype.loseBall=function(){
        if(this.state!=='playing'||this.missHandled||this.resolvedServeId===this.serveId)return;
        if(this.level===6){this.companionBalls=[];this.stageSixMultiTime=0;}
        if(this.characterView&&this.characterView.react)this.characterView.react('miss');
        this.missHandled=true;this.resolvedServeId=this.serveId;this.state='resolving';
        this.misses++;this.lives=Math.max(0,this.lives-1);this.updateHud();
        var b=this.ball,p=this.paddle;
        b.vx=b.vy=0;b.x=p.x;b.y=H+b.r+12;
        var self=this,gameOver=this.lives<=0;
        this.missTimer=setTimeout(function(){
            self.missTimer=0;if(!self.running||self.state!=='resolving')return;
            if(gameOver){self.finishRound(false);return;}
            b.x=p.x;b.y=p.y-b.r-7;self.state='ready';self.showReady();
        },420);
    };

    Game.prototype.keyDown=function(e){
        if(e.altKey||e.ctrlKey||e.metaKey)return;
        var code=e.code,activation=code==='Enter'||code==='Space',arrows=code==='ArrowLeft'||code==='ArrowRight'||code==='ArrowUp'||code==='ArrowDown';
        var handled=function(){e.preventDefault();e.stopPropagation();};
        if(this.state==='playing'){
            if(code==='ArrowLeft'||code==='KeyA'){handled();this.pointerActive=false;this.pointerX=null;this.pointerIsTouch=false;this.touchDragInput=0;this.keys.left=true;return;}
            if(code==='ArrowRight'||code==='KeyD'){handled();this.pointerActive=false;this.pointerX=null;this.pointerIsTouch=false;this.touchDragInput=0;this.keys.right=true;return;}
            if(code==='KeyE'){handled();this.launchSeedAttack();return;}
            if(code==='Escape'||code==='KeyP'){handled();this.togglePause();return;}
            return;
        }
        if(this.state==='select'){
            if(arrows||code==='Home'||code==='End'){handled();this.moveLevelFocus(code);return;}
            if(activation){handled();if(!e.repeat)this.activateFocusedAction();return;}
            if(code==='Escape'){handled();this.showTitle();return;}return;
        }
        if(this.state==='title'){
            if(activation){handled();if(!e.repeat)this.activateFocusedAction();return;}
            if(arrows){handled();this.moveMenuFocus(code==='ArrowLeft'||code==='ArrowUp'?-1:1);return;}return;
        }
        if(this.state==='ready'){
            if(activation){handled();if(!e.repeat)this.activateFocusedAction();return;}
            if(arrows){handled();this.moveMenuFocus(code==='ArrowLeft'||code==='ArrowUp'?-1:1);return;}
            if(code==='Escape'){handled();this.showLevelSelect();return;}return;
        }
        if(this.state==='paused'){
            if(code==='Escape'||code==='KeyP'){handled();this.togglePause();return;}
            if(activation){handled();if(!e.repeat)this.activateFocusedAction();return;}
            if(arrows){handled();this.moveMenuFocus(code==='ArrowLeft'||code==='ArrowUp'?-1:1);return;}return;
        }
        if(this.state==='won'||this.state==='lost'){
            if(activation){handled();if(!e.repeat)this.activateFocusedAction();return;}
            if(arrows){handled();this.moveMenuFocus(code==='ArrowLeft'||code==='ArrowUp'?-1:1);return;}
            if(code==='Escape'){handled();this.showLevelSelect();return;}return;
        }
        if(this.state==='stage-intro'&&code==='Escape'){handled();this.showLevelSelect();}
    };
    Game.prototype.keyUp=function(e){
        if(e.code==='ArrowLeft'||e.code==='KeyA')this.keys.left=false;
        if(e.code==='ArrowRight'||e.code==='KeyD')this.keys.right=false;
        if(!this.keys.left&&!this.keys.right&&this.paddle)this.paddle.controlVx=0;
    };
    Game.prototype.resetLocalJoystick=function(){
        this.localJoystickInput.active=false;this.localJoystickInput.x=0;this.localJoystickInput.y=0;this.localJoystickInput.pointerId=null;this.touchJoystickEngaged=false;
        if(this.localJoystickKnob)this.localJoystickKnob.style.transform='translate(0,0)';
        if(this.root.classList.contains('bb-portrait-stage')&&this.paddle){this.paddle.controlVx=0;this.paddle.vx=0;}
        this.localPunchInput.active=false;this.localPunchInput.pointerId=null;this.touchPunchWasDown=false;
    };
    Game.prototype.syncTouchControlMode=function(force){
        var mode=this.state==='playing'?'horizontal-punch':'hidden',modeChanged=force||mode!==this.touchControlMode;
        if(modeChanged){
            this.touchControlMode=mode;
            if(this.externalInput&&typeof this.externalInput.setTouchMode==='function')this.touchControlsVisible=!!this.externalInput.setTouchMode(mode);
            else this.touchControlsVisible=mode!=='hidden'&&this.localJoystickCapable;
            if(this.localJoystick)this.localJoystick.hidden=!(mode!=='hidden'&&this.localJoystickCapable);
            if(this.localPunch)this.localPunch.hidden=!(mode==='horizontal-punch'&&this.localJoystickCapable);
            this.root.classList.toggle('bb-mobile-touch-punch',this.touchControlsVisible&&mode==='horizontal-punch');
            if(mode==='hidden')this.resetLocalJoystick();
        }
        var ready=mode==='horizontal-punch'&&this.seedHeld&&this.seedUses<this.seedLimit&&this.seedCooldown<=0&&!this.seedVolleyActive;
        if(force||ready!==this.touchPunchReady){
            this.touchPunchReady=ready;
            if(this.externalInput&&typeof this.externalInput.setActionReady==='function')this.externalInput.setActionReady('punch',ready);
            if(this.localPunch){this.localPunch.classList.toggle('is-ready',ready);this.localPunch.setAttribute('aria-disabled',ready?'false':'true');}
        }
    };
    Game.prototype.touchJoystickMove=function(){
        var value=this.externalInput?this.externalInput.getMoveVector():this.localJoystickInput;
        if(!value||!value.active){
            this.touchJoystickEngaged=false;
            if(this.root.classList.contains('bb-portrait-stage')&&this.paddle){this.paddle.controlVx=0;this.paddle.vx=0;}
            return 0;
        }
        var raw=clamp(Number(value.x)||0,-1,1);
        if(!this.root.classList.contains('bb-portrait-stage')){this.touchJoystickEngaged=false;return raw;}
        var magnitude=Math.abs(raw);
        if(this.touchJoystickEngaged){
            if(magnitude<=TOUCH_STOP_THRESHOLD){this.touchJoystickEngaged=false;return 0;}
        }else{
            if(magnitude<TOUCH_START_THRESHOLD)return 0;
            this.touchJoystickEngaged=true;
        }
        if(magnitude<=TOUCH_DEAD_ZONE)return 0;
        var normalized=clamp((magnitude-TOUCH_DEAD_ZONE)/(1-TOUCH_DEAD_ZONE),0,1);
        return Math.sign(raw)*Math.pow(normalized,TOUCH_RESPONSE_CURVE);
    };
    Game.prototype.localJoystickPointer=function(e){
        if(!this.localJoystickCapable||this.touchControlMode==='hidden')return;
        if(e.type==='pointerdown'){
            if(this.localJoystickInput.active)return;
            this.localJoystickInput.active=true;this.localJoystickInput.pointerId=e.pointerId;
            this.localJoystick.setPointerCapture&&this.localJoystick.setPointerCapture(e.pointerId);
        }else if(!this.localJoystickInput.active||e.pointerId!==this.localJoystickInput.pointerId)return;
        e.preventDefault();e.stopPropagation();
        if(e.type==='pointerup'||e.type==='pointercancel'){this.resetLocalJoystick();return;}
        var base=this.localJoystick.querySelector('.bb-touch-joystick-base'),rect=base.getBoundingClientRect();if(!rect.width)return;
        var dx=e.clientX-(rect.left+rect.width*.5),dy=e.clientY-(rect.top+rect.height*.5),maxR=Math.max(1,rect.width*.5-22),distance=Math.hypot(dx,dy);
        if(distance>maxR){dx=dx/distance*maxR;dy=dy/distance*maxR;}
        this.localJoystickInput.x=dx/maxR;this.localJoystickInput.y=dy/maxR;
        if(this.localJoystickKnob)this.localJoystickKnob.style.transform='translate('+dx+'px,'+dy+'px)';
    };
    Game.prototype.touchActionState=function(name){
        if(name!=='punch')return false;
        if(this.externalInput&&typeof this.externalInput.getActionState==='function')return !!this.externalInput.getActionState(name);
        return !!this.localPunchInput.active;
    };
    Game.prototype.localPunchPointer=function(e){
        if(!this.localJoystickCapable||this.touchControlMode!=='horizontal-punch')return;
        e.preventDefault();e.stopPropagation();
        if(e.type==='pointerdown'){
            if(this.localPunchInput.active)return;
            this.localPunchInput.active=true;this.localPunchInput.pointerId=e.pointerId;
            this.localPunch.setPointerCapture&&this.localPunch.setPointerCapture(e.pointerId);return;
        }
        if(!this.localPunchInput.active||e.pointerId!==this.localPunchInput.pointerId)return;
        if(e.type==='pointerup'||e.type==='pointercancel'){this.localPunchInput.active=false;this.localPunchInput.pointerId=null;}
    };
    Game.prototype.pointer=function(e){
        if(e.pointerType==='touch'&&(this.externalInput||this.localJoystickCapable)){
            if(this.state==='ready'&&e.type==='pointerdown')this.launch();
            return;
        }
        if(e.type==='pointerdown'){
            this.pointerActive=true;this.pointerId=e.pointerId;this.keys.left=false;this.keys.right=false;
            this.pointerIsTouch=e.pointerType==='touch';
            if(this.pointerIsTouch){this.touchDragStartX=e.clientX;this.touchDragInput=0;this.pointerX=null;}
            this.canvas.setPointerCapture&&this.canvas.setPointerCapture(e.pointerId);
        }else if(!this.pointerActive||e.pointerId!==this.pointerId)return;
        if(e.type==='pointercancel'){
            this.pointerActive=false;this.pointerId=null;this.pointerX=null;this.pointerIsTouch=false;this.touchDragInput=0;
            if(this.paddle)this.paddle.controlVx=0;
            return;
        }
        if(this.pointerIsTouch){
            var dragDistance=e.clientX-this.touchDragStartX,dragDeadZone=10,dragRange=76,dragAmount=Math.abs(dragDistance);
            this.touchDragInput=dragAmount<=dragDeadZone?0:Math.sign(dragDistance)*clamp((dragAmount-dragDeadZone)/(dragRange-dragDeadZone),0,1);
        }else{
            var rect=this.canvas.getBoundingClientRect();if(!rect.width)return;
            this.pointerX=clamp((e.clientX-rect.left)/rect.width*W,0,W);
        }
        if(this.state==='ready'&&e.type==='pointerdown')this.launch();
        if(e.type==='pointerup'){
            if(!this.pointerIsTouch&&this.paddle)this.paddle.x=this.rules.clampPaddle(this.pointerX,this.paddle.w,W);
            this.pointerActive=false;this.pointerId=null;this.pointerX=null;this.pointerIsTouch=false;this.touchDragInput=0;
            if(this.paddle)this.paddle.controlVx=0;
        }
    };
    Game.prototype.click=function(e){
        var button=e.target.closest&&e.target.closest('[data-action]');if(!button)return;
        var action=button.getAttribute('data-action');
        if(action==='levels')this.showLevelSelect();else if(action==='select-level')this.showLevelIntro(Number(button.getAttribute('data-level')));else if(action==='next')this.showLevelIntro(this.level+1);else if(action==='start')this.startGame();else if(action==='launch')this.launch();else if(action==='seed')this.launchSeedAttack();else if(action==='pause'||action==='resume')this.togglePause();else if(action==='restart')this.startGame();else if(action==='title')this.showTitle();else if(action==='exit')this.exit();
    };

    Game.prototype.exit=function(){if(this.options.onExit)this.options.onExit({status:'exit',score:this.score||0,best:this.best});else this.showTitle();};

    Game.prototype.preloadBrickContactAudio=function(){
        if(!BRICK_CONTACT_AUDIO_URL||typeof fetch!=='function'||this.brickContactAudioLoad)return this.brickContactAudioLoad;
        var self=this;
        this.brickContactAudioLoad=fetch(BRICK_CONTACT_AUDIO_URL,{cache:'force-cache'}).then(function(response){if(!response.ok)throw new Error('Brick contact audio '+response.status);return response.arrayBuffer();}).then(function(data){self.brickContactAudioData=data;if(self.audioCtx)self.decodeBrickContactAudio();return data;}).catch(function(){self.brickContactAudioData=null;return null;});
        return this.brickContactAudioLoad;
    };

    Game.prototype.decodeBrickContactAudio=function(){
        if(this.brickContactAudioBuffer||this.brickContactAudioDecode||!this.brickContactAudioData||!this.audioCtx)return this.brickContactAudioDecode;
        var self=this,data=this.brickContactAudioData.slice(0);
        this.brickContactAudioDecode=this.audioCtx.decodeAudioData(data).then(function(buffer){self.brickContactAudioBuffer=buffer;return buffer;}).catch(function(){return null;});
        return this.brickContactAudioDecode;
    };

    Game.prototype.preloadCharacterHeadAudio=function(){
        if(!CHARACTER_HEAD_BOUNCE_AUDIO_URL||typeof fetch!=='function'||this.characterHeadAudioLoad)return this.characterHeadAudioLoad;
        var self=this;
        this.characterHeadAudioLoad=fetch(CHARACTER_HEAD_BOUNCE_AUDIO_URL,{cache:'force-cache'}).then(function(response){if(!response.ok)throw new Error('Character head audio '+response.status);return response.arrayBuffer();}).then(function(data){self.characterHeadAudioData=data;if(self.audioCtx)self.decodeCharacterHeadAudio();return data;}).catch(function(){self.characterHeadAudioData=null;return null;});
        return this.characterHeadAudioLoad;
    };

    Game.prototype.decodeCharacterHeadAudio=function(){
        if(this.characterHeadAudioBuffer||this.characterHeadAudioDecode||!this.characterHeadAudioData||!this.audioCtx)return this.characterHeadAudioDecode;
        var self=this,data=this.characterHeadAudioData.slice(0);
        this.characterHeadAudioDecode=this.audioCtx.decodeAudioData(data).then(function(buffer){self.characterHeadAudioBuffer=buffer;return buffer;}).catch(function(){return null;});
        return this.characterHeadAudioDecode;
    };

    Game.prototype.preloadItemCatchAudio=function(){
        if(!ITEM_CATCH_AUDIO_URL||typeof fetch!=='function'||this.itemCatchAudioLoad)return this.itemCatchAudioLoad;
        var self=this;
        this.itemCatchAudioLoad=fetch(ITEM_CATCH_AUDIO_URL,{cache:'force-cache'}).then(function(response){if(!response.ok)throw new Error('Item catch audio '+response.status);return response.arrayBuffer();}).then(function(data){self.itemCatchAudioData=data;if(self.audioCtx)self.decodeItemCatchAudio();return data;}).catch(function(){self.itemCatchAudioData=null;return null;});
        return this.itemCatchAudioLoad;
    };

    Game.prototype.decodeItemCatchAudio=function(){
        if(this.itemCatchAudioBuffer||this.itemCatchAudioDecode||!this.itemCatchAudioData||!this.audioCtx)return this.itemCatchAudioDecode;
        var self=this,data=this.itemCatchAudioData.slice(0);
        this.itemCatchAudioDecode=this.audioCtx.decodeAudioData(data).then(function(buffer){self.itemCatchAudioBuffer=buffer;return buffer;}).catch(function(){return null;});
        return this.itemCatchAudioDecode;
    };

    Game.prototype.preloadEggshellPowerAudio=function(){
        if(!EGGSHELL_POWER_AUDIO_URL||typeof fetch!=='function'||this.eggshellPowerAudioLoad)return this.eggshellPowerAudioLoad;
        var self=this;
        this.eggshellPowerAudioLoad=fetch(EGGSHELL_POWER_AUDIO_URL,{cache:'force-cache'}).then(function(response){if(!response.ok)throw new Error('Eggshell power audio '+response.status);return response.arrayBuffer();}).then(function(data){self.eggshellPowerAudioData=data;if(self.audioCtx)self.decodeEggshellPowerAudio();return data;}).catch(function(){self.eggshellPowerAudioData=null;return null;});
        return this.eggshellPowerAudioLoad;
    };

    Game.prototype.decodeEggshellPowerAudio=function(){
        if(this.eggshellPowerAudioBuffer||this.eggshellPowerAudioDecode||!this.eggshellPowerAudioData||!this.audioCtx)return this.eggshellPowerAudioDecode;
        var self=this,data=this.eggshellPowerAudioData.slice(0);
        this.eggshellPowerAudioDecode=this.audioCtx.decodeAudioData(data).then(function(buffer){self.eggshellPowerAudioBuffer=buffer;return buffer;}).catch(function(){return null;});
        return this.eggshellPowerAudioDecode;
    };

    Game.prototype.preloadBallDropAudio=function(){
        if(!BALL_DROP_AUDIO_URL||typeof fetch!=='function'||this.ballDropAudioLoad)return this.ballDropAudioLoad;
        var self=this;
        this.ballDropAudioLoad=fetch(BALL_DROP_AUDIO_URL,{cache:'force-cache'}).then(function(response){if(!response.ok)throw new Error('Ball drop audio '+response.status);return response.arrayBuffer();}).then(function(data){self.ballDropAudioData=data;if(self.audioCtx)self.decodeBallDropAudio();return data;}).catch(function(){self.ballDropAudioData=null;return null;});
        return this.ballDropAudioLoad;
    };

    Game.prototype.decodeBallDropAudio=function(){
        if(this.ballDropAudioBuffer||this.ballDropAudioDecode||!this.ballDropAudioData||!this.audioCtx)return this.ballDropAudioDecode;
        var self=this,data=this.ballDropAudioData.slice(0);
        this.ballDropAudioDecode=this.audioCtx.decodeAudioData(data).then(function(buffer){self.ballDropAudioBuffer=buffer;return buffer;}).catch(function(){return null;});
        return this.ballDropAudioDecode;
    };

    Game.prototype.preloadStageClearAudio=function(){
        if(!STAGE_CLEAR_AUDIO_URL||typeof fetch!=='function'||this.stageClearAudioLoad)return this.stageClearAudioLoad;
        var self=this;
        this.stageClearAudioLoad=fetch(STAGE_CLEAR_AUDIO_URL,{cache:'force-cache'}).then(function(response){if(!response.ok)throw new Error('Stage clear audio '+response.status);return response.arrayBuffer();}).then(function(data){self.stageClearAudioData=data;if(self.audioCtx)self.decodeStageClearAudio();return data;}).catch(function(){self.stageClearAudioData=null;return null;});
        return this.stageClearAudioLoad;
    };

    Game.prototype.decodeStageClearAudio=function(){
        if(this.stageClearAudioBuffer||this.stageClearAudioDecode||!this.stageClearAudioData||!this.audioCtx)return this.stageClearAudioDecode;
        var self=this,data=this.stageClearAudioData.slice(0);
        this.stageClearAudioDecode=this.audioCtx.decodeAudioData(data).then(function(buffer){self.stageClearAudioBuffer=buffer;return buffer;}).catch(function(){return null;});
        return this.stageClearAudioDecode;
    };

    Game.prototype.preloadStageFailAudio=function(){
        if(!STAGE_FAIL_AUDIO_URL||typeof fetch!=='function'||this.stageFailAudioLoad)return this.stageFailAudioLoad;
        var self=this;
        this.stageFailAudioLoad=fetch(STAGE_FAIL_AUDIO_URL,{cache:'force-cache'}).then(function(response){if(!response.ok)throw new Error('Stage fail audio '+response.status);return response.arrayBuffer();}).then(function(data){self.stageFailAudioData=data;if(self.audioCtx)self.decodeStageFailAudio();return data;}).catch(function(){self.stageFailAudioData=null;return null;});
        return this.stageFailAudioLoad;
    };

    Game.prototype.decodeStageFailAudio=function(){
        if(this.stageFailAudioBuffer||this.stageFailAudioDecode||!this.stageFailAudioData||!this.audioCtx)return this.stageFailAudioDecode;
        var self=this,data=this.stageFailAudioData.slice(0);
        this.stageFailAudioDecode=this.audioCtx.decodeAudioData(data).then(function(buffer){self.stageFailAudioBuffer=buffer;return buffer;}).catch(function(){return null;});
        return this.stageFailAudioDecode;
    };

    Game.prototype.ensureAudio=function(){
        if((typeof sfxEnabled!=='undefined'&&!sfxEnabled)||(typeof soundEnabled!=='undefined'&&!soundEnabled))return null;
        var AudioCtor=window.AudioContext||window.webkitAudioContext;if(!AudioCtor)return null;
        if(!this.audioCtx)this.audioCtx=new AudioCtor();
        if(this.audioCtx.state==='suspended'&&this.audioCtx.resume)this.audioCtx.resume().catch(function(){});
        this.decodeBrickContactAudio();this.decodeCharacterHeadAudio();this.decodeItemCatchAudio();this.decodeEggshellPowerAudio();this.decodeBallDropAudio();this.decodeStageClearAudio();this.decodeStageFailAudio();
        return this.audioCtx;
    };

    Game.prototype.ensureBgm=function(){
        if(!BGM_AUDIO_URL||typeof Audio!=='function')return null;
        if(!this.bgmAudio){this.bgmAudio=new Audio(BGM_AUDIO_URL);this.bgmAudio.loop=true;this.bgmAudio.preload='auto';this.bgmAudio.volume=.16;this.bgmAudio.setAttribute('playsinline','');}
        return this.bgmAudio;
    };
    Game.prototype.playBgm=function(){
        if(typeof soundEnabled!=='undefined'&&!soundEnabled)return false;
        var bgm=this.ensureBgm();if(!bgm)return false;
        var promise=bgm.play();if(promise&&promise.catch)promise.catch(function(){});return true;
    };
    Game.prototype.pauseBgm=function(){if(this.bgmAudio)this.bgmAudio.pause();};
    Game.prototype.stopBgm=function(reset){
        if(!this.bgmAudio)return;this.bgmAudio.pause();if(reset){try{this.bgmAudio.currentTime=0;}catch(error){}}
    };

    Game.prototype.playBrickContactAudio=function(audio){
        if(!audio||!this.brickContactAudioBuffer||audio.currentTime-this.lastBrickContactAudioAt<.024)return false;
        var now=audio.currentTime,source=audio.createBufferSource(),gain=audio.createGain();
        source.buffer=this.brickContactAudioBuffer;gain.gain.setValueAtTime(.55,now);source.connect(gain);gain.connect(audio.destination);source.start(now);source.stop(now+.22);this.lastBrickContactAudioAt=now;return true;
    };

    Game.prototype.playCharacterHeadAudio=function(audio){
        if(!audio||!this.characterHeadAudioBuffer||audio.currentTime-this.lastCharacterHeadAudioAt<.045)return false;
        var now=audio.currentTime,source=audio.createBufferSource(),gain=audio.createGain();
        source.buffer=this.characterHeadAudioBuffer;gain.gain.setValueAtTime(.42,now);source.connect(gain);gain.connect(audio.destination);source.start(now);source.stop(now+.32);this.lastCharacterHeadAudioAt=now;return true;
    };

    Game.prototype.playItemCatchAudio=function(audio){
        if(!audio||!this.itemCatchAudioBuffer||audio.currentTime-this.lastItemCatchAudioAt<.08)return false;
        var now=audio.currentTime,source=audio.createBufferSource(),gain=audio.createGain();
        source.buffer=this.itemCatchAudioBuffer;gain.gain.setValueAtTime(.26,now);source.connect(gain);gain.connect(audio.destination);source.start(now,.7);source.stop(now+.3);this.lastItemCatchAudioAt=now;return true;
    };

    Game.prototype.playEggshellPowerAudio=function(){
        var audio=this.ensureAudio();if(!audio||!this.eggshellPowerAudioBuffer||audio.currentTime-this.lastEggshellPowerAudioAt<.12)return false;
        var now=audio.currentTime,source=audio.createBufferSource(),gain=audio.createGain();
        source.buffer=this.eggshellPowerAudioBuffer;gain.gain.setValueAtTime(.34,now);source.connect(gain);gain.connect(audio.destination);source.start(now,.85);source.stop(now+.4);this.lastEggshellPowerAudioAt=now;return true;
    };

    Game.prototype.playBallDropAudio=function(){
        var audio=this.ensureAudio();if(!audio||!this.ballDropAudioBuffer||audio.currentTime-this.lastBallDropAudioAt<.08)return false;
        var now=audio.currentTime,source=audio.createBufferSource(),gain=audio.createGain();
        source.buffer=this.ballDropAudioBuffer;gain.gain.setValueAtTime(.7,now);source.connect(gain);gain.connect(audio.destination);source.start(now,.05);source.stop(now+1.1);this.lastBallDropAudioAt=now;return true;
    };

    Game.prototype.playRoundResultAudio=function(won){
        var audio=this.ensureAudio(),buffer=won?this.stageClearAudioBuffer:this.stageFailAudioBuffer;if(!audio||!buffer)return false;
        var now=audio.currentTime,source=audio.createBufferSource(),gain=audio.createGain();
        source.buffer=buffer;gain.gain.setValueAtTime(won ? .48 : .24,now);source.connect(gain);gain.connect(audio.destination);
        if(won){source.start(now,.55);source.stop(now+.95);}else{source.start(now);source.stop(now+1.5);}return true;
    };

    Game.prototype.playSoftCollision=function(type){
        var audio=this.ensureAudio();if(!audio||audio.state==='closed')return;
        if(type==='head'&&this.playCharacterHeadAudio(audio))return;
        if(type==='catch'&&this.playItemCatchAudio(audio))return;
        if(type==='brick'&&this.playBrickContactAudio(audio))return;
        var now=audio.currentTime,osc=audio.createOscillator(),gain=audio.createGain();
        osc.type='sine';osc.connect(gain);gain.connect(audio.destination);
        if(type==='catch'||type==='head'){
            osc.frequency.setValueAtTime(228,now);osc.frequency.exponentialRampToValueAtTime(154,now+.085);
            gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.042,now+.008);gain.gain.exponentialRampToValueAtTime(.0001,now+.105);
            osc.start(now);osc.stop(now+.11);
        }else{
            osc.frequency.setValueAtTime(456,now);osc.frequency.exponentialRampToValueAtTime(338,now+.065);
            gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.025,now+.005);gain.gain.exponentialRampToValueAtTime(.0001,now+.082);
            osc.start(now);osc.stop(now+.088);
        }
    };

    Game.prototype.triggerBallFeedback=function(type,axis){
        this.ballFeedback.active=true;this.ballFeedback.age=0;this.ballFeedback.type=type;
        this.ballFeedback.axis=axis==='x'?'x':'y';this.ballFeedback.duration=type==='catch'?.09:.075;this.ballFeedback.strength=type==='catch'?.16:.09;
    };

    Game.prototype.applySoftBrickDeflection=function(brick,contactX,ball){
        if(this.level!==4&&this.level!==5)return;
        var b=ball||this.ball,position=clamp((contactX-(brick.x+brick.w*.5))/(brick.w*.5),-1,1),deadZone=.18;
        if(Math.abs(position)<=deadZone)return;
        var influence=(Math.abs(position)-deadZone)/(1-deadZone),nudge=Math.sign(position)*influence*b.speed*Math.sin(Math.PI/22.5);
        b.vx+=nudge;
        var length=Math.hypot(b.vx,b.vy)||b.speed;
        b.vx=b.vx/length*b.speed;b.vy=b.vy/length*b.speed;
    };

    Game.prototype.addBrickHitFeedback=function(brick,ball){
        var b=ball||this.ball,cx=clamp(b.x,brick.x,brick.x+brick.w),cy=clamp(b.y,brick.y,brick.y+brick.h),dx=b.x-cx,dy=b.y-cy;
        var axis=Math.abs(dx)>Math.abs(dy)?'x':'y',normalX=0,normalY=0;
        if(axis==='x')normalX=dx?Math.sign(dx):(b.vx>0?-1:1);
        else normalY=dy?Math.sign(dy):(b.vy>0?-1:1);
        if(!dx&&!dy){cx=axis==='x'?(normalX<0?brick.x:brick.x+brick.w):b.x;cy=axis==='y'?(normalY<0?brick.y:brick.y+brick.h):b.y;}
        var baseAngle=Math.atan2(normalY,normalX);
        this.hitEffects.push({
            x:brick.x,y:brick.y,w:brick.w,h:brick.h,row:brick.row,col:brick.col,color:brick.color,sparkColor:this.theme.spark,age:0,duration:.22,
            impactX:cx,impactY:cy,axis:axis,normalX:normalX,normalY:normalY,
            sparks:[
                {angle:baseAngle-.48,speed:31,radius:2.7,color:brick.color},
                {angle:baseAngle,speed:38,radius:2.3,color:this.theme.spark},
                {angle:baseAngle+.48,speed:34,radius:2.5,color:brick.color}
            ]
        });
        if(b===this.ball)this.triggerBallFeedback('brick',axis);this.playSoftCollision('brick');
    };

    Game.prototype.triggerPadFeedback=function(ball){
        var contactBall=ball||this.ball;
        this.padFeedback.active=true;this.padFeedback.age=0;
        this.padFeedback.offset=clamp((contactBall.x-this.paddle.x)/(this.paddle.w*.5),-1,1);
        this.padFeedback.contactX=clamp(contactBall.x,this.paddle.x-this.paddle.w*.5,this.paddle.x+this.paddle.w*.5);this.padFeedback.contactY=this.paddle.y-this.paddle.h*.5;
        this.padFeedback.kind=this.handling.feedback;
        var durations={berryDots:.18,grainLift:.28,leafFlick:.24,crystalGlint:.16,mistRibbon:.32,orchardDouble:.3,emberSlash:.16};
        this.padFeedback.duration=durations[this.padFeedback.kind]||.26;
        if(contactBall===this.ball)this.triggerBallFeedback('catch','y');this.playSoftCollision('head');
    };

    Game.prototype.update=function(dt){
        this.syncTouchControlMode();
        var touchPunchDown=this.touchControlMode==='horizontal-punch'&&this.touchActionState('punch');
        if(touchPunchDown&&!this.touchPunchWasDown)this.launchSeedAttack();
        this.touchPunchWasDown=touchPunchDown;
        if(this.padFeedback.active){
            this.padFeedback.age+=dt;
            if(this.padFeedback.age>=this.padFeedback.duration){this.padFeedback.age=this.padFeedback.duration;this.padFeedback.active=false;}
        }
        if(this.ballFeedback.active){
            this.ballFeedback.age+=dt;
            if(this.ballFeedback.age>=this.ballFeedback.duration){this.ballFeedback.age=this.ballFeedback.duration;this.ballFeedback.active=false;}
        }
        for(var fx=this.hitEffects.length-1;fx>=0;fx--){
            this.hitEffects[fx].age+=dt;
            if(this.hitEffects[fx].age>=this.hitEffects[fx].duration)this.hitEffects.splice(fx,1);
        }
        for(var seedFx=this.seedBursts.length-1;seedFx>=0;seedFx--){
            this.seedBursts[seedFx].age+=dt;
            if(this.seedBursts[seedFx].age>=this.seedBursts[seedFx].duration)this.seedBursts.splice(seedFx,1);
        }
        for(var itemFx=this.stageFiveCollectEffects.length-1;itemFx>=0;itemFx--){
            this.stageFiveCollectEffects[itemFx].age+=dt;
            if(this.stageFiveCollectEffects[itemFx].age>=this.stageFiveCollectEffects[itemFx].duration)this.stageFiveCollectEffects.splice(itemFx,1);
        }
        for(var pathFx=this.stageFiveClearPaths.length-1;pathFx>=0;pathFx--){
            this.stageFiveClearPaths[pathFx].age+=dt;
            if(this.stageFiveClearPaths[pathFx].age>=this.stageFiveClearPaths[pathFx].duration)this.stageFiveClearPaths.splice(pathFx,1);
        }
        for(var buffFx=this.stageFiveBuffCollectEffects.length-1;buffFx>=0;buffFx--){
            this.stageFiveBuffCollectEffects[buffFx].age+=dt;
            if(this.stageFiveBuffCollectEffects[buffFx].age>=this.stageFiveBuffCollectEffects[buffFx].duration)this.stageFiveBuffCollectEffects.splice(buffFx,1);
        }
        for(var hintFx=this.itemHints.length-1;hintFx>=0;hintFx--){
            this.itemHints[hintFx].age+=dt;
            if(this.itemHints[hintFx].age>=this.itemHints[hintFx].duration)this.itemHints.splice(hintFx,1);
        }
        for(var resultFx=this.itemResultEffects.length-1;resultFx>=0;resultFx--){
            this.itemResultEffects[resultFx].age+=dt;
            if(this.itemResultEffects[resultFx].age>=this.itemResultEffects[resultFx].duration)this.itemResultEffects.splice(resultFx,1);
        }
        for(var bi=0;bi<this.bricks.length;bi++){
            var boardBrick=this.bricks[bi];
            if(boardBrick.hitCooldown>0)boardBrick.hitCooldown=Math.max(0,boardBrick.hitCooldown-dt);
            if(boardBrick.shellPulseAge>=0)boardBrick.shellPulseAge=Math.min(boardBrick.shellPulseDuration,boardBrick.shellPulseAge+dt);
        }
        var previousX=this.paddle.x,unclampedX,targetVx=0,touchMove=this.touchJoystickMove();
        var dir=(this.keys.left?-1:0)+(this.keys.right?1:0);
        if(dir){targetVx=dir*this.paddle.speed;this.paddle.controlVx=targetVx;this.paddle.x+=targetVx*dt;}
        else if(touchMove){targetVx=touchMove*this.paddle.speed;this.paddle.controlVx=targetVx;this.paddle.x+=targetVx*dt;}
        else if(this.pointerActive&&this.pointerIsTouch&&this.touchDragInput){targetVx=this.touchDragInput*this.paddle.speed;this.paddle.controlVx=targetVx;this.paddle.x+=targetVx*dt;}
        else if(this.pointerActive&&this.pointerX!==null){this.paddle.x=this.pointerX;this.paddle.controlVx=dt>0?(this.paddle.x-previousX)/dt:0;}
        else this.paddle.controlVx=0;
        unclampedX=this.paddle.x;
        this.paddle.x=this.rules.clampPaddle(this.paddle.x,this.paddle.w,W);
        if(this.paddle.x!==unclampedX)this.paddle.controlVx=0;
        this.paddle.vx=dt>0?(this.paddle.x-previousX)/dt:0;
        if(this.state==='ready'||this.state==='playing')this.updateBrickMotion(dt);
        if(this.state==='ready'){
            this.ball.x=this.paddle.x;this.ball.y=this.paddle.y-this.ball.r-7;return;
        }
        if(this.state!=='playing')return;
        this.elapsed+=dt;
        this.updateHazard(dt);
        if(this.state!=='playing')return;
        this.updateEarlyLife(dt);
        if(this.state!=='playing')return;
        this.updateSeedSystem(dt);
        if(this.state!=='playing')return;
        this.updateStageThreeSlow(dt);
        if(this.state!=='playing')return;
        this.updateStageFiveItems(dt);
        if(this.state!=='playing')return;
        this.updateStageFiveBuffDrops(dt);
        if(this.state!=='playing')return;
        this.updateStageSixItems(dt);
        if(this.state!=='playing')return;
        var steps=Math.max(1,Math.ceil(dt/0.006)),step=dt/steps;
        for(var s=0;s<steps&&this.state==='playing';s++)this.physicsStep(step);
    };

    Game.prototype.physicsStep=function(dt){
        if(this.state!=='playing')return;
        if(this.level!==6){this.physicsBallStep(this.ball,dt);return;}
        var balls=[this.ball].concat(this.companionBalls.slice());
        for(var ballIndex=0;ballIndex<balls.length&&this.state==='playing';ballIndex++){
            var ball=balls[ballIndex];
            if(ball!==this.ball&&this.companionBalls.indexOf(ball)<0)continue;
            if(this.physicsBallStep(ball,dt))break;
        }
    };

    Game.prototype.physicsBallStep=function(b,dt){
        if(this.state!=='playing'||!b)return false;
        var p=this.paddle;
        b.x+=b.vx*dt;b.y+=b.vy*dt;
        if(b.x-b.r<26){b.x=26+b.r;b.vx=Math.abs(b.vx);}
        if(b.x+b.r>W-26){b.x=W-26-b.r;b.vx=-Math.abs(b.vx);}
        if(b.y-b.r<28){b.y=28+b.r;b.vy=Math.abs(b.vy);}
        var pr={x:p.x-p.w*0.5,y:p.y-p.h*0.5,w:p.w,h:p.h};
        if(b.vy>0&&this.rules.circleRectHit(b.x,b.y,b.r,pr)){
            b.y=pr.y-b.r-0.5;var bounce=this.rules.paddleBounce(b.x,p.x,p.w,b.speed);b.vx=bounce.vx;b.vy=bounce.vy;
            if(this.handling.steer!==1){b.vx=clamp(b.vx*this.handling.steer,-b.speed*.94,b.speed*.94);b.vy=-Math.sqrt(Math.max(0,b.speed*b.speed-b.vx*b.vx));}
            this.triggerPadFeedback(b);
            if(this.characterView&&this.characterView.react)this.characterView.react('catch',this.padFeedback.offset);
        }
        for(var i=0;i<this.bricks.length;i++){
            var brick=this.bricks[i];if(!brick.alive||brick.hitCooldown>0||!this.rules.circleRectHit(b.x,b.y,b.r,brick))continue;
            var cx=clamp(b.x,brick.x,brick.x+brick.w),cy=clamp(b.y,brick.y,brick.y+brick.h),dx=b.x-cx,dy=b.y-cy;
            var hitAxis=Math.abs(dx)>Math.abs(dy)?'x':'y';
            if(hitAxis==='x')b.vx=dx<0?-Math.abs(b.vx):Math.abs(b.vx);else b.vy=dy<0?-Math.abs(b.vy):Math.abs(b.vy);
            this.applySoftBrickDeflection(brick,cx,b);
            if(brick.hitsRemaining>1){
                brick.hitsRemaining--;brick.hitCooldown=.07;brick.shellPulseAge=0;brick.shellImpactX=cx;brick.shellImpactY=cy;
                if(b===this.ball)this.triggerBallFeedback('brick',hitAxis);this.playSoftCollision('brick');break;
            }
            this.addBrickHitFeedback(brick,b);brick.hitsRemaining=0;brick.alive=false;this.remaining--;this.score+=this.rules.scoreForBrick(brick.row);
            if(brick.buffCarrier&&!brick.buffDropped)this.spawnStageFiveBuffDrop(brick);
            if(this.level===2||this.level===3)this.stageEarlyBrickCleared(brick);
            if(this.level===3)this.stageThreeBrickCleared(brick);
            if(this.level===6)this.stageSixBrickCleared(brick);
            if(this.rules.isWin(this.remaining)){this.finishRound(true);return false;}break;
        }
        if(b.y-b.r>H){
            this.playBallDropAudio();
            if(this.level===6)return this.stageSixBallExit(b);
            this.loseBall();return true;
        }
        return false;
    };

    Game.prototype.stageSixBallExit=function(ball){
        if(this.level!==6||!ball)return false;
        this.stageSixDissolveEffects.push({x:clamp(ball.x,26+ball.r,W-26-ball.r),y:H-12,age:0,duration:.36});
        if(ball===this.ball&&this.companionBalls.length){
            var promoted=this.companionBalls.shift();promoted.companion=false;this.ball=promoted;
            if(!this.companionBalls.length)this.stageSixMultiTime=0;
            this.updateHud();return true;
        }
        var index=this.companionBalls.indexOf(ball);
        if(index>=0){this.companionBalls.splice(index,1);if(!this.companionBalls.length)this.stageSixMultiTime=0;this.updateHud();return true;}
        this.loseBall();return true;
    };

    Game.prototype.updateHud=function(){
        var q=function(sel){return this.root&&this.root.querySelector(sel);}.bind(this),el;
        if((el=q('[data-score]')))el.textContent=String(this.score||0).padStart(4,'0');
        if((el=q('[data-best]')))el.textContent=this.best||0;
        if((el=q('[data-lives]')))el.textContent=new Array(Math.max(0,this.lives||0)+1).join('● ');
        if((el=q('[data-left]')))el.textContent=this.remaining||0;
        if((el=q('[data-ball-speed]')))el.textContent=Math.round((this.ball&&this.ball.speed)||LEVEL_BALL_SPEEDS[this.level]||LEVEL_BALL_SPEEDS[1]);
        if((el=q('[data-seeds]'))){
            var seedRemaining=Math.max(0,(this.seedDropLimit||0)-(this.seedUses||0)-(this.seedMisses||0)),seedExhausted=this.seedUses>=this.seedLimit||(this.seedSpawnCount>=this.seedDropLimit&&!this.seedHeld&&!this.seedDrop&&!this.seedVolleyActive);
            el.textContent=(seedExhausted?'—':(this.seedHeld?'●':'○'))+' '+seedRemaining;
            el.title=seedExhausted?this.t.seedSpent:(this.seedHeld?this.t.seedReady:this.t.seedWaiting);
        }
        var seedButton=q('.bb-seed-attack');
        if(seedButton){
            var attackRemaining=Math.max(0,(this.seedDropLimit||0)-(this.seedUses||0)-(this.seedMisses||0));
            seedButton.disabled=this.state!=='playing'||!this.seedHeld||this.seedUses>=this.seedLimit||this.seedCooldown>0||this.seedVolleyActive;
            seedButton.setAttribute('aria-label',this.t.attack+' '+attackRemaining);
            var seedReady=seedButton.querySelector('[data-seed-ready]');if(seedReady)seedReady.textContent=String(attackRemaining);
        }
        var launch=q('.bb-launch');if(launch)launch.hidden=this.state!=='ready';
        this.updateItemWhisper();
    };

    Game.prototype.roundRect=function(c,x,y,w,h,r,fill,stroke){
        c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.stroke();}
    };
    Game.prototype.drawMotif=function(c,x,y,size,alpha,color){
        var type=this.theme.motif;
        c.save();c.translate(x,y);c.globalAlpha=alpha;c.fillStyle=color||this.theme.accent;c.strokeStyle=color||this.theme.accent;c.lineWidth=Math.max(1,size*.12);c.lineCap='round';c.lineJoin='round';
        if(type==='petal'){
            for(var p=0;p<5;p++){c.save();c.rotate(p*Math.PI*2/5);c.beginPath();c.ellipse(0,-size*.48,size*.25,size*.5,0,0,Math.PI*2);c.fill();c.restore();}
            c.beginPath();c.arc(0,0,size*.22,0,Math.PI*2);c.fill();
        }else if(type==='leaf'){
            c.save();c.rotate(-.52);c.beginPath();c.moveTo(-size*.72,0);c.quadraticCurveTo(0,-size*.9,size*.76,0);c.quadraticCurveTo(0,size*.68,-size*.72,0);c.fill();c.strokeStyle='rgba(255,255,255,.7)';c.beginPath();c.moveTo(-size*.5,0);c.lineTo(size*.54,0);c.stroke();c.restore();
        }else if(type==='crystal'){
            c.beginPath();c.moveTo(0,-size);c.lineTo(size*.72,-size*.15);c.lineTo(size*.35,size);c.lineTo(-size*.5,size*.72);c.lineTo(-size*.76,-size*.18);c.closePath();c.fill();c.strokeStyle='rgba(255,255,255,.72)';c.beginPath();c.moveTo(0,-size);c.lineTo(0,size*.62);c.moveTo(-size*.7,-size*.15);c.lineTo(0,size*.62);c.lineTo(size*.67,-size*.14);c.stroke();
        }else if(type==='cloud'){
            c.beginPath();c.arc(-size*.48,size*.12,size*.4,0,Math.PI*2);c.arc(-size*.04,-size*.14,size*.55,0,Math.PI*2);c.arc(size*.48,size*.1,size*.4,0,Math.PI*2);c.ellipse(0,size*.3,size*.86,size*.38,0,0,Math.PI*2);c.fill();
        }else if(type==='orchard'){
            c.beginPath();c.arc(0,size*.12,size*.72,0,Math.PI*2);c.fill();c.strokeStyle='rgba(255,255,255,.78)';c.beginPath();c.moveTo(0,-size*.62);c.lineTo(size*.08,-size*.98);c.stroke();c.save();c.translate(size*.28,-size*.78);c.rotate(-.45);c.beginPath();c.ellipse(0,0,size*.34,size*.17,0,0,Math.PI*2);c.fill();c.restore();
        }else if(type==='berry'){
            [[-.38,.14],[.38,.14],[0,-.3]].forEach(function(pos){c.beginPath();c.arc(pos[0]*size,pos[1]*size,size*.48,0,Math.PI*2);c.fill();});c.strokeStyle='rgba(255,255,255,.72)';c.beginPath();c.moveTo(0,-size*.63);c.lineTo(size*.18,-size*.95);c.stroke();
        }else if(type==='flame'){
            c.beginPath();c.moveTo(0,-size);c.bezierCurveTo(size*.18,-size*.42,size*.78,-size*.2,size*.62,size*.46);c.bezierCurveTo(size*.5,size,size*.06,size*1.05,0,size);c.bezierCurveTo(-size*.68,size*.92,-size*.85,size*.28,-size*.52,-size*.18);c.bezierCurveTo(-size*.2,-size*.48,-size*.28,-size*.78,0,-size);c.closePath();c.fill();
        }else{
            c.beginPath();c.moveTo(0,size);c.lineTo(0,-size);c.stroke();
            for(var g=0;g<3;g++){var gy=-size*.58+g*size*.48;c.save();c.translate(0,gy);c.rotate(-.58);c.beginPath();c.ellipse(-size*.3,0,size*.34,size*.15,0,0,Math.PI*2);c.fill();c.restore();c.save();c.translate(0,gy+size*.2);c.rotate(.58);c.beginPath();c.ellipse(size*.3,0,size*.34,size*.15,0,0,Math.PI*2);c.fill();c.restore();}
        }
        c.restore();
    };
    Game.prototype.drawWorldCloud=function(c,x,y,scale,alpha){
        c.save();c.translate(x,y);c.scale(scale,scale);c.globalAlpha=alpha;c.fillStyle='#fffdf3';
        c.beginPath();c.arc(-24,5,18,0,Math.PI*2);c.arc(-4,-7,25,0,Math.PI*2);c.arc(23,3,19,0,Math.PI*2);c.ellipse(0,13,48,16,0,0,Math.PI*2);c.fill();c.restore();
    };
    Game.prototype.drawWorldSprout=function(c,x,y,scale,color,alpha){
        c.save();c.translate(x,y);c.scale(scale,scale);c.globalAlpha=alpha;c.strokeStyle=color;c.fillStyle=color;c.lineWidth=3;c.lineCap='round';
        c.beginPath();c.moveTo(0,17);c.quadraticCurveTo(-1,2,1,-12);c.stroke();
        c.save();c.translate(-8,-7);c.rotate(.48);c.beginPath();c.ellipse(0,0,9,4.4,0,0,Math.PI*2);c.fill();c.restore();
        c.save();c.translate(9,-12);c.rotate(-.42);c.beginPath();c.ellipse(0,0,9,4.4,0,0,Math.PI*2);c.fill();c.restore();c.restore();
    };
    Game.prototype.drawWorldShell=function(c,x,y,scale,flip,alpha){
        c.save();c.translate(x,y);c.scale((flip?-1:1)*scale,scale);c.globalAlpha=alpha;
        c.fillStyle='#fff7df';c.strokeStyle='rgba(207,132,102,.48)';c.lineWidth=2;
        c.beginPath();c.moveTo(-32,-4);c.lineTo(-23,-12);c.lineTo(-12,-5);c.lineTo(-2,-14);c.lineTo(9,-5);c.lineTo(20,-11);c.lineTo(32,-3);c.bezierCurveTo(30,25,16,37,0,38);c.bezierCurveTo(-17,37,-30,24,-32,-4);c.closePath();c.fill();c.stroke();
        c.globalAlpha*=.55;c.fillStyle='#f6c887';c.beginPath();c.ellipse(0,5,17,8,0,0,Math.PI*2);c.fill();c.restore();
    };
    Game.prototype.drawWorldBackdrop=function(c){
        var world=this.stageWorld||stageWorldFor(this.level),level=this.level,sunX=[154,806,180,780,750,170][level-1],sunY=112,lowerShift=this.presentationExtra||0;
        c.save();
        var glow=c.createRadialGradient(sunX,sunY,2,sunX,sunY,88);glow.addColorStop(0,'rgba(255,250,211,.88)');glow.addColorStop(.35,'rgba(255,239,179,.42)');glow.addColorStop(1,'rgba(255,239,179,0)');c.fillStyle=glow;c.beginPath();c.arc(sunX,sunY,88,0,Math.PI*2);c.fill();
        this.drawWorldCloud(c,122+(level%2)*76,165,1.02,.24);this.drawWorldCloud(c,760-(level%3)*54,232,.82,.2);this.drawWorldCloud(c,485,86,.62,.15);
        c.save();c.translate(0,lowerShift);c.globalAlpha=.3;c.fillStyle=world.horizon;c.beginPath();c.moveTo(18,552);c.quadraticCurveTo(125,468,245,538);c.quadraticCurveTo(360,451,489,535);c.quadraticCurveTo(625,442,770,530);c.quadraticCurveTo(866,480,942,535);c.lineTo(942,702);c.lineTo(18,702);c.closePath();c.fill();
        c.globalAlpha=.36;c.fillStyle=world.ground;c.beginPath();c.moveTo(18,604);c.quadraticCurveTo(170,548,328,606);c.quadraticCurveTo(484,555,636,607);c.quadraticCurveTo(790,557,942,600);c.lineTo(942,702);c.lineTo(18,702);c.closePath();c.fill();c.restore();
        if(level===1){
            this.drawWorldShell(c,108,578+lowerShift,.72,false,.42);this.drawWorldShell(c,850,574+lowerShift,.62,true,.34);this.drawWorldSprout(c,120,545+lowerShift,.75,'#5e9f7e',.46);this.drawWorldSprout(c,820,551+lowerShift,.62,'#68aa88',.38);
        }else if(level===2){
            c.globalAlpha=.22;c.strokeStyle='#438fa0';c.lineWidth=3;c.lineCap='round';for(var wind=0;wind<3;wind++){c.beginPath();c.moveTo(38,150+wind*156);c.bezierCurveTo(235,105+wind*154,354,205+wind*137,530,153+wind*150);c.bezierCurveTo(675,112+wind*157,785,176+wind*151,920,139+wind*158);c.stroke();}
            this.drawWorldSprout(c,94,568+lowerShift,.72,'#559d7b',.42);this.drawWorldSprout(c,872,565+lowerShift,.68,'#559d7b',.4);
        }else if(level===3){
            c.globalAlpha=.18;c.strokeStyle='#fff7df';c.lineWidth=18;c.lineCap='round';for(var shellArc=0;shellArc<3;shellArc++){c.beginPath();c.ellipse(480,248+shellArc*90,300-shellArc*36,150-shellArc*16,0,Math.PI*.12,Math.PI*.88);c.stroke();}
            this.drawWorldShell(c,82,574+lowerShift,.58,false,.3);this.drawWorldShell(c,879,574+lowerShift,.58,true,.3);
        }else if(level===4){
            c.globalAlpha=.2;c.strokeStyle='#fff7df';c.lineWidth=14;c.beginPath();c.ellipse(480,280,300,244,0,0,Math.PI*2);c.stroke();c.globalAlpha=.13;c.strokeStyle=world.accent;c.lineWidth=3;c.setLineDash([12,15]);c.beginPath();c.ellipse(480,280,324,264,0,0,Math.PI*2);c.stroke();c.setLineDash([]);
            this.drawWorldSprout(c,480,570+lowerShift,.82,'#5d9f7e',.4);
        }else if(level===5){
            c.globalAlpha=.2;c.strokeStyle='#6f8f87';c.lineWidth=8;c.lineCap='round';for(var nest=0;nest<4;nest++){c.beginPath();c.ellipse(480,557+lowerShift+nest*9,250-nest*24,62-nest*5,0,Math.PI*.08,Math.PI*.92);c.stroke();}
            c.fillStyle='#fff1bd';c.globalAlpha=.42;[[106,120],[855,152],[760,335],[188,350]].forEach(function(star){c.save();c.translate(star[0],star[1]);c.rotate(Math.PI/4);c.fillRect(-3,-12,6,24);c.fillRect(-12,-3,24,6);c.restore();});
        }else{
            c.globalAlpha=.2;c.fillStyle='#fff6d4';[[130,540,92],[480,570,135],[825,530,96]].forEach(function(island){c.beginPath();c.ellipse(island[0],island[1]+lowerShift,island[2],22,0,0,Math.PI*2);c.fill();});
            this.drawWorldSprout(c,130,514+lowerShift,.62,'#579a78',.42);this.drawWorldSprout(c,480,535+lowerShift,.86,'#579a78',.48);this.drawWorldSprout(c,825,504+lowerShift,.66,'#579a78',.42);
            c.globalAlpha=.12;c.strokeStyle='#fff0b7';c.lineWidth=8;for(var ray=0;ray<5;ray++){c.beginPath();c.moveTo(480,520+lowerShift);c.lineTo(270+ray*105,110+(ray%2)*45);c.stroke();}
        }
        c.restore();
    };
    Game.prototype.drawThemeBackdrop=function(c){
        var points=[[74,76,22],[884,82,26],[76,610,28],[878,594,23],[478,656,18]];
        for(var i=0;i<points.length;i++)this.drawMotif(c,points[i][0],this.presentationY(points[i][1]),points[i][2],i===4?.06:.08,this.theme.accent);
    };
    Game.prototype.drawBall=function(c,ball,isCompanion){
        var b=ball||this.ball,feedback=this.ballFeedback,amount=0,scaleX=1,scaleY=1,fade=1;
        if(isCompanion&&this.stageSixMultiTime<2)fade=.48+.52*clamp(this.stageSixMultiTime/2,0,1);
        if(isCompanion){
            var length=Math.hypot(b.vx,b.vy)||1,trailX=b.x-b.vx/length*22,trailY=b.y-b.vy/length*22;
            c.save();c.globalAlpha=fade*.34;c.strokeStyle='#c9a8dc';c.lineWidth=4;c.lineCap='round';c.beginPath();c.moveTo(b.x,b.y);c.lineTo(trailX,trailY);c.stroke();c.fillStyle='#efb6c4';c.beginPath();c.arc(trailX,trailY,2.2,0,Math.PI*2);c.fill();c.restore();
        }
        if(!isCompanion&&feedback.active)amount=Math.pow(1-clamp(feedback.age/feedback.duration,0,1),2)*feedback.strength;
        if(feedback.axis==='x'){scaleX=1-amount;scaleY=1+amount*.68;}else{scaleX=1+amount*.68;scaleY=1-amount;}
        var arrival=isCompanion?clamp(b.age/.2,0,1):1,arrivalScale=.7+.3*(arrival*arrival*(3-2*arrival));
        c.save();c.globalAlpha=fade;c.translate(b.x,b.y);c.scale(scaleX*arrivalScale,scaleY*arrivalScale);c.shadowColor=isCompanion?'rgba(175,126,202,.48)':this.theme.glow;c.shadowBlur=14;
        c.beginPath();c.arc(0,0,b.r+2,0,Math.PI*2);c.fillStyle=this.theme.ball;c.fill();
        c.beginPath();c.arc(0,0,b.r*.72,0,Math.PI*2);c.fillStyle=this.theme.ballCore;c.fill();
        c.beginPath();c.arc(-3,-4,b.r*.34,0,Math.PI*2);c.fillStyle='rgba(255,255,255,.92)';c.fill();c.shadowColor='transparent';
        this.drawMotif(c,0,0,b.r*.34,.62,this.theme.ball);c.restore();
    };
    Game.prototype.drawBrickSurface=function(c,brick){
        var x=brick.x,y=brick.y,w=brick.w,h=brick.h,type=this.theme.motif,variant=(brick.row*3+brick.col)%3,cx=x+w*.5+(variant-1)*4,cy=y+h*.5;
        c.save();c.beginPath();c.roundRect(x+2,y+2,w-4,h-4,9);c.clip();
        c.globalAlpha=.46;c.strokeStyle='rgba(255,255,255,.88)';c.lineWidth=1.4;c.beginPath();c.roundRect(x+4,y+4,w-8,h-8,7);c.stroke();
        if(type==='petal'){
            c.globalAlpha=.34;c.strokeStyle='rgba(109,108,72,.62)';c.lineWidth=1.2;c.beginPath();c.moveTo(x+9,cy+5);c.quadraticCurveTo(cx,cy-7,x+w-9,cy+4);c.stroke();
            this.drawMotif(c,cx,cy-1,7.4,.67,'#fff8e9');
            c.globalAlpha=.36;c.fillStyle='#fff4ad';for(var p=0;p<3;p++){c.beginPath();c.arc(x+16+p*25,cy+7-(p%2)*3,1.7,0,Math.PI*2);c.fill();}
        }else if(type==='leaf'){
            c.save();c.translate(cx,cy);c.rotate(variant===0?-.16:(variant===2?.16:0));c.globalAlpha=.5;c.fillStyle='rgba(235,255,205,.82)';c.beginPath();c.moveTo(-w*.34,0);c.quadraticCurveTo(0,-h*.42,w*.34,0);c.quadraticCurveTo(0,h*.38,-w*.34,0);c.fill();c.strokeStyle='rgba(62,120,70,.55)';c.lineWidth=1.25;c.beginPath();c.moveTo(-w*.28,0);c.lineTo(w*.28,0);for(var l=-2;l<=2;l++){c.moveTo(l*8,0);c.lineTo(l*8+6,l%2?5:-5);}c.stroke();c.restore();
            c.globalAlpha=.24;c.fillStyle='#fff';c.fillRect(x+7,y+5,4,h-10);c.fillRect(x+w-11,y+5,4,h-10);
        }else if(type==='crystal'){
            c.globalAlpha=.28;c.fillStyle='#fff';c.beginPath();c.moveTo(x+3,y+3);c.lineTo(cx-7,y+3);c.lineTo(cx+5,y+h-3);c.lineTo(x+18,y+h-3);c.closePath();c.fill();
            c.globalAlpha=.2;c.fillStyle=this.theme.accent;c.beginPath();c.moveTo(cx-7,y+3);c.lineTo(x+w-3,y+3);c.lineTo(cx+5,y+h-3);c.closePath();c.fill();
            c.globalAlpha=.72;c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=1;c.beginPath();c.moveTo(cx-7,y+4);c.lineTo(cx+5,y+h-4);c.moveTo(x+18,y+h-4);c.lineTo(cx-7,y+4);c.moveTo(cx+5,y+h-4);c.lineTo(x+w-15,y+4);c.stroke();this.drawMotif(c,cx,cy,5.3,.48,'#ffffff');
        }else if(type==='cloud'){
            c.globalAlpha=.52;c.fillStyle='rgba(255,255,255,.82)';c.beginPath();c.arc(cx-12,cy+1,7,0,Math.PI*2);c.arc(cx-3,cy-4,9,0,Math.PI*2);c.arc(cx+8,cy,7,0,Math.PI*2);c.ellipse(cx-1,cy+5,22,7,0,0,Math.PI*2);c.fill();
            c.globalAlpha=.38;c.strokeStyle=this.theme.accent;c.lineWidth=1.1;c.beginPath();c.moveTo(x+9,cy+9);c.quadraticCurveTo(cx,cy+13,x+w-9,cy+8);c.moveTo(x+18,cy+12);c.lineTo(x+36,cy+12);c.stroke();
        }else if(type==='orchard'){
            c.globalAlpha=.23;c.strokeStyle='rgba(91,93,48,.66)';c.lineWidth=3;c.beginPath();c.moveTo(x+13,y+2);c.lineTo(x+13,y+h-2);c.moveTo(x+w-13,y+2);c.lineTo(x+w-13,y+h-2);c.stroke();
            c.globalAlpha=.68;c.fillStyle='rgba(255,245,204,.88)';c.beginPath();c.arc(cx,cy+1,9,0,Math.PI*2);c.fill();c.globalAlpha=.58;c.strokeStyle='rgba(99,112,55,.7)';c.lineWidth=1.4;c.beginPath();c.moveTo(cx,cy-7);c.lineTo(cx+2,cy-12);c.stroke();c.save();c.translate(cx+6,cy-9);c.rotate(-.45);c.fillStyle='#e7f2b3';c.beginPath();c.ellipse(0,0,5,2.3,0,0,Math.PI*2);c.fill();c.restore();
            c.globalAlpha=.5;c.fillStyle=this.theme.accent;for(var o=0;o<3;o++){c.beginPath();c.arc(cx-4+o*4,cy+(o%2)*3,1.2,0,Math.PI*2);c.fill();}
        }else if(type==='berry'){
            c.globalAlpha=.66;c.fillStyle='rgba(255,221,241,.78)';[[-7,2],[7,2],[0,-6]].forEach(function(pos){c.beginPath();c.arc(cx+pos[0],cy+pos[1],6.3,0,Math.PI*2);c.fill();});
            c.globalAlpha=.72;c.fillStyle='#fff';[[-9,0],[5,0],[-2,-9]].forEach(function(pos){c.beginPath();c.arc(cx+pos[0],cy+pos[1],1.6,0,Math.PI*2);c.fill();});
            c.globalAlpha=.26;c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=1.2;for(var b=0;b<4;b++){c.beginPath();c.moveTo(x+8+b*20,y+5);c.lineTo(x+14+b*20,y+h-5);c.stroke();}
        }else if(type==='flame'){
            c.globalAlpha=.33;c.fillStyle='#ffd666';c.beginPath();c.moveTo(x+3,y+h-3);c.lineTo(cx-5,y+3);c.lineTo(cx+5,y+h-3);c.lineTo(x+w-3,y+4);c.lineTo(x+w-3,y+h-3);c.closePath();c.fill();
            c.globalAlpha=.68;c.strokeStyle='#fff0a0';c.lineWidth=1.5;c.beginPath();c.moveTo(x+8,y+5);c.lineTo(x+21,cy);c.lineTo(x+14,y+h-5);c.moveTo(x+w-8,y+5);c.lineTo(x+w-23,cy-2);c.lineTo(x+w-16,y+h-4);c.stroke();this.drawMotif(c,cx,cy,6.3,.76,'#fff1a1');
        }else{
            c.globalAlpha=.26;c.strokeStyle='rgba(91,69,30,.76)';c.lineWidth=1;for(var g=0;g<5;g++){c.beginPath();c.moveTo(x+7+g*17,y+3);c.lineTo(x+17+g*17,y+h-3);c.stroke();}for(var gh=0;gh<2;gh++){c.beginPath();c.moveTo(x+4,y+9+gh*10);c.lineTo(x+w-4,y+9+gh*10);c.stroke();}
            this.drawMotif(c,cx,cy,7,.7,'#fff4bf');
        }
        c.globalAlpha=.18;c.strokeStyle='rgba(54,92,80,.72)';c.lineWidth=1.1;c.beginPath();c.moveTo(x+7,y+h-7);c.quadraticCurveTo(cx,cy+3,x+w-7,y+h-7);c.stroke();
        c.restore();
    };
    Game.prototype.drawSoftSeed=function(c,x,y,scale,rotation,alpha){
        c.save();c.translate(x,y);c.rotate(rotation||0);c.scale(scale||1,scale||1);c.globalAlpha=alpha===undefined?1:alpha;
        c.shadowColor='rgba(213,145,92,.46)';c.shadowBlur=13;
        var shell=c.createLinearGradient(-9,-13,10,14);shell.addColorStop(0,'#fffef3');shell.addColorStop(.42,'#f9eccd');shell.addColorStop(.72,'#efc79c');shell.addColorStop(1,'#d99677');c.fillStyle=shell;c.strokeStyle='rgba(183,111,84,.82)';c.lineWidth=1.45;
        c.beginPath();c.moveTo(0,-14);c.bezierCurveTo(7,-13,11,-4,10,4);c.bezierCurveTo(9,13,4,17,0,17);c.bezierCurveTo(-6,17,-11,12,-11,4);c.bezierCurveTo(-11,-4,-6,-13,0,-14);c.closePath();c.fill();c.shadowColor='transparent';c.stroke();
        var inner=c.createRadialGradient(-3,-5,0,0,1,10);inner.addColorStop(0,'rgba(255,255,246,.96)');inner.addColorStop(.48,'rgba(255,223,155,.74)');inner.addColorStop(1,'rgba(236,151,116,.18)');c.fillStyle=inner;c.beginPath();c.ellipse(0,2,7.2,10.2,0,0,Math.PI*2);c.fill();
        c.strokeStyle='rgba(190,113,86,.68)';c.lineWidth=1.35;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(-9,3);c.lineTo(-5,0);c.lineTo(-1,4);c.lineTo(3,-1);c.lineTo(7,3);c.lineTo(10,0);c.stroke();
        c.globalAlpha=(alpha===undefined?1:alpha)*.72;c.strokeStyle='rgba(255,255,250,.95)';c.lineWidth=1.3;c.beginPath();c.arc(-2,-3,4.8,Math.PI*1.05,Math.PI*1.58);c.stroke();
        c.fillStyle=this.theme.spark;c.beginPath();c.arc(5,-8,1.7,0,Math.PI*2);c.arc(-7,9,1.15,0,Math.PI*2);c.fill();c.restore();
    };
    Game.prototype.drawSeedSystem=function(c){
        if(this.seedDrop){
            var drop=this.seedDrop,dropSway=Math.sin(drop.age*4.2)*.18;
            this.drawSoftSeed(c,drop.x,drop.y,1,dropSway,1);
            c.save();c.globalAlpha=.24;c.strokeStyle=this.theme.accent;c.lineWidth=1.5;c.beginPath();c.moveTo(drop.x-7,drop.y-16);c.quadraticCurveTo(drop.x,drop.y-21,drop.x+7,drop.y-16);c.stroke();c.restore();
        }
        if(this.seedHeld){
            var heldY=this.paddle.y-48+Math.sin(this.elapsed*5)*2;
            this.drawSoftSeed(c,this.paddle.x,heldY,.9,Math.sin(this.elapsed*3)*.08,1);
        }
        for(var projectileIndex=0;projectileIndex<this.seedProjectiles.length;projectileIndex++){
            var projectile=this.seedProjectiles[projectileIndex],petalTurn=(projectile.petal-3)*.08+projectile.age*3.8;
            c.save();c.globalAlpha=.32;var trail=c.createLinearGradient(projectile.x,projectile.y,projectile.x-projectile.vx*.04,projectile.y+25);trail.addColorStop(0,this.theme.ballCore);trail.addColorStop(.45,'rgba(255,241,194,.34)');trail.addColorStop(1,'rgba(255,255,255,0)');c.strokeStyle=trail;c.lineWidth=2.8;c.lineCap='round';c.beginPath();c.moveTo(projectile.x,projectile.y+5);c.quadraticCurveTo(projectile.x-projectile.vx*.02,projectile.y+14,projectile.x-projectile.vx*.04,projectile.y+25);c.stroke();c.restore();
            c.save();c.translate(projectile.x,projectile.y);c.rotate(petalTurn);c.shadowColor='rgba(236,177,102,.42)';c.shadowBlur=9;
            var petalFill=c.createLinearGradient(-5,-7,5,7);petalFill.addColorStop(0,'#fffce9');petalFill.addColorStop(.48,'#f7ddb0');petalFill.addColorStop(1,'#e9a57e');c.fillStyle=petalFill;c.strokeStyle='rgba(190,117,89,.72)';c.lineWidth=1.1;
            c.beginPath();c.moveTo(0,-7);c.bezierCurveTo(5,-4,6,2,0,7);c.bezierCurveTo(-6,2,-5,-4,0,-7);c.closePath();c.fill();c.shadowColor='transparent';c.stroke();
            c.globalAlpha=.7;c.strokeStyle='rgba(255,255,247,.9)';c.beginPath();c.moveTo(-1,-4);c.quadraticCurveTo(1,0,0,4);c.stroke();c.restore();
        }
        for(var burstIndex=0;burstIndex<this.seedBursts.length;burstIndex++){
            var burst=this.seedBursts[burstIndex],progress=clamp(burst.age/burst.duration,0,1),fade=Math.pow(1-progress,2);
            c.save();c.translate(burst.x,burst.y);c.globalAlpha=fade*.85;c.fillStyle=this.theme.spark;
            for(var petal=0;petal<4;petal++){var angle=-Math.PI*.85+petal*Math.PI*.57,distance=4+progress*(12+petal*2);c.save();c.translate(Math.cos(angle)*distance,Math.sin(angle)*distance);c.rotate(angle);c.beginPath();c.ellipse(0,0,3.8-progress,1.9-progress*.45,0,0,Math.PI*2);c.fill();c.restore();}
            c.restore();
        }
    };
    Game.prototype.drawVitalityShell=function(c,x,y,scale,rotation,alpha){
        c.save();c.translate(x,y);c.rotate(rotation||0);c.scale(scale||1,scale||1);c.globalAlpha=alpha===undefined?1:alpha;
        var aura=c.createRadialGradient(0,1,1,0,1,21);aura.addColorStop(0,'rgba(255,224,151,.56)');aura.addColorStop(.52,'rgba(255,238,194,.24)');aura.addColorStop(1,'rgba(255,238,194,0)');c.fillStyle=aura;c.beginPath();c.arc(0,1,21,0,Math.PI*2);c.fill();
        c.shadowColor='rgba(223,145,95,.42)';c.shadowBlur=13;var shell=c.createLinearGradient(-10,-9,10,15);shell.addColorStop(0,'#fffdf0');shell.addColorStop(.58,'#fff0cf');shell.addColorStop(1,'#efb98f');c.fillStyle=shell;c.strokeStyle='#d98b6e';c.lineWidth=1.7;
        c.beginPath();c.moveTo(-13,-3);c.lineTo(-9,-8);c.lineTo(-4,-3);c.lineTo(1,-9);c.lineTo(6,-3);c.lineTo(11,-7);c.lineTo(14,-2);c.bezierCurveTo(13,10,7,16,0,17);c.bezierCurveTo(-8,16,-13,9,-13,-3);c.closePath();c.fill();c.shadowColor='transparent';c.stroke();
        var core=c.createRadialGradient(-2,0,0,0,1,9);core.addColorStop(0,'#fffbe7');core.addColorStop(.5,'#ffd985');core.addColorStop(1,'rgba(242,154,118,.22)');c.fillStyle=core;c.beginPath();c.ellipse(0,3,7.5,6.2,0,0,Math.PI*2);c.fill();
        c.globalAlpha=(alpha===undefined?1:alpha)*.72;c.fillStyle='#fff6ce';c.beginPath();c.arc(-7,-13,2,0,Math.PI*2);c.arc(7,-16,1.5,0,Math.PI*2);c.fill();c.restore();
    };
    Game.prototype.drawEarlyLife=function(c){
        if((this.level!==2&&this.level!==3)||!this.earlyLifeDrop)return;
        var drop=this.earlyLifeDrop,bob=Math.sin(drop.age*5.2)*.08;
        c.save();c.globalAlpha=.2;c.strokeStyle='#d9936f';c.lineWidth=1.3;c.beginPath();c.moveTo(drop.x,drop.y-19);c.quadraticCurveTo(drop.sourceX,drop.y-31,drop.sourceX,Math.max(drop.sourceY,drop.y-54));c.stroke();c.restore();
        this.drawVitalityShell(c,drop.x,drop.y,1,bob,1);
    };
    Game.prototype.drawStageFiveDrop=function(c,drop){
        var bob=Math.sin(drop.age*5.2)*.08;if(drop.type==='life'){this.drawVitalityShell(c,drop.x,drop.y,1,bob,1);return;}c.save();c.translate(drop.x,drop.y);c.rotate(bob);c.shadowBlur=13;c.shadowColor=drop.type==='slow'?'rgba(105,164,208,.4)':'rgba(220,171,63,.46)';
        if(drop.type==='slow'){
            c.fillStyle='rgba(221,245,255,.97)';c.beginPath();c.arc(-6,1,7,0,Math.PI*2);c.arc(0,-4,9,0,Math.PI*2);c.arc(7,1,7,0,Math.PI*2);c.ellipse(0,6,14,6.5,0,0,Math.PI*2);c.fill();c.shadowColor='transparent';
            c.strokeStyle='#65a9ce';c.lineWidth=1.8;c.lineCap='round';c.beginPath();c.moveTo(-9,2);c.quadraticCurveTo(0,-3,9,2);c.moveTo(-6,7);c.quadraticCurveTo(1,3,8,7);c.stroke();
        }else{
            c.fillStyle='rgba(255,247,204,.98)';c.beginPath();c.moveTo(0,-15);c.bezierCurveTo(11,-8,13,5,0,15);c.bezierCurveTo(-13,5,-11,-8,0,-15);c.closePath();c.fill();c.shadowColor='transparent';
            c.fillStyle='#d7a73e';for(var dot=0;dot<3;dot++){c.beginPath();c.arc((dot-1)*5,2+(dot%2)*2,2,0,Math.PI*2);c.fill();}
            c.strokeStyle='rgba(255,255,248,.95)';c.lineWidth=1.4;c.beginPath();c.arc(-2,-5,5,Math.PI*1.05,Math.PI*1.65);c.stroke();
        }
        c.restore();
    };
    Game.prototype.drawStageThreeSlow=function(c){
        if(this.level!==3)return;
        for(var gatherIndex=0;gatherIndex<this.stageThreeGatherEffects.length;gatherIndex++){
            var gather=this.stageThreeGatherEffects[gatherIndex],gatherProgress=clamp(gather.age/gather.duration,0,1),gatherFade=Math.pow(1-gatherProgress,2);
            c.save();c.translate(gather.x,gather.y);c.globalAlpha=gatherFade*.76;c.strokeStyle='#8fc3d7';c.lineWidth=2.4-gatherProgress;c.lineCap='round';
            for(var wisp=0;wisp<3;wisp++){var side=wisp-1,startX=side*(18+gatherProgress*5),startY=(wisp%2?1:-1)*(7+gatherProgress*3);c.beginPath();c.moveTo(startX,startY);c.quadraticCurveTo(side*8,-8+gatherProgress*4,side*2*(1-gatherProgress),0);c.stroke();}
            c.fillStyle='rgba(235,250,255,.9)';c.beginPath();c.ellipse(0,0,5+gatherProgress*4,3+gatherProgress*2,0,0,Math.PI*2);c.fill();c.restore();
        }
        if(this.stageThreeSlowDrop){
            var drop=this.stageThreeSlowDrop;c.save();c.globalAlpha=.22;c.strokeStyle='#75b5cf';c.lineWidth=1.3;c.beginPath();c.moveTo(drop.x,drop.y-19);c.quadraticCurveTo(drop.sourceX,drop.y-31,drop.sourceX,Math.max(drop.sourceY,drop.y-54));c.stroke();c.restore();this.drawStageFiveDrop(c,drop);
        }
        if(this.stageThreeSlowTime>0||this.stageThreeRecoverTime>0){
            var ball=this.ball,length=Math.hypot(ball.vx,ball.vy)||1,backX=-ball.vx/length,backY=-ball.vy/length,slowFade=this.stageThreeSlowTime>0?1:clamp(this.stageThreeRecoverTime/this.stageThreeRecoverDuration,0,1);
            c.save();c.globalAlpha=slowFade*.28;c.strokeStyle='#8ac4dc';c.lineWidth=3;c.lineCap='round';
            for(var ribbon=0;ribbon<2;ribbon++){var sideOffset=ribbon?5:-5;c.beginPath();c.moveTo(ball.x+backY*sideOffset,ball.y-backX*sideOffset);c.quadraticCurveTo(ball.x+backX*12+backY*sideOffset*.6,ball.y+backY*12-backX*sideOffset*.6,ball.x+backX*24,ball.y+backY*24);c.stroke();}c.restore();
        }
        for(var collectIndex=0;collectIndex<this.stageThreeCollectEffects.length;collectIndex++){
            var collect=this.stageThreeCollectEffects[collectIndex],collectProgress=clamp(collect.age/collect.duration,0,1),collectFade=Math.pow(1-collectProgress,2);
            c.save();c.translate(collect.x,collect.y-collectProgress*27);c.globalAlpha=collectFade;c.fillStyle='#4e91b6';c.font='800 19px system-ui,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('≈',0,0);c.restore();
        }
    };
    Game.prototype.drawStageFiveBuffDrop=function(c,drop){
        var arrival=clamp(drop.age/.18,0,1),scale=.68+.32*(arrival*arrival*(3-2*arrival)),sway=Math.sin(drop.age*4.7)*.1;
        c.save();c.translate(drop.x,drop.y);c.rotate(sway);c.scale(scale,scale);c.shadowColor='rgba(168,116,198,.48)';c.shadowBlur=15;
        var shell=c.createLinearGradient(-10,-13,10,14);shell.addColorStop(0,'rgba(248,239,255,.98)');shell.addColorStop(.55,'rgba(216,181,235,.98)');shell.addColorStop(1,'rgba(241,163,180,.96)');
        c.fillStyle=shell;c.beginPath();c.moveTo(0,-15);c.bezierCurveTo(10,-11,14,1,8,10);c.bezierCurveTo(4,16,-4,16,-8,10);c.bezierCurveTo(-14,1,-10,-11,0,-15);c.closePath();c.fill();
        c.shadowColor='transparent';c.strokeStyle='rgba(211,117,145,.82)';c.lineWidth=1.5;c.stroke();
        c.fillStyle='rgba(255,253,255,.92)';c.beginPath();c.ellipse(0,2,6.3,8.2,0,0,Math.PI*2);c.fill();
        var dots=[[-3,-1],[3,-1],[0,4]];for(var coreDot=0;coreDot<dots.length;coreDot++){c.fillStyle=coreDot===2?'#db8fa8':'#ad83ca';c.beginPath();c.arc(dots[coreDot][0],dots[coreDot][1],1.7,0,Math.PI*2);c.fill();}
        c.globalAlpha=.82;c.strokeStyle='rgba(255,255,255,.92)';c.lineWidth=1.2;c.beginPath();c.arc(-2,-5,4.5,Math.PI*1.08,Math.PI*1.62);c.stroke();c.restore();
    };
    Game.prototype.drawStageFiveItems=function(c){
        if(this.level!==5)return;
        for(var pathIndex=0;pathIndex<this.stageFiveClearPaths.length;pathIndex++){
            var path=this.stageFiveClearPaths[pathIndex],progress=clamp(path.age/path.duration,0,1),fade=Math.pow(1-progress,2);
            c.save();c.globalAlpha=fade*.72;c.strokeStyle='#ffe690';c.lineWidth=3-progress*1.4;c.lineCap='round';c.setLineDash([5,7]);c.lineDashOffset=-progress*26;
            for(var pointIndex=0;pointIndex<path.points.length;pointIndex++){
                var point=path.points[pointIndex];c.beginPath();c.moveTo(path.x,path.y);c.bezierCurveTo(path.x+(point.x-path.x)*.16,path.y-80-pointIndex*9,point.x,point.y+52,point.x,point.y);c.stroke();
            }
            c.restore();
        }
        if(this.stageFiveDrop){
            var drop=this.stageFiveDrop;c.save();c.globalAlpha=.22;c.strokeStyle=drop.type==='life'?'#d9936f':(drop.type==='slow'?'#65a9ce':'#d7a73e');c.lineWidth=1.3;c.beginPath();c.moveTo(drop.x,drop.y-19);c.quadraticCurveTo(drop.sourceX,drop.y-31,drop.sourceX,Math.max(drop.sourceY,drop.y-54));c.stroke();c.restore();this.drawStageFiveDrop(c,drop);
        }
        for(var buffDropIndex=0;buffDropIndex<this.stageFiveBuffDrops.length;buffDropIndex++){
            var buffDrop=this.stageFiveBuffDrops[buffDropIndex];c.save();c.globalAlpha=.24;c.fillStyle='#c59cda';
            for(var trailDot=0;trailDot<3;trailDot++){c.beginPath();c.arc(buffDrop.x+Math.sin(buffDrop.age*4+trailDot)*3,buffDrop.y-18-trailDot*7,2.2-trailDot*.45,0,Math.PI*2);c.fill();}c.restore();this.drawStageFiveBuffDrop(c,buffDrop);
        }
        for(var fxIndex=0;fxIndex<this.stageFiveCollectEffects.length;fxIndex++){
            var effect=this.stageFiveCollectEffects[fxIndex],effectProgress=clamp(effect.age/effect.duration,0,1),effectFade=Math.pow(1-effectProgress,2),label=effect.type==='life'?'+1':(effect.type==='slow'?'≈':'✦5');
            c.save();c.translate(effect.x,effect.y-effectProgress*28);c.globalAlpha=effectFade;c.fillStyle=effect.type==='life'?'#bd714f':(effect.type==='slow'?'#4d91b7':'#b8872d');c.font='800 19px system-ui,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(label,0,0);c.restore();
        }
        for(var buffFxIndex=0;buffFxIndex<this.stageFiveBuffCollectEffects.length;buffFxIndex++){
            var buffEffect=this.stageFiveBuffCollectEffects[buffFxIndex],buffProgress=clamp(buffEffect.age/buffEffect.duration,0,1),buffFade=Math.pow(1-buffProgress,2);
            c.save();c.translate(buffEffect.x,buffEffect.y-buffProgress*18);c.globalAlpha=buffFade*.82;
            for(var mote=0;mote<3;mote++){var angle=-Math.PI*.75+mote*Math.PI*.75+buffProgress*.9,distance=6+buffProgress*(13+mote*2);c.save();c.translate(Math.cos(angle)*distance,Math.sin(angle)*distance);c.rotate(angle);c.fillStyle=mote===1?'#ee9fb2':'#bd91d3';c.beginPath();c.ellipse(0,0,3.7-buffProgress,2-buffProgress*.45,0,0,Math.PI*2);c.fill();c.restore();}
            c.restore();
        }
    };
    Game.prototype.drawStageSixItems=function(c){
        if(this.level!==6)return;
        for(var dropIndex=0;dropIndex<this.stageSixDrops.length;dropIndex++){
            var drop=this.stageSixDrops[dropIndex];c.save();c.globalAlpha=.22;c.strokeStyle=drop.type==='life'?'#d9936f':'#b58acb';c.lineWidth=1.3;c.beginPath();c.moveTo(drop.x,drop.y-19);c.quadraticCurveTo(drop.sourceX,drop.y-31,drop.sourceX,Math.max(drop.sourceY,drop.y-54));c.stroke();c.restore();
            if(drop.type==='life')this.drawStageFiveDrop(c,drop);else{
                c.save();c.globalAlpha=.24;c.fillStyle='#c59cda';for(var trailDot=0;trailDot<3;trailDot++){c.beginPath();c.arc(drop.x+Math.sin(drop.age*4+trailDot)*3,drop.y-18-trailDot*7,2.2-trailDot*.45,0,Math.PI*2);c.fill();}c.restore();this.drawStageFiveBuffDrop(c,drop);
            }
        }
        for(var splitIndex=0;splitIndex<this.stageSixSplitEffects.length;splitIndex++){
            var split=this.stageSixSplitEffects[splitIndex],splitProgress=clamp(split.age/split.duration,0,1),splitFade=Math.pow(1-splitProgress,2);
            c.save();c.translate(split.x,split.y);c.globalAlpha=splitFade*.82;c.strokeStyle='#d8b5e7';c.lineWidth=3-splitProgress*1.5;c.lineCap='round';c.beginPath();c.moveTo(-3,0);c.bezierCurveTo(-13,-9-splitProgress*5,-18-splitProgress*10,-2, -25-splitProgress*8,4);c.moveTo(3,0);c.bezierCurveTo(13,9+splitProgress*4,18+splitProgress*10,2,25+splitProgress*8,-4);c.stroke();
            c.fillStyle='#f0a9ba';for(var mote=0;mote<4;mote++){var angle=-Math.PI*.75+mote*Math.PI*.5,distance=5+splitProgress*(10+mote*2);c.beginPath();c.arc(Math.cos(angle)*distance,Math.sin(angle)*distance,2.8-splitProgress,0,Math.PI*2);c.fill();}c.restore();
        }
        for(var dissolveIndex=0;dissolveIndex<this.stageSixDissolveEffects.length;dissolveIndex++){
            var dissolve=this.stageSixDissolveEffects[dissolveIndex],dissolveProgress=clamp(dissolve.age/dissolve.duration,0,1),dissolveFade=Math.pow(1-dissolveProgress,2);
            c.save();c.translate(dissolve.x,dissolve.y);c.globalAlpha=dissolveFade*.72;for(var glowDot=0;glowDot<5;glowDot++){var glowAngle=-Math.PI*.9+glowDot*Math.PI*.45,glowDistance=3+dissolveProgress*(9+glowDot*1.5);c.fillStyle=glowDot%2?'#efb0c0':'#cfafe0';c.beginPath();c.arc(Math.cos(glowAngle)*glowDistance,Math.sin(glowAngle)*glowDistance,2.6-dissolveProgress*.9,0,Math.PI*2);c.fill();}c.restore();
        }
        for(var collectIndex=0;collectIndex<this.stageSixCollectEffects.length;collectIndex++){
            var collect=this.stageSixCollectEffects[collectIndex],collectProgress=clamp(collect.age/collect.duration,0,1),collectFade=Math.pow(1-collectProgress,2);
            c.save();c.translate(collect.x,collect.y-collectProgress*26);c.globalAlpha=collectFade;c.fillStyle=collect.type==='life'?'#bd714f':'#9169aa';c.font='800 18px system-ui,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(collect.type==='life'?'+1':'••',0,0);c.restore();
        }
    };
    Game.prototype.drawItemNotices=function(c){
        for(var hintIndex=0;hintIndex<this.itemHints.length;hintIndex++){
            var hint=this.itemHints[hintIndex],copy=this.itemGuideText[hint.type],colors=ITEM_NOTICE_COLORS[hint.type]||ITEM_NOTICE_COLORS.seed,target=hint.target||hint;
            var hintFade=Math.min(1,hint.age/.14,(hint.duration-hint.age)/.28),extent=target.r||((target.h||24)*.5),x=target.x===undefined?hint.x:target.x,y=(target.y===undefined?hint.y:target.y)-extent-18;
            c.save();c.font='900 11px system-ui,sans-serif';var width=Math.max(64,c.measureText(copy.name).width+24);x=clamp(x,width*.5+20,W-width*.5-20);c.globalAlpha=clamp(hintFade,0,1);c.shadowColor='rgba(48,79,72,.18)';c.shadowBlur=10;this.roundRect(c,x-width*.5,y-13,width,25,11,colors.soft,'rgba(255,255,255,.9)');c.shadowColor='transparent';c.fillStyle=colors.ink;c.textAlign='center';c.textBaseline='middle';c.fillText(copy.name,x,y);c.restore();
        }
        for(var resultIndex=0;resultIndex<this.itemResultEffects.length;resultIndex++){
            var result=this.itemResultEffects[resultIndex],resultCopy=this.itemGuideText[result.type],resultColors=ITEM_NOTICE_COLORS[result.type]||ITEM_NOTICE_COLORS.seed,resultProgress=clamp(result.age/result.duration,0,1),resultFade=Math.pow(1-resultProgress,2);
            c.save();c.font='900 12px system-ui,sans-serif';var resultWidth=Math.max(72,c.measureText(resultCopy.result).width+28),resultY=result.y-resultProgress*24,resultX=clamp(result.x,resultWidth*.5+20,W-resultWidth*.5-20);c.globalAlpha=resultFade;c.shadowColor='rgba(48,79,72,.18)';c.shadowBlur=9;this.roundRect(c,resultX-resultWidth*.5,resultY-14,resultWidth,28,12,'rgba(255,255,255,.92)',resultColors.soft);c.shadowColor='transparent';c.fillStyle=resultColors.ink;c.textAlign='center';c.textBaseline='middle';c.fillText(resultCopy.result,resultX,resultY);c.restore();
        }
    };
    Game.prototype.drawHazard=function(c){
        var hazard=this.hazard;if(!hazard)return;
        var warning=hazard.state==='warning',hit=hazard.state==='hit';
        var progress=warning?clamp(hazard.age/hazard.warningDuration,0,1):(hit?clamp(hazard.age/hazard.hitDuration,0,1):0);
        var scale=warning?.58+Math.sin(progress*Math.PI)*.12:1,alpha=warning?.24+progress*.5:(hit?1-progress:1),wobble=warning?0:Math.sin(hazard.age*5.4)*.075;
        c.save();c.translate(hazard.x,hazard.y);c.rotate(wobble);c.scale(scale*(hit?1+progress*.38:1),scale*(hit?1-progress*.52:1));c.globalAlpha=alpha;
        if(!warning){var groundGlow=c.createRadialGradient(0,12,2,0,12,24);groundGlow.addColorStop(0,'rgba(42,71,74,.28)');groundGlow.addColorStop(1,'rgba(42,71,74,0)');c.fillStyle=groundGlow;c.beginPath();c.ellipse(0,12,24,14,0,0,Math.PI*2);c.fill();}
        c.shadowColor='rgba(31,57,61,.34)';c.shadowBlur=12;c.shadowOffsetY=5;
        var outer=c.createLinearGradient(-15,-15,15,19);outer.addColorStop(0,'#66827d');outer.addColorStop(.48,'#405f60');outer.addColorStop(1,'#2d494e');c.fillStyle=outer;c.strokeStyle='rgba(34,70,70,.82)';c.lineWidth=1.7;
        c.beginPath();c.moveTo(-3,-17);c.bezierCurveTo(7,-18,13,-12,12,-5);c.bezierCurveTo(19,1,16,13,7,18);c.bezierCurveTo(-3,23,-15,17,-17,8);c.bezierCurveTo(-20,-1,-13,-12,-3,-17);c.closePath();c.fill();c.shadowColor='transparent';c.stroke();
        var plateColors=['#78948b','#58756f','#496864'],plateData=[[-8,-4,8,11,-.45],[5,-6,8,12,.32],[-1,8,11,8,.04]];
        for(var plate=0;plate<plateData.length;plate++){var data=plateData[plate];c.save();c.translate(data[0],data[1]);c.rotate(data[4]);var plateFill=c.createLinearGradient(-data[2],-data[3],data[2],data[3]);plateFill.addColorStop(0,'rgba(171,195,180,.78)');plateFill.addColorStop(.45,plateColors[plate]);plateFill.addColorStop(1,'rgba(45,73,75,.9)');c.fillStyle=plateFill;c.strokeStyle='rgba(190,218,201,.28)';c.lineWidth=1.1;c.beginPath();c.ellipse(0,0,data[2],data[3],0,0,Math.PI*2);c.fill();c.stroke();c.restore();}
        c.strokeStyle='rgba(215,231,214,.34)';c.lineWidth=1.2;c.lineCap='round';c.beginPath();c.moveTo(-10,-6);c.quadraticCurveTo(-3,-2,1,6);c.moveTo(8,-8);c.quadraticCurveTo(3,-1,2,10);c.stroke();
        var slit=c.createLinearGradient(-6,0,7,0);slit.addColorStop(0,'rgba(193,99,89,.34)');slit.addColorStop(.5,'#db8173');slit.addColorStop(1,'rgba(193,99,89,.3)');c.fillStyle=slit;c.beginPath();c.ellipse(1,3,5.5,1.8,-.12,0,Math.PI*2);c.fill();
        c.globalAlpha=alpha*.48;c.fillStyle='#c7d7c7';[[-9,7],[-2,-10],[9,9]].forEach(function(dot){c.beginPath();c.arc(dot[0],dot[1],1.15,0,Math.PI*2);c.fill();});
        if(hit){
            c.globalAlpha=(1-progress)*.72;
            for(var mote=0;mote<3;mote++){var side=mote-1,distance=7+progress*(10+Math.abs(side)*5);c.save();c.translate(side*distance,-2+Math.abs(side)*5+progress*7);c.rotate(side*(.4+progress));c.fillStyle=mote===1?'#d17d70':'#66847c';c.beginPath();c.ellipse(0,0,4-progress,2.4-progress*.6,0,0,Math.PI*2);c.fill();c.restore();}
        }
        c.restore();
    };
    Game.prototype.render=function(){
        var presentationChanges=this.applyPresentationCoordinates();
        try{
        var c=this.ctx2d,renderH=this.presentationHeight||H;c.clearRect(0,0,W,renderH);
        var bg=c.createLinearGradient(0,0,0,renderH);bg.addColorStop(0,this.stageSky[0]);bg.addColorStop(0.58,this.stageSky[1]);bg.addColorStop(1,this.stageSky[2]);c.fillStyle=bg;c.fillRect(0,0,W,renderH);
        c.globalAlpha=.45;c.fillStyle='#fff';for(var i=0;i<7;i++){c.beginPath();c.arc(82+i*142,this.presentationY(60+(i%3)*238),16+(i%2)*9,0,Math.PI*2);c.fill();}c.globalAlpha=1;
        this.drawWorldBackdrop(c);this.drawThemeBackdrop(c);
        this.roundRect(c,18,18,W-36,renderH-36,38,'rgba(255,255,255,.24)','rgba(255,255,255,.72)');
        for(var j=0;j<this.bricks.length;j++){
            var br=this.bricks[j];if(!br.alive)continue;
            c.save();
            if(br.shellPulseAge>=0&&br.shellPulseAge<br.shellPulseDuration){
                var shellPulse=Math.sin(clamp(br.shellPulseAge/br.shellPulseDuration,0,1)*Math.PI),shellCenterX=br.x+br.w*.5,shellCenterY=br.y+br.h*.5;
                c.translate(shellCenterX,shellCenterY);c.scale(1+shellPulse*.035,1-shellPulse*.1);c.translate(-shellCenterX,-shellCenterY);
            }
            c.shadowColor='rgba(35,92,76,.18)';c.shadowBlur=12;c.shadowOffsetY=5;
            if((this.level===2||this.level===5)&&br.motionGroup!=='fixed'){
                var swayDirection=(br.motionGroup==='left'?1:-1)*this.brickMotionDirection;
                c.shadowOffsetX=-swayDirection*3;
                c.shadowColor='rgba(52,112,98,.24)';
            }
            this.roundRect(c,br.x,br.y,br.w,br.h,11,br.color);c.shadowColor='transparent';
            var shine=c.createLinearGradient(br.x,br.y,br.x,br.y+br.h);shine.addColorStop(0,'rgba(255,255,255,.5)');shine.addColorStop(.56,'rgba(255,255,255,.06)');shine.addColorStop(1,'rgba(37,80,69,.08)');this.roundRect(c,br.x+2,br.y+2,br.w-4,br.h-4,9,shine);this.drawBrickSurface(c,br);
            if(br.buffCarrier||br.multiCarrier){
                if(br.hitsRemaining===3){
                    c.globalAlpha=.82;c.strokeStyle='rgba(177,132,203,.92)';c.lineWidth=2.2;c.beginPath();c.roundRect(br.x+4,br.y+4,br.w-8,br.h-8,8);c.stroke();
                    c.globalAlpha=.42;c.strokeStyle='rgba(238,149,166,.86)';c.lineWidth=1.3;c.beginPath();c.roundRect(br.x+8,br.y+7,br.w-16,br.h-14,5);c.stroke();
                }else if(br.hitsRemaining===2){
                    c.globalAlpha=.75;c.strokeStyle='rgba(177,132,203,.9)';c.lineWidth=2;c.beginPath();c.roundRect(br.x+5,br.y+5,br.w-10,br.h-10,7);c.stroke();
                }else{
                    c.globalAlpha=.5;this.roundRect(c,br.x+2,br.y+2,br.w-4,br.h-4,9,'rgba(251,241,255,.92)');
                    c.globalAlpha=.76;c.strokeStyle='rgba(126,83,147,.76)';c.lineWidth=2.1;c.lineCap='round';c.beginPath();c.moveTo(br.x+br.w*.5-2,br.y+4);c.quadraticCurveTo(br.x+br.w*.5+5,br.y+10,br.x+br.w*.5-1,br.y+16);c.quadraticCurveTo(br.x+br.w*.5-6,br.y+21,br.x+br.w*.5+2,br.y+br.h-4);c.stroke();
                }
                c.globalAlpha=.9;c.fillStyle='rgba(255,250,255,.96)';
                for(var budDot=0;budDot<br.hitsRemaining;budDot++){var dotX=br.x+br.w*.5+(budDot-(br.hitsRemaining-1)*.5)*10;c.beginPath();c.arc(dotX,br.y+br.h*.5,2.8,0,Math.PI*2);c.fill();}
            }else if(br.reinforced&&br.hitsRemaining===2){
                c.globalAlpha=.9;c.strokeStyle='rgba(255,255,244,.9)';c.lineWidth=2.1;c.beginPath();c.roundRect(br.x+5,br.y+5,br.w-10,br.h-10,7);c.stroke();
                c.globalAlpha=.35;c.strokeStyle='rgba(45,77,67,.75)';c.lineWidth=1.3;c.beginPath();c.roundRect(br.x+8,br.y+8,br.w-16,br.h-16,5);c.stroke();
            }else if(br.reinforced&&br.hitsRemaining===1){
                c.globalAlpha=.5;this.roundRect(c,br.x+2,br.y+2,br.w-4,br.h-4,9,'rgba(255,251,231,.92)');
                c.globalAlpha=.78;c.strokeStyle='rgba(57,79,70,.72)';c.lineWidth=2.2;c.lineCap='round';c.lineJoin='round';c.beginPath();
                c.moveTo(br.x+br.w*.5-2,br.y+4);c.quadraticCurveTo(br.x+br.w*.5+5,br.y+9,br.x+br.w*.5-1,br.y+14);c.quadraticCurveTo(br.x+br.w*.5-7,br.y+19,br.x+br.w*.5+2,br.y+br.h-4);
                c.moveTo(br.x+br.w*.5,br.y+14);c.lineTo(br.x+br.w*.5+8,br.y+10);c.stroke();
                c.globalAlpha=.46;c.strokeStyle='rgba(255,255,249,.9)';c.lineWidth=1.5;c.beginPath();c.roundRect(br.x+5,br.y+5,br.w-10,br.h-10,7);c.stroke();
            }
            c.restore();
            if(br.shellPulseAge>=0&&br.shellPulseAge<br.shellPulseDuration){
                var shellFlashProgress=clamp(br.shellPulseAge/br.shellPulseDuration,0,1),shellFlash=c.createRadialGradient(br.shellImpactX,br.shellImpactY,0,br.shellImpactX,br.shellImpactY,18);
                shellFlash.addColorStop(0,'rgba(255,255,239,.95)');shellFlash.addColorStop(1,'rgba(255,255,239,0)');c.save();c.globalAlpha=Math.pow(1-shellFlashProgress,2);c.fillStyle=shellFlash;c.beginPath();c.arc(br.shellImpactX,br.shellImpactY,18,0,Math.PI*2);c.fill();c.restore();
            }
        }
        this.drawHazard(c);this.drawEarlyLife(c);this.drawSeedSystem(c);this.drawStageThreeSlow(c);this.drawStageFiveItems(c);this.drawStageSixItems(c);this.drawItemNotices(c);
        for(var f=0;f<this.hitEffects.length;f++){
            var effect=this.hitEffects[f],progress=clamp(effect.age/effect.duration,0,1),shrink=clamp((progress-.18)/.82,0,1),fade=(1-shrink)*(1-shrink),scale=1-shrink*.58;
            var dentPhase=clamp(progress/.28,0,1),dent=Math.sin(dentPhase*Math.PI),scaleX=scale,scaleY=scale;
            if(effect.axis==='x'){scaleX*=1-dent*.11;scaleY*=1+dent*.04;}else{scaleX*=1+dent*.04;scaleY*=1-dent*.13;}
            var centerX=effect.x+effect.w*.5,centerY=effect.y+effect.h*.5;
            c.save();c.globalAlpha=fade;c.translate(centerX-effect.normalX*dent*2.4,centerY-effect.normalY*dent*2.4);c.scale(scaleX,scaleY);c.shadowColor='rgba(255,255,230,.55)';c.shadowBlur=10;
            this.roundRect(c,-effect.w*.5,-effect.h*.5,effect.w,effect.h,11,effect.color);c.shadowColor='transparent';
            var effectShine=c.createLinearGradient(0,-effect.h*.5,0,effect.h*.5);effectShine.addColorStop(0,'rgba(255,255,255,.5)');effectShine.addColorStop(.56,'rgba(255,255,255,.06)');effectShine.addColorStop(1,'rgba(37,80,69,.08)');
            this.roundRect(c,-effect.w*.5+2,-effect.h*.5+2,effect.w-4,effect.h-4,9,effectShine);
            this.drawBrickSurface(c,{x:-effect.w*.5,y:-effect.h*.5,w:effect.w,h:effect.h,row:effect.row,col:effect.col});c.restore();
            var touchFade=Math.max(0,1-progress/.46);
            c.save();c.globalAlpha=touchFade*.72;c.translate(effect.impactX,effect.impactY);c.scale(effect.axis==='x'?.45:1,effect.axis==='y'?.45:1);
            var touchGlow=c.createRadialGradient(0,0,0,0,0,13);touchGlow.addColorStop(0,'rgba(255,255,246,.95)');touchGlow.addColorStop(1,'rgba(255,255,246,0)');c.fillStyle=touchGlow;c.beginPath();c.arc(0,0,13,0,Math.PI*2);c.fill();c.restore();
            c.save();c.globalAlpha=fade*.82;
            for(var sp=0;sp<effect.sparks.length;sp++){
                var spark=effect.sparks[sp],sparkAge=Math.max(0,effect.age-.018),distance=spark.speed*sparkAge;c.fillStyle=spark.color;
                c.beginPath();c.arc(effect.impactX+Math.cos(spark.angle)*distance,effect.impactY+Math.sin(spark.angle)*distance,spark.radius*(1-progress*.45),0,Math.PI*2);c.fill();
            }
            c.restore();
        }
        if(this.padFeedback.active){
            var padProgress=clamp(this.padFeedback.age/this.padFeedback.duration,0,1),padFade=Math.pow(1-padProgress,2);
            var residueProgress=clamp(this.padFeedback.age/.13,0,1),residueFade=Math.pow(1-residueProgress,2),residueDirection=this.padFeedback.offset||0;
            if(residueProgress<1){
                c.save();c.translate(this.padFeedback.contactX,this.padFeedback.contactY-1);c.globalAlpha=residueFade*.62;
                var residueGlow=c.createRadialGradient(0,0,0,0,0,10+residueProgress*5);residueGlow.addColorStop(0,'rgba(255,255,246,.9)');residueGlow.addColorStop(.5,this.theme.ballCore);residueGlow.addColorStop(1,'rgba(255,255,246,0)');
                c.fillStyle=residueGlow;c.beginPath();c.arc(0,0,10+residueProgress*5,0,Math.PI*2);c.fill();
                c.globalAlpha=residueFade*.72;
                for(var residueIndex=0;residueIndex<3;residueIndex++){
                    var residueSide=residueIndex-1,residueX=residueSide*(3.5+residueProgress*5)+residueDirection*residueProgress*2,residueY=-2-residueProgress*(5+Math.abs(residueSide)*2);
                    c.fillStyle=residueIndex===1?this.theme.spark:this.theme.ballCore;c.beginPath();c.arc(residueX,residueY,1.9-residueProgress*.65,0,Math.PI*2);c.fill();
                }
                c.restore();
            }
            c.save();c.translate(this.padFeedback.contactX,this.padFeedback.contactY+1);c.lineCap='round';c.lineJoin='round';
            if(this.padFeedback.kind==='petalArc'){
                c.globalAlpha=padFade*.82;c.strokeStyle=this.theme.ballCore;c.lineWidth=3-padProgress;
                c.beginPath();c.moveTo(-22-padProgress*5,3);c.quadraticCurveTo(0,-11-padProgress*5,22+padProgress*5,3);c.stroke();
                c.globalAlpha=padFade*.66;c.fillStyle=this.theme.spark;
                for(var pa=0;pa<2;pa++){var side=pa?1:-1;c.save();c.translate(side*(11+padProgress*12),-4-padProgress*7);c.rotate(side*(.5+padProgress));c.beginPath();c.ellipse(0,0,4.2*(1-padProgress*.25),2.1*(1-padProgress*.25),0,0,Math.PI*2);c.fill();c.restore();}
            }else if(this.padFeedback.kind==='berryDots'){
                c.globalAlpha=padFade*.9;
                for(var bd=0;bd<3;bd++){var angle=-Math.PI*.76+bd*Math.PI*.26,distance=5+padProgress*(15+bd*3);c.fillStyle=bd===1?this.theme.spark:this.theme.ballCore;c.beginPath();c.arc(Math.cos(angle)*distance,Math.sin(angle)*distance,3.7-padProgress*1.5,0,Math.PI*2);c.fill();}
            }else if(this.padFeedback.kind==='grainLift'){
                c.globalAlpha=padFade*.88;c.strokeStyle=this.theme.ballCore;c.lineWidth=3.4-padProgress*1.4;
                c.beginPath();c.moveTo(0,5);c.quadraticCurveTo(this.padFeedback.offset*5,-7,0,-20-padProgress*13);c.stroke();
                c.fillStyle=this.theme.spark;for(var gr=0;gr<2;gr++){var gy=-7-padProgress*(10+gr*5),gx=(gr?1:-1)*(5+padProgress*4);c.save();c.translate(gx,gy);c.rotate((gr?1:-1)*.68);c.beginPath();c.ellipse(0,0,4.7-padProgress,2.1-padProgress*.4,0,0,Math.PI*2);c.fill();c.restore();}
            }else if(this.padFeedback.kind==='leafFlick'){
                c.globalAlpha=padFade*.84;c.strokeStyle=this.theme.ballCore;c.lineWidth=2.8-padProgress;
                for(var lf=0;lf<2;lf++){var leafSide=lf?1:-1;c.beginPath();c.moveTo(0,3);c.quadraticCurveTo(leafSide*(9+padProgress*8),-4-padProgress*6,leafSide*(18+padProgress*10),-12-padProgress*5);c.stroke();c.save();c.translate(leafSide*(12+padProgress*10),-7-padProgress*8);c.rotate(leafSide*(.7+padProgress*.5));c.fillStyle=this.theme.spark;c.beginPath();c.ellipse(0,0,4.6-padProgress,2.2-padProgress*.4,0,0,Math.PI*2);c.fill();c.restore();}
            }else if(this.padFeedback.kind==='crystalGlint'){
                c.globalAlpha=padFade*.94;c.strokeStyle=this.theme.ballCore;c.lineWidth=2.6-padProgress*.8;
                var glint=12+padProgress*11;c.beginPath();c.moveTo(0,-glint);c.lineTo(0,glint*.45);c.moveTo(-glint*.62,-glint*.3);c.lineTo(glint*.62,-glint*.3);c.stroke();
                c.globalAlpha=padFade*.72;c.fillStyle=this.theme.spark;c.beginPath();c.moveTo(0,-9-padProgress*5);c.lineTo(5+padProgress*2,-3);c.lineTo(0,3+padProgress*2);c.lineTo(-5-padProgress*2,-3);c.closePath();c.fill();
            }else if(this.padFeedback.kind==='mistRibbon'){
                c.globalAlpha=padFade*.68;c.strokeStyle=this.theme.ballCore;c.lineWidth=4-padProgress*1.8;
                for(var mr=0;mr<2;mr++){var mistSide=mr?1:-1;c.beginPath();c.moveTo(mistSide*3,3-mr*3);c.bezierCurveTo(mistSide*(10+padProgress*7),-6,mistSide*(18+padProgress*13),-5-padProgress*9,mistSide*(25+padProgress*14),-14-padProgress*6);c.stroke();}
            }else if(this.padFeedback.kind==='orchardDouble'){
                for(var od=0;od<2;od++){var local=clamp(padProgress*1.55-od*.36,0,1),orchardFade=(1-local)*(od?padFade*.72:padFade*.9);c.globalAlpha=orchardFade;c.fillStyle=od?this.theme.spark:this.theme.ballCore;c.beginPath();c.arc((od?1:-1)*(7+local*9),-4-local*(12+od*5),5-local*1.8,0,Math.PI*2);c.fill();}
            }else if(this.padFeedback.kind==='emberSlash'){
                c.globalAlpha=padFade*.9;c.strokeStyle=this.theme.ballCore;c.lineWidth=3.2-padProgress*1.2;
                for(var es=0;es<3;es++){var emberX=(es-1)*8+this.padFeedback.offset*3,emberRise=11+es*4+padProgress*(10+es*3);c.beginPath();c.moveTo(emberX+(es-1)*2,3);c.lineTo(emberX-(es-1)*3,-emberRise);c.stroke();}
            }else{
                c.globalAlpha=padFade*.82;c.scale(1+padProgress*.24,.46+padProgress*.18);
                var padGlow=c.createRadialGradient(0,0,1,0,0,23);padGlow.addColorStop(0,'rgba(255,255,244,.96)');padGlow.addColorStop(.48,'rgba(255,246,220,.58)');padGlow.addColorStop(1,'rgba(255,255,244,0)');
                c.fillStyle=padGlow;c.beginPath();c.arc(0,0,23,0,Math.PI*2);c.fill();
            }
            c.restore();
        }
        var p=this.paddle;
        if(this.vitalitySpeedActive&&Math.abs(p.vx)>40){
            var travelSide=p.vx>0?-1:1,travelFade=clamp(Math.abs(p.vx)/p.fastSpeed,.22,1);
            c.save();c.translate(p.x+travelSide*32,p.y+8);c.globalAlpha=travelFade*.42;c.strokeStyle='#f2c47e';c.lineCap='round';
            for(var speedWisp=0;speedWisp<3;speedWisp++){var wispY=(speedWisp-1)*7,wispLength=14+speedWisp*6;c.lineWidth=2.8-speedWisp*.5;c.beginPath();c.moveTo(0,wispY);c.quadraticCurveTo(travelSide*wispLength*.45,wispY-3,travelSide*wispLength,wispY+1);c.stroke();}
            c.globalAlpha=travelFade*.58;c.fillStyle='#fff0bd';for(var shellMote=0;shellMote<2;shellMote++){c.save();c.translate(travelSide*(13+shellMote*10),-7+shellMote*13);c.rotate(travelSide*(.45+shellMote*.3));c.beginPath();c.ellipse(0,0,3.4,1.8,0,0,Math.PI*2);c.fill();c.restore();}c.restore();
        }
        var b=this.ball;
        for(var companionBallIndex=0;companionBallIndex<this.companionBalls.length;companionBallIndex++)this.drawBall(c,this.companionBalls[companionBallIndex],true);
        this.drawBall(c,b,false);
        var visualBall=b;
        for(var visualBallIndex=0;visualBallIndex<this.companionBalls.length;visualBallIndex++){var candidateBall=this.companionBalls[visualBallIndex];if(candidateBall.vy>0&&(visualBall.vy<=0||candidateBall.y>visualBall.y))visualBall=candidateBall;}
        if(this.characterView)this.characterView.render(p.x,p.y,p.vx||0,this.frameDt||.016,{x:visualBall.x,y:visualBall.y,vy:visualBall.vy,paddleWidth:p.w});
        this.updateHud();
        }finally{this.restorePresentationCoordinates(presentationChanges);}
    };

    Game.prototype.loop=function(now){
        if(!this.running)return;var dt=Math.min(.04,Math.max(0,(now-this.last)/1000||.016));this.last=now;
        this.frameDt=dt;this.update(dt);this.render();var self=this;this.raf=requestAnimationFrame(function(t){self.loop(t);});
    };

    Game.prototype.destroy=function(){
        this.running=false;if(this.raf)cancelAnimationFrame(this.raf);
        if(this.missTimer){clearTimeout(this.missTimer);this.missTimer=0;}
        this.clearIntroTimer();
        this.state='destroyed';this.syncTouchControlMode(true);
        window.removeEventListener('keydown',this.boundKeyDown,true);window.removeEventListener('keyup',this.boundKeyUp,true);window.removeEventListener('resize',this.boundPresentationResize);window.removeEventListener('orientationchange',this.boundPresentationResize);
        this.canvas.removeEventListener('pointerdown',this.boundPointer);this.canvas.removeEventListener('pointermove',this.boundPointer);this.canvas.removeEventListener('pointerup',this.boundPointer);this.canvas.removeEventListener('pointercancel',this.boundPointer);this.root.removeEventListener('click',this.boundClick);
        if(this.localJoystick){this.localJoystick.removeEventListener('pointerdown',this.boundLocalJoystick);this.localJoystick.removeEventListener('pointermove',this.boundLocalJoystick);this.localJoystick.removeEventListener('pointerup',this.boundLocalJoystick);this.localJoystick.removeEventListener('pointercancel',this.boundLocalJoystick);}
        if(this.localPunch){this.localPunch.removeEventListener('pointerdown',this.boundLocalPunch);this.localPunch.removeEventListener('pointerup',this.boundLocalPunch);this.localPunch.removeEventListener('pointercancel',this.boundLocalPunch);}
        this.stopBgm(true);if(this.bgmAudio){this.bgmAudio.removeAttribute('src');this.bgmAudio.load();this.bgmAudio=null;}
        if(this.characterView)this.characterView.destroy();
        if(this.audioCtx&&this.audioCtx.state!=='closed'&&this.audioCtx.close)this.audioCtx.close().catch(function(){});
        if(this.root.parentNode)this.root.parentNode.removeChild(this.root);
    };

    window.DanboBrickBreaker={create:function(options){return new Game(options);}};
})();
