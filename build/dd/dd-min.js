YUI.add("dd-ddm-base",function(B){var A=function(){A.superclass.constructor.apply(this,arguments);};A.NAME="dragDropMgr";A.ATTRS={clickPixelThresh:{value:3},clickTimeThresh:{value:1000},dragMode:{value:"point",set:function(C){this._setDragMode(C);}}};B.extend(A,B.Base,{_setDragMode:function(C){if(C===null){C=B.DD.DDM.get("dragMode");}switch(C){case 1:case"intersect":return 1;case 2:case"strict":return 2;case 0:case"point":return 0;}return 0;},CSS_PREFIX:"yui-dd",_activateTargets:function(){},_drags:[],activeDrag:false,_regDrag:function(C){this._drags[this._drags.length]=C;},_unregDrag:function(D){var C=[];B.each(this._drags,function(F,E){if(F!==D){C[C.length]=F;}});this._drags=C;},initializer:function(){B.Node.get("document").on("mousemove",this._move,this,true);B.Node.get("document").on("mouseup",this._end,this,true);},_start:function(C,F,D,E){this._startDrag.apply(this,arguments);},_startDrag:function(){},_endDrag:function(){},_dropMove:function(){},_end:function(){if(this.activeDrag){this._endDrag();this.activeDrag.end.call(this.activeDrag);this.activeDrag=null;}},stopDrag:function(){if(this.activeDrag){this._end();}return this;},_move:function(C){if(this.activeDrag){this.activeDrag._move.apply(this.activeDrag,arguments);this._dropMove();}},setXY:function(E,F){var D=parseInt(E.getStyle("top"),10),C=parseInt(E.getStyle("left"),10),G=E.getStyle("position");if(G==="static"){E.setStyle("position","relative");}if(isNaN(D)){D=0;}if(isNaN(C)){C=0;}E.setStyle("top",(F[1]+D)+"px");E.setStyle("left",(F[0]+C)+"px");},cssSizestoObject:function(D){var C=D.split(" ");switch(C.length){case 1:C[1]=C[2]=C[3]=C[0];break;case 2:C[2]=C[0];C[3]=C[1];break;case 3:C[3]=C[1];break;}return{top:parseInt(C[0],10),right:parseInt(C[1],10),bottom:parseInt(C[2],10),left:parseInt(C[3],10)};},getDrag:function(D){var C=false,E=B.Node.get(D);if(E instanceof B.Node){B.each(this._drags,function(G,F){if(E.compareTo(G.get("node"))){C=G;}});}return C;}});B.namespace("DD");B.DD.DDM=new A();},"@VERSION@",{requires:["node","base"],skinnable:false});YUI.add("dd-ddm",function(A){A.mix(A.DD.DDM,{_pg:null,_debugShim:false,_activateTargets:function(){},_deactivateTargets:function(){},_startDrag:function(){if(this.activeDrag.get("useShim")){this._pg_activate();this._activateTargets();}},_endDrag:function(){this._pg_deactivate();this._deactivateTargets();},_pg_deactivate:function(){this._pg.setStyle("display","none");},_pg_activate:function(){this._pg_size();this._pg.setStyles({top:0,left:0,display:"block",opacity:((this._debugShim)?".5":"0")});},_pg_size:function(){if(this.activeDrag){var B=A.Node.get("body"),D=B.get("docHeight"),C=B.get("docWidth");this._pg.setStyles({height:D+"px",width:C+"px"});}},_createPG:function(){var C=A.Node.create("<div></div>"),B=A.Node.get("body");C.setStyles({top:"0",left:"0",position:"absolute",zIndex:"9999",overflow:"hidden",backgroundColor:"red",display:"none",height:"5px",width:"5px"});if(B.get("firstChild")){B.insertBefore(C,B.get("firstChild"));}else{B.appendChild(C);}this._pg=C;this._pg.on("mouseup",this._end,this,true);this._pg.on("mousemove",this._move,this,true);A.on("resize",this._pg_size,window,this,true);A.on("scroll",this._pg_size,window,this,true);}},true);A.DD.DDM._createPG();},"@VERSION@",{requires:["dd-ddm-base"],skinnable:false});YUI.add("dd-ddm-drop",function(A){A.mix(A.DD.DDM,{_noShim:false,_activeShims:[],_hasActiveShim:function(){if(this._noShim){return true;}return this._activeShims.length;},_addActiveShim:function(B){this._activeShims[this._activeShims.length]=B;},_removeActiveShim:function(C){var B=[];A.each(this._activeShims,function(E,D){if(E._yuid!==C._yuid){B[B.length]=E;}});this._activeShims=B;},syncActiveShims:function(B){var C=((B)?this.targets:this._lookup());A.each(C,function(E,D){E.sizeShim.call(E);},this);return C;},mode:0,POINT:0,INTERSECT:1,STRICT:2,useHash:true,activeDrop:null,validDrops:[],otherDrops:{},targets:[],_addValid:function(B){this.validDrops[this.validDrops.length]=B;return this;},_removeValid:function(B){var C=[];A.each(this.validDrops,function(E,D){if(E!==B){C[C.length]=E;}});this.validDrops=C;return this;},isOverTarget:function(B){if(this.activeDrag&&B){var C=this.activeDrag.mouseXY;if(C){if(this.activeDrag.get("dragMode")==this.STRICT){return this.activeDrag.get("dragNode").inRegion(B.region,true,this.activeDrag.region);}else{if(B&&B.shim){return B.shim.intersect({top:C[1],bottom:C[1],left:C[0],right:C[0]},B.region).inRegion;}else{return false;}}}else{return false;}}else{return false;}},clearCache:function(){this.validDrops=[];this.otherDrops={};this._activeShims=[];},_activateTargets:function(){this.clearCache();A.each(this.targets,function(C,B){C._activateShim.apply(C,[]);},this);this._handleTargetOver();},getBestMatch:function(F,D){var C=null,E=0;A.each(F,function(I,H){var G=this.activeDrag.get("dragNode").intersect(I.get("node"));I.region.area=G.area;if(G.inRegion){if(G.area>E){E=G.area;C=I;}}},this);if(D){var B=[];A.each(F,function(H,G){if(H!==C){B[B.length]=H;}},this);return[C,B];}else{return C;}},_deactivateTargets:function(){var B=[],E=this.activeDrag,D=this.activeDrop;if(E&&D&&this.otherDrops[D]){if(!E.get("dragMode")){B=this.otherDrops;delete B[D];}else{var C=this.getBestMatch(this.otherDrops,true);D=C[0];B=C[1];}E.get("node").removeClass(this.CSS_PREFIX+"-drag-over");if(D){D.fire("drop:hit",{drag:E,drop:D,others:B});E.fire("drag:drophit",{drag:E,drop:D,others:B});}}else{if(E){E.get("node").removeClass(this.CSS_PREFIX+"-drag-over");E.fire("drag:dropmiss",{pageX:E.lastXY[0],pageY:E.lastXY[1]});}else{}}this.activeDrop=null;A.each(this.targets,function(G,F){G._deactivateShim.apply(G,[]);},this);},_dropMove:function(){if(this._hasActiveShim()){this._handleTargetOver();}else{A.each(this.otherDrops,function(C,B){C._handleOut.apply(C,[]);});}},_lookup:function(){if(!this.useHash){return this.validDrops;}var B=[];A.each(this.validDrops,function(D,C){if(D.shim&&D.shim.inViewportRegion(false,D.region)){B[B.length]=D;}});return B;},_handleTargetOver:function(){var B=this._lookup();
A.each(B,function(D,C){D._handleTargetOver.call(D);},this);},_regTarget:function(B){this.targets[this.targets.length]=B;},_unregTarget:function(C){var B=[];A.each(this.targets,function(F,E){if(F!=C){B[B.length]=F;}},this);this.targets=B;var D=[];A.each(this.validDrops,function(F,E){if(F!==C){D[D.length]=F;}});this.validDrops=D;},getDrop:function(C){var B=false,D=A.Node.get(C);if(D instanceof A.Node){A.each(this.targets,function(F,E){if(D.compareTo(F.get("node"))){B=F;}});}return B;}},true);},"@VERSION@",{requires:["dd-ddm"],skinnable:false});YUI.add("dd-drag",function(D){var E=D.DD.DDM,S="node",M="dragNode",C="offsetHeight",J="offsetWidth",Q="mouseup",O="mousedown",L="dragstart",G="drag:mouseDown",B="drag:afterMouseDown",F="drag:removeHandle",K="drag:addHandle",P="drag:removeInvalid",R="drag:addInvalid",I="drag:start",H="drag:end",N="drag:drag";var A=function(){A.superclass.constructor.apply(this,arguments);E._regDrag(this);};A.NAME="drag";A.ATTRS={node:{set:function(T){var U=D.get(T);if(!U){D.fail("DD.Drag: Invalid Node Given: "+T);}else{U=U.item(0);}return U;}},dragNode:{set:function(T){var U=D.Node.get(T);if(!U){D.fail("DD.Drag: Invalid dragNode Given: "+T);}return U;}},offsetNode:{value:true},clickPixelThresh:{value:E.get("clickPixelThresh")},clickTimeThresh:{value:E.get("clickTimeThresh")},lock:{value:false,set:function(T){if(T){this.get(S).addClass(E.CSS_PREFIX+"-locked");}else{this.get(S).removeClass(E.CSS_PREFIX+"-locked");}}},data:{value:false},move:{value:true},useShim:{value:true},activeHandle:{value:false},primaryButtonOnly:{value:true},dragging:{value:false},parent:{value:false},target:{value:false,set:function(T){this._handleTarget(T);}},dragMode:{value:null,set:function(T){return E._setDragMode(T);}},groups:{value:["default"],get:function(){if(!this._groups){this._groups={};}var T=[];D.each(this._groups,function(V,U){T[T.length]=U;});return T;},set:function(T){this._groups={};D.each(T,function(V,U){this._groups[V]=true;},this);}},handles:{value:null,set:function(T){if(T){this._handles={};D.each(T,function(V,U){this._handles[V]=true;},this);}else{this._handles=null;}return T;}},bubbles:{writeOnce:true,value:D.DD.DDM}};D.extend(A,D.Base,{addToGroup:function(T){this._groups[T]=true;E._activateTargets();return this;},removeFromGroup:function(T){delete this._groups[T];E._activateTargets();return this;},target:null,_handleTarget:function(T){if(D.DD.Drop){if(T===false){if(this.target){E._unregTarget(this.target);this.target=null;}return false;}else{if(!D.Lang.isObject(T)){T={};}T.bubbles=this.get("bubbles");T.node=this.get(S);this.target=new D.DD.Drop(T);}}else{return false;}},_groups:null,_createEvents:function(){this.publish(G,{defaultFn:this._handleMouseDown,queuable:true,emitFacade:true,bubbles:true});var T=[B,F,K,P,R,I,H,N,"drag:drophit","drag:dropmiss","drag:over","drag:enter","drag:exit"];D.each(T,function(V,U){this.publish(V,{type:V,emitFacade:true,bubbles:true,preventable:false,queuable:true});},this);if(this.get("bubbles")){this.addTarget(this.get("bubbles"));}},_ev_md:null,_startTime:null,_endTime:null,_handles:null,_invalids:null,_invalidsDefault:{"textarea":true,"input":true,"a":true,"button":true},_dragThreshMet:null,_fromTimeout:null,_clickTimeout:null,deltaXY:null,startXY:null,nodeXY:null,lastXY:null,realXY:null,mouseXY:null,region:null,_handleMouseUp:function(T){this._fixIEMouseUp();if(E.activeDrag){E._end();}},_fixDragStart:function(T){T.preventDefault();},_ieSelectFix:function(){return false;},_ieSelectBack:null,_fixIEMouseDown:function(){if(D.UA.ie){this._ieSelectBack=D.config.doc.body.onselectstart;D.config.doc.body.onselectstart=this._ieSelectFix;}},_fixIEMouseUp:function(){if(D.UA.ie){D.config.doc.body.onselectstart=this._ieSelectBack;}},_handleMouseDownEvent:function(T){this.fire(G,{ev:T});},_handleMouseDown:function(V){var U=V.ev;this._dragThreshMet=false;this._ev_md=U;if(this.get("primaryButtonOnly")&&U.button>1){return false;}if(this.validClick(U)){this._fixIEMouseDown();U.halt();this._setStartPosition([U.pageX,U.pageY]);E.activeDrag=this;var T=this;this._clickTimeout=setTimeout(function(){T._timeoutCheck.call(T);},this.get("clickTimeThresh"));}this.fire(B,{ev:U});},validClick:function(X){var W=false,T=X.target,V=null;if(this._handles){D.each(this._handles,function(Z,a){if(D.Lang.isString(a)){if(T.test(a+", "+a+" *")&&!V){V=a;W=true;}}});}else{if(this.get(S).contains(T)||this.get(S).compareTo(T)){W=true;}}if(W){if(this._invalids){D.each(this._invalids,function(Z,a){if(D.Lang.isString(a)){if(T.test(a+", "+a+" *")){W=false;}}});}}if(W){if(V){var U=X.currentTarget.queryAll(V),Y=false;U.each(function(a,Z){if((a.contains(T)||a.compareTo(T))&&!Y){Y=true;this.set("activeHandle",U.item(Z));}},this);}else{this.set("activeHandle",this.get(S));}}return W;},_setStartPosition:function(T){this.startXY=T;this.nodeXY=this.get(S).getXY();this.lastXY=this.nodeXY;this.realXY=this.nodeXY;if(this.get("offsetNode")){this.deltaXY=[(this.startXY[0]-this.nodeXY[0]),(this.startXY[1]-this.nodeXY[1])];}else{this.deltaXY=[0,0];}},_timeoutCheck:function(){if(!this.get("lock")){this._fromTimeout=true;this._dragThreshMet=true;this.start();this._moveNode([this._ev_md.pageX,this._ev_md.pageY],true);}},removeHandle:function(T){if(this._handles[T]){delete this._handles[T];this.fire(F,{handle:T});}return this;},addHandle:function(T){if(!this._handles){this._handles={};}if(D.Lang.isString(T)){this._handles[T]=true;this.fire(K,{handle:T});}return this;},removeInvalid:function(T){if(this._invalids[T]){this._invalids[T]=null;delete this._invalids[T];this.fire(P,{handle:T});}return this;},addInvalid:function(T){if(D.Lang.isString(T)){this._invalids[T]=true;this.fire(R,{handle:T});}else{}return this;},initializer:function(){if(!this.get(S).get("id")){var T=D.stamp(this.get(S));this.get(S).set("id",T);}this._invalids=D.clone(this._invalidsDefault,true);this._createEvents();if(!this.get(M)){this.set(M,this.get(S));}this._prep();this._dragThreshMet=false;},_prep:function(){var T=this.get(S);T.addClass(E.CSS_PREFIX+"-draggable");
T.on(O,this._handleMouseDownEvent,this,true);T.on(Q,this._handleMouseUp,this,true);T.on(L,this._fixDragStart,this,true);},_unprep:function(){var T=this.get(S);T.removeClass(E.CSS_PREFIX+"-draggable");T.detach(O,this._handleMouseDownEvent,this,true);T.detach(Q,this._handleMouseUp,this,true);T.detach(L,this._fixDragStart,this,true);},start:function(){if(!this.get("lock")&&!this.get("dragging")){this.set("dragging",true);E._start(this.deltaXY,[this.get(S).get(C),this.get(S).get(J)]);this.get(S).addClass(E.CSS_PREFIX+"-dragging");this.fire(I,{pageX:this.nodeXY[0],pageY:this.nodeXY[1]});this.get(M).on(Q,this._handleMouseUp,this,true);var T=this.nodeXY;this._startTime=(new Date()).getTime();this.region={"0":T[0],"1":T[1],area:0,top:T[1],right:T[0]+this.get(S).get(J),bottom:T[1]+this.get(S).get(C),left:T[0]};}return this;},end:function(){this._endTime=(new Date()).getTime();clearTimeout(this._clickTimeout);this._dragThreshMet=false;this._fromTimeout=false;if(!this.get("lock")&&this.get("dragging")){this.fire(H,{pageX:this.lastXY[0],pageY:this.lastXY[1]});}this.get(S).removeClass(E.CSS_PREFIX+"-dragging");this.set("dragging",false);this.deltaXY=[0,0];this.get(M).detach(Q,this._handleMouseUp,this,true);return this;},_align:function(T){return[T[0]-this.deltaXY[0],T[1]-this.deltaXY[1]];},_moveNode:function(T,Y){var X=this._align(T),U=[],V=[];U[0]=(X[0]-this.lastXY[0]);U[1]=(X[1]-this.lastXY[1]);V[0]=(X[0]-this.nodeXY[0]);V[1]=(X[1]-this.nodeXY[1]);if(this.get("move")){if(D.UA.opera){this.get(M).setXY(X);}else{E.setXY(this.get(M),U);}this.realXY=X;}this.region={"0":X[0],"1":X[1],area:0,top:X[1],right:X[0]+this.get(M).get(J),bottom:X[1]+this.get(M).get(C),left:X[0]};var W=this.nodeXY;if(!Y){this.fire(N,{pageX:X[0],pageY:X[1],info:{start:W,xy:X,delta:U,offset:V}});}this.lastXY=X;},_move:function(V){if(this.get("lock")){return false;}else{this.mouseXY=[V.pageX,V.pageY];if(!this._dragThreshMet){var U=Math.abs(this.startXY[0]-V.pageX);var T=Math.abs(this.startXY[1]-V.pageY);if(U>this.get("clickPixelThresh")||T>this.get("clickPixelThresh")){this._dragThreshMet=true;this.start();this._moveNode([V.pageX,V.pageY]);}}else{clearTimeout(this._clickTimeout);this._moveNode([V.pageX,V.pageY]);}}},stopDrag:function(){if(this.get("dragging")){E._end();}return this;},destructor:function(){E._unregDrag(this);this._unprep();if(this.target){this.target.destroy();}}});D.namespace("DD");D.DD.Drag=A;},"@VERSION@",{requires:["dd-ddm-base"],skinnable:false});YUI.add("dd-proxy",function(F){var E=F.DD.DDM,A="node",B="dragNode",C="proxy";var G=function(){G.superclass.constructor.apply(this,arguments);};G.NAME="dragProxy";G.ATTRS={moveOnEnd:{value:true},resizeFrame:{value:true},proxy:{value:false},positionProxy:{value:true},borderStyle:{value:"1px solid #808080"}};var D={_createFrame:function(){if(!E._proxy){E._proxy=true;var I=F.Node.create("<div></div>");I.setStyles({position:"absolute",display:"none",zIndex:"999",top:"-999px",left:"-999px",border:this.get("borderStyle")});var H=F.Node.get("body");H.insertBefore(I,H.get("firstChild"));I.set("id",F.stamp(I));I.addClass(E.CSS_PREFIX+"-proxy");E._proxy=I;}},_setFrame:function(){var H=this.get(A);if(this.get("resizeFrame")){E._proxy.setStyles({height:H.get("offsetHeight")+"px",width:H.get("offsetWidth")+"px"});}this.get(B).setStyles({visibility:"hidden",display:"block",border:this.get("borderStyle")});if(this.get("positionProxy")){this.get(B).setXY(this.nodeXY);}this.get(B).setStyle("visibility","visible");},initializer:function(){if(this.get(C)){this._createFrame();}},start:function(){if(!this.get("lock")){if(this.get(C)){if(this.get(B).compareTo(this.get(A))){this.set(B,E._proxy);}}else{this.set(B,this.get(A));}}G.superclass.start.apply(this);if(this.get(C)){this._setFrame();}},end:function(){if(this.get(C)&&this.get("dragging")){if(this.get("moveOnEnd")){this.get(A).setXY(this.lastXY);}this.get(B).setStyle("display","none");}G.superclass.end.apply(this);}};F.extend(G,F.DD.Drag,D);F.DD.Drag=G;},"@VERSION@",{requires:["dd-ddm","dd-drag"],skinnable:false});YUI.add("dd-constrain",function(E){var A="dragNode",G="offsetHeight",F="offsetWidth";var D=function(){D.superclass.constructor.apply(this,arguments);};D.NAME="dragConstrained";D.ATTRS={stickX:{value:false},stickY:{value:false},tickX:{value:false},tickY:{value:false},tickXArray:{value:false},tickYArray:{value:false},constrain2region:{value:false,get:function(C){if(E.Lang.isObject(C)){var H={};E.mix(H,C);return H;}else{return false;}},set:function(C){if(E.Lang.isObject(C)){if(C.top&&C.right&&C.left&&C.bottom){var H={};E.mix(H,C);return H;}else{return false;}}else{if(C!==false){return false;}}}},gutter:{value:"0",set:function(C){return E.DD.DDM.cssSizestoObject(C);}},constrain2node:{value:false,set:function(H){if(!this.get("constrain2region")){var C=E.Node.get(H);if(C){return C;}}else{if(this.get("constrain2region")!==false){}}return false;}},constrain2view:{value:false}};var B={start:function(){D.superclass.start.apply(this,arguments);this._regionCache=null;},_regionCache:null,_cacheRegion:function(){this._regionCache=this.get("constrain2node").get("region");},getRegion:function(K){var I={};if(this.get("constrain2node")){if(!this._regionCache){E.on("resize",this._cacheRegion,this,true,window);this._cacheRegion();}I=E.clone(this._regionCache);}else{if(this.get("constrain2region")){I=this.get("constrain2region");}else{if(this.get("constrain2view")){I=this.get("node").get("viewportRegion");}else{return false;}}}var H=this.get("gutter");E.each(H,function(L,M){if((M=="right")||(M=="bottom")){I[M]-=L;}else{I[M]+=L;}});if(K){var J=this.get(A).get(G),C=this.get(A).get(F);I.right=I.right-C;I.bottom=I.bottom-J;}return I;},_checkRegion:function(C){var I=C,J=this.getRegion(),K=this.get(A).get(G),H=this.get(A).get(F);if(I[1]>(J.bottom-K)){C[1]=(J.bottom-K);}if(J.top>I[1]){C[1]=J.top;}if(I[0]>(J.right-H)){C[0]=(J.right-H);}if(J.left>I[0]){C[0]=J.left;}return C;},inRegion:function(I){I=I||this.get(A).getXY();var H=this._checkRegion([I[0],I[1]]),C=false;
if((I[0]===H[0])&&(I[1]===H[1])){C=true;}return C;},_align:function(I){var C=D.superclass._align.apply(this,arguments),H=this.getRegion(true);if(this.get("stickX")){C[1]=(this.startXY[1]-this.deltaXY[1]);}if(this.get("stickY")){C[0]=(this.startXY[0]-this.deltaXY[0]);}if(H){C=this._checkRegion(C);}C=this._checkTicks(C,H);return C;},_calcTicks:function(N,M,J,L,K){var H=((N-M)/J),I=Math.floor(H),C=Math.ceil(H);if((I!==0)||(C!==0)){if((H>=I)&&(H<=C)){N=(M+(J*I));if(L&&K){if(N<L){N=(M+(J*(I+1)));}if(N>K){N=(M+(J*(I-1)));}}}}return N;},_calcTickArray:function(O,P,N,K){var H=0,L=P.length,J=0;if(!P||(P.length===0)){return O;}else{if(P[0]>=O){return P[0];}else{for(H=0;H<L;H++){J=(H+1);if(P[J]&&P[J]>=O){var I=O-P[H],C=P[J]-O;var M=(C>I)?P[H]:P[J];if(N&&K){if(M>K){if(P[H]){M=P[H];}else{M=P[L-1];}}}return M;}}return P[P.length-1];}}},_checkTicks:function(L,J){var K=(this.startXY[0]-this.deltaXY[0]),I=(this.startXY[1]-this.deltaXY[1]),C=this.get("tickX"),H=this.get("tickY");if(C&&!this.get("tickXArray")){L[0]=this._calcTicks(L[0],K,C,J.left,J.right);}if(H&&!this.get("tickYArray")){L[1]=this._calcTicks(L[1],I,H,J.top,J.bottom);}if(this.get("tickXArray")){L[0]=this._calcTickArray(L[0],this.get("tickXArray"),J.left,J.right);}if(this.get("tickYArray")){L[1]=this._calcTickArray(L[1],this.get("tickYArray"),J.top,J.bottom);}return L;}};E.extend(D,E.DD.Drag,B);E.DD.Drag=D;},"@VERSION@",{requires:["dd-drag","dd-proxy"],skinnable:false});YUI.add("dd-plugin",function(B){var A=function(C){C.node=C.owner;A.superclass.constructor.apply(this,arguments);};A.NAME="dd-plugin";A.NS="dd";B.extend(A,B.DD.Drag);B.namespace("plugin");B.plugin.Drag=A;},"@VERSION@",{optional:["dd-constrain","dd-proxy"],requires:["dd-drag"],skinnable:false});YUI.add("dd-drop",function(A){var B="node",G=A.DD.DDM,F="offsetHeight",C="offsetWidth",I="drop:over",H="drop:enter",D="drop:exit";var E=function(){E.superclass.constructor.apply(this,arguments);this._createShim();G._regTarget(this);};E.NAME="drop";E.ATTRS={node:{set:function(J){var K=A.Node.get(J);if(!K){A.fail("DD.Drop: Invalid Node Given: "+J);}return K;}},groups:{value:["default"],set:function(J){this._groups={};A.each(J,function(L,K){this._groups[L]=true;},this);}},padding:{value:"0",set:function(J){return G.cssSizestoObject(J);}},lock:{value:false,set:function(J){if(J){this.get(B).addClass(G.CSS_PREFIX+"-drop-locked");}else{this.get(B).removeClass(G.CSS_PREFIX+"-drop-locked");}}},bubbles:{writeOnce:true,value:A.DD.DDM}};A.extend(E,A.Base,{_createEvents:function(){var J=[I,H,D,"drop:hit"];A.each(J,function(L,K){this.publish(L,{type:L,emitFacade:true,preventable:false,bubbles:true,queuable:true});},this);if(this.get("bubbles")){this.addTarget(this.get("bubbles"));}},_valid:null,_groups:null,shim:null,region:null,overTarget:null,inGroup:function(J){this._valid=false;var K=false;A.each(J,function(M,L){if(this._groups[M]){K=true;this._valid=true;}},this);return K;},initializer:function(){this._createEvents();var J=this.get(B);if(!J.get("id")){var K=A.stamp(J);J.set("id",K);}J.addClass(G.CSS_PREFIX+"-drop");},destructor:function(){G._unregTarget(this);if(this.shim){this.shim.get("parentNode").removeChild(this.shim);this.shim=null;}this.get(B).removeClass(G.CSS_PREFIX+"-drop");},_deactivateShim:function(){this.get(B).removeClass(G.CSS_PREFIX+"-drop-active-valid");this.get(B).removeClass(G.CSS_PREFIX+"-drop-active-invalid");this.get(B).removeClass(G.CSS_PREFIX+"-drop-over");this.shim.setStyles({top:"-999px",left:"-999px"});this.overTarget=false;},_activateShim:function(){if(!G.activeDrag){return false;}if(this.get(B)===G.activeDrag.get(B)){return false;}if(this.get("lock")){return false;}var J=this.get(B);if(this.inGroup(G.activeDrag.get("groups"))){J.removeClass(G.CSS_PREFIX+"-drop-active-invalid");J.addClass(G.CSS_PREFIX+"-drop-active-valid");G._addValid(this);this.overTarget=false;this.sizeShim();}else{G._removeValid(this);J.removeClass(G.CSS_PREFIX+"-drop-active-valid");J.addClass(G.CSS_PREFIX+"-drop-active-invalid");}},sizeShim:function(){if(!G.activeDrag){return false;}if(this.get(B)===G.activeDrag.get(B)){return false;}if(this.get("lock")){return false;}var O=this.get(B),M=O.get(F),K=O.get(C),Q=O.getXY(),P=this.get("padding");K=K+P.left+P.right;M=M+P.top+P.bottom;Q[0]=Q[0]-P.left;Q[1]=Q[1]-P.top;if(G.activeDrag.get("dragMode")===G.INTERSECT){var J=G.activeDrag,N=J.get(B).get(F),L=J.get(B).get(C);M=(M+N);K=(K+L);Q[0]=Q[0]-(L-J.deltaXY[0]);Q[1]=Q[1]-(N-J.deltaXY[1]);}this.shim.setStyles({height:M+"px",width:K+"px",top:Q[1]+"px",left:Q[0]+"px"});this.region={"0":Q[0],"1":Q[1],area:0,top:Q[1],right:Q[0]+K,bottom:Q[1]+M,left:Q[0]};},_createShim:function(){var J=A.Node.create('<div id="'+this.get(B).get("id")+'_shim"></div>');J.setStyles({height:this.get(B).get(F)+"px",width:this.get(B).get(C)+"px",backgroundColor:"yellow",opacity:".5",zIndex:999,overflow:"hidden",top:"-900px",left:"-900px",position:"absolute"});G._pg.appendChild(J);this.shim=J;J.on("mouseover",this._handleOverEvent,this,true);J.on("mouseout",this._handleOutEvent,this,true);},_handleTargetOver:function(){if(G.isOverTarget(this)){this.get(B).addClass(G.CSS_PREFIX+"-drop-over");G.activeDrop=this;G.otherDrops[this]=this;if(this.overTarget){G.activeDrag.fire("drag:over",{drop:this,drag:G.activeDrag});this.fire(I,{drop:this,drag:G.activeDrag});}else{this.overTarget=true;this.fire(H,{drop:this,drag:G.activeDrag});G.activeDrag.fire("drag:enter",{drop:this,drag:G.activeDrag});G.activeDrag.get(B).addClass(G.CSS_PREFIX+"-drag-over");G._handleTargetOver();}}else{this._handleOut();}},_handleOverEvent:function(){G._addActiveShim(this);},_handleOutEvent:function(){G._removeActiveShim(this);},_handleOut:function(){if(!G.isOverTarget(this)){if(this.overTarget){this.overTarget=false;G._removeActiveShim(this);if(G.activeDrag){this.get(B).removeClass(G.CSS_PREFIX+"-drop-over");G.activeDrag.get(B).removeClass(G.CSS_PREFIX+"-drag-over");this.fire(D);G.activeDrag.fire("drag:exit",{drop:this});delete G.otherDrops[this];}}}}});A.DD.Drop=E;},"@VERSION@",{requires:["dd-ddm-drop","dd-drag"],skinnable:false});
YUI.add("dd-drop-plugin",function(A){var B=function(C){C.node=C.owner;B.superclass.constructor.apply(this,arguments);};B.NAME="dd-drop-plugin";B.NS="drop";A.extend(B,A.DD.Drop);A.namespace("plugin");A.plugin.Drop=B;},"@VERSION@",{requires:["dd-drop"],skinnable:false});YUI.add("dd",function(A){},"@VERSION@",{use:["dd-ddm-base","dd-ddm","dd-ddm-drop","dd-drag","dd-proxy","dd-constrain","dd-plugin","dd-drop","dd-drop-plugin"],skinnable:false});