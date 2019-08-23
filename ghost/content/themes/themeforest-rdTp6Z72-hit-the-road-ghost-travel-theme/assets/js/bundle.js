(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _imagePreload = require('./modules/imagePreload');

var ImagePreload = _interopRequireWildcard(_imagePreload);

var _weatherWidget = require('./modules/weatherWidget');

var WeatherWidget = _interopRequireWildcard(_weatherWidget);

var _scrollHint = require('./modules/scrollHint');

var ScrollHint = _interopRequireWildcard(_scrollHint);

var _navbarToggleButton = require('./modules/navbarToggleButton');

var NavbarToggleButton = _interopRequireWildcard(_navbarToggleButton);

var _search = require('./modules/search');

var Search = _interopRequireWildcard(_search);

var _mapWidget = require('./modules/mapWidget');

var MapWidget = _interopRequireWildcard(_mapWidget);

var _instagramWidget = require('./modules/instagramWidget');

var InstagramWidget = _interopRequireWildcard(_instagramWidget);

var _dropdown = require('./modules/dropdown');

var Dropdown = _interopRequireWildcard(_dropdown);

var _responsiveVideo = require('./modules/responsiveVideo');

var ResponsiveVideo = _interopRequireWildcard(_responsiveVideo);

var _gallery = require('./modules/gallery');

var Gallery = _interopRequireWildcard(_gallery);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

ImagePreload.init();
WeatherWidget.init();
ScrollHint.init();
NavbarToggleButton.init();
Search.init();
MapWidget.init();
InstagramWidget.init();
Dropdown.init();
ResponsiveVideo.init();
Gallery.init();

/**
 * Workaround for vh100 bug
 */

var header = document.getElementById('header');
if (!header.classList.contains('header-hidden') && !header.classList.contains('header-naked')) {
  header.style.height = window.innerHeight + 'px';
  header.classList.remove('header-vh100');
}

},{"./modules/dropdown":2,"./modules/gallery":3,"./modules/imagePreload":4,"./modules/instagramWidget":5,"./modules/mapWidget":7,"./modules/navbarToggleButton":9,"./modules/responsiveVideo":10,"./modules/scrollHint":11,"./modules/search":12,"./modules/weatherWidget":17}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.init = init;
function init() {
	var dropdowns = Array.from(document.querySelectorAll('.dropdown'));

	dropdowns.map(function (dropdown) {
		var toggle = dropdown.querySelector('.dropdown-toggle');

		if (toggle == null) {
			return;
		}

		toggle.addEventListener('click', function () {
			if (dropdown.classList.contains('open')) {
				dropdown.classList.remove('open');
			} else {
				dropdowns.map(function (x) {
					return x.classList.remove('open');
				});
				dropdown.classList.add('open');
			}
		});
	});
}

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.init = init;
function itemClicked(item) {
	item.classList.toggle('zoom');
	document.body.classList.toggle('no-scroll');
}

function init() {
	var images = document.querySelectorAll('.kg-gallery-image img');
	images.forEach(function (image) {
		var container = image.closest('.kg-gallery-image');
		var width = image.attributes.width.value;
		var height = image.attributes.height.value;
		var ratio = width / height;
		container.style.flex = ratio + ' 1 0%';
		container.addEventListener('click', function () {
			return itemClicked(container);
		});
	});
}

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.init = init;
var urlTemplate = function () {
	var urlTemplateProperty = document.querySelector('meta[property="image-preload:url"],meta[name="image-preload:url"]');
	return urlTemplateProperty != null ? urlTemplateProperty.getAttribute('content') : '{image}';
}();

function getUrl(post) {
	var resize = post.getAttribute('data-resize') || false;
	var url = post.getAttribute('data-image');

	if (url.startsWith('https') === false && url.startsWith('http') === false) {
		url = window.location.protocol + '//' + window.location.host + url;
	}

	if (resize === false || window.location.hostname === 'localhost' || post.offsetWidth === 0 || post.offsetWidth === 0) {
		return url;
	}

	return urlTemplate.replace('{image}', url).replace('{width}', post.offsetWidth.toString()).replace('{height}', post.offsetHeight.toString());
}

function init() {
	var posts = Array.from(document.querySelectorAll('.preload-background'));

	posts.forEach(function (post) {
		var image = new Image();
		image.src = getUrl(post);

		image.addEventListener('load', function () {
			post.querySelector('.spinner').style.display = 'none';
			var imageElement = post.querySelector('.preload-background-image');
			imageElement.style.backgroundImage = 'url(' + image.src + ')';
			imageElement.style.opacity = '1';
		});
	});
}

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _instagramWidget = require('./instagramWidget');

