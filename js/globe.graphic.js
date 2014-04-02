globe.graphic = function() {

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

	$('button.submit', master).click(function(e) {

		e.preventDefault();

		$('form', master).ajaxSubmit({
			beforeSubmit: function(array, $form, options) {

				var isValid = true;

				// find all form <label> elements that have a .required element
				$('label', $form).filter(function() {
					return $(this).find('.required').length;
				}).each(function(index, element) {

					// find the input or textarea
					var field = $('input, textarea', element);

					// if field is empty, show message and invalidate the entire form
					if (!field.val().length) {
						isValid = false;
						field.parent().find('.error').removeClass('hidden');
					}

				});

				return false;
			},
			data: {
				video_link: '',
				video_description: '',
				photo_description: '',
				email: '',
				type: 1,
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
