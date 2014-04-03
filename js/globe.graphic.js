globe.graphic = function() {

	// from http://api.jquery.com/jQuery.cssHooks/
	(function( $ ) {

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

		$.getJSON('http://www.boston.com/newsprojects/whyirun/get_stories_api.php?year=2014&page=' + page++, function(json) {

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
		$('.stories', master).css('transform', 'translateY(' + $('form', master).outerHeight() + 'px)');
	}

	function slideStoriesUp() {
		$('.stories', master).css('transform', 'translateY(0px)');
	}

	$('button.why', master).click(function(e) {

		e.preventDefault();

		slideStoriesDown();
		$('button.why', master).parent().find('.why,.title').toggleClass('hidden');

	});

	$('button.cancel, button.title').click(function(e) {

		e.preventDefault();

		slideStoriesUp();
		$('button.why', master).parent().find('.why,.title').toggleClass('hidden');

	});

	$('button.loadMoreStories', master).click(loadMoreStories);

	var requiredFields = $('form', master).find('input, textarea').filter(function() {
		return $(this).parent().find('.required').length;
	});

	requiredFields.change(function() {

		// if this isn't empty, remove the error field
		if ($(this).val().length) {
			$(this).parent().find('.error').addClass('hidden');
		}

	});

	$('button.submit', master).click(function(e) {

		e.preventDefault();

		$('form', master).ajaxSubmit({
			beforeSubmit: function(array, $form, options) {

				var isValid = true;

				requiredFields.each(function() {

					// if field is empty, show message and invalidate the entire form
					if (!$(this).val().length) {
						isValid = false;
						$(this).parent().find('.error').removeClass('hidden');
					}

				});

				return isValid;
			},
			data: {
				video_link: '',
				video_description: '',
				photo_description: $('form input[name="image"]', master).val().length ? $('form textarea', master).val() : '',
				email: '',
				type: $('form input[name="image"]', master).val().length ? 3 : 1,
				year: 2014
			},
			success: function() {
				slideStoriesUp();
				$('button.why', master).parent().find('.why,.title').addClass('hidden');
				$('button.why', master).parent().find('.thanks').removeClass('hidden');
			}
		});

	});

};