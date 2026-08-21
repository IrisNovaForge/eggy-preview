(function(){
    'use strict';

    var W=960,H=720,STARTING_LIVES=3;
    var LEVEL_BALL_SPEEDS={1:370,2:400,3:440,4:500,5:540};
    var STAGE_FIVE_COPY={
        zhs:{speed:'球速',buff:'柔辉芽核',basic:'第五关 · 回芽星巢 · 生命、慢风与星路芽'},
        zht:{speed:'球速',buff:'柔輝芽核',basic:'第五關 · 回芽星巢 · 生命、慢風與星路芽'},
        ja:{speed:'速度',buff:'柔光の芽核',basic:'ステージ5 · 芽の星巣 · ライフ、そよ風、星の芽'},
        en:{speed:'Speed',buff:'Softglow Bud Core',basic:'Stage 5 · Bud Star Nest · Life, slow breeze and star-path buds'}
    };
    var ITEM_GUIDE_COPY={
        zhs:{title:'本关物件',hazard:{name:'危险坠物',desc:'碰到损失1颗光球',prompt:'注意避开 · 碰到损失1颗光球',result:'光球 −1'},seed:{name:'软壳光籽',desc:'接住后可抛出清砖，最多6次',prompt:'接住后可以抛出清砖',result:'光籽已接住'},life:{name:'暖壳芽',desc:'光球＋1',prompt:'接到后光球＋1',result:'光球＋1'},slow:{name:'慢风绒',desc:'暂时降低球速',prompt:'接到后暂时降低球速',result:'慢风生效'},clear:{name:'星路芽',desc:'清理最多5块砖',prompt:'接到后清理最多5块砖',result:'清理5块'},buff:{name:'柔辉芽核',desc:'三击砖掉落，当前仅收集',prompt:'三击砖掉落 · 当前只收集',result:'柔辉已收集'}},
        zht:{title:'本關物件',hazard:{name:'危險墜物',desc:'碰到損失1顆光球',prompt:'注意避開 · 碰到損失1顆光球',result:'光球 −1'},seed:{name:'軟殼光籽',desc:'接住後可拋出清磚，最多6次',prompt:'接住後可以拋出清磚',result:'光籽已接住'},life:{name:'暖殼芽',desc:'光球＋1',prompt:'接到後光球＋1',result:'光球＋1'},slow:{name:'慢風絨',desc:'暫時降低球速',prompt:'接到後暫時降低球速',result:'慢風生效'},clear:{name:'星路芽',desc:'清理最多5塊磚',prompt:'接到後清理最多5塊磚',result:'清理5塊'},buff:{name:'柔輝芽核',desc:'三擊磚掉落，目前僅收集',prompt:'三擊磚掉落 · 目前只收集',result:'柔輝已收集'}},
        ja:{title:'このステージのアイテム',hazard:{name:'危険な落下物',desc:'触れるとボールを1つ失う',prompt:'よけよう · 触れるとボールを1つ失う',result:'ボール −1'},seed:{name:'やわ殻の光種',desc:'受け取って投げる・最大6回',prompt:'受け取るとブロックへ投げられる',result:'光種を受け取った'},life:{name:'ぬく殻の芽',desc:'ボール＋1',prompt:'受け取るとボール＋1',result:'ボール＋1'},slow:{name:'そよ風の綿',desc:'一時的に速度を下げる',prompt:'受け取ると一時的に速度が下がる',result:'そよ風が発動'},clear:{name:'星路の芽',desc:'最大5個のブロックを消す',prompt:'受け取ると最大5個を清掃',result:'5個を清掃'},buff:{name:'柔光の芽核',desc:'3回ブロックから落下・今は収集のみ',prompt:'3回ブロックから落下 · 今は収集のみ',result:'柔光を収集'}},
        en:{title:'Stage Items',hazard:{name:'Falling Hazard',desc:'Lose 1 ball on contact',prompt:'Keep clear · Contact costs 1 ball',result:'Ball −1'},seed:{name:'Soft-shell Seed',desc:'Catch and toss it, up to 6 times',prompt:'Catch it to toss at a brick',result:'Seed caught'},life:{name:'Warm-shell Bud',desc:'Ball +1',prompt:'Catch for 1 extra ball',result:'Ball +1'},slow:{name:'Breeze Fluff',desc:'Temporarily slows the ball',prompt:'Catch to slow the ball briefly',result:'Breeze active'},clear:{name:'Star-path Bud',desc:'Clears up to 5 bricks',prompt:'Catch to clear up to 5 bricks',result:'5 bricks cleared'},buff:{name:'Softglow Bud Core',desc:'Drops from 3-hit bricks; collection only',prompt:'From 3-hit bricks · collection only',result:'Softglow collected'}}
    };
    var ITEM_GUIDE_ICONS={hazard:'!',seed:'❧',life:'＋',slow:'≈',clear:'✦',buff:'···'};
    var ITEM_NOTICE_COLORS={hazard:{soft:'#dce7e4',ink:'#385c5d'},seed:{soft:'#fff3d8',ink:'#a97032'},life:{soft:'#e5f3d7',ink:'#579667'},slow:{soft:'#def2fb',ink:'#4e91b6'},clear:{soft:'#fff1b9',ink:'#a97726'},buff:{soft:'#eee0f5',ink:'#9169aa'}};
    var COPY={
        zhs:{name:'星光弹球工坊',sub:'轻轻托住光球，清理天空中的彩色方块',start:'开始挑战',resume:'继续',restart:'重新开始',exit:'返回奇境',score:'得分',best:'最佳',lives:'光球',left:'剩余',seed:'光籽攻击',seedReady:'就绪',seedWaiting:'等待',seedSpent:'用完',attack:'抛籽',ready:'准备发球',readyHint:'按空格、点击画面或轻触按钮发球',pause:'暂停',paused:'旅程暂停',won:'星光清扫完成',lost:'光球用完了',again:'再来一次',title:'返回标题',controls:'← → / A D 移动蛋宝；鼠标或触控可直接拖动。',seedControls:'E / 抛籽按钮使用接住的软壳光籽。',fourthBasic:'第四关 · 柔性偏转 · 最多6次软壳光籽',basic:'基础玩法 · 无道具 · 无特殊砖块',launch:'发球'},
        zht:{name:'星光彈球工坊',sub:'輕輕托住光球，清理天空中的彩色方塊',start:'開始挑戰',resume:'繼續',restart:'重新開始',exit:'返回奇境',score:'得分',best:'最佳',lives:'光球',left:'剩餘',seed:'光籽攻擊',seedReady:'就緒',seedWaiting:'等待',seedSpent:'用完',attack:'拋籽',ready:'準備發球',readyHint:'按空白鍵、點擊畫面或輕觸按鈕發球',pause:'暫停',paused:'旅程暫停',won:'方塊全部清理完成！',lost:'光球用完了',again:'再來一次',title:'返回標題',controls:'← → / A D 移動蛋寶；滑鼠或觸控可直接拖動。',seedControls:'E / 拋籽按鈕使用接住的軟殼光籽。',fourthBasic:'第四關 · 柔性偏轉 · 最多6次軟殼光籽',basic:'基礎玩法 · 無道具 · 無特殊磚塊',launch:'發球'},
        ja:{name:'星明かりのブロック工房',sub:'光のボールを受け止め、空のカラーブロックを消そう',start:'チャレンジ開始',resume:'つづける',restart:'もう一度',exit:'世界へ戻る',score:'スコア',best:'ベスト',lives:'ボール',left:'のこり',seed:'光の種',seedReady:'準備OK',seedWaiting:'待機',seedSpent:'終了',attack:'種を投げる',ready:'サーブの準備',readyHint:'スペース、画面クリック、またはボタンでスタート',pause:'一時停止',paused:'一時停止中',won:'すべてのブロックを消しました！',lost:'ボールがなくなりました',again:'もう一度',title:'タイトルへ',controls:'← → / A D でキャラクターを移動。マウス・タッチ操作にも対応。',seedControls:'E またはボタンで受け取った光の種を投げます。',fourthBasic:'ステージ4 · やわらか反射 · 光の種は最大6回',basic:'基本ルール · アイテムなし · 特殊ブロックなし',launch:'スタート'},
        en:{name:'Starlight Block Workshop',sub:'Guide the light ball and clear the colorful sky blocks',start:'Start Challenge',resume:'Resume',restart:'Restart',exit:'Return to World',score:'Score',best:'Best',lives:'Balls',left:'Left',seed:'Seed Toss',seedReady:'Ready',seedWaiting:'Waiting',seedSpent:'Spent',attack:'Toss Seed',ready:'Ready to Serve',readyHint:'Press Space, click the board, or tap the button',pause:'Pause',paused:'Journey Paused',won:'All blocks cleared!',lost:'No light balls left',again:'Play Again',title:'Back to Title',controls:'Move your traveler with ← → / A D, mouse, or touch.',seedControls:'Press E or the seed button to toss a caught soft-shell seed.',fourthBasic:'Stage 4 · Soft deflection · Up to 6 soft-shell seeds',basic:'Basic rules · No items · No special bricks',launch:'Launch'}
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
    var LEVEL_TWO_COLORS={
        sky:['#c8eee5','#d8e7f4','#eee1c9'],
        palette:['#4f9d83','#70b99a','#72a7bd','#8f8bc1','#d4ae58','#df806d']
    };

    function themeFor(id){return THEMES[id]||THEMES.blossomTraveler;}
    function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
    function approach(value,target,amount){return value<target?Math.min(target,value+amount):Math.max(target,value-amount);}
    function stepControlVelocity(value,target,profile,dt){
        if(!profile.active)return target;
        if(profile.reverseAccel){
            if(!target)profile._reversing=false;
            else if(value&&Math.sign(value)!==Math.sign(target))profile._reversing=true;
            if(profile._reversing){var reversed=approach(value,target,profile.reverseAccel*dt);if(reversed===target)profile._reversing=false;return reversed;}
        }
        if(value&&target&&Math.sign(value)!==Math.sign(target))return approach(value,0,profile.brake*dt);
        var slowing=Math.abs(target)<Math.abs(value),rate=slowing?profile.brake:profile.accel;
        return approach(value,target,rate*dt);
    }
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
        this.level=requestedLevel===2||requestedLevel===3||requestedLevel===4||requestedLevel===5?requestedLevel:1;
        this.stageFiveText=STAGE_FIVE_COPY[this.lang]||STAGE_FIVE_COPY.en;
        this.itemGuideText=ITEM_GUIDE_COPY[this.lang]||ITEM_GUIDE_COPY.en;
        this.stageSky=this.level===2?LEVEL_TWO_COLORS.sky:this.theme.sky;
        this.stagePalette=this.level===2?LEVEL_TWO_COLORS.palette:this.theme.palette;
        this.rules=options.rules||(window.DanboBrickBreakerRules&&DanboBrickBreakerRules.create());
        if(!this.rules)throw new Error('BrickBreaker rules missing');
        this.storage=options.storage||{get:function(k,d){return d;},set:function(){}};
        this.best=Number(this.storage.get('bestScore',0))||0;
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
        this.root.innerHTML=this.markup();
        options.mount.appendChild(this.root);
        this.canvas=this.root.querySelector('.bb-canvas');
        this.ctx2d=this.canvas.getContext('2d');
        this.canvas.width=W;this.canvas.height=H;
        this.stage=this.root.querySelector('.bb-stage');
        this.characterMount=this.root.querySelector('.bb-character-player');
        this.characterView=window.DanboBrickBreakerCharacter&&window.DanboBrickBreakerCharacter.create({
            mount:this.characterMount,board:this.canvas,stage:this.stage,character:options.character
        });
        this.overlay=this.root.querySelector('.bb-overlay');
        this.card=this.root.querySelector('.bb-card');
        this.keys={left:false,right:false};
        this.pointerX=null;
        this.running=true;this.state='title';this.last=performance.now();this.raf=0;this.missTimer=0;this.audioCtx=null;
        this.boundKeyDown=this.keyDown.bind(this);
        this.boundKeyUp=this.keyUp.bind(this);
        this.boundPointer=this.pointer.bind(this);
        this.boundClick=this.click.bind(this);
        window.addEventListener('keydown',this.boundKeyDown,true);
        window.addEventListener('keyup',this.boundKeyUp,true);
        this.canvas.addEventListener('pointerdown',this.boundPointer);
        this.canvas.addEventListener('pointermove',this.boundPointer);
        this.root.addEventListener('click',this.boundClick);
        this.resetBoard();this.showTitle();
        var self=this;this.raf=requestAnimationFrame(function(t){self.loop(t);});
    }

    Game.prototype.markup=function(){
        var t=this.t,character=this.character;
        var characterVisual=character.portrait?'<img class="bb-character-portrait" src="'+esc(character.portrait)+'" alt="">':'';
        var seedHud=this.level===4?'<div class="bb-hud-pill bb-seed-pill"><span>'+esc(t.seed)+'</span><b data-seeds>○ 6</b></div>':'';
        var speedHud=this.level===5?'<div class="bb-hud-pill"><span>'+esc(this.stageFiveText.speed)+'</span><b data-ball-speed>540</b></div>':'';
        var seedButton=this.level===4?'<button class="bb-seed-attack" data-action="seed" disabled><span>'+esc(t.attack)+'</span><b data-seed-ready>6</b></button>':'';
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
            '<div class="bb-overlay"><section class="bb-card"></section></div>'+
            '<button class="bb-launch" data-action="launch">'+esc(t.launch)+'</button>'+
            seedButton+
            '<aside class="bb-item-whisper" data-item-whisper data-type="seed" role="status" aria-live="polite" aria-hidden="true"><i data-item-whisper-icon aria-hidden="true"></i><span><b data-item-whisper-name></b><small data-item-whisper-copy></small></span></aside>'+
            '<footer class="bb-tip">'+esc(t.controls)+(this.level===4?' '+esc(t.seedControls):'')+'</footer>';
    };

    Game.prototype.itemGuideTypes=function(){return this.level===2?['hazard']:(this.level===4?['seed']:(this.level===5?['life','slow','clear','buff']:[]));};
    Game.prototype.itemGuideHtml=function(){
        var types=this.itemGuideTypes();if(!types.length)return '';
        var html='<section class="bb-item-guide" aria-label="'+esc(this.itemGuideText.title)+'"><p>'+esc(this.itemGuideText.title)+'</p><div>';
        for(var i=0;i<types.length;i++){var type=types[i],copy=this.itemGuideText[type];html+='<article data-guide-item="'+esc(type)+'"><i aria-hidden="true">'+esc(ITEM_GUIDE_ICONS[type])+'</i><span><b>'+esc(copy.name)+'</b><small>'+esc(copy.desc)+'</small></span></article>';}
        return html+'</div></section>';
    };
    Game.prototype.titleHtml=function(){var t=this.t,basicCopy=this.level===4?t.fourthBasic:(this.level===5?this.stageFiveText.basic:t.basic);return '<div class="bb-mark" aria-hidden="true"><span></span><span></span><span></span></div><p class="bb-character-theme"><span>'+esc(this.theme.glyph)+'</span>'+esc(this.character.name)+'</p><p class="bb-kicker">BLOCK &amp; LIGHT</p><h1>'+esc(t.name)+'</h1><p class="bb-sub">'+esc(t.sub)+'</p>'+this.itemGuideHtml()+'<button class="bb-primary" data-action="start">'+esc(t.start)+'</button><p class="bb-note">'+esc(basicCopy)+'<br><small>Rules: '+esc(this.rules.mode||'local')+' · build '+esc(this.rules.build||1)+'</small></p>';};
    Game.prototype.showTitle=function(){this.state='title';this.overlay.hidden=false;this.card.innerHTML=this.titleHtml();this.root.classList.remove('bb-playing');this.updateHud();};

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
        if(this.level===4&&this.seedDrop)active.push({type:'seed',y:this.seedDrop.y});
        if(this.level===5){
            if(this.stageFiveDrop)active.push({type:this.stageFiveDrop.type,y:this.stageFiveDrop.y});
            for(var i=0;i<this.stageFiveBuffDrops.length;i++)active.push({type:'buff',y:this.stageFiveBuffDrops[i].y});
        }
        if(!active.length)return null;
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
            if(detail)detail.textContent=candidate.kind==='result'?copy.result:(copy.prompt||copy.desc);
            this.itemWhisperKey=key;
        }
        element.classList.toggle('is-result',candidate.kind==='result');element.classList.add('is-visible');element.setAttribute('aria-hidden','false');
    };

    Game.prototype.resetBoard=function(){
        if(this.missTimer){clearTimeout(this.missTimer);this.missTimer=0;}
        this.score=0;this.lives=STARTING_LIVES;this.misses=0;this.serveId=0;this.resolvedServeId=-1;this.remaining=0;this.elapsed=0;this.missHandled=false;
        if(this.characterView&&this.characterView.resetReaction)this.characterView.resetReaction();
        this.paddle={x:W*0.5,y:H-100,w:154,h:22,speed:690,controlVx:0};
        this.ball={x:W*0.5,y:this.paddle.y-28,vx:0,vy:0,r:11,speed:LEVEL_BALL_SPEEDS[this.level]||LEVEL_BALL_SPEEDS[1]};
        this.bricks=[];this.hitEffects=[];this.brickMotionTime=0;this.brickMotionDirection=1;
        this.hazard=null;this.hazardClock=0;this.hazardNextAt=6;this.hazardNextGroup='left';this.hazardSpawnCount=0;this.hazardDisabled=this.level!==2;
        this.seedDrop=null;this.seedProjectile=null;this.seedBursts=[];this.seedClock=0;this.seedNextAt=7;this.seedSpawnCount=0;this.seedMisses=0;this.seedHeld=false;this.seedUses=0;this.seedLimit=6;this.seedDropLimit=6;this.seedCooldown=0;
        this.stageFiveDrop=null;this.stageFiveDropClock=0;this.stageFiveNextAt=10+Math.random()*5;this.stageFiveDropCount=0;
        this.stageFiveSlowTime=0;this.stageFiveRecoverTime=0;this.stageFiveRecoverDuration=.8;this.stageFiveSlowSpeed=440;
        this.stageFiveCollectEffects=[];this.stageFiveClearPaths=[];
        this.stageFiveBuffDrops=[];this.stageFiveBuffCollectEffects=[];this.stageFiveBuffCollected=0;
        this.seenItemHints={};this.itemHints=[];this.itemResultEffects=[];this.itemWhisperKey='';
        this.padFeedback={active:false,age:0,duration:.2,offset:0,contactX:0,contactY:0};
        this.ballFeedback={active:false,age:0,duration:.09,axis:'y',strength:.16,type:'catch'};
        var bw=82,bh=30;
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
        var reinforcedCells={
            '393,106':true,'485,108':true,'347,144':true,'531,144':true,'393,260':true,'485,260':true,
            '223,190':true,'209,270':true,'243,310':true,'655,194':true,'669,274':true,'657,310':true
        };
        var stageFiveReinforcedCells={'395,108':true,'483,108':true,'307,180':true,'571,180':true,'307,288':true,'571,288':true,'351,432':true,'527,432':true};
        var stageFiveTripleCells={'395,108':true,'483,108':true,'351,432':true,'527,432':true};
        var cells=[];
        function addCells(list,motionGroup){for(var ci=0;ci<list.length;ci++)cells.push({x:list[ci][0],y:list[ci][1],motionGroup:motionGroup});}
        if(this.level===2){addCells(swayLayout.fixed,'fixed');addCells(swayLayout.left,'left');addCells(swayLayout.right,'right');}
        else if(this.level===3){addCells(doubleShellLayout.crown,'fixed');addCells(doubleShellLayout.leftSprout,'fixed');addCells(doubleShellLayout.rightSprout,'fixed');addCells(doubleShellLayout.roots,'fixed');}
        else if(this.level===4){addCells(eggyLayout.crown,'fixed');addCells(eggyLayout.head,'fixed');addCells(eggyLayout.arms,'fixed');addCells(eggyLayout.body,'fixed');addCells(eggyLayout.feet,'fixed');}
        else if(this.level===5){addCells(budStarLayout.fixed,'fixed');addCells(budStarLayout.left,'left');addCells(budStarLayout.right,'right');}
        else{addCells(shellLayout.growth,'fixed');addCells(shellLayout.leftShell,'fixed');addCells(shellLayout.rightShell,'fixed');addCells(shellLayout.fragments,'fixed');}
        cells.sort(function(a,b){return a.y-b.y||a.x-b.x;});
        var paletteCounts=this.level===3?[10,9,9,9,10,9]:(this.level===5?[9,9,9,9,8,8]:[9,8,8,8,8,7]),paletteRow=0,rowEnd=paletteCounts[0],colors=this.stagePalette;
        for(var cellIndex=0;cellIndex<cells.length;cellIndex++){
            while(cellIndex>=rowEnd&&paletteRow<paletteCounts.length-1){paletteRow++;rowEnd+=paletteCounts[paletteRow];}
            var cell=cells[cellIndex],triple=this.level===5&&stageFiveTripleCells[cell.x+','+cell.y]===true,reinforced=triple||(this.level===3&&reinforcedCells[cell.x+','+cell.y]===true)||(this.level===5&&stageFiveReinforcedCells[cell.x+','+cell.y]===true),maxHits=triple?3:(reinforced?2:1);
            this.bricks.push({x:cell.x,y:cell.y,baseX:cell.x,baseY:cell.y,motionGroup:cell.motionGroup,w:bw,h:bh,row:paletteRow,col:cellIndex%9,color:colors[paletteRow],alive:true,reinforced:reinforced,buffCarrier:triple,buffDropped:false,maxHits:maxHits,hitsRemaining:maxHits,hitCooldown:0,shellPulseAge:-1,shellPulseDuration:.2,shellImpactX:0,shellImpactY:0});this.remaining++;
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

    Game.prototype.seedCatchRect=function(){
        return {x:this.paddle.x-48,y:this.paddle.y-42,w:96,h:54};
    };

    Game.prototype.spawnSeedDrop=function(){
        if(this.level!==4||this.seedDrop||this.seedHeld||this.seedUses>=this.seedLimit||this.seedSpawnCount>=this.seedDropLimit)return false;
        var lanes=[216,704,348,612,480,282,678,414,546],x=lanes[this.seedSpawnCount%lanes.length];
        this.seedSpawnCount++;this.seedDrop={x:x,y:52,r:11,speed:108,age:0};this.showItemHint('seed',this.seedDrop);
        return true;
    };

    Game.prototype.launchSeedAttack=function(){
        if(this.level!==4||this.state!=='playing'||!this.seedHeld||this.seedUses>=this.seedLimit||this.seedCooldown>0||this.seedProjectile)return false;
        this.seedHeld=false;this.seedUses++;this.seedCooldown=.42;
        this.seedProjectile={x:this.paddle.x,y:this.paddle.y-46,r:8,speed:342,age:0};
        this.seedNextAt=this.seedClock+7;this.updateHud();
        if(this.characterView&&this.characterView.react)this.characterView.react('catch',0);
        return true;
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
        if(this.level!==4||this.state!=='playing')return;
        this.seedClock+=Math.max(0,dt||0);this.seedCooldown=Math.max(0,this.seedCooldown-dt);
        if(!this.seedDrop&&!this.seedHeld&&!this.seedProjectile&&this.seedUses<this.seedLimit&&this.seedSpawnCount<this.seedDropLimit&&this.seedClock>=this.seedNextAt)this.spawnSeedDrop();
        if(this.seedDrop){
            var drop=this.seedDrop;drop.age+=dt;drop.y+=drop.speed*dt;
            var catchRect=this.seedCatchRect(),dropLeft=drop.x-drop.r,dropTop=drop.y-drop.r;
            if(dropLeft<catchRect.x+catchRect.w&&dropLeft+drop.r*2>catchRect.x&&dropTop<catchRect.y+catchRect.h&&dropTop+drop.r*2>catchRect.y){
                this.seedHeld=true;this.seedDrop=null;this.updateHud();this.showItemResult('seed',drop.x,this.paddle.y-45);
                if(this.characterView&&this.characterView.react)this.characterView.react('catch',0);
            }else if(dropTop>H+12){this.seedDrop=null;this.seedMisses++;this.seedNextAt=this.seedClock+7;this.updateHud();}
        }
        if(!this.seedProjectile)return;
        var projectile=this.seedProjectile;projectile.age+=dt;projectile.y-=projectile.speed*dt;
        for(var i=0;i<this.bricks.length;i++){
            var brick=this.bricks[i];if(!brick.alive||!this.rules.circleRectHit(projectile.x,projectile.y,projectile.r,brick))continue;
            this.addSeedBrickFeedback(brick,projectile.x,clamp(projectile.y,brick.y,brick.y+brick.h));
            brick.hitsRemaining=0;brick.alive=false;this.remaining--;this.score+=this.rules.scoreForBrick(brick.row);this.seedProjectile=null;this.updateHud();
            if(this.rules.isWin(this.remaining))this.finishRound(true);
            return;
        }
        if(projectile.y+projectile.r<20)this.seedProjectile=null;
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
        if(drop.type==='life')this.lives++;
        else if(drop.type==='slow'){
            this.stageFiveSlowTime=8;this.stageFiveRecoverTime=0;this.setBallSpeed(this.stageFiveSlowSpeed);
        }else if(drop.type==='clear')this.clearStageFiveBricks(drop.x);
        this.stageFiveCollectEffects.push({type:drop.type,x:drop.x,y:this.paddle.y-20,age:0,duration:.72});
        this.showItemResult(drop.type,drop.x,this.paddle.y-54);
        this.stageFiveDrop=null;this.stageFiveNextAt=this.stageFiveDropClock+10+Math.random()*5;this.updateHud();
        this.playSoftCollision('catch');
        if(this.characterView&&this.characterView.react)this.characterView.react('catch',clamp((drop.x-this.paddle.x)/(this.paddle.w*.5),-1,1));
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

    Game.prototype.startGame=function(){
        this.resetBoard();this.state='ready';this.root.classList.add('bb-playing');this.showReady();
        if(this.options.onEvent)this.options.onEvent('start',{score:0,lives:this.lives});
    };
    Game.prototype.showReady=function(){var t=this.t;this.overlay.hidden=false;this.card.innerHTML='<div class="bb-mini-ball">●</div><h2>'+esc(t.ready)+'</h2><p>'+esc(t.readyHint)+'</p><button class="bb-primary" data-action="launch">'+esc(t.launch)+'</button>';};
    Game.prototype.launch=function(){
        if(this.state!=='ready')return;
        this.ensureAudio();
        this.serveId++;this.missHandled=false;
        var direction=(Math.floor(this.elapsed*10)%2?1:-1),launchVx=this.ball.speed*.42;
        this.ball.vx=direction*launchVx;this.ball.vy=-Math.sqrt(this.ball.speed*this.ball.speed-launchVx*launchVx);
        this.state='playing';this.overlay.hidden=true;
    };
    Game.prototype.togglePause=function(){
        if(this.state==='playing'){
            this.state='paused';this.overlay.hidden=false;this.card.innerHTML='<h2>'+esc(this.t.paused)+'</h2><button class="bb-primary" data-action="resume">'+esc(this.t.resume)+'</button><button class="bb-secondary" data-action="restart">'+esc(this.t.restart)+'</button>';
        }else if(this.state==='paused'){this.state='playing';this.overlay.hidden=true;}
    };

    Game.prototype.finishRound=function(won){
        this.state=won?'won':'lost';
        if(this.score>this.best){this.best=this.score;this.storage.set('bestScore',this.best);}
        this.updateHud();this.overlay.hidden=false;
        this.card.innerHTML='<div class="bb-result-icon">'+(won?'✦':'○')+'</div><h2>'+esc(won?this.t.won:this.t.lost)+'</h2><p class="bb-result-score">'+esc(this.t.score)+' <b>'+this.score+'</b></p><button class="bb-primary" data-action="start">'+esc(this.t.again)+'</button><button class="bb-secondary" data-action="title">'+esc(this.t.title)+'</button>';
        if(this.options.onResult)this.options.onResult({status:won?'finished':'failed',score:this.score,best:this.best,lives:this.lives,remaining:this.remaining,time:this.elapsed});
    };

    Game.prototype.loseBall=function(){
        if(this.state!=='playing'||this.missHandled||this.resolvedServeId===this.serveId)return;
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
        if(['ArrowLeft','ArrowRight','Space','KeyA','KeyD','KeyE','Escape','KeyP'].indexOf(e.code)<0)return;
        e.preventDefault();e.stopPropagation();
        if(e.code==='ArrowLeft'||e.code==='KeyA')this.keys.left=true;
        if(e.code==='ArrowRight'||e.code==='KeyD')this.keys.right=true;
        if(e.code==='Space'){
            if(this.state==='title')this.startGame();else if(this.state==='ready')this.launch();else if(this.state==='paused')this.togglePause();
        }
        if(e.code==='KeyE')this.launchSeedAttack();
        if(e.code==='Escape'||e.code==='KeyP')this.togglePause();
    };
    Game.prototype.keyUp=function(e){if(e.code==='ArrowLeft'||e.code==='KeyA')this.keys.left=false;if(e.code==='ArrowRight'||e.code==='KeyD')this.keys.right=false;};
    Game.prototype.pointer=function(e){
        if(e.type==='pointerdown')this.canvas.setPointerCapture&&this.canvas.setPointerCapture(e.pointerId);
        var rect=this.canvas.getBoundingClientRect();if(!rect.width)return;
        this.pointerX=clamp((e.clientX-rect.left)/rect.width*W,0,W);
        if(this.state==='ready'&&e.type==='pointerdown')this.launch();
    };
    Game.prototype.click=function(e){
        var button=e.target.closest&&e.target.closest('[data-action]');if(!button)return;
        var action=button.getAttribute('data-action');
        if(action==='start')this.startGame();else if(action==='launch')this.launch();else if(action==='seed')this.launchSeedAttack();else if(action==='pause'||action==='resume')this.togglePause();else if(action==='restart')this.startGame();else if(action==='title')this.showTitle();else if(action==='exit')this.exit();
    };

    Game.prototype.exit=function(){if(this.options.onExit)this.options.onExit({status:'exit',score:this.score||0,best:this.best});else this.showTitle();};

    Game.prototype.ensureAudio=function(){
        if((typeof sfxEnabled!=='undefined'&&!sfxEnabled)||(typeof soundEnabled!=='undefined'&&!soundEnabled))return null;
        var AudioCtor=window.AudioContext||window.webkitAudioContext;if(!AudioCtor)return null;
        if(!this.audioCtx)this.audioCtx=new AudioCtor();
        if(this.audioCtx.state==='suspended'&&this.audioCtx.resume)this.audioCtx.resume().catch(function(){});
        return this.audioCtx;
    };

    Game.prototype.playSoftCollision=function(type){
        var audio=this.ensureAudio();if(!audio||audio.state==='closed')return;
        var now=audio.currentTime,osc=audio.createOscillator(),gain=audio.createGain();
        osc.type='sine';osc.connect(gain);gain.connect(audio.destination);
        if(type==='catch'){
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

    Game.prototype.applySoftBrickDeflection=function(brick,contactX){
        if(this.level!==4&&this.level!==5)return;
        var b=this.ball,position=clamp((contactX-(brick.x+brick.w*.5))/(brick.w*.5),-1,1),deadZone=.18;
        if(Math.abs(position)<=deadZone)return;
        var influence=(Math.abs(position)-deadZone)/(1-deadZone),nudge=Math.sign(position)*influence*b.speed*Math.sin(Math.PI/22.5);
        b.vx+=nudge;
        var length=Math.hypot(b.vx,b.vy)||b.speed;
        b.vx=b.vx/length*b.speed;b.vy=b.vy/length*b.speed;
    };

    Game.prototype.addBrickHitFeedback=function(brick){
        var b=this.ball,cx=clamp(b.x,brick.x,brick.x+brick.w),cy=clamp(b.y,brick.y,brick.y+brick.h),dx=b.x-cx,dy=b.y-cy;
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
        this.triggerBallFeedback('brick',axis);this.playSoftCollision('brick');
    };

    Game.prototype.triggerPadFeedback=function(){
        this.padFeedback.active=true;this.padFeedback.age=0;
        this.padFeedback.offset=clamp((this.ball.x-this.paddle.x)/(this.paddle.w*.5),-1,1);
        this.padFeedback.contactX=clamp(this.ball.x,this.paddle.x-this.paddle.w*.5,this.paddle.x+this.paddle.w*.5);this.padFeedback.contactY=this.paddle.y-this.paddle.h*.5;
        this.padFeedback.kind=this.handling.feedback;
        var durations={berryDots:.18,grainLift:.28,leafFlick:.24,crystalGlint:.16,mistRibbon:.32,orchardDouble:.3,emberSlash:.16};
        this.padFeedback.duration=durations[this.padFeedback.kind]||.26;
        this.triggerBallFeedback('catch','y');this.playSoftCollision('catch');
    };

    Game.prototype.update=function(dt){
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
        var previousX=this.paddle.x,unclampedX,targetVx=0,pointerDelta=0,pointerDriven=false;
        var dir=(this.keys.left?-1:0)+(this.keys.right?1:0);
        if(dir)targetVx=dir*this.paddle.speed;
        else if(this.pointerX!==null){
            pointerDriven=true;pointerDelta=this.pointerX-this.paddle.x;
            var pointerLimit=this.handling.active?Math.sqrt(2*this.handling.brake*Math.abs(pointerDelta)):this.paddle.speed;
            targetVx=Math.sign(pointerDelta)*Math.min(this.paddle.speed,Math.abs(pointerDelta)*this.handling.pointerGain,pointerLimit);
        }
        if(this.handling.active){
            this.paddle.controlVx=stepControlVelocity(this.paddle.controlVx,targetVx,this.handling,dt);this.paddle.x+=this.paddle.controlVx*dt;
        }else if(dir){this.paddle.controlVx=targetVx;this.paddle.x+=this.paddle.controlVx*dt;}
        else if(this.pointerX!==null){this.paddle.x+=(this.pointerX-this.paddle.x)*Math.min(1,dt*14);this.paddle.controlVx=dt>0?(this.paddle.x-previousX)/dt:0;}
        else this.paddle.controlVx=0;
        if(pointerDriven&&pointerDelta&&Math.sign(pointerDelta)!==Math.sign(this.pointerX-this.paddle.x)){this.paddle.x=this.pointerX;this.paddle.controlVx=0;}
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
        this.updateSeedSystem(dt);
        if(this.state!=='playing')return;
        this.updateStageFiveItems(dt);
        if(this.state!=='playing')return;
        this.updateStageFiveBuffDrops(dt);
        if(this.state!=='playing')return;
        var steps=Math.max(1,Math.ceil(dt/0.006)),step=dt/steps;
        for(var s=0;s<steps&&this.state==='playing';s++)this.physicsStep(step);
    };

    Game.prototype.physicsStep=function(dt){
        if(this.state!=='playing')return;
        var b=this.ball,p=this.paddle;
        b.x+=b.vx*dt;b.y+=b.vy*dt;
        if(b.x-b.r<26){b.x=26+b.r;b.vx=Math.abs(b.vx);}
        if(b.x+b.r>W-26){b.x=W-26-b.r;b.vx=-Math.abs(b.vx);}
        if(b.y-b.r<28){b.y=28+b.r;b.vy=Math.abs(b.vy);}
        var pr={x:p.x-p.w*0.5,y:p.y-p.h*0.5,w:p.w,h:p.h};
        if(b.vy>0&&this.rules.circleRectHit(b.x,b.y,b.r,pr)){
            b.y=pr.y-b.r-0.5;var bounce=this.rules.paddleBounce(b.x,p.x,p.w,b.speed);b.vx=bounce.vx;b.vy=bounce.vy;
            if(this.handling.steer!==1){b.vx=clamp(b.vx*this.handling.steer,-b.speed*.94,b.speed*.94);b.vy=-Math.sqrt(Math.max(0,b.speed*b.speed-b.vx*b.vx));}
            this.triggerPadFeedback();
            if(this.characterView&&this.characterView.react)this.characterView.react('catch',this.padFeedback.offset);
        }
        for(var i=0;i<this.bricks.length;i++){
            var brick=this.bricks[i];if(!brick.alive||brick.hitCooldown>0||!this.rules.circleRectHit(b.x,b.y,b.r,brick))continue;
            var cx=clamp(b.x,brick.x,brick.x+brick.w),cy=clamp(b.y,brick.y,brick.y+brick.h),dx=b.x-cx,dy=b.y-cy;
            var hitAxis=Math.abs(dx)>Math.abs(dy)?'x':'y';
            if(hitAxis==='x')b.vx=dx<0?-Math.abs(b.vx):Math.abs(b.vx);else b.vy=dy<0?-Math.abs(b.vy):Math.abs(b.vy);
            this.applySoftBrickDeflection(brick,cx);
            if(brick.hitsRemaining>1){
                brick.hitsRemaining--;brick.hitCooldown=.07;brick.shellPulseAge=0;brick.shellImpactX=cx;brick.shellImpactY=cy;
                this.triggerBallFeedback('brick',hitAxis);this.playSoftCollision('brick');break;
            }
            this.addBrickHitFeedback(brick);brick.hitsRemaining=0;brick.alive=false;this.remaining--;this.score+=this.rules.scoreForBrick(brick.row);
            if(brick.buffCarrier&&!brick.buffDropped)this.spawnStageFiveBuffDrop(brick);
            if(this.rules.isWin(this.remaining)){this.finishRound(true);return;}break;
        }
        if(b.y-b.r>H){
            this.loseBall();return;
        }
    };

    Game.prototype.updateHud=function(){
        var q=function(sel){return this.root&&this.root.querySelector(sel);}.bind(this),el;
        if((el=q('[data-score]')))el.textContent=String(this.score||0).padStart(4,'0');
        if((el=q('[data-best]')))el.textContent=this.best||0;
        if((el=q('[data-lives]')))el.textContent=new Array(Math.max(0,this.lives||0)+1).join('● ');
        if((el=q('[data-left]')))el.textContent=this.remaining||0;
        if((el=q('[data-ball-speed]')))el.textContent=Math.round((this.ball&&this.ball.speed)||LEVEL_BALL_SPEEDS[this.level]||LEVEL_BALL_SPEEDS[1]);
        if((el=q('[data-seeds]'))){
            var seedRemaining=Math.max(0,(this.seedDropLimit||0)-(this.seedUses||0)-(this.seedMisses||0)),seedExhausted=this.seedUses>=this.seedLimit||(this.seedSpawnCount>=this.seedDropLimit&&!this.seedHeld&&!this.seedDrop&&!this.seedProjectile);
            el.textContent=(seedExhausted?'—':(this.seedHeld?'●':'○'))+' '+seedRemaining;
            el.title=seedExhausted?this.t.seedSpent:(this.seedHeld?this.t.seedReady:this.t.seedWaiting);
        }
        var seedButton=q('.bb-seed-attack');
        if(seedButton){
            var attackRemaining=Math.max(0,(this.seedDropLimit||0)-(this.seedUses||0)-(this.seedMisses||0));
            seedButton.disabled=this.state!=='playing'||!this.seedHeld||this.seedUses>=this.seedLimit||this.seedCooldown>0||!!this.seedProjectile;
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
    Game.prototype.drawThemeBackdrop=function(c){
        var points=[[74,76,22],[884,82,26],[76,610,28],[878,594,23],[478,656,18]];
        for(var i=0;i<points.length;i++)this.drawMotif(c,points[i][0],points[i][1],points[i][2],i===4?.09:.13,this.theme.accent);
    };
    Game.prototype.drawBall=function(c){
        var b=this.ball,feedback=this.ballFeedback,amount=0,scaleX=1,scaleY=1;
        if(feedback.active)amount=Math.pow(1-clamp(feedback.age/feedback.duration,0,1),2)*feedback.strength;
        if(feedback.axis==='x'){scaleX=1-amount;scaleY=1+amount*.68;}else{scaleX=1+amount*.68;scaleY=1-amount;}
        c.save();c.translate(b.x,b.y);c.scale(scaleX,scaleY);c.shadowColor=this.theme.glow;c.shadowBlur=14;
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
        c.restore();
    };
    Game.prototype.drawSoftSeed=function(c,x,y,scale,rotation,alpha){
        c.save();c.translate(x,y);c.rotate(rotation||0);c.scale(scale||1,scale||1);c.globalAlpha=alpha===undefined?1:alpha;
        c.shadowColor=this.theme.glow;c.shadowBlur=11;c.fillStyle='rgba(255,252,235,.96)';c.beginPath();c.ellipse(0,1,8.5,11.5,0,0,Math.PI*2);c.fill();c.shadowColor='transparent';
        var core=c.createRadialGradient(-2,-3,0,0,1,9);core.addColorStop(0,this.theme.spark);core.addColorStop(.55,this.theme.ballCore);core.addColorStop(1,this.theme.accent);c.globalAlpha=(alpha===undefined?1:alpha)*.78;c.fillStyle=core;c.beginPath();c.ellipse(0,2,5.2,7.2,0,0,Math.PI*2);c.fill();
        c.globalAlpha=alpha===undefined?1:alpha;c.fillStyle=this.theme.accent;c.save();c.translate(3,-10);c.rotate(-.58);c.beginPath();c.ellipse(0,0,4.5,2.4,0,0,Math.PI*2);c.fill();c.restore();
        c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=1.2;c.beginPath();c.arc(-2,-2,3.7,Math.PI*1.05,Math.PI*1.62);c.stroke();c.restore();
    };
    Game.prototype.drawSeedSystem=function(c){
        if(this.level!==4)return;
        if(this.seedDrop){
            var drop=this.seedDrop,dropSway=Math.sin(drop.age*4.2)*.18;
            this.drawSoftSeed(c,drop.x,drop.y,1,dropSway,1);
            c.save();c.globalAlpha=.24;c.strokeStyle=this.theme.accent;c.lineWidth=1.5;c.beginPath();c.moveTo(drop.x-7,drop.y-16);c.quadraticCurveTo(drop.x,drop.y-21,drop.x+7,drop.y-16);c.stroke();c.restore();
        }
        if(this.seedHeld){
            var heldY=this.paddle.y-48+Math.sin(this.elapsed*5)*2;
            this.drawSoftSeed(c,this.paddle.x,heldY,.9,Math.sin(this.elapsed*3)*.08,1);
        }
        if(this.seedProjectile){
            var projectile=this.seedProjectile;
            c.save();c.globalAlpha=.35;var trail=c.createLinearGradient(projectile.x,projectile.y,projectile.x,projectile.y+30);trail.addColorStop(0,this.theme.ballCore);trail.addColorStop(1,'rgba(255,255,255,0)');c.strokeStyle=trail;c.lineWidth=4;c.lineCap='round';c.beginPath();c.moveTo(projectile.x,projectile.y+7);c.lineTo(projectile.x,projectile.y+29);c.stroke();c.restore();
            this.drawSoftSeed(c,projectile.x,projectile.y,.78,projectile.age*4.8,1);
        }
        for(var burstIndex=0;burstIndex<this.seedBursts.length;burstIndex++){
            var burst=this.seedBursts[burstIndex],progress=clamp(burst.age/burst.duration,0,1),fade=Math.pow(1-progress,2);
            c.save();c.translate(burst.x,burst.y);c.globalAlpha=fade*.85;c.fillStyle=this.theme.spark;
            for(var petal=0;petal<4;petal++){var angle=-Math.PI*.85+petal*Math.PI*.57,distance=4+progress*(12+petal*2);c.save();c.translate(Math.cos(angle)*distance,Math.sin(angle)*distance);c.rotate(angle);c.beginPath();c.ellipse(0,0,3.8-progress,1.9-progress*.45,0,0,Math.PI*2);c.fill();c.restore();}
            c.restore();
        }
    };
    Game.prototype.drawStageFiveDrop=function(c,drop){
        var bob=Math.sin(drop.age*5.2)*.08;c.save();c.translate(drop.x,drop.y);c.rotate(bob);c.shadowBlur=13;c.shadowColor=drop.type==='life'?'rgba(105,170,112,.42)':(drop.type==='slow'?'rgba(105,164,208,.4)':'rgba(220,171,63,.46)');
        if(drop.type==='life'){
            c.fillStyle='rgba(255,253,234,.97)';c.beginPath();c.ellipse(0,1,11,14,0,0,Math.PI*2);c.fill();c.shadowColor='transparent';
            c.fillStyle='#75b878';c.save();c.translate(5,-13);c.rotate(-.55);c.beginPath();c.ellipse(0,0,5.5,2.8,0,0,Math.PI*2);c.fill();c.restore();
            c.strokeStyle='#5a9c68';c.lineWidth=2;c.lineCap='round';c.beginPath();c.moveTo(-4,1);c.lineTo(4,1);c.moveTo(0,-3);c.lineTo(0,5);c.stroke();
        }else if(drop.type==='slow'){
            c.fillStyle='rgba(221,245,255,.97)';c.beginPath();c.arc(-6,1,7,0,Math.PI*2);c.arc(0,-4,9,0,Math.PI*2);c.arc(7,1,7,0,Math.PI*2);c.ellipse(0,6,14,6.5,0,0,Math.PI*2);c.fill();c.shadowColor='transparent';
            c.strokeStyle='#65a9ce';c.lineWidth=1.8;c.lineCap='round';c.beginPath();c.moveTo(-9,2);c.quadraticCurveTo(0,-3,9,2);c.moveTo(-6,7);c.quadraticCurveTo(1,3,8,7);c.stroke();
        }else{
            c.fillStyle='rgba(255,247,204,.98)';c.beginPath();c.moveTo(0,-15);c.bezierCurveTo(11,-8,13,5,0,15);c.bezierCurveTo(-13,5,-11,-8,0,-15);c.closePath();c.fill();c.shadowColor='transparent';
            c.fillStyle='#d7a73e';for(var dot=0;dot<3;dot++){c.beginPath();c.arc((dot-1)*5,2+(dot%2)*2,2,0,Math.PI*2);c.fill();}
            c.strokeStyle='rgba(255,255,248,.95)';c.lineWidth=1.4;c.beginPath();c.arc(-2,-5,5,Math.PI*1.05,Math.PI*1.65);c.stroke();
        }
        c.restore();
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
            var drop=this.stageFiveDrop;c.save();c.globalAlpha=.22;c.strokeStyle=drop.type==='life'?'#75b878':(drop.type==='slow'?'#65a9ce':'#d7a73e');c.lineWidth=1.3;c.beginPath();c.moveTo(drop.x,drop.y-19);c.quadraticCurveTo(drop.sourceX,drop.y-31,drop.sourceX,Math.max(drop.sourceY,drop.y-54));c.stroke();c.restore();this.drawStageFiveDrop(c,drop);
        }
        for(var buffDropIndex=0;buffDropIndex<this.stageFiveBuffDrops.length;buffDropIndex++){
            var buffDrop=this.stageFiveBuffDrops[buffDropIndex];c.save();c.globalAlpha=.24;c.fillStyle='#c59cda';
            for(var trailDot=0;trailDot<3;trailDot++){c.beginPath();c.arc(buffDrop.x+Math.sin(buffDrop.age*4+trailDot)*3,buffDrop.y-18-trailDot*7,2.2-trailDot*.45,0,Math.PI*2);c.fill();}c.restore();this.drawStageFiveBuffDrop(c,buffDrop);
        }
        for(var fxIndex=0;fxIndex<this.stageFiveCollectEffects.length;fxIndex++){
            var effect=this.stageFiveCollectEffects[fxIndex],effectProgress=clamp(effect.age/effect.duration,0,1),effectFade=Math.pow(1-effectProgress,2),label=effect.type==='life'?'+1':(effect.type==='slow'?'≈':'✦5');
            c.save();c.translate(effect.x,effect.y-effectProgress*28);c.globalAlpha=effectFade;c.fillStyle=effect.type==='life'?'#5b9c68':(effect.type==='slow'?'#4d91b7':'#b8872d');c.font='800 19px system-ui,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(label,0,0);c.restore();
        }
        for(var buffFxIndex=0;buffFxIndex<this.stageFiveBuffCollectEffects.length;buffFxIndex++){
            var buffEffect=this.stageFiveBuffCollectEffects[buffFxIndex],buffProgress=clamp(buffEffect.age/buffEffect.duration,0,1),buffFade=Math.pow(1-buffProgress,2);
            c.save();c.translate(buffEffect.x,buffEffect.y-buffProgress*18);c.globalAlpha=buffFade*.82;
            for(var mote=0;mote<3;mote++){var angle=-Math.PI*.75+mote*Math.PI*.75+buffProgress*.9,distance=6+buffProgress*(13+mote*2);c.save();c.translate(Math.cos(angle)*distance,Math.sin(angle)*distance);c.rotate(angle);c.fillStyle=mote===1?'#ee9fb2':'#bd91d3';c.beginPath();c.ellipse(0,0,3.7-buffProgress,2-buffProgress*.45,0,0,Math.PI*2);c.fill();c.restore();}
            c.restore();
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
        var scale=warning?.62+Math.sin(progress*Math.PI)*.16:(hit?1-progress*.45:1),alpha=warning?.28+progress*.42:(hit?1-progress:1);
        c.save();c.translate(hazard.x,hazard.y);c.scale(scale,scale);c.globalAlpha=alpha;
        if(!warning){c.shadowColor='rgba(35,55,65,.35)';c.shadowBlur=10;c.shadowOffsetY=4;}
        c.fillStyle='#314f55';c.beginPath();c.moveTo(0,-18);c.bezierCurveTo(8,-18,14,-10,14,-1);c.bezierCurveTo(15,9,9,18,0,20);c.bezierCurveTo(-9,18,-15,9,-14,-1);c.bezierCurveTo(-14,-10,-8,-18,0,-18);c.closePath();c.fill();
        c.shadowColor='transparent';c.fillStyle='#496f68';
        for(var tip=0;tip<3;tip++){c.save();c.translate((tip-1)*6,-16);c.rotate((tip-1)*.45);c.beginPath();c.ellipse(0,-2,3.2,7,0,0,Math.PI*2);c.fill();c.restore();}
        c.strokeStyle='rgba(200,237,219,.42)';c.lineWidth=1.4;c.beginPath();c.moveTo(0,-10);c.quadraticCurveTo(4,1,0,14);c.moveTo(-5,-7);c.quadraticCurveTo(-8,2,-5,10);c.stroke();
        c.fillStyle='#ef8b79';c.beginPath();c.ellipse(0,3,4.5,6.5,0,0,Math.PI*2);c.fill();c.fillStyle='rgba(255,232,205,.88)';c.beginPath();c.arc(-1.2,1,1.4,0,Math.PI*2);c.fill();
        if(hit){
            c.globalAlpha=(1-progress)*.68;
            for(var mote=0;mote<3;mote++){var angle=-Math.PI*.8+mote*Math.PI*.3,distance=4+progress*(7+mote*2);c.fillStyle=mote===1?'#ef8b79':'#6e9687';c.beginPath();c.arc(Math.cos(angle)*distance,Math.sin(angle)*distance,2-progress*.7,0,Math.PI*2);c.fill();}
        }
        c.restore();
    };
    Game.prototype.render=function(){
        var c=this.ctx2d;c.clearRect(0,0,W,H);
        var bg=c.createLinearGradient(0,0,0,H);bg.addColorStop(0,this.stageSky[0]);bg.addColorStop(0.58,this.stageSky[1]);bg.addColorStop(1,this.stageSky[2]);c.fillStyle=bg;c.fillRect(0,0,W,H);
        c.globalAlpha=.45;c.fillStyle='#fff';for(var i=0;i<7;i++){c.beginPath();c.arc(82+i*142,60+(i%3)*238,16+(i%2)*9,0,Math.PI*2);c.fill();}c.globalAlpha=1;
        this.drawThemeBackdrop(c);
        this.roundRect(c,18,18,W-36,H-36,38,'rgba(255,255,255,.24)','rgba(255,255,255,.72)');
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
            if(br.buffCarrier){
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
        this.drawHazard(c);this.drawSeedSystem(c);this.drawStageFiveItems(c);this.drawItemNotices(c);
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
        var b=this.ball;this.drawBall(c);
        if(this.characterView)this.characterView.render(p.x,p.y,p.vx||0,this.frameDt||.016,{x:b.x,y:b.y,vy:b.vy,paddleWidth:p.w});
        this.updateHud();
    };

    Game.prototype.loop=function(now){
        if(!this.running)return;var dt=Math.min(.04,Math.max(0,(now-this.last)/1000||.016));this.last=now;
        this.frameDt=dt;this.update(dt);this.render();var self=this;this.raf=requestAnimationFrame(function(t){self.loop(t);});
    };

    Game.prototype.destroy=function(){
        this.running=false;if(this.raf)cancelAnimationFrame(this.raf);
        if(this.missTimer){clearTimeout(this.missTimer);this.missTimer=0;}
        window.removeEventListener('keydown',this.boundKeyDown,true);window.removeEventListener('keyup',this.boundKeyUp,true);
        this.canvas.removeEventListener('pointerdown',this.boundPointer);this.canvas.removeEventListener('pointermove',this.boundPointer);this.root.removeEventListener('click',this.boundClick);
        if(this.characterView)this.characterView.destroy();
        if(this.audioCtx&&this.audioCtx.state!=='closed'&&this.audioCtx.close)this.audioCtx.close().catch(function(){});
        if(this.root.parentNode)this.root.parentNode.removeChild(this.root);
    };

    window.DanboBrickBreaker={create:function(options){return new Game(options);}};
})();