Object.defineProperty(exports, 'init', {
  enumerable: true,
  get: function get() {
    return _instagramWidget.init;
  }
});

},{"./instagramWidget":6}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.init = init;
var postsKey = 'hit-the-road-instagram-posts';

function getSettings() {
	var defaults = {
		'user-id': '',
		'access-token': '',
		'count': '9'
	};

	Object.keys(defaults).forEach(function (key) {
		var selector = 'meta[property=\'instagram:' + key + '\'],meta[name=\'instagram:' + key + '\']';
		var element = document.querySelector(selector);
		if (element == null) {
			return;
		}
		defaults[key] = element.getAttribute('content');
	});

	return defaults;
}

function getPosts(accessToken, userId, count) {
	var storage = window.sessionStorage;

	return new Promise(function (resolve, reject) {
		var posts = null;
		try {
			posts = JSON.parse(storage.getItem(postsKey));
		} catch (e) {
			/* must be empty */
		}

		if (posts == null) {
			var url = 'https://api.instagram.com/v1/users/' + userId + '/media/recent/?access_token=' + accessToken + '&count=' + count;

			fetch(url).then(function (resp) {
				if (resp.ok) {
					return resp.json();
				} else {
					reject('Unknown error occurred (HTTP ' + resp.status + ')');
				}
			}).then(function (resp) {
				posts = resp.data.map(function (x) {
					return {
						'image': x.images.low_resolution.url,
						'link': x.link
					};
				});

				storage.setItem(postsKey, JSON.stringify(posts));
				resolve(posts);
			});
		} else {
			resolve(posts);
		}
	});
}

function render(element, posts) {
	var title = element.getAttribute('data-title') || '';

	var template = '\n    <div class="widget widget-side render-component-instagram">\n        <h2 class="widget-title">' + title + '</h2>\n        <ul class="image-list">\n        ' + posts.map(function (post) {
		return '<li><a href="' + post.link + '" target="_blank"><img src="' + post.image + '" /></a></li>';
	}).join('') + '  \n        </ul>\n    </div>';

	element.insertAdjacentHTML('beforeend', template);
}

function init() {
	var settings = getSettings();
	var element = document.querySelector('.render-component-instagram');

	if (element == null || settings['access-token'].length === 0) {
		return;
	}

	getPosts(settings['access-token'], 'self', settings['count']).then(function (posts) {
		return render(element, posts);
	});
}

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mapWidget = require('./mapWidget');

Object.defineProperty(exports, 'init', {
  enumerable: true,
  get: function get() {
    return _mapWidget.init;
  }
});

},{"./mapWidget":8}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.init = init;

var _html = require('../../utils/html');

function getGoogleApiKey(maps) {
	var mapWithKey = maps.find(function (x) {
		return x.getAttribute('data-api-key') != null;
	});
	if (typeof mapWithKey === 'undefined') {
		return null;
	}

	return mapWithKey.getAttribute('data-api-key');
} /* global google */


function getProperties(map) {
	return {
		title: map.getAttribute('data-title') || '',
		lat: parseFloat(map.getAttribute('data-lat')),
		lng: parseFloat(map.getAttribute('data-lng')),
		zoom: function (zoom) {
			return zoom ? parseInt(zoom) : 10;
		}(map.getAttribute('data-zoom')),
		location: map.getAttribute('data-location') || null,
		website: map.getAttribute('data-website') || null,
		phone: map.getAttribute('data-phone') || null,
		hours: map.getAttribute('data-hours') || null,
		desc: map.getAttribute('data-desc') || null,
		showMarker: map.getAttribute('data-show-marker') || false
	};
}

