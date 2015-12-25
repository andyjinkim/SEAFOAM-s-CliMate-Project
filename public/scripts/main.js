//Weather Pattern Determination
var weatherPattern;
var weatherTypes = ["sunny","rainy","snowy","cloudy"];
var wundergroundType;
var dayInfo = [];


var weatherObject = {
	sunny:
		["Clear",
			"Unknown",
			"Scattered Clouds"],
	rainy:
		["Light Drizzle",	"Heavy Drizzle",
		"Light Rain",	"Heavy Rain",
		"Light Mist",	"Heavy Mist",
		"Light Spray",	"Heavy Spray",
		"Light Rain Mist",	"Heavy Rain Mist",
		"Light Rain Showers",	"Heavy Rain Showers",
		"Light Thunderstorm",	"Heavy Thunderstorm",
		"Light Thunderstorms and Rain",	"Heavy Thunderstorms and Rain",
		"Light Thunderstorms and Ice Pellets",	"Heavy Thunderstorms and Ice Pellets",
		"Light Thunderstorms with Hail",	"Heavy Thunderstorms with Hail",
		"Light Thunderstorms with Small Hail",	"Heavy Thunderstorms with Small Hail",
		"Light Freezing Drizzle",	"Heavy Freezing Drizzle",
		"Light Freezing Rain",	"Heavy Freezing Rain",
		"Light Freezing Fog",	"Heavy Freezing Fog",
		"Squalls",
		"Unknown Precipitation","Rain", "Rain",
		"Mist",
		"Spray",
		"Rain Mist",
		"Rain Showers",
		"Thunderstorm",
		"Thunderstorms and Rain"],
	snowy:
		["Light Snow Grains",	"Heavy Snow Grains",
			"Light Ice Crystals",	"Heavy Ice Crystals",
			"Light Ice Pellets",	"Heavy Ice Pellets",
			"Light Low Drifting Snow",	"Heavy Low Drifting Snow",
			"Light Snow",	"Heavy Snow",
			"Light Blowing Snow",	"Heavy Blowing Snow",
			"Light Snow Showers",	"Heavy Snow Showers",
			"Light Snow Blowing Snow Mist",	"Heavy Snow Blowing Snow Mist",
			"Light Ice Pellet Showers",	"Heavy Ice Pellet Showers",
			"Light Hail Showers",	"Heavy Hail Showers",
			"Light Small Hail Showers",	"Heavy Small Hail Showers",
			"Light Thunderstorms and Snow",	"Heavy Thunderstorms and Snow",
			"Small Hail", "Snow"," Snow",	"Ice Pellet Showers",
			"Snow Grains",	"Hail Showers",
			"Ice Crystals",	"Small Hail Showers",
			"Ice Pellets",	"Thunderstorms and Snow",
			"Hail",	"Thunderstorms and Ice Pellets",
			"Low Drifting Snow",	"Thunderstorms with Hail",
			"Blowing Snow",	"Thunderstorms with Small Hail",
			"Snow Showers",	"Freezing Drizzle",
			"Snow Blowing Snow Mist",	"Freezing Rain",
			"Freezing Fog"],
	cloudy:
		["Light Fog",	"Heavy Fog",
			"Light Fog Patches",	"Heavy Fog Patches",
			"Light Smoke",	"Heavy Smoke",
			"Light Volcanic Ash",	"Heavy Volcanic Ash",
			"Light Widespread Dust",	"Heavy Widespread Dust",
			"Light Sand",	"Heavy Sand",
			"Light Haze",	"Heavy Haze",
			"Light Dust Whirls",	"Heavy Dust Whirls",
			"Light Sandstorm",	"Heavy Sandstorm",
			"Light Low Drifting Sand",	"Heavy Low Drifting Sand",
			"Light Blowing Widespread Dust",	"Heavy Blowing Widespread Dust",
			"Light Blowing Sand",	"Heavy Blowing Sand",
			"Patches of Fog",
			"Shallow Fog",
			"Partial Fog",
			"Overcast",
			"Partly Cloudy",
			"Mostly Cloudy",
			"Funnel Cloud", "Fog",	"Dust Whirls",
			"Fog Patches",	"Sandstorm",
			"Smoke",	"Low Drifting Widespread Dust",
			"Volcanic Ash",	"Low Drifting Sand",
			"Widespread Dust",	"Blowing Widespread Dust",
			"Sand",	"Blowing Sand",
			"Haze"	]
	}


function determineWeather(forecast,checkForecast){

	$('#canvas').fadeOut(2000)
	$('.canvas-holder').children().delay(2000).remove()

	var canv = document.createElement('canvas');
	canv.id = 'canvas';
	canv.width = 480;
	canv.height = 350;
	$('.canvas-holder').append(canv)
	$('#canvas').hide().fadeIn(2000)


		if(!wundergroundType){
		weatherPattern = "rainyDay"
		weatherAnimate.rainyDay()
	} else {
		for (var i = 0; i < weatherObject.sunny.length; i++) {
			if(weatherObject.sunny[i]===wundergroundType){
				weatherPattern = "sunnyDay"
				weatherAnimate.sunnyDay()
			}
		}
		for (var i = 0; i < weatherObject.cloudy.length; i++) {
			if(weatherObject.cloudy[i]===wundergroundType){
				weatherPattern = "cloudyDay"
				weatherAnimate.cloudyDay()
			}
		}
		for (var i = 0; i < weatherObject.snowy.length; i++) {
			if(weatherObject.snowy[i]===wundergroundType){
				weatherPattern = "snowyDay"
				weatherAnimate.snowyDay()
			}
		}
		for (var i = 0; i < weatherObject.rainy.length; i++) {
			if(weatherObject.rainy[i]===wundergroundType){
				weatherPattern = "rainyDay"
				weatherAnimate.rainyDay()
			}
		}
	} console.log(wundergroundType + " = " + weatherPattern)
}


//Setup variables to be used for API searches
var yelpURL = 'http://api.yelp.com/v2/search'
var conditionsURL = 'https://api.wunderground.com/api/726c0ba149d8a811/conditions/q/'
var forecastURL = 'https://api.wunderground.com/api/726c0ba149d8a811/forecast/q/'
// var $inpCtry = $('#appendCountryUrl')
// var $inpState = $('#appendStateUrl')
// var $inpCity = $('#appendCityUrl')
var city;
var state;

// create placeholder variables for User Position - used for Uber
var userLatitude;
var userLongitude;
var yelpLatitude;
var yelpLongitude;
var uberPrice;
var uberTimeMin;
var uberDistMiles;

// Uber API Constants
var uberClientId = "O4DQyt8u2XTuKGUAft4YZlzS9Yni4QQH";
var uberServerToken = "7zMUXj4LgZviCq0xfEdpgLn6LsBlENzR3EYlUItz";


//Twitter socket io instantiation
var socket = io();
socket.on('connect', function(){
	console.log('Connected!')
})

//Get user location
//for Weather call
var startLatitude;
var startLongitude;
var geoStateAbrev;
var geoStateFull;
var geoCity;

///////////////////////////////////////////////////////////////////////////////

