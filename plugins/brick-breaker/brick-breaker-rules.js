(function(){
    'use strict';

    function clamp(value,min,max){return Math.max(min,Math.min(max,Number(value)||0));}

    function circleRectHit(cx,cy,radius,rect){
        var nearestX=clamp(cx,rect.x,rect.x+rect.w);
        var nearestY=clamp(cy,rect.y,rect.y+rect.h);
        var dx=cx-nearestX,dy=cy-nearestY;
        return dx*dx+dy*dy<=radius*radius;
    }

    function makeRules(){
        var wasm=window.DANBO_MINIGAME_WASM&&window.DANBO_MINIGAME_WASM.brickBreaker;
        return {
            id:'brick-breaker',
            get mode(){return wasm&&wasm.mode||'js-fallback';},
            build:2026081901,
            clampPaddle:function(x,paddleWidth,boardWidth){
                if(wasm&&wasm.clampPaddle)return wasm.clampPaddle(x,paddleWidth,boardWidth);
                return clamp(x,paddleWidth*0.5,boardWidth-paddleWidth*0.5);
            },
            circleRectHit:function(cx,cy,radius,rect){
                if(wasm&&wasm.circleRectHit)return wasm.circleRectHit(cx,cy,radius,rect.x,rect.y,rect.w,rect.h);
                return circleRectHit(cx,cy,radius,rect);
            },
            paddleBounce:function(ballX,paddleX,paddleWidth,speed){
                if(wasm&&wasm.paddleBounce)return wasm.paddleBounce(ballX,paddleX,paddleWidth,speed);
                var offset=clamp((ballX-paddleX)/(paddleWidth*0.5),-1,1);
                var angle=offset*1.05;
                return {
                    vx:Math.sin(angle)*speed,
                    vy:-Math.max(0.42,Math.cos(angle))*speed
                };
            },
            scoreForBrick:function(row){
                if(wasm&&wasm.scoreForBrick)return wasm.scoreForBrick(row);
                return 100+Math.max(0,5-(row|0))*20;
            },
            isWin:function(remaining){return wasm&&wasm.isWin?wasm.isWin(remaining):(remaining|0)<=0;},
            isGameOver:function(lives){return wasm&&wasm.isGameOver?wasm.isGameOver(lives):(lives|0)<=0;}
        };
    }

    window.DanboBrickBreakerRules={create:makeRules};
})();