function render(map) {
	var props = getProperties(map);

	var infoTemplate = '\n    <div class="info">\n        <h2 class="widget-title">' + props.title + '</h2>\n        ' + (props.desc != null ? '<p>' + props.desc + '</p>' : '') + '\n        <ul>\n            ' + (props.location != null ? '<li><i class="fa fa-map-marker"></i>' + props.location + '</li>' : '') + '\n            ' + (props.website != null ? '<li><i class="fa fa-globe"></i><a href="' + props.website + '" target="_blank">' + props.website + '</a></li>' : '') + '\n            ' + (props.phone != null ? '<li><i class="fa fa-phone"></i>' + props.phone + '</li>' : '') + '\n            ' + (props.hours != null ? '<li><i class="fa fa-clock-o"></i>' + props.hours + '</li>' : '') + '\n        </ul>\n    </div>\n    ';

	var infoAvailable = true;

	var template = '\n    <div class="location">\n        <div class="row">\n            ' + (infoAvailable ? infoTemplate : '') + '\n            <div class="map-container">\n                <div class="map"></div>       \n            </div>\n        </div>\n    </div>\n    ';

	map.insertAdjacentHTML('beforeend', template);

	new google.maps.Map(map.querySelector('.map'), {
		center: { lat: props.lat, lng: props.lng },
		zoom: props.zoom
	});
}

function init() {
	var maps = Array.from(window.document.querySelectorAll('.render-component-map,.render-component-location'));

	var key = getGoogleApiKey(maps);
	var url = '//maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=' + key;

	if (maps.length === 0 || key == null) {
		return;
	}

	(0, _html.loadScript)(url).then(function () {
		maps.forEach(render);
	});
}

},{"../../utils/html":19}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.init = init;
function clicked(element, event) {
	var target = document.getElementById(element.getAttribute('data-target'));
	var body = document.getElementById('body');
	if (target == null) {
		return;
	}
	if (target.classList.contains('in')) {
		target.classList.remove('in');
		body.classList.remove('menu-visible');
		Array.from(document.querySelectorAll('.hide-on-menu')).forEach(function (item) {
			item.classList.remove('hidden-xs');
			item.classList.remove('hidden-sm');
		});
	} else {
		target.classList.add('in');
		body.classList.add('menu-visible');
		Array.from(document.querySelectorAll('.hide-on-menu')).forEach(function (item) {
			item.classList.add('hidden-xs');
			item.classList.add('hidden-sm');
		});
	}
}

function init() {
	var elements = Array.from(document.querySelectorAll('button[data-toggle=collapse2]'));
	elements.map(function (element) {
		return element.addEventListener('click', function (event) {
			return clicked(element, event);
		});
	});
}

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.init = init;
var selector = ['.kg-embed-card iframe[src*="player.vimeo.com"]', '.kg-embed-card iframe[src*="youtube.com"]', '.kg-embed-card iframe[src*="youtube-nocookie.com"]'].join(',');

function init() {
	var videos = document.querySelectorAll(selector);
	Array.from(videos).forEach(function (video) {
		if (video.parentNode.classList.contains('kg-embed-card')) {
			video.parentNode.classList.add('kg-embed-video-card');
		}
	});
}

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.init = init;
var hint = document.getElementById('scroll-hint');

function toggleHint() {
	var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

	if (scrollTop > 0) {
		hint.classList.remove('visible');
	} else {
		hint.classList.add('visible');
	}
}

function scrollToContent() {
	if (!hint.classList.contains('visible')) {
		return;
	}

	window.scrollBy({
		top: window.innerHeight,
		left: 0,
		behavior: 'smooth'
	});
}

function init() {
	if (hint == null) {
		return;
	}

	hint.addEventListener('click', scrollToContent);
	window.addEventListener('load', toggleHint);
	window.addEventListener('scroll', toggleHint);
}

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.init = init;

var _lunr = require('lunr');

var _lunr2 = _interopRequireDefault(_lunr);

var _imagePreload = require('./imagePreload');

var ImagePreload = _interopRequireWildcard(_imagePreload);

var _url = require('../utils/url');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var baseUrl = function () {
	var urlElement = document.querySelector('meta[property="blog:url"],meta[name="blog:url"]');
	if (urlElement != null) {
		return urlElement.getAttribute('content');
	}
	return window.baseUrl;
}();

var storage = window.sessionStorage;

var postsKey = 'hit-the-road-posts';
var postsIndexKey = 'hit-the-road-posts-index';

var searchButton = document.getElementById('header-search-button');
var results = document.querySelector('.render-search-results');
var resultsLoading = document.querySelector('.render-search-results-indicator');
var resultsEmpty = document.querySelector('.render-search-results-not-found');