//Get IP info for current user to be able to pass city and state to weather search
//NOT USED DUE TO UNSECURED URL GET REQUEST - HEROKU DID NOT ACCEPT
// $.get("http://ipinfo.io", function(ip_info) {
//     console.log(ip_info.city, ip_info.region);
//      state = convert_state(ip_info.region, 'abbrev');
//      city  = ip_info.city;
//
//     $inpCity.val(city)
//     $inpState.val(state)
//
// }, "jsonp");

//Get user location continuously for yelp and uber responses
navigator.geolocation.watchPosition(function(position) {
	console.log(position);
	// Update latitude and longitude
	userLatitude = position.coords.latitude;
	userLongitude = position.coords.longitude;
});

navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
//Get the latitude and the longitude;
function successFunction(position) {
	var startLatitude = position.coords.latitude;
	var startLongitude = position.coords.longitude;
	// console.log(startLongitude)
	getLocationAndMakeCalls(startLatitude, startLongitude)
}

function errorFunction(){
	alert("Geocoder failed");
}

//Get Google GeoCode API based on user startLatitude and startLongitude
//Parse through result object to return city and state for use in weather call
//Make calls to Weather, Yelp, Uber, and Twitter based on user location
//******************** API CALLS ON PAGE LOAD *********************//
function getLocationAndMakeCalls(lat, lng) {
	//make call to google geocode for user start lat and start long
	$.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" +lat + "," + lng + "&key=AIzaSyDtL6P7cJfHJg3LQARwMlMXNl7iCGWm_8I", function(data,status){
		// for (var i = 0; i < data.results.length; i++) {
		//   console.log(data.results[i])
		// }
		if (data.results[1]) {
			for (var i=0; i<data.results[0].address_components.length; i++) {
				for (var b=0;b<data.results[0].address_components[i].types.length;b++) {
					//there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
					if (data.results[0].address_components[i].types[b] == "administrative_area_level_1") {
						//this is the state object
						state= data.results[0].address_components[i];
					}
					if (data.results[0].address_components[i].types[b] == "locality") {
						//this is the city object
						city = data.results[0].address_components[i];
					}
				}
			}
			//state data
			geoCity = city.long_name
			geoStateAbrev = state.short_name
			geoStateFull = state.long_name
			console.log(geoCity + " " + geoStateAbrev + " " + geoStateFull)
		} else {
			alert("No results found");
		}
		console.log('window loads', geoStateAbrev)
		///// Weather Underground API Call /////////////////////////////////////////
		$.ajax({
			url: conditionsURL + geoStateAbrev + '/' + geoCity + '.json',
			method: 'GET',
			success: function (data) {
				console.log(data.current_observation.weather, data.current_observation.temperature_string)
				wundergroundType = data.current_observation.weather
				//Use this function to pass weather type returned from weather underground
				determineWeather(wundergroundType,weatherObject)
			}
		})
		$.ajax({
			url: forecastURL + geoStateAbrev + '/' + geoCity + '.json',
			method: 'GET',
			success: function(data){
				data.forecast.simpleforecast.forecastday.forEach(function(day,index){
					console.log('===DAY INFO===',index, day);
					$('#temp' + index + 'H').text(day.high.fahrenheit + "F")
					$('#temp' + index + 'L').text(day.low.fahrenheit + " F")
					$('#day' + index + "title").text(day.date.weekday_short)
					$('#img' + index).attr('src',day.icon_url)

				})
				data.forecast.txt_forecast.forecastday.forEach(function (info) {
					dayInfo.push(info.fcttext)
				})
			}
		})
		////// Yelp and Uber API Calls ///////////////////////////////////////////////////////
		$.ajax({
			url: '/yelp/' + geoCity + geoStateAbrev,
			method: 'GET',
			success: function(data){
				// console.log(data)
				if(data.businesses){
					for (var i = 0; i < 5; i++){
						var business = data.businesses[i]
						//If no lat and long returned from Yelp -
						if(!business.location.coordinate){
							console.log("no lat and long from yelp")
						}
						//Set Yelp Lat and Long for Uber endpoint use and run Uber call
						else {
							yelpLatitude = business.location.coordinate.latitude
							yelpLongitude = business.location.coordinate.longitude
							//Run Uber Ajax call for price and time estimates to each Yelp location returned
							getEstimatesForUserLocation(userLatitude, userLongitude)


						}
						console.log('=yelp biz=',business)


						if (business.location.neighborhoods){
							$(".yelp").append('<li class="collection-item avatar"> <img src="'+ business.image_url +'" alt="" class="circle"><span class="title">'+business.name+'</span><p>'+ business.phone + '<br>' + business.location.neighborhoods[0] + '</p><a href="#!" class="secondary-content">'+business.rating+'<i class="material-icons">grade</i></a></li>')
						}
						else{
							$(".yelp").append('<li class="collection-item avatar"> <img src="'+ business.image_url +'" alt="" class="circle"><span class="title">'+business.name+'</span><p>'+ business.phone + '<br>' + business.location.city + '</p><a href="#!" class="secondary-content">'+business.rating+'<i class="material-icons">grade</i></a></li>')
						}
					}
				}
			}
		})
		var search_term = geoCity
		// console.log(search_term)
		socket.emit('updateTerm', search_term)
		$(".yelp").empty()
	})
}

//Ajax Get for Uber price estimate based on User location
function getEstimatesForUserLocation(latitude,longitude) {
	$.ajax({
		url: "https://api.uber.com/v1/estimates/price",
		headers: {
			Authorization: "Token " + uberServerToken
		},
		data: {
			start_latitude: latitude,
			start_longitude: longitude,
			end_latitude: yelpLatitude,   //from query to Yelp
			end_longitude: yelpLongitude  //from query to Yelp
		},
		success: function(result) {
			uberTitle = "UberX"
			uberPrice = result.prices[0].estimate;
			uberTimeMin = Math.round(result.prices[0].duration/60) + " min."
			uberDistMiles = result.prices[0].distance
			$(".uber").children().first().fadeOut().remove()
			$(".uber").append('<li class="collection-item avatar"><span class="title">'+ uberTitle +'</span><img src="../uberbadge.png" alt="UberX" class="circle" id="uberPic"><p>'+ uberPrice + '<br>' + uberTimeMin + '</p></li>')
			// }
			console.log( uberPrice + ' : ' + uberTimeMin + ' min. : ' + uberDistMiles + ' mi.')
		},
		error: function(error) {
			console.log(error)
			uberPrice = "$$$"
			uberTimeMin = "Too far for Uber"
			uberDistMiles = ""
				$(".uber").children().first().fadeOut().remove()
			$(".uber").append('<li class="collection-item avatar"><span class="title">'+ uberTitle +'</span><img src="../uberbadge.png" alt="UberX" class="circle"><p>'+ uberPrice + '<br>' + uberTimeMin + '</p></li>')
		}
	});
}

