$.each(['i/clouds.png', 'i/rocket_atack.png', 'i/moon-land.png', ], function() {
	$(new Image()).attr('src', this);
});

$(function() {
	var $screen = $('#scenario'),
		$start = $screen.find('.rocket-banner-start'),
		$again = $screen.find('.rocket-banner-again');
	
	var scenario = {
			element: '#scenario',
			child: [{
				element: '.rocket_smile',
				scene: [{
					time: [0, 2500, 'easeInOutSine'],
					before: { removeClass: 'rocket_landed', addClass: 'rocket_space' },
					animate: { top: 69 }
				},
				{
					time: [7600, 9000, 'easeInSine'],
					animate: { top: -264 },
					after: { removeClass: 'rocket_space', addClass: 'rocket_landed' }
				}],
				child: [{
					element: '.fire',
					scene: [{
						time: [0, 1000, 'easeOutSine'],
						animate: { top: 195 }
					},
					{
						time: [0, 9000],
						step: function(time) {
							this.hide()
								.eq((time / 100) % this.length)
								.show();
						},
						after: { reset: '' }
					}]
				},
				{
					element: '.eyes',
					scene: [{
						time: [2200, 2700],
						animate: { top: 79, left: 50 }
					},
					{
						time: [2700, 4000],
						animate: { top: 75 }
					},
					{
						time: [7000, 7500],
						animate: { left: 57 }
					}]
				},
				{
					element: '.ears-1',
					time: [150, 9000],
					before: { hide: '' },
					after: { show: '' }
				},
				{
					element: '.ears-2',
					time: [150, 300],
					before: { show: '' },
					after: { hide: '' }
				},
				{
					element: '.ears',
					time: [300, 9000],
					step: function(time, o, scene) {
						this.hide()
							.eq((time / 30) % this.length)
							.show();
					},
					after: { hide: '' }
				}]
			},
			{
				element: '.rocket_atack',
				scene: [{
					time: [2500, 4000],
					before: { top: 370, show: '', removeClass: 'rocket_landed', addClass: 'rocket_space' },
					animate: { top: 32 }
				},
				{
					time: [5500, 6500],
					before: { addClass: 'rocket_wink' },
					after: { removeClass: 'rocket_wink' }
				},
				{
					time: [7000, 8000, 'easeInSine'],
					animate: { top: -320 },
					after: { removeClass: 'rocket_space', addClass: 'rocket_landed' }
				}],
				child: [{
					element: '.fire',
					time: [2500, 8000],
					step: function(time) {
						this.hide()
							.eq((time / 100) % this.length)
							.show();
					},
					after: { hide: '' }
				},
				{
					element: '.eyes',
					scene: [{
						time: [2500, 4000],
						before: { top: 82, left: 74 },
						animate: { top: 85 }
					},
					{
						time: [7000, 8000],
						animate: { top: 89 },
						after: { left: '', top: '' }
					}]
				}]
			},
			{
				element: '.rocket_smile, .rocket_atack, .moon-land',
				time: [9500, 10000],
				before: { opacity: 0, show: '', top: '' },
				animate: { opacity: 1 },
				after: { opacity: '' }
			},
			{
				element: '.moon',
				time: [0, 500, 'easeInSine'],
				animate: { top: -186 },
				after: { display: 'none' }
			},
			{
				element: '.earth-land',
				time: [0, 3000, 'easeInSine'],
				animate: { top: 603 },
				after: { display: 'none' }
			},
			{
				element: '.cloud',
				child: [{
					element: ['eq', 0],
					time: [2500, 8000, 'linear'],
					before: { top: -80, display: 'block', left: 100 },
					animate: { top: 374 }
				},
				{
					element: ['eq', 1],
					time: [4000, 9000, 'linear'],
					before: { top: -80, display: 'block', left: 500 },
					animate: { top: 374 }
				},
				{
					element: ['eq', 2],
					time: [0, 7500, 'linear'],
					before: { top: -80, display: 'block', left: 300 },
					animate: { top: 374 }
				},
				{
					element: ['eq', 3],
					scene: [{
						time: [2500, 5500, 'linear'],
						before: { top: -80, display: 'block', left: 500 },
						animate: { top: 374 }
					},
					{
						time: [5500, 9000, 'linear'],
						before: { top: -80, display: 'block', left: 150 },
						animate: { top: 374 }
					}]
				}]
			}]
		};
	
	$start.click(function(e) {
		$start.hide();
		var options = {
				complete: function(time) {
					$again.show();
				}
			};
		
		$('#controls').each(function() {
			var $form = $(this).find('form');
			var start = parseInt($form.find('[name="start"]').val());
			var end = parseInt($form.find('[name="end"]').val());
			var acceleration = parseFloat($form.find('[name="acceleration"]').val());
			var interval = parseInt($form.find('[name="fps"]').val());
			start && (options.startTime = start);
			end && (options.endTime = end);
			acceleration && (options.acceleration = acceleration);
			interval && (options.interval = interval);
		});
		
		$.scenario(scenario, options);
		
		e.preventDefault();
	});
	
	$again.click(function(e) {
		function change() {
			$again.hide();
			$screen
				.find('.rocket_atack, rocket_smile, .moon, .moon-land, .earth-land')
				.removeAttr('style');
			$start.show();
		}
		
		$screen.fadeOut(300, function(){
			change();
			$screen.fadeIn(300);
		});
		
		e.preventDefault();
	});
});

















