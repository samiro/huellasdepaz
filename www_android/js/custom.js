/* INFORMATION BUBBLES HIDE */
	$(document).ready( function() {
		$(".whide").click( function() {
			$(".warning").fadeOut(300);
		});
		
		$(".nhide").click( function() {
			$(".notice").fadeOut(300);
		});
		
		$(".nnhide").click( function() {
			$(".note").fadeOut(300);
		});
	});
	

		
/* PORTFOLIO SETTINGS */
$(document).ready( function() {
$(function () {
		
		// var filterList = {
		
		// 	init: function () {
		// 		$('#portfoliolist').mixitup({
		// 			targetSelector: '.portfolio',
		// 			filterSelector: '.filter',
		// 			effects: ['fade'],
		// 			easing: 'snap',
		// 			onMixEnd: filterList.hoverEffect()
		// 		});				
		// 	},
			
		// 	hoverEffect: function () {
			
		// 		$('#portfoliolist .portfolio').hover(
		// 			function () {
		// 				$(this).find('.label').stop().animate({bottom: 0}, 200, 'easeOutQuad');
		// 				$(this).find('img').stop().animate({top: 0}, 500, 'easeOutQuad');				
		// 			},
		// 			function () {
		// 				$(this).find('.label').stop().animate({bottom: -50}, 200, 'easeInQuad');
		// 				$(this).find('img').stop().animate({top: 0}, 300, 'easeOutQuad');								
		// 			}		
		// 		);				
		// 	}
		// };
		// filterList.init();
	});	
});	