$('.delete').on('click', function(){
	$.ajax({
		url: '/profile',
		method: 'GET',
		success: function(user){
		var id = user._id
		$.ajax({
			url: '/destroy/565b9d0f7b9363b90583365d',
			method: 'DELETE',
			success: function(data){
				User.findOneAndRemove({_id:req.params.user_id}, function(err, user){
					if(err) res.json({err:err})
					res.json({success: true, message: 'User has been obliterated into the ether.'})
				})
			}
		})
	}
})
})
//Get Weather and Call APIs Uber and Yelp for SEARCH location (GEO Coordinates)
//Stream twitter based on input city
$('#submit').on('click', function(){
	////// Twitter Stream Call ////////////////////////////////////////////////

  var search_term = $('.appendCityUrl').val()
  // console.log(search_term)
  socket.emit('updateTerm', search_term)
  $(".yelp").empty()
  //Weather API Call
  $.ajax({
    url: conditionsURL + $('.appendStateUrl').val() + '/' + $('.appendCityUrl').val() + '.json',
    method: 'GET',
    success: function (data) {
      console.log(data.current_observation.weather, data.current_observation.temperature_string)
      wundergroundType = data.current_observation.weather;
      determineWeather(wundergroundType,weatherObject)
      }
    })
		//Weather Info update call
		$.ajax({
			url: forecastURL + $('.appendStateUrl').val() + '/' + $('.appendCityUrl').val() + '.json',
			method: 'GET',
			success: function(data){
				data.forecast.simpleforecast.forecastday.forEach(function(day,index){
					console.log('===DAY INFO===',index, day);
					$('#temp' + index + 'H').text(day.high.fahrenheit + "F")
					$('#temp' + index + 'L').text(day.low.fahrenheit + " F")
					$('#day' + index + "title").text(day.date.weekday_short)
					$('#img' + index).attr('src',day.icon_url)

				})
				data.forecast.txt_forecast.forecastday.forEach(function (info) {
					dayInfo.push(info.fcttext)
				})
			}
		})
      // AJAX call for Yelp API app using city and state from user location info
  $.ajax({
    url: '/yelp/' + $('.appendCityUrl').val() + $('.appendStateUrl').val(),
    method: 'GET',
    success: function(data){
      console.log(data)
      for (var i = 0; i < 5; i++){
        var business = data.businesses[i]
        //If no lat and long returned from Yelp -
        if(!business.location.coordinate){
          console.log("no lat and long from yelp")
        }
        //Set Yelp Lat and Long for Uber endpoint use and run Uber call
        else {
            yelpLatitude = business.location.coordinate.latitude
            yelpLongitude = business.location.coordinate.longitude
            //Run Uber Ajax call for price and time estimates to each Yelp location returned
            getEstimatesForUserLocation(userLatitude, userLongitude)
          }
        // console.log(business)
				if (business.location.neighborhoods){
					$(".yelp").append('<li class="collection-item avatar"> <img src="'+ business.image_url +'" alt="" class="circle"><span class="title">'+business.name+'</span><p>'+ business.phone + '<br>' + business.location.neighborhoods[0] + '</p><a href="#!" class="secondary-content">'+business.rating+'<i class="material-icons">grade</i></a></li>')
				}
				else{
					$(".yelp").append('<li class="collection-item avatar"> <img src="'+ business.image_url +'" alt="" class="circle"><span class="title">'+business.name+'</span><p>'+ business.phone + '<br>' + business.location.city + '</p><a href="#!" class="secondary-content">'+business.rating+'<i class="material-icons">grade</i></a></li>')
				}
      }
    }
  })
})

socket.on('tweets', function(tweet){
	// console.log('====tweet====',tweet)
	var $toastContent = $('<span>' + tweet.text + '</span>');
	Materialize.toast($toastContent, 5000);
	// $(".twitterStream").text()
})



//show details of the current days weather
$('.showDetails').on('click',function(){
	$('#details' + this.id).text(dayInfo[this.id])
})

///////////////////////////////////////////////////////////////////////////////
//THIS IS THE WEATHER PATTERN CODE SECTION////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


 // * Defines a new instance of the rainyday.js.

var weatherAnimate = {
	rainyDay: function() {
		var engine = new RainyDay({
					image: backgroundImage,
					// crop: [ 50, 50, 600, 400]
					fps: 50,
					fillStyle: 'white',
					enableCollisions: true,
					enableSizeChange: true,
					// gravityThreshold: 10,
					gravityAngle: Math.PI/2,
					gravityAngleVariance: 0
			}, document.getElementById('canvas'));

			console.log(this)
			engine.trail = engine.TRAIL_SMUDGE;
			engine.gravity = engine.GRAVITY_NON_LINEAR;
			engine.reflection = engine.REFLECTION_MINIATURE;
			engine.rain([ [5, 2, 0.1], [3,3,0.8]], 7);
	}
	,snowyDay: snowyDayRender
	,cloudyDay: cloudyDayRender
	,sunnyDay: sunnyDayRender
}


//SET BACKGROUND IMAGE TO CANVAS
var backgroundImage = new Image();
backgroundImage.src = "./bluesky.jpg"
backgroundImage.crossOrigin = 'anonymous';
backgroundImage.size = "cover"




// * param options options element with script parameters
// * param canvas to be used (if not defined a new one will be created)
function RainyDay(options, canvas) {

	if (this === window) { //if *this* is the window object, start over with a *new* object
		return new RainyDay(options, canvas);
	}

	this.img = options.image;
	var defaults = {
		opacity: 1,
		blur: 10,
		crop: [0, 0, this.img.naturalWidth, this.img.naturalHeight],
		enableSizeChange: true,
		parentElement: document.getElementsByTagName('body')[0],
		fps: 30,
		fillStyle: '#8ED6FF',
		enableCollisions: true,
		gravityThreshold: 3,
		gravityAngle: Math.PI / 2,
		gravityAngleVariance: 0,
		reflectionScaledownFactor: 5,
		reflectionDropMappingWidth: 200,
		reflectionDropMappingHeight: 200,
		width: this.img.clientWidth,
		height: this.img.clientHeight,
		position: 'absolute',
		top: 0,
		left: 0
	};

	// add the defaults to options
	for (var option in defaults) {
		if (typeof options[option] === 'undefined') {
			options[option] = defaults[option];
		}
	}
	this.options = options;

	this.drops = [];

	// prepare canvas elements
	this.canvas = canvas || this.prepareCanvas();
	this.prepareBackground();
	this.prepareGlass();

	// assume defaults
	this.reflection = this.REFLECTION_MINIATURE;
	this.trail = this.TRAIL_DROPS;
	this.gravity = this.GRAVITY_NON_LINEAR;
	this.collision = this.COLLISION_SIMPLE;

	// set polyfill of requestAnimationFrame
	this.setRequestAnimFrame();

	console.log(this)
}

// /**
//  * Create the main canvas over a given element
//  * @returns HTMLElement the canvas
//  */
RainyDay.prototype.prepareCanvas = function() {
	var canvas = document.createElement('canvas');
	canvas.style.position = this.options.position;
	canvas.style.top = this.options.top;
	canvas.style.left = this.options.left;
	canvas.width = this.options.width;
	canvas.height = this.options.height;
	this.options.parentElement.appendChild(canvas);
	if (this.options.enableSizeChange) {
		this.setResizeHandler();
	}
	return canvas;
};

