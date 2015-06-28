!function(t){"use strict";function i(t,i){for(var n in i)i.hasOwnProperty(n)&&(t[n]=i[n]);return t}function n(t){this.options=i({},this.options),i(this.options,t),this._init()}var s={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",msTransition:"MSTransitionEnd",transition:"transitionend"},o=s[Modernizr.prefixed("transition")];n.prototype.options={elementId:"svg"},n.prototype._init=function(){this.svg=document.getElementById(this.options.elementId),this.paths=this.svg.querySelectorAll("path"),this._initAnimation()},n.prototype._initAnimation=function(){for(var t=0;t<this.paths.length;t++){var i=this.paths[t],n=i.getTotalLength();i.style.fillOpacity=0,i.style.strokeOpacity=1,i.style.transition=i.style.WebkitTransition="none",i.style.strokeDasharray=n+" "+n,i.style.strokeDashoffset=n,i.getBoundingClientRect(),i.style.transition=i.style.WebkitTransition="stroke-dashoffset 2s ease-in-out",i.style.strokeDashoffset=0,this._fillPath(i)}},n.prototype._fillPath=function(t){t.addEventListener(o,function(){t.style.transition=t.style.WebkitTransition="none",t.style.transition=t.style.WebkitTransition="fill-opacity 1s ease-in-out, stroke-opacity 1s ease-in-out",t.style.fillOpacity=1,t.style.strokeOpacity=0})},n.prototype.replay=function(){this._initAnimation()},t.DrawFillSVG=n}(window);