function searchButtonClicked() {
	if (searchButton.classList.contains('inactive')) {
		searchButton.classList.remove('inactive');
		searchButton.attributes['type'] = 'submit';
		searchButton.parentNode.classList.add('active');
		var inputWrap = searchButton.parentNode.querySelector('.input-wrap');
		inputWrap.classList.add('active');
		document.getElementById('header-search-input').focus();
	} else {
		document.getElementById('header-search-form').submit();
	}
}

function getPosts() {
	return new Promise(function (resolve) {
		var posts = JSON.parse(storage.getItem(postsKey));

		if (posts == null) {
			var url = function () {
				if (typeof window['ghost'] !== 'undefined') {
					return window['ghost'].url.api('posts', { 'formats': ['plaintext'], 'include': ['tags'], 'limit': 'all' });
				}
				var contentApiAccessKey = document.querySelector('meta[property="content-api:access-key"],meta[name="content-api:access-key"]');
				if (contentApiAccessKey != null) {
					var accessKey = contentApiAccessKey.getAttribute('content');
					return baseUrl + '/ghost/api/v2/content/posts/?key=' + accessKey + '&formats=plaintext&include=tags&limit=all';
				}
				throw Error('Turn on Public API or provide Content API access key.');
			}();

			fetch(url).then(function (resp) {
				if (resp.ok) {
					return resp.json();
				} else {
					throw new Error('Unknown error occurred (HTTP ' + resp.status + ')');
				}
			}).then(function (resp) {
				try {
					storage.setItem(postsKey, JSON.stringify(resp.posts));
				} catch (e) {
					/* do nothing */
				}
				resolve(resp.posts);
			});
		} else {
			resolve(posts);
		}
	});
}

function getIndex(posts) {
	return new Promise(function (resolve) {
		var index = JSON.parse(storage.getItem(postsIndexKey));

		if (index == null || 1 > 0) {
			index = (0, _lunr2.default)(function (builder) {
				builder.ref('id');
				builder.field('title');
				builder.field('plaintext');
				posts.forEach(function (post) {
					builder.add(post);
				});
			});
			try {
				storage.setItem(postsIndexKey, JSON.stringify(index));
			} catch (e) {
				/* do nothing */
			}
			resolve([posts, index]);
		} else {
			resolve([posts, _lunr2.default.Index.load(index)]);
		}
	});
}

function getPostUrl(url) {
	if (/^https?:\/\//i.test(url)) {
		return url;
	}
	return '' + baseUrl + url;
}

function search(query) {
	getPosts().then(getIndex).then(function (x) {
		var _x = _slicedToArray(x, 2),
		    posts = _x[0],
		    index = _x[1];

		var matched = index.search(query);

		if (matched.length > 0) {
			matched.forEach(function (match) {
				var post = posts.find(function (post) {
					return match.ref === post.id;
				});

				var template = '\n                <article class="post preload-background" data-image="' + post.feature_image + '" data-resize="true">\n                    <a href="' + getPostUrl(post.url) + '" class="post-image">\n                        <span class="preload-background-image"></span>\n                        <span class="preload-background-spinner spinner" style="display: none;">\n                            <span class="double-bounce1"></span>\n                            <span class="double-bounce2"></span>\n                        </span>\n                        <header class="post-header">\n                            <h2 class="post-title">' + post.title + '</h2>\n                        </header>\n                    </a>\n                    <div class="post-category-wrap">\n                        ' + (post.primary_tag != null ? '<a href="' + baseUrl + '/tag/' + post.primary_tag.slug + '" class="post-category">' + post.primary_tag.name + '</a>' : '') + '\n                    </div>\n                </article>';
				results.insertAdjacentHTML('beforeend', template);
				ImagePreload.init();
			});

			resultsLoading.classList.add('hidden');
		} else {
			resultsLoading.classList.add('hidden');
			resultsEmpty.classList.remove('hidden');
			var input = resultsEmpty.querySelector('input[type=text]');
			if (input != null) {
				input.focus();
				input.setAttribute('value', query);
			}
		}
	});
}