RainyDay.prototype.setResizeHandler = function() {
	// use setInterval if oneresize event already use by other.
	if (window.onresize !== null) {
		window.setInterval(this.checkSize.bind(this), 100);
	} else {
		window.onresize = this.checkSize.bind(this);
		window.onorientationchange = this.checkSize.bind(this);
	}
};

// /**
//  * Periodically check the size of the underlying element
//  */
RainyDay.prototype.checkSize = function() {
	var clientWidth = this.img.clientWidth;
	var clientHeight = this.img.clientHeight;
	var clientOffsetLeft = this.img.offsetLeft;
	var clientOffsetTop = this.img.offsetTop;
	var canvasWidth = this.canvas.width;
	var canvasHeight = this.canvas.height;
	var canvasOffsetLeft = this.canvas.offsetLeft;
	var canvasOffsetTop = this.canvas.offsetTop;

	if (canvasWidth !== clientWidth || canvasHeight !== clientHeight) {
		this.canvas.width = clientWidth;
		this.canvas.height = clientHeight;
		this.prepareBackground();
		this.glass.width = this.canvas.width;
		this.glass.height = this.canvas.height;
		this.prepareReflections();
	}
	if (canvasOffsetLeft !== clientOffsetLeft || canvasOffsetTop !== clientOffsetTop) {
		this.canvas.offsetLeft = clientOffsetLeft;
		this.canvas.offsetTop = clientOffsetTop;
	}
};

/**
 * Start animation loop
 */
RainyDay.prototype.animateDrops = function() {
	if (this.addDropCallback) {
		this.addDropCallback();
	}
	// |this.drops| array may be changed as we iterate over drops
	var dropsClone = this.drops.slice();
	var newDrops = [];
	for (var i = 0; i < dropsClone.length; ++i) {
		if (dropsClone[i].animate()) {
			newDrops.push(dropsClone[i]);
		}
	}
	this.drops = newDrops;
	window.requestAnimFrame(this.animateDrops.bind(this));
};

/**
 * Polyfill for requestAnimationFrame
 */
RainyDay.prototype.setRequestAnimFrame = function() {
	var fps = this.options.fps;
	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / fps);
			};
	})();
};

/**
 * Create the helper canvas for rendering raindrop reflections.
 */
RainyDay.prototype.prepareReflections = function() {
	this.reflected = document.createElement('canvas');
	this.reflected.width = this.canvas.width / this.options.reflectionScaledownFactor;
	this.reflected.height = this.canvas.height / this.options.reflectionScaledownFactor;
	var ctx = this.reflected.getContext('2d');
	ctx.drawImage(this.img, this.options.crop[0], this.options.crop[1], this.options.crop[2], this.options.crop[3], 0, 0, this.reflected.width, this.reflected.height);
};

/**
 * Create the glass canvas.
 */
RainyDay.prototype.prepareGlass = function() {
	this.glass = document.createElement('canvas');
	this.glass.width = this.canvas.width;
	this.glass.height = this.canvas.height;
	this.context = this.glass.getContext('2d');
};

/**
 // * Main function for starting rain rendering.
 // * presets list of presets to be applied
 // * speed speed of the animation (if not provided or 0 static image will be generated)
 // */
RainyDay.prototype.rain = function(presets, speed) {
	// prepare canvas for drop reflections
	if (this.reflection !== this.REFLECTION_NONE) {
		this.prepareReflections();
	}

	this.animateDrops();

	// animation
	this.presets = presets;

	this.PRIVATE_GRAVITY_FORCE_FACTOR_Y = (this.options.fps * 0.001) / 25;
	this.PRIVATE_GRAVITY_FORCE_FACTOR_X = ((Math.PI / 2) - this.options.gravityAngle) * (this.options.fps * 0.001) / 50;

	// prepare gravity matrix
	if (this.options.enableCollisions) {

		// calculate max radius of a drop to establish gravity matrix resolution
		var maxDropRadius = 0;
		for (var i = 0; i < presets.length; i++) {
			if (presets[i][0] + presets[i][1] > maxDropRadius) {
				maxDropRadius = Math.floor(presets[i][0] + presets[i][1]);
			}
		}

		if (maxDropRadius > 0) {
			// initialize the gravity matrix
			var mwi = Math.ceil(this.canvas.width / maxDropRadius);
			var mhi = Math.ceil(this.canvas.height / maxDropRadius);
			this.matrix = new CollisionMatrix(mwi, mhi, maxDropRadius);
		} else {
			this.options.enableCollisions = false;
		}
	}

	for (var i = 0; i < presets.length; i++) {
		if (!presets[i][3]) {
			presets[i][3] = -1;
		}
	}

	var lastExecutionTime = 0;
	this.addDropCallback = function() {
		var timestamp = new Date().getTime();
		if (timestamp - lastExecutionTime < speed) {
			return;
		}
		lastExecutionTime = timestamp;
		var context = this.canvas.getContext('2d');
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		context.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
		// select matching preset
		var preset;
		for (var i = 0; i < presets.length; i++) {
			if (presets[i][2] > 1 || presets[i][3] === -1) {
				if (presets[i][3] !== 0) {
					presets[i][3]--;
					for (var y = 0; y < presets[i][2]; ++y) {
						this.putDrop(new Drop(this, Math.random() * this.canvas.width, Math.random() * this.canvas.height, presets[i][0], presets[i][1]));
					}
				}
			} else if (Math.random() < presets[i][2]) {
				preset = presets[i];
				break;
			}
		}
		if (preset) {
			this.putDrop(new Drop(this, Math.random() * this.canvas.width, Math.random() * this.canvas.height, preset[0], preset[1]));
		}
		context.save();
		context.globalAlpha = this.options.opacity;
		context.drawImage(this.glass, 0, 0, this.canvas.width, this.canvas.height);
		context.restore();
	}
		.bind(this);
};

/**
 * Adds a new raindrop to the animation.
 * drop drop object to be added to the animation
 */
RainyDay.prototype.putDrop = function(drop) {
	drop.draw();
	if (this.gravity && drop.r > this.options.gravityThreshold) {
		if (this.options.enableCollisions) {
			this.matrix.update(drop);
		}
		this.drops.push(drop);
	}
};

/**
 * Clear the drop and remove from the list if applicable.
 * @drop to be cleared
 * @force force removal from the list
 * result if true animation of this drop should be stopped
 */
RainyDay.prototype.clearDrop = function(drop, force) {
	var result = drop.clear(force);
	if (result) {
		var index = this.drops.indexOf(drop);
		if (index >= 0) {
			this.drops.splice(index, 1);
		}
	}
	return result;
};

/**
 // * Defines a new raindrop object.
 // * param rainyday reference to the parent object
 // * param centerX x position of the center of this drop
 // * param centerY y position of the center of this drop
 // * param min minimum size of a drop
 // * param base base value for randomizing drop size
 // */

function Drop(rainyday, centerX, centerY, min, base) {
	this.x = Math.floor(centerX);
	this.y = Math.floor(centerY);
	this.r = (Math.random() * base) + min;
	this.rainyday = rainyday;
	this.context = rainyday.context;
	this.reflection = rainyday.reflected;
}

/**
 * Draws a raindrop on canvas at the current position.
 */
