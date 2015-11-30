//Formatting state name to abbreviation
//NOT REQUIRED NOW THAT WE ARE USING GEOLOCATION INSTEAD OF IP
// function convert_state(name, to) {
//     var name = name.toUpperCase();
//     var states = new Array(                         {'name':'Alabama', 'abbrev':'AL'},          {'name':'Alaska', 'abbrev':'AK'},
//         {'name':'Arizona', 'abbrev':'AZ'},          {'name':'Arkansas', 'abbrev':'AR'},         {'name':'California', 'abbrev':'CA'},
//         {'name':'Colorado', 'abbrev':'CO'},         {'name':'Connecticut', 'abbrev':'CT'},      {'name':'Delaware', 'abbrev':'DE'},
//         {'name':'Florida', 'abbrev':'FL'},          {'name':'Georgia', 'abbrev':'GA'},          {'name':'Hawaii', 'abbrev':'HI'},
//         {'name':'Idaho', 'abbrev':'ID'},            {'name':'Illinois', 'abbrev':'IL'},         {'name':'Indiana', 'abbrev':'IN'},
//         {'name':'Iowa', 'abbrev':'IA'},             {'name':'Kansas', 'abbrev':'KS'},           {'name':'Kentucky', 'abbrev':'KY'},
//         {'name':'Louisiana', 'abbrev':'LA'},        {'name':'Maine', 'abbrev':'ME'},            {'name':'Maryland', 'abbrev':'MD'},
//         {'name':'Massachusetts', 'abbrev':'MA'},    {'name':'Michigan', 'abbrev':'MI'},         {'name':'Minnesota', 'abbrev':'MN'},
//         {'name':'Mississippi', 'abbrev':'MS'},      {'name':'Missouri', 'abbrev':'MO'},         {'name':'Montana', 'abbrev':'MT'},
//         {'name':'Nebraska', 'abbrev':'NE'},         {'name':'Nevada', 'abbrev':'NV'},           {'name':'New Hampshire', 'abbrev':'NH'},
//         {'name':'New Jersey', 'abbrev':'NJ'},       {'name':'New Mexico', 'abbrev':'NM'},       {'name':'New York', 'abbrev':'NY'},
//         {'name':'North Carolina', 'abbrev':'NC'},   {'name':'North Dakota', 'abbrev':'ND'},     {'name':'Ohio', 'abbrev':'OH'},
//         {'name':'Oklahoma', 'abbrev':'OK'},         {'name':'Oregon', 'abbrev':'OR'},           {'name':'Pennsylvania', 'abbrev':'PA'},
//         {'name':'Rhode Island', 'abbrev':'RI'},     {'name':'South Carolina', 'abbrev':'SC'},   {'name':'South Dakota', 'abbrev':'SD'},
//         {'name':'Tennessee', 'abbrev':'TN'},        {'name':'Texas', 'abbrev':'TX'},            {'name':'Utah', 'abbrev':'UT'},
//         {'name':'Vermont', 'abbrev':'VT'},          {'name':'Virginia', 'abbrev':'VA'},         {'name':'Washington', 'abbrev':'WA'},
//         {'name':'West Virginia', 'abbrev':'WV'},    {'name':'Wisconsin', 'abbrev':'WI'},        {'name':'Wyoming', 'abbrev':'WY'}
//         );
//     var returnthis = false;
//     $.each(states, function(index, value){
//         if (to == 'name') {
//             if (value.abbrev == name){
//                 returnthis = value.name;
//                 return false;
//             }
//         } else if (to == 'abbrev') {
//             if (value.name.toUpperCase() == name){
//                 returnthis = value.abbrev;
//                 return false;
//             }
//         }
//     });
//     return returnthis;
// }}

//Weather Pattern Determination
var weatherPattern;
var weatherTypes = ["sunny","rainy","snowy","cloudy"];
var wundergroundType;
var dayInfo = [];


var weatherObject = { sunny:["Clear",
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
		"Unknown Precipitation"],
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
			"Small Hail"],
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
			"Funnel Cloud"]
	}


