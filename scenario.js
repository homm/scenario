/*!
 * @author Александр Карпинский <homm86@gmail.com>
 * @site http://strategia.su/
 */

(function (undef) {
	
	var debug = false;
	
	function fixScene(scene) {
		if (scene.time && $.isArray(scene.time) && scene.time.length >= 2) {
			if (scene.before || scene.start || scene.animate || scene.step || scene.after || scene.end) {
				if ((scene.element && scene.element.length) 
						|| scene.start || scene.step || scene.end) {
					if (scene.time[1] <= scene.time[0]) {
						// this need to prevent division by zeros
						scene.time[1] = scene.time[0] + 1;
					}
					// is evaluation needed on each step
					scene._eachStep = !!((scene.element && scene.element.length && scene.animate) 
						|| scene.step);
					return true;
				}
			}
		}
		return false;
	}
	
	
	function resolveElement(element, parent) {
		if (debug) console.log('resolveElement', element, parent);
		if ( ! element) {
			return parent;
		} else if (element instanceof $) {
			// element already jQuery object
			return element;
		} else if ($.isFunction(element)) {
			// element is callback
			return element(parent);
		} else if (element.nodeType || ! parent) {
			// DOM objects and elements without parents call jQuery
			return $(element);
		}
		if ($.isArray(element)) {
			// first element of array is custom traversing function
			if ( ! element[0]) {
				return $.apply(undef, element.slice(1));
			}
			return parent[element[0]].apply(parent, element.slice(1));
		} else {
			return parent.find(element);
		}
	}
	
	
	function compileTree(scenario, tree, parent) {
		if ( ! $.isArray(tree)) {
			tree = [tree];
		}
		for (var i = 0; i < tree.length; i++) {
			var leaf = tree[i];
			
			// All elements resolves before start. In other case may be lags on resolving
			leaf.element = resolveElement(leaf.element, parent && parent.element);
			
			if ( ! leaf.scene && leaf.time) {
				// extended syntax — scene omitted at all, time present in leaf
				leaf.scene = [{}];
			} else if ( ! $.isArray(leaf.scene)) {
				leaf.scene = [leaf.scene];
			}
			
			if (leaf.scene) {
				for (var j = 0; j < leaf.scene.length; j++) {
					var scene = $.extend(leaf.scene[j], leaf);
					delete scene.scene;
					if (fixScene(scene)) {
						scenario[scenario.length] = scene;
					}
				}
			}
			
			if (leaf.child) {
				compileTree(scenario, leaf.child, leaf);
			}
		}
	}
	
	
	function applyProps(element, props) {
		var methodsMultiArgs = {
				show: true,
				hide: true,
				attr: true,
				removeAttr: false,
				addClass: false,
				removeClass: false,
				toggleClass: true
			};
		for (var method in methodsMultiArgs) {
			if (method in props) {
				var val = props[method];
				if ($.isArray(val)) {
					if (methodsMultiArgs[method]) {
						element[method].apply(element, val);
					} else {
						for (var i = 0; i < val.length; i++) {
							element[method].val[i];
						}
					}
				} else {
					element[method](val);
				}
				delete props[method];
			}
		}
		if ('reset' in props) {
			element.removeAttr('style');
			delete props['reset'];
		}
		element.css(props);
	}
	
	
	function norm(x) {
		return x > 1 ? 1 : (x < 0 ? 0 : x);
	}
	
	
	$.extend({
		scenario: function(scenarioTree, options) {
			var scenario = [];

			options = options || {};
			compileTree(scenario, $.extend(true, {}, scenarioTree));
			if (debug) console.log('scenario', window['scenario'] = scenario);
			
			var start = + new Date(),
				// undefined == not started, 1 == running, 2 == finished
				states = new Array(scenario.length);
		
			if (options.startTime) {
				start -= options.startTime / (options.acceleration || 1);
			}
			
			function tick() {
				var time = (+ new Date()) - start,
					allEnds = true;
				
				if (options.acceleration) {
					time *= options.acceleration;
				}
				
				$.each(scenario, function(i) {
					var scene = this;
					
					if (states[i] == undef && time >= scene.time[0]) {
						// start scene
						states[i] = 1;
						if (scene.element && scene.element.length && scene.before) {
							applyProps(scene.element, scene.before);
						}
						if (scene.animate) {
							for (var prop in scene.animate) {
								var start = parseFloat(scene.element.css(prop)) || 0;
								if ($.isArray(scene.animate[prop])) {
									scene.animate[prop].unshift(start);
								} else {
									scene.animate[prop] = [start, scene.animate[prop]];
								}
							}
						}
						if (scene.start) {
							scene.start.call(scene.element, time, scene);
						}
					}
					
					if (states[i] == 1) {
						if (time >= scene.time[1]) {
							// end scene
							states[i] = 2;
						}
						
						if (scene._eachStep) {
							var o = {
									time: time,
									passed: time - scene.time[0],
									duration: scene.time[1] - scene.time[0]
								},
								easing = scene.time[2] || (jQuery.easing.swing ? "swing" : "linear"),
								css = {};
							
							if (states[i] == 2) {
								o.progress = o.position = 1;
							} else {
								o.progress = norm(o.passed / o.duration);
								o.position = jQuery.easing[easing](o.progress, o.passed, 0, 1, o.duration);
							}
							
							if (scene.animate) {
								for (var prop in scene.animate) {
									var arr = scene.animate[prop],
										pos = o.position;
									if (states[i] != 2 && arr[2]) {
										pos = jQuery.easing[arr[2]](o.progress, o.passed, 0, 1, o.duration);
									}
									css[prop] = arr[0] + (arr[1] - arr[0]) * pos;
								}
								
								scene.element.css(css);
							}
							
							if (scene.step) {
								o.now = start + scene.time[0] + (o.duration * o.position);
								scene.step.call(scene.element, time, o, scene);
							}
						}
	
						if (states[i] == 2) {
							if (scene.element && scene.element.length && scene.after) {
								applyProps(scene.element, scene.after);
							}
							if (scene.end) {
								scene.end.call(scene.element, time, scene);
							}
						}
					}
					
					if (states[i] == undef || states[i] == 1) {
						allEnds = false;
					}
				});
				
				if (options.step) {
					options.step(time);
				}
				
				// All scenes end
				if (allEnds) {
					clearTimeout(timer);
					if (options.complete) {
						options.complete(time);
					}
				} else if (options.endTime && time > options.endTime) {
					// Move start to one month in past
					start -= 1000 * 60 * 60 * 24 * 30;
				}
			}
			
			var timer = setInterval(tick, options.interval || 33);
			tick();
		}
	});
})();