Drop.prototype.draw = function() {
	this.context.save();
	this.context.beginPath();

	var orgR = this.r;
	this.r = 0.95 * this.r;
	if (this.r < 3) {
		this.context.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
		this.context.closePath();
	} else if (this.colliding || this.yspeed > 2) {
		if (this.colliding) {
			var collider = this.colliding;
			this.r = 1.001 * (this.r > collider.r ? this.r : collider.r);
			this.x += (collider.x - this.x);
			this.colliding = null;
		}

		var yr = 1 + 0.1 * this.yspeed;
		this.context.moveTo(this.x - this.r / yr, this.y);
		this.context.bezierCurveTo(this.x - this.r, this.y - this.r * 2, this.x + this.r, this.y - this.r * 2, this.x + this.r / yr, this.y);
		this.context.bezierCurveTo(this.x + this.r, this.y + yr * this.r, this.x - this.r, this.y + yr * this.r, this.x - this.r / yr, this.y);
	} else {
		this.context.arc(this.x, this.y, this.r * 0.9, 0, Math.PI * 2, true);
		this.context.closePath();
	}

	this.context.clip();

	this.r = orgR;

	if (this.rainyday.reflection) {
		this.rainyday.reflection(this);
	}

	this.context.restore();
};

/**
 * Clears the raindrop region.
 * param force force stop
 * returns Boolean true if the animation is stopped
 */
Drop.prototype.clear = function(force) {
	this.context.clearRect(this.x - this.r - 1, this.y - this.r - 2, 2 * this.r + 2, 2 * this.r + 2);
	if (force) {
		this.terminate = true;
		return true;
	}
	if ((this.y - this.r > this.rainyday.canvas.height) || (this.x - this.r > this.rainyday.canvas.width) || (this.x + this.r < 0)) {
		// over edge so stop this drop
		return true;
	}
	return false;
};

/**
 * Moves the raindrop to a new position according to the gravity.
 */
Drop.prototype.animate = function() {
	if (this.terminate) {
		return false;
	}
	var stopped = this.rainyday.gravity(this);
	if (!stopped && this.rainyday.trail) {
		this.rainyday.trail(this);
	}
	if (this.rainyday.options.enableCollisions) {
		var collisions = this.rainyday.matrix.update(this, stopped);
		if (collisions) {
			this.rainyday.collision(this, collisions);
		}
	}
	return !stopped || this.terminate;
};

/**
 * TRAIL function: no trail at all
 */
RainyDay.prototype.TRAIL_NONE = function() {
	// nothing going on here
};

/**
 * TRAIL function: trail of small drops (default)
 * param drop raindrop object
 */
RainyDay.prototype.TRAIL_DROPS = function(drop) {
	if (!drop.trailY || drop.y - drop.trailY >= Math.random() * 100 * drop.r) {
		drop.trailY = drop.y;
		this.putDrop(new Drop(this, drop.x + (Math.random() * 2 - 1) * Math.random(), drop.y - drop.r - 5, Math.ceil(drop.r / 5), 0));
	}
};

/**
 * TRAIL function: trail of unblurred image
 * param drop raindrop object
 */
RainyDay.prototype.TRAIL_SMUDGE = function(drop) {
	var y = drop.y - drop.r - 3;
	var x = drop.x - drop.r / 2 + (Math.random() * 2);
	if (y < 0 || x < 0) {
		return;
	}
	this.context.drawImage(this.clearbackground, x, y, drop.r, 2, x, y, drop.r, 2);
};

/**
 * GRAVITY function: no gravity at all
 * returns Boolean true if the animation is stopped
 */
RainyDay.prototype.GRAVITY_NONE = function() {
	return true;
};

/**
 * GRAVITY function: linear gravity
 * param drop raindrop object
 * returns Boolean true if the animation is stopped
 */
RainyDay.prototype.GRAVITY_LINEAR = function(drop) {
	if (this.clearDrop(drop)) {
		return true;
	}

	if (drop.yspeed) {
		drop.yspeed += this.PRIVATE_GRAVITY_FORCE_FACTOR_Y * Math.floor(drop.r);
		drop.xspeed += this.PRIVATE_GRAVITY_FORCE_FACTOR_X * Math.floor(drop.r);
	} else {
		drop.yspeed = this.PRIVATE_GRAVITY_FORCE_FACTOR_Y;
		drop.xspeed = this.PRIVATE_GRAVITY_FORCE_FACTOR_X;
	}

	drop.y += drop.yspeed;
	drop.draw();
	return false;
};

/**
 * GRAVITY function: non-linear gravity (default)
 * param drop raindrop object
 * @returns Boolean true if the animation is stopped
 */
RainyDay.prototype.GRAVITY_NON_LINEAR = function(drop) {
	if (this.clearDrop(drop)) {
		return true;
	}

	if (drop.collided) {
		drop.collided = false;
		drop.seed = Math.floor(drop.r * Math.random() * this.options.fps);
		drop.skipping = false;
		drop.slowing = false;
	} else if (!drop.seed || drop.seed < 0) {
		drop.seed = Math.floor(drop.r * Math.random() * this.options.fps);
		drop.skipping = drop.skipping === false ? true : false;
		drop.slowing = true;
	}

	drop.seed--;

	if (drop.yspeed) {
		if (drop.slowing) {
			drop.yspeed /= 1.1;
			drop.xspeed /= 1.1;
			if (drop.yspeed < this.PRIVATE_GRAVITY_FORCE_FACTOR_Y) {
				drop.slowing = false;
			}

		} else if (drop.skipping) {
			drop.yspeed = this.PRIVATE_GRAVITY_FORCE_FACTOR_Y;
			drop.xspeed = this.PRIVATE_GRAVITY_FORCE_FACTOR_X;
		} else {
			drop.yspeed += 1 * this.PRIVATE_GRAVITY_FORCE_FACTOR_Y * Math.floor(drop.r);
			drop.xspeed += 1 * this.PRIVATE_GRAVITY_FORCE_FACTOR_X * Math.floor(drop.r);
		}
	} else {
		drop.yspeed = this.PRIVATE_GRAVITY_FORCE_FACTOR_Y;
		drop.xspeed = this.PRIVATE_GRAVITY_FORCE_FACTOR_X;
	}

	if (this.options.gravityAngleVariance !== 0) {
		drop.xspeed += ((Math.random() * 2 - 1) * drop.yspeed * this.options.gravityAngleVariance);
	}

	drop.y += drop.yspeed;
	drop.x += drop.xspeed;

	drop.draw();
	return false;
};

/**
 * Utility function to return positive min value
 * param val1 first number
 * param val2 second number
 */
RainyDay.prototype.positiveMin = function(val1, val2) {
	var result = 0;
	if (val1 < val2) {
		if (val1 <= 0) {
			result = val2;
		} else {
			result = val1;
		}
	} else {
		if (val2 <= 0) {
			result = val1;
		} else {
			result = val2;
		}
	}
	return result <= 0 ? 1 : result;
};

/**
 * REFLECTION function: no reflection at all
 */
RainyDay.prototype.REFLECTION_NONE = function() {
	this.context.fillStyle = this.options.fillStyle;
	this.context.fill();
};

/**
 * REFLECTION function: miniature reflection (default)
 * param drop raindrop object
 */
