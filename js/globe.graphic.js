globe.graphic = function() {

	var page = 1;
	var master = $('#gf');

	function loadMoreStories() {

		$.getJSON('http://private.boston.com/newsprojects/whyirun/get_stories_api.php?year=2013&page=' + page++, function(json) {

			var html = [];
			for (var i = 0; i < json.length; i++) {
				html.push(window.JST['story.template'](json[i]));
			}

			$('.stories', master).append(html.join(''));

		});

	}

	loadMoreStories();

	$('button.loadMoreStories', master).click(loadMoreStories);

};