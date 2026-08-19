(function(){
    'use strict';

    var W=960,H=720;
    var COPY={
        zhs:{name:'星光弹球工坊',sub:'轻轻托住光球，清理天空中的彩色方块',start:'开始挑战',resume:'继续',restart:'重新开始',exit:'返回奇境',score:'得分',best:'最佳',lives:'光球',left:'剩余',ready:'准备发球',readyHint:'按空格、点击画面或轻触按钮发球',pause:'暂停',paused:'旅程暂停',won:'方块全部清理完成！',lost:'光球用完了',again:'再来一次',title:'返回标题',controls:'← → / A D 移动挡板；鼠标或触控可直接拖动。',basic:'基础玩法 · 无道具 · 无特殊砖块',launch:'发球'},
        zht:{name:'星光彈球工坊',sub:'輕輕托住光球，清理天空中的彩色方塊',start:'開始挑戰',resume:'繼續',restart:'重新開始',exit:'返回奇境',score:'得分',best:'最佳',lives:'光球',left:'剩餘',ready:'準備發球',readyHint:'按空白鍵、點擊畫面或輕觸按鈕發球',pause:'暫停',paused:'旅程暫停',won:'方塊全部清理完成！',lost:'光球用完了',again:'再來一次',title:'返回標題',controls:'← → / A D 移動擋板；滑鼠或觸控可直接拖動。',basic:'基礎玩法 · 無道具 · 無特殊磚塊',launch:'發球'},
        ja:{name:'星明かりのブロック工房',sub:'光のボールを受け止め、空のカラーブロックを消そう',start:'チャレンジ開始',resume:'つづける',restart:'もう一度',exit:'世界へ戻る',score:'スコア',best:'ベスト',lives:'ボール',left:'のこり',ready:'サーブの準備',readyHint:'スペース、画面クリック、またはボタンでスタート',pause:'一時停止',paused:'一時停止中',won:'すべてのブロックを消しました！',lost:'ボールがなくなりました',again:'もう一度',title:'タイトルへ',controls:'← → / A D でパドル移動。マウス・タッチ操作にも対応。',basic:'基本ルール · アイテムなし · 特殊ブロックなし',launch:'スタート'},
        en:{name:'Starlight Block Workshop',sub:'Guide the light ball and clear the colorful sky blocks',start:'Start Challenge',resume:'Resume',restart:'Restart',exit:'Return to World',score:'Score',best:'Best',lives:'Balls',left:'Left',ready:'Ready to Serve',readyHint:'Press Space, click the board, or tap the button',pause:'Pause',paused:'Journey Paused',won:'All blocks cleared!',lost:'No light balls left',again:'Play Again',title:'Back to Title',controls:'Move with ← → / A D, or guide the paddle with mouse and touch.',basic:'Basic rules · No items · No special bricks',launch:'Launch'}
    };

    function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
    function esc(s){return String(s===undefined?'':s).replace(/[&<>'"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c];});}
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
        this.rules=options.rules||(window.DanboBrickBreakerRules&&DanboBrickBreakerRules.create());
        if(!this.rules)throw new Error('BrickBreaker rules missing');
        this.storage=options.storage||{get:function(k,d){return d;},set:function(){}};
        this.best=Number(this.storage.get('bestScore',0))||0;
        this.root=document.createElement('div');
        this.root.className='bb-root';
        this.root.innerHTML=this.markup();
        options.mount.appendChild(this.root);
        this.canvas=this.root.querySelector('.bb-canvas');
        this.ctx2d=this.canvas.getContext('2d');
        this.canvas.width=W;this.canvas.height=H;
        this.overlay=this.root.querySelector('.bb-overlay');
        this.card=this.root.querySelector('.bb-card');
        this.keys={left:false,right:false};
        this.pointerX=null;
        this.running=true;this.state='title';this.last=performance.now();this.raf=0;
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
        var t=this.t;
        return '<div class="bb-sky" aria-hidden="true"><i></i><i></i><i></i></div>'+ 
            '<header class="bb-hud" aria-label="Game status">'+
              '<div class="bb-hud-pill"><span>'+esc(t.score)+'</span><b data-score>0000</b></div>'+ 
              '<div class="bb-hud-pill"><span>'+esc(t.best)+'</span><b data-best>'+this.best+'</b></div>'+ 
              '<div class="bb-hud-pill"><span>'+esc(t.lives)+'</span><b data-lives>● ● ●</b></div>'+ 
              '<div class="bb-hud-pill"><span>'+esc(t.left)+'</span><b data-left>48</b></div>'+ 
              '<button class="bb-icon-btn" data-action="pause" aria-label="'+esc(t.pause)+'">Ⅱ</button>'+ 
              '<button class="bb-exit-btn" data-action="exit">'+esc(t.exit)+'</button>'+ 
            '</header>'+
            '<main class="bb-stage"><canvas class="bb-canvas" width="960" height="720"></canvas></main>'+ 
            '<div class="bb-overlay"><section class="bb-card"></section></div>'+ 
            '<button class="bb-launch" data-action="launch">'+esc(t.launch)+'</button>'+ 
            '<footer class="bb-tip">'+esc(t.controls)+'</footer>';
    };

    Game.prototype.titleHtml=function(){var t=this.t;return '<div class="bb-mark" aria-hidden="true"><span></span><span></span><span></span></div><p class="bb-kicker">BLOCK &amp; LIGHT</p><h1>'+esc(t.name)+'</h1><p class="bb-sub">'+esc(t.sub)+'</p><button class="bb-primary" data-action="start">'+esc(t.start)+'</button><p class="bb-note">'+esc(t.basic)+'<br><small>Rules: '+esc(this.rules.mode||'local')+' · build '+esc(this.rules.build||1)+'</small></p>';};
    Game.prototype.showTitle=function(){this.state='title';this.overlay.hidden=false;this.card.innerHTML=this.titleHtml();this.root.classList.remove('bb-playing');this.updateHud();};

    Game.prototype.resetBoard=function(){
        this.score=0;this.lives=3;this.remaining=0;this.elapsed=0;
        this.paddle={x:W*0.5,y:H-76,w:154,h:22,speed:690};
        this.ball={x:W*0.5,y:H-104,vx:0,vy:0,r:11,speed:410};
        this.bricks=[];
        var cols=9,rows=6,gap=12,bw=82,bh=30,total=cols*bw+(cols-1)*gap,start=(W-total)*0.5;
        var colors=['#76cfa4','#75c8d3','#8baee8','#b7a0df','#f0a5b9','#f0c96d'];
        for(var row=0;row<rows;row++)for(var col=0;col<cols;col++){
            this.bricks.push({x:start+col*(bw+gap),y:105+row*(bh+gap),w:bw,h:bh,row:row,col:col,color:colors[row],alive:true});this.remaining++;
        }
        this.updateHud();
    };

    Game.prototype.startGame=function(){
        this.resetBoard();this.state='ready';this.root.classList.add('bb-playing');this.showReady();
        if(this.options.onEvent)this.options.onEvent('start',{score:0,lives:this.lives});
    };
    Game.prototype.showReady=function(){var t=this.t;this.overlay.hidden=false;this.card.innerHTML='<div class="bb-mini-ball">●</div><h2>'+esc(t.ready)+'</h2><p>'+esc(t.readyHint)+'</p><button class="bb-primary" data-action="launch">'+esc(t.launch)+'</button>';};
    Game.prototype.launch=function(){
        if(this.state!=='ready')return;
        var direction=(Math.floor(this.elapsed*10)%2?1:-1);
        this.ball.vx=direction*this.ball.speed*0.42;this.ball.vy=-this.ball.speed*0.91;
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

    Game.prototype.keyDown=function(e){
        if(['ArrowLeft','ArrowRight','Space','KeyA','KeyD','Escape','KeyP'].indexOf(e.code)<0)return;
        e.preventDefault();e.stopPropagation();
        if(e.code==='ArrowLeft'||e.code==='KeyA')this.keys.left=true;
        if(e.code==='ArrowRight'||e.code==='KeyD')this.keys.right=true;
        if(e.code==='Space'){
            if(this.state==='title')this.startGame();else if(this.state==='ready')this.launch();else if(this.state==='paused')this.togglePause();
        }
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
        if(action==='start')this.startGame();else if(action==='launch')this.launch();else if(action==='pause'||action==='resume')this.togglePause();else if(action==='restart')this.startGame();else if(action==='title')this.showTitle();else if(action==='exit')this.exit();
    };

    Game.prototype.exit=function(){if(this.options.onExit)this.options.onExit({status:'exit',score:this.score||0,best:this.best});else this.showTitle();};

    Game.prototype.update=function(dt){
        var dir=(this.keys.left?-1:0)+(this.keys.right?1:0);
        if(dir)this.paddle.x+=dir*this.paddle.speed*dt;
        else if(this.pointerX!==null)this.paddle.x+=(this.pointerX-this.paddle.x)*Math.min(1,dt*14);
        this.paddle.x=this.rules.clampPaddle(this.paddle.x,this.paddle.w,W);
        if(this.state==='ready'){
            this.ball.x=this.paddle.x;this.ball.y=this.paddle.y-this.ball.r-7;return;
        }
        if(this.state!=='playing')return;
        this.elapsed+=dt;
        var steps=Math.max(1,Math.ceil(dt/0.006)),step=dt/steps;
        for(var s=0;s<steps;s++)this.physicsStep(step);
    };

    Game.prototype.physicsStep=function(dt){
        var b=this.ball,p=this.paddle;
        b.x+=b.vx*dt;b.y+=b.vy*dt;
        if(b.x-b.r<26){b.x=26+b.r;b.vx=Math.abs(b.vx);}
        if(b.x+b.r>W-26){b.x=W-26-b.r;b.vx=-Math.abs(b.vx);}
        if(b.y-b.r<28){b.y=28+b.r;b.vy=Math.abs(b.vy);}
        var pr={x:p.x-p.w*0.5,y:p.y-p.h*0.5,w:p.w,h:p.h};
        if(b.vy>0&&this.rules.circleRectHit(b.x,b.y,b.r,pr)){
            b.y=pr.y-b.r-0.5;var bounce=this.rules.paddleBounce(b.x,p.x,p.w,b.speed);b.vx=bounce.vx;b.vy=bounce.vy;
        }
        for(var i=0;i<this.bricks.length;i++){
            var brick=this.bricks[i];if(!brick.alive||!this.rules.circleRectHit(b.x,b.y,b.r,brick))continue;
            brick.alive=false;this.remaining--;this.score+=this.rules.scoreForBrick(brick.row);
            var cx=clamp(b.x,brick.x,brick.x+brick.w),cy=clamp(b.y,brick.y,brick.y+brick.h),dx=b.x-cx,dy=b.y-cy;
            if(Math.abs(dx)>Math.abs(dy))b.vx=dx<0?-Math.abs(b.vx):Math.abs(b.vx);else b.vy=dy<0?-Math.abs(b.vy):Math.abs(b.vy);
            if(this.rules.isWin(this.remaining)){this.finishRound(true);return;}break;
        }
        if(b.y-b.r>H){
            this.lives--;this.updateHud();
            if(this.rules.isGameOver(this.lives)){this.finishRound(false);return;}
            this.state='ready';b.vx=b.vy=0;this.showReady();
        }
    };

    Game.prototype.updateHud=function(){
        var q=function(sel){return this.root&&this.root.querySelector(sel);}.bind(this),el;
        if((el=q('[data-score]')))el.textContent=String(this.score||0).padStart(4,'0');
        if((el=q('[data-best]')))el.textContent=this.best||0;
        if((el=q('[data-lives]')))el.textContent=new Array(Math.max(0,this.lives||0)+1).join('● ');
        if((el=q('[data-left]')))el.textContent=this.remaining||0;
        var launch=q('.bb-launch');if(launch)launch.hidden=this.state!=='ready';
    };

    Game.prototype.roundRect=function(c,x,y,w,h,r,fill,stroke){
        c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.stroke();}
    };
    Game.prototype.render=function(){
        var c=this.ctx2d;c.clearRect(0,0,W,H);
        var bg=c.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#dff7ef');bg.addColorStop(0.58,'#edf9dd');bg.addColorStop(1,'#f8e9bc');c.fillStyle=bg;c.fillRect(0,0,W,H);
        c.globalAlpha=.45;c.fillStyle='#fff';for(var i=0;i<7;i++){c.beginPath();c.arc(82+i*142,60+(i%3)*238,16+(i%2)*9,0,Math.PI*2);c.fill();}c.globalAlpha=1;
        this.roundRect(c,18,18,W-36,H-36,38,'rgba(255,255,255,.24)','rgba(255,255,255,.72)');
        for(var j=0;j<this.bricks.length;j++){
            var br=this.bricks[j];if(!br.alive)continue;
            c.save();c.shadowColor='rgba(35,92,76,.18)';c.shadowBlur=12;c.shadowOffsetY=5;this.roundRect(c,br.x,br.y,br.w,br.h,11,br.color);c.shadowColor='transparent';
            var shine=c.createLinearGradient(br.x,br.y,br.x,br.y+br.h);shine.addColorStop(0,'rgba(255,255,255,.5)');shine.addColorStop(.56,'rgba(255,255,255,.06)');shine.addColorStop(1,'rgba(37,80,69,.08)');this.roundRect(c,br.x+2,br.y+2,br.w-4,br.h-4,9,shine);c.restore();
        }
        var p=this.paddle;c.save();c.shadowColor='rgba(38,108,91,.28)';c.shadowBlur=18;c.shadowOffsetY=7;var pg=c.createLinearGradient(p.x-p.w/2,p.y,p.x+p.w/2,p.y);pg.addColorStop(0,'#63c79d');pg.addColorStop(.5,'#8ae0bb');pg.addColorStop(1,'#54bfc3');this.roundRect(c,p.x-p.w/2,p.y-p.h/2,p.w,p.h,p.h/2,pg);c.restore();
        var b=this.ball;c.save();c.shadowColor='#fff2a5';c.shadowBlur=24;c.beginPath();c.arc(b.x,b.y,b.r+2,0,Math.PI*2);c.fillStyle='#fff5a9';c.fill();c.beginPath();c.arc(b.x-3,b.y-4,b.r*.42,0,Math.PI*2);c.fillStyle='rgba(255,255,255,.9)';c.fill();c.restore();
        this.updateHud();
    };

    Game.prototype.loop=function(now){
        if(!this.running)return;var dt=Math.min(.04,Math.max(0,(now-this.last)/1000||.016));this.last=now;
        this.update(dt);this.render();var self=this;this.raf=requestAnimationFrame(function(t){self.loop(t);});
    };

    Game.prototype.destroy=function(){
        this.running=false;if(this.raf)cancelAnimationFrame(this.raf);
        window.removeEventListener('keydown',this.boundKeyDown,true);window.removeEventListener('keyup',this.boundKeyUp,true);
        this.canvas.removeEventListener('pointerdown',this.boundPointer);this.canvas.removeEventListener('pointermove',this.boundPointer);this.root.removeEventListener('click',this.boundClick);
        if(this.root.parentNode)this.root.parentNode.removeChild(this.root);
    };

    window.DanboBrickBreaker={create:function(options){return new Game(options);}};
})();