function init() {
	searchButton.addEventListener('click', searchButtonClicked);

	if (results == null) {
		return;
	}

	search((0, _url.getQueryStringParam)('q'));
}

},{"../utils/url":20,"./imagePreload":4,"lunr":"lunr"}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OpenWeatherMap = function () {
    function OpenWeatherMap(settings) {
        _classCallCheck(this, OpenWeatherMap);

        this.key = settings['provider-key'];
        this.units = settings.units === 'c' ? 'metric' : 'imperial';
    }

    _createClass(OpenWeatherMap, [{
        key: 'load',
        value: function load(location) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                var url = window.location.protocol + '//api.openweathermap.org/data/2.5/forecast/daily?q=' + location + '&mode=json&units=' + _this.units + '&cnt=5&appid=' + _this.key;
                fetch(url).then(function (response) {
                    if (response.ok) {
                        return response.json();
                    } else {
                        reject('Unknown error occurred (HTTP ' + response.status + ')');
                    }
                }).then(function (response) {
                    var weather = {
                        success: true,
                        title: response.city.name,
                        city: response.city.name,
                        current: {
                            temp: Math.round(response.list[0].temp.day),
                            code: 'wi-owm-' + response.list[0].weather[0].id
                        },
                        forecast: response.list.slice(1, 4).map(function (f) {
                            return {
                                code: 'wi-owm-' + f.weather[0].id,
                                date: f.dt * 1000,
                                high: Math.round(f.temp.max),
                                low: Math.round(f.temp.min)
                            };
                        })
                    };

                    return resolve(weather);
                });
            });
        }
    }, {
        key: 'attribution',
        get: function get() {
            return {
                text: 'Powered by OpenWeatherMap',
                link: 'http://openweathermap.org/'
            };
        }
    }]);

    return OpenWeatherMap;
}();

exports.default = OpenWeatherMap;

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _YahooWeather = require('./YahooWeather');

var _YahooWeather2 = _interopRequireDefault(_YahooWeather);

var _OpenWeatherMap = require('./OpenWeatherMap');

var _OpenWeatherMap2 = _interopRequireDefault(_OpenWeatherMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WeatherDataProvider = function () {
	function WeatherDataProvider() {
		_classCallCheck(this, WeatherDataProvider);
	}

	_createClass(WeatherDataProvider, null, [{
		key: 'resolve',
		value: function resolve(settings) {
			switch (settings.provider) {
				case 'yahoo':
					return new _YahooWeather2.default(settings);
				case 'openweathermap':
					return new _OpenWeatherMap2.default(settings);
				default:
					return null;
			}
		}
	}]);

	return WeatherDataProvider;
}();

exports.default = WeatherDataProvider;

},{"./OpenWeatherMap":13,"./YahooWeather":16}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WeatherWidgetComponent = function () {
  function WeatherWidgetComponent(element, provider) {
    _classCallCheck(this, WeatherWidgetComponent);

    this.root = element;

    this.props = {
      attribution: provider.attribution,
      weekdays: element.getAttribute('data-weekdays').split(',')
    };

    this.state = {
      loading: true,
      title: this.root.getAttribute('data-loading-title'),
      data: null
    };

    this.render();
  }

  _createClass(WeatherWidgetComponent, [{
    key: 'update',
    value: function update(data) {
      var title = this.root.getAttribute('data-title');
      this.state.title = title.replace('$city', data.city);
      this.state.loading = false;
      this.state.data = data;
      this.render();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      var loadingTemplate = '\n        <div class="weather-loading">\n            <div class="spinner">\n                <div class="double-bounce1"></div>\n                <div class="double-bounce2"></div>\n            </div>\n        </div>';

      var weatherTemplate = !this.state.loading && '\n        <ul class="weather-forecast">\n            <li>\n              <span class="weather-weekday">Now</span>\n              <i class="wi ' + this.state.data.current.code + '"></i>\n              <span class="weather-temp">' + this.state.data.current.temp + '&deg;</span>\n            </li>\n            ' + this.state.data.forecast.map(function (f) {
        return '\n                <li>\n                    <span class="weather-weekday">' + _this.props.weekdays[new Date(f.date).getDay()] + '</span>\n                    <i class="wi ' + f.code + '"></i>\n                    <span class="weather-temp">' + f.high + '&deg;/' + f.low + '&deg;</span>\n                </li>\n            ';
      }).join('') + '\n        </ul>';

      var template = '\n        <div class="widget widget-side">\n          <h2 class="widget-title">' + this.state.title + '</h2>\n          <div class="weather">\n            ' + (this.state.loading ? loadingTemplate : weatherTemplate) + '\n            <div class="weather-attribution">\n              <a href=' + this.props.attribution.link + ' target="_blank">' + this.props.attribution.text + '</a>\n            </div>\n          </div>\n        </div>';

      while (this.root.firstChild) {
        this.root.removeChild(this.root.firstChild);
      }
      this.root.insertAdjacentHTML('beforeend', template);
    }
  }]);

  return WeatherWidgetComponent;
}();

