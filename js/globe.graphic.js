globe.graphic = function() {

	var opts = {
		lines: 12, // The number of lines to draw
		length: 11, // The length of each line
		width: 5, // The line thickness
		radius: 14, // The radius of the inner circle
		corners: 1, // Corner roundness (0..1)
		rotate: 0, // The rotation offset
		direction: 1, // 1: clockwise, -1: counterclockwise
		color: '#000', // #rgb or #rrggbb or array of colors
		speed: 1.5, // Rounds per second
		trail: 40, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: true, // Whether to use hardware acceleration
		className: 'spinner', // The CSS class to assign to the spinner
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		top: '50%', // Top position relative to parent in px
		left: '50%' // Left position relative to parent in px
	};
	var spinner = new Spinner(opts).spin($('.loading').get(0));

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

	var master = $('#gf');
	var stories;
	var isLoaded = false;

	function loadMoreStories() {

		// show 10 stories, or all, whichever is smaller
		var count = Math.min(10, stories.length);

		// this will hold all the html strings
		var html = [];

		// process one story at a time
		while (count--) {
			html.push(window.JST['story.template'](stories.pop()));
		}

		// after first call, hide spinner, enable form
		if (!isLoaded) {
			spinner.stop();
			$('.loading').addClass('hidden');
			$('form', master).parent().removeClass('hidden');
			isLoaded = !isLoaded;
		}

		// add stories to dom
		$('.stories', master).append(html.join(''));

		// do we still have stories to show?
		if (stories.length) {
			$('button.loadMoreStories', master).removeClass('hidden');
			$('p.noMoreStories', master).addClass('hidden');
		} else {
			$('button.loadMoreStories', master).addClass('hidden');
			$('p.noMoreStories', master).removeClass('hidden');
		}

	}

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

	$('button.cancel').click(function(e) {

		e.preventDefault();

		// clear validation
		$('form', master).parent().find('.error').addClass('hidden');

		// clear form
		$('form input,textarea', master).val('');

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

	// check image size
	var imageInput = $('form', master).find('input[name="image"]');
	imageInput.change(function() {

		var field = $(this).get(0);
		if (window.FileReader && field.files && field.files[0] && field.files[0].size > 1000000) {
			$(this).parent().find('.error').removeClass('hidden');
		} else {
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

				// check image size
				if (!imageInput.parent().find('.error').hasClass('hidden')) {
					isValid = false;
				}

				return isValid;
			},
			data: {
				video_link: '',
				video_description: '',
				photo_description: imageInput.val().length ? $('form textarea', master).val() : '',
				email: '',
				type: imageInput.val().length ? 3 : 1,
				year: 2014
			},
			success: function() {
				slideStoriesUp();
				$('button.why', master).parent().find('.why,.title').addClass('hidden');
				$('button.why', master).parent().find('.thanks').removeClass('hidden');
			}
		});

	});

	$.getJSON('http://www.boston.com/newsprojects/whyirun/get_stories_api.php?year=2013', function(json) {

		stories = json.reverse();
		loadMoreStories();

	});

};