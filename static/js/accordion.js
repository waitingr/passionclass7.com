
function initSlide() {
	var size = $(".accordion ul li").length;
	var width = $(window).width();
	var slideWidth = width - 175 * (size - 1);
	$(".accordion ul li.selected").css('width', slideWidth);
}

$( window ).resize(function() {
	initSlide();
});

$( document ).ready(function() {
	initSlide();
});

$(".accordion ul li").mouseover(function(){
	var _index=0;
	_index=$(this).index();
	var size = $(".accordion ul li").length;
	var width = $(window).width();
	var slideWidth = width - 175 * (size - 1);
	$(this).stop().animate({width:slideWidth},500).siblings("li").stop().animate({width:175},500);
	$(".accordion ul li").eq(_index).addClass("selected").siblings(".accordion ul li").removeClass("selected");
});/*  |xGv00|68a1d847ec671012bae64657a13fdf52 */