RainyDay.prototype.REFLECTION_MINIATURE = function(drop) {
	var sx = Math.max((drop.x - this.options.reflectionDropMappingWidth) / this.options.reflectionScaledownFactor, 0);
	var sy = Math.max((drop.y - this.options.reflectionDropMappingHeight) / this.options.reflectionScaledownFactor, 0);
	var sw = this.positiveMin(this.options.reflectionDropMappingWidth * 2 / this.options.reflectionScaledownFactor, this.reflected.width - sx);
	var sh = this.positiveMin(this.options.reflectionDropMappingHeight * 2 / this.options.reflectionScaledownFactor, this.reflected.height - sy);
	var dx = Math.max(drop.x - 1.1 * drop.r, 0);
	var dy = Math.max(drop.y - 1.1 * drop.r, 0);
	this.context.drawImage(this.reflected, sx, sy, sw, sh, dx, dy, drop.r * 2, drop.r * 2);
};

/**
 * COLLISION function: default collision implementation
 * param drop one of the drops colliding
 * param collisions list of potential collisions
 */
RainyDay.prototype.COLLISION_SIMPLE = function(drop, collisions) {
	var item = collisions;
	var drop2;
	while (item != null) {
		var p = item.drop;
		if (Math.sqrt(Math.pow(drop.x - p.x, 2) + Math.pow(drop.y - p.y, 2)) < (drop.r + p.r)) {
			drop2 = p;
			break;
		}
		item = item.next;
	}

	if (!drop2) {
		return;
	}

	// rename so that we're dealing with low/high drops
	var higher,
		lower;
	if (drop.y > drop2.y) {
		higher = drop;
		lower = drop2;
	} else {
		higher = drop2;
		lower = drop;
	}

	this.clearDrop(lower);
	// force stopping the second drop
	this.clearDrop(higher, true);
	this.matrix.remove(higher);
	lower.draw();

	lower.colliding = higher;
	lower.collided = true;
};

/**
 * Resizes canvas, draws original image and applies blurring algorithm.
 */
RainyDay.prototype.prepareBackground = function() {
	this.background = document.createElement('canvas');
	this.background.width = this.canvas.width;
	this.background.height = this.canvas.height;

	this.clearbackground = document.createElement('canvas');
	this.clearbackground.width = this.canvas.width;
	this.clearbackground.height = this.canvas.height;

	var context = this.background.getContext('2d');
	context.clearRect(0, 0, this.canvas.width, this.canvas.height);

	context.drawImage(this.img, this.options.crop[0], this.options.crop[1], this.options.crop[2], this.options.crop[3], 0, 0, this.canvas.width, this.canvas.height);

	context = this.clearbackground.getContext('2d');
	context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	context.drawImage(this.img, this.options.crop[0], this.options.crop[1], this.options.crop[2], this.options.crop[3], 0, 0, this.canvas.width, this.canvas.height);

	if (!isNaN(this.options.blur) && this.options.blur >= 1) {
		this.stackBlurCanvasRGB(this.canvas.width, this.canvas.height, this.options.blur);
	}
};

/**
 * Implements the Stack Blur Algorithm (see http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html).
 * param width width of the canvas
 * param height height of the canvas
 * param radius blur radius
 */
RainyDay.prototype.stackBlurCanvasRGB = function(width, height, radius) {

	var shgTable = [
		[0, 9],
		[1, 11],
		[2, 12],
		[3, 13],
		[5, 14],
		[7, 15],
		[11, 16],
		[15, 17],
		[22, 18],
		[31, 19],
		[45, 20],
		[63, 21],
		[90, 22],
		[127, 23],
		[181, 24]
	];

	var mulTable = [
		512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512,
		454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512,
		482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456,
		437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512,
		497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328,
		320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456,
		446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335,
		329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512,
		505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405,
		399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328,
		324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271,
		268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456,
		451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388,
		385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335,
		332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292,
		289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259
	];

	radius |= 0;

	var context = this.background.getContext('2d');
	var imageData = context.getImageData(0, 0, width, height);
	var pixels = imageData.data;
	var x,
		y,
		i,
		p,
		yp,
		yi,
		yw,
		rSum,
		gSum,
		bSum,
		rOutSum,
		gOutSum,
		bOutSum,
		rInSum,
		gInSum,
		bInSum,
		pr,
		pg,
		pb,
		rbs;
	var radiusPlus1 = radius + 1;
	var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;

	var stackStart = new BlurStack();
	var stackEnd = new BlurStack();
	var stack = stackStart;
	for (i = 1; i < 2 * radius + 1; i++) {
		stack = stack.next = new BlurStack();
		if (i === radiusPlus1) {
			stackEnd = stack;
		}
	}
	stack.next = stackStart;
	var stackIn = null;
	var stackOut = null;

	yw = yi = 0;

	var mulSum = mulTable[radius];
	var shgSum;
	for (var ssi = 0; ssi < shgTable.length; ++ssi) {
		if (radius <= shgTable[ssi][0]) {
			shgSum = shgTable[ssi - 1][1];
			break;
		}
	}

	for (y = 0; y < height; y++) {
		rInSum = gInSum = bInSum = rSum = gSum = bSum = 0;

		rOutSum = radiusPlus1 * (pr = pixels[yi]);
		gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
		bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);

		rSum += sumFactor * pr;
		gSum += sumFactor * pg;
		bSum += sumFactor * pb;

		stack = stackStart;

		for (i = 0; i < radiusPlus1; i++) {
			stack.r = pr;
			stack.g = pg;
			stack.b = pb;
			stack = stack.next;
		}

		for (i = 1; i < radiusPlus1; i++) {
			p = yi + ((width - 1 < i ? width - 1 : i) << 2);
			rSum += (stack.r = (pr = pixels[p])) * (rbs = radiusPlus1 - i);
			gSum += (stack.g = (pg = pixels[p + 1])) * rbs;
			bSum += (stack.b = (pb = pixels[p + 2])) * rbs;

			rInSum += pr;
			gInSum += pg;
			bInSum += pb;

			stack = stack.next;
		}

		stackIn = stackStart;
		stackOut = stackEnd;
		for (x = 0; x < width; x++) {
			pixels[yi] = (rSum * mulSum) >> shgSum;
			pixels[yi + 1] = (gSum * mulSum) >> shgSum;
			pixels[yi + 2] = (bSum * mulSum) >> shgSum;

			rSum -= rOutSum;
			gSum -= gOutSum;
			bSum -= bOutSum;

			rOutSum -= stackIn.r;
			gOutSum -= stackIn.g;
			bOutSum -= stackIn.b;

			p = (yw + ((p = x + radius + 1) < (width - 1) ? p : (width - 1))) << 2;

			rInSum += (stackIn.r = pixels[p]);
			gInSum += (stackIn.g = pixels[p + 1]);
			bInSum += (stackIn.b = pixels[p + 2]);

			rSum += rInSum;
			gSum += gInSum;
			bSum += bInSum;

			stackIn = stackIn.next;

			rOutSum += (pr = stackOut.r);
			gOutSum += (pg = stackOut.g);
			bOutSum += (pb = stackOut.b);

			rInSum -= pr;
			gInSum -= pg;
			bInSum -= pb;

			stackOut = stackOut.next;

			yi += 4;
		}
		yw += width;
	}

	for (x = 0; x < width; x++) {
		gInSum = bInSum = rInSum = gSum = bSum = rSum = 0;

		yi = x << 2;
		rOutSum = radiusPlus1 * (pr = pixels[yi]);
		gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
		bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);

		rSum += sumFactor * pr;
		gSum += sumFactor * pg;
		bSum += sumFactor * pb;

		stack = stackStart;

		for (i = 0; i < radiusPlus1; i++) {
			stack.r = pr;
			stack.g = pg;
			stack.b = pb;
			stack = stack.next;
		}

		yp = width;

		for (i = 1; i < radiusPlus1; i++) {
			yi = (yp + x) << 2;

			rSum += (stack.r = (pr = pixels[yi])) * (rbs = radiusPlus1 - i);
			gSum += (stack.g = (pg = pixels[yi + 1])) * rbs;
			bSum += (stack.b = (pb = pixels[yi + 2])) * rbs;

			rInSum += pr;
			gInSum += pg;
			bInSum += pb;

			stack = stack.next;

			if (i < (height - 1)) {
				yp += width;
			}
		}

		yi = x;
		stackIn = stackStart;
		stackOut = stackEnd;
		for (y = 0; y < height; y++) {
			p = yi << 2;
			pixels[p] = (rSum * mulSum) >> shgSum;
			pixels[p + 1] = (gSum * mulSum) >> shgSum;
			pixels[p + 2] = (bSum * mulSum) >> shgSum;

			rSum -= rOutSum;
			gSum -= gOutSum;
			bSum -= bOutSum;

			rOutSum -= stackIn.r;
			gOutSum -= stackIn.g;
			bOutSum -= stackIn.b;

			p = (x + (((p = y + radiusPlus1) < (height - 1) ? p : (height - 1)) * width)) << 2;

			rSum += (rInSum += (stackIn.r = pixels[p]));
			gSum += (gInSum += (stackIn.g = pixels[p + 1]));
			bSum += (bInSum += (stackIn.b = pixels[p + 2]));

			stackIn = stackIn.next;

			rOutSum += (pr = stackOut.r);
			gOutSum += (pg = stackOut.g);
			bOutSum += (pb = stackOut.b);

			rInSum -= pr;
			gInSum -= pg;
			bInSum -= pb;

			stackOut = stackOut.next;

			yi += width;
		}
	}

	context.putImageData(imageData, 0, 0);

};