exports.default = WeatherWidgetComponent;

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var YahooWeather = function () {
	function YahooWeather(settings) {
		_classCallCheck(this, YahooWeather);

		this.settings = settings;
		this.units = settings.units;
	}

	_createClass(YahooWeather, [{
		key: 'hmacsha1',
		value: function hmacsha1(k, d, _p, _z) {
			if (!_p) {
				_p = '=';
			}if (!_z) {
				_z = 8;
			}function _f(t, b, c, d) {
				if (t < 20) {
					return b & c | ~b & d;
				}if (t < 40) {
					return b ^ c ^ d;
				}if (t < 60) {
					return b & c | b & d | c & d;
				}return b ^ c ^ d;
			}function _k(t) {
				return t < 20 ? 1518500249 : t < 40 ? 1859775393 : t < 60 ? -1894007588 : -899497514;
			}function _s(x, y) {
				var l = (x & 0xFFFF) + (y & 0xFFFF),
				    m = (x >> 16) + (y >> 16) + (l >> 16);return m << 16 | l & 0xFFFF;
			}function _r(n, c) {
				return n << c | n >>> 32 - c;
			}function _c(x, l) {
				x[l >> 5] |= 0x80 << 24 - l % 32;x[(l + 64 >> 9 << 4) + 15] = l;var w = [80],
				    a = 1732584193,
				    b = -271733879,
				    c = -1732584194,
				    d = 271733878,
				    e = -1009589776;for (var i = 0; i < x.length; i += 16) {
					var o = a,
					    p = b,
					    q = c,
					    r = d,
					    s = e;for (var j = 0; j < 80; j++) {
						if (j < 16) {
							w[j] = x[i + j];
						} else {
							w[j] = _r(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
						}var t = _s(_s(_r(a, 5), _f(j, b, c, d)), _s(_s(e, w[j]), _k(j)));e = d;d = c;c = _r(b, 30);b = a;a = t;
					}a = _s(a, o);b = _s(b, p);c = _s(c, q);d = _s(d, r);e = _s(e, s);
				}return [a, b, c, d, e];
			}function _b(s) {
				var b = [],
				    m = (1 << _z) - 1;for (var i = 0; i < s.length * _z; i += _z) {
					b[i >> 5] |= (s.charCodeAt(i / 8) & m) << 32 - _z - i % 32;
				}return b;
			}function _h(k, d) {
				var b = _b(k);if (b.length > 16) {
					b = _c(b, k.length * _z);
				}var p = [16],
				    o = [16];for (var i = 0; i < 16; i++) {
					p[i] = b[i] ^ 0x36363636;o[i] = b[i] ^ 0x5C5C5C5C;
				}var h = _c(p.concat(_b(d)), 512 + d.length * _z);return _c(o.concat(h), 512 + 160);
			}function _n(b) {
				var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
				    s = '';for (var i = 0; i < b.length * 4; i += 3) {
					var r = (b[i >> 2] >> 8 * (3 - i % 4) & 0xFF) << 16 | (b[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4) & 0xFF) << 8 | b[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4) & 0xFF;for (var j = 0; j < 4; j++) {
						if (i * 8 + j * 6 > b.length * 32) {
							s += _p;
						} else {
							s += t.charAt(r >> 6 * (3 - j) & 0x3F);
						}
					}
				}return s;
			}function _x(k, d) {
				return _n(_h(k, d));
			}return _x(k, d);
		}
	}, {
		key: 'getAuthHeader',
		value: function getAuthHeader(url, params, key, secret) {
			var oauth = {
				'oauth_consumer_key': key,
				'oauth_nonce': Math.random().toString(36).substring(2),
				'oauth_signature_method': 'HMAC-SHA1',
				'oauth_timestamp': parseInt(new Date().getTime() / 1000).toString(),
				'oauth_version': '1.0'
			};

			var merged = Object.assign(Object.assign({}, params), oauth);
			var mergedArr = Object.keys(merged).sort().map(function (k) {
				return [k + '=' + encodeURIComponent(merged[k])];
			});

			oauth['oauth_signature'] = this.hmacsha1(encodeURIComponent(secret) + '&', 'GET&' + encodeURIComponent(url) + '&' + encodeURIComponent(mergedArr.join('&')));
			return 'OAuth ' + Object.keys(oauth).map(function (k) {
				return [k + '="' + oauth[k] + '"'];
			}).join(',');
		}
	}, {
		key: 'load',
		value: function load(location) {
			var _this = this;

			return new Promise(function (resolve, reject) {
				var url = 'https://weather-ydn-yql.media.yahoo.com/forecastrss';
				var query = { 'location': location, 'format': 'json', 'u': _this.units };
				var queryString = Object.keys(query).map(function (x) {
					return x + '=' + query[x];
				}).join('&');

				fetch(url + '?' + queryString, {
					headers: {
						'Authorization': _this.getAuthHeader(url, query, _this.settings['provider-client-id'], _this.settings['provider-key']),
						'X-Yahoo-App-Id': _this.settings['provider-app-id']
					}
				}).then(function (response) {
					return response.json();
				}).then(function (response) {
					if (typeof response.location.city === 'undefined') {
						return reject('No result returned');
					}
					resolve({
						success: true,
						title: 'xxx',
						city: response.location.city,
						current: {
							temp: response.current_observation.condition.temperature,
							code: 'wi-yahoo-' + response.current_observation.condition.code
						},
						forecast: response.forecasts.slice(1, 4).map(function (f) {
							return {
								code: 'wi-yahoo-' + f.code,
								date: f.date * 1000,
								high: f.high,
								low: f.low
							};
						})
					});
				});
			});
		}
	}, {
		key: 'attribution',
		get: function get() {
			return {
				text: 'Powered by Yahoo!',
				link: 'https://www.yahoo.com/?ilc=401'
			};
		}
	}]);

	return YahooWeather;
}();

exports.default = YahooWeather;

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _weatherWidget = require('./weatherWidget');

Object.defineProperty(exports, 'init', {
  enumerable: true,
  get: function get() {
    return _weatherWidget.init;
  }
});

},{"./weatherWidget":18}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.init = init;

