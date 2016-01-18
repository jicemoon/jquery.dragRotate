/**
 * Created by jicemoon on 2016/1/18.
 */
//jquery拖拽旋转扩展的封装
(function (){
	//计算pageXY相对于center的角度
	function calcAngle(pageXY, center){
		var tempX = center.x - pageXY.x;
		var tempY = center.y - pageXY.y;

		return -Math.atan2(tempX, tempY)*180/Math.PI;
	}
	//获取鼠标页面坐标
	function getPageXY(evt){
		evt.stopPropagation();
		evt.preventDefault();
		if(evt.type.search("mouse")>-1){
			//鼠标(mousedown/mousemove/mouseup)事件
			return {x:evt.clientX, y:evt.clientY};
		}
		else if(evt.type.search("touch")>-1){
			//触控(touchstart/touchmove/touchend)事件
			var touches;
			if(evt.type == "touchstart" || evt.type == "touchmove"){
				touches = evt.touches||evt.targetTouches;
			}
			else if(evt.type == "touchend"){
				touches = evt.touches||evt.changedTouches;
			}
			if(touches&&touches.length>0){
				return {x:touches[0].pageX, y:touches[0].pageY};
			}
			return null;
		}
	}
	//设置旋转角度
	function setTransformR(angle, $ele){
		var t = "rotate(" + angle + "deg)";
		$ele.css({"-webkit-transform":t,"-moz-transform":t,"-ms-transform":t,"-o-transform":t,"transform":t});
	}
	//jquery拖拽旋转扩展
	$.prototype.dragRotate = $.fn.dragRotate = function (){
		return this.each(function (index, ele){
			var $circle = $(ele);
			//旋转对象中心的页面坐标(页面绝对位置)
			var circleCenter = {x:0,y:0};
			circleCenter.x = ele.getBoundingClientRect().left+($circle.outerWidth()>>1);
			circleCenter.y = ele.getBoundingClientRect().top+($circle.outerHeight()>>1);
			//记录当前对象的旋转角度
			var endAngle = 0;
			//记录上次变化时鼠标位置相对于旋转对象中心的角度
			var lastAngle = 0;
			function onTouchMove(evt){
				var pageXY = getPageXY(evt);
				if(pageXY != null){
					console.log("touch move --> " + pageXY.x + "," +  pageXY.y);
					var temp = calcAngle(pageXY, circleCenter);
					endAngle += temp - lastAngle;
					lastAngle = temp;
					setTransformR(endAngle,$circle);
				}
			}
			function onTouchEnd(evt){
				var pageXY = getPageXY(evt);
				if(pageXY != null){
					console.log("touch end --> " + pageXY.x + "," +  pageXY.y);
					var temp = calcAngle(pageXY, circleCenter);
					endAngle += temp - lastAngle;
					lastAngle = temp;
					setTransformR(endAngle,$circle);
				}
				document.removeEventListener("touchmove",onTouchMove);
				document.removeEventListener("mousemove",onTouchMove);
				document.removeEventListener("touchend",onTouchEnd);
				document.removeEventListener("mouseup",onTouchEnd);
			}
			function onTouchStart(evt){
				console.log(evt);
				var pageXY = getPageXY(evt);
				if(pageXY != null){
					console.log("touch start --> " + pageXY.x + "," +  pageXY.y);
					lastAngle =  calcAngle(pageXY, circleCenter);
				}
				document.addEventListener("touchmove",onTouchMove);
				document.addEventListener("mousemove",onTouchMove);
				document.addEventListener("touchend",onTouchEnd);
				document.addEventListener("mouseup",onTouchEnd);
			}
			ele.addEventListener("touchstart", onTouchStart);
			ele.addEventListener("mousedown", onTouchStart);
		});
	}
})();