$(function() {
	var $screen = $('#animate'),
		$start = $screen.find('.rocket-banner-start'),
		$again = $screen.find('.rocket-banner-again');
	
	$start.click(function(e) {
		
		$start.hide();
		
		$screen
			.find('.moon')
			.animate({top: [-186, 'easeInSine']}, {
				duration: 500,
				complete: function() {
					$(this).hide();
				}
			});
		$screen
			.find('.earth-land')
			.animate({top: [603, 'easeInSine']}, {
				duration: 3000,
				complete: function() {
					$(this).hide();
				}
			});
		
		// сохраняем огонь, чтобы получить к нему доступ не выбирая каждый раз
		var $rocket_smile = $screen
			.find('.rocket_smile')
			.removeClass('rocket_landed')
			.addClass('rocket_space')
			.animate({top: [69, 'easeInOutSine']}, 2500)
			.delay(5100)
			.animate({top: [-264, 'easeInSine']}, 1400)
			.delay(500)
			.queue(function(next) {
				$(this)
					.css({opacity: 0, top: ''})
					.removeClass('rocket_space')
					.addClass('rocket_landed');
				next();
			})
			.animate({opacity: 1}, {
				duration: 500,
				complete: function() {
					$(this)
						.css({opacity: ''});
				}
			})
			.find('.eyes')
				.delay(2200)
				.animate({ top: 79, left: 50 }, 500)
				.animate({ top: 75, left: 50 }, 1300)
				.delay(3000)
				.animate({ left: 57 }, 500)
				.end()
			.find('.ears-1')
				.delay(150)
				.queue(function(next) {
					$(this).hide();
					next();
				})
				.delay(8850)
				.queue(function(next) {
					$(this).show();
					next();
				})
				.end()
			.find('.ears-2')
				.delay(150)
				.queue(function(next) {
					$(this).show();
					next();
				})
				.delay(150)
				.queue(function(next) {
					$(this).hide();
					next();
				})
				.end();
		
		var $rocket_smile_fire = $rocket_smile
			.find('.fire')
			.animate({top: [195, 'easeOutSine']}, {
				duration: 1000,
				queue: false
			});
		$rocket_smile_fire
			// Первый хак: нам нужно, чтобы калбэки вызывались только один раз
			.eq(0)
			// Второй хак: marginTop и так 0, но без него анимация вовсе не запустится 
			.animate({marginTop: 0}, {
				duration: 9000,
				step: function(x, opt) {
					$rocket_smile_fire
						.hide()
						.eq(((new Date() - opt.startTime) / 100) % $rocket_smile_fire.length)
						.show();
				},
				complete: function() {
					$rocket_smile_fire.removeAttr('style');
				}
			});
		
		var $rocket_smile_ears = $rocket_smile.find('.ears');
		$rocket_smile_ears
			.eq(0)
			.delay(300)
			.animate({marginTop: 0}, {
				duration: 8700,
				step: function(x, opt) {
					$rocket_smile_ears.hide()
						.eq(((new Date() - opt.startTime) / 30) % $rocket_smile_ears.length)
						.show();
				},
				complete: function() {
					$rocket_smile_ears.hide();
				}
			});
		
		var $rocket_atack_fire = $screen
			.find('.rocket_atack')
			.delay(2500)
			.queue(function(next){
				$(this)
					.show()
					.css({top: 370})
					.removeClass('rocket_landed')
					.addClass('rocket_space');
				// требуется позаботиться о дальнейших вызовах очереди
				next();
			})
			.animate({top: 32}, 1500)
			.delay(1500)
			.queue(function(next){
				$(this).addClass('rocket_wink');
				next();
			})
			.delay(1000)
			.queue(function(next){
				$(this).removeClass('rocket_wink');
				next();
			})
			.delay(500)
			.animate({top: [-320, 'easeInSine']}, 1000)
			// копипаста из $rocket_smile
			.delay(1500)
			.queue(function(next) {
				$(this)
					.css({opacity: 0, top: ''})
					.removeClass('rocket_space')
					.addClass('rocket_landed');
				next();
			})
			.animate({opacity: 1}, {
				duration: 500,
				complete: function() {
					$(this)
						.css({opacity: ''});
				}
			})
			.find('.eyes')
				.delay(2500)
				.queue(function(next) {
					$(this).css({top: 82, left: 74});
					next();
				})
				.animate({top: 85}, 1500)
				.delay(3000)
				.animate({top: 89}, {
					duration: 1000,
					complete: function() {
						$(this).css({left: '', top: ''});
					}
				})
				.end()
			.find('.fire');
		
		$rocket_atack_fire
			.delay(2500)
			// Первый хак: нам нужно, чтобы калбэки вызывались только один раз
			.eq(0)
			// Второй хак: marginTop и так 0, но без него анимация вовсе не запустится 
			.animate({marginTop: 0}, {
				duration: 5500,
				step: function(x, opt) {
					$rocket_atack_fire
						.hide()
						.eq(((new Date() - opt.startTime) / 100) % $rocket_atack_fire.length)
						.show();
				},
				complete: function() {
					$rocket_atack_fire.removeAttr('style');
				}
			});
		
		$screen
			.find('.cloud')
			.eq(0)
				.delay(2500)
				.queue(function(next) {
					$(this).css({top: -80, display: 'block', left: 100});
					next();
				})
				.animate({top: [374, 'linear']}, 5500)
				.end()
			.eq(1)
				.delay(4000)
				.queue(function(next) {
					$(this).css({top: -80, display: 'block', left: 500});
					next();
				})
				.animate({top: [374, 'linear']}, 5000)
				.end()
			.eq(2)
				.queue(function(next) {
					$(this).css({top: -80, display: 'block', left: 300});
					next();
				})
				.animate({top: [374, 'linear']}, 7500)
				.end()
			.eq(3)
				.delay(2500)
				.queue(function(next) {
					$(this).css({top: -80, display: 'block', left: 500});
					next();
				})
				.animate({top: [374, 'linear']}, 3000)
				.queue(function(next) {
					$(this).css({top: -80, display: 'block', left: 150});
					next();
				})
				.animate({top: [374, 'linear']}, 3500);
		
		$screen
			.find('.moon-land')
			.delay(9500)
			.animate({opacity: 'show'}, {
				duration: 500,
				complete: function() {
					// множество точек выхода, из которых нужно выбрать одну.
					$again.show();
				}
			});
		
		e.preventDefault();
	});
	
	$again.click(function(e) {
		function change() {
			$again.hide();
			$screen
				.find('.rocket_atack, rocket_smile, .moon, .moon-land, .earth-land')
				.removeAttr('style');
			$start.show();
		}
		
		$screen.fadeOut(300, function(){
			change();
			$screen.fadeIn(300);
		});
		
		e.preventDefault();
	});
});