var _WeatherDataProvider = require('./WeatherDataProvider');

var _WeatherDataProvider2 = _interopRequireDefault(_WeatherDataProvider);

var _WeatherWidgetComponent = require('./WeatherWidgetComponent');

var _WeatherWidgetComponent2 = _interopRequireDefault(_WeatherWidgetComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getSettings() {
	var defaults = {
		'location': null,
		'provider': '',
		'provider-key': '',
		'provider-client-id': '',
		'provider-app-id': '',
		'delay': 0,
		'title': 'Loading weather data...',
		'units': 'c'
	};

	Object.keys(defaults).forEach(function (key) {
		var element = document.querySelector('meta[property=\'weather-widget:' + key + '\'],meta[name=\'weather-widget:' + key + '\']');
		if (element == null) {
			return;
		}

		defaults[key] = element.getAttribute('content');
	});

	return defaults;
}

function delay(duration) {
	return new Promise(function (resolve) {
		setTimeout(function () {
			return resolve();
		}, duration);
	});
}

function init() {
	var settings = getSettings();
	// const provider = WeatherDataProvider.resolve( settings.provider, settings.units, settings[ 'provider-key' ] );
	var provider = _WeatherDataProvider2.default.resolve(settings);
	var element = document.querySelector('.render-component-weather');

	if (provider == null || settings['location'] == null) {
		return;
	}

	var component = new _WeatherWidgetComponent2.default(element, provider);

	delay(settings.duration).then(function () {
		return provider.load(settings.location);
	}).then(function (response) {
		return component.update(response);
	});
}

},{"./WeatherDataProvider":14,"./WeatherWidgetComponent":15}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.loadScript = loadScript;
function loadScript(source) {
	return new Promise(function (resolve, reject) {
		var script = document.createElement('script');
		script.setAttribute('async', 'async');
		script.setAttribute('defer', 'defer');
		var prior = document.getElementsByTagName('script')[0];
		script.async = 1;

		script.onload = script.onreadystatechange = function (_, isAbort) {
			if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
				script.onload = script.onreadystatechange = null;
				script = undefined;

				if (!isAbort) {
					resolve();
				} else {
					reject();
				}
			}
		};

		script.src = source;
		prior.parentNode.insertBefore(script, prior);
	});
}

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getQueryStringParam = getQueryStringParam;
function getQueryStringParam(field, url) {
    var href = url ? url : window.location.href;
    var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
    var string = reg.exec(href);
    return string ? decodeURIComponent(string[1].replace(/\+/g, ' ')) : null;
}

},{}]},{},[1]);
