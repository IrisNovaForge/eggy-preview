(function(){
    'use strict';

    var scriptUrl=(document.currentScript&&document.currentScript.src)||'';
    var base=window.DANBO_BRICK_BREAKER_BASE_URL||(scriptUrl?new URL('.',scriptUrl).href:'plugins/brick-breaker/');
    var outPtr=0,outView=null;
    var api={mode:'js-fallback',exports:null,ready:null};

    function n(value){value=Number(value);return Number.isFinite(value)?value:0;}
    function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
    function readOut(count){
        if(!outView&&api.exports&&api.exports.memory)outView=new Float64Array(api.exports.memory.buffer,outPtr,count);
        return outView;
    }

    api.clampPaddle=function(x,paddleWidth,boardWidth){
        var e=api.exports;x=n(x);paddleWidth=n(paddleWidth);boardWidth=n(boardWidth);
        return e&&e.danbo_brick_breaker_clamp_paddle?e.danbo_brick_breaker_clamp_paddle(x,paddleWidth,boardWidth):clamp(x,paddleWidth*.5,boardWidth-paddleWidth*.5);
    };
    api.circleRectHit=function(cx,cy,radius,x,y,w,h){
        var e=api.exports;cx=n(cx);cy=n(cy);radius=n(radius);x=n(x);y=n(y);w=n(w);h=n(h);
        if(e&&e.danbo_brick_breaker_circle_rect_hit)return !!e.danbo_brick_breaker_circle_rect_hit(cx,cy,radius,x,y,w,h);
        var nx=clamp(cx,x,x+w),ny=clamp(cy,y,y+h),dx=cx-nx,dy=cy-ny;return dx*dx+dy*dy<=radius*radius;
    };
    api.paddleBounce=function(ballX,paddleX,paddleWidth,speed){
        var e=api.exports;ballX=n(ballX);paddleX=n(paddleX);paddleWidth=n(paddleWidth);speed=n(speed);
        if(e&&e.danbo_brick_breaker_paddle_bounce){e.danbo_brick_breaker_paddle_bounce(ballX,paddleX,paddleWidth,speed);var out=readOut(2);return {vx:out[0],vy:out[1]};}
        var offset=clamp((ballX-paddleX)/(paddleWidth*.5),-1,1),angle=offset*1.05;return {vx:Math.sin(angle)*speed,vy:-Math.max(.42,Math.cos(angle))*speed};
    };
    api.scoreForBrick=function(row){var e=api.exports;row=row|0;return e&&e.danbo_brick_breaker_score_for_brick?e.danbo_brick_breaker_score_for_brick(row):100+Math.max(0,5-row)*20;};
    api.isWin=function(remaining){var e=api.exports;remaining=remaining|0;return e&&e.danbo_brick_breaker_is_win?!!e.danbo_brick_breaker_is_win(remaining):remaining<=0;};
    api.isGameOver=function(lives){var e=api.exports;lives=lives|0;return e&&e.danbo_brick_breaker_is_game_over?!!e.danbo_brick_breaker_is_game_over(lives):lives<=0;};

    window.DANBO_BRICK_BREAKER_WASM=api;
    api.ready=fetch(base+'wasm/danbo_brick_breaker.wasm').then(function(response){
        if(!response.ok)throw new Error('WASM request failed: '+response.status);
        return response.arrayBuffer();
    }).then(function(bytes){return WebAssembly.instantiate(bytes,{});}).then(function(result){
        api.exports=result.instance.exports;
        if(api.exports.danbo_brick_breaker_out_ptr)outPtr=api.exports.danbo_brick_breaker_out_ptr();
        api.mode='wasm';return api;
    }).catch(function(error){console.warn('[brick-breaker] WASM fallback active',error);return api;});
})();
