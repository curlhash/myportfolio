!function(){function c(t,e){var a;a=o[Math.floor(Math.random()*o.length)]||"0,255,56";for(var n=0;n<t.length;n++)e.beginPath(),e.arc(t[n].x,t[n].y,t[n].radius,0,2*Math.PI),e.fillStyle="rgba("+a+", "+t[n].opacity+")",e.fill(),e.closePath()}function n(t){t=t.replace("#","");return parseInt(t.substring(0,2),16)+", "+parseInt(t.substring(2,4),16)+", "+parseInt(t.substring(4,6),16)}function t(t,e,a,n){var i=[],r={};e=n?Math.floor(Math.random()*e)+1:e,a=n?Math.floor(Math.random()*a):a;for(var o=0;o<t;o++)r={x:l.width/2,y:l.height/2,radius:e||10,opacity:a||1},i.push(r);return i}function d(t,e,a,n){for(var i=0;i<t.length;i++){var r=((new Date).getTime()-n)/2,o=.01-5e-4*i,h=e.width/2-20*i,u=e.width/2,f=e.height/2,s=r*o,l=h*Math.cos(s-.02*i)+u,m=h*Math.sin(s-.02*i)+f;t[i].x=l,t[i].y=m}a.fillStyle="rgba(0, 0, 0, 0.05)",a.fillRect(0,0,e.width,e.height),c(t,a),requestAnimFrame(function(){d(t,e,a,n)})}function e(e,a,n,i){setTimeout(function(){var t=(new Date).getTime();e(a,n,i,t)},1e3)}window.requestAnimFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)};var a,i="SPIRAL",r="EXPLOSION",o=function(t){for(var e=[],a=0;a<t.length;a++)e.push(n(t[a]));return e}(["009ab0","82efee","cfbca6","128a08"]),l=document.getElementById("myCanvas"),h=l.getContext("2d"),u=["SPIRAL","EXPLOSION"][Math.floor(2*Math.random())];u===i?(c(a=t(50,5,1,!1),h),e(d,a,l,h)):u===r?(c(a=function(t,e,a,n){var i=0,r=[],o={},h=l.width/50,u=l.width/2,f=l.height/2;e=n?Math.floor(Math.random()*e)+1:e,a=n?Math.floor(Math.random()*a):a;for(var s=0;s<t;s++)o={x:h*Math.cos(i)+u,y:h*Math.sin(i)+f,radius:e||10,opacity:a||1,theta:i},r.push(o),i+=2*Math.PI/t;return r}(50,10,1,!1),h),e(function t(e,a,n,i){for(var r=0;r<e.length;r++){var o=.01*((new Date).getTime()-i+1),h=o*Math.cos(e[r].theta)+e[r].x,u=o*Math.sin(e[r].theta)+e[r].y;e[r].x=h,e[r].y=u,e[r].radius-=.12}n.fillStyle="rgba(0, 0, 0, 0.01)",n.fillRect(0,0,a.width,a.height),c(e,n),requestAnimFrame(function(){t(e,a,n,i)})},a,l,h)):(c(a=t(50),h),e(d,a,l,h)),h.fillStyle="rgba(0, 0, 0, 0.07)",h.fillRect(0,0,l.width,l.height)}();