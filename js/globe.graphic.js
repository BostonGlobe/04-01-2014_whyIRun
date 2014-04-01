globe.graphic = function() {

	if (Modernizr.touch) {
		$('.gf-form-wrapper', master).appendTo('body');
	}

	// from http://api.jquery.com/jQuery.cssHooks/
	(function( $ ) {

		if ( !$.cssHooks ) {
			throw( new Error( "jQuery 1.4.3+ is needed for this plugin to work" ) );
		}

		function styleSupport( prop ) {
			var vendorProp, supportedProp,
				capProp = prop.charAt( 0 ).toUpperCase() + prop.slice( 1 ),
				prefixes = [ "Moz", "Webkit", "O", "ms" ],
				div = document.createElement( "div" );

			if ( prop in div.style ) {
				supportedProp = prop;
			} else {
				for ( var i = 0; i < prefixes.length; i++ ) {
					vendorProp = prefixes[ i ] + capProp;
					if ( vendorProp in div.style ) {
						supportedProp = vendorProp;
						break;
					}
				}
			}

			div = null;
			$.support[ prop ] = supportedProp;
			return supportedProp;
		}

		var transform = styleSupport( "transform" );

		// Set cssHooks only for browsers that support a vendor-prefixed border radius
		if ( transform && transform !== "transform" ) {
			$.cssHooks.transform = {
				get: function( elem, computed, extra ) {
					return $.css( elem, transform );
				},
				set: function( elem, value) {
					elem.style[ transform ] = value;
				}
			};
		}

	})( jQuery );

	var page = 1;
	var master = $('#gf');

	function loadMoreStories() {

		$.getJSON('http://www.boston.com/newsprojects/whyirun/get_stories_api.php?year=2013&page=' + page++, function(json) {

			var html = [];
			var datum;
			for (var i = 0; i < json.length; i++) {

				datum = json[i];

				if (datum.type != 2) {
					datum.age = datum.age || null;

					html.push(window.JST['story.template'](datum));
				}

			}

			$('.stories', master).append(html.join(''));

		});

	}

	loadMoreStories();

	function slideStoriesDown() {
		var form = $('.form', master);
		var height = form.outerHeight();

		$('.stories', master).css('transform', 'translateY(' + height + 'px)');
	}

	function slideStoriesUp() {
		$('.stories', master).css('transform', 'translateY(0px)');
	}

	$('button.why', master).click(function(e) {

		function draw() {
			slideStoriesDown();
			$('button.why', master).parent().find('.why,.title').toggleClass('hidden');
		}

		if (Modernizr.touch) {

			// var parent = $('button.why', master).parent();
			// parent.removeClass('sticky');

			// $('html, body').animate({
			// scrollTop: parent.offset().top
			// }, 0).promise().done(draw);

		} else {
			draw();
		}

	});

	$('button.cancel, button.title', master).click(function(e) {

		function draw() {
			slideStoriesUp();
			$('button.why', master).parent().find('.why,.title').toggleClass('hidden');
		}

		if (Modernizr.touch) {

			// var parent = $('button.why', master).parent();

			// $('html, body').animate({
			// scrollTop: parent.offset().top
			// }, 0).promise().done(function() {

			// parent.addClass('sticky');
			// draw();
			// });

		} else {
			draw();
		}

	});

	$('button.loadMoreStories', master).click(loadMoreStories);

	$('button.submit', master).click(function(e) {

		function draw() {
			slideStoriesUp();
			$('button.why', master).parent().find('.why,.title').addClass('hidden');
			$('button.why', master).parent().find('.thanks').removeClass('hidden');
		}

		if (Modernizr.touch) {

			// var parent = $('button.why', master).parent();

			// $('html, body').animate({
			// scrollTop: parent.offset().top
			// }, 0).promise().done(function() {

			// parent.removeClass('sticky');
			// draw();
			// });

		} else {
			draw();
		}

	});

};