/**
 * Defines a new helper object for Stack Blur Algorithm.
 */
function BlurStack() {
	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.next = null;
}

/**
 * Defines a gravity matrix object which handles collision detection.
 * param x number of columns in the matrix
 * param y number of rows in the matrix
 * param r grid size
 */
function CollisionMatrix(x, y, r) {
	this.resolution = r;
	this.xc = x;
	this.yc = y;
	this.matrix = new Array(x);
	for (var i = 0; i <= (x + 5); i++) {
		this.matrix[i] = new Array(y);
		for (var j = 0; j <= (y + 5); ++j) {
			this.matrix[i][j] = new DropItem(null);
		}
	}
}
//
// /**
//  * Updates position of the given drop on the collision matrix.
//  * param drop raindrop to be positioned/repositioned
//  * param forceDelete if true the raindrop will be removed from the matrix
//  * @returns collisions if any
//  */
CollisionMatrix.prototype.update = function(drop, forceDelete) {
	if (drop.gid) {
		if (!this.matrix[drop.gmx] || !this.matrix[drop.gmx][drop.gmy]) {
			return null;
		}
		this.matrix[drop.gmx][drop.gmy].remove(drop);
		if (forceDelete) {
			return null;
		}

		drop.gmx = Math.floor(drop.x / this.resolution);
		drop.gmy = Math.floor(drop.y / this.resolution);
		if (!this.matrix[drop.gmx] || !this.matrix[drop.gmx][drop.gmy]) {
			return null;
		}
		this.matrix[drop.gmx][drop.gmy].add(drop);

		var collisions = this.collisions(drop);
		if (collisions && collisions.next != null) {
			return collisions.next;
		}
	} else {
		drop.gid = Math.random().toString(36).substr(2, 9);
		drop.gmx = Math.floor(drop.x / this.resolution);
		drop.gmy = Math.floor(drop.y / this.resolution);
		if (!this.matrix[drop.gmx] || !this.matrix[drop.gmx][drop.gmy]) {
			return null;
		}

		this.matrix[drop.gmx][drop.gmy].add(drop);
	}
	return null;
};

// /**
//  * Looks for collisions with the given raindrop.
//  * param drop raindrop to be checked
//  * @returns DropItem list of drops that collide with it
//  */
CollisionMatrix.prototype.collisions = function(drop) {
	var item = new DropItem(null);
	var first = item;

	item = this.addAll(item, drop.gmx - 1, drop.gmy + 1);
	item = this.addAll(item, drop.gmx, drop.gmy + 1);
	item = this.addAll(item, drop.gmx + 1, drop.gmy + 1);

	return first;
};
//
// /**
//  * Appends all found drop at a given location to the given item.
//  * param to item to which the results will be appended to
//  * param x x position in the matrix
//  * param y y position in the matrix
//  * @returns last discovered item on the list
//  */
CollisionMatrix.prototype.addAll = function(to, x, y) {
	if (x > 0 && y > 0 && x < this.xc && y < this.yc) {
		var items = this.matrix[x][y];
		while (items.next != null) {
			items = items.next;
			to.next = new DropItem(items.drop);
			to = to.next;
		}
	}
	return to;
};
//
// /**
//  * Removed the drop from its current position
//  * param drop to be removed
//  */
CollisionMatrix.prototype.remove = function(drop) {
	this.matrix[drop.gmx][drop.gmy].remove(drop);
};

// /**
//  * Defines a linked list item.
//  */
function DropItem(drop) {
	this.drop = drop;
	this.next = null;
}

/**
 * Adds the raindrop to the end of the list.
 * param drop raindrop to be added
 */
DropItem.prototype.add = function(drop) {
	var item = this;
	while (item.next != null) {
		item = item.next;
	}
	item.next = new DropItem(drop);
};

/**
 * Removes the raindrop from the list.
 * param drop raindrop to be removed
 */
DropItem.prototype.remove = function(drop) {
	var item = this;
	var prevItem = null;
	while (item.next != null) {
		prevItem = item;
		item = item.next;
		if (item.drop.gid === drop.gid) {
			prevItem.next = item.next;
		}
	}
};

function BlurStack() {
	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.next = null;
}