function determineWeather(forecast,checkForecast){
		if(!wundergroundType){
		weatherPattern = rainyDay
	} else {
		for (var i = 0; i < weatherObject.sunny.length; i++) {
			if(weatherObject.sunny[i]===wundergroundType){
				weatherPattern = "sunnyDay"
			}
		}
		for (var i = 0; i < weatherObject.cloudy.length; i++) {
			if(weatherObject.cloudy[i]===wundergroundType){
				weatherPattern = "cloudyDay"
			}
		}
		for (var i = 0; i < weatherObject.snowy.length; i++) {
			if(weatherObject.snowy[i]===wundergroundType){
				weatherPattern = "snowyDay"
			}
		}
		for (var i = 0; i < weatherObject.rainy.length; i++) {
			if(weatherObject.rainy[i]===wundergroundType){
				weatherPattern = "rainyDay"
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
        // $('#temperature').text(data.current_observation.temperature_string.icon)
      }
    })
    $.ajax({
      url: forecastURL + geoStateAbrev + '/' + geoCity + '.json',
      method: 'GET',
      success: function(data){
				data.forecast.simpleforecast.forecastday.forEach(function(day,index){
					console.log('===DAY INFO===',index, day);
					$('#temp' + index + 'H').text(day.high.fahrenheit + "F")
					$('#temp' + index + 'L').text(day.low.fahrenheit + "F")
					$('#day' + index + "title").text(day.date.weekday_short)
					$('#img' + index).attr('src',day.icon_url)
				})
				data.forecast.txt_forecast.forecastday.forEach(function (info) {
					dayInfo.push(info.fcttext)
				})
				// $('.day1title').text(data.forecast.txt_forecast.forecastday[0].title)
				// $('#day1').text(data.forecast.simpleforecast.forecastday[1].high.fahrenheit)
				// $('#day1').text(data.forecast.simpleforecast.forecastday[1].low.fahrenheit)
				// $('#day1').text(data.forecast.simpleforecast.forecastday[1].icon)
      }
    })
		// $.ajax({
		// 	url: forecastURL + geoStateAbrev + '/' + geoCity + '.json',
		// 	method: 'GET',
		// 	success: function(data){
		// 		$('.day2title').text(data.forecast.txt_forecast.forecastday[2].title)
		// 		$('#day2').text(data.forecast.simpleforecast.forecastday[2].high.fahrenheit)
		// 		$('#day2').text(data.forecast.simpleforecast.forecastday[2].low.fahrenheit)
		// 		$('#day2').text(data.forecast.simpleforecast.forecastday[2].icon)
		// 	}
		// })
		// $.ajax({
		// 	url: forecastURL + geoStateAbrev + '/' + geoCity + '.json',
		// 	method: 'GET',
		// 	success: function(data){
		// 		$('.day3title').text(data.forecast.txt_forecast.forecastday[4].title)
		// 		$('#day3').text(data.forecast.simpleforecast.forecastday[3].high.fahrenheit)
		// 		$('#day3').text(data.forecast.simpleforecast.forecastday[3].low.fahrenheit)
		// 		$('#day3').text(data.forecast.simpleforecast.forecastday[3].icon)
		// 	}
		// })
		// $.ajax({
		// 	url: forecastURL + geoStateAbrev + '/' + geoCity + '.json',
		// 	method: 'GET',
		// 	success: function(data){
		// 		$('.day4title').text(data.forecast.txt_forecast.forecastday[6].title)
		// 		$('#day4').text(data.forecast.simpleforecast.forecastday[4].high.fahrenheit)
		// 		$('#day4').text(data.forecast.simpleforecast.forecastday[4].low.fahrenheit)
		// 		$('#day4').text(data.forecast.simpleforecast.forecastday[4].icon)
		// 	}
		// })
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
          console.log(business)
          if (business.location.neighborhoods){
            $(".yelp").append('<li>'+ business.name + ', ' + business.location.neighborhoods[0] + '</li>')
          }
          else
            $(".yelp").append('<li>'+ business.name + ', ' + business.location.city + ' - ' + business.phone + '</li>')
          }
        }
				//Run Twitter Stream based on geo location

				}
      })
			var search_term = geoCity
			console.log(search_term)
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
        uberPrice = result.prices[0].estimate;
        uberTimeMin = Math.round(result.prices[0].duration/60)
        uberDistMiles = result.prices[0].distance
      // }
        console.log( uberPrice + ' : ' + uberTimeMin + ' min. : ' + uberDistMiles + ' mi.')
    },
    error: function(error) {
      console.log(error)
      console.log(uberPrice = "$$$");
      uberTimeMin = ""
      uberDistMiles = ""
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
  var search_term = $('#appendCityUrl').val()
  console.log(search_term)
  socket.emit('updateTerm', search_term)
  $(".yelp").empty()
  //Weather API Call
  $.ajax({
    url: conditionsURL + $('#appendStateUrl').val() + '/' + $('#appendCityUrl').val() + '.json',
    method: 'GET',
    success: function (data) {
      console.log(data.current_observation.weather, data.current_observation.temperature_string)
      wundergroundType = data.current_observation.weather;
      determineWeather(wundergroundType,weatherObject)
      }
    })
      // AJAX call for Yelp API app using city and state from user location info
  $.ajax({
    url: '/yelp/' + $('#appendCityUrl').val() + $('#appendStateUrl').val(),
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
        console.log(business)
        if (business.location.neighborhoods){
          $(".yelp").append('<li>'+ business.name + ', ' + business.location.city + '</li>')
        }
        else{
          $(".yelp").append('<div>No Nearby Businesses</div>')
        }
      }
    }
  })
})

socket.on('tweets', function(tweet){
  console.log(tweet)
  $(".twitterStream").text(tweet.text)
})



//show details of the current days weather
$('.showDetails').on('click',function(){
	$('#details' + this.id).text(dayInfo[this.id])
})