//CloudyDay Function ========================================================
//============================================================================
function cloudyDayRender(){

	// Create an array to store our particles
	var particles = [];

	// The amount of particles to render
	var particleCount = 30;

	// The maximum velocity in each direction
	var maxVelocity = 2;

	// The target frames per second (how often do we want to update / redraw the scene)
	var targetFPS = 33;

	// Set the dimensions of the canvas as variables so they can be used.
	var canvasWidth = 600;
	var canvasHeight = 400;

	// Create an image object (only need one instance)
	var imageObj = new Image();



    // Once the image has been downloaded then set the image on all of the particles
    imageObj.onload = function() {
        particles.forEach(function(particle) {
                particle.setImage(imageObj);

        });
    };

    // Once the callback is arranged then set the source of the image
    imageObj.src = "Smoke10.png";

    // A function to create a particle object.
    function Particle(context) {

        // Set the initial x and y positions
        this.x = 0;
        this.y = 0;

        // Set the initial velocity
        this.xVelocity = 0;
        this.yVelocity = 0;

        // Set the radius
        this.radius = 5;

        // Store the context which will be used to draw the particle
        this.context = context;


        // The function to draw the particle on the canvas.
        this.draw = function() {

            // If an image is set draw it
            if(this.image){
                this.context.drawImage(this.image, this.x-128, this.y-128);
                // If the image is being rendered do not draw the circle so break out of the draw function
                return;
            }
            // Draw the circle as before, with the addition of using the position and the radius from this object.
            this.context.beginPath();
            this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            this.context.fillStyle = "rgba(255, 255, 255, 0)";
            this.context.fill();
            this.context.closePath();
        };

        // Update the particle.
        this.update = function() {
            // Update the position of the particle with the addition of the velocity.
            this.x += this.xVelocity;
            this.y += this.yVelocity;

            // Check if has crossed the right edge
            if (this.x >= canvasWidth) {
                this.xVelocity = -this.xVelocity;
                this.x = canvasWidth;
            }
            // Check if has crossed the left edge
            else if (this.x <= 0) {
                this.xVelocity = -this.xVelocity;
                this.x = 0;
            }

            // Check if has crossed the bottom edge
            if (this.y >= canvasHeight) {
                this.yVelocity = -this.yVelocity;
                this.y = canvasHeight;
            }

            // Check if has crossed the top edge
            else if (this.y <= 0) {
                this.yVelocity = -this.yVelocity;
                this.y = 0;
            }
        };

        // A function to set the position of the particle.
        this.setPosition = function(x, y) {
            this.x = x;
            this.y = y;
        };

        // Function to set the velocity.
        this.setVelocity = function(x, y) {
            this.xVelocity = x;
            this.yVelocity = y;
        };

        this.setImage = function(image){
            this.image = image;
        }
    }

    // A function to generate a random number between 2 values
    function generateRandom(min, max){
        return Math.random() * (max - min) + min;
    }

    // The canvas context if it is defined.
    var context;

    // Initialise the scene and set the context if possible
    function init() {
        var canvas = document.getElementById('canvas');
        if (canvas.getContext) {

            // Set the context variable so it can be re-used
            context = canvas.getContext('2d');
						console.log(context)

            // Create the particles and set their initial positions and velocities
            for(var i=0; i < particleCount; ++i){
                var particle = new Particle(context);

                // Set the position to be inside the canvas bounds
                particle.setPosition(generateRandom(0, canvasWidth), generateRandom(0, canvasHeight));

                // Set the initial velocity to be either random and either negative or positive
                particle.setVelocity(generateRandom(-maxVelocity, maxVelocity), generateRandom(-maxVelocity, maxVelocity));
                particles.push(particle);
            }
        }
        else {
            alert("Please use a modern browser");
        }
    }

    // The function to draw the scene
    // Add background image here
    function draw() {
        // Clear the drawing surface and fill it with a black background
        // context.fillStyle = "rgba(0, 0, 0, 0.5)";
        // context.fillRect(0, 0, 600, 400);

				// var pat=context.createPattern(backgroundImage,"no-repeat");
				// context.fillRect(0,0,canvasWidth,canvasHeight);
				// context.fillStyle=pat;
				// context.fill();

				//draw Image instead of clearing background and making it black
				context.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
        // Go through all of the particles and draw them.
        particles.forEach(function(particle) {
            particle.draw();
        });
    }

    // Update the scene
    function update() {
        particles.forEach(function(particle) {
            particle.update();
        })
    }

	//INITIALIZE THE SCENE
	init()

    // If the context is set then we can draw the scene (if not then the browser does not support canvas)
    if (context) {
        setInterval(function() {
            // Update the scene before drawing
            update();

            // Draw the scene
            draw();
        }, 1000 / targetFPS);
    }
}

//SnowyDay Function =========================================================
//===========================================================================
function snowyDayRender(){
	console.log('snowy day is running')

	//canvas init
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	//canvas dimensions
  var canvasWidth = 600;
  var canvasHeight = 400;
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	//snowflake particles
	var mp = 200; //max particles
	var particles = [];
	for(var i = 0; i < mp; i++)
	{
		particles.push({
			x: Math.random()*canvasWidth, //x-coordinate
			y: Math.random()*canvasHeight, //y-coordinate
			r: Math.random()*4+1, //radius
			d: Math.random()*mp //density
		})
	}


	//Lets draw the flakes
	function draw()
	{

		ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
		ctx.beginPath();
		for(var i = 0; i < mp; i++)
		{
			var p = particles[i];
			ctx.moveTo(p.x, p.y);
			ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
		}
		ctx.fill();
		update();
	}

	//Function to move the snowflakes
	//angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
	var angle = 0;
	function update()
	{
		angle += 0.01;
		for(var i = 0; i < mp; i++)
		{
			var p = particles[i];
			//Updating X and Y coordinates
			//We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
			//Every particle has its own density which can be used to make the downward movement different for each flake
			//Lets make it more random by adding in the radius
			p.y += Math.cos(angle+p.d) + 1 + p.r/2;
			p.x += Math.sin(angle) * 2;

			//Sending flakes back from the top when it exits
			//Lets make it a bit more organic and let flakes enter from the left and right also.
			if(p.x > canvasWidth+5 || p.x < -5 || p.y > canvasHeight)
			{
				if(i%3 > 0) //66.67% of the flakes
				{
					particles[i] = {x: Math.random()*canvasWidth, y: -10, r: p.r, d: p.d};
				}
				else
				{
					//If the flake is exitting from the right
					if(Math.sin(angle) > 0)
					{
						//Enter from the left
						particles[i] = {x: -5, y: Math.random()*canvasHeight, r: p.r, d: p.d};
					}
					else
					{
						//Enter from the right
						particles[i] = {x: canvasWidth+5, y: Math.random()*canvasHeight, r: p.r, d: p.d};
					}
				}
			}
		}
	}

	//animation loop
	setInterval(draw, 33);
}

//Sunny Day function ==========================================================
//===============================================================================

function sunnyDayRender(){

	var canvasWidth = 600;
	var canvasHeight = 400;

function draw(){

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
	// for (i=1;i<4;i++){
	// 	if(i<2){
	// 	ctx.beginPath();
	// 	ctx.arc(30,30,20*i,0,Math.PI*2,true);
	// 	ctx.fillStyle = "rgba(255,255,255,0.6)";
	// 	ctx.fill()
	// } else {
	// 	ctx.beginPath();
	// 	ctx.arc(30,30,20*i,0,Math.PI*2,true);
	// 	ctx.fillStyle = "rgba(255,190,59,0.6)";
	// 	ctx.fill()
	// }
	// }
}
	//animation loop
	setInterval(draw,33)
}
